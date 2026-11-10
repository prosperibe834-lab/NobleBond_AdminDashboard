// Pure UI utilities & badge meta formatters for Wallet & Financial Management
// Separated from TSX components to satisfy ESLint react-refresh/only-export-components. Zero emojis.

import type {
  FinancialCategory,
  FinancialTxStatus,
  ReconciliationStatus,
  RewardIssuanceStatus,
  UnifiedFinancialTransaction,
} from "../../types/walletManagement.types";

export function formatMoney(amount: number | undefined, symbol = "$"): string {
  if (amount === undefined || Number.isNaN(amount)) return `${symbol}0.00`;
  return `${symbol}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatCoins(coins: number | undefined): string {
  if (coins === undefined || Number.isNaN(coins)) return "0 Coins";
  return `${Math.round(coins).toLocaleString("en-US")} Coins`;
}

export function formatPoints(points: number | undefined): string {
  if (points === undefined || Number.isNaN(points)) return "0 Pts";
  return `${Math.round(points).toLocaleString("en-US")} Pts`;
}

export function formatTxValue(tx: UnifiedFinancialTransaction): {
  primaryText: string;
  unitLabel: string;
  toneColor: string;
} {
  if (tx.isMonetary && tx.fiatAmount !== undefined) {
    const sign = tx.direction === "debit" ? "-" : "+";
    return {
      primaryText: `${sign}${formatMoney(tx.fiatAmount, tx.fiatSymbol || "$")}`,
      unitLabel: tx.fiatCurrency || "USD",
      toneColor:
        tx.status === "refunded" || tx.status === "failed"
          ? "var(--status-error)"
          : tx.status === "pending"
          ? "var(--status-warning)"
          : "var(--status-success)",
    };
  }
  if (tx.virtualUnit === "COINS") {
    const sign =
      tx.direction === "credit" ? "+" : tx.direction === "debit" ? "-" : "";
    return {
      primaryText: `${sign}${(tx.virtualQuantity || 0).toLocaleString("en-US")} Coins`,
      unitLabel: "GIFT COINS",
      toneColor: "var(--accent-champagne)",
    };
  }
  if (tx.virtualUnit === "POINTS") {
    const sign =
      tx.direction === "credit" ? "+" : tx.direction === "debit" ? "-" : "";
    return {
      primaryText: `${sign}${(tx.virtualQuantity || 0).toLocaleString("en-US")} Pts`,
      unitLabel: "CONNECTION POINTS",
      toneColor: "var(--accent-lavender)",
    };
  }
  return {
    primaryText: "--",
    unitLabel: "N/A",
    toneColor: "var(--text-muted)",
  };
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

export function formatDateTime(iso: string | undefined): string {
  if (!iso) return "--";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "--";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getCategoryMeta(category: FinancialCategory): {
  label: string;
  shortLabel: string;
  variant: "champagne" | "info" | "success" | "primary";
  accentColor: string;
  accentBg: string;
  unitNote: string;
} {
  if (category === "gift_coins") {
    return {
      label: "Gift Coins",
      shortLabel: "Coins",
      variant: "champagne",
      accentColor: "var(--accent-champagne)",
      accentBg: "var(--accent-champagne-bg)",
      unitNote: "Virtual Live Gifting",
    };
  }
  if (category === "connection_points") {
    return {
      label: "Connection Points",
      shortLabel: "Points",
      variant: "info",
      accentColor: "var(--accent-lavender)",
      accentBg: "var(--accent-lavender-bg)",
      unitNote: "Non-Cash Engagement",
    };
  }
  return {
    label: "Premium Subscription",
    shortLabel: "Premium USD",
    variant: "success",
    accentColor: "var(--status-success)",
    accentBg: "var(--status-success-bg)",
    unitNote: "Real Money Billing",
  };
}

export function getTxStatusMeta(status: FinancialTxStatus): {
  label: string;
  variant: "success" | "warning" | "error" | "info" | "neutral" | "champagne";
} {
  switch (status) {
    case "completed":
      return { label: "Completed", variant: "success" };
    case "pending":
      return { label: "Pending", variant: "warning" };
    case "failed":
      return { label: "Failed", variant: "error" };
    case "refunded":
      return { label: "Refunded", variant: "champagne" };
    case "reversed":
      return { label: "Reversed", variant: "neutral" };
    case "disputed":
      return { label: "Disputed", variant: "error" };
    default:
      return { label: status, variant: "neutral" };
  }
}

export function getRewardStatusMeta(status: RewardIssuanceStatus): {
  label: string;
  variant: "success" | "warning" | "error" | "info" | "neutral" | "champagne";
} {
  switch (status) {
    case "issued":
      return { label: "Issued", variant: "success" };
    case "eligible":
      return { label: "Eligible", variant: "info" };
    case "pending":
      return { label: "Awaiting OTP", variant: "warning" };
    case "rejected":
      return { label: "Rejected", variant: "error" };
    case "reversed":
      return { label: "Reversed", variant: "neutral" };
    default:
      return { label: status, variant: "neutral" };
  }
}

export function getReconciliationStatusMeta(status: ReconciliationStatus): {
  label: string;
  variant: "success" | "warning" | "error" | "info" | "neutral" | "champagne";
} {
  switch (status) {
    case "matched":
      return { label: "Matched", variant: "success" };
    case "resolved":
      return { label: "Resolved", variant: "info" };
    case "pending_review":
      return { label: "Pending Review", variant: "warning" };
    case "mismatch":
      return { label: "Mismatch", variant: "error" };
    case "escalated":
      return { label: "Escalated", variant: "champagne" };
    default:
      return { label: status, variant: "neutral" };
  }
}

export function formatPaymentProviderLabel(provider: string | undefined): string {
  switch (provider) {
    case "apple_app_store":
      return "Apple App Store IAP";
    case "google_play_store":
      return "Google Play Billing";
    case "stripe_web":
      return "Stripe Web Checkout";
    case "paypal":
      return "PayPal Checkout";
    case "admin_complimentary":
      return "Admin Complimentary";
    default:
      return provider || "System Ledger";
  }
}

export function getTxTypeLabel(type: string): string {
  const map: Record<string, string> = {
    gift_coin_purchase: "Coin Package Purchase",
    gift_sent: "Live Gift Sent",
    gift_received: "Live Gift Received",
    gift_coin_adjustment: "Coin Ledger Adjustment",
    gift_coin_reversal: "Coin Reversal",
    connection_points_referral: "Referral Points Issued",
    connection_points_redemption: "Perk Redemption",
    connection_points_adjustment: "Points Adjustment",
    connection_points_reversal: "Points Reversal",
    premium_subscription_payment: "Subscription Payment",
    premium_subscription_renewal: "Subscription Renewal",
    premium_subscription_refund: "Subscription Refund",
  };
  return map[type] || type;
}

