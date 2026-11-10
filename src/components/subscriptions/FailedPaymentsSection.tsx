// NobleBond Admin — Failed Payments & Dunning Risk Section
// Dedicated triage for payment failures, provider decline codes, retry schedules, and past-due subscriptions. Zero emojis.

import React, { useState, useMemo } from "react";
import {
  AlertTriangle,
  RefreshCw,
  Eye,
  ShieldAlert,
  ExternalLink,
} from "lucide-react";
import type {
  SubscriptionTransactionRecord,
  SubscriptionRecord,
} from "../../types/subscriptionManagement.types";
import { Badge } from "../common/Badge";
import {
  formatMoney,
  formatDateTime,
  getPaymentProviderLabel,
  getSubscriptionStatusMeta,
} from "./subscriptionUiUtils";

interface FailedPaymentsSectionProps {
  transactions: SubscriptionTransactionRecord[];
  subscriptions: SubscriptionRecord[];
  onInspectFailedPayment: (tx: SubscriptionTransactionRecord) => void;
  onRefreshPaymentStatus: (transactionId: string) => void;
  onInspectSubscription: (sub: SubscriptionRecord) => void;
  onOpenUserProfile: (userId: string) => void;
}

export const FailedPaymentsSection: React.FC<FailedPaymentsSectionProps> = ({
  transactions,
  subscriptions,
  onInspectFailedPayment,
  onRefreshPaymentStatus,
  onInspectSubscription,
  onOpenUserProfile,
}) => {
  const [filterMode, setFilterMode] = useState<
    "all" | "payment_failed" | "retry_pending" | "past_due" | "at_risk"
  >("all");

  const failedItems = useMemo(() => {
    const txs = transactions.filter((t) => t.status === "failed");
    return txs.filter((tx) => {
      const sub = subscriptions.find((s) => s.id === tx.subscriptionId);
      if (filterMode === "payment_failed") return tx.status === "failed";
      if (filterMode === "retry_pending")
        return tx.retryStatus === "retry_pending" || tx.retryStatus === "retry_scheduled";
      if (filterMode === "past_due") return sub?.status === "past_due" || sub?.status === "grace_period";
      if (filterMode === "at_risk") return (tx.retryCount || 0) >= 1 || sub?.status === "past_due";
      return true;
    });
  }, [transactions, subscriptions, filterMode]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Honest Dunning & Retry Notice */}
      <div
        style={{
          padding: "12px 16px",
          borderRadius: "12px",
          backgroundColor: "var(--status-error-bg)",
          border: "1px solid rgba(201, 54, 79, 0.25)",
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
          fontSize: "12px",
          color: "var(--text-main)",
        }}
      >
        <ShieldAlert size={16} color="var(--status-error)" style={{ flexShrink: 0, marginTop: "2px" }} />
        <div>
          <strong>Provider Billing Integrity Notice:</strong> Refreshing status performs a read-only sync check in demonstration mode. Failed payments cannot be resolved by fake frontend charges — real recovery relies on Stripe Smart Retries, Apple/Google Play billing grace retries, or member payment method update.
        </div>
      </div>

      {/* Filter Pills */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {[
          { id: "all" as const, label: "All Failed & At-Risk" },
          { id: "payment_failed" as const, label: "Payment Failed" },
          { id: "retry_pending" as const, label: "Retry Pending / Scheduled" },
          { id: "past_due" as const, label: "Past Due / Grace Period" },
          { id: "at_risk" as const, label: "Subscriptions at Risk" },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilterMode(f.id)}
            style={{
              padding: "7px 13px",
              borderRadius: "9px",
              border: filterMode === f.id ? "1px solid var(--primary)" : "1px solid var(--border)",
              backgroundColor: filterMode === f.id ? "var(--bg-active)" : "var(--bg-card)",
              color: filterMode === f.id ? "var(--primary)" : "var(--text-secondary)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Failed Billing Table */}
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          overflowX: "auto",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          <thead>
            <tr
              style={{
                backgroundColor: "var(--bg-surface-elevated)",
                borderBottom: "1px solid var(--border)",
                color: "var(--text-muted)",
                fontSize: "11.5px",
              }}
            >
              <th style={{ padding: "12px 14px" }}>TXN & SUB ID</th>
              <th style={{ padding: "12px 14px" }}>SUBSCRIBER</th>
              <th style={{ padding: "12px 14px" }}>PLAN & AMOUNT</th>
              <th style={{ padding: "12px 14px" }}>PROVIDER</th>
              <th style={{ padding: "12px 14px" }}>FAILURE REASON & CODE</th>
              <th style={{ padding: "12px 14px" }}>RETRY STATUS</th>
              <th style={{ padding: "12px 14px" }}>SUB STATUS</th>
              <th style={{ padding: "12px 14px" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {failedItems.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: "36px", textAlign: "center", color: "var(--text-secondary)" }}>
                  No failed payment transactions match this filter.
                </td>
              </tr>
            ) : (
              failedItems.map((tx) => {
                const sub = subscriptions.find((s) => s.id === tx.subscriptionId);
                const subMeta = sub ? getSubscriptionStatusMeta(sub.status) : null;
                return (
                  <tr key={tx.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                      <div style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--status-error)" }}>
                        {tx.id}
                      </div>
                      <button
                        type="button"
                        onClick={() => sub && onInspectSubscription(sub)}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          fontSize: "11px",
                          fontFamily: "monospace",
                          color: "var(--primary)",
                          cursor: sub ? "pointer" : "default",
                          textDecoration: sub ? "underline" : "none",
                        }}
                      >
                        {tx.subscriptionId}
                      </button>
                    </td>

                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <img
                          src={tx.userAvatar}
                          alt={tx.userName}
                          style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{tx.userName}</div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{tx.username}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ fontWeight: 600 }}>{tx.planName}</div>
                      <div style={{ fontSize: "12px", fontWeight: 800, color: "var(--text-main)" }}>
                        {formatMoney(tx.amount, tx.currencySymbol)} {tx.currency}
                      </div>
                    </td>

                    <td style={{ padding: "12px 14px", fontSize: "12px", color: "var(--text-secondary)" }}>
                      <div>{getPaymentProviderLabel(tx.paymentProvider)}</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{tx.maskedPaymentMethod}</div>
                    </td>

                    <td style={{ padding: "12px 14px", maxWidth: "240px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: 700, color: "var(--status-error)" }}>
                        <AlertTriangle size={12} />
                        <span>{tx.failureCode || "decline"}</span>
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                        {tx.failureReason}
                      </div>
                      <div style={{ fontSize: "10.5px", color: "var(--text-muted)", marginTop: "2px" }}>
                        Failed: {formatDateTime(tx.timestamp)}
                      </div>
                    </td>

                    <td style={{ padding: "12px 14px", fontSize: "12px" }}>
                      <Badge variant="warning">
                        {(tx.retryStatus || "retry_pending").replace(/_/g, " ")}
                      </Badge>
                      <div style={{ fontSize: "10.5px", color: "var(--text-muted)", marginTop: "4px" }}>
                        Attempts: {tx.retryCount || 1}
                      </div>
                    </td>

                    <td style={{ padding: "12px 14px" }}>
                      {subMeta ? <Badge variant={subMeta.variant}>{subMeta.label}</Badge> : <Badge variant="error">Past Due</Badge>}
                    </td>

                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          type="button"
                          onClick={() => onInspectFailedPayment(tx)}
                          style={{
                            padding: "5px 9px",
                            borderRadius: "7px",
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
                          <Eye size={12} /> Inspect
                        </button>
                        <button
                          type="button"
                          onClick={() => onRefreshPaymentStatus(tx.id)}
                          style={{
                            padding: "5px 8px",
                            borderRadius: "7px",
                            border: "1px solid var(--border)",
                            backgroundColor: "var(--bg-surface)",
                            color: "var(--text-main)",
                            fontSize: "11.5px",
                            cursor: "pointer",
                          }}
                          title="Sync Provider Payment Status"
                        >
                          <RefreshCw size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenUserProfile(tx.userId)}
                          style={{
                            padding: "5px 8px",
                            borderRadius: "7px",
                            border: "1px solid var(--border)",
                            backgroundColor: "var(--bg-surface)",
                            color: "var(--text-secondary)",
                            fontSize: "11.5px",
                            cursor: "pointer",
                          }}
                          title="View User Record"
                        >
                          <ExternalLink size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

