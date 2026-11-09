// NobleBond Admin — Chat Management Filter Drawer
// Multi-dimension messaging, report, call, and restriction filtering, zero emojis

import React from "react";
import { X, Filter, RotateCcw, Check } from "lucide-react";
import type { ChatFilterState, ConversationStatus, ReportCategory, ReportStatus, PriorityLevel, CallType, CallStatus, RestrictionType } from "../../types/chatManagement.types";

interface ChatFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filterState: ChatFilterState;
  onFilterChange: (filters: ChatFilterState) => void;
  onResetFilters: () => void;
  totalFiltered: number;
}

export const ChatFilterDrawer: React.FC<ChatFilterDrawerProps> = ({
  isOpen,
  onClose,
  filterState,
  onFilterChange,
  onResetFilters,
  totalFiltered,
}) => {
  if (!isOpen) return null;

  const handleChange = (key: keyof ChatFilterState, value: unknown) => {
    onFilterChange({
      ...filterState,
      [key]: value,
    });
  };

  const conversationStatuses: { label: string; value: "all" | ConversationStatus }[] = [
    { label: "All Statuses", value: "all" },
    { label: "Active Threads", value: "active" },
    { label: "Archived Threads", value: "archived" },
    { label: "Restricted (Admin Hold)", value: "restricted" },
    { label: "Blocked by User", value: "blocked_by_user" },
  ];

  const reportCategories: { label: string; value: "all" | ReportCategory }[] = [
    { label: "All Categories", value: "all" },
    { label: "Harassment & Threats", value: "harassment" },
    { label: "Direct Threats", value: "threats" },
    { label: "Commercial / Crypto Scams", value: "scams" },
    { label: "Spam & Unsolicited Links", value: "spam" },
    { label: "Sexual Harassment", value: "sexual_harassment" },
    { label: "Hate Speech", value: "hate_speech" },
    { label: "Impersonation / Catfishing", value: "impersonation" },
    { label: "Unwanted Messages", value: "unwanted_messages" },
  ];

  const reportStatuses: { label: string; value: "all" | ReportStatus }[] = [
    { label: "All Statuses", value: "all" },
    { label: "Pending Triage", value: "pending" },
    { label: "Under Review", value: "under_review" },
    { label: "Escalated", value: "escalated" },
    { label: "Resolved", value: "resolved" },
    { label: "Dismissed", value: "dismissed" },
  ];

  const priorities: { label: string; value: "all" | PriorityLevel }[] = [
    { label: "All Priorities", value: "all" },
    { label: "Critical Priority", value: "critical" },
    { label: "High Priority", value: "high" },
    { label: "Medium Priority", value: "medium" },
    { label: "Low Priority", value: "low" },
  ];

  const callTypes: { label: string; value: "all" | CallType }[] = [
    { label: "All Call Types", value: "all" },
    { label: "Voice Calls", value: "voice" },
    { label: "Video Calls", value: "video" },
  ];

  const callStatuses: { label: string; value: "all" | CallStatus }[] = [
    { label: "All Call Outcomes", value: "all" },
    { label: "Completed", value: "completed" },
    { label: "Missed", value: "missed" },
    { label: "Declined", value: "declined" },
    { label: "Failed / Timeout", value: "failed" },
  ];

  const restrictionTypes: { label: string; value: "all" | RestrictionType }[] = [
    { label: "All Restrictions", value: "all" },
    { label: "User-Initiated Blocks", value: "user_block" },
    { label: "Admin Temporary Sanctions", value: "temporary_restriction" },
    { label: "Admin Permanent Bans", value: "permanent_restriction" },
    { label: "Expired Restrictions", value: "expired_restriction" },
  ];

  const deliveryHealths = [
    { label: "All Delivery Health", value: "all" },
    { label: "Optimal Delivery", value: "optimal" },
    { label: "Warning / High Latency", value: "warning" },
    { label: "Degraded / Throttled", value: "degraded" },
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
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
                Chat Filters & Criteria
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

        {/* Scrollable Filter Form */}
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
          {/* Conversation Status */}
          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
              Conversation Status
            </label>
            <select
              value={filterState.status}
              onChange={(e) => handleChange("status", e.target.value)}
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
              {conversationStatuses.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Report Category */}
          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
              Report Violation Category
            </label>
            <select
              value={filterState.reportCategory}
              onChange={(e) => handleChange("reportCategory", e.target.value)}
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
              {reportCategories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Report Triage Status */}
          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
              Report Moderation Status
            </label>
            <select
              value={filterState.reportStatus}
              onChange={(e) => handleChange("reportStatus", e.target.value)}
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
              {reportStatuses.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Priority Level */}
          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
              Triage Priority Level
            </label>
            <select
              value={filterState.priority}
              onChange={(e) => handleChange("priority", e.target.value)}
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
              {priorities.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* Call Type & Call Status */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
                Call Session Type
              </label>
              <select
                value={filterState.callType}
                onChange={(e) => handleChange("callType", e.target.value)}
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
                {callTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
                Call Outcome
              </label>
              <select
                value={filterState.callStatus}
                onChange={(e) => handleChange("callStatus", e.target.value)}
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
                {callStatuses.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Restriction Type */}
          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
              Messaging Restriction Type
            </label>
            <select
              value={filterState.restrictionType}
              onChange={(e) => handleChange("restrictionType", e.target.value)}
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
              {restrictionTypes.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Delivery Pipeline Health */}
          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
              Delivery Pipeline Health
            </label>
            <select
              value={filterState.deliveryHealth}
              onChange={(e) => handleChange("deliveryHealth", e.target.value)}
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
              {deliveryHealths.map((h) => (
                <option key={h.value} value={h.value}>{h.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer Actions */}
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
