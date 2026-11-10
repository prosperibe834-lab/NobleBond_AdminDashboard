// NobleBond Admin — Content Moderation Queue Section
// Granular content review queue, automated signal confidence meters, approve/reject workflow, zero emojis

import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Bot,
  ExternalLink,
  Search,
} from "lucide-react";
import type {
  ContentModerationItem,
  ContentReviewStatus,
} from "../../types/reportsModeration.types";

interface ContentModerationQueueProps {
  queue: ContentModerationItem[];
  onReviewItem: (item: ContentModerationItem, newStatus: ContentReviewStatus) => void;
  onInspectItem: (item: ContentModerationItem) => void;
  onOpenUserProfile?: (userId: string) => void;
}

const STATUS_FILTERS: { label: string; value: "all" | ContentReviewStatus }[] = [
  { label: "All Content Items", value: "all" },
  { label: "Pending Review", value: "pending_review" },
  { label: "Under Review", value: "under_review" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export const ContentModerationQueue: React.FC<ContentModerationQueueProps> = ({
  queue,
  onReviewItem,
  onInspectItem,
  onOpenUserProfile,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<"all" | ContentReviewStatus>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filtered = queue.filter((item) => {
    const matchesStatus =
      selectedStatus === "all" || item.reviewStatus === selectedStatus;
    const matchesSearch =
      !searchQuery.trim() ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.contentPreviewText && item.contentPreviewText.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: ContentReviewStatus) => {
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
      {/* Automated Moderation Signal Disclosure Banner */}
      <div
        style={{
          padding: "14px 18px",
          backgroundColor: "rgba(99, 102, 241, 0.06)",
          border: "1px solid rgba(99, 102, 241, 0.22)",
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: "12.5px",
          color: "var(--text-secondary)",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            backgroundColor: "rgba(99, 102, 241, 0.12)",
            color: "#6366F1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Bot size={18} />
        </div>
        <div style={{ flex: 1 }}>
          <strong style={{ color: "var(--text-main)" }}>Automated Moderation Signals Advisory:</strong>{" "}
          Automated confidence scores and label recommendations are heuristic review suggestions. They do not constitute conclusive proof of policy violation and require human moderator validation.
        </div>
      </div>

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
          {STATUS_FILTERS.map((f) => {
            const isSelected = selectedStatus === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setSelectedStatus(f.value)}
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
                {f.label}
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search content queue..."
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

      {/* Content Queue Table */}
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
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Item ID</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Content Target</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Owner</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Content Preview</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Automated Suggestion</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Review Status</th>
                <th style={{ padding: "12px 14px", fontWeight: 600, textAlign: "right" }}>
                  Quick Decision
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>
                    No content moderation items matching this status.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const sBadge = getStatusBadge(item.reviewStatus);

                  return (
                    <tr
                      key={item.id}
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
                        {item.id}
                      </td>

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
                          {item.contentType.replace(/_/g, " ")}
                        </span>
                      </td>

                      <td style={{ padding: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <img
                            src={item.owner.avatar}
                            alt={item.owner.name}
                            style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: "var(--text-main)", display: "flex", alignItems: "center", gap: "4px" }}>
                              <span>{item.owner.name}</span>
                              {onOpenUserProfile && (
                                <button
                                  onClick={() => onOpenUserProfile(item.owner.id)}
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
                              {item.owner.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: "14px" }}>
                        {item.contentPreviewUrl ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <img
                              src={item.contentPreviewUrl}
                              alt="Content preview"
                              style={{ width: "38px", height: "38px", borderRadius: "6px", objectFit: "cover" }}
                            />
                            <span style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                              Flagged Media
                            </span>
                          </div>
                        ) : (
                          <div
                            style={{
                              maxWidth: "260px",
                              fontSize: "12px",
                              color: "var(--text-main)",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              backgroundColor: "var(--bg-secondary)",
                              padding: "4px 8px",
                              borderRadius: "6px",
                            }}
                          >
                            "{item.contentPreviewText}"
                          </div>
                        )}
                      </td>

                      <td style={{ padding: "14px" }}>
                        {item.automatedSignal ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <Bot size={13} color="#6366F1" />
                              <span style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--text-main)" }}>
                                {Math.round(item.automatedSignal.confidence * 100)}% Confidence
                              </span>
                            </div>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                              {item.automatedSignal.suggestedLabel}
                            </div>
                          </div>
                        ) : (
                          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                            Manual submission
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
                          {item.reviewStatus.replace("_", " ")}
                        </span>
                      </td>

                      <td style={{ padding: "14px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "6px" }}>
                          {item.reviewStatus !== "approved" && (
                            <button
                              onClick={() => onReviewItem(item, "approved")}
                              title="Approve content as compliant"
                              style={{
                                padding: "5px 8px",
                                borderRadius: "6px",
                                border: "1px solid rgba(16, 185, 129, 0.3)",
                                backgroundColor: "rgba(16, 185, 129, 0.08)",
                                color: "var(--status-success)",
                                fontSize: "11.5px",
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "3px",
                              }}
                            >
                              <CheckCircle2 size={12} /> Approve
                            </button>
                          )}
                          {item.reviewStatus !== "rejected" && (
                            <button
                              onClick={() => onReviewItem(item, "rejected")}
                              title="Reject and remove content"
                              style={{
                                padding: "5px 8px",
                                borderRadius: "6px",
                                border: "1px solid rgba(220, 38, 38, 0.3)",
                                backgroundColor: "rgba(220, 38, 38, 0.08)",
                                color: "#DC2626",
                                fontSize: "11.5px",
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "3px",
                              }}
                            >
                              <XCircle size={12} /> Reject
                            </button>
                          )}
                          <button
                            onClick={() => onInspectItem(item)}
                            title="Inspect item details"
                            style={{
                              padding: "5px 10px",
                              borderRadius: "6px",
                              border: "1px solid var(--border)",
                              backgroundColor: "var(--bg-secondary)",
                              color: "var(--text-main)",
                              fontSize: "11.5px",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            Details
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
