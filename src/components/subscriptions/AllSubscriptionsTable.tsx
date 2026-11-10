// NobleBond Admin — All Subscriptions Master Table
// Comprehensive subscription lifecycle ledger with sort triggers, status badges, and provider labels. Zero emojis.

import React from "react";
import {
  ArrowUpDown,
  ExternalLink,
  RefreshCw,
  Crown,
  Gift,
  Eye,
} from "lucide-react";
import type {
  SubscriptionRecord,
  SubscriptionSortCriteria,
  SubscriptionSortField,
} from "../../types/subscriptionManagement.types";
import { Badge } from "../common/Badge";
import {
  formatMoney,
  formatShortDate,
  getSubscriptionStatusMeta,
  getPaymentProviderLabel,
  getBillingIntervalLabel,
} from "./subscriptionUiUtils";

interface AllSubscriptionsTableProps {
  subscriptions: SubscriptionRecord[];
  sort: SubscriptionSortCriteria;
  onSortChange: (field: SubscriptionSortField) => void;
  onOpenSubscription: (sub: SubscriptionRecord) => void;
  onOpenUserProfile: (userId: string) => void;
  onClearFilters?: () => void;
}

export const AllSubscriptionsTable: React.FC<AllSubscriptionsTableProps> = ({
  subscriptions,
  sort,
  onSortChange,
  onOpenSubscription,
  onOpenUserProfile,
  onClearFilters,
}) => {
  if (subscriptions.length === 0) {
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
        <Crown size={28} color="var(--text-muted)" />
        <div style={{ fontSize: "15.5px", fontWeight: 700, color: "var(--text-main)" }}>
          No subscriptions match current filters
        </div>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
          Adjust your search query, status pill, or multi-attribute filter settings.
        </p>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            style={{
              marginTop: "6px",
              padding: "8px 14px",
              borderRadius: "9px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--primary)",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
      }}
    >
      <div style={{ overflowX: "auto" }}>
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
              <th style={{ padding: "12px 14px", fontWeight: 700, whiteSpace: "nowrap" }}>SUB ID</th>
              <th style={{ padding: "12px 14px", fontWeight: 700 }}>SUBSCRIBER</th>
              <th style={{ padding: "12px 14px", fontWeight: 700 }}>PLAN & INTERVAL</th>
              <th
                onClick={() => onSortChange("highest_price")}
                style={{ padding: "12px 14px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span>PRICE</span>
                  <ArrowUpDown size={12} color={sort.field === "highest_price" ? "var(--primary)" : "currentColor"} />
                </div>
              </th>
              <th
                onClick={() => onSortChange("newest")}
                style={{ padding: "12px 14px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span>START DATE</span>
                  <ArrowUpDown size={12} color={sort.field === "newest" ? "var(--primary)" : "currentColor"} />
                </div>
              </th>
              <th
                onClick={() => onSortChange("next_renewal")}
                style={{ padding: "12px 14px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span>RENEWAL / EXPIRY</span>
                  <ArrowUpDown size={12} color={sort.field === "next_renewal" ? "var(--primary)" : "currentColor"} />
                </div>
              </th>
              <th style={{ padding: "12px 14px", fontWeight: 700 }}>PROVIDER</th>
              <th
                onClick={() => onSortChange("status")}
                style={{ padding: "12px 14px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span>STATUS</span>
                  <ArrowUpDown size={12} color={sort.field === "status" ? "var(--primary)" : "currentColor"} />
                </div>
              </th>
              <th style={{ padding: "12px 14px", fontWeight: 700 }}>AUTO-RENEW</th>
              <th style={{ padding: "12px 14px", fontWeight: 700 }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => {
              const statusMeta = getSubscriptionStatusMeta(sub.status);
              return (
                <tr
                  key={sub.id}
                  onClick={() => onOpenSubscription(sub)}
                  style={{
                    borderBottom: "1px solid var(--border-light)",
                    cursor: "pointer",
                    transition: "background-color 0.14s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td style={{ padding: "12px 14px", fontFamily: "monospace", fontWeight: 700, color: "var(--primary)", whiteSpace: "nowrap" }}>
                    {sub.id}
                  </td>

                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "200px" }}>
                      <img
                        src={sub.avatar}
                        alt={sub.userName}
                        style={{ width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border)" }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: "var(--text-main)", display: "flex", alignItems: "center", gap: "5px" }}>
                          <span>{sub.userName}</span>
                          {sub.isComplimentary && (
                            <span title="Complimentary VIP (Zero Revenue)">
                              <Gift size={12} color="var(--accent-champagne)" />
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                          {sub.username} &bull; {sub.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{sub.planName}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      {getBillingIntervalLabel(sub.billingInterval)}
                    </div>
                  </td>

                  <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                    {sub.isComplimentary ? (
                      <Badge variant="champagne">Complimentary ($0.00)</Badge>
                    ) : (
                      <span style={{ fontWeight: 800, color: "var(--text-main)" }}>
                        {formatMoney(sub.agreedPrice, sub.currencySymbol)} <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{sub.currency}</span>
                      </span>
                    )}
                  </td>

                  <td style={{ padding: "12px 14px", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                    {formatShortDate(sub.startDate)}
                  </td>

                  <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                    <div style={{ fontSize: "12.5px", color: "var(--text-main)", fontWeight: 600 }}>
                      {sub.nextRenewalDate ? formatShortDate(sub.nextRenewalDate) : "No Auto-Renewal"}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      Exp: {formatShortDate(sub.expiryDate)}
                    </div>
                  </td>

                  <td style={{ padding: "12px 14px", fontSize: "12px", color: "var(--text-secondary)" }}>
                    {getPaymentProviderLabel(sub.paymentProvider)}
                  </td>

                  <td style={{ padding: "12px 14px" }}>
                    <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
                  </td>

                  <td style={{ padding: "12px 14px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "11.5px",
                        fontWeight: 600,
                        color: sub.autoRenew ? "var(--status-success)" : "var(--text-muted)",
                      }}
                    >
                      <RefreshCw size={11} />
                      {sub.autoRenew ? "On" : "Off"}
                    </span>
                  </td>

                  <td style={{ padding: "12px 14px" }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        type="button"
                        onClick={() => onOpenSubscription(sub)}
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
                        onClick={() => onOpenUserProfile(sub.userId)}
                        style={{
                          padding: "5px 8px",
                          borderRadius: "7px",
                          border: "1px solid var(--border)",
                          backgroundColor: "var(--bg-surface)",
                          color: "var(--text-secondary)",
                          fontSize: "11.5px",
                          cursor: "pointer",
                        }}
                        title="Open in User Management"
                      >
                        <ExternalLink size={12} />
                      </button>
                    </div>
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

