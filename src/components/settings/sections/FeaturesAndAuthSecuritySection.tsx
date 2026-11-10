import React, { useState } from "react";
import {
  ToggleLeft,
  ShieldCheck,
  KeyRound,
  Lock,
  CheckCircle2,
  AlertCircle,
  Search,
} from "lucide-react";
import type {
  AuthSecurityPolicies,
  FeatureFlagRecord,
  SystemSettingsRootState,
} from "../../../types/systemSettings.types";
import type { ConfirmActionRequest } from "./sharedSectionTypes";
import { SettingsSaveBar, type SaveWorkflowStatus } from "../SettingsSaveBar";
import { formatSettingsTimestamp } from "../settingsUiUtils";

interface FeaturesAndAuthSecuritySectionProps {
  state: SystemSettingsRootState;
  mode: "features" | "authentication";
  canEditFeatures: boolean;
  canEditSecurity: boolean;
  onToggleFeature: (
    featureId: string,
    enabled: boolean,
    scope: FeatureFlagRecord["availabilityScope"],
    reason: string
  ) => void;
  onSaveAuthSecurity: (next: AuthSecurityPolicies, reason: string) => void;
  onRequestConfirm: (req: ConfirmActionRequest) => void;
}

const cardStyle: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: 16,
  padding: 18,
  boxShadow: "var(--shadow-sm)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 11px",
  borderRadius: 9,
  border: "1px solid var(--border)",
  background: "var(--bg-surface-elevated)",
  color: "var(--text-main)",
  fontSize: 12.5,
  outline: "none",
};

export const FeaturesAndAuthSecuritySection: React.FC<FeaturesAndAuthSecuritySectionProps> = ({
  state,
  mode,
  canEditFeatures,
  canEditSecurity,
  onToggleFeature,
  onSaveAuthSecurity,
  onRequestConfirm,
}) => {
  const [featureSearch, setFeatureSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [authDraft, setAuthDraft] = useState<AuthSecurityPolicies>(state.authSecurity);
  const [authSaveStatus, setAuthSaveStatus] = useState<SaveWorkflowStatus>("saved");

  // 6. PLATFORM AVAILABILITY & FEATURE CONTROLS
  if (mode === "features") {
    const filteredFeatures = state.features.filter((f) => {
      const q = featureSearch.trim().toLowerCase();
      if (q && !f.name.toLowerCase().includes(q) && !f.description.toLowerCase().includes(q)) {
        return false;
      }
      if (categoryFilter !== "all" && f.category !== categoryFilter) return false;
      return true;
    });

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ToggleLeft size={18} style={{ color: "var(--primary)" }} />
                <h3 style={{ margin: 0, fontSize: 16.5, color: "var(--text-main)" }}>
                  Platform Availability & Feature Flag Registry
                </h3>
              </div>
              <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--text-secondary)" }}>
                Manages the 22 NobleBond mobile & web modules. Features lacking connected backend
                APIs (such as Plan a Date) remain strictly gated against accidental enablement.
              </p>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <div style={{ position: "relative" }}>
                <Search
                  size={13}
                  style={{ position: "absolute", left: 10, top: 10, color: "var(--text-muted)" }}
                />
                <input
                  type="text"
                  placeholder="Search features..."
                  value={featureSearch}
                  onChange={(e) => setFeatureSearch(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: 30, minWidth: 185 }}
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ ...inputStyle, width: "auto" }}
              >
                <option value="all">All Categories ({state.features.length})</option>
                <option value="Core Social">Core Social</option>
                <option value="Communication">Communication</option>
                <option value="Live & Economy">Live & Economy</option>
                <option value="Trust & Support">Trust & Support</option>
                <option value="Planned">Planned (Backend Pending)</option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 12,
            }}
          >
            {filteredFeatures.map((feat) => (
              <div
                key={feat.id}
                style={{
                  background: "var(--bg-surface-elevated)",
                  border: `1px solid ${!feat.integrationReady ? "var(--status-warning)" : "var(--border-light)"}`,
                  borderRadius: 14,
                  padding: 14,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 8,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-main)" }}>
                        {feat.name}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        {feat.category} • {feat.platforms.join(" / ")}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 9px",
                        borderRadius: 999,
                        color: !feat.integrationReady
                          ? "var(--status-warning)"
                          : feat.enabled
                            ? "var(--status-success)"
                            : "var(--status-error)",
                        background: !feat.integrationReady
                          ? "var(--status-warning-bg)"
                          : feat.enabled
                            ? "var(--status-success-bg)"
                            : "var(--status-error-bg)",
                      }}
                    >
                      {!feat.integrationReady
                        ? "Integration Pending"
                        : feat.enabled
                          ? "Enabled"
                          : "Disabled"}
                    </span>
                  </div>

                  <p style={{ margin: "7px 0", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.45 }}>
                    {feat.description}
                  </p>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    Dependency: {feat.dependencyNote}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                    paddingTop: 10,
                    borderTop: "1px solid var(--border-light)",
                  }}
                >
                  <select
                    aria-label={`Scope for ${feat.name}`}
                    disabled={!canEditFeatures || !feat.integrationReady}
                    value={feat.availabilityScope}
                    onChange={(e) => {
                      const nextScope = e.target.value as FeatureFlagRecord["availabilityScope"];
                      onRequestConfirm({
                        title: `Change Targeting Scope for ${feat.name}`,
                        description: `Switch rollout target scope from "${feat.availabilityScope}" to "${nextScope}".`,
                        confirmLabel: "Update Scope",
                        onConfirm: ({ reason }) =>
                          onToggleFeature(feat.id, feat.enabled, nextScope, reason),
                      });
                    }}
                    style={{ ...inputStyle, width: "auto", padding: "5px 8px", fontSize: 11.5 }}
                  >
                    <option value="all_users">All Users</option>
                    <option value="selected_countries">Selected Countries</option>
                    <option value="selected_platforms">Selected Platforms</option>
                    <option value="selected_groups">Selected Groups</option>
                  </select>

                  <button
                    type="button"
                    disabled={!canEditFeatures || !feat.integrationReady}
                    title={
                      !feat.integrationReady
                        ? "Blocked: Backend service integration is unavailable"
                        : undefined
                    }
                    onClick={() =>
                      onRequestConfirm({
                        title: `${feat.enabled ? "Disable" : "Enable"} "${feat.name}"?`,
                        description: feat.enabled
                          ? `Restrict access to ${feat.name} across ${feat.platforms.join(", ")}.`
                          : `Restore access to ${feat.name}.`,
                        impactWarning: feat.enabled
                          ? "Disabling a feature prevents new interactions while strictly preserving all historical user records, chats, matches, or financial entries."
                          : "Re-enables feature visibility based on selected availability scope.",
                        danger: feat.enabled,
                        confirmLabel: feat.enabled ? "Disable Feature" : "Enable Feature",
                        onConfirm: ({ reason }) =>
                          onToggleFeature(feat.id, !feat.enabled, feat.availabilityScope, reason),
                      })
                    }
                    style={{
                      padding: "6px 11px",
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: !feat.integrationReady
                        ? "var(--bg-card)"
                        : feat.enabled
                          ? "var(--status-error-bg)"
                          : "var(--status-success-bg)",
                      color: !feat.integrationReady
                        ? "var(--text-muted)"
                        : feat.enabled
                          ? "var(--status-error)"
                          : "var(--status-success)",
                      fontSize: 11.5,
                      fontWeight: 700,
                      cursor:
                        canEditFeatures && feat.integrationReady ? "pointer" : "not-allowed",
                    }}
                  >
                    {!feat.integrationReady
                      ? "API Unavailable"
                      : feat.enabled
                        ? "Disable"
                        : "Enable"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 7. AUTHENTICATION & ACCOUNT SECURITY
  const patchAuth = (partial: Partial<AuthSecurityPolicies>) => {
    if (!canEditSecurity) return;
    setAuthDraft((prev) => ({ ...prev, ...partial }));
    setAuthSaveStatus("unsaved");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SettingsSaveBar
        status={authSaveStatus}
        sectionLabel="Authentication & Security Policies"
        canSave={canEditSecurity}
        onSave={() => {
          if (authDraft.minPasswordLength < 8 || authDraft.maxLoginAttempts < 2) {
            setAuthSaveStatus("save_failed");
            return;
          }
          onRequestConfirm({
            title: "Save Authentication & Security Policy Update",
            description: "Applies updated password complexity, lockout limits, and Admin MFA policy.",
            impactWarning:
              "Security rule enforcement is recorded locally in System Settings Audit History and requires synchronized backend auth middleware in production.",
            requireReauth: true,
            allowTwoPersonStage: true,
            danger: true,
            confirmLabel: "Apply Security Policy",
            onConfirm: ({ reason }) => {
              onSaveAuthSecurity(authDraft, reason);
              setAuthSaveStatus("just_saved");
            },
          });
        }}
        onDiscard={() => {
          setAuthDraft(state.authSecurity);
          setAuthSaveStatus("saved");
        }}
      />

      {!canEditSecurity && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            background: "var(--status-warning-bg)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12.5,
          }}
        >
          <Lock size={15} style={{ color: "var(--status-warning)" }} />
          <span>Read-only security preview under current RBAC role.</span>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 16,
        }}
      >
        {/* A. Registration & Verification Security */}
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <ShieldCheck size={18} style={{ color: "var(--primary)" }} />
            <h3 style={{ margin: 0, fontSize: 15.5, color: "var(--text-main)" }}>
              A. Registration & Onboarding Security
            </h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12.5 }}>
            {[
              { key: "allowEmailRegistration" as const, label: "Allow Email Account Registration" },
              { key: "allowPhoneRegistration" as const, label: "Allow Phone SMS Registration" },
              { key: "requireEmailVerification" as const, label: "Require Email OTP Verification" },
              { key: "requirePhoneVerification" as const, label: "Require Phone OTP Verification" },
              { key: "requireAge18Declaration" as const, label: "Enforce Minimum Age (18+)" },
              { key: "suspiciousSignupShieldEnabled" as const, label: "Anti-Bot & Referral Velocity Protection" },
            ].map((item) => (
              <label
                key={item.key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 10px",
                  borderRadius: 10,
                  background: "var(--bg-surface-elevated)",
                  cursor: canEditSecurity ? "pointer" : "not-allowed",
                }}
              >
                <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{item.label}</span>
                <input
                  type="checkbox"
                  disabled={!canEditSecurity}
                  checked={authDraft[item.key]}
                  onChange={(e) => patchAuth({ [item.key]: e.target.checked })}
                />
              </label>
            ))}
          </div>
        </div>

        {/* B & C. Login Lockout & Password Complexity */}
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <KeyRound size={18} style={{ color: "var(--accent-lavender)" }} />
            <h3 style={{ margin: 0, fontSize: 15.5, color: "var(--text-main)" }}>
              B & C. Brute-Force Lockout & Password Policy
            </h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
              <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Max Failed Logins</span>
              <input
                type="number"
                min={3}
                max={15}
                disabled={!canEditSecurity}
                value={authDraft.maxLoginAttempts}
                onChange={(e) => patchAuth({ maxLoginAttempts: Number(e.target.value) })}
                style={inputStyle}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
              <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Lockout Mins</span>
              <input
                type="number"
                min={5}
                max={120}
                disabled={!canEditSecurity}
                value={authDraft.lockoutDurationMinutes}
                onChange={(e) => patchAuth({ lockoutDurationMinutes: Number(e.target.value) })}
                style={inputStyle}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
              <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Min Password Len</span>
              <input
                type="number"
                min={8}
                max={32}
                disabled={!canEditSecurity}
                value={authDraft.minPasswordLength}
                onChange={(e) => patchAuth({ minPasswordLength: Number(e.target.value) })}
                style={inputStyle}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
              <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Reset Expiry (min)</span>
              <input
                type="number"
                min={5}
                max={60}
                disabled={!canEditSecurity}
                value={authDraft.resetTokenExpiryMinutes}
                onChange={(e) => patchAuth({ resetTokenExpiryMinutes: Number(e.target.value) })}
                style={inputStyle}
              />
            </label>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, fontSize: 12 }}>
            {[
              { key: "requireUppercase" as const, label: "Require Uppercase" },
              { key: "requireNumeric" as const, label: "Require Number" },
              { key: "requireSpecialChar" as const, label: "Require Symbol" },
            ].map((c) => (
              <label key={c.key} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <input
                  type="checkbox"
                  disabled={!canEditSecurity}
                  checked={authDraft[c.key]}
                  onChange={(e) => patchAuth({ [c.key]: e.target.checked })}
                />
                <span>{c.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* D. Admin Two-Factor Authentication Policy (Zero Secrets Shown) */}
      <div style={cardStyle}>
        <h3 style={{ margin: "0 0 6px", fontSize: 15.5, color: "var(--text-main)" }}>
          D. Administrator Multi-Factor Authentication (MFA) Governance
        </h3>
        <p style={{ margin: "0 0 12px", fontSize: 12, color: "var(--text-secondary)" }}>
          Secrets, TOTP seeds, OTP codes, and recovery keys are never stored or readable in
          frontend configuration screens.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12 }}>
            <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Admin MFA Enforcement</span>
            <select
              disabled={!canEditSecurity}
              value={authDraft.adminMfaEnforcement}
              onChange={(e) =>
                patchAuth({
                  adminMfaEnforcement: e.target.value as AuthSecurityPolicies["adminMfaEnforcement"],
                })
              }
              style={inputStyle}
            >
              <option value="required_all_admins">Mandatory for All Administrators</option>
              <option value="required_sensitive_roles">Required for Super Admin & Finance</option>
              <option value="optional">Optional (Encouraged)</option>
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12 }}>
            <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
              Console Idle Lockout (Minutes)
            </span>
            <input
              type="number"
              min={5}
              max={120}
              disabled={!canEditSecurity}
              value={authDraft.adminSessionIdleTimeoutMinutes}
              onChange={(e) =>
                patchAuth({ adminSessionIdleTimeoutMinutes: Number(e.target.value) })
              }
              style={inputStyle}
            />
          </label>

          <div
            style={{
              padding: 10,
              borderRadius: 10,
              background: "var(--bg-surface-elevated)",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <CheckCircle2 size={15} style={{ color: "var(--status-success)", flexShrink: 0 }} />
            <span>Methods: {authDraft.supportedMfaMethods.join(" • ")}</span>
          </div>
        </div>
      </div>

      {/* E. Security Events Log (Genuine Logged Events Only) */}
      <div style={cardStyle}>
        <h3 style={{ margin: "0 0 10px", fontSize: 15.5, color: "var(--text-main)" }}>
          E. Recent Administrator Security Events ({state.securityEvents.length})
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {state.securityEvents.map((ev) => (
            <div
              key={ev.id}
              style={{
                padding: "9px 12px",
                borderRadius: 10,
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: 8,
                fontSize: 12.5,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <AlertCircle
                  size={14}
                  style={{
                    color:
                      ev.severity === "high" || ev.severity === "medium"
                        ? "var(--status-warning)"
                        : "var(--status-info)",
                  }}
                />
                <span>
                  <strong>{ev.actorLabel}</strong> — {ev.summary}
                </span>
              </div>
              <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                {formatSettingsTimestamp(ev.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

