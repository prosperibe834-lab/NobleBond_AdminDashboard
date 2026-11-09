import React, { useState } from "react";
import { Coins, Sparkles, Crown } from "lucide-react";
import { Badge } from "../components/common/Badge";

export const WalletManagementPage: React.FC = () => {
  const [filterType, setFilterType] = useState<string>("all");

  const transactions = [
    {
      id: "tx_w_101",
      user: "Sarah James",
      currency: "Gift Coins",
      type: "Coin Purchase",
      amount: "+1,400 Coins",
      fiat: "$19.99 USD",
      method: "Apple Pay",
      status: "completed",
      date: "Nov 8, 2026 • 15:42",
    },
    {
      id: "tx_w_102",
      user: "Sarah James",
      currency: "Gift Coins",
      type: "Live Gift Sent",
      amount: "-200 Coins (Crown)",
      fiat: "To Emily Carter",
      method: "Live Broadcast #401",
      status: "completed",
      date: "Nov 8, 2026 • 16:15",
    },
    {
      id: "tx_w_103",
      user: "David King",
      currency: "Connection Points",
      type: "Referral Reward",
      amount: "+50 Pts",
      fiat: "Rule: Verified Friend",
      method: "Referral Code #DK99",
      status: "completed",
      date: "Nov 8, 2026 • 12:30",
    },
    {
      id: "tx_w_104",
      user: "Zara Love",
      currency: "Premium Subscription",
      type: "Annual Plan Renewal",
      amount: "VIP Crown Active",
      fiat: "$59.88 USD",
      method: "Credit Card (Visa)",
      status: "completed",
      date: "Nov 7, 2026 • 09:14",
    },
  ];

  const filtered = transactions.filter((t) => {
    if (filterType === "all") return true;
    if (filterType === "coins") return t.currency === "Gift Coins";
    if (filterType === "points") return t.currency === "Connection Points";
    if (filterType === "premium") return t.currency === "Premium Subscription";
    return true;
  });

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-main)" }}>
          Wallet & Financial Management
        </h2>
        <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
          Monitor Gift Coins circulation, Connection Points reward issuing, and subscription transactions.
        </p>
      </div>

      {/* THREE SEPARATE PRODUCT PANELS (STRICT DISTINCTION) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
        {/* 1. Gift Coins */}
        <div style={{ padding: "20px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", borderTop: "4px solid var(--accent-champagne)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent-champagne)", letterSpacing: "0.5px" }}>VIRTUAL LIVE CURRENCY</span>
            <Coins size={18} color="var(--accent-champagne)" />
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-main)", marginTop: "8px" }}>
            12,480,000 Coins
          </div>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Purchased via coin packages. Exclusively used for live-streaming gifts to broadcasters.
          </p>
          <div style={{ marginTop: "12px", fontSize: "13px", fontWeight: 600, color: "var(--status-success)" }}>
            $72,500 Gross Coin Sales this month
          </div>
        </div>

        {/* 2. Connection Points */}
        <div style={{ padding: "20px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", borderTop: "4px solid var(--status-success)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--status-success)", letterSpacing: "0.5px" }}>REWARDS & DATING PERKS</span>
            <Sparkles size={18} color="var(--status-success)" />
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-main)", marginTop: "8px" }}>
            ✨ 741,000 Points
          </div>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Earned from verified referrals (+50 Pts) and dating activities. Spent on Super Likes and Boosts.
          </p>
          <div style={{ marginTop: "12px", fontSize: "13px", fontWeight: 600, color: "var(--text-main)" }}>
            14,820 Referral Bonuses Distributed
          </div>
        </div>

        {/* 3. Premium Subscriptions */}
        <div style={{ padding: "20px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", borderTop: "4px solid var(--primary)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--primary)", letterSpacing: "0.5px" }}>MEMBERSHIP SUBSCRIPTIONS</span>
            <Crown size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-main)", marginTop: "8px" }}>
            52,840 Active Members
          </div>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Weekly, monthly, and annual subscription billing processed through App Store and Stripe.
          </p>
          <div style={{ marginTop: "12px", fontSize: "13px", fontWeight: 600, color: "var(--primary)" }}>
            $312,450 Monthly Recurring Revenue
          </div>
        </div>
      </div>

      {/* Transaction Ledger Table with Product Filter */}
      <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)" }}>
            Unified Financial Ledger
          </h3>

          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { id: "all", label: "All Products" },
              { id: "coins", label: "Gift Coins" },
              { id: "points", label: "Connection Points" },
              { id: "premium", label: "Premium Tiers" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "1px solid",
                  borderColor: filterType === tab.id ? "var(--primary)" : "var(--border)",
                  backgroundColor: filterType === tab.id ? "var(--bg-active)" : "var(--bg-surface)",
                  color: filterType === tab.id ? "var(--primary)" : "var(--text-secondary)",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: "12px" }}>
                <th style={{ padding: "10px 12px" }}>TRANSACTION ID</th>
                <th style={{ padding: "10px 12px" }}>USER</th>
                <th style={{ padding: "10px 12px" }}>PRODUCT</th>
                <th style={{ padding: "10px 12px" }}>AMOUNT / VALUE</th>
                <th style={{ padding: "10px 12px" }}>METHOD / DETAILS</th>
                <th style={{ padding: "10px 12px" }}>DATE</th>
                <th style={{ padding: "10px 12px" }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: "1px solid var(--border-light)", fontSize: "13px" }}>
                  <td style={{ padding: "12px", fontWeight: 600, color: "var(--text-muted)" }}>{tx.id}</td>
                  <td style={{ padding: "12px", fontWeight: 700, color: "var(--text-main)" }}>{tx.user}</td>
                  <td style={{ padding: "12px" }}>
                    <Badge variant={tx.currency === "Gift Coins" ? "champagne" : tx.currency === "Connection Points" ? "success" : "primary"}>
                      {tx.type}
                    </Badge>
                  </td>
                  <td style={{ padding: "12px", fontWeight: 700, color: "var(--text-main)" }}>{tx.amount}</td>
                  <td style={{ padding: "12px", color: "var(--text-secondary)" }}>{tx.fiat} ({tx.method})</td>
                  <td style={{ padding: "12px", color: "var(--text-secondary)" }}>{tx.date}</td>
                  <td style={{ padding: "12px" }}>
                    <Badge variant="success">Completed</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
