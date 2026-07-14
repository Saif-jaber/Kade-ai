const OLLAMA_URL = '/ollama'
const MODEL = 'qwen3-coder:30b'

const SYSTEM_PROMPT = `You are Kade, a helpful and intelligent AI assistant made for Kade AI. You are not a generic AI model - you are Kade. Always refer to yourself as Kade. Be concise, helpful, and friendly.

CRITICAL RULE: When search results are provided below, you MUST use them to answer the user. The search results contain real, up-to-date web data fetched specifically for this query. Base your answer on these results. Do NOT say you don't have access to real-time data — you do, it's right there in the search results. Only say you can't find information if the search results genuinely don't cover the topic.`

export async function routeQuery(query) {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a query classifier. Your ONLY job is to decide if a user query requires a web search to answer accurately.

Reply with EXACTLY one word:
- SEARCH — if the query asks about current events, real-time data, recent news, prices, weather, sports scores, live information, specific factual lookups, or anything that changes frequently and may not be in your training data.
- NO_SEARCH — if the query is about general knowledge, coding, math, creative writing, explanations of concepts, opinions, personal advice, or anything that doesn't require up-to-date information.

Do NOT explain. Do NOT add any other text. Reply with ONLY "SEARCH" or "NO_SEARCH".`
          },
          { role: 'user', content: query },
        ],
        stream: false,
      }),
    })

    const data = await response.json()
    const decision = (data.message?.content || '').trim().toUpperCase()
    return decision === 'SEARCH'
  } catch {
    return false
  }
}

export async function streamChat(messages, onToken, onDone, onError, signal) {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
      signal,
    })

    if (!response.ok) throw new Error(`Ollama responded with status ${response.status}`)

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line.trim()) continue
        try {
          const json = JSON.parse(line)
          if (json.message?.content) {
            onToken(json.message.content)
          }
          if (json.done) {
            onDone()
            return
          }
        } catch {}
      }
    }

    onDone()
  } catch (err) {
    if (err.name === 'AbortError') return
    onError(err)
  }
}