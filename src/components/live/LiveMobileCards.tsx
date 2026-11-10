// NobleBond Admin — Responsive Live Management Mobile Cards
// Touch-optimized stacked cards for mobile viewports, zero emojis

import React from "react";
import {
  Play,
  Ban,
  UserCheck,
} from "lucide-react";
import type {
  LiveSessionRecord,
  LiveHostRecord,
  LiveViewerRecord,
  LiveGuestRecord,
  LiveGiftTransactionRecord,
  LiveReportRecord,
  StreamHealthRecord,
} from "../../types/liveManagement.types";

interface LiveMobileCardsProps {
  tab: string;
  sessions: LiveSessionRecord[];
  hosts: LiveHostRecord[];
  viewers: LiveViewerRecord[];
  guests: LiveGuestRecord[];
  gifts: LiveGiftTransactionRecord[];
  reports: LiveReportRecord[];
  health: StreamHealthRecord[];
  onOpenSession: (s: LiveSessionRecord) => void;
  onOpenPreview: (s: LiveSessionRecord) => void;
  onOpenEndSession: (s: LiveSessionRecord) => void;
  onOpenHost: (h: LiveHostRecord) => void;
  onOpenViewer: (v: LiveViewerRecord) => void;
  onOpenGuest: (g: LiveGuestRecord) => void;
  onOpenGift: (g: LiveGiftTransactionRecord) => void;
  onOpenReport: (r: LiveReportRecord) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const LiveMobileCards: React.FC<LiveMobileCardsProps> = ({
  tab,
  sessions,
  hosts,
  viewers,
  guests,
  gifts,
  reports,
  health,
  onOpenSession,
  onOpenPreview,
  onOpenEndSession,
  onOpenHost,
  onOpenViewer,
  onOpenGuest,
  onOpenGift,
  onOpenReport,
  onOpenUserProfile,
}) => {
  // Mobile Sessions
  if (tab === "overview" || tab === "sessions") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {sessions.map((s) => (
          <div
            key={s.id}
            style={{
              padding: "16px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <img
                  src={s.host.avatar}
                  alt={s.host.name}
                  style={{ width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover" }}
                  onClick={() => onOpenUserProfile?.(s.host.id)}
                />
                <div>
                  <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)" }}>
                    {s.host.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {s.id} &bull; {s.category.replace(/_/g, " ")}
                  </div>
                </div>
              </div>

              <span
                style={{
                  padding: "2px 7px",
                  borderRadius: "5px",
                  fontSize: "10.5px",
                  fontWeight: 800,
                  backgroundColor: s.status === "live" ? "rgba(239, 68, 68, 0.12)" : "rgba(107, 114, 128, 0.12)",
                  color: s.status === "live" ? "#EF4444" : "var(--text-secondary)",
                  textTransform: "uppercase",
                }}
              >
                {s.status}
              </span>
            </div>

            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-main)", lineHeight: 1.3 }}>
              {s.title}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11.5px" }}>
              <span style={{ color: "var(--accent-champagne)", fontWeight: 700 }}>
                {s.giftCoinsEarned.toLocaleString()} Coins
              </span>
              <span style={{ color: "var(--text-muted)" }}>
                {s.currentViewers.toLocaleString()} watching / Peak {s.peakViewers.toLocaleString()}
              </span>
            </div>

            <div style={{ display: "flex", gap: "8px", paddingTop: "8px", borderTop: "1px solid var(--border)" }}>
              {s.status === "live" && (
                <button
                  type="button"
                  onClick={() => onOpenPreview(s)}
                  style={{
                    flex: 1,
                    padding: "7px",
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
              )}

              <button
                type="button"
                onClick={() => onOpenSession(s)}
                style={{
                  flex: 1,
                  padding: "7px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "var(--primary)",
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Details
              </button>

              {(s.status === "live" || s.status === "under_moderation") && (
                <button
                  type="button"
                  onClick={() => onOpenEndSession(s)}
                  style={{
                    padding: "7px 10px",
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
          </div>
        ))}
      </div>
    );
  }

  // Mobile Hosts
  if (tab === "hosts") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {hosts.map((h) => (
          <div
            key={h.id}
            style={{
              padding: "16px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <img src={h.user.avatar} alt={h.user.name} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)", display: "flex", alignItems: "center", gap: "4px" }}>
                    {h.user.name}
                    {h.user.isVerified && <UserCheck size={12} color="var(--primary)" />}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{h.user.username}</div>
                </div>
              </div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: h.isCurrentlyLive ? "#EF4444" : "var(--text-muted)" }}>
                {h.isCurrentlyLive ? "LIVE NOW" : "Offline"}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-secondary)" }}>
              <span>{h.totalSessions} sessions ({Math.round(h.totalDurationMinutes / 60)} hrs)</span>
              <strong style={{ color: "var(--accent-champagne)" }}>{h.giftCoinsEarned.toLocaleString()} Coins</strong>
            </div>

            <button
              type="button"
              onClick={() => onOpenHost(h)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Host Profile &amp; Stats
            </button>
          </div>
        ))}
      </div>
    );
  }

  // Mobile Audience Viewers
  if (tab === "audience") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {viewers.map((v) => (
          <div
            key={v.id}
            style={{
              padding: "16px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <img src={v.user.avatar} alt={v.user.name} style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }} />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>{v.user.name}</div>
                  <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>{v.user.username}</div>
                </div>
              </div>
              <span style={{ fontSize: "11px", fontWeight: 600, color: v.isCurrentlyWatching ? "var(--status-success)" : "var(--text-muted)" }}>
                {v.isCurrentlyWatching ? "In stream" : "Left"}
              </span>
            </div>

            <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
              Watching: <strong>{v.sessionTitle}</strong> ({v.watchDurationMinutes}m)
            </div>

            <button
              type="button"
              onClick={() => onOpenViewer(v)}
              style={{
                padding: "6px",
                borderRadius: "6px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "11.5px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Viewer Details
            </button>
          </div>
        ))}
      </div>
    );
  }

  // Mobile Guests
  if (tab === "guests") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {guests.map((g) => (
          <div
            key={g.id}
            style={{
              padding: "16px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>{g.user.name}</span>
              <span style={{ fontSize: "11px", fontWeight: 700, color: g.connectionStatus === "connected" ? "var(--status-success)" : "#DC2626" }}>
                {g.connectionStatus}
              </span>
            </div>

            <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
              Host: {g.host.name} &bull; {g.durationMinutes}m on stage
            </div>

            <div style={{ display: "flex", gap: "6px", fontSize: "11px", color: "var(--text-muted)" }}>
              <span>Cam: {g.cameraStatus}</span> &bull; <span>Mic: {g.micStatus}</span>
            </div>

            <button
              type="button"
              onClick={() => onOpenGuest(g)}
              style={{
                padding: "6px",
                borderRadius: "6px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "11.5px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Guest Telemetry
            </button>
          </div>
        ))}
      </div>
    );
  }

  // Mobile Gifts
  if (tab === "gifts") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {gifts.map((gift) => (
          <div
            key={gift.id}
            style={{
              padding: "16px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>{gift.giftName}</span>
              <span style={{ fontSize: "12px", fontWeight: 800, color: "var(--accent-champagne)" }}>
                {gift.coinAmount.toLocaleString()} Coins
              </span>
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
              From {gift.sender.name} &rarr; Host {gift.recipient.name}
            </div>
            <button
              type="button"
              onClick={() => onOpenGift(gift)}
              style={{
                marginTop: "4px",
                padding: "6px",
                borderRadius: "6px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "11.5px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Transaction Details
            </button>
          </div>
        ))}
      </div>
    );
  }

  // Mobile Reports
  if (tab === "moderation") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {reports.map((r) => (
          <div
            key={r.id}
            style={{
              padding: "16px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", fontWeight: 800, color: "#DC2626", textTransform: "uppercase" }}>
                {r.priority} &bull; {r.category.replace(/_/g, " ")}
              </span>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)" }}>{r.status}</span>
            </div>

            <div style={{ fontSize: "12px", color: "var(--text-main)" }}>
              {r.description}
            </div>

            <button
              type="button"
              onClick={() => onOpenReport(r)}
              style={{
                padding: "8px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "var(--primary)",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Investigate Incident
            </button>
          </div>
        ))}
      </div>
    );
  }

  // Mobile Health
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {health.map((h) => (
        <div
          key={h.sessionId}
          style={{
            padding: "16px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            boxShadow: "var(--shadow-sm)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>{h.sessionTitle}</span>
            <span style={{ fontSize: "11px", fontWeight: 700, color: h.status === "healthy" ? "var(--status-success)" : "#DC2626" }}>
              {h.status}
            </span>
          </div>
          <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
            Provider: {h.provider} &bull; {h.bitrateKbps} kbps &bull; {h.latencyMs}ms latency
          </div>
        </div>
      ))}
    </div>
  );
};
