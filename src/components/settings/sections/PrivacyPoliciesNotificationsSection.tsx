import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, FileText, Bell, Lock, Eye, CheckCircle2, ExternalLink, AlertCircle } from "lucide-react";
import type {
  CommunityPolicyRecord,
  NotificationCategoryConfig,
  NotificationChannelConfig,
  PrivacyDataProtectionConfig,
  SystemSettingsRootState,
} from "../../../types/systemSettings.types";
import type { ConfirmActionRequest } from "./sharedSectionTypes";
import { SettingsSaveBar, type SaveWorkflowStatus } from "../SettingsSaveBar";
import { formatSettingsTimestamp } from "../settingsUiUtils";

interface PrivacyPoliciesNotificationsSectionProps {
  state: SystemSettingsRootState;
  mode: "privacy" | "policies" | "notifications";
  canEditPrivacy: boolean;
  canEditPolicies: boolean;
  canEditNotifications: boolean;
  onSavePrivacy: (next: PrivacyDataProtectionConfig, reason: string) => void;
  onSavePolicyDraft: (policyId: string, draftText: string) => void;
  onPublishPolicy: (policyId: string, requiresAck: boolean, reason: string) => void;
  onToggleNotifChannel: (channelId: string, enabled: boolean, reason: string) => void;
  onToggleNotifCategory: (
    catId: string,
    field: "inAppEnabled" | "pushEnabled" | "emailEnabled" | "smsEnabled",
    val: boolean
  ) => void;
  onRequestConfirm: (req: ConfirmActionRequest) => void;
}

const cardStyle: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: 16,
  padding: 18,
  boxShadow: "var(--shadow-sm)",
};

export const PrivacyPoliciesNotificationsSection: React.FC<
  PrivacyPoliciesNotificationsSectionProps
> = ({
  state,
  mode,
  canEditPrivacy,
  canEditPolicies,
  canEditNotifications,
  onSavePrivacy,
  onSavePolicyDraft,
  onPublishPolicy,
  onToggleNotifChannel,
  onToggleNotifCategory,
  onRequestConfirm,
}) => {
  const navigate = useNavigate();
  const [privacyDraft, setPrivacyDraft] = useState<PrivacyDataProtectionConfig>(state.privacy);
  const [privacySaveStatus, setPrivacySaveStatus] = useState<SaveWorkflowStatus>("saved");

  const [editingPolicyId, setEditingPolicyId] = useState<string>(state.policies[0]?.id || "");
  const [draftTexts, setDraftTexts] = useState<Record<string, string>>(() =>
    Object.fromEntries(state.policies.map((p) => [p.id, p.draftSummary]))
  );
  const [previewPolicy, setPreviewPolicy] = useState(false);

  // 11. PRIVACY & DATA PROTECTION
  if (mode === "privacy") {
    const patchPrivacy = (partial: Partial<PrivacyDataProtectionConfig>) => {
      if (!canEditPrivacy) return;
      setPrivacyDraft((prev) => ({ ...prev, ...partial }));
      setPrivacySaveStatus("unsaved");
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <SettingsSaveBar
          status={privacySaveStatus}
          sectionLabel="Privacy & Data Protection"
          canSave={canEditPrivacy}
          onSave={() =>
            onRequestConfirm({
              title: "Save Privacy & Data Protection Defaults",
              description: "Updates default visibility rules for new accounts.",
              impactWarning:
                "Existing member privacy settings are strictly preserved and never silently overwritten without an explicit migration policy.",
              confirmLabel: "Save Privacy Policy",
              onConfirm: ({ reason }) => {
                onSavePrivacy(privacyDraft, reason);
                setPrivacySaveStatus("just_saved");
              },
            })
          }
          onDiscard={() => {
            setPrivacyDraft(state.privacy);
            setPrivacySaveStatus("saved");
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {/* A. User Privacy Defaults */}
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Shield size={18} style={{ color: "var(--primary)" }} />
              <h3 style={{ margin: 0, fontSize: 15.5, color: "var(--text-main)" }}>
                A. Member Default Privacy Rules
              </h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 12.5 }}>
              {[
                { key: "defaultDiscoveryOptIn" as const, label: "New accounts visible in Discovery by default" },
                { key: "defaultShowOnlineStatus" as const, label: "Show active online indicator by default" },
                { key: "defaultReadReceipts" as const, label: "Enable chat read receipts by default" },
                { key: "showApproximateDistanceOnly" as const, label: "Mask exact GPS coordinates (Approximate distance only)" },
                { key: "allowDataExportRequests" as const, label: "Enable member Data Export Requests" },
                { key: "allowAccountDeletionRequests" as const, label: "Enable self-service Account Deletion queue" },
              ].map((row) => (
                <label
                  key={row.key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 10px",
                    borderRadius: 10,
                    background: "var(--bg-surface-elevated)",
                    cursor: canEditPrivacy ? "pointer" : "not-allowed",
                  }}
                >
                  <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{row.label}</span>
                  <input
                    type="checkbox"
                    disabled={!canEditPrivacy}
                    checked={privacyDraft[row.key]}
                    onChange={(e) => patchPrivacy({ [row.key]: e.target.checked })}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* C & D. Data Deletion Workflows & Sensitive Info Protection */}
          <div style={cardStyle}>
            <h3 style={{ margin: "0 0 8px", fontSize: 15.5, color: "var(--text-main)" }}>
              C & D. Compliance Requests & Sensitive Information Isolation
            </h3>
            <p style={{ margin: "0 0 12px", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
              User Data Export, Account Deletion, and Correction inquiries route through verified
              Support & User Management workflows. Private messages, passwords, and payment tokens
              are never surfaced in general settings.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
              <button
                type="button"
                onClick={() => navigate("/support")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 12px",
                  borderRadius: 9,
                  border: "1px solid var(--border)",
                  background: "var(--bg-surface-elevated)",
                  color: "var(--primary)",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <span>Open Privacy & Deletion Tickets</span>
                <ExternalLink size={12} />
              </button>
              <button
                type="button"
                onClick={() => navigate("/users")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 12px",
                  borderRadius: 9,
                  border: "1px solid var(--border)",
                  background: "var(--bg-surface-elevated)",
                  color: "var(--text-main)",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <span>Manage User Accounts</span>
                <ExternalLink size={12} />
              </button>
            </div>

            <div
              style={{
                padding: 11,
                borderRadius: 10,
                background: "var(--status-success-bg)",
                color: "var(--status-success)",
                fontSize: 12,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <CheckCircle2 size={15} />
              <span>Zero general-purpose surveillance or unmasked credential fields present.</span>
            </div>
          </div>
        </div>

        {/* B. Data Retention Schedule */}
        <div style={cardStyle}>
          <h3 style={{ margin: "0 0 10px", fontSize: 15.5, color: "var(--text-main)" }}>
            B. Legal & Operational Data Retention Schedule
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Data Category</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Legal Basis</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Retention Period</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Protection</th>
                </tr>
              </thead>
              <tbody>
                {privacyDraft.retentionRules.map((rule) => (
                  <tr key={rule.category} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "9px 10px", fontWeight: 700, color: "var(--text-main)" }}>
                      {rule.category}
                      <div style={{ fontSize: 11, fontWeight: 400, color: "var(--text-muted)" }}>
                        {rule.description}
                      </div>
                    </td>
                    <td style={{ padding: "9px 10px", color: "var(--text-secondary)" }}>
                      {rule.legalBasis}
                    </td>
                    <td style={{ padding: "9px 10px", fontWeight: 700 }}>
                      {rule.retentionDays} days
                    </td>
                    <td style={{ padding: "9px 10px" }}>
                      {rule.lockedByCompliance ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 11,
                            fontWeight: 700,
                            color: "var(--status-error)",
                            background: "var(--status-error-bg)",
                            padding: "2px 8px",
                            borderRadius: 999,
                          }}
                        >
                          <Lock size={10} /> Statutory Lock
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "var(--status-info)",
                            background: "var(--status-info-bg)",
                            padding: "2px 8px",
                            borderRadius: 999,
                          }}
                        >
                          Policy Managed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // 12. CONTENT & COMMUNITY POLICIES
  if (mode === "policies") {
    const activePolicy: CommunityPolicyRecord =
      state.policies.find((p) => p.id === editingPolicyId) || state.policies[0];
    const currentDraftText = draftTexts[activePolicy.id] ?? activePolicy.draftSummary;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <FileText size={18} style={{ color: "var(--primary)" }} />
            <h3 style={{ margin: 0, fontSize: 16.5, color: "var(--text-main)" }}>
              Content, Enforcement & Community Policy Lifecycle
            </h3>
          </div>
          <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--text-secondary)" }}>
            Strictly separates saved unpublished drafts from active published policy versions.
          </p>

          {/* Policy Selector Tabs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            {state.policies.map((pol) => {
              const selected = pol.id === activePolicy.id;
              return (
                <button
                  key={pol.id}
                  type="button"
                  onClick={() => setEditingPolicyId(pol.id)}
                  style={{
                    padding: "7px 12px",
                    borderRadius: 10,
                    border: `1px solid ${selected ? "var(--primary)" : "var(--border)"}`,
                    background: selected ? "var(--bg-active)" : "var(--bg-surface-elevated)",
                    color: selected ? "var(--primary)" : "var(--text-main)",
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {pol.title} ({pol.publishedVersion})
                  {pol.hasUnpublishedDraft ? " • Unpublished Draft" : ""}
                </button>
              );
            })}
          </div>

          {/* Published vs Draft Split */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: 14,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 12,
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
              }}
            >
              <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--status-success)", marginBottom: 6 }}>
                LIVE PUBLISHED VERSION ({activePolicy.publishedVersion})
              </div>
              <p style={{ margin: 0, fontSize: 12.5, color: "var(--text-main)", lineHeight: 1.5 }}>
                {activePolicy.publishedSummary}
              </p>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>
                Published by {activePolicy.lastPublishedBy} on{" "}
                {formatSettingsTimestamp(activePolicy.lastPublishedAt)}
              </div>
            </div>

            <div
              style={{
                padding: 14,
                borderRadius: 12,
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
              }}
            >
              <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--status-warning)", marginBottom: 6 }}>
                WORKING DRAFT EDITOR
              </div>
              <textarea
                rows={4}
                disabled={!canEditPolicies}
                value={currentDraftText}
                onChange={(e) =>
                  setDraftTexts((prev) => ({ ...prev, [activePolicy.id]: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: 9,
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "var(--bg-card)",
                  color: "var(--text-main)",
                  fontSize: 12.5,
                }}
              />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setPreviewPolicy((p) => !p)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "6px 11px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--bg-card)",
                    color: "var(--text-main)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <Eye size={13} />
                  <span>{previewPolicy ? "Hide Preview" : "Preview Draft"}</span>
                </button>
                <button
                  type="button"
                  disabled={!canEditPolicies}
                  onClick={() => onSavePolicyDraft(activePolicy.id, currentDraftText)}
                  style={{
                    padding: "6px 11px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--bg-surface)",
                    color: "var(--text-main)",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: canEditPolicies ? "pointer" : "not-allowed",
                  }}
                >
                  Save Draft Only
                </button>
                <button
                  type="button"
                  disabled={!canEditPolicies}
                  onClick={() =>
                    onRequestConfirm({
                      title: `Publish Policy Update for "${activePolicy.title}"?`,
                      description: "Archives the previous version and bumps the published version.",
                      impactWarning: activePolicy.requiresUserAcknowledgement
                        ? "Requires member policy notice & acknowledgement workflow before taking effect."
                        : "Updates member-facing reference version immediately.",
                      confirmLabel: "Publish Policy Version",
                      onConfirm: ({ reason }) => {
                        onSavePolicyDraft(activePolicy.id, currentDraftText);
                        onPublishPolicy(activePolicy.id, activePolicy.requiresUserAcknowledgement, reason);
                      },
                    })
                  }
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: "none",
                    background: canEditPolicies ? "var(--primary)" : "var(--bg-card)",
                    color: canEditPolicies ? "#FFFFFF" : "var(--text-muted)",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: canEditPolicies ? "pointer" : "not-allowed",
                  }}
                >
                  Publish Update
                </button>
              </div>
            </div>
          </div>

          {previewPolicy && (
            <div
              style={{
                padding: 13,
                borderRadius: 12,
                background: "var(--status-info-bg)",
                marginBottom: 14,
                fontSize: 12.5,
              }}
            >
              <strong>Policy Preview:</strong> {currentDraftText}
            </div>
          )}

          {/* Previous Policy Version History */}
          <h4 style={{ margin: "0 0 8px", fontSize: 13.5, color: "var(--text-main)" }}>
            Archived Policy Versions
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {activePolicy.previousVersions.map((ver) => (
              <div
                key={ver.version}
                style={{
                  padding: "8px 11px",
                  borderRadius: 9,
                  background: "var(--bg-surface-elevated)",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                }}
              >
                <span>
                  <strong>{ver.version}</strong> — {ver.notes} (by {ver.publishedBy})
                </span>
                <span style={{ color: "var(--text-muted)" }}>
                  {formatSettingsTimestamp(ver.publishedAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 13. NOTIFICATION CONFIGURATION
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Bell size={18} style={{ color: "var(--primary)" }} />
          <h3 style={{ margin: 0, fontSize: 16.5, color: "var(--text-main)" }}>
            Delivery Channels & Notification Defaults
          </h3>
        </div>
        <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--text-secondary)" }}>
          Syncs with the Notifications module while separating platform delivery channels from
          individual member opt-out preferences. Zero external secrets stored in frontend.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 12,
            marginBottom: 18,
          }}
        >
          {state.notificationChannels.map((ch: NotificationChannelConfig) => (
            <div
              key={ch.id}
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
                borderRadius: 12,
                padding: 13,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: 14, color: "var(--text-main)" }}>
                    {ch.channel} Channel
                  </strong>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      padding: "2px 8px",
                      borderRadius: 999,
                      color:
                        ch.configurationStatus === "not_configured"
                          ? "var(--status-warning)"
                          : "var(--status-info)",
                      background:
                        ch.configurationStatus === "not_configured"
                          ? "var(--status-warning-bg)"
                          : "var(--status-info-bg)",
                    }}
                  >
                    {ch.configurationStatus.replace(/_/g, " ")}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
                  Provider: {ch.providerName}
                </div>
                {ch.lastFailureSummary && (
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, display: "flex", gap: 4 }}>
                    <AlertCircle size={12} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{ch.lastFailureSummary}</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                disabled={!canEditNotifications}
                onClick={() =>
                  onRequestConfirm({
                    title: `${ch.enabled ? "Disable" : "Enable"} ${ch.channel} Delivery Channel?`,
                    description: `Applies to system-wide ${ch.providerName} dispatch queue.`,
                    confirmLabel: ch.enabled ? "Disable Channel" : "Enable Channel",
                    danger: ch.enabled,
                    onConfirm: ({ reason }) => onToggleNotifChannel(ch.id, !ch.enabled, reason),
                  })
                }
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: ch.enabled ? "var(--status-success-bg)" : "var(--bg-card)",
                  color: ch.enabled ? "var(--status-success)" : "var(--text-muted)",
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: canEditNotifications ? "pointer" : "not-allowed",
                }}
              >
                {ch.enabled ? "Channel Enabled" : "Channel Paused"}
              </button>
            </div>
          ))}
        </div>

        {/* 14 Categories Matrix */}
        <h4 style={{ margin: "0 0 10px", fontSize: 14, color: "var(--text-main)" }}>
          Notification Category Matrix (14 NobleBond Event Streams)
        </h4>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                <th style={{ textAlign: "left", padding: "8px 10px" }}>Event Category</th>
                <th style={{ textAlign: "center", padding: "8px 10px" }}>In-App</th>
                <th style={{ textAlign: "center", padding: "8px 10px" }}>Push</th>
                <th style={{ textAlign: "center", padding: "8px 10px" }}>Email</th>
                <th style={{ textAlign: "center", padding: "8px 10px" }}>SMS</th>
                <th style={{ textAlign: "left", padding: "8px 10px" }}>Default Template Subject</th>
              </tr>
            </thead>
            <tbody>
              {state.notificationCategories.map((cat: NotificationCategoryConfig) => (
                <tr key={cat.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "8px 10px", fontWeight: 700, color: "var(--text-main)" }}>
                    {cat.categoryName}
                  </td>
                  {(["inAppEnabled", "pushEnabled", "emailEnabled", "smsEnabled"] as const).map(
                    (fld) => (
                      <td key={fld} style={{ textAlign: "center", padding: "8px 10px" }}>
                        <input
                          type="checkbox"
                          disabled={!canEditNotifications}
                          checked={cat[fld]}
                          onChange={(e) => onToggleNotifCategory(cat.id, fld, e.target.checked)}
                        />
                      </td>
                    )
                  )}
                  <td style={{ padding: "8px 10px", color: "var(--text-muted)" }}>
                    {cat.templateSubject}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

