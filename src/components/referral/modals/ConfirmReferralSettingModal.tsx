import React, { useState } from "react";
import { ShieldCheck, AlertTriangle, X } from "lucide-react";

interface ConfirmReferralSettingModalProps {
  title: string;
  description: string;
  confirmLabel: string;
  requireReasonInput?: boolean;
  defaultReason?: string;
  isDanger?: boolean;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}

export const ConfirmReferralSettingModal: React.FC<
  ConfirmReferralSettingModalProps
> = ({
  title,
  description,
  confirmLabel,
  requireReasonInput = true,
  defaultReason = "",
  isDanger = false,
  onCancel,
  onConfirm,
}) => {
  const [reason, setReason] = useState(defaultReason);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requireReasonInput && reason.trim().length < 4) return;
    onConfirm(reason.trim() || "Confirmed administrative referral action");
  };

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
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "18px",
          padding: "22px",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {isDanger ? (
              <AlertTriangle size={20} style={{ color: "var(--status-error)" }} />
            ) : (
              <ShieldCheck size={20} style={{ color: "var(--primary)" }} />
            )}
            <h3 style={{ margin: 0, fontSize: "1.02rem", fontWeight: 700, color: "var(--text-main)" }}>
              {title}
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

        <p style={{ margin: 0, fontSize: "0.83rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
          {description}
        </p>

        {requireReasonInput && (
          <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-main)" }}>
            Mandatory Audit Reason
            <textarea
              rows={2}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Document exact reason for Referral Audit History..."
              style={{
                padding: "9px 10px",
                borderRadius: "9px",
                border: "1px solid var(--border)",
                background: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                fontSize: "0.82rem",
              }}
            />
          </label>
        )}

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
            type="submit"
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
      </form>
    </div>
  );
};

