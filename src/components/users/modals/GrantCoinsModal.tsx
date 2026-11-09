import React, { useState } from "react";
import { X, Coins, Plus, Minus } from "lucide-react";
import type { NobleUser } from "../../../types/userManagement.types";

interface GrantCoinsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: NobleUser | null;
  onConfirm: (userId: string, amount: number, reason: string, ref?: string) => void;
}

export const GrantCoinsModal: React.FC<GrantCoinsModalProps> = ({
  isOpen,
  onClose,
  user,
  onConfirm,
}) => {
  const [amountStr, setAmountStr] = useState("100");
  const [isAddition, setIsAddition] = useState(true);
  const [reason, setReason] = useState("");
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !user) return null;

  const currentCoins = user.wallet.giftCoins;
  const numAmount = parseInt(amountStr, 10) || 0;
  const delta = isAddition ? numAmount : -numAmount;
  const projectedBalance = Math.max(0, currentCoins + delta);

  const handleConfirm = () => {
    if (numAmount <= 0) {
      setError("Please enter a valid coin amount greater than 0");
      return;
    }
    if (!reason.trim()) {
      setError("Please provide a reason for the adjustment");
      return;
    }
    onConfirm(user.id, delta, reason.trim(), reference.trim() || undefined);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        zIndex: 1100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "var(--bg-card)",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-elevated)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: "rgba(181, 139, 66, 0.12)",
                color: "var(--accent-champagne)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Coins size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                Adjust Gift Coins Balance
              </h3>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                {user.name} ({user.username})
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "6px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Balance Projection Box */}
          <div
            style={{
              padding: "16px",
              borderRadius: "12px",
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border)",
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr auto 1fr",
              alignItems: "center",
              textAlign: "center",
              gap: "8px",
            }}
          >
            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>Current</div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>
                {currentCoins.toLocaleString()}
              </div>
            </div>

            <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-muted)" }}>
              {isAddition ? "+" : "-"}
            </span>

            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>Adjustment</div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: isAddition ? "var(--status-success)" : "var(--status-danger)",
                  marginTop: "2px",
                }}
              >
                {numAmount.toLocaleString()}
              </div>
            </div>

            <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-muted)" }}>=</span>

            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>Projected</div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "var(--accent-champagne)",
                  marginTop: "2px",
                }}
              >
                {projectedBalance.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Type Toggle & Amount */}
          <div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
              <button
                type="button"
                onClick={() => setIsAddition(true)}
                style={{
                  flex: 1,
                  padding: "7px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 700,
                  border: `1px solid ${isAddition ? "var(--status-success)" : "var(--border)"}`,
                  backgroundColor: isAddition ? "rgba(20, 132, 95, 0.1)" : "var(--bg-surface)",
                  color: isAddition ? "var(--status-success)" : "var(--text-secondary)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                <Plus size={14} />
                <span>Credit Gift Coins</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAddition(false)}
                style={{
                  flex: 1,
                  padding: "7px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 700,
                  border: `1px solid ${!isAddition ? "var(--status-danger)" : "var(--border)"}`,
                  backgroundColor: !isAddition ? "rgba(201, 54, 79, 0.1)" : "var(--bg-surface)",
                  color: !isAddition ? "var(--status-danger)" : "var(--text-secondary)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                <Minus size={14} />
                <span>Debit / Correction</span>
              </button>
            </div>

            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              Coin Amount
            </label>
            <input
              type="number"
              min="1"
              value={amountStr}
              onChange={(e) => {
                setAmountStr(e.target.value);
                if (error) setError("");
              }}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "14px",
                fontWeight: 700,
              }}
            />
          </div>

          {/* Reason */}
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              Adjustment Reason <span style={{ color: "var(--status-danger)" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. VIP Creator live-stream compensation bonus"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError("");
              }}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: `1px solid ${error ? "var(--status-danger)" : "var(--border)"}`,
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            />
            {error && <span style={{ fontSize: "11px", color: "var(--status-danger)" }}>{error}</span>}
          </div>

          {/* Reference */}
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              Reference / Ticket Code (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. TICKET-NB-98124"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid var(--border)",
            backgroundColor: "var(--bg-surface)",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "transparent",
              color: "var(--text-main)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              backgroundColor: "var(--accent-champagne)",
              color: "#151019",
              border: "none",
              fontSize: "13px",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Coins size={14} />
            <span>Apply Coin Adjustment</span>
          </button>
        </div>
      </div>
    </div>
  );
};

