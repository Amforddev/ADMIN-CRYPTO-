import React, { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Clock, 
  MessageSquare, 
  Paperclip, 
  AlertOctagon, 
  UserX, 
  AlertTriangle, 
  ShieldAlert,
  Send,
  CheckCircle2,
  Lock,
  RotateCcw,
  UserCheck,
  Building,
  Activity,
  PlusSquare,
  FileMinus
} from "lucide-react"

// Active Officer Investigator Profile
const CURRENT_OFFICER = "Sunday O. (Self)"

export default function DisputeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Tab views
  const [activeCenterTab, setActiveCenterTab] = useState("CHAT")
  
  // Back-office data states
  const [disputes, setDisputes] = useState<any[]>([])
  const [currentDispute, setCurrentDispute] = useState<any | null>(null)
  
  // Notification success popups
  const [notification, setNotification] = useState<string | null>(null)

  // Resolution console control inputs
  const [resolutionType, setResolutionType] = useState<"buyer" | "seller" | "split">("buyer")
  const [reasonCode, setReasonCode] = useState("Valid proof of payment provided by Buyer.")
  const [adminNotes, setAdminNotes] = useState("")
  const [isEscalateChecked, setIsEscalateChecked] = useState(false)

  // Admin chat response input state
  const [adminChatMessage, setAdminChatMessage] = useState("")

  // Quick internal notes panel input state
  const [internalNoteText, setInternalNoteText] = useState("")

  // File upload simulator states
  const [showFileUploadSim, setShowFileUploadSim] = useState(false)
  const [simFilename, setSimFilename] = useState("evidence_bank_statement.pdf")
  const [simSize, setSimSize] = useState("2.4 MB")
  const [simUploader, setSimUploader] = useState("Buyer (Ngozi)")

  // Retrieve base database values
  useEffect(() => {
    let saved = localStorage.getItem("volt-disputes-list")
    let list: any[] = []
    
    if (saved) {
      list = JSON.parse(saved)
    } else {
      // Direct emergency initialization if user navigates straight into details child view
      list = [
        {
          id: "dsp_881m2k",
          priority: "P1",
          timestamp: "2026-06-02T22:02:30Z",
          age: "28m",
          tradeValue: "₦2,500,000",
          rawAmount: 2500000,
          asset: "USDT",
          amountCoins: "1,450.00 USDT",
          buyer: { name: "Ngozi Anosike", initials: "NA", rating: "4.8★", tier: "Tier 2 KYC", trades: 342, disputeRate: "0.4%" },
          seller: { name: "Sunday Amford", initials: "SA", rating: "4.9★", tier: "Tier 3 KYC", trades: 1024, disputeRate: "2.1%" },
          reason: "Payment not received",
          assignee: "Unassigned",
          status: "Open",
          openedBy: "Seller",
          escalated: false,
          chatHistory: [
            { sender: "Ngozi (Buyer)", role: "buyer", message: "Hi, making payment now.", time: "10:46 AM" },
            { sender: "Sunday (Seller)", role: "seller", message: "Please hurry. I need it fast.", time: "10:48 AM" },
            { sender: "Ngozi (Buyer)", role: "buyer", message: "Sent. Attached receipt.", time: "10:56 AM", attachment: "receipt_522.pdf" },
            { sender: "Sunday (Seller)", role: "seller", message: "I have checked my bank app twice. The money is not there. Stop playing games.", time: "11:16 AM" }
          ],
          evidence: [
            { uploader: "Buyer (Ngozi)", filename: "receipt_522.pdf", size: "1.2 MB", timestamp: "10:56 AM" }
          ],
          auditTrail: [
            { time: "11:15:22", log: "Seller Sunday Amford opened P2P escrow dispute: 'No payment receipt cleared'." },
            { time: "10:55:12", log: "Buyer Ngozi Anosike marked order as PAID and submitted receipt." },
            { time: "10:45:00", log: "Escrow transaction initiated. 1,450.00 USDT secured." }
          ],
          notes: []
        }
      ]
      localStorage.setItem("volt-disputes-list", JSON.stringify(list))
    }

    setDisputes(list)
    
    // Look up current record using router ID parameter
    const targetId = id || "dsp_881m2k"
    const match = list.find(d => d.id === targetId)
    
    if (match) {
      setCurrentDispute(match)
      setIsEscalateChecked(match.escalated || false)
    } else {
      // Mock an unknown placeholder to prevent fatal crashes
      const randomDispute = {
        id: targetId,
        priority: "P2",
        timestamp: new Date().toISOString(),
        age: "12m",
        tradeValue: "₦850,000",
        rawAmount: 850000,
        asset: "USDT",
        amountCoins: "510.00 USDT",
        buyer: { name: "Ngozi Anosike", initials: "NA", rating: "4.5★", tier: "Tier 1 KYC", trades: 42, disputeRate: "1.5%" },
        seller: { name: "Sunday Amford", initials: "SA", rating: "4.8★", tier: "Tier 3 KYC", trades: 800, disputeRate: "0.2%" },
        reason: "Payment proof dispute",
        assignee: "Unassigned",
        status: "Open",
        openedBy: "Buyer",
        escalated: false,
        chatHistory: [{ sender: "System", role: "system", message: "Placeholder chat initialization", time: "10:15 AM" }],
        evidence: [],
        auditTrail: [{ time: "10:00:00", log: "Dispute file parsed in memory" }],
        notes: []
      }
      setCurrentDispute(randomDispute)
    }
  }, [id])

  // Helper toaster notification trigger
  const triggerNotification = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 4000)
  }

  // Update change in master list
  const persistDisputeChange = (updatedRecord: any) => {
    setCurrentDispute(updatedRecord)
    const nextList = disputes.map(d => d.id === updatedRecord.id ? updatedRecord : d)
    setDisputes(nextList)
    localStorage.setItem("volt-disputes-list", JSON.stringify(nextList))
  }

  // Action: Assign this dispute directly to current investigator profile
  const handleAssignToMe = () => {
    if (!currentDispute) return
    const updated = {
      ...currentDispute,
      assignee: CURRENT_OFFICER,
      status: currentDispute.status === "Open" ? "In Progress" : currentDispute.status,
      auditTrail: [
        { time: new Date().toLocaleTimeString(), log: `Officer ${CURRENT_OFFICER} claimed this file for live audit.` },
        ...(currentDispute.auditTrail || [])
      ]
    }
    persistDisputeChange(updated)
    triggerNotification("Claimed file ownership successfully.")
  }

  // Action: Escalate dispute status
  const handleToggleEscalate = (val: boolean) => {
    if (!currentDispute) return
    setIsEscalateChecked(val)
    const updated = {
      ...currentDispute,
      escalated: val,
      priority: val ? "P1" : currentDispute.priority,
      auditTrail: [
        { time: new Date().toLocaleTimeString(), log: val ? `Dispute escalated directly to Senior Administration Queue.` : `Escalation tier flags removed.` },
        ...(currentDispute.auditTrail || [])
      ]
    }
    persistDisputeChange(updated)
    triggerNotification(val ? "Escalated to Senior Administration queue." : "Escalation flags cleared.")
  }

  // Action: Post an investigator internal memo note
  const handleAddInternalNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentDispute || !internalNoteText.trim()) return

    const newNote = {
      author: CURRENT_OFFICER,
      text: internalNoteText.trim(),
      time: "Just now"
    }

    const updated = {
      ...currentDispute,
      notes: [newNote, ...(currentDispute.notes || [])],
      auditTrail: [
        { time: new Date().toLocaleTimeString(), log: `Officer ${CURRENT_OFFICER} added administrative session note.` },
        ...(currentDispute.auditTrail || [])
      ]
    }

    persistDisputeChange(updated)
    setInternalNoteText("")
    triggerNotification("Internal investigator note stored.")
  }

  // Action: Simulate submitting chat notice or warning to P2P buyers-sellers
  const handleSendAdminChatMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentDispute || !adminChatMessage.trim()) return

    const newMessage = {
      sender: "System Administrator",
      role: "system",
      message: adminChatMessage.trim(),
      time: new Date().toLocaleTimeString()
    }

    const updated = {
      ...currentDispute,
      chatHistory: [...(currentDispute.chatHistory || []), newMessage],
      auditTrail: [
        { time: new Date().toLocaleTimeString(), log: `System Admin sent warning prompt to trade participants.` },
        ...(currentDispute.auditTrail || [])
      ]
    }

    persistDisputeChange(updated)
    setAdminChatMessage("")
    triggerNotification("Admin broadcast sent into trade chat.")
  }

  // Action: Simulate uploading/capturing extra customer evidence inside the log
  const handleSimulateEvidenceUpload = () => {
    if (!currentDispute) return

    const newEvidence = {
      uploader: simUploader,
      filename: simFilename,
      size: simSize,
      timestamp: new Date().toLocaleTimeString()
    }

    const updated = {
      ...currentDispute,
      evidence: [...(currentDispute.evidence || []), newEvidence],
      auditTrail: [
        { time: new Date().toLocaleTimeString(), log: `System validated and stored verification evidence: ${simFilename} uploaded by ${simUploader}` },
        ...(currentDispute.auditTrail || [])
      ]
    }

    persistDisputeChange(updated)
    setShowFileUploadSim(false)
    triggerNotification(`Simulated evidence file ${simFilename} added to record.`)
  }

  // Action: Final resolution execution
  const handleExecuteResolution = () => {
    if (!currentDispute) return
    
    if (adminNotes.trim().length < 15) {
      alert("Error: Verification requires a detailed ruling logic explanation (minimum 15 characters).")
      return
    }

    const winnerRepresentation = {
      buyer: `Fully released assets to Buyer (${currentDispute.buyer.name})`,
      seller: `Fully refunded escrowed funds to Seller (${currentDispute.seller.name})`,
      split: `Split trade values as specified by corporate ledger`
    }

    const updated = {
      ...currentDispute,
      status: "Resolved",
      resolutionDetails: {
        winner: resolutionType,
        reasonCode: reasonCode,
        notes: adminNotes.trim(),
        resolvedAt: new Date().toISOString(),
        resolvedBy: CURRENT_OFFICER
      },
      auditTrail: [
        { time: new Date().toLocaleTimeString(), log: `FILE CLOSED: RESOLUTION EXECUTED. Outcome: ${winnerRepresentation[resolutionType]}. Remarks: ${reasonCode}` },
        { time: new Date().toLocaleTimeString(), log: `Ruling memo signed key by ${CURRENT_OFFICER}` },
        ...(currentDispute.auditTrail || [])
      ]
    }

    persistDisputeChange(updated)
    triggerNotification("Dispute resolution finalized. Escrow state locked.")
  }

  // Action: Reopen a resolved file for further triage
  const handleReopenFile = () => {
    if (!currentDispute) return
    const updated = {
      ...currentDispute,
      status: "In Progress",
      resolutionDetails: null,
      auditTrail: [
        { time: new Date().toLocaleTimeString(), log: `Officer ${CURRENT_OFFICER} reopened this dispute case file for extra audit.` },
        ...(currentDispute.auditTrail || [])
      ]
    }
    persistDisputeChange(updated)
    triggerNotification("Case file reopened. Escrow unlocked.")
  }

  if (!currentDispute) {
    return (
      <div className="p-10 text-center text-stone">
         <Clock className="w-8 h-8 text-stone mx-auto animate-spin mb-2" />
         Loading dispute details...
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] -mt-2 -mx-2 gap-4 flex-col lg:flex-row relative">
      
      {/* Floating alert toaster */}
      {notification && (
        <div id="dispatch-notify" className="fixed top-4 right-4 bg-bg-elev border-l-4 border-lime text-cream p-3 text-xs rounded shadow-2xl z-50 flex items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-lime shrink-0" />
            <span className="font-medium">{notification}</span>
          </div>
        </div>
      )}

      {/* POPUP SIMULATE CUSTOMER EVIDENCE UPLOADER */}
      {showFileUploadSim && (
        <div id="modal-evidence-sim" className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-100">
          <div className="bg-bg-elev border border-rule rounded-md w-full max-w-sm p-5 relative shadow-2xl space-y-4">
             <div className="flex justify-between items-center">
                <h4 className="text-xs uppercase font-bold text-cream tracking-wide">Simulate Evidence Submission</h4>
                <button onClick={() => setShowFileUploadSim(false)} className="text-stone hover:text-cream text-xs">Close</button>
             </div>
             <p className="text-[11px] text-stone">Log extra transaction receipts or banking verification logs under this escrow lock.</p>
             
             <div className="space-y-3">
                <div>
                   <label className="text-[10px] text-stone block mb-1 uppercase font-medium">Uploader</label>
                   <select 
                     id="sim-upl-user"
                     value={simUploader} 
                     onChange={e => setSimUploader(e.target.value)}
                     className="w-full bg-bg-base border border-rule rounded px-2.5 py-1.5 text-xs text-cream outline-none"
                   >
                      <option value="Buyer (Ngozi)">Buyer (Ngozi)</option>
                      <option value="Seller (Sunday)">Seller (Sunday)</option>
                      <option value="Compliance Agent">Compliance Agent (External)</option>
                   </select>
                </div>

                <div>
                   <label className="text-[10px] text-stone block mb-1 uppercase font-medium">Filename</label>
                   <Input 
                     id="sim-upl-filename"
                     value={simFilename} 
                     onChange={e => setSimFilename(e.target.value)} 
                     className="bg-bg-base text-xs text-cream" 
                   />
                </div>

                <div>
                   <label className="text-[10px] text-stone block mb-1 uppercase font-medium">File Size</label>
                   <Input 
                     id="sim-upl-size"
                     value={simSize} 
                     onChange={e => setSimSize(e.target.value)} 
                     className="bg-bg-base text-xs text-cream" 
                   />
                </div>
             </div>

             <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setShowFileUploadSim(false)} className="text-xs">Cancel</Button>
                <Button id="btn-submit-simulated-evidence" size="sm" onClick={handleSimulateEvidenceUpload} className="bg-lime text-bg-base font-bold text-xs hover:bg-lime/90">
                   Add PDF Receipt
                </Button>
             </div>
          </div>
        </div>
      )}

      {/* LEFT COLUMN: CRITICAL ESCROW TARGET DETAILS & KYC MATRICES (320px) */}
      <div className="w-full lg:w-[320.0px] flex-shrink-0 bg-bg-paper border border-rule rounded-md flex flex-col p-4 space-y-4 overflow-y-auto">
         
         <div className="flex items-center gap-2 mb-1 shrink-0">
            <Link to="/admin/disputes" className="text-stone hover:text-cream cursor-pointer p-1">
               <ArrowLeft className="w-4 h-4" />
            </Link>
            <h2 className="text-sm font-bold font-mono text-lime tracking-tight">{currentDispute.id}</h2>
            <div className="ml-auto flex items-center gap-1">
              <Badge variant="destructive" className="text-[10px] bg-bg-base border border-bad text-bad">{currentDispute.priority}</Badge>
              {currentDispute.escalated && (
                <Badge variant="outline" className="text-[8px] bg-bad text-cream border-red-500 animate-pulse">ESCALATED</Badge>
              )}
            </div>
         </div>

         {/* General State overview widget */}
         <div className="p-3 bg-bg-base border border-rule-strong rounded-sm space-y-2.5">
            <div className="flex justify-between items-center text-xs">
               <span className="text-stone font-medium">Audit State</span>
               {currentDispute.status === "Resolved" ? (
                 <Badge variant="success" className="bg-good text-bg-base border-none text-[9px] uppercase font-bold">CASE CLEARED</Badge>
               ) : currentDispute.status === "In Progress" ? (
                 <Badge variant="warning" className="bg-warn/15 text-warn border-warn/10 text-[9px] uppercase font-bold">INVESTIGATION IN PROCESS</Badge>
               ) : (
                 <Badge variant="destructive" className="bg-bad text-white border-none text-[9px] uppercase font-bold">UNASSIGNED</Badge>
               )}
            </div>
            
            <div className="flex justify-between items-center text-xs">
               <span className="text-stone">Locked Coin</span>
               <span className="font-mono text-cream font-bold">{currentDispute.amountCoins || `${currentDispute.asset}`}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
               <span className="text-stone">Fiat Purchase Est.</span>
               <span className="font-mono text-lime font-bold">{currentDispute.tradeValue}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
               <span className="text-stone font-medium">Active Investigator</span>
               <span className="text-cream text-xs font-semibold">{currentDispute.assignee || "None Checked In"}</span>
            </div>

            {currentDispute.assignee === "Unassigned" && (
              <Button id="btn-claim-details-page" size="sm" onClick={handleAssignToMe} className="w-full bg-lime text-bg-base font-bold text-xs h-7 mt-1.5 hover:bg-lime/90">
                 Assign This Ticket to Me
              </Button>
            )}
         </div>

         {/* BUYER CARD (Beneficiary details) */}
         <div className="p-3 bg-bg-base border border-rule transition-colors hover:border-lime/30 rounded-sm">
            <div className="text-[9px] text-stone uppercase tracking-widest mb-1.5 font-bold flex items-center justify-between">
               <span>P2P Buyer (Crypto Output)</span>
               <span className="text-lime">{currentDispute.buyer.rating || "4.8★"}</span>
            </div>
            <div className="flex items-center gap-2.5 mb-2">
               <div className="w-7 h-7 rounded bg-bg-paper border border-rule flex items-center justify-center text-[10px] font-bold text-stone">
                  {currentDispute.buyer.initials || "NA"}
               </div>
               <div>
                  <div className="text-xs font-semibold text-cream leading-tight">{currentDispute.buyer.name}</div>
                  <div className="text-[9px] font-mono text-stone">{currentDispute.buyer.tier || "Tier 2 KYC"}</div>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[9px]">
               <div className="p-1.5 bg-bg-paper border border-rule rounded flex flex-col justify-center">
                  <span className="text-stone leading-tight">Total Trades</span>
                  <span className="font-mono font-bold text-cream">{currentDispute.buyer.trades ?? 342}</span>
               </div>
               <div className="p-1.5 bg-bg-paper border border-rule rounded flex flex-col justify-center">
                  <span className="text-stone leading-tight">Historical Disputes</span>
                  <span className="font-mono font-bold text-good">{currentDispute.buyer.disputeRate ?? "0.4%"}</span>
               </div>
            </div>
         </div>

         {/* SELLER CARD (Depositor details) */}
         <div className="p-3 bg-bg-base border border-rule transition-colors hover:border-lime/30 rounded-sm">
            <div className="text-[9px] text-stone uppercase tracking-widest mb-1.5 font-bold flex items-center justify-between">
               <span>P2P Seller (Fiat Collector)</span>
               <span className="text-lime">{currentDispute.seller.rating || "4.9★"}</span>
            </div>
            <div className="flex items-center gap-2.5 mb-2">
               <div className="w-7 h-7 rounded bg-bg-paper border border-rule flex items-center justify-center text-[10px] font-bold text-stone">
                  {currentDispute.seller.initials || "SA"}
               </div>
               <div>
                  <div className="text-xs font-semibold text-cream leading-tight">{currentDispute.seller.name}</div>
                  <div className="text-[9px] font-mono text-stone">{currentDispute.seller.tier || "Tier 3 KYC"}</div>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[9px]">
               <div className="p-1.5 bg-bg-paper border border-rule rounded flex flex-col justify-center">
                  <span className="text-stone leading-tight">Total Trades</span>
                  <span className="font-mono font-bold text-cream">{currentDispute.seller.trades ?? 1024}</span>
               </div>
               <div className="p-1.5 bg-bg-paper border border-rule rounded flex flex-col justify-center">
                  <span className="text-stone leading-tight">Historical Disputes</span>
                  <span className="font-mono font-bold text-warn">{currentDispute.seller.disputeRate ?? "2.1%"}</span>
               </div>
            </div>
         </div>

         {/* COMPLAINT SOURCE STATEMENT BLOCK */}
         <div className="p-3 bg-bad/10 border border-bad/20 rounded-sm space-y-1.5">
            <div className="flex items-center justify-between text-[10px]">
               <span className="text-stone font-semibold">Complaint Originator:</span>
               <span className="text-bad font-mono uppercase bg-bad/20 px-1 py-0.5 rounded-sm font-bold">Opened by {currentDispute.openedBy || "Seller"}</span>
            </div>
            <p className="text-xs text-bad leading-relaxed italic">"{currentDispute.reason}"</p>
         </div>

         {/* SLA CRITICAL TIME REMAINING COUNTDOWN */}
         <div className="mt-auto pt-3 border-t border-rule flex flex-col items-center justify-center">
            <div className="text-[9px] text-stone uppercase tracking-widest mb-1 flex items-center gap-1 justify-center">
               <Clock className="w-3 h-3 text-stone" /> SLA TARGET RESPONSE TIME LEFT
            </div>
            <div className="font-mono text-lg text-bad tracking-wider filter drop-shadow-[0_0_6px_rgba(239,108,94,0.3)]">
               {currentDispute.status === "Resolved" ? "LOCKED (00:00)" : "18:14"}
            </div>
         </div>

      </div>

      {/* CENTER COLUMN: LIVE TRADE CHAT HUB & COMPLIANCE DATA TABLE SHEETS (Flex-1) */}
      <div className="flex-1 bg-bg-base border border-rule rounded-md flex flex-col min-w-0">
          
          {/* Section Selector Hub Tabs */}
          <div className="flex overflow-x-auto border-b border-rule hide-scrollbar shrink-0 px-2 pt-2 bg-bg-paper">
             {[
               { id: "CHAT", label: "Interactive Trade Chat", icon: MessageSquare },
               { id: "EVIDENCE", label: "Deposited Proofs", icon: Paperclip },
               { id: "TRADE_HISTORY", label: "Escrow Ledger States", icon: Activity },
               { id: "AUDIT_TRAIL", label: "Audit Timeline Log (" + (currentDispute.auditTrail?.length || 0) + ")", icon: Activity }
             ].map(tab => {
               const Icon = tab.icon
               return (
                 <button
                   key={tab.id}
                   id={`tab-dispute-center-${tab.id.toLowerCase()}`}
                   onClick={() => setActiveCenterTab(tab.id)}
                   className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${activeCenterTab === tab.id ? 'border-lime text-lime' : 'border-transparent text-stone hover:text-cream'}`}
                 >
                   <Icon className="w-3.5 h-3.5" />
                   {tab.label}
                 </button>
               )
             })}
          </div>

          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 min-h-0">
             
             {/* DETAILED ACTIVE COMPONENT VIEWS */}
             {activeCenterTab === 'CHAT' && (
                <div className="flex flex-col h-full justify-between gap-4">
                    
                    {/* Chat Messages Log Scroll */}
                    <div className="flex flex-col gap-3 pr-1 py-1">
                        <div className="text-center shrink-0">
                           <span className="text-[9px] bg-bg-elev px-2.5 py-1 border border-rule rounded-full text-stone">SYSTEM: Safe Escrow Hold Triggered • 10:45 AM</span>
                        </div>

                        {currentDispute.chatHistory?.map((msg: any, idx: number) => {
                          const isSystem = msg.role === 'system'
                          const isSeller = msg.role === 'seller'
                          const isBuyer = msg.role === 'buyer'

                          if (isSystem) {
                            return (
                              <div key={idx} className="bg-lime/5 border border-lime/20 p-2.5 rounded text-xs text-lime max-w-lg mx-auto text-center space-y-1">
                                <span className="font-bold text-[10px] block uppercase text-lime mb-0.5">{msg.sender} BroadCast</span>
                                <p className="italic">"{msg.message}"</p>
                                <span className="text-[8px] opacity-70 block text-right">{msg.time || "Just now"}</span>
                              </div>
                            )
                          }

                          return (
                            <div 
                              key={idx} 
                              className={`flex flex-col gap-1 max-w-[85%] ${isSeller ? 'ml-auto items-end' : 'items-start'}`}
                            >
                              <span className="text-[10px] text-stone">
                                 {msg.sender} • {msg.time || "Recently"}
                              </span>
                              
                              <div className={`p-3 rounded-md text-[13px] leading-relaxed border ${
                                isSeller 
                                  ? 'bg-bg-paper border-rule-strong text-cream rounded-tr-none' 
                                  : 'bg-bg-elev border-rule text-cream rounded-tl-none'
                              }`}>
                                 {msg.message}
                              </div>

                              {msg.attachment && (
                                <div className="mt-1 bg-bg-elev border border-rule p-2 rounded-md flex items-center gap-2 w-44 cursor-pointer hover:border-lime transition-colors">
                                   <Paperclip className="w-3.5 h-3.5 text-stone shrink-0" />
                                   <span className="text-[10px] font-mono text-stone truncate">{msg.attachment}</span>
                                </div>
                              )}
                            </div>
                          )
                        })}
                    </div>
                    
                    {/* Admin Message Push Entry panel */}
                    <form onSubmit={handleSendAdminChatMessage} className="border-t border-rule pt-3 mt-auto shrink-0 flex items-center gap-2">
                       <Input 
                         id="input-admin-chat-message"
                         value={adminChatMessage}
                         onChange={e => setAdminChatMessage(e.target.value)}
                         placeholder="Enter warning memo, SLA notification, or support guidance here..."
                         className="bg-bg-paper text-xs text-cream flex-1 h-9 border-rule"
                         disabled={currentDispute.status === "Resolved"}
                       />
                       <Button 
                         id="btn-submit-chat-msg"
                         type="submit" 
                         size="sm" 
                         className="bg-lime text-bg-base font-bold gap-1 h-9"
                         disabled={currentDispute.status === "Resolved" || !adminChatMessage.trim()}
                       >
                         <Send className="w-3 h-3" /> Issue Notice
                       </Button>
                    </form>
                </div>
             )}

             {activeCenterTab === 'EVIDENCE' && (
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center bg-bg-paper/40 p-3 rounded-md border border-rule">
                       <div>
                          <h3 className="text-xs uppercase font-bold text-cream tracking-wide">Validation Materials</h3>
                          <p className="text-[11px] text-stone mt-0.5">Physical or digital artifacts deposited for ownership confirmation.</p>
                       </div>
                       <Button id="btn-evidence-trigger-mock" size="sm" variant="outline" className="h-7 text-[10px] border-lime/30 text-lime" onClick={() => setShowFileUploadSim(true)}>
                          Simulate Evidence File Drop
                       </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="border border-rule rounded-md p-4 bg-bg-paper flex flex-col justify-between">
                          <div>
                            <div className="text-[11px] font-bold text-stone uppercase tracking-wide mb-2">Buyer Account receipts</div>
                            {currentDispute.evidence?.filter((ev: any) => ev.uploader.includes("Buyer"))?.map((ev: any, idx: number) => (
                              <div key={idx} className="bg-bg-elev border border-rule p-3 rounded-md flex items-center gap-3 cursor-pointer hover:border-lime transition-colors">
                                 <Paperclip className="w-6 h-6 text-lime" />
                                 <div>
                                    <span className="text-xs font-mono font-medium text-cream block truncate">{ev.filename}</span>
                                    <span className="text-[10px] text-stone">{ev.size} • Deposited {ev.timestamp}</span>
                                 </div>
                              </div>
                            ))}
                            {(!currentDispute.evidence || currentDispute.evidence.filter((ev: any) => ev.uploader.includes("Buyer")).length === 0) && (
                              <div className="text-center py-6 text-[11px] text-stone">No direct Buyer evidence logged.</div>
                            )}
                          </div>
                       </div>

                       <div className="border border-rule rounded-md p-4 bg-bg-paper flex flex-col justify-between">
                          <div>
                            <div className="text-[11px] font-bold text-stone uppercase tracking-wide mb-2">Seller Banking logs</div>
                            {currentDispute.evidence?.filter((ev: any) => ev.uploader.includes("Seller"))?.map((ev: any, idx: number) => (
                              <div key={idx} className="bg-bg-elev border border-rule p-3 rounded flex items-center gap-3 cursor-pointer hover:border-lime transition-colors">
                                 <Paperclip className="w-6 h-6 text-lime" />
                                 <div>
                                    <span className="text-xs font-mono font-medium text-cream block truncate">{ev.filename}</span>
                                    <span className="text-[10px] text-stone">{ev.size} • Deposited {ev.timestamp}</span>
                                 </div>
                              </div>
                            ))}
                            {(!currentDispute.evidence || currentDispute.evidence.filter((ev: any) => ev.uploader.includes("Seller")).length === 0) && (
                              <div className="text-center py-6 text-[11px] text-stone italic border border-dashed border-rule rounded">Awaiting Seller banking logs...</div>
                            )}
                          </div>
                       </div>
                    </div>
                </div>
             )}

             {activeCenterTab === 'TRADE_HISTORY' && (
                <div className="flex flex-col gap-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-cream">Transaction State Trail Analysis</h3>
                    <div className="border border-rule rounded-md overflow-hidden bg-bg-paper">
                        <table className="w-full text-left text-xs">
                           <thead className="bg-bg-base border-b border-rule">
                              <tr>
                                 <th className="px-4 py-2 font-bold text-stone tracking-wide">Time log</th>
                                 <th className="px-4 py-2 font-bold text-stone tracking-wide">P2P State Change</th>
                                 <th className="px-4 py-2 font-bold text-stone tracking-wide">Locked Sum Impact</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-rule font-mono">
                              <tr>
                                 <td className="px-4 py-3 text-stone text-[11px]">10:45:00</td>
                                 <td className="px-4 py-3"><Badge variant="outline" className="text-[9px] bg-bg-base">Transaction Locked</Badge></td>
                                 <td className="px-4 py-3 text-lime font-bold">{currentDispute.amountCoins ?? "1450 USDT"} locked in escrow wallet.</td>
                              </tr>
                              <tr>
                                 <td className="px-4 py-3 text-stone text-[11px]">10:55:12</td>
                                 <td className="px-4 py-3"><Badge variant="secondary" className="text-[9px] bg-sky-900 border-none text-sky-200">Marked as PAID</Badge></td>
                                 <td className="px-4 py-3 text-stone">Buyer clicked payment confirmation trigger.</td>
                              </tr>
                              <tr>
                                 <td className="px-4 py-3 text-stone text-[11px]">11:15:22</td>
                                 <td className="px-4 py-3"><Badge variant="destructive" className="text-[9px] bg-bad/10 text-bad border-bad/20 font-bold">ESCROW DISPUTE</Badge></td>
                                 <td className="px-4 py-3 text-bad font-semibold">Seller filed dispute block. Withdraw interface frozen.</td>
                              </tr>
                           </tbody>
                        </table>
                    </div>
                </div>
             )}

             {activeCenterTab === 'AUDIT_TRAIL' && (
                <div className="flex flex-col gap-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-cream">Chronological Back-Office Operations Audit Trail</h3>
                    <div className="bg-bg-paper border border-rule rounded p-4 font-mono text-xs space-y-2.5 max-h-96 overflow-y-auto">
                        {currentDispute.auditTrail?.map((trail: any, idx: number) => (
                          <div key={idx} className="flex gap-4 border-b border-rule/35 pb-2.5">
                             <span className="text-lime w-20 shrink-0 font-bold">{trail.time}</span>
                             <span className="text-stone">{trail.log}</span>
                          </div>
                        ))}
                    </div>
                </div>
             )}

          </div>

          {/* SESSIONS NOTES (Auditors logging notebook panel) */}
          <div className="border-t border-rule p-4 bg-bg-paper">
             <h4 className="text-[10px] uppercase font-bold text-cream tracking-widest mb-3 flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-stone" /> Internal Private Case Memos ({currentDispute.notes?.length || 0})
             </h4>

             <form onSubmit={handleAddInternalNote} className="flex gap-2 mb-3">
                <Input 
                  id="internal-note-input"
                  value={internalNoteText}
                  onChange={e => setInternalNoteText(e.target.value)}
                  placeholder="Record private compliance findings, evidence discrepancies, call notes..."
                  className="bg-bg-base text-xs text-cream flex-1 h-9 border-rule"
                />
                <Button id="btn-save-note" type="submit" size="sm" className="bg-bg-elev border border-rule text-cream hover:bg-bg-base font-bold text-xs">
                   Log Memo
                </Button>
             </form>

             {/* Display listed internal notes */}
             <div className="flex flex-col gap-2 max-h-36 overflow-y-auto">
                {currentDispute.notes?.map((nt: any, idx: number) => (
                  <div key={idx} className="bg-bg-base border border-rule rounded p-2.5 text-[11px] relative">
                     <div className="flex justify-between items-center text-stone mb-1 font-mono text-[9px]">
                        <span className="font-bold text-lime">{nt.author}</span>
                        <span>{nt.time}</span>
                     </div>
                     <p className="text-cream font-mono leading-relaxed">"{nt.text}"</p>
                  </div>
                ))}
                {(!currentDispute.notes || currentDispute.notes.length === 0) && (
                  <p className="text-[10px] text-stone italic text-center py-2">No session notes recorded yet. Write findings above in safety.</p>
                )}
             </div>
          </div>
      </div>

      {/* RIGHT COLUMN: RESOLUTION DECISION MATRIX CONSOLE (380px) */}
      <div className="w-full lg:w-[380px] flex-shrink-0 bg-bg-elev border border-rule rounded-md flex flex-col relative overflow-hidden">
          
          <div className="p-4 border-b border-rule bg-bg-paper shrink-0">
             <div className="flex items-center gap-1.5">
               <ShieldAlert className="w-4 h-4 text-lime" />
               <h3 className="font-display font-bold text-cream text-sm">Escrow Release Counsel</h3>
             </div>
             <p className="text-[10px] text-stone mt-1 font-medium">Resolutions move blockchain escrow assets immediately. Review logs before locking.</p>
          </div>

          <div className="p-4 flex-1 flex flex-col gap-5 overflow-y-auto">
             
             {currentDispute.status === "Resolved" ? (
                // IF CASE RESOLVED state output
                <div className="bg-bg-paper border border-good rounded p-4 text-center my-auto space-y-4">
                   <div className="w-12 h-12 bg-good/10 rounded-full flex items-center justify-center mx-auto text-good">
                      <Lock className="w-6 h-6 shrink-0" />
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-good uppercase tracking-wide">Escrow File Settled</h4>
                      <p className="text-[11px] text-stone mt-1.5">This dispute case transaction was finalized, funds released, and operations completed successfully.</p>
                   </div>

                   <div className="bg-bg-base border border-rule rounded p-3 text-left space-y-2 font-mono text-[11px]">
                      <div>
                         <span className="text-stone">Decision Winner: </span>
                         <span className="font-bold text-lime uppercase">{currentDispute.resolutionDetails?.winner}</span>
                      </div>
                      <div>
                         <span className="text-stone">Reasoning Code: </span>
                         <span className="text-cream font-medium">{currentDispute.resolutionDetails?.reasonCode}</span>
                      </div>
                      <div>
                         <span className="text-stone">Official Note: </span>
                         <span className="text-stone italic block mt-1">"{currentDispute.resolutionDetails?.notes}"</span>
                      </div>
                      <div className="pt-1.5 border-t border-rule text-[9px] text-stone flex justify-between">
                         <span>Auditor: {currentDispute.resolutionDetails?.resolvedBy}</span>
                         <span>Resolved {currentDispute.resolutionDetails?.resolvedAt?.substring(11,16) || "Recent"}</span>
                      </div>
                   </div>

                   <Button id="btn-reopen-case" variant="outline" size="sm" onClick={handleReopenFile} className="w-full border-rule hover:bg-bg-base text-xs text-stone hover:text-cream">
                      <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reopen Dispute for Extra Investigation
                   </Button>
                </div>
             ) : (
                // IF ACTIVE state input resolution controls
                <>
                   {/* Option 1: Selector Box */}
                   <div className="space-y-3 shrink-0">
                      <label className="text-[10px] font-bold text-stone uppercase tracking-widest block">Step 1: Choose Escrow Outlet</label>
                      <div className="space-y-2">
                         <label className={`flex gap-3 p-3 border rounded-sm cursor-pointer transition-colors relative ${resolutionType === 'buyer' ? 'bg-bg-paper border-lime' : 'border-rule hover:bg-bg-paper'}`}>
                            <input 
                              type="radio" 
                              id="rad-winner-buyer"
                              name="rTypeWinner" 
                              checked={resolutionType === "buyer"}
                              onChange={() => setResolutionType("buyer")}
                              className="mt-0.5 accent-lime" 
                            />
                            <div>
                               <p className="text-xs font-bold text-cream">Release Escrow to Buyer</p>
                               <p className="text-[10px] text-stone mt-0.5 leading-relaxed">System forwards the digital tokens ({currentDispute.amountCoins ?? "USDT / Coin"}) to {currentDispute.buyer.name}. Seller receives nothing.</p>
                            </div>
                         </label>

                         <label className={`flex gap-3 p-3 border rounded-sm cursor-pointer transition-colors relative ${resolutionType === 'seller' ? 'bg-bg-paper border-lime' : 'border-rule hover:bg-bg-paper'}`}>
                            <input 
                              type="radio" 
                              id="rad-winner-seller"
                              name="rTypeWinner" 
                              checked={resolutionType === "seller"}
                              onChange={() => setResolutionType("seller")}
                              className="mt-0.5 accent-lime" 
                            />
                            <div>
                               <p className="text-xs font-bold text-cream">Refund Escrow to Seller</p>
                               <p className="text-[10px] text-stone mt-0.5 leading-relaxed">Return tokens to Sunday. Escrow transfers cease, and customer order is voided safely.</p>
                            </div>
                         </label>

                         <label className={`flex gap-3 p-3 border rounded-sm cursor-pointer transition-colors relative ${resolutionType === 'split' ? 'bg-bg-paper border-warn' : 'border-rule hover:bg-bg-paper'}`}>
                            <input 
                              type="radio" 
                              id="rad-winner-split"
                              name="rTypeWinner" 
                              checked={resolutionType === "split"}
                              onChange={() => setResolutionType("split")}
                              className="mt-0.5 accent-warn" 
                            />
                            <div>
                               <p className="text-xs font-bold text-cream">Split Locked Account Balance</p>
                               <p className="text-[10px] text-stone mt-0.5 leading-relaxed">Specify multi-signature split percentages between trade participants.</p>
                            </div>
                         </label>
                      </div>
                   </div>

                   {/* Option 2: Select reasoning */}
                   <div className="space-y-3 shrink-0">
                      <label className="text-[10px] font-bold text-stone uppercase tracking-widest block">Step 2: Legal Reasoning Code</label>
                      <select 
                        id="select-reasoning-code"
                        value={reasonCode}
                        onChange={e => setReasonCode(e.target.value)}
                        className="w-full bg-bg-base border border-rule h-9 px-3 text-xs text-cream rounded-sm focus:outline-none focus:border-lime cursor-pointer appearance-none"
                      >
                         <option value="Valid proof of payment provided by Buyer.">Valid proof of payment provided by Buyer.</option>
                         <option value="Payment received and confirmed by Seller.">Payment received and confirmed by Seller.</option>
                         <option value="Buyer failed to provide valid bank proof in time limit.">Buyer failed to provide valid bank proof inside SLA window.</option>
                         <option value="Seller unresponsive inside official SLA bounds.">Seller unresponsive inside official SLA bounds.</option>
                         <option value="Suspected third-party fraudulent payment spoofing.">Suspected third-party fraudulent payment spoofing.</option>
                      </select>
                   </div>

                   {/* Option 3: Admin notes explaining rationale */}
                   <div className="space-y-3 flex-1 flex flex-col min-h-[140px]">
                      <label className="text-[10px] font-bold text-stone uppercase tracking-widest flex justify-between shrink-0">
                         Step 3: Ruling Rationale Remarks <span className="text-bad">*</span>
                      </label>
                      <textarea 
                         id="input-resolution-notes"
                         value={adminNotes}
                         onChange={e => setAdminNotes(e.target.value)}
                         className="w-full flex-1 bg-bg-base border border-rule p-3 text-xs text-cream rounded-sm focus:outline-none focus:border-lime resize-none font-mono" 
                         placeholder="Explain exact ruling details to participants (minimum 15 characters required to authorize)..."
                      ></textarea>
                   </div>
                   
                   {/* Option 4: Senior escalation toggles */}
                   <div className="pt-2 border-t border-rule space-y-3 shrink-0 mt-auto">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                         <input 
                           type="checkbox" 
                           id="chk-escalate-senior-flag"
                           checked={isEscalateChecked}
                           onChange={e => handleToggleEscalate(e.target.checked)}
                           className="rounded-sm border-rule bg-bg-base accent-warn w-3.5 h-3.5 cursor-pointer" 
                         />
                         <span className="text-[11px] text-stone">Escalate this dispute to Senior Admin review panel</span>
                      </label>

                      <Button 
                        id="btn-execute-dispute-ruling"
                        className="w-full font-bold btn-glow" 
                        size="lg" 
                        disabled={adminNotes.trim().length < 15}
                        onClick={handleExecuteResolution}
                      >
                         Execute Resolution & Unlock Escrow
                      </Button>
                      
                      <div className="text-[9px] text-center text-stone font-mono select-none">
                         Sign-off profile verification token authority: <span className="text-cream">{CURRENT_OFFICER}</span>
                      </div>
                   </div>
                </>
             )}
          </div>
      </div>

    </div>
  )
}
