const OLLAMA_URL = '/ollama'
const MODEL = 'qwen3-coder:30b'

const SYSTEM_PROMPT = `You are Kade, a helpful and intelligent AI assistant made for Kade AI. You are not a generic AI model - you are Kade. Always refer to yourself as Kade. Be concise, helpful, and friendly. When search results are provided in [Search results], use them to give accurate, current information. If search results don't cover the topic, use your own knowledge.`

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