// NobleBond Admin — Resolve Dating Interaction Report Modal
// Safety report triage and resolution with audit logging, zero emojis

import React, { useState } from "react";
import { X, Flag, CheckCircle2, XCircle, Clock, ArrowUpRight, ShieldAlert } from "lucide-react";
import type { ReportedInteraction } from "../../../types/likesMatches.types";

interface ResolveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ReportedInteraction | null;
  onConfirmResolve: (reportId: string, decision: "investigating" | "resolved" | "escalated" | "dismissed", notes: string) => void;
}

export const ResolveReportModal: React.FC<ResolveReportModalProps> = ({
  isOpen,
  onClose,
  report,
  onConfirmResolve,
}) => {
  if (!isOpen || !report) return null;

  return (
    <ResolveReportForm
      key={report.id}
      report={report}
      onClose={onClose}
      onConfirmResolve={onConfirmResolve}
    />
  );
};

interface ResolveReportFormProps {
  report: ReportedInteraction;
  onClose: () => void;
  onConfirmResolve: (reportId: string, decision: "investigating" | "resolved" | "escalated" | "dismissed", notes: string) => void;
}

const ResolveReportForm: React.FC<ResolveReportFormProps> = ({
  report,
  onClose,
  onConfirmResolve,
}) => {
  const [decision, setDecision] = useState<"investigating" | "resolved" | "escalated" | "dismissed">(
    report.status === "new" ? "resolved" : report.status
  );
  const [notes, setNotes] = useState(report.adminNotes || "");

  const handleSave = () => {
    onConfirmResolve(report.id, decision, notes || "Report resolved by administrator");
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
          maxWidth: "580px",
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
            backgroundColor: "var(--bg-main)",
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
                backgroundColor: "var(--status-error-bg)",
                color: "var(--status-error)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Flag size={18} />
            </div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
                Triage Dating Report #{report.id}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Item: {report.relatedType.toUpperCase()} #{report.relatedId}
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
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Report Information Box */}
          <div
            style={{
              padding: "16px",
              borderRadius: "12px",
              backgroundColor: "var(--bg-main)",
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              fontSize: "12.5px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Reporting Member:</span>
              <strong style={{ color: "var(--text-main)" }}>{report.reporter.name} ({report.reporter.username})</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Reported User:</span>
              <strong style={{ color: "var(--status-error)" }}>{report.reportedUser.name} ({report.reportedUser.username})</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Violation Category:</span>
              <strong style={{ textTransform: "capitalize", color: "var(--text-main)" }}>{report.category.replace("_", " ")}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Submitted:</span>
              <span>{new Date(report.dateSubmitted).toLocaleString()}</span>
            </div>

            <div style={{ marginTop: "6px", paddingTop: "8px", borderTop: "1px solid var(--border)" }}>
              <div style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: "4px" }}>Report Description:</div>
              <div style={{ color: "var(--text-secondary)", lineHeight: "1.4" }}>{report.reason}</div>
            </div>
          </div>

          {/* Decision Buttons */}
          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "8px" }}>
              Resolution Decision
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setDecision("resolved")}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: decision === "resolved" ? "2px solid var(--status-success)" : "1px solid var(--border)",
                  backgroundColor: decision === "resolved" ? "var(--status-success-bg)" : "var(--bg-main)",
                  color: decision === "resolved" ? "var(--status-success)" : "var(--text-main)",
                  fontWeight: 700,
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <CheckCircle2 size={14} /> Action Taken & Resolved
              </button>

              <button
                type="button"
                onClick={() => setDecision("dismissed")}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: decision === "dismissed" ? "2px solid #6B7280" : "1px solid var(--border)",
                  backgroundColor: decision === "dismissed" ? "rgba(107, 114, 128, 0.12)" : "var(--bg-main)",
                  color: decision === "dismissed" ? "#6B7280" : "var(--text-main)",
                  fontWeight: 700,
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <XCircle size={14} /> Dismiss (Unfounded)
              </button>

              <button
                type="button"
                onClick={() => setDecision("investigating")}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: decision === "investigating" ? "2px solid #F59E0B" : "1px solid var(--border)",
                  backgroundColor: decision === "investigating" ? "rgba(245, 158, 11, 0.12)" : "var(--bg-main)",
                  color: decision === "investigating" ? "#F59E0B" : "var(--text-main)",
                  fontWeight: 700,
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <Clock size={14} /> Keep Investigating
              </button>

              <button
                type="button"
                onClick={() => setDecision("escalated")}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: decision === "escalated" ? "2px solid var(--primary)" : "1px solid var(--border)",
                  backgroundColor: decision === "escalated" ? "rgba(139, 29, 65, 0.1)" : "var(--bg-main)",
                  color: decision === "escalated" ? "var(--primary)" : "var(--text-main)",
                  fontWeight: 700,
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <ArrowUpRight size={14} /> Escalate to Trust Lead
              </button>
            </div>
          </div>

          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "6px" }}>
              Resolution Notes (Audit Trail)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Investigated interaction; sender bio was flagged and disciplinary warning issued."
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
            backgroundColor: "var(--bg-main)",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "9px 16px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "12.5px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            style={{
              padding: "9px 18px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "var(--primary)",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "12.5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <ShieldAlert size={14} /> Submit Resolution
          </button>
        </div>
      </div>
    </div>
  );
};

