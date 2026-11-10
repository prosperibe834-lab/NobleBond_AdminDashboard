// NobleBond Admin — Responsive Subscription Mobile Cards
// Touch-friendly stacked card presentation for mobile viewports and Card View toggle. Zero emojis.

import React from "react";
import { RefreshCw, ExternalLink, Gift } from "lucide-react";
import type { SubscriptionRecord } from "../../types/subscriptionManagement.types";
import { Badge } from "../common/Badge";
import {
  formatMoney,
  formatShortDate,
  getSubscriptionStatusMeta,
  getPaymentProviderLabel,
} from "./subscriptionUiUtils";

interface SubscriptionMobileCardsProps {
  subscriptions: SubscriptionRecord[];
  onOpenSubscription: (sub: SubscriptionRecord) => void;
  onOpenUserProfile: (userId: string) => void;
}

export const SubscriptionMobileCards: React.FC<SubscriptionMobileCardsProps> = ({
  subscriptions,
  onOpenSubscription,
  onOpenUserProfile,
}) => {
  if (subscriptions.length === 0) {
    return (
      <div
        style={{
          padding: "36px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          textAlign: "center",
          color: "var(--text-secondary)",
        }}
      >
        No subscription records match current filters.
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "14px" }}>
      {subscriptions.map((sub) => {
        const meta = getSubscriptionStatusMeta(sub.status);
        return (
          <div
            key={sub.id}
            onClick={() => onOpenSubscription(sub)}
            style={{
              padding: "16px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 700, color: "var(--primary)" }}>
                {sub.id}
              </span>
              <Badge variant={meta.variant}>{meta.label}</Badge>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img
                src={sub.avatar}
                alt={sub.userName}
                style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
              />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "14px", display: "flex", alignItems: "center", gap: "5px" }}>
                  <span>{sub.userName}</span>
                  {sub.isComplimentary && <Gift size={13} color="var(--accent-champagne)" />}
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {sub.username} &bull; {sub.country}
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "10px 12px",
                borderRadius: "10px",
                backgroundColor: "var(--bg-surface-elevated)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)" }}>{sub.planName}</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  {getPaymentProviderLabel(sub.paymentProvider)}
                </div>
              </div>
              <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--primary)" }}>
                {sub.isComplimentary ? "$0.00" : formatMoney(sub.agreedPrice, sub.currencySymbol)}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", color: "var(--text-secondary)" }}>
              <span>Renew: {sub.nextRenewalDate ? formatShortDate(sub.nextRenewalDate) : "Off"}</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <RefreshCw size={11} /> Auto-Renew: {sub.autoRenew ? "On" : "Off"}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid var(--border-light)" }} onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => onOpenSubscription(sub)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--primary)",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Inspect Subscription
              </button>
              <button
                type="button"
                onClick={() => onOpenUserProfile(sub.userId)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-secondary)",
                  fontSize: "12px",
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
          </div>
        );
      })}
    </div>
  );
};

