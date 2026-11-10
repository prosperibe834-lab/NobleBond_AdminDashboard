// NobleBond Admin — Media & Attachments Moderation Gallery
// Safe preview controls, sensitivity blur protection, quarantine and approve actions, zero emojis

import React, { useState } from "react";
import {
  Image as ImageIcon,
  ShieldCheck,
  ShieldAlert,
  Eye,
  EyeOff,
  AlertTriangle,
  Lock,
  CheckCircle2,
} from "lucide-react";
import type { MediaAttachmentItem } from "../../types/chatManagement.types";

interface MediaAttachmentsSectionProps {
  mediaItems: MediaAttachmentItem[];
  onQuarantine: (mediaId: string, reason: string) => void;
  onApprove: (mediaId: string) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const MediaAttachmentsSection: React.FC<MediaAttachmentsSectionProps> = ({
  mediaItems,
  onQuarantine,
  onApprove,
  onOpenUserProfile,
}) => {
  // Revealed sensitive images map (to protect moderator eyes by default)
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getStatusBadge = (status: MediaAttachmentItem["moderationStatus"]) => {
    switch (status) {
      case "clean":
        return (
          <span
            style={{
              padding: "2px 7px",
              borderRadius: "5px",
              fontSize: "10.5px",
              fontWeight: 700,
              backgroundColor: "rgba(16, 185, 129, 0.12)",
              color: "var(--status-success)",
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <CheckCircle2 size={11} /> Clean
          </span>
        );
      case "flagged":
        return (
          <span
            style={{
              padding: "2px 7px",
              borderRadius: "5px",
              fontSize: "10.5px",
              fontWeight: 700,
              backgroundColor: "rgba(245, 158, 11, 0.12)",
              color: "#D97706",
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <AlertTriangle size={11} /> Flagged
          </span>
        );
      case "quarantined":
        return (
          <span
            style={{
              padding: "2px 7px",
              borderRadius: "5px",
              fontSize: "10.5px",
              fontWeight: 800,
              backgroundColor: "rgba(220, 38, 38, 0.12)",
              color: "#DC2626",
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <Lock size={11} /> Quarantined
          </span>
        );
      case "approved":
        return (
          <span
            style={{
              padding: "2px 7px",
              borderRadius: "5px",
              fontSize: "10.5px",
              fontWeight: 700,
              backgroundColor: "rgba(37, 99, 235, 0.12)",
              color: "#2563EB",
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <ShieldCheck size={11} /> Approved
          </span>
        );
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Privacy Notice Banner */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 18px",
          backgroundColor: "rgba(37, 99, 235, 0.06)",
          border: "1px solid rgba(37, 99, 235, 0.2)",
          borderRadius: "12px",
          color: "var(--status-info)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <ShieldAlert size={18} />
          <span style={{ fontSize: "12.5px" }}>
            <strong>Moderation Safe View:</strong> Sensitive or reported media is blurred by default. Reveal only when actively conducting safety review.
          </span>
        </div>
        <span style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--text-secondary)" }}>
          {mediaItems.length} attachments logged
        </span>
      </div>

      {/* Grid of Media Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {mediaItems.length === 0 ? (
          <div
            style={{
              gridColumn: "1 / -1",
              padding: "48px 24px",
              textAlign: "center",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              color: "var(--text-secondary)",
            }}
          >
            <ImageIcon size={32} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
            <div style={{ fontSize: "14.5px", fontWeight: 700 }}>No media attachments found</div>
          </div>
        ) : (
          mediaItems.map((item) => {
            const isRevealed = !item.isSensitive || !!revealedIds[item.id];
            const formattedDate = new Date(item.uploadedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: item.moderationStatus === "quarantined"
                    ? "1.5px solid rgba(220, 38, 38, 0.4)"
                    : "1px solid var(--border)",
                  borderRadius: "14px",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.15s ease",
                }}
              >
                {/* Media Preview Box */}
                <div
                  style={{
                    height: "170px",
                    position: "relative",
                    backgroundColor: "var(--bg-surface)",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={item.url}
                    alt={item.fileName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: isRevealed ? "none" : "blur(18px)",
                      transition: "filter 0.25s ease",
                    }}
                  />

                  {/* Sensitive Shield Overlay if not revealed */}
                  {!isRevealed && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      <AlertTriangle size={24} style={{ color: "#F59E0B" }} />
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#ffffff" }}>
                        Sensitive Media Flagged
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleReveal(item.id)}
                        style={{
                          padding: "5px 12px",
                          borderRadius: "6px",
                          border: "none",
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          color: "#111827",
                          fontSize: "11.5px",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Eye size={12} /> Reveal Preview
                      </button>
                    </div>
                  )}

                  {/* Toggle Blur button when revealed */}
                  {item.isSensitive && isRevealed && (
                    <button
                      type="button"
                      onClick={() => toggleReveal(item.id)}
                      title="Hide sensitive preview"
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        padding: "5px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        color: "#ffffff",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <EyeOff size={13} />
                    </button>
                  )}

                  {/* Status Badge in Corner */}
                  <div style={{ position: "absolute", top: "8px", left: "8px" }}>
                    {getStatusBadge(item.moderationStatus)}
                  </div>
                </div>

                {/* Card Details */}
                <div style={{ padding: "14px", flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div>
                    <div
                      style={{
                        fontSize: "12.5px",
                        fontWeight: 700,
                        color: "var(--text-main)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={item.fileName}
                    >
                      {item.fileName}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                      {formatFileSize(item.fileSizeBytes)} &bull; {formattedDate}
                    </div>
                  </div>

                  {/* Sender & Thread */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 10px",
                      borderRadius: "8px",
                      backgroundColor: "var(--bg-surface)",
                      fontSize: "11.5px",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
                      onClick={() => onOpenUserProfile?.(item.sender.id)}
                    >
                      <img
                        src={item.sender.avatar}
                        alt={item.sender.name}
                        style={{ width: "20px", height: "20px", borderRadius: "50%", objectFit: "cover" }}
                      />
                      <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{item.sender.name}</span>
                    </div>
                    <span style={{ color: "var(--text-muted)", fontFamily: "monospace" }}>
                      {item.conversationId}
                    </span>
                  </div>

                  {item.flagReason && (
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--status-error)",
                        padding: "4px 8px",
                        backgroundColor: "var(--status-error-bg)",
                        borderRadius: "6px",
                        lineHeight: 1.3,
                      }}
                    >
                      Reason: {item.flagReason}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div
                    style={{
                      marginTop: "auto",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      borderTop: "1px solid var(--border)",
                      paddingTop: "10px",
                    }}
                  >
                    {item.moderationStatus !== "quarantined" ? (
                      <button
                        type="button"
                        onClick={() => onQuarantine(item.id, "Violation of media content policy")}
                        style={{
                          flex: 1,
                          padding: "6px 10px",
                          borderRadius: "8px",
                          border: "1px solid rgba(220, 38, 38, 0.3)",
                          backgroundColor: "rgba(220, 38, 38, 0.08)",
                          color: "#DC2626",
                          fontSize: "11.5px",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px",
                        }}
                      >
                        <Lock size={12} /> Quarantine
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onApprove(item.id)}
                        style={{
                          flex: 1,
                          padding: "6px 10px",
                          borderRadius: "8px",
                          border: "1px solid rgba(16, 185, 129, 0.3)",
                          backgroundColor: "rgba(16, 185, 129, 0.08)",
                          color: "var(--status-success)",
                          fontSize: "11.5px",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px",
                        }}
                      >
                        <ShieldCheck size={12} /> Unquarantine
                      </button>
                    )}

                    {item.moderationStatus !== "approved" && (
                      <button
                        type="button"
                        onClick={() => onApprove(item.id)}
                        style={{
                          flex: 1,
                          padding: "6px 10px",
                          borderRadius: "8px",
                          border: "1px solid var(--border)",
                          backgroundColor: "var(--bg-surface)",
                          color: "var(--text-main)",
                          fontSize: "11.5px",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px",
                        }}
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
