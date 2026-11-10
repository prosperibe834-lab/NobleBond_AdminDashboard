// NobleBond Admin — Impose Messaging Restriction Modal
// Formal administrative sanction assignment with scope and duration, zero emojis

import React, { useState } from "react";
import { X, Lock, AlertTriangle } from "lucide-react";
import { PARTICIPANTS } from "../../../data/likesMatchesDataService";
import type { RestrictionScope } from "../../../types/chatManagement.types";

interface AddRestrictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId?: string;
  targetUserName?: string;
  onImpose: (
    targetUserId: string,
    type: "temporary_restriction" | "permanent_restriction",
    durationDays: number | null,
    scope: RestrictionScope,
    reason: string
  ) => void;
}

export const AddRestrictionModal: React.FC<AddRestrictionModalProps> = ({
  isOpen,
  onClose,
  targetUserId,
  targetUserName,
  onImpose,
}) => {
  const [selectedUserId, setSelectedUserId] = useState(targetUserId || PARTICIPANTS.richard.id);
  const [type, setType] = useState<"temporary_restriction" | "permanent_restriction">("temporary_restriction");
  const [durationDays, setDurationDays] = useState<number>(7);
  const [scope, setScope] = useState<RestrictionScope>("all_messaging");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("A documented justification is mandatory for administrative restrictions.");
      return;
    }

    onImpose(
      targetUserId || selectedUserId,
      type,
      type === "temporary_restriction" ? durationDays : null,
      scope,
      reason.trim()
    );
    onClose();
  };

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
          maxWidth: "520px",
          backgroundColor: "var(--bg-card)",
          borderRadius: "18px",
          border: "1px solid var(--border)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "var(--bg-surface)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: "rgba(220, 38, 38, 0.12)",
                color: "#DC2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Lock size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
                Impose Messaging Restriction
              </h3>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Enforce trust &amp; safety sanction on user account
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "6px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
          {error && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                backgroundColor: "rgba(220, 38, 38, 0.1)",
                border: "1px solid rgba(220, 38, 38, 0.3)",
                color: "#DC2626",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <AlertTriangle size={14} /> {error}
            </div>
          )}

          {/* Target User */}
          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>
              Target User
            </label>
            {targetUserName ? (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--text-main)",
                }}
              >
                {targetUserName} ({targetUserId})
              </div>
            ) : (
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-main)",
                  fontSize: "13px",
                  outline: "none",
                }}
              >
                {Object.values(PARTICIPANTS).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.username}) — {p.city}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Scope */}
          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>
              Restriction Scope
            </label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value as RestrictionScope)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "13px",
                outline: "none",
              }}
            >
              <option value="all_messaging">All Messaging (Direct Chats, Photos &amp; Voice)</option>
              <option value="direct_chat">Direct Text Chats Only</option>
              <option value="media_sending">Media Sending Disabled (Photo, Video &amp; Voice Notes)</option>
              <option value="voice_video_calls">Voice &amp; Video Calls Disabled</option>
            </select>
          </div>

          {/* Duration Type */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>
                Sanction Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "temporary_restriction" | "permanent_restriction")}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-main)",
                  fontSize: "13px",
                  outline: "none",
                }}
              >
                <option value="temporary_restriction">Temporary Restriction</option>
                <option value="permanent_restriction">Permanent Restriction</option>
              </select>
            </div>

            {type === "temporary_restriction" && (
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>
                  Duration
                </label>
                <select
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--bg-surface)",
                    color: "var(--text-main)",
                    fontSize: "13px",
                    outline: "none",
                  }}
                >
                  <option value={1}>24 Hours (Cool-down)</option>
                  <option value={3}>3 Days</option>
                  <option value={7}>7 Days (1 Week)</option>
                  <option value={14}>14 Days (2 Weeks)</option>
                  <option value={30}>30 Days (1 Month)</option>
                </select>
              </div>
            )}
          </div>

          {/* Mandatory Reason */}
          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>
              Administrative Justification (Mandatory)
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError(null);
              }}
              placeholder="State the observed policy violation, reported incident ID, or trust & safety review rationale..."
              rows={3}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "13px",
                outline: "none",
                resize: "vertical",
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-secondary)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "10px 18px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#DC2626",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 2px 8px rgba(220, 38, 38, 0.25)",
              }}
            >
              <Lock size={15} /> Impose Restriction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
