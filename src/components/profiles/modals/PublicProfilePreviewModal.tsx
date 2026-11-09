// NobleBond Admin — Public Profile Preview Modal
// Mobile-style dating profile simulator, strictly hiding private contact info, zero emojis

import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import type { AdminProfile } from "../../../types/profileManagement.types";
import { calculateAge } from "../../../data/profileManagementDataService";

interface PublicProfilePreviewModalProps {
  profile: AdminProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PublicProfilePreviewModal: React.FC<PublicProfilePreviewModalProps> = ({
  profile,
  isOpen,
  onClose,
}) => {
  const [photoIndex, setPhotoIndex] = useState(0);

  if (!isOpen || !profile) return null;

  const age = calculateAge(profile.dateOfBirth);
  const approvedPhotos = profile.photos.filter((p) => p.reviewStatus === "approved");
  const photosList = approvedPhotos.length > 0 ? approvedPhotos : profile.photos;
  const currentPhoto = photosList[photoIndex] || { url: profile.avatar };
  const isVerified = profile.verification.overallStatus === "verified";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(6px)",
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
          maxWidth: "420px",
          height: "90vh",
          maxHeight: "840px",
          backgroundColor: "#0D0A10",
          borderRadius: "36px",
          border: "4px solid #2D2535",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
          color: "#FFFFFF",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Phone Speaker Notch / Status bar */}
        <div
          style={{
            position: "absolute",
            top: 8,
            left: "50%",
            transform: "translateX(-50%)",
            width: "110px",
            height: "22px",
            backgroundColor: "#1A1520",
            borderRadius: "12px",
            zIndex: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "40px", height: "4px", backgroundColor: "#332B3D", borderRadius: "2px" }} />
        </div>

        {/* Top Controls Header */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 16,
            right: 16,
            zIndex: 25,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              padding: "4px 10px",
              borderRadius: "14px",
              backgroundColor: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
              fontSize: "11px",
              fontWeight: 700,
              color: "#E2D9E8",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Eye size={12} color="#F43F5E" />
            Member View
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
              border: "none",
              color: "#FFFFFF",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable dating card container */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Main Photo Stage */}
          <div style={{ height: "460px", position: "relative", flexShrink: 0, backgroundColor: "#1A1520" }}>
            <img
              src={currentPhoto.url}
              alt={profile.fullName}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

            {/* Photo pagination bars at top */}
            {photosList.length > 1 && (
              <div
                style={{
                  position: "absolute",
                  top: 48,
                  left: 16,
                  right: 16,
                  display: "flex",
                  gap: "4px",
                  zIndex: 10,
                }}
              >
                {photosList.map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      height: "3px",
                      borderRadius: "2px",
                      backgroundColor: idx === photoIndex ? "#FFFFFF" : "rgba(255,255,255,0.35)",
                    }}
                  />
                ))}
              </div>
            )}

            {/* Navigation click zones */}
            {photosList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setPhotoIndex((prev) => (prev > 0 ? prev - 1 : photosList.length - 1))}
                  style={{
                    position: "absolute",
                    left: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(0,0,0,0.4)",
                    border: "none",
                    color: "#FFFFFF",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 15,
                  }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoIndex((prev) => (prev < photosList.length - 1 ? prev + 1 : 0))}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(0,0,0,0.4)",
                    border: "none",
                    color: "#FFFFFF",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 15,
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Stage bottom gradient with main bio intro */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "32px 18px 14px",
                background: "linear-gradient(to top, rgba(13,10,16,1) 0%, rgba(13,10,16,0.8) 60%, transparent 100%)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "24px", fontWeight: 800 }}>{profile.fullName}</span>
                <span style={{ fontSize: "22px", fontWeight: 400, opacity: 0.85 }}>{age}</span>
                {isVerified && (
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: "#2563EB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    title="Verified Member"
                  >
                    <ShieldCheck size={13} color="#FFFFFF" />
                  </div>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#C4B5CD", marginTop: "4px" }}>
                <MapPin size={13} />
                <span>
                  {profile.city}, {profile.country}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Details Content Body */}
          <div style={{ padding: "16px 18px 30px", display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Meta info tags */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#E2D9E8" }}>
              {profile.occupation && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Briefcase size={14} color="#F43F5E" />
                  <span>{profile.occupation}</span>
                </div>
              )}
              {profile.education && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <GraduationCap size={14} color="#F43F5E" />
                  <span>{profile.education}</span>
                </div>
              )}
            </div>

            {/* Relationship goal tag */}
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "14px",
                backgroundColor: "rgba(244, 63, 94, 0.12)",
                border: "1px solid rgba(244, 63, 94, 0.25)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Heart size={16} color="#F43F5E" />
              <div>
                <div style={{ fontSize: "11px", color: "#F43F5E", fontWeight: 700, textTransform: "uppercase" }}>
                  Looking for
                </div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF" }}>
                  {profile.datingPreferences.relationshipGoals}
                </div>
              </div>
            </div>

            {/* About Me */}
            {profile.bio && (
              <div
                style={{
                  padding: "14px",
                  borderRadius: "14px",
                  backgroundColor: "#191420",
                  border: "1px solid #2D2535",
                }}
              >
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#9B8FA8", marginBottom: "6px" }}>
                  About Me
                </div>
                <div style={{ fontSize: "13.5px", lineHeight: "1.5", color: "#F1EBF5" }}>
                  {profile.bio}
                </div>
              </div>
            )}

            {/* Profile Prompts */}
            {profile.prompts.map((prompt) => (
              <div
                key={prompt.id}
                style={{
                  padding: "14px",
                  borderRadius: "14px",
                  backgroundColor: "#191420",
                  border: "1px solid #2D2535",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#F43F5E" }}>
                  {prompt.question}
                </div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#FFFFFF", lineHeight: "1.4" }}>
                  {prompt.answer}
                </div>
              </div>
            ))}

            {/* Interests Chips */}
            {profile.interests.length > 0 && (
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#9B8FA8", marginBottom: "8px" }}>
                  Passions & Interests
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {profile.interests.map((interest, i) => (
                    <span
                      key={i}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "20px",
                        backgroundColor: "#191420",
                        border: "1px solid #2D2535",
                        fontSize: "12px",
                        color: "#E2D9E8",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Sparkles size={11} color="#F43F5E" />
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Safe Notice */}
            <div
              style={{
                padding: "10px",
                borderRadius: "10px",
                backgroundColor: "rgba(255,255,255,0.04)",
                fontSize: "11px",
                color: "#8B7F98",
                textAlign: "center",
                marginTop: "10px",
              }}
            >
              Contact info, email, phone, IP and admin notes are private and never visible to other users.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

