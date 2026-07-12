import { useState, useEffect } from 'react'
import AppLayout from './components/layout/AppLayout.jsx'
import Sidebar from './components/sidebar/Sidebar.jsx'
import ChatArea from './components/chat/ChatArea.jsx'
import Header from './components/layout/Header.jsx'
import Settings from './components/settings/Settings.jsx'
import { useChat } from './context/ChatContext.jsx'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { activeConversation } = useChat()

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) setSidebarOpen(false)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <AppLayout>
      <Sidebar
        open={sidebarOpen}
        isMobile={isMobile}
        onClose={() => setSidebarOpen(false)}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <div className="flex flex-col flex-1 min-w-0 h-screen">
        <Header
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          sidebarOpen={sidebarOpen}
        />
        {settingsOpen ? (
          <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        ) : (
          <ChatArea onOpenSidebar={() => setSidebarOpen(true)} />
        )}
      </div>
    </AppLayout>
  )
}
