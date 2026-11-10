// NobleBond Admin — Wallet & Financial Management Data Service
// Synchronizes with User Management, Live Management, and Subscription Management with strict 3-product separation. Zero emojis.

import type {
  FinancialRoleKey,
  FinancialRolePermissions,
  GiftCoinPurchaseRecord,
  ConnectionPointsRewardRecord,
  ConnectionPointsRedemptionRecord,
  UnifiedFinancialTransaction,
  UserWalletSummary,
  ReconciliationCaseRecord,
  ReconciliationStatus,
  FinancialAlertItem,
  WalletAuditEvent,
  WalletOverviewKpis,
  WalletFilterState,
  WalletSortCriteria,
  WalletDateRange,
} from "../types/walletManagement.types";
import {
  loadUsersFromStorage,
  grantGiftCoins,
  grantConnectionPoints,
} from "./userManagementDataService";
import { loadLiveGifts } from "./liveManagementDataService";
import { loadSubscriptionTransactions } from "./subscriptionManagementDataService";

const STORAGE_KEYS = {
  GIFT_PURCHASES: "noblebond_admin_wallet_gift_purchases_v1",
  REWARDS: "noblebond_admin_wallet_cp_rewards_v1",
  REDEMPTIONS: "noblebond_admin_wallet_cp_redemptions_v1",
  ADJUSTMENT_TXS: "noblebond_admin_wallet_adjustments_v1",
  RECONCILIATION: "noblebond_admin_wallet_reconciliation_v1",
  AUDIT: "noblebond_admin_wallet_audit_v1",
  REFERRAL_REWARD_CONFIG: "noblebond_admin_wallet_referral_pts_v1",
};

// Reused Exact Gift Coin Packages from Mobile WALLET_CONFIG
export interface OfficialGiftCoinPackage {
  id: string;
  name: string;
  coins: number;
  bonusCoins: number;
  price: number;
  currency: string;
  badge: string;
}

export const NOBLEBOND_GIFT_COIN_PACKAGES: OfficialGiftCoinPackage[] = [
  { id: "pkg_starter", name: "Starter Pack", coins: 100, bonusCoins: 0, price: 1.99, currency: "USD", badge: "Intro" },
  { id: "pkg_popular", name: "Popular Pack", coins: 500, bonusCoins: 50, price: 9.99, currency: "USD", badge: "Most Popular" },
  { id: "pkg_value", name: "Value Pack", coins: 1000, bonusCoins: 200, price: 19.99, currency: "USD", badge: "Best Value" },
  { id: "pkg_premium", name: "Premium Pack", coins: 2500, bonusCoins: 700, price: 49.99, currency: "USD", badge: "VIP Choice" },
  { id: "pkg_ultimate", name: "Ultimate Pack", coins: 5000, bonusCoins: 2000, price: 99.99, currency: "USD", badge: "Creator Favorite" },
];

// Reused Exact Connection Points Perks from Mobile REFERRAL_CONFIG
export const NOBLEBOND_POINTS_PERKS = [
  { id: "additional_likes" as const, title: "Additional Daily Likes", pointsCost: 15 },
  { id: "super_likes" as const, title: "Super Likes", pointsCost: 25 },
  { id: "discovery_boost" as const, title: "Discovery Spotlight", pointsCost: 40 },
  { id: "profile_boost" as const, title: "Profile Boost (30 Mins)", pointsCost: 50 },
];

// 12 Financial Permissions RBAC Matrix
export const FINANCIAL_ROLE_PERMISSIONS: Record<FinancialRoleKey, FinancialRolePermissions> = {
  super_admin: {
    role: "super_admin",
    roleLabel: "Super Administrator",
    canViewOverview: true,
    canViewGiftCoins: true,
    canViewConnectionPoints: true,
    canViewSubscriptions: true,
    canViewUserWallets: true,
    canIssueGiftCoins: true,
    canIssueConnectionPoints: true,
    canApproveAdjustments: true,
    canReverseTransactions: true,
    canReviewReconciliation: true,
    canViewAnalytics: true,
    canViewAuditHistory: true,
  },
  financial_controller: {
    role: "financial_controller",
    roleLabel: "Financial Operations Controller",
    canViewOverview: true,
    canViewGiftCoins: true,
    canViewConnectionPoints: true,
    canViewSubscriptions: true,
    canViewUserWallets: true,
    canIssueGiftCoins: true,
    canIssueConnectionPoints: false,
    canApproveAdjustments: true,
    canReverseTransactions: true,
    canReviewReconciliation: true,
    canViewAnalytics: true,
    canViewAuditHistory: true,
  },
  rewards_manager: {
    role: "rewards_manager",
    roleLabel: "Referral & Rewards Operations Lead",
    canViewOverview: true,
    canViewGiftCoins: false,
    canViewConnectionPoints: true,
    canViewSubscriptions: false,
    canViewUserWallets: true,
    canIssueGiftCoins: false,
    canIssueConnectionPoints: true,
    canApproveAdjustments: false,
    canReverseTransactions: false,
    canReviewReconciliation: true,
    canViewAnalytics: true,
    canViewAuditHistory: true,
  },
  compliance_auditor: {
    role: "compliance_auditor",
    roleLabel: "Compliance & Audit Analyst (Read-Only)",
    canViewOverview: true,
    canViewGiftCoins: true,
    canViewConnectionPoints: true,
    canViewSubscriptions: true,
    canViewUserWallets: true,
    canIssueGiftCoins: false,
    canIssueConnectionPoints: false,
    canApproveAdjustments: false,
    canReverseTransactions: false,
    canReviewReconciliation: true,
    canViewAnalytics: true,
    canViewAuditHistory: true,
  },
};

const INITIAL_GIFT_PURCHASES: GiftCoinPurchaseRecord[] = [
  {
    id: "GCP-5001",
    userId: "usr_nb_90421",
    userName: "Amara Bliss",
    username: "@amara_bliss",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    packageId: "pkg_premium",
    packageName: "Premium Pack",
    baseCoins: 2500,
    bonusCoins: 700,
    totalCoins: 3200,
    purchaseAmount: 49.99,
    currency: "USD",
    currencySymbol: "$",
    paymentProvider: "apple_app_store",
    maskedPaymentMethod: "Apple Pay (Device Account)",
    paymentReference: "AP-IAP-994021",
    timestamp: "2026-11-08T15:42:00Z",
    status: "completed",
    previousCoinBalance: 250,
    newCoinBalance: 3450,
  },
  {
    id: "GCP-5002",
    userId: "usr_nb_90422",
    userName: "David King",
    username: "@david_king",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    packageId: "pkg_value",
    packageName: "Value Pack",
    baseCoins: 1000,
    bonusCoins: 200,
    totalCoins: 1200,
    purchaseAmount: 19.99,
    currency: "USD",
    currencySymbol: "$",
    paymentProvider: "google_play_store",
    maskedPaymentMethod: "Google Pay (Google Account)",
    paymentReference: "GP-IAP-884120",
    timestamp: "2026-11-07T20:15:00Z",
    status: "completed",
    previousCoinBalance: 1000,
    newCoinBalance: 2200,
  },
  {
    id: "GCP-5003",
    userId: "usr_nb_90427",
    userName: "Marcus Sterling",
    username: "@marcus_sterling",
    userAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    packageId: "pkg_ultimate",
    packageName: "Ultimate Pack",
    baseCoins: 5000,
    bonusCoins: 2000,
    totalCoins: 7000,
    purchaseAmount: 99.99,
    currency: "USD",
    currencySymbol: "$",
    paymentProvider: "stripe_web",
    maskedPaymentMethod: "Amex •••• 1002",
    paymentReference: "NB-PAY-77312",
    timestamp: "2026-11-06T18:10:00Z",
    status: "completed",
    previousCoinBalance: 1200,
    newCoinBalance: 8200,
  },
  {
    id: "GCP-5004",
    userId: "usr_nb_90424",
    userName: "Jayden Cole",
    username: "@jayden_cole",
    userAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
    packageId: "pkg_popular",
    packageName: "Popular Pack",
    baseCoins: 500,
    bonusCoins: 50,
    totalCoins: 550,
    purchaseAmount: 9.99,
    currency: "USD",
    currencySymbol: "$",
    paymentProvider: "apple_app_store",
    maskedPaymentMethod: "Apple Pay (Device Account)",
    paymentReference: "AP-IAP-663201",
    timestamp: "2026-11-05T13:20:00Z",
    status: "completed",
    previousCoinBalance: 3500,
    newCoinBalance: 4050,
  },
  {
    id: "GCP-5005",
    userId: "usr_nb_90433",
    userName: "Brian Kovacs",
    username: "@brian_kovacs",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    packageId: "pkg_value",
    packageName: "Value Pack",
    baseCoins: 1000,
    bonusCoins: 200,
    totalCoins: 1200,
    purchaseAmount: 19.99,
    currency: "USD",
    currencySymbol: "$",
    paymentProvider: "stripe_web",
    maskedPaymentMethod: "Mastercard •••• 6014",
    paymentReference: "NB-FAIL-44912",
    timestamp: "2026-11-09T09:10:00Z",
    status: "failed",
    failureReason: "Card issuer declined purchase (do_not_honor). Zero coins credited to wallet.",
  },
  {
    id: "GCP-5006",
    userId: "usr_nb_90428",
    userName: "Chloe Dupont",
    username: "@chloe_paris",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    packageId: "pkg_starter",
    packageName: "Starter Pack",
    baseCoins: 100,
    bonusCoins: 0,
    totalCoins: 100,
    purchaseAmount: 1.99,
    currency: "USD",
    currencySymbol: "$",
    paymentProvider: "apple_app_store",
    maskedPaymentMethod: "Apple Pay (Device Account)",
    paymentReference: "AP-PEND-99104",
    timestamp: "2026-11-10T10:25:00Z",
    status: "pending",
  },
];

const INITIAL_CP_REWARDS: ConnectionPointsRewardRecord[] = [
  {
    id: "RWD-3001",
    referralId: "ref_90421_1",
    referrerUserId: "usr_nb_90421",
    referrerName: "Amara Bliss",
    referrerUsername: "@amara_bliss",
    referrerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    referredUserId: "usr_nb_90423",
    referredUserName: "Zara Love",
    referredUsername: "@zara_love",
    referralCode: "AMARA26",
    rewardSource: "successful_referral",
    verificationStatus: "verified_email",
    isSelfReferral: false,
    isDuplicateOrFraud: false,
    qualificationStatus: "qualified",
    pointsAmount: 50,
    issuanceStatus: "issued",
    createdAt: "2026-02-10T08:00:00Z",
    qualifiedAt: "2026-02-10T08:05:00Z",
    issuedAt: "2026-02-10T08:06:00Z",
    rewardTransactionRef: "NB-REF-3001",
    notes: "OTP verification passed. +50 Connection Points issued to referrer (referred member receives 0 bonus).",
  },
  {
    id: "RWD-3002",
    referralId: "ref_90421_2",
    referrerUserId: "usr_nb_90421",
    referrerName: "Amara Bliss",
    referrerUsername: "@amara_bliss",
    referrerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    referredUserId: "usr_nb_90424",
    referredUserName: "Jayden Cole",
    referredUsername: "@jayden_cole",
    referralCode: "AMARA26",
    rewardSource: "successful_referral",
    verificationStatus: "verified_phone",
    isSelfReferral: false,
    isDuplicateOrFraud: false,
    qualificationStatus: "qualified",
    pointsAmount: 50,
    issuanceStatus: "issued",
    createdAt: "2026-11-04T11:00:00Z",
    qualifiedAt: "2026-11-04T11:04:00Z",
    issuedAt: "2026-11-04T11:05:00Z",
    rewardTransactionRef: "NB-REF-3002",
    notes: "Verified referral phone OTP. Credited cleanly.",
  },
  {
    id: "RWD-3003",
    referralId: "ref_90422_8",
    referrerUserId: "usr_nb_90422",
    referrerName: "David King",
    referrerUsername: "@david_king",
    referrerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    referredUserId: "usr_nb_90429",
    referredUserName: "Kofi Mensah",
    referredUsername: "@kofi_mensah",
    referralCode: "DK99",
    rewardSource: "successful_referral",
    verificationStatus: "verified_email",
    isSelfReferral: false,
    isDuplicateOrFraud: false,
    qualificationStatus: "qualified",
    pointsAmount: 50,
    issuanceStatus: "eligible",
    createdAt: "2026-11-09T14:20:00Z",
    qualifiedAt: "2026-11-09T14:25:00Z",
    notes: "Email OTP verified; queued for admin or batch issuance approval.",
  },
  {
    id: "RWD-3004",
    referralId: "ref_90426_3",
    referrerUserId: "usr_nb_90426",
    referrerName: "Tobi Bakare",
    referrerUsername: "@tobi_bakare",
    referrerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    referredUserId: "usr_nb_90432",
    referredUserName: "Victor Okafor",
    referredUsername: "@victor_okafor",
    referralCode: "TOBI88",
    rewardSource: "successful_referral",
    verificationStatus: "unverified",
    isSelfReferral: false,
    isDuplicateOrFraud: false,
    qualificationStatus: "awaiting_otp",
    pointsAmount: 50,
    issuanceStatus: "pending",
    createdAt: "2026-11-09T08:15:00Z",
    notes: "Awaiting referred user phone/email OTP verification before reward becomes eligible.",
  },
  {
    id: "RWD-3005",
    referralId: "ref_90433_9",
    referrerUserId: "usr_nb_90433",
    referrerName: "Brian Kovacs",
    referrerUsername: "@brian_kovacs",
    referrerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    referredUserId: "usr_nb_90433",
    referredUserName: "Brian Kovacs (Duplicate Device)",
    referredUsername: "@brian_alt_02",
    referralCode: "BRIAN_REF",
    rewardSource: "successful_referral",
    verificationStatus: "verified_email",
    isSelfReferral: true,
    isDuplicateOrFraud: true,
    qualificationStatus: "ineligible_self_ref",
    pointsAmount: 50,
    issuanceStatus: "rejected",
    createdAt: "2026-11-01T09:10:00Z",
    notes: "Automatically rejected: same referrer device fingerprint & self-referral violation detected.",
  },
];

const INITIAL_CP_REDEMPTIONS: ConnectionPointsRedemptionRecord[] = [
  {
    id: "RDM-6001",
    userId: "usr_nb_90421",
    userName: "Amara Bliss",
    username: "@amara_bliss",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    perkId: "profile_boost",
    perkTitle: "Profile Boost (30 Mins)",
    pointsSpent: 50,
    previousPointsBalance: 900,
    newPointsBalance: 850,
    relatedActivityRef: "BOOST-2026-991",
    timestamp: "2026-11-07T20:30:00Z",
    status: "completed",
  },
  {
    id: "RDM-6002",
    userId: "usr_nb_90422",
    userName: "David King",
    username: "@david_king",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    perkId: "super_likes",
    perkTitle: "Super Likes",
    pointsSpent: 25,
    previousPointsBalance: 475,
    newPointsBalance: 450,
    relatedActivityRef: "SLK-90422-11",
    timestamp: "2026-11-08T19:15:00Z",
    status: "completed",
  },
  {
    id: "RDM-6003",
    userId: "usr_nb_90425",
    userName: "Lily Rose",
    username: "@lily_rose",
    userAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    perkId: "additional_likes",
    perkTitle: "Additional Daily Likes",
    pointsSpent: 15,
    previousPointsBalance: 365,
    newPointsBalance: 350,
    relatedActivityRef: "ADLK-4410",
    timestamp: "2026-11-09T11:45:00Z",
    status: "completed",
  },
];

const INITIAL_RECONCILIATION: ReconciliationCaseRecord[] = [
  {
    id: "REC-101",
    transactionRef: "GCP-5001 (AP-IAP-994021)",
    category: "gift_coins",
    expectedResult: "Credit +3,200 Gift Coins on $49.99 Apple IAP",
    actualResult: "Credited +3,200 Gift Coins (Bal: 250 -> 3,450)",
    differenceSummary: "0 Coins discrepancy (Exact Match)",
    severity: "low",
    status: "matched",
    detectedAt: "2026-11-08T15:43:00Z",
  },
  {
    id: "REC-102",
    transactionRef: "gft_7006 (tx_wlt_99019)",
    category: "gift_coins",
    expectedResult: "Sender debit 1,500 Coins settled cleanly",
    actualResult: "Sender account flagged for fraud review (Golden Ring disputed)",
    differenceSummary: "1,500 Coins host credit held in review",
    severity: "high",
    status: "pending_review",
    detectedAt: "2026-11-09T11:10:00Z",
    investigationNotes: "Sender Richard Blackwood permanently banned; Live team verifying recipient Zara Love gift ledger.",
  },
  {
    id: "REC-103",
    transactionRef: "GCP-5006 (AP-PEND-99104)",
    category: "gift_coins",
    expectedResult: "Apple Store IAP webhook receipt confirmation",
    actualResult: "Status still PENDING after 25 minutes; 0 Coins credited",
    differenceSummary: "$1.99 pending StoreKit receipt",
    severity: "medium",
    status: "mismatch",
    detectedAt: "2026-11-10T10:50:00Z",
    investigationNotes: "Awaiting App Store Server Notification v2 confirmation before crediting Starter Pack (100 Coins).",
  },
  {
    id: "REC-104",
    transactionRef: "RWD-3003 (ref_90422_8)",
    category: "connection_points",
    expectedResult: "+50 Connection Points upon email verification",
    actualResult: "Email OTP confirmed; queued in Eligible Rewards",
    differenceSummary: "50 Pts awaiting issuance batch",
    severity: "low",
    status: "pending_review",
    detectedAt: "2026-11-09T14:26:00Z",
  },
  {
    id: "REC-105",
    transactionRef: "NB-2026-98311 (SUB-7012)",
    category: "premium_subscription",
    expectedResult: "Capture $41.94 renewal for 6 Months Premium",
    actualResult: "Stripe declined (insufficient_funds); sub placed in Past Due",
    differenceSummary: "-$41.94 uncollected renewal",
    severity: "medium",
    status: "escalated",
    detectedAt: "2026-11-07T08:05:00Z",
    investigatedBy: "Financial Operations Controller",
    investigationNotes: "Automatic smart retry #2 scheduled for Nov 11.",
  },
];

const INITIAL_AUDIT: WalletAuditEvent[] = [
  {
    id: "AUD-FIN-803",
    adminName: "Referral Operations Lead",
    adminRole: "Referral & Rewards Operations Lead",
    actionType: "referral_reward_rejected",
    userId: "usr_nb_90433",
    userName: "Brian Kovacs",
    walletType: "connection_points",
    amountOrQuantityDisplay: "0 Pts (Rejected 50 Pts claim)",
    previousBalance: "0 Pts",
    newBalance: "0 Pts",
    reason: "Rejected self-referral / duplicate device fingerprint attempt (RWD-3005).",
    relatedTransactionId: "RWD-3005",
    timestamp: "2026-11-01T09:12:00Z",
  },
  {
    id: "AUD-FIN-802",
    adminName: "Super Administrator",
    adminRole: "Super Administrator",
    actionType: "referral_config_updated",
    userId: "system",
    userName: "Platform Policy",
    walletType: "system_config",
    amountOrQuantityDisplay: "50 Pts / Qualified Referral",
    previousBalance: "50 Pts",
    newBalance: "50 Pts (Confirmed)",
    reason: "Verified default NobleBond Invite & Earn reward parameter (referrer only after OTP).",
    relatedTransactionId: "CFG-REF-50",
    timestamp: "2026-10-15T10:00:00Z",
  },
  {
    id: "AUD-FIN-801",
    adminName: "Financial Operations Controller",
    adminRole: "Financial Operations Controller",
    actionType: "gift_coins_credited",
    userId: "usr_nb_90421",
    userName: "Amara Bliss",
    walletType: "gift_coins",
    amountOrQuantityDisplay: "+250 Coins",
    previousBalance: "3,200 Coins",
    newBalance: "3,450 Coins",
    reason: "Lagos Live Host Showcase milestone community recognition credit (Non-monetary Gift Coins).",
    relatedTransactionId: "ADM-COIN-90421",
    timestamp: "2026-10-20T16:30:00Z",
  },
];

function safeLoad<T>(key: string, fallback: () => T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Failed loading ${key}:`, err);
  }
  const initial = fallback();
  try {
    localStorage.setItem(key, JSON.stringify(initial));
  } catch {
    // ignore storage limits
  }
  return initial;
}

export function loadGiftCoinPurchases(): GiftCoinPurchaseRecord[] {
  return safeLoad(STORAGE_KEYS.GIFT_PURCHASES, () => INITIAL_GIFT_PURCHASES);
}
export function saveGiftCoinPurchases(data: GiftCoinPurchaseRecord[]): void {
  localStorage.setItem(STORAGE_KEYS.GIFT_PURCHASES, JSON.stringify(data));
}

export function loadConnectionPointsRewards(): ConnectionPointsRewardRecord[] {
  return safeLoad(STORAGE_KEYS.REWARDS, () => INITIAL_CP_REWARDS);
}
export function saveConnectionPointsRewards(data: ConnectionPointsRewardRecord[]): void {
  localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(data));
}

export function loadConnectionPointsRedemptions(): ConnectionPointsRedemptionRecord[] {
  return safeLoad(STORAGE_KEYS.REDEMPTIONS, () => INITIAL_CP_REDEMPTIONS);
}
export function saveConnectionPointsRedemptions(data: ConnectionPointsRedemptionRecord[]): void {
  localStorage.setItem(STORAGE_KEYS.REDEMPTIONS, JSON.stringify(data));
}

export function loadWalletAdjustmentTransactions(): UnifiedFinancialTransaction[] {
  return safeLoad(STORAGE_KEYS.ADJUSTMENT_TXS, () => []);
}
export function saveWalletAdjustmentTransactions(data: UnifiedFinancialTransaction[]): void {
  localStorage.setItem(STORAGE_KEYS.ADJUSTMENT_TXS, JSON.stringify(data));
}

export function loadReconciliationCases(): ReconciliationCaseRecord[] {
  return safeLoad(STORAGE_KEYS.RECONCILIATION, () => INITIAL_RECONCILIATION);
}
export function saveReconciliationCases(data: ReconciliationCaseRecord[]): void {
  localStorage.setItem(STORAGE_KEYS.RECONCILIATION, JSON.stringify(data));
}

export function loadWalletAuditHistory(): WalletAuditEvent[] {
  return safeLoad(STORAGE_KEYS.AUDIT, () => INITIAL_AUDIT);
}
export function saveWalletAuditHistory(data: WalletAuditEvent[]): void {
  localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(data));
}

export function loadReferralRewardAmount(): number {
  return safeLoad(STORAGE_KEYS.REFERRAL_REWARD_CONFIG, () => 50);
}
export function saveReferralRewardAmount(points: number): void {
  localStorage.setItem(STORAGE_KEYS.REFERRAL_REWARD_CONFIG, JSON.stringify(points));
}

// Reference Timestamp (matches Nov 10, 2026)
const REFERENCE_NOW_MS = new Date("2026-11-10T11:00:00Z").getTime();

export function isWithinWalletDateRange(
  iso: string,
  range: WalletDateRange,
  customStart?: string,
  customEnd?: string
): boolean {
  if (range === "all" || !iso) return true;
  const ts = new Date(iso).getTime();
  if (isNaN(ts)) return true;

  if (range === "custom") {
    const startOk = customStart ? ts >= new Date(customStart).getTime() : true;
    const endOk = customEnd ? ts <= new Date(customEnd + "T23:59:59Z").getTime() : true;
    return startOk && endOk;
  }

  const dayMs = 86400000;
  let win = 30 * dayMs;
  if (range === "today") win = dayMs;
  else if (range === "7d") win = 7 * dayMs;
  else if (range === "30d") win = 30 * dayMs;
  else if (range === "90d") win = 90 * dayMs;

  return REFERENCE_NOW_MS - ts <= win;
}

// Build User Wallets directly from User Management Records (strictly separate Gift Coins vs Connection Points)
export function loadUserWalletSummaries(): UserWalletSummary[] {
  const users = loadUsersFromStorage();
  return users.map((u) => {
    const isRestricted = u.status === "suspended" || u.status === "banned";
    return {
      userId: u.id,
      name: u.name,
      username: u.username,
      email: u.email,
      avatar: u.avatar,
      accountStatus: u.status,
      registrationDate: u.registrationDate,
      giftCoinsBalance: u.wallet.giftCoins,
      giftCoinsPurchasedTotal: u.wallet.giftCoinsPurchasedTotal,
      giftCoinsSpentTotal: u.wallet.giftCoinsSpentTotal,
      giftsReceivedCoinValue: u.wallet.giftsReceivedTotal,
      connectionPointsBalance: u.wallet.connectionPoints,
      connectionPointsEarnedReferrals: u.wallet.connectionPointsReferrals,
      connectionPointsRedeemedTotal: u.wallet.connectionPointsSpent,
      connectionPointsAdjustedTotal: u.wallet.connectionPointsAdjusted,
      walletStatus: u.status === "banned" ? "frozen_review" : isRestricted ? "restricted" : "active",
      lastTransactionAt: u.lastActive,
    };
  });
}

// Build Unified Multi-Category Transaction Stream (without modifying or combining quantities)
export function buildAllFinancialTransactions(): UnifiedFinancialTransaction[] {
  const giftPurchases = loadGiftCoinPurchases();
  const liveGifts = loadLiveGifts();
  const cpRewards = loadConnectionPointsRewards();
  const cpRedemptions = loadConnectionPointsRedemptions();
  const subTransactions = loadSubscriptionTransactions();
  const adjustmentTxs = loadWalletAdjustmentTransactions();

  const unified: UnifiedFinancialTransaction[] = [...adjustmentTxs];

  // 1. Gift Coin Purchases
  giftPurchases.forEach((p) => {
    unified.push({
      id: p.id,
      category: "gift_coins",
      transactionType: "gift_coin_purchase",
      title: `Gift Coins — ${p.packageName} (${p.totalCoins.toLocaleString()} Coins)`,
      userId: p.userId,
      userName: p.userName,
      username: p.username,
      userAvatar: p.userAvatar,
      isMonetary: true,
      fiatAmount: p.purchaseAmount,
      fiatCurrency: p.currency,
      fiatSymbol: p.currencySymbol,
      virtualQuantity: p.totalCoins,
      virtualUnit: "COINS",
      direction: "credit",
      previousBalance: p.previousCoinBalance,
      newBalance: p.newCoinBalance,
      referenceId: p.paymentReference,
      relatedServiceLabel: "Wallet Storefront IAP",
      paymentProviderLabel:
        p.paymentProvider === "apple_app_store"
          ? "Apple App Store"
          : p.paymentProvider === "google_play_store"
          ? "Google Play Store"
          : "Web Card Gateway",
      maskedPaymentMethod: p.maskedPaymentMethod,
      timestamp: p.timestamp,
      status: p.status,
      notes: p.failureReason,
    });
  });

  // 2. Live Gift Sending Records (strictly non-cash coin circulation)
  liveGifts.forEach((g) => {
    unified.push({
      id: g.id,
      category: "gift_coins",
      transactionType: "gift_sent",
      title: `Sent ${g.giftName} to ${g.recipient.name}`,
      userId: g.sender.id,
      userName: g.sender.name,
      username: g.sender.username,
      userAvatar: g.sender.avatar,
      isMonetary: false,
      virtualQuantity: g.coinAmount,
      virtualUnit: "COINS",
      direction: "debit",
      referenceId: g.walletReference,
      relatedServiceLabel: `Live Stream: ${g.sessionTitle}`,
      relatedEntityId: g.sessionId,
      timestamp: g.timestamp,
      status: g.status === "disputed" ? "disputed" : "completed",
      notes: `Live Gift Recipient: ${g.recipient.name} (Non-cash gift reception activity).`,
    });
  });

  // 3. Connection Points Referral Rewards (Issued / Rejected / Pending)
  cpRewards
    .filter((r) => r.issuanceStatus === "issued" || r.issuanceStatus === "reversed" || r.issuanceStatus === "rejected")
    .forEach((r) => {
      unified.push({
        id: r.id,
        category: "connection_points",
        transactionType:
          r.issuanceStatus === "reversed" ? "connection_points_reversal" : "connection_points_referral",
        title: `Referral Reward (${r.referredUserName})`,
        userId: r.referrerUserId,
        userName: r.referrerName,
        username: r.referrerUsername,
        userAvatar: r.referrerAvatar,
        isMonetary: false,
        virtualQuantity: r.pointsAmount,
        virtualUnit: "POINTS",
        direction: r.issuanceStatus === "reversed" ? "debit" : "credit",
        referenceId: r.rewardTransactionRef || r.referralId,
        relatedServiceLabel: `NobleBond Invite & Earn (${r.referralCode})`,
        relatedEntityId: r.referralId,
        timestamp: r.issuedAt || r.createdAt,
        status:
          r.issuanceStatus === "issued"
            ? "completed"
            : r.issuanceStatus === "reversed"
            ? "reversed"
            : "failed",
        notes: r.notes,
      });
    });

  // 4. Connection Points Redemptions
  cpRedemptions.forEach((rdm) => {
    unified.push({
      id: rdm.id,
      category: "connection_points",
      transactionType: "connection_points_redemption",
      title: `Redeemed: ${rdm.perkTitle}`,
      userId: rdm.userId,
      userName: rdm.userName,
      username: rdm.username,
      userAvatar: rdm.userAvatar,
      isMonetary: false,
      virtualQuantity: rdm.pointsSpent,
      virtualUnit: "POINTS",
      direction: "debit",
      previousBalance: rdm.previousPointsBalance,
      newBalance: rdm.newPointsBalance,
      referenceId: rdm.relatedActivityRef,
      relatedServiceLabel: "Dating Perks Redemption",
      timestamp: rdm.timestamp,
      status: rdm.status === "reversed" ? "reversed" : "completed",
    });
  });

  // 5. Premium Subscription Transactions (Direct reference from Subscription Management)
  subTransactions.forEach((s) => {
    unified.push({
      id: s.id,
      category: "premium_subscription",
      transactionType:
        s.transactionType === "renewal"
          ? "premium_subscription_renewal"
          : s.status === "refunded"
          ? "premium_subscription_refund"
          : "premium_subscription_payment",
      title: `${s.planName} (${s.transactionType.replace(/_/g, " ")})`,
      userId: s.userId,
      userName: s.userName,
      username: s.username,
      userAvatar: s.userAvatar,
      isMonetary: true,
      fiatAmount: s.amount,
      fiatCurrency: s.currency,
      fiatSymbol: s.currencySymbol,
      direction: s.status === "refunded" ? "debit" : "credit",
      referenceId: s.invoiceRef,
      relatedServiceLabel: `Subscription ${s.subscriptionId}`,
      relatedEntityId: s.subscriptionId,
      paymentProviderLabel: s.paymentProvider,
      maskedPaymentMethod: s.maskedPaymentMethod,
      timestamp: s.timestamp,
      status:
        s.status === "successful"
          ? "completed"
          : s.status === "refunded" || s.status === "partially_refunded"
          ? "refunded"
          : s.status === "failed"
          ? "failed"
          : "pending",
      notes: s.failureReason || s.billingPeriodLabel,
    });
  });

  return unified.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Compute Strictly Separated KPIs across all 3 products
export function calculateWalletOverviewKPIs(
  dateRange: WalletDateRange = "all",
  customStart?: string,
  customEnd?: string
): WalletOverviewKpis {
  const wallets = loadUserWalletSummaries();
  const giftPurchases = loadGiftCoinPurchases().filter((p) =>
    isWithinWalletDateRange(p.timestamp, dateRange, customStart, customEnd)
  );
  const liveGifts = loadLiveGifts().filter((g) =>
    isWithinWalletDateRange(g.timestamp, dateRange, customStart, customEnd)
  );
  const cpRewards = loadConnectionPointsRewards().filter((r) =>
    isWithinWalletDateRange(r.createdAt, dateRange, customStart, customEnd)
  );
  const cpRedemptions = loadConnectionPointsRedemptions().filter((r) =>
    isWithinWalletDateRange(r.timestamp, dateRange, customStart, customEnd)
  );
  const subTxs = loadSubscriptionTransactions().filter((t) =>
    isWithinWalletDateRange(t.timestamp, dateRange, customStart, customEnd)
  );
  const adjustments = loadWalletAdjustmentTransactions().filter((a) =>
    isWithinWalletDateRange(a.timestamp, dateRange, customStart, customEnd)
  );

  // 1. Gift Coins KPIs (No double counting of host receipts as issued coins!)
  const successfulPurchases = giftPurchases.filter((p) => p.status === "completed");
  const totalCoinsPurchased = successfulPurchases.reduce((s, p) => s + p.totalCoins, 0);
  const totalGiftCoinPurchaseVolumeUsd = Number(
    successfulPurchases.reduce((s, p) => s + p.purchaseAmount, 0).toFixed(2)
  );
  const totalCoinsCirculating = wallets.reduce((s, w) => s + w.giftCoinsBalance, 0);
  const totalCoinsSpent = liveGifts
    .filter((g) => g.status === "completed")
    .reduce((s, g) => s + g.coinAmount, 0);
  const totalCoinsReceivedByHosts = wallets.reduce((s, w) => s + w.giftsReceivedCoinValue, 0);
  const giftAdjustCount = adjustments.filter((a) => a.category === "gift_coins").length;
  const totalGiftCoinTxCount = giftPurchases.length + liveGifts.length + giftAdjustCount;
  const failedGiftCoinPurchasesCount = giftPurchases.filter((p) => p.status === "failed").length;

  // 2. Connection Points KPIs
  const issuedRewards = cpRewards.filter((r) => r.issuanceStatus === "issued");
  const totalReferralRewardsIssuedPoints = issuedRewards.reduce((s, r) => s + r.pointsAmount, 0);
  const cpCreditAdjustments = adjustments
    .filter((a) => a.category === "connection_points" && a.direction === "credit")
    .reduce((s, a) => s + (a.virtualQuantity || 0), 0);
  const totalPointsIssued = totalReferralRewardsIssuedPoints + cpCreditAdjustments + wallets.reduce((s, w) => s + w.connectionPointsEarnedReferrals, 0);
  const totalPointsCirculating = wallets.reduce((s, w) => s + w.connectionPointsBalance, 0);
  const totalPointsRedeemed = cpRedemptions.reduce((s, r) => s + r.pointsSpent, 0);
  const pendingEligibleRewardsCount = cpRewards.filter(
    (r) => r.issuanceStatus === "pending" || r.issuanceStatus === "eligible"
  ).length;
  const rejectedRewardClaimsCount = cpRewards.filter((r) => r.issuanceStatus === "rejected").length;

  // 3. Premium Subscription Financial KPIs (Real money only)
  const totalPremiumTxCount = subTxs.length;
  const successfulSubTxs = subTxs.filter((t) => t.status === "successful");
  const pendingSubTxs = subTxs.filter((t) => t.status === "pending" || t.status === "processing");
  const failedSubTxs = subTxs.filter((t) => t.status === "failed");
  const refundSubTxs = subTxs.filter((t) => t.status === "refunded" || t.status === "partially_refunded");

  const grossPremiumRevenueUsd = Number(
    subTxs
      .filter((t) => t.status === "successful" || t.status === "refunded" || t.status === "partially_refunded")
      .reduce((s, t) => s + t.amount, 0)
      .toFixed(2)
  );
  const refundedPremiumUsd = Number(
    refundSubTxs.reduce((s, t) => s + (t.refundedAmount || t.amount), 0).toFixed(2)
  );
  const netPremiumRevenueUsd = Number(
    Math.max(0, grossPremiumRevenueUsd - refundedPremiumUsd).toFixed(2)
  );
  const premiumPaymentSuccessRate =
    totalPremiumTxCount > 0
      ? Number(((successfulSubTxs.length / totalPremiumTxCount) * 100).toFixed(1))
      : 100;

  return {
    totalCoinsPurchased,
    totalCoinsCirculating,
    totalCoinsSpent,
    totalCoinsReceivedByHosts,
    totalGiftCoinTxCount,
    failedGiftCoinPurchasesCount,
    totalGiftCoinPurchaseVolumeUsd,
    totalPointsIssued,
    totalPointsCirculating,
    totalPointsRedeemed,
    totalReferralRewardsIssuedPoints,
    pendingEligibleRewardsCount,
    rejectedRewardClaimsCount,
    totalPremiumTxCount,
    successfulPremiumPaymentsCount: successfulSubTxs.length,
    pendingPremiumPaymentsCount: pendingSubTxs.length,
    failedPremiumPaymentsCount: failedSubTxs.length,
    premiumRefundsCount: refundSubTxs.length,
    grossPremiumRevenueUsd,
    refundedPremiumUsd,
    netPremiumRevenueUsd,
    premiumPaymentSuccessRate,
  };
}

// Generate Dynamic Financial Alerts from live inconsistencies
export function buildFinancialAlerts(): FinancialAlertItem[] {
  const alerts: FinancialAlertItem[] = [];
  const giftPurchases = loadGiftCoinPurchases();
  const rewards = loadConnectionPointsRewards();
  const recs = loadReconciliationCases();
  const subTxs = loadSubscriptionTransactions();

  giftPurchases
    .filter((p) => p.status === "failed" || p.status === "pending")
    .forEach((p) => {
      alerts.push({
        id: `alrt_${p.id}`,
        category: "gift_coins",
        severity: p.status === "failed" ? "error" : "warning",
        title:
          p.status === "failed"
            ? `Failed Gift Coin Purchase (${p.id})`
            : `Pending Apple StoreKit Receipt (${p.id})`,
        description: `${p.userName} (${p.packageName} - $${p.purchaseAmount}): ${p.failureReason || "Awaiting provider confirmation before wallet credit."}`,
        relatedRef: p.id,
        targetTab: "gift_coins",
        timestamp: p.timestamp,
      });
    });

  rewards
    .filter((r) => r.issuanceStatus === "eligible" || r.isDuplicateOrFraud)
    .forEach((r) => {
      alerts.push({
        id: `alrt_${r.id}`,
        category: "connection_points",
        severity: r.isDuplicateOrFraud ? "error" : "info",
        title: r.isDuplicateOrFraud
          ? `Blocked Fraudulent Self-Referral (${r.id})`
          : `Eligible Referral Reward Ready (${r.id})`,
        description: r.notes || `${r.referrerName}: ${r.pointsAmount} Pts verification status`,
        relatedRef: r.id,
        targetTab: "rewards_issuance",
        timestamp: r.createdAt,
      });
    });

  subTxs
    .filter((t) => t.status === "failed")
    .forEach((t) => {
      alerts.push({
        id: `alrt_${t.id}`,
        category: "premium_subscription",
        severity: "error",
        title: `Failed Premium Renewal (${t.id})`,
        description: `${t.userName} (${t.planName} $${t.amount}): ${t.failureReason || t.failureCode}`,
        relatedRef: t.id,
        targetTab: "premium_transactions",
        timestamp: t.timestamp,
      });
    });

  recs
    .filter((r) => r.status === "mismatch" || r.status === "escalated")
    .forEach((r) => {
      alerts.push({
        id: `alrt_${r.id}`,
        category: r.category,
        severity: "warning",
        title: `Reconciliation Discrepancy (${r.id})`,
        description: `${r.transactionRef}: ${r.differenceSummary}`,
        relatedRef: r.id,
        targetTab: "reconciliation",
        timestamp: r.detectedAt,
      });
    });

  return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Filtering & Sorting All Unified Transactions
export function filterAndSortTransactions(
  txs: UnifiedFinancialTransaction[],
  filters: WalletFilterState,
  sort: WalletSortCriteria
): UnifiedFinancialTransaction[] {
  let result = [...txs];

  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.userName.toLowerCase().includes(q) ||
        t.username.toLowerCase().includes(q) ||
        t.referenceId.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q)
    );
  }

  if (filters.category !== "all") {
    result = result.filter((t) => t.category === filters.category);
  }
  if (filters.transactionType !== "all") {
    result = result.filter((t) => t.transactionType === filters.transactionType);
  }
  if (filters.status !== "all") {
    result = result.filter((t) => t.status === filters.status);
  }
  if (filters.currency !== "all") {
    if (filters.currency === "USD") {
      result = result.filter((t) => t.isMonetary);
    } else if (filters.currency === "COINS") {
      result = result.filter((t) => t.virtualUnit === "COINS");
    } else if (filters.currency === "POINTS") {
      result = result.filter((t) => t.virtualUnit === "POINTS");
    }
  }
  if (filters.dateRange !== "all") {
    result = result.filter((t) =>
      isWithinWalletDateRange(t.timestamp, filters.dateRange, filters.customStartDate, filters.customEndDate)
    );
  }

  result.sort((a, b) => {
    if (sort.field === "oldest") {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
    if (sort.field === "amount_desc") {
      const va = a.fiatAmount || a.virtualQuantity || 0;
      const vb = b.fiatAmount || b.virtualQuantity || 0;
      return sort.direction === "asc" ? va - vb : vb - va;
    }
    if (sort.field === "status") {
      return sort.direction === "asc"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return result;
}

function appendWalletAuditEvent(
  event: Omit<WalletAuditEvent, "id" | "timestamp">
): WalletAuditEvent[] {
  const existing = loadWalletAuditHistory();
  const next: WalletAuditEvent = {
    id: `AUD-FIN-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    ...event,
  };
  const updated = [next, ...existing];
  saveWalletAuditHistory(updated);
  return updated;
}

// Ledger-Based Wallet Adjustment (Strictly separate Gift Coins vs Connection Points; syncs to User Management)
export function executeLedgerAdjustment(
  params: {
    userId: string;
    walletType: "gift_coins" | "connection_points";
    adjustmentType: "credit" | "debit" | "reversal";
    quantity: number;
    reason: string;
    relatedReference?: string;
  },
  adminName: string,
  adminRole: string
): {
  success: boolean;
  error?: string;
  audit?: WalletAuditEvent[];
} {
  const users = loadUsersFromStorage();
  const user = users.find((u) => u.id === params.userId);
  if (!user) return { success: false, error: "Member account not found." };
  if (params.quantity <= 0 || isNaN(params.quantity)) {
    return { success: false, error: "Quantity must be greater than zero." };
  }
  if (!params.reason.trim()) {
    return { success: false, error: "Mandatory audit reason is required." };
  }

  const isDebit = params.adjustmentType === "debit" || params.adjustmentType === "reversal";
  const signedDelta = isDebit ? -Math.abs(params.quantity) : Math.abs(params.quantity);

  const prevBal =
    params.walletType === "gift_coins" ? user.wallet.giftCoins : user.wallet.connectionPoints;

  if (isDebit && prevBal < params.quantity) {
    return {
      success: false,
      error: `Insufficient ${params.walletType === "gift_coins" ? "Gift Coins" : "Connection Points"} balance (${prevBal} available) for debit of ${params.quantity}.`,
    };
  }

  const ref =
    params.relatedReference?.trim() ||
    `LEDGER-${params.walletType === "gift_coins" ? "GC" : "CP"}-${Date.now().toString().slice(-5)}`;

  // 1. Update User Management Persistent Wallet Record
  const updatedUser =
    params.walletType === "gift_coins"
      ? grantGiftCoins(user.id, signedDelta, params.reason.trim(), ref)
      : grantConnectionPoints(user.id, signedDelta, params.reason.trim(), ref);

  const newBal =
    params.walletType === "gift_coins"
      ? updatedUser?.wallet.giftCoins ?? Math.max(0, prevBal + signedDelta)
      : updatedUser?.wallet.connectionPoints ?? Math.max(0, prevBal + signedDelta);

  // 2. Append Immutable Financial Ledger Transaction
  const existingAdj = loadWalletAdjustmentTransactions();
  const unit = params.walletType === "gift_coins" ? "COINS" : "POINTS";
  const newTx: UnifiedFinancialTransaction = {
    id: `ADJ-${Date.now().toString().slice(-5)}`,
    category: params.walletType,
    transactionType:
      params.adjustmentType === "reversal"
        ? params.walletType === "gift_coins"
          ? "gift_coin_reversal"
          : "connection_points_reversal"
        : params.walletType === "gift_coins"
        ? "gift_coin_adjustment"
        : "connection_points_adjustment",
    title: `${params.adjustmentType === "reversal" ? "Reversal" : isDebit ? "Debit Adjustment" : "Credit Adjustment"}: ${signedDelta > 0 ? "+" : ""}${signedDelta} ${unit === "COINS" ? "Coins" : "Pts"}`,
    userId: user.id,
    userName: user.name,
    username: user.username,
    userAvatar: user.avatar,
    isMonetary: false,
    virtualQuantity: Math.abs(params.quantity),
    virtualUnit: unit,
    direction: isDebit ? "debit" : "credit",
    previousBalance: prevBal,
    newBalance: newBal,
    referenceId: ref,
    relatedServiceLabel: "Admin Financial Adjustment Ledger",
    timestamp: new Date().toISOString(),
    status: params.adjustmentType === "reversal" ? "reversed" : "completed",
    notes: `${params.reason.trim()} (Authorized by ${adminName})`,
  };
  saveWalletAdjustmentTransactions([newTx, ...existingAdj]);

  // 3. Append Financial Audit History
  const actionType =
    params.adjustmentType === "reversal"
      ? params.walletType === "gift_coins"
        ? "gift_coin_tx_reversed"
        : "referral_reward_reversed"
      : params.walletType === "gift_coins"
      ? isDebit
        ? "gift_coins_debited"
        : "gift_coins_credited"
      : isDebit
      ? "connection_points_debited"
      : "connection_points_credited";

  const audit = appendWalletAuditEvent({
    adminName,
    adminRole,
    actionType,
    userId: user.id,
    userName: user.name,
    walletType: params.walletType,
    amountOrQuantityDisplay: `${signedDelta > 0 ? "+" : ""}${signedDelta} ${unit === "COINS" ? "Gift Coins" : "Connection Points"}`,
    previousBalance: `${prevBal.toLocaleString()} ${unit === "COINS" ? "Coins" : "Pts"}`,
    newBalance: `${newBal.toLocaleString()} ${unit === "COINS" ? "Coins" : "Pts"}`,
    reason: params.reason.trim(),
    relatedTransactionId: newTx.id,
  });

  return { success: true, audit };
}

// Strict Referral Reward Validation & Issuance Workflow
export function processReferralRewardAction(
  rewardId: string,
  action: "issue" | "reject" | "reverse",
  notes: string,
  adminName: string,
  adminRole: string
): {
  success: boolean;
  error?: string;
  rewards?: ConnectionPointsRewardRecord[];
  audit?: WalletAuditEvent[];
} {
  const rewards = loadConnectionPointsRewards();
  const target = rewards.find((r) => r.id === rewardId);
  if (!target) return { success: false, error: "Reward record not found." };

  if (action === "issue") {
    if (target.isSelfReferral) {
      return { success: false, error: "Validation Blocked: Self-referrals are strictly prohibited." };
    }
    if (target.isDuplicateOrFraud) {
      return { success: false, error: "Validation Blocked: Duplicate or fraudulent referral flag detected." };
    }
    if (target.verificationStatus === "unverified") {
      return {
        success: false,
        error: "Validation Blocked: Referred user must verify email or phone OTP before points can be issued.",
      };
    }
    if (target.issuanceStatus === "issued") {
      return {
        success: false,
        error: "Duplicate Protection: Reward already credited for this referral.",
      };
    }

    const users = loadUsersFromStorage();
    const referrer = users.find((u) => u.id === target.referrerUserId);
    const prevPts = referrer?.wallet.connectionPoints ?? 0;

    grantConnectionPoints(
      target.referrerUserId,
      target.pointsAmount,
      `Qualified referral reward (${target.referredUserName}): ${notes}`,
      `REF-RWD-${target.id}`
    );

    const now = new Date().toISOString();
    const txRef = `NB-REF-${target.id}`;
    const updated = rewards.map((r) =>
      r.id === rewardId
        ? {
            ...r,
            issuanceStatus: "issued" as const,
            issuedAt: now,
            rewardTransactionRef: txRef,
            notes,
          }
        : r
    );
    saveConnectionPointsRewards(updated);

    const audit = appendWalletAuditEvent({
      adminName,
      adminRole,
      actionType: "referral_reward_issued",
      userId: target.referrerUserId,
      userName: target.referrerName,
      walletType: "connection_points",
      amountOrQuantityDisplay: `+${target.pointsAmount} Connection Points`,
      previousBalance: `${prevPts} Pts`,
      newBalance: `${prevPts + target.pointsAmount} Pts`,
      reason: notes,
      relatedTransactionId: txRef,
    });

    return { success: true, rewards: updated, audit };
  }

  if (action === "reject") {
    const updated = rewards.map((r) =>
      r.id === rewardId
        ? { ...r, issuanceStatus: "rejected" as const, notes }
        : r
    );
    saveConnectionPointsRewards(updated);
    const audit = appendWalletAuditEvent({
      adminName,
      adminRole,
      actionType: "referral_reward_rejected",
      userId: target.referrerUserId,
      userName: target.referrerName,
      walletType: "connection_points",
      amountOrQuantityDisplay: `0 Pts (Rejected ${target.pointsAmount} Pts)`,
      previousBalance: "Unchanged",
      newBalance: "Unchanged",
      reason: notes,
      relatedTransactionId: target.id,
    });
    return { success: true, rewards: updated, audit };
  }

  // Reverse previously issued reward
  if (target.issuanceStatus !== "issued") {
    return { success: false, error: "Only issued rewards can be reversed." };
  }

  const users = loadUsersFromStorage();
  const referrer = users.find((u) => u.id === target.referrerUserId);
  const prevPts = referrer?.wallet.connectionPoints ?? 0;
  grantConnectionPoints(
    target.referrerUserId,
    -target.pointsAmount,
    `Reversal of referral reward ${target.id}: ${notes}`,
    `REV-${target.id}`
  );

  const updated = rewards.map((r) =>
    r.id === rewardId
      ? { ...r, issuanceStatus: "reversed" as const, notes: `[REVERSED] ${notes}` }
      : r
  );
  saveConnectionPointsRewards(updated);

  const audit = appendWalletAuditEvent({
    adminName,
    adminRole,
    actionType: "referral_reward_reversed",
    userId: target.referrerUserId,
    userName: target.referrerName,
    walletType: "connection_points",
    amountOrQuantityDisplay: `-${target.pointsAmount} Connection Points`,
    previousBalance: `${prevPts} Pts`,
    newBalance: `${Math.max(0, prevPts - target.pointsAmount)} Pts`,
    reason: notes,
    relatedTransactionId: target.id,
  });

  return { success: true, rewards: updated, audit };
}

export function updateReconciliationCaseStatus(
  caseId: string,
  newStatus: ReconciliationStatus,
  notes: string,
  adminName: string,
  adminRole: string
): { cases: ReconciliationCaseRecord[]; audit: WalletAuditEvent[] } {
  const cases = loadReconciliationCases();
  const target = cases.find((c) => c.id === caseId);
  const updated = cases.map((c) =>
    c.id === caseId
      ? {
          ...c,
          status: newStatus,
          investigatedBy: adminName,
          investigationNotes: notes,
        }
      : c
  );
  saveReconciliationCases(updated);

  const audit = appendWalletAuditEvent({
    adminName,
    adminRole,
    actionType: "reconciliation_updated",
    userId: "reconciliation",
    userName: target?.transactionRef || caseId,
    walletType: target?.category || "gift_coins",
    amountOrQuantityDisplay: `Status -> ${newStatus.toUpperCase()}`,
    previousBalance: target?.status || "pending_review",
    newBalance: newStatus,
    reason: notes,
    relatedTransactionId: caseId,
  });

  return { cases: updated, audit };
}

export function updateConfigurableReferralPoints(
  points: number,
  reason: string,
  adminName: string,
  adminRole: string
): { points: number; audit: WalletAuditEvent[] } {
  const prev = loadReferralRewardAmount();
  saveReferralRewardAmount(points);
  const audit = appendWalletAuditEvent({
    adminName,
    adminRole,
    actionType: "referral_config_updated",
    userId: "system",
    userName: "Invite & Earn Config",
    walletType: "system_config",
    amountOrQuantityDisplay: `${points} Connection Points`,
    previousBalance: `${prev} Pts`,
    newBalance: `${points} Pts`,
    reason,
    relatedTransactionId: `CFG-REF-${Date.now().toString().slice(-4)}`,
  });
  return { points, audit };
}

export function resetWalletManagementData(): void {
  localStorage.setItem(STORAGE_KEYS.GIFT_PURCHASES, JSON.stringify(INITIAL_GIFT_PURCHASES));
  localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(INITIAL_CP_REWARDS));
  localStorage.setItem(STORAGE_KEYS.REDEMPTIONS, JSON.stringify(INITIAL_CP_REDEMPTIONS));
  localStorage.setItem(STORAGE_KEYS.ADJUSTMENT_TXS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.RECONCILIATION, JSON.stringify(INITIAL_RECONCILIATION));
  localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(INITIAL_AUDIT));
  localStorage.setItem(STORAGE_KEYS.REFERRAL_REWARD_CONFIG, JSON.stringify(50));
}

// CSV Export Utility
function triggerCsv(filename: string, headers: string[], rows: Array<Array<string | number>>) {
  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportUnifiedTransactionsCsv(txs: UnifiedFinancialTransaction[]): void {
  triggerCsv(
    `noblebond_financial_transactions_${new Date().toISOString().slice(0, 10)}.csv`,
    ["Transaction ID", "Category", "Type", "Member", "Username", "Fiat Amount", "Virtual Quantity", "Unit", "Reference ID", "Service", "Date", "Status"],
    txs.map((t) => [
      t.id,
      t.category,
      t.transactionType,
      t.userName,
      t.username,
      t.isMonetary && t.fiatAmount !== undefined ? `${t.fiatSymbol || "$"}${t.fiatAmount.toFixed(2)}` : "-",
      t.virtualQuantity ?? "-",
      t.virtualUnit || t.fiatCurrency || "",
      t.referenceId,
      t.relatedServiceLabel,
      t.timestamp,
      t.status,
    ])
  );
}

export function exportUserWalletsCsv(wallets: UserWalletSummary[]): void {
  triggerCsv(
    `noblebond_user_wallets_${new Date().toISOString().slice(0, 10)}.csv`,
    ["User ID", "Full Name", "Username", "Email", "Gift Coins Balance", "Connection Points Balance", "Coins Purchased", "Coins Spent", "Gifts Received Value", "Points Referrals", "Points Redeemed", "Wallet Status"],
    wallets.map((w) => [
      w.userId,
      w.name,
      w.username,
      w.email,
      w.giftCoinsBalance,
      w.connectionPointsBalance,
      w.giftCoinsPurchasedTotal,
      w.giftCoinsSpentTotal,
      w.giftsReceivedCoinValue,
      w.connectionPointsEarnedReferrals,
      w.connectionPointsRedeemedTotal,
      w.walletStatus,
    ])
  );
}

export function exportWalletAuditCsv(events: WalletAuditEvent[]): void {
  triggerCsv(
    `noblebond_financial_audit_${new Date().toISOString().slice(0, 10)}.csv`,
    ["Event ID", "Administrator", "Role", "Action", "Member", "Wallet Type", "Amount / Qty", "Previous Balance", "New Balance", "Reason", "Related TX", "Timestamp"],
    events.map((e) => [
      e.id,
      e.adminName,
      e.adminRole,
      e.actionType,
      e.userName,
      e.walletType,
      e.amountOrQuantityDisplay,
      e.previousBalance,
      e.newBalance,
      e.reason,
      e.relatedTransactionId,
      e.timestamp,
    ])
  );
}

