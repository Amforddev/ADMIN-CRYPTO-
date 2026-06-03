import { useState, FormEvent } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, MoreHorizontal, FileText, FileQuestion, BookOpen, KeySquare, X } from "lucide-react"

interface CMSEntry {
  id: string
  type: "Blog" | "Help Center" | "Legal Docs" | "System Emails"
  title: string
  cat: string
  status: "Published" | "Draft"
  date: string
  author: string
  views: string
  description: string
  content: string
}

export default function CMS() {
  const [activeTab, setActiveTab] = useState<"Blog" | "Help Center" | "Legal Docs" | "System Emails">("Blog")
  const [creating, setCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [rowMenuOpenId, setRowMenuOpenId] = useState<string | null>(null)
  const [notification, setNotification] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Initial rich data for all tabs
  const [entries, setEntries] = useState<CMSEntry[]>([
    // Blog
    { 
      id: "blog-1", 
      type: "Blog", 
      title: "Understanding Bitcoin Halving 2024", 
      cat: "Crypto Education", 
      status: "Published", 
      date: "Nov 28, 2023", 
      author: "Sarah J.", 
      views: "4.2K", 
      description: "A comprehensive guide on Bitcoin halving cycles and their historical impacts on supply and market value.", 
      content: "# Understanding Bitcoin Halving 2024\n\nBitcoin halving happens every 210,000 blocks..." 
    },
    { 
      id: "blog-2", 
      type: "Blog", 
      title: "How to Keep Your P2P Trades Safe", 
      cat: "Security", 
      status: "Published", 
      date: "Nov 15, 2023", 
      author: "Security Team", 
      views: "12.8K", 
      description: "Learn standard safety procedures when executing peer-to-peer cryptocurrency trades on Volt.", 
      content: "# P2P Safety Procedures\n\nAlways verify payment before releasing funds..." 
    },
    { 
      id: "blog-3", 
      type: "Blog", 
      title: "Q4 Volt Updates: What's New?", 
      cat: "Product", 
      status: "Draft", 
      date: "Dec 01, 2023", 
      author: "James M.", 
      views: "-", 
      description: "An overview of upcoming product updates, feature expansions, and user interface enhancements.", 
      content: "# Q4 Updates\n\nWe are rolling out advanced multi-network sweeps..." 
    },

    // Help Center
    { 
      id: "hc-1", 
      type: "Help Center", 
      title: "How do I reset my Two-Factor Authentication (2FA)?", 
      cat: "Account Access", 
      status: "Published", 
      date: "Oct 12, 2023", 
      author: "Support Lead", 
      views: "1.5K", 
      description: "Step-by-step procedures to reset or recover Google Authenticator keys on your account.", 
      content: "# Resetting 2FA\n\nIf you have lost access to your device, contact secondary support..." 
    },
    { 
      id: "hc-2", 
      type: "Help Center", 
      title: "Understanding Fiat Deposit Settling Timelines", 
      cat: "Deposits & Withdrawals", 
      status: "Published", 
      date: "Sep 22, 2023", 
      author: "Compliance Dept", 
      views: "900", 
      description: "Detailed clearing timelines for ACH, bank wires, and instant credit transfers.", 
      content: "# Settlement Delays\n\nStandard clearing is within 1 business day..." 
    },
    { 
      id: "hc-3", 
      type: "Help Center", 
      title: "Custom Limits on P2P Trading Desks", 
      cat: "Limits & Verification", 
      status: "Draft", 
      date: "Oct 05, 2023", 
      author: "Support Lead", 
      views: "-", 
      description: "How users can apply for customized Tier-3 limits or institutional trading volumes.", 
      content: "# Desk Limits\n\nContact compliance@volt.com to request an increase..." 
    },

    // Legal Docs
    { 
      id: "legal-1", 
      type: "Legal Docs", 
      title: "Terms of Service - Update Nov 2023", 
      cat: "ToS", 
      status: "Published", 
      date: "Nov 01, 2023", 
      author: "General Counsel", 
      views: "25.3K", 
      description: "The definitive terms and conditions governing platform usage, arbitration, and jurisdiction.", 
      content: "# Volt Terms of Service\n\nBy accessing our platform, you agree to these terms..." 
    },
    { 
      id: "legal-2", 
      type: "Legal Docs", 
      title: "Privacy Policy Version 4.1", 
      cat: "Privacy", 
      status: "Published", 
      date: "Oct 30, 2023", 
      author: "General Counsel", 
      views: "18.1K", 
      description: "Our policy regarding the secure handling of personal data, cookies, and regulatory KYC requirements.", 
      content: "# Privacy Policy\n\nWe store KYC details in zero-trust encrypted tables..." 
    },
    { 
      id: "legal-3", 
      type: "Legal Docs", 
      title: "AML & Counter-Terrorist Financing Policy", 
      cat: "Compliance", 
      status: "Published", 
      date: "Sep 05, 2023", 
      author: "Compliance VP", 
      views: "8.5K", 
      description: "Institutional guidelines on regulatory compliance, risk profiling, and suspicious activity triggers.", 
      content: "# AML Guidelines\n\nVolt implements rigorous transactional analysis..." 
    },

    // System Emails
    { 
      id: "email-1", 
      type: "System Emails", 
      title: "User Registration OTP Notification", 
      cat: "Authentication", 
      status: "Published", 
      date: "Nov 15, 2023", 
      author: "Dev Team", 
      views: "145K", 
      description: "Automated OTP template triggered upon user sign-up or verification attempt.", 
      content: "Hi {{name}}, your requested registration OTP code is: **{{otp}}**." 
    },
    { 
      id: "email-2", 
      type: "System Emails", 
      title: "Abnormal Login Alert Warning", 
      cat: "Security Alerts", 
      status: "Published", 
      date: "Nov 12, 2023", 
      author: "Security Team", 
      views: "1.2K", 
      description: "Triggered when a login is initiated from a previously unrecognized IP address or geo-location.", 
      content: "Warning: A login was detected from IP {{ip}} at {{time}}." 
    },
    { 
      id: "email-3", 
      type: "System Emails", 
      title: "P2P Trade Dispute Opened Notification", 
      cat: "Disputes & Trading", 
      status: "Published", 
      date: "Oct 19, 2023", 
      author: "Trading Ops", 
      views: "340", 
      description: "Notification template dispatched to both buyer and seller when a dispute transaction is filed.", 
      content: "Dispute alert: Trade #{{tradeId}} has been flagged for manual administrative review." 
    }
  ])

  // Form states for adding/editing
  const [formTitle, setFormTitle] = useState("")
  const [formCategory, setFormCategory] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formContent, setFormContent] = useState("")

  const showToast = (msg: string) => {
    setNotification(msg)
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  // Get categories configured per tab
  const getCategoriesForTab = (tab: string) => {
    switch (tab) {
      case "Blog":
        return ["Crypto Education", "Security", "Product", "Announcements"]
      case "Help Center":
        return ["Account Access", "Deposits & Withdrawals", "Limits & Verification", "General Support"]
      case "Legal Docs":
        return ["ToS", "Privacy", "Compliance", "Disclaimer"]
      case "System Emails":
        return ["Authentication", "Security Alerts", "Disputes & Trading", "Invoicing"]
      default:
        return ["General"]
    }
  }

  const handleOpenNew = () => {
    setEditingId(null)
    setFormTitle("")
    const cats = getCategoriesForTab(activeTab)
    setFormCategory(cats[0] || "General")
    setFormDescription("")
    setFormContent("")
    setCreating(true)
  }

  const handleOpenEdit = (entry: CMSEntry) => {
    setEditingId(entry.id)
    setFormTitle(entry.title)
    setFormCategory(entry.cat)
    setFormDescription(entry.description)
    setFormContent(entry.content)
    setCreating(true)
  }

  const handleSaveEntry = (isPublish: boolean) => {
    if (!formTitle.trim()) return

    const selectedStatus = isPublish ? "Published" : "Draft"

    if (editingId) {
      setEntries(prev => prev.map(item => item.id === editingId ? {
        ...item,
        title: formTitle,
        cat: formCategory,
        status: selectedStatus,
        description: formDescription,
        content: formContent,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      } : item))
      showToast(`Entry "${formTitle}" updated, saved as ${selectedStatus}.`)
    } else {
      const newId = `${activeTab.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`
      const newEntry: CMSEntry = {
        id: newId,
        type: activeTab,
        title: formTitle,
        cat: formCategory,
        status: selectedStatus,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        author: "Admin Team",
        views: "-",
        description: formDescription,
        content: formContent
      }
      setEntries(prev => [newEntry, ...prev])
      showToast(`Entry "${formTitle}" added to ${activeTab} as ${selectedStatus}.`)
    }
    setCreating(false)
  }

  // Choose appropriate folder-style icons per content tab
  const getIconForTabType = (type: string) => {
    switch (type) {
      case "Help Center":
        return <FileQuestion className="w-4 h-4 text-stone" />
      case "Legal Docs":
        return <BookOpen className="w-4 h-4 text-stone" />
      case "System Emails":
        return <KeySquare className="w-4 h-4 text-stone" />
      default:
        return <FileText className="w-4 h-4 text-stone" />
    }
  }

  // Filter based on active tab & query search
  const filteredEntries = entries.filter(row => {
    if (row.type !== activeTab) return false
    if (searchQuery.trim() === "") return true
    const query = searchQuery.toLowerCase()
    return row.title.toLowerCase().includes(query) ||
           row.cat.toLowerCase().includes(query) ||
           row.description.toLowerCase().includes(query)
  })

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-6rem)] relative">
      <div className="flex justify-between items-end shrink-0">
        <div>
           <h1 className="text-xl font-display font-medium">Content Management (CMS)</h1>
           <p className="text-stone text-xs mt-1">Manage blog articles, knowledge base, and legal docs.</p>
        </div>
        <Button className="gap-2" id="btn-new-cms-entry" onClick={handleOpenNew}><Plus className="w-4 h-4"/> New Entry</Button>
      </div>
      
      <Card className="bg-bg-elev border-rule flex-1 flex flex-col relative overflow-hidden">
         <div className="flex overflow-x-auto border-b border-rule hide-scrollbar shrink-0 px-2 pt-2 bg-bg-paper">
            {(['Blog', 'Help Center', 'Legal Docs', 'System Emails'] as const).map(tab => (
               <button
                 key={tab}
                 id={`tab-cms-${tab.toLowerCase().replace(/\s/g, '-')}`}
                 onClick={() => {
                   setActiveTab(tab)
                   setSearchQuery("")
                 }}
                 className={`px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-lime text-lime' : 'border-transparent text-stone hover:text-cream'}`}
               >
                 {tab}
               </button>
            ))}
         </div>

         <div className="p-4 border-b border-rule bg-bg-base flex justify-between items-center">
            <div className="relative w-64">
               <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
               <Input 
                 className="pl-9 bg-bg-paper" 
                 placeholder={`Search inside ${activeTab.toLowerCase()}...`} 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
         </div>

         <div className="overflow-y-auto flex-1">
            <Table>
               <TableHeader>
                  <TableRow className="border-rule">
                     <TableHead>Title</TableHead>
                     <TableHead>Category</TableHead>
                     <TableHead>Status</TableHead>
                     <TableHead>Last Edited</TableHead>
                     <TableHead>Author</TableHead>
                     <TableHead className="text-right">Views</TableHead>
                     <TableHead className="w-10"></TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {filteredEntries.map((row) => (
                     <TableRow key={row.id} className="group">
                        <TableCell className="font-medium text-[13px] flex items-center gap-2">
                          {getIconForTabType(row.type)}
                          <div className="flex flex-col">
                            <span>{row.title}</span>
                            <span className="text-[10px] text-stone font-normal line-clamp-1 max-w-sm mt-0.5">{row.description}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-stone">{row.cat}</TableCell>
                        <TableCell>
                           <Badge variant={row.status === 'Published' ? 'secondary' : 'outline'} className="text-[10px] bg-bg-paper">
                              {row.status}
                           </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-stone font-mono">{row.date}</TableCell>
                        <TableCell className="text-xs text-cream/90">{row.author}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{row.views}</TableCell>
                        <TableCell onClick={e => e.stopPropagation()} className="relative text-right">
                           <Button 
                             id={`btn-dropdown-cms-${row.id}`} 
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
                                 <div className="absolute right-0 mt-1 w-40 bg-bg-elev border border-rule rounded shadow-xl z-20 overflow-hidden font-sans py-1 text-left">
                                    <button
                                       id={`btn-cms-edit-${row.id}`}
                                       className="w-full text-left px-3 py-1.5 text-[11px] text-cream hover:bg-bg-paper transition-colors block"
                                       onClick={() => {
                                          setRowMenuOpenId(null)
                                          handleOpenEdit(row)
                                       }}
                                    >
                                       Edit Entry
                                    </button>
                                    <button
                                       id={`btn-cms-toggle-${row.id}`}
                                       className="w-full text-left px-3 py-1.5 text-[11px] text-warn hover:bg-warn/10 transition-colors block"
                                       onClick={() => {
                                          setRowMenuOpenId(null)
                                          setEntries(prev => prev.map(e => e.id === row.id ? { ...e, status: e.status === "Published" ? "Draft" : "Published" } : e))
                                          showToast(`Status updated for "${row.title}"`)
                                       }}
                                    >
                                       {row.status === "Published" ? "Change to Draft" : "Publish Now"}
                                    </button>
                                    <button
                                       id={`btn-cms-delete-${row.id}`}
                                       className="w-full text-left px-3 py-1.5 text-[11px] text-bad hover:bg-bad/10 transition-colors block"
                                       onClick={() => {
                                          setRowMenuOpenId(null)
                                          setEntries(prev => prev.filter(e => e.id !== row.id))
                                          showToast(`Deleted content from ${row.type}.`)
                                       }}
                                    >
                                       Delete Entry
                                    </button>
                                 </div>
                              </>
                           )}
                        </TableCell>
                     </TableRow>
                  ))}
                  {filteredEntries.length === 0 && (
                     <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-stone text-xs">
                           No entries found in {activeTab}. Click "New Entry" to add one!
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </div>
      </Card>
      
      {/* Sliding Drawer for New/Edit Content */}
      {creating && (
         <>
            <div className="fixed inset-0 z-40 bg-bg-base/50" onClick={() => setCreating(false)} />
            <div className="absolute top-0 right-0 h-full w-[600px] border-l border-rule bg-bg-elev z-50 flex flex-col p-6 animate-in slide-in-from-right-8 duration-200">
               <div className="flex justify-between items-center mb-6 shrink-0">
                  <h3 className="text-lg font-medium">{editingId ? "Edit Content Entry" : `New ${activeTab} Entry`}</h3>
                  <Button variant="ghost" size="icon" onClick={() => setCreating(false)}><X className="w-4 h-4"/></Button>
               </div>
               
               <form onSubmit={(e) => { e.preventDefault(); handleSaveEntry(true); }} className="flex-1 flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-6 -mx-2 px-2">
                     <div>
                        <label className="text-[11px] font-medium text-stone block mb-1.5 uppercase tracking-wider">Title</label>
                        <Input 
                          id="cms-input-title"
                          className="bg-bg-base h-9 text-xs" 
                          placeholder="e.g. 5 ways to secure your crypto" 
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          required
                        />
                     </div>
                     <div>
                        <label className="text-[11px] font-medium text-stone block mb-1.5 uppercase tracking-wider">Category</label>
                        <select 
                          id="cms-select-category"
                          className="w-full bg-bg-base border border-rule rounded-md h-9 text-xs px-3 outline-none focus:border-lime/50 text-cream"
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                        >
                           {getCategoriesForTab(activeTab).map(cat => (
                             <option key={cat} value={cat}>{cat}</option>
                           ))}
                        </select>
                     </div>
                     <div>
                        <label className="text-[11px] font-medium text-stone block mb-1.5 uppercase tracking-wider">Excerpt / Description</label>
                        <textarea 
                          id="cms-input-desc"
                          className="w-full bg-bg-base border border-rule rounded-md text-xs p-3 min-h-[60px] outline-none focus:border-lime/50 resize-y text-cream" 
                          placeholder="Brief summary of the article..."
                          value={formDescription}
                          onChange={(e) => setFormDescription(e.target.value)}
                        />
                     </div>
                     <div className="flex-1 flex flex-col shrink-0 min-h-[300px]">
                        <label className="text-[11px] font-medium text-stone block mb-1.5 uppercase tracking-wider">Content Body (Markdown)</label>
                        <textarea 
                          id="cms-input-body"
                          className="flex-1 w-full bg-bg-base border border-rule rounded-md text-xs p-3 outline-none focus:border-lime/50 resize-none font-mono text-cream" 
                          placeholder="# Heading 1&#10;&#10;Start writing here..."
                          value={formContent}
                          onChange={(e) => setFormContent(e.target.value)}
                        />
                     </div>
                  </div>
                  
                  <div className="pt-6 border-t border-rule flex justify-end gap-3 mt-auto shrink-0 bg-bg-elev">
                     <Button type="button" variant="ghost" onClick={() => setCreating(false)}>Cancel</Button>
                     <Button type="button" variant="secondary" onClick={() => handleSaveEntry(false)}>Save Draft</Button>
                     <Button type="submit">Publish Now</Button>
                  </div>
               </form>
            </div>
         </>
      )}

      {/* Floating notifications */}
      {notification && (
        <div id="toast-message-cms" className="fixed bottom-4 right-4 bg-lime text-bg-base font-bold text-xs px-4 py-3 rounded shadow-lg flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-80">
            <X className="w-3 h-3 text-bg-base" />
          </button>
        </div>
      )}
    </div>
  )
}
