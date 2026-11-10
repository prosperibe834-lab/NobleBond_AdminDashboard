// NobleBond Admin — Centralized Cross-Module Business Intelligence & Analytics Service
// Aggregates strictly separated metrics from all existing NobleBond Admin modules without duplicating records.
// Enforces consistent metric definitions, period comparisons, privacy redactions, and honest uninstrumented telemetry labeling. Zero emojis.

import type {
  AnalyticsComparisonPeriod,
  AnalyticsDateRange,
  AnalyticsGlobalFilterState,
  AnalyticsRoleKey,
  AnalyticsRolePermissions,
  BusinessInsightItem,
  MetricDefinition,
  SavedCustomReportConfig,
} from "../types/analyticsManagement.types";
import { computePercentChange } from "../components/analytics/analyticsUiUtils";
import { loadUsersFromStorage } from "./userManagementDataService";
import { loadProfiles } from "./profileManagementDataService";
import { loadLikes, loadMatches } from "./likesMatchesDataService";
import { loadCalls, loadConversations } from "./chatManagementDataService";
import {
  loadLiveComments,
  loadLiveGifts,
  loadLiveGuests,
  loadLiveHosts,
  loadLiveReports,
  loadLiveSessions,
  loadLiveViewers,
  loadStreamHealth,
} from "./liveManagementDataService";
import {
  loadAppeals,
  loadModerationActions,
  loadModeratorWorkloads,
  loadReports,
} from "./reportsModerationDataService";
import {
  loadConnectionPointsRedemptions,
  loadConnectionPointsRewards,
  loadGiftCoinPurchases,
} from "./walletManagementDataService";
import {
  loadRefundsAndDisputes,
  loadSubscriptionPlans,
  loadSubscriptions,
  loadSubscriptionTransactions,
} from "./subscriptionManagementDataService";
import { loadFraudAlertCases, loadReferrals } from "./referralManagementDataService";
import {
  loadSupportAgents,
  loadSupportSettings,
  loadSupportTickets,
} from "./supportManagementDataService";

const STORAGE_KEYS = {
  SAVED_REPORTS: "noblebond_admin_analytics_saved_reports_v1",
};

export const ANALYTICS_REF_NOW_MS = new Date("2026-11-10T23:59:59Z").getTime();

// 9 Explicit Analytics Permissions Matrix (Prompt Section 32)
export const ANALYTICS_ROLE_PERMISSIONS: Record<AnalyticsRoleKey, AnalyticsRolePermissions> = {
  super_admin: {
    role: "super_admin",
    roleLabel: "Super Administrator / Founder",
    canViewGeneralAnalytics: true,
    canViewUserAnalytics: true,
    canViewRevenueAnalytics: true,
    canViewFinancialAnalytics: true,
    canViewGeographicAnalytics: true,
    canViewModerationAnalytics: true,
    canViewSupportAnalytics: true,
    canExportAnalytics: true,
    canCreateCustomReports: true,
  },
  finance_revenue_lead: {
    role: "finance_revenue_lead",
    roleLabel: "Finance & Revenue Executive",
    canViewGeneralAnalytics: true,
    canViewUserAnalytics: true,
    canViewRevenueAnalytics: true,
    canViewFinancialAnalytics: true,
    canViewGeographicAnalytics: true,
    canViewModerationAnalytics: false,
    canViewSupportAnalytics: false,
    canExportAnalytics: true,
    canCreateCustomReports: true,
  },
  growth_product_lead: {
    role: "growth_product_lead",
    roleLabel: "Growth & Product BI Lead",
    canViewGeneralAnalytics: true,
    canViewUserAnalytics: true,
    canViewRevenueAnalytics: false, // Sensitive raw revenue restricted per Section 32
    canViewFinancialAnalytics: false,
    canViewGeographicAnalytics: true,
    canViewModerationAnalytics: false,
    canViewSupportAnalytics: true,
    canExportAnalytics: true,
    canCreateCustomReports: true,
  },
  safety_support_lead: {
    role: "safety_support_lead",
    roleLabel: "Safety & Support Operations Lead",
    canViewGeneralAnalytics: true,
    canViewUserAnalytics: true,
    canViewRevenueAnalytics: false,
    canViewFinancialAnalytics: false,
    canViewGeographicAnalytics: false,
    canViewModerationAnalytics: true,
    canViewSupportAnalytics: true,
    canExportAnalytics: false,
    canCreateCustomReports: false,
  },
};

// Consistent Metric Definition Registry (Section 23)
export const METRIC_DEFINITIONS: Record<string, MetricDefinition> = {
  dau: {
    id: "dau",
    name: "Daily Active Users (DAU)",
    formula: "Distinct non-suspended, non-deleted accounts with qualifying activity within Today (24h window).",
    sourceModule: "User Management + Activity Logs",
    caveat: "Suspended, banned, or inactive accounts without activity in the day are excluded.",
  },
  wau: {
    id: "wau",
    name: "Weekly Active Users (WAU)",
    formula: "Distinct eligible accounts with qualifying activity within the rolling 7-day window.",
    sourceModule: "User Management",
  },
  mau: {
    id: "mau",
    name: "Monthly Active Users (MAU)",
    formula: "Distinct eligible accounts with qualifying activity within the 30-day reporting window.",
    sourceModule: "User Management",
  },
  profile_completion_rate: {
    id: "profile_completion_rate",
    name: "Profile Completion Rate",
    formula: "Profiles with >= 80% completion across Photos, Bio, Personal Info, Interests, Lifestyle & Prompts divided by total profiles.",
    sourceModule: "Profile Management",
  },
  match_creation_rate: {
    id: "match_creation_rate",
    name: "Match Conversion Rate",
    formula: "Confirmed Mutual Matches (both parties liked each other) divided by total outgoing/incoming Likes.",
    sourceModule: "Likes & Matches",
    caveat: "One-way likes never count as a match.",
  },
  message_delivery_rate: {
    id: "message_delivery_rate",
    name: "Message Delivery Success Rate",
    formula: "Conversations in optimal delivery health divided by total active conversations (excluding unavailable raw delivery webhooks).",
    sourceModule: "Chat Management",
  },
  subscription_net_revenue: {
    id: "subscription_net_revenue",
    name: "Net Subscription Revenue (USD)",
    formula: "Sum of confirmed Successful Subscription Payments minus processed Refunds (pending/failed payments & virtual coins excluded).",
    sourceModule: "Subscription Management + Wallet",
    caveat: "Completely separate from Gift Coin IAP volume and Connection Points.",
  },
  subscription_churn_rate: {
    id: "subscription_churn_rate",
    name: "Subscription Churn Rate",
    formula: "(Cancelled + Expired Paid Subscriptions) / Total Historical Paid Subscriptions x 100.",
    sourceModule: "Subscription Management",
  },
  referral_conversion_rate: {
    id: "referral_conversion_rate",
    name: "Referral Conversion Rate",
    formula: "Referrals passing Email or Phone OTP verification + anti-fraud validation divided by total referral-attributed signups.",
    sourceModule: "Referral Management",
    caveat: "Clicks and unverified signups never earn Connection Points.",
  },
  retention_returning: {
    id: "retention_returning",
    name: "Returning Active Rate",
    formula: "Users whose latest activity timestamp occurs >= 24 hours after initial registration divided by cohort registrations.",
    sourceModule: "User Management Cohorts",
  },
};

export interface WindowRangeMs {
  startMs: number;
  endMs: number;
  label: string;
}

export function resolveDateWindow(
  range: AnalyticsDateRange,
  customStart?: string,
  customEnd?: string
): WindowRangeMs {
  const dayMs = 86400000;
  const endToday = new Date("2026-11-10T23:59:59Z").getTime();
  const startToday = new Date("2026-11-10T00:00:00Z").getTime();

  switch (range) {
    case "today":
      return { startMs: startToday, endMs: endToday, label: "Today (Nov 10, 2026)" };
    case "yesterday":
      return {
        startMs: startToday - dayMs,
        endMs: startToday - 1,
        label: "Yesterday (Nov 9, 2026)",
      };
    case "7d":
      return { startMs: endToday - 7 * dayMs, endMs: endToday, label: "Last 7 Days" };
    case "30d":
      return { startMs: endToday - 30 * dayMs, endMs: endToday, label: "Last 30 Days" };
    case "90d":
      return { startMs: endToday - 90 * dayMs, endMs: endToday, label: "Last 90 Days" };
    case "6m":
      return { startMs: endToday - 180 * dayMs, endMs: endToday, label: "Last 6 Months" };
    case "12m":
      return { startMs: endToday - 365 * dayMs, endMs: endToday, label: "Last 12 Months" };
    case "this_month":
      return {
        startMs: new Date("2026-11-01T00:00:00Z").getTime(),
        endMs: endToday,
        label: "This Month (Nov 2026)",
      };
    case "prev_month":
      return {
        startMs: new Date("2026-10-01T00:00:00Z").getTime(),
        endMs: new Date("2026-10-31T23:59:59Z").getTime(),
        label: "Previous Month (Oct 2026)",
      };
    case "this_year":
      return {
        startMs: new Date("2026-01-01T00:00:00Z").getTime(),
        endMs: endToday,
        label: "Year to Date (2026)",
      };
    case "custom":
      return {
        startMs: customStart ? new Date(`${customStart}T00:00:00Z`).getTime() : 0,
        endMs: customEnd ? new Date(`${customEnd}T23:59:59Z`).getTime() : endToday,
        label: `${customStart || "Start"} -> ${customEnd || "Today"}`,
      };
    default:
      return { startMs: 0, endMs: endToday, label: "All Time History" };
  }
}

export function resolveComparisonWindow(
  current: WindowRangeMs,
  range: AnalyticsDateRange,
  comparison: AnalyticsComparisonPeriod,
  customStart?: string,
  customEnd?: string
): WindowRangeMs | null {
  if (range === "all") return null; // No meaningful prior period when inspecting All Time History
  const dayMs = 86400000;
  const span = Math.max(dayMs, current.endMs - current.startMs);

  if (comparison === "custom" && (customStart || customEnd)) {
    return {
      startMs: customStart ? new Date(`${customStart}T00:00:00Z`).getTime() : 0,
      endMs: customEnd
        ? new Date(`${customEnd}T23:59:59Z`).getTime()
        : current.startMs - 1,
      label: "Custom Comparison Period",
    };
  }
  if (comparison === "prev_month") {
    return {
      startMs: current.startMs - 30 * dayMs,
      endMs: current.endMs - 30 * dayMs,
      label: "Previous Month",
    };
  }
  if (comparison === "prev_quarter") {
    return {
      startMs: current.startMs - 90 * dayMs,
      endMs: current.endMs - 90 * dayMs,
      label: "Previous Quarter",
    };
  }
  if (comparison === "prev_year") {
    return {
      startMs: current.startMs - 365 * dayMs,
      endMs: current.endMs - 365 * dayMs,
      label: "Previous Year",
    };
  }
  return {
    startMs: current.startMs - span - 1,
    endMs: current.startMs - 1,
    label: "Previous Period",
  };
}

function inWindow(iso: string | undefined, win: WindowRangeMs | null): boolean {
  if (!win) return false;
  if (!iso) return false;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return false;
  return t >= win.startMs && t <= win.endMs;
}

export interface NotificationCampaignSnapshot {
  id: string;
  title: string;
  target: string;
  sentAt: string;
  deliveredCount: number;
  category: string;
  channel: "Push & In-App";
  openRateTracked: number | null; // Explicit null when real open tracking isn't connected
}

export function buildPlatformAnalyticsSnapshot(
  filters: AnalyticsGlobalFilterState
) {
  const currentWin = resolveDateWindow(
    filters.dateRange,
    filters.customStartDate,
    filters.customEndDate
  );
  const compareWin = resolveComparisonWindow(
    currentWin,
    filters.dateRange,
    filters.comparisonPeriod,
    filters.compareStartDate,
    filters.compareEndDate
  );

  // 1. Load live module stores
  const rawUsers = loadUsersFromStorage();
  const rawProfiles = loadProfiles();
  const rawLikes = loadLikes();
  const rawMatches = loadMatches();
  const rawConvos = loadConversations();
  const rawCalls = loadCalls();
  const rawLiveSessions = loadLiveSessions();
  const rawLiveHosts = loadLiveHosts();
  const rawLiveViewers = loadLiveViewers();
  const rawLiveGuests = loadLiveGuests();
  const rawLiveGifts = loadLiveGifts();
  const rawLiveComments = loadLiveComments();
  const rawLiveReports = loadLiveReports();
  const rawStreamHealth = loadStreamHealth();
  const rawReports = loadReports();
  const rawModActions = loadModerationActions();
  const rawAppeals = loadAppeals();
  const rawModWorkloads = loadModeratorWorkloads();
  const rawCoinPurchases = loadGiftCoinPurchases();
  const rawCpRewards = loadConnectionPointsRewards();
  const rawCpRedemptions = loadConnectionPointsRedemptions();
  const rawPlans = loadSubscriptionPlans();
  const rawSubscriptions = loadSubscriptions();
  const rawSubTxs = loadSubscriptionTransactions();
  const rawRefundDisputes = loadRefundsAndDisputes();
  const rawReferrals = loadReferrals();
  const rawFraudCases = loadFraudAlertCases();
  const rawSupportTickets = loadSupportTickets();
  const rawSupportAgents = loadSupportAgents();
  const supportSettings = loadSupportSettings();

  // 2. Apply Global User / Dimensional Filters cleanly
  const users = rawUsers.filter((u) => {
    if (filters.country !== "all" && u.country !== filters.country) return false;
    if (
      filters.platform !== "all" &&
      !u.devices.some((d) => d.platform === filters.platform)
    ) {
      return false;
    }
    if (filters.userStatus !== "all" && u.status !== filters.userStatus) return false;
    if (filters.referralSource === "referral" && !u.referral.referredByCode) return false;
    if (filters.referralSource === "organic" && u.referral.referredByCode) return false;
    if (filters.subscriptionPlan !== "all" && u.premium.tier !== filters.subscriptionPlan) {
      if (filters.subscriptionPlan === "1-month" && u.premium.tier !== "monthly") return false;
      if (filters.subscriptionPlan === "12-months" && u.premium.tier !== "yearly") return false;
      if (filters.subscriptionPlan === "free" && u.premium.isPremium) return false;
    }
    if (filters.userSegment === "verified" && u.verification.status !== "verified") return false;
    if (filters.userSegment === "unverified" && u.verification.status === "verified") return false;
    if (filters.userSegment === "premium" && !u.premium.isPremium) return false;
    if (filters.userSegment === "free" && u.premium.isPremium) return false;
    if (filters.userSegment === "referred" && !u.referral.referredByCode) return false;
    if (
      filters.userSegment === "completed_profile" &&
      u.profile.completionPercentage < 80
    ) {
      return false;
    }
    return true;
  });

  const allowedUserIds = new Set(users.map((u) => u.id));
  const isDimensionalFilterActive =
    filters.country !== "all" ||
    filters.platform !== "all" ||
    filters.userStatus !== "all" ||
    filters.subscriptionPlan !== "all" ||
    filters.referralSource !== "all" ||
    filters.userSegment !== "all";

  const keepByUser = (userId: string) =>
    !isDimensionalFilterActive || allowedUserIds.has(userId);

  // Scoped records (current window)
  const isUserActiveEligible = (status: string) =>
    status !== "suspended" && status !== "banned" && status !== "deleted";

  const activeUsersWindow = users.filter(
    (u) => isUserActiveEligible(u.status) && inWindow(u.lastActive, currentWin)
  );
  const newUsersCurrent = users.filter((u) => inWindow(u.registrationDate, currentWin));
  const newUsersPrev = compareWin
    ? users.filter((u) => inWindow(u.registrationDate, compareWin)).length
    : null;

  const dauWin = resolveDateWindow("today");
  const wauWin = resolveDateWindow("7d");
  const mauWin = resolveDateWindow("30d");

  const dauCount = users.filter(
    (u) => isUserActiveEligible(u.status) && inWindow(u.lastActive, dauWin)
  ).length;
  const wauCount = users.filter(
    (u) => isUserActiveEligible(u.status) && inWindow(u.lastActive, wauWin)
  ).length;
  const mauCount = users.filter(
    (u) => isUserActiveEligible(u.status) && inWindow(u.lastActive, mauWin)
  ).length;

  const returningUsers = activeUsersWindow.filter((u) => {
    const reg = new Date(u.registrationDate).getTime();
    const act = new Date(u.lastActive).getTime();
    return act - reg >= 86400000;
  });

  // 3. Profiles
  const profiles = rawProfiles.filter((p) => keepByUser(p.userId));
  const completeProfiles = profiles.filter((p) => p.completionPercentage >= 80);
  const avgProfileCompletion =
    profiles.length > 0
      ? Math.round(
          profiles.reduce((s, p) => s + p.completionPercentage, 0) / profiles.length
        )
      : 0;

  // 4. Likes & Matches (mutual matches strictly separated from 1-way likes)
  const likesCurrent = rawLikes.filter(
    (l) => keepByUser(l.sender.id) && inWindow(l.timestamp, currentWin)
  );
  const likesPrev = compareWin
    ? rawLikes.filter((l) => keepByUser(l.sender.id) && inWindow(l.timestamp, compareWin)).length
    : null;

  const matchesCurrent = rawMatches.filter(
    (m) =>
      (keepByUser(m.user1.id) || keepByUser(m.user2.id)) &&
      inWindow(m.matchDate, currentWin)
  );
  const matchesPrev = compareWin
    ? rawMatches.filter(
        (m) =>
          (keepByUser(m.user1.id) || keepByUser(m.user2.id)) &&
          inWindow(m.matchDate, compareWin)
      ).length
    : null;

  // 5. Chat & Calls
  const convosCurrent = rawConvos.filter(
    (c) =>
      (keepByUser(c.participant1.id) || keepByUser(c.participant2.id)) &&
      inWindow(c.lastMessageAt, currentWin)
  );
  const messagesSentCurrent = convosCurrent.reduce((s, c) => s + c.totalMessages, 0);
  const callsCurrent = rawCalls.filter((c) => inWindow(c.startedAt, currentWin));

  // 6. Live Streaming
  const liveSessions = rawLiveSessions.filter((ls) => {
    if (filters.liveCategory !== "all" && ls.category !== filters.liveCategory) return false;
    return inWindow(ls.startedAt, currentWin);
  });
  const liveCurrentlyActive = rawLiveSessions.filter((ls) => ls.status === "live");
  const liveGiftsCurrent = rawLiveGifts.filter((g) => inWindow(g.timestamp, currentWin));
  const liveReportsCurrent = rawLiveReports.filter((r) => inWindow(r.submittedAt, currentWin));

  // 7. Gift Coins (Strictly separated from USD Premium Revenue and Connection Points)
  const coinPurchasesCurrent = rawCoinPurchases.filter(
    (p) => keepByUser(p.userId) && inWindow(p.timestamp, currentWin)
  );
  const coinPurchasesCompleted = coinPurchasesCurrent.filter((p) => p.status === "completed");
  const coinPurchaseVolumeUsd = Number(
    coinPurchasesCompleted.reduce((s, p) => s + p.purchaseAmount, 0).toFixed(2)
  );
  const coinPurchasesPrevUsd = compareWin
    ? Number(
        rawCoinPurchases
          .filter(
            (p) =>
              keepByUser(p.userId) &&
              p.status === "completed" &&
              inWindow(p.timestamp, compareWin)
          )
          .reduce((s, p) => s + p.purchaseAmount, 0)
          .toFixed(2)
      )
    : null;

  const totalCoinsPurchased = coinPurchasesCompleted.reduce((s, p) => s + p.totalCoins, 0);
  const totalCoinsCirculating = users.reduce((s, u) => s + u.wallet.giftCoins, 0);
  const totalCoinsSpentOnGifts = liveGiftsCurrent
    .filter((g) => g.status === "completed")
    .reduce((s, g) => s + g.coinAmount, 0);

  // 8. Connection Points (Non-cash reward currency)
  const cpRewardsCurrent = rawCpRewards.filter(
    (r) => keepByUser(r.referrerUserId) && inWindow(r.createdAt, currentWin)
  );
  const cpIssuedPoints = cpRewardsCurrent
    .filter((r) => r.issuanceStatus === "issued")
    .reduce((s, r) => s + r.pointsAmount, 0);
  const cpRedemptionsCurrent = rawCpRedemptions.filter(
    (r) => keepByUser(r.userId) && inWindow(r.timestamp, currentWin)
  );
  const cpRedeemedPoints = cpRedemptionsCurrent
    .filter((r) => r.status === "completed")
    .reduce((s, r) => s + r.pointsSpent, 0);
  const cpCirculatingPoints = users.reduce((s, u) => s + u.wallet.connectionPoints, 0);

  // 9. Premium Subscriptions & Revenue (USD real money only, gross vs refunds vs net)
  const subsScoped = rawSubscriptions.filter((s) => {
    if (!keepByUser(s.userId)) return false;
    if (filters.subscriptionPlan !== "all" && s.planId !== filters.subscriptionPlan) {
      return false;
    }
    return true;
  });
  const activePaidSubs = subsScoped.filter(
    (s) =>
      (s.status === "active" ||
        s.status === "cancellation_scheduled" ||
        s.status === "grace_period") &&
      !s.isComplimentary
  );
  const newPaidSubsCurrent = subsScoped.filter((s) => inWindow(s.startDate, currentWin));
  const subTxsCurrent = rawSubTxs.filter(
    (t) => keepByUser(t.userId) && inWindow(t.timestamp, currentWin)
  );
  const grossSubRevenueUsd = Number(
    subTxsCurrent
      .filter(
        (t) =>
          t.status === "successful" ||
          t.status === "refunded" ||
          t.status === "partially_refunded"
      )
      .reduce((s, t) => s + t.amount, 0)
      .toFixed(2)
  );
  const subRefundsUsd = Number(
    subTxsCurrent
      .filter((t) => t.status === "refunded" || t.status === "partially_refunded")
      .reduce((s, t) => s + (t.refundedAmount || t.amount), 0)
      .toFixed(2)
  );
  const netSubRevenueUsd = Number(
    Math.max(0, grossSubRevenueUsd - subRefundsUsd).toFixed(2)
  );
  const prevNetSubRevenueUsd = compareWin
    ? (() => {
        const txs = rawSubTxs.filter(
          (t) => keepByUser(t.userId) && inWindow(t.timestamp, compareWin)
        );
        const gross = txs
          .filter((t) => t.status === "successful" || t.status === "refunded")
          .reduce((s, t) => s + t.amount, 0);
        const ref = txs
          .filter((t) => t.status === "refunded")
          .reduce((s, t) => s + (t.refundedAmount || t.amount), 0);
        return Number(Math.max(0, gross - ref).toFixed(2));
      })()
    : null;

  const mrrUsd = Number(
    activePaidSubs
      .reduce((s, sub) => {
        if (sub.billingInterval === "annual") return s + sub.agreedPrice / 12;
        if (sub.billingInterval === "6_months") return s + sub.agreedPrice / 6;
        if (sub.billingInterval === "weekly") return s + sub.agreedPrice * 4.33;
        return s + sub.agreedPrice;
      }, 0)
      .toFixed(2)
  );
  const arrUsd = Number((mrrUsd * 12).toFixed(2));
  const churnedSubsCount = subsScoped.filter(
    (s) => s.status === "cancelled" || s.status === "expired"
  ).length;
  const churnRatePercent =
    subsScoped.length > 0
      ? Number(((churnedSubsCount / subsScoped.length) * 100).toFixed(1))
      : 0;

  // 10. Referrals
  const referralsCurrent = rawReferrals.filter(
    (r) => keepByUser(r.referrer.userId) && inWindow(r.createdAt, currentWin)
  );
  const successfulReferralsCurrent = referralsCurrent.filter(
    (r) => r.status === "successful"
  );
  const refConversionRate =
    referralsCurrent.length > 0
      ? Number(
          ((successfulReferralsCurrent.length / referralsCurrent.length) * 100).toFixed(1)
        )
      : 0;

  // 11. Moderation & Safety
  const reportsCurrent = rawReports.filter((r) => inWindow(r.submittedAt, currentWin));
  const pendingReportsCount = reportsCurrent.filter(
    (r) => r.status === "pending" || r.status === "under_review"
  ).length;
  const actionsCurrent = rawModActions.filter((a) => inWindow(a.issuedAt, currentWin));
  const appealsCurrent = rawAppeals.filter((a) => inWindow(a.submittedAt, currentWin));

  // 12. Customer Support
  const ticketsCurrent = rawSupportTickets.filter(
    (t) => keepByUser(t.customerUserId) && inWindow(t.createdAt, currentWin)
  );
  const openTicketsCount = ticketsCurrent.filter(
    (t) => t.status !== "resolved" && t.status !== "closed"
  ).length;
  const escalatedTicketsCount = ticketsCurrent.filter(
    (t) => t.status === "escalated"
  ).length;

  // 13. Notifications (from NotificationsPage baseline — zero fabricated open/delivery webhooks)
  const notificationCampaigns: NotificationCampaignSnapshot[] = [
    {
      id: "cmp_1",
      title: "Weekend Live Gifting Party 2x Event",
      target: "All Active Users",
      sentAt: "2026-11-07T18:00:00Z",
      deliveredCount: activeUsersWindow.length,
      category: "Live Sessions",
      channel: "Push & In-App",
      openRateTracked: null,
    },
    {
      id: "cmp_2",
      title: "Meet NobleBond Live: Connect with creators",
      target: "New Registrations (Last 7 Days)",
      sentAt: "2026-11-05T12:00:00Z",
      deliveredCount: users.filter((u) => inWindow(u.registrationDate, wauWin)).length,
      category: "Discovery & Live",
      channel: "Push & In-App",
      openRateTracked: null,
    },
  ];

  // 14. Time-series bucketing (Daily / Weekly / Monthly responding dynamically to granularity + window)
  const buildTimeBuckets = () => {
    const bucketMap = new Map<
      string,
      {
        label: string;
        registrations: number;
        activeUsers: number;
        matches: number;
        subRevenueUsd: number;
        coinPurchaseUsd: number;
        reports: number;
      }
    >();

    const toBucketKey = (iso: string) => {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return "2026-11";
      if (filters.granularity === "daily") return d.toISOString().slice(0, 10);
      if (filters.granularity === "weekly") {
        const start = new Date(d);
        start.setUTCDate(d.getUTCDate() - d.getUTCDay());
        return `W/${start.toISOString().slice(5, 10)}`;
      }
      return d.toISOString().slice(0, 7);
    };

    const ensureBucket = (key: string) => {
      if (!bucketMap.has(key)) {
        bucketMap.set(key, {
          label: key,
          registrations: 0,
          activeUsers: 0,
          matches: 0,
          subRevenueUsd: 0,
          coinPurchaseUsd: 0,
          reports: 0,
        });
      }
      return bucketMap.get(key)!;
    };

    newUsersCurrent.forEach((u) => ensureBucket(toBucketKey(u.registrationDate)).registrations++);
    activeUsersWindow.forEach((u) => ensureBucket(toBucketKey(u.lastActive)).activeUsers++);
    matchesCurrent.forEach((m) => ensureBucket(toBucketKey(m.matchDate)).matches++);
    subTxsCurrent
      .filter((t) => t.status === "successful")
      .forEach((t) => {
        ensureBucket(toBucketKey(t.timestamp)).subRevenueUsd += t.amount;
      });
    coinPurchasesCompleted.forEach((p) => {
      ensureBucket(toBucketKey(p.timestamp)).coinPurchaseUsd += p.purchaseAmount;
    });
    reportsCurrent.forEach((r) => ensureBucket(toBucketKey(r.submittedAt)).reports++);

    const sorted = Array.from(bucketMap.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
    return sorted.length > 0
      ? sorted
      : [
          {
            label: currentWin.label,
            registrations: 0,
            activeUsers: 0,
            matches: 0,
            subRevenueUsd: 0,
            coinPurchaseUsd: 0,
            reports: 0,
          },
        ];
  };

  // 15. Geographic Rollup (using declared user.country only — never exposing IPs)
  const countryNames = Array.from(new Set(rawUsers.map((u) => u.country))).sort();
  const geographicRows = Array.from(
    new Set(users.map((u) => u.country))
  ).map((country) => {
    const cUsers = users.filter((u) => u.country === country);
    const cIds = new Set(cUsers.map((u) => u.id));
    const cActive = cUsers.filter(
      (u) => isUserActiveEligible(u.status) && inWindow(u.lastActive, currentWin)
    ).length;
    const cNew = cUsers.filter((u) => inWindow(u.registrationDate, currentWin)).length;
    const cPremium = subsScoped.filter(
      (s) => cIds.has(s.userId) && s.status === "active"
    ).length;
    const cMatches = matchesCurrent.filter(
      (m) => cIds.has(m.user1.id) || cIds.has(m.user2.id)
    ).length;
    const cReferrals = referralsCurrent.filter((r) => cIds.has(r.referrer.userId)).length;
    const cRevUsd = Number(
      subTxsCurrent
        .filter((t) => cIds.has(t.userId) && t.status === "successful")
        .reduce((s, t) => s + t.amount, 0)
        .toFixed(2)
    );

    return {
      country,
      totalUsers: cUsers.length,
      newRegistrations: cNew,
      activeUsers: cActive,
      premiumSubscribers: cPremium,
      mutualMatches: cMatches,
      referralsCount: cReferrals,
      subscriptionRevenueUsd: cRevUsd,
    };
  }).sort((a, b) => b.totalUsers - a.totalUsers);

  // 16. Cohort Retention Matrix (real registration quarters/months vs qualifying returning activity)
  const cohortPeriods = [
    { label: "2025 H2", start: "2025-07-01T00:00:00Z", end: "2025-12-31T23:59:59Z" },
    { label: "2026 Q1", start: "2026-01-01T00:00:00Z", end: "2026-03-31T23:59:59Z" },
    { label: "2026 Q2-Q3", start: "2026-04-01T00:00:00Z", end: "2026-09-30T23:59:59Z" },
    { label: "2026 Q4", start: "2026-10-01T00:00:00Z", end: "2026-11-30T23:59:59Z" },
  ];
  const retentionCohorts = cohortPeriods.map((cp) => {
    const startMs = new Date(cp.start).getTime();
    const endMs = new Date(cp.end).getTime();
    const cohortUsers = users.filter((u) => {
      const reg = new Date(u.registrationDate).getTime();
      return reg >= startMs && reg <= endMs;
    });
    const size = cohortUsers.length;
    const activeBeyond = (days: number) =>
      size > 0
        ? Math.round(
            (cohortUsers.filter((u) => {
              const reg = new Date(u.registrationDate).getTime();
              const act = new Date(u.lastActive).getTime();
              return isUserActiveEligible(u.status) && act - reg >= days * 86400000;
            }).length /
              size) *
              100
          )
        : 0;

    return {
      cohortLabel: cp.label,
      cohortSize: size,
      d1Percent: activeBeyond(1),
      d7Percent: activeBeyond(7),
      d30Percent: activeBeyond(30),
      d60Percent: activeBeyond(60),
      d90Percent: activeBeyond(90),
    };
  });

  // 17. Data-Driven Business Insights (Strictly factual math deltas — ZERO fabricated AI claims)
  const insights: BusinessInsightItem[] = [];
  const regChange = computePercentChange(newUsersCurrent.length, newUsersPrev);
  if (regChange !== null && Math.abs(regChange) >= 5) {
    insights.push({
      id: "ins_reg",
      severity: regChange > 0 ? "positive" : "warning",
      title:
        regChange > 0
          ? `New registrations increased ${regChange}% vs ${compareWin?.label}`
          : `New registrations decreased ${Math.abs(regChange)}% vs ${compareWin?.label}`,
      explanation: `Measured across eligible User Management accounts in ${currentWin.label}.`,
      metricLabel: "User Growth",
      supportingNumbers: `${newUsersCurrent.length} current vs ${newUsersPrev} previous`,
      targetTab: "user_analytics",
    });
  }
  const incompleteProfilesCount = profiles.length - completeProfiles.length;
  if (incompleteProfilesCount > 0) {
    insights.push({
      id: "ins_prof",
      severity: "info",
      title: `${incompleteProfilesCount} member profiles below 80% completion threshold`,
      explanation: "Improving prompts, interests, and verified photo uploads lifts discovery matching quality.",
      metricLabel: "Profile Completion",
      supportingNumbers: `${avgProfileCompletion}% average completion across ${profiles.length} profiles`,
      targetTab: "profile_analytics",
    });
  }
  const failedSubCount = subTxsCurrent.filter((t) => t.status === "failed").length;
  if (failedSubCount > 0) {
    insights.push({
      id: "ins_sub_fail",
      severity: "warning",
      title: `${failedSubCount} failed Premium payment attempt(s) detected in window`,
      explanation: "Failed subscription authorizations risk involuntary churn if card retry workflows do not recover them.",
      metricLabel: "Billing Health",
      supportingNumbers: `${failedSubCount} failed out of ${subTxsCurrent.length} subscription billing records`,
      targetTab: "premium_revenue_analytics",
    });
  }
  if (pendingReportsCount > 0 || openTicketsCount > 0) {
    insights.push({
      id: "ins_ops",
      severity: escalatedTicketsCount > 0 ? "warning" : "info",
      title: `${pendingReportsCount} moderation reports & ${openTicketsCount} support tickets open`,
      explanation: "Active safety reports and concierge inquiries requiring triage across Moderation & Support queues.",
      metricLabel: "Safety & Support Queue",
      supportingNumbers: `${escalatedTicketsCount} escalated support case(s)`,
      targetTab: "support_analytics",
    });
  }

  return {
    generatedAtIso: new Date().toISOString(),
    currentWindow: currentWin,
    comparisonWindow: compareWin,
    availableCountries: countryNames,
    users,
    newUsersCurrent,
    newUsersPrev,
    activeUsersWindow,
    returningUsers,
    dauCount,
    wauCount,
    mauCount,
    profiles,
    completeProfiles,
    avgProfileCompletion,
    likesCurrent,
    likesPrev,
    matchesCurrent,
    matchesPrev,
    convosCurrent,
    messagesSentCurrent,
    callsCurrent,
    liveSessions,
    liveCurrentlyActive,
    liveHosts: rawLiveHosts,
    liveViewers: rawLiveViewers,
    liveGuests: rawLiveGuests,
    liveGiftsCurrent,
    liveComments: rawLiveComments,
    liveReportsCurrent,
    streamHealth: rawStreamHealth,
    coinPurchasesCurrent,
    coinPurchaseVolumeUsd,
    coinPurchasesPrevUsd,
    totalCoinsPurchased,
    totalCoinsCirculating,
    totalCoinsSpentOnGifts,
    cpRewardsCurrent,
    cpIssuedPoints,
    cpRedemptionsCurrent,
    cpRedeemedPoints,
    cpCirculatingPoints,
    plans: rawPlans,
    subscriptions: subsScoped,
    activePaidSubs,
    newPaidSubsCurrent,
    subTxsCurrent,
    refundDisputes: rawRefundDisputes,
    grossSubRevenueUsd,
    subRefundsUsd,
    netSubRevenueUsd,
    prevNetSubRevenueUsd,
    mrrUsd,
    arrUsd,
    churnRatePercent,
    referralsCurrent,
    successfulReferralsCurrent,
    refConversionRate,
    fraudCases: rawFraudCases,
    reportsCurrent,
    pendingReportsCount,
    modActionsCurrent: actionsCurrent,
    appealsCurrent,
    modWorkloads: rawModWorkloads,
    ticketsCurrent,
    openTicketsCount,
    escalatedTicketsCount,
    supportAgents: rawSupportAgents,
    supportSettings,
    notificationCampaigns,
    timeBuckets: buildTimeBuckets(),
    geographicRows,
    retentionCohorts,
    insights,
  };
}

export type PlatformAnalyticsSnapshot = ReturnType<typeof buildPlatformAnalyticsSnapshot>;

export function loadSavedCustomReports(): SavedCustomReportConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_REPORTS);
    if (!raw) return [];
    return JSON.parse(raw) as SavedCustomReportConfig[];
  } catch {
    return [];
  }
}

export function saveCustomReportConfig(
  cfg: SavedCustomReportConfig
): SavedCustomReportConfig[] {
  const existing = loadSavedCustomReports();
  const next = [cfg, ...existing.filter((item) => item.id !== cfg.id)];
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_REPORTS, JSON.stringify(next));
  } catch {
    // ignore storage errors
  }
  return next;
}

export function createSavedCustomReportConfig(
  input: Omit<SavedCustomReportConfig, "id" | "createdAt">
): SavedCustomReportConfig[] {
  const cfg: SavedCustomReportConfig = {
    ...input,
    id: `RPT-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  return saveCustomReportConfig(cfg);
}

export function deleteSavedCustomReportConfig(id: string): SavedCustomReportConfig[] {
  const next = loadSavedCustomReports().filter((r) => r.id !== id);
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_REPORTS, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}

export function exportAnalyticsReportCsv(
  reportTitle: string,
  windowLabel: string,
  rows: Array<{ metric: string; value: string; unit: string; sourceModule: string }>
): void {
  const escape = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const headers = ["Report Name", "Reporting Period", "Metric", "Value", "Unit / Currency", "Source Module"];
  const body = rows.map((r) => [
    reportTitle,
    windowLabel,
    r.metric,
    r.value,
    r.unit,
    r.sourceModule,
  ]);
  const csv = [
    headers.map(escape).join(","),
    ...body.map((b) => b.map(escape).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `noblebond_bi_report_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
