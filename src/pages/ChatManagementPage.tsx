// NobleBond Admin — Complete Chat Management Redesign & Functional Implementation
// Enterprise messaging administration, trust & safety investigation, media moderation, and call telemetry centre
// Strictly zero emojis, React 19 strict compliance, light/dark theme integration

import React, { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  RotateCw,
  Download,
  Filter,
  Search,
  X,
  Layers,
  MessagesSquare,
  ShieldAlert,
  Flag,
  FileText,
  PhoneCall,
  Lock,
  TrendingUp,
  Table as TableIcon,
  LayoutGrid,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

import type {
  ConversationRecord,
  ReportedConversation,
  ReportedMessage,
  MediaAttachmentItem,
  CallRecord,
  MessagingRestrictionRecord,
  ChatFilterState,
  ChatSortCriteria,
  ChatSortField,
  RestrictionScope,
} from "../types/chatManagement.types";
import type { DateRangePreset } from "../types/likesMatches.types";

import {
  loadConversations,
  loadReportedConversations,
  loadReportedMessages,
  loadMediaAttachments,
  loadCalls,
  loadRestrictions,
  calculateChatKPIs,
  filterAndSortConversations,
  filterAndSortReportedConversations,
  filterAndSortReportedMessages,
  filterAndSortCalls,
  filterAndSortRestrictions,
  filterAndSortMedia,
  exportConversationsCsv,
  exportReportsCsv,
  exportCallsCsv,
  assignReportModerator,
  resolveConversationReport,
  dismissConversationReport,
  resolveMessageReport,
  dismissMessageReport,
  quarantineMediaItem,
  approveMediaItem,
  addAdminRestriction,
  revokeRestriction,
  toggleArchiveConversation,
  resetChatManagementData,
} from "../data/chatManagementDataService";

import { ChatStatsHeader } from "../components/chats/ChatStatsHeader";
import { ChatAnalyticsSection } from "../components/chats/ChatAnalyticsSection";
import { ChatFilterDrawer } from "../components/chats/ChatFilterDrawer";
import { ConversationsTable } from "../components/chats/ConversationsTable";
import { ReportedConversationsTable } from "../components/chats/ReportedConversationsTable";
import { ReportedMessagesTable } from "../components/chats/ReportedMessagesTable";
import { MediaAttachmentsSection } from "../components/chats/MediaAttachmentsSection";
import { CallsMonitoringTable } from "../components/chats/CallsMonitoringTable";
import { MessagingRestrictionsTable } from "../components/chats/MessagingRestrictionsTable";
import { ChatMobileCards } from "../components/chats/ChatMobileCards";
import { ChatPagination } from "../components/chats/ChatPagination";
import { ChatSkeletonLoader } from "../components/chats/ChatSkeletonLoader";

import { ConversationDetailDrawer } from "../components/chats/modals/ConversationDetailDrawer";
import { ReportInvestigationModal } from "../components/chats/modals/ReportInvestigationModal";
import { MessageModerationModal } from "../components/chats/modals/MessageModerationModal";
import { CallDetailModal } from "../components/chats/modals/CallDetailModal";
import { AddRestrictionModal } from "../components/chats/modals/AddRestrictionModal";
import { RevokeRestrictionModal } from "../components/chats/modals/RevokeRestrictionModal";

const DEFAULT_FILTERS: ChatFilterState = {
  searchQuery: "",
  status: "all",
  reportCategory: "all",
  reportStatus: "all",
  priority: "all",
  callType: "all",
  callStatus: "all",
  restrictionType: "all",
  dateRange: "last_30_days",
  assignedModerator: "all",
  deliveryHealth: "all",
  mediaType: "all",
};

export const ChatManagementPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Primary Data State
  const [conversations, setConversations] = useState<ConversationRecord[]>(() => loadConversations());
  const [reportedConvs, setReportedConvs] = useState<ReportedConversation[]>(() => loadReportedConversations());
  const [reportedMsgs, setReportedMsgs] = useState<ReportedMessage[]>(() => loadReportedMessages());
  const [media, setMedia] = useState<MediaAttachmentItem[]>(() => loadMediaAttachments());
  const [calls, setCalls] = useState<CallRecord[]>(() => loadCalls());
  const [restrictions, setRestrictions] = useState<MessagingRestrictionRecord[]>(() => loadRestrictions());

  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<string>(() => {
    const tabParam = searchParams.get("tab");
    return tabParam || "overview";
  });

  // View Mode: Table vs Mobile Cards
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Filtering & Sorting State
  const [filterState, setFilterState] = useState<ChatFilterState>(DEFAULT_FILTERS);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [sortCriteria, setSortCriteria] = useState<ChatSortCriteria>({
    field: "lastMessageAt",
    direction: "desc",
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal State
  const [selectedConversation, setSelectedConversation] = useState<ConversationRecord | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  const [selectedReport, setSelectedReport] = useState<ReportedConversation | null>(null);
  const [isInvestigationModalOpen, setIsInvestigationModalOpen] = useState(false);

  const [selectedMessage, setSelectedMessage] = useState<ReportedMessage | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  const [isAddRestrictionModalOpen, setIsAddRestrictionModalOpen] = useState(false);
  const [restrictionTarget, setRestrictionTarget] = useState<{ id: string; name: string } | null>(null);

  const [selectedRestriction, setSelectedRestriction] = useState<MessagingRestrictionRecord | null>(null);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);

  // Toast Helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // KPIs
  const kpis = useMemo(() => {
    return calculateChatKPIs(
      conversations,
      reportedConvs,
      reportedMsgs,
      calls,
      restrictions,
      filterState.dateRange
    );
  }, [conversations, reportedConvs, reportedMsgs, calls, restrictions, filterState.dateRange]);

  // Filtered Lists
  const filteredConversations = useMemo(() => {
    return filterAndSortConversations(conversations, filterState, sortCriteria);
  }, [conversations, filterState, sortCriteria]);

  const filteredReportedConvs = useMemo(() => {
    return filterAndSortReportedConversations(reportedConvs, filterState);
  }, [reportedConvs, filterState]);

  const filteredReportedMsgs = useMemo(() => {
    return filterAndSortReportedMessages(reportedMsgs, filterState);
  }, [reportedMsgs, filterState]);

  const filteredCalls = useMemo(() => {
    return filterAndSortCalls(calls, filterState);
  }, [calls, filterState]);

  const filteredRestrictions = useMemo(() => {
    return filterAndSortRestrictions(restrictions, filterState);
  }, [restrictions, filterState]);

  const filteredMedia = useMemo(() => {
    return filterAndSortMedia(media, filterState);
  }, [media, filterState]);

  // Paginated Slices
  const totalItems = useMemo(() => {
    switch (activeTab) {
      case "conversations":
        return filteredConversations.length;
      case "reported_conversations":
        return filteredReportedConvs.length;
      case "reported_messages":
        return filteredReportedMsgs.length;
      case "calls":
        return filteredCalls.length;
      case "restrictions":
        return filteredRestrictions.length;
      case "media_attachments":
        return filteredMedia.length;
      default:
        return filteredConversations.length;
    }
  }, [
    activeTab,
    filteredConversations.length,
    filteredReportedConvs.length,
    filteredReportedMsgs.length,
    filteredCalls.length,
    filteredRestrictions.length,
    filteredMedia.length,
  ]);

  const paginatedConversations = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredConversations.slice(start, start + pageSize);
  }, [filteredConversations, currentPage, pageSize]);

  const paginatedReportedConvs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReportedConvs.slice(start, start + pageSize);
  }, [filteredReportedConvs, currentPage, pageSize]);

  const paginatedReportedMsgs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReportedMsgs.slice(start, start + pageSize);
  }, [filteredReportedMsgs, currentPage, pageSize]);

  const paginatedCalls = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCalls.slice(start, start + pageSize);
  }, [filteredCalls, currentPage, pageSize]);

  const paginatedRestrictions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRestrictions.slice(start, start + pageSize);
  }, [filteredRestrictions, currentPage, pageSize]);

  // Active Filter Count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterState.status !== "all") count++;
    if (filterState.reportCategory !== "all") count++;
    if (filterState.reportStatus !== "all") count++;
    if (filterState.priority !== "all") count++;
    if (filterState.callType !== "all") count++;
    if (filterState.callStatus !== "all") count++;
    if (filterState.restrictionType !== "all") count++;
    if (filterState.deliveryHealth !== "all") count++;
    return count;
  }, [filterState]);

  // Handlers
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setConversations(loadConversations());
      setReportedConvs(loadReportedConversations());
      setReportedMsgs(loadReportedMessages());
      setMedia(loadMediaAttachments());
      setCalls(loadCalls());
      setRestrictions(loadRestrictions());
      setIsLoading(false);
      showToast("Chat telemetry and moderation records refreshed.");
    }, 450);
  };

  const handleResetData = () => {
    resetChatManagementData();
    setConversations(loadConversations());
    setReportedConvs(loadReportedConversations());
    setReportedMsgs(loadReportedMessages());
    setMedia(loadMediaAttachments());
    setCalls(loadCalls());
    setRestrictions(loadRestrictions());
    showToast("Reset chat records to initial demonstration state.");
  };

  const handleExportCsv = () => {
    if (activeTab === "calls") {
      exportCallsCsv(filteredCalls);
      showToast("Exported call session telemetry CSV.");
    } else if (activeTab === "reported_conversations" || activeTab === "reported_messages") {
      exportReportsCsv(filteredReportedConvs);
      showToast("Exported moderation reports CSV.");
    } else {
      exportConversationsCsv(filteredConversations);
      showToast("Exported conversations overview CSV.");
    }
  };

  const handleSortChange = (field: ChatSortField) => {
    setSortCriteria((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleAssignModerator = (reportId: string, modName = "Senior Moderator (L. Vance)") => {
    const result = assignReportModerator(reportId, modName);
    setReportedConvs(result.reportedConversations);
    setReportedMsgs(result.reportedMessages);
    showToast(`Report ${reportId} assigned to ${modName}.`);
  };

  const handleResolveConversationReport = (reportId: string, action: string, notes: string) => {
    const updated = resolveConversationReport(reportId, action, notes, "Admin (Trust & Safety)");
    setReportedConvs(updated);
    showToast(`Report ${reportId} resolved: ${action}`);
  };

  const handleDismissConversationReport = (reportId: string, notes: string) => {
    const updated = dismissConversationReport(reportId, notes, "Admin (Trust & Safety)");
    setReportedConvs(updated);
    showToast(`Report ${reportId} dismissed without violation.`);
  };

  const handleResolveMessageReport = (reportId: string, action: string, notes: string) => {
    const updated = resolveMessageReport(reportId, action, notes, "Admin (Trust & Safety)");
    setReportedMsgs(updated);
    showToast(`Message report ${reportId} resolved: ${action}`);
  };

  const handleDismissMessageReport = (reportId: string, notes: string) => {
    const updated = dismissMessageReport(reportId, notes, "Admin (Trust & Safety)");
    setReportedMsgs(updated);
    showToast(`Message flag ${reportId} dismissed.`);
  };

  const handleQuarantineMedia = (mediaId: string, reason: string) => {
    const updated = quarantineMediaItem(mediaId, reason);
    setMedia(updated);
    showToast(`Attachment ${mediaId} quarantined and hidden from recipients.`);
  };

  const handleApproveMedia = (mediaId: string) => {
    const updated = approveMediaItem(mediaId);
    setMedia(updated);
    showToast(`Attachment ${mediaId} approved as policy compliant.`);
  };

  const handleImposeRestriction = (
    userId: string,
    type: "temporary_restriction" | "permanent_restriction",
    durationDays: number | null,
    scope: RestrictionScope,
    reason: string
  ) => {
    const updated = addAdminRestriction(
      userId,
      type,
      durationDays,
      scope,
      reason,
      "Trust & Safety Lead"
    );
    setRestrictions(updated);
    setConversations(loadConversations());
    showToast(`Messaging restriction applied to user.`);
  };

  const handleRevokeRestriction = (restrictionId: string, reason: string) => {
    const updated = revokeRestriction(restrictionId, reason, "Admin (Trust & Safety)");
    setRestrictions(updated);
    showToast(`Messaging restriction revoked.`);
  };

  const handleToggleArchive = (conversationId: string) => {
    const updated = toggleArchiveConversation(conversationId);
    setConversations(updated);
    showToast(`Thread ${conversationId} archive status toggled.`);
  };

  const handleOpenUserProfile = (userId: string) => {
    navigate(`/users?userId=${userId}`);
  };

  // 8 Main Navigation Tabs
  const navigationTabs = [
    { id: "overview", label: "Overview", icon: Layers },
    { id: "conversations", label: `All Conversations (${conversations.length})`, icon: MessagesSquare },
    { id: "reported_conversations", label: `Reported Threads (${kpis.reportedConversations})`, icon: Flag },
    { id: "reported_messages", label: `Reported Messages (${kpis.reportedMessages})`, icon: ShieldAlert },
    { id: "media_attachments", label: `Media & Attachments (${media.length})`, icon: FileText },
    { id: "calls", label: `Voice & Video Calls (${calls.length})`, icon: PhoneCall },
    { id: "restrictions", label: `Restrictions (${kpis.activeRestrictionsCount})`, icon: Lock },
    { id: "analytics", label: "Analytics & SLA", icon: TrendingUp },
  ];

  return (
    <div
      className="animate-fade-in"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        paddingBottom: "40px",
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="animate-slide-down"
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            zIndex: 11000,
            padding: "12px 20px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--status-success)",
            borderRadius: "12px",
            color: "var(--status-success)",
            fontSize: "13px",
            fontWeight: 700,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <CheckCircle2 size={16} /> {toastMessage}
        </div>
      )}

      {/* Header Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-main)", letterSpacing: "-0.02em" }}>
              Chat Management &amp; Safety Telemetry
            </h1>
            <span
              style={{
                padding: "3px 8px",
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: 700,
                backgroundColor: "rgba(139, 29, 65, 0.1)",
                color: "var(--primary)",
              }}
            >
              Enterprise Tier
            </span>
          </div>
          <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Operational messaging telemetry, WebRTC encrypted call sessions, and privacy-compliant trust &amp; safety triage.
          </p>
        </div>

        {/* Global Toolbar Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {/* Refresh */}
          <button
            type="button"
            onClick={handleRefresh}
            title="Refresh records"
            style={{
              padding: "9px 14px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-main)",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <RotateCw size={14} className={isLoading ? "animate-spin" : ""} /> Refresh
          </button>

          {/* Export CSV */}
          <button
            type="button"
            onClick={handleExportCsv}
            title="Export CSV dataset"
            style={{
              padding: "9px 14px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-main)",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Download size={14} /> Export CSV
          </button>

          {/* Reset Demo Data */}
          <button
            type="button"
            onClick={handleResetData}
            title="Reset to default seed dataset"
            style={{
              padding: "9px 12px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-secondary)",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <RotateCcw size={13} /> Reset Data
          </button>
        </div>
      </div>

      {/* KPI Cards Header */}
      <ChatStatsHeader
        kpis={kpis}
        activeTab={activeTab}
        onSelectTab={(tabId) => {
          setActiveTab(tabId);
          setCurrentPage(1);
        }}
      />

      {/* Analytics Section (Shown in Overview and Analytics tabs) */}
      {(activeTab === "overview" || activeTab === "analytics") && (
        <ChatAnalyticsSection
          conversations={conversations}
          calls={calls}
          reports={reportedConvs}
        />
      )}

      {/* Section Tabs Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          overflowX: "auto",
          paddingBottom: "4px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {navigationTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "9px 14px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: isActive ? 700 : 500,
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                backgroundColor: isActive ? "var(--primary)" : "transparent",
                color: isActive ? "#ffffff" : "var(--text-secondary)",
                transition: "all 0.15s ease",
              }}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filter & Search Toolbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          padding: "14px 18px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "14px",
        }}
      >
        {/* Left: Search Box */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: "1 1 280px", maxWidth: "420px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              borderRadius: "10px",
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border)",
              width: "100%",
            }}
          >
            <Search size={15} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
            <input
              type="text"
              value={filterState.searchQuery}
              onChange={(e) => {
                setFilterState((prev) => ({ ...prev, searchQuery: e.target.value }));
                setCurrentPage(1);
              }}
              placeholder="Search by ID, user name, snippet or reason..."
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: "13px",
                color: "var(--text-main)",
                width: "100%",
              }}
            />
            {filterState.searchQuery && (
              <button
                type="button"
                onClick={() => setFilterState((prev) => ({ ...prev, searchQuery: "" }))}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  padding: 0,
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Right Toolbar Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {/* Filter Drawer Trigger */}
          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(true)}
            style={{
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: activeFiltersCount > 0 ? "rgba(139, 29, 65, 0.08)" : "var(--bg-surface)",
              color: activeFiltersCount > 0 ? "var(--primary)" : "var(--text-main)",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Filter size={14} /> Filters
            {activeFiltersCount > 0 && (
              <span
                style={{
                  padding: "1px 6px",
                  borderRadius: "10px",
                  fontSize: "10.5px",
                  fontWeight: 700,
                  backgroundColor: "var(--primary)",
                  color: "#ffffff",
                }}
              >
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Date Range Selector */}
          <select
            value={filterState.dateRange}
            onChange={(e) => {
              setFilterState((prev) => ({ ...prev, dateRange: e.target.value as DateRangePreset }));
              setCurrentPage(1);
            }}
            style={{
              padding: "8px 12px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-main)",
              fontSize: "12.5px",
              fontWeight: 600,
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="today">Today</option>
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="last_90_days">Last 90 Days</option>
            <option value="all_time">All Time</option>
          </select>

          {/* View Mode Toggle */}
          <div
            style={{
              display: "flex",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              padding: "2px",
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode("table")}
              style={{
                padding: "6px 8px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: viewMode === "table" ? "var(--bg-card)" : "transparent",
                color: viewMode === "table" ? "var(--text-main)" : "var(--text-muted)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <TableIcon size={14} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              style={{
                padding: "6px 8px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: viewMode === "cards" ? "var(--bg-card)" : "transparent",
                color: viewMode === "cards" ? "var(--text-main)" : "var(--text-muted)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <LayoutGrid size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content Display */}
      {isLoading ? (
        <ChatSkeletonLoader />
      ) : viewMode === "cards" ? (
        <ChatMobileCards
          tab={activeTab}
          conversations={paginatedConversations}
          reportedConvs={paginatedReportedConvs}
          reportedMsgs={paginatedReportedMsgs}
          calls={paginatedCalls}
          restrictions={paginatedRestrictions}
          onOpenConversation={(c) => {
            setSelectedConversation(c);
            setIsDetailDrawerOpen(true);
          }}
          onInvestigateReport={(r) => {
            setSelectedReport(r);
            setIsInvestigationModalOpen(true);
          }}
          onReviewMessage={(m) => {
            setSelectedMessage(m);
            setIsMessageModalOpen(true);
          }}
          onOpenCallDiagnostics={(c) => {
            setSelectedCall(c);
            setIsCallModalOpen(true);
          }}
          onOpenRevokeRestriction={(r) => {
            setSelectedRestriction(r);
            setIsRevokeModalOpen(true);
          }}
          onOpenUserProfile={handleOpenUserProfile}
        />
      ) : (
        <>
          {/* Tab 1: Overview or Conversations */}
          {(activeTab === "overview" || activeTab === "conversations") && (
            <ConversationsTable
              conversations={paginatedConversations}
              sort={sortCriteria}
              onSortChange={handleSortChange}
              onOpenDetails={(c) => {
                setSelectedConversation(c);
                setIsDetailDrawerOpen(true);
              }}
              onToggleArchive={handleToggleArchive}
              onOpenRestrictModal={(c) => {
                setRestrictionTarget({ id: c.participant2.id, name: c.participant2.name });
                setIsAddRestrictionModalOpen(true);
              }}
              onOpenUserProfile={handleOpenUserProfile}
            />
          )}

          {/* Tab 2: Reported Conversations */}
          {activeTab === "reported_conversations" && (
            <ReportedConversationsTable
              reports={paginatedReportedConvs}
              onInvestigate={(r) => {
                setSelectedReport(r);
                setIsInvestigationModalOpen(true);
              }}
              onAssignModerator={handleAssignModerator}
              onOpenUserProfile={handleOpenUserProfile}
            />
          )}

          {/* Tab 3: Reported Messages */}
          {activeTab === "reported_messages" && (
            <ReportedMessagesTable
              messages={paginatedReportedMsgs}
              onReviewMessage={(m) => {
                setSelectedMessage(m);
                setIsMessageModalOpen(true);
              }}
              onOpenUserProfile={handleOpenUserProfile}
            />
          )}

          {/* Tab 4: Media & Attachments */}
          {activeTab === "media_attachments" && (
            <MediaAttachmentsSection
              mediaItems={filteredMedia}
              onQuarantine={handleQuarantineMedia}
              onApprove={handleApproveMedia}
              onOpenUserProfile={handleOpenUserProfile}
            />
          )}

          {/* Tab 5: Voice & Video Calls */}
          {activeTab === "calls" && (
            <CallsMonitoringTable
              calls={paginatedCalls}
              onOpenCallDiagnostics={(c) => {
                setSelectedCall(c);
                setIsCallModalOpen(true);
              }}
              onOpenUserProfile={handleOpenUserProfile}
            />
          )}

          {/* Tab 6: Messaging Restrictions */}
          {activeTab === "restrictions" && (
            <MessagingRestrictionsTable
              restrictions={paginatedRestrictions}
              onOpenAddModal={() => {
                setRestrictionTarget(null);
                setIsAddRestrictionModalOpen(true);
              }}
              onOpenRevokeModal={(r) => {
                setSelectedRestriction(r);
                setIsRevokeModalOpen(true);
              }}
              onOpenUserProfile={handleOpenUserProfile}
            />
          )}
        </>
      )}

      {/* Pagination (When active tab has multiple records and not in media section) */}
      {activeTab !== "media_attachments" && totalItems > 0 && (
        <ChatPagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      )}

      {/* Modals & Drawers */}
      <ConversationDetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        conversation={selectedConversation}
        onToggleArchive={handleToggleArchive}
        onOpenRestrictModal={(c) => {
          setIsDetailDrawerOpen(false);
          setRestrictionTarget({ id: c.participant2.id, name: c.participant2.name });
          setIsAddRestrictionModalOpen(true);
        }}
        onOpenUserProfile={handleOpenUserProfile}
      />

      <ReportInvestigationModal
        isOpen={isInvestigationModalOpen}
        onClose={() => setIsInvestigationModalOpen(false)}
        report={selectedReport}
        onResolve={handleResolveConversationReport}
        onDismiss={handleDismissConversationReport}
        onAssignModerator={handleAssignModerator}
        onOpenRestrictModal={(id, name) => {
          setRestrictionTarget({ id, name });
          setIsAddRestrictionModalOpen(true);
        }}
        onOpenUserProfile={handleOpenUserProfile}
      />

      <MessageModerationModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        message={selectedMessage}
        onResolve={handleResolveMessageReport}
        onDismiss={handleDismissMessageReport}
        onOpenRestrictModal={(id, name) => {
          setRestrictionTarget({ id, name });
          setIsAddRestrictionModalOpen(true);
        }}
        onOpenUserProfile={handleOpenUserProfile}
      />

      <CallDetailModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        call={selectedCall}
        onOpenUserProfile={handleOpenUserProfile}
      />

      <AddRestrictionModal
        isOpen={isAddRestrictionModalOpen}
        onClose={() => {
          setIsAddRestrictionModalOpen(false);
          setRestrictionTarget(null);
        }}
        targetUserId={restrictionTarget?.id}
        targetUserName={restrictionTarget?.name}
        onImpose={handleImposeRestriction}
      />

      <RevokeRestrictionModal
        isOpen={isRevokeModalOpen}
        onClose={() => {
          setIsRevokeModalOpen(false);
          setSelectedRestriction(null);
        }}
        restriction={selectedRestriction}
        onRevoke={handleRevokeRestriction}
      />

      <ChatFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filterState={filterState}
        onFilterChange={(newFilters) => {
          setFilterState(newFilters);
          setCurrentPage(1);
        }}
        onResetFilters={() => {
          setFilterState(DEFAULT_FILTERS);
          setCurrentPage(1);
        }}
        totalFiltered={totalItems}
      />
    </div>
  );
};
