import React from "react";
import { ShieldCheck, AlertTriangle, X } from "lucide-react";

interface ConfirmSupportActionModalProps {
  title: string;
  description: string;
  confirmLabel: string;
  isDanger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmSupportActionModal: React.FC<
  ConfirmSupportActionModalProps
> = ({
  title,
  description,
  confirmLabel,
  isDanger = false,
  onCancel,
  onConfirm,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 106,
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
            {isDanger ? (
              <AlertTriangle size={20} style={{ color: "var(--status-error)" }} />
            ) : (
              <ShieldCheck size={20} style={{ color: "var(--primary)" }} />
            )}
            <h3 style={{ margin: 0, fontSize: "1.02rem", color: "var(--text-main)" }}>
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ margin: "0 0 18px 0", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
          {description}
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
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              background: isDanger ? "var(--status-error)" : "var(--primary)",
              color: "#fff",
              fontSize: "0.83rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

