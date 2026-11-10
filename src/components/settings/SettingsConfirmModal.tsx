import React, { useState } from "react";
import { AlertTriangle, ShieldCheck, X, Users } from "lucide-react";

export interface SettingsConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  impactWarning?: string;
  confirmLabel?: string;
  danger?: boolean;
  requireReason?: boolean;
  requireReauth?: boolean;
  allowTwoPersonStage?: boolean;
  onConfirm: (payload: { reason: string; stageTwoPerson: boolean }) => void;
  onCancel: () => void;
}

export const SettingsConfirmModal: React.FC<SettingsConfirmModalProps> = ({
  open,
  title,
  description,
  impactWarning,
  confirmLabel = "Confirm Change",
  danger = false,
  requireReason = true,
  requireReauth = false,
  allowTwoPersonStage = false,
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = useState("");
  const [reauthCode, setReauthCode] = useState("");
  const [stageTwoPerson, setStageTwoPerson] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const submit = () => {
    if (requireReason && reason.trim().length < 4) {
      setError("Please enter an audit reason (at least 4 characters) before applying this change.");
      return;
    }
    if (requireReauth && reauthCode.trim().length < 4) {
      setError(
        "Demo Re-Authentication Check: enter at least 4 characters (production enforces WebAuthn / TOTP challenge)."
      );
      return;
    }
    setError(null);
    const cleaned = reason.trim() || "Verified administrative configuration update";
    setReason("");
    setReauthCode("");
    setStageTwoPerson(false);
    onConfirm({ reason: cleaned, stageTwoPerson });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 990,
        background: "rgba(15, 10, 20, 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        className="animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(510px, 95vw)",
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: 18,
          boxShadow: "var(--shadow-lg)",
          padding: 22,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: danger ? "var(--status-error-bg)" : "var(--status-warning-bg)",
                color: danger ? "var(--status-error)" : "var(--status-warning)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16.5, color: "var(--text-main)" }}>{title}</h3>
              <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--text-secondary)" }}>
                {description}
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close confirmation dialog"
            onClick={onCancel}
            style={{
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: 6,
              color: "var(--text-main)",
              cursor: "pointer",
            }}
          >
            <X size={15} />
          </button>
        </div>

        {impactWarning && (
          <div
            style={{
              padding: 12,
              borderRadius: 12,
              background: danger ? "var(--status-error-bg)" : "var(--status-warning-bg)",
              border: "1px solid var(--border-light)",
              fontSize: 12.5,
              color: "var(--text-main)",
              lineHeight: 1.5,
            }}
          >
            <strong>Expected Impact:</strong> {impactWarning}
          </div>
        )}

        <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5 }}>
          <span style={{ fontWeight: 700, color: "var(--text-main)" }}>
            Audit Log Reason {requireReason ? "(Required)" : "(Optional)"}
          </span>
          <textarea
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Document why this platform setting or permission change is authorized..."
            style={{
              background: "var(--bg-surface-elevated)",
              color: "var(--text-main)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: "9px 11px",
              fontSize: 13,
              resize: "vertical",
            }}
          />
        </label>

        {requireReauth && (
          <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontWeight: 700,
                color: "var(--primary)",
              }}
            >
              <ShieldCheck size={14} />
              Administrator Re-Authentication Confirmation (Demo Gate)
            </span>
            <input
              type="password"
              value={reauthCode}
              onChange={(e) => setReauthCode(e.target.value)}
              placeholder="Enter demo confirmation code (production requires MFA TOTP / Passkey)"
              style={{
                background: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "8px 11px",
                fontSize: 13,
              }}
            />
          </label>
        )}

        {allowTwoPersonStage && (
          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 9,
              padding: 11,
              borderRadius: 10,
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border-light)",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={stageTwoPerson}
              onChange={(e) => setStageTwoPerson(e.target.checked)}
              style={{ marginTop: 2 }}
            />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontWeight: 700, color: "var(--text-main)" }}>
                <Users size={13} style={{ color: "var(--accent-lavender)" }} />
                Stage for Two-Person Peer Approval Instead of Immediate Local Apply
              </div>
              <div style={{ color: "var(--text-muted)", marginTop: 2 }}>
                Records proposal in Configuration Approval Queue for sign-off by a second Super Administrator.
              </div>
            </div>
          </label>
        )}

        {error && (
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--status-error)" }}>{error}</div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 6 }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "9px 15px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--bg-surface-elevated)",
              color: "var(--text-main)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            style={{
              padding: "9px 16px",
              borderRadius: 10,
              border: "none",
              background: danger ? "var(--status-error)" : "var(--primary)",
              color: "#FFFFFF",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {stageTwoPerson ? "Stage Two-Person Approval" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

