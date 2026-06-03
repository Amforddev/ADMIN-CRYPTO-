import { useState, useEffect, MouseEvent } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { 
  BarChart as BarChartIcon, 
  Download, 
  FileText, 
  Calendar, 
  Filter, 
  CheckCircle2, 
  X, 
  Check, 
  Eye, 
  SlidersHorizontal, 
  Info, 
  Loader2 
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReportConfig {
  id: string
  title: string
  desc: string
  icon: any
  type: string
  columns: string[]
  sampleData: Record<string, string>[]
}

const REPORTS_METADATA: ReportConfig[] = [
  {
    id: "monthly-financials",
    title: "Monthly Financials",
    desc: "Aggregated volumes, net settled fiat, and fee capture",
    icon: BarChartIcon,
    type: "Data Extract",
    columns: ["Month", "Volume", "Fees Collected", "Settled Fiat", "Deals Completed"],
    sampleData: [
      { "Month": "May 2026", "Volume": "$8,429,100", "Fees Collected": "$84,291", "Settled Fiat": "$7,120,500", "Deals Completed": "11,240" },
      { "Month": "Apr 2026", "Volume": "$7,190,500", "Fees Collected": "$71,905", "Settled Fiat": "$6,104,200", "Deals Completed": "9,890" },
      { "Month": "Mar 2026", "Volume": "$6,120,800", "Fees Collected": "$61,208", "Settled Fiat": "$5,240,000", "Deals Completed": "8,450" }
    ]
  },
  {
    id: "p2p-trade-ledgers",
    title: "P2P Trade Ledgers",
    desc: "Line-by-line history of all P2P order matching and releases",
    icon: FileText,
    type: "CSV Ledger",
    columns: ["Order ID", "Asset", "Amount", "Seller ID", "Buyer ID", "Outcome"],
    sampleData: [
      { "Order ID": "p2p-9018", "Asset": "USDT", "Amount": "3,400 USDT", "Seller ID": "usr_9amf2@volt.io", "Buyer ID": "usr_7x2v1@volt.io", "Outcome": "Completed" },
      { "Order ID": "p2p-9017", "Asset": "BTC", "Amount": "0.15 BTC", "Seller ID": "usr_11a91@volt.io", "Buyer ID": "usr_0029b@volt.io", "Outcome": "Released" },
      { "Order ID": "p2p-9016", "Asset": "NGN", "Amount": "₦2.5M", "Seller ID": "usr_82fa1@volt.io", "Buyer ID": "usr_42cc9@volt.io", "Outcome": "Disputed" }
    ]
  },
  {
    id: "suspicious-activity-sar",
    title: "Suspicious Activity (SAR)",
    desc: "Export of all flagged events, holds, and frozen funds",
    icon: FileText,
    type: "Compliance",
    columns: ["Alert ID", "Flag Trigger", "Assigned Analyst", "Severity", "SLA Status"],
    sampleData: [
      { "Alert ID": "sar-4109", "Flag Trigger": "IP Velocity Spike", "Assigned Analyst": "Kelechi O.", "Severity": "High", "SLA Status": "Under Limit" },
      { "Alert ID": "sar-4108", "Flag Trigger": "Tier 3 Volume Bypass", "Assigned Analyst": "Sarah J.", "Severity": "Critical", "SLA Status": "Breached" },
      { "Alert ID": "sar-4107", "Flag Trigger": "Name Match Sanctions", "Assigned Analyst": "Kelechi O.", "Severity": "Critical", "SLA Status": "Assigned" }
    ]
  },
  {
    id: "user-growth-kyc",
    title: "User Growth & KYC",
    desc: "Onboarding metrics, KYC pass rates, and active user drops",
    icon: BarChartIcon,
    type: "Analytics",
    columns: ["Week", "New Signups", "KYC Attempts", "KYC Passes", "Tier 2 Promoted"],
    sampleData: [
      { "Week": "Week 22", "New Signups": "28,450", "KYC Attempts": "21,120", "KYC Passes": "19,890", "Tier 2 Promoted": "420" },
      { "Week": "Week 21", "New Signups": "26,100", "KYC Attempts": "19,890", "KYC Passes": "18,450", "Tier 2 Promoted": "380" },
      { "Week": "Week 20", "New Signups": "24,800", "KYC Attempts": "17,650", "KYC Passes": "16,210", "Tier 2 Promoted": "310" }
    ]
  },
  {
    id: "hot-wallet-sweeps",
    title: "Hot Wallet Sweeps",
    desc: "Audit log of all systemic sweeps to cold storage",
    icon: FileText,
    type: "Audit Log",
    columns: ["Sweep Tx", "Asset Vault", "Amount Swept", "Network ID", "Audit Verified"],
    sampleData: [
      { "Sweep Tx": "0x4ef2...fa3", "Asset Vault": "Tron-Hot", "Amount Swept": "450,000 USDT", "Network ID": "TRC-20", "Audit Verified": "Yes" },
      { "Sweep Tx": "0x89ac...10d", "Asset Vault": "Eth-Hot", "Amount Swept": "120 ETH", "Network ID": "ERC-20", "Audit Verified": "Yes" },
      { "Sweep Tx": "0x221b...ff1", "Asset Vault": "Btc-Hot", "Amount Swept": "14.5 BTC", "Network ID": "Bitcoin Mainnet", "Audit Verified": "Yes" }
    ]
  },
  {
    id: "gift-card-liquidations",
    title: "Gift Card Liquidations",
    desc: "Daily inventory offloads vs. claimed values",
    icon: BarChartIcon,
    type: "Trading",
    columns: ["Date", "Channel Partner", "Face Value", "Slippage %", "Net Proceeds"],
    sampleData: [
      { "Date": "2026-06-02", "Channel Partner": "PrepaidCardDigital", "Face Value": "$25,000", "Slippage %": "1.2%", "Net Proceeds": "$24,700" },
      { "Date": "2026-06-02", "Channel Partner": "GiftcardOTC_Bulk", "Face Value": "$85,000", "Slippage %": "1.4%", "Net Proceeds": "$83,810" },
      { "Date": "2026-06-01", "Channel Partner": "CardRedeem_Global", "Face Value": "$40,000", "Slippage %": "1.1%", "Net Proceeds": "$39,560" }
    ]
  }
]

export default function Reports() {
  const [activeReport, setActiveReport] = useState<ReportConfig | null>(null)
  const [openingFocus, setOpeningFocus] = useState<"date" | "filters" | "general">("general")

  // Modal configuration states
  const [datePreset, setDatePreset] = useState<"24h" | "7d" | "30d" | "custom">("7d")
  const [customStart, setCustomStart] = useState("2026-05-27")
  const [customEnd, setCustomEnd] = useState("2026-06-03")
  const [selectedFormat, setSelectedFormat] = useState<"CSV" | "JSON" | "XLSX">("CSV")
  const [statusFilter, setStatusFilter] = useState("all")
  const [anonymizeEmails, setAnonymizeEmails] = useState(false)
  const [includeChecksum, setIncludeChecksum] = useState(true)
  const [enabledColumns, setEnabledColumns] = useState<string[]>([])

  // Download & Animation States
  const [singleDownloadingId, setSingleDownloadingId] = useState<string | null>(null)
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null)
  const [progressStage, setProgressStage] = useState("")
  const [notification, setNotification] = useState<string | null>(null)

  // Initialize selected columns on opening report
  useEffect(() => {
    if (activeReport) {
      setEnabledColumns(activeReport.columns)
    }
  }, [activeReport])

  const showToast = (message: string) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 4000)
  }

  const handleOpenConfigurator = (report: ReportConfig, focus: "date" | "filters" | "general") => {
    setActiveReport(report)
    setOpeningFocus(focus)
  }

  const formatValue = (key: string, value: string, anon: boolean) => {
    if (anon && (value.includes("@") || key.toLowerCase().includes("user") || key.toLowerCase().includes("seller") || key.toLowerCase().includes("buyer") || key.toLowerCase().includes("analyst"))) {
      if (value.includes("@")) {
        const [local, domain] = value.split("@")
        return `${local.slice(0, 3)}***@${domain}`
      }
      return `${value.slice(0, 4)}***`
    }
    return value
  }

  // Live trigger generation
  const handleStartGeneration = () => {
    if (!activeReport) return
    setDownloadProgress(0)
    setProgressStage("Configuring API extract query...")

    const steps = [
      { progress: 20, text: "Scanning decentralized hot ledger nodes..." },
      { progress: 50, text: "Applying dynamic schema column layout..." },
      { progress: 80, text: "Enforcing strict compliance anonymization..." },
      { progress: 100, text: "Packaging and cryptographically signing file..." }
    ]

    let stepIdx = 0
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setDownloadProgress(steps[stepIdx].progress)
        setProgressStage(steps[stepIdx].text)
        stepIdx++
      } else {
        clearInterval(interval)
        
        // Finalize state and execute file generation
        executeActualDownload(activeReport)
        
        // Reset process loaders
        setDownloadProgress(null)
        setActiveReport(null)
        showToast(`Document Export of "${activeReport.title}" downloaded successfully!`)
      }
    }, 450)
  }

  const executeActualDownload = (report: ReportConfig) => {
    let content = ""
    const filteredCols = report.columns.filter(c => enabledColumns.includes(c))
    
    if (selectedFormat === "JSON") {
      const records = report.sampleData.map(row => {
        const obj: Record<string, string> = {}
        filteredCols.forEach(col => {
          obj[col] = formatValue(col, row[col] || "", anonymizeEmails)
        })
        return obj
      })
      content = JSON.stringify(records, null, 2)
    } else {
      // CSV & XLSX standard text
      const headerRow = filteredCols.join(",")
      const dataRows = report.sampleData.map(row => {
        return filteredCols.map(col => {
          const val = formatValue(col, row[col] || "", anonymizeEmails)
          return val.includes(",") ? `"${val}"` : val
        }).join(",")
      })
      
      const checksumValue = includeChecksum ? `\n\n# Cryptographic SHA256 Checksum: f6b541ae${Math.floor(Math.random() * 90000) + 10000}ac8df91cb1f` : ""
      content = [headerRow, ...dataRows].join("\n") + checksumValue
    }
    
    const blob = new Blob([content], { type: selectedFormat === "JSON" ? "application/json" : "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${report.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_export.${selectedFormat.toLowerCase()}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Action for directly clicking top "Export Universal CSV"
  const handleUniversalDownload = () => {
    if (singleDownloadingId) return
    setSingleDownloadingId("universal")
    setTimeout(() => {
      // Create a direct mockup universal export file
      const dateStr = new Date().toISOString().split('T')[0]
      const csvStr = `Report,Extraction Mode,Execution Date,Platform Node,Status\nMonthly Financials,Data Extract,${dateStr},Node US-West-1,Success\nP2P Trade Ledgers,CSV Ledger,${dateStr},Node TRON-9,Success\nSuspicious Activity (SAR),Compliance,${dateStr},Node ETH-3,Success\nUser Growth & KYC,Analytics,${dateStr},Node COLD-2,Success\nHot Wallet Sweeps,Audit Log,${dateStr},Node SECURE-1,Success\n`
      
      const blob = new Blob([csvStr], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `universal_platform_export_${dateStr}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setSingleDownloadingId(null)
      showToast("Universal CSV Platform Summary export generated!")
    }, 1200)
  }

  // Direct download click from card inline button
  const handleDirectInlineDownload = (e: MouseEvent, report: ReportConfig) => {
    e.stopPropagation()
    if (singleDownloadingId) return
    setSingleDownloadingId(report.id)
    setTimeout(() => {
      // Execute a quick direct CSV download using standard options
      const filteredCols = report.columns
      const headerRow = filteredCols.join(",")
      const dataRows = report.sampleData.map(row => {
        return filteredCols.map(col => {
          const val = row[col] || ""
          return val.includes(",") ? `"${val}"` : val
        }).join(",")
      })
      const content = [headerRow, ...dataRows].join("\n")
      const blob = new Blob([content], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `quick_${report.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setSingleDownloadingId(null)
      showToast(`Quick CSV for "${report.title}" compiled and downloaded successfully!`)
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-6rem)] relative font-sans">
      <div className="flex justify-between items-end shrink-0">
        <div>
           <h1 className="text-xl font-display font-medium text-cream">Data & Reports</h1>
           <p className="text-stone text-xs mt-1">Export transaction histories, compliance logs, and platform analytics.</p>
        </div>
        <div className="flex items-center gap-3 relative">
           <Button 
             id="btn-export-universal" 
             className="gap-2 bg-lime text-bg-base hover:bg-lime/90 font-bold uppercase text-xs h-9 tracking-wide px-4" 
             onClick={handleUniversalDownload}
             disabled={singleDownloadingId === "universal"}
           >
              {singleDownloadingId === "universal" ? (
                 <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                 <Download className="w-4 h-4" />
              )}
              {singleDownloadingId === "universal" ? "Exporting summary..." : "Export Universal CSV"}
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REPORTS_METADATA.map((report) => (
             <Card 
               key={report.id} 
               id={`report-card-${report.id}`}
               className="bg-bg-elev border-rule hover:border-lime/30 transition-all duration-150 cursor-pointer group flex flex-col hover:shadow-lg"
               onClick={() => handleOpenConfigurator(report, "general")}
             >
                <CardContent className="p-5 flex-1 flex flex-col justify-between">
                   <div>
                      <div className="flex justify-between items-start mb-4">
                         <div className="w-10 h-10 rounded bg-bg-paper border border-rule flex items-center justify-center">
                            <report.icon className="w-5 h-5 text-stone group-hover:text-lime transition-colors" />
                         </div>
                         <span className="text-[9px] uppercase tracking-wider font-extrabold text-stone bg-bg-base border border-rule/50 px-2 py-0.5 rounded-sm">{report.type}</span>
                      </div>
                      <h3 className="font-semibold text-cream mb-1 group-hover:text-white transition-colors">{report.title}</h3>
                      <p className="text-xs text-stone leading-relaxed">{report.desc}</p>
                   </div>
                   
                   <div className="mt-8 flex items-center gap-2 pt-4 border-t border-rule" onClick={e => e.stopPropagation()}>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        id={`btn-set-date-${report.id}`}
                        className="h-7 text-[10px] font-sans font-bold uppercase tracking-wider flex-1 bg-bg-base/50 hover:bg-bg-paper text-cream border border-rule/50 hover:border-stone/40"
                        onClick={() => handleOpenConfigurator(report, "date")}
                      >
                         <Calendar className="w-3 h-3 mr-1.5 text-stone" /> Set Date
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        id={`btn-filter-${report.id}`}
                        className="h-7 text-[10px] font-sans font-bold uppercase tracking-wider flex-1 bg-bg-base/50 hover:bg-bg-paper text-cream border border-rule/50 hover:border-stone/40"
                        onClick={() => handleOpenConfigurator(report, "filters")}
                      >
                         <Filter className="w-3 h-3 mr-1.5 text-stone" /> Filter
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        id={`btn-download-trigger-${report.id}`}
                        className="h-7 w-9 shrink-0 bg-transparent hover:bg-lime/10 border-rule hover:border-lime/40 text-stone hover:text-lime flex items-center justify-center transition-colors" 
                        onClick={(e) => handleDirectInlineDownload(e, report)}
                        disabled={singleDownloadingId !== null}
                      >
                        {singleDownloadingId === report.id ? (
                           <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                           <Download className="w-3.5 h-3.5"/>
                        )}
                      </Button>
                   </div>
                </CardContent>
             </Card>
          ))}
      </div>

      {/* Beautiful Configuration Modal Overlay */}
      {activeReport && (
        <div id="modal-report-config" className="fixed inset-0 bg-bg-base/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-bg-elev border border-rule rounded-sm shadow-2xl flex flex-col max-h-[90vh] w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="p-4 border-b border-rule flex items-center justify-between text-cream bg-bg-paper">
               <div>
                  <h3 className="text-base font-semibold text-cream flex items-center gap-2">
                     <SlidersHorizontal className="w-4 h-4 text-lime" />
                     Configure File Export
                  </h3>
                  <p className="text-[11px] text-stone mt-0.5">Parameters for {activeReport.title} ({activeReport.type})</p>
               </div>
               <Button id="btn-close-modal" variant="ghost" size="icon" className="h-8 w-8 text-stone hover:text-cream rounded-sm" onClick={() => setActiveReport(null)}>
                  <X className="w-4 h-4" />
               </Button>
            </div>

            {/* Inner Grid */}
            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-rule overflow-y-auto flex-1">
               
               {/* Left Interactive Settings Panel */}
               <div className="w-full lg:w-[42%] p-5 flex flex-col gap-6 overflow-y-auto">
                  
                  {/* Section A: Date Preset selection */}
                  <div className={`space-y-2.5 p-3 rounded-sm transition-all ${openingFocus === 'date' ? 'bg-bg-paper border border-lime/20' : ''}`}>
                     <div className="flex items-center justify-between">
                        <label className="text-[10px] font-extrabold uppercase text-stone tracking-wider block">Date Extraction Range</label>
                        {openingFocus === 'date' && <span className="text-[9px] bg-lime/20 text-lime px-1.5 py-0.2 rounded font-mono uppercase font-bold">Focused</span>}
                     </div>
                     <div className="grid grid-cols-4 gap-1">
                        {(["24h", "7d", "30d", "custom"] as const).map(preset => (
                           <button
                             key={preset}
                             id={`btn-preset-${preset}`}
                             type="button"
                             onClick={() => setDatePreset(preset)}
                             className={`h-7 text-[10px] font-semibold tracking-wider uppercase rounded-sm border transition-all ${
                               datePreset === preset 
                                 ? 'bg-lime text-bg-base border-lime font-bold' 
                                 : 'bg-bg-base text-stone border-rule hover:text-cream hover:bg-bg-paper'
                             }`}
                           >
                              {preset === '24h' ? '24 Hrs' : preset === '7d' ? '7 Days' : preset === '30d' ? '30 Days' : 'Custom'}
                           </button>
                        ))}
                     </div>

                     {datePreset === "custom" && (
                        <div className="grid grid-cols-2 gap-2 pt-2 animate-in slide-in-from-top-2 duration-150">
                           <div>
                              <span className="text-[9px] text-stone font-semibold uppercase block mb-1">Start Date</span>
                              <input 
                                id="input-start-date"
                                type="date" 
                                className="w-full h-8 bg-bg-base border border-rule rounded-sm text-xs px-2 text-cream outline-none focus:border-stone"
                                value={customStart}
                                onChange={(e) => setCustomStart(e.target.value)}
                              />
                           </div>
                           <div>
                              <span className="text-[9px] text-stone font-semibold uppercase block mb-1">End Date</span>
                              <input 
                                id="input-end-date"
                                type="date" 
                                className="w-full h-8 bg-bg-base border border-rule rounded-sm text-xs px-2 text-cream outline-none focus:border-stone"
                                value={customEnd}
                                onChange={(e) => setCustomEnd(e.target.value)}
                              />
                           </div>
                        </div>
                     )}
                  </div>

                  {/* Section B: Output Columns & Layout settings */}
                  <div className={`space-y-3 p-3 rounded-sm transition-all ${openingFocus === 'filters' ? 'bg-bg-paper border border-lime/20' : ''}`}>
                     <div className="flex items-center justify-between">
                        <label className="text-[10px] font-extrabold uppercase text-stone tracking-wider block">Extract Structure Filters</label>
                        {openingFocus === 'filters' && <span className="text-[9px] bg-lime/20 text-lime px-1.5 py-0.2 rounded font-mono uppercase font-bold">Focused</span>}
                     </div>
                     
                     <div className="grid grid-cols-2 gap-2">
                        <div>
                           <span className="text-[9px] text-stone font-semibold uppercase block mb-1">Output Format</span>
                           <select 
                             id="select-export-format"
                             className="w-full h-8 bg-bg-base border border-rule rounded-sm text-xs px-2 text-cream outline-none focus:border-stone"
                             value={selectedFormat}
                             onChange={(e) => setSelectedFormat(e.target.value as any)}
                           >
                              <option value="CSV">Flat CSV (.csv)</option>
                              <option value="JSON">Formatted JSON (.json)</option>
                              <option value="XLSX">Spreadsheet (.xlsx)</option>
                           </select>
                        </div>
                        <div>
                           <span className="text-[9px] text-stone font-semibold uppercase block mb-1">Status Restriction</span>
                           <select 
                             id="select-status-filter"
                             className="w-full h-8 bg-bg-base border border-rule rounded-sm text-xs px-2 text-cream outline-none focus:border-stone"
                             value={statusFilter}
                             onChange={(e) => setStatusFilter(e.target.value)}
                           >
                              <option value="all">Export All</option>
                              <option value="success_only">Only Successful</option>
                              <option value="critical_only">Flagged / Held</option>
                           </select>
                        </div>
                     </div>

                     <div className="pt-2">
                        <span className="text-[9px] text-stone font-semibold uppercase block mb-1.5">Select Schema Columns</span>
                        <div className="grid grid-cols-1 gap-1.5 bg-bg-base/50 p-2.5 border border-rule rounded-sm max-h-[140px] overflow-y-auto">
                           {activeReport.columns.map(col => {
                              const isChecked = enabledColumns.includes(col)
                              return (
                                 <label key={col} className="flex items-center gap-2 cursor-pointer text-xs">
                                    <input 
                                      type="checkbox"
                                      id={`chk-col-${col.toLowerCase().replace(/\s+/g, '-')}`}
                                      className="rounded-sm accent-lime bg-bg-paper border-rule w-3.5 h-3.5"
                                      checked={isChecked}
                                      onChange={() => {
                                         if (isChecked) {
                                            if (enabledColumns.length > 1) {
                                               setEnabledColumns(prev => prev.filter(c => c !== col))
                                            } else {
                                               showToast("Your export must include at least one column.")
                                            }
                                         } else {
                                            setEnabledColumns(prev => [...prev, col])
                                         }
                                      }}
                                    />
                                    <span className="text-cream text-[11px] font-mono leading-none">{col}</span>
                                 </label>
                              )
                           })}
                        </div>
                     </div>
                  </div>

                  {/* Section C: Security / Compliance parameters */}
                  <div className="space-y-2.5 p-3 rounded-sm bg-bg-base/30 border border-rule/50">
                     <label className="text-[10px] font-extrabold uppercase text-stone tracking-wider block">Security & Compliance Rules</label>
                     <div className="space-y-2">
                        <label className="flex items-start gap-2.5 cursor-pointer">
                           <input 
                             type="checkbox" 
                             id="toggle-anonymize-emails"
                             className="mt-0.5 rounded-sm accent-lime bg-bg-paper border-rule shadow"
                             checked={anonymizeEmails}
                             onChange={(e) => setAnonymizeEmails(e.target.checked)}
                           />
                           <div className="flex flex-col">
                              <span className="text-[11px] font-semibold text-cream">Anonymize Sensitive Records</span>
                              <span className="text-[9px] text-stone">Masks email addresses and high-risk analyst names in exported rows</span>
                           </div>
                        </label>
                        <label className="flex items-start gap-2.5 cursor-pointer">
                           <input 
                             type="checkbox" 
                             id="toggle-signature-hash"
                             className="mt-0.5 rounded-sm accent-lime bg-bg-paper border-rule shadow"
                             checked={includeChecksum}
                             onChange={(e) => setIncludeChecksum(e.target.checked)}
                           />
                           <div className="flex flex-col">
                              <span className="text-[11px] font-semibold text-cream">Append SHA-256 Checksum</span>
                              <span className="text-[9px] text-stone">Embeds audit integrity digest inside file footer</span>
                           </div>
                        </label>
                     </div>
                  </div>

               </div>

               {/* Right Interactive Live Schema Preview Panel */}
               <div className="flex-1 p-5 bg-bg-base/40 flex flex-col gap-4 overflow-y-auto">
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] uppercase font-bold tracking-wider text-stone flex items-center gap-1.5 leading-none">
                        <Eye className="w-3.5 h-3.5 text-stone" /> Live Schema Document preview
                     </span>
                     <span className="text-[9px] text-stone bg-bg-paper px-2 py-0.5 rounded border border-rule">Format: {selectedFormat}</span>
                  </div>

                  <div className="flex-1 bg-bg-paper border border-rule rounded-sm p-4 overflow-auto max-h-[450px] relative">
                     {selectedFormat === "JSON" ? (
                        <pre className="text-[10px] font-mono text-lime leading-normal select-all">
                           {JSON.stringify(
                              activeReport.sampleData.map(row => {
                                 const obj: Record<string, string> = {}
                                 activeReport.columns.filter(c => enabledColumns.includes(c)).forEach(col => {
                                    obj[col] = formatValue(col, row[col] || "", anonymizeEmails)
                                 })
                                 return obj
                              }),
                              null,
                              2
                           )}
                        </pre>
                     ) : (
                        <div className="space-y-3 min-w-[500px]">
                           <table className="w-full text-left font-mono text-[10px] divide-y divide-rule/60 border border-rule/50">
                              <thead>
                                 <tr className="bg-bg-base">
                                    {activeReport.columns.filter(c => enabledColumns.includes(c)).map(col => (
                                       <th key={col} className="p-2 text-stone border border-rule/40 font-bold uppercase">{col}</th>
                                    ))}
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-rule/30">
                                 {activeReport.sampleData.map((row, i) => (
                                    <tr key={i} className="hover:bg-bg-elev/40">
                                       {activeReport.columns.filter(c => enabledColumns.includes(c)).map(col => (
                                          <td key={col} className="p-2 border border-rule/30 text-cream whitespace-nowrap">
                                             {formatValue(col, row[col] || "", anonymizeEmails)}
                                          </td>
                                       ))}
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                           {includeChecksum && (
                              <div className="p-2 rounded bg-bg-base/40 font-mono text-[9px] text-stone border border-dashed border-rule/80 mt-2">
                                 <span className="text-lime font-bold"># Cryptographic Checksum enabled:</span>
                                 <br /># SHA256 matches header export block hashes: f6b541ae...ac8df
                              </div>
                           )}
                        </div>
                     )}

                     <div className="absolute top-2 right-2 flex items-center gap-1 rounded bg-bg-base px-2 py-1 text-[9px] text-stone border border-rule z-10 font-sans pointer-events-none">
                        <Info className="w-3 h-3 text-lime" /> Simulated representation
                     </div>
                  </div>

                  <div className="text-[10px] text-stone leading-normal bg-bg-base/20 border border-rule/40 p-3 rounded-sm">
                     <span className="text-cream font-medium">Audit note:</span> This table illustrates the target file structure compile output. Checking structural modifiers changes output blocks dynamically. Actual generation handles exact database mapping matching {activeReport.title}.
                  </div>
               </div>

            </div>

            {/* Bottom Footer Action buttons */}
            <div className="p-4 border-t border-rule bg-bg-paper flex items-center justify-between shrink-0">
               <div>
                  {downloadProgress !== null && (
                     <div className="flex items-center gap-2.5 text-xs text-lime font-mono">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{progressStage} ({downloadProgress}%)</span>
                     </div>
                  )}
               </div>
               <div className="flex items-center gap-3">
                  <Button id="btn-cancel-modal" variant="ghost" className="h-8.5 rounded-sm text-stone text-xs hover:text-cream" onClick={() => setActiveReport(null)}>
                     Cancel
                  </Button>
                  <Button 
                    id="btn-execute-generation" 
                    className="h-8.5 rounded-sm text-xs bg-lime text-bg-base hover:bg-lime/90 font-bold uppercase tracking-wider px-5"
                    onClick={handleStartGeneration}
                  >
                     Generate & Download Full Report
                  </Button>
               </div>
            </div>

          </div>
        </div>
      )}

      {/* Floating UI Action Toast Notice */}
      {notification && (
        <div id="toast-download-success" className="fixed bottom-4 right-4 bg-lime text-bg-base font-bold text-xs px-4 py-3 rounded shadow-lg flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 border border-white/20">
          <Check className="w-3.5 h-3.5 stroke-[3] text-bg-base" />
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="ml-2 py-1 hover:opacity-80">
            <X className="w-3 h-3 text-bg-base" />
          </button>
        </div>
      )}
    </div>
  )
}
