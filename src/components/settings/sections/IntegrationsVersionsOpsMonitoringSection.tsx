import React, { useState } from "react";
import {
  CreditCard,
  Plug,
  Smartphone,
  Wrench,
  BellRing,
  Lock,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import type {
  AppVersionRecord,
  ExternalIntegrationRecord,
  PaymentIntegrationRecord,
  SystemAlertRecord,
  SystemSettingsRootState,
} from "../../../types/systemSettings.types";
import type { ConfirmActionRequest } from "./sharedSectionTypes";
import { formatSettingsTimestamp, getAlertSeverityColors } from "../settingsUiUtils";

interface IntegrationsVersionsOpsMonitoringSectionProps {
  state: SystemSettingsRootState;
  mode: "payments" | "integrations" | "app_versions" | "maintenance_ops" | "monitoring_alerts";
  canManagePayments: boolean;
  canManageIntegrations: boolean;
  canManageMaintenance: boolean;
  onTogglePaymentMode: (
    payId: string,
    env: PaymentIntegrationRecord["environment"],
    reason: string
  ) => void;
  onTestIntegration: (intId: string) => void;
  onToggleIntegration: (intId: string, enabled: boolean, reason: string) => void;
  onSaveAppVersion: (ver: AppVersionRecord, publish: boolean, reason: string) => void;
  onSetMaintenanceMode: (
    nextStatus: SystemSettingsRootState["maintenance"]["status"],
    message: string,
    expectedEndAt: string | null,
    allowAdminBypass: boolean,
    reason: string
  ) => void;
  onUpdateAlert: (
    alertId: string,
    status: SystemAlertRecord["status"],
    note?: string
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

export const IntegrationsVersionsOpsMonitoringSection: React.FC<
  IntegrationsVersionsOpsMonitoringSectionProps
> = ({
  state,
  mode,
  canManagePayments,
  canManageIntegrations,
  canManageMaintenance,
  onTogglePaymentMode,
  onTestIntegration,
  onToggleIntegration,
  onSaveAppVersion,
  onSetMaintenanceMode,
  onUpdateAlert,
  onRequestConfirm,
}) => {
  const [editingVer, setEditingVer] = useState<AppVersionRecord | null>(null);
  const [maintMsg, setMaintMsg] = useState(state.maintenance.maintenanceMessage);
  const [maintEnd, setMaintEnd] = useState(state.maintenance.expectedEndAt || "");
  const [maintBypass, setMaintBypass] = useState(state.maintenance.allowAdminAccessDuringMaintenance);
  const [alertNoteDrafts, setAlertNoteDrafts] = useState<Record<string, string>>({});

  // 14. PAYMENT & BILLING INTEGRATIONS
  if (mode === "payments") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            padding: 13,
            borderRadius: 14,
            background: "var(--status-error-bg)",
            border: "1px solid var(--border-light)",
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <Lock size={17} style={{ color: "var(--status-error)", flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 12.5, color: "var(--text-main)", lineHeight: 1.5 }}>
            <strong>Zero Secret Key Exposure Enforced:</strong> Secret API keys, webhook signing
            secrets, and Apple/Google Play billing private keys are stored solely in backend server
            secret vaults — never in browser local storage or React bundles.
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
            gap: 14,
          }}
        >
          {state.paymentIntegrations.map((pay: PaymentIntegrationRecord) => (
            <div key={pay.id} style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CreditCard size={18} style={{ color: "var(--primary)" }} />
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-main)" }}>
                      {pay.providerName}
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{pay.channelLabel}</div>
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
                      pay.environment === "production"
                        ? "var(--status-success)"
                        : pay.environment === "sandbox_test"
                          ? "var(--status-info)"
                          : "var(--status-warning)",
                    background:
                      pay.environment === "production"
                        ? "var(--status-success-bg)"
                        : pay.environment === "sandbox_test"
                          ? "var(--status-info-bg)"
                          : "var(--status-warning-bg)",
                  }}
                >
                  {pay.environment.replace("_", " ")}
                </span>
              </div>

              <div
                style={{
                  margin: "12px 0",
                  padding: 10,
                  borderRadius: 10,
                  background: "var(--bg-surface-elevated)",
                  fontSize: 11.5,
                  color: "var(--text-secondary)",
                }}
              >
                <div>
                  <strong>Credential Reference:</strong> {pay.maskedCredentialRef}
                </div>
                <div style={{ marginTop: 4 }}>
                  <strong>Supported Currencies:</strong> {pay.supportedCurrencies.join(", ")}
                </div>
                <div style={{ marginTop: 4 }}>
                  <strong>Webhook Status:</strong> {pay.webhookStatus.replace("_", " ")} • Config{" "}
                  {pay.configVersion}
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
                {pay.enabledFeatures.map((f) => (
                  <span
                    key={f}
                    style={{
                      fontSize: 10.5,
                      background: "var(--bg-surface-elevated)",
                      padding: "2px 8px",
                      borderRadius: 999,
                      color: "var(--text-main)",
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <a
                  href={pay.docsUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--primary)",
                    textDecoration: "none",
                  }}
                >
                  <span>Provider Docs</span>
                  <ExternalLink size={12} />
                </a>

                {pay.connectionStatus !== "not_configured" && (
                  <button
                    type="button"
                    disabled={!canManagePayments}
                    onClick={() =>
                      onRequestConfirm({
                        title: `Switch ${pay.providerName} Environment?`,
                        description: `Propose switching demo flag between Sandbox and Production.`,
                        impactWarning:
                          "Production billing mode switching requires verified server API secrets and Two-Person Approval in production deployment.",
                        requireReauth: true,
                        allowTwoPersonStage: true,
                        danger: true,
                        confirmLabel: "Update Mode",
                        onConfirm: ({ reason }) =>
                          onTogglePaymentMode(
                            pay.id,
                            pay.environment === "production" ? "sandbox_test" : "production",
                            reason
                          ),
                      })
                    }
                    style={{
                      padding: "6px 11px",
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: "var(--bg-surface-elevated)",
                      color: canManagePayments ? "var(--text-main)" : "var(--text-muted)",
                      fontSize: 11.5,
                      fontWeight: 700,
                      cursor: canManagePayments ? "pointer" : "not-allowed",
                    }}
                  >
                    Switch Test / Prod Mode
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 15. API & EXTERNAL INTEGRATIONS
  if (mode === "integrations") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Plug size={18} style={{ color: "var(--accent-lavender)" }} />
            <h3 style={{ margin: 0, fontSize: 16.5, color: "var(--text-main)" }}>
              API & External Infrastructure Connectors
            </h3>
          </div>
          <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--text-secondary)" }}>
            Honest connectivity matrix — unconnected providers remain explicitly marked Unavailable
            until live backend health endpoints are configured.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: 12,
            }}
          >
            {state.externalIntegrations.map((intg: ExternalIntegrationRecord) => (
              <div
                key={intg.id}
                style={{
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  borderRadius: 12,
                  padding: 13,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 9,
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-main)" }}>
                        {intg.name}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        {intg.category} • {intg.provider}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "2px 8px",
                        borderRadius: 999,
                        color:
                          intg.connectionStatus === "healthy"
                            ? "var(--status-success)"
                            : intg.connectionStatus === "unavailable"
                              ? "var(--status-warning)"
                              : "var(--status-info)",
                        background:
                          intg.connectionStatus === "healthy"
                            ? "var(--status-success-bg)"
                            : intg.connectionStatus === "unavailable"
                              ? "var(--status-warning-bg)"
                              : "var(--status-info-bg)",
                      }}
                    >
                      {intg.connectionStatus}
                    </span>
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 6 }}>
                    Ref: {intg.maskedRef}
                  </div>
                  {intg.lastError && (
                    <div style={{ fontSize: 11, color: "var(--status-warning)", marginTop: 4 }}>
                      {intg.lastError}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: 8, paddingTop: 8, borderTop: "1px solid var(--border-light)" }}>
                  <button
                    type="button"
                    onClick={() => onTestIntegration(intg.id)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
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
                    <RefreshCw size={11} />
                    <span>Check Readiness</span>
                  </button>
                  <button
                    type="button"
                    disabled={!canManageIntegrations}
                    onClick={() =>
                      onRequestConfirm({
                        title: `${intg.enabled ? "Disable" : "Enable"} ${intg.name}?`,
                        description: "Updates connector active flag in local configuration.",
                        confirmLabel: intg.enabled ? "Disable Connector" : "Enable Connector",
                        onConfirm: ({ reason }) =>
                          onToggleIntegration(intg.id, !intg.enabled, reason),
                      })
                    }
                    style={{
                      padding: "5px 10px",
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: intg.enabled ? "var(--status-success-bg)" : "var(--bg-card)",
                      color: intg.enabled ? "var(--status-success)" : "var(--text-muted)",
                      fontSize: 11.5,
                      fontWeight: 700,
                      cursor: canManageIntegrations ? "pointer" : "not-allowed",
                    }}
                  >
                    {intg.enabled ? "Enabled" : "Disabled"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 16. APPLICATION & VERSION MANAGEMENT
  if (mode === "app_versions") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Smartphone size={18} style={{ color: "var(--primary)" }} />
            <h3 style={{ margin: 0, fontSize: 16.5, color: "var(--text-main)" }}>
              Mobile & Web Release Version Control
            </h3>
          </div>
          <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--text-secondary)" }}>
            Initialized directly from mobile `app.json` (`1.0.0`). Mandatory update policies take
            real effect only once mobile clients query an active server `/app-config/version`
            endpoint.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 14,
            }}
          >
            {state.appVersions.map((ver) => (
              <div
                key={ver.id}
                style={{
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  borderRadius: 14,
                  padding: 14,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ fontSize: 15, color: "var(--text-main)" }}>
                      {ver.platform} Client
                    </strong>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "2px 8px",
                        borderRadius: 999,
                        background:
                          ver.publishState === "published"
                            ? "var(--status-success-bg)"
                            : "var(--status-warning-bg)",
                        color:
                          ver.publishState === "published"
                            ? "var(--status-success)"
                            : "var(--status-warning)",
                      }}
                    >
                      {ver.publishState.replace("_", " ")}
                    </span>
                  </div>
                  <div style={{ fontSize: 12.5, marginTop: 8 }}>
                    Current Live: <strong>v{ver.currentVersion}</strong> • Minimum Allowed:{" "}
                    <strong>v{ver.minimumSupportedVersion}</strong>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
                    Policy: <strong style={{ textTransform: "capitalize" }}>{ver.updatePolicy}</strong>{" "}
                    Update
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 6 }}>
                    {ver.releaseNotes}
                  </div>
                </div>

                {canManageIntegrations && (
                  <button
                    type="button"
                    onClick={() => setEditingVer(ver)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: "var(--bg-card)",
                      color: "var(--primary)",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      alignSelf: "flex-start",
                    }}
                  >
                    Edit Version Policy
                  </button>
                )}
              </div>
            ))}
          </div>

          {editingVer && (
            <div
              style={{
                marginTop: 16,
                padding: 14,
                borderRadius: 12,
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--primary)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <strong style={{ fontSize: 14, color: "var(--text-main)" }}>
                Editing {editingVer.platform} Release Policy
              </strong>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
                <label style={{ fontSize: 12 }}>
                  Latest Version
                  <input
                    type="text"
                    value={editingVer.latestAvailableVersion}
                    onChange={(e) =>
                      setEditingVer({ ...editingVer, latestAvailableVersion: e.target.value })
                    }
                    style={inputStyle}
                  />
                </label>
                <label style={{ fontSize: 12 }}>
                  Minimum Supported
                  <input
                    type="text"
                    value={editingVer.minimumSupportedVersion}
                    onChange={(e) =>
                      setEditingVer({ ...editingVer, minimumSupportedVersion: e.target.value })
                    }
                    style={inputStyle}
                  />
                </label>
                <label style={{ fontSize: 12 }}>
                  Update Policy
                  <select
                    value={editingVer.updatePolicy}
                    onChange={(e) =>
                      setEditingVer({
                        ...editingVer,
                        updatePolicy: e.target.value as AppVersionRecord["updatePolicy"],
                      })
                    }
                    style={inputStyle}
                  >
                    <option value="optional">Optional Update</option>
                    <option value="recommended">Recommended Update</option>
                    <option value="mandatory">Mandatory Force Upgrade</option>
                  </select>
                </label>
              </div>
              <textarea
                rows={2}
                value={editingVer.releaseNotes}
                onChange={(e) => setEditingVer({ ...editingVer, releaseNotes: e.target.value })}
                style={inputStyle}
              />
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setEditingVer(null)}
                  style={{ ...inputStyle, width: "auto", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSaveAppVersion(editingVer, false, "Saved app version draft");
                    setEditingVer(null);
                  }}
                  style={{ ...inputStyle, width: "auto", cursor: "pointer", fontWeight: 700 }}
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onRequestConfirm({
                      title: `Publish ${editingVer.platform} Version Configuration?`,
                      description: `Minimum version: ${editingVer.minimumSupportedVersion} (${editingVer.updatePolicy}).`,
                      danger: editingVer.updatePolicy === "mandatory",
                      confirmLabel: "Publish Version Policy",
                      onConfirm: ({ reason }) => {
                        onSaveAppVersion(editingVer, true, reason);
                        setEditingVer(null);
                      },
                    })
                  }
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
                  Publish Policy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 17. MAINTENANCE & SYSTEM OPERATIONS
  if (mode === "maintenance_ops") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* A. Controlled Maintenance Workflow */}
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Wrench size={18} style={{ color: "var(--status-warning)" }} />
            <h3 style={{ margin: 0, fontSize: 16.5, color: "var(--text-main)" }}>
              A. Controlled Platform Maintenance Operations
            </h3>
          </div>
          <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "var(--text-secondary)" }}>
            Current Demonstration State:{" "}
            <strong style={{ color: "var(--primary)", textTransform: "uppercase" }}>
              {state.maintenance.status.replace("_", " ")}
            </strong>{" "}
            — Activating maintenance here visibly demonstrates console banners without taking live
            production infrastructure offline.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <label style={{ fontSize: 12 }}>
              <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                User-Facing Maintenance Message
              </span>
              <textarea
                rows={2}
                disabled={!canManageMaintenance}
                value={maintMsg}
                onChange={(e) => setMaintMsg(e.target.value)}
                style={{ ...inputStyle, marginTop: 4 }}
              />
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
              <label style={{ fontSize: 12 }}>
                <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                  Expected Window Completion (Optional ISO/Text)
                </span>
                <input
                  type="text"
                  disabled={!canManageMaintenance}
                  placeholder="e.g., 2026-11-11 04:00 UTC"
                  value={maintEnd}
                  onChange={(e) => setMaintEnd(e.target.value)}
                  style={{ ...inputStyle, marginTop: 4 }}
                />
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, marginTop: 18 }}>
                <input
                  type="checkbox"
                  disabled={!canManageMaintenance}
                  checked={maintBypass}
                  onChange={(e) => setMaintBypass(e.target.checked)}
                />
                <span>Keep Admin Console accessible during Maintenance Mode</span>
              </label>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
              {state.maintenance.status !== "maintenance_mode" ? (
                <button
                  type="button"
                  disabled={!canManageMaintenance}
                  onClick={() =>
                    onRequestConfirm({
                      title: "Activate Demonstration Maintenance Mode?",
                      description: "Prepares visible maintenance banner across admin configuration.",
                      impactWarning:
                        "Requires Two-Person Approval or Super Admin confirmation before shifting real production API traffic.",
                      danger: true,
                      requireReauth: true,
                      allowTwoPersonStage: true,
                      confirmLabel: "Activate Demo Maintenance",
                      onConfirm: ({ reason }) =>
                        onSetMaintenanceMode(
                          "maintenance_mode",
                          maintMsg,
                          maintEnd || null,
                          maintBypass,
                          reason
                        ),
                    })
                  }
                  style={{
                    padding: "8px 14px",
                    borderRadius: 9,
                    border: "none",
                    background: canManageMaintenance ? "var(--status-error)" : "var(--bg-surface-elevated)",
                    color: canManageMaintenance ? "#FFFFFF" : "var(--text-muted)",
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: canManageMaintenance ? "pointer" : "not-allowed",
                  }}
                >
                  Start Demo Maintenance Mode
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!canManageMaintenance}
                  onClick={() =>
                    onRequestConfirm({
                      title: "Deactivate Maintenance Mode?",
                      description: "Restores Normal Operational state in configuration.",
                      confirmLabel: "Restore Operational Status",
                      onConfirm: ({ reason }) =>
                        onSetMaintenanceMode("operational", maintMsg, null, maintBypass, reason),
                    })
                  }
                  style={{
                    padding: "8px 14px",
                    borderRadius: 9,
                    border: "none",
                    background: "var(--status-success)",
                    color: "#FFFFFF",
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: canManageMaintenance ? "pointer" : "not-allowed",
                  }}
                >
                  Restore Operational State
                </button>
              )}
            </div>
          </div>
        </div>

        {/* B & C. Platform Services & Background Jobs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          <div style={cardStyle}>
            <h4 style={{ margin: "0 0 10px", fontSize: 14.5, color: "var(--text-main)" }}>
              B. Service Health Readiness
            </h4>
            {state.servicesHealth.map((srv) => (
              <div
                key={srv.serviceName}
                style={{
                  padding: "8px 0",
                  borderBottom: "1px solid var(--border-light)",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  fontSize: 12,
                }}
              >
                <div>
                  <strong style={{ color: "var(--text-main)" }}>{srv.serviceName}</strong>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{srv.summary}</div>
                </div>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color:
                      srv.status === "operational_local"
                        ? "var(--status-success)"
                        : "var(--status-warning)",
                  }}
                >
                  {srv.status.replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>

          <div style={cardStyle}>
            <h4 style={{ margin: "0 0 10px", fontSize: 14.5, color: "var(--text-main)" }}>
              C & D. Scheduled Jobs & Backup Readiness
            </h4>
            {state.backgroundJobs.map((jb) => (
              <div
                key={jb.id}
                style={{
                  padding: "8px 0",
                  borderBottom: "1px solid var(--border-light)",
                  fontSize: 12,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong style={{ color: "var(--text-main)" }}>{jb.jobName}</strong>
                  <span style={{ fontWeight: 700, color: jb.status === "completed" ? "var(--status-success)" : "var(--status-warning)" }}>
                    {jb.status}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  {jb.schedule} {jb.failureNote ? `• ${jb.failureNote}` : ""}
                </div>
              </div>
            ))}
            <div
              style={{
                marginTop: 12,
                padding: 10,
                borderRadius: 10,
                background: "var(--status-info-bg)",
                fontSize: 11.5,
                color: "var(--text-main)",
              }}
            >
              <strong>Backup & Cache Notice:</strong> Automated encrypted database snapshots and cache
              purging execute solely via backend infrastructure pipelines (zero fabricated restore
              actions here).
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 18. SYSTEM MONITORING & ALERTS
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <BellRing size={18} style={{ color: "var(--status-warning)" }} />
          <h3 style={{ margin: 0, fontSize: 16.5, color: "var(--text-main)" }}>
            System Monitoring & Administrative Alerts
          </h3>
        </div>
        <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--text-secondary)" }}>
          Active operational monitoring notices requiring review. No fabricated green server
          metrics or false live incidents.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {state.alerts.map((al) => {
            const colors = getAlertSeverityColors(al.severity);
            return (
              <div
                key={al.id}
                style={{
                  padding: 14,
                  borderRadius: 12,
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <AlertTriangle size={15} style={{ color: colors.color }} />
                    <strong style={{ fontSize: 13.5, color: "var(--text-main)" }}>
                      {al.id}: {al.affectedService}
                    </strong>
                    {al.isDemoRecord && (
                      <span style={{ fontSize: 10, background: "var(--bg-card)", padding: "2px 6px", borderRadius: 6, color: "var(--text-muted)" }}>
                        Demo Alert
                      </span>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      padding: "2px 8px",
                      borderRadius: 999,
                      color: colors.color,
                      background: colors.bg,
                    }}
                  >
                    {al.severity} • {al.status}
                  </span>
                </div>

                <div style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>{al.description}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  Assigned: {al.assignedAdmin} • {formatSettingsTimestamp(al.timestamp)}
                </div>

                {al.internalNotes.length > 0 && (
                  <div style={{ fontSize: 11.5, color: "var(--text-main)", background: "var(--bg-card)", padding: "6px 10px", borderRadius: 8 }}>
                    Notes: {al.internalNotes.join(" | ")}
                  </div>
                )}

                <div style={{ display: "flex", flexWrap: "wrap", gap: 7, alignItems: "center" }}>
                  <input
                    type="text"
                    placeholder="Add internal triage note..."
                    value={alertNoteDrafts[al.id] || ""}
                    onChange={(e) =>
                      setAlertNoteDrafts((p) => ({ ...p, [al.id]: e.target.value }))
                    }
                    style={{ ...inputStyle, maxWidth: 240, padding: "5px 9px" }}
                  />
                  {al.status === "open" && (
                    <button
                      type="button"
                      onClick={() => onUpdateAlert(al.id, "acknowledged", alertNoteDrafts[al.id])}
                      style={{
                        padding: "5px 10px",
                        borderRadius: 7,
                        border: "1px solid var(--border)",
                        background: "var(--bg-card)",
                        color: "var(--text-main)",
                        fontSize: 11.5,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Acknowledge
                    </button>
                  )}
                  {al.status !== "resolved" && (
                    <>
                      <button
                        type="button"
                        onClick={() => onUpdateAlert(al.id, "escalated", alertNoteDrafts[al.id])}
                        style={{
                          padding: "5px 10px",
                          borderRadius: 7,
                          border: "1px solid var(--border)",
                          background: "var(--status-warning-bg)",
                          color: "var(--status-warning)",
                          fontSize: 11.5,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Escalate
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateAlert(al.id, "resolved", alertNoteDrafts[al.id])}
                        style={{
                          padding: "5px 10px",
                          borderRadius: 7,
                          border: "1px solid var(--border)",
                          background: "var(--status-success-bg)",
                          color: "var(--status-success)",
                          fontSize: 11.5,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Resolve
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

