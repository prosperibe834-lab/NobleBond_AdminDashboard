import React, { useState } from "react";
import { X, Heart, Plus } from "lucide-react";
import type { NobleUser } from "../../../types/userManagement.types";

interface GrantLikesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: NobleUser | null;
  onConfirm: (userId: string, count: number, reason: string, adminNote?: string) => void;
}

export const GrantLikesModal: React.FC<GrantLikesModalProps> = ({
  isOpen,
  onClose,
  user,
  onConfirm,
}) => {
  const [likesCount, setLikesCount] = useState("10");
  const [reason, setReason] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !user) return null;

  const currentAllowance = user.datingStats.additionalLikesAllowance;
  const numLikes = parseInt(likesCount, 10) || 0;
  const newTotal = currentAllowance + numLikes;

  const handleConfirm = () => {
    if (numLikes <= 0) {
      setError("Please specify at least 1 additional like");
      return;
    }
    if (!reason.trim()) {
      setError("Please enter a reason for awarding likes");
      return;
    }
    onConfirm(user.id, numLikes, reason.trim(), adminNote.trim() || undefined);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        zIndex: 1100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "var(--bg-card)",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-elevated)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: "rgba(193, 47, 102, 0.1)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Heart size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                Grant Additional Likes Allowance
              </h3>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                {user.name} ({user.username})
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "6px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Allowance calculation display */}
          <div
            style={{
              padding: "14px",
              borderRadius: "12px",
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border)",
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr auto 1fr",
              alignItems: "center",
              textAlign: "center",
              gap: "8px",
            }}
          >
            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>Current Extra</div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>
                {currentAllowance}
              </div>
            </div>

            <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-muted)" }}>+</span>

            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>Granting</div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--primary)", marginTop: "2px" }}>
                {numLikes}
              </div>
            </div>

            <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-muted)" }}>=</span>

            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>New Total</div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--status-success)", marginTop: "2px" }}>
                {newTotal}
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              Number of Additional Likes to Award
            </label>
            <input
              type="number"
              min="1"
              value={likesCount}
              onChange={(e) => {
                setLikesCount(e.target.value);
                if (error) setError("");
              }}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "14px",
                fontWeight: 700,
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              Reason for Granting <span style={{ color: "var(--status-danger)" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. VIP onboarding gift or customer service apology compensation"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError("");
              }}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: `1px solid ${error ? "var(--status-danger)" : "var(--border)"}`,
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            />
            {error && <span style={{ fontSize: "11px", color: "var(--status-danger)" }}>{error}</span>}
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              Internal Admin Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Ticket #4912 approved by CS lead."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            />
          </div>
        </div>

        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid var(--border)",
            backgroundColor: "var(--bg-surface)",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "transparent",
              color: "var(--text-main)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              backgroundColor: "var(--primary)",
              color: "#FFFFFF",
              border: "none",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Plus size={14} />
            <span>Grant Likes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

