// NobleBond Admin — Wallet & Financial Management Type Definitions
// Enforces strict 3-product financial separation: Gift Coins, Connection Points, and Premium Subscriptions. Zero emojis.

export type WalletTabKey =
  | "overview"
  | "gift_coins"
  | "connection_points"
  | "premium_transactions"
  | "all_transactions"
  | "user_wallets"
  | "adjustments"
  | "rewards_issuance"
  | "reconciliation"
  | "analytics"
  | "audit_history";

export type FinancialCategory =
  | "gift_coins"
  | "connection_points"
  | "premium_subscription";

export type FinancialRoleKey =
  | "super_admin"
  | "financial_controller"
  | "rewards_manager"
  | "compliance_auditor";

export interface FinancialRolePermissions {
  role: FinancialRoleKey;
  roleLabel: string;
  canViewOverview: boolean;
  canViewGiftCoins: boolean;
  canViewConnectionPoints: boolean;
  canViewSubscriptions: boolean;
  canViewUserWallets: boolean;
  canIssueGiftCoins: boolean;
  canIssueConnectionPoints: boolean;
  canApproveAdjustments: boolean;
  canReverseTransactions: boolean;
  canReviewReconciliation: boolean;
  canViewAnalytics: boolean;
  canViewAuditHistory: boolean;
}

export type WalletDateRange = "all" | "today" | "7d" | "30d" | "90d" | "custom";

export type FinancialTxStatus =
  | "completed"
  | "pending"
  | "failed"
  | "refunded"
  | "reversed"
  | "disputed";

export interface GiftCoinPurchaseRecord {
  id: string; // e.g. "GCP-5001"
  userId: string;
  userName: string;
  username: string;
  userAvatar: string;
  packageId: string; // matches WALLET_CONFIG.GIFT_COIN_PACKAGES
  packageName: string;
  baseCoins: number;
  bonusCoins: number;
  totalCoins: number;
  purchaseAmount: number; // fiat USD
  currency: string;
  currencySymbol: string;
  paymentProvider: "apple_app_store" | "google_play_store" | "stripe_web";
  maskedPaymentMethod: string;
  paymentReference: string;
  timestamp: string;
  status: "completed" | "pending" | "failed" | "refunded" | "reversed";
  previousCoinBalance?: number;
  newCoinBalance?: number;
  failureReason?: string;
}

export type RewardIssuanceStatus =
  | "pending"
  | "eligible"
  | "issued"
  | "rejected"
  | "reversed";

export interface ConnectionPointsRewardRecord {
  id: string; // e.g. "RWD-3001"
  referralId: string;
  referrerUserId: string;
  referrerName: string;
  referrerUsername: string;
  referrerAvatar: string;
  referredUserId: string;
  referredUserName: string;
  referredUsername: string;
  referralCode: string;
  rewardSource: "successful_referral" | "verified_onboarding_check";
  verificationStatus: "verified_email" | "verified_phone" | "unverified";
  isSelfReferral: boolean;
  isDuplicateOrFraud: boolean;
  qualificationStatus: "qualified" | "awaiting_otp" | "ineligible_duplicate" | "ineligible_self_ref";
  pointsAmount: number;
  issuanceStatus: RewardIssuanceStatus;
  createdAt: string;
  qualifiedAt?: string;
  issuedAt?: string;
  rewardTransactionRef?: string;
  notes?: string;
}

export interface ConnectionPointsRedemptionRecord {
  id: string; // e.g. "RDM-6001"
  userId: string;
  userName: string;
  username: string;
  userAvatar: string;
  perkId: "additional_likes" | "super_likes" | "discovery_boost" | "profile_boost";
  perkTitle: string;
  pointsSpent: number;
  previousPointsBalance: number;
  newPointsBalance: number;
  relatedActivityRef: string;
  timestamp: string;
  status: "completed" | "reversed";
}

export interface UnifiedFinancialTransaction {
  id: string;
  category: FinancialCategory;
  transactionType:
    | "gift_coin_purchase"
    | "gift_sent"
    | "gift_received"
    | "gift_coin_adjustment"
    | "gift_coin_reversal"
    | "connection_points_referral"
    | "connection_points_redemption"
    | "connection_points_adjustment"
    | "connection_points_reversal"
    | "premium_subscription_payment"
    | "premium_subscription_renewal"
    | "premium_subscription_refund";
  title: string;
  userId: string;
  userName: string;
  username: string;
  userAvatar: string;
  // Financial Display Separation: Fiat vs Virtual Unit
  isMonetary: boolean;
  fiatAmount?: number;
  fiatCurrency?: string;
  fiatSymbol?: string;
  virtualQuantity?: number;
  virtualUnit?: "COINS" | "POINTS";
  direction: "credit" | "debit" | "neutral_activity";
  previousBalance?: number;
  newBalance?: number;
  referenceId: string;
  relatedServiceLabel: string;
  relatedEntityId?: string;
  paymentProviderLabel?: string;
  maskedPaymentMethod?: string;
  timestamp: string;
  status: FinancialTxStatus;
  notes?: string;
}

export interface UserWalletSummary {
  userId: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  accountStatus: string;
  registrationDate: string;
  giftCoinsBalance: number;
  giftCoinsPurchasedTotal: number;
  giftCoinsSpentTotal: number;
  giftsReceivedCoinValue: number; // Non-cash host gift reception metric
  connectionPointsBalance: number;
  connectionPointsEarnedReferrals: number;
  connectionPointsRedeemedTotal: number;
  connectionPointsAdjustedTotal: number;
  walletStatus: "active" | "restricted" | "frozen_review";
  lastTransactionAt: string;
}

export type ReconciliationStatus =
  | "matched"
  | "pending_review"
  | "mismatch"
  | "resolved"
  | "escalated";

export interface ReconciliationCaseRecord {
  id: string; // e.g. "REC-101"
  transactionRef: string;
  category: FinancialCategory;
  expectedResult: string;
  actualResult: string;
  differenceSummary: string;
  severity: "low" | "medium" | "high" | "critical";
  status: ReconciliationStatus;
  detectedAt: string;
  investigatedBy?: string;
  investigationNotes?: string;
}

export interface FinancialAlertItem {
  id: string;
  category: FinancialCategory;
  severity: "warning" | "error" | "info";
  title: string;
  description: string;
  relatedRef: string;
  targetTab: WalletTabKey;
  timestamp: string;
}

export interface WalletAuditEvent {
  id: string; // e.g. "AUD-FIN-801"
  adminName: string;
  adminRole: string;
  actionType:
    | "gift_coins_credited"
    | "gift_coins_debited"
    | "gift_coin_tx_reversed"
    | "connection_points_credited"
    | "connection_points_debited"
    | "referral_reward_issued"
    | "referral_reward_rejected"
    | "referral_reward_reversed"
    | "referral_config_updated"
    | "reconciliation_updated"
    | "adjustment_requested";
  userId: string;
  userName: string;
  walletType: "gift_coins" | "connection_points" | "premium_subscription" | "system_config";
  amountOrQuantityDisplay: string;
  previousBalance: string;
  newBalance: string;
  reason: string;
  relatedTransactionId: string;
  timestamp: string;
}

export interface WalletOverviewKpis {
  // 1. Gift Coins KPIs
  totalCoinsPurchased: number;
  totalCoinsCirculating: number;
  totalCoinsSpent: number;
  totalCoinsReceivedByHosts: number;
  totalGiftCoinTxCount: number;
  failedGiftCoinPurchasesCount: number;
  totalGiftCoinPurchaseVolumeUsd: number;

  // 2. Connection Points KPIs
  totalPointsIssued: number;
  totalPointsCirculating: number;
  totalPointsRedeemed: number;
  totalReferralRewardsIssuedPoints: number;
  pendingEligibleRewardsCount: number;
  rejectedRewardClaimsCount: number;

  // 3. Premium Subscription Financial KPIs
  totalPremiumTxCount: number;
  successfulPremiumPaymentsCount: number;
  pendingPremiumPaymentsCount: number;
  failedPremiumPaymentsCount: number;
  premiumRefundsCount: number;
  grossPremiumRevenueUsd: number;
  refundedPremiumUsd: number;
  netPremiumRevenueUsd: number;
  premiumPaymentSuccessRate: number;
}

export interface WalletFilterState {
  searchQuery: string;
  category: "all" | FinancialCategory;
  transactionType: "all" | string;
  status: "all" | FinancialTxStatus;
  currency: "all" | "USD" | "COINS" | "POINTS";
  dateRange: WalletDateRange;
  customStartDate?: string;
  customEndDate?: string;
}

export type WalletSortField = "newest" | "oldest" | "amount_desc" | "status";

export interface WalletSortCriteria {
  field: WalletSortField;
  direction: "asc" | "desc";
}

