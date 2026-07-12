import { useRef, useEffect, useState } from 'react'
import { useChat } from '../../context/ChatContext.jsx'
import MessageList from './MessageList.jsx'
import ChatInput from './ChatInput.jsx'
import EmptyState from './EmptyState.jsx'
import ThinkingPanel from './ThinkingPanel.jsx'
import { ArrowDown } from 'lucide-react'

export default function ChatArea({ onOpenSidebar }) {
  const { activeConversation, isThinking, thinkingSteps, isStreaming, streamingMessage } = useChat()
  const messagesEndRef = useRef(null)
  const containerRef = useRef(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)

  const messages = activeConversation?.messages || []
  const hasMessages = messages.length > 0 || streamingMessage

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollBtn(!isNearBottom)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!showScrollBtn && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, streamingMessage, showScrollBtn])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F7F5F0] dark:bg-brand-950 relative">
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto scrollbar-thin"
      >
        {!hasMessages ? (
          <EmptyState onOpenSidebar={onOpenSidebar} />
        ) : (
          <MessageList
            messages={messages}
            streamingMessage={streamingMessage}
          />
        )}

        {isThinking && thinkingSteps.length > 0 && (
          <div className="px-4 sm:px-6 pb-2 max-w-3xl mx-auto w-full">
            <ThinkingPanel steps={thinkingSteps} isComplete={false} />
          </div>
        )}

        <div ref={messagesEndRef} className="h-4" />
      </div>

      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-36 left-1/2 -translate-x-1/2 z-20 w-9 h-9 rounded-full bg-white dark:bg-brand-800 border border-[#E5E1DA] dark:border-brand-700 shadow-md flex items-center justify-center hover:bg-[#EDEAE4] dark:hover:bg-brand-700 active:scale-95 transition-all duration-150 cursor-pointer"
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="w-4 h-4 text-[#6B7280] dark:text-brand-300" />
        </button>
      )}

      <div className="relative z-10 flex-shrink-0">
        <ChatInput />
      </div>
    </div>
  )
}
