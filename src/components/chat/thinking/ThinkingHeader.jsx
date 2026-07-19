import { memo } from 'react'
import { Sparkles } from 'lucide-react'

function ThinkingHeader({ elapsed, isActive }) {
  return (
    <div className="flex items-center gap-2 px-4 pt-3 pb-1">
      <div className="flex items-center justify-center w-5 h-5">
        <Sparkles className={`w-3.5 h-3.5 ${isActive ? 'text-[#0D9488] dark:text-brand-400 animate-pulse' : 'text-[#9CA3AF] dark:text-brand-500'}`} />
      </div>
      <span className="text-[13px] font-medium text-[#2D3436] dark:text-brand-100">
        {isActive ? 'Working' : 'Finished'}
      </span>
      <span className="text-[11px] text-[#9CA3AF] dark:text-brand-500 font-mono tabular-nums">
        {elapsed}
      </span>
    </div>
  )
}

export default memo(ThinkingHeader)
