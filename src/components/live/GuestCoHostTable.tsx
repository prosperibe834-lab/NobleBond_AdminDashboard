// NobleBond Admin — Guest & Co-Host Management Table
// Multi-guest participant monitoring, AV peripheral state, and removal actions, zero emojis

import React from "react";
import {
  Users,
  Video,
  VideoOff,
  Mic,
  MicOff,
  CheckCircle2,
  Clock,
  UserX,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import type { LiveGuestRecord } from "../../types/liveManagement.types";

interface GuestCoHostTableProps {
  guests: LiveGuestRecord[];
  onOpenGuestDetails: (guest: LiveGuestRecord) => void;
  onOpenRemoveGuest: (guest: LiveGuestRecord) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const GuestCoHostTable: React.FC<GuestCoHostTableProps> = ({
  guests,
  onOpenGuestDetails,
  onOpenRemoveGuest,
  onOpenUserProfile,
}) => {
  const getConnectionBadge = (status: LiveGuestRecord["connectionStatus"]) => {
    switch (status) {
      case "connected":
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
            <CheckCircle2 size={12} /> Connected
          </span>
        );
      case "connecting":
      case "requested":
      case "invited":
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
            <Clock size={12} /> {status}
          </span>
        );
      case "disconnected":
        return (
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: "rgba(107, 114, 128, 0.12)",
              color: "#6B7280",
            }}
          >
            Disconnected
          </span>
        );
      case "removed":
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
            <UserX size={12} /> Removed by Mod
          </span>
        );
    }
  };

  return (
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
              <th style={{ padding: "14px 18px" }}>Guest Member</th>
              <th style={{ padding: "14px 18px" }}>Host &amp; Session</th>
              <th style={{ padding: "14px 18px" }}>Participation Duration</th>
              <th style={{ padding: "14px 18px" }}>AV Hardware Feed</th>
              <th style={{ padding: "14px 18px" }}>Connection State</th>
              <th style={{ padding: "14px 18px" }}>Moderation Status</th>
              <th style={{ padding: "14px 18px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {guests.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    padding: "48px 24px",
                    textAlign: "center",
                    color: "var(--text-secondary)",
                  }}
                >
                  <Users size={32} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
                  <div style={{ fontSize: "14.5px", fontWeight: 700 }}>No guest co-hosts found</div>
                </td>
              </tr>
            ) : (
              guests.map((guest) => {
                return (
                  <tr
                    key={guest.id}
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
                    {/* Guest Member */}
                    <td style={{ padding: "14px 18px" }}>
                      <div
                        style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
                        onClick={() => onOpenUserProfile?.(guest.user.id)}
                      >
                        <img
                          src={guest.user.avatar}
                          alt={guest.user.name}
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: "var(--text-main)" }}>
                            {guest.user.name}
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                            {guest.user.username} &bull; {guest.user.city}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Host & Session */}
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ fontWeight: 600, color: "var(--text-main)" }}>
                        Host: {guest.host.name}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                        Session: {guest.sessionId}
                      </div>
                    </td>

                    {/* Participation Duration */}
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ fontWeight: 700, color: "var(--text-main)" }}>
                        {guest.durationMinutes} mins on stage
                      </div>
                    </td>

                    {/* AV Hardware */}
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span
                          title={guest.cameraStatus === "on" ? "Camera Active" : "Camera Muted"}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "6px",
                            backgroundColor: guest.cameraStatus === "on" ? "rgba(16, 185, 129, 0.1)" : "rgba(220, 38, 38, 0.1)",
                            color: guest.cameraStatus === "on" ? "var(--status-success)" : "#DC2626",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "11px",
                            fontWeight: 600,
                          }}
                        >
                          {guest.cameraStatus === "on" ? <Video size={12} /> : <VideoOff size={12} />}
                          Cam {guest.cameraStatus}
                        </span>

                        <span
                          title={guest.micStatus === "on" ? "Microphone Active" : "Microphone Muted"}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "6px",
                            backgroundColor: guest.micStatus === "on" ? "rgba(16, 185, 129, 0.1)" : "rgba(220, 38, 38, 0.1)",
                            color: guest.micStatus === "on" ? "var(--status-success)" : "#DC2626",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "11px",
                            fontWeight: 600,
                          }}
                        >
                          {guest.micStatus === "on" ? <Mic size={12} /> : <MicOff size={12} />}
                          Mic {guest.micStatus}
                        </span>
                      </div>
                    </td>

                    {/* Connection Status */}
                    <td style={{ padding: "14px 18px" }}>{getConnectionBadge(guest.connectionStatus)}</td>

                    {/* Moderation Status */}
                    <td style={{ padding: "14px 18px" }}>
                      {guest.moderationStatus === "removed" ? (
                        <div style={{ fontSize: "11px", color: "#DC2626", fontWeight: 700 }}>
                          Removed from Session
                        </div>
                      ) : guest.moderationStatus === "flagged" ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#F59E0B", fontSize: "11px", fontWeight: 700 }}>
                          <AlertTriangle size={12} /> Flagged
                        </div>
                      ) : (
                        <div style={{ color: "var(--status-success)", fontSize: "11.5px", fontWeight: 600 }}>
                          Compliant
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "14px 18px", textAlign: "right" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: "6px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => onOpenGuestDetails(guest)}
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
                          Details <ExternalLink size={12} />
                        </button>

                        {guest.connectionStatus === "connected" && (
                          <button
                            type="button"
                            onClick={() => onOpenRemoveGuest(guest)}
                            style={{
                              padding: "6px 10px",
                              borderRadius: "8px",
                              border: "1px solid rgba(220, 38, 38, 0.3)",
                              backgroundColor: "rgba(220, 38, 38, 0.08)",
                              color: "#DC2626",
                              fontSize: "12px",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <UserX size={12} /> Remove
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

