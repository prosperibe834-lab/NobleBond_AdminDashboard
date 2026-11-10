import React from "react";
import { ShieldCheck, Award, Lock, CheckCircle2, PauseCircle } from "lucide-react";
import type { ReferralProgramSettings } from "../../types/referralManagement.types";
import { Badge } from "../common/Badge";

interface ReferralRulesBannerProps {
  settings: ReferralProgramSettings;
  onOpenSettings: () => void;
}

export const ReferralRulesBanner: React.FC<ReferralRulesBannerProps> = ({
  settings,
  onOpenSettings,
}) => {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        padding: "14px 18px",
        marginBottom: "18px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: "1 1 340px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "var(--primary-glow)",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ShieldCheck size={19} />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-main)" }}>
              NobleBond Referral Qualification &amp; Wallet Rules Enforced
            </span>
            <Badge variant={settings.isEnabled ? "success" : "warning"} size="sm">
              {settings.isEnabled ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <CheckCircle2 size={11} />
                  Programme Active
                </span>
              ) : (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <PauseCircle size={11} />
                  Programme Paused
                </span>
              )}
            </Badge>
          </div>
          <div style={{ fontSize: "0.77rem", color: "var(--text-secondary)", marginTop: "2px" }}>
            Only the referrer earns <strong>{settings.rewardAmountPoints} Connection Points</strong> after the invited user verifies email or phone OTP (referred user bonus: 0 Pts). No Gift Coins or cash payouts.
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px 10px",
            borderRadius: "999px",
            fontSize: "0.73rem",
            fontWeight: 600,
            background: "var(--accent-lavender-bg)",
            color: "var(--accent-lavender)",
            border: "1px solid rgba(139, 92, 246, 0.25)",
          }}
        >
          <Award size={13} />
          {settings.rewardAmountPoints} Pts / Referrer Only
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px 10px",
            borderRadius: "999px",
            fontSize: "0.73rem",
            fontWeight: 600,
            background: "var(--bg-surface-elevated)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          <Lock size={12} />
          OTP Required
        </span>
        <button
          type="button"
          onClick={onOpenSettings}
          style={{
            background: "var(--bg-surface-elevated)",
            border: "1px solid var(--border)",
            color: "var(--primary)",
            borderRadius: "8px",
            padding: "6px 11px",
            fontSize: "0.75rem",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Programme Rules
        </button>
      </div>
    </div>
  );
};

