import React from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Tooltip } from "@/components/ui/tooltip"
import {
  LayoutDashboard,
  Users,
  ArrowRightLeft,
  ShieldAlert,
  Gift,
  Bitcoin,
  Landmark,
  ShieldCheck,
  Flag,
  Gavel,
  Megaphone,
  FileText,
  BarChart,
  List,
  UserCog,
  Settings,
  HelpCircle
} from "lucide-react"

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-[240px] flex-shrink-0 flex flex-col bg-bg-elev border-r border-rule h-screen overflow-y-auto">
      <div className="p-4 border-b border-rule flex items-center gap-2">
        <div className="w-6 h-6 bg-lime rounded-sm text-bg-base font-display font-bold flex items-center justify-center text-xs">V</div>
        <div className="font-display font-medium text-sm">
          <span className="text-cream">Volt</span>
          <span className="text-lime">Admin</span>
        </div>
      </div>
      
      <div className="p-4 border-b border-rule">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search users, txns, refs..." 
            className="w-full bg-bg-paper border border-rule rounded-sm h-8 px-2 pl-3 text-xs font-mono placeholder:text-stone/70 focus:outline-none focus:border-lime"
          />
          <div className="absolute right-2 top-2 text-[10px] text-stone border border-rule rounded px-1 leading-none py-[2px]">⌘K</div>
        </div>
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-6 px-3">
        <NavSection title="OPERATIONS">
          <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/admin'} title="Overview of systemic volume metrics, alerts queue, and nodes health logs" />
          <NavItem to="/admin/users" icon={Users} label="Users" active={location.pathname.startsWith('/admin/users')} title="Review registered user accounts, KYC identity documents, and sanctions levels" />
          <NavItem to="/admin/transactions" icon={ArrowRightLeft} label="Transactions" active={location.pathname.startsWith('/admin/transactions')} title="Auditing platform transfers, deposit validations, and hash traces" />
          <NavItem to="/admin/disputes" icon={ShieldAlert} label="P2P Disputes" badge="4" badgeType="urgent" active={location.pathname.startsWith('/admin/disputes')} title="Arbitrate peer-to-peer escrow holding conflicts and chat documentation" />
          <NavItem to="/admin/giftcards" icon={Gift} label="Gift Cards" badge="17" active={location.pathname.startsWith('/admin/giftcards') && !location.pathname.includes('inventory')} title="Validate electronic vouchers and clear processing queue" />
        </NavSection>

        <NavSection title="MONEY">
          <NavItem to="/admin/crypto-ops" icon={Bitcoin} label="Crypto Ops" active={location.pathname.startsWith('/admin/crypto-ops')} title="Audit blockchain wallet balances, gas heights, and launch cold sweeps" />
          <NavItem to="/admin/treasury" icon={Landmark} label="Treasury" active={location.pathname.startsWith('/admin/treasury')} title="Reconcile fiat bank pools, approve sweeps, and physical cash assets" />
        </NavSection>

        <NavSection title="RISK">
          <NavItem to="/admin/compliance/alerts" icon={ShieldCheck} label="Compliance" badge="1" badgeType="urgent" active={location.pathname.startsWith('/admin/compliance')} title="Review compliance watchlists patterns and AML alarms" />
          <NavItem to="/admin/compliance/sanctions" icon={Flag} label="Sanctions" active={location.pathname.includes('sanctions')} title="Manage sanction hits matched to international databases" />
        </NavSection>

        <NavSection title="GROWTH">
          <NavItem to="/admin/marketing/banners" icon={Megaphone} label="Marketing" active={location.pathname.startsWith('/admin/marketing')} title="Deploy global in-app announcements, emails, or push promotions" />
          <NavItem to="/admin/cms/blog" icon={FileText} label="CMS" active={location.pathname.startsWith('/admin/cms')} title="Manage blog articles, regulatory statements, and FAQ center" />
          <NavItem to="/admin/reports" icon={BarChart} label="Reports" active={location.pathname.startsWith('/admin/reports')} title="Generate financial metrics and download CSV/PDF spreadsheet rosters" />
        </NavSection>

        <NavSection title="SYSTEM">
          <NavItem to="/admin/audit-log" icon={List} label="Audit Log" title="Immutable cryptographic ledger trails of all administrative clerk activities" />
          <NavItem to="/admin/staff" icon={UserCog} label="Staff & Roles" title="Configure staff access, department designations, and security permission states" />
          <NavItem to="/admin/settings/fees" icon={Settings} label="Settings" active={location.pathname.startsWith('/admin/settings')} title="Alter dynamic maker/taker rates, KYC tiered daily limits, and warning routines" />
          <NavItem to="/admin/help-center" icon={HelpCircle} label="Help Center" active={location.pathname === '/admin/help-center'} title="Search administrative training handbooks, lookup commands, and system guides" />
        </NavSection>
      </nav>

      <div className="mt-auto p-4 border-t border-rule">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">SO</div>
          <div className="flex-1 overflow-hidden">
            <div className="text-xs font-medium truncate">Sunday O.</div>
            <div className="text-[10px] text-stone uppercase tracking-wide">Super Admin</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

function NavSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <h4 className="text-[10px] font-medium text-stone uppercase tracking-wider mb-1 px-3">{title}</h4>
      {children}
    </div>
  )
}

function NavItem({ to, icon: Icon, label, active, badge, badgeType = 'normal', title }: { to: string, icon: any, label: string, active?: boolean, badge?: string, badgeType?: 'normal' | 'urgent', title?: string }) {
  const linkContent = (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 px-3 py-1.5 rounded-sm text-xs transition-colors w-full",
        active ? "bg-bg-high text-cream font-medium" : "text-stone hover:text-cream hover:bg-bg-paper"
      )}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <span className={cn(
          "text-[10px] font-mono px-1.5 py-0.5 rounded-sm flex items-center justify-center leading-none shrink-0",
          badgeType === 'urgent' ? "bg-bad text-white" : "bg-bg-paper text-stone border border-rule group-hover:border-stone"
        )}>
          {badge}
        </span>
      )}
    </Link>
  )

  if (title) {
    return (
      <Tooltip content={title} position="right" className="w-full block" delay={150}>
        {linkContent}
      </Tooltip>
    )
  }

  return linkContent
}
