// NobleBond Admin — Host Management Table
// Broadcaster verification, session history, gift performance, and live privileges, zero emojis

import React from "react";
import {
  RadioTower,
  Eye,
  Coins,
  CheckCircle2,
  Lock,
  Unlock,
  AlertTriangle,
  UserCheck,
  ExternalLink,
} from "lucide-react";
import type { LiveHostRecord } from "../../types/liveManagement.types";

interface HostManagementTableProps {
  hosts: LiveHostRecord[];
  onOpenHostDetails: (host: LiveHostRecord) => void;
  onOpenRestrictModal: (host: LiveHostRecord) => void;
  onRestoreAccess: (hostId: string) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const HostManagementTable: React.FC<HostManagementTableProps> = ({
  hosts,
  onOpenHostDetails,
  onOpenRestrictModal,
  onRestoreAccess,
  onOpenUserProfile,
}) => {
  const getStatusBadge = (status: LiveHostRecord["hostStatus"]) => {
    switch (status) {
      case "active":
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
            <CheckCircle2 size={12} /> Active Host
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
            <AlertTriangle size={12} /> Warning
          </span>
        );
      case "restricted":
        return (
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 700,
              backgroundColor: "rgba(220, 38, 38, 0.12)",
              color: "#DC2626",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Lock size={12} /> Restricted
          </span>
        );
      case "suspended":
        return (
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 800,
              backgroundColor: "rgba(107, 114, 128, 0.15)",
              color: "#4B5563",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Suspended
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
              <th style={{ padding: "14px 18px" }}>Host Creator</th>
              <th style={{ padding: "14px 18px" }}>Live Standing</th>
              <th style={{ padding: "14px 18px" }}>Broadcasts &amp; Airtime</th>
              <th style={{ padding: "14px 18px" }}>Audience Reach</th>
              <th style={{ padding: "14px 18px" }}>Gift Coins Earned</th>
              <th style={{ padding: "14px 18px" }}>Reports Received</th>
              <th style={{ padding: "14px 18px" }}>Host Status</th>
              <th style={{ padding: "14px 18px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hosts.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    padding: "48px 24px",
                    textAlign: "center",
                    color: "var(--text-secondary)",
                  }}
                >
                  <RadioTower size={32} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
                  <div style={{ fontSize: "14.5px", fontWeight: 700 }}>No host creators found</div>
                </td>
              </tr>
            ) : (
              hosts.map((host) => {
                const totalHours = Math.round((host.totalDurationMinutes / 60) * 10) / 10;

                return (
                  <tr
                    key={host.id}
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
                    {/* Host Creator */}
                    <td style={{ padding: "14px 18px" }}>
                      <div
                        style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
                        onClick={() => onOpenUserProfile?.(host.user.id)}
                      >
                        <img
                          src={host.user.avatar}
                          alt={host.user.name}
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: "var(--text-main)", display: "flex", alignItems: "center", gap: "4px" }}>
                            {host.user.name}
                            {host.user.isVerified && (
                              <UserCheck size={13} style={{ color: "var(--primary)" }} />
                            )}
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                            {host.user.username} &bull; {host.user.city}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Live Standing */}
                    <td style={{ padding: "14px 18px" }}>
                      {host.isCurrentlyLive ? (
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 800,
                            backgroundColor: "rgba(239, 68, 68, 0.12)",
                            color: "#EF4444",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <span
                            style={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              backgroundColor: "#EF4444",
                            }}
                            className="animate-pulse-live"
                          />
                          Broadcasting Now
                        </span>
                      ) : (
                        <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                          Offline
                        </span>
                      )}
                    </td>

                    {/* Broadcasts & Airtime */}
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ fontWeight: 700, color: "var(--text-main)" }}>
                        {host.totalSessions} sessions
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                        {totalHours} broadcast hours
                      </div>
                    </td>

                    {/* Audience Reach */}
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", fontWeight: 700, color: "var(--text-main)" }}>
                        <Eye size={13} style={{ color: "#2563EB" }} /> {host.totalViews.toLocaleString()} views
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                        Peak: {host.peakViewers.toLocaleString()} concurrent
                      </div>
                    </td>

                    {/* Gift Coins Earned */}
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", fontWeight: 700, color: "var(--accent-champagne)" }}>
                        <Coins size={14} />
                        {host.giftCoinsEarned.toLocaleString()} Coins
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                        {host.giftsReceivedCount} gifts received
                      </div>
                    </td>

                    {/* Reports Received */}
                    <td style={{ padding: "14px 18px" }}>
                      {host.reportsReceivedCount > 0 ? (
                        <span
                          style={{
                            padding: "2px 7px",
                            borderRadius: "5px",
                            fontSize: "11px",
                            fontWeight: 700,
                            backgroundColor: "rgba(220, 38, 38, 0.12)",
                            color: "#DC2626",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "3px",
                          }}
                        >
                          <AlertTriangle size={11} /> {host.reportsReceivedCount} flags
                        </span>
                      ) : (
                        <span style={{ fontSize: "12px", color: "var(--status-success)", fontWeight: 600 }}>
                          Clean Record
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td style={{ padding: "14px 18px" }}>{getStatusBadge(host.hostStatus)}</td>

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
                          onClick={() => onOpenHostDetails(host)}
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
                          Overview <ExternalLink size={12} />
                        </button>

                        {host.hostStatus === "restricted" ? (
                          <button
                            type="button"
                            onClick={() => onRestoreAccess(host.id)}
                            title="Restore Live Access"
                            style={{
                              padding: "6px 10px",
                              borderRadius: "8px",
                              border: "1px solid rgba(16, 185, 129, 0.3)",
                              backgroundColor: "rgba(16, 185, 129, 0.08)",
                              color: "var(--status-success)",
                              fontSize: "12px",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <Unlock size={12} /> Restore
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onOpenRestrictModal(host)}
                            title="Restrict Live Hosting Access"
                            style={{
                              padding: "6px 8px",
                              borderRadius: "8px",
                              border: "1px solid rgba(220, 38, 38, 0.3)",
                              backgroundColor: "rgba(220, 38, 38, 0.08)",
                              color: "#DC2626",
                              cursor: "pointer",
                            }}
                          >
                            <Lock size={13} />
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

