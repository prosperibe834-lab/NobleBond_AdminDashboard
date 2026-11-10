// NobleBond Admin — Reported Conversations Table
// Trust & Safety investigation queue for flagged threads, zero emojis

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
import type { ReportedConversation } from "../../types/chatManagement.types";

interface ReportedConversationsTableProps {
  reports: ReportedConversation[];
  onInvestigate: (report: ReportedConversation) => void;
  onAssignModerator: (reportId: string) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const ReportedConversationsTable: React.FC<ReportedConversationsTableProps> = ({
  reports,
  onInvestigate,
  onAssignModerator,
  onOpenUserProfile,
}) => {
  const getCategoryBadge = (category: ReportedConversation["category"]) => {
    const formatted = category.replace("_", " ");
    let color = "#D97706";
    let bg = "rgba(245, 158, 11, 0.12)";

    if (category === "scams" || category === "threats" || category === "sexual_harassment") {
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

  const getPriorityBadge = (priority: ReportedConversation["priority"]) => {
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
              letterSpacing: "0.03em",
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

  const getStatusBadge = (status: ReportedConversation["status"]) => {
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
              <th style={{ padding: "14px 18px" }}>Report &amp; Thread</th>
              <th style={{ padding: "14px 18px" }}>Reporter</th>
              <th style={{ padding: "14px 18px" }}>Reported User</th>
              <th style={{ padding: "14px 18px" }}>Violation Category</th>
              <th style={{ padding: "14px 18px" }}>Priority</th>
              <th style={{ padding: "14px 18px" }}>Status</th>
              <th style={{ padding: "14px 18px" }}>Assigned To</th>
              <th style={{ padding: "14px 18px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    padding: "48px 24px",
                    textAlign: "center",
                    color: "var(--text-secondary)",
                  }}
                >
                  <ShieldAlert size={32} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
                  <div style={{ fontSize: "14.5px", fontWeight: 700 }}>
                    No reported conversations found
                  </div>
                  <div style={{ fontSize: "12px", marginTop: "4px" }}>
                    All user-flagged chat threads have been resolved or filtered out.
                  </div>
                </td>
              </tr>
            ) : (
              reports.map((r) => {
                const formattedDate = new Date(r.reportedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <tr
                    key={r.id}
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
                    {/* Report & Thread */}
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ fontWeight: 700, color: "var(--text-main)", fontFamily: "monospace" }}>
                        {r.id}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                        Thread: {r.conversationId}
                      </div>
                      <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
                        {formattedDate}
                      </div>
                    </td>

                    {/* Reporter */}
                    <td style={{ padding: "14px 18px" }}>
                      <div
                        style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                        onClick={() => onOpenUserProfile?.(r.reporter.id)}
                      >
                        <img
                          src={r.reporter.avatar}
                          alt={r.reporter.name}
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--text-main)" }}>
                            {r.reporter.name}
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                            {r.reporter.city}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Reported User */}
                    <td style={{ padding: "14px 18px" }}>
                      <div
                        style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                        onClick={() => onOpenUserProfile?.(r.reportedUser.id)}
                      >
                        <img
                          src={r.reportedUser.avatar}
                          alt={r.reportedUser.name}
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "1px solid var(--status-error)",
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: "var(--status-error)" }}>
                            {r.reportedUser.name}
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                            {r.reportedUser.username}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: "14px 18px" }}>{getCategoryBadge(r.category)}</td>

                    {/* Priority */}
                    <td style={{ padding: "14px 18px" }}>{getPriorityBadge(r.priority)}</td>

                    {/* Status */}
                    <td style={{ padding: "14px 18px" }}>{getStatusBadge(r.status)}</td>

                    {/* Assigned Moderator */}
                    <td style={{ padding: "14px 18px" }}>
                      {r.assignedModerator ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <UserCheck size={13} style={{ color: "var(--status-success)" }} />
                          <span style={{ fontSize: "12px", color: "var(--text-main)", fontWeight: 600 }}>
                            {r.assignedModerator}
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onAssignModerator(r.id)}
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
                        onClick={() => onInvestigate(r)}
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

