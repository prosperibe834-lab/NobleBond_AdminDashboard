// NobleBond Admin — Subscription Filter Drawer
// Slide-out multi-attribute filter drawer for status, plan, billing interval, currency, country, provider, auto-renew, complimentary type. Zero emojis.

import React from "react";
import { X, Filter, RotateCcw } from "lucide-react";
import type {
  SubscriptionFilterState,
  SubscriptionPlanConfig,
  SubscriptionStatus,
  BillingInterval,
  PaymentProvider,
} from "../../types/subscriptionManagement.types";

interface SubscriptionFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filterState: SubscriptionFilterState;
  plans: SubscriptionPlanConfig[];
  countries: string[];
  onFilterChange: (newFilters: SubscriptionFilterState) => void;
  onResetFilters: () => void;
  totalFiltered: number;
}

const STATUSES: Array<{ value: "all" | SubscriptionStatus; label: string }> = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "past_due", label: "Past Due" },
  { value: "grace_period", label: "Grace Period" },
  { value: "paused", label: "Paused" },
  { value: "cancellation_scheduled", label: "Cancels at Period End" },
  { value: "cancelled", label: "Cancelled" },
  { value: "expired", label: "Expired" },
  { value: "refunded", label: "Refunded" },
  { value: "payment_failed", label: "Payment Failed" },
];

export const SubscriptionFilterDrawer: React.FC<SubscriptionFilterDrawerProps> = ({
  isOpen,
  onClose,
  filterState,
  plans,
  countries,
  onFilterChange,
  onResetFilters,
  totalFiltered,
}) => {
  if (!isOpen) return null;

  const update = <K extends keyof SubscriptionFilterState>(key: K, val: SubscriptionFilterState[K]) => {
    onFilterChange({ ...filterState, [key]: val });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        backgroundColor: "rgba(0, 0, 0, 0.55)",
        backdropFilter: "blur(3px)",
        display: "flex",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        className="animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "400px",
          height: "100%",
          backgroundColor: "var(--bg-card)",
          borderLeft: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div
          style={{
            padding: "18px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Filter size={16} color="var(--primary)" />
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
              Subscription Filters
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>
              SUBSCRIPTION STATUS
            </label>
            <select
              value={filterState.status}
              onChange={(e) => update("status", e.target.value as "all" | SubscriptionStatus)}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>
              PLAN TIER
            </label>
            <select
              value={filterState.planId}
              onChange={(e) => update("planId", e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            >
              <option value="all">All Plans</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (${p.price})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>
              BILLING INTERVAL
            </label>
            <select
              value={filterState.billingInterval}
              onChange={(e) => update("billingInterval", e.target.value as "all" | BillingInterval)}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            >
              <option value="all">All Intervals</option>
              <option value="annual">12 Months (Annual)</option>
              <option value="6_months">6 Months</option>
              <option value="monthly">1 Month (Monthly)</option>
              <option value="weekly">Weekly (Legacy)</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>
              PAYMENT PROVIDER
            </label>
            <select
              value={filterState.paymentProvider}
              onChange={(e) => update("paymentProvider", e.target.value as "all" | PaymentProvider)}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            >
              <option value="all">All Providers</option>
              <option value="stripe_web">Web Gateway (Stripe)</option>
              <option value="apple_app_store">Apple App Store</option>
              <option value="google_play_store">Google Play Store</option>
              <option value="paypal">PayPal</option>
              <option value="admin_complimentary">Complimentary Grant</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>
              COUNTRY
            </label>
            <select
              value={filterState.country}
              onChange={(e) => update("country", e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            >
              <option value="all">All Countries</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>
              AUTO-RENEWAL SETTING
            </label>
            <div style={{ display: "flex", gap: "6px" }}>
              {(
                [
                  { id: "all", label: "All" },
                  { id: "enabled", label: "Auto-Renew On" },
                  { id: "disabled", label: "Auto-Renew Off" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => update("autoRenew", opt.id)}
                  style={{
                    flex: 1,
                    padding: "8px 6px",
                    borderRadius: "8px",
                    border: filterState.autoRenew === opt.id ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                    backgroundColor: filterState.autoRenew === opt.id ? "var(--bg-active)" : "var(--bg-surface)",
                    color: filterState.autoRenew === opt.id ? "var(--primary)" : "var(--text-secondary)",
                    fontSize: "11.5px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>
              BILLING TYPE (PAID VS COMPLIMENTARY)
            </label>
            <div style={{ display: "flex", gap: "6px" }}>
              {(
                [
                  { id: "all", label: "All Types" },
                  { id: "paid_only", label: "Paid Only" },
                  { id: "complimentary_only", label: "Complimentary" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => update("complimentaryFilter", opt.id)}
                  style={{
                    flex: 1,
                    padding: "8px 6px",
                    borderRadius: "8px",
                    border: filterState.complimentaryFilter === opt.id ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                    backgroundColor: filterState.complimentaryFilter === opt.id ? "var(--bg-active)" : "var(--bg-surface)",
                    color: filterState.complimentaryFilter === opt.id ? "var(--primary)" : "var(--text-secondary)",
                    fontSize: "11.5px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <button
            type="button"
            onClick={onResetFilters}
            style={{
              padding: "9px 14px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-secondary)",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <RotateCcw size={13} /> Clear Filters
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "var(--primary)",
              color: "#FFFFFF",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Show {totalFiltered} Results
          </button>
        </div>
      </div>
    </div>
  );
};

