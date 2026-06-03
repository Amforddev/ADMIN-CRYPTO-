import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ArrowRightLeft, 
  Gift, 
  ShieldAlert, 
  Coins, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  RefreshCw, 
  Check, 
  Send,
  Loader2,
  Trash2,
  AlertCircle
} from "lucide-react"

export default function Transactions() {
  // State collections
  const [activeTab, setActiveTab] = useState("All")
  const [selectedTx, setSelectedTx] = useState<any | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter dropdown state
  const [statusFilter, setStatusFilter] = useState("All")
  const [assetFilter, setAssetFilter] = useState("All")
  const [amountFilter, setAmountFilter] = useState("All")
  const [dateFilter, setDateFilter] = useState("All")

  // Popover visual toggles
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [showAssetMenu, setShowAssetMenu] = useState(false)
  const [showAmountMenu, setShowAmountMenu] = useState(false)
  const [showDateMenu, setShowDateMenu] = useState(false)

  // Floating notifications
  const [notification, setNotification] = useState<string | null>(null)

  // Interactive action modals
  const [showFlagModal, setShowFlagModal] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [showDeclineModal, setShowDeclineModal] = useState(false)
  const [showDisputeModal, setShowDisputeModal] = useState(false)
  const [showRetryModal, setShowRetryModal] = useState(false)
  const [showAddTxModal, setShowAddTxModal] = useState(false)

  // Input bindings
  const [flagReason, setFlagReason] = useState("Unexplained rapid exchange activity.")
  const [declineReason, setDeclineReason] = useState("Inconclusive KYC details matched with source blockchain account.")
  const [disputeWinner, setDisputeWinner] = useState<"buyer" | "seller">("buyer")
  const [disputeReason, setDisputeReason] = useState("Buyer uploaded watermarked bank receipts confirming payment release.")
  const [newNoteText, setNewNoteText] = useState("")

  // Selected row arrays for bulk processes
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])

  // Manual transaction form state
  const [frmType, setFrmType] = useState("deposit")
  const [frmUser, setFrmUser] = useState("Adaeze Okonkwo")
  const [frmAsset, setFrmAsset] = useState("NGN")
  const [frmAmount, setFrmAmount] = useState("120,000")
  const [frmProvider, setFrmProvider] = useState("Paystack")
  const [frmMethod, setFrmMethod] = useState("WEMA Bank Transfer")
  const [frmAddress, setFrmAddress] = useState("")

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Unified persistent database loaded from local storage
  const [txs, setTxs] = useState<any[]>(() => {
    const saved = localStorage.getItem("volt-transactions-list")
    if (saved) return JSON.parse(saved)
    
    const initialList = [
      { 
        id: "tx_9f82kd", 
        type: "deposit", 
        timestamp: "2023-11-20T14:32:00Z", 
        ref: "pay_xyz123", 
        user: "Adaeze Okonkwo", 
        asset: "NGN", 
        amount: "50,000", 
        ngnValue: "50,000", 
        status: "completed", 
        provider: "Paystack", 
        method: "Bank Transfer", 
        notes: [], 
        auditTrail: [
          { time: "14:32:00", log: "Funds settled in wallet via Paystack gateway API." },
          { time: "14:31:12", log: "Transaction initiated. Awaiting bank settlement hook." }
        ] 
      },
      { 
        id: "tx_k29dm1", 
        type: "withdrawal", 
        timestamp: "2023-11-20T14:15:22Z", 
        ref: "wd_992kx", 
        user: "Ibrahim Musa", 
        asset: "BTC", 
        amount: "0.025", 
        ngnValue: "1,450,000", 
        status: "pending", 
        provider: "Fireblocks", 
        address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", 
        notes: [], 
        auditTrail: [
          { time: "14:15:22", log: "Queued for custody multi-sig approval (Fireblocks hotwallet)." },
          { time: "14:15:10", log: "Withdrawal request authorized by user OTP verification." }
        ] 
      },
      { 
        id: "tx_p38xm1", 
        type: "buy", 
        timestamp: "2023-11-20T13:45:10Z", 
        ref: "trd_882md", 
        user: "Chibueze Eze", 
        asset: "USDT", 
        amount: "150", 
        ngnValue: "172,500", 
        status: "completed", 
        provider: "Internal", 
        rate: "1,150", 
        spread: "1.2%", 
        notes: [], 
        auditTrail: [
          { time: "13:45:10", log: "Order matched and completed internally." },
          { time: "13:44:50", log: "Secure buying quote locked at 1,150 NGN/USDT." }
        ] 
      },
      { 
        id: "tx_x72jd8", 
        type: "sell", 
        timestamp: "2023-11-20T12:30:00Z", 
        ref: "trd_291kd", 
        user: "Funke Adebayo", 
        asset: "ETH", 
        amount: "0.5", 
        ngnValue: "980,000", 
        status: "failed", 
        provider: "Internal", 
        rate: "1,960,000", 
        spread: "1.0%", 
        notes: [], 
        auditTrail: [
          { time: "12:30:00", log: "Trade execution failed due to provider core connection failure." }
        ] 
      },
      { 
        id: "tx_m92kd4", 
        type: "p2p", 
        timestamp: "2023-11-20T11:20:45Z", 
        ref: "p2p_44md2", 
        user: "Ngozi Anosike", 
        asset: "USDT", 
        amount: "500", 
        ngnValue: "575,000", 
        status: "disputed", 
        provider: "P2P", 
        counterparty: "Sunday Amford", 
        notes: [], 
        auditTrail: [
          { time: "11:20:45", log: "Buyer Ngozi Anosike uploaded proof of transfer & raised escrow dispute." },
          { time: "11:20:00", log: "Payment marked as sent. Crypto custody assets locked." },
          { time: "11:18:20", log: "P2P merchant order matching completed." }
        ] 
      },
      { 
        id: "tx_q82nd1", 
        type: "giftcard", 
        timestamp: "2023-11-20T10:15:00Z", 
        ref: "gc_992md", 
        user: "Adaeze Okonkwo", 
        asset: "USD", 
        amount: "100", 
        ngnValue: "95,000", 
        status: "completed", 
        provider: "Internal", 
        brand: "Amazon", 
        notes: [], 
        auditTrail: [
          { time: "10:15:00", log: "System verification accepted Amazon Giftcard code." }
        ] 
      },
      { 
        id: "tx_v82nd8", 
        type: "swap", 
        timestamp: "2023-11-20T09:10:00Z", 
        ref: "swp_88m2k", 
        user: "Ibrahim Musa", 
        asset: "USDT", 
        amount: "200", 
        ngnValue: "230,000", 
        status: "completed", 
        provider: "Internal", 
        notes: [], 
        auditTrail: [
          { time: "09:10:00", log: "Token swap finalized. 200 USDT debited and equivalent credited." }
        ] 
      }
    ]
    localStorage.setItem("volt-transactions-list", JSON.stringify(initialList))
    return initialList
  })

  // Synchronize state with storage
  useEffect(() => {
    localStorage.setItem("volt-transactions-list", JSON.stringify(txs))
  }, [txs])

  // Clear toast notifications layout auto Timer
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const tabs = ["All", "Deposits", "Withdrawals", "Buys", "Sells", "Swaps", "P2P", "Gift Cards", "Internal", "Fees"]

  // Icons mapper matching types
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft className="w-4 h-4 text-good" />
      case 'withdrawal': return <ArrowUpRight className="w-4 h-4 text-bad" />
      case 'buy': return <ArrowDownLeft className="w-4 h-4 text-good" />
      case 'sell': return <ArrowUpRight className="w-4 h-4 text-bad" />
      case 'swap': return <ArrowRightLeft className="w-4 h-4 text-info" />
      case 'p2p': return <ArrowRightLeft className="w-4 h-4 text-stone" />
      case 'giftcard': return <Gift className="w-4 h-4 text-warn" />
      default: return <Coins className="w-4 h-4 text-stone" />
    }
  }

  // Badges matching statuses
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge variant="success" className="text-[10px] uppercase font-mono">Completed</Badge>
      case 'pending': return <Badge variant="warning" className="text-[10px] uppercase font-mono">Pending</Badge>
      case 'failed': return <Badge variant="destructive" className="text-[10px] uppercase font-mono">Failed</Badge>
      case 'disputed': return <Badge className="bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] uppercase font-mono">Disputed</Badge>
      case 'compromised': return <Badge className="bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[10px] uppercase font-mono flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> Compromised</Badge>
      default: return <Badge variant="secondary" className="text-[10px] uppercase font-mono">{status}</Badge>
    }
  }

  // Master Memoized Filter Application
  const filteredTxs = useMemo(() => {
    return txs.filter(tx => {
      // 1. Tab filters
      if (activeTab !== "All") {
        const t = activeTab.toLowerCase()
        if (t === "deposits" && tx.type !== "deposit") return false
        if (t === "withdrawals" && tx.type !== "withdrawal") return false
        if (t === "buys" && tx.type !== "buy") return false
        if (t === "sells" && tx.type !== "sell") return false
        if (t === "swaps" && tx.type !== "swap") return false
        if (t === "p2p" && tx.type !== "p2p") return false
        if (t === "gift cards" && tx.type !== "giftcard") return false
        if (t === "internal" && tx.provider !== "Internal") return false
        if (t === "fees") {
          // Display items having an operational spread percentage
          if (!tx.spread) return false
        }
      }

      // 2. Dropdown: Status filter
      if (statusFilter !== "All" && tx.status !== statusFilter) return false

      // 3. Dropdown: Asset filter
      if (assetFilter !== "All" && tx.asset !== assetFilter) return false

      // 4. Dropdown: Amount Range filter
      if (amountFilter !== "All") {
        const val = parseFloat(tx.ngnValue.replace(/,/g, "")) || 0
        if (amountFilter === "Under 100k" && val >= 100000) return false
        if (amountFilter === "100k-500k" && (val < 100000 || val > 500000)) return false
        if (amountFilter === "Over 500k" && val <= 500000) return false
      }

      // 5. Dropdown: Date Range window
      if (dateFilter !== "All") {
        const txMs = new Date(tx.timestamp).getTime()
        const now = Date.now()
        const dayMs = 24 * 60 * 60 * 1000
        if (dateFilter === "24h" && (now - txMs > dayMs)) return false
        if (dateFilter === "7days" && (now - txMs > dayMs * 7)) return false
        if (dateFilter === "30days" && (now - txMs > dayMs * 30)) return false
      }

      // 6. Text keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchRef = tx.ref.toLowerCase().includes(q)
        const matchUser = tx.user.toLowerCase().includes(q)
        const matchId = tx.id.toLowerCase().includes(q)
        const matchProvider = tx.provider.toLowerCase().includes(q)
        const matchAsset = tx.asset.toLowerCase().includes(q)
        const matchCounter = tx.counterparty?.toLowerCase().includes(q) || false
        
        if (!matchRef && !matchUser && !matchId && !matchProvider && !matchAsset && !matchCounter) {
          return false
        }
      }

      return true
    })
  }, [txs, activeTab, statusFilter, assetFilter, amountFilter, dateFilter, searchQuery])

  // Calculation for dynamic stats
  const pageCount = Math.ceil(filteredTxs.length / itemsPerPage) || 1
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredTxs.slice(start, start + itemsPerPage)
  }, [filteredTxs, currentPage])

  // Reset page of filter adjustments
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, statusFilter, assetFilter, amountFilter, dateFilter, searchQuery])

  // Utility to fire notification alerts
  const showToast = (message: string) => {
    setNotification(message)
  }

  // Robust CSV Exporter
  const executeCSVAllocation = (subset: any[]) => {
    const list = subset.length > 0 ? subset : filteredTxs
    if (list.length === 0) {
      showToast("Underlying list is empty. No CSV compiled.")
      return
    }

    const headers = "ID,Timestamp,Type,Ref,User,Asset,Amount,NGN_Value,Status,Provider,Method_Address\n"
    const contents = list.map(t => {
      const extra = t.address || t.method || t.brand || ""
      return `"${t.id}","${t.timestamp}","${t.type}","${t.ref}","${t.user}","${t.asset}","${t.amount}","${t.ngnValue}","${t.status}","${t.provider}","${extra}"`
    }).join("\n")

    const blob = new Blob([headers + contents], { type: "text/csv" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `volt_trans_report_${Date.now()}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
    showToast(`Compiled report of ${list.length} rows exported successfully.`)
  }

  // Active updates & actions handler
  const handleConfirmFlag = () => {
    if (!selectedTx) return
    const nextList = txs.map(t => {
      if (t.id === selectedTx.id) {
        const updatedAudit = [
          { time: new Date().toLocaleTimeString(), log: `Flagged as COMPROMISED: ${flagReason}` },
          ...(t.auditTrail || [])
        ]
        return {
          ...t,
          status: "compromised",
          notes: [...(t.notes || []), { author: "Sunday O. (Self)", text: `[COMPROMISED COMPLIANCE LOCK] ${flagReason}`, time: "Just now" }],
          auditTrail: updatedAudit
        }
      }
      return t
    })

    setTxs(nextList)
    const activeObj = nextList.find(x => x.id === selectedTx.id)
    if (activeObj) setSelectedTx(activeObj)
    setShowFlagModal(false)
    showToast(`Eviction compliance block applied to ${selectedTx.id}. Wallet frozen.`)
  }

  const handleConfirmApproval = () => {
    if (!selectedTx) return
    const nextList = txs.map(t => {
      if (t.id === selectedTx.id) {
        const updatedAudit = [
          { time: new Date().toLocaleTimeString(), log: "Pending audit checks cleared. Transfer approved by Agent Sunday O." },
          ...(t.auditTrail || [])
        ]
        return {
          ...t,
          status: "completed",
          auditTrail: updatedAudit
        }
      }
      return t
    })

    setTxs(nextList)
    const activeObj = nextList.find(x => x.id === selectedTx.id)
    if (activeObj) setSelectedTx(activeObj)
    setShowApprovalModal(false)
    showToast(`Withdrawal transfer approved. Broadcasted payout node network hashes.`)
  }

  const handleConfirmDecline = () => {
    if (!selectedTx) return
    const nextList = txs.map(t => {
      if (t.id === selectedTx.id) {
        const updatedAudit = [
          { time: new Date().toLocaleTimeString(), log: `Transfer rejected by compliance administrator. Reason: ${declineReason}` },
          ...(t.auditTrail || [])
        ]
        return {
          ...t,
          status: "failed",
          notes: [...(t.notes || []), { author: "Sunday O. (Self)", text: `[REJECT DETAILS] ${declineReason}`, time: "Just now" }],
          auditTrail: updatedAudit
        }
      }
      return t
    })

    setTxs(nextList)
    const activeObj = nextList.find(x => x.id === selectedTx.id)
    if (activeObj) setSelectedTx(activeObj)
    setShowDeclineModal(false)
    showToast(`Transfer declined. Funds returned safely to customer ledger.`)
  }

  const handleConfirmDispute = () => {
    if (!selectedTx) return
    const decisionMessage = disputeWinner === "buyer"
      ? `ruled in favor of Buyer. Released ${selectedTx.amount} ${selectedTx.asset} custody.`
      : `ruled in favor of Seller. Refunded escrowed collateral.`

    const nextList = txs.map(t => {
      if (t.id === selectedTx.id) {
        const updatedAudit = [
          { time: new Date().toLocaleTimeString(), log: `P2P Dispute Resolution: ${decisionMessage}` },
          ...(t.auditTrail || [])
        ]
        return {
          ...t,
          status: "completed",
          notes: [...(t.notes || []), { author: "Sunday O. (Self)", text: `[P2P DISPUTE RESOLVED - WINNER: ${disputeWinner.toUpperCase()}] ${disputeReason}`, time: "Just now" }],
          auditTrail: updatedAudit
        }
      }
      return t
    })

    setTxs(nextList)
    const activeObj = nextList.find(x => x.id === selectedTx.id)
    if (activeObj) setSelectedTx(activeObj)
    setShowDisputeModal(false)
    showToast(`Dispute verified. Collateral settled to P2P ${disputeWinner === "buyer" ? "buyer account" : "merchant seller balance"}.`)
  }

  const handleConfirmRetry = () => {
    if (!selectedTx) return
    const nextList = txs.map(t => {
      if (t.id === selectedTx.id) {
        const updatedAudit = [
          { time: new Date().toLocaleTimeString(), log: "Initiated secondary retry loop. Switched server liquidity router." },
          { time: new Date().toLocaleTimeString(), log: "Confirmation received. External hotwallet transaction complete." },
          ...(t.auditTrail || [])
        ]
        return {
          ...t,
          status: "completed",
          auditTrail: updatedAudit
        }
      }
      return t
    })

    setTxs(nextList)
    const activeObj = nextList.find(x => x.id === selectedTx.id)
    if (activeObj) setSelectedTx(activeObj)
    setShowRetryModal(false)
    showToast("Retry authorization successful. Operational log resolved.")
  }

  const handleAddInvestigatorNote = () => {
    if (!newNoteText.trim() || !selectedTx) return
    const nextList = txs.map(t => {
      if (t.id === selectedTx.id) {
        const updatedNotes = [...(t.notes || []), {
          author: "Sunday O. (Self)",
          text: newNoteText.trim(),
          time: "Just now"
        }]
        const updatedAudit = [
          { time: new Date().toLocaleTimeString(), log: `Officer Sunday O. appended memo: "${newNoteText.substring(0, 30)}..."` },
          ...(t.auditTrail || [])
        ]
        return {
          ...t,
          notes: updatedNotes,
          auditTrail: updatedAudit
        }
      }
      return t
    })

    setTxs(nextList)
    const activeObj = nextList.find(x => x.id === selectedTx.id)
    if (activeObj) setSelectedTx(activeObj)
    setNewNoteText("")
    showToast("Administrative investigator memo logged.")
  }

  const handleCreateManualTx = () => {
    if (!frmUser.trim()) {
      showToast("Please provide user profile name.")
      return
    }

    const valueRaw = parseFloat(frmAmount.replace(/,/g, "")) || 0
    let valueNGN = ""

    if (frmAsset === "NGN") {
      valueNGN = frmAmount
    } else if (frmAsset === "BTC") {
      valueNGN = (valueRaw * 58000000).toLocaleString()
    } else if (frmAsset === "USDT") {
      valueNGN = (valueRaw * 1150).toLocaleString()
    } else if (frmAsset === "ETH") {
      valueNGN = (valueRaw * 2200000).toLocaleString()
    } else {
      valueNGN = (valueRaw * 1450).toLocaleString()
    }

    const newRecord = {
      id: `tx_${Math.random().toString(36).substring(2, 8)}`,
      type: frmType,
      timestamp: new Date().toISOString(),
      ref: `adm_${Math.random().toString(36).substring(2, 7)}`,
      user: frmUser,
      asset: frmAsset,
      amount: frmAmount,
      ngnValue: valueNGN,
      status: "completed",
      provider: frmProvider,
      address: frmAddress || undefined,
      method: frmMethod,
      notes: [{ author: "Sunday O. (Self)", text: `Issued custom manual account ledger entry. Balance update completed.`, time: "Just now" }],
      auditTrail: [
        { time: new Date().toLocaleTimeString(), log: "System verification cleared by Agent Sunday O." },
        { time: new Date().toLocaleTimeString(), log: "Manual entry credit logged into ledger database." }
      ]
    }

    setTxs([newRecord, ...txs])
    setShowAddTxModal(false)
    showToast(`Committed administrative manual ledger record for ${frmUser}.`)
  }

  // Bulk operation actions
  const handleBulkApprove = () => {
    const nextList = txs.map(t => {
      if (selectedRowIds.includes(t.id) && t.status === "pending") {
        return {
          ...t,
          status: "completed",
          auditTrail: [{ time: new Date().toLocaleTimeString(), log: "Approved via back-office bulk action queue." }, ...(t.auditTrail || [])]
        }
      }
      return t
    })
    setTxs(nextList)
    setSelectedRowIds([])
    showToast("Bulk operations completed. Approved selected pending entries.")
  }

  const handleBulkEvict = () => {
    const nextList = txs.map(t => {
      if (selectedRowIds.includes(t.id)) {
        return {
          ...t,
          status: "compromised",
          auditTrail: [{ time: new Date().toLocaleTimeString(), log: "Evicted cross-reference bulk status update." }, ...(t.auditTrail || [])]
        }
      }
      return t
    })
    setTxs(nextList)
    setSelectedRowIds([])
    showToast("Enforced bulk asset freeze on selected items.")
  }

  const clearAllFilters = () => {
    setStatusFilter("All")
    setAssetFilter("All")
    setAmountFilter("All")
    setDateFilter("All")
    setSearchQuery("")
    showToast("Filters successfully cleared.")
  }

  const handleHeaderCheckboxToggle = () => {
    const pageKeys = paginatedList.map(t => t.id)
    const allSelected = pageKeys.every(id => selectedRowIds.includes(id))
    
    if (allSelected) {
      setSelectedRowIds(prev => prev.filter(id => !pageKeys.includes(id)))
    } else {
      setSelectedRowIds(prev => {
        const unique = new Set([...prev, ...pageKeys])
        return Array.from(unique)
      })
    }
  }

  const toggleSelectRow = (id: string) => {
    setSelectedRowIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)] relative font-sans">
      
      {/* Floating Dynamic Notification Alert */}
      {notification && (
        <div id="tx-floating-toast" className="fixed top-4 right-4 bg-bg-elev border-l-4 border-lime text-cream p-3 text-xs rounded shadow-2xl z-50 flex items-center justify-between gap-4 animate-fade-in max-w-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-lime shrink-0 animate-pulse" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-stone hover:text-cream">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* COMPROMISE EVOLUTION FLAG MODAL */}
      {showFlagModal && selectedTx && (
        <div id="modal-flag-comp" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-bg-elev border border-rule rounded-md w-full max-w-md p-6 relative shadow-2xl">
            <button onClick={() => setShowFlagModal(false)} className="absolute top-4 right-4 text-stone hover:text-cream">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-bad mb-3">
              <ShieldAlert className="w-4 h-4 text-bad" />
              <h3 className="text-sm font-semibold uppercase tracking-wide">Flag Transaction as Compromised</h3>
            </div>
            <p className="text-[11px] text-stone mb-4">Entering verification hold limits user withdrawal rights. Security audit team gets an instantaneous alert envelope.</p>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-stone uppercase tracking-wide block mb-1">Reason for Hold Audit</label>
                <textarea
                  id="flag-reason-txt"
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  className="w-full bg-bg-base border border-rule rounded p-3 text-xs text-cream outline-none h-20"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="ghost" size="sm" onClick={() => setShowFlagModal(false)} className="text-xs">Cancel</Button>
              <Button id="btn-submit-flag" size="sm" onClick={handleConfirmFlag} className="bg-bad text-white hover:bg-bad/95 font-bold text-xs">
                Restrict & Block Funds
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* WITHDRAWAL APPROVAL MODAL */}
      {showApprovalModal && selectedTx && (
        <div id="modal-approve-transfer" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-bg-elev border border-rule rounded-md w-full max-w-sm p-6 relative shadow-2xl">
            <button onClick={() => setShowApprovalModal(false)} className="absolute top-4 right-4 text-stone hover:text-cream">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-lime mb-3">
              <CheckCircle2 className="w-4 h-4 text-lime" />
              <h3 className="text-sm font-semibold uppercase tracking-wide">Authorize Outbound Transfer</h3>
            </div>
            <p className="text-[11px] text-stone mb-4">Clearing audit check confirms security OTP. Transaction will move from pending to <span className="text-lime font-bold">Completed</span>.</p>
            <div className="bg-bg-base border border-rule p-3 font-mono text-[10px] text-stone space-y-1 rounded mb-4">
              <div>User Account: <span className="text-cream">{selectedTx.user}</span></div>
              <div>Gross Value: <span className="text-lime">{selectedTx.amount} {selectedTx.asset}</span></div>
              <div>Network Target: <span className="text-cream select-all">{selectedTx.address || "Internal Wallet"}</span></div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowApprovalModal(false)} className="text-xs">Cancel</Button>
              <Button id="btn-submit-approve" size="sm" onClick={handleConfirmApproval} className="bg-lime text-bg-base hover:bg-lime/95 font-bold text-xs">
                Authorize Transfer Settlement
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* WITHDRAWAL DECLINE/REJECT MODAL */}
      {showDeclineModal && selectedTx && (
        <div id="modal-decline-transfer" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-bg-elev border border-rule rounded-md w-full max-w-md p-6 relative shadow-2xl">
            <button onClick={() => setShowDeclineModal(false)} className="absolute top-4 right-4 text-stone hover:text-cream">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-bad mb-3">
              <X className="w-4 h-4 text-bad" />
              <h3 className="text-sm font-semibold uppercase tracking-wide">Decline Outstanding Transfer</h3>
            </div>
            <p className="text-[11px] text-stone mb-4">Rejecting this transfer reverses values. Funds are placed into native user account balance wallets instantly.</p>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-stone uppercase tracking-wide block mb-1">Rejection Reason Code</label>
                <textarea
                  id="decline-reason-txt"
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full bg-bg-base border border-rule rounded p-3 text-xs text-cream outline-none h-20"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="ghost" size="sm" onClick={() => setShowDeclineModal(false)} className="text-xs">Cancel</Button>
              <Button id="btn-submit-decline" size="sm" onClick={handleConfirmDecline} className="bg-bad text-white hover:bg-bad/95 font-bold text-xs">
                Decline & Terminate
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* P2P DISPUTE RESOLUTION MODAL */}
      {showDisputeModal && selectedTx && (
        <div id="modal-p2p-dispute" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-bg-elev border border-rule rounded-md w-full max-w-md p-6 relative shadow-2xl">
            <button onClick={() => setShowDisputeModal(false)} className="absolute top-4 right-4 text-stone hover:text-cream">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-warn mb-3">
              <AlertTriangle className="w-4 h-4 text-warn" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-warn">Resolve Escrow P2P Dispute</h3>
            </div>
            <p className="text-[11px] text-stone mb-4">Ruling on dispute releases cryptocurrency reserves to selected recipient. Verify invoice billing proof before committing.</p>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-stone uppercase tracking-wide block mb-1">Escrow Award Destination</label>
                <select
                  id="dispute-winner-select"
                  value={disputeWinner}
                  onChange={(e: any) => setDisputeWinner(e.target.value)}
                  className="w-full bg-bg-base border border-rule rounded px-3 py-1.5 text-xs text-cream outline-none"
                >
                  <option value="buyer">Release To Buyer ({selectedTx.user})</option>
                  <option value="seller">Release To Seller ({selectedTx.counterparty || "P2P Merchant"})</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-stone uppercase tracking-wide block mb-1">Resolution Investigation Log</label>
                <textarea
                  id="dispute-reason-txt"
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full bg-bg-base border border-rule rounded p-3 text-xs text-cream outline-none h-20"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="ghost" size="sm" onClick={() => setShowDisputeModal(false)} className="text-xs">Cancel</Button>
              <Button id="btn-submit-dispute" size="sm" onClick={handleConfirmDispute} className="bg-lime text-bg-base hover:bg-lime/95 font-bold text-xs">
                Commit Dispute Ruling
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ERROR CORRECTION / RETRY TRANSFER MODAL */}
      {showRetryModal && selectedTx && (
        <div id="modal-retry-transfer" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-bg-elev border border-rule rounded-md w-full max-w-sm p-6 relative shadow-2xl">
            <button onClick={() => setShowRetryModal(false)} className="absolute top-4 right-4 text-stone hover:text-cream">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-lime mb-3">
              <RefreshCw className="w-4 h-4 text-lime" />
              <h3 className="text-sm font-semibold uppercase tracking-wide">Retry Settlement Node</h3>
            </div>
            <p className="text-[11px] text-stone mb-4">Re-pushes block hash to liquidity engines. Checks available reserves first to prevent execution drift.</p>
            <div className="bg-bg-base border border-rule p-3 font-mono text-[10px] text-stone space-y-1 rounded mb-4">
              <div>Ref: <span className="text-cream">{selectedTx.ref}</span></div>
              <div>Net Asset: <span className="text-cream">{selectedTx.amount} {selectedTx.asset}</span></div>
              <div>Engine: <span className="text-lime">{selectedTx.provider} APIs</span></div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowRetryModal(false)} className="text-xs">Cancel</Button>
              <Button id="btn-submit-retry" size="sm" onClick={handleConfirmRetry} className="bg-lime text-bg-base hover:bg-lime/95 font-bold text-xs">
                Initiate Transaction Retry
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CORE ADMINISTRATIVE MANUAL LEDGER ENTRY CREATION MODAL */}
      {showAddTxModal && (
        <div id="modal-add-entry" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-bg-elev border border-rule rounded-md w-full max-w-md p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowAddTxModal(false)} className="absolute top-4 right-4 text-stone hover:text-cream">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-lime mb-3">
              <Plus className="w-4 h-4 text-lime" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-cream">Issue Back-Office Ledger Entry</h3>
            </div>
            <p className="text-[11px] text-stone mb-4">Creates verified deposit, withdrawal, p2p, swap, or adjustment. Syncs balance sheets instantly.</p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-stone uppercase tracking-wide block mb-1">Transaction Type</label>
                  <select
                    id="add-frm-type"
                    value={frmType}
                    onChange={(e) => setFrmType(e.target.value)}
                    className="w-full bg-bg-base border border-rule rounded px-3 py-1.5 text-xs text-cream outline-none"
                  >
                    <option value="deposit">Deposit (Internal/Bank)</option>
                    <option value="withdrawal">Withdrawal (Crypto/Fiat Out)</option>
                    <option value="buy">Buy (Fiat &rarr; Crypto)</option>
                    <option value="sell">Sell (Crypto &rarr; Fiat)</option>
                    <option value="swap">Swap (Pair Conversion)</option>
                    <option value="p2p">P2P (Escrow Ad Lease)</option>
                    <option value="giftcard">Gift Card Validation</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-stone uppercase tracking-wide block mb-1">Target Coin / Asset</label>
                  <select
                    id="add-frm-asset"
                    value={frmAsset}
                    onChange={(e) => setFrmAsset(e.target.value)}
                    className="w-full bg-bg-base border border-rule rounded px-3 py-1.5 text-xs text-cream outline-none"
                  >
                    <option value="NGN">NGN (Nigerian Naira)</option>
                    <option value="BTC">BTC (Bitcoin)</option>
                    <option value="USDT">USDT (Tether ERC20)</option>
                    <option value="ETH">ETH (Ethereum Core)</option>
                    <option value="USD">USD (United States Dollar)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-stone uppercase tracking-wide block mb-1">Client Profile Name</label>
                <Input
                  id="add-frm-user"
                  placeholder="e.g. Adaeze Okonkwo"
                  value={frmUser}
                  onChange={(e) => setFrmUser(e.target.value)}
                  className="bg-bg-base text-xs text-cream h-9"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-stone uppercase tracking-wide block mb-1">Gross Amount (Units)</label>
                  <Input
                    id="add-frm-amount"
                    placeholder="e.g., 50,000"
                    value={frmAmount}
                    onChange={(e) => setFrmAmount(e.target.value)}
                    className="bg-bg-base text-xs text-cream h-9"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone uppercase tracking-wide block mb-1">Settlement Provider</label>
                  <Input
                    id="add-frm-provider"
                    placeholder="e.g. Paystack"
                    value={frmProvider}
                    onChange={(e) => setFrmProvider(e.target.value)}
                    className="bg-bg-base text-xs text-cream h-9"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-stone uppercase tracking-wide block mb-1">Payment Method / Notes</label>
                <Input
                  id="add-frm-method"
                  placeholder="e.g. WEMA Bank Transfer / manual memo"
                  value={frmMethod}
                  onChange={(e) => setFrmMethod(e.target.value)}
                  className="bg-bg-base text-xs text-cream h-9"
                />
              </div>

              <div>
                <label className="text-[10px] text-stone uppercase tracking-wide block mb-1">Blockchain Hash Address (Optional)</label>
                <Input
                  id="add-frm-address"
                  placeholder="0x9af2... or bc1q..."
                  value={frmAddress}
                  onChange={(e) => setFrmAddress(e.target.value)}
                  className="bg-bg-base text-xs text-cream h-9 font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="ghost" size="sm" onClick={() => setShowAddTxModal(false)} className="text-xs">Cancel</Button>
              <Button id="btn-submit-manual-tx" size="sm" onClick={handleCreateManualTx} className="bg-lime text-bg-base hover:bg-lime/95 font-bold text-xs">
                Commit & Issue Credit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TOP HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0">
        <div>
           <h1 className="text-xl font-display font-medium text-cream tracking-tight">Transactions</h1>
           <p className="text-stone text-xs mt-1">Live monitoring, auditing database, and search workspace</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
           <div className="flex items-center gap-2 text-[11px] font-mono border border-rule px-3 py-1.5 rounded-sm bg-bg-paper text-stone">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-lime"></span>
             </span>
             <span className="text-cream font-bold">REAL-TIME: ACTIVE</span>
           </div>
           
           <Tooltip content="Manually register an off-chain deposit, custom bank transfer, or standard administrative adjustment" position="bottom" delay={150}>
             <Button id="btn-add-manual-tx" size="sm" onClick={() => setShowAddTxModal(true)} className="bg-lime text-bg-base hover:bg-lime/90 font-bold text-xs gap-1 h-9 shrink-0">
               <Plus className="w-3.5 h-3.5" /> Issue Ledger Entry
             </Button>
           </Tooltip>

           <Tooltip content="Export the complete, filtered system ledger database to an Excel/CSV file" position="bottom" delay={150}>
             <Button id="btn-master-export" variant="outline" size="sm" onClick={() => executeCSVAllocation([])} className="gap-2 h-9 border-rule text-stone hover:text-cream hover:bg-bg-paper text-xs shrink-0">
               <Download className="w-3.5 h-3.5" /> Export All
             </Button>
           </Tooltip>
        </div>
      </div>

      <Card className="bg-bg-elev border-rule flex flex-col min-h-0 flex-1 relative overflow-hidden">
        {/* Top Tab Bar Navigation */}
        <div className="flex overflow-x-auto border-b border-rule hide-scrollbar shrink-0 px-2 pt-2 bg-bg-paper">
             {tabs.map(tab => (
               <button
                 id={`tab-tx-${tab.toLowerCase().replace(/\s/g, '-')}`}
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-lime text-lime' : 'border-transparent text-stone hover:text-cream'}`}
               >
                 {tab}
               </button>
             ))}
        </div>

        {/* Universal Filter Control Panel */}
        <div className="p-4 border-b border-rule flex items-center justify-between gap-4 flex-wrap shrink-0 bg-bg-elev z-20">
          <div className="flex flex-1 items-center gap-2 min-w-[325px] flex-wrap">
             {/* Filter Check State Buttons */}
             
             {/* 1. Status Dropdown */}
             <div className="relative">
                <Button 
                  id="flt-status-dropdown-trigger"
                  variant="secondary" 
                  size="sm" 
                  className={`h-8 text-xs gap-1.5 bg-bg-base border ${statusFilter !== 'All' ? 'border-lime text-lime' : 'border-rule text-stone hover:text-cream'}`}
                  onClick={() => {
                    setShowStatusMenu(!showStatusMenu)
                    setShowAssetMenu(false)
                    setShowAmountMenu(false)
                    setShowDateMenu(false)
                  }}
                >
                  <Filter className="w-3 h-3" />
                  Status: <span className="font-bold">{statusFilter}</span>
                </Button>
                {showStatusMenu && (
                  <div className="absolute top-9 left-0 bg-bg-paper border border-rule rounded shadow-2xl z-30 w-44 p-1.5 space-y-1">
                    {["All", "completed", "pending", "failed", "disputed", "compromised"].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => {
                          setStatusFilter(opt)
                          setShowStatusMenu(false)
                        }}
                        className={`w-full text-left px-2 py-1.5 text-xs rounded transition-colors uppercase font-mono ${statusFilter === opt ? 'bg-lime/10 text-lime font-bold' : 'text-stone hover:bg-bg-base hover:text-cream'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
             </div>

             {/* 2. Asset Dropdown */}
             <div className="relative">
                <Button 
                  id="flt-asset-dropdown-trigger"
                  variant="secondary" 
                  size="sm" 
                  className={`h-8 text-xs gap-1.5 bg-bg-base border ${assetFilter !== 'All' ? 'border-lime text-lime' : 'border-rule text-stone hover:text-cream'}`}
                  onClick={() => {
                    setShowAssetMenu(!showAssetMenu)
                    setShowStatusMenu(false)
                    setShowAmountMenu(false)
                    setShowDateMenu(false)
                  }}
                >
                  <Coins className="w-3 h-3" />
                  Asset: <span className="font-bold">{assetFilter}</span>
                </Button>
                {showAssetMenu && (
                  <div className="absolute top-9 left-0 bg-bg-paper border border-rule rounded shadow-2xl z-30 w-40 p-1.5 space-y-1">
                    {["All", "NGN", "BTC", "USDT", "ETH", "USD"].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => {
                          setAssetFilter(opt)
                          setShowAssetMenu(false)
                        }}
                        className={`w-full text-left px-2 py-1.5 text-xs rounded transition-colors font-mono ${assetFilter === opt ? 'bg-lime/10 text-lime font-bold' : 'text-stone hover:bg-bg-base hover:text-cream'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
             </div>

             {/* 3. Amount Dropdown */}
             <div className="relative">
                <Button 
                  id="flt-amount-dropdown-trigger"
                  variant="secondary" 
                  size="sm" 
                  className={`h-8 text-xs gap-1.5 bg-bg-base border ${amountFilter !== 'All' ? 'border-lime text-lime' : 'border-rule text-stone hover:text-cream'}`}
                  onClick={() => {
                    setShowAmountMenu(!showAmountMenu)
                    setShowStatusMenu(false)
                    setShowAssetMenu(false)
                    setShowDateMenu(false)
                  }}
                >
                  <ArrowRightLeft className="w-3 h-3" />
                  Value: <span className="font-bold">{amountFilter}</span>
                </Button>
                {showAmountMenu && (
                  <div className="absolute top-9 left-0 bg-bg-paper border border-rule rounded shadow-2xl z-30 w-44 p-1.5 space-y-1">
                    {["All", "Under 100k", "100k-500k", "Over 500k"].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => {
                          setAmountFilter(opt)
                          setShowAmountMenu(false)
                        }}
                        className={`w-full text-left px-2 py-1.5 text-xs rounded transition-colors ${amountFilter === opt ? 'bg-lime/10 text-lime font-bold' : 'text-stone hover:bg-bg-base hover:text-cream'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
             </div>

             {/* 4. Date Filter Dropdown */}
             <div className="relative">
                <Button 
                  id="flt-date-dropdown-trigger"
                  variant="secondary" 
                  size="sm" 
                  className={`h-8 text-xs gap-1.5 bg-bg-base border ${dateFilter !== 'All' ? 'border-lime text-lime' : 'border-rule text-stone hover:text-cream'}`}
                  onClick={() => {
                    setShowDateMenu(!showDateMenu)
                    setShowStatusMenu(false)
                    setShowAssetMenu(false)
                    setShowAmountMenu(false)
                  }}
                >
                  <Clock className="w-3 h-3" />
                  Window: <span className="font-bold">{dateFilter}</span>
                </Button>
                {showDateMenu && (
                  <div className="absolute top-9 left-0 bg-bg-paper border border-rule rounded shadow-2xl z-30 w-40 p-1.5 space-y-1">
                    {[
                      { val: "All", label: "Anytime" },
                      { val: "24h", label: "Last 24 Hours" },
                      { val: "7days", label: "Last 7 Days" },
                      { val: "30days", label: "Last 30 Days" }
                    ].map(opt => (
                      <button 
                        key={opt.val}
                        onClick={() => {
                          setDateFilter(opt.val)
                          setShowDateMenu(false)
                        }}
                        className={`w-full text-left px-2 py-1.5 text-xs rounded transition-colors ${dateFilter === opt.val ? 'bg-lime/10 text-lime font-bold' : 'text-stone hover:bg-bg-base hover:text-cream'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
             </div>

             {/* 5. Clear Filters Button */}
             {(statusFilter !== "All" || assetFilter !== "All" || amountFilter !== "All" || dateFilter !== "All" || searchQuery.trim() !== "") && (
                <Button id="btn-clear-filters" variant="ghost" size="sm" onClick={clearAllFilters} className="h-8 text-[11px] text-lime hover:underline hover:bg-transparent font-medium gap-1">
                   <X className="w-3 h-3" /> Clear filters
                </Button>
             )}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
            <Input 
              id="txt-global-search"
              className="pl-9 bg-bg-paper text-xs text-cream h-9 border border-rule" 
              placeholder="Search reference, customer, txid..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Dynamic Multi-Check Bulk Operation bar if checkboxes clicked */}
        {selectedRowIds.length > 0 && (
          <div id="bulk-operation-rail" className="bg-bg-paper border-b border-rule flex items-center justify-between p-3 shrink-0 text-xs px-6 animate-in slide-in-from-top-4 duration-150">
            <div className="flex items-center gap-2">
               <AlertCircle className="w-4 h-4 text-lime shrink-0" />
               <span className="font-semibold text-lime"><span className="text-cream font-bold">{selectedRowIds.length}</span> items in bulk selection active</span>
            </div>
            <div className="flex items-center gap-2">
               <Button id="btn-bulk-approve" onClick={handleBulkApprove} size="sm" className="h-7 bg-lime text-bg-base hover:bg-lime/90 font-bold text-[10px] uppercase">
                  Bulk Approve Outflow
               </Button>
               <Button id="btn-bulk-suspend" onClick={handleBulkEvict} size="sm" className="h-7 bg-bad text-white hover:bg-bad/90 font-bold text-[10px] uppercase">
                  Bulk Custody Freeze
               </Button>
               <Button id="btn-bulk-export" onClick={() => executeCSVAllocation(txs.filter(t => selectedRowIds.includes(t.id)))} size="sm" variant="outline" className="h-7 text-[10px] border-rule text-stone hover:text-cream">
                  Export Selected ({selectedRowIds.length})
               </Button>
               <Button variant="ghost" size="sm" onClick={() => setSelectedRowIds([])} className="h-7 text-[10px] hover:underline text-stone">
                  Cancel
               </Button>
            </div>
          </div>
        )}

        {/* Dynamic Database Table Frame */}
        <div className="overflow-y-auto flex-1 p-0 relative">
          <Table>
            <TableHeader className="sticky top-0 bg-bg-elev shadow-[0_1px_0_var(--color-rule)] z-10 select-none">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="w-10 text-center">
                  <input 
                    id="checkbox-header"
                    type="checkbox" 
                    className="rounded-sm bg-bg-paper border-rule accent-lime cursor-pointer" 
                    checked={paginatedList.length > 0 && paginatedList.every(t => selectedRowIds.includes(t.id))}
                    onChange={handleHeaderCheckboxToggle}
                  />
                </TableHead>
                <TableHead className="text-stone font-semibold tracking-wider text-[11px] uppercase">Time</TableHead>
                <TableHead className="text-stone font-semibold tracking-wider text-[11px] uppercase">Ref</TableHead>
                <TableHead className="text-stone font-semibold tracking-wider text-[11px] uppercase">User Profile</TableHead>
                <TableHead className="text-stone font-semibold tracking-wider text-[11px] uppercase">Type</TableHead>
                <TableHead className="text-right text-stone font-semibold tracking-wider text-[11px] uppercase">Amount/Asset</TableHead>
                <TableHead className="text-right text-stone font-semibold tracking-wider text-[11px] uppercase">Value (NGN)</TableHead>
                <TableHead className="text-center text-stone font-semibold tracking-wider text-[11px] uppercase">Status</TableHead>
                <TableHead className="text-stone font-semibold tracking-wider text-[11px] uppercase">Provider</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedList.length === 0 ? (
                <TableRow>
                   <TableCell colSpan={10} className="h-32 text-center text-stone text-xs">
                      <div className="flex flex-col items-center justify-center gap-2">
                         <AlertTriangle className="w-6 h-6 text-stone" />
                         <span>No matching ledger records matching selection parameters found.</span>
                         <button onClick={clearAllFilters} className="text-lime hover:underline font-bold mt-1 text-[11px]">Clear active queries</button>
                      </div>
                   </TableCell>
                </TableRow>
              ) : (
                paginatedList.map((tx) => (
                  <TableRow 
                    id={`row-tx-${tx.id}`}
                    key={tx.id} 
                    className={`cursor-pointer transition-colors border-b border-rule hover:bg-bg-paper/40 ${selectedRowIds.includes(tx.id) ? 'bg-lime/5' : ''}`}
                    onClick={() => setSelectedTx(tx)}
                  >
                    <TableCell className="w-10 text-center" onClick={e => e.stopPropagation()}>
                      <input 
                        id={`checkbox-row-${tx.id}`}
                        type="checkbox" 
                        className="rounded-sm bg-bg-paper border-rule accent-lime cursor-pointer" 
                        checked={selectedRowIds.includes(tx.id)}
                        onChange={() => toggleSelectRow(tx.id)}
                      />
                    </TableCell>
                    <TableCell className="text-[11px] text-stone whitespace-nowrap">
                      {new Date(tx.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                    <TableCell className="font-mono text-[11px] text-cream">{tx.ref}</TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-rule flex items-center justify-center text-[8px] font-bold text-stone uppercase select-none">
                            {tx.user.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <span className="text-xs font-semibold text-cream">{tx.user}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-1.5 text-xs capitalize text-cream">
                          {getTypeIcon(tx.type)} <span>{tx.type}</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-cream">
                       {tx.amount} <span className="text-stone text-[10px] uppercase">{tx.asset}</span>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-cream font-medium">
                       ₦{tx.ngnValue}
                    </TableCell>
                    <TableCell className="text-center font-mono">
                       {getStatusBadge(tx.status)}
                    </TableCell>
                    <TableCell className="text-xs text-stone font-mono">
                       {tx.provider}
                    </TableCell>
                    <TableCell onClick={e => e.stopPropagation()}>
                      <Button id={`btn-dropdown-tx-${tx.id}`} variant="ghost" size="icon" className="h-6 w-6 text-stone hover:text-cream hover:bg-bg-base" onClick={() => setSelectedTx(tx)}>
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Dynamic Pagination Footer Control Panel */}
        <div className="p-3 border-t border-rule flex items-center justify-between text-[11px] text-stone shrink-0 bg-bg-paper">
          <span>Showing <span className="text-cream font-bold">{filteredTxs.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-cream font-bold">{Math.min(currentPage * itemsPerPage, filteredTxs.length)}</span> of <span className="text-cream font-bold">{filteredTxs.length}</span> results</span>
          <div className="flex gap-1">
            <Button 
              id="btn-pagination-prev"
              variant="outline" 
              size="sm" 
              className={`h-6 px-3 text-[10px] ${currentPage === 1 ? 'cursor-not-allowed opacity-40' : 'hover:bg-bg-elev text-cream'}`}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </Button>
            <Button 
              id="btn-pagination-next"
              variant="outline" 
              size="sm" 
              className={`h-6 px-3 text-[10px] ${currentPage === pageCount ? 'cursor-not-allowed opacity-40' : 'hover:bg-bg-elev text-cream'}`}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
              disabled={currentPage === pageCount}
            >
              Next
            </Button>
          </div>
        </div>
        
        {/* Slide-in Detail Drawer */}
        {selectedTx && (
           <>
              <div 
                 id="drawer-backdrop"
                 className="absolute inset-0 bg-bg-base/60 backdrop-blur-xs z-30 transition-opacity"
                 onClick={() => setSelectedTx(null)}
              ></div>
              <div id="drawer-transaction-body" className="absolute top-0 right-0 h-full w-[725px] max-w-full bg-bg-paper border-l border-rule shadow-3xl z-40 flex flex-col animate-in slide-in-from-right-8 duration-200">
                 
                 {/* Drawer Header Area */}
                 <div className="p-5 border-b border-rule flex justify-between items-start bg-bg-elev shrink-0">
                    <div>
                       <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded border border-rule bg-bg-base flex items-center justify-center">
                               {getTypeIcon(selectedTx.type)}
                            </div>
                            <h2 className="text-lg font-display capitalize flex items-center gap-2 text-cream font-semibold">
                               {selectedTx.type} Entry Record
                               {getStatusBadge(selectedTx.status)}
                            </h2>
                       </div>
                       <div className="flex flex-wrap gap-4 text-[10px] text-stone font-mono">
                           <span className="select-all text-lime">ID: {selectedTx.id}</span>
                           <span>•</span>
                           <span className="text-stone">Created: {new Date(selectedTx.timestamp).toLocaleString()}</span>
                           <span>•</span>
                           <span className="text-cream bg-bg-base px-2 py-0.5 rounded border border-rule">Ref: {selectedTx.ref}</span>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       {selectedTx.status !== "compromised" && (
                         <Button id="btn-drawer-compromise" variant="outline" size="sm" className="h-8 text-[11px] text-bad border-bad/30 hover:bg-bad/10" onClick={() => setShowFlagModal(true)}>
                           Flag Compromised
                         </Button>
                       )}
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-stone hover:text-cream" onClick={() => setSelectedTx(null)}>
                          <X className="w-4 h-4" />
                       </Button>
                    </div>
                 </div>
                 
                 {/* Drawer Content Dossier Body */}
                 <div className="p-6 overflow-y-auto flex-1 space-y-8">
                    
                    {/* CORE ADMINISTRATIVE CONTROL ACTION BLOCK */}
                    {selectedTx.status === "pending" && (
                      <div className="p-4 rounded-sm border border-orange-500/20 bg-orange-500/5 space-y-3">
                        <div className="flex items-center gap-2 text-warn">
                          <AlertTriangle className="w-4 h-4 text-warn animate-pulse" />
                          <span className="text-xs font-semibold uppercase tracking-wider">Awaiting Back-Office Authorization</span>
                        </div>
                        <p className="text-[11px] text-stone leading-relaxed">This transfer is currently held in our Fireblocks custody buffer. Verify KYC thresholds before release authorization parameters are dispatched.</p>
                        <div className="flex items-center gap-2">
                          <Button id="btn-drawer-approve-pending" size="sm" className="bg-lime text-bg-base hover:bg-lime/95 font-bold text-xs" onClick={() => setShowApprovalModal(true)}>
                            Authorize Outflow Settlement
                          </Button>
                          <Button id="btn-drawer-decline-pending" size="sm" variant="outline" className="border-bad/40 text-bad hover:bg-bad/15 text-xs" onClick={() => setShowDeclineModal(true)}>
                            Decline & Refund Account
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedTx.status === "disputed" && (
                      <div className="p-4 rounded-sm border border-red-500/20 bg-red-500/5 space-y-3">
                        <div className="flex items-center gap-2 text-red-500">
                          <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                          <span className="text-xs font-semibold uppercase tracking-wider">P2P Dispute Escrow Lock</span>
                        </div>
                        <p className="text-[11px] text-stone leading-relaxed">Escrow blocks collateral payout. Inspect verified chat receipts, credit logs, and similarity indicators prior to ruling.</p>
                        <Button id="btn-drawer-resolve-dispute" size="sm" className="bg-lime text-bg-base hover:bg-lime/90 font-bold text-xs" onClick={() => {
                          setDisputeReason("Escrow released directly by Back-Office investigator Sunday O. following verification validation.");
                          setShowDisputeModal(true);
                        }}>
                          Execute Dispute Ruling Manager
                        </Button>
                      </div>
                    )}

                    {selectedTx.status === "failed" && (
                      <div className="p-4 rounded-sm border border-rule bg-bg-base space-y-3">
                        <div className="flex items-center gap-2 text-stone">
                          <X className="w-4 h-4 text-bad" />
                          <span className="text-xs font-semibold uppercase tracking-wider">Settlement Failure Detected</span>
                        </div>
                        <p className="text-[11px] text-stone leading-relaxed">This transaction fell off network channels due to server timeouts. Triggering dynamic retry binds another hotwallet bridge router.</p>
                        <Button id="btn-drawer-retry-failed" size="sm" className="bg-lime text-bg-base hover:bg-lime/90 font-bold text-xs" onClick={() => setShowRetryModal(true)}>
                          Retry Outbound Settlement Node
                        </Button>
                      </div>
                    )}

                    {/* Parties Grid */}
                    <div className="space-y-3">
                       <h3 className="text-[10px] font-semibold text-stone uppercase tracking-wider">Account Parties Matrix</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 border border-rule rounded-sm bg-bg-base">
                             <div className="text-[9px] text-stone font-mono uppercase tracking-wider mb-2">Primary Issuer Client</div>
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-rule flex items-center justify-center text-xs font-bold text-cream select-none">
                                   {selectedTx.user.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                                <div>
                                   <div className="text-xs font-bold text-cream leading-none">{selectedTx.user}</div>
                                   <div className="text-[10px] text-lime mt-1 font-mono">Profile Verified</div>
                                </div>
                             </div>
                          </div>
                          
                          {selectedTx.counterparty && (
                             <div className="p-4 border border-rule rounded-sm bg-bg-base">
                                <div className="text-[9px] text-stone font-mono uppercase tracking-wider mb-2">Merchant Counterparty</div>
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-full bg-rule flex items-center justify-center text-xs font-bold text-cream select-none">
                                      {selectedTx.counterparty.split(' ').map((n: string) => n[0]).join('')}
                                   </div>
                                   <div>
                                      <div className="text-xs font-bold text-cream leading-none">{selectedTx.counterparty}</div>
                                      <div className="text-[10px] text-lime mt-1 font-mono">P2P Trusted Partner</div>
                                   </div>
                                </div>
                             </div>
                          )}

                          {selectedTx.provider && !selectedTx.counterparty && (
                             <div className="p-4 border border-rule rounded-sm bg-bg-base">
                                <div className="text-[9px] text-stone font-mono uppercase tracking-wider mb-2">Settlement Node network</div>
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-sm bg-bg-elev border border-rule flex items-center justify-center">
                                      <Coins className="w-4 h-4 text-lime" />
                                   </div>
                                   <div>
                                      <div className="text-xs font-bold text-cream leading-none">{selectedTx.provider} APIs</div>
                                      <div className="text-[9px] text-stone mt-1 font-mono">{selectedTx.method || "Hotwallet Settlement Cluster"}</div>
                                   </div>
                                </div>
                             </div>
                          )}
                       </div>
                    </div>

                    {/* Amount detailed breakdown table */}
                    <div className="space-y-3">
                       <h3 className="text-[10px] font-semibold text-stone uppercase tracking-wider">Gross Settlement Details</h3>
                       <Card className="bg-bg-base border-rule rounded-sm overflow-hidden text-xs">
                          <Table>
                             <TableBody>
                                <TableRow className="border-rule">
                                   <TableCell className="text-stone py-2.5">Net Units Declared</TableCell>
                                   <TableCell className="text-right font-mono text-cream py-2.5">{selectedTx.amount} <span className="uppercase text-stone">{selectedTx.asset}</span></TableCell>
                                </TableRow>
                                <TableRow className="border-rule">
                                   <TableCell className="text-stone py-2.5">Platform Operational Spread</TableCell>
                                   <TableCell className="text-right font-mono text-cream py-2.5">{selectedTx.spread || "0.00%"}</TableCell>
                                </TableRow>
                                {selectedTx.rate && (
                                   <TableRow className="border-rule">
                                      <TableCell className="text-stone py-2.5">Conversion Execution Rate</TableCell>
                                      <TableCell className="text-right font-mono text-cream py-2.5">₦{selectedTx.rate} / {selectedTx.asset}</TableCell>
                                   </TableRow>
                                )}
                                <TableRow className="border-none bg-lime/5">
                                   <TableCell className="font-semibold text-cream py-3">Naira Balance Impact</TableCell>
                                   <TableCell className="text-right font-mono font-bold text-lime py-3">₦{selectedTx.ngnValue}</TableCell>
                                </TableRow>
                             </TableBody>
                          </Table>
                       </Card>
                    </div>

                    {/* Operational Investigator Memo Ledger */}
                    <div className="space-y-3">
                       <h3 className="text-[10px] font-semibold text-stone uppercase tracking-wider">Investigator Support Notes</h3>
                       <div className="space-y-3">
                          {selectedTx.notes && selectedTx.notes.map((note: any, idx: number) => (
                             <div key={idx} className="bg-bg-base p-3 rounded-sm border border-rule flex flex-col gap-1.5 animate-in fade-in duration-200">
                                <div className="flex items-center justify-between text-[9px] text-stone">
                                   <span className="font-bold text-lime">{note.author}</span>
                                   <span>{note.time}</span>
                                </div>
                                <p className="text-xs text-cream select-text font-sans">{note.text}</p>
                             </div>
                          ))}
                          
                          <div className="space-y-2">
                             <textarea
                                id="drawer-memo-txt"
                                placeholder="Append investigator administrative log memo..."
                                className="w-full bg-bg-base border border-rule rounded p-3 text-xs text-cream outline-none h-16"
                                value={newNoteText}
                                onChange={(e) => setNewNoteText(e.target.value)}
                             />
                             <div className="flex justify-end">
                                <Button id="btn-submit-drawer-memo" size="sm" onClick={handleAddInvestigatorNote} className="h-7 bg-lime text-bg-base font-bold text-[10px] uppercase gap-1.5 hover:bg-lime/90">
                                   <Send className="w-3 h-3" /> Commit Note
                                </Button>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Audit trail sequence logs */}
                    <div className="space-y-3">
                       <h3 className="text-[10px] font-semibold text-stone uppercase tracking-wider">Blockchain Audit Trail Sequence</h3>
                       <div className="border border-rule rounded-sm bg-bg-base p-4 space-y-4">
                          {selectedTx.auditTrail && selectedTx.auditTrail.map((log: any, idx: number) => (
                             <div key={idx} className="relative pl-5 border-l border-rule-strong pb-1 last:pb-0">
                               <span className={`absolute -left-[5px] top-1 w-2 h-2 rounded-full ${idx === 0 ? 'bg-lime shadow-[0_0_8px_var(--color-lime)]' : 'border border-stone bg-bg-base'}`}></span>
                               <div className="flex justify-between items-start gap-4">
                                  <div>
                                     <p className="text-[11px] text-cream font-medium">{log.log}</p>
                                  </div>
                                  <span className="text-[10px] text-stone font-mono whitespace-nowrap shrink-0">{log.time}</span>
                               </div>
                             </div>
                          ))}
                       </div>
                    </div>

                 </div>

                 {/* Drawer Footer Area */}
                 <div className="p-4 border-t border-rule bg-bg-elev shrink-0 flex justify-between items-center text-[10px] select-none">
                    <span className="font-mono text-stone">API protocol target: <span className="text-lime">{selectedTx.provider.toUpperCase()}</span></span>
                    <Button id="btn-drawer-re-export" variant="secondary" size="sm" onClick={() => executeCSVAllocation([selectedTx])} className="h-7 text-[10px] font-bold text-cream hover:bg-bg-paper border border-rule">
                       Export Entry CSV
                    </Button>
                 </div>
              </div>
           </>
        )}

      </Card>
    </div>
  )
}
