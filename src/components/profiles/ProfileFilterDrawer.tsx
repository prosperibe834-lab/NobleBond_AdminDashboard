// NobleBond Admin — Profile Advanced Filter Drawer
// 10 Filter dimensions with real-time application, zero emojis

import React from "react";
import { X, Filter, RotateCcw, Check } from "lucide-react";
import type { ProfileFilterState } from "../../types/profileManagement.types";

interface ProfileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filterState: ProfileFilterState;
  onFilterChange: (filters: ProfileFilterState) => void;
  onResetFilters: () => void;
  totalFiltered: number;
}

export const ProfileFilterDrawer: React.FC<ProfileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filterState,
  onFilterChange,
  onResetFilters,
  totalFiltered,
}) => {
  if (!isOpen) return null;

  const handleChange = (key: keyof ProfileFilterState, value: unknown) => {
    onFilterChange({
      ...filterState,
      [key]: value,
    });
  };

  const countries = [
    "all",
    "Nigeria",
    "United Kingdom",
    "United States",
    "Ghana",
    "Canada",
    "France",
    "Germany",
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
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
          maxWidth: "460px",
          height: "100%",
          backgroundColor: "var(--bg-card)",
          boxShadow: "-8px 0 24px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
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
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: "rgba(139, 29, 65, 0.1)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Filter size={18} />
            </div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
                Advanced Filters
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                {totalFiltered} matching profiles found
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
              borderRadius: "6px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Content */}
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
          {/* Moderation Status */}
          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "8px" }}>
              Moderation Status
            </label>
            <select
              value={filterState.profileStatus}
              onChange={(e) => handleChange("profileStatus", e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-main)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            >
              <option value="all">All Moderation Statuses</option>
              <option value="approved">Approved</option>
              <option value="under_review">Under Review</option>
              <option value="flagged">Flagged</option>
              <option value="restricted">Restricted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Verification Status */}
          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "8px" }}>
              Verification Status
            </label>
            <select
              value={filterState.verificationStatus}
              onChange={(e) => handleChange("verificationStatus", e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-main)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            >
              <option value="all">All Verification Statuses</option>
              <option value="verified">Fully Verified (Biometric + ID)</option>
              <option value="partially_verified">Partially Verified</option>
              <option value="photo_verified">Photo / Selfie Verified</option>
              <option value="identity_verified">Government ID Verified</option>
              <option value="email_only">Email Only</option>
              <option value="phone_only">Phone Only</option>
              <option value="pending">Pending Document Review</option>
              <option value="rejected">Rejected / Tampered</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>

          {/* Media Filter */}
          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "8px" }}>
              Photos & Media
            </label>
            <select
              value={filterState.mediaFilter}
              onChange={(e) => handleChange("mediaFilter", e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-main)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            >
              <option value="all">All Profiles</option>
              <option value="has_photos">Has Photos</option>
              <option value="has_videos">Has Video Prompts</option>
              <option value="photos_pending">Photos Pending Review</option>
              <option value="videos_pending">Videos Pending Review</option>
              <option value="missing_primary">Missing Primary Photo</option>
              <option value="has_rejected_media">Has Rejected Media</option>
            </select>
          </div>

          {/* Visibility */}
          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "8px" }}>
              Profile Visibility
            </label>
            <select
              value={filterState.visibility}
              onChange={(e) => handleChange("visibility", e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-main)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            >
              <option value="all">All Visibilities</option>
              <option value="discoverable">Discoverable in Feed</option>
              <option value="paused_by_user">Paused by User (Snooze)</option>
              <option value="hidden">Hidden by Admin</option>
              <option value="restricted">Restricted (Policy)</option>
            </select>
          </div>

          {/* Age Range */}
          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "8px" }}>
              Age Range
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <input
                type="number"
                placeholder="Min (e.g. 21)"
                value={filterState.ageMin ?? ""}
                onChange={(e) =>
                  handleChange("ageMin", e.target.value ? parseInt(e.target.value, 10) : null)
                }
                style={{
                  padding: "9px 12px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-main)",
                  color: "var(--text-main)",
                  fontSize: "13px",
                }}
              />
              <input
                type="number"
                placeholder="Max (e.g. 40)"
                value={filterState.ageMax ?? ""}
                onChange={(e) =>
                  handleChange("ageMax", e.target.value ? parseInt(e.target.value, 10) : null)
                }
                style={{
                  padding: "9px 12px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-main)",
                  color: "var(--text-main)",
                  fontSize: "13px",
                }}
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "8px" }}>
              Gender
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
              {[
                { label: "All", value: "all" },
                { label: "Female", value: "female" },
                { label: "Male", value: "male" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleChange("gender", opt.value)}
                  style={{
                    padding: "8px",
                    borderRadius: "8px",
                    border: filterState.gender === opt.value ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                    backgroundColor: filterState.gender === opt.value ? "rgba(139, 29, 65, 0.08)" : "var(--bg-main)",
                    color: filterState.gender === opt.value ? "var(--primary)" : "var(--text-secondary)",
                    fontWeight: filterState.gender === opt.value ? 700 : 500,
                    fontSize: "12.5px",
                    cursor: "pointer",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Country */}
          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "8px" }}>
              Country
            </label>
            <select
              value={filterState.country}
              onChange={(e) => handleChange("country", e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-main)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All Countries" : c}
                </option>
              ))}
            </select>
          </div>

          {/* Completion Bucket */}
          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "8px" }}>
              Completion Score
            </label>
            <select
              value={filterState.completionBucket}
              onChange={(e) => handleChange("completionBucket", e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-main)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            >
              <option value="all">All Completion Levels</option>
              <option value="100">100% Complete</option>
              <option value="76_99">76% - 99% (High Quality)</option>
              <option value="51_75">51% - 75% (Adequate)</option>
              <option value="26_50">26% - 50% (Basic)</option>
              <option value="0_25">0% - 25% (Incomplete)</option>
            </select>
          </div>

          {/* Community Reports Filter */}
          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "8px" }}>
              Safety Reports
            </label>
            <select
              value={filterState.hasReports}
              onChange={(e) => handleChange("hasReports", e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-main)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            >
              <option value="all">All Profiles</option>
              <option value="yes">Has Active Reports</option>
              <option value="critical">Critical / High Severity Only</option>
              <option value="no">Zero Reports (Clean)</option>
            </select>
          </div>
        </div>

        {/* Drawer Footer */}
        <div
          style={{
            padding: "18px 24px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            gap: "12px",
          }}
        >
          <button
            type="button"
            onClick={onResetFilters}
            style={{
              flex: 1,
              padding: "11px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-main)",
              color: "var(--text-main)",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <RotateCcw size={15} />
            Reset
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 2,
              padding: "11px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "var(--primary)",
              color: "#FFFFFF",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <Check size={16} />
            Apply Filters ({totalFiltered})
          </button>
        </div>
      </div>
    </div>
  );
};

