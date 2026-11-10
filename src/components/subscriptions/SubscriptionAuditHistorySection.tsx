// NobleBond Admin — Subscription Administrative Audit History (Immutable Append-Only)
// Tracks plan updates, pricing modifications, complimentary VIP grants, refunds, and entitlement edits. Zero emojis.

import React, { useState, useMemo } from "react";
import {
  Search,
  History,
  Download,
  Lock,
} from "lucide-react";
import type {
  SubscriptionAuditEvent,
  AdminRolePermissions,
} from "../../types/subscriptionManagement.types";
import { Badge } from "../common/Badge";
import { formatDateTime } from "./subscriptionUiUtils";

interface SubscriptionAuditHistorySectionProps {
  events: SubscriptionAuditEvent[];
  permissions: AdminRolePermissions;
  onExportCsv: (filtered: SubscriptionAuditEvent[]) => void;
}

export const SubscriptionAuditHistorySection: React.FC<SubscriptionAuditHistorySectionProps> = ({
  events,
  permissions,
  onExportCsv,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [adminFilter, setAdminFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");

  const admins = useMemo(() => {
    const s = new Set(events.map((e) => e.adminName));
    return Array.from(s);
  }, [events]);

  const actions = useMemo(() => {
    const s = new Set(events.map((e) => e.actionType));
    return Array.from(s);
  }, [events]);

  const filtered = useMemo(() => {
    return events.filter((ev) => {
      const matchAdmin = adminFilter === "all" || ev.adminName === adminFilter;
      const matchAction = actionFilter === "all" || ev.actionType === actionFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        ev.id.toLowerCase().includes(q) ||
        ev.targetLabel.toLowerCase().includes(q) ||
        ev.reason.toLowerCase().includes(q) ||
        ev.newValue.toLowerCase().includes(q);
      return matchAdmin && matchAction && matchQuery;
    });
  }, [events, adminFilter, actionFilter, searchQuery]);

  if (!permissions.canViewAuditHistory) {
    return (
      <div
        style={{
          padding: "48px 24px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Lock size={28} color="var(--status-warning)" />
        <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)" }}>
          Audit History Restricted
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Append-only Notice */}
      <div
        style={{
          padding: "10px 14px",
          borderRadius: "10px",
          backgroundColor: "var(--bg-surface-elevated)",
          border: "1px solid var(--border)",
          fontSize: "12px",
          color: "var(--text-secondary)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <History size={15} color="var(--primary)" />
        <span>
          <strong>Immutable Audit Trail:</strong> Subscription audit entries are strictly append-only. No editing or deletion controls exist for compliance accountability.
        </span>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          padding: "14px 16px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "7px 12px",
            borderRadius: "9px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--bg-surface-elevated)",
            flex: "1 1 240px",
            minWidth: "220px",
          }}
        >
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Event ID, Target subscriber/plan, Reason..."
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              color: "var(--text-main)",
              fontSize: "12.5px",
              width: "100%",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <select
            value={adminFilter}
            onChange={(e) => setAdminFilter(e.target.value)}
            style={{
              padding: "7px 10px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-main)",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            <option value="all">All Administrators</option>
            {admins.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            style={{
              padding: "7px 10px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-main)",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            <option value="all">All Action Types</option>
            {actions.map((act) => (
              <option key={act} value={act}>
                {act.replace(/_/g, " ").toUpperCase()}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => onExportCsv(filtered)}
            style={{
              padding: "7px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-main)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Download size={13} /> Export ({filtered.length})
          </button>
        </div>
      </div>

      {/* Audit Ledger Table */}
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          overflowX: "auto",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          <thead>
            <tr
              style={{
                backgroundColor: "var(--bg-surface-elevated)",
                borderBottom: "1px solid var(--border)",
                color: "var(--text-muted)",
                fontSize: "11.5px",
              }}
            >
              <th style={{ padding: "12px 14px" }}>EVENT ID</th>
              <th style={{ padding: "12px 14px" }}>ADMINISTRATOR</th>
              <th style={{ padding: "12px 14px" }}>ACTION</th>
              <th style={{ padding: "12px 14px" }}>TARGET PLAN / SUBSCRIBER</th>
              <th style={{ padding: "12px 14px" }}>STATE TRANSITION (PREV &rarr; NEW)</th>
              <th style={{ padding: "12px 14px" }}>REASON</th>
              <th style={{ padding: "12px 14px" }}>TIMESTAMP</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ev) => (
              <tr key={ev.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                <td style={{ padding: "12px 14px", fontFamily: "monospace", fontWeight: 700, color: "var(--primary)", whiteSpace: "nowrap" }}>
                  {ev.id}
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{ev.adminName}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{ev.adminRole}</div>
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <Badge variant={ev.actionType.includes("refund") || ev.actionType.includes("revoked") ? "warning" : "info"}>
                    {ev.actionType.replace(/_/g, " ").toUpperCase()}
                  </Badge>
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{ev.targetLabel}</div>
                  <div style={{ fontSize: "11px", fontFamily: "monospace", color: "var(--text-muted)" }}>
                    {ev.targetType.toUpperCase()} &bull; {ev.targetId}
                  </div>
                </td>
                <td style={{ padding: "12px 14px", fontSize: "11.5px", maxWidth: "240px" }}>
                  <div style={{ color: "var(--text-muted)" }}>Prev: {ev.previousValue}</div>
                  <div style={{ color: "var(--status-success)", fontWeight: 600, marginTop: "2px" }}>
                    New: {ev.newValue}
                  </div>
                </td>
                <td style={{ padding: "12px 14px", fontSize: "12px", color: "var(--text-secondary)", maxWidth: "240px" }}>
                  {ev.reason}
                </td>
                <td style={{ padding: "12px 14px", fontSize: "11.5px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                  {formatDateTime(ev.timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

