import React from "react";
import { X, RotateCcw, SlidersHorizontal } from "lucide-react";
import type {
  AdminReferralRecord,
  ReferralFilterState,
} from "../../types/referralManagement.types";

interface ReferralFilterDrawerProps {
  isOpen: boolean;
  filters: ReferralFilterState;
  referrals: AdminReferralRecord[];
  onUpdateFilters: (next: ReferralFilterState) => void;
  onResetFilters: () => void;
  onClose: () => void;
}

export const ReferralFilterDrawer: React.FC<ReferralFilterDrawerProps> = ({
  isOpen,
  filters,
  referrals,
  onUpdateFilters,
  onResetFilters,
  onClose,
}) => {
  if (!isOpen) return null;

  const uniqueReferrers = Array.from(
    new Map(
      referrals.map((r) => [r.referrer.userId, r.referrer])
    ).values()
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 90,
        background: "rgba(0, 0, 0, 0.54)",
        display: "flex",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "390px",
          height: "100%",
          background: "var(--bg-card)",
          borderLeft: "1px solid var(--border)",
          padding: "22px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflowY: "auto",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <SlidersHorizontal size={18} style={{ color: "var(--primary)" }} />
              <h3 style={{ margin: 0, fontSize: "1.02rem", fontWeight: 700, color: "var(--text-main)" }}>
                Referral Ledger Filters
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
                borderRadius: "8px",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={16} />
            </button>
          </div>

          <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.79rem", fontWeight: 600, color: "var(--text-main)" }}>
            Primary Referral Status
            <select
              value={filters.status}
              onChange={(e) =>
                onUpdateFilters({ ...filters, status: e.target.value as ReferralFilterState["status"] })
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
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="successful">Successful</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.79rem", fontWeight: 600, color: "var(--text-main)" }}>
            Qualification State
            <select
              value={filters.qualificationStatus}
              onChange={(e) =>
                onUpdateFilters({
                  ...filters,
                  qualificationStatus: e.target.value as ReferralFilterState["qualificationStatus"],
                })
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
              <option value="all">All Qualification States</option>
              <option value="qualified">Qualified</option>
              <option value="awaiting_email_verification">Awaiting Email Verification</option>
              <option value="awaiting_phone_verification">Awaiting Phone Verification</option>
              <option value="awaiting_either_verification">Awaiting Either Verification</option>
              <option value="awaiting_validation">Awaiting Backend Validation</option>
              <option value="under_review">Under Review</option>
              <option value="ineligible_self_referral">Ineligible (Self-Referral)</option>
              <option value="ineligible_fraud">Ineligible (Fraud / Abuse)</option>
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.79rem", fontWeight: 600, color: "var(--text-main)" }}>
            Reward Issuance Status
            <select
              value={filters.rewardStatus}
              onChange={(e) =>
                onUpdateFilters({
                  ...filters,
                  rewardStatus: e.target.value as ReferralFilterState["rewardStatus"],
                })
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
              <option value="all">All Reward Statuses</option>
              <option value="pending">Pending</option>
              <option value="eligible">Eligible (Unissued)</option>
              <option value="issued">Issued</option>
              <option value="failed">Failed</option>
              <option value="rejected">Rejected</option>
              <option value="reversed">Reversed</option>
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.79rem", fontWeight: 600, color: "var(--text-main)" }}>
            OTP Verification Status
            <select
              value={filters.verificationMethod}
              onChange={(e) =>
                onUpdateFilters({
                  ...filters,
                  verificationMethod: e.target.value as ReferralFilterState["verificationMethod"],
                })
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
              <option value="all">All Verification Methods</option>
              <option value="email">Email OTP Verified</option>
              <option value="phone">Phone OTP Verified</option>
              <option value="both">Both Email &amp; Phone Verified</option>
              <option value="unverified">Unverified (No OTP Completed)</option>
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.79rem", fontWeight: 600, color: "var(--text-main)" }}>
            Filter by Referrer
            <select
              value={filters.referrerId}
              onChange={(e) =>
                onUpdateFilters({ ...filters, referrerId: e.target.value })
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
              <option value="all">All Referrers</option>
              {uniqueReferrers.map((rf) => (
                <option key={rf.userId} value={rf.userId}>
                  {rf.name} ({rf.username})
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.79rem", fontWeight: 600, color: "var(--text-main)" }}>
            Fraud Review Filter
            <select
              value={filters.fraudReviewFilter}
              onChange={(e) =>
                onUpdateFilters({
                  ...filters,
                  fraudReviewFilter: e.target.value as ReferralFilterState["fraudReviewFilter"],
                })
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
              <option value="all">All Records</option>
              <option value="flagged_only">Has Quality / Fraud Signal</option>
              <option value="clean_only">Clean Records Only</option>
            </select>
          </label>
        </div>

        <div style={{ display: "flex", gap: "10px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
          <button
            type="button"
            onClick={onResetFilters}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--bg-surface-elevated)",
              color: "var(--text-main)",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <RotateCcw size={14} />
            <span>Reset Filters</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              background: "var(--primary)",
              color: "#fff",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

