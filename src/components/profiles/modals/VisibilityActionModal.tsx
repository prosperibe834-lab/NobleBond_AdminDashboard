// NobleBond Admin — Profile Visibility Action Modal
// Manages Discoverable, Paused (voluntary), Hidden, and Restricted states with reason logging

import React, { useState } from "react";
import { X, Eye, EyeOff, ShieldAlert, Clock, Info } from "lucide-react";
import type { AdminProfile, ProfileVisibility } from "../../../types/profileManagement.types";

interface VisibilityActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AdminProfile | null;
  onUpdateVisibility: (profileId: string, visibility: ProfileVisibility, reason: string) => void;
}

export const VisibilityActionModal: React.FC<VisibilityActionModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateVisibility,
}) => {
  if (!isOpen || !profile) return null;

  return (
    <VisibilityActionForm
      key={profile.id}
      profile={profile}
      onClose={onClose}
      onUpdateVisibility={onUpdateVisibility}
    />
  );
};

interface VisibilityActionFormProps {
  profile: AdminProfile;
  onClose: () => void;
  onUpdateVisibility: (profileId: string, visibility: ProfileVisibility, reason: string) => void;
}

const VisibilityActionForm: React.FC<VisibilityActionFormProps> = ({
  profile,
  onClose,
  onUpdateVisibility,
}) => {
  const [selectedVisibility, setSelectedVisibility] = useState<ProfileVisibility>(profile.visibility);
  const [reason, setReason] = useState(profile.visibilityReason || "");

  const options: Array<{
    value: ProfileVisibility;
    title: string;
    description: string;
    icon: typeof Eye;
    color: string;
  }> = [
    {
      value: "discoverable",
      title: "Discoverable (Public Feed)",
      description: "Profile is actively recommended in matching feeds, search results, and live stream discovery.",
      icon: Eye,
      color: "var(--status-success)",
    },
    {
      value: "paused_by_user",
      title: "Paused by User (Voluntary Snooze)",
      description: "Member voluntarily paused their account in their mobile app settings. This is NOT a policy disciplinary action.",
      icon: Clock,
      color: "var(--status-info)",
    },
    {
      value: "hidden",
      title: "Hidden by Admin",
      description: "Profile is immediately removed from public feeds and search results while preserving user account access.",
      icon: EyeOff,
      color: "#6B7280",
    },
    {
      value: "restricted",
      title: "Restricted (Policy Violation)",
      description: "Profile is completely quarantined due to severe terms violations or unresolved safety investigation.",
      icon: ShieldAlert,
      color: "var(--status-error)",
    },
  ];

  const handleSave = () => {
    onUpdateVisibility(profile.id, selectedVisibility, reason || "Administrative visibility change");
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
          borderRadius: "20px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-xl)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
              Manage Profile Visibility & Status
            </div>
            <div style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
              Member: {profile.fullName} ({profile.username})
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
              padding: "6px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {options.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedVisibility === opt.value;
              return (
                <div
                  key={opt.value}
                  onClick={() => setSelectedVisibility(opt.value)}
                  style={{
                    padding: "14px",
                    borderRadius: "12px",
                    border: isSelected ? `2px solid ${opt.color}` : "1px solid var(--border)",
                    backgroundColor: isSelected ? "var(--bg-main)" : "var(--bg-card)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      backgroundColor: isSelected ? opt.color : "rgba(107, 114, 128, 0.1)",
                      color: isSelected ? "#FFFFFF" : opt.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)" }}>
                      {opt.title}
                    </div>
                    <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginTop: "2px", lineHeight: "1.4" }}>
                      {opt.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedVisibility === "paused_by_user" && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                backgroundColor: "var(--status-info-bg)",
                border: "1px solid var(--status-info)",
                color: "var(--status-info)",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Info size={16} />
              <span>Voluntary pause reflects member personal choice and carries zero disciplinary penalty.</span>
            </div>
          )}

          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "6px" }}>
              Reason for Visibility Change (Logged in Audit Trail)
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Account restored to discoverable after resolving user report."
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-main)",
                color: "var(--text-main)",
                fontSize: "12.5px",
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-main)",
              color: "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "var(--primary)",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Update Visibility
          </button>
        </div>
      </div>
    </div>
  );
};
