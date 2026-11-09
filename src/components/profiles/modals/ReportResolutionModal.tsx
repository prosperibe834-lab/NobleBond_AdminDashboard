// NobleBond Admin — Profile Report Resolution Modal
// Safe investigation and resolution of community trust & safety reports, zero emojis

import React, { useState } from "react";
import { X, Flag, CheckCircle2, XCircle, ArrowUpRight, Clock, AlertTriangle } from "lucide-react";
import type { AdminProfile, ProfileReport } from "../../../types/profileManagement.types";

interface ReportResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AdminProfile | null;
  report: ProfileReport | null;
  onResolve: (profileId: string, reportId: string, decision: "investigating" | "resolved" | "escalated" | "dismissed", notes: string) => void;
}

export const ReportResolutionModal: React.FC<ReportResolutionModalProps> = ({
  isOpen,
  onClose,
  profile,
  report,
  onResolve,
}) => {
  if (!isOpen || !profile || !report) return null;

  return (
    <ReportResolutionForm
      key={`${profile.id}_${report.id}`}
      profile={profile}
      report={report}
      onClose={onClose}
      onResolve={onResolve}
    />
  );
};

interface ReportResolutionFormProps {
  profile: AdminProfile;
  report: ProfileReport;
  onClose: () => void;
  onResolve: (profileId: string, reportId: string, decision: "investigating" | "resolved" | "escalated" | "dismissed", notes: string) => void;
}

const ReportResolutionForm: React.FC<ReportResolutionFormProps> = ({
  profile,
  report,
  onClose,
  onResolve,
}) => {
  const [decision, setDecision] = useState<"investigating" | "resolved" | "escalated" | "dismissed">(
    report.status === "new" ? "resolved" : report.status
  );
  const [notes, setNotes] = useState(report.adminNotes || "");

  const handleSave = () => {
    onResolve(profile.id, report.id, decision, notes || "Report resolved by moderator");
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
          backgroundColor: "var(--bg-card)",
          borderRadius: "20px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-xl)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
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
                Community Safety Report #{report.id}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Reported profile: {profile.fullName} ({profile.username})
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
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
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
              <span style={{ color: "var(--text-secondary)" }}>Reporter:</span>
              <strong style={{ color: "var(--text-main)" }}>{report.reporterNameMasked} (Identity Protected)</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Category:</span>
              <strong style={{ color: "var(--status-error)", textTransform: "capitalize" }}>
                {report.category.replace("_", " ")}
              </strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Priority:</span>
              <span
                style={{
                  fontWeight: 700,
                  color: report.priority === "critical" || report.priority === "high" ? "var(--status-error)" : "#F59E0B",
                  textTransform: "uppercase",
                  fontSize: "11px",
                }}
              >
                {report.priority}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Filed At:</span>
              <span>{new Date(report.createdAt).toLocaleString()}</span>
            </div>

            <div style={{ marginTop: "6px", paddingTop: "8px", borderTop: "1px solid var(--border)" }}>
              <div style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: "4px" }}>Report Details:</div>
              <div style={{ color: "var(--text-secondary)", lineHeight: "1.4" }}>{report.reason}</div>
            </div>

            {report.reportedContentSnippet && (
              <div
                style={{
                  marginTop: "6px",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(239, 68, 68, 0.08)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  fontSize: "12px",
                  color: "var(--text-main)",
                  fontFamily: "monospace",
                }}
              >
                &ldquo;{report.reportedContentSnippet}&rdquo;
              </div>
            )}
          </div>

          {/* Resolution Options */}
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
                <CheckCircle2 size={14} /> Resolve & Action Taken
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
                <ArrowUpRight size={14} /> Escalate to Legal
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
              placeholder="e.g. Warning issued to user; offending bio snippet removed."
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
            onClick={handleSave}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "var(--primary)",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <AlertTriangle size={15} />
            Confirm Resolution
          </button>
        </div>
      </div>
    </div>
  );
};

