import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  Gift,
  RotateCcw,
  Download,
  ExternalLink,
  AlertCircle,
  Lock,
} from "lucide-react";
import type {
  AdminReferralRecord,
  ReferralOverviewKpis,
  ReferralRewardStatus,
  ReferralRolePermissions,
} from "../../types/referralManagement.types";
import { Badge } from "../common/Badge";
import {
  formatDateTime,
  formatReferralPoints,
  getRewardStatusMeta,
} from "./referralUiUtils";
import { exportReferralRewardsCsv } from "../../data/referralManagementDataService";

interface ReferralRewardsSectionProps {
  kpis: ReferralOverviewKpis;
  referrals: AdminReferralRecord[];
  permissions: ReferralRolePermissions;
  onInspectReferral: (ref: AdminReferralRecord) => void;
  onIssueReward: (referralId: string, notes: string) => { success: boolean; error?: string };
  onReverseReward: (referralId: string, reason: string) => { success: boolean; error?: string };
  onExportToast: (msg: string) => void;
}

export const ReferralRewardsSection: React.FC<ReferralRewardsSectionProps> = ({
  kpis,
  referrals,
  permissions,
  onInspectReferral,
  onIssueReward,
  onReverseReward,
  onExportToast,
}) => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<"all" | ReferralRewardStatus>("all");
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const filtered = referrals.filter(
    (r) => statusFilter === "all" || r.rewardStatus === statusFilter
  );

  const rejectedRewardsCount = referrals.filter((r) => r.rewardStatus === "rejected").length;

  const handleIssue = (r: AdminReferralRecord) => {
    setErrorBanner(null);
    const res = onIssueReward(
      r.id,
      r.rewardStatus === "failed"
        ? "Retry Connection Points ledger credit after timeout"
        : "Approved qualified OTP referral reward issuance"
    );
    if (!res.success && res.error) setErrorBanner(res.error);
  };

  const handleReverse = (r: AdminReferralRecord) => {
    setErrorBanner(null);
    const res = onReverseReward(r.id, "Administrative reversal via Referral Rewards ledger");
    if (!res.success && res.error) setErrorBanner(res.error);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Reward Summary Strip */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "16px 18px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            marginBottom: "14px",
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
                Referral Rewards &amp; Connection Points Issuance
              </h3>
              <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                Synchronized directly with Wallet &amp; Financial Management&apos;s Connection Points ledger (Referrer Only, non-cash)
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => navigate("/wallet")}
              style={{
                padding: "7px 12px",
                borderRadius: "9px",
                border: "1px solid var(--border)",
                background: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span>Open Wallet Ledger</span>
              <ExternalLink size={12} />
            </button>
            <button
              type="button"
              onClick={() => {
                exportReferralRewardsCsv(filtered);
                onExportToast(`Exported ${filtered.length} Connection Points reward records.`);
              }}
              style={{
                padding: "7px 12px",
                borderRadius: "9px",
                border: "none",
                background: "var(--primary)",
                color: "#fff",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Download size={13} />
              <span>Export Rewards</span>
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))",
            gap: "10px",
          }}
        >
          <div style={{ padding: "11px", borderRadius: "11px", background: "var(--bg-surface-elevated)" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Points Issued (Referrals)</div>
            <div style={{ fontSize: "1.12rem", fontWeight: 800, color: "var(--accent-lavender)", marginTop: "2px" }}>
              {formatReferralPoints(kpis.totalPointsIssued)}
            </div>
          </div>
          <div style={{ padding: "11px", borderRadius: "11px", background: "var(--bg-surface-elevated)" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Eligible Pending Release</div>
            <div style={{ fontSize: "1.12rem", fontWeight: 800, color: "var(--status-info)", marginTop: "2px" }}>
              {kpis.eligibleRewardsCount} Ready
            </div>
          </div>
          <div style={{ padding: "11px", borderRadius: "11px", background: "var(--bg-surface-elevated)" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Failed Issuance Attempts</div>
            <div style={{ fontSize: "1.12rem", fontWeight: 800, color: "var(--status-error)", marginTop: "2px" }}>
              {kpis.failedRewardIssuanceCount} Failed
            </div>
          </div>
          <div style={{ padding: "11px", borderRadius: "11px", background: "var(--bg-surface-elevated)" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Rejected Reward Claims</div>
            <div style={{ fontSize: "1.12rem", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>
              {rejectedRewardsCount} Blocked
            </div>
          </div>
          <div style={{ padding: "11px", borderRadius: "11px", background: "var(--bg-surface-elevated)" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Reversed Rewards</div>
            <div style={{ fontSize: "1.12rem", fontWeight: 800, color: "var(--text-secondary)", marginTop: "2px" }}>
              {kpis.reversedRewardsCount} Reversed
            </div>
          </div>
        </div>
      </div>

      {errorBanner && (
        <div
          style={{
            background: "var(--status-error-bg)",
            border: "1px solid var(--status-error)",
            borderRadius: "12px",
            padding: "11px 15px",
            color: "var(--status-error)",
            fontSize: "0.82rem",
            fontWeight: 600,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertCircle size={16} />
            <span>{errorBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorBanner(null)}
            style={{ background: "none", border: "none", color: "var(--status-error)", fontWeight: 700, cursor: "pointer" }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Tabs + Ledger Table */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "18px",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginBottom: "14px" }}>
          {(["all", "eligible", "issued", "failed", "pending", "rejected", "reversed"] as const).map(
            (st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "999px",
                  border: statusFilter === st ? "1px solid var(--primary)" : "1px solid var(--border)",
                  background: statusFilter === st ? "var(--primary-glow)" : "var(--bg-surface-elevated)",
                  color: statusFilter === st ? "var(--primary)" : "var(--text-secondary)",
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

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.81rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)", textAlign: "left" }}>
                <th style={{ padding: "10px 8px" }}>Reward / Referral</th>
                <th style={{ padding: "10px 8px" }}>Referrer Recipient</th>
                <th style={{ padding: "10px 8px" }}>Referred Friend (0 Pts)</th>
                <th style={{ padding: "10px 8px" }}>Amount &amp; Type</th>
                <th style={{ padding: "10px 8px" }}>Status</th>
                <th style={{ padding: "10px 8px" }}>Ledger Ref / Timestamp</th>
                <th style={{ padding: "10px 8px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const rw = getRewardStatusMeta(r.rewardStatus);
                return (
                  <tr
                    key={r.id}
                    onClick={() => onInspectReferral(r)}
                    style={{ borderBottom: "1px solid var(--border-light)", cursor: "pointer" }}
                  >
                    <td style={{ padding: "11px 8px" }}>
                      <div style={{ fontWeight: 700, color: "var(--primary)" }}>{r.walletRewardId || `RW-${r.id}`}</div>
                      <div style={{ fontSize: "0.71rem", color: "var(--text-muted)" }}>Referral: {r.id}</div>
                    </td>
                    <td style={{ padding: "11px 8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <img src={r.referrer.avatar} alt={r.referrer.name} style={{ width: "26px", height: "26px", borderRadius: "50%", objectFit: "cover" }} />
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{r.referrer.name}</div>
                          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{r.referrer.username}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "11px 8px", color: "var(--text-secondary)" }}>{r.referredUser.name}</td>
                    <td style={{ padding: "11px 8px" }}>
                      <div style={{ fontWeight: 800, color: "var(--accent-lavender)" }}>
                        +{formatReferralPoints(r.rewardAmount)}
                      </div>
                      <div style={{ fontSize: "0.69rem", color: "var(--text-muted)" }}>Connection Points Only</div>
                    </td>
                    <td style={{ padding: "11px 8px" }}>
                      <Badge variant={rw.variant} size="sm">{rw.label}</Badge>
                      {r.rewardFailureReason && (
                        <div style={{ fontSize: "0.7rem", color: "var(--status-error)", marginTop: "3px", maxWidth: "220px" }}>
                          {r.rewardFailureReason}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "11px 8px", color: "var(--text-secondary)" }}>
                      <div style={{ fontWeight: 600 }}>{r.rewardTransactionId || "--"}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                        {formatDateTime(r.rewardIssuedAt || r.qualificationDate || r.createdAt)}
                      </div>
                    </td>
                    <td style={{ padding: "11px 8px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px" }}>
                        {(r.rewardStatus === "eligible" || r.rewardStatus === "failed") &&
                          (permissions.canApproveEligibleRewardIssuance ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleIssue(r);
                              }}
                              style={{
                                padding: "6px 10px",
                                borderRadius: "8px",
                                border: "none",
                                background: "var(--status-success)",
                                color: "#fff",
                                fontSize: "0.74rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <Gift size={12} />
                              <span>{r.rewardStatus === "failed" ? "Retry Issue" : "Issue Points"}</span>
                            </button>
                          ) : (
                            <Badge variant="neutral" size="sm">
                              <Lock size={10} /> Role Restricted
                            </Badge>
                          ))}

                        {r.rewardStatus === "issued" && permissions.canRejectReferrals && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReverse(r);
                            }}
                            style={{
                              padding: "5px 9px",
                              borderRadius: "8px",
                              border: "1px solid var(--border)",
                              background: "var(--bg-surface-elevated)",
                              color: "var(--text-secondary)",
                              fontSize: "0.74rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <RotateCcw size={12} />
                            <span>Reverse</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

