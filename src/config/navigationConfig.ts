import {
  LayoutDashboard,
  Users,
  UserRound,
  HeartHandshake,
  MessagesSquare,
  RadioTower,
  ShieldAlert,
  Bell,
  Crown,
  Wallet,
  Gift,
  Headset,
  ChartNoAxesCombined,
  Settings,
} from "lucide-react";
import type { NavigationGroup } from "../types/navigation.types";

export const NAVIGATION_GROUPS: NavigationGroup[] = [
  {
    id: "overview",
    label: "OVERVIEW",
    items: [
      {
        id: "dashboard",
        name: "Dashboard",
        path: "/",
        icon: LayoutDashboard,
        description: "Executive platform overview, user growth, and live activity metrics",
      },
    ],
  },
  {
    id: "user-management",
    label: "USER MANAGEMENT",
    items: [
      {
        id: "users",
        name: "User Management",
        path: "/users",
        icon: Users,
        badge: { text: "1.28M", variant: "neutral" },
        description: "Accounts, verification statuses, suspensions, and restrictions",
      },
      {
        id: "profiles",
        name: "Profile Management",
        path: "/profiles",
        icon: UserRound,
        badge: { text: "24", variant: "warning" },
        description: "Profile photo review queue, completeness, and verified badges",
      },
      {
        id: "matches",
        name: "Likes & Matches",
        path: "/matches",
        icon: HeartHandshake,
        description: "Mutual matches, swiping behavior, and relationship monitoring",
      },
      {
        id: "chats",
        name: "Chat Management",
        path: "/chats",
        icon: MessagesSquare,
        badge: { text: "7", variant: "warning" },
        description: "Reported conversation moderation and safety enforcement",
      },
    ],
  },
  {
    id: "live-community",
    label: "LIVE & COMMUNITY",
    items: [
      {
        id: "live",
        name: "Live Management",
        path: "/live",
        icon: RadioTower,
        badge: { text: "LIVE 42", variant: "live" },
        description: "Active broadcasts, multi-guest streams, and live safety controls",
      },
      {
        id: "moderation",
        name: "Reports & Moderation",
        path: "/moderation",
        icon: ShieldAlert,
        badge: { text: "18", variant: "error" },
        description: "User reports, impersonation flags, harassment appeals, and bans",
      },
      {
        id: "notifications",
        name: "Notifications",
        path: "/notifications",
        icon: Bell,
        description: "Global announcements, push campaigns, and automated message alerts",
      },
    ],
  },
  {
    id: "business-revenue",
    label: "BUSINESS & REVENUE",
    items: [
      {
        id: "subscriptions",
        name: "Subscription Management",
        path: "/subscriptions",
        icon: Crown,
        badge: { text: "PRO", variant: "primary" },
        description: "NobleBond Premium plans, pricing, renewals, and subscriber tiers",
      },
      {
        id: "wallet",
        name: "Wallet Management",
        path: "/wallet",
        icon: Wallet,
        description: "Gift Coins packages, Connection Points ledger, and gift disputes",
      },
      {
        id: "referrals",
        name: "Referral Management",
        path: "/referrals",
        icon: Gift,
        badge: { text: "+50 Pts", variant: "primary" },
        description: "Invite & Earn performance, qualifying signups, and point rewards",
      },
    ],
  },
  {
    id: "support-insights",
    label: "SUPPORT & INSIGHTS",
    items: [
      {
        id: "support",
        name: "Customer Support",
        path: "/support",
        icon: Headset,
        badge: { text: "9 Open", variant: "warning" },
        description: "User support tickets, complaints, live inquiries, and SLA tracking",
      },
      {
        id: "analytics",
        name: "Analytics",
        path: "/analytics",
        icon: ChartNoAxesCombined,
        description: "Platform growth, retention cohorts, revenue streams, and DAU/MAU",
      },
    ],
  },
  {
    id: "configuration",
    label: "CONFIGURATION",
    items: [
      {
        id: "settings",
        name: "System Settings",
        path: "/settings",
        icon: Settings,
        description: "Platform branding, API keys, security policies, and team permissions",
      },
    ],
  },
];
