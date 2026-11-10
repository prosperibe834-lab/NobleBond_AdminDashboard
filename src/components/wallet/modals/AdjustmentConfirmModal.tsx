import React from "react";
import { ShieldCheck, AlertCircle, X } from "lucide-react";
import type { PendingAdjustmentDraft } from "../FinancialAdjustmentsSection";
import { Badge } from "../../common/Badge";

interface AdjustmentConfirmModalProps {
  draft: PendingAdjustmentDraft | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const AdjustmentConfirmModal: React.FC<AdjustmentConfirmModalProps> = ({
  draft,
  onCancel,
  onConfirm,
}) => {
  if (!draft) return null;

  const isCoins = draft.walletType === "gift_coins";
  const unitLabel = isCoins ? "Gift Coins" : "Connection Points";
  const unitShort = isCoins ? "Coins" : "Pts";
  const currentBal = isCoins
    ? draft.user.giftCoinsBalance
    : draft.user.connectionPointsBalance;
  const isDebit =
    draft.adjustmentType === "debit" || draft.adjustmentType === "reversal";
  const nextBal = isDebit
    ? Math.max(0, currentBal - draft.quantity)
    : currentBal + draft.quantity;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
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
          maxWidth: "460px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "18px",
          padding: "22px",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ShieldCheck size={20} style={{ color: "var(--primary)" }} />
            <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>
              Authorize Financial Ledger Adjustment
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div
          style={{
            padding: "14px",
            borderRadius: "12px",
            background: "var(--bg-surface-elevated)",
            border: "1px solid var(--border-light)",
            marginBottom: "14px",
            display: "flex",
            flexDirection: "column",
            gap: "9px",
            fontSize: "0.83rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-muted)" }}>Member</span>
            <strong style={{ color: "var(--text-main)" }}>{draft.user.name} (@{draft.user.username})</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--text-muted)" }}>Target Ledger</span>
            <Badge variant={isCoins ? "champagne" : "info"} size="sm">{unitLabel}</Badge>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-muted)" }}>Adjustment Operation</span>
            <strong style={{ color: isDebit ? "var(--status-error)" : "var(--status-success)", textTransform: "uppercase" }}>
              {draft.adjustmentType} ({isDebit ? "-" : "+"}{draft.quantity} {unitShort})
            </strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "6px", borderTop: "1px solid var(--border-light)" }}>
            <span style={{ color: "var(--text-muted)" }}>Balance Transition</span>
            <strong style={{ color: "var(--text-main)" }}>
              {currentBal.toLocaleString()} -&gt; {nextBal.toLocaleString()} {unitShort}
            </strong>
          </div>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginBottom: "2px" }}>Mandatory Audit Reason</div>
            <div style={{ color: "var(--text-secondary)" }}>{draft.reason}</div>
          </div>
        </div>

        <div
          style={{
            padding: "10px 12px",
            borderRadius: "10px",
            background: "var(--status-warning-bg)",
            color: "var(--status-warning)",
            fontSize: "0.76rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          <span>
            Confirming writes an immutable entry to Financial Audit History and updates the user&apos;s persistent wallet immediately.
          </span>
        </div>

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
              fontSize: "0.84rem",
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
              background: "var(--primary)",
              color: "#fff",
              fontSize: "0.84rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Confirm Adjustment
          </button>
        </div>
      </div>
    </div>
  );
};

