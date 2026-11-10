// NobleBond Admin — Live Now Active Stream Cards
// Prominent real-time broadcast cards with audience telemetry and moderation controls, zero emojis

import React from "react";
import {
  Eye,
  Users,
  Coins,
  Radio,
  Clock,
  ShieldAlert,
  Play,
  Ban,
  ExternalLink,
} from "lucide-react";
import type { LiveSessionRecord } from "../../types/liveManagement.types";

interface LiveNowGridProps {
  sessions: LiveSessionRecord[];
  onOpenDetails: (session: LiveSessionRecord) => void;
  onOpenPreview: (session: LiveSessionRecord) => void;
  onOpenEndSession: (session: LiveSessionRecord) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const LiveNowGrid: React.FC<LiveNowGridProps> = ({
  sessions,
  onOpenDetails,
  onOpenPreview,
  onOpenEndSession,
  onOpenUserProfile,
}) => {
  const activeRooms = sessions.filter(
    (s) => s.status === "live" || s.status === "under_moderation"
  );

  if (activeRooms.length === 0) {
    return (
      <div
        style={{
          padding: "36px 20px",
          textAlign: "center",
          backgroundColor: "var(--bg-card)",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          color: "var(--text-secondary)",
          marginBottom: "20px",
        }}
      >
        <Radio size={32} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
        <div style={{ fontSize: "14.5px", fontWeight: 700 }}>No broadcasts currently live</div>
        <div style={{ fontSize: "12px", marginTop: "4px" }}>
          All rooms are currently offline or ended.
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#EF4444",
            }}
            className="animate-pulse-live"
          />
          <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
            Live Now ({activeRooms.length} Active Broadcasts)
          </h3>
        </div>
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          Real-time room monitoring &bull; Agora RTC &amp; LiveKit ingest
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "18px",
        }}
      >
        {activeRooms.map((room) => {
          return (
            <div
              key={room.id}
              style={{
                backgroundColor: "var(--bg-card)",
                border: room.status === "under_moderation"
                  ? "1.5px solid rgba(220, 38, 38, 0.4)"
                  : "1px solid var(--border)",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "var(--shadow-sm)";
              }}
            >
              {/* Thumbnail Stage */}
              <div
                style={{
                  height: "170px",
                  position: "relative",
                  backgroundColor: "#0F0B13",
                  overflow: "hidden",
                }}
              >
                <img
                  src={room.thumbnailUrl}
                  alt={room.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: 0.88,
                  }}
                />

                {/* Live Pill badge */}
                <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "6px" }}>
                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 800,
                      backgroundColor: "#EF4444",
                      color: "#ffffff",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      letterSpacing: "0.04em",
                      boxShadow: "0 2px 6px rgba(239, 68, 68, 0.4)",
                    }}
                  >
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#ffffff",
                      }}
                      className="animate-pulse-live"
                    />
                    LIVE
                  </span>

                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 700,
                      backgroundColor: "rgba(0, 0, 0, 0.65)",
                      color: "#ffffff",
                      backdropFilter: "blur(4px)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Eye size={12} /> {room.currentViewers.toLocaleString()}
                  </span>
                </div>

                {/* Duration & Quality */}
                <div style={{ position: "absolute", top: "12px", right: "12px", display: "flex", gap: "6px" }}>
                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 700,
                      backgroundColor: "rgba(0, 0, 0, 0.65)",
                      color: "#ffffff",
                      backdropFilter: "blur(4px)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Clock size={11} /> {room.durationMinutes}m
                  </span>
                </div>

                {/* Category Pill at bottom left */}
                <div style={{ position: "absolute", bottom: "10px", left: "12px" }}>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "6px",
                      fontSize: "10.5px",
                      fontWeight: 700,
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                      color: "#F3F4F6",
                      textTransform: "capitalize",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    {room.category.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              {/* Room Card Body */}
              <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <h4
                    style={{
                      fontSize: "14.5px",
                      fontWeight: 700,
                      color: "var(--text-main)",
                      lineHeight: 1.3,
                      margin: 0,
                    }}
                  >
                    {room.title}
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "6px",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                      onClick={() => onOpenUserProfile?.(room.host.id)}
                    >
                      <img
                        src={room.host.avatar}
                        alt={room.host.name}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                      <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-main)" }}>
                        {room.host.name}
                      </span>
                    </div>

                    <span style={{ fontSize: "11.5px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Users size={12} /> {room.guestCount} guest{room.guestCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Earnings & Telemetry Pill */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    backgroundColor: "var(--bg-surface)",
                    fontSize: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Coins size={14} style={{ color: "var(--accent-champagne)" }} />
                    <span style={{ fontWeight: 700, color: "var(--accent-champagne)" }}>
                      {room.giftCoinsEarned.toLocaleString()} Coins
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: "11px",
                      color: room.streamHealth === "healthy" ? "var(--status-success)" : "#F59E0B",
                      fontWeight: 600,
                      textTransform: "capitalize",
                    }}
                  >
                    {room.streamHealth} &bull; {room.streamQuality.split("_")[0]}
                  </span>
                </div>

                {/* Moderation Warning if flagged */}
                {room.status === "under_moderation" && (
                  <div
                    style={{
                      padding: "6px 10px",
                      borderRadius: "6px",
                      backgroundColor: "rgba(220, 38, 38, 0.08)",
                      color: "#DC2626",
                      fontSize: "11px",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <ShieldAlert size={12} /> Under Safety Review ({room.activeReportCount} report)
                  </div>
                )}

                {/* Actions Footer */}
                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: "12px",
                    borderTop: "1px solid var(--border)",
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => onOpenPreview(room)}
                    style={{
                      flex: 1,
                      padding: "8px 10px",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--bg-surface)",
                      color: "var(--text-main)",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                    }}
                  >
                    <Play size={12} /> Preview
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenDetails(room)}
                    style={{
                      flex: 1,
                      padding: "8px 10px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "var(--primary)",
                      color: "#ffffff",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                    }}
                  >
                    Details <ExternalLink size={12} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenEndSession(room)}
                    title="End Broadcast"
                    style={{
                      padding: "8px 10px",
                      borderRadius: "8px",
                      border: "1px solid rgba(220, 38, 38, 0.3)",
                      backgroundColor: "rgba(220, 38, 38, 0.08)",
                      color: "#DC2626",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ban size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

