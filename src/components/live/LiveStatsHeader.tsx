// NobleBond Admin — Live Management KPI Statistics Header
// 10 interactive cards derived dynamically from demo records, zero emojis

import React from "react";
import {
  Radio,
  RadioTower,
  Users,
  Eye,
  Clock,
  Gift,
  Coins,
  ShieldAlert,
  AlertTriangle,
  Flame,
} from "lucide-react";
import type { LiveStatsKpis } from "../../types/liveManagement.types";

interface LiveStatsHeaderProps {
  kpis: LiveStatsKpis;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

export const LiveStatsHeader: React.FC<LiveStatsHeaderProps> = ({
  kpis,
  activeTab,
  onSelectTab,
}) => {
  const cards = [
    {
      id: "sessions",
      label: "Total Live Sessions",
      value: kpis.totalLiveSessions.toLocaleString(),
      subtext: "Historical broadcast volume",
      delta: "All Time",
      icon: Radio,
      color: "var(--primary)",
      bg: "rgba(139, 29, 65, 0.08)",
    },
    {
      id: "sessions",
      label: "Currently Live",
      value: `${kpis.currentlyLiveRooms} Rooms`,
      subtext: "Active real-time broadcasts",
      delta: "LIVE",
      icon: Flame,
      color: "#EF4444",
      bg: "rgba(239, 68, 68, 0.1)",
      pulse: true,
    },
    {
      id: "hosts",
      label: "Total Live Hosts",
      value: kpis.totalLiveHosts.toLocaleString(),
      subtext: "Verified broadcasters",
      delta: "Creators",
      icon: RadioTower,
      color: "#8B5CF6",
      bg: "rgba(139, 92, 246, 0.08)",
    },
    {
      id: "audience",
      label: "Active Viewers",
      value: kpis.activeConcurrentViewers.toLocaleString(),
      subtext: "Watching live right now",
      delta: "Online",
      icon: Eye,
      color: "#2563EB",
      bg: "rgba(37, 99, 235, 0.08)",
    },
    {
      id: "analytics",
      label: "Total Live Views",
      value: kpis.totalLiveViews.toLocaleString(),
      subtext: "Total unique view sessions",
      delta: "+22.4%",
      icon: Users,
      color: "#059669",
      bg: "rgba(5, 150, 105, 0.08)",
    },
    {
      id: "analytics",
      label: "Total Stream Duration",
      value: `${kpis.totalStreamDurationHours} hrs`,
      subtext: "Total airtime broadcast",
      delta: "Airtime",
      icon: Clock,
      color: "#0D9488",
      bg: "rgba(13, 148, 136, 0.08)",
    },
    {
      id: "gifts",
      label: "Total Gifts Sent",
      value: kpis.totalGiftsSent.toLocaleString(),
      subtext: "Virtual gifts exchanged",
      delta: "Gifts",
      icon: Gift,
      color: "#EC4899",
      bg: "rgba(236, 72, 153, 0.08)",
    },
    {
      id: "gifts",
      label: "Gift Coins Spent",
      value: `${kpis.totalGiftCoinsSpent.toLocaleString()} Coins`,
      subtext: "In-stream virtual economy",
      delta: "Coins",
      icon: Coins,
      color: "var(--accent-champagne)",
      bg: "rgba(212, 175, 55, 0.12)",
    },
    {
      id: "moderation",
      label: "Pending Live Reports",
      value: kpis.pendingLiveReports.toLocaleString(),
      subtext: "Safety triage queue",
      delta: kpis.pendingLiveReports > 0 ? "Action Req." : "Clear",
      icon: ShieldAlert,
      color: "#DC2626",
      bg: "rgba(220, 38, 38, 0.08)",
    },
    {
      id: "health",
      label: "Failed or Interrupted",
      value: kpis.failedOrInterruptedStreams.toLocaleString(),
      subtext: `${kpis.connectionReliabilityRate}% reliability rate`,
      delta: "Ingest SLA",
      icon: AlertTriangle,
      color: "#F59E0B",
      bg: "rgba(245, 158, 11, 0.1)",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
        gap: "14px",
        marginBottom: "20px",
      }}
    >
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const isCurrentTab = activeTab === card.id;

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
              border: isCurrentTab
                ? `1.5px solid ${card.color}`
                : "1px solid var(--border)",
              borderRadius: "14px",
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: isCurrentTab
                ? `0 4px 14px ${card.bg}`
                : "var(--shadow-sm)",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "var(--shadow-md)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = isCurrentTab
                ? `0 4px 14px ${card.bg}`
                : "var(--shadow-sm)";
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  lineHeight: 1.3,
                }}
              >
                {card.label}
              </span>
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "10px",
                  backgroundColor: card.bg,
                  color: card.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={17} />
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "var(--text-main)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {card.pulse && (
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: "#EF4444",
                    }}
                    className="animate-pulse-live"
                  />
                )}
                {card.value}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "6px",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    fontSize: "11.5px",
                    color: "var(--text-muted)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {card.subtext}
                </span>
                <span
                  style={{
                    fontSize: "10.5px",
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: "6px",
                    backgroundColor: card.bg,
                    color: card.color,
                    flexShrink: 0,
                  }}
                >
                  {card.delta}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

