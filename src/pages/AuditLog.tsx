import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Search, 
  Download, 
  Filter, 
  X, 
  Check, 
  Layers, 
  Key, 
  Info, 
  ShieldAlert, 
  Terminal, 
  Calendar,
  User,
  Activity,
  ChevronDown,
  Loader2
} from "lucide-react"

interface AuditLogEntry {
  time: string
  id: string
  actor: string
  role: string
  action: string
  target: string
  ip: string
  status: "Success" | "Failed" | "Warning"
  details: Record<string, any>
  node: string
  checksum: string
}

const INITIAL_LOGS: AuditLogEntry[] = [
  { 
    time: "2026-06-03 20:31:12", 
    id: "t_89dm2k1", 
    actor: "Sunday O.", 
    role: "Super Admin", 
    action: "User KYC Tier Override", 
    target: "usr_b2x91p", 
    ip: "197.210.64.122", 
    status: "Success",
    node: "Node US-WEST-2",
    checksum: "8a6e3d2f9b1c7a4d5e0f8c2b7d4e1a0b9c8d7e6f",
    details: {
      action_type: "MANUAL_KYC_OVERRIDE",
      authorized_by: "sunday@volt.finance",
      target_resource: "usr_b2x91p (Sunday Amford)",
      override_from_tier: 1,
      override_to_tier: 3,
      verified_documents: ["Identity Passport Proof of Address", "Facial Liveness Selfie Match"],
      compliance_notes: "Validated local physical certificate and passport hash directly. Passed Tier 3 override limits."
    }
  },
  { 
    time: "2026-06-03 19:15:30", 
    id: "t_ll92jsp", 
    actor: "System Core", 
    role: "Cron", 
    action: "Cold Storage Sweep", 
    target: "Treasury (BTC)", 
    ip: "10.0.4.12", 
    status: "Success",
    node: "Node COMPLIANCE-PRIMARY",
    checksum: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    details: {
      action_type: "VOLT_HOT_WALLET_SWEEP",
      system_module: "Core Treasury Cron v4.1",
      currency: "BTC",
      gas_price_gwei: 34.2,
      sweep_amount: "14.50000000 BTC",
      source_hot_wallet: "0xVoltHotBtcVault_2c91a",
      destination_cold_multisig: "0xVoltColdCustodyBtc_eef12",
      multisig_threshold: "3-of-4 signatories"
    }
  },
  { 
    time: "2026-06-03 18:04:45", 
    id: "t_88mm1k2", 
    actor: "Ngozi A.", 
    role: "Compliance Ops", 
    action: "Account Freeze", 
    target: "usr_94mdx2", 
    ip: "197.210.64.185", 
    status: "Success",
    node: "Node COLD-26",
    checksum: "f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9",
    details: {
      action_type: "USER_COMPLIANCE_SUSPENSION",
      auditor: "ngozi@volt.finance",
      target_user_id: "usr_94mdx2",
      trigger_reason: "High velocity P2P buyer release cancel frequency matches card liquidation fraud signature.",
      dispute_case_link: "case-9418a",
      funds_held_amount: "$12,490.50 USD Equivalent",
      escalated_to: "Sarah Johnson (Compliance Director)"
    }
  },
  { 
    time: "2026-06-03 17:30:00", 
    id: "t_17dj9md", 
    actor: "James M.", 
    role: "Customer Success", 
    action: "Attempt Login", 
    target: "system", 
    ip: "45.12.88.9", 
    status: "Failed",
    node: "Node GATEWAY-SECURE-3",
    checksum: "0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b",
    details: {
      action_type: "ADMIN_PORTAL_LOGIN_ATTEMPT",
      auth_username: "james_musa_temp@volt.finance",
      credential_validation_status: "PASSWORD_MATCH",
      security_failure_reason: "MFA_TOTP_CHALLENGE_TIMEOUT",
      reported_browser: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      geographic_city_origin: "London, UK"
    }
  },
  { 
    time: "2026-06-02 11:22:15", 
    id: "t_33aa91b", 
    actor: "Ade Tolu", 
    role: "Treasury Manager", 
    action: "Gas Limit Adjusted", 
    target: "Ethereum Node", 
    ip: "197.210.65.11", 
    status: "Success",
    node: "Node ETH-18",
    checksum: "bbccddeeff0011223344556677889900aabbccdd",
    details: {
      action_type: "GAS_LIMIT_MODIFICATION",
      operator: "ade@volt.finance",
      blockchain_network: "Ethereum Mainnet (ID: 1)",
      previous_max_fee_gwei: 45.0,
      new_max_fee_gwei: 120.0,
      override_reason: "Network congestion stalling critical P2P release sweeps to cold custody."
    }
  },
  { 
    time: "2026-06-02 09:40:02", 
    id: "t_67bb23c", 
    actor: "Ngozi A.", 
    role: "Compliance Ops", 
    action: "KYC Manual Rejection", 
    target: "usr_77yy2x", 
    ip: "197.210.64.185", 
    status: "Success",
    node: "Node COLD-26",
    checksum: "aabbccddeeff1122334455667788990011223344",
    details: {
      action_type: "KYC_MANUAL_REJECTION",
      operator: "ngozi@volt.finance",
      user_id: "usr_77yy2x",
      rejection_category: "INSUFFICIENT_PROOF_OF_ADDRESS",
      rejection_reason_notes: "Submitted utility bill is older than 90 days threshold. Address lines do not match state credentials."
    }
  },
  { 
    time: "2026-06-01 14:05:00", 
    id: "t_44nn10a", 
    actor: "Sunday O.", 
    role: "Super Admin", 
    action: "Staff Invitation Created", 
    target: "samuel@volt.finance", 
    ip: "197.210.64.122", 
    status: "Success",
    node: "Node US-WEST-2",
    checksum: "5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b",
    details: {
      action_type: "ADMINISTRATIVE_INVITE_SENT",
      inviter_email: "sunday@volt.finance",
      invitee_email: "samuel@volt.finance",
      assigned_role_profile: "Compliance Ops",
      signoff_limitations: ["Standard KYC Verification Only", "No Asset Sweeps Privilege"]
    }
  }
]

export default function AuditLog() {
  const [logs, setLogs] = useState<AuditLogEntry[]>(INITIAL_LOGS)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null)
  
  // Interactive Menu States
  const [activeFilterMenu, setActiveFilterMenu] = useState<"date" | "actor" | "action" | null>(null)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  // Filter selection state values
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("all")
  const [selectedActorFilter, setSelectedActorFilter] = useState<string>("all")
  const [selectedActionType, setSelectedActionType] = useState<string>("all")

  const triggerToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3500)
  }

  // Get distinct actors and actions for filter lists
  const distinctActors = Array.from(new Set(INITIAL_LOGS.map(l => l.actor)))
  const distinctActions = Array.from(new Set(INITIAL_LOGS.map(l => l.action)))

  // Live filter computation
  const filteredLogs = logs.filter(log => {
    // 1. Search text match
    const textQuery = searchQuery.toLowerCase()
    const matchesSearch = 
      log.id.toLowerCase().includes(textQuery) ||
      log.target.toLowerCase().includes(textQuery) ||
      log.action.toLowerCase().includes(textQuery) ||
      log.actor.toLowerCase().includes(textQuery) ||
      log.ip.includes(textQuery)

    // 2. Date match
    let matchesDate = true
    if (selectedDateFilter === "today") {
      matchesDate = log.time.startsWith("2026-06-03")
    } else if (selectedDateFilter === "yesterday") {
      matchesDate = log.time.startsWith("2026-06-02")
    }

    // 3. Actor match
    const matchesActor = selectedActorFilter === "all" || log.actor === selectedActorFilter

    // 4. Action match
    const matchesAction = selectedActionType === "all" || log.action === selectedActionType

    return matchesSearch && matchesDate && matchesActor && matchesAction
  })

  // Clear all filters
  const resetAllFilters = () => {
    setSelectedDateFilter("all")
    setSelectedActorFilter("all")
    setSelectedActionType("all")
    setSearchQuery("")
    triggerToast("All ledger research filters cleared successfully.")
  }

  // Export filtered list to download as CSV document
  const handleExportCSV = () => {
    if (isExporting) return
    setIsExporting(true)
    
    setTimeout(() => {
      let content = "Time (UTC),Trace ID,Actor,Role,Action,Target,IP Address,Node,Status,Cryptographic Checksum\n"
      filteredLogs.forEach(log => {
        content += `"${log.time}","${log.id}","${log.actor}","${log.role}","${log.action}","${log.target}","${log.ip}","${log.node}","${log.status}","${log.checksum}"\n`
      })

      const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `immutable_audit_log_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setIsExporting(false)
      triggerToast(`Successfully packaged and exported ${filteredLogs.length} audit trail rows in CSV format!`)
    }, 1200)
  }

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-6rem)] relative font-sans text-cream">
      
      {/* Top Title Action Header */}
      <div className="flex justify-between items-end shrink-0">
        <div>
           <h1 className="text-xl font-display font-medium text-cream">System Audit Log</h1>
           <p className="text-stone text-xs mt-1">Immutable ledger of all administrative entries and system core actions.</p>
        </div>
        <Button 
          id="btn-export-audit-logs" 
          variant="outline" 
          className="gap-2 border-rule text-cream hover:bg-lime/10 hover:border-lime/40 font-bold uppercase text-xs h-9 tracking-wide"
          onClick={handleExportCSV}
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin text-lime" />
          ) : (
            <Download className="w-4 h-4 text-stone" />
          )}
          {isExporting ? "Compiling Cryptography..." : "Export Logs (CSV)"}
        </Button>
      </div>

      {/* Main Table Card Area */}
      <Card className="bg-bg-elev border-rule flex-1 flex flex-col relative overflow-hidden">
         
         {/* Live toolbar filters */}
         <div className="p-4 border-b border-rule bg-bg-base flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
            
            {/* Filter buttons triggers */}
            <div className="flex flex-wrap items-center gap-2 relative">
               
               {/* 1. Date Filter Dropdown Trigger */}
               <div className="relative">
                  <Button 
                    id="btn-filter-date"
                    variant={selectedDateFilter !== "all" ? "default" : "secondary"} 
                    size="sm" 
                    className={`h-8 text-[11px] font-sans font-semibold uppercase tracking-wider gap-1.5 rounded-sm px-3 ${
                      selectedDateFilter !== "all" ? "bg-lime text-bg-base hover:bg-lime/90" : "bg-bg-paper text-cream border border-rule hover:border-stone/40"
                    }`}
                    onClick={() => setActiveFilterMenu(activeFilterMenu === "date" ? null : "date")}
                  >
                     <Calendar className="w-3.5 h-3.5" /> 
                     Date{selectedDateFilter === "all" ? "" : `: ${selectedDateFilter.toUpperCase()}`}
                     <ChevronDown className="w-3 h-3 opacity-60" />
                  </Button>

                  {activeFilterMenu === "date" && (
                    <div className="absolute left-0 mt-1.5 w-44 bg-bg-elev border border-rule shadow-2xl rounded-sm z-30 py-1 font-sans">
                      <button 
                        type="button"
                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-bg-paper text-cream flex justify-between items-center" 
                        onClick={() => { setSelectedDateFilter("all"); setActiveFilterMenu(null); }}
                      >
                        All Historic Logs {selectedDateFilter === "all" && <Check className="w-3 h-3 text-lime" />}
                      </button>
                      <button 
                        type="button"
                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-bg-paper text-cream flex justify-between items-center" 
                        onClick={() => { setSelectedDateFilter("today"); setActiveFilterMenu(null); }}
                      >
                        Today (June 3) {selectedDateFilter === "today" && <Check className="w-3 h-3 text-lime" />}
                      </button>
                      <button 
                        type="button"
                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-bg-paper text-cream flex justify-between items-center" 
                        onClick={() => { setSelectedDateFilter("yesterday"); setActiveFilterMenu(null); }}
                      >
                        Yesterday (June 2) {selectedDateFilter === "yesterday" && <Check className="w-3 h-3 text-lime" />}
                      </button>
                    </div>
                  )}
               </div>

               {/* 2. Actor Filter Dropdown Trigger */}
               <div className="relative">
                  <Button 
                    id="btn-filter-actor"
                    variant={selectedActorFilter !== "all" ? "default" : "secondary"} 
                    size="sm" 
                    className={`h-8 text-[11px] font-sans font-semibold uppercase tracking-wider gap-1.5 rounded-sm px-3 ${
                      selectedActorFilter !== "all" ? "bg-lime text-bg-base hover:bg-lime/90" : "bg-bg-paper text-cream border border-rule hover:border-stone/40"
                    }`}
                    onClick={() => setActiveFilterMenu(activeFilterMenu === "actor" ? null : "actor")}
                  >
                     <User className="w-3.5 h-3.5" /> 
                     Actor{selectedActorFilter === "all" ? "" : `: ${selectedActorFilter}`}
                     <ChevronDown className="w-3 h-3 opacity-60" />
                  </Button>

                  {activeFilterMenu === "actor" && (
                    <div className="absolute left-0 mt-1.5 w-48 bg-bg-elev border border-rule shadow-2xl rounded-sm z-30 py-1">
                      <button 
                        type="button"
                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-bg-paper text-cream flex justify-between items-center" 
                        onClick={() => { setSelectedActorFilter("all"); setActiveFilterMenu(null); }}
                      >
                        All Staff Actors {selectedActorFilter === "all" && <Check className="w-3 h-3 text-lime" />}
                      </button>
                      {distinctActors.map(act => (
                        <button 
                          key={act}
                          type="button"
                          className="w-full text-left px-3 py-1.5 text-xs hover:bg-bg-paper text-cream flex justify-between items-center" 
                          onClick={() => { setSelectedActorFilter(act); setActiveFilterMenu(null); }}
                        >
                          {act} {selectedActorFilter === act && <Check className="w-3 h-3 text-lime" />}
                        </button>
                      ))}
                    </div>
                  )}
               </div>

               {/* 3. Action Type Filter Dropdown Trigger */}
               <div className="relative">
                  <Button 
                    id="btn-filter-action-type"
                    variant={selectedActionType !== "all" ? "default" : "secondary"} 
                    size="sm" 
                    className={`h-8 text-[11px] font-sans font-semibold uppercase tracking-wider gap-1.5 rounded-sm px-3 ${
                      selectedActionType !== "all" ? "bg-lime text-bg-base hover:bg-lime/90" : "bg-bg-paper text-cream border border-rule hover:border-stone/40"
                    }`}
                    onClick={() => setActiveFilterMenu(activeFilterMenu === "action" ? null : "action")}
                  >
                     <Activity className="w-3.5 h-3.5" /> 
                     Action{selectedActionType === "all" ? "" : `: ${selectedActionType.slice(0, 10)}...`}
                     <ChevronDown className="w-3 h-3 opacity-60" />
                  </Button>

                  {activeFilterMenu === "action" && (
                    <div className="absolute left-0 mt-1.5 w-56 bg-bg-elev border border-rule shadow-2xl rounded-sm z-30 py-1">
                      <button 
                        type="button"
                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-bg-paper text-cream flex justify-between items-center" 
                        onClick={() => { setSelectedActionType("all"); setActiveFilterMenu(null); }}
                      >
                        All Action Types {selectedActionType === "all" && <Check className="w-3 h-3 text-lime" />}
                      </button>
                      {distinctActions.map(actn => (
                        <button 
                          key={actn}
                          type="button"
                          className="w-full text-left px-3 py-1.5 text-xs hover:bg-bg-paper text-cream flex justify-between items-center" 
                          onClick={() => { setSelectedActionType(actn); setActiveFilterMenu(null); }}
                        >
                          {actn} {selectedActionType === actn && <Check className="w-3 h-3 text-lime" />}
                        </button>
                      ))}
                    </div>
                  )}
               </div>

               {/* Clear Filter Badge Trigger */}
               {(selectedDateFilter !== "all" || selectedActorFilter !== "all" || selectedActionType !== "all" || searchQuery !== "") && (
                  <button 
                    type="button"
                    className="text-[10px] text-lime hover:text-white underline underline-offset-4 ml-2 font-mono"
                    onClick={resetAllFilters}
                  >
                    Clear Filter Stack
                  </button>
               )}

            </div>

            {/* Input search locator */}
            <div className="relative w-full md:w-80">
               <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
               <Input 
                 id="input-search-audit"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-9 bg-bg-paper border-rule text-xs h-8 text-cream focus-visible:ring-lime" 
                 placeholder="Search by Trace ID, actor, target metadata..." 
               />
            </div>
         </div>

         {/* Scrollable Table View list */}
         <div className="overflow-y-auto flex-1 h-[calc(100vh-22rem)]">
            <Table>
               <TableHeader>
                  <TableRow className="border-rule text-stone bg-bg-base/30">
                     <TableHead className="w-[18%] text-[11px] font-bold uppercase tracking-wider text-stone">Time (UTC)</TableHead>
                     <TableHead className="w-[12%] text-[11px] font-bold uppercase tracking-wider text-stone">Trace ID</TableHead>
                     <TableHead className="w-[18%] text-[11px] font-bold uppercase tracking-wider text-stone">Actor</TableHead>
                     <TableHead className="w-[22%] text-[11px] font-bold uppercase tracking-wider text-stone">Action Type</TableHead>
                     <TableHead className="w-[12%] text-[11px] font-bold uppercase tracking-wider text-stone">Target Node</TableHead>
                     <TableHead className="w-[10%] text-[11px] font-bold uppercase tracking-wider text-stone">Status</TableHead>
                     <TableHead className="w-[8%] text-[11px] font-bold uppercase tracking-wider text-stone">IP Address</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-48 text-center text-stone text-xs">
                        <Terminal className="w-8 h-8 mx-auto text-stone/40 mb-2" />
                        No secure ledger traces found matching active selection stack.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((row) => (
                       <TableRow 
                         key={row.id} 
                         id={`row-audit-${row.id}`}
                         className="group hover:bg-bg-paper/40 cursor-pointer border-rule text-cream font-sans transition-all"
                         onClick={() => setSelectedLog(row)}
                       >
                          <TableCell className="text-xs text-stone whitespace-nowrap">{row.time}</TableCell>
                          <TableCell className="text-[10px] text-stone font-mono tracking-tight">{row.id}</TableCell>
                          <TableCell>
                             <div className="text-xs font-semibold text-cream group-hover:text-lime transition-colors">{row.actor}</div>
                             <div className="text-[9px] text-stone tracking-wide leading-none">{row.role}</div>
                          </TableCell>
                          <TableCell className="font-semibold text-xs text-cream group-hover:translate-x-1 transition-transform duration-150">
                            {row.action}
                          </TableCell>
                          <TableCell className="text-xs font-mono text-stone">{row.target}</TableCell>
                          <TableCell>
                             <span className={`text-[9px] px-2 py-0.5 rounded-sm font-semibold tracking-wider uppercase border ${
                               row.status === 'Success' 
                                 ? 'bg-good/10 text-good border-good/20' 
                                 : 'bg-bad/10 text-bad border-bad/20'
                             }`}>
                                {row.status}
                             </span>
                          </TableCell>
                          <TableCell className="text-[11px] text-stone font-mono">{row.ip}</TableCell>
                       </TableRow>
                    ))
                  )}
               </TableBody>
            </Table>
         </div>

         {/* Footer audit code signature */}
         <div className="p-3.5 border-t border-rule bg-bg-base/70 text-stone text-[11px] flex justify-between items-center shrink-0">
            <span className="font-mono">LEDGER TAMPER EVIDENCE: ON-CHAIN VERIFIED</span>
            <span>Unfiltered Telemetry Pool: {INITIAL_LOGS.length} items</span>
         </div>
      </Card>

      {/* Forensic Audit Trace Details Right-Side Flyout / Sheet Modal */}
      {selectedLog && (
        <div id="modal-audit-detail" className="fixed inset-0 bg-bg-base/75 backdrop-blur-sm z-50 flex items-center justify-end p-0 animate-in fade-in duration-150">
          <div className="bg-bg-elev border-l border-rule shadow-2xl h-full w-full max-w-xl overflow-y-auto animate-in slide-in-from-right duration-150 flex flex-col justify-between">
            
            {/* Scrollable Upper Body */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              
              {/* Header */}
              <div className="p-4 border-b border-rule bg-bg-paper flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-stone tracking-widest flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-lime" />
                  Forensic Trace Analysis
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-stone hover:text-cream rounded-sm" onClick={() => setSelectedLog(null)}>
                  <X className="w-4.5 h-4.5" />
                </Button>
              </div>

              {/* Forensic Details Body container */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                
                {/* Visual Metadata Panel banner */}
                <div className="bg-bg-base border border-rule/80 rounded-sm p-4 relative overflow-hidden">
                  <div className="absolute right-2 top-2">
                    <Layers className="w-20 h-20 text-rule/25 -mr-4 -mt-4" />
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-mono uppercase bg-bg-paper border border-rule text-lime px-2 py-0.5 rounded">
                      Trace: {selectedLog.id}
                    </span>
                    <span className="text-[9px] font-mono text-stone">
                      Block: {selectedLog.node}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-cream tracking-tight mt-1 leading-tight">{selectedLog.action}</h3>
                  <p className="text-xs text-stone mt-1.5">Executed on <span className="text-cream font-mono">{selectedLog.time} UTC</span> from IP workstation <code className="text-cream bg-bg-paper px-1 rounded">{selectedLog.ip}</code>.</p>
                </div>

                {/* Actor & Security Identity scope */}
                <div>
                  <h4 className="text-[9px] font-extrabold uppercase tracking-wider text-stone mb-2">Actor Identity Signature</h4>
                  <div className="grid grid-cols-2 gap-3 bg-bg-base/30 p-3.5 border border-rule/60 rounded-sm">
                    <div>
                      <span className="text-[9px] text-stone uppercase font-bold block">Operator Handle</span>
                      <span className="text-xs font-semibold text-cream">{selectedLog.actor}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-stone uppercase font-bold block">Security Role Clearance</span>
                      <span className="text-xs font-semibold text-lime">{selectedLog.role}</span>
                    </div>
                  </div>
                </div>

                {/* Complete cryptographic checksum hashes */}
                <div>
                  <h4 className="text-[9px] font-extrabold uppercase tracking-wider text-stone mb-2">SHA-256 Block Checksum Signature</h4>
                  <div className="bg-bg-base/70 p-3.5 border border-dashed border-rule rounded-sm font-mono text-[10px] text-stone break-all">
                    <div className="flex items-center gap-1.5 text-lime mb-1 leading-none font-sans font-bold text-[9px] uppercase tracking-wider">
                      <Key className="w-3.5 h-3.5" /> SHA256 HEX DIGEST VALUE
                    </div>
                    {selectedLog.checksum}
                  </div>
                </div>

                {/* Complete JSON Payload details inspector */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[9px] font-extrabold uppercase tracking-wider text-stone">Trace Data Payload Ledger (JSON)</h4>
                    <span className="text-[9px] text-stone font-mono bg-bg-paper px-2 py-0.5 rounded border border-rule">Structure Format: Raw Map</span>
                  </div>
                  <div className="bg-bg-paper border border-rule rounded-sm p-4 overflow-x-auto relative min-h-[160px]">
                    <pre className="text-[10px] font-mono text-lime leading-relaxed">
                      {JSON.stringify(selectedLog.details, null, 2)}
                    </pre>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Panel Actions */}
            <div className="p-4 bg-bg-paper border-t border-rule flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5 text-[10px] text-stone font-sans">
                <Info className="w-3.5 h-3.5 text-lime" />
                <span>On-chain immutable proof.</span>
              </div>
              <Button 
                variant="secondary"
                id="btn-close-audit-detail"
                className="h-8.5 rounded-sm text-xs text-cream hover:bg-bg-base border border-rule hover:border-stone/40 px-5 uppercase font-bold tracking-wider"
                onClick={() => setSelectedLog(null)}
              >
                Close Forensics Panel
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* Floating Action Notifications Toast */}
      {toastMsg && (
        <div id="toast-audit-msg" className="fixed bottom-4 right-4 bg-lime text-bg-base font-bold text-xs px-4 py-3 rounded shadow-lg flex items-center gap-2.5 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 border border-white/20">
          <Check className="w-3.5 h-3.5 stroke-[3] text-bg-base" />
          <span>{toastMsg}</span>
          <button onClick={() => setToastMsg(null)} className="ml-2 hover:opacity-80">
            <X className="w-3 h-3 text-bg-base" />
          </button>
        </div>
      )}

    </div>
  )
}
