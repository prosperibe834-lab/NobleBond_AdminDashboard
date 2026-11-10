import React from "react";
import { BarChart3, Clock, Layers, Users, Smile } from "lucide-react";
import type {
  SupportAgentRecord,
  SupportDateRange,
  SupportOverviewKpis,
  SupportProgramSettings,
  SupportTicketRecord,
} from "../../types/supportManagement.types";
import { Badge } from "../common/Badge";
import {
  evaluateTicketSlaStatus,
  formatDurationMinutes,
} from "./supportUiUtils";
import { SUPPORT_CATEGORY_CATALOG } from "../../data/supportManagementDataService";

interface SupportAnalyticsSectionProps {
  dateRange: SupportDateRange;
  kpis: SupportOverviewKpis;
  tickets: SupportTicketRecord[];
  agents: SupportAgentRecord[];
  settings: SupportProgramSettings;
}

export const SupportAnalyticsSection: React.FC<
  SupportAnalyticsSectionProps
> = ({ dateRange, kpis, tickets, agents, settings }) => {
  const statusBars = [
    { label: "New/Open", val: tickets.filter((t) => t.status === "new" || t.status === "open").length, color: "var(--primary)" },
    { label: "In Prog", val: tickets.filter((t) => t.status === "in_progress").length, color: "var(--status-info)" },
    { label: "Wait User", val: tickets.filter((t) => t.status === "waiting_for_user").length, color: "var(--text-muted)" },
    { label: "Escalated", val: tickets.filter((t) => t.status === "escalated").length, color: "var(--status-warning)" },
    { label: "Resolved", val: tickets.filter((t) => t.status === "resolved" || t.status === "closed").length, color: "var(--status-success)" },
  ];
  const maxSt = Math.max(1, ...statusBars.map((b) => b.val));

  const categoryCounts = Object.keys(SUPPORT_CATEGORY_CATALOG).map((grp) => ({
    grp,
    count: tickets.filter((t) => t.categoryGroup === grp).length,
  }));
  const maxCat = Math.max(1, ...categoryCounts.map((c) => c.count));

  const sources = (["In-App Support", "Email Support", "Website Support"] as const).map(
    (src) => ({
      src,
      count: tickets.filter((t) => t.source === src).length,
    })
  );

  const escalationRate =
    kpis.totalTickets > 0
      ? Math.round((kpis.escalatedCount / kpis.totalTickets) * 100)
      : 0;
  const overdueRate =
    kpis.openTickets > 0
      ? Math.round((kpis.overdueCount / kpis.openTickets) * 100)
      : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {/* Summary Header */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "16px 18px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "var(--primary-glow)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BarChart3 size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>
                Customer Support Operations &amp; SLA Analytics
              </h3>
              <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                Derived strictly from scoped support ticket timestamps &amp; genuine submitted surveys (Window: <strong>{dateRange.toUpperCase()}</strong>)
              </div>
            </div>
          </div>
          <Badge variant="success" size="sm">Resolution Rate: {kpis.resolutionRatePercent}%</Badge>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "10px" }}>
          <div style={{ padding: "11px", borderRadius: "11px", background: "var(--bg-surface-elevated)" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Avg First Response</div>
            <div style={{ fontSize: "1.12rem", fontWeight: 800, color: "var(--status-info)", marginTop: "2px" }}>
              {formatDurationMinutes(kpis.avgFirstResponseMinutes)}
            </div>
          </div>
          <div style={{ padding: "11px", borderRadius: "11px", background: "var(--bg-surface-elevated)" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Avg Resolution Time</div>
            <div style={{ fontSize: "1.12rem", fontWeight: 800, color: "var(--status-success)", marginTop: "2px" }}>
              {formatDurationMinutes(kpis.avgResolutionMinutes)}
            </div>
          </div>
          <div style={{ padding: "11px", borderRadius: "11px", background: "var(--bg-surface-elevated)" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Escalation Rate</div>
            <div style={{ fontSize: "1.12rem", fontWeight: 800, color: "var(--accent-champagne)", marginTop: "2px" }}>
              {escalationRate}%
            </div>
          </div>
          <div style={{ padding: "11px", borderRadius: "11px", background: "var(--bg-surface-elevated)" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Overdue Active Rate</div>
            <div style={{ fontSize: "1.12rem", fontWeight: 800, color: overdueRate > 0 ? "var(--status-error)" : "var(--status-success)", marginTop: "2px" }}>
              {overdueRate}%
            </div>
          </div>
          <div style={{ padding: "11px", borderRadius: "11px", background: "var(--bg-surface-elevated)" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Real CSAT Score</div>
            <div style={{ fontSize: "1.12rem", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>
              {kpis.csatScorePercent !== null ? `${kpis.csatScorePercent}% (${kpis.csatResponsesCount})` : "No Surveys Yet"}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
        {/* SVG 1: Status Distribution */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontWeight: 700, fontSize: "0.94rem", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "7px" }}>
              <Clock size={16} style={{ color: "var(--primary)" }} />
              Tickets by Workflow Stage
            </span>
            <Badge variant="primary" size="sm">{tickets.length} Total</Badge>
          </div>
          <svg viewBox="0 0 380 185" style={{ width: "100%", height: "185px", overflow: "visible" }}>
            {[0.25, 0.5, 0.75, 1].map((line) => (
              <line key={line} x1={10} x2={370} y1={148 - line * 115} y2={148 - line * 115} stroke="var(--border-light)" strokeDasharray="3 3" />
            ))}
            {statusBars.map((b, i) => {
              const h = Math.max(8, Math.round((b.val / maxSt) * 115));
              const x = 22 + i * 70;
              const y = 148 - h;
              return (
                <g key={b.label}>
                  <rect x={x} y={y} width={40} height={h} rx={7} fill={b.color} opacity={0.92} />
                  <text x={x + 20} y={y - 6} textAnchor="middle" fill="var(--text-main)" fontSize="11" fontWeight="700">{b.val}</text>
                  <text x={x + 20} y={168} textAnchor="middle" fill="var(--text-muted)" fontSize="9.5" fontWeight="600">{b.label}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Chart 2: Category Volume Bars */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontWeight: 700, fontSize: "0.94rem", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "7px" }}>
              <Layers size={16} style={{ color: "var(--status-info)" }} />
              Volume by Support Category Domain
            </span>
            <Badge variant="info" size="sm">7 Domains</Badge>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
            {categoryCounts.map((c) => {
              const w = Math.max(4, Math.round((c.count / maxCat) * 100));
              return (
                <div key={c.grp}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem", marginBottom: "3px" }}>
                    <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{c.grp}</span>
                    <span style={{ fontWeight: 700, color: "var(--text-secondary)" }}>{c.count}</span>
                  </div>
                  <div style={{ height: "8px", background: "var(--bg-surface-elevated)", borderRadius: "999px", overflow: "hidden" }}>
                    <div style={{ width: `${w}%`, height: "100%", background: "var(--status-info)", borderRadius: "999px" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Channel Distribution + Priority Split */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontWeight: 700, fontSize: "0.94rem", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "7px" }}>
              <Smile size={16} style={{ color: "var(--status-success)" }} />
              Support Channel &amp; Priority Mix
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
            {sources.map((s) => (
              <div key={s.src} style={{ display: "flex", justifyContent: "space-between", padding: "8px 11px", borderRadius: "9px", background: "var(--bg-surface-elevated)", fontSize: "0.79rem" }}>
                <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{s.src}</span>
                <strong style={{ color: "var(--primary)" }}>{s.count} tickets</strong>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {(["urgent", "high", "medium", "low"] as const).map((p) => (
              <div key={p} style={{ padding: "8px 10px", borderRadius: "8px", background: "var(--bg-surface-elevated)", display: "flex", justifyContent: "space-between", fontSize: "0.76rem" }}>
                <span style={{ textTransform: "capitalize", color: "var(--text-secondary)", fontWeight: 600 }}>{p} Priority</span>
                <strong style={{ color: "var(--text-main)" }}>{tickets.filter((t) => t.priority === p).length}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Agent Queue Workload */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontWeight: 700, fontSize: "0.94rem", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "7px" }}>
              <Users size={16} style={{ color: "var(--primary)" }} />
              Agent Queue &amp; SLA Adherence
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {agents.map((ag) => {
              const owned = tickets.filter((t) => t.assignedAgentId === ag.id);
              const overdue = owned.filter((t) => evaluateTicketSlaStatus(t, settings).isOverdue).length;
              const resolved = owned.filter((t) => t.status === "resolved" || t.status === "closed").length;
              return (
                <div key={ag.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 11px", borderRadius: "9px", background: "var(--bg-surface-elevated)", fontSize: "0.78rem" }}>
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{ag.name}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{ag.roleTitle}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontWeight: 700, color: "var(--text-main)" }}>{owned.length} Total</span>
                    <span style={{ marginLeft: "6px", color: "var(--status-success)", fontWeight: 600 }}>{resolved} Resolved</span>
                    <div style={{ fontSize: "0.7rem", color: overdue > 0 ? "var(--status-error)" : "var(--text-muted)" }}>
                      {overdue} Overdue SLA
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

