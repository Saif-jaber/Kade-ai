import { useState } from 'react'
import { Copy, Check, ThumbsUp, ThumbsDown, Share2, RefreshCw, MoreHorizontal } from 'lucide-react'

export default function MessageActions({ content, onRegenerate }) {
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(null)
  const [showMore, setShowMore] = useState(false)

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-1 mt-3">
      {/* Copy */}
      <button
        onClick={() => handleCopy(content)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium
          text-[#6B7280] hover:text-[#2D3436] hover:bg-[#E5E1DA]
          dark:text-brand-400 dark:hover:text-white dark:hover:bg-brand-800/80
          transition-all duration-150 cursor-pointer"
        aria-label="Copy message"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-[#0D9488]" />
            <span className="text-[#0D9488]">Copied</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>Copy</span>
          </>
        )}
      </button>

      {/* Like */}
      <button
        onClick={() => setLiked(liked === 'up' ? null : 'up')}
        className={`p-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
          liked === 'up'
            ? 'text-[#0D9488] bg-[#EDEAE4] dark:bg-brand-800/60'
            : 'text-[#6B7280] hover:text-[#2D3436] hover:bg-[#E5E1DA] dark:text-brand-400 dark:hover:text-white dark:hover:bg-brand-800/80'
        }`}
        aria-label="Like response"
      >
        <ThumbsUp className="w-3.5 h-3.5" />
      </button>

      {/* Dislike */}
      <button
        onClick={() => setLiked(liked === 'down' ? null : 'down')}
        className={`p-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
          liked === 'down'
            ? 'text-red-400 bg-red-900/20'
            : 'text-[#6B7280] hover:text-[#2D3436] hover:bg-[#E5E1DA] dark:text-brand-400 dark:hover:text-white dark:hover:bg-brand-800/80'
        }`}
        aria-label="Dislike response"
      >
        <ThumbsDown className="w-3.5 h-3.5" />
      </button>

      {/* Share */}
      <button
        onClick={() => setShowMore(!showMore)}
        className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#2D3436] hover:bg-[#E5E1DA]
          dark:text-brand-400 dark:hover:text-white dark:hover:bg-brand-800/80
          transition-all duration-150 cursor-pointer"
        aria-label="Share options"
      >
        <Share2 className="w-3.5 h-3.5" />
      </button>

      {/* Regenerate */}
      {onRegenerate && (
        <button
          onClick={onRegenerate}
          className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#2D3436] hover:bg-[#E5E1DA]
            dark:text-brand-400 dark:hover:text-white dark:hover:bg-brand-800/80
            transition-all duration-150 cursor-pointer"
          aria-label="Regenerate response"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      )}

      {/* More options */}
      <button
        onClick={() => setShowMore(!showMore)}
        className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#2D3436] hover:bg-[#E5E1DA]
          dark:text-brand-400 dark:hover:text-white dark:hover:bg-brand-800/80
          transition-all duration-150 cursor-pointer"
        aria-label="More options"
      >
        <MoreHorizontal className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
