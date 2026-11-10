import React, { useState } from "react";
import { Clock, ShieldAlert, CheckCircle2, XCircle, Lock } from "lucide-react";
import type {
  AdminReferralRecord,
  ReferralQualificationStatus,
  ReferralRolePermissions,
} from "../../types/referralManagement.types";
import { Badge } from "../common/Badge";
import {
  formatDateTime,
  formatReferralPoints,
  getQualificationStatusMeta,
} from "./referralUiUtils";

interface PendingReferralsSectionProps {
  referrals: AdminReferralRecord[];
  permissions: ReferralRolePermissions;
  onInspectReferral: (ref: AdminReferralRecord) => void;
  onRunValidationCheck: (referralId: string) => { success: boolean; error?: string };
  onRequestReject: (ref: AdminReferralRecord) => void;
}

export const PendingReferralsSection: React.FC<PendingReferralsSectionProps> = ({
  referrals,
  permissions,
  onInspectReferral,
  onRunValidationCheck,
  onRequestReject,
}) => {
  const [subFilter, setSubFilter] = useState<"all" | ReferralQualificationStatus>("all");
  const [blockMessage, setBlockMessage] = useState<string | null>(null);

  const pendingList = referrals.filter((r) => r.status === "pending");
  const filtered = pendingList.filter(
    (r) => subFilter === "all" || r.qualificationStatus === subFilter
  );

  const handleValidateClick = (referralId: string) => {
    setBlockMessage(null);
    const res = onRunValidationCheck(referralId);
    if (!res.success && res.error) {
      setBlockMessage(res.error);
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
              background: "var(--status-warning-bg)",
              color: "var(--status-warning)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Clock size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>
              Pending Referrals &amp; Incomplete Qualifications ({filtered.length})
            </h3>
            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
              Connection Points cannot be issued until referred user completes email or phone OTP + backend validation
            </div>
          </div>
        </div>

        <Badge variant="warning" size="sm">
          <Lock size={11} style={{ marginRight: "4px" }} />
          No Manual Bypass Permitted
        </Badge>
      </div>

      {/* Filter Pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
        {([
          { key: "all", label: `All Pending (${pendingList.length})` },
          { key: "awaiting_email_verification", label: "Awaiting Email Verification" },
          { key: "awaiting_phone_verification", label: "Awaiting Phone Verification" },
          { key: "awaiting_either_verification", label: "Awaiting Either OTP" },
          { key: "awaiting_validation", label: "Awaiting Backend Validation" },
          { key: "under_review", label: "Under Review" },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setSubFilter(tab.key)}
            style={{
              padding: "7px 12px",
              borderRadius: "999px",
              border: subFilter === tab.key ? "1px solid var(--primary)" : "1px solid var(--border)",
              background: subFilter === tab.key ? "var(--primary-glow)" : "var(--bg-card)",
              color: subFilter === tab.key ? "var(--primary)" : "var(--text-secondary)",
              fontSize: "0.76rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {blockMessage && (
        <div
          style={{
            background: "var(--status-error-bg)",
            border: "1px solid var(--status-error)",
            borderRadius: "12px",
            padding: "12px 15px",
            color: "var(--status-error)",
            fontSize: "0.82rem",
            fontWeight: 600,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ShieldAlert size={17} />
            <span>{blockMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setBlockMessage(null)}
            style={{ background: "none", border: "none", color: "var(--status-error)", fontWeight: 700, cursor: "pointer" }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Pending Cards */}
      {filtered.length === 0 ? (
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "38px 16px",
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "0.86rem",
          }}
        >
          No pending referrals match this verification stage.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: "14px" }}>
          {filtered.map((r) => {
            const qMeta = getQualificationStatusMeta(r.qualificationStatus);
            const hasOtp = r.referredUser.emailVerified || r.referredUser.phoneVerified;
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
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--primary)" }}>
                      {r.id} • Code {r.referralCode}
                    </span>
                    <Badge variant={qMeta.variant} size="sm">{qMeta.label}</Badge>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text-main)" }}>
                        Referrer: {r.referrer.name}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        Referred Friend: {r.referredUser.name} ({r.referredUser.username})
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--accent-lavender)" }}>
                        Expected: {formatReferralPoints(r.rewardAmount)}
                      </div>
                      <div style={{ fontSize: "0.69rem", color: "var(--text-muted)" }}>
                        New user: 0 Pts
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                    <Badge variant={r.referredUser.emailVerified ? "success" : "warning"} size="sm">
                      Email OTP: {r.referredUser.emailVerified ? "Completed" : "Incomplete"}
                    </Badge>
                    <Badge variant={r.referredUser.phoneVerified ? "success" : "warning"} size="sm">
                      Phone OTP: {r.referredUser.phoneVerified ? "Completed" : "Incomplete"}
                    </Badge>
                  </div>

                  <div style={{ background: "var(--bg-surface-elevated)", padding: "9px 11px", borderRadius: "9px", fontSize: "0.76rem", color: "var(--text-secondary)" }}>
                    <strong>Missing Qualification:</strong>{" "}
                    {r.missingRequirementSummary || "Pending OTP verification or backend check."}
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "4px" }}>
                      Last Activity: {formatDateTime(r.lastActivityAt)}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                  <button
                    type="button"
                    onClick={() => onInspectReferral(r)}
                    style={{
                      padding: "7px 11px",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "var(--bg-surface-elevated)",
                      color: "var(--text-main)",
                      fontSize: "0.76rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Inspect Why Pending
                  </button>

                  <button
                    type="button"
                    onClick={() => handleValidateClick(r.id)}
                    style={{
                      flex: 1,
                      padding: "7px 11px",
                      borderRadius: "8px",
                      border: "none",
                      background: hasOtp ? "var(--status-success)" : "var(--bg-surface-elevated)",
                      color: hasOtp ? "#fff" : "var(--text-secondary)",
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                    }}
                  >
                    <CheckCircle2 size={13} />
                    <span>{hasOtp ? "Validate & Qualify" : "Verify Check (OTP Req.)"}</span>
                  </button>

                  {permissions.canRejectReferrals && (
                    <button
                      type="button"
                      onClick={() => onRequestReject(r)}
                      style={{
                        padding: "7px 10px",
                        borderRadius: "8px",
                        border: "1px solid var(--status-error)",
                        background: "transparent",
                        color: "var(--status-error)",
                        fontSize: "0.76rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <XCircle size={13} />
                      <span>Reject</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

