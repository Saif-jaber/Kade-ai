import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const OLLAMA_URL = 'http://localhost:11434'
const OLLAMA_MODEL = 'qwen3-coder:30b'

async function refineQuery(query) {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          {
            role: 'system',
            content: `Transform the user's conversational question into a short, effective web search query (2-6 words). Remove filler words, questions, and conversational phrasing. Output ONLY the search query, nothing else.

Examples:
"what is the soonest football match coming up" → "next football match schedule"
"how much does the iphone 16 cost right now" → "iphone 16 price 2026"
"whats the weather like in london today" → "london weather today"
"who won the last election in france" → "france election results 2027"
"tell me about the latest ai news" → "latest artificial intelligence news"`
          },
          { role: 'user', content: query },
        ],
        stream: false,
      }),
    })
    const data = await res.json()
    return (data.message?.content || '').trim().replace(/^["']|["']$/g, '') || query
  } catch {
    return query
  }
}

function searchPlugin() {
  return {
    name: 'search-proxy',
    configureServer(server) {
      server.middlewares.use('/ollama-search', async (req, res) => {
        const url = new URL(req.url, 'http://localhost')
        const query = url.searchParams.get('q')

        if (!query) {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ results: [] }))
          return
        }

        try {
          const searchQuery = await refineQuery(query)
          console.log(`[Router] Original: "${query}" → Search: "${searchQuery}"`)

          const searchRes = await fetch(
            `http://localhost:8080/search?q=${encodeURIComponent(searchQuery)}&categories=general&language=en`,
            { headers: { 'Accept': 'text/html,application/json' } }
          )
          const text = await searchRes.text()

          let results = []

          try {
            const data = JSON.parse(text)
            results = (data.results || [])
              .filter(r => r.content && r.content.trim().length > 20)
              .slice(0, 7)
              .map(r => ({ title: r.title || '', snippet: r.content || '', url: r.url || '' }))
          } catch {
            const resultRegex = /<article[^>]*>[\s\S]*?<h3[^>]*>([\s\S]*?)<\/h3>[\s\S]*?<p[^>]*class="[^"]*result-content[^"]*"[^>]*>([\s\S]*?)<\/p>/g
            let match
            while ((match = resultRegex.exec(text)) !== null && results.length < 7) {
              const title = match[1].replace(/<[^>]+>/g, '').trim()
              const snippet = match[2].replace(/<[^>]+>/g, '').trim()
              if (title && snippet && snippet.length > 20) {
                results.push({ title, snippet, url: '' })
              }
            }

            if (results.length === 0) {
              const altRegex = /<h3[^>]*>\s*<a[^>]*>([\s\S]*?)<\/a>\s*<\/h3>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/g
              while ((match = altRegex.exec(text)) !== null && results.length < 7) {
                const title = match[1].replace(/<[^>]+>/g, '').trim()
                const snippet = match[2].replace(/<[^>]+>/g, '').trim()
                if (title && snippet && snippet.length > 20) {
                  results.push({ title, snippet, url: '' })
                }
              }
            }
          }

          console.log(`[SearXNG] ${results.length} results`)
          results.forEach((r, i) => console.log(`  [${i + 1}] ${r.title}\n      ${r.snippet.slice(0, 100)}...`))

          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ results, refinedQuery: searchQuery }))
        } catch (err) {
          console.error('[SearXNG Error]', err.message)
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ results: [], error: err.message }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), searchPlugin()],
  server: {
    proxy: {
      '/ollama': {
        target: 'http://localhost:11434',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ollama/, ''),
      },
    },
  },
})