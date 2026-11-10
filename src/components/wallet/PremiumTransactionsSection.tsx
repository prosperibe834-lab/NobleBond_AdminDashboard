import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, ExternalLink, Search, AlertCircle } from "lucide-react";
import type { SubscriptionTransactionRecord } from "../../types/subscriptionManagement.types";
import type {
  UnifiedFinancialTransaction,
  WalletOverviewKpis,
} from "../../types/walletManagement.types";
import { Badge } from "../common/Badge";
import {
  formatDateTime,
  formatMoney,
  formatPaymentProviderLabel,
  getTxStatusMeta,
} from "./walletUiUtils";

interface PremiumTransactionsSectionProps {
  kpis: WalletOverviewKpis;
  subscriptionTxs: SubscriptionTransactionRecord[];
  onInspectTransaction: (tx: UnifiedFinancialTransaction) => void;
}

export const PremiumTransactionsSection: React.FC<PremiumTransactionsSectionProps> = ({
  kpis,
  subscriptionTxs,
  onInspectTransaction,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [providerFilter, setProviderFilter] = useState<string>("all");

  const filtered = subscriptionTxs.filter((tx) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      tx.id.toLowerCase().includes(q) ||
      tx.invoiceRef.toLowerCase().includes(q) ||
      tx.userName.toLowerCase().includes(q) ||
      tx.planName.toLowerCase().includes(q) ||
      tx.providerReference.toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "renewal" && tx.transactionType === "renewal") ||
      (statusFilter === "initial_purchase" && tx.transactionType === "initial_purchase") ||
      tx.status === statusFilter;
    const matchesProvider =
      providerFilter === "all" || tx.paymentProvider === providerFilter;
    return matchesSearch && matchesStatus && matchesProvider;
  });

  const toUnifiedTx = (s: SubscriptionTransactionRecord): UnifiedFinancialTransaction => ({
    id: s.id,
    category: "premium_subscription",
    transactionType:
      s.status === "refunded"
        ? "premium_subscription_refund"
        : s.transactionType === "renewal"
        ? "premium_subscription_renewal"
        : "premium_subscription_payment",
    title: `${s.planName} (${s.transactionType === "renewal" ? "Renewal" : s.status === "refunded" ? "Refund" : "Payment"})`,
    userId: s.userId,
    userName: s.userName,
    username: s.username,
    userAvatar: s.userAvatar,
    isMonetary: true,
    fiatAmount: s.amount,
    fiatCurrency: s.currency,
    fiatSymbol: s.currencySymbol,
    direction: s.status === "refunded" ? "debit" : "credit",
    referenceId: s.invoiceRef,
    relatedServiceLabel: `Subscription ${s.subscriptionId}`,
    relatedEntityId: s.subscriptionId,
    paymentProviderLabel: s.paymentProvider,
    maskedPaymentMethod: s.maskedPaymentMethod,
    timestamp: s.timestamp,
    status:
      s.status === "successful"
        ? "completed"
        : s.status === "refunded" || s.status === "partially_refunded"
        ? "refunded"
        : s.status === "failed"
        ? "failed"
        : "pending",
    notes: s.failureReason || s.billingPeriodLabel,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {/* Sync Header & Summary Strip */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "18px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background: "var(--status-success-bg)",
                color: "var(--status-success)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CreditCard size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>
                Premium Subscription Billing Ledger
              </h3>
              <div style={{ fontSize: "0.77rem", color: "var(--text-muted)" }}>
                Real-money transactions synchronized directly from Subscription Management (no duplicated plan editing)
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/subscriptions")}
            style={{
              background: "var(--primary)",
              border: "none",
              color: "#fff",
              borderRadius: "10px",
              padding: "8px 14px",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>Open Subscription Management</span>
            <ExternalLink size={13} />
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "10px",
          }}
        >
          <div style={{ padding: "12px", borderRadius: "12px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)" }}>
            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Gross Premium Volume</div>
            <div style={{ fontSize: "1.14rem", fontWeight: 800, color: "var(--status-success)", marginTop: "3px" }}>
              {formatMoney(kpis.grossPremiumRevenueUsd)}
            </div>
          </div>
          <div style={{ padding: "12px", borderRadius: "12px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)" }}>
            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Refunds Processed</div>
            <div style={{ fontSize: "1.14rem", fontWeight: 800, color: "var(--status-error)", marginTop: "3px" }}>
              -{formatMoney(kpis.refundedPremiumUsd)}
            </div>
          </div>
          <div style={{ padding: "12px", borderRadius: "12px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)" }}>
            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Net Collected Revenue</div>
            <div style={{ fontSize: "1.14rem", fontWeight: 800, color: "var(--text-main)", marginTop: "3px" }}>
              {formatMoney(kpis.netPremiumRevenueUsd)}
            </div>
          </div>
          <div style={{ padding: "12px", borderRadius: "12px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)" }}>
            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Success / Failed / Pending</div>
            <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-main)", marginTop: "3px" }}>
              {kpis.successfulPremiumPaymentsCount} / {kpis.failedPremiumPaymentsCount} / {kpis.pendingPremiumPaymentsCount}
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Ledger Table */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "18px",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <div style={{ position: "relative", flex: "1 1 240px", maxWidth: "340px" }}>
            <Search
              size={14}
              style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search invoice, member, plan, provider ref..."
              style={{
                width: "100%",
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-main)",
                borderRadius: "9px",
                padding: "8px 10px 8px 32px",
                fontSize: "0.81rem",
              }}
            />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-main)",
                borderRadius: "9px",
                padding: "8px 10px",
                fontSize: "0.8rem",
              }}
            >
              <option value="all">All Payment Status / Types</option>
              <option value="successful">Successful</option>
              <option value="renewal">Renewals Only</option>
              <option value="initial_purchase">New Subscriptions Only</option>
              <option value="pending">Pending / Processing</option>
              <option value="failed">Failed Payments</option>
              <option value="refunded">Refunded</option>
            </select>

            <select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-main)",
                borderRadius: "9px",
                padding: "8px 10px",
                fontSize: "0.8rem",
              }}
            >
              <option value="all">All Payment Providers</option>
              <option value="stripe_web">Stripe Web</option>
              <option value="apple_app_store">Apple App Store</option>
              <option value="google_play_store">Google Play</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)", textAlign: "left" }}>
                <th style={{ padding: "10px 8px" }}>Transaction / Invoice</th>
                <th style={{ padding: "10px 8px" }}>Subscriber</th>
                <th style={{ padding: "10px 8px" }}>Plan & Billing Type</th>
                <th style={{ padding: "10px 8px" }}>Amount (USD)</th>
                <th style={{ padding: "10px 8px" }}>Provider & Method</th>
                <th style={{ padding: "10px 8px" }}>Date</th>
                <th style={{ padding: "10px 8px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const unified = toUnifiedTx(s);
                const st = getTxStatusMeta(unified.status);
                return (
                  <tr
                    key={s.id}
                    onClick={() => onInspectTransaction(unified)}
                    style={{ borderBottom: "1px solid var(--border-light)", cursor: "pointer" }}
                  >
                    <td style={{ padding: "11px 8px" }}>
                      <div style={{ fontWeight: 700, color: "var(--primary)" }}>{s.id}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{s.invoiceRef}</div>
                    </td>
                    <td style={{ padding: "11px 8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <img src={s.userAvatar} alt={s.userName} style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }} />
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{s.userName}</div>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>@{s.username}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "11px 8px" }}>
                      <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{s.planName}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{s.billingPeriodLabel}</div>
                    </td>
                    <td style={{ padding: "11px 8px", fontWeight: 800, color: s.status === "refunded" ? "var(--status-error)" : "var(--status-success)" }}>
                      {s.status === "refunded" ? "-" : "+"}
                      {formatMoney(s.amount, s.currencySymbol)}
                    </td>
                    <td style={{ padding: "11px 8px" }}>
                      <div style={{ color: "var(--text-main)" }}>{formatPaymentProviderLabel(s.paymentProvider)}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{s.maskedPaymentMethod}</div>
                    </td>
                    <td style={{ padding: "11px 8px", color: "var(--text-secondary)" }}>{formatDateTime(s.timestamp)}</td>
                    <td style={{ padding: "11px 8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <Badge variant={st.variant} size="sm">{st.label}</Badge>
                        {s.failureReason && (
                          <span title={s.failureReason} style={{ color: "var(--status-error)", display: "flex" }}>
                            <AlertCircle size={13} />
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)" }}>
                    No subscription billing records match your current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

