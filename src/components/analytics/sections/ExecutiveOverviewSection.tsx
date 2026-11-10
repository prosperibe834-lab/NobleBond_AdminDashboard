import React, { useState } from "react";
import {
  Users,
  Heart,
  Radio,
  DollarSign,
  ShieldAlert,
  TrendingUp,
  Coins,
  Award,
  Activity,
  Lightbulb,
  ArrowUpRight,
  Lock,
  Clock,
} from "lucide-react";
import type { PlatformAnalyticsSnapshot } from "../../../data/platformAnalyticsDataService";
import type {
  AnalyticsRolePermissions,
  AnalyticsTabKey,
  DrilldownPayload,
} from "../../../types/analyticsManagement.types";
import {
  computePercentChange,
  formatCoinsQty,
  formatMoneyUsd,
  formatPercent,
  formatPointsQty,
  formatShortDate,
} from "../analyticsUiUtils";
import { AnalyticsMetricTooltip, MetricDeltaPill } from "../AnalyticsMetricTooltip";

interface ExecutiveOverviewSectionProps {
  snapshot: PlatformAnalyticsSnapshot;
  permissions: AnalyticsRolePermissions;
  onSelectTab: (tab: AnalyticsTabKey) => void;
  onDrilldown: (payload: DrilldownPayload) => void;
}

type TrendMetricKey =
  | "registrations"
  | "activeUsers"
  | "matches"
  | "subRevenueUsd"
  | "coinPurchaseUsd"
  | "reports";

const cardStyle: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: 16,
  padding: 18,
  boxShadow: "var(--shadow-sm)",
};

const kpiTileStyle: React.CSSProperties = {
  background: "var(--bg-surface-elevated)",
  border: "1px solid var(--border-light)",
  borderRadius: 14,
  padding: 14,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: 8,
  cursor: "pointer",
  transition: "border-color 0.15s ease, transform 0.15s ease",
  textAlign: "left",
};

export const ExecutiveOverviewSection: React.FC<ExecutiveOverviewSectionProps> = ({
  snapshot,
  permissions,
  onSelectTab,
  onDrilldown,
}) => {
  const [trendMetric, setTrendMetric] = useState<TrendMetricKey>("registrations");
  const compareLabel = snapshot.comparisonWindow?.label;

  const regDelta = computePercentChange(snapshot.newUsersCurrent.length, snapshot.newUsersPrev);
  const likeDelta = computePercentChange(snapshot.likesCurrent.length, snapshot.likesPrev);
  const matchDelta = computePercentChange(snapshot.matchesCurrent.length, snapshot.matchesPrev);
  const subRevDelta = computePercentChange(snapshot.netSubRevenueUsd, snapshot.prevNetSubRevenueUsd);
  const coinUsdDelta = computePercentChange(
    snapshot.coinPurchaseVolumeUsd,
    snapshot.coinPurchasesPrevUsd
  );

  const stickinessRatio =
    snapshot.mauCount > 0 ? (snapshot.dauCount / snapshot.mauCount) * 100 : 0;
  const activeCount = snapshot.activeUsersWindow.length;
  const likesPerActive = activeCount > 0 ? (snapshot.likesCurrent.length / activeCount).toFixed(1) : "0.0";
  const matchesPerActive =
    activeCount > 0 ? (snapshot.matchesCurrent.length / activeCount).toFixed(2) : "0.00";
  const convosPerActive =
    activeCount > 0 ? (snapshot.convosCurrent.length / activeCount).toFixed(2) : "0.00";
  const liveParticipatedUsers = new Set([
    ...snapshot.liveHosts.map((h) => h.user.id),
    ...snapshot.liveViewers.map((v) => v.user.id),
    ...snapshot.liveGuests.map((g) => g.user.id),
  ]).size;
  const liveParticipationRate =
    snapshot.users.length > 0 ? (liveParticipatedUsers / snapshot.users.length) * 100 : 0;

  // Trend chart configuration
  const trendConfig: Record<
    TrendMetricKey,
    { label: string; color: string; isUsd: boolean; tab: AnalyticsTabKey; route: string }
  > = {
    registrations: {
      label: "User Registrations",
      color: "var(--primary)",
      isUsd: false,
      tab: "user_analytics",
      route: "/users",
    },
    activeUsers: {
      label: "Active Users",
      color: "var(--accent-lavender)",
      isUsd: false,
      tab: "user_analytics",
      route: "/users",
    },
    matches: {
      label: "Confirmed Mutual Matches",
      color: "var(--status-success)",
      isUsd: false,
      tab: "likes_matches_analytics",
      route: "/matches",
    },
    subRevenueUsd: {
      label: "Subscription Net Revenue (USD)",
      color: "var(--status-info)",
      isUsd: true,
      tab: "premium_revenue_analytics",
      route: "/subscriptions",
    },
    coinPurchaseUsd: {
      label: "Gift Coin IAP Volume (USD)",
      color: "var(--accent-champagne)",
      isUsd: true,
      tab: "gift_coins_analytics",
      route: "/wallet",
    },
    reports: {
      label: "Submitted Safety Reports",
      color: "var(--status-warning)",
      isUsd: false,
      tab: "moderation_analytics",
      route: "/moderation",
    },
  };

  const activeMetricKey: TrendMetricKey =
    !permissions.canViewRevenueAnalytics &&
    (trendMetric === "subRevenueUsd" || trendMetric === "coinPurchaseUsd")
      ? "registrations"
      : trendMetric;
  const activeTrend = trendConfig[activeMetricKey];

  const buckets = snapshot.timeBuckets.slice(-14);
  const seriesValues = buckets.map((b) => b[activeMetricKey]);
  const maxVal = Math.max(1, ...seriesValues);

  // Recent Cross-Module Business Activity (live from all module arrays)
  const activityFeed = [
    ...snapshot.newUsersCurrent.slice(0, 2).map((u) => ({
      id: `act_u_${u.id}`,
      timestamp: u.registrationDate,
      module: "User Management",
      route: "/users",
      title: `New member registered: ${u.name}`,
      detail: `${u.country} • Status: ${u.status}`,
      tone: "var(--primary)",
    })),
    ...(permissions.canViewRevenueAnalytics
      ? snapshot.subTxsCurrent
          .filter((t) => t.status === "successful")
          .slice(0, 2)
          .map((t) => ({
            id: `act_sub_${t.id}`,
            timestamp: t.timestamp,
            module: "Subscriptions",
            route: "/subscriptions",
            title: `Premium payment settled: ${t.userName}`,
            detail: `${t.planName} • ${formatMoneyUsd(t.amount)}`,
            tone: "var(--status-success)",
          }))
      : []),
    ...snapshot.successfulReferralsCurrent.slice(0, 2).map((r) => ({
      id: `act_ref_${r.id}`,
      timestamp: r.qualificationDate || r.createdAt,
      module: "Referrals",
      route: "/referrals",
      title: `OTP-verified referral rewarded: ${r.referrer.name}`,
      detail: `+${r.rewardAmount} Connection Points (Referrer-Only)`,
      tone: "var(--accent-lavender)",
    })),
    ...snapshot.matchesCurrent.slice(0, 2).map((m) => ({
      id: `act_mat_${m.id}`,
      timestamp: m.matchDate,
      module: "Likes & Matches",
      route: "/matches",
      title: `Mutual match created: ${m.user1.name} & ${m.user2.name}`,
      detail: m.conversation.exists
        ? `${m.conversation.messageCount} messages exchanged`
        : "Matched, awaiting first chat",
      tone: "var(--status-info)",
    })),
    ...snapshot.liveSessions.slice(0, 2).map((ls) => ({
      id: `act_ls_${ls.id}`,
      timestamp: ls.startedAt,
      module: "Live Management",
      route: "/live",
      title: `Live session hosted by ${ls.host.name}`,
      detail: `${ls.title} • Peak ${ls.peakViewers} viewers • ${formatCoinsQty(ls.giftCoinsEarned)}`,
      tone: "var(--accent-champagne)",
    })),
    ...snapshot.reportsCurrent.slice(0, 1).map((rep) => ({
      id: `act_rep_${rep.id}`,
      timestamp: rep.submittedAt,
      module: "Moderation",
      route: "/moderation",
      title: `Safety report opened (${rep.category})`,
      detail: `Priority: ${rep.priority} • Status: ${rep.status}`,
      tone: "var(--status-warning)",
    })),
    ...snapshot.ticketsCurrent.slice(0, 1).map((tkt) => ({
      id: `act_tkt_${tkt.id}`,
      timestamp: tkt.createdAt,
      module: "Customer Support",
      route: "/support",
      title: `Support ticket ${tkt.id}: ${tkt.subject}`,
      detail: `${tkt.categoryGroup} • ${tkt.status}`,
      tone: "var(--status-error)",
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* A. Platform Statistics — 5 Grouped Subsections */}
      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 17, color: "var(--text-main)" }}>
              A. Platform Statistics Overview
            </h2>
            <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--text-secondary)" }}>
              Aggregated in real time across all 12 NobleBond operational stores. Click any tile to
              inspect calculation details and jump to the source module.
            </p>
          </div>
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              color: "var(--text-secondary)",
              background: "var(--bg-surface-elevated)",
              padding: "4px 10px",
              borderRadius: 999,
            }}
          >
            Window: {snapshot.currentWindow.label}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Group 1: User Growth */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                marginBottom: 10,
                fontSize: 12.5,
                fontWeight: 700,
                color: "var(--primary)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              <Users size={14} />
              <span>User Growth</span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: 12,
              }}
            >
              <button
                type="button"
                style={kpiTileStyle}
                onClick={() =>
                  onDrilldown({
                    title: "Total Registered Users (Scoped)",
                    subtitle: "Filtered total members in User Management directory",
                    sourceModuleLabel: "User Management",
                    targetRoute: "/users",
                    rows: [
                      { label: "Total Filtered Users", value: `${snapshot.users.length}` },
                      {
                        label: "Verified Members",
                        value: `${snapshot.users.filter((u) => u.verification.status === "verified").length}`,
                      },
                      {
                        label: "Suspended / Banned",
                        value: `${snapshot.users.filter((u) => u.status === "suspended" || u.status === "banned").length}`,
                        hint: "Excluded from active user metrics",
                      },
                    ],
                    methodologyNote:
                      "Counts all member profiles matching active dimensional filters.",
                  })
                }
              >
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)" }}>
                    Total Scoped Users
                  </span>
                  <ArrowUpRight size={14} style={{ color: "var(--text-muted)" }} />
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-main)" }}>
                  {snapshot.users.length.toLocaleString()}
                </div>
                <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                  Across {snapshot.availableCountries.length} country markets
                </span>
              </button>

              <button
                type="button"
                style={kpiTileStyle}
                onClick={() =>
                  onDrilldown({
                    title: "New Registrations in Period",
                    subtitle: snapshot.currentWindow.label,
                    sourceModuleLabel: "User Management",
                    targetRoute: "/users",
                    rows: [
                      {
                        label: "Registrations (Current)",
                        value: `${snapshot.newUsersCurrent.length}`,
                      },
                      {
                        label: "Registrations (Previous)",
                        value:
                          snapshot.newUsersPrev !== null ? `${snapshot.newUsersPrev}` : "No baseline",
                      },
                      {
                        label: "Referral Attributed",
                        value: `${snapshot.newUsersCurrent.filter((u) => Boolean(u.referral.referredByCode)).length}`,
                      },
                    ],
                    methodologyNote:
                      "Counts completed account registrations whose registrationDate falls inside the selected reporting window.",
                  })
                }
              >
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)" }}>
                    New Registrations
                  </span>
                  <ArrowUpRight size={14} style={{ color: "var(--text-muted)" }} />
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-main)" }}>
                  {snapshot.newUsersCurrent.length}
                </div>
                <MetricDeltaPill deltaPercent={regDelta} compareLabel={compareLabel} />
              </button>

              <button
                type="button"
                style={kpiTileStyle}
                onClick={() =>
                  onDrilldown({
                    title: "Eligible Active Users",
                    subtitle: "Non-suspended, non-banned, non-deleted active users",
                    sourceModuleLabel: "User Management",
                    targetRoute: "/users",
                    rows: [
                      { label: "Window Active Users", value: `${activeCount}` },
                      { label: "Daily Active (DAU)", value: `${snapshot.dauCount}` },
                      { label: "Weekly Active (WAU)", value: `${snapshot.wauCount}` },
                      { label: "Monthly Active (MAU)", value: `${snapshot.mauCount}` },
                    ],
                    methodologyNote:
                      "Active Users strictly exclude suspended, banned, or deleted accounts and reflect observed activity timestamps inside the window.",
                  })
                }
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)" }}>
                    Active Users
                  </span>
                  <AnalyticsMetricTooltip metricId="dau" />
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-main)" }}>
                  {activeCount}
                </div>
                <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                  DAU {snapshot.dauCount} / WAU {snapshot.wauCount} / MAU {snapshot.mauCount}
                </span>
              </button>

              <button
                type="button"
                style={kpiTileStyle}
                onClick={() =>
                  onDrilldown({
                    title: "Returning Users",
                    subtitle: "Active >= 24h after initial registration",
                    sourceModuleLabel: "User Management",
                    targetRoute: "/users",
                    rows: [
                      { label: "Returning Active Users", value: `${snapshot.returningUsers.length}` },
                      {
                        label: "Share of Active Window",
                        value:
                          activeCount > 0
                            ? formatPercent((snapshot.returningUsers.length / activeCount) * 100)
                            : "0.0%",
                      },
                    ],
                    methodologyNote:
                      "Defined as eligible active users whose latest activity timestamp occurs at least 24 hours after initial registration.",
                  })
                }
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)" }}>
                    Returning Users
                  </span>
                  <AnalyticsMetricTooltip metricId="retention_returning" />
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-main)" }}>
                  {snapshot.returningUsers.length}
                </div>
                <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                  Returning &ge; 24h post-signup
                </span>
              </button>
            </div>
          </div>

          {/* Group 2: Dating Activity */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                marginBottom: 10,
                fontSize: 12.5,
                fontWeight: 700,
                color: "var(--status-error)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              <Heart size={14} />
              <span>Dating Activity</span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: 12,
              }}
            >
              <button
                type="button"
                style={kpiTileStyle}
                onClick={() =>
                  onDrilldown({
                    title: "Profile Completion Quality",
                    subtitle: "Photos, Bio, Personal Info, Interests, Lifestyle & Prompts",
                    sourceModuleLabel: "Profile Management",
                    targetRoute: "/profiles",
                    rows: [
                      { label: "Profiles >= 80% Complete", value: `${snapshot.completeProfiles.length}` },
                      { label: "Total Profiles Evaluated", value: `${snapshot.profiles.length}` },
                      { label: "Mean Completion Score", value: `${snapshot.avgProfileCompletion}%` },
                    ],
                    methodologyNote:
                      "Evaluated strictly across actual profile fields collected in NobleBond (zero fabricated compatibility scores).",
                  })
                }
              >
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)" }}>
                    Complete Profiles (&ge;80%)
                  </span>
                  <AnalyticsMetricTooltip metricId="profile_completion_rate" />
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-main)" }}>
                  {snapshot.completeProfiles.length}
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginLeft: 6 }}>
                    / {snapshot.profiles.length}
                  </span>
                </div>
                <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                  Avg score: {snapshot.avgProfileCompletion}%
                </span>
              </button>

              <button
                type="button"
                style={kpiTileStyle}
                onClick={() =>
                  onDrilldown({
                    title: "Likes Sent (One-Way Interactions)",
                    subtitle: "Strictly distinct from Mutual Matches",
                    sourceModuleLabel: "Likes & Matches",
                    targetRoute: "/matches",
                    rows: [
                      { label: "Total Likes Sent", value: `${snapshot.likesCurrent.length}` },
                      {
                        label: "Super Likes Included",
                        value: `${snapshot.likesCurrent.filter((l) => l.type === "super_like").length}`,
                      },
                      {
                        label: "Pending Reciprocation",
                        value: `${snapshot.likesCurrent.filter((l) => l.status === "pending").length}`,
                      },
                    ],
                    methodologyNote:
                      "Directional like actions initiated in Discovery. One-way likes are never counted in mutual match metrics.",
                  })
                }
              >
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)" }}>
                    Likes Sent (1-Way)
                  </span>
                  <ArrowUpRight size={14} style={{ color: "var(--text-muted)" }} />
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-main)" }}>
                  {snapshot.likesCurrent.length}
                </div>
                <MetricDeltaPill deltaPercent={likeDelta} compareLabel={compareLabel} />
              </button>

              <button
                type="button"
                style={kpiTileStyle}
                onClick={() =>
                  onDrilldown({
                    title: "Confirmed Mutual Matches",
                    subtitle: "Two-way reciprocated matches only",
                    sourceModuleLabel: "Likes & Matches",
                    targetRoute: "/matches",
                    rows: [
                      { label: "Mutual Matches", value: `${snapshot.matchesCurrent.length}` },
                      {
                        label: "Converted to Chat",
                        value: `${snapshot.matchesCurrent.filter((m) => m.conversation.exists).length}`,
                      },
                      {
                        label: "Active Matches",
                        value: `${snapshot.matchesCurrent.filter((m) => m.status === "active").length}`,
                      },
                    ],
                    methodologyNote:
                      "Counts only confirmed mutual matches where both users accepted/liked each other.",
                  })
                }
              >
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)" }}>
                    Mutual Matches
                  </span>
                  <AnalyticsMetricTooltip metricId="match_creation_rate" />
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-main)" }}>
                  {snapshot.matchesCurrent.length}
                </div>
                <MetricDeltaPill deltaPercent={matchDelta} compareLabel={compareLabel} />
              </button>

              <button
                type="button"
                style={kpiTileStyle}
                onClick={() =>
                  onDrilldown({
                    title: "Messaging & Calls Activity",
                    subtitle: "Aggregated volume & connection health (zero private content exposure)",
                    sourceModuleLabel: "Chat Management",
                    targetRoute: "/chats",
                    rows: [
                      { label: "Active Conversations", value: `${snapshot.convosCurrent.length}` },
                      {
                        label: "Total Messages Recorded",
                        value: snapshot.messagesSentCurrent.toLocaleString(),
                      },
                      { label: "Audio / Video Calls", value: `${snapshot.callsCurrent.length}` },
                    ],
                    methodologyNote:
                      "Aggregates metadata counts only. Private message text and call media are never exposed in BI analytics.",
                  })
                }
              >
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)" }}>
                    Conversations & Calls
                  </span>
                  <AnalyticsMetricTooltip metricId="message_delivery_rate" />
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-main)" }}>
                  {snapshot.convosCurrent.length}
                </div>
                <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                  {snapshot.messagesSentCurrent.toLocaleString()} msgs • {snapshot.callsCurrent.length}{" "}
                  calls
                </span>
              </button>
            </div>
          </div>

          {/* Group 3: Live Activity */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                marginBottom: 10,
                fontSize: 12.5,
                fontWeight: 700,
                color: "var(--accent-champagne)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              <Radio size={14} />
              <span>Live Streaming Activity</span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: 12,
              }}
            >
              <button
                type="button"
                style={kpiTileStyle}
                onClick={() => onSelectTab("live_streaming_analytics")}
              >
                <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)" }}>
                  Live Sessions in Window
                </span>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-main)" }}>
                  {snapshot.liveSessions.length}
                </div>
                <span style={{ fontSize: 11.5, color: "var(--status-success)", fontWeight: 600 }}>
                  {snapshot.liveCurrentlyActive.length} streaming live right now
                </span>
              </button>

              <button
                type="button"
                style={kpiTileStyle}
                onClick={() => onSelectTab("live_streaming_analytics")}
              >
                <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)" }}>
                  Registered Live Hosts
                </span>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-main)" }}>
                  {snapshot.liveHosts.length}
                </div>
                <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                  {snapshot.liveHosts.filter((h) => h.isCurrentlyLive).length} active broadcasters
                </span>
              </button>

              <button
                type="button"
                style={kpiTileStyle}
                onClick={() => onSelectTab("live_streaming_analytics")}
              >
                <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)" }}>
                  Viewers & Multi-Guests
                </span>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-main)" }}>
                  {snapshot.liveViewers.length + snapshot.liveGuests.length}
                </div>
                <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                  {snapshot.liveViewers.length} viewers • {snapshot.liveGuests.length} co-host guests
                </span>
              </button>

              <button
                type="button"
                style={kpiTileStyle}
                onClick={() => onSelectTab("gift_coins_analytics")}
              >
                <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)" }}>
                  Virtual Gift Coins Sent
                </span>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-main)" }}>
                  {formatCoinsQty(snapshot.totalCoinsSpentOnGifts)}
                </div>
                <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                  Virtual spend (Not fiat USD)
                </span>
              </button>
            </div>
          </div>

          {/* Group 4: Business Performance (Role-Gated USD Revenue vs Virtual Ledgers) */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                marginBottom: 10,
                fontSize: 12.5,
                fontWeight: 700,
                color: "var(--status-success)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              <DollarSign size={14} />
              <span>Business Performance & Virtual Ledgers</span>
            </div>

            {permissions.canViewRevenueAnalytics ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                  gap: 12,
                }}
              >
                <button
                  type="button"
                  style={kpiTileStyle}
                  onClick={() => onSelectTab("premium_revenue_analytics")}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)" }}>
                      Net Subscription Revenue
                    </span>
                    <AnalyticsMetricTooltip metricId="subscription_net_revenue" />
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-main)" }}>
                    {formatMoneyUsd(snapshot.netSubRevenueUsd)}
                  </div>
                  <MetricDeltaPill deltaPercent={subRevDelta} compareLabel={compareLabel} />
                </button>

                <button
                  type="button"
                  style={kpiTileStyle}
                  onClick={() => onSelectTab("premium_revenue_analytics")}
                >
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)" }}>
                    Active Subscription MRR
                  </span>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-main)" }}>
                    {formatMoneyUsd(snapshot.mrrUsd)}
                  </div>
                  <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                    {snapshot.activePaidSubs.length} paying members • Churn {snapshot.churnRatePercent}%
                  </span>
                </button>

                <button
                  type="button"
                  style={kpiTileStyle}
                  onClick={() => onSelectTab("gift_coins_analytics")}
                >
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)" }}>
                    Gift Coin IAP Volume (USD)
                  </span>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-main)" }}>
                    {formatMoneyUsd(snapshot.coinPurchaseVolumeUsd)}
                  </div>
                  <MetricDeltaPill deltaPercent={coinUsdDelta} compareLabel={compareLabel} />
                </button>

                <button
                  type="button"
                  style={kpiTileStyle}
                  onClick={() => onSelectTab("connection_points_analytics")}
                >
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)" }}>
                    Connection Points Issued
                  </span>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-main)" }}>
                    {formatPointsQty(snapshot.cpIssuedPoints)}
                  </div>
                  <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                    Non-cash referral & check rewards
                  </span>
                </button>
              </div>
            ) : (
              <div
                style={{
                  padding: 16,
                  borderRadius: 12,
                  background: "var(--bg-surface-elevated)",
                  border: "1px dashed var(--border)",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "var(--text-secondary)",
                  fontSize: 13,
                }}
              >
                <Lock size={16} style={{ color: "var(--text-muted)" }} />
                <span>
                  Financial & Revenue metrics are restricted for{" "}
                  <strong>{permissions.roleLabel}</strong>. Switch to Super Admin or Finance Lead
                  to inspect USD revenue & virtual economy ledgers.
                </span>
              </div>
            )}
          </div>

          {/* Group 5: Safety & Support */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                marginBottom: 10,
                fontSize: 12.5,
                fontWeight: 700,
                color: "var(--status-warning)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              <ShieldAlert size={14} />
              <span>Safety, Fraud & Support Operations</span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: 12,
              }}
            >
              <button
                type="button"
                style={kpiTileStyle}
                onClick={() => onSelectTab("moderation_analytics")}
              >
                <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)" }}>
                  Open Safety Reports
                </span>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-main)" }}>
                  {snapshot.pendingReportsCount}
                </div>
                <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                  Out of {snapshot.reportsCurrent.length} submitted in window
                </span>
              </button>

              <button
                type="button"
                style={kpiTileStyle}
                onClick={() => onSelectTab("support_analytics")}
              >
                <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)" }}>
                  Open Support Tickets
                </span>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-main)" }}>
                  {snapshot.openTicketsCount}
                </div>
                <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                  {snapshot.escalatedTicketsCount} escalated • {snapshot.supportAgents.length} agents
                </span>
              </button>

              <button
                type="button"
                style={kpiTileStyle}
                onClick={() => onSelectTab("referral_analytics")}
              >
                <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)" }}>
                  OTP-Verified Referrals
                </span>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-main)" }}>
                  {snapshot.successfulReferralsCurrent.length}
                </div>
                <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                  {snapshot.refConversionRate}% conversion • {snapshot.fraudCases.length} fraud signals
                </span>
              </button>

              <button
                type="button"
                style={kpiTileStyle}
                onClick={() => onSelectTab("moderation_analytics")}
              >
                <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)" }}>
                  Enforcement Actions
                </span>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-main)" }}>
                  {snapshot.modActionsCurrent.length}
                </div>
                <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                  {snapshot.appealsCurrent.length} user appeals logged
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* B. Overall Business Growth (Interactive Multi-Metric SVG Chart) */}
      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <TrendingUp size={18} style={{ color: "var(--primary)" }} />
              <h3 style={{ margin: 0, fontSize: 16, color: "var(--text-main)" }}>
                B. Overall Business Growth
              </h3>
            </div>
            <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--text-secondary)" }}>
              Click any metric button to switch the trend line or click any bucket bar to drill
              down.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {(Object.keys(trendConfig) as TrendMetricKey[]).map((key) => {
              if (
                !permissions.canViewRevenueAnalytics &&
                (key === "subRevenueUsd" || key === "coinPurchaseUsd")
              ) {
                return null;
              }
              const active = activeMetricKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTrendMetric(key)}
                  style={{
                    padding: "6px 11px",
                    borderRadius: 999,
                    border: `1px solid ${active ? trendConfig[key].color : "var(--border)"}`,
                    background: active ? "var(--bg-active)" : "var(--bg-surface-elevated)",
                    color: active ? "var(--text-main)" : "var(--text-secondary)",
                    fontSize: 12,
                    fontWeight: active ? 700 : 500,
                    cursor: "pointer",
                  }}
                >
                  {trendConfig[key].label}
                </button>
              );
            })}
          </div>
        </div>

        {/* SVG Chart Container */}
        <div style={{ width: "100%", overflowX: "auto" }}>
          <svg
            viewBox="0 0 760 220"
            style={{ width: "100%", minWidth: 520, height: 220, display: "block" }}
            role="img"
            aria-label={`Business Growth chart for ${activeTrend.label}`}
          >
            {/* Horizontal grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = 175 - ratio * 140;
              const tickVal = Math.round(maxVal * ratio);
              return (
                <g key={i}>
                  <line
                    x1={56}
                    x2={740}
                    y1={y}
                    y2={y}
                    stroke="var(--border-light)"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={48}
                    y={y + 4}
                    textAnchor="end"
                    fontSize={10}
                    fill="var(--text-muted)"
                  >
                    {activeTrend.isUsd ? `$${tickVal}` : tickVal}
                  </text>
                </g>
              );
            })}

            {/* Bars + Clickable Bucket Nodes */}
            {buckets.map((bucket, idx) => {
              const val = bucket[activeMetricKey];
              const colW = 660 / Math.max(1, buckets.length);
              const barW = Math.min(34, Math.max(12, colW * 0.52));
              const cx = 66 + idx * colW + colW / 2;
              const barH = Math.max(3, (val / maxVal) * 140);
              const y = 175 - barH;

              return (
                <g
                  key={bucket.label}
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    onDrilldown({
                      title: `${activeTrend.label}: ${bucket.label}`,
                      subtitle: `Time bucket breakdown (${snapshot.currentWindow.label})`,
                      sourceModuleLabel: activeTrend.label,
                      targetRoute: activeTrend.route,
                      rows: [
                        { label: "New Registrations", value: `${bucket.registrations}` },
                        { label: "Active Users Observed", value: `${bucket.activeUsers}` },
                        { label: "Mutual Matches", value: `${bucket.matches}` },
                        ...(permissions.canViewRevenueAnalytics
                          ? [
                              {
                                label: "Subscription Revenue (USD)",
                                value: formatMoneyUsd(bucket.subRevenueUsd),
                              },
                              {
                                label: "Gift Coin IAP Volume (USD)",
                                value: formatMoneyUsd(bucket.coinPurchaseUsd),
                              },
                            ]
                          : []),
                        { label: "Submitted Reports", value: `${bucket.reports}` },
                      ],
                      methodologyNote:
                        "Each bar reflects real timestamps aggregated dynamically by the selected daily/weekly/monthly granularity.",
                    })
                  }
                >
                  <rect
                    x={cx - barW / 2}
                    y={y}
                    width={barW}
                    height={barH}
                    rx={6}
                    fill={activeTrend.color}
                    fillOpacity={0.28}
                  />
                  <circle cx={cx} cy={y} r={4.5} fill={activeTrend.color} />
                  <text
                    x={cx}
                    y={196}
                    textAnchor="middle"
                    fontSize={10}
                    fill="var(--text-muted)"
                  >
                    {bucket.label.slice(-5)}
                  </text>
                </g>
              );
            })}

            {/* Trend Polyline */}
            {buckets.length > 1 && (
              <polyline
                fill="none"
                stroke={activeTrend.color}
                strokeWidth={2.5}
                points={buckets
                  .map((b, idx) => {
                    const colW = 660 / buckets.length;
                    const cx = 66 + idx * colW + colW / 2;
                    const y = 175 - Math.max(3, (b[activeMetricKey] / maxVal) * 140);
                    return `${cx},${y}`;
                  })
                  .join(" ")}
              />
            )}
          </svg>
        </div>
      </div>

      {/* C. Strictly Separated Revenue Overview + D. Platform Engagement */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))",
          gap: 16,
        }}
      >
        {/* C. Revenue Overview */}
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Coins size={18} style={{ color: "var(--status-success)" }} />
            <h3 style={{ margin: 0, fontSize: 16, color: "var(--text-main)" }}>
              C. Revenue & Economy Separation
            </h3>
          </div>

          {!permissions.canViewRevenueAnalytics ? (
            <div style={{ fontSize: 13, color: "var(--text-secondary)", padding: "12px 0" }}>
              USD Revenue details hidden under current RBAC permissions. Non-cash unit policies are
              maintained separately across Subscriptions, Wallet, and Referrals.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div
                style={{
                  padding: 12,
                  borderRadius: 12,
                  background: "var(--bg-surface-elevated)",
                  borderLeft: "4px solid var(--status-info)",
                }}
              >
                <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--status-info)" }}>
                  1. PREMIUM SUBSCRIPTIONS (FIAT USD)
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginTop: 4,
                  }}
                >
                  <span style={{ fontSize: 20, fontWeight: 800, color: "var(--text-main)" }}>
                    {formatMoneyUsd(snapshot.netSubRevenueUsd)} Net
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    Gross {formatMoneyUsd(snapshot.grossSubRevenueUsd)} • Refunds{" "}
                    {formatMoneyUsd(snapshot.subRefundsUsd)}
                  </span>
                </div>
              </div>

              <div
                style={{
                  padding: 12,
                  borderRadius: 12,
                  background: "var(--bg-surface-elevated)",
                  borderLeft: "4px solid var(--accent-champagne)",
                }}
              >
                <div
                  style={{ fontSize: 11.5, fontWeight: 700, color: "var(--accent-champagne)" }}
                >
                  2. GIFT COIN IAP VOLUME (FIAT USD)
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginTop: 4,
                  }}
                >
                  <span style={{ fontSize: 20, fontWeight: 800, color: "var(--text-main)" }}>
                    {formatMoneyUsd(snapshot.coinPurchaseVolumeUsd)}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    {formatCoinsQty(snapshot.totalCoinsPurchased)} purchased via IAP
                  </span>
                </div>
              </div>

              <div
                style={{
                  padding: 12,
                  borderRadius: 12,
                  background: "var(--bg-surface-elevated)",
                  borderLeft: "4px solid var(--primary)",
                }}
              >
                <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--primary)" }}>
                  3. VIRTUAL GIFT COINS LEDGER (NON-USD ACTIVITY)
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginTop: 4,
                  }}
                >
                  <span style={{ fontSize: 17, fontWeight: 800, color: "var(--text-main)" }}>
                    {formatCoinsQty(snapshot.totalCoinsCirculating)} Circulating
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    {formatCoinsQty(snapshot.totalCoinsSpentOnGifts)} sent in live gifts
                  </span>
                </div>
              </div>

              <div
                style={{
                  padding: 12,
                  borderRadius: 12,
                  background: "var(--bg-surface-elevated)",
                  borderLeft: "4px solid var(--accent-lavender)",
                }}
              >
                <div
                  style={{ fontSize: 11.5, fontWeight: 700, color: "var(--accent-lavender)" }}
                >
                  4. CONNECTION POINTS (NON-CASH REWARDS ONLY)
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginTop: 4,
                  }}
                >
                  <span style={{ fontSize: 17, fontWeight: 800, color: "var(--text-main)" }}>
                    {formatPointsQty(snapshot.cpCirculatingPoints)} Circulating
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    +{formatPointsQty(snapshot.cpIssuedPoints)} issued / -
                    {formatPointsQty(snapshot.cpRedeemedPoints)} redeemed
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* D. Platform Engagement */}
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Activity size={18} style={{ color: "var(--accent-lavender)" }} />
            <h3 style={{ margin: 0, fontSize: 16, color: "var(--text-main)" }}>
              D. Platform Engagement Intensity
            </h3>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(130px, 1fr))",
              gap: 10,
            }}
          >
            {[
              {
                label: "DAU / MAU Stickiness",
                value: formatPercent(stickinessRatio),
                hint: `${snapshot.dauCount} DAU / ${snapshot.mauCount} MAU`,
              },
              {
                label: "Likes / Active User",
                value: likesPerActive,
                hint: `${snapshot.likesCurrent.length} directional likes`,
              },
              {
                label: "Matches / Active User",
                value: matchesPerActive,
                hint: `${snapshot.matchesCurrent.length} mutual matches`,
              },
              {
                label: "Convos / Active User",
                value: convosPerActive,
                hint: `${snapshot.convosCurrent.length} active threads`,
              },
              {
                label: "Live Participation Rate",
                value: formatPercent(liveParticipationRate),
                hint: `${liveParticipatedUsers} unique hosts/viewers/guests`,
              },
              {
                label: "Profile Readiness",
                value: `${snapshot.avgProfileCompletion}%`,
                hint: `${snapshot.completeProfiles.length} complete (>=80%)`,
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-secondary)" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 21, fontWeight: 800, color: "var(--text-main)", margin: "4px 0" }}>
                  {item.value}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.hint}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* E. Recent Business Activity + F. Data-Driven Business Insights */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))",
          gap: 16,
        }}
      >
        {/* E. Recent Business Activity */}
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Clock size={18} style={{ color: "var(--primary)" }} />
            <h3 style={{ margin: 0, fontSize: 16, color: "var(--text-main)" }}>
              E. Recent Cross-Module Activity
            </h3>
          </div>
          {activityFeed.length === 0 ? (
            <div style={{ fontSize: 13, color: "var(--text-muted)", padding: 16 }}>
              No cross-module records matched the active filters.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {activityFeed.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 12,
                    background: "var(--bg-surface-elevated)",
                    border: "1px solid var(--border-light)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: item.tone,
                        marginTop: 6,
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-main)" }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 2 }}>
                        {item.detail}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--primary)" }}>
                      {item.module}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {formatShortDate(item.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* F. Deterministic Data-Driven Business Insights */}
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Lightbulb size={18} style={{ color: "var(--accent-champagne)" }} />
            <h3 style={{ margin: 0, fontSize: 16, color: "var(--text-main)" }}>
              F. Threshold-Triggered Business Insights
            </h3>
          </div>
          <p style={{ margin: "0 0 12px", fontSize: 12, color: "var(--text-secondary)" }}>
            Deterministic findings derived directly from live comparison thresholds (no speculative
            or fabricated predictions).
          </p>

          {snapshot.insights.length === 0 ? (
            <div style={{ fontSize: 13, color: "var(--text-muted)", padding: 14 }}>
              No material threshold anomalies detected within the current date window.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {snapshot.insights.map((ins) => {
                const sevColor =
                  ins.severity === "positive"
                    ? "var(--status-success)"
                    : ins.severity === "warning"
                      ? "var(--status-warning)"
                      : "var(--status-info)";
                const sevBg =
                  ins.severity === "positive"
                    ? "var(--status-success-bg)"
                    : ins.severity === "warning"
                      ? "var(--status-warning-bg)"
                      : "var(--status-info-bg)";
                return (
                  <div
                    key={ins.id}
                    style={{
                      padding: 13,
                      borderRadius: 12,
                      background: "var(--bg-surface-elevated)",
                      border: "1px solid var(--border-light)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: sevColor,
                          background: sevBg,
                          padding: "2px 8px",
                          borderRadius: 999,
                        }}
                      >
                        {ins.metricLabel}
                      </span>
                      <button
                        type="button"
                        onClick={() => onSelectTab(ins.targetTab)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          border: "none",
                          background: "transparent",
                          color: "var(--primary)",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        <span>Inspect Section</span>
                        <ArrowUpRight size={13} />
                      </button>
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-main)" }}>
                      {ins.title}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.45 }}>
                      {ins.explanation}
                    </div>
                    <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-muted)" }}>
                      Supporting counts: {ins.supportingNumbers}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div
            style={{
              marginTop: 14,
              padding: "10px 12px",
              borderRadius: 10,
              background: "var(--bg-surface-elevated)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 11.5,
              color: "var(--text-secondary)",
            }}
          >
            <Award size={14} style={{ color: "var(--primary)", flexShrink: 0 }} />
            <span>
              All NobleBond BI numbers link directly to persistent admin stores with zero invented
              telemetry.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

