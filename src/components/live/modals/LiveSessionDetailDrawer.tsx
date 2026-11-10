// NobleBond Admin — Live Session Detail Operational Drawer
// Comprehensive session information, host profile, audience curve, guests, gifts, zero emojis

import React from "react";
import {
  X,
  Radio,
  Eye,
  Coins,
  Play,
  Ban,
  ExternalLink,
} from "lucide-react";
import type { LiveSessionRecord } from "../../../types/liveManagement.types";

interface LiveSessionDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  session: LiveSessionRecord | null;
  onOpenPreview: (session: LiveSessionRecord) => void;
  onOpenEndSession: (session: LiveSessionRecord) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const LiveSessionDetailDrawer: React.FC<LiveSessionDetailDrawerProps> = ({
  isOpen,
  onClose,
  session,
  onOpenPreview,
  onOpenEndSession,
  onOpenUserProfile,
}) => {
  if (!isOpen || !session) return null;

  const startedDate = new Date(session.startedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        className="animate-slide-in-right"
        style={{
          width: "100%",
          maxWidth: "540px",
          height: "100%",
          backgroundColor: "var(--bg-card)",
          boxShadow: "-8px 0 24px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "#EF4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Radio size={18} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
                  Session: {session.id}
                </h3>
                <span
                  style={{
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "10px",
                    fontWeight: 800,
                    backgroundColor: session.status === "live" ? "rgba(239, 68, 68, 0.15)" : "rgba(107, 114, 128, 0.15)",
                    color: session.status === "live" ? "#EF4444" : "var(--text-secondary)",
                    textTransform: "uppercase",
                  }}
                >
                  {session.status}
                </span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                {session.category.replace(/_/g, " ").toUpperCase()} &bull; {session.streamProvider}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "6px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Host Card */}
          <div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Broadcast Host
            </span>
            <div
              style={{
                marginTop: "6px",
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
                onClick={() => onOpenUserProfile?.(session.host.id)}
              >
                <img
                  src={session.host.avatar}
                  alt={session.host.name}
                  style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)" }}>
                    {session.host.name}
                  </div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                    {session.host.username} &bull; {session.host.city}, {session.host.country}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onOpenUserProfile?.(session.host.id)}
                style={{
                  padding: "5px 10px",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-main)",
                  fontSize: "11.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                Profile <ExternalLink size={11} />
              </button>
            </div>
          </div>

          {/* Session Overview Box */}
          <div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Stream Title &amp; Description
            </span>
            <div
              style={{
                marginTop: "6px",
                padding: "14px 16px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border)",
                fontSize: "13px",
                lineHeight: 1.5,
                color: "var(--text-main)",
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: "4px" }}>{session.title}</div>
              <div style={{ color: "var(--text-secondary)", fontSize: "12.5px" }}>{session.description}</div>
            </div>
          </div>

          {/* Audience & Performance Grid */}
          <div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Audience &amp; Financial Performance
            </span>
            <div
              style={{
                marginTop: "6px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                backgroundColor: "var(--bg-surface)",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid var(--border)",
              }}
            >
              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Current Viewers</span>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "#EF4444", display: "flex", alignItems: "center", gap: "5px" }}>
                  <Eye size={16} /> {session.currentViewers.toLocaleString()}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                  Peak: {session.peakViewers.toLocaleString()} viewers
                </div>
              </div>

              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Gift Coins Transacted</span>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--accent-champagne)", display: "flex", alignItems: "center", gap: "5px" }}>
                  <Coins size={16} /> {session.giftCoinsEarned.toLocaleString()}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                  {session.giftsReceivedCount} gifts received
                </div>
              </div>

              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Total Impressions</span>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)", marginTop: "4px" }}>
                  {session.totalUniqueViews.toLocaleString()} views
                </div>
              </div>

              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Total Airtime</span>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)", marginTop: "4px" }}>
                  {session.durationMinutes} minutes
                </div>
              </div>
            </div>
          </div>

          {/* Connected Co-Hosts & Guests */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                Multi-Guest Stage ({session.currentGuests.length})
              </span>
            </div>

            <div style={{ marginTop: "6px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {session.currentGuests.length === 0 ? (
                <div style={{ padding: "12px", backgroundColor: "var(--bg-surface)", borderRadius: "10px", fontSize: "12px", color: "var(--text-muted)", textAlign: "center" }}>
                  Solo broadcast (no guest co-hosts connected)
                </div>
              ) : (
                session.currentGuests.map((guest) => (
                  <div
                    key={guest.id}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "10px",
                      backgroundColor: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <img src={guest.user.avatar} alt={guest.user.name} style={{ width: "26px", height: "26px", borderRadius: "50%", objectFit: "cover" }} />
                      <div>
                        <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)" }}>{guest.user.name}</div>
                        <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>{guest.durationMinutes}m on stage &bull; Cam {guest.cameraStatus}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: guest.connectionStatus === "connected" ? "var(--status-success)" : "#DC2626" }}>
                      {guest.connectionStatus}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Streaming Telemetry */}
          <div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Technical Ingest Telemetry
            </span>
            <div
              style={{
                marginTop: "6px",
                padding: "12px 14px",
                borderRadius: "10px",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border)",
                fontSize: "12px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
              }}
            >
              <div>Resolution: <strong>{session.streamQuality}</strong></div>
              <div>Bitrate: <strong>{session.bitrateKbps} kbps</strong></div>
              <div>Frame Rate: <strong>{session.fps} FPS</strong></div>
              <div>Ingest Latency: <strong>{session.latencyMs} ms</strong></div>
              <div>Packet Loss: <strong>{session.packetLossPercent}%</strong></div>
              <div>Provider: <strong>{session.streamProvider}</strong></div>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
            Session Started: {startedDate}
            {session.endedAt && ` • Concluded: ${new Date(session.endedAt).toLocaleTimeString()}`}
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: "18px 24px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            gap: "10px",
            backgroundColor: "var(--bg-surface)",
          }}
        >
          {session.status === "live" && (
            <button
              type="button"
              onClick={() => onOpenPreview(session)}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-main)",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              <Play size={14} /> Moderation Preview
            </button>
          )}

          {(session.status === "live" || session.status === "under_moderation") && (
            <button
              type="button"
              onClick={() => onOpenEndSession(session)}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#DC2626",
                color: "#ffffff",
                fontSize: "12.5px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              <Ban size={14} /> Terminate Broadcast
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
