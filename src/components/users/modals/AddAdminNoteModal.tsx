import React, { useState } from "react";
import { X, FileText, AlertCircle, Plus } from "lucide-react";
import type { NobleUser } from "../../../types/userManagement.types";

interface AddAdminNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: NobleUser | null;
  onAddNote: (userId: string, title: string, content: string) => void;
}

export const AddAdminNoteModal: React.FC<AddAdminNoteModalProps> = ({
  isOpen,
  onClose,
  user,
  onAddNote,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Please fill out both the title and content");
      return;
    }
    onAddNote(user.id, title.trim(), content.trim());
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
          maxWidth: "480px",
          backgroundColor: "var(--bg-card)",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-elevated)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
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
                backgroundColor: "rgba(124, 104, 232, 0.1)",
                color: "var(--accent-lavender)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileText size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                Add Internal Admin Note
              </h3>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Target: {user.name} ({user.id})
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

        <form onSubmit={handleSubmit} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Privacy Disclaimer Banner */}
          <div
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border)",
              display: "flex",
              gap: "8px",
              alignItems: "flex-start",
            }}
          >
            <AlertCircle size={16} color="var(--accent-lavender)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <span style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
              Internal notes are permanently visible to authorized administrators only. Do not record passwords, payment cards, or unauthorized sensitive personal data.
            </span>
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              Note Title <span style={{ color: "var(--status-danger)" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. VIP Host Showcase Verification or Identity Review"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: `1px solid ${error && !title ? "var(--status-danger)" : "var(--border)"}`,
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              Note Content <span style={{ color: "var(--status-danger)" }}>*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Provide objective, professional administrative details..."
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (error) setError("");
              }}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: `1px solid ${error && !content ? "var(--status-danger)" : "var(--border)"}`,
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "13px",
                fontFamily: "inherit",
              }}
            />
            {error && <span style={{ fontSize: "11px", color: "var(--status-danger)" }}>{error}</span>}
          </div>

          <div
            style={{
              paddingTop: "12px",
              borderTop: "1px solid var(--border)",
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
              type="submit"
              style={{
                padding: "8px 18px",
                borderRadius: "8px",
                backgroundColor: "var(--accent-lavender)",
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
              <Plus size={14} />
              <span>Save Admin Note</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
