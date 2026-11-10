import React from "react";
import { RotateCcw, AlertTriangle, X } from "lucide-react";

interface ConfirmWalletResetModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirmReset: () => void;
}

export const ConfirmWalletResetModal: React.FC<ConfirmWalletResetModalProps> = ({
  isOpen,
  onCancel,
  onConfirmReset,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 105,
        background: "rgba(0, 0, 0, 0.62)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "430px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "18px",
          padding: "22px",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertTriangle size={20} style={{ color: "var(--status-error)" }} />
            <h3 style={{ margin: 0, fontSize: "1.02rem", fontWeight: 700, color: "var(--text-main)" }}>
              Reset Financial Demo Data?
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ margin: "0 0 18px 0", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
          This restores Wallet & Financial Management demo purchases, rewards queue, adjustments, reconciliation statuses, and wallet audit logs back to their clean initial baseline.
        </p>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--bg-surface-elevated)",
              color: "var(--text-main)",
              fontSize: "0.83rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirmReset}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              background: "var(--status-error)",
              color: "#fff",
              fontSize: "0.83rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <RotateCcw size={14} />
            <span>Confirm Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

