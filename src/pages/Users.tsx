import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Search, Filter, MoreHorizontal, CheckCircle, X, Lock, UserMinus, Loader2, RefreshCw } from "lucide-react"

const MOCK_USERS = [
  { id: "usr_8f92ma", name: "Adaeze Okonkwo", email: "adaeze@example.com", tier: "Silver", status: "Active", country: "NG", volume: "₦4.2M", lastActive: "2m ago", trades: 14, issues: 0 },
  { id: "usr_b2x91p", name: "Chibueze Eze", email: "ceze@example.com", tier: "Gold", status: "Active", country: "NG", volume: "₦12.8M", lastActive: "1h ago", trades: 42, issues: 1 },
  { id: "usr_94mdx2", name: "Funke Adebayo", email: "funke.a@example.com", tier: "Bronze", status: "Suspended", country: "NG", volume: "₦0", lastActive: "3d ago", trades: 0, issues: 0 },
  { id: "usr_ll290s", name: "Ibrahim Musa", email: "imusa99@example.com", tier: "Platinum", status: "Active", country: "NG", volume: "₦56.2M", lastActive: "12m ago", trades: 124, issues: 0 },
  { id: "usr_pz84ne", name: "Ngozi Anosike", email: "nanosike@example.com", tier: "Silver", status: "Active", country: "NG", volume: "₦2.1M", lastActive: "1d ago", trades: 8, issues: 0 },
  { id: "usr_4kx8me", name: "Sunday Amford", email: "sunday@example.com", tier: "Bronze", status: "Active", country: "NG", volume: "₦150K", lastActive: "5m ago", trades: 2, issues: 0 },
]

export default function UsersList() {
  const navigate = useNavigate()
  
  // Simulated database sync with localStorage
  const [users, setUsers] = useState(() => {
    const freezes = JSON.parse(localStorage.getItem("volt-users-freezes") || "{}")
    const suspensions = JSON.parse(localStorage.getItem("volt-users-suspensions") || "{}")
    const tiers = JSON.parse(localStorage.getItem("volt-users-tiers") || "{}")
    
    return MOCK_USERS.map(u => {
      let status = u.status
      if (suspensions[u.id]) status = "Suspended"
      else if (freezes[u.id]) status = "Frozen"
      
      return {
        ...u,
        tier: tiers[u.id] || u.tier,
        status
      }
    })
  })

  // States
  const [searchTerm, setSearchTerm] = useState("")
  const [tierFilter, setTierFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [countryFilter, setCountryFilter] = useState("All")
  
  const [selectedRowIds, setSelectedRowIds] = useState<Record<string, boolean>>({})
  const [exporting, setExporting] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)
  const [rowMenuOpenId, setRowMenuOpenId] = useState<string | null>(null)

  // Force re-sync when localStorage updates or page gains focus
  useEffect(() => {
    const syncWithStorage = () => {
      const freezes = JSON.parse(localStorage.getItem("volt-users-freezes") || "{}")
      const suspensions = JSON.parse(localStorage.getItem("volt-users-suspensions") || "{}")
      const tiers = JSON.parse(localStorage.getItem("volt-users-tiers") || "{}")
      
      setUsers(MOCK_USERS.map(u => {
        let status = u.status
        if (suspensions[u.id]) status = "Suspended"
        else if (freezes[u.id]) status = "Frozen"
        
        return {
          ...u,
          tier: tiers[u.id] || u.tier,
          status
        }
      }))
    }
    
    window.addEventListener("focus", syncWithStorage)
    return () => window.removeEventListener("focus", syncWithStorage)
  }, [])

  // Auto-clear notification toast
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  // Filter application
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTier = tierFilter === "All" || u.tier === tierFilter
    const matchesStatus = statusFilter === "All" || u.status === statusFilter
    const matchesCountry = countryFilter === "All" || u.country === countryFilter
    
    return matchesSearch && matchesTier && matchesStatus && matchesCountry
  })

  // Multi-select actions
  const toggleSelectAll = () => {
    const allSelected = filteredUsers.length > 0 && filteredUsers.every(u => selectedRowIds[u.id])
    if (allSelected) {
      setSelectedRowIds({})
    } else {
      const nextMap: Record<string, boolean> = {}
      filteredUsers.forEach(u => {
        nextMap[u.id] = true
      })
      setSelectedRowIds(nextMap)
    }
  }
  
  const toggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedRowIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const selectedCount = Object.values(selectedRowIds).filter(Boolean).length

  // Action executor helpers
  const handleBulkFreeze = () => {
    const freezes = JSON.parse(localStorage.getItem("volt-users-freezes") || "{}")
    Object.keys(selectedRowIds).forEach(id => {
      if (selectedRowIds[id]) freezes[id] = true
    })
    localStorage.setItem("volt-users-freezes", JSON.stringify(freezes))
    
    setUsers(users.map(u => selectedRowIds[u.id] ? { ...u, status: "Frozen" } : u))
    setSelectedRowIds({})
    setNotification(`Placed precautionary withdrawal freezes on ${selectedCount} selected accounts.`)
  }

  const handleBulkSuspend = () => {
    const suspensions = JSON.parse(localStorage.getItem("volt-users-suspensions") || "{}")
    Object.keys(selectedRowIds).forEach(id => {
      if (selectedRowIds[id]) suspensions[id] = true
    })
    localStorage.setItem("volt-users-suspensions", JSON.stringify(suspensions))
    
    setUsers(users.map(u => selectedRowIds[u.id] ? { ...u, status: "Suspended" } : u))
    setSelectedRowIds({})
    setNotification(`Successfully suspended credentials access for ${selectedCount} profiles.`)
  }

  const triggerExport = () => {
    setExporting(true)
    setTimeout(() => {
      setExporting(false)
      setNotification("Export completed. matched 84,210 audit-ready rows in ledger CSV.")
    }, 1500)
  }

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Floating Toast Notification */}
      {notification && (
        <div id="users-notif-toast" className="fixed top-4 right-4 bg-bg-elev border-l-4 border-lime text-cream p-3 text-xs rounded shadow-2xl z-50 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-lime animate-pulse" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-stone hover:text-cream ml-2">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-display font-medium">Users</h1>
          <p className="text-stone text-xs mt-1">84,210 users total</p>
        </div>
        <Button 
          id="btn-export-users"
          variant="outline" 
          disabled={exporting}
          className="gap-2 h-9 text-xs"
          onClick={triggerExport}
        >
          {exporting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Preparing...
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              Export
            </>
          )}
        </Button>
      </div>

      <Card className="bg-bg-elev border-rule overflow-hidden">
        {/* Bulk action bar */}
        {selectedCount > 0 && (
          <div id="users-bulk-bar" className="bg-lime/10 border-b border-lime/30 px-4 py-3 flex items-center justify-between animate-in slide-in-from-top-4 duration-150">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse"></span>
              <span className="text-xs text-lime font-mono font-medium">{selectedCount} users selected for bulk administration</span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                id="btn-bulk-freeze"
                variant="outline" 
                size="sm" 
                className="h-7 text-[10px] border-warn/30 text-warn hover:bg-warn/10 hover:text-warn gap-1 font-bold"
                onClick={handleBulkFreeze}
              >
                <Lock className="w-3 h-3" /> Bulk Freeze
              </Button>
              <Button 
                id="btn-bulk-suspend"
                variant="outline" 
                size="sm" 
                className="h-7 text-[10px] border-bad/30 text-bad hover:bg-bad/10 hover:text-bad gap-1 font-bold"
                onClick={handleBulkSuspend}
              >
                <UserMinus className="w-3 h-3" /> Bulk Suspend
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-[10px] text-stone hover:text-cream px-2"
                onClick={() => setSelectedRowIds({})}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        )}

        <div className="p-4 border-b border-rule flex items-center justify-between gap-4 flex-wrap bg-bg-paper">
          {/* Dynamic styled custom filter select dropdowns */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 bg-bg-base border border-rule rounded px-2.5 h-8">
              <Filter className="w-3.5 h-3.5 text-stone" />
              <select 
                id="filter-tier"
                value={tierFilter} 
                onChange={(e) => setTierFilter(e.target.value)} 
                className="bg-transparent text-cream text-[11px] outline-none cursor-pointer pr-4 font-medium"
              >
                <option value="All">KYC Tier: All</option>
                <option value="Bronze">Bronze</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-bg-base border border-rule rounded px-2.5 h-8">
              <Filter className="w-3.5 h-3.5 text-stone" />
              <select 
                id="filter-status"
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)} 
                className="bg-transparent text-cream text-[11px] outline-none cursor-pointer pr-4 font-medium"
              >
                <option value="All">Status: All</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Frozen">Frozen</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-bg-base border border-rule rounded px-2.5 h-8">
              <Filter className="w-3.5 h-3.5 text-stone" />
              <select 
                id="filter-country"
                value={countryFilter} 
                onChange={(e) => setCountryFilter(e.target.value)} 
                className="bg-transparent text-cream text-[11px] outline-none cursor-pointer pr-4 font-medium"
              >
                <option value="All">Country: All</option>
                <option value="NG">NG</option>
              </select>
            </div>

            {(tierFilter !== "All" || statusFilter !== "All" || countryFilter !== "All") && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-[10px] text-lime hover:text-lime/80"
                onClick={() => {
                  setTierFilter("All")
                  setStatusFilter("All")
                  setCountryFilter("All")
                }}
              >
                Reset Filters
              </Button>
            )}
          </div>

          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
            <Input 
              id="search-users-input"
              className="pl-9 bg-bg-paper text-xs text-cream h-8" 
              placeholder="user_id, email, name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10 text-center">
                <input 
                  type="checkbox" 
                  className="rounded-sm bg-bg-paper border-rule accent-lime w-3.5 h-3.5 cursor-pointer mt-1" 
                  checked={filteredUsers.length > 0 && filteredUsers.every(u => selectedRowIds[u.id])}
                  onChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Lifetime Vol</TableHead>
              <TableHead className="text-right">Trades (30d)</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-stone text-xs">
                  No users matched your current query constraints.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => {
                const isSelected = !!selectedRowIds[user.id]
                return (
                  <TableRow 
                    key={user.id} 
                    className={`cursor-pointer transition-colors ${isSelected ? 'bg-lime/[0.02] hover:bg-lime/[0.04]' : 'hover:bg-bg-paper/40'}`}
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                  >
                    <TableCell className="w-10 text-center" onClick={e => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        className="rounded-sm bg-bg-paper border-rule accent-lime w-3.5 h-3.5 cursor-pointer mt-1" 
                        checked={isSelected}
                        onChange={(e) => toggleSelectRow(user.id, e as any)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-bg-base border border-rule flex items-center justify-center text-xs font-semibold text-stone">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-cream text-xs">{user.name}</p>
                          <p className="text-[10px] text-stone font-mono">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.tier === 'Platinum' ? 'default' : user.tier === 'Gold' ? 'warning' : user.tier === 'Silver' ? 'secondary' : 'outline'} className="text-[9px]">
                        {user.tier}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.status === 'Active' ? 'success' : 'destructive'} 
                        className={`font-mono text-[9px] uppercase ${user.status === 'Frozen' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : ''}`}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-[11px] text-cream">{user.volume}</TableCell>
                    <TableCell className="text-right font-mono text-[11px] text-cream">{user.trades}</TableCell>
                    <TableCell className="text-[10px] text-stone whitespace-nowrap">{user.lastActive}</TableCell>
                    <TableCell onClick={e => e.stopPropagation()} className="relative">
                      <Button 
                        id={`btn-dropdown-user-${user.id}`}
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-stone hover:text-cream"
                        onClick={(e) => {
                          e.stopPropagation()
                          setRowMenuOpenId(rowMenuOpenId === user.id ? null : user.id)
                        }}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>

                      {rowMenuOpenId === user.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setRowMenuOpenId(null)} />
                          <div className="absolute right-0 mt-1 w-36 bg-bg-elev border border-rule rounded shadow-xl z-20 overflow-hidden font-sans py-1">
                            <button
                              className="w-full text-left px-3 py-1.5 text-[10px] text-cream hover:bg-bg-paper transition-colors"
                              onClick={() => {
                                setRowMenuOpenId(null)
                                navigate(`/admin/users/${user.id}`)
                              }}
                            >
                              View Profile
                            </button>
                            {user.status !== "Frozen" && (
                              <button
                                className="w-full text-left px-3 py-1.5 text-[10px] text-warn hover:bg-warn/10 transition-colors"
                                onClick={() => {
                                  setRowMenuOpenId(null)
                                  const freezes = JSON.parse(localStorage.getItem("volt-users-freezes") || "{}")
                                  freezes[user.id] = true
                                  localStorage.setItem("volt-users-freezes", JSON.stringify(freezes))
                                  setUsers(users.map(u => u.id === user.id ? { ...u, status: "Frozen" } : u))
                                  setNotification(`Imposed hold constraints on ${user.name}'s account exits.`)
                                }}
                              >
                                Freeze Account
                              </button>
                            )}
                            {user.status !== "Suspended" && (
                              <button
                                className="w-full text-left px-3 py-1.5 text-[10px] text-bad hover:bg-bad/10 transition-colors"
                                onClick={() => {
                                  setRowMenuOpenId(null)
                                  const suspensions = JSON.parse(localStorage.getItem("volt-users-suspensions") || "{}")
                                  suspensions[user.id] = true
                                  localStorage.setItem("volt-users-suspensions", JSON.stringify(suspensions))
                                  setUsers(users.map(u => u.id === user.id ? { ...u, status: "Suspended" } : u))
                                  setNotification(`Suspended ${user.name} credentials access.`)
                                }}
                              >
                                Suspend Account
                              </button>
                            )}
                            {user.status !== "Active" && (
                              <button
                                className="w-full text-left px-3 py-1.5 text-[10px] text-good hover:bg-good/10 transition-colors"
                                onClick={() => {
                                  setRowMenuOpenId(null)
                                  
                                  const freezes = JSON.parse(localStorage.getItem("volt-users-freezes") || "{}")
                                  const suspensions = JSON.parse(localStorage.getItem("volt-users-suspensions") || "{}")
                                  delete freezes[user.id]
                                  delete suspensions[user.id]
                                  localStorage.setItem("volt-users-freezes", JSON.stringify(freezes))
                                  localStorage.setItem("volt-users-suspensions", JSON.stringify(suspensions))
                                  
                                  setUsers(users.map(u => u.id === user.id ? { ...u, status: "Active" } : u))
                                  setNotification(`Restored ${user.name} eligibility status to Active `)
                                }}
                              >
                                Re-Activate Account
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>

        <div className="p-4 border-t border-rule flex items-center justify-between text-xs text-stone bg-bg-paper">
          <span>Showing {filteredUsers.length} of 84,210 users</span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-7 cursor-not-allowed opacity-50 text-[11px]">Prev</Button>
            <Button variant="outline" size="sm" className="h-7 text-cream border-stone text-[11px]">1</Button>
            <Button variant="outline" size="sm" className="h-7 text-[11px]">2</Button>
            <Button variant="outline" size="sm" className="h-7 text-[11px]">3</Button>
            <span className="px-2">...</span>
            <Button variant="outline" size="sm" className="h-7 text-[11px]">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
