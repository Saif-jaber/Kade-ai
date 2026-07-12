import { CheckCircle2, Loader2 } from 'lucide-react'

export default function ThinkingPanel({ steps, isComplete }) {
  return (
    <div className="rounded-2xl thinking-gradient border border-[#E5E1DA] dark:border-brand-800/25 overflow-hidden animate-fade-in shadow-sm">
      <div className="px-4 py-3">
        <div className="flex items-center gap-0 overflow-x-auto">
          {steps.map((step, index) => {
            const isDone = isComplete || index < steps.length - 1
            const isLast = index === steps.length - 1

            return (
              <div
                key={step.id}
                className="flex items-center gap-0 animate-slide-up flex-shrink-0"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="flex items-center gap-2 px-2.5 py-1">
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488] drop-shadow-sm flex-shrink-0" />
                  ) : (
                    <Loader2 className="w-3.5 h-3.5 text-[#0D9488] animate-spin flex-shrink-0" />
                  )}
                  <span className="text-[12px] text-[#0D9488] dark:text-brand-400 font-medium whitespace-nowrap">
                    {step.label}
                  </span>
                </div>
                {!isLast && (
                  <div className="w-6 h-px bg-[#0D9488]/40 dark:bg-brand-500/40 flex-shrink-0" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}