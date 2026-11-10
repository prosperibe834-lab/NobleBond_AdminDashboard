// NobleBond Admin — Stream Health & Infrastructure Telemetry Section
// Technical ingest telemetry, WebRTC metrics, packet loss, bitrates, failure diagnostics, zero emojis

import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Server,
} from "lucide-react";
import type { StreamHealthRecord } from "../../types/liveManagement.types";

interface StreamHealthSectionProps {
  healthRecords: StreamHealthRecord[];
}

export const StreamHealthSection: React.FC<StreamHealthSectionProps> = ({
  healthRecords,
}) => {
  const healthyCount = healthRecords.filter((h) => h.status === "healthy").length;
  const warningCount = healthRecords.filter((h) => h.status === "warning").length;
  const failureCount = healthRecords.filter(
    (h) => h.status === "degraded" || h.status === "failed" || h.status === "disconnected"
  ).length;

  const getStatusBadge = (status: StreamHealthRecord["status"]) => {
    switch (status) {
      case "healthy":
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
            <CheckCircle2 size={12} /> Optimal Ingest
          </span>
        );
      case "warning":
        return (
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 700,
              backgroundColor: "rgba(245, 158, 11, 0.12)",
              color: "#D97706",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <AlertTriangle size={12} /> High Jitter / Warning
          </span>
        );
      case "degraded":
      case "disconnected":
        return (
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 700,
              backgroundColor: "rgba(107, 114, 128, 0.15)",
              color: "#6B7280",
            }}
          >
            Interrupted
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
            <XCircle size={12} /> Session Failed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Infrastructure SLA & Provider Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "14px",
        }}
      >
        <div
          style={{
            padding: "16px",
            borderRadius: "14px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              color: "var(--status-success)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)" }}>
              {healthyCount} Optimal
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
              Healthy streams transmitting
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "16px",
            borderRadius: "14px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "rgba(245, 158, 11, 0.1)",
              color: "#F59E0B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AlertTriangle size={20} />
          </div>
          <div>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)" }}>
              {warningCount} Warnings
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
              Elevated jitter / packet loss
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "16px",
            borderRadius: "14px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "rgba(220, 38, 38, 0.1)",
              color: "#DC2626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <XCircle size={20} />
          </div>
          <div>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)" }}>
              {failureCount} Disruptions
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
              Interrupted or aborted sessions
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "16px",
            borderRadius: "14px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "rgba(37, 99, 235, 0.1)",
              color: "#2563EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Server size={20} />
          </div>
          <div>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)" }}>
              Agora &bull; LiveKit
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
              Primary &amp; secondary relay nodes
            </div>
          </div>
        </div>
      </div>

      {/* Stream Telemetry Table */}
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
                <th style={{ padding: "14px 18px" }}>Session &amp; Host</th>
                <th style={{ padding: "14px 18px" }}>Provider Relay</th>
                <th style={{ padding: "14px 18px" }}>Bitrate &amp; FPS</th>
                <th style={{ padding: "14px 18px" }}>Ingest Latency</th>
                <th style={{ padding: "14px 18px" }}>Packet Loss</th>
                <th style={{ padding: "14px 18px" }}>Health Status</th>
                <th style={{ padding: "14px 18px", maxWidth: "260px" }}>Diagnostics / Failure Code</th>
              </tr>
            </thead>
            <tbody>
              {healthRecords.map((item) => (
                <tr
                  key={item.sessionId}
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
                  {/* Session & Host */}
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ fontWeight: 700, color: "var(--text-main)" }}>
                      {item.sessionTitle}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                      Host: {item.hostName} &bull; {item.sessionId}
                    </div>
                  </td>

                  {/* Provider */}
                  <td style={{ padding: "14px 18px" }}>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 600,
                        backgroundColor: "var(--bg-surface)",
                        border: "1px solid var(--border)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {item.provider}
                    </span>
                  </td>

                  {/* Bitrate & FPS */}
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ fontWeight: 700, color: "var(--text-main)" }}>
                      {item.bitrateKbps > 0 ? `${item.bitrateKbps} kbps` : "0 kbps (Halted)"}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                      {item.fps} FPS target
                    </div>
                  </td>

                  {/* Ingest Latency */}
                  <td style={{ padding: "14px 18px" }}>
                    <div
                      style={{
                        fontWeight: 700,
                        color: item.latencyMs > 150 ? "#DC2626" : item.latencyMs > 80 ? "#D97706" : "var(--status-success)",
                      }}
                    >
                      {item.latencyMs > 0 ? `${item.latencyMs} ms` : "Offline"}
                    </div>
                  </td>

                  {/* Packet Loss */}
                  <td style={{ padding: "14px 18px" }}>
                    <div
                      style={{
                        fontWeight: 700,
                        color: item.packetLossPercent > 5 ? "#DC2626" : item.packetLossPercent > 1 ? "#D97706" : "var(--status-success)",
                      }}
                    >
                      {item.packetLossPercent}%
                    </div>
                  </td>

                  {/* Status */}
                  <td style={{ padding: "14px 18px" }}>{getStatusBadge(item.status)}</td>

                  {/* Diagnostics */}
                  <td style={{ padding: "14px 18px", maxWidth: "260px" }}>
                    {item.failureReason ? (
                      <div>
                        {item.errorCode && (
                          <span
                            style={{
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "10px",
                              fontWeight: 800,
                              backgroundColor: "rgba(220, 38, 38, 0.15)",
                              color: "#DC2626",
                              display: "inline-block",
                              marginBottom: "3px",
                            }}
                          >
                            {item.errorCode}
                          </span>
                        )}
                        <div style={{ fontSize: "11.5px", color: "#DC2626", lineHeight: 1.3 }}>
                          {item.failureReason}
                        </div>
                      </div>
                    ) : (
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        Nominal RTMP/WebRTC connection
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
