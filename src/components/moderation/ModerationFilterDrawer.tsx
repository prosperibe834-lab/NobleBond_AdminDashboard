// NobleBond Admin — Moderation Filter Drawer
// Multi-attribute filter drawer for reports, priority, status, staff assignment, zero emojis

import React from "react";
import { X, Filter, RotateCcw, Check } from "lucide-react";
import type {
  ModerationFilterState,
  ReportDomain,
  ReportPriority,
  ReportStatus,
} from "../../types/reportsModeration.types";

interface ModerationFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filterState: ModerationFilterState;
  onFilterChange: (filters: ModerationFilterState) => void;
  onResetFilters: () => void;
  totalFiltered: number;
}

const DOMAINS: { label: string; value: "all" | ReportDomain }[] = [
  { label: "All Domains", value: "all" },
  { label: "User Account", value: "user" },
  { label: "Profile & Photo", value: "profile" },
  { label: "Chat & Message", value: "chat" },
  { label: "Live & Streaming", value: "live" },
];

const PRIORITIES: { label: string; value: "all" | ReportPriority }[] = [
  { label: "All Priorities", value: "all" },
  { label: "Critical", value: "critical" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

const STATUSES: { label: string; value: "all" | ReportStatus }[] = [
  { label: "All Statuses", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Under Review", value: "under_review" },
  { label: "Escalated", value: "escalated" },
  { label: "Resolved", value: "resolved" },
  { label: "Dismissed", value: "dismissed" },
];

const MODERATORS = [
  { label: "All Moderators", value: "all" },
  { label: "Admin Sarah Jenkins", value: "Admin Sarah Jenkins" },
  { label: "Moderator Alex Vance", value: "Moderator Alex Vance" },
  { label: "Supervisor Liam Ortiz", value: "Supervisor Liam Ortiz" },
];

export const ModerationFilterDrawer: React.FC<ModerationFilterDrawerProps> = ({
  isOpen,
  onClose,
  filterState,
  onFilterChange,
  onResetFilters,
  totalFiltered,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
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
          maxWidth: "420px",
          height: "100%",
          backgroundColor: "var(--bg-card)",
          boxShadow: "-8px 0 24px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          borderLeft: "1px solid var(--border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Filter size={18} color="var(--primary)" />
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--text-main)" }}>
              Filter Reports & Cases
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              padding: "4px",
              cursor: "pointer",
              color: "var(--text-muted)",
              borderRadius: "6px",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Filters */}
        <div
          style={{
            padding: "20px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            flex: 1,
          }}
        >
          {/* Domain Filter */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase" }}>
              Incident Domain
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {DOMAINS.map((d) => {
                const isSelected = filterState.domain === d.value;
                return (
                  <button
                    key={d.value}
                    onClick={() => onFilterChange({ ...filterState, domain: d.value })}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "8px",
                      border: isSelected ? "1px solid var(--primary)" : "1px solid var(--border)",
                      backgroundColor: isSelected ? "rgba(139, 29, 65, 0.08)" : "var(--bg-secondary)",
                      color: isSelected ? "var(--primary)" : "var(--text-secondary)",
                      fontSize: "12px",
                      fontWeight: isSelected ? 700 : 500,
                      cursor: "pointer",
                    }}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase" }}>
              Severity Priority
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {PRIORITIES.map((p) => {
                const isSelected = filterState.priority === p.value;
                return (
                  <button
                    key={p.value}
                    onClick={() => onFilterChange({ ...filterState, priority: p.value })}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "8px",
                      border: isSelected ? "1px solid var(--primary)" : "1px solid var(--border)",
                      backgroundColor: isSelected ? "rgba(139, 29, 65, 0.08)" : "var(--bg-secondary)",
                      color: isSelected ? "var(--primary)" : "var(--text-secondary)",
                      fontSize: "12px",
                      fontWeight: isSelected ? 700 : 500,
                      cursor: "pointer",
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase" }}>
              Investigation Status
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {STATUSES.map((s) => {
                const isSelected = filterState.status === s.value;
                return (
                  <button
                    key={s.value}
                    onClick={() => onFilterChange({ ...filterState, status: s.value })}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "8px",
                      border: isSelected ? "1px solid var(--primary)" : "1px solid var(--border)",
                      backgroundColor: isSelected ? "rgba(139, 29, 65, 0.08)" : "var(--bg-secondary)",
                      color: isSelected ? "var(--primary)" : "var(--text-secondary)",
                      fontSize: "12px",
                      fontWeight: isSelected ? 700 : 500,
                      cursor: "pointer",
                    }}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Moderator Assignment Filter */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase" }}>
              Assigned Staff Member
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {MODERATORS.map((m) => {
                const isSelected = filterState.assignedModerator === m.value;
                return (
                  <button
                    key={m.value}
                    onClick={() => onFilterChange({ ...filterState, assignedModerator: m.value })}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: isSelected ? "1px solid var(--primary)" : "1px solid var(--border)",
                      backgroundColor: isSelected ? "rgba(139, 29, 65, 0.08)" : "var(--bg-secondary)",
                      color: isSelected ? "var(--primary)" : "var(--text-main)",
                      fontSize: "12.5px",
                      fontWeight: isSelected ? 700 : 500,
                      cursor: "pointer",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{m.label}</span>
                    {isSelected && <Check size={14} color="var(--primary)" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "var(--bg-secondary)",
          }}
        >
          <button
            onClick={onResetFilters}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-secondary)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <RotateCcw size={13} /> Reset Filters
          </button>

          <button
            onClick={onClose}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "var(--primary, #8B1D41)",
              color: "#FFFFFF",
              fontSize: "12.5px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Show {totalFiltered} Cases
          </button>
        </div>
      </div>
    </div>
  );
};
