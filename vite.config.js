import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
          const searchRes = await fetch(
            `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`,
            {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              },
            }
          )
          const html = await searchRes.text()

          const results = []
          const resultRegex = /class="result__a"[^>]*href="[^"]*"[^>]*>([\s\S]*?)<\/a>[\s\S]*?class="result__snippet"[^>]*>([\s\S]*?)<\/span>/g
          let match

          while ((match = resultRegex.exec(html)) !== null && results.length < 5) {
            const title = match[1].replace(/<[^>]+>/g, '').trim()
            const snippet = match[2].replace(/<[^>]+>/g, '').trim()
            if (title && snippet) {
              results.push({ title, snippet })
            }
          }

          if (results.length === 0) {
            const simpleRegex = /class="result__a"[^>]*>([\s\S]*?)<\/a>/g
            while ((match = simpleRegex.exec(html)) !== null && results.length < 5) {
              const title = match[1].replace(/<[^>]+>/g, '').trim()
              if (title) {
                results.push({ title, snippet: '' })
              }
            }
          }

          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ results }))
        } catch (err) {
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