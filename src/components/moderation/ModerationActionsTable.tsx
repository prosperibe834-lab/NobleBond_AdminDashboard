// NobleBond Admin — Moderation Actions & Enforcement Ledger
// Active restrictions, formal warnings, suspensions, and bans with audit logging, zero emojis

import React, { useState } from "react";
import {
  Plus,
  ExternalLink,
  Search,
} from "lucide-react";
import type { ModerationActionRecord } from "../../types/reportsModeration.types";

interface ModerationActionsTableProps {
  actions: ModerationActionRecord[];
  onOpenApplyActionModal: () => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const ModerationActionsTable: React.FC<ModerationActionsTableProps> = ({
  actions,
  onOpenApplyActionModal,
  onOpenUserProfile,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filtered = actions.filter((act) => {
    const matchesStatus = statusFilter === "all" || act.status === statusFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      act.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.targetUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.targetUser.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.actionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getActionTypeBadge = (type: string) => {
    if (type.includes("banned") || type.includes("suspended")) {
      return { bg: "rgba(220, 38, 38, 0.12)", color: "#DC2626" };
    }
    if (type.includes("warning")) {
      return { bg: "rgba(234, 88, 12, 0.12)", color: "#EA580C" };
    }
    if (type.includes("restricted")) {
      return { bg: "rgba(147, 51, 234, 0.12)", color: "#9333EA" };
    }
    return { bg: "rgba(59, 130, 246, 0.12)", color: "#2563EB" };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return { bg: "rgba(220, 38, 38, 0.12)", color: "#DC2626" };
      case "appealed":
        return { bg: "rgba(245, 158, 11, 0.12)", color: "#D97706" };
      case "revoked":
        return { bg: "rgba(107, 114, 128, 0.12)", color: "#6B7280" };
      default:
        return { bg: "rgba(16, 185, 129, 0.12)", color: "var(--status-success)" };
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {/* Action Toolbar */}
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
          {["all", "active", "appealed", "expired", "revoked"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                border: statusFilter === st
                  ? "1px solid var(--primary, #8B1D41)"
                  : "1px solid var(--border)",
                backgroundColor: statusFilter === st
                  ? "rgba(139, 29, 65, 0.08)"
                  : "var(--bg-secondary)",
                color: statusFilter === st ? "var(--primary)" : "var(--text-secondary)",
                fontSize: "12px",
                fontWeight: statusFilter === st ? 700 : 500,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {st} Status
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "var(--bg-secondary)",
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              width: "220px",
            }}
          >
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search enforcements..."
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

          <button
            onClick={onOpenApplyActionModal}
            style={{
              padding: "8px 14px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "var(--primary, #8B1D41)",
              color: "#FFFFFF",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Plus size={15} /> Apply Moderation Action
          </button>
        </div>
      </div>

      {/* Actions Table */}
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
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Action ID</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Target User</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Enforcement Type</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Violation Reason</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Issued By</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Duration & Expiry</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Standing</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>
                    No enforcement records matching this criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((act) => {
                  const tBadge = getActionTypeBadge(act.actionType);
                  const sBadge = getStatusBadge(act.status);

                  return (
                    <tr
                      key={act.id}
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
                        {act.id}
                      </td>

                      <td style={{ padding: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <img
                            src={act.targetUser.avatar}
                            alt={act.targetUser.name}
                            style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: "var(--text-main)", display: "flex", alignItems: "center", gap: "4px" }}>
                              <span>{act.targetUser.name}</span>
                              {onOpenUserProfile && (
                                <button
                                  onClick={() => onOpenUserProfile(act.targetUser.id)}
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
                              {act.targetUser.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: "14px" }}>
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 700,
                            backgroundColor: tBadge.bg,
                            color: tBadge.color,
                            textTransform: "capitalize",
                          }}
                        >
                          {act.actionType.replace(/_/g, " ")}
                        </span>
                      </td>

                      <td style={{ padding: "14px" }}>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--text-main)",
                            maxWidth: "280px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {act.reason}
                        </div>
                        {act.relatedReportId && (
                          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace" }}>
                            Linked: {act.relatedReportId}
                          </div>
                        )}
                      </td>

                      <td style={{ padding: "14px", fontSize: "12px", color: "var(--text-main)" }}>
                        {act.issuedBy}
                      </td>

                      <td style={{ padding: "14px", fontSize: "12px", color: "var(--text-secondary)" }}>
                        <div>{act.durationDays ? `${act.durationDays} Days` : "Permanent"}</div>
                        {act.expiresAt && (
                          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                            Expires: {new Date(act.expiresAt).toLocaleDateString()}
                          </div>
                        )}
                      </td>

                      <td style={{ padding: "14px" }}>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: "10px",
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            backgroundColor: sBadge.bg,
                            color: sBadge.color,
                          }}
                        >
                          {act.status}
                        </span>
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
