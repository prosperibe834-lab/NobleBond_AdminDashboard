import React, { useState } from "react";
import { CheckCircle2, Gift, Search } from "lucide-react";
import type {
  AdminReferralRecord,
  ReferralRolePermissions,
} from "../../types/referralManagement.types";
import { Badge } from "../common/Badge";
import {
  formatDateTime,
  formatReferralPoints,
  getRewardStatusMeta,
} from "./referralUiUtils";

interface SuccessfulReferralsSectionProps {
  referrals: AdminReferralRecord[];
  permissions: ReferralRolePermissions;
  onInspectReferral: (ref: AdminReferralRecord) => void;
  onIssueReward: (referralId: string) => void;
}

export const SuccessfulReferralsSection: React.FC<
  SuccessfulReferralsSectionProps
> = ({ referrals, permissions, onInspectReferral, onIssueReward }) => {
  const [rewardFilter, setRewardFilter] = useState<"all" | "issued" | "eligible_unissued">("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const successful = referrals.filter((r) => r.status === "successful");

  const filtered = successful.filter((r) => {
    const matchReward =
      rewardFilter === "all" ||
      (rewardFilter === "issued" && r.rewardStatus === "issued") ||
      (rewardFilter === "eligible_unissued" &&
        (r.rewardStatus === "eligible" || r.rewardStatus === "failed"));
    const matchMethod =
      methodFilter === "all" || r.satisfiedVerificationMethod === methodFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      r.id.toLowerCase().includes(q) ||
      r.referrer.name.toLowerCase().includes(q) ||
      r.referredUser.name.toLowerCase().includes(q) ||
      r.referralCode.toLowerCase().includes(q);
    return matchReward && matchMethod && matchQuery;
  });

  const issuedCount = successful.filter((r) => r.rewardStatus === "issued").length;
  const eligibleUnissuedCount = successful.filter(
    (r) => r.rewardStatus === "eligible" || r.rewardStatus === "failed"
  ).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Summary Header */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "16px 18px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "var(--status-success-bg)",
              color: "var(--status-success)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckCircle2 size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>
              Successful Qualified Referrals ({filtered.length})
            </h3>
            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
              Verified by email or phone OTP + backend validation (distinct from reward wallet crediting)
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Badge variant="success" size="sm">{issuedCount} Qualified &amp; Credited</Badge>
          <Badge variant="info" size="sm">{eligibleUnissuedCount} Qualified — Awaiting Reward Credit</Badge>
        </div>
      </div>

      {/* Filters & Table */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "18px",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {([
              { key: "all", label: "All Qualified" },
              { key: "issued", label: "Reward Issued" },
              { key: "eligible_unissued", label: "Eligible / Failed Credit" },
            ] as const).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setRewardFilter(opt.key)}
                style={{
                  padding: "7px 12px",
                  borderRadius: "999px",
                  border: rewardFilter === opt.key ? "1px solid var(--primary)" : "1px solid var(--border)",
                  background: rewardFilter === opt.key ? "var(--primary-glow)" : "var(--bg-surface-elevated)",
                  color: rewardFilter === opt.key ? "var(--primary)" : "var(--text-secondary)",
                  fontSize: "0.77rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ position: "relative" }}>
              <Search
                size={14}
                style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ID, code, user..."
                style={{
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border)",
                  color: "var(--text-main)",
                  borderRadius: "9px",
                  padding: "7px 10px 7px 31px",
                  fontSize: "0.79rem",
                }}
              />
            </div>

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-main)",
                borderRadius: "9px",
                padding: "7px 10px",
                fontSize: "0.79rem",
              }}
            >
              <option value="all">All Verification Methods</option>
              <option value="email">Email OTP</option>
              <option value="phone">Phone OTP</option>
              <option value="both">Both Email &amp; Phone</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.81rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)", textAlign: "left" }}>
                <th style={{ padding: "10px 8px" }}>Referral ID</th>
                <th style={{ padding: "10px 8px" }}>Referrer</th>
                <th style={{ padding: "10px 8px" }}>Referred User</th>
                <th style={{ padding: "10px 8px" }}>Verification Method</th>
                <th style={{ padding: "10px 8px" }}>Qualification Date</th>
                <th style={{ padding: "10px 8px" }}>Reward</th>
                <th style={{ padding: "10px 8px" }}>Issuance Status &amp; Ref</th>
                <th style={{ padding: "10px 8px", textAlign: "right" }}>Action</th>
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
                      <div style={{ fontWeight: 700, color: "var(--primary)" }}>{r.id}</div>
                      <code style={{ fontSize: "0.71rem", color: "var(--text-muted)" }}>{r.referralCode}</code>
                    </td>
                    <td style={{ padding: "11px 8px", fontWeight: 600, color: "var(--text-main)" }}>{r.referrer.name}</td>
                    <td style={{ padding: "11px 8px", color: "var(--text-main)" }}>{r.referredUser.name}</td>
                    <td style={{ padding: "11px 8px" }}>
                      <Badge variant="success" size="sm">
                        {(r.satisfiedVerificationMethod || "email").toUpperCase()} OTP
                      </Badge>
                    </td>
                    <td style={{ padding: "11px 8px", color: "var(--text-secondary)" }}>
                      {formatDateTime(r.qualificationDate)}
                    </td>
                    <td style={{ padding: "11px 8px", fontWeight: 800, color: "var(--accent-lavender)" }}>
                      +{formatReferralPoints(r.rewardAmount)}
                    </td>
                    <td style={{ padding: "11px 8px" }}>
                      <Badge variant={rw.variant} size="sm">{rw.label}</Badge>
                      {r.rewardTransactionId && (
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>
                          {r.rewardTransactionId} • {formatDateTime(r.rewardIssuedAt)}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "11px 8px", textAlign: "right" }}>
                      {(r.rewardStatus === "eligible" || r.rewardStatus === "failed") &&
                      permissions.canApproveEligibleRewardIssuance ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onIssueReward(r.id);
                          }}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "8px",
                            border: "none",
                            background: "var(--status-success)",
                            color: "#fff",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Gift size={13} />
                          <span>{r.rewardStatus === "failed" ? "Retry Credit" : "Issue Points"}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onInspectReferral(r);
                          }}
                          style={{
                            padding: "5px 9px",
                            borderRadius: "8px",
                            border: "1px solid var(--border)",
                            background: "var(--bg-surface-elevated)",
                            color: "var(--text-main)",
                            fontSize: "0.74rem",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Details
                        </button>
                      )}
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

