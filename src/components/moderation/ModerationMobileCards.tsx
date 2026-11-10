// NobleBond Admin — Responsive Moderation Mobile Cards
// Touch-optimized stacked cards for small screens and mobile viewports, zero emojis

import React from "react";
import type {
  UnifiedReportRecord,
  ContentModerationItem,
  ModerationActionRecord,
  AppealRecord,
  ModerationHistoryEvent,
} from "../../types/reportsModeration.types";

interface ModerationMobileCardsProps {
  tab: string;
  reports: UnifiedReportRecord[];
  content: ContentModerationItem[];
  actions: ModerationActionRecord[];
  appeals: AppealRecord[];
  history: ModerationHistoryEvent[];
  onOpenReport: (report: UnifiedReportRecord) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const ModerationMobileCards: React.FC<ModerationMobileCardsProps> = ({
  tab,
  reports,
  content,
  actions,
  appeals,
  history,
  onOpenReport,
  onOpenUserProfile,
}) => {
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
      case "approved":
        return { bg: "rgba(16, 185, 129, 0.12)", color: "var(--status-success)" };
      case "under_review":
        return { bg: "rgba(59, 130, 246, 0.12)", color: "#2563EB" };
      case "escalated":
        return { bg: "rgba(147, 51, 234, 0.12)", color: "#9333EA" };
      case "dismissed":
      case "rejected":
        return { bg: "rgba(220, 38, 38, 0.12)", color: "#DC2626" };
      default:
        return { bg: "rgba(245, 158, 11, 0.12)", color: "#D97706" };
    }
  };

  // Reports Views
  if (
    tab === "overview" ||
    tab === "all_reports" ||
    tab === "user_reports" ||
    tab === "profile_reports" ||
    tab === "chat_reports" ||
    tab === "live_reports"
  ) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {reports.map((r) => {
          const pStyle = getPriorityStyle(r.priority);
          const sStyle = getStatusStyle(r.status);
          return (
            <div
              key={r.id}
              onClick={() => onOpenReport(r)}
              style={{
                padding: "16px",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "12px" }}>
                    {r.id}
                  </span>
                  <span
                    style={{
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontSize: "10.5px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      backgroundColor: pStyle.bg,
                      color: pStyle.color,
                    }}
                  >
                    {r.priority}
                  </span>
                </div>
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
                  {r.status.replace("_", " ")}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img
                  src={r.reportedUser.avatar}
                  alt={r.reportedUser.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenUserProfile?.(r.reportedUser.id);
                  }}
                  style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover", cursor: onOpenUserProfile ? "pointer" : "default" }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: "13.5px", color: "var(--text-main)" }}>
                    Target: {r.reportedUser.name}
                  </div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                    Category: {r.category.replace(/_/g, " ")} &bull; Reported by {r.reporter.name}
                  </div>
                </div>
              </div>

              <p style={{ margin: 0, fontSize: "12.5px", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                {r.description}
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1px solid var(--border)", fontSize: "11px", color: "var(--text-muted)" }}>
                <span>Assigned: {r.assignedModerator || "Unassigned"}</span>
                <span style={{ color: "var(--primary)", fontWeight: 600 }}>Tap to Investigate &rarr;</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Content Moderation Queue
  if (tab === "content_moderation") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {content.map((c) => (
          <div
            key={c.id}
            style={{
              padding: "16px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "12px" }}>
                {c.id}
              </span>
              <span style={{ textTransform: "capitalize", fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)" }}>
                {c.contentType.replace(/_/g, " ")}
              </span>
            </div>
            <div style={{ fontSize: "13px", fontWeight: 700 }}>Owner: {c.owner.name}</div>
            {c.contentPreviewText && (
              <div style={{ fontSize: "12px", fontStyle: "italic", backgroundColor: "var(--bg-secondary)", padding: "8px", borderRadius: "8px" }}>
                "{c.contentPreviewText}"
              </div>
            )}
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              Status: {c.reviewStatus}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Moderation Actions
  if (tab === "moderation_actions") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {actions.map((a) => (
          <div
            key={a.id}
            style={{
              padding: "16px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "monospace", fontWeight: 700 }}>{a.id}</span>
              <span style={{ textTransform: "uppercase", fontSize: "11px", fontWeight: 700, color: "#DC2626" }}>
                {a.status}
              </span>
            </div>
            <div style={{ fontSize: "13px", fontWeight: 700 }}>Target: {a.targetUser.name}</div>
            <div style={{ fontSize: "12px", color: "var(--text-main)" }}>
              Enforcement: {a.actionType.replace(/_/g, " ")}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Reason: {a.reason}</div>
          </div>
        ))}
      </div>
    );
  }

  // Appeals
  if (tab === "appeals") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {appeals.map((apl) => (
          <div
            key={apl.id}
            style={{
              padding: "16px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "monospace", fontWeight: 700 }}>{apl.id}</span>
              <span style={{ textTransform: "capitalize", fontSize: "11px", fontWeight: 700 }}>
                {apl.status}
              </span>
            </div>
            <div style={{ fontSize: "13px", fontWeight: 700 }}>Member: {apl.user.name}</div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              Contested: {apl.originalActionType.replace(/_/g, " ")}
            </div>
            <div style={{ fontSize: "12px", fontStyle: "italic", backgroundColor: "var(--bg-secondary)", padding: "8px", borderRadius: "8px" }}>
              "{apl.appealReason}"
            </div>
          </div>
        ))}
      </div>
    );
  }

  // History
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {history.map((h) => (
        <div
          key={h.id}
          style={{
            padding: "14px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "monospace", fontWeight: 700 }}>{h.id}</span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              {new Date(h.timestamp).toLocaleDateString()}
            </span>
          </div>
          <div style={{ fontSize: "13px", fontWeight: 700 }}>{h.actionType.replace(/_/g, " ")}</div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            Target: {h.targetUser.name} &bull; {h.reason}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            Moderator: {h.moderator}
          </div>
        </div>
      ))}
    </div>
  );
};
