import React, { useState, FormEvent } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Bell, 
  Send, 
  Trash2, 
  Filter, 
  Plus, 
  Volume2, 
  Radio, 
  Check, 
  Mail, 
  MessageSquare, 
  Slack, 
  AlertTriangle, 
  Info, 
  ShieldAlert, 
  History, 
  CloudLightning,
  X,
  PlusCircle,
  Clock,
  ExternalLink,
  Users
} from "lucide-react"

interface SystemAlarm {
  id: string
  trigger: string
  severity: "critical" | "warning" | "info"
  source: string
  timestamp: string
  status: "active" | "cleared" | "investigating"
  actionsTaken?: string
}

interface DispatchTemplate {
  id: string
  title: string
  category: "Push Notification" | "Email Blast" | "System Announcement" | "Sms Alert"
  content: string
  deliveries: number
  readRate: string
}

const INITIAL_ALARMS: SystemAlarm[] = [
  { id: "ALM-902", trigger: "Hot Wallet liquidity fell below 12% safety threshold", severity: "warning", source: "wallet-svc", timestamp: "2026-06-03 21:15:30", status: "active" },
  { id: "ALM-801", trigger: "KYC Sanctions hit triggered on user @chinonso.bvn (OFAC List match)", severity: "critical", source: "compliance-svc", timestamp: "2026-06-03 20:41:12", status: "investigating" },
  { id: "ALM-744", trigger: "Administrative session initiated from outside office subnet subnets", severity: "info", source: "auth-svc", timestamp: "2026-06-03 18:32:00", status: "cleared", actionsTaken: "MFA challenge completed successfully." },
  { id: "ALM-419", trigger: "P2P escrow release SLA breached (Dispute #410)", severity: "critical", source: "trade-svc", timestamp: "2026-06-03 15:10:45", status: "active" },
  { id: "ALM-101", trigger: "Database write execution latency peaked at 1.4s on node pool", severity: "warning", source: "infra-monitor", timestamp: "2026-06-03 14:02:11", status: "cleared", actionsTaken: "Read replica switched automatically." }
]

const INITIAL_TEMPLATES: DispatchTemplate[] = [
  { id: "TMP-01", title: "KYC Compliance Restructuring", category: "Email Blast", content: "Dear user, to comply with newly enacted financial regulations, we are restructuring our tier-limit metrics. Please audit your BVN registrations on the dashboard.", deliveries: 14201, readRate: "42.1%" },
  { id: "TMP-02", title: "Smart Contract Escrow Lock Alert", category: "Push Notification", content: "Your P2P order stablecoins are locked in secure escrows. Do not send fiat until you verify counterparty state.", deliveries: 840, readRate: "89.2%" },
  { id: "TMP-03", title: "Scheduled Hard Fork Maintenance", category: "System Announcement", content: "The Ethereum and Tron hot channels will undergo network calibration tonight at 02:00 UTC. Deposits will be suspended.", deliveries: 94030, readRate: "51.4%" }
]

export default function Notifications() {
  const [alarms, setAlarms] = useState<SystemAlarm[]>(INITIAL_ALARMS)
  const [templates, setTemplates] = useState<DispatchTemplate[]>(INITIAL_TEMPLATES)
  
  // Tab states
  const [activeTab, setActiveTab] = useState<"Alarms" | "Broadcast" | "Templates">("Alarms")
  const [alarmFilter, setAlarmFilter] = useState<"all" | "critical" | "warning" | "info">("all")
  
  // Custom Alert Trigger Form
  const [targetCategory, setTargetCategory] = useState<"Push Notification" | "Email Blast" | "System Announcement" | "Sms Alert">("Push Notification")
  const [alertTitle, setAlertTitle] = useState("")
  const [alertContent, setAlertContent] = useState("")
  const [targetTiers, setTargetTiers] = useState("All Users")
  
  // Modal / Feedback state
  const [feedback, setFeedback] = useState<string | null>(null)
  const [activeTutorial, setActiveTutorial] = useState(false)

  const triggerToast = (msg: string) => {
    setFeedback(msg)
    setTimeout(() => setFeedback(null), 3500)
  }

  // Handle Dispatch Broadcast
  const handleDispatch = (e: FormEvent) => {
    e.preventDefault()
    if (!alertTitle.trim() || !alertContent.trim()) {
      triggerToast("Please provide both message title and descriptions.")
      return
    }

    const templateId = `TMP-${Math.floor(10 + Math.random() * 90)}`
    const newTemplate: DispatchTemplate = {
      id: templateId,
      title: alertTitle,
      category: targetCategory,
      content: alertContent,
      deliveries: Math.floor(100 + Math.random() * 1000),
      readRate: `${(30 + Math.random() * 60).toFixed(1)}%`
    }

    setTemplates(prev => [newTemplate, ...prev])
    setAlertTitle("")
    setAlertContent("")
    triggerToast(`Broadcast "${alertTitle}" queued and transmitted successfully via secure gateways!`)
    setActiveTab("Templates")
  }

  // Clear specific system alarm
  const handleClearAlarm = (alarmId: string) => {
    setAlarms(prev => prev.map(a => {
      if (a.id === alarmId) {
        return { ...a, status: "cleared", actionsTaken: "Cleared manually by Super Admin." }
      }
      return a
    }))
    triggerToast(`Administrative Alarm ${alarmId} resolved and logged to Audit ledger.`)
  }

  // Filter alarms
  const filteredAlarms = alarms.filter(a => {
    if (alarmFilter === "all") return true
    return a.severity === alarmFilter
  })

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-6rem)] relative font-sans text-cream">
      
      {/* Header Area */}
      <div className="flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-xl font-display font-medium text-cream flex items-center gap-2">
            <Bell className="w-5 h-5 text-lime animate-pulse" />
            Notifications & Alerts Hub
          </h1>
          <p className="text-stone text-xs mt-1">
            Dispatch urgent platform messages, check service webhook deliveries, and view real-time compliance/systemic alarms.
          </p>
        </div>
        <Button 
          id="btn-toggle-notif-tutorial"
          variant="outline"
          className="gap-2 border-rule text-xs h-9 hover:bg-bg-paper text-stone hover:text-cream font-mono cursor-pointer"
          onClick={() => setActiveTutorial(!activeTutorial)}
          title="Click to expand/collapse module training manual"
        >
          💡 {activeTutorial ? "Hide Guide" : "Manual & Guide"}
        </Button>
      </div>

      {feedback && (
        <div 
          id="toast-notification-success"
          className="fixed bottom-4 right-4 bg-lime text-bg-base font-bold text-xs px-4 py-3 rounded shadow-lg flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 border border-white/20"
        >
          <Check className="w-4 h-4 text-bg-base fill-none stroke-current" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Accordion Guide / Tutorial Section */}
      {activeTutorial && (
        <Card className="bg-lime-tint border border-lime/20 p-4.5 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-start justify-between">
            <div className="flex gap-2.5">
              <Radio className="w-5 h-5 text-lime shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-cream uppercase tracking-wider">Operational Guide: Admin Messaging & Systemic Alarms</h3>
                <p className="text-[11px] text-stone mt-1 leading-relaxed">
                  The Notifications & Alerts module serves as the primary terminal for administrative dispatches and infrastructure status. 
                  Use this console to execute the following systemic tasks:
                </p>
                <ul className="list-disc list-inside text-[10px] text-stone mt-2.5 space-y-1 pl-1">
                  <li><strong className="text-cream">System Alarms:</strong> Monitor warning pulses triggered by automatic back-end monitors. High OFAC sanctions matches or critical low liquidities in hot-wallets trigger immediate notifications that need manual audit controls as shown.</li>
                  <li><strong className="text-cream">Custom Broadcast Dispatches:</strong> Construct in-app notifications, sms warnings, and global screen banners. Select target tiers securely to avoid blasting high-latency alerts to non-authorized desks.</li>
                  <li><strong className="text-cream">Telemetry Logging:</strong> Keep trace of transmission delivery indices and historical read rates on all user profiles.</li>
                </ul>
              </div>
            </div>
            <Button
              variant="flat"
              size="icon"
              className="h-6 w-6 text-stone hover:text-cream"
              onClick={() => setActiveTutorial(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Grid structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Hand Terminal panel */}
        <div className="lg:col-span-8 flex flex-col gap-4 min-h-0">
          
          <Card className="bg-bg-elev border-rule flex flex-col min-h-0 flex-1 relative overflow-hidden">
            {/* Top Tab Switch */}
            <div className="flex overflow-x-auto border-b border-rule shrink-0 bg-bg-paper px-2 pt-2">
              {(["Alarms", "Broadcast", "Templates"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                    activeTab === tab ? "border-lime text-lime" : "border-transparent text-stone hover:text-cream"
                  }`}
                  title={`Toggle to the ${tab} management panel`}
                >
                  {tab === "Alarms" && `🔴 System Alarms (${filteredAlarms.length})`}
                  {tab === "Broadcast" && "📣 Send Broadcast Dispatch"}
                  {tab === "Templates" && "📄 Template Registry"}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: ALARMS FEED */}
            {activeTab === "Alarms" && (
              <div className="p-4 flex flex-col flex-1 overflow-hidden min-h-0">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-stone" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-stone">Filter Alarms by Threat Class</span>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    {(["all", "critical", "warning", "info"] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setAlarmFilter(lvl)}
                        className={`px-2.5 py-0.5 rounded-sm text-[9.5px] font-bold uppercase transition-all border border-rule cursor-pointer ${
                          alarmFilter === lvl 
                            ? "bg-bg-high text-lime border-stone/50 font-extrabold" 
                            : "bg-bg-paper text-stone hover:text-cream hover:border-stone/30"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-y-auto flex-1 min-h-0 space-y-2.5 pr-1">
                  {filteredAlarms.map(alarm => {
                    const sevColors = {
                      critical: "border-bad/40 text-bad bg-bad/5 shadow-[inset_0_0_12px_rgba(239,68,68,0.03)]",
                      warning: "border-warn/40 text-warn bg-warn/5 shadow-[inset_0_0_12px_rgba(245,158,11,0.03)]",
                      info: "border-info/40 text-info bg-info/5 shadow-[inset_0_0_12px_rgba(59,130,246,0.03)]"
                    }

                    return (
                      <div 
                        key={alarm.id}
                        className={`p-4 border rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${sevColors[alarm.severity]}`}
                        title="Comprehensive threat monitor alert pulse node"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`text-[8.5px] uppercase tracking-widest px-1.5 py-0 h-4 border-current hover:bg-transparent ${
                              alarm.severity === "critical" ? "text-bad" : alarm.severity === "warning" ? "text-warn" : "text-info"
                            }`}>
                              {alarm.severity}
                            </Badge>
                            <span className="text-[10.5px] font-mono text-cream/70 font-semibold">{alarm.id} &bull; Channel: {alarm.source}</span>
                            <span className="text-[9px] font-mono text-stone">&bull; {alarm.timestamp}</span>
                          </div>
                          <p className="text-xs font-semibold text-cream leading-snug">
                            {alarm.trigger}
                          </p>
                          {alarm.actionsTaken && (
                            <p className="text-[10px] text-stone font-mono bg-bg-base/40 p-1.5 rounded-sm border border-rule/30 mt-1.5">
                              ✔️ Operational Resolve Action: {alarm.actionsTaken}
                            </p>
                          )}
                        </div>

                        {alarm.status !== "cleared" ? (
                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <span className="text-[9px] font-mono italic text-stone animate-pulse">Waiting Audit Resolve...</span>
                            <Button
                              id={`btn-clear-alarm-${alarm.id}`}
                              variant="outline"
                              onClick={() => handleClearAlarm(alarm.id)}
                              className="h-7 text-[10px] uppercase font-bold tracking-wider px-3 border-rule hover:border-lime/40 text-cream hover:bg-bg-paper hover:text-lime cursor-pointer"
                              title="Resolve alert trigger and register actions to secure ledger"
                            >
                              Resolve Alarm
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[9px] font-mono uppercase bg-good/15 text-good border border-good/20 px-2 py-0.5 rounded-sm shrink-0">
                            Closed
                          </span>
                        )}
                      </div>
                    )
                  })}

                  {filteredAlarms.length === 0 && (
                    <div className="text-center py-16 text-stone text-xs">
                      No system alarms found matching selected parameters.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: SEND DISPATCH */}
            {activeTab === "Broadcast" && (
              <form onSubmit={handleDispatch} className="p-6 space-y-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-stone tracking-wider block mb-1" title="Method of delivery channel">Delivery Gateway Channels</label>
                    <select
                      id="dispatch-category-select"
                      value={targetCategory}
                      onChange={(e) => setTargetCategory(e.target.value as any)}
                      className="w-full h-9 bg-bg-base border border-rule rounded-sm text-xs px-2.5 text-cream outline-none focus:border-stone"
                    >
                      <option value="Push Notification">📱 In-App Push Notification</option>
                      <option value="Email Blast">✉️ Dedicated Email Blast</option>
                      <option value="System Announcement">📣 Sticky Screen Banner</option>
                      <option value="Sms Alert">💬 Carrier SMS Alert</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-stone tracking-wider block mb-1">Target Recipient Audience</label>
                    <select
                      id="dispatch-audience-select"
                      value={targetTiers}
                      onChange={(e) => setTargetTiers(e.target.value)}
                      className="w-full h-9 bg-bg-base border border-rule rounded-sm text-xs px-2.5 text-cream outline-none focus:border-stone"
                    >
                      <option value="All Users">All Registered User Profiles</option>
                      <option value="KYC Tier 1">Verification Tier 1 Only</option>
                      <option value="KYC Tier 2">Verification Tier 2 Only</option>
                      <option value="KYC Tier 3 & VIP">Tier 3 / High Volume Desk VIPs</option>
                      <option value="Administrative Teams">Only Staff & Support Clerks</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-stone tracking-wider block mb-1">Message Broadcast Subject Title</label>
                  <Input
                    id="broadcast-title-input"
                    value={alertTitle}
                    onChange={(e) => setAlertTitle(e.target.value)}
                    required
                    placeholder="e.g., Mandatory Security Verification Upgrades (BVN Crosschecks)"
                    className="bg-bg-base border-rule text-xs h-9 text-cream focus-visible:ring-lime w-full"
                    title="User facing message subject title"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-stone tracking-wider block mb-1">Interactive Content Body</label>
                  <textarea
                    id="broadcast-content-textarea"
                    value={alertContent}
                    onChange={(e) => setAlertContent(e.target.value)}
                    required
                    rows={6}
                    placeholder="Specify payment timelines, platform changes, or critical warning details..."
                    className="w-full bg-bg-base border border-rule rounded-sm text-xs p-3 text-cream focus:border-stone focus:outline-none focus:ring-1 focus:ring-lime/40 placeholder:text-stone/55"
                    title="Full text description of dispatch broadcast"
                  />
                </div>

                <div className="pt-4 border-t border-rule flex items-center justify-between">
                  <span className="text-[9.5px] font-mono text-stone">
                    🔒 Transmitted via standard AES security wrapping.
                  </span>
                  <Button
                    id="btn-trigger-dispatch"
                    type="submit"
                    className="h-9 text-xs bg-lime text-bg-base hover:bg-lime/90 font-bold uppercase tracking-wider px-6 cursor-pointer"
                    title="Transmit message through designated API node pools"
                  >
                    <Send className="w-3.5 h-3.5 mr-1" /> Deploy System Outbound
                  </Button>
                </div>
              </form>
            )}

            {/* TAB CONTENT: TEMPLATES REGISTRY */}
            {activeTab === "Templates" && (
              <div className="p-4 flex flex-col flex-1 overflow-hidden min-h-0">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-rule">
                  <span className="text-[10.5px] font-bold uppercase text-stone tracking-wider">Configured Messaging Templates ({templates.length})</span>
                  <Badge className="text-[9px] bg-bg-paper text-lime">Active Registers</Badge>
                </div>

                <div className="overflow-y-auto flex-1 min-h-0 space-y-3.5 pr-1">
                  {templates.map(t => (
                    <Card key={t.id} className="p-4 bg-bg-paper border-rule flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="space-y-1 bg-transparent">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-lime font-medium">{t.id}</span>
                          <span className="text-[10px] bg-bg-elev px-2 py-0.5 border border-rule font-bold text-stone rounded-sm uppercase">{t.category}</span>
                        </div>
                        <h4 className="text-xs font-bold text-cream mt-1">{t.title}</h4>
                        <p className="text-[11px] text-stone mt-1.5 leading-relaxed bg-bg-base/30 p-2 border border-rule/30 rounded-sm">
                          {t.content}
                        </p>
                      </div>

                      <div className="text-right flex flex-col shrink-0 min-w-[80px]">
                        <span className="text-[10px] text-stone font-mono uppercase font-bold">Total Delivered</span>
                        <span className="text-sm font-mono font-bold text-cream">{t.deliveries.toLocaleString()}</span>
                        <span className="text-[9.5px] text-lime font-mono mt-1.5">Open Rate: {t.readRate}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Hand Telemetry Dashboard Panel */}
        <div className="lg:col-span-4 flex flex-col gap-4 min-h-0 overflow-y-auto">
          
          {/* Dispatch Metrics */}
          <Card className="bg-bg-elev border-rule p-4 flex flex-col shrink-0">
            <h3 className="text-[10.5px] font-bold uppercase tracking-widest text-stone flex items-center gap-1.5 pb-2 mb-3 border-b border-rule">
              <CloudLightning className="w-4 h-4 text-lime" /> Alert Delivery Telemetry
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-bg-paper border border-rule rounded-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-stone block">Firebase Cloud (FCM)</span>
                  <span className="text-[10px] text-stone">Hot user pushes</span>
                </div>
                <Badge variant="success" className="text-[8.5px] font-bold">Good (99.8%)</Badge>
              </div>

              <div className="p-3 bg-bg-paper border border-rule rounded-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-stone block">Twilio Carrier Gateway</span>
                  <span className="text-[10px] text-stone">Urgent SMS triggers</span>
                </div>
                <Badge variant="success" className="text-[8.5px] font-bold">Good (98.4%)</Badge>
              </div>

              <div className="p-3 bg-bg-paper border border-rule rounded-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-stone block">Amazon SES Server</span>
                  <span className="text-[10px] text-stone">Weekly bulk email blasts</span>
                </div>
                <Badge variant="warning" className="text-[8.5px] font-bold">Latency (91.1%)</Badge>
              </div>
            </div>
          </Card>

          {/* Service Routing Protocols Card */}
          <Card className="bg-bg-elev border-rule p-4 flex flex-col flex-1 min-h-[220px]">
            <h3 className="text-[10.5px] font-bold uppercase tracking-widest text-stone flex items-center gap-1.5 pb-2 mb-3 border-b border-rule" title="Configure specific support routing procedures">
              🔔 Operator Notification Profiles
            </h3>
            <p className="text-[11px] text-stone leading-relaxed mb-4">
              Operational alert escalations are systematically dispatched to on-call support engineers inside Discord / Slack. Customize profiles inside Settings to tune triggers.
            </p>

            <div className="space-y-3 overflow-y-auto flex-1">
              {[
                { title: "Escalation Queue Team Alpha", route: "Slack/PagerDuty", users: 5 },
                { title: "Automated Bot Dispatch Tier", route: "Platform Webhook", users: 1 },
                { title: "Compliance OFAC Desk", route: "Compliance Email Hub", users: 3 },
              ].map((group, idx) => (
                <div key={idx} className="p-3 bg-bg-paper border border-rule rounded-sm flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-semibold text-cream">{group.title}</h4>
                    <span className="text-[10px] text-stone font-mono">Routing: {group.route}</span>
                  </div>
                  <Badge variant="outline" className="text-[8.5px] font-bold font-mono text-lime bg-lime-tint">
                    {group.users} engineers
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

        </div>

      </div>

    </div>
  )
}
