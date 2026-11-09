// NobleBond Admin — Likes & Matches Management Types
// Strict typing, zero emojis, directional interaction tracking, confirmed mutual matches

export type LikeType = "regular" | "super_like";

export type InteractionStatus = "pending" | "liked_back" | "passed" | "expired";

export type MatchStatus = "active" | "unmatched" | "under_review" | "restricted" | "archived";

export type DateRangePreset = "today" | "last_7_days" | "last_30_days" | "last_90_days" | "custom";

export interface ParticipantBrief {
  id: string; // e.g. "usr_nb_90421"
  profileId: string; // e.g. "prf_nb_90421"
  name: string;
  username: string;
  avatar: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: "female" | "male" | "other" | "prefer_not_to_say";
  country: string;
  countryCode: string;
  city: string;
  isVerified: boolean;
  premiumTier: "free" | "weekly" | "monthly" | "yearly";
}

export interface LikeRecord {
  id: string; // e.g. "lk_9011"
  sender: ParticipantBrief;
  recipient: ParticipantBrief;
  type: LikeType;
  status: InteractionStatus;
  timestamp: string; // ISO 8601
  resultedInMatch: boolean;
  matchId?: string;
  isReported: boolean;
  reportId?: string;
  flagReason?: string;
  pointsCost?: number; // e.g. 50 Connection Points for Super Like
}

export interface OriginatingLikeInfo {
  likeId: string;
  timestamp: string;
  type: LikeType;
}

export interface ConversationMetadata {
  exists: boolean;
  messageCount: number;
  lastActivityTimestamp?: string;
  conversationStartedAt?: string;
}

export interface UnmatchMetadata {
  unmatcherUserId: string; // ID of the person who initiated unmatch
  unmatcherName: string;
  unmatchDate: string;
  reason?: string;
  byAdmin: boolean;
  adminReason?: string;
}

export interface MatchAuditEntry {
  id: string;
  timestamp: string;
  adminName: string;
  action: string;
  details: string;
}

export interface MatchRecord {
  id: string; // e.g. "mtch_8041"
  user1: ParticipantBrief;
  user2: ParticipantBrief;
  matchDate: string; // ISO 8601
  status: MatchStatus;
  durationDays: number;
  originatingLikes: {
    user1ToUser2: OriginatingLikeInfo;
    user2ToUser1: OriginatingLikeInfo;
  };
  conversation: ConversationMetadata;
  unmatchInfo?: UnmatchMetadata;
  isReported: boolean;
  reportId?: string;
  reportCategory?: string;
  historyLog: MatchAuditEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface ReportedInteraction {
  id: string; // e.g. "rep_int_301"
  reporter: ParticipantBrief;
  reportedUser: ParticipantBrief;
  relatedType: "like" | "match";
  relatedId: string; // Like ID or Match ID
  category: "harassment" | "fake_profile" | "inappropriate_behavior" | "spam" | "unwanted_contact" | "other";
  priority: "low" | "medium" | "high" | "critical";
  status: "new" | "investigating" | "resolved" | "escalated" | "dismissed";
  dateSubmitted: string;
  reason: string;
  adminNotes?: string;
  resolution?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface SuspiciousActivityFlag {
  id: string;
  user: ParticipantBrief;
  patternType: "rapid_swiping" | "excessive_likes_burst" | "high_unmatch_velocity" | "bot_pattern" | "repeated_reports";
  description: string;
  severity: "low" | "medium" | "high";
  metricCount: number;
  detectedAt: string;
  status: "open" | "reviewed" | "dismissed";
}

export interface LikesMatchesStatsKpis {
  totalLikesSent: number;
  likesSentThisPeriod: number;
  likesSentDeltaPercent: number;

  totalLikesReceived: number;
  likesReceivedThisPeriod: number;
  likesReceivedDeltaPercent: number;

  totalConfirmedMatches: number;
  newMatchesThisPeriod: number;
  newMatchesDeltaPercent: number;

  pendingIncomingLikes: number;

  totalSuperLikes: number;
  superLikesThisPeriod: number;

  totalUnmatches: number;
  unmatchesThisPeriod: number;

  activeMatches: number;

  reportedInteractionsCount: number;
}

export interface LikesMatchesFilterState {
  searchQuery: string;
  interactionType: "all" | LikeType;
  interactionDirection: "all" | "incoming" | "outgoing";
  matchStatus: "all" | MatchStatus;
  gender: "all" | "female" | "male" | "other";
  ageMin: number | null;
  ageMax: number | null;
  country: string;
  city: string;
  verificationStatus: "all" | "verified" | "unverified";
  premiumStatus: "all" | "premium" | "free";
  dateRange: DateRangePreset;
  customStartDate?: string;
  customEndDate?: string;
  hasReports: "all" | "reported_only" | "clean_only";
}

export type LikesMatchesSortField =
  | "timestamp"
  | "matchDate"
  | "durationDays"
  | "senderName"
  | "recipientName"
  | "messageCount"
  | "reportsCount";

export type SortOrder = "asc" | "desc";

export interface LikesMatchesSortCriteria {
  field: LikesMatchesSortField;
  order: SortOrder;
}

export interface ColumnVisibilityLikesState {
  sender: boolean;
  recipient: boolean;
  likeType: boolean;
  status: boolean;
  timestamp: boolean;
  resultedInMatch: boolean;
  actions: boolean;
}

export interface ColumnVisibilityMatchesState {
  pair: boolean;
  matchId: boolean;
  matchDate: boolean;
  duration: boolean;
  conversation: boolean;
  status: boolean;
  reports: boolean;
  actions: boolean;
}

