import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, ShieldAlert, ExternalLink } from "lucide-react";
import type {
  FraudAlertCaseRecord,
  FraudReviewStatus,
  ReferralRejectionReason,
  ReferralRolePermissions,
} from "../../../types/referralManagement.types";
import { Badge } from "../../common/Badge";
import { getRiskLevelMeta } from "../referralUiUtils";

interface FraudCaseActionModalProps {
  fraudCase: FraudAlertCaseRecord;
  permissions: ReferralRolePermissions;
  onClose: () => void;
  onSaveWorkflow: (
    caseId: string,
    updates: {
      reviewStatus?: FraudReviewStatus;
      assignedAdmin?: string;
      noteText?: string;
      rejectionReason?: ReferralRejectionReason;
    }
  ) => void;
}

export const FraudCaseActionModal: React.FC<FraudCaseActionModalProps> = ({
  fraudCase,
  permissions,
  onClose,
  onSaveWorkflow,
}) => {
  const navigate = useNavigate();
  const [reviewStatus, setReviewStatus] = useState<FraudReviewStatus>(
    fraudCase.reviewStatus
  );
  const [assignedAdmin, setAssignedAdmin] = useState<string>(
    fraudCase.assignedAdmin || ""
  );
  const [rejectionReason, setRejectionReason] = useState<ReferralRejectionReason>(
    "Fraudulent Activity"
  );
  const [noteText, setNoteText] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const riskMeta = getRiskLevelMeta(fraudCase.riskLevel);
  const requiresReason =
    reviewStatus === "cleared" ||
    reviewStatus === "rejected" ||
    reviewStatus === "escalated";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!permissions.canReviewFraudAlerts) return;
    if (requiresReason && noteText.trim().length < 5) {
      setErr("Consequential review actions (Clear, Reject, or Escalate) require a documented justification (min 5 characters).");
      return;
    }
    onSaveWorkflow(fraudCase.id, {
      reviewStatus,
      assignedAdmin: assignedAdmin.trim() || undefined,
      noteText: noteText.trim() || undefined,
      rejectionReason: reviewStatus === "rejected" ? rejectionReason : undefined,
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0, 0, 0, 0.62)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "520px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "18px",
          padding: "22px",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
          gap: "13px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ShieldAlert size={20} style={{ color: "var(--status-warning)" }} />
            <div>
              <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--primary)" }}>
                {fraudCase.id} • Referral {fraudCase.referralId}
              </div>
              <h3 style={{ margin: 0, fontSize: "1.02rem", fontWeight: 700, color: "var(--text-main)" }}>
                Fraud Signal &amp; Quality Investigation
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: "12px", borderRadius: "12px", background: "var(--bg-surface-elevated)", fontSize: "0.8rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <strong style={{ color: "var(--text-main)" }}>{fraudCase.riskIndicatorLabel}</strong>
            <Badge variant={riskMeta.variant} size="sm">{riskMeta.label}</Badge>
          </div>
          <div style={{ color: "var(--text-secondary)", marginBottom: "6px" }}>{fraudCase.reasonFlagged}</div>
          <div style={{ fontSize: "0.73rem", color: "var(--text-muted)" }}>{fraudCase.nonAccusatoryCaveat}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.79rem", fontWeight: 600, color: "var(--text-main)" }}>
            Assigned Investigator
            <select
              disabled={!permissions.canAssignInvestigations}
              value={assignedAdmin}
              onChange={(e) => setAssignedAdmin(e.target.value)}
              style={{ padding: "9px 10px", borderRadius: "9px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)", fontSize: "0.82rem" }}
            >
              <option value="">Unassigned</option>
              <option value="Elena Vance (Current Admin)">Elena Vance (Me)</option>
              <option value="Moderator James">Moderator James</option>
              <option value="Head of Safety David">Head of Safety David</option>
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.79rem", fontWeight: 600, color: "var(--text-main)" }}>
            Review Disposition
            <select
              disabled={!permissions.canReviewFraudAlerts}
              value={reviewStatus}
              onChange={(e) => setReviewStatus(e.target.value as FraudReviewStatus)}
              style={{ padding: "9px 10px", borderRadius: "9px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)", fontSize: "0.82rem" }}
            >
              <option value="pending_review">Pending Review</option>
              <option value="under_investigation">Under Investigation</option>
              <option value="cleared">Cleared (Legitimate Accounts)</option>
              <option value="rejected">Reject Referral Bonus</option>
              <option value="escalated">Escalate to Reports &amp; Moderation</option>
            </select>
          </label>
        </div>

        {reviewStatus === "rejected" && (
          <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.79rem", fontWeight: 600, color: "var(--text-main)" }}>
            Rejection Policy Category
            <select
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value as ReferralRejectionReason)}
              style={{ padding: "9px 10px", borderRadius: "9px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)", fontSize: "0.82rem" }}
            >
              <option value="Fraudulent Activity">Fraudulent Activity</option>
              <option value="Self-Referral">Self-Referral</option>
              <option value="Duplicate Referral">Duplicate Referral</option>
              <option value="Duplicate Reward Claim">Duplicate Reward Claim</option>
              <option value="Invalid Referral Attribution">Invalid Referral Attribution</option>
            </select>
          </label>
        )}

        <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.79rem", fontWeight: 600, color: "var(--text-main)" }}>
          Investigation Note {requiresReason ? "(Required)" : "(Optional)"}
          <textarea
            rows={2}
            disabled={!permissions.canReviewFraudAlerts}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Record identity independence verification, ticket ref, or compliance rationale..."
            style={{ padding: "9px 10px", borderRadius: "9px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)", fontSize: "0.81rem" }}
          />
        </label>

        {err && (
          <div style={{ padding: "9px 11px", borderRadius: "9px", background: "var(--status-error-bg)", color: "var(--status-error)", fontSize: "0.77rem", fontWeight: 600 }}>
            {err}
          </div>
        )}

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate("/moderation");
            }}
            style={{ padding: "9px 11px", borderRadius: "9px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-secondary)", fontSize: "0.77rem", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
          >
            <span>Open Moderation</span>
            <ExternalLink size={12} />
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{ flex: 1, padding: "9px 11px", borderRadius: "9px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}
          >
            Close
          </button>

          {permissions.canReviewFraudAlerts && (
            <button
              type="submit"
              style={{ flex: 1, padding: "9px 12px", borderRadius: "9px", border: "none", background: "var(--primary)", color: "#fff", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}
            >
              Save Disposition
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

