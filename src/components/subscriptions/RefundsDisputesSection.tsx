// NobleBond Admin — Refunds & Payment Disputes Management Section
// Manages Premium membership refund requests & billing disputes with strict demo settlement disclosures. Zero emojis.

import React, { useState, useMemo } from "react";
import {
  Search,
  ShieldAlert,
  Download,
  Eye,
} from "lucide-react";
import type {
  SubscriptionRefundDisputeRecord,
  RefundDisputeStatus,
  AdminRolePermissions,
} from "../../types/subscriptionManagement.types";
import { Badge } from "../common/Badge";
import {
  formatMoney,
  formatShortDate,
  getRefundStatusMeta,
  getPaymentProviderLabel,
} from "./subscriptionUiUtils";

interface RefundsDisputesSectionProps {
  records: SubscriptionRefundDisputeRecord[];
  permissions: AdminRolePermissions;
  onInspectRefund: (record: SubscriptionRefundDisputeRecord) => void;
  onExportCsv: (filtered: SubscriptionRefundDisputeRecord[]) => void;
}

export const RefundsDisputesSection: React.FC<RefundsDisputesSectionProps> = ({
  records,
  permissions,
  onInspectRefund,
  onExportCsv,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | RefundDisputeStatus>("all");
  const [kindFilter, setKindFilter] = useState<"all" | "refund_request" | "payment_dispute">("all");

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      const matchKind = kindFilter === "all" || r.recordKind === kindFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.transactionId.toLowerCase().includes(q) ||
        r.subscriptionId.toLowerCase().includes(q) ||
        r.userName.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q);
      return matchStatus && matchKind && matchQuery;
    });
  }, [records, statusFilter, kindFilter, searchQuery]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Refund Integrity Disclosure */}
      <div
        style={{
          padding: "12px 16px",
          borderRadius: "12px",
          backgroundColor: "var(--status-warning-bg)",
          border: "1px solid rgba(217, 119, 6, 0.3)",
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
          fontSize: "12px",
          color: "var(--text-main)",
        }}
      >
        <ShieldAlert size={16} color="var(--status-warning)" style={{ flexShrink: 0, marginTop: "2px" }} />
        <div>
          <strong>Settlement & Provider Policy Disclosure:</strong> Approving or rejecting a refund request in this panel updates local demonstration records and audit logs only. Actual monetary refunds require authorized provider processing (Stripe Refunds API, PayPal API, or Apple/Google Store resolution workflows) and backend subscription entitlement sync.
        </div>
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
            placeholder="Search Refund ID, Transaction ID, Subscriber, Reason..."
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

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <select
            value={kindFilter}
            onChange={(e) =>
              setKindFilter(e.target.value as "all" | "refund_request" | "payment_dispute")
            }
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
            <option value="all">Refunds & Disputes</option>
            <option value="refund_request">Refund Requests Only</option>
            <option value="payment_dispute">Payment Disputes Only</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | RefundDisputeStatus)}
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
            <option value="requested">Requested</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>

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

      {/* Refunds & Disputes Table */}
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
              <th style={{ padding: "12px 14px" }}>CASE ID & TYPE</th>
              <th style={{ padding: "12px 14px" }}>TXN & SUB ID</th>
              <th style={{ padding: "12px 14px" }}>SUBSCRIBER</th>
              <th style={{ padding: "12px 14px" }}>AMOUNTS (ORIG / REQ)</th>
              <th style={{ padding: "12px 14px" }}>REASON</th>
              <th style={{ padding: "12px 14px" }}>PROVIDER</th>
              <th style={{ padding: "12px 14px" }}>REQUEST DATE</th>
              <th style={{ padding: "12px 14px" }}>STATUS</th>
              <th style={{ padding: "12px 14px" }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ padding: "36px", textAlign: "center", color: "var(--text-secondary)" }}>
                  No refund requests or disputes found matching filters.
                </td>
              </tr>
            ) : (
              filtered.map((rec) => {
                const sMeta = getRefundStatusMeta(rec.status);
                return (
                  <tr
                    key={rec.id}
                    onClick={() => onInspectRefund(rec)}
                    style={{ borderBottom: "1px solid var(--border-light)", cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                      <div style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--primary)" }}>
                        {rec.id}
                      </div>
                      <div style={{ fontSize: "10.5px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>
                        {rec.recordKind === "payment_dispute" ? "Payment Dispute" : "Refund Request"}
                      </div>
                    </td>

                    <td style={{ padding: "12px 14px", fontFamily: "monospace", fontSize: "11.5px" }}>
                      <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{rec.transactionId}</div>
                      <div style={{ color: "var(--text-muted)" }}>{rec.subscriptionId}</div>
                    </td>

                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{rec.userName}</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{rec.planName}</div>
                    </td>

                    <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                      <div style={{ fontWeight: 800, color: "var(--status-error)" }}>
                        Req: {formatMoney(rec.requestedAmount, rec.currencySymbol)}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                        Orig: {formatMoney(rec.originalAmount, rec.currencySymbol)} {rec.currency}
                      </div>
                    </td>

                    <td style={{ padding: "12px 14px", maxWidth: "240px", fontSize: "12px", color: "var(--text-secondary)" }}>
                      {rec.reason}
                    </td>

                    <td style={{ padding: "12px 14px", fontSize: "12px", color: "var(--text-secondary)" }}>
                      {getPaymentProviderLabel(rec.paymentProvider)}
                    </td>

                    <td style={{ padding: "12px 14px", fontSize: "12px", whiteSpace: "nowrap", color: "var(--text-secondary)" }}>
                      {formatShortDate(rec.requestedAt)}
                    </td>

                    <td style={{ padding: "12px 14px" }}>
                      <Badge variant={sMeta.variant}>{sMeta.label}</Badge>
                    </td>

                    <td style={{ padding: "12px 14px" }} onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        disabled={!permissions.canReviewRefunds}
                        onClick={() => onInspectRefund(rec)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: "7px",
                          border: "1px solid var(--border)",
                          backgroundColor: "var(--bg-surface)",
                          color: permissions.canReviewRefunds ? "var(--primary)" : "var(--text-muted)",
                          fontSize: "11.5px",
                          fontWeight: 600,
                          cursor: permissions.canReviewRefunds ? "pointer" : "not-allowed",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Eye size={12} /> {permissions.canReviewRefunds ? "Review" : "View Only"}
                      </button>
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

