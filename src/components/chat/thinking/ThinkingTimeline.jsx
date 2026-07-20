import { memo } from 'react'
import { AnimatePresence } from 'framer-motion'
import ThinkingStep from './ThinkingStep.jsx'

function ThinkingTimeline({ steps }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <AnimatePresence initial={false}>
        {steps.map((step, index) => (
          <ThinkingStep
            key={step.id}
            step={step}
            index={index}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default memo(ThinkingTimeline)
