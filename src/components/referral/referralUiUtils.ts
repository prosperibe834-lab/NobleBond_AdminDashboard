// Pure UI helpers & status meta formatters for Referral Management
// Separated from TSX components to satisfy ESLint react-refresh/only-export-components. Zero emojis.

import type {
  FraudReviewStatus,
  FraudRiskLevel,
  PrimaryReferralStatus,
  ReferralQualificationStatus,
  ReferralRewardStatus,
} from "../../types/referralManagement.types";

export function formatReferralPoints(points: number | undefined): string {
  if (points === undefined || Number.isNaN(points)) return "0 Pts";
  return `${Math.round(points).toLocaleString("en-US")} Pts`;
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

export function getPrimaryReferralStatusMeta(status: PrimaryReferralStatus): {
  label: string;
  variant: "success" | "warning" | "error";
} {
  if (status === "successful") return { label: "Successful", variant: "success" };
  if (status === "pending") return { label: "Pending", variant: "warning" };
  return { label: "Rejected", variant: "error" };
}

export function getQualificationStatusMeta(status: ReferralQualificationStatus): {
  label: string;
  variant: "success" | "warning" | "error" | "info" | "neutral";
} {
  switch (status) {
    case "qualified":
      return { label: "Qualified", variant: "success" };
    case "awaiting_email_verification":
      return { label: "Awaiting Email OTP", variant: "warning" };
    case "awaiting_phone_verification":
      return { label: "Awaiting Phone OTP", variant: "warning" };
    case "awaiting_either_verification":
      return { label: "Awaiting Email/Phone OTP", variant: "warning" };
    case "awaiting_validation":
      return { label: "Awaiting Validation", variant: "info" };
    case "under_review":
      return { label: "Under Review", variant: "champagne" as "warning" };
    case "ineligible_self_referral":
      return { label: "Self-Referral Blocked", variant: "error" };
    case "ineligible_duplicate":
      return { label: "Duplicate Blocked", variant: "error" };
    case "ineligible_invalid_attribution":
      return { label: "Invalid Attribution", variant: "error" };
    case "ineligible_fraud":
      return { label: "Fraud Ineligible", variant: "error" };
    default:
      return { label: status, variant: "neutral" };
  }
}

export function getRewardStatusMeta(status: ReferralRewardStatus): {
  label: string;
  variant: "success" | "warning" | "error" | "info" | "neutral" | "champagne";
} {
  switch (status) {
    case "issued":
      return { label: "Issued", variant: "success" };
    case "eligible":
      return { label: "Eligible (Unissued)", variant: "info" };
    case "pending":
      return { label: "Pending", variant: "warning" };
    case "failed":
      return { label: "Failed", variant: "error" };
    case "rejected":
      return { label: "Rejected", variant: "error" };
    case "reversed":
      return { label: "Reversed", variant: "neutral" };
    default:
      return { label: status, variant: "neutral" };
  }
}

export function getFraudStatusMeta(status: FraudReviewStatus): {
  label: string;
  variant: "success" | "warning" | "error" | "info" | "neutral" | "champagne";
} {
  switch (status) {
    case "pending_review":
      return { label: "Pending Review", variant: "warning" };
    case "under_investigation":
      return { label: "Under Investigation", variant: "info" };
    case "cleared":
      return { label: "Cleared", variant: "success" };
    case "rejected":
      return { label: "Rejected", variant: "error" };
    case "escalated":
      return { label: "Escalated", variant: "champagne" };
    default:
      return { label: status, variant: "neutral" };
  }
}

export function getRiskLevelMeta(level: FraudRiskLevel): {
  label: string;
  variant: "success" | "warning" | "error" | "info";
} {
  switch (level) {
    case "critical":
      return { label: "Critical Signal", variant: "error" };
    case "high":
      return { label: "High Risk", variant: "error" };
    case "medium":
      return { label: "Medium Risk", variant: "warning" };
    default:
      return { label: "Low Signal", variant: "info" };
  }
}

