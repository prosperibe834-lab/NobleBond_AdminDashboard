// NobleBond Admin — Live Reports & Moderation Table
// Safety triage queue for live streaming incidents, user reports, and moderation workflows, zero emojis

import React from "react";
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  UserCheck,
  ChevronRight,
} from "lucide-react";
import type { LiveReportRecord } from "../../types/liveManagement.types";

interface LiveReportsModerationTableProps {
  reports: LiveReportRecord[];
  onInvestigate: (report: LiveReportRecord) => void;
  onAssignModerator: (reportId: string) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const LiveReportsModerationTable: React.FC<LiveReportsModerationTableProps> = ({
  reports,
  onInvestigate,
  onAssignModerator,
  onOpenUserProfile,
}) => {
  const getCategoryBadge = (category: LiveReportRecord["category"]) => {
    const formatted = category.replace(/_/g, " ");
    let color = "#D97706";
    let bg = "rgba(245, 158, 11, 0.12)";

    if (category === "scams" || category === "threats" || category === "nudity" || category === "sexual_harassment") {
      color = "#DC2626";
      bg = "rgba(220, 38, 38, 0.12)";
    } else if (category === "impersonation") {
      color = "#9333EA";
      bg = "rgba(147, 51, 234, 0.12)";
    }

    return (
      <span
        style={{
          padding: "3px 8px",
          borderRadius: "6px",
          fontSize: "11px",
          fontWeight: 700,
          backgroundColor: bg,
          color,
          textTransform: "capitalize",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <AlertTriangle size={11} /> {formatted}
      </span>
    );
  };

  const getPriorityBadge = (priority: LiveReportRecord["priority"]) => {
    switch (priority) {
      case "critical":
        return (
          <span
            style={{
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "10px",
              fontWeight: 800,
              backgroundColor: "rgba(220, 38, 38, 0.15)",
              color: "#DC2626",
              border: "1px solid rgba(220, 38, 38, 0.3)",
              letterSpacing: "0.03em",
            }}
          >
            CRITICAL
          </span>
        );
      case "high":
        return (
          <span
            style={{
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "10px",
              fontWeight: 800,
              backgroundColor: "rgba(234, 88, 12, 0.15)",
              color: "#EA580C",
            }}
          >
            HIGH
          </span>
        );
      case "medium":
        return (
          <span
            style={{
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "10px",
              fontWeight: 700,
              backgroundColor: "rgba(245, 158, 11, 0.15)",
              color: "#D97706",
            }}
          >
            MEDIUM
          </span>
        );
      case "low":
        return (
          <span
            style={{
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "10px",
              fontWeight: 600,
              backgroundColor: "rgba(107, 114, 128, 0.15)",
              color: "#6B7280",
            }}
          >
            LOW
          </span>
        );
    }
  };

  const getStatusBadge = (status: LiveReportRecord["status"]) => {
    switch (status) {
      case "pending":
        return (
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 700,
              backgroundColor: "rgba(245, 158, 11, 0.12)",
              color: "#D97706",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Clock size={12} /> Pending
          </span>
        );
      case "under_review":
        return (
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 700,
              backgroundColor: "rgba(37, 99, 235, 0.12)",
              color: "#2563EB",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Eye size={12} /> In Review
          </span>
        );
      case "escalated":
        return (
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 800,
              backgroundColor: "rgba(220, 38, 38, 0.12)",
              color: "#DC2626",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <AlertTriangle size={12} /> Escalated
          </span>
        );
      case "resolved":
        return (
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 700,
              backgroundColor: "rgba(16, 185, 129, 0.12)",
              color: "var(--status-success)",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <CheckCircle2 size={12} /> Resolved
          </span>
        );
      case "dismissed":
        return (
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: "rgba(107, 114, 128, 0.12)",
              color: "#6B7280",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <XCircle size={12} /> Dismissed
          </span>
        );
    }
  };

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
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
                backgroundColor: "var(--bg-surface)",
                borderBottom: "1px solid var(--border)",
                color: "var(--text-secondary)",
                fontSize: "11.5px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              <th style={{ padding: "14px 18px" }}>Report &amp; Session</th>
              <th style={{ padding: "14px 18px" }}>Target Type</th>
              <th style={{ padding: "14px 18px" }}>Reporter</th>
              <th style={{ padding: "14px 18px" }}>Reported User</th>
              <th style={{ padding: "14px 18px" }}>Violation Category</th>
              <th style={{ padding: "14px 18px" }}>Priority</th>
              <th style={{ padding: "14px 18px" }}>Status</th>
              <th style={{ padding: "14px 18px" }}>Assigned Moderator</th>
              <th style={{ padding: "14px 18px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  style={{
                    padding: "48px 24px",
                    textAlign: "center",
                    color: "var(--text-secondary)",
                  }}
                >
                  <ShieldAlert size={32} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
                  <div style={{ fontSize: "14.5px", fontWeight: 700 }}>No live safety reports found</div>
                  <div style={{ fontSize: "12px", marginTop: "4px" }}>
                    The live stream moderation queue is clear.
                  </div>
                </td>
              </tr>
            ) : (
              reports.map((report) => {
                const formattedDate = new Date(report.submittedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <tr
                    key={report.id}
                    style={{
                      borderBottom: "1px solid var(--border)",
                      transition: "background-color 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--bg-surface-elevated)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    {/* Report ID & Session */}
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ fontWeight: 700, color: "var(--text-main)", fontFamily: "monospace" }}>
                        {report.id}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                        Room: {report.sessionId}
                      </div>
                      <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
                        {formattedDate}
                      </div>
                    </td>

                    {/* Target Type */}
                    <td style={{ padding: "14px 18px" }}>
                      <span
                        style={{
                          padding: "2px 7px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: 600,
                          backgroundColor: "var(--bg-surface)",
                          border: "1px solid var(--border)",
                          color: "var(--text-secondary)",
                          textTransform: "capitalize",
                        }}
                      >
                        {report.targetType.replace(/_/g, " ")}
                      </span>
                    </td>

                    {/* Reporter */}
                    <td style={{ padding: "14px 18px" }}>
                      <div
                        style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                        onClick={() => onOpenUserProfile?.(report.reporter.id)}
                      >
                        <img
                          src={report.reporter.avatar}
                          alt={report.reporter.name}
                          style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--text-main)" }}>
                            {report.reporter.name}
                          </div>
                          <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
                            {report.reporter.city}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Reported User */}
                    <td style={{ padding: "14px 18px" }}>
                      <div
                        style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                        onClick={() => onOpenUserProfile?.(report.reportedUser.id)}
                      >
                        <img
                          src={report.reportedUser.avatar}
                          alt={report.reportedUser.name}
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "1.5px solid var(--status-error)",
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: "var(--status-error)" }}>
                            {report.reportedUser.name}
                          </div>
                          <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
                            {report.reportedUser.username}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: "14px 18px" }}>{getCategoryBadge(report.category)}</td>

                    {/* Priority */}
                    <td style={{ padding: "14px 18px" }}>{getPriorityBadge(report.priority)}</td>

                    {/* Status */}
                    <td style={{ padding: "14px 18px" }}>{getStatusBadge(report.status)}</td>

                    {/* Assigned Moderator */}
                    <td style={{ padding: "14px 18px" }}>
                      {report.assignedModerator ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <UserCheck size={13} style={{ color: "var(--status-success)" }} />
                          <span style={{ fontSize: "12px", color: "var(--text-main)", fontWeight: 600 }}>
                            {report.assignedModerator}
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onAssignModerator(report.id)}
                          style={{
                            padding: "3px 8px",
                            borderRadius: "6px",
                            border: "1px dashed var(--border)",
                            backgroundColor: "var(--bg-surface)",
                            color: "var(--text-secondary)",
                            fontSize: "11px",
                            cursor: "pointer",
                          }}
                        >
                          + Assign Mod
                        </button>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "14px 18px", textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={() => onInvestigate(report)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "8px",
                          border: "none",
                          backgroundColor: "var(--primary)",
                          color: "#ffffff",
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          boxShadow: "0 2px 6px rgba(139, 29, 65, 0.2)",
                        }}
                      >
                        Investigate <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

