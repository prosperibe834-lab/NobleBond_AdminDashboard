// NobleBond Admin — Appeals & Reviews Table Section
// Member dispute reviews, consequence proposals, and appeal adjudications, zero emojis

import React, { useState } from "react";
import {
  UserCheck,
  ExternalLink,
  Search,
} from "lucide-react";
import type { AppealRecord, AppealStatus } from "../../types/reportsModeration.types";

interface AppealsReviewsTableProps {
  appeals: AppealRecord[];
  onOpenAppeal: (appeal: AppealRecord) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const AppealsReviewsTable: React.FC<AppealsReviewsTableProps> = ({
  appeals,
  onOpenAppeal,
  onOpenUserProfile,
}) => {
  const [statusFilter, setStatusFilter] = useState<"all" | AppealStatus>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filtered = appeals.filter((apl) => {
    const matchesStatus = statusFilter === "all" || apl.status === statusFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      apl.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apl.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apl.appealReason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apl.originalActionType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: AppealStatus) => {
    switch (status) {
      case "approved":
        return { bg: "rgba(16, 185, 129, 0.12)", color: "var(--status-success)" };
      case "rejected":
        return { bg: "rgba(220, 38, 38, 0.12)", color: "#DC2626" };
      case "under_review":
        return { bg: "rgba(59, 130, 246, 0.12)", color: "#2563EB" };
      case "escalated":
        return { bg: "rgba(147, 51, 234, 0.12)", color: "#9333EA" };
      default:
        return { bg: "rgba(245, 158, 11, 0.12)", color: "#D97706" };
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {/* Filter and Search Bar */}
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
          {["all", "pending", "under_review", "approved", "rejected", "escalated"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st as "all" | AppealStatus)}
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
              {st.replace("_", " ")}
            </button>
          ))}
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search appeals..."
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

      {/* Appeals Table */}
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
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Appeal ID</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Appealing Member</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Contested Action</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Member Appeal Reason</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Reviewer</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Status</th>
                <th style={{ padding: "12px 14px", fontWeight: 600, textAlign: "right" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>
                    No appeals found matching this status filter.
                  </td>
                </tr>
              ) : (
                filtered.map((apl) => {
                  const sBadge = getStatusBadge(apl.status);

                  return (
                    <tr
                      key={apl.id}
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
                        {apl.id}
                      </td>

                      <td style={{ padding: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <img
                            src={apl.user.avatar}
                            alt={apl.user.name}
                            style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: "var(--text-main)", display: "flex", alignItems: "center", gap: "4px" }}>
                              <span>{apl.user.name}</span>
                              {onOpenUserProfile && (
                                <button
                                  onClick={() => onOpenUserProfile(apl.user.id)}
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
                              {apl.user.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: "14px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span
                            style={{
                              padding: "2px 7px",
                              borderRadius: "4px",
                              fontSize: "11px",
                              fontWeight: 700,
                              backgroundColor: "rgba(220, 38, 38, 0.1)",
                              color: "#DC2626",
                              textTransform: "capitalize",
                              width: "fit-content",
                            }}
                          >
                            {apl.originalActionType.replace(/_/g, " ")}
                          </span>
                          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace" }}>
                            {apl.originalActionId}
                          </span>
                        </div>
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
                          "{apl.appealReason}"
                        </div>
                        {apl.proposedConsequence && (
                          <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                            Proposed: {apl.proposedConsequence}
                          </div>
                        )}
                      </td>

                      <td style={{ padding: "14px", fontSize: "12px", color: "var(--text-main)" }}>
                        {apl.assignedReviewer ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <UserCheck size={13} color="#2563EB" />
                            <span>{apl.assignedReviewer}</span>
                          </div>
                        ) : (
                          <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
                            Unassigned
                          </span>
                        )}
                      </td>

                      <td style={{ padding: "14px" }}>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: "10px",
                            fontSize: "11px",
                            fontWeight: 600,
                            backgroundColor: sBadge.bg,
                            color: sBadge.color,
                            textTransform: "capitalize",
                          }}
                        >
                          {apl.status.replace("_", " ")}
                        </span>
                      </td>

                      <td style={{ padding: "14px", textAlign: "right" }}>
                        <button
                          onClick={() => onOpenAppeal(apl)}
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
                          Review Case
                        </button>
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
