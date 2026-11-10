// NobleBond Admin — Live & Streaming Reports Section
// Real-time broadcast room, host, and audience safety triage with Live Management cross-links, zero emojis

import React, { useState } from "react";
import {
  Radio,
  RadioTower,
  ExternalLink,
  Search,
} from "lucide-react";
import type { UnifiedReportRecord } from "../../types/reportsModeration.types";

interface LiveReportsSectionProps {
  reports: UnifiedReportRecord[];
  onOpenReport: (report: UnifiedReportRecord) => void;
  onOpenLiveManagement?: (sessionId: string) => void;
}

const LIVE_CATEGORIES = [
  { label: "All Live Incidents", value: "all" },
  { label: "Inappropriate Content", value: "inappropriate_live_content" },
  { label: "Live Harassment", value: "live_harassment" },
  { label: "Live Scams & Solicitations", value: "live_scams" },
  { label: "Inappropriate Comments", value: "inappropriate_comments" },
  { label: "Dangerous Behaviour", value: "dangerous_behaviour" },
];

export const LiveReportsSection: React.FC<LiveReportsSectionProps> = ({
  reports,
  onOpenReport,
  onOpenLiveManagement,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [localSearch, setLocalSearch] = useState<string>("");

  const liveReports = reports.filter((r) => r.domain === "live");

  const filtered = liveReports.filter((r) => {
    const matchesCategory =
      selectedCategory === "all" || r.category === selectedCategory;
    const matchesSearch =
      !localSearch.trim() ||
      r.id.toLowerCase().includes(localSearch.toLowerCase()) ||
      r.reportedUser.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      r.description.toLowerCase().includes(localSearch.toLowerCase()) ||
      (r.relatedEntityTitle && r.relatedEntityTitle.toLowerCase().includes(localSearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "critical":
        return { bg: "rgba(220, 38, 38, 0.12)", color: "#DC2626" };
      case "high":
        return { bg: "rgba(234, 88, 12, 0.12)", color: "#EA580C" };
      case "medium":
        return { bg: "rgba(217, 119, 6, 0.12)", color: "#D97706" };
      default:
        return { bg: "rgba(107, 114, 128, 0.12)", color: "#4B5563" };
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
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {/* Category Pills & Local Filter Strip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          padding: "14px 18px",
          backgroundColor: "var(--bg-card)",
          borderRadius: "14px",
          border: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {LIVE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: isSelected
                    ? "1px solid var(--primary, #8B1D41)"
                    : "1px solid var(--border)",
                  backgroundColor: isSelected
                    ? "rgba(139, 29, 65, 0.08)"
                    : "var(--bg-secondary)",
                  color: isSelected ? "var(--primary)" : "var(--text-secondary)",
                  fontSize: "12px",
                  fontWeight: isSelected ? 700 : 500,
                  cursor: "pointer",
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "var(--bg-secondary)",
            padding: "6px 12px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            width: "240px",
          }}
        >
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search live stream reports..."
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-main)",
              fontSize: "12px",
              width: "100%",
            }}
          />
        </div>
      </div>

      {/* Reports Table */}
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          boxShadow: "var(--shadow-sm)",
          overflow: "hidden",
        }}
      >
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
              <tr
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderBottom: "1px solid var(--border)",
                  color: "var(--text-muted)",
                }}
              >
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Case ID</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Reporter</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Reported Target</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Broadcast Room</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Incident Category</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Priority</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Status</th>
                <th style={{ padding: "12px 14px", fontWeight: 600, textAlign: "right" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>
                    No live streaming safety reports found matching this criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((report) => {
                  const pStyle = getPriorityStyle(report.priority);
                  const sStyle = getStatusStyle(report.status);

                  return (
                    <tr
                      key={report.id}
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
                      <td style={{ padding: "14px", fontFamily: "monospace", fontWeight: 700 }}>
                        {report.id}
                      </td>

                      {/* Reporter */}
                      <td style={{ padding: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <img
                            src={report.reporter.avatar}
                            alt={report.reporter.name}
                            style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: "var(--text-main)" }}>
                              {report.reporter.name}
                            </div>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                              {report.reporter.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Reported Target */}
                      <td style={{ padding: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <img
                            src={report.reportedUser.avatar}
                            alt={report.reportedUser.name}
                            style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: "var(--text-main)" }}>
                              {report.reportedUser.name}
                            </div>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                              {report.reportedUser.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Broadcast Room */}
                      <td style={{ padding: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Radio size={13} color="#EF4444" style={{ flexShrink: 0 }} />
                          <div style={{ maxWidth: "200px" }}>
                            <div
                              style={{
                                fontSize: "12.5px",
                                fontWeight: 600,
                                color: "var(--text-main)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {report.relatedEntityTitle || "Live Stream Room"}
                            </div>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace" }}>
                              {report.relatedEntityId}
                            </div>
                          </div>
                          {onOpenLiveManagement && report.relatedEntityId && (
                            <button
                              onClick={() => onOpenLiveManagement(report.relatedEntityId!)}
                              title="Inspect live session in Live Management"
                              style={{
                                background: "none",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                                color: "var(--text-muted)",
                                display: "inline-flex",
                              }}
                            >
                              <ExternalLink size={11} />
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Incident Category */}
                      <td style={{ padding: "14px" }}>
                        <div style={{ fontWeight: 600, color: "var(--text-main)", textTransform: "capitalize" }}>
                          {report.category.replace(/_/g, " ")}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "var(--text-secondary)",
                            maxWidth: "240px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {report.description}
                        </div>
                      </td>

                      {/* Priority */}
                      <td style={{ padding: "14px" }}>
                        <span
                          style={{
                            padding: "2px 7px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            backgroundColor: pStyle.bg,
                            color: pStyle.color,
                          }}
                        >
                          {report.priority}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "14px" }}>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: "10px",
                            fontSize: "11px",
                            fontWeight: 600,
                            backgroundColor: sStyle.bg,
                            color: sStyle.color,
                            textTransform: "capitalize",
                          }}
                        >
                          {report.status.replace("_", " ")}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "14px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "6px" }}>
                          {onOpenLiveManagement && (
                            <button
                              onClick={() => onOpenLiveManagement(report.relatedEntityId || "live")}
                              title="Open Live Operations Center"
                              style={{
                                padding: "6px 10px",
                                borderRadius: "8px",
                                border: "1px solid var(--border)",
                                backgroundColor: "var(--bg-secondary)",
                                color: "var(--text-main)",
                                fontSize: "11.5px",
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <RadioTower size={12} /> Live
                            </button>
                          )}
                          <button
                            onClick={() => onOpenReport(report)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "8px",
                              border: "none",
                              backgroundColor: "var(--primary, #8B1D41)",
                              color: "#FFFFFF",
                              fontSize: "12px",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            Investigate
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
