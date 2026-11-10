import React, { useState } from "react";
import { Sliders, Clock, Bell, Smile, AlertCircle, Lock } from "lucide-react";
import type {
  SupportProgramSettings,
  SupportRolePermissions,
  TicketPriority,
} from "../../types/supportManagement.types";
import { Badge } from "../common/Badge";
import { formatDateTime } from "./supportUiUtils";

interface SupportSettingsSectionProps {
  settings: SupportProgramSettings;
  permissions: SupportRolePermissions;
  onRequestSaveSettings: (next: SupportProgramSettings, reason: string) => void;
}

export const SupportSettingsSection: React.FC<SupportSettingsSectionProps> = ({
  settings,
  permissions,
  onRequestSaveSettings,
}) => {
  const [draft, setDraft] = useState<SupportProgramSettings>(() => ({ ...settings }));
  const [auditReason, setAuditReason] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    if (!permissions.canManageSettings) {
      setErr(`Role "${permissions.roleLabel}" does not have permission to change support settings.`);
      return;
    }
    if (draft.allowReopenDays < 1 || draft.allowReopenDays > 90) {
      setErr("Ticket reopen window must be between 1 and 90 days.");
      return;
    }
    if (auditReason.trim().length < 5) {
      setErr("Provide a mandatory audit reason (min 5 characters) before saving.");
      return;
    }

    onRequestSaveSettings(draft, auditReason.trim());
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px 18px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "var(--primary-glow)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sliders size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>
              Customer Support Configuration &amp; SLA Targets
            </h3>
            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
              Last updated: {formatDateTime(settings.lastUpdatedAt)} by {settings.lastUpdatedBy} (Demo configuration state)
            </div>
          </div>
        </div>
        <Badge variant={permissions.canManageSettings ? "success" : "warning"} size="sm">
          {permissions.canManageSettings ? "Authorized to Edit" : "Read-Only for Role"}
        </Badge>
      </div>

      {/* Section A & B Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
        {/* A: Ticket Configuration */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px", display: "flex", flexDirection: "column", gap: "11px" }}>
          <div style={{ fontWeight: 700, fontSize: "0.96rem", color: "var(--text-main)" }}>
            A. Ticket Configuration &amp; Reopening Rules
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-main)" }}>
              Ticket ID Prefix
              <input
                disabled={!permissions.canManageSettings}
                value={draft.ticketIdPrefix}
                onChange={(e) => setDraft({ ...draft, ticketIdPrefix: e.target.value })}
                style={{ width: "100%", marginTop: "4px", padding: "8px 10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)" }}
              />
            </label>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-main)" }}>
              Default Priority
              <select
                disabled={!permissions.canManageSettings}
                value={draft.defaultPriority}
                onChange={(e) => setDraft({ ...draft, defaultPriority: e.target.value as TicketPriority })}
                style={{ width: "100%", marginTop: "4px", padding: "8px 10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)" }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </label>
          </div>

          <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-main)" }}>
            Default Triage Category
            <input
              disabled={!permissions.canManageSettings}
              value={draft.defaultCategory}
              onChange={(e) => setDraft({ ...draft, defaultCategory: e.target.value })}
              style={{ width: "100%", marginTop: "4px", padding: "8px 10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)" }}
            />
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-main)" }}>
              Allow Reopen Window (Days)
              <input
                type="number"
                min={1}
                max={90}
                disabled={!permissions.canManageSettings}
                value={draft.allowReopenDays}
                onChange={(e) => setDraft({ ...draft, allowReopenDays: Number(e.target.value) })}
                style={{ width: "100%", marginTop: "4px", padding: "8px 10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)" }}
              />
            </label>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-main)" }}>
              Lock Closed After (Days)
              <input
                type="number"
                min={7}
                max={180}
                disabled={!permissions.canManageSettings}
                value={draft.lockClosedTicketsAfterDays}
                onChange={(e) => setDraft({ ...draft, lockClosedTicketsAfterDays: Number(e.target.value) })}
                style={{ width: "100%", marginTop: "4px", padding: "8px 10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)" }}
              />
            </label>
          </div>
        </div>

        {/* B: Response Targets & SLA */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px", display: "flex", flexDirection: "column", gap: "11px" }}>
          <div style={{ fontWeight: 700, fontSize: "0.96rem", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "7px" }}>
            <Clock size={16} style={{ color: "var(--status-info)" }} />
            B. Response Targets (SLA Minutes)
          </div>

          <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-main)" }}>
            Operating Hours Reference
            <input
              disabled={!permissions.canManageSettings}
              value={draft.businessHoursLabel}
              onChange={(e) => setDraft({ ...draft, businessHoursLabel: e.target.value })}
              style={{ width: "100%", marginTop: "4px", padding: "8px 10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)" }}
            />
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {(["urgent", "high", "medium", "low"] as const).map((pr) => (
              <label key={pr} style={{ fontSize: "0.76rem", fontWeight: 600, color: "var(--text-main)" }}>
                {pr.toUpperCase()} 1st Reply Target (mins)
                <input
                  type="number"
                  min={5}
                  max={2880}
                  disabled={!permissions.canManageSettings}
                  value={draft.slaFirstResponseMinutes[pr]}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      slaFirstResponseMinutes: {
                        ...draft.slaFirstResponseMinutes,
                        [pr]: Number(e.target.value),
                      },
                    })
                  }
                  style={{ width: "100%", marginTop: "4px", padding: "7px 9px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)" }}
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Section D & E: Notification Readiness + CSAT + Save */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "6px" }}>
              <Bell size={16} style={{ color: "var(--status-warning)" }} />
              D. Notification Triggers (Demo Preferences)
            </span>
            <Badge variant="neutral" size="sm">Provider Pending</Badge>
          </div>
          <div style={{ fontSize: "0.73rem", color: "var(--text-muted)" }}>
            Email/Push notification providers are not connected yet; toggles save local configuration preferences only.
          </div>
          {([
            { key: "notifyNewTicket", label: "New Support Ticket Created" },
            { key: "notifyCustomerReply", label: "Customer Reply Received" },
            { key: "notifyEscalation", label: "Ticket Escalated to Specialist" },
            { key: "notifySlaBreach", label: "SLA Target Approaching / Overdue" },
          ] as const).map((item) => (
            <label key={item.key} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "var(--text-main)", cursor: "pointer" }}>
              <input
                type="checkbox"
                disabled={!permissions.canManageSettings}
                checked={draft[item.key]}
                onChange={(e) => setDraft({ ...draft, [item.key]: e.target.checked })}
                style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }}
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "6px" }}>
              <Smile size={16} style={{ color: "var(--status-success)" }} />
              E. CSAT Survey &amp; Audit Confirmation
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.81rem", color: "var(--text-main)", cursor: "pointer" }}>
              <input
                type="checkbox"
                disabled={!permissions.canManageSettings}
                checked={draft.collectCsatFeedback}
                onChange={(e) => setDraft({ ...draft, collectCsatFeedback: e.target.checked })}
                style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }}
              />
              <span>Request post-resolution CSAT survey after ticket closure</span>
            </label>

            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-main)" }}>
              Mandatory Audit Reason
              <input
                disabled={!permissions.canManageSettings}
                value={auditReason}
                onChange={(e) => setAuditReason(e.target.value)}
                placeholder="Document reason for Support Audit History..."
                style={{ width: "100%", marginTop: "4px", padding: "9px 10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)" }}
              />
            </label>

            {err && (
              <div style={{ padding: "8px 11px", borderRadius: "8px", background: "var(--status-error-bg)", color: "var(--status-error)", fontSize: "0.78rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                <AlertCircle size={14} />
                <span>{err}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!permissions.canManageSettings}
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              border: "none",
              background: permissions.canManageSettings ? "var(--primary)" : "var(--bg-surface-elevated)",
              color: permissions.canManageSettings ? "#fff" : "var(--text-muted)",
              fontSize: "0.83rem",
              fontWeight: 700,
              cursor: permissions.canManageSettings ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            {!permissions.canManageSettings && <Lock size={13} />}
            <span>
              {permissions.canManageSettings
                ? "Review & Save Support Configuration"
                : `Locked for Role: ${permissions.roleLabel}`}
            </span>
          </button>
        </div>
      </div>
    </form>
  );
};

