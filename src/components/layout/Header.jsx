import { PanelLeft, Sparkles } from 'lucide-react'
import ThemeToggle from '../common/ThemeToggle.jsx'
import { useChat } from '../../context/ChatContext.jsx'

export default function Header({ onToggleSidebar, sidebarOpen }) {
  const { activeConversation } = useChat()

  return (
    <header className="flex items-center justify-between h-12 px-3 sm:px-4 border-b border-[#E5E1DA] dark:border-brand-800/80 bg-[#F7F5F0]/80 dark:bg-brand-950/80 backdrop-blur-md flex-shrink-0 z-10">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-xl hover:bg-[#EDEAE4] dark:hover:bg-brand-800 active:scale-95 transition-all duration-150 cursor-pointer flex-shrink-0"
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <PanelLeft className="w-[18px] h-[18px] text-[#0D9488] dark:text-brand-400" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-4 h-4 text-[#0D9488] flex-shrink-0" />
          <span className="text-[13px] font-medium text-[#2D3436] dark:text-brand-200 truncate">
            {activeConversation?.title || 'Kade AI'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <ThemeToggle />
      </div>
    </header>
  )
}
