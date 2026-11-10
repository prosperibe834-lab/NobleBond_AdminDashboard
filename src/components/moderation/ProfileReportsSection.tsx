// NobleBond Admin — Profile & Photo Reports Section
// Media and biography safety triage with visual thumbnail previews and Profile Management cross-links, zero emojis

import React, { useState } from "react";
import {
  Image as ImageIcon,
  FileText,
  ExternalLink,
  Search,
} from "lucide-react";
import type { UnifiedReportRecord } from "../../types/reportsModeration.types";

interface ProfileReportsSectionProps {
  reports: UnifiedReportRecord[];
  onOpenReport: (report: UnifiedReportRecord) => void;
  onOpenProfileManagement?: (profileId: string) => void;
}

const CONTENT_TYPES = [
  { label: "All Content Types", value: "all" },
  { label: "Profile Photos", value: "profile_photo" },
  { label: "Gallery Photos", value: "additional_photo" },
  { label: "Biographies", value: "biography" },
  { label: "Profile Prompts", value: "profile_prompt" },
];

export const ProfileReportsSection: React.FC<ProfileReportsSectionProps> = ({
  reports,
  onOpenReport,
  onOpenProfileManagement,
}) => {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [localSearch, setLocalSearch] = useState<string>("");

  const profileReports = reports.filter((r) => r.domain === "profile");

  const filtered = profileReports.filter((r) => {
    const matchesType = selectedType === "all" || r.contentType === selectedType;
    const matchesSearch =
      !localSearch.trim() ||
      r.id.toLowerCase().includes(localSearch.toLowerCase()) ||
      r.reportedUser.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      r.category.toLowerCase().includes(localSearch.toLowerCase()) ||
      r.description.toLowerCase().includes(localSearch.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "critical":
        return { bg: "rgba(220, 38, 38, 0.12)", color: "#DC2626" };
      case "high":
        return { bg: "rgba(234, 88, 12, 0.12)", color: "#EA580C" };
      case "medium":
        return { bg: "rgba(217, 119, 6, 0.12)", color: "#D97706" };
      default:
        return { bg: "rgba(107, 114, 128, 0.12)", color: "#4B5563" };
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "resolved":
        return { bg: "rgba(16, 185, 129, 0.12)", color: "var(--status-success)" };
      case "under_review":
        return { bg: "rgba(59, 130, 246, 0.12)", color: "#2563EB" };
      case "escalated":
        return { bg: "rgba(147, 51, 234, 0.12)", color: "#9333EA" };
      case "dismissed":
        return { bg: "rgba(107, 114, 128, 0.12)", color: "#6B7280" };
      default:
        return { bg: "rgba(245, 158, 11, 0.12)", color: "#D97706" };
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {/* Category Pills & Local Filter Strip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          padding: "14px 18px",
          backgroundColor: "var(--bg-card)",
          borderRadius: "14px",
          border: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {CONTENT_TYPES.map((t) => {
            const isSelected = selectedType === t.value;
            return (
              <button
                key={t.value}
                onClick={() => setSelectedType(t.value)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: isSelected
                    ? "1px solid var(--primary, #8B1D41)"
                    : "1px solid var(--border)",
                  backgroundColor: isSelected
                    ? "rgba(139, 29, 65, 0.08)"
                    : "var(--bg-secondary)",
                  color: isSelected ? "var(--primary)" : "var(--text-secondary)",
                  fontSize: "12px",
                  fontWeight: isSelected ? 700 : 500,
                  cursor: "pointer",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "var(--bg-secondary)",
            padding: "6px 12px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            width: "240px",
          }}
        >
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search profile reports..."
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-main)",
              fontSize: "12px",
              width: "100%",
            }}
          />
        </div>
      </div>

      {/* Reports Table */}
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          boxShadow: "var(--shadow-sm)",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: "13px",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderBottom: "1px solid var(--border)",
                  color: "var(--text-muted)",
                }}
              >
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Case ID</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Flagged Material</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Member Profile</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Content Type</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Allegation Reason</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Priority</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Status</th>
                <th style={{ padding: "12px 14px", fontWeight: 600, textAlign: "right" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>
                    No profile or media reports found matching this criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((report) => {
                  const pStyle = getPriorityStyle(report.priority);
                  const sStyle = getStatusStyle(report.status);
                  const imageEvidence = report.evidence.find((e) => e.type === "image");

                  return (
                    <tr
                      key={report.id}
                      style={{
                        borderBottom: "1px solid var(--border)",
                        transition: "background-color 0.12s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <td style={{ padding: "14px", fontFamily: "monospace", fontWeight: 700 }}>
                        {report.id}
                      </td>

                      {/* Flagged Material Thumbnail Preview */}
                      <td style={{ padding: "14px" }}>
                        {imageEvidence?.url ? (
                          <div style={{ position: "relative", width: "42px", height: "42px" }}>
                            <img
                              src={imageEvidence.url}
                              alt="Flagged media"
                              style={{
                                width: "42px",
                                height: "42px",
                                borderRadius: "8px",
                                objectFit: "cover",
                                border: "1px solid var(--border)",
                              }}
                            />
                            <div
                              style={{
                                position: "absolute",
                                bottom: -2,
                                right: -2,
                                backgroundColor: "#DC2626",
                                color: "#FFFFFF",
                                borderRadius: "4px",
                                padding: "1px 3px",
                                fontSize: "9px",
                              }}
                            >
                              <ImageIcon size={9} />
                            </div>
                          </div>
                        ) : (
                          <div
                            style={{
                              width: "42px",
                              height: "42px",
                              borderRadius: "8px",
                              backgroundColor: "var(--bg-secondary)",
                              border: "1px solid var(--border)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "var(--text-muted)",
                            }}
                          >
                            <FileText size={16} />
                          </div>
                        )}
                      </td>

                      {/* Member Profile */}
                      <td style={{ padding: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <img
                            src={report.reportedUser.avatar}
                            alt={report.reportedUser.name}
                            style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: "var(--text-main)", display: "flex", alignItems: "center", gap: "4px" }}>
                              <span>{report.reportedUser.name}</span>
                              {onOpenProfileManagement && (
                                <button
                                  onClick={() => onOpenProfileManagement(report.reportedUser.profileId)}
                                  title="Open Profile Management module"
                                  style={{
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                    cursor: "pointer",
                                    color: "var(--text-muted)",
                                    display: "inline-flex",
                                  }}
                                >
                                  <ExternalLink size={11} />
                                </button>
                              )}
                            </div>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                              {report.reportedUser.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Content Type */}
                      <td style={{ padding: "14px" }}>
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 600,
                            backgroundColor: "var(--bg-secondary)",
                            border: "1px solid var(--border)",
                            color: "var(--text-secondary)",
                            textTransform: "capitalize",
                          }}
                        >
                          {report.contentType.replace(/_/g, " ")}
                        </span>
                      </td>

                      {/* Allegation Reason */}
                      <td style={{ padding: "14px" }}>
                        <div style={{ fontWeight: 600, color: "var(--text-main)", textTransform: "capitalize" }}>
                          {report.category.replace(/_/g, " ")}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "var(--text-secondary)",
                            maxWidth: "260px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {report.description}
                        </div>
                      </td>

                      {/* Priority */}
                      <td style={{ padding: "14px" }}>
                        <span
                          style={{
                            padding: "2px 7px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            backgroundColor: pStyle.bg,
                            color: pStyle.color,
                          }}
                        >
                          {report.priority}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "14px" }}>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: "10px",
                            fontSize: "11px",
                            fontWeight: 600,
                            backgroundColor: sStyle.bg,
                            color: sStyle.color,
                            textTransform: "capitalize",
                          }}
                        >
                          {report.status.replace("_", " ")}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "14px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "6px" }}>
                          {onOpenProfileManagement && (
                            <button
                              onClick={() => onOpenProfileManagement(report.reportedUser.profileId)}
                              title="Inspect full profile dossier"
                              style={{
                                padding: "6px 10px",
                                borderRadius: "8px",
                                border: "1px solid var(--border)",
                                backgroundColor: "var(--bg-secondary)",
                                color: "var(--text-main)",
                                fontSize: "11.5px",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Profiles
                            </button>
                          )}
                          <button
                            onClick={() => onOpenReport(report)}
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
                            Investigate
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
