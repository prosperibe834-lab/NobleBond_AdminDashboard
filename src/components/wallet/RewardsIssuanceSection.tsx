import React, { useState } from "react";
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import type {
  ConnectionPointsRewardRecord,
  FinancialRolePermissions,
  RewardIssuanceStatus,
} from "../../types/walletManagement.types";
import { Badge } from "../common/Badge";
import { formatDateTime, formatPoints, getRewardStatusMeta } from "./walletUiUtils";

interface RewardsIssuanceSectionProps {
  rewards: ConnectionPointsRewardRecord[];
  permissions: FinancialRolePermissions;
  onProcessReward: (
    rewardId: string,
    action: "issue" | "reject" | "reverse",
    notes: string
  ) => { success: boolean; error?: string };
}

export const RewardsIssuanceSection: React.FC<RewardsIssuanceSectionProps> = ({
  rewards,
  permissions,
  onProcessReward,
}) => {
  const [statusFilter, setStatusFilter] = useState<"all" | RewardIssuanceStatus>("all");
  const [actionNotes, setActionNotes] = useState<Record<string, string>>({});
  const [validationAlert, setValidationAlert] = useState<string | null>(null);

  const filtered = rewards.filter(
    (r) => statusFilter === "all" || r.issuanceStatus === statusFilter
  );

  const handleAction = (
    rewardId: string,
    action: "issue" | "reject" | "reverse"
  ) => {
    setValidationAlert(null);
    const note =
      actionNotes[rewardId]?.trim() ||
      (action === "issue"
        ? "Verified OTP & non-self-referral check passed"
        : action === "reject"
        ? "Rejected referral claim per compliance screening"
        : "Reversed issued Connection Points reward");
    const result = onProcessReward(rewardId, action, note);
    if (!result.success && result.error) {
      setValidationAlert(result.error);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header & Rule Guard */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "16px 18px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "var(--accent-lavender-bg)",
              color: "var(--accent-lavender)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Award size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>
              Referral & Reward Operations Queue ({filtered.length})
            </h3>
            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
              Requires verified OTP email/phone on referred user and blocks self-referral or duplicate accounts
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {(["all", "eligible", "pending", "issued", "rejected", "reversed"] as const).map(
            (st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: "6px 11px",
                  borderRadius: "999px",
                  border:
                    statusFilter === st
                      ? "1px solid var(--primary)"
                      : "1px solid var(--border)",
                  background:
                    statusFilter === st
                      ? "var(--primary-glow)"
                      : "var(--bg-surface-elevated)",
                  color:
                    statusFilter === st ? "var(--primary)" : "var(--text-secondary)",
                  fontSize: "0.76rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {st}
              </button>
            )
          )}
        </div>
      </div>

      {validationAlert && (
        <div
          style={{
            background: "var(--status-error-bg)",
            border: "1px solid var(--status-error)",
            borderRadius: "12px",
            padding: "12px 16px",
            color: "var(--status-error)",
            fontSize: "0.84rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ShieldAlert size={17} />
            <span>{validationAlert}</span>
          </div>
          <button
            type="button"
            onClick={() => setValidationAlert(null)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--status-error)",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: "14px" }}>
        {filtered.map((r) => {
          const stMeta = getRewardStatusMeta(r.issuanceStatus);
          const blockedReason = r.isSelfReferral
            ? "Self-Referral Blocked"
            : r.isDuplicateOrFraud
            ? "Duplicate / Fraud Risk"
            : r.verificationStatus === "unverified"
            ? "Awaiting OTP Verification"
            : null;

          return (
            <div
              key={r.id}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "15px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--primary)" }}>
                    {r.id} • {r.referralId}
                  </span>
                  <Badge variant={stMeta.variant} size="sm">{stMeta.label}</Badge>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <img
                    src={r.referrerAvatar}
                    alt={r.referrerName}
                    style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-main)" }}>
                      Referrer: {r.referrerName}
                    </div>
                    <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                      Invited: {r.referredUserName} (@{r.referredUsername}) • Code {r.referralCode}
                    </div>
                  </div>
                  <div style={{ fontSize: "1.02rem", fontWeight: 800, color: "var(--accent-lavender)" }}>
                    +{formatPoints(r.pointsAmount)}
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
                  <Badge
                    variant={r.verificationStatus === "unverified" ? "warning" : "success"}
                    size="sm"
                  >
                    OTP: {r.verificationStatus.replace("_", " ").toUpperCase()}
                  </Badge>
                  {blockedReason ? (
                    <Badge variant="error" size="sm">{blockedReason}</Badge>
                  ) : (
                    <Badge variant="info" size="sm">Compliance Checks Passed</Badge>
                  )}
                </div>

                <div style={{ fontSize: "0.76rem", color: "var(--text-secondary)", background: "var(--bg-surface-elevated)", padding: "9px 11px", borderRadius: "9px" }}>
                  {r.notes || "Awaiting compliance review."}
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "4px" }}>
                    Created: {formatDateTime(r.createdAt)}
                    {r.issuedAt ? ` | Issued: ${formatDateTime(r.issuedAt)}` : ""}
                  </div>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={actionNotes[r.id] || ""}
                  onChange={(e) =>
                    setActionNotes((prev) => ({ ...prev, [r.id]: e.target.value }))
                  }
                  placeholder="Optional audit note before action..."
                  style={{
                    width: "100%",
                    padding: "7px 10px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "var(--bg-surface-elevated)",
                    color: "var(--text-main)",
                    fontSize: "0.77rem",
                    marginBottom: "8px",
                  }}
                />

                <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                  {r.issuanceStatus !== "issued" && (
                    <button
                      type="button"
                      disabled={!permissions.canIssueConnectionPoints}
                      onClick={() => handleAction(r.id, "issue")}
                      style={{
                        flex: 1,
                        padding: "7px 10px",
                        borderRadius: "8px",
                        border: "none",
                        background: permissions.canIssueConnectionPoints
                          ? "var(--status-success)"
                          : "var(--bg-surface-elevated)",
                        color: permissions.canIssueConnectionPoints ? "#fff" : "var(--text-muted)",
                        fontSize: "0.76rem",
                        fontWeight: 700,
                        cursor: permissions.canIssueConnectionPoints ? "pointer" : "not-allowed",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "5px",
                      }}
                    >
                      <CheckCircle2 size={13} />
                      <span>Issue {r.pointsAmount} Pts</span>
                    </button>
                  )}

                  {(r.issuanceStatus === "pending" || r.issuanceStatus === "eligible") && (
                    <button
                      type="button"
                      disabled={!permissions.canIssueConnectionPoints}
                      onClick={() => handleAction(r.id, "reject")}
                      style={{
                        flex: 1,
                        padding: "7px 10px",
                        borderRadius: "8px",
                        border: "1px solid var(--status-error)",
                        background: "transparent",
                        color: "var(--status-error)",
                        fontSize: "0.76rem",
                        fontWeight: 700,
                        cursor: permissions.canIssueConnectionPoints ? "pointer" : "not-allowed",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "5px",
                      }}
                    >
                      <XCircle size={13} />
                      <span>Reject</span>
                    </button>
                  )}

                  {r.issuanceStatus === "issued" && (
                    <button
                      type="button"
                      disabled={!permissions.canReverseTransactions}
                      onClick={() => handleAction(r.id, "reverse")}
                      style={{
                        flex: 1,
                        padding: "7px 10px",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        background: "var(--bg-surface-elevated)",
                        color: permissions.canReverseTransactions
                          ? "var(--text-main)"
                          : "var(--text-muted)",
                        fontSize: "0.76rem",
                        fontWeight: 700,
                        cursor: permissions.canReverseTransactions ? "pointer" : "not-allowed",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "5px",
                      }}
                    >
                      <RotateCcw size={13} />
                      <span>Reverse Issued Points</span>
                    </button>
                  )}

                  {r.issuanceStatus === "rejected" && (
                    <div style={{ width: "100%", fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "5px", padding: "4px 2px" }}>
                      <ShieldCheck size={13} />
                      <span>Claim blocked & archived in audit history</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

