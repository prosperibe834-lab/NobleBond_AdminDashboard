// NobleBond Admin — Flag Interaction Modal
// Administrative flagging for suspicious likes or matches, zero emojis

import React, { useState } from "react";
import { X, ShieldAlert, AlertTriangle } from "lucide-react";
import type { LikeRecord, MatchRecord } from "../../../types/likesMatches.types";

interface FlagInteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: { type: "like" | "match"; item: LikeRecord | MatchRecord } | null;
  onConfirmFlag: (type: "like" | "match", id: string, reason: string) => void;
}

export const FlagInteractionModal: React.FC<FlagInteractionModalProps> = ({
  isOpen,
  onClose,
  target,
  onConfirmFlag,
}) => {
  if (!isOpen || !target) return null;

  return (
    <FlagInteractionForm
      key={`${target.type}_${target.item.id}`}
      target={target}
      onClose={onClose}
      onConfirmFlag={onConfirmFlag}
    />
  );
};

interface FlagInteractionFormProps {
  target: { type: "like" | "match"; item: LikeRecord | MatchRecord };
  onClose: () => void;
  onConfirmFlag: (type: "like" | "match", id: string, reason: string) => void;
}

const FlagInteractionForm: React.FC<FlagInteractionFormProps> = ({
  target,
  onClose,
  onConfirmFlag,
}) => {
  const [reason, setReason] = useState("");

  const handleExecute = () => {
    onConfirmFlag(target.type, target.item.id, reason || "Flagged for administrative safety review");
    onClose();
  };

  const isLike = target.type === "like";
  const likeItem = isLike ? (target.item as LikeRecord) : null;
  const matchItem = !isLike ? (target.item as MatchRecord) : null;

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
                backgroundColor: "rgba(239, 68, 68, 0.12)",
                color: "var(--status-error)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldAlert size={18} />
            </div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
                Flag {target.type === "like" ? "Like" : "Match"} for Safety Review
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Record ID: {target.item.id}
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
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ padding: "14px", backgroundColor: "var(--bg-main)", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "12.5px" }}>
            {isLike && likeItem ? (
              <div>
                <strong>Sender:</strong> {likeItem.sender.name} ({likeItem.sender.username}) &rarr; <strong>Recipient:</strong> {likeItem.recipient.name} ({likeItem.recipient.username})
              </div>
            ) : matchItem ? (
              <div>
                <strong>Matched Couple:</strong> {matchItem.user1.name} & {matchItem.user2.name}
              </div>
            ) : null}
          </div>

          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "6px" }}>
              Reason for Flagging (Required for audit log)
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Unusual rapid succession of likes; potential bot activity or inappropriate behavior."
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-main)",
                color: "var(--text-main)",
                fontSize: "12.5px",
              }}
            />
          </div>

          <div style={{ fontSize: "11px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
            <AlertTriangle size={13} color="#F59E0B" />
            <span>Flagging marks this interaction for Trust & Safety review without disrupting valid user access.</span>
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
            gap: "10px",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "9px 16px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "12.5px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleExecute}
            style={{
              padding: "9px 18px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "var(--status-error)",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "12.5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <ShieldAlert size={14} /> Confirm Flag
          </button>
        </div>
      </div>
    </div>
  );
};

