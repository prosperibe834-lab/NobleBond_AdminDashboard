import React, { useState } from "react";
import {
  Sliders,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Power,
  AlertCircle,
} from "lucide-react";
import type {
  ReferralProgramSettings,
  ReferralRolePermissions,
} from "../../types/referralManagement.types";
import { Badge } from "../common/Badge";
import { formatDateTime } from "./referralUiUtils";

interface ReferralSettingsSectionProps {
  settings: ReferralProgramSettings;
  permissions: ReferralRolePermissions;
  onRequestToggleProgram: (nextEnabled: boolean) => void;
  onRequestSaveSettings: (draft: ReferralProgramSettings, reason: string) => void;
}

export const ReferralSettingsSection: React.FC<ReferralSettingsSectionProps> = ({
  settings,
  permissions,
  onRequestToggleProgram,
  onRequestSaveSettings,
}) => {
  const [rewardAmount, setRewardAmount] = useState<string>(
    String(settings.rewardAmountPoints)
  );
  const [attributionWindowDays, setAttributionWindowDays] = useState<string>(
    String(settings.attributionWindowDays)
  );
  const [effectiveDate, setEffectiveDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [auditReason, setAuditReason] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!permissions.canChangeReferralSettings && !permissions.canChangeRewardAmount) {
      setValidationError(
        `Role "${permissions.roleLabel}" does not have permission to edit referral settings.`
      );
      return;
    }

    const pts = Math.floor(Number(rewardAmount));
    const windowDays = Math.floor(Number(attributionWindowDays));

    if (!Number.isFinite(pts) || pts < 10 || pts > 500) {
      setValidationError("Reward amount must be between 10 and 500 Connection Points.");
      return;
    }
    if (pts !== settings.rewardAmountPoints && !permissions.canChangeRewardAmount) {
      setValidationError("Current role is not permitted to alter the Connection Points reward amount.");
      return;
    }
    if (!Number.isFinite(windowDays) || windowDays < 1 || windowDays > 90) {
      setValidationError("Attribution window must be between 1 and 90 days.");
      return;
    }
    if (auditReason.trim().length < 5) {
      setValidationError("Enter an operational reason (min 5 characters) for Referral Audit History.");
      return;
    }

    onRequestSaveSettings(
      {
        ...settings,
        rewardAmountPoints: pts,
        attributionWindowDays: windowDays,
        effectiveFromDate: effectiveDate,
      },
      auditReason.trim()
    );
  };

  const mandatoryRulesChecklist = [
    "Valid referral attribution exists (?ref=CODE or invite link)",
    "Referred account is strictly distinct from the referrer (no self-referrals)",
    "Referred user verified email OR phone via OTP (registration alone never qualifies)",
    "Referral passed backend uniqueness & anti-fraud validation",
    "Connection Points reward has not previously been issued for this account",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Section A: Program Status Toggle Card */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "18px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "11px",
              background: settings.isEnabled ? "var(--status-success-bg)" : "var(--status-warning-bg)",
              color: settings.isEnabled ? "var(--status-success)" : "var(--status-warning)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Power size={19} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>
                A. Referral Programme Status (Demo Configuration)
              </h3>
              <Badge variant={settings.isEnabled ? "success" : "warning"} size="sm">
                {settings.isEnabled ? "ENABLED" : "DISABLED"}
              </Badge>
            </div>
            <div style={{ fontSize: "0.77rem", color: "var(--text-muted)", marginTop: "3px" }}>
              Disabling preserves all historical referral records and never revokes previously issued rewards. Last updated: {formatDateTime(settings.lastUpdatedAt)} by {settings.lastUpdatedBy}.
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={!permissions.canChangeReferralSettings}
          onClick={() => onRequestToggleProgram(!settings.isEnabled)}
          style={{
            padding: "9px 15px",
            borderRadius: "10px",
            border: "none",
            background: !permissions.canChangeReferralSettings
              ? "var(--bg-surface-elevated)"
              : settings.isEnabled
              ? "var(--status-error)"
              : "var(--status-success)",
            color: permissions.canChangeReferralSettings ? "#fff" : "var(--text-muted)",
            fontSize: "0.82rem",
            fontWeight: 700,
            cursor: permissions.canChangeReferralSettings ? "pointer" : "not-allowed",
          }}
        >
          {settings.isEnabled ? "Disable Programme" : "Enable Programme"}
        </button>
      </div>

      {/* Main Split: B/C Reward & Attribution Settings + D Immutable Checklist */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: "16px" }}>
        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "18px",
            display: "flex",
            flexDirection: "column",
            gap: "13px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Sliders size={18} style={{ color: "var(--primary)" }} />
            <h3 style={{ margin: 0, fontSize: "0.98rem", fontWeight: 700, color: "var(--text-main)" }}>
              B &amp; C. Reward &amp; Attribution Configuration
            </h3>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: "9px",
              padding: "11px",
              borderRadius: "11px",
              background: "var(--bg-surface-elevated)",
              fontSize: "0.78rem",
            }}
          >
            <div>
              <div style={{ color: "var(--text-muted)" }}>Reward Type</div>
              <strong style={{ color: "var(--accent-lavender)" }}>{settings.rewardType}</strong>
            </div>
            <div>
              <div style={{ color: "var(--text-muted)" }}>Reward Recipient</div>
              <strong style={{ color: "var(--text-main)" }}>{settings.rewardRecipient}</strong>
            </div>
            <div>
              <div style={{ color: "var(--text-muted)" }}>New Referred Bonus</div>
              <strong style={{ color: "var(--text-main)" }}>None (0 Pts)</strong>
            </div>
            <div>
              <div style={{ color: "var(--text-muted)" }}>Attribution Method</div>
              <strong style={{ color: "var(--text-main)" }}>Code / ?ref= Link</strong>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.79rem", fontWeight: 600, color: "var(--text-main)" }}>
              Reward Amount (Connection Points)
              <input
                type="number"
                min={10}
                max={500}
                disabled={!permissions.canChangeRewardAmount}
                value={rewardAmount}
                onChange={(e) => setRewardAmount(e.target.value)}
                style={{
                  padding: "9px 10px",
                  borderRadius: "9px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-surface-elevated)",
                  color: "var(--text-main)",
                  fontSize: "0.86rem",
                  fontWeight: 700,
                }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.79rem", fontWeight: 600, color: "var(--text-main)" }}>
              Effective From Date
              <input
                type="date"
                disabled={!permissions.canChangeReferralSettings}
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                style={{
                  padding: "9px 10px",
                  borderRadius: "9px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-surface-elevated)",
                  color: "var(--text-main)",
                  fontSize: "0.83rem",
                }}
              />
            </label>
          </div>

          <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.79rem", fontWeight: 600, color: "var(--text-main)" }}>
            Attribution Window (Days)
            <input
              type="number"
              min={1}
              max={90}
              disabled={!permissions.canChangeReferralSettings}
              value={attributionWindowDays}
              onChange={(e) => setAttributionWindowDays(e.target.value)}
              style={{
                padding: "9px 10px",
                borderRadius: "9px",
                border: "1px solid var(--border)",
                background: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                fontSize: "0.84rem",
              }}
            />
          </label>

          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", background: "var(--status-info-bg)", padding: "9px 11px", borderRadius: "9px" }}>
            Prospective Policy: Changes apply strictly from the effective date forward and never overwrite historical reward records. Production rollouts require backend confirmation.
          </div>

          <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.79rem", fontWeight: 600, color: "var(--text-main)" }}>
            Audit Change Reason
            <input
              type="text"
              disabled={!permissions.canChangeReferralSettings}
              value={auditReason}
              onChange={(e) => setAuditReason(e.target.value)}
              placeholder="Explain why the referral reward or attribution window is changing..."
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

          {validationError && (
            <div style={{ padding: "9px 11px", borderRadius: "9px", background: "var(--status-error-bg)", color: "var(--status-error)", fontSize: "0.78rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
              <AlertCircle size={15} />
              <span>{validationError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!permissions.canChangeReferralSettings}
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              border: "none",
              background: permissions.canChangeReferralSettings ? "var(--primary)" : "var(--bg-surface-elevated)",
              color: permissions.canChangeReferralSettings ? "#fff" : "var(--text-muted)",
              fontSize: "0.83rem",
              fontWeight: 700,
              cursor: permissions.canChangeReferralSettings ? "pointer" : "not-allowed",
            }}
          >
            {permissions.canChangeReferralSettings
              ? "Review & Save Demo Settings"
              : `Locked for Role: ${permissions.roleLabel}`}
          </button>
        </form>

        {/* Section D: Immutable Qualification Rules Checklist */}
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ShieldCheck size={18} style={{ color: "var(--status-success)" }} />
                <h3 style={{ margin: 0, fontSize: "0.98rem", fontWeight: 700, color: "var(--text-main)" }}>
                  D. Core Qualification Safeguards
                </h3>
              </div>
              <Badge variant="neutral" size="sm">
                <Lock size={11} style={{ marginRight: "4px" }} />
                Policy Locked
              </Badge>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
              {mandatoryRulesChecklist.map((rule) => (
                <div
                  key={rule}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "10px",
                    background: "var(--bg-surface-elevated)",
                    border: "1px solid var(--border-light)",
                    display: "flex",
                    alignItems: "center",
                    gap: "9px",
                    fontSize: "0.8rem",
                    color: "var(--text-main)",
                    fontWeight: 600,
                  }}
                >
                  <CheckCircle2 size={15} style={{ color: "var(--status-success)", flexShrink: 0 }} />
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: "11px 13px", borderRadius: "10px", background: "var(--bg-surface-elevated)", fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
            <strong>Attribution Preservation:</strong> {settings.repeatedLinkHandling}. {settings.duplicateHandling}.
          </div>
        </div>
      </div>
    </div>
  );
};

