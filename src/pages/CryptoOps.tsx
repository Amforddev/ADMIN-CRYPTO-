import React, { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Wallet, 
  Settings2, 
  Activity, 
  Play, 
  Pause, 
  ExternalLink,
  X,
  Plus,
  Check,
  ShieldAlert,
  Sparkles,
  ArrowUpRight,
  Loader2,
  Trash2,
  CheckCircle2,
  Coins,
  ArrowRight,
  Info,
  RefreshCw,
  Copy
} from "lucide-react"
import CustomSelect, { DoubleOption } from "@/components/ui/CustomSelect"

export default function CryptoOps() {
  const [activeTab, setActiveTab] = useState("RATES & SPREADS")
  const tabs = ["RATES & SPREADS", "WALLET OPS", "ON-CHAIN MONITOR", "ADDRESS BOOK"]

  // 1. Rates & Spreads state
  const [rates, setRates] = useState<any[]>(() => {
    const saved = localStorage.getItem("volt-crypto-rates")
    if (saved) return JSON.parse(saved)
    return [
      { asset: "BTC", name: "Bitcoin", price: "102,450,000", buySpread: "1.2%", sellSpread: "1.5%", status: "active", updated: "2s ago", color: "#f7931a" },
      { asset: "ETH", name: "Ethereum", price: "5,420,000", buySpread: "1.2%", sellSpread: "1.5%", status: "active", updated: "1s ago", color: "#627eea" },
      { asset: "USDT", name: "Tether", price: "1,150", buySpread: "0.8%", sellSpread: "0.8%", status: "active", updated: "Just now", color: "#26a17b" },
      { asset: "USDC", name: "USD Coin", price: "1,148", buySpread: "0.8%", sellSpread: "0.8%", status: "active", updated: "Just now", color: "#2775ca" },
      { asset: "SOL", name: "Solana", price: "142,000", buySpread: "1.5%", sellSpread: "2.0%", status: "paused", updated: "5m ago", color: "#14f195" },
    ]
  })

  // 2. Wallets state (USDT total balance raw is parsed so mathematics works perfectly)
  const [wallets, setWallets] = useState<any[]>(() => {
    const saved = localStorage.getItem("volt-crypto-wallets")
    if (saved) return JSON.parse(saved)
    return [
      { asset: "BTC", total: 14.2, hot: 0.56, ratio: 3.9, sweep: "4h ago" },
      { asset: "ETH", total: 502.1, hot: 42.0, ratio: 8.3, sweep: "1h ago" },
      { asset: "USDT", total: 2400000, hot: 350000, ratio: 14.5, sweep: "2d ago" },
    ]
  })

  // 3. Sweeps State
  const [sweeps, setSweeps] = useState<any[]>(() => {
    const saved = localStorage.getItem("volt-crypto-sweeps")
    if (saved) return JSON.parse(saved)
    return [
      { id: "sw_1", asset: "BTC", destination: "Cold Vault Alpha", amount: "4.2 BTC", txHash: "tx_8f92jk...lm2k", time: "2h ago" },
      { id: "sw_2", asset: "ETH", destination: "Cold Vault Alpha", amount: "12.5 ETH", txHash: "tx_3a59pl...ks8m", time: "5h ago" },
      { id: "sw_3", asset: "USDT", destination: "Binance Corporate Deposit", amount: "15,000 USDT", txHash: "tx_9p11xx...tr3e", time: "1d ago" },
    ]
  })

  // 4. On-chain Monitor State
  const [onChainTx, setOnChainTx] = useState<any[]>(() => {
    const saved = localStorage.getItem("volt-crypto-txs")
    if (saved) return JSON.parse(saved)
    return [
      { id: "tx_dep1", type: "DEPOSIT", status: "pending", asset: "USDT", network: "TRC20", amount: "1,500.00", confs: "4/12", maxConfs: 12, currentConfs: 4, addr: "TE2k...89md", age: "2m" },
      { id: "tx_with1", type: "WITHDRAWAL", status: "stuck", asset: "BTC", network: "Bitcoin", amount: "0.24", confs: "0/3", maxConfs: 3, currentConfs: 0, addr: "bc1q...x0wl", age: "42m" },
    ]
  })

  // 5. Whitelisted Address Book State
  const [addresses, setAddresses] = useState<any[]>(() => {
    const saved = localStorage.getItem("volt-crypto-addresses")
    if (saved) return JSON.parse(saved)
    return [
      { id: "addr_1", label: "Cold Vault Alpha", asset: "BTC", network: "Bitcoin", addr: "bc1q5d7rjq7g6...3k9v", actor: "Sunday O.", status: "Whitelisted" },
      { id: "addr_2", label: "Binance Corporate Deposit", asset: "USDT", network: "TRON", addr: "TDs34xR7rjq7g6...F9P", actor: "Sunday O.", status: "Whitelisted" },
      { id: "addr_3", label: "Kraken Treasury", asset: "ETH", network: "Ethereum", addr: "0x7a250d56...B47", actor: "Ngozi A.", status: "Pending 2FA" },
    ]
  })

  // Modal interaction trigger states
  const [toast, setToast] = useState<string | null>(null)
  
  // Custom Toast helper
  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  // Sync to local storage
  useEffect(() => { localStorage.setItem("volt-crypto-rates", JSON.stringify(rates)) }, [rates])
  useEffect(() => { localStorage.setItem("volt-crypto-wallets", JSON.stringify(wallets)) }, [wallets])
  useEffect(() => { localStorage.setItem("volt-crypto-sweeps", JSON.stringify(sweeps)) }, [sweeps])
  useEffect(() => { localStorage.setItem("volt-crypto-txs", JSON.stringify(onChainTx)) }, [onChainTx])
  useEffect(() => { localStorage.setItem("volt-crypto-addresses", JSON.stringify(addresses)) }, [addresses])

  // Active inputs states for forms
  // 1) Sweep to cold form states
  const [sweepingWallet, setSweepingWallet] = useState<any | null>(null)
  const [sweepAmount, setSweepAmount] = useState("")
  const [selectedDestAddress, setSelectedDestAddress] = useState("")
  const [networkGasMode, setNetworkGasMode] = useState("Standard Boost")

  // 2) Force Credit modal states
  const [creditingTx, setCreditingTx] = useState<any | null>(null)
  const [approvedSupervisor, setApprovedSupervisor] = useState("Sunday O. - Risk Lead")
  const [overridePass, setOverridePass] = useState("")
  const [overrideNotes, setOverrideNotes] = useState("")

  // 3) RBF (Replace-by-fee) modal states
  const [boostingTx, setBoostingTx] = useState<any | null>(null)
  const [boostFeeOption, setBoostFeeOption] = useState("Dynamic Speedup")
  const [boostFeeSat, setBoostFeeSat] = useState("54")

  // 4) Edit Rates & Spreads modal states
  const [configuringRate, setConfiguringRate] = useState<any | null>(null)
  const [editPrice, setEditPrice] = useState("")
  const [editBuySpread, setEditBuySpread] = useState("")
  const [editSellSpread, setEditSellSpread] = useState("")
  const [editTradingStatus, setEditTradingStatus] = useState("active")

  // 5) Add Whitelisted Address modal states
  const [showAddAddressModal, setShowAddAddressModal] = useState(false)
  const [newLabel, setNewLabel] = useState("")
  const [newAsset, setNewAsset] = useState("BTC")
  const [newNetwork, setNewNetwork] = useState("Bitcoin")
  const [newAddr, setNewAddr] = useState("")
  const [newActor, setNewActor] = useState("Sunday O.")
  const [newStatus, setNewStatus] = useState("Whitelisted")

  // Dynamic selector values based on active choices
  useEffect(() => {
    // Dynamic network assignment when selected asset changes in address modal
    if (newAsset === "BTC") setNewNetwork("Bitcoin")
    else if (newAsset === "ETH") setNewNetwork("Ethereum")
    else if (newAsset === "USDT" || newAsset === "USDC") setNewNetwork("TRON")
    else if (newAsset === "SOL") setNewNetwork("Solana")
  }, [newAsset])

  // Asset Value Parser / formatter for table display matching screenshot values
  const formatBalance = (val: number, asset: string): string => {
    if (asset === "USDT") {
      if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`
      if (val >= 1000) return `${(val / 1000).toFixed(0)}K`
    }
    return val.toString()
  };

  // Click row handlers
  const handleOpenEditRate = (rateRow: any) => {
    setConfiguringRate(rateRow)
    setEditPrice(rateRow.price)
    setEditBuySpread(rateRow.buySpread)
    setEditSellSpread(rateRow.sellSpread)
    setEditTradingStatus(rateRow.status)
  }

  const handleSaveRateConfig = (e: React.FormEvent) => {
    e.preventDefault()
    if (!configuringRate) return
    const updated = rates.map(r => {
      if (r.asset === configuringRate.asset) {
        return {
          ...r,
          price: editPrice,
          buySpread: editBuySpread.endsWith("%") ? editBuySpread : `${editBuySpread}%`,
          sellSpread: editSellSpread.endsWith("%") ? editSellSpread : `${editSellSpread}%`,
          status: editTradingStatus,
          updated: "Just now"
        }
      }
      return r
    })
    setRates(updated)
    setConfiguringRate(null)
    showToast(`Trading spreads updated for ${configuringRate.asset}!`)
  }

  // Sweep Form submission handler
  const handleSweepToColdSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!sweepingWallet) return
    const parsedAmount = parseFloat(sweepAmount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showToast("Please enter a valid transfer amount greater than 0.")
      return
    }
    if (parsedAmount > sweepingWallet.hot) {
      showToast(`Invalid sweep: amount exceeds available Hot Wallet balance (${sweepingWallet.hot} ${sweepingWallet.asset}).`)
      return
    }

    // Deduct math cleanly
    const updatedWallets = wallets.map(wallet => {
      if (wallet.asset === sweepingWallet.asset) {
        const nextHot = parseFloat((wallet.hot - parsedAmount).toFixed(4))
        const nextTotal = parseFloat((wallet.total - parsedAmount).toFixed(4))
        const nextRatio = parseFloat(((nextHot / nextTotal) * 100).toFixed(2))
        return {
          ...wallet,
          hot: nextHot,
          total: nextTotal,
          ratio: nextRatio,
          sweep: "Just now"
        }
      }
      return wallet
    })

    const destName = selectedDestAddress || "Cold Vault Alpha"

    // Append history sweep log
    const newSweepObject = {
      id: "sw_" + Date.now(),
      asset: sweepingWallet.asset,
      destination: destName,
      amount: `${parsedAmount} ${sweepingWallet.asset}`,
      txHash: "tx_" + Math.random().toString(36).substring(2, 9) + "..." + Math.random().toString(36).substring(2, 5),
      time: "Just now"
    }

    setWallets(updatedWallets)
    setSweeps(prev => [newSweepObject, ...prev])
    setSweepingWallet(null)
    setSweepAmount("")
    showToast(`Sweep of +${parsedAmount} ${sweepingWallet.asset} triggered to ${destName}!`)
  }

  // Force Credit validation submission
  const handleForceCreditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!creditingTx) return

    // Parse deposit values to append to wallets state!
    const depAmt = parseFloat(creditingTx.amount.replace(/,/g, ""))
    if (!isNaN(depAmt)) {
      const updatedWallets = wallets.map(w => {
        if (w.asset === creditingTx.asset) {
          const nextHot = parseFloat((w.hot + depAmt).toFixed(2))
          const nextTotal = parseFloat((w.total + depAmt).toFixed(2))
          const nextRatio = parseFloat(((nextHot / nextTotal) * 100).toFixed(2))
          return {
            ...w,
            hot: nextHot,
            total: nextTotal,
            ratio: nextRatio
          }
        }
        return w
      })
      setWallets(updatedWallets)
    }

    // Update transactions to confirmed status
    const updatedTxs = onChainTx.map(t => {
      if (t.id === creditingTx.id) {
        return {
          ...t,
          status: "completed",
          confs: `${t.maxConfs}/${t.maxConfs}`,
          currentConfs: t.maxConfs,
          age: "Credited"
        }
      }
      return t
    })

    setOnChainTx(updatedTxs)
    setCreditingTx(null)
    setOverridePass("")
    setOverrideNotes("")
    showToast(`Forced double-verified credit completed. ${creditingTx.asset} liquidity injected.`)
  }

  // RBF accelerate fee submission
  const handleRbfSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!boostingTx) return

    const updatedTxs = onChainTx.map(t => {
      if (t.id === boostingTx.id) {
        return {
          ...t,
          status: "boosting",
          confs: "2/3",
          currentConfs: 2,
          age: "Boosting"
        }
      }
      return t
    })

    setOnChainTx(updatedTxs)
    setBoostingTx(null)
    showToast(`Replace-By-Fee transaction broadcasted with priority rate of ${boostFeeSat} sat/vB!`)
  }

  // Add whitelisted address book entry
  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLabel.trim() || !newAddr.trim()) {
      showToast("Label and target address fields are mandatory.")
      return
    }

    const newAddrObj = {
      id: "addr_" + Date.now(),
      label: newLabel,
      asset: newAsset,
      network: newNetwork,
      addr: newAddr,
      actor: newActor || "Sunday O.",
      status: newStatus
    }

    setAddresses(prev => [newAddrObj, ...prev])
    setShowAddAddressModal(false)
    setNewLabel("")
    setNewAddr("")
    showToast(`Whitelisted address profile added: "${newLabel}"`)
  }

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-6rem)]">
      {/* Header Info Banner Section */}
      <div className="flex justify-between items-end shrink-0">
        <div>
           <h1 className="text-xl font-display font-medium text-cream">Crypto Operations</h1>
           <p className="text-stone text-xs mt-1">Manage liquidity, risk, and on-chain movements</p>
        </div>
      </div>

      <Card className="bg-bg-elev border-rule flex flex-col min-h-0 flex-1 relative overflow-hidden">
        {/* State driven Top Nav Area bar */}
        <div className="flex overflow-x-auto border-b border-rule hide-scrollbar shrink-0 px-2 pt-2 bg-bg-paper">
             {tabs.map(tab => (
               <button
                 key={tab}
                 id={`tab-btn-${tab.replace(/\s+/g, "-").toLowerCase()}`}
                 onClick={() => setActiveTab(tab)}
                 className={`px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                   activeTab === tab 
                    ? 'border-lime text-lime font-bold' 
                    : 'border-transparent text-stone hover:text-cream'
                 }`}
               >
                 {tab}
               </button>
             ))}
        </div>

        {/* Tab display views container */}
        <div className="flex-1 overflow-y-auto">
          
          {/* VIEW TAB 1: RATES & SPREADS config rates table */}
          {activeTab === "RATES & SPREADS" && (
             <div className="p-0">
                <Table id="table-rates-config">
                   <TableHeader className="bg-bg-paper">
                      <TableRow className="border-rule">
                         <TableHead>Asset</TableHead>
                         <TableHead className="text-right">Market Price (NGN)</TableHead>
                         <TableHead className="text-center">Spread (Buy)</TableHead>
                         <TableHead className="text-center">Spread (Sell)</TableHead>
                         <TableHead>Status</TableHead>
                         <TableHead className="text-right">Last Updated</TableHead>
                      </TableRow>
                   </TableHeader>
                   <TableBody>
                      {rates.map((row, i) => (
                         <TableRow 
                            key={row.asset} 
                            id={`row-rate-asset-${row.asset.toLowerCase()}`}
                            onClick={() => handleOpenEditRate(row)}
                            className="group cursor-pointer hover:bg-bg-base/60 transition-colors"
                            title="Click row to adjust reference rates & spreads"
                         >
                            <TableCell>
                               <div className="flex items-center gap-2">
                                  <div 
                                    className="w-6 h-6 rounded-full bg-bg-base border border-rule flex items-center justify-center text-[8px] font-bold font-mono"
                                    style={{ color: row.color, borderColor: `${row.color}30` }}
                                  >
                                    {row.asset}
                                  </div>
                                  <span className="font-medium text-cream">{row.name}</span>
                               </div>
                            </TableCell>
                            <TableCell className="text-right font-mono text-cream">₦{row.price}</TableCell>
                            <TableCell className="text-center">
                               <span className="px-2 py-1 bg-bg-base border border-rule rounded-sm font-mono text-[11px] text-stone group-hover:border-lime/30 group-hover:text-lime transition-colors">
                                 {row.buySpread}
                               </span>
                            </TableCell>
                            <TableCell className="text-center">
                               <span className="px-2 py-1 bg-bg-base border border-rule rounded-sm font-mono text-[11px] text-stone group-hover:border-lime/30 group-hover:text-lime transition-colors">
                                 {row.sellSpread}
                               </span>
                            </TableCell>
                            <TableCell>
                               {row.status === 'active' ? (
                                  <Badge id={`badge-trading-status-${row.asset}`} variant="success" className="text-[9px] uppercase font-mono px-2 py-0.5">
                                    Trading Live
                                  </Badge>
                               ) : (
                                  <Badge id={`badge-trading-status-${row.asset}`} variant="destructive" className="text-[9px] uppercase font-mono bg-bad/20 border border-bad text-bad px-2 py-0.5">
                                    Paused
                                  </Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-right text-stone text-[11px]">{row.updated}</TableCell>
                         </TableRow>
                      ))}
                   </TableBody>
                </Table>

                <div className="p-4 bg-bg-paper/30 border-t border-rule flex items-center gap-2 text-stone text-[11px]">
                  <Info className="w-3.5 h-3.5 text-lime" />
                  <span>Click on any crypto asset row to adjust the reference NGN market exchange rate, buy spreads, sell spreads or pause trading operations instantly.</span>
                </div>
             </div>
          )}

          {/* VIEW TAB 2: WALLET OPS sweeps and balancing table */}
          {activeTab === "WALLET OPS" && (
             <div className="p-0 flex h-full flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-rule">
                {/* Main Wallets status panel */}
                <div className="flex-1 overflow-y-auto">
                   <Table id="table-wallets-ops">
                      <TableHeader className="bg-bg-paper">
                         <TableRow className="border-rule">
                            <TableHead>Asset</TableHead>
                            <TableHead className="text-right">Total Balance</TableHead>
                            <TableHead className="text-right">Hot Wallet</TableHead>
                            <TableHead className="text-center">Ratio</TableHead>
                            <TableHead className="text-right">Last Sweep</TableHead>
                            <TableHead></TableHead>
                         </TableRow>
                      </TableHeader>
                      <TableBody>
                         {wallets.map((row) => {
                            const rateObj = rates.find(r => r.asset === row.asset) || { color: "#84cc16" }
                            return (
                               <TableRow key={row.asset} id={`row-wallet-${row.asset.toLowerCase()}`} className="hover:bg-bg-base/30">
                                  <TableCell className="font-semibold text-cream">
                                     <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: rateObj.color }} />
                                        {row.asset}
                                     </div>
                                  </TableCell>
                                  <TableCell className="text-right font-mono text-cream font-medium">
                                     {formatBalance(row.total, row.asset)}
                                  </TableCell>
                                  <TableCell className="text-right font-mono text-cream">
                                     {formatBalance(row.hot, row.asset)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                     <div className="flex flex-col items-center gap-1 max-w-[90px] mx-auto">
                                        <span className={`font-mono text-[11px] ${row.ratio > 12 ? 'text-warn font-semibold' : 'text-stone'}`}>{row.ratio}%</span>
                                        <div className="w-16 h-1 bg-bg-base rounded-full overflow-hidden border border-rule/30">
                                           <div className={`h-full ${row.ratio > 12 ? 'bg-warn' : 'bg-lime'}`} style={{width: `${row.ratio}%`}}></div>
                                        </div>
                                     </div>
                                  </TableCell>
                                  <TableCell className="text-right text-[11px] text-stone font-mono">{row.sweep}</TableCell>
                                  <TableCell className="text-right pr-4">
                                     <Tooltip content={`Sweep excess hot-wallet balance for ${row.asset} into whitelisted cold vault storage`} position="left" delay={150}>
                                        <Button 
                                           id={`btn-sweep-action-${row.asset.toLowerCase()}`}
                                           variant="outline" 
                                           size="sm" 
                                           onClick={() => {
                                             setSweepingWallet(row)
                                             setSweepAmount(row.hot.toString())
                                             // preselect matching coin's address from whitelisted list if any
                                             const match = addresses.find(a => a.asset === row.asset && a.status === "Whitelisted")
                                             setSelectedDestAddress(match ? match.label : "Cold Vault Alpha")
                                           }}
                                           className="h-7 text-[10px] uppercase font-bold border-lime/30 text-lime hover:bg-lime/10 w-full"
                                        >
                                          Sweep to Cold
                                        </Button>
                                     </Tooltip>
                                  </TableCell>
                               </TableRow>
                            )
                         })}
                      </TableBody>
                   </Table>
                </div>

                {/* Sidebar component: Recent Sweeps */}
                <div id="side-recent-sweeps" className="w-full lg:w-80 bg-bg-paper p-4 flex flex-col shrink-0 min-h-[250px] lg:min-h-0">
                   <h3 className="text-xs font-semibold uppercase tracking-wider text-cream mb-4 font-sans flex items-center gap-1.5 border-b border-rule pb-2">
                     <Coins className="w-3.5 h-3.5 text-lime" /> Recent Sweeps
                   </h3>
                   <div className="space-y-3 flex-1 overflow-y-auto pr-1 max-h-[350px] lg:max-h-none">
                      {sweeps.map(sw => (
                         <div key={sw.id} id={`recent-sweep-card-${sw.id}`} className="p-3 bg-bg-base border border-rule/80 rounded-sm font-mono text-[11px] hover:border-lime/20 transition-all duration-150">
                            <div className="flex justify-between items-center mb-1.5">
                               <span className="text-cream font-medium">{sw.destination}</span>
                               <span className="text-stone text-[10px]">{sw.time}</span>
                            </div>
                            <div className="text-lime font-bold mb-1.5 text-xs">+{sw.amount}</div>
                            <div className="text-stone text-[10px] flex items-center justify-between gap-2.5">
                               <span className="truncate flex-1 text-stone-500">{sw.txHash}</span>
                               <Button 
                                  variant="ghost" 
                                  className="h-5 w-5 p-0 hover:bg-bg-paper hover:text-cream h-[18px]"
                                  onClick={() => {
                                    navigator.clipboard.writeText(sw.txHash)
                                    showToast("Transaction hash copied to clipboard!")
                                  }}
                                  title="Copy transaction hash to clipboard"
                               >
                                  <Copy className="w-2.5 h-2.5" />
                               </Button>
                            </div>
                         </div>
                      ))}
                      {sweeps.length === 0 && (
                        <div className="text-center py-10 border border-dashed border-rule rounded text-[11px] text-stone">
                          No recent sweeps logged.
                        </div>
                      )}
                   </div>
                </div>
             </div>
          )}
          
          {/* VIEW TAB 3: ON-CHAIN MONITOR transactions controller */}
          {activeTab === "ON-CHAIN MONITOR" && (
             <div className="p-0">
                <Table id="table-onchain-monitor">
                   <TableHeader className="bg-bg-paper">
                      <TableRow className="border-rule">
                         <TableHead>Type</TableHead>
                         <TableHead>Asset & Network</TableHead>
                         <TableHead className="text-right">Amount</TableHead>
                         <TableHead className="text-center">Confirmations</TableHead>
                         <TableHead>Address</TableHead>
                         <TableHead>Age</TableHead>
                         <TableHead></TableHead>
                      </TableRow>
                   </TableHeader>
                   <TableBody>
                      {onChainTx.map((row) => (
                         <TableRow key={row.id} id={`row-onchain-tx-${row.id}`} className="hover:bg-bg-base/30">
                            <TableCell>
                               <Badge 
                                  variant={row.type === 'DEPOSIT' ? 'default' : 'outline'} 
                                  className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-sm ${
                                    row.type === 'DEPOSIT' 
                                      ? 'bg-lime/10 border border-lime/30 text-lime font-bold' 
                                      : 'bg-bg-elev border border-rule text-stone'
                                  }`}
                               >
                                 {row.type}
                               </Badge>
                            </TableCell>
                            <TableCell className="font-medium text-[12px] text-cream">
                              {row.asset} <span className="text-stone text-[10px] font-normal px-1">{row.network}</span>
                            </TableCell>
                            <TableCell className="text-right font-mono text-cream font-medium">{row.amount}</TableCell>
                            <TableCell className="text-center">
                               <span className={`font-mono text-[11px] px-2 py-0.5 rounded-sm ${
                                 row.status === 'stuck' 
                                   ? 'bg-bad/10 border border-bad/30 text-bad font-semibold animate-pulse' 
                                   : row.status === 'completed'
                                     ? 'bg-lime/10 text-lime font-mediumBorder border-lime/20'
                                     : 'bg-bg-paper text-stone font-medium'
                               }`}>{row.confs}</span>
                            </TableCell>
                            <TableCell className="font-mono text-[11px] text-stone-400">{row.addr}</TableCell>
                            <TableCell className={`text-[11px] font-mono ${
                              row.status === 'stuck' ? 'text-bad font-semibold' : 'text-stone'
                            }`}>{row.age}</TableCell>
                            <TableCell className="text-right pr-4">
                               {row.status === 'stuck' ? (
                                  <Tooltip content="Initiate a Replace-By-Fee rebroadcast to accelerate mining confirmation" position="left" delay={150}>
                                    <Button 
                                       id={`btn-rbf-trigger-${row.id}`}
                                       variant="outline" 
                                       size="sm" 
                                       onClick={() => {
                                          setBoostingTx(row)
                                          setBoostFeeSat("54")
                                       }}
                                       className="h-7 text-[10px] border-warn/40 text-warn hover:bg-warn/15 font-bold uppercase transition-all"
                                    >
                                      Replace-by-fee
                                    </Button>
                                  </Tooltip>
                               ) : row.status === 'pending' ? (
                                  <Tooltip content="Manually credit user balance overriding required network confirmations (dual auth required)" position="left" delay={150}>
                                    <Button 
                                       id={`btn-force-credit-trigger-${row.id}`}
                                       variant="ghost" 
                                       size="sm" 
                                       onClick={() => {
                                          setCreditingTx(row)
                                          setOverridePass("")
                                          setOverrideNotes("")
                                       }}
                                       className="h-7 text-[10px] text-stone hover:text-lime hover:bg-bg-base/80 underline font-medium cursor-pointer"
                                    >
                                      Force credit (4-eyes)
                                    </Button>
                                  </Tooltip>
                               ) : (
                                  <span className="text-[10px] text-lime font-medium font-mono uppercase tracking-wide flex items-center justify-end gap-1 px-2">
                                     <Check className="w-3 h-3 stroke-[3]" /> Credited
                                  </span>
                               )}
                            </TableCell>
                         </TableRow>
                      ))}
                   </TableBody>
                </Table>
             </div>
          )}

          {/* VIEW TAB 4: ADDRESS BOOK Whitelist secure addresses */}
          {activeTab === "ADDRESS BOOK" && (
             <div className="p-0">
                {/* Visual Top Bar matching Screenshot 4 precisely */}
                <div id="bar-header-address-book" className="p-4 border-b border-rule flex flex-col sm:flex-row justify-between items-start sm:items-center bg-bg-base gap-3">
                  <p className="text-[11px] text-stone leading-relaxed max-w-xl">
                    Manage whitelisted corporate and treasury addresses for secure withdrawals.
                  </p>
                  <Tooltip content="Register a new receiving address for fast treasury withdrawals" position="bottom" delay={150}>
                    <Button 
                      id="btn-add-address-trigger"
                      size="sm" 
                      onClick={() => {
                        setShowAddAddressModal(true)
                        setNewLabel("")
                        setNewAddr("")
                      }}
                      className="h-8 text-xs gap-1.5 bg-lime font-bold hover:bg-lime/90 text-bg-base border border-lime shadow-2xl rounded"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]"/> ADD ADDRESS
                    </Button>
                  </Tooltip>
                </div>

                <Table id="table-address-book-whitelisted">
                   <TableHeader className="bg-bg-paper">
                      <TableRow className="border-rule">
                         <TableHead>Label / Name</TableHead>
                         <TableHead>Asset & Network</TableHead>
                         <TableHead>Address</TableHead>
                         <TableHead>Added By</TableHead>
                         <TableHead>Status</TableHead>
                         <TableHead className="w-16"></TableHead>
                      </TableRow>
                   </TableHeader>
                   <TableBody>
                      {addresses.map((row) => (
                         <TableRow key={row.id} id={`row-whitelisted-addr-${row.id}`} className="hover:bg-bg-base/30">
                            <TableCell className="font-semibold text-cream text-[13px]">{row.label}</TableCell>
                            <TableCell className="font-medium text-[12px] text-cream">
                              {row.asset} <span className="text-stone text-[10px] font-normal px-1">{row.network}</span>
                            </TableCell>
                            <TableCell className="font-mono text-[11px] text-cream truncate max-w-xs" title={row.addr}>
                              {row.addr}
                            </TableCell>
                            <TableCell className="text-[11px] text-stone font-sans">{row.actor}</TableCell>
                            <TableCell>
                               <Badge id={`badge-whitelist-status-${row.id}`} variant={row.status === 'Whitelisted' ? 'success' : 'secondary'} className="text-[9px] px-2 py-0.5 uppercase tracking-wide">
                                  {row.status}
                               </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <button
                                 id={`btn-remove-whitelist-${row.id}`}
                                 onClick={() => {
                                    setAddresses(prev => prev.filter(a => a.id !== row.id))
                                    showToast(`Removed whitelisted address: ${row.label}`)
                                 }}
                                 className="text-stone hover:text-bad cursor-pointer p-1 rounded hover:bg-bg-base"
                                 title="Delete this address profile"
                              >
                                 <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </TableCell>
                         </TableRow>
                      ))}
                      {addresses.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12 text-stone text-xs">
                            No corporate addresses whitelisted yet. Click "Add Address" above.
                          </TableCell>
                        </TableRow>
                      )}
                   </TableBody>
                </Table>
             </div>
          )}
        </div>
      </Card>

      {/* OVERLAY MODAL 1: Adjust Rate configurations */}
      {configuringRate && (
         <div id="modal-configuring-rate" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-base/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-bg-elev border border-rule-strong rounded-md p-5 max-w-sm w-full space-y-4 shadow-2xl relative font-sans text-cream">
               <button 
                  id="btn-close-edit-rate"
                  onClick={() => setConfiguringRate(null)}
                  className="absolute top-4 right-4 text-stone hover:text-cream cursor-pointer border border-rule/50 p-1 rounded-sm bg-bg-base"
               >
                  <X className="w-3.5 h-3.5" />
               </button>
               
               <div className="flex items-center gap-2 font-display font-semibold tracking-wide text-xs border-b border-rule pb-2 text-cream uppercase">
                  <Settings2 className="w-4 h-4 text-lime shrink-0" /> Edit Spreads: <span className="text-lime">{configuringRate.asset}</span>
               </div>
               
               <form id="form-edit-rate" onSubmit={handleSaveRateConfig} className="space-y-3.5">
                  <div>
                     <label className="text-[10px] text-stone mb-1.5 block uppercase tracking-wide font-semibold">Reference Market Price (NGN)</label>
                     <Input 
                        id="rate-input-price"
                        type="text"
                        value={editPrice}
                        onChange={e => setEditPrice(e.target.value)}
                        placeholder="e.g. 102,450,000"
                        className="h-8.5 text-xs font-mono border-rule focus-visible:ring-lime text-cream bg-bg-base"
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                     <div>
                        <label className="text-[10px] text-stone mb-1.5 block uppercase tracking-wide font-medium">Buy Spread %</label>
                        <Input 
                           id="rate-input-buyspread"
                           type="text"
                           value={editBuySpread}
                           onChange={e => setEditBuySpread(e.target.value)}
                           placeholder="e.g. 1.2%"
                           className="h-8.5 text-xs font-mono border-rule focus-visible:ring-lime text-cream bg-bg-base"
                        />
                     </div>
                     <div>
                        <label className="text-[10px] text-stone mb-1.5 block uppercase tracking-wide font-medium font-sans">Sell Spread %</label>
                        <Input 
                           id="rate-input-sellspread"
                           type="text"
                           value={editSellSpread}
                           onChange={e => setEditSellSpread(e.target.value)}
                           placeholder="e.g. 1.5%"
                           className="h-8.5 text-xs font-mono border-rule focus-visible:ring-lime text-cream bg-bg-base"
                        />
                     </div>
                  </div>

                  <div>
                     <label className="text-[10px] text-stone mb-1.5 block uppercase tracking-wide">Exchange Operations Status</label>
                     <CustomSelect 
                        id="rate-input-status"
                        value={editTradingStatus}
                        onChange={setEditTradingStatus}
                        options={[
                           { value: "active", label: "Active Trading Live", color: "#84cc16", bgColor: "rgba(132,204,22,0.15)" },
                           { value: "paused", label: "Trading Halted / Paused", color: "#ef4444", bgColor: "rgba(239,68,68,0.15)" },
                        ]}
                     />
                  </div>

                  <div className="flex gap-2 pt-2">
                     <Button type="submit" id="btn-submit-save-rate" className="flex-1 h-8 text-[11px] font-sans font-bold uppercase bg-lime hover:bg-lime/90 text-bg-base">
                        Apply Adjustments
                     </Button>
                     <Button type="button" variant="ghost" className="h-8 text-[11px]" onClick={() => setConfiguringRate(null)}>
                        Cancel
                     </Button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* OVERLAY MODAL 2: Sweep to Cold Vault dialog form */}
      {sweepingWallet && (
         <div id="modal-sweep-to-cold" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-base/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-bg-elev border border-rule-strong rounded-md p-5 max-w-md w-full space-y-4 shadow-2xl relative font-sans text-cream">
               <button 
                  id="btn-close-sweep-modal"
                  onClick={() => setSweepingWallet(null)}
                  className="absolute top-4 right-4 text-stone hover:text-cream cursor-pointer border border-rule/50 p-1 rounded-sm bg-bg-base"
               >
                  <X className="w-3.5 h-3.5" />
               </button>
               
               <div className="flex items-center gap-2 font-display font-semibold tracking-wide text-xs border-b border-rule pb-2 text-cream uppercase">
                  <ArrowUpRight className="w-4.5 h-4.5 text-lime shrink-0" /> Sweep Hot Liquidity: <span className="text-lime">{sweepingWallet.asset}</span>
               </div>
               
               <form id="form-sweep-liquidity" onSubmit={handleSweepToColdSubmit} className="space-y-4">
                  
                  {/* Current Balance reference layout */}
                  <div className="p-3 bg-bg-base border border-rule/60 rounded flex justify-between items-center text-xs">
                     <div>
                        <div className="text-[10px] text-stone uppercase">Available Hot Balance</div>
                        <div className="text-sm font-bold font-mono text-cream mt-0.5">
                           {sweepingWallet.hot} {sweepingWallet.asset}
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="text-[10px] text-stone uppercase">Current Ratio</div>
                        <div className="text-xs font-mono text-warn font-semibold mt-0.5">
                           {sweepingWallet.ratio}%
                        </div>
                     </div>
                  </div>

                  <div>
                     <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[10px] text-stone uppercase tracking-wide">Amount to Sweep</label>
                        <button
                           id="btn-sweep-use-max"
                           type="button"
                           onClick={() => setSweepAmount(sweepingWallet.hot.toString())}
                           className="text-[10px] text-lime hover:underline font-mono font-bold cursor-pointer"
                        >
                           USE MAX
                        </button>
                     </div>
                     <div className="relative">
                        <Input 
                           id="sweep-input-amount"
                           type="number"
                           step="any"
                           required
                           value={sweepAmount}
                           onChange={e => setSweepAmount(e.target.value)}
                           placeholder={`e.g. ${sweepingWallet.hot / 2}`}
                           className="h-9.5 text-xs font-mono border-rule focus-visible:ring-lime text-cream bg-bg-base pr-12"
                        />
                        <span className="absolute right-3.5 top-2.5 font-bold font-mono text-[11px] text-stone">
                           {sweepingWallet.asset}
                        </span>
                     </div>
                  </div>

                  {/* Dynamic address destination selections filtered by matching active coin */}
                  <div>
                     <label className="text-[10px] text-stone mb-1.5 block uppercase tracking-wide">Destination Whitelisted Vault</label>
                     <CustomSelect 
                        id="sweep-input-destination"
                        value={selectedDestAddress}
                        onChange={setSelectedDestAddress}
                        options={[
                           { value: "Cold Vault Alpha", label: "Cold Vault Alpha (Secure System)" },
                           ...addresses
                              .filter(a => a.asset === sweepingWallet.asset)
                              .map(a => ({
                                 value: a.label,
                                 label: `${a.label} (${a.addr.substring(0, 10)}...)`
                              }))
                        ]}
                     />
                  </div>

                  {/* Gas Priority selection limits */}
                  <div>
                     <label className="text-[10px] text-stone mb-1.5 block uppercase tracking-wide">Network Gas / Speed priority</label>
                     <CustomSelect
                        id="sweep-input-gas-mode"
                        value={networkGasMode}
                        onChange={setNetworkGasMode}
                        options={[
                           { value: "Economic Speed", label: "Economic (Slow clearance • ~15 mins)", color: "#78716c", bgColor: "rgba(120,113,108,0.15)" },
                           { value: "Standard Boost", label: "Standard (Adaptive gas rate • ~5 mins)", color: "#84cc16", bgColor: "rgba(132,204,22,0.15)" },
                           { value: "Priority Highway", label: "Instant Priority (Frontrun Mempool • ~1 min)", color: "#f59e0b", bgColor: "rgba(245,158,11,0.15)" }
                        ]}
                     />
                  </div>

                  <div className="flex gap-2.5 pt-3">
                     <Button type="submit" id="btn-sweep-confirm-submit" className="flex-1 h-9 text-[11px] font-sans font-bold uppercase bg-lime hover:bg-lime/90 text-bg-base shadow-lg">
                        CONFIRM SECURE SWEEP
                     </Button>
                     <Button type="button" variant="ghost" className="h-9 text-[11px]" onClick={() => setSweepingWallet(null)}>
                        Cancel
                     </Button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* OVERLAY MODAL 3: Force Credit 4-eyes confirmation modal */}
      {creditingTx && (
         <div id="modal-force-credit" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-base/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-bg-elev border border-rule-strong rounded-md p-5 max-w-sm w-full space-y-4 shadow-2xl relative font-sans text-cream">
               <button 
                  id="btn-close-force-modal"
                  onClick={() => setCreditingTx(null)}
                  className="absolute top-4 right-4 text-stone hover:text-cream cursor-pointer border border-rule/50 p-1 rounded-sm bg-bg-base"
               >
                  <X className="w-3.5 h-3.5" />
               </button>
               
               <div className="flex items-center gap-1.5 font-display font-semibold tracking-wide text-xs border-b border-rule pb-2 text-cream uppercase">
                  <ShieldAlert className="w-5 h-5 text-warn shrink-0" /> Force Credit: 4-eyes Override
               </div>

               <div className="text-[10px] text-stone leading-relaxed space-y-2 bg-bg-base p-2 rounded border border-rule/40 font-mono">
                  <div className="flex justify-between"><span>Deposit Item ID:</span><span className="text-cream">{creditingTx.id}</span></div>
                  <div className="flex justify-between"><span>Unconfirmed Sum:</span><span className="text-lime">{creditingTx.amount} {creditingTx.asset}</span></div>
                  <div className="flex justify-between"><span>Network Chain:</span><span className="text-cream">{creditingTx.network}</span></div>
                  <div className="flex justify-between"><span>Confs Progress:</span><span className="text-warn">{creditingTx.confs}</span></div>
               </div>

               <form id="form-force-credit" onSubmit={handleForceCreditSubmit} className="space-y-4">
                  <div>
                     <label className="text-[10px] text-stone mb-1.5 block uppercase tracking-wide">Second Checker Supervisor</label>
                     <CustomSelect 
                        id="force-checker-select"
                        value={approvedSupervisor}
                        onChange={setApprovedSupervisor}
                        options={[
                           { value: "Ngozi A. - Lead Auditor", label: "Ngozi A. (Lead Auditor / Finance)" },
                           { value: "Sunday O. - Risk Lead", label: "Sunday O. (Operational Risk Head)" },
                           { value: "Amadi U. - Compliance Partner", label: "Amadi U. (Group Compliance Officer)" }
                        ]}
                     />
                  </div>

                  <div>
                     <label className="text-[10px] text-stone mb-1 block uppercase tracking-wide">Supervisor Credentials Key</label>
                     <Input 
                        id="force-checker-pass"
                        type="password"
                        required
                        value={overridePass}
                        onChange={e => setOverridePass(e.target.value)}
                        placeholder="••••••••••••"
                        className="h-8.5 text-xs text-cream bg-bg-base border-rule focus-visible:ring-lime"
                     />
                  </div>

                  <div>
                     <label className="text-[10px] text-stone mb-1 block uppercase tracking-wide">Operational Credit Justification Notes</label>
                     <Input 
                        id="force-checker-notes"
                        type="text"
                        required
                        value={overrideNotes}
                        onChange={e => setOverrideNotes(e.target.value)}
                        placeholder="e.g. TX confirmed manually on TRON blockchain scan"
                        className="h-8.5 text-xs text-cream bg-bg-base border-rule focus-visible:ring-lime"
                     />
                  </div>

                  <div className="flex gap-2 pt-2">
                     <Button type="submit" id="btn-force-credit-approve" className="flex-1 h-8 text-[11px] font-sans font-bold uppercase bg-lime hover:bg-lime/90 text-bg-base">
                        APPROVE & FORCE CREDIT
                     </Button>
                     <Button type="button" variant="ghost" className="h-8 text-[11px]" onClick={() => setCreditingTx(null)}>
                        Cancel
                     </Button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* OVERLAY MODAL 4: RBF replace fee transaction confirmation modal */}
      {boostingTx && (
         <div id="modal-rbf-bounce" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-base/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-bg-elev border border-rule-strong rounded-md p-5 max-w-sm w-full space-y-4 shadow-2xl relative font-sans text-cream">
               <button 
                  id="btn-close-rbf-modal"
                  onClick={() => setBoostingTx(null)}
                  className="absolute top-4 right-4 text-stone hover:text-cream cursor-pointer border border-rule/50 p-1 rounded-sm bg-bg-base"
               >
                  <X className="w-3.5 h-3.5" />
               </button>
               
               <div className="flex items-center gap-1.5 font-display font-semibold tracking-wide text-xs border-b border-rule pb-2 text-cream uppercase">
                  <RefreshCw className="w-4 h-4 text-warn shrink-0 animate-spin" /> Replace-By-Fee (RBF) Boost
               </div>

               <div className="text-[11px] text-stone leading-relaxed bg-bg-base border border-rule/60 p-3 rounded space-y-1">
                  <p>Stuck Withdrawal Details:</p>
                  <div className="font-mono text-[10px] space-y-1 pt-1.5 border-t border-rule/40 text-cream">
                     <div className="flex justify-between"><span>Sum:</span><span className="font-bold">{boostingTx.amount} {boostingTx.asset}</span></div>
                     <div className="flex justify-between"><span>Destination:</span><span>{boostingTx.addr}</span></div>
                     <div className="flex justify-between"><span>Stuck Status:</span><span className="text-bad">{boostingTx.confs} confirmations</span></div>
                  </div>
               </div>

               <form id="form-rbf-boost" onSubmit={handleRbfSubmit} className="space-y-4">
                  <div>
                     <label className="text-[10px] text-stone mb-1.5 block uppercase tracking-wide">Select Fee Bump Increment</label>
                     <CustomSelect 
                        id="rbf-preset-rate"
                        value={boostFeeOption}
                        onChange={(val) => {
                           setBoostFeeOption(val)
                           if (val === "Eco Adjust") setBoostFeeSat("42")
                           else if (val === "Dynamic Speedup") setBoostFeeSat("58")
                           else setBoostFeeSat("95")
                        }}
                        options={[
                           { value: "Eco Adjust", label: "Economic Fee Bump (+12 sat/vB)", color: "#78716c", bgColor: "rgba(120,113,108,0.15)" },
                           { value: "Dynamic Speedup", label: "Recommended Priority (+28 sat/vB)", color: "#84cc16", bgColor: "rgba(132,204,22,0.15)" },
                           { value: "Mempool Overdrive", label: "Instant Next-Block (+65 sat/vB)", color: "#f59e0b", bgColor: "rgba(245,158,11,0.15)" }
                        ]}
                     />
                  </div>

                  <div>
                     <label className="text-[10px] text-stone mb-1 block uppercase tracking-wide">Target fee rate (sat/vB)</label>
                     <Input 
                        id="rbf-custom-fee"
                        type="number"
                        required
                        value={boostFeeSat}
                        onChange={e => setBoostFeeSat(e.target.value)}
                        placeholder="54"
                        className="h-8.5 text-xs text-cream bg-bg-base border-rule font-mono focus-visible:ring-lime"
                     />
                  </div>

                  <div className="flex gap-2 pt-2">
                     <Button type="submit" id="btn-submit-rbf-broadcast" className="flex-1 h-9 text-[11px] font-sans font-bold uppercase bg-lime hover:bg-lime/90 text-bg-base shadow">
                        BROADCAST BOOSTED TX
                     </Button>
                     <Button type="button" variant="ghost" className="h-9 text-[11px]" onClick={() => setBoostingTx(null)}>
                        Cancel
                     </Button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* OVERLAY MODAL 5: Add Whitelisted Address modal Dialog form */}
      {showAddAddressModal && (
         <div id="modal-add-whitelist" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-base/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-bg-elev border border-rule-strong rounded-md p-5 max-w-sm w-full space-y-4 shadow-2xl relative font-sans text-cream">
               <button 
                  id="btn-close-address-modal"
                  onClick={() => setShowAddAddressModal(false)}
                  className="absolute top-4 right-4 text-stone hover:text-cream cursor-pointer border border-rule/50 p-1 rounded-sm bg-bg-base"
               >
                  <X className="w-3.5 h-3.5" />
               </button>
               
               <div className="flex items-center gap-1.5 font-display font-semibold tracking-wide text-xs border-b border-rule pb-2 text-cream uppercase">
                  <Plus className="w-4 h-4 text-lime shrink-0 stroke-[3]" /> Add Whitelisted Profile Address
               </div>

               <form id="form-add-whitelisted-address" onSubmit={handleAddAddressSubmit} className="space-y-3.5">
                  <div>
                     <label className="text-[10px] text-stone mb-1 block uppercase tracking-wide">Label / Vault Name</label>
                     <Input 
                        id="address-input-label"
                        type="text"
                        required
                        placeholder="e.g. Ledger Cold B"
                        value={newLabel}
                        onChange={e => setNewLabel(e.target.value)}
                        className="h-8.5 text-xs text-cream bg-bg-base border-rule focus-visible:ring-lime"
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                     <div>
                        <label className="text-[10px] text-stone mb-1.5 block uppercase tracking-wide">Target Asset</label>
                        <CustomSelect 
                           id="address-input-asset"
                           value={newAsset}
                           onChange={setNewAsset}
                           options={[
                              { value: "BTC", label: "BTC (Bitcoin)" },
                              { value: "ETH", label: "ETH (Ethereum)" },
                              { value: "USDT", label: "USDT (Tether USD)" },
                              { value: "USDC", label: "USDC (USD Coin)" },
                              { value: "SOL", label: "SOL (Solana)" }
                           ]}
                        />
                     </div>
                     <div>
                        <label className="text-[10px] text-stone mb-1.5 block uppercase tracking-wide">Blockchain Network</label>
                        <Input 
                           id="address-input-network"
                           type="text"
                           required
                           disabled
                           value={newNetwork}
                           className="h-8 text-xs bg-bg-base/50 text-stone font-medium pointer-events-none opacity-80 border-rule"
                        />
                     </div>
                  </div>

                  <div>
                     <label className="text-[10px] text-stone mb-1 block uppercase tracking-wide">On-Chain Target Address</label>
                     <Input 
                        id="address-input-key"
                        type="text"
                        required
                        placeholder={newAsset === 'BTC' ? "bc1q5..." : newAsset === 'ETH' ? "0x7a2..." : "TDs34..."}
                        value={newAddr}
                        onChange={e => setNewAddr(e.target.value)}
                        className="h-8.5 text-xs text-cream font-mono bg-bg-base border-rule focus-visible:ring-lime"
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                     <div>
                        <label className="text-[10px] text-stone mb-1.5 block uppercase tracking-wide">Verification Status</label>
                        <CustomSelect 
                           id="address-input-status"
                           value={newStatus}
                           onChange={setNewStatus}
                           options={[
                              { value: "Whitelisted", label: "Active Approved" },
                              { value: "Pending 2FA", label: "Require Override" }
                           ]}
                        />
                     </div>
                     <div>
                        <label className="text-[10px] text-stone mb-1 block uppercase tracking-wide font-sans">Operator Signature</label>
                        <Input 
                           id="address-input-actor"
                           type="text"
                           required
                           value={newActor}
                           onChange={e => setNewActor(e.target.value)}
                           className="h-8.5 text-xs text-cream bg-bg-base border-rule"
                        />
                     </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                     <Button type="submit" id="btn-submit-add-address" className="flex-1 h-9 text-[11px] font-sans font-bold uppercase bg-lime hover:bg-lime/90 text-bg-base">
                        Whitelist Address
                     </Button>
                     <Button type="button" variant="ghost" className="h-9 text-[11px]" onClick={() => setShowAddAddressModal(false)}>
                        Cancel
                     </Button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* Floating active toast notification matching look & feel perfectly */}
      {toast && (
        <div id="toast-message-crp" className="fixed bottom-4 right-4 bg-lime text-bg-base font-bold text-xs px-4 py-3 rounded shadow-lg flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  )
}
