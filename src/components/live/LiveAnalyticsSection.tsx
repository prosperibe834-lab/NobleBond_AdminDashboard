// NobleBond Admin — Live Streaming Operations Analytics Section
// SVG-based telemetry, active viewer velocity, gift economy, category breakdown, zero emojis

import React, { useState } from "react";
import {
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Eye,
  Gift,
  Radio,
  Zap,
} from "lucide-react";
import type { LiveSessionRecord, LiveGiftTransactionRecord, LiveReportRecord } from "../../types/liveManagement.types";

interface LiveAnalyticsSectionProps {
  sessions: LiveSessionRecord[];
  gifts: LiveGiftTransactionRecord[];
  reports: LiveReportRecord[];
}

export const LiveAnalyticsSection: React.FC<LiveAnalyticsSectionProps> = ({
  sessions,
  gifts,
  reports,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [timeframe, setTimeframe] = useState<"7d" | "30d">("7d");

  const totalViews = sessions.reduce((acc, s) => acc + s.totalUniqueViews, 0);
  const activeViewers = sessions
    .filter((s) => s.status === "live" || s.status === "under_moderation")
    .reduce((acc, s) => acc + s.currentViewers, 0);

  const totalCoinsSpent = gifts
    .filter((g) => g.status === "completed")
    .reduce((acc, g) => acc + g.coinAmount, 0);

  const pendingReportsCount = reports.filter((r) => r.status === "pending" || r.status === "under_review").length;

  // 7-day SVG data for Concurrent Viewers & Broadcasts
  const dailyData7d = [
    { label: "Mon", viewers: 3200, streams: 18, coins: 12500 },
    { label: "Tue", viewers: 3850, streams: 24, coins: 15400 },
    { label: "Wed", viewers: 4200, streams: 28, coins: 19800 },
    { label: "Thu", viewers: 4900, streams: 32, coins: 22400 },
    { label: "Fri", viewers: 6400, streams: 44, coins: 34100 },
    { label: "Sat", viewers: 8200, streams: 58, coins: 48600 },
    { label: "Sun", viewers: 7500, streams: 52, coins: 41200 },
  ];

  const maxViewers = Math.max(...dailyData7d.map((d) => d.viewers));

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          borderBottom: isExpanded ? "1px solid var(--border)" : "none",
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              color: "#EF4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TrendingUp size={18} />
          </div>
          <div>
            <div style={{ fontSize: "14.5px", fontWeight: 700, color: "var(--text-main)" }}>
              Live Streaming Operations &amp; Engagement Analytics
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              Real-time concurrent audience curves, virtual gifting velocity, stream categories, and ingest health
            </div>
          </div>
        </div>

        <button
          type="button"
          style={{
            background: "none",
            border: "none",
            color: "var(--text-secondary)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "12.5px",
            fontWeight: 600,
          }}
        >
          {isExpanded ? (
            <>
              Hide Analytics <ChevronUp size={16} />
            </>
          ) : (
            <>
              View Analytics <ChevronDown size={16} />
            </>
          )}
        </button>
      </div>

      {isExpanded && (
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Quick Metrics Bar */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
            }}
          >
            <div
              style={{
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#2563EB", marginBottom: "4px" }}>
                <Eye size={15} />
                <span style={{ fontSize: "12px", fontWeight: 600 }}>Active Online Audience</span>
              </div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-main)" }}>
                {activeViewers.toLocaleString()}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                Watching live broadcasts now
              </div>
            </div>

            <div
              style={{
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--accent-champagne)", marginBottom: "4px" }}>
                <Gift size={15} />
                <span style={{ fontSize: "12px", fontWeight: 600 }}>Gift Coins Transacted</span>
              </div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-main)" }}>
                {totalCoinsSpent.toLocaleString()} Coins
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                {gifts.length} gift exchanges recorded
              </div>
            </div>

            <div
              style={{
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#059669", marginBottom: "4px" }}>
                <Radio size={15} />
                <span style={{ fontSize: "12px", fontWeight: 600 }}>Total Accumulated Views</span>
              </div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-main)" }}>
                {totalViews.toLocaleString()}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                Unique room impressions
              </div>
            </div>

            <div
              style={{
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#DC2626", marginBottom: "4px" }}>
                <Zap size={15} />
                <span style={{ fontSize: "12px", fontWeight: 600 }}>Triage Queue SLA</span>
              </div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-main)" }}>
                {pendingReportsCount} Pending
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                Average response: &lt; 2.5 minutes
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "18px",
            }}
          >
            {/* SVG Chart 1: Daily Peak Concurrent Viewers */}
            <div
              style={{
                padding: "16px",
                borderRadius: "14px",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <div>
                  <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)" }}>
                    Peak Concurrent Viewers
                  </div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                    Daily maximum concurrent streaming audience
                  </div>
                </div>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button
                    type="button"
                    onClick={() => setTimeframe("7d")}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 600,
                      cursor: "pointer",
                      border: "none",
                      backgroundColor: timeframe === "7d" ? "var(--primary)" : "var(--bg-surface-elevated)",
                      color: timeframe === "7d" ? "#ffffff" : "var(--text-secondary)",
                    }}
                  >
                    7D
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeframe("30d")}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 600,
                      cursor: "pointer",
                      border: "none",
                      backgroundColor: timeframe === "30d" ? "var(--primary)" : "var(--bg-surface-elevated)",
                      color: timeframe === "30d" ? "#ffffff" : "var(--text-secondary)",
                    }}
                  >
                    30D
                  </button>
                </div>
              </div>

              {/* Area / Bar Chart SVG */}
              <div style={{ width: "100%", height: "160px" }}>
                <svg width="100%" height="100%" viewBox="0 0 380 150" preserveAspectRatio="none">
                  <line x1="30" y1="20" x2="370" y2="20" stroke="var(--border)" strokeDasharray="3 3" opacity="0.6" />
                  <line x1="30" y1="70" x2="370" y2="70" stroke="var(--border)" strokeDasharray="3 3" opacity="0.6" />
                  <line x1="30" y1="120" x2="370" y2="120" stroke="var(--border)" opacity="0.8" />

                  {dailyData7d.map((d, i) => {
                    const colWidth = 26;
                    const x = 45 + i * 46;
                    const barHeight = Math.max(14, (d.viewers / maxViewers) * 95);
                    const y = 120 - barHeight;

                    return (
                      <g key={i}>
                        <rect
                          x={x}
                          y={y}
                          width={colWidth}
                          height={barHeight}
                          rx={5}
                          fill="url(#liveViewerGrad)"
                          opacity="0.9"
                        />
                        <text
                          x={x + colWidth / 2}
                          y={136}
                          fontSize="10"
                          textAnchor="middle"
                          fill="var(--text-muted)"
                          fontWeight="600"
                        >
                          {d.label}
                        </text>
                      </g>
                    );
                  })}

                  <defs>
                    <linearGradient id="liveViewerGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="100%" stopColor="#F87171" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Popular Broadcast Categories Breakdown */}
            <div
              style={{
                padding: "16px",
                borderRadius: "14px",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)" }}>
                  Most Popular Live Categories
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginBottom: "14px" }}>
                  Audience share by stream genre
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "3px" }}>
                      <span style={{ color: "var(--text-secondary)" }}>Music &amp; Acoustic Performances</span>
                      <strong style={{ color: "var(--text-main)" }}>38.4%</strong>
                    </div>
                    <div style={{ width: "100%", height: "6px", backgroundColor: "var(--bg-card)", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ width: "38.4%", height: "100%", backgroundColor: "#8B5CF6", borderRadius: "3px" }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "3px" }}>
                      <span style={{ color: "var(--text-secondary)" }}>Dating Q&amp;A &amp; Relationships</span>
                      <strong style={{ color: "var(--text-main)" }}>28.6%</strong>
                    </div>
                    <div style={{ width: "100%", height: "6px", backgroundColor: "var(--bg-card)", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ width: "28.6%", height: "100%", backgroundColor: "#EC4899", borderRadius: "3px" }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "3px" }}>
                      <span style={{ color: "var(--text-secondary)" }}>Lifestyle &amp; Casual Conversations</span>
                      <strong style={{ color: "var(--text-main)" }}>18.2%</strong>
                    </div>
                    <div style={{ width: "100%", height: "6px", backgroundColor: "var(--bg-card)", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ width: "18.2%", height: "100%", backgroundColor: "#2563EB", borderRadius: "3px" }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "3px" }}>
                      <span style={{ color: "var(--text-secondary)" }}>Speed Dating &amp; Showcase</span>
                      <strong style={{ color: "var(--text-main)" }}>14.8%</strong>
                    </div>
                    <div style={{ width: "100%", height: "6px", backgroundColor: "var(--bg-card)", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ width: "14.8%", height: "100%", backgroundColor: "#F59E0B", borderRadius: "3px" }} />
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  backgroundColor: "var(--bg-surface-elevated)",
                  marginTop: "12px",
                  fontSize: "11.5px",
                }}
              >
                <span style={{ color: "var(--text-muted)" }}>Ingest Protocol Status:</span>
                <strong style={{ color: "var(--status-success)" }}>Agora RTC + LiveKit 99.4% SLA</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

