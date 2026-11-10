import React from "react";
import {
  Coins,
  Award,
  CreditCard,
  TrendingUp,
  Gift,
  AlertTriangle,
  CheckCircle2,
  RefreshCcw,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import type { WalletOverviewKpis, WalletTabKey } from "../../types/walletManagement.types";
import { formatCoins, formatMoney, formatPoints } from "./walletUiUtils";

interface WalletStatsHeaderProps {
  kpis: WalletOverviewKpis;
  onNavigateTab: (tab: WalletTabKey) => void;
}

interface KpiItem {
  label: string;
  value: string;
  sublabel: string;
  icon: React.ReactNode;
  accentColor: string;
  targetTab: WalletTabKey;
}

export const WalletStatsHeader: React.FC<WalletStatsHeaderProps> = ({
  kpis,
  onNavigateTab,
}) => {
  const giftCoinCards: KpiItem[] = [
    {
      label: "Coins Purchased",
      value: formatCoins(kpis.totalCoinsPurchased),
      sublabel: `${formatMoney(kpis.totalGiftCoinPurchaseVolumeUsd)} IAP & Web Volume`,
      icon: <Coins size={17} />,
      accentColor: "var(--accent-champagne)",
      targetTab: "gift_coins",
    },
    {
      label: "Circulating Coins",
      value: formatCoins(kpis.totalCoinsCirculating),
      sublabel: "Active member Coin balances",
      icon: <TrendingUp size={17} />,
      accentColor: "var(--accent-champagne)",
      targetTab: "user_wallets",
    },
    {
      label: "Live Gifts Sent",
      value: formatCoins(kpis.totalCoinsSpent),
      sublabel: "Spent by viewers in Live sessions",
      icon: <Gift size={17} />,
      accentColor: "var(--accent-champagne)",
      targetTab: "gift_coins",
    },
    {
      label: "Host Receipts (Non-Cash)",
      value: formatCoins(kpis.totalCoinsReceivedByHosts),
      sublabel: `${kpis.failedGiftCoinPurchasesCount} failed purchase(s)`,
      icon: <AlertTriangle size={17} />,
      accentColor:
        kpis.failedGiftCoinPurchasesCount > 0
          ? "var(--status-warning)"
          : "var(--accent-champagne)",
      targetTab: "gift_coins",
    },
  ];

  const pointsCards: KpiItem[] = [
    {
      label: "Points Issued Total",
      value: formatPoints(kpis.totalPointsIssued),
      sublabel: `${formatPoints(kpis.totalReferralRewardsIssuedPoints)} from verified referrals`,
      icon: <Award size={17} />,
      accentColor: "var(--accent-lavender)",
      targetTab: "connection_points",
    },
    {
      label: "Circulating Points",
      value: formatPoints(kpis.totalPointsCirculating),
      sublabel: "Available reward balance across members",
      icon: <TrendingUp size={17} />,
      accentColor: "var(--accent-lavender)",
      targetTab: "user_wallets",
    },
    {
      label: "Points Redeemed",
      value: formatPoints(kpis.totalPointsRedeemed),
      sublabel: "Likes, Super Likes & Profile Boosts",
      icon: <CheckCircle2 size={17} />,
      accentColor: "var(--accent-lavender)",
      targetTab: "connection_points",
    },
    {
      label: "Rewards Queue",
      value: `${kpis.pendingEligibleRewardsCount} Pending`,
      sublabel: `${kpis.rejectedRewardClaimsCount} blocked / rejected claims`,
      icon: <Clock size={17} />,
      accentColor:
        kpis.pendingEligibleRewardsCount > 0
          ? "var(--status-info)"
          : "var(--accent-lavender)",
      targetTab: "rewards_issuance",
    },
  ];

  const premiumCards: KpiItem[] = [
    {
      label: "Gross Subscription Revenue",
      value: formatMoney(kpis.grossPremiumRevenueUsd),
      sublabel: `${kpis.totalPremiumTxCount} total billing record(s)`,
      icon: <CreditCard size={17} />,
      accentColor: "var(--status-success)",
      targetTab: "premium_transactions",
    },
    {
      label: "Net Subscription Revenue",
      value: formatMoney(kpis.netPremiumRevenueUsd),
      sublabel: "After refunds processed",
      icon: <TrendingUp size={17} />,
      accentColor: "var(--status-success)",
      targetTab: "premium_transactions",
    },
    {
      label: "Payment Success Rate",
      value: `${kpis.premiumPaymentSuccessRate}%`,
      sublabel: `${kpis.successfulPremiumPaymentsCount} settled / ${kpis.failedPremiumPaymentsCount} failed`,
      icon: <CheckCircle2 size={17} />,
      accentColor: "var(--status-success)",
      targetTab: "premium_transactions",
    },
    {
      label: "Refunds & Failures",
      value: `${kpis.premiumRefundsCount} / ${kpis.failedPremiumPaymentsCount}`,
      sublabel: `${formatMoney(kpis.refundedPremiumUsd)} refunded (${kpis.pendingPremiumPaymentsCount} pending)`,
      icon: <RefreshCcw size={17} />,
      accentColor:
        kpis.failedPremiumPaymentsCount > 0
          ? "var(--status-error)"
          : "var(--status-warning)",
      targetTab: "reconciliation",
    },
  ];

  const renderGroup = (
    title: string,
    unitBadge: string,
    accent: string,
    accentBg: string,
    items: KpiItem[]
  ) => (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "16px",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
          gap: "8px",
        }}
      >
        <span
          style={{
            fontSize: "0.82rem",
            fontWeight: 700,
            color: "var(--text-main)",
            letterSpacing: "0.02em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            padding: "3px 9px",
            borderRadius: "999px",
            color: accent,
            background: accentBg,
          }}
        >
          {unitBadge}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))",
          gap: "10px",
        }}
      >
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onNavigateTab(item.targetTab)}
            style={{
              textAlign: "left",
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border-light)",
              borderRadius: "12px",
              padding: "12px 13px",
              cursor: "pointer",
              transition: "transform 0.18s ease, border-color 0.18s ease",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.borderColor = item.accentColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "var(--border-light)";
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "var(--text-secondary)",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              <span>{item.label}</span>
              <span style={{ color: item.accentColor, display: "flex", alignItems: "center", gap: "3px" }}>
                {item.icon}
                <ArrowUpRight size={12} />
              </span>
            </div>
            <div
              style={{
                fontSize: "1.18rem",
                fontWeight: 800,
                color: "var(--text-main)",
                letterSpacing: "-0.01em",
              }}
            >
              {item.value}
            </div>
            <div
              style={{
                fontSize: "0.71rem",
                color: "var(--text-muted)",
                lineHeight: 1.35,
              }}
            >
              {item.sublabel}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "22px" }}>
      {renderGroup(
        "Group 1 — Gift Coins Virtual Economy",
        "Unit: Coins (+ IAP Volume)",
        "var(--accent-champagne)",
        "var(--accent-champagne-bg)",
        giftCoinCards
      )}
      {renderGroup(
        "Group 2 — Connection Points Rewards & Perks",
        "Unit: Pts (Non-Cash)",
        "var(--accent-lavender)",
        "var(--accent-lavender-bg)",
        pointsCards
      )}
      {renderGroup(
        "Group 3 — Premium Subscription Financials",
        "Unit: USD (Real Money)",
        "var(--status-success)",
        "var(--status-success-bg)",
        premiumCards
      )}
    </div>
  );
};

