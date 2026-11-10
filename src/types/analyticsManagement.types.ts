// NobleBond Admin — Platform-Wide Business Intelligence & Analytics Type Definitions
// Enforces 19 BI sections, standardized metric formulas, 3-way currency/unit separation,
// 9 RBAC analytics permissions, honest uninstrumented metric flags, and zero emojis.

export type AnalyticsTabKey =
  | "executive_overview"
  | "user_analytics"
  | "acquisition_analytics"
  | "profile_analytics"
  | "likes_matches_analytics"
  | "chat_engagement_analytics"
  | "live_streaming_analytics"
  | "gift_coins_analytics"
  | "connection_points_analytics"
  | "premium_revenue_analytics"
  | "referral_analytics"
  | "support_analytics"
  | "moderation_analytics"
  | "notifications_analytics"
  | "geographic_analytics"
  | "retention_cohort_analytics"
  | "feature_usage_analytics"
  | "platform_reliability_analytics"
  | "custom_reports";

export type AnalyticsDateRange =
  | "today"
  | "yesterday"
  | "7d"
  | "30d"
  | "90d"
  | "6m"
  | "12m"
  | "this_month"
  | "prev_month"
  | "this_year"
  | "all"
  | "custom";

export type AnalyticsComparisonPeriod =
  | "prev_period"
  | "prev_month"
  | "prev_quarter"
  | "prev_year"
  | "custom";

export type AnalyticsTimeGranularity = "daily" | "weekly" | "monthly";

export type AnalyticsRoleKey =
  | "super_admin"
  | "finance_revenue_lead"
  | "growth_product_lead"
  | "safety_support_lead";

// 9 Explicit Analytics Permissions (Prompt Section 32)
export interface AnalyticsRolePermissions {
  role: AnalyticsRoleKey;
  roleLabel: string;
  canViewGeneralAnalytics: boolean;
  canViewUserAnalytics: boolean;
  canViewRevenueAnalytics: boolean;
  canViewFinancialAnalytics: boolean;
  canViewGeographicAnalytics: boolean;
  canViewModerationAnalytics: boolean;
  canViewSupportAnalytics: boolean;
  canExportAnalytics: boolean;
  canCreateCustomReports: boolean;
}

export interface AnalyticsGlobalFilterState {
  dateRange: AnalyticsDateRange;
  customStartDate?: string;
  customEndDate?: string;
  comparisonPeriod: AnalyticsComparisonPeriod;
  compareStartDate?: string;
  compareEndDate?: string;
  granularity: AnalyticsTimeGranularity;
  country: string;
  platform: "all" | "ios" | "android" | "web";
  userStatus: "all" | "active" | "online" | "suspended" | "banned" | "pending_verification";
  subscriptionPlan: "all" | "free" | "1-month" | "6-months" | "12-months";
  referralSource: "all" | "organic" | "referral";
  liveCategory: string;
  transactionCategory: "all" | "premium_subscription" | "gift_coins" | "connection_points";
  userSegment: "all" | "verified" | "unverified" | "premium" | "free" | "referred" | "completed_profile";
}

export interface MetricDefinition {
  id: string;
  name: string;
  formula: string;
  sourceModule: string;
  caveat?: string;
}

export interface PeriodDeltaMetric {
  currentValue: number;
  previousValue: number | null;
  percentChange: number | null; // null if previousValue <= 0 or unavailable
  isUnavailableCompare: boolean;
}

export interface DrilldownPayload {
  title: string;
  subtitle: string;
  sourceModuleLabel: string;
  targetRoute: string;
  rows: Array<{ label: string; value: string; hint?: string }>;
  methodologyNote: string;
}

export interface SavedCustomReportConfig {
  id: string;
  name: string;
  category: AnalyticsTabKey;
  selectedMetricIds: string[];
  filtersSnapshot: AnalyticsGlobalFilterState;
  createdBy: string;
  createdAt: string;
}

export interface BusinessInsightItem {
  id: string;
  severity: "positive" | "warning" | "info";
  title: string;
  explanation: string;
  metricLabel: string;
  supportingNumbers: string;
  targetTab: AnalyticsTabKey;
}

