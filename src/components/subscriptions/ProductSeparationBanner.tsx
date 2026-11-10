// NobleBond Admin — Subscription Billing Separation Banner
// Clearly enforces separation between Premium Subscriptions, Gift Coins, and Connection Points. Zero emojis.

import React from "react";

export const ProductSeparationBanner: React.FC = () => (
  <div
    style={{
      padding: "10px 16px",
      borderRadius: "12px",
      backgroundColor: "var(--bg-surface-elevated)",
      border: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "8px",
      fontSize: "12px",
      color: "var(--text-secondary)",
    }}
  >
    <span>
      <strong style={{ color: "var(--primary)" }}>Billing Integrity Rule:</strong>{" "}
      All figures represent <strong>NobleBond Premium Subscriptions</strong> exclusively. Gift Coins (Live Streaming Currency) and Connection Points (Referral Rewards) are managed separately in Wallet & Referral Operations.
    </span>
    <span
      style={{
        fontSize: "11px",
        fontWeight: 700,
        color: "var(--text-muted)",
        textTransform: "uppercase",
        letterSpacing: "0.4px",
      }}
    >
      Demo Mode Active - Local State Only
    </span>
  </div>
);

