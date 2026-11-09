// NobleBond Admin — All Conversations Table
// Full operational thread management with paired participant cards, delivery telemetry, zero emojis

import React from "react";
import {
  MessageSquare,
  ShieldAlert,
  Archive,
  Eye,
  CheckCircle2,
  AlertTriangle,
  UserX,
  FileText,
  Activity,
  Lock,
} from "lucide-react";
import type {
  ConversationRecord,
  ChatSortCriteria,
  ChatSortField,
} from "../../types/chatManagement.types";

interface ConversationsTableProps {
  conversations: ConversationRecord[];
  sort: ChatSortCriteria;
  onSortChange: (field: ChatSortField) => void;
  onOpenDetails: (conversation: ConversationRecord) => void;
  onToggleArchive: (conversationId: string) => void;
  onOpenRestrictModal: (conversation: ConversationRecord) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const ConversationsTable: React.FC<ConversationsTableProps> = ({
  conversations,
  onOpenDetails,
  onToggleArchive,
  onOpenRestrictModal,
  onOpenUserProfile,
}) => {
  const getStatusBadge = (status: ConversationRecord["status"]) => {
    switch (status) {
      case "active":
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
            <CheckCircle2 size={12} /> Active
          </span>
        );
      case "archived":
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
            <Archive size={12} /> Archived
          </span>
        );
      case "restricted":
        return (
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 700,
              backgroundColor: "rgba(220, 38, 38, 0.12)",
              color: "#DC2626",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <ShieldAlert size={12} /> Restricted
          </span>
        );
      case "blocked_by_user":
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
            <UserX size={12} /> User Block
          </span>
        );
    }
  };

  const getHealthBadge = (health: ConversationRecord["deliveryHealth"]) => {
    switch (health) {
      case "optimal":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "11px",
              color: "var(--status-success)",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor: "var(--status-success)",
              }}
            />
            Optimal
          </span>
        );
      case "warning":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "11px",
              color: "#F59E0B",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor: "#F59E0B",
              }}
            />
            Latency Warning
          </span>
        );
      case "degraded":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "11px",
              color: "#DC2626",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor: "#DC2626",
              }}
            />
            Degraded
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
              <th style={{ padding: "14px 18px" }}>Thread & Match</th>
              <th style={{ padding: "14px 18px" }}>Participants</th>
              <th style={{ padding: "14px 18px" }}>Messages & Activity</th>
              <th style={{ padding: "14px 18px" }}>Attachments</th>
              <th style={{ padding: "14px 18px" }}>Delivery Health</th>
              <th style={{ padding: "14px 18px" }}>Status</th>
              <th style={{ padding: "14px 18px" }}>Last Message</th>
              <th style={{ padding: "14px 18px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {conversations.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    padding: "48px 24px",
                    textAlign: "center",
                    color: "var(--text-secondary)",
                  }}
                >
                  <MessageSquare size={32} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
                  <div style={{ fontSize: "14.5px", fontWeight: 700 }}>No conversations found</div>
                  <div style={{ fontSize: "12px", marginTop: "4px" }}>
                    Try adjusting your search criteria or active filters.
                  </div>
                </td>
              </tr>
            ) : (
              conversations.map((c) => {
                const formattedTime = new Date(c.lastMessageAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <tr
                    key={c.id}
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
                    {/* Thread & Match */}
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ fontWeight: 700, color: "var(--text-main)", fontFamily: "monospace" }}>
                        {c.id}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                        Match: {c.matchId}
                      </div>
                    </td>

                    {/* Participants */}
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {/* Avatar Pair */}
                        <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                          <img
                            src={c.participant1.avatar}
                            alt={c.participant1.name}
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "2px solid var(--bg-card)",
                              cursor: "pointer",
                            }}
                            onClick={() => onOpenUserProfile?.(c.participant1.id)}
                          />
                          <img
                            src={c.participant2.avatar}
                            alt={c.participant2.name}
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "2px solid var(--bg-card)",
                              marginLeft: "-10px",
                              cursor: "pointer",
                            }}
                            onClick={() => onOpenUserProfile?.(c.participant2.id)}
                          />
                        </div>

                        <div>
                          <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)" }}>
                            {c.participant1.name} &amp; {c.participant2.name}
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                            {c.participant1.city} &bull; {c.participant2.city}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Messages & Volume */}
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontWeight: 700, color: "var(--text-main)" }}>
                          {c.totalMessages} msgs
                        </span>
                        {c.unreadCount > 0 && (
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
                            {c.unreadCount} unread
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                        {c.messagesSentByP1} vs {c.messagesSentByP2} split
                      </div>
                    </td>

                    {/* Attachments */}
                    <td style={{ padding: "14px 18px" }}>
                      {c.mediaAttachmentCount > 0 ? (
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 600,
                            backgroundColor: "var(--bg-surface)",
                            border: "1px solid var(--border)",
                            color: "var(--text-secondary)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <FileText size={12} /> {c.mediaAttachmentCount} items
                        </span>
                      ) : (
                        <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>None</span>
                      )}
                    </td>

                    {/* Delivery Health */}
                    <td style={{ padding: "14px 18px" }}>{getHealthBadge(c.deliveryHealth)}</td>

                    {/* Status */}
                    <td style={{ padding: "14px 18px" }}>{getStatusBadge(c.status)}</td>

                    {/* Last Message Timestamp */}
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-main)" }}>
                        {formattedTime}
                      </div>
                      {c.hasActiveReports && (
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "3px",
                            fontSize: "10.5px",
                            color: "#DC2626",
                            fontWeight: 700,
                            marginTop: "2px",
                          }}
                        >
                          <AlertTriangle size={11} /> Flagged
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "14px 18px", textAlign: "right" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: "6px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => onOpenDetails(c)}
                          title="Inspect Telemetry (Privacy Protected)"
                          style={{
                            padding: "6px 10px",
                            borderRadius: "8px",
                            border: "1px solid var(--border)",
                            backgroundColor: "var(--bg-surface)",
                            color: "var(--text-secondary)",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: 600,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Eye size={13} /> Details
                        </button>

                        <button
                          type="button"
                          onClick={() => onToggleArchive(c.id)}
                          title={c.status === "archived" ? "Unarchive Thread" : "Archive Thread"}
                          style={{
                            padding: "6px 8px",
                            borderRadius: "8px",
                            border: "1px solid var(--border)",
                            backgroundColor: "var(--bg-surface)",
                            color: "var(--text-secondary)",
                            cursor: "pointer",
                          }}
                        >
                          <Archive size={13} />
                        </button>

                        {!c.isRestricted && (
                          <button
                            type="button"
                            onClick={() => onOpenRestrictModal(c)}
                            title="Apply Admin Restriction"
                            style={{
                              padding: "6px 8px",
                              borderRadius: "8px",
                              border: "1px solid rgba(220, 38, 38, 0.3)",
                              backgroundColor: "rgba(220, 38, 38, 0.08)",
                              color: "#DC2626",
                              cursor: "pointer",
                            }}
                          >
                            <Lock size={13} />
                          </button>
                        )}
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
  );
};
