import React, { useState } from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";
import type { NobleUser } from "../../../types/userManagement.types";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: NobleUser | null;
  onConfirm: (userId: string, typedConfirmation: string) => void;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onConfirm,
}) => {
  const [typedValue, setTypedValue] = useState("");

  if (!isOpen || !user) return null;

  const isConfirmed = typedValue.trim().toUpperCase() === "DELETE";

  const handleConfirm = () => {
    if (!isConfirmed) return;
    onConfirm(user.id, typedValue.trim());
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
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(6px)",
        zIndex: 1200,
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
          maxWidth: "500px",
          backgroundColor: "var(--bg-card)",
          borderRadius: "16px",
          border: "2px solid var(--status-danger)",
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
            backgroundColor: "rgba(201, 54, 79, 0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "8px",
                backgroundColor: "var(--status-danger)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Trash2 size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--status-danger)", margin: 0 }}>
                Permanently Delete User Account
              </h3>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                ID: {user.id} | {user.name}
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
          <div
            style={{
              padding: "12px",
              borderRadius: "10px",
              backgroundColor: "rgba(201, 54, 79, 0.08)",
              border: "1px solid rgba(201, 54, 79, 0.3)",
              display: "flex",
              gap: "10px",
              alignItems: "flex-start",
            }}
          >
            <AlertTriangle size={20} color="var(--status-danger)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--status-danger)" }}>
                Irreversible Destructive Action
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "4px 0 0 0", lineHeight: 1.5 }}>
                This is permanent account deletion, not a temporary suspension or deactivation. All user profile media, matches, conversations metadata, Gift Coins ({user.wallet.giftCoins}), and Connection Points ({user.wallet.connectionPoints}) will be permanently purged.
              </p>
            </div>
          </div>

          {/* Type Confirmation */}
          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "6px" }}>
              To confirm, type <span style={{ color: "var(--status-danger)", fontWeight: 800 }}>DELETE</span> below:
            </label>
            <input
              type="text"
              placeholder="Type DELETE to enable confirmation"
              value={typedValue}
              onChange={(e) => setTypedValue(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: `2px solid ${isConfirmed ? "var(--status-danger)" : "var(--border)"}`,
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.05em",
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
            disabled={!isConfirmed}
            onClick={handleConfirm}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              backgroundColor: isConfirmed ? "var(--status-danger)" : "var(--border)",
              color: isConfirmed ? "#FFFFFF" : "var(--text-muted)",
              border: "none",
              fontSize: "13px",
              fontWeight: 700,
              cursor: isConfirmed ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s ease",
            }}
          >
            <Trash2 size={14} />
            <span>Delete Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

