import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Users,
  UserPlus,
  UserCheck,
  Heart,
  MessageCircle,
  Radio,
  Coins,
  Award,
  CreditCard,
  Share2,
  LifeBuoy,
  ShieldAlert,
  Bell,
  Globe,
  Repeat,
  Layers,
  Server,
  FileSpreadsheet,
  Shield,
  WifiOff,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import {
  ANALYTICS_ROLE_PERMISSIONS,
  buildPlatformAnalyticsSnapshot,
  exportAnalyticsReportCsv,
  type PlatformAnalyticsSnapshot,
} from "../data/platformAnalyticsDataService";
import type {
  AnalyticsGlobalFilterState,
  AnalyticsRoleKey,
  AnalyticsTabKey,
  DrilldownPayload,
} from "../types/analyticsManagement.types";
import { AnalyticsFilterBar } from "../components/analytics/AnalyticsFilterBar";
import { AnalyticsSkeletonLoader } from "../components/analytics/AnalyticsSkeletonLoader";
import { AnalyticsDrilldownDrawer } from "../components/analytics/AnalyticsDrilldownDrawer";
import { ExecutiveOverviewSection } from "../components/analytics/sections/ExecutiveOverviewSection";
import { UserAndAcquisitionSection } from "../components/analytics/sections/UserAndAcquisitionSection";
import { DatingEngagementAnalyticsSection } from "../components/analytics/sections/DatingEngagementAnalyticsSection";
import { LiveAndVirtualEconomySection } from "../components/analytics/sections/LiveAndVirtualEconomySection";
import { RevenueReferralSupportSafetySection } from "../components/analytics/sections/RevenueReferralSupportSafetySection";
import { GeographicRetentionProductPlatformSection } from "../components/analytics/sections/GeographicRetentionProductPlatformSection";
import { CustomReportsSection } from "../components/analytics/sections/CustomReportsSection";
import {
  formatCoinsQty,
  formatMoneyUsd,
  formatPointsQty,
} from "../components/analytics/analyticsUiUtils";

const DEFAULT_FILTERS: AnalyticsGlobalFilterState = {
  dateRange: "30d",
  comparisonPeriod: "prev_period",
  granularity: "weekly",
  country: "all",
  platform: "all",
  userStatus: "all",
  subscriptionPlan: "all",
  referralSource: "all",
  liveCategory: "all",
  transactionCategory: "all",
  userSegment: "all",
};

interface TabDef {
  key: AnalyticsTabKey;
  label: string;
  icon: React.ReactNode;
}

const ANALYTICS_TABS: TabDef[] = [
  { key: "executive_overview", label: "Executive Overview", icon: <BarChart3 size={14} /> },
  { key: "user_analytics", label: "User Growth", icon: <Users size={14} /> },
  { key: "acquisition_analytics", label: "Acquisition", icon: <UserPlus size={14} /> },
  { key: "profile_analytics", label: "Profiles", icon: <UserCheck size={14} /> },
  { key: "likes_matches_analytics", label: "Likes & Matches", icon: <Heart size={14} /> },
  { key: "chat_engagement_analytics", label: "Chats & Calls", icon: <MessageCircle size={14} /> },
  { key: "live_streaming_analytics", label: "Live Streaming", icon: <Radio size={14} /> },
  { key: "gift_coins_analytics", label: "Gift Coins", icon: <Coins size={14} /> },
  { key: "connection_points_analytics", label: "Connection Points", icon: <Award size={14} /> },
  { key: "premium_revenue_analytics", label: "Premium Revenue", icon: <CreditCard size={14} /> },
  { key: "referral_analytics", label: "Referrals", icon: <Share2 size={14} /> },
  { key: "support_analytics", label: "Support", icon: <LifeBuoy size={14} /> },
  { key: "moderation_analytics", label: "Safety & Moderation", icon: <ShieldAlert size={14} /> },
  { key: "notifications_analytics", label: "Notifications", icon: <Bell size={14} /> },
  { key: "geographic_analytics", label: "Geography", icon: <Globe size={14} /> },
  { key: "retention_cohort_analytics", label: "Retention & Cohorts", icon: <Repeat size={14} /> },
  { key: "feature_usage_analytics", label: "Product Features", icon: <Layers size={14} /> },
  { key: "platform_reliability_analytics", label: "Platform Health", icon: <Server size={14} /> },
  { key: "custom_reports", label: "Custom Reports", icon: <FileSpreadsheet size={14} /> },
];

export const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AnalyticsTabKey>("executive_overview");
  const [roleKey, setRoleKey] = useState<AnalyticsRoleKey>("super_admin");
  const [filters, setFilters] = useState<AnalyticsGlobalFilterState>(DEFAULT_FILTERS);
  const [snapshot, setSnapshot] = useState<PlatformAnalyticsSnapshot>(() =>
    buildPlatformAnalyticsSnapshot(DEFAULT_FILTERS)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [actionToast, setActionToast] = useState<string | null>(null);
  const [drilldown, setDrilldown] = useState<DrilldownPayload | null>(null);
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  const permissions = ANALYTICS_ROLE_PERMISSIONS[roleKey];

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const recomputeSnapshot = (nextFilters: AnalyticsGlobalFilterState, withSkeleton = false) => {
    setSyncError(null);
    if (withSkeleton) {
      setIsLoading(true);
      window.setTimeout(() => {
        try {
          const fresh = buildPlatformAnalyticsSnapshot(nextFilters);
          setSnapshot(fresh);
        } catch (err) {
          setSyncError(
            err instanceof Error ? err.message : "Failed to compute cross-module analytics."
          );
        } finally {
          setIsLoading(false);
        }
      }, 360);
    } else {
      try {
        const fresh = buildPlatformAnalyticsSnapshot(nextFilters);
        setSnapshot(fresh);
      } catch (err) {
        setSyncError(
          err instanceof Error ? err.message : "Failed to compute cross-module analytics."
        );
      }
    }
  };

  const handleFiltersChange = (next: AnalyticsGlobalFilterState) => {
    setFilters(next);
    recomputeSnapshot(next, false);
  };

  const handleClearDimensionalFilters = () => {
    const cleared: AnalyticsGlobalFilterState = {
      ...filters,
      country: "all",
      platform: "all",
      userStatus: "all",
      subscriptionPlan: "all",
      referralSource: "all",
      liveCategory: "all",
      transactionCategory: "all",
      userSegment: "all",
    };
    setFilters(cleared);
    recomputeSnapshot(cleared, false);
    setActionToast("Cleared all dimensional filters across BI sections.");
  };

  const handleResetDefault = () => {
    setFilters(DEFAULT_FILTERS);
    recomputeSnapshot(DEFAULT_FILTERS, true);
    setActionToast("Reset date scope, comparison period, and filters to default 30d Executive view.");
  };

  const handleExportCurrent = () => {
    if (!permissions.canExportAnalytics) return;
    const rows: Array<{ metric: string; value: string; unit: string; sourceModule: string }> = [
      {
        metric: "Total Scoped Users",
        value: `${snapshot.users.length}`,
        unit: "Count",
        sourceModule: "User Management",
      },
      {
        metric: "New Registrations",
        value: `${snapshot.newUsersCurrent.length}`,
        unit: "Count",
        sourceModule: "User Management",
      },
      {
        metric: "Daily Active Users (DAU)",
        value: `${snapshot.dauCount}`,
        unit: "Count",
        sourceModule: "User Management",
      },
      {
        metric: "Complete Profiles (>=80%)",
        value: `${snapshot.completeProfiles.length}`,
        unit: "Count",
        sourceModule: "Profile Management",
      },
      {
        metric: "1-Way Likes Sent",
        value: `${snapshot.likesCurrent.length}`,
        unit: "Count",
        sourceModule: "Likes & Matches",
      },
      {
        metric: "Confirmed Mutual Matches",
        value: `${snapshot.matchesCurrent.length}`,
        unit: "Count",
        sourceModule: "Likes & Matches",
      },
      {
        metric: "Live Sessions Hosted",
        value: `${snapshot.liveSessions.length}`,
        unit: "Count",
        sourceModule: "Live Management",
      },
      {
        metric: "Virtual Gift Coins Sent",
        value: formatCoinsQty(snapshot.totalCoinsSpentOnGifts),
        unit: "Coins (Virtual)",
        sourceModule: "Live + Wallet",
      },
      {
        metric: "Connection Points Issued",
        value: formatPointsQty(snapshot.cpIssuedPoints),
        unit: "Points (Non-Cash)",
        sourceModule: "Referrals + Wallet",
      },
    ];

    if (permissions.canViewRevenueAnalytics) {
      rows.push(
        {
          metric: "Net Subscription Revenue",
          value: formatMoneyUsd(snapshot.netSubRevenueUsd),
          unit: "USD (Fiat)",
          sourceModule: "Subscriptions",
        },
        {
          metric: "Active Subscription MRR",
          value: formatMoneyUsd(snapshot.mrrUsd),
          unit: "USD (Fiat)",
          sourceModule: "Subscriptions",
        },
        {
          metric: "Gift Coin IAP Volume",
          value: formatMoneyUsd(snapshot.coinPurchaseVolumeUsd),
          unit: "USD (Fiat)",
          sourceModule: "Wallet Management",
        }
      );
    }

    const activeLabel = ANALYTICS_TABS.find((t) => t.key === activeTab)?.label || "Platform";
    exportAnalyticsReportCsv(
      `NobleBond Analytics - ${activeLabel}`,
      snapshot.currentWindow.label,
      rows
    );
    setActionToast(`Exported CSV snapshot for "${activeLabel}" (${snapshot.currentWindow.label}).`);
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 18,
        paddingBottom: 28,
      }}
    >
      {/* Page Header & RBAC Role Permission Preview Switcher */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 14,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "var(--text-main)" }}>
            Platform Business Intelligence & Analytics
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13.5, color: "var(--text-secondary)" }}>
            Unified cross-module telemetry connecting Users, Profiles, Matches, Chat, Live,
            Subscriptions, Wallet, Referrals, Moderation, Support & Growth Cohorts.
          </p>
        </div>

        {/* 9-Permission RBAC Preview Switcher */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "8px 12px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 8,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <Shield size={15} style={{ color: "var(--primary)" }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)" }}>
            RBAC Preview:
          </span>
          <select
            aria-label="Analytics RBAC Role Preview"
            value={roleKey}
            onChange={(e) => {
              const nextRole = e.target.value as AnalyticsRoleKey;
              setRoleKey(nextRole);
              setActionToast(
                `Switched Analytics permission preview to ${ANALYTICS_ROLE_PERMISSIONS[nextRole].roleLabel}.`
              );
            }}
            style={{
              background: "var(--bg-surface-elevated)",
              color: "var(--text-main)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "5px 9px",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <option value="super_admin">Super Admin / Founder (All 9 Perms)</option>
            <option value="finance_revenue_lead">Finance & Revenue Lead</option>
            <option value="growth_product_lead">Growth & Product Lead</option>
            <option value="safety_support_lead">Safety & Support Operations Lead</option>
          </select>
        </div>
      </div>

      {/* Browser Network Offline / Fault Recovery Ribbons */}
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
            gap: 10,
            color: "var(--text-main)",
            fontSize: 12.5,
          }}
        >
          <WifiOff size={16} style={{ color: "var(--status-warning)", flexShrink: 0 }} />
          <span>
            <strong>Offline Mode Detected:</strong> Your browser is currently offline. Analytics
            charts and KPIs are rendered from the last verified local workspace store.
          </span>
        </div>
      )}

      {syncError && (
        <div
          role="alert"
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            background: "var(--status-error-bg)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            color: "var(--text-main)",
            fontSize: 12.5,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={16} style={{ color: "var(--status-error)" }} />
            <span>
              <strong>Sync Warning:</strong> {syncError} Preserved previous valid snapshot.
            </span>
          </div>
          <button
            type="button"
            onClick={() => recomputeSnapshot(filters, true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 10px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--bg-surface)",
              color: "var(--text-main)",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <RefreshCw size={12} />
            <span>Retry Sync</span>
          </button>
        </div>
      )}

      {actionToast && (
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
          <span>{actionToast}</span>
          <button
            type="button"
            onClick={() => setActionToast(null)}
            style={{
              border: "none",
              background: "transparent",
              color: "var(--primary)",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Global Controls & Dimensional Filter Drawer */}
      <AnalyticsFilterBar
        filters={filters}
        availableCountries={snapshot.availableCountries}
        activeWindowLabel={snapshot.currentWindow.label}
        comparisonWindowLabel={snapshot.comparisonWindow?.label || null}
        lastRefreshedIso={snapshot.generatedAtIso}
        isRefreshing={isLoading}
        canExport={permissions.canExportAnalytics}
        onChangeFilters={handleFiltersChange}
        onClearAllFilters={handleClearDimensionalFilters}
        onResetDefault={handleResetDefault}
        onRefresh={() => recomputeSnapshot(filters, true)}
        onExportCurrentReport={handleExportCurrent}
      />

      {/* 19-Tab Structured BI Section Navigation */}
      <div
        role="tablist"
        aria-label="Analytics Intelligence Sections"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 7,
          padding: 10,
          borderRadius: 16,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {ANALYTICS_TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 11px",
                borderRadius: 10,
                border: active ? "1px solid var(--primary)" : "1px solid transparent",
                background: active ? "var(--primary)" : "var(--bg-surface-elevated)",
                color: active ? "var(--primary-text)" : "var(--text-secondary)",
                fontSize: 12,
                fontWeight: active ? 700 : 600,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Body (with Realistic Shimmer Skeleton during Sync Refresh) */}
      {isLoading ? (
        <AnalyticsSkeletonLoader />
      ) : (
        <>
          {activeTab === "executive_overview" && (
            <ExecutiveOverviewSection
              snapshot={snapshot}
              permissions={permissions}
              onSelectTab={setActiveTab}
              onDrilldown={setDrilldown}
            />
          )}

          {(activeTab === "user_analytics" || activeTab === "acquisition_analytics") && (
            <UserAndAcquisitionSection
              snapshot={snapshot}
              mode={activeTab}
              onDrilldown={setDrilldown}
            />
          )}

          {(activeTab === "profile_analytics" ||
            activeTab === "likes_matches_analytics" ||
            activeTab === "chat_engagement_analytics") && (
            <DatingEngagementAnalyticsSection
              snapshot={snapshot}
              mode={activeTab}
              onDrilldown={setDrilldown}
            />
          )}

          {(activeTab === "live_streaming_analytics" ||
            activeTab === "gift_coins_analytics" ||
            activeTab === "connection_points_analytics") && (
            <LiveAndVirtualEconomySection
              snapshot={snapshot}
              permissions={permissions}
              mode={activeTab}
              onDrilldown={setDrilldown}
            />
          )}

          {(activeTab === "premium_revenue_analytics" ||
            activeTab === "referral_analytics" ||
            activeTab === "support_analytics" ||
            activeTab === "moderation_analytics" ||
            activeTab === "notifications_analytics") && (
            <RevenueReferralSupportSafetySection
              snapshot={snapshot}
              permissions={permissions}
              mode={activeTab}
              onDrilldown={setDrilldown}
            />
          )}

          {(activeTab === "geographic_analytics" ||
            activeTab === "retention_cohort_analytics" ||
            activeTab === "feature_usage_analytics" ||
            activeTab === "platform_reliability_analytics") && (
            <GeographicRetentionProductPlatformSection
              snapshot={snapshot}
              permissions={permissions}
              mode={activeTab}
              onDrilldown={setDrilldown}
            />
          )}

          {activeTab === "custom_reports" && (
            <CustomReportsSection
              snapshot={snapshot}
              filters={filters}
              permissions={permissions}
            />
          )}
        </>
      )}

      {/* Slide-Over Cross-Module Drilldown Drawer */}
      <AnalyticsDrilldownDrawer payload={drilldown} onClose={() => setDrilldown(null)} />
    </div>
  );
};

export default AnalyticsPage;
