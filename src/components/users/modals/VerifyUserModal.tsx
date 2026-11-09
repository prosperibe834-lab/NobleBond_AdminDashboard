import React, { useState } from "react";
import { X, CheckCircle, ShieldCheck, AlertCircle } from "lucide-react";
import type { NobleUser } from "../../../types/userManagement.types";

interface VerifyUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: NobleUser | null;
  onConfirm: (userId: string, type: "email" | "phone" | "photo" | "identity" | "all", notes?: string) => void;
}

export const VerifyUserModal: React.FC<VerifyUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onConfirm,
}) => {
  const [verifyType, setVerifyType] = useState<"all" | "photo" | "identity" | "phone">("all");
  const [adminNotes, setAdminNotes] = useState("");

  if (!isOpen || !user) return null;

  const handleConfirm = () => {
    onConfirm(user.id, verifyType, adminNotes.trim());
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
          maxWidth: "500px",
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
                backgroundColor: "rgba(20, 132, 95, 0.1)",
                color: "var(--status-success)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                Verify User Account
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
          {/* Current Status Badge */}
          <div
            style={{
              padding: "12px",
              borderRadius: "10px",
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Current Status:</span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: "6px",
                backgroundColor:
                  user.verification.status === "verified"
                    ? "rgba(20, 132, 95, 0.12)"
                    : "rgba(181, 139, 66, 0.12)",
                color:
                  user.verification.status === "verified"
                    ? "var(--status-success)"
                    : "var(--status-warning)",
              }}
            >
              {user.verification.status.toUpperCase()}
            </span>
          </div>

          {/* Verification Type Selection */}
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "8px" }}>
              Select Verification Level to Grant
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { id: "all", title: "Full NobleBond Blue Check", desc: "Verifies email, phone, photo biometrics, and identity documents." },
                { id: "photo", title: "Photo & Pose Verification", desc: "Confirms user uploaded authentic live selfie matching dating profile." },
                { id: "identity", title: "Government Identity Document", desc: "Verifies passport or national ID match against registration name." },
                { id: "phone", title: "Phone Number OTP Verification", desc: "Confirms verified possession of cellular number." },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setVerifyType(opt.id as "all" | "photo" | "identity" | "phone")}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: `1px solid ${verifyType === opt.id ? "var(--status-success)" : "var(--border)"}`,
                    backgroundColor: verifyType === opt.id ? "rgba(20, 132, 95, 0.06)" : "var(--bg-surface)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  <input
                    type="radio"
                    name="verifyType"
                    checked={verifyType === opt.id}
                    onChange={() => setVerifyType(opt.id as "all" | "photo" | "identity" | "phone")}
                    style={{ accentColor: "var(--status-success)", marginTop: "2px" }}
                  />
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>
                      {opt.title}
                    </div>
                    <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
                      {opt.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Explanation of Consequences */}
          <div
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              backgroundColor: "rgba(20, 132, 95, 0.08)",
              border: "1px solid rgba(20, 132, 95, 0.2)",
              display: "flex",
              gap: "8px",
              alignItems: "flex-start",
            }}
          >
            <AlertCircle size={16} color="var(--status-success)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <span style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
              Granting verification displays a trusted badge across NobleBond swipe cards and chat. If this user was referred by another member, the referrer becomes eligible for their +50 Connection Points reward.
            </span>
          </div>

          {/* Review Notes */}
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              Administrative Review Notes (Audit Log)
            </label>
            <input
              type="text"
              placeholder="e.g. Verified via official submitted passport document."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
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
            <span>Confirm Verification</span>
          </button>
        </div>
      </div>
    </div>
  );
};
