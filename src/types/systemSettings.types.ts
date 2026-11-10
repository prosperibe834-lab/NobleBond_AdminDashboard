// NobleBond Admin — Enterprise System Settings & Security Configuration Types
// Enforces 19 structured configuration sections, 14-module RBAC matrix, immutable audit logs,
// configuration versioning & rollback, zero credential exposure, and zero emojis.

export type SettingsSectionKey =
  | "general"
  | "branding"
  | "theme"
  | "regional"
  | "currency"
  | "features"
  | "authentication"
  | "administrators"
  | "roles_permissions"
  | "sessions_security"
  | "privacy"
  | "policies"
  | "notifications"
  | "payments"
  | "integrations"
  | "app_versions"
  | "maintenance_ops"
  | "monitoring_alerts"
  | "audit_history";

export type PlatformOperationalStatus = "operational" | "limited_availability" | "maintenance_mode";

export type ThemeDefaultPreference = "system" | "light" | "dark";

export type AvailabilityStatus = "enabled" | "restricted" | "disabled";

export type AdminAccountStatus =
  | "active"
  | "inactive"
  | "suspended"
  | "invited"
  | "pending_activation";

export type AdminRoleId =
  | "super_admin"
  | "administrator"
  | "finance_admin"
  | "support_agent"
  | "moderator"
  | "analytics_viewer"
  | "read_only_admin"
  | string;

export type SystemSettingsPermissionKey =
  | "viewSettings"
  | "editGeneral"
  | "changeBranding"
  | "changeThemeDefaults"
  | "manageRegional"
  | "manageCurrencies"
  | "manageFeatures"
  | "manageSecurityPolicies"
  | "manageAdmins"
  | "manageRoles"
  | "managePermissions"
  | "revokeSessions"
  | "managePrivacy"
  | "managePolicies"
  | "manageNotifications"
  | "managePayments"
  | "manageIntegrations"
  | "manageMaintenance"
  | "viewMonitoring"
  | "viewAuditHistory"
  | "performRollback";

export interface PlatformGeneralSettings {
  platformName: string;
  applicationName: string;
  adminDashboardName: string;
  platformDescription: string;
  tagline: string;
  minimumAge: number;
  platformWebsite: string;
  supportWebsite: string;
  defaultContactEmail: string;
  defaultSupportContact: string;
  organisationName: string;
  organisationJurisdiction: string;
  platformStatus: PlatformOperationalStatus;
  defaultLanguageCode: string;
  defaultCountryCode: string;
  defaultTimezone: string;
  defaultRegionGroup: string;
  defaultDateFormat: "MMM DD, YYYY" | "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";
  defaultTimeFormat: "12h" | "24h";
  defaultNotificationsOptIn: boolean;
  lastUpdatedAt: string;
  lastUpdatedBy: string;
}

export interface BrandAssetConfig {
  id: string;
  slotLabel: string;
  assetType:
    | "primary_logo"
    | "light_logo"
    | "dark_logo"
    | "admin_logo"
    | "app_icon"
    | "favicon"
    | "promo_banner";
  currentUrl: string;
  previewDataUrl?: string;
  dimensionsGuidance: string;
  acceptedFormats: string;
  maxSizeKb: number;
  storageMode: "bundled_static" | "local_preview_pending_upload";
  lastUpdatedAt: string;
}

export interface BrandingConfigState {
  brandName: string;
  brandDescription: string;
  visualVariants: string[];
  assets: BrandAssetConfig[];
}

export interface ThemeConfigState {
  globalDefaultTheme: ThemeDefaultPreference;
  allowUserOverride: boolean;
  migrateExistingUsersOnDefaultChange: boolean;
  customThemeHookReady: boolean;
  contrastValidationPassed: boolean;
  lastUpdatedAt: string;
}

export interface CountryConfigRecord {
  isoCode: string;
  name: string;
  region: string;
  status: AvailabilityStatus;
  defaultCurrencyCode: string;
  defaultLanguageCode: string;
  timezone: string;
  supportedPaymentMethods: string[];
  restrictionReason?: string;
  effectiveDate?: string;
  updatedAt: string;
  updatedBy: string;
}

export interface LanguageConfigRecord {
  code: string;
  englishName: string;
  nativeName: string;
  countryOrigin: string;
  translationStatus: "complete" | "partial" | "base_catalogue_only";
  isAvailable: boolean;
  isDefault: boolean;
}

export interface CurrencyConfigRecord {
  code: string;
  name: string;
  symbol: string;
  decimalPrecision: number;
  isAvailable: boolean;
  supportedRegions: string[];
  isPlatformDisplayDefault: boolean;
}

export interface ExchangeRatePair {
  id: string;
  baseCurrency: string;
  quoteCurrency: string;
  rate: number | null;
  provider: string;
  rateSource: "live" | "scheduled" | "manual" | "unavailable";
  lastUpdatedAt: string | null;
  statusLabel: string;
}

export interface FeatureFlagRecord {
  id: string;
  name: string;
  description: string;
  category: "Core Social" | "Communication" | "Live & Economy" | "Trust & Support" | "Planned";
  enabled: boolean;
  availabilityScope: "all_users" | "selected_countries" | "selected_platforms" | "selected_groups";
  targetNotes: string;
  platforms: Array<"iOS" | "Android" | "Web">;
  integrationReady: boolean;
  dependencyNote: string;
  lastUpdatedAt: string;
  updatedBy: string;
}

export interface AuthSecurityPolicies {
  allowEmailRegistration: boolean;
  allowPhoneRegistration: boolean;
  requireEmailVerification: boolean;
  requirePhoneVerification: boolean;
  requireAge18Declaration: boolean;
  suspiciousSignupShieldEnabled: boolean;
  maxLoginAttempts: number;
  lockoutDurationMinutes: number;
  suspiciousLoginAlertsEnabled: boolean;
  minPasswordLength: number;
  requireUppercase: boolean;
  requireNumeric: boolean;
  requireSpecialChar: boolean;
  passwordReuseHistoryCount: number;
  resetTokenExpiryMinutes: number;
  resetRateLimitPerHour: number;
  adminMfaEnforcement: "required_all_admins" | "required_sensitive_roles" | "optional";
  supportedMfaMethods: string[];
  adminSessionIdleTimeoutMinutes: number;
  lastUpdatedAt: string;
}

export interface AdminAccountRecord {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarInitials: string;
  roleId: AdminRoleId;
  roleName: string;
  status: AdminAccountStatus;
  mfaEnabled: boolean;
  mfaMethod: "Authenticator App (TOTP)" | "Hardware Security Key" | "Not Enrolled";
  lastLoginAt: string | null;
  lastActiveAt: string | null;
  createdAt: string;
  isPrimarySuperAdmin: boolean;
}

export interface ModulePermissionGroup {
  moduleKey: string;
  moduleLabel: string;
  permissions: Array<{
    key: string;
    label: string;
    description: string;
  }>;
}

export interface RbacRoleDefinition {
  id: AdminRoleId;
  name: string;
  description: string;
  isSystemRole: boolean;
  isActive: boolean;
  isProtectedSuperRole: boolean;
  grantedPermissions: Record<string, boolean>;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSessionRecord {
  id: string;
  adminId: string;
  adminName: string;
  deviceType: "Desktop" | "Laptop" | "Mobile" | "Tablet";
  browser: string;
  operatingSystem: string;
  maskedIp: string;
  approxLocation: string;
  loginAt: string;
  lastActivityAt: string;
  status: "active" | "expired" | "revoked";
  isCurrentSession: boolean;
}

export interface SecurityEventRecord {
  id: string;
  eventType:
    | "new_admin_login"
    | "failed_login"
    | "suspicious_session"
    | "session_expired"
    | "session_revoked"
    | "password_policy_check"
    | "mfa_enforcement_updated";
  severity: "info" | "low" | "medium" | "high";
  actorLabel: string;
  summary: string;
  timestamp: string;
}

export interface DataRetentionRule {
  category: string;
  legalBasis: string;
  retentionDays: number;
  lockedByCompliance: boolean;
  description: string;
}

export interface PrivacyDataProtectionConfig {
  defaultProfileVisibility: "discoverable" | "limited_preview";
  defaultDiscoveryOptIn: boolean;
  defaultShowOnlineStatus: boolean;
  defaultReadReceipts: boolean;
  showApproximateDistanceOnly: boolean;
  allowDataExportRequests: boolean;
  allowAccountDeletionRequests: boolean;
  retentionRules: DataRetentionRule[];
}

export interface CommunityPolicyRecord {
  id: string;
  title: string;
  category: string;
  publishedVersion: string;
  publishedSummary: string;
  draftSummary: string;
  hasUnpublishedDraft: boolean;
  requiresUserAcknowledgement: boolean;
  lastPublishedAt: string;
  lastPublishedBy: string;
  previousVersions: Array<{
    version: string;
    publishedAt: string;
    publishedBy: string;
    notes: string;
  }>;
}

export interface NotificationChannelConfig {
  id: string;
  channel: "In-App" | "Push" | "Email" | "SMS";
  providerName: string;
  configurationStatus: "configured" | "not_configured" | "demo_local";
  enabled: boolean;
  lastSuccessfulDeliveryAt: string | null;
  lastFailureSummary: string | null;
}

export interface NotificationCategoryConfig {
  id: string;
  categoryName: string;
  inAppEnabled: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  templateSubject: string;
}

export interface PaymentIntegrationRecord {
  id: string;
  providerName: string;
  channelLabel: string;
  environment: "sandbox_test" | "production" | "unconfigured";
  connectionStatus: "configured_demo" | "connected_verified" | "not_configured";
  maskedCredentialRef: string;
  supportedCurrencies: string[];
  enabledFeatures: string[];
  webhookStatus: "active" | "pending_endpoint" | "unavailable";
  docsUrl: string;
  configVersion: string;
  lastSuccessfulEventAt: string | null;
  lastError: string | null;
  lastUpdatedAt: string;
}

export interface ExternalIntegrationRecord {
  id: string;
  name: string;
  category: string;
  provider: string;
  configStatus: "configured" | "demo_local" | "not_configured";
  connectionStatus: "healthy" | "degraded" | "unavailable" | "untested";
  enabled: boolean;
  maskedRef: string;
  lastSuccessAt: string | null;
  lastError: string | null;
  docsUrl: string;
  lastUpdatedAt: string;
}

export interface AppVersionRecord {
  id: string;
  platform: "iOS" | "Android" | "Web Admin";
  currentVersion: string;
  minimumSupportedVersion: string;
  latestAvailableVersion: string;
  updatePolicy: "optional" | "recommended" | "mandatory";
  publishState: "published" | "saved_draft";
  releaseDate: string;
  releaseNotes: string;
  maintenanceBannerText: string;
}

export interface MaintenanceOperationsConfig {
  status: PlatformOperationalStatus;
  maintenanceMessage: string;
  scheduledStartAt: string | null;
  expectedEndAt: string | null;
  affectedPlatforms: Array<"iOS" | "Android" | "Web">;
  allowAdminAccessDuringMaintenance: boolean;
  activatedBy: string | null;
}

export interface SystemServiceHealthRecord {
  serviceName: string;
  category: string;
  status: "operational_local" | "monitoring_unconnected" | "degraded" | "unavailable";
  summary: string;
  lastCheckedAt: string;
}

export interface BackgroundJobRecord {
  id: string;
  jobName: string;
  schedule: string;
  status: "completed" | "scheduled" | "unconnected";
  lastRunAt: string | null;
  nextRunAt: string | null;
  durationMs: number | null;
  failureNote: string | null;
}

export interface SystemAlertRecord {
  id: string;
  severity: "informational" | "low" | "medium" | "high" | "critical";
  affectedService: string;
  description: string;
  timestamp: string;
  status: "open" | "acknowledged" | "escalated" | "resolved";
  assignedAdmin: string;
  relatedRef: string;
  internalNotes: string[];
  isDemoRecord: boolean;
}

export interface ConfigAuditLogRecord {
  id: string;
  administrator: string;
  actorRole: string;
  category: SettingsSectionKey;
  settingName: string;
  previousValue: string;
  newValue: string;
  reason: string;
  approvalStatus: "applied" | "pending_two_person_approval" | "approved" | "rolled_back";
  timestamp: string;
}

export interface ConfigVersionSnapshot {
  versionId: string;
  label: string;
  category: SettingsSectionKey;
  changedBy: string;
  reason: string;
  createdAt: string;
  snapshotSummary: string;
  payloadJson: string;
}

export interface PendingTwoPersonApproval {
  id: string;
  requestedBy: string;
  category: SettingsSectionKey;
  actionTitle: string;
  impactSummary: string;
  previousValue: string;
  proposedValue: string;
  reason: string;
  createdAt: string;
  status: "pending_second_approver" | "approved" | "rejected";
}

export interface SystemSettingsRootState {
  general: PlatformGeneralSettings;
  branding: BrandingConfigState;
  theme: ThemeConfigState;
  countries: CountryConfigRecord[];
  languages: LanguageConfigRecord[];
  currencies: CurrencyConfigRecord[];
  exchangeRates: ExchangeRatePair[];
  features: FeatureFlagRecord[];
  authSecurity: AuthSecurityPolicies;
  admins: AdminAccountRecord[];
  roles: RbacRoleDefinition[];
  sessions: AdminSessionRecord[];
  securityEvents: SecurityEventRecord[];
  privacy: PrivacyDataProtectionConfig;
  policies: CommunityPolicyRecord[];
  notificationChannels: NotificationChannelConfig[];
  notificationCategories: NotificationCategoryConfig[];
  paymentIntegrations: PaymentIntegrationRecord[];
  externalIntegrations: ExternalIntegrationRecord[];
  appVersions: AppVersionRecord[];
  maintenance: MaintenanceOperationsConfig;
  servicesHealth: SystemServiceHealthRecord[];
  backgroundJobs: BackgroundJobRecord[];
  alerts: SystemAlertRecord[];
  auditLogs: ConfigAuditLogRecord[];
  versionSnapshots: ConfigVersionSnapshot[];
  pendingApprovals: PendingTwoPersonApproval[];
  recentlyUsedSections: SettingsSectionKey[];
  frequentlyUsedSections: SettingsSectionKey[];
  lastSyncedAt: string;
}

