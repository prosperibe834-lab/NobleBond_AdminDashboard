// NobleBond Admin — Complete Chat Management Types
// Strictly zero emojis, enterprise typing, privacy compliance

import type { ParticipantBrief, DateRangePreset } from "./likesMatches.types";

export type ConversationStatus = "active" | "archived" | "restricted" | "blocked_by_user";

export type ReportCategory =
  | "harassment"
  | "threats"
  | "scams"
  | "spam"
  | "sexual_harassment"
  | "hate_speech"
  | "impersonation"
  | "unwanted_messages"
  | "other";

export type ReportStatus = "pending" | "under_review" | "escalated" | "resolved" | "dismissed";

export type PriorityLevel = "low" | "medium" | "high" | "critical";

export type MessageType = "text" | "image" | "video" | "audio" | "file" | "link";

export type CallType = "voice" | "video";

export type CallStatus = "completed" | "missed" | "declined" | "cancelled" | "failed";

export type CallQuality = "excellent" | "good" | "fair" | "poor" | "degraded";

export type RestrictionType =
  | "user_block"
  | "temporary_restriction"
  | "permanent_restriction"
  | "expired_restriction";

export type RestrictionScope =
  | "direct_chat"
  | "media_sending"
  | "all_messaging"
  | "voice_video_calls";

export type DeliveryStatus = "sent" | "delivered" | "read" | "failed";

export interface MessageRecord {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  type: MessageType;
  content: string;
  mediaUrl?: string;
  mediaThumbnail?: string;
  mediaMeta?: {
    duration?: number;
    sizeBytes?: number;
    mimeType?: string;
    fileName?: string;
  };
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  deliveryStatus: DeliveryStatus;
  isFlagged: boolean;
  flagReason?: ReportCategory;
}

export interface ConversationRecord {
  id: string;
  matchId: string;
  participant1: ParticipantBrief;
  participant2: ParticipantBrief;
  status: ConversationStatus;
  startedAt: string;
  lastMessageAt: string;
  lastMessageSnippet: string;
  totalMessages: number;
  messagesSentByP1: number;
  messagesSentByP2: number;
  unreadCount: number;
  mediaAttachmentCount: number;
  deliveryHealth: "optimal" | "warning" | "degraded";
  hasActiveReports: boolean;
  activeReportCount: number;
  isRestricted: boolean;
  restrictionReason?: string;
  isUserBlocked: boolean;
  blockedByUserId?: string;
}

export interface ReportedConversation {
  id: string;
  conversationId: string;
  matchId: string;
  reporter: ParticipantBrief;
  reportedUser: ParticipantBrief;
  category: ReportCategory;
  priority: PriorityLevel;
  status: ReportStatus;
  details: string;
  reportedMessageCount: number;
  reportedMessageSnippets: string[];
  assignedModerator?: string;
  reportedAt: string;
  updatedAt: string;
  resolution?: {
    action: string;
    note: string;
    resolvedAt: string;
    resolvedBy: string;
  };
}

export interface ReportedMessage {
  id: string;
  messageId: string;
  conversationId: string;
  sender: ParticipantBrief;
  recipient: ParticipantBrief;
  messageType: MessageType;
  flaggedContent: string;
  mediaUrl?: string;
  mediaType?: "image" | "video" | "audio" | "link";
  category: ReportCategory;
  priority: PriorityLevel;
  status: ReportStatus;
  contextPreview?: {
    prevMessage?: string;
    nextMessage?: string;
  };
  reportedAt: string;
  assignedModerator?: string;
  resolution?: {
    action: string;
    note: string;
    resolvedAt: string;
    resolvedBy: string;
  };
}

export interface MediaAttachmentItem {
  id: string;
  messageId: string;
  conversationId: string;
  sender: ParticipantBrief;
  recipient: ParticipantBrief;
  type: "image" | "video" | "audio" | "link";
  url: string;
  thumbnailUrl?: string;
  fileName: string;
  fileSizeBytes: number;
  uploadedAt: string;
  moderationStatus: "clean" | "flagged" | "quarantined" | "approved";
  flagReason?: string;
  isSensitive: boolean;
}

export interface CallRecord {
  id: string;
  matchId: string;
  conversationId: string;
  caller: ParticipantBrief;
  recipient: ParticipantBrief;
  type: CallType;
  status: CallStatus;
  startedAt: string;
  endedAt?: string;
  durationSeconds: number;
  quality: CallQuality;
  packetLossPercent: number;
  avgLatencyMs: number;
  failureReason?: string;
  encryptionProtocol: string;
}

export interface MessagingRestrictionRecord {
  id: string;
  targetUser: ParticipantBrief;
  restrictionType: RestrictionType;
  imposedBy: "user" | "admin";
  initiatorName: string;
  counterpartUser?: ParticipantBrief;
  scope: RestrictionScope;
  reason: string;
  appliedAt: string;
  expiresAt?: string | null;
  status: "active" | "expired" | "revoked";
  revokedAt?: string;
  revokedBy?: string;
  revokeReason?: string;
}

export interface ChatStatsKpis {
  totalConversations: number;
  activeConversations: number;
  totalMessagesSent: number;
  unreadMessages: number;
  failedMessages: number;
  reportedConversations: number;
  reportedMessages: number;
  voiceCallsTotal: number;
  voiceCallsCompleted: number;
  videoCallsTotal: number;
  videoCallsCompleted: number;
  deliverySuccessRate: number;
  averageResponseTimeMinutes: number;
  activeRestrictionsCount: number;
}

export interface ChatFilterState {
  searchQuery: string;
  status: "all" | ConversationStatus;
  reportCategory: "all" | ReportCategory;
  reportStatus: "all" | ReportStatus;
  priority: "all" | PriorityLevel;
  callType: "all" | CallType;
  callStatus: "all" | CallStatus;
  restrictionType: "all" | RestrictionType;
  dateRange: DateRangePreset;
  assignedModerator: string;
  deliveryHealth: "all" | "optimal" | "warning" | "degraded";
  mediaType: "all" | "image" | "video" | "audio" | "link";
}

export type ChatSortField =
  | "startedAt"
  | "lastMessageAt"
  | "totalMessages"
  | "unreadCount"
  | "reportedAt"
  | "durationSeconds"
  | "appliedAt"
  | "priority";

export interface ChatSortCriteria {
  field: ChatSortField;
  direction: "asc" | "desc";
}

