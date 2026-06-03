import { useState, FormEvent } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Megaphone, Plus, MoreHorizontal, MousePointerClick, Eye, Users, X } from "lucide-react"

export default function Marketing() {
  const [creating, setCreating] = useState(false)
  const [rowMenuOpenId, setRowMenuOpenId] = useState<string | null>(null)
  const [notification, setNotification] = useState<string | null>(null)

  // Stateful list of campaigns
  const [campaigns, setCampaigns] = useState([
     { id: "camp-zero-fee-december", name: "Zero Fee December", type: "Hero Banner", status: "Active", date: "Dec 1", imp: "450K", ctr: "5.2%", endDate: "2026-12-31", assetUrl: "" },
     { id: "camp-referral-bonus-v2", name: "Referral Bonus v2", type: "Push Notification", status: "Active", date: "Nov 15", imp: "120K", ctr: "12.4%", endDate: "2026-11-30", assetUrl: "" },
     { id: "camp-p2p-trader-leaderboard", name: "P2P Trader Leaderboard", type: "In-App Modal", status: "Scheduled", date: "Jan 1", imp: "-", ctr: "-", endDate: "2026-01-15", assetUrl: "" },
     { id: "camp-black-friday-crypto", name: "Black Friday Crypto", type: "Email Blast", status: "Completed", date: "Nov 24", imp: "85K", ctr: "8.1%", endDate: "2026-11-28", assetUrl: "" },
  ])

  // Controlled form states
  const [formName, setFormName] = useState("")
  const [formType, setFormType] = useState("Hero Banner")
  const [formStart, setFormStart] = useState("")
  const [formEnd, setFormEnd] = useState("")
  const [formAssetUrl, setFormAssetUrl] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setNotification(msg)
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const openNewCampaign = () => {
    setEditingId(null)
    setFormName("")
    setFormType("Hero Banner")
    setFormStart("")
    setFormEnd("")
    setFormAssetUrl("")
    setCreating(true)
  }

  const openEditCampaign = (campaign: any) => {
    setEditingId(campaign.id)
    setFormName(campaign.name)
    setFormType(campaign.type)
    setFormStart(campaign.date)
    setFormEnd(campaign.endDate || "")
    setFormAssetUrl(campaign.assetUrl || "")
    setCreating(true)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) return

    if (editingId) {
      setCampaigns(prev => prev.map(c => c.id === editingId ? {
        ...c,
        name: formName,
        type: formType,
        date: formStart || c.date,
        endDate: formEnd,
        assetUrl: formAssetUrl
      } : c))
      showToast(`Campaign "${formName}" updated successfully.`)
    } else {
      const newId = `camp-${formName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
      const newCamp = {
        id: newId,
        name: formName,
        type: formType,
        status: "Scheduled" as const,
        date: formStart || "Today",
        imp: "-",
        ctr: "-",
        endDate: formEnd,
        assetUrl: formAssetUrl
      }
      setCampaigns(prev => [newCamp, ...prev])
      showToast(`Campaign "${formName}" deployed successfully.`)
    }
    setCreating(false)
  }

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-6rem)] relative">
      <div className="flex justify-between items-end shrink-0">
        <div>
           <h1 className="text-xl font-display font-medium">Marketing & Campaigns</h1>
           <p className="text-stone text-xs mt-1">Manage platform banners, promotions, and push notifications.</p>
        </div>
        <Button className="gap-2" id="btn-new-campaign" onClick={openNewCampaign}>
          <Plus className="w-4 h-4"/> New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
         <Card className="bg-bg-elev border-rule p-4">
            <div className="flex items-center gap-2 text-stone text-xs font-medium uppercase tracking-wider mb-2"><Eye className="w-4 h-4"/> Active Impressions</div>
            <div className="text-2xl font-mono text-cream">1.2M</div>
         </Card>
         <Card className="bg-bg-elev border-rule p-4">
            <div className="flex items-center gap-2 text-stone text-xs font-medium uppercase tracking-wider mb-2"><MousePointerClick className="w-4 h-4"/> Total CTR</div>
            <div className="text-2xl font-mono text-cream">4.8%</div>
         </Card>
         <Card className="bg-bg-elev border-rule p-4">
            <div className="flex items-center gap-2 text-stone text-xs font-medium uppercase tracking-wider mb-2"><Users className="w-4 h-4"/> Conversions (30d)</div>
            <div className="text-2xl font-mono text-cream">8,401</div>
         </Card>
      </div>
      
      <Card className="bg-bg-elev border-rule flex-1 flex flex-col relative overflow-hidden">
         <div className="p-4 border-b border-rule bg-bg-paper">
            <h3 className="font-medium">Active Campaigns</h3>
         </div>
         <div className="overflow-y-auto flex-1">
            <Table>
               <TableHeader>
                  <TableRow className="border-rule">
                     <TableHead>Campaign Name</TableHead>
                     <TableHead>Type</TableHead>
                     <TableHead>Status</TableHead>
                     <TableHead>Start Date</TableHead>
                     <TableHead className="text-right">Impressions</TableHead>
                     <TableHead className="text-right">CTR</TableHead>
                     <TableHead className="w-10"></TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {campaigns.map((row) => (
                     <TableRow key={row.id} className="group">
                        <TableCell className="font-medium text-[13px]">{row.name}</TableCell>
                        <TableCell className="text-xs text-stone">{row.type}</TableCell>
                        <TableCell>
                           <Badge 
                             variant={
                               row.status === 'Active' 
                                 ? 'success' 
                                 : row.status === 'Scheduled' 
                                 ? 'secondary' 
                                 : row.status === 'Paused'
                                 ? 'warning'
                                 : 'outline'
                             } 
                             className="text-[10px]"
                           >
                              {row.status}
                           </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-stone font-mono">{row.date}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{row.imp}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{row.ctr}</TableCell>
                        <TableCell onClick={e => e.stopPropagation()} className="relative">
                           <Button 
                             id={`btn-dropdown-mkt-${row.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} 
                             variant="ghost" 
                             size="icon" 
                             className="h-6 w-6 text-stone hover:text-cream"
                             onClick={(e) => {
                               e.stopPropagation()
                               setRowMenuOpenId(rowMenuOpenId === row.id ? null : row.id)
                             }}
                           >
                              <MoreHorizontal className="w-4 h-4" />
                           </Button>

                           {rowMenuOpenId === row.id && (
                              <>
                                 <div className="fixed inset-0 z-10" onClick={() => setRowMenuOpenId(null)} />
                                 <div className="absolute right-0 mt-1 w-36 bg-bg-elev border border-rule rounded shadow-xl z-20 overflow-hidden font-sans py-1 text-left">
                                    {row.status !== "Completed" && row.status !== "Paused" && (
                                       <button
                                          id={`btn-mkt-pause-${row.id}`}
                                          className="w-full text-left px-3 py-1.5 text-[10px] text-warn hover:bg-warn/10 transition-colors"
                                          onClick={() => {
                                             setRowMenuOpenId(null)
                                             setCampaigns(prev => prev.map(c => c.id === row.id ? { ...c, status: "Paused" } : c))
                                             showToast(`Campaign "${row.name}" paused.`)
                                          }}
                                       >
                                          Pause Campaign
                                       </button>
                                    )}
                                    {row.status === "Paused" && (
                                       <button
                                          id={`btn-mkt-resume-${row.id}`}
                                          className="w-full text-left px-3 py-1.5 text-[10px] text-lime hover:bg-lime/10 transition-colors"
                                          onClick={() => {
                                             setRowMenuOpenId(null)
                                             setCampaigns(prev => prev.map(c => c.id === row.id ? { ...c, status: "Active" } : c))
                                             showToast(`Campaign "${row.name}" resumed.`)
                                          }}
                                       >
                                          Resume Campaign
                                       </button>
                                    )}
                                    <button
                                       id={`btn-mkt-edit-${row.id}`}
                                       className="w-full text-left px-3 py-1.5 text-[10px] text-cream hover:bg-bg-paper transition-colors"
                                       onClick={() => {
                                          setRowMenuOpenId(null)
                                          openEditCampaign(row)
                                       }}
                                    >
                                       Edit Campaign
                                    </button>
                                    <button
                                       id={`btn-mkt-delete-${row.id}`}
                                       className="w-full text-left px-3 py-1.5 text-[10px] text-bad hover:bg-bad/10 transition-colors"
                                       onClick={() => {
                                          setRowMenuOpenId(null)
                                          setCampaigns(prev => prev.filter(c => c.id !== row.id))
                                          showToast(`Campaign "${row.name}" deleted.`)
                                       }}
                                    >
                                       Delete Campaign
                                    </button>
                                 </div>
                              </>
                           )}
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>
      </Card>
      
      {/* Sliding Drawer for New/Edit Campaign */}
      {creating && (
         <>
            <div className="fixed inset-0 z-40 bg-bg-base/50" onClick={() => setCreating(false)} />
            <div className="absolute top-0 right-0 h-full w-[400px] border-l border-rule bg-bg-elev z-50 flex flex-col p-6 animate-in slide-in-from-right-8 duration-200">
               <div className="flex justify-between items-center mb-8 shrink-0">
                  <h3 className="text-lg font-medium">{editingId ? "Edit Campaign" : "New Campaign"}</h3>
                  <Button variant="ghost" size="icon" onClick={() => setCreating(false)}><X className="w-4 h-4"/></Button>
               </div>
               
               <form onSubmit={handleSubmit} className="flex flex-col flex-1">
                  <div className="flex-1 overflow-y-auto space-y-6 -mx-2 px-2">
                     <div>
                        <label className="text-[11px] font-medium text-stone block mb-1.5 uppercase tracking-wider">Campaign Name</label>
                        <Input 
                          id="mkt-input-name"
                          className="bg-bg-base h-9 text-xs" 
                          placeholder="e.g. Easter Promo" 
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          required
                        />
                     </div>
                     <div>
                        <label className="text-[11px] font-medium text-stone block mb-1.5 uppercase tracking-wider">Campaign Type</label>
                        <select 
                          id="mkt-select-type"
                          className="w-full bg-bg-base border border-rule rounded-md h-9 text-xs px-3 outline-none focus:border-lime/50 text-cream"
                          value={formType}
                          onChange={(e) => setFormType(e.target.value)}
                        >
                           <option>Hero Banner</option>
                           <option>Push Notification</option>
                           <option>In-App Modal</option>
                           <option>Email Blast</option>
                        </select>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-[11px] font-medium text-stone block mb-1.5 uppercase tracking-wider">Start Date</label>
                           <Input 
                             id="mkt-input-start"
                             className="bg-bg-base h-9 text-xs" 
                             value={formStart}
                             onChange={(e) => setFormStart(e.target.value)}
                             placeholder="e.g. Dec 1"
                           />
                        </div>
                        <div>
                           <label className="text-[11px] font-medium text-stone block mb-1.5 uppercase tracking-wider">End Date</label>
                           <Input 
                             id="mkt-input-end"
                             className="bg-bg-base h-9 text-xs" 
                             value={formEnd}
                             onChange={(e) => setFormEnd(e.target.value)}
                             placeholder="e.g. Dec 31"
                           />
                        </div>
                     </div>
                     <div>
                        <label className="text-[11px] font-medium text-stone block mb-1.5 uppercase tracking-wider">Creative Asset URL (Optional)</label>
                        <Input 
                          id="mkt-input-asset"
                          className="bg-bg-base h-9 text-xs" 
                          placeholder="https://" 
                          value={formAssetUrl}
                          onChange={(e) => setFormAssetUrl(e.target.value)}
                        />
                     </div>
                     <div>
                        <label className="text-[11px] font-medium text-stone block mb-1.5 uppercase tracking-wider">Target Audience Segments</label>
                        <div className="space-y-2">
                           <label className="flex items-center gap-2 cursor-pointer p-3 border border-rule rounded bg-bg-base">
                              <input type="checkbox" className="rounded-sm bg-bg-paper border-rule accent-lime" defaultChecked />
                              <span className="text-xs text-stone">All Verified Users</span>
                           </label>
                           <label className="flex items-center gap-2 cursor-pointer p-3 border border-rule rounded bg-bg-base">
                              <input type="checkbox" className="rounded-sm bg-bg-paper border-rule accent-lime" />
                              <span className="text-xs text-stone">Dormant &gt; 30 Days</span>
                           </label>
                           <label className="flex items-center gap-2 cursor-pointer p-3 border border-rule rounded bg-bg-base">
                              <input type="checkbox" className="rounded-sm bg-bg-paper border-rule accent-lime" />
                              <span className="text-xs text-stone">High Volume Traders</span>
                           </label>
                        </div>
                     </div>
                  </div>
                  
                  <div className="pt-6 border-t border-rule flex justify-end gap-3 mt-auto shrink-0 bg-bg-elev">
                     <Button type="button" variant="ghost" onClick={() => setCreating(false)}>Cancel</Button>
                     <Button id="btn-submit-campaign" type="submit">
                       {editingId ? "Save Campaign" : "Deploy Campaign"}
                     </Button>
                  </div>
               </form>
            </div>
         </>
      )}

      {/* Floating Action Notifications */}
      {notification && (
        <div id="toast-message-mkt" className="fixed bottom-4 right-4 bg-lime text-bg-base font-bold text-xs px-4 py-3 rounded shadow-lg flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-80">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  )
}
