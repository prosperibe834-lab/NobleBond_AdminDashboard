// NobleBond Admin — Live Management Multi-Dimension Filter Drawer
// Filter drawer for sessions, hosts, audience, gifts, reports, and streaming health, zero emojis

import React from "react";
import { X, Filter, RotateCcw, Check } from "lucide-react";
import type {
  LiveFilterState,
  LiveSessionStatus,
  LiveCategory,
  HostStatus,
  LiveReportStatus,
  LiveReportPriority,
  GiftCategory,
  StreamProvider,
  StreamHealthLevel,
} from "../../types/liveManagement.types";

interface LiveFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filterState: LiveFilterState;
  onFilterChange: (filters: LiveFilterState) => void;
  onResetFilters: () => void;
  totalFiltered: number;
}

export const LiveFilterDrawer: React.FC<LiveFilterDrawerProps> = ({
  isOpen,
  onClose,
  filterState,
  onFilterChange,
  onResetFilters,
  totalFiltered,
}) => {
  if (!isOpen) return null;

  const handleChange = (key: keyof LiveFilterState, value: unknown) => {
    onFilterChange({
      ...filterState,
      [key]: value,
    });
  };

  const sessionStatuses: { label: string; value: "all" | LiveSessionStatus }[] = [
    { label: "All Session Statuses", value: "all" },
    { label: "Currently Live", value: "live" },
    { label: "Under Moderation Hold", value: "under_moderation" },
    { label: "Completed Sessions", value: "completed" },
    { label: "Interrupted Ingest", value: "interrupted" },
    { label: "Failed / Policy Terminated", value: "failed" },
  ];

  const categories: { label: string; value: "all" | LiveCategory }[] = [
    { label: "All Categories", value: "all" },
    { label: "Music & Acoustic Arts", value: "music_arts" },
    { label: "Dating Q&A & Advice", value: "dating_qna" },
    { label: "Lifestyle & Casual Chat", value: "lifestyle_casual" },
    { label: "Speed Dating Rounds", value: "speed_dating" },
    { label: "Singles Talent Showcase", value: "talent_show" },
    { label: "Cooking & Gourmet Food", value: "cooking_food" },
    { label: "General Chat", value: "general_chat" },
  ];

  const hostStatuses: { label: string; value: "all" | HostStatus }[] = [
    { label: "All Host Standings", value: "all" },
    { label: "Active Hosts", value: "active" },
    { label: "Warning Issued", value: "warning" },
    { label: "Restricted Access", value: "restricted" },
    { label: "Suspended", value: "suspended" },
  ];

  const reportStatuses: { label: string; value: "all" | LiveReportStatus }[] = [
    { label: "All Report Statuses", value: "all" },
    { label: "Pending Triage", value: "pending" },
    { label: "Under Review", value: "under_review" },
    { label: "Escalated", value: "escalated" },
    { label: "Resolved", value: "resolved" },
    { label: "Dismissed", value: "dismissed" },
  ];

  const priorities: { label: string; value: "all" | LiveReportPriority }[] = [
    { label: "All Priority Levels", value: "all" },
    { label: "Critical Priority", value: "critical" },
    { label: "High Priority", value: "high" },
    { label: "Medium Priority", value: "medium" },
    { label: "Low Priority", value: "low" },
  ];

  const giftTypes: { label: string; value: "all" | GiftCategory }[] = [
    { label: "All Gift Tiers", value: "all" },
    { label: "Romantic Gifts", value: "romantic" },
    { label: "Luxury Items", value: "luxury" },
    { label: "Celebration Gifts", value: "celebration" },
    { label: "Support Tokens", value: "support" },
  ];

  const streamProviders: { label: string; value: "all" | StreamProvider }[] = [
    { label: "All Stream Providers", value: "all" },
    { label: "Agora RTC", value: "Agora RTC" },
    { label: "Amazon IVS", value: "Amazon IVS" },
    { label: "LiveKit", value: "LiveKit" },
  ];

  const healthLevels: { label: string; value: "all" | StreamHealthLevel }[] = [
    { label: "All Health Ratings", value: "all" },
    { label: "Healthy Streams", value: "healthy" },
    { label: "High Jitter / Warning", value: "warning" },
    { label: "Degraded Ingest", value: "degraded" },
    { label: "Disconnected / ICE Dropped", value: "disconnected" },
    { label: "Failed Sessions", value: "failed" },
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
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
                Live Stream Filter Criteria
              </h3>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                {totalFiltered} matching records found
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
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Form Body */}
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
          {/* Session Status */}
          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
              Session Broadcast Status
            </label>
            <select
              value={filterState.sessionStatus}
              onChange={(e) => handleChange("sessionStatus", e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "13px",
                outline: "none",
              }}
            >
              {sessionStatuses.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
              Live Stream Category
            </label>
            <select
              value={filterState.category}
              onChange={(e) => handleChange("category", e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "13px",
                outline: "none",
              }}
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Host Standing */}
          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
              Host Standing &amp; Eligibility
            </label>
            <select
              value={filterState.hostStatus}
              onChange={(e) => handleChange("hostStatus", e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "13px",
                outline: "none",
              }}
            >
              {hostStatuses.map((h) => (
                <option key={h.value} value={h.value}>{h.label}</option>
              ))}
            </select>
          </div>

          {/* Ingest Provider */}
          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
              Streaming Infrastructure Provider
            </label>
            <select
              value={filterState.streamProvider}
              onChange={(e) => handleChange("streamProvider", e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "13px",
                outline: "none",
              }}
            >
              {streamProviders.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* Stream Health Rating */}
          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
              Stream Health &amp; Ingest Quality
            </label>
            <select
              value={filterState.healthStatus}
              onChange={(e) => handleChange("healthStatus", e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "13px",
                outline: "none",
              }}
            >
              {healthLevels.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>

          {/* Report Triage Status & Priority */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
                Report Status
              </label>
              <select
                value={filterState.reportStatus}
                onChange={(e) => handleChange("reportStatus", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-main)",
                  fontSize: "13px",
                  outline: "none",
                }}
              >
                {reportStatuses.map((rs) => (
                  <option key={rs.value} value={rs.value}>{rs.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
                Report Priority
              </label>
              <select
                value={filterState.reportPriority}
                onChange={(e) => handleChange("reportPriority", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-main)",
                  fontSize: "13px",
                  outline: "none",
                }}
              >
                {priorities.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Gift Tiers */}
          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
              Virtual Gift Category
            </label>
            <select
              value={filterState.giftType}
              onChange={(e) => handleChange("giftType", e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "13px",
                outline: "none",
              }}
            >
              {giftTypes.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "18px 24px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            gap: "12px",
            backgroundColor: "var(--bg-surface)",
          }}
        >
          <button
            type="button"
            onClick={onResetFilters}
            style={{
              flex: 1,
              padding: "10px 16px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-secondary)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <RotateCcw size={15} /> Reset
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 2,
              padding: "10px 16px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              boxShadow: "0 2px 8px rgba(139, 29, 65, 0.25)",
            }}
          >
            <Check size={16} /> Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

