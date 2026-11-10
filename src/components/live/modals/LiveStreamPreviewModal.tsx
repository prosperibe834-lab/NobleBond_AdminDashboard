// NobleBond Admin — Live Stream Preview Modal
// Real-time compliance monitoring viewer with privacy disclosure, zero emojis

import React, { useState } from "react";
import {
  X,
  Radio,
  Eye,
  Coins,
  Shield,
  Activity,
  Wifi,
  Video,
  Mic,
  StopCircle,
} from "lucide-react";
import type { LiveSessionRecord } from "../../../types/liveManagement.types";

interface LiveStreamPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: LiveSessionRecord | null;
  onEndSession?: (session: LiveSessionRecord) => void;
}

export const LiveStreamPreviewModal: React.FC<LiveStreamPreviewModalProps> = ({
  isOpen,
  onClose,
  session,
  onEndSession,
}) => {
  const [isAudioMuted, setIsAudioMuted] = useState(true);

  if (!isOpen || !session) return null;

  const isLive = session.status === "live";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        className="animate-scale-up"
        style={{
          width: "100%",
          maxWidth: "880px",
          maxHeight: "92vh",
          backgroundColor: "var(--bg-card)",
          borderRadius: "18px",
          border: "1px solid var(--border)",
          boxShadow: "0 24px 48px rgba(0,0,0,0.35)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "var(--bg-secondary)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: isLive
                  ? "rgba(239, 68, 68, 0.12)"
                  : "rgba(107, 114, 128, 0.12)",
                color: isLive ? "#EF4444" : "#6B7280",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Radio size={20} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  {session.title}
                </h3>
                {isLive ? (
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      backgroundColor: "#FEF2F2",
                      color: "#DC2626",
                      border: "1px solid #FCA5A5",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#DC2626",
                      }}
                    />
                    Live Now
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      backgroundColor: "#F3F4F6",
                      color: "#4B5563",
                    }}
                  >
                    {session.status}
                  </span>
                )}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  marginTop: "2px",
                }}
              >
                Host: <strong>{session.host.name}</strong> (@{session.host.username}) • Room: {session.id}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {isLive && onEndSession && (
              <button
                onClick={() => onEndSession(session)}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  fontWeight: 600,
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#EF4444",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <StopCircle size={14} /> Terminate Stream
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "6px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Stream Canvas & Simulation Viewport */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "420px",
            backgroundColor: "#0B0F19",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Simulated Video Feed Background */}
          <img
            src={session.thumbnailUrl || session.host.avatar}
            alt={session.title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.7) blur(2px)",
              transform: "scale(1.05)",
            }}
          />

          {/* Central Active Stage Simulation */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              padding: "20px",
              borderRadius: "16px",
              backgroundColor: "rgba(15, 23, 42, 0.75)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              maxWidth: "360px",
              textAlign: "center",
            }}
          >
            <div style={{ position: "relative" }}>
              <img
                src={session.host.avatar}
                alt={session.host.name}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #8B5CF6",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: -4,
                  right: -4,
                  padding: "4px 8px",
                  borderRadius: "10px",
                  backgroundColor: "#10B981",
                  color: "#FFFFFF",
                  fontSize: "10px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                }}
              >
                <Radio size={10} /> 1080p
              </div>
            </div>

            <div>
              <div style={{ color: "#FFFFFF", fontSize: "15px", fontWeight: 700 }}>
                {session.host.name}
              </div>
              <div style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "12px" }}>
                @{session.host.username}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                fontSize: "11px",
                color: "rgba(255, 255, 255, 0.9)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Eye size={13} color="#60A5FA" /> {session.currentViewers.toLocaleString()} watching
              </span>
              <span>•</span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Coins size={13} color="#FBBF24" /> {session.giftCoinsEarned.toLocaleString()} coins
              </span>
            </div>
          </div>

          {/* Guest Picture-in-Picture Thumbnails (if co-hosts on stage) */}
          {session.currentGuests.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                zIndex: 3,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {session.currentGuests.map((g) => (
                <div
                  key={g.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 10px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(15, 23, 42, 0.85)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <img
                    src={g.user.avatar}
                    alt={g.user.name}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#FFFFFF",
                        maxWidth: "90px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {g.user.name}
                    </div>
                    <div
                      style={{
                        fontSize: "9px",
                        color: "#10B981",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Video size={9} /> Stage Guest
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Telemetry Overlay Badges */}
          <div
            style={{
              position: "absolute",
              bottom: "16px",
              left: "16px",
              zIndex: 3,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                padding: "4px 8px",
                borderRadius: "6px",
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                color: "#10B981",
                fontSize: "11px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Activity size={12} /> {session.bitrateKbps} kbps
            </div>
            <div
              style={{
                padding: "4px 8px",
                borderRadius: "6px",
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                color: "#60A5FA",
                fontSize: "11px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Wifi size={12} /> {session.fps} FPS
            </div>
            <div
              style={{
                padding: "4px 8px",
                borderRadius: "6px",
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                color: "#E2E8F0",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              Latency: {session.latencyMs}ms
            </div>
            <div
              style={{
                padding: "4px 8px",
                borderRadius: "6px",
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                color: session.packetLossPercent > 1 ? "#EF4444" : "#10B981",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              Loss: {session.packetLossPercent}%
            </div>
          </div>

          {/* Audio Mute Toggle Button */}
          <div
            style={{
              position: "absolute",
              bottom: "16px",
              right: "16px",
              zIndex: 3,
            }}
          >
            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#FFFFFF",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Mic size={13} color={isAudioMuted ? "#EF4444" : "#10B981"} />
              {isAudioMuted ? "Monitor Audio Muted" : "Monitoring Live Audio"}
            </button>
          </div>
        </div>

        {/* Privacy Notice Banner */}
        <div
          style={{
            padding: "12px 20px",
            backgroundColor: "rgba(99, 102, 241, 0.06)",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "12px",
            color: "var(--text-secondary)",
          }}
        >
          <Shield size={16} color="#6366F1" style={{ flexShrink: 0 }} />
          <span>
            <strong>Moderation Telemetry Feed:</strong> This live stream preview is rendered strictly in real-time for compliance and trust & safety evaluation. Streams are not silently stored, eavesdropped, or downloaded.
          </span>
        </div>

        {/* Telemetry & Room Stats Bar */}
        <div
          style={{
            padding: "16px 20px",
            backgroundColor: "var(--bg-secondary)",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "12px",
          }}
        >
          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Category</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
              {session.category.replace(/_/g, " ").toUpperCase()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Ingest Provider</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
              {session.streamProvider.toUpperCase()} WebRTC
            </div>
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Elapsed Duration</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
              {session.durationMinutes} Minutes
            </div>
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Moderation Health</div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color:
                  session.moderationStatus === "clean"
                    ? "#10B981"
                    : session.moderationStatus === "flagged"
                    ? "#EF4444"
                    : "#F59E0B",
                textTransform: "capitalize",
              }}
            >
              {session.moderationStatus}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
