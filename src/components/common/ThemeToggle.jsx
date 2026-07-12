import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext.jsx'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-1.5 rounded-xl hover:bg-[#EDEAE4] dark:hover:bg-brand-800 active:scale-95 transition-all duration-150 cursor-pointer"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="w-[18px] h-[18px] text-[#6B7280] hover:text-[#2D3436] dark:text-brand-400 dark:hover:text-brand-200 transition-colors" />
      ) : (
        <Moon className="w-[18px] h-[18px] text-[#0D9488] hover:text-[#2D3436] dark:text-brand-500 dark:hover:text-brand-700 transition-colors" />
      )}
    </button>
  )
}
