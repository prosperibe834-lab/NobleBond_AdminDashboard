// NobleBond Admin — Chat & Messaging Analytics Section
// SVG-based charts, delivery telemetry, call metrics, SLA monitoring, zero emojis

import React, { useState } from "react";
import {
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Activity,
  PhoneCall,
  ShieldCheck,
  Zap,
} from "lucide-react";
import type { ConversationRecord, CallRecord, ReportedConversation } from "../../types/chatManagement.types";

interface ChatAnalyticsSectionProps {
  conversations: ConversationRecord[];
  calls: CallRecord[];
  reports: ReportedConversation[];
}

export const ChatAnalyticsSection: React.FC<ChatAnalyticsSectionProps> = ({
  conversations,
  calls,
  reports,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [timeframe, setTimeframe] = useState<"7d" | "30d">("7d");

  const totalMessages = conversations.reduce((acc, c) => acc + c.totalMessages, 0);
  const activeChats = conversations.filter((c) => c.status === "active").length;
  const avgMessagesPerChat = conversations.length ? Math.round(totalMessages / conversations.length) : 0;

  const totalCallSeconds = calls.reduce((acc, c) => acc + c.durationSeconds, 0);
  const totalCallMinutes = Math.round(totalCallSeconds / 60);
  const completedCalls = calls.filter((c) => c.status === "completed").length;
  const callSuccessRate = calls.length ? Math.round((completedCalls / calls.length) * 100) : 0;

  const resolvedReports = reports.filter((r) => r.status === "resolved" || r.status === "dismissed").length;
  const resolutionRate = reports.length ? Math.round((resolvedReports / reports.length) * 100) : 0;

  // 7-day SVG points for Messaging Volume
  const dailyData7d = [
    { label: "Mon", messages: 1420, calls: 42 },
    { label: "Tue", messages: 1890, calls: 56 },
    { label: "Wed", messages: 2150, calls: 64 },
    { label: "Thu", messages: 2420, calls: 78 },
    { label: "Fri", messages: 3100, calls: 92 },
    { label: "Sat", messages: 3850, calls: 114 },
    { label: "Sun", messages: 3420, calls: 98 },
  ];

  const maxVal = Math.max(...dailyData7d.map((d) => d.messages));

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
              backgroundColor: "rgba(37, 99, 235, 0.08)",
              color: "#2563EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TrendingUp size={18} />
          </div>
          <div>
            <div style={{ fontSize: "14.5px", fontWeight: 700, color: "var(--text-main)" }}>
              Messaging Activity & Infrastructure Telemetry
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              Delivery success rates, WebRTC call performance, volume trends, and safety SLA
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
          {/* Top Quick Telemetry Metric Cards */}
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
                <Activity size={15} />
                <span style={{ fontSize: "12px", fontWeight: 600 }}>Avg Messages / Match</span>
              </div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-main)" }}>
                {avgMessagesPerChat} msgs
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                Active conversational depth
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
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--status-success)", marginBottom: "4px" }}>
                <Zap size={15} />
                <span style={{ fontSize: "12px", fontWeight: 600 }}>Delivery SLA</span>
              </div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-main)" }}>
                99.8%
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                42ms median latency
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
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#0D9488", marginBottom: "4px" }}>
                <PhoneCall size={15} />
                <span style={{ fontSize: "12px", fontWeight: 600 }}>WebRTC Call Volume</span>
              </div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-main)" }}>
                {totalCallMinutes} mins
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                {callSuccessRate}% connection success
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
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#9333EA", marginBottom: "4px" }}>
                <ShieldCheck size={15} />
                <span style={{ fontSize: "12px", fontWeight: 600 }}>Report Triage Rate</span>
              </div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-main)" }}>
                {resolutionRate}%
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                SLA target: &lt; 30 mins
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
            {/* SVG Chart 1: Daily Message Volume Trend */}
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
                    Daily Message Volume Trend
                  </div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                    Encrypted text, audio & media attachments
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

              {/* Bar Chart SVG */}
              <div style={{ width: "100%", height: "160px" }}>
                <svg width="100%" height="100%" viewBox="0 0 380 150" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="30" y1="20" x2="370" y2="20" stroke="var(--border)" strokeDasharray="3 3" opacity="0.6" />
                  <line x1="30" y1="70" x2="370" y2="70" stroke="var(--border)" strokeDasharray="3 3" opacity="0.6" />
                  <line x1="30" y1="120" x2="370" y2="120" stroke="var(--border)" opacity="0.8" />

                  {dailyData7d.map((d, i) => {
                    const colWidth = 26;
                    const x = 45 + i * 46;
                    const barHeight = Math.max(12, (d.messages / maxVal) * 95);
                    const y = 120 - barHeight;

                    return (
                      <g key={i}>
                        <rect
                          x={x}
                          y={y}
                          width={colWidth}
                          height={barHeight}
                          rx={5}
                          fill="url(#msgGrad)"
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
                    <linearGradient id="msgGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" />
                      <stop offset="100%" stopColor="#60A5FA" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Telemetry Breakdown: Delivery & Latency */}
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
                  Delivery Pipeline Health
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginBottom: "14px" }}>
                  Global WebSocket connection status & latency distribution
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "3px" }}>
                      <span style={{ color: "var(--text-secondary)" }}>Optimal Delivery (&lt; 50ms)</span>
                      <strong style={{ color: "var(--status-success)" }}>94.2%</strong>
                    </div>
                    <div style={{ width: "100%", height: "6px", backgroundColor: "var(--bg-card)", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ width: "94.2%", height: "100%", backgroundColor: "var(--status-success)", borderRadius: "3px" }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "3px" }}>
                      <span style={{ color: "var(--text-secondary)" }}>Standard Delivery (50 - 150ms)</span>
                      <strong style={{ color: "#3B82F6" }}>5.4%</strong>
                    </div>
                    <div style={{ width: "100%", height: "6px", backgroundColor: "var(--bg-card)", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ width: "5.4%", height: "100%", backgroundColor: "#3B82F6", borderRadius: "3px" }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "3px" }}>
                      <span style={{ color: "var(--text-secondary)" }}>Delayed / Push Fallback</span>
                      <strong style={{ color: "#F59E0B" }}>0.38%</strong>
                    </div>
                    <div style={{ width: "100%", height: "6px", backgroundColor: "var(--bg-card)", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ width: "3.8%", height: "100%", backgroundColor: "#F59E0B", borderRadius: "3px" }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "3px" }}>
                      <span style={{ color: "var(--text-secondary)" }}>Failed / Offline Queue Expired</span>
                      <strong style={{ color: "#EF4444" }}>0.02%</strong>
                    </div>
                    <div style={{ width: "100%", height: "6px", backgroundColor: "var(--bg-card)", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ width: "1%", height: "100%", backgroundColor: "#EF4444", borderRadius: "3px" }} />
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
                <span style={{ color: "var(--text-muted)" }}>Active Conversation Channels:</span>
                <strong style={{ color: "var(--text-main)" }}>{activeChats} active threads</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
