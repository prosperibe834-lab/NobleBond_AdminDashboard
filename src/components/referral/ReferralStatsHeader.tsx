import React from "react";
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  UserCheck,
  UserPlus,
  Gift,
  Award,
  Hourglass,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import type {
  ReferralOverviewKpis,
  ReferralTabKey,
} from "../../types/referralManagement.types";
import { formatReferralPoints } from "./referralUiUtils";

interface ReferralStatsHeaderProps {
  kpis: ReferralOverviewKpis;
  onCardNavigate: (tab: ReferralTabKey, preset?: string) => void;
}

export const ReferralStatsHeader: React.FC<ReferralStatsHeaderProps> = ({
  kpis,
  onCardNavigate,
}) => {
  const cards: Array<{
    label: string;
    value: string;
    sublabel: string;
    trend: string;
    icon: React.ReactNode;
    accentColor: string;
    targetTab: ReferralTabKey;
    preset?: string;
  }> = [
    {
      label: "Total Referrals",
      value: kpis.totalReferrals.toLocaleString(),
      sublabel: "All attributed invites",
      trend: "All records",
      icon: <Users size={16} />,
      accentColor: "var(--primary)",
      targetTab: "all_referrals",
      preset: "all",
    },
    {
      label: "Pending Referrals",
      value: kpis.pendingReferrals.toLocaleString(),
      sublabel: "Awaiting OTP or validation",
      trend: "Requires check",
      icon: <Clock size={16} />,
      accentColor: "var(--status-warning)",
      targetTab: "pending_referrals",
      preset: "pending",
    },
    {
      label: "Successful Referrals",
      value: kpis.successfulReferrals.toLocaleString(),
      sublabel: "OTP verified & validated",
      trend: `${kpis.conversionRatePercent}% conv`,
      icon: <CheckCircle2 size={16} />,
      accentColor: "var(--status-success)",
      targetTab: "successful_referrals",
      preset: "successful",
    },
    {
      label: "Rejected Referrals",
      value: kpis.rejectedReferrals.toLocaleString(),
      sublabel: "Self-ref, duplicate or blocked",
      trend: "Protected",
      icon: <XCircle size={16} />,
      accentColor: "var(--status-error)",
      targetTab: "rejected_referrals",
      preset: "rejected",
    },
    {
      label: "Total Referrers",
      value: kpis.totalReferrers.toLocaleString(),
      sublabel: "Active referring members",
      trend: "Codes active",
      icon: <UserCheck size={16} />,
      accentColor: "var(--status-info)",
      targetTab: "referral_codes",
    },
    {
      label: "Referred Users",
      value: kpis.totalReferredUsers.toLocaleString(),
      sublabel: "Distinct invited accounts",
      trend: "0 Pts bonus",
      icon: <UserPlus size={16} />,
      accentColor: "var(--status-info)",
      targetTab: "all_referrals",
    },
    {
      label: "Eligible Rewards",
      value: kpis.eligibleRewardsCount.toLocaleString(),
      sublabel: "Qualified, awaiting release",
      trend: kpis.eligibleRewardsCount > 0 ? "Action ready" : "Caught up",
      icon: <Gift size={16} />,
      accentColor: "var(--accent-lavender)",
      targetTab: "referral_rewards",
      preset: "eligible",
    },
    {
      label: "Points Issued",
      value: formatReferralPoints(kpis.totalPointsIssued),
      sublabel: "Credited to referrers only",
      trend: "Ledger synced",
      icon: <Award size={16} />,
      accentColor: "var(--accent-lavender)",
      targetTab: "referral_rewards",
      preset: "issued",
    },
    {
      label: "Pending Issuance",
      value: kpis.pendingRewardIssuanceCount.toLocaleString(),
      sublabel: `${kpis.failedRewardIssuanceCount} failed • ${kpis.reversedRewardsCount} reversed`,
      trend: "Reward queue",
      icon: <Hourglass size={16} />,
      accentColor: "var(--status-warning)",
      targetTab: "referral_rewards",
      preset: "pending",
    },
    {
      label: "Conversion Rate",
      value: `${kpis.conversionRatePercent}%`,
      sublabel: "Successful / attributed signups",
      trend: "Verified rate",
      icon: <TrendingUp size={16} />,
      accentColor: "var(--status-success)",
      targetTab: "analytics",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(195px, 1fr))",
        gap: "12px",
        marginBottom: "20px",
      }}
    >
      {cards.map((card) => (
        <button
          key={card.label}
          type="button"
          onClick={() => onCardNavigate(card.targetTab, card.preset)}
          style={{
            textAlign: "left",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            padding: "14px",
            cursor: "pointer",
            transition: "transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease",
            boxShadow: "var(--shadow-sm)",
            display: "flex",
            flexDirection: "column",
            gap: "7px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.borderColor = card.accentColor;
            e.currentTarget.style.boxShadow = "var(--shadow-md)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.boxShadow = "var(--shadow-sm)";
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)" }}>
              {card.label}
            </span>
            <span style={{ color: card.accentColor, display: "flex", alignItems: "center", gap: "3px" }}>
              {card.icon}
              <ArrowUpRight size={12} />
            </span>
          </div>

          <div style={{ fontSize: "1.34rem", fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.02em" }}>
            {card.value}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", lineHeight: 1.3 }}>
              {card.sublabel}
            </span>
            <span
              style={{
                fontSize: "0.66rem",
                fontWeight: 700,
                padding: "2px 7px",
                borderRadius: "999px",
                background: "var(--bg-surface-elevated)",
                color: card.accentColor,
                whiteSpace: "nowrap",
              }}
            >
              {card.trend}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

