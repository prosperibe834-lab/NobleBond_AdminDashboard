// NobleBond Admin — Referral Management Data Service
// Synchronizes persistently with User Management and Wallet & Financial Management.
// Enforces referrer-only rewards, OTP verification qualification, anti-fraud controls, and append-only audit history. Zero emojis.

import type {
  AdminReferralRecord,
  FraudAlertCaseRecord,
  FraudReviewStatus,
  ReferralAuditEvent,
  ReferralCodeRecord,
  ReferralDateRange,
  ReferralFilterState,
  ReferralOverviewKpis,
  ReferralProgramSettings,
  ReferralRejectionReason,
  ReferralRoleKey,
  ReferralRolePermissions,
  ReferralSortField,
} from "../types/referralManagement.types";
import {
  grantConnectionPoints,
  loadUsersFromStorage,
} from "./userManagementDataService";
import {
  loadConnectionPointsRewards,
  loadReferralRewardAmount,
  processReferralRewardAction,
  updateConfigurableReferralPoints,
} from "./walletManagementDataService";

const STORAGE_KEYS = {
  REFERRALS: "noblebond_admin_referrals_v2",
  FRAUD_CASES: "noblebond_admin_referral_fraud_v2",
  SETTINGS: "noblebond_admin_referral_settings_v2",
  AUDIT: "noblebond_admin_referral_audit_v2",
  CODE_PAUSED: "noblebond_admin_referral_code_statuses_v2",
};

export const REFERRAL_LINK_BASE = "https://noblebond.app/join";

export function buildReferralLink(code: string): string {
  return `${REFERRAL_LINK_BASE}?ref=${encodeURIComponent(code)}`;
}

// 11 Explicit Admin Permissions Matrix (Section 23)
export const REFERRAL_ROLE_PERMISSIONS: Record<ReferralRoleKey, ReferralRolePermissions> = {
  super_admin: {
    role: "super_admin",
    roleLabel: "Super Administrator",
    canViewReferrals: true,
    canViewReferralDetails: true,
    canViewReferralCodes: true,
    canViewRewardRecords: true,
    canChangeReferralSettings: true,
    canChangeRewardAmount: true,
    canReviewFraudAlerts: true,
    canAssignInvestigations: true,
    canApproveEligibleRewardIssuance: true,
    canRejectReferrals: true,
    canViewAuditHistory: true,
  },
  growth_operations_lead: {
    role: "growth_operations_lead",
    roleLabel: "Growth Operations Lead",
    canViewReferrals: true,
    canViewReferralDetails: true,
    canViewReferralCodes: true,
    canViewRewardRecords: true,
    canChangeReferralSettings: false,
    canChangeRewardAmount: false,
    canReviewFraudAlerts: true,
    canAssignInvestigations: true,
    canApproveEligibleRewardIssuance: true,
    canRejectReferrals: true,
    canViewAuditHistory: true,
  },
  trust_fraud_analyst: {
    role: "trust_fraud_analyst",
    roleLabel: "Trust & Fraud Analyst",
    canViewReferrals: true,
    canViewReferralDetails: true,
    canViewReferralCodes: true,
    canViewRewardRecords: true,
    canChangeReferralSettings: false,
    canChangeRewardAmount: false,
    canReviewFraudAlerts: true,
    canAssignInvestigations: true,
    canApproveEligibleRewardIssuance: false,
    canRejectReferrals: true,
    canViewAuditHistory: true,
  },
  compliance_auditor: {
    role: "compliance_auditor",
    roleLabel: "Compliance & Audit Viewer (Read-Only)",
    canViewReferrals: true,
    canViewReferralDetails: true,
    canViewReferralCodes: true,
    canViewRewardRecords: true,
    canChangeReferralSettings: false,
    canChangeRewardAmount: false,
    canReviewFraudAlerts: false,
    canAssignInvestigations: false,
    canApproveEligibleRewardIssuance: false,
    canRejectReferrals: false,
    canViewAuditHistory: true,
  },
};

const INITIAL_SETTINGS: ReferralProgramSettings = {
  isEnabled: true,
  rewardAmountPoints: 50,
  rewardType: "Connection Points",
  rewardRecipient: "Referrer Only",
  newUserRewardPoints: 0,
  qualificationRuleLabel: "Referred user verifies email OR phone OTP + backend validation",
  attributionMethod: "Unique referral code or deep-link query (?ref=CODE)",
  attributionWindowDays: 14,
  linkExpiryDays: null,
  repeatedLinkHandling: "First qualifying registration attribution wins; repeat clicks ignored",
  duplicateHandling: "Block self-referrals, duplicate users, and multiple claims per user",
  effectiveFromDate: "2026-01-15",
  lastUpdatedAt: "2026-10-01T09:00:00Z",
  lastUpdatedBy: "Elena Vance (Super Administrator)",
};

const INITIAL_REFERRALS: AdminReferralRecord[] = [
  {
    id: "REF-9001",
    walletRewardId: "RWD-3001",
    referralCode: "AMARA26",
    referralLinkRef: `${REFERRAL_LINK_BASE}?ref=AMARA26`,
    referralSource: "Mobile Share Sheet",
    referrer: {
      userId: "usr_nb_90421",
      name: "Amara Bliss",
      username: "@amara_bliss",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      country: "Nigeria",
      countryCode: "NG",
      accountStatus: "online",
      registrationDate: "2025-08-12T10:30:00Z",
      emailVerified: true,
      phoneVerified: true,
    },
    referredUser: {
      userId: "usr_nb_90423",
      name: "Zara Love",
      username: "@zara_love",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
      country: "United States",
      countryCode: "US",
      accountStatus: "active",
      registrationDate: "2026-02-10T08:00:00Z",
      emailVerified: true,
      phoneVerified: true,
      verifiedAt: "2026-02-10T08:05:00Z",
    },
    createdAt: "2026-02-10T08:00:00Z",
    attributionDate: "2026-02-10T08:00:00Z",
    qualificationDate: "2026-02-10T08:05:00Z",
    lastActivityAt: "2026-02-10T08:06:00Z",
    status: "successful",
    qualificationStatus: "qualified",
    satisfiedVerificationMethod: "email",
    passedFraudChecks: true,
    rewardType: "Connection Points",
    rewardAmount: 50,
    newUserRewardAmount: 0,
    rewardStatus: "issued",
    rewardTransactionId: "NB-REF-3001",
    rewardIssuedAt: "2026-02-10T08:06:00Z",
    timeline: [
      { id: "tl_9001_1", timestamp: "2026-02-10T07:54:00Z", eventType: "link_used", title: "Referral Link Opened", description: "Invite link ?ref=AMARA26 used before signup.", actor: "Attribution Engine" },
      { id: "tl_9001_2", timestamp: "2026-02-10T08:00:00Z", eventType: "account_registered", title: "Account Registered & Attributed", description: "Zara Love registered using code AMARA26.", actor: "Auth Service" },
      { id: "tl_9001_3", timestamp: "2026-02-10T08:05:00Z", eventType: "email_verified", title: "Email OTP Verified", description: "Referred user completed email verification requirement.", actor: "OTP Verification Service" },
      { id: "tl_9001_4", timestamp: "2026-02-10T08:05:20Z", eventType: "referral_qualified", title: "Referral Qualified", description: "Fraud and uniqueness checks passed cleanly.", actor: "Validation Engine" },
      { id: "tl_9001_5", timestamp: "2026-02-10T08:06:00Z", eventType: "reward_issued", title: "+50 Connection Points Issued", description: "Credited to referrer Amara Bliss only. New user bonus: 0 Pts.", actor: "Connection Points Ledger" },
    ],
    internalNotes: [
      { id: "note_9001_1", authorName: "Elena Vance", authorRole: "Super Administrator", timestamp: "2026-02-10T09:10:00Z", note: "Clean organic invite across regions; reward settled accurately." },
    ],
  },
  {
    id: "REF-9002",
    walletRewardId: "RWD-3002",
    referralCode: "AMARA26",
    referralLinkRef: `${REFERRAL_LINK_BASE}?ref=AMARA26`,
    referralSource: "WhatsApp Invite",
    referrer: {
      userId: "usr_nb_90421",
      name: "Amara Bliss",
      username: "@amara_bliss",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      country: "Nigeria",
      countryCode: "NG",
      accountStatus: "online",
      registrationDate: "2025-08-12T10:30:00Z",
      emailVerified: true,
      phoneVerified: true,
    },
    referredUser: {
      userId: "usr_nb_90424",
      name: "Jayden Cole",
      username: "@jayden_cole",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      country: "United Kingdom",
      countryCode: "GB",
      accountStatus: "active",
      registrationDate: "2026-11-04T11:00:00Z",
      emailVerified: false,
      phoneVerified: true,
      verifiedAt: "2026-11-04T11:04:00Z",
    },
    createdAt: "2026-11-04T11:00:00Z",
    attributionDate: "2026-11-04T11:00:00Z",
    qualificationDate: "2026-11-04T11:04:00Z",
    lastActivityAt: "2026-11-04T11:05:00Z",
    status: "successful",
    qualificationStatus: "qualified",
    satisfiedVerificationMethod: "phone",
    passedFraudChecks: true,
    rewardType: "Connection Points",
    rewardAmount: 50,
    newUserRewardAmount: 0,
    rewardStatus: "issued",
    rewardTransactionId: "NB-REF-3002",
    rewardIssuedAt: "2026-11-04T11:05:00Z",
    timeline: [
      { id: "tl_9002_1", timestamp: "2026-11-04T11:00:00Z", eventType: "attribution_recorded", title: "Referral Attributed", description: "Jayden Cole registered using AMARA26.", actor: "Auth Service" },
      { id: "tl_9002_2", timestamp: "2026-11-04T11:04:00Z", eventType: "phone_verified", title: "Phone OTP Verified", description: "Referred user completed SMS OTP verification.", actor: "OTP Verification Service" },
      { id: "tl_9002_3", timestamp: "2026-11-04T11:04:15Z", eventType: "referral_qualified", title: "Referral Qualified", description: "Phone verification satisfies agreed NobleBond qualification.", actor: "Validation Engine" },
      { id: "tl_9002_4", timestamp: "2026-11-04T11:05:00Z", eventType: "reward_issued", title: "+50 Connection Points Issued", description: "Issued to Amara Bliss wallet ledger.", actor: "Connection Points Ledger" },
    ],
    internalNotes: [],
  },
  {
    id: "REF-9003",
    walletRewardId: "RWD-3003",
    referralCode: "DAVIDK22",
    referralLinkRef: `${REFERRAL_LINK_BASE}?ref=DAVIDK22`,
    referralSource: "QR Code Scan",
    referrer: {
      userId: "usr_nb_90422",
      name: "David King",
      username: "@david_king",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      country: "Nigeria",
      countryCode: "NG",
      accountStatus: "active",
      registrationDate: "2025-09-04T14:15:00Z",
      emailVerified: true,
      phoneVerified: true,
    },
    referredUser: {
      userId: "usr_nb_90429",
      name: "Kofi Mensah",
      username: "@kofi_mensah",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
      country: "Ghana",
      countryCode: "GH",
      accountStatus: "active",
      registrationDate: "2026-11-09T14:20:00Z",
      emailVerified: true,
      phoneVerified: false,
      verifiedAt: "2026-11-09T14:25:00Z",
    },
    createdAt: "2026-11-09T14:20:00Z",
    attributionDate: "2026-11-09T14:20:00Z",
    qualificationDate: "2026-11-09T14:25:00Z",
    lastActivityAt: "2026-11-09T14:25:00Z",
    status: "successful",
    qualificationStatus: "qualified",
    satisfiedVerificationMethod: "email",
    passedFraudChecks: true,
    rewardType: "Connection Points",
    rewardAmount: 50,
    newUserRewardAmount: 0,
    rewardStatus: "eligible",
    timeline: [
      { id: "tl_9003_1", timestamp: "2026-11-09T14:18:00Z", eventType: "link_used", title: "QR Invite Scanned", description: "Referred user scanned David King QR invite.", actor: "QR Attribution" },
      { id: "tl_9003_2", timestamp: "2026-11-09T14:20:00Z", eventType: "account_registered", title: "Account Registered", description: "Kofi Mensah joined NobleBond.", actor: "Auth Service" },
      { id: "tl_9003_3", timestamp: "2026-11-09T14:25:00Z", eventType: "email_verified", title: "Email OTP Verified", description: "Email OTP verified successfully.", actor: "OTP Service" },
      { id: "tl_9003_4", timestamp: "2026-11-09T14:25:30Z", eventType: "referral_qualified", title: "Referral Qualified — Reward Eligible", description: "Awaiting reward issuance approval into David King wallet.", actor: "Validation Engine" },
    ],
    internalNotes: [
      { id: "note_9003_1", authorName: "System Validator", authorRole: "Automation", timestamp: "2026-11-09T14:26:00Z", note: "Eligible for 50 Connection Points issuance; ready for release." },
    ],
  },
  {
    id: "REF-9004",
    walletRewardId: "RWD-3004",
    referralCode: "TOBIFIT",
    referralLinkRef: `${REFERRAL_LINK_BASE}?ref=TOBIFIT`,
    referralSource: "Direct Link Copy",
    referrer: {
      userId: "usr_nb_90426",
      name: "Tobi Bakare",
      username: "@tobi_bakare",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
      country: "Nigeria",
      countryCode: "NG",
      accountStatus: "active",
      registrationDate: "2025-11-20T12:00:00Z",
      emailVerified: true,
      phoneVerified: true,
    },
    referredUser: {
      userId: "usr_nb_90432",
      name: "Victor Okafor",
      username: "@victor_okafor",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
      country: "Nigeria",
      countryCode: "NG",
      accountStatus: "pending_verification",
      registrationDate: "2026-11-09T08:15:00Z",
      emailVerified: false,
      phoneVerified: false,
    },
    createdAt: "2026-11-09T08:15:00Z",
    attributionDate: "2026-11-09T08:15:00Z",
    lastActivityAt: "2026-11-09T08:16:00Z",
    status: "pending",
    qualificationStatus: "awaiting_either_verification",
    missingRequirementSummary: "Referred user has not completed email OR phone OTP verification yet.",
    passedFraudChecks: true,
    rewardType: "Connection Points",
    rewardAmount: 50,
    newUserRewardAmount: 0,
    rewardStatus: "pending",
    timeline: [
      { id: "tl_9004_1", timestamp: "2026-11-09T08:14:00Z", eventType: "link_used", title: "Referral Link Clicked", description: "Invite URL ?ref=TOBIFIT visited.", actor: "Attribution Engine" },
      { id: "tl_9004_2", timestamp: "2026-11-09T08:15:00Z", eventType: "account_registered", title: "Account Registered", description: "Victor Okafor completed initial registration; OTP verification pending.", actor: "Auth Service" },
    ],
    internalNotes: [],
  },
  {
    id: "REF-9005",
    walletRewardId: "RWD-3005",
    referralCode: "BRIANINVEST",
    referralLinkRef: `${REFERRAL_LINK_BASE}?ref=BRIANINVEST`,
    referralSource: "Direct Link Copy",
    referrer: {
      userId: "usr_nb_90433",
      name: "Brian Kovacs",
      username: "@brian_kovacs",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      country: "United States",
      countryCode: "US",
      accountStatus: "suspended",
      registrationDate: "2026-01-19T16:40:00Z",
      emailVerified: true,
      phoneVerified: false,
    },
    referredUser: {
      userId: "usr_nb_90433",
      name: "Brian Kovacs (Alt Account)",
      username: "@brian_alt_02",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      country: "United States",
      countryCode: "US",
      accountStatus: "suspended",
      registrationDate: "2026-11-01T09:10:00Z",
      emailVerified: true,
      phoneVerified: false,
      verifiedAt: "2026-11-01T09:12:00Z",
    },
    createdAt: "2026-11-01T09:10:00Z",
    attributionDate: "2026-11-01T09:10:00Z",
    lastActivityAt: "2026-11-01T09:13:00Z",
    status: "rejected",
    previousStatus: "pending",
    qualificationStatus: "ineligible_self_referral",
    missingRequirementSummary: "Self-referral & same identity device fingerprint detected.",
    passedFraudChecks: false,
    rewardType: "Connection Points",
    rewardAmount: 50,
    newUserRewardAmount: 0,
    rewardStatus: "rejected",
    rejectionReason: "Self-Referral",
    rejectedAt: "2026-11-01T09:13:00Z",
    rejectedBy: "Anti-Fraud Validation Engine",
    rejectionSummary: "Blocked self-referral attempt matching existing account identity & hardware signature.",
    timeline: [
      { id: "tl_9005_1", timestamp: "2026-11-01T09:10:00Z", eventType: "attribution_recorded", title: "Self-Referral Attempt Detected", description: "Account signed up using own referral code BRIANINVEST.", actor: "Attribution Engine" },
      { id: "tl_9005_2", timestamp: "2026-11-01T09:13:00Z", eventType: "referral_rejected", title: "Referral Automatically Rejected", description: "Rule violated: Self-referrals cannot earn Connection Points.", actor: "Anti-Fraud Engine" },
    ],
    internalNotes: [
      { id: "note_9005_1", authorName: "Moderator James", authorRole: "Trust & Fraud Analyst", timestamp: "2026-11-01T11:40:00Z", note: "Confirmed self-referral violation. Kept Connection Points reward permanently rejected." },
    ],
  },
  {
    id: "REF-9006",
    referralCode: "ZARA99",
    referralLinkRef: `${REFERRAL_LINK_BASE}?ref=ZARA99`,
    referralSource: "Mobile Share Sheet",
    referrer: {
      userId: "usr_nb_90423",
      name: "Zara Love",
      username: "@zara_love",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
      country: "United States",
      countryCode: "US",
      accountStatus: "active",
      registrationDate: "2025-10-02T11:20:00Z",
      emailVerified: true,
      phoneVerified: true,
    },
    referredUser: {
      userId: "usr_nb_90425",
      name: "Lily Rose",
      username: "@lily_rose",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
      country: "Nigeria",
      countryCode: "NG",
      accountStatus: "active",
      registrationDate: "2026-10-22T15:10:00Z",
      emailVerified: true,
      phoneVerified: true,
      verifiedAt: "2026-10-22T15:14:00Z",
    },
    createdAt: "2026-10-22T15:10:00Z",
    attributionDate: "2026-10-22T15:10:00Z",
    qualificationDate: "2026-10-22T15:14:00Z",
    lastActivityAt: "2026-10-22T15:15:00Z",
    status: "successful",
    qualificationStatus: "qualified",
    satisfiedVerificationMethod: "both",
    passedFraudChecks: true,
    rewardType: "Connection Points",
    rewardAmount: 50,
    newUserRewardAmount: 0,
    rewardStatus: "issued",
    rewardTransactionId: "NB-REF-9006",
    rewardIssuedAt: "2026-10-22T15:15:00Z",
    timeline: [
      { id: "tl_9006_1", timestamp: "2026-10-22T15:10:00Z", eventType: "account_registered", title: "Account Registered", description: "Lily Rose joined via Zara Love referral code.", actor: "Auth Service" },
      { id: "tl_9006_2", timestamp: "2026-10-22T15:14:00Z", eventType: "email_verified", title: "Email & Phone Verified", description: "Both OTP channels verified.", actor: "OTP Service" },
      { id: "tl_9006_3", timestamp: "2026-10-22T15:15:00Z", eventType: "reward_issued", title: "+50 Connection Points Credited", description: "Issued to Zara Love wallet.", actor: "Connection Points Ledger" },
    ],
    internalNotes: [],
  },
  {
    id: "REF-9007",
    referralCode: "DAVIDK22",
    referralLinkRef: `${REFERRAL_LINK_BASE}?ref=DAVIDK22`,
    referralSource: "SMS Invite",
    referrer: {
      userId: "usr_nb_90422",
      name: "David King",
      username: "@david_king",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      country: "Nigeria",
      countryCode: "NG",
      accountStatus: "active",
      registrationDate: "2025-09-04T14:15:00Z",
      emailVerified: true,
      phoneVerified: true,
    },
    referredUser: {
      userId: "usr_nb_90430",
      name: "Elena Rostova",
      username: "@elena_berlin",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      country: "Germany",
      countryCode: "DE",
      accountStatus: "active",
      registrationDate: "2026-11-10T09:10:00Z",
      emailVerified: true,
      phoneVerified: false,
      verifiedAt: "2026-11-10T09:18:00Z",
    },
    createdAt: "2026-11-10T09:10:00Z",
    attributionDate: "2026-11-10T09:10:00Z",
    lastActivityAt: "2026-11-10T09:18:00Z",
    status: "pending",
    qualificationStatus: "awaiting_validation",
    missingRequirementSummary: "Email OTP verified; awaiting final backend attribution validation check.",
    passedFraudChecks: true,
    rewardType: "Connection Points",
    rewardAmount: 50,
    newUserRewardAmount: 0,
    rewardStatus: "pending",
    timeline: [
      { id: "tl_9007_1", timestamp: "2026-11-10T09:10:00Z", eventType: "account_registered", title: "Account Registered", description: "Elena Rostova joined with code DAVIDK22.", actor: "Auth Service" },
      { id: "tl_9007_2", timestamp: "2026-11-10T09:18:00Z", eventType: "email_verified", title: "Email OTP Verified", description: "OTP check passed; ready for backend validation.", actor: "OTP Service" },
    ],
    internalNotes: [],
  },
  {
    id: "REF-9008",
    referralCode: "CHLOEPARIS",
    referralLinkRef: `${REFERRAL_LINK_BASE}?ref=CHLOEPARIS`,
    referralSource: "QR Code Scan",
    referrer: {
      userId: "usr_nb_90428",
      name: "Chloe Dupont",
      username: "@chloe_paris",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      country: "France",
      countryCode: "FR",
      accountStatus: "active",
      registrationDate: "2026-03-11T10:00:00Z",
      emailVerified: true,
      phoneVerified: true,
    },
    referredUser: {
      userId: "usr_nb_90427",
      name: "Marcus Sterling",
      username: "@marcus_sterling",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      country: "Canada",
      countryCode: "CA",
      accountStatus: "active",
      registrationDate: "2026-11-08T16:40:00Z",
      emailVerified: true,
      phoneVerified: true,
      verifiedAt: "2026-11-08T16:45:00Z",
    },
    createdAt: "2026-11-08T16:40:00Z",
    attributionDate: "2026-11-08T16:40:00Z",
    qualificationDate: "2026-11-08T16:45:00Z",
    lastActivityAt: "2026-11-08T16:47:00Z",
    status: "successful",
    qualificationStatus: "qualified",
    satisfiedVerificationMethod: "both",
    passedFraudChecks: true,
    rewardType: "Connection Points",
    rewardAmount: 50,
    newUserRewardAmount: 0,
    rewardStatus: "failed",
    rewardFailureReason: "Wallet ledger lock timeout during automated payout batch; retry authorized.",
    timeline: [
      { id: "tl_9008_1", timestamp: "2026-11-08T16:40:00Z", eventType: "account_registered", title: "Account Registered", description: "Marcus Sterling attributed to CHLOEPARIS.", actor: "Auth Service" },
      { id: "tl_9008_2", timestamp: "2026-11-08T16:45:00Z", eventType: "referral_qualified", title: "Qualification Passed", description: "Email & phone OTP verified.", actor: "Validation Engine" },
      { id: "tl_9008_3", timestamp: "2026-11-08T16:47:00Z", eventType: "reward_failed", title: "Reward Credit Attempt Failed", description: "Wallet ledger lock timeout; no duplicate credit applied.", actor: "Connection Points Ledger" },
    ],
    internalNotes: [
      { id: "note_9008_1", authorName: "Ledger Monitor", authorRole: "System", timestamp: "2026-11-08T16:48:00Z", note: "Safe to retry issuance — confirmed 0 Pts credited on failed attempt." },
    ],
  },
  {
    id: "REF-9009",
    referralCode: "AMARA26",
    referralLinkRef: `${REFERRAL_LINK_BASE}?ref=AMARA26`,
    referralSource: "Mobile Share Sheet",
    referrer: {
      userId: "usr_nb_90421",
      name: "Amara Bliss",
      username: "@amara_bliss",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      country: "Nigeria",
      countryCode: "NG",
      accountStatus: "online",
      registrationDate: "2025-08-12T10:30:00Z",
      emailVerified: true,
      phoneVerified: true,
    },
    referredUser: {
      userId: "usr_nb_90431",
      name: "Tessy Boateng",
      username: "@tessy_b",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80",
      country: "Ghana",
      countryCode: "GH",
      accountStatus: "active",
      registrationDate: "2026-11-10T08:30:00Z",
      emailVerified: true,
      phoneVerified: true,
      verifiedAt: "2026-11-10T08:34:00Z",
    },
    createdAt: "2026-11-10T08:30:00Z",
    attributionDate: "2026-11-10T08:30:00Z",
    qualificationDate: "2026-11-10T08:34:00Z",
    lastActivityAt: "2026-11-10T08:35:00Z",
    status: "successful",
    qualificationStatus: "qualified",
    satisfiedVerificationMethod: "email",
    passedFraudChecks: true,
    rewardType: "Connection Points",
    rewardAmount: 50,
    newUserRewardAmount: 0,
    rewardStatus: "issued",
    rewardTransactionId: "NB-REF-9009",
    rewardIssuedAt: "2026-11-10T08:35:00Z",
    timeline: [
      { id: "tl_9009_1", timestamp: "2026-11-10T08:30:00Z", eventType: "account_registered", title: "Account Registered", description: "Tessy Boateng signed up using AMARA26.", actor: "Auth Service" },
      { id: "tl_9009_2", timestamp: "2026-11-10T08:34:00Z", eventType: "email_verified", title: "Email OTP Verified", description: "Email OTP completed cleanly.", actor: "OTP Service" },
      { id: "tl_9009_3", timestamp: "2026-11-10T08:35:00Z", eventType: "reward_issued", title: "+50 Connection Points Issued", description: "Reward credited to Amara Bliss wallet.", actor: "Connection Points Ledger" },
    ],
    internalNotes: [],
  },
  {
    id: "REF-9010",
    referralCode: "ZARA99",
    referralLinkRef: `${REFERRAL_LINK_BASE}?ref=ZARA99`,
    referralSource: "WhatsApp Invite",
    referrer: {
      userId: "usr_nb_90423",
      name: "Zara Love",
      username: "@zara_love",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
      country: "United States",
      countryCode: "US",
      accountStatus: "active",
      registrationDate: "2025-10-02T11:20:00Z",
      emailVerified: true,
      phoneVerified: true,
    },
    referredUser: {
      userId: "usr_nb_90428",
      name: "Chloe Dupont",
      username: "@chloe_paris",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      country: "France",
      countryCode: "FR",
      accountStatus: "active",
      registrationDate: "2026-11-10T10:15:00Z",
      emailVerified: false,
      phoneVerified: false,
    },
    createdAt: "2026-11-10T10:15:00Z",
    attributionDate: "2026-11-10T10:15:00Z",
    lastActivityAt: "2026-11-10T10:15:00Z",
    status: "pending",
    qualificationStatus: "awaiting_email_verification",
    missingRequirementSummary: "Referred user initiated email verification; OTP confirmation not yet submitted.",
    passedFraudChecks: true,
    rewardType: "Connection Points",
    rewardAmount: 50,
    newUserRewardAmount: 0,
    rewardStatus: "pending",
    timeline: [
      { id: "tl_9010_1", timestamp: "2026-11-10T10:15:00Z", eventType: "account_registered", title: "Account Registered", description: "Chloe Dupont joined via ZARA99.", actor: "Auth Service" },
    ],
    internalNotes: [],
  },
  {
    id: "REF-9011",
    referralCode: "BLACKWOOD",
    referralLinkRef: `${REFERRAL_LINK_BASE}?ref=BLACKWOOD`,
    referralSource: "Direct Link Copy",
    referrer: {
      userId: "usr_nb_90434",
      name: "Richard Blackwood",
      username: "@r_blackwood",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
      country: "United Kingdom",
      countryCode: "GB",
      accountStatus: "banned",
      registrationDate: "2026-04-02T09:00:00Z",
      emailVerified: true,
      phoneVerified: true,
    },
    referredUser: {
      userId: "usr_nb_90433",
      name: "Brian Kovacs",
      username: "@brian_kovacs",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      country: "United States",
      countryCode: "US",
      accountStatus: "suspended",
      registrationDate: "2026-10-15T12:20:00Z",
      emailVerified: true,
      phoneVerified: false,
      verifiedAt: "2026-10-15T12:25:00Z",
    },
    createdAt: "2026-10-15T12:20:00Z",
    attributionDate: "2026-10-15T12:20:00Z",
    lastActivityAt: "2026-10-16T09:30:00Z",
    status: "rejected",
    previousStatus: "successful",
    qualificationStatus: "ineligible_fraud",
    missingRequirementSummary: "Rejected after fraud audit revealed coordinated duplicate referral ring.",
    passedFraudChecks: false,
    rewardType: "Connection Points",
    rewardAmount: 50,
    newUserRewardAmount: 0,
    rewardStatus: "reversed",
    rewardTransactionId: "NB-REF-REV-9011",
    rejectionReason: "Fraudulent Activity",
    rejectedAt: "2026-10-16T09:30:00Z",
    rejectedBy: "Head of Safety David",
    rejectionSummary: "Previous reward reversed after verified cross-account manipulation review.",
    timeline: [
      { id: "tl_9011_1", timestamp: "2026-10-15T12:20:00Z", eventType: "account_registered", title: "Account Registered", description: "Brian Kovacs attributed to BLACKWOOD.", actor: "Auth Service" },
      { id: "tl_9011_2", timestamp: "2026-10-15T12:26:00Z", eventType: "reward_issued", title: "Initial 50 Pts Issued", description: "Automated reward released prior to cluster investigation.", actor: "Connection Points Ledger" },
      { id: "tl_9011_3", timestamp: "2026-10-16T09:30:00Z", eventType: "reward_reversed", title: "Reward Reversed (-50 Pts)", description: "Coordinated abuse verified; referral rejected & reward clawed back.", actor: "Head of Safety David" },
    ],
    internalNotes: [
      { id: "note_9011_1", authorName: "Head of Safety David", authorRole: "Super Administrator", timestamp: "2026-10-16T09:32:00Z", note: "Reversed 50 Pts and escalated account matter to Moderation." },
    ],
  },
  {
    id: "REF-9012",
    referralCode: "LILYLEKKI",
    referralLinkRef: `${REFERRAL_LINK_BASE}?ref=LILYLEKKI`,
    referralSource: "QR Code Scan",
    referrer: {
      userId: "usr_nb_90425",
      name: "Lily Rose",
      username: "@lily_rose",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
      country: "Nigeria",
      countryCode: "NG",
      accountStatus: "active",
      registrationDate: "2025-11-01T08:00:00Z",
      emailVerified: true,
      phoneVerified: true,
    },
    referredUser: {
      userId: "usr_nb_90426",
      name: "Tobi Bakare",
      username: "@tobi_bakare",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
      country: "Nigeria",
      countryCode: "NG",
      accountStatus: "active",
      registrationDate: "2026-11-09T17:15:00Z",
      emailVerified: true,
      phoneVerified: false,
      verifiedAt: "2026-11-09T17:20:00Z",
    },
    createdAt: "2026-11-09T17:15:00Z",
    attributionDate: "2026-11-09T17:15:00Z",
    lastActivityAt: "2026-11-09T17:22:00Z",
    status: "pending",
    qualificationStatus: "under_review",
    missingRequirementSummary: "Shared coworking Wi-Fi signal flagged for routine human review prior to issuance.",
    passedFraudChecks: false,
    rewardType: "Connection Points",
    rewardAmount: 50,
    newUserRewardAmount: 0,
    rewardStatus: "pending",
    timeline: [
      { id: "tl_9012_1", timestamp: "2026-11-09T17:15:00Z", eventType: "account_registered", title: "Account Registered", description: "Tobi Bakare joined via LILYLEKKI QR scan.", actor: "Auth Service" },
      { id: "tl_9012_2", timestamp: "2026-11-09T17:20:00Z", eventType: "email_verified", title: "Email OTP Verified", description: "Email OTP succeeded.", actor: "OTP Service" },
      { id: "tl_9012_3", timestamp: "2026-11-09T17:22:00Z", eventType: "fraud_check_completed", title: "Quality Review Triggered", description: "Same network prefix noted — awaiting manual quality confirmation (does not assume fraud).", actor: "Fraud Signal Monitor" },
    ],
    internalNotes: [],
  },
];

const INITIAL_FRAUD_CASES: FraudAlertCaseRecord[] = [
  {
    id: "FRD-401",
    referralId: "REF-9005",
    referralCode: "BRIANINVEST",
    referrerId: "usr_nb_90433",
    referrerName: "Brian Kovacs",
    referrerUsername: "@brian_kovacs",
    referrerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    referredUserId: "usr_nb_90433",
    referredUserName: "Brian Kovacs (Alt Account)",
    referredUsername: "@brian_alt_02",
    signalType: "self_referral_attempt",
    riskIndicatorLabel: "Self-Referral Identity Match",
    riskLevel: "critical",
    reasonFlagged: "Referrer and referred account share primary identity/device token attempting to claim BRIANINVEST bonus.",
    nonAccusatoryCaveat: "Policy rule requires blocking self-referrals before reward eligibility.",
    detectedAt: "2026-11-01T09:12:00Z",
    reviewStatus: "rejected",
    assignedAdmin: "Moderator James",
    notes: [
      { id: "fn_401", authorName: "Moderator James", authorRole: "Trust & Fraud Analyst", timestamp: "2026-11-01T11:40:00Z", note: "Self-referral verified and permanently rejected." },
    ],
  },
  {
    id: "FRD-402",
    referralId: "REF-9012",
    referralCode: "LILYLEKKI",
    referrerId: "usr_nb_90425",
    referrerName: "Lily Rose",
    referrerUsername: "@lily_rose",
    referrerAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    referredUserId: "usr_nb_90426",
    referredUserName: "Tobi Bakare",
    referredUsername: "@tobi_bakare",
    signalType: "shared_network_signal",
    riskIndicatorLabel: "Shared Network Prefix (Needs Context)",
    riskLevel: "low",
    reasonFlagged: "Sign-up IP prefix matches referrer recent session in Victoria Island, Lagos.",
    nonAccusatoryCaveat: "Shared Wi-Fi at offices, events, or households does NOT prove fraud. Review identity independence before concluding.",
    detectedAt: "2026-11-09T17:22:00Z",
    reviewStatus: "pending_review",
    notes: [],
  },
  {
    id: "FRD-403",
    referralId: "REF-9011",
    referralCode: "BLACKWOOD",
    referrerId: "usr_nb_90434",
    referrerName: "Richard Blackwood",
    referrerUsername: "@r_blackwood",
    referrerAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    referredUserId: "usr_nb_90433",
    referredUserName: "Brian Kovacs",
    referredUsername: "@brian_kovacs",
    signalType: "duplicate_reward_claim",
    riskIndicatorLabel: "Multiple Claim Attempts & Manipulation",
    riskLevel: "high",
    reasonFlagged: "Repeated attribution retries and correlated fake-engagement activity detected across accounts.",
    nonAccusatoryCaveat: "Account-level enforcement handled in Reports & Moderation; reward reversed.",
    detectedAt: "2026-10-16T09:10:00Z",
    reviewStatus: "escalated",
    assignedAdmin: "Head of Safety David",
    notes: [
      { id: "fn_403", authorName: "Head of Safety David", authorRole: "Super Administrator", timestamp: "2026-10-16T09:32:00Z", note: "Reward reversed cleanly and case escalated to Reports & Moderation." },
    ],
  },
];

const INITIAL_AUDIT_EVENTS: ReferralAuditEvent[] = [
  {
    id: "AUD-REF-701",
    timestamp: "2026-11-10T08:35:00Z",
    actorName: "Connection Points Ledger",
    actorRole: "System",
    actionType: "reward_issued",
    actionLabel: "Referral Reward Issued",
    referralId: "REF-9009",
    referrerName: "Amara Bliss",
    referredUserName: "Tessy Boateng",
    previousState: "eligible",
    newState: "issued",
    rewardAmountPoints: 50,
    reason: "Email OTP verified and anti-fraud checks passed cleanly.",
  },
  {
    id: "AUD-REF-702",
    timestamp: "2026-11-08T16:47:00Z",
    actorName: "Connection Points Ledger",
    actorRole: "System",
    actionType: "reward_failed",
    actionLabel: "Reward Issuance Failed",
    referralId: "REF-9008",
    referrerName: "Chloe Dupont",
    referredUserName: "Marcus Sterling",
    previousState: "eligible",
    newState: "failed",
    rewardAmountPoints: 50,
    reason: "Wallet ledger lock timeout; queued for retry without crediting.",
  },
  {
    id: "AUD-REF-703",
    timestamp: "2026-11-01T11:40:00Z",
    actorName: "Moderator James",
    actorRole: "Trust & Fraud Analyst",
    actionType: "referral_rejected",
    actionLabel: "Self-Referral Rejected",
    referralId: "REF-9005",
    referrerName: "Brian Kovacs",
    referredUserName: "Brian Kovacs (Alt Account)",
    previousState: "pending",
    newState: "rejected",
    rewardAmountPoints: 0,
    reason: "Confirmed self-referral violation on BRIANINVEST.",
  },
  {
    id: "AUD-REF-704",
    timestamp: "2026-10-16T09:30:00Z",
    actorName: "Head of Safety David",
    actorRole: "Super Administrator",
    actionType: "reward_reversed",
    actionLabel: "Referral Reward Reversed & Escalated",
    referralId: "REF-9011",
    referrerName: "Richard Blackwood",
    referredUserName: "Brian Kovacs",
    previousState: "issued",
    newState: "reversed",
    rewardAmountPoints: -50,
    reason: "Coordinated abuse cluster confirmed; points clawed back.",
  },
  {
    id: "AUD-REF-705",
    timestamp: "2026-10-01T09:00:00Z",
    actorName: "Elena Vance",
    actorRole: "Super Administrator",
    actionType: "settings_updated",
    actionLabel: "Referral Program Baseline Confirmed",
    previousState: "Initial Setup",
    newState: "50 Pts Referrer-Only",
    rewardAmountPoints: 50,
    reason: "Aligned web admin settings with mobile Invite & Earn configuration.",
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
    // ignore storage quota limits in demo environment
  }
}

export function loadReferralProgramSettings(): ReferralProgramSettings {
  const settings = safeLoad<ReferralProgramSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  const walletConfiguredPts = loadReferralRewardAmount();
  if (walletConfiguredPts && walletConfiguredPts !== settings.rewardAmountPoints) {
    return { ...settings, rewardAmountPoints: walletConfiguredPts };
  }
  return settings;
}

export function saveReferralProgramSettings(settings: ReferralProgramSettings): void {
  safeSave(STORAGE_KEYS.SETTINGS, settings);
}

export function loadReferrals(): AdminReferralRecord[] {
  const referrals = safeLoad<AdminReferralRecord[]>(STORAGE_KEYS.REFERRALS, INITIAL_REFERRALS);
  const walletRewards = loadConnectionPointsRewards();

  // Synchronize status from Wallet & Financial Management reward queue if admin processed a reward there
  return referrals.map((ref) => {
    if (!ref.walletRewardId) return ref;
    const match = walletRewards.find((w) => w.id === ref.walletRewardId);
    if (!match) return ref;
    if (match.issuanceStatus === "issued" && ref.rewardStatus !== "issued") {
      return {
        ...ref,
        status: "successful",
        qualificationStatus: "qualified",
        rewardStatus: "issued",
        rewardTransactionId: match.rewardTransactionRef || ref.rewardTransactionId,
        rewardIssuedAt: match.issuedAt || ref.rewardIssuedAt,
      };
    }
    if (match.issuanceStatus === "reversed" && ref.rewardStatus !== "reversed") {
      return {
        ...ref,
        rewardStatus: "reversed",
      };
    }
    return ref;
  });
}

export function saveReferrals(records: AdminReferralRecord[]): void {
  safeSave(STORAGE_KEYS.REFERRALS, records);
}

export function loadFraudAlertCases(): FraudAlertCaseRecord[] {
  return safeLoad<FraudAlertCaseRecord[]>(STORAGE_KEYS.FRAUD_CASES, INITIAL_FRAUD_CASES);
}

export function saveFraudAlertCases(cases: FraudAlertCaseRecord[]): void {
  safeSave(STORAGE_KEYS.FRAUD_CASES, cases);
}

export function loadReferralAuditHistory(): ReferralAuditEvent[] {
  return safeLoad<ReferralAuditEvent[]>(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_EVENTS);
}

export function appendReferralAuditEvent(
  event: Omit<ReferralAuditEvent, "id" | "timestamp">
): ReferralAuditEvent[] {
  const existing = loadReferralAuditHistory();
  const entry: ReferralAuditEvent = {
    ...event,
    id: `AUD-REF-${Math.floor(710 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString(),
  };
  const next = [entry, ...existing];
  safeSave(STORAGE_KEYS.AUDIT, next);
  return next;
}

// Derive per-user unique Referral Codes & Links directly from User Management records
export function loadReferralCodeRecords(): ReferralCodeRecord[] {
  const users = loadUsersFromStorage();
  const referrals = loadReferrals();
  const statusMap = safeLoad<Record<string, "active" | "paused" | "flagged_review">>(
    STORAGE_KEYS.CODE_PAUSED,
    {}
  );

  return users.map((user, idx) => {
    const code = user.referral.referralCode || `NB_${user.id.slice(-5).toUpperCase()}`;
    const ownedRefs = referrals.filter((r) => r.referrer.userId === user.id);
    const successfulCount = ownedRefs.filter((r) => r.status === "successful").length;
    const pendingCount = ownedRefs.filter((r) => r.status === "pending").length;
    const rejectedCount = ownedRefs.filter((r) => r.status === "rejected").length;
    const pointsEarned = ownedRefs
      .filter((r) => r.rewardStatus === "issued")
      .reduce((s, r) => s + r.rewardAmount, 0);

    const status =
      statusMap[user.id] ||
      (user.status === "banned" || user.status === "suspended"
        ? "flagged_review"
        : "active");

    return {
      userId: user.id,
      ownerName: user.name,
      ownerUsername: user.username,
      ownerAvatar: user.avatar,
      ownerCountry: user.country,
      code,
      referralLink: buildReferralLink(code),
      createdAt: user.registrationDate,
      linkUsesTracked: Math.max(ownedRefs.length * 3 + 2, idx + 4),
      attributedRegistrations: Math.max(ownedRefs.length, user.referral.totalReferred),
      successfulReferrals: Math.max(successfulCount, user.referral.successful),
      pendingReferrals: Math.max(pendingCount, user.referral.pending),
      rejectedReferrals: Math.max(rejectedCount, user.referral.rejected),
      pointsEarnedTotal: Math.max(pointsEarned, user.referral.pointsEarned),
      status,
      isDemoData: true,
    };
  });
}

export function toggleReferralCodeStatus(
  userId: string,
  ownerName: string,
  code: string,
  nextStatus: "active" | "paused",
  reason: string,
  actorName: string,
  actorRole: string
): ReferralCodeRecord[] {
  const statusMap = safeLoad<Record<string, "active" | "paused" | "flagged_review">>(
    STORAGE_KEYS.CODE_PAUSED,
    {}
  );
  const prev = statusMap[userId] || "active";
  statusMap[userId] = nextStatus;
  safeSave(STORAGE_KEYS.CODE_PAUSED, statusMap);

  appendReferralAuditEvent({
    actorName,
    actorRole,
    actionType: "settings_updated",
    actionLabel: `Referral Code ${nextStatus === "paused" ? "Paused" : "Activated"}`,
    referrerName: ownerName,
    previousState: `${code} (${prev})`,
    newState: `${code} (${nextStatus})`,
    reason,
  });

  return loadReferralCodeRecords();
}

export function isWithinReferralDateRange(
  isoDate: string,
  range: ReferralDateRange,
  customStart?: string,
  customEnd?: string
): boolean {
  if (range === "all") return true;
  const ts = new Date(isoDate).getTime();
  if (Number.isNaN(ts)) return true;
  const now = new Date("2026-11-10T23:59:59Z").getTime();

  if (range === "today") {
    return ts >= new Date("2026-11-10T00:00:00Z").getTime();
  }
  if (range === "7d") return ts >= now - 7 * 86400000;
  if (range === "30d") return ts >= now - 30 * 86400000;
  if (range === "90d") return ts >= now - 90 * 86400000;
  if (range === "custom") {
    const startTs = customStart ? new Date(`${customStart}T00:00:00Z`).getTime() : 0;
    const endTs = customEnd ? new Date(`${customEnd}T23:59:59Z`).getTime() : Number.MAX_SAFE_INTEGER;
    return ts >= startTs && ts <= endTs;
  }
  return true;
}

export function calculateReferralOverviewKPIs(
  referrals: AdminReferralRecord[],
  fraudCases: FraudAlertCaseRecord[],
  dateRange: ReferralDateRange = "all",
  customStart?: string,
  customEnd?: string
): ReferralOverviewKpis {
  const scoped = referrals.filter((r) =>
    isWithinReferralDateRange(r.createdAt, dateRange, customStart, customEnd)
  );
  const totalReferrals = scoped.length;
  const pendingReferrals = scoped.filter((r) => r.status === "pending").length;
  const successfulReferrals = scoped.filter((r) => r.status === "successful").length;
  const rejectedReferrals = scoped.filter((r) => r.status === "rejected").length;

  const uniqueReferrers = new Set(scoped.map((r) => r.referrer.userId)).size;
  const uniqueReferredUsers = new Set(scoped.map((r) => r.referredUser.userId)).size;

  const eligibleRewardsCount = scoped.filter((r) => r.rewardStatus === "eligible").length;
  const totalPointsIssued = scoped
    .filter((r) => r.rewardStatus === "issued")
    .reduce((s, r) => s + r.rewardAmount, 0);
  const pendingRewardIssuanceCount = scoped.filter(
    (r) => r.rewardStatus === "eligible" || r.rewardStatus === "pending"
  ).length;
  const failedRewardIssuanceCount = scoped.filter((r) => r.rewardStatus === "failed").length;
  const reversedRewardsCount = scoped.filter((r) => r.rewardStatus === "reversed").length;

  const conversionRatePercent =
    totalReferrals > 0 ? Math.round((successfulReferrals / totalReferrals) * 100) : 0;

  const openFraudAlertsCount = fraudCases.filter(
    (f) => f.reviewStatus === "pending_review" || f.reviewStatus === "under_investigation"
  ).length;

  return {
    totalReferrals,
    pendingReferrals,
    successfulReferrals,
    rejectedReferrals,
    totalReferrers: uniqueReferrers,
    totalReferredUsers: uniqueReferredUsers,
    eligibleRewardsCount,
    totalPointsIssued,
    pendingRewardIssuanceCount,
    conversionRatePercent,
    failedRewardIssuanceCount,
    reversedRewardsCount,
    openFraudAlertsCount,
  };
}

export function filterAndSortReferrals(
  referrals: AdminReferralRecord[],
  filters: ReferralFilterState,
  sort: ReferralSortField,
  fraudCases: FraudAlertCaseRecord[]
): AdminReferralRecord[] {
  let result = [...referrals];

  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.referralCode.toLowerCase().includes(q) ||
        r.referrer.name.toLowerCase().includes(q) ||
        r.referrer.username.toLowerCase().includes(q) ||
        r.referredUser.name.toLowerCase().includes(q) ||
        r.referredUser.username.toLowerCase().includes(q)
    );
  }

  if (filters.status !== "all") {
    result = result.filter((r) => r.status === filters.status);
  }
  if (filters.qualificationStatus !== "all") {
    result = result.filter((r) => r.qualificationStatus === filters.qualificationStatus);
  }
  if (filters.rewardStatus !== "all") {
    result = result.filter((r) => r.rewardStatus === filters.rewardStatus);
  }
  if (filters.verificationMethod !== "all") {
    if (filters.verificationMethod === "unverified") {
      result = result.filter(
        (r) => !r.referredUser.emailVerified && !r.referredUser.phoneVerified
      );
    } else if (filters.verificationMethod === "email") {
      result = result.filter((r) => r.referredUser.emailVerified);
    } else if (filters.verificationMethod === "phone") {
      result = result.filter((r) => r.referredUser.phoneVerified);
    } else if (filters.verificationMethod === "both") {
      result = result.filter(
        (r) => r.referredUser.emailVerified && r.referredUser.phoneVerified
      );
    }
  }
  if (filters.referrerId !== "all") {
    result = result.filter((r) => r.referrer.userId === filters.referrerId);
  }
  if (filters.fraudReviewFilter !== "all") {
    const flaggedIds = new Set(fraudCases.map((f) => f.referralId));
    if (filters.fraudReviewFilter === "flagged_only") {
      result = result.filter((r) => flaggedIds.has(r.id));
    } else {
      result = result.filter((r) => !flaggedIds.has(r.id));
    }
  }
  if (filters.dateRange !== "all") {
    result = result.filter((r) =>
      isWithinReferralDateRange(
        r.createdAt,
        filters.dateRange,
        filters.customStartDate,
        filters.customEndDate
      )
    );
  }

  // Compute referrer counts for sorting by referrer performance
  const countByReferrer: Record<string, number> = {};
  const ptsByReferrer: Record<string, number> = {};
  referrals.forEach((r) => {
    if (r.status === "successful") {
      countByReferrer[r.referrer.userId] = (countByReferrer[r.referrer.userId] || 0) + 1;
    }
    if (r.rewardStatus === "issued") {
      ptsByReferrer[r.referrer.userId] =
        (ptsByReferrer[r.referrer.userId] || 0) + r.rewardAmount;
    }
  });

  result.sort((a, b) => {
    if (sort === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sort === "highest_referrer_count") {
      return (countByReferrer[b.referrer.userId] || 0) - (countByReferrer[a.referrer.userId] || 0);
    }
    if (sort === "highest_referrer_points") {
      return (ptsByReferrer[b.referrer.userId] || 0) - (ptsByReferrer[a.referrer.userId] || 0);
    }
    if (sort === "pending_first") {
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (b.status === "pending" && a.status !== "pending") return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sort === "recent_reward") {
      const ta = a.rewardIssuedAt ? new Date(a.rewardIssuedAt).getTime() : 0;
      const tb = b.rewardIssuedAt ? new Date(b.rewardIssuedAt).getTime() : 0;
      return tb - ta;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return result;
}

// Validate a pending referral ONLY if OTP verification (email or phone) is satisfied!
export function validatePendingReferralRecord(
  referralId: string,
  actorName: string,
  actorRole: string
): { success: boolean; error?: string; records?: AdminReferralRecord[] } {
  const list = loadReferrals();
  const target = list.find((r) => r.id === referralId);
  if (!target) return { success: false, error: "Referral record not found." };

  if (target.referrer.userId === target.referredUser.userId) {
    return {
      success: false,
      error: "Validation Blocked: Self-referrals are permanently prohibited by NobleBond policy.",
    };
  }
  if (!target.referredUser.emailVerified && !target.referredUser.phoneVerified) {
    return {
      success: false,
      error: "Qualification Blocked: Referred user must complete either email or phone OTP verification before referral can transition from Pending to Successful.",
    };
  }

  const now = new Date().toISOString();
  const method: "email" | "phone" | "both" =
    target.referredUser.emailVerified && target.referredUser.phoneVerified
      ? "both"
      : target.referredUser.emailVerified
      ? "email"
      : "phone";

  const updated = list.map((r) =>
    r.id === referralId
      ? {
          ...r,
          previousStatus: r.status,
          status: "successful" as const,
          qualificationStatus: "qualified" as const,
          satisfiedVerificationMethod: method,
          qualificationDate: now,
          lastActivityAt: now,
          passedFraudChecks: true,
          missingRequirementSummary: undefined,
          rewardStatus: r.rewardStatus === "pending" ? ("eligible" as const) : r.rewardStatus,
          timeline: [
            ...r.timeline,
            {
              id: `tl_${Date.now()}`,
              timestamp: now,
              eventType: "referral_qualified" as const,
              title: "Backend Qualification Validated",
              description: `Confirmed ${method} OTP verification. Referral is now Successful and eligible for ${r.rewardAmount} Connection Points.`,
              actor: actorName,
            },
          ],
        }
      : r
  );
  saveReferrals(updated);

  appendReferralAuditEvent({
    actorName,
    actorRole,
    actionType: "referral_validated",
    actionLabel: "Referral Qualified & Validated",
    referralId: target.id,
    referrerName: target.referrer.name,
    referredUserName: target.referredUser.name,
    previousState: target.status,
    newState: "successful",
    rewardAmountPoints: target.rewardAmount,
    reason: `Verified via ${method} OTP; marked eligible for referrer reward.`,
  });

  return { success: true, records: updated };
}

// Demo-mode ONLY: Strictly guards OTP, non-self-referral, non-duplicate, and referrer-only rules!
export function issueReferralRewardPoints(
  referralId: string,
  notes: string,
  actorName: string,
  actorRole: string
): { success: boolean; error?: string; records?: AdminReferralRecord[] } {
  const settings = loadReferralProgramSettings();
  if (!settings.isEnabled) {
    return {
      success: false,
      error: "Referral programme is currently disabled. Re-enable it in Referral Settings before issuing rewards.",
    };
  }

  const list = loadReferrals();
  const target = list.find((r) => r.id === referralId);
  if (!target) return { success: false, error: "Referral record not found." };

  if (target.referrer.userId === target.referredUser.userId) {
    return {
      success: false,
      error: "Validation Blocked: Self-referrals cannot earn Connection Points.",
    };
  }
  if (!target.referredUser.emailVerified && !target.referredUser.phoneVerified) {
    return {
      success: false,
      error: "Qualification Blocked: Referred user must verify email or phone OTP first.",
    };
  }
  if (target.status !== "successful" || target.qualificationStatus !== "qualified") {
    return {
      success: false,
      error: "Validation Blocked: Referral status must be Successful and Qualified before Connection Points can be credited.",
    };
  }
  if (target.rewardStatus === "issued") {
    return {
      success: false,
      error: "Duplicate Issuance Blocked: Reward has already been issued for this referral.",
    };
  }
  if (!target.passedFraudChecks) {
    return {
      success: false,
      error: "Fraud Safeguard Blocked: Clear open quality/fraud flags before issuing reward points.",
    };
  }

  // Sync with Wallet Management if linked to an existing Wallet Reward ID, otherwise direct credit
  const txRef = `NB-REF-${target.id}`;
  if (target.walletRewardId) {
    const walletRes = processReferralRewardAction(
      target.walletRewardId,
      "issue",
      notes,
      actorName,
      actorRole
    );
    if (!walletRes.success) {
      return { success: false, error: walletRes.error || "Wallet ledger rejected issuance." };
    }
  } else {
    grantConnectionPoints(
      target.referrer.userId,
      target.rewardAmount,
      `Referral reward for inviting ${target.referredUser.name}: ${notes}`,
      txRef
    );
  }

  const now = new Date().toISOString();
  const updated = list.map((r) =>
    r.id === referralId
      ? {
          ...r,
          rewardStatus: "issued" as const,
          rewardTransactionId: txRef,
          rewardIssuedAt: now,
          rewardFailureReason: undefined,
          lastActivityAt: now,
          timeline: [
            ...r.timeline,
            {
              id: `tl_${Date.now()}`,
              timestamp: now,
              eventType: "reward_issued" as const,
              title: `+${r.rewardAmount} Connection Points Credited`,
              description: `Issued to referrer ${r.referrer.name} (new user reward: 0 Pts). Note: ${notes}`,
              actor: actorName,
            },
          ],
        }
      : r
  );
  saveReferrals(updated);

  appendReferralAuditEvent({
    actorName,
    actorRole,
    actionType: "reward_issued",
    actionLabel: "Connection Points Reward Issued",
    referralId: target.id,
    referrerName: target.referrer.name,
    referredUserName: target.referredUser.name,
    previousState: target.rewardStatus,
    newState: "issued",
    rewardAmountPoints: target.rewardAmount,
    reason: notes,
  });

  return { success: true, records: updated };
}

export function reverseReferralRewardPoints(
  referralId: string,
  reason: string,
  actorName: string,
  actorRole: string
): { success: boolean; error?: string; records?: AdminReferralRecord[] } {
  const list = loadReferrals();
  const target = list.find((r) => r.id === referralId);
  if (!target) return { success: false, error: "Referral record not found." };
  if (target.rewardStatus !== "issued") {
    return { success: false, error: "Only already issued Connection Points rewards can be reversed." };
  }

  if (target.walletRewardId) {
    processReferralRewardAction(target.walletRewardId, "reverse", reason, actorName, actorRole);
  } else {
    grantConnectionPoints(
      target.referrer.userId,
      -target.rewardAmount,
      `Reversal of referral reward ${target.id}: ${reason}`,
      `REV-${target.id}`
    );
  }

  const now = new Date().toISOString();
  const updated = list.map((r) =>
    r.id === referralId
      ? {
          ...r,
          rewardStatus: "reversed" as const,
          lastActivityAt: now,
          timeline: [
            ...r.timeline,
            {
              id: `tl_${Date.now()}`,
              timestamp: now,
              eventType: "reward_reversed" as const,
              title: `Reward Reversed (-${r.rewardAmount} Pts)`,
              description: reason,
              actor: actorName,
            },
          ],
        }
      : r
  );
  saveReferrals(updated);

  appendReferralAuditEvent({
    actorName,
    actorRole,
    actionType: "reward_reversed",
    actionLabel: "Referral Reward Reversed",
    referralId: target.id,
    referrerName: target.referrer.name,
    referredUserName: target.referredUser.name,
    previousState: "issued",
    newState: "reversed",
    rewardAmountPoints: -target.rewardAmount,
    reason,
  });

  return { success: true, records: updated };
}

export function rejectReferralRecord(
  referralId: string,
  rejectionReason: ReferralRejectionReason,
  summary: string,
  actorName: string,
  actorRole: string
): { success: boolean; error?: string; records?: AdminReferralRecord[] } {
  const list = loadReferrals();
  const target = list.find((r) => r.id === referralId);
  if (!target) return { success: false, error: "Referral record not found." };

  const now = new Date().toISOString();
  const updated = list.map((r) =>
    r.id === referralId
      ? {
          ...r,
          previousStatus: r.status,
          status: "rejected" as const,
          qualificationStatus:
            rejectionReason === "Self-Referral"
              ? ("ineligible_self_referral" as const)
              : rejectionReason === "Duplicate Referral" || rejectionReason === "Duplicate Reward Claim"
              ? ("ineligible_duplicate" as const)
              : rejectionReason === "Invalid Referral Attribution"
              ? ("ineligible_invalid_attribution" as const)
              : ("ineligible_fraud" as const),
          passedFraudChecks: false,
          rewardStatus: r.rewardStatus === "issued" ? r.rewardStatus : ("rejected" as const),
          rejectionReason,
          rejectedAt: now,
          rejectedBy: actorName,
          rejectionSummary: summary,
          lastActivityAt: now,
          timeline: [
            ...r.timeline,
            {
              id: `tl_${Date.now()}`,
              timestamp: now,
              eventType: "referral_rejected" as const,
              title: `Referral Rejected (${rejectionReason})`,
              description: summary,
              actor: actorName,
            },
          ],
        }
      : r
  );
  saveReferrals(updated);

  if (target.walletRewardId && target.rewardStatus !== "issued") {
    processReferralRewardAction(target.walletRewardId, "reject", summary, actorName, actorRole);
  }

  appendReferralAuditEvent({
    actorName,
    actorRole,
    actionType: "referral_rejected",
    actionLabel: `Referral Rejected (${rejectionReason})`,
    referralId: target.id,
    referrerName: target.referrer.name,
    referredUserName: target.referredUser.name,
    previousState: target.status,
    newState: "rejected",
    rewardAmountPoints: 0,
    reason: summary,
  });

  return { success: true, records: updated };
}

// Reconsidering a rejected referral ONLY restores to Pending — rewards still require verification & validation!
export function reconsiderRejectedReferral(
  referralId: string,
  reason: string,
  actorName: string,
  actorRole: string
): { success: boolean; error?: string; records?: AdminReferralRecord[] } {
  const list = loadReferrals();
  const target = list.find((r) => r.id === referralId);
  if (!target) return { success: false, error: "Referral record not found." };
  if (target.referrer.userId === target.referredUser.userId) {
    return {
      success: false,
      error: "Reconsideration Blocked: Self-referrals can never become eligible.",
    };
  }

  const now = new Date().toISOString();
  const hasOtp = target.referredUser.emailVerified || target.referredUser.phoneVerified;
  const updated = list.map((r) =>
    r.id === referralId
      ? {
          ...r,
          previousStatus: r.status,
          status: "pending" as const,
          qualificationStatus: hasOtp ? ("awaiting_validation" as const) : ("awaiting_either_verification" as const),
          rewardStatus: r.rewardStatus === "reversed" ? ("reversed" as const) : ("pending" as const),
          lastActivityAt: now,
          missingRequirementSummary: hasOtp
            ? "Re-opened for quality review & validation (never auto-credits)."
            : "Awaiting referred user email or phone OTP verification.",
          timeline: [
            ...r.timeline,
            {
              id: `tl_${Date.now()}`,
              timestamp: now,
              eventType: "referral_reconsidered" as const,
              title: "Reconsideration Opened -> Pending",
              description: `${reason}. Reward requires full OTP verification & validation.`,
              actor: actorName,
            },
          ],
        }
      : r
  );
  saveReferrals(updated);

  appendReferralAuditEvent({
    actorName,
    actorRole,
    actionType: "referral_reconsidered",
    actionLabel: "Rejected Referral Re-opened to Pending",
    referralId: target.id,
    referrerName: target.referrer.name,
    referredUserName: target.referredUser.name,
    previousState: "rejected",
    newState: "pending",
    reason,
  });

  return { success: true, records: updated };
}

export function addReferralInvestigationNote(
  referralId: string,
  note: string,
  actorName: string,
  actorRole: string
): AdminReferralRecord[] {
  const list = loadReferrals();
  const target = list.find((r) => r.id === referralId);
  const now = new Date().toISOString();
  const updated = list.map((r) =>
    r.id === referralId
      ? {
          ...r,
          lastActivityAt: now,
          internalNotes: [
            {
              id: `note_${Date.now()}`,
              authorName: actorName,
              authorRole: actorRole,
              timestamp: now,
              note,
            },
            ...r.internalNotes,
          ],
        }
      : r
  );
  saveReferrals(updated);

  if (target) {
    appendReferralAuditEvent({
      actorName,
      actorRole,
      actionType: "note_added",
      actionLabel: "Investigation Note Recorded",
      referralId: target.id,
      referrerName: target.referrer.name,
      referredUserName: target.referredUser.name,
      reason: note,
    });
  }
  return updated;
}

export function updateFraudCaseWorkflow(
  caseId: string,
  updates: {
    reviewStatus?: FraudReviewStatus;
    assignedAdmin?: string;
    noteText?: string;
    rejectionReason?: ReferralRejectionReason;
  },
  actorName: string,
  actorRole: string
): { cases: FraudAlertCaseRecord[]; referrals: AdminReferralRecord[] } {
  const cases = loadFraudAlertCases();
  const target = cases.find((c) => c.id === caseId);
  const now = new Date().toISOString();

  const updatedCases = cases.map((c) => {
    if (c.id !== caseId) return c;
    const nextNotes = updates.noteText
      ? [
          {
            id: `fn_${Date.now()}`,
            authorName: actorName,
            authorRole: actorRole,
            timestamp: now,
            note: updates.noteText,
          },
          ...c.notes,
        ]
      : c.notes;

    return {
      ...c,
      reviewStatus: updates.reviewStatus ?? c.reviewStatus,
      assignedAdmin: updates.assignedAdmin ?? c.assignedAdmin,
      notes: nextNotes,
    };
  });
  saveFraudAlertCases(updatedCases);

  let updatedReferrals = loadReferrals();
  if (target) {
    if (updates.reviewStatus === "cleared") {
      updatedReferrals = updatedReferrals.map((r) =>
        r.id === target.referralId ? { ...r, passedFraudChecks: true } : r
      );
      saveReferrals(updatedReferrals);
      appendReferralAuditEvent({
        actorName,
        actorRole,
        actionType: "fraud_cleared",
        actionLabel: "Fraud Signal Cleared",
        referralId: target.referralId,
        referrerName: target.referrerName,
        referredUserName: target.referredUserName,
        previousState: target.reviewStatus,
        newState: "cleared",
        reason: updates.noteText || "Confirmed legitimate independent accounts after inspection.",
      });
    } else if (updates.reviewStatus === "rejected") {
      const rejRes = rejectReferralRecord(
        target.referralId,
        updates.rejectionReason || "Fraudulent Activity",
        updates.noteText || "Rejected following fraud investigation queue review.",
        actorName,
        actorRole
      );
      if (rejRes.records) updatedReferrals = rejRes.records;
    } else if (updates.reviewStatus === "escalated") {
      appendReferralAuditEvent({
        actorName,
        actorRole,
        actionType: "fraud_escalated",
        actionLabel: "Fraud Case Escalated",
        referralId: target.referralId,
        referrerName: target.referrerName,
        referredUserName: target.referredUserName,
        previousState: target.reviewStatus,
        newState: "escalated",
        reason: updates.noteText || "Escalated to Reports & Moderation.",
      });
    } else if (updates.assignedAdmin && !updates.reviewStatus) {
      appendReferralAuditEvent({
        actorName,
        actorRole,
        actionType: "fraud_assigned",
        actionLabel: "Investigation Assigned",
        referralId: target.referralId,
        referrerName: target.referrerName,
        referredUserName: target.referredUserName,
        previousState: target.assignedAdmin || "Unassigned",
        newState: updates.assignedAdmin,
        reason: updates.noteText || `Assigned fraud investigation to ${updates.assignedAdmin}.`,
      });
    } else if (updates.reviewStatus === "under_investigation") {
      appendReferralAuditEvent({
        actorName,
        actorRole,
        actionType: "fraud_under_investigation",
        actionLabel: "Marked Under Investigation",
        referralId: target.referralId,
        referrerName: target.referrerName,
        referredUserName: target.referredUserName,
        previousState: target.reviewStatus,
        newState: "under_investigation",
        reason: updates.noteText || "Opened active investigation workflow.",
      });
    } else if (updates.noteText) {
      appendReferralAuditEvent({
        actorName,
        actorRole,
        actionType: "note_added",
        actionLabel: "Fraud Case Note Added",
        referralId: target.referralId,
        referrerName: target.referrerName,
        referredUserName: target.referredUserName,
        reason: updates.noteText,
      });
    }
  }

  return { cases: updatedCases, referrals: updatedReferrals };
}

export function updateReferralProgramConfig(
  nextSettings: ReferralProgramSettings,
  reason: string,
  actorName: string,
  actorRole: string
): ReferralProgramSettings {
  const prev = loadReferralProgramSettings();
  const now = new Date().toISOString();
  const finalized: ReferralProgramSettings = {
    ...nextSettings,
    rewardType: "Connection Points",
    rewardRecipient: "Referrer Only",
    newUserRewardPoints: 0,
    lastUpdatedAt: now,
    lastUpdatedBy: `${actorName} (${actorRole})`,
  };
  saveReferralProgramSettings(finalized);

  if (prev.rewardAmountPoints !== finalized.rewardAmountPoints) {
    updateConfigurableReferralPoints(
      finalized.rewardAmountPoints,
      reason,
      actorName,
      actorRole
    );
    appendReferralAuditEvent({
      actorName,
      actorRole,
      actionType: "reward_amount_changed",
      actionLabel: "Referral Reward Amount Updated (Prospective)",
      previousState: `${prev.rewardAmountPoints} Pts`,
      newState: `${finalized.rewardAmountPoints} Pts`,
      rewardAmountPoints: finalized.rewardAmountPoints,
      reason: `${reason} (Historical issued records remain unchanged.)`,
    });
  } else if (prev.isEnabled !== finalized.isEnabled) {
    appendReferralAuditEvent({
      actorName,
      actorRole,
      actionType: finalized.isEnabled ? "programme_enabled" : "programme_disabled",
      actionLabel: finalized.isEnabled
        ? "Referral Programme Enabled"
        : "Referral Programme Disabled",
      previousState: prev.isEnabled ? "Enabled" : "Disabled",
      newState: finalized.isEnabled ? "Enabled" : "Disabled",
      reason,
    });
  } else {
    appendReferralAuditEvent({
      actorName,
      actorRole,
      actionType: "settings_updated",
      actionLabel: "Referral Programme Attribution Updated",
      previousState: `${prev.attributionWindowDays}d window`,
      newState: `${finalized.attributionWindowDays}d window`,
      reason,
    });
  }

  return finalized;
}

export function resetReferralManagementDemoData(): void {
  localStorage.removeItem(STORAGE_KEYS.REFERRALS);
  localStorage.removeItem(STORAGE_KEYS.FRAUD_CASES);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.AUDIT);
  localStorage.removeItem(STORAGE_KEYS.CODE_PAUSED);
  updateConfigurableReferralPoints(50, "Demo reset baseline 50 Pts", "System Reset", "System");
}

// Privacy-safe CSV Exports (omits sensitive emails, phone numbers, OTPs, IPs)
function triggerCsvDownload(headers: string[], rows: string[][], filename: string): void {
  const escapeCell = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [
    headers.map(escapeCell).join(","),
    ...rows.map((r) => r.map(escapeCell).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportReferralsCsv(records: AdminReferralRecord[]): void {
  const headers = [
    "Referral ID",
    "Referral Code",
    "Referrer",
    "Referrer Username",
    "Referred User",
    "Referred Username",
    "Email Verified",
    "Phone Verified",
    "Referral Status",
    "Qualification Status",
    "Reward Type",
    "Reward Amount (Pts)",
    "New User Bonus",
    "Reward Status",
    "Created At",
  ];
  const rows = records.map((r) => [
    r.id,
    r.referralCode,
    r.referrer.name,
    r.referrer.username,
    r.referredUser.name,
    r.referredUser.username,
    r.referredUser.emailVerified ? "Yes" : "No",
    r.referredUser.phoneVerified ? "Yes" : "No",
    r.status,
    r.qualificationStatus,
    r.rewardType,
    String(r.rewardAmount),
    "0",
    r.rewardStatus,
    r.createdAt,
  ]);
  triggerCsvDownload(headers, rows, `noblebond_referrals_${new Date().toISOString().slice(0, 10)}.csv`);
}

export function exportReferralRewardsCsv(records: AdminReferralRecord[]): void {
  const headers = [
    "Reward Ref",
    "Referral ID",
    "Referrer",
    "Referred User",
    "Reward Type",
    "Points Amount",
    "Reward Status",
    "Qualification Date",
    "Issued At",
  ];
  const rows = records.map((r) => [
    r.rewardTransactionId || r.walletRewardId || "N/A",
    r.id,
    r.referrer.name,
    r.referredUser.name,
    "Connection Points",
    String(r.rewardAmount),
    r.rewardStatus,
    r.qualificationDate || "Pending",
    r.rewardIssuedAt || "Not Issued",
  ]);
  triggerCsvDownload(headers, rows, `noblebond_referral_rewards_${new Date().toISOString().slice(0, 10)}.csv`);
}

export function exportReferralAuditCsv(events: ReferralAuditEvent[]): void {
  const headers = [
    "Event ID",
    "Timestamp",
    "Actor",
    "Role",
    "Action",
    "Referral ID",
    "Referrer",
    "Previous State",
    "New State",
    "Reward Pts",
    "Reason",
  ];
  const rows = events.map((e) => [
    e.id,
    e.timestamp,
    e.actorName,
    e.actorRole,
    e.actionLabel,
    e.referralId || "--",
    e.referrerName || "--",
    e.previousState || "--",
    e.newState || "--",
    e.rewardAmountPoints !== undefined ? String(e.rewardAmountPoints) : "--",
    e.reason,
  ]);
  triggerCsvDownload(headers, rows, `noblebond_referral_audit_${new Date().toISOString().slice(0, 10)}.csv`);
}

