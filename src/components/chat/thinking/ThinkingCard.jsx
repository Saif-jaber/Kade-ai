import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ThinkingHeader from './ThinkingHeader.jsx'
import ThinkingTimeline from './ThinkingTimeline.jsx'
import ThinkingCollapsed from './ThinkingCollapsed.jsx'
import { useThinking } from './useThinking.js'

export default function ThinkingCard({ steps, isComplete }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [autoCollapsed, setAutoCollapsed] = useState(false)
  const isActive = !isComplete && steps.length > 0
  const { formatted, freeze, reset } = useThinking(isActive)

  useEffect(() => {
    if (isComplete && !autoCollapsed) {
      freeze()
      const timer = setTimeout(() => {
        setIsExpanded(false)
        setAutoCollapsed(true)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [isComplete, autoCollapsed, freeze])

  useEffect(() => {
    if (!isComplete) {
      reset()
      setIsExpanded(true)
      setAutoCollapsed(false)
    }
  }, [isComplete, reset])

  const handleExpand = useCallback(() => {
    setIsExpanded(true)
  }, [])

  const handleCollapse = useCallback(() => {
    setIsExpanded(false)
  }, [])

  if (steps.length === 0) return null

  const displayTime = isComplete ? formatted : formatted

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="rounded-xl border border-[#E5E1DA] dark:border-brand-700/50
        bg-white dark:bg-brand-900/80
        shadow-sm dark:shadow-black/20
        overflow-hidden
        backdrop-blur-sm"
      role="region"
      aria-label={isActive ? 'AI is working' : 'AI work complete'}
    >
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <ThinkingHeader elapsed={displayTime} isActive={isActive} />
              {!isActive && autoCollapsed && (
                <button
                  onClick={handleCollapse}
                  className="mr-4 text-[11px] text-[#9CA3AF] dark:text-brand-500 hover:text-[#6B7280] dark:hover:text-brand-400 transition-colors cursor-pointer"
                  aria-label="Collapse thinking steps"
                >
                  Collapse
                </button>
              )}
            </div>
            <ThinkingTimeline steps={steps} />
          </motion.div>
        ) : (
          <ThinkingCollapsed
            key="collapsed"
            steps={steps}
            elapsed={displayTime}
            onExpand={handleExpand}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
