import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Send,
  Lock,
  Paperclip,
  Eye,
  FileText,
  User,
  ExternalLink,
  ArrowLeft,
  UserPlus,
  AlertTriangle,
  CheckCircle2,
  X,
  RotateCcw,
} from "lucide-react";
import type {
  SupportAgentRecord,
  SupportCategoryGroup,
  SupportProgramSettings,
  SupportResponseTemplate,
  SupportRolePermissions,
  SupportTicketRecord,
  TicketPriority,
  TicketStatus,
} from "../../types/supportManagement.types";
import type { SupportCustomerDirectoryItem } from "../../data/supportManagementDataService";
import { SUPPORT_CATEGORY_CATALOG } from "../../data/supportManagementDataService";
import { Badge } from "../common/Badge";
import {
  evaluateTicketSlaStatus,
  formatDateTime,
  formatShortDate,
  getPriorityMeta,
  getTicketStatusMeta,
} from "./supportUiUtils";

interface SupportInboxSectionProps {
  tickets: SupportTicketRecord[];
  agents: SupportAgentRecord[];
  templates: SupportResponseTemplate[];
  customers: SupportCustomerDirectoryItem[];
  settings: SupportProgramSettings;
  permissions: SupportRolePermissions;
  selectedTicketId: string | null;
  draftPresetText?: string;
  onSelectTicket: (id: string) => void;
  onSendMessageOrNote: (params: {
    ticketId: string;
    content: string;
    isInternalNote: boolean;
    attachmentNames?: string[];
  }) => void;
  onUpdateTicketAttr: (
    ticketId: string,
    updates: {
      status?: TicketStatus;
      priority?: TicketPriority;
      categoryGroup?: SupportCategoryGroup;
      category?: string;
    }
  ) => void;
  onOpenAssignModal: (ticket: SupportTicketRecord) => void;
  onOpenEscalateModal: (ticket: SupportTicketRecord) => void;
  onInspectTicketDossier: (ticket: SupportTicketRecord) => void;
}

type InboxPill =
  | "all"
  | "unread"
  | "open"
  | "new"
  | "in_progress"
  | "waiting_for_user"
  | "waiting_for_support"
  | "escalated"
  | "resolved"
  | "unassigned"
  | "assigned_to_me";

export const SupportInboxSection: React.FC<SupportInboxSectionProps> = ({
  tickets,
  agents,
  templates,
  customers,
  settings,
  permissions,
  selectedTicketId,
  draftPresetText,
  onSelectTicket,
  onSendMessageOrNote,
  onUpdateTicketAttr,
  onOpenAssignModal,
  onOpenEscalateModal,
  onInspectTicketDossier,
}) => {
  const navigate = useNavigate();
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1400
  );
  const [mobileShowThread, setMobileShowThread] = useState<boolean>(false);
  const [showCustomerDrawerOnCompact, setShowCustomerDrawerOnCompact] =
    useState<boolean>(false);

  // Inbox filters & sort
  const [inboxPill, setInboxPill] = useState<InboxPill>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [agentFilter, setAgentFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"last_activity" | "newest" | "oldest">(
    "last_activity"
  );

  // Composer state
  const [composerMode, setComposerMode] = useState<"reply" | "internal_note">(
    "reply"
  );
  const [composerText, setComposerText] = useState<string>(draftPresetText || "");
  const [pendingAttachments, setPendingAttachments] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = viewportWidth < 860;
  const showInlineCustomerPane = viewportWidth >= 1220;

  const filteredTickets = tickets
    .filter((t) => {
      if (inboxPill === "unread" && !t.unreadBySupport) return false;
      if (
        inboxPill === "open" &&
        (t.status === "resolved" || t.status === "closed")
      )
        return false;
      if (inboxPill === "new" && t.status !== "new") return false;
      if (inboxPill === "in_progress" && t.status !== "in_progress")
        return false;
      if (inboxPill === "waiting_for_user" && t.status !== "waiting_for_user")
        return false;
      if (
        inboxPill === "waiting_for_support" &&
        t.status !== "waiting_for_support"
      )
        return false;
      if (inboxPill === "escalated" && t.status !== "escalated") return false;
      if (
        inboxPill === "resolved" &&
        t.status !== "resolved" &&
        t.status !== "closed"
      )
        return false;
      if (inboxPill === "unassigned" && t.assignedAgentId !== null)
        return false;
      if (
        inboxPill === "assigned_to_me" &&
        t.assignedAgentId !== permissions.actorId
      )
        return false;

      if (priorityFilter !== "all" && t.priority !== priorityFilter)
        return false;
      if (categoryFilter !== "all" && t.categoryGroup !== categoryFilter)
        return false;
      if (agentFilter !== "all" && t.assignedAgentId !== agentFilter)
        return false;

      const q = searchQuery.toLowerCase().trim();
      if (q) {
        return (
          t.id.toLowerCase().includes(q) ||
          t.customerName.toLowerCase().includes(q) ||
          t.customerUsername.toLowerCase().includes(q) ||
          t.customerEmail.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "oldest")
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return (
        new Date(b.lastActivityAt).getTime() -
        new Date(a.lastActivityAt).getTime()
      );
    });

  const activeTicket =
    tickets.find((t) => t.id === selectedTicketId) ||
    filteredTickets[0] ||
    tickets[0] ||
    null;

  const customerRecord = activeTicket
    ? customers.find((c) => c.userId === activeTicket.customerUserId) || null
    : null;

  const customerPrevTickets = activeTicket
    ? tickets.filter(
        (t) =>
          t.customerUserId === activeTicket.customerUserId &&
          t.id !== activeTicket.id
      )
    : [];

  const handleSelectConversation = (id: string) => {
    onSelectTicket(id);
    if (isMobile) setMobileShowThread(true);
  };

  const handleSubmitMessage = () => {
    if (!activeTicket || !composerText.trim()) return;
    if (composerMode === "reply" && !permissions.canReplyToCustomers) return;
    if (composerMode === "internal_note" && !permissions.canAddInternalNotes)
      return;

    setIsSending(true);
    setTimeout(() => {
      onSendMessageOrNote({
        ticketId: activeTicket.id,
        content: composerText.trim(),
        isInternalNote: composerMode === "internal_note",
        attachmentNames:
          pendingAttachments.length > 0 ? pendingAttachments : undefined,
      });
      setComposerText("");
      setPendingAttachments([]);
      setShowPreview(false);
      setIsSending(false);
    }, 220);
  };

  const handleTemplateSelect = (tplId: string) => {
    const tpl = templates.find((item) => item.id === tplId);
    if (!tpl) return;
    setComposerText((prev) => (prev.trim() ? `${prev.trim()}\n\n${tpl.content}` : tpl.content));
  };

  const canUseCurrentMode =
    composerMode === "reply"
      ? permissions.canReplyToCustomers
      : permissions.canAddInternalNotes;

  const activeSla = activeTicket
    ? evaluateTicketSlaStatus(activeTicket, settings)
    : null;

  // Render Left Ticket List Panel
  const ticketListPane = (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "14px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxHeight: isMobile ? "none" : "760px",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 700, fontSize: "0.94rem", color: "var(--text-main)" }}>
          Support Queue ({filteredTickets.length})
        </span>
        <select
          aria-label="Inbox Sort"
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as "last_activity" | "newest" | "oldest")
          }
          style={{
            background: "var(--bg-surface-elevated)",
            border: "1px solid var(--border)",
            color: "var(--text-main)",
            borderRadius: "7px",
            padding: "4px 7px",
            fontSize: "0.73rem",
          }}
        >
          <option value="last_activity">Last Activity</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {/* Search */}
      <div style={{ position: "relative" }}>
        <Search
          size={14}
          style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)",
          }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search ID, customer, email, subject..."
          style={{
            width: "100%",
            background: "var(--bg-surface-elevated)",
            border: "1px solid var(--border)",
            color: "var(--text-main)",
            borderRadius: "9px",
            padding: "7px 10px 7px 31px",
            fontSize: "0.78rem",
          }}
        />
      </div>

      {/* Quick Filter Pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
        {(
          [
            { key: "all", label: "All" },
            { key: "unread", label: "Unread" },
            { key: "open", label: "Open" },
            { key: "new", label: "New" },
            { key: "in_progress", label: "In Progress" },
            { key: "waiting_for_user", label: "Wait User" },
            { key: "waiting_for_support", label: "Wait Support" },
            { key: "escalated", label: "Escalated" },
            { key: "resolved", label: "Resolved" },
            { key: "unassigned", label: "Unassigned" },
            { key: "assigned_to_me", label: "Mine" },
          ] as Array<{ key: InboxPill; label: string }>
        ).map((pill) => (
          <button
            key={pill.key}
            type="button"
            onClick={() => setInboxPill(pill.key)}
            style={{
              padding: "4px 8px",
              borderRadius: "999px",
              border:
                inboxPill === pill.key
                  ? "1px solid var(--primary)"
                  : "1px solid var(--border)",
              background:
                inboxPill === pill.key
                  ? "var(--primary-glow)"
                  : "var(--bg-surface-elevated)",
              color:
                inboxPill === pill.key
                  ? "var(--primary)"
                  : "var(--text-secondary)",
              fontSize: "0.7rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Compact Dropdowns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px" }}>
        <select
          aria-label="Inbox Priority"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          style={{
            background: "var(--bg-surface-elevated)",
            border: "1px solid var(--border)",
            color: "var(--text-main)",
            borderRadius: "7px",
            padding: "5px 6px",
            fontSize: "0.71rem",
          }}
        >
          <option value="all">Priority</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          aria-label="Inbox Category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            background: "var(--bg-surface-elevated)",
            border: "1px solid var(--border)",
            color: "var(--text-main)",
            borderRadius: "7px",
            padding: "5px 6px",
            fontSize: "0.71rem",
          }}
        >
          <option value="all">Category</option>
          {Object.keys(SUPPORT_CATEGORY_CATALOG).map((grp) => (
            <option key={grp} value={grp}>
              {grp.split(" ")[0]}
            </option>
          ))}
        </select>

        <select
          aria-label="Inbox Agent"
          value={agentFilter}
          onChange={(e) => setAgentFilter(e.target.value)}
          style={{
            background: "var(--bg-surface-elevated)",
            border: "1px solid var(--border)",
            color: "var(--text-main)",
            borderRadius: "7px",
            padding: "5px 6px",
            fontSize: "0.71rem",
          }}
        >
          <option value="all">Agent</option>
          {agents.map((ag) => (
            <option key={ag.id} value={ag.id}>
              {ag.name.split(" ")[0]}
            </option>
          ))}
        </select>
      </div>

      {/* Ticket Cards Scroll List */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", paddingRight: "2px" }}>
        {filteredTickets.length === 0 ? (
          <div style={{ padding: "28px 10px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem" }}>
            No support tickets match the active inbox filter.
          </div>
        ) : (
          filteredTickets.map((t) => {
            const isSelected = activeTicket?.id === t.id;
            const st = getTicketStatusMeta(t.status);
            const pr = getPriorityMeta(t.priority);
            const lastPublic =
              [...t.messages].filter((m) => !m.isInternalNote).pop()?.content ||
              t.description;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelectConversation(t.id)}
                style={{
                  textAlign: "left",
                  width: "100%",
                  padding: "11px",
                  borderRadius: "11px",
                  border: isSelected
                    ? "1px solid var(--primary)"
                    : "1px solid var(--border-light)",
                  background: isSelected
                    ? "var(--bg-active)"
                    : "var(--bg-surface-elevated)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {t.unreadBySupport && (
                      <span
                        title="Unread customer activity"
                        style={{
                          width: "7px",
                          height: "7px",
                          borderRadius: "50%",
                          background: "var(--primary)",
                        }}
                      />
                    )}
                    <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--primary)" }}>
                      {t.id}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <Badge variant={pr.variant} size="sm">{pr.label}</Badge>
                    <Badge variant={st.variant} size="sm">{st.label}</Badge>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <img
                    src={t.customerAvatar}
                    alt={t.customerName}
                    style={{ width: "26px", height: "26px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                  />
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {t.subject}
                  </div>
                </div>

                <div style={{ fontSize: "0.73rem", color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {lastPublic}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.69rem", color: "var(--text-muted)" }}>
                  <span>{t.customerName} • {t.assignedAgentName}</span>
                  <span>{formatDateTime(t.lastActivityAt)}</span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  // Render Customer Information Panel
  const renderCustomerPane = (t: SupportTicketRecord) => (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "13px",
        maxHeight: isMobile || !showInlineCustomerPane ? "none" : "760px",
        overflowY: "auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "6px" }}>
          <User size={15} style={{ color: "var(--primary)" }} />
          Customer Context
        </span>
        <button
          type="button"
          onClick={() => navigate(`/users?userId=${encodeURIComponent(t.customerUserId)}`)}
          style={{
            background: "var(--bg-surface-elevated)",
            border: "1px solid var(--border)",
            color: "var(--primary)",
            borderRadius: "7px",
            padding: "4px 8px",
            fontSize: "0.72rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span>User Profile</span>
          <ExternalLink size={11} />
        </button>
      </div>

      {!permissions.canViewCustomerDetails ? (
        <div style={{ padding: "18px", borderRadius: "11px", background: "var(--bg-surface-elevated)", color: "var(--text-muted)", fontSize: "0.78rem", textAlign: "center" }}>
          <Lock size={16} style={{ marginBottom: "5px" }} />
          <div>Customer personal contact fields restricted for role ({permissions.roleLabel}).</div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", borderRadius: "11px", background: "var(--bg-surface-elevated)" }}>
            <img src={t.customerAvatar} alt={t.customerName} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "0.86rem" }}>{t.customerName}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{t.customerUsername} • {t.customerCountry}</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.76rem", padding: "11px", borderRadius: "11px", background: "var(--bg-surface-elevated)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
              <span style={{ color: "var(--text-muted)" }}>Email:</span>
              <span style={{ color: "var(--text-main)", fontWeight: 600 }}>{t.customerEmail}</span>
            </div>
            {customerRecord && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Account Status:</span>
                  <Badge variant={customerRecord.accountStatus === "active" || customerRecord.accountStatus === "online" ? "success" : "warning"} size="sm">
                    {customerRecord.accountStatus.toUpperCase()}
                  </Badge>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Verification:</span>
                  <span style={{ fontWeight: 600, color: customerRecord.isVerified ? "var(--status-success)" : "var(--status-warning)" }}>
                    {customerRecord.isVerified ? "Verified" : "Unverified"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Joined:</span>
                  <span style={{ color: "var(--text-main)" }}>{formatShortDate(customerRecord.registrationDate)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Subscription:</span>
                  <strong style={{ color: "var(--text-main)" }}>{customerRecord.subscriptionPlan}</strong>
                </div>
              </>
            )}
          </div>

          {permissions.canViewTransactionRefs ? (
            <div style={{ padding: "11px", borderRadius: "11px", background: "var(--bg-surface-elevated)", fontSize: "0.75rem" }}>
              <div style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>
                Authorized Wallet &amp; Case Refs
              </div>
              {customerRecord && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <span style={{ color: "var(--accent-champagne)", fontWeight: 700 }}>{customerRecord.giftCoinsBalance} Coins</span>
                  <span style={{ color: "var(--accent-lavender)", fontWeight: 700 }}>{customerRecord.connectionPointsBalance} Pts</span>
                </div>
              )}
              {t.relatedModuleRoute && (
                <button
                  type="button"
                  onClick={() => navigate(t.relatedModuleRoute!)}
                  style={{
                    width: "100%",
                    marginTop: "4px",
                    padding: "6px 9px",
                    borderRadius: "7px",
                    border: "1px solid var(--border)",
                    background: "var(--bg-card)",
                    color: "var(--primary)",
                    fontSize: "0.74rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "5px",
                  }}
                >
                  <span>Open {t.relatedModuleRoute.replace("/", "")} Ref {t.relatedReferenceId || ""}</span>
                  <ExternalLink size={11} />
                </button>
              )}
            </div>
          ) : (
            <div style={{ padding: "9px 11px", borderRadius: "9px", background: "var(--status-warning-bg)", color: "var(--status-warning)", fontSize: "0.72rem", display: "flex", alignItems: "center", gap: "6px" }}>
              <Lock size={12} />
              <span>Billing &amp; transaction references hidden for current role.</span>
            </div>
          )}

          <div>
            <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>
              Previous Support Tickets ({customerPrevTickets.length})
            </div>
            {customerPrevTickets.length === 0 ? (
              <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>No prior tickets from this member.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {customerPrevTickets.map((pt) => (
                  <button
                    key={pt.id}
                    type="button"
                    onClick={() => onSelectTicket(pt.id)}
                    style={{
                      textAlign: "left",
                      padding: "7px 9px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-light)",
                      background: "var(--bg-surface-elevated)",
                      color: "var(--text-main)",
                      fontSize: "0.73rem",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: 700, color: "var(--primary)" }}>{pt.id}</div>
                    <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{pt.subject}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  // Render Centre Conversation + Composer Pane
  const conversationPane = activeTicket ? (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "640px",
        maxHeight: isMobile ? "none" : "760px",
      }}
    >
      {/* Top Conversation Header */}
      <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "12px", marginBottom: "12px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
            {isMobile && (
              <button
                type="button"
                onClick={() => setMobileShowThread(false)}
                style={{
                  padding: "6px 9px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-surface-elevated)",
                  color: "var(--text-main)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
                aria-label="Back to Ticket Queue"
              >
                <ArrowLeft size={15} />
              </button>
            )}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "7px", flexWrap: "wrap" }}>
                <span style={{ fontWeight: 800, color: "var(--primary)", fontSize: "0.84rem" }}>
                  {activeTicket.id}
                </span>
                <Badge variant="neutral" size="sm">{activeTicket.source}</Badge>
                {activeSla && (
                  <Badge variant={activeSla.isOverdue ? "error" : activeSla.isApproaching ? "warning" : "success"} size="sm">
                    {activeSla.summary}
                  </Badge>
                )}
              </div>
              <h3 style={{ margin: "4px 0 2px 0", fontSize: "1.02rem", fontWeight: 700, color: "var(--text-main)" }}>
                {activeTicket.subject}
              </h3>
              <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                {activeTicket.categoryGroup} -&gt; {activeTicket.category}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
            {!showInlineCustomerPane && (
              <button
                type="button"
                onClick={() => setShowCustomerDrawerOnCompact(true)}
                style={{
                  padding: "6px 10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-surface-elevated)",
                  color: "var(--text-main)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <User size={13} />
                <span>Customer</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onInspectTicketDossier(activeTicket)}
              style={{
                padding: "6px 10px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Timeline / Details
            </button>

            {permissions.canAssignTickets && (
              <button
                type="button"
                onClick={() => onOpenAssignModal(activeTicket)}
                style={{
                  padding: "6px 10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-surface-elevated)",
                  color: "var(--text-main)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <UserPlus size={13} />
                <span>{activeTicket.assignedAgentId ? activeTicket.assignedAgentName.split(" ")[0] : "Assign"}</span>
              </button>
            )}

            {permissions.canEscalateTickets && activeTicket.status !== "escalated" && (
              <button
                type="button"
                onClick={() => onOpenEscalateModal(activeTicket)}
                style={{
                  padding: "6px 10px",
                  borderRadius: "8px",
                  border: "1px solid rgba(245, 158, 11, 0.45)",
                  background: "var(--status-warning-bg)",
                  color: "var(--status-warning)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <AlertTriangle size={13} />
                <span>Escalate</span>
              </button>
            )}

            <select
              aria-label="Ticket Status"
              disabled={!permissions.canResolveTickets && activeTicket.status !== "resolved"}
              value={activeTicket.status}
              onChange={(e) =>
                onUpdateTicketAttr(activeTicket.id, {
                  status: e.target.value as TicketStatus,
                })
              }
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-main)",
                borderRadius: "8px",
                padding: "5px 8px",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              <option value="new">New</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting_for_support">Waiting Support</option>
              <option value="waiting_for_user">Waiting User</option>
              <option value="escalated">Escalated</option>
              {permissions.canResolveTickets && <option value="resolved">Resolved</option>}
              {permissions.canCloseTickets && <option value="closed">Closed</option>}
            </select>

            {permissions.canChangePriority && (
              <select
                aria-label="Ticket Priority"
                value={activeTicket.priority}
                onChange={(e) =>
                  onUpdateTicketAttr(activeTicket.id, {
                    priority: e.target.value as TicketPriority,
                  })
                }
                style={{
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border)",
                  color: "var(--text-main)",
                  borderRadius: "8px",
                  padding: "5px 8px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Conversation Thread */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "11px", padding: "4px 2px 14px 2px" }}>
        {activeTicket.messages.map((msg) => {
          if (msg.isInternalNote) {
            if (!permissions.canAddInternalNotes && permissions.role === "support_auditor") {
              // auditors only see approved note audit or internal view; regular customer never sees internal notes
            }
            return (
              <div
                key={msg.id}
                style={{
                  background: "var(--status-warning-bg)",
                  border: "1px dashed var(--status-warning)",
                  borderRadius: "12px",
                  padding: "11px 13px",
                  fontSize: "0.8rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px", color: "var(--status-warning)", fontWeight: 700, fontSize: "0.72rem" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                    <Lock size={12} />
                    PRIVATE INTERNAL NOTE ({msg.senderName} — Never Sent to Customer)
                  </span>
                  <span>{formatDateTime(msg.timestamp)}</span>
                </div>
                <div style={{ color: "var(--text-main)", lineHeight: 1.45 }}>{msg.content}</div>
              </div>
            );
          }

          const isAgent = msg.senderType === "agent";
          return (
            <div
              key={msg.id}
              style={{
                alignSelf: isAgent ? "flex-end" : "flex-start",
                maxWidth: "85%",
                background: isAgent ? "var(--primary-glow)" : "var(--bg-surface-elevated)",
                border: isAgent ? "1px solid rgba(225, 29, 72, 0.3)" : "1px solid var(--border-light)",
                borderRadius: "13px",
                padding: "11px 14px",
                fontSize: "0.82rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "4px", fontSize: "0.71rem", color: "var(--text-muted)" }}>
                <strong style={{ color: isAgent ? "var(--primary)" : "var(--text-main)" }}>
                  {msg.senderName} ({msg.senderRole})
                </strong>
                <span>{formatDateTime(msg.timestamp)}</span>
              </div>
              <div style={{ color: "var(--text-main)", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                {msg.content}
              </div>

              {msg.attachments && msg.attachments.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "7px" }}>
                  {msg.attachments.map((att) => (
                    <span
                      key={att.id}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "3px 8px",
                        borderRadius: "6px",
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        fontSize: "0.7rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <Paperclip size={11} />
                      {att.name} ({att.sizeLabel})
                    </span>
                  ))}
                </div>
              )}

              {isAgent && msg.deliveryStatus === "demo_local" && (
                <div style={{ fontSize: "0.67rem", color: "var(--text-muted)", marginTop: "5px" }}>
                  Stored in local demonstration ledger (connect backend mailer/push provider for live dispatch)
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Composer */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          paddingTop: "12px",
          background:
            composerMode === "internal_note"
              ? "rgba(245, 158, 11, 0.06)"
              : "transparent",
          borderRadius: "12px",
          padding: composerMode === "internal_note" ? "12px" : "12px 0 0 0",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              type="button"
              onClick={() => setComposerMode("reply")}
              style={{
                padding: "5px 11px",
                borderRadius: "8px",
                border: composerMode === "reply" ? "1px solid var(--primary)" : "1px solid var(--border)",
                background: composerMode === "reply" ? "var(--primary-glow)" : "var(--bg-surface-elevated)",
                color: composerMode === "reply" ? "var(--primary)" : "var(--text-secondary)",
                fontSize: "0.74rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Public Reply (Demo)
            </button>
            <button
              type="button"
              onClick={() => setComposerMode("internal_note")}
              style={{
                padding: "5px 11px",
                borderRadius: "8px",
                border: composerMode === "internal_note" ? "1px solid var(--status-warning)" : "1px solid var(--border)",
                background: composerMode === "internal_note" ? "var(--status-warning-bg)" : "var(--bg-surface-elevated)",
                color: composerMode === "internal_note" ? "var(--status-warning)" : "var(--text-secondary)",
                fontSize: "0.74rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Lock size={11} />
              <span>Private Internal Note</span>
            </button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
            <select
              aria-label="Insert Response Template"
              value=""
              onChange={(e) => {
                if (e.target.value) handleTemplateSelect(e.target.value);
              }}
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-main)",
                borderRadius: "7px",
                padding: "5px 8px",
                fontSize: "0.73rem",
              }}
            >
              <option value="">Insert Template...</option>
              {templates
                .filter((tpl) => tpl.status === "active")
                .map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.name} ({tpl.category})
                  </option>
                ))}
            </select>

            <button
              type="button"
              onClick={() =>
                setPendingAttachments((prev) => [
                  ...prev,
                  `support_ref_${prev.length + 1}.png`,
                ])
              }
              style={{
                padding: "5px 9px",
                borderRadius: "7px",
                border: "1px solid var(--border)",
                background: "var(--bg-surface-elevated)",
                color: "var(--text-secondary)",
                fontSize: "0.73rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Paperclip size={12} />
              <span>Attach</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPreview((p) => !p)}
              style={{
                padding: "5px 9px",
                borderRadius: "7px",
                border: "1px solid var(--border)",
                background: showPreview ? "var(--primary-glow)" : "var(--bg-surface-elevated)",
                color: showPreview ? "var(--primary)" : "var(--text-secondary)",
                fontSize: "0.73rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Eye size={12} />
              <span>Preview</span>
            </button>
          </div>
        </div>

        {pendingAttachments.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
            {pendingAttachments.map((att, idx) => (
              <span
                key={`${att}-${idx}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "3px 8px",
                  borderRadius: "7px",
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border)",
                  fontSize: "0.72rem",
                  color: "var(--text-main)",
                }}
              >
                <FileText size={11} />
                <span>{att}</span>
                <button
                  type="button"
                  onClick={() =>
                    setPendingAttachments((prev) => prev.filter((_, i) => i !== idx))
                  }
                  style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 0 }}
                >
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        )}

        {showPreview && composerText.trim() && (
          <div
            style={{
              padding: "10px 12px",
              borderRadius: "10px",
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border)",
              marginBottom: "8px",
              fontSize: "0.79rem",
            }}
          >
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--primary)", marginBottom: "4px" }}>
              PREVIEW ({composerMode === "internal_note" ? "PRIVATE INTERNAL NOTE" : "CUSTOMER-FACING REPLY"})
            </div>
            <div style={{ whiteSpace: "pre-wrap", color: "var(--text-main)" }}>{composerText}</div>
          </div>
        )}

        <textarea
          rows={3}
          disabled={!canUseCurrentMode || isSending}
          maxLength={2000}
          value={composerText}
          onChange={(e) => setComposerText(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              e.preventDefault();
              handleSubmitMessage();
            }
          }}
          placeholder={
            !canUseCurrentMode
              ? `Role ${permissions.roleLabel} cannot send messages or internal notes.`
              : composerMode === "internal_note"
              ? "Write an agent-only internal note (never visible to the customer)..."
              : "Write a customer support response (Ctrl+Enter to submit demo reply)..."
          }
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: "10px",
            border:
              composerMode === "internal_note"
                ? "1px solid var(--status-warning)"
                : "1px solid var(--border)",
            background: "var(--bg-surface-elevated)",
            color: "var(--text-main)",
            fontSize: "0.82rem",
            resize: "vertical",
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", flexWrap: "wrap", gap: "8px" }}>
          <span style={{ fontSize: "0.71rem", color: "var(--text-muted)" }}>
            {composerText.length} / 2000 chars • Templates never auto-send without agent confirmation
          </span>

          <div style={{ display: "flex", gap: "7px", alignItems: "center" }}>
            {composerText.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setComposerText("");
                  setPendingAttachments([]);
                }}
                style={{
                  padding: "7px 11px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-surface-elevated)",
                  color: "var(--text-secondary)",
                  fontSize: "0.76rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <RotateCcw size={12} />
                <span>Clear</span>
              </button>
            )}

            {permissions.canResolveTickets && activeTicket.status !== "resolved" && (
              <button
                type="button"
                onClick={() =>
                  onUpdateTicketAttr(activeTicket.id, { status: "resolved" })
                }
                style={{
                  padding: "7px 12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(16, 185, 129, 0.45)",
                  background: "var(--status-success-bg)",
                  color: "var(--status-success)",
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <CheckCircle2 size={13} />
                <span>Resolve Ticket</span>
              </button>
            )}

            <button
              type="button"
              disabled={!canUseCurrentMode || !composerText.trim() || isSending}
              onClick={handleSubmitMessage}
              style={{
                padding: "8px 15px",
                borderRadius: "9px",
                border: "none",
                background:
                  !canUseCurrentMode || !composerText.trim()
                    ? "var(--bg-surface-elevated)"
                    : composerMode === "internal_note"
                    ? "var(--status-warning)"
                    : "var(--primary)",
                color:
                  !canUseCurrentMode || !composerText.trim()
                    ? "var(--text-muted)"
                    : "#fff",
                fontSize: "0.79rem",
                fontWeight: 700,
                cursor:
                  !canUseCurrentMode || !composerText.trim()
                    ? "not-allowed"
                    : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              {composerMode === "internal_note" ? <Lock size={13} /> : <Send size={13} />}
              <span>
                {isSending
                  ? "Saving..."
                  : composerMode === "internal_note"
                  ? "Add Private Note"
                  : "Send Demo Reply"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "48px 20px", textAlign: "center", color: "var(--text-muted)" }}>
      Select a support ticket from the queue to open its conversation.
    </div>
  );

  return (
    <div style={{ position: "relative" }}>
      {isMobile ? (
        mobileShowThread ? (
          conversationPane
        ) : (
          ticketListPane
        )
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: showInlineCustomerPane
              ? "310px minmax(420px, 1fr) 295px"
              : "310px 1fr",
            gap: "14px",
            alignItems: "stretch",
          }}
        >
          {ticketListPane}
          {conversationPane}
          {showInlineCustomerPane && activeTicket && renderCustomerPane(activeTicket)}
        </div>
      )}

      {/* Slide-over Customer Panel for Mobile / Tablet screens */}
      {showCustomerDrawerOnCompact && activeTicket && !showInlineCustomerPane && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 96,
            background: "rgba(0, 0, 0, 0.56)",
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={() => setShowCustomerDrawerOnCompact(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "360px",
              height: "100%",
              background: "var(--bg-card)",
              padding: "16px",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
              <button
                type="button"
                onClick={() => setShowCustomerDrawerOnCompact(false)}
                style={{
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border)",
                  color: "var(--text-main)",
                  borderRadius: "8px",
                  padding: "4px 9px",
                  fontSize: "0.76rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <X size={14} />
                <span>Close</span>
              </button>
            </div>
            {renderCustomerPane(activeTicket)}
          </div>
        </div>
      )}
    </div>
  );
};
