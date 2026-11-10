// NobleBond Admin — Specific Flagged Message Moderation Modal
// Contextual message inspection, surrounding context, policy enforcement, zero emojis

import React, { useState } from "react";
import {
  X,
  ShieldAlert,
  Lock,
  Trash2,
} from "lucide-react";
import type { ReportedMessage } from "../../../types/chatManagement.types";

interface MessageModerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: ReportedMessage | null;
  onResolve: (reportId: string, action: string, notes: string) => void;
  onDismiss: (reportId: string, notes: string) => void;
  onOpenRestrictModal: (userId: string, userName: string) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const MessageModerationModal: React.FC<MessageModerationModalProps> = ({
  isOpen,
  onClose,
  message,
  onResolve,
  onDismiss,
  onOpenRestrictModal,
  onOpenUserProfile,
}) => {
  const [notes, setNotes] = useState("");
  const [revealMedia, setRevealMedia] = useState(false);

  if (!isOpen || !message) return null;

  const reportedDate = new Date(message.reportedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleResolve = (action: string) => {
    onResolve(message.id, action, notes);
    onClose();
  };

  const handleDismiss = () => {
    onDismiss(message.id, notes || "Report dismissed: Message within acceptable community standards.");
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
          maxWidth: "600px",
          maxHeight: "90vh",
          backgroundColor: "var(--bg-card)",
          borderRadius: "18px",
          border: "1px solid var(--border)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "var(--bg-surface)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: "rgba(147, 51, 234, 0.12)",
                color: "#9333EA",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldAlert size={20} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
                  Message Review: {message.id}
                </h3>
                <span
                  style={{
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "10px",
                    fontWeight: 800,
                    backgroundColor: "rgba(220, 38, 38, 0.15)",
                    color: "#DC2626",
                    textTransform: "uppercase",
                  }}
                >
                  {message.priority}
                </span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                Thread: {message.conversationId} &bull; {reportedDate}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "6px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          {/* Parties */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", backgroundColor: "var(--bg-surface)", borderRadius: "12px", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }} onClick={() => onOpenUserProfile?.(message.sender.id)}>
              <img src={message.sender.avatar} alt={message.sender.name} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Sender:</span>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--status-error)" }}>{message.sender.name}</div>
              </div>
            </div>

            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>&rarr;</div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }} onClick={() => onOpenUserProfile?.(message.recipient.id)}>
              <img src={message.recipient.avatar} alt={message.recipient.name} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Recipient:</span>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>{message.recipient.name}</div>
              </div>
            </div>
          </div>

          {/* Context View: Preceding Message */}
          {message.contextPreview?.prevMessage && (
            <div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                Preceding Context
              </span>
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  backgroundColor: "var(--bg-surface)",
                  fontSize: "12.5px",
                  color: "var(--text-secondary)",
                  marginTop: "4px",
                }}
              >
                {message.contextPreview.prevMessage}
              </div>
            </div>
          )}

          {/* The Flagged Message Itself */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#DC2626", textTransform: "uppercase" }}>
                Reported Message Content
              </span>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "capitalize" }}>
                Type: {message.messageType}
              </span>
            </div>

            <div
              style={{
                padding: "14px 16px",
                borderRadius: "12px",
                backgroundColor: "rgba(220, 38, 38, 0.06)",
                border: "1.5px solid rgba(220, 38, 38, 0.3)",
                fontSize: "13.5px",
                fontWeight: 600,
                color: "var(--text-main)",
                lineHeight: 1.5,
              }}
            >
              &ldquo;{message.flaggedContent}&rdquo;

              {message.mediaUrl && (
                <div style={{ marginTop: "12px" }}>
                  <img
                    src={message.mediaUrl}
                    alt="Flagged media attachment"
                    style={{
                      maxHeight: "180px",
                      borderRadius: "8px",
                      objectFit: "cover",
                      filter: revealMedia ? "none" : "blur(14px)",
                      cursor: "pointer",
                    }}
                    onClick={() => setRevealMedia(!revealMedia)}
                  />
                  <button
                    type="button"
                    onClick={() => setRevealMedia(!revealMedia)}
                    style={{
                      display: "block",
                      marginTop: "6px",
                      background: "none",
                      border: "none",
                      fontSize: "11px",
                      color: "var(--primary)",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {revealMedia ? "Hide Media Preview" : "Reveal Media Preview"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Context View: Following Message */}
          {message.contextPreview?.nextMessage && (
            <div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                Following Context
              </span>
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  backgroundColor: "var(--bg-surface)",
                  fontSize: "12.5px",
                  color: "var(--text-secondary)",
                  marginTop: "4px",
                }}
              >
                {message.contextPreview.nextMessage}
              </div>
            </div>
          )}

          {/* Notes Input */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>
              Moderation Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Offensive link identified; removed from recipient delivery queue."
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "13px",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "18px 24px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
            backgroundColor: "var(--bg-surface)",
          }}
        >
          <button
            type="button"
            onClick={handleDismiss}
            style={{
              padding: "10px 16px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-secondary)",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Dismiss Flag
          </button>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={() => handleResolve("Message Quarantined & Warning Sent")}
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid rgba(220, 38, 38, 0.4)",
                backgroundColor: "rgba(220, 38, 38, 0.08)",
                color: "#DC2626",
                fontSize: "12.5px",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Trash2 size={14} /> Quarantine Message
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenRestrictModal(message.sender.id, message.sender.name);
              }}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#DC2626",
                color: "#ffffff",
                fontSize: "12.5px",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Lock size={14} /> Restrict Sender
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
