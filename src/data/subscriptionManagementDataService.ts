// NobleBond Admin — Subscription Management Data Service & State Store
// Coherent local demonstration state synced with NobleBond mobile Premium config & User Management profiles.
// Zero emojis. Strict separation between Premium Subscriptions, Gift Coins, and Connection Points.

import type {
  SubscriptionPlanConfig,
  SubscriptionRecord,
  SubscriptionTransactionRecord,
  SubscriptionRefundDisputeRecord,
  SubscriptionEntitlementConfig,
  SubscriptionAuditEvent,
  StagedPromotionDraft,
  SubscriberSummaryRecord,
  SubscriptionStatsKpis,
  SubscriptionFilterState,
  SubscriptionSortCriteria,
  SubscriptionDateRange,
  AdminRoleKey,
  AdminRolePermissions,
  PlanStatus,
  SubscriptionStatus,
  RefundDisputeStatus,
  EntitlementKey,
  BillingInterval,
} from "../types/subscriptionManagement.types";
import { loadUsersFromStorage } from "./userManagementDataService";

const STORAGE_KEYS = {
  PLANS: "noblebond_admin_sub_plans_v1",
  SUBSCRIPTIONS: "noblebond_admin_subscriptions_v1",
  TRANSACTIONS: "noblebond_admin_sub_transactions_v1",
  REFUNDS: "noblebond_admin_sub_refunds_v1",
  ENTITLEMENTS: "noblebond_admin_sub_entitlements_v1",
  AUDIT: "noblebond_admin_sub_audit_v1",
  STAGED_PROMOS: "noblebond_admin_sub_promos_draft_v1",
};

// Role Permission Matrix (Prepared for backend RBAC enforcement)
export const ADMIN_ROLE_PERMISSIONS: Record<AdminRoleKey, AdminRolePermissions> = {
  super_admin: {
    role: "super_admin",
    roleLabel: "Super Administrator",
    canViewSubscriptionData: true,
    canViewBillingRecords: true,
    canManagePlans: true,
    canChangePricing: true,
    canGrantComplimentary: true,
    canRevokeComplimentary: true,
    canReviewRefunds: true,
    canProcessRefunds: true,
    canManageEntitlements: true,
    canViewFinancialAnalytics: true,
    canViewAuditHistory: true,
  },
  billing_operations_lead: {
    role: "billing_operations_lead",
    roleLabel: "Billing Operations Lead",
    canViewSubscriptionData: true,
    canViewBillingRecords: true,
    canManagePlans: true,
    canChangePricing: false, // Requires Super Admin sign-off
    canGrantComplimentary: true,
    canRevokeComplimentary: true,
    canReviewRefunds: true,
    canProcessRefunds: true,
    canManageEntitlements: true,
    canViewFinancialAnalytics: true,
    canViewAuditHistory: true,
  },
  customer_support_agent: {
    role: "customer_support_agent",
    roleLabel: "Member Support Specialist",
    canViewSubscriptionData: true,
    canViewBillingRecords: true,
    canManagePlans: false,
    canChangePricing: false,
    canGrantComplimentary: false,
    canRevokeComplimentary: false,
    canReviewRefunds: true,
    canProcessRefunds: false,
    canManageEntitlements: false,
    canViewFinancialAnalytics: false,
    canViewAuditHistory: true,
  },
  finance_auditor: {
    role: "finance_auditor",
    roleLabel: "Finance & Audit Analyst (Read-Only)",
    canViewSubscriptionData: true,
    canViewBillingRecords: true,
    canManagePlans: false,
    canChangePricing: false,
    canGrantComplimentary: false,
    canRevokeComplimentary: false,
    canReviewRefunds: false,
    canProcessRefunds: false,
    canManageEntitlements: false,
    canViewFinancialAnalytics: true,
    canViewAuditHistory: true,
  },
};

// Official NobleBond Premium Plans (Directly matching mobile app DEFAULT_SUBSCRIPTION_PLANS + legacy weekly archive)
const INITIAL_PLANS: SubscriptionPlanConfig[] = [
  {
    id: "12-months",
    identifier: "nb_premium_12m",
    name: "12 Months Premium",
    description:
      "Annual NobleBond Premium membership delivering maximum long-term value ($4.99/mo equivalent billed annually).",
    billingInterval: "annual",
    durationMonths: 12,
    price: 59.88,
    monthlyEquivalent: 4.99,
    originalPrice: 119.88,
    discountPercent: 50,
    discountTag: "Best value - Save 50%",
    currency: "USD",
    currencySymbol: "$",
    availableRegions: ["Global", "Nigeria", "United States", "United Kingdom", "Canada", "European Union", "Ghana"],
    status: "active",
    visibleInMobileApp: true,
    displayOrder: 1,
    isMostPopular: true,
    entitlementKeys: [
      "unlimitedLikes",
      "seeWhoLikesYou",
      "verifiedBadge",
      "premiumSupport",
      "videoAudioCalls",
      "globalPassport",
    ],
    eligibilityNote: "Open to all verified and unverified members age 18+ across supported billing stores.",
    effectiveDate: "2025-08-01T00:00:00Z",
    createdAt: "2025-08-01T09:00:00Z",
    updatedAt: "2026-10-15T11:30:00Z",
  },
  {
    id: "6-months",
    identifier: "nb_premium_6m",
    name: "6 Months Premium",
    description:
      "Semi-annual NobleBond Premium membership billed every 6 months ($6.99/mo equivalent).",
    billingInterval: "6_months",
    durationMonths: 6,
    price: 41.94,
    monthlyEquivalent: 6.99,
    originalPrice: 59.94,
    discountPercent: 33,
    discountTag: "Save 33%",
    currency: "USD",
    currencySymbol: "$",
    availableRegions: ["Global", "Nigeria", "United States", "United Kingdom", "Canada", "European Union", "Ghana"],
    status: "active",
    visibleInMobileApp: true,
    displayOrder: 2,
    isMostPopular: false,
    entitlementKeys: [
      "unlimitedLikes",
      "seeWhoLikesYou",
      "verifiedBadge",
      "premiumSupport",
      "videoAudioCalls",
      "globalPassport",
    ],
    eligibilityNote: "Open to all registered NobleBond members across iOS, Android, and Web Checkout.",
    effectiveDate: "2025-08-01T00:00:00Z",
    createdAt: "2025-08-01T09:00:00Z",
    updatedAt: "2026-09-20T14:10:00Z",
  },
  {
    id: "1-month",
    identifier: "nb_premium_1m",
    name: "1 Month Premium",
    description:
      "Flexible monthly NobleBond Premium subscription with cancel-anytime renewal.",
    billingInterval: "monthly",
    durationMonths: 1,
    price: 9.99,
    monthlyEquivalent: 9.99,
    discountTag: "Flexible plan",
    currency: "USD",
    currencySymbol: "$",
    availableRegions: ["Global", "Nigeria", "United States", "United Kingdom", "Canada", "European Union", "Ghana"],
    status: "active",
    visibleInMobileApp: true,
    displayOrder: 3,
    isMostPopular: false,
    entitlementKeys: [
      "unlimitedLikes",
      "seeWhoLikesYou",
      "verifiedBadge",
      "premiumSupport",
      "videoAudioCalls",
      "globalPassport",
    ],
    eligibilityNote: "Standard flexible monthly entry tier.",
    effectiveDate: "2025-08-01T00:00:00Z",
    createdAt: "2025-08-01T09:00:00Z",
    updatedAt: "2026-10-02T10:00:00Z",
  },
  {
    id: "legacy-weekly",
    identifier: "nb_legacy_weekly",
    name: "Weekly Pass (Legacy)",
    description:
      "Retired introductory weekly billing pass retained strictly for existing grandfathered subscribers; hidden from new mobile signups.",
    billingInterval: "weekly",
    durationMonths: 0,
    durationDays: 7,
    price: 4.99,
    monthlyEquivalent: 21.62,
    discountTag: "Legacy Archived",
    currency: "USD",
    currencySymbol: "$",
    availableRegions: ["Legacy Grandfathered Only"],
    status: "archived",
    visibleInMobileApp: false,
    displayOrder: 99,
    isMostPopular: false,
    entitlementKeys: [
      "unlimitedLikes",
      "seeWhoLikesYou",
      "verifiedBadge",
    ],
    eligibilityNote: "No longer open to new signups. Existing agreements remain active until cancelled or expired.",
    effectiveDate: "2025-05-01T00:00:00Z",
    createdAt: "2025-05-01T08:00:00Z",
    updatedAt: "2026-08-01T12:00:00Z",
  },
];

// Official NobleBond Entitlements (Matching src/features/premium/types/premium.types.ts & subscriptionPlans.ts)
const INITIAL_ENTITLEMENTS: SubscriptionEntitlementConfig[] = [
  {
    key: "unlimitedLikes",
    name: "Unlimited Likes & Swipes",
    description:
      "Removes daily swipe limits so members can express interest across Discover without waiting for reset timers.",
    mobileFeatureKey: "entitlements.unlimitedLikes",
    associatedPlanIds: ["12-months", "6-months", "1-month", "legacy-weekly"],
    availability: "all_paid_plans",
    status: "active",
    usageLimitLabel: "Unlimited daily swipes (Fair-use anti-bot throttle only)",
    updatedAt: "2026-10-15T11:30:00Z",
  },
  {
    key: "seeWhoLikesYou",
    name: "See Who Likes You Instantly",
    description:
      "Unlocks the unblurred incoming Likes grid enabling immediate mutual match confirmation.",
    mobileFeatureKey: "entitlements.seeWhoLikesYou",
    associatedPlanIds: ["12-months", "6-months", "1-month", "legacy-weekly"],
    availability: "all_paid_plans",
    status: "active",
    usageLimitLabel: "Full unblurred incoming queue",
    updatedAt: "2026-10-15T11:30:00Z",
  },
  {
    key: "verifiedBadge",
    name: "Priority Verified Profiles Badge",
    description:
      "Highlights trusted verified badge eligibility and elevated placement in quality discovery queues.",
    mobileFeatureKey: "entitlements.verifiedBadge",
    associatedPlanIds: ["12-months", "6-months", "1-month", "legacy-weekly"],
    availability: "all_paid_plans",
    status: "active",
    usageLimitLabel: "Included with verified identity check",
    updatedAt: "2026-10-15T11:30:00Z",
  },
  {
    key: "premiumSupport",
    name: "24/7 VIP Concierge Support",
    description:
      "Priority ticket routing to Senior Safety & Member Support desk with priority response SLA.",
    mobileFeatureKey: "entitlements.premiumSupport",
    associatedPlanIds: ["12-months", "6-months", "1-month"],
    availability: "selected_plans",
    status: "active",
    usageLimitLabel: "Priority queue SLA (< 1 hr target)",
    updatedAt: "2026-10-15T11:30:00Z",
  },
  {
    key: "videoAudioCalls",
    name: "Priority Video & Audio Calls",
    description:
      "Enables high-definition private voice and video dates directly within matched conversations.",
    mobileFeatureKey: "entitlements.videoAudioCalls",
    associatedPlanIds: ["12-months", "6-months", "1-month"],
    availability: "selected_plans",
    status: "active",
    usageLimitLabel: "Unlimited 1-on-1 match calling",
    updatedAt: "2026-10-15T11:30:00Z",
  },
  {
    key: "globalPassport",
    name: "Global Passport Discovery",
    description:
      "Allows switching discovery location preferences across international NobleBond cities prior to travel.",
    mobileFeatureKey: "entitlements.globalPassport",
    associatedPlanIds: ["12-months", "6-months", "1-month"],
    availability: "selected_plans",
    status: "active",
    usageLimitLabel: "Global city switching enabled",
    updatedAt: "2026-10-15T11:30:00Z",
  },
];

// Build Coherent Subscriptions linked directly to the real 14 User Management Profiles
function buildInitialSubscriptions(): SubscriptionRecord[] {
  const users = loadUsersFromStorage();
  const byId = (id: string) => users.find((u) => u.id === id);

  const amara = byId("usr_nb_90421");
  const david = byId("usr_nb_90422");
  const zara = byId("usr_nb_90423");
  const jayden = byId("usr_nb_90424");
  const lily = byId("usr_nb_90425");
  const tobi = byId("usr_nb_90426");
  const marcus = byId("usr_nb_90427");
  const chloe = byId("usr_nb_90428");
  const kofi = byId("usr_nb_90429");
  const elena = byId("usr_nb_90430");
  const tessy = byId("usr_nb_90431");
  const victor = byId("usr_nb_90432");
  const brian = byId("usr_nb_90433");
  const richard = byId("usr_nb_90434");

  const mkRecord = (
    subId: string,
    u: ReturnType<typeof byId>,
    fallback: { id: string; name: string; username: string; email: string; avatar: string; country: string; countryCode: string; city: string },
    overrides: Omit<
      SubscriptionRecord,
      | "id"
      | "userId"
      | "profileId"
      | "userName"
      | "username"
      | "email"
      | "phone"
      | "avatar"
      | "country"
      | "countryCode"
      | "city"
      | "accountStatus"
      | "verificationStatus"
      | "registrationDate"
    >
  ): SubscriptionRecord => ({
    id: subId,
    userId: u?.id || fallback.id,
    profileId: `prf_${(u?.id || fallback.id).replace("usr_", "")}`,
    userName: u?.name || fallback.name,
    username: u?.username || fallback.username,
    email: u?.email || fallback.email,
    phone: u?.phone || "Restricted / Not Disclosed",
    avatar: u?.avatar || fallback.avatar,
    country: u?.country || fallback.country,
    countryCode: u?.countryCode || fallback.countryCode,
    city: u?.city || fallback.city,
    accountStatus: u?.status || "active",
    verificationStatus: u?.verification.status || "verified",
    registrationDate: u?.registrationDate || "2026-01-01T00:00:00Z",
    ...overrides,
  });

  return [
    mkRecord(
      "SUB-7001",
      amara,
      { id: "usr_nb_90421", name: "Amara Bliss", username: "@amara_bliss", email: "amara.bliss@noblebond.com", avatar: "", country: "Nigeria", countryCode: "NG", city: "Lagos" },
      {
        planId: "12-months",
        planName: "12 Months Premium",
        agreedPrice: 59.88,
        currency: "USD",
        currencySymbol: "$",
        billingInterval: "annual",
        startDate: "2026-01-15T00:00:00Z",
        currentPeriodStart: "2026-01-15T00:00:00Z",
        currentPeriodEnd: "2027-01-15T00:00:00Z",
        nextRenewalDate: "2027-01-15T00:00:00Z",
        expiryDate: "2027-01-15T00:00:00Z",
        paymentProvider: "apple_app_store",
        providerSubscriptionRef: "APPSTORE_TX_88129402",
        maskedPaymentMethod: "Apple Pay (Visa •••• 8821)",
        status: "active",
        autoRenew: true,
        isComplimentary: false,
        timeline: [
          {
            id: "tl_7001_1",
            timestamp: "2026-01-15T09:12:00Z",
            eventType: "checkout_initiated",
            title: "Mobile App Checkout Initiated",
            description: "Member selected 12 Months Premium ($59.88/yr) via iOS Apple Pay.",
            actor: "Amara Bliss",
          },
          {
            id: "tl_7001_2",
            timestamp: "2026-01-15T09:12:14Z",
            eventType: "payment_authorized",
            title: "Payment Authorized",
            description: "Apple App Store confirmed $59.88 USD charge (Ref: APPSTORE_TX_88129402).",
            actor: "Apple App Store",
          },
          {
            id: "tl_7001_3",
            timestamp: "2026-01-15T09:12:15Z",
            eventType: "subscription_activated",
            title: "Premium Access Activated",
            description: "Unlocked all 6 NobleBond Premium entitlements through Jan 15, 2027.",
            actor: "Billing System",
          },
        ],
      }
    ),
    mkRecord(
      "SUB-7002",
      david,
      { id: "usr_nb_90422", name: "David King", username: "@david_king", email: "david.king@innovate.ng", avatar: "", country: "Nigeria", countryCode: "NG", city: "Abuja" },
      {
        planId: "1-month",
        planName: "1 Month Premium",
        agreedPrice: 9.99,
        currency: "USD",
        currencySymbol: "$",
        billingInterval: "monthly",
        startDate: "2026-09-18T11:00:00Z",
        currentPeriodStart: "2026-10-18T11:00:00Z",
        currentPeriodEnd: "2026-11-18T11:00:00Z",
        nextRenewalDate: "2026-11-18T11:00:00Z",
        expiryDate: "2026-11-18T11:00:00Z",
        paymentProvider: "stripe_web",
        providerSubscriptionRef: "sub_stripe_9Q28KL11",
        maskedPaymentMethod: "Mastercard •••• 4512",
        status: "active",
        autoRenew: true,
        isComplimentary: false,
        timeline: [
          {
            id: "tl_7002_1",
            timestamp: "2026-09-18T11:00:00Z",
            eventType: "subscription_activated",
            title: "Initial Monthly Subscription Activated",
            description: "1 Month Premium ($9.99/mo) activated via Web Card Gateway.",
            actor: "Stripe Billing",
          },
          {
            id: "tl_7002_2",
            timestamp: "2026-10-18T11:00:04Z",
            eventType: "renewal_completed",
            title: "Cycle 2 Auto-Renewal Succeeded",
            description: "Monthly renewal $9.99 USD captured cleanly; period extended to Nov 18, 2026.",
            actor: "Stripe Billing",
          },
        ],
      }
    ),
    mkRecord(
      "SUB-7003",
      zara,
      { id: "usr_nb_90423", name: "Zara Love", username: "@zara_love", email: "zara.love@outlook.com", avatar: "", country: "United States", countryCode: "US", city: "New York" },
      {
        planId: "12-months",
        planName: "12 Months Premium",
        agreedPrice: 59.88,
        currency: "USD",
        currencySymbol: "$",
        billingInterval: "annual",
        startDate: "2026-02-12T08:40:00Z",
        currentPeriodStart: "2026-02-12T08:40:00Z",
        currentPeriodEnd: "2027-02-12T08:40:00Z",
        nextRenewalDate: "2027-02-12T08:40:00Z",
        expiryDate: "2027-02-12T08:40:00Z",
        paymentProvider: "stripe_web",
        providerSubscriptionRef: "sub_stripe_7K11ZP04",
        maskedPaymentMethod: "Visa •••• 1044",
        status: "active",
        autoRenew: true,
        isComplimentary: false,
        timeline: [
          {
            id: "tl_7003_1",
            timestamp: "2026-02-12T08:40:00Z",
            eventType: "subscription_activated",
            title: "12 Months Premium Activated",
            description: "Member upgraded directly to 12 Months VIP ($59.88).",
            actor: "Stripe Billing",
          },
        ],
      }
    ),
    mkRecord(
      "SUB-7004",
      jayden,
      { id: "usr_nb_90424", name: "Jayden Cole", username: "@jayden_cole", email: "jayden.cole@studiox.co.uk", avatar: "", country: "United Kingdom", countryCode: "GB", city: "London" },
      {
        planId: "1-month",
        planName: "1 Month Premium",
        agreedPrice: 9.99,
        currency: "USD",
        currencySymbol: "$",
        billingInterval: "monthly",
        startDate: "2026-10-10T14:20:00Z",
        currentPeriodStart: "2026-10-10T14:20:00Z",
        currentPeriodEnd: "2026-11-10T14:20:00Z",
        nextRenewalDate: "2026-11-10T14:20:00Z", // Renewing Today!
        expiryDate: "2026-11-10T14:20:00Z",
        paymentProvider: "google_play_store",
        providerSubscriptionRef: "GPA.3318-9921-4021-10291",
        maskedPaymentMethod: "Google Pay (Google Account)",
        status: "active",
        autoRenew: true,
        isComplimentary: false,
        timeline: [
          {
            id: "tl_7004_1",
            timestamp: "2026-10-10T14:20:00Z",
            eventType: "subscription_activated",
            title: "Monthly Google Play Subscription Activated",
            description: "1 Month Premium activated via Android Google Pay.",
            actor: "Google Play Billing",
          },
        ],
      }
    ),
    mkRecord(
      "SUB-7005",
      lily,
      { id: "usr_nb_90425", name: "Lily Rose", username: "@lily_rose", email: "lily.rose@gmail.com", avatar: "", country: "Nigeria", countryCode: "NG", city: "Lagos" },
      {
        planId: "12-months",
        planName: "12 Months Premium",
        agreedPrice: 59.88,
        currency: "USD",
        currencySymbol: "$",
        billingInterval: "annual",
        startDate: "2026-11-08T16:10:00Z",
        currentPeriodStart: "2026-11-08T16:10:00Z",
        currentPeriodEnd: "2027-11-08T16:10:00Z",
        nextRenewalDate: "2027-11-08T16:10:00Z",
        expiryDate: "2027-11-08T16:10:00Z",
        paymentProvider: "apple_app_store",
        providerSubscriptionRef: "APPSTORE_TX_99402210",
        maskedPaymentMethod: "Apple Pay (Device Account)",
        status: "active",
        autoRenew: true,
        isComplimentary: false,
        timeline: [
          {
            id: "tl_7005_1",
            timestamp: "2026-11-08T16:10:00Z",
            eventType: "subscription_activated",
            title: "New Annual Subscription Created",
            description: "Lily Rose subscribed to 12 Months Premium ($59.88/yr).",
            actor: "Apple App Store",
          },
        ],
      }
    ),
    mkRecord(
      "SUB-7006",
      marcus,
      { id: "usr_nb_90427", name: "Marcus Sterling", username: "@marcus_sterling", email: "m.sterling@sterlingholdings.ca", avatar: "", country: "Canada", countryCode: "CA", city: "Toronto" },
      {
        planId: "12-months",
        planName: "12 Months Premium",
        agreedPrice: 59.88,
        currency: "USD",
        currencySymbol: "$",
        billingInterval: "annual",
        startDate: "2026-05-10T12:00:00Z",
        currentPeriodStart: "2026-05-10T12:00:00Z",
        currentPeriodEnd: "2027-05-10T12:00:00Z",
        nextRenewalDate: "2027-05-10T12:00:00Z",
        expiryDate: "2027-05-10T12:00:00Z",
        paymentProvider: "stripe_web",
        providerSubscriptionRef: "sub_stripe_4M88XY90",
        maskedPaymentMethod: "Amex •••• 1002",
        status: "active",
        autoRenew: true,
        isComplimentary: false,
        timeline: [
          {
            id: "tl_7006_1",
            timestamp: "2026-05-10T12:00:00Z",
            eventType: "subscription_activated",
            title: "12 Months Premium Activated",
            description: "Subscribed cleanly via Amex corporate card.",
            actor: "Stripe Billing",
          },
        ],
      }
    ),
    mkRecord(
      "SUB-7007",
      chloe,
      { id: "usr_nb_90428", name: "Chloe Dupont", username: "@chloe_paris", email: "chloe.dupont@artparis.fr", avatar: "", country: "France", countryCode: "FR", city: "Paris" },
      {
        planId: "1-month",
        planName: "1 Month Premium",
        agreedPrice: 9.99,
        currency: "USD",
        currencySymbol: "$",
        billingInterval: "monthly",
        startDate: "2026-10-14T10:30:00Z",
        currentPeriodStart: "2026-10-14T10:30:00Z",
        currentPeriodEnd: "2026-11-14T10:30:00Z",
        nextRenewalDate: null,
        expiryDate: "2026-11-14T10:30:00Z", // Scheduled cancellation at period end!
        cancellationDate: "2026-11-06T18:45:00Z",
        cancellationEffectiveDate: "2026-11-14T10:30:00Z",
        cancellationReason: "Taking a short travel break; satisfied with experience",
        cancellationType: "user_requested_end_of_period",
        paymentProvider: "paypal",
        providerSubscriptionRef: "I-PAYPAL-7820114",
        maskedPaymentMethod: "PayPal Account",
        status: "cancellation_scheduled",
        autoRenew: false,
        isComplimentary: false,
        timeline: [
          {
            id: "tl_7007_1",
            timestamp: "2026-10-14T10:30:00Z",
            eventType: "subscription_activated",
            title: "Monthly Subscription Activated",
            description: "Activated via PayPal checkout ($9.99).",
            actor: "PayPal Gateway",
          },
          {
            id: "tl_7007_2",
            timestamp: "2026-11-06T18:45:00Z",
            eventType: "cancellation_requested",
            title: "End-of-Period Cancellation Scheduled",
            description: "Member disabled auto-renew. Premium entitlements remain active until Nov 14, 2026.",
            actor: "Chloe Dupont",
          },
        ],
      }
    ),
    mkRecord(
      "SUB-7008",
      kofi,
      { id: "usr_nb_90429", name: "Kofi Mensah", username: "@kofi_mensah", email: "kofi.mensah@ghanafintech.com", avatar: "", country: "Ghana", countryCode: "GH", city: "Accra" },
      {
        planId: "6-months",
        planName: "6 Months Premium",
        agreedPrice: 41.94,
        currency: "USD",
        currencySymbol: "$",
        billingInterval: "6_months",
        startDate: "2026-05-15T09:00:00Z",
        currentPeriodStart: "2026-05-15T09:00:00Z",
        currentPeriodEnd: "2026-11-15T09:00:00Z",
        nextRenewalDate: "2026-11-15T09:00:00Z", // Renewing within 7 days!
        expiryDate: "2026-11-15T09:00:00Z",
        paymentProvider: "stripe_web",
        providerSubscriptionRef: "sub_stripe_8H32KM22",
        maskedPaymentMethod: "Mastercard •••• 7731",
        status: "active",
        autoRenew: true,
        isComplimentary: false,
        timeline: [
          {
            id: "tl_7008_1",
            timestamp: "2026-05-15T09:00:00Z",
            eventType: "subscription_activated",
            title: "6 Months Premium Activated",
            description: "Charged $41.94 USD (6-month plan). Next renewal scheduled Nov 15, 2026.",
            actor: "Stripe Billing",
          },
        ],
      }
    ),
    mkRecord(
      "SUB-7009",
      elena,
      { id: "usr_nb_90430", name: "Elena Volkov", username: "@elena_v", email: "elena.volkov@berlindesign.de", avatar: "", country: "Germany", countryCode: "DE", city: "Berlin" },
      {
        planId: "legacy-weekly",
        planName: "Weekly Pass (Legacy)",
        agreedPrice: 4.99,
        currency: "USD",
        currencySymbol: "$",
        billingInterval: "weekly",
        startDate: "2026-10-06T00:00:00Z",
        currentPeriodStart: "2026-11-03T00:00:00Z",
        currentPeriodEnd: "2026-11-10T00:00:00Z",
        nextRenewalDate: "2026-11-10T00:00:00Z", // Renewing today
        expiryDate: "2026-11-10T00:00:00Z",
        paymentProvider: "stripe_web",
        providerSubscriptionRef: "sub_stripe_1W90LG02",
        maskedPaymentMethod: "Visa •••• 9912",
        status: "active",
        autoRenew: true,
        isComplimentary: false,
        timeline: [
          {
            id: "tl_7009_1",
            timestamp: "2026-10-06T00:00:00Z",
            eventType: "subscription_activated",
            title: "Grandfathered Weekly Pass Active",
            description: "Existing weekly agreement ($4.99/wk) preserved after Weekly Pass archival.",
            actor: "Billing System",
          },
        ],
      }
    ),
    mkRecord(
      "SUB-7010",
      tessy,
      { id: "usr_nb_90431", name: "Tessy Boateng", username: "@tessy_b", email: "tessy.boateng@accralive.com", avatar: "", country: "Ghana", countryCode: "GH", city: "Accra" },
      {
        planId: "12-months",
        planName: "12 Months Premium",
        agreedPrice: 59.88,
        currency: "USD",
        currencySymbol: "$",
        billingInterval: "annual",
        startDate: "2026-05-20T13:15:00Z",
        currentPeriodStart: "2026-05-20T13:15:00Z",
        currentPeriodEnd: "2027-05-20T13:15:00Z",
        nextRenewalDate: "2027-05-20T13:15:00Z",
        expiryDate: "2027-05-20T13:15:00Z",
        paymentProvider: "google_play_store",
        providerSubscriptionRef: "GPA.4912-8820-7712-90124",
        maskedPaymentMethod: "Google Pay (Google Account)",
        status: "active",
        autoRenew: true,
        isComplimentary: false,
        timeline: [
          {
            id: "tl_7010_1",
            timestamp: "2026-05-20T13:15:00Z",
            eventType: "subscription_activated",
            title: "Annual Membership Activated",
            description: "Tessy Boateng subscribed via Google Play Store ($59.88).",
            actor: "Google Play Billing",
          },
        ],
      }
    ),
    mkRecord(
      "SUB-7011",
      tobi,
      { id: "usr_nb_90426", name: "Tobi Bakare", username: "@tobi_bakare", email: "tobi.bakare@gmail.com", avatar: "", country: "Nigeria", countryCode: "NG", city: "Lagos" },
      {
        planId: "1-month",
        planName: "1 Month Premium",
        agreedPrice: 9.99,
        currency: "USD",
        currencySymbol: "$",
        billingInterval: "monthly",
        startDate: "2026-09-25T10:00:00Z",
        currentPeriodStart: "2026-09-25T10:00:00Z",
        currentPeriodEnd: "2026-10-25T10:00:00Z",
        nextRenewalDate: null,
        expiryDate: "2026-10-25T10:00:00Z",
        cancellationDate: "2026-10-12T15:00:00Z",
        cancellationEffectiveDate: "2026-10-25T10:00:00Z",
        cancellationReason: "Switched back to free tier temporarily",
        cancellationType: "non_renewal",
        paymentProvider: "stripe_web",
        providerSubscriptionRef: "sub_stripe_2M19EX88",
        maskedPaymentMethod: "Visa •••• 3319",
        status: "expired",
        autoRenew: false,
        isComplimentary: false,
        timeline: [
          {
            id: "tl_7011_1",
            timestamp: "2026-09-25T10:00:00Z",
            eventType: "subscription_activated",
            title: "1 Month Premium Activated",
            description: "Paid $9.99 USD via card.",
            actor: "Stripe Billing",
          },
          {
            id: "tl_7011_2",
            timestamp: "2026-10-25T10:00:00Z",
            eventType: "subscription_expired",
            title: "Subscription Period Expired",
            description: "Auto-renew was off; Premium entitlements revoked upon cycle end.",
            actor: "Billing System",
          },
        ],
      }
    ),
    mkRecord(
      "SUB-7012",
      brian,
      { id: "usr_nb_90433", name: "Brian Kovacs", username: "@brian_kovacs", email: "brian.kovacs@suspicious-domain.cc", avatar: "", country: "United States", countryCode: "US", city: "Chicago" },
      {
        planId: "6-months",
        planName: "6 Months Premium",
        agreedPrice: 41.94,
        currency: "USD",
        currencySymbol: "$",
        billingInterval: "6_months",
        startDate: "2026-05-07T08:00:00Z",
        currentPeriodStart: "2026-05-07T08:00:00Z",
        currentPeriodEnd: "2026-11-07T08:00:00Z",
        nextRenewalDate: "2026-11-11T08:00:00Z", // In grace/past-due retry window
        expiryDate: "2026-11-12T08:00:00Z",
        paymentProvider: "stripe_web",
        providerSubscriptionRef: "sub_stripe_9F40PD12",
        maskedPaymentMethod: "Mastercard •••• 6014",
        status: "past_due",
        autoRenew: true,
        isComplimentary: false,
        timeline: [
          {
            id: "tl_7012_1",
            timestamp: "2026-05-07T08:00:00Z",
            eventType: "subscription_activated",
            title: "6 Months Premium Activated",
            description: "Initial $41.94 charge settled.",
            actor: "Stripe Billing",
          },
          {
            id: "tl_7012_2",
            timestamp: "2026-11-07T08:01:12Z",
            eventType: "payment_failed",
            title: "Renewal Payment Failed (Past Due)",
            description: "Card issuer declined renewal charge ($41.94): insufficient_funds.",
            actor: "Stripe Webhook",
          },
        ],
      }
    ),
    mkRecord(
      "SUB-7013",
      richard,
      { id: "usr_nb_90434", name: "Richard Blackwood", username: "@r_blackwood", email: "richard.blackwood@banned-entity.net", avatar: "", country: "United Kingdom", countryCode: "GB", city: "London" },
      {
        planId: "12-months",
        planName: "12 Months Premium",
        agreedPrice: 59.88,
        currency: "USD",
        currencySymbol: "$",
        billingInterval: "annual",
        startDate: "2026-10-20T19:00:00Z",
        currentPeriodStart: "2026-10-20T19:00:00Z",
        currentPeriodEnd: "2026-11-02T14:00:00Z",
        nextRenewalDate: null,
        expiryDate: "2026-11-02T14:00:00Z",
        cancellationDate: "2026-11-02T14:00:00Z",
        cancellationEffectiveDate: "2026-11-02T14:00:00Z",
        cancellationReason: "Account permanently banned for Terms of Service fraud violation; charge refunded.",
        cancellationType: "admin_revoked",
        paymentProvider: "stripe_web",
        providerSubscriptionRef: "sub_stripe_0R55RF09",
        maskedPaymentMethod: "Visa •••• 2201",
        status: "refunded",
        autoRenew: false,
        isComplimentary: false,
        timeline: [
          {
            id: "tl_7013_1",
            timestamp: "2026-10-20T19:00:00Z",
            eventType: "subscription_activated",
            title: "12 Months Premium Purchased",
            description: "Paid $59.88 USD via card.",
            actor: "Stripe Billing",
          },
          {
            id: "tl_7013_2",
            timestamp: "2026-11-02T14:00:00Z",
            eventType: "refund_issued",
            title: "Full Refund & Access Termination",
            description: "Subscription cancelled and $59.88 refunded upon account termination.",
            actor: "Admin Billing Lead",
          },
        ],
      }
    ),
    mkRecord(
      "SUB-7014",
      victor,
      { id: "usr_nb_90432", name: "Victor Okafor", username: "@victor_okafor", email: "victor.okafor.unverified@yahoo.com", avatar: "", country: "Nigeria", countryCode: "NG", city: "Lagos" },
      {
        planId: "1-month",
        planName: "1 Month Premium (Complimentary VIP)",
        agreedPrice: 0,
        currency: "USD",
        currencySymbol: "$",
        billingInterval: "monthly",
        startDate: "2026-11-09T09:00:00Z",
        currentPeriodStart: "2026-11-09T09:00:00Z",
        currentPeriodEnd: "2026-12-09T09:00:00Z",
        nextRenewalDate: null,
        expiryDate: "2026-12-09T09:00:00Z",
        paymentProvider: "admin_complimentary",
        providerSubscriptionRef: "COMP_VIP_90432",
        maskedPaymentMethod: "Complimentary Grant (Non-Monetary)",
        status: "active",
        autoRenew: false,
        isComplimentary: true,
        complimentaryReason: "NobleBond Beta Ambassador Showcase Preview Pass (Excluded from MRR)",
        complimentaryGrantedBy: "Supervisor Admin",
        timeline: [
          {
            id: "tl_7014_1",
            timestamp: "2026-11-09T09:00:00Z",
            eventType: "complimentary_granted",
            title: "Complimentary 30-Day VIP Access Granted",
            description: "Granted complimentary access with zero revenue impact ($0.00).",
            actor: "Supervisor Admin",
          },
        ],
      }
    ),
  ];
}

const INITIAL_TRANSACTIONS: SubscriptionTransactionRecord[] = [
  {
    id: "NB-2026-99402",
    invoiceRef: "INV-2026-99402",
    subscriptionId: "SUB-7005",
    userId: "usr_nb_90425",
    userName: "Lily Rose",
    username: "@lily_rose",
    userEmail: "lily.rose@gmail.com",
    userAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    planId: "12-months",
    planName: "12 Months Premium",
    amount: 59.88,
    currency: "USD",
    currencySymbol: "$",
    billingPeriodLabel: "Nov 8, 2026 - Nov 8, 2027",
    transactionType: "initial_purchase",
    paymentProvider: "apple_app_store",
    paymentMethodCategory: "apple_pay",
    maskedPaymentMethod: "Apple Pay (Device Account)",
    providerReference: "APPSTORE_TX_99402210",
    timestamp: "2026-11-08T16:10:00Z",
    status: "successful",
  },
  {
    id: "NB-2026-98311",
    invoiceRef: "INV-2026-98311",
    subscriptionId: "SUB-7012",
    userId: "usr_nb_90433",
    userName: "Brian Kovacs",
    username: "@brian_kovacs",
    userEmail: "brian.kovacs@suspicious-domain.cc",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    planId: "6-months",
    planName: "6 Months Premium",
    amount: 41.94,
    currency: "USD",
    currencySymbol: "$",
    billingPeriodLabel: "Nov 7, 2026 - May 7, 2027",
    transactionType: "renewal",
    paymentProvider: "stripe_web",
    paymentMethodCategory: "card",
    maskedPaymentMethod: "Mastercard •••• 6014",
    providerReference: "pi_stripe_3Q81FAIL09",
    timestamp: "2026-11-07T08:01:12Z",
    status: "failed",
    failureCode: "insufficient_funds",
    failureReason: "Your card has insufficient funds for this semi-annual renewal.",
    providerResponse: "stripe_decline_code: insufficient_funds (HTTP 402 from card network)",
    retryStatus: "retry_scheduled",
    retryCount: 1,
    lastRetryAt: "2026-11-08T08:00:00Z",
    nextRetryScheduledAt: "2026-11-11T08:00:00Z",
  },
  {
    id: "NB-2026-97845",
    invoiceRef: "INV-2026-97845",
    subscriptionId: "SUB-7009",
    userId: "usr_nb_90430",
    userName: "Elena Volkov",
    username: "@elena_v",
    userEmail: "elena.volkov@berlindesign.de",
    userAvatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80",
    planId: "legacy-weekly",
    planName: "Weekly Pass (Legacy)",
    amount: 4.99,
    currency: "USD",
    currencySymbol: "$",
    billingPeriodLabel: "Nov 3, 2026 - Nov 10, 2026",
    transactionType: "renewal",
    paymentProvider: "stripe_web",
    paymentMethodCategory: "card",
    maskedPaymentMethod: "Visa •••• 9912",
    providerReference: "pi_stripe_8W02REN99",
    timestamp: "2026-11-03T00:01:05Z",
    status: "successful",
  },
  {
    id: "NB-2026-97210",
    invoiceRef: "INV-2026-97210",
    subscriptionId: "SUB-7013",
    userId: "usr_nb_90434",
    userName: "Richard Blackwood",
    username: "@r_blackwood",
    userEmail: "richard.blackwood@banned-entity.net",
    userAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    planId: "12-months",
    planName: "12 Months Premium",
    amount: 59.88,
    currency: "USD",
    currencySymbol: "$",
    billingPeriodLabel: "Oct 20, 2026 - Nov 2, 2026 (Refunded)",
    transactionType: "initial_purchase",
    paymentProvider: "stripe_web",
    paymentMethodCategory: "card",
    maskedPaymentMethod: "Visa •••• 2201",
    providerReference: "ch_stripe_0R55RF09",
    timestamp: "2026-10-20T19:00:00Z",
    status: "refunded",
    refundedAmount: 59.88,
  },
  {
    id: "NB-2026-96512",
    invoiceRef: "INV-2026-96512",
    subscriptionId: "SUB-7002",
    userId: "usr_nb_90422",
    userName: "David King",
    username: "@david_king",
    userEmail: "david.king@innovate.ng",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    planId: "1-month",
    planName: "1 Month Premium",
    amount: 9.99,
    currency: "USD",
    currencySymbol: "$",
    billingPeriodLabel: "Oct 18, 2026 - Nov 18, 2026",
    transactionType: "renewal",
    paymentProvider: "stripe_web",
    paymentMethodCategory: "card",
    maskedPaymentMethod: "Mastercard •••• 4512",
    providerReference: "pi_stripe_9Q28REN02",
    timestamp: "2026-10-18T11:00:04Z",
    status: "successful",
  },
  {
    id: "NB-2026-95903",
    invoiceRef: "INV-2026-95903",
    subscriptionId: "SUB-7007",
    userId: "usr_nb_90428",
    userName: "Chloe Dupont",
    username: "@chloe_paris",
    userEmail: "chloe.dupont@artparis.fr",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    planId: "1-month",
    planName: "1 Month Premium",
    amount: 9.99,
    currency: "USD",
    currencySymbol: "$",
    billingPeriodLabel: "Oct 14, 2026 - Nov 14, 2026",
    transactionType: "initial_purchase",
    paymentProvider: "paypal",
    paymentMethodCategory: "paypal",
    maskedPaymentMethod: "PayPal Account",
    providerReference: "PAYID-NB-7820114",
    timestamp: "2026-10-14T10:30:10Z",
    status: "successful",
  },
  {
    id: "NB-2026-95201",
    invoiceRef: "INV-2026-95201",
    subscriptionId: "SUB-7004",
    userId: "usr_nb_90424",
    userName: "Jayden Cole",
    username: "@jayden_cole",
    userEmail: "jayden.cole@studiox.co.uk",
    userAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
    planId: "1-month",
    planName: "1 Month Premium",
    amount: 9.99,
    currency: "USD",
    currencySymbol: "$",
    billingPeriodLabel: "Oct 10, 2026 - Nov 10, 2026",
    transactionType: "initial_purchase",
    paymentProvider: "google_play_store",
    paymentMethodCategory: "google_pay",
    maskedPaymentMethod: "Google Pay (Google Account)",
    providerReference: "GPA.3318-9921-4021-10291",
    timestamp: "2026-10-10T14:20:05Z",
    status: "successful",
  },
  {
    id: "NB-2026-94011",
    invoiceRef: "INV-2026-94011",
    subscriptionId: "SUB-7011",
    userId: "usr_nb_90426",
    userName: "Tobi Bakare",
    username: "@tobi_bakare",
    userEmail: "tobi.bakare@gmail.com",
    userAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    planId: "1-month",
    planName: "1 Month Premium",
    amount: 9.99,
    currency: "USD",
    currencySymbol: "$",
    billingPeriodLabel: "Sep 25, 2026 - Oct 25, 2026",
    transactionType: "initial_purchase",
    paymentProvider: "stripe_web",
    paymentMethodCategory: "card",
    maskedPaymentMethod: "Visa •••• 3319",
    providerReference: "pi_stripe_2M19INIT01",
    timestamp: "2026-09-25T10:00:12Z",
    status: "successful",
  },
  {
    id: "NB-2026-91204",
    invoiceRef: "INV-2026-91204",
    subscriptionId: "SUB-7010",
    userId: "usr_nb_90431",
    userName: "Tessy Boateng",
    username: "@tessy_b",
    userEmail: "tessy.boateng@accralive.com",
    userAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80",
    planId: "12-months",
    planName: "12 Months Premium",
    amount: 59.88,
    currency: "USD",
    currencySymbol: "$",
    billingPeriodLabel: "May 20, 2026 - May 20, 2027",
    transactionType: "initial_purchase",
    paymentProvider: "google_play_store",
    paymentMethodCategory: "google_pay",
    maskedPaymentMethod: "Google Pay (Google Account)",
    providerReference: "GPA.4912-8820-7712-90124",
    timestamp: "2026-05-20T13:15:11Z",
    status: "successful",
  },
  {
    id: "NB-2026-89941",
    invoiceRef: "INV-2026-89941",
    subscriptionId: "SUB-7008",
    userId: "usr_nb_90429",
    userName: "Kofi Mensah",
    username: "@kofi_mensah",
    userEmail: "kofi.mensah@ghanafintech.com",
    userAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
    planId: "6-months",
    planName: "6 Months Premium",
    amount: 41.94,
    currency: "USD",
    currencySymbol: "$",
    billingPeriodLabel: "May 15, 2026 - Nov 15, 2026",
    transactionType: "initial_purchase",
    paymentProvider: "stripe_web",
    paymentMethodCategory: "card",
    maskedPaymentMethod: "Mastercard •••• 7731",
    providerReference: "pi_stripe_8H32INIT01",
    timestamp: "2026-05-15T09:00:08Z",
    status: "successful",
  },
  {
    id: "NB-2026-88410",
    invoiceRef: "INV-2026-88410",
    subscriptionId: "SUB-7006",
    userId: "usr_nb_90427",
    userName: "Marcus Sterling",
    username: "@marcus_sterling",
    userEmail: "m.sterling@sterlingholdings.ca",
    userAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    planId: "12-months",
    planName: "12 Months Premium",
    amount: 59.88,
    currency: "USD",
    currencySymbol: "$",
    billingPeriodLabel: "May 10, 2026 - May 10, 2027",
    transactionType: "initial_purchase",
    paymentProvider: "stripe_web",
    paymentMethodCategory: "card",
    maskedPaymentMethod: "Amex •••• 1002",
    providerReference: "pi_stripe_4M88INIT01",
    timestamp: "2026-05-10T12:00:09Z",
    status: "successful",
  },
  {
    id: "NB-2026-79012",
    invoiceRef: "INV-2026-79012",
    subscriptionId: "SUB-7003",
    userId: "usr_nb_90423",
    userName: "Zara Love",
    username: "@zara_love",
    userEmail: "zara.love@outlook.com",
    userAvatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    planId: "12-months",
    planName: "12 Months Premium",
    amount: 59.88,
    currency: "USD",
    currencySymbol: "$",
    billingPeriodLabel: "Feb 12, 2026 - Feb 12, 2027",
    transactionType: "initial_purchase",
    paymentProvider: "stripe_web",
    paymentMethodCategory: "card",
    maskedPaymentMethod: "Visa •••• 1044",
    providerReference: "pi_stripe_7K11INIT01",
    timestamp: "2026-02-12T08:40:10Z",
    status: "successful",
  },
  {
    id: "NB-2026-75120",
    invoiceRef: "INV-2026-75120",
    subscriptionId: "SUB-7001",
    userId: "usr_nb_90421",
    userName: "Amara Bliss",
    username: "@amara_bliss",
    userEmail: "amara.bliss@noblebond.com",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    planId: "12-months",
    planName: "12 Months Premium",
    amount: 59.88,
    currency: "USD",
    currencySymbol: "$",
    billingPeriodLabel: "Jan 15, 2026 - Jan 15, 2027",
    transactionType: "initial_purchase",
    paymentProvider: "apple_app_store",
    paymentMethodCategory: "apple_pay",
    maskedPaymentMethod: "Apple Pay (Visa •••• 8821)",
    providerReference: "APPSTORE_TX_88129402",
    timestamp: "2026-01-15T09:12:14Z",
    status: "successful",
  },
];

const INITIAL_REFUNDS: SubscriptionRefundDisputeRecord[] = [
  {
    id: "RFD-401",
    recordKind: "refund_request",
    transactionId: "NB-2026-95903",
    subscriptionId: "SUB-7007",
    userId: "usr_nb_90428",
    userName: "Chloe Dupont",
    username: "@chloe_paris",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    planName: "1 Month Premium",
    originalAmount: 9.99,
    requestedAmount: 9.99,
    currency: "USD",
    currencySymbol: "$",
    reason: "Member requested refund citing accidental duplicate tap; auto-renew already disabled.",
    requestedAt: "2026-11-08T11:20:00Z",
    paymentProvider: "paypal",
    providerReference: "PAYID-NB-7820114",
    status: "under_review",
    internalNotes: [
      {
        id: "rn_401_1",
        author: "Support Specialist",
        timestamp: "2026-11-08T14:15:00Z",
        text: "Verified account usage logs: user actively sent likes for 22 days of the cycle. Awaiting Billing Lead decision.",
      },
    ],
    timeline: [
      {
        id: "rtl_401_1",
        timestamp: "2026-11-08T11:20:00Z",
        label: "Refund Request Opened",
        actor: "Chloe Dupont",
      },
      {
        id: "rtl_401_2",
        timestamp: "2026-11-08T14:15:00Z",
        label: "Moved to Under Review",
        actor: "Member Support Specialist",
      },
    ],
  },
  {
    id: "RFD-402",
    recordKind: "refund_request",
    transactionId: "NB-2026-97210",
    subscriptionId: "SUB-7013",
    userId: "usr_nb_90434",
    userName: "Richard Blackwood",
    username: "@r_blackwood",
    userAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    planName: "12 Months Premium",
    originalAmount: 59.88,
    requestedAmount: 59.88,
    currency: "USD",
    currencySymbol: "$",
    reason: "Full refund issued concurrently with permanent fraud enforcement termination.",
    requestedAt: "2026-11-02T13:50:00Z",
    paymentProvider: "stripe_web",
    providerReference: "re_stripe_0R55RF09",
    status: "completed",
    resolvedBy: "Supervisor Admin",
    resolvedAt: "2026-11-02T14:00:00Z",
    decisionNotes: "Settled full refund via Stripe gateway to avoid formal cardholder chargeback.",
    internalNotes: [],
    timeline: [
      {
        id: "rtl_402_1",
        timestamp: "2026-11-02T13:50:00Z",
        label: "Compliance Refund Initiated",
        actor: "Trust & Safety Lead",
      },
      {
        id: "rtl_402_2",
        timestamp: "2026-11-02T14:00:00Z",
        label: "Refund Completed ($59.88 USD)",
        actor: "Supervisor Admin",
      },
    ],
  },
  {
    id: "DSP-403",
    recordKind: "payment_dispute",
    transactionId: "NB-2026-98311",
    subscriptionId: "SUB-7012",
    userId: "usr_nb_90433",
    userName: "Brian Kovacs",
    username: "@brian_kovacs",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    planName: "6 Months Premium",
    originalAmount: 41.94,
    requestedAmount: 41.94,
    currency: "USD",
    currencySymbol: "$",
    reason: "Member disputed upcoming renewal charge notice on failed transaction attempt.",
    requestedAt: "2026-11-09T09:15:00Z",
    paymentProvider: "stripe_web",
    providerReference: "pi_stripe_3Q81FAIL09",
    status: "requested",
    internalNotes: [],
    timeline: [
      {
        id: "rtl_403_1",
        timestamp: "2026-11-09T09:15:00Z",
        label: "Billing Inquiry / Dispute Logged",
        actor: "Brian Kovacs",
      },
    ],
  },
];

const INITIAL_AUDIT: SubscriptionAuditEvent[] = [
  {
    id: "AUD-SUB-105",
    adminName: "Supervisor Admin",
    adminRole: "Super Administrator",
    actionType: "complimentary_granted",
    targetType: "subscriber",
    targetId: "SUB-7014",
    targetLabel: "Victor Okafor (@victor_okafor)",
    previousValue: "Free Member ($0.00)",
    newValue: "1 Month Complimentary VIP (Exp: 2026-12-09)",
    reason: "Beta showcase ambassador preview access (excluded from paid MRR).",
    timestamp: "2026-11-09T09:00:00Z",
  },
  {
    id: "AUD-SUB-104",
    adminName: "Supervisor Admin",
    adminRole: "Super Administrator",
    actionType: "refund_approved",
    targetType: "refund",
    targetId: "RFD-402",
    targetLabel: "Richard Blackwood ($59.88)",
    previousValue: "status: requested",
    newValue: "status: completed (Refunded $59.88)",
    reason: "Preventative full refund following account fraud termination.",
    timestamp: "2026-11-02T14:00:00Z",
  },
  {
    id: "AUD-SUB-103",
    adminName: "Billing Operations Lead",
    adminRole: "Billing Operations Lead",
    actionType: "plan_archived",
    targetType: "plan",
    targetId: "legacy-weekly",
    targetLabel: "Weekly Pass (Legacy)",
    previousValue: "status: active, mobileVisible: true",
    newValue: "status: archived, mobileVisible: false",
    reason: "Consolidated catalog to mobile-standard 1 Month, 6 Months, and 12 Months plans while grandfathering existing weekly subscribers.",
    timestamp: "2026-08-01T12:00:00Z",
  },
  {
    id: "AUD-SUB-102",
    adminName: "Supervisor Admin",
    adminRole: "Super Administrator",
    actionType: "entitlement_updated",
    targetType: "entitlement",
    targetId: "globalPassport",
    targetLabel: "Global Passport Discovery",
    previousValue: "12-months only",
    newValue: "12-months, 6-months, 1-month",
    reason: "Standardized full 6-benefit parity across all active NobleBond Mobile Premium tiers.",
    timestamp: "2026-08-01T09:30:00Z",
  },
  {
    id: "AUD-SUB-101",
    adminName: "Supervisor Admin",
    adminRole: "Super Administrator",
    actionType: "plan_activated",
    targetType: "plan",
    targetId: "12-months",
    targetLabel: "12 Months Premium ($59.88)",
    previousValue: "draft",
    newValue: "active (Most Popular)",
    reason: "Published standard mobile app Premium catalog.",
    timestamp: "2025-08-01T09:00:00Z",
  },
];

// Staged Draft Promotions (Explicitly Non-Active / Future-Ready until mobile promo engine ships)
const INITIAL_STAGED_PROMOS: StagedPromotionDraft[] = [
  {
    id: "STAGE-PROMO-01",
    name: "Future Partner Launch Draft",
    promoCode: "NOBLEVIP_STAGED",
    discountType: "percentage",
    discountValue: 15,
    applicablePlanIds: ["12-months", "6-months"],
    startDate: "2027-01-01",
    endDate: "2027-02-01",
    redemptionLimit: 500,
    usageCount: 0,
    regions: ["Global"],
    status: "staged_inactive",
    note: "Staged configuration only. Promotional coupon validation is not active in the current NobleBond mobile client.",
  },
];

// Storage Loaders & Savers
function safeLoad<T>(key: string, fallback: () => T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw) as T;
    }
  } catch (err) {
    console.warn(`Failed loading ${key} from storage:`, err);
  }
  const initial = fallback();
  try {
    localStorage.setItem(key, JSON.stringify(initial));
  } catch {
    // ignore quota errors
  }
  return initial;
}

export function loadSubscriptionPlans(): SubscriptionPlanConfig[] {
  return safeLoad(STORAGE_KEYS.PLANS, () => INITIAL_PLANS);
}

export function saveSubscriptionPlans(plans: SubscriptionPlanConfig[]): void {
  localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
}

export function loadSubscriptions(): SubscriptionRecord[] {
  return safeLoad(STORAGE_KEYS.SUBSCRIPTIONS, () => buildInitialSubscriptions());
}

export function saveSubscriptions(subs: SubscriptionRecord[]): void {
  localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subs));
}

export function loadSubscriptionTransactions(): SubscriptionTransactionRecord[] {
  return safeLoad(STORAGE_KEYS.TRANSACTIONS, () => INITIAL_TRANSACTIONS);
}

export function saveSubscriptionTransactions(txs: SubscriptionTransactionRecord[]): void {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
}

export function loadRefundsAndDisputes(): SubscriptionRefundDisputeRecord[] {
  return safeLoad(STORAGE_KEYS.REFUNDS, () => INITIAL_REFUNDS);
}

export function saveRefundsAndDisputes(records: SubscriptionRefundDisputeRecord[]): void {
  localStorage.setItem(STORAGE_KEYS.REFUNDS, JSON.stringify(records));
}

export function loadEntitlementConfigs(): SubscriptionEntitlementConfig[] {
  return safeLoad(STORAGE_KEYS.ENTITLEMENTS, () => INITIAL_ENTITLEMENTS);
}

export function saveEntitlementConfigs(configs: SubscriptionEntitlementConfig[]): void {
  localStorage.setItem(STORAGE_KEYS.ENTITLEMENTS, JSON.stringify(configs));
}

export function loadSubscriptionAuditHistory(): SubscriptionAuditEvent[] {
  return safeLoad(STORAGE_KEYS.AUDIT, () => INITIAL_AUDIT);
}

export function saveSubscriptionAuditHistory(events: SubscriptionAuditEvent[]): void {
  localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(events));
}

export function loadStagedPromotions(): StagedPromotionDraft[] {
  return safeLoad(STORAGE_KEYS.STAGED_PROMOS, () => INITIAL_STAGED_PROMOS);
}

export function saveStagedPromotions(promos: StagedPromotionDraft[]): void {
  localStorage.setItem(STORAGE_KEYS.STAGED_PROMOS, JSON.stringify(promos));
}

// Reference timestamp (consistent with dataset Nov 10, 2026)
const REFERENCE_NOW_MS = new Date("2026-11-10T11:00:00Z").getTime();

export function isWithinDateRange(
  isoDate: string,
  range: SubscriptionDateRange,
  customStart?: string,
  customEnd?: string
): boolean {
  if (range === "all") return true;
  if (!isoDate) return false;
  const ts = new Date(isoDate).getTime();
  if (isNaN(ts)) return true;

  if (range === "custom") {
    const startOk = customStart ? ts >= new Date(customStart).getTime() : true;
    const endOk = customEnd ? ts <= new Date(customEnd + "T23:59:59Z").getTime() : true;
    return startOk && endOk;
  }

  const dayMs = 86400000;
  let windowMs = 30 * dayMs;
  if (range === "today") windowMs = dayMs;
  else if (range === "7d") windowMs = 7 * dayMs;
  else if (range === "30d") windowMs = 30 * dayMs;
  else if (range === "90d") windowMs = 90 * dayMs;

  return REFERENCE_NOW_MS - ts <= windowMs;
}

// Compute Normalized Paid MRR Contribution
export function normalizeMonthlyRecurringAmount(
  agreedPrice: number,
  billingInterval: BillingInterval,
  isComplimentary: boolean
): number {
  if (isComplimentary || agreedPrice <= 0) return 0;
  switch (billingInterval) {
    case "annual":
      return agreedPrice / 12;
    case "6_months":
      return agreedPrice / 6;
    case "monthly":
      return agreedPrice;
    case "weekly":
      return agreedPrice * 4.33;
    default:
      return agreedPrice;
  }
}

// Aggregate KPIs cleanly separated from Gift Coins & Connection Points
export function calculateSubscriptionKPIs(
  subscriptions: SubscriptionRecord[],
  transactions: SubscriptionTransactionRecord[],
  refunds: SubscriptionRefundDisputeRecord[],
  dateRange: SubscriptionDateRange = "all",
  customStart?: string,
  customEnd?: string
): SubscriptionStatsKpis {
  const paidRecurringStates: SubscriptionStatus[] = [
    "active",
    "grace_period",
    "cancellation_scheduled",
    "past_due",
  ];

  const activeSubs = subscriptions.filter(
    (s) =>
      (s.status === "active" || s.status === "cancellation_scheduled" || s.status === "grace_period") &&
      !s.isComplimentary
  );
  const complimentaryCount = subscriptions.filter(
    (s) => s.status === "active" && s.isComplimentary
  ).length;

  const newSubsInPeriod = subscriptions.filter((s) =>
    isWithinDateRange(s.startDate, dateRange, customStart, customEnd)
  ).length;

  const cancelledCount = subscriptions.filter((s) => s.status === "cancelled").length;
  const cancellationScheduledCount = subscriptions.filter(
    (s) => s.status === "cancellation_scheduled"
  ).length;
  const expiredCount = subscriptions.filter((s) => s.status === "expired").length;
  const pastDueCount = subscriptions.filter(
    (s) => s.status === "past_due" || s.status === "payment_failed"
  ).length;

  const failedPayments = transactions.filter(
    (t) => t.status === "failed" && isWithinDateRange(t.timestamp, dateRange, customStart, customEnd)
  );

  // Pending Renewals (next 14 days from reference date)
  const pendingRenewalsCount = subscriptions.filter((s) => {
    if (!s.autoRenew || !s.nextRenewalDate || s.isComplimentary) return false;
    const rnTs = new Date(s.nextRenewalDate).getTime();
    return rnTs >= REFERENCE_NOW_MS - 86400000 && rnTs <= REFERENCE_NOW_MS + 14 * 86400000;
  }).length;

  // Revenue Calculation strictly from Paid Subscription Transactions in Period
  const periodTxs = transactions.filter((t) =>
    isWithinDateRange(t.timestamp, dateRange, customStart, customEnd)
  );

  const grossSubscriptionRevenue = periodTxs
    .filter((t) => t.status === "successful" || t.status === "refunded" || t.status === "partially_refunded")
    .reduce((sum, t) => sum + t.amount, 0);

  const refundsTotal = periodTxs
    .filter((t) => t.status === "refunded" || t.status === "partially_refunded")
    .reduce((sum, t) => sum + (t.refundedAmount || t.amount), 0);

  const netSubscriptionRevenue = Math.max(0, grossSubscriptionRevenue - refundsTotal);

  // Normalized Paid MRR & ARR (Strictly active recurring paid agreements, excludes complimentary & refunds)
  const mrr = subscriptions
    .filter((s) => paidRecurringStates.includes(s.status) && !s.isComplimentary)
    .reduce(
      (sum, s) =>
        sum + normalizeMonthlyRecurringAmount(s.agreedPrice, s.billingInterval, s.isComplimentary),
      0
    );
  const arr = mrr * 12;

  const totalUniqueSubs = subscriptions.length;
  const churnedOrCancelled = cancelledCount + expiredCount;
  const churnRatePercent =
    totalUniqueSubs > 0 ? Number(((churnedOrCancelled / totalUniqueSubs) * 100).toFixed(1)) : 0;

  const renewalEligible = subscriptions.filter(
    (s) => !s.isComplimentary && (s.status === "active" || s.status === "expired" || s.status === "cancelled")
  ).length;
  const renewedOrRetained = subscriptions.filter(
    (s) => !s.isComplimentary && s.status === "active" && s.autoRenew
  ).length;
  const renewalRatePercent =
    renewalEligible > 0 ? Number(((renewedOrRetained / renewalEligible) * 100).toFixed(1)) : 0;

  const arpu = activeSubs.length > 0 ? Number((mrr / activeSubs.length).toFixed(2)) : 0;

  const allPlatformUsers = loadUsersFromStorage().length || 14;
  const premiumConversionRatePercent = Number(
    (((activeSubs.length + cancellationScheduledCount) / allPlatformUsers) * 100).toFixed(1)
  );

  const pendingRefundRequests = refunds.filter(
    (r) => r.status === "requested" || r.status === "under_review"
  ).length;

  return {
    totalSubscribers: subscriptions.length,
    activePremiumSubscribers: activeSubs.length + cancellationScheduledCount,
    complimentarySubscribers: complimentaryCount,
    newSubscribersInPeriod: newSubsInPeriod,
    cancelledSubscriptions: cancelledCount,
    cancellationScheduledCount,
    expiredSubscriptions: expiredCount,
    pastDueSubscriptions: pastDueCount,
    failedPaymentsCount: failedPayments.length,
    pendingRenewalsCount,
    grossSubscriptionRevenue: Number(grossSubscriptionRevenue.toFixed(2)),
    refundsTotal: Number(refundsTotal.toFixed(2)),
    netSubscriptionRevenue: Number(netSubscriptionRevenue.toFixed(2)),
    mrr: Number(mrr.toFixed(2)),
    arr: Number(arr.toFixed(2)),
    churnRatePercent,
    renewalRatePercent,
    arpu,
    premiumConversionRatePercent,
    pendingRefundRequests,
  };
}

// Aggregate 1 row per unique subscriber for Subscribers tab
export function buildSubscriberDirectory(
  subscriptions: SubscriptionRecord[],
  transactions: SubscriptionTransactionRecord[]
): SubscriberSummaryRecord[] {
  const map = new Map<string, SubscriberSummaryRecord>();

  subscriptions.forEach((sub) => {
    const userTxs = transactions.filter(
      (t) => t.userId === sub.userId && (t.status === "successful")
    );
    const totalSuccessfulPayments = userTxs.length;
    const lifetimeSubscriptionSpend = Number(
      userTxs.reduce((acc, t) => acc + t.amount, 0).toFixed(2)
    );

    const existing = map.get(sub.userId);
    if (!existing) {
      map.set(sub.userId, {
        userId: sub.userId,
        profileId: sub.profileId,
        name: sub.userName,
        username: sub.username,
        email: sub.email,
        avatar: sub.avatar,
        country: sub.country,
        countryCode: sub.countryCode,
        city: sub.city,
        accountStatus: sub.accountStatus,
        verificationStatus: sub.verificationStatus,
        registrationDate: sub.registrationDate,
        currentPlanId: sub.planId,
        currentPlanName: sub.planName,
        subscriptionId: sub.id,
        subscriptionStatus: sub.status,
        startDate: sub.startDate,
        nextRenewalDate: sub.nextRenewalDate,
        totalSuccessfulPayments,
        lifetimeSubscriptionSpend,
        currency: sub.currency,
        isComplimentary: sub.isComplimentary,
        subscriptionsHistory: [sub],
      });
    } else {
      existing.subscriptionsHistory.push(sub);
    }
  });

  return Array.from(map.values());
}

// Filtering & Sorting Subscriptions
export function filterAndSortSubscriptions(
  subs: SubscriptionRecord[],
  filters: SubscriptionFilterState,
  sort: SubscriptionSortCriteria
): SubscriptionRecord[] {
  let result = [...subs];

  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      (s) =>
        s.id.toLowerCase().includes(q) ||
        s.userName.toLowerCase().includes(q) ||
        s.username.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.providerSubscriptionRef.toLowerCase().includes(q) ||
        s.planName.toLowerCase().includes(q)
    );
  }

  if (filters.status !== "all") {
    result = result.filter((s) => s.status === filters.status);
  }
  if (filters.planId !== "all") {
    result = result.filter((s) => s.planId === filters.planId);
  }
  if (filters.billingInterval !== "all") {
    result = result.filter((s) => s.billingInterval === filters.billingInterval);
  }
  if (filters.currency !== "all") {
    result = result.filter((s) => s.currency === filters.currency);
  }
  if (filters.country !== "all") {
    result = result.filter((s) => s.country === filters.country);
  }
  if (filters.paymentProvider !== "all") {
    result = result.filter((s) => s.paymentProvider === filters.paymentProvider);
  }
  if (filters.autoRenew === "enabled") {
    result = result.filter((s) => s.autoRenew);
  } else if (filters.autoRenew === "disabled") {
    result = result.filter((s) => !s.autoRenew);
  }
  if (filters.complimentaryFilter === "paid_only") {
    result = result.filter((s) => !s.isComplimentary);
  } else if (filters.complimentaryFilter === "complimentary_only") {
    result = result.filter((s) => s.isComplimentary);
  }

  if (filters.dateRange !== "all") {
    result = result.filter((s) =>
      isWithinDateRange(s.startDate, filters.dateRange, filters.customStartDate, filters.customEndDate)
    );
  }

  result.sort((a, b) => {
    let cmp = 0;
    switch (sort.field) {
      case "newest":
        cmp = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        break;
      case "oldest":
        cmp = new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        return cmp;
      case "highest_price":
        cmp = a.agreedPrice - b.agreedPrice;
        break;
      case "next_renewal": {
        const ra = a.nextRenewalDate ? new Date(a.nextRenewalDate).getTime() : Number.MAX_SAFE_INTEGER;
        const rb = b.nextRenewalDate ? new Date(b.nextRenewalDate).getTime() : Number.MAX_SAFE_INTEGER;
        cmp = ra - rb;
        break;
      }
      case "status":
        cmp = a.status.localeCompare(b.status);
        break;
    }
    return sort.direction === "asc" ? cmp : -cmp;
  });

  return result;
}

// Helper to append immutable audit log entry
function appendAuditEvent(entry: Omit<SubscriptionAuditEvent, "id" | "timestamp">): SubscriptionAuditEvent[] {
  const existing = loadSubscriptionAuditHistory();
  const newEvent: SubscriptionAuditEvent = {
    id: `AUD-SUB-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };
  const updated = [newEvent, ...existing];
  saveSubscriptionAuditHistory(updated);
  return updated;
}

// Plan Management Mutations (Preserving existing subscriber agreements)
export function saveOrUpdatePlan(
  plan: SubscriptionPlanConfig,
  isNew: boolean,
  adminName: string,
  adminRole: string,
  reason: string
): { plans: SubscriptionPlanConfig[]; audit: SubscriptionAuditEvent[] } {
  const plans = loadSubscriptionPlans();
  const existing = plans.find((p) => p.id === plan.id);
  const now = new Date().toISOString();

  const updatedPlan: SubscriptionPlanConfig = {
    ...plan,
    updatedAt: now,
    createdAt: isNew ? now : plan.createdAt,
  };

  const updatedPlans = isNew
    ? [...plans, updatedPlan].sort((a, b) => a.displayOrder - b.displayOrder)
    : plans.map((p) => (p.id === plan.id ? updatedPlan : p)).sort((a, b) => a.displayOrder - b.displayOrder);

  saveSubscriptionPlans(updatedPlans);

  const audit = appendAuditEvent({
    adminName,
    adminRole,
    actionType: isNew ? "plan_created" : existing && existing.price !== plan.price ? "pricing_updated" : "plan_updated",
    targetType: "plan",
    targetId: plan.id,
    targetLabel: `${plan.name} (${plan.currencySymbol}${plan.price.toFixed(2)})`,
    previousValue: isNew
      ? "None"
      : `${existing?.name} (${existing?.currencySymbol}${existing?.price.toFixed(2)}, ${existing?.status})`,
    newValue: `${plan.name} (${plan.currencySymbol}${plan.price.toFixed(2)}, ${plan.status})`,
    reason: reason || "Plan catalog configuration updated via Admin Dashboard (existing subscriber agreements preserved).",
  });

  return { plans: updatedPlans, audit };
}

export function changePlanStatus(
  planId: string,
  newStatus: PlanStatus,
  adminName: string,
  adminRole: string,
  reason: string
): { plans: SubscriptionPlanConfig[]; audit: SubscriptionAuditEvent[] } {
  const plans = loadSubscriptionPlans();
  const target = plans.find((p) => p.id === planId);
  const updatedPlans = plans.map((p) =>
    p.id === planId
      ? {
          ...p,
          status: newStatus,
          visibleInMobileApp: newStatus === "active" ? p.visibleInMobileApp : false,
          updatedAt: new Date().toISOString(),
        }
      : p
  );
  saveSubscriptionPlans(updatedPlans);

  const actionType =
    newStatus === "active"
      ? "plan_activated"
      : newStatus === "archived"
      ? "plan_archived"
      : "plan_deactivated";

  const audit = appendAuditEvent({
    adminName,
    adminRole,
    actionType,
    targetType: "plan",
    targetId: planId,
    targetLabel: target?.name || planId,
    previousValue: target?.status || "unknown",
    newValue: newStatus,
    reason,
  });

  return { plans: updatedPlans, audit };
}

// Complimentary VIP Access Grant (Strictly Non-Monetary, Excluded from Paid MRR)
export function grantComplimentaryAccess(
  params: {
    userId: string;
    userName: string;
    username: string;
    email: string;
    avatar: string;
    country: string;
    countryCode: string;
    city: string;
    planId: string;
    planName: string;
    startDate: string;
    expiryDate: string;
    reason: string;
  },
  adminName: string,
  adminRole: string
): { subscriptions: SubscriptionRecord[]; audit: SubscriptionAuditEvent[] } {
  const subs = loadSubscriptions();
  const existingIdx = subs.findIndex(
    (s) => s.userId === params.userId && s.isComplimentary && s.status === "active"
  );

  const newSubId =
    existingIdx >= 0 ? subs[existingIdx].id : `SUB-COMP-${Date.now().toString().slice(-4)}`;

  const compRecord: SubscriptionRecord = {
    id: newSubId,
    userId: params.userId,
    profileId: `prf_${params.userId.replace("usr_", "")}`,
    userName: params.userName,
    username: params.username,
    email: params.email,
    avatar: params.avatar,
    country: params.country,
    countryCode: params.countryCode,
    city: params.city,
    accountStatus: "active",
    verificationStatus: "verified",
    registrationDate: "2026-01-01T00:00:00Z",
    planId: params.planId,
    planName: `${params.planName} (Complimentary)`,
    agreedPrice: 0,
    currency: "USD",
    currencySymbol: "$",
    billingInterval: "monthly",
    startDate: new Date(params.startDate).toISOString(),
    currentPeriodStart: new Date(params.startDate).toISOString(),
    currentPeriodEnd: new Date(params.expiryDate).toISOString(),
    nextRenewalDate: null,
    expiryDate: new Date(params.expiryDate).toISOString(),
    paymentProvider: "admin_complimentary",
    providerSubscriptionRef: `COMP_ACCESS_${newSubId}`,
    maskedPaymentMethod: "Complimentary Grant (Non-Monetary)",
    status: "active",
    autoRenew: false,
    isComplimentary: true,
    complimentaryReason: params.reason,
    complimentaryGrantedBy: adminName,
    timeline: [
      ...(existingIdx >= 0 ? subs[existingIdx].timeline : []),
      {
        id: `tl_comp_${Date.now()}`,
        timestamp: new Date().toISOString(),
        eventType: "complimentary_granted",
        title: existingIdx >= 0 ? "Complimentary VIP Extended" : "Complimentary VIP Access Granted",
        description: `Granted complimentary access (${params.planName}) until ${params.expiryDate}. Reason: ${params.reason}`,
        actor: adminName,
      },
    ],
  };

  const updatedSubs =
    existingIdx >= 0
      ? subs.map((s, idx) => (idx === existingIdx ? compRecord : s))
      : [compRecord, ...subs];

  saveSubscriptions(updatedSubs);

  const audit = appendAuditEvent({
    adminName,
    adminRole,
    actionType: existingIdx >= 0 ? "complimentary_extended" : "complimentary_granted",
    targetType: "subscriber",
    targetId: newSubId,
    targetLabel: `${params.userName} (${params.username})`,
    previousValue: existingIdx >= 0 ? `Exp: ${subs[existingIdx].expiryDate}` : "Standard Free / No Complimentary Grant",
    newValue: `Complimentary ${params.planName} until ${params.expiryDate} ($0.00 Paid Revenue)`,
    reason: params.reason,
  });

  return { subscriptions: updatedSubs, audit };
}

export function revokeComplimentaryAccess(
  subscriptionId: string,
  reason: string,
  adminName: string,
  adminRole: string
): { subscriptions: SubscriptionRecord[]; audit: SubscriptionAuditEvent[] } {
  const subs = loadSubscriptions();
  const target = subs.find((s) => s.id === subscriptionId);
  const now = new Date().toISOString();

  const updatedSubs = subs.map((s) =>
    s.id === subscriptionId
      ? {
          ...s,
          status: "cancelled" as const,
          cancellationDate: now,
          cancellationEffectiveDate: now,
          cancellationReason: reason,
          cancellationType: "admin_revoked" as const,
          timeline: [
            ...s.timeline,
            {
              id: `tl_rev_${Date.now()}`,
              timestamp: now,
              eventType: "complimentary_revoked" as const,
              title: "Complimentary Access Revoked",
              description: `Administrative revocation: ${reason}`,
              actor: adminName,
            },
          ],
        }
      : s
  );

  saveSubscriptions(updatedSubs);

  const audit = appendAuditEvent({
    adminName,
    adminRole,
    actionType: "complimentary_revoked",
    targetType: "subscription",
    targetId: subscriptionId,
    targetLabel: target ? `${target.userName} (${target.id})` : subscriptionId,
    previousValue: "active (Complimentary)",
    newValue: "cancelled (Admin Revoked)",
    reason,
  });

  return { subscriptions: updatedSubs, audit };
}

// Cancellation Review (Respecting end-of-period rules)
export function updateSubscriptionCancellationState(
  subscriptionId: string,
  newStatus: "cancellation_scheduled" | "cancelled",
  reason: string,
  adminName: string,
  adminRole: string
): { subscriptions: SubscriptionRecord[]; audit: SubscriptionAuditEvent[] } {
  const subs = loadSubscriptions();
  const target = subs.find((s) => s.id === subscriptionId);
  const now = new Date().toISOString();

  const updatedSubs = subs.map((s) =>
    s.id === subscriptionId
      ? {
          ...s,
          status: newStatus,
          autoRenew: false,
          nextRenewalDate: null,
          cancellationDate: now,
          cancellationEffectiveDate:
            newStatus === "cancellation_scheduled" ? s.currentPeriodEnd : now,
          cancellationReason: reason,
          cancellationType:
            newStatus === "cancellation_scheduled"
              ? ("user_requested_end_of_period" as const)
              : ("admin_revoked" as const),
          timeline: [
            ...s.timeline,
            {
              id: `tl_can_${Date.now()}`,
              timestamp: now,
              eventType:
                newStatus === "cancellation_scheduled"
                  ? ("cancellation_requested" as const)
                  : ("cancellation_effective" as const),
              title:
                newStatus === "cancellation_scheduled"
                  ? "Cancellation Scheduled for Period End"
                  : "Subscription Terminated Immediately",
              description:
                newStatus === "cancellation_scheduled"
                  ? `Auto-renew disabled; active access retained until period end. Reason: ${reason}`
                  : `Subscription terminated immediately. Reason: ${reason}`,
              actor: adminName,
            },
          ],
        }
      : s
  );

  saveSubscriptions(updatedSubs);

  const audit = appendAuditEvent({
    adminName,
    adminRole,
    actionType: "cancellation_reviewed",
    targetType: "subscription",
    targetId: subscriptionId,
    targetLabel: target ? `${target.userName} (${target.id})` : subscriptionId,
    previousValue: target?.status || "active",
    newValue: newStatus,
    reason,
  });

  return { subscriptions: updatedSubs, audit };
}

// Refund & Dispute Resolution (Local Demo Workflow — Explicitly Non-Settlement)
export function processRefundDecision(
  refundId: string,
  decision: "approved" | "rejected" | "under_review",
  notes: string,
  adminName: string,
  adminRole: string
): {
  refunds: SubscriptionRefundDisputeRecord[];
  transactions: SubscriptionTransactionRecord[];
  audit: SubscriptionAuditEvent[];
} {
  const refunds = loadRefundsAndDisputes();
  const transactions = loadSubscriptionTransactions();
  const target = refunds.find((r) => r.id === refundId);
  const now = new Date().toISOString();

  const resolvedStatus: RefundDisputeStatus =
    decision === "approved" ? "approved" : decision === "rejected" ? "rejected" : "under_review";

  const updatedRefunds = refunds.map((r) => {
    if (r.id !== refundId) return r;
    return {
      ...r,
      status: resolvedStatus,
      resolvedBy: decision !== "under_review" ? adminName : r.resolvedBy,
      resolvedAt: decision !== "under_review" ? now : r.resolvedAt,
      decisionNotes: notes,
      internalNotes: [
        ...r.internalNotes,
        {
          id: `rn_${Date.now()}`,
          author: adminName,
          timestamp: now,
          text: `[${resolvedStatus.toUpperCase()}] ${notes}`,
        },
      ],
      timeline: [
        ...r.timeline,
        {
          id: `rtl_${Date.now()}`,
          timestamp: now,
          label: `Demo Decision Recorded: ${resolvedStatus.replace("_", " ").toUpperCase()}`,
          actor: adminName,
        },
      ],
    };
  });

  saveRefundsAndDisputes(updatedRefunds);

  // If approved in demo mode, reflect refunded marker locally while clearly disclosing non-settlement
  let updatedTxs = transactions;
  if (decision === "approved" && target) {
    updatedTxs = transactions.map((t) =>
      t.id === target.transactionId
        ? {
            ...t,
            status:
              target.requestedAmount < t.amount
                ? ("partially_refunded" as const)
                : ("refunded" as const),
            refundedAmount: target.requestedAmount,
          }
        : t
    );
    saveSubscriptionTransactions(updatedTxs);
  }

  const audit = appendAuditEvent({
    adminName,
    adminRole,
    actionType:
      decision === "approved"
        ? "refund_approved"
        : decision === "rejected"
        ? "refund_rejected"
        : "refund_reviewed",
    targetType: "refund",
    targetId: refundId,
    targetLabel: target ? `${target.userName} (${target.currencySymbol}${target.requestedAmount.toFixed(2)})` : refundId,
    previousValue: target?.status || "unknown",
    newValue: `${resolvedStatus} (Demo workflow; production requires provider API)`,
    reason: notes,
  });

  return { refunds: updatedRefunds, transactions: updatedTxs, audit };
}

export function addRefundInternalNote(
  refundId: string,
  noteText: string,
  adminName: string
): SubscriptionRefundDisputeRecord[] {
  const refunds = loadRefundsAndDisputes();
  const updated = refunds.map((r) =>
    r.id === refundId
      ? {
          ...r,
          internalNotes: [
            ...r.internalNotes,
            {
              id: `rn_${Date.now()}`,
              author: adminName,
              timestamp: new Date().toISOString(),
              text: noteText,
            },
          ],
        }
      : r
  );
  saveRefundsAndDisputes(updated);
  return updated;
}

// Refresh Payment Status (Read-Only Provider Sync Check Simulation — Never Fakes Success Charges)
export function refreshFailedPaymentStatus(
  transactionId: string,
  adminName: string,
  adminRole: string
): { transactions: SubscriptionTransactionRecord[]; audit: SubscriptionAuditEvent[] } {
  const txs = loadSubscriptionTransactions();
  const target = txs.find((t) => t.id === transactionId);
  const now = new Date().toISOString();

  const updatedTxs = txs.map((t) =>
    t.id === transactionId
      ? {
          ...t,
          lastRetryAt: now,
          providerResponse: `${t.providerResponse || "stripe_decline"} | Last Status Sync: ${new Date().toLocaleTimeString()} (Unpaid — awaits customer card update)`,
        }
      : t
  );
  saveSubscriptionTransactions(updatedTxs);

  const audit = appendAuditEvent({
    adminName,
    adminRole,
    actionType: "payment_status_refreshed",
    targetType: "transaction",
    targetId: transactionId,
    targetLabel: target ? `${target.userName} (${target.id})` : transactionId,
    previousValue: "Sync check requested",
    newValue: "Confirmed failed / unpaid status via provider sync check",
    reason: "Administrator verified live failed payment state without fabricating card charges.",
  });

  return { transactions: updatedTxs, audit };
}

// Toggle Plan Association on Entitlement Config
export function updateEntitlementPlanMapping(
  entitlementKey: EntitlementKey,
  planIds: string[],
  adminName: string,
  adminRole: string,
  reason: string
): { entitlements: SubscriptionEntitlementConfig[]; audit: SubscriptionAuditEvent[] } {
  const configs = loadEntitlementConfigs();
  const target = configs.find((e) => e.key === entitlementKey);
  const updatedConfigs = configs.map((e) =>
    e.key === entitlementKey
      ? {
          ...e,
          associatedPlanIds: planIds,
          availability:
            planIds.length >= 4
              ? ("all_paid_plans" as const)
              : planIds.length > 0
              ? ("selected_plans" as const)
              : ("disabled" as const),
          updatedAt: new Date().toISOString(),
        }
      : e
  );
  saveEntitlementConfigs(updatedConfigs);

  const audit = appendAuditEvent({
    adminName,
    adminRole,
    actionType: "entitlement_updated",
    targetType: "entitlement",
    targetId: entitlementKey,
    targetLabel: target?.name || entitlementKey,
    previousValue: target?.associatedPlanIds.join(", ") || "none",
    newValue: planIds.join(", ") || "none",
    reason,
  });

  return { entitlements: updatedConfigs, audit };
}

// Staged Promotion Draft Save (Strictly Inactive Draft)
export function saveStagedPromotionDraft(
  promo: StagedPromotionDraft,
  adminName: string,
  adminRole: string
): { promos: StagedPromotionDraft[]; audit: SubscriptionAuditEvent[] } {
  const existing = loadStagedPromotions();
  const found = existing.some((p) => p.id === promo.id);
  const safeDraft: StagedPromotionDraft = { ...promo, status: "staged_inactive" };
  const updated = found
    ? existing.map((p) => (p.id === promo.id ? safeDraft : p))
    : [safeDraft, ...existing];
  saveStagedPromotions(updated);

  const audit = appendAuditEvent({
    adminName,
    adminRole,
    actionType: "staged_promo_saved",
    targetType: "promotion_draft",
    targetId: safeDraft.id,
    targetLabel: `${safeDraft.name} (${safeDraft.promoCode})`,
    previousValue: found ? "Draft Updated" : "New Staged Draft",
    newValue: "staged_inactive (Not active in production mobile client)",
    reason: "Saved staged promotion draft for future backend/mobile support.",
  });

  return { promos: updated, audit };
}

// Reset all local demonstration records
export function resetSubscriptionManagementData(): void {
  localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(INITIAL_PLANS));
  localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(buildInitialSubscriptions()));
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
  localStorage.setItem(STORAGE_KEYS.REFUNDS, JSON.stringify(INITIAL_REFUNDS));
  localStorage.setItem(STORAGE_KEYS.ENTITLEMENTS, JSON.stringify(INITIAL_ENTITLEMENTS));
  localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(INITIAL_AUDIT));
  localStorage.setItem(STORAGE_KEYS.STAGED_PROMOS, JSON.stringify(INITIAL_STAGED_PROMOS));
}

// CSV Export Utility
function triggerCsvDownload(filename: string, headers: string[], rows: Array<Array<string | number>>) {
  const csvContent = [
    headers.join(","),
    ...rows.map((r) =>
      r
        .map((cell) => {
          const str = String(cell ?? "");
          return `"${str.replace(/"/g, '""')}"`;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportSubscriptionsCsv(subs: SubscriptionRecord[]): void {
  triggerCsvDownload(
    `noblebond_subscriptions_${new Date().toISOString().slice(0, 10)}.csv`,
    [
      "Subscription ID",
      "Member Name",
      "Username",
      "Email",
      "Country",
      "Plan Name",
      "Agreed Price",
      "Currency",
      "Interval",
      "Status",
      "Auto Renew",
      "Complimentary",
      "Provider",
      "Start Date",
      "Next Renewal",
      "Expiry Date",
    ],
    subs.map((s) => [
      s.id,
      s.userName,
      s.username,
      s.email,
      s.country,
      s.planName,
      s.agreedPrice.toFixed(2),
      s.currency,
      s.billingInterval,
      s.status,
      s.autoRenew ? "Enabled" : "Disabled",
      s.isComplimentary ? "Yes" : "No",
      s.paymentProvider,
      s.startDate,
      s.nextRenewalDate || "N/A",
      s.expiryDate || "N/A",
    ])
  );
}

export function exportTransactionsCsv(txs: SubscriptionTransactionRecord[]): void {
  triggerCsvDownload(
    `noblebond_subscription_transactions_${new Date().toISOString().slice(0, 10)}.csv`,
    [
      "Transaction ID",
      "Invoice Ref",
      "Subscription ID",
      "Subscriber",
      "Email",
      "Plan",
      "Amount",
      "Currency",
      "Provider",
      "Masked Method",
      "Status",
      "Timestamp",
      "Failure Reason",
    ],
    txs.map((t) => [
      t.id,
      t.invoiceRef,
      t.subscriptionId,
      t.userName,
      t.userEmail,
      t.planName,
      t.amount.toFixed(2),
      t.currency,
      t.paymentProvider,
      t.maskedPaymentMethod,
      t.status,
      t.timestamp,
      t.failureReason || "",
    ])
  );
}

export function exportSubscribersCsv(subscribers: SubscriberSummaryRecord[]): void {
  triggerCsvDownload(
    `noblebond_subscribers_${new Date().toISOString().slice(0, 10)}.csv`,
    [
      "User ID",
      "Full Name",
      "Username",
      "Email",
      "Country",
      "Current Plan",
      "Status",
      "Complimentary",
      "Successful Payments",
      "Lifetime Spend (USD)",
      "Next Renewal",
    ],
    subscribers.map((u) => [
      u.userId,
      u.name,
      u.username,
      u.email,
      u.country,
      u.currentPlanName,
      u.subscriptionStatus,
      u.isComplimentary ? "Yes" : "No",
      u.totalSuccessfulPayments,
      u.lifetimeSubscriptionSpend.toFixed(2),
      u.nextRenewalDate || "N/A",
    ])
  );
}

export function exportRefundsCsv(refunds: SubscriptionRefundDisputeRecord[]): void {
  triggerCsvDownload(
    `noblebond_subscription_refunds_${new Date().toISOString().slice(0, 10)}.csv`,
    [
      "Record ID",
      "Type",
      "Transaction ID",
      "Subscription ID",
      "Subscriber",
      "Plan",
      "Original Amount",
      "Requested Amount",
      "Currency",
      "Provider",
      "Status",
      "Requested At",
      "Reason",
    ],
    refunds.map((r) => [
      r.id,
      r.recordKind,
      r.transactionId,
      r.subscriptionId,
      r.userName,
      r.planName,
      r.originalAmount.toFixed(2),
      r.requestedAmount.toFixed(2),
      r.currency,
      r.paymentProvider,
      r.status,
      r.requestedAt,
      r.reason,
    ])
  );
}

export function exportAuditHistoryCsv(events: SubscriptionAuditEvent[]): void {
  triggerCsvDownload(
    `noblebond_subscription_audit_${new Date().toISOString().slice(0, 10)}.csv`,
    [
      "Audit ID",
      "Timestamp",
      "Administrator",
      "Role",
      "Action",
      "Target",
      "Previous Value",
      "New Value",
      "Reason",
    ],
    events.map((e) => [
      e.id,
      e.timestamp,
      e.adminName,
      e.adminRole,
      e.actionType,
      e.targetLabel,
      e.previousValue,
      e.newValue,
      e.reason,
    ])
  );
}

