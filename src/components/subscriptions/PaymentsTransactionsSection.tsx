// NobleBond Admin — Payments & Transactions Ledger Section
// Displays strictly Premium membership billing transactions with masked payment metadata only. Zero emojis.

import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  Eye,
  Lock,
  ShieldCheck,
} from "lucide-react";
import type {
  SubscriptionTransactionRecord,
  TransactionStatus,
  PaymentProvider,
  AdminRolePermissions,
} from "../../types/subscriptionManagement.types";
import { Badge } from "../common/Badge";
import {
  formatMoney,
  formatDateTime,
  getTransactionStatusMeta,
  getPaymentProviderLabel,
} from "./subscriptionUiUtils";

interface PaymentsTransactionsSectionProps {
  transactions: SubscriptionTransactionRecord[];
  permissions: AdminRolePermissions;
  onInspectTransaction: (tx: SubscriptionTransactionRecord) => void;
  onExportCsv: (filtered: SubscriptionTransactionRecord[]) => void;
}

export const PaymentsTransactionsSection: React.FC<PaymentsTransactionsSectionProps> = ({
  transactions,
  permissions,
  onInspectTransaction,
  onExportCsv,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | TransactionStatus>("all");
  const [providerFilter, setProviderFilter] = useState<"all" | PaymentProvider>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "highest">("newest");

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.invoiceRef.toLowerCase().includes(q) ||
          t.subscriptionId.toLowerCase().includes(q) ||
          t.userName.toLowerCase().includes(q) ||
          t.providerReference.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      list = list.filter((t) => t.status === statusFilter);
    }
    if (providerFilter !== "all") {
      list = list.filter((t) => t.paymentProvider === providerFilter);
    }
    list.sort((a, b) => {
      if (sortOrder === "highest") return b.amount - a.amount;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    return list;
  }, [transactions, searchQuery, statusFilter, providerFilter, sortOrder]);

  if (!permissions.canViewBillingRecords) {
    return (
      <div
        style={{
          padding: "48px 24px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Lock size={28} color="var(--status-warning)" />
        <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)" }}>
          Billing Records Access Restricted
        </div>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", maxWidth: "460px" }}>
          Your current administrator role does not carry permission to inspect payment transaction ledgers.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Security Notice */}
      <div
        style={{
          padding: "10px 14px",
          borderRadius: "10px",
          backgroundColor: "var(--bg-surface-elevated)",
          border: "1px solid var(--border)",
          fontSize: "12px",
          color: "var(--text-secondary)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <ShieldCheck size={15} color="var(--status-success)" style={{ flexShrink: 0 }} />
        <span>
          PCI-Safe Metadata Mode: Only masked provider tokens and last-4 digits returned by Stripe, Apple App Store, Google Play, or PayPal are rendered. Raw card numbers and CVVs are never stored or displayed.
        </span>
      </div>

      {/* Controls */}
      <div
        style={{
          padding: "14px 16px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "7px 12px",
            borderRadius: "9px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--bg-surface-elevated)",
            flex: "1 1 240px",
            minWidth: "220px",
          }}
        >
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Transaction ID, Invoice, Subscription ID, Provider Ref..."
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              color: "var(--text-main)",
              fontSize: "12.5px",
              width: "100%",
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | TransactionStatus)}
            style={{
              padding: "7px 10px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-main)",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            <option value="all">All Statuses</option>
            <option value="successful">Successful</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
            <option value="partially_refunded">Partially Refunded</option>
          </select>

          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value as "all" | PaymentProvider)}
            style={{
              padding: "7px 10px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-main)",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            <option value="all">All Providers</option>
            <option value="stripe_web">Web Gateway (Stripe)</option>
            <option value="apple_app_store">Apple App Store</option>
            <option value="google_play_store">Google Play Store</option>
            <option value="paypal">PayPal</option>
          </select>

          <button
            type="button"
            onClick={() => setSortOrder((prev) => (prev === "newest" ? "highest" : "newest"))}
            style={{
              padding: "7px 11px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-main)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Sort: {sortOrder === "newest" ? "Newest" : "Highest Amount"}
          </button>

          <button
            type="button"
            onClick={() => onExportCsv(filtered)}
            style={{
              padding: "7px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-main)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Download size={13} /> Export ({filtered.length})
          </button>
        </div>
      </div>

      {/* Transactions Table */}
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
              <th style={{ padding: "12px 14px" }}>TXN & INVOICE</th>
              <th style={{ padding: "12px 14px" }}>SUBSCRIBER</th>
              <th style={{ padding: "12px 14px" }}>SUB ID & PLAN</th>
              <th style={{ padding: "12px 14px" }}>AMOUNT</th>
              <th style={{ padding: "12px 14px" }}>PROVIDER & METHOD</th>
              <th style={{ padding: "12px 14px" }}>BILLING PERIOD</th>
              <th style={{ padding: "12px 14px" }}>TIMESTAMP</th>
              <th style={{ padding: "12px 14px" }}>STATUS</th>
              <th style={{ padding: "12px 14px" }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx) => {
              const sMeta = getTransactionStatusMeta(tx.status);
              return (
                <tr
                  key={tx.id}
                  onClick={() => onInspectTransaction(tx)}
                  style={{ borderBottom: "1px solid var(--border-light)", cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                    <div style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--primary)" }}>{tx.id}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{tx.invoiceRef}</div>
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
                    <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{tx.planName}</div>
                    <div style={{ fontSize: "11px", fontFamily: "monospace", color: "var(--text-muted)" }}>
                      {tx.subscriptionId}
                    </div>
                  </td>

                  <td style={{ padding: "12px 14px", fontWeight: 800, color: "var(--text-main)", whiteSpace: "nowrap" }}>
                    {formatMoney(tx.amount, tx.currencySymbol)}{" "}
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{tx.currency}</span>
                  </td>

                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-main)" }}>
                      {getPaymentProviderLabel(tx.paymentProvider)}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      {tx.maskedPaymentMethod}
                    </div>
                  </td>

                  <td style={{ padding: "12px 14px", fontSize: "12px", color: "var(--text-secondary)" }}>
                    {tx.billingPeriodLabel}
                  </td>

                  <td style={{ padding: "12px 14px", fontSize: "12px", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                    {formatDateTime(tx.timestamp)}
                  </td>

                  <td style={{ padding: "12px 14px" }}>
                    <Badge variant={sMeta.variant}>{sMeta.label}</Badge>
                  </td>

                  <td style={{ padding: "12px 14px" }} onClick={(e) => e.stopPropagation()}>
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
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Eye size={12} /> Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

