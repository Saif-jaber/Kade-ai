let counter = 0

export function v4Helper() {
  counter++
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).slice(2, 10)
  return `${timestamp}-${random}-${counter}`
}

export function formatDateGroup(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays <= 7) return 'Previous 7 days'
  if (diffDays <= 30) return 'Previous 30 days'
  return 'Older'
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
