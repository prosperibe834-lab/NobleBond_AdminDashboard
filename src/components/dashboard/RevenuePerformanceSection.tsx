import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Crown,
  Coins,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import type { DashboardMetricsSnapshot } from "../../data/dashboardDataService";
import { Badge } from "../common/Badge";

interface RevenuePerformanceSectionProps {
  data: DashboardMetricsSnapshot;
}

export const RevenuePerformanceSection: React.FC<RevenuePerformanceSectionProps> = ({
  data,
}) => {
  const navigate = useNavigate();
  const rev = data.revenueBreakdown;
  const coins = data.giftCoinsSummary;
  const points = data.connectionPointsSummary;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
        gap: "20px",
      }}
    >
      {/* 1. VERIFIED MONETARY REVENUE DIVERSIFICATION */}
      <div
        style={{
          padding: "22px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "18px",
          boxShadow: "var(--shadow-sm)",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
              Revenue Performance & Inflows
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
              Verified monetary platform sales (fiat currency received)
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/wallet")}
            style={{
              background: "none",
              border: "none",
              color: "var(--primary)",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Ledger <ChevronRight size={14} />
          </button>
        </div>

        {/* Big Gross / Net Numbers */}
        <div
          style={{
            padding: "16px",
            borderRadius: "14px",
            backgroundColor: "var(--bg-surface-elevated)",
            border: "1px solid var(--border-light)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)" }}>
              TOTAL GROSS SALES
            </span>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--status-success)", marginTop: "2px" }}>
              ${rev.totalMonetaryRevenue.toLocaleString()} <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>USD</span>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)" }}>
              REFUNDS & REVERSALS
            </span>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--status-error)", marginTop: "2px" }}>
              -${rev.refundsReversals.toLocaleString()} USD
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
              Net: ${rev.netRevenue.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Revenue Mix Progress Bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Subscriptions */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-main)" }}>
                <Crown size={14} color="var(--primary)" />
                NobleBond Premium Memberships
              </span>
              <span style={{ color: "var(--primary)" }}>
                ${rev.premiumRevenue.toLocaleString()} ({rev.premiumPercentage}%)
              </span>
            </div>
            <div style={{ width: "100%", height: "8px", backgroundColor: "var(--bg-surface-elevated)", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{ width: `${rev.premiumPercentage}%`, height: "100%", backgroundColor: "var(--primary)", borderRadius: "999px" }} />
            </div>
          </div>

          {/* Gift Coin Store */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-main)" }}>
                <Coins size={14} color="var(--accent-champagne)" />
                Live Broadcast Gift Coins Store
              </span>
              <span style={{ color: "var(--accent-champagne)" }}>
                ${rev.giftCoinsRevenue.toLocaleString()} ({rev.giftCoinsPercentage}%)
              </span>
            </div>
            <div style={{ width: "100%", height: "8px", backgroundColor: "var(--bg-surface-elevated)", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{ width: `${rev.giftCoinsPercentage}%`, height: "100%", backgroundColor: "var(--accent-champagne)", borderRadius: "999px" }} />
            </div>
          </div>
        </div>

        {/* Plan Breakdown Pill */}
        <div style={{ display: "flex", gap: "10px", fontSize: "12px", color: "var(--text-secondary)" }}>
          <span>Tiers: <strong>Weekly (16%)</strong></span>
          <span>•</span>
          <span><strong>Monthly (56%)</strong></span>
          <span>•</span>
          <span><strong>Annual (28%)</strong></span>
        </div>
      </div>

      {/* 2. VIRTUAL PRODUCTS: GIFT COINS VS CONNECTION POINTS */}
      <div
        style={{
          padding: "22px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "18px",
          boxShadow: "var(--shadow-sm)",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
              Virtual Currencies & Liabilities
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
              Strict distinction between Live Gift Coins and Reward Connection Points
            </p>
          </div>
          <Badge variant="neutral">Ledger Sync OK</Badge>
        </div>

        {/* Dual Card Row: Coins vs Points */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {/* Gift Coins Box */}
          <div
            style={{
              padding: "14px",
              borderRadius: "14px",
              backgroundColor: "var(--bg-surface-elevated)",
              border: "1px solid var(--border-light)",
              borderTop: "3px solid var(--accent-champagne)",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: "var(--accent-champagne)" }}>
              <Coins size={14} />
              <span>GIFT COINS</span>
            </div>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)" }}>
              {coins.coinsIssued.toLocaleString()}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
              Spent in live: {coins.coinsSpentInGifts.toLocaleString()}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
              Gifts sent: {coins.giftsSentCount.toLocaleString()}
            </div>
          </div>

          {/* Connection Points Box */}
          <div
            style={{
              padding: "14px",
              borderRadius: "14px",
              backgroundColor: "var(--bg-surface-elevated)",
              border: "1px solid var(--border-light)",
              borderTop: "3px solid var(--status-success)",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: "var(--status-success)" }}>
              <Sparkles size={14} />
              <span>CONNECTION POINTS</span>
            </div>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)" }}>
              {points.pointsIssued.toLocaleString()} Pts
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
              Referral bonuses: {points.referralBonusesIssuedCount.toLocaleString()}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
              Spent on perks: {points.pointsSpentOnPerks.toLocaleString()} Pts
            </div>
          </div>
        </div>

        {/* Accounting Compliance Disclaimer */}
        <div
          style={{
            padding: "12px 14px",
            borderRadius: "12px",
            backgroundColor: "rgba(181, 139, 66, 0.08)",
            border: "1px solid rgba(181, 139, 66, 0.2)",
            fontSize: "12px",
            color: "var(--text-secondary)",
            lineHeight: 1.4,
          }}
        >
          <strong>Virtual Accounting Standard:</strong> Gift Coins represent digital in-app commodities consumed exclusively during live broadcasts. They carry zero cash redemption liability. Connection Points represent marketing rewards.
        </div>
      </div>
    </div>
  );
};
