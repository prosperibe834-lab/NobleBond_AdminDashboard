import React from "react";
import { useNavigate } from "react-router-dom";
import { X, ExternalLink, FileText, ShieldCheck } from "lucide-react";
import type { UnifiedFinancialTransaction } from "../../../types/walletManagement.types";
import { Badge } from "../../common/Badge";
import {
  formatDateTime,
  formatPaymentProviderLabel,
  formatTxValue,
  getCategoryMeta,
  getTxStatusMeta,
  getTxTypeLabel,
} from "../walletUiUtils";

interface TransactionInspectionDrawerProps {
  transaction: UnifiedFinancialTransaction | null;
  onClose: () => void;
  onOpenUserWallet: (userId: string) => void;
}

export const TransactionInspectionDrawer: React.FC<
  TransactionInspectionDrawerProps
> = ({ transaction, onClose, onOpenUserWallet }) => {
  const navigate = useNavigate();
  if (!transaction) return null;

  const catMeta = getCategoryMeta(transaction.category);
  const valMeta = formatTxValue(transaction);
  const stMeta = getTxStatusMeta(transaction.status);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 95,
        background: "rgba(0, 0, 0, 0.56)",
        display: "flex",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "460px",
          height: "100%",
          background: "var(--bg-card)",
          borderLeft: "1px solid var(--border)",
          padding: "22px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflowY: "auto",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Drawer Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: catMeta.accentBg,
                  color: catMeta.accentColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FileText size={18} />
              </div>
              <div>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--primary)" }}>
                  {transaction.id}
                </div>
                <h3 style={{ margin: 0, fontSize: "1.02rem", fontWeight: 700, color: "var(--text-main)" }}>
                  Financial Ledger Record
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
                borderRadius: "8px",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Primary Amount Banner */}
          <div
            style={{
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              padding: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: "0.73rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                {getTxTypeLabel(transaction.transactionType)}
              </div>
              <div style={{ fontSize: "1.45rem", fontWeight: 800, color: valMeta.toneColor }}>
                {valMeta.primaryText}
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                Ledger Unit: {valMeta.unitLabel}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
              <Badge variant={stMeta.variant} size="sm">{stMeta.label}</Badge>
              <Badge variant={catMeta.variant} size="sm">{catMeta.label}</Badge>
            </div>
          </div>

          {/* Member Strip */}
          <div
            style={{
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border-light)",
              borderRadius: "12px",
              padding: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img
                src={transaction.userAvatar}
                alt={transaction.userName}
                style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }}
              />
              <div>
                <div style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "0.88rem" }}>
                  {transaction.userName}
                </div>
                <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                  @{transaction.username} ({transaction.userId})
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenUserWallet(transaction.userId);
              }}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text-main)",
                borderRadius: "8px",
                padding: "6px 10px",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Inspect Wallet
            </button>
          </div>

          {/* Metadata Table */}
          <div
            style={{
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border-light)",
              borderRadius: "12px",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              fontSize: "0.81rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
              <span style={{ color: "var(--text-muted)" }}>Description</span>
              <span style={{ color: "var(--text-main)", fontWeight: 600, textAlign: "right" }}>
                {transaction.title}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
              <span style={{ color: "var(--text-muted)" }}>Timestamp</span>
              <span style={{ color: "var(--text-main)", fontWeight: 600 }}>
                {formatDateTime(transaction.timestamp)}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
              <span style={{ color: "var(--text-muted)" }}>External / Ledger Ref</span>
              <span style={{ color: "var(--text-main)", fontWeight: 600 }}>{transaction.referenceId}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
              <span style={{ color: "var(--text-muted)" }}>Related Service</span>
              <span style={{ color: "var(--text-main)", fontWeight: 600, textAlign: "right" }}>
                {transaction.relatedServiceLabel}
              </span>
            </div>
            {transaction.paymentProviderLabel && (
              <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                <span style={{ color: "var(--text-muted)" }}>Payment Rail</span>
                <span style={{ color: "var(--text-main)", fontWeight: 600 }}>
                  {formatPaymentProviderLabel(transaction.paymentProviderLabel)}
                </span>
              </div>
            )}
            {transaction.maskedPaymentMethod && (
              <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                <span style={{ color: "var(--text-muted)" }}>Masked Method</span>
                <span style={{ color: "var(--text-main)", fontWeight: 600 }}>
                  {transaction.maskedPaymentMethod}
                </span>
              </div>
            )}
            {(transaction.previousBalance !== undefined || transaction.newBalance !== undefined) && (
              <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                <span style={{ color: "var(--text-muted)" }}>Virtual Balance Snapshot</span>
                <span style={{ color: "var(--primary)", fontWeight: 700 }}>
                  {transaction.previousBalance ?? "--"} -&gt; {transaction.newBalance ?? "--"}
                </span>
              </div>
            )}
            {transaction.notes && (
              <div style={{ paddingTop: "8px", borderTop: "1px solid var(--border-light)" }}>
                <div style={{ color: "var(--text-muted)", fontSize: "0.74rem", marginBottom: "4px" }}>
                  Verification / Notes
                </div>
                <div style={{ color: "var(--text-secondary)", lineHeight: 1.45 }}>
                  {transaction.notes}
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              padding: "10px 12px",
              borderRadius: "10px",
              background: "var(--status-info-bg)",
              color: "var(--text-secondary)",
              fontSize: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <ShieldCheck size={15} style={{ color: "var(--status-info)", flexShrink: 0 }} />
            <span>
              Financial ledger records are immutable; corrections must be executed as new ledger adjustments or reversals.
            </span>
          </div>
        </div>

        {/* Footer Deep Links */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate(`/users?userId=${encodeURIComponent(transaction.userId)}`);
            }}
            style={{
              flex: 1,
              padding: "9px 12px",
              borderRadius: "9px",
              border: "1px solid var(--border)",
              background: "var(--bg-surface-elevated)",
              color: "var(--text-main)",
              fontSize: "0.79rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
            }}
          >
            <span>User Profile</span>
            <ExternalLink size={13} />
          </button>

          {transaction.category === "premium_subscription" && (
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate("/subscriptions");
              }}
              style={{
                flex: 1,
                padding: "9px 12px",
                borderRadius: "9px",
                border: "none",
                background: "var(--primary)",
                color: "#fff",
                fontSize: "0.79rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
              }}
            >
              <span>Subscriptions</span>
              <ExternalLink size={13} />
            </button>
          )}

          {transaction.transactionType === "gift_sent" && (
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate("/live");
              }}
              style={{
                flex: 1,
                padding: "9px 12px",
                borderRadius: "9px",
                border: "none",
                background: "var(--primary)",
                color: "#fff",
                fontSize: "0.79rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
              }}
            >
              <span>Live Sessions</span>
              <ExternalLink size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
