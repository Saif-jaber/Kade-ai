import { memo } from 'react'
import { motion } from 'framer-motion'

function ThinkingProgress({ progress = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="mt-2 overflow-hidden"
    >
      <div className="h-1 rounded-full bg-[#E5E1DA] dark:bg-brand-800 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#0D9488] to-[#76ABAE] relative overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 thinking-shimmer" />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default memo(ThinkingProgress)
