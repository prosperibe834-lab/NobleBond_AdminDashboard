// NobleBond Admin — All Reports Central Table
// Master safety report ledger with priority indicators, assignment, and triage actions, zero emojis

import React from "react";
import {
  ExternalLink,
  Flame,
  AlertTriangle,
  Clock,
  ArrowUpDown,
  UserCheck,
  User,
  Image as ImageIcon,
  MessageSquare,
  Radio,
} from "lucide-react";
import type {
  UnifiedReportRecord,
  ModerationSortCriteria,
  ModerationSortField,
  ReportDomain,
} from "../../types/reportsModeration.types";

interface AllReportsTableProps {
  reports: UnifiedReportRecord[];
  sort: ModerationSortCriteria;
  onSortChange: (field: ModerationSortField) => void;
  onOpenReport: (report: UnifiedReportRecord) => void;
  onAssignModerator?: (report: UnifiedReportRecord) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const AllReportsTable: React.FC<AllReportsTableProps> = ({
  reports,
  sort,
  onSortChange,
  onOpenReport,
  onAssignModerator,
  onOpenUserProfile,
}) => {
  const getDomainIcon = (domain: ReportDomain) => {
    switch (domain) {
      case "user":
        return <User size={13} color="#3B82F6" />;
      case "profile":
        return <ImageIcon size={13} color="#8B5CF6" />;
      case "chat":
        return <MessageSquare size={13} color="#10B981" />;
      case "live":
        return <Radio size={13} color="#EF4444" />;
      default:
        return <AlertTriangle size={13} color="#F59E0B" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return {
          bg: "rgba(220, 38, 38, 0.12)",
          color: "#DC2626",
          border: "#F87171",
          icon: <Flame size={12} />,
        };
      case "high":
        return {
          bg: "rgba(234, 88, 12, 0.12)",
          color: "#EA580C",
          border: "#FB923C",
          icon: <AlertTriangle size={12} />,
        };
      case "medium":
        return {
          bg: "rgba(217, 119, 6, 0.12)",
          color: "#D97706",
          border: "#FBBF24",
          icon: <Clock size={12} />,
        };
      default:
        return {
          bg: "rgba(107, 114, 128, 0.12)",
          color: "#4B5563",
          border: "#D1D5DB",
          icon: null,
        };
    }
  };

  const getStatusBadge = (status: string) => {
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

  if (reports.length === 0) {
    return (
      <div
        style={{
          padding: "48px 24px",
          textAlign: "center",
          backgroundColor: "var(--bg-card)",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          color: "var(--text-secondary)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)" }}>
          No moderation reports found
        </div>
        <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>
          No records match the current search query or applied filter settings.
        </p>
      </div>
    );
  }

  return (
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
              <th
                onClick={() => onSortChange("submittedAt")}
                style={{
                  padding: "12px 14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span>Case ID</span>
                  <ArrowUpDown size={12} color={sort.field === "submittedAt" ? "var(--primary)" : "currentColor"} />
                </div>
              </th>

              <th style={{ padding: "12px 14px", fontWeight: 600 }}>Reporter</th>
              <th style={{ padding: "12px 14px", fontWeight: 600 }}>Reported Target</th>
              <th style={{ padding: "12px 14px", fontWeight: 600 }}>Category & Domain</th>
              <th style={{ padding: "12px 14px", fontWeight: 600 }}>Content Target</th>

              <th
                onClick={() => onSortChange("priority")}
                style={{
                  padding: "12px 14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span>Priority</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>

              <th style={{ padding: "12px 14px", fontWeight: 600 }}>Status</th>
              <th style={{ padding: "12px 14px", fontWeight: 600 }}>Assigned To</th>

              <th
                onClick={() => onSortChange("submittedAt")}
                style={{
                  padding: "12px 14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span>Submitted</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>

              <th style={{ padding: "12px 14px", fontWeight: 600, textAlign: "right" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => {
              const priorityBadge = getPriorityBadge(report.priority);
              const statusBadge = getStatusBadge(report.status);

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
                  {/* Case ID */}
                  <td style={{ padding: "14px", whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontWeight: 700,
                          fontSize: "12px",
                          color: "var(--text-main)",
                        }}
                      >
                        {report.id}
                      </span>
                    </div>
                  </td>

                  {/* Reporter */}
                  <td style={{ padding: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <img
                        src={report.reporter.avatar}
                        alt={report.reporter.name}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            color: "var(--text-main)",
                            whiteSpace: "nowrap",
                          }}
                        >
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
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <img
                        src={report.reportedUser.avatar}
                        alt={report.reportedUser.name}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            color: "var(--text-main)",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span>{report.reportedUser.name}</span>
                          {onOpenUserProfile && (
                            <button
                              onClick={() => onOpenUserProfile(report.reportedUser.id)}
                              title="View user account profile"
                              style={{
                                background: "none",
                                border: "none",
                                padding: 0,
                                color: "var(--text-muted)",
                                cursor: "pointer",
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

                  {/* Category & Domain */}
                  <td style={{ padding: "14px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "11px",
                          color: "var(--text-secondary)",
                          textTransform: "uppercase",
                          fontWeight: 700,
                        }}
                      >
                        {getDomainIcon(report.domain)}
                        <span>{report.domain}</span>
                      </div>
                      <span
                        style={{
                          fontWeight: 600,
                          color: "var(--text-main)",
                          textTransform: "capitalize",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {report.category.replace(/_/g, " ")}
                      </span>
                    </div>
                  </td>

                  {/* Content Target */}
                  <td style={{ padding: "14px" }}>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 600,
                        backgroundColor: "var(--bg-secondary)",
                        border: "1px solid var(--border)",
                        color: "var(--text-secondary)",
                        textTransform: "capitalize",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {report.contentType.replace(/_/g, " ")}
                    </span>
                  </td>

                  {/* Priority */}
                  <td style={{ padding: "14px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "3px 8px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        backgroundColor: priorityBadge.bg,
                        color: priorityBadge.color,
                        border: `1px solid ${priorityBadge.border}`,
                      }}
                    >
                      {priorityBadge.icon}
                      <span>{report.priority}</span>
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ padding: "14px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 9px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 600,
                        textTransform: "capitalize",
                        backgroundColor: statusBadge.bg,
                        color: statusBadge.color,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {report.status.replace("_", " ")}
                    </span>
                  </td>

                  {/* Assigned Moderator */}
                  <td style={{ padding: "14px" }}>
                    {report.assignedModerator ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "12px",
                          color: "var(--text-main)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <UserCheck size={13} color="#2563EB" />
                        <span>{report.assignedModerator}</span>
                      </div>
                    ) : (
                      <span
                        style={{
                          fontSize: "11.5px",
                          color: "var(--text-muted)",
                          fontStyle: "italic",
                        }}
                      >
                        Unassigned
                      </span>
                    )}
                  </td>

                  {/* Submitted Date */}
                  <td
                    style={{
                      padding: "14px",
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div>
                      {new Date(report.submittedAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      {new Date(report.submittedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "14px", textAlign: "right", whiteSpace: "nowrap" }}>
                    <div style={{ display: "inline-flex", gap: "6px" }}>
                      {onAssignModerator && !report.assignedModerator && (
                        <button
                          onClick={() => onAssignModerator(report)}
                          title="Assign moderator"
                          style={{
                            padding: "6px 10px",
                            borderRadius: "8px",
                            border: "1px solid var(--border)",
                            backgroundColor: "var(--bg-secondary)",
                            color: "var(--text-main)",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Assign
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
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span>Investigate</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
