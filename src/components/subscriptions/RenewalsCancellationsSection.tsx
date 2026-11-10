// NobleBond Admin — Renewals & Cancellations Lifecycle Section
// Monitors Upcoming Renewals, Renewed Subscriptions, and Cancellation states respecting end-of-period rules. Zero emojis.

import React, { useState, useMemo } from "react";
import {
  RefreshCw,
  CheckCircle2,
  XCircle,
  Eye,
  ShieldAlert,
} from "lucide-react";
import type {
  SubscriptionRecord,
  SubscriptionTransactionRecord,
} from "../../types/subscriptionManagement.types";
import { Badge } from "../common/Badge";
import {
  formatMoney,
  formatShortDate,
  formatDateTime,
  getSubscriptionStatusMeta,
  getTransactionStatusMeta,
  getPaymentProviderLabel,
} from "./subscriptionUiUtils";

interface RenewalsCancellationsSectionProps {
  subscriptions: SubscriptionRecord[];
  transactions: SubscriptionTransactionRecord[];
  onInspectSubscription: (sub: SubscriptionRecord) => void;
  onInspectTransaction: (tx: SubscriptionTransactionRecord) => void;
}

const REFERENCE_NOW = new Date("2026-11-10T11:00:00Z").getTime();

export const RenewalsCancellationsSection: React.FC<RenewalsCancellationsSectionProps> = ({
  subscriptions,
  transactions,
  onInspectSubscription,
  onInspectTransaction,
}) => {
  const [subView, setSubView] = useState<"upcoming" | "renewed" | "cancellations">("upcoming");
  const [renewalWindow, setRenewalWindow] = useState<"all" | "today" | "7d" | "30d" | "custom">("all");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  // 1. Upcoming Renewals
  const upcomingRenewals = useMemo(() => {
    return subscriptions
      .filter((s) => {
        if (!s.autoRenew || !s.nextRenewalDate || s.isComplimentary) return false;
        const ts = new Date(s.nextRenewalDate).getTime();
        const diffDays = (ts - REFERENCE_NOW) / 86400000;

        if (renewalWindow === "today") return diffDays >= -1 && diffDays <= 1;
        if (renewalWindow === "7d") return diffDays >= -1 && diffDays <= 7;
        if (renewalWindow === "30d") return diffDays >= -1 && diffDays <= 30;
        if (renewalWindow === "custom") {
          const okStart = customStart ? ts >= new Date(customStart).getTime() : true;
          const okEnd = customEnd ? ts <= new Date(customEnd + "T23:59:59Z").getTime() : true;
          return okStart && okEnd;
        }
        return true;
      })
      .sort((a, b) => new Date(a.nextRenewalDate!).getTime() - new Date(b.nextRenewalDate!).getTime());
  }, [subscriptions, renewalWindow, customStart, customEnd]);

  // 2. Completed Renewals from Transaction Ledger
  const renewedTransactions = useMemo(() => {
    return transactions
      .filter((t) => t.transactionType === "renewal")
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [transactions]);

  // 3. Cancellation & Expiration Records
  const cancellationRecords = useMemo(() => {
    return subscriptions.filter(
      (s) =>
        s.status === "cancellation_scheduled" ||
        s.status === "cancelled" ||
        s.status === "expired" ||
        s.status === "refunded"
    );
  }, [subscriptions]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {/* Sub-navigation Tabs */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {[
            { id: "upcoming" as const, label: `Upcoming Renewals (${upcomingRenewals.length})`, icon: RefreshCw },
            { id: "renewed" as const, label: `Renewed Cycles (${renewedTransactions.length})`, icon: CheckCircle2 },
            { id: "cancellations" as const, label: `Cancellations & Expirations (${cancellationRecords.length})`, icon: XCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = subView === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubView(tab.id)}
                style={{
                  padding: "9px 14px",
                  borderRadius: "10px",
                  border: active ? "1px solid var(--primary)" : "1px solid var(--border)",
                  backgroundColor: active ? "var(--bg-active)" : "var(--bg-card)",
                  color: active ? "var(--primary)" : "var(--text-main)",
                  fontSize: "12.5px",
                  fontWeight: active ? 700 : 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Upcoming Renewal Date Filter Pills */}
        {subView === "upcoming" && (
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
            {(
              [
                { id: "all", label: "All Scheduled" },
                { id: "today", label: "Renewing Today" },
                { id: "7d", label: "Next 7 Days" },
                { id: "30d", label: "Next 30 Days" },
                { id: "custom", label: "Custom" },
              ] as const
            ).map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => setRenewalWindow(w.id)}
                style={{
                  padding: "6px 11px",
                  borderRadius: "8px",
                  border: renewalWindow === w.id ? "1px solid var(--primary)" : "1px solid var(--border)",
                  backgroundColor: renewalWindow === w.id ? "var(--bg-active)" : "var(--bg-surface)",
                  color: renewalWindow === w.id ? "var(--primary)" : "var(--text-secondary)",
                  fontSize: "11.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {w.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Custom Range Inputs if selected */}
      {subView === "upcoming" && renewalWindow === "custom" && (
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            fontSize: "12px",
          }}
        >
          <span style={{ fontWeight: 700, color: "var(--text-main)" }}>Renewal Window:</span>
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-main)",
              fontSize: "12px",
            }}
          />
          <span style={{ color: "var(--text-muted)" }}>to</span>
          <input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-main)",
              fontSize: "12px",
            }}
          />
        </div>
      )}

      {/* VIEW 1: UPCOMING RENEWALS */}
      {subView === "upcoming" && (
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            overflowX: "auto",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--bg-surface-elevated)", borderBottom: "1px solid var(--border)", color: "var(--text-muted)", fontSize: "11.5px" }}>
                <th style={{ padding: "12px 14px" }}>SUBSCRIBER</th>
                <th style={{ padding: "12px 14px" }}>PLAN</th>
                <th style={{ padding: "12px 14px" }}>RENEWAL DATE</th>
                <th style={{ padding: "12px 14px" }}>AMOUNT</th>
                <th style={{ padding: "12px 14px" }}>PROVIDER</th>
                <th style={{ padding: "12px 14px" }}>AUTO-RENEW</th>
                <th style={{ padding: "12px 14px" }}>STATUS</th>
                <th style={{ padding: "12px 14px" }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {upcomingRenewals.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "32px", textAlign: "center", color: "var(--text-secondary)" }}>
                    No upcoming renewals scheduled within this filter window.
                  </td>
                </tr>
              ) : (
                upcomingRenewals.map((s) => {
                  const sMeta = getSubscriptionStatusMeta(s.status);
                  return (
                    <tr key={s.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <img src={s.avatar} alt={s.userName} style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }} />
                          <div>
                            <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{s.userName}</div>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{s.username}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px", fontWeight: 600 }}>{s.planName}</td>
                      <td style={{ padding: "12px 14px", fontWeight: 700, color: "var(--primary)" }}>
                        {formatShortDate(s.nextRenewalDate)}
                      </td>
                      <td style={{ padding: "12px 14px", fontWeight: 800 }}>
                        {formatMoney(s.agreedPrice, s.currencySymbol)} {s.currency}
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: "var(--text-secondary)" }}>
                        {getPaymentProviderLabel(s.paymentProvider)}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <Badge variant="success">Enabled</Badge>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <Badge variant={sMeta.variant}>{sMeta.label}</Badge>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <button
                          type="button"
                          onClick={() => onInspectSubscription(s)}
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
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW 2: RENEWED SUBSCRIPTIONS */}
      {subView === "renewed" && (
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            overflowX: "auto",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--bg-surface-elevated)", borderBottom: "1px solid var(--border)", color: "var(--text-muted)", fontSize: "11.5px" }}>
                <th style={{ padding: "12px 14px" }}>SUBSCRIBER</th>
                <th style={{ padding: "12px 14px" }}>PLAN</th>
                <th style={{ padding: "12px 14px" }}>NEW BILLING PERIOD</th>
                <th style={{ padding: "12px 14px" }}>AMOUNT</th>
                <th style={{ padding: "12px 14px" }}>RENEWAL TIMESTAMP</th>
                <th style={{ padding: "12px 14px" }}>PAYMENT STATUS</th>
                <th style={{ padding: "12px 14px" }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {renewedTransactions.map((tx) => {
                const tMeta = getTransactionStatusMeta(tx.status);
                return (
                  <tr key={tx.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{tx.userName}</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{tx.username}</div>
                    </td>
                    <td style={{ padding: "12px 14px", fontWeight: 600 }}>{tx.planName}</td>
                    <td style={{ padding: "12px 14px", color: "var(--text-secondary)", fontSize: "12px" }}>
                      {tx.billingPeriodLabel}
                    </td>
                    <td style={{ padding: "12px 14px", fontWeight: 800 }}>
                      {formatMoney(tx.amount, tx.currencySymbol)} {tx.currency}
                    </td>
                    <td style={{ padding: "12px 14px", color: "var(--text-secondary)", fontSize: "12px" }}>
                      {formatDateTime(tx.timestamp)}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <Badge variant={tMeta.variant}>{tMeta.label}</Badge>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <button
                        type="button"
                        onClick={() => onInspectTransaction(tx)}
                        style={{
                          padding: "5px 9px",
                          borderRadius: "7px",
                          border: "1px solid var(--border)",
                          backgroundColor: "var(--bg-surface)",
                          color: "var(--primary)",
                          fontSize: "11.5px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        View Receipt
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW 3: CANCELLATION MANAGEMENT */}
      {subView === "cancellations" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              backgroundColor: "var(--bg-surface-elevated)",
              border: "1px solid var(--border)",
              fontSize: "12px",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <ShieldAlert size={15} color="var(--status-warning)" />
            <span>
              <strong>Cancellation Policy Integrity:</strong> Subscriptions marked <em>Cancels at Period End</em> keep full Premium entitlements until their already-paid period expires. Apple App Store and Google Play subscriptions require store-level confirmation.
            </span>
          </div>

          <div
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              overflowX: "auto",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--bg-surface-elevated)", borderBottom: "1px solid var(--border)", color: "var(--text-muted)", fontSize: "11.5px" }}>
                  <th style={{ padding: "12px 14px" }}>SUBSCRIBER</th>
                  <th style={{ padding: "12px 14px" }}>PLAN</th>
                  <th style={{ padding: "12px 14px" }}>REQUESTED / CANCEL DATE</th>
                  <th style={{ padding: "12px 14px" }}>EFFECTIVE DATE</th>
                  <th style={{ padding: "12px 14px" }}>REASON & TYPE</th>
                  <th style={{ padding: "12px 14px" }}>PROVIDER</th>
                  <th style={{ padding: "12px 14px" }}>ACCESS STATE</th>
                  <th style={{ padding: "12px 14px" }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {cancellationRecords.map((s) => {
                  const sMeta = getSubscriptionStatusMeta(s.status);
                  const accessStillActive = s.status === "cancellation_scheduled";
                  return (
                    <tr key={s.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{s.userName}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{s.id}</div>
                      </td>
                      <td style={{ padding: "12px 14px", fontWeight: 600 }}>{s.planName}</td>
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: "var(--text-secondary)" }}>
                        {formatShortDate(s.cancellationDate || s.expiryDate)}
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: "12px", fontWeight: 600 }}>
                        {formatShortDate(s.cancellationEffectiveDate || s.expiryDate)}
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: "12px", maxWidth: "240px" }}>
                        <div style={{ fontWeight: 600, color: "var(--text-main)", textTransform: "capitalize" }}>
                          {(s.cancellationType || "non_renewal").replace(/_/g, " ")}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                          {s.cancellationReason || "Auto-renew disabled by member"}
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: "12px", color: "var(--text-secondary)" }}>
                        {getPaymentProviderLabel(s.paymentProvider)}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-start" }}>
                          <Badge variant={sMeta.variant}>{sMeta.label}</Badge>
                          <span style={{ fontSize: "10.5px", color: accessStillActive ? "var(--status-success)" : "var(--text-muted)", fontWeight: 600 }}>
                            {accessStillActive ? "Access Retained Until Period End" : "Premium Access Revoked"}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <button
                          type="button"
                          onClick={() => onInspectSubscription(s)}
                          style={{
                            padding: "5px 9px",
                            borderRadius: "7px",
                            border: "1px solid var(--border)",
                            backgroundColor: "var(--bg-surface)",
                            color: "var(--primary)",
                            fontSize: "11.5px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

