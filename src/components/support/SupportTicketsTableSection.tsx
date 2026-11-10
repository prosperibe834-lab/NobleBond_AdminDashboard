import React, { useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  Download,
  RotateCcw,
  RefreshCw,
  LayoutGrid,
  List,
  ArrowUpDown,
  UserPlus,
  CheckCircle2,
} from "lucide-react";
import type {
  SupportAgentRecord,
  SupportFilterState,
  SupportProgramSettings,
  SupportRolePermissions,
  SupportSortField,
  SupportTicketRecord,
} from "../../types/supportManagement.types";
import { Badge } from "../common/Badge";
import { SupportPagination } from "./SupportPagination";
import { SupportMobileCards } from "./SupportMobileCards";
import { SupportFilterDrawer } from "./SupportFilterDrawer";
import {
  evaluateTicketSlaStatus,
  formatDateTime,
  formatDurationMinutes,
  getPriorityMeta,
  getTicketStatusMeta,
} from "./supportUiUtils";
import {
  exportSupportTicketsCsv,
  filterAndSortSupportTickets,
} from "../../data/supportManagementDataService";

export type TicketQueueMode =
  | "all"
  | "my_tickets"
  | "unassigned"
  | "pending_responses"
  | "resolved";

interface SupportTicketsTableSectionProps {
  mode: TicketQueueMode;
  tickets: SupportTicketRecord[];
  agents: SupportAgentRecord[];
  settings: SupportProgramSettings;
  permissions: SupportRolePermissions;
  filters: SupportFilterState;
  onUpdateFilters: (next: SupportFilterState) => void;
  onResetFilters: () => void;
  onRefresh: () => void;
  onInspectTicket: (ticket: SupportTicketRecord) => void;
  onOpenInInbox: (ticketId: string) => void;
  onAssignToMe: (ticketId: string) => void;
  onReopenTicket: (ticketId: string) => void;
  onExportToast: (msg: string) => void;
}

export const SupportTicketsTableSection: React.FC<
  SupportTicketsTableSectionProps
> = ({
  mode,
  tickets,
  agents,
  settings,
  permissions,
  filters,
  onUpdateFilters,
  onResetFilters,
  onRefresh,
  onInspectTicket,
  onOpenInInbox,
  onAssignToMe,
  onReopenTicket,
  onExportToast,
}) => {
  const [sort, setSort] = useState<SupportSortField>("last_activity");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pendingSubFilter, setPendingSubFilter] = useState<
    "all" | "waiting_for_support" | "waiting_for_user"
  >("all");
  const [viewMode, setViewMode] = useState<"table" | "cards">(() =>
    typeof window !== "undefined" && window.innerWidth < 900 ? "cards" : "table"
  );

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 900) setViewMode("cards");
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scopedBase = tickets.filter((t) => {
    if (mode === "my_tickets") {
      return t.assignedAgentId === permissions.actorId && t.status !== "closed";
    }
    if (mode === "unassigned") {
      return !t.assignedAgentId && t.status !== "resolved" && t.status !== "closed";
    }
    if (mode === "pending_responses") {
      if (pendingSubFilter === "waiting_for_support") {
        return t.status === "waiting_for_support" || t.status === "new" || t.status === "open";
      }
      if (pendingSubFilter === "waiting_for_user") {
        return t.status === "waiting_for_user";
      }
      return (
        t.status === "waiting_for_support" ||
        t.status === "waiting_for_user" ||
        t.status === "new" ||
        t.status === "open"
      );
    }
    if (mode === "resolved") {
      return t.status === "resolved" || t.status === "closed";
    }
    return true;
  });

  const filtered = filterAndSortSupportTickets(scopedBase, filters, sort, settings);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const sectionMeta = {
    all: {
      title: `All Support Tickets (${filtered.length})`,
      desc: "Complete multi-channel support operations directory across all statuses & categories",
    },
    my_tickets: {
      title: `My Assigned Queue — ${permissions.actorName} (${filtered.length})`,
      desc: "Active tickets assigned directly to your role profile",
    },
    unassigned: {
      title: `Unassigned Triage Queue (${filtered.length})`,
      desc: "Incoming inquiries awaiting agent ownership or specialist routing",
    },
    pending_responses: {
      title: `Pending Responses Monitor (${filtered.length})`,
      desc: "Separate queue visibility between tickets awaiting Support reply vs awaiting Customer reply",
    },
    resolved: {
      title: `Resolved & Closed Tickets (${filtered.length})`,
      desc: "Completed inquiries with resolution times, submitted CSAT feedback, and reopen eligibility",
    },
  }[mode];

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "18px",
      }}
    >
      {/* Header & Controls */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>
            {sectionMeta.title}
          </h3>
          <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "2px" }}>
            {sectionMeta.desc}
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Search
              size={14}
              style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
            />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => {
                setCurrentPage(1);
                onUpdateFilters({ ...filters, searchQuery: e.target.value });
              }}
              placeholder="Search ticket ID, customer, email..."
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-main)",
                borderRadius: "9px",
                padding: "8px 10px 8px 32px",
                fontSize: "0.8rem",
                width: "220px",
              }}
            />
          </div>

          <select
            aria-label="Priority Filter"
            value={filters.priority}
            onChange={(e) => {
              setCurrentPage(1);
              onUpdateFilters({
                ...filters,
                priority: e.target.value as SupportFilterState["priority"],
              });
            }}
            style={{
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-main)",
              borderRadius: "9px",
              padding: "8px 10px",
              fontSize: "0.79rem",
            }}
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <ArrowUpDown size={14} style={{ color: "var(--text-muted)" }} />
            <select
              aria-label="Sort Tickets"
              value={sort}
              onChange={(e) => setSort(e.target.value as SupportSortField)}
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-main)",
                borderRadius: "9px",
                padding: "8px 10px",
                fontSize: "0.79rem",
              }}
            >
              <option value="last_activity">Sort: Last Activity</option>
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="priority_desc">Sort: Highest Priority</option>
              <option value="sla_risk">Sort: SLA Risk</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            style={{
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-main)",
              borderRadius: "9px",
              padding: "8px 11px",
              fontSize: "0.79rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentPage(1);
              onResetFilters();
            }}
            style={{
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              borderRadius: "9px",
              padding: "8px 10px",
              fontSize: "0.78rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <RotateCcw size={13} />
            <span>Clear</span>
          </button>

          <button
            type="button"
            onClick={onRefresh}
            style={{
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-main)",
              borderRadius: "9px",
              padding: "8px 10px",
              cursor: "pointer",
            }}
            title="Refresh Ticket List"
          >
            <RefreshCw size={13} />
          </button>

          <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: "9px", overflow: "hidden" }}>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              title="Table View"
              style={{
                padding: "7px 9px",
                border: "none",
                background: viewMode === "table" ? "var(--primary-glow)" : "var(--bg-surface-elevated)",
                color: viewMode === "table" ? "var(--primary)" : "var(--text-muted)",
                cursor: "pointer",
              }}
            >
              <List size={15} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              title="Card View"
              style={{
                padding: "7px 9px",
                border: "none",
                background: viewMode === "cards" ? "var(--primary-glow)" : "var(--bg-surface-elevated)",
                color: viewMode === "cards" ? "var(--primary)" : "var(--text-muted)",
                cursor: "pointer",
              }}
            >
              <LayoutGrid size={15} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              exportSupportTicketsCsv(filtered);
              onExportToast(`Exported ${filtered.length} support tickets (privacy-safe) to CSV.`);
            }}
            style={{
              background: "var(--primary)",
              border: "none",
              color: "#fff",
              borderRadius: "9px",
              padding: "8px 12px",
              fontSize: "0.79rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {mode === "pending_responses" && (
        <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginBottom: "14px" }}>
          {(
            [
              { key: "all", label: "All Waiting Responses" },
              { key: "waiting_for_support", label: "Awaiting Support Reply (SLA Active)" },
              { key: "waiting_for_user", label: "Awaiting Customer Reply (SLA Paused)" },
            ] as const
          ).map((pill) => (
            <button
              key={pill.key}
              type="button"
              onClick={() => {
                setCurrentPage(1);
                setPendingSubFilter(pill.key);
              }}
              style={{
                padding: "6px 12px",
                borderRadius: "999px",
                border: pendingSubFilter === pill.key ? "1px solid var(--primary)" : "1px solid var(--border)",
                background: pendingSubFilter === pill.key ? "var(--primary-glow)" : "var(--bg-surface-elevated)",
                color: pendingSubFilter === pill.key ? "var(--primary)" : "var(--text-secondary)",
                fontSize: "0.76rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {pill.label}
            </button>
          ))}
        </div>
      )}

      {paginated.length === 0 ? (
        <div style={{ padding: "40px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.87rem" }}>
          No support tickets match your active filters in this queue.
        </div>
      ) : viewMode === "cards" ? (
        <SupportMobileCards
          tickets={paginated}
          settings={settings}
          onInspectTicket={onInspectTicket}
          onOpenInInbox={onOpenInInbox}
        />
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)", textAlign: "left" }}>
                <th style={{ padding: "10px 8px" }}>Ticket ID &amp; Source</th>
                <th style={{ padding: "10px 8px" }}>Customer</th>
                <th style={{ padding: "10px 8px" }}>Subject &amp; Category</th>
                <th style={{ padding: "10px 8px" }}>Priority &amp; SLA</th>
                <th style={{ padding: "10px 8px" }}>Assigned Agent</th>
                <th style={{ padding: "10px 8px" }}>Status</th>
                <th style={{ padding: "10px 8px" }}>Last Activity</th>
                <th style={{ padding: "10px 8px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((t) => {
                const st = getTicketStatusMeta(t.status);
                const pr = getPriorityMeta(t.priority);
                const sla = evaluateTicketSlaStatus(t, settings);
                const resMins = t.resolvedAt
                  ? Math.round((new Date(t.resolvedAt).getTime() - new Date(t.createdAt).getTime()) / 60000)
                  : null;

                return (
                  <tr
                    key={t.id}
                    onClick={() => onInspectTicket(t)}
                    style={{ borderBottom: "1px solid var(--border-light)", cursor: "pointer" }}
                  >
                    <td style={{ padding: "10px 8px" }}>
                      <div style={{ fontWeight: 700, color: "var(--primary)" }}>
                        {t.id} {t.unreadBySupport ? "•" : ""}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{t.source}</div>
                    </td>
                    <td style={{ padding: "10px 8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <img src={t.customerAvatar} alt={t.customerName} style={{ width: "26px", height: "26px", borderRadius: "50%", objectFit: "cover" }} />
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{t.customerName}</div>
                          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{t.customerUsername}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "10px 8px", maxWidth: "260px" }}>
                      <div style={{ fontWeight: 600, color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {t.subject}
                      </div>
                      <div style={{ fontSize: "0.71rem", color: "var(--text-muted)" }}>
                        {t.categoryGroup} -&gt; {t.category}
                      </div>
                    </td>
                    <td style={{ padding: "10px 8px" }}>
                      <Badge variant={pr.variant} size="sm">{pr.label}</Badge>
                      <div style={{ fontSize: "0.7rem", color: sla.isOverdue ? "var(--status-error)" : "var(--text-muted)", marginTop: "3px" }}>
                        {mode === "resolved" && resMins !== null
                          ? `Resolved in ${formatDurationMinutes(resMins)}`
                          : sla.summary}
                      </div>
                    </td>
                    <td style={{ padding: "10px 8px", color: "var(--text-main)", fontWeight: 600 }}>
                      {t.assignedAgentName}
                    </td>
                    <td style={{ padding: "10px 8px" }}>
                      <Badge variant={st.variant} size="sm">{st.label}</Badge>
                      {t.satisfaction && (
                        <div style={{ fontSize: "0.69rem", color: "var(--status-success)", marginTop: "2px" }}>
                          CSAT: {t.satisfaction.rating}/5
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "10px 8px", color: "var(--text-secondary)" }}>
                      {formatDateTime(t.lastActivityAt)}
                    </td>
                    <td style={{ padding: "10px 8px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "5px" }}>
                        {mode === "unassigned" && permissions.canAssignTickets && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAssignToMe(t.id);
                            }}
                            style={{
                              padding: "5px 9px",
                              borderRadius: "7px",
                              border: "none",
                              background: "var(--status-success)",
                              color: "#fff",
                              fontSize: "0.73rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <UserPlus size={12} />
                            <span>Claim</span>
                          </button>
                        )}
                        {mode === "resolved" &&
                          t.status === "resolved" &&
                          permissions.canResolveTickets && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onReopenTicket(t.id);
                              }}
                              style={{
                                padding: "5px 9px",
                                borderRadius: "7px",
                                border: "1px solid var(--border)",
                                background: "var(--bg-surface-elevated)",
                                color: "var(--text-main)",
                                fontSize: "0.73rem",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Reopen
                            </button>
                          )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenInInbox(t.id);
                          }}
                          style={{
                            padding: "5px 9px",
                            borderRadius: "7px",
                            border: "none",
                            background: "var(--primary)",
                            color: "#fff",
                            fontSize: "0.73rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <CheckCircle2 size={12} />
                          <span>Inbox</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

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

      <SupportFilterDrawer
        isOpen={drawerOpen}
        filters={filters}
        agents={agents}
        onUpdateFilters={(next) => {
          setCurrentPage(1);
          onUpdateFilters(next);
        }}
        onResetFilters={() => {
          setCurrentPage(1);
          onResetFilters();
        }}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};

