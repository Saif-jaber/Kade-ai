import { ThinkingCard } from './thinking/index.js'

export default function ThinkingPanel({ steps, isComplete }) {
  return <ThinkingCard steps={steps} isComplete={isComplete} />
}
