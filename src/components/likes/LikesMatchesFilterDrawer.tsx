// NobleBond Admin — Likes & Matches Filter Drawer
// 10-dimension relationship filtering drawer, zero emojis

import React from "react";
import { X, Filter, RotateCcw, Check } from "lucide-react";
import type { LikesMatchesFilterState } from "../../types/likesMatches.types";

interface LikesMatchesFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filterState: LikesMatchesFilterState;
  onFilterChange: (filters: LikesMatchesFilterState) => void;
  onResetFilters: () => void;
  totalFiltered: number;
}

export const LikesMatchesFilterDrawer: React.FC<LikesMatchesFilterDrawerProps> = ({
  isOpen,
  onClose,
  filterState,
  onFilterChange,
  onResetFilters,
  totalFiltered,
}) => {
  if (!isOpen) return null;

  const handleChange = (key: keyof LikesMatchesFilterState, value: unknown) => {
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
          maxWidth: "440px",
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
                Advanced Dating Filters
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                {totalFiltered} matching interactions found
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
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          {/* Interaction Type */}
          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "8px" }}>
              Interaction Type
            </label>
            <select
              value={filterState.interactionType}
              onChange={(e) => handleChange("interactionType", e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-main)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            >
              <option value="all">All Like Types</option>
              <option value="regular">Regular Like</option>
              <option value="super_like">Super Like</option>
            </select>
          </div>

          {/* Direction */}
          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "8px" }}>
              Interaction Direction
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
              {[
                { label: "All", value: "all" },
                { label: "Incoming", value: "incoming" },
                { label: "Outgoing", value: "outgoing" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleChange("interactionDirection", opt.value)}
                  style={{
                    padding: "8px",
                    borderRadius: "8px",
                    border: filterState.interactionDirection === opt.value ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                    backgroundColor: filterState.interactionDirection === opt.value ? "rgba(139, 29, 65, 0.08)" : "var(--bg-main)",
                    color: filterState.interactionDirection === opt.value ? "var(--primary)" : "var(--text-secondary)",
                    fontWeight: filterState.interactionDirection === opt.value ? 700 : 500,
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Match Status */}
          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "8px" }}>
              Match Lifecycle Status
            </label>
            <select
              value={filterState.matchStatus}
              onChange={(e) => handleChange("matchStatus", e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-main)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            >
              <option value="all">All Match Statuses</option>
              <option value="active">Active Matches</option>
              <option value="unmatched">Unmatched Relationships</option>
              <option value="under_review">Under Review</option>
              <option value="restricted">Restricted (Safety Block)</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Date Range Preset */}
          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "8px" }}>
              Date Range
            </label>
            <select
              value={filterState.dateRange}
              onChange={(e) => handleChange("dateRange", e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-main)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            >
              <option value="today">Today</option>
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="last_90_days">Last 90 Days</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          {/* Country */}
          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "8px" }}>
              Participant Country
            </label>
            <select
              value={filterState.country}
              onChange={(e) => handleChange("country", e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
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

          {/* Age Range */}
          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "8px" }}>
              Participant Age Range
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <input
                type="number"
                placeholder="Min age (18)"
                value={filterState.ageMin ?? ""}
                onChange={(e) =>
                  handleChange("ageMin", e.target.value ? parseInt(e.target.value, 10) : null)
                }
                style={{
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-main)",
                  color: "var(--text-main)",
                  fontSize: "12.5px",
                }}
              />
              <input
                type="number"
                placeholder="Max age (65)"
                value={filterState.ageMax ?? ""}
                onChange={(e) =>
                  handleChange("ageMax", e.target.value ? parseInt(e.target.value, 10) : null)
                }
                style={{
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-main)",
                  color: "var(--text-main)",
                  fontSize: "12.5px",
                }}
              />
            </div>
          </div>

          {/* Verification Status */}
          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "8px" }}>
              Member Verification
            </label>
            <select
              value={filterState.verificationStatus}
              onChange={(e) => handleChange("verificationStatus", e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-main)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            >
              <option value="all">All Members</option>
              <option value="verified">Verified Badge Only</option>
              <option value="unverified">Unverified Only</option>
            </select>
          </div>

          {/* Safety Reports Filter */}
          <div>
            <label style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", display: "block", marginBottom: "8px" }}>
              Safety & Reports Flag
            </label>
            <select
              value={filterState.hasReports}
              onChange={(e) => handleChange("hasReports", e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-main)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            >
              <option value="all">All Interactions</option>
              <option value="reported_only">Reported Interactions Only</option>
              <option value="clean_only">Clean Interactions Only</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            type="button"
            onClick={onResetFilters}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-main)",
              color: "var(--text-main)",
              fontSize: "12.5px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <RotateCcw size={14} /> Reset
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 2,
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "var(--primary)",
              color: "#FFFFFF",
              fontSize: "12.5px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <Check size={15} /> Apply ({totalFiltered})
          </button>
        </div>
      </div>
    </div>
  );
};

