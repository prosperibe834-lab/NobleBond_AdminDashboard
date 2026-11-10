// NobleBond Admin — Centralized System Settings & Security Configuration Service
// Coherent local demonstration configuration store referencing real mobile & admin modules.
// Never stores passwords, hashes, OTP secrets, or live API keys in frontend storage. Zero emojis.

import logoLight from "../assets/adminlogo/noblebond-light.png";
import logoDark from "../assets/adminlogo/noblebond-dark.png";
import logoMark from "../assets/adminlogo/noblebond-mark.png";
import faviconAsset from "../assets/adminlogo/favicon.png";
import type {
  AdminAccountRecord,
  AdminRoleId,
  AdminSessionRecord,
  AppVersionRecord,
  BackgroundJobRecord,
  BrandAssetConfig,
  CommunityPolicyRecord,
  ConfigAuditLogRecord,
  ConfigVersionSnapshot,
  CountryConfigRecord,
  CurrencyConfigRecord,
  ExchangeRatePair,
  ExternalIntegrationRecord,
  FeatureFlagRecord,
  LanguageConfigRecord,
  ModulePermissionGroup,
  NotificationCategoryConfig,
  NotificationChannelConfig,
  PaymentIntegrationRecord,
  PendingTwoPersonApproval,
  RbacRoleDefinition,
  SecurityEventRecord,
  SettingsSectionKey,
  SystemAlertRecord,
  SystemServiceHealthRecord,
  SystemSettingsRootState,
} from "../types/systemSettings.types";
import { SETTINGS_SECTIONS_META } from "../components/settings/settingsUiUtils";

const STORAGE_KEY = "noblebond_admin_system_settings_v1";

// 14-Module Enterprise Permission Catalog (Prompt Section 11B)
export const PERMISSION_GROUPS: ModulePermissionGroup[] = [
  {
    moduleKey: "dashboard",
    moduleLabel: "Dashboard",
    permissions: [
      { key: "dashboard.view", label: "View Dashboard", description: "Access executive overview screen" },
      { key: "dashboard.stats", label: "View Global Statistics", description: "Read KPI rollup cards" },
    ],
  },
  {
    moduleKey: "users",
    moduleLabel: "User Management",
    permissions: [
      { key: "users.view", label: "View Users", description: "Inspect member accounts directory" },
      { key: "users.edit", label: "Edit Users", description: "Update account fields & notes" },
      { key: "users.suspend", label: "Suspend Users", description: "Apply temporary suspensions" },
      { key: "users.ban", label: "Ban Users", description: "Apply permanent platform bans" },
      { key: "users.delete", label: "Delete Users", description: "Execute compliance deletions" },
      { key: "users.verify", label: "Verify Users", description: "Grant or revoke verification" },
    ],
  },
  {
    moduleKey: "profiles",
    moduleLabel: "Profile Management",
    permissions: [
      { key: "profiles.view", label: "View Profiles", description: "Browse member profiles" },
      { key: "profiles.review", label: "Review Profiles", description: "Triage profile moderation queue" },
      { key: "profiles.approve", label: "Approve Content", description: "Approve uploaded profile media" },
      { key: "profiles.reject", label: "Reject Content", description: "Remove policy-violating media" },
    ],
  },
  {
    moduleKey: "matches",
    moduleLabel: "Likes & Matches",
    permissions: [
      { key: "matches.view_likes", label: "View Likes", description: "Inspect directional likes log" },
      { key: "matches.view_matches", label: "View Matches", description: "Inspect mutual matches ledger" },
      { key: "matches.manage", label: "Manage Records", description: "Close or audit flagged pairings" },
    ],
  },
  {
    moduleKey: "chats",
    moduleLabel: "Chat Management",
    permissions: [
      { key: "chats.metadata", label: "View Chat Metadata", description: "Inspect conversation health telemetry" },
      { key: "chats.review_reported", label: "Review Reported Messages", description: "Inspect flagged snippets only" },
      { key: "chats.restrict", label: "Manage Restrictions", description: "Mute or restrict abusive messaging" },
    ],
  },
  {
    moduleKey: "live",
    moduleLabel: "Live Management",
    permissions: [
      { key: "live.view", label: "View Live Sessions", description: "Monitor active broadcasts" },
      { key: "live.hosts", label: "Monitor Hosts", description: "Inspect live host permissions" },
      { key: "live.reports", label: "Review Live Reports", description: "Triage broadcast reports" },
      { key: "live.guests", label: "Manage Guest Seats", description: "Remove or restrict live guests" },
      { key: "live.actions", label: "Perform Live Actions", description: "Terminate policy-violating streams" },
    ],
  },
  {
    moduleKey: "moderation",
    moduleLabel: "Reports & Moderation",
    permissions: [
      { key: "mod.view", label: "View Reports", description: "Access safety reports inbox" },
      { key: "mod.assign", label: "Assign Reports", description: "Route cases across moderators" },
      { key: "mod.investigate", label: "Investigate Reports", description: "Inspect safety evidence" },
      { key: "mod.warn", label: "Issue Warnings", description: "Send formal warning notices" },
      { key: "mod.restrict", label: "Restrict Accounts", description: "Apply feature or account bans" },
      { key: "mod.remove", label: "Remove Content", description: "Delete abusive media/bio text" },
      { key: "mod.appeals", label: "Review Appeals", description: "Adjudicate member appeals" },
    ],
  },
  {
    moduleKey: "notifications",
    moduleLabel: "Notifications",
    permissions: [
      { key: "notif.view", label: "View Notifications", description: "Read broadcast campaign history" },
      { key: "notif.manage", label: "Manage Configuration", description: "Configure broadcasts & alerts" },
    ],
  },
  {
    moduleKey: "subscriptions",
    moduleLabel: "Subscription Management",
    permissions: [
      { key: "sub.view", label: "View Subscriptions", description: "Inspect subscriber statuses" },
      { key: "sub.plans", label: "Manage Plans", description: "Configure Premium tiers" },
      { key: "sub.billing", label: "Review Billing", description: "Inspect invoice records" },
      { key: "sub.refunds", label: "Review Refunds", description: "Handle refund & dispute queue" },
    ],
  },
  {
    moduleKey: "wallet",
    moduleLabel: "Wallet & Financial Management",
    permissions: [
      { key: "wallet.coins", label: "View Gift Coins", description: "Inspect virtual coin pack & gift flow" },
      { key: "wallet.points", label: "View Connection Points", description: "Inspect non-cash rewards ledger" },
      { key: "wallet.premium_tx", label: "View Premium Tx", description: "Inspect subscription payment stream" },
      { key: "wallet.balances", label: "View Wallets", description: "Inspect member balance snapshots" },
      { key: "wallet.adjust", label: "Issue Adjustments", description: "Perform approved ledger credits/debits" },
      { key: "wallet.reconcile", label: "Review Reconciliation", description: "Resolve ledger discrepancies" },
      { key: "wallet.audit", label: "View Financial Audit", description: "Inspect immutable financial logs" },
    ],
  },
  {
    moduleKey: "referrals",
    moduleLabel: "Referral Management",
    permissions: [
      { key: "ref.view", label: "View Referrals", description: "Inspect referral attributions" },
      { key: "ref.config", label: "Manage Configuration", description: "Update OTP & points settings" },
      { key: "ref.fraud", label: "Review Fraud Cases", description: "Inspect duplicate/self-ref alerts" },
      { key: "ref.rewards", label: "Approve Rewards", description: "Approve qualified 50 Pt issuances" },
    ],
  },
  {
    moduleKey: "support",
    moduleLabel: "Customer Support",
    permissions: [
      { key: "sup.view", label: "View Tickets", description: "Access support inbox" },
      { key: "sup.reply", label: "Reply to Customers", description: "Respond to member inquiries" },
      { key: "sup.assign", label: "Assign Tickets", description: "Route tickets to agents" },
      { key: "sup.escalate", label: "Escalate Tickets", description: "Escalate critical billing/safety issues" },
      { key: "sup.settings", label: "Manage Support Settings", description: "Configure SLA thresholds" },
    ],
  },
  {
    moduleKey: "analytics",
    moduleLabel: "Analytics",
    permissions: [
      { key: "ana.general", label: "View General Analytics", description: "Access product & dating trends" },
      { key: "ana.finance", label: "View Financial Analytics", description: "Access USD MRR & IAP metrics" },
      { key: "ana.export", label: "Export Analytics", description: "Download BI reports as CSV" },
    ],
  },
  {
    moduleKey: "settings",
    moduleLabel: "System Settings",
    permissions: [
      { key: "set.view", label: "View Settings", description: "Open System Settings sections" },
      { key: "set.general", label: "Modify General Settings", description: "Edit platform profile & defaults" },
      { key: "set.theme", label: "Manage Theme Defaults", description: "Configure global light/dark defaults" },
      { key: "set.regional", label: "Manage Regional Settings", description: "Control country/language availability" },
      { key: "set.currency", label: "Manage Currency Config", description: "Manage currencies & rate visibility" },
      { key: "set.security", label: "Manage Security Policies", description: "Edit password, OTP & MFA policies" },
      { key: "set.integrations", label: "Manage Integrations", description: "Manage API, payment & app versions" },
      { key: "set.admins", label: "Manage Admin Accounts", description: "Invite, suspend or update staff" },
      { key: "set.roles", label: "Manage Roles & Perms", description: "Edit RBAC matrix & rollback configs" },
    ],
  },
];

const buildAllPermissions = (flag: boolean, overrides: Record<string, boolean> = {}) => {
  const result: Record<string, boolean> = {};
  for (const grp of PERMISSION_GROUPS) {
    for (const p of grp.permissions) {
      result[p.key] = flag;
    }
  }
  return { ...result, ...overrides };
};

const INITIAL_ROLES: RbacRoleDefinition[] = [
  {
    id: "super_admin",
    name: "Super Administrator",
    description: "Unrestricted control across platform configuration, security policies, billing, and RBAC.",
    isSystemRole: true,
    isActive: true,
    isProtectedSuperRole: true,
    grantedPermissions: buildAllPermissions(true),
    createdAt: "2025-08-01T09:00:00Z",
    updatedAt: "2026-11-01T10:00:00Z",
  },
  {
    id: "administrator",
    name: "Platform Administrator",
    description: "Operational oversight across community, localization, features, and support; cannot alter Super Admin RBAC.",
    isSystemRole: true,
    isActive: true,
    isProtectedSuperRole: false,
    grantedPermissions: buildAllPermissions(true, {
      "users.delete": false,
      "set.roles": false,
      "set.admins": false,
    }),
    createdAt: "2025-08-01T09:00:00Z",
    updatedAt: "2026-10-18T14:20:00Z",
  },
  {
    id: "finance_admin",
    name: "Finance Administrator",
    description: "Scoped to Subscriptions, Wallet ledgers, Currency configuration, and financial analytics.",
    isSystemRole: true,
    isActive: true,
    isProtectedSuperRole: false,
    grantedPermissions: buildAllPermissions(false, {
      "dashboard.view": true,
      "dashboard.stats": true,
      "sub.view": true,
      "sub.plans": true,
      "sub.billing": true,
      "sub.refunds": true,
      "wallet.coins": true,
      "wallet.points": true,
      "wallet.premium_tx": true,
      "wallet.balances": true,
      "wallet.adjust": true,
      "wallet.reconcile": true,
      "wallet.audit": true,
      "ana.general": true,
      "ana.finance": true,
      "ana.export": true,
      "set.view": true,
      "set.currency": true,
    }),
    createdAt: "2025-09-10T11:00:00Z",
    updatedAt: "2026-10-22T09:15:00Z",
  },
  {
    id: "moderator",
    name: "Safety Moderator",
    description: "Focuses on Trust & Safety reports, profile reviews, live moderation, and chat restrictions.",
    isSystemRole: true,
    isActive: true,
    isProtectedSuperRole: false,
    grantedPermissions: buildAllPermissions(false, {
      "dashboard.view": true,
      "users.view": true,
      "users.suspend": true,
      "users.verify": true,
      "profiles.view": true,
      "profiles.review": true,
      "profiles.approve": true,
      "profiles.reject": true,
      "chats.metadata": true,
      "chats.review_reported": true,
      "chats.restrict": true,
      "live.view": true,
      "live.hosts": true,
      "live.reports": true,
      "live.guests": true,
      "live.actions": true,
      "mod.view": true,
      "mod.assign": true,
      "mod.investigate": true,
      "mod.warn": true,
      "mod.restrict": true,
      "mod.remove": true,
      "mod.appeals": true,
      "set.view": true,
    }),
    createdAt: "2025-09-10T11:00:00Z",
    updatedAt: "2026-10-28T16:40:00Z",
  },
  {
    id: "support_agent",
    name: "Support Agent",
    description: "Manages Customer Support tickets, replies, and member account troubleshooting.",
    isSystemRole: true,
    isActive: true,
    isProtectedSuperRole: false,
    grantedPermissions: buildAllPermissions(false, {
      "dashboard.view": true,
      "users.view": true,
      "profiles.view": true,
      "sup.view": true,
      "sup.reply": true,
      "sup.assign": true,
      "sup.escalate": true,
      "set.view": true,
    }),
    createdAt: "2025-09-10T11:00:00Z",
    updatedAt: "2026-11-02T12:00:00Z",
  },
  {
    id: "analytics_viewer",
    name: "Analytics Viewer",
    description: "Read-only BI intelligence consumer across platform product and growth cohorts.",
    isSystemRole: true,
    isActive: true,
    isProtectedSuperRole: false,
    grantedPermissions: buildAllPermissions(false, {
      "dashboard.view": true,
      "dashboard.stats": true,
      "ana.general": true,
      "ana.export": true,
      "set.view": true,
    }),
    createdAt: "2025-10-01T08:00:00Z",
    updatedAt: "2026-10-01T08:00:00Z",
  },
  {
    id: "read_only_admin",
    name: "Read-Only Administrator",
    description: "Compliance and external auditor profile with strict zero-mutation access.",
    isSystemRole: true,
    isActive: true,
    isProtectedSuperRole: false,
    grantedPermissions: buildAllPermissions(false, {
      "dashboard.view": true,
      "dashboard.stats": true,
      "users.view": true,
      "profiles.view": true,
      "sub.view": true,
      "wallet.audit": true,
      "ref.view": true,
      "sup.view": true,
      "ana.general": true,
      "set.view": true,
    }),
    createdAt: "2025-10-01T08:00:00Z",
    updatedAt: "2026-10-01T08:00:00Z",
  },
];

// Reuses real staff actors present across AdminProfileMenu, SupportManagement, and Moderation
const INITIAL_ADMINS: AdminAccountRecord[] = [
  {
    id: "adm_sarah_alex",
    name: "Sarah Alexander",
    username: "@sarah_founder",
    email: "sarah.alexander@noblebond.com",
    avatarInitials: "SA",
    roleId: "super_admin",
    roleName: "Super Administrator",
    status: "active",
    mfaEnabled: true,
    mfaMethod: "Hardware Security Key",
    lastLoginAt: "2026-11-10T08:12:00Z",
    lastActiveAt: "2026-11-10T11:20:00Z",
    createdAt: "2025-08-01T09:00:00Z",
    isPrimarySuperAdmin: true,
  },
  {
    id: "adm_elena",
    name: "Elena Vance",
    username: "@elena_ops",
    email: "elena.vance@noblebond.com",
    avatarInitials: "EV",
    roleId: "administrator",
    roleName: "Platform Administrator",
    status: "active",
    mfaEnabled: true,
    mfaMethod: "Authenticator App (TOTP)",
    lastLoginAt: "2026-11-09T14:40:00Z",
    lastActiveAt: "2026-11-10T10:05:00Z",
    createdAt: "2025-08-18T10:30:00Z",
    isPrimarySuperAdmin: false,
  },
  {
    id: "adm_sarah_jen",
    name: "Admin Sarah Jenkins",
    username: "@sarah_safety",
    email: "sarah.jenkins@noblebond.com",
    avatarInitials: "SJ",
    roleId: "moderator",
    roleName: "Safety Moderator",
    status: "active",
    mfaEnabled: true,
    mfaMethod: "Authenticator App (TOTP)",
    lastLoginAt: "2026-11-09T11:00:00Z",
    lastActiveAt: "2026-11-10T09:45:00Z",
    createdAt: "2025-09-02T12:00:00Z",
    isPrimarySuperAdmin: false,
  },
  {
    id: "adm_david",
    name: "Head of Safety David",
    username: "@david_trust",
    email: "david.safety@noblebond.com",
    avatarInitials: "HD",
    roleId: "moderator",
    roleName: "Safety Moderator",
    status: "active",
    mfaEnabled: true,
    mfaMethod: "Authenticator App (TOTP)",
    lastLoginAt: "2026-11-08T16:15:00Z",
    lastActiveAt: "2026-11-09T18:22:00Z",
    createdAt: "2025-09-05T09:00:00Z",
    isPrimarySuperAdmin: false,
  },
  {
    id: "adm_alex",
    name: "Moderator Alex",
    username: "@alex_mod",
    email: "alex.mod@noblebond.com",
    avatarInitials: "MA",
    roleId: "support_agent",
    roleName: "Support Agent",
    status: "active",
    mfaEnabled: true,
    mfaMethod: "Authenticator App (TOTP)",
    lastLoginAt: "2026-11-10T07:50:00Z",
    lastActiveAt: "2026-11-10T11:10:00Z",
    createdAt: "2025-10-12T13:20:00Z",
    isPrimarySuperAdmin: false,
  },
  {
    id: "adm_james",
    name: "Moderator James",
    username: "@james_verify",
    email: "james.mod@noblebond.com",
    avatarInitials: "MJ",
    roleId: "read_only_admin",
    roleName: "Read-Only Administrator",
    status: "inactive",
    mfaEnabled: false,
    mfaMethod: "Not Enrolled",
    lastLoginAt: "2026-10-14T09:00:00Z",
    lastActiveAt: "2026-10-14T11:30:00Z",
    createdAt: "2025-11-03T11:15:00Z",
    isPrimarySuperAdmin: false,
  },
];

// All Countries Synced with NobleBond International Directory + Global Expansion Markets
const INITIAL_COUNTRIES: CountryConfigRecord[] = [
  {
    isoCode: "US",
    name: "United States",
    region: "North America",
    status: "enabled",
    defaultCurrencyCode: "USD",
    defaultLanguageCode: "en-US",
    timezone: "America/New_York",
    supportedPaymentMethods: ["Stripe Web", "Apple App Store", "Google Play", "PayPal"],
    updatedAt: "2026-10-01T10:00:00Z",
    updatedBy: "Sarah Alexander",
  },
  {
    isoCode: "GB",
    name: "United Kingdom",
    region: "Europe",
    status: "enabled",
    defaultCurrencyCode: "GBP",
    defaultLanguageCode: "en-GB",
    timezone: "Europe/London",
    supportedPaymentMethods: ["Stripe Web", "Apple App Store", "Google Play", "PayPal"],
    updatedAt: "2026-10-01T10:00:00Z",
    updatedBy: "Sarah Alexander",
  },
  {
    isoCode: "CA",
    name: "Canada",
    region: "North America",
    status: "enabled",
    defaultCurrencyCode: "CAD",
    defaultLanguageCode: "en-US",
    timezone: "America/Toronto",
    supportedPaymentMethods: ["Stripe Web", "Apple App Store", "Google Play"],
    updatedAt: "2026-10-01T10:00:00Z",
    updatedBy: "Sarah Alexander",
  },
  {
    isoCode: "NG",
    name: "Nigeria",
    region: "West Africa",
    status: "enabled",
    defaultCurrencyCode: "NGN",
    defaultLanguageCode: "en-GB",
    timezone: "Africa/Lagos",
    supportedPaymentMethods: ["Google Play", "Apple App Store", "Stripe Web"],
    updatedAt: "2026-10-01T10:00:00Z",
    updatedBy: "Sarah Alexander",
  },
  {
    isoCode: "GH",
    name: "Ghana",
    region: "West Africa",
    status: "enabled",
    defaultCurrencyCode: "USD",
    defaultLanguageCode: "en-GB",
    timezone: "Africa/Accra",
    supportedPaymentMethods: ["Google Play", "Apple App Store"],
    updatedAt: "2026-10-01T10:00:00Z",
    updatedBy: "Sarah Alexander",
  },
  {
    isoCode: "FR",
    name: "France",
    region: "Europe",
    status: "enabled",
    defaultCurrencyCode: "EUR",
    defaultLanguageCode: "fr-FR",
    timezone: "Europe/Paris",
    supportedPaymentMethods: ["Stripe Web", "Apple App Store", "Google Play", "PayPal"],
    updatedAt: "2026-10-05T11:20:00Z",
    updatedBy: "Elena Vance",
  },
  {
    isoCode: "DE",
    name: "Germany",
    region: "Europe",
    status: "enabled",
    defaultCurrencyCode: "EUR",
    defaultLanguageCode: "de-DE",
    timezone: "Europe/Berlin",
    supportedPaymentMethods: ["Stripe Web", "Apple App Store", "Google Play", "PayPal"],
    updatedAt: "2026-10-05T11:20:00Z",
    updatedBy: "Elena Vance",
  },
  {
    isoCode: "AE",
    name: "United Arab Emirates",
    region: "Middle East",
    status: "restricted",
    defaultCurrencyCode: "AED",
    defaultLanguageCode: "ar-SA",
    timezone: "Asia/Dubai",
    supportedPaymentMethods: ["Apple App Store", "Google Play"],
    restrictionReason: "Live voice/video compliance review pending local telecom clearance.",
    effectiveDate: "2026-10-15",
    updatedAt: "2026-10-15T14:00:00Z",
    updatedBy: "Sarah Alexander",
  },
  {
    isoCode: "KE",
    name: "Kenya",
    region: "East Africa",
    status: "enabled",
    defaultCurrencyCode: "USD",
    defaultLanguageCode: "sw-KE",
    timezone: "Africa/Nairobi",
    supportedPaymentMethods: ["Google Play", "Apple App Store"],
    updatedAt: "2026-10-18T09:00:00Z",
    updatedBy: "Elena Vance",
  },
  {
    isoCode: "BR",
    name: "Brazil",
    region: "South America",
    status: "enabled",
    defaultCurrencyCode: "BRL",
    defaultLanguageCode: "pt-BR",
    timezone: "America/Sao_Paulo",
    supportedPaymentMethods: ["Google Play", "Apple App Store", "Stripe Web"],
    updatedAt: "2026-10-20T13:10:00Z",
    updatedBy: "Elena Vance",
  },
];

// Mobile Language Catalogue Extract from NobleBond/src/features/language/constants/languagesData.ts (zero emojis)
const INITIAL_LANGUAGES: LanguageConfigRecord[] = [
  { code: "en-US", englishName: "English (United States)", nativeName: "English", countryOrigin: "United States", translationStatus: "complete", isAvailable: true, isDefault: true },
  { code: "en-GB", englishName: "English (United Kingdom)", nativeName: "English", countryOrigin: "United Kingdom", translationStatus: "complete", isAvailable: true, isDefault: false },
  { code: "fr-FR", englishName: "French", nativeName: "Français", countryOrigin: "France", translationStatus: "complete", isAvailable: true, isDefault: false },
  { code: "es-ES", englishName: "Spanish", nativeName: "Español", countryOrigin: "Spain", translationStatus: "complete", isAvailable: true, isDefault: false },
  { code: "ar-SA", englishName: "Arabic", nativeName: "العربية", countryOrigin: "Saudi Arabia", translationStatus: "partial", isAvailable: true, isDefault: false },
  { code: "zh-CN", englishName: "Chinese (Mandarin)", nativeName: "中文", countryOrigin: "China", translationStatus: "partial", isAvailable: true, isDefault: false },
  { code: "de-DE", englishName: "German", nativeName: "Deutsch", countryOrigin: "Germany", translationStatus: "complete", isAvailable: true, isDefault: false },
  { code: "hi-IN", englishName: "Hindi", nativeName: "हिन्दी", countryOrigin: "India", translationStatus: "partial", isAvailable: true, isDefault: false },
  { code: "pt-BR", englishName: "Portuguese", nativeName: "Português", countryOrigin: "Brazil", translationStatus: "complete", isAvailable: true, isDefault: false },
  { code: "ru-RU", englishName: "Russian", nativeName: "Русский", countryOrigin: "Russia", translationStatus: "base_catalogue_only", isAvailable: false, isDefault: false },
  { code: "ja-JP", englishName: "Japanese", nativeName: "日本語", countryOrigin: "Japan", translationStatus: "base_catalogue_only", isAvailable: true, isDefault: false },
  { code: "ko-KR", englishName: "Korean", nativeName: "한국어", countryOrigin: "South Korea", translationStatus: "base_catalogue_only", isAvailable: true, isDefault: false },
  { code: "it-IT", englishName: "Italian", nativeName: "Italiano", countryOrigin: "Italy", translationStatus: "partial", isAvailable: true, isDefault: false },
  { code: "tr-TR", englishName: "Turkish", nativeName: "Türkçe", countryOrigin: "Turkey", translationStatus: "base_catalogue_only", isAvailable: true, isDefault: false },
  { code: "nl-NL", englishName: "Dutch", nativeName: "Nederlands", countryOrigin: "Netherlands", translationStatus: "partial", isAvailable: true, isDefault: false },
  { code: "sw-KE", englishName: "Swahili", nativeName: "Kiswahili", countryOrigin: "Kenya", translationStatus: "base_catalogue_only", isAvailable: true, isDefault: false },
  { code: "ha-NG", englishName: "Hausa", nativeName: "Harshen Hausa", countryOrigin: "Nigeria", translationStatus: "base_catalogue_only", isAvailable: true, isDefault: false },
  { code: "yo-NG", englishName: "Yoruba", nativeName: "Èdè Yorùbá", countryOrigin: "Nigeria", translationStatus: "base_catalogue_only", isAvailable: true, isDefault: false },
  { code: "ig-NG", englishName: "Igbo", nativeName: "Asụsụ Igbo", countryOrigin: "Nigeria", translationStatus: "base_catalogue_only", isAvailable: true, isDefault: false },
  { code: "id-ID", englishName: "Indonesian", nativeName: "Bahasa Indonesia", countryOrigin: "Indonesia", translationStatus: "base_catalogue_only", isAvailable: true, isDefault: false },
];

const INITIAL_CURRENCIES: CurrencyConfigRecord[] = [
  { code: "USD", name: "United States Dollar", symbol: "$", decimalPrecision: 2, isAvailable: true, supportedRegions: ["Global", "United States", "Canada", "West Africa"], isPlatformDisplayDefault: true },
  { code: "EUR", name: "Euro", symbol: "€", decimalPrecision: 2, isAvailable: true, supportedRegions: ["Europe", "France", "Germany"], isPlatformDisplayDefault: false },
  { code: "GBP", name: "British Pound Sterling", symbol: "£", decimalPrecision: 2, isAvailable: true, supportedRegions: ["United Kingdom"], isPlatformDisplayDefault: false },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", decimalPrecision: 2, isAvailable: true, supportedRegions: ["Nigeria"], isPlatformDisplayDefault: false },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", decimalPrecision: 2, isAvailable: true, supportedRegions: ["Canada"], isPlatformDisplayDefault: false },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", decimalPrecision: 2, isAvailable: true, supportedRegions: ["Brazil"], isPlatformDisplayDefault: false },
  { code: "AED", name: "UAE Dirham", symbol: "AED", decimalPrecision: 2, isAvailable: false, supportedRegions: ["Middle East"], isPlatformDisplayDefault: false },
];

const INITIAL_EXCHANGE_RATES: ExchangeRatePair[] = [
  { id: "fx_usd_eur", baseCurrency: "USD", quoteCurrency: "EUR", rate: null, provider: "Unconnected FX Feed", rateSource: "unavailable", lastUpdatedAt: null, statusLabel: "Unavailable — Connect ECB/OpenExchange FX Provider" },
  { id: "fx_usd_gbp", baseCurrency: "USD", quoteCurrency: "GBP", rate: null, provider: "Unconnected FX Feed", rateSource: "unavailable", lastUpdatedAt: null, statusLabel: "Unavailable — Connect Store Settlement Feed" },
  { id: "fx_usd_ngn", baseCurrency: "USD", quoteCurrency: "NGN", rate: null, provider: "Unconnected FX Feed", rateSource: "unavailable", lastUpdatedAt: null, statusLabel: "Unavailable — Processed Directly in Store Currency" },
];

// Exact 22 Features from Prompt Section 8 + Product Reality Check
const INITIAL_FEATURES: FeatureFlagRecord[] = [
  { id: "feat_reg", name: "User Registration", description: "New member onboarding & account creation", category: "Core Social", enabled: true, availabilityScope: "all_users", targetNotes: "Active globally", platforms: ["iOS", "Android", "Web"], integrationReady: true, dependencyNote: "Auth service & minimum age 18 check", lastUpdatedAt: "2026-10-01T10:00:00Z", updatedBy: "Sarah Alexander" },
  { id: "feat_email_ver", name: "Email Verification", description: "OTP verification via member email", category: "Trust & Support", enabled: true, availabilityScope: "all_users", targetNotes: "Required for referrals", platforms: ["iOS", "Android", "Web"], integrationReady: true, dependencyNote: "Email SMTP / transactional relay", lastUpdatedAt: "2026-10-01T10:00:00Z", updatedBy: "Sarah Alexander" },
  { id: "feat_phone_ver", name: "Phone Verification", description: "SMS OTP verification for trusted onboarding", category: "Trust & Support", enabled: true, availabilityScope: "all_users", targetNotes: "SMS carrier subject to regional delivery", platforms: ["iOS", "Android"], integrationReady: true, dependencyNote: "SMS gateway integration", lastUpdatedAt: "2026-10-01T10:00:00Z", updatedBy: "Sarah Alexander" },
  { id: "feat_profile_create", name: "Profile Creation", description: "Photos, prompts, interests, lifestyle & bio setup", category: "Core Social", enabled: true, availabilityScope: "all_users", targetNotes: "Global profile builder", platforms: ["iOS", "Android", "Web"], integrationReady: true, dependencyNote: "Media storage & moderation queue", lastUpdatedAt: "2026-10-01T10:00:00Z", updatedBy: "Sarah Alexander" },
  { id: "feat_discovery", name: "Discovery", description: "Partner matching deck and preference filtering", category: "Core Social", enabled: true, availabilityScope: "all_users", targetNotes: "Excludes suspended/hidden accounts", platforms: ["iOS", "Android"], integrationReady: true, dependencyNote: "Discovery feed engine", lastUpdatedAt: "2026-10-01T10:00:00Z", updatedBy: "Sarah Alexander" },
  { id: "feat_likes", name: "Likes", description: "Daily swipe/like interactions", category: "Core Social", enabled: true, availabilityScope: "all_users", targetNotes: "15 Pts Additional Daily Likes unlockable", platforms: ["iOS", "Android"], integrationReady: true, dependencyNote: "Likes & Matches store", lastUpdatedAt: "2026-10-01T10:00:00Z", updatedBy: "Sarah Alexander" },
  { id: "feat_super_likes", name: "Super Likes", description: "High-priority highlighted interest signals", category: "Core Social", enabled: true, availabilityScope: "all_users", targetNotes: "Redeemable via Connection Points (25 Pts) or Premium", platforms: ["iOS", "Android"], integrationReady: true, dependencyNote: "Wallet / Entitlements service", lastUpdatedAt: "2026-10-01T10:00:00Z", updatedBy: "Sarah Alexander" },
  { id: "feat_matches", name: "Mutual Matching", description: "Two-way match creation unlocking chat", category: "Core Social", enabled: true, availabilityScope: "all_users", targetNotes: "One-way likes never count as matches", platforms: ["iOS", "Android"], integrationReady: true, dependencyNote: "Mutual handshake ledger", lastUpdatedAt: "2026-10-01T10:00:00Z", updatedBy: "Sarah Alexander" },
  { id: "feat_messaging", name: "Messaging", description: "Encrypted 1-on-1 match conversations", category: "Communication", enabled: true, availabilityScope: "all_users", targetNotes: "Safety reporting enabled", platforms: ["iOS", "Android", "Web"], integrationReady: true, dependencyNote: "Chat relay & moderation", lastUpdatedAt: "2026-10-01T10:00:00Z", updatedBy: "Sarah Alexander" },
  { id: "feat_voice_calls", name: "Voice Calls", description: "In-app audio calls between matched users", category: "Communication", enabled: true, availabilityScope: "selected_countries", targetNotes: "Restricted in regulatory-review markets", platforms: ["iOS", "Android"], integrationReady: true, dependencyNote: "WebRTC / Agora audio relay", lastUpdatedAt: "2026-10-15T14:00:00Z", updatedBy: "Sarah Alexander" },
  { id: "feat_video_calls", name: "Video Calls", description: "In-app peer video calling for matches", category: "Communication", enabled: true, availabilityScope: "selected_countries", targetNotes: "Premium entitlement or matched consent", platforms: ["iOS", "Android"], integrationReady: true, dependencyNote: "Agora / LiveKit transport", lastUpdatedAt: "2026-10-15T14:00:00Z", updatedBy: "Sarah Alexander" },
  { id: "feat_live", name: "Live Streaming", description: "Solo creator & host interactive live broadcasts", category: "Live & Economy", enabled: true, availabilityScope: "all_users", targetNotes: "Strict live safety monitoring", platforms: ["iOS", "Android"], integrationReady: true, dependencyNote: "Agora / LiveKit cluster", lastUpdatedAt: "2026-10-10T12:00:00Z", updatedBy: "Elena Vance" },
  { id: "feat_multi_guest", name: "Multi-Guest Live", description: "Co-host guest invitations inside Live sessions", category: "Live & Economy", enabled: true, availabilityScope: "all_users", targetNotes: "Moderator kick/mute overrides active", platforms: ["iOS", "Android"], integrationReady: true, dependencyNote: "LiveKit / Agora multi-seat room", lastUpdatedAt: "2026-10-10T12:00:00Z", updatedBy: "Elena Vance" },
  { id: "feat_gifts", name: "Virtual Gifts", description: "Interactive stream gifts purchased with Gift Coins", category: "Live & Economy", enabled: true, availabilityScope: "all_users", targetNotes: "Virtual platform interaction only", platforms: ["iOS", "Android"], integrationReady: true, dependencyNote: "Gift Coins Wallet ledger", lastUpdatedAt: "2026-10-01T10:00:00Z", updatedBy: "Sarah Alexander" },
  { id: "feat_gift_coins", name: "Gift Coins", description: "Virtual coin balance purchased via Store IAP", category: "Live & Economy", enabled: true, availabilityScope: "all_users", targetNotes: "Non-withdrawable virtual coin balance", platforms: ["iOS", "Android", "Web"], integrationReady: true, dependencyNote: "Apple IAP / Google Play / Stripe", lastUpdatedAt: "2026-10-01T10:00:00Z", updatedBy: "Sarah Alexander" },
  { id: "feat_cp", name: "Connection Points", description: "Non-cash loyalty rewards for OTP referrals & perks", category: "Live & Economy", enabled: true, availabilityScope: "all_users", targetNotes: "Never convertible to Gift Coins or money", platforms: ["iOS", "Android", "Web"], integrationReady: true, dependencyNote: "Referral & Wallet perk ledger", lastUpdatedAt: "2026-10-01T10:00:00Z", updatedBy: "Sarah Alexander" },
  { id: "feat_referral", name: "Referral Programme", description: "50 Connection Points reward for referrer post-OTP", category: "Live & Economy", enabled: true, availabilityScope: "all_users", targetNotes: "Referrer-only policy (0 referred bonus)", platforms: ["iOS", "Android"], integrationReady: true, dependencyNote: "OTP verification + anti-fraud check", lastUpdatedAt: "2026-10-01T10:00:00Z", updatedBy: "Sarah Alexander" },
  { id: "feat_premium", name: "Premium Subscriptions", description: "Monthly, 6-Month, and Annual Premium tiers", category: "Live & Economy", enabled: true, availabilityScope: "all_users", targetNotes: "Managed pricing in Subscription Management", platforms: ["iOS", "Android", "Web"], integrationReady: true, dependencyNote: "App Store / Play / Stripe billing", lastUpdatedAt: "2026-10-01T10:00:00Z", updatedBy: "Sarah Alexander" },
  { id: "feat_notif", name: "Notifications", description: "Push & In-App alerts for matches, chats & live", category: "Trust & Support", enabled: true, availabilityScope: "all_users", targetNotes: "Push open telemetry webhook pending", platforms: ["iOS", "Android", "Web"], integrationReady: true, dependencyNote: "APNs / FCM dispatchers", lastUpdatedAt: "2026-10-01T10:00:00Z", updatedBy: "Sarah Alexander" },
  { id: "feat_prof_verif", name: "Profile Verification", description: "Selfie gesture & ID document verification workflow", category: "Trust & Support", enabled: true, availabilityScope: "all_users", targetNotes: "Reviewed in Profile Management", platforms: ["iOS", "Android"], integrationReady: true, dependencyNote: "Human moderation review queue", lastUpdatedAt: "2026-10-01T10:00:00Z", updatedBy: "Sarah Alexander" },
  { id: "feat_contact_us", name: "Contact Us", description: "In-app Customer Support ticket intake workflow", category: "Trust & Support", enabled: true, availabilityScope: "all_users", targetNotes: "Routes straight to Customer Support", platforms: ["iOS", "Android", "Web"], integrationReady: true, dependencyNote: "Support Management ticket store", lastUpdatedAt: "2026-10-01T10:00:00Z", updatedBy: "Sarah Alexander" },
  { id: "feat_plan_date", name: "Plan a Date", description: "Curated venue & safety check-in scheduler for matched pairs", category: "Planned", enabled: false, availabilityScope: "selected_groups", targetNotes: "Locked until backend date-booking API is wired", platforms: ["iOS", "Android"], integrationReady: false, dependencyNote: "Requires backend Date Scheduler & Venue API (Not Connected)", lastUpdatedAt: "2026-11-01T09:00:00Z", updatedBy: "Sarah Alexander" },
];

const INITIAL_ASSETS: BrandAssetConfig[] = [
  { id: "ast_primary", slotLabel: "Primary Light Theme Logo", assetType: "light_logo", currentUrl: logoLight, dimensionsGuidance: "Recommended: 512x128 px SVG/PNG (4:1 aspect ratio)", acceptedFormats: "PNG, SVG, WEBP", maxSizeKb: 512, storageMode: "bundled_static", lastUpdatedAt: "2026-10-01T10:00:00Z" },
  { id: "ast_dark", slotLabel: "Dark Mode Logo", assetType: "dark_logo", currentUrl: logoDark, dimensionsGuidance: "Recommended: 512x128 px light text on transparent canvas", acceptedFormats: "PNG, SVG, WEBP", maxSizeKb: 512, storageMode: "bundled_static", lastUpdatedAt: "2026-10-01T10:00:00Z" },
  { id: "ast_mark", slotLabel: "Compact Brand Mark / App Icon", assetType: "app_icon", currentUrl: logoMark, dimensionsGuidance: "Recommended: 1024x1024 px 1:1 square icon", acceptedFormats: "PNG", maxSizeKb: 1024, storageMode: "bundled_static", lastUpdatedAt: "2026-10-01T10:00:00Z" },
  { id: "ast_favicon", slotLabel: "Browser Favicon", assetType: "favicon", currentUrl: faviconAsset, dimensionsGuidance: "Recommended: 64x64 px PNG/ICO", acceptedFormats: "PNG, ICO", maxSizeKb: 128, storageMode: "bundled_static", lastUpdatedAt: "2026-10-01T10:00:00Z" },
];

const INITIAL_SESSIONS: AdminSessionRecord[] = [
  { id: "SES-901", adminId: "adm_sarah_alex", adminName: "Sarah Alexander", deviceType: "Desktop", browser: "Chrome 131 (Current Browser)", operatingSystem: "Windows 11", maskedIp: "102.89.***.14", approxLocation: "Remote Authorized Console", loginAt: "2026-11-10T08:12:00Z", lastActivityAt: "2026-11-10T12:35:00Z", status: "active", isCurrentSession: true },
  { id: "SES-902", adminId: "adm_elena", adminName: "Elena Vance", deviceType: "Laptop", browser: "Safari 18", operatingSystem: "macOS Sequoia", maskedIp: "86.14.***.92", approxLocation: "London, UK (Approx Network)", loginAt: "2026-11-10T09:05:00Z", lastActivityAt: "2026-11-10T11:50:00Z", status: "active", isCurrentSession: false },
  { id: "SES-903", adminId: "adm_sarah_jen", adminName: "Admin Sarah Jenkins", deviceType: "Laptop", browser: "Edge 130", operatingSystem: "Windows 11", maskedIp: "172.58.***.41", approxLocation: "New York, US (Approx Network)", loginAt: "2026-11-10T06:40:00Z", lastActivityAt: "2026-11-10T10:15:00Z", status: "active", isCurrentSession: false },
  { id: "SES-904", adminId: "adm_alex", adminName: "Moderator Alex", deviceType: "Desktop", browser: "Firefox 132", operatingSystem: "Ubuntu Linux", maskedIp: "154.113.***.88", approxLocation: "Lagos, NG (Approx Network)", loginAt: "2026-11-09T18:00:00Z", lastActivityAt: "2026-11-09T23:10:00Z", status: "expired", isCurrentSession: false },
];

const INITIAL_SECURITY_EVENTS: SecurityEventRecord[] = [
  { id: "SEC-401", eventType: "new_admin_login", severity: "info", actorLabel: "Sarah Alexander", summary: "Authenticated hardware security key login into System Settings console.", timestamp: "2026-11-10T08:12:00Z" },
  { id: "SEC-402", eventType: "mfa_enforcement_updated", severity: "medium", actorLabel: "System Startup", summary: "Loaded active policy: Enforce 2FA for all Administrator accounts (30-min idle lock).", timestamp: "2026-11-09T14:20:00Z" },
  { id: "SEC-403", eventType: "session_expired", severity: "low", actorLabel: "Moderator Alex", summary: "Idle session timed out after 30 minutes without console interaction.", timestamp: "2026-11-09T23:40:00Z" },
];

const INITIAL_POLICIES: CommunityPolicyRecord[] = [
  {
    id: "pol_community",
    title: "Global Community & Dating Respect Guidelines",
    category: "Core Platform Safety",
    publishedVersion: "v2.4",
    publishedSummary: "Strictly prohibits impersonation, harassment, explicit solicitation, minor accounts (<18), and off-platform financial scams across Discovery, Chats, and Live.",
    draftSummary: "Strictly prohibits impersonation, harassment, explicit solicitation, minor accounts (<18), and off-platform financial scams across Discovery, Chats, and Live. Clarifies multi-guest stream host responsibility rules.",
    hasUnpublishedDraft: true,
    requiresUserAcknowledgement: true,
    lastPublishedAt: "2026-09-15T10:00:00Z",
    lastPublishedBy: "Sarah Alexander",
    previousVersions: [
      { version: "v2.4", publishedAt: "2026-09-15T10:00:00Z", publishedBy: "Sarah Alexander", notes: "Added anti-catfish & referral abuse clarifications" },
      { version: "v2.3", publishedAt: "2026-06-01T09:00:00Z", publishedBy: "Head of Safety David", notes: "Expanded photo verification expectations" },
    ],
  },
  {
    id: "pol_gifts",
    title: "Virtual Gift Coins & Connection Points Economy Policy",
    category: "Gifts & Rewards",
    publishedVersion: "v1.6",
    publishedSummary: "Gift Coins are virtual streaming items only. Connection Points (+50 Pts post-OTP referrer-only reward) redeem exclusively for in-app perks and have zero cash or payout value.",
    draftSummary: "Gift Coins are virtual streaming items only. Connection Points (+50 Pts post-OTP referrer-only reward) redeem exclusively for in-app perks and have zero cash or payout value.",
    hasUnpublishedDraft: false,
    requiresUserAcknowledgement: false,
    lastPublishedAt: "2026-10-12T12:00:00Z",
    lastPublishedBy: "Sarah Alexander",
    previousVersions: [
      { version: "v1.6", publishedAt: "2026-10-12T12:00:00Z", publishedBy: "Sarah Alexander", notes: "Confirmed referrer-only 50 Pts OTP structure" },
    ],
  },
];

const INITIAL_NOTIF_CHANNELS: NotificationChannelConfig[] = [
  { id: "ch_inapp", channel: "In-App", providerName: "NobleBond Internal Dispatch", configurationStatus: "demo_local", enabled: true, lastSuccessfulDeliveryAt: "2026-11-10T11:15:00Z", lastFailureSummary: null },
  { id: "ch_push", channel: "Push", providerName: "Expo Push / FCM & APNs Gateway", configurationStatus: "not_configured", enabled: true, lastSuccessfulDeliveryAt: null, lastFailureSummary: "Production push open-tracking webhook pending server connection." },
  { id: "ch_email", channel: "Email", providerName: "Transactional SMTP / SendGrid Slot", configurationStatus: "not_configured", enabled: true, lastSuccessfulDeliveryAt: null, lastFailureSummary: "Connect production SMTP credentials in backend environment." },
  { id: "ch_sms", channel: "SMS", providerName: "OTP Carrier Slot (Twilio / Termii)", configurationStatus: "not_configured", enabled: false, lastSuccessfulDeliveryAt: null, lastFailureSummary: "Not configured in frontend-only mode; phone OTP simulated locally." },
];

const INITIAL_NOTIF_CATS: NotificationCategoryConfig[] = [
  "Registration", "Verification", "Likes", "Matches", "Messages", "Live Sessions", "Gifts",
  "Premium Subscriptions", "Connection Points", "Referral Rewards", "Account Security",
  "Support", "Moderation", "System Updates",
].map((name, idx) => ({
  id: `ncat_${idx + 1}`,
  categoryName: name,
  inAppEnabled: true,
  pushEnabled: true,
  emailEnabled: ["Registration", "Verification", "Premium Subscriptions", "Account Security", "Support", "System Updates"].includes(name),
  smsEnabled: ["Registration", "Verification", "Account Security"].includes(name),
  templateSubject: `NobleBond Alert: ${name}`,
}));

const INITIAL_PAYMENTS: PaymentIntegrationRecord[] = [
  {
    id: "pay_stripe",
    providerName: "Stripe Web Billing",
    channelLabel: "Web Subscriptions & Coin Packs",
    environment: "sandbox_test",
    connectionStatus: "configured_demo",
    maskedCredentialRef: "ENV::STRIPE_SECRET_KEY (pk_test_****92aB — Backend Managed)",
    supportedCurrencies: ["USD", "EUR", "GBP", "CAD"],
    enabledFeatures: ["Premium Plans", "Gift Coin Web Packs", "Webhook Signature Check", "Refund Processing"],
    webhookStatus: "pending_endpoint",
    docsUrl: "https://stripe.com/docs",
    configVersion: "2026-10-api",
    lastSuccessfulEventAt: "2026-11-09T17:15:00Z",
    lastError: null,
    lastUpdatedAt: "2026-11-01T10:00:00Z",
  },
  {
    id: "pay_apple",
    providerName: "Apple App Store Billing",
    channelLabel: "iOS In-App Purchases (StoreKit 2)",
    environment: "sandbox_test",
    connectionStatus: "configured_demo",
    maskedCredentialRef: "ENV::APP_STORE_CONNECT_ISSUER_KEY (****7F11 — Server Keychain)",
    supportedCurrencies: ["USD", "GBP", "EUR", "CAD", "NGN"],
    enabledFeatures: ["Auto-Renewable Subscriptions", "Consumable Coin Packs", "Server Notifications v2"],
    webhookStatus: "pending_endpoint",
    docsUrl: "https://developer.apple.com/in-app-purchase/",
    configVersion: "storekit-v2",
    lastSuccessfulEventAt: "2026-11-09T12:30:00Z",
    lastError: null,
    lastUpdatedAt: "2026-10-20T09:00:00Z",
  },
  {
    id: "pay_google",
    providerName: "Google Play Billing",
    channelLabel: "Android In-App Billing v6",
    environment: "sandbox_test",
    connectionStatus: "configured_demo",
    maskedCredentialRef: "ENV::GOOGLE_PLAY_SERVICE_ACCOUNT (****play-billing.json)",
    supportedCurrencies: ["USD", "NGN", "GBP", "EUR", "BRL"],
    enabledFeatures: ["Subscriptions", "Consumable Coins", "Real-time Developer Notifications"],
    webhookStatus: "pending_endpoint",
    docsUrl: "https://developer.android.com/google/play/billing",
    configVersion: "billing-v6",
    lastSuccessfulEventAt: "2026-11-09T09:45:00Z",
    lastError: null,
    lastUpdatedAt: "2026-10-20T09:00:00Z",
  },
  {
    id: "pay_paypal",
    providerName: "PayPal Checkout",
    channelLabel: "Secondary Web Billing Slot",
    environment: "unconfigured",
    connectionStatus: "not_configured",
    maskedCredentialRef: "Not Configured — Requires Server Secret Vault",
    supportedCurrencies: ["USD", "EUR", "GBP"],
    enabledFeatures: ["Awaiting Merchant Onboarding"],
    webhookStatus: "unavailable",
    docsUrl: "https://developer.paypal.com/",
    configVersion: "unconfigured",
    lastSuccessfulEventAt: null,
    lastError: "Client secret not provisioned in backend environment.",
    lastUpdatedAt: "2026-10-01T10:00:00Z",
  },
];

const INITIAL_INTEGRATIONS: ExternalIntegrationRecord[] = [
  { id: "int_api", name: "NobleBond Core Backend API", category: "Backend API", provider: "REST / WebSocket Gateway", configStatus: "demo_local", connectionStatus: "untested", enabled: true, maskedRef: "ENV::VITE_API_BASE_URL (Local Demo Persistence)", lastSuccessAt: null, lastError: "Operating in offline/frontend-only mode using localStorage stores.", docsUrl: "https://noblebond.app/docs/api", lastUpdatedAt: "2026-11-10T08:00:00Z" },
  { id: "int_auth", name: "Authentication & OTP Provider", category: "Authentication", provider: "JWT + Email/Phone OTP Service", configStatus: "demo_local", connectionStatus: "untested", enabled: true, maskedRef: "ENV::AUTH_SIGNING_KEY (Server-Side Only)", lastSuccessAt: null, lastError: "Live server enforcement required before production deploy.", docsUrl: "https://noblebond.app/docs/auth", lastUpdatedAt: "2026-11-01T10:00:00Z" },
  { id: "int_live_agora", name: "Live Streaming & Co-Host Media", category: "Live Streaming", provider: "Agora RTC / LiveKit", configStatus: "demo_local", connectionStatus: "healthy", enabled: true, maskedRef: "ENV::AGORA_APP_CERTIFICATE (****84E2)", lastSuccessAt: "2026-11-10T11:00:00Z", lastError: null, docsUrl: "https://docs.agora.io/", lastUpdatedAt: "2026-11-08T12:00:00Z" },
  { id: "int_push", name: "Push Notifications Relay", category: "Push Notifications", provider: "Expo Push / FCM / APNs", configStatus: "not_configured", connectionStatus: "unavailable", enabled: false, maskedRef: "Unprovisioned Server Key", lastSuccessAt: null, lastError: "Pending push webhook feedback configuration.", docsUrl: "https://docs.expo.dev/push-notifications/", lastUpdatedAt: "2026-10-01T10:00:00Z" },
  { id: "int_email", name: "Email Delivery Service", category: "Email Provider", provider: "SMTP / Transactional Mailer", configStatus: "not_configured", connectionStatus: "unavailable", enabled: true, maskedRef: "support@noblebond.com (Inbound Alias)", lastSuccessAt: null, lastError: "Requires backend DKIM & SMTP API key.", docsUrl: "https://sendgrid.com/docs", lastUpdatedAt: "2026-10-01T10:00:00Z" },
  { id: "int_storage", name: "Media & Avatar Object Storage", category: "File Storage", provider: "S3 / CDN Bucket Slot", configStatus: "not_configured", connectionStatus: "unavailable", enabled: true, maskedRef: "Local Asset Preview Mode Only", lastSuccessAt: null, lastError: "Brand uploads currently preview locally and require signed S3 PUT endpoint.", docsUrl: "https://docs.aws.amazon.com/s3/", lastUpdatedAt: "2026-10-01T10:00:00Z" },
];

// Grounded in mobile `app.json` v1.0.0
const INITIAL_APP_VERSIONS: AppVersionRecord[] = [
  { id: "ver_ios", platform: "iOS", currentVersion: "1.0.0", minimumSupportedVersion: "1.0.0", latestAvailableVersion: "1.0.0", updatePolicy: "optional", publishState: "published", releaseDate: "2026-11-01", releaseNotes: "Initial NobleBond iOS release matching expo.version 1.0.0 with automatic Light/Dark mode.", maintenanceBannerText: "" },
  { id: "ver_android", platform: "Android", currentVersion: "1.0.0", minimumSupportedVersion: "1.0.0", latestAvailableVersion: "1.0.0", updatePolicy: "optional", publishState: "published", releaseDate: "2026-11-01", releaseNotes: "Initial NobleBond Android release matching expo.version 1.0.0 with Expo Audio & Adaptive Icons.", maintenanceBannerText: "" },
  { id: "ver_web", platform: "Web Admin", currentVersion: "2.4.0", minimumSupportedVersion: "2.0.0", latestAvailableVersion: "2.4.0", updatePolicy: "recommended", publishState: "published", releaseDate: "2026-11-10", releaseNotes: "Enterprise Admin Dashboard with BI Analytics and System Settings Control Centre.", maintenanceBannerText: "" },
];

const INITIAL_SERVICES_HEALTH: SystemServiceHealthRecord[] = [
  { serviceName: "Admin Local Configuration Store", category: "Frontend Store", status: "operational_local", summary: "Browser localStorage synchronization responsive", lastCheckedAt: "2026-11-10T12:00:00Z" },
  { serviceName: "Backend API Gateway", category: "Core Infrastructure", status: "monitoring_unconnected", summary: "Awaiting live REST API telemetry endpoint", lastCheckedAt: "2026-11-10T12:00:00Z" },
  { serviceName: "Primary Database Cluster", category: "Persistence", status: "monitoring_unconnected", summary: "Health ping requires backend database proxy", lastCheckedAt: "2026-11-10T12:00:00Z" },
  { serviceName: "Authentication Service", category: "Security", status: "monitoring_unconnected", summary: "OTP & JWT validation operates in local demo mode", lastCheckedAt: "2026-11-10T12:00:00Z" },
  { serviceName: "Payment Billing Gateways", category: "Billing", status: "monitoring_unconnected", summary: "Sandbox test mode — webhook endpoint unattached", lastCheckedAt: "2026-11-10T12:00:00Z" },
  { serviceName: "Live Streaming (Agora/LiveKit)", category: "Media", status: "operational_local", summary: "Monitored via Live Management stream health snapshots", lastCheckedAt: "2026-11-10T12:00:00Z" },
];

const INITIAL_JOBS: BackgroundJobRecord[] = [
  { id: "job_sub_renew", jobName: "Subscription Renewal & Grace Expiry Check", schedule: "Every 15 mins (Backend Cron)", status: "unconnected", lastRunAt: null, nextRunAt: null, durationMs: null, failureNote: "Requires backend worker scheduler telemetry." },
  { id: "job_ref_otp", jobName: "Referral OTP Qualification Verification Sweep", schedule: "Every 5 mins (Backend Worker)", status: "unconnected", lastRunAt: null, nextRunAt: null, durationMs: null, failureNote: "Executed locally on manual approval in Referral Management." },
  { id: "job_audit_export", jobName: "Immutable Audit Retention Verification", schedule: "Daily 02:00 UTC", status: "completed", lastRunAt: "2026-11-10T02:00:00Z", nextRunAt: "2026-11-11T02:00:00Z", durationMs: 420, failureNote: null },
];

const INITIAL_ALERTS: SystemAlertRecord[] = [
  { id: "ALT-101", severity: "medium", affectedService: "Push & Email Webhooks", description: "Push notification open-rate receipts & SendGrid delivery callbacks are not connected to backend webhooks.", timestamp: "2026-11-10T09:00:00Z", status: "acknowledged", assignedAdmin: "Elena Vance", relatedRef: "/notifications", internalNotes: ["Logged for Backend Integration Phase 2."], isDemoRecord: true },
  { id: "ALT-102", severity: "low", affectedService: "Plan a Date Feature Gate", description: "Feature flag remains locked until venue & date-scheduler backend API is provisioned.", timestamp: "2026-11-08T14:30:00Z", status: "open", assignedAdmin: "Sarah Alexander", relatedRef: "feat_plan_date", internalNotes: [], isDemoRecord: true },
  { id: "ALT-103", severity: "high", affectedService: "UAE Telecom Media Policy", description: "United Arab Emirates remains in Restricted country availability pending voice/video clearance.", timestamp: "2026-11-05T11:10:00Z", status: "open", assignedAdmin: "Head of Safety David", relatedRef: "AE", internalNotes: ["Verified impact: no existing user accounts deleted."], isDemoRecord: true },
];

const INITIAL_AUDIT: ConfigAuditLogRecord[] = [
  { id: "CFG-AUD-001", administrator: "Sarah Alexander", actorRole: "Super Administrator", category: "authentication", settingName: "Admin 2FA & Session Timeout", previousValue: "Optional 2FA / 60m idle", newValue: "Required All Admins / 30m idle", reason: "Align with SOC-2 baseline protection for financial & user privacy controls.", approvalStatus: "applied", timestamp: "2026-11-09T14:20:00Z" },
  { id: "CFG-AUD-002", administrator: "Sarah Alexander", actorRole: "Super Administrator", category: "regional", settingName: "Country Availability: UAE (AE)", previousValue: "enabled", newValue: "restricted", reason: "Pending local WebRTC telecom clearance.", approvalStatus: "applied", timestamp: "2026-10-15T14:00:00Z" },
  { id: "CFG-AUD-003", administrator: "Elena Vance", actorRole: "Platform Administrator", category: "currency", settingName: "Display Default Currency", previousValue: "USD", newValue: "USD (Unchanged; NGN/GBP/EUR regional pairs active)", reason: "Verified historical subscription invoices remain untouched.", approvalStatus: "applied", timestamp: "2026-10-05T11:30:00Z" },
];

const INITIAL_VERSIONS: ConfigVersionSnapshot[] = [
  {
    versionId: "VER-CFG-2026-11-09",
    label: "v1.4 Security Baseline",
    category: "authentication",
    changedBy: "Sarah Alexander",
    reason: "Mandatory Admin MFA and 30-min session timeout",
    createdAt: "2026-11-09T14:20:00Z",
    snapshotSummary: "Admin 2FA: required_all_admins | Session timeout: 30m | Min password length: 12",
    payloadJson: JSON.stringify({
      adminMfaEnforcement: "required_all_admins",
      adminSessionIdleTimeoutMinutes: 30,
      minPasswordLength: 12,
    }),
  },
  {
    versionId: "VER-CFG-2026-10-15",
    label: "v1.3 Regional Compliance Baseline",
    category: "general",
    changedBy: "Sarah Alexander",
    reason: "Initial general platform configuration & support contact verified",
    createdAt: "2026-10-15T14:00:00Z",
    snapshotSummary: "Platform: NobleBond | Support Email: support@noblebond.com | Default Currency: USD",
    payloadJson: JSON.stringify({
      platformName: "NobleBond",
      defaultContactEmail: "support@noblebond.com",
      platformStatus: "operational",
    }),
  },
];

export function buildInitialSystemSettingsState(): SystemSettingsRootState {
  return {
    general: {
      platformName: "NobleBond",
      applicationName: "NobleBond Mobile",
      adminDashboardName: "NobleBond Admin Console",
      platformDescription: "International relationship, live social interaction, and verified matchmaking platform.",
      tagline: "Beyond a match. A real connection.",
      minimumAge: 18,
      platformWebsite: "https://noblebond.app",
      supportWebsite: "https://noblebond.app/support",
      defaultContactEmail: "support@noblebond.com",
      defaultSupportContact: "NobleBond Member Concierge (support@noblebond.com)",
      organisationName: "NobleBond Technologies",
      organisationJurisdiction: "International Operations",
      platformStatus: "operational",
      defaultLanguageCode: "en-US",
      defaultCountryCode: "US",
      defaultTimezone: "UTC",
      defaultRegionGroup: "Global International",
      defaultDateFormat: "MMM DD, YYYY",
      defaultTimeFormat: "24h",
      defaultNotificationsOptIn: true,
      lastUpdatedAt: "2026-11-09T14:20:00Z",
      lastUpdatedBy: "Sarah Alexander",
    },
    branding: {
      brandName: "NobleBond",
      brandDescription: "Signature warm rose/plum light aesthetic (#FFF8F6 / #C12F66) and deep plum dark palette (#151019 / #F15B8D).",
      visualVariants: ["Warm Rose Light Mode", "Deep Plum Dark Mode", "System Automatic"],
      assets: INITIAL_ASSETS,
    },
    theme: {
      globalDefaultTheme: "system",
      allowUserOverride: true,
      migrateExistingUsersOnDefaultChange: false,
      customThemeHookReady: true,
      contrastValidationPassed: true,
      lastUpdatedAt: "2026-11-01T10:00:00Z",
    },
    countries: INITIAL_COUNTRIES,
    languages: INITIAL_LANGUAGES,
    currencies: INITIAL_CURRENCIES,
    exchangeRates: INITIAL_EXCHANGE_RATES,
    features: INITIAL_FEATURES,
    authSecurity: {
      allowEmailRegistration: true,
      allowPhoneRegistration: true,
      requireEmailVerification: true,
      requirePhoneVerification: false,
      requireAge18Declaration: true,
      suspiciousSignupShieldEnabled: true,
      maxLoginAttempts: 5,
      lockoutDurationMinutes: 15,
      suspiciousLoginAlertsEnabled: true,
      minPasswordLength: 12,
      requireUppercase: true,
      requireNumeric: true,
      requireSpecialChar: true,
      passwordReuseHistoryCount: 5,
      resetTokenExpiryMinutes: 20,
      resetRateLimitPerHour: 3,
      adminMfaEnforcement: "required_all_admins",
      supportedMfaMethods: ["Authenticator App (TOTP)", "Hardware Security Key (WebAuthn)"],
      adminSessionIdleTimeoutMinutes: 30,
      lastUpdatedAt: "2026-11-09T14:20:00Z",
    },
    admins: INITIAL_ADMINS,
    roles: INITIAL_ROLES,
    sessions: INITIAL_SESSIONS,
    securityEvents: INITIAL_SECURITY_EVENTS,
    privacy: {
      defaultProfileVisibility: "discoverable",
      defaultDiscoveryOptIn: true,
      defaultShowOnlineStatus: true,
      defaultReadReceipts: false,
      showApproximateDistanceOnly: true,
      allowDataExportRequests: true,
      allowAccountDeletionRequests: true,
      retentionRules: [
        { category: "Financial & Subscription Records", legalBasis: "Statutory Tax & Chargeback Defence", retentionDays: 2555, lockedByCompliance: true, description: "7-year mandatory financial ledger retention; never auto-purged." },
        { category: "Security & Authentication Audit Logs", legalBasis: "Incident Forensics & RBAC Compliance", retentionDays: 730, lockedByCompliance: true, description: "Append-only security trail protected against administrative deletion." },
        { category: "Moderation & Trust Reports", legalBasis: "Platform Safety & Appeals Review", retentionDays: 1095, lockedByCompliance: false, description: "Retained 3 years for repeat-offender prevention and appeal adjudication." },
        { category: "Customer Support Tickets", legalBasis: "Service Quality & Resolution History", retentionDays: 730, lockedByCompliance: false, description: "Connected to Customer Support operations." },
        { category: "Cancelled/Deleted Account Profile Media", legalBasis: "User Erasure Fulfillment", retentionDays: 30, lockedByCompliance: false, description: "30-day grace recovery window prior to permanent media purge." },
      ],
    },
    policies: INITIAL_POLICIES,
    notificationChannels: INITIAL_NOTIF_CHANNELS,
    notificationCategories: INITIAL_NOTIF_CATS,
    paymentIntegrations: INITIAL_PAYMENTS,
    externalIntegrations: INITIAL_INTEGRATIONS,
    appVersions: INITIAL_APP_VERSIONS,
    maintenance: {
      status: "operational",
      maintenanceMessage: "Scheduled platform enhancements in progress. Normal access will resume shortly.",
      scheduledStartAt: null,
      expectedEndAt: null,
      affectedPlatforms: ["iOS", "Android", "Web"],
      allowAdminAccessDuringMaintenance: true,
      activatedBy: null,
    },
    servicesHealth: INITIAL_SERVICES_HEALTH,
    backgroundJobs: INITIAL_JOBS,
    alerts: INITIAL_ALERTS,
    auditLogs: INITIAL_AUDIT,
    versionSnapshots: INITIAL_VERSIONS,
    pendingApprovals: [],
    recentlyUsedSections: ["general", "roles_permissions", "regional"],
    frequentlyUsedSections: ["roles_permissions", "features", "payments", "audit_history"],
    lastSyncedAt: new Date().toISOString(),
  };
}

export function loadSystemSettingsState(): SystemSettingsRootState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = buildInitialSystemSettingsState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw) as SystemSettingsRootState;
    return parsed;
  } catch {
    return buildInitialSystemSettingsState();
  }
}

export function saveSystemSettingsState(state: SystemSettingsRootState): SystemSettingsRootState {
  const stamped: SystemSettingsRootState = {
    ...state,
    lastSyncedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stamped));
  } catch {
    // ignore storage quota errors gracefully
  }
  return stamped;
}

export function appendAuditAndSnapshot(
  state: SystemSettingsRootState,
  entry: {
    administrator: string;
    actorRole: string;
    category: SettingsSectionKey;
    settingName: string;
    previousValue: string;
    newValue: string;
    reason: string;
    approvalStatus?: ConfigAuditLogRecord["approvalStatus"];
    snapshotPayload?: Record<string, unknown>;
  }
): SystemSettingsRootState {
  const now = new Date().toISOString();
  const newLog: ConfigAuditLogRecord = {
    id: `CFG-AUD-${String(state.auditLogs.length + 1).padStart(3, "0")}-${Date.now().toString().slice(-4)}`,
    administrator: entry.administrator,
    actorRole: entry.actorRole,
    category: entry.category,
    settingName: entry.settingName,
    previousValue: entry.previousValue,
    newValue: entry.newValue,
    reason: entry.reason || "Routine configuration update",
    approvalStatus: entry.approvalStatus || "applied",
    timestamp: now,
  };

  let nextSnapshots = state.versionSnapshots;
  if (entry.snapshotPayload) {
    const snap: ConfigVersionSnapshot = {
      versionId: `VER-CFG-${Date.now().toString().slice(-6)}`,
      label: entry.settingName,
      category: entry.category,
      changedBy: entry.administrator,
      reason: entry.reason,
      createdAt: now,
      snapshotSummary: `${entry.settingName}: ${entry.newValue}`,
      payloadJson: JSON.stringify(entry.snapshotPayload),
    };
    nextSnapshots = [snap, ...state.versionSnapshots];
  }

  const nextRecent = [
    entry.category,
    ...state.recentlyUsedSections.filter((s) => s !== entry.category),
  ].slice(0, 6);

  return saveSystemSettingsState({
    ...state,
    auditLogs: [newLog, ...state.auditLogs],
    versionSnapshots: nextSnapshots,
    recentlyUsedSections: nextRecent,
  });
}

export function stageTwoPersonApproval(
  state: SystemSettingsRootState,
  req: Omit<PendingTwoPersonApproval, "id" | "createdAt" | "status">
): SystemSettingsRootState {
  const created: PendingTwoPersonApproval = {
    ...req,
    id: `APR-${Date.now().toString().slice(-6)}`,
    createdAt: new Date().toISOString(),
    status: "pending_second_approver",
  };
  return appendAuditAndSnapshot(
    {
      ...state,
      pendingApprovals: [created, ...state.pendingApprovals],
    },
    {
      administrator: req.requestedBy,
      actorRole: "Requested Two-Person Sign-Off",
      category: req.category,
      settingName: req.actionTitle,
      previousValue: req.previousValue,
      newValue: `${req.proposedValue} (Staged — Awaiting Second Approver)`,
      reason: req.reason,
      approvalStatus: "pending_two_person_approval",
    }
  );
}

export interface SettingsSearchMatch {
  id: string;
  title: string;
  sectionKey: SettingsSectionKey;
  sectionLabel: string;
  statusTag: string;
  updatedBy: string;
  snippet: string;
}

export function searchSystemSettings(
  state: SystemSettingsRootState,
  query: string
): SettingsSearchMatch[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const matches: SettingsSearchMatch[] = [];

  for (const sec of SETTINGS_SECTIONS_META) {
    if (
      sec.label.toLowerCase().includes(q) ||
      sec.description.toLowerCase().includes(q)
    ) {
      matches.push({
        id: `sec_${sec.key}`,
        title: sec.label,
        sectionKey: sec.key,
        sectionLabel: sec.shortLabel,
        statusTag: "Section",
        updatedBy: "System",
        snippet: sec.description,
      });
    }
  }

  for (const c of state.countries) {
    if (
      c.name.toLowerCase().includes(q) ||
      c.isoCode.toLowerCase().includes(q) ||
      c.defaultCurrencyCode.toLowerCase().includes(q)
    ) {
      matches.push({
        id: `ctry_${c.isoCode}`,
        title: `Country: ${c.name} (${c.isoCode})`,
        sectionKey: "regional",
        sectionLabel: "Regional & Localization",
        statusTag: c.status,
        updatedBy: c.updatedBy,
        snippet: `${c.region} • Currency: ${c.defaultCurrencyCode} • TZ: ${c.timezone}`,
      });
    }
  }

  for (const f of state.features) {
    if (f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)) {
      matches.push({
        id: `feat_${f.id}`,
        title: `Feature Flag: ${f.name}`,
        sectionKey: "features",
        sectionLabel: "Feature Controls",
        statusTag: f.enabled ? "Enabled" : "Disabled",
        updatedBy: f.updatedBy,
        snippet: f.description,
      });
    }
  }

  for (const cur of state.currencies) {
    if (cur.code.toLowerCase().includes(q) || cur.name.toLowerCase().includes(q)) {
      matches.push({
        id: `cur_${cur.code}`,
        title: `Currency: ${cur.code} (${cur.name})`,
        sectionKey: "currency",
        sectionLabel: "Currency & Financial",
        statusTag: cur.isAvailable ? "Enabled" : "Disabled",
        updatedBy: "Finance Team",
        snippet: `Symbol: ${cur.symbol} • Precision: ${cur.decimalPrecision}`,
      });
    }
  }

  for (const adm of state.admins) {
    if (
      adm.name.toLowerCase().includes(q) ||
      adm.email.toLowerCase().includes(q) ||
      adm.roleName.toLowerCase().includes(q)
    ) {
      matches.push({
        id: `adm_${adm.id}`,
        title: `Administrator: ${adm.name}`,
        sectionKey: "administrators",
        sectionLabel: "Administrator Accounts",
        statusTag: adm.status,
        updatedBy: adm.name,
        snippet: `${adm.roleName} • MFA: ${adm.mfaEnabled ? "Enabled" : "Not Enrolled"}`,
      });
    }
  }

  for (const r of state.roles) {
    if (r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)) {
      matches.push({
        id: `role_${r.id}`,
        title: `RBAC Role: ${r.name}`,
        sectionKey: "roles_permissions",
        sectionLabel: "Roles & Permissions",
        statusTag: r.isActive ? "Active" : "Inactive",
        updatedBy: "Super Administrator",
        snippet: r.description,
      });
    }
  }

  return matches.slice(0, 14);
}

export function exportSettingsAuditCsv(logs: ConfigAuditLogRecord[]): void {
  const esc = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const headers = [
    "Event ID",
    "Timestamp",
    "Administrator",
    "Role",
    "Category",
    "Setting Name",
    "Previous Value",
    "New Value",
    "Reason",
    "Approval Status",
  ];
  const lines = [
    headers.map(esc).join(","),
    ...logs.map((l) =>
      [
        l.id,
        l.timestamp,
        l.administrator,
        l.actorRole,
        l.category,
        l.settingName,
        l.previousValue,
        l.newValue,
        l.reason,
        l.approvalStatus,
      ]
        .map(esc)
        .join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `noblebond_system_settings_audit_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function countActiveSuperAdmins(
  admins: SystemSettingsRootState["admins"],
  excludeAdminId?: string
): number {
  return admins.filter(
    (a) => a.id !== excludeAdminId && a.roleId === "super_admin" && a.status === "active"
  ).length;
}

export function canRoleEditSetting(
  roles: RbacRoleDefinition[],
  activeRoleId: AdminRoleId,
  permissionKey: string
): boolean {
  const role = roles.find((r) => r.id === activeRoleId);
  if (!role || !role.isActive) return false;
  return Boolean(role.grantedPermissions[permissionKey]);
}

export function createDemoAdminEntry(
  name: string,
  email: string,
  roleId: AdminRoleId,
  roleName: string
): AdminAccountRecord {
  const now = new Date().toISOString();
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("") || "AD";
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "_");
  return {
    id: `adm_demo_${Date.now()}`,
    name,
    username: `@${slug}_demo`,
    email,
    avatarInitials: initials,
    roleId,
    roleName,
    status: "invited",
    mfaEnabled: false,
    mfaMethod: "Not Enrolled",
    lastLoginAt: null,
    lastActiveAt: null,
    createdAt: now,
    isPrimarySuperAdmin: false,
  };
}

export function createClonedRoleEntry(
  name: string,
  description: string,
  grantedPermissions: Record<string, boolean>
): RbacRoleDefinition {
  const now = new Date().toISOString();
  return {
    id: `custom_role_${Date.now()}`,
    name,
    description,
    isSystemRole: false,
    isActive: true,
    isProtectedSuperRole: false,
    grantedPermissions,
    createdAt: now,
    updatedAt: now,
  };
}

export function applyRollbackSnapshotToState(
  state: SystemSettingsRootState,
  snapshot: ConfigVersionSnapshot,
  actorName: string,
  actorRoleName: string,
  reason: string
): SystemSettingsRootState {
  let nextState = { ...state };
  try {
    const parsed = JSON.parse(snapshot.payloadJson) as Record<string, unknown>;
    if (snapshot.category === "general") {
      nextState.general = { ...state.general, ...parsed, lastUpdatedAt: new Date().toISOString(), lastUpdatedBy: actorName };
    } else if (snapshot.category === "authentication") {
      nextState.authSecurity = { ...state.authSecurity, ...parsed, lastUpdatedAt: new Date().toISOString() };
    } else if (snapshot.category === "theme") {
      nextState.theme = { ...state.theme, ...parsed, lastUpdatedAt: new Date().toISOString() };
    } else if (snapshot.category === "privacy") {
      nextState.privacy = { ...state.privacy, ...parsed };
    }
  } catch {
    // retain existing state fields safely if payload parse fails
  }
  nextState = appendAuditAndSnapshot(nextState, {
    administrator: actorName,
    actorRole: actorRoleName,
    category: snapshot.category,
    settingName: `Rollback to ${snapshot.versionId} (${snapshot.label})`,
    previousValue: "Current Configuration State",
    newValue: snapshot.snapshotSummary,
    reason,
    approvalStatus: "rolled_back",
  });
  return nextState;
}
