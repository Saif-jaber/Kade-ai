import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ThinkingCollapsed from './ThinkingCollapsed.jsx'
import { useThinking } from './useThinking.js'

function PipelineStep({ step, isLast, isExpanded }) {
  const isActive = step.status === 'active'
  const isCompleted = step.status === 'completed'

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, x: -4 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-1.5 flex-shrink-0"
      >
        {isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-1.5 h-1.5 rounded-full bg-[#0D9488] dark:bg-brand-400 animate-pulse flex-shrink-0"
          />
        )}
        {isCompleted && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="w-3 h-3 text-[#0D9488]/40 dark:text-brand-400/40 flex-shrink-0"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        )}
        <span
          className={`
            ${isExpanded ? 'text-[12px]' : 'text-[11px]'}
            ${isActive
              ? 'text-[#2D3436] dark:text-brand-100'
              : isCompleted
                ? 'text-[#9CA3AF] dark:text-brand-500'
                : 'text-[#D1D5DB] dark:text-brand-600'
            }
            transition-colors duration-300 whitespace-nowrap
          `}
        >
          {step.title}
        </span>
      </motion.div>
      {!isLast && (
        <svg className="w-2.5 h-2.5 text-[#D1D5DB] dark:text-brand-600 flex-shrink-0" viewBox="0 0 16 16" fill="none">
          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </>
  )
}

export default function ThinkingCard({ steps, isComplete }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [autoCollapsed, setAutoCollapsed] = useState(false)
  const isActive = !isComplete && steps.length > 0
  const { formatted, freeze, reset } = useThinking(isActive)

  useEffect(() => {
    if (isComplete && !autoCollapsed) {
      freeze()
      const timer = setTimeout(() => {
        setIsExpanded(false)
        setAutoCollapsed(true)
      }, 1200)
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

  const handleToggle = useCallback(() => {
    setIsExpanded(prev => !prev)
  }, [])

  if (steps.length === 0) return null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      role="region"
      aria-label={isActive ? 'AI is processing' : 'AI processing complete'}
    >
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div
              onClick={autoCollapsed ? handleToggle : undefined}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg
                bg-[#F0EDE7]/50 dark:bg-brand-800/20
                ${autoCollapsed ? 'cursor-pointer hover:bg-[#EDEAE4]/70 dark:hover:bg-brand-800/30' : ''}
                transition-colors duration-150
              `}
            >
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {isActive ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-1.5 h-1.5 rounded-full bg-[#0D9488] dark:bg-brand-400"
                  />
                ) : (
                  <svg className="w-3 h-3 text-[#0D9488]/50 dark:text-brand-400/50" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <span className="text-[11px] text-[#9CA3AF] dark:text-brand-500 font-medium uppercase tracking-wider">
                  {isActive ? 'Processing' : 'Done'}
                </span>
              </div>

              <div className="w-px h-3 bg-[#E5E1DA] dark:bg-brand-700/50 flex-shrink-0" />

              <div className="flex items-center gap-1.5 flex-1 min-w-0 overflow-hidden">
                {steps.map((step, i) => (
                  <PipelineStep
                    key={step.id}
                    step={step}
                    isLast={i === steps.length - 1}
                    isExpanded
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 ml-1">
                <span className="text-[10px] text-[#D1D5DB] dark:text-brand-600 font-mono tabular-nums">
                  {formatted}
                </span>
                {autoCollapsed && (
                  <svg className="w-3 h-3 text-[#D1D5DB] dark:text-brand-600" viewBox="0 0 16 16" fill="none">
                    <path d="M4 10L8 6L12 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <ThinkingCollapsed
            key="collapsed"
            steps={steps}
            elapsed={formatted}
            onExpand={handleToggle}
            isActive={isActive}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
