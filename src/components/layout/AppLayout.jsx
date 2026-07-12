export default function AppLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F5F0] dark:bg-brand-950 transition-colors duration-300">
      {children}
    </div>
  )
}
