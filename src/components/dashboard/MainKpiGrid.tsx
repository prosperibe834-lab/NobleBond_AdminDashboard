import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Activity,
  UserPlus,
  HeartHandshake,
  Radio,
  Crown,
  DollarSign,
  ShieldAlert,
  BadgeCheck,
  Headset,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import type { DashboardMetricsSnapshot } from "../../data/dashboardDataService";
import { Badge } from "../common/Badge";

interface MainKpiGridProps {
  data: DashboardMetricsSnapshot;
}

export const MainKpiGrid: React.FC<MainKpiGridProps> = ({ data }) => {
  const navigate = useNavigate();

  const cards = [
    {
      id: "total_users",
      title: "Total Registered Users",
      value: data.totalUsers.value,
      subtext: data.totalUsers.change,
      isPositive: true,
      icon: Users,
      color: "var(--primary)",
      bg: "rgba(193, 47, 102, 0.1)",
      link: "/users",
      description: "Cumulative verified accounts on NobleBond",
    },
    {
      id: "active_users",
      title: "Active Users (DAU)",
      value: data.activeUsers.value,
      subtext: data.activeUsers.change,
      isPositive: true,
      icon: Activity,
      color: "var(--accent-lavender)",
      bg: "var(--accent-lavender-bg)",
      link: "/users",
      badge: { text: "DAU", variant: "primary" as const },
      description: data.activeUsers.type,
    },
    {
      id: "new_registrations",
      title: "New Registrations",
      value: data.newRegistrations.value,
      subtext: data.newRegistrations.change,
      isPositive: true,
      icon: UserPlus,
      color: "var(--status-success)",
      bg: "var(--status-success-bg)",
      link: "/users",
      description: "Accounts registered in selected window",
    },
    {
      id: "total_matches",
      title: "Mutual Matches",
      value: data.totalMatches.value,
      subtext: data.totalMatches.change,
      isPositive: true,
      icon: HeartHandshake,
      color: "var(--primary)",
      bg: "rgba(193, 47, 102, 0.1)",
      link: "/matches",
      description: "Confirmed mutual likes connected",
    },
    {
      id: "active_live",
      title: "Active Live Rooms",
      value: `${data.activeLiveSessions.value} Live`,
      subtext: data.activeLiveSessions.viewers,
      isPositive: true,
      icon: Radio,
      color: "#EF4444",
      bg: "rgba(239, 68, 68, 0.12)",
      link: "/live",
      badge: { text: "LIVE NOW", variant: "live" as const },
      description: `${data.activeLiveSessions.hosts} active hosts broadcasting`,
    },
    {
      id: "premium_subscribers",
      title: "Premium Subscribers",
      value: data.premiumSubscribers.value,
      subtext: data.premiumSubscribers.newPeriod,
      isPositive: true,
      icon: Crown,
      color: "var(--accent-champagne)",
      bg: "var(--accent-champagne-bg)",
      link: "/subscriptions",
      badge: { text: "PRO", variant: "champagne" as const },
      description: data.premiumSubscribers.growth,
    },
    {
      id: "monetary_revenue",
      title: "Verified Revenue",
      value: data.monetaryRevenue.value,
      subtext: data.monetaryRevenue.change,
      isPositive: true,
      icon: DollarSign,
      color: "var(--status-success)",
      bg: "var(--status-success-bg)",
      link: "/wallet",
      description: "Monetary income (excludes points/coins)",
    },
    {
      id: "pending_reports",
      title: "Pending Reports",
      value: data.pendingReports.value,
      subtext: `${data.pendingReports.urgentCount} high priority flags`,
      isPositive: false,
      icon: ShieldAlert,
      color: "var(--status-error)",
      bg: "var(--status-error-bg)",
      link: "/moderation",
      badge: { text: "ACTION REQUIRED", variant: "error" as const },
      description: "Community safety moderation queue",
    },
    {
      id: "pending_verification",
      title: "Pending Verification",
      value: `${data.pendingVerification.value} Submissions`,
      subtext: `${data.pendingVerification.photoRequests} photos • ${data.pendingVerification.idRequests} IDs`,
      isPositive: true,
      icon: BadgeCheck,
      color: "var(--accent-lavender)",
      bg: "var(--accent-lavender-bg)",
      link: "/profiles",
      description: "Selfie and government ID review queue",
    },
    {
      id: "support_tickets",
      title: "Open Support Tickets",
      value: `${data.openSupportTickets.value} Tickets`,
      subtext: `${data.openSupportTickets.urgentCount} urgent requests`,
      isPositive: false,
      icon: Headset,
      color: "var(--status-warning)",
      bg: "var(--status-warning-bg)",
      link: "/support",
      badge: { text: "SUPPORT", variant: "warning" as const },
      description: "Awaiting customer agent response",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "16px",
      }}
    >
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => navigate(card.link)}
            style={{
              padding: "18px 20px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              boxShadow: "var(--shadow-sm)",
              cursor: "pointer",
              transition: "all 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "12px",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "var(--shadow-md)";
              e.currentTarget.style.borderColor = "var(--border-focus)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "var(--shadow-sm)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            {/* Top row: Title + Icon */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  letterSpacing: "0.2px",
                }}
              >
                {card.title}
              </span>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  backgroundColor: card.bg,
                  color: card.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={18} strokeWidth={2.2} />
              </div>
            </div>

            {/* Middle row: Big Value + Badge */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px", flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "var(--text-main)",
                  letterSpacing: "-0.5px",
                }}
              >
                {card.value}
              </span>
              {card.badge && (
                <Badge variant={card.badge.variant} dot={card.badge.variant === "live"}>
                  {card.badge.text}
                </Badge>
              )}
            </div>

            {/* Bottom row: Trend or Description */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: "6px",
                borderTop: "1px solid var(--border-light)",
                fontSize: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                {card.isPositive ? (
                  <TrendingUp size={13} color="var(--status-success)" />
                ) : (
                  <AlertTriangle size={13} color="var(--status-error)" />
                )}
                <span
                  style={{
                    color: card.isPositive ? "var(--status-success)" : "var(--status-error)",
                    fontWeight: 600,
                  }}
                >
                  {card.subtext}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "2px",
                  color: "var(--text-secondary)",
                  fontSize: "11px",
                  fontWeight: 600,
                }}
              >
                <span>View</span>
                <ArrowRight size={11} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

