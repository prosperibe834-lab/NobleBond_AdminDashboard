// NobleBond Admin — Confirmed Mutual Matches Table
// Displays genuine reciprocal matches with paired user identities, zero emojis

import React from "react";
import {
  Heart,
  HeartHandshake,
  MessageSquare,
  ShieldAlert,
  Clock,
  UserX,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import type { MatchRecord, LikesMatchesSortCriteria, LikesMatchesSortField } from "../../types/likesMatches.types";

interface MatchesTableProps {
  matches: MatchRecord[];
  sort: LikesMatchesSortCriteria;
  onSortChange: (field: LikesMatchesSortField) => void;
  onOpenMatchDetails: (match: MatchRecord) => void;
  onOpenRestoreModal: (match: MatchRecord) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const MatchesTable: React.FC<MatchesTableProps> = ({
  matches,
  onOpenMatchDetails,
  onOpenRestoreModal,
  onOpenUserProfile,
}) => {
  const getMatchStatusBadge = (status: MatchRecord["status"]) => {
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
            <CheckCircle2 size={12} /> Active Match
          </span>
        );
      case "unmatched":
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
            <UserX size={12} /> Unmatched
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
              backgroundColor: "rgba(245, 158, 11, 0.12)",
              color: "#F59E0B",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Clock size={12} /> Under Review
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
              backgroundColor: "rgba(239, 68, 68, 0.12)",
              color: "var(--status-error)",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <ShieldAlert size={12} /> Restricted
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
              <th style={{ padding: "14px 16px" }}>Matched Couple (Pair)</th>
              <th style={{ padding: "14px 14px" }}>Match ID</th>
              <th style={{ padding: "14px 16px" }}>Match Date</th>
              <th style={{ padding: "14px 14px" }}>Duration</th>
              <th style={{ padding: "14px 16px" }}>Conversation Activity</th>
              <th style={{ padding: "14px 16px" }}>Status</th>
              <th style={{ padding: "14px 16px" }}>Safety / Reports</th>
              <th style={{ padding: "14px 16px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {matches.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    padding: "48px 16px",
                    textAlign: "center",
                    color: "var(--text-secondary)",
                  }}
                >
                  No confirmed mutual matches match the current filter criteria.
                </td>
              </tr>
            ) : (
              matches.map((m) => (
                <tr
                  key={m.id}
                  style={{
                    borderBottom: "1px solid var(--border)",
                    transition: "background-color 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-main)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  {/* Paired Couple Identity */}
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {/* Avatars with Heart badge in between */}
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "2px solid var(--primary)",
                            cursor: onOpenUserProfile ? "pointer" : "default",
                          }}
                          onClick={() => onOpenUserProfile?.(m.user1.id)}
                          title={`${m.user1.name} (${m.user1.username})`}
                        >
                          <img
                            src={m.user1.avatar}
                            alt={m.user1.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </div>

                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            backgroundColor: "var(--primary)",
                            color: "#FFFFFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 -6px",
                            zIndex: 2,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                          }}
                        >
                          <Heart size={10} fill="#FFFFFF" />
                        </div>

                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "2px solid var(--primary)",
                            cursor: onOpenUserProfile ? "pointer" : "default",
                          }}
                          onClick={() => onOpenUserProfile?.(m.user2.id)}
                          title={`${m.user2.name} (${m.user2.username})`}
                        >
                          <img
                            src={m.user2.avatar}
                            alt={m.user2.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </div>
                      </div>

                      {/* Couple text names */}
                      <div>
                        <div style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "13.5px" }}>
                          <span
                            style={{ cursor: onOpenUserProfile ? "pointer" : "default" }}
                            onClick={() => onOpenUserProfile?.(m.user1.id)}
                          >
                            {m.user1.name}
                          </span>
                          {" & "}
                          <span
                            style={{ cursor: onOpenUserProfile ? "pointer" : "default" }}
                            onClick={() => onOpenUserProfile?.(m.user2.id)}
                          >
                            {m.user2.name}
                          </span>
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                          {m.user1.city} &middot; {m.user2.city}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Match ID */}
                  <td style={{ padding: "14px 14px", fontFamily: "monospace", fontSize: "12px", color: "var(--text-secondary)" }}>
                    {m.id}
                  </td>

                  {/* Match Date */}
                  <td style={{ padding: "14px 16px", color: "var(--text-secondary)", fontSize: "12.5px" }}>
                    {new Date(m.matchDate).toLocaleDateString([], {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>

                  {/* Duration */}
                  <td style={{ padding: "14px 14px", fontWeight: 600, color: "var(--text-main)", fontSize: "12.5px" }}>
                    {m.durationDays} days
                  </td>

                  {/* Conversation Activity */}
                  <td style={{ padding: "14px 16px" }}>
                    {m.conversation.exists ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <MessageSquare size={13} color="var(--status-info)" />
                        <span style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "12px" }}>
                          {m.conversation.messageCount} msgs
                        </span>
                      </div>
                    ) : (
                      <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>No chat yet</span>
                    )}
                  </td>

                  {/* Status */}
                  <td style={{ padding: "14px 16px" }}>
                    {getMatchStatusBadge(m.status)}
                    {m.status === "unmatched" && m.unmatchInfo && (
                      <div style={{ fontSize: "10.5px", color: "var(--text-secondary)", marginTop: "3px" }}>
                        By {m.unmatchInfo.unmatcherName.split(" ")[0]}
                      </div>
                    )}
                  </td>

                  {/* Safety & Reports */}
                  <td style={{ padding: "14px 16px" }}>
                    {m.isReported ? (
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: "6px",
                          backgroundColor: "var(--status-error-bg)",
                          color: "var(--status-error)",
                          fontSize: "11px",
                          fontWeight: 700,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        <ShieldAlert size={11} /> Flagged
                      </span>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>Clean</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "14px 16px", textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px" }}>
                      <button
                        type="button"
                        onClick={() => onOpenMatchDetails(m)}
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
                        <HeartHandshake size={13} />
                        Details
                      </button>

                      {m.status === "unmatched" && (
                        <button
                          type="button"
                          onClick={() => onOpenRestoreModal(m)}
                          title="Review Match Restoration"
                          style={{
                            padding: "6px 10px",
                            borderRadius: "6px",
                            border: "1px solid var(--border)",
                            backgroundColor: "var(--bg-main)",
                            color: "var(--text-main)",
                            fontSize: "11.5px",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <RotateCcw size={12} />
                          Restore
                        </button>
                      )}
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
