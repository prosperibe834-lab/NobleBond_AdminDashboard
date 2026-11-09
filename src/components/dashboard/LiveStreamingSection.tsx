import React from "react";
import { useNavigate } from "react-router-dom";
import { Radio, Clock, Coins, ShieldCheck, ChevronRight } from "lucide-react";
import type { LiveStreamOverview } from "../../types/dashboard.types";
import { Badge } from "../common/Badge";

interface LiveStreamingSectionProps {
  streams: LiveStreamOverview[];
  totalActive: string;
  totalViewers: string;
}

export const LiveStreamingSection: React.FC<LiveStreamingSectionProps> = ({
  streams,
  totalActive,
  totalViewers,
}) => {
  const navigate = useNavigate();

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
        gap: "20px",
      }}
    >
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Radio size={18} color="#EF4444" />
            <h3 style={{ fontSize: "17px", fontWeight: 800, color: "var(--text-main)" }}>
              Live Streaming & Broadcaster Operations
            </h3>
            <Badge variant="live" dot>
              {totalActive} ROOMS ACTIVE
            </Badge>
          </div>
          <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
            Real-time live multi-guest stream monitoring and safety controls ({totalViewers})
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/live")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--bg-surface)",
            color: "var(--primary)",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <span>Live Operations Console</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Stream Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "16px",
        }}
      >
        {streams.map((stream) => (
          <div
            key={stream.id}
            onClick={() => navigate("/live")}
            style={{
              padding: "16px",
              borderRadius: "14px",
              backgroundColor: "var(--bg-surface-elevated)",
              border: "1px solid var(--border-light)",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
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
            {/* Host info and Live badge */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img
                  src={stream.hostAvatar}
                  alt={stream.hostName}
                  style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)" }}>
                    {stream.hostName}
                  </div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                    {stream.guests} guest seats connected
                  </div>
                </div>
              </div>

              <Badge variant="live" dot>
                {stream.viewers.toLocaleString()} viewers
              </Badge>
            </div>

            {/* Stream Title */}
            <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-main)", lineHeight: 1.4 }}>
              {stream.title}
            </div>

            {/* Telemetry info */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: "8px",
                borderTop: "1px solid var(--border-light)",
                fontSize: "12px",
                color: "var(--text-secondary)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Clock size={13} />
                <span>Elapsed: {stream.duration}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--accent-champagne)", fontWeight: 700 }}>
                <Coins size={13} />
                <span>{stream.coinsEarned.toLocaleString()} Coins</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--status-success)", fontWeight: 600 }}>
                <ShieldCheck size={13} />
                <span>{stream.safetyScore}% Safety</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
