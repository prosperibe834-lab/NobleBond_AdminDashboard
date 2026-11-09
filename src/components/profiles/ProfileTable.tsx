// NobleBond Admin — Profile Management Desktop Table
// Full 17-column specification with column visibility, sorting, and bulk selection

import React from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  Eye,
  EyeOff,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Camera,
  Video,
} from "lucide-react";
import type {
  AdminProfile,
  ColumnVisibilityState,
  ProfileSortCriteria,
  ProfileSortField,
} from "../../types/profileManagement.types";
import { calculateAge } from "../../data/profileManagementDataService";

interface ProfileTableProps {
  profiles: AdminProfile[];
  columns: ColumnVisibilityState;
  sort: ProfileSortCriteria;
  onSortChange: (field: ProfileSortField) => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onOpenDetails: (profile: AdminProfile, initialTab?: string) => void;
  onOpenPreview: (profile: AdminProfile) => void;
  onOpenVisibilityModal: (profile: AdminProfile) => void;
}

export const ProfileTable: React.FC<ProfileTableProps> = ({
  profiles,
  columns,
  sort,
  onSortChange,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onOpenDetails,
  onOpenPreview,
  onOpenVisibilityModal,
}) => {
  const isAllSelected = profiles.length > 0 && selectedIds.length === profiles.length;
  const isPartiallySelected = selectedIds.length > 0 && selectedIds.length < profiles.length;

  const renderSortIndicator = (field: ProfileSortField) => {
    if (sort.field !== field) {
      return <ArrowUpDown size={12} style={{ opacity: 0.35, marginLeft: "4px" }} />;
    }
    return sort.order === "asc" ? (
      <ArrowUp size={12} color="var(--primary)" style={{ marginLeft: "4px" }} />
    ) : (
      <ArrowDown size={12} color="var(--primary)" style={{ marginLeft: "4px" }} />
    );
  };

  const getModerationBadge = (status: AdminProfile["moderationStatus"]) => {
    switch (status) {
      case "approved":
        return (
          <span
            style={{
              padding: "4px 8px",
              borderRadius: "6px",
              fontSize: "11.5px",
              fontWeight: 700,
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              color: "var(--status-success)",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <CheckCircle2 size={13} /> Approved
          </span>
        );
      case "under_review":
        return (
          <span
            style={{
              padding: "4px 8px",
              borderRadius: "6px",
              fontSize: "11.5px",
              fontWeight: 700,
              backgroundColor: "rgba(245, 158, 11, 0.12)",
              color: "#F59E0B",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Clock size={13} /> Under Review
          </span>
        );
      case "flagged":
        return (
          <span
            style={{
              padding: "4px 8px",
              borderRadius: "6px",
              fontSize: "11.5px",
              fontWeight: 700,
              backgroundColor: "rgba(236, 72, 153, 0.12)",
              color: "#EC4899",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <AlertTriangle size={13} /> Flagged
          </span>
        );
      case "restricted":
        return (
          <span
            style={{
              padding: "4px 8px",
              borderRadius: "6px",
              fontSize: "11.5px",
              fontWeight: 700,
              backgroundColor: "rgba(239, 68, 68, 0.12)",
              color: "var(--status-error)",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <ShieldAlert size={13} /> Restricted
          </span>
        );
      case "rejected":
        return (
          <span
            style={{
              padding: "4px 8px",
              borderRadius: "6px",
              fontSize: "11.5px",
              fontWeight: 700,
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              color: "var(--status-error)",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const getVisibilityBadge = (profile: AdminProfile) => {
    switch (profile.visibility) {
      case "discoverable":
        return (
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11.5px",
              fontWeight: 600,
              backgroundColor: "rgba(16, 185, 129, 0.08)",
              color: "var(--status-success)",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Eye size={12} /> Discoverable
          </span>
        );
      case "paused_by_user":
        return (
          <span
            title="Voluntarily paused by user in mobile app"
            style={{
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11.5px",
              fontWeight: 600,
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              color: "var(--status-info)",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Clock size={12} /> Paused by User
          </span>
        );
      case "hidden":
        return (
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11.5px",
              fontWeight: 600,
              backgroundColor: "rgba(107, 114, 128, 0.12)",
              color: "#6B7280",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <EyeOff size={12} /> Hidden
          </span>
        );
      case "restricted":
        return (
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11.5px",
              fontWeight: 600,
              backgroundColor: "rgba(239, 68, 68, 0.12)",
              color: "var(--status-error)",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <ShieldAlert size={12} /> Restricted
          </span>
        );
      default:
        return <span>{profile.visibility}</span>;
    }
  };

  const getVerificationBadge = (profile: AdminProfile) => {
    const status = profile.verification.overallStatus;
    switch (status) {
      case "verified":
        return (
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11.5px",
              fontWeight: 700,
              backgroundColor: "rgba(59, 130, 246, 0.12)",
              color: "#2563EB",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <ShieldCheck size={13} /> Verified
          </span>
        );
      case "partially_verified":
        return (
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: "rgba(245, 158, 11, 0.1)",
              color: "#D97706",
            }}
          >
            Partial (Phone/Email)
          </span>
        );
      case "pending":
        return (
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: "rgba(139, 92, 246, 0.1)",
              color: "#8B5CF6",
            }}
          >
            Pending Review
          </span>
        );
      case "rejected":
        return (
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              color: "var(--status-error)",
            }}
          >
            Rejected
          </span>
        );
      case "unverified":
      default:
        return (
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 500,
              color: "var(--text-muted)",
              backgroundColor: "var(--bg-main)",
            }}
          >
            Unverified
          </span>
        );
    }
  };

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
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
                backgroundColor: "var(--bg-main)",
                borderBottom: "1px solid var(--border)",
                color: "var(--text-secondary)",
                fontSize: "11.5px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                whiteSpace: "nowrap",
              }}
            >
              {/* Checkbox column */}
              <th style={{ padding: "14px 16px", width: "40px" }}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isPartiallySelected;
                  }}
                  onChange={onSelectAll}
                  style={{ cursor: "pointer", accentColor: "var(--primary)" }}
                />
              </th>

              {columns.picture && <th style={{ padding: "14px 12px" }}>Photo</th>}

              {columns.fullName && (
                <th
                  style={{ padding: "14px 16px", cursor: "pointer" }}
                  onClick={() => onSortChange("fullName")}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    Full Name {renderSortIndicator("fullName")}
                  </div>
                </th>
              )}

              {columns.username && <th style={{ padding: "14px 16px" }}>Username</th>}

              {columns.age && (
                <th
                  style={{ padding: "14px 14px", cursor: "pointer" }}
                  onClick={() => onSortChange("age")}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    Age {renderSortIndicator("age")}
                  </div>
                </th>
              )}

              {columns.gender && <th style={{ padding: "14px 14px" }}>Gender</th>}
              {columns.country && <th style={{ padding: "14px 14px" }}>Country</th>}
              {columns.city && <th style={{ padding: "14px 14px" }}>City</th>}

              {columns.completion && (
                <th
                  style={{ padding: "14px 16px", cursor: "pointer" }}
                  onClick={() => onSortChange("completionPercentage")}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    Completeness {renderSortIndicator("completionPercentage")}
                  </div>
                </th>
              )}

              {columns.photos && (
                <th
                  style={{ padding: "14px 14px", cursor: "pointer" }}
                  onClick={() => onSortChange("photosCount")}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    Photos {renderSortIndicator("photosCount")}
                  </div>
                </th>
              )}

              {columns.videos && (
                <th
                  style={{ padding: "14px 14px", cursor: "pointer" }}
                  onClick={() => onSortChange("videosCount")}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    Videos {renderSortIndicator("videosCount")}
                  </div>
                </th>
              )}

              {columns.verification && <th style={{ padding: "14px 16px" }}>Verification</th>}
              {columns.moderationStatus && <th style={{ padding: "14px 16px" }}>Moderation</th>}
              {columns.visibility && <th style={{ padding: "14px 16px" }}>Visibility</th>}

              {columns.reportsCount && (
                <th
                  style={{ padding: "14px 14px", cursor: "pointer" }}
                  onClick={() => onSortChange("reportsCount")}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    Reports {renderSortIndicator("reportsCount")}
                  </div>
                </th>
              )}

              {columns.createdAt && (
                <th
                  style={{ padding: "14px 16px", cursor: "pointer" }}
                  onClick={() => onSortChange("createdAt")}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    Created {renderSortIndicator("createdAt")}
                  </div>
                </th>
              )}

              {columns.updatedAt && (
                <th
                  style={{ padding: "14px 16px", cursor: "pointer" }}
                  onClick={() => onSortChange("updatedAt")}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    Updated {renderSortIndicator("updatedAt")}
                  </div>
                </th>
              )}

              {columns.actions && (
                <th style={{ padding: "14px 16px", textAlign: "right" }}>Actions</th>
              )}
            </tr>
          </thead>

          <tbody>
            {profiles.length === 0 ? (
              <tr>
                <td
                  colSpan={18}
                  style={{
                    padding: "48px 16px",
                    textAlign: "center",
                    color: "var(--text-secondary)",
                  }}
                >
                  No profiles match the configured criteria or filters.
                </td>
              </tr>
            ) : (
              profiles.map((profile) => {
                const isSelected = selectedIds.includes(profile.id);
                const age = calculateAge(profile.dateOfBirth);
                const hasPendingMedia =
                  profile.photos.some((ph) => ph.reviewStatus === "pending") ||
                  profile.videos.some((v) => v.reviewStatus === "pending");
                const hasFlaggedMedia =
                  profile.photos.some((ph) => ph.reviewStatus === "flagged") ||
                  profile.videos.some((v) => v.reviewStatus === "flagged");

                return (
                  <tr
                    key={profile.id}
                    style={{
                      borderBottom: "1px solid var(--border)",
                      backgroundColor: isSelected ? "rgba(139, 29, 65, 0.04)" : "transparent",
                      transition: "background-color 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = "var(--bg-main)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    {/* Checkbox */}
                    <td style={{ padding: "12px 16px" }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(profile.id)}
                        style={{ cursor: "pointer", accentColor: "var(--primary)" }}
                      />
                    </td>

                    {/* Picture */}
                    {columns.picture && (
                      <td style={{ padding: "12px" }}>
                        <div
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "10px",
                            overflow: "hidden",
                            border: "1px solid var(--border)",
                            position: "relative",
                          }}
                        >
                          <img
                            src={profile.avatar}
                            alt={profile.fullName}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                          {profile.verification.overallStatus === "verified" && (
                            <div
                              style={{
                                position: "absolute",
                                bottom: 1,
                                right: 1,
                                width: "12px",
                                height: "12px",
                                borderRadius: "50%",
                                backgroundColor: "#2563EB",
                                border: "1.5px solid #FFFFFF",
                              }}
                            />
                          )}
                        </div>
                      </td>
                    )}

                    {/* Full Name */}
                    {columns.fullName && (
                      <td style={{ padding: "12px 16px" }}>
                        <button
                          type="button"
                          onClick={() => onOpenDetails(profile)}
                          style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            color: "var(--text-main)",
                            fontWeight: 700,
                            fontSize: "13.5px",
                            cursor: "pointer",
                            textAlign: "left",
                            textDecoration: "none",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-main)")}
                        >
                          {profile.fullName}
                        </button>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                          ID: {profile.id}
                        </div>
                      </td>
                    )}

                    {/* Username */}
                    {columns.username && (
                      <td style={{ padding: "12px 16px", color: "var(--text-secondary)", fontWeight: 500 }}>
                        {profile.username}
                      </td>
                    )}

                    {/* Age */}
                    {columns.age && (
                      <td style={{ padding: "12px 14px", color: "var(--text-main)", fontWeight: 600 }}>
                        {age}
                      </td>
                    )}

                    {/* Gender */}
                    {columns.gender && (
                      <td style={{ padding: "12px 14px", color: "var(--text-secondary)", textTransform: "capitalize" }}>
                        {profile.gender}
                      </td>
                    )}

                    {/* Country */}
                    {columns.country && (
                      <td style={{ padding: "12px 14px", color: "var(--text-main)" }}>
                        {profile.country}
                      </td>
                    )}

                    {/* City */}
                    {columns.city && (
                      <td style={{ padding: "12px 14px", color: "var(--text-secondary)" }}>
                        {profile.city}
                      </td>
                    )}

                    {/* Completion Meter */}
                    {columns.completion && (
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div
                            style={{
                              width: "60px",
                              height: "6px",
                              backgroundColor: "var(--border)",
                              borderRadius: "3px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${profile.completionPercentage}%`,
                                height: "100%",
                                backgroundColor:
                                  profile.completionPercentage >= 90
                                    ? "var(--status-success)"
                                    : profile.completionPercentage >= 70
                                    ? "var(--primary)"
                                    : "#F59E0B",
                              }}
                            />
                          </div>
                          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-main)" }}>
                            {profile.completionPercentage}%
                          </span>
                        </div>
                      </td>
                    )}

                    {/* Photos Count */}
                    {columns.photos && (
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Camera size={14} color="var(--text-secondary)" />
                          <span style={{ fontWeight: 600, color: "var(--text-main)" }}>
                            {profile.photos.length}
                          </span>
                          {hasPendingMedia && (
                            <span
                              title="Photos pending moderator review"
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                backgroundColor: "#F59E0B",
                              }}
                            />
                          )}
                          {hasFlaggedMedia && (
                            <span
                              title="Photos flagged for review"
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                backgroundColor: "#EC4899",
                              }}
                            />
                          )}
                        </div>
                      </td>
                    )}

                    {/* Videos Count */}
                    {columns.videos && (
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Video size={14} color="var(--text-secondary)" />
                          <span style={{ fontWeight: 600, color: "var(--text-main)" }}>
                            {profile.videos.length}
                          </span>
                        </div>
                      </td>
                    )}

                    {/* Verification */}
                    {columns.verification && (
                      <td style={{ padding: "12px 16px" }}>
                        {getVerificationBadge(profile)}
                      </td>
                    )}

                    {/* Moderation Status */}
                    {columns.moderationStatus && (
                      <td style={{ padding: "12px 16px" }}>
                        {getModerationBadge(profile.moderationStatus)}
                      </td>
                    )}

                    {/* Visibility */}
                    {columns.visibility && (
                      <td style={{ padding: "12px 16px" }}>
                        {getVisibilityBadge(profile)}
                      </td>
                    )}

                    {/* Reports Count */}
                    {columns.reportsCount && (
                      <td style={{ padding: "12px 14px" }}>
                        {profile.reportsCount > 0 ? (
                          <span
                            onClick={() => onOpenDetails(profile, "reports")}
                            style={{
                              padding: "2px 8px",
                              borderRadius: "10px",
                              backgroundColor: "var(--status-error-bg)",
                              color: "var(--status-error)",
                              fontWeight: 700,
                              fontSize: "11.5px",
                              cursor: "pointer",
                            }}
                          >
                            {profile.reportsCount} open
                          </span>
                        ) : (
                          <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>0</span>
                        )}
                      </td>
                    )}

                    {/* Created At */}
                    {columns.createdAt && (
                      <td style={{ padding: "12px 16px", color: "var(--text-secondary)", fontSize: "12px" }}>
                        {new Date(profile.createdAt).toLocaleDateString()}
                      </td>
                    )}

                    {/* Updated At */}
                    {columns.updatedAt && (
                      <td style={{ padding: "12px 16px", color: "var(--text-secondary)", fontSize: "12px" }}>
                        {new Date(profile.updatedAt).toLocaleDateString()}
                      </td>
                    )}

                    {/* Actions */}
                    {columns.actions && (
                      <td style={{ padding: "12px 16px", textAlign: "right", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px" }}>
                          <button
                            type="button"
                            onClick={() => onOpenPreview(profile)}
                            title="Preview as NobleBond App User"
                            style={{
                              padding: "6px 8px",
                              borderRadius: "6px",
                              border: "1px solid var(--border)",
                              backgroundColor: "var(--bg-main)",
                              color: "var(--text-secondary)",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "11.5px",
                              fontWeight: 600,
                            }}
                          >
                            <ExternalLink size={13} />
                            Preview
                          </button>

                          <button
                            type="button"
                            onClick={() => onOpenDetails(profile)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "6px",
                              border: "none",
                              backgroundColor: "var(--primary)",
                              color: "#FFFFFF",
                              cursor: "pointer",
                              fontSize: "11.5px",
                              fontWeight: 700,
                            }}
                          >
                            Review
                          </button>

                          <button
                            type="button"
                            onClick={() => onOpenVisibilityModal(profile)}
                            title="Manage Visibility & Restrict"
                            style={{
                              padding: "6px",
                              borderRadius: "6px",
                              border: "1px solid var(--border)",
                              backgroundColor: "transparent",
                              color: "var(--text-secondary)",
                              cursor: "pointer",
                            }}
                          >
                            <MoreVertical size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

