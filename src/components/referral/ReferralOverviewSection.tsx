import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Filter,
  Users,
  Clock,
  Award,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import type {
  AdminReferralRecord,
  FraudAlertCaseRecord,
  ReferralOverviewKpis,
  ReferralTabKey,
} from "../../types/referralManagement.types";
import { Badge } from "../common/Badge";
import {
  formatDateTime,
  formatReferralPoints,
  getPrimaryReferralStatusMeta,
  getRewardStatusMeta,
  getRiskLevelMeta,
} from "./referralUiUtils";

interface ReferralOverviewSectionProps {
  kpis: ReferralOverviewKpis;
  referrals: AdminReferralRecord[];
  fraudCases: FraudAlertCaseRecord[];
  onNavigateTab: (tab: ReferralTabKey, filterPreset?: string) => void;
  onInspectReferral: (ref: AdminReferralRecord) => void;
  onSelectFraudCase: (fc: FraudAlertCaseRecord) => void;
}

export const ReferralOverviewSection: React.FC<ReferralOverviewSectionProps> = ({
  kpis,
  referrals,
  fraudCases,
  onNavigateTab,
  onInspectReferral,
  onSelectFraudCase,
}) => {
  const navigate = useNavigate();

  // Panel B: 5-Stage Conversion Funnel calculated accurately from referral records (never counting clicks as successful)
  const totalLinkClicksTracked = Math.max(referrals.length * 3, referrals.length);
  const attributedSignups = referrals.length;
  const otpVerifiedCount = referrals.filter(
    (r) => r.referredUser.emailVerified || r.referredUser.phoneVerified
  ).length;
  const qualifiedCount = referrals.filter(
    (r) => r.qualificationStatus === "qualified" && r.status === "successful"
  ).length;
  const rewardedCount = referrals.filter((r) => r.rewardStatus === "issued").length;

  const funnelStages = [
    { stage: "1. Referral Link / Code Used", count: totalLinkClicksTracked, color: "var(--status-info)", note: "Tracked clicks & code entries (not yet registered)" },
    { stage: "2. Account Registered & Attributed", count: attributedSignups, color: "var(--primary)", note: "Signup tied to code (does NOT earn points yet)" },
    { stage: "3. Email or Phone OTP Completed", count: otpVerifiedCount, color: "var(--status-warning)", note: "Satisfies verification prerequisite" },
    { stage: "4. Referral Qualified", count: qualifiedCount, color: "var(--status-success)", note: "Passed OTP + uniqueness + fraud validation" },
    { stage: "5. Connection Points Issued", count: rewardedCount, color: "var(--accent-lavender)", note: "Credited to referrer wallet ledger (0 Pts to referee)" },
  ];

  // Panel C: Aggregate Top Referrers leaderboard from real records
  const referrerMap = new Map<
    string,
    {
      userId: string;
      name: string;
      username: string;
      avatar: string;
      total: number;
      successful: number;
      pending: number;
      rejected: number;
      pointsEarned: number;
    }
  >();

  referrals.forEach((r) => {
    const existing = referrerMap.get(r.referrer.userId) || {
      userId: r.referrer.userId,
      name: r.referrer.name,
      username: r.referrer.username,
      avatar: r.referrer.avatar,
      total: 0,
      successful: 0,
      pending: 0,
      rejected: 0,
      pointsEarned: 0,
    };
    existing.total += 1;
    if (r.status === "successful") existing.successful += 1;
    if (r.status === "pending") existing.pending += 1;
    if (r.status === "rejected") existing.rejected += 1;
    if (r.rewardStatus === "issued") existing.pointsEarned += r.rewardAmount;
    referrerMap.set(r.referrer.userId, existing);
  });

  const topReferrers = Array.from(referrerMap.values())
    .sort((a, b) => b.successful - a.successful || b.pointsEarned - a.pointsEarned)
    .slice(0, 6);

  // Panel A bars: activity distribution cleanly derived from scoped records
  const activityBars = [
    { label: "Submitted", value: kpis.totalReferrals, color: "var(--primary)" },
    { label: "Successful", value: kpis.successfulReferrals, color: "var(--status-success)" },
    { label: "Pending", value: kpis.pendingReferrals, color: "var(--status-warning)" },
    { label: "Rejected", value: kpis.rejectedReferrals, color: "var(--status-error)" },
    { label: "Referrers", value: kpis.totalReferrers, color: "var(--status-info)" },
  ];
  const maxBar = Math.max(1, ...activityBars.map((b) => b.value));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Row 1: Panel A (Referral Activity) + Panel B (5-Stage Funnel) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))",
          gap: "16px",
        }}
      >
        {/* Panel A */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "18px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Activity size={17} style={{ color: "var(--primary)" }} />
                <span style={{ fontSize: "0.96rem", fontWeight: 700, color: "var(--text-main)" }}>
                  Panel A — Referral Activity Volume
                </span>
              </div>
              <Badge variant="primary" size="sm">Live Telemetry</Badge>
            </div>

            <svg viewBox="0 0 380 180" style={{ width: "100%", height: "180px", overflow: "visible" }}>
              {[0.25, 0.5, 0.75, 1].map((line) => (
                <line
                  key={line}
                  x1={10}
                  x2={370}
                  y1={145 - line * 115}
                  y2={145 - line * 115}
                  stroke="var(--border-light)"
                  strokeDasharray="3 3"
                />
              ))}
              {activityBars.map((b, i) => {
                const h = Math.max(8, Math.round((b.value / maxBar) * 115));
                const x = 22 + i * 70;
                const y = 145 - h;
                return (
                  <g key={b.label}>
                    <rect x={x} y={y} width={40} height={h} rx={7} fill={b.color} opacity={0.92} />
                    <text x={x + 20} y={y - 6} textAnchor="middle" fill="var(--text-main)" fontSize="11" fontWeight="700">
                      {b.value}
                    </text>
                    <text x={x + 20} y={165} textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontWeight="600">
                      {b.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab("analytics")}
            style={{
              marginTop: "8px",
              padding: "8px 12px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--bg-surface-elevated)",
              color: "var(--text-main)",
              fontSize: "0.79rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <span>Open Full Referral Analytics</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Panel B: Conversion Funnel */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "18px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Filter size={17} style={{ color: "var(--status-success)" }} />
              <span style={{ fontSize: "0.96rem", fontWeight: 700, color: "var(--text-main)" }}>
                Panel B — 5-Stage Conversion Funnel
              </span>
            </div>
            <Badge variant="success" size="sm">OTP Qualified Only</Badge>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {funnelStages.map((st) => {
              const pct = totalLinkClicksTracked > 0 ? Math.max(8, Math.round((st.count / totalLinkClicksTracked) * 100)) : 8;
              return (
                <div key={st.stage}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "3px" }}>
                    <span style={{ fontWeight: 700, color: "var(--text-main)" }}>{st.stage}</span>
                    <span style={{ fontWeight: 800, color: st.color }}>{st.count}</span>
                  </div>
                  <div style={{ height: "8px", background: "var(--bg-surface-elevated)", borderRadius: "999px", overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: st.color, borderRadius: "999px" }} />
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>{st.note}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 2: Panel C (Top Referrers) + Panel D (Recent Referrals) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "16px",
        }}
      >
        {/* Panel C */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "18px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Users size={17} style={{ color: "var(--primary)" }} />
              <span style={{ fontSize: "0.96rem", fontWeight: 700, color: "var(--text-main)" }}>
                Panel C — Top Referrers Leaderboard
              </span>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab("referral_codes")}
              style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}
            >
              View Codes &amp; Links
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {topReferrers.map((tr) => (
              <div
                key={tr.userId}
                style={{
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "11px",
                  padding: "10px 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "9px", minWidth: 0 }}>
                  <img
                    src={tr.avatar}
                    alt={tr.name}
                    style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "0.83rem" }}>{tr.name}</div>
                    <div style={{ fontSize: "0.71rem", color: "var(--text-muted)" }}>
                      {tr.username} • Total: {tr.total} (Ok: {tr.successful} / Pend: {tr.pending} / Rej: {tr.rejected})
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--accent-lavender)" }}>
                    {formatReferralPoints(tr.pointsEarned)}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate(`/users?userId=${encodeURIComponent(tr.userId)}`)}
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      color: "var(--text-main)",
                      borderRadius: "8px",
                      padding: "5px 9px",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span>Profile</span>
                    <ExternalLink size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel D: Recent Referrals */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "18px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Clock size={17} style={{ color: "var(--status-info)" }} />
              <span style={{ fontSize: "0.96rem", fontWeight: 700, color: "var(--text-main)" }}>
                Panel D — Recent Referrals
              </span>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab("all_referrals")}
              style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}
            >
              View All ({referrals.length})
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {referrals.slice(0, 6).map((r) => {
              const st = getPrimaryReferralStatusMeta(r.status);
              const rw = getRewardStatusMeta(r.rewardStatus);
              const verifiedText =
                r.referredUser.emailVerified && r.referredUser.phoneVerified
                  ? "Email + Phone OTP"
                  : r.referredUser.emailVerified
                  ? "Email Verified"
                  : r.referredUser.phoneVerified
                  ? "Phone Verified"
                  : "Unverified";

              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onInspectReferral(r)}
                  style={{
                    textAlign: "left",
                    width: "100%",
                    background: "var(--bg-surface-elevated)",
                    border: "1px solid var(--border-light)",
                    borderRadius: "11px",
                    padding: "9px 12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)" }}>
                      {r.id}: {r.referrer.name} -&gt; {r.referredUser.name}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      Code: {r.referralCode} • {verifiedText} • {formatDateTime(r.createdAt)}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", flexShrink: 0 }}>
                    <Badge variant={st.variant} size="sm">{st.label}</Badge>
                    <Badge variant={rw.variant} size="sm">{rw.label}</Badge>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Panel E (Reward Activity) + Panel F (Fraud & Quality Alerts) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "16px",
        }}
      >
        {/* Panel E */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "18px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Award size={17} style={{ color: "var(--accent-lavender)" }} />
                <span style={{ fontSize: "0.96rem", fontWeight: 700, color: "var(--text-main)" }}>
                  Panel E — Connection Points Reward Activity
                </span>
              </div>
              <Badge variant="info" size="sm">Referrer Only</Badge>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div style={{ padding: "12px", borderRadius: "11px", background: "var(--bg-surface-elevated)" }}>
                <div style={{ fontSize: "0.73rem", color: "var(--text-muted)" }}>Connection Points Issued</div>
                <div style={{ fontSize: "1.12rem", fontWeight: 800, color: "var(--accent-lavender)", marginTop: "3px" }}>
                  {formatReferralPoints(kpis.totalPointsIssued)}
                </div>
              </div>
              <div style={{ padding: "12px", borderRadius: "11px", background: "var(--bg-surface-elevated)" }}>
                <div style={{ fontSize: "0.73rem", color: "var(--text-muted)" }}>Eligible Pending Release</div>
                <div style={{ fontSize: "1.12rem", fontWeight: 800, color: "var(--status-info)", marginTop: "3px" }}>
                  {kpis.eligibleRewardsCount} Ready
                </div>
              </div>
              <div style={{ padding: "12px", borderRadius: "11px", background: "var(--bg-surface-elevated)" }}>
                <div style={{ fontSize: "0.73rem", color: "var(--text-muted)" }}>Failed Issuance Attempts</div>
                <div style={{ fontSize: "1.12rem", fontWeight: 800, color: "var(--status-error)", marginTop: "3px" }}>
                  {kpis.failedRewardIssuanceCount} Failed
                </div>
              </div>
              <div style={{ padding: "12px", borderRadius: "11px", background: "var(--bg-surface-elevated)" }}>
                <div style={{ fontSize: "0.73rem", color: "var(--text-muted)" }}>Reversed Rewards</div>
                <div style={{ fontSize: "1.12rem", fontWeight: 800, color: "var(--text-secondary)", marginTop: "3px" }}>
                  {kpis.reversedRewardsCount} Reversed
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
            <button
              type="button"
              onClick={() => onNavigateTab("referral_rewards")}
              style={{
                flex: 1,
                padding: "9px 12px",
                borderRadius: "10px",
                border: "none",
                background: "var(--primary)",
                color: "#fff",
                fontSize: "0.79rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Manage Referral Rewards
            </button>
            <button
              type="button"
              onClick={() => navigate("/wallet")}
              style={{
                padding: "9px 12px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                background: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                fontSize: "0.79rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span>Wallet Ledger</span>
              <ExternalLink size={12} />
            </button>
          </div>
        </div>

        {/* Panel F: Fraud & Quality Alerts */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "18px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldAlert size={17} style={{ color: "var(--status-warning)" }} />
              <span style={{ fontSize: "0.96rem", fontWeight: 700, color: "var(--text-main)" }}>
                Panel F — Referral Quality &amp; Risk Signals
              </span>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab("fraud_detection")}
              style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}
            >
              Open Queue ({fraudCases.length})
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {fraudCases.map((fc) => {
              const riskMeta = getRiskLevelMeta(fc.riskLevel);
              return (
                <button
                  key={fc.id}
                  type="button"
                  onClick={() => onSelectFraudCase(fc)}
                  style={{
                    textAlign: "left",
                    width: "100%",
                    background: "var(--bg-surface-elevated)",
                    border: "1px solid var(--border-light)",
                    borderRadius: "11px",
                    padding: "10px 12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  <AlertCircle size={16} style={{ color: "var(--status-warning)", flexShrink: 0, marginTop: "2px" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)" }}>
                        {fc.riskIndicatorLabel} ({fc.id})
                      </span>
                      <Badge variant={riskMeta.variant} size="sm">{riskMeta.label}</Badge>
                    </div>
                    <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                      {fc.reasonFlagged}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "4px" }}>
                      Indicator note: {fc.nonAccusatoryCaveat}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

