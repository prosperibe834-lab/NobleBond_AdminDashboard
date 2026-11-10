// NobleBond Admin — Voice & Video Calls Telemetry Table
// WebRTC session metrics, network diagnostics, strictly zero eavesdropping / zero emojis

import React from "react";
import {
  PhoneCall,
  Video,
  CheckCircle2,
  PhoneOff,
  PhoneMissed,
  XCircle,
  Lock,
  ChevronRight,
} from "lucide-react";
import type { CallRecord } from "../../types/chatManagement.types";

interface CallsMonitoringTableProps {
  calls: CallRecord[];
  onOpenCallDiagnostics: (call: CallRecord) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const CallsMonitoringTable: React.FC<CallsMonitoringTableProps> = ({
  calls,
  onOpenCallDiagnostics,
  onOpenUserProfile,
}) => {
  const getStatusBadge = (status: CallRecord["status"]) => {
    switch (status) {
      case "completed":
        return (
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 700,
              backgroundColor: "rgba(16, 185, 129, 0.12)",
              color: "var(--status-success)",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <CheckCircle2 size={12} /> Completed
          </span>
        );
      case "missed":
        return (
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: "rgba(245, 158, 11, 0.12)",
              color: "#D97706",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <PhoneMissed size={12} /> Missed
          </span>
        );
      case "declined":
        return (
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: "rgba(107, 114, 128, 0.12)",
              color: "#6B7280",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <PhoneOff size={12} /> Declined
          </span>
        );
      case "failed":
        return (
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 800,
              backgroundColor: "rgba(220, 38, 38, 0.12)",
              color: "#DC2626",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <XCircle size={12} /> Failed
          </span>
        );
      default:
        return null;
    }
  };

  const getQualityBadge = (quality: CallRecord["quality"]) => {
    switch (quality) {
      case "excellent":
        return <span style={{ color: "var(--status-success)", fontWeight: 700 }}>Excellent (HD)</span>;
      case "good":
        return <span style={{ color: "#3B82F6", fontWeight: 600 }}>Good</span>;
      case "fair":
        return <span style={{ color: "#F59E0B", fontWeight: 600 }}>Fair</span>;
      case "poor":
      case "degraded":
        return <span style={{ color: "#DC2626", fontWeight: 700 }}>Degraded</span>;
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return "0s";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Privacy Mandate Alert Banner */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "14px 18px",
          backgroundColor: "rgba(13, 148, 136, 0.08)",
          border: "1px solid rgba(13, 148, 136, 0.25)",
          borderRadius: "14px",
          color: "#0F766E",
        }}
      >
        <Lock size={18} />
        <span style={{ fontSize: "13px", lineHeight: 1.4 }}>
          <strong>WebRTC Privacy &amp; Telemetry Protocol:</strong> NobleBond voice and video sessions utilize end-to-end DTLS-SRTP 256-bit encryption. Administrators cannot listen to calls, view live video streams, or access audio recordings. Only connection telemetry, network jitter, and diagnostic failure codes are stored.
        </span>
      </div>

      <div
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: "13px",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderBottom: "1px solid var(--border)",
                  color: "var(--text-secondary)",
                  fontSize: "11.5px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                <th style={{ padding: "14px 18px" }}>Session ID</th>
                <th style={{ padding: "14px 18px" }}>Caller</th>
                <th style={{ padding: "14px 18px" }}>Recipient</th>
                <th style={{ padding: "14px 18px" }}>Session Type</th>
                <th style={{ padding: "14px 18px" }}>Duration</th>
                <th style={{ padding: "14px 18px" }}>Status</th>
                <th style={{ padding: "14px 18px" }}>Network Quality</th>
                <th style={{ padding: "14px 18px" }}>Timestamp</th>
                <th style={{ padding: "14px 18px", textAlign: "right" }}>Diagnostics</th>
              </tr>
            </thead>
            <tbody>
              {calls.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      padding: "48px 24px",
                      textAlign: "center",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <PhoneCall size={32} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
                    <div style={{ fontSize: "14.5px", fontWeight: 700 }}>
                      No call telemetry records found
                    </div>
                  </td>
                </tr>
              ) : (
                calls.map((call) => {
                  const formattedDate = new Date(call.startedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr
                      key={call.id}
                      style={{
                        borderBottom: "1px solid var(--border)",
                        transition: "background-color 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--bg-surface-elevated)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      {/* Session ID */}
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ fontWeight: 700, color: "var(--text-main)", fontFamily: "monospace" }}>
                          {call.id}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                          Match: {call.matchId}
                        </div>
                      </td>

                      {/* Caller */}
                      <td style={{ padding: "14px 18px" }}>
                        <div
                          style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                          onClick={() => onOpenUserProfile?.(call.caller.id)}
                        >
                          <img
                            src={call.caller.avatar}
                            alt={call.caller.name}
                            style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: "var(--text-main)" }}>
                              {call.caller.name}
                            </div>
                            <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
                              {call.caller.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Recipient */}
                      <td style={{ padding: "14px 18px" }}>
                        <div
                          style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                          onClick={() => onOpenUserProfile?.(call.recipient.id)}
                        >
                          <img
                            src={call.recipient.avatar}
                            alt={call.recipient.name}
                            style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: "var(--text-main)" }}>
                              {call.recipient.name}
                            </div>
                            <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
                              {call.recipient.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td style={{ padding: "14px 18px" }}>
                        {call.type === "video" ? (
                          <span
                            style={{
                              padding: "3px 8px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: 700,
                              backgroundColor: "rgba(79, 70, 229, 0.1)",
                              color: "#4F46E5",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <Video size={12} /> Video Call
                          </span>
                        ) : (
                          <span
                            style={{
                              padding: "3px 8px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: 700,
                              backgroundColor: "rgba(13, 148, 136, 0.1)",
                              color: "#0D9488",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <PhoneCall size={12} /> Voice Call
                          </span>
                        )}
                      </td>

                      {/* Duration */}
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ fontWeight: 700, color: "var(--text-main)" }}>
                          {formatDuration(call.durationSeconds)}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "14px 18px" }}>
                        {getStatusBadge(call.status)}
                        {call.failureReason && (
                          <div
                            style={{
                              fontSize: "10.5px",
                              color: "#DC2626",
                              marginTop: "3px",
                              maxWidth: "180px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={call.failureReason}
                          >
                            {call.failureReason}
                          </div>
                        )}
                      </td>

                      {/* Quality */}
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ fontSize: "12px" }}>{getQualityBadge(call.quality)}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                          {call.packetLossPercent}% loss &bull; {call.avgLatencyMs}ms
                        </div>
                      </td>

                      {/* Timestamp */}
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                          {formattedDate}
                        </div>
                      </td>

                      {/* Diagnostics Action */}
                      <td style={{ padding: "14px 18px", textAlign: "right" }}>
                        <button
                          type="button"
                          onClick={() => onOpenCallDiagnostics(call)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "8px",
                            border: "1px solid var(--border)",
                            backgroundColor: "var(--bg-surface)",
                            color: "var(--text-main)",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          Diagnostics <ChevronRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
