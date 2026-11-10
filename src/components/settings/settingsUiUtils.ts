// Pure UI formatting, validation, and search utilities for System Settings & Security Configuration.
// Separated from TSX components to comply with react-refresh/only-export-components. Zero emojis.

import type {
  AvailabilityStatus,
  SettingsSectionKey,
  SystemAlertRecord,
} from "../../types/systemSettings.types";

export const SETTINGS_SECTIONS_META: Array<{
  key: SettingsSectionKey;
  label: string;
  shortLabel: string;
  description: string;
  group: "Platform & Localization" | "Access & Security" | "Privacy & Comms" | "Infrastructure & Audit";
}> = [
  {
    key: "general",
    label: "General Platform Settings",
    shortLabel: "General",
    description: "Global platform identity, support contacts, operational status, and defaults",
    group: "Platform & Localization",
  },
  {
    key: "branding",
    label: "Branding & Appearance",
    shortLabel: "Branding",
    description: "Official logos, favicons, brand assets, file validation, and previews",
    group: "Platform & Localization",
  },
  {
    key: "theme",
    label: "Theme Configuration",
    shortLabel: "Theme",
    description: "Global platform defaults, user override policy, admin theme, and contrast preview",
    group: "Platform & Localization",
  },
  {
    key: "regional",
    label: "Regional & Localization",
    shortLabel: "Regional",
    description: "International countries, mobile language catalog, timezones, and date formats",
    group: "Platform & Localization",
  },
  {
    key: "currency",
    label: "Currency & Financial Config",
    shortLabel: "Currencies",
    description: "Supported fiat currencies, exchange rate status, and strict coin/point boundaries",
    group: "Platform & Localization",
  },
  {
    key: "features",
    label: "Availability & Feature Controls",
    shortLabel: "Features",
    description: "Platform modules, integration readiness, and staged feature availability",
    group: "Platform & Localization",
  },
  {
    key: "authentication",
    label: "Authentication & Security",
    shortLabel: "Auth Security",
    description: "Registration OTP rules, login throttling, password policy, MFA, and security events",
    group: "Access & Security",
  },
  {
    key: "administrators",
    label: "Administrator Accounts",
    shortLabel: "Administrators",
    description: "Admin staff directory, demo invitations, role assignment, and access lifecycle",
    group: "Access & Security",
  },
  {
    key: "roles_permissions",
    label: "Roles & Permissions",
    shortLabel: "Roles & RBAC",
    description: "14-module RBAC permission matrix, cloning, and escalation safeguards",
    group: "Access & Security",
  },
  {
    key: "sessions_security",
    label: "Session & Device Security",
    shortLabel: "Sessions",
    description: "Active administrator sessions, device inventory, and security revocation",
    group: "Access & Security",
  },
  {
    key: "privacy",
    label: "Privacy & Data Protection",
    shortLabel: "Privacy",
    description: "User privacy defaults, statutory retention, export/deletion workflows, and redaction",
    group: "Privacy & Comms",
  },
  {
    key: "policies",
    label: "Content & Community Policies",
    shortLabel: "Policies",
    description: "Safety rules, guideline drafts vs published releases, and policy version history",
    group: "Privacy & Comms",
  },
  {
    key: "notifications",
    label: "Notification Configuration",
    shortLabel: "Notifications",
    description: "Channel provider readiness, 14 alert categories, and system templates",
    group: "Privacy & Comms",
  },
  {
    key: "payments",
    label: "Payment & Billing Integrations",
    shortLabel: "Payments",
    description: "Masked billing providers, webhook checks, and non-secret credential governance",
    group: "Infrastructure & Audit",
  },
  {
    key: "integrations",
    label: "API & External Integrations",
    shortLabel: "Integrations",
    description: "Backend API, Auth, Agora/LiveKit streaming, SMS, and storage connectors",
    group: "Infrastructure & Audit",
  },
  {
    key: "app_versions",
    label: "Application & Versions",
    shortLabel: "App Versions",
    description: "iOS, Android, and Web release versions synchronized with mobile configuration",
    group: "Infrastructure & Audit",
  },
  {
    key: "maintenance_ops",
    label: "Maintenance & Operations",
    shortLabel: "Maintenance",
    description: "Controlled maintenance scheduling, service health, background jobs, and backup status",
    group: "Infrastructure & Audit",
  },
  {
    key: "monitoring_alerts",
    label: "System Monitoring & Alerts",
    shortLabel: "Monitoring",
    description: "Service alerts, incident triage workflow, internal notes, and escalation tracking",
    group: "Infrastructure & Audit",
  },
  {
    key: "audit_history",
    label: "Configuration History & Audit",
    shortLabel: "Audit & Rollback",
    description: "Append-only configuration audit log, two-person approvals, and version rollback",
    group: "Infrastructure & Audit",
  },
];

export function formatSettingsTimestamp(iso: string | null | undefined): string {
  if (!iso) return "Not recorded";
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

export function getAvailabilityColors(status: AvailabilityStatus): { color: string; bg: string } {
  if (status === "enabled") {
    return { color: "var(--status-success)", bg: "var(--status-success-bg)" };
  }
  if (status === "restricted") {
    return { color: "var(--status-warning)", bg: "var(--status-warning-bg)" };
  }
  return { color: "var(--status-error)", bg: "var(--status-error-bg)" };
}

export function getAlertSeverityColors(
  severity: SystemAlertRecord["severity"]
): { color: string; bg: string } {
  switch (severity) {
    case "critical":
    case "high":
      return { color: "var(--status-error)", bg: "var(--status-error-bg)" };
    case "medium":
      return { color: "var(--status-warning)", bg: "var(--status-warning-bg)" };
    case "low":
      return { color: "var(--status-info)", bg: "var(--status-info-bg)" };
    default:
      return { color: "var(--text-secondary)", bg: "var(--bg-surface-elevated)" };
  }
}

export function validateBrandImageFile(file: File, maxSizeKb: number): string | null {
  const validMime = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/x-icon"];
  if (!validMime.includes(file.type)) {
    return `Unsupported file type (${file.type || "unknown"}). Accepted formats: PNG, JPG, WEBP, SVG, ICO.`;
  }
  if (file.size > maxSizeKb * 1024) {
    return `File exceeds maximum allowed size of ${maxSizeKb} KB (${Math.round(file.size / 1024)} KB selected).`;
  }
  return null;
}

