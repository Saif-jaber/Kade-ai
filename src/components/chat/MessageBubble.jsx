import { useState } from 'react'
import { Bot, ChevronDown, ChevronUp } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CodeBlock from './CodeBlock.jsx'
import ThinkingPanel from './ThinkingPanel.jsx'
import LoadingDots from '../common/LoadingDots.jsx'
import MessageActions from './MessageActions.jsx'

export default function MessageBubble({ message, index, isStreaming = false }) {
  const [thinkingExpanded, setThinkingExpanded] = useState(false)
  const isUser = message.role === 'user'

  return (
    <div className={`animate-slide-up group ${isUser ? 'flex justify-end' : ''}`}>
      <div className={`flex gap-3 ${isUser ? 'max-w-[85%] sm:max-w-[75%]' : 'max-w-full'}`}>
        {!isUser && (
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#F0EDE7] to-[#F7F5F0] dark:from-brand-800/60 dark:to-brand-800/40 flex items-center justify-center shadow-sm border border-[#E5E1DA] dark:border-brand-700/30">
              <Bot className="w-4 h-4 text-[#0D9488]" />
            </div>
          </div>
        )}

        <div className={`flex-1 min-w-0 ${isUser ? 'flex justify-end' : ''}`}>
          <div
            className={`
              ${isUser
                ? 'bg-[#EDEAE4] text-[#2D3436] dark:bg-brand-800/60 dark:text-white px-4 py-3 rounded-2xl rounded-tr-lg shadow-sm'
                : 'py-1'
              }
            `}
          >
            {!isUser && message.thinkingSteps && message.thinkingSteps.length > 0 && (
              <div className="mb-2">
                <button
                  onClick={() => setThinkingExpanded(prev => !prev)}
                  className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#0D9488] dark:text-brand-400 dark:hover:text-brand-300 transition-colors duration-150 cursor-pointer"
                >
                  {thinkingExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                  <span className="font-medium">
                    {message.thinkingSteps.length} thinking steps
                  </span>
                </button>
                {thinkingExpanded && (
                  <div className="mt-2">
                    <ThinkingPanel steps={message.thinkingSteps} isComplete />
                  </div>
                )}
              </div>
            )}

            <div className={`message-content text-[14px] leading-[1.7] break-words overflow-wrap-break-word ${isUser ? 'text-[#2D3436] dark:text-white' : 'text-[#2D3436] dark:text-brand-100'}`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    if (!inline && match) {
                      return (
                        <CodeBlock
                          language={match[1]}
                          value={String(children).replace(/\n$/, '')}
                        />
                      )
                    }
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  },
                  table({ children }) {
                    return (
                      <div className="overflow-x-auto my-3">
                        <table className="w-full text-sm">
                          {children}
                        </table>
                      </div>
                    )
                  },
                  thead({ children }) {
                    return <thead>{children}</thead>
                  },
                  tbody({ children }) {
                    return <tbody>{children}</tbody>
                  },
                  tr({ children }) {
                    return <tr className="bg-[#F0EDE7] dark:bg-brand-800/20">{children}</tr>
                  },
                  th({ children }) {
                    return <th className="px-3 py-2 text-left font-semibold text-[#374151] dark:text-brand-200">{children}</th>
                  },
                  td({ children }) {
                    return <td className="px-3 py-2 text-[#4B5563] dark:text-brand-300">{children}</td>
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>

              {isStreaming && !message.content && (
                <LoadingDots size="sm" />
              )}
            </div>

            {!isUser && !isStreaming && message.content && (
              <MessageActions content={message.content} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
