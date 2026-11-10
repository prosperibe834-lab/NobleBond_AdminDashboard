// NobleBond Admin — Messaging Restrictions Table
// Clear separation of user-initiated blocks vs administrative sanctions, zero emojis

import React from "react";
import {
  ShieldAlert,
  UserX,
  Lock,
  Unlock,
  Clock,
  CheckCircle2,
  Plus,
} from "lucide-react";
import type { MessagingRestrictionRecord } from "../../types/chatManagement.types";

interface MessagingRestrictionsTableProps {
  restrictions: MessagingRestrictionRecord[];
  onOpenAddModal: () => void;
  onOpenRevokeModal: (restriction: MessagingRestrictionRecord) => void;
  onOpenUserProfile?: (userId: string) => void;
}

export const MessagingRestrictionsTable: React.FC<MessagingRestrictionsTableProps> = ({
  restrictions,
  onOpenAddModal,
  onOpenRevokeModal,
  onOpenUserProfile,
}) => {
  const getTypeBadge = (type: MessagingRestrictionRecord["restrictionType"], imposedBy: string) => {
    if (imposedBy === "user") {
      return (
        <span
          style={{
            padding: "3px 8px",
            borderRadius: "6px",
            fontSize: "11px",
            fontWeight: 700,
            backgroundColor: "rgba(107, 114, 128, 0.12)",
            color: "#4B5563",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <UserX size={12} /> Voluntary User Block
        </span>
      );
    }

    switch (type) {
      case "temporary_restriction":
        return (
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 700,
              backgroundColor: "rgba(245, 158, 11, 0.12)",
              color: "#D97706",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Clock size={12} /> Admin Temporary
          </span>
        );
      case "permanent_restriction":
        return (
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 800,
              backgroundColor: "rgba(220, 38, 38, 0.12)",
              color: "#DC2626",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Lock size={12} /> Admin Permanent
          </span>
        );
      case "expired_restriction":
        return (
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: "rgba(107, 114, 128, 0.12)",
              color: "#6B7280",
            }}
          >
            Expired
          </span>
        );
      default:
        return null;
    }
  };

  const getScopeBadge = (scope: MessagingRestrictionRecord["scope"]) => {
    const formatted = scope.replace(/_/g, " ");
    return (
      <span
        style={{
          padding: "2px 6px",
          borderRadius: "4px",
          fontSize: "11px",
          fontWeight: 600,
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border)",
          color: "var(--text-secondary)",
          textTransform: "capitalize",
        }}
      >
        {formatted}
      </span>
    );
  };

  const getStatusBadge = (status: MessagingRestrictionRecord["status"]) => {
    switch (status) {
      case "active":
        return (
          <span
            style={{
              padding: "2px 7px",
              borderRadius: "5px",
              fontSize: "10.5px",
              fontWeight: 700,
              backgroundColor: "rgba(220, 38, 38, 0.12)",
              color: "#DC2626",
            }}
          >
            Active
          </span>
        );
      case "expired":
        return (
          <span
            style={{
              padding: "2px 7px",
              borderRadius: "5px",
              fontSize: "10.5px",
              fontWeight: 600,
              backgroundColor: "rgba(107, 114, 128, 0.12)",
              color: "#6B7280",
            }}
          >
            Expired
          </span>
        );
      case "revoked":
        return (
          <span
            style={{
              padding: "2px 7px",
              borderRadius: "5px",
              fontSize: "10.5px",
              fontWeight: 700,
              backgroundColor: "rgba(16, 185, 129, 0.12)",
              color: "var(--status-success)",
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <CheckCircle2 size={11} /> Revoked
          </span>
        );
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Top Banner & Impose Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          padding: "16px 20px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "8px",
              backgroundColor: "rgba(220, 38, 38, 0.08)",
              color: "#DC2626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lock size={18} />
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)" }}>
              Communication Sanctions &amp; Boundary Management
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              User blocks are personal privacy decisions. Administrative restrictions are enforced platform sanctions.
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          style={{
            padding: "8px 16px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "var(--primary)",
            color: "#ffffff",
            fontSize: "12.5px",
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 2px 8px rgba(139, 29, 65, 0.25)",
          }}
        >
          <Plus size={15} /> Impose Admin Restriction
        </button>
      </div>

      {/* Restrictions Table */}
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
                  backgroundColor: "var(--bg-surface)",
                  borderBottom: "1px solid var(--border)",
                  color: "var(--text-secondary)",
                  fontSize: "11.5px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                <th style={{ padding: "14px 18px" }}>Restricted User</th>
                <th style={{ padding: "14px 18px" }}>Type &amp; Authority</th>
                <th style={{ padding: "14px 18px" }}>Imposed By / Counterpart</th>
                <th style={{ padding: "14px 18px" }}>Scope</th>
                <th style={{ padding: "14px 18px", maxWidth: "260px" }}>Recorded Reason</th>
                <th style={{ padding: "14px 18px" }}>Timeline</th>
                <th style={{ padding: "14px 18px" }}>Status</th>
                <th style={{ padding: "14px 18px", textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {restrictions.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: "48px 24px",
                      textAlign: "center",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <ShieldAlert size={32} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
                    <div style={{ fontSize: "14.5px", fontWeight: 700 }}>
                      No messaging restrictions logged
                    </div>
                  </td>
                </tr>
              ) : (
                restrictions.map((r) => {
                  const appliedFormatted = new Date(r.appliedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                  const expiresFormatted = r.expiresAt
                    ? new Date(r.expiresAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "Permanent";

                  return (
                    <tr
                      key={r.id}
                      style={{
                        borderBottom: "1px solid var(--border)",
                        transition: "background-color 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--bg-surface-elevated)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      {/* User */}
                      <td style={{ padding: "14px 18px" }}>
                        <div
                          style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                          onClick={() => onOpenUserProfile?.(r.targetUser.id)}
                        >
                          <img
                            src={r.targetUser.avatar}
                            alt={r.targetUser.name}
                            style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: "var(--text-main)" }}>
                              {r.targetUser.name}
                            </div>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                              {r.targetUser.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Type & Authority */}
                      <td style={{ padding: "14px 18px" }}>
                        {getTypeBadge(r.restrictionType, r.imposedBy)}
                      </td>

                      {/* Imposed By */}
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ fontWeight: 600, color: "var(--text-main)" }}>
                          {r.initiatorName}
                        </div>
                        {r.counterpartUser && (
                          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                            Against: {r.counterpartUser.name}
                          </div>
                        )}
                      </td>

                      {/* Scope */}
                      <td style={{ padding: "14px 18px" }}>{getScopeBadge(r.scope)}</td>

                      {/* Reason */}
                      <td style={{ padding: "14px 18px", maxWidth: "260px" }}>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--text-secondary)",
                            lineHeight: 1.4,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={r.reason}
                        >
                          {r.reason}
                        </div>
                      </td>

                      {/* Timeline */}
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ fontSize: "12px", color: "var(--text-main)" }}>
                          {appliedFormatted} &rarr; {expiresFormatted}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "14px 18px" }}>{getStatusBadge(r.status)}</td>

                      {/* Action */}
                      <td style={{ padding: "14px 18px", textAlign: "right" }}>
                        {r.imposedBy === "admin" && r.status === "active" ? (
                          <button
                            type="button"
                            onClick={() => onOpenRevokeModal(r)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "8px",
                              border: "1px solid rgba(16, 185, 129, 0.3)",
                              backgroundColor: "rgba(16, 185, 129, 0.08)",
                              color: "var(--status-success)",
                              fontSize: "12px",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <Unlock size={13} /> Revoke
                          </button>
                        ) : r.imposedBy === "user" ? (
                          <span
                            style={{
                              fontSize: "11px",
                              color: "var(--text-muted)",
                              fontStyle: "italic",
                            }}
                          >
                            User Consent Protected
                          </span>
                        ) : (
                          <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>None</span>
                        )}
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
