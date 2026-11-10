import React, { useState } from "react";
import {
  Users,
  Send,
  AlertOctagon,
  Sliders,
  History,
  Download,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Ban,
} from "lucide-react";
import {
  evaluateAudienceSegment,
  exportDeliveryCsv,
  exportNotificationAuditCsv,
} from "../../../data/notificationsManagementDataService";
import type {
  AudienceSegmentPreset,
  NotificationProgramPreferences,
  NotificationsManagementState,
} from "../../../types/notificationsManagement.types";
import { formatChannelLabel, formatNotifDateTime, getStatusBadgeStyle } from "../notificationsUiUtils";

interface AudienceDeliveryFailedSettingsAuditSectionProps {
  state: NotificationsManagementState;
  mode: "audience" | "delivery_history" | "failed" | "settings" | "audit_history";
  onRetryDelivery: (logId: string) => void;
  onMarkFailureReviewed: (logId: string) => void;
  onSavePreferences: (prefs: NotificationProgramPreferences) => void;
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

export const AudienceDeliveryFailedSettingsAuditSection: React.FC<
  AudienceDeliveryFailedSettingsAuditSectionProps
> = ({
  state,
  mode,
  onRetryDelivery,
  onMarkFailureReviewed,
  onSavePreferences,
}) => {
  const [segment, setSegment] = useState<AudienceSegmentPreset>("all_eligible");
  const [countryFilter, setCountryFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState<"all" | "ios" | "android" | "web">("all");
  const [deliverySearch, setDeliverySearch] = useState("");
  const [deliveryChannelFilter, setDeliveryChannelFilter] = useState("all");
  const [failureCategoryFilter, setFailureCategoryFilter] = useState("all");
  const [prefsDraft, setPrefsDraft] = useState<NotificationProgramPreferences>(state.preferences);

  // 10. AUDIENCE & SEGMENTATION
  if (mode === "audience") {
    const evalSummary = evaluateAudienceSegment({
      segment,
      targetCountries: [countryFilter],
      targetPlatform: platformFilter,
      channel: "email",
    });

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Users size={18} style={{ color: "var(--primary)" }} />
            <h3 style={{ margin: 0, fontSize: 16.5, color: "var(--text-main)" }}>
              Audience Segmentation, Consent & Exclusion Evaluator
            </h3>
          </div>
          <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--text-secondary)" }}>
            Evaluates live against User Management records while masking email identifiers and
            automatically suppressing suspended, banned, opted-out, unverified, and cycle-capped
            accounts.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <label style={{ fontSize: 12 }}>
              Target Audience Segment
              <select
                value={segment}
                onChange={(e) => setSegment(e.target.value as AudienceSegmentPreset)}
                style={{ ...inputStyle, marginTop: 4 }}
              >
                <option value="all_eligible">All Eligible Members</option>
                <option value="active_users">Active Users (Last 30d)</option>
                <option value="new_users_7d">New Users (Last 7d)</option>
                <option value="inactive_users_30d">Inactive 30d – 6m</option>
                <option value="inactive_6_months">Inactive 6+ Months (Re-engagement)</option>
                <option value="birthday_cohort">Birthday Month Cohort</option>
                <option value="premium_subscribers">Premium Subscribers</option>
                <option value="free_users">Free Tier Members</option>
                <option value="verified_users">Verified Members</option>
                <option value="marketing_consented">Marketing Consented Only</option>
                <option value="ios_users">iOS Platform</option>
                <option value="android_users">Android Platform</option>
              </select>
            </label>

            <label style={{ fontSize: 12 }}>
              Country Filter
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                style={{ ...inputStyle, marginTop: 4 }}
              >
                <option value="all">All Countries</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Ghana">Ghana</option>
                <option value="France">France</option>
                <option value="Germany">Germany</option>
              </select>
            </label>

            <label style={{ fontSize: 12 }}>
              Device Platform
              <select
                value={platformFilter}
                onChange={(e) =>
                  setPlatformFilter(e.target.value as "all" | "ios" | "android" | "web")
                }
                style={{ ...inputStyle, marginTop: 4 }}
              >
                <option value="all">All Platforms</option>
                <option value="ios">iOS</option>
                <option value="android">Android</option>
                <option value="web">Web</option>
              </select>
            </label>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))",
              gap: 10,
              marginBottom: 16,
            }}
          >
            {[
              { label: "Total Directory Accounts", val: evalSummary.totalDirectoryUsers, tone: "var(--text-main)" },
              { label: "Eligible to Receive", val: evalSummary.eligibleCount, tone: "var(--status-success)" },
              { label: "Excluded: Suspended/Banned", val: evalSummary.breakdown.suspendedOrBanned, tone: "var(--status-error)" },
              { label: "Excluded: Opted Out Consent", val: evalSummary.breakdown.optedOutMarketing, tone: "var(--status-warning)" },
              { label: "Excluded: Unverified Email", val: evalSummary.breakdown.invalidOrUnverifiedEmail, tone: "var(--status-warning)" },
              { label: "Excluded: Cycle Dedupe", val: evalSummary.breakdown.cycleDuplicateOrCapped, tone: "var(--status-info)" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <div style={{ fontSize: 11.5, color: "var(--text-secondary)" }}>{stat.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: stat.tone, marginTop: 3 }}>
                  {stat.val}
                </div>
              </div>
            ))}
          </div>

          <h4 style={{ margin: "0 0 8px", fontSize: 14, color: "var(--text-main)" }}>
            Privacy-Redacted Sample Recipients (PII Masked)
          </h4>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Masked Reference</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Country</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Device</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Tier</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Consent Verification</th>
                </tr>
              </thead>
              <tbody>
                {evalSummary.sampleMaskedPreview.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "8px 10px", fontWeight: 700, color: "var(--text-main)" }}>
                      {row.maskedRef}
                    </td>
                    <td style={{ padding: "8px 10px" }}>{row.country}</td>
                    <td style={{ padding: "8px 10px" }}>{row.platform}</td>
                    <td style={{ padding: "8px 10px" }}>{row.tier}</td>
                    <td style={{ padding: "8px 10px", color: "var(--status-success)", fontWeight: 600 }}>
                      {row.eligibilityNote}
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

  // 11. DELIVERY HISTORY
  if (mode === "delivery_history") {
    const logs = state.deliveryLogs.filter((l) => {
      const q = deliverySearch.trim().toLowerCase();
      if (q && !l.campaignName.toLowerCase().includes(q) && !l.id.toLowerCase().includes(q)) {
        return false;
      }
      if (deliveryChannelFilter !== "all" && l.channel !== deliveryChannelFilter) return false;
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
                <Send size={18} style={{ color: "var(--primary)" }} />
                <h3 style={{ margin: 0, fontSize: 16.5, color: "var(--text-main)" }}>
                  Delivery Logs ({logs.length})
                </h3>
              </div>
              <p style={{ margin: "3px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>
                Distinguishes submitted/accepted (<code>sent</code>) from provider-confirmed{" "}
                <code>delivered</code>, <code>bounced</code>, and <code>suppressed</code> states.
              </p>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <input
                type="text"
                placeholder="Search ID or campaign..."
                value={deliverySearch}
                onChange={(e) => setDeliverySearch(e.target.value)}
                style={{ ...inputStyle, width: 190 }}
              />
              <select
                value={deliveryChannelFilter}
                onChange={(e) => setDeliveryChannelFilter(e.target.value)}
                style={{ ...inputStyle, width: "auto" }}
              >
                <option value="all">All Channels</option>
                <option value="push">Push</option>
                <option value="in_app">In-App</option>
                <option value="email">Email</option>
                <option value="push_and_in_app">Push + In-App</option>
              </select>
              <button
                type="button"
                onClick={() => exportDeliveryCsv(logs)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 12px",
                  borderRadius: 9,
                  border: "none",
                  background: "var(--primary)",
                  color: "#FFFFFF",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <Download size={13} /> Export CSV
              </button>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>ID / Campaign</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Recipient (Masked)</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Channel / Provider</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Status</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Sent / Confirmed</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => {
                  const badge = getStatusBadgeStyle(l.status);
                  return (
                    <tr key={l.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td style={{ padding: "9px 10px" }}>
                        <strong style={{ color: "var(--primary)" }}>{l.id}</strong>
                        <div style={{ fontWeight: 600, color: "var(--text-main)" }}>
                          {l.campaignName}
                        </div>
                      </td>
                      <td style={{ padding: "9px 10px", color: "var(--text-secondary)" }}>
                        {l.recipientRefMasked}
                      </td>
                      <td style={{ padding: "9px 10px" }}>
                        <div>{formatChannelLabel(l.channel)}</div>
                        <div style={{ fontSize: 10.5, color: "var(--text-muted)" }}>
                          {l.providerName} • {l.providerRef}
                        </div>
                      </td>
                      <td style={{ padding: "9px 10px" }}>
                        <span
                          style={{
                            fontSize: 10.5,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            padding: "2px 8px",
                            borderRadius: 999,
                            color: badge.color,
                            background: badge.bg,
                          }}
                        >
                          {l.status}
                        </span>
                      </td>
                      <td style={{ padding: "9px 10px", fontSize: 11.5, color: "var(--text-muted)" }}>
                        Sent: {formatNotifDateTime(l.sentAtIso)}
                        {l.confirmedDeliveredAtIso && (
                          <div>Delivered: {formatNotifDateTime(l.confirmedDeliveredAtIso)}</div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // 12. FAILED & BOUNCED NOTIFICATIONS
  if (mode === "failed") {
    const failedLogs = state.deliveryLogs.filter((l) => {
      const isFailure =
        l.status === "failed" || l.status === "bounced" || l.status === "suppressed";
      if (!isFailure) return false;
      if (failureCategoryFilter !== "all" && l.failureCategory !== failureCategoryFilter) {
        return false;
      }
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
                <AlertOctagon size={18} style={{ color: "var(--status-error)" }} />
                <h3 style={{ margin: 0, fontSize: 16.5, color: "var(--text-main)" }}>
                  Failed, Bounced & Suppressed Triage ({failedLogs.length})
                </h3>
              </div>
              <p style={{ margin: "3px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>
                Hard bounces and unsubscribed recipients are strictly blocked from infinite retry
                loops.
              </p>
            </div>

            <select
              value={failureCategoryFilter}
              onChange={(e) => setFailureCategoryFilter(e.target.value)}
              style={{ ...inputStyle, width: "auto" }}
            >
              <option value="all">All Failure Types</option>
              <option value="invalid_device_token">Invalid Device Token</option>
              <option value="bounced_email">Permanent Bounced Email</option>
              <option value="suppressed_recipient">Suppressed / Opted Out</option>
              <option value="failed_push">Failed Push</option>
              <option value="failed_email">Failed Email</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {failedLogs.map((l) => (
              <div
                key={l.id}
                style={{
                  padding: 13,
                  borderRadius: 12,
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-main)" }}>
                    {l.id}: {l.campaignName} ({l.recipientRefMasked})
                  </div>
                  <div style={{ fontSize: 12, color: "var(--status-error)", marginTop: 2 }}>
                    [{l.errorCode}] {l.failureReason}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>
                    Provider: {l.providerName} • Retries: {l.retryCount}/{l.maxRetries}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                  {l.retryEligible && l.retryCount < l.maxRetries ? (
                    <button
                      type="button"
                      onClick={() => onRetryDelivery(l.id)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "6px 11px",
                        borderRadius: 8,
                        border: "none",
                        background: "var(--primary)",
                        color: "#FFFFFF",
                        fontSize: 11.5,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      <RefreshCw size={12} /> Retry Eligible
                    </button>
                  ) : (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--status-error)",
                        background: "var(--status-error-bg)",
                        padding: "4px 9px",
                        borderRadius: 999,
                      }}
                    >
                      <Ban size={11} /> Retry Blocked
                    </span>
                  )}

                  {!l.reviewedByAdmin && (
                    <button
                      type="button"
                      onClick={() => onMarkFailureReviewed(l.id)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "6px 10px",
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                        background: "var(--bg-card)",
                        color: "var(--text-main)",
                        fontSize: 11.5,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      <CheckCircle2 size={12} /> Mark Reviewed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 14. NOTIFICATION SETTINGS (Frequency Caps, Quiet Hours, Consent Guard)
  if (mode === "settings") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Sliders size={18} style={{ color: "var(--primary)" }} />
            <h3 style={{ margin: 0, fontSize: 16.5, color: "var(--text-main)" }}>
              Notification Delivery, Frequency Caps & Quiet Hours
            </h3>
          </div>
          <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--text-secondary)" }}>
            Synchronized with System Settings (`support@noblebond.com`, no invented provider
            secrets). Protects members against promotional fatigue.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(215px, 1fr))",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <label style={{ fontSize: 12 }}>
              Configured Sender Name
              <input
                type="text"
                value={prefsDraft.defaultSenderName}
                onChange={(e) =>
                  setPrefsDraft({ ...prefsDraft, defaultSenderName: e.target.value })
                }
                style={{ ...inputStyle, marginTop: 4 }}
              />
            </label>
            <label style={{ fontSize: 12 }}>
              Configured Sender Email
              <input
                type="email"
                value={prefsDraft.configuredSenderEmail}
                onChange={(e) =>
                  setPrefsDraft({ ...prefsDraft, configuredSenderEmail: e.target.value })
                }
                style={{ ...inputStyle, marginTop: 4 }}
              />
            </label>
            <label style={{ fontSize: 12 }}>
              Max Promotional Push / User / Day
              <input
                type="number"
                min={1}
                max={10}
                value={prefsDraft.maxPromotionalPushPerDay}
                onChange={(e) =>
                  setPrefsDraft({
                    ...prefsDraft,
                    maxPromotionalPushPerDay: Number(e.target.value),
                  })
                }
                style={{ ...inputStyle, marginTop: 4 }}
              />
            </label>
            <label style={{ fontSize: 12 }}>
              Max Marketing Emails / User / Day
              <input
                type="number"
                min={1}
                max={5}
                value={prefsDraft.maxMarketingEmailsPerDay}
                onChange={(e) =>
                  setPrefsDraft({
                    ...prefsDraft,
                    maxMarketingEmailsPerDay: Number(e.target.value),
                  })
                }
                style={{ ...inputStyle, marginTop: 4 }}
              />
            </label>
            <label style={{ fontSize: 12 }}>
              Quiet Hours Window Start
              <input
                type="time"
                value={prefsDraft.quietHoursStart}
                onChange={(e) =>
                  setPrefsDraft({ ...prefsDraft, quietHoursStart: e.target.value })
                }
                style={{ ...inputStyle, marginTop: 4 }}
              />
            </label>
            <label style={{ fontSize: 12 }}>
              Quiet Hours Window End
              <input
                type="time"
                value={prefsDraft.quietHoursEnd}
                onChange={(e) =>
                  setPrefsDraft({ ...prefsDraft, quietHoursEnd: e.target.value })
                }
                style={{ ...inputStyle, marginTop: 4 }}
              />
            </label>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5, marginBottom: 14 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={prefsDraft.quietHoursEnabled}
                onChange={(e) =>
                  setPrefsDraft({ ...prefsDraft, quietHoursEnabled: e.target.checked })
                }
              />
              <span>Enforce Quiet Hours pause for optional marketing/promotional campaigns</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={prefsDraft.allowSecurityDuringQuietHours}
                onChange={(e) =>
                  setPrefsDraft({
                    ...prefsDraft,
                    allowSecurityDuringQuietHours: e.target.checked,
                  })
                }
              />
              <span>Allow Essential Security, OTP & Account Safety alerts during Quiet Hours</span>
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                color: "var(--status-success)",
                fontWeight: 600,
                paddingTop: 4,
              }}
            >
              <ShieldCheck size={15} />
              <span>Unsubscribe opt-out enforcement locked ON for promotional sends.</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSavePreferences(prefsDraft)}
            style={{
              padding: "9px 16px",
              borderRadius: 10,
              border: "none",
              background: "var(--primary)",
              color: "#FFFFFF",
              fontSize: 12.5,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Save Notification Governance Settings
          </button>
        </div>
      </div>
    );
  }

  // 15. NOTIFICATION AUDIT HISTORY
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
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <History size={18} style={{ color: "var(--status-info)" }} />
            <h3 style={{ margin: 0, fontSize: 16.5, color: "var(--text-main)" }}>
              Notification Dispatch & Automation Audit Trail ({state.auditLogs.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => exportNotificationAuditCsv(state.auditLogs)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 12px",
              borderRadius: 9,
              border: "none",
              background: "var(--primary)",
              color: "#FFFFFF",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <Download size={13} /> Export Audit CSV
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {state.auditLogs.map((log) => (
            <div
              key={log.id}
              style={{
                padding: "10px 12px",
                borderRadius: 11,
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: 8,
                fontSize: 12.5,
              }}
            >
              <div>
                <strong style={{ color: "var(--primary)" }}>{log.id}</strong> —{" "}
                <strong style={{ color: "var(--text-main)" }}>{log.targetName}</strong>
                <div style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 2 }}>
                  {log.summary} (by {log.actorName})
                </div>
              </div>
              <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                {formatNotifDateTime(log.timestampIso)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

