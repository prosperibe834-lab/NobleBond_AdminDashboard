import React, { useState } from "react";
import { X, CheckCircle, RotateCcw } from "lucide-react";
import type { NobleUser } from "../../../types/userManagement.types";

interface RestoreUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: NobleUser | null;
  onConfirm: (userId: string, reason?: string) => void;
}

export const RestoreUserModal: React.FC<RestoreUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onConfirm,
}) => {
  const [reason, setReason] = useState("");

  if (!isOpen || !user) return null;

  const handleConfirm = () => {
    onConfirm(user.id, reason.trim() || undefined);
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
        backgroundColor: "rgba(0, 0, 0, 0.5)",
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
          maxWidth: "480px",
          backgroundColor: "var(--bg-card)",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-elevated)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
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
                backgroundColor: "rgba(20, 132, 95, 0.1)",
                color: "var(--status-success)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <RotateCcw size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                Restore User Account
              </h3>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                {user.name} ({user.username})
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

        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <p style={{ fontSize: "13px", color: "var(--text-main)", margin: 0, lineHeight: 1.5 }}>
            Restoring this account will remove all active suspensions, unblock access to the NobleBond mobile application, and reactivate dating profile discovery.
          </p>

          {user.suspensionDetails && (
            <div
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border)",
                fontSize: "12px",
                color: "var(--text-secondary)",
              }}
            >
              <div><strong>Current Suspension Reason:</strong> {user.suspensionDetails.reason}</div>
              <div style={{ marginTop: "4px" }}><strong>Duration:</strong> {user.suspensionDetails.duration}</div>
            </div>
          )}

          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              Restoration Reason / Appeal Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Appeal reviewed and approved by trust committee."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
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
              backgroundColor: "var(--status-success)",
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
            <CheckCircle size={14} />
            <span>Restore Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
