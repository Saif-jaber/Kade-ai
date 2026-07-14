export async function searchWeb(query) {
  try {
    const response = await fetch(`/ollama-search?q=${encodeURIComponent(query)}`)
    const data = await response.json()
    return { results: data.results || [], refinedQuery: data.refinedQuery || query }
  } catch {
    return { results: [], refinedQuery: query }
  }
}