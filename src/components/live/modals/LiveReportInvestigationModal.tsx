// NobleBond Admin — Live Report Investigation Modal
// Investigation queue for live safety incidents, zero emojis

import React, { useState } from "react";
import {
  X,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Radio,
  FileText,
  UserCheck,
  ExternalLink,
} from "lucide-react";
import type { LiveReportRecord } from "../../../types/liveManagement.types";

interface LiveReportInvestigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: LiveReportRecord | null;
  onAssignModerator: (reportId: string, moderatorName: string) => void;
  onResolve: (reportId: string, resolution: string, notes: string) => void;
  onDismiss: (reportId: string, notes: string) => void;
  onOpenUserProfile?: (userId: string) => void;
  onOpenSession?: (sessionId: string) => void;
}

export const LiveReportInvestigationModal: React.FC<LiveReportInvestigationModalProps> = ({
  isOpen,
  onClose,
  report,
  onAssignModerator,
  onResolve,
  onDismiss,
  onOpenUserProfile,
  onOpenSession,
}) => {
  const [resolutionType, setResolutionType] = useState<string>("Content Warning Issued");
  const [internalNotes, setInternalNotes] = useState<string>("");
  const [selectedModerator, setSelectedModerator] = useState<string>("Admin Sarah Jenkins");
  const [actionError, setActionError] = useState<string | null>(null);

  if (!isOpen || !report) return null;

  const handleAssign = () => {
    if (!selectedModerator.trim()) return;
    onAssignModerator(report.id, selectedModerator);
  };

  const handleResolveAction = () => {
    if (!internalNotes.trim()) {
      setActionError("Please provide an internal note before resolving.");
      return;
    }
    setActionError(null);
    onResolve(report.id, resolutionType, internalNotes);
    onClose();
  };

  const handleDismissAction = () => {
    if (!internalNotes.trim()) {
      setActionError("Please provide a justification note before dismissing.");
      return;
    }
    setActionError(null);
    onDismiss(report.id, internalNotes);
    onClose();
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return { bg: "#FEF2F2", text: "#DC2626", border: "#FCA5A5" };
      case "high":
        return { bg: "#FFF7ED", text: "#EA580C", border: "#FDBA74" };
      case "medium":
        return { bg: "#FEFCE8", text: "#CA8A04", border: "#FDE047" };
      default:
        return { bg: "#F3F4F6", text: "#4B5563", border: "#D1D5DB" };
    }
  };

  const priorityStyle = getPriorityBadge(report.priority);

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
        {/* Header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "var(--bg-secondary)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: "rgba(239, 68, 68, 0.12)",
                color: "#EF4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldAlert size={22} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  Report Investigation
                </h3>
                <span
                  style={{
                    fontSize: "12px",
                    fontFamily: "monospace",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    backgroundColor: "var(--border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {report.id}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    backgroundColor: priorityStyle.bg,
                    color: priorityStyle.text,
                    border: `1px solid ${priorityStyle.border}`,
                  }}
                >
                  {report.priority}
                </span>
              </div>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "12px",
                  color: "var(--text-muted)",
                }}
              >
                Submitted {new Date(report.submittedAt).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div
          style={{
            padding: "24px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Parties Involved */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
            }}
          >
            {/* Reporter */}
            <div
              style={{
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: "8px",
                }}
              >
                Reporting User
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img
                  src={report.reporter.avatar}
                  alt={report.reporter.name}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    {report.reporter.name}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--text-muted)",
                    }}
                  >
                    @{report.reporter.username}
                  </div>
                </div>
              </div>
            </div>

            {/* Reported Target */}
            <div
              style={{
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "rgba(239, 68, 68, 0.05)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  color: "#EF4444",
                  marginBottom: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Reported Target ({report.targetType})</span>
                {onOpenUserProfile && (
                  <button
                    onClick={() => onOpenUserProfile(report.reportedUser.id)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      color: "#EF4444",
                      fontSize: "11px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    Profile <ExternalLink size={10} />
                  </button>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img
                  src={report.reportedUser.avatar}
                  alt={report.reportedUser.name}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    {report.reportedUser.name}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--text-muted)",
                    }}
                  >
                    @{report.reportedUser.username}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Associated Session */}
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "10px",
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Radio size={16} color="#8B5CF6" />
              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  Broadcast Room:
                </span>{" "}
                <strong style={{ fontSize: "13px", color: "var(--text-primary)" }}>
                  {report.sessionTitle}
                </strong>
                <span
                  style={{
                    marginLeft: "8px",
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    fontFamily: "monospace",
                  }}
                >
                  ({report.sessionId})
                </span>
              </div>
            </div>
            {onOpenSession && (
              <button
                onClick={() => onOpenSession(report.sessionId)}
                style={{
                  background: "transparent",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                Inspect Stream <ExternalLink size={12} />
              </button>
            )}
          </div>

          {/* Allegation & Evidence */}
          <div
            style={{
              padding: "14px",
              borderRadius: "12px",
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                Category & Allegation
              </div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  color: "#EF4444",
                }}
              >
                {report.category.replace(/_/g, " ").toUpperCase()}
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                lineHeight: "1.5",
                color: "var(--text-primary)",
              }}
            >
              {report.description}
            </p>

            {report.evidenceSnippet && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor: "var(--bg-card)",
                  borderLeft: "3px solid #EF4444",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    marginBottom: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <FileText size={12} /> Flagged Audio/Chat Transcript Snippet
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    fontStyle: "italic",
                    color: "var(--text-primary)",
                  }}
                >
                  "{report.evidenceSnippet}"
                </div>
              </div>
            )}
          </div>

          {/* Assignment Section */}
          <div
            style={{
              padding: "14px",
              borderRadius: "12px",
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: "4px",
                }}
              >
                Assigned Moderator
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <UserCheck size={14} color="#3B82F6" />
                {report.assignedModerator || "Unassigned"}
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <select
                value={selectedModerator}
                onChange={(e) => setSelectedModerator(e.target.value)}
                style={{
                  padding: "6px 10px",
                  fontSize: "12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-primary)",
                  outline: "none",
                }}
              >
                <option value="Admin Sarah Jenkins">Admin Sarah Jenkins</option>
                <option value="Moderator Alex Vance">Moderator Alex Vance</option>
                <option value="Supervisor Liam Ortiz">Supervisor Liam Ortiz</option>
              </select>
              <button
                onClick={handleAssign}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  fontWeight: 600,
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "var(--brand-primary, #6366F1)",
                  color: "#FFFFFF",
                  cursor: "pointer",
                }}
              >
                Assign
              </button>
            </div>
          </div>

          {/* Past Resolution (if resolved or dismissed) */}
          {(report.status === "resolved" || report.status === "dismissed") && (
            <div
              style={{
                padding: "14px",
                borderRadius: "12px",
                backgroundColor:
                  report.status === "resolved"
                    ? "rgba(16, 185, 129, 0.08)"
                    : "rgba(107, 114, 128, 0.08)",
                border: `1px solid ${
                  report.status === "resolved"
                    ? "rgba(16, 185, 129, 0.25)"
                    : "rgba(107, 114, 128, 0.25)"
                }`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "6px",
                }}
              >
                {report.status === "resolved" ? (
                  <CheckCircle2 size={16} color="#10B981" />
                ) : (
                  <XCircle size={16} color="#6B7280" />
                )}
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: report.status === "resolved" ? "#10B981" : "#6B7280",
                    textTransform: "capitalize",
                  }}
                >
                  Case Closed ({report.status})
                </span>
                {report.resolvedAt && (
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--text-muted)",
                      marginLeft: "auto",
                    }}
                  >
                    {new Date(report.resolvedAt).toLocaleString()}
                  </span>
                )}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--text-primary)",
                  marginTop: "4px",
                }}
              >
                <strong>Notes:</strong> {report.resolutionNote || "None provided"}
              </div>
              {report.resolvedBy && (
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    marginTop: "4px",
                  }}
                >
                  Handled by: {report.resolvedBy}
                </div>
              )}
            </div>
          )}

          {/* Action Resolution Form (if open) */}
          {report.status !== "resolved" && report.status !== "dismissed" && (
            <div
              style={{
                padding: "16px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "var(--text-primary)",
                }}
              >
                Take Moderation Action
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    marginBottom: "6px",
                  }}
                >
                  Resolution Classification
                </label>
                <select
                  value={resolutionType}
                  onChange={(e) => setResolutionType(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    fontSize: "13px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--bg-card)",
                    color: "var(--text-primary)",
                    outline: "none",
                  }}
                >
                  <option value="Content Warning Issued">Content Warning Issued</option>
                  <option value="Live Stream Terminated">Live Stream Terminated</option>
                  <option value="Host Broadcast Privileges Suspended">
                    Host Broadcast Privileges Suspended
                  </option>
                  <option value="Co-Host Guest Removed from Stage">
                    Co-Host Guest Removed from Stage
                  </option>
                  <option value="Report Dismissed — No Violation Found">
                    Report Dismissed — No Violation Found
                  </option>
                  <option value="Referred to Trust & Safety Team">
                    Referred to Trust & Safety Team
                  </option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    marginBottom: "6px",
                  }}
                >
                  Internal Findings & Mandatory Audit Note
                </label>
                <textarea
                  value={internalNotes}
                  onChange={(e) => {
                    setInternalNotes(e.target.value);
                    if (actionError) setActionError(null);
                  }}
                  placeholder="Record factual investigation details and regulatory justification..."
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    fontSize: "13px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--bg-card)",
                    color: "var(--text-primary)",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>

              {actionError && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#EF4444",
                    fontWeight: 500,
                  }}
                >
                  {actionError}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                  marginTop: "6px",
                }}
              >
                <button
                  onClick={handleDismissAction}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--bg-card)",
                    color: "var(--text-secondary)",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Dismiss Report
                </button>
                <button
                  onClick={handleResolveAction}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#10B981",
                    color: "#FFFFFF",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <CheckCircle2 size={15} /> Resolve & Apply Action
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
