import React from "react";
import {
  CreditCard,
  Share2,
  LifeBuoy,
  ShieldAlert,
  Bell,
  Lock,
  AlertTriangle,
  Info,
} from "lucide-react";
import type { PlatformAnalyticsSnapshot } from "../../../data/platformAnalyticsDataService";
import type {
  AnalyticsRolePermissions,
  DrilldownPayload,
} from "../../../types/analyticsManagement.types";
import { formatMoneyUsd, formatPercent, formatShortDate } from "../analyticsUiUtils";
import { AnalyticsMetricTooltip } from "../AnalyticsMetricTooltip";

interface RevenueReferralSupportSafetySectionProps {
  snapshot: PlatformAnalyticsSnapshot;
  permissions: AnalyticsRolePermissions;
  mode:
    | "premium_revenue_analytics"
    | "referral_analytics"
    | "support_analytics"
    | "moderation_analytics"
    | "notifications_analytics";
  onDrilldown: (payload: DrilldownPayload) => void;
}

const cardStyle: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: 16,
  padding: 18,
  boxShadow: "var(--shadow-sm)",
};

const lockedPanel = (sectionName: string, requiredRole: string) => (
  <div style={cardStyle}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 14 }}>
      <Lock size={18} style={{ color: "var(--text-muted)" }} />
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main)" }}>
          {sectionName} Restricted by Role Permission
        </div>
        <div style={{ fontSize: 12.5, color: "var(--text-secondary)", marginTop: 2 }}>
          Your active RBAC role does not permit viewing {sectionName}. Switch to{" "}
          <strong>{requiredRole}</strong> in the Role Switcher above to audit this view.
        </div>
      </div>
    </div>
  </div>
);

export const RevenueReferralSupportSafetySection: React.FC<
  RevenueReferralSupportSafetySectionProps
> = ({ snapshot, permissions, mode, onDrilldown }) => {
  // 10. Premium Subscriptions & Revenue Analytics
  if (mode === "premium_revenue_analytics") {
    if (!permissions.canViewRevenueAnalytics) {
      return lockedPanel("Premium Subscription & Revenue Analytics", "Super Admin or Finance Lead");
    }

    const failedTxs = snapshot.subTxsCurrent.filter((t) => t.status === "failed");
    const planBreakdown = snapshot.plans.map((plan) => {
      const planSubs = snapshot.activePaidSubs.filter((s) => s.planId === plan.id);
      const rev = snapshot.subTxsCurrent
        .filter((t) => t.planId === plan.id && t.status === "successful")
        .reduce((s, t) => s + t.amount, 0);
      return {
        id: plan.id,
        name: plan.name,
        activeCount: planSubs.length,
        revenueUsd: rev,
      };
    });

    const providerBreakdown = [
      "stripe_web",
      "apple_app_store",
      "google_play_store",
      "paypal",
    ].map((prov) => {
      const subTxs = snapshot.subTxsCurrent.filter(
        (t) => t.paymentProvider === prov && t.status === "successful"
      );
      return {
        provider: prov.replace(/_/g, " "),
        txCount: subTxs.length,
        amountUsd: subTxs.reduce((s, t) => s + t.amount, 0),
      };
    });

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CreditCard size={18} style={{ color: "var(--status-info)" }} />
                <h2 style={{ margin: 0, fontSize: 17, color: "var(--text-main)" }}>
                  Section 10: Premium Subscription & Revenue Analytics (USD)
                </h2>
              </div>
              <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--text-secondary)" }}>
                Tracks fiat subscription billing separately from Refunds, Gift Coin IAP packs, and
                non-cash Connection Points.
              </p>
            </div>
            <AnalyticsMetricTooltip metricId="subscription_churn_rate" />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(185px, 1fr))",
              gap: 12,
              marginBottom: 16,
            }}
          >
            {[
              { label: "Gross Settled Revenue", val: formatMoneyUsd(snapshot.grossSubRevenueUsd), sub: "Successful & gross captured" },
              { label: "Refunds Issued", val: formatMoneyUsd(snapshot.subRefundsUsd), sub: `${snapshot.refundDisputes.length} dispute/refund cases` },
              { label: "Net Subscription Revenue", val: formatMoneyUsd(snapshot.netSubRevenueUsd), sub: "Gross minus processed refunds" },
              { label: "MRR / ARR", val: `${formatMoneyUsd(snapshot.mrrUsd)}`, sub: `ARR: ${formatMoneyUsd(snapshot.arrUsd)}` },
              { label: "Active Paid Subscribers", val: snapshot.activePaidSubs.length, sub: `${snapshot.newPaidSubsCurrent.length} new in window` },
              { label: "Churn / Failed Billing", val: `${snapshot.churnRatePercent}%`, sub: `${failedTxs.length} failed charges` },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  borderRadius: 12,
                  padding: 13,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 21, fontWeight: 800, color: "var(--text-main)", margin: "4px 0" }}>
                  {item.val}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.sub}</div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: 16,
            }}
          >
            <div
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
                borderRadius: 14,
                padding: 14,
              }}
            >
              <h4 style={{ margin: "0 0 10px", fontSize: 14, color: "var(--text-main)" }}>
                Revenue & Subscribers by Plan Tier
              </h4>
              {planBreakdown.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() =>
                    onDrilldown({
                      title: `Plan Tier: ${plan.name}`,
                      subtitle: "Subscription performance breakdown",
                      sourceModuleLabel: "Subscription Management",
                      targetRoute: "/subscriptions",
                      rows: [
                        { label: "Active Paid Subscribers", value: `${plan.activeCount}` },
                        { label: "Window Settled Revenue", value: formatMoneyUsd(plan.revenueUsd) },
                      ],
                      methodologyNote:
                        "Annual and 6-month plans are amortized into MRR while settled invoice sums reflect exact USD captured in the active date window.",
                    })
                  }
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "9px 10px",
                    marginBottom: 6,
                    borderRadius: 9,
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-light)",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)" }}>
                      {plan.name}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {plan.activeCount} active paid subscriptions
                    </div>
                  </div>
                  <strong style={{ fontSize: 13, color: "var(--status-success)" }}>
                    {formatMoneyUsd(plan.revenueUsd)}
                  </strong>
                </button>
              ))}
            </div>

            <div
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
                borderRadius: 14,
                padding: 14,
              }}
            >
              <h4 style={{ margin: "0 0 10px", fontSize: 14, color: "var(--text-main)" }}>
                Settled Billing by Payment Provider
              </h4>
              {providerBreakdown.map((prov) => (
                <div
                  key={prov.provider}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "9px 4px",
                    borderBottom: "1px solid var(--border-light)",
                    fontSize: 12.5,
                  }}
                >
                  <span style={{ textTransform: "capitalize", fontWeight: 600, color: "var(--text-main)" }}>
                    {prov.provider} ({prov.txCount} charges)
                  </span>
                  <strong style={{ color: "var(--text-main)" }}>{formatMoneyUsd(prov.amountUsd)}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 11. Referral Analytics
  if (mode === "referral_analytics") {
    const refs = snapshot.referralsCurrent;
    const qualified = snapshot.successfulReferralsCurrent;
    const pending = refs.filter((r) => r.status === "pending");
    const rejected = refs.filter((r) => r.status === "rejected");

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Share2 size={18} style={{ color: "var(--accent-lavender)" }} />
                <h2 style={{ margin: 0, fontSize: 17, color: "var(--text-main)" }}>
                  Section 11: Referral Growth Funnel & Anti-Fraud Integrity
                </h2>
              </div>
              <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--text-secondary)" }}>
                Referrer-only reward structure (configurable 50 Connection Points after Email/Phone
                OTP + integrity screening; 0 bonus for referred user; pending referrals excluded from
                payouts).
              </p>
            </div>
            <AnalyticsMetricTooltip metricId="referral_conversion_rate" />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(185px, 1fr))",
              gap: 12,
              marginBottom: 16,
            }}
          >
            {[
              { label: "Attributed Referrals", val: refs.length, sub: "In active date window" },
              { label: "OTP Verified Qualified", val: qualified.length, sub: `${snapshot.refConversionRate}% qualification rate` },
              { label: "Pending Verification", val: pending.length, sub: "Never counted as rewarded" },
              { label: "Rejected / Blocked", val: rejected.length, sub: "Ineligible self/dup checks" },
              { label: "Integrity Review Signals", val: snapshot.fraudCases.length, sub: "Non-accusatory risk flags" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  borderRadius: 12,
                  padding: 13,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 23, fontWeight: 800, color: "var(--text-main)", margin: "4px 0" }}>
                  {item.val}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.sub}</div>
              </div>
            ))}
          </div>

          {/* Integrity Review Cases Notice (Non-accusatory wording) */}
          <h4 style={{ margin: "0 0 10px", fontSize: 14, color: "var(--text-main)" }}>
            Automated Integrity Screening Signals
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {snapshot.fraudCases.map((fc) => (
              <div
                key={fc.id}
                style={{
                  padding: 12,
                  borderRadius: 12,
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)" }}>
                    {fc.riskIndicatorLabel} ({fc.id})
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 2 }}>
                    Signal under review for {fc.referrerName} — requires moderator confirmation
                    prior to enforcement.
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    padding: "3px 9px",
                    borderRadius: 999,
                    background: "var(--status-warning-bg)",
                    color: "var(--status-warning)",
                  }}
                >
                  {fc.reviewStatus.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 12. Customer Support Analytics
  if (mode === "support_analytics") {
    if (!permissions.canViewSupportAnalytics) {
      return lockedPanel("Customer Support Analytics", "Super Admin or Safety & Support Lead");
    }

    const tickets = snapshot.ticketsCurrent;
    const resolvedTickets = tickets.filter(
      (t) => t.status === "resolved" || t.status === "closed"
    );
    const ratedTickets = tickets.filter((t) => Boolean(t.satisfaction?.rating));
    const avgCsat =
      ratedTickets.length > 0
        ? (
            ratedTickets.reduce((s, t) => s + (t.satisfaction?.rating || 0), 0) /
            ratedTickets.length
          ).toFixed(1)
        : null;

    const categoryMap = Array.from(
      tickets.reduce((map, t) => {
        map.set(t.categoryGroup, (map.get(t.categoryGroup) || 0) + 1);
        return map;
      }, new Map<string, number>())
    );

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <LifeBuoy size={18} style={{ color: "var(--status-info)" }} />
            <h2 style={{ margin: 0, fontSize: 17, color: "var(--text-main)" }}>
              Section 12: Customer Support Operations & SLA Analytics
            </h2>
          </div>
          <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--text-secondary)" }}>
            Strictly isolated from peer-to-peer Dating Chat Management. Tracks ticket volume, SLA
            targets (first response SLA {snapshot.supportSettings.slaFirstResponseMinutes.medium}m), and
            verified post-resolution CSAT feedback only.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(185px, 1fr))",
              gap: 12,
              marginBottom: 16,
            }}
          >
            {[
              { label: "Total Tickets (Window)", val: tickets.length, sub: "Contact Us + In-App inquiries" },
              { label: "Open / Unresolved", val: snapshot.openTicketsCount, sub: `${snapshot.escalatedTicketsCount} escalated` },
              { label: "Resolved / Closed", val: resolvedTickets.length, sub: "Completed in period" },
              {
                label: "Measured CSAT Rating",
                val: avgCsat ? `${avgCsat} / 5.0` : "Awaiting ratings",
                sub: `${ratedTickets.length} submitted user survey(s)`,
              },
              {
                label: "Configured SLA Target",
                val: `${snapshot.supportSettings.slaFirstResponseMinutes.medium}m / ${Math.round(snapshot.supportSettings.slaResolutionMinutes.medium / 60)}h`,
                sub: "First reply / full resolution",
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  borderRadius: 12,
                  padding: 13,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-main)", margin: "4px 0" }}>
                  {item.val}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.sub}</div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: 16,
            }}
          >
            <div
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
                borderRadius: 14,
                padding: 14,
              }}
            >
              <h4 style={{ margin: "0 0 10px", fontSize: 14, color: "var(--text-main)" }}>
                Ticket Volume by Support Category
              </h4>
              {categoryMap.map(([grp, count]) => (
                <div
                  key={grp}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--border-light)",
                    fontSize: 12.5,
                  }}
                >
                  <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{grp}</span>
                  <strong style={{ color: "var(--primary)" }}>{count} tickets</strong>
                </div>
              ))}
            </div>

            <div
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
                borderRadius: 14,
                padding: 14,
              }}
            >
              <h4 style={{ margin: "0 0 10px", fontSize: 14, color: "var(--text-main)" }}>
                Active Support Agent Workload
              </h4>
              {snapshot.supportAgents.map((agent) => {
                const assigned = tickets.filter((t) => t.assignedAgentId === agent.id).length;
                return (
                  <div
                    key={agent.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 0",
                      borderBottom: "1px solid var(--border-light)",
                      fontSize: 12.5,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{agent.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{agent.roleTitle}</div>
                    </div>
                    <span style={{ fontWeight: 700, color: "var(--text-main)" }}>
                      {assigned} assigned
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 13. Safety & Moderation Analytics
  if (mode === "moderation_analytics") {
    if (!permissions.canViewModerationAnalytics) {
      return lockedPanel("Safety & Moderation Analytics", "Super Admin or Safety & Support Lead");
    }

    const reports = snapshot.reportsCurrent;
    const domainTotals = Array.from(
      reports.reduce((map, r) => {
        map.set(r.domain, (map.get(r.domain) || 0) + 1);
        return map;
      }, new Map<string, number>())
    );

    const resolutionRate =
      reports.length > 0
        ? (reports.filter((r) => r.status === "resolved" || r.status === "dismissed").length /
            reports.length) *
          100
        : 100;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <ShieldAlert size={18} style={{ color: "var(--status-error)" }} />
            <h2 style={{ margin: 0, fontSize: 17, color: "var(--text-main)" }}>
              Section 13: Safety, Moderation & Appeals Analytics
            </h2>
          </div>
          <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--text-secondary)" }}>
            Privacy-safe aggregated safety telemetry across Profiles, Chats, Live Streams, and
            Users. Sensitive investigative descriptions and personal evidence stay confined to
            Moderation workflows.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(185px, 1fr))",
              gap: 12,
              marginBottom: 16,
            }}
          >
            {[
              { label: "Reports Submitted", val: reports.length, sub: `${snapshot.pendingReportsCount} currently open` },
              { label: "Resolution Coverage", val: formatPercent(resolutionRate), sub: "Resolved or dismissed" },
              { label: "Enforcement Actions", val: snapshot.modActionsCurrent.length, sub: "Warnings, restrictions & bans" },
              { label: "Appeals Submitted", val: snapshot.appealsCurrent.length, sub: "Reviewed via Trust & Safety" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  borderRadius: 12,
                  padding: 13,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 23, fontWeight: 800, color: "var(--text-main)", margin: "4px 0" }}>
                  {item.val}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.sub}</div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: 16,
            }}
          >
            <div
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
                borderRadius: 14,
                padding: 14,
              }}
            >
              <h4 style={{ margin: "0 0 10px", fontSize: 14, color: "var(--text-main)" }}>
                Reports by Safety Domain
              </h4>
              {domainTotals.map(([dom, cnt]) => (
                <div
                  key={dom}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--border-light)",
                    fontSize: 12.5,
                  }}
                >
                  <span style={{ textTransform: "capitalize", fontWeight: 600, color: "var(--text-main)" }}>
                    {dom.replace(/_/g, " ")}
                  </span>
                  <strong style={{ color: "var(--status-error)" }}>{cnt} reports</strong>
                </div>
              ))}
            </div>

            <div
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
                borderRadius: 14,
                padding: 14,
              }}
            >
              <h4 style={{ margin: "0 0 10px", fontSize: 14, color: "var(--text-main)" }}>
                Moderator Throughput & SLA
              </h4>
              {snapshot.modWorkloads.map((mw) => (
                <div
                  key={mw.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--border-light)",
                    fontSize: 12.5,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{mw.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {mw.role} • {mw.pendingCount} pending
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, color: "var(--status-success)" }}>
                      {mw.resolvedCount} resolved
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      Avg {mw.avgResolutionTimeHours}h
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 14. Notifications Analytics
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Bell size={18} style={{ color: "var(--primary)" }} />
          <h2 style={{ margin: 0, fontSize: 17, color: "var(--text-main)" }}>
            Section 14: Notifications & Campaign Engagement Analytics
          </h2>
        </div>
        <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--text-secondary)" }}>
          Reflects actual admin broadcast campaigns registered in the Notifications Manager along
          with explicit push/email webhook instrumentation status.
        </p>

        {/* Honest Uninstrumented Open-Rate Telemetry Banner */}
        <div
          style={{
            padding: 12,
            borderRadius: 12,
            background: "var(--status-info-bg)",
            border: "1px solid var(--border-light)",
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <Info size={16} style={{ color: "var(--status-info)", flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 12.5, color: "var(--text-main)", lineHeight: 1.5 }}>
            <strong>Webhook Open/Click Telemetry Pending:</strong> Push open receipts and email click
            webhooks require production FCM/APNs/SendGrid callback integration. NobleBond displays{" "}
            <em>Not Tracked Yet</em> instead of estimating fake open rates.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {snapshot.notificationCampaigns.map((cmp) => (
            <button
              key={cmp.id}
              type="button"
              onClick={() =>
                onDrilldown({
                  title: cmp.title,
                  subtitle: `Campaign Category: ${cmp.category}`,
                  sourceModuleLabel: "Notifications",
                  targetRoute: "/notifications",
                  rows: [
                    { label: "Audience Segment", value: cmp.target },
                    { label: "Delivery Channel", value: cmp.channel },
                    { label: "Eligible Recipients Dispatched", value: `${cmp.deliveredCount}` },
                    {
                      label: "Open / Click Rate",
                      value:
                        cmp.openRateTracked !== null
                          ? `${cmp.openRateTracked}%`
                          : "Unavailable (Pending Webhook)",
                    },
                  ],
                  methodologyNote:
                    "Recipient counts match live active/cohort counts at dispatch time; client open pixels are explicitly marked pending until server webhooks are connected.",
                })
              }
              style={{
                padding: 14,
                borderRadius: 12,
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-main)" }}>
                  {cmp.title}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                  Target: {cmp.target} • Sent {formatShortDate(cmp.sentAt)} • Channel: {cmp.channel}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "var(--primary)" }}>
                    {cmp.deliveredCount} dispatched
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <AlertTriangle size={11} />
                    Open rate: Not tracked yet
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

