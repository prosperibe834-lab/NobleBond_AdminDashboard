// NobleBond Admin — Audience & Viewers Table
// Audience monitoring, watch duration, live gift activity, and viewer standing, zero emojis

import React from "react";
import {
  Eye,
  Clock,
  Coins,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import type { LiveViewerRecord } from "../../types/liveManagement.types";

interface AudienceViewersTableProps {
  viewers: LiveViewerRecord[];
  onOpenViewerDetails: (viewer: LiveViewerRecord) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const AudienceViewersTable: React.FC<AudienceViewersTableProps> = ({
  viewers,
  onOpenViewerDetails,
  onOpenUserProfile,
}) => {
  const getStatusBadge = (status: LiveViewerRecord["viewerStatus"]) => {
    switch (status) {
      case "active":
        return (
          <span
            style={{
              padding: "2px 7px",
              borderRadius: "5px",
              fontSize: "11px",
              fontWeight: 700,
              backgroundColor: "rgba(16, 185, 129, 0.12)",
              color: "var(--status-success)",
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <CheckCircle2 size={11} /> Watching
          </span>
        );
      case "idle":
        return (
          <span
            style={{
              padding: "2px 7px",
              borderRadius: "5px",
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: "rgba(107, 114, 128, 0.12)",
              color: "#6B7280",
            }}
          >
            Left Room
          </span>
        );
      case "restricted":
        return (
          <span
            style={{
              padding: "2px 7px",
              borderRadius: "5px",
              fontSize: "11px",
              fontWeight: 700,
              backgroundColor: "rgba(220, 38, 38, 0.12)",
              color: "#DC2626",
            }}
          >
            Chat Restricted
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
              <th style={{ padding: "14px 18px" }}>Viewer Member</th>
              <th style={{ padding: "14px 18px" }}>Live Session &amp; Host</th>
              <th style={{ padding: "14px 18px" }}>Watch Duration</th>
              <th style={{ padding: "14px 18px" }}>Gift Activity</th>
              <th style={{ padding: "14px 18px" }}>Comments Sent</th>
              <th style={{ padding: "14px 18px" }}>Status</th>
              <th style={{ padding: "14px 18px", textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {viewers.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    padding: "48px 24px",
                    textAlign: "center",
                    color: "var(--text-secondary)",
                  }}
                >
                  <Eye size={32} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
                  <div style={{ fontSize: "14.5px", fontWeight: 700 }}>No viewer activity records found</div>
                </td>
              </tr>
            ) : (
              viewers.map((viewer) => {
                return (
                  <tr
                    key={viewer.id}
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
                    {/* Viewer Member */}
                    <td style={{ padding: "14px 18px" }}>
                      <div
                        style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
                        onClick={() => onOpenUserProfile?.(viewer.user.id)}
                      >
                        <img
                          src={viewer.user.avatar}
                          alt={viewer.user.name}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: "var(--text-main)" }}>
                            {viewer.user.name}
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                            {viewer.user.username} &bull; {viewer.user.city}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Live Session & Host */}
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ fontWeight: 600, color: "var(--text-main)", maxWidth: "220px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={viewer.sessionTitle}>
                        {viewer.sessionTitle}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                        Host: {viewer.hostName}
                      </div>
                    </td>

                    {/* Watch Duration */}
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ fontWeight: 700, color: "var(--text-main)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Clock size={12} style={{ color: "var(--text-muted)" }} /> {viewer.watchDurationMinutes} mins
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                        {viewer.isCurrentlyWatching ? "In stream now" : "Exited stream"}
                      </div>
                    </td>

                    {/* Gift Activity */}
                    <td style={{ padding: "14px 18px" }}>
                      {viewer.giftCoinsSpent > 0 ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontWeight: 700, color: "var(--accent-champagne)" }}>
                          <Coins size={13} /> {viewer.giftCoinsSpent.toLocaleString()} Coins
                        </div>
                      ) : (
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>0 Gifts Sent</span>
                      )}
                      {viewer.giftsSentCount > 0 && (
                        <div style={{ fontSize: "10.5px", color: "var(--text-muted)", marginTop: "2px" }}>
                          {viewer.giftsSentCount} items sent
                        </div>
                      )}
                    </td>

                    {/* Comments Sent */}
                    <td style={{ padding: "14px 18px" }}>
                      <span style={{ fontWeight: 600, color: "var(--text-main)" }}>
                        {viewer.commentsCount} comments
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: "14px 18px" }}>{getStatusBadge(viewer.viewerStatus)}</td>

                    {/* Action */}
                    <td style={{ padding: "14px 18px", textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={() => onOpenViewerDetails(viewer)}
                        style={{
                          padding: "6px 12px",
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
                        Inspect <ExternalLink size={12} />
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
  );
};

