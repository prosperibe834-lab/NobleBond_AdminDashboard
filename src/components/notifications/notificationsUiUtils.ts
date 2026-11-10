// Pure Notification formatting, validation & device preview helper utilities
// Separated from TSX components for react-refresh compliance. Zero emojis.

import type {
  CampaignLifecycleStatus,
  DeliveryTrackingStatus,
  NotificationChannelType,
  PreviewWallpaperKey,
} from "../../types/notificationsManagement.types";

export const ALLOWED_PERSONALIZATION_VARS = [
  "firstName",
  "displayName",
  "appName",
  "referralCode",
  "rewardAmount",
  "subscriptionPlan",
  "deepLink",
  "eventName",
] as const;

export const MOBILE_DEEP_LINKS = [
  { route: "/discover", label: "Discovery Deck (/discover)" },
  { route: "/likes", label: "Likes Inbox (/likes)" },
  { route: "/matches", label: "Matches Hub (/matches)" },
  { route: "/chats", label: "Messages / Chats (/chats)" },
  { route: "/live", label: "Live Streaming Hub (/live)" },
  { route: "premium", label: "NobleBond Premium Upgrade (premium)" },
  { route: "/referral", label: "Invite & Earn 50 Pts (/referral)" },
  { route: "/wallet", label: "Gift Coins & Connection Points Wallet (/wallet)" },
  { route: "/profile", label: "Member Profile (/profile)" },
  { route: "/notifications", label: "In-App Notifications Centre (/notifications)" },
];

export const WALLPAPER_BACKGROUNDS: Record<
  PreviewWallpaperKey,
  { label: string; gradient: string }
> = {
  rose_twilight: {
    label: "NobleBond Rose Twilight",
    gradient: "linear-gradient(155deg, #2B1024 0%, #7C1D4B 48%, #411F5B 100%)",
  },
  plum_midnight: {
    label: "Plum Midnight",
    gradient: "linear-gradient(155deg, #151019 0%, #3A1D42 52%, #1E132B 100%)",
  },
  champagne_dawn: {
    label: "Champagne Sunset",
    gradient: "linear-gradient(155deg, #4A2736 0%, #9E6844 55%, #C12F66 100%)",
  },
  obsidian: {
    label: "Obsidian Titanium",
    gradient: "linear-gradient(155deg, #0D0F14 0%, #1F2430 60%, #14171F 100%)",
  },
};

export function validateTemplateVariables(text: string): {
  isValid: boolean;
  unknownVars: string[];
  hasUnclosedBraces: boolean;
} {
  const unclosedOpen = (text.match(/\{\{/g) || []).length;
  const unclosedClose = (text.match(/\}\}/g) || []).length;
  const hasUnclosedBraces = unclosedOpen !== unclosedClose;

  const found = [...text.matchAll(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g)].map((m) => m[1]);
  const allowed = new Set<string>(ALLOWED_PERSONALIZATION_VARS);
  const unknownVars = found.filter((v) => !allowed.has(v));

  return {
    isValid: !hasUnclosedBraces && unknownVars.length === 0,
    unknownVars,
    hasUnclosedBraces,
  };
}

export function renderSampleVariables(text: string): string {
  return text
    .replace(/\{\{\s*firstName\s*\}\}/g, "Amara")
    .replace(/\{\{\s*displayName\s*\}\}/g, "Amara Okafor")
    .replace(/\{\{\s*appName\s*\}\}/g, "NobleBond")
    .replace(/\{\{\s*referralCode\s*\}\}/g, "NB-AMARA9")
    .replace(/\{\{\s*rewardAmount\s*\}\}/g, "50 Pts")
    .replace(/\{\{\s*subscriptionPlan\s*\}\}/g, "12 Months Premium")
    .replace(/\{\{\s*deepLink\s*\}\}/g, "noblebond://discover")
    .replace(/\{\{\s*eventName\s*\}\}/g, "Weekend Celebration");
}

export function formatNotifDateTime(iso: string | undefined | null): string {
  if (!iso) return "--";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatChannelLabel(ch: NotificationChannelType): string {
  if (ch === "push_and_in_app") return "Push + In-App";
  if (ch === "in_app") return "In-App";
  if (ch === "push") return "Push";
  return "Email";
}

export function getStatusBadgeStyle(
  status: CampaignLifecycleStatus | DeliveryTrackingStatus
): { color: string; bg: string } {
  switch (status) {
    case "delivered":
    case "opened":
    case "clicked":
      return { color: "var(--status-success)", bg: "var(--status-success-bg)" };
    case "sent":
    case "scheduled":
    case "queued":
    case "sending":
      return { color: "var(--status-info)", bg: "var(--status-info-bg)" };
    case "paused":
    case "suppressed":
      return { color: "var(--status-warning)", bg: "var(--status-warning-bg)" };
    case "failed":
    case "bounced":
    case "cancelled":
      return { color: "var(--status-error)", bg: "var(--status-error-bg)" };
    default:
      return { color: "var(--text-secondary)", bg: "var(--bg-surface-elevated)" };
  }
}

