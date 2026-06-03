import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CheckCircle2, ShieldAlert, Mail, MapPin, Smartphone, CreditCard, Activity, MoreVertical, Key, Ban, Lock, RefreshCw, X, Check, Loader2, Plus, AlertCircle, AlertTriangle, MessageSquare, Send } from "lucide-react"

export default function UserDetail() {
  const { id } = useParams()

  // Mock data profiles for dynamic lookup
  const MOCK_PROFILES: Record<string, any> = {
    "usr_8f92ma": {
      id: "usr_8f92ma",
      name: "Adaeze Okonkwo",
      email: "adaeze@example.com",
      phone: "+234 803 123 4567",
      tier: "Silver",
      status: "Active",
      country: "NG",
      createdAt: "2023-11-12T10:30:00Z",
      verified: { email: true, phone: true, bvn: true },
      balanceInfo: { total: "₦420,500", lifetimeVol: "₦4.2M" },
      riskScore: "Low (12/100)",
      openIssues: 0,
      dailyLimit: { used: 450000, cap: 2000000 }
    },
    "adaeze okonkwo": {
      id: "usr_8f92ma",
      name: "Adaeze Okonkwo",
      email: "adaeze@example.com",
      phone: "+234 803 123 4567",
      tier: "Silver",
      status: "Active",
      country: "NG",
      createdAt: "2023-11-12T10:30:00Z",
      verified: { email: true, phone: true, bvn: true },
      balanceInfo: { total: "₦420,500", lifetimeVol: "₦4.2M" },
      riskScore: "Low (12/100)",
      openIssues: 0,
      dailyLimit: { used: 450000, cap: 2000000 }
    },
    "usr_b2x91p": {
      id: "usr_b2x91p",
      name: "Chibueze Eze",
      email: "ceze@example.com",
      phone: "+234 805 987 6543",
      tier: "Gold",
      status: "Active",
      country: "NG",
      createdAt: "2023-09-05T14:22:00Z",
      verified: { email: true, phone: true, bvn: true },
      balanceInfo: { total: "₦1,850,000", lifetimeVol: "₦12.8M" },
      riskScore: "Medium (34/100)",
      openIssues: 1,
      dailyLimit: { used: 900000, cap: 5000000 }
    },
    "chibueze eze": {
      id: "usr_b2x91p",
      name: "Chibueze Eze",
      email: "ceze@example.com",
      phone: "+234 805 987 6543",
      tier: "Gold",
      status: "Active",
      country: "NG",
      createdAt: "2023-09-05T14:22:00Z",
      verified: { email: true, phone: true, bvn: true },
      balanceInfo: { total: "₦1,850,000", lifetimeVol: "₦12.8M" },
      riskScore: "Medium (34/100)",
      openIssues: 1,
      dailyLimit: { used: 900000, cap: 5000000 }
    },
    "usr_94mdx2": {
      id: "usr_94mdx2",
      name: "Funke Adebayo",
      email: "funke.a@example.com",
      phone: "+234 812 345 6789",
      tier: "Bronze",
      status: "Suspended",
      country: "NG",
      createdAt: "2023-08-18T08:15:00Z",
      verified: { email: true, phone: false, bvn: true },
      balanceInfo: { total: "₦0", lifetimeVol: "₦0" },
      riskScore: "High (82/100)",
      openIssues: 0,
      dailyLimit: { used: 0, cap: 500000 }
    },
    "funke adebayo": {
      id: "usr_94mdx2",
      name: "Funke Adebayo",
      email: "funke.a@example.com",
      phone: "+234 812 345 6789",
      tier: "Bronze",
      status: "Suspended",
      country: "NG",
      createdAt: "2023-08-18T08:15:00Z",
      verified: { email: true, phone: false, bvn: true },
      balanceInfo: { total: "₦0", lifetimeVol: "₦0" },
      riskScore: "High (82/100)",
      openIssues: 0,
      dailyLimit: { used: 0, cap: 500000 }
    },
    "usr_ll290s": {
      id: "usr_ll290s",
      name: "Ibrahim Musa",
      email: "imusa99@example.com",
      phone: "+234 901 234 5678",
      tier: "Platinum",
      status: "Active",
      country: "NG",
      createdAt: "2023-05-10T11:45:00Z",
      verified: { email: true, phone: true, bvn: true },
      balanceInfo: { total: "₦8,450,000", lifetimeVol: "₦56.2M" },
      riskScore: "Medium (45/100)",
      openIssues: 0,
      dailyLimit: { used: 1200000, cap: 20000000 }
    },
    "ibrahim musa": {
      id: "usr_ll290s",
      name: "Ibrahim Musa",
      email: "imusa99@example.com",
      phone: "+234 901 234 5678",
      tier: "Platinum",
      status: "Active",
      country: "NG",
      createdAt: "2023-05-10T11:45:00Z",
      verified: { email: true, phone: true, bvn: true },
      balanceInfo: { total: "₦8,450,000", lifetimeVol: "₦56.2M" },
      riskScore: "Medium (45/100)",
      openIssues: 0,
      dailyLimit: { used: 1200000, cap: 20000000 }
    },
    "ibrahim m.": {
      id: "usr_ll290s",
      name: "Ibrahim Musa",
      email: "imusa99@example.com",
      phone: "+234 901 234 5678",
      tier: "Platinum",
      status: "Active",
      country: "NG",
      createdAt: "2023-05-10T11:45:00Z",
      verified: { email: true, phone: true, bvn: true },
      balanceInfo: { total: "₦8,450,000", lifetimeVol: "₦56.2M" },
      riskScore: "Medium (45/100)",
      openIssues: 0,
      dailyLimit: { used: 1200000, cap: 20000000 }
    },
    "adekunle m.": {
      id: "usr_adekunle_m",
      name: "Adekunle M. Bello",
      email: "adekunle.m@example.com",
      phone: "+234 809 111 2222",
      tier: "Silver",
      status: "Active",
      country: "NG",
      createdAt: "2024-01-14T09:30:00Z",
      verified: { email: true, phone: true, bvn: true },
      balanceInfo: { total: "₦1,250,000", lifetimeVol: "₦9.4M" },
      riskScore: "Medium (55/100)",
      openIssues: 1,
      dailyLimit: { used: 450000, cap: 2000000 }
    },
    "usr_adekunle_m": {
      id: "usr_adekunle_m",
      name: "Adekunle M. Bello",
      email: "adekunle.m@example.com",
      phone: "+234 809 111 2222",
      tier: "Silver",
      status: "Active",
      country: "NG",
      createdAt: "2024-01-14T09:30:00Z",
      verified: { email: true, phone: true, bvn: true },
      balanceInfo: { total: "₦1,250,000", lifetimeVol: "₦9.4M" },
      riskScore: "Medium (55/100)",
      openIssues: 1,
      dailyLimit: { used: 450000, cap: 2000000 }
    },
    "chioma d.": {
      id: "usr_chioma_d",
      name: "Chioma D. Okafor",
      email: "chioma.d@example.com",
      phone: "+234 803 444 5555",
      tier: "Gold",
      status: "Active",
      country: "NG",
      createdAt: "2023-10-10T16:20:00Z",
      verified: { email: true, phone: true, bvn: true },
      balanceInfo: { total: "₦3,100,000", lifetimeVol: "₦18.5M" },
      riskScore: "Low (20/100)",
      openIssues: 0,
      dailyLimit: { used: 150000, cap: 5000000 }
    },
    "usr_chioma_d": {
      id: "usr_chioma_d",
      name: "Chioma D. Okafor",
      email: "chioma.d@example.com",
      phone: "+234 803 444 5555",
      tier: "Gold",
      status: "Active",
      country: "NG",
      createdAt: "2023-10-10T16:20:00Z",
      verified: { email: true, phone: true, bvn: true },
      balanceInfo: { total: "₦3,100,000", lifetimeVol: "₦18.5M" },
      riskScore: "Low (20/100)",
      openIssues: 0,
      dailyLimit: { used: 150000, cap: 5000000 }
    },
    "usr_pz84ne": {
      id: "usr_pz84ne",
      name: "Ngozi Anosike",
      email: "nanosike@example.com",
      phone: "+234 801 888 9999",
      tier: "Silver",
      status: "Active",
      country: "NG",
      createdAt: "2023-11-20T10:00:00Z",
      verified: { email: true, phone: true, bvn: true },
      balanceInfo: { total: "₦210,000", lifetimeVol: "₦2.1M" },
      riskScore: "Low (11/100)",
      openIssues: 0,
      dailyLimit: { used: 50000, cap: 2000000 }
    },
    "ngozi anosike": {
      id: "usr_pz84ne",
      name: "Ngozi Anosike",
      email: "nanosike@example.com",
      phone: "+234 801 888 9999",
      tier: "Silver",
      status: "Active",
      country: "NG",
      createdAt: "2023-11-20T10:00:00Z",
      verified: { email: true, phone: true, bvn: true },
      balanceInfo: { total: "₦210,000", lifetimeVol: "₦2.1M" },
      riskScore: "Low (11/100)",
      openIssues: 0,
      dailyLimit: { used: 50000, cap: 2000000 }
    },
    "usr_4kx8me": {
      id: "usr_4kx8me",
      name: "Sunday Amford",
      email: "sunday@example.com",
      phone: "+234 810 555 6666",
      tier: "Bronze",
      status: "Active",
      country: "NG",
      createdAt: "2023-11-22T08:00:00Z",
      verified: { email: true, phone: true, bvn: false },
      balanceInfo: { total: "₦15,000", lifetimeVol: "₦150K" },
      riskScore: "Low (5/100)",
      openIssues: 0,
      dailyLimit: { used: 10000, cap: 500000 }
    },
    "sunday amford": {
      id: "usr_4kx8me",
      name: "Sunday Amford",
      email: "sunday@example.com",
      phone: "+234 810 555 6666",
      tier: "Bronze",
      status: "Active",
      country: "NG",
      createdAt: "2023-11-22T08:00:00Z",
      verified: { email: true, phone: true, bvn: false },
      balanceInfo: { total: "₦15,000", lifetimeVol: "₦150K" },
      riskScore: "Low (5/100)",
      openIssues: 0,
      dailyLimit: { used: 10000, cap: 500000 }
    },
    "grace k.": {
      id: "usr_grace_k",
      name: "Grace K. Danladi",
      email: "grace.k@example.com",
      phone: "+234 811 777 8888",
      tier: "Silver",
      status: "Active",
      country: "NG",
      createdAt: "2023-01-12T09:12:00Z",
      verified: { email: true, phone: true, bvn: true },
      balanceInfo: { total: "₦1,450,000", lifetimeVol: "₦8.2M" },
      riskScore: "Low (15/100)",
      openIssues: 0,
      dailyLimit: { used: 0, cap: 2000000 }
    },
    "usr_grace_k": {
      id: "usr_grace_k",
      name: "Grace K. Danladi",
      email: "grace.k@example.com",
      phone: "+234 811 777 8888",
      tier: "Silver",
      status: "Active",
      country: "NG",
      createdAt: "2023-01-12T09:12:00Z",
      verified: { email: true, phone: true, bvn: true },
      balanceInfo: { total: "₦1,450,000", lifetimeVol: "₦8.2M" },
      riskScore: "Low (15/100)",
      openIssues: 0,
      dailyLimit: { used: 0, cap: 2000000 }
    }
  }

  const lookupKey = (id || "usr_8f92ma").toLowerCase().trim()
  const baseProfile = MOCK_PROFILES[lookupKey] || MOCK_PROFILES["usr_8f92ma"]

  // Unified Simulated Database State merged with storage values
  const [userProfile, setUserProfile] = useState(() => {
    const freezes = JSON.parse(localStorage.getItem("volt-users-freezes") || "{}")
    const suspensions = JSON.parse(localStorage.getItem("volt-users-suspensions") || "{}")
    const tiers = JSON.parse(localStorage.getItem("volt-users-tiers") || "{}")
    
    let status = baseProfile.status
    if (suspensions[baseProfile.id]) status = "Suspended"
    else if (freezes[baseProfile.id]) status = "Frozen"
    
    return {
      ...baseProfile,
      tier: tiers[baseProfile.id] || baseProfile.tier,
      status
    }
  })

  // State collections
  const [activeTab, setActiveTab] = useState("PROFILE")
  const [notification, setNotification] = useState<string | null>(null)
  const [addressApproved, setAddressApproved] = useState(() => {
    return localStorage.getItem(`volt-addr-approved-${userProfile.id}`) === "true"
  })

  // Dynamic Notes Collection
  const [adminNotes, setAdminNotes] = useState<any[]>(() => {
    const saved = localStorage.getItem(`volt-notes-${userProfile.id}`)
    if (saved) return JSON.parse(saved)
    return [
      { author: "Ibrahim M.", time: "1 week ago", text: "User called in to ask about limit increase. Informed her to complete Tier 2 KYC." }
    ]
  })

  // Dynamic Audit logs collection
  const [auditLogs, setAuditLogs] = useState<any[]>(() => {
    const saved = localStorage.getItem(`volt-audit-${userProfile.id}`)
    if (saved) return JSON.parse(saved)
    return [
      { id: 1, action: "Viewed user profile", actor: "Sunday O. (Self)", time: "Just now" },
      { id: 2, action: "KYC Tier upgraded to Silver", actor: "System", time: "2 days ago" },
      { id: 3, action: "Approved Document (NIN)", actor: "Chioma D.", time: "2 days ago" },
      { id: 4, action: "Added custom note", actor: "Ibrahim M.", time: "1 week ago" },
      { id: 5, action: "Account created", actor: "User", time: "Nov 12, 2023" }
    ]
  })

  // Modal display toggles
  const [showMsgModal, setShowMsgModal] = useState(false)
  const [showSuspendModal, setShowSuspendModal] = useState(false)
  const [showFreezeModal, setShowFreezeModal] = useState(false)
  const [showResetPwdModal, setShowResetPwdModal] = useState(false)
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showDocReviewModal, setShowDocReviewModal] = useState(false)

  // Dispatch fields
  const [msgChannel, setMsgChannel] = useState("Email")
  const [msgSubject, setMsgSubject] = useState("Important update regarding your account limits")
  const [msgBody, setMsgBody] = useState("Hello Adaeze, this is Voltex compliance team. We require additional proof of residence documents to increase your NGN exchange limits.")
  
  const [suspendDuration, setSuspendDuration] = useState("Indefinite")
  const [suspendReason, setSuspendReason] = useState("Regulatory policy audit - unexplained tier volume spike.")
  
  const [freezeReason, setFreezeReason] = useState("Precautionary audit lock - high trade velocity on crypto orderbooks.")
  const [noteCategory, setNoteCategory] = useState("Compliance")
  const [noteText, setNoteText] = useState("")

  const [upgradeTargetTier, setUpgradeTargetTier] = useState("Gold")
  const [upgradeRequiredDocs, setUpgradeRequiredDocs] = useState<string>("Proof of Address (Utility Bill)")

  // Auto-clear toast
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  // Helper action: write dynamic logs
  const addAuditLog = (action: string) => {
    const newLog = {
      id: Date.now(),
      action,
      actor: "Sunday O. (Self)",
      time: "Just now"
    }
    const nextLogs = [newLog, ...auditLogs]
    setAuditLogs(nextLogs)
    localStorage.setItem(`volt-audit-${userProfile.id}`, JSON.stringify(nextLogs))
  }

  // Active updates execution
  const handleSendMessage = () => {
    addAuditLog(`Sent administrative warning (${msgChannel}): ${msgSubject}`)
    setNotification(`Notification alert dispatched to ${userProfile.name} successfully via ${msgChannel}.`)
    setShowMsgModal(false)
  }

  const handleConfirmSuspend = () => {
    const suspensions = JSON.parse(localStorage.getItem("volt-users-suspensions") || "{}")
    suspensions[userProfile.id] = true
    localStorage.setItem("volt-users-suspensions", JSON.stringify(suspensions))
    
    const freezes = JSON.parse(localStorage.getItem("volt-users-freezes") || "{}")
    delete freezes[userProfile.id]
    localStorage.setItem("volt-users-freezes", JSON.stringify(freezes))

    setUserProfile(prev => ({ ...prev, status: "Suspended" }))
    addAuditLog(`Suspended account indefinitely. Reason: ${suspendReason}`)
    setNotification("Revoked customer credentials. This account status has been updated to Suspended.")
    setShowSuspendModal(false)
  }

  const handleConfirmFreeze = () => {
    const freezes = JSON.parse(localStorage.getItem("volt-users-freezes") || "{}")
    freezes[userProfile.id] = true
    localStorage.setItem("volt-users-freezes", JSON.stringify(freezes))
    
    const suspensions = JSON.parse(localStorage.getItem("volt-users-suspensions") || "{}")
    delete suspensions[userProfile.id]
    localStorage.setItem("volt-users-suspensions", JSON.stringify(suspensions))

    setUserProfile(prev => ({ ...prev, status: "Frozen" }))
    addAuditLog(`Enforced withdrawal custody freeze. Reason: ${freezeReason}`)
    setNotification("Custody lock enforced. Outbound transactions for this user have been constrained.")
    setShowFreezeModal(false)
  }

  const handleConfirmReactivate = () => {
    const freezes = JSON.parse(localStorage.getItem("volt-users-freezes") || "{}")
    const suspensions = JSON.parse(localStorage.getItem("volt-users-suspensions") || "{}")
    delete freezes[userProfile.id]
    delete suspensions[userProfile.id]
    localStorage.setItem("volt-users-freezes", JSON.stringify(freezes))
    localStorage.setItem("volt-users-suspensions", JSON.stringify(suspensions))

    setUserProfile(prev => ({ ...prev, status: "Active" }))
    addAuditLog("Cleared compliance holds & re-activated customer credentials.")
    setNotification("Profile restored. This user's standing has been returned to Active.")
  }

  const handleSaveNote = () => {
    if (!noteText.trim()) return
    const newNote = {
      author: "Sunday O. (Self)",
      time: "Just now",
      text: `[${noteCategory}] ${noteText}`
    }
    const nextNotes = [newNote, ...adminNotes]
    setAdminNotes(nextNotes)
    localStorage.setItem(`volt-notes-${userProfile.id}`, JSON.stringify(nextNotes))

    addAuditLog(`Appended internal administrative note: ${noteText.substring(0, 30)}...`)
    setNotification("Admin note recorded and appended to dossier database.")
    setNoteText("")
    setShowNoteModal(false)
  }

  const handleConfirmUpgradeRequest = () => {
    addAuditLog(`Dispatched KYC dynamic Upgrade Request for ${upgradeRequiredDocs}`)
    setNotification(`Upgrade request for Tier ${upgradeTargetTier} dispatched to user profile.`)
    setShowUpgradeModal(false)
  }

  const handleApproveAddressProof = () => {
    setAddressApproved(true)
    localStorage.setItem(`volt-addr-approved-${userProfile.id}`, "true")
    
    // Auto-elevate to Gold tier for silver users when address is verified
    const tiers = JSON.parse(localStorage.getItem("volt-users-tiers") || "{}")
    tiers[userProfile.id] = "Gold"
    localStorage.setItem("volt-users-tiers", JSON.stringify(tiers))

    setUserProfile(prev => ({ ...prev, tier: "Gold" }))
    addAuditLog("Approved Utility Document & Elevated user standing to Tier 2 (Gold)")
    setNotification("Address documentation confirmed. User elevated to Gold standing with higher limits.")
    setShowDocReviewModal(false)
  }

  const handleRejectAddressProof = () => {
    setAddressApproved(false)
    localStorage.removeItem(`volt-addr-approved-${userProfile.id}`)
    
    addAuditLog("Rejected Address Document (Inconclusive matching details)")
    setNotification("Address billing documentation rejected. Warning request sent to user dashboard.")
    setShowDocReviewModal(false)
  }

  const handleResetPassword = () => {
    addAuditLog("Initiated temporary password reset sequence")
    setNotification("Password reset sequence executed. Credentials hash dispatched to customer email.")
    setShowResetPwdModal(false)
  }

  const tabs = ["PROFILE", "KYC", "WALLET", "TRANSACTIONS", "P2P", "DEVICES & SESSIONS", "LINKED ACCOUNTS", "RISK / AML", "ACTIONS"]

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Floating Dynamic Notification Toast */}
      {notification && (
        <div id="user-details-toast" className="fixed top-4 right-4 bg-bg-elev border-l-4 border-lime text-cream p-3 text-xs rounded shadow-2xl z-50 flex items-center justify-between gap-3 animate-fade-in max-w-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-lime shrink-0 animate-pulse" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-stone hover:text-cream">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* WARNING DISPATCH MODAL */}
      {showMsgModal && (
        <div id="details-msg-modal" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-bg-elev border border-rule rounded-md w-full max-w-md p-6 relative shadow-2xl animate-in font-sans">
            <button onClick={() => setShowMsgModal(false)} className="absolute top-4 right-4 text-stone hover:text-cream">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-lime mb-4">
              <MessageSquare className="w-4 h-4" />
              <h3 className="text-sm font-semibold uppercase tracking-wide">Dispatch Platform Notification</h3>
            </div>
            <p className="text-[11px] text-stone mb-4">This action issues a platform warning or warning email communication directly to the customer inbox.</p>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-stone uppercase tracking-wide block mb-1">Communication Channel</label>
                <select 
                  id="msg-select-channel"
                  value={msgChannel} 
                  onChange={(e) => setMsgChannel(e.target.value)}
                  className="w-full bg-bg-base border border-rule rounded px-3 py-1.5 text-xs text-cream outline-none"
                >
                  <option value="Email">Verify Link Mail (SMTP)</option>
                  <option value="SMS">Mobile Telco SMS Warning</option>
                  <option value="In-App Push">Dynamic Push Alert Message</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-stone uppercase tracking-wide block mb-1">Message Subject / Title</label>
                <Input 
                  id="msg-input-subject"
                  value={msgSubject} 
                  onChange={(e) => setMsgSubject(e.target.value)}
                  className="bg-bg-base text-xs text-cream h-9" 
                />
              </div>
              <div>
                <label className="text-[10px] text-stone uppercase tracking-wide block mb-1">Warning Message Content</label>
                <textarea 
                  id="msg-input-body"
                  value={msgBody} 
                  onChange={(e) => setMsgBody(e.target.value)}
                  className="w-full bg-bg-base border border-rule rounded p-3 text-xs text-cream outline-none h-24 font-mono"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 justify-end mt-6">
              <Button variant="ghost" size="sm" onClick={() => setShowMsgModal(false)} className="text-xs">Cancel</Button>
              <Button id="msg-submit-btn" size="sm" onClick={handleSendMessage} className="bg-lime text-bg-base hover:bg-lime/90 font-bold text-xs gap-1">
                <Send className="w-3 h-3" /> Execute Warning Dispatch
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CORE PROFILE SUSPENSION MODAL */}
      {showSuspendModal && (
        <div id="details-suspend-modal" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-bg-elev border border-rule rounded-md w-full max-w-md p-6 relative shadow-2xl animate-in font-sans">
            <button onClick={() => setShowSuspendModal(false)} className="absolute top-4 right-4 text-stone hover:text-cream">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-bad mb-4">
              <Ban className="w-4 h-4 text-bad" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-bad">Restrict Platform Credentials User</h3>
            </div>
            <p className="text-[11px] text-stone mb-4">Placing a suspension flags the credentials layout and completely blocks frontend dashboard auth sequences.</p>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-stone uppercase tracking-wide block mb-1">Suspension Hold Period</label>
                <select 
                  id="suspend-select-duration"
                  value={suspendDuration} 
                  onChange={(e) => setSuspendDuration(e.target.value)}
                  className="w-full bg-bg-base border border-rule rounded px-3 py-1.5 text-xs text-cream outline-none"
                >
                  <option value="24 Hours">24 Hours Precognitive</option>
                  <option value="7 Days">7 Days Coercive Lock</option>
                  <option value="30 Days">30 Days Audit Regulatory</option>
                  <option value="Indefinite">Indefinite Platform Eviction</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-stone uppercase tracking-wide block mb-1">Administrative Enforcement Reason</label>
                <textarea 
                  id="suspend-input-reason"
                  value={suspendReason} 
                  onChange={(e) => setSuspendReason(e.target.value)}
                  className="w-full bg-bg-base border border-rule rounded p-3 text-xs text-cream outline-none h-20"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 justify-end mt-6">
              <Button variant="ghost" size="sm" onClick={() => setShowSuspendModal(false)} className="text-xs">Cancel</Button>
              <Button id="suspend-submit-btn" size="sm" onClick={handleConfirmSuspend} className="bg-bad text-bg-base hover:bg-bad/90 font-bold text-xs">
                Revoke Credentials Access
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CORE WALLET FREEZE MODAL */}
      {showFreezeModal && (
        <div id="details-freeze-modal" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-bg-elev border border-rule rounded-md w-full max-w-md p-6 relative shadow-2xl animate-in font-sans">
            <button onClick={() => setShowFreezeModal(false)} className="absolute top-4 right-4 text-stone hover:text-cream">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-warn mb-4">
              <Lock className="w-4 h-4 text-warn" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-warn">Enforce Asset Custody Hold</h3>
            </div>
            <p className="text-[11px] text-stone mb-4">Custodian hold places restriction keys on cryptocurrency withdraw wallets, escrow settlements and outbound fiat deposits.</p>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-stone uppercase tracking-wide block mb-1">Enforcement Parameters Reason</label>
                <textarea 
                  id="freeze-input-reason"
                  value={freezeReason} 
                  onChange={(e) => setFreezeReason(e.target.value)}
                  className="w-full bg-bg-base border border-rule rounded p-3 text-xs text-cream outline-none h-20"
                />
              </div>
              <div className="flex items-center gap-2 p-2 bg-bg-base border border-rule rounded text-[11px] text-stone">
                <input type="checkbox" defaultChecked className="accent-lime" />
                <span>Lock all dynamic P2P advertisements matching this user ID</span>
              </div>
            </div>
            <div className="flex items-center gap-2 justify-end mt-6">
              <Button variant="ghost" size="sm" onClick={() => setShowFreezeModal(false)} className="text-xs">Cancel</Button>
              <Button id="freeze-submit-btn" size="sm" onClick={handleConfirmFreeze} className="bg-warn text-bg-base hover:bg-warn/90 font-bold text-xs text-stone">
                Enact Precautionary Freeze
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM ADMIN NOTE ADDITION MODAL */}
      {showNoteModal && (
        <div id="details-note-modal" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-bg-elev border border-rule rounded-md w-full max-w-md p-6 relative shadow-2xl animate-in font-sans">
            <button onClick={() => setShowNoteModal(false)} className="absolute top-4 right-4 text-stone hover:text-cream">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-lime mb-4">
              <Plus className="w-4 h-4 text-lime" />
              <h3 className="text-sm font-semibold uppercase tracking-wide">Write Custom Account Ledger Note</h3>
            </div>
            <p className="text-[11px] text-stone mb-4">Adds secure administrative metadata logs directly below user's profile tab card.</p>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-stone uppercase tracking-wide block mb-1">Topic Category</label>
                <select 
                  id="note-select-category"
                  value={noteCategory} 
                  onChange={(e) => setNoteCategory(e.target.value)}
                  className="w-full bg-bg-base border border-rule rounded px-3 py-1.5 text-xs text-cream outline-none"
                >
                  <option value="Compliance">Security Audit / Compliance</option>
                  <option value="Customer Care">General Helpdesk Enquiry</option>
                  <option value="Technical Ops">Technical Infrastructure</option>
                  <option value="Dispute Log">P2P Escrow Discrepancies</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-stone uppercase tracking-wide block mb-1">Administrative Note Details</label>
                <textarea 
                  id="note-input-text"
                  placeholder="Record interaction logs, audit details, or custom observations..."
                  value={noteText} 
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full bg-bg-base border border-rule rounded p-3 text-xs text-cream outline-none h-20"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 justify-end mt-6">
              <Button variant="ghost" size="sm" onClick={() => setShowNoteModal(false)} className="text-xs">Cancel</Button>
              <Button id="note-submit-btn" size="sm" onClick={handleSaveNote} className="bg-lime text-bg-base hover:bg-lime/90 font-bold text-xs">
                Commit Note Records
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* KYC UPGRADE INQUIRY DISPATCH MODAL */}
      {showUpgradeModal && (
        <div id="details-upgrade-modal" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-bg-elev border border-rule rounded-md w-full max-w-md p-6 relative shadow-2xl animate-in font-sans">
            <button onClick={() => setShowUpgradeModal(false)} className="absolute top-4 right-4 text-stone hover:text-cream">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-lime mb-4">
              <RefreshCw className="w-4 h-4 text-lime" />
              <h3 className="text-sm font-semibold uppercase tracking-wide">Request KYC Upgrade Dossier</h3>
            </div>
            <p className="text-[11px] text-stone mb-4">Dispatches an system warning alert instructing client to upload necessary details to claim higher status tier limits.</p>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-stone uppercase tracking-wide block mb-1">Requested Upgrade Tier Target</label>
                <select 
                  id="upgrade-select-tier"
                  value={upgradeTargetTier} 
                  onChange={(e) => setUpgradeTargetTier(e.target.value)}
                  className="w-full bg-bg-base border border-rule rounded px-3 py-1.5 text-xs text-cream outline-none"
                >
                  <option value="Gold">KYC Tier 2 Gold (Medium Limits)</option>
                  <option value="Platinum">KYC Tier 3 Platinum (Unlimited Custody)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-stone uppercase tracking-wide block mb-1">Required Documents Description</label>
                <Input 
                  id="upgrade-input-docs"
                  value={upgradeRequiredDocs} 
                  onChange={(e) => setUpgradeRequiredDocs(e.target.value)}
                  className="bg-bg-base text-xs text-cream h-9" 
                />
              </div>
            </div>
            <div className="flex items-center gap-2 justify-end mt-6">
              <Button variant="ghost" size="sm" onClick={() => setShowUpgradeModal(false)} className="text-xs">Cancel</Button>
              <Button id="upgrade-submit" size="sm" onClick={handleConfirmUpgradeRequest} className="bg-lime text-bg-base hover:bg-lime/90 font-bold text-xs">
                Request Upgrade Alert
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED PROOF OF ADDRESS DOCUMENT REVIEW MODAL */}
      {showDocReviewModal && (
        <div id="details-review-modal" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-bg-elev border border-rule rounded-md w-full max-w-lg p-6 relative shadow-2xl animate-in font-sans">
            <button onClick={() => setShowDocReviewModal(false)} className="absolute top-4 right-4 text-stone hover:text-cream">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-lime mb-2">
              <ShieldAlert className="w-4 h-4 text-lime" />
              <h3 className="text-sm font-semibold uppercase tracking-wide">Review Address Document (Nigeria Utility Billing File)</h3>
            </div>
            <p className="text-[11px] text-stone mb-4">Perform automated / visual verification balance checklist parameters on the submitted document envelope.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-bg-base border border-rule p-3 rounded text-[10px] space-y-2 font-mono">
                <span className="text-stone block font-bold uppercase tracking-wider mb-1">Interactive Match Matrix</span>
                <div>
                  <span className="text-stone">User Profile Name:</span>
                  <p className="text-cream font-bold">{userProfile.name}</p>
                </div>
                <div>
                  <span className="text-stone">Billing Document Name:</span>
                  <p className="text-lime font-bold">ADAEZE OKONKWO</p>
                </div>
                <div>
                  <span className="text-stone">Residential Address:</span>
                  <p className="text-cream">14 Awolowo Road, Ikoyi, Lagos</p>
                </div>
              </div>
              <div className="bg-bg-base border border-rule rounded flex flex-col items-center justify-center p-3 relative overflow-hidden">
                <div className="absolute top-1 right-2 text-[9px] font-mono text-lime bg-lime/10 px-1 border border-lime/30 rounded">Similarity Score: 100%</div>
                <div className="w-12 h-12 bg-bg-elev border border-rule rounded flex items-center justify-center text-stone font-mono text-xs mb-1">
                  14
                </div>
                <span className="text-[10px] text-stone font-mono">Lagos Electric Utility Bill</span>
                <p className="text-[9px] text-stone font-mono mt-1">Submitted: 2 days ago</p>
              </div>
            </div>

            <div className="bg-lime/5 border border-lime/20 rounded p-2.5 mb-4 flex gap-2 text-[10px] text-lime">
              <Check className="w-4 h-4 shrink-0 mt-0.5" />
              <p>Similarity ledger matches profile identifiers. Approving address documents elevates the profile standing directly to Gold Tier 2.</p>
            </div>

            <div className="flex items-center gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowDocReviewModal(false)} className="text-xs">Cancel</Button>
              <Button id="btn-reject-address" size="sm" onClick={handleRejectAddressProof} className="bg-bad text-bg-base hover:bg-bad/90 font-bold text-xs">
                Reject Document
              </Button>
              <Button id="btn-approve-address" size="sm" onClick={handleApproveAddressProof} className="bg-lime text-bg-base hover:bg-lime/95 font-bold text-xs">
                Approve Utility Address
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* SECURE PASSWORD RESET GENERATION MODAL */}
      {showResetPwdModal && (
        <div id="details-pwd-modal" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-bg-elev border border-rule rounded-md w-full max-w-sm p-6 relative shadow-2xl animate-in font-sans">
            <button onClick={() => setShowResetPwdModal(false)} className="absolute top-4 right-4 text-stone hover:text-cream">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-lime mb-3">
              <Key className="w-4 h-4 text-lime" />
              <h3 className="text-sm font-semibold uppercase tracking-wide">Generate Reset Hash Link</h3>
            </div>
            <p className="text-[11px] text-stone mb-4">Issues an automated cryptographic secure password-reset link to SMTP email queues for delivery.</p>
            
            <div className="bg-bg-base border border-rule p-3 font-mono text-[10px] text-stone space-y-1 rounded mb-4">
              <div>Target Mailbox: <span className="text-cream font-bold">{userProfile.email}</span></div>
              <div>Secure Protocol: <span className="text-lime">AES_256_GCM</span></div>
              <div>Temporary Link Key: <span className="text-cream">vlt_rst_hash_80911_a9</span></div>
            </div>

            <div className="flex items-center gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowResetPwdModal(false)} className="text-xs">Cancel</Button>
              <Button id="reset-pwd-submit-btn" size="sm" onClick={handleResetPassword} className="bg-lime text-bg-base hover:bg-lime/90 font-bold text-xs">
                Dispatch Reset Link
              </Button>
            </div>
          </div>
        </div>
      )}

      <div>
        <Link to="/admin/users" className="text-stone hover:text-cream text-xs flex items-center gap-1 mb-4 inline-flex">
          <ArrowLeft className="w-3 h-3" /> Back to users
        </Link>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border border-rule bg-bg-elev flex items-center justify-center text-xl font-medium text-stone font-display pl-0.5">
              {userProfile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-display font-medium tracking-tight text-cream">{userProfile.name}</h1>
                <Badge variant={userProfile.tier === 'Platinum' ? 'default' : userProfile.tier === 'Gold' ? 'warning' : userProfile.tier === 'Silver' ? 'secondary' : 'outline'} className="text-[10px] uppercase">
                  {userProfile.tier} Tier
                </Badge>
                <Badge 
                  variant={userProfile.status === 'Active' ? 'success' : 'destructive'} 
                  className={`text-[10px] uppercase font-mono ${userProfile.status === 'Frozen' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : ''}`}
                >
                  {userProfile.status}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-stone font-mono">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5"/> {userProfile.email}</span>
                <span className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5"/> {userProfile.phone}</span>
                <span className="flex items-center gap-1 flex-wrap text-cream">
                  {userProfile.verified.email && <span className="bg-bg-elev px-1.5 rounded-sm flex items-center gap-1 text-[10px]"><CheckCircle2 className="w-3 h-3 text-good"/> Email</span>}
                  {userProfile.verified.phone && <span className="bg-bg-elev px-1.5 rounded-sm flex items-center gap-1 text-[10px]"><CheckCircle2 className="w-3 h-3 text-good"/> Phone</span>}
                  {userProfile.verified.bvn && <span className="bg-bg-elev px-1.5 rounded-sm flex items-center gap-1 text-[10px]"><CheckCircle2 className="w-3 h-3 text-good"/> BVN</span>}
                </span>
                <span>Signed up: {new Date(userProfile.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button id="btn-trigger-msg-modal" variant="secondary" size="sm" className="h-8 text-xs gap-1.5" onClick={() => {
              setMsgSubject(`System warning for Adaeze regarding limits verification`)
              setMsgBody(`Hello ${userProfile.name}, this is the Voltex administration. Your current lifetime volumes have exceeded Silver margins. Please elevate compliance address utility files to bypass lock constraints.`)
              setShowMsgModal(true)
            }}>
              <Mail className="w-3.5 h-3.5" /> Message
            </Button>
            
            {userProfile.status === "Suspended" ? (
              <Button id="btn-reactivate-header-sus" variant="outline" size="sm" className="h-8 text-xs gap-1.5 border-good/50 text-good hover:bg-good/10" onClick={handleConfirmReactivate}>
                <RefreshCw className="w-3.5 h-3.5" /> Reactivate Choice
              </Button>
            ) : (
              <Button id="btn-trigger-suspend-modal" variant="outline" size="sm" className="h-8 text-xs gap-1.5 border-bad/50 text-bad hover:bg-bad/10" onClick={() => setShowSuspendModal(true)}>
                <Ban className="w-3.5 h-3.5" /> Suspend
              </Button>
            )}

            {userProfile.status === "Frozen" ? (
              <Button id="btn-reactivate-header-frz" variant="outline" size="sm" className="h-8 text-xs gap-1.5 border-good/50 text-good hover:bg-good/10" onClick={handleConfirmReactivate}>
                <RefreshCw className="w-3.5 h-3.5" /> Unfreeze Wallet
              </Button>
            ) : (
              <Button id="btn-trigger-freeze-modal" variant="outline" size="sm" className="h-8 text-xs gap-1.5 border-warn/50 text-warn hover:bg-warn/10" onClick={() => setShowFreezeModal(true)}>
                <Lock className="w-3.5 h-3.5" /> Freeze
              </Button>
            )}

            <Button id="btn-trigger-note-modal" variant="ghost" size="icon" className="h-8 w-8 text-stone hover:text-cream" onClick={() => setShowNoteModal(true)}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
         <KPICard label="TOTAL BALANCE" value={userProfile.balanceInfo.total} />
         <KPICard label="LIFETIME VOLUME" value={userProfile.balanceInfo.lifetimeVol} />
         <KPICard label="OPEN ISSUES" value={userProfile.openIssues.toString()} alert={userProfile.openIssues > 0} />
         <KPICard label="RISK SCORE" value={userProfile.riskScore} />
         
         <Card className="bg-bg-paper border-rule col-span-2">
           <CardContent className="p-4 flex flex-col justify-center h-full">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-medium text-stone uppercase tracking-wide">DAILY LIMIT (NGN)</span>
                <span className="text-xs font-mono text-cream">{((userProfile.dailyLimit.used / userProfile.dailyLimit.cap) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-1.5 bg-bg-base rounded-full overflow-hidden">
                <div className="bg-lime h-full" style={{width: `${(userProfile.dailyLimit.used / userProfile.dailyLimit.cap) * 100}%`}}></div>
              </div>
              <div className="flex justify-between items-center mt-2 text-[10px] font-mono text-stone">
                <span>₦{(userProfile.dailyLimit.used).toLocaleString()} used</span>
                <span>₦{(userProfile.dailyLimit.cap).toLocaleString()} cap</span>
              </div>
           </CardContent>
         </Card>
      </div>

      <div className="flex gap-6 h-[600px]">
        <div className="flex-1 flex flex-col min-w-0 bg-bg-paper border border-rule rounded-md overflow-hidden">
          <div className="flex overflow-x-auto border-b border-rule hide-scrollbar shrink-0 px-2 pt-2">
             {tabs.map(tab => (
               <button
                 key={tab}
                 id={`tab-user-detail-${tab.toLowerCase().replace(/\s+/g, '-')}`}
                 onClick={() => setActiveTab(tab)}
                 className={`px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-lime text-lime' : 'border-transparent text-stone hover:text-cream'}`}
               >
                 {tab}
               </button>
             ))}
          </div>
          
          <div className="p-4 overflow-y-auto flex-1">
             {activeTab === "PROFILE" && (
                <ProfileTab 
                  user={userProfile} 
                  notes={adminNotes} 
                  onAddNoteClick={() => setShowNoteModal(true)} 
                />
             )}
             {activeTab === "KYC" && (
                <KYCTab 
                  user={userProfile} 
                  addressApproved={addressApproved} 
                  onReviewDocClick={() => setShowDocReviewModal(true)} 
                />
             )}
             {activeTab === "WALLET" && <WalletTab user={userProfile} />}
             {activeTab === "TRANSACTIONS" && <TransactionsTab user={userProfile} />}
             {activeTab === "DEVICES & SESSIONS" && <DevicesTab user={userProfile} />}
             {activeTab === "LINKED ACCOUNTS" && <LinkedAccountsTab user={userProfile} />}
             {activeTab === "RISK / AML" && <RiskTab user={userProfile} />}
             {activeTab === "ACTIONS" && (
                <ActionsTab 
                  user={userProfile} 
                  onResetPwdClick={() => setShowResetPwdModal(true)}
                  onFreezeClick={() => userProfile.status === "Frozen" ? handleConfirmReactivate() : setShowFreezeModal(true)}
                  onSuspendClick={() => userProfile.status === "Suspended" ? handleConfirmReactivate() : setShowSuspendModal(true)}
                />
             )}
             {activeTab === "P2P" && <P2PTab user={userProfile} />}
          </div>
        </div>
        
        <div className="w-[300px] shrink-0 bg-bg-elev border border-rule rounded-md flex flex-col">
          <div className="p-3 border-b border-rule font-medium text-[11px] uppercase tracking-wider text-stone shrink-0">
             Audit Trail
          </div>
          <div className="p-3 flex-1 overflow-y-auto space-y-4">
             {auditLogs.map(log => (
                <div key={log.id} className="relative pl-4 border-l border-rule-strong pb-4 last:pb-0 animate-in fade-in duration-300">
                  <span className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-bg-paper border border-stone"></span>
                  <p className="text-xs text-cream font-medium">{log.action}</p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-stone font-mono">
                    <span className="text-cream">{log.actor}</span>
                    <span>•</span>
                    <span>{log.time}</span>
                  </div>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileTab({ user, notes, onAddNoteClick }: { user: any, notes: any[], onAddNoteClick: () => void }) {
  return (
    <div className="space-y-6 max-w-3xl">
       <div>
         <h3 className="text-[10px] uppercase font-medium text-stone mb-3 tracking-wider">Personal</h3>
         <div className="grid grid-cols-2 gap-4">
            <Field label="Full Name" value={user.name} />
            <Field label="Date of Birth" value="1992-04-18" />
            <Field label="Gender" value="Female" />
            <Field label="Residential Address" value="14 Awolowo Road, Ikoyi, Lagos" />
         </div>
       </div>
       
       <div className="h-[1px] w-full bg-rule"></div>

       <div>
         <h3 className="text-[10px] uppercase font-medium text-stone mb-3 tracking-wider">Identifiers</h3>
         <div className="grid grid-cols-2 gap-4">
            <Field label="Voltex ID" value={user.id} mono />
            <Field label="Referral Code" value="ADA992X" mono />
            <Field label="BVN" value="•••••••4091" mono />
            <Field label="NIN" value="•••••••8821" mono />
         </div>
       </div>

       <div className="h-[1px] w-full bg-rule"></div>

       <div>
         <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] uppercase font-medium text-stone tracking-wider">Admin Notes</h3>
            <Button id="profile-tab-add-note-btn" variant="outline" size="sm" className="h-6 text-[10px] text-lime hover:bg-lime/10" onClick={onAddNoteClick}>Add Note</Button>
         </div>
         <div className="space-y-3">
            {notes.map((note, idx) => (
              <div key={idx} className="bg-bg-base p-3 rounded-sm border border-rule animate-in fade-in duration-100">
                 <div className="flex items-center justify-between mb-1.5 text-[10px] text-stone">
                   <div className="flex items-center gap-1.5">
                     <span className="font-semibold text-lime">{note.author}</span>
                     <span>•</span>
                     <span>{note.time}</span>
                   </div>
                 </div>
                 <p className="text-xs text-cream leading-relaxed">{note.text}</p>
              </div>
            ))}
         </div>
       </div>
    </div>
  )
}

function Field({ label, value, mono }: { label: string, value: string, mono?: boolean }) {
  return (
    <div>
      <div className="text-[10px] text-stone mb-1">{label}</div>
      <div className={`text-xs text-cream ${mono ? 'font-mono' : ''}`}>{value}</div>
    </div>
  )
}

function KYCTab({ user, addressApproved, onReviewDocClick }: { user: any, addressApproved: boolean, onReviewDocClick: () => void }) {
  return (
    <div className="space-y-6 max-w-3xl">
       <div className="flex justify-between items-center bg-bg-base p-4 rounded-md border border-rule">
          <div>
             <h3 className="text-sm font-medium text-cream">Current Tier: {user.tier}</h3>
             <p className="text-xs text-stone mt-1">Daily Limit: ₦{(user.dailyLimit.cap).toLocaleString()}</p>
          </div>
          <Button id="btn-request-kyc-tab" variant="outline" size="sm" className="h-8 text-xs text-lime border-lime/30 hover:bg-lime/10" onClick={onReviewDocClick}>
             Review Dossier
          </Button>
       </div>
       <div className="space-y-4">
          <h3 className="text-[10px] uppercase font-medium text-stone tracking-wider">Submitted Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="border border-rule rounded-md p-4 flex gap-4 bg-bg-elev">
                <div className="w-12 h-12 bg-bg-base flex items-center justify-center rounded-sm">
                   <CreditCard className="w-6 h-6 text-lime" />
                </div>
                <div>
                   <h4 className="text-xs font-medium text-cream">National ID (NIN)</h4>
                   <p className="text-[10px] text-stone mt-0.5 mb-2">Approved on Nov 13, 2023</p>
                   <Badge variant="success" className="text-[9px]">Verified</Badge>
                </div>
             </div>
             <div className="border border-rule rounded-md p-4 flex gap-4 bg-bg-elev">
                <div className="w-12 h-12 bg-bg-base flex items-center justify-center rounded-sm">
                   <MapPin className="w-6 h-6 text-lime" />
                </div>
                <div className="flex-1">
                   <h4 className="text-xs font-medium text-cream">Proof of Address</h4>
                   <p className="text-[10px] text-stone mt-0.5 mb-2">Utility Bill (LCC Electricity)</p>
                   {addressApproved ? (
                      <Badge variant="success" className="text-[9px]">Verified</Badge>
                   ) : (
                      <div className="flex items-center gap-2">
                         <Badge variant="secondary" className="text-[9px]">Pending Review</Badge>
                         <button 
                           id="btn-trigger-review-action"
                           onClick={onReviewDocClick} 
                           className="text-[10px] text-lime hover:underline font-semibold"
                         >
                            Review & Approve
                         </button>
                      </div>
                   )}
                </div>
             </div>
          </div>
       </div>
    </div>
  )
}

function WalletTab({ user }: { user: any }) {
  return (
    <div className="space-y-6 max-w-4xl">
       <h3 className="text-[10px] uppercase font-medium text-stone tracking-wider mb-2">Balances</h3>
       <div className="border border-rule rounded-md overflow-hidden">
          <table className="w-full text-left">
             <thead className="bg-bg-base border-b border-rule">
                <tr>
                   <th className="px-4 py-2 text-xs font-medium text-stone">Asset</th>
                   <th className="px-4 py-2 text-xs font-medium text-stone text-right">Balance</th>
                   <th className="px-4 py-2 text-xs font-medium text-stone text-right">Value (NGN)</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-rule divide-dashed">
                <tr>
                   <td className="px-4 py-3 text-xs font-medium">Bitcoin (BTC)</td>
                   <td className="px-4 py-3 text-xs font-mono text-right">0.02451</td>
                   <td className="px-4 py-3 text-xs font-mono text-right">₦2,512,000</td>
                </tr>
                <tr>
                   <td className="px-4 py-3 text-xs font-medium">Tether (USDT)</td>
                   <td className="px-4 py-3 text-xs font-mono text-right">450.00</td>
                   <td className="px-4 py-3 text-xs font-mono text-right">₦855,000</td>
                </tr>
                <tr>
                   <td className="px-4 py-3 text-xs font-medium">Naira (NGN)</td>
                   <td className="px-4 py-3 text-xs font-mono text-right">45,500.00</td>
                   <td className="px-4 py-3 text-xs font-mono text-right">₦45,500</td>
                </tr>
             </tbody>
          </table>
       </div>
    </div>
  )
}

function TransactionsTab({ user }: { user: any }) {
  return (
     <div className="space-y-6">
       <h3 className="text-[10px] uppercase font-medium text-stone tracking-wider">Recent Transactions</h3>
       <div className="border border-rule rounded-md overflow-hidden">
          <table className="w-full text-left">
             <thead className="bg-bg-base border-b border-rule">
                <tr>
                   <th className="px-4 py-2 text-xs font-medium text-stone">Type</th>
                   <th className="px-4 py-2 text-xs font-medium text-stone">Amount</th>
                   <th className="px-4 py-2 text-xs font-medium text-stone">Status</th>
                   <th className="px-4 py-2 text-xs font-medium text-stone">Date</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-rule text-xs">
                <tr>
                   <td className="px-4 py-3">Crypto Withdrawal (BTC)</td>
                   <td className="px-4 py-3 font-mono text-bad">-0.01 BTC</td>
                   <td className="px-4 py-3"><Badge variant="success" className="text-[9px]">Completed</Badge></td>
                   <td className="px-4 py-3 text-stone">2 hours ago</td>
                </tr>
                <tr>
                   <td className="px-4 py-3">Fiat Deposit (NGN)</td>
                   <td className="px-4 py-3 font-mono text-good">+₦500,000</td>
                   <td className="px-4 py-3"><Badge variant="success" className="text-[9px]">Completed</Badge></td>
                   <td className="px-4 py-3 text-stone">1 day ago</td>
                </tr>
                <tr>
                   <td className="px-4 py-3">Trade (P2P Buy)</td>
                   <td className="px-4 py-3 font-mono">+0.012 BTC</td>
                   <td className="px-4 py-3"><Badge variant="success" className="text-[9px]">Completed</Badge></td>
                   <td className="px-4 py-3 text-stone">1 day ago</td>
                </tr>
             </tbody>
          </table>
       </div>
     </div>
  )
}

function DevicesTab({ user }: { user: any }) {
  return (
    <div className="space-y-6 max-w-3xl">
       <h3 className="text-[10px] uppercase font-medium text-stone tracking-wider">Active Sessions</h3>
       <div className="border border-rule rounded-md divide-y divide-rule">
          <div className="p-4 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <Smartphone className="w-6 h-6 text-stone" />
                <div>
                   <p className="text-xs font-medium">iPhone 14 Pro Max • iOS 17</p>
                   <p className="text-[10px] text-stone mt-0.5">Lagos, NG • 197.210.64.122</p>
                </div>
             </div>
             <div className="flex flex-col items-end gap-2">
                <Badge variant="success" className="text-[9px]">Current Session</Badge>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] text-bad">Revoke</Button>
             </div>
          </div>
          <div className="p-4 flex items-center justify-between opacity-70">
             <div className="flex items-center gap-4">
                <Activity className="w-6 h-6 text-stone" />
                <div>
                   <p className="text-xs font-medium">Chrome on macOS</p>
                   <p className="text-[10px] text-stone mt-0.5">Lagos, NG • 197.210.64.122</p>
                </div>
             </div>
             <div className="flex flex-col items-end gap-2">
                <span className="text-[10px] text-stone">Last active: 2 days ago</span>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] text-bad">Revoke</Button>
             </div>
          </div>
       </div>
    </div>
  )
}

function LinkedAccountsTab({ user }: { user: any }) {
  return (
    <div className="space-y-6 max-w-3xl">
       <div className="flex justify-between items-center">
          <h3 className="text-[10px] uppercase font-medium text-stone tracking-wider">Bank Accounts</h3>
       </div>
       <div className="border border-rule rounded-md divide-y divide-rule">
          <div className="p-4 flex items-center justify-between">
             <div>
                <p className="text-xs font-medium">Guaranty Trust Bank</p>
                <p className="text-[10px] text-stone mt-0.5 font-mono">0123456789</p>
             </div>
             <Badge variant="success" className="text-[9px]">Verified (Name Match)</Badge>
          </div>
       </div>
    </div>
  )
}

function RiskTab({ user }: { user: any }) {
  return (
    <div className="space-y-6 max-w-3xl">
       <div className="flex items-center gap-6 p-4 border border-rule rounded-md bg-bg-base">
          <div className="w-16 h-16 rounded-full border-4 border-good flex items-center justify-center text-lg font-mono font-medium">
             12
          </div>
          <div>
             <h3 className="text-sm font-medium">Low Risk Profile</h3>
             <p className="text-xs text-stone mt-1 max-w-md">User exhibits normal trading patterns entirely within local guidelines. No sanctions matches or high-risk wallet interactions detected.</p>
          </div>
       </div>
       <div className="space-y-3">
          <h3 className="text-[10px] uppercase font-medium text-stone tracking-wider">Risk Factors</h3>
          <div className="text-xs text-stone">No active risk factors.</div>
       </div>
    </div>
  )
}

function ActionsTab({ 
  user, 
  onResetPwdClick, 
  onFreezeClick, 
  onSuspendClick 
}: { 
  user: any, 
  onResetPwdClick: () => void, 
  onFreezeClick: () => void, 
  onSuspendClick: () => void 
}) {
  return (
    <div className="space-y-6 max-w-2xl">
       <h3 className="text-[10px] uppercase font-medium text-stone tracking-wider mb-2">Administrative Actions</h3>
       <div className="space-y-4">
          <div className="p-4 border border-rule rounded-md flex justify-between items-center bg-bg-elev">
             <div>
                <h4 className="text-xs font-medium text-cream mb-1">Reset Password</h4>
                <p className="text-[10px] text-stone">Send a password reset link to user's email.</p>
             </div>
             <Button id="btn-actions-res" variant="outline" size="sm" className="h-8 text-xs text-lime" onClick={onResetPwdClick}>Send Email</Button>
          </div>
          <div className="p-4 border border-warn/30 bg-warn/5 rounded-md flex justify-between items-center bg-bg-elev">
             <div>
                <h4 className="text-xs font-medium text-cream mb-1">Freeze Account</h4>
                <p className="text-[10px] text-stone">Temporarily disable withdrawals and trading.</p>
             </div>
             <Button 
               id="btn-actions-frz"
               variant="outline" 
               size="sm" 
               className="h-8 text-xs border-warn/50 text-warn hover:bg-warn/10"
               onClick={onFreezeClick}
             >
                {user.status === "Frozen" ? "Unfreeze" : "Freeze"}
             </Button>
          </div>
          <div className="p-4 border border-bad/30 bg-bad/5 rounded-md flex justify-between items-center bg-bg-elev font-sans">
             <div>
                <h4 className="text-xs font-medium text-cream mb-1">Suspend User</h4>
                <p className="text-[10px] text-stone">Permanently disable access to the platform.</p>
             </div>
             <Button 
               id="btn-actions-sus"
               variant="outline" 
               size="sm" 
               className="h-8 text-xs border-bad/50 text-bad hover:bg-bad/10"
               onClick={onSuspendClick}
             >
                {user.status === "Suspended" ? "Activate" : "Suspend"}
             </Button>
          </div>
       </div>
    </div>
  )
}

function P2PTab({ user }: { user: any }) {
  return (
    <div className="space-y-6">
       <h3 className="text-[10px] uppercase font-medium text-stone tracking-wider">P2P Trade History</h3>
       <div className="border border-rule rounded-md overflow-hidden">
          <table className="w-full text-left">
             <thead className="bg-bg-base border-b border-rule">
                <tr>
                   <th className="px-4 py-2 text-xs font-medium text-stone">Order ID</th>
                   <th className="px-4 py-2 text-xs font-medium text-stone">Type</th>
                   <th className="px-4 py-2 text-xs font-medium text-stone">Asset</th>
                   <th className="px-4 py-2 text-xs font-medium text-stone">Amount</th>
                   <th className="px-4 py-2 text-xs font-medium text-stone">Status</th>
                   <th className="px-4 py-2 text-xs font-medium text-stone">Date</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-rule text-xs">
                <tr>
                   <td className="px-4 py-3 font-mono text-stone">P2P_092M1</td>
                   <td className="px-4 py-3"><Badge variant="outline" className="text-[9px] text-good border-good/50 bg-good/10">BUY</Badge></td>
                   <td className="px-4 py-3">USDT</td>
                   <td className="px-4 py-3 font-mono">100.00</td>
                   <td className="px-4 py-3"><Badge variant="success" className="text-[9px]">Completed</Badge></td>
                   <td className="px-4 py-3 text-stone">Nov 14, 2023</td>
                </tr>
                <tr>
                   <td className="px-4 py-3 font-mono text-stone">P2P_092M2</td>
                   <td className="px-4 py-3"><Badge variant="outline" className="text-[9px] text-bad border-bad/50 bg-bad/10">SELL</Badge></td>
                   <td className="px-4 py-3">BTC</td>
                   <td className="px-4 py-3 font-mono">0.05</td>
                   <td className="px-4 py-3"><Badge variant="outline" className="text-[9px] text-stone">Cancelled</Badge></td>
                   <td className="px-4 py-3 text-stone">Nov 10, 2023</td>
                </tr>
                <tr>
                   <td className="px-4 py-3 font-mono text-stone">P2P_092M3</td>
                   <td className="px-4 py-3"><Badge variant="outline" className="text-[9px] text-good border-good/50 bg-good/10">BUY</Badge></td>
                   <td className="px-4 py-3">ETH</td>
                   <td className="px-4 py-3 font-mono">1.2</td>
                   <td className="px-4 py-3"><Badge variant="success" className="text-[9px]">Completed</Badge></td>
                   <td className="px-4 py-3 text-stone">Oct 28, 2023</td>
                </tr>
             </tbody>
          </table>
       </div>
    </div>
  )
}

function KPICard({ label, value, alert }: { label: string, value: string, alert?: boolean }) {
  return (
    <Card className="bg-bg-paper border-rule relative overflow-hidden">
      {alert && <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-bad"></span>}
      <CardContent className="p-4 py-3 flex flex-col justify-center h-full gap-1">
        <p className="text-[10px] font-medium text-stone uppercase tracking-wide">{label}</p>
        <p className="text-lg font-mono text-cream leading-none">{value}</p>
      </CardContent>
    </Card>
  )
}
