// Pure Analytics formatting utilities & metric delta helpers
// Separated from TSX components to satisfy eslint react-refresh/only-export-components. Zero emojis.

import type { AnalyticsDateRange } from "../../types/analyticsManagement.types";

export function formatMoneyUsd(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || Number.isNaN(amount)) {
    return "Unavailable";
  }
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatCoinsQty(coins: number | undefined | null): string {
  if (coins === undefined || coins === null || Number.isNaN(coins)) return "0 Coins";
  return `${Math.round(coins).toLocaleString("en-US")} Coins`;
}

export function formatPointsQty(points: number | undefined | null): string {
  if (points === undefined || points === null || Number.isNaN(points)) return "0 Pts";
  return `${Math.round(points).toLocaleString("en-US")} Pts`;
}

export function formatPercent(val: number | undefined | null): string {
  if (val === undefined || val === null || Number.isNaN(val)) return "Unavailable";
  return `${Number(val.toFixed(1))}%`;
}

export function computePercentChange(
  current: number,
  previous: number | null | undefined
): number | null {
  if (previous === null || previous === undefined || previous <= 0) return null;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

export function formatDateRangeLabel(
  range: AnalyticsDateRange,
  customStart?: string,
  customEnd?: string
): string {
  const labels: Record<AnalyticsDateRange, string> = {
    today: "Today (2026-11-10)",
    yesterday: "Yesterday (2026-11-09)",
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    "90d": "Last 90 Days",
    "6m": "Last 6 Months",
    "12m": "Last 12 Months",
    this_month: "This Month (Nov 2026)",
    prev_month: "Previous Month (Oct 2026)",
    this_year: "Year to Date (2026)",
    all: "All Available History",
    custom:
      customStart || customEnd
        ? `${customStart || "Start"} to ${customEnd || "Today"}`
        : "Custom Range",
  };
  return labels[range] || range;
}

export function formatShortDate(iso: string | undefined): string {
  if (!iso) return "--";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "--";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

