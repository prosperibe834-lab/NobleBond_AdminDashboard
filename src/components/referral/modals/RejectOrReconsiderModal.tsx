import React, { useState } from "react";
import { XCircle, RotateCcw, X } from "lucide-react";
import type {
  AdminReferralRecord,
  ReferralRejectionReason,
} from "../../../types/referralManagement.types";

interface RejectOrReconsiderModalProps {
  mode: "reject" | "reconsider";
  referral: AdminReferralRecord;
  onCancel: () => void;
  onConfirmReject: (
    referralId: string,
    reason: ReferralRejectionReason,
    summary: string
  ) => void;
  onConfirmReconsider: (referralId: string, summary: string) => void;
}

export const RejectOrReconsiderModal: React.FC<
  RejectOrReconsiderModalProps
> = ({
  mode,
  referral,
  onCancel,
  onConfirmReject,
  onConfirmReconsider,
}) => {
  const [reasonCategory, setReasonCategory] =
    useState<ReferralRejectionReason>("Qualification Not Satisfied");
  const [summary, setSummary] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (summary.trim().length < 5) return;
    if (mode === "reject") {
      onConfirmReject(referral.id, reasonCategory, summary.trim());
    } else {
      onConfirmReconsider(referral.id, summary.trim());
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 102,
        background: "rgba(0, 0, 0, 0.62)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onCancel}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "18px",
          padding: "22px",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {mode === "reject" ? (
              <XCircle size={20} style={{ color: "var(--status-error)" }} />
            ) : (
              <RotateCcw size={20} style={{ color: "var(--primary)" }} />
            )}
            <h3 style={{ margin: 0, fontSize: "1.02rem", fontWeight: 700, color: "var(--text-main)" }}>
              {mode === "reject"
                ? `Reject Referral ${referral.id}`
                : `Reconsider Referral ${referral.id}`}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: "10px 12px", borderRadius: "10px", background: "var(--bg-surface-elevated)", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
          Referrer: <strong>{referral.referrer.name}</strong> -&gt; Referred: <strong>{referral.referredUser.name}</strong>
          <div style={{ fontSize: "0.73rem", color: "var(--text-muted)", marginTop: "4px" }}>
            {mode === "reject"
              ? "Rejecting prevents Connection Points issuance and writes to the immutable Referral Audit History."
              : "Reconsideration re-opens this referral ONLY to Pending status. It never automatically issues Connection Points without OTP verification & validation."}
          </div>
        </div>

        {mode === "reject" && (
          <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-main)" }}>
            Rejection Category
            <select
              value={reasonCategory}
              onChange={(e) =>
                setReasonCategory(e.target.value as ReferralRejectionReason)
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
              <option value="Self-Referral">Self-Referral</option>
              <option value="Duplicate Referral">Duplicate Referral</option>
              <option value="Invalid Referral Attribution">Invalid Referral Attribution</option>
              <option value="Fraudulent Activity">Fraudulent Activity</option>
              <option value="Duplicate Reward Claim">Duplicate Reward Claim</option>
              <option value="Invalid Account">Invalid Account</option>
              <option value="Qualification Not Satisfied">Qualification Not Satisfied</option>
              <option value="Other">Other</option>
            </select>
          </label>
        )}

        <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-main)" }}>
          Mandatory Explanation
          <textarea
            rows={3}
            required
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Document exact justification (min 5 characters)..."
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

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={onCancel}
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
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              background: mode === "reject" ? "var(--status-error)" : "var(--primary)",
              color: "#fff",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {mode === "reject" ? "Confirm Rejection" : "Re-open to Pending"}
          </button>
        </div>
      </form>
    </div>
  );
};

