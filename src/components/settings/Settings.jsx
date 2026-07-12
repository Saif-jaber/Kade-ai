import { ArrowLeft, User, Bell, Shield, Palette, Info } from 'lucide-react'
import { useState } from 'react'

export default function Settings({ open, onClose }) {
  const [activeTab, setActiveTab] = useState('profile')

  if (!open) return null

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'about', label: 'About', icon: Info },
  ]

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F7F5F0] dark:bg-brand-950">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E5E1DA] dark:border-brand-800 flex-shrink-0">
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-[#E5E1DA] dark:hover:bg-brand-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-[#6B7280] dark:text-brand-400" />
        </button>
        <h2 className="text-lg font-semibold text-[#2D3436] dark:text-white">Settings</h2>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Tab sidebar */}
        <div className="w-52 border-r border-[#E5E1DA] dark:border-brand-800 py-4 px-3 flex-shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer mb-1
                ${activeTab === tab.id
                  ? 'bg-[#EDEAE4] dark:bg-brand-800 text-[#2D3436] dark:text-white font-medium'
                  : 'text-[#6B7280] dark:text-brand-400 hover:bg-[#EDEAE4] dark:hover:bg-brand-800/50'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 max-w-2xl">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-[#0D9488] flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">K</span>
                </div>
                <div>
                  <div className="text-lg font-medium text-[#2D3436] dark:text-white">Kade AI</div>
                  <div className="text-sm text-[#6B7280] dark:text-brand-400">Free plan</div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] dark:text-brand-200 mb-2">Display Name</label>
                <input
                  type="text"
                  defaultValue="Kade AI"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E5E1DA] dark:border-brand-700 bg-white dark:bg-brand-800/50 text-sm text-[#2D3436] dark:text-white outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]/30 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] dark:text-brand-200 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue="user@example.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E5E1DA] dark:border-brand-700 bg-white dark:bg-brand-800/50 text-sm text-[#2D3436] dark:text-white outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]/30 transition-all"
                />
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#374151] dark:text-brand-200 mb-3">Theme</label>
                <div className="flex gap-4">
                  <button className="flex-1 py-3 px-4 rounded-lg border-2 border-[#0D9488] bg-[#F7F5F0] text-sm font-medium text-[#2D3436] cursor-pointer">Light</button>
                  <button className="flex-1 py-3 px-4 rounded-lg border border-[#E5E1DA] dark:border-brand-700 bg-[#1a1a2e] text-sm font-medium text-white cursor-pointer">Dark</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] dark:text-brand-200 mb-2">Font Size</label>
                <select className="w-full px-4 py-2.5 rounded-lg border border-[#E5E1DA] dark:border-brand-700 bg-white dark:bg-brand-800/50 text-sm text-[#2D3436] dark:text-white outline-none cursor-pointer">
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-5">
              {['Message notifications', 'Sound effects', 'Desktop notifications'].map((item, i) => (
                <label key={i} className="flex items-center justify-between py-3 cursor-pointer">
                  <span className="text-sm text-[#374151] dark:text-brand-200">{item}</span>
                  <div className="w-10 h-5 rounded-full bg-[#E5E1DA] dark:bg-brand-700 relative">
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform" />
                  </div>
                </label>
              ))}
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4 text-sm text-[#4B5563] dark:text-brand-300">
              <p>Your conversations are stored locally and are not shared with third parties.</p>
              <p>You can delete your data at any time from the conversation settings.</p>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-4 text-sm text-[#4B5563] dark:text-brand-300">
              <div>
                <div className="font-medium text-[#2D3436] dark:text-white mb-1">Kade AI</div>
                <div>Version 1.0.0</div>
              </div>
              <p>Kade AI is an intelligent assistant built to help you with various tasks.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}