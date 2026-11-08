import React, { useState, useEffect } from "react";
import {
  Users,
  Radio,
  Heart,
  Crown,
  TrendingUp,
  ShieldAlert,
  RefreshCw,
  Plus,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ADMIN_STATS, MOCK_USERS, MOCK_LIVE_BROADCASTS, MOCK_REPORTS } from "../data/adminMockData";
import { Badge } from "../components/common/Badge";
import { DashboardSkeleton } from "../components/common/SkeletonLoader";

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const kpis = [
    {
      title: "Total Registered Users",
      value: ADMIN_STATS.totalUsers,
      change: "+12.4% vs last month",
      isPositive: true,
      icon: Users,
      color: "var(--primary)",
      bg: "rgba(193, 47, 102, 0.1)",
      link: "/users",
    },
    {
      title: "Active Live Broadcasts",
      value: ADMIN_STATS.activeLiveStreams,
      change: "2,400+ concurrent viewers",
      isPositive: true,
      icon: Radio,
      color: "#EF4444",
      bg: "rgba(239, 68, 68, 0.1)",
      link: "/live",
      isLive: true,
    },
    {
      title: "Mutual Matches Made",
      value: ADMIN_STATS.totalMatches,
      change: "+18.2% daily growth",
      isPositive: true,
      icon: Heart,
      color: "var(--accent-lavender)",
      bg: "var(--accent-lavender-bg)",
      link: "/matches",
    },
    {
      title: "Monthly Platform Revenue",
      value: ADMIN_STATS.monthlyRevenue,
      change: ADMIN_STATS.revenueGrowth,
      isPositive: true,
      icon: Crown,
      color: "var(--accent-champagne)",
      bg: "var(--accent-champagne-bg)",
      link: "/subscriptions",
    },
  ];

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* 1. WELCOME BANNER & QUICK ACTIONS */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-main)" }}>
            Welcome back, Sarah 👋
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Here is what is happening across the NobleBond ecosystem today.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            type="button"
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 400);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-main)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <RefreshCw size={14} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => navigate("/notifications")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "var(--primary)",
              color: "#FFFFFF",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 14px var(--primary-glow)",
            }}
          >
            <Plus size={16} />
            Create Announcement
          </button>
        </div>
      </div>

      {/* 2. TOP KPI CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
        }}
      >
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => navigate(kpi.link)}
              style={{
                padding: "20px",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                boxShadow: "var(--shadow-sm)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
                e.currentTarget.style.borderColor = "var(--border-focus)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>
                  {kpi.title}
                </span>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    backgroundColor: kpi.bg,
                    color: kpi.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={18} />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span style={{ fontSize: "26px", fontWeight: 800, color: "var(--text-main)" }}>
                  {kpi.value}
                </span>
                {kpi.isLive && (
                  <Badge variant="live" dot>
                    ACTIVE NOW
                  </Badge>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px" }}>
                <TrendingUp size={14} color="var(--status-success)" />
                <span style={{ color: "var(--status-success)", fontWeight: 600 }}>
                  {kpi.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. MIDDLE DUAL SECTION: LIVE BROADCASTS & MODERATION ALERTS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
          gap: "20px",
        }}
      >
        {/* Active Live Broadcasts */}
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "var(--shadow-sm)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Radio size={18} color="#EF4444" />
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)" }}>
                Active Live Stream Monitoring
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigate("/live")}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              View all 42 <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {MOCK_LIVE_BROADCASTS.map((stream) => (
              <div
                key={stream.id}
                onClick={() => navigate("/live")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  backgroundColor: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-focus)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-light)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <img
                    src={stream.hostAvatar}
                    alt={stream.hostName}
                    style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)" }}>
                      {stream.hostName}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                      {stream.title}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Badge variant="live" dot>
                    {stream.viewerCount.toLocaleString()} viewers
                  </Badge>
                  <span style={{ fontSize: "12px", color: "var(--accent-champagne)", fontWeight: 700 }}>
                    🪙 {stream.coinsEarned.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Moderation Queue */}
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "var(--shadow-sm)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldAlert size={18} color="var(--status-error)" />
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)" }}>
                Moderation Reports Awaiting Review
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigate("/moderation")}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              View queue (18) <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {MOCK_REPORTS.map((rep) => (
              <div
                key={rep.id}
                onClick={() => navigate("/moderation")}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  backgroundColor: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  cursor: "pointer",
                  gap: "12px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-focus)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-light)";
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)" }}>
                      {rep.reportedUser.name}
                    </span>
                    <Badge variant={rep.severity === "critical" || rep.severity === "high" ? "error" : "warning"}>
                      {rep.reportType}
                    </Badge>
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                    {rep.reason}
                  </p>
                </div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                  {rep.createdAt}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. RECENT USER REGISTRATIONS TABLE PREVIEW */}
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "var(--shadow-sm)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)" }}>
              Recent Member Registrations
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
              Latest profiles registered across North America, Europe and Africa
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/users")}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--primary)",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Manage all users →
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: "12px" }}>
                <th style={{ padding: "10px 12px" }}>USER</th>
                <th style={{ padding: "10px 12px" }}>LOCATION</th>
                <th style={{ padding: "10px 12px" }}>STATUS</th>
                <th style={{ padding: "10px 12px" }}>GIFT COINS</th>
                <th style={{ padding: "10px 12px" }}>POINTS</th>
                <th style={{ padding: "10px 12px" }}>JOINED</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_USERS.slice(0, 4).map((user) => (
                <tr
                  key={user.id}
                  onClick={() => navigate("/users")}
                  style={{
                    borderBottom: "1px solid var(--border-light)",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <img
                        src={user.avatar}
                        alt={user.name}
                        style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--text-main)" }}>
                          {user.name} {user.isPremium && "👑"}
                        </div>
                        <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px", color: "var(--text-secondary)" }}>
                    {user.location}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Badge variant={user.status === "active" ? "success" : user.status === "suspended" ? "error" : "warning"}>
                      {user.status}
                    </Badge>
                  </td>
                  <td style={{ padding: "12px", fontWeight: 600, color: "var(--accent-champagne)" }}>
                    🪙 {user.giftCoins.toLocaleString()}
                  </td>
                  <td style={{ padding: "12px", fontWeight: 600, color: "var(--status-success)" }}>
                    ✨ {user.connectionPoints} Pts
                  </td>
                  <td style={{ padding: "12px", color: "var(--text-secondary)" }}>
                    {user.registeredAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
