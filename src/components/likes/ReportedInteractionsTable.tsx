// NobleBond Admin — Reported Dating Interactions Table
// Triages community safety reports on Likes and Matches, zero emojis

import React from "react";
import { Flag, ShieldAlert, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import type { ReportedInteraction } from "../../types/likesMatches.types";

interface ReportedInteractionsTableProps {
  reports: ReportedInteraction[];
  onOpenReportModal: (report: ReportedInteraction) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const ReportedInteractionsTable: React.FC<ReportedInteractionsTableProps> = ({
  reports,
  onOpenReportModal,
  onOpenUserProfile,
}) => {
  const getPriorityBadge = (priority: ReportedInteraction["priority"]) => {
    switch (priority) {
      case "critical":
        return (
          <span style={{ padding: "2px 8px", borderRadius: "6px", backgroundColor: "rgba(239, 68, 68, 0.2)", color: "var(--status-error)", fontSize: "11px", fontWeight: 800 }}>
            CRITICAL
          </span>
        );
      case "high":
        return (
          <span style={{ padding: "2px 8px", borderRadius: "6px", backgroundColor: "rgba(239, 68, 68, 0.12)", color: "var(--status-error)", fontSize: "11px", fontWeight: 700 }}>
            HIGH
          </span>
        );
      case "medium":
        return (
          <span style={{ padding: "2px 8px", borderRadius: "6px", backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#F59E0B", fontSize: "11px", fontWeight: 700 }}>
            MEDIUM
          </span>
        );
      case "low":
      default:
        return (
          <span style={{ padding: "2px 8px", borderRadius: "6px", backgroundColor: "rgba(107, 114, 128, 0.12)", color: "#6B7280", fontSize: "11px", fontWeight: 600 }}>
            LOW
          </span>
        );
    }
  };

  const getStatusBadge = (status: ReportedInteraction["status"]) => {
    switch (status) {
      case "resolved":
        return (
          <span style={{ padding: "3px 8px", borderRadius: "6px", backgroundColor: "rgba(16, 185, 129, 0.12)", color: "var(--status-success)", fontSize: "11.5px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <CheckCircle2 size={12} /> Resolved
          </span>
        );
      case "investigating":
        return (
          <span style={{ padding: "3px 8px", borderRadius: "6px", backgroundColor: "rgba(245, 158, 11, 0.12)", color: "#F59E0B", fontSize: "11.5px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <Clock size={12} /> Investigating
          </span>
        );
      case "new":
        return (
          <span style={{ padding: "3px 8px", borderRadius: "6px", backgroundColor: "rgba(239, 68, 68, 0.12)", color: "var(--status-error)", fontSize: "11.5px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <Flag size={12} /> New Report
          </span>
        );
      case "escalated":
        return (
          <span style={{ padding: "3px 8px", borderRadius: "6px", backgroundColor: "rgba(139, 29, 65, 0.12)", color: "var(--primary)", fontSize: "11.5px", fontWeight: 700 }}>
            Escalated
          </span>
        );
      case "dismissed":
        return (
          <span style={{ padding: "3px 8px", borderRadius: "6px", backgroundColor: "rgba(107, 114, 128, 0.12)", color: "#6B7280", fontSize: "11.5px", fontWeight: 600 }}>
            Dismissed
          </span>
        );
      default:
        return <span>{status}</span>;
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
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          <thead>
            <tr
              style={{
                backgroundColor: "var(--bg-main)",
                borderBottom: "1px solid var(--border)",
                color: "var(--text-secondary)",
                fontSize: "11.5px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                whiteSpace: "nowrap",
              }}
            >
              <th style={{ padding: "14px 16px" }}>Report ID</th>
              <th style={{ padding: "14px 16px" }}>Reporting Member</th>
              <th style={{ padding: "14px 10px", textAlign: "center" }}>Reported</th>
              <th style={{ padding: "14px 16px" }}>Reported User</th>
              <th style={{ padding: "14px 14px" }}>Related Item</th>
              <th style={{ padding: "14px 14px" }}>Category</th>
              <th style={{ padding: "14px 14px" }}>Priority</th>
              <th style={{ padding: "14px 16px" }}>Status</th>
              <th style={{ padding: "14px 16px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ padding: "48px 16px", textAlign: "center", color: "var(--text-secondary)" }}>
                  Zero reported dating interactions on file.
                </td>
              </tr>
            ) : (
              reports.map((rep) => (
                <tr
                  key={rep.id}
                  style={{
                    borderBottom: "1px solid var(--border)",
                    transition: "background-color 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-main)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td style={{ padding: "14px 16px", fontFamily: "monospace", fontWeight: 700, color: "var(--text-main)" }}>
                    {rep.id}
                  </td>

                  {/* Reporter */}
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <img
                        src={rep.reporter.avatar}
                        alt={rep.reporter.name}
                        style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }}
                      />
                      <div>
                        <div
                          style={{ fontWeight: 600, color: "var(--text-main)", cursor: onOpenUserProfile ? "pointer" : "default" }}
                          onClick={() => onOpenUserProfile?.(rep.reporter.id)}
                        >
                          {rep.reporter.name}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{rep.reporter.username}</div>
                      </div>
                    </div>
                  </td>

                  {/* Arrow */}
                  <td style={{ padding: "14px 10px", textAlign: "center" }}>
                    <ArrowRight size={13} color="var(--text-muted)" />
                  </td>

                  {/* Reported User */}
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <img
                        src={rep.reportedUser.avatar}
                        alt={rep.reportedUser.name}
                        style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }}
                      />
                      <div>
                        <div
                          style={{ fontWeight: 600, color: "var(--text-main)", cursor: onOpenUserProfile ? "pointer" : "default" }}
                          onClick={() => onOpenUserProfile?.(rep.reportedUser.id)}
                        >
                          {rep.reportedUser.name}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{rep.reportedUser.username}</div>
                      </div>
                    </div>
                  </td>

                  {/* Related Item */}
                  <td style={{ padding: "14px 14px", textTransform: "capitalize", fontSize: "12px", color: "var(--text-secondary)" }}>
                    {rep.relatedType}: {rep.relatedId}
                  </td>

                  {/* Category */}
                  <td style={{ padding: "14px 14px", textTransform: "capitalize", fontWeight: 600, color: "var(--text-main)" }}>
                    {rep.category.replace("_", " ")}
                  </td>

                  {/* Priority */}
                  <td style={{ padding: "14px 14px" }}>
                    {getPriorityBadge(rep.priority)}
                  </td>

                  {/* Status */}
                  <td style={{ padding: "14px 16px" }}>
                    {getStatusBadge(rep.status)}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "14px 16px", textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => onOpenReportModal(rep)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: "var(--primary)",
                        color: "#FFFFFF",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <ShieldAlert size={13} />
                      Triage
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

