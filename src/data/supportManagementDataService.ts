// NobleBond Admin — Customer Support Operations Data Service
// Strictly separate from Chat Management (user-to-user dating conversations).
// Reuses existing NobleBond members, staff actors, mobile Contact Us categories, and cross-module routes. Zero emojis.

import type {
  KnowledgeBaseArticle,
  SupportAgentRecord,
  SupportAuditEvent,
  SupportCategoryGroup,
  SupportDateRange,
  SupportFilterState,
  SupportOverviewKpis,
  SupportProgramSettings,
  SupportResponseTemplate,
  SupportRoleKey,
  SupportRolePermissions,
  SupportSortField,
  SupportTicketRecord,
  TicketPriority,
  TicketStatus,
} from "../types/supportManagement.types";
import { loadUsersFromStorage } from "./userManagementDataService";
import {
  DEMO_REFERENCE_NOW_MS,
  evaluateTicketSlaStatus,
  getPriorityMeta,
} from "../components/support/supportUiUtils";

const STORAGE_KEYS = {
  TICKETS: "noblebond_admin_support_tickets_v2",
  AGENTS: "noblebond_admin_support_agents_v2",
  TEMPLATES: "noblebond_admin_support_templates_v2",
  KB_ARTICLES: "noblebond_admin_support_kb_v2",
  SETTINGS: "noblebond_admin_support_settings_v2",
  AUDIT: "noblebond_admin_support_audit_v2",
};

export const SUPPORT_CATEGORY_CATALOG: Record<SupportCategoryGroup, string[]> = {
  "Account & Authentication": [
    "Login Problems",
    "Registration Problems",
    "Email Verification",
    "Phone Verification",
    "Password Reset",
    "Account Access",
    "Account Deletion",
  ],
  "Profile & Discovery": [
    "Profile Problems",
    "Profile Verification",
    "Profile Visibility",
    "Discovery Problems",
    "Likes and Matches",
  ],
  "Messaging & Communication": [
    "Chat Problems",
    "Message Delivery",
    "Voice Call Problems",
    "Video Call Problems",
    "Live Streaming Problems",
  ],
  "Premium & Billing": [
    "Premium Subscription",
    "Subscription Renewal",
    "Payment Failed",
    "Refund Request",
    "Subscription Cancellation",
  ],
  "Wallet & Rewards": [
    "Gift Coins",
    "Connection Points",
    "Referral Rewards",
    "Wallet Transaction",
    "Gift Transaction",
  ],
  "Safety & Moderation": [
    "Report Follow-up",
    "Account Restriction Appeal",
    "Safety Concern",
    "Suspicious Activity",
  ],
  "General Support": [
    "Technical Problem",
    "Feature Request",
    "Feedback",
    "Other",
  ],
};

// 17 Support Permissions Matrix across 4 Roles
export const SUPPORT_ROLE_PERMISSIONS: Record<SupportRoleKey, SupportRolePermissions> = {
  super_admin: {
    role: "super_admin",
    roleLabel: "Super Administrator",
    actorId: "agt_sarah",
    actorName: "Sarah Alexander",
    canViewTickets: true,
    canReplyToCustomers: true,
    canAddInternalNotes: true,
    canAssignTickets: true,
    canReassignTickets: true,
    canChangePriority: true,
    canEscalateTickets: true,
    canResolveTickets: true,
    canCloseTickets: true,
    canViewCustomerDetails: true,
    canViewTransactionRefs: true,
    canManageAgents: true,
    canManageTemplates: true,
    canManageKnowledgeBase: true,
    canManageSettings: true,
    canViewAnalytics: true,
    canViewAuditHistory: true,
  },
  senior_support_lead: {
    role: "senior_support_lead",
    roleLabel: "Senior Support Lead",
    actorId: "agt_elena",
    actorName: "Elena Vance",
    canViewTickets: true,
    canReplyToCustomers: true,
    canAddInternalNotes: true,
    canAssignTickets: true,
    canReassignTickets: true,
    canChangePriority: true,
    canEscalateTickets: true,
    canResolveTickets: true,
    canCloseTickets: true,
    canViewCustomerDetails: true,
    canViewTransactionRefs: true,
    canManageAgents: true,
    canManageTemplates: true,
    canManageKnowledgeBase: true,
    canManageSettings: false,
    canViewAnalytics: true,
    canViewAuditHistory: true,
  },
  support_agent: {
    role: "support_agent",
    roleLabel: "Frontline Support Agent",
    actorId: "agt_alex",
    actorName: "Moderator Alex",
    canViewTickets: true,
    canReplyToCustomers: true,
    canAddInternalNotes: true,
    canAssignTickets: true,
    canReassignTickets: false,
    canChangePriority: true,
    canEscalateTickets: true,
    canResolveTickets: true,
    canCloseTickets: false,
    canViewCustomerDetails: true,
    canViewTransactionRefs: false, // Limited access: payment references restricted
    canManageAgents: false,
    canManageTemplates: false,
    canManageKnowledgeBase: false,
    canManageSettings: false,
    canViewAnalytics: true,
    canViewAuditHistory: false,
  },
  support_auditor: {
    role: "support_auditor",
    roleLabel: "Compliance & QA Viewer (Read-Only)",
    actorId: "agt_audit",
    actorName: "QA & Audit Reviewer",
    canViewTickets: true,
    canReplyToCustomers: false,
    canAddInternalNotes: false,
    canAssignTickets: false,
    canReassignTickets: false,
    canChangePriority: false,
    canEscalateTickets: false,
    canResolveTickets: false,
    canCloseTickets: false,
    canViewCustomerDetails: false,
    canViewTransactionRefs: false,
    canManageAgents: false,
    canManageTemplates: false,
    canManageKnowledgeBase: false,
    canManageSettings: false,
    canViewAnalytics: true,
    canViewAuditHistory: true,
  },
};

// Reuses existing staff identifiers across NobleBond_Admin (zero invented staff)
const INITIAL_AGENTS: SupportAgentRecord[] = [
  {
    id: "agt_sarah",
    name: "Sarah Alexander",
    email: "sarah.alexander@noblebond.com",
    roleTitle: "Super Administrator",
    avatarInitials: "SA",
    queueStatus: "accepting_tickets",
    specialties: ["Premium & Billing", "Wallet & Rewards", "Safety & Moderation"],
    isExistingStaffRecord: true,
  },
  {
    id: "agt_elena",
    name: "Elena Vance",
    email: "elena.vance@noblebond.com",
    roleTitle: "Senior Support & Operations Lead",
    avatarInitials: "EV",
    queueStatus: "accepting_tickets",
    specialties: ["Wallet & Rewards", "Premium & Billing", "Account & Authentication"],
    isExistingStaffRecord: true,
  },
  {
    id: "agt_alex",
    name: "Moderator Alex",
    email: "alex.mod@noblebond.com",
    roleTitle: "Frontline Support Specialist",
    avatarInitials: "MA",
    queueStatus: "accepting_tickets",
    specialties: ["Messaging & Communication", "Profile & Discovery", "General Support"],
    isExistingStaffRecord: true,
  },
  {
    id: "agt_james",
    name: "Moderator James",
    email: "james.mod@noblebond.com",
    roleTitle: "Trust & Verification Analyst",
    avatarInitials: "MJ",
    queueStatus: "accepting_tickets",
    specialties: ["Profile & Discovery", "Account & Authentication", "Safety & Moderation"],
    isExistingStaffRecord: true,
  },
  {
    id: "agt_david",
    name: "Head of Safety David",
    email: "david.safety@noblebond.com",
    roleTitle: "Escalations & Safety Lead",
    avatarInitials: "HD",
    queueStatus: "accepting_tickets",
    specialties: ["Safety & Moderation", "Messaging & Communication"],
    isExistingStaffRecord: true,
  },
];

const INITIAL_SETTINGS: SupportProgramSettings = {
  ticketIdPrefix: "TKT-",
  defaultPriority: "medium",
  defaultCategory: "Technical Problem",
  autoAssignMode: "manual_triage",
  allowReopenDays: 14,
  lockClosedTicketsAfterDays: 30,
  businessHoursLabel: "24/7 International Concierge Queue (Shift Handovers 08:00 & 20:00 UTC)",
  workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  slaFirstResponseMinutes: {
    urgent: 15,
    high: 45,
    medium: 180,
    low: 480,
  },
  slaResolutionMinutes: {
    urgent: 240,
    high: 720,
    medium: 1440,
    low: 2880,
  },
  enabledCategories: Object.values(SUPPORT_CATEGORY_CATALOG).flat(),
  notifyNewTicket: true,
  notifyCustomerReply: true,
  notifyAssignment: true,
  notifyEscalation: true,
  notifySlaBreach: true,
  notifyResolution: false,
  collectCsatFeedback: true,
  lastUpdatedAt: "2026-11-01T10:00:00Z",
  lastUpdatedBy: "Sarah Alexander (Super Administrator)",
};

const INITIAL_TEMPLATES: SupportResponseTemplate[] = [
  {
    id: "TPL-101",
    name: "Gift Coins Sync Confirmation",
    category: "Gift Coins",
    subjectSuggestion: "Update on your Gift Coins Purchase",
    content:
      "Thank you for contacting NobleBond Support. We have checked your recent Gift Coin purchase reference and confirmed the balance synchronization with your Wallet ledger. Please refresh the Live stream gift tray and let us know if your balance displays as expected.",
    status: "active",
    createdBy: "Elena Vance",
    updatedAt: "2026-11-05T12:00:00Z",
  },
  {
    id: "TPL-102",
    name: "Verification Lighting & Retry Guide",
    category: "Verification",
    subjectSuggestion: "Helping complete your profile selfie verification",
    content:
      "Thank you for reaching out about your profile verification. Please ensure your selfie is taken in even, well-lit indoor lighting without sunglasses or heavy filters, with your face centered inside the oval guide. You can retry directly under Profile > Verification.",
    status: "active",
    createdBy: "Moderator James",
    updatedAt: "2026-11-04T09:30:00Z",
  },
  {
    id: "TPL-103",
    name: "Premium Billing & App Store Guidance",
    category: "Premium Subscription",
    subjectSuggestion: "Information regarding your NobleBond Premium Billing",
    content:
      "We are happy to clarify your NobleBond Premium billing record. Subscriptions purchased through Apple App Store or Google Play are billed directly via your store account, while Stripe Web subscriptions manage renewals in Account Settings. Please reply with any additional receipt details if further review is needed.",
    status: "active",
    createdBy: "Sarah Alexander",
    updatedAt: "2026-11-06T14:20:00Z",
  },
  {
    id: "TPL-104",
    name: "Referral Qualification Requirement Reminder",
    category: "Referral Rewards",
    subjectSuggestion: "How NobleBond Referral Connection Points qualify",
    content:
      "Thank you for checking on your Invite & Earn referral reward. Under NobleBond rules, your invited friend must sign up with your code and complete email or phone OTP verification before 50 Connection Points become eligible for the referrer wallet (new users receive 0 bonus points).",
    status: "active",
    createdBy: "Elena Vance",
    updatedAt: "2026-11-07T16:10:00Z",
  },
  {
    id: "TPL-105",
    name: "OTP Code Delay Troubleshooting",
    category: "Account & Login",
    subjectSuggestion: "Resolving email / SMS OTP code delivery delays",
    content:
      "If your verification code has not arrived after 60 seconds, please check your spam/promotions folder (for email OTP) or confirm carrier roaming/SMS filters are not blocking shortcodes. You may request a fresh OTP after the cooldown timer completes.",
    status: "active",
    createdBy: "Moderator Alex",
    updatedAt: "2026-11-08T11:00:00Z",
  },
  {
    id: "TPL-106",
    name: "Safety Concern Acknowledgment",
    category: "Safety",
    subjectSuggestion: "Your NobleBond safety inquiry has been prioritized",
    content:
      "Your safety matters to us at NobleBond. Our Trust & Safety team is reviewing the ticket you submitted. Remember you can immediately block any member from their profile menu at any time while our specialists complete the investigation.",
    status: "active",
    createdBy: "Head of Safety David",
    updatedAt: "2026-11-08T15:00:00Z",
  },
];

const INITIAL_KB_ARTICLES: KnowledgeBaseArticle[] = [
  {
    id: "KB-201",
    title: "Selfie Liveness & Identity Verification Standards",
    category: "Profile Management",
    summary: "Explains review turnaround targets and common selfie upload rejection causes for support agents.",
    content:
      "Most verification reviews complete within 5 to 15 minutes using biometric liveness checks paired with agent review. Common issues include low lighting, cropped forehead/chin, or outdated camera permissions on iOS/Android.",
    author: "Moderator James",
    createdAt: "2026-10-05T10:00:00Z",
    updatedAt: "2026-11-02T14:30:00Z",
    status: "published",
    isAdminInternalOnly: true,
  },
  {
    id: "KB-202",
    title: "Invite & Earn: OTP Qualification & Anti-Fraud Policy",
    category: "Referral Programme",
    summary: "Internal reference on referrer-only 50 Connection Points qualification rules.",
    content:
      "Only the referrer receives 50 Connection Points once the referred friend registers with a valid code and verifies either email or phone via OTP. Self-referrals, duplicate devices, and unverified accounts are excluded.",
    author: "Elena Vance",
    createdAt: "2026-10-12T08:45:00Z",
    updatedAt: "2026-11-04T11:15:00Z",
    status: "published",
    isAdminInternalOnly: true,
  },
  {
    id: "KB-203",
    title: "Separating Gift Coins, Connection Points, and Premium Billing",
    category: "Gift Coins",
    summary: "Agent escalation guide for billing vs virtual economy discrepancies.",
    content:
      "Gift Coins are used strictly for virtual live-stream gifts and have no cash payout value. Connection Points unlock in-app dating perks (Extra Likes 15 Pts, Super Likes 25 Pts, Discovery Spotlight 40 Pts, Profile Boost 50 Pts). Direct unresolved discrepancies to Wallet & Financial Management.",
    author: "Sarah Alexander",
    createdAt: "2026-10-18T12:00:00Z",
    updatedAt: "2026-11-06T09:20:00Z",
    status: "published",
    isAdminInternalOnly: true,
  },
  {
    id: "KB-204",
    title: "Premium Subscription Cancellation & App Store Billing",
    category: "Premium Membership",
    summary: "How App Store, Google Play, and Stripe Web renewals behave on cancellation.",
    content:
      "Cancelling stops future auto-renewal while preserving Premium benefits until the end of the active billing cycle. App Store & Play Store refunds must follow store receipt verification.",
    author: "Sarah Alexander",
    createdAt: "2026-10-20T15:30:00Z",
    updatedAt: "2026-11-01T16:40:00Z",
    status: "published",
    isAdminInternalOnly: true,
  },
  {
    id: "KB-205",
    title: "Handling Privacy, Distance Hiding & Blocking Inquiries",
    category: "Safety & Privacy",
    summary: "Explains approximate distance privacy and user block behavior.",
    content:
      "NobleBond never displays exact GPS coordinates to other members, only approximate city or distance. Blocking immediately prevents mutual profile discovery or messaging.",
    author: "Head of Safety David",
    createdAt: "2026-10-25T11:10:00Z",
    updatedAt: "2026-10-25T11:10:00Z",
    status: "published",
    isAdminInternalOnly: true,
  },
];

const INITIAL_TICKETS: SupportTicketRecord[] = [
  {
    id: "tkt_501",
    customerUserId: "usr_nb_90423",
    customerName: "Zara Love",
    customerUsername: "@zara_love",
    customerEmail: "zara.love@outlook.com",
    customerAvatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    customerCountry: "United States",
    subject: "Gift Coin purchase credited but Live tray took 30s to update",
    description: "Purchased Popular Pack via mobile checkout; Live gift tray lagged for half a minute.",
    categoryGroup: "Wallet & Rewards",
    category: "Gift Coins",
    priority: "medium",
    status: "in_progress",
    source: "In-App Support",
    assignedAgentId: "agt_alex",
    assignedAgentName: "Moderator Alex",
    unreadBySupport: false,
    createdAt: "2026-11-10T10:10:00Z",
    firstResponseAt: "2026-11-10T10:18:00Z",
    lastActivityAt: "2026-11-10T11:12:00Z",
    relatedModuleRoute: "/wallet",
    relatedReferenceId: "GCP-5002",
    messages: [
      {
        id: "msg_501_1",
        ticketId: "tkt_501",
        senderType: "customer",
        senderName: "Zara Love",
        senderRole: "Member",
        content: "Hi support, my Gift Coins showed up in Wallet right away, but the Live stream gift tray took about 30 seconds before displaying the updated coin balance.",
        timestamp: "2026-11-10T10:10:00Z",
        isInternalNote: false,
        deliveryStatus: "read",
      },
      {
        id: "msg_501_2",
        ticketId: "tkt_501",
        senderType: "agent",
        senderName: "Moderator Alex",
        senderRole: "Frontline Support Specialist",
        content: "Thank you for flagging this, Zara. We are verifying your Gift Coin sync reference GCP-5002 right now to confirm all coins are fully available.",
        timestamp: "2026-11-10T10:18:00Z",
        isInternalNote: false,
        deliveryStatus: "delivered",
      },
      {
        id: "msg_501_n1",
        ticketId: "tkt_501",
        senderType: "agent",
        senderName: "Moderator Alex",
        senderRole: "Frontline Support Specialist",
        content: "Internal Note: Verified Wallet balance shows full Gift Coins settled. Monitoring live socket refresh latency.",
        timestamp: "2026-11-10T11:12:00Z",
        isInternalNote: true,
      },
    ],
    timeline: [
      { id: "stl_501_1", timestamp: "2026-11-10T10:10:00Z", eventType: "ticket_created", title: "Ticket Created", description: "Submitted via In-App Support", actor: "Zara Love" },
      { id: "stl_501_2", timestamp: "2026-11-10T10:15:00Z", eventType: "ticket_assigned", title: "Assigned to Moderator Alex", description: "Picked up from Support Inbox triage", actor: "Moderator Alex" },
      { id: "stl_501_3", timestamp: "2026-11-10T10:18:00Z", eventType: "agent_replied", title: "First Response Sent", description: "Reply sent within 8 minutes", actor: "Moderator Alex" },
      { id: "stl_501_4", timestamp: "2026-11-10T11:12:00Z", eventType: "internal_note_added", title: "Internal Note Added", description: "Checked Wallet ledger ref GCP-5002", actor: "Moderator Alex" },
    ],
  },
  {
    id: "tkt_502",
    customerUserId: "usr_nb_90424",
    customerName: "Jayden Cole",
    customerUsername: "@jayden_cole",
    customerEmail: "jayden.cole@studiox.co.uk",
    customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    customerCountry: "United Kingdom",
    subject: "ID document upload failing during identity verification step",
    description: "Selfie step works but passport upload returns timeout on mobile upload.",
    categoryGroup: "Profile & Discovery",
    category: "Profile Verification",
    priority: "high",
    status: "waiting_for_support",
    source: "In-App Support",
    assignedAgentId: null,
    assignedAgentName: "Unassigned",
    unreadBySupport: true,
    createdAt: "2026-11-10T10:35:00Z",
    lastActivityAt: "2026-11-10T10:35:00Z",
    relatedModuleRoute: "/profiles",
    relatedReferenceId: "usr_nb_90424",
    messages: [
      {
        id: "msg_502_1",
        ticketId: "tkt_502",
        senderType: "customer",
        senderName: "Jayden Cole",
        senderRole: "Member",
        content: "Hello team, my live selfie passes, but when uploading the government ID frame it spins for 20 seconds and fails cleanly.",
        timestamp: "2026-11-10T10:35:00Z",
        isInternalNote: false,
        deliveryStatus: "delivered",
        attachments: [{ id: "att_502_1", name: "verification_error_screen.png", sizeLabel: "640 KB", type: "screenshot" }],
      },
    ],
    timeline: [
      { id: "stl_502_1", timestamp: "2026-11-10T10:35:00Z", eventType: "ticket_created", title: "Ticket Submitted", description: "Unassigned high-priority verification ticket", actor: "Jayden Cole" },
    ],
  },
  {
    id: "tkt_503",
    customerUserId: "usr_nb_90426",
    customerName: "Tobi Bakare",
    customerUsername: "@tobi_bakare",
    customerEmail: "tobi.bakare@gmail.com",
    customerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    customerCountry: "Nigeria",
    subject: "Referral invite link code status & pending OTP friend question",
    description: "Asked why invited friend Victor Okafor has not credited 50 Pts yet.",
    categoryGroup: "Wallet & Rewards",
    category: "Referral Rewards",
    priority: "low",
    status: "resolved",
    source: "In-App Support",
    assignedAgentId: "agt_sarah",
    assignedAgentName: "Sarah Alexander",
    unreadBySupport: false,
    createdAt: "2026-11-09T09:10:00Z",
    firstResponseAt: "2026-11-09T09:24:00Z",
    resolvedAt: "2026-11-09T09:42:00Z",
    lastActivityAt: "2026-11-09T09:42:00Z",
    relatedModuleRoute: "/referrals",
    relatedReferenceId: "REF-9004",
    satisfaction: {
      rating: 5,
      sentiment: "positive",
      comment: "Very clear explanation about OTP verification before points credit.",
      submittedAt: "2026-11-09T10:05:00Z",
    },
    messages: [
      {
        id: "msg_503_1",
        ticketId: "tkt_503",
        senderType: "customer",
        senderName: "Tobi Bakare",
        senderRole: "Member",
        content: "My friend Victor registered with code TOBIFIT earlier today. Why is REF-9004 still showing Pending in my Invite & Earn screen?",
        timestamp: "2026-11-09T09:10:00Z",
        isInternalNote: false,
        deliveryStatus: "read",
      },
      {
        id: "msg_503_2",
        ticketId: "tkt_503",
        senderType: "agent",
        senderName: "Sarah Alexander",
        senderRole: "Super Administrator",
        content: "Hi Tobi, once your friend completes either email or phone OTP verification, the referral qualifies and 50 Connection Points will become eligible for your wallet.",
        timestamp: "2026-11-09T09:24:00Z",
        isInternalNote: false,
        deliveryStatus: "read",
      },
    ],
    timeline: [
      { id: "stl_503_1", timestamp: "2026-11-09T09:10:00Z", eventType: "ticket_created", title: "Ticket Created", description: "Via In-App Support", actor: "Tobi Bakare" },
      { id: "stl_503_2", timestamp: "2026-11-09T09:24:00Z", eventType: "agent_replied", title: "Agent Replied", description: "Explained OTP qualification rule", actor: "Sarah Alexander" },
      { id: "stl_503_3", timestamp: "2026-11-09T09:42:00Z", eventType: "ticket_resolved", title: "Ticket Resolved", description: "Resolved cleanly after clarification", actor: "Sarah Alexander" },
    ],
  },
  {
    id: "TKT-1004",
    customerUserId: "usr_nb_90427",
    customerName: "Marcus Sterling",
    customerUsername: "@marcus_sterling",
    customerEmail: "m.sterling@sterlingholdings.ca",
    customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    customerCountry: "Canada",
    subject: "Stripe Web Premium renewal charge declined twice despite valid card",
    description: "Member reports Yearly VIP renewal authorization failure on bank card.",
    categoryGroup: "Premium & Billing",
    category: "Payment Failed",
    priority: "urgent",
    status: "escalated",
    source: "Email Support",
    assignedAgentId: "agt_elena",
    assignedAgentName: "Elena Vance",
    unreadBySupport: true,
    createdAt: "2026-11-10T09:45:00Z",
    firstResponseAt: "2026-11-10T10:00:00Z",
    lastActivityAt: "2026-11-10T10:30:00Z",
    relatedModuleRoute: "/subscriptions",
    relatedReferenceId: "SUB-7004",
    escalationInfo: {
      escalatedTo: "Sarah Alexander (Subscription & Billing Finance)",
      escalationTargetModule: "Subscription Management",
      reason: "Urgent Stripe renewal retry failure impacting VIP access continuity.",
      escalatedAt: "2026-11-10T10:30:00Z",
      escalatedBy: "Elena Vance",
      reviewStatus: "in_review",
    },
    messages: [
      {
        id: "msg_1004_1",
        ticketId: "TKT-1004",
        senderType: "customer",
        senderName: "Marcus Sterling",
        senderRole: "Member",
        content: "My Yearly VIP subscription tried to renew this morning via Stripe and I got a declined email notification. Can billing look at invoice reference SUB-7004?",
        timestamp: "2026-11-10T09:45:00Z",
        isInternalNote: false,
        deliveryStatus: "read",
      },
      {
        id: "msg_1004_n1",
        ticketId: "TKT-1004",
        senderType: "agent",
        senderName: "Elena Vance",
        senderRole: "Senior Support Lead",
        content: "Internal Note: Escalating to Subscription Management review. Do not expose raw card info; check provider retry log on SUB-7004.",
        timestamp: "2026-11-10T10:30:00Z",
        isInternalNote: true,
      },
    ],
    timeline: [
      { id: "stl_1004_1", timestamp: "2026-11-10T09:45:00Z", eventType: "ticket_created", title: "Email Ticket Logged", description: "Received via support@noblebond.com", actor: "Marcus Sterling" },
      { id: "stl_1004_2", timestamp: "2026-11-10T10:30:00Z", eventType: "ticket_escalated", title: "Escalated to Billing Lead", description: "Stripe renewal decline inspection", actor: "Elena Vance" },
    ],
  },
  {
    id: "TKT-1005",
    customerUserId: "usr_nb_90433",
    customerName: "Brian Kovacs",
    customerUsername: "@brian_kovacs",
    customerEmail: "brian.kovacs@mail.com",
    customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    customerCountry: "United States",
    subject: "Appealing recent account suspension and gift dispute hold",
    description: "Suspended user asking for compliance review on recent enforcement.",
    categoryGroup: "Safety & Moderation",
    category: "Account Restriction Appeal",
    priority: "high",
    status: "escalated",
    source: "Website Support",
    assignedAgentId: "agt_david",
    assignedAgentName: "Head of Safety David",
    unreadBySupport: false,
    createdAt: "2026-11-08T14:20:00Z",
    firstResponseAt: "2026-11-08T15:00:00Z",
    lastActivityAt: "2026-11-09T11:40:00Z",
    relatedModuleRoute: "/moderation",
    relatedReferenceId: "REP-MOD-882",
    escalationInfo: {
      escalatedTo: "Head of Safety David (Reports & Moderation)",
      escalationTargetModule: "Reports & Moderation",
      reason: "Safety suspension & Golden Ring gift dispute require Trust & Safety determination.",
      escalatedAt: "2026-11-08T15:10:00Z",
      escalatedBy: "Moderator Alex",
      reviewStatus: "pending_review",
    },
    messages: [
      {
        id: "msg_1005_1",
        ticketId: "TKT-1005",
        senderType: "customer",
        senderName: "Brian Kovacs",
        senderRole: "Member",
        content: "Why was my account placed under suspension? Please review my appeal.",
        timestamp: "2026-11-08T14:20:00Z",
        isInternalNote: false,
        deliveryStatus: "read",
      },
      {
        id: "msg_1005_2",
        ticketId: "TKT-1005",
        senderType: "agent",
        senderName: "Head of Safety David",
        senderRole: "Escalations & Safety Lead",
        content: "Your appeal has been routed to Trust & Safety for formal evaluation against community guidelines. You will be notified once the review concludes.",
        timestamp: "2026-11-08T15:00:00Z",
        isInternalNote: false,
        deliveryStatus: "read",
      },
    ],
    timeline: [
      { id: "stl_1005_1", timestamp: "2026-11-08T14:20:00Z", eventType: "ticket_created", title: "Appeal Submitted", description: "Received via Web Support Form", actor: "Brian Kovacs" },
      { id: "stl_1005_2", timestamp: "2026-11-08T15:10:00Z", eventType: "ticket_escalated", title: "Escalated to Moderation", description: "Linked to Reports & Moderation", actor: "Moderator Alex" },
    ],
  },
  {
    id: "TKT-1006",
    customerUserId: "usr_nb_90429",
    customerName: "Kofi Mensah",
    customerUsername: "@kofi_mensah",
    customerEmail: "kofi.mensah@ghana.org",
    customerAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
    customerCountry: "Ghana",
    subject: "Video call audio drops after 2 minutes on iOS 26",
    description: "Reported recurring WebRTC microphone drop during mutual match video call.",
    categoryGroup: "Messaging & Communication",
    category: "Video Call Problems",
    priority: "medium",
    status: "waiting_for_user",
    source: "In-App Support",
    assignedAgentId: "agt_alex",
    assignedAgentName: "Moderator Alex",
    unreadBySupport: false,
    createdAt: "2026-11-09T13:15:00Z",
    firstResponseAt: "2026-11-09T13:30:00Z",
    lastActivityAt: "2026-11-09T13:32:00Z",
    relatedModuleRoute: "/chats",
    messages: [
      {
        id: "msg_1006_1",
        ticketId: "TKT-1006",
        senderType: "customer",
        senderName: "Kofi Mensah",
        senderRole: "Member",
        content: "Every video call cuts out on my end around the 2-minute mark on Wi-Fi.",
        timestamp: "2026-11-09T13:15:00Z",
        isInternalNote: false,
        deliveryStatus: "read",
      },
      {
        id: "msg_1006_2",
        ticketId: "TKT-1006",
        senderType: "agent",
        senderName: "Moderator Alex",
        senderRole: "Frontline Support Specialist",
        content: "Hi Kofi, could you confirm whether Low Power Mode or a VPN is active on iOS 26 when calling? We can check call telemetry once confirmed.",
        timestamp: "2026-11-09T13:30:00Z",
        isInternalNote: false,
        deliveryStatus: "delivered",
      },
    ],
    timeline: [
      { id: "stl_1006_1", timestamp: "2026-11-09T13:15:00Z", eventType: "ticket_created", title: "Ticket Submitted", description: "In-App Video Call diagnostic report", actor: "Kofi Mensah" },
      { id: "stl_1006_2", timestamp: "2026-11-09T13:30:00Z", eventType: "agent_replied", title: "Awaiting Customer Reply", description: "Asked for VPN / Low Power status", actor: "Moderator Alex" },
    ],
  },
  {
    id: "TKT-1007",
    customerUserId: "usr_nb_90428",
    customerName: "Chloe Dupont",
    customerUsername: "@chloe_paris",
    customerEmail: "chloe.dupont@artparis.fr",
    customerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    customerCountry: "France",
    subject: "Apple Pay Starter Coin Pack GCP-5006 still pending authorization",
    description: "Small Starter Pack ($1.99) IAP receipt shows pending webhook confirmation.",
    categoryGroup: "Wallet & Rewards",
    category: "Wallet Transaction",
    priority: "urgent",
    status: "new",
    source: "In-App Support",
    assignedAgentId: null,
    assignedAgentName: "Unassigned",
    unreadBySupport: true,
    createdAt: "2026-11-10T10:55:00Z",
    lastActivityAt: "2026-11-10T10:55:00Z",
    relatedModuleRoute: "/wallet",
    relatedReferenceId: "GCP-5006",
    messages: [
      {
        id: "msg_1007_1",
        ticketId: "TKT-1007",
        senderType: "customer",
        senderName: "Chloe Dupont",
        senderRole: "Member",
        content: "Bonjour! I tapped Apple Pay for the 100 Starter Coins Pack 25 minutes ago (AP-PEND-99104) and it still reads Pending in my wallet.",
        timestamp: "2026-11-10T10:55:00Z",
        isInternalNote: false,
        deliveryStatus: "delivered",
      },
    ],
    timeline: [
      { id: "stl_1007_1", timestamp: "2026-11-10T10:55:00Z", eventType: "ticket_created", title: "New Ticket Created", description: "Needs immediate triage (Urgent SLA: 15m)", actor: "Chloe Dupont" },
    ],
  },
  {
    id: "TKT-1008",
    customerUserId: "usr_nb_90421",
    customerName: "Amara Bliss",
    customerUsername: "@amara_bliss",
    customerEmail: "amara.bliss@noblebond.com",
    customerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    customerCountry: "Nigeria",
    subject: "Guest audio echo during Multi-Guest Live Broadcast room",
    description: "Host requested tips for preventing co-host echo on Live Sessions.",
    categoryGroup: "Messaging & Communication",
    category: "Live Streaming Problems",
    priority: "medium",
    status: "open",
    source: "In-App Support",
    assignedAgentId: "agt_sarah",
    assignedAgentName: "Sarah Alexander",
    unreadBySupport: true,
    createdAt: "2026-11-10T11:05:00Z",
    lastActivityAt: "2026-11-10T11:05:00Z",
    relatedModuleRoute: "/live",
    messages: [
      {
        id: "msg_1008_1",
        ticketId: "TKT-1008",
        senderType: "customer",
        senderName: "Amara Bliss",
        senderRole: "Member",
        content: "Hi Sarah/Concierge! During multi-guest live rooms, one guest speaker's speaker audio loops back. Are headphones recommended or is there an echo toggle?",
        timestamp: "2026-11-10T11:05:00Z",
        isInternalNote: false,
        deliveryStatus: "delivered",
      },
    ],
    timeline: [
      { id: "stl_1008_1", timestamp: "2026-11-10T11:05:00Z", eventType: "ticket_created", title: "Ticket Assigned", description: "Assigned to Sarah Alexander", actor: "System Triage" },
    ],
  },
  {
    id: "TKT-1009",
    customerUserId: "usr_nb_90432",
    customerName: "Victor Okafor",
    customerUsername: "@victor_okafor",
    customerEmail: "victor.okafor@ng.com",
    customerAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    customerCountry: "Nigeria",
    subject: "Phone SMS verification OTP not arriving on Nigerian carrier",
    description: "Unable to receive 6-digit phone OTP code to complete onboarding verification.",
    categoryGroup: "Account & Authentication",
    category: "Phone Verification",
    priority: "high",
    status: "waiting_for_support",
    source: "Website Support",
    assignedAgentId: "agt_james",
    assignedAgentName: "Moderator James",
    unreadBySupport: true,
    createdAt: "2026-11-10T08:40:00Z",
    lastActivityAt: "2026-11-10T08:40:00Z",
    relatedModuleRoute: "/users",
    relatedReferenceId: "usr_nb_90432",
    messages: [
      {
        id: "msg_1009_1",
        ticketId: "TKT-1009",
        senderType: "customer",
        senderName: "Victor Okafor",
        senderRole: "Member",
        content: "I signed up via Tobi's invite link and have been waiting for my SMS OTP verification code for an hour.",
        timestamp: "2026-11-10T08:40:00Z",
        isInternalNote: false,
        deliveryStatus: "delivered",
      },
    ],
    timeline: [
      { id: "stl_1009_1", timestamp: "2026-11-10T08:40:00Z", eventType: "ticket_created", title: "Ticket Received", description: "Routed to Moderator James (Overdue first response)", actor: "Victor Okafor" },
    ],
  },
  {
    id: "TKT-1010",
    customerUserId: "usr_nb_90425",
    customerName: "Lily Rose",
    customerUsername: "@lily_rose",
    customerEmail: "lily.rose@gmail.com",
    customerAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    customerCountry: "Nigeria",
    subject: "Used Connection Points for Additional Daily Likes successfully — Quick feedback",
    description: "Positive product feedback on Connection Points perk redemption speed.",
    categoryGroup: "General Support",
    category: "Feedback",
    priority: "low",
    status: "closed",
    source: "In-App Support",
    assignedAgentId: "agt_sarah",
    assignedAgentName: "Sarah Alexander",
    unreadBySupport: false,
    createdAt: "2026-11-02T11:00:00Z",
    firstResponseAt: "2026-11-02T11:20:00Z",
    resolvedAt: "2026-11-02T11:30:00Z",
    closedAt: "2026-11-03T11:30:00Z",
    lastActivityAt: "2026-11-03T11:30:00Z",
    relatedModuleRoute: "/wallet",
    relatedReferenceId: "RDM-6003",
    satisfaction: {
      rating: 5,
      sentiment: "positive",
      comment: "Friendly support response!",
      submittedAt: "2026-11-02T12:00:00Z",
    },
    messages: [
      {
        id: "msg_1010_1",
        ticketId: "TKT-1010",
        senderType: "customer",
        senderName: "Lily Rose",
        senderRole: "Member",
        content: "Just wanted to say redeeming 15 Connection Points for extra daily likes worked instantaneously!",
        timestamp: "2026-11-02T11:00:00Z",
        isInternalNote: false,
        deliveryStatus: "read",
      },
      {
        id: "msg_1010_2",
        ticketId: "TKT-1010",
        senderType: "agent",
        senderName: "Sarah Alexander",
        senderRole: "Super Administrator",
        content: "Thank you so much for sharing that feedback, Lily! Wishing you wonderful connections on NobleBond.",
        timestamp: "2026-11-02T11:20:00Z",
        isInternalNote: false,
        deliveryStatus: "read",
      },
    ],
    timeline: [
      { id: "stl_1010_1", timestamp: "2026-11-02T11:00:00Z", eventType: "ticket_created", title: "Feedback Logged", description: "Positive user feedback", actor: "Lily Rose" },
      { id: "stl_1010_2", timestamp: "2026-11-02T11:30:00Z", eventType: "ticket_resolved", title: "Resolved", description: "Acknowledged", actor: "Sarah Alexander" },
      { id: "stl_1010_3", timestamp: "2026-11-03T11:30:00Z", eventType: "ticket_closed", title: "Closed", description: "Archived after CSAT received", actor: "System Archive" },
    ],
  },
];

const INITIAL_AUDIT_EVENTS: SupportAuditEvent[] = [
  {
    id: "AUD-SUP-601",
    timestamp: "2026-11-10T11:12:00Z",
    ticketId: "tkt_501",
    customerName: "Zara Love",
    actorName: "Moderator Alex",
    actorRole: "Frontline Support Specialist",
    actionType: "internal_note_added",
    actionLabel: "Private Internal Note Added",
    reason: "Confirmed Gift Coins purchase GCP-5002 settled in wallet ledger.",
  },
  {
    id: "AUD-SUP-602",
    timestamp: "2026-11-10T10:30:00Z",
    ticketId: "TKT-1004",
    customerName: "Marcus Sterling",
    actorName: "Elena Vance",
    actorRole: "Senior Support Lead",
    actionType: "ticket_escalated",
    actionLabel: "Ticket Escalated to Billing",
    previousValue: "in_progress",
    newValue: "escalated",
    reason: "Stripe Yearly VIP renewal failure SUB-7004 requires Subscription Management review.",
  },
  {
    id: "AUD-SUP-603",
    timestamp: "2026-11-09T09:42:00Z",
    ticketId: "tkt_503",
    customerName: "Tobi Bakare",
    actorName: "Sarah Alexander",
    actorRole: "Super Administrator",
    actionType: "ticket_resolved",
    actionLabel: "Ticket Resolved",
    previousValue: "in_progress",
    newValue: "resolved",
    reason: "Clarified OTP qualification rule for referral REF-9004.",
  },
];

function safeLoad<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSave<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore quota limits in demo storage
  }
}

export function loadSupportTickets(): SupportTicketRecord[] {
  return safeLoad<SupportTicketRecord[]>(STORAGE_KEYS.TICKETS, INITIAL_TICKETS);
}

export function saveSupportTickets(tickets: SupportTicketRecord[]): void {
  safeSave(STORAGE_KEYS.TICKETS, tickets);
}

export function loadSupportAgents(): SupportAgentRecord[] {
  return safeLoad<SupportAgentRecord[]>(STORAGE_KEYS.AGENTS, INITIAL_AGENTS);
}

export function saveSupportAgents(agents: SupportAgentRecord[]): void {
  safeSave(STORAGE_KEYS.AGENTS, agents);
}

export function loadResponseTemplates(): SupportResponseTemplate[] {
  return safeLoad<SupportResponseTemplate[]>(STORAGE_KEYS.TEMPLATES, INITIAL_TEMPLATES);
}

export function saveResponseTemplates(tpls: SupportResponseTemplate[]): void {
  safeSave(STORAGE_KEYS.TEMPLATES, tpls);
}

export function loadKnowledgeBaseArticles(): KnowledgeBaseArticle[] {
  return safeLoad<KnowledgeBaseArticle[]>(STORAGE_KEYS.KB_ARTICLES, INITIAL_KB_ARTICLES);
}

export function saveKnowledgeBaseArticles(articles: KnowledgeBaseArticle[]): void {
  safeSave(STORAGE_KEYS.KB_ARTICLES, articles);
}

export function loadSupportSettings(): SupportProgramSettings {
  return safeLoad<SupportProgramSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
}

export function saveSupportSettings(settings: SupportProgramSettings): void {
  safeSave(STORAGE_KEYS.SETTINGS, settings);
}

export function loadSupportAuditHistory(): SupportAuditEvent[] {
  return safeLoad<SupportAuditEvent[]>(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_EVENTS);
}

export function appendSupportAuditEvent(
  event: Omit<SupportAuditEvent, "id" | "timestamp">
): SupportAuditEvent[] {
  const existing = loadSupportAuditHistory();
  const nextEntry: SupportAuditEvent = {
    ...event,
    id: `AUD-SUP-${Math.floor(610 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString(),
  };
  const next = [nextEntry, ...existing];
  safeSave(STORAGE_KEYS.AUDIT, next);
  return next;
}

export function isWithinSupportDateRange(
  isoDate: string,
  range: SupportDateRange,
  customStart?: string,
  customEnd?: string
): boolean {
  if (range === "all") return true;
  const ts = new Date(isoDate).getTime();
  if (Number.isNaN(ts)) return true;

  if (range === "today") {
    return ts >= new Date("2026-11-10T00:00:00Z").getTime();
  }
  if (range === "7d") return ts >= DEMO_REFERENCE_NOW_MS - 7 * 86400000;
  if (range === "30d") return ts >= DEMO_REFERENCE_NOW_MS - 30 * 86400000;
  if (range === "90d") return ts >= DEMO_REFERENCE_NOW_MS - 90 * 86400000;
  if (range === "custom") {
    const startTs = customStart ? new Date(`${customStart}T00:00:00Z`).getTime() : 0;
    const endTs = customEnd ? new Date(`${customEnd}T23:59:59Z`).getTime() : Number.MAX_SAFE_INTEGER;
    return ts >= startTs && ts <= endTs;
  }
  return true;
}

export function calculateSupportOverviewKPIs(
  tickets: SupportTicketRecord[],
  settings: SupportProgramSettings,
  currentActorId: string,
  dateRange: SupportDateRange = "all",
  customStart?: string,
  customEnd?: string
): SupportOverviewKpis {
  const scoped = tickets.filter((t) =>
    isWithinSupportDateRange(t.createdAt, dateRange, customStart, customEnd)
  );

  const totalTickets = scoped.length;
  const openStatuses: TicketStatus[] = [
    "new",
    "open",
    "in_progress",
    "waiting_for_user",
    "waiting_for_support",
    "escalated",
  ];
  const openTickets = scoped.filter((t) => openStatuses.includes(t.status)).length;
  const newTicketsToday = scoped.filter((t) =>
    isWithinSupportDateRange(t.createdAt, "today")
  ).length;
  const unassignedTickets = scoped.filter(
    (t) => !t.assignedAgentId && t.status !== "resolved" && t.status !== "closed"
  ).length;
  const assignedToMeCount = scoped.filter(
    (t) => t.assignedAgentId === currentActorId && t.status !== "closed"
  ).length;
  const awaitingUserCount = scoped.filter((t) => t.status === "waiting_for_user").length;
  const awaitingSupportCount = scoped.filter(
    (t) => t.status === "new" || t.status === "open" || t.status === "waiting_for_support"
  ).length;
  const escalatedCount = scoped.filter((t) => t.status === "escalated").length;
  const resolvedCount = scoped.filter(
    (t) => t.status === "resolved" || t.status === "closed"
  ).length;

  const overdueCount = scoped.filter(
    (t) => evaluateTicketSlaStatus(t, settings).isOverdue
  ).length;

  const withFirstResp = scoped.filter((t) => t.firstResponseAt);
  const avgFirstResponseMinutes =
    withFirstResp.length > 0
      ? Math.round(
          withFirstResp.reduce(
            (s, t) =>
              s +
              Math.max(
                1,
                (new Date(t.firstResponseAt!).getTime() - new Date(t.createdAt).getTime()) /
                  60000
              ),
            0
          ) / withFirstResp.length
        )
      : null;

  const withResolved = scoped.filter((t) => t.resolvedAt);
  const avgResolutionMinutes =
    withResolved.length > 0
      ? Math.round(
          withResolved.reduce(
            (s, t) =>
              s +
              Math.max(
                1,
                (new Date(t.resolvedAt!).getTime() - new Date(t.createdAt).getTime()) / 60000
              ),
            0
          ) / withResolved.length
        )
      : null;

  // Compute CSAT strictly from tickets that actually have collected feedback (never invented!)
  const withCsat = scoped.filter((t) => t.satisfaction !== undefined);
  const csatScorePercent =
    withCsat.length > 0
      ? Math.round(
          (withCsat.filter((t) => t.satisfaction!.rating >= 4).length / withCsat.length) *
            100
        )
      : null;

  const resolutionRatePercent =
    totalTickets > 0 ? Math.round((resolvedCount / totalTickets) * 100) : 0;

  return {
    totalTickets,
    openTickets,
    newTicketsToday,
    unassignedTickets,
    assignedToMeCount,
    awaitingUserCount,
    awaitingSupportCount,
    escalatedCount,
    resolvedCount,
    overdueCount,
    avgFirstResponseMinutes,
    avgResolutionMinutes,
    csatScorePercent,
    csatResponsesCount: withCsat.length,
    resolutionRatePercent,
  };
}

export function filterAndSortSupportTickets(
  tickets: SupportTicketRecord[],
  filters: SupportFilterState,
  sort: SupportSortField,
  settings: SupportProgramSettings
): SupportTicketRecord[] {
  let result = [...tickets];

  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.customerUsername.toLowerCase().includes(q) ||
        t.customerEmail.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }

  if (filters.status === "unread_only") {
    result = result.filter((t) => t.unreadBySupport);
  } else if (filters.status === "open_bundle") {
    result = result.filter((t) => t.status !== "resolved" && t.status !== "closed");
  } else if (filters.status !== "all") {
    result = result.filter((t) => t.status === filters.status);
  }

  if (filters.priority !== "all") {
    result = result.filter((t) => t.priority === filters.priority);
  }
  if (filters.categoryGroup !== "all") {
    result = result.filter((t) => t.categoryGroup === filters.categoryGroup);
  }
  if (filters.assignedAgentId === "unassigned") {
    result = result.filter((t) => !t.assignedAgentId);
  } else if (filters.assignedAgentId !== "all") {
    result = result.filter((t) => t.assignedAgentId === filters.assignedAgentId);
  }
  if (filters.source !== "all") {
    result = result.filter((t) => t.source === filters.source);
  }
  if (filters.overdueOnly) {
    result = result.filter((t) => evaluateTicketSlaStatus(t, settings).isOverdue);
  }
  if (filters.dateRange !== "all") {
    result = result.filter((t) =>
      isWithinSupportDateRange(
        t.createdAt,
        filters.dateRange,
        filters.customStartDate,
        filters.customEndDate
      )
    );
  }

  result.sort((a, b) => {
    if (sort === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sort === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sort === "priority_desc") {
      return getPriorityMeta(b.priority).rank - getPriorityMeta(a.priority).rank;
    }
    if (sort === "sla_risk") {
      const slaA = evaluateTicketSlaStatus(a, settings);
      const slaB = evaluateTicketSlaStatus(b, settings);
      if (slaA.isOverdue !== slaB.isOverdue) return slaA.isOverdue ? -1 : 1;
      return slaB.elapsedMinutes - slaA.elapsedMinutes;
    }
    return new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime();
  });

  return result;
}

export function sendSupportMessageOrNote(params: {
  ticketId: string;
  content: string;
  isInternalNote: boolean;
  actorName: string;
  actorRole: string;
  attachmentNames?: string[];
}): SupportTicketRecord[] {
  const list = loadSupportTickets();
  const target = list.find((t) => t.id === params.ticketId);
  const now = new Date().toISOString();

  const attachments = (params.attachmentNames || []).map((name, i) => ({
    id: `att_${Date.now()}_${i}`,
    name,
    sizeLabel: "240 KB",
    type: "image" as const,
  }));

  const updated = list.map((t) => {
    if (t.id !== params.ticketId) return t;
    const msgEntry = {
      id: `msg_${Date.now()}`,
      ticketId: t.id,
      senderType: "agent" as const,
      senderName: params.actorName,
      senderRole: params.actorRole,
      content: params.content.trim(),
      timestamp: now,
      isInternalNote: params.isInternalNote,
      deliveryStatus: params.isInternalNote ? undefined : ("demo_local" as const),
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    const nextStatus: TicketStatus = params.isInternalNote
      ? t.status
      : t.status === "new" || t.status === "open" || t.status === "waiting_for_support"
      ? "waiting_for_user"
      : t.status;

    const tlEvent = {
      id: `stl_${Date.now()}`,
      timestamp: now,
      eventType: params.isInternalNote ? ("internal_note_added" as const) : ("agent_replied" as const),
      title: params.isInternalNote ? "Internal Note Recorded" : "Demo Reply Added",
      description: params.isInternalNote
        ? "Private agent-only note recorded (never visible to customer)."
        : `Reply logged locally by ${params.actorName}.`,
      actor: params.actorName,
    };

    return {
      ...t,
      status: nextStatus,
      unreadBySupport: false,
      firstResponseAt: !params.isInternalNote && !t.firstResponseAt ? now : t.firstResponseAt,
      lastActivityAt: now,
      messages: [...t.messages, msgEntry],
      timeline: [...t.timeline, tlEvent],
    };
  });

  saveSupportTickets(updated);

  if (target) {
    appendSupportAuditEvent({
      ticketId: target.id,
      customerName: target.customerName,
      actorName: params.actorName,
      actorRole: params.actorRole,
      actionType: params.isInternalNote ? "internal_note_added" : "customer_reply_sent",
      actionLabel: params.isInternalNote
        ? "Internal Support Note Added"
        : "Demonstration Support Reply Sent",
      previousValue: target.status,
      newValue: params.isInternalNote ? target.status : "waiting_for_user",
      reason: params.content.trim().slice(0, 100),
    });
  }

  return updated;
}

export function assignSupportTicket(
  ticketId: string,
  agentId: string | null,
  agentName: string,
  actorName: string,
  actorRole: string
): SupportTicketRecord[] {
  const list = loadSupportTickets();
  const target = list.find((t) => t.id === ticketId);
  const now = new Date().toISOString();

  const updated = list.map((t) => {
    if (t.id !== ticketId) return t;
    const nextStatus: TicketStatus =
      t.status === "new" && agentId ? "open" : t.status;
    return {
      ...t,
      assignedAgentId: agentId,
      assignedAgentName: agentName,
      status: nextStatus,
      lastActivityAt: now,
      timeline: [
        ...t.timeline,
        {
          id: `stl_${Date.now()}`,
          timestamp: now,
          eventType: "ticket_assigned" as const,
          title: agentId ? `Assigned to ${agentName}` : "Ticket Unassigned",
          description: `Assignment updated by ${actorName}.`,
          actor: actorName,
        },
      ],
    };
  });
  saveSupportTickets(updated);

  if (target) {
    const isReassign = Boolean(target.assignedAgentId && target.assignedAgentId !== agentId);
    appendSupportAuditEvent({
      ticketId: target.id,
      customerName: target.customerName,
      actorName,
      actorRole,
      actionType: isReassign ? "ticket_reassigned" : "ticket_assigned",
      actionLabel: isReassign ? "Ticket Reassigned" : "Ticket Assigned",
      previousValue: target.assignedAgentName,
      newValue: agentName,
      reason: `Assigned to ${agentName}`,
    });
  }

  return updated;
}

export function updateTicketAttributes(
  ticketId: string,
  updates: {
    status?: TicketStatus;
    priority?: TicketPriority;
    categoryGroup?: SupportCategoryGroup;
    category?: string;
    unreadBySupport?: boolean;
  },
  actorName: string,
  actorRole: string
): SupportTicketRecord[] {
  const list = loadSupportTickets();
  const target = list.find((t) => t.id === ticketId);
  const now = new Date().toISOString();

  const updated = list.map((t) => {
    if (t.id !== ticketId) return t;
    const nextTimeline = [...t.timeline];
    if (updates.status && updates.status !== t.status) {
      nextTimeline.push({
        id: `stl_st_${Date.now()}`,
        timestamp: now,
        eventType:
          updates.status === "resolved"
            ? "ticket_resolved"
            : updates.status === "closed"
            ? "ticket_closed"
            : t.status === "resolved" || t.status === "closed"
            ? "ticket_reopened"
            : "status_changed",
        title: `Status Changed: ${t.status.replace(/_/g, " ")} -> ${updates.status.replace(/_/g, " ")}`,
        description: `Updated by ${actorName}.`,
        actor: actorName,
      });
    }
    if (updates.priority && updates.priority !== t.priority) {
      nextTimeline.push({
        id: `stl_pr_${Date.now()}`,
        timestamp: now,
        eventType: "priority_changed",
        title: `Priority Changed: ${t.priority} -> ${updates.priority}`,
        description: `Priority adjusted by ${actorName}.`,
        actor: actorName,
      });
    }
    return {
      ...t,
      status: updates.status ?? t.status,
      priority: updates.priority ?? t.priority,
      categoryGroup: updates.categoryGroup ?? t.categoryGroup,
      category: updates.category ?? t.category,
      unreadBySupport: updates.unreadBySupport ?? t.unreadBySupport,
      resolvedAt: updates.status === "resolved" ? now : t.resolvedAt,
      closedAt: updates.status === "closed" ? now : t.closedAt,
      lastActivityAt: now,
      timeline: nextTimeline,
    };
  });
  saveSupportTickets(updated);

  if (target) {
    if (updates.status && updates.status !== target.status) {
      appendSupportAuditEvent({
        ticketId: target.id,
        customerName: target.customerName,
        actorName,
        actorRole,
        actionType:
          updates.status === "resolved"
            ? "ticket_resolved"
            : updates.status === "closed"
            ? "ticket_closed"
            : target.status === "resolved" || target.status === "closed"
            ? "ticket_reopened"
            : "status_changed",
        actionLabel:
          updates.status === "resolved"
            ? "Ticket Resolved"
            : updates.status === "closed"
            ? "Ticket Closed"
            : target.status === "resolved" || target.status === "closed"
            ? "Ticket Reopened"
            : "Ticket Status Changed",
        previousValue: target.status,
        newValue: updates.status,
      });
    }
    if (updates.priority && updates.priority !== target.priority) {
      appendSupportAuditEvent({
        ticketId: target.id,
        customerName: target.customerName,
        actorName,
        actorRole,
        actionType: "priority_changed",
        actionLabel: "Ticket Priority Updated",
        previousValue: target.priority,
        newValue: updates.priority,
      });
    }
  }

  return updated;
}

export function escalateSupportTicket(params: {
  ticketId: string;
  escalatedTo: string;
  targetModule: string;
  reason: string;
  actorName: string;
  actorRole: string;
}): SupportTicketRecord[] {
  const list = loadSupportTickets();
  const target = list.find((t) => t.id === params.ticketId);
  const now = new Date().toISOString();

  const updated = list.map((t) => {
    if (t.id !== params.ticketId) return t;
    return {
      ...t,
      status: "escalated" as const,
      priority: t.priority === "low" ? ("medium" as const) : t.priority,
      lastActivityAt: now,
      escalationInfo: {
        escalatedTo: params.escalatedTo,
        escalationTargetModule: params.targetModule,
        reason: params.reason.trim(),
        escalatedAt: now,
        escalatedBy: params.actorName,
        reviewStatus: "pending_review" as const,
      },
      timeline: [
        ...t.timeline,
        {
          id: `stl_esc_${Date.now()}`,
          timestamp: now,
          eventType: "ticket_escalated" as const,
          title: `Escalated to ${params.escalatedTo}`,
          description: `Target Module: ${params.targetModule}. Reason: ${params.reason}`,
          actor: params.actorName,
        },
      ],
    };
  });
  saveSupportTickets(updated);

  if (target) {
    appendSupportAuditEvent({
      ticketId: target.id,
      customerName: target.customerName,
      actorName: params.actorName,
      actorRole: params.actorRole,
      actionType: "ticket_escalated",
      actionLabel: `Escalated to ${params.targetModule}`,
      previousValue: target.status,
      newValue: "escalated",
      reason: params.reason,
    });
  }

  return updated;
}

export function resolveEscalationCase(
  ticketId: string,
  reviewStatus: "in_review" | "resolved",
  actorName: string,
  actorRole: string
): SupportTicketRecord[] {
  const list = loadSupportTickets();
  const target = list.find((t) => t.id === ticketId);
  const now = new Date().toISOString();

  const updated = list.map((t) => {
    if (t.id !== ticketId || !t.escalationInfo) return t;
    return {
      ...t,
      status: reviewStatus === "resolved" ? ("resolved" as const) : t.status,
      resolvedAt: reviewStatus === "resolved" ? now : t.resolvedAt,
      lastActivityAt: now,
      escalationInfo: {
        ...t.escalationInfo,
        reviewStatus,
      },
      timeline: [
        ...t.timeline,
        {
          id: `stl_escrv_${Date.now()}`,
          timestamp: now,
          eventType: reviewStatus === "resolved" ? ("ticket_resolved" as const) : ("status_changed" as const),
          title:
            reviewStatus === "resolved"
              ? "Escalation Reviewed & Resolved"
              : "Escalation Marked In Review",
          description: `Updated by ${actorName}.`,
          actor: actorName,
        },
      ],
    };
  });
  saveSupportTickets(updated);

  if (target) {
    appendSupportAuditEvent({
      ticketId: target.id,
      customerName: target.customerName,
      actorName,
      actorRole,
      actionType: reviewStatus === "resolved" ? "ticket_resolved" : "status_changed",
      actionLabel:
        reviewStatus === "resolved" ? "Escalation Resolved" : "Escalation Under Review",
      previousValue: target.escalationInfo?.reviewStatus || "pending_review",
      newValue: reviewStatus,
    });
  }

  return updated;
}

// Build Customer Support Directory cleanly from User Management members (zero duplicated user profiles)
export interface SupportCustomerDirectoryItem {
  userId: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  country: string;
  accountStatus: string;
  isVerified: boolean;
  registrationDate: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  giftCoinsBalance: number;
  connectionPointsBalance: number;
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  lastActivityAt: string;
  latestCsatRating?: number;
}

export function buildSupportCustomerDirectory(
  tickets: SupportTicketRecord[]
): SupportCustomerDirectoryItem[] {
  const users = loadUsersFromStorage();

  return users.map((u) => {
    const owned = tickets.filter(
      (t) =>
        t.customerUserId === u.id ||
        t.customerName.toLowerCase() === u.name.toLowerCase()
    );
    const open = owned.filter(
      (t) => t.status !== "resolved" && t.status !== "closed"
    ).length;
    const resolved = owned.filter(
      (t) => t.status === "resolved" || t.status === "closed"
    ).length;
    const latest = [...owned].sort(
      (a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
    )[0];
    const withRating = owned.find((t) => t.satisfaction !== undefined);

    return {
      userId: u.id,
      name: u.name,
      username: u.username,
      email: u.email,
      phone: u.phone,
      avatar: u.avatar,
      country: u.country,
      accountStatus: u.status,
      isVerified: u.verification.status === "verified",
      registrationDate: u.registrationDate,
      subscriptionPlan: u.premium.planName,
      subscriptionStatus: u.premium.status,
      giftCoinsBalance: u.wallet.giftCoins,
      connectionPointsBalance: u.wallet.connectionPoints,
      totalTickets: owned.length,
      openTickets: open,
      resolvedTickets: resolved,
      lastActivityAt: latest?.lastActivityAt || u.lastActive,
      latestCsatRating: withRating?.satisfaction?.rating,
    };
  });
}

export function updateAgentQueueStatus(
  agentId: string,
  queueStatus: SupportAgentRecord["queueStatus"],
  actorName: string,
  actorRole: string
): SupportAgentRecord[] {
  const agents = loadSupportAgents();
  const target = agents.find((a) => a.id === agentId);
  const updated = agents.map((a) =>
    a.id === agentId ? { ...a, queueStatus } : a
  );
  saveSupportAgents(updated);
  if (target) {
    appendSupportAuditEvent({
      actorName,
      actorRole,
      actionType: "agent_updated",
      actionLabel: "Support Agent Queue Status Updated",
      previousValue: `${target.name} (${target.queueStatus})`,
      newValue: `${target.name} (${queueStatus})`,
    });
  }
  return updated;
}

export function upsertResponseTemplate(
  tpl: SupportResponseTemplate,
  actorName: string,
  actorRole: string
): SupportResponseTemplate[] {
  const list = loadResponseTemplates();
  const exists = list.some((item) => item.id === tpl.id);
  const updated = exists
    ? list.map((item) => (item.id === tpl.id ? tpl : item))
    : [tpl, ...list];
  saveResponseTemplates(updated);
  appendSupportAuditEvent({
    actorName,
    actorRole,
    actionType: "template_updated",
    actionLabel: exists ? "Response Template Edited" : "Response Template Created",
    newValue: `${tpl.name} (${tpl.category})`,
  });
  return updated;
}

export function deleteResponseTemplate(
  id: string,
  actorName: string,
  actorRole: string
): SupportResponseTemplate[] {
  const list = loadResponseTemplates();
  const target = list.find((t) => t.id === id);
  const updated = list.filter((t) => t.id !== id);
  saveResponseTemplates(updated);
  if (target) {
    appendSupportAuditEvent({
      actorName,
      actorRole,
      actionType: "template_updated",
      actionLabel: "Response Template Removed",
      previousValue: target.name,
    });
  }
  return updated;
}

export function upsertKnowledgeBaseArticle(
  article: KnowledgeBaseArticle,
  actorName: string,
  actorRole: string
): KnowledgeBaseArticle[] {
  const list = loadKnowledgeBaseArticles();
  const exists = list.some((a) => a.id === article.id);
  const updated = exists
    ? list.map((a) => (a.id === article.id ? article : a))
    : [article, ...list];
  saveKnowledgeBaseArticles(updated);
  appendSupportAuditEvent({
    actorName,
    actorRole,
    actionType: "kb_updated",
    actionLabel: exists ? "Knowledge Base Article Updated" : "Knowledge Base Article Created",
    newValue: `${article.title} (${article.status})`,
  });
  return updated;
}

export function updateSupportSettingsConfig(
  next: SupportProgramSettings,
  reason: string,
  actorName: string,
  actorRole: string
): SupportProgramSettings {
  const prev = loadSupportSettings();
  const finalized: SupportProgramSettings = {
    ...next,
    lastUpdatedAt: new Date().toISOString(),
    lastUpdatedBy: `${actorName} (${actorRole})`,
  };
  saveSupportSettings(finalized);
  appendSupportAuditEvent({
    actorName,
    actorRole,
    actionType: "settings_updated",
    actionLabel: "Support Configuration Updated (Demo)",
    previousValue: `Urgent SLA ${prev.slaFirstResponseMinutes.urgent}m / Reopen ${prev.allowReopenDays}d`,
    newValue: `Urgent SLA ${finalized.slaFirstResponseMinutes.urgent}m / Reopen ${finalized.allowReopenDays}d`,
    reason,
  });
  return finalized;
}

export function resetSupportManagementDemoData(): void {
  Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
}

// Privacy-safe CSV export (omits payment credentials, raw OTP tokens, private dating messages)
export function exportSupportTicketsCsv(tickets: SupportTicketRecord[]): void {
  const headers = [
    "Ticket ID",
    "Customer Name",
    "Username",
    "Category Group",
    "Category",
    "Priority",
    "Status",
    "Source",
    "Assigned Agent",
    "Created At",
    "Last Activity",
  ];
  const escape = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = tickets.map((t) => [
    t.id,
    t.customerName,
    t.customerUsername,
    t.categoryGroup,
    t.category,
    t.priority,
    t.status,
    t.source,
    t.assignedAgentName,
    t.createdAt,
    t.lastActivityAt,
  ]);
  const csv = [
    headers.map(escape).join(","),
    ...rows.map((r) => r.map(escape).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `noblebond_support_tickets_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

