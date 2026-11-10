// NobleBond Admin — Restrict Host Modal
// Host live broadcast privilege suspension, zero emojis

import React, { useState } from "react";
import { X, UserX } from "lucide-react";
import type { LiveHostRecord } from "../../../types/liveManagement.types";

interface RestrictHostModalProps {
  isOpen: boolean;
  onClose: () => void;
  host: LiveHostRecord | null;
  onConfirmRestrict: (hostId: string, durationDays: number | null, reason: string) => void;
}

const DURATION_OPTIONS = [
  { label: "24 Hours (1 Day)", value: 1 },
  { label: "3 Days", value: 3 },
  { label: "7 Days (1 Week)", value: 7 },
  { label: "14 Days (2 Weeks)", value: 14 },
  { label: "30 Days (1 Month)", value: 30 },
  { label: "Permanent Revocation", value: null },
];

const PRESET_REASONS = [
  "Repeated Community Guidelines Violations",
  "Safety, Harassment or Inappropriate Speech",
  "Virtual Gift Coercion or Deceptive Practices",
  "Age / Identity Verification Failure",
  "Severe Hate Speech or Dangerous Conduct",
  "Multiple Disciplinary Reports from Audience",
];

export const RestrictHostModal: React.FC<RestrictHostModalProps> = ({
  isOpen,
  onClose,
  host,
  onConfirmRestrict,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(7);
  const [selectedReason, setSelectedReason] = useState<string>(PRESET_REASONS[0]);
  const [customNote, setCustomNote] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !host) return null;

  const handleConfirm = () => {
    const finalReason = customNote.trim()
      ? `${selectedReason}: ${customNote.trim()}`
      : selectedReason;

    if (!finalReason.trim()) {
      setError("Please specify a reason for restricting this host.");
      return;
    }

    onConfirmRestrict(host.id, selectedDuration, finalReason);
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
          maxWidth: "560px",
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
              <UserX size={22} />
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
                Restrict Host Broadcast Privileges
              </h3>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "12px",
                  color: "#EF4444",
                }}
              >
                Revoke ability to launch or schedule live streams
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
          {/* Target Host Details */}
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
              src={host.user.avatar}
              alt={host.user.name}
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
                {host.user.name}
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
                <span>@{host.user.username}</span>
                <span>•</span>
                <span>{host.totalSessions} total sessions</span>
                <span>•</span>
                <span>{host.reportsReceivedCount} reports logged</span>
              </div>
            </div>
          </div>

          {/* Restriction Duration */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-secondary)",
                marginBottom: "8px",
              }}
            >
              Select Restriction Duration
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "8px",
              }}
            >
              {DURATION_OPTIONS.map((opt) => {
                const isSelected = selectedDuration === opt.value;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setSelectedDuration(opt.value)}
                    style={{
                      padding: "10px 8px",
                      borderRadius: "8px",
                      border: isSelected
                        ? "2px solid #EF4444"
                        : "1px solid var(--border)",
                      backgroundColor: isSelected
                        ? "rgba(239, 68, 68, 0.08)"
                        : "var(--bg-secondary)",
                      color: isSelected ? "#EF4444" : "var(--text-primary)",
                      fontSize: "12px",
                      fontWeight: isSelected ? 700 : 500,
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
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
              Policy Infraction / Reason
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
              Mandatory Enforcement Audit Note
            </label>
            <textarea
              value={customNote}
              onChange={(e) => {
                setCustomNote(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Record exact incident context, reported timestamps, and review findings..."
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
            <UserX size={15} /> Apply Host Restriction
          </button>
        </div>
      </div>
    </div>
  );
};
