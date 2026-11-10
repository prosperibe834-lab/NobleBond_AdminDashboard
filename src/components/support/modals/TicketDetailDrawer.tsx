import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  ExternalLink,
  Clock,
  Lock,
  Send,
  UserPlus,
  AlertTriangle,
} from "lucide-react";
import type {
  SupportCategoryGroup,
  SupportProgramSettings,
  SupportRolePermissions,
  SupportTicketRecord,
  TicketPriority,
  TicketStatus,
} from "../../../types/supportManagement.types";
import { SUPPORT_CATEGORY_CATALOG } from "../../../data/supportManagementDataService";
import { Badge } from "../../common/Badge";
import {
  evaluateTicketSlaStatus,
  formatDateTime,
  getPriorityMeta,
  getTicketStatusMeta,
} from "../supportUiUtils";

interface TicketDetailDrawerProps {
  ticket: SupportTicketRecord | null;
  settings: SupportProgramSettings;
  permissions: SupportRolePermissions;
  onClose: () => void;
  onOpenInInbox: (ticketId: string) => void;
  onSendMessageOrNote: (params: {
    ticketId: string;
    content: string;
    isInternalNote: boolean;
  }) => void;
  onUpdateAttr: (
    ticketId: string,
    updates: {
      status?: TicketStatus;
      priority?: TicketPriority;
      categoryGroup?: SupportCategoryGroup;
      category?: string;
    }
  ) => void;
  onOpenAssign: (ticket: SupportTicketRecord) => void;
  onOpenEscalate: (ticket: SupportTicketRecord) => void;
}

export const TicketDetailDrawer: React.FC<TicketDetailDrawerProps> = ({
  ticket,
  settings,
  permissions,
  onClose,
  onOpenInInbox,
  onSendMessageOrNote,
  onUpdateAttr,
  onOpenAssign,
  onOpenEscalate,
}) => {
  const navigate = useNavigate();
  const [noteInput, setNoteInput] = useState("");
  const [noteMode, setNoteMode] = useState<"internal_note" | "reply">("internal_note");

  if (!ticket) return null;

  const st = getTicketStatusMeta(ticket.status);
  const pr = getPriorityMeta(ticket.priority);
  const sla = evaluateTicketSlaStatus(ticket, settings);
  const subCategories = SUPPORT_CATEGORY_CATALOG[ticket.categoryGroup] || [ticket.category];

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    onSendMessageOrNote({
      ticketId: ticket.id,
      content: noteInput.trim(),
      isInternalNote: noteMode === "internal_note",
    });
    setNoteInput("");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 96,
        background: "rgba(0, 0, 0, 0.58)",
        display: "flex",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "560px",
          height: "100%",
          background: "var(--bg-card)",
          borderLeft: "1px solid var(--border)",
          padding: "22px",
          overflowY: "auto",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", flexWrap: "wrap" }}>
              <span style={{ fontWeight: 800, color: "var(--primary)", fontSize: "0.84rem" }}>
                {ticket.id}
              </span>
              <Badge variant={st.variant} size="sm">{st.label}</Badge>
              <Badge variant={pr.variant} size="sm">{pr.label}</Badge>
              <Badge variant="neutral" size="sm">{ticket.source}</Badge>
            </div>
            <h3 style={{ margin: "5px 0 0 0", fontSize: "1.06rem", fontWeight: 700, color: "var(--text-main)" }}>
              {ticket.subject}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "var(--bg-surface-elevated)", border: "1px solid var(--border)", color: "var(--text-secondary)", borderRadius: "8px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Section A: Ticket Info & Editable Controls */}
        <div style={{ background: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)", borderRadius: "13px", padding: "14px", display: "flex", flexDirection: "column", gap: "9px", fontSize: "0.8rem" }}>
          <div style={{ fontWeight: 700, color: "var(--text-main)" }}>A. Ticket Metadata &amp; Controls</div>
          <div style={{ color: "var(--text-secondary)" }}>{ticket.description}</div>
          <div style={{ fontSize: "0.73rem", color: sla.isOverdue ? "var(--status-error)" : "var(--text-muted)" }}>
            SLA Status: <strong>{sla.summary}</strong> • Created {formatDateTime(ticket.createdAt)}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "4px" }}>
            <label style={{ fontSize: "0.74rem", fontWeight: 600, color: "var(--text-main)" }}>
              Category
              <select
                value={ticket.category}
                onChange={(e) => onUpdateAttr(ticket.id, { category: e.target.value })}
                style={{ width: "100%", marginTop: "3px", padding: "6px 8px", borderRadius: "7px", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-main)", fontSize: "0.77rem" }}
              >
                {subCategories.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </label>

            <label style={{ fontSize: "0.74rem", fontWeight: 600, color: "var(--text-main)" }}>
              Priority
              <select
                disabled={!permissions.canChangePriority}
                value={ticket.priority}
                onChange={(e) => onUpdateAttr(ticket.id, { priority: e.target.value as TicketPriority })}
                style={{ width: "100%", marginTop: "3px", padding: "6px 8px", borderRadius: "7px", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-main)", fontSize: "0.77rem" }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </label>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginTop: "4px" }}>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenInInbox(ticket.id);
              }}
              style={{ flex: 1, padding: "7px 11px", borderRadius: "8px", border: "none", background: "var(--primary)", color: "#fff", fontSize: "0.76rem", fontWeight: 700, cursor: "pointer" }}
            >
              Open Full Conversation in Inbox
            </button>
            {permissions.canAssignTickets && (
              <button
                type="button"
                onClick={() => onOpenAssign(ticket)}
                style={{ padding: "7px 10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-main)", fontSize: "0.76rem", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                <UserPlus size={13} />
                <span>{ticket.assignedAgentName}</span>
              </button>
            )}
            {permissions.canEscalateTickets && (
              <button
                type="button"
                onClick={() => onOpenEscalate(ticket)}
                style={{ padding: "7px 10px", borderRadius: "8px", border: "1px solid rgba(245, 158, 11, 0.45)", background: "var(--status-warning-bg)", color: "var(--status-warning)", fontSize: "0.76rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                <AlertTriangle size={13} />
                <span>Escalate</span>
              </button>
            )}
          </div>
        </div>

        {/* Section B: Customer Overview */}
        <div style={{ background: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)", borderRadius: "13px", padding: "13px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src={ticket.customerAvatar} alt={ticket.customerName} style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.86rem", color: "var(--text-main)" }}>B. {ticket.customerName}</div>
              <div style={{ fontSize: "0.73rem", color: "var(--text-muted)" }}>
                {ticket.customerUsername} • {permissions.canViewCustomerDetails ? ticket.customerEmail : "Email hidden"}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              type="button"
              onClick={() => navigate(`/users?userId=${encodeURIComponent(ticket.customerUserId)}`)}
              style={{ padding: "5px 9px", borderRadius: "7px", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--primary)", fontSize: "0.73rem", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "3px" }}
            >
              <span>Profile</span>
              <ExternalLink size={11} />
            </button>
            {permissions.canViewTransactionRefs && ticket.relatedModuleRoute && (
              <button
                type="button"
                onClick={() => navigate(ticket.relatedModuleRoute!)}
                style={{ padding: "5px 9px", borderRadius: "7px", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-main)", fontSize: "0.73rem", fontWeight: 600, cursor: "pointer" }}
              >
                {ticket.relatedModuleRoute.replace("/", "")}
              </button>
            )}
          </div>
        </div>

        {/* Sections C & D: Conversation & Private Notes Quick Composer */}
        <div style={{ background: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)", borderRadius: "13px", padding: "14px", display: "flex", flexDirection: "column", gap: "9px" }}>
          <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-main)" }}>
            C &amp; D. Conversation Messages &amp; Private Internal Notes ({ticket.messages.length})
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "220px", overflowY: "auto" }}>
            {ticket.messages.map((m) => (
              <div
                key={m.id}
                style={{
                  padding: "9px 11px",
                  borderRadius: "10px",
                  background: m.isInternalNote ? "var(--status-warning-bg)" : "var(--bg-card)",
                  border: m.isInternalNote ? "1px dashed var(--status-warning)" : "1px solid var(--border-light)",
                  fontSize: "0.77rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.69rem", color: m.isInternalNote ? "var(--status-warning)" : "var(--text-muted)", fontWeight: 700, marginBottom: "3px" }}>
                  <span>
                    {m.isInternalNote ? <Lock size={10} style={{ display: "inline", marginRight: "4px" }} /> : null}
                    {m.isInternalNote ? `INTERNAL NOTE — ${m.senderName}` : `${m.senderName} (${m.senderType})`}
                  </span>
                  <span>{formatDateTime(m.timestamp)}</span>
                </div>
                <div style={{ color: "var(--text-main)" }}>{m.content}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleQuickSubmit} style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                type="button"
                onClick={() => setNoteMode("internal_note")}
                style={{ padding: "4px 9px", borderRadius: "7px", border: noteMode === "internal_note" ? "1px solid var(--status-warning)" : "1px solid var(--border)", background: noteMode === "internal_note" ? "var(--status-warning-bg)" : "var(--bg-card)", color: noteMode === "internal_note" ? "var(--status-warning)" : "var(--text-muted)", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer" }}
              >
                Private Internal Note
              </button>
              <button
                type="button"
                onClick={() => setNoteMode("reply")}
                style={{ padding: "4px 9px", borderRadius: "7px", border: noteMode === "reply" ? "1px solid var(--primary)" : "1px solid var(--border)", background: noteMode === "reply" ? "var(--primary-glow)" : "var(--bg-card)", color: noteMode === "reply" ? "var(--primary)" : "var(--text-muted)", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer" }}
              >
                Customer Reply (Demo)
              </button>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <input
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                disabled={noteMode === "reply" ? !permissions.canReplyToCustomers : !permissions.canAddInternalNotes}
                placeholder={noteMode === "internal_note" ? "Add internal note (never sent to user)..." : "Add demonstration reply..."}
                style={{ flex: 1, padding: "8px 10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-main)", fontSize: "0.78rem" }}
              />
              <button
                type="submit"
                disabled={!noteInput.trim()}
                style={{ padding: "8px 12px", borderRadius: "8px", border: "none", background: noteMode === "internal_note" ? "var(--status-warning)" : "var(--primary)", color: "#fff", fontSize: "0.77rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
              >
                <Send size={12} />
                <span>Post</span>
              </button>
            </div>
          </form>
        </div>

        {/* Section E: Chronological Ticket Timeline */}
        <div style={{ background: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)", borderRadius: "13px", padding: "14px" }}>
          <div style={{ fontWeight: 700, fontSize: "0.84rem", color: "var(--text-main)", marginBottom: "9px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Clock size={14} style={{ color: "var(--status-info)" }} />
            E. Chronological Support Event Timeline
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {ticket.timeline.map((ev) => (
              <div key={ev.id} style={{ paddingLeft: "10px", borderLeft: "2px solid var(--primary)", fontSize: "0.76rem" }}>
                <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{ev.title}</div>
                <div style={{ color: "var(--text-secondary)" }}>{ev.description}</div>
                <div style={{ fontSize: "0.69rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  {formatDateTime(ev.timestamp)} • Actor: {ev.actor}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

