// NobleBond Admin — End Live Session Modal
// Emergency stream termination and regulatory compliance audit, zero emojis

import React, { useState } from "react";
import { X, AlertTriangle, Radio, Users, Clock, ShieldAlert } from "lucide-react";
import type { LiveSessionRecord } from "../../../types/liveManagement.types";

interface EndLiveSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: LiveSessionRecord | null;
  onConfirmEnd: (sessionId: string, reason: string) => void;
}

const PRESET_REASONS = [
  "Community Guidelines: Inappropriate Content or Nudity",
  "Safety & Harassment Policy Violation",
  "Fraudulent or Financial Scam Promotion",
  "Copyright or Intellectual Property Infringement",
  "Host Inactivity or Technical Degraded Feed",
  "Administrative Intervention for Audience Safety",
];

export const EndLiveSessionModal: React.FC<EndLiveSessionModalProps> = ({
  isOpen,
  onClose,
  session,
  onConfirmEnd,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>(PRESET_REASONS[0]);
  const [customNote, setCustomNote] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !session) return null;

  const handleConfirm = () => {
    const finalReason = customNote.trim()
      ? `${selectedReason}: ${customNote.trim()}`
      : selectedReason;

    if (!finalReason.trim()) {
      setError("Please specify a reason for terminating this broadcast.");
      return;
    }

    onConfirmEnd(session.id, finalReason);
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
          maxWidth: "540px",
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
              <AlertTriangle size={22} />
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
                Terminate Live Broadcast
              </h3>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "12px",
                  color: "#EF4444",
                }}
              >
                Immediate broadcast cutoff and audience evacuation
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
          {/* Target Stream Overview */}
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
              src={session.host.avatar}
              alt={session.host.name}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                objectFit: "cover",
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {session.title}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  marginTop: "2px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span>Host: {session.host.name}</span>
                <span>•</span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Users size={12} /> {session.currentViewers.toLocaleString()} watching
                </span>
                <span>•</span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Clock size={12} /> {session.durationMinutes}m elapsed
                </span>
              </div>
            </div>
          </div>

          {/* Warning Banner */}
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "10px",
              backgroundColor: "rgba(239, 68, 68, 0.06)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              display: "flex",
              gap: "10px",
              fontSize: "12px",
              lineHeight: "1.5",
              color: "var(--text-primary)",
            }}
          >
            <ShieldAlert size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <strong>Enforcement Notice:</strong> Terminating this live stream will immediately close the RTMP/WebRTC ingest pipeline, disconnect all active viewers and stage co-hosts, and flag this room in the moderation audit log.
            </div>
          </div>

          {/* Preset Reason Selector */}
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
              Violation Category / Termination Reason
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
              {PRESET_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
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
              Specific Notes / Context (Optional)
            </label>
            <textarea
              value={customNote}
              onChange={(e) => {
                setCustomNote(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Provide specific incident description or regulatory justification..."
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
            <Radio size={15} /> Terminate Broadcast Now
          </button>
        </div>
      </div>
    </div>
  );
};

