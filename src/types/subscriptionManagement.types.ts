// NobleBond Admin — Subscription Management Type Definitions
// Strictly aligned with NobleBond Mobile Premium configuration, zero emojis, zero Gift Coins / Connection Points mixing

export type SubscriptionTabKey =
  | "overview"
  | "plans"
  | "subscriptions"
  | "subscribers"
  | "payments"
  | "renewals"
  | "failed_payments"
  | "refunds"
  | "entitlements"
  | "analytics"
  | "audit_history";

export type BillingInterval = "monthly" | "6_months" | "annual" | "weekly";

export type PlanStatus = "active" | "inactive" | "archived" | "draft";

export type SubscriptionStatus =
  | "active"
  | "pending"
  | "past_due"
  | "grace_period"
  | "paused"
  | "cancellation_scheduled"
  | "cancelled"
  | "expired"
  | "refunded"
  | "payment_failed";

export type PaymentProvider =
  | "stripe_web"
  | "apple_app_store"
  | "google_play_store"
  | "paypal"
  | "admin_complimentary";

export type PaymentMethodCategory =
  | "card"
  | "apple_pay"
  | "google_pay"
  | "paypal"
  | "app_store_iap"
  | "play_store_iap"
  | "complimentary";

export type TransactionStatus =
  | "successful"
  | "pending"
  | "processing"
  | "failed"
  | "cancelled"
  | "refunded"
  | "partially_refunded";

export type RetryStatus =
  | "none"
  | "retry_pending"
  | "retry_scheduled"
  | "retry_succeeded"
  | "retry_exhausted"
  | "manual_action_required";

export type RefundDisputeStatus =
  | "requested"
  | "under_review"
  | "approved"
  | "rejected"
  | "processing"
  | "completed"
  | "failed";

export type EntitlementKey =
  | "unlimitedLikes"
  | "seeWhoLikesYou"
  | "verifiedBadge"
  | "premiumSupport"
  | "videoAudioCalls"
  | "globalPassport";

export type SubscriptionDateRange = "all" | "today" | "7d" | "30d" | "90d" | "custom";

export type AdminRoleKey =
  | "super_admin"
  | "billing_operations_lead"
  | "customer_support_agent"
  | "finance_auditor";

export interface AdminRolePermissions {
  role: AdminRoleKey;
  roleLabel: string;
  canViewSubscriptionData: boolean;
  canViewBillingRecords: boolean;
  canManagePlans: boolean;
  canChangePricing: boolean;
  canGrantComplimentary: boolean;
  canRevokeComplimentary: boolean;
  canReviewRefunds: boolean;
  canProcessRefunds: boolean;
  canManageEntitlements: boolean;
  canViewFinancialAnalytics: boolean;
  canViewAuditHistory: boolean;
}

export interface SubscriptionPlanConfig {
  id: string; // matches mobile PlanId ("12-months", "6-months", "1-month", or custom/legacy)
  identifier: string; // e.g. "nb_premium_12m"
  name: string;
  description: string;
  billingInterval: BillingInterval;
  durationMonths: number;
  durationDays?: number;
  price: number; // total price billed per cycle
  monthlyEquivalent: number;
  originalPrice?: number;
  discountPercent?: number;
  discountTag?: string;
  currency: string;
  currencySymbol: string;
  availableRegions: string[]; // e.g. ["Global", "Nigeria", "United States", "United Kingdom", "EU"]
  status: PlanStatus;
  visibleInMobileApp: boolean;
  displayOrder: number;
  isMostPopular: boolean;
  entitlementKeys: EntitlementKey[];
  eligibilityNote: string;
  effectiveDate: string;
  createdAt: string;
  updatedAt: string;
  pendingPriceChange?: {
    newPrice: number;
    effectiveDate: string;
    note: string;
  };
}

export interface SubscriptionTimelineEvent {
  id: string;
  timestamp: string;
  eventType:
    | "subscription_created"
    | "checkout_initiated"
    | "payment_authorized"
    | "subscription_activated"
    | "renewal_completed"
    | "plan_changed"
    | "payment_failed"
    | "cancellation_requested"
    | "cancellation_effective"
    | "subscription_expired"
    | "refund_issued"
    | "premium_access_restored"
    | "complimentary_granted"
    | "complimentary_revoked";
  title: string;
  description: string;
  actor: string;
}

export interface SubscriptionRecord {
  id: string; // e.g. "SUB-7001"
  userId: string;
  profileId: string;
  userName: string;
  username: string;
  email: string;
  phone?: string;
  avatar: string;
  country: string;
  countryCode: string;
  city: string;
  accountStatus: string;
  verificationStatus: string;
  registrationDate: string;

  planId: string;
  planName: string;
  agreedPrice: number; // existing subscriber's agreed billing amount
  currency: string;
  currencySymbol: string;
  billingInterval: BillingInterval;

  startDate: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  nextRenewalDate: string | null;
  expiryDate: string | null;
  cancellationDate?: string | null;
  cancellationEffectiveDate?: string | null;
  cancellationReason?: string;
  cancellationType?: "user_requested_end_of_period" | "immediate_provider" | "admin_revoked" | "non_renewal";

  paymentProvider: PaymentProvider;
  providerSubscriptionRef: string;
  maskedPaymentMethod: string;

  status: SubscriptionStatus;
  autoRenew: boolean;
  isComplimentary: boolean;
  complimentaryReason?: string;
  complimentaryGrantedBy?: string;

  timeline: SubscriptionTimelineEvent[];
}

export interface SubscriptionTransactionRecord {
  id: string; // e.g. "TXN-SUB-9101"
  invoiceRef: string; // e.g. "INV-2026-8841"
  subscriptionId: string;
  userId: string;
  userName: string;
  username: string;
  userEmail: string;
  userAvatar: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  currencySymbol: string;
  billingPeriodLabel: string;
  transactionType: "initial_purchase" | "renewal" | "plan_upgrade" | "refund";

  paymentProvider: PaymentProvider;
  paymentMethodCategory: PaymentMethodCategory;
  maskedPaymentMethod: string; // Safe metadata only (e.g., "Visa •••• 8821", "Apple Pay")
  providerReference: string;

  timestamp: string;
  status: TransactionStatus;

  // Failed payment metadata (only when status === 'failed' or retry history exists)
  failureCode?: string;
  failureReason?: string;
  providerResponse?: string;
  retryStatus?: RetryStatus;
  retryCount?: number;
  lastRetryAt?: string;
  nextRetryScheduledAt?: string;

  refundedAmount?: number;
}

export interface SubscriptionRefundDisputeRecord {
  id: string; // e.g. "RFD-401" or "DSP-402"
  recordKind: "refund_request" | "payment_dispute";
  transactionId: string;
  subscriptionId: string;
  userId: string;
  userName: string;
  username: string;
  userAvatar: string;
  planName: string;
  originalAmount: number;
  requestedAmount: number;
  currency: string;
  currencySymbol: string;
  reason: string;
  requestedAt: string;
  paymentProvider: PaymentProvider;
  providerReference: string;
  status: RefundDisputeStatus;
  resolvedBy?: string;
  resolvedAt?: string;
  decisionNotes?: string;
  internalNotes: Array<{
    id: string;
    author: string;
    timestamp: string;
    text: string;
  }>;
  timeline: Array<{
    id: string;
    timestamp: string;
    label: string;
    actor: string;
  }>;
}

export interface SubscriptionEntitlementConfig {
  key: EntitlementKey;
  name: string;
  description: string;
  mobileFeatureKey: string;
  associatedPlanIds: string[];
  availability: "all_paid_plans" | "selected_plans" | "disabled";
  status: "active" | "restricted" | "deprecated";
  usageLimitLabel: string;
  updatedAt: string;
}

export interface SubscriptionAuditEvent {
  id: string; // e.g. "AUD-SUB-101"
  adminName: string;
  adminRole: string;
  actionType:
    | "plan_created"
    | "plan_updated"
    | "plan_activated"
    | "plan_deactivated"
    | "plan_archived"
    | "pricing_updated"
    | "subscription_adjusted"
    | "complimentary_granted"
    | "complimentary_extended"
    | "complimentary_revoked"
    | "refund_reviewed"
    | "refund_approved"
    | "refund_rejected"
    | "cancellation_reviewed"
    | "subscription_status_updated"
    | "entitlement_updated"
    | "payment_status_refreshed"
    | "staged_promo_saved";
  targetType: "plan" | "subscription" | "subscriber" | "refund" | "entitlement" | "transaction" | "promotion_draft";
  targetId: string;
  targetLabel: string;
  previousValue: string;
  newValue: string;
  reason: string;
  timestamp: string;
}

export interface StagedPromotionDraft {
  id: string;
  name: string;
  promoCode: string;
  discountType: "percentage" | "fixed_amount";
  discountValue: number;
  applicablePlanIds: string[];
  startDate: string;
  endDate: string;
  redemptionLimit: number;
  usageCount: number;
  regions: string[];
  status: "staged_inactive"; // Explicitly marked non-active until backend/mobile promo engine exists
  note: string;
}

export interface SubscriberSummaryRecord {
  userId: string;
  profileId: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  country: string;
  countryCode: string;
  city: string;
  accountStatus: string;
  verificationStatus: string;
  registrationDate: string;
  currentPlanId: string;
  currentPlanName: string;
  subscriptionId: string;
  subscriptionStatus: SubscriptionStatus;
  startDate: string;
  nextRenewalDate: string | null;
  totalSuccessfulPayments: number;
  lifetimeSubscriptionSpend: number;
  currency: string;
  isComplimentary: boolean;
  subscriptionsHistory: SubscriptionRecord[];
}

export interface SubscriptionStatsKpis {
  totalSubscribers: number;
  activePremiumSubscribers: number;
  complimentarySubscribers: number;
  newSubscribersInPeriod: number;
  cancelledSubscriptions: number;
  cancellationScheduledCount: number;
  expiredSubscriptions: number;
  pastDueSubscriptions: number;
  failedPaymentsCount: number;
  pendingRenewalsCount: number;
  grossSubscriptionRevenue: number;
  refundsTotal: number;
  netSubscriptionRevenue: number;
  mrr: number; // Strictly normalized paid recurring revenue
  arr: number; // MRR * 12
  churnRatePercent: number;
  renewalRatePercent: number;
  arpu: number;
  premiumConversionRatePercent: number;
  pendingRefundRequests: number;
}

export interface SubscriptionFilterState {
  searchQuery: string;
  status: "all" | SubscriptionStatus;
  planId: "all" | string;
  billingInterval: "all" | BillingInterval;
  currency: "all" | string;
  country: "all" | string;
  paymentProvider: "all" | PaymentProvider;
  autoRenew: "all" | "enabled" | "disabled";
  complimentaryFilter: "all" | "paid_only" | "complimentary_only";
  dateRange: SubscriptionDateRange;
  customStartDate?: string;
  customEndDate?: string;
}

export type SubscriptionSortField =
  | "newest"
  | "oldest"
  | "highest_price"
  | "next_renewal"
  | "status";

export interface SubscriptionSortCriteria {
  field: SubscriptionSortField;
  direction: "asc" | "desc";
}

