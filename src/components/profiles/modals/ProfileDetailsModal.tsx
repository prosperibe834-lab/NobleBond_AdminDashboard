// NobleBond Admin — Comprehensive Profile Details & Moderation Modal
// Complete 11-tab administrative inspector, zero emojis, React 19 compliant

import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Eye,
  CheckCircle2,
  AlertTriangle,
  User,
  FileText,
  Heart,
  Sparkles,
  Camera,
  Video,
  Award,
  Layers,
  Flag,
  ExternalLink,
  Info,
  Check,
  ChevronRight,
} from "lucide-react";
import type { AdminProfile, MediaItem, ProfileReport } from "../../../types/profileManagement.types";
import { calculateAge } from "../../../data/profileManagementDataService";

interface ProfileDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AdminProfile | null;
  initialTab?: string;
  onUpdateBio: (profileId: string, status: "approved" | "pending" | "flagged" | "rejected", reason?: string) => void;
  onUpdatePrompt: (profileId: string, promptId: string, status: "approved" | "pending" | "flagged" | "rejected", reason?: string) => void;
  onOpenMediaModal: (mediaItem: MediaItem) => void;
  onOpenVerificationModal: (verifyType: "photo" | "identity") => void;
  onOpenReportModal: (report: ProfileReport) => void;
  onOpenVisibilityModal: () => void;
  onApproveProfile: (profileId: string) => void;
  onPreview: (profile: AdminProfile) => void;
}

export const ProfileDetailsModal: React.FC<ProfileDetailsModalProps> = ({
  isOpen,
  onClose,
  profile,
  initialTab = "overview",
  onUpdateBio,
  onUpdatePrompt,
  onOpenMediaModal,
  onOpenVerificationModal,
  onOpenReportModal,
  onOpenVisibilityModal,
  onApproveProfile,
  onPreview,
}) => {
  if (!isOpen || !profile) return null;

  return (
    <ProfileDetailsForm
      key={profile.id}
      profile={profile}
      initialTab={initialTab}
      onClose={onClose}
      onUpdateBio={onUpdateBio}
      onUpdatePrompt={onUpdatePrompt}
      onOpenMediaModal={onOpenMediaModal}
      onOpenVerificationModal={onOpenVerificationModal}
      onOpenReportModal={onOpenReportModal}
      onOpenVisibilityModal={onOpenVisibilityModal}
      onApproveProfile={onApproveProfile}
      onPreview={onPreview}
    />
  );
};

interface ProfileDetailsFormProps {
  profile: AdminProfile;
  initialTab: string;
  onClose: () => void;
  onUpdateBio: (profileId: string, status: "approved" | "pending" | "flagged" | "rejected", reason?: string) => void;
  onUpdatePrompt: (profileId: string, promptId: string, status: "approved" | "pending" | "flagged" | "rejected", reason?: string) => void;
  onOpenMediaModal: (mediaItem: MediaItem) => void;
  onOpenVerificationModal: (verifyType: "photo" | "identity") => void;
  onOpenReportModal: (report: ProfileReport) => void;
  onOpenVisibilityModal: () => void;
  onApproveProfile: (profileId: string) => void;
  onPreview: (profile: AdminProfile) => void;
}

const ProfileDetailsForm: React.FC<ProfileDetailsFormProps> = ({
  profile,
  initialTab,
  onClose,
  onUpdateBio,
  onUpdatePrompt,
  onOpenMediaModal,
  onOpenVerificationModal,
  onOpenReportModal,
  onOpenVisibilityModal,
  onApproveProfile,
  onPreview,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [bioReasonInput, setBioReasonInput] = useState(profile.bioModerationReason || "");

  const age = calculateAge(profile.dateOfBirth);
  const isVerified = profile.verification.overallStatus === "verified";

  const tabs = [
    { id: "overview", label: "Overview", icon: Layers },
    { id: "personal", label: "Personal Details", icon: User },
    { id: "bio", label: "About Me", icon: FileText },
    { id: "lifestyle", label: "Lifestyle & Interests", icon: Sparkles },
    { id: "dating", label: "Dating Preferences", icon: Heart },
    { id: "prompts", label: "Prompts", icon: FileText },
    { id: "media", label: `Photos & Videos (${profile.photos.length + profile.videos.length})`, icon: Camera },
    { id: "verification", label: "Verification Safeguards", icon: ShieldCheck },
    { id: "quality", label: `Quality (${profile.completionPercentage}%)`, icon: Award },
    { id: "visibility", label: "Visibility", icon: Eye },
    { id: "reports", label: `Reports & History (${profile.reportsCount})`, icon: Flag },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
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
          maxWidth: "1040px",
          height: "92vh",
          backgroundColor: "var(--bg-card)",
          borderRadius: "24px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-xl)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header with Profile Card */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
            backgroundColor: "var(--bg-main)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "58px",
                height: "58px",
                borderRadius: "14px",
                overflow: "hidden",
                border: "2px solid var(--border)",
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
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#2563EB",
                    border: "1.5px solid #FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                  }}
                >
                  <ShieldCheck size={10} />
                </div>
              )}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)" }}>
                  {profile.fullName}
                </span>
                <span style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-secondary)" }}>
                  {age} yrs
                </span>
                <span style={{ color: "var(--text-muted)" }}>&middot;</span>
                <span style={{ fontSize: "13.5px", color: "var(--text-secondary)", fontWeight: 500 }}>
                  {profile.username}
                </span>

                {/* Moderation Status Badge */}
                {profile.moderationStatus === "approved" && (
                  <span style={{ padding: "2px 8px", borderRadius: "6px", backgroundColor: "rgba(16, 185, 129, 0.12)", color: "var(--status-success)", fontSize: "11px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "3px" }}>
                    <CheckCircle2 size={12} /> Approved
                  </span>
                )}
                {profile.moderationStatus === "under_review" && (
                  <span style={{ padding: "2px 8px", borderRadius: "6px", backgroundColor: "rgba(245, 158, 11, 0.12)", color: "#F59E0B", fontSize: "11px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "3px" }}>
                    <Clock size={12} /> Under Review
                  </span>
                )}
                {profile.moderationStatus === "flagged" && (
                  <span style={{ padding: "2px 8px", borderRadius: "6px", backgroundColor: "rgba(236, 72, 153, 0.12)", color: "#EC4899", fontSize: "11px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "3px" }}>
                    <AlertTriangle size={12} /> Flagged
                  </span>
                )}
                {profile.moderationStatus === "restricted" && (
                  <span style={{ padding: "2px 8px", borderRadius: "6px", backgroundColor: "rgba(239, 68, 68, 0.12)", color: "var(--status-error)", fontSize: "11px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "3px" }}>
                    <ShieldAlert size={12} /> Restricted
                  </span>
                )}
              </div>

              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "3px" }}>
                {profile.city}, {profile.country} &middot; ID: {profile.id} &middot; User ID: {profile.userId}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              type="button"
              onClick={() => onPreview(profile)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-main)",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <ExternalLink size={13} />
              Preview Public Card
            </button>

            <button
              type="button"
              onClick={onOpenVisibilityModal}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-main)",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Eye size={13} />
              Visibility: {profile.visibility.replace("_", " ")}
            </button>

            {profile.moderationStatus !== "approved" && (
              <button
                type="button"
                onClick={() => onApproveProfile(profile.id)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "var(--status-success)",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Check size={14} /> Approve All
              </button>
            )}

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
        </div>

        {/* 11 Navigation Tabs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            overflowX: "auto",
            backgroundColor: "var(--bg-main)",
            borderBottom: "1px solid var(--border)",
            padding: "0 16px",
            gap: "4px",
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "12px 14px",
                  border: "none",
                  background: "none",
                  borderBottom: isActive ? "2.5px solid var(--primary)" : "2.5px solid transparent",
                  color: isActive ? "var(--primary)" : "var(--text-secondary)",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "12.5px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Stage */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px",
            backgroundColor: "var(--bg-card)",
          }}
        >
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Dating metrics row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "12px" }}>
                <div style={{ padding: "14px", backgroundColor: "var(--bg-main)", borderRadius: "12px", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>Likes Received</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-main)", marginTop: "4px" }}>
                    {profile.datingMetrics.likesReceived}
                  </div>
                </div>
                <div style={{ padding: "14px", backgroundColor: "var(--bg-main)", borderRadius: "12px", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>Matches Made</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--status-success)", marginTop: "4px" }}>
                    {profile.datingMetrics.matches}
                  </div>
                </div>
                <div style={{ padding: "14px", backgroundColor: "var(--bg-main)", borderRadius: "12px", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>Profile Impressions</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--status-info)", marginTop: "4px" }}>
                    {profile.datingMetrics.profileViews}
                  </div>
                </div>
                <div style={{ padding: "14px", backgroundColor: "var(--bg-main)", borderRadius: "12px", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>Super Likes</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--primary)", marginTop: "4px" }}>
                    {profile.datingMetrics.superLikesReceived}
                  </div>
                </div>
              </div>

              {/* Bio summary */}
              <div style={{ padding: "18px", backgroundColor: "var(--bg-main)", borderRadius: "14px", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>Bio Excerpt</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab("bio")}
                    style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
                  >
                    Moderate Bio &rarr;
                  </button>
                </div>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                  {profile.bio || "No biography provided."}
                </p>
              </div>

              {/* Media gallery glance */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)" }}>
                    Media Gallery ({profile.photos.length} photos, {profile.videos.length} videos)
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab("media")}
                    style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
                  >
                    Open Media Review Center &rarr;
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px" }}>
                  {profile.photos.map((ph) => (
                    <div
                      key={ph.id}
                      onClick={() => onOpenMediaModal(ph)}
                      style={{
                        height: "140px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        border: "1px solid var(--border)",
                        position: "relative",
                        cursor: "pointer",
                      }}
                    >
                      <img src={ph.url} alt="Photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: "4px 6px",
                          backgroundColor: "rgba(0,0,0,0.7)",
                          color: "#FFFFFF",
                          fontSize: "10px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          textAlign: "center",
                        }}
                      >
                        {ph.reviewStatus}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERSONAL DETAILS */}
          {activeTab === "personal" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              <div style={{ padding: "16px", backgroundColor: "var(--bg-main)", borderRadius: "12px", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)", marginBottom: "4px" }}>
                  Identity & Demographics
                </div>
                <div><span style={{ color: "var(--text-secondary)" }}>Full Public Name:</span> <strong>{profile.fullName}</strong></div>
                <div><span style={{ color: "var(--text-secondary)" }}>Legal Masked Name:</span> <strong>{profile.legalNameMasked || "Not provided"}</strong></div>
                <div><span style={{ color: "var(--text-secondary)" }}>Username:</span> <strong>{profile.username}</strong></div>
                <div><span style={{ color: "var(--text-secondary)" }}>Date of Birth:</span> <strong>{profile.dateOfBirth} ({age} years old)</strong></div>
                <div><span style={{ color: "var(--text-secondary)" }}>Gender & Pronouns:</span> <strong style={{ textTransform: "capitalize" }}>{profile.gender} ({profile.pronouns})</strong></div>
              </div>

              <div style={{ padding: "16px", backgroundColor: "var(--bg-main)", borderRadius: "12px", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)", marginBottom: "4px" }}>
                  Location & Background
                </div>
                <div><span style={{ color: "var(--text-secondary)" }}>Country:</span> <strong>{profile.country} ({profile.countryCode})</strong></div>
                <div><span style={{ color: "var(--text-secondary)" }}>State / Region:</span> <strong>{profile.stateRegion}</strong></div>
                <div><span style={{ color: "var(--text-secondary)" }}>City / Area:</span> <strong>{profile.city}</strong></div>
                <div><span style={{ color: "var(--text-secondary)" }}>Occupation:</span> <strong>{profile.occupation || "None"}</strong></div>
                <div><span style={{ color: "var(--text-secondary)" }}>Education:</span> <strong>{profile.education || "None"}</strong></div>
                <div><span style={{ color: "var(--text-secondary)" }}>Languages:</span> <strong>{profile.languages.join(", ")}</strong></div>
              </div>
            </div>
          )}

          {/* TAB 3: ABOUT ME (BIO MODERATION) */}
          {activeTab === "bio" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ padding: "18px", backgroundColor: "var(--bg-main)", borderRadius: "14px", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)" }}>
                    Current Biography ({profile.bio.length} characters)
                  </span>
                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 700,
                      backgroundColor:
                        profile.bioModerationStatus === "approved"
                          ? "var(--status-success-bg)"
                          : profile.bioModerationStatus === "flagged"
                          ? "rgba(236, 72, 153, 0.12)"
                          : "rgba(239, 68, 68, 0.12)",
                      color:
                        profile.bioModerationStatus === "approved"
                          ? "var(--status-success)"
                          : profile.bioModerationStatus === "flagged"
                          ? "#EC4899"
                          : "var(--status-error)",
                    }}
                  >
                    Status: {profile.bioModerationStatus.toUpperCase()}
                  </span>
                </div>

                <div
                  style={{
                    padding: "14px",
                    borderRadius: "10px",
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    fontSize: "13.5px",
                    lineHeight: "1.6",
                    color: "var(--text-main)",
                  }}
                >
                  {profile.bio || "No biography written."}
                </div>
              </div>

              {/* Bio Actions */}
              <div>
                <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "8px" }}>
                  Moderation Action on Bio
                </label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
                  <button
                    type="button"
                    onClick={() => onUpdateBio(profile.id, "approved", "Bio approved by administrator")}
                    style={{
                      padding: "9px 16px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "var(--status-success)",
                      color: "#FFFFFF",
                      fontSize: "12.5px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <CheckCircle2 size={15} /> Approve Bio
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateBio(profile.id, "flagged", bioReasonInput || "Bio flagged for commercial or external links")}
                    style={{
                      padding: "9px 16px",
                      borderRadius: "8px",
                      border: "1px solid #EC4899",
                      backgroundColor: "rgba(236, 72, 153, 0.1)",
                      color: "#EC4899",
                      fontSize: "12.5px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <AlertTriangle size={15} /> Flag Bio
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateBio(profile.id, "rejected", bioReasonInput || "Bio violates community guidelines")}
                    style={{
                      padding: "9px 16px",
                      borderRadius: "8px",
                      border: "1px solid var(--status-error)",
                      backgroundColor: "var(--status-error-bg)",
                      color: "var(--status-error)",
                      fontSize: "12.5px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <ShieldAlert size={15} /> Reject & Remove Bio
                  </button>
                </div>

                <input
                  type="text"
                  value={bioReasonInput}
                  onChange={(e) => setBioReasonInput(e.target.value)}
                  placeholder="Reason / Note for Bio Moderation..."
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--bg-main)",
                    color: "var(--text-main)",
                    fontSize: "12.5px",
                  }}
                />
              </div>
            </div>
          )}

          {/* TAB 4: LIFESTYLE & INTERESTS */}
          {activeTab === "lifestyle" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
                  Selected Passions & Hobbies
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {profile.interests.map((interest, i) => (
                    <span
                      key={i}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "20px",
                        backgroundColor: "var(--bg-main)",
                        border: "1px solid var(--border)",
                        fontSize: "12.5px",
                        color: "var(--text-main)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Sparkles size={12} color="var(--primary)" />
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
                  Lifestyle Attributes
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
                  {Object.entries(profile.lifestyle).map(([key, val]) => (
                    <div
                      key={key}
                      style={{
                        padding: "12px",
                        backgroundColor: "var(--bg-main)",
                        borderRadius: "10px",
                        border: "1px solid var(--border)",
                        fontSize: "12.5px",
                      }}
                    >
                      <div style={{ color: "var(--text-secondary)", textTransform: "capitalize" }}>{key}</div>
                      <div style={{ fontWeight: 700, color: "var(--text-main)", marginTop: "2px" }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DATING PREFERENCES */}
          {activeTab === "dating" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
              <div style={{ padding: "16px", backgroundColor: "var(--bg-main)", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "13px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div><span style={{ color: "var(--text-secondary)" }}>Relationship Goals:</span> <strong>{profile.datingPreferences.relationshipGoals}</strong></div>
                <div><span style={{ color: "var(--text-secondary)" }}>Interested In:</span> <strong style={{ textTransform: "capitalize" }}>{profile.datingPreferences.preferredGender}</strong></div>
                <div><span style={{ color: "var(--text-secondary)" }}>Age Window:</span> <strong>{profile.datingPreferences.ageMin} - {profile.datingPreferences.ageMax} years</strong></div>
              </div>
              <div style={{ padding: "16px", backgroundColor: "var(--bg-main)", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "13px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div><span style={{ color: "var(--text-secondary)" }}>Max Discovery Distance:</span> <strong>{profile.datingPreferences.maxDistanceKm} km</strong></div>
                <div><span style={{ color: "var(--text-secondary)" }}>Open to Long Distance:</span> <strong>{profile.datingPreferences.openToLongDistance ? "Yes" : "No"}</strong></div>
                <div><span style={{ color: "var(--text-secondary)" }}>Verified Members Only:</span> <strong>{profile.datingPreferences.verifiedOnly ? "Yes" : "No"}</strong></div>
              </div>
            </div>
          )}

          {/* TAB 6: PROMPTS */}
          {activeTab === "prompts" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {profile.prompts.length === 0 ? (
                <div style={{ padding: "30px", textAlign: "center", color: "var(--text-secondary)" }}>
                  No prompt answers submitted on this profile.
                </div>
              ) : (
                profile.prompts.map((pr) => (
                  <div
                    key={pr.id}
                    style={{
                      padding: "16px",
                      backgroundColor: "var(--bg-main)",
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--primary)" }}>
                        {pr.question}
                      </span>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: pr.moderationStatus === "approved" ? "var(--status-success)" : "#EC4899" }}>
                        {pr.moderationStatus.toUpperCase()}
                      </span>
                    </div>

                    <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-main)" }}>
                      {pr.answer}
                    </div>

                    <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                      <button
                        type="button"
                        onClick={() => onUpdatePrompt(profile.id, pr.id, "approved")}
                        style={{ padding: "4px 10px", borderRadius: "6px", border: "none", backgroundColor: "var(--status-success)", color: "#FFFFFF", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdatePrompt(profile.id, pr.id, "flagged", "Prompt flagged for review")}
                        style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid #EC4899", backgroundColor: "transparent", color: "#EC4899", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                      >
                        Flag
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdatePrompt(profile.id, pr.id, "rejected", "Violates guidelines")}
                        style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid var(--status-error)", backgroundColor: "transparent", color: "var(--status-error)", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 7: PHOTOS & VIDEOS (MEDIA REVIEW CENTRE) */}
          {activeTab === "media" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "14.5px", fontWeight: 700, color: "var(--text-main)" }}>
                    Media Moderation Center
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    Click any photo or video preview to open policy enforcement actions
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "14px" }}>
                {profile.photos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => onOpenMediaModal(photo)}
                    style={{
                      height: "220px",
                      borderRadius: "14px",
                      overflow: "hidden",
                      border: "1px solid var(--border)",
                      position: "relative",
                      cursor: "pointer",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    <img src={photo.url} alt="Photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: "8px",
                        backgroundColor: "rgba(0,0,0,0.75)",
                        color: "#FFFFFF",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "11px", fontWeight: 700 }}>
                        {photo.isPrimary ? "Primary" : "Additional"}
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: "4px",
                          backgroundColor:
                            photo.reviewStatus === "approved"
                              ? "var(--status-success)"
                              : photo.reviewStatus === "pending"
                              ? "#F59E0B"
                              : "var(--status-error)",
                        }}
                      >
                        {photo.reviewStatus}
                      </span>
                    </div>
                  </div>
                ))}

                {profile.videos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => onOpenMediaModal(video)}
                    style={{
                      height: "220px",
                      borderRadius: "14px",
                      overflow: "hidden",
                      border: "1px solid var(--border)",
                      position: "relative",
                      cursor: "pointer",
                      backgroundColor: "#000",
                    }}
                  >
                    <video src={video.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        padding: "4px 8px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(0,0,0,0.6)",
                        color: "#FFFFFF",
                        fontSize: "11px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Video size={12} /> Video Prompt
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: VERIFICATION SAFEGUARDS */}
          {activeTab === "verification" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
                {/* Email */}
                <div style={{ padding: "14px", backgroundColor: "var(--bg-main)", borderRadius: "12px", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>Email Verification</div>
                  <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)", marginTop: "4px" }}>
                    {profile.verification.email.email}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--status-success)", fontWeight: 600, marginTop: "4px" }}>
                    Status: {profile.verification.email.status.toUpperCase()}
                  </div>
                </div>

                {/* Phone */}
                <div style={{ padding: "14px", backgroundColor: "var(--bg-main)", borderRadius: "12px", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>Phone Verification</div>
                  <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)", marginTop: "4px" }}>
                    {profile.verification.phone.phone}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--status-success)", fontWeight: 600, marginTop: "4px" }}>
                    Status: {profile.verification.phone.status.toUpperCase()}
                  </div>
                </div>

                {/* Photo Selfie */}
                <div
                  style={{
                    padding: "14px",
                    backgroundColor: "var(--bg-main)",
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    cursor: "pointer",
                  }}
                  onClick={() => onOpenVerificationModal("photo")}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>Photo / Selfie Biometrics</div>
                    <ChevronRight size={14} color="var(--primary)" />
                  </div>
                  <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)", marginTop: "4px" }}>
                    {profile.verification.photo.confidenceScore ? `${profile.verification.photo.confidenceScore}% Biometric Match` : "Review Selfie"}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--status-info)", fontWeight: 600, marginTop: "4px" }}>
                    Click to Inspect Comparison &rarr;
                  </div>
                </div>

                {/* Identity Document */}
                <div
                  style={{
                    padding: "14px",
                    backgroundColor: "var(--bg-main)",
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    cursor: "pointer",
                  }}
                  onClick={() => onOpenVerificationModal("identity")}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>Government ID Document</div>
                    <ChevronRight size={14} color="var(--primary)" />
                  </div>
                  <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)", marginTop: "4px" }}>
                    {profile.verification.identity.documentType ? profile.verification.identity.documentType.replace("_", " ") : "Identity Document"}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--status-info)", fontWeight: 600, marginTop: "4px" }}>
                    Click to Open Quarantined Viewer &rarr;
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: PROFILE QUALITY */}
          {activeTab === "quality" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", backgroundColor: "var(--bg-main)", borderRadius: "12px", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "36px", fontWeight: 800, color: "var(--primary)" }}>
                  {profile.completionPercentage}%
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)" }}>
                    Overall Profile Quality Rating
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    Calculated from bio depth, prompt engagement, photo quantity and verification levels.
                  </div>
                </div>
              </div>

              {profile.qualityBreakdown.missingSections.length > 0 && (
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>
                    Missing Profile Sections:
                  </div>
                  <ul style={{ paddingLeft: "20px", fontSize: "12.5px", color: "var(--text-secondary)" }}>
                    {profile.qualityBreakdown.missingSections.map((sec, i) => (
                      <li key={i}>{sec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB 10: VISIBILITY */}
          {activeTab === "visibility" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ padding: "16px", backgroundColor: "var(--bg-main)", borderRadius: "12px", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)" }}>
                  Current Visibility: <span style={{ color: "var(--primary)", textTransform: "capitalize" }}>{profile.visibility.replace("_", " ")}</span>
                </div>
                {profile.visibilityReason && (
                  <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "6px" }}>
                    <strong>Reason on File:</strong> {profile.visibilityReason}
                  </div>
                )}
                <button
                  type="button"
                  onClick={onOpenVisibilityModal}
                  style={{
                    marginTop: "12px",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "var(--primary)",
                    color: "#FFFFFF",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Change Profile Visibility
                </button>
              </div>

              {profile.visibility === "paused_by_user" && (
                <div style={{ padding: "12px", borderRadius: "10px", backgroundColor: "var(--status-info-bg)", color: "var(--status-info)", fontSize: "12.5px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Info size={16} />
                  <span>
                    This user has voluntarily paused discovery in their app. No policy sanctions are associated with this pause.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TAB 11: REPORTS & AUDIT HISTORY */}
          {activeTab === "reports" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
                  Community Safety Reports ({profile.reports.length})
                </div>
                {profile.reports.length === 0 ? (
                  <div style={{ padding: "20px", textAlign: "center", color: "var(--text-secondary)", backgroundColor: "var(--bg-main)", borderRadius: "10px" }}>
                    Zero reports filed against this profile.
                  </div>
                ) : (
                  profile.reports.map((rep) => (
                    <div
                      key={rep.id}
                      onClick={() => onOpenReportModal(rep)}
                      style={{
                        padding: "14px",
                        backgroundColor: "var(--bg-main)",
                        borderRadius: "10px",
                        border: "1px solid var(--border)",
                        marginBottom: "8px",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>
                          #{rep.id} &middot; {rep.category}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                          {rep.reason}
                        </div>
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--status-error)" }}>
                        {rep.status.toUpperCase()} &rarr;
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
                  Administrative Audit History Log
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {profile.historyLog.map((log) => (
                    <div
                      key={log.id}
                      style={{
                        padding: "10px 14px",
                        backgroundColor: "var(--bg-main)",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        fontSize: "12px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                        <span>{new Date(log.timestamp).toLocaleString()} &middot; {log.adminName}</span>
                        <strong style={{ color: "var(--text-main)" }}>{log.action}</strong>
                      </div>
                      <div style={{ color: "var(--text-main)", marginTop: "4px" }}>{log.details}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--border)",
            backgroundColor: "var(--bg-main)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            Profile created: {new Date(profile.createdAt).toLocaleDateString()} &middot; Last updated: {new Date(profile.updatedAt).toLocaleDateString()}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "9px 18px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-secondary)",
                fontWeight: 600,
                fontSize: "12.5px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
