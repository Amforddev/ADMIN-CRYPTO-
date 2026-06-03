import { Bell, Search, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

export function Topbar() {
  return (
    <header className="h-14 flex-shrink-0 bg-bg-paper border-b border-rule flex items-center justify-between px-6">
      <div className="flex items-center text-xs text-stone">
        <span className="hover:text-cream cursor-pointer transition-colors">Dashboard</span>
        <ChevronRight className="w-3 h-3 mx-1" />
        <span className="text-cream font-medium">Overview</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center text-xs bg-bg-base border border-rule px-3 py-1.5 rounded-sm hover:border-stone transition-colors cursor-pointer text-stone gap-2 w-64">
          <Search className="w-3 h-3" />
          <span className="flex-1">Search anywhere...</span>
          <span className="text-[10px] border border-rule rounded px-1 leading-none py-[2px]">⌘K</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-[10px] font-mono font-medium tracking-wide uppercase px-2 py-0.5 rounded-sm bg-bad/20 text-bad border border-bad/30">
          PROD
        </div>
        
        <Link to="/admin/notifications" className="relative text-stone hover:text-cream transition-colors" title="Open Administrative Notifications Terminal">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-lime rounded-full shadow-[0_0_0_2px_var(--color-bg-paper)]"></span>
        </Link>
      </div>
    </header>
  )
}
