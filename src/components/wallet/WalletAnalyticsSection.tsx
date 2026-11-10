import React from "react";
import { Coins, Award, CreditCard, BarChart3 } from "lucide-react";
import type {
  ConnectionPointsRedemptionRecord,
  GiftCoinPurchaseRecord,
  WalletDateRange,
  WalletOverviewKpis,
} from "../../types/walletManagement.types";
import type { SubscriptionTransactionRecord } from "../../types/subscriptionManagement.types";
import type { LiveGiftTransactionRecord } from "../../types/liveManagement.types";
import { Badge } from "../common/Badge";
import {
  formatCoins,
  formatMoney,
  formatPoints,
} from "./walletUiUtils";
import { NOBLEBOND_POINTS_PERKS } from "../../data/walletManagementDataService";

interface WalletAnalyticsSectionProps {
  dateRange: WalletDateRange;
  kpis: WalletOverviewKpis;
  purchases: GiftCoinPurchaseRecord[];
  liveGifts: LiveGiftTransactionRecord[];
  redemptions: ConnectionPointsRedemptionRecord[];
  subscriptionTxs: SubscriptionTransactionRecord[];
}

export const WalletAnalyticsSection: React.FC<WalletAnalyticsSectionProps> = ({
  dateRange,
  kpis,
  purchases,
  liveGifts,
  redemptions,
  subscriptionTxs,
}) => {
  // 1. Gift Coins Chart Data (strictly Coins domain)
  const coinStreams = [
    { label: "Purchased Coins", value: kpis.totalCoinsPurchased, color: "#E6C29F" },
    { label: "Circulating Wallets", value: kpis.totalCoinsCirculating, color: "#E11D48" },
    { label: "Live Spent", value: kpis.totalCoinsSpent, color: "#3B82F6" },
    { label: "Host Receipts", value: kpis.totalCoinsReceivedByHosts, color: "#10B981" },
  ];
  const maxCoinVal = Math.max(100, ...coinStreams.map((c) => c.value));

  // 2. Connection Points Perk Utilization (strictly Points domain)
  const perkBars = NOBLEBOND_POINTS_PERKS.map((perk) => {
    const pts = redemptions
      .filter((r) => r.perkId === perk.id && r.status === "completed")
      .reduce((s, r) => s + r.pointsSpent, 0);
    return { label: perk.title, pts, cost: perk.pointsCost };
  });
  const maxPerkPts = Math.max(50, ...perkBars.map((p) => p.pts));

  // 3. Premium Provider USD Revenue Split (strictly USD domain)
  const providers = [
    { key: "stripe_web", label: "Stripe Web", color: "#10B981" },
    { key: "apple_app_store", label: "Apple IAP", color: "#3B82F6" },
    { key: "google_play_store", label: "Google Play", color: "#8B5CF6" },
    { key: "paypal", label: "PayPal", color: "#F59E0B" },
  ];
  const providerRevenue = providers.map((pv) => {
    const amount = subscriptionTxs
      .filter((t) => t.paymentProvider === pv.key && t.status === "successful")
      .reduce((s, t) => s + t.amount, 0);
    return { ...pv, amount: Number(amount.toFixed(2)) };
  });
  const maxProviderUsd = Math.max(10, ...providerRevenue.map((p) => p.amount));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {/* Analytics Header */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "16px 18px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "var(--primary-glow)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BarChart3 size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>
              Separated Financial Intelligence & Economics Analytics
            </h3>
            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
              Dedicated analytics per currency/unit — active filter window: <strong>{dateRange.toUpperCase()}</strong>
            </div>
          </div>
        </div>
        <Badge variant="primary" size="sm">3 Independent Charts</Badge>
      </div>

      {/* 3 Independent Domain Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
        {/* Chart 1: Gift Coins Ledger Flow SVG */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "18px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Coins size={17} style={{ color: "var(--accent-champagne)" }} />
              <span style={{ fontWeight: 700, fontSize: "0.94rem", color: "var(--text-main)" }}>
                Gift Coins Volume Breakdown
              </span>
            </div>
            <Badge variant="champagne" size="sm">Coins Only</Badge>
          </div>

          <svg viewBox="0 0 360 190" style={{ width: "100%", height: "190px", overflow: "visible" }}>
            {[0.25, 0.5, 0.75, 1].map((line) => (
              <line
                key={line}
                x1={10}
                x2={350}
                y1={155 - line * 125}
                y2={155 - line * 125}
                stroke="var(--border-light)"
                strokeDasharray="3 3"
              />
            ))}
            {coinStreams.map((bar, i) => {
              const barH = Math.max(8, Math.round((bar.value / maxCoinVal) * 125));
              const x = 28 + i * 82;
              const y = 155 - barH;
              return (
                <g key={bar.label}>
                  <rect x={x} y={y} width={44} height={barH} rx={7} fill={bar.color} opacity={0.9} />
                  <text x={x + 22} y={y - 6} textAnchor="middle" fill="var(--text-main)" fontSize="10" fontWeight="700">
                    {bar.value.toLocaleString()}
                  </text>
                  <text x={x + 22} y={174} textAnchor="middle" fill="var(--text-muted)" fontSize="9.5" fontWeight="600">
                    {bar.label.split(" ")[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "6px", display: "flex", justifyContent: "space-between" }}>
            <span>IAP Orders Analyzed: {purchases.length}</span>
            <span>Live Gifts Analyzed: {liveGifts.length}</span>
          </div>
        </div>

        {/* Chart 2: Connection Points Redemption Mix SVG */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "18px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Award size={17} style={{ color: "var(--accent-lavender)" }} />
              <span style={{ fontWeight: 700, fontSize: "0.94rem", color: "var(--text-main)" }}>
                Connection Points Usage by Perk
              </span>
            </div>
            <Badge variant="info" size="sm">Points Only</Badge>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "8px" }}>
            {perkBars.map((p) => {
              const widthPct = Math.max(5, Math.round((p.pts / maxPerkPts) * 100));
              return (
                <div key={p.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "5px" }}>
                    <span style={{ fontWeight: 600, color: "var(--text-main)" }}>
                      {p.label} ({p.cost} Pts/use)
                    </span>
                    <span style={{ fontWeight: 700, color: "var(--accent-lavender)" }}>{formatPoints(p.pts)}</span>
                  </div>
                  <div style={{ height: "10px", background: "var(--bg-surface-elevated)", borderRadius: "999px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${widthPct}%`,
                        height: "100%",
                        background: "var(--accent-lavender)",
                        borderRadius: "999px",
                        transition: "width 0.35s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "16px", display: "flex", justifyContent: "space-between" }}>
            <span>Total Points Circulating: {formatPoints(kpis.totalPointsCirculating)}</span>
            <span>Pending Referral Queue: {kpis.pendingEligibleRewardsCount}</span>
          </div>
        </div>

        {/* Chart 3: Premium Subscription Revenue by Provider (USD Only) */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "18px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CreditCard size={17} style={{ color: "var(--status-success)" }} />
              <span style={{ fontWeight: 700, fontSize: "0.94rem", color: "var(--text-main)" }}>
                Premium Revenue by Payment Rail
              </span>
            </div>
            <Badge variant="success" size="sm">USD Only</Badge>
          </div>

          <svg viewBox="0 0 360 190" style={{ width: "100%", height: "190px", overflow: "visible" }}>
            {[0.25, 0.5, 0.75, 1].map((line) => (
              <line
                key={line}
                x1={10}
                x2={350}
                y1={155 - line * 125}
                y2={155 - line * 125}
                stroke="var(--border-light)"
                strokeDasharray="3 3"
              />
            ))}
            {providerRevenue.map((pv, i) => {
              const barH = Math.max(8, Math.round((pv.amount / maxProviderUsd) * 125));
              const x = 28 + i * 82;
              const y = 155 - barH;
              return (
                <g key={pv.key}>
                  <rect x={x} y={y} width={44} height={barH} rx={7} fill={pv.color} opacity={0.92} />
                  <text x={x + 22} y={y - 6} textAnchor="middle" fill="var(--text-main)" fontSize="10" fontWeight="700">
                    ${pv.amount.toFixed(0)}
                  </text>
                  <text x={x + 22} y={174} textAnchor="middle" fill="var(--text-muted)" fontSize="9.5" fontWeight="600">
                    {pv.label.split(" ")[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "6px", display: "flex", justifyContent: "space-between" }}>
            <span>Gross: {formatMoney(kpis.grossPremiumRevenueUsd)}</span>
            <span>Net After Refunds: {formatMoney(kpis.netPremiumRevenueUsd)}</span>
          </div>
        </div>
      </div>

      {/* Purchase Summary Comparison Table (Gift Coins IAP Dollars kept labeled separately) */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "16px 18px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "12px",
        }}
      >
        <div style={{ padding: "12px", borderRadius: "12px", background: "var(--bg-surface-elevated)" }}>
          <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>IAP Coin Purchase Gross (Separate from Premium)</div>
          <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--accent-champagne)", marginTop: "3px" }}>
            {formatMoney(kpis.totalGiftCoinPurchaseVolumeUsd)} ({formatCoins(kpis.totalCoinsPurchased)})
          </div>
        </div>
        <div style={{ padding: "12px", borderRadius: "12px", background: "var(--bg-surface-elevated)" }}>
          <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Subscription Billing Gross (Separate from Coins)</div>
          <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--status-success)", marginTop: "3px" }}>
            {formatMoney(kpis.grossPremiumRevenueUsd)} ({kpis.premiumPaymentSuccessRate}% Paid)
          </div>
        </div>
        <div style={{ padding: "12px", borderRadius: "12px", background: "var(--bg-surface-elevated)" }}>
          <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Reward Program Cost Model (Non-Cash Points)</div>
          <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--accent-lavender)", marginTop: "3px" }}>
            {formatPoints(kpis.totalPointsIssued)} Issued / {formatPoints(kpis.totalPointsRedeemed)} Used
          </div>
        </div>
      </div>
    </div>
  );
};

