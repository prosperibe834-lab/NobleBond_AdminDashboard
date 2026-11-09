// NobleBond Admin — Reported Messages Table
// Granular flagged message triage queue with strict privacy and context view, zero emojis

import React from "react";
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Video,
  Mic,
  ChevronRight,
} from "lucide-react";
import type { ReportedMessage } from "../../types/chatManagement.types";

interface ReportedMessagesTableProps {
  messages: ReportedMessage[];
  onReviewMessage: (message: ReportedMessage) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const ReportedMessagesTable: React.FC<ReportedMessagesTableProps> = ({
  messages,
  onReviewMessage,
  onOpenUserProfile,
}) => {
  const getTypeBadge = (type: ReportedMessage["messageType"]) => {
    switch (type) {
      case "text":
        return (
          <span
            style={{
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "10.5px",
              fontWeight: 600,
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <FileText size={11} /> Text
          </span>
        );
      case "image":
        return (
          <span
            style={{
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "10.5px",
              fontWeight: 600,
              backgroundColor: "rgba(37, 99, 235, 0.1)",
              color: "#2563EB",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <ImageIcon size={11} /> Image
          </span>
        );
      case "link":
        return (
          <span
            style={{
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "10.5px",
              fontWeight: 600,
              backgroundColor: "rgba(220, 38, 38, 0.1)",
              color: "#DC2626",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <LinkIcon size={11} /> Link
          </span>
        );
      case "video":
        return (
          <span
            style={{
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "10.5px",
              fontWeight: 600,
              backgroundColor: "rgba(147, 51, 234, 0.1)",
              color: "#9333EA",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Video size={11} /> Video
          </span>
        );
      case "audio":
        return (
          <span
            style={{
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "10.5px",
              fontWeight: 600,
              backgroundColor: "rgba(13, 148, 136, 0.1)",
              color: "#0D9488",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Mic size={11} /> Voice Note
          </span>
        );
      default:
        return (
          <span
            style={{
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "10.5px",
              fontWeight: 600,
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-muted)",
            }}
          >
            Attachment
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: ReportedMessage["priority"]) => {
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

  const getStatusBadge = (status: ReportedMessage["status"]) => {
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
            In Review
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
      default:
        return null;
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
              <th style={{ padding: "14px 18px" }}>Message Reference</th>
              <th style={{ padding: "14px 18px" }}>Sender</th>
              <th style={{ padding: "14px 18px" }}>Recipient</th>
              <th style={{ padding: "14px 18px" }}>Type</th>
              <th style={{ padding: "14px 18px", maxWidth: "280px" }}>Flagged Content Preview</th>
              <th style={{ padding: "14px 18px" }}>Category</th>
              <th style={{ padding: "14px 18px" }}>Priority</th>
              <th style={{ padding: "14px 18px" }}>Status</th>
              <th style={{ padding: "14px 18px", textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
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
                  <div style={{ fontSize: "14.5px", fontWeight: 700 }}>
                    No reported messages found
                  </div>
                  <div style={{ fontSize: "12px", marginTop: "4px" }}>
                    The message moderation review queue is currently clear.
                  </div>
                </td>
              </tr>
            ) : (
              messages.map((m) => {
                return (
                  <tr
                    key={m.id}
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
                    {/* Message Reference */}
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ fontWeight: 700, color: "var(--text-main)", fontFamily: "monospace" }}>
                        {m.id}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                        Conv: {m.conversationId}
                      </div>
                    </td>

                    {/* Sender */}
                    <td style={{ padding: "14px 18px" }}>
                      <div
                        style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                        onClick={() => onOpenUserProfile?.(m.sender.id)}
                      >
                        <img
                          src={m.sender.avatar}
                          alt={m.sender.name}
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: "var(--status-error)" }}>
                            {m.sender.name}
                          </div>
                          <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
                            {m.sender.username}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Recipient */}
                    <td style={{ padding: "14px 18px" }}>
                      <div
                        style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                        onClick={() => onOpenUserProfile?.(m.recipient.id)}
                      >
                        <img
                          src={m.recipient.avatar}
                          alt={m.recipient.name}
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--text-main)" }}>
                            {m.recipient.name}
                          </div>
                          <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
                            {m.recipient.username}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td style={{ padding: "14px 18px" }}>{getTypeBadge(m.messageType)}</td>

                    {/* Content Preview */}
                    <td style={{ padding: "14px 18px", maxWidth: "280px" }}>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--text-main)",
                          lineHeight: 1.4,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          fontStyle: "italic",
                          padding: "4px 8px",
                          backgroundColor: "var(--bg-surface)",
                          borderRadius: "6px",
                          borderLeft: "3px solid var(--status-error)",
                        }}
                      >
                        &ldquo;{m.flaggedContent}&rdquo;
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: "14px 18px" }}>
                      <span
                        style={{
                          fontSize: "11.5px",
                          fontWeight: 700,
                          color: "#DC2626",
                          textTransform: "capitalize",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        <AlertTriangle size={11} /> {m.category.replace("_", " ")}
                      </span>
                    </td>

                    {/* Priority */}
                    <td style={{ padding: "14px 18px" }}>{getPriorityBadge(m.priority)}</td>

                    {/* Status */}
                    <td style={{ padding: "14px 18px" }}>{getStatusBadge(m.status)}</td>

                    {/* Action */}
                    <td style={{ padding: "14px 18px", textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={() => onReviewMessage(m)}
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
                        Review <ChevronRight size={14} />
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
