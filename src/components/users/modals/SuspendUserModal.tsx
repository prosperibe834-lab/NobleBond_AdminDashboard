import React, { useState } from "react";
import { X, ShieldAlert, AlertTriangle } from "lucide-react";
import type { NobleUser } from "../../../types/userManagement.types";

interface SuspendUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: NobleUser | null;
  onConfirm: (userId: string, reason: string, duration: "24h" | "7d" | "30d" | "permanent", adminNote?: string) => void;
}

export const SuspendUserModal: React.FC<SuspendUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onConfirm,
}) => {
  const [duration, setDuration] = useState<"24h" | "7d" | "30d" | "permanent">("7d");
  const [reason, setReason] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !user) return null;

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("Please provide a suspension reason");
      return;
    }
    onConfirm(user.id, reason.trim(), duration, adminNote.trim() || undefined);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.55)",
        backdropFilter: "blur(4px)",
        zIndex: 1100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          backgroundColor: "var(--bg-card)",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-elevated)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: "rgba(201, 54, 79, 0.1)",
                color: "var(--status-danger)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldAlert size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                Suspend Account Access
              </h3>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Target: {user.name} ({user.username})
              </span>
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
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Warning */}
          <div
            style={{
              padding: "12px",
              borderRadius: "10px",
              backgroundColor: "rgba(201, 54, 79, 0.08)",
              border: "1px solid rgba(201, 54, 79, 0.25)",
              display: "flex",
              gap: "10px",
              alignItems: "flex-start",
            }}
          >
            <AlertTriangle size={18} color="var(--status-danger)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              Suspending this account will immediately revoke all active mobile sessions, hide dating profile discovery from the feed, and disable real-time messaging and live-streaming broadcaster tools.
            </span>
          </div>

          {/* Duration Selector */}
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "8px" }}>
              Suspension Duration
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
              {[
                { id: "24h", label: "24 Hours" },
                { id: "7d", label: "7 Days" },
                { id: "30d", label: "30 Days" },
                { id: "permanent", label: "Permanent" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDuration(opt.id as "24h" | "7d" | "30d" | "permanent")}
                  style={{
                    padding: "8px 6px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    border: "1px solid",
                    borderColor: duration === opt.id ? "var(--status-danger)" : "var(--border)",
                    backgroundColor:
                      duration === opt.id ? "rgba(201, 54, 79, 0.12)" : "var(--bg-surface)",
                    color: duration === opt.id ? "var(--status-danger)" : "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reason Input */}
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              Official Suspension Reason <span style={{ color: "var(--status-danger)" }}>*</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Inappropriate messages violating community harassment guidelines."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError("");
              }}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: `1px solid ${error ? "var(--status-danger)" : "var(--border)"}`,
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "13px",
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
            {error && <span style={{ fontSize: "11px", color: "var(--status-danger)" }}>{error}</span>}
          </div>

          {/* Internal Admin Note */}
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              Internal Admin Record Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Incident logged via Safety Ticket #489."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid var(--border)",
            backgroundColor: "var(--bg-surface)",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "transparent",
              color: "var(--text-main)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              backgroundColor: "var(--status-danger)",
              color: "#FFFFFF",
              border: "none",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <ShieldAlert size={14} />
            <span>Confirm Suspension</span>
          </button>
        </div>
      </div>
    </div>
  );
};
