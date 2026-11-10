// NobleBond Admin — Multi-Guest Co-Host Telemetry Modal
// Stage participation, AV hardware diagnostics, zero emojis

import {
  Mic,
  MicOff,
  Users,
  UserX,
  Video,
  VideoOff,
  X,
} from "lucide-react";
import React from "react";
import type { LiveGuestRecord } from "../../../types/liveManagement.types";

interface GuestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: LiveGuestRecord | null;
  onOpenRemoveGuest: (guest: LiveGuestRecord) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const GuestDetailModal: React.FC<GuestDetailModalProps> = ({
  isOpen,
  onClose,
  guest,
  onOpenRemoveGuest,
  onOpenUserProfile,
}) => {
  if (!isOpen || !guest) return null;

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
          maxWidth: "520px",
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
                backgroundColor: "rgba(37, 99, 235, 0.1)",
                color: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Users size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
                Guest Participation: {guest.user.name}
              </h3>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Session: {guest.sessionId}
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
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Guest and Host Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div
              style={{ padding: "12px", borderRadius: "10px", backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", cursor: "pointer" }}
              onClick={() => onOpenUserProfile?.(guest.user.id)}
            >
              <span style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Guest Co-Host</span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                <img src={guest.user.avatar} alt={guest.user.name} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>{guest.user.name}</div>
                  <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>{guest.user.username}</div>
                </div>
              </div>
            </div>

            <div
              style={{ padding: "12px", borderRadius: "10px", backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", cursor: "pointer" }}
              onClick={() => onOpenUserProfile?.(guest.host.id)}
            >
              <span style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Broadcasting Host</span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                <img src={guest.host.avatar} alt={guest.host.name} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>{guest.host.name}</div>
                  <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>{guest.host.username}</div>
                </div>
              </div>
            </div>
          </div>

          {/* AV Hardware Diagnostics */}
          <div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Audio / Video Hardware State
            </span>
            <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
              <div style={{ flex: 1, padding: "12px", borderRadius: "10px", backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "8px" }}>
                {guest.cameraStatus === "on" ? <Video size={16} color="var(--status-success)" /> : <VideoOff size={16} color="#DC2626" />}
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-main)" }}>Camera: {guest.cameraStatus.toUpperCase()}</div>
                  <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>Video stream capture</div>
                </div>
              </div>

              <div style={{ flex: 1, padding: "12px", borderRadius: "10px", backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "8px" }}>
                {guest.micStatus === "on" ? <Mic size={16} color="var(--status-success)" /> : <MicOff size={16} color="#DC2626" />}
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-main)" }}>Microphone: {guest.micStatus.toUpperCase()}</div>
                  <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>Audio capture stream</div>
                </div>
              </div>
            </div>
          </div>

          {/* Telemetry info */}
          <div style={{ padding: "14px", borderRadius: "10px", backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", fontSize: "12.5px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Participation Duration:</span>
              <strong style={{ color: "var(--text-main)" }}>{guest.durationMinutes} minutes</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Connection Standing:</span>
              <strong style={{ color: guest.connectionStatus === "connected" ? "var(--status-success)" : "#DC2626", textTransform: "capitalize" }}>
                {guest.connectionStatus}
              </strong>
            </div>
            {guest.removalReason && (
              <div style={{ marginTop: "4px", color: "#DC2626", fontSize: "12px" }}>
                <strong>Removal Reason:</strong> {guest.removalReason}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-secondary)",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Close
            </button>

            {guest.connectionStatus === "connected" && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRemoveGuest(guest);
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#DC2626",
                  color: "#ffffff",
                  fontSize: "12.5px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <UserX size={14} /> Remove Guest
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
