// NobleBond Admin — Complete Live Management Types
// Strictly zero emojis, enterprise typing, role-based live telemetry

import type { ParticipantBrief, DateRangePreset } from "./likesMatches.types";

export type LiveSessionStatus = "live" | "completed" | "interrupted" | "failed" | "under_moderation";

export type LiveCategory =
  | "music_arts"
  | "dating_qna"
  | "lifestyle_casual"
  | "speed_dating"
  | "talent_show"
  | "cooking_food"
  | "general_chat";

export type StreamProvider = "Agora RTC" | "Amazon IVS" | "LiveKit";

export type StreamHealthLevel = "healthy" | "warning" | "degraded" | "disconnected" | "failed";

export type HostStatus = "active" | "warning" | "restricted" | "suspended";

export type GuestConnectionStatus =
  | "connected"
  | "connecting"
  | "invited"
  | "requested"
  | "disconnected"
  | "removed";

export type LiveReportTarget = "session" | "host" | "viewer" | "comment" | "guest" | "gift_abuse";

export type LiveReportCategory =
  | "harassment"
  | "bullying"
  | "threats"
  | "hate_speech"
  | "sexual_harassment"
  | "nudity"
  | "scams"
  | "spam"
  | "impersonation"
  | "dangerous_behaviour"
  | "inappropriate_comment"
  | "other";

export type LiveReportPriority = "low" | "medium" | "high" | "critical";

export type LiveReportStatus = "pending" | "under_review" | "escalated" | "resolved" | "dismissed";

export type GiftCategory = "romantic" | "luxury" | "celebration" | "support";

export interface LiveGuestRecord {
  id: string;
  sessionId: string;
  sessionTitle: string;
  host: ParticipantBrief;
  user: ParticipantBrief;
  joinedAt: string;
  leftAt?: string;
  durationMinutes: number;
  connectionStatus: GuestConnectionStatus;
  cameraStatus: "on" | "off";
  micStatus: "on" | "muted";
  moderationStatus: "clean" | "flagged" | "removed";
  removalReason?: string;
}

export interface LiveSessionRecord {
  id: string;
  title: string;
  description: string;
  category: LiveCategory;
  host: ParticipantBrief;
  status: LiveSessionStatus;
  startedAt: string;
  endedAt?: string;
  durationMinutes: number;
  currentViewers: number;
  peakViewers: number;
  totalUniqueViews: number;
  guestCount: number;
  currentGuests: LiveGuestRecord[];
  giftsReceivedCount: number;
  giftCoinsEarned: number;
  streamQuality: "1080p_60fps" | "720p_30fps" | "480p_adaptive";
  streamHealth: StreamHealthLevel;
  streamProvider: StreamProvider;
  bitrateKbps: number;
  fps: number;
  latencyMs: number;
  packetLossPercent: number;
  moderationStatus: "clean" | "flagged" | "action_taken";
  activeReportCount: number;
  thumbnailUrl: string;
  isRestricted: boolean;
  restrictionReason?: string;
}

export interface LiveHostRecord {
  id: string;
  user: ParticipantBrief;
  totalSessions: number;
  activeSessionId?: string;
  isCurrentlyLive: boolean;
  totalDurationMinutes: number;
  peakViewers: number;
  totalViews: number;
  giftsReceivedCount: number;
  giftCoinsEarned: number;
  reportsReceivedCount: number;
  hostStatus: HostStatus;
  registeredAt: string;
  lastLiveAt: string;
  restrictionReason?: string;
  restrictionExpiresAt?: string;
}

export interface LiveViewerRecord {
  id: string;
  user: ParticipantBrief;
  sessionId: string;
  sessionTitle: string;
  hostName: string;
  joinedAt: string;
  leftAt?: string;
  watchDurationMinutes: number;
  isCurrentlyWatching: boolean;
  giftCoinsSpent: number;
  giftsSentCount: number;
  commentsCount: number;
  viewerStatus: "active" | "idle" | "restricted";
}

export interface LiveGiftTransactionRecord {
  id: string;
  sessionId: string;
  sessionTitle: string;
  sender: ParticipantBrief;
  recipient: ParticipantBrief;
  giftId: string;
  giftName: string;
  giftType: GiftCategory;
  coinAmount: number;
  timestamp: string;
  status: "completed" | "refunded" | "failed" | "disputed";
  walletReference: string;
}

export interface LiveCommentRecord {
  id: string;
  sessionId: string;
  sessionTitle: string;
  sender: ParticipantBrief;
  hostName: string;
  commentText: string;
  commentType: "standard" | "super_highlight" | "question" | "gift_announcement";
  timestamp: string;
  moderationStatus: "clean" | "reported" | "hidden" | "removed";
  isReported: boolean;
  reportCategory?: string;
}

export interface LiveReportRecord {
  id: string;
  sessionId: string;
  sessionTitle: string;
  reporter: ParticipantBrief;
  reportedUser: ParticipantBrief;
  targetType: LiveReportTarget;
  category: LiveReportCategory;
  description: string;
  submittedAt: string;
  priority: LiveReportPriority;
  assignedModerator?: string;
  status: LiveReportStatus;
  evidenceSnippet?: string;
  resolutionNote?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface StreamHealthRecord {
  sessionId: string;
  sessionTitle: string;
  hostName: string;
  status: StreamHealthLevel;
  provider: StreamProvider;
  bitrateKbps: number;
  fps: number;
  latencyMs: number;
  packetLossPercent: number;
  errorCode?: string;
  failureReason?: string;
  failedAt?: string;
  recoveryStatus?: "recovered" | "unrecoverable" | "retrying";
}

export interface LiveStatsKpis {
  totalLiveSessions: number;
  currentlyLiveRooms: number;
  totalLiveHosts: number;
  activeConcurrentViewers: number;
  totalLiveViews: number;
  totalStreamDurationHours: number;
  totalGiftsSent: number;
  totalGiftCoinsSpent: number;
  pendingLiveReports: number;
  failedOrInterruptedStreams: number;
  connectionReliabilityRate: number;
}

export interface LiveFilterState {
  searchQuery: string;
  sessionStatus: "all" | LiveSessionStatus;
  category: "all" | LiveCategory;
  hostStatus: "all" | HostStatus;
  reportStatus: "all" | LiveReportStatus;
  reportPriority: "all" | LiveReportPriority;
  giftType: "all" | GiftCategory;
  healthStatus: "all" | StreamHealthLevel;
  dateRange: "all" | DateRangePreset;
  streamProvider: "all" | StreamProvider;
}

export type LiveSortField =
  | "startedAt"
  | "durationMinutes"
  | "currentViewers"
  | "peakViewers"
  | "giftCoinsEarned"
  | "submittedAt"
  | "timestamp";

export interface LiveSortCriteria {
  field: LiveSortField;
  direction: "asc" | "desc";
}
