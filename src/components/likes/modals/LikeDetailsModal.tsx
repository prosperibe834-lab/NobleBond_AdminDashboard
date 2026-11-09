// NobleBond Admin — Directional Like Details Modal
// Detailed inspection of sender, recipient, like type, and outcome, zero emojis

import React from "react";
import {
  X,
  Heart,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import type { LikeRecord } from "../../../types/likesMatches.types";
import { calculateAge } from "../../../data/likesMatchesDataService";

interface LikeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  like: LikeRecord | null;
  onOpenMatchDetails?: (matchId: string) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const LikeDetailsModal: React.FC<LikeDetailsModalProps> = ({
  isOpen,
  onClose,
  like,
  onOpenMatchDetails,
  onOpenUserProfile,
}) => {
  if (!isOpen || !like) return null;

  const senderAge = calculateAge(like.sender.dateOfBirth);
  const recipientAge = calculateAge(like.recipient.dateOfBirth);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        className="animate-scale-up"
        style={{
          width: "100%",
          maxWidth: "680px",
          backgroundColor: "var(--bg-card)",
          borderRadius: "20px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-xl)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid var(--border)",
            backgroundColor: "var(--bg-main)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: "rgba(139, 29, 65, 0.1)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Heart size={18} />
            </div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
                Directional Interaction Record #{like.id}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Timestamp: {new Date(like.timestamp).toLocaleString()}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
              padding: "6px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Sender -> Arrow -> Recipient Card */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems: "center",
              gap: "14px",
              padding: "18px",
              borderRadius: "16px",
              backgroundColor: "var(--bg-main)",
              border: "1px solid var(--border)",
            }}
          >
            {/* Sender */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "8px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase" }}>
                Sender (Sent Like)
              </div>
              <img
                src={like.sender.avatar}
                alt={like.sender.name}
                style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--primary)" }}
              />
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                  <span style={{ fontWeight: 800, fontSize: "14px", color: "var(--text-main)" }}>{like.sender.name}</span>
                  {like.sender.isVerified && <ShieldCheck size={13} color="#2563EB" />}
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                  {like.sender.username} &middot; {senderAge} yrs
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  {like.sender.city}, {like.sender.country}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onOpenUserProfile?.(like.sender.id)}
                style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-card)",
                  color: "var(--primary)",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Profile &rarr;
              </button>
            </div>

            {/* Direction Arrow & Type */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: like.type === "super_like" ? "rgba(159, 137, 219, 0.2)" : "rgba(139, 29, 65, 0.15)",
                  color: like.type === "super_like" ? "var(--accent-lavender)" : "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ArrowRight size={18} />
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: like.type === "super_like" ? "var(--accent-lavender)" : "var(--primary)",
                }}
              >
                {like.type === "super_like" ? "Super Like" : "Like"}
              </span>
            </div>

            {/* Recipient */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "8px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase" }}>
                Recipient (Target)
              </div>
              <img
                src={like.recipient.avatar}
                alt={like.recipient.name}
                style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border)" }}
              />
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                  <span style={{ fontWeight: 800, fontSize: "14px", color: "var(--text-main)" }}>{like.recipient.name}</span>
                  {like.recipient.isVerified && <ShieldCheck size={13} color="#2563EB" />}
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                  {like.recipient.username} &middot; {recipientAge} yrs
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  {like.recipient.city}, {like.recipient.country}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onOpenUserProfile?.(like.recipient.id)}
                style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-card)",
                  color: "var(--primary)",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Profile &rarr;
              </button>
            </div>
          </div>

          {/* Details Meta Grid */}
          <div
            style={{
              padding: "16px",
              borderRadius: "12px",
              backgroundColor: "var(--bg-main)",
              border: "1px solid var(--border)",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              fontSize: "12.5px",
            }}
          >
            <div>
              <span style={{ color: "var(--text-secondary)" }}>Interaction Status:</span>{" "}
              {like.status === "liked_back" ? (
                <strong style={{ color: "var(--status-success)" }}>Liked Back (Mutual Match)</strong>
              ) : like.status === "pending" ? (
                <strong style={{ color: "#F59E0B" }}>Pending Recipient Response</strong>
              ) : (
                <strong style={{ color: "#6B7280" }}>Passed</strong>
              )}
            </div>

            <div>
              <span style={{ color: "var(--text-secondary)" }}>Resulted in Match:</span>{" "}
              {like.resultedInMatch ? (
                <button
                  type="button"
                  onClick={() => like.matchId && onOpenMatchDetails?.(like.matchId)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--primary)",
                    fontWeight: 700,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Yes (Match #{like.matchId}) &rarr;
                </button>
              ) : (
                <strong>No match yet</strong>
              )}
            </div>

            {like.pointsCost && (
              <div>
                <span style={{ color: "var(--text-secondary)" }}>Reward Points Spent:</span>{" "}
                <strong>{like.pointsCost} Connection Points</strong>
              </div>
            )}

            <div>
              <span style={{ color: "var(--text-secondary)" }}>Safety Reports:</span>{" "}
              {like.isReported ? (
                <strong style={{ color: "var(--status-error)" }}>Flagged ({like.flagReason || "Under review"})</strong>
              ) : (
                <span style={{ color: "var(--text-muted)" }}>None</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--border)",
            backgroundColor: "var(--bg-main)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "12.5px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
