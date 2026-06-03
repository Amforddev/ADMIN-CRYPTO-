import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip as RechartsTooltip } from "recharts"
import { Tooltip } from "@/components/ui/tooltip"
import { ArrowUpRight, ArrowDownRight, AlertTriangle, ShieldCheck, Activity, Search } from "lucide-react"

export default function Dashboard() {
  const navigate = useNavigate();
  const [opsTab, setOpsTab] = useState<"kyc" | "giftcards" | "disputes">("kyc");
  const [alertFilter, setAlertFilter] = useState<"all" | "critical" | "warning" | "info">("all");

  const alerts = [
    { title: "Sanctions hit on user @adaeze.eth", time: "3m ago", severity: "critical", assignee: "Unassigned" },
    { title: "High value BTC withdrawal queued", time: "12m ago", severity: "warning", assignee: "Ibrahim" },
    { title: "Multiple failed logins for admin account", time: "28m ago", severity: "critical", assignee: "Unassigned" },
    { title: "API latency spike detected in paystack-svc", time: "1h ago", severity: "info", assignee: "System" },
  ];

  const filteredAlerts = alerts.filter(a => alertFilter === "all" || a.severity === alertFilter);

  return (
    <div className="flex flex-col gap-6">
      {/* ROW 1: KPI Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 overflow-x-auto pb-2">
        <StatTile label="24H VOLUME" value="₦12.4B" delta="+8.2%" trend="good" />
        <StatTile label="ACTIVE USERS (24H)" value="18,420" delta="+12%" trend="good" />
        <StatTile label="NEW SIGNUPS (24H)" value="342" delta="+4%" trend="good" />
        <StatTile label="PENDING KYC" value="12" delta="" trend="neutral" hasAlert onClick={() => navigate('/admin/users')} />
        <StatTile label="OPEN DISPUTES" value="4" delta="" trend="neutral" onClick={() => navigate('/admin/disputes')} />
        <StatTile label="GIFTCARD QUEUE" value="17" delta="4m 12s oldest" trend="neutral" onClick={() => navigate('/admin/giftcards')} />
        <StatTile label="HOT WALLET RATIO" value="4.2%" delta="-0.2%" trend="good" onClick={() => navigate('/admin/treasury')} />
        <StatTile label="WITHDRAWAL SUCCESS" value="99.1%" delta="+0.1%" trend="good" onClick={() => navigate('/admin/crypto-ops')} />
      </div>

      {/* ROW 2: Alerts (2/3) + System Health (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 flex flex-col bg-bg-elev border-rule">
          <CardHeader className="flex flex-row items-center justify-between pb-3 p-4 shrink-0">
            <div className="flex items-center gap-3">
              <CardTitle>Open Alerts</CardTitle>
              <Badge variant="destructive">3 Critical</Badge>
            </div>
            <div className="flex gap-2">
              <div onClick={() => setAlertFilter("all")} className="cursor-pointer"><Badge variant={alertFilter === "all" ? "default" : "secondary"} className={alertFilter !== 'all' ? 'hover:bg-bg-high' : ''}>All</Badge></div>
              <div onClick={() => setAlertFilter("critical")} className="cursor-pointer"><Badge variant={alertFilter === "critical" ? "default" : "secondary"} className={alertFilter !== 'critical' ? 'hover:bg-bg-high' : ''}>Critical</Badge></div>
              <div onClick={() => setAlertFilter("warning")} className="cursor-pointer"><Badge variant={alertFilter === "warning" ? "default" : "secondary"} className={alertFilter !== 'warning' ? 'hover:bg-bg-high' : ''}>Warning</Badge></div>
              <div onClick={() => setAlertFilter("info")} className="cursor-pointer"><Badge variant={alertFilter === "info" ? "default" : "secondary"} className={alertFilter !== 'info' ? 'hover:bg-bg-high' : ''}>Info</Badge></div>
            </div>
          </CardHeader>
          <div className="px-4 pb-4 overflow-y-auto max-h-[240px]">
            <div className="space-y-2">
              {filteredAlerts.length > 0 ? filteredAlerts.map((alert, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-md bg-bg-paper border border-rule hover:border-stone/50 transition-colors">
                  <div className="flex items-center gap-3 relative">
                    <span className={`w-2 h-2 rounded-full absolute -left-1 opacity-80 shadow-[0_0_8px] ${(alert.severity === 'critical') ? 'bg-bad shadow-bad' : alert.severity === 'warning' ? 'bg-warn shadow-warn' : 'bg-info shadow-info'}`}></span>
                    <div className="pl-3">
                      <p className="text-[13px] font-medium text-cream">{alert.title}</p>
                      <p className="text-[11px] text-stone mt-0.5">{alert.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] px-2 py-1 bg-bg-elev rounded border border-rule text-stone">{alert.assignee}</span>
                    <Tooltip content="Delegate this alert event to compliance auditors for manual review" position="left" delay={150}>
                      <Button variant="outline" size="sm" className="h-7 text-xs flex-shrink-0" onClick={() => navigate('/admin/compliance')}>Investigate</Button>
                    </Tooltip>
                  </div>
                </div>
              )) : (
                <div className="py-8 text-center text-stone text-xs">No alerts matching filter.</div>
              )}
            </div>
          </div>
        </Card>

        <Card className="flex flex-col bg-bg-elev border-rule">
          <CardHeader className="pb-3 p-4 shrink-0">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-good" />
              System Health
            </CardTitle>
          </CardHeader>
          <div className="px-4 pb-4 overflow-y-auto max-h-[240px]">
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "api-gateway", status: "good", p95: "45ms" },
                { name: "auth-svc", status: "good", p95: "120ms" },
                { name: "wallet-svc", status: "good", p95: "210ms" },
                { name: "trade-svc", status: "good", p95: "85ms" },
                { name: "p2p-svc", status: "good", p95: "90ms" },
                { name: "giftcard-svc", status: "warn", p95: "850ms" },
                { name: "payments-svc", status: "good", p95: "340ms" },
                { name: "notify-svc", status: "good", p95: "40ms" },
              ].map((svc, i) => (
                <div key={i} className="p-3 rounded-md bg-bg-paper border border-rule flex flex-col justify-between hover:bg-bg-high transition-colors cursor-pointer" title="View infrastructure logs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-cream truncate pr-2">{svc.name}</span>
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${svc.status === 'good' ? 'bg-good' : svc.status === 'warn' ? 'bg-warn' : 'bg-bad'}`}></span>
                  </div>
                  <div className="text-[11px] font-mono text-stone">p95: {svc.p95}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ROW 3: Live Trade Ticker (Marquee) */}
      <div className="bg-bg-paper border border-rule rounded-md overflow-hidden relative flex items-center h-12 hover:bg-bg-high transition-colors cursor-pointer" onClick={() => navigate('/admin/transactions')}>
        <div className="absolute left-0 z-10 w-12 h-full bg-gradient-to-r from-bg-paper to-transparent"></div>
        <div className="absolute right-0 z-10 w-12 h-full bg-gradient-to-l from-bg-paper to-transparent"></div>
        <div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite] gap-12 text-xs font-mono">
           {/* Mocking a few repeated trades */}
           {[...Array(3)].map((_, j) => (
            <div key={j} className="flex gap-12">
              <span className="flex items-center gap-2"><span className="text-stone">AD...wk</span><Badge variant="success" className="h-5 px-1.5 text-[10px] bg-good/20 border-good/20 rounded">BUY</Badge><span className="text-cream">BTC/NGN</span><span className="text-stone">0.051</span><span className="text-good">₦3.4M</span></span>
              <span className="flex items-center gap-2"><span className="text-stone">CB...ze</span><Badge variant="destructive" className="h-5 px-1.5 text-[10px] bg-bad/20 border-bad/20 rounded">SELL</Badge><span className="text-cream">USDT/NGN</span><span className="text-stone">500</span><span className="text-bad">₦765K</span></span>
              <span className="flex items-center gap-2"><span className="text-stone">FA...yo</span><Badge variant="success" className="h-5 px-1.5 text-[10px] bg-good/20 border-good/20 rounded">BUY</Badge><span className="text-cream">SOL/NGN</span><span className="text-stone">12.5</span><span className="text-good">₦2.1M</span></span>
              <span className="flex items-center gap-2"><span className="text-stone">IM...sa</span><Badge variant="destructive" className="h-5 px-1.5 text-[10px] bg-bad/20 border-bad/20 rounded">SELL</Badge><span className="text-cream">ETH/NGN</span><span className="text-stone">2.1</span><span className="text-bad">₦8.2M</span></span>
            </div>
           ))}
        </div>
      </div>

       {/* ROW 4: Treasury Exposure (1/2) + Operations Queue (1/2) */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-bg-elev border-rule cursor-pointer hover:border-lime/30 transition-colors" onClick={() => navigate('/admin/treasury')}>
          <CardHeader className="pb-4 p-5 shrink-0">
            <CardTitle>Treasury Exposure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {[
              { asset: "BTC", value: "₦14.2B", cold: 96, hot: 4 },
              { asset: "USDT", value: "₦8.5B", cold: 88, hot: 12 },
              { asset: "USDC", value: "₦5.1B", cold: 90, hot: 10 },
              { asset: "ETH", value: "₦4.8B", cold: 95, hot: 5 }
            ].map((t) => (
              <div key={t.asset} className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-cream">{t.asset}</span>
                  <div className="flex gap-4">
                    <span className="font-mono text-stone">{t.value}</span>
                    <span className={`font-mono ${t.hot > 5 ? 'text-warn' : 'text-stone'}`}>{t.hot}% HOT</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-bg-base rounded-full overflow-hidden flex">
                    <div className="bg-lime h-full" style={{width: `${t.cold}%`}}></div>
                    <div className="bg-rust h-full" style={{width: `${t.hot}%`}}></div>
                </div>
              </div>
            ))}
            <div className="pt-2 flex items-center justify-between text-[11px] text-stone">
               <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-lime inline-block"></span> Cold Storage</span>
               <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-rust inline-block"></span> Hot Wallet (Target: &lt;5%)</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-bg-elev border-rule flex flex-col">
          <CardHeader className="pb-3 p-5 border-b border-rule shrink-0 flex flex-row items-center gap-4">
             <CardTitle>Operations Queue</CardTitle>
             <div className="flex gap-3 text-xs">
                <span onClick={() => setOpsTab("kyc")} className={`border-b pb-1 block cursor-pointer transition-colors ${opsTab === "kyc" ? "text-lime border-lime font-medium" : "text-stone border-transparent hover:text-cream"}`}>KYC</span>
                <span onClick={() => setOpsTab("giftcards")} className={`border-b pb-1 block cursor-pointer transition-colors ${opsTab === "giftcards" ? "text-lime border-lime font-medium" : "text-stone border-transparent hover:text-cream"}`}>Gift Cards</span>
                <span onClick={() => setOpsTab("disputes")} className={`border-b pb-1 block cursor-pointer transition-colors ${opsTab === "disputes" ? "text-lime border-lime font-medium" : "text-stone border-transparent hover:text-cream"}`}>Disputes</span>
             </div>
          </CardHeader>
          <div className="p-0 overflow-hidden flex-1">
             <Table>
                <TableBody>
                  {opsTab === "kyc" && [
                    { id: "kyc_448", user: "Adekunle M.", age: "14m", assignee: "unassigned" },
                    { id: "kyc_447", user: "Chioma D.", age: "28m", assignee: "unassigned" },
                    { id: "kyc_446", user: "Babajide S.", age: "1h 2m", assignee: "Ngozi" },
                    { id: "kyc_445", user: "Faith O.", age: "4h", assignee: "Ngozi" },
                  ].map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-mono text-[11px] text-stone py-2">{row.id}</TableCell>
                      <TableCell className="py-2 text-[13px]">{row.user}</TableCell>
                      <TableCell className="py-2 text-[11px] text-stone text-right">{row.age}</TableCell>
                      <TableCell className="py-2 text-right">
                         {row.assignee === "unassigned" ? (
                          <Tooltip content="Navigate to User Profile Directory to manually review the flagged BVN mismatch" position="left" delay={150}>
                            <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={() => navigate('/admin/users')}>Assign</Button>
                          </Tooltip>
                         ) : (
                            <span className="text-[11px] px-2 py-0.5 bg-bg-paper rounded border border-rule text-stone">{row.assignee}</span>
                         )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {opsTab === "giftcards" && [
                    { id: "gc_992", user: "Amazon $100", age: "2m", assignee: "unassigned" },
                    { id: "gc_991", user: "Steam $50", age: "4m", assignee: "Tobi" },
                    { id: "gc_990", user: "Apple $200", age: "15m", assignee: "unassigned" },
                  ].map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-mono text-[11px] text-stone py-2">{row.id}</TableCell>
                      <TableCell className="py-2 text-[13px]">{row.user}</TableCell>
                      <TableCell className="py-2 text-[11px] text-stone text-right">{row.age}</TableCell>
                      <TableCell className="py-2 text-right">
                         {row.assignee === "unassigned" ? (
                          <Tooltip content="Review invalid giftcard submissions in the Voucher Redemption queue" position="left" delay={150}>
                            <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={() => navigate('/admin/giftcards')}>Assign</Button>
                          </Tooltip>
                         ) : (
                            <span className="text-[11px] px-2 py-0.5 bg-bg-paper rounded border border-rule text-stone">{row.assignee}</span>
                         )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {opsTab === "disputes" && [
                    { id: "disp_11", user: "Buyer Appeal", age: "10m", assignee: "unassigned" },
                    { id: "disp_10", user: "Seller No Release", age: "45m", assignee: "unassigned" },
                  ].map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-mono text-[11px] text-stone py-2">{row.id}</TableCell>
                      <TableCell className="py-2 text-[13px]">{row.user}</TableCell>
                      <TableCell className="py-2 text-[11px] text-stone text-right">{row.age}</TableCell>
                      <TableCell className="py-2 text-right">
                         {row.assignee === "unassigned" ? (
                          <Tooltip content="Open P2P Arbitration center to immediately mediate this unassigned frozen dispute" position="left" delay={150}>
                            <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={() => navigate('/admin/disputes')}>Assign</Button>
                          </Tooltip>
                         ) : (
                            <span className="text-[11px] px-2 py-0.5 bg-bg-paper rounded border border-rule text-stone">{row.assignee}</span>
                         )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
             </Table>
          </div>
          <div className="p-3 border-t border-rule mt-auto flex justify-end">
             <Tooltip content="Open full detailed view of all pending queues and assignments for this module" position="left" delay={150}>
               <Button variant="link" className="text-xs h-6 px-2 text-stone hover:text-cream" onClick={() => {
                  if (opsTab === 'kyc') navigate('/admin/users');
                  else if (opsTab === 'giftcards') navigate('/admin/giftcards');
                  else navigate('/admin/disputes');
               }}>View all &rarr;</Button>
             </Tooltip>
          </div>
        </Card>
       </div>
    </div>
  )
}

function StatTile({ label, value, delta, trend, hasAlert, onClick }: { label: string, value: string, delta: string, trend: "good"|"bad"|"neutral", hasAlert?: boolean, onClick?: () => void }) {
  return (
    <Card className={`bg-bg-elev border-rule overflow-hidden relative shrink-0 min-w-[140px] ${onClick ? 'cursor-pointer hover:border-lime/30 transition-colors hover:bg-bg-paper' : ''}`} onClick={onClick}>
      {hasAlert && <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-bad shrink-0"></span>}
      <CardContent className="p-4 flex flex-col justify-between h-full space-y-2">
        <p className="text-[10px] font-medium text-stone uppercase tracking-wide">{label}</p>
        <div>
          <p className="text-2xl font-display text-cream leading-none tracking-tight">{value}</p>
          {delta && (
            <div className="mt-2 flex items-center gap-1 text-[11px]">
              {trend === 'good' && <span className="bg-good/20 text-good px-1 rounded inline-flex items-center leading-tight font-mono">{delta}</span>}
              {trend === 'bad' && <span className="bg-bad/20 text-bad px-1 rounded inline-flex items-center leading-tight font-mono">{delta}</span>}
              {trend === 'neutral' && <span className="text-stone font-mono">{delta}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
