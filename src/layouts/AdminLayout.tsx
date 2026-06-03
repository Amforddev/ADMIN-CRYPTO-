import React, { useState, useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { motion, useDragControls } from "motion/react"
import { Sidebar } from "@/components/Sidebar"
import { Topbar } from "@/components/Topbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  BookOpen, 
  ChevronRight, 
  HelpCircle, 
  X, 
  Info, 
  ShieldAlert, 
  Activity, 
  CreditCard, 
  Users, 
  Settings, 
  ShieldCheck, 
  ArrowRightLeft, 
  CheckSquare, 
  Megaphone, 
  FileText,
  List,
  Compass,
  KeyRound,
  BellRing
} from "lucide-react"

interface ModuleGuide {
  title: string
  sub: string
  icon: any
  summary: string
  steps: string[]
  troubleshooting: { q: string; a: string }[]
  securityAdvice: string
}

const MODULE_GUIDES: Record<string, ModuleGuide> = {
  "/admin": {
    title: "Overview Dashboard",
    sub: "Real-Time System Telemetry & Alarm Hub",
    icon: Compass,
    summary: "Displays critical platform metrics, pending risk escalations, infrastructure health logs, and active transaction velocity charts.",
    steps: [
      "KPI Indicators: View 24-hour total volumes, active customer accounts, hot wallet liquidity ratios, and withdrawal completion percentages.",
      "Open Alerts Desk: Filter incoming risks by level (Critical, Warning, Info). Clicking Investigate delegates the event to compliant auditors.",
      "System Component Health: Monitor API gateways, auth databases, and payments queues. Pulse lights notify teams of latency deviations."
    ],
    troubleshooting: [
      { q: "What should I do if the hot wallet drops below 10%?", a: "Notify the Treasury Desk immediately or navigate to Crypto Ops to perform a secure cold sweep." },
      { q: "Why is 'giftcard-svc' showing high response latency?", a: "This implies external API queues are backing up. Check third-party carrier status logs on the Help Center." }
    ],
    securityAdvice: "Always audit unassigned compliance alerts immediately to prevent stale AML exposure windows."
  },
  "/admin/users": {
    title: "User Profile Directory",
    sub: "KYC & Compliance Verification Manager",
    icon: Users,
    summary: "Full database of registered platform accounts. This screen allows validating BVN/NIN registrations, upgrading KYC limits, and blacklisting fraudulent actors.",
    steps: [
      "User Verification Lookup: Search directories by name, phone string, or wallet adress.",
      "Detail Audits: Click any profile to inspect loaded BVN records, passport photographs, and active trading patterns.",
      "Safety Overrides: Enforce global blacklists, freeze wallets, or update limits to Tier 3 verified levels after selfie proof matches."
    ],
    troubleshooting: [
      { q: "How do I upgrade a user to the High Limit VIP Tier?", a: "Open the specific user profile, verify that they completed Enhanced Due Diligence, and click 'Upgrade KYC state'." },
      { q: "A user is complaining about failed phone validations.", a: "Check carrier SMS delivery queues inside the Notifications Hub to audit active gateway state." }
    ],
    securityAdvice: "Never override documents without double checking candidate passport faces against selfie verification models."
  },
  "/admin/transactions": {
    title: "Ledger Transactions",
    sub: "Audit & Settlement Registry",
    icon: ArrowRightLeft,
    summary: "Main ledger capturing every deposits, withdrawals, and merchant order stream. Provides manual clearing overrides and blockchain trace links.",
    steps: [
      "Search Engine: Isolate individual records using global hash hashes, reference codes, or desk user tokens.",
      "Status Badges: Completed (settled on ledger), Pending (confirming on-chain), Failed (bounced/insufficient gas), Held (compliance lock).",
      "Manual Interventions: For failed bank clearances or stuck transfers, click details and execute manual reverse/confirm signals."
    ],
    troubleshooting: [
      { q: "What causes a transaction to hang in 'Pending' on ERC20?", a: "Congested mempools with low Gas heights. Adjust the dynamic Ethereum markups inside Platform Settings." },
      { q: "Can I undo a manual settlement release?", a: "No. Ledger reconciliations are permanent. Verify beneficiary accounts before triggering confirm signals." }
    ],
    securityAdvice: "Always cross-reference held bank transfers against inbound banking logs before executing manual clearing."
  },
  "/admin/disputes": {
    title: "P2P Arbitration Center",
    sub: "Escrow Escrow Release & Resolving Hub",
    icon: ShieldAlert,
    summary: "Mediates conflicts on buyer/seller P2P currency trades. Features escrow locks and joint interaction rooms.",
    steps: [
      "Dispute Queue: Review ongoing cases. Urgent badges flag breaches in peer-to-peer SLA times.",
      "Evidence Board: Audit chat transcripts, bank dispatch PDFs, and transaction receipt proof submissions.",
      "Arbitrage Settlement: Award the locked escrow tokens securely to either the buyer or seller. This triggers payout."
    ],
    troubleshooting: [
      { q: "Buyer provided bank proof, but seller denies fiat receipts.", a: "Examine compliance statements for a matching Reference ID. If matched, release the escrow to the buyer." },
      { q: "What happens if a user abandons a dispute?", a: "The moderator can auto-resolve in favor of the cooperative counterparty after the 30-minute SLA expire." }
    ],
    securityAdvice: "Avoid arbitrating cases without verifying matching stamp records on PDF documents."
  },
  "/admin/giftcards": {
    title: "Gift Card Clearing Desk",
    sub: "Voucher Redemption & Risk Manager",
    icon: CreditCard,
    summary: "Audit station for processing incoming electronic gift cards (iTunes, Amazon, Steam). Features real-time checking pipelines.",
    steps: [
      "Redemption Queue: View submitted codes, card images, and face values.",
      "Manual Checker: Copy codes directly into authorized merchant terminals to verify validation state.",
      "Accept & Payout: Click release to pay the cash equivalent in NGN, or reject to label the card code as used/invalid."
    ],
    troubleshooting: [
      { q: "What should I do if a card returns 'Already Redeemed'?", a: "Click 'Decline/Reject', select 'Already Used' as the reason, and upload the partner merchant timestamp proof." },
      { q: "Can I recover a mistakenly payout card?", a: "No. Promptly restrict user profiles that upload duplicate or fraudulent digital vouchers." }
    ],
    securityAdvice: "Verify card receipts correspond directly to card serial numbers to eliminate counterfeit voucher schemes."
  },
  "/admin/crypto-ops": {
    title: "Crypto Operations Console",
    sub: "Hot Wallet & Blockchain Sweeps Operator",
    icon: KeyRound,
    summary: "Monitors cold/hot wallet balances, current gas margins, and handles manual blockchain sweeps.",
    steps: [
      "Platform Balances: Track ERC20, Tron, BTC, and BEP20 balances.",
      "Gas Limit Adjustments: Tune transaction constraints to match live dynamic fees.",
      "Cold Sweeps: Initiate one-click sweeps to transfer excess hot-wallet reserves to secure offline multi-sig vault addresses."
    ],
    troubleshooting: [
      { q: "Why is the BTC hot wallet showing 0% liquidity?", a: "Outbound sweeps were calculated too aggressively. Queue a manual refill from Treasury master cold-storage pools." },
      { q: "What is an 'Unsigned Transfer' on-screen?", a: "This implies a multisig sweep is waiting for secondary security keys. Check staff approval logs." }
    ],
    securityAdvice: "Never sweep funds to a destination address that hasn't been verified on whiteboards."
  },
  "/admin/treasury": {
    title: "Platform Treasury",
    sub: "Bank Reserves & Liquidity Planner",
    icon: Activity,
    summary: "Governs physical vault states, fiat bank accounts, merchant balances, and handles direct settlement logs.",
    steps: [
      "Fiat Channels: Monitor liquid NGN reservoirs at Providus, Monnify, and Paystack databases.",
      "Settlement Clearing: Process manual bank payout sweeps for commercial OTC clients.",
      "Reconcile Matrix: Run automated reports matching back-end digital ledgers with external bank statements."
    ],
    troubleshooting: [
      { q: "Monnify automated withdrawal webhook failed.", a: "Confirm external account balances, then execute 'Retry Settlement' using the transaction index override." },
      { q: "I see a ledger deficit of over ₦1M.", a: "This suggests double payouts or untracked refunds. Crosscheck audit logs against compliance blocks immediately." }
    ],
    securityAdvice: "Confirm that secondary signatures are locked into systems before dispersing treasury transfers exceeding NGN 5M."
  },
  "/admin/compliance": {
    title: "Compliance & AML Gate",
    sub: "Anti-Money Laundering & Sanctions Monitor",
    icon: ShieldCheck,
    summary: "Evaluates international sanctions matches, PEP exposures, transaction threshold alerts, and audits suspicious network behaviors.",
    steps: [
      "Alert Monitor: Review transactions flagged for suspicious speed, multi-IP logins, or OFAC criteria matches.",
      "Watchlists Control: Access lists of blocked personas and search active PEP databases.",
      "Audit Resolve: Clear matches by uploading formal KYC verification documents, or flag to freeze funds."
    ],
    troubleshooting: [
      { q: "A user is marked 'OFAC Sanction Hit' but has a different DOB.", a: "This is a false positive. Click 'Resolve Watchlist Hit', select 'Mismatch Criteria' and upload your compliance memo." },
      { q: "How are AML thresholds calculated?", a: "Standard threshold parameters trigger alarms at NGN 5M daily levels. Modify limits inside Settings." }
    ],
    securityAdvice: "Immediately freeze accounts that generate high-probability matches to eliminate regulatory penalty exposure."
  },
  "/admin/settings": {
    title: "Platform Settings",
    sub: "System Parameter & Fee Control Console",
    icon: Settings,
    summary: "Allows specifying trading margin rates, dynamic gas buffers, kyc limits, system notifications, and security policies.",
    steps: [
      "Trading Fees Tab: Alter Maker/Taker ratios and OTC percentage spreads for P2P trading counters.",
      "System Limits Tab: Customize daily and monthly outlays on identity verification tiers. Click Edit to amend criteria.",
      "Notification Profiles Tab: Connect alarms directly to Slack, Discord channels, or email grids. Toggle Active/Muted easily.",
      "General Tab: Turn on Maintenance Mode to lock portal, configure 2FA mandate structures, and toggle IP Whitelisting rules."
    ],
    troubleshooting: [
      { q: "How do I force maintenance mode quickly?", a: "Head to the 'General' tab, toggle the 'Platform Maintenance Mode' switch. It immediately takes effect across the web applications." },
      { q: "An alarm is spamming the compliance channel.", a: "Go to 'Notification Profiles', find the offending trigger, and click the 'Muted' status badge." }
    ],
    securityAdvice: "Keep IP Whitelisting rules active in production to prevent intrusion from unverified networks."
  },
  "/admin/notifications": {
    title: "Notifications & Alerts Hub",
    sub: "Administrative Outbound Dispatch & Telemetry",
    icon: BellRing,
    summary: "Primary station for managing outbox alarms and dynamic alerts, checking carrier delivery logs, and dispatching push messaging.",
    steps: [
      "System Alarms: Track active errors generated by node monitors (wallet service drop, sanctions alarms). Fix and click 'Resolve'.",
      "Deploy Broadcasts: Construct target app popups, sms updates, or announcement banners, and direct them to custom user tiers.",
      "Service Telemetry: Audit FCM gateway, Twilio carrier indexes, and Amazon SES open/read charts."
    ],
    troubleshooting: [
      { q: "Why are push notifications not landing on Android client?", a: "Ensure the Firebase FCM server token is synced. Test delivery using a test desk account first." },
      { q: "How do I broadcast an outage warning?", a: "Select the 'Broadcast' tab, set channel to 'Sticky Screen Banner', select 'All Users', fill text and deploy." }
    ],
    securityAdvice: "Avoid broadcasting system endpoints or internal server descriptions to general audiences."
  }
}

const DEFAULT_GUIDE: ModuleGuide = {
  title: "Administrative Terminal Companion",
  sub: "Volt Systemic Operations Handbook",
  icon: HelpCircle,
  summary: "This training engine dynamically parses your navigation routes to provide step-by-step checklists, operational boundaries, and troubleshooting recommendations.",
  steps: [
    "Navigate between workspace interfaces on the sidebar menu to update active checklists.",
    "Hover over buttons, badges, and entry fields to view detailed contextual tooltips.",
    "Check the help manual's troubleshooting panel for guidance on dynamic mempool congestion or OFAC watchlists."
  ],
  troubleshooting: [
    { q: "How does the Volt Admin Panel secure credentials?", a: "All sensitive API endpoints are proxied securely using server-side environments to fully prevent client browser disclosure." },
    { q: "Who is authorized to override system fees?", a: "Platform configurations can only be modified by accounts designated with the 'Super Admin' role parameters." }
  ],
  securityAdvice: "Log out of administrative sessions when leaving workstations unattended."
}

export default function AdminLayout() {
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [currentGuide, setCurrentGuide] = useState<ModuleGuide>(DEFAULT_GUIDE)

  // Find appropriate guide based on current route
  useEffect(() => {
    let matchedPath = "/admin"
    const path = location.pathname
    
    if (path === "/admin" || path === "/admin/") {
      matchedPath = "/admin"
    } else if (path.startsWith("/admin/users")) {
      matchedPath = "/admin/users"
    } else if (path.startsWith("/admin/transactions")) {
      matchedPath = "/admin/transactions"
    } else if (path.startsWith("/admin/disputes")) {
      matchedPath = "/admin/disputes"
    } else if (path.startsWith("/admin/giftcards")) {
      matchedPath = "/admin/giftcards"
    } else if (path.startsWith("/admin/crypto-ops")) {
      matchedPath = "/admin/crypto-ops"
    } else if (path.startsWith("/admin/treasury")) {
      matchedPath = "/admin/treasury"
    } else if (path.startsWith("/admin/compliance")) {
      matchedPath = "/admin/compliance"
    } else if (path.startsWith("/admin/settings")) {
      matchedPath = "/admin/settings"
    } else if (path.startsWith("/admin/notifications")) {
      matchedPath = "/admin/notifications"
    } else {
      matchedPath = "default"
    }

    if (matchedPath !== "default" && MODULE_GUIDES[matchedPath]) {
      setCurrentGuide(MODULE_GUIDES[matchedPath])
    } else {
      // Create a fallback guide for lesser paths like audit logs, CMS, marketing etc.
      let docTitle = "Administrative Page"
      let docSub = "Operations Interface"
      
      if (path.includes("audit-log")) {
        docTitle = "Audit Log Ledger"
        docSub = "Immutable Accountability Trails"
      } else if (path.includes("staff")) {
        docTitle = "Staff & Role Assignments"
        docSub = "rbac Access Configuration"
      } else if (path.includes("marketing")) {
        docTitle = "Promotions & Campaigns Manager"
        docSub = "User Conversion & Outbox Alerts"
      } else if (path.includes("cms")) {
        docTitle = "Content CMS Center"
        docSub = "Authoring Press and System Disclaimers"
      } else if (path.includes("help-center")) {
        docTitle = "Volt Information Hub"
        docSub = "General Administrative FAQs"
      }

      setCurrentGuide({
        title: docTitle,
        sub: docSub,
        icon: Info,
        summary: `You are currently viewing the ${docTitle} screen. This console operates compliance or tracking utilities.`,
        steps: [
          `Inspect records dynamically using input parameters.`,
          `Review the operational timeline before making overrides.`,
          `Modifications are signed and dispatched to the audit log.`
        ],
        troubleshooting: [
          { q: `Where do changes on the ${docTitle} render?`, a: "All changes are written to the global administrative state and applied in real time to end-user applications." }
        ],
        securityAdvice: "Role-based access determines which options can be modified on this node."
      })
    }
  }, [location.pathname])

  const ToggleIcon = currentGuide.icon || HelpCircle

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg-base text-cream text-[13px] relative font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar />
        
        {/* Main Workspace Frame */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          <Outlet />
        </main>
      </div>

      {/* FLOATING ACTION TRIGGER COMPANION BUTTON */}
      <motion.button 
        id="btn-trigger-companion-drawer"
        drag
        dragMomentum={false}
        onClick={() => setDrawerOpen(!drawerOpen)}
        className={`fixed right-0 z-40 bg-lime text-bg-base font-bold text-[10px] tracking-widest uppercase py-4 px-1 rounded-l-md shadow-[0_4px_24px_rgba(132,204,22,0.25)] hover:bg-lime/90 flex flex-col items-center gap-2 cursor-pointer select-none border-y border-l border-white/20`}
        title="Open interactive operations tutorial companion and system checklists"
        style={{ writingMode: "vertical-lr", top: "50%", transform: "translateY(-50%)", touchAction: "none" }}
      >
        <span className="flex items-center gap-1">
          💡 COMPANION Drawer {drawerOpen ? "▶" : "◀"}
        </span>
      </motion.button>

      {/* COMPANION MANUAL DRAWER SLIDE-OUT */}
      <div 
        id="drawer-companion-manual"
        className={`fixed right-0 top-0 bottom-0 h-full w-[360px] bg-bg-elev border-l border-rule z-50 shadow-2xl flex flex-col transition-all duration-300 transform ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header toolbar */}
        <div className="p-4.5 border-b border-rule flex items-center justify-between bg-bg-paper">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-lime-tint flex items-center justify-center border border-lime/2 w-7 h-7">
              <ToggleIcon className="w-4 h-4 text-lime" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-cream">{currentGuide.title}</h3>
              <p className="text-[10px] text-stone font-medium">{currentGuide.sub}</p>
            </div>
          </div>
          <Button 
            id="btn-close-companion"
            variant="flat" 
            size="icon" 
            className="h-7 w-7 text-stone hover:text-cream cursor-pointer" 
            onClick={() => setDrawerOpen(false)}
            title="Close companion guide panel"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Scrollable checklists area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* Section A: Module summary overview */}
          <div className="space-y-1.5">
            <h4 className="text-[10px] uppercase font-bold text-stone tracking-widest flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-lime" /> Module Intent
            </h4>
            <p className="text-[11px] text-stone leading-relaxed bg-bg-base/40 p-3 rounded border border-rule/50">
              {currentGuide.summary}
            </p>
          </div>

          {/* Section B: Feature checklists */}
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase font-bold text-stone tracking-widest flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-lime" /> Action Checklist
            </h4>
            <div className="space-y-2">
              {currentGuide.steps.map((st, i) => (
                <div key={i} className="flex gap-2 text-[11px] leading-relaxed select-text">
                  <span className="w-4.5 h-4.5 rounded-full bg-bg-paper border border-rule text-lime text-[9px] font-mono flex items-center justify-center shrink-0 font-bold mt-0.5 shadow-sm">
                    {i+1}
                  </span>
                  <span className="text-stone font-medium">{st}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section C: Troubleshooting FAQs */}
          <div className="space-y-2 pt-1">
            <h4 className="text-[10px] uppercase font-bold text-stone tracking-widest flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-lime" /> Operational FAQ
            </h4>
            <div className="space-y-3">
              {currentGuide.troubleshooting.map((qa, i) => (
                <div key={i} className="space-y-1 bg-bg-paper p-3 border border-rule rounded-sm shadow-sm select-text">
                  <h5 className="text-[10.5px] font-bold text-cream">Q: {qa.q}</h5>
                  <p className="text-[10.5px] text-stone font-medium leading-relaxed pl-3 border-l border-lime/30">
                    {qa.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Security / Compliance footer */}
        <div className="p-4 border-t border-rule bg-bg-paper">
          <div className="p-3 bg-bad/5 border border-bad/20 rounded flex gap-2.5 items-start">
            <ShieldCheck className="w-4 h-4 text-bad shrink-0 mt-0.5" />
            <div>
              <h5 className="text-[9.5px] uppercase font-bold text-cream tracking-wide">Executive Security Rule</h5>
              <p className="text-[10px] text-stone leading-relaxed mt-0.5">
                {currentGuide.securityAdvice}
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
