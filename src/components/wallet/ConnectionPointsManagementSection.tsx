import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  Sparkles,
  Users,
  ExternalLink,
  CheckCircle2,
  ShieldCheck,
  Sliders,
} from "lucide-react";
import type {
  ConnectionPointsRedemptionRecord,
  ConnectionPointsRewardRecord,
  UnifiedFinancialTransaction,
  WalletOverviewKpis,
  WalletTabKey,
} from "../../types/walletManagement.types";
import { Badge } from "../common/Badge";
import {
  formatDateTime,
  formatPoints,
  getRewardStatusMeta,
} from "./walletUiUtils";
import { NOBLEBOND_POINTS_PERKS } from "../../data/walletManagementDataService";

interface ConnectionPointsManagementSectionProps {
  kpis: WalletOverviewKpis;
  rewards: ConnectionPointsRewardRecord[];
  redemptions: ConnectionPointsRedemptionRecord[];
  referralPointsAmount: number;
  canUpdateConfig: boolean;
  onUpdateReferralPoints: (points: number, reason: string) => void;
  onNavigateTab: (tab: WalletTabKey) => void;
  onInspectTransaction: (tx: UnifiedFinancialTransaction) => void;
}

export const ConnectionPointsManagementSection: React.FC<
  ConnectionPointsManagementSectionProps
> = ({
  kpis,
  rewards,
  redemptions,
  referralPointsAmount,
  canUpdateConfig,
  onUpdateReferralPoints,
  onNavigateTab,
  onInspectTransaction,
}) => {
  const navigate = useNavigate();
  const [editingRule, setEditingRule] = useState(false);
  const [draftPoints, setDraftPoints] = useState(String(referralPointsAmount));
  const [draftReason, setDraftReason] = useState("Updated referral reward incentive configuration");
  const [activeList, setActiveList] = useState<"issuance" | "redemptions">("issuance");

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(draftPoints);
    if (!Number.isFinite(parsed) || parsed < 10 || parsed > 500) return;
    onUpdateReferralPoints(parsed, draftReason.trim() || "Configured referral reward rate");
    setEditingRule(false);
  };

  const toRewardTx = (r: ConnectionPointsRewardRecord): UnifiedFinancialTransaction => ({
    id: r.rewardTransactionRef || r.id,
    category: "connection_points",
    transactionType: "connection_points_referral",
    title: `Referral Reward: ${r.referredUserName} (${r.pointsAmount} Pts)`,
    userId: r.referrerUserId,
    userName: r.referrerName,
    username: r.referrerUsername,
    userAvatar: r.referrerAvatar,
    isMonetary: false,
    virtualQuantity: r.pointsAmount,
    virtualUnit: "POINTS",
    direction: "credit",
    referenceId: r.referralId,
    relatedServiceLabel: `Referral Program (${r.referralCode})`,
    relatedEntityId: r.referralId,
    timestamp: r.issuedAt || r.createdAt,
    status: r.issuanceStatus === "issued" ? "completed" : r.issuanceStatus === "rejected" ? "failed" : "pending",
    notes: r.notes,
  });

  const toRedemptionTx = (r: ConnectionPointsRedemptionRecord): UnifiedFinancialTransaction => ({
    id: r.id,
    category: "connection_points",
    transactionType: "connection_points_redemption",
    title: `Perk Redemption: ${r.perkTitle}`,
    userId: r.userId,
    userName: r.userName,
    username: r.username,
    userAvatar: r.userAvatar,
    isMonetary: false,
    virtualQuantity: r.pointsSpent,
    virtualUnit: "POINTS",
    direction: "debit",
    previousBalance: r.previousPointsBalance,
    newBalance: r.newPointsBalance,
    referenceId: r.relatedActivityRef,
    relatedServiceLabel: "In-App Connection Points Perk",
    timestamp: r.timestamp,
    status: r.status === "reversed" ? "reversed" : "completed",
    notes: `${r.perkTitle} redeemed for ${r.pointsSpent} Connection Points`,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {/* Connection Points Summary & Referral Rule Panel */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "16px",
        }}
      >
        {/* Left: Overview & Perks Catalog */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "18px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
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
                <h3 style={{ margin: 0, fontSize: "0.98rem", fontWeight: 700, color: "var(--text-main)" }}>
                  Supported Connection Points Perks
                </h3>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Exact non-cash dating visibility & matching benefits
                </div>
              </div>
            </div>
            <Badge variant="info" size="sm">Non-Cash</Badge>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "10px",
              marginBottom: "14px",
            }}
          >
            {NOBLEBOND_POINTS_PERKS.map((perk) => (
              <div
                key={perk.id}
                style={{
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "12px",
                  padding: "12px",
                }}
              >
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)" }}>{perk.title}</div>
                <div style={{ fontSize: "1.08rem", fontWeight: 800, color: "var(--accent-lavender)", marginTop: "4px" }}>
                  {perk.pointsCost} Pts
                </div>
                <div style={{ fontSize: "0.71rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  Key: {perk.id}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", borderRadius: "10px", background: "var(--bg-surface-elevated)", fontSize: "0.8rem" }}>
            <span style={{ color: "var(--text-secondary)" }}>Total Points Circulating / Redeemed:</span>
            <strong style={{ color: "var(--text-main)" }}>
              {formatPoints(kpis.totalPointsCirculating)} / {formatPoints(kpis.totalPointsRedeemed)}
            </strong>
          </div>
        </div>

        {/* Right: Referral Reward Program Settings */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "18px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ShieldCheck size={18} style={{ color: "var(--accent-lavender)" }} />
                <span style={{ fontSize: "0.98rem", fontWeight: 700, color: "var(--text-main)" }}>
                  Referral Reward Rule & Qualification
                </span>
              </div>
              {canUpdateConfig && !editingRule && (
                <button
                  type="button"
                  onClick={() => {
                    setDraftPoints(String(referralPointsAmount));
                    setEditingRule(true);
                  }}
                  style={{
                    background: "var(--bg-surface-elevated)",
                    border: "1px solid var(--border)",
                    color: "var(--text-main)",
                    borderRadius: "8px",
                    padding: "5px 10px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <Sliders size={13} />
                  <span>Configure Pts</span>
                </button>
              )}
            </div>

            {editingRule ? (
              <form onSubmit={handleSaveRule} style={{ display: "flex", flexDirection: "column", gap: "9px", padding: "12px", borderRadius: "11px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border)" }}>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-main)" }}>
                  Points per Verified Referral (10 - 500 Pts)
                  <input
                    type="number"
                    min={10}
                    max={500}
                    value={draftPoints}
                    onChange={(e) => setDraftPoints(e.target.value)}
                    style={{
                      width: "100%",
                      marginTop: "5px",
                      padding: "8px 10px",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "var(--bg-card)",
                      color: "var(--text-main)",
                      fontSize: "0.86rem",
                    }}
                  />
                </label>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-main)" }}>
                  Audit Change Reason
                  <input
                    type="text"
                    value={draftReason}
                    onChange={(e) => setDraftReason(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      marginTop: "5px",
                      padding: "8px 10px",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "var(--bg-card)",
                      color: "var(--text-main)",
                      fontSize: "0.82rem",
                    }}
                  />
                </label>
                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => setEditingRule(false)}
                    style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", fontSize: "0.78rem", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: "6px 14px", borderRadius: "8px", border: "none", background: "var(--primary)", color: "#fff", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}
                  >
                    Save Rule
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ padding: "12px", borderRadius: "12px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Active Referrer Reward:</span>
                  <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--accent-lavender)" }}>
                    +{referralPointsAmount} Connection Points
                  </span>
                </div>
                <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "8px", lineHeight: 1.5 }}>
                  Awarded ONLY to the referrer after the invited friend signs up using a referral code and completes OTP email or phone verification. Self-referrals and duplicate devices are blocked.
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => onNavigateTab("rewards_issuance")}
              style={{
                flex: 1,
                padding: "9px 12px",
                borderRadius: "10px",
                border: "none",
                background: "var(--primary)",
                color: "#fff",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              <CheckCircle2 size={14} />
              <span>Open Rewards Queue ({kpis.pendingEligibleRewardsCount} Pending)</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/referrals")}
              style={{
                padding: "9px 12px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                background: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Users size={14} />
              <span>Referrals Module</span>
              <ExternalLink size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Issuance & Redemption Records Card */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "18px",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
          <button
            type="button"
            onClick={() => setActiveList("issuance")}
            style={{
              padding: "8px 14px",
              borderRadius: "10px",
              border: activeList === "issuance" ? "1px solid var(--primary)" : "1px solid var(--border)",
              background: activeList === "issuance" ? "var(--primary-glow)" : "var(--bg-surface-elevated)",
              color: activeList === "issuance" ? "var(--primary)" : "var(--text-secondary)",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Award size={14} />
            <span>Referral Issuance History ({rewards.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveList("redemptions")}
            style={{
              padding: "8px 14px",
              borderRadius: "10px",
              border: activeList === "redemptions" ? "1px solid var(--primary)" : "1px solid var(--border)",
              background: activeList === "redemptions" ? "var(--primary-glow)" : "var(--bg-surface-elevated)",
              color: activeList === "redemptions" ? "var(--primary)" : "var(--text-secondary)",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Sparkles size={14} />
            <span>Perk Redemptions ({redemptions.length})</span>
          </button>
        </div>

        {activeList === "issuance" ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)", textAlign: "left" }}>
                  <th style={{ padding: "10px 8px" }}>Reward ID</th>
                  <th style={{ padding: "10px 8px" }}>Referrer</th>
                  <th style={{ padding: "10px 8px" }}>Referred Friend</th>
                  <th style={{ padding: "10px 8px" }}>OTP Status</th>
                  <th style={{ padding: "10px 8px" }}>Points</th>
                  <th style={{ padding: "10px 8px" }}>Issuance Status</th>
                  <th style={{ padding: "10px 8px" }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {rewards.map((r) => {
                  const st = getRewardStatusMeta(r.issuanceStatus);
                  return (
                    <tr
                      key={r.id}
                      onClick={() => onInspectTransaction(toRewardTx(r))}
                      style={{ borderBottom: "1px solid var(--border-light)", cursor: "pointer" }}
                    >
                      <td style={{ padding: "11px 8px", fontWeight: 700, color: "var(--primary)" }}>{r.id}</td>
                      <td style={{ padding: "11px 8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <img src={r.referrerAvatar} alt={r.referrerName} style={{ width: "26px", height: "26px", borderRadius: "50%", objectFit: "cover" }} />
                          <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{r.referrerName}</span>
                        </div>
                      </td>
                      <td style={{ padding: "11px 8px", color: "var(--text-main)" }}>
                        {r.referredUserName} <span style={{ color: "var(--text-muted)", fontSize: "0.74rem" }}>({r.referralCode})</span>
                      </td>
                      <td style={{ padding: "11px 8px" }}>
                        <Badge
                          variant={r.verificationStatus === "unverified" ? "warning" : "success"}
                          size="sm"
                        >
                          {r.verificationStatus.replace("_", " ").toUpperCase()}
                        </Badge>
                      </td>
                      <td style={{ padding: "11px 8px", fontWeight: 800, color: "var(--accent-lavender)" }}>
                        +{formatPoints(r.pointsAmount)}
                      </td>
                      <td style={{ padding: "11px 8px" }}>
                        <Badge variant={st.variant} size="sm">{st.label}</Badge>
                      </td>
                      <td style={{ padding: "11px 8px", color: "var(--text-secondary)" }}>
                        {formatDateTime(r.issuedAt || r.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)", textAlign: "left" }}>
                  <th style={{ padding: "10px 8px" }}>Redemption ID</th>
                  <th style={{ padding: "10px 8px" }}>Member</th>
                  <th style={{ padding: "10px 8px" }}>Perk Activated</th>
                  <th style={{ padding: "10px 8px" }}>Points Used</th>
                  <th style={{ padding: "10px 8px" }}>Balance Diff</th>
                  <th style={{ padding: "10px 8px" }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {redemptions.map((rdm) => (
                  <tr
                    key={rdm.id}
                    onClick={() => onInspectTransaction(toRedemptionTx(rdm))}
                    style={{ borderBottom: "1px solid var(--border-light)", cursor: "pointer" }}
                  >
                    <td style={{ padding: "11px 8px", fontWeight: 700, color: "var(--primary)" }}>{rdm.id}</td>
                    <td style={{ padding: "11px 8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <img src={rdm.userAvatar} alt={rdm.userName} style={{ width: "26px", height: "26px", borderRadius: "50%", objectFit: "cover" }} />
                        <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{rdm.userName}</span>
                      </div>
                    </td>
                    <td style={{ padding: "11px 8px", fontWeight: 600, color: "var(--text-main)" }}>{rdm.perkTitle}</td>
                    <td style={{ padding: "11px 8px", fontWeight: 800, color: "var(--accent-lavender)" }}>
                      -{formatPoints(rdm.pointsSpent)}
                    </td>
                    <td style={{ padding: "11px 8px", color: "var(--text-secondary)" }}>
                      {rdm.previousPointsBalance} Pts -&gt; {rdm.newPointsBalance} Pts
                    </td>
                    <td style={{ padding: "11px 8px", color: "var(--text-secondary)" }}>{formatDateTime(rdm.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

