import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'
import { STEP_ICONS, STEP_COLORS } from './types.js'
import ThinkingProgress from './ThinkingProgress.jsx'

function StepIcon({ type, status }) {
  const Icon = STEP_ICONS[type] || STEP_ICONS.thinking
  const colors = STEP_COLORS[status]

  return (
    <motion.div
      layout
      className={`
        relative z-10 flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center
        ${colors.bg}
        transition-colors duration-300
      `}
    >
      <AnimatePresence mode="wait">
        {status === 'active' && (
          <motion.div
            key="spinner"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <Loader2 className={`w-3.5 h-3.5 ${colors.icon} animate-spin`} />
          </motion.div>
        )}
        {status === 'completed' && (
          <motion.div
            key="check"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2, type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Check className={`w-3.5 h-3.5 ${colors.icon}`} strokeWidth={2.5} />
          </motion.div>
        )}
        {status === 'pending' && (
          <motion.div
            key="dot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Icon className={`w-3.5 h-3.5 ${colors.icon}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ThinkingStep({ step, index, isLast }) {
  const isActive = step.status === 'active'
  const isCompleted = step.status === 'completed'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="relative"
    >
      <div className="flex items-start gap-2.5">
        <div className="flex flex-col items-center">
          <StepIcon type={step.type} status={step.status} />
          {!isLast && (
            <div className="relative w-px flex-1 min-h-[20px] my-1">
              <div className="absolute inset-0 bg-[#E5E1DA] dark:bg-brand-700/40" />
              {isCompleted && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="absolute inset-0 bg-[#0D9488]/20 dark:bg-brand-400/20 origin-top"
                />
              )}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 pb-3">
          <div className="flex items-center gap-2">
            <span
              className={`
                text-[13px] leading-tight
                ${isActive
                  ? 'text-[#2D3436] dark:text-brand-100 font-medium'
                  : isCompleted
                    ? 'text-[#6B7280] dark:text-brand-400'
                    : 'text-[#9CA3AF] dark:text-brand-500'
                }
                transition-colors duration-300
              `}
            >
              {step.title}
            </span>
            {step.subtitle && (
              <span className="text-[11px] text-[#9CA3AF] dark:text-brand-500 truncate">
                {step.subtitle}
              </span>
            )}
          </div>

          <AnimatePresence>
            {isActive && step.progress !== undefined && (
              <ThinkingProgress progress={step.progress} />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {step.children && step.children.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-1.5 space-y-1">
                  {step.children.map((child, i) => (
                    <motion.div
                      key={child.id || i}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                      className="flex items-center gap-1.5"
                    >
                      <div className="w-1 h-1 rounded-full bg-[#D1D5DB] dark:bg-brand-600 flex-shrink-0" />
                      <span className="text-[12px] text-[#9CA3AF] dark:text-brand-500 truncate">
                        {child.title}
                      </span>
                      {child.status === 'active' && (
                        <Loader2 className="w-2.5 h-2.5 text-[#0D9488] dark:text-brand-400 animate-spin flex-shrink-0" />
                      )}
                      {child.status === 'completed' && (
                        <Check className="w-2.5 h-2.5 text-[#0D9488] dark:text-brand-400 flex-shrink-0" strokeWidth={2.5} />
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default memo(ThinkingStep)
