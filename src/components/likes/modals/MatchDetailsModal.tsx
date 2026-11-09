// NobleBond Admin — Comprehensive Match Details Modal
// Detailed mutual match inspector, timeline, conversation metadata, zero emojis

import React from "react";
import {
  X,
  Heart,
  HeartHandshake,
  MessageSquare,
  ShieldCheck,
  ShieldAlert,
  Clock,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Info,
} from "lucide-react";
import type { MatchRecord } from "../../../types/likesMatches.types";
import { calculateAge } from "../../../data/likesMatchesDataService";

interface MatchDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: MatchRecord | null;
  onOpenRestoreModal: (match: MatchRecord) => void;
  onOpenUserProfile?: (userId: string) => void;
  onFlagMatch: (match: MatchRecord) => void;
}

export const MatchDetailsModal: React.FC<MatchDetailsModalProps> = ({
  isOpen,
  onClose,
  match,
  onOpenRestoreModal,
  onOpenUserProfile,
  onFlagMatch,
}) => {
  if (!isOpen || !match) return null;

  const age1 = calculateAge(match.user1.dateOfBirth);
  const age2 = calculateAge(match.user2.dateOfBirth);

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
          maxWidth: "880px",
          maxHeight: "92vh",
          backgroundColor: "var(--bg-card)",
          borderRadius: "24px",
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
            padding: "20px 24px",
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
              <HeartHandshake size={20} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "17px", fontWeight: 800, color: "var(--text-main)" }}>
                  Confirmed Mutual Match #{match.id}
                </span>
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    backgroundColor:
                      match.status === "active"
                        ? "rgba(16, 185, 129, 0.12)"
                        : match.status === "unmatched"
                        ? "rgba(107, 114, 128, 0.12)"
                        : "rgba(239, 68, 68, 0.12)",
                    color:
                      match.status === "active"
                        ? "var(--status-success)"
                        : match.status === "unmatched"
                        ? "#6B7280"
                        : "var(--status-error)",
                  }}
                >
                  {match.status}
                </span>
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                Confirmed {new Date(match.matchDate).toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" })} &middot; Duration: {match.durationDays} days
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

        {/* Content Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Paired User Dossiers */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {/* User 1 */}
            <div
              style={{
                backgroundColor: "var(--bg-main)",
                borderRadius: "16px",
                border: "1px solid var(--border)",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img
                  src={match.user1.avatar}
                  alt={match.user1.name}
                  style={{ width: "52px", height: "52px", borderRadius: "14px", objectFit: "cover", border: "2px solid var(--primary)" }}
                />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "15px", fontWeight: 800, color: "var(--text-main)" }}>
                      {match.user1.name}
                    </span>
                    {match.user1.isVerified && <ShieldCheck size={14} color="#2563EB" />}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    {match.user1.username} &middot; {age1} yrs &middot; {match.user1.city}, {match.user1.country}
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "11.5px", marginTop: "4px" }}>
                <div><span style={{ color: "var(--text-secondary)" }}>User ID:</span> <strong>{match.user1.id}</strong></div>
                <div><span style={{ color: "var(--text-secondary)" }}>Tier:</span> <strong style={{ textTransform: "capitalize" }}>{match.user1.premiumTier}</strong></div>
                <div><span style={{ color: "var(--text-secondary)" }}>Gender:</span> <strong style={{ textTransform: "capitalize" }}>{match.user1.gender}</strong></div>
                <div><span style={{ color: "var(--text-secondary)" }}>Status:</span> <strong style={{ color: "var(--status-success)" }}>Active Account</strong></div>
              </div>

              <button
                type="button"
                onClick={() => onOpenUserProfile?.(match.user1.id)}
                style={{
                  marginTop: "6px",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-card)",
                  color: "var(--primary)",
                  fontSize: "11.5px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                Open {match.user1.name}&apos;s Profile <ExternalLink size={12} />
              </button>
            </div>

            {/* User 2 */}
            <div
              style={{
                backgroundColor: "var(--bg-main)",
                borderRadius: "16px",
                border: "1px solid var(--border)",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img
                  src={match.user2.avatar}
                  alt={match.user2.name}
                  style={{ width: "52px", height: "52px", borderRadius: "14px", objectFit: "cover", border: "2px solid var(--primary)" }}
                />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "15px", fontWeight: 800, color: "var(--text-main)" }}>
                      {match.user2.name}
                    </span>
                    {match.user2.isVerified && <ShieldCheck size={14} color="#2563EB" />}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    {match.user2.username} &middot; {age2} yrs &middot; {match.user2.city}, {match.user2.country}
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "11.5px", marginTop: "4px" }}>
                <div><span style={{ color: "var(--text-secondary)" }}>User ID:</span> <strong>{match.user2.id}</strong></div>
                <div><span style={{ color: "var(--text-secondary)" }}>Tier:</span> <strong style={{ textTransform: "capitalize" }}>{match.user2.premiumTier}</strong></div>
                <div><span style={{ color: "var(--text-secondary)" }}>Gender:</span> <strong style={{ textTransform: "capitalize" }}>{match.user2.gender}</strong></div>
                <div><span style={{ color: "var(--text-secondary)" }}>Status:</span> <strong style={{ color: "var(--status-success)" }}>Active Account</strong></div>
              </div>

              <button
                type="button"
                onClick={() => onOpenUserProfile?.(match.user2.id)}
                style={{
                  marginTop: "6px",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-card)",
                  color: "var(--primary)",
                  fontSize: "11.5px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                Open {match.user2.name}&apos;s Profile <ExternalLink size={12} />
              </button>
            </div>
          </div>

          {/* Mutual Like Timeline */}
          <div
            style={{
              padding: "16px",
              backgroundColor: "var(--bg-main)",
              borderRadius: "14px",
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)", marginBottom: "12px" }}>
              Mutual Like Verification Timeline
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {/* Event 1 */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "rgba(139, 29, 65, 0.1)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                  <Heart size={12} />
                </div>
                <div>
                  <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)" }}>
                    Initial Like Sent: {match.user1.name} &rarr; {match.user2.name}
                  </div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                    {new Date(match.originatingLikes.user1ToUser2.timestamp).toLocaleString()} &middot; Type: {match.originatingLikes.user1ToUser2.type} (ID: {match.originatingLikes.user1ToUser2.likeId})
                  </div>
                </div>
              </div>

              {/* Event 2 */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "rgba(16, 185, 129, 0.12)", color: "var(--status-success)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                  {match.originatingLikes.user2ToUser1.type === "super_like" ? <Sparkles size={12} /> : <Heart size={12} />}
                </div>
                <div>
                  <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)" }}>
                    Reciprocal Like: {match.user2.name} &rarr; {match.user1.name}
                  </div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                    {new Date(match.originatingLikes.user2ToUser1.timestamp).toLocaleString()} &middot; Type: {match.originatingLikes.user2ToUser1.type} (ID: {match.originatingLikes.user2ToUser1.likeId})
                  </div>
                </div>
              </div>

              {/* Event 3 */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "rgba(16, 185, 129, 0.2)", color: "var(--status-success)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                  <HeartHandshake size={12} />
                </div>
                <div>
                  <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--status-success)" }}>
                    Mutual Match Confirmed by Platform
                  </div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                    {new Date(match.matchDate).toLocaleString()} &middot; Match channel enabled for both participants.
                  </div>
                </div>
              </div>

              {/* Event 4 (If unmatched) */}
              {match.status === "unmatched" && match.unmatchInfo && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "rgba(107, 114, 128, 0.15)", color: "#6B7280", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                    <Clock size={12} />
                  </div>
                  <div>
                    <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#6B7280" }}>
                      Relationship Unmatched by {match.unmatchInfo.unmatcherName}
                    </div>
                    <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                      {new Date(match.unmatchInfo.unmatchDate).toLocaleString()} &middot; Reason: {match.unmatchInfo.reason || "No voluntary reason given"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Conversation Metadata (Privacy Safe) */}
          <div
            style={{
              padding: "16px",
              backgroundColor: "var(--bg-main)",
              borderRadius: "14px",
              border: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>
                <MessageSquare size={16} color="var(--status-info)" />
                Direct Messaging Telemetry
              </div>
              <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
                Total message count: <strong>{match.conversation.messageCount}</strong> &middot; Last message:{" "}
                {match.conversation.lastActivityTimestamp
                  ? new Date(match.conversation.lastActivityTimestamp).toLocaleString()
                  : "Never"}
              </div>
            </div>

            <div
              style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                backgroundColor: "var(--bg-card)",
                padding: "6px 10px",
                borderRadius: "6px",
                border: "1px solid var(--border)",
              }}
            >
              Private chat contents are quarantined under Chat Management.
            </div>
          </div>

          {/* Compatibility Note (Requirement: Postponed for future release) */}
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "12px",
              backgroundColor: "rgba(159, 137, 219, 0.08)",
              border: "1px solid rgba(159, 137, 219, 0.2)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              color: "var(--text-secondary)",
            }}
          >
            <Info size={16} color="var(--accent-lavender)" />
            <span>
              <strong>Compatibility Engine:</strong> AI Match Compatibility score computation has been postponed for a later NobleBond release.
            </span>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--border)",
            backgroundColor: "var(--bg-main)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            type="button"
            onClick={() => onFlagMatch(match)}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid var(--status-error)",
              backgroundColor: "var(--status-error-bg)",
              color: "var(--status-error)",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <ShieldAlert size={14} /> Flag Match for Review
          </button>

          <div style={{ display: "flex", gap: "10px" }}>
            {match.status === "unmatched" && (
              <button
                type="button"
                onClick={() => onOpenRestoreModal(match)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "var(--status-success)",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <RotateCcw size={14} /> Validate & Restore Match
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-secondary)",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

