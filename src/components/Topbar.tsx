import React, { useState, useEffect } from "react"
import { Bell, Search, ChevronRight, Sun, Moon } from "lucide-react"
import { Link } from "react-router-dom"
import { Tooltip } from "@/components/ui/tooltip"

export function Topbar() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme")
      if (saved === "light" || saved === "dark") return saved
      return "dark"
    }
    return "dark"
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === "light") {
      root.classList.add("light")
      root.style.colorScheme = "light"
    } else {
      root.classList.remove("light")
      root.style.colorScheme = "dark"
    }
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"))
  }

  return (
    <header className="h-14 flex-shrink-0 bg-bg-paper border-b border-rule flex items-center justify-between px-6">
      <div className="flex items-center text-xs text-stone">
        <span className="hover:text-cream cursor-pointer transition-colors">Dashboard</span>
        <ChevronRight className="w-3 h-3 mx-1" />
        <span className="text-cream font-medium">Overview</span>
      </div>

      <div className="flex items-center gap-4">
        <Tooltip content="Quick search for users, transaction hashes, or compliance logs across the entire platform" position="bottom" delay={200}>
          <div className="flex items-center text-xs bg-bg-base border border-rule px-3 py-1.5 rounded-sm hover:border-stone transition-colors cursor-pointer text-stone gap-2 w-64">
            <Search className="w-3 h-3" />
            <span className="flex-1">Search anywhere...</span>
            <span className="text-[10px] border border-rule rounded px-1 leading-none py-[2px]">⌘K</span>
          </div>
        </Tooltip>
      </div>

      <div className="flex items-center gap-4">
        <Tooltip content={`Toggle the Workspace color theme to ${theme === "dark" ? "light" : "dark"} mode`} position="bottom" delay={200}>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-sm hover:bg-bg-elev border border-rule hover:border-stone/40 text-stone hover:text-cream transition-all cursor-pointer flex items-center justify-center"
          >
            {theme === "dark" ? (
              <Sun className="w-3.5 h-3.5 text-amber" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-info" />
            )}
          </button>
        </Tooltip>

        <Tooltip content="Current Environment: Production - all modifications here affect live users immediately" position="bottom" delay={200}>
          <div className="text-[10px] font-mono font-medium tracking-wide uppercase px-2 py-0.5 rounded-sm bg-bad/20 text-bad border border-bad/30">
            PROD
          </div>
        </Tooltip>
        
        <Tooltip content="Open the Administrative Notifications Terminal to review system alarms and audit logs" position="bottom" className="flex items-center" delay={200}>
          <Link to="/admin/notifications" className="relative text-stone hover:text-cream transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-lime rounded-full shadow-[0_0_0_2px_var(--color-bg-paper)]"></span>
          </Link>
        </Tooltip>
      </div>
    </header>
  )
}

