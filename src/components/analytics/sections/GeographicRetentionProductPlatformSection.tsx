import React from "react";
import {
  Globe,
  Repeat,
  Layers,
  Server,
  Lock,
  Info,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { PlatformAnalyticsSnapshot } from "../../../data/platformAnalyticsDataService";
import type {
  AnalyticsRolePermissions,
  DrilldownPayload,
} from "../../../types/analyticsManagement.types";
import {
  formatCoinsQty,
  formatMoneyUsd,
  formatPercent,
  formatPointsQty,
} from "../analyticsUiUtils";
import { AnalyticsMetricTooltip } from "../AnalyticsMetricTooltip";

interface GeographicRetentionProductPlatformSectionProps {
  snapshot: PlatformAnalyticsSnapshot;
  permissions: AnalyticsRolePermissions;
  mode:
    | "geographic_analytics"
    | "retention_cohort_analytics"
    | "feature_usage_analytics"
    | "platform_reliability_analytics";
  onDrilldown: (payload: DrilldownPayload) => void;
}

const cardStyle: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: 16,
  padding: 18,
  boxShadow: "var(--shadow-sm)",
};

export const GeographicRetentionProductPlatformSection: React.FC<
  GeographicRetentionProductPlatformSectionProps
> = ({ snapshot, permissions, mode, onDrilldown }) => {
  // 15. Geographic Analytics
  if (mode === "geographic_analytics") {
    if (!permissions.canViewGeographicAnalytics) {
      return (
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 14 }}>
            <Lock size={18} style={{ color: "var(--text-muted)" }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main)" }}>
                Geographic Analytics Restricted by Role
              </div>
              <div style={{ fontSize: 12.5, color: "var(--text-secondary)", marginTop: 2 }}>
                Switch to Super Admin, Finance Lead, or Growth Lead to inspect country-level
                performance metrics.
              </div>
            </div>
          </div>
        </div>
      );
    }

    const topFour = snapshot.geographicRows.slice(0, 4);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Globe size={18} style={{ color: "var(--status-info)" }} />
            <h2 style={{ margin: 0, fontSize: 17, color: "var(--text-main)" }}>
              Section 15: Geographic Market Analytics (Declared Profile Country)
            </h2>
          </div>
          <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--text-secondary)" }}>
            Country rankings use user-declared profile locations only; raw IP addresses and GPS
            coordinates are never surfaced or stored in BI tables.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(205px, 1fr))",
              gap: 12,
              marginBottom: 18,
            }}
          >
            {topFour.map((geo, idx) => (
              <button
                key={geo.country}
                type="button"
                onClick={() =>
                  onDrilldown({
                    title: `Market Profile: ${geo.country}`,
                    subtitle: `Rank #${idx + 1} by member population`,
                    sourceModuleLabel: "User & Subscription Markets",
                    targetRoute: "/users",
                    rows: [
                      { label: "Total Registered Users", value: `${geo.totalUsers}` },
                      { label: "New Signups in Window", value: `${geo.newRegistrations}` },
                      { label: "Active Users in Window", value: `${geo.activeUsers}` },
                      { label: "Mutual Matches", value: `${geo.mutualMatches}` },
                      { label: "Active Premium Members", value: `${geo.premiumSubscribers}` },
                      ...(permissions.canViewRevenueAnalytics
                        ? [
                            {
                              label: "Subscription Revenue (USD)",
                              value: formatMoneyUsd(geo.subscriptionRevenueUsd),
                            },
                          ]
                        : []),
                    ],
                    methodologyNote:
                      "Attributed by member's declared profile country; strictly separated from network IP geolocation.",
                  })
                }
                style={{
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  borderRadius: 12,
                  padding: 13,
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--primary)" }}>
                  #{idx + 1} MARKET
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-main)", margin: "4px 0" }}>
                  {geo.country}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  {geo.totalUsers} users • {geo.mutualMatches} matches
                </div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 4 }}>
                  {geo.premiumSubscribers} Premium
                  {permissions.canViewRevenueAnalytics
                    ? ` • ${formatMoneyUsd(geo.subscriptionRevenueUsd)}`
                    : ""}
                </div>
              </button>
            ))}
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                  <th style={{ textAlign: "left", padding: "9px 10px" }}>Country</th>
                  <th style={{ textAlign: "right", padding: "9px 10px" }}>Users</th>
                  <th style={{ textAlign: "right", padding: "9px 10px" }}>New</th>
                  <th style={{ textAlign: "right", padding: "9px 10px" }}>Active</th>
                  <th style={{ textAlign: "right", padding: "9px 10px" }}>Matches</th>
                  <th style={{ textAlign: "right", padding: "9px 10px" }}>Referrals</th>
                  <th style={{ textAlign: "right", padding: "9px 10px" }}>Premium</th>
                  {permissions.canViewRevenueAnalytics && (
                    <th style={{ textAlign: "right", padding: "9px 10px" }}>Sub Revenue (USD)</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {snapshot.geographicRows.map((row) => (
                  <tr key={row.country} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "9px 10px", fontWeight: 700, color: "var(--text-main)" }}>
                      {row.country}
                    </td>
                    <td style={{ padding: "9px 10px", textAlign: "right" }}>{row.totalUsers}</td>
                    <td style={{ padding: "9px 10px", textAlign: "right" }}>{row.newRegistrations}</td>
                    <td style={{ padding: "9px 10px", textAlign: "right" }}>{row.activeUsers}</td>
                    <td style={{ padding: "9px 10px", textAlign: "right" }}>{row.mutualMatches}</td>
                    <td style={{ padding: "9px 10px", textAlign: "right" }}>{row.referralsCount}</td>
                    <td style={{ padding: "9px 10px", textAlign: "right" }}>
                      {row.premiumSubscribers}
                    </td>
                    {permissions.canViewRevenueAnalytics && (
                      <td
                        style={{
                          padding: "9px 10px",
                          textAlign: "right",
                          fontWeight: 700,
                          color: "var(--status-success)",
                        }}
                      >
                        {formatMoneyUsd(row.subscriptionRevenueUsd)}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // 16. Retention & Cohort Analytics
  if (mode === "retention_cohort_analytics") {
    const heatCellStyle = (pct: number): React.CSSProperties => {
      const alpha = Math.max(0.08, Math.min(0.85, pct / 100));
      return {
        padding: "10px 8px",
        textAlign: "center",
        fontWeight: 700,
        fontSize: 12.5,
        borderRadius: 8,
        cursor: "pointer",
        background: `rgba(193, 47, 102, ${alpha})`,
        color: pct >= 45 ? "#FFFFFF" : "var(--text-main)",
        border: "1px solid var(--border-light)",
      };
    };

    const churnedSubs = snapshot.subscriptions.filter(
      (s) => s.status === "cancelled" || s.status === "expired"
    ).length;
    const suspendedBanned = snapshot.users.filter(
      (u) => u.status === "suspended" || u.status === "banned"
    ).length;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Repeat size={18} style={{ color: "var(--primary)" }} />
                <h2 style={{ margin: 0, fontSize: 17, color: "var(--text-main)" }}>
                  Section 16: Cohort Retention Heatmap & Lifecycle Governance
                </h2>
              </div>
              <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--text-secondary)" }}>
                Tracks real registration cohorts showing percentage of non-suspended accounts still
                active D1 / D7 / D30 / D60 / D90 days after registration. Click any cell to inspect.
              </p>
            </div>
            <AnalyticsMetricTooltip metricId="retention_returning" />
          </div>

          <div style={{ overflowX: "auto", marginBottom: 18 }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 6 }}>
              <thead>
                <tr style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  <th style={{ textAlign: "left", padding: "6px 8px" }}>Registration Cohort</th>
                  <th style={{ textAlign: "center", padding: "6px 8px" }}>Cohort Size</th>
                  <th style={{ textAlign: "center", padding: "6px 8px" }}>Day 1+</th>
                  <th style={{ textAlign: "center", padding: "6px 8px" }}>Day 7+</th>
                  <th style={{ textAlign: "center", padding: "6px 8px" }}>Day 30+</th>
                  <th style={{ textAlign: "center", padding: "6px 8px" }}>Day 60+</th>
                  <th style={{ textAlign: "center", padding: "6px 8px" }}>Day 90+</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.retentionCohorts.map((coh) => (
                  <tr key={coh.cohortLabel}>
                    <td style={{ padding: "8px", fontWeight: 700, color: "var(--text-main)" }}>
                      {coh.cohortLabel}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        textAlign: "center",
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                      }}
                    >
                      {coh.cohortSize} users
                    </td>
                    {[
                      { horizon: "Day 1+", val: coh.d1Percent },
                      { horizon: "Day 7+", val: coh.d7Percent },
                      { horizon: "Day 30+", val: coh.d30Percent },
                      { horizon: "Day 60+", val: coh.d60Percent },
                      { horizon: "Day 90+", val: coh.d90Percent },
                    ].map((cell) => (
                      <td key={cell.horizon}>
                        <button
                          type="button"
                          onClick={() =>
                            onDrilldown({
                              title: `${coh.cohortLabel} Cohort — ${cell.horizon} Retention`,
                              subtitle: `Cohort Size: ${coh.cohortSize} registered users`,
                              sourceModuleLabel: "User Management Cohorts",
                              targetRoute: "/users",
                              rows: [
                                { label: "Retention Milestone", value: cell.horizon },
                                { label: "Retained Active Percentage", value: formatPercent(cell.val) },
                                { label: "Cohort Denominator", value: `${coh.cohortSize} users` },
                              ],
                              methodologyNote:
                                "Calculated from eligible accounts whose lastActive timestamp occurred at or after N days following registrationDate.",
                            })
                          }
                          style={{ ...heatCellStyle(cell.val), width: "100%" }}
                        >
                          {cell.val}%
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Clear Lifecycle Distinction: Subscription Churn vs Account Suspension vs Deletion */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: 13,
                borderRadius: 12,
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--status-warning)" }}>
                PAID SUBSCRIPTION CHURN
              </div>
              <div style={{ fontSize: 21, fontWeight: 800, color: "var(--text-main)", margin: "4px 0" }}>
                {churnedSubs} subscriptions
              </div>
              <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                Users who cancelled or expired Premium billing while still retaining active free
                accounts.
              </div>
            </div>

            <div
              style={{
                padding: 13,
                borderRadius: 12,
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--status-error)" }}>
                SAFETY EXCLUSIONS (SUSPENDED / BANNED)
              </div>
              <div style={{ fontSize: 21, fontWeight: 800, color: "var(--text-main)", margin: "4px 0" }}>
                {suspendedBanned} accounts
              </div>
              <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                Excluded from both active retention denominators and DAU/WAU/MAU calculations.
              </div>
            </div>

            <div
              style={{
                padding: 13,
                borderRadius: 12,
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--status-info)" }}>
                VOLUNTARY ACCOUNT DELETION
              </div>
              <div style={{ fontSize: 21, fontWeight: 800, color: "var(--text-main)", margin: "4px 0" }}>
                Tracked separately
              </div>
              <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                Member-initiated deletions submitted via Contact Us / Settings are tracked separately
                from involuntary churn.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 17. Product Performance & Feature Usage (Strictly Real Mobile Features Only)
  if (mode === "feature_usage_analytics") {
    const mobileFeatures = [
      {
        feature: "Auth & Onboarding",
        dir: "auth / onboarding / language",
        metric: `${snapshot.users.filter((u) => u.verification.emailVerified || u.verification.phoneVerified).length} OTP verified accounts`,
        route: "/users",
      },
      {
        feature: "Profile & Photos Setup",
        dir: "profile",
        metric: `${snapshot.completeProfiles.length} complete profiles (${snapshot.avgProfileCompletion}% avg)`,
        route: "/profiles",
      },
      {
        feature: "Discovery & Likes",
        dir: "home / discovery / likes",
        metric: `${snapshot.likesCurrent.length} likes • ${snapshot.matchesCurrent.length} mutual matches`,
        route: "/matches",
      },
      {
        feature: "1-on-1 Chats & Calls",
        dir: "chats / voice-call / video-call",
        metric: `${snapshot.convosCurrent.length} chats • ${snapshot.callsCurrent.length} calls`,
        route: "/chats",
      },
      {
        feature: "Live Streaming & Gifting",
        dir: "live",
        metric: `${snapshot.liveSessions.length} sessions • ${formatCoinsQty(snapshot.totalCoinsSpentOnGifts)} gifted`,
        route: "/live",
      },
      {
        feature: "Premium & Wallet Economy",
        dir: "premium / wallet",
        metric: `${snapshot.activePaidSubs.length} active subs • ${formatCoinsQty(snapshot.totalCoinsCirculating)} wallet coins`,
        route: "/subscriptions",
      },
      {
        feature: "Referral Growth & Perks",
        dir: "referral",
        metric: `${snapshot.successfulReferralsCurrent.length} qualified • ${formatPointsQty(snapshot.cpRedeemedPoints)} redeemed`,
        route: "/referrals",
      },
      {
        feature: "Support & Notifications",
        dir: "support / notifications",
        metric: `${snapshot.ticketsCurrent.length} tickets • ${snapshot.notificationCampaigns.length} campaigns`,
        route: "/support",
      },
    ];

    const fourJourneys = [
      {
        name: "Journey 1: Onboarding -> Verified Profile -> Discovery",
        summary: `${snapshot.newUsersCurrent.length} signups -> ${snapshot.completeProfiles.length} complete profiles -> ${snapshot.likesCurrent.length} discovery likes`,
      },
      {
        name: "Journey 2: Like -> Mutual Match -> Active Conversation",
        summary: `${snapshot.likesCurrent.length} 1-way likes -> ${snapshot.matchesCurrent.length} mutual matches -> ${snapshot.matchesCurrent.filter((m) => m.conversation.exists).length} started chats`,
      },
      {
        name: "Journey 3: Free Discovery -> Paid Premium Conversion",
        summary: `${snapshot.users.length} directory accounts -> ${snapshot.activePaidSubs.length} active paid Premium memberships`,
      },
      {
        name: "Journey 4: Referral Share -> OTP Verification -> Points Redemption",
        summary: `${snapshot.referralsCurrent.length} attributed -> ${snapshot.successfulReferralsCurrent.length} OTP-verified -> ${snapshot.cpRedemptionsCurrent.length} perk redemptions`,
      },
    ];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Layers size={18} style={{ color: "var(--accent-lavender)" }} />
            <h2 style={{ margin: 0, fontSize: 17, color: "var(--text-main)" }}>
              Section 17: Product Performance & Real Feature Usage
            </h2>
          </div>
          <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--text-secondary)" }}>
            Aligned strictly with NobleBond mobile modules (`src/features/*`) and core dating &
            monetization journeys.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(235px, 1fr))",
              gap: 12,
              marginBottom: 18,
            }}
          >
            {mobileFeatures.map((item) => (
              <button
                key={item.feature}
                type="button"
                onClick={() =>
                  onDrilldown({
                    title: item.feature,
                    subtitle: `Mobile Feature Modules: ${item.dir}`,
                    sourceModuleLabel: item.feature,
                    targetRoute: item.route,
                    rows: [
                      { label: "Measured Adoption Volume", value: item.metric },
                      { label: "App Feature Directories", value: item.dir },
                    ],
                    methodologyNote:
                      "Directly reflects activity synced from verified backend/storage records.",
                  })
                }
                style={{
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  borderRadius: 12,
                  padding: 13,
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-main)" }}>
                  {item.feature}
                </div>
                <div style={{ fontSize: 11, color: "var(--accent-lavender)", margin: "3px 0 6px" }}>
                  features: {item.dir}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
                  {item.metric}
                </div>
              </button>
            ))}
          </div>

          <h4 style={{ margin: "0 0 10px", fontSize: 14, color: "var(--text-main)" }}>
            4 End-to-End NobleBond Core Journeys
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {fourJourneys.map((j) => (
              <div
                key={j.name}
                style={{
                  padding: "11px 14px",
                  borderRadius: 12,
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)" }}>{j.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 3 }}>
                  {j.summary}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 18. Platform Performance & Reliability
  const streamHealthyPct =
    snapshot.streamHealth.length > 0
      ? (snapshot.streamHealth.filter((s) => s.status === "healthy").length /
          snapshot.streamHealth.length) *
        100
      : 100;
  const meanStreamLatency =
    snapshot.streamHealth.length > 0
      ? Math.round(
          snapshot.streamHealth.reduce((s, sh) => s + sh.latencyMs, 0) /
            snapshot.streamHealth.length
        )
      : 0;
  const meanCallLatency =
    snapshot.callsCurrent.length > 0
      ? Math.round(
          snapshot.callsCurrent.reduce((s, c) => s + c.avgLatencyMs, 0) /
            snapshot.callsCurrent.length
        )
      : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Server size={18} style={{ color: "var(--status-success)" }} />
          <h2 style={{ margin: 0, fontSize: 17, color: "var(--text-main)" }}>
            Section 18: Platform Performance, Streaming QoS & Infrastructure Honesty
          </h2>
        </div>
        <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--text-secondary)" }}>
          Separates genuinely measured media/call transport telemetry from uninstrumented server or
          native device telemetry.
        </p>

        {/* Measured Transport Telemetry */}
        <h4 style={{ margin: "0 0 10px", fontSize: 14, color: "var(--text-main)" }}>
          Measured Client & Media Transport Health
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: 12,
            marginBottom: 18,
          }}
        >
          {[
            {
              title: "Live Stream Health Rate",
              val: formatPercent(streamHealthyPct),
              detail: `${snapshot.streamHealth.length} monitored streams (Agora / LiveKit)`,
            },
            {
              title: "Mean Live Stream Latency",
              val: `${meanStreamLatency} ms`,
              detail: "Measured across stream QoS telemetry",
            },
            {
              title: "Mean Call Round-Trip Latency",
              val: `${meanCallLatency} ms`,
              detail: `From ${snapshot.callsCurrent.length} voice/video call logs`,
            },
            {
              title: "Optimal Chat Channel Health",
              val:
                snapshot.convosCurrent.length > 0
                  ? formatPercent(
                      (snapshot.convosCurrent.filter((c) => c.deliveryHealth === "optimal").length /
                        snapshot.convosCurrent.length) *
                        100
                    )
                  : "100%",
              detail: "Measured conversation transport status",
            },
          ].map((m) => (
            <div
              key={m.title}
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
                borderRadius: 12,
                padding: 13,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "var(--status-success)" }}>
                <CheckCircle2 size={13} />
                {m.title}
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-main)", margin: "4px 0" }}>
                {m.val}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{m.detail}</div>
            </div>
          ))}
        </div>

        {/* Uninstrumented Infrastructure Telemetry — Explicitly Marked Unavailable */}
        <h4 style={{ margin: "0 0 10px", fontSize: 14, color: "var(--text-main)" }}>
          Infrastructure & Crash Telemetry Pending Instrumentation
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 12,
          }}
        >
          {[
            {
              name: "Server CPU / RAM / Container Load",
              reason: "Requires backend APM exporter (Prometheus / Datadog)",
            },
            {
              name: "99.9% API Uptime & HTTP 5xx Rate",
              reason: "Requires API gateway observability stream",
            },
            {
              name: "Mobile App Cold Startup & ANR Time",
              reason: "Requires Sentry / Firebase Performance SDK",
            },
            {
              name: "iOS / Android Crash-Free Session Rate",
              reason: "Requires mobile Crashlytics webhook feed",
            },
          ].map((unavail) => (
            <div
              key={unavail.name}
              style={{
                padding: 13,
                borderRadius: 12,
                background: "var(--bg-surface-elevated)",
                border: "1px dashed var(--border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "var(--text-main)" }}>
                <AlertCircle size={14} style={{ color: "var(--status-warning)" }} />
                {unavail.name}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", margin: "6px 0 3px" }}>
                Unavailable in Frontend-Only Build
              </div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{unavail.reason}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 14,
            padding: 11,
            borderRadius: 10,
            background: "var(--status-info-bg)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            color: "var(--text-main)",
          }}
        >
          <Info size={15} style={{ color: "var(--status-info)", flexShrink: 0 }} />
          <span>
            NobleBond Admin strictly avoids inventing CPU percentages, memory bars, or crash-free
            figures before server probes are wired.
          </span>
        </div>
      </div>
    </div>
  );
};

