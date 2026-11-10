// NobleBond Admin — Responsive Chat Management Mobile Cards
// Touch-optimized stacked cards for mobile viewports, zero emojis

import React from "react";
import {
  PhoneCall,
  Video,
  ChevronRight,
} from "lucide-react";
import type {
  ConversationRecord,
  ReportedConversation,
  ReportedMessage,
  CallRecord,
  MessagingRestrictionRecord,
} from "../../types/chatManagement.types";

interface ChatMobileCardsProps {
  tab: string;
  conversations: ConversationRecord[];
  reportedConvs: ReportedConversation[];
  reportedMsgs: ReportedMessage[];
  calls: CallRecord[];
  restrictions: MessagingRestrictionRecord[];
  onOpenConversation: (c: ConversationRecord) => void;
  onInvestigateReport: (r: ReportedConversation) => void;
  onReviewMessage: (m: ReportedMessage) => void;
  onOpenCallDiagnostics: (c: CallRecord) => void;
  onOpenRevokeRestriction: (r: MessagingRestrictionRecord) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const ChatMobileCards: React.FC<ChatMobileCardsProps> = ({
  tab,
  conversations,
  reportedConvs,
  reportedMsgs,
  calls,
  restrictions,
  onOpenConversation,
  onInvestigateReport,
  onReviewMessage,
  onOpenCallDiagnostics,
  onOpenRevokeRestriction,
  onOpenUserProfile,
}) => {
  // Mobile Conversations
  if (tab === "conversations") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {conversations.map((c) => (
          <div
            key={c.id}
            style={{
              padding: "16px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                  <img
                    src={c.participant1.avatar}
                    alt={c.participant1.name}
                    style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                    onClick={() => onOpenUserProfile?.(c.participant1.id)}
                  />
                  <img
                    src={c.participant2.avatar}
                    alt={c.participant2.name}
                    style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", marginLeft: "-10px" }}
                    onClick={() => onOpenUserProfile?.(c.participant2.id)}
                  />
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>
                    {c.participant1.name} &amp; {c.participant2.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {c.id} &bull; Match {c.matchId}
                  </div>
                </div>
              </div>

              <span
                style={{
                  padding: "2px 7px",
                  borderRadius: "5px",
                  fontSize: "10.5px",
                  fontWeight: 700,
                  backgroundColor: c.status === "active" ? "rgba(16, 185, 129, 0.12)" : "rgba(107, 114, 128, 0.12)",
                  color: c.status === "active" ? "var(--status-success)" : "var(--text-secondary)",
                  textTransform: "capitalize",
                }}
              >
                {c.status.replace(/_/g, " ")}
              </span>
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                fontStyle: "italic",
                padding: "8px 12px",
                backgroundColor: "var(--bg-surface)",
                borderRadius: "8px",
              }}
            >
              &ldquo;{c.lastMessageSnippet}&rdquo;
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1px solid var(--border)" }}>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                {c.totalMessages} messages &bull; {c.mediaAttachmentCount} attachments
              </span>
              <button
                type="button"
                onClick={() => onOpenConversation(c)}
                style={{
                  padding: "5px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-main)",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                Telemetry <ChevronRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Mobile Reported Conversations
  if (tab === "reported_conversations") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {reportedConvs.map((r) => (
          <div
            key={r.id}
            style={{
              padding: "16px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span
                  style={{
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "10px",
                    fontWeight: 800,
                    backgroundColor: "rgba(220, 38, 38, 0.15)",
                    color: "#DC2626",
                    textTransform: "uppercase",
                  }}
                >
                  {r.priority} Priority
                </span>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)", marginTop: "4px" }}>
                  {r.category.replace(/_/g, " ").toUpperCase()}
                </div>
              </div>

              <span
                style={{
                  padding: "2px 7px",
                  borderRadius: "5px",
                  fontSize: "10.5px",
                  fontWeight: 700,
                  backgroundColor: "rgba(245, 158, 11, 0.12)",
                  color: "#D97706",
                  textTransform: "capitalize",
                }}
              >
                {r.status.replace(/_/g, " ")}
              </span>
            </div>

            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              Reported by <strong>{r.reporter.name}</strong> against <strong style={{ color: "var(--status-error)" }}>{r.reportedUser.name}</strong>
            </div>

            <p style={{ fontSize: "12px", color: "var(--text-main)", margin: 0, lineHeight: 1.4 }}>
              {r.details}
            </p>

            <button
              type="button"
              onClick={() => onInvestigateReport(r)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "var(--primary)",
                color: "#ffffff",
                fontSize: "12.5px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Investigate Incident
            </button>
          </div>
        ))}
      </div>
    );
  }

  // Mobile Reported Messages
  if (tab === "reported_messages") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {reportedMsgs.map((m) => (
          <div
            key={m.id}
            style={{
              padding: "16px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#DC2626" }}>
                {m.category.replace(/_/g, " ").toUpperCase()}
              </span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{m.id}</span>
            </div>

            <div
              style={{
                padding: "10px 12px",
                backgroundColor: "var(--bg-surface)",
                borderRadius: "8px",
                borderLeft: "3px solid var(--status-error)",
                fontSize: "12.5px",
                fontStyle: "italic",
                color: "var(--text-main)",
              }}
            >
              &ldquo;{m.flaggedContent}&rdquo;
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11.5px" }}>
              <span>From: <strong>{m.sender.name}</strong></span>
              <button
                type="button"
                onClick={() => onReviewMessage(m)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-main)",
                  fontSize: "11.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Review
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Mobile Calls
  if (tab === "calls") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {calls.map((c) => (
          <div
            key={c.id}
            style={{
              padding: "16px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {c.type === "video" ? <Video size={16} color="#4F46E5" /> : <PhoneCall size={16} color="#0D9488" />}
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)", textTransform: "capitalize" }}>
                  {c.type} Call
                </span>
              </div>
              <span
                style={{
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "10.5px",
                  fontWeight: 700,
                  backgroundColor: c.status === "completed" ? "rgba(16, 185, 129, 0.12)" : "rgba(220, 38, 38, 0.12)",
                  color: c.status === "completed" ? "var(--status-success)" : "#DC2626",
                  textTransform: "capitalize",
                }}
              >
                {c.status}
              </span>
            </div>

            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              {c.caller.name} &rarr; {c.recipient.name}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11.5px", color: "var(--text-muted)" }}>
              <span>Duration: {c.durationSeconds ? `${Math.floor(c.durationSeconds / 60)}m ${c.durationSeconds % 60}s` : "0s"}</span>
              <button
                type="button"
                onClick={() => onOpenCallDiagnostics(c)}
                style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-main)",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Diagnostics
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Mobile Restrictions
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {restrictions.map((r) => (
        <div
          key={r.id}
          style={{
            padding: "16px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            boxShadow: "var(--shadow-sm)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>
              {r.targetUser.name}
            </span>
            <span
              style={{
                padding: "2px 6px",
                borderRadius: "4px",
                fontSize: "10.5px",
                fontWeight: 700,
                backgroundColor: "rgba(220, 38, 38, 0.12)",
                color: "#DC2626",
              }}
            >
              {r.status}
            </span>
          </div>

          <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            Authority: <strong>{r.initiatorName}</strong>
          </div>

          <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
            Scope: {r.scope.replace(/_/g, " ")} &bull; {r.reason}
          </div>

          {r.imposedBy === "admin" && r.status === "active" && (
            <button
              type="button"
              onClick={() => onOpenRevokeRestriction(r)}
              style={{
                marginTop: "4px",
                padding: "6px",
                borderRadius: "8px",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                backgroundColor: "rgba(16, 185, 129, 0.08)",
                color: "var(--status-success)",
                fontSize: "11.5px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Revoke Restriction
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
