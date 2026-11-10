// NobleBond Admin — Moderation Overview Dashboard Section
// Priority triage queue, recent filings, operational performance, and activity ledger, zero emojis

import React from "react";
import {
  Flame,
  Clock,
  Activity,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  ShieldAlert,
  BarChart3,
  Calendar,
} from "lucide-react";
import type {
  UnifiedReportRecord,
  ModerationHistoryEvent,
  ModerationStatsKpis,
} from "../../types/reportsModeration.types";

interface ModerationOverviewSectionProps {
  reports: UnifiedReportRecord[];
  history: ModerationHistoryEvent[];
  kpis: ModerationStatsKpis;
  onOpenReport: (report: UnifiedReportRecord) => void;
  onSelectTab: (tabId: string) => void;
  onFilterPriority?: (priority: string) => void;
  onFilterStatus?: (status: string) => void;
}

export const ModerationOverviewSection: React.FC<ModerationOverviewSectionProps> = ({
  reports,
  history,
  kpis,
  onOpenReport,
  onSelectTab,
  onFilterPriority,
  onFilterStatus,
}) => {
  // Urgent unresolved cases (critical or high priority and not resolved/dismissed)
  const priorityReports = reports
    .filter(
      (r) =>
        (r.priority === "critical" || r.priority === "high") &&
        r.status !== "resolved" &&
        r.status !== "dismissed"
    )
    .slice(0, 5);

  // Recent 5 reports
  const recentReports = [...reports]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  // Recent 6 moderation actions
  const recentActivity = history.slice(0, 6);

  // Category counts for SVG chart
  const categoryCounts: Record<string, number> = {};
  reports.forEach((r) => {
    const key = r.category.replace(/_/g, " ");
    categoryCounts[key] = (categoryCounts[key] || 0) + 1;
  });
  const sortedCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxCategoryCount = Math.max(1, ...sortedCategories.map((c) => c[1]));

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "critical":
        return { bg: "rgba(220, 38, 38, 0.12)", color: "#DC2626", border: "#F87171" };
      case "high":
        return { bg: "rgba(234, 88, 12, 0.12)", color: "#EA580C", border: "#FB923C" };
      case "medium":
        return { bg: "rgba(217, 119, 6, 0.12)", color: "#D97706", border: "#FBBF24" };
      default:
        return { bg: "rgba(107, 114, 128, 0.12)", color: "#4B5563", border: "#D1D5DB" };
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "resolved":
        return { bg: "rgba(16, 185, 129, 0.12)", color: "var(--status-success)" };
      case "under_review":
        return { bg: "rgba(59, 130, 246, 0.12)", color: "#2563EB" };
      case "escalated":
        return { bg: "rgba(147, 51, 234, 0.12)", color: "#9333EA" };
      case "dismissed":
        return { bg: "rgba(107, 114, 128, 0.12)", color: "#6B7280" };
      default:
        return { bg: "rgba(245, 158, 11, 0.12)", color: "#D97706" };
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
      {/* Quick Action Navigation Strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "10px",
        }}
      >
        <button
          onClick={() => onSelectTab("all_reports")}
          style={{
            padding: "12px 14px",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--bg-card)",
            color: "var(--text-main)",
            fontSize: "12.5px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "all 0.15s ease",
          }}
        >
          <span>Open All Reports</span>
          <ArrowRight size={14} color="var(--primary)" />
        </button>

        <button
          onClick={() => {
            onSelectTab("all_reports");
            onFilterPriority?.("critical");
          }}
          style={{
            padding: "12px 14px",
            borderRadius: "12px",
            border: "1px solid rgba(220, 38, 38, 0.25)",
            backgroundColor: "rgba(220, 38, 38, 0.05)",
            color: "#DC2626",
            fontSize: "12.5px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "all 0.15s ease",
          }}
        >
          <span>Critical Caseload ({kpis.criticalReports})</span>
          <Flame size={14} />
        </button>

        <button
          onClick={() => {
            onSelectTab("all_reports");
            onFilterStatus?.("pending");
          }}
          style={{
            padding: "12px 14px",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--bg-card)",
            color: "var(--text-main)",
            fontSize: "12.5px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "all 0.15s ease",
          }}
        >
          <span>Review Pending ({kpis.pendingReports})</span>
          <Clock size={14} color="#EA580C" />
        </button>

        <button
          onClick={() => onSelectTab("appeals")}
          style={{
            padding: "12px 14px",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--bg-card)",
            color: "var(--text-main)",
            fontSize: "12.5px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "all 0.15s ease",
          }}
        >
          <span>View Appeals ({kpis.pendingAppeals})</span>
          <ArrowRight size={14} color="#0891B2" />
        </button>

        <button
          onClick={() => onSelectTab("history")}
          style={{
            padding: "12px 14px",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--bg-card)",
            color: "var(--text-main)",
            fontSize: "12.5px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "all 0.15s ease",
          }}
        >
          <span>Moderation Audit Trail</span>
          <Activity size={14} color="var(--text-muted)" />
        </button>
      </div>

      {/* Row 1: Priority Reports & Moderation Performance */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "18px",
        }}
      >
        {/* Panel A: Priority Reports */}
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(220, 38, 38, 0.12)",
                  color: "#DC2626",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Flame size={15} />
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "var(--text-main)",
                }}
              >
                Urgent Priority Queue
              </h3>
            </div>
            <button
              onClick={() => {
                onSelectTab("all_reports");
                onFilterPriority?.("critical");
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary)",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              View All ({priorityReports.length})
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {priorityReports.length === 0 ? (
              <div
                style={{
                  padding: "24px",
                  textAlign: "center",
                  color: "var(--text-muted)",
                  fontSize: "13px",
                }}
              >
                No urgent priority reports pending resolution.
              </div>
            ) : (
              priorityReports.map((r) => {
                const pStyle = getPriorityStyle(r.priority);
                const sStyle = getStatusStyle(r.status);
                return (
                  <div
                    key={r.id}
                    onClick={() => onOpenReport(r)}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--bg-secondary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = pStyle.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                      <img
                        src={r.reportedUser.avatar}
                        alt={r.reportedUser.name}
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span
                            style={{
                              fontSize: "11px",
                              fontFamily: "monospace",
                              fontWeight: 700,
                              color: "var(--text-secondary)",
                            }}
                          >
                            {r.id}
                          </span>
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              padding: "1px 6px",
                              borderRadius: "4px",
                              backgroundColor: pStyle.bg,
                              color: pStyle.color,
                            }}
                          >
                            {r.priority}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "var(--text-main)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {r.reportedUser.name} &bull; {r.category.replace(/_/g, " ")}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: "10px",
                          backgroundColor: sStyle.bg,
                          color: sStyle.color,
                          textTransform: "capitalize",
                        }}
                      >
                        {r.status.replace("_", " ")}
                      </span>
                      <ExternalLink size={14} color="var(--text-muted)" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Panel F: Moderation Performance Metrics */}
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "var(--shadow-sm)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                backgroundColor: "rgba(16, 185, 129, 0.12)",
                color: "var(--status-success)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingUp size={15} />
            </div>
            <h3
              style={{
                margin: 0,
                fontSize: "15px",
                fontWeight: 700,
                color: "var(--text-main)",
              }}
            >
              Moderation Operational Velocity
            </h3>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <div
              style={{
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                Resolved Volume
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "var(--text-main)",
                  marginTop: "4px",
                }}
              >
                {kpis.resolvedReports} cases
              </div>
              <div style={{ fontSize: "11px", color: "var(--status-success)", marginTop: "2px" }}>
                Active enforcement cycle
              </div>
            </div>

            <div
              style={{
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                Avg Resolution Time
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "var(--text-main)",
                  marginTop: "4px",
                }}
              >
                {kpis.avgResolutionTimeHours} hrs
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                Target: &lt; 4 hours
              </div>
            </div>

            <div
              style={{
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                Escalation Rate
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "#9333EA",
                  marginTop: "4px",
                }}
              >
                {kpis.escalationRatePercent}%
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                Senior Trust & Legal
              </div>
            </div>

            <div
              style={{
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                Pending Intake
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "#EA580C",
                  marginTop: "4px",
                }}
              >
                {kpis.pendingReports} cases
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                Under review: {kpis.underReviewReports}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              backgroundColor: "rgba(139, 29, 65, 0.06)",
              border: "1px solid rgba(139, 29, 65, 0.18)",
              fontSize: "12px",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <ShieldAlert size={16} color="var(--primary)" />
            <span>
              All moderation decisions append immutable records to the compliance ledger.
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Reports by Category & Recent Moderation Activity */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "18px",
        }}
      >
        {/* Panel D: Reports by Category Distribution */}
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
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                backgroundColor: "rgba(99, 102, 241, 0.12)",
                color: "#6366F1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BarChart3 size={15} />
            </div>
            <h3
              style={{
                margin: 0,
                fontSize: "15px",
                fontWeight: 700,
                color: "var(--text-main)",
              }}
            >
              Incident Distribution by Category
            </h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {sortedCategories.map(([catName, count], idx) => {
              const pct = Math.round((count / maxCategoryCount) * 100);
              return (
                <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "12px",
                      color: "var(--text-main)",
                    }}
                  >
                    <span style={{ textTransform: "capitalize", fontWeight: 600 }}>
                      {catName}
                    </span>
                    <span style={{ color: "var(--text-muted)", fontWeight: 700 }}>
                      {count} cases
                    </span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "6px",
                      borderRadius: "3px",
                      backgroundColor: "var(--bg-secondary)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        backgroundColor:
                          idx === 0
                            ? "#DC2626"
                            : idx === 1
                            ? "#EA580C"
                            : idx === 2
                            ? "#D97706"
                            : "var(--primary)",
                        borderRadius: "3px",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel C: Moderation Activity Stream */}
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(139, 29, 65, 0.12)",
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Activity size={15} />
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "var(--text-main)",
                }}
              >
                Recent Moderator Actions
              </h3>
            </div>
            <button
              onClick={() => onSelectTab("history")}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary)",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Full Log →
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {recentActivity.map((evt) => (
              <div
                key={evt.id}
                style={{
                  padding: "10px 12px",
                  borderRadius: "10px",
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <img
                  src={evt.targetUser.avatar}
                  alt={evt.targetUser.name}
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "var(--text-main)",
                        textTransform: "capitalize",
                      }}
                    >
                      {evt.actionType.replace(/_/g, " ")}
                    </span>
                    <span
                      style={{
                        fontSize: "10.5px",
                        color: "var(--text-muted)",
                      }}
                    >
                      {new Date(evt.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "11.5px",
                      color: "var(--text-secondary)",
                      marginTop: "1px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {evt.targetUser.name} &bull; {evt.reason}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "var(--text-muted)",
                      marginTop: "2px",
                    }}
                  >
                    Handled by {evt.moderator}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Recent Reports Queue Table */}
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                backgroundColor: "rgba(139, 29, 65, 0.12)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Calendar size={15} />
            </div>
            <h3
              style={{
                margin: 0,
                fontSize: "15px",
                fontWeight: 700,
                color: "var(--text-main)",
              }}
            >
              Recently Filed Reports
            </h3>
          </div>
          <button
            onClick={() => onSelectTab("all_reports")}
            style={{
              background: "none",
              border: "none",
              color: "var(--primary)",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Go to All Reports Table ({reports.length}) →
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: "13px",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)" }}>
                <th style={{ padding: "10px 12px", fontWeight: 600 }}>Case ID</th>
                <th style={{ padding: "10px 12px", fontWeight: 600 }}>Reporter</th>
                <th style={{ padding: "10px 12px", fontWeight: 600 }}>Reported Target</th>
                <th style={{ padding: "10px 12px", fontWeight: 600 }}>Category</th>
                <th style={{ padding: "10px 12px", fontWeight: 600 }}>Priority</th>
                <th style={{ padding: "10px 12px", fontWeight: 600 }}>Status</th>
                <th style={{ padding: "10px 12px", fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((r) => {
                const pStyle = getPriorityStyle(r.priority);
                const sStyle = getStatusStyle(r.status);
                return (
                  <tr
                    key={r.id}
                    style={{
                      borderBottom: "1px solid var(--border)",
                      transition: "background-color 0.12s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <td style={{ padding: "12px", fontFamily: "monospace", fontWeight: 700 }}>
                      {r.id}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <img
                          src={r.reporter.avatar}
                          alt={r.reporter.name}
                          style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" }}
                        />
                        <span>{r.reporter.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <img
                          src={r.reportedUser.avatar}
                          alt={r.reportedUser.name}
                          style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" }}
                        />
                        <span>{r.reportedUser.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px", textTransform: "capitalize" }}>
                      {r.category.replace(/_/g, " ")}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          padding: "2px 7px",
                          borderRadius: "4px",
                          backgroundColor: pStyle.bg,
                          color: pStyle.color,
                        }}
                      >
                        {r.priority}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: "10px",
                          backgroundColor: sStyle.bg,
                          color: sStyle.color,
                          textTransform: "capitalize",
                        }}
                      >
                        {r.status.replace("_", " ")}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <button
                        onClick={() => onOpenReport(r)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: "6px",
                          border: "1px solid var(--border)",
                          backgroundColor: "var(--bg-card)",
                          color: "var(--text-main)",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Investigate
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
