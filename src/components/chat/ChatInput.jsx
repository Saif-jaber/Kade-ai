import { useState, useRef, useEffect, useCallback } from 'react'
import { ArrowUp, Square, Plus, X } from 'lucide-react'
import { useChat } from '../../context/ChatContext.jsx'

export default function ChatInput() {
  const [input, setInput] = useState('')
  const [files, setFiles] = useState([])
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)
  const { sendMessage, stopStreaming, isStreaming } = useChat()

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = Math.min(scrollHeight, 200) + 'px'
    }
  }, [input])

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed || isStreaming) return
    sendMessage(trimmed)
    setInput('')
    setFiles([])
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [input, isStreaming, sendMessage])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles(prev => [...prev, ...selectedFiles])
  }

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="border-t border-transparent px-3 sm:px-4 py-2 sm:py-3 flex-shrink-0">
      <div className="max-w-3xl mx-auto">
        {/* Pill-shaped input container */}
        <div
          className={`
            rounded-2xl
            bg-white dark:bg-brand-800/50
            border border-[#E5E1DA] dark:border-brand-700/60
            shadow-sm
            overflow-hidden
            transition-all duration-200
          `}
        >
          {/* Attached files */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 px-4 pt-2.5 pb-0.5">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDEAE4] dark:bg-brand-700/50 text-sm"
                >
                  <span className="text-[#4B5563] dark:text-brand-200 truncate max-w-[120px]">
                    {file.name}
                  </span>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-0.5 rounded-full hover:bg-[#E5E1DA] dark:hover:bg-brand-600 transition-colors cursor-pointer"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="w-3 h-3 text-[#6B7280] dark:text-brand-400" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Text input area */}
          <div className="p-0">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Kade AI..."
              disabled={isStreaming}
              rows={1}
              className="w-full resize-none bg-transparent outline-none text-sm text-[#2D3436] dark:text-brand-100 placeholder-[#9CA3AF] dark:placeholder-brand-500 leading-relaxed disabled:opacity-50 min-h-[40px] max-h-[200px] overflow-y-auto scrollbar-thin px-4 pt-2.5 pb-0 caret-[#2D3436] dark:caret-white"
            />
          </div>

          {/* Bottom toolbar with add files and send button */}
          <div className="flex items-center justify-between px-3 pb-2 pt-0">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-1.5 py-1 rounded-full text-xs font-medium
                text-[#6B7280] dark:text-brand-400
                hover:bg-[#EDEAE4] dark:hover:bg-brand-700/50
                hover:text-[#4B5563] dark:hover:text-brand-200
                active:scale-95
                transition-all duration-150 cursor-pointer"
              aria-label="Attach file"
            >
              <Plus className="w-4 h-4" />
              <span>Add files</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Send/Stop button */}
            {isStreaming ? (
              <button
                onClick={stopStreaming}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#EDEAE4] dark:bg-brand-700 hover:bg-[#E5E1DA] dark:hover:bg-brand-600 active:scale-95 transition-all duration-150 cursor-pointer"
                aria-label="Stop generating"
              >
                <Square className="w-3.5 h-3.5 text-[#0D9488] dark:text-brand-300" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!input.trim()}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#0D9488] hover:bg-[#0B8579] disabled:bg-[#E5E1DA] dark:disabled:bg-brand-700 disabled:cursor-not-allowed active:scale-95 transition-all duration-150 cursor-pointer shadow-sm shadow-[#0D9488]/20 disabled:shadow-none"
                aria-label="Send message"
              >
                <ArrowUp className="w-4 h-4 text-white" strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-[11px] text-[#9CA3AF] dark:text-brand-600 mt-2">
          Kade AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  )
}
