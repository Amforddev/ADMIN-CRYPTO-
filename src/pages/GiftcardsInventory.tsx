import React, { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Search, 
  Plus, 
  CalendarClock, 
  History, 
  Settings, 
  MoreHorizontal, 
  ArrowLeft, 
  Check, 
  AlertCircle, 
  Filter, 
  Trash2, 
  Edit3, 
  X,
  Sparkles,
  ShieldAlert
} from "lucide-react"
import CustomSelect, { DoubleOption } from "@/components/ui/CustomSelect"

export default function GiftcardsInventory() {
  const [activeTab, setActiveTab] = useState("BRANDS")
  const tabs = ["BRANDS", "RATE SHEET", "RATE HISTORY", "FRAUD RULES"]

  // Schedulable shifts state
  const [shifts, setShifts] = useState<any[]>(() => {
    const saved = localStorage.getItem("volt-giftcards-shifts")
    if (saved) return JSON.parse(saved)
    return [
      { id: "sh_1", brand: "Amazon", shiftName: "Night Shift Multiplier", startTime: "22:00", endTime: "06:00", multiplier: "+3%", status: "Active" },
      { id: "sh_2", brand: "Steam", shiftName: "Weekend Premium Trading", startTime: "08:00", endTime: "22:00", multiplier: "+5%", status: "Active" }
    ]
  })

  useEffect(() => {
    localStorage.setItem("volt-giftcards-shifts", JSON.stringify(shifts))
  }, [shifts])

  const [showScheduleShiftModal, setShowScheduleShiftModal] = useState(false)
  const [shBrand, setShBrand] = useState("Amazon")
  const [shName, setShName] = useState("")
  const [shStart, setShStart] = useState("09:00")
  const [shEnd, setShEnd] = useState("17:00")
  const [shMultiplier, setShMultiplier] = useState("+3%")
  const [shStatus, setShStatus] = useState("Active")

  // State-driven Fraud Rules to match screenshot config precisely
  const [fraudRules, setFraudRules] = useState<any[]>(() => {
    const saved = localStorage.getItem("volt-giftcards-fraudrules")
    if (saved) return JSON.parse(saved)
    return [
      { id: "fr_receipt", title: "Receipt Strict Matching", desc: "Reject physical cards on US Apple & Amazon without clear vendor receipt.", status: "Enforcing", scope: "Apple, Amazon", threshold: "N/A" },
      { id: "fr_velocity", title: "Velocity Limits", desc: "Flag accounts submitting > $500 total within their first 24 hours.", status: "Enforcing", scope: "All Brands", threshold: "500" },
      { id: "fr_ocr", title: "OCR Verification", desc: "Automatically scan and decode physical card claim codes.", status: "Disabled (Beta)", scope: "All Physical", threshold: "85%" }
    ]
  })

  useEffect(() => {
    localStorage.setItem("volt-giftcards-fraudrules", JSON.stringify(fraudRules))
  }, [fraudRules])

  const [configuringRule, setConfiguringRule] = useState<any | null>(null)
  const [ruleTitle, setRuleTitle] = useState("")
  const [ruleDesc, setRuleDesc] = useState("")
  const [ruleStatus, setRuleStatus] = useState("Enforcing")
  const [ruleScope, setRuleScope] = useState("All Brands")
  const [ruleThreshold, setRuleThreshold] = useState("")

  // Stateful Brands list
  const [brands, setBrands] = useState<any[]>(() => {
    const saved = localStorage.getItem("volt-giftcards-brands")
    if (saved) return JSON.parse(saved)
    const initial = [
      { name: "Amazon", logo: "AMZ", activeTypes: 4, countries: "US, UK, CA", status: "enabled", color: "#FF9900" },
      { name: "Steam", logo: "STM", activeTypes: 2, countries: "US", status: "enabled", color: "#00ADEE" },
      { name: "Apple/iTunes", logo: "APL", activeTypes: 3, countries: "US, UK, EUR", status: "enabled", color: "#A3AAAE" },
      { name: "Google Play", logo: "GPL", activeTypes: 2, countries: "US, UK", status: "enabled", color: "#34A853" },
      { name: "Razer Gold", logo: "RZR", activeTypes: 1, countries: "Global", status: "enabled", color: "#FFC000" },
      { name: "Vanilla Visa", logo: "VIS", activeTypes: 1, countries: "US", status: "disabled", color: "#1A1F70" },
    ]
    localStorage.setItem("volt-giftcards-brands", JSON.stringify(initial))
    return initial
  })

  useEffect(() => {
    localStorage.setItem("volt-giftcards-brands", JSON.stringify(brands))
  }, [brands])

  // Stateful Rates management
  const [rates, setRates] = useState(() => {
    const saved = localStorage.getItem("volt-giftcards-rates")
    if (saved) return JSON.parse(saved)
    const initial = [
      { id: "r_1", name: "Amazon Digital", rules: "US", r1: "1,150", r2: "1,200", r3: "1,250", r4: "1,280" },
      { id: "r_2", name: "Amazon Physical", rules: "US", r1: "1,050", r2: "1,100", r3: "1,150", r4: "1,180" },
      { id: "r_3", name: "Amazon Digital", rules: "UK", r1: "1,450", r2: "1,500", r3: "1,550", r4: "1,580" },
      { id: "r_4", name: "Steam Physical", rules: "US", r1: "1,200", r2: "1,350", r3: "1,400", r4: "-" },
      { id: "r_5", name: "Apple iTunes", rules: "US", r1: "1,100", r2: "1,200", r3: "1,300", r4: "1,400" },
    ]
    localStorage.setItem("volt-giftcards-rates", JSON.stringify(initial))
    return initial
  })

  // Filter States for Brands
  const [brandSearch, setBrandSearch] = useState("")
  const [brandStatusFilter, setBrandStatusFilter] = useState("All")

  // Filter States for Rate Sheet
  const [rateSearch, setRateSearch] = useState("")
  const [rateBrandFilter, setRateBrandFilter] = useState("All")
  const [rateCountryFilter, setRateCountryFilter] = useState("All")

  // Modals for editing/creating brands
  const [editingBrand, setEditingBrand] = useState<any | null>(null)
  const [showAddBrandModal, setShowAddBrandModal] = useState(false)

  // Sub-states for Adding or Editing brand form
  const [bName, setBName] = useState("")
  const [bLogo, setBLogo] = useState("")
  const [bActiveTypes, setBActiveTypes] = useState(1)
  const [bCountries, setBCountries] = useState("")
  const [bStatus, setBStatus] = useState("enabled")
  const [bColor, setBColor] = useState("#FF9900")

  // Bulk rate adjustment tracking
  const [selectedRateIds, setSelectedRateIds] = useState<string[]>([])
  const [showBulkAdjust, setShowBulkAdjust] = useState(false)
  const [bulkPercent, setBulkPercent] = useState("")
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }

  const saveRates = (newRates: typeof rates) => {
    setRates(newRates)
    localStorage.setItem("volt-giftcards-rates", JSON.stringify(newRates))
  }

  // Row selection handlers
  const handleToggleSelectRate = (id: string) => {
    setSelectedRateIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleSelectAllRates = () => {
    const visibleRates = filteredRates
    const visibleIds = visibleRates.map(r => r.id)
    const allSelected = visibleIds.length > 0 && visibleIds.every(id => selectedRateIds.includes(id))
    if (allSelected) {
      setSelectedRateIds(prev => prev.filter(id => !visibleIds.includes(id)))
    } else {
      setSelectedRateIds(prev => Array.from(new Set([...prev, ...visibleIds])))
    }
  }

  // Bulk rate adjustment action
  const handleBulkAdjust = () => {
    const percentVal = parseFloat(bulkPercent)
    if (isNaN(percentVal)) {
      showToast("Please enter a valid numeric percentage.")
      return
    }
    const multiplier = 1 + (percentVal / 100)

    const updated = rates.map(row => {
      if (selectedRateIds.includes(row.id)) {
        const adjust = (val: string) => {
          if (val === "-") return "-"
          const parsed = parseFloat(val.replace(/,/g, ""))
          if (isNaN(parsed)) return val
          const adjustedVal = Math.round(parsed * multiplier)
          return adjustedVal.toLocaleString()
        }
        return {
          ...row,
          r1: adjust(row.r1),
          r2: adjust(row.r2),
          r3: adjust(row.r3),
          r4: adjust(row.r4),
        }
      }
      return row
    })

    saveRates(updated)
    setSelectedRateIds([])
    setShowBulkAdjust(false)
    setBulkPercent("")
    showToast(`Adjusted rates inside ${selectedRateIds.length} row(s) by ${percentVal > 0 ? '+' : ''}${percentVal}%.`)
  }

  // Cell manual input changes
  const handleCellEdit = (id: string, col: "r1" | "r2" | "r3" | "r4", newVal: string) => {
    const updated = rates.map(row => {
      if (row.id === id) {
        return { ...row, [col]: newVal }
      }
      return row
    })
    saveRates(updated)
  }

  // Brand form helper resets
  const handleOpenAddBrand = () => {
    setBName("")
    setBLogo("")
    setBActiveTypes(1)
    setBCountries("US, UK, EUR")
    setBStatus("enabled")
    setBColor("#84cc16")
    setShowAddBrandModal(true)
  }

  const handleOpenEditConfig = (brand: any) => {
    setEditingBrand(brand)
    setBName(brand.name)
    setBLogo(brand.logo)
    setBActiveTypes(brand.activeTypes)
    setBCountries(brand.countries)
    setBStatus(brand.status)
    setBColor(brand.color || "#84cc16")
  }

  const handleOpenConfigureRule = (rule: any) => {
    setConfiguringRule(rule)
    setRuleTitle(rule.title)
    setRuleDesc(rule.desc)
    setRuleStatus(rule.status)
    setRuleScope(rule.scope || "All Brands")
    setRuleThreshold(rule.threshold || "")
  }

  const handleSaveRuleConfig = (e: React.FormEvent) => {
    e.preventDefault()
    if (!configuringRule) return
    const updated = fraudRules.map(r => {
      if (r.id === configuringRule.id) {
        return {
          ...r,
          status: ruleStatus,
          scope: ruleScope,
          threshold: ruleThreshold
        }
      }
      return r
    })
    setFraudRules(updated)
    setConfiguringRule(null)
    showToast(`Successfully saved configuration for ${ruleTitle}!`)
  }

  // Submit operations
  const handleAddBrandSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!bName.trim() || !bLogo.trim()) {
      showToast("Please provide both name and logo.")
      return
    }
    const newBrand = {
      name: bName.trim(),
      logo: bLogo.trim().toUpperCase().substring(0, 4),
      activeTypes: Number(bActiveTypes) || 1,
      countries: bCountries || "US",
      status: bStatus,
      color: bColor
    }
    setBrands(prev => [...prev, newBrand])
    setShowAddBrandModal(false)
    showToast(`Successfully created ${newBrand.name} brand!`)

    // Prepopulate a sample rate entry for convenience
    const newRateEntry = {
      id: "r_" + Date.now(),
      name: `${newBrand.name} Digital`,
      rules: newBrand.countries.split(",")[0].trim() || "US",
      r1: "1,200",
      r2: "1,250",
      r3: "1,300",
      r4: "1,350"
    }
    setRates(prev => [...prev, newRateEntry])
    localStorage.setItem("volt-giftcards-rates", JSON.stringify([...rates, newRateEntry]))
  }

  const handleEditBrandSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBrand) return
    const updated = brands.map(b => {
      if (b.name === editingBrand.name) {
        return {
          ...b,
          name: bName.trim(),
          logo: bLogo.trim().toUpperCase().substring(0, 4),
          activeTypes: Number(bActiveTypes) || 1,
          countries: bCountries,
          status: bStatus,
          color: bColor
        }
      }
      return b
    })
    setBrands(updated)
    setEditingBrand(null)
    showToast(`Brand ${bName} updated successfully.`)
  }

  const handleDeleteBrand = (name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      setBrands(prev => prev.filter(b => b.name !== name))
      showToast(`Removed brand: ${name}`)
    }
  }

  // Filter application - Brands
  const filteredBrands = brands.filter(b => {
    const matchesSearch = !brandSearch || 
      b.name.toLowerCase().includes(brandSearch.toLowerCase()) ||
      b.logo.toLowerCase().includes(brandSearch.toLowerCase())
    const matchesStatus = brandStatusFilter === "All" || b.status === brandStatusFilter
    return matchesSearch && matchesStatus
  })

  // Filter application - Rates
  const filteredRates = rates.filter(r => {
    const matchesSearch = !rateSearch || 
      r.name.toLowerCase().includes(rateSearch.toLowerCase()) ||
      r.rules.toLowerCase().includes(rateSearch.toLowerCase())
    
    const matchesBrand = rateBrandFilter === "All" || r.name.toLowerCase().includes(rateBrandFilter.toLowerCase())
    const matchesCountry = rateCountryFilter === "All" || r.rules.toLowerCase() === rateCountryFilter.toLowerCase()
    return matchesSearch && matchesBrand && matchesCountry
  })

  // Select list options configuration
  const brandStatusFilterOptions: DoubleOption[] = [
    { value: "All", label: "Status: All" },
    { value: "enabled", label: "Enabled Only", color: "#84cc16", bgColor: "rgba(132,204,22,0.15)" },
    { value: "disabled", label: "Disabled Only", color: "#78716c", bgColor: "rgba(120,113,108,0.15)" }
  ]

  const formStatusOptions: DoubleOption[] = [
    { value: "enabled", label: "Enabled", color: "#84cc16", bgColor: "rgba(132,204,22,0.15)" },
    { value: "disabled", label: "Disabled", color: "#78716c", bgColor: "rgba(120,113,108,0.15)" }
  ]

  const rateBrandFilterOptions: DoubleOption[] = [
    { value: "All", label: "Brand: All" },
    ...brands.map(b => ({
      value: b.name,
      label: b.name,
      color: b.color || "#FF9900",
      bgColor: `${b.color || "#FF9900"}15`
    }))
  ]

  const rateCountryFilterOptions: DoubleOption[] = [
    { value: "All", label: "Region: All" },
    { value: "US", label: "US Region", color: "#ef4444", bgColor: "rgba(239,68,68,0.15)" },
    { value: "UK", label: "UK Region", color: "#06b6d4", bgColor: "rgba(6,182,212,0.15)" },
    { value: "CA", label: "CA Region", color: "#f59e0b", bgColor: "rgba(245,158,11,0.15)" },
    { value: "EUR", label: "EUR Region", color: "#a855f7", bgColor: "rgba(168,85,247,0.15)" },
    { value: "Global", label: "Global Region", color: "#10b981", bgColor: "rgba(16,185,129,0.15)" },
  ]

  const PRESET_COLORS = ["#FF9900", "#00ADEE", "#A3AAAE", "#34A853", "#FFC000", "#1A1F70", "#ec4899", "#a855f7"]

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-6rem)] relative -mx-2 -mt-2">
      {/* Upper header action strip */}
      <div className="flex justify-between items-end shrink-0 bg-bg-elev border border-rule rounded-sm p-4">
        <div>
           <div className="text-stone hover:text-cream text-[10px] flex items-center gap-1 mb-1.5 cursor-pointer select-none font-sans font-medium tracking-wide" onClick={() => window.history.back()}>
             <ArrowLeft className="w-3 h-3" /> BACK TO ACTIVE QUEUE
           </div>
           <h1 className="text-sm font-display font-semibold tracking-wider text-cream uppercase">Gift Card Inventory Manager</h1>
           <p className="text-stone text-[11px] mt-0.5">Define brand assets, customize localized rates, and configure smart OCR thresholds.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button id="btn-add-brand-inventory" className="gap-2 h-7.5 px-3.5 text-xs bg-lime text-bg-base hover:bg-lime/90 font-bold font-sans uppercase shrink-0" onClick={handleOpenAddBrand}>
             <Plus className="w-3.5 h-3.5" />
             Add Brand
           </Button>
        </div>
      </div>

      <Card className="bg-bg-elev border-rule flex flex-col min-h-0 flex-1 relative overflow-hidden">
        {/* Top Tab Bar switcher */}
        <div className="flex overflow-x-auto border-b border-rule hide-scrollbar shrink-0 px-2 pt-2 bg-bg-paper">
             {tabs.map(tab => (
               <button
                 key={tab}
                 id={`tab-inventory-${tab.toLowerCase().replace(" ", "-")}`}
                 onClick={() => {
                   setActiveTab(tab)
                   setSelectedRateIds([])
                 }}
                 className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors duration-150 ${activeTab === tab ? 'border-lime text-lime' : 'border-transparent text-stone hover:text-cream'}`}
               >
                 {tab}
               </button>
             ))}
        </div>

        {/* 1. Brands Tab Pane */}
        {activeTab === "BRANDS" && (
          <div className="flex flex-col flex-1 min-h-0 bg-bg-base">
             {/* Sub-filtering tool bar */}
             <div className="p-3 border-b border-rule bg-bg-paper flex items-center gap-2.5 shrink-0 flex-wrap">
                <div className="relative flex-1 min-w-[150px] max-w-sm">
                   <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone" />
                   <Input 
                      id="search-brands-box"
                      type="text"
                      value={brandSearch}
                      onChange={e => setBrandSearch(e.target.value)}
                      placeholder="Search brands (e.g. Amazon, Google)..."
                      className="pl-8.5 h-7 text-[10px] bg-bg-base border-rule text-cream placeholder-stone/60 max-w-sm"
                   />
                </div>
                
                <CustomSelect 
                   id="brand-status-select-filter"
                   value={brandStatusFilter}
                   onChange={setBrandStatusFilter}
                   options={brandStatusFilterOptions}
                   placeholder="Status: All"
                />

                {brandSearch || brandStatusFilter !== "All" ? (
                   <button 
                     onClick={() => { setBrandSearch(""); setBrandStatusFilter("All") }} 
                     className="text-[10px] text-stone hover:text-cream cursor-pointer underline underline-offset-2 ml-1"
                   >
                     Reset Filters
                   </button>
                ) : null}

                <div className="ml-auto text-[10px] bg-bg-elev border border-rule px-2 py-0.5 rounded text-stone/90 font-mono">
                   {filteredBrands.length} listed
                </div>
             </div>

             {/* Brand Cards Grid */}
             <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto flex-1">
                {filteredBrands.map(brand => {
                   const borderAccent = brand.status === 'enabled' ? (brand.color || '#84cc16') : 'var(--color-rule-strong)'
                   const shadowEffect = brand.status === 'enabled' ? `0 2px 8px ${brand.color}15` : 'none'
                   return (
                     <div 
                        key={brand.name} 
                        id={`brand-card-${brand.name.toLowerCase().replace("/", "-")}`}
                        style={{ borderColor: `${borderAccent}25`, boxShadow: shadowEffect }}
                        className="border bg-bg-elev/40 rounded-md p-4 flex flex-col justify-between relative group hover:border-lime/40 transition-all duration-200"
                     >
                        <div>
                          <div className="flex justify-between items-start mb-3">
                             <div 
                                style={{ 
                                  color: brand.color || "#84cc16", 
                                  borderColor: `${brand.color || "#84cc16"}35`, 
                                  backgroundColor: `${brand.color || "#84cc16"}08` 
                                }}
                                className="w-12 h-12 border rounded-sm flex items-center justify-center font-display font-extrabold text-sm tracking-widest uppercase select-none"
                             >
                                {brand.logo}
                             </div>
                             
                             <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                <Button 
                                   variant="ghost" 
                                   size="icon" 
                                   className="h-6 w-6 text-stone hover:text-cream hover:bg-bg-paper"
                                   onClick={() => handleOpenEditConfig(brand)}
                                >
                                   <Settings className="w-3.5 h-3.5" />
                                </Button>
                                <Button 
                                   variant="ghost" 
                                   size="icon" 
                                   className="h-6 w-6 text-stone hover:text-bad hover:bg-bg-paper"
                                   onClick={() => handleDeleteBrand(brand.name)}
                                >
                                   <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                             </div>
                          </div>
                          
                          <h3 className="font-semibold text-cream text-[14px] font-sans flex items-center gap-1.5">
                             {brand.name}
                             {brand.status === 'enabled' && (
                               <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: brand.color }} />
                             )}
                          </h3>
                          <div className="text-[10px] text-stone mt-1 font-medium font-sans">
                            {brand.activeTypes} active types • <span className="font-mono text-[9px]">{brand.countries}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-3.5 border-t border-rule flex justify-between items-center">
                           <div className="flex items-center gap-1.5">
                             <span 
                               className="w-1.5 h-1.5 rounded-full" 
                               style={{ backgroundColor: brand.status === 'enabled' ? 'var(--color-good)' : 'var(--color-stone)' }}
                             />
                             <span className="text-[9px] tracking-wider uppercase font-mono font-medium text-stone">
                                {brand.status}
                             </span>
                           </div>
                           <button 
                             onClick={() => handleOpenEditConfig(brand)}
                             className="text-[10px] text-stone hover:text-cream cursor-pointer underline underline-offset-2 font-medium"
                           >
                             Edit config
                           </button>
                        </div>
                     </div>
                   )
                })}

                {filteredBrands.length === 0 && (
                   <div className="col-span-full py-12 text-center text-xs text-stone font-sans">
                      No brands parsed matching active searches or statuses.
                   </div>
                )}
             </div>
          </div>
        )}

        {/* 2. Rate Sheet Tab Pane */}
        {activeTab === "RATE SHEET" && (
           <div className="flex flex-col flex-1 min-h-0 bg-bg-base">
              {/* Header Action / Search Row */}
              <div className="p-3 border-b border-rule bg-bg-paper flex flex-wrap items-center justify-between gap-3 shrink-0">
                 <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative min-w-[150px]">
                       <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone" />
                       <Input 
                          id="search-rates-box"
                          type="text"
                          value={rateSearch}
                          onChange={e => setRateSearch(e.target.value)}
                          placeholder="Search rates..."
                          className="pl-8 h-7 text-[10px] bg-bg-base border-rule text-cream placeholder-stone/60 max-w-xs"
                       />
                    </div>
                    
                    <CustomSelect 
                       id="rate-brand-select-filter"
                       value={rateBrandFilter}
                       onChange={setRateBrandFilter}
                       options={rateBrandFilterOptions}
                       placeholder="Brand: All"
                    />

                    <CustomSelect 
                       id="rate-country-select-filter"
                       value={rateCountryFilter}
                       onChange={setRateCountryFilter}
                       options={rateCountryFilterOptions}
                       placeholder="Country: All"
                    />

                    {(rateSearch || rateBrandFilter !== "All" || rateCountryFilter !== "All") && (
                       <button 
                         onClick={() => { setRateSearch(""); setRateBrandFilter("All"); setRateCountryFilter("All") }} 
                         className="text-[10px] text-stone hover:text-cream cursor-pointer underline underline-offset-2 font-medium"
                       >
                         Reset Filters
                       </button>
                    )}
                 </div>

                 <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="h-7 text-[10px] font-sans font-bold uppercase shrink-0" onClick={() => {
                        if (selectedRateIds.length === 0) {
                          showToast("Use check-boxes below to select rows for bulk adjusting.")
                        } else {
                          setShowBulkAdjust(true)
                        }
                    }}>
                       Bulk Adjust %
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] border-lime/30 text-lime hover:bg-lime/10 font-sans font-bold uppercase shrink-0" onClick={() => setShowScheduleShiftModal(true)}>Schedule Shift</Button>
                 </div>
              </div>

              {/* Bulk Adjust Operation Ribbons */}
              {selectedRateIds.length > 0 && (
                 <div id="bulk-rates-control-panel" className="bg-bg-elev border-b border-rule p-2.5 px-4 flex items-center justify-between shrink-0 text-xs transition-all duration-200">
                    <div className="flex items-center gap-2">
                       <AlertCircle className="w-4 h-4 text-lime shrink-0" />
                       <span className="font-semibold text-lime">
                          <span className="text-cream font-bold">{selectedRateIds.length}</span> active rate rows in selection
                       </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                       {showBulkAdjust ? (
                          <div className="flex items-center gap-1.5 animate-in slide-in-from-right-4">
                             <Input 
                                id="input-bulk-percentage"
                                type="text" 
                                placeholder="e.g. +5 or -2.5" 
                                value={bulkPercent} 
                                onChange={e => setBulkPercent(e.target.value)}
                                className="w-28 h-7 text-[10px] bg-bg-paper text-cream border-lime/50 focus-visible:ring-0" 
                             />
                             <Button id="btn-submit-bulk-adjust" onClick={handleBulkAdjust} size="sm" className="h-7 text-[9px] bg-lime text-bg-base font-extrabold uppercase hover:bg-lime/90 font-sans">
                                Apply
                             </Button>
                             <Button size="sm" variant="ghost" className="h-7 text-[10px] text-stone font-sans font-medium" onClick={() => { setShowBulkAdjust(false); setBulkPercent("") }}>
                                Cancel
                             </Button>
                          </div>
                       ) : (
                          <Button id="btn-trigger-bulk-adjust" onClick={() => setShowBulkAdjust(true)} size="sm" className="h-7 text-[9px] bg-lime text-bg-base font-extrabold uppercase hover:bg-lime/90 font-sans">
                             Apply Markup Multiplier
                          </Button>
                       )}
                       <Button size="sm" variant="outline" className="h-7 text-[10px] text-stone hover:text-cream font-sans font-medium" onClick={() => setSelectedRateIds([])}>
                          Clear
                       </Button>
                    </div>
                 </div>
              )}
              
              <div className="overflow-y-auto flex-1 p-0 relative">
                  <Table>
                    <TableHeader className="sticky top-0 bg-bg-elev shadow-[0_1px_0_var(--color-rule)] z-10">
                      <TableRow className="hover:bg-transparent border-none">
                        <TableHead className="w-10 text-center">
                          <input 
                            id="chk-rates-header"
                            type="checkbox" 
                            checked={filteredRates.length > 0 && filteredRates.every(r => selectedRateIds.includes(r.id))}
                            onChange={handleSelectAllRates}
                            className="rounded-sm bg-bg-paper border-rule accent-lime w-3.5 h-3.5 cursor-pointer" 
                          />
                        </TableHead>
                        <TableHead className="text-[10px] uppercase font-sans tracking-wide">Brand & Asset Model</TableHead>
                        <TableHead className="text-[10px] uppercase font-sans tracking-wide">Region Rules</TableHead>
                        <TableHead className="text-right text-[10px] uppercase font-sans tracking-wide">$10 - $49</TableHead>
                        <TableHead className="text-right text-[10px] uppercase font-sans tracking-wide">$50 - $99</TableHead>
                        <TableHead className="text-right text-[10px] uppercase font-sans tracking-wide">$100 - $199</TableHead>
                        <TableHead className="text-right text-[10px] uppercase font-sans tracking-wide">$200+</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                       {filteredRates.map((row) => (
                          <TableRow key={row.id} className={`group border-b border-rule hover:bg-bg-paper/20 ${selectedRateIds.includes(row.id) ? 'bg-lime/5' : ''}`}>
                            <TableCell className="w-10 text-center">
                              <input 
                                id={`chk-rate-row-${row.id}`}
                                type="checkbox" 
                                checked={selectedRateIds.includes(row.id)}
                                onChange={() => handleToggleSelectRate(row.id)}
                                className="rounded-sm bg-bg-paper border-rule accent-lime w-3.5 h-3.5 cursor-pointer" 
                              />
                            </TableCell>
                            <TableCell className="font-semibold text-[12px] text-cream font-sans">{row.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="h-5 px-1.5 text-[9px] bg-bg-paper border-rule text-stone font-mono uppercase">{row.rules}</Badge>
                            </TableCell>
                            <TableCell className="text-right p-1 py-1">
                               <CellInput value={row.r1} onChange={(val) => handleCellEdit(row.id, "r1", val)} />
                            </TableCell>
                            <TableCell className="text-right p-1 py-1">
                               <CellInput value={row.r2} onChange={(val) => handleCellEdit(row.id, "r2", val)} />
                            </TableCell>
                            <TableCell className="text-right p-1 py-1">
                               <CellInput value={row.r3} onChange={(val) => handleCellEdit(row.id, "r3", val)} />
                            </TableCell>
                            <TableCell className="text-right p-1 py-1">
                               <CellInput value={row.r4} onChange={(val) => handleCellEdit(row.id, "r4", val)} />
                            </TableCell>
                          </TableRow>
                       ))}
                       {filteredRates.length === 0 && (
                          <TableRow>
                             <TableCell colSpan={7} className="py-8 text-center text-xs text-stone font-sans">
                                No rate sheets match the selected filter query.
                             </TableCell>
                          </TableRow>
                       )}
                    </TableBody>
                  </Table>
              </div>
           </div>
        )}
        
        {/* 3. Rate History Tab Pane */}
        {activeTab === "RATE HISTORY" && (
           <div className="flex flex-col flex-1 min-h-0 bg-bg-base">
              <div className="overflow-y-auto flex-1 p-0 relative">
                  <Table>
                    <TableHeader className="sticky top-0 bg-bg-elev shadow-[0_1px_0_var(--color-rule)] z-10">
                      <TableRow className="hover:bg-transparent border-none">
                        <TableHead className="text-[10px] uppercase font-sans tracking-wide">Date & Timestamp</TableHead>
                        <TableHead className="text-[10px] uppercase font-sans tracking-wide">Asset Class</TableHead>
                        <TableHead className="text-[10px] uppercase font-sans tracking-wide">Change Summary</TableHead>
                        <TableHead className="text-[10px] uppercase font-sans tracking-wide">Audited Actor</TableHead>
                        <TableHead className="text-[10px] uppercase font-sans tracking-wide font-medium">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                       {[
                         { date: "Dec 02, 10:14 AM", asset: "Amazon Digital US ($50+)", change: "1,200 -> 1,180", actor: "Sunday O.", status: "Active" },
                         { date: "Dec 01, 14:30 PM", asset: "Steam Physical US ($100+)", change: "1,400 -> 1,350", actor: "System Agent", status: "Reverted" },
                         { date: "Nov 28, 08:00 AM", asset: "Apple iTunes UK (All)", change: "1,100 -> 1,250", actor: "Ngozi A.", status: "Active" },
                       ].map((row, i) => (
                         <TableRow key={i} className="group hover:bg-bg-paper">
                           <TableCell className="font-mono text-[10px] text-stone">{row.date}</TableCell>
                           <TableCell className="font-semibold text-[12px] text-cream">{row.asset}</TableCell>
                           <TableCell className="font-mono text-[10px] text-lime font-medium">{row.change}</TableCell>
                           <TableCell className="text-xs text-stone font-sans">{row.actor}</TableCell>
                           <TableCell>
                             <Badge variant={row.status === 'Active' ? 'success' : 'secondary'} className="text-[8px] uppercase">
                               {row.status}
                             </Badge>
                           </TableCell>
                         </TableRow>
                       ))}
                    </TableBody>
                  </Table>
              </div>
           </div>
        )}

        {/* 4. Fraud Rules Tab Pane */}
        {activeTab === "FRAUD RULES" && (
           <div className="flex flex-col flex-1 min-h-0 bg-bg-base p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {fraudRules.map((rule) => {
                    const isEnforcing = rule.status === "Enforcing"
                    const badgeVariant = isEnforcing ? "success" : "secondary"
                    return (
                       <div 
                          key={rule.id} 
                          id={`fraud-rule-card-${rule.id}`} 
                          className="bg-bg-paper border border-rule/60 rounded-md p-4 flex flex-col justify-between hover:border-lime/20 transition-all duration-200"
                       >
                          <div>
                             <h3 className="text-xs font-semibold text-cream mb-1 uppercase tracking-wider font-sans">{rule.title}</h3>
                             <p className="text-[10px] text-stone leading-relaxed mb-4">{rule.desc}</p>
                             <div className="border-t border-rule/30 my-2 py-1.5 space-y-1 font-mono text-[9px] text-stone">
                                <div className="flex justify-between"><span>Scope Scope:</span><span className="text-cream">{rule.scope}</span></div>
                                <div className="flex justify-between"><span>Threshold Threshold:</span><span className="text-lime font-bold">{rule.threshold}</span></div>
                             </div>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-rule/40 mt-1">
                             <Badge variant={badgeVariant} className="text-[8px] uppercase px-1.5 font-bold">
                                {rule.status}
                             </Badge>
                             <span 
                                id={`btn-config-fraud-${rule.id}`}
                                onClick={() => handleOpenConfigureRule(rule)} 
                                className="text-[10px] text-stone hover:text-lime cursor-pointer underline font-medium transition-colors"
                             >
                                Configure
                             </span>
                          </div>
                       </div>
                    )
                 })}
              </div>
           </div>
        )}

      </Card>

      {/* OVERLAY MODAL: Add Brand Modal */}
      {showAddBrandModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-base/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-bg-elev border border-rule-strong rounded-md p-5 max-w-sm w-full space-y-4 shadow-2xl relative font-sans">
               <button 
                  onClick={() => setShowAddBrandModal(false)}
                  className="absolute top-4 right-4 text-stone hover:text-cream cursor-pointer"
               >
                  <X className="w-4 h-4" />
               </button>
               
               <div className="flex items-center gap-2 text-lime font-display font-semibold tracking-wide text-xs border-b border-rule pb-2 text-cream uppercase">
                  <Sparkles className="w-4 h-4 text-lime" /> Create Custom Brand Asset
               </div>
               
               <form onSubmit={handleAddBrandSubmit} className="space-y-3.5">
                  <div>
                     <label className="text-[10px] text-stone mb-1.5 block uppercase tracking-wide">Brand Display Name</label>
                     <Input 
                        id="b-input-name"
                        type="text"
                        required
                        placeholder="e.g. Google Play"
                        value={bName}
                        onChange={e => setBName(e.target.value)}
                        className="h-8.5 text-xs border-rule focus-visible:ring-lime"
                     />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                     <div>
                        <label className="text-[10px] text-stone mb-1.5 block uppercase tracking-wide">Logo Initials</label>
                        <Input 
                           id="b-input-logo"
                           type="text"
                           required
                           maxLength={4}
                           placeholder="e.g. GPL"
                           value={bLogo}
                           onChange={e => setBLogo(e.target.value)}
                           className="h-8.5 text-xs font-mono uppercase border-rule focus-visible:ring-lime"
                        />
                     </div>
                     <div>
                        <label className="text-[10px] text-stone mb-1.5 block uppercase tracking-wide flex justify-between">Types Count</label>
                        <Input 
                           id="b-input-types"
                           type="number"
                           min={1}
                           value={bActiveTypes}
                           onChange={e => setBActiveTypes(Number(e.target.value))}
                           className="h-8.5 text-xs border-rule focus-visible:ring-lime"
                        />
                     </div>
                  </div>

                  <div>
                     <label className="text-[10px] text-stone mb-1.5 block uppercase tracking-wide">Supported Countries (Comma Sep)</label>
                     <Input 
                        id="b-input-countries"
                        type="text"
                        placeholder="US, UK, EUR"
                        value={bCountries}
                        onChange={e => setBCountries(e.target.value)}
                        className="h-8.5 text-xs border-rule focus-visible:ring-lime font-mono"
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-3 items-end">
                     <div>
                        <label className="text-[10px] text-stone mb-1.5 block uppercase tracking-wide">Initial Status</label>
                        <CustomSelect 
                           id="form-brand-status"
                           value={bStatus}
                           onChange={setBStatus}
                           options={formStatusOptions}
                           placeholder="Select Status"
                        />
                     </div>
                     <div>
                        <label className="text-[10px] text-stone mb-1.5 block uppercase tracking-wide">Asset Color Code</label>
                        <Input 
                           id="b-input-color"
                           type="text"
                           value={bColor}
                           onChange={e => setBColor(e.target.value)}
                           className="h-8.5 text-xs font-mono border-rule focus-visible:ring-lime"
                        />
                     </div>
                  </div>

                  {/* Quick Preset Colors picker with dynamic border highlights according to selection */}
                  <div>
                     <label className="text-[9px] text-stone mb-1 block uppercase tracking-wide">Aura Preset Color Selector</label>
                     <div className="flex gap-2 flex-wrap bg-bg-base/60 p-2 border border-rule rounded-sm justify-between">
                        {PRESET_COLORS.map(c => (
                           <button
                              key={c}
                              type="button"
                              onClick={() => setBColor(c)}
                              style={{ backgroundColor: c, border: bColor === c ? "2px solid #ffffff" : "1px solid var(--color-rule-strong)" }}
                              className="w-5.5 h-5.5 rounded-full cursor-pointer hover:scale-110 active:scale-95 transition-all"
                           />
                        ))}
                     </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                     <Button type="submit" id="btn-submit-brand-add" className="flex-1 h-8 text-[11px] font-sans font-bold uppercase bg-lime hover:bg-lime/90 text-bg-base">
                        Save Asset
                     </Button>
                     <Button type="button" variant="ghost" className="h-8 text-[11px] font-medium" onClick={() => setShowAddBrandModal(false)}>
                        Cancel
                     </Button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* OVERLAY MODAL: Edit Brand Config Modal */}
      {editingBrand && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-base/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-bg-elev border border-rule-strong rounded-md p-5 max-w-sm w-full space-y-4 shadow-2xl relative font-sans">
               <button 
                  onClick={() => setEditingBrand(null)}
                  className="absolute top-4 right-4 text-stone hover:text-cream cursor-pointer"
               >
                  <X className="w-4 h-4" />
               </button>
               
               <div className="flex items-center gap-2 font-display font-semibold tracking-wide text-xs border-b border-rule pb-2 text-cream uppercase">
                  <Settings className="w-4 h-4 text-stone shrink-0" /> Edit Asset Config: <span className="text-lime">{editingBrand.name}</span>
               </div>
               
               <form onSubmit={handleEditBrandSubmit} className="space-y-3.5">
                  <div>
                     <label className="text-[10px] text-stone mb-1.5 block uppercase tracking-wide">Brand Title</label>
                     <Input 
                        id="b-edit-name"
                        type="text"
                        required
                        value={bName}
                        onChange={e => setBName(e.target.value)}
                        className="h-8.5 text-xs border-rule focus-visible:ring-lime"
                     />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                     <div>
                        <label className="text-[10px] text-stone mb-1.5 block uppercase tracking-wide">Logo tag</label>
                        <Input 
                           id="b-edit-logo"
                           type="text"
                           required
                           maxLength={4}
                           value={bLogo}
                           onChange={e => setBLogo(e.target.value)}
                           className="h-8.5 text-xs font-mono uppercase border-rule focus-visible:ring-lime"
                        />
                     </div>
                     <div>
                        <label className="text-[10px] text-stone mb-1.5 block uppercase tracking-wide">Active Types</label>
                        <Input 
                           id="b-edit-types"
                           type="number"
                           min={1}
                           value={bActiveTypes}
                           onChange={e => setBActiveTypes(Number(e.target.value))}
                           className="h-8.5 text-xs border-rule focus-visible:ring-lime"
                        />
                     </div>
                  </div>

                  <div>
                     <label className="text-[10px] text-stone mb-1.5 block uppercase tracking-wide">Regions Coverage</label>
                     <Input 
                        id="b-edit-countries"
                        type="text"
                        value={bCountries}
                        onChange={e => setBCountries(e.target.value)}
                        className="h-8.5 text-xs border-rule focus-visible:ring-lime font-mono"
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-3 items-end">
                     <div>
                        <label className="text-[10px] text-stone mb-1.5 block uppercase tracking-wide">Status Aura</label>
                        <CustomSelect 
                           id="form-brand-edit-status"
                           value={bStatus}
                           onChange={setBStatus}
                           options={formStatusOptions}
                           placeholder="Select Status"
                        />
                     </div>
                     <div>
                        <label className="text-[10px] text-stone mb-1.5 block uppercase tracking-wide">Hex Color Aura</label>
                        <Input 
                           id="b-edit-color"
                           type="text"
                           value={bColor}
                           onChange={e => setBColor(e.target.value)}
                           className="h-8.5 text-xs font-mono border-rule focus-visible:ring-lime"
                        />
                     </div>
                  </div>

                  {/* Preset Colors with dynamic outline highlight ring match */}
                  <div>
                     <label className="text-[9px] text-stone mb-1 block uppercase tracking-wide">Aura Preset Color Selector</label>
                     <div className="flex gap-2 flex-wrap bg-bg-base/60 p-2 border border-rule rounded-sm justify-between">
                        {PRESET_COLORS.map(c => (
                           <button
                              key={c}
                              type="button"
                              onClick={() => setBColor(c)}
                              style={{ backgroundColor: c, border: bColor === c ? "2px solid #ffffff" : "1px solid var(--color-rule-strong)" }}
                              className="w-5.5 h-5.5 rounded-full cursor-pointer hover:scale-110 active:scale-95 transition-all"
                           />
                        ))}
                     </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                     <Button type="submit" id="btn-submit-brand-edit" className="flex-1 h-8 text-[11px] font-sans font-bold uppercase bg-lime hover:bg-lime/90 text-bg-base">
                        Apply Changes
                     </Button>
                     <Button type="button" variant="ghost" className="h-8 text-[11px] font-medium" onClick={() => setEditingBrand(null)}>
                        Cancel
                     </Button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* OVERLAY MODAL: Configure Fraud Rule Modal */}
      {configuringRule && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-base/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-bg-elev border border-rule-strong rounded-md p-5 max-w-sm w-full space-y-4 shadow-2xl relative font-sans text-cream">
               <button 
                  id="btn-close-config-rule"
                  onClick={() => setConfiguringRule(null)}
                  className="absolute top-4 right-4 text-stone hover:text-cream cursor-pointer"
               >
                  <X className="w-4 h-4" />
               </button>
               
               <div className="flex items-center gap-2 font-display font-semibold tracking-wide text-xs border-b border-rule pb-2 text-cream uppercase">
                  <ShieldAlert className="w-4.5 h-4.5 text-lime shrink-0" /> Configure Rule: <span className="text-lime">{ruleTitle}</span>
               </div>
               
               <form onSubmit={handleSaveRuleConfig} className="space-y-3.5">
                  <div className="text-[10px] text-stone leading-relaxed bg-bg-base border border-rule/50 p-2 rounded">
                     {ruleDesc}
                  </div>
                  
                  <div>
                     <label className="text-[10px] text-stone mb-1.5 block uppercase tracking-wide">Target Scope SEGMENT</label>
                     <CustomSelect 
                        id="config-rule-scope"
                        value={ruleScope}
                        onChange={setRuleScope}
                        options={[
                           { value: "All Brands", label: "All Active Brands" },
                           ...brands.map(b => ({
                              value: b.name,
                              label: b.name,
                              color: b.color || "#84cc16",
                              bgColor: `${b.color || "#84cc16"}15`
                           }))
                        ]}
                        placeholder="Select Scope"
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-3 items-end">
                     <div>
                        <label className="text-[10px] text-stone mb-1.5 block uppercase tracking-wide font-medium">Action Status</label>
                        <CustomSelect 
                           id="config-rule-status"
                           value={ruleStatus}
                           onChange={setRuleStatus}
                           options={[
                              { value: "Enforcing", label: "Active Enforcing", color: "#84cc16", bgColor: "rgba(132,204,22,0.15)" },
                              { value: "Audit Only", label: "Write Logs (Audit Only)", color: "#f59e0b", bgColor: "rgba(245,158,11,0.15)" },
                              { value: "Disabled (Beta)", label: "Disabled (Beta)", color: "#78716c", bgColor: "rgba(120,113,108,0.15)" }
                           ]}
                           placeholder="Select Status"
                        />
                     </div>
                     <div>
                        <label className="text-[10px] text-stone mb-1.5 block uppercase tracking-wide">Threshold value</label>
                        <Input 
                           id="config-rule-threshold"
                           type="text"
                           value={ruleThreshold}
                           onChange={e => setRuleThreshold(e.target.value)}
                           placeholder="e.g. 500 or N/A"
                           className="h-8.5 text-xs font-mono border-rule focus-visible:ring-lime"
                        />
                     </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                     <Button type="submit" id="btn-submit-save-rule" className="flex-1 h-8 text-[11px] font-sans font-bold uppercase bg-lime hover:bg-lime/90 text-bg-base">
                        Save Ruleset config
                     </Button>
                     <Button type="button" variant="ghost" className="h-8 text-[11px] font-medium" onClick={() => setConfiguringRule(null)}>
                        Cancel
                     </Button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* OVERLAY MODAL: Schedule Shift Modal */}
      {showScheduleShiftModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-base/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-bg-elev border border-rule-strong rounded-md p-5 max-w-xl w-full space-y-4 shadow-2xl relative font-sans text-cream">
               <button 
                  id="btn-close-schedule-modal"
                  onClick={() => setShowScheduleShiftModal(false)}
                  className="absolute top-4 right-4 text-stone hover:text-cream cursor-pointer"
               >
                  <X className="w-4 h-4" />
               </button>
               
               <div className="flex items-center gap-2 font-display font-semibold tracking-wide text-xs border-b border-rule pb-2 text-cream uppercase">
                  <CalendarClock className="w-4 h-4 text-lime shrink-0" /> Manage Shifts & Active Multipliers
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Left Column: List of Current active schedule shifts */}
                  <div className="space-y-3">
                     <h4 className="text-[10px] text-stone uppercase tracking-wider font-semibold">Active Scheduled Multipliers</h4>
                     <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                        {shifts.map((sh) => {
                           const brObj = brands.find(b => b.name === sh.brand) || { color: "#84cc16" }
                           return (
                              <div key={sh.id} className="bg-bg-base border border-rule/50 rounded p-2.5 flex items-center justify-between gap-1.5 transition-all hover:bg-bg-paper text-xs">
                                 <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 font-sans font-medium">
                                       <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: brObj.color }} />
                                       <span className="truncate text-cream font-semibold">{sh.shiftName}</span>
                                    </div>
                                    <div className="text-[10px] text-stone font-mono mt-0.5 flex items-center gap-1.5">
                                       <span style={{ color: brObj.color }} className="font-bold">{sh.brand}</span>
                                       <span>•</span>
                                       <span>{sh.startTime} - {sh.endTime}</span>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-lime-tint text-lime border border-lime/20">{sh.multiplier}</span>
                                    <button 
                                       onClick={() => {
                                          setShifts(prev => prev.filter(x => x.id !== sh.id))
                                          showToast(`Deleted scheduled shift: ${sh.shiftName}`)
                                       }}
                                       className="text-stone hover:text-bad cursor-pointer p-0.5 rounded hover:bg-bg-base transition-colors"
                                       title="Remove scheduled shift"
                                    >
                                       <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                 </div>
                              </div>
                           )
                        })}
                        {shifts.length === 0 && (
                           <div className="text-center py-10 border border-dashed border-rule/80 rounded flex flex-col items-center justify-center text-xs text-stone">
                              <CalendarClock className="w-8 h-8 text-stone/30 mb-2" />
                              No active shifts scheduled.
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Right Column: Schedule shift creation form */}
                  <form onSubmit={(e) => {
                     e.preventDefault()
                     if (!shName.trim()) {
                        showToast("Please provide a name for the shift profile.")
                        return
                     }
                     const newSh = {
                        id: "sh_" + Date.now(),
                        brand: shBrand,
                        shiftName: shName,
                        startTime: shStart,
                        endTime: shEnd,
                        multiplier: shMultiplier,
                        status: shStatus
                     }
                     setShifts(prev => [...prev, newSh])
                     setShName("")
                     showToast(`Successfully scheduled shift: ${newSh.shiftName}`)
                  }} className="space-y-3 border-t md:border-t-0 md:border-l border-rule/80 pt-4 md:pt-0 md:pl-4">
                     <h4 className="text-[10px] text-stone uppercase tracking-wider font-semibold">Schedule New Shift Slot</h4>
                     
                     <div className="space-y-3">
                        <div>
                           <label className="text-[9px] text-stone mb-1 block uppercase tracking-wide">Shift Label Profile</label>
                           <Input 
                              id="sh-input-name"
                              type="text"
                              required
                              placeholder="e.g. Black Friday Spike"
                              value={shName}
                              onChange={e => setShName(e.target.value)}
                              className="h-8 text-xs border-rule focus-visible:ring-lime text-cream"
                           />
                        </div>

                        <div>
                           <label className="text-[9px] text-stone mb-1 block uppercase tracking-wide">Target Asset Brand</label>
                           <CustomSelect 
                              id="sh-input-brand"
                              value={shBrand}
                              onChange={setShBrand}
                              options={brands.map(b => ({
                                 value: b.name,
                                 label: b.name,
                                 color: b.color || "#84cc16",
                                 bgColor: `${b.color || "#84cc16"}15`
                              }))}
                              placeholder="Choose Brand"
                           />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                           <div>
                              <label className="text-[9px] text-stone mb-1 block uppercase tracking-wide font-mono">Starts At</label>
                              <Input 
                                 id="sh-input-start"
                                 type="text" 
                                 placeholder="e.g. 21:00"
                                 value={shStart}
                                 onChange={e => setShStart(e.target.value)}
                                 className="h-8 text-xs border-rule font-mono text-cream" 
                              />
                           </div>
                           <div>
                              <label className="text-[9px] text-stone mb-1 block uppercase tracking-wide font-mono">Ends At</label>
                              <Input 
                                 id="sh-input-end"
                                 type="text" 
                                 placeholder="e.g. 05:00"
                                 value={shEnd}
                                 onChange={e => setShEnd(e.target.value)}
                                 className="h-8 text-xs border-rule font-mono text-cream" 
                              />
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 items-end">
                           <div>
                              <label className="text-[9px] text-stone mb-1 block uppercase tracking-wide font-mono animate-fade-in text-[10px]">Multiplier</label>
                              <Input 
                                 id="sh-input-multiplier"
                                 type="text" 
                                 placeholder="e.g. +3.5%"
                                 value={shMultiplier}
                                 onChange={e => setShMultiplier(e.target.value)}
                                 className="h-8 text-xs border-rule font-mono text-cream" 
                              />
                           </div>
                           <div>
                              <Button type="submit" id="btn-submit-shift-add" className="w-full h-8 text-[10px] font-sans font-bold uppercase bg-lime hover:bg-lime/90 text-bg-base">
                                 Add Slot
                              </Button>
                           </div>
                        </div>
                     </div>
                  </form>
               </div>

               <div className="flex justify-end pt-2 border-t border-rule mt-2">
                  <Button type="button" variant="ghost" className="h-8 text-[11px] font-medium text-stone hover:text-cream" onClick={() => setShowScheduleShiftModal(false)}>
                     Close shifts panel
                  </Button>
               </div>
            </div>
         </div>
      )}

      {/* Floating active toast notification */}
      {toast && (
        <div id="toast-message-gcinv" className="fixed bottom-4 right-4 bg-lime text-bg-base font-bold text-xs px-4 py-3 rounded shadow-lg flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
           <Check className="w-4 h-4 text-bg-base stroke-[3]" />
           {toast}
         </div>
      )}
    </div>
  )
}

function CellInput({ value, onChange }: { value: string; onChange: (val: string) => void }) {
   if (value === "-") return <div className="text-stone/50 text-[11px] pr-3 border border-transparent select-none">-</div>
   return (
      <Input 
         value={value}
         onChange={e => onChange(e.target.value)}
         className="w-[80px] h-7 text-right font-mono text-[11px] ml-auto bg-transparent border-transparent hover:border-rule focus-visible:border-lime focus-visible:ring-0 group-hover:bg-bg-paper transition-all"
      />
   )
}
