import React, { useState } from "react";
import {
  Zap,
  Calendar,
  Repeat,
  Clock,
  PauseCircle,
  PlayCircle,
  Edit3,
  AlertCircle,
  Gift,
  HeartHandshake,
  Mail,
} from "lucide-react";
import type {
  AutomationWorkflowRecord,
  NotificationsManagementState,
} from "../../../types/notificationsManagement.types";
import { formatChannelLabel, formatNotifDateTime, getStatusBadgeStyle } from "../notificationsUiUtils";

interface AutomationsScheduleRecurringSectionProps {
  state: NotificationsManagementState;
  mode: "automations" | "scheduled" | "recurring";
  onToggleAutomationStatus: (autId: string) => void;
  onUpdateAutomation: (next: AutomationWorkflowRecord) => void;
  onPreviewAutomationEmail: (aut: AutomationWorkflowRecord) => void;
  onCancelScheduledCampaign: (cmpId: string) => void;
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

export const AutomationsScheduleRecurringSection: React.FC<
  AutomationsScheduleRecurringSectionProps
> = ({
  state,
  mode,
  onToggleAutomationStatus,
  onUpdateAutomation,
  onPreviewAutomationEmail,
  onCancelScheduledCampaign,
}) => {
  const [editingAut, setEditingAut] = useState<AutomationWorkflowRecord | null>(null);
  const [typeFilter, setTypeFilter] = useState("all");

  // 7. SCHEDULED NOTIFICATIONS (+ Calendar Matrix)
  if (mode === "scheduled") {
    const scheduled = state.campaigns.filter((c) => c.status === "scheduled");
    const calendarEntries = [
      ...scheduled.map((c) => ({
        date: (c.scheduledForIso || "").slice(0, 10),
        title: c.name,
        channel: formatChannelLabel(c.channel),
        type: "One-Time Campaign",
      })),
      ...state.automations
        .filter((a) => a.nextExecutionIso && (a.status === "active" || a.status === "scheduled"))
        .map((a) => ({
          date: (a.nextExecutionIso || "").slice(0, 10),
          title: a.name,
          channel: formatChannelLabel(a.channel),
          type: a.seasonalEventDate ? `Seasonal (${a.seasonalEventDate})` : "Automated Cron",
        })),
    ].sort((a, b) => a.date.localeCompare(b.date));

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Calendar size={18} style={{ color: "var(--primary)" }} />
            <h3 style={{ margin: 0, fontSize: 16.5, color: "var(--text-main)" }}>
              Scheduled Campaigns & Dispatch Timeline
            </h3>
          </div>
          <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--text-secondary)" }}>
            Consolidated schedule combining upcoming campaigns plus active Birthday, Happy New
            Month, 6-Month Inactivity, Christmas, New Year & Halloween workflows.
          </p>

          <div
            style={{
              padding: 11,
              borderRadius: 11,
              background: "var(--status-warning-bg)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              marginBottom: 14,
            }}
          >
            <AlertCircle size={15} style={{ color: "var(--status-warning)", flexShrink: 0 }} />
            <span>
              <strong>Backend Scheduler Required:</strong> Real scheduled execution runs via server
              cron workers (never relies on an open admin browser tab).
            </span>
          </div>

          <h4 style={{ margin: "0 0 10px", fontSize: 14, color: "var(--text-main)" }}>
            Upcoming Campaign Schedule Queue ({scheduled.length})
          </h4>
          {scheduled.length === 0 ? (
            <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginBottom: 16 }}>
              No upcoming one-time campaigns scheduled.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 18 }}>
              {scheduled.map((cmp) => {
                const badge = getStatusBadgeStyle(cmp.status);
                return (
                  <div
                    key={cmp.id}
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
                        {cmp.name}
                      </div>
                      <div style={{ fontSize: 11.5, color: "var(--text-secondary)" }}>
                        {formatChannelLabel(cmp.channel)} • Est. {cmp.estimatedRecipients} members •{" "}
                        {formatNotifDateTime(cmp.scheduledForIso)} ({cmp.timezone})
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          padding: "2px 8px",
                          borderRadius: 999,
                          color: badge.color,
                          background: badge.bg,
                        }}
                      >
                        {cmp.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => onCancelScheduledCampaign(cmp.id)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: 8,
                          border: "1px solid var(--border)",
                          background: "var(--status-error-bg)",
                          color: "var(--status-error)",
                          fontSize: 11.5,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Calendar Agenda Grid */}
          <h4 style={{ margin: "0 0 10px", fontSize: 14, color: "var(--text-main)" }}>
            Upcoming Execution Calendar View
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(225px, 1fr))",
              gap: 10,
            }}
          >
            {calendarEntries.map((ev, idx) => (
              <div
                key={`${ev.date}_${idx}`}
                style={{
                  padding: 12,
                  borderRadius: 12,
                  background: "var(--bg-surface-elevated)",
                  borderLeft: "4px solid var(--primary)",
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 800, color: "var(--primary)" }}>
                  {ev.date || "Upcoming"} • {ev.type}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)", margin: "4px 0" }}>
                  {ev.title}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Channel: {ev.channel}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 8. RECURRING CAMPAIGNS VIEW
  if (mode === "recurring") {
    const recurringAutos = state.automations.filter(
      (a) => a.automationType !== "event_transactional"
    );
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Repeat size={18} style={{ color: "var(--accent-lavender)" }} />
            <h3 style={{ margin: 0, fontSize: 16.5, color: "var(--text-main)" }}>
              Recurring Lifecycle, Monthly & Annual Seasonal Schedules
            </h3>
          </div>
          <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--text-secondary)" }}>
            Every recurring schedule maintains an idempotent cycle lock key (e.g.{" "}
            <code>monthly-2026-12</code>, <code>birthday-2026</code>,{" "}
            <code>inactivity-cycle-180d</code>) preventing duplicate deliveries across scheduler
            retries.
          </p>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Recurring Campaign</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Cadence & Cycle Key</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Region Scope</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Next Scheduled</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Status</th>
                  <th style={{ textAlign: "right", padding: "8px 10px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recurringAutos.map((aut) => (
                  <tr key={aut.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "9px 10px", fontWeight: 700, color: "var(--text-main)" }}>
                      {aut.name}
                    </td>
                    <td style={{ padding: "9px 10px", fontSize: 11.5, color: "var(--text-secondary)" }}>
                      {aut.frequencyLimitRule}
                      <div style={{ fontSize: 10.5, color: "var(--text-muted)" }}>
                        Cycle lock: {aut.duplicateCycleKey}
                      </div>
                    </td>
                    <td style={{ padding: "9px 10px", fontSize: 11.5 }}>
                      {aut.targetCountries.join(", ")}
                    </td>
                    <td style={{ padding: "9px 10px", fontSize: 11.5 }}>
                      {aut.nextExecutionIso ? formatNotifDateTime(aut.nextExecutionIso) : "--"}
                    </td>
                    <td style={{ padding: "9px 10px" }}>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          padding: "2px 8px",
                          borderRadius: 999,
                          color:
                            aut.status === "active" || aut.status === "scheduled"
                              ? "var(--status-success)"
                              : "var(--status-warning)",
                          background:
                            aut.status === "active" || aut.status === "scheduled"
                              ? "var(--status-success-bg)"
                              : "var(--status-warning-bg)",
                        }}
                      >
                        {aut.status}
                      </span>
                    </td>
                    <td style={{ padding: "9px 10px", textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={() => onToggleAutomationStatus(aut.id)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: 7,
                          border: "1px solid var(--border)",
                          background: "var(--bg-surface-elevated)",
                          color: "var(--text-main)",
                          fontSize: 11.5,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {aut.status === "active" || aut.status === "scheduled" ? "Pause" : "Activate"}
                      </button>
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

  // 6. AUTOMATED NOTIFICATIONS DASHBOARD (Includes 6-Month Inactivity, Birthday, Happy New Month, Seasonal, Transactional)
  const filteredAutos = state.automations.filter((a) => {
    if (typeFilter === "all") return true;
    if (typeFilter === "seasonal") return a.automationType.startsWith("seasonal_");
    if (typeFilter === "transactional") return a.isEssentialTransactional;
    return a.automationType === typeFilter;
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
              <Zap size={18} style={{ color: "var(--primary)" }} />
              <h3 style={{ margin: 0, fontSize: 16.5, color: "var(--text-main)" }}>
                Automated Lifecycle, Seasonal & Event-Driven Workflows
              </h3>
            </div>
            <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--text-secondary)" }}>
              Includes 6-Month Inactivity Re-engagement, Birthday Celebration, Happy New Month,
              Christmas, New Year, Halloween, and Transactional App Triggers with cycle locks.
            </p>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ ...inputStyle, width: "auto" }}
          >
            <option value="all">All Workflows ({state.automations.length})</option>
            <option value="inactive_6_months">6-Month Inactivity Re-engagement</option>
            <option value="birthday">Birthday Celebration</option>
            <option value="happy_new_month">Happy New Month</option>
            <option value="seasonal">Seasonal & Holidays</option>
            <option value="transactional">Transactional Event Triggers</option>
          </select>
        </div>

        {/* Interactive Edit Panel if Admin Selected Edit */}
        {editingAut && (
          <div
            style={{
              marginBottom: 16,
              padding: 15,
              borderRadius: 14,
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--primary)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-main)" }}>
              Configure Automation: {editingAut.name}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                gap: 10,
              }}
            >
              {editingAut.automationType === "inactive_6_months" && (
                <label style={{ fontSize: 12 }}>
                  Inactivity Threshold (Months)
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={editingAut.inactivityMonths ?? 6}
                    onChange={(e) =>
                      setEditingAut({ ...editingAut, inactivityMonths: Number(e.target.value) })
                    }
                    style={{ ...inputStyle, marginTop: 4 }}
                  />
                </label>
              )}

              <label style={{ fontSize: 12 }}>
                Local Send Time
                <input
                  type="text"
                  value={editingAut.sendTimeLocal}
                  onChange={(e) => setEditingAut({ ...editingAut, sendTimeLocal: e.target.value })}
                  style={{ ...inputStyle, marginTop: 4 }}
                />
              </label>

              <label style={{ fontSize: 12 }}>
                Default Fallback Timezone
                <select
                  value={editingAut.defaultTimezone}
                  onChange={(e) =>
                    setEditingAut({ ...editingAut, defaultTimezone: e.target.value })
                  }
                  style={{ ...inputStyle, marginTop: 4 }}
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Africa/Lagos">Africa/Lagos</option>
                </select>
              </label>

              <label style={{ fontSize: 12 }}>
                Max Recipients Per Run
                <input
                  type="number"
                  value={editingAut.maxRecipientsPerRun}
                  onChange={(e) =>
                    setEditingAut({ ...editingAut, maxRecipientsPerRun: Number(e.target.value) })
                  }
                  style={{ ...inputStyle, marginTop: 4 }}
                />
              </label>

              <label style={{ fontSize: 12 }}>
                Target Country Filter
                <input
                  type="text"
                  placeholder="Comma separated or 'all'"
                  value={editingAut.targetCountries.join(", ")}
                  onChange={(e) =>
                    setEditingAut({
                      ...editingAut,
                      targetCountries: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  style={{ ...inputStyle, marginTop: 4 }}
                />
              </label>
            </div>

            <label style={{ fontSize: 12 }}>
              Email Subject Line
              <input
                type="text"
                value={editingAut.emailSubject}
                onChange={(e) => setEditingAut({ ...editingAut, emailSubject: e.target.value })}
                style={{ ...inputStyle, marginTop: 4 }}
              />
            </label>

            <label style={{ fontSize: 12 }}>
              Headline
              <input
                type="text"
                value={editingAut.emailHeading}
                onChange={(e) => setEditingAut({ ...editingAut, emailHeading: e.target.value })}
                style={{ ...inputStyle, marginTop: 4 }}
              />
            </label>

            <label style={{ fontSize: 12 }}>
              Email Body Message
              <textarea
                rows={3}
                value={editingAut.emailBody}
                onChange={(e) => setEditingAut({ ...editingAut, emailBody: e.target.value })}
                style={{ ...inputStyle, marginTop: 4 }}
              />
            </label>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setEditingAut(null)}
                style={{ ...inputStyle, width: "auto", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateAutomation(editingAut);
                  setEditingAut(null);
                }}
                style={{
                  padding: "8px 14px",
                  borderRadius: 9,
                  border: "none",
                  background: "var(--primary)",
                  color: "#FFFFFF",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Save Automation Rules
              </button>
            </div>
          </div>
        )}

        {/* Automation Cards List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredAutos.map((aut) => {
            const isPausedOrDraft = aut.status === "paused" || aut.status === "draft";
            return (
              <div
                key={aut.id}
                style={{
                  padding: 15,
                  borderRadius: 14,
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 9,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 8,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {aut.isEssentialTransactional ? (
                      <HeartHandshake size={17} style={{ color: "var(--status-success)" }} />
                    ) : aut.automationType.startsWith("seasonal_") ||
                      aut.automationType === "birthday" ? (
                      <Gift size={17} style={{ color: "var(--accent-champagne)" }} />
                    ) : (
                      <Mail size={17} style={{ color: "var(--primary)" }} />
                    )}
                    <div>
                      <div style={{ fontSize: 14.5, fontWeight: 800, color: "var(--text-main)" }}>
                        {aut.name}
                      </div>
                      <div style={{ fontSize: 11.5, color: "var(--text-secondary)" }}>
                        {formatChannelLabel(aut.channel)} •{" "}
                        {aut.isEssentialTransactional
                          ? "Essential Transactional Hook"
                          : "Marketing / Engagement Workflow"}
                        {aut.seasonalEventDate ? ` • Event Date: ${aut.seasonalEventDate}` : ""}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      padding: "3px 9px",
                      borderRadius: 999,
                      color:
                        aut.status === "active" || aut.status === "scheduled"
                          ? "var(--status-success)"
                          : "var(--status-warning)",
                      background:
                        aut.status === "active" || aut.status === "scheduled"
                          ? "var(--status-success-bg)"
                          : "var(--status-warning-bg)",
                    }}
                  >
                    {aut.status}
                  </span>
                </div>

                <div style={{ fontSize: 12.5, color: "var(--text-main)", lineHeight: 1.45 }}>
                  <strong>Trigger:</strong> {aut.triggerDescription}
                </div>
                <div style={{ fontSize: 11.5, color: "var(--text-secondary)", lineHeight: 1.45 }}>
                  <strong>Qualifying & Anti-Duplicate Safeguard:</strong>{" "}
                  {aut.qualifyingActivityNote} ({aut.frequencyLimitRule})
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))",
                    gap: 8,
                    padding: 10,
                    borderRadius: 10,
                    background: "var(--bg-card)",
                    fontSize: 11.5,
                  }}
                >
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Eligible Now:</span>{" "}
                    <strong style={{ color: "var(--primary)" }}>{aut.eligibleUsersCount}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Sent / Delivered:</span>{" "}
                    <strong>
                      {aut.sentTotal} / {aut.deliveredTotal}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Suppressed / Bounced:</span>{" "}
                    <strong style={{ color: "var(--status-warning)" }}>
                      {aut.suppressedTotal} / {aut.bouncedTotal}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Exclusions:</span>{" "}
                    <strong>{aut.exclusions.length} active rules</strong>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                    paddingTop: 6,
                    fontSize: 11.5,
                    color: "var(--text-muted)",
                  }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <Clock size={12} /> Next Run:{" "}
                    {aut.nextExecutionIso ? formatNotifDateTime(aut.nextExecutionIso) : "Real-time Event"}
                    {" • "}Countries: {aut.targetCountries.join(", ")}
                  </span>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    <button
                      type="button"
                      onClick={() => onPreviewAutomationEmail(aut)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "5px 10px",
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                        background: "var(--bg-card)",
                        color: "var(--primary)",
                        fontSize: 11.5,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      <Mail size={12} /> Preview Email in Composer
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingAut(aut)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "5px 10px",
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                        background: "var(--bg-card)",
                        color: "var(--text-main)",
                        fontSize: 11.5,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      <Edit3 size={12} /> Configure Rules & Copy
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleAutomationStatus(aut.id)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "5px 11px",
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                        background: isPausedOrDraft
                          ? "var(--status-success-bg)"
                          : "var(--status-warning-bg)",
                        color: isPausedOrDraft ? "var(--status-success)" : "var(--status-warning)",
                        fontSize: 11.5,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {isPausedOrDraft ? <PlayCircle size={12} /> : <PauseCircle size={12} />}
                      <span>{isPausedOrDraft ? "Activate" : "Pause"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

