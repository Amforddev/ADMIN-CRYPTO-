import React, { useState, useRef, FormEvent, DragEvent, MouseEvent } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  HelpCircle, 
  BookOpen, 
  LifeBuoy, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  X, 
  Paperclip, 
  Send, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  User, 
  Shield, 
  MessageSquare, 
  Bitcoin, 
  Info, 
  ArrowRight, 
  Loader2, 
  UploadCloud,
  FileText,
  HeartHandshake
} from "lucide-react"

// Types
interface KBArticle {
  id: string
  category: string
  title: string
  views: string
  readTime: string
  content: string
}

interface FAQItem {
  id: string
  category: string
  question: string
  answer: string
  helpfulVotes: number
  unhelpfulVotes: number
}

interface SupportTicket {
  id: string
  subject: string
  category: "Disputes" | "Security" | "Compliance" | "Treasury" | "General"
  urgency: "Low" | "Medium" | "High" | "Emergency"
  status: "Pending Review" | "Under Investigation" | "Resolved"
  createdAt: string
  description: string
  attachmentName?: string
  messages: {
    sender: "You" | "L3 Support Operator" | "System Automation"
    time: string
    text: string
  }[]
}

const INITIAL_KB_ARTICLES: KBArticle[] = [
  {
    id: "kb_01",
    category: "Security",
    title: "Enforcing 2FA Authenticator recovery seeds",
    views: "1.2k views",
    readTime: "4 min read",
    content: "When initiating team members, Google Authenticator seed values are generated inside a zero-trust enclave. If a personnel member loses their master device, their active session must be marked stale immediately via the 'Enforce 2FA Reset' toggle inside the Staff list. This sets the account state to 'challenging_auth', prompting the user to re-register their TOTP secret upon the next login sequence. Keep backup keys on offline hardware."
  },
  {
    id: "kb_02",
    category: "Security",
    title: "Platform-wide Whitelisting of IP Addresses",
    views: "850 views",
    readTime: "3 min read",
    content: "Internal administrative commands (such as manual KYC overrides and outbound wallet sweeps) require static office IP address bounds. Head to Settings > General > Security Defaults to configure whitelisted administrative subnets. Any sign-in attempts outside designated boundaries will invoke an immediate MFA lockout and trigger a high-severity notification to the security Slack channel."
  },
  {
    id: "kb_03",
    category: "Compliance",
    title: "KYC Verification Failures & Troubleshooting",
    views: "2.1k views",
    readTime: "5 min read",
    content: "The majority of automated KYC rejections stem from fuzzy document matching failures (such as blurry capture or name omissions). To perform an override for a validated user, click the 'User KYC Tier Override' action. Ensure you have physical sight of the passport or state certificate, and cross-reference the SHA256 checksum with the registered identity trace in the compliance pool."
  },
  {
    id: "kb_04",
    category: "Treasury",
    title: "Hot to Cold Storage Custody Sweeping Protocols",
    views: "930 views",
    readTime: "6 min read",
    content: "Our system sweeps excess liquidity into cold multi-sig accounts daily when hot wallets exceed 15% of the systemic token ledger. If gas spikes halt the transactions, an emergency fee threshold must be configured manually inside Settings > Fees. Always ensure that at least three out of four cryptographic signatories are online during high-value transfer windows."
  },
  {
    id: "kb_05",
    category: "Disputes",
    title: "P2P Dispute Handling Best Practices",
    views: "1.6k views",
    readTime: "5 min read",
    content: "When a P2P order is disputed by a peer, the corresponding escrow quantity of stablecoins is locked instantly in dynamic smart vaults. L2 Support agents must audit chat history, request external banking payment proofs, and verify transfer receipt before releasing escrow or assigning fault. Never release escrow based solely on digital screenshots, as editing tools allow easy replication of banks' mobile receipt screens. Verify via direct ledger checks."
  }
]

const INITIAL_FAQS: FAQItem[] = [
  {
    id: "faq_1",
    category: "Treasury",
    question: "What should I do if a system sweep queue is stuck for more than 4 hours?",
    answer: "A pending sweep queue is typically caused by setting low gas maximum fees during network congestion. Check Settings > Fees to verify the Ethereum max-fee markup. Increment the maximum cap to bypass native mempool stalling, which resolves stalled transactions directly.",
    helpfulVotes: 42,
    unhelpfulVotes: 2
  },
  {
    id: "faq_2",
    category: "Compliance",
    question: "How do I override a user's security compliance freeze?",
    answer: "Only team members with 'Super Admin' or 'Compliance Ops' clearance roles can elevate a locked account. Navigate to the Users directory, locate the suspended customer code, toggle the Active status to 'Enabled', and provide a detailed review reason to log inside the tamper-proof Audit Log page.",
    helpfulVotes: 29,
    unhelpfulVotes: 1
  },
  {
    id: "faq_3",
    category: "Security",
    question: "Why does administrative login trigger TOTP token timeouts frequently?",
    answer: "This is a safety threshold enforced when the time sync between our secure node servers and the operational authenticator drifts beyond 30 seconds. Support personnel can trigger an 'Enforce Auth Reset' to clear cached offsets and calibrate authenticators in physical sync.",
    helpfulVotes: 17,
    unhelpfulVotes: 0
  },
  {
    id: "faq_4",
    category: "Limits",
    question: "Can I customize the daily outbound withdrawal limits for an individual desk?",
    answer: "System rules authorize customized parameters only under exceptional circumstances for high-volume VIP desks. These requests require compliance tier-3 approval and can be updated by selecting the desk resource directly and issuing a custom parameter limit modification.",
    helpfulVotes: 24,
    unhelpfulVotes: 3
  },
  {
    id: "faq_5",
    category: "Disputes",
    question: "How are P2P disputing tickets allocated to support staff?",
    answer: "Disputes are automatically loaded onto support queues based on agent availability and language. If you need to re-assign an allocated ticket, access the Disputes menu, select the target dispute item, and click 'Assign This Ticket to Me' or select a team member from the dispatch dropdown list.",
    helpfulVotes: 31,
    unhelpfulVotes: 1
  }
]

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: "TKT-2901",
    subject: "Escrow release logic failing on ERC20 nodes",
    category: "Disputes",
    urgency: "Emergency",
    status: "Under Investigation",
    createdAt: "2026-06-03 15:10",
    description: "When triggering manual releases for dispute #4419a, the node responded with 'reverted: gas estimated failed'. The stablecoins remain locked in dynamic smart vault escrow, but the external customer is reporting proof of payments.",
    attachmentName: "node_error_log.txt",
    messages: [
      {
        sender: "You",
        time: "2026-06-03 15:10",
        text: "Escrow release fails with revert status on mainnet. Dispute requires immediate resolution."
      },
      {
        sender: "L3 Support Operator",
        time: "2026-06-03 15:45",
        text: "Investigating Ethereum ERC20 contract status. Node reports gas estimator drift. Please standby while we override gas caps manually."
      }
    ]
  },
  {
    id: "TKT-1811",
    subject: "Audit Log CSV export is omitting block timestamps",
    category: "Security",
    urgency: "Medium",
    status: "Resolved",
    createdAt: "2026-06-02 09:30",
    description: "The downloadable compliance spreadsheet misses raw hour timestamps on UTC time indices, which affects reporting outputs for external regulators.",
    attachmentName: "audit_draft_v2.csv",
    messages: [
      {
        sender: "You",
        time: "2026-06-02 09:30",
        text: "Hourly precision is required for AML filing checks."
      },
      {
        sender: "System Automation",
        time: "2026-06-02 11:20",
        text: "Patch applied to client exports. Timestamps are now aligned correctly with ISO formats."
      }
    ]
  }
]

export default function HelpCenter() {
  const [kbArticles] = useState<KBArticle[]>(INITIAL_KB_ARTICLES)
  const [faqs, setFaqs] = useState<FAQItem[]>(INITIAL_FAQS)
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS)

  // Interactive UI states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null)
  const [votedFaqs, setVotedFaqs] = useState<Record<string, "helpful" | "unhelpful">>({})
  
  // Modal / Detail drawer states
  const [selectedArticle, setSelectedArticle] = useState<KBArticle | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [isSubmitTicketOpen, setIsSubmitTicketOpen] = useState(false)

  // Custom toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Ticket Form States
  const [ticketSubject, setTicketSubject] = useState("")
  const [ticketCategory, setTicketCategory] = useState<"Disputes" | "Security" | "Compliance" | "Treasury" | "General">("General")
  const [ticketUrgency, setTicketUrgency] = useState<"Low" | "Medium" | "High" | "Emergency">("Medium")
  const [ticketDescription, setTicketDescription] = useState("")
  const [ticketAttachment, setTicketAttachment] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isFormSubmitting, setIsFormSubmitting] = useState(false)

  // Ticket Chat State
  const [chatMessage, setChatMessage] = useState("")
  const chatBottomRef = useRef<HTMLDivElement>(null)

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Filter FAQs & KB Articles based on search & category
  const filteredKbArticles = kbArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || article.category.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || faq.category.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  // Handle FAQ Vote Actions
  const handleFaqVote = (faqId: string, type: "helpful" | "unhelpful") => {
    if (votedFaqs[faqId]) {
      triggerToast("You have already voted on this FAQ item.")
      return
    }

    setVotedFaqs(prev => ({ ...prev, [faqId]: type }))
    setFaqs(prev => prev.map(faq => {
      if (faq.id === faqId) {
        return {
          ...faq,
          helpfulVotes: type === "helpful" ? faq.helpfulVotes + 1 : faq.helpfulVotes,
          unhelpfulVotes: type === "unhelpful" ? faq.unhelpfulVotes + 1 : faq.unhelpfulVotes
        }
      }
      return faq
    }))
    triggerToast(`Thank you for marking this resource as ${type === "helpful" ? "helpful" : "unhelpful"}!`)
  }

  // Handle Drag & Drop events
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setTicketAttachment(e.dataTransfer.files[0])
      triggerToast(`Selected attachment: ${e.dataTransfer.files[0].name}`)
    }
  }

  // Manual File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTicketAttachment(e.target.files[0])
      triggerToast(`Selected attachment: ${e.target.files[0].name}`)
    }
  }

  // Handle Ticket Form Submission
  const handleTicketSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!ticketSubject || !ticketDescription) {
      triggerToast("Please provide both a ticket subject and description.")
      return
    }

    setIsFormSubmitting(true)

    // Simulate cryptographic processing time
    setTimeout(() => {
      const newTicket: SupportTicket = {
        id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
        subject: ticketSubject,
        category: ticketCategory,
        urgency: ticketUrgency,
        status: "Pending Review",
        createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
        description: ticketDescription,
        attachmentName: ticketAttachment ? ticketAttachment.name : undefined,
        messages: [
          {
            sender: "You",
            time: new Date().toISOString().replace("T", " ").substring(0, 16),
            text: ticketDescription
          },
          {
            sender: "System Automation",
            time: new Date().toISOString().replace("T", " ").substring(0, 16),
            text: `Support ticket has been registered on secure node database. High-priority dispatch code issued. An L3 operations manager from the ${ticketCategory} guild will review your case trace shortly.`
          }
        ]
      }

      setTickets(prev => [newTicket, ...prev])
      setIsFormSubmitting(false)
      setIsSubmitTicketOpen(false)
      
      // Reset variables
      setTicketSubject("")
      setTicketCategory("General")
      setTicketUrgency("Medium")
      setTicketDescription("")
      setTicketAttachment(null)

      triggerToast(`Support ticket ${newTicket.id} successfully queued with ${ticketUrgency} priority!`)
    }, 1200)
  }

  // Handle live chat response addition
  const handleSendChatMessage = (e: FormEvent) => {
    e.preventDefault()
    if (!chatMessage.trim() || !selectedTicket) return

    const newMessageText = chatMessage.trim()
    setChatMessage("")

    setTickets(prev => prev.map(t => {
      if (t.id === selectedTicket.id) {
        const updatedMessages = [
          ...t.messages,
          {
            sender: "You" as const,
            time: new Date().toISOString().replace("T", " ").substring(0, 16),
            text: newMessageText
          }
        ]
        
        // Auto reply simulation after brief timeout
        setTimeout(() => {
          setTickets(current => current.map(currTicket => {
            if (currTicket.id === t.id) {
              const replyText = `Acknowledged transmission on ${t.id} queue scope. Internal compliance audits are currently scanning target nodes. Additional secure trace logs have been coupled to this workspace.`
              const nextMsgs = [
                ...currTicket.messages,
                {
                  sender: "L3 Support Operator" as const,
                  time: new Date().toISOString().replace("T", " ").substring(0, 16),
                  text: replyText
                }
              ]
              
              // Trigger update in screen
              if (selectedTicket && selectedTicket.id === t.id) {
                setSelectedTicket({ ...currTicket, messages: nextMsgs })
              }
              return { ...currTicket, messages: nextMsgs }
            }
            return currTicket
          }))
          triggerToast("L3 Operator status: New message update received.")
        }, 1500)

        // Immediately update state of selected drawer
        setSelectedTicket({ ...t, messages: updatedMessages })
        return { ...t, messages: updatedMessages }
      }
      return t
    }))

    // Scroll to bottom
    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 80)
  }

  const categoryIcons: Record<string, any> = {
    all: LifeBuoy,
    security: Shield,
    disputes: AlertCircle,
    limits: User,
    treasury: Bitcoin,
    general: HelpCircle
  }

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-6rem)] relative font-sans text-cream">
      
      {/* Header Panel */}
      <div className="flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-xl font-display font-medium text-cream flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-lime" />
            Support Center
          </h1>
          <p className="text-stone text-xs mt-1">
            Access administrative knowledge guidelines, searchable FAQs, and secure L3 support ticketing services.
          </p>
        </div>
        <Button 
          id="btn-open-ticket-submission"
          className="gap-2 bg-lime text-bg-base hover:bg-lime/90 font-bold uppercase text-xs h-9 tracking-wide px-4 cursor-pointer"
          onClick={() => setIsSubmitTicketOpen(true)}
        >
          <LifeBuoy className="w-4 h-4"/> Raise Support Request
        </Button>
      </div>

      {/* Search Header Banner */}
      <div className="bg-bg-elev border border-rule rounded-sm p-6 shrink-0 relative overflow-hidden flex flex-col items-center justify-center text-center">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 opacity-5 pointer-events-none">
          <HeartHandshake className="w-64 h-64 text-cream" />
        </div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-lime mb-2">How can we support your operations?</h2>
        <p className="text-xs text-stone max-w-lg mb-4">
          Search our database of compliance overrides, smart contract escrow releases, staff rules, and cold transaction parameters.
        </p>
        <div className="relative w-full max-w-xl">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone" />
          <Input 
            id="help-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-bg-base text-xs h-10 border-rule text-cream focus-visible:ring-lime w-full pr-12 placeholder:text-stone/65" 
            placeholder="Search core articles, error codes, limits policy..." 
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone hover:text-cream text-xs"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Hand: Knowledge Base & FAQs */}
        <div className="lg:col-span-8 flex flex-col gap-6 overflow-y-auto pr-1">
          
          {/* Category Selector Nodes */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone mb-3 block">Filter resources by Node category</span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {Object.keys(categoryIcons).map(catKey => {
                const Icon = categoryIcons[catKey]
                const isActive = selectedCategory === catKey
                return (
                  <button
                    key={catKey}
                    id={`btn-cat-${catKey}`}
                    onClick={() => setSelectedCategory(catKey)}
                    className={`flex flex-col items-center gap-2 p-3 border rounded-sm transition-all text-center cursor-pointer ${
                      isActive 
                        ? 'bg-lime-tint border-lime text-lime' 
                        : 'bg-bg-elev border-rule text-stone hover:border-stone/40 hover:text-cream'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-lime' : 'text-stone group-hover:text-cream'}`} />
                    <span className="text-[10px] font-semibold uppercase tracking-wider truncate w-full">{catKey}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Knowledge Base Area */}
          <div className="bg-bg-elev border border-rule rounded-sm p-4">
            <div className="flex justify-between items-center mb-4 border-b border-rule pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-lime" />
                Operational Knowledge Base ({filteredKbArticles.length})
              </span>
              <span className="text-[10px] font-mono text-stone">Guideline Modules</span>
            </div>

            {filteredKbArticles.length === 0 ? (
              <div className="text-center p-8 text-stone text-xs">
                No advanced guideline articles found matching active filter state.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredKbArticles.map(article => (
                  <Card 
                    key={article.id}
                    id={`idx-kb-${article.id}`}
                    onClick={() => setSelectedArticle(article)}
                    className="bg-bg-paper border-rule hover:border-stone/40 cursor-pointer p-4 group transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-[9px] uppercase tracking-wider py-0 px-1.5 font-bold h-4 text-stone bg-bg-base/30">
                          {article.category}
                        </Badge>
                        <span className="text-[9px] font-mono text-stone">{article.readTime}</span>
                      </div>
                      <h3 className="text-xs font-semibold text-cream group-hover:text-lime transition-colors leading-snug">
                        {article.title}
                      </h3>
                      <p className="text-[10px] text-stone mt-2 line-clamp-2">
                        {article.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-stone mt-3.5 border-t border-rule/50 pt-2 font-mono justify-between">
                      <span>{article.views}</span>
                      <span className="text-lime flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                        Read System DOC <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Interactive FAQs list */}
          <div className="bg-bg-elev border border-rule rounded-sm p-4 mb-3">
            <div className="flex justify-between items-center mb-4 border-b border-rule pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-lime" />
                Searchable FAQ Catalog ({filteredFaqs.length})
              </span>
              <span className="text-[10px] font-mono text-stone">Accredited Answers</span>
            </div>

            {filteredFaqs.length === 0 ? (
              <div className="text-center p-8 text-stone text-xs">
                No FAQ item matches search filter. Try secondary keywords.
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredFaqs.map(faq => {
                  const isExpanded = expandedFaqId === faq.id
                  const voteState = votedFaqs[faq.id]
                  return (
                    <div 
                      key={faq.id}
                      id={`row-faq-${faq.id}`}
                      className="bg-bg-paper/45 border border-rule rounded-sm overflow-hidden"
                    >
                      <button
                        type="button"
                        className="w-full text-left p-3.5 flex justify-between items-center gap-3 text-xs font-semibold hover:bg-bg-paper/85 transition-colors cursor-pointer text-cream"
                        onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      >
                        <span className="hover:text-lime transition-colors">{faq.question}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-stone shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-stone shrink-0" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 border-t border-rule/30 text-xs text-stone leading-relaxed animate-in slide-in-from-top-2 duration-200">
                          <p className="text-stone">
                            {faq.answer}
                          </p>
                          
                          {/* Vote interactive */}
                          <div className="mt-4 pt-3.5 border-t border-rule/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                            <span className="text-[10px] text-stone font-mono">
                              Was this system resolve helpful?
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                id={`btn-vote-helpful-${faq.id}`}
                                disabled={!!voteState}
                                onClick={() => handleFaqVote(faq.id, "helpful")}
                                className={`text-[10px] h-6 px-2.5 rounded-sm flex items-center gap-1 font-mono uppercase font-bold transition-all cursor-pointer ${
                                  voteState === "helpful" 
                                    ? "bg-good/25 text-good" 
                                    : "bg-bg-base hover:bg-bg-high text-stone hover:text-cream border border-rule"
                                }`}
                              >
                                <Check className="w-3 h-3 text-good" /> Helpful ({faq.helpfulVotes})
                              </button>
                              <button
                                type="button"
                                id={`btn-vote-unhelpful-${faq.id}`}
                                disabled={!!voteState}
                                onClick={() => handleFaqVote(faq.id, "unhelpful")}
                                className={`text-[10px] h-6 px-2.5 rounded-sm flex items-center gap-1 font-mono uppercase font-bold transition-all cursor-pointer ${
                                  voteState === "unhelpful" 
                                    ? "bg-bad/25 text-bad" 
                                    : "bg-bg-base hover:bg-bg-high text-stone hover:text-cream border border-rule"
                                }`}
                              >
                                <X className="w-3 h-3 text-bad" /> No ({faq.unhelpfulVotes})
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Hand: Active Support Tickets tracker */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pl-1">
          
          <div className="bg-bg-elev border border-rule rounded-sm p-4 flex flex-col flex-1 h-full min-h-[420px]">
            <div className="flex justify-between items-center mb-4 border-b border-rule pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-lime" />
                Your Platform Tickets ({tickets.length})
              </span>
              <Badge variant="outline" className="text-[9px] uppercase tracking-wider h-4 text-lime bg-lime-tint border-lime/30">
                L3 Desk
              </Badge>
            </div>

            <p className="text-[11px] text-stone leading-relaxed mb-4">
              Track resolution timelines on node contract lockups, database exceptions, or audit requests filed with hardware team administrators.
            </p>

            <div className="space-y-3 overflow-y-auto flex-1 h-0 max-h-[460px] pr-1">
              {tickets.map(t => {
                const urgencyColors = {
                  Low: "border-stone/40 text-stone bg-bg-paper/30",
                  Medium: "border-info/30 text-info bg-info/10",
                  High: "border-warn/30 text-warn bg-warn/10",
                  Emergency: "border-bad/30 text-bad bg-bad/10"
                }

                const statusIcons = {
                  "Pending Review": Clock,
                  "Under Investigation": AlertCircle,
                  "Resolved": CheckCircle2
                }
                const StatusIcon = statusIcons[t.status]

                return (
                  <Card 
                    key={t.id}
                    id={`row-ticket-${t.id}`}
                    onClick={() => setSelectedTicket(t)}
                    className="p-3 bg-bg-paper border-rule hover:border-lime/30 cursor-pointer transition-colors group relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-lime font-bold">{t.id}</span>
                      <div className="flex items-center gap-1.5">
                        <Badge className={`text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0 h-4 rounded-sm border ${urgencyColors[t.urgency]}`}>
                          {t.urgency}
                        </Badge>
                        <span className={`text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 font-mono ${
                          t.status === "Resolved" ? "text-good" : t.status === "Under Investigation" ? "text-info" : "text-stone"
                        }`}>
                          <StatusIcon className="w-2.5 h-2.5" />
                          {t.status}
                        </span>
                      </div>
                    </div>
                    
                    <h4 className="text-xs font-semibold text-cream group-hover:text-lime transition-colors truncate">
                      {t.subject}
                    </h4>
                    
                    <p className="text-[10px] text-stone mt-1.5 line-clamp-1">
                      {t.description}
                    </p>

                    <div className="mt-3 pt-2 border-t border-rule/50 flex justify-between items-center text-[9px] text-stone font-mono">
                      <span>{t.createdAt}</span>
                      <span className="text-stone group-hover:text-cream flex items-center gap-1">
                        View Thread ({t.messages.length}) <ArrowRight className="w-2.5 h-2.5 text-lime" />
                      </span>
                    </div>
                  </Card>
                )
              })}
            </div>

            <Button
              id="btn-raise-bottom-action"
              variant="outline"
              className="mt-4 border-rule hover:border-lime/20 text-[11px] font-bold uppercase tracking-wider bg-bg-paper text-cream w-full py-2 cursor-pointer"
              onClick={() => setIsSubmitTicketOpen(true)}
            >
              Raise A New Ticket Trace
            </Button>
          </div>

        </div>

      </div>

      {/* MODAL 1: KB ARTICLE VIEWER (Right side slideout sheet-drawer) */}
      {selectedArticle && (
        <div id="modal-article-view" className="fixed inset-0 bg-bg-base/75 backdrop-blur-sm z-40 flex items-center justify-end p-0 animate-in fade-in duration-150">
          <div className="bg-bg-elev border-l border-rule shadow-2xl h-full w-full max-w-xl overflow-y-auto animate-in slide-in-from-right duration-150 flex flex-col justify-between">
            
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Header */}
              <div className="p-4 border-b border-rule bg-bg-paper flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-stone tracking-widest flex items-center gap-1.5 font-mono">
                  <FileText className="w-3.5 h-3.5 text-lime" />
                  Documentation Module
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-stone hover:text-cream rounded-sm cursor-pointer" onClick={() => setSelectedArticle(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Scrollable body */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1 font-sans">
                
                <div className="border-b border-rule pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-[9px] uppercase tracking-wider font-extrabold text-lime border-lime/20 bg-lime-tint">
                      {selectedArticle.category}
                    </Badge>
                    <span className="text-[10px] font-mono text-stone">{selectedArticle.readTime}</span>
                    <span className="text-[10px] font-mono text-stone">&bull;</span>
                    <span className="text-[10px] font-mono text-stone">{selectedArticle.views}</span>
                  </div>
                  <h2 className="text-lg font-bold text-cream tracking-tight leading-snug">
                    {selectedArticle.title}
                  </h2>
                </div>

                {/* Article Core Content */}
                <div className="bg-bg-paper border border-rule rounded-sm p-5 leading-relaxed text-xs text-stone space-y-4">
                  <p className="whitespace-pre-line text-cream">
                    {selectedArticle.content}
                  </p>
                </div>

                {/* Secure certification footer warning */}
                <div className="p-4.5 bg-lime-tint border border-lime/10 rounded-sm flex items-start gap-3">
                  <Shield className="w-5 h-5 text-lime shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-cream block uppercase tracking-wide">Volt Security Team Notice</span>
                    <p className="text-[10px] text-stone mt-1">
                      This information represents validated protocol procedures. Adhering to whitelisting and verification rules is mandatory under financial regulatory criteria VOLT-COMP-2026.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Actions footer */}
            <div className="p-4 bg-bg-paper border-t border-rule flex items-center justify-end">
              <Button 
                variant="secondary"
                id="btn-close-kb"
                className="h-8.5 rounded-sm text-xs text-cream hover:bg-bg-base border border-rule hover:border-stone/40 px-5 uppercase font-bold tracking-wider cursor-pointer"
                onClick={() => setSelectedArticle(null)}
              >
                Close Guidelines
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: NEW TICKET SUBMISSION (Centered dialogue) */}
      {isSubmitTicketOpen && (
        <div id="modal-submit-ticket" className="fixed inset-0 bg-bg-base/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-bg-elev border border-rule rounded-sm shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-100 flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-rule bg-bg-paper flex items-center justify-between text-cream">
              <h3 className="text-sm font-semibold text-cream flex items-center gap-2">
                <LifeBuoy className="w-4 h-4 text-lime" />
                Raise Support Case Ticket
              </h3>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-stone hover:text-cream rounded-sm cursor-pointer" onClick={() => setIsSubmitTicketOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleTicketSubmit} className="p-5 space-y-4 overflow-y-auto">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-stone tracking-wider block mb-1">Queue Category</label>
                  <select
                    id="ticket-cat-select"
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value as any)}
                    className="w-full h-9 bg-bg-base border border-rule rounded-sm text-xs px-2.5 text-cream outline-none focus:border-stone"
                  >
                    <option value="General">General Platform Guidance </option>
                    <option value="Disputes">P2P Escrow & Disputes</option>
                    <option value="Security">2FA resets & locks</option>
                    <option value="Compliance">KYC, sanctions overrides</option>
                    <option value="Treasury">Hot sweeps & network gas</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-stone tracking-wider block mb-1">Priority Level</label>
                  <select
                    id="ticket-urgency-select"
                    value={ticketUrgency}
                    onChange={(e) => setTicketUrgency(e.target.value as any)}
                    className="w-full h-9 bg-bg-base border border-rule rounded-sm text-xs px-2.5 text-cream outline-none focus:border-stone"
                  >
                    <option value="Low">Low (Administrative)</option>
                    <option value="Medium">Medium (Disruptive issue)</option>
                    <option value="High">High (High-Priority failure)</option>
                    <option value="Emergency">Emergency (Active asset freeze / crash)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-stone tracking-wider block mb-1">Subject Title</label>
                <Input 
                  id="ticket-subject-input"
                  type="text"
                  value={ticketSubject}
                  required
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="bg-bg-base border-rule text-xs h-9 text-cream focus-visible:ring-lime w-full"
                  placeholder="e.g., Gas limit override reverting on Polygon contract"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-stone tracking-wider block mb-1">Case Description</label>
                <textarea
                  id="ticket-desc-input"
                  value={ticketDescription}
                  required
                  onChange={(e) => setTicketDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-bg-base border border-rule rounded-sm text-xs p-3 text-cream focus:border-stone focus:outline-none focus:ring-1 focus:ring-lime/40 placeholder:text-stone/55"
                  placeholder="Clearly explain the cryptographic error logs, dispute ID codes, or user emails involved..."
                />
              </div>

              {/* Secure drag and drop attachment element */}
              <div>
                <span className="text-[10px] uppercase font-bold text-stone tracking-wider block mb-1.5">Attachments (Screenshots / logs)</span>
                
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border border-dashed rounded-sm p-4 text-center transition-all relative cursor-pointer ${
                    isDragging 
                      ? "border-lime bg-lime-tint" 
                      : ticketAttachment 
                      ? "border-good/50 bg-good/5 text-cream" 
                      : "border-rule hover:border-stone/40 bg-bg-base/65 text-stone"
                  }`}
                >
                  <input
                    type="file"
                    id="ticket-file-input"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept=".png,.jpg,.jpeg,.txt,.log,.csv"
                  />
                  <UploadCloud className={`w-6 h-6 mx-auto mb-1.5 ${ticketAttachment ? "text-good" : "text-stone"}`} />
                  
                  {ticketAttachment ? (
                    <div>
                      <p className="text-xs font-semibold text-good">{ticketAttachment.name}</p>
                      <p className="text-[9px] text-stone mt-1">{(ticketAttachment.size / 1024).toFixed(1)} KB &bull; Type to replace</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-sans">Drag & Drop file log here, or <span className="text-lime underline">browse files</span></p>
                      <p className="text-[9px] mt-1">Accepts PNG, JPG, TXT, LOG, CSV (Max 5MB)</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-rule flex items-center justify-end gap-3 shrink-0">
                <Button 
                  type="button"
                  variant="ghost" 
                  className="h-8.5 text-xs text-stone hover:text-cream cursor-pointer text-stone"
                  onClick={() => setIsSubmitTicketOpen(false)}
                >
                  Discard
                </Button>
                <Button 
                  id="ticket-submit-btn"
                  type="submit"
                  disabled={isFormSubmitting}
                  className="h-8.5 text-xs bg-lime text-bg-base hover:bg-lime/90 font-bold uppercase tracking-wider cursor-pointer"
                >
                  {isFormSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1 text-black" /> Processing...
                    </>
                  ) : (
                    "File Secure Ticket"
                  )}
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: RECENT TICKET DIALOGUE / CHAT THREAD VIEW (Right side slideout drawer) */}
      {selectedTicket && (
        <div id="modal-ticket-chat" className="fixed inset-0 bg-bg-base/75 backdrop-blur-sm z-40 flex items-center justify-end p-0 animate-in fade-in duration-150">
          <div className="bg-bg-elev border-l border-rule shadow-2xl h-full w-full max-w-xl overflow-y-auto animate-in slide-in-from-right duration-150 flex flex-col justify-between">
            
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              
              {/* Header */}
              <div className="p-4 border-b border-rule bg-bg-paper flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[9px] uppercase tracking-wider font-extrabold text-lime border-lime/20 font-mono">
                    {selectedTicket.id}
                  </Badge>
                  <span className="text-xs font-bold text-cream">L3 Support Queue Thread</span>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-stone hover:text-cream rounded-sm cursor-pointer" onClick={() => setSelectedTicket(null)}>
                  <X className="w-4.5 h-4.5" />
                </Button>
              </div>

              {/* Upper Ticket Metadata Card */}
              <div className="p-4 bg-bg-base/35 border-b border-rule/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-wider text-stone font-bold font-mono">Category: {selectedTicket.category}</span>
                  <Badge variant="outline" className="text-[8px] bg-bg-paper text-orange-400 border-orange-400/20 font-mono">
                    Priority: {selectedTicket.urgency}
                  </Badge>
                </div>
                <h3 className="text-xs font-semibold text-cream leading-tight">
                  {selectedTicket.subject}
                </h3>
                <p className="text-[10px] text-stone">
                  Opened by you on <span className="text-cream">{selectedTicket.createdAt}</span>.
                </p>
                {selectedTicket.attachmentName && (
                  <div className="flex items-center gap-1.5 bg-bg-paper border border-rule rounded-sm px-2.5 py-1.5 mt-2 text-[9px] font-mono text-stone w-fit">
                    <Paperclip className="w-3.5 h-3.5 text-lime" />
                    Attachment Coupled: <span className="text-lime">{selectedTicket.attachmentName}</span>
                  </div>
                )}
              </div>

              {/* Chat Thread Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 min-h-[220px]">
                
                {/* Seed Initial Post */}
                <div className="flex flex-col gap-1 items-start max-w-[85%] bg-bg-paper border border-rule/50 p-3 rounded-sm">
                  <span className="text-[9px] font-bold text-lime uppercase font-mono">Your Submission</span>
                  <p className="text-xs text-cream leading-normal pr-1">{selectedTicket.description}</p>
                  <span className="text-[8px] text-stone mt-1">{selectedTicket.createdAt}</span>
                </div>

                {/* Messages Loop */}
                {selectedTicket.messages.filter((m, idx) => idx > 0).map((msg, idx) => {
                  const isUser = msg.sender === "You"
                  const isSystem = msg.sender === "System Automation"
                  
                  return (
                    <div 
                      key={idx}
                      className={`flex flex-col gap-1 max-w-[85%] p-3 rounded-sm ${
                        isUser 
                          ? "bg-bg-paper border border-rule/50 ml-auto items-end" 
                          : isSystem 
                          ? "bg-stone/5 border border-rule-strong text-stone" 
                          : "bg-lime-tint border border-lime/10"
                      }`}
                    >
                      <span className={`text-[9.5px] font-bold uppercase font-mono ${
                        isUser ? "text-lime" : isSystem ? "text-stone" : "text-lime-soft"
                      }`}>
                        {msg.sender}
                      </span>
                      <p className={`text-xs leading-normal ${isUser ? "text-cream text-right" : "text-cream"}`}>
                        {msg.text}
                      </p>
                      <span className="text-[8px] text-stone mt-1">{msg.time}</span>
                    </div>
                  )
                })}

                <div ref={chatBottomRef} />
              </div>

            </div>

            {/* Bottom Form Chat Action */}
            {selectedTicket.status !== "Resolved" ? (
              <form onSubmit={handleSendChatMessage} className="p-3 bg-bg-paper border-t border-rule flex gap-2 shrink-0">
                <Input
                  value={chatMessage}
                  id="chat-reply-input"
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 bg-bg-base text-xs h-9 border-rule text-cream focus-visible:ring-lime"
                  placeholder="Type administrative update/reply thread..."
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="bg-lime text-bg-base hover:bg-lime/90 cursor-pointer h-9 w-9 rounded flex items-center justify-center p-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </form>
            ) : (
              <div className="p-4 bg-bg-paper border-t border-rule text-center text-stone text-[10px] uppercase font-mono tracking-widest leading-relaxed shrink-0 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-good" /> This secure support trace was marked as CLOSED.
              </div>
            )}

          </div>
        </div>
      )}

      {/* Floating Action Notifications Toast */}
      {toastMessage && (
        <div id="toast-help-notification" className="fixed bottom-4 right-4 bg-lime text-bg-base font-bold text-xs px-4 py-3 rounded shadow-lg flex items-center gap-2.5 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 border border-white/20">
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
