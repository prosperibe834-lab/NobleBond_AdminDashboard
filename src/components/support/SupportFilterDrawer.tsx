import React from "react";
import { X, RotateCcw, SlidersHorizontal } from "lucide-react";
import type {
  SupportAgentRecord,
  SupportFilterState,
} from "../../types/supportManagement.types";
import { SUPPORT_CATEGORY_CATALOG } from "../../data/supportManagementDataService";

interface SupportFilterDrawerProps {
  isOpen: boolean;
  filters: SupportFilterState;
  agents: SupportAgentRecord[];
  onUpdateFilters: (next: SupportFilterState) => void;
  onResetFilters: () => void;
  onClose: () => void;
}

export const SupportFilterDrawer: React.FC<SupportFilterDrawerProps> = ({
  isOpen,
  filters,
  agents,
  onUpdateFilters,
  onResetFilters,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 95,
        background: "rgba(0, 0, 0, 0.54)",
        display: "flex",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "390px",
          height: "100%",
          background: "var(--bg-card)",
          borderLeft: "1px solid var(--border)",
          padding: "22px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflowY: "auto",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <SlidersHorizontal size={18} style={{ color: "var(--primary)" }} />
              <h3 style={{ margin: 0, fontSize: "1.02rem", fontWeight: 700, color: "var(--text-main)" }}>
                Support Ticket Filters
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
                borderRadius: "8px",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={16} />
            </button>
          </div>

          <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.79rem", fontWeight: 600, color: "var(--text-main)" }}>
            Ticket Status
            <select
              value={filters.status}
              onChange={(e) =>
                onUpdateFilters({
                  ...filters,
                  status: e.target.value as SupportFilterState["status"],
                })
              }
              style={{ padding: "9px 10px", borderRadius: "9px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)", fontSize: "0.83rem" }}
            >
              <option value="all">All Ticket Statuses</option>
              <option value="open_bundle">All Open / Active</option>
              <option value="unread_only">Unread by Support</option>
              <option value="new">New</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting_for_support">Waiting for Support</option>
              <option value="waiting_for_user">Waiting for User</option>
              <option value="escalated">Escalated</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.79rem", fontWeight: 600, color: "var(--text-main)" }}>
            Priority Level
            <select
              value={filters.priority}
              onChange={(e) =>
                onUpdateFilters({
                  ...filters,
                  priority: e.target.value as SupportFilterState["priority"],
                })
              }
              style={{ padding: "9px 10px", borderRadius: "9px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)", fontSize: "0.83rem" }}
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.79rem", fontWeight: 600, color: "var(--text-main)" }}>
            Category Group
            <select
              value={filters.categoryGroup}
              onChange={(e) =>
                onUpdateFilters({
                  ...filters,
                  categoryGroup: e.target.value as SupportFilterState["categoryGroup"],
                })
              }
              style={{ padding: "9px 10px", borderRadius: "9px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)", fontSize: "0.83rem" }}
            >
              <option value="all">All Support Domains</option>
              {Object.keys(SUPPORT_CATEGORY_CATALOG).map((grp) => (
                <option key={grp} value={grp}>
                  {grp}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.79rem", fontWeight: 600, color: "var(--text-main)" }}>
            Assigned Support Agent
            <select
              value={filters.assignedAgentId}
              onChange={(e) =>
                onUpdateFilters({ ...filters, assignedAgentId: e.target.value })
              }
              style={{ padding: "9px 10px", borderRadius: "9px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)", fontSize: "0.83rem" }}
            >
              <option value="all">All Agents</option>
              <option value="unassigned">Unassigned Only</option>
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.name}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.79rem", fontWeight: 600, color: "var(--text-main)" }}>
            Support Source Channel
            <select
              value={filters.source}
              onChange={(e) =>
                onUpdateFilters({
                  ...filters,
                  source: e.target.value as SupportFilterState["source"],
                })
              }
              style={{ padding: "9px 10px", borderRadius: "9px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)", fontSize: "0.83rem" }}
            >
              <option value="all">All Configured Channels</option>
              <option value="In-App Support">In-App Support</option>
              <option value="Email Support">Email Support (support@noblebond.com)</option>
              <option value="Website Support">Website Support Form</option>
            </select>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.81rem", fontWeight: 600, color: "var(--text-main)", paddingTop: "4px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={filters.overdueOnly}
              onChange={(e) =>
                onUpdateFilters({ ...filters, overdueOnly: e.target.checked })
              }
              style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }}
            />
            <span>Show Overdue SLA Tickets Only</span>
          </label>
        </div>

        <div style={{ display: "flex", gap: "10px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
          <button
            type="button"
            onClick={onResetFilters}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--bg-surface-elevated)",
              color: "var(--text-main)",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <RotateCcw size={14} />
            <span>Reset Filters</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              background: "var(--primary)",
              color: "#fff",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

