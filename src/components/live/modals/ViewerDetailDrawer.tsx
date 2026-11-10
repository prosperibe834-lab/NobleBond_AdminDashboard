// NobleBond Admin — Audience Viewer Detail Drawer
// Viewer member profile, watch duration, gift participation, zero emojis

import React from "react";
import {
  X,
  Eye,
  Coins,
  MessageSquare,
  Lock,
  ExternalLink,
} from "lucide-react";
import type { LiveViewerRecord } from "../../../types/liveManagement.types";

interface ViewerDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  viewer: LiveViewerRecord | null;
  onOpenUserProfile?: (userId: string) => void;
}

export const ViewerDetailDrawer: React.FC<ViewerDetailDrawerProps> = ({
  isOpen,
  onClose,
  viewer,
  onOpenUserProfile,
}) => {
  if (!isOpen || !viewer) return null;

  const joinTime = new Date(viewer.joinedAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

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
          maxWidth: "480px",
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
                backgroundColor: "rgba(37, 99, 235, 0.1)",
                color: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Eye size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
                Viewer: {viewer.user.name}
              </h3>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                ID: {viewer.id} &bull; User ID: {viewer.user.id}
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
          {/* Member Card */}
          <div
            style={{
              padding: "16px",
              borderRadius: "14px",
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img
                src={viewer.user.avatar}
                alt={viewer.user.name}
                style={{ width: "46px", height: "46px", borderRadius: "50%", objectFit: "cover" }}
              />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)" }}>
                  {viewer.user.name}
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                  {viewer.user.username} &bull; {viewer.user.city}, {viewer.user.country}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenUserProfile?.(viewer.user.id)}
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

          {/* Current Broadcast Engagement */}
          <div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Live Session Engagement
            </span>
            <div
              style={{
                marginTop: "6px",
                padding: "16px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontSize: "12.5px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>Live Room:</span>
                <strong style={{ color: "var(--text-main)" }}>{viewer.sessionTitle}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>Host:</span>
                <strong style={{ color: "var(--text-main)" }}>{viewer.hostName}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>Joined At:</span>
                <strong style={{ color: "var(--text-main)" }}>{joinTime}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>Time Watched:</span>
                <strong style={{ color: "var(--text-main)" }}>{viewer.watchDurationMinutes} minutes</strong>
              </div>
            </div>
          </div>

          {/* Activity Statistics */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <div
              style={{
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--accent-champagne)", marginBottom: "4px" }}>
                <Coins size={15} />
                <span style={{ fontSize: "11.5px", fontWeight: 600 }}>Gift Coins Spent</span>
              </div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)" }}>
                {viewer.giftCoinsSpent.toLocaleString()}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                {viewer.giftsSentCount} gifts sent in session
              </div>
            </div>

            <div
              style={{
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#2563EB", marginBottom: "4px" }}>
                <MessageSquare size={15} />
                <span style={{ fontSize: "11.5px", fontWeight: 600 }}>Chat Messages</span>
              </div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)" }}>
                {viewer.commentsCount}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                Active in live room chat
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "10px",
              backgroundColor: "rgba(37, 99, 235, 0.06)",
              border: "1px solid rgba(37, 99, 235, 0.2)",
              fontSize: "11.5px",
              color: "var(--status-info)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Lock size={14} style={{ flexShrink: 0 }} />
            <span>Audience privacy protected. Viewing telemetry logged without precise geolocation tracking.</span>
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
              padding: "8px 18px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-main)",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
