// NobleBond Admin — Plan Detail & Mobile App Storefront Preview Modal
// Displays complete plan specifications and a live NobleBond mobile checkout card preview. Zero emojis.

import React, { useState } from "react";
import { X, Crown, Smartphone, FileText, Check, Lock } from "lucide-react";
import type {
  SubscriptionPlanConfig,
  SubscriptionEntitlementConfig,
} from "../../../types/subscriptionManagement.types";
import { Badge } from "../../common/Badge";
import {
  formatMoney,
  formatShortDate,
  getPlanStatusMeta,
  getBillingIntervalLabel,
} from "../subscriptionUiUtils";

interface PlanDetailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlanConfig | null;
  activeSubscriberCount: number;
  entitlements: SubscriptionEntitlementConfig[];
  initialMode?: "specs" | "preview";
}

export const PlanDetailPreviewModal: React.FC<PlanDetailPreviewModalProps> = ({
  isOpen,
  onClose,
  plan,
  activeSubscriberCount,
  entitlements,
  initialMode = "specs",
}) => {
  const [mode, setMode] = useState<"specs" | "preview">(initialMode);

  if (!isOpen || !plan) return null;

  const statusMeta = getPlanStatusMeta(plan.status);

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
          maxWidth: "620px",
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
            <Crown size={20} color="var(--primary)" />
            <div>
              <h2 style={{ fontSize: "17px", fontWeight: 800, color: "var(--text-main)", margin: 0 }}>
                {plan.name}
              </h2>
              <div style={{ fontSize: "11.5px", fontFamily: "monospace", color: "var(--text-muted)" }}>
                {plan.identifier} &bull; {activeSubscriberCount} Active Subscribers
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

        {/* Mode Switcher */}
        <div style={{ display: "flex", gap: "8px", padding: "12px 24px 0" }}>
          <button
            type="button"
            onClick={() => setMode("specs")}
            style={{
              padding: "7px 14px",
              borderRadius: "9px",
              border: mode === "specs" ? "1px solid var(--primary)" : "1px solid var(--border)",
              backgroundColor: mode === "specs" ? "var(--bg-active)" : "var(--bg-surface)",
              color: mode === "specs" ? "var(--primary)" : "var(--text-secondary)",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <FileText size={13} /> Plan Specifications
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            style={{
              padding: "7px 14px",
              borderRadius: "9px",
              border: mode === "preview" ? "1px solid var(--primary)" : "1px solid var(--border)",
              backgroundColor: mode === "preview" ? "var(--bg-active)" : "var(--bg-surface)",
              color: mode === "preview" ? "var(--primary)" : "var(--text-secondary)",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Smartphone size={13} /> Mobile Checkout Card Preview
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {mode === "specs" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
                {plan.isMostPopular && <Badge variant="primary">Most Popular</Badge>}
                <Badge variant={plan.visibleInMobileApp ? "info" : "neutral"}>
                  {plan.visibleInMobileApp ? "Storefront Visible" : "Hidden"}
                </Badge>
              </div>

              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                {plan.description}
              </p>

              <div
                style={{
                  padding: "14px",
                  borderRadius: "12px",
                  backgroundColor: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border)",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  fontSize: "12.5px",
                }}
              >
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Price & Currency</div>
                  <div style={{ fontWeight: 800, color: "var(--primary)" }}>
                    {formatMoney(plan.price, plan.currencySymbol)} {plan.currency}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Billing Frequency</div>
                  <div style={{ fontWeight: 700 }}>{getBillingIntervalLabel(plan.billingInterval)}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Display Order</div>
                  <div style={{ fontWeight: 700 }}>Position #{plan.displayOrder}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Active Subscribers</div>
                  <div style={{ fontWeight: 700 }}>{activeSubscriberCount}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Created</div>
                  <div style={{ fontWeight: 600 }}>{formatShortDate(plan.createdAt)}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Last Updated</div>
                  <div style={{ fontWeight: 600 }}>{formatShortDate(plan.updatedAt)}</div>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Eligibility & Regions</div>
                  <div style={{ fontWeight: 600 }}>
                    {plan.eligibilityNote} ({plan.availableRegions.join(", ")})
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase" }}>
                  Included Entitlements
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {entitlements.map((e) => {
                    const has = plan.entitlementKeys.includes(e.key);
                    return (
                      <div
                        key={e.key}
                        style={{
                          padding: "8px 10px",
                          borderRadius: "9px",
                          border: "1px solid var(--border-light)",
                          backgroundColor: "var(--bg-app)",
                          display: "flex",
                          alignItems: "center",
                          gap: "7px",
                          fontSize: "12px",
                        }}
                      >
                        {has ? <Check size={14} color="var(--status-success)" /> : <Lock size={13} color="var(--text-muted)" />}
                        <span style={{ color: has ? "var(--text-main)" : "var(--text-muted)", fontWeight: 600 }}>
                          {e.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Mobile App Checkout Card Preview */
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "12px" }}>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", textAlign: "center" }}>
                Preview of how <strong>{plan.name}</strong> renders inside the NobleBond mobile GoPremium screen:
              </div>
              <div
                style={{
                  width: "100%",
                  maxWidth: "340px",
                  padding: "20px",
                  borderRadius: "20px",
                  border: plan.isMostPopular ? "2px solid var(--primary)" : "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface-elevated)",
                  boxShadow: "var(--shadow-md)",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {plan.isMostPopular && (
                  <div style={{ position: "absolute", top: "-10px", right: "18px" }}>
                    <Badge variant="primary">MOST POPULAR</Badge>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "17px", fontWeight: 800, color: "var(--text-main)" }}>{plan.name}</div>
                    {plan.discountTag && (
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary)" }}>{plan.discountTag}</span>
                    )}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--primary)" }}>
                      {formatMoney(plan.monthlyEquivalent, plan.currencySymbol)}
                      <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-secondary)" }}>/mo</span>
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      Total: {formatMoney(plan.price, plan.currencySymbol)}
                    </div>
                  </div>
                </div>
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "10px", fontSize: "11.5px", color: "var(--text-secondary)" }}>
                  {plan.visibleInMobileApp
                    ? "Active on mobile storefront (Card, Apple Pay, Google Pay, PayPal)."
                    : "Currently hidden from mobile storefront."}
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: "14px 24px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end" }}>
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

