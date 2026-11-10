import React, { useState } from "react";
import { XCircle, RotateCcw, Search } from "lucide-react";
import type {
  AdminReferralRecord,
  ReferralRejectionReason,
  ReferralRolePermissions,
} from "../../types/referralManagement.types";
import { Badge } from "../common/Badge";
import { formatDateTime } from "./referralUiUtils";

interface RejectedReferralsSectionProps {
  referrals: AdminReferralRecord[];
  permissions: ReferralRolePermissions;
  onInspectReferral: (ref: AdminReferralRecord) => void;
  onRequestReconsider: (ref: AdminReferralRecord) => void;
}

export const RejectedReferralsSection: React.FC<
  RejectedReferralsSectionProps
> = ({ referrals, permissions, onInspectReferral, onRequestReconsider }) => {
  const [reasonFilter, setReasonFilter] = useState<"all" | ReferralRejectionReason>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const rejected = referrals.filter((r) => r.status === "rejected");
  const filtered = rejected.filter((r) => {
    const matchReason = reasonFilter === "all" || r.rejectionReason === reasonFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      r.id.toLowerCase().includes(q) ||
      r.referrer.name.toLowerCase().includes(q) ||
      r.referredUser.name.toLowerCase().includes(q) ||
      (r.rejectionSummary || "").toLowerCase().includes(q);
    return matchReason && matchQuery;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
              background: "var(--status-error-bg)",
              color: "var(--status-error)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <XCircle size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>
              Rejected Referrals Registry ({filtered.length})
            </h3>
            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
              Audited rejections due to self-referral, duplicate claims, invalid attribution, or fraud review. Reconsideration re-opens to Pending without auto-issuing points.
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "18px",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "space-between", marginBottom: "14px" }}>
          <div style={{ position: "relative", minWidth: "220px" }}>
            <Search
              size={14}
              style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rejected referrals..."
              style={{
                width: "100%",
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-main)",
                borderRadius: "9px",
                padding: "7px 10px 7px 31px",
                fontSize: "0.8rem",
              }}
            />
          </div>

          <select
            value={reasonFilter}
            onChange={(e) =>
              setReasonFilter(e.target.value as "all" | ReferralRejectionReason)
            }
            style={{
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-main)",
              borderRadius: "9px",
              padding: "7px 10px",
              fontSize: "0.8rem",
            }}
          >
            <option value="all">All Rejection Reasons</option>
            <option value="Self-Referral">Self-Referral</option>
            <option value="Duplicate Referral">Duplicate Referral</option>
            <option value="Invalid Referral Attribution">Invalid Referral Attribution</option>
            <option value="Fraudulent Activity">Fraudulent Activity</option>
            <option value="Duplicate Reward Claim">Duplicate Reward Claim</option>
            <option value="Invalid Account">Invalid Account</option>
            <option value="Qualification Not Satisfied">Qualification Not Satisfied</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.81rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)", textAlign: "left" }}>
                <th style={{ padding: "10px 8px" }}>Referral ID</th>
                <th style={{ padding: "10px 8px" }}>Referrer &amp; Code</th>
                <th style={{ padding: "10px 8px" }}>Referred Account</th>
                <th style={{ padding: "10px 8px" }}>Rejection Reason</th>
                <th style={{ padding: "10px 8px" }}>Previous Status</th>
                <th style={{ padding: "10px 8px" }}>Rejected Date / Actor</th>
                <th style={{ padding: "10px 8px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => onInspectReferral(r)}
                  style={{ borderBottom: "1px solid var(--border-light)", cursor: "pointer" }}
                >
                  <td style={{ padding: "11px 8px", fontWeight: 700, color: "var(--primary)" }}>{r.id}</td>
                  <td style={{ padding: "11px 8px" }}>
                    <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{r.referrer.name}</div>
                    <code style={{ fontSize: "0.71rem", color: "var(--text-muted)" }}>{r.referralCode}</code>
                  </td>
                  <td style={{ padding: "11px 8px", color: "var(--text-main)" }}>
                    {r.referredUser.name} <span style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>({r.referredUser.username})</span>
                  </td>
                  <td style={{ padding: "11px 8px", maxWidth: "260px" }}>
                    <Badge variant="error" size="sm">{r.rejectionReason || "Rejected"}</Badge>
                    <div style={{ fontSize: "0.73rem", color: "var(--text-secondary)", marginTop: "3px" }}>
                      {r.rejectionSummary}
                    </div>
                  </td>
                  <td style={{ padding: "11px 8px" }}>
                    <Badge variant="neutral" size="sm">
                      {(r.previousStatus || "pending").toUpperCase()}
                    </Badge>
                  </td>
                  <td style={{ padding: "11px 8px", color: "var(--text-secondary)" }}>
                    <div>{formatDateTime(r.rejectedAt || r.lastActivityAt)}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>By: {r.rejectedBy || "System"}</div>
                  </td>
                  <td style={{ padding: "11px 8px", textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                      {permissions.canReviewFraudAlerts && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRequestReconsider(r);
                          }}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "8px",
                            border: "1px solid var(--border)",
                            background: "var(--bg-surface-elevated)",
                            color: "var(--text-main)",
                            fontSize: "0.74rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <RotateCcw size={12} />
                          <span>Reconsider</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)" }}>
                    No rejected referrals match your search filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

