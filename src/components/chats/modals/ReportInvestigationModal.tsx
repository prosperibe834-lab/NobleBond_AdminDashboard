// NobleBond Admin — Comprehensive Report Investigation Modal
// Detailed trust & safety investigation, evidence review, zero emojis

import React, { useState } from "react";
import {
  X,
  ShieldAlert,
  AlertTriangle,
  UserCheck,
  XCircle,
  Lock,
} from "lucide-react";
import type { ReportedConversation } from "../../../types/chatManagement.types";

interface ReportInvestigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ReportedConversation | null;
  onResolve: (reportId: string, action: string, notes: string) => void;
  onDismiss: (reportId: string, notes: string) => void;
  onAssignModerator: (reportId: string, moderatorName: string) => void;
  onOpenRestrictModal: (userId: string, userName: string) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const ReportInvestigationModal: React.FC<ReportInvestigationModalProps> = ({
  isOpen,
  onClose,
  report,
  onResolve,
  onDismiss,
  onAssignModerator,
  onOpenRestrictModal,
  onOpenUserProfile,
}) => {
  const [internalNotes, setInternalNotes] = useState("");

  if (!isOpen || !report) return null;

  const reportedDate = new Date(report.reportedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleAction = (action: string) => {
    onResolve(report.id, action, internalNotes);
    onClose();
  };

  const handleDismiss = () => {
    onDismiss(report.id, internalNotes || "No policy violation determined upon evidence review.");
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
          maxWidth: "680px",
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
        {/* Modal Header */}
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
                backgroundColor: "rgba(220, 38, 38, 0.12)",
                color: "#DC2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldAlert size={20} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h3 style={{ fontSize: "16.5px", fontWeight: 800, color: "var(--text-main)" }}>
                  Investigation: {report.id}
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
                  {report.priority} Priority
                </span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                Reported {reportedDate} &bull; Category: {report.category.replace(/_/g, " ").toUpperCase()}
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

        {/* Modal Body */}
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
          {/* Parties In Controversy */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            {/* Reporter Card */}
            <div
              style={{
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border)",
                cursor: "pointer",
              }}
              onClick={() => onOpenUserProfile?.(report.reporter.id)}
            >
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                Reporting User
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
                <img
                  src={report.reporter.avatar}
                  alt={report.reporter.name}
                  style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)" }}>
                    {report.reporter.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {report.reporter.username} &bull; {report.reporter.city}
                  </div>
                </div>
              </div>
            </div>

            {/* Reported User Card */}
            <div
              style={{
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "rgba(220, 38, 38, 0.04)",
                border: "1px solid rgba(220, 38, 38, 0.2)",
                cursor: "pointer",
              }}
              onClick={() => onOpenUserProfile?.(report.reportedUser.id)}
            >
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#DC2626", textTransform: "uppercase" }}>
                Reported Subject
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
                <img
                  src={report.reportedUser.avatar}
                  alt={report.reportedUser.name}
                  style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover", border: "1.5px solid #DC2626" }}
                />
                <div>
                  <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--status-error)" }}>
                    {report.reportedUser.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {report.reportedUser.username} &bull; {report.reportedUser.city}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reporter Narrative */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>
              Reporter Incident Statement
            </label>
            <div
              style={{
                padding: "14px 16px",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                fontSize: "13px",
                color: "var(--text-main)",
                lineHeight: 1.5,
              }}
            >
              {report.details}
            </div>
          </div>

          {/* Reported Message Evidence Snippets */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>
              Flagged Message Evidence (Submitted to Trust &amp; Safety)
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {report.reportedMessageSnippets.map((snippet, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "10px",
                    backgroundColor: "var(--bg-surface-elevated)",
                    borderLeft: "4px solid #DC2626",
                    fontSize: "12.5px",
                    fontStyle: "italic",
                    color: "var(--text-main)",
                  }}
                >
                  &ldquo;{snippet}&rdquo;
                </div>
              ))}
            </div>
          </div>

          {/* Moderator Assignment */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", backgroundColor: "var(--bg-surface)", borderRadius: "12px", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <UserCheck size={16} style={{ color: "var(--status-success)" }} />
              <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-main)" }}>
                Moderator Assigned: {report.assignedModerator || "None"}
              </span>
            </div>
            {!report.assignedModerator && (
              <button
                type="button"
                onClick={() => onAssignModerator(report.id, "Verified Moderator")}
                style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "var(--primary)",
                  color: "#ffffff",
                  fontSize: "11.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Claim Ticket
              </button>
            )}
          </div>

          {/* Internal Notes */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>
              Internal Investigation &amp; Audit Notes
            </label>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Record findings, policy clauses evaluated, or justification for administrative action..."
              rows={3}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "13px",
                outline: "none",
                resize: "vertical",
              }}
            />
          </div>
        </div>

        {/* Modal Footer Actions */}
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
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <XCircle size={15} /> Dismiss (No Violation)
          </button>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={() => handleAction("Conduct Advisory & Formal Warning Issued")}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "1px solid rgba(245, 158, 11, 0.4)",
                backgroundColor: "rgba(245, 158, 11, 0.1)",
                color: "#D97706",
                fontSize: "12.5px",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <AlertTriangle size={15} /> Warn User
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenRestrictModal(report.reportedUser.id, report.reportedUser.name);
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
                boxShadow: "0 2px 8px rgba(220, 38, 38, 0.25)",
              }}
            >
              <Lock size={15} /> Restrict Messaging
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
