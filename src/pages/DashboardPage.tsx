import React, { useState, useEffect, useCallback } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import type { DateRangePeriod } from "../types/dashboard.types";
import { getDashboardDataForPeriod } from "../data/dashboardDataService";

// Dashboard Subcomponents
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { MainKpiGrid } from "../components/dashboard/MainKpiGrid";
import { UserGrowthSection } from "../components/dashboard/UserGrowthSection";
import { UserEngagementSection } from "../components/dashboard/UserEngagementSection";
import { RevenuePerformanceSection } from "../components/dashboard/RevenuePerformanceSection";
import { LiveStreamingSection } from "../components/dashboard/LiveStreamingSection";
import { CommunityActivitySection } from "../components/dashboard/CommunityActivitySection";
import { SupportAndReferralSection } from "../components/dashboard/SupportAndReferralSection";
import { AdminAuditAndQuickActions } from "../components/dashboard/AdminAuditAndQuickActions";
import { FullDashboardSkeleton } from "../components/dashboard/DashboardSkeleton";

export const DashboardPage: React.FC = () => {
  const [period, setPeriod] = useState<DateRangePeriod>("30d");
  const [customRange, setCustomRange] = useState<{ start?: string; end?: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Compute snapshot data from service
  const data = getDashboardDataForPeriod(period, customRange.start, customRange.end);

  // Initial load simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // Handle period change with subtle loading feedback
  const handleSelectPeriod = useCallback((newPeriod: DateRangePeriod, start?: string, end?: string) => {
    setIsRefreshing(true);
    setPeriod(newPeriod);
    if (start && end) {
      setCustomRange({ start, end });
    }
    setTimeout(() => {
      setIsRefreshing(false);
    }, 350);
  }, []);

  // Handle manual dashboard refresh
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  }, []);

  // Error retry handler
  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Error State Display
  if (hasError) {
    return (
      <div
        className="animate-fade-in"
        style={{
          padding: "48px 24px",
          textAlign: "center",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "14px",
          maxWidth: "500px",
          margin: "40px auto",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: "var(--status-error-bg)",
            color: "var(--status-error)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AlertCircle size={24} />
        </div>
        <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)" }}>
          Failed to load dashboard telemetry
        </h3>
        <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
          An error occurred while connecting to the telemetry service. Please retry.
        </p>
        <button
          type="button"
          onClick={handleRetry}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "var(--primary)",
            color: "#FFFFFF",
            fontSize: "13.5px",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 14px var(--primary-glow)",
          }}
        >
          <RotateCcw size={15} />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  // Skeleton Loading Display
  if (isLoading) {
    return <FullDashboardSkeleton />;
  }

  return (
    <div
      className="animate-fade-in"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* 1. Header (Welcome, Period Indicator, Date Range Selector, Refresh) */}
      <DashboardHeader
        currentPeriod={period}
        periodLabel={data.periodLabel}
        isRefreshing={isRefreshing}
        onSelectPeriod={handleSelectPeriod}
        onRefresh={handleRefresh}
      />

      {/* 2. 10 Primary KPI Cards Grid */}
      <MainKpiGrid data={data} />

      {/* 3. User Registration Velocity (SVG Chart) + Registration Breakdown */}
      <UserGrowthSection
        growthData={data.growthChartData}
        totalUsers={data.totalUsers.value}
        newRegistrations={data.newRegistrations.value}
      />

      {/* 4. User Engagement (DAU/WAU/MAU + 9 Product Module Activity Breakdown) */}
      <UserEngagementSection engagementData={data.engagementChartData} />

      {/* 5. Revenue Inflows (Gross/Net) vs Virtual Currencies Liabilities */}
      <RevenuePerformanceSection data={data} />

      {/* 6. Live Streaming Operations (Active Rooms, Hosts, Viewers, Telemetry) */}
      <LiveStreamingSection
        streams={data.activeStreams}
        totalActive={data.activeLiveSessions.value}
        totalViewers={data.activeLiveSessions.viewers}
      />

      {/* 7. Community Activity (Recently Joined, Matches, Moderation Action Centre) */}
      <CommunityActivitySection
        recentUsers={data.recentUsers}
        recentMatches={data.recentMatches}
        moderationItems={data.moderationQueue}
      />

      {/* 8. Customer Support SLA + Invite & Earn Referral Performance */}
      <SupportAndReferralSection data={data} />

      {/* 9. Administrative Audit Trail + Core Quick Action Shortcuts */}
      <AdminAuditAndQuickActions auditLogs={data.auditLogs} />
    </div>
  );
};
