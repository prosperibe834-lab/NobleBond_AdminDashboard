// NobleBond Admin — User & Account Reports Section
// Specialized account integrity and impersonation triage with User Management cross-links, zero emojis

import React, { useState } from "react";
import {
  ExternalLink,
  Search,
} from "lucide-react";
import type { UnifiedReportRecord } from "../../types/reportsModeration.types";

interface UserReportsSectionProps {
  reports: UnifiedReportRecord[];
  onOpenReport: (report: UnifiedReportRecord) => void;
  onOpenUserProfile?: (userId: string) => void;
  onReferToUserManagement?: (userId: string) => void;
}

const USER_CATEGORIES = [
  { label: "All Account Incidents", value: "all" },
  { label: "Fake Accounts", value: "fake_account" },
  { label: "Impersonation", value: "impersonation" },
  { label: "Fraudulent Activity", value: "fraudulent_activity" },
  { label: "Scams", value: "scam" },
  { label: "Harassment", value: "harassment" },
  { label: "Threats & Bullying", value: "threats" },
  { label: "Spam Bots", value: "spam" },
];

export const UserReportsSection: React.FC<UserReportsSectionProps> = ({
  reports,
  onOpenReport,
  onOpenUserProfile,
  onReferToUserManagement,
}) => {
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all");
  const [localQuery, setLocalQuery] = useState<string>("");

  const userReports = reports.filter((r) => r.domain === "user");

  const filtered = userReports.filter((r) => {
    const matchesCategory =
      selectedSubCategory === "all" || r.category === selectedSubCategory;
    const matchesSearch =
      !localQuery.trim() ||
      r.id.toLowerCase().includes(localQuery.toLowerCase()) ||
      r.reportedUser.name.toLowerCase().includes(localQuery.toLowerCase()) ||
      r.reportedUser.username.toLowerCase().includes(localQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(localQuery.toLowerCase());
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
          {USER_CATEGORIES.map((cat) => {
            const isSelected = selectedSubCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedSubCategory(cat.value)}
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
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search account reports..."
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
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Reported Account</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Allegation & Category</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Priority</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Assigned To</th>
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
                    No account-level reports found matching this criteria.
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

                      <td style={{ padding: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <img
                            src={report.reporter.avatar}
                            alt={report.reporter.name}
                            style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }}
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

                      <td style={{ padding: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <img
                            src={report.reportedUser.avatar}
                            alt={report.reportedUser.name}
                            style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: "var(--text-main)", display: "flex", alignItems: "center", gap: "4px" }}>
                              <span>{report.reportedUser.name}</span>
                              {onOpenUserProfile && (
                                <button
                                  onClick={() => onOpenUserProfile(report.reportedUser.id)}
                                  title="View User Dossier"
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
                            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                              {report.reportedUser.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: "14px" }}>
                        <div style={{ fontWeight: 600, color: "var(--text-main)", textTransform: "capitalize" }}>
                          {report.category.replace(/_/g, " ")}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "var(--text-secondary)",
                            maxWidth: "280px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {report.description}
                        </div>
                      </td>

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

                      <td style={{ padding: "14px", fontSize: "12px", color: "var(--text-main)" }}>
                        {report.assignedModerator || (
                          <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
                            Unassigned
                          </span>
                        )}
                      </td>

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

                      <td style={{ padding: "14px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "6px" }}>
                          {onReferToUserManagement && (
                            <button
                              onClick={() => onReferToUserManagement(report.reportedUser.id)}
                              title="Refer to User Management module"
                              style={{
                                padding: "6px 10px",
                                borderRadius: "8px",
                                border: "1px solid var(--border)",
                                backgroundColor: "var(--bg-secondary)",
                                color: "var(--text-main)",
                                fontSize: "11.5px",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              User Center
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
