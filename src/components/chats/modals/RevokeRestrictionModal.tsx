// NobleBond Admin — Revoke Messaging Restriction Modal
// Safe sanction revocation with recorded justification, zero emojis

import React, { useState } from "react";
import { X, Unlock, AlertTriangle } from "lucide-react";
import type { MessagingRestrictionRecord } from "../../../types/chatManagement.types";

interface RevokeRestrictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  restriction: MessagingRestrictionRecord | null;
  onRevoke: (restrictionId: string, reason: string) => void;
}

export const RevokeRestrictionModal: React.FC<RevokeRestrictionModalProps> = ({
  isOpen,
  onClose,
  restriction,
  onRevoke,
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !restriction) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please provide a recorded reason for revoking this restriction.");
      return;
    }

    onRevoke(restriction.id, reason.trim());
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
          maxWidth: "480px",
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
                backgroundColor: "rgba(16, 185, 129, 0.12)",
                color: "var(--status-success)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Unlock size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
                Revoke Messaging Restriction
              </h3>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Restore communication privileges for {restriction.targetUser.name}
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
        <form onSubmit={handleSubmit} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
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

          <div
            style={{
              padding: "12px 14px",
              borderRadius: "10px",
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border)",
              fontSize: "12.5px",
            }}
          >
            <div style={{ color: "var(--text-muted)", fontSize: "11px", marginBottom: "4px" }}>
              Active Restriction Rationale:
            </div>
            <div style={{ color: "var(--text-main)", fontWeight: 600 }}>
              {restriction.reason}
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: "11px", marginTop: "6px" }}>
              Scope: {restriction.scope.replace(/_/g, " ")} &bull; Imposed by {restriction.initiatorName}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>
              Revocation Justification (Mandatory)
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Identity reverified through video selfie; warning acknowledged and agreed to guidelines..."
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
                backgroundColor: "var(--status-success)",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Unlock size={15} /> Confirm Revocation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
