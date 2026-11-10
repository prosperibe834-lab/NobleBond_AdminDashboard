import React from "react";
import { AlertTriangle, Send, X, ShieldCheck } from "lucide-react";

export interface DispatchConfirmRequest {
  title: string;
  channelLabel: string;
  audienceLabel: string;
  estimatedRecipients: number;
  suppressedCount: number;
  scheduledLabel?: string;
  danger?: boolean;
  confirmButtonText: string;
  onConfirm: () => void;
}

interface NotificationsConfirmModalProps {
  request: DispatchConfirmRequest | null;
  onCancel: () => void;
}

export const NotificationsConfirmModal: React.FC<NotificationsConfirmModalProps> = ({
  request,
  onCancel,
}) => {
  if (!request) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={request.title}
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 990,
        background: "rgba(15, 10, 20, 0.56)",
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
          width: "min(480px, 95vw)",
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: 18,
          boxShadow: "var(--shadow-lg)",
          padding: 22,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: request.danger ? "var(--status-error-bg)" : "var(--bg-active)",
                color: request.danger ? "var(--status-error)" : "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {request.danger ? <AlertTriangle size={18} /> : <Send size={18} />}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16.5, color: "var(--text-main)" }}>
                {request.title}
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>
                Pre-flight consent & duplicate-prevention summary
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

        <div
          style={{
            background: "var(--bg-surface-elevated)",
            border: "1px solid var(--border-light)",
            borderRadius: 12,
            padding: 13,
            display: "flex",
            flexDirection: "column",
            gap: 7,
            fontSize: 12.5,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-secondary)" }}>Delivery Channel</span>
            <strong style={{ color: "var(--text-main)" }}>{request.channelLabel}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-secondary)" }}>Target Segment</span>
            <strong style={{ color: "var(--text-main)" }}>{request.audienceLabel}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-secondary)" }}>Estimated Eligible Recipients</span>
            <strong style={{ color: "var(--primary)" }}>{request.estimatedRecipients} members</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-secondary)" }}>Automatically Excluded / Opted Out</span>
            <strong style={{ color: "var(--status-warning)" }}>{request.suppressedCount} excluded</strong>
          </div>
          {request.scheduledLabel && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Scheduled Dispatch</span>
              <strong style={{ color: "var(--status-info)" }}>{request.scheduledLabel}</strong>
            </div>
          )}
        </div>

        <div
          style={{
            padding: 10,
            borderRadius: 10,
            background: "var(--status-info-bg)",
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
            fontSize: 11.5,
            color: "var(--text-main)",
          }}
        >
          <ShieldCheck size={15} style={{ color: "var(--status-info)", flexShrink: 0, marginTop: 2 }} />
          <span>
            Local Demonstration Execution: Confirms dispatch into local queue & Audit Log without
            claiming live push/email delivery until backend FCM/APNs & SMTP webhooks are connected.
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "8px 14px",
              borderRadius: 9,
              border: "1px solid var(--border)",
              background: "var(--bg-surface-elevated)",
              color: "var(--text-main)",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              request.onConfirm();
              onCancel();
            }}
            style={{
              padding: "8px 16px",
              borderRadius: 9,
              border: "none",
              background: request.danger ? "var(--status-error)" : "var(--primary)",
              color: "#FFFFFF",
              fontSize: 12.5,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {request.confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

