import React from "react";
import {
  Activity,
  AlertCircle,
  Clock,
  Users,
  Layers,
  Smile,
  ArrowRight,
} from "lucide-react";
import type {
  SupportAgentRecord,
  SupportOverviewKpis,
  SupportProgramSettings,
  SupportTabKey,
  SupportTicketRecord,
} from "../../types/supportManagement.types";
import { Badge } from "../common/Badge";
import {
  evaluateTicketSlaStatus,
  formatDateTime,
  formatDurationMinutes,
  getPriorityMeta,
  getTicketStatusMeta,
} from "./supportUiUtils";

interface SupportOverviewSectionProps {
  kpis: SupportOverviewKpis;
  tickets: SupportTicketRecord[];
  agents: SupportAgentRecord[];
  settings: SupportProgramSettings;
  onNavigateTab: (tab: SupportTabKey, preset?: string) => void;
  onOpenInInbox: (ticketId: string) => void;
  onInspectTicket: (ticket: SupportTicketRecord) => void;
}

export const SupportOverviewSection: React.FC<SupportOverviewSectionProps> = ({
  kpis,
  tickets,
  agents,
  settings,
  onNavigateTab,
  onOpenInInbox,
  onInspectTicket,
}) => {
  // Panel A: Activity SVG bars from scoped tickets
  const activityBars = [
    { label: "Total", value: kpis.totalTickets, color: "var(--primary)" },
    { label: "Open", value: kpis.openTickets, color: "var(--status-info)" },
    { label: "Waiting", value: kpis.awaitingSupportCount, color: "var(--status-warning)" },
    { label: "Escalated", value: kpis.escalatedCount, color: "var(--accent-champagne)" },
    { label: "Resolved", value: kpis.resolvedCount, color: "var(--status-success)" },
  ];
  const maxBar = Math.max(1, ...activityBars.map((b) => b.value));

  // Panel B: Priority Urgent/High active queue
  const priorityTickets = tickets
    .filter((t) => t.status !== "resolved" && t.status !== "closed")
    .sort((a, b) => getPriorityMeta(b.priority).rank - getPriorityMeta(a.priority).rank)
    .slice(0, 5);

  // Panel C: Recent requests
  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Panel E: Approaching SLA count
  const approachingSlaCount = tickets.filter(
    (t) => evaluateTicketSlaStatus(t, settings).isApproaching
  ).length;

  // Panel F: Real CSAT feedback entries only
  const feedbackTickets = tickets.filter((t) => t.satisfaction !== undefined);
  const positiveCsat = feedbackTickets.filter((t) => t.satisfaction!.rating >= 4).length;
  const negativeCsat = feedbackTickets.filter((t) => t.satisfaction!.rating <= 2).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Row 1: Panel A (Support Activity) + Panel E (Workload & SLA) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: "16px" }}>
        {/* Panel A */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Activity size={17} style={{ color: "var(--primary)" }} />
                <span style={{ fontSize: "0.96rem", fontWeight: 700, color: "var(--text-main)" }}>
                  Panel A — Support Queue Activity
                </span>
              </div>
              <Badge variant="primary" size="sm">Volume Split</Badge>
            </div>

            <svg viewBox="0 0 380 175" style={{ width: "100%", height: "175px", overflow: "visible" }}>
              {[0.25, 0.5, 0.75, 1].map((line) => (
                <line key={line} x1={10} x2={370} y1={142 - line * 110} y2={142 - line * 110} stroke="var(--border-light)" strokeDasharray="3 3" />
              ))}
              {activityBars.map((b, i) => {
                const h = Math.max(8, Math.round((b.value / maxBar) * 110));
                const x = 22 + i * 70;
                const y = 142 - h;
                return (
                  <g key={b.label}>
                    <rect x={x} y={y} width={40} height={h} rx={7} fill={b.color} opacity={0.92} />
                    <text x={x + 20} y={y - 6} textAnchor="middle" fill="var(--text-main)" fontSize="11" fontWeight="700">{b.value}</text>
                    <text x={x + 20} y={162} textAnchor="middle" fill="var(--text-muted)" fontSize="9.5" fontWeight="600">{b.label}</text>
                  </g>
                );
              })}
            </svg>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab("analytics")}
            style={{
              marginTop: "8px",
              padding: "8px 12px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--bg-surface-elevated)",
              color: "var(--text-main)",
              fontSize: "0.79rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <span>Open Support Analytics</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Panel E: Support Workload */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Layers size={17} style={{ color: "var(--status-warning)" }} />
                <span style={{ fontSize: "0.96rem", fontWeight: 700, color: "var(--text-main)" }}>
                  Panel E — Support Workload &amp; SLA Queue
                </span>
              </div>
              <Badge variant={kpis.overdueCount > 0 ? "error" : "success"} size="sm">
                {kpis.overdueCount} Overdue
              </Badge>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "9px" }}>
              <div style={{ padding: "11px", borderRadius: "10px", background: "var(--bg-surface-elevated)" }}>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Unassigned Queue</div>
                <div style={{ fontSize: "1.12rem", fontWeight: 800, color: "var(--status-warning)", marginTop: "2px" }}>
                  {kpis.unassignedTickets} tickets
                </div>
              </div>
              <div style={{ padding: "11px", borderRadius: "10px", background: "var(--bg-surface-elevated)" }}>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Awaiting Agent Reply</div>
                <div style={{ fontSize: "1.12rem", fontWeight: 800, color: "var(--primary)", marginTop: "2px" }}>
                  {kpis.awaitingSupportCount} tickets
                </div>
              </div>
              <div style={{ padding: "11px", borderRadius: "10px", background: "var(--bg-surface-elevated)" }}>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Awaiting User Reply</div>
                <div style={{ fontSize: "1.12rem", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>
                  {kpis.awaitingUserCount} tickets
                </div>
              </div>
              <div style={{ padding: "11px", borderRadius: "10px", background: "var(--bg-surface-elevated)" }}>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Approaching SLA Target</div>
                <div style={{ fontSize: "1.12rem", fontWeight: 800, color: "var(--accent-champagne)", marginTop: "2px" }}>
                  {approachingSlaCount} tickets
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab("inbox")}
            style={{
              marginTop: "12px",
              padding: "9px 12px",
              borderRadius: "10px",
              border: "none",
              background: "var(--primary)",
              color: "#fff",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Open Live Support Inbox
          </button>
        </div>
      </div>

      {/* Row 2: Panel B (Priority Support Tickets) + Panel C (Recent Requests) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "16px" }}>
        {/* Panel B */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertCircle size={17} style={{ color: "var(--status-error)" }} />
              <span style={{ fontSize: "0.96rem", fontWeight: 700, color: "var(--text-main)" }}>
                Panel B — Priority Support Tickets
              </span>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab("all_tickets", "urgent_high")}
              style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.77rem", fontWeight: 600, cursor: "pointer" }}
            >
              View Urgent
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {priorityTickets.map((t) => {
              const pr = getPriorityMeta(t.priority);
              const st = getTicketStatusMeta(t.status);
              return (
                <div
                  key={t.id}
                  style={{
                    background: "var(--bg-surface-elevated)",
                    border: "1px solid var(--border-light)",
                    borderRadius: "11px",
                    padding: "10px 12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {t.id} — {t.subject}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      {t.customerName} • {t.category} • {t.assignedAgentName}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                    <Badge variant={pr.variant} size="sm">{pr.label}</Badge>
                    <Badge variant={st.variant} size="sm">{st.label}</Badge>
                    <button
                      type="button"
                      onClick={() => onOpenInInbox(t.id)}
                      style={{
                        padding: "5px 9px",
                        borderRadius: "7px",
                        border: "1px solid var(--border)",
                        background: "var(--bg-card)",
                        color: "var(--primary)",
                        fontSize: "0.73rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Open
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel C */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Clock size={17} style={{ color: "var(--status-info)" }} />
              <span style={{ fontSize: "0.96rem", fontWeight: 700, color: "var(--text-main)" }}>
                Panel C — Recent Support Requests
              </span>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab("all_tickets")}
              style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.77rem", fontWeight: 600, cursor: "pointer" }}
            >
              All Tickets
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {recentTickets.map((t) => {
              const st = getTicketStatusMeta(t.status);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onInspectTicket(t)}
                  style={{
                    textAlign: "left",
                    width: "100%",
                    background: "var(--bg-surface-elevated)",
                    border: "1px solid var(--border-light)",
                    borderRadius: "11px",
                    padding: "9px 12px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {t.customerName}: {t.subject}
                    </div>
                    <div style={{ fontSize: "0.71rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      {t.category} • {formatDateTime(t.createdAt)} • {t.source}
                    </div>
                  </div>
                  <Badge variant={st.variant} size="sm">{st.label}</Badge>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Panel D (Agent Performance) + Panel F (Real Customer Satisfaction) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "16px" }}>
        {/* Panel D */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Users size={17} style={{ color: "var(--primary)" }} />
              <span style={{ fontSize: "0.96rem", fontWeight: 700, color: "var(--text-main)" }}>
                Panel D — Support Team Queue Summary
              </span>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab("agents")}
              style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.77rem", fontWeight: 600, cursor: "pointer" }}
            >
              Manage Agents
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {agents.map((ag) => {
              const assigned = tickets.filter((t) => t.assignedAgentId === ag.id);
              const open = assigned.filter((t) => t.status !== "resolved" && t.status !== "closed").length;
              const resolved = assigned.filter((t) => t.status === "resolved" || t.status === "closed").length;
              const overdue = assigned.filter((t) => evaluateTicketSlaStatus(t, settings).isOverdue).length;
              const withRes = assigned.filter((t) => t.resolvedAt);
              const avgRes =
                withRes.length > 0
                  ? Math.round(
                      withRes.reduce(
                        (s, t) => s + (new Date(t.resolvedAt!).getTime() - new Date(t.createdAt).getTime()) / 60000,
                        0
                      ) / withRes.length
                    )
                  : null;

              return (
                <div
                  key={ag.id}
                  style={{
                    background: "var(--bg-surface-elevated)",
                    border: "1px solid var(--border-light)",
                    borderRadius: "10px",
                    padding: "9px 12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.79rem",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{ag.name}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{ag.roleTitle}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, color: "var(--text-main)" }}>
                      Open: {open} | Resolved: {resolved}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: overdue > 0 ? "var(--status-error)" : "var(--text-muted)" }}>
                      Overdue: {overdue} • Avg Res: {formatDurationMinutes(avgRes)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel F */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Smile size={17} style={{ color: "var(--status-success)" }} />
              <span style={{ fontSize: "0.96rem", fontWeight: 700, color: "var(--text-main)" }}>
                Panel F — Collected Customer Satisfaction
              </span>
            </div>
            <Badge variant="success" size="sm">
              {kpis.csatScorePercent !== null ? `${kpis.csatScorePercent}% CSAT` : "Awaiting Surveys"}
            </Badge>
          </div>

          {feedbackTickets.length === 0 ? (
            <div style={{ padding: "28px 12px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.84rem" }}>
              No customer satisfaction feedback has been submitted in the selected period.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div style={{ padding: "10px", borderRadius: "10px", background: "var(--status-success-bg)", color: "var(--status-success)", fontSize: "0.78rem", fontWeight: 700 }}>
                  Positive Feedback: {positiveCsat}
                </div>
                <div style={{ padding: "10px", borderRadius: "10px", background: "var(--status-error-bg)", color: "var(--status-error)", fontSize: "0.78rem", fontWeight: 700 }}>
                  Negative Feedback: {negativeCsat}
                </div>
              </div>

              {feedbackTickets.map((ft) => (
                <div
                  key={ft.id}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "10px",
                    background: "var(--bg-surface-elevated)",
                    border: "1px solid var(--border-light)",
                    fontSize: "0.78rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                    <strong style={{ color: "var(--text-main)" }}>{ft.customerName} ({ft.id})</strong>
                    <Badge variant={ft.satisfaction!.rating >= 4 ? "success" : "warning"} size="sm">
                      Rating: {ft.satisfaction!.rating} / 5
                    </Badge>
                  </div>
                  <div style={{ color: "var(--text-secondary)" }}>
                    &quot;{ft.satisfaction!.comment}&quot;
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

