// NobleBond Admin — Customer Support Management Type Definitions
// Enforces separation from Chat Management (user-to-user dating chats), 17 RBAC permissions,
// private internal notes vs customer replies, timestamp-based SLA evaluation, and zero emojis.

export type SupportTabKey =
  | "overview"
  | "inbox"
  | "all_tickets"
  | "my_tickets"
  | "unassigned"
  | "pending_responses"
  | "escalated"
  | "resolved"
  | "customers"
  | "agents"
  | "templates"
  | "knowledge_base"
  | "analytics"
  | "settings"
  | "audit_history";

export type SupportDateRange = "all" | "today" | "7d" | "30d" | "90d" | "custom";

export type TicketStatus =
  | "new"
  | "open"
  | "in_progress"
  | "waiting_for_user"
  | "waiting_for_support"
  | "escalated"
  | "resolved"
  | "closed";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type SupportSource = "In-App Support" | "Email Support" | "Website Support";

export type SupportCategoryGroup =
  | "Account & Authentication"
  | "Profile & Discovery"
  | "Messaging & Communication"
  | "Premium & Billing"
  | "Wallet & Rewards"
  | "Safety & Moderation"
  | "General Support";

export type SupportRoleKey =
  | "super_admin"
  | "senior_support_lead"
  | "support_agent"
  | "support_auditor";

// 17 Support Permissions (Prompt Section 24)
export interface SupportRolePermissions {
  role: SupportRoleKey;
  roleLabel: string;
  actorId: string;
  actorName: string;
  canViewTickets: boolean;
  canReplyToCustomers: boolean;
  canAddInternalNotes: boolean;
  canAssignTickets: boolean;
  canReassignTickets: boolean;
  canChangePriority: boolean;
  canEscalateTickets: boolean;
  canResolveTickets: boolean;
  canCloseTickets: boolean;
  canViewCustomerDetails: boolean;
  canViewTransactionRefs: boolean;
  canManageAgents: boolean;
  canManageTemplates: boolean;
  canManageKnowledgeBase: boolean;
  canManageSettings: boolean;
  canViewAnalytics: boolean;
  canViewAuditHistory: boolean;
}

export interface SupportAgentRecord {
  id: string;
  name: string;
  email: string;
  roleTitle: string;
  avatarInitials: string;
  queueStatus: "accepting_tickets" | "at_capacity" | "paused";
  specialties: SupportCategoryGroup[];
  isExistingStaffRecord: boolean;
}

export interface SupportMessageAttachment {
  id: string;
  name: string;
  sizeLabel: string;
  type: "image" | "pdf" | "screenshot";
}

export interface SupportConversationEntry {
  id: string;
  ticketId: string;
  senderType: "customer" | "agent" | "system";
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: string;
  isInternalNote: boolean; // Internal notes are NEVER shown to customers
  deliveryStatus?: "sent" | "delivered" | "read" | "demo_local";
  attachments?: SupportMessageAttachment[];
}

export interface SupportTimelineEvent {
  id: string;
  timestamp: string;
  eventType:
    | "ticket_created"
    | "ticket_assigned"
    | "priority_changed"
    | "category_changed"
    | "status_changed"
    | "agent_replied"
    | "customer_replied"
    | "internal_note_added"
    | "ticket_escalated"
    | "ticket_resolved"
    | "ticket_reopened"
    | "ticket_closed";
  title: string;
  description: string;
  actor: string;
}

export interface CustomerSatisfactionEntry {
  rating: 1 | 2 | 3 | 4 | 5;
  sentiment: "positive" | "neutral" | "negative";
  comment: string;
  submittedAt: string;
}

export interface SupportTicketRecord {
  id: string; // Supports legacy "tkt_501".."tkt_503" + "TKT-1004"+
  customerUserId: string;
  customerName: string;
  customerUsername: string;
  customerEmail: string;
  customerAvatar: string;
  customerCountry: string;
  subject: string;
  description: string;
  categoryGroup: SupportCategoryGroup;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  source: SupportSource;
  assignedAgentId: string | null;
  assignedAgentName: string;
  unreadBySupport: boolean;
  createdAt: string;
  firstResponseAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  lastActivityAt: string;
  relatedModuleRoute?: string; // e.g. "/wallet", "/subscriptions", "/referrals", "/moderation", "/live", "/chats"
  relatedReferenceId?: string;
  escalationInfo?: {
    escalatedTo: string;
    escalationTargetModule: string;
    reason: string;
    escalatedAt: string;
    escalatedBy: string;
    reviewStatus: "pending_review" | "in_review" | "resolved";
  };
  satisfaction?: CustomerSatisfactionEntry;
  messages: SupportConversationEntry[];
  timeline: SupportTimelineEvent[];
}

export interface SupportResponseTemplate {
  id: string;
  name: string;
  category: string;
  subjectSuggestion: string;
  content: string;
  status: "active" | "inactive";
  createdBy: string;
  updatedAt: string;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  status: "published" | "draft" | "archived";
  isAdminInternalOnly: true; // Not auto-published to mobile app
}

export interface SupportProgramSettings {
  ticketIdPrefix: string;
  defaultPriority: TicketPriority;
  defaultCategory: string;
  autoAssignMode: "manual_triage" | "round_robin_demo";
  allowReopenDays: number;
  lockClosedTicketsAfterDays: number;
  businessHoursLabel: string;
  workingDays: string[];
  slaFirstResponseMinutes: Record<TicketPriority, number>;
  slaResolutionMinutes: Record<TicketPriority, number>;
  enabledCategories: string[];
  notifyNewTicket: boolean;
  notifyCustomerReply: boolean;
  notifyAssignment: boolean;
  notifyEscalation: boolean;
  notifySlaBreach: boolean;
  notifyResolution: boolean;
  collectCsatFeedback: boolean;
  lastUpdatedAt: string;
  lastUpdatedBy: string;
}

export interface SupportAuditEvent {
  id: string;
  timestamp: string;
  ticketId?: string;
  customerName?: string;
  actorName: string;
  actorRole: string;
  actionType:
    | "ticket_created"
    | "ticket_assigned"
    | "ticket_reassigned"
    | "priority_changed"
    | "category_changed"
    | "status_changed"
    | "customer_reply_sent"
    | "internal_note_added"
    | "ticket_escalated"
    | "ticket_resolved"
    | "ticket_reopened"
    | "ticket_closed"
    | "settings_updated"
    | "template_updated"
    | "kb_updated"
    | "agent_updated";
  actionLabel: string;
  previousValue?: string;
  newValue?: string;
  reason?: string;
}

export interface SupportOverviewKpis {
  totalTickets: number;
  openTickets: number;
  newTicketsToday: number;
  unassignedTickets: number;
  assignedToMeCount: number;
  awaitingUserCount: number;
  awaitingSupportCount: number;
  escalatedCount: number;
  resolvedCount: number;
  overdueCount: number;
  avgFirstResponseMinutes: number | null;
  avgResolutionMinutes: number | null;
  csatScorePercent: number | null;
  csatResponsesCount: number;
  resolutionRatePercent: number;
}

export interface SupportFilterState {
  searchQuery: string;
  status: "all" | TicketStatus | "unread_only" | "open_bundle";
  priority: "all" | TicketPriority;
  categoryGroup: "all" | SupportCategoryGroup;
  assignedAgentId: "all" | string;
  source: "all" | SupportSource;
  overdueOnly: boolean;
  dateRange: SupportDateRange;
  customStartDate?: string;
  customEndDate?: string;
}

export type SupportSortField =
  | "last_activity"
  | "newest"
  | "oldest"
  | "priority_desc"
  | "sla_risk";

