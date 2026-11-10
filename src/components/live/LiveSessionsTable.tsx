// NobleBond Admin — Live Sessions Operational Management Table
// Comprehensive session records, live audience indicators, telemetry, zero emojis

import React from "react";
import {
  Radio,
  Eye,
  Coins,
  Users,
  ShieldAlert,
  Play,
  Ban,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import type {
  LiveSessionRecord,
  LiveSortCriteria,
  LiveSortField,
} from "../../types/liveManagement.types";

interface LiveSessionsTableProps {
  sessions: LiveSessionRecord[];
  sort: LiveSortCriteria;
  onSortChange: (field: LiveSortField) => void;
  onOpenDetails: (session: LiveSessionRecord) => void;
  onOpenPreview: (session: LiveSessionRecord) => void;
  onOpenEndSession: (session: LiveSessionRecord) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const LiveSessionsTable: React.FC<LiveSessionsTableProps> = ({
  sessions,
  onOpenDetails,
  onOpenPreview,
  onOpenEndSession,
  onOpenUserProfile,
}) => {
  const getStatusBadge = (status: LiveSessionRecord["status"]) => {
    switch (status) {
      case "live":
        return (
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
              letterSpacing: "0.03em",
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
            LIVE
          </span>
        );
      case "completed":
        return (
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 600,
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
      case "under_moderation":
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
            <AlertTriangle size={12} /> Under Review
          </span>
        );
      case "interrupted":
        return (
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 700,
              backgroundColor: "rgba(107, 114, 128, 0.12)",
              color: "#6B7280",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Clock size={12} /> Interrupted
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
              <th style={{ padding: "14px 18px" }}>Session ID &amp; Category</th>
              <th style={{ padding: "14px 18px" }}>Host</th>
              <th style={{ padding: "14px 18px", maxWidth: "240px" }}>Title &amp; Ingest</th>
              <th style={{ padding: "14px 18px" }}>Viewers (Current / Peak)</th>
              <th style={{ padding: "14px 18px" }}>Duration</th>
              <th style={{ padding: "14px 18px" }}>Gift Coins Earned</th>
              <th style={{ padding: "14px 18px" }}>Status</th>
              <th style={{ padding: "14px 18px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    padding: "48px 24px",
                    textAlign: "center",
                    color: "var(--text-secondary)",
                  }}
                >
                  <Radio size={32} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
                  <div style={{ fontSize: "14.5px", fontWeight: 700 }}>No live sessions found</div>
                  <div style={{ fontSize: "12px", marginTop: "4px" }}>
                    Try adjusting your search criteria or active filters.
                  </div>
                </td>
              </tr>
            ) : (
              sessions.map((s) => {
                const formattedTime = new Date(s.startedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <tr
                    key={s.id}
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
                    {/* Session ID & Category */}
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ fontWeight: 700, color: "var(--text-main)", fontFamily: "monospace" }}>
                        {s.id}
                      </div>
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: "4px",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontSize: "10.5px",
                          fontWeight: 600,
                          backgroundColor: "var(--bg-surface)",
                          border: "1px solid var(--border)",
                          color: "var(--text-secondary)",
                          textTransform: "capitalize",
                        }}
                      >
                        {s.category.replace(/_/g, " ")}
                      </span>
                    </td>

                    {/* Host */}
                    <td style={{ padding: "14px 18px" }}>
                      <div
                        style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                        onClick={() => onOpenUserProfile?.(s.host.id)}
                      >
                        <img
                          src={s.host.avatar}
                          alt={s.host.name}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: "var(--text-main)" }}>
                            {s.host.name}
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                            {s.host.username}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Title & Ingest */}
                    <td style={{ padding: "14px 18px", maxWidth: "240px" }}>
                      <div
                        style={{
                          fontWeight: 600,
                          color: "var(--text-main)",
                          lineHeight: 1.3,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={s.title}
                      >
                        {s.title}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                        {s.streamProvider} &bull; {s.streamQuality.split("_")[0]}
                      </div>
                    </td>

                    {/* Viewers */}
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        {s.status === "live" ? (
                          <span style={{ fontWeight: 800, color: "#EF4444", display: "flex", alignItems: "center", gap: "4px" }}>
                            <Eye size={13} /> {s.currentViewers.toLocaleString()}
                          </span>
                        ) : (
                          <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                            Offline
                          </span>
                        )}
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                          / Peak {s.peakViewers.toLocaleString()}
                        </span>
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px", display: "flex", alignItems: "center", gap: "3px" }}>
                        <Users size={11} /> {s.guestCount} guests
                      </div>
                    </td>

                    {/* Duration & Start Time */}
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ fontWeight: 700, color: "var(--text-main)" }}>
                        {s.durationMinutes} mins
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                        {formattedTime}
                      </div>
                    </td>

                    {/* Gift Coins Earned */}
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", fontWeight: 700, color: "var(--accent-champagne)" }}>
                        <Coins size={14} />
                        {s.giftCoinsEarned.toLocaleString()} Coins
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                        {s.giftsReceivedCount} gifts received
                      </div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: "14px 18px" }}>
                      {getStatusBadge(s.status)}
                      {s.activeReportCount > 0 && (
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "3px",
                            fontSize: "10.5px",
                            color: "#DC2626",
                            fontWeight: 700,
                            marginTop: "3px",
                          }}
                        >
                          <ShieldAlert size={11} /> {s.activeReportCount} flag
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
                        {s.status === "live" && (
                          <button
                            type="button"
                            onClick={() => onOpenPreview(s)}
                            title="Moderation Live Preview"
                            style={{
                              padding: "6px 8px",
                              borderRadius: "8px",
                              border: "1px solid var(--border)",
                              backgroundColor: "var(--bg-surface)",
                              color: "var(--text-main)",
                              cursor: "pointer",
                            }}
                          >
                            <Play size={13} />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onOpenDetails(s)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: "var(--primary)",
                            color: "#ffffff",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          Details <ExternalLink size={12} />
                        </button>

                        {(s.status === "live" || s.status === "under_moderation") && (
                          <button
                            type="button"
                            onClick={() => onOpenEndSession(s)}
                            title="End Broadcast"
                            style={{
                              padding: "6px 8px",
                              borderRadius: "8px",
                              border: "1px solid rgba(220, 38, 38, 0.3)",
                              backgroundColor: "rgba(220, 38, 38, 0.08)",
                              color: "#DC2626",
                              cursor: "pointer",
                            }}
                          >
                            <Ban size={13} />
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

