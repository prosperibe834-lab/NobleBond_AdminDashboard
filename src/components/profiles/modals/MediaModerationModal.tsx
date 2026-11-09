// NobleBond Admin — Media Moderation & Policy Rejection Modal
// 10 standardized policy rejection categories, replacement request, and visual inspector

import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  Camera,
  Video,
} from "lucide-react";
import type {
  AdminProfile,
  MediaItem,
  MediaRejectionCategory,
} from "../../../types/profileManagement.types";

interface MediaModerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AdminProfile | null;
  mediaItem: MediaItem | null;
  onApprove: (profileId: string, mediaId: string) => void;
  onReject: (profileId: string, mediaId: string, category: MediaRejectionCategory, reason: string) => void;
  onRequestReplacement: (profileId: string, mediaId: string, reason: string) => void;
  onFlag: (profileId: string, mediaId: string, reason: string) => void;
}

export const MediaModerationModal: React.FC<MediaModerationModalProps> = ({
  isOpen,
  onClose,
  profile,
  mediaItem,
  onApprove,
  onReject,
  onRequestReplacement,
  onFlag,
}) => {
  if (!isOpen || !profile || !mediaItem) return null;

  return (
    <MediaModerationForm
      key={`${profile.id}_${mediaItem.id}`}
      profile={profile}
      mediaItem={mediaItem}
      onClose={onClose}
      onApprove={onApprove}
      onReject={onReject}
      onRequestReplacement={onRequestReplacement}
      onFlag={onFlag}
    />
  );
};

interface MediaModerationFormProps {
  profile: AdminProfile;
  mediaItem: MediaItem;
  onClose: () => void;
  onApprove: (profileId: string, mediaId: string) => void;
  onReject: (profileId: string, mediaId: string, category: MediaRejectionCategory, reason: string) => void;
  onRequestReplacement: (profileId: string, mediaId: string, reason: string) => void;
  onFlag: (profileId: string, mediaId: string, reason: string) => void;
}

const MediaModerationForm: React.FC<MediaModerationFormProps> = ({
  profile,
  mediaItem,
  onClose,
  onApprove,
  onReject,
  onRequestReplacement,
  onFlag,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MediaRejectionCategory>(
    mediaItem.rejectionCategory || "low_quality"
  );
  const [reasonText, setReasonText] = useState(mediaItem.rejectionReason || "");
  const [activeAction, setActiveAction] = useState<"approve" | "reject" | "replace" | "flag">("approve");

  const policyCategories: Array<{ id: MediaRejectionCategory; label: string; desc: string }> = [
    {
      id: "explicit_sexual_content",
      label: "Explicit / Prohibited Sexual Content",
      desc: "Sexually suggestive, pornography, or prohibited intimacy content.",
    },
    {
      id: "nudity",
      label: "Nudity or Partial Nudity",
      desc: "Exposed private areas or underwear posing contrary to guidelines.",
    },
    {
      id: "violence",
      label: "Violence or Dangerous Content",
      desc: "Weapons, gore, self-harm, or dangerous criminal activities.",
    },
    {
      id: "hate_discriminatory",
      label: "Hate Speech or Discriminatory Content",
      desc: "Symbols, gestures, or slurs attacking protected groups.",
    },
    {
      id: "impersonation",
      label: "Impersonation or Celebrity Image",
      desc: "Belongs to a public figure, celebrity, or stolen Instagram persona.",
    },
    {
      id: "fake_misleading",
      label: "Fake or Misleading Photo / Filter Abuse",
      desc: "Excessive morphing, cartoon filters, or non-representative AI rendering.",
    },
    {
      id: "spam_advertising",
      label: "Spam or Commercial Promotion",
      desc: "External website URLs, cash tags, product promo, or flyer ads.",
    },
    {
      id: "copyright_concern",
      label: "Copyright or Stock Photo Concern",
      desc: "Watermarked stock photography, Getty/iStock, or unoriginal media.",
    },
    {
      id: "low_quality",
      label: "Low Quality, Blurry or Unusable",
      desc: "Excessive compression, blurred face, dark lighting, or cropped out features.",
    },
    {
      id: "other_policy_violation",
      label: "Other Policy Violation",
      desc: "General terms of service violation not categorized above.",
    },
  ];

  const handleExecute = () => {
    if (activeAction === "approve") {
      onApprove(profile.id, mediaItem.id);
    } else if (activeAction === "reject") {
      onReject(profile.id, mediaItem.id, selectedCategory, reasonText || "Violates community policy");
    } else if (activeAction === "replace") {
      onRequestReplacement(profile.id, mediaItem.id, reasonText || "Please upload a clearer portrait");
    } else if (activeAction === "flag") {
      onFlag(profile.id, mediaItem.id, reasonText || "Flagged for second moderator inspection");
    }
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
          maxWidth: "860px",
          maxHeight: "92vh",
          backgroundColor: "var(--bg-card)",
          borderRadius: "20px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-xl)",
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
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: "rgba(139, 29, 65, 0.1)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {mediaItem.type === "video" ? <Video size={20} /> : <Camera size={20} />}
            </div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
                Media Policy & Moderation Review
              </div>
              <div style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
                Member: <strong>{profile.fullName}</strong> ({profile.username}) &middot; ID: {mediaItem.id}
              </div>
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
              borderRadius: "6px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body: Split view (Left: Media preview, Right: Decision panel) */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "grid",
            gridTemplateColumns: "1fr 1.1fr",
            gap: "20px",
            padding: "24px",
          }}
        >
          {/* Left Column: Visual Media Display */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                height: "380px",
                backgroundColor: "#0A0A0C",
                borderRadius: "14px",
                overflow: "hidden",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              {mediaItem.type === "video" ? (
                <video
                  src={mediaItem.url}
                  controls
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              ) : (
                <img
                  src={mediaItem.url}
                  alt="Profile Media Review"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              )}

              {mediaItem.isPrimary && (
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    padding: "4px 8px",
                    borderRadius: "6px",
                    backgroundColor: "rgba(0,0,0,0.75)",
                    color: "#FFFFFF",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  Primary Profile Photo
                </div>
              )}
            </div>

            <div
              style={{
                padding: "12px",
                backgroundColor: "var(--bg-main)",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                fontSize: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                color: "var(--text-secondary)",
              }}
            >
              <div>
                <strong>Uploaded:</strong> {new Date(mediaItem.uploadDate).toLocaleString()}
              </div>
              {mediaItem.dimensions && (
                <div>
                  <strong>Resolution:</strong> {mediaItem.dimensions}
                </div>
              )}
              {mediaItem.fileSize && (
                <div>
                  <strong>Size:</strong> {mediaItem.fileSize}
                </div>
              )}
              <div>
                <strong>Current Status:</strong>{" "}
                <span style={{ textTransform: "uppercase", fontWeight: 700, color: "var(--text-main)" }}>
                  {mediaItem.reviewStatus}
                </span>
              </div>
              {mediaItem.flags && mediaItem.flags.length > 0 && (
                <div style={{ color: "#EC4899", fontWeight: 600 }}>
                  <strong>AI Flags:</strong> {mediaItem.flags.join(", ")}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Moderation Decision Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "8px" }}>
                Select Decision Action
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setActiveAction("approve")}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: activeAction === "approve" ? "2px solid var(--status-success)" : "1px solid var(--border)",
                    backgroundColor: activeAction === "approve" ? "var(--status-success-bg)" : "var(--bg-main)",
                    color: activeAction === "approve" ? "var(--status-success)" : "var(--text-main)",
                    fontWeight: 700,
                    fontSize: "12.5px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <CheckCircle2 size={15} /> Approve
                </button>

                <button
                  type="button"
                  onClick={() => setActiveAction("reject")}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: activeAction === "reject" ? "2px solid var(--status-error)" : "1px solid var(--border)",
                    backgroundColor: activeAction === "reject" ? "var(--status-error-bg)" : "var(--bg-main)",
                    color: activeAction === "reject" ? "var(--status-error)" : "var(--text-main)",
                    fontWeight: 700,
                    fontSize: "12.5px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <ShieldAlert size={15} /> Reject
                </button>

                <button
                  type="button"
                  onClick={() => setActiveAction("replace")}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: activeAction === "replace" ? "2px solid #F59E0B" : "1px solid var(--border)",
                    backgroundColor: activeAction === "replace" ? "rgba(245, 158, 11, 0.12)" : "var(--bg-main)",
                    color: activeAction === "replace" ? "#F59E0B" : "var(--text-main)",
                    fontWeight: 700,
                    fontSize: "12.5px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <RotateCcw size={15} /> Request Replacement
                </button>

                <button
                  type="button"
                  onClick={() => setActiveAction("flag")}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: activeAction === "flag" ? "2px solid #EC4899" : "1px solid var(--border)",
                    backgroundColor: activeAction === "flag" ? "rgba(236, 72, 153, 0.12)" : "var(--bg-main)",
                    color: activeAction === "flag" ? "#EC4899" : "var(--text-main)",
                    fontWeight: 700,
                    fontSize: "12.5px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <AlertTriangle size={15} /> Flag for Lead
                </button>
              </div>
            </div>

            {/* Rejection Policy Categories (when Reject is selected) */}
            {activeAction === "reject" && (
              <div className="animate-fade-in">
                <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "6px" }}>
                  Standard Policy Rejection Category
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "190px", overflowY: "auto", paddingRight: "4px" }}>
                  {policyCategories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      style={{
                        padding: "8px 10px",
                        borderRadius: "8px",
                        border: selectedCategory === cat.id ? "1.5px solid var(--status-error)" : "1px solid var(--border)",
                        backgroundColor: selectedCategory === cat.id ? "var(--status-error-bg)" : "var(--bg-main)",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ fontSize: "12px", fontWeight: 700, color: selectedCategory === cat.id ? "var(--status-error)" : "var(--text-main)" }}>
                        {cat.label}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                        {cat.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reason explanation textarea */}
            <div>
              <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "6px" }}>
                {activeAction === "approve"
                  ? "Approval Note (Optional)"
                  : activeAction === "replace"
                  ? "In-App Guidance Message to User"
                  : "Administrative Policy Explanation"}
              </label>
              <textarea
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                placeholder={
                  activeAction === "replace"
                    ? "e.g. Please upload an unedited front-facing photo without heavy filter smoothing."
                    : activeAction === "reject"
                    ? "Explain why this image violates the specified policy..."
                    : "Notes for moderation audit trail..."
                }
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-main)",
                  color: "var(--text-main)",
                  fontSize: "12.5px",
                  resize: "vertical",
                }}
              />
            </div>
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
            onClick={handleExecute}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor:
                activeAction === "approve"
                  ? "var(--status-success)"
                  : activeAction === "reject"
                  ? "var(--status-error)"
                  : "var(--primary)",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Confirm Decision
          </button>
        </div>
      </div>
    </div>
  );
};

