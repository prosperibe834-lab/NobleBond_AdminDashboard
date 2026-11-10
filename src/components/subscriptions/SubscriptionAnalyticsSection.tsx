// NobleBond Admin — Subscription Financial Analytics & Intelligence Section
// Theme-aware SVG charts, MRR/ARR normalization, Gross vs Net revenue clarity, provider breakdown. Zero emojis.

import React from "react";
import {
  TrendingUp,
  BarChart3,
  Globe,
  CreditCard,
  Lock,
  Percent,
} from "lucide-react";
import type {
  SubscriptionPlanConfig,
  SubscriptionRecord,
  SubscriptionTransactionRecord,
  SubscriptionStatsKpis,
  SubscriptionDateRange,
  AdminRolePermissions,
} from "../../types/subscriptionManagement.types";
import { isWithinDateRange } from "../../data/subscriptionManagementDataService";
import { formatMoney, getPaymentProviderLabel } from "./subscriptionUiUtils";

interface SubscriptionAnalyticsSectionProps {
  plans: SubscriptionPlanConfig[];
  subscriptions: SubscriptionRecord[];
  transactions: SubscriptionTransactionRecord[];
  kpis: SubscriptionStatsKpis;
  dateRange: SubscriptionDateRange;
  customStart?: string;
  customEnd?: string;
  permissions: AdminRolePermissions;
}

export const SubscriptionAnalyticsSection: React.FC<SubscriptionAnalyticsSectionProps> = ({
  plans,
  subscriptions,
  transactions,
  kpis,
  dateRange,
  customStart,
  customEnd,
  permissions,
}) => {
  if (!permissions.canViewFinancialAnalytics) {
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
          Financial Analytics Permission Required
        </div>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", maxWidth: "460px" }}>
          Financial analytics and MRR dashboards are restricted to Super Administrator, Billing Operations Lead, and Finance Auditor roles.
        </p>
      </div>
    );
  }

  const periodTxs = transactions.filter((t) =>
    isWithinDateRange(t.timestamp, dateRange, customStart, customEnd)
  );

  // Revenue by Plan
  const planRevList = plans.map((plan) => {
    const rev = periodTxs
      .filter((t) => t.planId === plan.id && t.status === "successful")
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: plan.name, rev };
  });
  const maxPlanRev = Math.max(...planRevList.map((p) => p.rev), 1);

  // Revenue by Provider
  const providers = ["apple_app_store", "google_play_store", "stripe_web", "paypal"] as const;
  const providerRev = providers.map((prov) => {
    const amount = periodTxs
      .filter((t) => t.paymentProvider === prov && t.status === "successful")
      .reduce((sum, t) => sum + t.amount, 0);
    const count = periodTxs.filter((t) => t.paymentProvider === prov && t.status === "successful").length;
    return { prov, label: getPaymentProviderLabel(prov), amount, count };
  });
  const maxProvRev = Math.max(...providerRev.map((p) => p.amount), 1);

  // Monthly Stacked Trend (Initial vs Renewal)
  const monthNames = ["Jan", "Feb", "May", "Sep", "Oct", "Nov"];
  const monthlySeries = monthNames.map((m) => {
    const inMonth = periodTxs.filter(
      (t) =>
        t.status === "successful" &&
        new Date(t.timestamp).toLocaleDateString("en-US", { month: "short" }) === m
    );
    const initial = inMonth
      .filter((t) => t.transactionType === "initial_purchase")
      .reduce((s, t) => s + t.amount, 0);
    const renewal = inMonth
      .filter((t) => t.transactionType === "renewal")
      .reduce((s, t) => s + t.amount, 0);
    return { label: m, initial, renewal, total: initial + renewal };
  });
  const maxMonthTotal = Math.max(...monthlySeries.map((m) => m.total), 10);

  // Geographic Subscriber Count
  const geoMap = new Map<string, number>();
  subscriptions.forEach((s) => geoMap.set(s.country, (geoMap.get(s.country) || 0) + 1));
  const geoStats = Array.from(geoMap.entries()).sort((a, b) => b[1] - a[1]);

  // Failed Payment Rate
  const totalAttempted = periodTxs.length;
  const failedCount = periodTxs.filter((t) => t.status === "failed").length;
  const failedPaymentRate = totalAttempted > 0 ? ((failedCount / totalAttempted) * 100).toFixed(1) : "0.0";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Executive Gross vs Net Revenue Clarity Card */}
      <div
        style={{
          padding: "16px 20px",
          backgroundColor: "var(--bg-surface-elevated)",
          border: "1px solid var(--border)",
          borderRadius: "14px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))",
          gap: "12px",
        }}
      >
        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
            Normalized Paid MRR
          </div>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--status-success)", marginTop: "2px" }}>
            {formatMoney(kpis.mrr)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
            Annual Run-Rate (ARR)
          </div>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--primary)", marginTop: "2px" }}>
            {formatMoney(kpis.arr)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
            Period Gross Collected
          </div>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>
            {formatMoney(kpis.grossSubscriptionRevenue)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
            Period Net (Excl. Refunds)
          </div>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--accent-champagne)", marginTop: "2px" }}>
            {formatMoney(kpis.netSubscriptionRevenue)}
          </div>
          <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
            Before gateway fees & regional VAT
          </div>
        </div>
        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
            Failed Billing Rate
          </div>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--status-error)", marginTop: "2px" }}>
            {failedPaymentRate}%
          </div>
          <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
            {failedCount} of {totalAttempted} transactions
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "20px",
        }}
      >
        {/* Chart 1: Revenue Over Time (New vs Renewal Stacked SVG Bar Chart) */}
        <div
          style={{
            padding: "22px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <TrendingUp size={17} color="var(--primary)" />
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: 800, color: "var(--text-main)" }}>
                  Subscription Revenue Over Time (USD)
                </h3>
                <p style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                  New subscription purchases vs recurring renewal cycles
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", fontSize: "11px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-secondary)" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "2px", backgroundColor: "var(--primary)" }} /> New
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-secondary)" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "2px", backgroundColor: "var(--status-success)" }} /> Renew
              </span>
            </div>
          </div>

          <svg viewBox="0 0 380 155" style={{ width: "100%", height: "155px", overflow: "visible" }}>
            <line x1="0" y1="125" x2="380" y2="125" stroke="var(--border)" strokeWidth="1" />
            {monthlySeries.map((m, idx) => {
              const x = idx * 60 + 20;
              const initH = (m.initial / maxMonthTotal) * 95;
              const renH = (m.renewal / maxMonthTotal) * 95;
              const renY = 125 - renH;
              const initY = renY - initH;
              return (
                <g key={m.label}>
                  {renH > 0 && (
                    <rect x={x} y={renY} width="32" height={renH} rx="3" fill="var(--status-success)" />
                  )}
                  {initH > 0 && (
                    <rect x={x} y={initY} width="32" height={initH} rx="3" fill="var(--primary)" />
                  )}
                  <text x={x + 16} y={Math.min(initY, renY) - 6} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="var(--text-main)">
                    {m.total > 0 ? `$${m.total.toFixed(0)}` : ""}
                  </text>
                  <text x={x + 16} y="143" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--text-muted)">
                    {m.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Chart 2: Revenue by Plan */}
        <div
          style={{
            padding: "22px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <BarChart3 size={17} color="var(--accent-champagne)" />
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 800, color: "var(--text-main)" }}>
                Revenue Breakdown by Plan
              </h3>
              <p style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                Successful USD charges per tier within selected period
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "4px" }}>
            {planRevList.map((p) => {
              const pct = Math.round((p.rev / maxPlanRev) * 100);
              return (
                <div key={p.name} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}>
                    <span style={{ fontWeight: 700, color: "var(--text-main)" }}>{p.name}</span>
                    <span style={{ fontWeight: 800, color: "var(--primary)" }}>{formatMoney(p.rev)} USD</span>
                  </div>
                  <div style={{ height: "10px", borderRadius: "999px", backgroundColor: "var(--bg-surface-elevated)", overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", borderRadius: "999px", backgroundColor: "var(--primary)", transition: "width 0.35s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Revenue by Payment Provider */}
        <div
          style={{
            padding: "22px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CreditCard size={17} color="var(--status-info)" />
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 800, color: "var(--text-main)" }}>
                Revenue by Payment Provider
              </h3>
              <p style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                App Store vs Play Store vs Stripe Web Checkout vs PayPal
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {providerRev.map((pr) => {
              const pct = Math.round((pr.amount / maxProvRev) * 100);
              return (
                <div key={pr.prov} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                    <span style={{ fontWeight: 700, color: "var(--text-main)" }}>
                      {pr.label} <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>({pr.count} tx)</span>
                    </span>
                    <span style={{ fontWeight: 700, color: "var(--status-info)" }}>{formatMoney(pr.amount)}</span>
                  </div>
                  <div style={{ height: "8px", borderRadius: "999px", backgroundColor: "var(--bg-surface-elevated)", overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", borderRadius: "999px", backgroundColor: "var(--status-info)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 4: Geographic Subscriber Distribution & Retention Ratios */}
        <div
          style={{
            padding: "22px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Globe size={17} color="var(--status-success)" />
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 800, color: "var(--text-main)" }}>
                Country Distribution & Lifecycle Rates
              </h3>
              <p style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                Subscriber footprint, Churn Rate & Renewal Retention
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div style={{ padding: "12px", borderRadius: "10px", backgroundColor: "var(--status-success-bg)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700, color: "var(--status-success)" }}>
                <Percent size={12} /> RENEWAL RATE
              </div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-main)" }}>{kpis.renewalRatePercent}%</div>
            </div>
            <div style={{ padding: "12px", borderRadius: "10px", backgroundColor: "var(--status-warning-bg)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700, color: "var(--status-warning)" }}>
                <Percent size={12} /> CHURN RATE
              </div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-main)" }}>{kpis.churnRatePercent}%</div>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {geoStats.map(([country, cnt]) => (
              <div
                key={country}
                style={{
                  flex: "1 1 130px",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  border: "1px solid var(--border-light)",
                  backgroundColor: "var(--bg-surface-elevated)",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                }}
              >
                <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{country}</span>
                <strong style={{ color: "var(--primary)" }}>{cnt}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

