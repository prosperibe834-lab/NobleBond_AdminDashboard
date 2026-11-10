// NobleBond Admin — Subscription Overview KPI Cards & Recurring Revenue Strip
// Dynamic statistics from Premium subscription ledger only. Clickable drilldown navigation. Zero emojis.

import React from "react";
import {
  Users,
  Crown,
  UserPlus,
  XCircle,
  Clock,
  AlertTriangle,
  CreditCard,
  RefreshCw,
  DollarSign,
  TrendingUp,
  Percent,
  BarChart2,
  ShieldCheck,
} from "lucide-react";
import type {
  SubscriptionStatsKpis,
  SubscriptionTabKey,
  SubscriptionStatus,
} from "../../types/subscriptionManagement.types";
import { formatMoney } from "./subscriptionUiUtils";

interface SubscriptionStatsHeaderProps {
  kpis: SubscriptionStatsKpis;
  activeTab: SubscriptionTabKey;
  canViewFinancialAnalytics: boolean;
  onNavigateFilter: (tab: SubscriptionTabKey, statusFilter?: "all" | SubscriptionStatus) => void;
}

export const SubscriptionStatsHeader: React.FC<SubscriptionStatsHeaderProps> = ({
  kpis,
  activeTab,
  canViewFinancialAnalytics,
  onNavigateFilter,
}) => {
  const operationalCards = [
    {
      id: "total_subs",
      label: "Total Subscriptions",
      value: kpis.totalSubscribers.toLocaleString(),
      subtext: `${kpis.complimentarySubscribers} Complimentary VIP`,
      icon: Users,
      color: "var(--primary)",
      bg: "rgba(193, 47, 102, 0.1)",
      targetTab: "subscriptions" as SubscriptionTabKey,
      statusFilter: "all" as const,
    },
    {
      id: "active_premium",
      label: "Active Premium",
      value: kpis.activePremiumSubscribers.toLocaleString(),
      subtext: "Paid active & renewing",
      icon: Crown,
      color: "var(--status-success)",
      bg: "var(--status-success-bg)",
      targetTab: "subscriptions" as SubscriptionTabKey,
      statusFilter: "active" as const,
    },
    {
      id: "new_subs",
      label: "New Subscriptions",
      value: kpis.newSubscribersInPeriod.toLocaleString(),
      subtext: "Within selected period",
      icon: UserPlus,
      color: "var(--status-info)",
      bg: "var(--status-info-bg)",
      targetTab: "subscribers" as SubscriptionTabKey,
    },
    {
      id: "cancelled",
      label: "Cancelled",
      value: kpis.cancelledSubscriptions.toLocaleString(),
      subtext: `${kpis.cancellationScheduledCount} scheduled end-of-period`,
      icon: XCircle,
      color: "var(--text-secondary)",
      bg: "var(--bg-surface-elevated)",
      targetTab: "subscriptions" as SubscriptionTabKey,
      statusFilter: "cancelled" as const,
    },
    {
      id: "expired",
      label: "Expired",
      value: kpis.expiredSubscriptions.toLocaleString(),
      subtext: "Non-renewed term ended",
      icon: Clock,
      color: "var(--text-muted)",
      bg: "var(--bg-surface-elevated)",
      targetTab: "subscriptions" as SubscriptionTabKey,
      statusFilter: "expired" as const,
    },
    {
      id: "past_due",
      label: "Past Due",
      value: kpis.pastDueSubscriptions.toLocaleString(),
      subtext: "Dunning / retry window",
      icon: AlertTriangle,
      color: "var(--status-warning)",
      bg: "var(--status-warning-bg)",
      targetTab: "subscriptions" as SubscriptionTabKey,
      statusFilter: "past_due" as const,
    },
    {
      id: "failed_payments",
      label: "Failed Payments",
      value: kpis.failedPaymentsCount.toLocaleString(),
      subtext: "Requires member update",
      icon: CreditCard,
      color: "var(--status-error)",
      bg: "var(--status-error-bg)",
      targetTab: "failed_payments" as SubscriptionTabKey,
    },
    {
      id: "pending_renewals",
      label: "Pending Renewals",
      value: kpis.pendingRenewalsCount.toLocaleString(),
      subtext: "Scheduled next 14 days",
      icon: RefreshCw,
      color: "var(--accent-lavender)",
      bg: "var(--accent-lavender-bg)",
      targetTab: "renewals" as SubscriptionTabKey,
    },
    {
      id: "sub_revenue",
      label: "Period Revenue (Net)",
      value: canViewFinancialAnalytics ? formatMoney(kpis.netSubscriptionRevenue) : "Restricted",
      subtext: canViewFinancialAnalytics
        ? `Gross ${formatMoney(kpis.grossSubscriptionRevenue)} (-${formatMoney(kpis.refundsTotal)} refunds)`
        : "Finance role required",
      icon: DollarSign,
      color: "var(--accent-champagne)",
      bg: "var(--accent-champagne-bg)",
      targetTab: "payments" as SubscriptionTabKey,
    },
  ];

  const financialMetrics = [
    {
      label: "Monthly Recurring (MRR)",
      value: canViewFinancialAnalytics ? formatMoney(kpis.mrr) : "Restricted",
      hint: "Normalized paid recurring agreements",
      icon: TrendingUp,
      color: "var(--status-success)",
      tab: "analytics" as SubscriptionTabKey,
    },
    {
      label: "Annual Recurring (ARR)",
      value: canViewFinancialAnalytics ? formatMoney(kpis.arr) : "Restricted",
      hint: "Annualized run-rate (MRR x 12)",
      icon: BarChart2,
      color: "var(--primary)",
      tab: "analytics" as SubscriptionTabKey,
    },
    {
      label: "Churn Rate",
      value: `${kpis.churnRatePercent}%`,
      hint: "Cancelled & expired share",
      icon: Percent,
      color: kpis.churnRatePercent > 20 ? "var(--status-error)" : "var(--status-warning)",
      tab: "renewals" as SubscriptionTabKey,
    },
    {
      label: "Renewal Retention",
      value: `${kpis.renewalRatePercent}%`,
      hint: "Auto-renew enabled cohort",
      icon: RefreshCw,
      color: "var(--status-success)",
      tab: "renewals" as SubscriptionTabKey,
    },
    {
      label: "ARPU (Avg Revenue / Sub)",
      value: canViewFinancialAnalytics ? formatMoney(kpis.arpu) : "Restricted",
      hint: "Monthly normalized per active sub",
      icon: DollarSign,
      color: "var(--accent-champagne)",
      tab: "analytics" as SubscriptionTabKey,
    },
    {
      label: "Premium Conversion",
      value: `${kpis.premiumConversionRatePercent}%`,
      hint: "Active paid / total member base",
      icon: ShieldCheck,
      color: "var(--status-info)",
      tab: "subscribers" as SubscriptionTabKey,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {/* Top 9 Operational KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(195px, 1fr))",
          gap: "12px",
        }}
      >
        {operationalCards.map((card) => {
          const Icon = card.icon;
          const isHighlighted = activeTab === card.targetTab && card.statusFilter === "all";
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onNavigateFilter(card.targetTab, card.statusFilter)}
              style={{
                padding: "16px",
                backgroundColor: "var(--bg-card)",
                border: isHighlighted ? `1.5px solid ${card.color}` : "1px solid var(--border)",
                borderRadius: "14px",
                boxShadow: "var(--shadow-sm)",
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                transition: "transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-sm)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)" }}>
                  {card.label}
                </span>
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "9px",
                    backgroundColor: card.bg,
                    color: card.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={15} />
                </div>
              </div>
              <div style={{ fontSize: "21px", fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.02em" }}>
                {card.value}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%" }}>
                {card.subtext}
              </div>
            </button>
          );
        })}
      </div>

      {/* Normalized Recurring SaaS Financial Metrics Strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))",
          gap: "10px",
          padding: "14px 18px",
          backgroundColor: "var(--bg-surface-elevated)",
          border: "1px solid var(--border)",
          borderRadius: "14px",
        }}
      >
        {financialMetrics.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.label}
              type="button"
              onClick={() => onNavigateFilter(m.tab)}
              style={{
                background: "transparent",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
                padding: "4px 6px",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "3px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                <Icon size={12} color={m.color} />
                <span>{m.label}</span>
              </div>
              <div style={{ fontSize: "17px", fontWeight: 800, color: "var(--text-main)" }}>
                {m.value}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                {m.hint}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

