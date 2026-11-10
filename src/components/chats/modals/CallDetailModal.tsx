// NobleBond Admin — WebRTC Call Telemetry & Diagnostics Modal
// Strict privacy notice, session metrics, ICE candidates, packet loss telemetry, zero emojis

import React from "react";
import {
  X,
  PhoneCall,
  Video,
  Lock,
  XCircle,
} from "lucide-react";
import type { CallRecord } from "../../../types/chatManagement.types";

interface CallDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  call: CallRecord | null;
  onOpenUserProfile?: (userId: string) => void;
}

export const CallDetailModal: React.FC<CallDetailModalProps> = ({
  isOpen,
  onClose,
  call,
  onOpenUserProfile,
}) => {
  if (!isOpen || !call) return null;

  const startDate = new Date(call.startedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const endDate = call.endedAt
    ? new Date(call.endedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "Session ended abruptly or timed out";

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return "0 seconds (Unanswered / Rejected)";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} minutes ${secs} seconds`;
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(4px)",
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
          maxWidth: "600px",
          maxHeight: "90vh",
          backgroundColor: "var(--bg-card)",
          borderRadius: "18px",
          border: "1px solid var(--border)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
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
            backgroundColor: "var(--bg-surface)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: call.type === "video" ? "rgba(79, 70, 229, 0.12)" : "rgba(13, 148, 136, 0.12)",
                color: call.type === "video" ? "#4F46E5" : "#0D9488",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {call.type === "video" ? <Video size={20} /> : <PhoneCall size={20} />}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
                  Call Telemetry: {call.id}
                </h3>
                <span
                  style={{
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "10.5px",
                    fontWeight: 700,
                    backgroundColor: call.status === "completed" ? "rgba(16, 185, 129, 0.12)" : "rgba(220, 38, 38, 0.12)",
                    color: call.status === "completed" ? "var(--status-success)" : "#DC2626",
                    textTransform: "capitalize",
                  }}
                >
                  {call.status}
                </span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                Protocol: {call.encryptionProtocol}
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
              backgroundColor: "var(--bg-card)",
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
          {/* Privacy Protocol Alert */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              backgroundColor: "rgba(13, 148, 136, 0.08)",
              border: "1px solid rgba(13, 148, 136, 0.25)",
              color: "#0F766E",
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
            }}
          >
            <Lock size={17} style={{ marginTop: "2px", flexShrink: 0 }} />
            <div style={{ fontSize: "12.5px", lineHeight: 1.4 }}>
              <strong>Zero Eavesdropping Mandate:</strong> Live audio/video streaming and session recording are completely disabled by system design. Administrators can inspect network quality, bitrate distribution, and connection teardown reasons only.
            </div>
          </div>

          {/* Participants */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div
              style={{
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border)",
                cursor: "pointer",
              }}
              onClick={() => onOpenUserProfile?.(call.caller.id)}
            >
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                Caller (Initiator)
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
                <img src={call.caller.avatar} alt={call.caller.name} style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }} />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>{call.caller.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{call.caller.city}</div>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border)",
                cursor: "pointer",
              }}
              onClick={() => onOpenUserProfile?.(call.recipient.id)}
            >
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                Recipient (Callee)
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
                <img src={call.recipient.avatar} alt={call.recipient.name} style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }} />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>{call.recipient.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{call.recipient.city}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Network Diagnostics Grid */}
          <div>
            <h4 style={{ fontSize: "12.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-secondary)", marginBottom: "10px" }}>
              WebRTC Connection Quality Telemetry
            </h4>

            <div
              style={{
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
                <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>Packet Loss</span>
                <div style={{ fontSize: "18px", fontWeight: 800, color: call.packetLossPercent > 5 ? "#DC2626" : "var(--status-success)" }}>
                  {call.packetLossPercent}%
                </div>
              </div>

              <div>
                <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>Round Trip Latency</span>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)" }}>
                  {call.avgLatencyMs} ms
                </div>
              </div>

              <div>
                <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>Duration</span>
                <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)", marginTop: "2px" }}>
                  {formatDuration(call.durationSeconds)}
                </div>
              </div>

              <div>
                <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>Quality Rating</span>
                <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)", textTransform: "capitalize", marginTop: "2px" }}>
                  {call.quality}
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostics / Failure Reasons */}
          {call.failureReason && (
            <div
              style={{
                padding: "14px 16px",
                borderRadius: "12px",
                backgroundColor: "rgba(220, 38, 38, 0.08)",
                border: "1px solid rgba(220, 38, 38, 0.3)",
                color: "#DC2626",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "13px" }}>
                <XCircle size={16} /> Connection Teardown Code
              </div>
              <div style={{ fontSize: "12px", marginTop: "4px", lineHeight: 1.4 }}>
                {call.failureReason}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border)",
              fontSize: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Session Initiated:</span>
              <strong style={{ color: "var(--text-main)" }}>{startDate}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Session Terminated:</span>
              <strong style={{ color: "var(--text-main)" }}>{endDate}</strong>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "flex-end",
            backgroundColor: "var(--bg-surface)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "10px 18px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-main)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
