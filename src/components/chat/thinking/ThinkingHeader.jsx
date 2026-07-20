import { memo } from 'react'

function ThinkingHeader({ elapsed, isActive }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5">
      <span className="text-[11px] text-[#9CA3AF] dark:text-brand-500">
        {isActive ? 'Processing' : 'Done'} in {elapsed}
      </span>
    </div>
  )
}

export default memo(ThinkingHeader)
