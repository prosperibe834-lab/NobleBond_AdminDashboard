import React, { useState, useMemo, useEffect } from "react";
import {
  Headset,
  RefreshCw,
  RotateCcw,
  Shield,
  Calendar,
  AlertTriangle,
  LayoutDashboard,
  Inbox,
  ListOrdered,
  UserCheck,
  UserX,
  Clock,
  CheckCircle2,
  Users,
  FileText,
  BookOpen,
  BarChart3,
  Sliders,
  History,
  Lock,
  WifiOff,
} from "lucide-react";
import type {
  KnowledgeBaseArticle,
  SupportAgentRecord,
  SupportAuditEvent,
  SupportDateRange,
  SupportFilterState,
  SupportProgramSettings,
  SupportResponseTemplate,
  SupportRoleKey,
  SupportTabKey,
  SupportTicketRecord,
} from "../types/supportManagement.types";
import {
  assignSupportTicket,
  buildSupportCustomerDirectory,
  calculateSupportOverviewKPIs,
  deleteResponseTemplate,
  escalateSupportTicket,
  isWithinSupportDateRange,
  loadKnowledgeBaseArticles,
  loadResponseTemplates,
  loadSupportAgents,
  loadSupportAuditHistory,
  loadSupportSettings,
  loadSupportTickets,
  resetSupportManagementDemoData,
  resolveEscalationCase,
  sendSupportMessageOrNote,
  SUPPORT_ROLE_PERMISSIONS,
  updateAgentQueueStatus,
  updateSupportSettingsConfig,
  updateTicketAttributes,
  upsertKnowledgeBaseArticle,
  upsertResponseTemplate,
  type SupportCustomerDirectoryItem,
} from "../data/supportManagementDataService";
import { Badge } from "../components/common/Badge";
import { SupportSeparationBanner } from "../components/support/SupportSeparationBanner";
import { SupportStatsHeader } from "../components/support/SupportStatsHeader";
import { SupportSkeletonLoader } from "../components/support/SupportSkeletonLoader";
import { SupportOverviewSection } from "../components/support/SupportOverviewSection";
import { SupportInboxSection } from "../components/support/SupportInboxSection";
import { SupportTicketsTableSection } from "../components/support/SupportTicketsTableSection";
import { SupportEscalatedSection } from "../components/support/SupportEscalatedSection";
import { CustomerDirectorySection } from "../components/support/CustomerDirectorySection";
import { SupportAgentsSection } from "../components/support/SupportAgentsSection";
import { ResponseTemplatesSection } from "../components/support/ResponseTemplatesSection";
import { KnowledgeBaseSection } from "../components/support/KnowledgeBaseSection";
import { SupportAnalyticsSection } from "../components/support/SupportAnalyticsSection";
import { SupportSettingsSection } from "../components/support/SupportSettingsSection";
import { SupportAuditHistorySection } from "../components/support/SupportAuditHistorySection";
import { TicketDetailDrawer } from "../components/support/modals/TicketDetailDrawer";
import { CustomerSupportProfileDrawer } from "../components/support/modals/CustomerSupportProfileDrawer";
import { AssignTicketModal } from "../components/support/modals/AssignTicketModal";
import { EscalateTicketModal } from "../components/support/modals/EscalateTicketModal";
import { ConfirmSupportActionModal } from "../components/support/modals/ConfirmSupportActionModal";

const DEFAULT_FILTERS: SupportFilterState = {
  searchQuery: "",
  status: "all",
  priority: "all",
  categoryGroup: "all",
  assignedAgentId: "all",
  source: "all",
  overdueOnly: false,
  dateRange: "all",
};

interface SupportSnapshot {
  tickets: SupportTicketRecord[];
  agents: SupportAgentRecord[];
  templates: SupportResponseTemplate[];
  kbArticles: KnowledgeBaseArticle[];
  settings: SupportProgramSettings;
  auditHistory: SupportAuditEvent[];
}

function readSupportSnapshot(): SupportSnapshot {
  return {
    tickets: loadSupportTickets(),
    agents: loadSupportAgents(),
    templates: loadResponseTemplates(),
    kbArticles: loadKnowledgeBaseArticles(),
    settings: loadSupportSettings(),
    auditHistory: loadSupportAuditHistory(),
  };
}

type PendingSupportConfirm =
  | { type: "save_settings"; next: SupportProgramSettings; reason: string }
  | { type: "reset_demo" }
  | null;

export const CustomerSupportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SupportTabKey>("overview");
  const [roleKey, setRoleKey] = useState<SupportRoleKey>("super_admin");
  const [dateRange, setDateRange] = useState<SupportDateRange>("all");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");
  const [filters, setFilters] = useState<SupportFilterState>(DEFAULT_FILTERS);

  const [snapshot, setSnapshot] = useState<SupportSnapshot>(() =>
    readSupportSnapshot()
  );
  const [selectedInboxTicketId, setSelectedInboxTicketId] = useState<
    string | null
  >(() => snapshot.tickets[0]?.id || null);
  const [inboxDraftText, setInboxDraftText] = useState<string>("");
  const [inboxComposerKey, setInboxComposerKey] = useState<number>(0);

  // Genuine browser online/offline state tracking + manual fault simulation
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [hasErrorState, setHasErrorState] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Drawers & Modals state
  const [dossierTicketId, setDossierTicketId] = useState<string | null>(null);
  const [inspectedCustomer, setInspectedCustomer] =
    useState<SupportCustomerDirectoryItem | null>(null);
  const [assignTargetTicket, setAssignTargetTicket] =
    useState<SupportTicketRecord | null>(null);
  const [escalateTargetTicket, setEscalateTargetTicket] =
    useState<SupportTicketRecord | null>(null);
  const [pendingConfirm, setPendingConfirm] =
    useState<PendingSupportConfirm>(null);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  const permissions = SUPPORT_ROLE_PERMISSIONS[roleKey];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((curr) => (curr === msg ? null : curr));
    }, 4200);
  };

  const reloadData = (withRefreshSpinner = true) => {
    setHasErrorState(false);
    if (withRefreshSpinner) {
      setIsRefreshing(true);
      setTimeout(() => {
        setSnapshot(readSupportSnapshot());
        setIsRefreshing(false);
      }, 280);
    } else {
      setSnapshot(readSupportSnapshot());
    }
  };

  const dateScopedTickets = useMemo(
    () =>
      snapshot.tickets.filter((t) =>
        isWithinSupportDateRange(t.createdAt, dateRange, customStart, customEnd)
      ),
    [snapshot.tickets, dateRange, customStart, customEnd]
  );

  const kpis = useMemo(
    () =>
      calculateSupportOverviewKPIs(
        snapshot.tickets,
        snapshot.settings,
        permissions.actorId,
        dateRange,
        customStart,
        customEnd
      ),
    [
      snapshot.tickets,
      snapshot.settings,
      permissions.actorId,
      dateRange,
      customStart,
      customEnd,
    ]
  );

  const customers = useMemo(
    () => buildSupportCustomerDirectory(snapshot.tickets),
    [snapshot.tickets]
  );

  const dossierTicket = useMemo(
    () =>
      dossierTicketId
        ? snapshot.tickets.find((t) => t.id === dossierTicketId) || null
        : null,
    [dossierTicketId, snapshot.tickets]
  );

  const tabs: Array<{
    key: SupportTabKey;
    label: string;
    icon: React.ReactNode;
    allowed: boolean;
  }> = [
    { key: "overview", label: "Overview", icon: <LayoutDashboard size={14} />, allowed: permissions.canViewTickets },
    { key: "inbox", label: "Support Inbox", icon: <Inbox size={14} />, allowed: permissions.canViewTickets },
    { key: "all_tickets", label: "All Tickets", icon: <ListOrdered size={14} />, allowed: permissions.canViewTickets },
    { key: "my_tickets", label: "My Tickets", icon: <UserCheck size={14} />, allowed: permissions.canViewTickets },
    { key: "unassigned", label: "Unassigned", icon: <UserX size={14} />, allowed: permissions.canViewTickets },
    { key: "pending_responses", label: "Pending", icon: <Clock size={14} />, allowed: permissions.canViewTickets },
    { key: "escalated", label: "Escalated", icon: <AlertTriangle size={14} />, allowed: permissions.canViewTickets },
    { key: "resolved", label: "Resolved", icon: <CheckCircle2 size={14} />, allowed: permissions.canViewTickets },
    { key: "customers", label: "Customers", icon: <Users size={14} />, allowed: permissions.canViewTickets },
    { key: "agents", label: "Agents", icon: <Headset size={14} />, allowed: permissions.canViewTickets },
    { key: "templates", label: "Templates", icon: <FileText size={14} />, allowed: permissions.canViewTickets },
    { key: "knowledge_base", label: "Knowledge Base", icon: <BookOpen size={14} />, allowed: permissions.canViewTickets },
    { key: "analytics", label: "Analytics", icon: <BarChart3 size={14} />, allowed: permissions.canViewAnalytics },
    { key: "settings", label: "Settings", icon: <Sliders size={14} />, allowed: permissions.canViewTickets },
    { key: "audit_history", label: "Audit History", icon: <History size={14} />, allowed: permissions.canViewAuditHistory },
  ];

  const activeTabAllowed = tabs.find((t) => t.key === activeTab)?.allowed ?? true;

  const handleCardOrTabNavigate = (tab: SupportTabKey, preset?: string) => {
    if (preset === "all") {
      setFilters(DEFAULT_FILTERS);
    } else if (preset === "open_bundle") {
      setFilters({ ...DEFAULT_FILTERS, status: "open_bundle" });
    } else if (preset === "today") {
      setDateRange("today");
      setFilters(DEFAULT_FILTERS);
    } else if (preset === "overdue") {
      setFilters({ ...DEFAULT_FILTERS, overdueOnly: true });
    } else if (preset === "urgent_high") {
      setFilters({ ...DEFAULT_FILTERS, priority: "urgent" });
    } else if (preset === "waiting_for_user" || preset === "waiting_for_support") {
      setFilters({ ...DEFAULT_FILTERS, status: preset });
    }
    setActiveTab(tab);
  };

  const handleOpenInInbox = (ticketId: string) => {
    setSelectedInboxTicketId(ticketId);
    setActiveTab("inbox");
  };

  const handleInsertIntoInbox = (text: string) => {
    setInboxDraftText(text);
    setInboxComposerKey((k) => k + 1);
    setActiveTab("inbox");
    showToast("Inserted text into Support Inbox composer. Review carefully before submitting.");
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        padding: "22px",
        maxWidth: "1560px",
        margin: "0 auto",
        color: "var(--text-main)",
      }}
    >
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "14px",
          marginBottom: "18px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "var(--primary-glow)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(225, 29, 72, 0.25)",
            }}
          >
            <Headset size={22} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <h1 style={{ margin: 0, fontSize: "1.42rem", fontWeight: 800, color: "var(--text-main)" }}>
                Customer Support Operations Centre
              </h1>
              <Badge variant="primary" size="sm">Concierge &amp; SLA</Badge>
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "2px" }}>
              Multi-channel ticket triage, inbox conversations, private notes, escalations, knowledge base &amp; SLA analytics
            </div>
          </div>
        </div>

        {/* Global Controls */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px", padding: "6px 10px" }}>
            <Shield size={14} style={{ color: "var(--primary)" }} />
            <select
              aria-label="Support RBAC Role Preview"
              value={roleKey}
              onChange={(e) => setRoleKey(e.target.value as SupportRoleKey)}
              style={{ background: "transparent", border: "none", color: "var(--text-main)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", outline: "none" }}
            >
              <option value="super_admin">Role: Super Admin (Sarah Alexander)</option>
              <option value="senior_support_lead">Role: Senior Lead (Elena Vance)</option>
              <option value="support_agent">Role: Frontline Agent (Moderator Alex)</option>
              <option value="support_auditor">Role: Compliance QA (Read-Only)</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px", padding: "6px 10px" }}>
            <Calendar size={14} style={{ color: "var(--text-muted)" }} />
            <select
              aria-label="Support Date Filter"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as SupportDateRange)}
              style={{ background: "transparent", border: "none", color: "var(--text-main)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", outline: "none" }}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {dateRange === "custom" && (
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-main)", borderRadius: "8px", padding: "6px 8px", fontSize: "0.78rem" }}
              />
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-main)", borderRadius: "8px", padding: "6px 8px", fontSize: "0.78rem" }}
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => reloadData(true)}
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-main)", borderRadius: "10px", padding: "8px 11px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : undefined} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </button>

          <button
            type="button"
            onClick={() => setHasErrorState((prev) => !prev)}
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: hasErrorState ? "var(--status-error)" : "var(--text-secondary)", borderRadius: "10px", padding: "8px 11px", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}
          >
            {hasErrorState ? "Clear Fault" : "Test Fallback"}
          </button>

          <button
            type="button"
            onClick={() => setPendingConfirm({ type: "reset_demo" })}
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-secondary)", borderRadius: "10px", padding: "8px 11px", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Offline Browser Banner */}
      {!isOnline && (
        <div style={{ marginBottom: "14px", padding: "10px 14px", borderRadius: "11px", background: "var(--status-error-bg)", border: "1px solid var(--status-error)", color: "var(--status-error)", fontSize: "0.81rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
          <WifiOff size={16} />
          <span>Browser reports offline state. Cached local demonstration tickets remain readable; remote API refresh is unavailable until connectivity returns.</span>
        </div>
      )}

      {/* Toast Banner */}
      {toastMsg && (
        <div
          style={{
            marginBottom: "14px",
            padding: "11px 15px",
            borderRadius: "12px",
            background: "var(--status-success-bg)",
            border: "1px solid var(--status-success)",
            color: "var(--status-success)",
            fontSize: "0.82rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CheckCircle2 size={16} />
            <span>{toastMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMsg(null)}
            style={{ background: "none", border: "none", color: "var(--status-success)", fontWeight: 700, cursor: "pointer" }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Concierge Boundary Banner */}
      <SupportSeparationBanner isOnline={isOnline} />

      {/* 15 Structured Section Tabs */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          padding: "8px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "14px",
          marginBottom: "18px",
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "7px 11px",
                borderRadius: "9px",
                border: isActive ? "1px solid var(--primary)" : "1px solid transparent",
                background: isActive ? "var(--primary-glow)" : "transparent",
                color: !tab.allowed
                  ? "var(--text-muted)"
                  : isActive
                  ? "var(--primary)"
                  : "var(--text-secondary)",
                fontSize: "0.77rem",
                fontWeight: isActive ? 700 : 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                opacity: tab.allowed ? 1 : 0.65,
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {!tab.allowed && <Lock size={10} />}
            </button>
          );
        })}
      </div>

      {/* Main Workspace (Error Banner Preserves Existing Content Option | Refresh Skeleton | Active Tab) */}
      {hasErrorState && (
        <div
          style={{
            marginBottom: "16px",
            background: "var(--bg-card)",
            border: "1px solid var(--status-error)",
            borderRadius: "14px",
            padding: "16px 20px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <AlertTriangle size={22} style={{ color: "var(--status-error)" }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-main)" }}>
                Simulated Support Gateway Sync Error (Previously Loaded Queue Preserved Below)
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                Live sync failed cleanly without blanking loaded tickets. Click retry to resume synchronization.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => reloadData(true)}
            style={{ padding: "8px 15px", borderRadius: "9px", border: "none", background: "var(--primary)", color: "#fff", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
          >
            <RefreshCw size={13} />
            <span>Retry Sync</span>
          </button>
        </div>
      )}

      {isRefreshing ? (
        <SupportSkeletonLoader
          variant={
            activeTab === "inbox"
              ? "inbox"
              : activeTab === "overview"
              ? "overview"
              : "table"
          }
        />
      ) : !activeTabAllowed ? (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "42px 20px", textAlign: "center" }}>
          <Lock size={30} style={{ color: "var(--status-warning)", marginBottom: "8px" }} />
          <h3 style={{ margin: "0 0 6px 0", color: "var(--text-main)" }}>Section Restricted for Role ({permissions.roleLabel})</h3>
          <p style={{ margin: 0, fontSize: "0.84rem", color: "var(--text-secondary)" }}>
            Switch RBAC preview role above to Super Admin or Senior Support Lead to view this area.
          </p>
        </div>
      ) : (
        <>
          {(activeTab === "overview" || activeTab === "analytics") && (
            <SupportStatsHeader kpis={kpis} onCardNavigate={handleCardOrTabNavigate} />
          )}

          {activeTab === "overview" && (
            <SupportOverviewSection
              kpis={kpis}
              tickets={dateScopedTickets}
              agents={snapshot.agents}
              settings={snapshot.settings}
              onNavigateTab={handleCardOrTabNavigate}
              onOpenInInbox={handleOpenInInbox}
              onInspectTicket={(t) => setDossierTicketId(t.id)}
            />
          )}

          {activeTab === "inbox" && (
            <SupportInboxSection
              key={inboxComposerKey}
              tickets={dateScopedTickets}
              agents={snapshot.agents}
              templates={snapshot.templates}
              customers={customers}
              settings={snapshot.settings}
              permissions={permissions}
              selectedTicketId={selectedInboxTicketId}
              draftPresetText={inboxDraftText}
              onSelectTicket={(id) => {
                setSelectedInboxTicketId(id);
                updateTicketAttributes(
                  id,
                  { unreadBySupport: false },
                  permissions.actorName,
                  permissions.roleLabel
                );
                reloadData(false);
              }}
              onSendMessageOrNote={({ ticketId, content, isInternalNote, attachmentNames }) => {
                sendSupportMessageOrNote({
                  ticketId,
                  content,
                  isInternalNote,
                  actorName: permissions.actorName,
                  actorRole: permissions.roleLabel,
                  attachmentNames,
                });
                showToast(
                  isInternalNote
                    ? `Private internal note saved on ${ticketId} (never visible to customer).`
                    : `Demonstration support reply logged on ${ticketId}.`
                );
                setInboxDraftText("");
                reloadData(false);
              }}
              onUpdateTicketAttr={(tid, updates) => {
                updateTicketAttributes(tid, updates, permissions.actorName, permissions.roleLabel);
                showToast(`Updated ticket ${tid} metadata cleanly.`);
                reloadData(false);
              }}
              onOpenAssignModal={setAssignTargetTicket}
              onOpenEscalateModal={setEscalateTargetTicket}
              onInspectTicketDossier={(t) => setDossierTicketId(t.id)}
            />
          )}

          {(activeTab === "all_tickets" ||
            activeTab === "my_tickets" ||
            activeTab === "unassigned" ||
            activeTab === "pending_responses" ||
            activeTab === "resolved") && (
            <SupportTicketsTableSection
              mode={
                activeTab === "all_tickets"
                  ? "all"
                  : (activeTab as "my_tickets" | "unassigned" | "pending_responses" | "resolved")
              }
              tickets={dateScopedTickets}
              agents={snapshot.agents}
              settings={snapshot.settings}
              permissions={permissions}
              filters={filters}
              onUpdateFilters={setFilters}
              onResetFilters={() => setFilters(DEFAULT_FILTERS)}
              onRefresh={() => reloadData(true)}
              onInspectTicket={(t) => setDossierTicketId(t.id)}
              onOpenInInbox={handleOpenInInbox}
              onAssignToMe={(tid) => {
                assignSupportTicket(
                  tid,
                  permissions.actorId,
                  permissions.actorName,
                  permissions.actorName,
                  permissions.roleLabel
                );
                showToast(`Ticket ${tid} assigned to ${permissions.actorName}.`);
                reloadData(false);
              }}
              onReopenTicket={(tid) => {
                updateTicketAttributes(tid, { status: "open" }, permissions.actorName, permissions.roleLabel);
                showToast(`Ticket ${tid} reopened to Open queue.`);
                reloadData(false);
              }}
              onExportToast={showToast}
            />
          )}

          {activeTab === "escalated" && (
            <SupportEscalatedSection
              tickets={dateScopedTickets}
              permissions={permissions}
              onInspectTicket={(t) => setDossierTicketId(t.id)}
              onOpenInInbox={handleOpenInInbox}
              onUpdateEscalationReview={(tid, revStatus) => {
                resolveEscalationCase(tid, revStatus, permissions.actorName, permissions.roleLabel);
                showToast(`Escalation case ${tid} marked as ${revStatus.replace("_", " ")}.`);
                reloadData(false);
              }}
            />
          )}

          {activeTab === "customers" && (
            <CustomerDirectorySection
              customers={customers}
              permissions={permissions}
              onInspectCustomer={setInspectedCustomer}
            />
          )}

          {activeTab === "agents" && (
            <SupportAgentsSection
              agents={snapshot.agents}
              tickets={dateScopedTickets}
              settings={snapshot.settings}
              permissions={permissions}
              onUpdateQueueStatus={(agId, status) => {
                updateAgentQueueStatus(agId, status, permissions.actorName, permissions.roleLabel);
                showToast("Updated agent demonstration queue status cleanly.");
                reloadData(false);
              }}
              onFilterByAgent={(agId) => {
                setFilters({ ...DEFAULT_FILTERS, assignedAgentId: agId });
                setActiveTab("all_tickets");
              }}
            />
          )}

          {activeTab === "templates" && (
            <ResponseTemplatesSection
              templates={snapshot.templates}
              permissions={permissions}
              onSaveTemplate={(tpl) => {
                upsertResponseTemplate(tpl, permissions.actorName, permissions.roleLabel);
                showToast(`Response template "${tpl.name}" saved.`);
                reloadData(false);
              }}
              onDeleteTemplate={(id) => {
                deleteResponseTemplate(id, permissions.actorName, permissions.roleLabel);
                showToast(`Response template ${id} removed.`);
                reloadData(false);
              }}
              onUseTemplateInComposer={handleInsertIntoInbox}
            />
          )}

          {activeTab === "knowledge_base" && (
            <KnowledgeBaseSection
              articles={snapshot.kbArticles}
              permissions={permissions}
              onSaveArticle={(art) => {
                upsertKnowledgeBaseArticle(art, permissions.actorName, permissions.roleLabel);
                showToast(`Knowledge Base article "${art.title}" saved (Internal Admin Resource).`);
                reloadData(false);
              }}
              onInsertIntoInbox={handleInsertIntoInbox}
            />
          )}

          {activeTab === "analytics" && (
            <SupportAnalyticsSection
              dateRange={dateRange}
              kpis={kpis}
              tickets={dateScopedTickets}
              agents={snapshot.agents}
              settings={snapshot.settings}
            />
          )}

          {activeTab === "settings" && (
            <SupportSettingsSection
              key={snapshot.settings.lastUpdatedAt}
              settings={snapshot.settings}
              permissions={permissions}
              onRequestSaveSettings={(next, reason) =>
                setPendingConfirm({ type: "save_settings", next, reason })
              }
            />
          )}

          {activeTab === "audit_history" && (
            <SupportAuditHistorySection events={snapshot.auditHistory} />
          )}
        </>
      )}

      {/* Drawers & Confirmation Modals */}
      <TicketDetailDrawer
        ticket={dossierTicket}
        settings={snapshot.settings}
        permissions={permissions}
        onClose={() => setDossierTicketId(null)}
        onOpenInInbox={handleOpenInInbox}
        onSendMessageOrNote={({ ticketId, content, isInternalNote }) => {
          sendSupportMessageOrNote({
            ticketId,
            content,
            isInternalNote,
            actorName: permissions.actorName,
            actorRole: permissions.roleLabel,
          });
          showToast(
            isInternalNote
              ? `Private internal note saved on ${ticketId}.`
              : `Demo reply recorded on ${ticketId}.`
          );
          reloadData(false);
        }}
        onUpdateAttr={(tid, updates) => {
          updateTicketAttributes(tid, updates, permissions.actorName, permissions.roleLabel);
          showToast(`Ticket ${tid} updated.`);
          reloadData(false);
        }}
        onOpenAssign={setAssignTargetTicket}
        onOpenEscalate={setEscalateTargetTicket}
      />

      <CustomerSupportProfileDrawer
        customer={inspectedCustomer}
        allTickets={snapshot.tickets}
        permissions={permissions}
        onClose={() => setInspectedCustomer(null)}
        onOpenTicketInInbox={handleOpenInInbox}
      />

      {assignTargetTicket && (
        <AssignTicketModal
          ticket={assignTargetTicket}
          agents={snapshot.agents}
          allTickets={snapshot.tickets}
          onClose={() => setAssignTargetTicket(null)}
          onSelectAgent={(tid, agId, agName) => {
            assignSupportTicket(tid, agId, agName, permissions.actorName, permissions.roleLabel);
            showToast(`Ticket ${tid} assignment updated to ${agName}.`);
            setAssignTargetTicket(null);
            reloadData(false);
          }}
        />
      )}

      {escalateTargetTicket && (
        <EscalateTicketModal
          ticket={escalateTargetTicket}
          onCancel={() => setEscalateTargetTicket(null)}
          onConfirmEscalate={({ ticketId, escalatedTo, targetModule, reason }) => {
            escalateSupportTicket({
              ticketId,
              escalatedTo,
              targetModule,
              reason,
              actorName: permissions.actorName,
              actorRole: permissions.roleLabel,
            });
            showToast(`Escalated ticket ${ticketId} to ${targetModule} (${escalatedTo}).`);
            setEscalateTargetTicket(null);
            reloadData(false);
          }}
        />
      )}

      {pendingConfirm && (
        <ConfirmSupportActionModal
          title={
            pendingConfirm.type === "reset_demo"
              ? "Reset Customer Support Demo Data?"
              : "Save Support Settings & SLA Targets?"
          }
          description={
            pendingConfirm.type === "reset_demo"
              ? "Restores all Support tickets, team queue states, templates, knowledge base articles, SLA settings, and audit logs to baseline."
              : `Applies updated demo SLA targets, reopening rules (${pendingConfirm.next.allowReopenDays} days), and notification preferences locally. Audit Reason: ${pendingConfirm.reason}`
          }
          confirmLabel={pendingConfirm.type === "reset_demo" ? "Confirm Reset" : "Save Settings"}
          isDanger={pendingConfirm.type === "reset_demo"}
          onCancel={() => setPendingConfirm(null)}
          onConfirm={() => {
            if (pendingConfirm.type === "reset_demo") {
              resetSupportManagementDemoData();
              setFilters(DEFAULT_FILTERS);
              showToast("Customer Support demo store reset cleanly to baseline.");
              reloadData(true);
            } else {
              updateSupportSettingsConfig(
                pendingConfirm.next,
                pendingConfirm.reason,
                permissions.actorName,
                permissions.roleLabel
              );
              showToast("Updated local Support configuration & recorded audit event.");
              reloadData(false);
            }
            setPendingConfirm(null);
          }}
        />
      )}
    </div>
  );
};

export default CustomerSupportPage;
