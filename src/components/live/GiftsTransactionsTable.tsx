// NobleBond Admin — Gifts & Live Transactions Management Table
// Virtual Gift Coin transaction ledger, popular gifts, top gifters, zero emojis

import React from "react";
import {
  Gift,
  Coins,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import type { LiveGiftTransactionRecord } from "../../types/liveManagement.types";

interface GiftsTransactionsTableProps {
  gifts: LiveGiftTransactionRecord[];
  onOpenGiftDetails: (gift: LiveGiftTransactionRecord) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const GiftsTransactionsTable: React.FC<GiftsTransactionsTableProps> = ({
  gifts,
  onOpenGiftDetails,
  onOpenUserProfile,
}) => {
  const getStatusBadge = (status: LiveGiftTransactionRecord["status"]) => {
    switch (status) {
      case "completed":
        return (
          <span
            style={{
              padding: "2px 7px",
              borderRadius: "5px",
              fontSize: "11px",
              fontWeight: 700,
              backgroundColor: "rgba(16, 185, 129, 0.12)",
              color: "var(--status-success)",
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <CheckCircle2 size={11} /> Completed
          </span>
        );
      case "refunded":
        return (
          <span
            style={{
              padding: "2px 7px",
              borderRadius: "5px",
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: "rgba(107, 114, 128, 0.12)",
              color: "#6B7280",
            }}
          >
            Refunded
          </span>
        );
      case "disputed":
        return (
          <span
            style={{
              padding: "2px 7px",
              borderRadius: "5px",
              fontSize: "11px",
              fontWeight: 700,
              backgroundColor: "rgba(245, 158, 11, 0.12)",
              color: "#D97706",
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <Clock size={11} /> Disputed
          </span>
        );
      case "failed":
        return (
          <span
            style={{
              padding: "2px 7px",
              borderRadius: "5px",
              fontSize: "11px",
              fontWeight: 800,
              backgroundColor: "rgba(220, 38, 38, 0.12)",
              color: "#DC2626",
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <XCircle size={11} /> Failed
          </span>
        );
    }
  };

  const getGiftCategoryBadge = (category: LiveGiftTransactionRecord["giftType"]) => {
    switch (category) {
      case "romantic":
        return (
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#EC4899", textTransform: "capitalize" }}>
            Romantic
          </span>
        );
      case "luxury":
        return (
          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-champagne)", textTransform: "capitalize" }}>
            Luxury Tier
          </span>
        );
      case "celebration":
        return (
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#8B5CF6", textTransform: "capitalize" }}>
            Celebration
          </span>
        );
      case "support":
        return (
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#2563EB", textTransform: "capitalize" }}>
            Support
          </span>
        );
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Notice Banner */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "12px 18px",
          backgroundColor: "rgba(212, 175, 55, 0.08)",
          border: "1px solid rgba(212, 175, 55, 0.25)",
          borderRadius: "12px",
          color: "var(--text-main)",
        }}
      >
        <Sparkles size={17} style={{ color: "var(--accent-champagne)", flexShrink: 0 }} />
        <span style={{ fontSize: "12.5px" }}>
          <strong>Virtual Gift Coin Ledger:</strong> In-stream gifts are purchased and gifted using virtual Gift Coins. Gift Coins represent virtual appreciation only and are strictly separated from Connection Points and Premium subscriptions.
        </span>
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: "13px",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderBottom: "1px solid var(--border)",
                  color: "var(--text-secondary)",
                  fontSize: "11.5px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                <th style={{ padding: "14px 18px" }}>Transaction ID</th>
                <th style={{ padding: "14px 18px" }}>Gift Item</th>
                <th style={{ padding: "14px 18px" }}>Sender Member</th>
                <th style={{ padding: "14px 18px" }}>Recipient Host</th>
                <th style={{ padding: "14px 18px" }}>Coins Spent</th>
                <th style={{ padding: "14px 18px" }}>Session</th>
                <th style={{ padding: "14px 18px" }}>Status</th>
                <th style={{ padding: "14px 18px", textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {gifts.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: "48px 24px",
                      textAlign: "center",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <Gift size={32} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
                    <div style={{ fontSize: "14.5px", fontWeight: 700 }}>No gift transactions found</div>
                  </td>
                </tr>
              ) : (
                gifts.map((gift) => {
                  const formattedTime = new Date(gift.timestamp).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr
                      key={gift.id}
                      style={{
                        borderBottom: "1px solid var(--border)",
                        transition: "background-color 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--bg-surface-elevated)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      {/* Transaction ID */}
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ fontWeight: 700, color: "var(--text-main)", fontFamily: "monospace" }}>
                          {gift.id}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                          {formattedTime}
                        </div>
                      </td>

                      {/* Gift Item */}
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div
                            style={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "8px",
                              backgroundColor: "rgba(212, 175, 55, 0.12)",
                              color: "var(--accent-champagne)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Gift size={16} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: "var(--text-main)" }}>
                              {gift.giftName}
                            </div>
                            <div>{getGiftCategoryBadge(gift.giftType)}</div>
                          </div>
                        </div>
                      </td>

                      {/* Sender */}
                      <td style={{ padding: "14px 18px" }}>
                        <div
                          style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                          onClick={() => onOpenUserProfile?.(gift.sender.id)}
                        >
                          <img
                            src={gift.sender.avatar}
                            alt={gift.sender.name}
                            style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: "var(--text-main)" }}>
                              {gift.sender.name}
                            </div>
                            <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
                              {gift.sender.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Recipient Host */}
                      <td style={{ padding: "14px 18px" }}>
                        <div
                          style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                          onClick={() => onOpenUserProfile?.(gift.recipient.id)}
                        >
                          <img
                            src={gift.recipient.avatar}
                            alt={gift.recipient.name}
                            style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: "var(--text-main)" }}>
                              {gift.recipient.name}
                            </div>
                            <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
                              {gift.recipient.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Coins Spent */}
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", fontWeight: 800, color: "var(--accent-champagne)" }}>
                          <Coins size={14} />
                          {gift.coinAmount.toLocaleString()} Coins
                        </div>
                        <div style={{ fontSize: "10.5px", color: "var(--text-muted)", marginTop: "2px" }}>
                          Ref: {gift.walletReference}
                        </div>
                      </td>

                      {/* Session */}
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ fontWeight: 600, color: "var(--text-main)", maxWidth: "180px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={gift.sessionTitle}>
                          {gift.sessionTitle}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                          Room: {gift.sessionId}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "14px 18px" }}>{getStatusBadge(gift.status)}</td>

                      {/* Action */}
                      <td style={{ padding: "14px 18px", textAlign: "right" }}>
                        <button
                          type="button"
                          onClick={() => onOpenGiftDetails(gift)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "8px",
                            border: "1px solid var(--border)",
                            backgroundColor: "var(--bg-surface)",
                            color: "var(--text-main)",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          Details <ExternalLink size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

