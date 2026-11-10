import React, { useState } from "react";
import { History, RotateCcw, Download, Users, CheckCircle2, XCircle, Search } from "lucide-react";
import { exportSettingsAuditCsv } from "../../../data/systemSettingsDataService";
import type {
  ConfigAuditLogRecord,
  ConfigVersionSnapshot,
  PendingTwoPersonApproval,
  SystemSettingsRootState,
} from "../../../types/systemSettings.types";
import type { ConfirmActionRequest } from "./sharedSectionTypes";
import { formatSettingsTimestamp } from "../settingsUiUtils";

interface AuditAndRollbackSectionProps {
  state: SystemSettingsRootState;
  canRollback: boolean;
  onRollbackSnapshot: (snapshot: ConfigVersionSnapshot, reason: string) => void;
  onResolveTwoPersonApproval: (approvalId: string, approved: boolean) => void;
  onRequestConfirm: (req: ConfirmActionRequest) => void;
}

const cardStyle: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: 16,
  padding: 18,
  boxShadow: "var(--shadow-sm)",
};

export const AuditAndRollbackSection: React.FC<AuditAndRollbackSectionProps> = ({
  state,
  canRollback,
  onRollbackSnapshot,
  onResolveTwoPersonApproval,
  onRequestConfirm,
}) => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filteredLogs = state.auditLogs.filter((log: ConfigAuditLogRecord) => {
    const q = search.trim().toLowerCase();
    if (
      q &&
      !log.settingName.toLowerCase().includes(q) &&
      !log.administrator.toLowerCase().includes(q) &&
      !log.reason.toLowerCase().includes(q)
    ) {
      return false;
    }
    if (categoryFilter !== "all" && log.category !== categoryFilter) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const pagedLogs = filteredLogs.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Staged Two-Person Approval Queue */}
      {state.pendingApprovals.length > 0 && (
        <div style={{ ...cardStyle, borderColor: "var(--accent-lavender)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Users size={18} style={{ color: "var(--accent-lavender)" }} />
            <h3 style={{ margin: 0, fontSize: 15.5, color: "var(--text-main)" }}>
              Two-Person Approval Queue ({state.pendingApprovals.length})
            </h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {state.pendingApprovals.map((apr: PendingTwoPersonApproval) => (
              <div
                key={apr.id}
                style={{
                  padding: 12,
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
                    {apr.actionTitle} ({apr.id})
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                    Proposed by {apr.requestedBy}: {apr.proposedValue} • Reason: {apr.reason}
                  </div>
                </div>
                {apr.status === "pending_second_approver" && canRollback ? (
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      type="button"
                      onClick={() => onResolveTwoPersonApproval(apr.id, true)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "5px 10px",
                        borderRadius: 8,
                        border: "none",
                        background: "var(--status-success)",
                        color: "#FFFFFF",
                        fontSize: 11.5,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      <CheckCircle2 size={12} /> Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => onResolveTwoPersonApproval(apr.id, false)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "5px 10px",
                        borderRadius: 8,
                        border: "none",
                        background: "var(--status-error)",
                        color: "#FFFFFF",
                        fontSize: 11.5,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      <XCircle size={12} /> Reject
                    </button>
                  </div>
                ) : (
                  <span style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase" }}>
                    {apr.status.replace(/_/g, " ")}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Configuration Version Snapshots & Permission-Gated Rollback */}
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <RotateCcw size={18} style={{ color: "var(--primary)" }} />
          <h3 style={{ margin: 0, fontSize: 16, color: "var(--text-main)" }}>
            Configuration Version History & Rollback ({state.versionSnapshots.length})
          </h3>
        </div>
        <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "var(--text-secondary)" }}>
          Rollback restores eligible saved snapshots and appends a fresh immutable audit record
          without deleting history.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {state.versionSnapshots.slice(0, 6).map((snap) => (
            <div
              key={snap.versionId}
              style={{
                padding: 12,
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
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)" }}>
                  {snap.label} ({snap.versionId})
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                  {snap.snapshotSummary}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                  By {snap.changedBy} • {formatSettingsTimestamp(snap.createdAt)} • Reason:{" "}
                  {snap.reason}
                </div>
              </div>
              <button
                type="button"
                disabled={!canRollback}
                onClick={() =>
                  onRequestConfirm({
                    title: `Restore Snapshot "${snap.label}"?`,
                    description: `Applies saved values (${snap.versionId}) cleanly and creates a rollback audit record.`,
                    danger: true,
                    requireReauth: true,
                    confirmLabel: "Execute Rollback",
                    onConfirm: ({ reason }) => onRollbackSnapshot(snap, reason),
                  })
                }
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "6px 11px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "var(--bg-card)",
                  color: canRollback ? "var(--primary)" : "var(--text-muted)",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: canRollback ? "pointer" : "not-allowed",
                }}
              >
                <RotateCcw size={12} />
                <span>Restore Version</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Immutable Append-Only Audit History Table */}
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
              <History size={18} style={{ color: "var(--status-info)" }} />
              <h3 style={{ margin: 0, fontSize: 16, color: "var(--text-main)" }}>
                Immutable Append-Only Configuration Audit Log ({filteredLogs.length})
              </h3>
            </div>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>
              Historical configuration and RBAC entries cannot be edited or deleted.
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
                placeholder="Search audit history..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                style={{
                  padding: "7px 10px 7px 30px",
                  borderRadius: 9,
                  border: "1px solid var(--border)",
                  background: "var(--bg-surface-elevated)",
                  color: "var(--text-main)",
                  fontSize: 12,
                }}
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              style={{
                padding: "7px 10px",
                borderRadius: 9,
                border: "1px solid var(--border)",
                background: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                fontSize: 12,
              }}
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="branding">Branding</option>
              <option value="theme">Theme</option>
              <option value="regional">Regional</option>
              <option value="currency">Currency</option>
              <option value="features">Features</option>
              <option value="authentication">Authentication</option>
              <option value="administrators">Administrators</option>
              <option value="roles_permissions">Roles & Permissions</option>
              <option value="maintenance_ops">Maintenance</option>
            </select>

            <button
              type="button"
              onClick={() => exportSettingsAuditCsv(filteredLogs)}
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
              <Download size={13} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                <th style={{ textAlign: "left", padding: "8px 10px" }}>Event ID</th>
                <th style={{ textAlign: "left", padding: "8px 10px" }}>Administrator</th>
                <th style={{ textAlign: "left", padding: "8px 10px" }}>Category / Setting</th>
                <th style={{ textAlign: "left", padding: "8px 10px" }}>Change Diff</th>
                <th style={{ textAlign: "left", padding: "8px 10px" }}>Reason</th>
                <th style={{ textAlign: "left", padding: "8px 10px" }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {pagedLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "8px 10px", fontWeight: 700, color: "var(--primary)" }}>
                    {log.id}
                  </td>
                  <td style={{ padding: "8px 10px" }}>
                    <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{log.administrator}</div>
                    <div style={{ fontSize: 10.5, color: "var(--text-muted)" }}>{log.actorRole}</div>
                  </td>
                  <td style={{ padding: "8px 10px" }}>
                    <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{log.settingName}</div>
                    <div style={{ fontSize: 10.5, textTransform: "uppercase", color: "var(--text-muted)" }}>
                      {log.category} • {log.approvalStatus}
                    </div>
                  </td>
                  <td style={{ padding: "8px 10px", fontSize: 11.5 }}>
                    <span style={{ color: "var(--text-muted)" }}>{log.previousValue}</span>
                    {" -> "}
                    <strong style={{ color: "var(--text-main)" }}>{log.newValue}</strong>
                  </td>
                  <td style={{ padding: "8px 10px", color: "var(--text-secondary)" }}>{log.reason}</td>
                  <td style={{ padding: "8px 10px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                    {formatSettingsTimestamp(log.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 12,
            fontSize: 12,
            color: "var(--text-secondary)",
          }}
        >
          <span>
            Page {page} of {totalPages}
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              style={{
                padding: "5px 10px",
                borderRadius: 7,
                border: "1px solid var(--border)",
                background: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                cursor: page <= 1 ? "not-allowed" : "pointer",
              }}
            >
              Prev
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              style={{
                padding: "5px 10px",
                borderRadius: 7,
                border: "1px solid var(--border)",
                background: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                cursor: page >= totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

