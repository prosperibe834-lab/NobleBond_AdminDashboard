// NobleBond Admin — Comments & Live Interactions Monitoring Section
// Real-time live room commentary oversight, reactions distribution, content moderation, zero emojis

import React from "react";
import {
  MessageSquare,
  Sparkles,
  Heart,
  Flame,
  Award,
  AlertTriangle,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import type { LiveCommentRecord } from "../../types/liveManagement.types";

interface CommentsInteractionsSectionProps {
  comments: LiveCommentRecord[];
  onRemoveComment: (commentId: string) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const CommentsInteractionsSection: React.FC<CommentsInteractionsSectionProps> = ({
  comments,
  onRemoveComment,
  onOpenUserProfile,
}) => {
  const getCommentTypeBadge = (type: LiveCommentRecord["commentType"]) => {
    switch (type) {
      case "super_highlight":
        return (
          <span
            style={{
              padding: "2px 7px",
              borderRadius: "4px",
              fontSize: "10.5px",
              fontWeight: 700,
              backgroundColor: "rgba(245, 158, 11, 0.15)",
              color: "#D97706",
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <Sparkles size={11} /> Super Highlight
          </span>
        );
      case "question":
        return (
          <span
            style={{
              padding: "2px 7px",
              borderRadius: "4px",
              fontSize: "10.5px",
              fontWeight: 600,
              backgroundColor: "rgba(37, 99, 235, 0.12)",
              color: "#2563EB",
            }}
          >
            Q&amp;A Prompt
          </span>
        );
      case "gift_announcement":
        return (
          <span
            style={{
              padding: "2px 7px",
              borderRadius: "4px",
              fontSize: "10.5px",
              fontWeight: 700,
              backgroundColor: "rgba(236, 72, 153, 0.12)",
              color: "#EC4899",
            }}
          >
            Gift Broadcast
          </span>
        );
      default:
        return (
          <span
            style={{
              padding: "2px 7px",
              borderRadius: "4px",
              fontSize: "10.5px",
              fontWeight: 500,
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-secondary)",
            }}
          >
            Chat Message
          </span>
        );
    }
  };

  const getModerationBadge = (status: LiveCommentRecord["moderationStatus"]) => {
    switch (status) {
      case "clean":
        return (
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--status-success)",
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <CheckCircle2 size={11} /> Clean
          </span>
        );
      case "reported":
        return (
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#DC2626",
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <AlertTriangle size={11} /> Flagged
          </span>
        );
      case "removed":
      case "hidden":
        return (
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#6B7280",
            }}
          >
            Removed
          </span>
        );
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Reactions Telemetry Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "14px",
        }}
      >
        <div
          style={{
            padding: "16px",
            borderRadius: "14px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "rgba(236, 72, 153, 0.1)",
              color: "#EC4899",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Heart size={20} />
          </div>
          <div>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)" }}>
              248,100
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
              Heart Taps Transmitted
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "16px",
            borderRadius: "14px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              color: "#EF4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Flame size={20} />
          </div>
          <div>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)" }}>
              82,400
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
              Flame Reactions
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "16px",
            borderRadius: "14px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "rgba(212, 175, 55, 0.12)",
              color: "var(--accent-champagne)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Award size={20} />
          </div>
          <div>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)" }}>
              41,900
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
              Super Star Claps
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "16px",
            borderRadius: "14px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "rgba(37, 99, 235, 0.1)",
              color: "#2563EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MessageSquare size={20} />
          </div>
          <div>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)" }}>
              19,250
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
              Total Comments Today
            </div>
          </div>
        </div>
      </div>

      {/* Comments Table */}
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
                <th style={{ padding: "14px 18px" }}>Comment ID</th>
                <th style={{ padding: "14px 18px" }}>Sender Member</th>
                <th style={{ padding: "14px 18px" }}>Live Session &amp; Host</th>
                <th style={{ padding: "14px 18px" }}>Type</th>
                <th style={{ padding: "14px 18px", maxWidth: "300px" }}>Comment Message</th>
                <th style={{ padding: "14px 18px" }}>Moderation</th>
                <th style={{ padding: "14px 18px", textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {comments.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: "48px 24px",
                      textAlign: "center",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <MessageSquare size={32} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
                    <div style={{ fontSize: "14.5px", fontWeight: 700 }}>No live comments found</div>
                  </td>
                </tr>
              ) : (
                comments.map((comment) => {
                  const formattedTime = new Date(comment.timestamp).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr
                      key={comment.id}
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
                      {/* Comment ID */}
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ fontWeight: 700, color: "var(--text-main)", fontFamily: "monospace" }}>
                          {comment.id}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                          {formattedTime}
                        </div>
                      </td>

                      {/* Sender */}
                      <td style={{ padding: "14px 18px" }}>
                        <div
                          style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                          onClick={() => onOpenUserProfile?.(comment.sender.id)}
                        >
                          <img
                            src={comment.sender.avatar}
                            alt={comment.sender.name}
                            style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: "var(--text-main)" }}>
                              {comment.sender.name}
                            </div>
                            <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
                              {comment.sender.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Session & Host */}
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ fontWeight: 600, color: "var(--text-main)", maxWidth: "180px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={comment.sessionTitle}>
                          {comment.sessionTitle}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                          Host: {comment.hostName}
                        </div>
                      </td>

                      {/* Type */}
                      <td style={{ padding: "14px 18px" }}>{getCommentTypeBadge(comment.commentType)}</td>

                      {/* Comment Text */}
                      <td style={{ padding: "14px 18px", maxWidth: "300px" }}>
                        <div
                          style={{
                            fontSize: "12.5px",
                            color: comment.moderationStatus === "removed" ? "var(--text-muted)" : "var(--text-main)",
                            fontStyle: comment.moderationStatus === "removed" ? "italic" : "normal",
                            lineHeight: 1.4,
                          }}
                        >
                          {comment.moderationStatus === "removed" ? "[Message removed by moderator]" : comment.commentText}
                        </div>
                      </td>

                      {/* Moderation */}
                      <td style={{ padding: "14px 18px" }}>{getModerationBadge(comment.moderationStatus)}</td>

                      {/* Action */}
                      <td style={{ padding: "14px 18px", textAlign: "right" }}>
                        {comment.moderationStatus !== "removed" && (
                          <button
                            type="button"
                            onClick={() => onRemoveComment(comment.id)}
                            style={{
                              padding: "6px 10px",
                              borderRadius: "8px",
                              border: "1px solid rgba(220, 38, 38, 0.3)",
                              backgroundColor: "rgba(220, 38, 38, 0.08)",
                              color: "#DC2626",
                              fontSize: "11.5px",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        )}
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
