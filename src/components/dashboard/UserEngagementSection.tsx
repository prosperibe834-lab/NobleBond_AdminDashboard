import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Compass,
  Heart,
  HeartHandshake,
  MessageSquare,
  PhoneCall,
  Radio,
  Users,
  Gift,
  Share2,
  Clock,
  Repeat,
} from "lucide-react";

interface UserEngagementSectionProps {
  engagementData: { label: string; activeUsers: number; swipes: number; messages: number }[];
}

export const UserEngagementSection: React.FC<UserEngagementSectionProps> = ({
  engagementData,
}) => {
  const navigate = useNavigate();

  const activities = [
    {
      id: "discover_views",
      name: "Discover Profile Views",
      count: "4,210,000",
      change: "+14.2%",
      icon: Compass,
      color: "var(--primary)",
      bg: "rgba(193, 47, 102, 0.1)",
      link: "/users",
    },
    {
      id: "likes_sent",
      name: "Likes Sent",
      count: "1,482,900",
      change: "+11.8%",
      icon: Heart,
      color: "var(--primary)",
      bg: "rgba(193, 47, 102, 0.1)",
      link: "/matches",
    },
    {
      id: "mutual_matches",
      name: "Mutual Matches Made",
      count: "48,250",
      change: "+18.2%",
      icon: HeartHandshake,
      color: "var(--accent-lavender)",
      bg: "var(--accent-lavender-bg)",
      link: "/matches",
    },
    {
      id: "messages_exchanged",
      name: "Messages Exchanged",
      count: "842,100",
      change: "+9.4%",
      icon: MessageSquare,
      color: "var(--status-info)",
      bg: "var(--status-info-bg)",
      link: "/chats",
    },
    {
      id: "calls_initiated",
      name: "Audio / Video Calls",
      count: "14,850",
      change: "+22.1%",
      icon: PhoneCall,
      color: "var(--status-success)",
      bg: "var(--status-success-bg)",
      link: "/chats",
    },
    {
      id: "live_started",
      name: "Live Broadcasts Started",
      count: "318",
      change: "+34.5%",
      icon: Radio,
      color: "#EF4444",
      bg: "rgba(239, 68, 68, 0.12)",
      link: "/live",
    },
    {
      id: "live_joined",
      name: "Live Viewer Sessions",
      count: "42,180",
      change: "+28.4%",
      icon: Users,
      color: "var(--accent-champagne)",
      bg: "var(--accent-champagne-bg)",
      link: "/live",
    },
    {
      id: "gifts_sent",
      name: "Virtual Gifts Sent",
      count: "18,420",
      change: "+19.2%",
      icon: Gift,
      color: "var(--accent-champagne)",
      bg: "var(--accent-champagne-bg)",
      link: "/wallet",
    },
    {
      id: "referrals_completed",
      name: "Successful Referrals",
      count: "14,820",
      change: "+15.8%",
      icon: Share2,
      color: "var(--status-success)",
      bg: "var(--status-success-bg)",
      link: "/referrals",
    },
  ];

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "18px",
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        flexDirection: "column",
        gap: "22px",
      }}
    >
      {/* Top Header + KPI Metrics */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h3 style={{ fontSize: "17px", fontWeight: 800, color: "var(--text-main)" }}>
              User Engagement & Activity Overview
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
              High-level interaction telemetry across dating discovery, messaging, and live broadcasts
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12.5px", color: "var(--text-secondary)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Repeat size={14} color="var(--primary)" />
              Avg <strong>4.2 sessions / user</strong>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Clock size={14} color="var(--status-success)" />
              Avg <strong>24m 18s duration</strong>
            </span>
          </div>
        </div>

        {/* Engagement Summary Pills */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "12px",
            marginTop: "16px",
          }}
        >
          <div style={{ padding: "12px 14px", borderRadius: "12px", backgroundColor: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)" }}>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 700 }}>DAU (DAILY ACTIVE)</div>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>148,230</div>
          </div>
          <div style={{ padding: "12px 14px", borderRadius: "12px", backgroundColor: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)" }}>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 700 }}>WAU (WEEKLY ACTIVE)</div>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>421,800</div>
          </div>
          <div style={{ padding: "12px 14px", borderRadius: "12px", backgroundColor: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)" }}>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 700 }}>MAU (MONTHLY ACTIVE)</div>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>892,400</div>
          </div>
          <div style={{ padding: "12px 14px", borderRadius: "12px", backgroundColor: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)" }}>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 700 }}>TOTAL APP SESSIONS</div>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--primary)", marginTop: "2px" }}>2,450,800</div>
          </div>
        </div>

        {/* Engagement Trend Mini-Bars */}
        <div style={{ marginTop: "14px", padding: "14px 16px", borderRadius: "12px", backgroundColor: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)" }}>
              ACTIVITY INTENSITY CURVE
            </span>
            <span style={{ fontSize: "11.5px", color: "var(--primary)", fontWeight: 600 }}>
              Peak Traffic: Evening (19:00 - 23:00)
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "42px" }}>
            {engagementData.map((pt, idx) => {
              const maxSwipes = Math.max(...engagementData.map((d) => d.swipes), 1);
              const heightPct = Math.max(15, Math.round((pt.swipes / maxSwipes) * 100));
              return (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    height: `${heightPct}%`,
                    backgroundColor: idx === engagementData.length - 2 ? "var(--primary)" : "var(--border)",
                    borderRadius: "4px",
                    transition: "all 0.2s ease",
                  }}
                  title={`${pt.label}: ${pt.swipes.toLocaleString()} swipes`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* 9 Major Activity Breakdown Cards (Clickable) */}
      <div>
        <h4 style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-secondary)", letterSpacing: "0.5px", marginBottom: "12px" }}>
          ACTIVITY VOLUMES BY PRODUCT MODULE
        </h4>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
          }}
        >
          {activities.map((act) => {
            const Icon = act.icon;
            return (
              <div
                key={act.id}
                onClick={() => navigate(act.link)}
                style={{
                  padding: "14px 16px",
                  borderRadius: "14px",
                  backgroundColor: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.18s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.borderColor = "var(--border-focus)";
                  e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "var(--border-light)";
                  e.currentTarget.style.backgroundColor = "var(--bg-surface-elevated)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "10px",
                      backgroundColor: act.bg,
                      color: act.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={17} />
                  </div>
                  <div>
                    <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", fontWeight: 600 }}>
                      {act.name}
                    </div>
                    <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--text-main)" }}>
                      {act.count}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--status-success)" }}>
                  {act.change}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
