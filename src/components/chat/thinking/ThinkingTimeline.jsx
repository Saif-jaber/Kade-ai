import { memo } from 'react'
import { AnimatePresence } from 'framer-motion'
import ThinkingStep from './ThinkingStep.jsx'

function ThinkingTimeline({ steps }) {
  return (
    <div className="px-4 pt-3 pb-1">
      <AnimatePresence initial={false}>
        {steps.map((step, index) => (
          <ThinkingStep
            key={step.id}
            step={step}
            index={index}
            isLast={index === steps.length - 1}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default memo(ThinkingTimeline)
