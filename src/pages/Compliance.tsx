import { useState, useRef, useEffect, ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, ShieldAlert, Flag, FileText, ArrowRight, User, AlertTriangle, AlertCircle, Calendar, Activity, CheckCircle, Navigation, Shield, UserX, X, Mail, Lock } from "lucide-react"

const MOCK_ALERTS = [
  { id: "alt_1", title: "Structuring: Multiple sub-limit deposits", user: "Adekunle M.", severity: "critical", age: "12m", rule: "AML_004", assignee: "Unassigned", desc: "User has performed 5 deposits of ₦450,000 in the last 2 hours to avoid the ₦500k KYC enhanced verification limit." },
  { id: "alt_2", title: "Velocity anomaly on P2P buys", user: "Chioma D.", severity: "warning", age: "1h 4m", rule: "AML_012", assignee: "Ade M.", desc: "User completed 12 P2P buys within a 1-hour window from multiple unknown counter-parties." },
  { id: "alt_3", title: "Sudden high-value withdrawal after crypto deposit", user: "Ibrahim M.", severity: "critical", age: "2h 15m", rule: "AML_008", assignee: "Sunday O.", desc: "Deposited 2.5 BTC and immediately requested fiat withdrawal to a newly linked bank account." },
  { id: "alt_4", title: "Account dormant for 6mo resumed active trading", user: "Grace K.", severity: "info", age: "1d", rule: "KYC_011", assignee: "Unassigned", desc: "Account flagged for inactivity check after trading resumed with high volume following 6 months dormancy." },
]

function Dropdown({ children, trigger, open, onClickOutside }: { children: ReactNode, trigger: ReactNode, open: boolean, onClickOutside: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClickOutside()
      }
    }
    if (open) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open, onClickOutside])
  
  return (
    <div className="relative inline-block" ref={ref}>
      {trigger}
      {open && (
        <div className="absolute top-full left-0 mt-1 w-40 bg-bg-elev border border-rule rounded-md shadow-lg z-50 overflow-hidden py-1">
          {children}
        </div>
      )}
    </div>
  )
}

function AssignDropdown({ currentAssignee, onAssign }: { currentAssignee: string, onAssign: (name: string) => void }) {
  const [open, setOpen] = useState(false)
  const staff = ["Sunday O.", "Ade M.", "Ngozi A.", "James C."]
  return (
    <Dropdown 
      open={open} 
      onClickOutside={() => setOpen(false)}
      trigger={
        currentAssignee === 'Unassigned' 
          ? <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>Assign</Button>
          : <span onClick={(e) => { e.stopPropagation(); setOpen(!open); }} className="text-[11px] px-2 py-0.5 bg-bg-paper rounded border border-rule text-stone cursor-pointer hover:border-lime/50 transition-colors">{currentAssignee}</span>
      }
    >
      {staff.map(s => (
        <div key={s} onClick={(e) => { e.stopPropagation(); onAssign(s); setOpen(false); }} className="px-3 py-1.5 text-xs hover:bg-bg-paper cursor-pointer text-cream">
          {s}
        </div>
      ))}
      <div onClick={(e) => { e.stopPropagation(); onAssign("Unassigned"); setOpen(false); }} className="px-3 py-1.5 text-xs hover:bg-bg-paper cursor-pointer text-stone border-t border-rule mt-1">
        Unassign
      </div>
    </Dropdown>
  )
}

export default function Compliance() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("Alerts")
  const tabs = ["Alerts", "Sanctions", "Reports"]
  
  const [alerts, setAlerts] = useState(MOCK_ALERTS)
  const [selectedAlert, setSelectedAlert] = useState<any>(null)
  
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  
  const [viewingSanction, setViewingSanction] = useState(false)
  const [creatingSAR, setCreatingSAR] = useState(false)

  // Interactive flow states
  const [showSowModal, setShowSowModal] = useState(false)
  const [showFreezeModal, setShowFreezeModal] = useState(false)
  const [showResolveModal, setShowResolveModal] = useState(false)
  const [showEscalateModal, setShowEscalateModal] = useState(false)
  
  // Custom states tracking simulation variables
  const [completedWorkflows, setCompletedWorkflows] = useState<Record<string, Record<string, boolean>>>({})
  const [escalatedAlerts, setEscalatedAlerts] = useState<Record<string, boolean>>({})
  const [frozenUsers, setFrozenUsers] = useState<Record<string, boolean>>({})
  const [notification, setNotification] = useState<string | null>(null)

  // Suspicious Activity Report (SAR) form states
  const [sarUser, setSarUser] = useState("")
  const [sarDate, setSarDate] = useState("2026-06-02")
  const [sarAmt, setSarAmt] = useState("")
  const [sarType, setSarType] = useState("Structuring / Smurfing")
  const [sarDesc, setSarDesc] = useState("")

  // Auto-clear notification toast
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  if (selectedAlert) {
    const works = completedWorkflows[selectedAlert.id] || {}
    const isEscalated = escalatedAlerts[selectedAlert.id]
    const isUserFrozen = frozenUsers[selectedAlert.user]

    return (
      <div className="flex flex-col h-[calc(100vh-6rem)] -mx-2 -mt-2 bg-bg-base border border-rule rounded-sm overflow-hidden relative">
        {/* Floating Notification Toast */}
        {notification && (
          <div id="compliance-notif-toast" className="absolute top-4 right-4 bg-bg-elev border-l-4 border-lime text-cream p-3 text-xs rounded shadow-2xl z-50 flex items-center justify-between gap-3 animate-fade-in animate-in slide-in-from-top-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-lime" />
              <span>{notification}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-stone hover:text-cream ml-2">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="p-4 border-b border-rule flex items-center gap-4 bg-bg-paper shrink-0">
          <Button variant="ghost" size="sm" onClick={() => setSelectedAlert(null)} className="text-stone hover:text-cream px-2 -ml-2">
            &larr; Back to Alerts
          </Button>
          <div className="w-px h-6 bg-rule"></div>
          <Badge variant="outline" className="font-mono text-[10px] bg-bg-base border-stone/30">{selectedAlert.id}</Badge>
          <span className="text-stone mx-2">•</span>
          <span className="text-xs font-mono text-stone">{selectedAlert.rule}</span>
          {isEscalated && (
            <Badge className="bg-bad text-bg-base border-none ml-2 text-[10px] uppercase font-bold animate-pulse">L3 ESCALATED</Badge>
          )}
          {isUserFrozen && (
            <Badge className="bg-warn text-bg-base border-none ml-2 text-[10px] uppercase font-bold flex items-center gap-1"><Lock className="w-2.5 h-2.5" /> ACCOUNT FROZEN</Badge>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
           <div className="flex-1 space-y-6">
              <div className="space-y-2">
                 <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${isEscalated || selectedAlert.severity === 'critical' ? 'bg-bad shadow-[0_0_8px_var(--color-bad)]' : selectedAlert.severity === 'warning' ? 'bg-warn shadow-[0_0_8px_var(--color-warn)]' : 'bg-info'}`}></span>
                    <h2 className="text-xl font-medium text-cream">{selectedAlert.title}</h2>
                 </div>
                 <p className="text-stone text-sm">{selectedAlert.desc}</p>
              </div>

              <div className="p-4 border border-rule bg-bg-paper rounded-md space-y-4">
                 <h3 className="text-xs font-medium uppercase tracking-wider text-stone mb-2">Rule Trigger Details</h3>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] text-stone mb-1">Time of Detection</div>
                      <div className="text-xs font-mono">{selectedAlert.age} ago</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone mb-1">Risk Score Impact</div>
                      <div className="text-xs font-mono text-bad">+45 Points</div>
                    </div>
                    <div className="col-span-2 border-t border-rule pt-4">
                      <div className="text-[10px] text-stone mb-1">Automated System Action Taken</div>
                      <div className="text-xs text-cream flex items-center gap-2">
                        {isUserFrozen ? (
                          <span className="text-bad flex items-center gap-1.5 font-semibold"><Lock className="w-4 h-4" /> Withdrawals Restrained: Compliance Admin Override Active</span>
                        ) : (
                          <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-warn"/> flagged for manual review, limit cap preserved</span>
                        )}
                      </div>
                    </div>
                 </div>
              </div>
              
              <div className="space-y-3">
                 <h3 className="text-xs font-medium uppercase tracking-wider text-stone flex items-center gap-2"><Navigation className="w-4 h-4"/> Suggested Workflows</h3>
                 <div className="flex flex-col gap-2">
                    <div 
                      id="workflow-btn-sow"
                      onClick={() => setShowSowModal(true)}
                      className={`p-3 border rounded cursor-pointer transition-all ${works.sow ? 'border-good/40 bg-good/5' : 'border-rule bg-bg-elev hover:border-lime/40'}`}
                    >
                       <div className="flex justify-between items-start">
                         <h4 className={`text-xs font-medium ${works.sow ? 'text-good' : 'text-cream'}`}>Request Source of Wealth Documentation</h4>
                         {works.sow && <span className="text-[9px] px-1.5 py-0.5 rounded bg-good/20 text-good uppercase font-mono font-bold">Sent ✓</span>}
                       </div>
                       <p className="text-[10px] text-stone mt-1">Send an automated email requesting KYC level 3 documents.</p>
                    </div>

                    <div 
                      id="workflow-btn-freeze"
                      onClick={() => setShowFreezeModal(true)}
                      className={`p-3 border rounded cursor-pointer transition-all ${isUserFrozen || works.freeze ? 'border-bad/40 bg-bad/5' : 'border-rule bg-bg-elev hover:border-lime/40'}`}
                    >
                       <div className="flex justify-between items-start">
                         <h4 className={`text-xs font-medium ${isUserFrozen || works.freeze ? 'text-bad' : 'text-cream'}`}>Freeze Account Withdrawals</h4>
                         {(isUserFrozen || works.freeze) && <span className="text-[9px] px-1.5 py-0.5 rounded bg-bad/20 text-bad uppercase font-mono font-bold flex items-center gap-0.5"><Lock className="w-2 h-2" /> FROZEN</span>}
                       </div>
                       <p className="text-[10px] text-stone mt-1">Temporarily block crypto and fiat exits while investigating.</p>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="w-full md:w-80 space-y-6 shrink-0">
              <div className="p-4 border border-rule bg-bg-paper rounded-md">
                 <h3 className="text-xs font-medium uppercase tracking-wider text-stone mb-4 border-b border-rule pb-2">Target User</h3>
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded bg-bg-elev border border-rule flex flex-col items-center justify-center">
                       <User className="w-5 h-5 text-stone" />
                    </div>
                    <div>
                       <div className="text-sm font-medium hover:underline cursor-pointer text-cream" onClick={() => navigate(`/admin/users/${selectedAlert.user}`)}>{selectedAlert.user}</div>
                       <div className="text-[10px] text-stone">Joined 1y ago</div>
                    </div>
                 </div>
                 <Button id="btn-view-profile" variant="secondary" className="w-full text-xs h-8" onClick={() => navigate(`/admin/users/${selectedAlert.user}`)}>View Full Profile</Button>
              </div>

              <div className="p-4 border border-rule bg-bg-paper rounded-md">
                 <h3 className="text-xs font-medium uppercase tracking-wider text-stone mb-4 border-b border-rule pb-2">Resolution</h3>
                 <div className="space-y-4">
                    <div>
                       <div className="text-[10px] text-stone mb-1.5">Assignee</div>
                       <AssignDropdown 
                          currentAssignee={selectedAlert.assignee} 
                          onAssign={(n) => {
                             setAlerts(alerts.map(a => a.id === selectedAlert.id ? { ...a, assignee: n } : a))
                             setSelectedAlert({ ...selectedAlert, assignee: n })
                          }} 
                       />
                    </div>
                    <div className="space-y-2 pt-2 border-t border-rule flex flex-col">
                       <Button 
                         id="btn-resolve-dismiss"
                         onClick={() => setShowResolveModal(true)}
                         className="w-full text-xs h-8 gap-2 bg-good hover:bg-good/80 border-none text-bg-base font-semibold"
                       >
                         <CheckCircle className="w-3.5 h-3.5"/> Resolve & Dismiss
                       </Button>

                       <Button 
                         id="btn-escalate-l3"
                         onClick={() => setShowEscalateModal(true)}
                         disabled={isEscalated}
                         variant="outline" 
                         className={`w-full text-xs h-8 gap-2 hover:bg-warn/15 ${isEscalated ? 'border-amber-500/10 text-amber-500/40 bg-amber-500/5' : 'border-warn/30 text-warn'}`}
                       >
                         <AlertTriangle className="w-3.5 h-3.5"/> {isEscalated ? "Escalated to L3" : "Escalate to L3"}
                       </Button>

                       <Button 
                         id="btn-queue-sar"
                         onClick={() => {
                           // Route pre-filled information straight into SAR view
                           setSarUser(selectedAlert.user);
                           setSarDate("2026-06-02");
                           setSarAmt(selectedAlert.id === "alt_1" ? "450000" : "2500000");
                           setSarType(selectedAlert.rule.includes("AML_004") ? "Structuring / Smurfing" : "Unexplained Crypto Wealth");
                           setSarDesc(`[AUTOMATED AML INCIDENT EXPORT - ID: ${selectedAlert.id}]\nSubject Name: ${selectedAlert.user}\nRule Flagged: ${selectedAlert.rule} - ${selectedAlert.title}\n\nIncident Narrative: ${selectedAlert.desc}\n\nThis suspicious activity file has been compiled systematically for SAR submission.`);
                           setCreatingSAR(true);
                           setNotification(`Pre-filled SAR draft compiled for ${selectedAlert.user}.`);
                         }}
                         variant="outline" 
                         className="w-full text-xs h-8 gap-2 border-bad/30 text-bad hover:bg-bad/10"
                       >
                         <FileText className="w-3.5 h-3.5"/> Queue for SAR
                       </Button>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* 1. SOURCE OF WEALTH REQUEST MODAL */}
        {showSowModal && (
          <div id="comp-modal-sow" className="fixed inset-0 z-50 bg-bg-base/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-bg-elev border border-rule rounded-lg max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
              <div className="flex justify-between items-center pb-2 border-b border-rule">
                <h3 className="text-base font-semibold text-cream flex items-center gap-2">
                  <Mail className="w-5 h-5 text-lime" /> Request Source of Wealth (SOW)
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setShowSowModal(false)} className="h-8 w-8 text-stone hover:text-cream">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-stone">
                  This triggers an automated request asking <strong className="text-cream">{selectedAlert.user}</strong> to submit documents verifying their wealth source.
                </p>

                <div>
                  <label className="text-[10px] font-medium text-stone block mb-1 uppercase tracking-wider">Required Documentation</label>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    <label className="flex items-center gap-2 cursor-pointer p-2.5 border border-rule rounded bg-bg-paper text-xs text-cream">
                      <input id="chk-sow-bank" type="checkbox" className="rounded bg-bg-base border-rule text-lime accent-lime" defaultChecked />
                      <span>3-Month Bank Statements</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-2.5 border border-rule rounded bg-bg-paper text-xs text-cream">
                      <input id="chk-sow-tax" type="checkbox" className="rounded bg-bg-base border-rule text-lime accent-lime" defaultChecked />
                      <span>Tax Clearance Certificate</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-2.5 border border-rule rounded bg-bg-paper text-xs text-cream">
                      <input id="chk-sow-salary" type="checkbox" className="rounded bg-bg-base border-rule text-lime accent-lime" />
                      <span>Salary Slip / Letter</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-2.5 border border-rule rounded bg-bg-paper text-xs text-cream">
                      <input id="chk-sow-cac" type="checkbox" className="rounded bg-bg-base border-rule text-lime accent-lime" />
                      <span>Corporate Registry (CAC)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-medium text-stone block mb-1 uppercase tracking-wider">Message Template Preview</label>
                  <textarea 
                    id="txt-sow-message"
                    className="w-full bg-bg-base border border-rule rounded-md text-xs p-3 min-h-[100px] outline-none focus:border-lime/50 text-cream font-mono"
                    defaultValue={`Dear ${selectedAlert.user},\n\nWe noticed a recent increase in your transaction volume. To ensure compliance, please upload your Source of Wealth documentation within your app profile workspace within 48 hours.\n\nBest regards,\nVoltAdmin Compliance Department`}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-rule mt-4">
                <Button variant="ghost" onClick={() => setShowSowModal(false)} className="text-stone">Cancel</Button>
                <Button 
                  id="btn-confirm-sow"
                  className="bg-lime text-bg-base hover:bg-lime/90 font-semibold"
                  onClick={() => {
                    setCompletedWorkflows({
                      ...completedWorkflows,
                      [selectedAlert.id]: {
                        ...(completedWorkflows[selectedAlert.id] || {}),
                        sow: true
                      }
                    });
                    setShowSowModal(false);
                    setNotification(`Official Source of Wealth inquiry dispatched to ${selectedAlert.user}.`);
                  }}
                >
                  Dispatch SOW Request
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 2. FREEZE ACCOUNT STATUS MODAL */}
        {showFreezeModal && (
          <div id="comp-modal-freeze" className="fixed inset-0 z-50 bg-bg-base/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-bg-elev border border-rule rounded-lg max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
              <div className="flex justify-between items-center pb-2 border-b border-rule">
                <h3 className="text-base font-semibold text-cream flex items-center gap-2">
                  <Lock className="w-5 h-5 text-bad" /> Restrict Account Activities
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setShowFreezeModal(false)} className="h-8 w-8 text-stone hover:text-cream">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-bad/10 border border-bad/20 rounded-md text-xs text-bad flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Warning: This places a hard restrictive stop on the selected customer account. Outgoing transactions will fail or queue for manual verification.</span>
                </div>

                <div>
                  <label className="text-[10px] font-medium text-stone block mb-1 uppercase tracking-wider font-semibold">Restrictive Hold Period</label>
                  <select id="sel-freeze-period" className="w-full bg-bg-base border border-rule rounded-md h-9 text-xs px-3 outline-none focus:border-bad/50 text-cream mt-1">
                    <option>Temporary 24-Hours Precautionary Lock</option>
                    <option>7-Days Investigational Hold</option>
                    <option>Permanent Legal Administrative Hold</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-medium text-stone block mb-1 uppercase tracking-wider font-bold">Scope of Block</label>
                  <div className="space-y-2 mt-1.5">
                    <label className="flex items-center gap-2 cursor-pointer p-2 border border-rule rounded bg-bg-paper text-xs text-cream">
                      <input id="chk-freeze-crypto" type="checkbox" className="rounded bg-bg-base border-rule text-bad accent-bad" defaultChecked />
                      <span>Block Outgoing Crypto Transfers (On-Chain)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-2 border border-rule rounded bg-bg-paper text-xs text-cream">
                      <input id="chk-freeze-p2p" type="checkbox" className="rounded bg-bg-base border-rule text-bad accent-bad" defaultChecked />
                      <span>Suspend active P2P Marketplaces Access</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-2 border border-rule rounded bg-bg-paper text-xs text-cream">
                      <input id="chk-freeze-deposits" type="checkbox" className="rounded bg-bg-base border-rule text-bad accent-bad" />
                      <span>Restrict incoming Fiat deposits/transfers</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-medium text-stone block mb-1 uppercase tracking-wider">Audit Investigation Notes</label>
                  <textarea 
                    id="txt-freeze-notes"
                    className="w-full bg-bg-base border border-rule rounded-md text-xs p-3 min-h-[70px] outline-none focus:border-bad/50 text-cream"
                    placeholder="Provide incident ledger reference or court / regulatory file tracking numbers..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-rule mt-4">
                <Button variant="ghost" onClick={() => setShowFreezeModal(false)} className="text-stone">Cancel</Button>
                <Button 
                  id="btn-confirm-freeze"
                  className="bg-bad text-bg-base hover:bg-bad/90 font-bold"
                  onClick={() => {
                    setCompletedWorkflows({
                      ...completedWorkflows,
                      [selectedAlert.id]: {
                        ...(completedWorkflows[selectedAlert.id] || {}),
                        freeze: true
                      }
                    });
                    setFrozenUsers({
                      ...frozenUsers,
                      [selectedAlert.user]: true
                    });
                    setShowFreezeModal(false);
                    setNotification(`Withdrawal operations immediately disabled for ${selectedAlert.user}.`);
                  }}
                >
                  Impose Asset Freeze
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 3. RESOLVE Compliance Alert MODAL */}
        {showResolveModal && (
          <div id="comp-modal-resolve" className="fixed inset-0 z-50 bg-bg-base/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-bg-elev border border-rule rounded-lg max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
              <div className="flex justify-between items-center pb-2 border-b border-rule">
                <h3 className="text-base font-semibold text-cream flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-good" /> Archive & Resolve Incident
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setShowResolveModal(false)} className="h-8 w-8 text-stone hover:text-cream">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-stone">
                  Review and mark trigger <strong className="text-cream">{selectedAlert.id}</strong> as closed. Fully verified accounts will resume normal service operations.
                </p>

                <div>
                  <label className="text-[10px] font-medium text-stone block mb-1 uppercase tracking-wider font-semibold">Officer Dismissal Reason</label>
                  <select id="sel-resolve-reason" className="w-full bg-bg-base border border-rule rounded-md h-9 text-xs px-3 outline-none focus:border-good/50 text-cream mt-1">
                    <option>Verified legitimate merchant commerce transaction volume</option>
                    <option>Valid identification or KYC documents updated successfully</option>
                    <option>Rule Mis-Trigger: Safe multi-account asset transfer</option>
                    <option>Executive operational waiver</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-medium text-stone block mb-1 uppercase tracking-wider font-bold">Compliance Desk Memo</label>
                  <textarea 
                    id="txt-resolve-memo"
                    className="w-full bg-bg-base border border-rule rounded-md text-xs p-3 min-h-[90px] outline-none focus:border-good/50 text-cream"
                    placeholder="Explain the validation checks performed to clear this incident from our active queues..."
                    defaultValue="Reviewed incoming fund origins. Found matching bank receipt references. Safe to authorize and dismiss alert."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-rule mt-4">
                <Button variant="ghost" onClick={() => setShowResolveModal(false)} className="text-stone">Cancel</Button>
                <Button 
                  id="btn-confirm-resolve"
                  className="bg-good text-bg-base hover:bg-good/90 font-bold"
                  onClick={() => {
                    setAlerts(alerts.filter(a => a.id !== selectedAlert.id));
                    setShowResolveModal(false);
                    setSelectedAlert(null);
                    setNotification("Risk alert successfully dismissed & archived.");
                  }}
                >
                  Verify & Dismiss Incident
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 4. ESCALATE TO LEVEL-3 MANAGER MODAL */}
        {showEscalateModal && (
          <div id="comp-modal-escalate" className="fixed inset-0 z-50 bg-bg-base/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-bg-elev border border-rule rounded-lg max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
              <div className="flex justify-between items-center pb-2 border-b border-rule">
                <h3 className="text-base font-semibold text-cream flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-warn" /> Head Executive Escalation (L3)
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setShowEscalateModal(false)} className="h-8 w-8 text-stone hover:text-cream">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-stone">
                  Promote risk assessment level. Your direct manager or assigned Lead compliance head will be notified instantly.
                </p>

                <div>
                  <label className="text-[10px] font-medium text-stone block mb-1 uppercase tracking-wider font-semibold">Assigned Supervisor Officer</label>
                  <select id="sel-escalate-officer" className="w-full bg-bg-base border border-rule rounded-md h-9 text-xs px-3 outline-none focus:border-warn/50 text-cream mt-1">
                    <option>Laurel K. (Chief Compliance Officer)</option>
                    <option>James C. (Senior AML Audits Lead)</option>
                    <option>Ngozi A. (Legal Counsel Representative)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-medium text-stone block mb-1 uppercase tracking-wider">Escalation Justification Desk Notes</label>
                  <textarea 
                    id="txt-escalate-notes"
                    className="w-full bg-bg-base border border-rule rounded-md text-xs p-3 min-h-[90px] outline-none focus:border-warn/50 text-cream"
                    defaultValue={`Flagging this user for structural transaction manipulation. The behavior matches repeated sub-limit splitting to circumvent trigger limits.`}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-rule mt-4">
                <Button variant="ghost" onClick={() => setShowEscalateModal(false)} className="text-stone">Cancel</Button>
                <Button 
                  id="btn-confirm-escalate"
                  className="bg-warn text-bg-base hover:bg-warn/90 font-bold"
                  onClick={() => {
                    setEscalatedAlerts({
                      ...escalatedAlerts,
                      [selectedAlert.id]: true
                    });
                    setAlerts(alerts.map(a => a.id === selectedAlert.id ? { ...a, assignee: "James C.", severity: "critical" } : a));
                    setSelectedAlert({
                      ...selectedAlert,
                      assignee: "James C.",
                      severity: "critical"
                    });
                    setShowEscalateModal(false);
                    setNotification(`Alert ${selectedAlert.id} escalated to James C. for Review.`);
                  }}
                >
                  Escalate Case Immediately
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (viewingSanction) {
    return (
      <div className="flex flex-col h-[calc(100vh-6rem)] -mx-2 -mt-2 bg-bg-base border border-rule rounded-sm overflow-hidden">
        <div className="p-4 border-b border-rule flex items-center gap-4 bg-bg-paper shrink-0">
          <Button variant="ghost" size="sm" onClick={() => setViewingSanction(false)} className="text-stone hover:text-cream px-2 -ml-2">
            &larr; Back to Sanctions
          </Button>
          <div className="w-px h-6 bg-rule"></div>
          <span className="text-xs font-medium text-cream">EU Consolidated List Match Review</span>
        </div>
        <div className="flex-1 overflow-y-auto p-8 flex justify-center">
           <div className="max-w-4xl w-full space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-4 p-4 border border-warn/30 bg-warn/5 rounded-md">
                 <AlertTriangle className="w-8 h-8 text-warn animate-bounce" />
                 <div>
                    <h3 className="text-lg font-medium text-cream">Similarity Score: 92% (High Confidence)</h3>
                    <p className="text-xs text-stone mt-1">Platform user 'Grace D.' closely matches a flagged entity on the EU Consolidated sanctions list.</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 col-span-2">
                 <div className="p-4 border border-rule bg-bg-paper rounded-md">
                    <h4 className="text-[10px] font-medium uppercase tracking-wider text-stone mb-4 flex items-center gap-2"><User className="w-3 h-3"/> Internal User Profile</h4>
                    <div className="space-y-3 font-mono text-xs text-stone">
                       <div className="flex justify-between"><span className="text-cream font-sans">Name:</span> <span>Grace D. Okafor</span></div>
                       <div className="flex justify-between"><span className="text-cream font-sans">DOB:</span> <span>1985-04-12</span></div>
                       <div className="flex justify-between"><span className="text-cream font-sans">Nationality:</span> <span>Nigeria</span></div>
                       <div className="flex justify-between"><span className="text-cream font-sans">Address:</span> <span>Lagos, NG</span></div>
                       <div className="flex justify-between"><span className="text-cream font-sans">Phone:</span> <span>+234...</span></div>
                    </div>
                 </div>
                 <div className="p-4 border border-warn/30 bg-bg-elev rounded-md">
                    <h4 className="text-[10px] font-medium uppercase tracking-wider text-stone mb-4 flex items-center gap-2 text-warn"><Flag className="w-3 h-3"/> Watchlist Entity</h4>
                    <div className="space-y-3 font-mono text-xs text-stone">
                       <div className="flex justify-between"><span className="text-warn font-sans">Name:</span> <span className="text-warn font-bold">Graca D. Okonkwo</span></div>
                       <div className="flex justify-between"><span className="text-warn font-sans">DOB:</span> <span className="text-warn font-bold">1985-04-12</span></div>
                       <div className="flex justify-between"><span className="text-warn font-sans">Nationality:</span> <span>Nigeria</span></div>
                       <div className="flex justify-between"><span className="text-warn font-sans">Address:</span> <span>Abuja, NG</span></div>
                       <div className="flex justify-between"><span className="text-warn font-sans">Phone:</span> <span>Unknown</span></div>
                    </div>
                 </div>
              </div>

              <div className="p-4 border border-rule bg-bg-paper rounded-md space-y-4">
                 <h4 className="text-[10px] font-medium uppercase tracking-wider text-stone font-bold">Adjudication Actions</h4>
                 <div className="flex gap-4">
                    <Button 
                      id="btn-confirm-match-freeze"
                      className="gap-2 bg-bad hover:bg-bad/80 text-bg-base border-none flex-1 font-bold"
                      onClick={() => {
                        setViewingSanction(false);
                        setNotification("Sanctions match confirmed. Assets frozen indefinitely & regulatory warning issued.");
                      }}
                    >
                      <UserX className="w-4 h-4"/> Confirm Match & Freeze Account
                    </Button>
                    <Button 
                      id="btn-dismiss-false-positive"
                      variant="outline" 
                      className="gap-2 flex-1" 
                      onClick={() => {
                        setViewingSanction(false);
                        setNotification("False positive match dismissed. Hit removed from user history.");
                      }}
                    >
                      <Shield className="w-4 h-4"/> Dismiss (False Positive)
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    )
  }

  if (creatingSAR) {
     return (
      <div className="flex flex-col h-[calc(100vh-6rem)] -mx-2 -mt-2 bg-bg-base border border-rule rounded-sm overflow-hidden">
        <div className="p-4 border-b border-rule flex items-center gap-4 bg-bg-paper shrink-0">
          <Button variant="ghost" size="sm" onClick={() => setCreatingSAR(false)} className="text-stone hover:text-cream px-2 -ml-2">
            &larr; Back to Reports
          </Button>
          <div className="w-px h-6 bg-rule"></div>
          <span className="text-xs font-medium text-cream">New Suspicious Activity Report (SAR)</span>
        </div>
        <div className="flex-1 overflow-y-auto p-8 flex justify-center">
           <div className="max-w-2xl w-full space-y-6 animate-in slide-in-from-bottom-6">
              <Card className="bg-bg-elev border-rule p-6 space-y-6">
                 <div>
                    <label className="text-[11px] font-medium text-stone block mb-1.5 uppercase tracking-wider">Subject User ID / Email</label>
                    <Input 
                      id="sar-subject-input"
                      className="bg-bg-base h-9 text-xs text-cream" 
                      placeholder="Search user to populate details..." 
                      value={sarUser}
                      onChange={(e) => setSarUser(e.target.value)}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[11px] font-medium text-stone block mb-1.5 uppercase tracking-wider">Activity Date</label>
                       <Input 
                         id="sar-date-input"
                         type="date" 
                         className="bg-bg-base h-9 text-xs text-cream" 
                         value={sarDate}
                         onChange={(e) => setSarDate(e.target.value)}
                       />
                    </div>
                    <div>
                       <label className="text-[11px] font-medium text-stone block mb-1.5 uppercase tracking-wider font-semibold">Fiat Amount Involved (NGN)</label>
                       <Input 
                         id="sar-amt-input"
                         type="number" 
                         className="bg-bg-base h-9 text-xs text-cream" 
                         placeholder="0.00" 
                         value={sarAmt}
                         onChange={(e) => setSarAmt(e.target.value)}
                       />
                    </div>
                 </div>
                 <div>
                    <label className="text-[11px] font-medium text-stone block mb-1.5 uppercase tracking-wider font-semibold">Reason for filing</label>
                    <select 
                      id="sar-type-input"
                      className="w-full bg-bg-base border border-rule rounded-md h-9 text-xs px-3 outline-none focus:border-lime/50 text-cream"
                      value={sarType}
                      onChange={(e) => setSarType(e.target.value)}
                    >
                       <option>Structuring / Smurfing</option>
                       <option>Unexplained Crypto Wealth</option>
                       <option>P2P Scams / Fraud</option>
                       <option>Sanctions Evasion Attempt</option>
                    </select>
                 </div>
                 <div>
                    <label className="text-[11px] font-medium text-stone block mb-1.5 uppercase tracking-wider">Narrative Summary</label>
                    <textarea 
                      id="sar-desc-input"
                      className="w-full bg-bg-base border border-rule rounded-md text-xs p-3 min-h-[140px] outline-none text-cream focus:border-lime/50 resize-y font-mono" 
                      placeholder="Describe the transaction pattern, associated wallets, and reason for suspicion..."
                      value={sarDesc}
                      onChange={(e) => setSarDesc(e.target.value)}
                    />
                 </div>
                 <div className="pt-4 border-t border-rule flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => setCreatingSAR(false)}>Cancel</Button>
                    <Button 
                      id="sar-submit-btn"
                      className="bg-lime text-bg-base hover:bg-lime/90 font-bold"
                      onClick={() => {
                        setCreatingSAR(false);
                        setNotification(`Suspicious Activity Report successfully compiled and queued for submission.`);
                        setSarUser("");
                        setSarAmt("");
                        setSarDesc("");
                      }}
                    >
                      Compile & Save Draft
                    </Button>
                 </div>
              </Card>
           </div>
        </div>
      </div>
     )
  }

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-6rem)] relative -mx-2 -mt-2">
      <div className="flex bg-bg-elev border border-rule rounded-sm divide-x divide-rule shrink-0">
          {tabs.map(tab => (
            <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`flex-1 py-3 text-xs font-medium uppercase tracking-wider transition-colors ${activeTab === tab ? 'bg-bg-paper text-lime shadow-[inset_0_-2px_0_var(--color-lime)]' : 'text-stone hover:text-cream hover:bg-bg-paper/50'}`}
            >
               {tab}
            </button>
          ))}
      </div>

      <div className="flex-1 flex flex-col min-h-0">
         {activeTab === "Alerts" && (
            <Card className="bg-bg-elev border-rule flex flex-col min-h-0 flex-1 relative overflow-hidden">
               <div className="p-4 border-b border-rule flex items-center justify-between gap-4 flex-wrap bg-bg-paper">
                 <div className="flex items-center gap-3">
                    <Dropdown
                       open={activeFilter === 'severity'}
                       onClickOutside={() => setActiveFilter(null)}
                       trigger={<Button variant="secondary" size="sm" className="h-8 text-xs gap-1.5" onClick={() => setActiveFilter(activeFilter === 'severity' ? null : 'severity')}><Filter className="w-3.5 h-3.5"/> Severity</Button>}
                    >
                       <div className="px-3 py-1.5 text-xs hover:bg-bg-paper cursor-pointer text-bad">Critical</div>
                       <div className="px-3 py-1.5 text-xs hover:bg-bg-paper cursor-pointer text-warn">Warning</div>
                       <div className="px-3 py-1.5 text-xs hover:bg-bg-paper cursor-pointer text-info">Info</div>
                    </Dropdown>

                    <Dropdown
                       open={activeFilter === 'status'}
                       onClickOutside={() => setActiveFilter(null)}
                       trigger={<Button variant="secondary" size="sm" className="h-8 text-xs gap-1.5" onClick={() => setActiveFilter(activeFilter === 'status' ? null : 'status')}><Filter className="w-3.5 h-3.5"/> Status</Button>}
                    >
                       <div className="px-3 py-1.5 text-xs hover:bg-bg-paper cursor-pointer">Open</div>
                       <div className="px-3 py-1.5 text-xs hover:bg-bg-paper cursor-pointer">In Progress</div>
                       <div className="px-3 py-1.5 text-xs hover:bg-bg-paper cursor-pointer">Resolved</div>
                    </Dropdown>
                 </div>
                 <div className="relative w-64">
                   <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
                   <Input className="pl-9 bg-bg-base" placeholder="Search user ID, rule..." />
                 </div>
               </div>
               
               <div className="overflow-y-auto flex-1 p-0 relative">
                  <Table>
                    <TableHeader className="sticky top-0 bg-bg-elev shadow-[0_1px_0_var(--color-rule)] z-10">
                      <TableRow className="hover:bg-transparent border-none">
                        <TableHead>Severity</TableHead>
                        <TableHead>Alert Title</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Rule</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Assignee</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                       {alerts.map(alert => (
                          <TableRow key={alert.id} className="cursor-pointer group hover:bg-bg-paper" onClick={() => setSelectedAlert(alert)}>
                             <TableCell>
                                <span className={`w-2.5 h-2.5 rounded-full inline-block mt-1 ${alert.severity === 'critical' ? 'bg-bad shadow-[0_0_8px_var(--color-bad)]' : alert.severity === 'warning' ? 'bg-warn shadow-[0_0_8px_var(--color-warn)]' : 'bg-info'}`}></span>
                             </TableCell>
                             <TableCell className="font-medium text-cream">{alert.title}</TableCell>
                             <TableCell>
                                <span className="text-xs hover:underline cursor-pointer text-stone group-hover:text-cream transition-colors">{alert.user}</span>
                             </TableCell>
                             <TableCell>
                                <Badge variant="outline" className="text-[9px] font-mono bg-bg-base border-stone/30">{alert.rule}</Badge>
                             </TableCell>
                             <TableCell className="text-stone text-[11px]">{alert.age}</TableCell>
                             <TableCell onClick={(e) => e.stopPropagation()}>
                                <AssignDropdown 
                                   currentAssignee={alert.assignee} 
                                   onAssign={(name) => setAlerts(alerts.map(a => a.id === alert.id ? { ...a, assignee: name } : a))} 
                                />
                             </TableCell>
                             <TableCell className="text-right">
                                <Button variant="ghost" size="sm" className="h-7 text-[10px] text-stone hover:text-cream">Review <ArrowRight className="w-3 h-3 ml-1"/></Button>
                             </TableCell>
                          </TableRow>
                       ))}
                    </TableBody>
                  </Table>
               </div>
            </Card>
         )}

         {activeTab === "Sanctions" && (
            <div className="flex gap-6 h-full">
               <div className="w-[30%] bg-bg-paper border border-rule rounded-md p-4">
                  <h3 className="font-medium text-xs uppercase tracking-wider text-stone mb-4 flex items-center justify-between">
                     Screening Sources <Button variant="outline" size="sm" className="h-6 text-[10px]">Refresh</Button>
                  </h3>
                  <div className="space-y-3">
                     {[
                        { name: "OFAC SDN List", updated: "2h ago", hits: 0 },
                        { name: "UN Security Council", updated: "2h ago", hits: 0 },
                        { name: "EU Consolidated", updated: "4h ago", hits: 1 },
                        { name: "HMT UK", updated: "4h ago", hits: 0 },
                     ].map(src => (
                        <div key={src.name} className="p-3 bg-bg-base border border-rule rounded-sm flex justify-between items-center">
                           <div>
                              <div className="text-xs font-medium text-cream">{src.name}</div>
                              <div className="text-[10px] text-stone mt-0.5">Updated: {src.updated}</div>
                           </div>
                           <Badge variant={src.hits > 0 ? 'warning' : 'outline'} className={src.hits === 0 ? 'bg-bg-paper text-stone' : 'bg-warn text-bg-base border-warn font-bold'}>{src.hits} Hits</Badge>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="flex-1 bg-bg-elev border border-rule rounded-md flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
                  <div className="p-4 bg-warn/10 rounded-full border border-warn/30 mb-4 inline-flex">
                     <Flag className="w-6 h-6 text-warn" />
                  </div>
                  <h3 className="font-display font-medium text-lg mb-1">1 Pending Sanction Hit Record</h3>
                  <p className="text-xs text-stone max-w-sm mb-6">User 'Grace D.' matched a name variation on the EU Consolidated list. Account withdrawals are currently frozen pending review.</p>
                  <Button id="btn-review-match-details" variant="outline" className="border-warn text-warn hover:bg-warn/10" onClick={() => setViewingSanction(true)}>Review Match Details</Button>
               </div>
            </div>
         )}
         
         {activeTab === "Reports" && (
            <Card className="bg-bg-elev border-rule flex-1 flex flex-col p-6 items-center justify-center">
               <FileText className="w-8 h-8 text-stone mb-4 opacity-50" />
               <h3 className="text-base font-medium mb-1">SAR / STR Reporting</h3>
               <p className="text-xs text-stone mb-6 max-w-sm text-center">Build and submit Suspicious Activity Reports directly from the admin panel to the compliance dashboard.</p>
               <Button onClick={() => setCreatingSAR(true)}>Create New Report</Button>
            </Card>
         )}
      </div>
    </div>
  )
}

