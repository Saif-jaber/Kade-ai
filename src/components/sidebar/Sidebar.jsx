import { Plus, MessageSquare, Trash2, Pencil, Check, X, PanelLeftClose } from 'lucide-react'
import { useState } from 'react'
import { useChat } from '../../context/ChatContext.jsx'
import { formatDateGroup } from '../../utils/helpers.js'

export default function Sidebar({ open, isMobile, onClose, onOpenSettings }) {
  const {
    conversations,
    activeConversationId,
    selectConversation,
    createConversation,
    deleteConversation,
    renameConversation,
  } = useChat()

  const handleNewChat = () => {
    createConversation()
    if (isMobile) onClose()
  }

  const grouped = conversations.reduce((acc, conv) => {
    const group = formatDateGroup(conv.updatedAt)
    if (!acc[group]) acc[group] = []
    acc[group].push(conv)
    return acc
  }, {})

  const groupOrder = ['Today', 'Yesterday', 'Previous 7 days', 'Previous 30 days', 'Older']

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`
          fixed inset-0 bg-black/30 z-30 lg:hidden
          transition-opacity duration-300
          ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-40 h-full
          w-72
          bg-[#F0EDE7] dark:bg-brand-900
          border-r border-[#E5E1DA] dark:border-brand-800
          flex flex-col
          transition-all duration-300 ease-in-out
          ${open
            ? 'translate-x-0 opacity-100'
            : isMobile
              ? '-translate-x-full opacity-0'
              : 'lg:w-0 lg:overflow-hidden lg:border-0 lg:opacity-0'
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-[#E5E1DA] dark:border-brand-800">
          <button
            onClick={handleNewChat}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl
              bg-[#EDEAE4] dark:bg-brand-800/60
              hover:bg-[#E5E1DA] dark:hover:bg-brand-700
              active:scale-[0.98]
              text-[#2D3436] dark:text-brand-200
              text-sm font-medium transition-all duration-150 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New chat
          </button>
          <button
            onClick={onClose}
            className="ml-2 p-2 rounded-xl hover:bg-[#E5E1DA] dark:hover:bg-brand-800
              active:scale-95 transition-all duration-150 cursor-pointer lg:flex hidden"
            aria-label="Close sidebar"
          >
            <PanelLeftClose className="w-4 h-4 text-[#0D9488] dark:text-brand-400" />
          </button>
        </div>

        {/* Conversation list */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-2">
          {groupOrder.map(group => {
            if (!grouped[group] || grouped[group].length === 0) return null
            return (
              <div key={group} className="mb-3">
                <h3 className="px-2.5 mb-1 text-[11px] font-semibold text-[#6B7280] dark:text-brand-500 uppercase tracking-wider">
                  {group}
                </h3>
                <div className="space-y-px">
                  {grouped[group].map(conv => (
                    <ConversationItem
                      key={conv.id}
                      conversation={conv}
                      isActive={conv.id === activeConversationId}
                      onSelect={() => {
                        selectConversation(conv.id)
                        if (isMobile) onClose()
                      }}
                      onDelete={() => deleteConversation(conv.id)}
                      onRename={(title) => renameConversation(conv.id, title)}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-[#E5E1DA] dark:border-brand-800">
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#E5E1DA] dark:hover:bg-brand-800/50 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#F0EDE7] dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-[#0D9488] dark:text-brand-400">K</span>
            </div>
            <div className="min-w-0 text-left">
              <div className="text-xs font-medium text-[#2D3436] dark:text-brand-300 truncate">Kade AI</div>
              <div className="text-[10px] text-[#6B7280] dark:text-brand-500">Free plan</div>
            </div>
          </button>
        </div>
      </aside>
    </>
  )
}

function ConversationItem({ conversation, isActive, onSelect, onDelete, onRename }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(conversation.title)

  const handleRename = () => {
    if (editTitle.trim()) {
      onRename(editTitle.trim())
    }
    setIsEditing(false)
  }

  return (
    <div
      className={`
        group flex items-center gap-2.5 px-2.5 py-2 rounded-xl cursor-pointer
        transition-all duration-150
        ${isActive
          ? 'bg-[#EDEAE4] dark:bg-brand-800 text-[#2D3436] dark:text-brand-100 shadow-sm'
          : 'hover:bg-[#EDEAE4] dark:hover:bg-brand-800/50 text-[#4B5563] dark:text-brand-400'
        }
      `}
      onClick={onSelect}
    >
      <MessageSquare className="w-4 h-4 flex-shrink-0 opacity-40" />

      {isEditing ? (
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename()
              if (e.key === 'Escape') setIsEditing(false)
            }}
            className="flex-1 min-w-0 bg-white dark:bg-brand-800 border border-[#E5E1DA] dark:border-brand-600 rounded-lg px-2 py-1 text-sm outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]/30 transition-all"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
            <button
              onClick={(e) => { e.stopPropagation(); handleRename() }}
              className="p-1 rounded-lg hover:bg-[#E5E1DA] dark:hover:bg-brand-600 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-[#0D9488]" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setIsEditing(false) }}
              className="p-1 rounded-lg hover:bg-[#E5E1DA] dark:hover:bg-brand-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5 text-[#6B7280]" />
          </button>
        </div>
      ) : (
        <>
          <span className="flex-1 min-w-0 text-[13px] truncate leading-tight">
            {conversation.title}
          </span>
          <div className="hidden group-hover:flex items-center gap-0.5 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setEditTitle(conversation.title)
                setIsEditing(true)
              }}
              className="p-1.5 rounded-lg hover:bg-[#E5E1DA] dark:hover:bg-brand-600 transition-colors cursor-pointer"
              aria-label="Rename conversation"
            >
              <Pencil className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-[#6B7280] hover:text-red-500 transition-colors cursor-pointer"
              aria-label="Delete conversation"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
