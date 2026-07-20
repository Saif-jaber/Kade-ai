import { memo } from 'react'
import { motion } from 'framer-motion'

function ThinkingCollapsed({ steps, elapsed, onExpand, isActive }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: -2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={onExpand}
      className="flex items-center gap-2 w-full text-left px-3 py-1.5 rounded-lg cursor-pointer
        hover:bg-[#F0EDE7]/50 dark:hover:bg-brand-800/20
        transition-colors duration-150 group"
      aria-label="Show processing details"
    >
      {isActive ? (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-1.5 h-1.5 rounded-full bg-[#0D9488] dark:bg-brand-400 flex-shrink-0"
        />
      ) : (
        <svg className="w-3 h-3 text-[#0D9488]/40 dark:text-brand-400/40 flex-shrink-0" viewBox="0 0 16 16" fill="none">
          <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      <span className="text-[11px] text-[#9CA3AF] dark:text-brand-500 truncate flex-1">
        {isActive ? 'Processing' : 'Done'} in{' '}
        <span className="font-mono tabular-nums">{elapsed}</span>
      </span>

      <svg
        className="w-3 h-3 text-[#D1D5DB] dark:text-brand-600 flex-shrink-0
          transition-transform duration-200 group-hover:text-[#9CA3AF] dark:group-hover:text-brand-500
          group-hover:rotate-[-90deg]"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path d="M4 10L8 6L12 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.button>
  )
}

export default memo(ThinkingCollapsed)
