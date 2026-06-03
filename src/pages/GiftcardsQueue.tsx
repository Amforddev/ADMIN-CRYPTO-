import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Filter, Search, RotateCcw, Crop, AlertTriangle, Check, X, ShieldAlert, CheckCircle2, AlertCircle, ChevronDown, CheckCircle } from "lucide-react"
import CustomSelect, { DoubleOption } from "@/components/ui/CustomSelect"

const BRAND_OPTIONS: DoubleOption[] = [
  { value: "All", label: "Brand: All" },
  { value: "Amazon", label: "Amazon", color: "#FF9900", bgColor: "rgba(255,153,0,0.15)" },
  { value: "Steam", label: "Steam", color: "#00ADEE", bgColor: "rgba(0,173,238,0.15)" },
  { value: "Apple", label: "Apple", color: "#A3AAAE", bgColor: "rgba(163,170,174,0.15)" },
  { value: "Razer Gold", label: "Razer Gold", color: "#FFC000", bgColor: "rgba(255,192,0,0.15)" },
]

const TYPE_OPTIONS: DoubleOption[] = [
  { value: "All", label: "Type: All" },
  { value: "Digital", label: "Digital", color: "#84cc16", bgColor: "rgba(132,204,22,0.15)" },
  { value: "Physical", label: "Physical", color: "#f59e0b", bgColor: "rgba(245,158,11,0.15)" },
  { value: "iTunes", label: "iTunes", color: "#ec4899", bgColor: "rgba(236,72,153,0.15)" },
]

const VALUE_OPTIONS: DoubleOption[] = [
  { value: "All", label: "Value: All" },
  { value: "under-50", label: "Under $50", color: "#3b82f6", bgColor: "rgba(59,130,246,0.15)" },
  { value: "50-100", label: "$50 - $100", color: "#8b5cf6", bgColor: "rgba(139,92,246,0.15)" },
  { value: "over-100", label: "Over $100", color: "#ec4899", bgColor: "rgba(236,72,153,0.15)" },
]

const COUNTRY_OPTIONS: DoubleOption[] = [
  { value: "All", label: "Country: All" },
  { value: "US", label: "US Reference", color: "#ef4444", bgColor: "rgba(239,68,68,0.15)" },
  { value: "UK", label: "UK Reference", color: "#06b6d4", bgColor: "rgba(6,182,212,0.15)" },
  { value: "Global", label: "Global Ref", color: "#10b981", bgColor: "rgba(16,185,129,0.15)" },
]

const MOCK_QUEUE = [
  { id: "gc_928md", brand: "Amazon", type: "Digital", claimedValue: "$100", amountNgn: "₦95,000", age: "4m 12s", fraudFlags: 0, 
    image: "https://images.unsplash.com/photo-1622322301825-9de83b4c10eb?w=500&h=300&fit=crop&q=80", code: "AQN2-882K-92MD", user: "Adaeze O.", country: "US", userAccountAgeDays: 2 },
  { id: "gc_p92jd", brand: "Steam", type: "Physical", claimedValue: "$50", amountNgn: "₦42,000", age: "6m 30s", fraudFlags: 1, 
    image: "https://images.unsplash.com/photo-1614294149010-950b698f72c0?w=500&h=300&fit=crop&q=80", code: "STM-92K-LL2", user: "Ibrahim M.", country: "US", userAccountAgeDays: 15 },
  { id: "gc_llm2k", brand: "Apple", type: "iTunes", claimedValue: "$200", amountNgn: "₦180,000", age: "12m 45s", fraudFlags: 2, 
    image: "https://images.unsplash.com/photo-1607344645866-009c320c58e0?w=500&h=300&fit=crop&q=80", code: "X92-K2M-992", user: "Chibueze E.", country: "UK", userAccountAgeDays: 1 },
  { id: "gc_89m2k", brand: "Razer Gold", type: "Digital", claimedValue: "$10", amountNgn: "₦8,500", age: "15m 10s", fraudFlags: 0, 
    image: "https://images.unsplash.com/photo-1593306510444-24584284524c?w=500&h=300&fit=crop&q=80", code: "RZ-10-882MD", user: "Uchenna E.", country: "Global", userAccountAgeDays: 45 },
]

export default function GiftcardsQueue() {
  const { id } = useParams()
  const navigate = useNavigate()

  // State management for local queue data
  const [giftcards, setGiftcards] = useState<any[]>(() => {
    const saved = localStorage.getItem("volt-giftcards-queue")
    if (saved) return JSON.parse(saved)
    const initial = MOCK_QUEUE.map(item => ({ ...item, status: "Pending" }))
    localStorage.setItem("volt-giftcards-queue", JSON.stringify(initial))
    return initial
  })

  useEffect(() => {
    localStorage.setItem("volt-giftcards-queue", JSON.stringify(giftcards))
  }, [giftcards])

  // Load dynamic brand options from localStorage
  const brandOptions = React.useMemo(() => {
    try {
      const saved = localStorage.getItem("volt-giftcards-brands")
      if (saved) {
        const parsedBrands = JSON.parse(saved)
        const opts: DoubleOption[] = [
          { value: "All", label: "Brand: All" }
        ]
        parsedBrands.forEach((b: any) => {
          if (opts.some(o => o.value === b.name)) return
          opts.push({
            value: b.name,
            label: b.name,
            color: b.color || "#84cc16",
            bgColor: `${b.color || "#84cc16"}15`
          })
        })
        return opts
      }
    } catch (e) {
      console.error(e)
    }
    return BRAND_OPTIONS
  }, [giftcards])

  // Bulk operation tracking
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([])
  const [toast, setToast] = useState<string | null>(null)

  // Filter States
  const [brandFilter, setBrandFilter] = useState("All")
  const [typeFilter, setTypeFilter] = useState("All")
  const [valueFilter, setValueFilter] = useState("All")
  const [countryFilter, setCountryFilter] = useState("All")
  const [newUserFilter, setNewUserFilter] = useState(false)
  const [hasFraudFilter, setHasFraudFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Single review workspace values
  const [singleDecision, setSingleDecision] = useState("Approve Full")
  const [rejectReason, setRejectReason] = useState("")

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => {
      setToast(null)
    }, 4000)
  }

  // Filter Application Logic
  const filteredGiftcards = giftcards.filter(gc => {
    const matchesSearch = !searchQuery || 
      gc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gc.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gc.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (gc.code && gc.code.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesBrand = brandFilter === "All" || gc.brand === brandFilter
    const matchesType = typeFilter === "All" || gc.type === typeFilter
    
    let matchesValue = true
    if (valueFilter !== "All") {
      const valNum = parseFloat(gc.claimedValue.replace(/[^0-9.]/g, "")) || 0
      if (valueFilter === "under-50") {
         matchesValue = valNum < 50
      } else if (valueFilter === "50-100") {
         matchesValue = valNum >= 50 && valNum <= 100
      } else if (valueFilter === "over-100") {
         matchesValue = valNum > 100
      }
    }

    const matchesCountry = countryFilter === "All" || (gc.country || "US") === countryFilter
    const matchesNewUser = !newUserFilter || (gc.userAccountAgeDays !== undefined ? gc.userAccountAgeDays <= 7 : true)
    const matchesFraud = !hasFraudFilter || (gc.fraudFlags && gc.fraudFlags > 0)

    return matchesSearch && matchesBrand && matchesType && matchesValue && matchesCountry && matchesNewUser && matchesFraud
  })

  // Active item details from index params (scoped to filtered items)
  const activeItemIndex = id ? filteredGiftcards.findIndex(item => item.id === id) : 0
  const activeItem = filteredGiftcards.length > 0 ? (filteredGiftcards[Math.max(0, activeItemIndex)] || filteredGiftcards[0]) : null

  // Reset or initialize input fields when changing item
  useEffect(() => {
    if (activeItem) {
      setRejectReason(activeItem.decisionReason || "")
      setSingleDecision(activeItem.status === "Approved" ? "Approve Full" : activeItem.status === "Rejected" ? "Reject" : "Approve Full")
    }
  }, [activeItem])

  // Bulk logic mapped over filtered collection
  const handleSelectAllToggle = () => {
    const visibleIds = filteredGiftcards.map(gc => gc.id)
    const allSelected = visibleIds.length > 0 && visibleIds.every(id => selectedCardIds.includes(id))
    if (allSelected) {
      setSelectedCardIds(prev => prev.filter(id => !visibleIds.includes(id)))
    } else {
      setSelectedCardIds(prev => Array.from(new Set([...prev, ...visibleIds])))
    }
  }

  const toggleSelectCard = (cardId: string) => {
    setSelectedCardIds(prev => 
      prev.includes(cardId) ? prev.filter(id => id !== cardId) : [...prev, cardId]
    )
  }

  const handleBulkApprove = () => {
    if (selectedCardIds.length === 0) return
    const updated = giftcards.map(gc => {
      if (selectedCardIds.includes(gc.id)) {
        return { ...gc, status: "Approved" }
      }
      return gc
    })
    setGiftcards(updated)
    setSelectedCardIds([])
    showToast(`Successfully bulk-approved ${selectedCardIds.length} gift cards.`)
  }

  const handleBulkReject = () => {
    if (selectedCardIds.length === 0) return
    const updated = giftcards.map(gc => {
      if (selectedCardIds.includes(gc.id)) {
        return { ...gc, status: "Rejected", decisionReason: "Bulk rejection action" }
      }
      return gc
    })
    setGiftcards(updated)
    setSelectedCardIds([])
    showToast(`Successfully bulk-rejected ${selectedCardIds.length} gift cards.`)
  }

  const handleBulkFlagFraud = () => {
    if (selectedCardIds.length === 0) return
    const updated = giftcards.map(gc => {
      if (selectedCardIds.includes(gc.id)) {
        return { ...gc, fraudFlags: gc.fraudFlags + 1 }
      }
      return gc
    })
    setGiftcards(updated)
    setSelectedCardIds([])
    showToast(`Appended additional risk metrics and fraud flags to ${selectedCardIds.length} cards.`)
  }

  // Single review submission
  const handleSubmitSingleDecision = () => {
    if (!activeItem) return
    const status = singleDecision === "Approve Full" ? "Approved" : (singleDecision === "Approve Partial" ? "Partially Approved" : "Rejected")
    const updated = giftcards.map(gc => {
      if (gc.id === activeItem.id) {
        return { ...gc, status: status, decisionReason: rejectReason }
      }
      return gc
    })
    setGiftcards(updated)
    showToast(`Decision saved: ${status} for ${activeItem.brand}.`)
  }

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-6rem)] relative -mx-2 -mt-2">
      {/* Top Stats Strip */}
      <div className="flex bg-bg-elev border border-rule rounded-sm divide-x divide-rule shrink-0">
         <StatItem label="IN QUEUE" value={String(giftcards.filter(c => c.status === "Pending").length)} />
         <StatItem label="OLDEST AGE" value="4m 12s" valueClass="text-bad" />
         <StatItem label="MY REVIEWS TODAY" value={String(giftcards.filter(c => c.status !== "Pending").length + 23)} />
         <StatItem label="AVG REVIEW TIME" value="1m 48s" />
         <StatItem label="APPROVAL RATE" value="87%" />
         <StatItem label="MY APPROVAL RATE" value="91%" valueClass="text-good" />
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 flex-wrap shrink-0 pb-2">
         {/* Brand SELECT */}
         <CustomSelect 
            id="filter-brand"
            value={brandFilter}
            onChange={setBrandFilter}
            options={brandOptions}
            placeholder="Brand: All"
         />

         {/* Card Type SELECT */}
         <CustomSelect 
            id="filter-cardtype"
            value={typeFilter}
            onChange={setTypeFilter}
            options={TYPE_OPTIONS}
            placeholder="Type: All"
         />

         {/* Value Range SELECT */}
         <CustomSelect 
            id="filter-value"
            value={valueFilter}
            onChange={setValueFilter}
            options={VALUE_OPTIONS}
            placeholder="Value: All"
         />

         {/* Country SELECT */}
         <CustomSelect 
            id="filter-country"
            value={countryFilter}
            onChange={setCountryFilter}
            options={COUNTRY_OPTIONS}
            placeholder="Country: All"
         />

         {/* Badges as interactive toggles */}
         <div 
            id="btn-filter-newuser"
            onClick={() => setNewUserFilter(prev => !prev)}
            className={`inline-flex items-center rounded-full border px-3 h-7 text-[10px] cursor-pointer font-sans transition-colors ${newUserFilter ? 'bg-lime/10 text-lime border-lime/50 font-semibold' : 'bg-bg-paper text-stone border-rule hover:bg-bg-elev font-medium'}`}
         >
            New User (≤7 days)
         </div>
         <div 
            id="btn-filter-fraud"
            onClick={() => setHasFraudFilter(prev => !prev)}
            className={`inline-flex items-center rounded-full border px-3 h-7 text-[10px] cursor-pointer font-sans transition-colors ${hasFraudFilter ? 'bg-bad/20 text-bad border-bad/50 font-bold' : 'bg-warn/5 text-warn/80 border-warn/20 hover:bg-warn/10 font-semibold'}`}
         >
            Has Fraud Flags
         </div>

         {/* Reset active filters */}
         {(brandFilter !== "All" || typeFilter !== "All" || valueFilter !== "All" || countryFilter !== "All" || newUserFilter || hasFraudFilter || searchQuery) && (
            <Button 
               id="btn-reset-filters"
               variant="ghost" 
               size="sm" 
               onClick={() => {
                  setBrandFilter("All")
                  setTypeFilter("All")
                  setValueFilter("All")
                  setCountryFilter("All")
                  setNewUserFilter(false)
                  setHasFraudFilter(false)
                  setSearchQuery("")
               }}
               className="h-7 text-[10px] text-lime hover:text-lime/80 px-1 py-0 font-sans"
            >
               Reset Filters
            </Button>
         )}
         
         <div className="ml-auto w-48 relative">
            <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-stone" />
            <Input 
               id="input-search-queue" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="h-7 pl-7 bg-bg-paper text-[10px] font-sans" 
               placeholder="Search ID, brand, user..." 
            />
         </div>
         <Button variant="outline" className="h-7 px-3 text-[10px] font-sans" onClick={() => navigate('/admin/giftcards/inventory')}>Inventory &rarr;</Button>
      </div>

      {/* Two Column Workspace */}
      <div className="flex flex-1 min-h-0 gap-4">
         {/* LEFT - Queue (30%) */}
         <div className="w-[35%] lg:w-[30%] bg-bg-paper border border-rule rounded-md flex flex-col overflow-hidden">
            <div className="p-3 border-b border-rule bg-bg-elev shrink-0 flex justify-between items-center text-xs font-sans">
               <div className="flex items-center gap-2">
                  <input 
                    id="chk-giftcards-header"
                    type="checkbox" 
                    checked={filteredGiftcards.length > 0 && filteredGiftcards.every(gc => selectedCardIds.includes(gc.id))}
                    onChange={handleSelectAllToggle}
                    className="rounded-sm bg-bg-paper border-rule accent-lime w-3.5 h-3.5 cursor-pointer" 
                  />
                  <span className="font-medium text-stone tracking-wider uppercase">Active Queue</span>
               </div>
               <span className="text-[10px] bg-bg-paper border border-rule px-1.5 py-0.5 rounded font-mono">
                  {filteredGiftcards.length} displayed
               </span>
            </div>

            {/* Bulk Actions Panel for Queue Items */}
            {selectedCardIds.length > 0 && (
               <div id="bulk-giftcard-panel" className="bg-bg-elev p-2.5 px-3 border-b border-rule flex flex-col gap-2 animate-in slide-in-from-top-2 duration-150 relative z-10 shrink-0 font-sans">
                  <div className="flex items-center justify-between text-[11px]">
                     <span className="font-semibold text-lime"><span className="text-cream font-bold">{selectedCardIds.length}</span> card{(selectedCardIds.length > 1) ? 's' : ''} in selection</span>
                     <button onClick={() => setSelectedCardIds([])} className="text-stone hover:text-cream text-[10px] underline">Clear</button>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                     <Button id="btn-bulk-approve-gc" onClick={handleBulkApprove} size="sm" className="h-6.5 text-[9px] bg-good text-bg-base hover:bg-good/90 font-bold uppercase p-0">
                        Approve
                     </Button>
                     <Button id="btn-bulk-reject-gc" onClick={handleBulkReject} size="sm" className="h-6.5 text-[9px] bg-bad text-white hover:bg-bad/90 font-bold uppercase p-0">
                        Reject
                     </Button>
                     <Button id="btn-bulk-flag-gc" onClick={handleBulkFlagFraud} size="sm" variant="outline" className="h-6.5 text-[8px] border-rule font-bold uppercase p-0 text-stone hover:text-cream">
                        Flag Risk
                     </Button>
                  </div>
               </div>
            )}

            <div className="overflow-y-auto flex-1 p-2 space-y-2">
               {filteredGiftcards.map((item) => (
                  <div 
                     id={`giftcard-card-${item.id}`}
                     key={item.id}
                     onClick={() => navigate(`/admin/giftcards/${item.id}`)}
                     className={`flex gap-2.5 p-2 rounded-sm cursor-pointer border transition-colors items-center ${activeItem && activeItem.id === item.id ? 'bg-bg-elev border-lime shadow-[inset_2px_0_0_var(--color-lime)]' : 'bg-bg-base border-transparent hover:border-rule hover:bg-bg-elev/50'}`}
                  >
                     <div onClick={e => e.stopPropagation()} className="flex items-center shrink-0">
                        <input 
                          id={`chk-giftcard-row-${item.id}`}
                          type="checkbox" 
                          checked={selectedCardIds.includes(item.id)}
                          onChange={() => toggleSelectCard(item.id)}
                          className="rounded-sm bg-bg-paper border-rule accent-lime w-3.5 h-3.5 cursor-pointer" 
                        />
                     </div>
                     <img src={item.image} className="w-14 h-10 object-cover rounded opacity-80 shrink-0" alt="card" />
                     <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div className="flex justify-between items-start">
                           <span className="text-[11px] font-medium text-cream truncate font-sans">{item.brand} • {item.claimedValue}</span>
                           <span className="text-[10px] text-stone font-mono">{item.age}</span>
                        </div>
                        <div className="flex justify-between items-end">
                           <span className="text-[10px] text-stone truncate font-sans">by {item.user}</span>
                           {item.status === "Approved" ? (
                              <Badge className="h-3.5 text-[8px] px-1 bg-good/20 text-good border-good/20 border rounded-sm font-mono uppercase">APPROVED</Badge>
                           ) : item.status === "Rejected" ? (
                              <Badge className="h-3.5 text-[8px] px-1 bg-bad/20 text-bad border-bad/20 border rounded-sm font-mono uppercase">REJECTED</Badge>
                           ) : item.status === "Partially Approved" ? (
                              <Badge className="h-3.5 text-[8px] px-1 bg-warn/20 text-warn border-warn/20 border rounded-sm font-mono uppercase">PARTIAL</Badge>
                           ) : item.fraudFlags > 0 ? (
                              <Badge variant="destructive" className="h-3.5 text-[8px] px-1 rounded-sm flex gap-1 bg-bad/20 text-bad border-bad/30"><ShieldAlert className="w-2.5 h-2.5"/> {item.fraudFlags}</Badge>
                           ) : (
                              <Badge className="h-3.5 text-[8px] px-1 bg-bg-paper text-stone border-rule rounded-sm font-mono uppercase">PENDING</Badge>
                           )}
                        </div>
                     </div>
                  </div>
               ))}
               {filteredGiftcards.length === 0 && (
                  <div className="py-8 text-center text-xs text-stone font-sans">
                     No gift cards match the filters.
                  </div>
               )}
            </div>
         </div>

         {/* RIGHT - Review Pane (70%) */}
         <div className="flex-1 bg-bg-elev border border-rule rounded-md flex flex-col min-w-0">
            {activeItem ? (
               <>
                  {/* Header */}
                  <div className="p-4 border-b border-rule flex justify-between items-center shrink-0">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-bg-base border border-rule flex text-[10px] font-medium items-center justify-center text-stone font-mono">
                          {activeItem.brand.substring(0, 3).toUpperCase()}
                        </div>
                        <div>
                           <div className="flex items-center gap-2">
                              <h2 className="text-sm font-medium">{activeItem.brand} {activeItem.type} Gift Card</h2>
                              <span className="text-[10px] font-mono font-medium tracking-wide uppercase px-1.5 py-0.5 rounded-sm bg-lime-tint text-lime border border-lime/30">
                                 {activeItem.claimedValue}
                              </span>
                           </div>
                           <div className="flex gap-2 text-[10px] text-stone mt-1">
                              <span>Submitted by <a href="#" className="hover:text-cream hover:underline">{activeItem.user}</a></span>
                              <span>•</span>
                              <span>{activeItem.age} ago</span>
                           </div>
                        </div>
                     </div>
                     <div className="text-xs text-stone font-mono flex items-center gap-2">
                        <span>ID: {activeItem.id}</span>
                        {activeItem.status !== "Pending" && (
                           <Badge variant={activeItem.status === "Approved" ? "success" : "destructive"} className="text-[9px] uppercase">
                              {activeItem.status}
                           </Badge>
                        )}
                     </div>
                  </div>

                  <div className="flex-1 flex overflow-hidden">
                     {/* Images Pane */}
                     <div className="w-1/2 p-4 border-r border-rule overflow-y-auto flex flex-col gap-4">
                        <div className="bg-bg-base border border-rule rounded p-2 relative group flex-1 min-h-[250px]">
                           <img src={activeItem.image} className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" alt="Front" />
                           <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button size="icon" variant="secondary" className="h-8 w-8 bg-bg-paper/80 backdrop-blur"><RotateCcw className="w-4 h-4" /></Button>
                              <Button size="icon" variant="secondary" className="h-8 w-8 bg-bg-paper/80 backdrop-blur"><Crop className="w-4 h-4" /></Button>
                           </div>
                           <Badge className="absolute top-4 left-4 bg-bg-paper/80 backdrop-blur">Front</Badge>
                        </div>
                        
                        <div className="flex gap-2 shrink-0">
                           <span className="text-[10px] font-mono px-2 py-1 bg-bg-base border border-rule rounded flex-1 truncate text-stone">Hash: a8f92j...4m</span>
                           {activeItem.fraudFlags > 0 ? (
                              <span className="text-[10px] font-mono px-2 py-1 bg-bad/20 border border-bad/30 rounded text-bad flex items-center gap-1">
                                 <AlertTriangle className="w-3 h-3" /> Duplicate Image Seen
                              </span>
                           ) : (
                              <span className="text-[10px] font-mono px-2 py-1 bg-good/10 border border-good/20 rounded text-good flex items-center gap-1">
                                 <Check className="w-3 h-3" /> Clean Hash
                              </span>
                           )}
                        </div>
                        
                        <div className="text-[10px] text-stone text-center mb-1">Press J/K to navigate queue</div>
                     </div>

                     {/* Data + Decision Pane */}
                     <div className="w-1/2 p-4 overflow-y-auto space-y-6 flex flex-col justify-between">
                        <div className="space-y-6">
                           {/* OCR Data */}
                           <div className="space-y-3">
                              <h3 className="text-[10px] font-medium text-stone uppercase tracking-wider">Extracted Data</h3>
                              <div className="grid grid-cols-2 gap-3">
                                 <div className="col-span-2">
                                    <label className="text-[10px] text-stone mb-1 block">Detected Code (Editable)</label>
                                    <Input defaultValue={activeItem.code} className="font-mono text-xs border-lime/50 focus-visible:ring-lime/50 h-9" />
                                 </div>
                                 <div>
                                    <label className="text-[10px] text-stone mb-1 block">Claimed Value</label>
                                    <Input defaultValue={activeItem.claimedValue} className="font-mono text-xs bg-bg-base" />
                                 </div>
                                 <div>
                                    <label className="text-[10px] text-stone mb-1 block">Detected PIN</label>
                                    <Input placeholder="N/A" className="font-mono text-xs bg-bg-base" disabled />
                                 </div>
                              </div>
                           </div>

                           {/* Signals */}
                           <div className="space-y-3">
                              <h3 className="text-[10px] font-medium text-stone uppercase tracking-wider">Risk Signals</h3>
                              <div className="bg-bg-paper border border-rule-strong rounded-sm p-3 text-[11px] space-y-2 font-mono">
                                 <div className="flex justify-between">
                                    <span className="text-stone">User Account Age</span>
                                    <span className="text-warn flex items-center gap-1">2 days <AlertTriangle className="w-2.5 h-2.5"/></span>
                                 </div>
                                 <div className="flex justify-between">
                                    <span className="text-stone">User's Approved Cards</span>
                                    <span>0</span>
                                 </div>
                                 <div className="flex justify-between">
                                    <span className="text-stone">IP Geography Match</span>
                                    <span className="text-good flex items-center gap-1">Yes <Check className="w-3 h-3"/></span>
                                 </div>
                                 <div className="flex justify-between">
                                    <span className="text-stone">Velocity (24h)</span>
                                    <span>3 cards submitted</span>
                                 </div>
                              </div>
                           </div>

                           {/* Payout */}
                           <div className="flex justify-between items-center bg-bg-paper border border-rule p-3">
                              <div>
                                 <div className="text-[10px] text-stone">Estimated Payout</div>
                                 <div className="text-[10px] text-stone font-mono mt-0.5">Rate used: ₦1,520 (rate_8f2)</div>
                              </div>
                              <div className="text-xl font-mono text-cream font-medium tracking-tight">
                                 {activeItem.amountNgn}
                              </div>
                           </div>
                        </div>

                        {/* Decision Options */}
                        <div className="space-y-4 pt-4 border-t border-rule">
                           <div className="grid grid-cols-2 gap-2">
                              <label className={`flex items-center gap-2 p-2.5 border rounded-sm cursor-pointer hover:bg-bg-paper transition-all relative ${singleDecision === 'Approve Full' ? 'border-good bg-bg-paper' : 'border-rule'}`}>
                                 <input 
                                   type="radio" 
                                   name="decision" 
                                   className="accent-good" 
                                   checked={singleDecision === "Approve Full"} 
                                   onChange={() => setSingleDecision("Approve Full")}
                                 />
                                 <span className="text-xs font-medium text-cream">Approve Full</span>
                              </label>
                              <label className={`flex items-center gap-2 p-2.5 border rounded-sm cursor-pointer hover:bg-bg-paper transition-all relative ${singleDecision === 'Approve Partial' ? 'border-warn bg-bg-paper' : 'border-rule'}`}>
                                 <input 
                                   type="radio" 
                                   name="decision" 
                                   className="accent-warn" 
                                   checked={singleDecision === "Approve Partial"} 
                                   onChange={() => setSingleDecision("Approve Partial")}
                                 />
                                 <span className="text-xs font-medium text-cream">Approve Partial</span>
                              </label>
                           </div>
                           <label className={`flex items-center gap-2 p-2.5 border rounded-sm cursor-pointer hover:bg-bg-paper transition-all relative ${singleDecision === 'Reject' ? 'border-bad bg-bad/10' : 'border-rule'}`}>
                               <input 
                                 type="radio" 
                                 name="decision" 
                                 className="accent-bad" 
                                 checked={singleDecision === "Reject"} 
                                 onChange={() => setSingleDecision("Reject")}
                               />
                               <span className="text-xs font-medium text-bad">Reject</span>
                           </label>

                           <textarea 
                              className="w-full min-h-[60px] bg-bg-base border border-rule p-2.5 text-[11px] text-cream rounded-sm focus:outline-none focus:border-stone resize-none font-mono placeholder:text-stone/50 bg-bg-paper" 
                              placeholder="Required for partial/reject: reason for decision..."
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                           ></textarea>

                           <Button id="btn-submit-single-decision" onClick={handleSubmitSingleDecision} size="lg" className="w-full font-medium h-10 shadow-sm border border-black/10">
                              Submit Decision &rarr;
                           </Button>
                        </div>

                     </div>
                  </div>
               </>
            ) : (
               <div className="flex-1 flex flex-col items-center justify-center p-8 text-stone">
                  <CheckCircle2 className="w-12 h-12 text-lime opacity-30 mb-3" />
                  <h3 className="text-sm font-medium text-cream">No Gift Card Selected</h3>
                  <p className="text-[11px] text-stone mt-1">Please select an item from the queue to start reviewing.</p>
               </div>
            )}
         </div>
      </div>

      {/* Floating active toast notification indicator */}
      {toast && (
        <div id="toast-message-gc" className="fixed bottom-4 right-4 bg-lime text-bg-base font-bold text-xs px-4 py-3 rounded shadow-lg flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
           <Check className="w-4 h-4 text-bg-base stroke-[3]" />
           {toast}
        </div>
      )}
    </div>
  )
}

function StatItem({ label, value, valueClass = "text-cream" }: { label: string, value: string, valueClass?: string }) {
  return (
    <div className="flex-1 px-4 py-2 flex flex-col justify-center min-w-[120px]">
       <div className="text-[9px] font-medium text-stone uppercase tracking-widest">{label}</div>
       <div className={`text-base font-mono mt-0.5 ${valueClass}`}>{value}</div>
    </div>
  )
}
