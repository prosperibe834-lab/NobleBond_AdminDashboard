import React from "react";
import { UserCheck, Shield, Info } from "lucide-react";
import type {
  SupportAgentRecord,
  SupportProgramSettings,
  SupportRolePermissions,
  SupportTicketRecord,
} from "../../types/supportManagement.types";
import { Badge } from "../common/Badge";
import {
  evaluateTicketSlaStatus,
  formatDurationMinutes,
} from "./supportUiUtils";

interface SupportAgentsSectionProps {
  agents: SupportAgentRecord[];
  tickets: SupportTicketRecord[];
  settings: SupportProgramSettings;
  permissions: SupportRolePermissions;
  onUpdateQueueStatus: (
    agentId: string,
    status: SupportAgentRecord["queueStatus"]
  ) => void;
  onFilterByAgent: (agentId: string) => void;
}

export const SupportAgentsSection: React.FC<SupportAgentsSectionProps> = ({
  agents,
  tickets,
  settings,
  permissions,
  onUpdateQueueStatus,
  onFilterByAgent,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "16px 18px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "var(--primary-glow)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <UserCheck size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>
              Support Team &amp; Queue Workload ({agents.length} Existing Admin Actors)
            </h3>
            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
              Reuses existing NobleBond Admin staff roles cleanly — queue capacity &amp; resolution stats computed from live tickets
            </div>
          </div>
        </div>
        <Badge variant="neutral" size="sm">
          <Shield size={11} style={{ marginRight: "4px" }} />
          No Duplicate Staff Accounts
        </Badge>
      </div>

      <div style={{ padding: "10px 14px", borderRadius: "11px", background: "var(--status-info-bg)", color: "var(--text-secondary)", fontSize: "0.76rem", display: "flex", alignItems: "center", gap: "8px" }}>
        <Info size={15} style={{ color: "var(--status-info)", flexShrink: 0 }} />
        <span>
          Real-time presence telemetry is not connected; agent queue controls manage demonstration assignment eligibility only.
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: "14px" }}>
        {agents.map((ag) => {
          const owned = tickets.filter((t) => t.assignedAgentId === ag.id);
          const open = owned.filter((t) => t.status !== "resolved" && t.status !== "closed").length;
          const resolved = owned.filter((t) => t.status === "resolved" || t.status === "closed").length;
          const escalated = owned.filter((t) => t.status === "escalated").length;
          const overdue = owned.filter((t) => evaluateTicketSlaStatus(t, settings).isOverdue).length;

          const withFirst = owned.filter((t) => t.firstResponseAt);
          const avgFirst =
            withFirst.length > 0
              ? Math.round(
                  withFirst.reduce((s, t) => s + (new Date(t.firstResponseAt!).getTime() - new Date(t.createdAt).getTime()) / 60000, 0) /
                    withFirst.length
                )
              : null;

          const withRes = owned.filter((t) => t.resolvedAt);
          const avgRes =
            withRes.length > 0
              ? Math.round(
                  withRes.reduce((s, t) => s + (new Date(t.resolvedAt!).getTime() - new Date(t.createdAt).getTime()) / 60000, 0) /
                    withRes.length
                )
              : null;

          const csatRatings = owned.filter((t) => t.satisfaction !== undefined);
          const csatPct =
            csatRatings.length > 0
              ? Math.round((csatRatings.filter((t) => t.satisfaction!.rating >= 4).length / csatRatings.length) * 100)
              : null;

          const qVariant =
            ag.queueStatus === "accepting_tickets"
              ? "success"
              : ag.queueStatus === "at_capacity"
              ? "warning"
              : "neutral";

          return (
            <div
              key={ag.id}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--primary), var(--accent-lavender))",
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: "0.85rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {ag.avatarInitials}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.94rem", color: "var(--text-main)" }}>{ag.name}</div>
                      <div style={{ fontSize: "0.73rem", color: "var(--text-muted)" }}>{ag.roleTitle}</div>
                      <div style={{ fontSize: "0.71rem", color: "var(--text-secondary)" }}>{ag.email}</div>
                    </div>
                  </div>
                  <Badge variant={qVariant} size="sm">
                    {ag.queueStatus.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px", textAlign: "center", marginBottom: "10px" }}>
                  <div style={{ padding: "7px", borderRadius: "8px", background: "var(--bg-surface-elevated)" }}>
                    <div style={{ fontSize: "0.66rem", color: "var(--text-muted)" }}>Assigned</div>
                    <div style={{ fontWeight: 800, fontSize: "0.88rem", color: "var(--text-main)" }}>{owned.length}</div>
                  </div>
                  <div style={{ padding: "7px", borderRadius: "8px", background: "var(--bg-surface-elevated)" }}>
                    <div style={{ fontSize: "0.66rem", color: "var(--text-muted)" }}>Open</div>
                    <div style={{ fontWeight: 800, fontSize: "0.88rem", color: "var(--status-info)" }}>{open}</div>
                  </div>
                  <div style={{ padding: "7px", borderRadius: "8px", background: "var(--bg-surface-elevated)" }}>
                    <div style={{ fontSize: "0.66rem", color: "var(--text-muted)" }}>Resolved</div>
                    <div style={{ fontWeight: 800, fontSize: "0.88rem", color: "var(--status-success)" }}>{resolved}</div>
                  </div>
                  <div style={{ padding: "7px", borderRadius: "8px", background: "var(--bg-surface-elevated)" }}>
                    <div style={{ fontSize: "0.66rem", color: "var(--text-muted)" }}>Overdue</div>
                    <div style={{ fontWeight: 800, fontSize: "0.88rem", color: overdue > 0 ? "var(--status-error)" : "var(--text-main)" }}>
                      {overdue}
                    </div>
                  </div>
                </div>

                <div style={{ padding: "9px 11px", borderRadius: "9px", background: "var(--bg-surface-elevated)", fontSize: "0.74rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  <div>Escalated Cases: <strong>{escalated}</strong> • CSAT: <strong>{csatPct !== null ? `${csatPct}% (${csatRatings.length})` : "No ratings yet"}</strong></div>
                  <div>Avg 1st Response: <strong>{formatDurationMinutes(avgFirst)}</strong> • Avg Resolution: <strong>{formatDurationMinutes(avgRes)}</strong></div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "3px" }}>
                    Focus: {ag.specialties.join(", ")}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => onFilterByAgent(ag.id)}
                  style={{
                    flex: 1,
                    padding: "7px 11px",
                    borderRadius: "8px",
                    border: "none",
                    background: "var(--primary)",
                    color: "#fff",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  View Assigned Tickets
                </button>

                {permissions.canManageAgents && (
                  <select
                    aria-label={`Queue status for ${ag.name}`}
                    value={ag.queueStatus}
                    onChange={(e) =>
                      onUpdateQueueStatus(
                        ag.id,
                        e.target.value as SupportAgentRecord["queueStatus"]
                      )
                    }
                    style={{
                      background: "var(--bg-surface-elevated)",
                      border: "1px solid var(--border)",
                      color: "var(--text-main)",
                      borderRadius: "8px",
                      padding: "6px 9px",
                      fontSize: "0.74rem",
                    }}
                  >
                    <option value="accepting_tickets">Accepting Queue</option>
                    <option value="at_capacity">At Capacity</option>
                    <option value="paused">Queue Paused</option>
                  </select>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

