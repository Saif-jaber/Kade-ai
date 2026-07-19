import {
  Brain,
  Search,
  Terminal,
  FileText,
  Globe,
  Database,
  Sparkles,
} from 'lucide-react'

export const STEP_ICONS = {
  thinking: Brain,
  search: Search,
  code: Terminal,
  file: FileText,
  web: Globe,
  database: Database,
  sparkles: Sparkles,
}

export const STEP_COLORS = {
  pending: {
    icon: 'text-[#9CA3AF] dark:text-brand-500',
    bg: 'bg-[#F0EDE7] dark:bg-brand-800/40',
  },
  active: {
    icon: 'text-[#0D9488] dark:text-brand-400',
    bg: 'bg-[#F0EDE7] dark:bg-brand-800/60',
  },
  completed: {
    icon: 'text-[#0D9488] dark:text-brand-400',
    bg: 'bg-[#F0EDE7] dark:bg-brand-800/50',
  },
}
