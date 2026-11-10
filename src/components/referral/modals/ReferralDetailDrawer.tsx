import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  ExternalLink,
  ShieldCheck,
  Award,
  Clock,
  FileText,
  Lock,
  Plus,
} from "lucide-react";
import type {
  AdminReferralRecord,
  ReferralRolePermissions,
} from "../../../types/referralManagement.types";
import { Badge } from "../../common/Badge";
import {
  formatDateTime,
  formatReferralPoints,
  formatShortDate,
  getPrimaryReferralStatusMeta,
  getQualificationStatusMeta,
  getRewardStatusMeta,
} from "../referralUiUtils";

interface ReferralDetailDrawerProps {
  referral: AdminReferralRecord | null;
  allReferrals: AdminReferralRecord[];
  permissions: ReferralRolePermissions;
  onClose: () => void;
  onAddNote: (referralId: string, note: string) => void;
  onValidatePending: (referralId: string) => { success: boolean; error?: string };
  onIssueReward: (referralId: string, notes: string) => { success: boolean; error?: string };
  onRequestReject: (ref: AdminReferralRecord) => void;
}

export const ReferralDetailDrawer: React.FC<ReferralDetailDrawerProps> = ({
  referral,
  allReferrals,
  permissions,
  onClose,
  onAddNote,
  onValidatePending,
  onIssueReward,
  onRequestReject,
}) => {
  const navigate = useNavigate();
  const [noteInput, setNoteInput] = useState("");
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  if (!referral) return null;

  const stMeta = getPrimaryReferralStatusMeta(referral.status);
  const qMeta = getQualificationStatusMeta(referral.qualificationStatus);
  const rwMeta = getRewardStatusMeta(referral.rewardStatus);

  // Referrer aggregate telemetry computed accurately across existing referral records
  const referrerRecords = allReferrals.filter(
    (r) => r.referrer.userId === referral.referrer.userId
  );
  const referrerTotal = referrerRecords.length;
  const referrerSucc = referrerRecords.filter((r) => r.status === "successful").length;
  const referrerPend = referrerRecords.filter((r) => r.status === "pending").length;
  const referrerRej = referrerRecords.filter((r) => r.status === "rejected").length;
  const referrerPts = referrerRecords
    .filter((r) => r.rewardStatus === "issued")
    .reduce((s, r) => s + r.rewardAmount, 0);

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    onAddNote(referral.id, noteInput.trim());
    setNoteInput("");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 95,
        background: "rgba(0, 0, 0, 0.58)",
        display: "flex",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "560px",
          height: "100%",
          background: "var(--bg-card)",
          borderLeft: "1px solid var(--border)",
          padding: "22px",
          overflowY: "auto",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Top Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "var(--primary-glow)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileText size={18} />
            </div>
            <div>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--primary)" }}>
                {referral.id} • Code {referral.referralCode}
              </div>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>
                Referral Investigation &amp; Qualification Dossier
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "var(--bg-surface-elevated)", border: "1px solid var(--border)", color: "var(--text-secondary)", borderRadius: "8px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Status Badges */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          <Badge variant={stMeta.variant} size="sm">{stMeta.label}</Badge>
          <Badge variant={qMeta.variant} size="sm">{qMeta.label}</Badge>
          <Badge variant={rwMeta.variant} size="sm">Reward: {rwMeta.label}</Badge>
        </div>

        {actionMsg && (
          <div style={{ padding: "10px 12px", borderRadius: "10px", background: "var(--status-error-bg)", color: "var(--status-error)", fontSize: "0.79rem", fontWeight: 600 }}>
            {actionMsg}
          </div>
        )}

        {/* Section A: Referral Info */}
        <div style={{ background: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)", borderRadius: "13px", padding: "14px", fontSize: "0.8rem" }}>
          <div style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
            A. Referral Record Details
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div><span style={{ color: "var(--text-muted)" }}>Source:</span> <strong>{referral.referralSource}</strong></div>
            <div><span style={{ color: "var(--text-muted)" }}>Created:</span> <strong>{formatShortDate(referral.createdAt)}</strong></div>
            <div style={{ gridColumn: "1 / -1", color: "var(--text-secondary)" }}>
              Link Reference: <code>{referral.referralLinkRef}</code>
            </div>
          </div>
        </div>

        {/* Sections B & C: Referrer + Referred User */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "12px" }}>
          {/* B: Referrer */}
          <div style={{ background: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)", borderRadius: "13px", padding: "13px" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--primary)", marginBottom: "8px" }}>
              B. REFERRER (REWARD RECIPIENT)
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "8px" }}>
              <img src={referral.referrer.avatar} alt={referral.referrer.name} style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.86rem", color: "var(--text-main)" }}>{referral.referrer.name}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{referral.referrer.username} • {referral.referrer.userId}</div>
              </div>
            </div>
            <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Status: {referral.referrer.accountStatus} • Reg: {formatShortDate(referral.referrer.registrationDate)}
              <br />
              Total Referrals: {referrerTotal} (Ok: {referrerSucc} / Pend: {referrerPend} / Rej: {referrerRej})
              <br />
              Earned Total: <strong style={{ color: "var(--accent-lavender)" }}>{formatReferralPoints(referrerPts)}</strong>
            </div>
            <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
              <button
                type="button"
                onClick={() => navigate(`/users?userId=${encodeURIComponent(referral.referrer.userId)}`)}
                style={{ fontSize: "0.72rem", fontWeight: 600, padding: "4px 8px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-main)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                <span>User Profile</span>
                <ExternalLink size={11} />
              </button>
              <button
                type="button"
                onClick={() => navigate(`/profiles?profileId=${encodeURIComponent(referral.referrer.userId)}`)}
                style={{ fontSize: "0.72rem", fontWeight: 600, padding: "4px 8px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-secondary)", cursor: "pointer" }}
              >
                Dating Profile
              </button>
            </div>
          </div>

          {/* C: Referred User */}
          <div style={{ background: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)", borderRadius: "13px", padding: "13px" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px" }}>
              C. REFERRED USER (0 PTS BONUS)
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "8px" }}>
              <img src={referral.referredUser.avatar} alt={referral.referredUser.name} style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.86rem", color: "var(--text-main)" }}>{referral.referredUser.name}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{referral.referredUser.username} • {referral.referredUser.userId}</div>
              </div>
            </div>
            <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Status: {referral.referredUser.accountStatus} • {referral.referredUser.country}
              <br />
              Registered: {formatShortDate(referral.referredUser.registrationDate)}
              <br />
              Attributed: {formatShortDate(referral.attributionDate)}
            </div>
            <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
              <button
                type="button"
                onClick={() => navigate(`/users?userId=${encodeURIComponent(referral.referredUser.userId)}`)}
                style={{ fontSize: "0.72rem", fontWeight: 600, padding: "4px 8px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-main)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                <span>User Profile</span>
                <ExternalLink size={11} />
              </button>
              <button
                type="button"
                onClick={() => navigate(`/profiles?profileId=${encodeURIComponent(referral.referredUser.userId)}`)}
                style={{ fontSize: "0.72rem", fontWeight: 600, padding: "4px 8px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-secondary)", cursor: "pointer" }}
              >
                Dating Profile
              </button>
            </div>
          </div>
        </div>

        {/* Section D: Qualification Details (Zero exposed OTP secrets) */}
        <div style={{ background: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)", borderRadius: "13px", padding: "14px", fontSize: "0.8rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontWeight: 700, color: "var(--text-main)", display: "flex", alignItems: "center", gap: "6px" }}>
              <ShieldCheck size={15} style={{ color: "var(--status-success)" }} />
              D. Verification &amp; Qualification Checks
            </span>
            <Badge variant="neutral" size="sm">
              <Lock size={10} /> OTP Codes Hidden
            </Badge>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
            <Badge variant={referral.referredUser.emailVerified ? "success" : "warning"} size="sm">
              Email Verified: {referral.referredUser.emailVerified ? "Yes" : "No"}
            </Badge>
            <Badge variant={referral.referredUser.phoneVerified ? "success" : "warning"} size="sm">
              Phone Verified: {referral.referredUser.phoneVerified ? "Yes" : "No"}
            </Badge>
            <Badge variant={referral.passedFraudChecks ? "success" : "error"} size="sm">
              Anti-Fraud Checks: {referral.passedFraudChecks ? "Passed" : "Flagged / Blocked"}
            </Badge>
          </div>
          <div style={{ fontSize: "0.76rem", color: "var(--text-secondary)" }}>
            Satisfied Method: <strong>{referral.satisfiedVerificationMethod ? `${referral.satisfiedVerificationMethod.toUpperCase()} OTP` : "Incomplete"}</strong>
            {referral.referredUser.verifiedAt ? ` • Verified At: ${formatDateTime(referral.referredUser.verifiedAt)}` : ""}
          </div>
        </div>

        {/* Section E: Reward Details & Action Controls */}
        <div style={{ background: "var(--bg-surface-elevated)", border: "1px solid rgba(139, 92, 246, 0.35)", borderRadius: "13px", padding: "14px", fontSize: "0.8rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontWeight: 700, color: "var(--text-main)", display: "flex", alignItems: "center", gap: "6px" }}>
              <Award size={15} style={{ color: "var(--accent-lavender)" }} />
              E. Connection Points Reward Details
            </span>
            <button
              type="button"
              onClick={() => navigate("/wallet")}
              style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.74rem", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "3px" }}
            >
              <span>Wallet Ledger</span>
              <ExternalLink size={11} />
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", fontSize: "0.78rem" }}>
            <div><span style={{ color: "var(--text-muted)" }}>Reward:</span> <strong style={{ color: "var(--accent-lavender)" }}>{referral.rewardAmount} Connection Points</strong></div>
            <div><span style={{ color: "var(--text-muted)" }}>New User Bonus:</span> <strong>0 Pts</strong></div>
            <div><span style={{ color: "var(--text-muted)" }}>Ledger Ref:</span> <strong>{referral.rewardTransactionId || "--"}</strong></div>
            <div><span style={{ color: "var(--text-muted)" }}>Issued At:</span> <strong>{formatDateTime(referral.rewardIssuedAt)}</strong></div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
            {referral.status === "pending" && (
              <button
                type="button"
                onClick={() => {
                  const res = onValidatePending(referral.id);
                  if (!res.success && res.error) setActionMsg(res.error);
                }}
                style={{ padding: "7px 11px", borderRadius: "8px", border: "none", background: "var(--status-success)", color: "#fff", fontSize: "0.76rem", fontWeight: 700, cursor: "pointer" }}
              >
                Run Backend Validation Check
              </button>
            )}
            {(referral.rewardStatus === "eligible" || referral.rewardStatus === "failed") &&
              permissions.canApproveEligibleRewardIssuance && (
                <button
                  type="button"
                  onClick={() => {
                    const res = onIssueReward(referral.id, "Issued from Referral Investigation Drawer");
                    if (!res.success && res.error) setActionMsg(res.error);
                  }}
                  style={{ padding: "7px 11px", borderRadius: "8px", border: "none", background: "var(--primary)", color: "#fff", fontSize: "0.76rem", fontWeight: 700, cursor: "pointer" }}
                >
                  Issue {referral.rewardAmount} Connection Points
                </button>
              )}
            {referral.status !== "rejected" && permissions.canRejectReferrals && (
              <button
                type="button"
                onClick={() => onRequestReject(referral)}
                style={{ padding: "7px 11px", borderRadius: "8px", border: "1px solid var(--status-error)", background: "transparent", color: "var(--status-error)", fontSize: "0.76rem", fontWeight: 600, cursor: "pointer" }}
              >
                Reject Referral
              </button>
            )}
          </div>
        </div>

        {/* Section F: Chronological Timeline */}
        <div style={{ background: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)", borderRadius: "13px", padding: "14px" }}>
          <div style={{ fontWeight: 700, fontSize: "0.84rem", color: "var(--text-main)", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Clock size={14} style={{ color: "var(--status-info)" }} />
            F. Chronological Attribution &amp; Qualification Timeline
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {referral.timeline.map((ev) => (
              <div key={ev.id} style={{ paddingLeft: "10px", borderLeft: "2px solid var(--primary)", fontSize: "0.76rem" }}>
                <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{ev.title}</div>
                <div style={{ color: "var(--text-secondary)" }}>{ev.description}</div>
                <div style={{ fontSize: "0.69rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  {formatDateTime(ev.timestamp)} • Actor: {ev.actor}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section G: Internal Investigation Notes */}
        <div style={{ background: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)", borderRadius: "13px", padding: "14px" }}>
          <div style={{ fontWeight: 700, fontSize: "0.84rem", color: "var(--text-main)", marginBottom: "8px" }}>
            G. Internal Administration Notes ({referral.internalNotes.length})
          </div>

          <form onSubmit={handleNoteSubmit} style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
            <input
              type="text"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Add internal verification or investigation note..."
              style={{ flex: 1, padding: "8px 10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-main)", fontSize: "0.78rem" }}
            />
            <button
              type="submit"
              style={{ padding: "8px 12px", borderRadius: "8px", border: "none", background: "var(--primary)", color: "#fff", fontSize: "0.77rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
            >
              <Plus size={13} />
              <span>Add</span>
            </button>
          </form>

          {referral.internalNotes.length === 0 ? (
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>No internal administrator notes recorded yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              {referral.internalNotes.map((n) => (
                <div key={n.id} style={{ padding: "8px 10px", borderRadius: "8px", background: "var(--bg-card)", border: "1px solid var(--border-light)", fontSize: "0.76rem" }}>
                  <div style={{ color: "var(--text-main)" }}>{n.note}</div>
                  <div style={{ fontSize: "0.69rem", color: "var(--text-muted)", marginTop: "3px" }}>
                    {n.authorName} ({n.authorRole}) • {formatDateTime(n.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

