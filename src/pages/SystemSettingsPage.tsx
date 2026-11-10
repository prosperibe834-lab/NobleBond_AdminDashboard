import React, { useEffect, useState } from "react";
import {
  Globe,
  Image as ImageIcon,
  Palette,
  Languages,
  DollarSign,
  ToggleLeft,
  ShieldCheck,
  UserCog,
  Key,
  MonitorSmartphone,
  Shield,
  FileText,
  Bell,
  CreditCard,
  Plug,
  Smartphone,
  Wrench,
  BellRing,
  History,
  RefreshCw,
  WifiOff,
  AlertTriangle,
  Menu,
  X,
  ChevronRight,
  Clock,
} from "lucide-react";
import {
  appendAuditAndSnapshot,
  applyRollbackSnapshotToState,
  canRoleEditSetting,
  createClonedRoleEntry,
  createDemoAdminEntry,
  loadSystemSettingsState,
  saveSystemSettingsState,
  stageTwoPersonApproval,
} from "../data/systemSettingsDataService";
import type {
  AdminAccountRecord,
  AdminRoleId,
  AppVersionRecord,
  AuthSecurityPolicies,
  AvailabilityStatus,
  ConfigVersionSnapshot,
  FeatureFlagRecord,
  PlatformGeneralSettings,
  PrivacyDataProtectionConfig,
  SettingsSectionKey,
  SystemAlertRecord,
  SystemSettingsRootState,
  ThemeConfigState,
} from "../types/systemSettings.types";
import {
  formatSettingsTimestamp,
  SETTINGS_SECTIONS_META,
} from "../components/settings/settingsUiUtils";
import { SettingsSkeletonLoader } from "../components/settings/SettingsSkeletonLoader";
import { SettingsConfirmModal } from "../components/settings/SettingsConfirmModal";
import { SettingsSearchBar } from "../components/settings/SettingsSearchBar";
import { GeneralBrandingThemeSection } from "../components/settings/sections/GeneralBrandingThemeSection";
import { RegionalAndCurrencySection } from "../components/settings/sections/RegionalAndCurrencySection";
import { FeaturesAndAuthSecuritySection } from "../components/settings/sections/FeaturesAndAuthSecuritySection";
import { AdminRbacAndSessionsSection } from "../components/settings/sections/AdminRbacAndSessionsSection";
import { PrivacyPoliciesNotificationsSection } from "../components/settings/sections/PrivacyPoliciesNotificationsSection";
import { IntegrationsVersionsOpsMonitoringSection } from "../components/settings/sections/IntegrationsVersionsOpsMonitoringSection";
import { AuditAndRollbackSection } from "../components/settings/sections/AuditAndRollbackSection";
import type { ConfirmActionRequest } from "../components/settings/sections/sharedSectionTypes";

const SECTION_ICONS: Record<SettingsSectionKey, React.ReactNode> = {
  general: <Globe size={15} />,
  branding: <ImageIcon size={15} />,
  theme: <Palette size={15} />,
  regional: <Languages size={15} />,
  currency: <DollarSign size={15} />,
  features: <ToggleLeft size={15} />,
  authentication: <ShieldCheck size={15} />,
  administrators: <UserCog size={15} />,
  roles_permissions: <Key size={15} />,
  sessions_security: <MonitorSmartphone size={15} />,
  privacy: <Shield size={15} />,
  policies: <FileText size={15} />,
  notifications: <Bell size={15} />,
  payments: <CreditCard size={15} />,
  integrations: <Plug size={15} />,
  app_versions: <Smartphone size={15} />,
  maintenance_ops: <Wrench size={15} />,
  monitoring_alerts: <BellRing size={15} />,
  audit_history: <History size={15} />,
};

const GROUPS: Array<
  "Platform & Localization" | "Access & Security" | "Privacy & Comms" | "Infrastructure & Audit"
> = [
  "Platform & Localization",
  "Access & Security",
  "Privacy & Comms",
  "Infrastructure & Audit",
];

export const SystemSettingsPage: React.FC = () => {
  const [settingsState, setSettingsState] = useState<SystemSettingsRootState>(() =>
    loadSystemSettingsState()
  );
  const [activeSection, setActiveSection] = useState<SettingsSectionKey>("general");
  const [viewerRoleId, setViewerRoleId] = useState<AdminRoleId>("super_admin");
  const [quickFilter, setQuickFilter] = useState<"all" | "recent" | "frequent">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmActionRequest | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isCompactViewport, setIsCompactViewport] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 980 : false
  );
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const onResize = () => setIsCompactViewport(window.innerWidth <= 980);
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("resize", onResize);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const viewerRoleObj =
    settingsState.roles.find((r) => r.id === viewerRoleId) || settingsState.roles[0];
  const actorName = viewerRoleId === "super_admin" ? "Sarah Alexander" : viewerRoleObj.name;
  const actorRoleLabel = viewerRoleObj.name;

  const hasPerm = (key: string) =>
    canRoleEditSetting(settingsState.roles, viewerRoleId, key);

  const handleRequestConfirm = (req: ConfirmActionRequest) => {
    setConfirmModal({
      ...req,
      onConfirm: ({ reason, stageTwoPerson }) => {
        if (stageTwoPerson) {
          const staged = stageTwoPersonApproval(settingsState, {
            requestedBy: actorName,
            category: activeSection,
            actionTitle: req.title,
            impactSummary: req.impactWarning || req.description,
            previousValue: "Active Configuration",
            proposedValue: req.confirmLabel || req.title,
            reason,
          });
          setSettingsState(staged);
          setToast(
            `Staged "${req.title}" into the Two-Person Approval Queue (see Audit & Rollback).`
          );
          setConfirmModal(null);
          return;
        }
        req.onConfirm({ reason, stageTwoPerson: false });
        setConfirmModal(null);
      },
    });
  };

  const handleRefresh = () => {
    setSyncError(null);
    setIsRefreshing(true);
    window.setTimeout(() => {
      try {
        setSettingsState(loadSystemSettingsState());
        setToast("System configuration synchronized from local demonstration persistence.");
      } catch (err) {
        setSyncError(err instanceof Error ? err.message : "Failed to refresh configuration.");
      } finally {
        setIsRefreshing(false);
      }
    }, 340);
  };

  // Mutation Helpers (all cleanly append immutable audit logs & save persistently)
  const handleSaveGeneral = (nextGeneral: PlatformGeneralSettings, reason: string) => {
    const updated = appendAuditAndSnapshot(
      {
        ...settingsState,
        general: {
          ...nextGeneral,
          lastUpdatedAt: new Date().toISOString(),
          lastUpdatedBy: actorName,
        },
      },
      {
        administrator: actorName,
        actorRole: actorRoleLabel,
        category: "general",
        settingName: "General Platform Configuration",
        previousValue: `${settingsState.general.platformName} (${settingsState.general.platformStatus})`,
        newValue: `${nextGeneral.platformName} (${nextGeneral.platformStatus})`,
        reason,
        snapshotPayload: {
          platformName: nextGeneral.platformName,
          defaultContactEmail: nextGeneral.defaultContactEmail,
          platformStatus: nextGeneral.platformStatus,
          defaultLanguageCode: nextGeneral.defaultLanguageCode,
        },
      }
    );
    setSettingsState(updated);
    setToast("Saved General Platform settings cleanly to local config store & Audit Log.");
  };

  const handleSaveBrandingAsset = (
    assetId: string,
    previewDataUrl: string | undefined,
    reason: string
  ) => {
    const target = settingsState.branding.assets.find((a) => a.id === assetId);
    const nextAssets = settingsState.branding.assets.map((a) =>
      a.id === assetId
        ? {
            ...a,
            previewDataUrl,
            storageMode: previewDataUrl
              ? ("local_preview_pending_upload" as const)
              : ("bundled_static" as const),
            lastUpdatedAt: new Date().toISOString(),
          }
        : a
    );
    const updated = appendAuditAndSnapshot(
      {
        ...settingsState,
        branding: { ...settingsState.branding, assets: nextAssets },
      },
      {
        administrator: actorName,
        actorRole: actorRoleLabel,
        category: "branding",
        settingName: `Brand Asset: ${target?.slotLabel || assetId}`,
        previousValue: target?.storageMode || "bundled_static",
        newValue: previewDataUrl ? "local_preview_pending_upload" : "bundled_static",
        reason,
      }
    );
    setSettingsState(updated);
    setToast(
      previewDataUrl
        ? `Saved local preview for ${target?.slotLabel}. Backend upload still needed for production.`
        : `Restored original bundled NobleBond asset for ${target?.slotLabel}.`
    );
  };

  const handleSaveThemeConfig = (nextTheme: ThemeConfigState, reason: string) => {
    const updated = appendAuditAndSnapshot(
      {
        ...settingsState,
        theme: { ...nextTheme, lastUpdatedAt: new Date().toISOString() },
      },
      {
        administrator: actorName,
        actorRole: actorRoleLabel,
        category: "theme",
        settingName: "Global Platform Theme Default",
        previousValue: settingsState.theme.globalDefaultTheme,
        newValue: nextTheme.globalDefaultTheme,
        reason,
        snapshotPayload: {
          globalDefaultTheme: nextTheme.globalDefaultTheme,
          allowUserOverride: nextTheme.allowUserOverride,
        },
      }
    );
    setSettingsState(updated);
    setToast(`Updated platform new-user theme default to "${nextTheme.globalDefaultTheme}".`);
  };

  const handleUpdateCountry = (
    isoCode: string,
    nextStatus: AvailabilityStatus,
    reason: string
  ) => {
    const target = settingsState.countries.find((c) => c.isoCode === isoCode);
    const nextCountries = settingsState.countries.map((c) =>
      c.isoCode === isoCode
        ? {
            ...c,
            status: nextStatus,
            restrictionReason: nextStatus === "enabled" ? undefined : reason,
            effectiveDate: new Date().toISOString().slice(0, 10),
            updatedAt: new Date().toISOString(),
            updatedBy: actorName,
          }
        : c
    );
    const updated = appendAuditAndSnapshot(
      { ...settingsState, countries: nextCountries },
      {
        administrator: actorName,
        actorRole: actorRoleLabel,
        category: "regional",
        settingName: `Country Availability: ${target?.name || isoCode}`,
        previousValue: target?.status || "unknown",
        newValue: nextStatus,
        reason,
      }
    );
    setSettingsState(updated);
    setToast(`Updated ${target?.name} (${isoCode}) status to "${nextStatus}".`);
  };

  const handleToggleLanguage = (code: string, reason: string) => {
    const target = settingsState.languages.find((l) => l.code === code);
    const nextLangs = settingsState.languages.map((l) =>
      l.code === code ? { ...l, isAvailable: !l.isAvailable } : l
    );
    const updated = appendAuditAndSnapshot(
      { ...settingsState, languages: nextLangs },
      {
        administrator: actorName,
        actorRole: actorRoleLabel,
        category: "regional",
        settingName: `Language Selector: ${target?.englishName || code}`,
        previousValue: target?.isAvailable ? "Active" : "Disabled",
        newValue: target?.isAvailable ? "Disabled" : "Active",
        reason,
      }
    );
    setSettingsState(updated);
    setToast(`Updated language selector availability for ${target?.englishName}.`);
  };

  const handleToggleCurrency = (code: string, reason: string) => {
    const target = settingsState.currencies.find((c) => c.code === code);
    const nextCurrencies = settingsState.currencies.map((c) =>
      c.code === code ? { ...c, isAvailable: !c.isAvailable } : c
    );
    const updated = appendAuditAndSnapshot(
      { ...settingsState, currencies: nextCurrencies },
      {
        administrator: actorName,
        actorRole: actorRoleLabel,
        category: "currency",
        settingName: `Currency Availability: ${code}`,
        previousValue: target?.isAvailable ? "Available" : "Disabled",
        newValue: target?.isAvailable ? "Disabled" : "Available",
        reason,
      }
    );
    setSettingsState(updated);
    setToast(`Updated currency ${code} availability cleanly without altering historical totals.`);
  };

  const handleSetDefaultCurrency = (code: string, reason: string) => {
    const prevDef =
      settingsState.currencies.find((c) => c.isPlatformDisplayDefault)?.code || "USD";
    const nextCurrencies = settingsState.currencies.map((c) => ({
      ...c,
      isPlatformDisplayDefault: c.code === code,
    }));
    const updated = appendAuditAndSnapshot(
      { ...settingsState, currencies: nextCurrencies },
      {
        administrator: actorName,
        actorRole: actorRoleLabel,
        category: "currency",
        settingName: "Platform Display Default Currency",
        previousValue: prevDef,
        newValue: code,
        reason,
      }
    );
    setSettingsState(updated);
    setToast(`Updated default display currency to ${code}.`);
  };

  const handleToggleFeature = (
    featureId: string,
    enabled: boolean,
    scope: FeatureFlagRecord["availabilityScope"],
    reason: string
  ) => {
    const target = settingsState.features.find((f) => f.id === featureId);
    if (!target || !target.integrationReady) return;
    const nextFeatures = settingsState.features.map((f) =>
      f.id === featureId
        ? {
            ...f,
            enabled,
            availabilityScope: scope,
            lastUpdatedAt: new Date().toISOString(),
            updatedBy: actorName,
          }
        : f
    );
    const updated = appendAuditAndSnapshot(
      { ...settingsState, features: nextFeatures },
      {
        administrator: actorName,
        actorRole: actorRoleLabel,
        category: "features",
        settingName: `Feature Flag: ${target.name}`,
        previousValue: `${target.enabled ? "Enabled" : "Disabled"} (${target.availabilityScope})`,
        newValue: `${enabled ? "Enabled" : "Disabled"} (${scope})`,
        reason,
      }
    );
    setSettingsState(updated);
    setToast(`Updated "${target.name}" feature control.`);
  };

  const handleSaveAuthSecurity = (nextAuth: AuthSecurityPolicies, reason: string) => {
    const updated = appendAuditAndSnapshot(
      {
        ...settingsState,
        authSecurity: { ...nextAuth, lastUpdatedAt: new Date().toISOString() },
      },
      {
        administrator: actorName,
        actorRole: actorRoleLabel,
        category: "authentication",
        settingName: "Authentication & Security Policy",
        previousValue: `MFA: ${settingsState.authSecurity.adminMfaEnforcement} | MinLen: ${settingsState.authSecurity.minPasswordLength}`,
        newValue: `MFA: ${nextAuth.adminMfaEnforcement} | MinLen: ${nextAuth.minPasswordLength}`,
        reason,
        snapshotPayload: {
          adminMfaEnforcement: nextAuth.adminMfaEnforcement,
          adminSessionIdleTimeoutMinutes: nextAuth.adminSessionIdleTimeoutMinutes,
          minPasswordLength: nextAuth.minPasswordLength,
        },
      }
    );
    setSettingsState(updated);
    setToast("Saved authentication security policies and appended audit log.");
  };

  const handleInviteDemoAdmin = (
    name: string,
    email: string,
    roleId: AdminRoleId,
    reason: string
  ) => {
    const roleObj = settingsState.roles.find((r) => r.id === roleId);
    const entry = createDemoAdminEntry(name, email, roleId, roleObj?.name || roleId);
    const updated = appendAuditAndSnapshot(
      { ...settingsState, admins: [entry, ...settingsState.admins] },
      {
        administrator: actorName,
        actorRole: actorRoleLabel,
        category: "administrators",
        settingName: `Demo Admin Invited: ${name}`,
        previousValue: "None",
        newValue: `${email} (${entry.roleName})`,
        reason,
      }
    );
    setSettingsState(updated);
    setToast(`Created demonstration admin invitation for ${name} (no live email dispatched).`);
  };

  const handleUpdateAdmin = (
    adminId: string,
    patch: Partial<Pick<AdminAccountRecord, "roleId" | "roleName" | "status">>,
    reason: string
  ) => {
    const target = settingsState.admins.find((a) => a.id === adminId);
    const nextAdmins = settingsState.admins.map((a) =>
      a.id === adminId ? { ...a, ...patch } : a
    );
    const updated = appendAuditAndSnapshot(
      { ...settingsState, admins: nextAdmins },
      {
        administrator: actorName,
        actorRole: actorRoleLabel,
        category: "administrators",
        settingName: `Administrator Updated: ${target?.name || adminId}`,
        previousValue: `${target?.roleName} / ${target?.status}`,
        newValue: `${patch.roleName || target?.roleName} / ${patch.status || target?.status}`,
        reason,
      }
    );
    setSettingsState(updated);
    setToast(`Updated administrator access for ${target?.name}.`);
  };

  const handleSaveRolePermissions = (
    roleId: AdminRoleId,
    nextPermissions: Record<string, boolean>,
    reason: string
  ) => {
    const target = settingsState.roles.find((r) => r.id === roleId);
    const nextRoles = settingsState.roles.map((r) =>
      r.id === roleId
        ? { ...r, grantedPermissions: nextPermissions, updatedAt: new Date().toISOString() }
        : r
    );
    const updated = appendAuditAndSnapshot(
      { ...settingsState, roles: nextRoles },
      {
        administrator: actorName,
        actorRole: actorRoleLabel,
        category: "roles_permissions",
        settingName: `RBAC Matrix Updated: ${target?.name || roleId}`,
        previousValue: "Previous RBAC permission matrix",
        newValue: "Updated module permissions",
        reason,
      }
    );
    setSettingsState(updated);
    setToast(`Updated permissions for role "${target?.name}".`);
  };

  const handleCreateOrCloneRole = (
    name: string,
    description: string,
    basePermissions: Record<string, boolean>,
    reason: string
  ) => {
    const cloned = createClonedRoleEntry(name, description, basePermissions);
    const updated = appendAuditAndSnapshot(
      { ...settingsState, roles: [...settingsState.roles, cloned] },
      {
        administrator: actorName,
        actorRole: actorRoleLabel,
        category: "roles_permissions",
        settingName: `Role Created: ${name}`,
        previousValue: "None",
        newValue: description,
        reason,
      }
    );
    setSettingsState(updated);
    setToast(`Created custom role "${name}".`);
  };

  const handleToggleRoleActive = (roleId: AdminRoleId, nextActive: boolean, reason: string) => {
    const target = settingsState.roles.find((r) => r.id === roleId);
    const nextRoles = settingsState.roles.map((r) =>
      r.id === roleId ? { ...r, isActive: nextActive, updatedAt: new Date().toISOString() } : r
    );
    const updated = appendAuditAndSnapshot(
      { ...settingsState, roles: nextRoles },
      {
        administrator: actorName,
        actorRole: actorRoleLabel,
        category: "roles_permissions",
        settingName: `Role Status: ${target?.name || roleId}`,
        previousValue: target?.isActive ? "Active" : "Inactive",
        newValue: nextActive ? "Active" : "Inactive",
        reason,
      }
    );
    setSettingsState(updated);
    setToast(`Role "${target?.name}" set to ${nextActive ? "Active" : "Inactive"}.`);
  };

  const handleRevokeSession = (sessionId: string, reason: string) => {
    const target = settingsState.sessions.find((s) => s.id === sessionId);
    const nextSessions = settingsState.sessions.map((s) =>
      s.id === sessionId ? { ...s, status: "revoked" as const } : s
    );
    const updated = appendAuditAndSnapshot(
      { ...settingsState, sessions: nextSessions },
      {
        administrator: actorName,
        actorRole: actorRoleLabel,
        category: "sessions_security",
        settingName: `Session Revoked: ${sessionId} (${target?.adminName})`,
        previousValue: "active",
        newValue: "revoked",
        reason,
      }
    );
    setSettingsState(updated);
    setToast(`Revoked session ${sessionId} in local demonstration log.`);
  };

  const handleRevokeAllOtherSessions = (reason: string) => {
    const nextSessions = settingsState.sessions.map((s) =>
      s.isCurrentSession ? s : { ...s, status: "revoked" as const }
    );
    const updated = appendAuditAndSnapshot(
      { ...settingsState, sessions: nextSessions },
      {
        administrator: actorName,
        actorRole: actorRoleLabel,
        category: "sessions_security",
        settingName: "Bulk Session Revocation",
        previousValue: "Multiple external sessions active",
        newValue: "All non-current sessions revoked",
        reason,
      }
    );
    setSettingsState(updated);
    setToast("All other admin sessions revoked cleanly.");
  };

  const handleSavePrivacy = (nextPrivacy: PrivacyDataProtectionConfig, reason: string) => {
    const updated = appendAuditAndSnapshot(
      { ...settingsState, privacy: nextPrivacy },
      {
        administrator: actorName,
        actorRole: actorRoleLabel,
        category: "privacy",
        settingName: "Privacy & Data Protection Defaults",
        previousValue: `Discovery Opt-In: ${settingsState.privacy.defaultDiscoveryOptIn}`,
        newValue: `Discovery Opt-In: ${nextPrivacy.defaultDiscoveryOptIn}`,
        reason,
        snapshotPayload: {
          defaultDiscoveryOptIn: nextPrivacy.defaultDiscoveryOptIn,
          defaultShowOnlineStatus: nextPrivacy.defaultShowOnlineStatus,
          defaultReadReceipts: nextPrivacy.defaultReadReceipts,
        },
      }
    );
    setSettingsState(updated);
    setToast("Privacy policy defaults saved cleanly.");
  };

  const handleSavePolicyDraft = (policyId: string, draftText: string) => {
    const nextPolicies = settingsState.policies.map((p) =>
      p.id === policyId
        ? { ...p, draftSummary: draftText, hasUnpublishedDraft: draftText !== p.publishedSummary }
        : p
    );
    setSettingsState(saveSystemSettingsState({ ...settingsState, policies: nextPolicies }));
    setToast("Saved unpublished policy draft cleanly (Live version unchanged).");
  };

  const handlePublishPolicy = (policyId: string, requiresAck: boolean, reason: string) => {
    const target = settingsState.policies.find((p) => p.id === policyId);
    if (!target) return;
    const bumpedNum = Number(target.publishedVersion.replace(/[^0-9.]/g, "")) + 0.1;
    const nextVer = `v${bumpedNum.toFixed(1)}`;
    const nextPolicies = settingsState.policies.map((p) =>
      p.id === policyId
        ? {
            ...p,
            publishedVersion: nextVer,
            publishedSummary: p.draftSummary,
            hasUnpublishedDraft: false,
            requiresUserAcknowledgement: requiresAck,
            lastPublishedAt: new Date().toISOString(),
            lastPublishedBy: actorName,
            previousVersions: [
              {
                version: target.publishedVersion,
                publishedAt: target.lastPublishedAt,
                publishedBy: target.lastPublishedBy,
                notes: reason,
              },
              ...p.previousVersions,
            ],
          }
        : p
    );
    const updated = appendAuditAndSnapshot(
      { ...settingsState, policies: nextPolicies },
      {
        administrator: actorName,
        actorRole: actorRoleLabel,
        category: "policies",
        settingName: `Policy Published: ${target.title}`,
        previousValue: target.publishedVersion,
        newValue: nextVer,
        reason,
      }
    );
    setSettingsState(updated);
    setToast(`Published policy "${target.title}" ${nextVer}.`);
  };

  const handleToggleNotifChannel = (channelId: string, enabled: boolean, reason: string) => {
    const target = settingsState.notificationChannels.find((c) => c.id === channelId);
    const nextChannels = settingsState.notificationChannels.map((c) =>
      c.id === channelId ? { ...c, enabled } : c
    );
    const updated = appendAuditAndSnapshot(
      { ...settingsState, notificationChannels: nextChannels },
      {
        administrator: actorName,
        actorRole: actorRoleLabel,
        category: "notifications",
        settingName: `Notification Channel: ${target?.channel || channelId}`,
        previousValue: target?.enabled ? "Enabled" : "Paused",
        newValue: enabled ? "Enabled" : "Paused",
        reason,
      }
    );
    setSettingsState(updated);
    setToast(`Updated ${target?.channel} notification delivery channel.`);
  };

  const handleToggleNotifCategory = (
    catId: string,
    field: "inAppEnabled" | "pushEnabled" | "emailEnabled" | "smsEnabled",
    val: boolean
  ) => {
    const nextCats = settingsState.notificationCategories.map((c) =>
      c.id === catId ? { ...c, [field]: val } : c
    );
    setSettingsState(saveSystemSettingsState({ ...settingsState, notificationCategories: nextCats }));
  };

  const handleTogglePaymentMode = (
    payId: string,
    env: "sandbox_test" | "production" | "unconfigured",
    reason: string
  ) => {
    const target = settingsState.paymentIntegrations.find((p) => p.id === payId);
    const nextPay = settingsState.paymentIntegrations.map((p) =>
      p.id === payId ? { ...p, environment: env, lastUpdatedAt: new Date().toISOString() } : p
    );
    const updated = appendAuditAndSnapshot(
      { ...settingsState, paymentIntegrations: nextPay },
      {
        administrator: actorName,
        actorRole: actorRoleLabel,
        category: "payments",
        settingName: `Payment Provider Env: ${target?.providerName}`,
        previousValue: target?.environment || "sandbox_test",
        newValue: env,
        reason,
      }
    );
    setSettingsState(updated);
    setToast(`Updated ${target?.providerName} environment flag to ${env}.`);
  };

  const handleTestIntegration = (intId: string) => {
    const target = settingsState.externalIntegrations.find((i) => i.id === intId);
    setToast(
      target?.configStatus === "not_configured"
        ? `Check Complete (${target.name}): Not Configured — backend API credentials required.`
        : `Check Complete (${target?.name}): Operating in verified local demonstration state.`
    );
  };

  const handleToggleIntegration = (intId: string, enabled: boolean, reason: string) => {
    const target = settingsState.externalIntegrations.find((i) => i.id === intId);
    const nextInt = settingsState.externalIntegrations.map((i) =>
      i.id === intId ? { ...i, enabled, lastUpdatedAt: new Date().toISOString() } : i
    );
    const updated = appendAuditAndSnapshot(
      { ...settingsState, externalIntegrations: nextInt },
      {
        administrator: actorName,
        actorRole: actorRoleLabel,
        category: "integrations",
        settingName: `Integration Flag: ${target?.name}`,
        previousValue: target?.enabled ? "Enabled" : "Disabled",
        newValue: enabled ? "Enabled" : "Disabled",
        reason,
      }
    );
    setSettingsState(updated);
    setToast(`Updated connector flag for ${target?.name}.`);
  };

  const handleSaveAppVersion = (ver: AppVersionRecord, publish: boolean, reason: string) => {
    const stamped: AppVersionRecord = {
      ...ver,
      currentVersion: publish ? ver.latestAvailableVersion : ver.currentVersion,
      publishState: publish ? "published" : "saved_draft",
      releaseDate: new Date().toISOString().slice(0, 10),
    };
    const nextVers = settingsState.appVersions.map((v) => (v.id === ver.id ? stamped : v));
    const updated = appendAuditAndSnapshot(
      { ...settingsState, appVersions: nextVers },
      {
        administrator: actorName,
        actorRole: actorRoleLabel,
        category: "app_versions",
        settingName: `App Version (${ver.platform})`,
        previousValue: `v${ver.currentVersion}`,
        newValue: `${publish ? "Published" : "Draft"} v${stamped.latestAvailableVersion} (min v${stamped.minimumSupportedVersion})`,
        reason,
      }
    );
    setSettingsState(updated);
    setToast(
      publish
        ? `Published ${ver.platform} version policy (v${stamped.latestAvailableVersion}).`
        : `Saved ${ver.platform} version release draft.`
    );
  };

  const handleSetMaintenanceMode = (
    nextStatus: SystemSettingsRootState["maintenance"]["status"],
    message: string,
    expectedEndAt: string | null,
    allowAdminBypass: boolean,
    reason: string
  ) => {
    const updated = appendAuditAndSnapshot(
      {
        ...settingsState,
        general: { ...settingsState.general, platformStatus: nextStatus },
        maintenance: {
          ...settingsState.maintenance,
          status: nextStatus,
          maintenanceMessage: message,
          scheduledStartAt: nextStatus === "maintenance_mode" ? new Date().toISOString() : null,
          expectedEndAt,
          allowAdminAccessDuringMaintenance: allowAdminBypass,
          activatedBy: nextStatus === "maintenance_mode" ? actorName : null,
        },
      },
      {
        administrator: actorName,
        actorRole: actorRoleLabel,
        category: "maintenance_ops",
        settingName: "Maintenance Mode Transition",
        previousValue: settingsState.maintenance.status,
        newValue: nextStatus,
        reason,
      }
    );
    setSettingsState(updated);
    setToast(
      nextStatus === "maintenance_mode"
        ? "Demonstration Maintenance Mode enabled (visual interface banner only)."
        : "Platform status restored to Operational."
    );
  };

  const handleUpdateAlert = (
    alertId: string,
    status: SystemAlertRecord["status"],
    note?: string
  ) => {
    const nextAlerts = settingsState.alerts.map((a) =>
      a.id === alertId
        ? {
            ...a,
            status,
            internalNotes:
              note && note.trim() ? [...a.internalNotes, note.trim()] : a.internalNotes,
          }
        : a
    );
    setSettingsState(saveSystemSettingsState({ ...settingsState, alerts: nextAlerts }));
    setToast(`Updated alert ${alertId} status to "${status}".`);
  };

  const handleRollbackSnapshot = (snapshot: ConfigVersionSnapshot, reason: string) => {
    const rolled = applyRollbackSnapshotToState(
      settingsState,
      snapshot,
      actorName,
      actorRoleLabel,
      reason
    );
    setSettingsState(rolled);
    setToast(`Restored configuration snapshot ${snapshot.versionId} and logged immutable audit entry.`);
  };

  const handleResolveTwoPersonApproval = (approvalId: string, approved: boolean) => {
    const target = settingsState.pendingApprovals.find((p) => p.id === approvalId);
    const nextApprovals = settingsState.pendingApprovals.map((p) =>
      p.id === approvalId
        ? { ...p, status: approved ? ("approved" as const) : ("rejected" as const) }
        : p
    );
    const updated = appendAuditAndSnapshot(
      { ...settingsState, pendingApprovals: nextApprovals },
      {
        administrator: actorName,
        actorRole: actorRoleLabel,
        category: target?.category || "audit_history",
        settingName: `Two-Person Review: ${target?.actionTitle || approvalId}`,
        previousValue: "pending_second_approver",
        newValue: approved ? "approved" : "rejected",
        reason: approved ? "Peer approver signed off" : "Rejected by second Super Administrator",
        approvalStatus: approved ? "approved" : "applied",
      }
    );
    setSettingsState(updated);
    setToast(`${approved ? "Approved" : "Rejected"} staged configuration proposal ${approvalId}.`);
  };

  const activeMeta =
    SETTINGS_SECTIONS_META.find((m) => m.key === activeSection) || SETTINGS_SECTIONS_META[0];

  const renderSectionNavList = (onPick?: () => void) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {GROUPS.map((grp) => (
        <div key={grp}>
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--text-muted)",
              padding: "0 8px 6px",
            }}
          >
            {grp}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {SETTINGS_SECTIONS_META.filter((s) => s.group === grp).map((sec) => {
              const active = sec.key === activeSection;
              return (
                <button
                  key={sec.key}
                  type="button"
                  onClick={() => {
                    setActiveSection(sec.key);
                    if (onPick) onPick();
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "none",
                    background: active ? "var(--bg-active)" : "transparent",
                    color: active ? "var(--primary)" : "var(--text-secondary)",
                    fontSize: 12.5,
                    fontWeight: active ? 700 : 600,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.15s ease",
                  }}
                >
                  <span style={{ flexShrink: 0 }}>{SECTION_ICONS[sec.key]}</span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {sec.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="animate-fade-in"
      style={{ display: "flex", flexDirection: "column", gap: 16, paddingBottom: 32 }}
    >
      {/* Top Page Title, RBAC Role Switcher & Refresh */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 23, fontWeight: 800, color: "var(--text-main)" }}>
            System Settings & Security Control Centre
          </h1>
          <p style={{ margin: "3px 0 0", fontSize: 13, color: "var(--text-secondary)" }}>
            19 enterprise configuration modules governing NobleBond platform defaults, RBAC security,
            localization, financial boundaries, and audit history.
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 10px",
              borderRadius: 10,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              fontSize: 12,
            }}
          >
            <strong style={{ color: "var(--text-secondary)" }}>Role View:</strong>
            <select
              aria-label="Preview System Settings RBAC Role"
              value={viewerRoleId}
              onChange={(e) => {
                setViewerRoleId(e.target.value as AdminRoleId);
                setToast("Updated live RBAC permission simulation role.");
              }}
              style={{
                border: "none",
                background: "transparent",
                color: "var(--text-main)",
                fontWeight: 700,
                fontSize: 12,
                outline: "none",
              }}
            >
              {settingsState.roles.map((r) => (
                <option key={r.id} value={r.id} style={{ background: "var(--bg-surface)" }}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 13px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--bg-card)",
              color: "var(--text-main)",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <RefreshCw
              size={13}
              style={{ animation: isRefreshing ? "spin 0.8s linear infinite" : undefined }}
            />
            <span>Refresh</span>
          </button>

          {isCompactViewport && (
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid var(--primary)",
                background: "var(--bg-active)",
                color: "var(--primary)",
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <Menu size={14} />
              <span>Sections (19)</span>
            </button>
          )}
        </div>
      </div>

      {/* Network Offline / Maintenance Demo / Sync Error / Action Toast Ribbons */}
      {!isOnline && (
        <div
          role="status"
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            background: "var(--status-warning-bg)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: 9,
            fontSize: 12.5,
          }}
        >
          <WifiOff size={16} style={{ color: "var(--status-warning)" }} />
          <span>
            <strong>Offline Browser Detected:</strong> Preserving local configuration snapshot until
            network connectivity resumes.
          </span>
        </div>
      )}

      {settingsState.maintenance.status === "maintenance_mode" && (
        <div
          role="status"
          style={{
            padding: "11px 14px",
            borderRadius: 12,
            background: "var(--status-error-bg)",
            border: "1px solid var(--status-error)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
            fontSize: 12.5,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={16} style={{ color: "var(--status-error)" }} />
            <span>
              <strong>Demonstration Maintenance Mode Active:</strong> "{settingsState.maintenance.maintenanceMessage}"
              (Local visual simulation only — live production API unaffected.)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveSection("maintenance_ops")}
            style={{
              padding: "4px 10px",
              borderRadius: 7,
              border: "none",
              background: "var(--status-error)",
              color: "#FFFFFF",
              fontSize: 11.5,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Manage Maintenance
          </button>
        </div>
      )}

      {syncError && (
        <div
          role="alert"
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            background: "var(--status-error-bg)",
            fontSize: 12.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{syncError}</span>
          <button
            type="button"
            onClick={handleRefresh}
            style={{
              padding: "4px 10px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--bg-card)",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {toast && (
        <div
          role="status"
          style={{
            padding: "9px 14px",
            borderRadius: 10,
            background: "var(--status-info-bg)",
            border: "1px solid var(--border-light)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 12.5,
            color: "var(--text-main)",
          }}
        >
          <span>{toast}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            style={{
              border: "none",
              background: "transparent",
              color: "var(--primary)",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Global Settings Search & Quick Filters */}
      <SettingsSearchBar
        state={settingsState}
        quickFilter={quickFilter}
        onChangeQuickFilter={setQuickFilter}
        onJumpToSection={setActiveSection}
      />

      {/* Main Split Workspace: Left 19-Section Sidebar (Desktop) + Active Panel */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isCompactViewport ? "1fr" : "270px 1fr",
          gap: 18,
          alignItems: "start",
        }}
      >
        {!isCompactViewport && (
          <nav
            aria-label="System Settings Sections Navigation"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: 12,
              boxShadow: "var(--shadow-sm)",
              position: "sticky",
              top: 86,
              maxHeight: "calc(100vh - 110px)",
              overflowY: "auto",
            }}
          >
            {renderSectionNavList()}
          </nav>
        )}

        {/* Active Configuration Content Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
          {/* Breadcrumbs + Section Banner */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: "12px 16px",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11.5,
                  color: "var(--text-muted)",
                  marginBottom: 2,
                }}
              >
                <span>System Settings</span>
                <ChevronRight size={12} />
                <span>{activeMeta.group}</span>
                <ChevronRight size={12} />
                <strong style={{ color: "var(--primary)" }}>{activeMeta.shortLabel}</strong>
              </div>
              <div style={{ fontSize: 15.5, fontWeight: 800, color: "var(--text-main)" }}>
                {activeMeta.label}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                {activeMeta.description}
              </div>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                color: "var(--text-muted)",
                background: "var(--bg-surface-elevated)",
                padding: "4px 9px",
                borderRadius: 999,
              }}
            >
              <Clock size={11} />
              <span>Synced {formatSettingsTimestamp(settingsState.lastSyncedAt)}</span>
            </div>
          </div>

          {isRefreshing ? (
            <SettingsSkeletonLoader />
          ) : (
            <>
              {(activeSection === "general" ||
                activeSection === "branding" ||
                activeSection === "theme") && (
                <GeneralBrandingThemeSection
                  key={`${activeSection}-${settingsState.lastSyncedAt}`}
                  state={settingsState}
                  mode={activeSection}
                  canEdit={
                    activeSection === "general"
                      ? hasPerm("set.general")
                      : activeSection === "theme"
                        ? hasPerm("set.theme")
                        : hasPerm("set.general")
                  }
                  onSaveGeneral={handleSaveGeneral}
                  onSaveBrandingAsset={handleSaveBrandingAsset}
                  onSaveThemeConfig={handleSaveThemeConfig}
                  onRequestConfirm={handleRequestConfirm}
                />
              )}

              {(activeSection === "regional" || activeSection === "currency") && (
                <RegionalAndCurrencySection
                  state={settingsState}
                  mode={activeSection}
                  canEditRegional={hasPerm("set.regional")}
                  canEditCurrency={hasPerm("set.currency")}
                  onUpdateCountry={handleUpdateCountry}
                  onToggleLanguage={handleToggleLanguage}
                  onToggleCurrency={handleToggleCurrency}
                  onSetDefaultCurrency={handleSetDefaultCurrency}
                  onRequestConfirm={handleRequestConfirm}
                />
              )}

              {(activeSection === "features" || activeSection === "authentication") && (
                <FeaturesAndAuthSecuritySection
                  key={`${activeSection}-${settingsState.lastSyncedAt}`}
                  state={settingsState}
                  mode={activeSection}
                  canEditFeatures={hasPerm("set.general")}
                  canEditSecurity={hasPerm("set.security")}
                  onToggleFeature={handleToggleFeature}
                  onSaveAuthSecurity={handleSaveAuthSecurity}
                  onRequestConfirm={handleRequestConfirm}
                />
              )}

              {(activeSection === "administrators" ||
                activeSection === "roles_permissions" ||
                activeSection === "sessions_security") && (
                <AdminRbacAndSessionsSection
                  state={settingsState}
                  activeViewerRoleId={viewerRoleId}
                  mode={activeSection}
                  canManageAdmins={hasPerm("set.admins")}
                  canManageRoles={hasPerm("set.roles")}
                  canRevokeSessions={hasPerm("set.security") || hasPerm("set.admins")}
                  onInviteDemoAdmin={handleInviteDemoAdmin}
                  onUpdateAdmin={handleUpdateAdmin}
                  onSaveRolePermissions={handleSaveRolePermissions}
                  onCreateOrCloneRole={handleCreateOrCloneRole}
                  onToggleRoleActive={handleToggleRoleActive}
                  onRevokeSession={handleRevokeSession}
                  onRevokeAllOtherSessions={handleRevokeAllOtherSessions}
                  onRequestConfirm={handleRequestConfirm}
                />
              )}

              {(activeSection === "privacy" ||
                activeSection === "policies" ||
                activeSection === "notifications") && (
                <PrivacyPoliciesNotificationsSection
                  key={`${activeSection}-${settingsState.lastSyncedAt}`}
                  state={settingsState}
                  mode={activeSection}
                  canEditPrivacy={hasPerm("set.security")}
                  canEditPolicies={hasPerm("set.general")}
                  canEditNotifications={hasPerm("notif.manage")}
                  onSavePrivacy={handleSavePrivacy}
                  onSavePolicyDraft={handleSavePolicyDraft}
                  onPublishPolicy={handlePublishPolicy}
                  onToggleNotifChannel={handleToggleNotifChannel}
                  onToggleNotifCategory={handleToggleNotifCategory}
                  onRequestConfirm={handleRequestConfirm}
                />
              )}

              {(activeSection === "payments" ||
                activeSection === "integrations" ||
                activeSection === "app_versions" ||
                activeSection === "maintenance_ops" ||
                activeSection === "monitoring_alerts") && (
                <IntegrationsVersionsOpsMonitoringSection
                  key={`${activeSection}-${settingsState.lastSyncedAt}`}
                  state={settingsState}
                  mode={activeSection}
                  canManagePayments={hasPerm("set.integrations") && hasPerm("set.currency")}
                  canManageIntegrations={hasPerm("set.integrations")}
                  canManageMaintenance={hasPerm("set.integrations") || hasPerm("set.general")}
                  onTogglePaymentMode={handleTogglePaymentMode}
                  onTestIntegration={handleTestIntegration}
                  onToggleIntegration={handleToggleIntegration}
                  onSaveAppVersion={handleSaveAppVersion}
                  onSetMaintenanceMode={handleSetMaintenanceMode}
                  onUpdateAlert={handleUpdateAlert}
                  onRequestConfirm={handleRequestConfirm}
                />
              )}

              {activeSection === "audit_history" && (
                <AuditAndRollbackSection
                  state={settingsState}
                  canRollback={hasPerm("set.roles")}
                  onRollbackSnapshot={handleRollbackSnapshot}
                  onResolveTwoPersonApproval={handleResolveTwoPersonApproval}
                  onRequestConfirm={handleRequestConfirm}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile / Tablet Slide-Out Section Navigation Drawer */}
      {mobileNavOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="System Settings Sections Drawer"
          onClick={() => setMobileNavOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 950,
            background: "rgba(15, 10, 20, 0.5)",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(300px, 88vw)",
              height: "100%",
              background: "var(--bg-surface)",
              borderRight: "1px solid var(--border)",
              padding: 16,
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: 12,
                marginBottom: 12,
                borderBottom: "1px solid var(--border-light)",
              }}
            >
              <strong style={{ fontSize: 15, color: "var(--text-main)" }}>Settings Sections (19)</strong>
              <button
                type="button"
                aria-label="Close sections drawer"
                onClick={() => setMobileNavOpen(false)}
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--bg-surface-elevated)",
                  borderRadius: 8,
                  padding: 5,
                  color: "var(--text-main)",
                  cursor: "pointer",
                }}
              >
                <X size={15} />
              </button>
            </div>
            {renderSectionNavList(() => setMobileNavOpen(false))}
          </div>
        </div>
      )}

      {/* Central Enterprise Confirmation Modal */}
      <SettingsConfirmModal
        open={Boolean(confirmModal)}
        title={confirmModal?.title || ""}
        description={confirmModal?.description || ""}
        impactWarning={confirmModal?.impactWarning}
        confirmLabel={confirmModal?.confirmLabel}
        danger={confirmModal?.danger}
        requireReason={confirmModal?.requireReason ?? true}
        requireReauth={confirmModal?.requireReauth}
        allowTwoPersonStage={confirmModal?.allowTwoPersonStage}
        onConfirm={(payload) => confirmModal?.onConfirm(payload)}
        onCancel={() => setConfirmModal(null)}
      />
    </div>
  );
};

export default SystemSettingsPage;
