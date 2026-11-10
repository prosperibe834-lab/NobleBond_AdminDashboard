import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Coins,
  Gift,
  ShoppingBag,
  ExternalLink,
  Search,
  Info,
  Radio,
} from "lucide-react";
import type {
  GiftCoinPurchaseRecord,
  UnifiedFinancialTransaction,
  WalletOverviewKpis,
} from "../../types/walletManagement.types";
import type { LiveGiftTransactionRecord } from "../../types/liveManagement.types";
import { Badge } from "../common/Badge";
import {
  formatCoins,
  formatDateTime,
  formatMoney,
  formatPaymentProviderLabel,
  getTxStatusMeta,
} from "./walletUiUtils";
import { NOBLEBOND_GIFT_COIN_PACKAGES } from "../../data/walletManagementDataService";

interface GiftCoinsManagementSectionProps {
  kpis: WalletOverviewKpis;
  purchases: GiftCoinPurchaseRecord[];
  liveGifts: LiveGiftTransactionRecord[];
  onInspectTransaction: (tx: UnifiedFinancialTransaction) => void;
  onInspectUserWallet: (userId: string) => void;
}

export const GiftCoinsManagementSection: React.FC<GiftCoinsManagementSectionProps> = ({
  kpis,
  purchases,
  liveGifts,
  onInspectTransaction,
  onInspectUserWallet,
}) => {
  const navigate = useNavigate();
  const [subView, setSubView] = useState<"purchases" | "live_gifts" | "packages">("purchases");
  const [purchaseStatus, setPurchaseStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPurchases = purchases.filter((p) => {
    const matchStatus = purchaseStatus === "all" || p.status === purchaseStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      p.id.toLowerCase().includes(q) ||
      p.userName.toLowerCase().includes(q) ||
      p.username.toLowerCase().includes(q) ||
      p.packageName.toLowerCase().includes(q) ||
      p.paymentReference.toLowerCase().includes(q);
    return matchStatus && matchQuery;
  });

  const filteredGifts = liveGifts.filter((g) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      g.id.toLowerCase().includes(q) ||
      g.giftName.toLowerCase().includes(q) ||
      g.sender.name.toLowerCase().includes(q) ||
      g.recipient.name.toLowerCase().includes(q) ||
      g.sessionTitle.toLowerCase().includes(q)
    );
  });

  const toPurchaseTx = (p: GiftCoinPurchaseRecord): UnifiedFinancialTransaction => ({
    id: p.id,
    category: "gift_coins",
    transactionType: "gift_coin_purchase",
    title: `Coin Package: ${p.packageName} (${p.totalCoins} Coins)`,
    userId: p.userId,
    userName: p.userName,
    username: p.username,
    userAvatar: p.userAvatar,
    isMonetary: true,
    fiatAmount: p.purchaseAmount,
    fiatCurrency: p.currency,
    fiatSymbol: p.currencySymbol,
    virtualQuantity: p.totalCoins,
    virtualUnit: "COINS",
    direction: "credit",
    previousBalance: p.previousCoinBalance,
    newBalance: p.newCoinBalance,
    referenceId: p.paymentReference,
    relatedServiceLabel: "Mobile IAP Gift Coin Purchase",
    paymentProviderLabel: p.paymentProvider,
    maskedPaymentMethod: p.maskedPaymentMethod,
    timestamp: p.timestamp,
    status: p.status,
    notes: p.failureReason || `${p.baseCoins} base + ${p.bonusCoins} bonus Coins`,
  });

  const toGiftTx = (g: LiveGiftTransactionRecord): UnifiedFinancialTransaction => ({
    id: g.id,
    category: "gift_coins",
    transactionType: "gift_sent",
    title: `Live Gift: ${g.giftName} (${g.coinAmount} Coins)`,
    userId: g.sender.id,
    userName: `${g.sender.name} -> ${g.recipient.name}`,
    username: g.sender.username,
    userAvatar: g.sender.avatar,
    isMonetary: false,
    virtualQuantity: g.coinAmount,
    virtualUnit: "COINS",
    direction: "debit",
    referenceId: g.walletReference,
    relatedServiceLabel: `Live Stream: ${g.sessionTitle}`,
    relatedEntityId: g.sessionId,
    timestamp: g.timestamp,
    status: g.status,
    notes: `Viewer ${g.sender.name} sent ${g.giftName} to host ${g.recipient.name}`,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {/* Circulation Accounting Strip */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "16px 18px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background: "var(--accent-champagne-bg)",
                color: "var(--accent-champagne)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Coins size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>
                Gift Coins Economy & Circulation Ledger
              </h3>
              <div style={{ fontSize: "0.77rem", color: "var(--text-muted)" }}>
                Official App Store / Play Store Coin purchases & live gifting supply (non-withdrawable)
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/live")}
            style={{
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-main)",
              borderRadius: "10px",
              padding: "8px 13px",
              fontSize: "0.79rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Radio size={14} style={{ color: "var(--status-error)" }} />
            <span>Open Live Management</span>
            <ExternalLink size={13} />
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(185px, 1fr))",
            gap: "10px",
          }}
        >
          <div style={{ padding: "12px", borderRadius: "12px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)" }}>
            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Total Purchased Coins</div>
            <div style={{ fontSize: "1.12rem", fontWeight: 800, color: "var(--accent-champagne)", marginTop: "3px" }}>
              {formatCoins(kpis.totalCoinsPurchased)}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "2px" }}>
              IAP Gross: {formatMoney(kpis.totalGiftCoinPurchaseVolumeUsd)}
            </div>
          </div>
          <div style={{ padding: "12px", borderRadius: "12px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)" }}>
            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Current Circulating Supply</div>
            <div style={{ fontSize: "1.12rem", fontWeight: 800, color: "var(--text-main)", marginTop: "3px" }}>
              {formatCoins(kpis.totalCoinsCirculating)}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "2px" }}>
              Held in active member wallets
            </div>
          </div>
          <div style={{ padding: "12px", borderRadius: "12px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)" }}>
            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Spent in Live Streams</div>
            <div style={{ fontSize: "1.12rem", fontWeight: 800, color: "var(--status-info)", marginTop: "3px" }}>
              {formatCoins(kpis.totalCoinsSpent)}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "2px" }}>
              Across {liveGifts.length} tracked gifts
            </div>
          </div>
          <div style={{ padding: "12px", borderRadius: "12px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)" }}>
            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Host Non-Cash Receipts</div>
            <div style={{ fontSize: "1.12rem", fontWeight: 800, color: "var(--status-success)", marginTop: "3px" }}>
              {formatCoins(kpis.totalCoinsReceivedByHosts)}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "2px" }}>
              Non-cash reception metric only
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "12px",
            padding: "9px 12px",
            borderRadius: "10px",
            background: "var(--status-info-bg)",
            color: "var(--text-secondary)",
            fontSize: "0.76rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Info size={15} style={{ color: "var(--status-info)", flexShrink: 0 }} />
          <span>
            Accounting Integrity Rule: Host gift receipts represent in-app creator engagement and are tracked separately from circulating Coins so supply is never double-counted or redeemable for cash.
          </span>
        </div>
      </div>

      {/* Sub-navigation & Filters */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "16px 18px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <button
              type="button"
              onClick={() => setSubView("purchases")}
              style={{
                padding: "8px 14px",
                borderRadius: "10px",
                border: subView === "purchases" ? "1px solid var(--primary)" : "1px solid var(--border)",
                background: subView === "purchases" ? "var(--primary-glow)" : "var(--bg-surface-elevated)",
                color: subView === "purchases" ? "var(--primary)" : "var(--text-secondary)",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <ShoppingBag size={14} />
              <span>Coin Purchase Orders ({purchases.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setSubView("live_gifts")}
              style={{
                padding: "8px 14px",
                borderRadius: "10px",
                border: subView === "live_gifts" ? "1px solid var(--primary)" : "1px solid var(--border)",
                background: subView === "live_gifts" ? "var(--primary-glow)" : "var(--bg-surface-elevated)",
                color: subView === "live_gifts" ? "var(--primary)" : "var(--text-secondary)",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Gift size={14} />
              <span>Live Gifts Sent & Received ({liveGifts.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setSubView("packages")}
              style={{
                padding: "8px 14px",
                borderRadius: "10px",
                border: subView === "packages" ? "1px solid var(--primary)" : "1px solid var(--border)",
                background: subView === "packages" ? "var(--primary-glow)" : "var(--bg-surface-elevated)",
                color: subView === "packages" ? "var(--primary)" : "var(--text-secondary)",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Coins size={14} />
              <span>Official Coin Packages ({NOBLEBOND_GIFT_COIN_PACKAGES.length})</span>
            </button>
          </div>

          {subView !== "packages" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
              <div style={{ position: "relative" }}>
                <Search
                  size={14}
                  style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search order, user, ref..."
                  style={{
                    background: "var(--bg-surface-elevated)",
                    border: "1px solid var(--border)",
                    color: "var(--text-main)",
                    borderRadius: "9px",
                    padding: "7px 10px 7px 31px",
                    fontSize: "0.8rem",
                    width: "210px",
                  }}
                />
              </div>
              {subView === "purchases" && (
                <select
                  value={purchaseStatus}
                  onChange={(e) => setPurchaseStatus(e.target.value)}
                  style={{
                    background: "var(--bg-surface-elevated)",
                    border: "1px solid var(--border)",
                    color: "var(--text-main)",
                    borderRadius: "9px",
                    padding: "7px 10px",
                    fontSize: "0.8rem",
                  }}
                >
                  <option value="all">All Purchase Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              )}
            </div>
          )}
        </div>

        {/* SubView 1: Coin Purchase Orders Table */}
        {subView === "purchases" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)", textAlign: "left" }}>
                  <th style={{ padding: "10px 8px" }}>Order ID</th>
                  <th style={{ padding: "10px 8px" }}>Member</th>
                  <th style={{ padding: "10px 8px" }}>Package</th>
                  <th style={{ padding: "10px 8px" }}>Coins Credited</th>
                  <th style={{ padding: "10px 8px" }}>Fiat Paid (IAP)</th>
                  <th style={{ padding: "10px 8px" }}>Provider</th>
                  <th style={{ padding: "10px 8px" }}>Timestamp</th>
                  <th style={{ padding: "10px 8px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.map((p) => {
                  const st = getTxStatusMeta(p.status);
                  return (
                    <tr
                      key={p.id}
                      onClick={() => onInspectTransaction(toPurchaseTx(p))}
                      style={{
                        borderBottom: "1px solid var(--border-light)",
                        cursor: "pointer",
                      }}
                    >
                      <td style={{ padding: "11px 8px", fontWeight: 700, color: "var(--primary)" }}>{p.id}</td>
                      <td style={{ padding: "11px 8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <img src={p.userAvatar} alt={p.userName} style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }} />
                          <div>
                            <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{p.userName}</div>
                            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>@{p.username}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "11px 8px" }}>
                        <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{p.packageName}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                          {p.baseCoins} base + {p.bonusCoins} bonus
                        </div>
                      </td>
                      <td style={{ padding: "11px 8px", fontWeight: 800, color: "var(--accent-champagne)" }}>
                        +{formatCoins(p.totalCoins)}
                      </td>
                      <td style={{ padding: "11px 8px", fontWeight: 700, color: "var(--text-main)" }}>
                        {formatMoney(p.purchaseAmount, p.currencySymbol)} {p.currency}
                      </td>
                      <td style={{ padding: "11px 8px" }}>
                        <div style={{ color: "var(--text-main)" }}>{formatPaymentProviderLabel(p.paymentProvider)}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{p.maskedPaymentMethod}</div>
                      </td>
                      <td style={{ padding: "11px 8px", color: "var(--text-secondary)" }}>{formatDateTime(p.timestamp)}</td>
                      <td style={{ padding: "11px 8px" }}>
                        <Badge variant={st.variant} size="sm">{st.label}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* SubView 2: Live Gifts Sent & Received Table */}
        {subView === "live_gifts" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)", textAlign: "left" }}>
                  <th style={{ padding: "10px 8px" }}>Gift Ref</th>
                  <th style={{ padding: "10px 8px" }}>Sender (Coins Spent)</th>
                  <th style={{ padding: "10px 8px" }}>Host (Non-Cash Receipt)</th>
                  <th style={{ padding: "10px 8px" }}>Gift Item</th>
                  <th style={{ padding: "10px 8px" }}>Coin Amount</th>
                  <th style={{ padding: "10px 8px" }}>Live Session</th>
                  <th style={{ padding: "10px 8px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredGifts.map((g) => {
                  const st = getTxStatusMeta(g.status);
                  return (
                    <tr
                      key={g.id}
                      onClick={() => onInspectTransaction(toGiftTx(g))}
                      style={{ borderBottom: "1px solid var(--border-light)", cursor: "pointer" }}
                    >
                      <td style={{ padding: "11px 8px", fontWeight: 700, color: "var(--primary)" }}>{g.walletReference}</td>
                      <td style={{ padding: "11px 8px" }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onInspectUserWallet(g.sender.id);
                          }}
                          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", textAlign: "left" }}
                        >
                          <img src={g.sender.avatar} alt={g.sender.name} style={{ width: "26px", height: "26px", borderRadius: "50%", objectFit: "cover" }} />
                          <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{g.sender.name}</span>
                        </button>
                      </td>
                      <td style={{ padding: "11px 8px" }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onInspectUserWallet(g.recipient.id);
                          }}
                          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", textAlign: "left" }}
                        >
                          <img src={g.recipient.avatar} alt={g.recipient.name} style={{ width: "26px", height: "26px", borderRadius: "50%", objectFit: "cover" }} />
                          <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{g.recipient.name}</span>
                        </button>
                      </td>
                      <td style={{ padding: "11px 8px", fontWeight: 600, color: "var(--text-main)" }}>{g.giftName}</td>
                      <td style={{ padding: "11px 8px", fontWeight: 800, color: "var(--accent-champagne)" }}>{formatCoins(g.coinAmount)}</td>
                      <td style={{ padding: "11px 8px", color: "var(--text-secondary)" }}>
                        <div>{g.sessionTitle}</div>
                        <div style={{ fontSize: "0.71rem", color: "var(--text-muted)" }}>{formatDateTime(g.timestamp)}</div>
                      </td>
                      <td style={{ padding: "11px 8px" }}>
                        <Badge variant={st.variant} size="sm">{st.label}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* SubView 3: Official NobleBond Packages Catalog */}
        {subView === "packages" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: "12px",
            }}
          >
            {NOBLEBOND_GIFT_COIN_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                style={{
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  padding: "14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "0.92rem" }}>{pkg.name}</span>
                  {pkg.badge && <Badge variant="champagne" size="sm">{pkg.badge}</Badge>}
                </div>
                <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--accent-champagne)", marginTop: "4px" }}>
                  {(pkg.coins + pkg.bonusCoins).toLocaleString()} Coins
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {pkg.coins.toLocaleString()} Base + {pkg.bonusCoins.toLocaleString()} Bonus Coins
                </div>
                <div
                  style={{
                    marginTop: "8px",
                    paddingTop: "8px",
                    borderTop: "1px solid var(--border-light)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.84rem",
                    fontWeight: 700,
                    color: "var(--text-main)",
                  }}
                >
                  <span>IAP Retail Price</span>
                  <span>{formatMoney(pkg.price)} {pkg.currency}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

