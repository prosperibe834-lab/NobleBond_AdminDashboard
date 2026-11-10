// NobleBond Admin — Gift Coin Transaction Detail Modal
// In-stream gift audit, wallet ledger reference, zero emojis

import React from "react";
import {
  X,
  Gift,
  Coins,
} from "lucide-react";
import type { LiveGiftTransactionRecord } from "../../../types/liveManagement.types";

interface GiftTransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  gift: LiveGiftTransactionRecord | null;
  onOpenUserProfile?: (userId: string) => void;
}

export const GiftTransactionDetailModal: React.FC<GiftTransactionDetailModalProps> = ({
  isOpen,
  onClose,
  gift,
  onOpenUserProfile,
}) => {
  if (!isOpen || !gift) return null;

  const formattedTime = new Date(gift.timestamp).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        className="animate-scale-up"
        style={{
          width: "100%",
          maxWidth: "520px",
          backgroundColor: "var(--bg-card)",
          borderRadius: "18px",
          border: "1px solid var(--border)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "var(--bg-surface)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: "rgba(212, 175, 55, 0.12)",
                color: "var(--accent-champagne)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Gift size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
                Gift Transaction: {gift.id}
              </h3>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Wallet Reference: {gift.walletReference}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "6px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Parties */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div
              style={{ padding: "12px", borderRadius: "10px", backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", cursor: "pointer" }}
              onClick={() => onOpenUserProfile?.(gift.sender.id)}
            >
              <span style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Gifting Member</span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                <img src={gift.sender.avatar} alt={gift.sender.name} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>{gift.sender.name}</div>
                  <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>{gift.sender.username}</div>
                </div>
              </div>
            </div>

            <div
              style={{ padding: "12px", borderRadius: "10px", backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", cursor: "pointer" }}
              onClick={() => onOpenUserProfile?.(gift.recipient.id)}
            >
              <span style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Recipient Host</span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                <img src={gift.recipient.avatar} alt={gift.recipient.name} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>{gift.recipient.name}</div>
                  <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>{gift.recipient.username}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Gift Item Summary */}
          <div
            style={{
              padding: "16px",
              borderRadius: "12px",
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Virtual Gift Item</div>
              <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>
                {gift.giftName}
              </div>
              <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", textTransform: "capitalize" }}>
                Category: {gift.giftType} Tier
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Amount</div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--accent-champagne)", display: "flex", alignItems: "center", gap: "4px" }}>
                <Coins size={16} /> {gift.coinAmount.toLocaleString()} Coins
              </div>
            </div>
          </div>

          {/* Audit Details */}
          <div style={{ padding: "14px", borderRadius: "10px", backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", fontSize: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Live Room:</span>
              <strong style={{ color: "var(--text-main)" }}>{gift.sessionTitle}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Session Reference:</span>
              <strong style={{ color: "var(--text-main)", fontFamily: "monospace" }}>{gift.sessionId}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Timestamp:</span>
              <strong style={{ color: "var(--text-main)" }}>{formattedTime}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Status:</span>
              <strong style={{ color: "var(--status-success)", textTransform: "capitalize" }}>{gift.status}</strong>
            </div>
          </div>

          {/* Virtual Currency Notice */}
          <div
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              backgroundColor: "rgba(212, 175, 55, 0.08)",
              border: "1px solid rgba(212, 175, 55, 0.2)",
              fontSize: "11px",
              color: "var(--text-secondary)",
              lineHeight: 1.3,
            }}
          >
            Gift Coins are non-withdrawable virtual appreciation tokens. Balances and financial settlements are maintained via the authorised NobleBond Wallet Ledger.
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 18px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
