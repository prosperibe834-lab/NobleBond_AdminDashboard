import React from "react";
import { Users, UserPlus, Smartphone, Globe, AlertCircle, CheckCircle2 } from "lucide-react";
import type { PlatformAnalyticsSnapshot } from "../../../data/platformAnalyticsDataService";
import type { DrilldownPayload } from "../../../types/analyticsManagement.types";
import { formatPercent } from "../analyticsUiUtils";
import { AnalyticsMetricTooltip } from "../AnalyticsMetricTooltip";

interface UserAndAcquisitionSectionProps {
  snapshot: PlatformAnalyticsSnapshot;
  mode: "user_analytics" | "acquisition_analytics";
  onDrilldown: (payload: DrilldownPayload) => void;
}

const cardStyle: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: 16,
  padding: 18,
  boxShadow: "var(--shadow-sm)",
};

export const UserAndAcquisitionSection: React.FC<UserAndAcquisitionSectionProps> = ({
  snapshot,
  mode,
  onDrilldown,
}) => {
  const totalUsers = snapshot.users.length;
  const suspendedCount = snapshot.users.filter((u) => u.status === "suspended").length;
  const bannedCount = snapshot.users.filter((u) => u.status === "banned").length;
  const pendingVerifCount = snapshot.users.filter((u) => u.status === "pending_verification").length;
  const verifiedUsersCount = snapshot.users.filter(
    (u) => u.verification.status === "verified"
  ).length;
  const premiumUsersCount = snapshot.users.filter((u) => u.premium.isPremium).length;
  const freeUsersCount = totalUsers - premiumUsersCount;
  const completedProfilesCount = snapshot.users.filter(
    (u) => u.profile.completionPercentage >= 80
  ).length;
  const referredUsersCount = snapshot.users.filter((u) => Boolean(u.referral.referredByCode)).length;
  const organicUsersCount = totalUsers - referredUsersCount;

  // Device distribution from registered user.devices
  const androidCount = snapshot.users.filter((u) =>
    u.devices.some((d) => d.platform === "android")
  ).length;
  const iosCount = snapshot.users.filter((u) =>
    u.devices.some((d) => d.platform === "ios")
  ).length;
  const webCount = snapshot.users.filter((u) =>
    u.devices.some((d) => d.platform === "web")
  ).length;

  // Top countries from geographicRows
  const topCountries = snapshot.geographicRows.slice(0, 8);

  if (mode === "user_analytics") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Active vs Excluded Governance Strip */}
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Users size={18} style={{ color: "var(--primary)" }} />
                <h2 style={{ margin: 0, fontSize: 17, color: "var(--text-main)" }}>
                  Section 2: User Analytics & Activity Eligibility
                </h2>
              </div>
              <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--text-secondary)" }}>
                Active user counts strictly exclude suspended and banned accounts and rely solely on
                observed activity timestamps.
              </p>
            </div>
            <AnalyticsMetricTooltip metricId="dau" />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(185px, 1fr))",
              gap: 12,
            }}
          >
            {[
              { label: "Total Scoped Users", val: totalUsers, sub: "Matching active global filters" },
              {
                label: "Window Active Users",
                val: snapshot.activeUsersWindow.length,
                sub: "Eligible accounts only",
              },
              { label: "DAU (Today)", val: snapshot.dauCount, sub: "24h eligible activity" },
              { label: "WAU (7 Days)", val: snapshot.wauCount, sub: "Rolling 7d activity" },
              { label: "MAU (30 Days)", val: snapshot.mauCount, sub: "Rolling 30d activity" },
              {
                label: "Returning (>=24h)",
                val: snapshot.returningUsers.length,
                sub: "Verified repeat sessions",
              },
              {
                label: "Excluded: Suspended/Banned",
                val: suspendedCount + bannedCount,
                sub: `${suspendedCount} suspended • ${bannedCount} banned`,
              },
              {
                label: "Pending Verification",
                val: pendingVerifCount,
                sub: "Awaiting trust clearance",
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  borderRadius: 12,
                  padding: 13,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 23, fontWeight: 800, color: "var(--text-main)", margin: "4px 0" }}>
                  {item.val}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* User Segmentation Matrix & Platform Breakdown */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 16,
          }}
        >
          <div style={cardStyle}>
            <h3 style={{ margin: "0 0 12px", fontSize: 15.5, color: "var(--text-main)" }}>
              Member Segmentation Breakdown
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {[
                {
                  label: "ID / Photo Verified Users",
                  count: verifiedUsersCount,
                  color: "var(--status-success)",
                },
                {
                  label: "Unverified / Pending Verification",
                  count: totalUsers - verifiedUsersCount,
                  color: "var(--status-warning)",
                },
                {
                  label: "Active Premium Subscribers",
                  count: premiumUsersCount,
                  color: "var(--primary)",
                },
                {
                  label: "Free Tier Members",
                  count: freeUsersCount,
                  color: "var(--text-secondary)",
                },
                {
                  label: "Profile Complete (>=80%)",
                  count: completedProfilesCount,
                  color: "var(--status-info)",
                },
                {
                  label: "Referral-Attributed Users",
                  count: referredUsersCount,
                  color: "var(--accent-lavender)",
                },
              ].map((seg) => {
                const pct = totalUsers > 0 ? (seg.count / totalUsers) * 100 : 0;
                return (
                  <div key={seg.label}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 12.5,
                        marginBottom: 4,
                      }}
                    >
                      <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{seg.label}</span>
                      <span style={{ color: "var(--text-secondary)" }}>
                        {seg.count} ({formatPercent(pct)})
                      </span>
                    </div>
                    <div
                      style={{
                        height: 8,
                        borderRadius: 999,
                        background: "var(--bg-surface-elevated)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(100, pct)}%`,
                          height: "100%",
                          background: seg.color,
                          borderRadius: 999,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Smartphone size={17} style={{ color: "var(--accent-lavender)" }} />
              <h3 style={{ margin: 0, fontSize: 15.5, color: "var(--text-main)" }}>
                Client Platform Footprint (Observed Devices)
              </h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { name: "Android Devices", count: androidCount, color: "var(--status-success)" },
                { name: "iOS Devices", count: iosCount, color: "var(--status-info)" },
                { name: "Web / Companion", count: webCount, color: "var(--accent-lavender)" },
              ].map((plat) => {
                const pct = totalUsers > 0 ? (plat.count / totalUsers) * 100 : 0;
                return (
                  <button
                    key={plat.name}
                    type="button"
                    onClick={() =>
                      onDrilldown({
                        title: `${plat.name} Footprint`,
                        subtitle: "Based on registered user device logs in User Management",
                        sourceModuleLabel: "User Management",
                        targetRoute: "/users",
                        rows: [
                          { label: "Users With Platform Device", value: `${plat.count}` },
                          { label: "Share of Filtered Directory", value: formatPercent(pct) },
                        ],
                        methodologyNote:
                          "A user with both iOS and Android devices may appear in multiple device categories.",
                      })
                    }
                    style={{
                      background: "var(--bg-surface-elevated)",
                      border: "1px solid var(--border-light)",
                      borderRadius: 12,
                      padding: 12,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <strong style={{ color: "var(--text-main)" }}>{plat.name}</strong>
                      <span style={{ fontWeight: 700, color: plat.color }}>
                        {plat.count} users ({formatPercent(pct)})
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // mode === "acquisition_analytics"
  const regOtpVerified = snapshot.newUsersCurrent.filter(
    (u) => u.verification.emailVerified || u.verification.phoneVerified
  ).length;
  const regProfileReady = snapshot.newUsersCurrent.filter(
    (u) => u.profile.completionPercentage >= 80
  ).length;
  const regFirstMatchOrLike = snapshot.newUsersCurrent.filter((u) => u.datingStats.likesSent > 0).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <UserPlus size={18} style={{ color: "var(--primary)" }} />
          <h2 style={{ margin: 0, fontSize: 17, color: "var(--text-main)" }}>
            Section 3: Acquisition & Registration Funnel
          </h2>
        </div>
        <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--text-secondary)" }}>
          Separates measured server/account events (registrations, OTP verification, profile setup)
          from uninstrumented pre-registration telemetry.
        </p>

        {/* Honest Pre-Registration Telemetry Notice */}
        <div
          style={{
            padding: 12,
            borderRadius: 12,
            background: "var(--status-warning-bg)",
            border: "1px solid var(--border-light)",
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <AlertCircle size={16} style={{ color: "var(--status-warning)", flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 12, color: "var(--text-main)", lineHeight: 1.5 }}>
            <strong>App Store / Pre-Signup Install Telemetry Unavailable:</strong> Unauthenticated
            app install clicks, store impressions, and attribution SDK ad-spend views are not yet
            connected to NobleBond Admin. Funnel starts at measured backend account creation.
          </div>
        </div>

        {/* Measured Acquisition Split & Registration Funnel */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          <div
            style={{
              background: "var(--bg-surface-elevated)",
              borderRadius: 14,
              padding: 15,
              border: "1px solid var(--border-light)",
            }}
          >
            <h4 style={{ margin: "0 0 12px", fontSize: 14, color: "var(--text-main)" }}>
              Channel Acquisition Mix (All Filtered Accounts)
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "var(--text-secondary)" }}>Organic Direct Signups</span>
                <strong style={{ color: "var(--text-main)" }}>
                  {organicUsersCount} ({totalUsers > 0 ? formatPercent((organicUsersCount / totalUsers) * 100) : "0%"})
                </strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "var(--text-secondary)" }}>Referral-Code Attributed</span>
                <strong style={{ color: "var(--accent-lavender)" }}>
                  {referredUsersCount} ({totalUsers > 0 ? formatPercent((referredUsersCount / totalUsers) * 100) : "0%"})
                </strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "var(--text-secondary)" }}>New Signups in Active Window</span>
                <strong style={{ color: "var(--primary)" }}>{snapshot.newUsersCurrent.length}</strong>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "var(--bg-surface-elevated)",
              borderRadius: 14,
              padding: 15,
              border: "1px solid var(--border-light)",
            }}
          >
            <h4 style={{ margin: "0 0 12px", fontSize: 14, color: "var(--text-main)" }}>
              Measured Window Onboarding Funnel
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {[
                {
                  stage: "1. Pre-Signup Install / Ad Clicks",
                  countText: "Telemetry Unavailable",
                  measured: false,
                },
                {
                  stage: "2. Registered Accounts Created",
                  countText: `${snapshot.newUsersCurrent.length} users (100%)`,
                  measured: true,
                },
                {
                  stage: "3. Email or Phone OTP Verified",
                  countText: `${regOtpVerified} users (${
                    snapshot.newUsersCurrent.length > 0
                      ? formatPercent((regOtpVerified / snapshot.newUsersCurrent.length) * 100)
                      : "0%"
                  })`,
                  measured: true,
                },
                {
                  stage: "4. Completed Profile (>=80%)",
                  countText: `${regProfileReady} users (${
                    snapshot.newUsersCurrent.length > 0
                      ? formatPercent((regProfileReady / snapshot.newUsersCurrent.length) * 100)
                      : "0%"
                  })`,
                  measured: true,
                },
                {
                  stage: "5. Sent >=1 Discovery Like",
                  countText: `${regFirstMatchOrLike} users`,
                  measured: true,
                },
              ].map((step) => (
                <div
                  key={step.stage}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 12.5,
                    padding: "6px 8px",
                    borderRadius: 8,
                    background: step.measured ? "var(--bg-card)" : "transparent",
                  }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-main)" }}>
                    {step.measured ? (
                      <CheckCircle2 size={13} style={{ color: "var(--status-success)" }} />
                    ) : (
                      <AlertCircle size={13} style={{ color: "var(--text-muted)" }} />
                    )}
                    {step.stage}
                  </span>
                  <strong
                    style={{
                      color: step.measured ? "var(--text-main)" : "var(--text-muted)",
                    }}
                  >
                    {step.countText}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Country Acquisition Breakdown */}
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Globe size={18} style={{ color: "var(--status-info)" }} />
          <h3 style={{ margin: 0, fontSize: 16, color: "var(--text-main)" }}>
            Acquisition by Declared Country
          </h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                <th style={{ textAlign: "left", padding: "8px 10px" }}>Country</th>
                <th style={{ textAlign: "right", padding: "8px 10px" }}>Total Users</th>
                <th style={{ textAlign: "right", padding: "8px 10px" }}>New in Window</th>
                <th style={{ textAlign: "right", padding: "8px 10px" }}>Referrals Sent</th>
                <th style={{ textAlign: "right", padding: "8px 10px" }}>Active Users</th>
              </tr>
            </thead>
            <tbody>
              {topCountries.map((row) => (
                <tr key={row.country} style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "9px 10px", fontWeight: 600, color: "var(--text-main)" }}>
                    {row.country}
                  </td>
                  <td style={{ padding: "9px 10px", textAlign: "right" }}>{row.totalUsers}</td>
                  <td style={{ padding: "9px 10px", textAlign: "right", fontWeight: 600, color: "var(--primary)" }}>
                    {row.newRegistrations}
                  </td>
                  <td style={{ padding: "9px 10px", textAlign: "right" }}>{row.referralsCount}</td>
                  <td style={{ padding: "9px 10px", textAlign: "right" }}>{row.activeUsers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

