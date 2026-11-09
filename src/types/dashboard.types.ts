export type DateRangePeriod =
  | "today"
  | "7d"
  | "30d"
  | "90d"
  | "this_month"
  | "last_month"
  | "custom";

export interface DashboardDateRange {
  period: DateRangePeriod;
  label: string;
  startDate?: string;
  endDate?: string;
}

export interface KpiCardData {
  id: string;
  title: string;
  value: string;
  numericValue: number;
  change: string;
  isPositive: boolean;
  periodLabel: string;
  badge?: {
    text: string;
    variant: "primary" | "success" | "warning" | "error" | "live" | "neutral" | "champagne";
  };
  link: string;
}

export interface ChartDataPoint {
  label: string;
  value1: number; // e.g. New Registrations or Subscriptions
  value2: number; // e.g. Total Users or Coin Sales
  date: string;
}

export interface EngagementMetric {
  id: string;
  name: string;
  count: string;
  change: string;
  isPositive: boolean;
  link: string;
}

export interface RecentUserRecord {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  joinedAt: string;
  isVerified: boolean;
  profileCompletion: number;
  status: "active" | "suspended" | "pending_verification";
}

export interface RecentMatchRecord {
  id: string;
  user1: { name: string; avatar: string };
  user2: { name: string; avatar: string };
  matchedAt: string;
  compatibility: number;
  status: "connected" | "chatting" | "new";
}

export interface LiveStreamOverview {
  id: string;
  title: string;
  hostName: string;
  hostAvatar: string;
  viewers: number;
  guests: number;
  duration: string;
  coinsEarned: number;
  status: "live" | "ended" | "flagged";
  safetyScore: number;
}

export interface ModerationActionItem {
  id: string;
  category: string;
  targetUser: string;
  targetAvatar: string;
  submittedAt: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "open" | "investigating" | "resolved";
  assignedModerator: string;
}

export interface AdminAuditRecord {
  id: string;
  adminName: string;
  adminRole: string;
  action: string;
  targetModule: string;
  timestamp: string;
  status: "success" | "warning" | "info";
}

