// NobleBond Admin — Referral Management Type Definitions
// Enforces agreed NobleBond business rules: referrer-only rewards, email/phone OTP qualification,
// configurable Connection Points (initial 50 Pts), anti-fraud safeguards, and zero emojis.

export type ReferralTabKey =
  | "overview"
  | "all_referrals"
  | "successful_referrals"
  | "pending_referrals"
  | "rejected_referrals"
  | "referral_codes"
  | "referral_rewards"
  | "fraud_detection"
  | "settings"
  | "analytics"
  | "audit_history";

export type ReferralDateRange = "all" | "today" | "7d" | "30d" | "90d" | "custom";

// Primary business statuses per agreement
export type PrimaryReferralStatus = "pending" | "successful" | "rejected";

// Granular internal qualification states
export type ReferralQualificationStatus =
  | "qualified"
  | "awaiting_email_verification"
  | "awaiting_phone_verification"
  | "awaiting_either_verification"
  | "awaiting_validation"
  | "under_review"
  | "ineligible_self_referral"
  | "ineligible_duplicate"
  | "ineligible_invalid_attribution"
  | "ineligible_fraud";

// Referral reward processing states (Connection Points only)
export type ReferralRewardStatus =
  | "pending"
  | "eligible"
  | "issued"
  | "failed"
  | "rejected"
  | "reversed";

export type ReferralRejectionReason =
  | "Self-Referral"
  | "Duplicate Referral"
  | "Invalid Referral Attribution"
  | "Fraudulent Activity"
  | "Duplicate Reward Claim"
  | "Invalid Account"
  | "Qualification Not Satisfied"
  | "Other";

export type FraudReviewStatus =
  | "pending_review"
  | "under_investigation"
  | "cleared"
  | "rejected"
  | "escalated";

export type FraudRiskLevel = "low" | "medium" | "high" | "critical";

export type ReferralRoleKey =
  | "super_admin"
  | "growth_operations_lead"
  | "trust_fraud_analyst"
  | "compliance_auditor";

// 11 Explicit Referral Admin Permissions from Section 23
export interface ReferralRolePermissions {
  role: ReferralRoleKey;
  roleLabel: string;
  canViewReferrals: boolean;
  canViewReferralDetails: boolean;
  canViewReferralCodes: boolean;
  canViewRewardRecords: boolean;
  canChangeReferralSettings: boolean;
  canChangeRewardAmount: boolean;
  canReviewFraudAlerts: boolean;
  canAssignInvestigations: boolean;
  canApproveEligibleRewardIssuance: boolean;
  canRejectReferrals: boolean;
  canViewAuditHistory: boolean;
}

export interface ReferralParticipantInfo {
  userId: string;
  name: string;
  username: string;
  avatar: string;
  country: string;
  countryCode: string;
  accountStatus: string;
  registrationDate: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  verifiedAt?: string;
}

export interface ReferralTimelineEvent {
  id: string;
  timestamp: string;
  eventType:
    | "link_shared"
    | "link_used"
    | "account_registered"
    | "attribution_recorded"
    | "email_verified"
    | "phone_verified"
    | "fraud_check_completed"
    | "referral_qualified"
    | "reward_initiated"
    | "reward_issued"
    | "reward_failed"
    | "referral_rejected"
    | "referral_reconsidered"
    | "reward_reversed";
  title: string;
  description: string;
  actor: string;
}

export interface ReferralInvestigationNote {
  id: string;
  authorName: string;
  authorRole: string;
  timestamp: string;
  note: string;
}

export interface AdminReferralRecord {
  id: string; // e.g. "REF-9001"
  walletRewardId?: string; // Links directly to ConnectionPointsRewardRecord in Wallet Management (e.g. "RWD-3001")
  referralCode: string;
  referralLinkRef: string;
  referralSource: "Mobile Share Sheet" | "QR Code Scan" | "Direct Link Copy" | "WhatsApp Invite" | "SMS Invite";

  referrer: ReferralParticipantInfo;
  referredUser: ReferralParticipantInfo;

  createdAt: string;
  attributionDate: string;
  qualificationDate?: string;
  lastActivityAt: string;

  // Agreed business status + granular verification
  status: PrimaryReferralStatus;
  previousStatus?: PrimaryReferralStatus;
  qualificationStatus: ReferralQualificationStatus;
  satisfiedVerificationMethod?: "email" | "phone" | "both";
  missingRequirementSummary?: string;
  passedFraudChecks: boolean;

  // Reward strictly Connection Points for Referrer ONLY
  rewardType: "Connection Points";
  rewardAmount: number;
  newUserRewardAmount: 0; // Always 0 per NobleBond policy
  rewardStatus: ReferralRewardStatus;
  rewardTransactionId?: string;
  rewardIssuedAt?: string;
  rewardFailureReason?: string;

  // Rejection metadata
  rejectionReason?: ReferralRejectionReason;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionSummary?: string;

  timeline: ReferralTimelineEvent[];
  internalNotes: ReferralInvestigationNote[];
}

export interface ReferralCodeRecord {
  userId: string;
  ownerName: string;
  ownerUsername: string;
  ownerAvatar: string;
  ownerCountry: string;
  code: string;
  referralLink: string;
  createdAt: string;
  linkUsesTracked: number;
  attributedRegistrations: number;
  successfulReferrals: number;
  pendingReferrals: number;
  rejectedReferrals: number;
  pointsEarnedTotal: number;
  status: "active" | "paused" | "flagged_review";
  isDemoData: boolean;
}

export interface FraudAlertCaseRecord {
  id: string; // e.g. "FRD-401"
  referralId: string;
  referralCode: string;
  referrerId: string;
  referrerName: string;
  referrerUsername: string;
  referrerAvatar: string;
  referredUserId: string;
  referredUserName: string;
  referredUsername: string;
  signalType:
    | "self_referral_attempt"
    | "duplicate_referred_account"
    | "repeated_attribution"
    | "duplicate_reward_claim"
    | "referral_velocity_spike"
    | "verification_anomaly"
    | "shared_network_signal";
  riskIndicatorLabel: string;
  riskLevel: FraudRiskLevel;
  reasonFlagged: string;
  nonAccusatoryCaveat: string;
  detectedAt: string;
  reviewStatus: FraudReviewStatus;
  assignedAdmin?: string;
  notes: ReferralInvestigationNote[];
}

export interface ReferralProgramSettings {
  isEnabled: boolean;
  rewardAmountPoints: number;
  rewardType: "Connection Points";
  rewardRecipient: "Referrer Only";
  newUserRewardPoints: 0;
  qualificationRuleLabel: "Referred user verifies email OR phone OTP + backend validation";
  attributionMethod: "Unique referral code or deep-link query (?ref=CODE)";
  attributionWindowDays: number;
  linkExpiryDays: number | null; // null = non-expiring personal invite link
  repeatedLinkHandling: "First qualifying registration attribution wins; repeat clicks ignored";
  duplicateHandling: "Block self-referrals, duplicate users, and multiple claims per user";
  effectiveFromDate: string;
  lastUpdatedAt: string;
  lastUpdatedBy: string;
}

export interface ReferralAuditEvent {
  id: string; // e.g. "AUD-REF-701"
  timestamp: string;
  actorName: string;
  actorRole: string;
  actionType:
    | "programme_enabled"
    | "programme_disabled"
    | "reward_amount_changed"
    | "settings_updated"
    | "fraud_assigned"
    | "fraud_under_investigation"
    | "fraud_cleared"
    | "fraud_escalated"
    | "referral_validated"
    | "referral_rejected"
    | "referral_reconsidered"
    | "reward_issued"
    | "reward_failed"
    | "reward_reversed"
    | "note_added";
  actionLabel: string;
  referralId?: string;
  referrerName?: string;
  referredUserName?: string;
  previousState?: string;
  newState?: string;
  rewardAmountPoints?: number;
  reason: string;
}

export interface ReferralOverviewKpis {
  totalReferrals: number;
  pendingReferrals: number;
  successfulReferrals: number;
  rejectedReferrals: number;
  totalReferrers: number;
  totalReferredUsers: number;
  eligibleRewardsCount: number;
  totalPointsIssued: number;
  pendingRewardIssuanceCount: number;
  conversionRatePercent: number;
  failedRewardIssuanceCount: number;
  reversedRewardsCount: number;
  openFraudAlertsCount: number;
}

export interface ReferralFilterState {
  searchQuery: string;
  status: "all" | PrimaryReferralStatus;
  qualificationStatus: "all" | ReferralQualificationStatus;
  rewardStatus: "all" | ReferralRewardStatus;
  verificationMethod: "all" | "email" | "phone" | "both" | "unverified";
  fraudReviewFilter: "all" | "flagged_only" | "clean_only";
  referrerId: string;
  dateRange: ReferralDateRange;
  customStartDate?: string;
  customEndDate?: string;
}

export type ReferralSortField =
  | "newest"
  | "oldest"
  | "highest_referrer_count"
  | "highest_referrer_points"
  | "pending_first"
  | "recent_reward";

