import React from "react";
import {
  Inbox,
  FolderOpen,
  Sparkles,
  UserX,
  UserCheck,
  Clock,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Timer,
  Smile,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import type {
  SupportOverviewKpis,
  SupportTabKey,
} from "../../types/supportManagement.types";
import { formatDurationMinutes } from "./supportUiUtils";

interface SupportStatsHeaderProps {
  kpis: SupportOverviewKpis;
  onCardNavigate: (tab: SupportTabKey, preset?: string) => void;
}

export const SupportStatsHeader: React.FC<SupportStatsHeaderProps> = ({
  kpis,
  onCardNavigate,
}) => {
  const cards: Array<{
    label: string;
    value: string;
    sublabel: string;
    badge: string;
    icon: React.ReactNode;
    accentColor: string;
    tab: SupportTabKey;
    preset?: string;
  }> = [
    {
      label: "Total Tickets",
      value: kpis.totalTickets.toLocaleString(),
      sublabel: `${kpis.resolutionRatePercent}% resolution rate`,
      badge: "All Records",
      icon: <Inbox size={16} />,
      accentColor: "var(--primary)",
      tab: "all_tickets",
      preset: "all",
    },
    {
      label: "Open Tickets",
      value: kpis.openTickets.toLocaleString(),
      sublabel: "Active across all queues",
      badge: "Active",
      icon: <FolderOpen size={16} />,
      accentColor: "var(--status-info)",
      tab: "all_tickets",
      preset: "open_bundle",
    },
    {
      label: "New Today",
      value: kpis.newTicketsToday.toLocaleString(),
      sublabel: "Submitted within 24h",
      badge: "Fresh",
      icon: <Sparkles size={16} />,
      accentColor: "var(--primary)",
      tab: "all_tickets",
      preset: "today",
    },
    {
      label: "Unassigned",
      value: kpis.unassignedTickets.toLocaleString(),
      sublabel: "Needs agent triage",
      badge: kpis.unassignedTickets > 0 ? "Action Req" : "Clear",
      icon: <UserX size={16} />,
      accentColor: kpis.unassignedTickets > 0 ? "var(--status-warning)" : "var(--status-success)",
      tab: "unassigned",
    },
    {
      label: "Assigned to Me",
      value: kpis.assignedToMeCount.toLocaleString(),
      sublabel: "Active in your queue",
      badge: "My Queue",
      icon: <UserCheck size={16} />,
      accentColor: "var(--status-info)",
      tab: "my_tickets",
    },
    {
      label: "Awaiting User",
      value: kpis.awaitingUserCount.toLocaleString(),
      sublabel: "Customer reply pending",
      badge: "SLA Paused",
      icon: <Clock size={16} />,
      accentColor: "var(--text-secondary)",
      tab: "pending_responses",
      preset: "waiting_for_user",
    },
    {
      label: "Awaiting Support",
      value: kpis.awaitingSupportCount.toLocaleString(),
      sublabel: "Agent response pending",
      badge: "Priority",
      icon: <MessageSquare size={16} />,
      accentColor: "var(--status-warning)",
      tab: "pending_responses",
      preset: "waiting_for_support",
    },
    {
      label: "Escalated",
      value: kpis.escalatedCount.toLocaleString(),
      sublabel: "Specialist review required",
      badge: "Cross-Team",
      icon: <AlertTriangle size={16} />,
      accentColor: "var(--accent-champagne)",
      tab: "escalated",
    },
    {
      label: "Resolved & Closed",
      value: kpis.resolvedCount.toLocaleString(),
      sublabel: "Completed inquiries",
      badge: `${kpis.resolutionRatePercent}%`,
      icon: <CheckCircle2 size={16} />,
      accentColor: "var(--status-success)",
      tab: "resolved",
    },
    {
      label: "Overdue SLA",
      value: kpis.overdueCount.toLocaleString(),
      sublabel: `Avg 1st Reply: ${formatDurationMinutes(kpis.avgFirstResponseMinutes)} | Res: ${formatDurationMinutes(kpis.avgResolutionMinutes)}`,
      badge: kpis.overdueCount > 0 ? "SLA Alert" : "On Target",
      icon: <Timer size={16} />,
      accentColor: kpis.overdueCount > 0 ? "var(--status-error)" : "var(--status-success)",
      tab: "all_tickets",
      preset: "overdue",
    },
    {
      label: "Customer Satisfaction",
      value: kpis.csatScorePercent !== null ? `${kpis.csatScorePercent}%` : "No Data",
      sublabel: kpis.csatResponsesCount > 0 ? `From ${kpis.csatResponsesCount} submitted rating(s)` : "Awaiting user surveys",
      badge: "Real CSAT",
      icon: kpis.csatScorePercent !== null ? <Smile size={16} /> : <TrendingUp size={16} />,
      accentColor: "var(--status-success)",
      tab: "analytics",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(195px, 1fr))",
        gap: "12px",
        marginBottom: "20px",
      }}
    >
      {cards.map((card) => (
        <button
          key={card.label}
          type="button"
          onClick={() => onCardNavigate(card.tab, card.preset)}
          style={{
            textAlign: "left",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            padding: "13px 14px",
            cursor: "pointer",
            transition: "transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease",
            boxShadow: "var(--shadow-sm)",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.borderColor = card.accentColor;
            e.currentTarget.style.boxShadow = "var(--shadow-md)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.boxShadow = "var(--shadow-sm)";
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)" }}>
              {card.label}
            </span>
            <span style={{ color: card.accentColor, display: "flex", alignItems: "center", gap: "3px" }}>
              {card.icon}
              <ArrowUpRight size={12} />
            </span>
          </div>

          <div style={{ fontSize: "1.32rem", fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.02em" }}>
            {card.value}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
            <span style={{ fontSize: "0.69rem", color: "var(--text-muted)", lineHeight: 1.3 }}>
              {card.sublabel}
            </span>
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                padding: "2px 7px",
                borderRadius: "999px",
                background: "var(--bg-surface-elevated)",
                color: card.accentColor,
                whiteSpace: "nowrap",
              }}
            >
              {card.badge}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

