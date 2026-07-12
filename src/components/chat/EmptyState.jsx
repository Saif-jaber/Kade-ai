import { Atom, Code, Mail, GitCompare, Sparkles, PanelLeft } from 'lucide-react'
import { useChat } from '../../context/ChatContext.jsx'
import { EXAMPLE_PROMPTS } from '../../constants/mockData.js'

const iconMap = {
  atom: Atom,
  code: Code,
  mail: Mail,
  'git-compare': GitCompare,
}

export default function EmptyState({ onOpenSidebar }) {
  const { sendMessage, activeConversationId } = useChat()

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 sm:px-6 animate-fade-in">
      <div className="max-w-[520px] w-full text-center space-y-8 sm:space-y-10">
        {/* Mobile sidebar hint */}
        {!activeConversationId && (
          <button
            onClick={onOpenSidebar}
            className="sm:hidden inline-flex items-center gap-2 px-3 py-1.5 rounded-full
              bg-[#F0EDE7] dark:bg-brand-800
              text-[#0D9488] dark:text-brand-400
              text-xs font-medium
              hover:bg-[#E5E1DA] dark:hover:bg-brand-700
              transition-colors duration-150 cursor-pointer"
          >
            <PanelLeft className="w-3.5 h-3.5" />
            Open sidebar
          </button>
        )}

        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F0EDE7] to-[#F7F5F0] dark:from-brand-900/20 dark:to-brand-900/10 shadow-sm shadow-brand-200/50 dark:shadow-brand-900/20">
            <Sparkles className="w-7 h-7 text-[#0D9488] dark:text-brand-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-[#2D3436] dark:text-brand-100 tracking-tight">
              How can I help you today?
            </h1>
            <p className="text-[#6B7280] dark:text-brand-400 text-sm sm:text-[15px] leading-relaxed max-w-sm mx-auto">
              Ask me anything. I can help with coding, writing, analysis, and more.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {EXAMPLE_PROMPTS.map((prompt) => {
            const Icon = iconMap[prompt.icon] || Sparkles
            return (
              <button
                key={prompt.id}
                onClick={() => sendMessage(prompt.title + ' ' + prompt.subtitle)}
                className="flex items-start gap-3 p-3.5 sm:p-4 text-left rounded-2xl
                  bg-white dark:bg-brand-900
                  border border-[#E5E1DA] dark:border-brand-800/80
                  hover:border-[#0D9488] dark:hover:border-brand-700
                  hover:shadow-sm
                  active:scale-[0.98]
                  transition-all duration-200 cursor-pointer group"
              >
                <div className="flex-shrink-0 mt-0.5 p-2 rounded-xl bg-[#F0EDE7] dark:bg-brand-800/80 group-hover:bg-[#EDEAE4] dark:group-hover:bg-brand-900/20 transition-colors duration-200">
                  <Icon className="w-4 h-4 text-[#0D9488] dark:text-brand-400 group-hover:text-[#0D9488] dark:group-hover:text-brand-400 transition-colors duration-200" />
                </div>
                <div className="min-w-0 pt-0.5">
                  <div className="text-[13px] font-medium text-[#2D3436] dark:text-brand-200 leading-snug">
                    {prompt.title}
                  </div>
                  <div className="text-xs text-[#6B7280] dark:text-brand-500 mt-1 leading-relaxed">
                    {prompt.subtitle}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
