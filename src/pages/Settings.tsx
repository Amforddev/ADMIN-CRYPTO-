import React, { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tooltip } from "@/components/ui/tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Settings as SettingsIcon, 
  Save, 
  Activity, 
  RefreshCw,
  Plus,
  Trash2,
  Check,
  X,
  ShieldCheck,
  AlertTriangle,
  Sliders,
  BellRing,
  BookOpen,
  HelpCircle
} from "lucide-react"

interface KycTier {
  id: string
  name: string
  requirements: string
  dailyLimit: string
  monthlyLimit: string
}

interface AlertProfile {
  id: string
  trigger: string
  channel: string
  active: boolean
}

export default function Settings() {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("Fees")
  const tabs = ["Fees", "System Limits", "Notification Profiles", "General"]

  useEffect(() => {
    const path = location.pathname
    if (path.includes("/limits")) {
      setActiveTab("System Limits")
    } else if (path.includes("/notifications")) {
      setActiveTab("Notification Profiles")
    } else if (path.includes("/general")) {
      setActiveTab("General")
    } else {
      setActiveTab("Fees")
    }
  }, [location.pathname])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (tab === "Fees") {
      navigate("/admin/settings/fees")
    } else if (tab === "System Limits") {
      navigate("/admin/settings/limits")
    } else if (tab === "Notification Profiles") {
      navigate("/admin/settings/notifications")
    } else if (tab === "General") {
      navigate("/admin/settings/general")
    }
  }

  // 1. STATE FOR FEES
  const [makerFee, setMakerFee] = useState("0.10%")
  const [takerFee, setTakerFee] = useState("0.25%")
  const [otcMargin, setOtcMargin] = useState("1.50%")
  const [vipDiscount, setVipDiscount] = useState("20.00%")
  const [btcMarkup, setBtcMarkup] = useState("+10%")
  const [ethMarkup, setEthMarkup] = useState("+15%")
  const [isOverrideEngaged, setIsOverrideEngaged] = useState(false)

  // 2. STATE FOR SYSTEM LIMITS
  const [kycTiers, setKycTiers] = useState<KycTier[]>([
    { id: "1", name: "Tier 1", requirements: "Email, Phone", dailyLimit: "₦50,000", monthlyLimit: "₦200,000" },
    { id: "2", name: "Tier 2", requirements: "BVN, Address", dailyLimit: "₦500,000", monthlyLimit: "₦5,000,000" },
    { id: "3", name: "Tier 3", requirements: "ID Document, Selfie", dailyLimit: "₦5,000,000", monthlyLimit: "₦25,000,000" },
    { id: "4", name: "Pro", requirements: "Enhanced Due Diligence", dailyLimit: "₦50,000,000", monthlyLimit: "Unlimited" },
  ])
  const [editingTier, setEditingTier] = useState<KycTier | null>(null)

  // 3. STATE FOR NOTIFICATION PROFILES
  const [profiles, setProfiles] = useState<AlertProfile[]>([
    { id: "P-1", trigger: "High Value Withdrawal (> $10k)", channel: "Slack (#alerts-treasury), Email", active: true },
    { id: "P-2", trigger: "Hot Wallet < 2%", channel: "PagerDuty (On-Call), Slack (#alerts-infra)", active: true },
    { id: "P-3", trigger: "Sanctions Hit (OFAC)", channel: "Email (compliance@volt.finance), Slack", active: true },
    { id: "P-4", trigger: "New Admin Login", channel: "Audit Log Only", active: false },
  ])
  const [editingProfile, setEditingProfile] = useState<AlertProfile | null>(null)
  const [tempProfileTrigger, setTempProfileTrigger] = useState("")
  const [tempProfileChannels, setTempProfileChannels] = useState("")
  const [isCreatingProfile, setIsCreatingProfile] = useState(false)

  // 4. STATE FOR GENERAL SETTINGS
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [enforce2FA, setEnforce2FA] = useState(true)
  const [requireCryptoSweepApproval, setRequireCryptoSweepApproval] = useState(true)
  const [strictIPWhitelisting, setStrictIPWhitelisting] = useState(false)

  // Toast / Status state
  const [successToast, setSuccessToast] = useState<string | null>(null)
  const [showGlobalGuide, setShowGlobalGuide] = useState(false)

  const triggerToastMsg = (msg: string) => {
    setSuccessToast(msg)
    setTimeout(() => {
      setSuccessToast(null)
    }, 4000)
  }

  // Action: Save Everything 
  const handleSaveChangesGlobal = () => {
    // Collect settings summary to display in Toast for validation
    const changesDescription = `Platform Parameters Persisted and Deployed: Trading limits, fees configurations, notification routes, and ${maintenanceMode ? "ENABLED maintenance mode" : "disabled maintenance mode"}.`
    triggerToastMsg(changesDescription)
  }

  // KYC Editing Triggers
  const openEditTier = (tier: KycTier) => {
    setEditingTier({ ...tier })
  }

  const handleSaveTier = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTier) return
    setKycTiers(prev => prev.map(t => t.id === editingTier.id ? editingTier : t))
    triggerToastMsg(`Successfully updated transaction thresholds for ${editingTier.name}.`)
    setEditingTier(null)
  }

  // Profile triggers
  const openEditProfile = (p: AlertProfile) => {
    setEditingProfile({ ...p })
    setTempProfileTrigger(p.trigger)
    setTempProfileChannels(p.channel)
    setIsCreatingProfile(false)
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProfile) return
    
    setProfiles(prev => prev.map(p => p.id === editingProfile.id ? {
      ...p,
      trigger: tempProfileTrigger,
      channel: tempProfileChannels,
      active: editingProfile.active
    } : p))

    triggerToastMsg(`Notification alert router profile updated successfully.`)
    setEditingProfile(null)
  }

  const handleToggleProfileActiveInline = (pId: string) => {
    setProfiles(prev => prev.map(p => p.id === pId ? { ...p, active: !p.active } : p))
    const item = profiles.find(p => p.id === pId)
    triggerToastMsg(`Alert profile "${item?.trigger}" state toggled.`)
  }

  const openCreateProfile = () => {
    setEditingProfile({ id: `P-${Date.now()}`, trigger: "", channel: "", active: true })
    setTempProfileTrigger("")
    setTempProfileChannels("")
    setIsCreatingProfile(true)
  }

  const handleCreateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tempProfileTrigger.trim() || !tempProfileChannels.trim()) {
      triggerToastMsg("Error: Please provide trigger condition and target channels.")
      return
    }

    const newProf: AlertProfile = {
      id: `P-${Math.floor(100 + Math.random() * 900)}`,
      trigger: tempProfileTrigger,
      channel: tempProfileChannels,
      active: true
    }

    setProfiles(prev => [...prev, newProf])
    triggerToastMsg(`New Alert routing channel added successfully!`)
    setEditingProfile(null)
    setIsCreatingProfile(false)
  }

  const handleDeleteProfile = (id: string, triggerName: string) => {
    if (window.confirm(`Are you sure you want to delete notifications for "${triggerName}"?`)) {
      setProfiles(prev => prev.filter(p => p.id !== id))
      triggerToastMsg(`Deleted alert profile: "${triggerName}"`)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-6rem)] relative font-sans text-cream">
      
      {/* Toast Warning/Success Alerts */}
      {successToast && (
        <div 
          id="toast-settings-success"
          className="fixed bottom-4 right-4 bg-lime text-bg-base font-bold text-xs px-4 py-3 rounded shadow-lg flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 border border-white/20 max-w-md"
        >
          <Check className="w-4 h-4 text-bg-base fill-none stroke-current shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Title block */}
      <div className="flex justify-between items-end shrink-0">
        <div>
           <h1 className="text-xl font-display font-medium text-cream flex items-center gap-2">
             <SettingsIcon className="w-5 h-5 text-lime" />
             Platform Settings
           </h1>
           <p className="text-stone text-xs mt-1">Configure systemic parameters, transactional limits, and warning triggers</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            id="btn-settings-tutorial"
            variant="outline" 
            onClick={() => setShowGlobalGuide(!showGlobalGuide)}
            className="border-rule text-xs h-9 text-stone hover:text-cream cursor-pointer gap-1.5"
            title="Toggle the system administration handbook and tutorial guide"
          >
            <BookOpen className="w-4 h-4 text-stone" /> {showGlobalGuide ? "Hide Manual" : "Help & Tutorial"}
          </Button>

          <Button 
            id="btn-save-settings-global" 
            onClick={handleSaveChangesGlobal}
            className="gap-2 bg-lime text-bg-base hover:bg-lime/95 font-bold text-xs h-9 cursor-pointer"
            title="Deploy current screen values as secure configuration overrides"
          >
            <Save className="w-4 h-4" /> Save Changes
          </Button>
        </div>
      </div>

      {/* HELP CENTER TUTORIAL COMPONENT */}
      {showGlobalGuide && (
        <Card className="bg-lime-tint border border-lime/20 p-4.5 animate-in slide-in-from-top-2 duration-300 shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex gap-2.5">
              <Sliders className="w-5 h-5 text-lime shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-cream uppercase tracking-wider">Settings Administration Master Guide</h3>
                <p className="text-[11px] text-stone mt-1 leading-relaxed">
                  The configurations within this suite adjust global escrow routines, verification tiers, security constraints, and dispatch alarms. 
                  Modify these parameters only with absolute caution:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div className="p-2.5 bg-bg-base/30 border border-rule/30 rounded">
                    <h5 className="text-[10.5px] font-bold text-cream">💸 Trading and Gas Markups</h5>
                    <p className="text-[10px] text-stone mt-0.5">Adjust Maker/Taker ratios and set network blockchain gas markup buffers. Engaging the Emergency Override forces standard gas safety payouts to high-congestion queues.</p>
                  </div>
                  <div className="p-2.5 bg-bg-base/30 border border-rule/30 rounded">
                    <h5 className="text-[10.5px] font-bold text-cream">📈 KYC Identity Tiers</h5>
                    <p className="text-[10px] text-stone mt-0.5">Define outbound limits for verification tiers. Modify required documents for automated clearing by selecting 'Edit' on any limit tier row.</p>
                  </div>
                  <div className="p-2.5 bg-bg-base/30 border border-rule/30 rounded">
                    <h5 className="text-[10.5px] font-bold text-cream">🔔 Alerts Routings</h5>
                    <p className="text-[10px] text-stone mt-0.5">Control where infrastructure alerts land. Channel links automatically integrate Slack back-ends, support mail hubs, or third-party webhooks.</p>
                  </div>
                  <div className="p-2.5 bg-bg-base/30 border border-rule/30 rounded">
                    <h5 className="text-[10.5px] font-bold text-cream">🔐 IP Subnets and 2FA</h5>
                    <p className="text-[10px] text-stone mt-0.5">Toggle maintenance mode to bar external trade gateways in real time. Configure mandatory 2FA security enforcement checks on compliance staff profiles.</p>
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="flat"
              size="icon"
              className="h-6 w-6 text-stone hover:text-cream"
              onClick={() => setShowGlobalGuide(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}
      {/* MASTER CARD TABS PANEL */}
      <Card className="bg-bg-elev border-rule flex flex-col min-h-0 flex-1 relative overflow-hidden">
        {/* Top Tab Bar Navigation */}
        <div className="flex overflow-x-auto border-b border-rule hide-scrollbar shrink-0 px-2 pt-2 bg-bg-paper">
             {tabs.map(tab => (
               <button
                 key={tab}
                 id={`tab-settings-${tab.toLowerCase().replace(/\s+/g, '-')}`}
                 onClick={() => handleTabChange(tab)}
                 className={`px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors cursor-pointer ${activeTab === tab ? 'border-lime text-lime font-bold' : 'border-transparent text-stone hover:text-cream'}`}
                 title={`Configure settings for ${tab}`}
               >
                 {tab === "Fees" && "💸 Trading Fees"}
                 {tab === "System Limits" && "📈 KYC Tier Limits"}
                 {tab === "Notification Profiles" && "🔔 Notification Alerts"}
                 {tab === "General" && "🛡️ General & Security"}
               </button>
             ))}
        </div>

        {/* TAB WORKSPACES CONTAINER */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
           
           {/* TAB 1: TRADING FEES & GAS MARKUPS */}
           {activeTab === "Fees" && (
              <div className="max-w-4xl space-y-8 animate-in fade-in duration-200">
                 <div>
                    <h3 className="text-sm font-medium mb-4 flex items-center gap-2" title="Parameters that dictate commercial commission percentages">
                      Trading Fees (P2P / OTC)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       <div className="space-y-1.5">
                          <Tooltip content="Commission applied to users posting a buy/sell offer in the P2P orderbook (liquidity makers)." position="top">
                            <span className="flex items-center gap-1 cursor-help group text-xs text-stone hover:text-cream transition-colors">
                              <span>Maker Fee (Crypto)</span>
                              <HelpCircle className="w-3.5 h-3.5 text-stone/60 group-hover:text-lime transition-colors" />
                            </span>
                          </Tooltip>
                          <Input 
                            value={makerFee} 
                            onChange={(e) => setMakerFee(e.target.value)}
                            className="font-mono text-sm bg-bg-base" 
                            title="Trading commission for liquidity makers on P2P boards"
                          />
                       </div>
                       <div className="space-y-1.5">
                          <Tooltip content="Commission applied to users immediately matching an existing offer in the P2P orderbook (liquidity takers)." position="top">
                            <span className="flex items-center gap-1 cursor-help group text-xs text-stone hover:text-cream transition-colors">
                              <span>Taker Fee (Crypto)</span>
                              <HelpCircle className="w-3.5 h-3.5 text-stone/60 group-hover:text-lime transition-colors" />
                            </span>
                          </Tooltip>
                          <Input 
                            value={takerFee} 
                            onChange={(e) => setTakerFee(e.target.value)}
                            className="font-mono text-sm bg-bg-base" 
                            title="Trading commission for liquidity takers on P2P boards"
                          />
                       </div>
                       <div className="space-y-1.5">
                          <Tooltip content="Exchange rate premium buffer applied automatically across all Over-The-Counter currency trades." position="top">
                            <span className="flex items-center gap-1 cursor-help group text-xs text-stone hover:text-cream transition-colors">
                              <span>OTC Margin (%)</span>
                              <HelpCircle className="w-3.5 h-3.5 text-stone/60 group-hover:text-lime transition-colors" />
                            </span>
                          </Tooltip>
                          <Input 
                            value={otcMargin} 
                            onChange={(e) => setOtcMargin(e.target.value)}
                            className="font-mono text-sm bg-bg-base" 
                            title="Percent markup buffer auto-spread across OTC integrations"
                          />
                       </div>
                       <div className="space-y-1.5">
                          <Tooltip content="Pre-configured fee discount percent dedicated specifically to authorized corporate list accounts." position="top">
                            <span className="flex items-center gap-1 cursor-help group text-xs text-stone hover:text-cream transition-colors">
                              <span>VIP Rate Discount</span>
                              <HelpCircle className="w-3.5 h-3.5 text-stone/60 group-hover:text-lime transition-colors" />
                            </span>
                          </Tooltip>
                          <Input 
                            value={vipDiscount} 
                            onChange={(e) => setVipDiscount(e.target.value)}
                            className="font-mono text-sm bg-bg-base" 
                            title="Trading rebate discount extended to VIP desks"
                          />
                       </div>
                    </div>
                 </div>
                 
                 <div className="pt-6 border-t border-rule/50">
                    <h3 className="text-sm font-medium mb-4 flex items-center gap-2" title="Fee buffers collected to insulate platform from rapid blockchain shifts">
                      Withdrawal Fees (Network Dynamic)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {/* BTC Markup Row */}
                       <div className="p-4 border border-rule bg-bg-paper rounded-sm flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-bg-base flex items-center justify-center font-medium text-xs text-stone">BTC</div>
                             <div>
                                <h4 className="text-sm font-medium">Bitcoin (BTC)</h4>
                                <p className="text-[10px] text-stone">Auto-adjusted based on mempool depth</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-2">
                             <Tooltip content="Gas multiplier modifier loaded onto dynamic miners fees calculation to guarantee fast processing." position="left">
                               <span className="text-[10px] text-stone hover:text-cream flex items-center gap-1 cursor-help group">
                                 <span>Markup</span>
                                 <HelpCircle className="w-3 h-3 text-stone group-hover:text-lime transition-colors" />
                               </span>
                             </Tooltip>
                             <Input 
                               value={btcMarkup} 
                               onChange={(e) => setBtcMarkup(e.target.value)}
                               className="w-16 h-8 text-center font-mono text-xs bg-bg-base" 
                               title="Percent gas premium loaded into BTC withdrawal calculations"
                             />
                          </div>
                       </div>
                       {/* ETH Markup Row */}
                       <div className="p-4 border border-rule bg-bg-paper rounded-sm flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-bg-base flex items-center justify-center font-medium text-xs text-stone">ETH</div>
                             <div>
                                <h4 className="text-sm font-medium">Ethereum (ERC20)</h4>
                                <p className="text-[10px] text-stone">Auto-adjusted based on base gas gwei</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-2">
                             <Tooltip content="Ethereum ERC-20 multiplier used during network congestion events." position="left">
                               <span className="text-[10px] text-stone hover:text-cream flex items-center gap-1 cursor-help group">
                                 <span>Markup</span>
                                 <HelpCircle className="w-3 h-3 text-stone group-hover:text-lime transition-colors" />
                               </span>
                             </Tooltip>
                             <Input 
                               value={ethMarkup} 
                               onChange={(e) => setEthMarkup(e.target.value)}
                               className="w-16 h-8 text-center font-mono text-xs bg-bg-base" 
                               title="Percent gas premium loaded into Ethereum withdrawal calculations"
                             />
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Emergency Overrides */}
                 <div className="pt-6 border-t border-rule/50 flex items-center justify-between p-4 bg-warn/5 border border-warn/20 rounded-md">
                    <div>
                        <h4 className="text-sm font-medium text-cream flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-warn" />
                          <Tooltip content="Bypasses automatic Oracle rates entirely to enforce hardcoded high fee limits." position="bottom"><span className="flex items-center gap-1 cursor-help">Emergency Fee Override <HelpCircle className="w-3.5 h-3.5 text-stone shrink-0" /></span></Tooltip>
                        </h4>
                        <p className="text-[11px] text-stone max-w-xl">Forces all network withdrawal fees to a static high value during periods of extreme congestion to prevent stuck transactions.</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        const nextState = !isOverrideEngaged
                        setIsOverrideEngaged(nextState)
                        triggerToastMsg(nextState ? "💥 EMERGENCY OVERRIDE ENGAGED! Dynamic withdrawal gas disabled." : "Standard dynamic fee tracking restored.")
                      }}
                      className={`border-warn/50 cursor-pointer ${isOverrideEngaged ? "bg-warn text-white border-none" : "text-warn hover:bg-warn/10"}`}
                      title="Forcibly override dynamic gas rates during blockchain peak congestion"
                    >
                      {isOverrideEngaged ? "Override Engaged" : "Engage Override"}
                    </Button>
                 </div>
              </div>
           )}

           {/* TAB 2: KYC SYSTEM LIMITS */}
           {activeTab === "System Limits" && (
              <div className="max-w-4xl space-y-8 animate-in fade-in duration-200">
                 <div>
                    <div className="flex items-center justify-between mb-4">
                       <h3 className="text-sm font-medium">KYC Tier Limits (Outbound Daily NGN)</h3>
                    </div>
                    <Table>
                       <TableHeader>
                          <TableRow className="border-rule">
                             <TableHead>Tier</TableHead>
                             <TableHead>KYC Requirements</TableHead>
                             <TableHead className="text-right"><Tooltip content="Max withdrawal amount permitted in 24 hours." position="top"><span className="flex items-center gap-1 justify-end cursor-help">Daily Limit <HelpCircle className="w-3 h-3 text-stone shrink-0" /></span></Tooltip></TableHead>
                             <TableHead className="text-right"><Tooltip content="Max withdrawal amount permitted in 30 days." position="top"><span className="flex items-center gap-1 justify-end cursor-help">Monthly Limit <HelpCircle className="w-3 h-3 text-stone shrink-0" /></span></Tooltip></TableHead>
                             <TableHead className="text-right w-24">Actions</TableHead>
                          </TableRow>
                       </TableHeader>
                       <TableBody>
                          {kycTiers.map((t) => (
                             <TableRow key={t.id} className="hover:bg-bg-paper/30 transition-colors">
                                <TableCell className="font-semibold text-xs text-cream">{t.name}</TableCell>
                                <TableCell className="text-stone text-xs">{t.requirements}</TableCell>
                                <TableCell className="text-right font-mono text-xs">{t.dailyLimit}</TableCell>
                                <TableCell className="text-right font-mono text-xs">{t.monthlyLimit}</TableCell>
                                <TableCell className="text-right">
                                  <Tooltip content={`Modify validation parameters and currency limits for verified ${t.name}`} position="left" delay={150}>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => openEditTier(t)}
                                      className="h-7 text-xs text-stone hover:text-lime hover:border-lime/30 cursor-pointer"
                                    >
                                      Edit
                                    </Button>
                                  </Tooltip>
                                </TableCell>
                             </TableRow>
                          ))}
                       </TableBody>
                    </Table>
                 </div>

                 {/* KYC EDIT MODAL POPUP */}
                 {editingTier && (
                   <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-100">
                     <Card className="w-full max-w-md bg-bg-elev border-rule p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                       <div className="flex items-center justify-between mb-4 pb-2 border-b border-rule">
                         <h4 className="text-sm font-bold text-cream">Edit Identity Limits &bull; {editingTier.name}</h4>
                         <Button variant="flat" size="icon" className="h-6 w-6 text-stone hover:text-cream" onClick={() => setEditingTier(null)}>
                           <X className="w-4 h-4" />
                         </Button>
                       </div>
                       
                       <form onSubmit={handleSaveTier} className="space-y-4">
                         <div>
                           <label className="text-[10px] uppercase font-bold text-stone mb-1 block">KYC Verification Requirements</label>
                           <Input 
                             value={editingTier.requirements}
                             onChange={(e) => setEditingTier({ ...editingTier, requirements: e.target.value })}
                             required
                             className="bg-bg-base border-rule text-xs"
                             title="Document validations requested from user"
                           />
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                           <div>
                             <label className="text-[10px] uppercase font-bold text-stone mb-1 block">Daily Outbound Limit</label>
                             <Input 
                               value={editingTier.dailyLimit}
                               onChange={(e) => setEditingTier({ ...editingTier, dailyLimit: e.target.value })}
                               required
                               className="bg-bg-base border-rule text-xs font-mono"
                               title="Maximum payout permitted in a 24-hour interval"
                             />
                           </div>
                           <div>
                             <label className="text-[10px] uppercase font-bold text-stone mb-1 block">Monthly Limit</label>
                             <Input 
                               value={editingTier.monthlyLimit}
                               onChange={(e) => setEditingTier({ ...editingTier, monthlyLimit: e.target.value })}
                               required
                               className="bg-bg-base border-rule text-xs font-mono"
                               title="Maximum payout permitted in a 30-day interval"
                             />
                           </div>
                         </div>

                         <div className="pt-4 border-t border-rule/50 flex items-center justify-end gap-2.5">
                           <Button 
                             type="button" 
                             variant="outline" 
                             onClick={() => setEditingTier(null)}
                             className="h-8 text-xs border-rule text-stone hover:text-cream cursor-pointer"
                           >
                             Cancel
                           </Button>
                           <Button 
                             type="submit" 
                             className="h-8 text-xs bg-lime text-bg-base hover:bg-lime/90 font-bold px-4 cursor-pointer"
                           >
                             Apply Changes
                           </Button>
                         </div>
                       </form>
                     </Card>
                   </div>
                 )}
              </div>
           )}

           {/* TAB 3: NOTIFICATION PROFILES */}
           {activeTab === "Notification Profiles" && (
              <div className="max-w-4xl space-y-8 animate-in fade-in duration-200">
                 <div>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-sm font-medium"><Tooltip content="Outbound notification routing definitions used to bridge server telemetry to messaging systems." position="top"><span className="flex items-center gap-1 cursor-help">System Alerts Routing Channels <HelpCircle className="w-3.5 h-3.5 text-stone shrink-0" /></span></Tooltip></h3>
                        <p className="text-[10px] text-stone mt-0.5">Define routes for real-time infrastructure and compliance failure triggers</p>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={openCreateProfile}
                        className="gap-1 bg-lime text-bg-base font-bold text-xs h-8 cursor-pointer"
                        title="Bind a new system threshold trigger to outbound notification channels"
                      >
                        <Plus className="w-3.5 h-3.5" /> New Alert Profile
                      </Button>
                    </div>

                    <div className="space-y-3.5">
                       {profiles.map((item) => (
                         <div key={item.id} className="flex items-center justify-between p-4 border border-rule rounded-sm bg-bg-paper hover:bg-bg-paper/85 transition-colors">
                            <div>
                               <h4 className="text-[13px] font-medium text-cream flex items-center gap-1.5">
                                 <span className="text-[10px] font-mono text-lime">[{item.id}]</span>
                                 {item.trigger}
                               </h4>
                               <p className="text-[11px] text-stone mt-1">Route to: {item.channel}</p>
                            </div>
                            <div className="flex items-center gap-4">
                               <button
                                 onClick={() => handleToggleProfileActiveInline(item.id)}
                                 className="cursor-pointer"
                                 title="Click to toggle between Active monitoring and Muted logs in real time"
                               >
                                 <Badge variant={item.active ? 'success' : 'outline'} className="text-[9px] cursor-pointer">
                                    {item.active ? 'Active' : 'Muted'}
                                 </Badge>
                               </button>

                               <div className="flex items-center gap-3">
                                 <Tooltip content="Amend trigger statements or target alert channels for this event" position="left" delay={150}>
                                   <span 
                                     onClick={() => openEditProfile(item)}
                                     className="text-[10.5px] font-semibold text-stone cursor-pointer hover:text-lime underline"
                                   >
                                      Edit
                                   </span>
                                 </Tooltip>
                                 <button
                                   onClick={() => handleDeleteProfile(item.id, item.trigger)}
                                   className="text-stone hover:text-bad cursor-pointer"
                                   title="Remove integration rule completely"
                                 >
                                   <Trash2 className="w-3.5 h-3.5" />
                                 </button>
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* NOTIFICATION PROFILE MODAL POPUP */}
                 {editingProfile && (
                   <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-100">
                     <Card className="w-full max-w-md bg-bg-elev border-rule p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                       <div className="flex items-center justify-between mb-4 pb-2 border-b border-rule">
                         <h4 className="text-sm font-bold text-cream">
                           {isCreatingProfile ? "Create Alert Channel Link" : "Modify Alert Target Routings"}
                         </h4>
                         <Button variant="flat" size="icon" className="h-6 w-6 text-stone hover:text-cream" onClick={() => setEditingProfile(null)}>
                           <X className="w-4 h-4" />
                         </Button>
                       </div>

                       <form onSubmit={isCreatingProfile ? handleCreateProfileSubmit : handleSaveProfile} className="space-y-4">
                         <div>
                           <label className="text-[10px] uppercase font-bold text-stone mb-1 block">Trigger Event Condition Name</label>
                           <Input 
                             value={tempProfileTrigger}
                             onChange={(e) => setTempProfileTrigger(e.target.value)}
                             required
                             placeholder="e.g., Cold Wallet Threshold < 10 ETH"
                             className="bg-bg-base border-rule text-xs"
                             title="Systemic anomaly criteria name"
                           />
                         </div>

                         <div>
                           <label className="text-[10px] uppercase font-bold text-stone mb-1 block">Delivery Targets (Comma Separated)</label>
                           <Input 
                             value={tempProfileChannels}
                             onChange={(e) => setTempProfileChannels(e.target.value)}
                             required
                             placeholder="e.g., Slack (#alerts-infra), Discord-Webhook, admin@volt.finance"
                             className="bg-bg-base border-rule text-xs"
                             title="Registered outbound communication networks"
                           />
                         </div>

                         <div>
                           <label className="flex items-center gap-2 cursor-pointer pt-1">
                             <input 
                               type="checkbox" 
                               checked={editingProfile.active}
                               onChange={(e) => setEditingProfile({ ...editingProfile, active: e.target.checked })}
                               className="rounded bg-bg-base border-rule accent-lime"
                             />
                             <span className="text-xs text-cream">Profile Enabled & Monitoring Active</span>
                           </label>
                         </div>

                         <div className="pt-4 border-t border-rule/50 flex items-center justify-end gap-2.5">
                           <Button 
                             type="button" 
                             variant="outline" 
                             onClick={() => setEditingProfile(null)}
                             className="h-8 text-xs border-rule text-stone hover:text-cream cursor-pointer"
                           >
                             Cancel
                           </Button>
                           <Button 
                             type="submit" 
                             className="h-8 text-xs bg-lime text-bg-base hover:bg-lime/90 font-bold px-4 cursor-pointer"
                           >
                             {isCreatingProfile ? "Assemble Profile" : "Save Routing"}
                           </Button>
                         </div>
                       </form>
                     </Card>
                   </div>
                 )}
              </div>
           )}

           {/* TAB 4: GENERAL & SECURITY DEFAULTS */}
           {activeTab === "General" && (
              <div className="max-w-4xl space-y-8 animate-in fade-in duration-200">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Maintenance toggle columns */}
                    <div className="space-y-4">
                       <h3 className="text-[11px] font-bold uppercase tracking-wider text-stone" title="Disable public API endpoints for safety calibration">Platform Maintenance Status</h3>
                       <div className="p-4 border border-rule bg-bg-paper rounded-sm">
                          <div className="flex items-center justify-between mb-2">
                             <span className="text-sm font-semibold text-cream cursor-help"><Tooltip content="Locks down administrative/client API nodes for emergency calibration." position="top"><span className="flex items-center gap-1">Platform Maintenance Mode <HelpCircle className="w-3.5 h-3.5 text-stone shrink-0" /></span></Tooltip></span>
                             
                             {/* Smooth custom interactive switch */}
                             <div 
                               onClick={() => {
                                 const nextVal = !maintenanceMode
                                 setMaintenanceMode(nextVal)
                                 triggerToastMsg(nextVal ? "🚧 MAINTENANCE MODE DEPLOYED. Public ledger interface restricted to Admin Whitelists." : "Platform out of maintenance. Standard transaction flow enabled.")
                               }}
                               className={`w-11 h-6 rounded-full relative transition-colors duration-200 ease-in-out cursor-pointer ${
                                 maintenanceMode ? "bg-lime" : "bg-bg-base border border-rule"
                               }`}
                               title="Click to toggle Maintenance barriers immediately across public client app versions"
                             >
                                <div className={`absolute top-0.5 w-[18px] h-[18px] bg-bg-elev rounded-full shadow-md transition-all duration-200 ease-in-out ${
                                  maintenanceMode ? "right-0.5 translate-x-0 bg-bg-paper" : "left-0.5"
                                }`}></div>
                             </div>
                          </div>
                          <p className="text-[11px] text-stone leading-relaxed">
                            Disables customer logins, trade releases, and new deposits. Internal support staff access credentials remain fully validated.
                          </p>
                       </div>
                    </div>
                    
                    {/* Security defaults checkboxes */}
                    <div className="space-y-4">
                       <h3 className="text-[11px] font-bold uppercase tracking-wider text-stone">Default System Protections</h3>
                       <div className="p-4 border border-rule bg-bg-paper rounded-sm space-y-4">
                          <label className="flex items-center gap-3 cursor-pointer" title="Blocks access to administrators who haven't enabled hardware/software 2FA">
                             <input 
                               type="checkbox" 
                               checked={enforce2FA}
                               onChange={(e) => {
                                 setEnforce2FA(e.target.checked)
                                 triggerToastMsg(`2FA Security Policy is now ${e.target.checked ? 'MANDATORY' : 'RECOMMENDED'} for staff panels.`)
                               }}
                               className="rounded-sm border-rule bg-bg-base accent-lime w-4 h-4 cursor-pointer" 
                             />
                             <Tooltip content="Requires hardware or software Google Authenticator keys for operations access." position="top"><span className="text-xs text-stone hover:text-cream flex items-center gap-1 cursor-help">Enforce 2FA for all Admin Accounts <HelpCircle className="w-3 h-3 text-stone shrink-0" /></span></Tooltip>
                          </label>
                          
                          <label className="flex items-center gap-3 cursor-pointer" title="Direct transfers out of cold ledger indices require dual executive approval sigs">
                             <input 
                               type="checkbox" 
                               checked={requireCryptoSweepApproval}
                               onChange={(e) => {
                                 setRequireCryptoSweepApproval(e.target.checked)
                                 triggerToastMsg(`Crypto Sweeps Dual Approval rule set to ${e.target.checked ? 'STRICT' : 'MUTED'}.`)
                               }}
                               className="rounded-sm border-rule bg-bg-base accent-lime w-4 h-4 cursor-pointer" 
                             />
                             <Tooltip content="Large smart contract multi-sig sweeps must go through dual manager signatures." position="top"><span className="text-xs text-stone hover:text-cream flex items-center gap-1 cursor-help">Require Approval for Crypto Sweeps <HelpCircle className="w-3 h-3 text-stone shrink-0" /></span></Tooltip>
                          </label>
                          
                          <label className="flex items-center gap-3 cursor-pointer" title="Rejects staff logins that trigger outside Whitelisted office IP scopes">
                             <input 
                               type="checkbox" 
                               checked={strictIPWhitelisting}
                               onChange={(e) => {
                                 setStrictIPWhitelisting(e.target.checked)
                                 triggerToastMsg(`Strict IP whitelisting constraints ${e.target.checked ? 'ACTIVATED' : 'SUSPENDED'}.`)
                               }}
                               className="rounded-sm border-rule bg-bg-base accent-lime w-4 h-4 cursor-pointer" 
                             />
                             <Tooltip content="Blocks admin dashboard access from any network outside standard organizational subnet IPs." position="top"><span className="text-xs text-stone hover:text-cream flex items-center gap-1 cursor-help">Strict IP Whitelisting (Admin Panel) <HelpCircle className="w-3 h-3 text-stone shrink-0" /></span></Tooltip>
                          </label>
                       </div>
                    </div>

                 </div>
              </div>
           )}
        </div>
      </Card>
    </div>
  )
}
