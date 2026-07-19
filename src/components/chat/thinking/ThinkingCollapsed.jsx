import { memo } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Sparkles } from 'lucide-react'

function ThinkingCollapsed({ steps, elapsed, onExpand }) {
  const completedCount = steps.filter(s => s.status === 'completed').length
  const summary = steps
    .filter(s => s.status === 'completed')
    .map(s => s.title)
    .join(' \u00B7 ')

  return (
    <motion.button
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={onExpand}
      className="flex items-center gap-2 w-full text-left px-4 py-2.5 cursor-pointer
        hover:bg-[#F0EDE7]/50 dark:hover:bg-brand-800/30
        transition-colors duration-150 rounded-b-xl group"
    >
      <Sparkles className="w-3.5 h-3.5 text-[#0D9488] dark:text-brand-400 flex-shrink-0" />
      <span className="text-[13px] text-[#6B7280] dark:text-brand-400 truncate flex-1">
        {completedCount} steps \u00B7 {summary}
      </span>
      <span className="text-[11px] text-[#9CA3AF] dark:text-brand-500 font-mono tabular-nums flex-shrink-0">
        {elapsed}
      </span>
      <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-brand-500 flex-shrink-0
        transition-transform duration-200 group-hover:text-[#6B7280] dark:group-hover:text-brand-400" />
    </motion.button>
  )
}

export default memo(ThinkingCollapsed)
