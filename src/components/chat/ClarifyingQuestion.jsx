import { useState } from 'react'
import { Check } from 'lucide-react'
import { useChat } from '../../context/ChatContext.jsx'
import { cn } from '../../utils/helpers.js'

export default function ClarifyingQuestion({ question, options, multiSelect = false }) {
  const [selected, setSelected] = useState(multiSelect ? [] : null)
  const [submitted, setSubmitted] = useState(false)
  const { sendMessage } = useChat()

  const handleSelect = (option) => {
    if (submitted) return

    if (multiSelect) {
      setSelected(prev =>
        prev.includes(option)
          ? prev.filter(s => s !== option)
          : [...prev, option]
      )
    } else {
      setSelected(option)
    }
  }

  const handleSubmit = () => {
    if (!selected || (multiSelect && selected.length === 0)) return
    setSubmitted(true)

    const answer = Array.isArray(selected) ? selected.join(', ') : selected
    sendMessage(answer)
  }

  const isSelected = (option) => {
    if (Array.isArray(selected)) {
      return selected.includes(option)
    }
    return selected === option
  }

  return (
    <div className="my-4 rounded-2xl border border-[#E5E1DA] dark:border-brand-700/80 bg-white dark:bg-brand-900 overflow-hidden animate-scale-in shadow-sm">
      <div className="px-4 py-3 border-b border-[#E5E1DA] dark:border-brand-800">
        <p className="text-sm font-medium text-[#2D3436] dark:text-brand-200">
          {question}
        </p>
      </div>

      <div className="p-3 space-y-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            disabled={submitted}
            className={cn(
              'w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm text-left transition-all duration-150 cursor-pointer',
              isSelected(option)
                ? 'bg-[#F0EDE7] dark:bg-brand-900/20 border border-[#0D9488] dark:border-brand-700/50 text-[#2D3436] dark:text-brand-300 shadow-sm shadow-brand-200/30 dark:shadow-brand-900/20'
                : 'bg-[#F0EDE7] dark:bg-brand-800/40 border border-transparent hover:bg-[#EDEAE4] dark:hover:bg-brand-800 text-[#2D3436] dark:text-brand-300',
              submitted && !isSelected(option) && 'opacity-40',
            )}
          >
            <div className={cn(
              'flex-shrink-0 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-150',
              isSelected(option)
                ? 'bg-[#0D9488] border-[#0D9488] scale-110'
                : 'border-[#E5E1DA] dark:border-brand-600'
            )}>
              {isSelected(option) && (
                <Check className="w-3 h-3 text-white" />
              )}
            </div>
            {option}
          </button>
        ))}
      </div>

      {!submitted && (
        <div className="px-3 pb-3">
          <button
            onClick={handleSubmit}
            disabled={!selected || (multiSelect && selected.length === 0)}
            className="w-full px-4 py-2.5 rounded-xl bg-[#0D9488] hover:bg-[#0B8579] disabled:bg-[#E5E1DA] dark:disabled:bg-brand-800 text-white text-sm font-medium disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-150 cursor-pointer shadow-sm shadow-[#0D9488]/20 disabled:shadow-none"
          >
            {multiSelect ? 'Confirm selection' : 'Continue'}
          </button>
        </div>
      )}
    </div>
  )
}
