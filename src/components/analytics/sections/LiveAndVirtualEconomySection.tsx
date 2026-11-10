import React from "react";
import { Radio, Coins, Award, Tv, Gift, Lock, Sparkles } from "lucide-react";
import type { PlatformAnalyticsSnapshot } from "../../../data/platformAnalyticsDataService";
import type {
  AnalyticsRolePermissions,
  DrilldownPayload,
} from "../../../types/analyticsManagement.types";
import {
  formatCoinsQty,
  formatMoneyUsd,
  formatPercent,
  formatPointsQty,
} from "../analyticsUiUtils";

interface LiveAndVirtualEconomySectionProps {
  snapshot: PlatformAnalyticsSnapshot;
  permissions: AnalyticsRolePermissions;
  mode: "live_streaming_analytics" | "gift_coins_analytics" | "connection_points_analytics";
  onDrilldown: (payload: DrilldownPayload) => void;
}

const cardStyle: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: 16,
  padding: 18,
  boxShadow: "var(--shadow-sm)",
};

export const LiveAndVirtualEconomySection: React.FC<LiveAndVirtualEconomySectionProps> = ({
  snapshot,
  permissions,
  mode,
  onDrilldown,
}) => {
  if (mode === "live_streaming_analytics") {
    const sessions = snapshot.liveSessions;
    const totalPeakViewers = sessions.reduce((s, ls) => s + ls.peakViewers, 0);
    const totalUniqueViews = sessions.reduce((s, ls) => s + ls.totalUniqueViews, 0);
    const avgDuration =
      sessions.length > 0
        ? Math.round(sessions.reduce((s, ls) => s + ls.durationMinutes, 0) / sessions.length)
        : 0;
    const categoryTotals = Array.from(
      sessions.reduce((map, ls) => {
        const prev = map.get(ls.category) || { count: 0, views: 0, coins: 0 };
        map.set(ls.category, {
          count: prev.count + 1,
          views: prev.views + ls.totalUniqueViews,
          coins: prev.coins + ls.giftCoinsEarned,
        });
        return map;
      }, new Map<string, { count: number; views: number; coins: number }>())
    );

    const healthyStreams = snapshot.streamHealth.filter((s) => s.status === "healthy").length;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Radio size={18} style={{ color: "var(--accent-champagne)" }} />
            <h2 style={{ margin: 0, fontSize: 17, color: "var(--text-main)" }}>
              Section 7: Live Streaming & Host Operations Analytics
            </h2>
          </div>
          <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--text-secondary)" }}>
            Tracks solo & multi-guest stream volume, audience engagement, Agora/LiveKit streaming
            health, and virtual Gift Coins earned.
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
              {
                label: "Sessions Hosted (Window)",
                val: sessions.length,
                sub: `${snapshot.liveCurrentlyActive.length} live right now`,
              },
              {
                label: "Total Unique Views",
                val: totalUniqueViews.toLocaleString(),
                sub: `Sum peak concurrent: ${totalPeakViewers}`,
              },
              {
                label: "Hosts & Guests",
                val: `${snapshot.liveHosts.length} / ${snapshot.liveGuests.length}`,
                sub: "Registered hosts / co-host seats",
              },
              {
                label: "Mean Stream Duration",
                val: `${avgDuration} min`,
                sub: `${snapshot.liveReportsCurrent.length} stream safety reports`,
              },
              {
                label: "Healthy Stream Channels",
                val: `${healthyStreams} / ${snapshot.streamHealth.length}`,
                sub: "Real-time provider telemetry",
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
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 16,
            }}
          >
            {/* Category Performance */}
            <div
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
                borderRadius: 14,
                padding: 14,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                <Tv size={15} style={{ color: "var(--primary)" }} />
                <h4 style={{ margin: 0, fontSize: 14, color: "var(--text-main)" }}>
                  Sessions by Stream Category
                </h4>
              </div>
              {categoryTotals.length === 0 ? (
                <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>
                  No sessions matched current window/category filter.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {categoryTotals.map(([cat, stats]) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() =>
                        onDrilldown({
                          title: `Live Category: ${cat}`,
                          subtitle: "Session volume, viewership, and virtual gift activity",
                          sourceModuleLabel: "Live Management",
                          targetRoute: "/live",
                          rows: [
                            { label: "Sessions Hosted", value: `${stats.count}` },
                            { label: "Unique Views", value: stats.views.toLocaleString() },
                            {
                              label: "Virtual Gift Coins Earned",
                              value: formatCoinsQty(stats.coins),
                              hint: "Virtual ledger only",
                            },
                          ],
                          methodologyNote:
                            "Aggregated across sessions filtered by the active date window and global filters.",
                        })
                      }
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "9px 11px",
                        borderRadius: 10,
                        border: "1px solid var(--border-light)",
                        background: "var(--bg-card)",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)" }}>
                          {cat}
                        </div>
                        <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                          {stats.count} sessions • {stats.views} views
                        </div>
                      </div>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--primary)" }}>
                        {formatCoinsQty(stats.coins)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Stream QoS / Provider Diagnostics */}
            <div
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
                borderRadius: 14,
                padding: 14,
              }}
            >
              <h4 style={{ margin: "0 0 10px", fontSize: 14, color: "var(--text-main)" }}>
                Streaming Infrastructure Diagnostics
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {snapshot.streamHealth.slice(0, 5).map((sh) => (
                  <div
                    key={sh.sessionId}
                    style={{
                      padding: "9px 11px",
                      borderRadius: 10,
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-light)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-main)" }}>
                        {sh.sessionTitle}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        {sh.provider.toUpperCase()} • {sh.bitrateKbps} kbps • {sh.fps} fps •{" "}
                        {sh.latencyMs}ms latency
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "3px 8px",
                        borderRadius: 999,
                        color:
                          sh.status === "healthy"
                            ? "var(--status-success)"
                            : sh.status === "degraded"
                              ? "var(--status-warning)"
                              : "var(--status-error)",
                        background:
                          sh.status === "healthy"
                            ? "var(--status-success-bg)"
                            : sh.status === "degraded"
                              ? "var(--status-warning-bg)"
                              : "var(--status-error-bg)",
                      }}
                    >
                      {sh.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "gift_coins_analytics") {
    const purchases = snapshot.coinPurchasesCurrent.filter((p) => p.status === "completed");
    const providerSplit = ["apple_app_store", "google_play_store", "stripe_web"].map((prov) => {
      const subset = purchases.filter((p) => p.paymentProvider === prov);
      return {
        provider: prov.replace(/_/g, " "),
        txCount: subset.length,
        usd: subset.reduce((s, p) => s + p.purchaseAmount, 0),
        coins: subset.reduce((s, p) => s + p.totalCoins, 0),
      };
    });

    const giftCatBreakdown = ["romantic", "luxury", "celebration", "support"].map((cat) => {
      const subset = snapshot.liveGiftsCurrent.filter(
        (g) => g.giftType === cat && g.status === "completed"
      );
      return {
        cat,
        count: subset.length,
        coins: subset.reduce((s, g) => s + g.coinAmount, 0),
      };
    });

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Coins size={18} style={{ color: "var(--accent-champagne)" }} />
            <h2 style={{ margin: 0, fontSize: 17, color: "var(--text-main)" }}>
              Section 8: Gift Coins Economy & Virtual Gifting Analytics
            </h2>
          </div>
          <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--text-secondary)" }}>
            Strict ledger accounting: Fiat IAP Pack purchases (USD) are tracked separately from
            virtual Gift Coins in wallet circulation and live gift transfers. Host gift receipts
            never count as additional fiat revenue.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
                borderRadius: 12,
                padding: 13,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
                Gift Coin IAP Sales (USD)
              </div>
              {permissions.canViewRevenueAnalytics ? (
                <>
                  <div style={{ fontSize: 23, fontWeight: 800, color: "var(--text-main)", margin: "4px 0" }}>
                    {formatMoneyUsd(snapshot.coinPurchaseVolumeUsd)}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {purchases.length} completed pack orders
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, color: "var(--text-muted)", fontSize: 12 }}>
                  <Lock size={13} /> Revenue masked by role
                </div>
              )}
            </div>

            <div
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
                borderRadius: 12,
                padding: 13,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
                Virtual Coins Purchased
              </div>
              <div style={{ fontSize: 23, fontWeight: 800, color: "var(--text-main)", margin: "4px 0" }}>
                {formatCoinsQty(snapshot.totalCoinsPurchased)}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Includes bonus coins granted</div>
            </div>

            <div
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
                borderRadius: 12,
                padding: 13,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
                Virtual Coins Sent in Live
              </div>
              <div style={{ fontSize: 23, fontWeight: 800, color: "var(--primary)", margin: "4px 0" }}>
                {formatCoinsQty(snapshot.totalCoinsSpentOnGifts)}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                {snapshot.liveGiftsCurrent.length} gift events in window
              </div>
            </div>

            <div
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
                borderRadius: 12,
                padding: 13,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
                Circulating Wallet Balance
              </div>
              <div style={{ fontSize: 23, fontWeight: 800, color: "var(--text-main)", margin: "4px 0" }}>
                {formatCoinsQty(snapshot.totalCoinsCirculating)}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                Across {snapshot.users.length} member wallets
              </div>
            </div>
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
                IAP Provider Channel Breakdown
              </h4>
              {providerSplit.map((row) => (
                <div
                  key={row.provider}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--border-light)",
                    fontSize: 12.5,
                  }}
                >
                  <span style={{ textTransform: "capitalize", fontWeight: 600, color: "var(--text-main)" }}>
                    {row.provider} ({row.txCount})
                  </span>
                  <span style={{ color: "var(--text-secondary)" }}>
                    {permissions.canViewRevenueAnalytics ? `${formatMoneyUsd(row.usd)} • ` : ""}
                    {formatCoinsQty(row.coins)}
                  </span>
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
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <Gift size={15} style={{ color: "var(--primary)" }} />
                <h4 style={{ margin: 0, fontSize: 14, color: "var(--text-main)" }}>
                  Virtual Gift Type Distribution
                </h4>
              </div>
              {giftCatBreakdown.map((g) => (
                <div
                  key={g.cat}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--border-light)",
                    fontSize: 12.5,
                  }}
                >
                  <span style={{ textTransform: "capitalize", fontWeight: 600, color: "var(--text-main)" }}>
                    {g.cat} Gifts ({g.count})
                  </span>
                  <span style={{ fontWeight: 700, color: "var(--primary)" }}>
                    {formatCoinsQty(g.coins)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // mode === "connection_points_analytics"
  const perksCatalog = [
    { id: "additional_likes", label: "Additional Likes Pack", costPts: 15 },
    { id: "super_likes", label: "Super Likes Bundle", costPts: 25 },
    { id: "discovery_boost", label: "Discovery Spotlight", costPts: 40 },
    { id: "profile_boost", label: "Profile Priority Boost", costPts: 50 },
  ];

  const redemptionRate =
    snapshot.cpIssuedPoints > 0
      ? (snapshot.cpRedeemedPoints / snapshot.cpIssuedPoints) * 100
      : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Award size={18} style={{ color: "var(--accent-lavender)" }} />
          <h2 style={{ margin: 0, fontSize: 17, color: "var(--text-main)" }}>
            Section 9: Connection Points & Non-Cash Rewards Analytics
          </h2>
        </div>
        <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--text-secondary)" }}>
          Connection Points are non-cash platform utility rewards only (zero fiat exchange or
          cashout value). Referrer receives configurable 50 Pts upon Email/Phone OTP qualification;
          referred user receives 0 bonus points.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(195px, 1fr))",
            gap: 12,
            marginBottom: 16,
          }}
        >
          {[
            {
              label: "Points Issued (Window)",
              val: formatPointsQty(snapshot.cpIssuedPoints),
              sub: `${snapshot.cpRewardsCurrent.filter((r) => r.issuanceStatus === "issued").length} cleared rewards`,
            },
            {
              label: "Points Redeemed",
              val: formatPointsQty(snapshot.cpRedeemedPoints),
              sub: `${snapshot.cpRedemptionsCurrent.length} perk redemptions`,
            },
            {
              label: "Redemption Utilization",
              val: formatPercent(redemptionRate),
              sub: "Redeemed / Issued points",
            },
            {
              label: "Circulating Points",
              val: formatPointsQty(snapshot.cpCirculatingPoints),
              sub: "Outstanding non-cash balance",
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

        <h4 style={{ margin: "0 0 10px", fontSize: 14, color: "var(--text-main)" }}>
          In-App Feature Perk Redemption Breakdown
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          {perksCatalog.map((perk) => {
            const matched = snapshot.cpRedemptionsCurrent.filter(
              (r) => r.perkId === perk.id && r.status === "completed"
            );
            const ptsSpent = matched.reduce((s, r) => s + r.pointsSpent, 0);
            return (
              <div
                key={perk.id}
                style={{
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  borderRadius: 12,
                  padding: 13,
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)" }}>
                    {perk.label}
                  </span>
                  <Sparkles size={14} style={{ color: "var(--accent-lavender)" }} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--accent-lavender)" }}>
                  {matched.length} redemptions
                </div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                  Standard cost: {perk.costPts} Pts • Total burned: {formatPointsQty(ptsSpent)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

