// NobleBond Admin — Subscription Management Shared UI Utilities
// Centralized status mappings, payment provider labels, currency formatters. Zero emojis.

import type { BadgeVariant } from "../common/Badge";
import type {
  SubscriptionStatus,
  TransactionStatus,
  RefundDisputeStatus,
  PlanStatus,
  PaymentProvider,
  BillingInterval,
} from "../../types/subscriptionManagement.types";

export function formatMoney(amount: number, currencySymbol = "$"): string {
  return `${currencySymbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatShortDate(iso?: string | null): string {
  if (!iso) return "N/A";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(iso?: string | null): string {
  if (!iso) return "N/A";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getSubscriptionStatusMeta(status: SubscriptionStatus): {
  label: string;
  variant: BadgeVariant;
} {
  switch (status) {
    case "active":
      return { label: "Active", variant: "success" };
    case "pending":
      return { label: "Pending", variant: "info" };
    case "past_due":
      return { label: "Past Due", variant: "error" };
    case "grace_period":
      return { label: "Grace Period", variant: "warning" };
    case "paused":
      return { label: "Paused", variant: "neutral" };
    case "cancellation_scheduled":
      return { label: "Cancels at Period End", variant: "warning" };
    case "cancelled":
      return { label: "Cancelled", variant: "neutral" };
    case "expired":
      return { label: "Expired", variant: "neutral" };
    case "refunded":
      return { label: "Refunded", variant: "info" };
    case "payment_failed":
      return { label: "Payment Failed", variant: "error" };
    default:
      return { label: status, variant: "neutral" };
  }
}

export function getTransactionStatusMeta(status: TransactionStatus): {
  label: string;
  variant: BadgeVariant;
} {
  switch (status) {
    case "successful":
      return { label: "Successful", variant: "success" };
    case "pending":
      return { label: "Pending", variant: "warning" };
    case "processing":
      return { label: "Processing", variant: "info" };
    case "failed":
      return { label: "Failed", variant: "error" };
    case "cancelled":
      return { label: "Cancelled", variant: "neutral" };
    case "refunded":
      return { label: "Refunded", variant: "info" };
    case "partially_refunded":
      return { label: "Partially Refunded", variant: "champagne" };
    default:
      return { label: status, variant: "neutral" };
  }
}

export function getRefundStatusMeta(status: RefundDisputeStatus): {
  label: string;
  variant: BadgeVariant;
} {
  switch (status) {
    case "requested":
      return { label: "Requested", variant: "warning" };
    case "under_review":
      return { label: "Under Review", variant: "info" };
    case "approved":
      return { label: "Approved", variant: "success" };
    case "rejected":
      return { label: "Rejected", variant: "error" };
    case "processing":
      return { label: "Processing", variant: "info" };
    case "completed":
      return { label: "Completed", variant: "success" };
    case "failed":
      return { label: "Failed", variant: "error" };
    default:
      return { label: status, variant: "neutral" };
  }
}

export function getPlanStatusMeta(status: PlanStatus): {
  label: string;
  variant: BadgeVariant;
} {
  switch (status) {
    case "active":
      return { label: "Active (Published)", variant: "success" };
    case "inactive":
      return { label: "Inactive (New Signups Off)", variant: "warning" };
    case "archived":
      return { label: "Archived (Legacy Only)", variant: "neutral" };
    case "draft":
      return { label: "Draft", variant: "info" };
    default:
      return { label: status, variant: "neutral" };
  }
}

export function getPaymentProviderLabel(provider: PaymentProvider): string {
  switch (provider) {
    case "stripe_web":
      return "Web Gateway (Stripe / Card)";
    case "apple_app_store":
      return "Apple App Store";
    case "google_play_store":
      return "Google Play Store";
    case "paypal":
      return "PayPal Gateway";
    case "admin_complimentary":
      return "Complimentary Admin Grant";
    default:
      return provider;
  }
}

export function getBillingIntervalLabel(interval: BillingInterval): string {
  switch (interval) {
    case "annual":
      return "12 Months (Annual)";
    case "6_months":
      return "6 Months";
    case "monthly":
      return "Monthly (1 Month)";
    case "weekly":
      return "Weekly (Legacy)";
    default:
      return interval;
  }
}
