// NobleBond Admin — Moderation History & Audit Trail Section
// Immutable append-only audit ledger of all disciplinary actions and case state changes, zero emojis

import React, { useState } from "react";
import {
  Activity,
  UserCheck,
  Search,
} from "lucide-react";
import type { ModerationHistoryEvent } from "../../types/reportsModeration.types";

interface ModerationHistoryAuditTableProps {
  history: ModerationHistoryEvent[];
}

export const ModerationHistoryAuditTable: React.FC<ModerationHistoryAuditTableProps> = ({
  history,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filtered = history.filter((evt) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      evt.id.toLowerCase().includes(q) ||
      evt.targetUser.name.toLowerCase().includes(q) ||
      evt.actionType.toLowerCase().includes(q) ||
      evt.moderator.toLowerCase().includes(q) ||
      evt.reason.toLowerCase().includes(q) ||
      (evt.reportId && evt.reportId.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {/* Search & Audit Note Header */}
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
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              backgroundColor: "rgba(139, 29, 65, 0.12)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Activity size={18} />
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)" }}>
              Regulatory Compliance Audit Log
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              Immutable append-only records of all staff interventions and user penalties
            </div>
          </div>
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
            width: "260px",
          }}
        >
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail..."
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

      {/* History Table */}
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
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Event ID</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Case / Action Ref</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Target User</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Action Executed</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Factual Justification</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Responsible Moderator</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>State Transition</th>
                <th style={{ padding: "12px 14px", fontWeight: 600 }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>
                    No audit records matching this search query.
                  </td>
                </tr>
              ) : (
                filtered.map((evt) => (
                  <tr
                    key={evt.id}
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
                      {evt.id}
                    </td>

                    <td style={{ padding: "14px", fontFamily: "monospace", fontSize: "12px", color: "var(--text-secondary)" }}>
                      {evt.reportId || evt.actionId || "SYSTEM"}
                    </td>

                    <td style={{ padding: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <img
                          src={evt.targetUser.avatar}
                          alt={evt.targetUser.name}
                          style={{ width: "26px", height: "26px", borderRadius: "50%", objectFit: "cover" }}
                        />
                        <span style={{ fontWeight: 600, color: "var(--text-main)" }}>
                          {evt.targetUser.name}
                        </span>
                      </div>
                    </td>

                    <td style={{ padding: "14px" }}>
                      <span
                        style={{
                          padding: "2px 7px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: 700,
                          backgroundColor: "var(--bg-secondary)",
                          border: "1px solid var(--border)",
                          color: "var(--text-main)",
                          textTransform: "capitalize",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {evt.actionType.replace(/_/g, " ")}
                      </span>
                    </td>

                    <td style={{ padding: "14px" }}>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--text-secondary)",
                          maxWidth: "280px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {evt.reason}
                      </div>
                    </td>

                    <td style={{ padding: "14px", fontSize: "12px", color: "var(--text-main)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <UserCheck size={13} color="#2563EB" />
                        <span>{evt.moderator}</span>
                      </div>
                    </td>

                    <td style={{ padding: "14px", fontSize: "11px", color: "var(--text-muted)" }}>
                      <span>{evt.previousStatus || "none"}</span> &rarr;{" "}
                      <strong style={{ color: "var(--text-main)" }}>{evt.newStatus}</strong>
                    </td>

                    <td style={{ padding: "14px", fontSize: "12px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                      {new Date(evt.timestamp).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
