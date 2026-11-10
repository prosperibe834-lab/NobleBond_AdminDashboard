// NobleBond Admin — Conversation Detail Operational Drawer
// Full thread metadata inspector with privacy boundary enforcement, zero emojis

import React from "react";
import {
  X,
  MessageSquare,
  Lock,
  Archive,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import type { ConversationRecord } from "../../../types/chatManagement.types";

interface ConversationDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: ConversationRecord | null;
  onToggleArchive: (conversationId: string) => void;
  onOpenRestrictModal: (conversation: ConversationRecord) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const ConversationDetailDrawer: React.FC<ConversationDetailDrawerProps> = ({
  isOpen,
  onClose,
  conversation,
  onToggleArchive,
  onOpenRestrictModal,
  onOpenUserProfile,
}) => {
  if (!isOpen || !conversation) return null;

  const startedDate = new Date(conversation.startedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const lastMsgDate = new Date(conversation.lastMessageAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        className="animate-slide-in-right"
        style={{
          width: "100%",
          maxWidth: "520px",
          height: "100%",
          backgroundColor: "var(--bg-card)",
          boxShadow: "-8px 0 24px rgba(0,0,0,0.15)",
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
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "8px",
                backgroundColor: "rgba(139, 29, 65, 0.1)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MessageSquare size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
                Thread Telemetry: {conversation.id}
              </h3>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Match reference: {conversation.matchId}
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
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Privacy Protocol Alert */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              backgroundColor: "rgba(37, 99, 235, 0.08)",
              border: "1px solid rgba(37, 99, 235, 0.25)",
              color: "var(--status-info)",
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
            }}
          >
            <Lock size={17} style={{ marginTop: "2px", flexShrink: 0 }} />
            <div style={{ fontSize: "12.5px", lineHeight: 1.4 }}>
              <strong>Privacy Protocol Active:</strong> Administrator access to raw unflagged direct message logs is disabled under NobleBond Data Protection Policy. Only operational metrics, delivery timestamps, and explicitly reported messages can be investigated.
            </div>
          </div>

          {/* Paired Participants */}
          <div>
            <h4 style={{ fontSize: "12.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-secondary)", marginBottom: "12px" }}>
              Matched Participants
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {/* Participant 1 */}
              <div
                style={{
                  padding: "14px",
                  borderRadius: "12px",
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: "8px",
                }}
              >
                <img
                  src={conversation.participant1.avatar}
                  alt={conversation.participant1.name}
                  style={{ width: "54px", height: "54px", borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)" }}>
                    {conversation.participant1.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {conversation.participant1.username}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    {conversation.participant1.city}, {conversation.participant1.country}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenUserProfile?.(conversation.participant1.id)}
                  style={{
                    marginTop: "4px",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--bg-card)",
                    color: "var(--text-main)",
                    fontSize: "11px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  Profile <ExternalLink size={10} />
                </button>
              </div>

              {/* Participant 2 */}
              <div
                style={{
                  padding: "14px",
                  borderRadius: "12px",
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: "8px",
                }}
              >
                <img
                  src={conversation.participant2.avatar}
                  alt={conversation.participant2.name}
                  style={{ width: "54px", height: "54px", borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)" }}>
                    {conversation.participant2.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {conversation.participant2.username}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    {conversation.participant2.city}, {conversation.participant2.country}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenUserProfile?.(conversation.participant2.id)}
                  style={{
                    marginTop: "4px",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--bg-card)",
                    color: "var(--text-main)",
                    fontSize: "11px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  Profile <ExternalLink size={10} />
                </button>
              </div>
            </div>
          </div>

          {/* Operational Metrics */}
          <div>
            <h4 style={{ fontSize: "12.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-secondary)", marginBottom: "12px" }}>
              Operational Thread Metrics
            </h4>

            <div
              style={{
                backgroundColor: "var(--bg-surface)",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                padding: "16px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
              }}
            >
              <div>
                <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>Total Messages Sent</span>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)" }}>
                  {conversation.totalMessages}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                  {conversation.messagesSentByP1} by {conversation.participant1.name.split(" ")[0]} &bull; {conversation.messagesSentByP2} by {conversation.participant2.name.split(" ")[0]}
                </div>
              </div>

              <div>
                <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>Media Attachments</span>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)" }}>
                  {conversation.mediaAttachmentCount} items
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                  Images, audio &amp; docs
                </div>
              </div>

              <div>
                <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>Delivery Pipeline</span>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--status-success)", marginTop: "4px" }}>
                  {conversation.deliveryHealth.toUpperCase()}
                </div>
              </div>

              <div>
                <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>Unread Count</span>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)", marginTop: "4px" }}>
                  {conversation.unreadCount} in flight
                </div>
              </div>
            </div>
          </div>

          {/* Timeline & Timestamps */}
          <div>
            <h4 style={{ fontSize: "12.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-secondary)", marginBottom: "12px" }}>
              Timeline &amp; Activity
            </h4>

            <div
              style={{
                padding: "14px 16px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontSize: "12.5px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>Conversation Created:</span>
                <strong style={{ color: "var(--text-main)" }}>{startedDate}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>Last Transmitted Message:</span>
                <strong style={{ color: "var(--text-main)" }}>{lastMsgDate}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>Current Status:</span>
                <strong style={{ color: "var(--text-main)", textTransform: "capitalize" }}>
                  {conversation.status.replace(/_/g, " ")}
                </strong>
              </div>
            </div>
          </div>

          {/* Moderation Warnings if any */}
          {conversation.hasActiveReports && (
            <div
              style={{
                padding: "14px 16px",
                borderRadius: "12px",
                backgroundColor: "rgba(220, 38, 38, 0.08)",
                border: "1px solid rgba(220, 38, 38, 0.3)",
                color: "#DC2626",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "13px" }}>
                <AlertTriangle size={16} /> Active Moderation Flag on Thread
              </div>
              <div style={{ fontSize: "12px", marginTop: "4px", lineHeight: 1.4 }}>
                This thread has {conversation.activeReportCount} active report(s).
                {conversation.restrictionReason && ` Note: ${conversation.restrictionReason}`}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: "18px 24px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            gap: "10px",
            backgroundColor: "var(--bg-surface)",
          }}
        >
          <button
            type="button"
            onClick={() => onToggleArchive(conversation.id)}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-main)",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <Archive size={14} />
            {conversation.status === "archived" ? "Unarchive" : "Archive"}
          </button>

          {!conversation.isRestricted && (
            <button
              type="button"
              onClick={() => onOpenRestrictModal(conversation)}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#DC2626",
                color: "#ffffff",
                fontSize: "12.5px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              <Lock size={14} /> Apply Hold
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
