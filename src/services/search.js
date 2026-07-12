export function needsSearch(query) {
  const lower = query.toLowerCase()
  const keywords = [
    'current', 'today', 'latest', 'recent', 'now', 'happening', 'live',
    'price', 'cost', 'stock', 'weather', 'temperature',
    'score', 'match', 'game', 'schedule', 'result',
    'news', 'update', 'announce', 'release',
    'who won', 'who is', 'what is the', 'when is',
    '2024', '2025', '2026', '2027', '2028',
    'world cup', 'election', 'war', 'crisis',
    'trending', 'viral', 'popular', 'soonest', 'next',
  ]
  return keywords.some(kw => lower.includes(kw))
}

export async function searchWeb(query) {
  try {
    const response = await fetch(`/ollama-search?q=${encodeURIComponent(query)}`)
    const data = await response.json()
    return data.results || []
  } catch {
    return []
  }
}