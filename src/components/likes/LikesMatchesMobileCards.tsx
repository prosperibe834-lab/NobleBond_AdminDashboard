// NobleBond Admin — Likes & Matches Responsive Mobile Cards
// Touch-friendly card layout for small devices and tablets, zero emojis

import React from "react";
import {
  Heart,
  HeartHandshake,
  Sparkles,
  ArrowRight,
  MessageSquare,
  UserX,
  CheckCircle2,
  Clock,
  ShieldAlert,
  RotateCcw,
} from "lucide-react";
import type { LikeRecord, MatchRecord } from "../../types/likesMatches.types";

interface LikesMatchesMobileCardsProps {
  viewType: "likes" | "matches";
  likes: LikeRecord[];
  matches: MatchRecord[];
  onOpenLikeDetails: (like: LikeRecord) => void;
  onOpenMatchDetails: (match: MatchRecord) => void;
  onOpenRestoreModal: (match: MatchRecord) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const LikesMatchesMobileCards: React.FC<LikesMatchesMobileCardsProps> = ({
  viewType,
  likes,
  matches,
  onOpenLikeDetails,
  onOpenMatchDetails,
  onOpenRestoreModal,
  onOpenUserProfile,
}) => {
  if (viewType === "likes") {
    if (likes.length === 0) {
      return (
        <div style={{ padding: "32px 16px", textAlign: "center", backgroundColor: "var(--bg-card)", borderRadius: "14px", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
          No like interactions found.
        </div>
      );
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {likes.map((like) => (
          <div
            key={like.id}
            style={{
              backgroundColor: "var(--bg-card)",
              borderRadius: "14px",
              border: "1px solid var(--border)",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {/* Top row: Sender -> Recipient */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {/* Sender */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px", cursor: onOpenUserProfile ? "pointer" : "default" }}
                onClick={() => onOpenUserProfile?.(like.sender.id)}
              >
                <img
                  src={like.sender.avatar}
                  alt={like.sender.name}
                  style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: "13px", color: "var(--text-main)" }}>
                    {like.sender.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                    {like.sender.username}
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div style={{ padding: "4px 8px", backgroundColor: "var(--bg-main)", borderRadius: "12px", color: "var(--text-muted)" }}>
                <ArrowRight size={13} />
              </div>

              {/* Recipient */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px", cursor: onOpenUserProfile ? "pointer" : "default" }}
                onClick={() => onOpenUserProfile?.(like.recipient.id)}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: "13px", color: "var(--text-main)", textAlign: "right" }}>
                    {like.recipient.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)", textAlign: "right" }}>
                    {like.recipient.username}
                  </div>
                </div>
                <img
                  src={like.recipient.avatar}
                  alt={like.recipient.name}
                  style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
                />
              </div>
            </div>

            {/* Badges strip */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "var(--bg-main)", borderRadius: "10px", fontSize: "11.5px" }}>
              <div>
                {like.type === "super_like" ? (
                  <span style={{ color: "var(--accent-lavender)", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <Sparkles size={12} /> Super Like
                  </span>
                ) : (
                  <span style={{ color: "var(--primary)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <Heart size={12} /> Regular Like
                  </span>
                )}
              </div>

              <div>
                {like.resultedInMatch ? (
                  <span style={{ color: "var(--status-success)", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "3px" }}>
                    <CheckCircle2 size={12} /> Matched
                  </span>
                ) : like.status === "pending" ? (
                  <span style={{ color: "#F59E0B", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "3px" }}>
                    <Clock size={12} /> Pending
                  </span>
                ) : (
                  <span style={{ color: "#6B7280" }}>{like.status}</span>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "4px" }}>
              <span style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                {new Date(like.timestamp).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>

              <button
                type="button"
                onClick={() => onOpenLikeDetails(like)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-main)",
                  color: "var(--text-main)",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Matches View
  if (matches.length === 0) {
    return (
      <div style={{ padding: "32px 16px", textAlign: "center", backgroundColor: "var(--bg-card)", borderRadius: "14px", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
        No confirmed mutual matches found.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {matches.map((m) => (
        <div
          key={m.id}
          style={{
            backgroundColor: "var(--bg-card)",
            borderRadius: "14px",
            border: "1px solid var(--border)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {/* Top row: Paired couple info */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={m.user1.avatar}
                  alt={m.user1.name}
                  style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--primary)" }}
                />
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
                  }}
                >
                  <Heart size={10} fill="#FFFFFF" />
                </div>
                <img
                  src={m.user2.avatar}
                  alt={m.user2.name}
                  style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--primary)" }}
                />
              </div>

              <div>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-main)" }}>
                  {m.user1.name} & {m.user2.name}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                  Matched {m.durationDays} days ago &middot; ID: {m.id}
                </div>
              </div>
            </div>

            <div>
              {m.status === "active" && (
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--status-success)", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                  <CheckCircle2 size={12} /> Active
                </span>
              )}
              {m.status === "unmatched" && (
                <span style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                  <UserX size={12} /> Unmatched
                </span>
              )}
              {m.status === "restricted" && (
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--status-error)", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                  <ShieldAlert size={12} /> Restricted
                </span>
              )}
            </div>
          </div>

          {/* Chat Metadata & Unmatch info */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "var(--bg-main)", borderRadius: "10px", fontSize: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
              <MessageSquare size={13} color="var(--status-info)" />
              <span>{m.conversation.messageCount} chat messages exchanged</span>
            </div>

            {m.isReported && (
              <span style={{ color: "var(--status-error)", fontWeight: 700, fontSize: "11px" }}>
                Reported
              </span>
            )}
          </div>

          {m.status === "unmatched" && m.unmatchInfo && (
            <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", backgroundColor: "rgba(107, 114, 128, 0.08)", padding: "8px 10px", borderRadius: "8px" }}>
              <strong>Unmatched by {m.unmatchInfo.unmatcherName}:</strong> {m.unmatchInfo.reason || "No reason given"}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={() => onOpenMatchDetails(m)}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "var(--primary)",
                color: "#FFFFFF",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
            >
              <HeartHandshake size={14} /> Match Details
            </button>

            {m.status === "unmatched" && (
              <button
                type="button"
                onClick={() => onOpenRestoreModal(m)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-main)",
                  color: "var(--text-main)",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <RotateCcw size={13} /> Restore
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

