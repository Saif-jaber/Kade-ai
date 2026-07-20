import { memo } from 'react'
import { motion } from 'framer-motion'

function ThinkingStep({ step, index }) {
  const isActive = step.status === 'active'
  const isCompleted = step.status === 'completed'

  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="flex items-center gap-1.5"
    >
      {isActive && (
        <div className="w-1.5 h-1.5 rounded-full bg-[#0D9488] dark:bg-brand-400 animate-pulse flex-shrink-0" />
      )}
      {isCompleted && (
        <svg className="w-3 h-3 text-[#0D9488]/40 dark:text-brand-400/40 flex-shrink-0" viewBox="0 0 16 16" fill="none">
          <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      <span
        className={`
          text-[12px]
          ${isActive
            ? 'text-[#2D3436] dark:text-brand-100'
            : isCompleted
              ? 'text-[#9CA3AF] dark:text-brand-500'
              : 'text-[#D1D5DB] dark:text-brand-600'
          }
          transition-colors duration-300
        `}
      >
        {step.title}
      </span>
    </motion.div>
  )
}

export default memo(ThinkingStep)
