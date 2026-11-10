import React from "react";
import { BarChart3, Globe, ShieldAlert, Award, Filter } from "lucide-react";
import type {
  AdminReferralRecord,
  FraudAlertCaseRecord,
  ReferralDateRange,
  ReferralOverviewKpis,
} from "../../types/referralManagement.types";
import { Badge } from "../common/Badge";
import { formatReferralPoints } from "./referralUiUtils";

interface ReferralAnalyticsSectionProps {
  dateRange: ReferralDateRange;
  kpis: ReferralOverviewKpis;
  referrals: AdminReferralRecord[];
  fraudCases: FraudAlertCaseRecord[];
}

export const ReferralAnalyticsSection: React.FC<
  ReferralAnalyticsSectionProps
> = ({ dateRange, kpis, referrals, fraudCases }) => {
  // Average qualification time computed strictly from records having qualificationDate & createdAt
  const qualifiedWithTimes = referrals.filter((r) => r.qualificationDate && r.createdAt);
  const avgQualMinutes =
    qualifiedWithTimes.length > 0
      ? Math.round(
          qualifiedWithTimes.reduce((sum, r) => {
            const diff =
              new Date(r.qualificationDate!).getTime() - new Date(r.createdAt).getTime();
            return sum + Math.max(1, diff / 60000);
          }, 0) / qualifiedWithTimes.length
        )
      : 0;

  const avgSuccessfulPerReferrer =
    kpis.totalReferrers > 0
      ? (kpis.successfulReferrals / kpis.totalReferrers).toFixed(2)
      : "0.00";

  const issuedCount = referrals.filter((r) => r.rewardStatus === "issued").length;
  const failedCount = referrals.filter((r) => r.rewardStatus === "failed").length;
  const issuanceSuccessRate =
    issuedCount + failedCount > 0
      ? Math.round((issuedCount / (issuedCount + failedCount)) * 100)
      : 100;

  // Channel Source Performance
  const sourceCounts = new Map<string, { total: number; successful: number }>();
  referrals.forEach((r) => {
    const curr = sourceCounts.get(r.referralSource) || { total: 0, successful: 0 };
    curr.total += 1;
    if (r.status === "successful") curr.successful += 1;
    sourceCounts.set(r.referralSource, curr);
  });
  const sourceEntries = Array.from(sourceCounts.entries());
  const maxSource = Math.max(1, ...sourceEntries.map(([, v]) => v.total));

  // Country Activity Breakdown (based on referrer + referred geo)
  const countryMap = new Map<string, { total: number; successful: number }>();
  referrals.forEach((r) => {
    const country = r.referredUser.country || "Unknown";
    const curr = countryMap.get(country) || { total: 0, successful: 0 };
    curr.total += 1;
    if (r.status === "successful") curr.successful += 1;
    countryMap.set(country, curr);
  });
  const countryEntries = Array.from(countryMap.entries()).sort((a, b) => b[1].total - a[1].total);

  // Fraud Review Trends by Status
  const fraudStatuses = [
    { label: "Pending Review", count: fraudCases.filter((f) => f.reviewStatus === "pending_review").length, color: "var(--status-warning)" },
    { label: "Under Investigation", count: fraudCases.filter((f) => f.reviewStatus === "under_investigation").length, color: "var(--status-info)" },
    { label: "Cleared", count: fraudCases.filter((f) => f.reviewStatus === "cleared").length, color: "var(--status-success)" },
    { label: "Rejected", count: fraudCases.filter((f) => f.reviewStatus === "rejected").length, color: "var(--status-error)" },
    { label: "Escalated", count: fraudCases.filter((f) => f.reviewStatus === "escalated").length, color: "var(--accent-champagne)" },
  ];

  // Outcome SVG Bars
  const outcomeBars = [
    { label: "Registrations", val: kpis.totalReferrals, color: "var(--primary)" },
    { label: "OTP Verified", val: referrals.filter((r) => r.referredUser.emailVerified || r.referredUser.phoneVerified).length, color: "var(--status-info)" },
    { label: "Qualified", val: kpis.successfulReferrals, color: "var(--status-success)" },
    { label: "Pending", val: kpis.pendingReferrals, color: "var(--status-warning)" },
    { label: "Rejected", val: kpis.rejectedReferrals, color: "var(--status-error)" },
  ];
  const maxOutcome = Math.max(1, ...outcomeBars.map((b) => b.val));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {/* Analytics Top Banner & Summary Metrics */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "16px 18px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "var(--primary-glow)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BarChart3 size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>
                Referral Performance &amp; Conversion Analytics
              </h3>
              <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                Metrics computed directly from scoped referral records (Date window: <strong>{dateRange.toUpperCase()}</strong>)
              </div>
            </div>
          </div>
          <Badge variant="success" size="sm">Issuance Success: {issuanceSuccessRate}%</Badge>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))", gap: "10px" }}>
          <div style={{ padding: "11px", borderRadius: "11px", background: "var(--bg-surface-elevated)" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Total Registrations</div>
            <div style={{ fontSize: "1.14rem", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>{kpis.totalReferrals}</div>
          </div>
          <div style={{ padding: "11px", borderRadius: "11px", background: "var(--bg-surface-elevated)" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Qualification Rate</div>
            <div style={{ fontSize: "1.14rem", fontWeight: 800, color: "var(--status-success)", marginTop: "2px" }}>{kpis.conversionRatePercent}%</div>
          </div>
          <div style={{ padding: "11px", borderRadius: "11px", background: "var(--bg-surface-elevated)" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Avg Successful / Referrer</div>
            <div style={{ fontSize: "1.14rem", fontWeight: 800, color: "var(--primary)", marginTop: "2px" }}>{avgSuccessfulPerReferrer}</div>
          </div>
          <div style={{ padding: "11px", borderRadius: "11px", background: "var(--bg-surface-elevated)" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Connection Points Issued</div>
            <div style={{ fontSize: "1.14rem", fontWeight: 800, color: "var(--accent-lavender)", marginTop: "2px" }}>
              {formatReferralPoints(kpis.totalPointsIssued)}
            </div>
          </div>
          <div style={{ padding: "11px", borderRadius: "11px", background: "var(--bg-surface-elevated)" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Avg Qualification Time</div>
            <div style={{ fontSize: "1.14rem", fontWeight: 800, color: "var(--status-info)", marginTop: "2px" }}>
              {avgQualMinutes > 0 ? `${avgQualMinutes} mins` : "--"}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
        {/* SVG 1: Qualification Stage Breakdown */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Filter size={16} style={{ color: "var(--primary)" }} />
              <span style={{ fontWeight: 700, fontSize: "0.94rem", color: "var(--text-main)" }}>
                Attribution vs OTP Qualification Breakdown
              </span>
            </div>
            <Badge variant="primary" size="sm">Stage Volume</Badge>
          </div>

          <svg viewBox="0 0 380 185" style={{ width: "100%", height: "185px", overflow: "visible" }}>
            {[0.25, 0.5, 0.75, 1].map((line) => (
              <line key={line} x1={10} x2={370} y1={148 - line * 115} y2={148 - line * 115} stroke="var(--border-light)" strokeDasharray="3 3" />
            ))}
            {outcomeBars.map((b, i) => {
              const h = Math.max(8, Math.round((b.val / maxOutcome) * 115));
              const x = 22 + i * 70;
              const y = 148 - h;
              return (
                <g key={b.label}>
                  <rect x={x} y={y} width={40} height={h} rx={7} fill={b.color} opacity={0.92} />
                  <text x={x + 20} y={y - 6} textAnchor="middle" fill="var(--text-main)" fontSize="11" fontWeight="700">{b.val}</text>
                  <text x={x + 20} y={168} textAnchor="middle" fill="var(--text-muted)" fontSize="9.5" fontWeight="600">{b.label}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* SVG 2: Source Channel Performance */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Award size={16} style={{ color: "var(--accent-lavender)" }} />
              <span style={{ fontWeight: 700, fontSize: "0.94rem", color: "var(--text-main)" }}>
                Referral Source Channel Performance
              </span>
            </div>
            <Badge variant="info" size="sm">Attribution Channels</Badge>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
            {sourceEntries.map(([source, vals]) => {
              const pct = Math.max(8, Math.round((vals.total / maxSource) * 100));
              const conv = vals.total > 0 ? Math.round((vals.successful / vals.total) * 100) : 0;
              return (
                <div key={source}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{source}</span>
                    <span style={{ fontWeight: 700, color: "var(--text-secondary)" }}>
                      {vals.successful}/{vals.total} Qualified ({conv}%)
                    </span>
                  </div>
                  <div style={{ height: "9px", background: "var(--bg-surface-elevated)", borderRadius: "999px", overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: "var(--accent-lavender)", borderRadius: "999px" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Geo Country Breakdown */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Globe size={16} style={{ color: "var(--status-success)" }} />
              <span style={{ fontWeight: 700, fontSize: "0.94rem", color: "var(--text-main)" }}>
                Referred Member Geography
              </span>
            </div>
            <Badge variant="success" size="sm">Active Markets</Badge>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {countryEntries.map(([country, vals]) => (
              <div
                key={country}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "9px 11px",
                  borderRadius: "9px",
                  background: "var(--bg-surface-elevated)",
                  fontSize: "0.8rem",
                }}
              >
                <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{country}</span>
                <span style={{ color: "var(--text-secondary)" }}>
                  <strong style={{ color: "var(--status-success)" }}>{vals.successful}</strong> qualified / {vals.total} invites
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Fraud Review Trends */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldAlert size={16} style={{ color: "var(--status-warning)" }} />
              <span style={{ fontWeight: 700, fontSize: "0.94rem", color: "var(--text-main)" }}>
                Fraud &amp; Quality Investigation Status
              </span>
            </div>
            <Badge variant="warning" size="sm">{fraudCases.length} Reviews</Badge>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {fraudStatuses.map((fs) => (
              <div
                key={fs.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "9px 11px",
                  borderRadius: "9px",
                  background: "var(--bg-surface-elevated)",
                  fontSize: "0.8rem",
                }}
              >
                <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{fs.label}</span>
                <span style={{ fontWeight: 800, color: fs.color }}>{fs.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

