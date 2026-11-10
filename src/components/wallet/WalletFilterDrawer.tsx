import React from "react";
import { X, RotateCcw, SlidersHorizontal } from "lucide-react";
import type { WalletFilterState } from "../../types/walletManagement.types";

interface WalletFilterDrawerProps {
  isOpen: boolean;
  filters: WalletFilterState;
  onUpdateFilters: (next: WalletFilterState) => void;
  onResetFilters: () => void;
  onClose: () => void;
}

export const WalletFilterDrawer: React.FC<WalletFilterDrawerProps> = ({
  isOpen,
  filters,
  onUpdateFilters,
  onResetFilters,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 90,
        background: "rgba(0, 0, 0, 0.52)",
        display: "flex",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "390px",
          height: "100%",
          background: "var(--bg-card)",
          borderLeft: "1px solid var(--border)",
          padding: "22px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflowY: "auto",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <SlidersHorizontal size={18} style={{ color: "var(--primary)" }} />
              <h3 style={{ margin: 0, fontSize: "1.02rem", fontWeight: 700, color: "var(--text-main)" }}>
                Advanced Ledger Filters
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
                borderRadius: "8px",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={16} />
            </button>
          </div>

          <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-main)" }}>
            Product Category
            <select
              value={filters.category}
              onChange={(e) =>
                onUpdateFilters({
                  ...filters,
                  category: e.target.value as WalletFilterState["category"],
                })
              }
              style={{
                padding: "9px 10px",
                borderRadius: "9px",
                border: "1px solid var(--border)",
                background: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                fontSize: "0.84rem",
              }}
            >
              <option value="all">All 3 Products (Separated Units)</option>
              <option value="gift_coins">Gift Coins Only</option>
              <option value="connection_points">Connection Points Only</option>
              <option value="premium_subscription">Premium Subscriptions (USD)</option>
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-main)" }}>
            Unit / Currency Type
            <select
              value={filters.currency}
              onChange={(e) =>
                onUpdateFilters({
                  ...filters,
                  currency: e.target.value as WalletFilterState["currency"],
                })
              }
              style={{
                padding: "9px 10px",
                borderRadius: "9px",
                border: "1px solid var(--border)",
                background: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                fontSize: "0.84rem",
              }}
            >
              <option value="all">All Units</option>
              <option value="USD">Real Money (USD)</option>
              <option value="COINS">Gift Coins (COINS)</option>
              <option value="POINTS">Connection Points (POINTS)</option>
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-main)" }}>
            Transaction Type
            <select
              value={filters.transactionType}
              onChange={(e) =>
                onUpdateFilters({ ...filters, transactionType: e.target.value })
              }
              style={{
                padding: "9px 10px",
                borderRadius: "9px",
                border: "1px solid var(--border)",
                background: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                fontSize: "0.84rem",
              }}
            >
              <option value="all">All Transaction Types</option>
              <option value="gift_coin_purchase">Gift Coin Purchase</option>
              <option value="gift_sent">Live Gift Sent</option>
              <option value="gift_coin_adjustment">Coin Adjustment</option>
              <option value="gift_coin_reversal">Coin Reversal</option>
              <option value="connection_points_referral">Referral Points Issued</option>
              <option value="connection_points_redemption">Points Perk Redemption</option>
              <option value="connection_points_adjustment">Points Adjustment</option>
              <option value="premium_subscription_payment">Premium Subscription Payment</option>
              <option value="premium_subscription_renewal">Premium Subscription Renewal</option>
              <option value="premium_subscription_refund">Premium Subscription Refund</option>
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-main)" }}>
            Settlement / Processing Status
            <select
              value={filters.status}
              onChange={(e) =>
                onUpdateFilters({
                  ...filters,
                  status: e.target.value as WalletFilterState["status"],
                })
              }
              style={{
                padding: "9px 10px",
                borderRadius: "9px",
                border: "1px solid var(--border)",
                background: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                fontSize: "0.84rem",
              }}
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
              <option value="reversed">Reversed</option>
              <option value="disputed">Disputed</option>
            </select>
          </label>
        </div>

        <div style={{ display: "flex", gap: "10px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
          <button
            type="button"
            onClick={onResetFilters}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--bg-surface-elevated)",
              color: "var(--text-main)",
              fontSize: "0.83rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <RotateCcw size={14} />
            <span>Reset All</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              background: "var(--primary)",
              color: "#fff",
              fontSize: "0.83rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

