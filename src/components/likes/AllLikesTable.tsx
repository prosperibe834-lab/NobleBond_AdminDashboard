// NobleBond Admin — All Likes, Incoming & Outgoing Likes Table
// Directional interaction table with clear Sender -> Recipient identities, zero emojis

import React from "react";
import {
  Heart,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Flag,
  MoreVertical,
  ExternalLink,
} from "lucide-react";
import type { LikeRecord, LikesMatchesSortCriteria, LikesMatchesSortField } from "../../types/likesMatches.types";

interface AllLikesTableProps {
  likes: LikeRecord[];
  sort: LikesMatchesSortCriteria;
  onSortChange: (field: LikesMatchesSortField) => void;
  onOpenLikeDetails: (like: LikeRecord) => void;
  onOpenMatchDetails?: (matchId: string) => void;
  onFlagLike: (like: LikeRecord) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const AllLikesTable: React.FC<AllLikesTableProps> = ({
  likes,
  onOpenLikeDetails,
  onOpenMatchDetails,
  onFlagLike,
  onOpenUserProfile,
}) => {
  const getStatusBadge = (status: LikeRecord["status"], resultedInMatch: boolean) => {
    if (resultedInMatch || status === "liked_back") {
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
          <CheckCircle2 size={12} /> Liked Back (Matched)
        </span>
      );
    }
    if (status === "pending") {
      return (
        <span
          style={{
            padding: "3px 8px",
            borderRadius: "6px",
            fontSize: "11px",
            fontWeight: 700,
            backgroundColor: "rgba(245, 158, 11, 0.12)",
            color: "#F59E0B",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <Clock size={12} /> Pending Response
        </span>
      );
    }
    if (status === "passed") {
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
          <XCircle size={12} /> Passed
        </span>
      );
    }
    return (
      <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
        {status}
      </span>
    );
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
              <th style={{ padding: "14px 16px" }}>Sender (Who Liked)</th>
              <th style={{ padding: "14px 10px", textAlign: "center" }}>Direction</th>
              <th style={{ padding: "14px 16px" }}>Recipient (Target)</th>
              <th style={{ padding: "14px 14px" }}>Like Type</th>
              <th style={{ padding: "14px 16px" }}>Status</th>
              <th style={{ padding: "14px 16px" }}>Timestamp</th>
              <th style={{ padding: "14px 16px" }}>Resulted in Match</th>
              <th style={{ padding: "14px 16px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {likes.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    padding: "48px 16px",
                    textAlign: "center",
                    color: "var(--text-secondary)",
                  }}
                >
                  No like interactions match the current filters or search term.
                </td>
              </tr>
            ) : (
              likes.map((like) => (
                <tr
                  key={like.id}
                  style={{
                    borderBottom: "1px solid var(--border)",
                    transition: "background-color 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-main)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  {/* Sender identity */}
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          overflow: "hidden",
                          border: "1px solid var(--border)",
                          flexShrink: 0,
                          cursor: onOpenUserProfile ? "pointer" : "default",
                        }}
                        onClick={() => onOpenUserProfile?.(like.sender.id)}
                      >
                        <img
                          src={like.sender.avatar}
                          alt={like.sender.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            color: "var(--text-main)",
                            cursor: onOpenUserProfile ? "pointer" : "default",
                          }}
                          onClick={() => onOpenUserProfile?.(like.sender.id)}
                        >
                          {like.sender.name}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                          {like.sender.username} &middot; {like.sender.city}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Direction Arrow */}
                  <td style={{ padding: "12px 10px", textAlign: "center" }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: "var(--bg-main)",
                        color: "var(--text-muted)",
                      }}
                      title="Sent like to"
                    >
                      <ArrowRight size={13} />
                    </div>
                  </td>

                  {/* Recipient identity */}
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          overflow: "hidden",
                          border: "1px solid var(--border)",
                          flexShrink: 0,
                          cursor: onOpenUserProfile ? "pointer" : "default",
                        }}
                        onClick={() => onOpenUserProfile?.(like.recipient.id)}
                      >
                        <img
                          src={like.recipient.avatar}
                          alt={like.recipient.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            color: "var(--text-main)",
                            cursor: onOpenUserProfile ? "pointer" : "default",
                          }}
                          onClick={() => onOpenUserProfile?.(like.recipient.id)}
                        >
                          {like.recipient.name}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                          {like.recipient.username} &middot; {like.recipient.city}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Like Type */}
                  <td style={{ padding: "12px 14px" }}>
                    {like.type === "super_like" ? (
                      <span
                        style={{
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "11.5px",
                          fontWeight: 700,
                          backgroundColor: "rgba(159, 137, 219, 0.15)",
                          color: "var(--accent-lavender)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Sparkles size={12} /> Super Like
                      </span>
                    ) : (
                      <span
                        style={{
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "11.5px",
                          fontWeight: 600,
                          backgroundColor: "rgba(139, 29, 65, 0.08)",
                          color: "var(--primary)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Heart size={12} /> Regular Like
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td style={{ padding: "12px 16px" }}>
                    {getStatusBadge(like.status, like.resultedInMatch)}
                    {like.isReported && (
                      <div
                        style={{
                          fontSize: "10px",
                          color: "var(--status-error)",
                          fontWeight: 700,
                          marginTop: "2px",
                          display: "flex",
                          alignItems: "center",
                          gap: "2px",
                        }}
                      >
                        <Flag size={10} /> Reported
                      </div>
                    )}
                  </td>

                  {/* Timestamp */}
                  <td style={{ padding: "12px 16px", color: "var(--text-secondary)", fontSize: "12px" }}>
                    {new Date(like.timestamp).toLocaleString([], {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  {/* Match Connection */}
                  <td style={{ padding: "12px 16px" }}>
                    {like.resultedInMatch && like.matchId ? (
                      <button
                        type="button"
                        onClick={() => onOpenMatchDetails?.(like.matchId!)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--primary)",
                          fontWeight: 700,
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        Match #{like.matchId} <ExternalLink size={12} />
                      </button>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>None</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px" }}>
                      <button
                        type="button"
                        onClick={() => onOpenLikeDetails(like)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: "6px",
                          border: "1px solid var(--border)",
                          backgroundColor: "var(--bg-main)",
                          color: "var(--text-main)",
                          fontSize: "11.5px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Details
                      </button>

                      <button
                        type="button"
                        onClick={() => onFlagLike(like)}
                        style={{
                          padding: "5px 8px",
                          borderRadius: "6px",
                          border: "1px solid var(--border)",
                          backgroundColor: "transparent",
                          color: "var(--text-secondary)",
                          cursor: "pointer",
                        }}
                        title="Flag interaction for review"
                      >
                        <MoreVertical size={13} />
                      </button>
                    </div>
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

