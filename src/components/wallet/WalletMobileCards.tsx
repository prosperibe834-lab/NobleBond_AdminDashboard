import React from "react";
import type { UnifiedFinancialTransaction } from "../../types/walletManagement.types";
import { Badge } from "../common/Badge";
import {
  formatDateTime,
  formatTxValue,
  getCategoryMeta,
  getTxStatusMeta,
  getTxTypeLabel,
} from "./walletUiUtils";

interface WalletMobileCardsProps {
  transactions: UnifiedFinancialTransaction[];
  onInspectTransaction: (tx: UnifiedFinancialTransaction) => void;
}

export const WalletMobileCards: React.FC<WalletMobileCardsProps> = ({
  transactions,
  onInspectTransaction,
}) => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "12px" }}>
      {transactions.map((tx) => {
        const catMeta = getCategoryMeta(tx.category);
        const valMeta = formatTxValue(tx);
        const stMeta = getTxStatusMeta(tx.status);

        return (
          <button
            key={tx.id}
            type="button"
            onClick={() => onInspectTransaction(tx)}
            style={{
              textAlign: "left",
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              padding: "14px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              transition: "border-color 0.16s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)" }}>{tx.id}</div>
                <div style={{ fontSize: "0.86rem", fontWeight: 700, color: "var(--text-main)", marginTop: "2px" }}>
                  {tx.title}
                </div>
              </div>
              <Badge variant={catMeta.variant} size="sm">{catMeta.shortLabel}</Badge>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img
                src={tx.userAvatar}
                alt={tx.userName}
                style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }}
              />
              <div>
                <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-main)" }}>{tx.userName}</div>
                <div style={{ fontSize: "0.71rem", color: "var(--text-muted)" }}>{getTxTypeLabel(tx.transactionType)}</div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "8px",
                borderTop: "1px solid var(--border-light)",
              }}
            >
              <div>
                <div style={{ fontSize: "0.95rem", fontWeight: 800, color: valMeta.toneColor }}>
                  {valMeta.primaryText}
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{valMeta.unitLabel}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <Badge variant={stMeta.variant} size="sm">{stMeta.label}</Badge>
                <div style={{ fontSize: "0.69rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  {formatDateTime(tx.timestamp)}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

