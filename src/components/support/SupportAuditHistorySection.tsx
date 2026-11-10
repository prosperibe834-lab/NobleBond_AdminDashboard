import React, { useState } from "react";
import { History, Search, Lock, ArrowUpDown } from "lucide-react";
import type { SupportAuditEvent } from "../../types/supportManagement.types";
import { Badge } from "../common/Badge";
import { formatDateTime } from "./supportUiUtils";
import { SupportPagination } from "./SupportPagination";

interface SupportAuditHistorySectionProps {
  events: SupportAuditEvent[];
}

export const SupportAuditHistorySection: React.FC<
  SupportAuditHistorySectionProps
> = ({ events }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const filtered = events
    .filter((ev) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQ =
        !q ||
        ev.id.toLowerCase().includes(q) ||
        ev.actorName.toLowerCase().includes(q) ||
        ev.actionLabel.toLowerCase().includes(q) ||
        (ev.ticketId || "").toLowerCase().includes(q) ||
        (ev.customerName || "").toLowerCase().includes(q) ||
        (ev.reason || "").toLowerCase().includes(q);
      const matchAct = actionFilter === "all" || ev.actionType === actionFilter;
      return matchQ && matchAct;
    })
    .sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        : new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "var(--bg-surface-elevated)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)" }}>
            <History size={18} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>
                Immutable Support Audit History ({filtered.length})
              </h3>
              <Badge variant="neutral" size="sm">
                <Lock size={11} style={{ marginRight: "4px" }} />
                Append-Only
              </Badge>
            </div>
            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
              Chronological compliance record of replies, internal notes, assignments, escalations, resolutions &amp; config updates
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setCurrentPage(1);
                setSearchQuery(e.target.value);
              }}
              placeholder="Search ticket, actor, action..."
              style={{ background: "var(--bg-surface-elevated)", border: "1px solid var(--border)", color: "var(--text-main)", borderRadius: "9px", padding: "8px 10px 8px 31px", fontSize: "0.8rem", width: "215px" }}
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => {
              setCurrentPage(1);
              setActionFilter(e.target.value);
            }}
            style={{ background: "var(--bg-surface-elevated)", border: "1px solid var(--border)", color: "var(--text-main)", borderRadius: "9px", padding: "8px 10px", fontSize: "0.79rem" }}
          >
            <option value="all">All Audited Actions</option>
            <option value="customer_reply_sent">Reply Sent</option>
            <option value="internal_note_added">Internal Note</option>
            <option value="ticket_assigned">Assigned</option>
            <option value="ticket_reassigned">Reassigned</option>
            <option value="priority_changed">Priority Changed</option>
            <option value="ticket_escalated">Escalated</option>
            <option value="ticket_resolved">Resolved</option>
            <option value="ticket_reopened">Reopened</option>
            <option value="ticket_closed">Closed</option>
            <option value="template_updated">Template Change</option>
            <option value="kb_updated">KB Article Change</option>
            <option value="settings_updated">Settings Change</option>
          </select>

          <button
            type="button"
            onClick={() => setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))}
            style={{ background: "var(--bg-surface-elevated)", border: "1px solid var(--border)", color: "var(--text-main)", borderRadius: "9px", padding: "8px 10px", fontSize: "0.79rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
          >
            <ArrowUpDown size={13} />
            <span>{sortOrder === "newest" ? "Newest" : "Oldest"}</span>
          </button>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)", textAlign: "left" }}>
              <th style={{ padding: "10px 8px" }}>Event ID / Time</th>
              <th style={{ padding: "10px 8px" }}>Ticket &amp; Customer</th>
              <th style={{ padding: "10px 8px" }}>Actor &amp; Role</th>
              <th style={{ padding: "10px 8px" }}>Action</th>
              <th style={{ padding: "10px 8px" }}>Change Diff</th>
              <th style={{ padding: "10px 8px" }}>Reason / Summary</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((ev) => (
              <tr key={ev.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                <td style={{ padding: "10px 8px" }}>
                  <div style={{ fontWeight: 700, color: "var(--primary)" }}>{ev.id}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{formatDateTime(ev.timestamp)}</div>
                </td>
                <td style={{ padding: "10px 8px" }}>
                  <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{ev.ticketId || "--"}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{ev.customerName || "--"}</div>
                </td>
                <td style={{ padding: "10px 8px" }}>
                  <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{ev.actorName}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{ev.actorRole}</div>
                </td>
                <td style={{ padding: "10px 8px" }}>
                  <Badge variant="info" size="sm">{ev.actionLabel}</Badge>
                </td>
                <td style={{ padding: "10px 8px", color: "var(--text-secondary)", fontSize: "0.75rem" }}>
                  {ev.previousValue || ev.newValue
                    ? `${ev.previousValue || "--"} -> ${ev.newValue || "--"}`
                    : "--"}
                </td>
                <td style={{ padding: "10px 8px", maxWidth: "280px", color: "var(--text-secondary)" }}>
                  {ev.reason || "--"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SupportPagination
        totalItems={filtered.length}
        currentPage={safePage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />
    </div>
  );
};

