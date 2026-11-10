// NobleBond Admin — Remove Guest Modal
// Disconnect / evict guest from multi-host stage, zero emojis

import React, { useState } from "react";
import { X, UserMinus, Mic, Video } from "lucide-react";
import type { LiveGuestRecord } from "../../../types/liveManagement.types";

interface RemoveGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: LiveGuestRecord | null;
  onConfirmRemove: (guestId: string, reason: string) => void;
}

const PRESET_REASONS = [
  "Inappropriate conduct or verbal harassment",
  "Severe audio feedback or technical distortion",
  "Host explicitly requested guest eviction",
  "Safety / Community guideline breach",
  "Repeated disruption of broadcast flow",
  "Commercial solicitation or spamming",
];

export const RemoveGuestModal: React.FC<RemoveGuestModalProps> = ({
  isOpen,
  onClose,
  guest,
  onConfirmRemove,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>(PRESET_REASONS[0]);
  const [customNote, setCustomNote] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !guest) return null;

  const handleConfirm = () => {
    const finalReason = customNote.trim()
      ? `${selectedReason}: ${customNote.trim()}`
      : selectedReason;

    if (!finalReason.trim()) {
      setError("Please specify a reason for removing this stage guest.");
      return;
    }

    onConfirmRemove(guest.id, finalReason);
    onClose();
  };

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
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "rgba(239, 68, 68, 0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                color: "#EF4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UserMinus size={22} />
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                Evict Co-Host from Stage
              </h3>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "12px",
                  color: "#EF4444",
                }}
              >
                Disconnect guest audio/video stream immediately
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          {/* Target Guest Card */}
          <div
            style={{
              padding: "14px",
              borderRadius: "12px",
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <img
              src={guest.user.avatar}
              alt={guest.user.name}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                {guest.user.name}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  marginTop: "2px",
                }}
              >
                In session: <strong>{guest.sessionTitle}</strong> (Host: {guest.host.name})
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginTop: "6px",
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Video size={12} color={guest.cameraStatus === "on" ? "#10B981" : "#EF4444"} />
                  Cam: {guest.cameraStatus}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Mic size={12} color={guest.micStatus === "on" ? "#10B981" : "#EF4444"} />
                  Mic: {guest.micStatus}
                </span>
                <span>On stage: {guest.durationMinutes}m</span>
              </div>
            </div>
          </div>

          {/* Reason Category */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-secondary)",
                marginBottom: "6px",
              }}
            >
              Select Eviction Reason
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px",
                fontSize: "13px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                outline: "none",
              }}
            >
              {PRESET_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Audit Note */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-secondary)",
                marginBottom: "6px",
              }}
            >
              Audit Notes (Optional)
            </label>
            <textarea
              value={customNote}
              onChange={(e) => {
                setCustomNote(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Record justification for disconnecting this co-host..."
              rows={3}
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: "13px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                outline: "none",
                resize: "vertical",
              }}
            />
          </div>

          {error && (
            <div style={{ fontSize: "12px", color: "#EF4444", fontWeight: 500 }}>
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            backgroundColor: "var(--bg-secondary)",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "9px 18px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-secondary)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            style={{
              padding: "9px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#EF4444",
              color: "#FFFFFF",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <UserMinus size={15} /> Evict from Stage
          </button>
        </div>
      </div>
    </div>
  );
};
