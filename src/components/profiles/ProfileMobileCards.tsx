// NobleBond Admin — Profile Management Mobile Cards
// Responsive touch-friendly card layout for tablets and smartphones, zero emojis

import React from "react";
import {
  ShieldCheck,
  Camera,
  Video,
  Clock,
  Eye,
  EyeOff,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import type { AdminProfile } from "../../types/profileManagement.types";
import { calculateAge } from "../../data/profileManagementDataService";

interface ProfileMobileCardsProps {
  profiles: AdminProfile[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onOpenDetails: (profile: AdminProfile, initialTab?: string) => void;
  onOpenPreview: (profile: AdminProfile) => void;
  onOpenVisibilityModal: (profile: AdminProfile) => void;
}

export const ProfileMobileCards: React.FC<ProfileMobileCardsProps> = ({
  profiles,
  selectedIds,
  onToggleSelect,
  onOpenDetails,
  onOpenPreview,
  onOpenVisibilityModal,
}) => {
  if (profiles.length === 0) {
    return (
      <div
        style={{
          padding: "36px 16px",
          textAlign: "center",
          backgroundColor: "var(--bg-card)",
          borderRadius: "14px",
          border: "1px solid var(--border)",
          color: "var(--text-secondary)",
        }}
      >
        No profiles match your active filters.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {profiles.map((profile) => {
        const isSelected = selectedIds.includes(profile.id);
        const age = calculateAge(profile.dateOfBirth);
        const isVerified = profile.verification.overallStatus === "verified";

        return (
          <div
            key={profile.id}
            style={{
              backgroundColor: "var(--bg-card)",
              border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border)",
              borderRadius: "14px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {/* Top row: Checkbox, Avatar, Name & Status */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect(profile.id)}
                style={{ cursor: "pointer", accentColor: "var(--primary)", marginTop: "12px" }}
              />

              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                  position: "relative",
                  flexShrink: 0,
                }}
              >
                <img
                  src={profile.avatar}
                  alt={profile.fullName}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                {isVerified && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 2,
                      right: 2,
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      backgroundColor: "#2563EB",
                      border: "1.5px solid #FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#FFFFFF",
                    }}
                  >
                    <ShieldCheck size={9} />
                  </div>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
                  <div style={{ fontWeight: 800, fontSize: "14.5px", color: "var(--text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {profile.fullName}, {age}
                  </div>
                  {profile.reportsCount > 0 && (
                    <span
                      style={{
                        padding: "2px 6px",
                        borderRadius: "8px",
                        backgroundColor: "var(--status-error-bg)",
                        color: "var(--status-error)",
                        fontSize: "10.5px",
                        fontWeight: 700,
                      }}
                    >
                      {profile.reportsCount} Reports
                    </span>
                  )}
                </div>

                <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "1px" }}>
                  {profile.username} &middot; {profile.city}, {profile.country}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px", flexWrap: "wrap" }}>
                  {/* Moderation Badge */}
                  {profile.moderationStatus === "approved" && (
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--status-success)", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                      <CheckCircle2 size={12} /> Approved
                    </span>
                  )}
                  {profile.moderationStatus === "under_review" && (
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#F59E0B", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                      <Clock size={12} /> Under Review
                    </span>
                  )}
                  {profile.moderationStatus === "flagged" && (
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#EC4899", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                      <AlertTriangle size={12} /> Flagged
                    </span>
                  )}
                  {profile.moderationStatus === "restricted" && (
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--status-error)", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                      <ShieldAlert size={12} /> Restricted
                    </span>
                  )}

                  <span style={{ color: "var(--border)" }}>&bull;</span>

                  {/* Visibility Badge */}
                  {profile.visibility === "discoverable" && (
                    <span style={{ fontSize: "11px", color: "var(--text-secondary)", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                      <Eye size={12} /> Discoverable
                    </span>
                  )}
                  {profile.visibility === "paused_by_user" && (
                    <span style={{ fontSize: "11px", color: "var(--status-info)", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                      <Clock size={12} /> Paused by User
                    </span>
                  )}
                  {profile.visibility === "hidden" && (
                    <span style={{ fontSize: "11px", color: "#6B7280", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                      <EyeOff size={12} /> Hidden
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Completeness & Media Meta */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                backgroundColor: "var(--bg-main)",
                borderRadius: "10px",
                fontSize: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ color: "var(--text-secondary)" }}>Completeness:</span>
                <span style={{ fontWeight: 700, color: "var(--text-main)" }}>
                  {profile.completionPercentage}%
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-secondary)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Camera size={13} />
                  <span>{profile.photos.length} photos</span>
                </div>
                {profile.videos.length > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Video size={13} />
                    <span>{profile.videos.length}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => onOpenPreview(profile)}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-main)",
                  color: "var(--text-secondary)",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                <ExternalLink size={13} /> Preview
              </button>

              <button
                type="button"
                onClick={() => onOpenDetails(profile)}
                style={{
                  flex: 2,
                  padding: "8px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "var(--primary)",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Review & Moderate
              </button>

              <button
                type="button"
                onClick={() => onOpenVisibilityModal(profile)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-main)",
                  color: "var(--text-secondary)",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Visibility
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

