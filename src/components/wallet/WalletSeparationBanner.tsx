import React from "react";
import { ShieldCheck, Coins, Award, CreditCard, Lock } from "lucide-react";

export const WalletSeparationBanner: React.FC = () => {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        padding: "14px 18px",
        marginBottom: "20px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: "1 1 320px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "var(--primary-glow)",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ShieldCheck size={19} />
        </div>
        <div>
          <div
            style={{
              fontSize: "0.875rem",
              fontWeight: 700,
              color: "var(--text-main)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>Three-Ledger Financial Separation Active</span>
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "2px" }}>
            Gift Coins, Connection Points, and Premium USD Billing are accounted independently. Virtual items carry zero cash-withdrawal value and cannot be cross-converted.
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 10px",
            borderRadius: "999px",
            fontSize: "0.74rem",
            fontWeight: 600,
            background: "var(--accent-champagne-bg)",
            color: "var(--accent-champagne)",
            border: "1px solid rgba(230, 194, 159, 0.25)",
          }}
        >
          <Coins size={13} />
          Gift Coins (Virtual)
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 10px",
            borderRadius: "999px",
            fontSize: "0.74rem",
            fontWeight: 600,
            background: "var(--accent-lavender-bg)",
            color: "var(--accent-lavender)",
            border: "1px solid rgba(139, 92, 246, 0.25)",
          }}
        >
          <Award size={13} />
          Connection Points (Rewards)
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 10px",
            borderRadius: "999px",
            fontSize: "0.74rem",
            fontWeight: 600,
            background: "var(--status-success-bg)",
            color: "var(--status-success)",
            border: "1px solid rgba(16, 185, 129, 0.25)",
          }}
        >
          <CreditCard size={13} />
          Premium Billing (USD)
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px 10px",
            borderRadius: "999px",
            fontSize: "0.72rem",
            fontWeight: 600,
            background: "var(--bg-surface-elevated)",
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
          }}
        >
          <Lock size={12} />
          No Cash Payouts
        </span>
      </div>
    </div>
  );
};

