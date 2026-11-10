// NobleBond Admin — Transaction & Failed Payment Inspection Modal
// Displays PCI-safe masked payment metadata, provider reference, failure codes, retry history, and status refresh. Zero emojis.

import React from "react";
import {
  X,
  CreditCard,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import type { SubscriptionTransactionRecord } from "../../../types/subscriptionManagement.types";
import { Badge } from "../../common/Badge";
import {
  formatMoney,
  formatDateTime,
  getTransactionStatusMeta,
  getPaymentProviderLabel,
} from "../subscriptionUiUtils";

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: SubscriptionTransactionRecord | null;
  onRefreshPaymentStatus: (transactionId: string) => void;
  onOpenUserProfile: (userId: string) => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  isOpen,
  onClose,
  transaction,
  onRefreshPaymentStatus,
  onOpenUserProfile,
}) => {
  if (!isOpen || !transaction) return null;

  const statusMeta = getTransactionStatusMeta(transaction.status);

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
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        className="animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "580px",
          maxHeight: "90vh",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid var(--border)",
            backgroundColor: "var(--bg-surface-elevated)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <CreditCard size={20} color="var(--primary)" />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h2 style={{ fontSize: "16.5px", fontWeight: 800, color: "var(--text-main)", margin: 0 }}>
                  {transaction.id}
                </h2>
                <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
              </div>
              <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                Invoice: {transaction.invoiceRef} &bull; Subscription: {transaction.subscriptionId}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: "20px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Amount & Plan Banner */}
          <div
            style={{
              padding: "16px",
              borderRadius: "14px",
              backgroundColor: "var(--bg-surface-elevated)",
              border: "1px solid var(--border-light)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                PREMIUM TRANSACTION AMOUNT
              </div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>
                {formatMoney(transaction.amount, transaction.currencySymbol)}{" "}
                <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{transaction.currency}</span>
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                {transaction.planName} ({transaction.billingPeriodLabel})
              </div>
            </div>
            <div style={{ textAlign: "right", fontSize: "12px", color: "var(--text-secondary)" }}>
              <div style={{ fontWeight: 700, color: "var(--text-main)" }}>
                {transaction.transactionType.replace(/_/g, " ").toUpperCase()}
              </div>
              <div>{formatDateTime(transaction.timestamp)}</div>
            </div>
          </div>

          {/* Subscriber Info */}
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img
                src={transaction.userAvatar}
                alt={transaction.userName}
                style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }}
              />
              <div>
                <div style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "13.5px" }}>
                  {transaction.userName} ({transaction.username})
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>{transaction.userEmail}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpenUserProfile(transaction.userId)}
              style={{
                padding: "6px 10px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--primary)",
                fontSize: "11.5px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              User <ExternalLink size={11} />
            </button>
          </div>

          {/* Masked Payment Metadata */}
          <div
            style={{
              padding: "14px",
              borderRadius: "12px",
              backgroundColor: "var(--bg-app)",
              border: "1px solid var(--border)",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              fontSize: "12.5px",
            }}
          >
            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Payment Provider</div>
              <div style={{ fontWeight: 700 }}>{getPaymentProviderLabel(transaction.paymentProvider)}</div>
            </div>
            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Safe Payment Method</div>
              <div style={{ fontWeight: 700 }}>{transaction.maskedPaymentMethod}</div>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Provider Reference Token</div>
              <div style={{ fontFamily: "monospace", fontSize: "12px" }}>{transaction.providerReference}</div>
            </div>
          </div>

          {/* Failed Payment Details */}
          {transaction.status === "failed" && (
            <div
              style={{
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "var(--status-error-bg)",
                border: "1px solid rgba(201, 54, 79, 0.3)",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 800, color: "var(--status-error)", fontSize: "13px" }}>
                <AlertTriangle size={15} /> Failure Diagnostics & Retry State
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-main)" }}>
                <strong>Failure Code:</strong> <code>{transaction.failureCode}</code>
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-main)" }}>
                <strong>Reason:</strong> {transaction.failureReason}
              </div>
              <div style={{ fontSize: "11.5px", fontFamily: "monospace", color: "var(--text-secondary)", backgroundColor: "var(--bg-card)", padding: "8px", borderRadius: "8px" }}>
                {transaction.providerResponse}
              </div>
              <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                Retry Status: <strong>{(transaction.retryStatus || "retry_pending").replace(/_/g, " ").toUpperCase()}</strong> &bull; Attempts: {transaction.retryCount || 1} &bull; Next Scheduled: {transaction.nextRetryScheduledAt ? formatDateTime(transaction.nextRetryScheduledAt) : "Manual / Member Update Required"}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", fontStyle: "italic" }}>
                Authorized retry charges are processed exclusively by backend/provider billing webhooks. Frontend admin controls do not charge customer cards.
              </div>
            </div>
          )}

          {transaction.refundedAmount && transaction.refundedAmount > 0 && (
            <div
              style={{
                padding: "12px",
                borderRadius: "10px",
                backgroundColor: "var(--status-info-bg)",
                fontSize: "12.5px",
                color: "var(--text-main)",
              }}
            >
              <strong>Refund Applied:</strong> {formatMoney(transaction.refundedAmount, transaction.currencySymbol)} {transaction.currency} refunded on this record.
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "var(--text-muted)" }}>
            <ShieldCheck size={13} color="var(--status-success)" />
            <span>Sensitive card numbers and CVVs are strictly redacted and never stored.</span>
          </div>
        </div>

        <div
          style={{
            padding: "14px 24px",
            borderTop: "1px solid var(--border)",
            backgroundColor: "var(--bg-surface-elevated)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {transaction.status === "failed" ? (
            <button
              type="button"
              onClick={() => onRefreshPaymentStatus(transaction.id)}
              style={{
                padding: "8px 14px",
                borderRadius: "9px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-main)",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <RefreshCw size={13} /> Sync Provider Status Check
            </button>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 18px",
              borderRadius: "9px",
              border: "none",
              backgroundColor: "var(--primary)",
              color: "#FFFFFF",
              fontSize: "12.5px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

