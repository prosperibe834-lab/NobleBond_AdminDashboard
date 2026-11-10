import React, { useState } from "react";
import { ShieldAlert, Scale, ArrowRightLeft, Lock, CheckCircle2 } from "lucide-react";
import type {
  FinancialRolePermissions,
  UnifiedFinancialTransaction,
  UserWalletSummary,
} from "../../types/walletManagement.types";
import { Badge } from "../common/Badge";
import {
  formatCoins,
  formatDateTime,
  formatPoints,
  formatTxValue,
  getCategoryMeta,
  getTxStatusMeta,
} from "./walletUiUtils";

export interface PendingAdjustmentDraft {
  user: UserWalletSummary;
  walletType: "gift_coins" | "connection_points";
  adjustmentType: "credit" | "debit" | "reversal";
  quantity: number;
  reason: string;
  relatedReference?: string;
}

interface FinancialAdjustmentsSectionProps {
  wallets: UserWalletSummary[];
  adjustmentHistory: UnifiedFinancialTransaction[];
  permissions: FinancialRolePermissions;
  preselectedUserId?: string;
  onRequestConfirmAdjustment: (draft: PendingAdjustmentDraft) => void;
  onInspectTransaction: (tx: UnifiedFinancialTransaction) => void;
}

export const FinancialAdjustmentsSection: React.FC<
  FinancialAdjustmentsSectionProps
> = ({
  wallets,
  adjustmentHistory,
  permissions,
  preselectedUserId,
  onRequestConfirmAdjustment,
  onInspectTransaction,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string>(
    preselectedUserId || wallets[0]?.userId || ""
  );
  const [walletType, setWalletType] = useState<"gift_coins" | "connection_points">(
    "gift_coins"
  );
  const [adjustmentType, setAdjustmentType] = useState<"credit" | "debit" | "reversal">(
    "credit"
  );
  const [quantityStr, setQuantityStr] = useState<string>("50");
  const [reason, setReason] = useState<string>("");
  const [relatedReference, setRelatedReference] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

  const selectedWallet = wallets.find((w) => w.userId === selectedUserId) || wallets[0];
  const parsedQty = Math.max(0, Math.floor(Number(quantityStr) || 0));

  const currentBal = selectedWallet
    ? walletType === "gift_coins"
      ? selectedWallet.giftCoinsBalance
      : selectedWallet.connectionPointsBalance
    : 0;
  const isDebit = adjustmentType === "debit" || adjustmentType === "reversal";
  const projectedBal = isDebit
    ? Math.max(0, currentBal - parsedQty)
    : currentBal + parsedQty;
  const exceedsBalance = isDebit && parsedQty > currentBal;

  const hasPermissionForAction = (() => {
    if (adjustmentType === "reversal") return permissions.canReverseTransactions;
    if (!permissions.canApproveAdjustments) return false;
    return walletType === "gift_coins"
      ? permissions.canIssueGiftCoins
      : permissions.canIssueConnectionPoints;
  })();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedWallet) {
      setFormError("Please select a target member wallet.");
      return;
    }
    if (!hasPermissionForAction) {
      setFormError(
        `Current RBAC role (${permissions.roleLabel}) lacks authorization for this ${adjustmentType} action on ${
          walletType === "gift_coins" ? "Gift Coins" : "Connection Points"
        }.`
      );
      return;
    }
    if (parsedQty <= 0) {
      setFormError("Quantity must be a positive whole number greater than zero.");
      return;
    }
    if (exceedsBalance) {
      setFormError(
        `Insufficient ${walletType === "gift_coins" ? "Gift Coins" : "Connection Points"} balance (${currentBal}) for debit of ${parsedQty}.`
      );
      return;
    }
    if (reason.trim().length < 5) {
      setFormError("Provide an explicit operational reason (minimum 5 characters) for the financial audit ledger.");
      return;
    }

    onRequestConfirmAdjustment({
      user: selectedWallet,
      walletType,
      adjustmentType,
      quantity: parsedQty,
      reason: reason.trim(),
      relatedReference: relatedReference.trim() || undefined,
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {/* Policy Guardrail Strip */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "14px",
          padding: "14px 18px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Lock size={18} style={{ color: "var(--primary)" }} />
          <div>
            <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-main)" }}>
              Controlled Ledger Adjustment Protocol
            </div>
            <div style={{ fontSize: "0.76rem", color: "var(--text-secondary)" }}>
              Adjustments modify either Gift Coins OR Connection Points independently with pre-confirmation audit logging. Cross-conversions and cash payouts are permanently disabled.
            </div>
          </div>
        </div>
        <Badge variant={hasPermissionForAction ? "success" : "warning"} size="sm">
          Role: {permissions.roleLabel}
        </Badge>
      </div>

      {/* Main Split Grid: Adjustment Form + Live Balance Preview */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "16px",
        }}
      >
        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "18px",
            display: "flex",
            flexDirection: "column",
            gap: "13px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
            <Scale size={18} style={{ color: "var(--primary)" }} />
            <h3 style={{ margin: 0, fontSize: "0.98rem", fontWeight: 700, color: "var(--text-main)" }}>
              Issue Wallet Ledger Adjustment
            </h3>
          </div>

          <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.79rem", fontWeight: 600, color: "var(--text-main)" }}>
            1. Select Target Member Wallet
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              style={{
                padding: "9px 10px",
                borderRadius: "9px",
                border: "1px solid var(--border)",
                background: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                fontSize: "0.83rem",
              }}
            >
              {wallets.map((w) => (
                <option key={w.userId} value={w.userId}>
                  {w.name} (@{w.username}) — {w.giftCoinsBalance} Coins | {w.connectionPointsBalance} Pts
                </option>
              ))}
            </select>
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.79rem", fontWeight: 600, color: "var(--text-main)" }}>
              2. Target Wallet Ledger
              <select
                value={walletType}
                onChange={(e) =>
                  setWalletType(e.target.value as "gift_coins" | "connection_points")
                }
                style={{
                  padding: "9px 10px",
                  borderRadius: "9px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-surface-elevated)",
                  color: "var(--text-main)",
                  fontSize: "0.83rem",
                }}
              >
                <option value="gift_coins">Gift Coins Wallet (COINS)</option>
                <option value="connection_points">Connection Points Wallet (PTS)</option>
              </select>
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.79rem", fontWeight: 600, color: "var(--text-main)" }}>
              3. Operation Type
              <select
                value={adjustmentType}
                onChange={(e) =>
                  setAdjustmentType(e.target.value as "credit" | "debit" | "reversal")
                }
                style={{
                  padding: "9px 10px",
                  borderRadius: "9px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-surface-elevated)",
                  color: "var(--text-main)",
                  fontSize: "0.83rem",
                }}
              >
                <option value="credit">Credit (+ Add Balance)</option>
                <option value="debit">Debit (- Deduct Balance)</option>
                <option value="reversal">Reversal (Undo Prior Entry)</option>
              </select>
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.79rem", fontWeight: 600, color: "var(--text-main)" }}>
              4. Quantity ({walletType === "gift_coins" ? "Coins" : "Points"})
              <input
                type="number"
                min={1}
                max={50000}
                value={quantityStr}
                onChange={(e) => setQuantityStr(e.target.value)}
                required
                style={{
                  padding: "9px 10px",
                  borderRadius: "9px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-surface-elevated)",
                  color: "var(--text-main)",
                  fontSize: "0.86rem",
                  fontWeight: 700,
                }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.79rem", fontWeight: 600, color: "var(--text-main)" }}>
              5. Related Ref / Ticket (Optional)
              <input
                type="text"
                value={relatedReference}
                onChange={(e) => setRelatedReference(e.target.value)}
                placeholder="e.g. SUP-9410 / GCP-5003"
                style={{
                  padding: "9px 10px",
                  borderRadius: "9px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-surface-elevated)",
                  color: "var(--text-main)",
                  fontSize: "0.82rem",
                }}
              />
            </label>
          </div>

          <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.79rem", fontWeight: 600, color: "var(--text-main)" }}>
            6. Mandatory Audit Reason
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain exact financial verification or support ticket authorization..."
              required
              style={{
                padding: "9px 10px",
                borderRadius: "9px",
                border: "1px solid var(--border)",
                background: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                fontSize: "0.82rem",
                resize: "vertical",
              }}
            />
          </label>

          {formError && (
            <div
              style={{
                padding: "10px 12px",
                borderRadius: "9px",
                background: "var(--status-error-bg)",
                color: "var(--status-error)",
                fontSize: "0.79rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <ShieldAlert size={15} />
              <span>{formError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!hasPermissionForAction}
            style={{
              marginTop: "4px",
              padding: "11px 14px",
              borderRadius: "10px",
              border: "none",
              background: hasPermissionForAction ? "var(--primary)" : "var(--bg-surface-elevated)",
              color: hasPermissionForAction ? "#fff" : "var(--text-muted)",
              fontSize: "0.84rem",
              fontWeight: 700,
              cursor: hasPermissionForAction ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <ArrowRightLeft size={15} />
            <span>
              {hasPermissionForAction
                ? "Review & Confirm Ledger Adjustment"
                : "Read-Only Role (Adjustment Disabled)"}
            </span>
          </button>
        </form>

        {/* Live Balance Diff Preview Card */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "18px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "14px",
          }}
        >
          {selectedWallet && (
            <>
              <div>
                <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "12px" }}>
                  Pre-Confirmation Impact Preview
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", borderRadius: "12px", background: "var(--bg-surface-elevated)", marginBottom: "12px" }}>
                  <img
                    src={selectedWallet.avatar}
                    alt={selectedWallet.name}
                    style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{selectedWallet.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      @{selectedWallet.username} ({selectedWallet.userId})
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                  <div
                    style={{
                      padding: "11px",
                      borderRadius: "11px",
                      background: "var(--bg-surface-elevated)",
                      border:
                        walletType === "gift_coins"
                          ? "1px solid var(--accent-champagne)"
                          : "1px solid var(--border-light)",
                    }}
                  >
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Gift Coins Balance</div>
                    <div style={{ fontSize: "1.02rem", fontWeight: 800, color: "var(--accent-champagne)", marginTop: "3px" }}>
                      {formatCoins(selectedWallet.giftCoinsBalance)}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "11px",
                      borderRadius: "11px",
                      background: "var(--bg-surface-elevated)",
                      border:
                        walletType === "connection_points"
                          ? "1px solid var(--accent-lavender)"
                          : "1px solid var(--border-light)",
                    }}
                  >
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Connection Points</div>
                    <div style={{ fontSize: "1.02rem", fontWeight: 800, color: "var(--accent-lavender)", marginTop: "3px" }}>
                      {formatPoints(selectedWallet.connectionPointsBalance)}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: "14px",
                    borderRadius: "12px",
                    background: exceedsBalance ? "var(--status-error-bg)" : "var(--bg-surface-elevated)",
                    border: exceedsBalance ? "1px solid var(--status-error)" : "1px solid var(--border)",
                  }}
                >
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "6px" }}>
                    Projected {walletType === "gift_coins" ? "Gift Coins" : "Connection Points"} After Confirmation
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "1.05rem", fontWeight: 800 }}>
                    <span style={{ color: "var(--text-secondary)" }}>
                      {currentBal.toLocaleString()}
                    </span>
                    <span style={{ color: isDebit ? "var(--status-error)" : "var(--status-success)" }}>
                      {isDebit ? `-${parsedQty}` : `+${parsedQty}`}
                    </span>
                    <span style={{ color: exceedsBalance ? "var(--status-error)" : "var(--text-main)" }}>
                      {exceedsBalance ? "INSUFFICIENT" : projectedBal.toLocaleString()}{" "}
                      {walletType === "gift_coins" ? "Coins" : "Pts"}
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: "10px",
                  background: "var(--status-success-bg)",
                  color: "var(--status-success)",
                  fontSize: "0.76rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                }}
              >
                <CheckCircle2 size={15} />
                <span>Every confirmed adjustment updates User Management immediately and appends to the immutable Audit Ledger.</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Ledger Adjustments History */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "18px",
        }}
      >
        <h3 style={{ margin: "0 0 12px 0", fontSize: "0.96rem", fontWeight: 700, color: "var(--text-main)" }}>
          Admin Ledger Adjustments History ({adjustmentHistory.length})
        </h3>
        {adjustmentHistory.length === 0 ? (
          <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.84rem" }}>
            No manual ledger adjustments recorded yet. Submit the form above to record your first audited ledger adjustment.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)", textAlign: "left" }}>
                  <th style={{ padding: "9px 8px" }}>Adjustment ID</th>
                  <th style={{ padding: "9px 8px" }}>Category</th>
                  <th style={{ padding: "9px 8px" }}>Member</th>
                  <th style={{ padding: "9px 8px" }}>Quantity Delta</th>
                  <th style={{ padding: "9px 8px" }}>Prev -&gt; New Balance</th>
                  <th style={{ padding: "9px 8px" }}>Audit Note</th>
                  <th style={{ padding: "9px 8px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {adjustmentHistory.map((adj) => {
                  const cat = getCategoryMeta(adj.category);
                  const val = formatTxValue(adj);
                  const st = getTxStatusMeta(adj.status);
                  return (
                    <tr
                      key={adj.id}
                      onClick={() => onInspectTransaction(adj)}
                      style={{ borderBottom: "1px solid var(--border-light)", cursor: "pointer" }}
                    >
                      <td style={{ padding: "10px 8px", fontWeight: 700, color: "var(--primary)" }}>{adj.id}</td>
                      <td style={{ padding: "10px 8px" }}>
                        <Badge variant={cat.variant} size="sm">{cat.shortLabel}</Badge>
                      </td>
                      <td style={{ padding: "10px 8px", fontWeight: 600, color: "var(--text-main)" }}>{adj.userName}</td>
                      <td style={{ padding: "10px 8px", fontWeight: 800, color: val.toneColor }}>{val.primaryText}</td>
                      <td style={{ padding: "10px 8px", color: "var(--text-secondary)" }}>
                        {adj.previousBalance ?? "--"} -&gt; {adj.newBalance ?? "--"}
                      </td>
                      <td style={{ padding: "10px 8px", color: "var(--text-secondary)" }}>
                        <div>{adj.notes}</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{formatDateTime(adj.timestamp)}</div>
                      </td>
                      <td style={{ padding: "10px 8px" }}>
                        <Badge variant={st.variant} size="sm">{st.label}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

