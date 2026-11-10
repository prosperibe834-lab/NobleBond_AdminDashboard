// NobleBond Admin — Complete Reports & Moderation Types
// Enterprise trust & safety telemetry, strictly zero emojis

import type { ParticipantBrief, DateRangePreset } from "./likesMatches.types";

export type ReportDomain = "user" | "profile" | "chat" | "live" | "content";

export type ReportCategory =
  // User / Account
  | "fake_account"
  | "impersonation"
  | "fraudulent_activity"
  | "scam"
  | "spam"
  | "harassment"
  | "threats"
  | "bullying"
  | "hate_speech"
  | "inappropriate_behaviour"
  | "other_user"
  // Profile / Photo
  | "fake_profile"
  | "profile_impersonation"
  | "inappropriate_photo"
  | "nudity_sexual_content"
  | "misleading_info"
  | "offensive_bio"
  | "suspicious_profile"
  | "other_profile"
  // Chat / Message
  | "chat_harassment"
  | "threatening_messages"
  | "unwanted_messages"
  | "scams_financial_requests"
  | "chat_spam"
  | "sexual_harassment"
  | "chat_hate_speech"
  | "suspicious_links"
  | "other_chat"
  // Live / Streaming
  | "inappropriate_live_content"
  | "live_harassment"
  | "live_bullying"
  | "live_hate_speech"
  | "live_sexual_harassment"
  | "live_scams"
  | "inappropriate_comments"
  | "live_impersonation"
  | "dangerous_behaviour"
  | "other_live";

export type ReportContentType =
  | "user_account"
  | "profile_photo"
  | "additional_photo"
  | "biography"
  | "profile_prompt"
  | "private_message"
  | "chat_conversation"
  | "live_stream"
  | "live_comment"
  | "stage_guest";

export type ReportPriority = "low" | "medium" | "high" | "critical";

export type ReportStatus = "pending" | "under_review" | "escalated" | "resolved" | "dismissed";

export type ModerationActionType =
  // Warnings
  | "formal_warning"
  | "final_warning"
  // Content Actions
  | "content_removed"
  | "content_hidden"
  | "content_rejected"
  // Communication Restrictions
  | "messaging_restricted"
  | "temporary_messaging_restriction"
  // Live Restrictions
  | "live_restricted"
  | "temporary_live_restriction"
  // Account Restrictions
  | "temporarily_suspended"
  | "permanently_banned"
  // Other
  | "review_required"
  | "escalated_investigation";

export type AppealStatus = "pending" | "under_review" | "approved" | "rejected" | "escalated";

export type ContentReviewStatus = "pending_review" | "under_review" | "approved" | "rejected" | "escalated";

export interface InvestigationTimelineEvent {
  id: string;
  timestamp: string;
  eventType: string;
  description: string;
  actorName: string;
  actorRole: string;
}

export interface InvestigationNote {
  id: string;
  authorName: string;
  authorRole: string;
  timestamp: string;
  text: string;
  isInternal: boolean;
}

export interface ReportEvidence {
  id: string;
  type: "image" | "screenshot" | "text_snippet" | "live_reference" | "profile_field";
  label: string;
  url?: string;
  snippet?: string;
  submittedAt: string;
}

export interface UnifiedReportRecord {
  id: string; // e.g. "REP-801"
  domain: ReportDomain;
  category: ReportCategory;
  contentType: ReportContentType;
  reporter: ParticipantBrief;
  reportedUser: ParticipantBrief;
  description: string;
  submittedAt: string;
  priority: ReportPriority;
  status: ReportStatus;
  assignedModerator?: string;
  lastUpdatedAt: string;
  relatedEntityId?: string; // e.g. "live_401", "msg_702", "prf_nb_90421", "cnv_301"
  relatedEntityTitle?: string;
  evidence: ReportEvidence[];
  notes: InvestigationNote[];
  timeline: InvestigationTimelineEvent[];
  resolutionNote?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  dismissalReason?: string;
}

export interface ContentModerationItem {
  id: string; // e.g. "CNT-501"
  contentType: ReportContentType;
  owner: ParticipantBrief;
  relatedReportId?: string;
  contentPreviewUrl?: string;
  contentPreviewText?: string;
  submittedAt: string;
  reviewStatus: ContentReviewStatus;
  assignedModerator?: string;
  automatedSignal?: {
    confidence: number;
    suggestedLabel: string;
    severity: "low" | "medium" | "high";
  };
  reviewNotes?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface ModerationActionRecord {
  id: string; // e.g. "ACT-401"
  targetUser: ParticipantBrief;
  relatedReportId?: string;
  actionType: ModerationActionType;
  reason: string;
  issuedBy: string;
  issuedAt: string;
  durationDays?: number | null; // null indicates permanent
  expiresAt?: string;
  status: "active" | "expired" | "appealed" | "revoked";
  notes?: string;
}

export interface AppealRecord {
  id: string; // e.g. "APL-201"
  user: ParticipantBrief;
  originalActionId: string;
  originalActionType: ModerationActionType;
  relatedReportId?: string;
  appealReason: string;
  submittedAt: string;
  assignedReviewer?: string;
  status: AppealStatus;
  reviewerNotes?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  proposedConsequence?: string;
}

export interface ModerationHistoryEvent {
  id: string; // e.g. "HST-901"
  reportId?: string;
  actionId?: string;
  targetUser: ParticipantBrief;
  actionType: string;
  reason: string;
  moderator: string;
  timestamp: string;
  previousStatus?: string;
  newStatus: string;
  details?: string;
}

export interface ModeratorWorkload {
  name: string;
  avatar: string;
  role: string;
  assignedCount: number;
  pendingCount: number;
  underReviewCount: number;
  resolvedCount: number;
  highPriorityCount: number;
  avgResolutionTimeHours: number;
}

export interface ModerationStatsKpis {
  totalReports: number;
  pendingReports: number;
  underReviewReports: number;
  highPriorityReports: number;
  criticalReports: number;
  escalatedReports: number;
  resolvedReports: number;
  dismissedReports: number;
  activeRestrictions: number;
  pendingAppeals: number;
  avgResolutionTimeHours: number;
  escalationRatePercent: number;
}

export interface ModerationFilterState {
  searchQuery: string;
  domain: "all" | ReportDomain;
  category: "all" | string;
  priority: "all" | ReportPriority;
  status: "all" | ReportStatus;
  assignedModerator: "all" | string;
  contentType: "all" | ReportContentType;
  dateRange: "all" | DateRangePreset;
}

export type ModerationSortField =
  | "submittedAt"
  | "priority"
  | "lastUpdatedAt"
  | "oldestUnresolved";

export interface ModerationSortCriteria {
  field: ModerationSortField;
  direction: "asc" | "desc";
}
