import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Landmark, ArrowUpRight, ArrowDownRight, RefreshCcw } from "lucide-react"

export default function Treasury() {
  const pnlData = [
    { name: "Spread", value: 12.4 },
    { name: "GC Margin", value: 4.1 },
    { name: "Fees", value: 2.8 },
    { name: "P2P", value: 1.5 },
    { name: "FX", value: -0.8 },
  ]
  const colors = ["#D6FF3F", "#D6FF3F", "#D6FF3F", "#D6FF3F", "#EF6C5E"]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
           <h1 className="text-xl font-display font-medium">Treasury</h1>
           <p className="text-stone text-xs mt-1">Multi-bucket financial view and P&L monitoring</p>
        </div>
      </div>

      {/* Top Row: Net Position Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-bg-elev border-rule">
           <CardContent className="p-4 py-3">
              <p className="text-[10px] font-medium text-stone uppercase tracking-wide">TOTAL NGN VALUE</p>
              <p className="text-xl font-mono text-cream leading-none mt-1 shadow-sm">₦14,240,000,500</p>
           </CardContent>
        </Card>
        <Card className="bg-bg-elev border-rule">
           <CardContent className="p-4 py-3">
              <p className="text-[10px] font-medium text-stone uppercase tracking-wide">TOTAL CRYPTO (NGN-EQUIV)</p>
              <p className="text-xl font-mono text-cream leading-none mt-1">₦32,180,500,000</p>
           </CardContent>
        </Card>
        <Card className="bg-bg-elev border-rule">
           <CardContent className="p-4 py-3">
              <p className="text-[10px] font-medium text-stone uppercase tracking-wide">NET P&L (24H)</p>
              <div className="flex items-center gap-2 mt-1">
                 <p className="text-xl font-mono text-good leading-none">+₦4.2M</p>
                 <Badge variant="success" className="h-5 text-[10px] px-1.5 font-mono">+1.2%</Badge>
              </div>
           </CardContent>
        </Card>
        <Card className="bg-bg-elev border-rule">
           <CardContent className="p-4 py-3">
              <p className="text-[10px] font-medium text-stone uppercase tracking-wide">NET P&L (MTD)</p>
              <div className="flex items-center gap-2 mt-1">
                 <p className="text-xl font-mono text-good leading-none">+₦85.4M</p>
                 <Badge variant="success" className="h-5 text-[10px] px-1.5 font-mono">+14.2%</Badge>
              </div>
           </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
         {/* Section 1: Fiat Balances */}
         <Card className="bg-bg-elev border-rule flex flex-col">
            <div className="p-4 border-b border-rule flex justify-between items-center bg-bg-paper">
               <h3 className="font-medium text-sm text-cream flex items-center gap-2"><Landmark className="w-4 h-4 text-stone"/> Fiat Balances</h3>
               <Button id="btn-fiat-reconcile" variant="outline" size="sm" className="h-7 text-[10px] gap-1"><RefreshCcw className="w-3 h-3"/> Reconcile All</Button>
            </div>
            <Table>
               <TableHeader>
                  <TableRow className="border-rule">
                     <TableHead>Provider / Account</TableHead>
                     <TableHead className="text-right">Balance</TableHead>
                     <TableHead className="text-center">Status</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {[
                     { provider: "GTBank (Primary Corporate)", balance: "₦8,500,000,000", status: "sync", diff: "" },
                     { provider: "Paystack Settlement", balance: "₦4,200,500,000", status: "diff", diff: "Diff: ₦45,000" },
                     { provider: "Monnify Settlement", balance: "₦1,150,000,000", status: "sync", diff: "" },
                     { provider: "Mobile Money Float", balance: "₦389,500,500", status: "sync", diff: "" },
                  ].map((row, i) => (
                     <TableRow key={i}>
                        <TableCell className="font-medium text-xs">{row.provider}</TableCell>
                        <TableCell className="text-right font-mono text-xs">{row.balance}</TableCell>
                        <TableCell className="text-center">
                           {row.status === 'sync' ? (
                              <Badge variant="success" className="bg-good/10 text-good border-good/20 text-[9px] uppercase">In Sync</Badge>
                           ) : (
                              <Badge variant="warning" className="bg-warn/10 text-warn border-warn/30 text-[9px] uppercase">{row.diff}</Badge>
                           )}
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </Card>
         
         {/* Section 3: P&L Breakdown */}
         <Card className="bg-bg-elev border-rule flex flex-col relative overflow-hidden">
            <div className="p-4 border-b border-rule flex justify-between items-center bg-bg-paper z-10">
               <h3 className="font-medium text-sm text-cream uppercase tracking-wide text-[11px]">P&L Breakdown (MTD)</h3>
               <div className="flex gap-1 text-[10px] font-mono shadow-sm">
                  <span id="btn-pnl-today" className="px-2 py-1 bg-bg-base border border-rule cursor-pointer hover:bg-bg-paper text-stone">Today</span>
                  <span id="btn-pnl-mtd" className="px-2 py-1 bg-bg-paper border border-rule border-lime text-lime font-medium cursor-pointer">MTD</span>
                  <span id="btn-pnl-ytd" className="px-2 py-1 bg-bg-base border border-rule cursor-pointer hover:bg-bg-paper text-stone">YTD</span>
               </div>
            </div>
            <div className="flex-1 p-4 pb-0 h-48 w-full relative -ml-4 z-0">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pnlData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                     <XAxis dataKey="name" stroke="#8C8678" fontSize={10} tickLine={false} axisLine={false} />
                     <Tooltip 
                        cursor={{fill: '#1F1B16'}} 
                        contentStyle={{ backgroundColor: '#16140F', border: '1px solid #2E2A22', borderRadius: '4px', fontSize: '11px', color: '#F5F1E8' }}
                        formatter={(value) => [`${value}M NGN`, 'Amount']}
                     />
                     <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                        {pnlData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.value > 0 ? 'var(--color-lime)' : 'var(--color-bad)'} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </Card>
      </div>
      
      {/* Crypto Balances */}
      <h3 className="text-xs font-medium uppercase tracking-wider text-stone mt-2">Crypto Exposure & Hedging</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {[
            { asset: "BTC", total: "14.2", ngn: "1.4B", pnl: "+2.4%", hedge: "" },
            { asset: "ETH", total: "502.1", ngn: "2.7B", pnl: "-1.1%", hedge: "BUY 50 ETH" },
            { asset: "USDT", total: "2.4M", ngn: "2.7B", pnl: "+0.2%", hedge: "" },
            { asset: "USDC", total: "1.1M", ngn: "1.2B", pnl: "+0.1%", hedge: "" },
         ].map(coin => (
            <Card key={coin.asset} id={`card-crypto-${coin.asset.toLowerCase()}`} className="bg-bg-paper border-rule">
               <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                     <span className="font-medium text-lg">{coin.asset}</span>
                     <Badge variant={coin.pnl.startsWith('-') ? 'destructive' : 'success'} className="font-mono text-[9px] px-1 h-5">{coin.pnl}</Badge>
                  </div>
                  <div>
                     <div className="font-mono text-xl text-cream">{coin.total}</div>
                     <div className="font-mono text-[10px] text-stone mt-0.5">≈ ₦{coin.ngn}</div>
                  </div>
                  {coin.hedge ? (
                     <div className="pt-2 border-t border-rule mt-2">
                        <Badge id={`btn-hedge-cover-${coin.asset.toLowerCase()}`} variant="warning" className="w-full justify-center bg-warn/10 text-warn border-warn/30 uppercase text-[9px] cursor-pointer hover:bg-warn/20">{coin.hedge} (COVER SHORT)</Badge>
                     </div>
                  ) : (
                     <div className="pt-2 border-t border-rule mt-2">
                        <span className="text-[10px] text-stone flex items-center justify-center h-5">Hedge target met</span>
                     </div>
                  )}
               </CardContent>
            </Card>
         ))}
      </div>
    </div>
  )
}
