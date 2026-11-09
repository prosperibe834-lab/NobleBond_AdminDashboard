// NobleBond Admin — Verification Review Modal
// Biometric photo match and quarantined government identity inspection, zero emojis

import React, { useState } from "react";
import { X, ShieldCheck, ShieldAlert, Check, FileText, Camera, AlertCircle } from "lucide-react";
import type { AdminProfile } from "../../../types/profileManagement.types";

interface VerificationReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AdminProfile | null;
  verifyType: "photo" | "identity";
  onDecision: (profileId: string, verifyType: "photo" | "identity", decision: "verified" | "rejected", notes: string) => void;
}

export const VerificationReviewModal: React.FC<VerificationReviewModalProps> = ({
  isOpen,
  onClose,
  profile,
  verifyType,
  onDecision,
}) => {
  if (!isOpen || !profile) return null;

  return (
    <VerificationReviewForm
      key={`${profile.id}_${verifyType}`}
      profile={profile}
      verifyType={verifyType}
      onClose={onClose}
      onDecision={onDecision}
    />
  );
};

interface VerificationReviewFormProps {
  profile: AdminProfile;
  verifyType: "photo" | "identity";
  onClose: () => void;
  onDecision: (profileId: string, verifyType: "photo" | "identity", decision: "verified" | "rejected", notes: string) => void;
}

const VerificationReviewForm: React.FC<VerificationReviewFormProps> = ({
  profile,
  verifyType,
  onClose,
  onDecision,
}) => {
  const [decision, setDecision] = useState<"verified" | "rejected">("verified");
  const [notes, setNotes] = useState("");

  const photoRecord = profile.verification.photo;
  const identityRecord = profile.verification.identity;

  const handleConfirm = () => {
    onDecision(
      profile.id,
      verifyType,
      decision,
      notes || (decision === "verified" ? "Verified by Super Admin" : "Failed verification standards")
    );
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
          maxWidth: "720px",
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
                backgroundColor: "rgba(59, 130, 246, 0.12)",
                color: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {verifyType === "photo" ? <Camera size={20} /> : <FileText size={20} />}
            </div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
                {verifyType === "photo" ? "Photo & Biometric Liveness Review" : "Government Identity Document Review"}
              </div>
              <div style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
                Member: <strong>{profile.fullName}</strong> ({profile.username})
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
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Quarantined Notice */}
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "10px",
              backgroundColor: "rgba(59, 130, 246, 0.08)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              fontSize: "12px",
              color: "#2563EB",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <AlertCircle size={16} />
            <span>
              Secure Identity Quarantine: Documents here are encrypted at rest and never shared with public member profiles.
            </span>
          </div>

          {verifyType === "photo" ? (
            /* Photo Comparison Section */
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)", marginBottom: "10px" }}>
                Facial Comparison: Profile Primary vs Live Selfie
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                {/* Primary Profile Photo */}
                <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", backgroundColor: "var(--bg-main)" }}>
                  <div style={{ height: "240px" }}>
                    <img
                      src={profile.avatar}
                      alt="Primary Photo"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ padding: "8px 12px", fontSize: "11.5px", fontWeight: 600, color: "var(--text-secondary)" }}>
                    Primary Dating Photo
                  </div>
                </div>

                {/* Live Selfie */}
                <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", backgroundColor: "var(--bg-main)" }}>
                  <div style={{ height: "240px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#0A0A0C" }}>
                    {photoRecord.selfieUrl ? (
                      <img
                        src={photoRecord.selfieUrl}
                        alt="Live Selfie"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <span style={{ fontSize: "12px", color: "#888888" }}>No selfie file attached</span>
                    )}
                  </div>
                  <div style={{ padding: "8px 12px", fontSize: "11.5px", fontWeight: 600, color: "var(--text-secondary)", display: "flex", justifyContent: "space-between" }}>
                    <span>Live Biometric Selfie</span>
                    {photoRecord.confidenceScore && (
                      <span style={{ color: "var(--status-success)", fontWeight: 700 }}>
                        {photoRecord.confidenceScore}% Match
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Identity Document Section */
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)", marginBottom: "10px" }}>
                Document Inspection
              </div>
              <div
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  backgroundColor: "var(--bg-main)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  fontSize: "12.5px",
                }}
              >
                <div>
                  <strong>Document Type:</strong>{" "}
                  <span style={{ textTransform: "capitalize" }}>
                    {identityRecord.documentType ? identityRecord.documentType.replace("_", " ") : "Not provided"}
                  </span>
                </div>
                <div>
                  <strong>Document Number:</strong> {identityRecord.documentNumberMasked || "Masked for security"}
                </div>
                {identityRecord.expiryDate && (
                  <div>
                    <strong>Document Expiry:</strong> {identityRecord.expiryDate}
                  </div>
                )}
                {identityRecord.documentFrontUrl && (
                  <div style={{ height: "200px", borderRadius: "8px", overflow: "hidden", marginTop: "8px" }}>
                    <img
                      src={identityRecord.documentFrontUrl}
                      alt="ID Document"
                      style={{ width: "100%", height: "100%", objectFit: "contain", backgroundColor: "#000" }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Decision Buttons */}
          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "8px" }}>
              Administrator Decision
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setDecision("verified")}
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  border: decision === "verified" ? "2px solid var(--status-success)" : "1px solid var(--border)",
                  backgroundColor: decision === "verified" ? "var(--status-success-bg)" : "var(--bg-main)",
                  color: decision === "verified" ? "var(--status-success)" : "var(--text-main)",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <Check size={16} /> Approve & Verify
              </button>

              <button
                type="button"
                onClick={() => setDecision("rejected")}
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  border: decision === "rejected" ? "2px solid var(--status-error)" : "1px solid var(--border)",
                  backgroundColor: decision === "rejected" ? "var(--status-error-bg)" : "var(--bg-main)",
                  color: decision === "rejected" ? "var(--status-error)" : "var(--text-main)",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <ShieldAlert size={16} /> Reject Submission
              </button>
            </div>
          </div>

          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "6px" }}>
              Notes & Verification Log
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Verified official national passport against government database records."
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
            onClick={handleConfirm}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: decision === "verified" ? "var(--status-success)" : "var(--status-error)",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <ShieldCheck size={16} />
            Submit Decision
          </button>
        </div>
      </div>
    </div>
  );
};

