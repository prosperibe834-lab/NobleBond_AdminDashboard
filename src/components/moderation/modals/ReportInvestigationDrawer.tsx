// NobleBond Admin — Report Investigation Workspace Drawer
// Comprehensive investigation dossier, evidence review, internal notes, audit timeline, zero emojis

import React, { useState } from "react";
import {
  X,
  ShieldAlert,
  ExternalLink,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Ban,
} from "lucide-react";
import type {
  UnifiedReportRecord,
  ReportPriority,
  ReportStatus,
} from "../../../types/reportsModeration.types";

interface ReportInvestigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  report: UnifiedReportRecord | null;
  onAssignModerator: (reportId: string, moderatorName: string) => void;
  onUpdatePriority: (reportId: string, priority: ReportPriority) => void;
  onUpdateStatus: (reportId: string, status: ReportStatus) => void;
  onAddNote: (reportId: string, noteText: string) => void;
  onOpenResolveModal: (report: UnifiedReportRecord) => void;
  onOpenDismissModal: (report: UnifiedReportRecord) => void;
  onOpenEscalateModal: (report: UnifiedReportRecord) => void;
  onOpenApplyActionModal: (report: UnifiedReportRecord) => void;
  onOpenUserProfile?: (userId: string) => void;
  onOpenProfileManagement?: (profileId: string) => void;
  onOpenChatManagement?: (conversationId: string) => void;
  onOpenLiveManagement?: (sessionId: string) => void;
}

const MODERATORS_LIST = [
  "Admin Sarah Jenkins",
  "Moderator Alex Vance",
  "Supervisor Liam Ortiz",
  "Self (Supervisor Admin)",
];

export const ReportInvestigationDrawer: React.FC<ReportInvestigationDrawerProps> = ({
  isOpen,
  onClose,
  report,
  onAssignModerator,
  onUpdatePriority,
  onUpdateStatus,
  onAddNote,
  onOpenResolveModal,
  onOpenDismissModal,
  onOpenEscalateModal,
  onOpenApplyActionModal,
  onOpenUserProfile,
  onOpenProfileManagement,
  onOpenChatManagement,
  onOpenLiveManagement,
}) => {
  const [newNoteText, setNewNoteText] = useState<string>("");
  const [selectedModerator, setSelectedModerator] = useState<string>(
    report?.assignedModerator || MODERATORS_LIST[0]
  );

  if (!isOpen || !report) return null;

  const handleAddNoteSubmit = () => {
    if (!newNoteText.trim()) return;
    onAddNote(report.id, newNoteText.trim());
    setNewNoteText("");
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "critical":
        return { bg: "rgba(220, 38, 38, 0.12)", color: "#DC2626", border: "#F87171" };
      case "high":
        return { bg: "rgba(234, 88, 12, 0.12)", color: "#EA580C", border: "#FB923C" };
      case "medium":
        return { bg: "rgba(217, 119, 6, 0.12)", color: "#D97706", border: "#FBBF24" };
      default:
        return { bg: "rgba(107, 114, 128, 0.12)", color: "#4B5563", border: "#D1D5DB" };
    }
  };

  const pStyle = getPriorityStyle(report.priority);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        className="animate-slide-left"
        style={{
          width: "100%",
          maxWidth: "720px",
          height: "100%",
          backgroundColor: "var(--bg-card)",
          boxShadow: "-12px 0 32px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          borderLeft: "1px solid var(--border)",
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
                backgroundColor: "rgba(139, 29, 65, 0.12)",
                color: "var(--primary)",
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
                    fontSize: "17px",
                    fontWeight: 800,
                    color: "var(--text-main)",
                  }}
                >
                  Investigation Workspace
                </h3>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "12px",
                    fontWeight: 700,
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
                    backgroundColor: pStyle.bg,
                    color: pStyle.color,
                    border: `1px solid ${pStyle.border}`,
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
                Submitted {new Date(report.submittedAt).toLocaleString()} &bull; Domain: {report.domain.toUpperCase()}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              padding: "6px",
              cursor: "pointer",
              color: "var(--text-muted)",
              borderRadius: "8px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Workspace Body */}
        <div
          style={{
            padding: "24px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "22px",
            flex: 1,
          }}
        >
          {/* Section 1: Parties Involved (Reporter & Target) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
            }}
          >
            {/* Reporter Card */}
            <div
              style={{
                padding: "16px",
                borderRadius: "14px",
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                Reporting Member
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img
                  src={report.reporter.avatar}
                  alt={report.reporter.name}
                  style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-main)" }}>
                    {report.reporter.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {report.reporter.username} &bull; {report.reporter.city}, {report.reporter.country}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px" }}>
                Verified: {report.reporter.isVerified ? "Yes" : "No"} &bull; Tier: {report.reporter.premiumTier}
              </div>
            </div>

            {/* Reported User Card */}
            <div
              style={{
                padding: "16px",
                borderRadius: "14px",
                backgroundColor: "rgba(220, 38, 38, 0.05)",
                border: "1px solid rgba(220, 38, 38, 0.25)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "#DC2626",
                  }}
                >
                  Reported Target
                </span>
                <div style={{ display: "flex", gap: "6px" }}>
                  {onOpenUserProfile && (
                    <button
                      onClick={() => onOpenUserProfile(report.reportedUser.id)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        color: "#DC2626",
                        fontSize: "11px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "2px",
                      }}
                    >
                      User Dossier <ExternalLink size={10} />
                    </button>
                  )}
                  {onOpenProfileManagement && (
                    <button
                      onClick={() => onOpenProfileManagement(report.reportedUser.profileId)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        color: "#DC2626",
                        fontSize: "11px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "2px",
                      }}
                    >
                      Profile <ExternalLink size={10} />
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img
                  src={report.reportedUser.avatar}
                  alt={report.reportedUser.name}
                  style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-main)" }}>
                    {report.reportedUser.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {report.reportedUser.username} &bull; {report.reportedUser.city}, {report.reportedUser.country}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px" }}>
                Verified: {report.reportedUser.isVerified ? "Yes" : "No"} &bull; Tier: {report.reportedUser.premiumTier}
              </div>
            </div>
          </div>

          {/* Section 2: Allegation Description & Context */}
          <div
            style={{
              padding: "16px",
              borderRadius: "14px",
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                Factual Allegation & Infraction Category
              </span>
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(139, 29, 65, 0.08)",
                  color: "var(--primary)",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "capitalize",
                }}
              >
                {report.category.replace(/_/g, " ")}
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "13.5px",
                lineHeight: "1.5",
                color: "var(--text-main)",
              }}
            >
              {report.description}
            </p>

            {report.relatedEntityId && (
              <div
                style={{
                  marginTop: "6px",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "var(--text-secondary)" }}>
                  Associated Resource: <strong>{report.relatedEntityTitle || report.relatedEntityId}</strong>
                </span>
                {report.domain === "chat" && onOpenChatManagement && (
                  <button
                    onClick={() => onOpenChatManagement(report.relatedEntityId!)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--primary)",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    Inspect in Chats <ExternalLink size={11} />
                  </button>
                )}
                {report.domain === "live" && onOpenLiveManagement && (
                  <button
                    onClick={() => onOpenLiveManagement(report.relatedEntityId!)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--primary)",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    Inspect in Live <ExternalLink size={11} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Section 3: Submitted Evidence */}
          <div
            style={{
              padding: "16px",
              borderRadius: "14px",
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "var(--text-muted)",
              }}
            >
              Submitted Evidence ({report.evidence.length} Items)
            </div>

            {report.evidence.length === 0 ? (
              <div style={{ fontSize: "12.5px", color: "var(--text-muted)", fontStyle: "italic" }}>
                No standalone media files or screenshots attached to this initial filing.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {report.evidence.map((ev) => (
                  <div
                    key={ev.id}
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-main)" }}>
                        {ev.label}
                      </span>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>
                        {ev.type}
                      </span>
                    </div>

                    {ev.url && (
                      <img
                        src={ev.url}
                        alt="Evidence item"
                        style={{
                          width: "120px",
                          height: "120px",
                          borderRadius: "8px",
                          objectFit: "cover",
                          border: "1px solid var(--border)",
                        }}
                      />
                    )}

                    {ev.snippet && (
                      <div
                        style={{
                          fontSize: "12.5px",
                          fontStyle: "italic",
                          backgroundColor: "var(--bg-secondary)",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          borderLeft: "3px solid #DC2626",
                          color: "var(--text-main)",
                        }}
                      >
                        "{ev.snippet}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Moderator Assignment & Priority Controls */}
          <div
            style={{
              padding: "16px",
              borderRadius: "14px",
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
            }}
          >
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "6px" }}>
                Assigned Moderator
              </label>
              <div style={{ display: "flex", gap: "6px" }}>
                <select
                  value={selectedModerator}
                  onChange={(e) => setSelectedModerator(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "6px 10px",
                    fontSize: "12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--bg-card)",
                    color: "var(--text-main)",
                    outline: "none",
                  }}
                >
                  {MODERATORS_LIST.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => onAssignModerator(report.id, selectedModerator)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "var(--primary, #8B1D41)",
                    color: "#FFFFFF",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Assign
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "6px" }}>
                Set Priority Level
              </label>
              <div style={{ display: "flex", gap: "6px" }}>
                {(["low", "medium", "high", "critical"] as ReportPriority[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => onUpdatePriority(report.id, p)}
                    style={{
                      flex: 1,
                      padding: "6px 4px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      border: report.priority === p ? "2px solid #DC2626" : "1px solid var(--border)",
                      backgroundColor: report.priority === p ? "rgba(220, 38, 38, 0.1)" : "var(--bg-card)",
                      color: report.priority === p ? "#DC2626" : "var(--text-secondary)",
                      cursor: "pointer",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "6px" }}>
                Set Status
              </label>
              <div style={{ display: "flex", gap: "6px" }}>
                {(["pending", "under_review", "escalated"] as ReportStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => onUpdateStatus(report.id, st)}
                    style={{
                      flex: 1,
                      padding: "6px 4px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "capitalize",
                      border: report.status === st ? "2px solid var(--primary, #8B1D41)" : "1px solid var(--border)",
                      backgroundColor: report.status === st ? "rgba(139, 29, 65, 0.1)" : "var(--bg-card)",
                      color: report.status === st ? "var(--primary, #8B1D41)" : "var(--text-secondary)",
                      cursor: "pointer",
                    }}
                  >
                    {st.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 5: Internal Investigation Notes */}
          <div
            style={{
              padding: "16px",
              borderRadius: "14px",
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "var(--text-muted)",
              }}
            >
              Internal Moderator Notes ({report.notes.length})
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {report.notes.length === 0 ? (
                <div style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>
                  No internal findings or notes recorded yet.
                </div>
              ) : (
                report.notes.map((nt) => (
                  <div
                    key={nt.id}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "8px",
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>
                      <strong style={{ color: "var(--text-main)" }}>{nt.authorName} ({nt.authorRole})</strong>
                      <span>{new Date(nt.timestamp).toLocaleString()}</span>
                    </div>
                    <div style={{ fontSize: "12.5px", color: "var(--text-main)", lineHeight: "1.4" }}>
                      {nt.text}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Note Editor Input */}
            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
              <input
                type="text"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddNoteSubmit();
                }}
                placeholder="Add confidential investigation note..."
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  fontSize: "12.5px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-main)",
                  outline: "none",
                }}
              />
              <button
                onClick={handleAddNoteSubmit}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "var(--primary, #8B1D41)",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Add Note
              </button>
            </div>
          </div>

          {/* Section 6: Chronological Investigation Timeline */}
          <div
            style={{
              padding: "16px",
              borderRadius: "14px",
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "var(--text-muted)",
              }}
            >
              Investigation Audit Timeline
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {report.timeline.map((tm, idx) => (
                <div
                  key={tm.id || idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: "var(--primary, #8B1D41)",
                      marginTop: "5px",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)" }}>
                        {tm.eventType}
                      </span>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                        {new Date(tm.timestamp).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                      {tm.description} &bull; <span style={{ color: "var(--text-muted)" }}>{tm.actorName} ({tm.actorRole})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions Strip */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--border)",
            backgroundColor: "var(--bg-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => onOpenApplyActionModal(report)}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid #DC2626",
                backgroundColor: "rgba(220, 38, 38, 0.08)",
                color: "#DC2626",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Ban size={14} /> Apply Enforcement
            </button>

            <button
              onClick={() => onOpenEscalateModal(report)}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-card)",
                color: "#9333EA",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <ArrowUpRight size={14} /> Escalate
            </button>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => onOpenDismissModal(report)}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-secondary)",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <XCircle size={14} /> Dismiss
            </button>

            <button
              onClick={() => onOpenResolveModal(report)}
              style={{
                padding: "8px 18px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "var(--status-success, #10B981)",
                color: "#FFFFFF",
                fontSize: "12.5px",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <CheckCircle2 size={15} /> Resolve Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
