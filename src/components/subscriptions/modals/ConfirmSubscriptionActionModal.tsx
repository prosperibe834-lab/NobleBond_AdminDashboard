// NobleBond Admin — Generic Consequential Subscription Confirmation Modal
// Replaces browser confirm/alert with structured justification reason capture and safeguards. Zero emojis.

import React, { useState } from "react";
import { X, AlertTriangle, ShieldAlert } from "lucide-react";

interface ConfirmSubscriptionActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  variant?: "primary" | "warning" | "danger";
  requireReason?: boolean;
  reasonPlaceholder?: string;
  onConfirm: (reason: string) => void;
}

export const ConfirmSubscriptionActionModal: React.FC<ConfirmSubscriptionActionModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  confirmLabel,
  variant = "warning",
  requireReason = true,
  reasonPlaceholder = "Document clear administrative reason for audit history...",
  onConfirm,
}) => {
  const [reason, setReason] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requireReason && !reason.trim()) {
      setErrorMsg("An audit reason is required before executing this administrative change.");
      return;
    }
    onConfirm(reason.trim() || "Confirmed by Administrator.");
    setReason("");
    setErrorMsg(null);
    onClose();
  };

  const accentColor =
    variant === "danger"
      ? "var(--status-error)"
      : variant === "warning"
      ? "var(--status-warning)"
      : "var(--primary)";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10005,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        className="animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "18px",
          boxShadow: "var(--shadow-lg)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            backgroundColor: "var(--bg-surface-elevated)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {variant === "danger" ? (
              <ShieldAlert size={18} color="var(--status-error)" />
            ) : (
              <AlertTriangle size={18} color={accentColor} />
            )}
            <h3 style={{ fontSize: "15.5px", fontWeight: 800, color: "var(--text-main)", margin: 0 }}>
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
            {description}
          </p>

          {errorMsg && (
            <div style={{ fontSize: "12px", color: "var(--status-error)", fontWeight: 600 }}>
              {errorMsg}
            </div>
          )}

          {requireReason && (
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "5px" }}>
                ADMINISTRATIVE REASON *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={2}
                placeholder={reasonPlaceholder}
                style={{
                  width: "100%",
                  padding: "9px 11px",
                  borderRadius: "9px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface-elevated)",
                  color: "var(--text-main)",
                  fontSize: "12.5px",
                  resize: "none",
                }}
              />
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", paddingTop: "8px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 14px",
                borderRadius: "9px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                borderRadius: "9px",
                border: "none",
                backgroundColor: accentColor,
                color: "#FFFFFF",
                fontSize: "12.5px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {confirmLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

