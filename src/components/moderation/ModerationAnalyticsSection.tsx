// NobleBond Admin — Moderation Analytics & Workload Intelligence Section
// Real-time telemetry, caseload velocity, moderator workloads, repeat offender tracking, zero emojis

import React, { useState } from "react";
import {
  TrendingUp,
  BarChart3,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import type {
  UnifiedReportRecord,
  ModerationActionRecord,
  AppealRecord,
  ModeratorWorkload,
} from "../../types/reportsModeration.types";
import { loadModeratorWorkloads } from "../../data/reportsModerationDataService";

interface ModerationAnalyticsSectionProps {
  reports: UnifiedReportRecord[];
  actions: ModerationActionRecord[];
  appeals: AppealRecord[];
}

export const ModerationAnalyticsSection: React.FC<ModerationAnalyticsSectionProps> = ({
  reports,
  actions,
  appeals,
}) => {
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d">("7d");
  const workloads: ModeratorWorkload[] = loadModeratorWorkloads();

  // Metrics calculation
  const total = reports.length;
  const resolved = reports.filter((r) => r.status === "resolved").length;
  const dismissed = reports.filter((r) => r.status === "dismissed").length;
  const escalated = reports.filter((r) => r.status === "escalated").length;
  const critical = reports.filter((r) => r.priority === "critical").length;

  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const dismissalRate = total > 0 ? Math.round((dismissed / total) * 100) : 0;
  const escalationRate = total > 0 ? Math.round((escalated / total) * 100) : 0;

  // Domain breakdown
  const domainCounts = {
    user: reports.filter((r) => r.domain === "user").length,
    profile: reports.filter((r) => r.domain === "profile").length,
    chat: reports.filter((r) => r.domain === "chat").length,
    live: reports.filter((r) => r.domain === "live").length,
  };

  // Repeat reported users
  const userReportCounts: Record<string, { user: UnifiedReportRecord["reportedUser"]; count: number }> = {};
  reports.forEach((r) => {
    const id = r.reportedUser.id;
    if (!userReportCounts[id]) {
      userReportCounts[id] = { user: r.reportedUser, count: 0 };
    }
    userReportCounts[id].count += 1;
  });
  const repeatOffenders = Object.values(userReportCounts)
    .filter((u) => u.count > 1)
    .sort((a, b) => b.count - a.count);

  // SVG Trend Points
  const trendPoints =
    timeframe === "7d"
      ? [
          { label: "Mon", count: 4 },
          { label: "Tue", count: 7 },
          { label: "Wed", count: 5 },
          { label: "Thu", count: 9 },
          { label: "Fri", count: 6 },
          { label: "Sat", count: 11 },
          { label: "Sun", count: 8 },
        ]
      : [
          { label: "W1", count: 24 },
          { label: "W2", count: 38 },
          { label: "W3", count: 31 },
          { label: "W4", count: 45 },
        ];

  const maxTrend = Math.max(...trendPoints.map((p) => p.count), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
      {/* Timeframe Selector & Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          padding: "16px 20px",
          backgroundColor: "var(--bg-card)",
          borderRadius: "16px",
          border: "1px solid var(--border)",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: "16px",
              fontWeight: 800,
              color: "var(--text-main)",
            }}
          >
            Trust & Safety Analytics Intelligence
          </h3>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: "12.5px",
              color: "var(--text-secondary)",
            }}
          >
            Platform safety velocity, staff caseload throughput, and repeat risk telemetry.
          </p>
        </div>

        <div style={{ display: "flex", gap: "6px" }}>
          {(["7d", "30d", "90d"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                border: timeframe === t ? "1px solid var(--primary, #8B1D41)" : "1px solid var(--border)",
                backgroundColor: timeframe === t ? "rgba(139, 29, 65, 0.08)" : "var(--bg-secondary)",
                color: timeframe === t ? "var(--primary)" : "var(--text-secondary)",
                fontSize: "12px",
                fontWeight: timeframe === t ? 700 : 500,
                cursor: "pointer",
                textTransform: "uppercase",
              }}
            >
              {t === "7d" ? "7 Days" : t === "30d" ? "30 Days" : "90 Days"}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "14px",
        }}
      >
        <div
          style={{
            padding: "16px",
            borderRadius: "14px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
            Resolution Efficacy
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--status-success)", marginTop: "4px" }}>
            {resolutionRate}%
          </div>
          <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "2px" }}>
            {resolved} out of {total} closed
          </div>
        </div>

        <div
          style={{
            padding: "16px",
            borderRadius: "14px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
            Dismissal Rate
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#6B7280", marginTop: "4px" }}>
            {dismissalRate}%
          </div>
          <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "2px" }}>
            {dismissed} unverified allegations
          </div>
        </div>

        <div
          style={{
            padding: "16px",
            borderRadius: "14px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
            Critical Caseload
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#DC2626", marginTop: "4px" }}>
            {critical} cases
          </div>
          <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "2px" }}>
            Immediate intervention tier
          </div>
        </div>

        <div
          style={{
            padding: "16px",
            borderRadius: "14px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
            Legal Escalations
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#9333EA", marginTop: "4px" }}>
            {escalationRate}%
          </div>
          <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "2px" }}>
            {escalated} referrals to legal
          </div>
        </div>

        <div
          style={{
            padding: "16px",
            borderRadius: "14px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
            Member Appeals
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#4F46E5", marginTop: "4px" }}>
            {appeals.length}
          </div>
          <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "2px" }}>
            {appeals.filter((a) => a.status === "pending").length} awaiting review
          </div>
        </div>
      </div>

      {/* Row 2: SVG Chart of Incidents Submitted & Domain Distribution */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "18px",
        }}
      >
        {/* Trend SVG Bar Graph */}
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <TrendingUp size={16} color="var(--primary)" />
              <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "var(--text-main)" }}>
                Incident Intake Trend
              </h4>
            </div>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Cases filed per cycle</span>
          </div>

          <div style={{ height: "160px", display: "flex", alignItems: "flex-end", gap: "12px", paddingTop: "20px" }}>
            {trendPoints.map((pt, i) => {
              const hPct = Math.round((pt.count / maxTrend) * 100);
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                    height: "100%",
                    justifyContent: "flex-end",
                  }}
                >
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-main)" }}>
                    {pt.count}
                  </span>
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "32px",
                      height: `${hPct}%`,
                      backgroundColor: "var(--primary, #8B1D41)",
                      borderRadius: "6px 6px 0 0",
                      opacity: 0.85,
                      transition: "height 0.3s ease",
                    }}
                  />
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {pt.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Domain Distribution */}
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <BarChart3 size={16} color="#3B82F6" />
            <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "var(--text-main)" }}>
              Incidents by Platform Domain
            </h4>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div
              style={{
                padding: "12px",
                borderRadius: "10px",
                backgroundColor: "rgba(59, 130, 246, 0.08)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
              }}
            >
              <div style={{ fontSize: "11px", color: "#2563EB", fontWeight: 600 }}>User Accounts</div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>
                {domainCounts.user}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Fake & fraud</div>
            </div>

            <div
              style={{
                padding: "12px",
                borderRadius: "10px",
                backgroundColor: "rgba(139, 92, 246, 0.08)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
              }}
            >
              <div style={{ fontSize: "11px", color: "#8B5CF6", fontWeight: 600 }}>Profiles & Photos</div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>
                {domainCounts.profile}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Media & bios</div>
            </div>

            <div
              style={{
                padding: "12px",
                borderRadius: "10px",
                backgroundColor: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
              }}
            >
              <div style={{ fontSize: "11px", color: "var(--status-success)", fontWeight: 600 }}>Chat Messages</div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>
                {domainCounts.chat}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Harassment & links</div>
            </div>

            <div
              style={{
                padding: "12px",
                borderRadius: "10px",
                backgroundColor: "rgba(220, 38, 38, 0.08)",
                border: "1px solid rgba(220, 38, 38, 0.2)",
              }}
            >
              <div style={{ fontSize: "11px", color: "#DC2626", fontWeight: 600 }}>Live Broadcasts</div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>
                {domainCounts.live}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Rooms & comments</div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Moderator Workload Allocation (Section 15) */}
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "var(--shadow-sm)",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <UserCheck size={16} color="#2563EB" />
            <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "var(--text-main)" }}>
              Moderator Workload & Resolution Capacity
            </h4>
          </div>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            4 Active Staff Members
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "14px",
          }}
        >
          {workloads.map((mod, i) => (
            <div
              key={i}
              style={{
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img
                  src={mod.avatar}
                  alt={mod.name}
                  style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: "13px", color: "var(--text-main)" }}>
                    {mod.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {mod.role}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "6px",
                  paddingTop: "6px",
                  borderTop: "1px solid var(--border)",
                  textAlign: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "var(--text-main)" }}>
                    {mod.assignedCount}
                  </div>
                  <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>Active</div>
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "#DC2626" }}>
                    {mod.highPriorityCount}
                  </div>
                  <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>High Prio</div>
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "var(--status-success)" }}>
                    {mod.resolvedCount}
                  </div>
                  <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>Resolved</div>
                </div>
              </div>

              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                  backgroundColor: "var(--bg-card)",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Avg Response:</span>
                <strong>{mod.avgResolutionTimeHours} hrs</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 4: Repeat Reported Accounts */}
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "var(--shadow-sm)",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <AlertTriangle size={16} color="#DC2626" />
          <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "var(--text-main)" }}>
            Repeat Reported Accounts (High Risk Telemetry)
          </h4>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)", textAlign: "left" }}>
                <th style={{ padding: "10px 12px" }}>Account Member</th>
                <th style={{ padding: "10px 12px" }}>Username</th>
                <th style={{ padding: "10px 12px" }}>Report Incident Count</th>
                <th style={{ padding: "10px 12px" }}>Risk Classification</th>
                <th style={{ padding: "10px 12px" }}>Active Penalties</th>
              </tr>
            </thead>
            <tbody>
              {repeatOffenders.map((off, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <img
                        src={off.user.avatar}
                        alt={off.user.name}
                        style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }}
                      />
                      <span style={{ fontWeight: 700, color: "var(--text-main)" }}>
                        {off.user.name}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "12px", color: "var(--text-muted)" }}>
                    {off.user.username}
                  </td>
                  <td style={{ padding: "12px", fontWeight: 800, color: "#DC2626" }}>
                    {off.count} Reports Filed
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        padding: "2px 7px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 700,
                        backgroundColor: off.count >= 3 ? "rgba(220, 38, 38, 0.12)" : "rgba(234, 88, 12, 0.12)",
                        color: off.count >= 3 ? "#DC2626" : "#EA580C",
                      }}
                    >
                      {off.count >= 3 ? "Severe Recidivism" : "Elevated Risk"}
                    </span>
                  </td>
                  <td style={{ padding: "12px", fontSize: "12px", color: "var(--text-secondary)" }}>
                    {actions.find((a) => a.targetUser.id === off.user.id)?.actionType.replace(/_/g, " ") || "Under Review"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
