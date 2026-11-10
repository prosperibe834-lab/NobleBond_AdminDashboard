// NobleBond Admin — Host Creator Detail Drawer
// Host profile review, broadcasting metrics, restriction management, zero emojis

import React from "react";
import {
  X,
  RadioTower,
  Coins,
  Lock,
  Unlock,
  UserCheck,
  ExternalLink,
} from "lucide-react";
import type { LiveHostRecord } from "../../../types/liveManagement.types";

interface HostDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  host: LiveHostRecord | null;
  onOpenRestrictModal: (host: LiveHostRecord) => void;
  onRestoreAccess: (hostId: string) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const HostDetailDrawer: React.FC<HostDetailDrawerProps> = ({
  isOpen,
  onClose,
  host,
  onOpenRestrictModal,
  onRestoreAccess,
  onOpenUserProfile,
}) => {
  if (!isOpen || !host) return null;

  const regDate = new Date(host.registeredAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const lastLiveDate = new Date(host.lastLiveAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const totalHours = Math.round((host.totalDurationMinutes / 60) * 10) / 10;

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
          maxWidth: "520px",
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
                backgroundColor: "rgba(139, 92, 246, 0.1)",
                color: "#8B5CF6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <RadioTower size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
                Host Profile: {host.user.name}
              </h3>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                ID: {host.id} &bull; Member: {host.user.id}
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

        {/* Content */}
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
          {/* Host Summary Card */}
          <div
            style={{
              padding: "18px",
              borderRadius: "14px",
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img
                src={host.user.avatar}
                alt={host.user.name}
                style={{ width: "52px", height: "52px", borderRadius: "50%", objectFit: "cover" }}
              />
              <div>
                <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--text-main)", display: "flex", alignItems: "center", gap: "4px" }}>
                  {host.user.name}
                  {host.user.isVerified && <UserCheck size={14} style={{ color: "var(--primary)" }} />}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {host.user.username} &bull; {host.user.city}, {host.user.country}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px" }}>
                  Tier: {host.user.premiumTier} &bull; Joined: {regDate}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenUserProfile?.(host.user.id)}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-main)",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Profile <ExternalLink size={12} />
            </button>
          </div>

          {/* Historical Metrics Grid */}
          <div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Broadcasting Performance &amp; Lifetime Metrics
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
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Total Live Sessions</span>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-main)" }}>
                  {host.totalSessions}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                  {totalHours} cumulative hours
                </div>
              </div>

              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Gift Coins Earned</span>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--accent-champagne)", display: "flex", alignItems: "center", gap: "5px" }}>
                  <Coins size={16} /> {host.giftCoinsEarned.toLocaleString()}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                  {host.giftsReceivedCount} gifts received
                </div>
              </div>

              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Total Impressions</span>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-main)", marginTop: "4px" }}>
                  {host.totalViews.toLocaleString()} views
                </div>
              </div>

              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Peak Concurrent</span>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-main)", marginTop: "4px" }}>
                  {host.peakViewers.toLocaleString()} viewers
                </div>
              </div>
            </div>
          </div>

          {/* Moderation Standing & Restrictions */}
          <div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Trust &amp; Safety Standing
            </span>
            <div
              style={{
                marginTop: "6px",
                padding: "14px 16px",
                borderRadius: "12px",
                backgroundColor: host.hostStatus === "restricted" || host.hostStatus === "suspended"
                  ? "rgba(220, 38, 38, 0.08)"
                  : "var(--bg-surface)",
                border: host.hostStatus === "restricted" || host.hostStatus === "suspended"
                  ? "1px solid rgba(220, 38, 38, 0.3)"
                  : "1px solid var(--border)",
                fontSize: "12.5px",
                lineHeight: 1.4,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontWeight: 700, textTransform: "capitalize", color: host.hostStatus === "restricted" ? "#DC2626" : "var(--text-main)" }}>
                  Status: {host.hostStatus}
                </span>
                <span style={{ fontSize: "11px", color: host.reportsReceivedCount > 0 ? "#DC2626" : "var(--status-success)", fontWeight: 700 }}>
                  {host.reportsReceivedCount} Safety Flag(s)
                </span>
              </div>

              {host.restrictionReason && (
                <div style={{ color: "#DC2626", marginTop: "4px", fontSize: "12px" }}>
                  <strong>Restriction Notice:</strong> {host.restrictionReason}
                </div>
              )}
            </div>
          </div>

          <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
            Last broadcast conducted: {lastLiveDate}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "18px 24px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            gap: "10px",
            backgroundColor: "var(--bg-surface)",
          }}
        >
          {host.hostStatus === "restricted" ? (
            <button
              type="button"
              onClick={() => {
                onRestoreAccess(host.id);
                onClose();
              }}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "var(--status-success)",
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
              <Unlock size={14} /> Restore Live Hosting Access
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenRestrictModal(host);
              }}
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
              <Lock size={14} /> Restrict Live Hosting
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
