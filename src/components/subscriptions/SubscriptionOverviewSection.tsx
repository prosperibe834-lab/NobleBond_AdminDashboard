// NobleBond Admin — Subscription Overview Dashboard Section
// Revenue Overview, Subscription Activity, Subscriber Overview, Billing Overview, Recent Events. Zero emojis.

import React from "react";
import {
  TrendingUp,
  Activity,
  Users,
  CreditCard,
  Clock,
  ChevronRight,
  Globe,
  Crown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type {
  SubscriptionPlanConfig,
  SubscriptionRecord,
  SubscriptionTransactionRecord,
  SubscriptionRefundDisputeRecord,
  SubscriptionStatsKpis,
  SubscriptionDateRange,
  SubscriptionTabKey,
} from "../../types/subscriptionManagement.types";
import { isWithinDateRange } from "../../data/subscriptionManagementDataService";
import { Badge } from "../common/Badge";
import {
  formatMoney,
  formatShortDate,
  formatDateTime,
  getSubscriptionStatusMeta,
} from "./subscriptionUiUtils";

interface SubscriptionOverviewSectionProps {
  plans: SubscriptionPlanConfig[];
  subscriptions: SubscriptionRecord[];
  transactions: SubscriptionTransactionRecord[];
  refunds: SubscriptionRefundDisputeRecord[];
  kpis: SubscriptionStatsKpis;
  dateRange: SubscriptionDateRange;
  customStart?: string;
  customEnd?: string;
  canViewFinancialAnalytics: boolean;
  onSelectSubscription: (sub: SubscriptionRecord) => void;
  onSelectTransaction: (tx: SubscriptionTransactionRecord) => void;
  onNavigateTab: (tab: SubscriptionTabKey) => void;
}

export const SubscriptionOverviewSection: React.FC<SubscriptionOverviewSectionProps> = ({
  plans,
  subscriptions,
  transactions,
  refunds,
  kpis,
  dateRange,
  customStart,
  customEnd,
  canViewFinancialAnalytics,
  onSelectSubscription,
  onSelectTransaction,
  onNavigateTab,
}) => {
  // Period-filtered transactions
  const periodTxs = transactions.filter((t) =>
    isWithinDateRange(t.timestamp, dateRange, customStart, customEnd)
  );

  const successfulTxs = periodTxs.filter((t) => t.status === "successful");
  const newSubRevenue = successfulTxs
    .filter((t) => t.transactionType === "initial_purchase")
    .reduce((sum, t) => sum + t.amount, 0);
  const renewalRevenue = successfulTxs
    .filter((t) => t.transactionType === "renewal")
    .reduce((sum, t) => sum + t.amount, 0);

  // Revenue by plan within selected period
  const revenueByPlan = plans.map((plan) => {
    const total = periodTxs
      .filter((t) => t.planId === plan.id && (t.status === "successful" || t.status === "refunded"))
      .reduce((sum, t) => sum + t.amount, 0);
    const activeCount = subscriptions.filter(
      (s) => s.planId === plan.id && (s.status === "active" || s.status === "cancellation_scheduled") && !s.isComplimentary
    ).length;
    return { plan, total, activeCount };
  });

  const maxPlanRev = Math.max(...revenueByPlan.map((p) => p.total), 1);

  // Revenue over time buckets (grouped by month of transaction timestamps)
  const monthBuckets: Array<{ label: string; amount: number }> = (() => {
    const map = new Map<string, number>();
    const orderedMonths = ["Jan", "Feb", "May", "Sep", "Oct", "Nov"];
    orderedMonths.forEach((m) => map.set(m, 0));
    periodTxs
      .filter((t) => t.status === "successful")
      .forEach((t) => {
        const mLabel = new Date(t.timestamp).toLocaleDateString("en-US", { month: "short" });
        map.set(mLabel, (map.get(mLabel) || 0) + t.amount);
      });
    return Array.from(map.entries()).map(([label, amount]) => ({ label, amount }));
  })();
  const maxBucketAmount = Math.max(...monthBuckets.map((b) => b.amount), 10);

  // Subscribers by Country
  const countryMap = new Map<string, number>();
  subscriptions.forEach((s) => {
    countryMap.set(s.country, (countryMap.get(s.country) || 0) + 1);
  });
  const countryBreakdown = Array.from(countryMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Billing Overview counts in period
  const billingStats = {
    successful: periodTxs.filter((t) => t.status === "successful").length,
    failed: periodTxs.filter((t) => t.status === "failed").length,
    pending: periodTxs.filter((t) => t.status === "pending" || t.status === "processing").length,
    refundRequests: refunds.filter((r) => r.recordKind === "refund_request").length,
    disputes: refunds.filter((r) => r.recordKind === "payment_dispute").length,
  };

  // Activity Lists
  const recentSubs = [...subscriptions]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 5);

  const upcomingRenewals = subscriptions
    .filter((s) => s.autoRenew && s.nextRenewalDate && !s.isComplimentary)
    .sort((a, b) => new Date(a.nextRenewalDate!).getTime() - new Date(b.nextRenewalDate!).getTime())
    .slice(0, 4);

  const cancelledOrExpired = subscriptions.filter(
    (s) => s.status === "cancelled" || s.status === "cancellation_scheduled" || s.status === "expired"
  );

  // Recent Subscription Events compiled from real timelines
  const recentEvents = subscriptions
    .flatMap((s) =>
      s.timeline.map((ev) => ({
        ...ev,
        subscriptionId: s.id,
        userName: s.userName,
        subRecord: s,
      }))
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 7);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* ROW 1: REVENUE OVERVIEW & SUBSCRIBER OVERVIEW */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "20px",
        }}
      >
        {/* A. REVENUE OVERVIEW */}
        <div
          style={{
            padding: "22px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            boxShadow: "var(--shadow-sm)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <TrendingUp size={18} color="var(--primary)" />
              <div>
                <h3 style={{ fontSize: "15.5px", fontWeight: 800, color: "var(--text-main)" }}>
                  A. Revenue Overview
                </h3>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  Premium membership billing (USD) &bull; Paid cycles only
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab("analytics")}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary)",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "2px",
              }}
            >
              Analytics <ChevronRight size={14} />
            </button>
          </div>

          {!canViewFinancialAnalytics ? (
            <div
              style={{
                padding: "24px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-surface-elevated)",
                color: "var(--text-secondary)",
                fontSize: "13px",
                textAlign: "center",
              }}
            >
              Financial revenue breakdown requires Billing Operations, Finance Auditor, or Super Admin role permissions.
            </div>
          ) : (
            <>
              {/* Split Metrics: New vs Renewal vs Refund */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "10px",
                  padding: "12px",
                  borderRadius: "12px",
                  backgroundColor: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                }}
              >
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)" }}>NEW SUB REVENUE</div>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--status-success)", marginTop: "2px" }}>
                    {formatMoney(newSubRevenue)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)" }}>RENEWAL REVENUE</div>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--primary)", marginTop: "2px" }}>
                    {formatMoney(renewalRevenue)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)" }}>REFUND TOTALS</div>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--status-error)", marginTop: "2px" }}>
                    -{formatMoney(kpis.refundsTotal)}
                  </div>
                </div>
              </div>

              {/* Monthly Cash Collected Bar Visualization (SVG) */}
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px" }}>
                  Subscription Cash Collected Over Time (USD)
                </div>
                <svg viewBox="0 0 360 115" style={{ width: "100%", height: "115px", overflow: "visible" }}>
                  {monthBuckets.map((b, idx) => {
                    const barHeight = Math.max(6, (b.amount / maxBucketAmount) * 76);
                    const x = idx * 58 + 14;
                    const y = 84 - barHeight;
                    return (
                      <g key={b.label}>
                        <rect
                          x={x}
                          y={y}
                          width={34}
                          height={barHeight}
                          rx={6}
                          fill="var(--primary)"
                          opacity={0.88}
                        />
                        <text
                          x={x + 17}
                          y={y - 5}
                          textAnchor="middle"
                          fontSize="9.5"
                          fontWeight="700"
                          fill="var(--text-main)"
                        >
                          {b.amount > 0 ? `$${b.amount.toFixed(0)}` : "$0"}
                        </text>
                        <text
                          x={x + 17}
                          y={104}
                          textAnchor="middle"
                          fontSize="10.5"
                          fontWeight="600"
                          fill="var(--text-muted)"
                        >
                          {b.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Revenue by Plan Progress List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)" }}>
                  Revenue & Active Subscribers by Plan (Currency: USD)
                </div>
                {revenueByPlan.map(({ plan, total, activeCount }) => {
                  const pct = Math.round((total / maxPlanRev) * 100);
                  return (
                    <div key={plan.id} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                        <span style={{ fontWeight: 600, color: "var(--text-main)" }}>
                          {plan.name}{" "}
                          <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>({activeCount} active)</span>
                        </span>
                        <span style={{ fontWeight: 700, color: "var(--text-main)" }}>{formatMoney(total)} USD</span>
                      </div>
                      <div
                        style={{
                          height: "6px",
                          borderRadius: "999px",
                          backgroundColor: "var(--bg-surface-elevated)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: "100%",
                            borderRadius: "999px",
                            backgroundColor: plan.status === "archived" ? "var(--text-muted)" : "var(--primary)",
                            transition: "width 0.35s ease",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* C & D: SUBSCRIBER OVERVIEW + BILLING OVERVIEW */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* C. SUBSCRIBER OVERVIEW */}
          <div
            style={{
              padding: "22px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Users size={18} color="var(--status-info)" />
                <div>
                  <h3 style={{ fontSize: "15.5px", fontWeight: 800, color: "var(--text-main)" }}>
                    C. Subscriber Overview
                  </h3>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    Geographic distribution & active tier adoption
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab("subscribers")}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--primary)",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "2px",
                }}
              >
                Directory <ChevronRight size={14} />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div style={{ padding: "12px", borderRadius: "12px", backgroundColor: "var(--bg-surface-elevated)" }}>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700 }}>PAID ACTIVE SUBS</div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--status-success)", marginTop: "2px" }}>
                  {kpis.activePremiumSubscribers}
                </div>
              </div>
              <div style={{ padding: "12px", borderRadius: "12px", backgroundColor: "var(--bg-surface-elevated)" }}>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700 }}>COMPLIMENTARY VIP</div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--accent-champagne)", marginTop: "2px" }}>
                  {kpis.complimentarySubscribers}
                </div>
              </div>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px" }}>
                <Globe size={13} />
                <span>Subscribers by Country</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "8px" }}>
                {countryBreakdown.map(([country, count]) => (
                  <div
                    key={country}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "10px",
                      border: "1px solid var(--border-light)",
                      backgroundColor: "var(--bg-app)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "12px",
                    }}
                  >
                    <span style={{ color: "var(--text-main)", fontWeight: 600 }}>{country}</span>
                    <Badge variant="neutral">{count}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* D. BILLING OVERVIEW */}
          <div
            style={{
              padding: "22px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CreditCard size={18} color="var(--accent-champagne)" />
                <div>
                  <h3 style={{ fontSize: "15.5px", fontWeight: 800, color: "var(--text-main)" }}>
                    D. Billing Overview
                  </h3>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    Payment settlement outcomes & active refund queues
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab("payments")}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--primary)",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "2px",
                }}
              >
                Transactions <ChevronRight size={14} />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(115px, 1fr))", gap: "10px" }}>
              <div style={{ padding: "10px 12px", borderRadius: "10px", backgroundColor: "var(--status-success-bg)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 700, color: "var(--status-success)" }}>
                  <CheckCircle2 size={12} /> Successful
                </div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)", marginTop: "3px" }}>
                  {billingStats.successful}
                </div>
              </div>
              <div style={{ padding: "10px 12px", borderRadius: "10px", backgroundColor: "var(--status-error-bg)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 700, color: "var(--status-error)" }}>
                  <XCircle size={12} /> Failed
                </div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)", marginTop: "3px" }}>
                  {billingStats.failed}
                </div>
              </div>
              <div style={{ padding: "10px 12px", borderRadius: "10px", backgroundColor: "var(--status-warning-bg)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 700, color: "var(--status-warning)" }}>
                  <Clock size={12} /> Pending
                </div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)", marginTop: "3px" }}>
                  {billingStats.pending}
                </div>
              </div>
              <div style={{ padding: "10px 12px", borderRadius: "10px", backgroundColor: "var(--bg-surface-elevated)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)" }}>
                  <AlertTriangle size={12} /> Refunds / Disputes
                </div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)", marginTop: "3px" }}>
                  {billingStats.refundRequests + billingStats.disputes}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: SUBSCRIPTION ACTIVITY & RECENT SUBSCRIPTION EVENTS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "20px",
        }}
      >
        {/* B. SUBSCRIPTION ACTIVITY */}
        <div
          style={{
            padding: "22px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            boxShadow: "var(--shadow-sm)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Crown size={18} color="var(--primary)" />
              <div>
                <h3 style={{ fontSize: "15.5px", fontWeight: 800, color: "var(--text-main)" }}>
                  B. Subscription Activity
                </h3>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  Recent activations, upcoming renewals & lifecycle exits
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab("renewals")}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary)",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "2px",
              }}
            >
              Lifecycle <ChevronRight size={14} />
            </button>
          </div>

          {/* Upcoming Renewals highlight */}
          <div>
            <div style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
              Upcoming Renewals ({upcomingRenewals.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {upcomingRenewals.map((s) => (
                <div
                  key={s.id}
                  onClick={() => onSelectSubscription(s)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "10px",
                    backgroundColor: "var(--bg-surface-elevated)",
                    border: "1px solid var(--border-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img
                      src={s.avatar}
                      alt={s.userName}
                      style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }}
                    />
                    <div>
                      <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)" }}>
                        {s.userName}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                        {s.planName} &bull; Renews {formatShortDate(s.nextRenewalDate)}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--primary)" }}>
                    {formatMoney(s.agreedPrice, s.currencySymbol)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Created / Cancelled */}
          <div>
            <div style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
              Latest Activations & Cancellations
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {[...recentSubs.slice(0, 3), ...cancelledOrExpired.slice(0, 2)].map((s, i) => {
                const meta = getSubscriptionStatusMeta(s.status);
                return (
                  <div
                    key={`${s.id}-${i}`}
                    onClick={() => onSelectSubscription(s)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "9px",
                      border: "1px solid var(--border-light)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 700, color: "var(--text-main)" }}>{s.userName}</span>{" "}
                      <span style={{ color: "var(--text-muted)" }}>({s.planName})</span>
                    </div>
                    <Badge variant={meta.variant}>{meta.label}</Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* E. RECENT SUBSCRIPTION EVENTS */}
        <div
          style={{
            padding: "22px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            boxShadow: "var(--shadow-sm)",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Activity size={18} color="var(--accent-lavender)" />
              <div>
                <h3 style={{ fontSize: "15.5px", fontWeight: 800, color: "var(--text-main)" }}>
                  E. Recent Subscription Events
                </h3>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  Chronological billing, activation, renewal & refund events
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab("audit_history")}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary)",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "2px",
              }}
            >
              Audit Log <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {recentEvents.map((ev) => (
              <div
                key={ev.id}
                onClick={() => onSelectSubscription(ev.subRecord)}
                style={{
                  padding: "10px 12px",
                  borderRadius: "10px",
                  backgroundColor: "var(--bg-app)",
                  border: "1px solid var(--border-light)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "12px",
                  cursor: "pointer",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)" }}>
                    {ev.title} &mdash;{" "}
                    <span style={{ color: "var(--primary)" }}>{ev.userName}</span>
                  </div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginTop: "2px", lineHeight: 1.35 }}>
                    {ev.description}
                  </div>
                </div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                  {formatDateTime(ev.timestamp)}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Transaction Peek */}
          {periodTxs.length > 0 && (
            <div style={{ marginTop: "4px", paddingTop: "10px", borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Latest Transaction: <strong style={{ color: "var(--text-main)" }}>{periodTxs[0].id}</strong> ({formatMoney(periodTxs[0].amount, periodTxs[0].currencySymbol)})
              </span>
              <button
                type="button"
                onClick={() => onSelectTransaction(periodTxs[0])}
                style={{
                  padding: "5px 10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-main)",
                  fontSize: "11.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Inspect Receipt
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

