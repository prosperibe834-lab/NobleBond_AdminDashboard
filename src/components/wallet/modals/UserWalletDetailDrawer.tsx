import React from "react";
import { useNavigate } from "react-router-dom";
import { X, Coins, Award, ExternalLink, Scale, Lock } from "lucide-react";
import type {
  UnifiedFinancialTransaction,
  UserWalletSummary,
} from "../../../types/walletManagement.types";
import { Badge } from "../../common/Badge";
import {
  formatCoins,
  formatDateTime,
  formatPoints,
  formatTxValue,
  getTxStatusMeta,
} from "../walletUiUtils";

interface UserWalletDetailDrawerProps {
  wallet: UserWalletSummary | null;
  allTransactions: UnifiedFinancialTransaction[];
  canAdjust: boolean;
  onClose: () => void;
  onJumpToAdjustment: (userId: string) => void;
  onInspectTransaction: (tx: UnifiedFinancialTransaction) => void;
}

export const UserWalletDetailDrawer: React.FC<UserWalletDetailDrawerProps> = ({
  wallet,
  allTransactions,
  canAdjust,
  onClose,
  onJumpToAdjustment,
  onInspectTransaction,
}) => {
  const navigate = useNavigate();
  if (!wallet) return null;

  const userTxs = allTransactions.filter((t) => t.userId === wallet.userId).slice(0, 8);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 95,
        background: "rgba(0, 0, 0, 0.56)",
        display: "flex",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "490px",
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
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
              <img
                src={wallet.avatar}
                alt={wallet.name}
                style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover" }}
              />
              <div>
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>
                  {wallet.name}
                </h3>
                <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                  @{wallet.username} • {wallet.userId} • {wallet.email}
                </div>
              </div>
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

          {/* Two Strictly Separate Virtual Wallets */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {/* Gift Coins Wallet */}
            <div
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid rgba(230, 194, 159, 0.45)",
                borderRadius: "14px",
                padding: "14px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--accent-champagne)" }}>
                  GIFT COINS WALLET
                </span>
                <Coins size={15} style={{ color: "var(--accent-champagne)" }} />
              </div>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-main)" }}>
                {formatCoins(wallet.giftCoinsBalance)}
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "6px", lineHeight: 1.45 }}>
                Purchased: {wallet.giftCoinsPurchasedTotal}
                <br />
                Spent in Live: {wallet.giftCoinsSpentTotal}
                <br />
                Host Non-Cash Gifts: {wallet.giftsReceivedCoinValue}
              </div>
            </div>

            {/* Connection Points Wallet */}
            <div
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid rgba(139, 92, 246, 0.45)",
                borderRadius: "14px",
                padding: "14px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--accent-lavender)" }}>
                  CONNECTION POINTS
                </span>
                <Award size={15} style={{ color: "var(--accent-lavender)" }} />
              </div>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-main)" }}>
                {formatPoints(wallet.connectionPointsBalance)}
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "6px", lineHeight: 1.45 }}>
                Referral Earned: {wallet.connectionPointsEarnedReferrals}
                <br />
                Redeemed Perks: {wallet.connectionPointsRedeemedTotal}
                <br />
                Adjusted Net: {wallet.connectionPointsAdjustedTotal}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "9px 12px",
              borderRadius: "10px",
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border-light)",
              fontSize: "0.74rem",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Lock size={14} style={{ flexShrink: 0 }} />
            <span>
              Gift Coins and Connection Points remain completely independent ledgers with zero cash withdrawal or cross-conversion.
            </span>
          </div>

          {/* Member Recent Financial Activity */}
          <div>
            <div style={{ fontSize: "0.86rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
              Member Ledger History ({userTxs.length})
            </div>
            {userTxs.length === 0 ? (
              <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem", background: "var(--bg-surface-elevated)", borderRadius: "12px" }}>
                No financial transactions found for this member.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {userTxs.map((tx) => {
                  const val = formatTxValue(tx);
                  const st = getTxStatusMeta(tx.status);
                  return (
                    <button
                      key={tx.id}
                      type="button"
                      onClick={() => onInspectTransaction(tx)}
                      style={{
                        textAlign: "left",
                        background: "var(--bg-surface-elevated)",
                        border: "1px solid var(--border-light)",
                        borderRadius: "10px",
                        padding: "9px 11px",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {tx.title}
                        </div>
                        <div style={{ fontSize: "0.71rem", color: "var(--text-muted)" }}>
                          {tx.id} • {formatDateTime(tx.timestamp)}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: "0.82rem", fontWeight: 800, color: val.toneColor }}>
                          {val.primaryText}
                        </div>
                        <Badge variant={st.variant} size="sm">{st.label}</Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: "flex", gap: "10px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate(`/users?userId=${encodeURIComponent(wallet.userId)}`);
            }}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--bg-surface-elevated)",
              color: "var(--text-main)",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <span>Open User Profile</span>
            <ExternalLink size={13} />
          </button>

          {canAdjust && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onJumpToAdjustment(wallet.userId);
              }}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "10px",
                border: "none",
                background: "var(--primary)",
                color: "#fff",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              <Scale size={14} />
              <span>Adjust Balance</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

