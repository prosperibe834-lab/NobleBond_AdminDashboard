// NobleBond Admin — Plan Create / Edit Modal (Demo Mode Configuration)
// Prevents duplicate identifiers, validates prices/intervals, enforces pricing change integrity. Zero emojis.

import React, { useState, useMemo } from "react";
import { X, ShieldAlert, Check, Crown } from "lucide-react";
import type {
  SubscriptionPlanConfig,
  SubscriptionEntitlementConfig,
  BillingInterval,
  PlanStatus,
  EntitlementKey,
  AdminRolePermissions,
} from "../../../types/subscriptionManagement.types";

interface PlanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPlan: SubscriptionPlanConfig | null;
  existingPlans: SubscriptionPlanConfig[];
  entitlements: SubscriptionEntitlementConfig[];
  permissions: AdminRolePermissions;
  onSavePlan: (plan: SubscriptionPlanConfig, isNew: boolean, reason: string) => void;
}

const REGION_OPTIONS = [
  "Global",
  "Nigeria",
  "United States",
  "United Kingdom",
  "Canada",
  "European Union",
  "Ghana",
];

export const PlanFormModal: React.FC<PlanFormModalProps> = ({
  isOpen,
  onClose,
  editingPlan,
  existingPlans,
  entitlements,
  permissions,
  onSavePlan,
}) => {
  const isNew = !editingPlan;

  const [name, setName] = useState(editingPlan?.name || "");
  const [identifier, setIdentifier] = useState(editingPlan?.identifier || "");
  const [description, setDescription] = useState(editingPlan?.description || "");
  const [billingInterval, setBillingInterval] = useState<BillingInterval>(
    editingPlan?.billingInterval || "monthly"
  );
  const [priceStr, setPriceStr] = useState(editingPlan ? String(editingPlan.price) : "9.99");
  const [currency, setCurrency] = useState(editingPlan?.currency || "USD");
  const [discountTag, setDiscountTag] = useState(editingPlan?.discountTag || "");
  const [displayOrder, setDisplayOrder] = useState(
    editingPlan ? String(editingPlan.displayOrder) : String(existingPlans.length + 1)
  );
  const [status, setStatus] = useState<PlanStatus>(editingPlan?.status || "draft");
  const [visibleInMobileApp, setVisibleInMobileApp] = useState<boolean>(
    editingPlan?.visibleInMobileApp ?? false
  );
  const [isMostPopular, setIsMostPopular] = useState<boolean>(editingPlan?.isMostPopular ?? false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(
    editingPlan?.availableRegions || ["Global"]
  );
  const [selectedEntitlements, setSelectedEntitlements] = useState<EntitlementKey[]>(
    editingPlan?.entitlementKeys || ["unlimitedLikes", "seeWhoLikesYou", "verifiedBadge"]
  );
  const [effectiveDate, setEffectiveDate] = useState(
    editingPlan?.effectiveDate ? editingPlan.effectiveDate.slice(0, 10) : "2026-11-15"
  );
  const [auditReason, setAuditReason] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const priceNum = Number(priceStr);
  const priceChanged = Boolean(editingPlan && Math.abs(editingPlan.price - priceNum) > 0.001);

  const durationMonths = useMemo(() => {
    if (billingInterval === "annual") return 12;
    if (billingInterval === "6_months") return 6;
    if (billingInterval === "monthly") return 1;
    return 0;
  }, [billingInterval]);

  if (!isOpen) return null;

  const toggleRegion = (reg: string) => {
    setSelectedRegions((prev) =>
      prev.includes(reg) ? prev.filter((r) => r !== reg) : [...prev, reg]
    );
  };

  const toggleEntitlement = (key: EntitlementKey) => {
    setSelectedEntitlements((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!name.trim()) {
      setValidationError("Plan name is required.");
      return;
    }
    if (!identifier.trim() || !/^[a-z0-9_-]+$/i.test(identifier.trim())) {
      setValidationError("Plan identifier must use alphanumeric, underscore, or hyphen characters.");
      return;
    }
    if (
      isNew &&
      existingPlans.some(
        (p) =>
          p.identifier.toLowerCase() === identifier.trim().toLowerCase() ||
          p.id.toLowerCase() === identifier.trim().toLowerCase()
      )
    ) {
      setValidationError("Duplicate plan identifier detected. Use a unique identifier.");
      return;
    }
    if (!description.trim()) {
      setValidationError("Plan description is required.");
      return;
    }
    if (isNaN(priceNum) || priceNum <= 0 || priceNum > 5000) {
      setValidationError("Price must be a valid amount greater than 0.");
      return;
    }
    if (priceChanged && !permissions.canChangePricing) {
      setValidationError(
        "Current administrator role lacks 'Change Pricing' permission (Super Administrator required)."
      );
      return;
    }
    if (selectedRegions.length === 0) {
      setValidationError("Select at least one available country or region.");
      return;
    }
    if (!auditReason.trim()) {
      setValidationError("Provide an administrative audit reason for this plan change.");
      return;
    }

    const monthlyEq =
      durationMonths > 0
        ? Number((priceNum / durationMonths).toFixed(2))
        : Number((priceNum * 4.33).toFixed(2));

    const currencySymbol = currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";

    const builtPlan: SubscriptionPlanConfig = {
      id: editingPlan?.id || identifier.trim().toLowerCase().replace(/_/g, "-"),
      identifier: identifier.trim(),
      name: name.trim(),
      description: description.trim(),
      billingInterval,
      durationMonths,
      durationDays: billingInterval === "weekly" ? 7 : undefined,
      price: Number(priceNum.toFixed(2)),
      monthlyEquivalent: monthlyEq,
      originalPrice: editingPlan?.originalPrice,
      discountPercent: editingPlan?.discountPercent,
      discountTag: discountTag.trim() || undefined,
      currency,
      currencySymbol,
      availableRegions: selectedRegions,
      status,
      visibleInMobileApp,
      displayOrder: Math.max(1, Number(displayOrder) || 1),
      isMostPopular,
      entitlementKeys: selectedEntitlements,
      eligibilityNote: editingPlan?.eligibilityNote || "Configurable tier via NobleBond Admin.",
      effectiveDate: new Date(effectiveDate).toISOString(),
      createdAt: editingPlan?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pendingPriceChange: priceChanged
        ? {
            newPrice: Number(priceNum.toFixed(2)),
            effectiveDate: new Date(effectiveDate).toISOString(),
            note: "Applies strictly to future signups; existing subscribers keep agreed billing terms.",
          }
        : undefined,
    };

    onSavePlan(builtPlan, isNew, auditReason.trim());
    onClose();
  };

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
          maxWidth: "700px",
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
                {isNew ? "Create Subscription Plan (Demo)" : `Edit Plan: ${editingPlan.name}`}
              </h2>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0 }}>
                Catalog changes apply only to future purchases and never alter active billing contracts silently.
              </p>
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

        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: "auto", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {validationError && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                backgroundColor: "var(--status-error-bg)",
                border: "1px solid var(--status-error)",
                color: "var(--status-error)",
                fontSize: "12.5px",
                fontWeight: 600,
              }}
            >
              {validationError}
            </div>
          )}

          {priceChanged && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                backgroundColor: "var(--status-warning-bg)",
                border: "1px solid rgba(217, 119, 6, 0.35)",
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                fontSize: "12px",
                color: "var(--text-main)",
              }}
            >
              <ShieldAlert size={15} color="var(--status-warning)" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>
                <strong>Pricing Integrity Check:</strong> Changing price from{" "}
                <strong>${editingPlan?.price.toFixed(2)}</strong> to <strong>${priceNum.toFixed(2)}</strong> updates the published plan only. Existing subscribers remain protected on their agreed billing price.
              </span>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "5px" }}>
                PLAN NAME *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 12 Months Premium"
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "9px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface-elevated)",
                  color: "var(--text-main)",
                  fontSize: "13px",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "5px" }}>
                PLAN IDENTIFIER *
              </label>
              <input
                type="text"
                value={identifier}
                disabled={!isNew}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. nb_premium_3m"
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "9px",
                  border: "1px solid var(--border)",
                  backgroundColor: isNew ? "var(--bg-surface-elevated)" : "var(--bg-app)",
                  color: "var(--text-main)",
                  fontSize: "13px",
                  fontFamily: "monospace",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "5px" }}>
              DESCRIPTION *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Explain tier value and renewal cadence..."
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "9px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                fontSize: "13px",
                resize: "none",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "5px" }}>
                BILLING INTERVAL *
              </label>
              <select
                value={billingInterval}
                onChange={(e) => setBillingInterval(e.target.value as BillingInterval)}
                style={{
                  width: "100%",
                  padding: "9px 10px",
                  borderRadius: "9px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface-elevated)",
                  color: "var(--text-main)",
                  fontSize: "13px",
                }}
              >
                <option value="monthly">Monthly (1 Month)</option>
                <option value="6_months">6 Months</option>
                <option value="annual">12 Months (Annual)</option>
                <option value="weekly">Weekly (Legacy)</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "5px" }}>
                PRICE *
              </label>
              <input
                type="number"
                step="0.01"
                value={priceStr}
                disabled={!permissions.canChangePricing && !isNew}
                onChange={(e) => setPriceStr(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "9px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface-elevated)",
                  color: "var(--text-main)",
                  fontSize: "13px",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "5px" }}>
                CURRENCY
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 10px",
                  borderRadius: "9px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface-elevated)",
                  color: "var(--text-main)",
                  fontSize: "13px",
                }}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "5px" }}>
                STATUS
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PlanStatus)}
                style={{
                  width: "100%",
                  padding: "9px 10px",
                  borderRadius: "9px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface-elevated)",
                  color: "var(--text-main)",
                  fontSize: "13px",
                }}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "5px" }}>
                DISPLAY ORDER
              </label>
              <input
                type="number"
                min={1}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "9px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface-elevated)",
                  color: "var(--text-main)",
                  fontSize: "13px",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "5px" }}>
                EFFECTIVE DATE
              </label>
              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "9px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface-elevated)",
                  color: "var(--text-main)",
                  fontSize: "13px",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "5px" }}>
                BADGE TAG (OPTIONAL)
              </label>
              <input
                type="text"
                value={discountTag}
                onChange={(e) => setDiscountTag(e.target.value)}
                placeholder="e.g. Flexible plan"
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "9px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface-elevated)",
                  color: "var(--text-main)",
                  fontSize: "13px",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12.5px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={visibleInMobileApp}
                onChange={(e) => setVisibleInMobileApp(e.target.checked)}
              />
              <span style={{ fontWeight: 600 }}>Visible in Mobile App Storefront</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12.5px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={isMostPopular}
                onChange={(e) => setIsMostPopular(e.target.checked)}
              />
              <span style={{ fontWeight: 600 }}>Highlight as Most Popular</span>
            </label>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>
              COUNTRY / REGIONAL AVAILABILITY *
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {REGION_OPTIONS.map((reg) => {
                const active = selectedRegions.includes(reg);
                return (
                  <button
                    key={reg}
                    type="button"
                    onClick={() => toggleRegion(reg)}
                    style={{
                      padding: "5px 10px",
                      borderRadius: "999px",
                      border: active ? "1px solid var(--primary)" : "1px solid var(--border)",
                      backgroundColor: active ? "var(--bg-active)" : "var(--bg-surface)",
                      color: active ? "var(--primary)" : "var(--text-secondary)",
                      fontSize: "11.5px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {reg}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>
              INCLUDED NOBLEBOND PREMIUM ENTITLEMENTS
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "8px" }}>
              {entitlements.map((ent) => {
                const checked = selectedEntitlements.includes(ent.key);
                return (
                  <button
                    key={ent.key}
                    type="button"
                    onClick={() => toggleEntitlement(ent.key)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "9px",
                      border: checked ? "1px solid var(--status-success)" : "1px solid var(--border)",
                      backgroundColor: checked ? "var(--status-success-bg)" : "var(--bg-surface)",
                      color: "var(--text-main)",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      textAlign: "left",
                    }}
                  >
                    <Check size={13} color={checked ? "var(--status-success)" : "var(--text-muted)"} />
                    <span>{ent.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "5px" }}>
              AUDIT JUSTIFICATION REASON *
            </label>
            <input
              type="text"
              value={auditReason}
              onChange={(e) => setAuditReason(e.target.value)}
              placeholder="Document reason for creating or modifying this plan..."
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "9px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            />
          </div>

          <div
            style={{
              paddingTop: "14px",
              borderTop: "1px solid var(--border)",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "9px 16px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "9px 20px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "var(--primary)",
                color: "#FFFFFF",
                fontSize: "12.5px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {isNew ? "Save Demo Plan" : "Save Plan Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

