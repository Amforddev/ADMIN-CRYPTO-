import React, { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  ArrowLeft, 
  ArrowRight, 
  ShieldAlert, 
  Trash2, 
  Plus, 
  RefreshCw, 
  Check, 
  CheckCircle2, 
  X, 
  Clock, 
  AlertTriangle, 
  Send, 
  UserCheck, 
  BadgeAlert, 
  Scale
} from "lucide-react"

// Current Investigator profile name
const CURRENT_OFFICER = "Sunday O. (Self)"

export default function Disputes() {
  const navigate = useNavigate()

  // Tab views
  const [activeTab, setActiveTab] = useState("Open")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter conditions
  const [priorityFilter, setPriorityFilter] = useState("All")
  const [assetFilter, setAssetFilter] = useState("All")
  const [assigneeFilter, setAssigneeFilter] = useState("All")

  // Popover menus state
  const [showPriorityMenu, setShowPriorityMenu] = useState(false)
  const [showAssetMenu, setShowAssetMenu] = useState(false)
  const [showAssigneeMenu, setShowAssigneeMenu] = useState(false)

  // Floating feedback toaster notifications
  const [notification, setNotification] = useState<string | null>(null)

  // Master local persistence lookup
  const [disputes, setDisputes] = useState<any[]>(() => {
    const saved = localStorage.getItem("volt-disputes-list")
    if (saved) return JSON.parse(saved)

    const initialList = [
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
      },
      {
        id: "dsp_p2912k",
        priority: "P2",
        timestamp: "2026-06-02T21:48:00Z",
        age: "42m",
        tradeValue: "₦150,000",
        rawAmount: 150000,
        asset: "BTC",
        amountCoins: "0.025 BTC",
        buyer: { name: "Ibrahim Musa", initials: "IM", rating: "4.6★", tier: "Tier 2 KYC", trades: 98, disputeRate: "1.2%" },
        seller: { name: "Chibueze Eze", initials: "CE", rating: "4.7★", tier: "Tier 1 KYC", trades: 541, disputeRate: "0.9%" },
        reason: "Paid incorrect amount",
        assignee: "Ade M.",
        status: "In Progress",
        openedBy: "Buyer",
        escalated: false,
        chatHistory: [
          { sender: "Ibrahim (Buyer)", role: "buyer", message: "Oops, I made a mistake on transfer fee deduction, sent ₦145,000 instead.", time: "10:52 AM" },
          { sender: "Chibueze (Seller)", role: "seller", message: "Please send the remaining balance, or I will not release.", time: "10:58 AM" }
        ],
        evidence: [],
        auditTrail: [
          { time: "11:01:00", log: "Buyer Ibrahim Musa opened escrow dispute: 'Sent wrong sum'." }
        ],
        notes: [
          { author: "Ade M.", text: "Contacted both users. Buyer agreed to send ₦5,000 top up transfer.", time: "20m ago" }
        ]
      },
      {
        id: "dsp_0lm92j",
        priority: "P1",
        timestamp: "2026-06-02T21:18:00Z",
        age: "1h 12m",
        tradeValue: "₦5,800,000",
        rawAmount: 5800000,
        asset: "ETH",
        amountCoins: "2.63 ETH",
        buyer: { name: "Adaeze Okonkwo", initials: "AO", rating: "4.9★", tier: "Tier 2 KYC", trades: 139, disputeRate: "0.1%" },
        seller: { name: "Funke Adebayo", initials: "FA", rating: "4.5★", tier: "Tier 2 KYC", trades: 389, disputeRate: "1.8%" },
        reason: "Suspected third-party payment",
        assignee: "Chioma D.",
        status: "Open",
        openedBy: "Seller",
        escalated: true,
        chatHistory: [
          { sender: "Funke (Seller)", role: "seller", message: "The name on your bank transfer is 'Emeka Okonkwo' but your KYC name is 'Adaeze'. Third-party transfer is forbidden.", time: "10:15 AM" },
          { sender: "Adaeze (Buyer)", role: "buyer", message: "That is my husband's corporate account, but I authorized it. Let me send certification.", time: "10:20 AM" }
        ],
        evidence: [],
        auditTrail: [
          { time: "10:31:00", log: "Dispute escalated to Senior Administration queue due to high value threshold." }
        ],
        notes: []
      },
      {
        id: "dsp_72kmd2",
        priority: "P3",
        timestamp: "2026-06-02T19:30:00Z",
        age: "3h",
        tradeValue: "₦45,000",
        rawAmount: 45000,
        asset: "USDT",
        amountCoins: "39.10 USDT",
        buyer: { name: "Uchenna E.", initials: "UE", rating: "4.5★", tier: "Tier 1 KYC", trades: 12, disputeRate: "5.0%" },
        seller: { name: "Mercy O.", initials: "MO", rating: "4.8★", tier: "Tier 1 KYC", trades: 89, disputeRate: "0.0%" },
        reason: "Seller unresponsive",
        assignee: "Unassigned",
        status: "Open",
        openedBy: "Buyer",
        escalated: false,
        chatHistory: [
          { sender: "Uchenna (Buyer)", role: "buyer", message: "Paid.", time: "08:12 AM" }
        ],
        evidence: [],
        auditTrail: [
          { time: "08:43:00", log: "Buyer Uchenna E. raised dispute: Merchant has gone offline." }
        ],
        notes: []
      }
    ]
    localStorage.setItem("volt-disputes-list", JSON.stringify(initialList))
    return initialList
  })

  // Selected items queue for bulk executions
  const [selectedDisputeIds, setSelectedDisputeIds] = useState<string[]>([])

  // Fast manual dispute entry modal states
  const [showAddDisputeModal, setShowAddDisputeModal] = useState(false)
  const [frmBuyer, setFrmBuyer] = useState("Kola Ademola")
  const [frmSeller, setFrmSeller] = useState("Oluwaseun T.")
  const [frmAsset, setFrmAsset] = useState("USDT")
  const [frmAmount, setFrmAmount] = useState("1,200 USDT")
  const [frmValue, setFrmValue] = useState("₦1,380,000")
  const [frmReason, setFrmReason] = useState("Buyer sent smaller local currency deposit")
  const [frmPriority, setFrmPriority] = useState("P2")

  // Synchronize state changes to store
  useEffect(() => {
    localStorage.setItem("volt-disputes-list", JSON.stringify(disputes))
  }, [disputes])

  // Notification automatic cleanup
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const showToast = (msg: string) => {
    setNotification(msg)
  }

  // Quick single assignment action
  const handleAssignToMe = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = disputes.map(d => {
      if (d.id === id) {
        return {
          ...d,
          assignee: CURRENT_OFFICER,
          status: d.status === "Open" ? "In Progress" : d.status,
          auditTrail: [
            { time: new Date().toLocaleTimeString(), log: `Dispute assigned directly to Officer ${CURRENT_OFFICER}` },
            ...(d.auditTrail || [])
          ]
        }
      }
      return d
    })
    setDisputes(updated)
    showToast(`Claimed assignment for dispute ${id}`)
  }

  // Bulk actions: Assign select queues to me
  const handleBulkAssignToMe = () => {
    if (selectedDisputeIds.length === 0) return
    const updated = disputes.map(d => {
      if (selectedDisputeIds.includes(d.id)) {
        return {
          ...d,
          assignee: CURRENT_OFFICER,
          status: d.status === "Open" ? "In Progress" : d.status,
          auditTrail: [
            { time: new Date().toLocaleTimeString(), log: `Officer ${CURRENT_OFFICER} claimed this item via bulk queue routing.` },
            ...(d.auditTrail || [])
          ]
        }
      }
      return d
    })
    setDisputes(updated)
    setSelectedDisputeIds([])
    showToast(`Successfully assigned ${selectedDisputeIds.length} disputes to your desk.`)
  }

  // Bulk action: Escalate select queues
  const handleBulkEscalate = () => {
    if (selectedDisputeIds.length === 0) return
    const updated = disputes.map(d => {
      if (selectedDisputeIds.includes(d.id)) {
        return {
          ...d,
          priority: "P1",
          escalated: true,
          auditTrail: [
            { time: new Date().toLocaleTimeString(), log: `Escalated directly via back-office bulk triage.` },
            ...(d.auditTrail || [])
          ]
        }
      }
      return d
    })
    setDisputes(updated)
    setSelectedDisputeIds([])
    showToast(`Escalated ${selectedDisputeIds.length} selected disputes to emergency P1 status.`)
  }

  // Bulk action: Mark selected as completed
  const handleBulkResolve = () => {
    if (selectedDisputeIds.length === 0) return
    const updated = disputes.map(d => {
      if (selectedDisputeIds.includes(d.id)) {
        return {
          ...d,
          status: "Resolved",
          resolutionDetails: {
            winner: "split",
            reasonCode: "Settled via Administrative Bulk Closure",
            notes: "Closed transaction database via compliance queue triage.",
            resolvedAt: new Date().toISOString(),
            resolvedBy: CURRENT_OFFICER
          },
          auditTrail: [
            { time: new Date().toLocaleTimeString(), log: `Bulk resolved via back-office console clearance.` },
            ...(d.auditTrail || [])
          ]
        }
      }
      return d
    })
    setDisputes(updated)
    setSelectedDisputeIds([])
    showToast(`Resolved ${selectedDisputeIds.length} disputes as split/cleared.`)
  }

  // Create manual Backoffice Dispute file entry
  const handleCreateDispute = () => {
    if (!frmBuyer.trim() || !frmSeller.trim()) {
      showToast("Both buyer and seller profile names required.")
      return
    }

    const nId = `dsp_${Math.random().toString(36).substring(2, 8)}`
    const newRecord = {
      id: nId,
      priority: frmPriority,
      timestamp: new Date().toISOString(),
      age: "Just now",
      tradeValue: frmValue,
      rawAmount: parseFloat(frmValue.replace(/[^\d]/g, "")) || 50000,
      asset: frmAsset,
      amountCoins: frmAmount,
      buyer: { name: frmBuyer, initials: frmBuyer.split(' ').map(n=>n[0]).join(''), rating: "4.5★", tier: "Tier 1 KYC", trades: 15, disputeRate: "0%" },
      seller: { name: frmSeller, initials: frmSeller.split(' ').map(n=>n[0]).join(''), rating: "4.8★", tier: "Tier 2 KYC", trades: 110, disputeRate: "1.0%" },
      reason: frmReason,
      assignee: "Unassigned",
      status: "Open",
      openedBy: "Buyer",
      escalated: false,
      chatHistory: [
        { sender: "System", role: "system", message: `Dispute opened by backoffice administrator for trade value ${frmValue}.`, time: new Date().toLocaleTimeString() }
      ],
      evidence: [],
      auditTrail: [
        { time: new Date().toLocaleTimeString(), log: `Manual dispute profile generated by Officer ${CURRENT_OFFICER}` }
      ],
      notes: []
    }

    setDisputes([newRecord, ...disputes])
    setShowAddDisputeModal(false)
    showToast(`Registered system dispute ID: ${nId}`)
  }

  // Excel/CSV Exporter
  const handleExportCSV = (subset: any[]) => {
    const list = subset.length > 0 ? subset : disputes
    if (list.length === 0) {
      showToast("No dispute rows found to compile.")
      return
    }

    const headers = "Dispute_ID,Priority,Status,Asset,Trade_Value,Buyer,Seller,Reason,Assignee,Escalated\n"
    const content = list.map(d => {
      return `"${d.id}","${d.priority}","${d.status}","${d.asset}","${d.tradeValue}","${d.buyer.name}","${d.seller.name}","${d.reason}","${d.assignee}","${d.escalated ? 'YES' : 'NO'}"`
    }).join("\n")

    const blob = new Blob([headers + content], { type: "text/csv" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `p2p_disputes_report_${Date.now()}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
    showToast(`Exported CSV containing ${list.length} disputes.`)
  }

  // Master Memoized Search and Multi-dropdown Filter matching
  const filteredDisputes = useMemo(() => {
    return disputes.filter(d => {
      // 1. Tab criteria filter
      if (activeTab === "Open") {
        if (d.status === "Resolved") return false
      } else if (activeTab === "Assigned to me") {
        if (d.assignee !== CURRENT_OFFICER || d.status === "Resolved") return false
      } else if (activeTab === "Resolved") {
        if (d.status !== "Resolved") return false
      }

      // 2. Dropdown: Priority Filter
      if (priorityFilter !== "All" && d.priority !== priorityFilter) return false

      // 3. Dropdown: Asset Filter
      if (assetFilter !== "All" && d.asset !== assetFilter) return false

      // 4. Dropdown: Assignee status
      if (assigneeFilter !== "All") {
        if (assigneeFilter === "Unassigned" && d.assignee !== "Unassigned") return false
        if (assigneeFilter === "Me" && d.assignee !== CURRENT_OFFICER) return false
        if (assigneeFilter === "Others" && (d.assignee === "Unassigned" || d.assignee === CURRENT_OFFICER)) return false
      }

      // 5. Keyword search matching across multiple fields
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const idMatch = d.id.toLowerCase().includes(q)
        const buyerMatch = d.buyer.name.toLowerCase().includes(q)
        const sellerMatch = d.seller.name.toLowerCase().includes(q)
        const reasonMatch = d.reason.toLowerCase().includes(q)
        const assigneeMatch = d.assignee.toLowerCase().includes(q)

        if (!idMatch && !buyerMatch && !sellerMatch && !reasonMatch && !assigneeMatch) {
          return false
        }
      }

      return true
    })
  }, [disputes, activeTab, priorityFilter, assetFilter, assigneeFilter, searchQuery])

  // Single-row checkbox activation
  const handleSelectRow = (id: string, e: any) => {
    e.stopPropagation()
    setSelectedDisputeIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  // Clear every single search filter
  const handleResetFilters = () => {
    setQueryCleared()
    showToast("Filters configured back to default open state.")
  }

  const setQueryCleared = () => {
    setSearchQuery("")
    setPriorityFilter("All")
    setAssetFilter("All")
    setAssigneeFilter("All")
  }

  const handleHeaderCheckbox = () => {
    const visibleIds = filteredDisputes.map(x => x.id)
    const allSelected = visibleIds.length > 0 && visibleIds.every(id => selectedDisputeIds.includes(id))

    if (allSelected) {
      setSelectedDisputeIds(prev => prev.filter(id => !visibleIds.includes(id)))
    } else {
      setSelectedDisputeIds(prev => Array.from(new Set([...prev, ...visibleIds])))
    }
  }

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)] relative font-sans">
      
      {/* Floating Alert Messages */}
      {notification && (
        <div id="disp-toast-alert" className="fixed top-4 right-4 bg-bg-elev border-l-4 border-lime text-cream p-3 text-xs rounded shadow-2xl z-50 flex items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-lime shrink-0" />
            <span className="font-medium">{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-stone hover:text-cream">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* MANUAL COMPLIANCE DISPUTE FILE INPUT ENTRY MODAL */}
      {showAddDisputeModal && (
        <div id="modal-create-dispute" className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-bg-elev border border-rule rounded-md w-full max-w-md p-6 relative shadow-2xl">
            <button onClick={() => setShowAddDisputeModal(false)} className="absolute top-4 right-4 text-stone hover:text-cream">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-lime mb-3">
              <Scale className="w-4 h-4 text-lime" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-cream">Initiate Admin Dispute File</h3>
            </div>
            <p className="text-[11px] text-stone mb-4">Allows quick ledger-locking and manual escrow intervention bounds across designated trade profiles.</p>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] text-stone uppercase tracking-wide block mb-1">Buyer (Recipient)</label>
                  <Input 
                    id="add-disp-buyer"
                    value={frmBuyer} 
                    onChange={e => setFrmBuyer(e.target.value)} 
                    className="bg-bg-base text-xs text-cream h-9" 
                  />
                </div>
                <div>
                  <label className="text-[9px] text-stone uppercase tracking-wide block mb-1">Seller (Depositor)</label>
                  <Input 
                    id="add-disp-seller"
                    value={frmSeller} 
                    onChange={e => setFrmSeller(e.target.value)} 
                    className="bg-bg-base text-xs text-cream h-9" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[9px] text-stone uppercase tracking-wide block mb-1">Coin Asset</label>
                  <select 
                    id="add-disp-asset"
                    value={frmAsset} 
                    onChange={e => setFrmAsset(e.target.value)}
                    className="w-full bg-bg-base border border-rule rounded px-2.5 py-1.5 text-xs text-cream h-9 outline-none focus:border-rule"
                  >
                    <option value="USDT">USDT</option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    <option value="NGN">NGN</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-stone uppercase tracking-wide block mb-1">Crypto Sum</label>
                  <Input 
                    id="add-disp-amount"
                    value={frmAmount} 
                    onChange={e => setFrmAmount(e.target.value)} 
                    className="bg-bg-base text-xs text-cream h-9" 
                  />
                </div>
                <div>
                  <label className="text-[9px] text-stone uppercase tracking-wide block mb-1">Priority Target</label>
                  <select 
                    id="add-disp-priority"
                    value={frmPriority} 
                    onChange={e => setFrmPriority(e.target.value)}
                    className="w-full bg-bg-base border border-rule rounded px-2.5 py-1.5 text-xs text-cream h-9 outline-none"
                  >
                    <option value="P1">P1 (Emergency)</option>
                    <option value="P2">P2 (Medium)</option>
                    <option value="P3">P3 (Routine)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[9px] text-stone uppercase tracking-wide block mb-1">Trade Fiat Escrow Value</label>
                <Input 
                  id="add-disp-value"
                  value={frmValue} 
                  onChange={e => setFrmValue(e.target.value)} 
                  className="bg-bg-base text-xs text-cream h-9 font-mono" 
                />
              </div>

              <div>
                <label className="text-[9px] text-stone uppercase tracking-wide block mb-1">Primary Dispute Reason</label>
                <textarea 
                  id="add-disp-reason"
                  value={frmReason} 
                  onChange={e => setFrmReason(e.target.value)} 
                  className="w-full bg-bg-base border border-rule rounded p-3 text-xs text-cream outline-none h-16 resize-none" 
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="ghost" size="sm" onClick={() => setShowAddDisputeModal(false)} className="text-xs">Cancel</Button>
              <Button id="btn-submit-dispute-create" size="sm" onClick={handleCreateDispute} className="bg-lime text-bg-base hover:bg-lime/95 font-bold text-xs">
                Open Dispute Ticket
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* PAGE HEADER ROW */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0">
        <div>
           <h1 className="text-xl font-display font-medium text-cream tracking-tight">Escrow Dispute Logs</h1>
           <p className="text-stone text-xs mt-1">Audit active peer-to-peer transaction blockades, verify evidence deposits, and rule resolutions.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
           <Button id="btn-add-dispute-trigger" size="sm" onClick={() => setShowAddDisputeModal(true)} className="bg-lime text-bg-base hover:bg-lime/90 font-bold text-xs gap-1.5 h-9 shrink-0">
             <Plus className="w-3.5 h-3.5" /> File New Dispute
           </Button>

           <Button id="btn-export-disputes" variant="outline" size="sm" onClick={() => handleExportCSV([])} className="gap-2 h-9 border-rule text-stone hover:text-cream hover:bg-bg-paper text-xs shrink-0">
             <Download className="w-3.5 h-3.5" /> Export Report CSV
           </Button>
        </div>
      </div>

      <Card className="bg-bg-elev border-rule flex flex-col min-h-0 flex-1 relative overflow-hidden">
        {/* Top Segment Workspace Filter Tabs */}
        <div className="flex overflow-x-auto border-b border-rule hide-scrollbar shrink-0 px-2 pt-2 bg-bg-paper">
             {["All", "Open", "Assigned to me", "Resolved"].map(tab => (
               <button
                 id={`tab-btn-${tab.toLowerCase().replace(/\s/g, '-')}`}
                 key={tab}
                 onClick={() => {
                   setActiveTab(tab)
                   setSelectedDisputeIds([])
                 }}
                 className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-lime text-lime' : 'border-transparent text-stone hover:text-cream'}`}
               >
                 {tab}
               </button>
             ))}
        </div>

        {/* Dynamic Interactive Multi-Option Filter Controllers */}
        <div className="p-4 border-b border-rule flex items-center justify-between gap-4 flex-wrap shrink-0 bg-bg-elev z-20">
          <div className="flex flex-1 items-center gap-2 min-w-[325px] flex-wrap">
             
             {/* 1. Priority filter dropdown */}
             <div className="relative">
                <Button 
                  id="flt-priority-trigger"
                  variant="secondary" 
                  size="sm" 
                  className={`h-8 text-xs gap-1.5 bg-bg-base border ${priorityFilter !== 'All' ? 'border-lime text-lime font-bold' : 'border-rule text-stone hover:text-cream'}`}
                  onClick={() => {
                    setShowPriorityMenu(!showPriorityMenu)
                    setShowAssetMenu(false)
                    setShowAssigneeMenu(false)
                  }}
                >
                  <BadgeAlert className="w-3 h-3 text-stone" />
                  Priority: <span className="text-cream">{priorityFilter}</span>
                </Button>
                {showPriorityMenu && (
                  <div className="absolute top-9 left-0 bg-bg-paper border border-rule rounded shadow-2xl z-30 w-36 p-1.5 space-y-1">
                    {["All", "P1", "P2", "P3"].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => {
                          setPriorityFilter(opt)
                          setShowPriorityMenu(false)
                        }}
                        className={`w-full text-left px-2 py-1.5 text-xs rounded transition-colors ${priorityFilter === opt ? 'bg-lime/15 text-lime font-bold' : 'text-stone hover:bg-bg-base hover:text-cream'}`}
                      >
                        {opt === "All" ? "Any Priority" : opt}
                      </button>
                    ))}
                  </div>
                )}
             </div>

             {/* 2. Asset type filter dropdown */}
             <div className="relative">
                <Button 
                  id="flt-asset-trigger"
                  variant="secondary" 
                  size="sm" 
                  className={`h-8 text-xs gap-1.5 bg-bg-base border ${assetFilter !== 'All' ? 'border-lime text-lime font-bold' : 'border-rule text-stone hover:text-cream'}`}
                  onClick={() => {
                    setShowAssetMenu(!showAssetMenu)
                    setShowPriorityMenu(false)
                    setShowAssigneeMenu(false)
                  }}
                >
                  <Scale className="w-3 h-3" />
                  Asset: <span className="text-cream">{assetFilter}</span>
                </Button>
                {showAssetMenu && (
                  <div className="absolute top-9 left-0 bg-bg-paper border border-rule rounded shadow-2xl z-30 w-36 p-1.5 space-y-1 font-mono">
                    {["All", "USDT", "BTC", "ETH", "NGN"].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => {
                          setAssetFilter(opt)
                          setShowAssetMenu(false)
                        }}
                        className={`w-full text-left px-2.5 py-1.5 text-xs rounded transition-colors ${assetFilter === opt ? 'bg-lime/15 text-lime font-bold' : 'text-stone hover:bg-bg-base hover:text-cream'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
             </div>

             {/* 3. Assignee filter selection dropdown */}
             <div className="relative">
                <Button 
                  id="flt-assignee-trigger"
                  variant="secondary" 
                  size="sm" 
                  className={`h-8 text-xs gap-1.5 bg-bg-base border ${assigneeFilter !== 'All' ? 'border-lime text-lime font-bold' : 'border-rule text-stone hover:text-cream'}`}
                  onClick={() => {
                    setShowAssigneeMenu(!showAssigneeMenu)
                    setShowPriorityMenu(false)
                    setShowAssetMenu(false)
                  }}
                >
                  <UserCheck className="w-3 h-3 text-stone" />
                  Assigned Queue: <span className="text-cream">{assigneeFilter === "Me" ? "Assigned: Me" : assigneeFilter === "Unassigned" ? "Unassigned Tickets" : assigneeFilter}</span>
                </Button>
                {showAssigneeMenu && (
                  <div className="absolute top-9 left-0 bg-bg-paper border border-rule rounded shadow-2xl z-30 w-44 p-1.5 space-y-1">
                    {[
                      { val: "All", label: "Any Assignment" },
                      { val: "Unassigned", label: "Unassigned Only" },
                      { val: "Me", label: "My Current Desk" },
                      { val: "Others", label: "Other Operators" }
                    ].map(opt => (
                      <button 
                        key={opt.val}
                        onClick={() => {
                          setAssigneeFilter(opt.val)
                          setShowAssigneeMenu(false)
                        }}
                        className={`w-full text-left px-2.5 py-1.5 text-xs rounded transition-colors ${assigneeFilter === opt.val ? 'bg-lime/15 text-lime font-bold' : 'text-stone hover:bg-bg-base hover:text-cream'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
             </div>

             {/* 4. Reset Filters controller */}
             {(searchQuery || priorityFilter !== "All" || assetFilter !== "All" || assigneeFilter !== "All") && (
                <Button id="btn-flt-clear-all" variant="ghost" size="sm" onClick={handleResetFilters} className="text-[10px] text-lime hover:underline h-8">
                   Reset Filters
                </Button>
             )}
          </div>

          {/* Search container */}
          <div className="relative w-full sm:w-64 max-w-sm shrink-0">
             <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
             <Input 
               id="tx-search-input"
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
               className="pl-9 bg-bg-base text-xs text-cream h-9 border-rule" 
               placeholder="Search dispute #, buyer, seller, reason..." 
             />
             {searchQuery && (
               <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone hover:text-cream">
                 <X className="w-3 h-3" />
               </button>
             )}
          </div>
        </div>

        {/* Dynamic Selection Bulk Workspace Ribbon */}
        {selectedDisputeIds.length > 0 && (
          <div id="bulk-dispute-panel" className="bg-bg-base p-3 px-4 border-b border-rule flex items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-150 relative z-10 shrink-0">
             <div className="flex items-center gap-2 text-[11px]">
                <Scale className="w-3.5 h-3.5 text-lime animate-pulse" />
                <span className="font-semibold text-lime"><span className="text-cream font-bold">{selectedDisputeIds.length}</span> active selections queued</span>
             </div>
             <div className="flex items-center gap-2">
                <Button id="btn-bulk-resolve-action" onClick={handleBulkResolve} size="sm" variant="outline" className="h-7 text-[10px] border-rule/35 text-cream hover:bg-bg-paper">
                   Resolve Selected
                </Button>
                <Button id="btn-bulk-assign-action" onClick={handleBulkAssignToMe} size="sm" variant="outline" className="h-7 text-[10px] border-lime/20 text-lime hover:bg-lime/10">
                   Assign Selected to Me
                </Button>
                <Button id="btn-bulk-escalate-action" onClick={handleBulkEscalate} size="sm" className="h-7 text-[10px] bg-bad text-cream hover:bg-bad/90 font-bold">
                   Bulk Escalate to P1
                </Button>
                <button onClick={() => setSelectedDisputeIds([])} className="text-stone hover:text-cream text-xs ml-2">
                   Clear Selection
                </button>
             </div>
          </div>
        )}

        {/* Back-Office Interactive Table */}
        <div className="flex-1 overflow-y-auto select-none min-h-0">
          <Table>
            <TableHeader className="bg-bg-paper/40 font-display select-none sticky top-0 z-10 border-b border-rule">
              <TableRow className="hover:bg-transparent border-rule select-none">
                <TableHead className="w-10 text-center">
                  <input 
                    type="checkbox" 
                    id="checkbox-select-all-header"
                    onChange={handleHeaderCheckbox}
                    checked={filteredDisputes.length > 0 && filteredDisputes.every(d => selectedDisputeIds.includes(d.id))}
                    className="rounded-sm bg-bg-paper border-rule accent-lime w-3.5 h-3.5 cursor-pointer" 
                  />
                </TableHead>
                <TableHead className="w-6"></TableHead>
                <TableHead className="text-[10px] uppercase font-semibold text-stone font-display">Dispute ID</TableHead>
                <TableHead className="text-[10px] uppercase font-semibold text-stone font-display">Age</TableHead>
                <TableHead className="text-[10px] uppercase font-semibold text-stone font-display text-right">Escrow Locked Value</TableHead>
                <TableHead className="text-[10px] uppercase font-semibold text-stone font-display">Buyer (Beneficiary)</TableHead>
                <TableHead className="text-[10px] uppercase font-semibold text-stone font-display">Seller (Depositor)</TableHead>
                <TableHead className="text-[10px] uppercase font-semibold text-stone font-display">Dispute Reason</TableHead>
                <TableHead className="text-[10px] uppercase font-semibold text-stone font-display">Assignee Auditor</TableHead>
                <TableHead className="text-[10px] uppercase font-semibold text-stone font-display">Status</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDisputes.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={11} className="py-20 text-center text-stone">
                     <div className="flex flex-col items-center justify-center gap-2">
                        <Clock className="w-8 h-8 text-stone/40" />
                        <span className="text-cream text-sm font-medium">No disputes match your filters</span>
                        <span className="text-xs">Adjust filters or keyword query inputs to broaden search bounds.</span>
                     </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDisputes.map(row => (
                  <TableRow 
                    key={row.id}
                    className={`cursor-pointer transition-colors border-b border-rule hover:bg-bg-paper/40 ${selectedDisputeIds.includes(row.id) ? 'bg-lime/5' : ''}`}
                    onClick={() => navigate(`/admin/disputes/${row.id}`)}
                  >
                    {/* Action select checkbox trigger */}
                    <TableCell className="w-10 text-center" onClick={e => handleSelectRow(row.id, e)}>
                      <input 
                        type="checkbox" 
                        id={`row-chk-${row.id}`}
                        checked={selectedDisputeIds.includes(row.id)}
                        onChange={() => {}} // Controlled by cell click container
                        className="rounded-sm bg-bg-paper border-rule accent-lime w-3.5 h-3.5 cursor-pointer" 
                      />
                    </TableCell>

                    <TableCell>
                      <div className={`w-2 h-2 rounded-full ${row.priority === 'P1' ? 'bg-bad' : row.priority === 'P2' ? 'bg-warn' : 'bg-stone'}`}></div>
                    </TableCell>

                    <TableCell className="font-mono text-xs font-semibold text-lime">{row.id}</TableCell>

                    <TableCell>
                      <span className={`text-xs ${row.priority === "P1" ? "text-bad font-medium" : "text-stone"}`}>
                         {row.age}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="text-xs font-mono font-bold text-cream">{row.tradeValue}</div>
                      <div className="text-[10px] text-stone font-mono select-none">{row.amountCoins}</div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-sm border border-rule bg-bg-paper flex items-center justify-center text-[9px] font-bold text-stone">
                           {row.buyer.initials}
                         </div>
                         <div className="flex flex-col">
                            <span className="text-xs font-semibold text-cream leading-tight">{row.buyer.name}</span>
                            <span className="text-[9px] text-stone font-mono leading-none">{row.buyer.trades} trades • {row.buyer.disputeRate} disp</span>
                         </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-sm border border-rule bg-bg-paper flex items-center justify-center text-[9px] font-bold text-stone">
                           {row.seller.initials}
                         </div>
                         <div className="flex flex-col">
                            <span className="text-xs font-semibold text-cream leading-tight">{row.seller.name}</span>
                            <span className="text-[9px] text-stone font-mono leading-none">{row.seller.trades} trades • {row.seller.disputeRate} disp</span>
                         </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-cream/90 truncate max-w-[130px]" title={row.reason}>
                      {row.reason}
                    </TableCell>

                    <TableCell>
                      {row.assignee === "Unassigned" ? (
                        <div className="flex items-center gap-1">
                          <Button 
                            id={`btn-assign-self-${row.id}`}
                            size="sm" 
                            variant="outline" 
                            className="h-6 text-[10px] text-lime border-lime/25 hover:bg-lime/10 px-2.5"
                            onClick={(e) => handleAssignToMe(row.id, e)}
                          >
                            Assign to me
                          </Button>
                        </div>
                      ) : (
                        <span className={`text-[11px] px-2 py-0.5 rounded border ${row.assignee === CURRENT_OFFICER ? "border-lime/30 text-lime bg-lime/5" : "border-rule text-stone bg-bg-paper"} inline-block`}>
                          {row.assignee}
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {row.status === "Resolved" ? (
                          <Badge variant="success" className="text-[9px] uppercase font-mono">Resolved</Badge>
                        ) : row.status === "In Progress" ? (
                          <Badge variant="warning" className="text-[9px] uppercase font-mono">Active Investigation</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[9px] uppercase font-mono">Unassigned Open</Badge>
                        )}
                        {row.escalated && (
                          <span className="text-[10px] text-bad font-semibold font-mono bg-bad/10 px-1 py-0.5 border border-bad/20 rounded-sm">ESCALATED</span>
                        )}
                      </div>
                    </TableCell>

                    {/* Navigation Trigger Arrow Column */}
                    <TableCell onClick={e => e.stopPropagation()} className="w-10">
                      <Button id={`btn-nav-detail-${row.id}`} variant="ghost" size="icon" className="h-6 w-6 text-stone hover:text-cream" onClick={() => navigate(`/admin/disputes/${row.id}`)}>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>

                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Bottom stats layout summary */}
        <div className="p-4 border-t border-rule bg-bg-paper/40 text-stone text-[11px] flex justify-between items-center sm:flex-row flex-col gap-2 shrink-0 select-none">
           <div className="flex items-center gap-3">
             <span className="font-semibold text-lime">VOLT BACKOFFICE AUDIT SYSTEM</span>
             <span>•</span>
             <span>Showing {filteredDisputes.length} records matching search matrices</span>
           </div>
           <div className="flex gap-1.5">
             <Button 
               id="btn-footer-export-filtered"
               variant="ghost" 
               size="sm" 
               className="h-6 text-[10px]"
               onClick={() => handleExportCSV(filteredDisputes)}
               disabled={filteredDisputes.length === 0}
             >
               Export Filtered List ({filteredDisputes.length})
             </Button>
           </div>
        </div>
      </Card>
    </div>
  )
}
