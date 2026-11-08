import React, { useState } from "react";
import { Ban } from "lucide-react";
import { MOCK_LIVE_BROADCASTS } from "../data/adminMockData";
import type { LiveBroadcastItem } from "../data/adminMockData";
import { Badge } from "../components/common/Badge";

export const LiveManagementPage: React.FC = () => {
  const [streams, setStreams] = useState<LiveBroadcastItem[]>(MOCK_LIVE_BROADCASTS);
  const [toast, setToast] = useState<string | null>(null);

  const handleTerminateStream = (id: string, hostName: string) => {
    setStreams((prev) => prev.filter((s) => s.id !== id));
    setToast(`Broadcast terminated for ${hostName} due to policy compliance review.`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-main)" }}>
            Live Broadcast Management
          </h2>
          <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
            Real-time live streaming oversight, multi-guest monitoring, and safety controls.
          </p>
        </div>

        {toast && (
          <div
            className="animate-scale-up"
            style={{
              padding: "8px 16px",
              backgroundColor: "var(--status-error-bg)",
              border: "1px solid var(--status-error)",
              borderRadius: "10px",
              color: "var(--status-error)",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            {toast}
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        <div style={{ padding: "18px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px" }}>
          <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", fontWeight: 600 }}>Active Broadcasts</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#EF4444", marginTop: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#EF4444" }} className="animate-pulse-live" />
            42 Rooms
          </div>
        </div>
        <div style={{ padding: "18px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px" }}>
          <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", fontWeight: 600 }}>Concurrent Viewers</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-main)", marginTop: "4px" }}>
            5,220 Online
          </div>
        </div>
        <div style={{ padding: "18px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px" }}>
          <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", fontWeight: 600 }}>Gift Coins Transacted</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--accent-champagne)", marginTop: "4px" }}>
            🪙 40,100 Coins
          </div>
        </div>
      </div>

      {/* Live Stream Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
        {streams.map((stream) => (
          <div
            key={stream.id}
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Live Video Preview Simulation */}
            <div
              style={{
                height: "180px",
                backgroundColor: "#0F0B13",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={stream.hostAvatar}
                alt={stream.hostName}
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
              />

              <div style={{ position: "absolute", top: "12px", left: "12px" }}>
                <Badge variant="live" dot>
                  LIVE • {stream.viewerCount.toLocaleString()}
                </Badge>
              </div>

              <div style={{ position: "absolute", top: "12px", right: "12px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, backgroundColor: "rgba(0,0,0,0.6)", color: "#FFFFFF", padding: "3px 8px", borderRadius: "6px" }}>
                  {stream.durationMinutes}m
                </span>
              </div>
            </div>

            {/* Stream Info & Controls */}
            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-main)" }}>
                  {stream.title}
                </div>
                <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
                  Host: <strong>{stream.hostName}</strong> ({stream.guestCount} guests connected)
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px", color: "var(--text-secondary)" }}>
                <span>Coins Earned: <strong style={{ color: "var(--accent-champagne)" }}>🪙 {stream.coinsEarned.toLocaleString()}</strong></span>
                <span>Safety Score: <strong style={{ color: "var(--status-success)" }}>{stream.moderationScore}%</strong></span>
              </div>

              <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                <button
                  type="button"
                  onClick={() => handleTerminateStream(stream.id, stream.hostName)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid var(--status-error)",
                    backgroundColor: "var(--status-error-bg)",
                    color: "var(--status-error)",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <Ban size={14} /> End Stream
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
