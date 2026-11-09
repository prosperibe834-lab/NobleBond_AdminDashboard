// NobleBond Admin — Likes & Matches KPI Statistics Header
// 9 interactive cards derived dynamically from demo records, zero emojis

import React from "react";
import {
  Heart,
  HeartHandshake,
  Sparkles,
  Clock,
  UserX,
  Users,
  Flag,
  ArrowUpRight,
} from "lucide-react";
import type { LikesMatchesStatsKpis } from "../../types/likesMatches.types";

interface LikesMatchesStatsHeaderProps {
  kpis: LikesMatchesStatsKpis;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

export const LikesMatchesStatsHeader: React.FC<LikesMatchesStatsHeaderProps> = ({
  kpis,
  activeTab,
  onSelectTab,
}) => {
  const cards = [
    {
      id: "all_likes",
      label: "Total Likes Sent",
      value: kpis.totalLikesSent,
      subtext: `${kpis.likesSentThisPeriod} in selected period`,
      delta: `+${kpis.likesSentDeltaPercent}%`,
      icon: Heart,
      color: "var(--primary)",
      bg: "rgba(139, 29, 65, 0.08)",
    },
    {
      id: "incoming",
      label: "Total Likes Received",
      value: kpis.totalLikesReceived,
      subtext: `${kpis.likesReceivedThisPeriod} incoming in period`,
      delta: `+${kpis.likesReceivedDeltaPercent}%`,
      icon: Heart,
      color: "#EC4899",
      bg: "rgba(236, 72, 153, 0.1)",
    },
    {
      id: "all_matches",
      label: "Total Confirmed Matches",
      value: kpis.totalConfirmedMatches,
      subtext: "100% genuine mutual likes",
      delta: "Mutual",
      icon: HeartHandshake,
      color: "var(--status-success)",
      bg: "var(--status-success-bg)",
    },
    {
      id: "all_matches",
      label: "New Matches in Period",
      value: kpis.newMatchesThisPeriod,
      subtext: "Confirmed reciprocal matches",
      delta: `+${kpis.newMatchesDeltaPercent}%`,
      icon: ArrowUpRight,
      color: "var(--status-success)",
      bg: "var(--status-success-bg)",
    },
    {
      id: "incoming",
      label: "Pending Incoming Likes",
      value: kpis.pendingIncomingLikes,
      subtext: "Awaiting member response / match",
      delta: "Pending",
      icon: Clock,
      color: "#F59E0B",
      bg: "rgba(245, 158, 11, 0.1)",
    },
    {
      id: "super_likes",
      label: "Super Likes Sent & Rcvd",
      value: kpis.totalSuperLikes,
      subtext: `${kpis.superLikesThisPeriod} in selected period`,
      delta: "Boosted",
      icon: Sparkles,
      color: "var(--accent-lavender)",
      bg: "rgba(159, 137, 219, 0.12)",
    },
    {
      id: "unmatched",
      label: "Total Unmatches",
      value: kpis.totalUnmatches,
      subtext: `${kpis.unmatchesThisPeriod} in selected period`,
      delta: "Ended",
      icon: UserX,
      color: "#6B7280",
      bg: "rgba(107, 114, 128, 0.1)",
    },
    {
      id: "active",
      label: "Active Confirmed Matches",
      value: kpis.activeMatches,
      subtext: "Active chatting & dating",
      delta: "Live",
      icon: Users,
      color: "var(--primary)",
      bg: "rgba(139, 29, 65, 0.08)",
    },
    {
      id: "reported",
      label: "Reported Interactions",
      value: kpis.reportedInteractionsCount,
      subtext: "Under trust & safety investigation",
      delta: kpis.reportedInteractionsCount > 0 ? "Action" : "Clean",
      icon: Flag,
      color: "var(--status-error)",
      bg: "var(--status-error-bg)",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
        gap: "14px",
      }}
    >
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const isActive = activeTab === card.id;
        return (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectTab(card.id)}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "16px",
              backgroundColor: "var(--bg-card)",
              border: isActive ? `2px solid ${card.color}` : "1px solid var(--border)",
              borderRadius: "14px",
              textAlign: "left",
              cursor: "pointer",
              transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
              boxShadow: isActive ? "0 4px 14px rgba(0,0,0,0.08)" : "var(--shadow-sm)",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-sm)";
              }
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
              <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-secondary)" }}>
                {card.label}
              </span>
              <div
                style={{
                  width: "32px",
                  height: "32px",
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

            <div style={{ marginTop: "10px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-main)", lineHeight: "1.1" }}>
                  {card.value}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: card.delta.startsWith("+") ? "var(--status-success)" : card.color,
                  }}
                >
                  {card.delta}
                </span>
              </div>
              <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {card.subtext}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

