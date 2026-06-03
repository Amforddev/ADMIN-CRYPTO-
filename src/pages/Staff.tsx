import { useState, MouseEvent, FormEvent } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Shield, 
  KeySquare, 
  ShieldCheck, 
  Headphones, 
  X, 
  Check, 
  UserPlus, 
  Lock, 
  Unlock, 
  Settings2, 
  AlertTriangle,
  Mail,
  Sliders
} from "lucide-react"

interface StaffMember {
  id: string
  name: string
  email: string
  role: string
  dept: string
  active: string
  twofa: boolean
  status: "Active" | "Deactivated"
  permissions: string[]
  joinedAt: string
  icon: any
}

const INITIAL_STAFF: StaffMember[] = [
  { id: "staff_01", name: "Sunday Amford", email: "sunday@volt.finance", role: "Super Admin", icon: Shield, dept: "Engineering", active: "Now", twofa: true, status: "Active", joinedAt: "2025-01-10", permissions: ["System Control", "Escrow Releases", "User Overrides", "Treasury Drafts", "Full Settings"] },
  { id: "staff_02", name: "Ngozi Anosike", email: "ngozi@volt.finance", role: "Compliance Ops", icon: ShieldCheck, dept: "Risk & Compliance", active: "12m ago", twofa: true, status: "Active", joinedAt: "2025-03-15", permissions: ["User Overrides", "Compliance Freeze", "Audit Export"] },
  { id: "staff_03", name: "James Musa", email: "james.m@volt.finance", role: "Support L2", icon: Headphones, dept: "Customer Success", active: "1h ago", twofa: true, status: "Active", joinedAt: "2025-05-20", permissions: ["User Detail Read", "Dispute Resolution", "Messaging Server"] },
  { id: "staff_04", name: "Ade Tolu", email: "ade@volt.finance", role: "Treasury Manager", icon: KeySquare, dept: "Finance", active: "3d ago", twofa: false, status: "Active", joinedAt: "2025-02-01", permissions: ["Treasury Drafts", "Sweep Control", "Wallet Audit"] },
]

const ALL_ROLES = [
  { name: "Super Admin", dept: "Engineering", icon: Shield, desc: "Root access, financial sign-offs, and parameter overrides" },
  { name: "Compliance Ops", dept: "Risk & Compliance", icon: ShieldCheck, desc: "KYC reviews, account freeze actions, and audit extracts" },
  { name: "Support L2", dept: "Customer Success", icon: Headphones, desc: "Dispute resolutions, user records lookup, and message servers" },
  { name: "Treasury Manager", dept: "Finance", icon: KeySquare, desc: "Initiate hot sweeps, verify coin ledgers, and trade gas fees" }
]

const ALL_PERMISSIONS = [
  "System Control",
  "Escrow Releases",
  "User Overrides",
  "Treasury Drafts",
  "Full Settings",
  "Compliance Freeze",
  "Audit Export",
  "User Detail Read",
  "Dispute Resolution",
  "Messaging Server",
  "Sweep Control",
  "Wallet Audit"
]

export default function Staff() {
  const [list, setList] = useState<StaffMember[]>(INITIAL_STAFF)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null)
  
  // Modals & Panels state
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [isPermissionsEditOpen, setIsPermissionsEditOpen] = useState(false)
  
  // Custom Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  
  // Add Staff form fields
  const [newName, setNewName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newRole, setNewRole] = useState("Compliance Ops")
  const [newDept, setNewDept] = useState("Risk & Compliance")
  const [newEnforce2FA, setNewEnforce2FA] = useState(true)

  // Edit Permissions fields
  const [editingPermissions, setEditingPermissions] = useState<string[]>([])

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Filter lists based on Search Query
  const filteredStaff = list.filter(staff => {
    const q = searchQuery.toLowerCase()
    return staff.name.toLowerCase().includes(q) || 
           staff.email.toLowerCase().includes(q) || 
           staff.role.toLowerCase().includes(q) || 
           staff.dept.toLowerCase().includes(q)
  })

  // Handle invitation submission
  const handleInviteSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!newName || !newEmail) {
      triggerToast("Please provide both name and email of the staff member.")
      return
    }

    const matchedRole = ALL_ROLES.find(r => r.name === newRole)
    const newMember: StaffMember = {
      id: `staff_0${list.length + 1}`,
      name: newName,
      email: newEmail,
      role: newRole,
      dept: matchedRole?.dept || newDept,
      icon: matchedRole?.icon || ShieldCheck,
      active: "Never Logged",
      twofa: newEnforce2FA,
      status: "Active",
      joinedAt: new Date().toISOString().split("T")[0],
      permissions: newRole === "Super Admin" 
        ? ["System Control", "Escrow Releases", "User Overrides", "Full Settings"] 
        : newRole === "Compliance Ops" 
        ? ["User Overrides", "Compliance Freeze"]
        : newRole === "Support L2"
        ? ["User Detail Read", "Dispute Resolution"]
        : ["Treasury Drafts", "Sweep Control"]
    }

    setList(prev => [...prev, newMember])
    setIsInviteOpen(false)
    triggerToast(`Invitation sent successfully to ${newEmail}! Email generated.`)
    
    // reset form fields
    setNewName("")
    setNewEmail("")
    setNewRole("Compliance Ops")
    setNewDept("Risk & Compliance")
    setNewEnforce2FA(true)
  }

  // Handle action triggers
  const handleToggleStatus = (memberId: string) => {
    setList(prev => prev.map(m => {
      if (m.id === memberId) {
        const nextStatus = m.status === "Active" ? "Deactivated" : "Active"
        triggerToast(`Staff status successfully set to ${nextStatus} for ${m.name}.`)
        return { ...m, status: nextStatus }
      }
      return m
    }))
    setActiveDropdownId(null)
  }

  const handleEnforce2FA = (memberId: string) => {
    setList(prev => prev.map(m => {
      if (m.id === memberId) {
        triggerToast(`Required security warning sent to ${m.name}. 2FA re-verification requested.`)
        return { ...m, twofa: true }
      }
      return m
    }))
    setActiveDropdownId(null)
  }

  const handleOpenPermissionsEdit = (member: StaffMember) => {
    setSelectedStaff(member)
    setEditingPermissions(member.permissions)
    setIsPermissionsEditOpen(true)
    setActiveDropdownId(null)
  }

  const handleSavePermissions = () => {
    if (!selectedStaff) return
    setList(prev => prev.map(m => {
      if (m.id === selectedStaff.id) {
        return { ...m, permissions: editingPermissions }
      }
      return m
    }))
    setIsPermissionsEditOpen(false)
    triggerToast(`Updated compliance scope permissions for ${selectedStaff.name}.`)
  }

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-6rem)] relative font-sans text-cream">
      {/* Header Panel */}
      <div className="flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-xl font-display font-medium text-cream">Staff & Roles</h1>
          <p className="text-stone text-xs mt-1">Manage admin team access, permissions, and security policies.</p>
        </div>
        <Button 
          id="btn-invite-team-member"
          className="gap-2 bg-lime text-bg-base hover:bg-lime/90 font-bold uppercase text-xs h-9 tracking-wide px-4"
          onClick={() => setIsInviteOpen(true)}
        >
          <Plus className="w-4 h-4"/> Invite Team Member
        </Button>
      </div>

      {/* Main Table Interface */}
      <Card className="bg-bg-elev border-rule flex-1 flex flex-col relative overflow-hidden">
        {/* Table Search & Count toolbar */}
        <div className="p-4 border-b border-rule bg-bg-base flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone">
              Active Access Keys ({filteredStaff.length})
            </span>
            {searchQuery && (
              <Badge variant="outline" className="text-[10px] text-lime border-lime/30 py-0 px-2 h-5 flex items-center gap-1">
                Filter: "{searchQuery}"
                <X className="w-2.5 h-2.5 cursor-pointer text-stone hover:text-white" onClick={() => setSearchQuery("")} />
              </Badge>
            )}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
            <Input 
              id="search-staff-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-bg-paper text-xs h-8 border-rule text-cream focus-visible:ring-lime" 
              placeholder="Search name, role, email..." 
            />
          </div>
        </div>

        {/* Scrollable Staff Rows list */}
        <div className="overflow-y-auto flex-1 h-[calc(100vh-22rem)]">
          <Table>
            <TableHeader>
              <TableRow className="border-rule text-stone bg-bg-base/30">
                <TableHead className="w-[30%] text-[11px] font-bold uppercase tracking-wider text-stone">Staff Member</TableHead>
                <TableHead className="w-[20%] text-[11px] font-bold uppercase tracking-wider text-stone">Role</TableHead>
                <TableHead className="w-[18%] text-[11px] font-bold uppercase tracking-wider text-stone">Department</TableHead>
                <TableHead className="w-[12%] text-[11px] font-bold uppercase tracking-wider text-stone">Last Active</TableHead>
                <TableHead className="w-[10%] text-[11px] font-bold uppercase tracking-wider text-stone">2FA Security</TableHead>
                <TableHead className="w-[10%] text-[11px] font-bold uppercase tracking-wider text-stone text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-stone text-xs">
                    <AlertTriangle className="w-8 h-8 mx-auto text-stone/40 mb-2" />
                    No registered staff members found matching "{searchQuery}"
                  </TableCell>
                </TableRow>
              ) : (
                filteredStaff.map((staff) => {
                  const StaffIcon = staff.icon || Shield
                  return (
                    <TableRow 
                      key={staff.id} 
                      id={`row-staff-${staff.id}`}
                      className={`group hover:bg-bg-paper/40 cursor-pointer border-rule ${
                        staff.status === "Deactivated" ? "opacity-60 bg-black/10" : ""
                      }`}
                      onClick={() => setSelectedStaff(staff)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded bg-bg-base border flex items-center justify-center font-semibold text-[11px] ${
                            staff.status === "Deactivated" ? "border-rule text-stone/40" : "border-rule text-lime"
                          }`}>
                            {staff.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-cream group-hover:text-lime transition-colors">
                                {staff.name}
                              </span>
                              {staff.status === "Deactivated" && (
                                <span className="text-[9px] px-1 bg-red-900/40 text-red-400 border border-red-800/60 rounded font-semibold uppercase leading-none">
                                  Disabled
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] font-mono text-stone">{staff.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs">
                          <StaffIcon className={`w-3.5 h-3.5 ${
                            staff.status === "Deactivated" ? "text-stone" : "text-stone group-hover:text-lime transition-colors"
                          }`} />
                          <span className={staff.role === 'Super Admin' && staff.status === "Active" ? 'text-lime font-medium' : 'text-stone group-hover:text-cream transition-colors'}>
                            {staff.role}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-stone">{staff.dept}</TableCell>
                      <TableCell className="text-xs text-stone whitespace-nowrap">{staff.active}</TableCell>
                      <TableCell>
                        <Badge 
                          id={`badge-2fa-${staff.id}`}
                          variant={staff.twofa ? "success" : "destructive"} 
                          className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm font-semibold"
                        >
                          {staff.twofa ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block text-left">
                          <Button 
                            id={`btn-dropdown-staff-${staff.id}`} 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-stone hover:text-cream rounded-sm"
                            onClick={() => setActiveDropdownId(activeDropdownId === staff.id ? null : staff.id)}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>

                          {/* Options dropdown overlay menu */}
                          {activeDropdownId === staff.id && (
                            <div className="absolute right-0 mt-1 w-52 bg-bg-elev border border-rule shadow-2xl rounded-sm z-30 py-1 text-left animate-in fade-in duration-100 divide-y divide-rule/60">
                              <div className="px-3 py-1.5">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-stone">Team Controls</span>
                              </div>
                              <div className="py-1">
                                <button
                                  type="button"
                                  id={`action-edit-perm-${staff.id}`}
                                  className="w-full text-left px-3 py-1.5 text-xs rounded hover:bg-bg-paper text-cream flex items-center gap-2"
                                  onClick={() => handleOpenPermissionsEdit(staff)}
                                >
                                  <Sliders className="w-3.5 h-3.5 text-stone" />
                                  Edit Compliance Scope
                                </button>
                                <button
                                  type="button"
                                  id={`action-toggle-2fa-${staff.id}`}
                                  className="w-full text-left px-3 py-1.5 text-xs rounded hover:bg-bg-paper text-cream flex items-center gap-2"
                                  onClick={() => handleEnforce2FA(staff.id)}
                                >
                                  <Lock className="w-3.5 h-3.5 text-stone" />
                                  Enforce 2FA Reset
                                </button>
                              </div>
                              <div className="py-1">
                                <button
                                  type="button"
                                  id={`action-deactivate-${staff.id}`}
                                  className={`w-full text-left px-3 py-1.5 text-xs rounded hover:bg-bg-paper flex items-center gap-2 font-semibold ${
                                    staff.status === "Active" ? "text-red-400" : "text-lime"
                                  }`}
                                  onClick={() => handleToggleStatus(staff.id)}
                                >
                                  {staff.status === "Active" ? (
                                    <>
                                      <Lock className="w-3.5 h-3.5 text-red-400" />Deactivate Access
                                    </>
                                  ) : (
                                    <>
                                      <Unlock className="w-3.5 h-3.5 text-lime" />Re-enable Access
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Footer overview stats */}
        <div className="p-3.5 border-t border-rule bg-bg-base/60 text-stone text-[11px] flex justify-between items-center shrink-0">
          <span className="font-mono">SECURE TRAP CODES: VOLT-STAFF-LEDGER v2.4</span>
          <span>Registered Personnel: {list.length} / Maximum Allowed: 25</span>
        </div>
      </Card>

      {/* Invite Team Member Center Modal */}
      {isInviteOpen && (
        <div id="modal-invite-team" className="fixed inset-0 bg-bg-base/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-bg-elev border border-rule rounded-sm shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-100 flex flex-col">
            <div className="p-4 border-b border-rule bg-bg-paper flex items-center justify-between text-cream">
              <h3 className="text-sm font-semibold text-cream flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-lime" />
                Invite Administrative Member
              </h3>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-stone hover:text-cream rounded-sm" onClick={() => setIsInviteOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleInviteSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-stone tracking-wider block mb-1">Full Name</label>
                <Input 
                  id="invite-name-input"
                  type="text" 
                  value={newName} 
                  required
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-bg-base border-rule text-xs h-9 text-cream focus-visible:ring-lime" 
                  placeholder="e.g. Samuel Adekunle" 
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-stone tracking-wider block mb-1">Email address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-stone absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input 
                    id="invite-email-input"
                    type="email" 
                    value={newEmail} 
                    required
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="pl-9 bg-bg-base border-rule text-xs h-9 text-cream focus-visible:ring-lime" 
                    placeholder="e.g. samuel@volt.finance" 
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-stone tracking-wider block mb-1">Security Role Profile</label>
                <select 
                  id="invite-role-select"
                  value={newRole}
                  onChange={(e) => {
                    setNewRole(e.target.value)
                    const roleMatched = ALL_ROLES.find(r => r.name === e.target.value)
                    if (roleMatched) {
                      setNewDept(roleMatched.dept)
                    }
                  }}
                  className="w-full h-9 bg-bg-base border border-rule rounded-sm text-xs px-2.5 text-cream outline-none focus:border-stone"
                >
                  {ALL_ROLES.map(roleObj => (
                    <option key={roleObj.name} value={roleObj.name}>{roleObj.name} ({roleObj.dept})</option>
                  ))}
                </select>
                <p className="text-[10px] text-stone mt-1 leading-relaxed">
                  {ALL_ROLES.find(r => r.name === newRole)?.desc || ""}
                </p>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    id="invite-2fa-enforced"
                    className="mt-0.5 rounded-sm accent-lime bg-bg-paper border-rule w-3.5 h-3.5"
                    checked={newEnforce2FA}
                    onChange={(e) => setNewEnforce2FA(e.target.checked)}
                  />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-cream">Enforce 2FA Activation</span>
                    <span className="text-[9px] text-stone">Requires physical hardware key or authenticator seed on login</span>
                  </div>
                </label>
              </div>

              <div className="pt-4 border-t border-rule flex items-center justify-end gap-3.5">
                <Button 
                  type="button"
                  variant="ghost" 
                  className="h-8.5 text-xs text-stone hover:text-cream text-stone"
                  onClick={() => setIsInviteOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  id="invite-submit-btn"
                  type="submit" 
                  className="h-8.5 text-xs bg-lime text-bg-base hover:bg-lime/90 font-bold uppercase tracking-wider"
                >
                  Issue Team Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Detailed Sheet / Modal View details */}
      {selectedStaff && !isPermissionsEditOpen && (
        <div id="modal-staff-detail" className="fixed inset-0 bg-bg-base/75 backdrop-blur-sm z-40 flex items-center justify-end p-0 animate-in fade-in duration-150">
          <div className="bg-bg-elev border-l border-rule shadow-2xl h-full w-full max-w-md overflow-y-auto animate-in slide-in-from-right duration-150 flex flex-col justify-between">
            
            {/* Upper Content */}
            <div>
              <div className="p-4 border-b border-rule bg-bg-paper flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-stone tracking-widest">Administrative Profile</span>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-stone hover:text-cream rounded-sm" onClick={() => setSelectedStaff(null)}>
                  <X className="w-4.5 h-4.5" />
                </Button>
              </div>

              <div className="p-6 text-center border-b border-rule bg-bg-base/40 relative">
                <div className="w-16 h-16 rounded-full bg-bg-base border border-rule flex items-center justify-center font-bold text-lime text-lg mx-auto mb-4">
                  {selectedStaff.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-base font-bold text-cream">{selectedStaff.name}</h3>
                <code className="text-[10px] text-stone font-mono block mt-1">{selectedStaff.email}</code>
                
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Badge variant={selectedStaff.status === "Active" ? "outline" : "destructive"} className={selectedStaff.status === "Active" ? "border-lime/30 text-lime" : ""}>
                    {selectedStaff.status}
                  </Badge>
                  <Badge variant="secondary" className="bg-bg-paper border-rule">
                    Joined {selectedStaff.joinedAt}
                  </Badge>
                </div>
              </div>

              {/* Roles, departments, scopes */}
              <div className="p-6 space-y-5">
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-stone block mb-2">Platform Role Structure</span>
                  <div className="bg-bg-base/70 p-3.5 border border-rule rounded-sm flex items-start gap-3">
                    <Shield className="w-4 h-4 text-lime mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold text-cream">{selectedStaff.role}</span>
                      <p className="text-[10px] text-stone mt-1">Organized in <span className="text-cream">{selectedStaff.dept}</span> department. Status reports to compliance core officers.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-stone block mb-2">Cryptographic Key Signoffs ({selectedStaff.permissions.length})</span>
                  <div className="flex flex-wrap gap-1.5 bg-bg-base/40 p-3 border border-rule rounded-sm">
                    {selectedStaff.permissions.length === 0 ? (
                      <span className="text-[10px] text-stone italic">No granular permissions assigned.</span>
                    ) : (
                      selectedStaff.permissions.map(scope => (
                        <span key={scope} className="text-[9px] font-mono uppercase bg-bg-paper border border-rule text-cream px-2 py-0.5 rounded">
                          {scope}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-stone block mb-2">Recent Access Node Traces</span>
                  <div className="space-y-2 bg-bg-base/30 p-3 rounded-sm border border-rule/50">
                    <div className="flex justify-between items-center text-[10px] border-b border-rule/50 pb-1.5">
                      <span className="text-stone font-mono">2026-06-03 20:31:12</span>
                      <span className="text-cream font-mono">197.210.64.122</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-stone font-mono">2026-06-02 18:04:45</span>
                      <span className="text-cream font-mono">197.210.64.185</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Panel Actions */}
            <div className="p-4 bg-bg-paper border-t border-rule space-y-2 shrink-0">
              <Button 
                id="btn-edit-staff-scope"
                className="w-full h-9 rounded-sm border border-rule hover:border-lime/30 bg-bg-base text-cream hover:text-white uppercase tracking-wider font-bold text-[10px] gap-2"
                onClick={() => handleOpenPermissionsEdit(selectedStaff)}
              >
                <Settings2 className="w-3.5 h-3.5" /> Edit Permission Scopes
              </Button>
              <div className="flex gap-2">
                <Button 
                  id="btn-staff-deactivate-bottom"
                  variant="outline"
                  className={`flex-1 h-9 rounded-sm font-bold uppercase text-[10px] border tracking-wider ${
                    selectedStaff.status === "Active" ? "border-red-900/60 hover:bg-red-950/20 text-red-400 hover:text-red-300" : "border-lime/30 hover:bg-lime/10 text-lime"
                  }`}
                  onClick={() => handleToggleStatus(selectedStaff.id)}
                >
                  {selectedStaff.status === "Active" ? "Deactivate User" : "Re-Enable Access"}
                </Button>
                <Button 
                  id="btn-staff-req-2fa"
                  variant="outline"
                  className="flex-1 h-9 rounded-sm font-bold uppercase text-[10px] tracking-wider border-rule hover:border-stone/40 text-stone hover:text-cream"
                  onClick={() => handleEnforce2FA(selectedStaff.id)}
                >
                  Enforce Auth Reset
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Permissions edit modal layer */}
      {isPermissionsEditOpen && selectedStaff && (
        <div id="modal-edit-permissions" className="fixed inset-0 bg-bg-base/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-bg-elev border border-rule rounded-sm shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-100 flex flex-col h-[85vh]">
            <div className="p-4 border-b border-rule bg-bg-paper flex items-center justify-between text-cream">
              <h3 className="text-sm font-semibold text-cream flex items-center gap-2">
                <Sliders className="w-4 h-4 text-lime" />
                Granular Signoff Permissions: {selectedStaff.name}
              </h3>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-stone hover:text-cream rounded-sm" onClick={() => setIsPermissionsEditOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              <div className="bg-bg-base/30 p-3 rounded border border-rule text-xs leading-normal text-stone">
                <span className="text-cream font-bold">Scope Disclaimer:</span> Changing permission codes alters the action signoffs this actor can process with cold wallets, disputes, and overrides. Guard high-risk scopes with 2FA enforcement flags.
              </div>

              <span className="text-[10px] uppercase font-bold text-stone tracking-wider block">Grantable Administrative Keys</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-bg-base/50 p-3 border border-rule rounded">
                {ALL_PERMISSIONS.map(permission => {
                  const isChecked = editingPermissions.includes(permission)
                  return (
                    <label 
                      key={permission} 
                      className={`flex items-center gap-2.5 p-2 rounded cursor-pointer transition-all border ${
                        isChecked ? 'bg-lime/5 border-lime/25 text-cream' : 'bg-transparent border-transparent text-stone hover:text-cream hover:bg-bg-paper'
                      }`}
                    >
                      <input 
                        type="checkbox"
                        className="rounded-sm accent-lime bg-bg-paper border-rule w-3.5 h-3.5 rounded"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setEditingPermissions(prev => prev.filter(p => p !== permission))
                          } else {
                            setEditingPermissions(prev => [...prev, permission])
                          }
                        }}
                      />
                      <span className="text-xs font-mono">{permission}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            <div className="p-4 bg-bg-paper border-t border-rule flex items-center justify-between">
              <span className="text-[10px] text-stone font-mono uppercase">{editingPermissions.length} / {ALL_PERMISSIONS.length} keys selected</span>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  className="h-8 text-xs text-stone hover:text-cream"
                  onClick={() => setIsPermissionsEditOpen(false)}
                >
                  Dismiss
                </Button>
                <Button 
                  id="btn-save-staff-permissions"
                  className="h-8 text-xs bg-lime text-bg-base hover:bg-lime/90 font-bold uppercase tracking-wider"
                  onClick={handleSavePermissions}
                >
                  Save Permission Scope
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Notifications Toast */}
      {toastMessage && (
        <div id="toast-staff-notification" className="fixed bottom-4 right-4 bg-lime text-bg-base font-bold text-xs px-4 py-3 rounded shadow-lg flex items-center gap-2.5 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 border border-white/20">
          <Check className="w-3.5 h-3.5 stroke-[3] text-bg-base" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-80">
            <X className="w-3 h-3 text-bg-base" />
          </button>
        </div>
      )}
    </div>
  )
}
