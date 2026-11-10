// NobleBond Admin — Plans & Pricing Catalog Management Section
// Displays NobleBond Premium plans matching mobile app pricing, pricing integrity protections, and future-ready staged promo drafts. Zero emojis.

import React, { useState } from "react";
import {
  Plus,
  Eye,
  Edit3,
  Power,
  Archive,
  Check,
  ShieldAlert,
  LayoutGrid,
  List,
  Smartphone,
  Tag,
} from "lucide-react";
import type {
  SubscriptionPlanConfig,
  SubscriptionRecord,
  PlanStatus,
  StagedPromotionDraft,
  AdminRolePermissions,
} from "../../types/subscriptionManagement.types";
import { Badge } from "../common/Badge";
import {
  formatMoney,
  formatShortDate,
  getPlanStatusMeta,
  getBillingIntervalLabel,
} from "./subscriptionUiUtils";

interface PlansPricingSectionProps {
  plans: SubscriptionPlanConfig[];
  subscriptions: SubscriptionRecord[];
  stagedPromos: StagedPromotionDraft[];
  permissions: AdminRolePermissions;
  onCreatePlan: () => void;
  onEditPlan: (plan: SubscriptionPlanConfig) => void;
  onInspectPlan: (plan: SubscriptionPlanConfig, initialPreviewMode?: boolean) => void;
  onChangePlanStatus: (plan: SubscriptionPlanConfig, targetStatus: PlanStatus) => void;
  onSaveStagedPromo: (promo: StagedPromotionDraft) => void;
}

export const PlansPricingSection: React.FC<PlansPricingSectionProps> = ({
  plans,
  subscriptions,
  stagedPromos,
  permissions,
  onCreatePlan,
  onEditPlan,
  onInspectPlan,
  onChangePlanStatus,
  onSaveStagedPromo,
}) => {
  const [layoutMode, setLayoutMode] = useState<"cards" | "table">("cards");
  const [showPromoStaging, setShowPromoStaging] = useState<boolean>(false);
  const [newPromoName, setNewPromoName] = useState("");
  const [newPromoCode, setNewPromoCode] = useState("");
  const [newPromoDiscount, setNewPromoDiscount] = useState("15");

  const getSubscriberCountForPlan = (planId: string) =>
    subscriptions.filter(
      (s) => s.planId === planId && (s.status === "active" || s.status === "cancellation_scheduled") && !s.isComplimentary
    ).length;

  const handleAddDraftPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoName.trim() || !newPromoCode.trim()) return;
    const val = Math.min(80, Math.max(1, Number(newPromoDiscount) || 10));
    onSaveStagedPromo({
      id: `STAGE-PROMO-${Date.now().toString().slice(-3)}`,
      name: newPromoName.trim(),
      promoCode: newPromoCode.trim().toUpperCase(),
      discountType: "percentage",
      discountValue: val,
      applicablePlanIds: ["12-months", "6-months"],
      startDate: "2027-01-01",
      endDate: "2027-03-01",
      redemptionLimit: 1000,
      usageCount: 0,
      regions: ["Global"],
      status: "staged_inactive",
      note: "Local inactive staging draft. Not live in mobile app until promo API support is released.",
    });
    setNewPromoName("");
    setNewPromoCode("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header Controls & Pricing Governance Notice */}
      <div
        style={{
          padding: "16px 20px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
            NobleBond Premium Plans & Published Pricing Catalog
          </h3>
          <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
            Synced to mobile client plans (12 Months $59.88, 6 Months $41.94, 1 Month $9.99) plus archived legacy tiers.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <div
            style={{
              display: "flex",
              backgroundColor: "var(--bg-surface-elevated)",
              padding: "3px",
              borderRadius: "9px",
              border: "1px solid var(--border)",
            }}
          >
            <button
              type="button"
              onClick={() => setLayoutMode("cards")}
              style={{
                padding: "5px 9px",
                borderRadius: "7px",
                border: "none",
                backgroundColor: layoutMode === "cards" ? "var(--bg-card)" : "transparent",
                color: layoutMode === "cards" ? "var(--text-main)" : "var(--text-muted)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              <LayoutGrid size={13} /> Cards
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode("table")}
              style={{
                padding: "5px 9px",
                borderRadius: "7px",
                border: "none",
                backgroundColor: layoutMode === "table" ? "var(--bg-card)" : "transparent",
                color: layoutMode === "table" ? "var(--text-main)" : "var(--text-muted)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              <List size={13} /> Table
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowPromoStaging(!showPromoStaging)}
            style={{
              padding: "8px 13px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: showPromoStaging ? "var(--bg-active)" : "var(--bg-surface)",
              color: showPromoStaging ? "var(--primary)" : "var(--text-main)",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Tag size={14} /> Promotions Readiness ({stagedPromos.length} Draft)
          </button>

          <button
            type="button"
            disabled={!permissions.canManagePlans}
            onClick={onCreatePlan}
            style={{
              padding: "8px 15px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: permissions.canManagePlans ? "var(--primary)" : "var(--border)",
              color: "#FFFFFF",
              fontSize: "12.5px",
              fontWeight: 700,
              cursor: permissions.canManagePlans ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Plus size={14} /> Create Plan (Demo)
          </button>
        </div>
      </div>

      {/* Pricing Integrity & Store Provider Notice */}
      <div
        style={{
          padding: "12px 16px",
          borderRadius: "12px",
          backgroundColor: "var(--status-info-bg)",
          border: "1px solid rgba(37, 99, 235, 0.25)",
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
          fontSize: "12px",
          color: "var(--text-main)",
        }}
      >
        <ShieldAlert size={16} color="var(--status-info)" style={{ flexShrink: 0, marginTop: "2px" }} />
        <div>
          <strong>Pricing & Provider Integrity Policy:</strong> Updating a published plan price in this catalog only impacts <em>new subscriptions going forward</em>. Existing subscribers keep their agreed historical billing amount unless migrated through authorized Apple App Store, Google Play, or Stripe subscription update flows. Deactivating a plan stops new mobile purchases without cancelling active members.
        </div>
      </div>

      {/* Cards or Table Display */}
      {layoutMode === "cards" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(295px, 1fr))",
            gap: "18px",
          }}
        >
          {plans.map((plan) => {
            const subCount = getSubscriberCountForPlan(plan.id);
            const statusMeta = getPlanStatusMeta(plan.status);
            return (
              <div
                key={plan.id}
                style={{
                  padding: "22px",
                  backgroundColor: "var(--bg-card)",
                  border: plan.isMostPopular ? "2px solid var(--primary)" : "1px solid var(--border)",
                  borderRadius: "18px",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  position: "relative",
                  opacity: plan.status === "archived" ? 0.85 : 1,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                  <div>
                    <div style={{ fontSize: "17px", fontWeight: 800, color: "var(--text-main)" }}>{plan.name}</div>
                    <div style={{ fontSize: "11px", fontFamily: "monospace", color: "var(--text-muted)", marginTop: "2px" }}>
                      ID: {plan.identifier}
                    </div>
                  </div>
                  <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "28px", fontWeight: 800, color: "var(--primary)" }}>
                    {formatMoney(plan.price, plan.currencySymbol)}
                  </span>
                  <span style={{ fontSize: "12.5px", color: "var(--text-secondary)", fontWeight: 600 }}>
                    / {getBillingIntervalLabel(plan.billingInterval)}
                  </span>
                  {plan.originalPrice && (
                    <span style={{ fontSize: "12px", color: "var(--text-muted)", textDecoration: "line-through" }}>
                      {formatMoney(plan.originalPrice, plan.currencySymbol)}
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {plan.isMostPopular && <Badge variant="primary">MOST POPULAR</Badge>}
                  {plan.discountTag && <Badge variant="champagne">{plan.discountTag}</Badge>}
                  <Badge variant={plan.visibleInMobileApp ? "info" : "neutral"}>
                    {plan.visibleInMobileApp ? "Visible in Mobile App" : "Hidden from Storefront"}
                  </Badge>
                </div>

                <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", lineHeight: 1.45, margin: 0 }}>
                  {plan.description}
                </p>

                {plan.pendingPriceChange && (
                  <div
                    style={{
                      padding: "8px 10px",
                      borderRadius: "8px",
                      backgroundColor: "var(--status-warning-bg)",
                      fontSize: "11.5px",
                      color: "var(--status-warning)",
                      fontWeight: 600,
                    }}
                  >
                    Scheduled Price Notice: {formatMoney(plan.pendingPriceChange.newPrice, plan.currencySymbol)} effective {formatShortDate(plan.pendingPriceChange.effectiveDate)}
                  </div>
                )}

                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: "10px",
                    backgroundColor: "var(--bg-surface-elevated)",
                    fontSize: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>Active Paid Subscribers:</span>
                  <strong style={{ color: "var(--text-main)", fontSize: "14px" }}>{subCount}</strong>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                    Included Entitlements ({plan.entitlementKeys.length})
                  </div>
                  {plan.entitlementKeys.slice(0, 4).map((k) => (
                    <div key={k} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-main)" }}>
                      <Check size={13} color="var(--status-success)" />
                      <span>{k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}</span>
                    </div>
                  ))}
                  {plan.entitlementKeys.length > 4 && (
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      + {plan.entitlementKeys.length - 4} more benefits included
                    </div>
                  )}
                </div>

                <div style={{ fontSize: "11px", color: "var(--text-muted)", borderTop: "1px solid var(--border-light)", paddingTop: "10px" }}>
                  Regions: {plan.availableRegions.slice(0, 3).join(", ")}
                  {plan.availableRegions.length > 3 ? ` +${plan.availableRegions.length - 3}` : ""} &bull; Updated {formatShortDate(plan.updatedAt)}
                </div>

                {/* Plan Action Strip */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => onInspectPlan(plan, false)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "9px",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--bg-surface)",
                      color: "var(--text-main)",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                    }}
                  >
                    <Eye size={13} /> View
                  </button>
                  <button
                    type="button"
                    onClick={() => onInspectPlan(plan, true)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "9px",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--bg-surface)",
                      color: "var(--primary)",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                    title="Preview Mobile Card"
                  >
                    <Smartphone size={13} /> Preview
                  </button>
                  <button
                    type="button"
                    disabled={!permissions.canManagePlans}
                    onClick={() => onEditPlan(plan)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "9px",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--bg-surface)",
                      color: permissions.canManagePlans ? "var(--text-main)" : "var(--text-muted)",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: permissions.canManagePlans ? "pointer" : "not-allowed",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <Edit3 size={13} /> Edit
                  </button>
                  {plan.status === "active" ? (
                    <button
                      type="button"
                      disabled={!permissions.canManagePlans}
                      onClick={() => onChangePlanStatus(plan, "inactive")}
                      style={{
                        padding: "8px 10px",
                        borderRadius: "9px",
                        border: "1px solid rgba(217, 119, 6, 0.35)",
                        backgroundColor: "var(--status-warning-bg)",
                        color: "var(--status-warning)",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: permissions.canManagePlans ? "pointer" : "not-allowed",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <Power size={13} /> Deactivate
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!permissions.canManagePlans}
                      onClick={() => onChangePlanStatus(plan, "active")}
                      style={{
                        padding: "8px 10px",
                        borderRadius: "9px",
                        border: "1px solid rgba(20, 132, 95, 0.35)",
                        backgroundColor: "var(--status-success-bg)",
                        color: "var(--status-success)",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: permissions.canManagePlans ? "pointer" : "not-allowed",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <Power size={13} /> Activate
                    </button>
                  )}
                  {plan.status !== "archived" && (
                    <button
                      type="button"
                      disabled={!permissions.canManagePlans}
                      onClick={() => onChangePlanStatus(plan, "archived")}
                      style={{
                        padding: "8px",
                        borderRadius: "9px",
                        border: "1px solid var(--border)",
                        backgroundColor: "var(--bg-surface)",
                        color: "var(--text-secondary)",
                        fontSize: "12px",
                        cursor: permissions.canManagePlans ? "pointer" : "not-allowed",
                      }}
                      title="Archive Plan"
                    >
                      <Archive size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
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
                <th style={{ padding: "12px 14px" }}>PLAN NAME & ID</th>
                <th style={{ padding: "12px 14px" }}>INTERVAL</th>
                <th style={{ padding: "12px 14px" }}>PRICE</th>
                <th style={{ padding: "12px 14px" }}>REGIONS</th>
                <th style={{ padding: "12px 14px" }}>ACTIVE SUBS</th>
                <th style={{ padding: "12px 14px" }}>STATUS</th>
                <th style={{ padding: "12px 14px" }}>CREATED / UPDATED</th>
                <th style={{ padding: "12px 14px" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => {
                const statusMeta = getPlanStatusMeta(p.status);
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{p.name}</div>
                      <div style={{ fontSize: "11px", fontFamily: "monospace", color: "var(--text-muted)" }}>{p.identifier}</div>
                    </td>
                    <td style={{ padding: "12px 14px", color: "var(--text-secondary)" }}>
                      {getBillingIntervalLabel(p.billingInterval)}
                    </td>
                    <td style={{ padding: "12px 14px", fontWeight: 700, color: "var(--primary)" }}>
                      {formatMoney(p.price, p.currencySymbol)} {p.currency}
                    </td>
                    <td style={{ padding: "12px 14px", color: "var(--text-secondary)", fontSize: "12px" }}>
                      {p.availableRegions.slice(0, 2).join(", ")}
                    </td>
                    <td style={{ padding: "12px 14px", fontWeight: 700 }}>{getSubscriberCountForPlan(p.id)}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: "11.5px", color: "var(--text-muted)" }}>
                      Created: {formatShortDate(p.createdAt)}
                      <br />
                      Updated: {formatShortDate(p.updatedAt)}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          type="button"
                          onClick={() => onInspectPlan(p, false)}
                          style={{ padding: "5px 9px", borderRadius: "7px", border: "1px solid var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-main)", fontSize: "11.5px", cursor: "pointer" }}
                        >
                          View
                        </button>
                        <button
                          type="button"
                          disabled={!permissions.canManagePlans}
                          onClick={() => onEditPlan(p)}
                          style={{ padding: "5px 9px", borderRadius: "7px", border: "1px solid var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-main)", fontSize: "11.5px", cursor: permissions.canManagePlans ? "pointer" : "not-allowed" }}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Future-Ready Promotions Staging Panel (Disclosure Compliant — Section 13) */}
      {showPromoStaging && (
        <div
          className="animate-fade-in"
          style={{
            padding: "20px",
            backgroundColor: "var(--bg-card)",
            border: "1px dashed var(--border)",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h4 style={{ fontSize: "15px", fontWeight: 800, color: "var(--text-main)" }}>
                  Promotions & Introductory Offers (Future-Ready Staging)
                </h4>
                <Badge variant="neutral">Not Active in Production Client</Badge>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "3px" }}>
                Inspection of the NobleBond mobile codebase confirms promotional codes and free trials are not yet enabled in mobile checkout. Drafts staged here remain inactive locally until backend coupon redemption endpoints ship.
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px" }}>
            {stagedPromos.map((pr) => (
              <div
                key={pr.id}
                style={{
                  padding: "14px",
                  borderRadius: "12px",
                  backgroundColor: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: "13px", color: "var(--text-main)" }}>{pr.name}</strong>
                  <Badge variant="neutral">STAGED DRAFT</Badge>
                </div>
                <div style={{ fontSize: "12px", fontFamily: "monospace", color: "var(--primary)", marginTop: "4px", fontWeight: 700 }}>
                  Code: {pr.promoCode} ({pr.discountValue}% off)
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                  Window: {pr.startDate} to {pr.endDate} &bull; Limit: {pr.redemptionLimit}
                </div>
              </div>
            ))}
          </div>

          {permissions.canManagePlans && (
            <form
              onSubmit={handleAddDraftPromo}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                paddingTop: "10px",
                borderTop: "1px solid var(--border-light)",
              }}
            >
              <input
                type="text"
                value={newPromoName}
                onChange={(e) => setNewPromoName(e.target.value)}
                placeholder="Draft campaign name..."
                style={{
                  flex: "1 1 180px",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-main)",
                  fontSize: "12.5px",
                }}
              />
              <input
                type="text"
                value={newPromoCode}
                onChange={(e) => setNewPromoCode(e.target.value)}
                placeholder="Code (e.g. SPRING_DRAFT)"
                style={{
                  flex: "0 1 160px",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-main)",
                  fontSize: "12.5px",
                  textTransform: "uppercase",
                }}
              />
              <input
                type="number"
                value={newPromoDiscount}
                onChange={(e) => setNewPromoDiscount(e.target.value)}
                min={1}
                max={80}
                style={{
                  width: "80px",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-main)",
                  fontSize: "12.5px",
                }}
                title="Discount percentage"
              />
              <button
                type="submit"
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-main)",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Save Inactive Draft
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

