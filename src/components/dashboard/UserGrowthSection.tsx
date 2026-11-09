import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCheck, UserX, Clock, ChevronRight } from "lucide-react";
import type { ChartDataPoint } from "../../types/dashboard.types";

interface UserGrowthSectionProps {
  growthData: ChartDataPoint[];
  totalUsers: string;
  newRegistrations: string;
}

export const UserGrowthSection: React.FC<UserGrowthSectionProps> = ({
  growthData,
  totalUsers,
  newRegistrations,
}) => {
  const navigate = useNavigate();
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);

  // SVG Chart calculation parameters
  const svgWidth = 700;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const maxVal = Math.max(...growthData.map((d) => d.value1), 1);
  const minVal = 0;

  // Build points path
  const points = growthData.map((d, i) => {
    const x = paddingX + (i / (growthData.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - ((d.value1 - minVal) / (maxVal - minVal)) * (svgHeight - paddingY * 2);
    return { x, y, data: d };
  });

  const linePath = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, "");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
        gap: "20px",
      }}
    >
      {/* 1. INTERACTIVE USER GROWTH SVG CHART */}
      <div
        style={{
          padding: "22px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "18px",
          boxShadow: "var(--shadow-sm)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
              User Registration Velocity ({newRegistrations})
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
              Active period registrations • Total userbase: {totalUsers}
            </p>
          </div>

          {/* Chart Legend */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", fontSize: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "var(--primary)" }} />
              <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>New Signups</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "var(--accent-lavender)" }} />
              <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>Total Trend</span>
            </div>
          </div>
        </div>

        {/* Dynamic Tooltip Header when hovering a point */}
        <div
          style={{
            height: "28px",
            display: "flex",
            alignItems: "center",
            fontSize: "12.5px",
            color: "var(--text-main)",
          }}
        >
          {hoveredPoint ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontWeight: 700, color: "var(--primary)" }}>
                {hoveredPoint.date} ({hoveredPoint.label}):
              </span>
              <span>
                <strong>+{hoveredPoint.value1.toLocaleString()}</strong> new registrations
              </span>
              <span style={{ color: "var(--text-secondary)" }}>
                Cumulative: {hoveredPoint.value2.toLocaleString()}
              </span>
            </div>
          ) : (
            <span style={{ color: "var(--text-secondary)", fontStyle: "italic", fontSize: "12px" }}>
              Hover over any point to inspect detailed date metrics
            </span>
          )}
        </div>

        {/* SVG Responsive Chart Viewport */}
        <div style={{ width: "100%", overflowX: "auto" }}>
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            style={{ width: "100%", height: "auto", overflow: "visible" }}
          >
            <defs>
              <linearGradient id="growthAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
              const y = paddingY + pct * (svgHeight - paddingY * 2);
              return (
                <line
                  key={idx}
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="var(--border-light)"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
              );
            })}

            {/* Area Fill */}
            <path d={areaPath} fill="url(#growthAreaGradient)" />

            {/* Stroke Line */}
            <path
              d={linePath}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Interactive Data Points */}
            {points.map((pt, i) => {
              const isHovered = hoveredPoint?.label === pt.data.label;
              return (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6 : 4}
                    fill="var(--bg-surface)"
                    stroke="var(--primary)"
                    strokeWidth={isHovered ? 3 : 2}
                    style={{ cursor: "pointer", transition: "r 0.15s ease" }}
                    onMouseEnter={() => setHoveredPoint(pt.data)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {/* Date labels at bottom */}
                  <text
                    x={pt.x}
                    y={svgHeight - 10}
                    textAnchor="middle"
                    fill="var(--text-secondary)"
                    fontSize="10"
                    fontWeight="500"
                  >
                    {pt.data.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 2. REGISTRATION BREAKDOWN METRICS */}
      <div
        style={{
          padding: "22px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "18px",
          boxShadow: "var(--shadow-sm)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "18px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
              Registration Breakdown
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
              Integrity and verification status across 1.28M accounts
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/users")}
            style={{
              background: "none",
              border: "none",
              color: "var(--primary)",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Manage <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Verified Accounts */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-main)" }}>
                <UserCheck size={14} color="var(--status-success)" />
                Verified Accounts (ID & Selfie)
              </span>
              <span style={{ color: "var(--status-success)" }}>82% (1,053,300)</span>
            </div>
            <div style={{ width: "100%", height: "8px", backgroundColor: "var(--bg-surface-elevated)", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{ width: "82%", height: "100%", backgroundColor: "var(--status-success)", borderRadius: "999px" }} />
            </div>
          </div>

          {/* Pending Verification */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-main)" }}>
                <Clock size={14} color="var(--accent-champagne)" />
                Standard / Unverified Members
              </span>
              <span style={{ color: "var(--accent-champagne)" }}>15% (192,670)</span>
            </div>
            <div style={{ width: "100%", height: "8px", backgroundColor: "var(--bg-surface-elevated)", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{ width: "15%", height: "100%", backgroundColor: "var(--accent-champagne)", borderRadius: "999px" }} />
            </div>
          </div>

          {/* Suspended Accounts */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-main)" }}>
                <UserX size={14} color="var(--status-error)" />
                Restricted / Suspended Accounts
              </span>
              <span style={{ color: "var(--status-error)" }}>3% (38,550)</span>
            </div>
            <div style={{ width: "100%", height: "8px", backgroundColor: "var(--bg-surface-elevated)", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{ width: "3%", height: "100%", backgroundColor: "var(--status-error)", borderRadius: "999px" }} />
            </div>
          </div>
        </div>

        {/* Security badge at bottom */}
        <div
          style={{
            padding: "12px 14px",
            borderRadius: "12px",
            backgroundColor: "var(--bg-surface-elevated)",
            border: "1px solid var(--border-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "12px",
          }}
        >
          <span style={{ color: "var(--text-secondary)" }}>Verification SLA Compliance:</span>
          <span style={{ fontWeight: 700, color: "var(--status-success)" }}>98.4% within 2 hours</span>
        </div>
      </div>
    </div>
  );
};
