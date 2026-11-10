import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Coins,
  Award,
  CreditCard,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type {
  FinancialAlertItem,
  UnifiedFinancialTransaction,
  WalletOverviewKpis,
  WalletTabKey,
  GiftCoinPurchaseRecord,
  ConnectionPointsRedemptionRecord,
} from "../../types/walletManagement.types";
import { Badge } from "../common/Badge";
import {
  formatCoins,
  formatDateTime,
  formatMoney,
  formatPoints,
  formatTxValue,
  getCategoryMeta,
  getTxStatusMeta,
} from "./walletUiUtils";
import { NOBLEBOND_POINTS_PERKS } from "../../data/walletManagementDataService";

interface WalletOverviewSectionProps {
  kpis: WalletOverviewKpis;
  recentTransactions: UnifiedFinancialTransaction[];
  giftPurchases: GiftCoinPurchaseRecord[];
  pointsRedemptions: ConnectionPointsRedemptionRecord[];
  alerts: FinancialAlertItem[];
  onNavigateTab: (tab: WalletTabKey) => void;
  onInspectTransaction: (tx: UnifiedFinancialTransaction) => void;
}

export const WalletOverviewSection: React.FC<WalletOverviewSectionProps> = ({
  kpis,
  recentTransactions,
  giftPurchases,
  pointsRedemptions,
  alerts,
  onNavigateTab,
  onInspectTransaction,
}) => {
  const navigate = useNavigate();

  // Compute Perk breakdown dynamically for Panel B
  const perkStats = NOBLEBOND_POINTS_PERKS.map((perk) => {
    const matches = pointsRedemptions.filter((r) => r.perkId === perk.id && r.status === "completed");
    return {
      ...perk,
      count: matches.length,
      pointsUsed: matches.reduce((s, r) => s + r.pointsSpent, 0),
    };
  });

  // Panel A miniature SVG comparison metrics (Normalized ratio strictly within Gift Coins domain!)
  const coinMetrics = [
    { label: "Purchased", val: kpis.totalCoinsPurchased, color: "var(--accent-champagne)" },
    { label: "Circulating", val: kpis.totalCoinsCirculating, color: "var(--primary)" },
    { label: "Live Spent", val: kpis.totalCoinsSpent, color: "var(--status-info)" },
    { label: "Host Gifts", val: kpis.totalCoinsReceivedByHosts, color: "var(--status-success)" },
  ];
  const maxCoinMetric = Math.max(1, ...coinMetrics.map((m) => m.val));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {/* Top 3 Dedicated Domain Panels (A, B, C) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
          gap: "16px",
        }}
      >
        {/* Panel A: Gift Coins Activity */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "18px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "14px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "9px",
                    background: "var(--accent-champagne-bg)",
                    color: "var(--accent-champagne)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Coins size={17} />
                </div>
                <div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-main)" }}>
                    Panel A — Gift Coins Activity
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Live gifting economy & purchase volume
                  </div>
                </div>
              </div>
              <Badge variant="champagne" size="sm">Coins</Badge>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
              {coinMetrics.map((m) => {
                const pct = Math.max(6, Math.round((m.val / maxCoinMetric) * 100));
                return (
                  <div key={m.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem", marginBottom: "4px" }}>
                      <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{m.label}</span>
                      <span style={{ color: "var(--text-main)", fontWeight: 700 }}>{formatCoins(m.val)}</span>
                    </div>
                    <div style={{ height: "7px", background: "var(--bg-surface-elevated)", borderRadius: "999px", overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: m.color, borderRadius: "999px", transition: "width 0.4s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                marginTop: "12px",
                padding: "10px 12px",
                borderRadius: "10px",
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
                fontSize: "0.76rem",
                color: "var(--text-secondary)",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Total Coin Purchases Recorded:</span>
              <strong style={{ color: "var(--text-main)" }}>{giftPurchases.length} orders</strong>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab("gift_coins")}
            style={{
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-main)",
              borderRadius: "10px",
              padding: "9px 12px",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <span>Open Gift Coins Ledger</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Panel B: Connection Points Activity */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "18px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "14px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "9px",
                    background: "var(--accent-lavender-bg)",
                    color: "var(--accent-lavender)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Award size={17} />
                </div>
                <div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-main)" }}>
                    Panel B — Connection Points Activity
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    OTP referral rewards & perk redemptions
                  </div>
                </div>
              </div>
              <Badge variant="info" size="sm">Points</Badge>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <div style={{ padding: "10px", borderRadius: "10px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)" }}>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Issued (All Sources)</div>
                <div style={{ fontSize: "1.02rem", fontWeight: 800, color: "var(--accent-lavender)", marginTop: "2px" }}>
                  {formatPoints(kpis.totalPointsIssued)}
                </div>
              </div>
              <div style={{ padding: "10px", borderRadius: "10px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)" }}>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Redeemed on Perks</div>
                <div style={{ fontSize: "1.02rem", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>
                  {formatPoints(kpis.totalPointsRedeemed)}
                </div>
              </div>
            </div>

            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>
              Official NobleBond Perks Breakdown
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {perkStats.map((perk) => (
                <div
                  key={perk.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.77rem",
                    padding: "6px 10px",
                    borderRadius: "8px",
                    background: "var(--bg-surface-elevated)",
                  }}
                >
                  <span style={{ color: "var(--text-main)", fontWeight: 600 }}>
                    {perk.title} <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>({perk.pointsCost} Pts)</span>
                  </span>
                  <span style={{ color: "var(--accent-lavender)", fontWeight: 700 }}>
                    {perk.count}x ({perk.pointsUsed} Pts)
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab("connection_points")}
            style={{
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-main)",
              borderRadius: "10px",
              padding: "9px 12px",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <span>Open Connection Points Ledger</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Panel C: Premium Financial Activity */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "18px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "14px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "9px",
                    background: "var(--status-success-bg)",
                    color: "var(--status-success)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CreditCard size={17} />
                </div>
                <div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-main)" }}>
                    Panel C — Premium Financial Activity
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Synced with Subscription Management
                  </div>
                </div>
              </div>
              <Badge variant="success" size="sm">USD</Badge>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 12px", borderRadius: "10px", background: "var(--bg-surface-elevated)" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>Gross Collected Revenue</span>
                <strong style={{ fontSize: "0.86rem", color: "var(--status-success)" }}>{formatMoney(kpis.grossPremiumRevenueUsd)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 12px", borderRadius: "10px", background: "var(--bg-surface-elevated)" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>Refunds Deducted</span>
                <strong style={{ fontSize: "0.86rem", color: "var(--status-error)" }}>-{formatMoney(kpis.refundedPremiumUsd)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 12px", borderRadius: "10px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border)" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-main)" }}>Net Subscription Revenue</span>
                <strong style={{ fontSize: "0.94rem", color: "var(--text-main)" }}>{formatMoney(kpis.netPremiumRevenueUsd)}</strong>
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                <div style={{ flex: 1, padding: "8px 10px", borderRadius: "9px", background: "var(--status-success-bg)", color: "var(--status-success)", fontSize: "0.75rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "5px" }}>
                  <CheckCircle2 size={14} />
                  {kpis.successfulPremiumPaymentsCount} Paid
                </div>
                <div style={{ flex: 1, padding: "8px 10px", borderRadius: "9px", background: "var(--status-error-bg)", color: "var(--status-error)", fontSize: "0.75rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "5px" }}>
                  <XCircle size={14} />
                  {kpis.failedPremiumPaymentsCount} Failed
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={() => onNavigateTab("premium_transactions")}
              style={{
                flex: 1,
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-main)",
                borderRadius: "10px",
                padding: "9px 10px",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
              }}
            >
              <span>Premium Ledger</span>
              <ArrowRight size={13} />
            </button>
            <button
              type="button"
              onClick={() => navigate("/subscriptions")}
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
                borderRadius: "10px",
                padding: "9px 11px",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
              title="Open Subscription Management Module"
            >
              <span>Plans</span>
              <ExternalLink size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom 2 Panels: D (Recent Transactions) + E (Financial Alerts) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "16px",
        }}
      >
        {/* Panel D: Recent Multi-Category Financial Transactions */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "18px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-main)" }}>
                Panel D — Recent Multi-Category Transactions
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Strictly typed USD, Gift Coins, and Connection Points ledger entries
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab("all_transactions")}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--primary)",
                fontSize: "0.79rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {recentTransactions.slice(0, 7).map((tx) => {
              const catMeta = getCategoryMeta(tx.category);
              const valMeta = formatTxValue(tx);
              const statusMeta = getTxStatusMeta(tx.status);
              return (
                <button
                  key={tx.id}
                  type="button"
                  onClick={() => onInspectTransaction(tx)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: "var(--bg-surface-elevated)",
                    border: "1px solid var(--border-light)",
                    borderRadius: "11px",
                    padding: "10px 12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                    transition: "border-color 0.16s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-light)")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                    <img
                      src={tx.userAvatar}
                      alt={tx.userName}
                      style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {tx.title}
                      </div>
                      <div style={{ fontSize: "0.73rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                        <span>{tx.userName}</span>
                        <span>•</span>
                        <Badge variant={catMeta.variant} size="sm">{catMeta.shortLabel}</Badge>
                        <span>•</span>
                        <span>{formatDateTime(tx.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: "0.84rem", fontWeight: 800, color: valMeta.toneColor }}>
                      {valMeta.primaryText}
                    </div>
                    <div style={{ marginTop: "3px" }}>
                      <Badge variant={statusMeta.variant} size="sm">{statusMeta.label}</Badge>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel E: Financial Activity Alerts */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "18px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-main)" }}>
                Panel E — Financial Monitoring Alerts
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Real-time risk, fraud checks, failed renewals & eligible queues
              </div>
            </div>
            <Badge variant={alerts.length > 0 ? "warning" : "success"} size="sm">
              {alerts.length} Active
            </Badge>
          </div>

          {alerts.length === 0 ? (
            <div style={{ padding: "30px 12px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
              No active financial alerts or reconciliation discrepancies.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
              {alerts.map((alert) => {
                const catMeta = getCategoryMeta(alert.category);
                const borderColor =
                  alert.severity === "error"
                    ? "rgba(239, 68, 68, 0.35)"
                    : alert.severity === "warning"
                    ? "rgba(245, 158, 11, 0.35)"
                    : "rgba(59, 130, 246, 0.35)";
                const iconColor =
                  alert.severity === "error"
                    ? "var(--status-error)"
                    : alert.severity === "warning"
                    ? "var(--status-warning)"
                    : "var(--status-info)";
                return (
                  <button
                    key={alert.id}
                    type="button"
                    onClick={() => onNavigateTab(alert.targetTab)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      background: "var(--bg-surface-elevated)",
                      border: `1px solid ${borderColor}`,
                      borderRadius: "11px",
                      padding: "11px 13px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      transition: "transform 0.16s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateX(2px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateX(0)")}
                  >
                    <AlertCircle size={17} style={{ color: iconColor, flexShrink: 0, marginTop: "2px" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)" }}>
                          {alert.title}
                        </span>
                        <Badge variant={catMeta.variant} size="sm">{catMeta.shortLabel}</Badge>
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "var(--text-secondary)", marginTop: "3px", lineHeight: 1.4 }}>
                        {alert.description}
                      </div>
                      <div style={{ fontSize: "0.71rem", color: "var(--text-muted)", marginTop: "4px", display: "flex", justifyContent: "space-between" }}>
                        <span>Ref: {alert.relatedRef}</span>
                        <span style={{ color: "var(--primary)", fontWeight: 600 }}>Investigate</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

