// NobleBond Admin — Moderation Stats Header
// 10 dynamic KPI cards with click-to-filter / tab-switch triggers, zero emojis

import React from "react";
import {
  ShieldAlert,
  Clock,
  Search,
  AlertTriangle,
  Flame,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Ban,
  FileText,
} from "lucide-react";
import type { ModerationStatsKpis } from "../../types/reportsModeration.types";

interface ModerationStatsHeaderProps {
  kpis: ModerationStatsKpis;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onFilterPriority?: (priority: string) => void;
  onFilterStatus?: (status: string) => void;
}

export const ModerationStatsHeader: React.FC<ModerationStatsHeaderProps> = ({
  kpis,
  activeTab,
  onSelectTab,
  onFilterPriority,
  onFilterStatus,
}) => {
  const cards = [
    {
      id: "all_reports",
      label: "Total Reports",
      value: kpis.totalReports.toLocaleString(),
      subtext: "All logged safety incidents",
      icon: ShieldAlert,
      color: "var(--primary, #8B1D41)",
      bg: "rgba(139, 29, 65, 0.08)",
      onClick: () => onSelectTab("all_reports"),
    },
    {
      id: "pending",
      label: "Pending Reports",
      value: kpis.pendingReports.toLocaleString(),
      subtext: "Awaiting triage & assignment",
      icon: Clock,
      color: "#EA580C",
      bg: "rgba(234, 88, 12, 0.08)",
      onClick: () => {
        onSelectTab("all_reports");
        onFilterStatus?.("pending");
      },
    },
    {
      id: "under_review",
      label: "Under Review",
      value: kpis.underReviewReports.toLocaleString(),
      subtext: "Actively being investigated",
      icon: Search,
      color: "#2563EB",
      bg: "rgba(37, 99, 235, 0.08)",
      onClick: () => {
        onSelectTab("all_reports");
        onFilterStatus?.("under_review");
      },
    },
    {
      id: "high_priority",
      label: "High Priority",
      value: kpis.highPriorityReports.toLocaleString(),
      subtext: "Requires timely resolution",
      icon: AlertTriangle,
      color: "#D97706",
      bg: "rgba(217, 119, 6, 0.08)",
      onClick: () => {
        onSelectTab("all_reports");
        onFilterPriority?.("high");
      },
    },
    {
      id: "critical",
      label: "Critical Reports",
      value: kpis.criticalReports.toLocaleString(),
      subtext: "Immediate escalation safety tier",
      icon: Flame,
      color: "#DC2626",
      bg: "rgba(220, 38, 38, 0.08)",
      onClick: () => {
        onSelectTab("all_reports");
        onFilterPriority?.("critical");
      },
    },
    {
      id: "escalated",
      label: "Escalated Reports",
      value: kpis.escalatedReports.toLocaleString(),
      subtext: "Transferred to Senior Trust/Legal",
      icon: ArrowUpRight,
      color: "#9333EA",
      bg: "rgba(147, 51, 234, 0.08)",
      onClick: () => {
        onSelectTab("all_reports");
        onFilterStatus?.("escalated");
      },
    },
    {
      id: "resolved",
      label: "Resolved Reports",
      value: kpis.resolvedReports.toLocaleString(),
      subtext: "Action taken or cleared",
      icon: CheckCircle2,
      color: "#16A34A",
      bg: "rgba(22, 163, 74, 0.08)",
      onClick: () => {
        onSelectTab("all_reports");
        onFilterStatus?.("resolved");
      },
    },
    {
      id: "dismissed",
      label: "Dismissed Reports",
      value: kpis.dismissedReports.toLocaleString(),
      subtext: "No policy infraction identified",
      icon: XCircle,
      color: "#6B7280",
      bg: "rgba(107, 114, 128, 0.08)",
      onClick: () => {
        onSelectTab("all_reports");
        onFilterStatus?.("dismissed");
      },
    },
    {
      id: "actions",
      label: "Active Restrictions",
      value: kpis.activeRestrictions.toLocaleString(),
      subtext: "Suspensions, blocks & bans",
      icon: Ban,
      color: "#BE123C",
      bg: "rgba(190, 18, 60, 0.08)",
      onClick: () => onSelectTab("moderation_actions"),
    },
    {
      id: "appeals",
      label: "Pending Appeals",
      value: kpis.pendingAppeals.toLocaleString(),
      subtext: "Member decision reviews",
      icon: FileText,
      color: "#0891B2",
      bg: "rgba(8, 145, 178, 0.08)",
      onClick: () => onSelectTab("appeals"),
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "12px",
      }}
    >
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const isCurrent =
          activeTab === card.id ||
          (card.id === "all_reports" && activeTab === "all_reports");

        return (
          <div
            key={idx}
            onClick={card.onClick}
            style={{
              padding: "14px 16px",
              backgroundColor: "var(--bg-card)",
              border: isCurrent
                ? `1px solid ${card.color}`
                : "1px solid var(--border)",
              borderRadius: "14px",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              cursor: "pointer",
              transition: "all 0.18s cubic-bezier(0.2, 0, 0, 1)",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "var(--shadow-md)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "var(--shadow-sm)";
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                }}
              >
                {card.label}
              </span>
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "8px",
                  backgroundColor: card.bg,
                  color: card.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={16} />
              </div>
            </div>

            <div
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "var(--text-main)",
                letterSpacing: "-0.02em",
                lineHeight: "1.2",
              }}
            >
              {card.value}
            </div>

            <div
              style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {card.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
};
