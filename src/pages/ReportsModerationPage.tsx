// NobleBond Admin — Complete Reports & Moderation Center
// Enterprise Trust & Safety command center, deep investigation dossiers, content moderation, enforcement ledger, appeals, audit history, analytics. Zero emojis.

import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  Search,
  Filter,
  Download,
  RotateCcw,
  LayoutGrid,
  List,
  CheckCircle2,
  X,
  Plus,
  Users,
  Image as ImageIcon,
  MessageSquare,
  Radio,
  Ban,
  Scale,
  History,
  BarChart3,
  Sparkles,
} from "lucide-react";

// Types
import type {
  UnifiedReportRecord,
  ContentModerationItem,
  ModerationActionRecord,
  AppealRecord,
  ModerationHistoryEvent,
  ModerationFilterState,
  ModerationSortCriteria,
  ModerationSortField,
  ReportPriority,
  ReportStatus,
  ContentReviewStatus,
  ModerationActionType,
} from "../types/reportsModeration.types";
import type { DateRangePreset, ParticipantBrief } from "../types/likesMatches.types";

// Data Service
import {
  loadReports,
  loadContentQueue,
  loadModerationActions,
  loadAppeals,
  loadModerationHistory,
  calculateModerationKPIs,
  filterAndSortReports,
  filterContentQueue,
  filterModerationActions,
  filterAppeals,
  filterHistory,
  assignReport,
  updateReportPriority,
  updateReportStatus,
  addInvestigationNote,
  resolveReport,
  dismissReport,
  escalateReport,
  applyModerationAction,
  reviewContentItem,
  resolveAppeal,
  resetModerationData,
  exportReportsCsv,
  exportActionsCsv,
  exportAppealsCsv,
} from "../data/reportsModerationDataService";

// Subcomponents
import { ModerationStatsHeader } from "../components/moderation/ModerationStatsHeader";
import { ModerationOverviewSection } from "../components/moderation/ModerationOverviewSection";
import { AllReportsTable } from "../components/moderation/AllReportsTable";
import { UserReportsSection } from "../components/moderation/UserReportsSection";
import { ProfileReportsSection } from "../components/moderation/ProfileReportsSection";
import { ChatReportsSection } from "../components/moderation/ChatReportsSection";
import { LiveReportsSection } from "../components/moderation/LiveReportsSection";
import { ContentModerationQueue } from "../components/moderation/ContentModerationQueue";
import { ModerationActionsTable } from "../components/moderation/ModerationActionsTable";
import { AppealsReviewsTable } from "../components/moderation/AppealsReviewsTable";
import { ModerationHistoryAuditTable } from "../components/moderation/ModerationHistoryAuditTable";
import { ModerationAnalyticsSection } from "../components/moderation/ModerationAnalyticsSection";
import { ModerationFilterDrawer } from "../components/moderation/ModerationFilterDrawer";
import { ModerationPagination } from "../components/moderation/ModerationPagination";
import { ModerationSkeletonLoader } from "../components/moderation/ModerationSkeletonLoader";
import { ModerationMobileCards } from "../components/moderation/ModerationMobileCards";

// Modals
import { ReportInvestigationDrawer } from "../components/moderation/modals/ReportInvestigationDrawer";
import { ApplyModerationActionModal } from "../components/moderation/modals/ApplyModerationActionModal";
import { ResolveReportModal } from "../components/moderation/modals/ResolveReportModal";
import { DismissReportModal } from "../components/moderation/modals/DismissReportModal";
import { EscalateReportModal } from "../components/moderation/modals/EscalateReportModal";
import { AppealInvestigationModal } from "../components/moderation/modals/AppealInvestigationModal";
import { ContentReviewDetailModal } from "../components/moderation/modals/ContentReviewDetailModal";

type ModerationTabKey =
  | "overview"
  | "all_reports"
  | "user_reports"
  | "profile_reports"
  | "chat_reports"
  | "live_reports"
  | "content_moderation"
  | "moderation_actions"
  | "appeals"
  | "history"
  | "analytics";

const DEFAULT_FILTERS: ModerationFilterState = {
  searchQuery: "",
  domain: "all",
  category: "all",
  priority: "all",
  status: "all",
  assignedModerator: "all",
  contentType: "all",
  dateRange: "all",
};

export const ReportsModerationPage: React.FC = () => {
  const navigate = useNavigate();

  // Lazy Initial State
  const [reports, setReports] = useState<UnifiedReportRecord[]>(() => loadReports());
  const [contentQueue, setContentQueue] = useState<ContentModerationItem[]>(() => loadContentQueue());
  const [actions, setActions] = useState<ModerationActionRecord[]>(() => loadModerationActions());
  const [appeals, setAppeals] = useState<AppealRecord[]>(() => loadAppeals());
  const [history, setHistory] = useState<ModerationHistoryEvent[]>(() => loadModerationHistory());

  // UI State
  const [activeTab, setActiveTab] = useState<ModerationTabKey>("overview");
  const [filters, setFilters] = useState<ModerationFilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<ModerationSortCriteria>({ field: "submittedAt", direction: "desc" });
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected Entities for Modals
  const [investigatingReport, setInvestigatingReport] = useState<UnifiedReportRecord | null>(null);
  const [isInvestigationDrawerOpen, setIsInvestigationDrawerOpen] = useState<boolean>(false);

  const [resolvingReport, setResolvingReport] = useState<UnifiedReportRecord | null>(null);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState<boolean>(false);

  const [dismissingReport, setDismissingReport] = useState<UnifiedReportRecord | null>(null);
  const [isDismissModalOpen, setIsDismissModalOpen] = useState<boolean>(false);

  const [escalatingReport, setEscalatingReport] = useState<UnifiedReportRecord | null>(null);
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState<boolean>(false);

  const [actionTargetReport, setActionTargetReport] = useState<UnifiedReportRecord | null>(null);
  const [actionTargetUser, setActionTargetUser] = useState<{ id: string; name: string; avatarUrl?: string } | null>(null);
  const [isApplyActionModalOpen, setIsApplyActionModalOpen] = useState<boolean>(false);

  const [reviewingContentItem, setReviewingContentItem] = useState<ContentModerationItem | null>(null);
  const [isContentReviewModalOpen, setIsContentReviewModalOpen] = useState<boolean>(false);

  const [adjudicatingAppeal, setAdjudicatingAppeal] = useState<AppealRecord | null>(null);
  const [isAppealModalOpen, setIsAppealModalOpen] = useState<boolean>(false);

  // Dynamic KPIs
  const kpis = useMemo(() => {
    return calculateModerationKPIs(reports, actions, appeals);
  }, [reports, actions, appeals]);

  // Toast Notification Helper
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  }, []);

  // Filtered Datasets
  const filteredReports = useMemo(() => {
    return filterAndSortReports(reports, filters, sort);
  }, [reports, filters, sort]);

  const filteredContentQueue = useMemo(() => {
    return filterContentQueue(contentQueue, "all", filters.searchQuery);
  }, [contentQueue, filters.searchQuery]);

  const filteredActions = useMemo(() => {
    return filterModerationActions(actions, "all", filters.searchQuery);
  }, [actions, filters.searchQuery]);

  const filteredAppeals = useMemo(() => {
    return filterAppeals(appeals, "all", filters.searchQuery);
  }, [appeals, filters.searchQuery]);

  const filteredHistory = useMemo(() => {
    return filterHistory(history, filters.searchQuery);
  }, [history, filters.searchQuery]);

  // Paginated Current Records
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReports.slice(start, start + pageSize);
  }, [filteredReports, currentPage, pageSize]);

  // Active Filter Count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.domain !== "all") count += 1;
    if (filters.category !== "all") count += 1;
    if (filters.priority !== "all") count += 1;
    if (filters.status !== "all") count += 1;
    if (filters.assignedModerator !== "all") count += 1;
    if (filters.contentType !== "all") count += 1;
    if (filters.dateRange !== "all") count += 1;
    return count;
  }, [filters]);

  // Handlers for Navigation & Tabs
  const handleTabChange = (newTab: ModerationTabKey) => {
    setActiveTab(newTab);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
    setCurrentPage(1);
  };

  const handlePriorityFilter = (priority: string) => {
    setFilters((prev) => ({
      ...prev,
      priority: priority as "all" | ReportPriority,
    }));
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: status as "all" | ReportStatus,
    }));
    setCurrentPage(1);
  };

  const handleDateRangeChange = (preset: "all" | DateRangePreset) => {
    setFilters((prev) => ({ ...prev, dateRange: preset }));
    setCurrentPage(1);
  };

  const handleSortChange = (field: ModerationSortField) => {
    setSort((prev) => {
      if (prev.field === field) {
        return { field, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { field, direction: "desc" };
    });
  };

  // Cross-Navigation Handlers
  const handleOpenUserProfile = (userId: string) => {
    navigate(`/users?search=${encodeURIComponent(userId)}`);
  };

  const handleOpenProfileManagement = (profileId: string) => {
    navigate(`/profiles?search=${encodeURIComponent(profileId)}`);
  };

  const handleOpenChatManagement = (conversationId: string) => {
    navigate(`/chats?search=${encodeURIComponent(conversationId)}`);
  };

  const handleOpenLiveManagement = (sessionId: string) => {
    navigate(`/live?search=${encodeURIComponent(sessionId)}`);
  };

  // Report Modal Openers
  const handleOpenReportDossier = (report: UnifiedReportRecord) => {
    setInvestigatingReport(report);
    setIsInvestigationDrawerOpen(true);
  };

  const handleOpenResolveModal = (report: UnifiedReportRecord) => {
    setResolvingReport(report);
    setIsResolveModalOpen(true);
  };

  const handleOpenDismissModal = (report: UnifiedReportRecord) => {
    setDismissingReport(report);
    setIsDismissModalOpen(true);
  };

  const handleOpenEscalateModal = (report: UnifiedReportRecord) => {
    setEscalatingReport(report);
    setIsEscalateModalOpen(true);
  };

  const handleOpenApplyActionModal = (
    report?: UnifiedReportRecord | null,
    targetUser?: { id: string; name: string; avatarUrl?: string } | null
  ) => {
    setActionTargetReport(report || null);
    setActionTargetUser(targetUser || null);
    setIsApplyActionModalOpen(true);
  };

  const handleOpenContentReviewModal = (item: ContentModerationItem) => {
    setReviewingContentItem(item);
    setIsContentReviewModalOpen(true);
  };

  const handleOpenAppealModal = (appeal: AppealRecord) => {
    setAdjudicatingAppeal(appeal);
    setIsAppealModalOpen(true);
  };

  // Mutation Handlers
  const handleAssignModerator = (reportId: string, moderatorName: string) => {
    const { reports: updatedReports, history: updatedHistory } = assignReport(
      reportId,
      moderatorName,
      "Supervisor Admin"
    );
    setReports(updatedReports);
    setHistory(updatedHistory);
    if (investigatingReport && investigatingReport.id === reportId) {
      setInvestigatingReport(updatedReports.find((r) => r.id === reportId) || null);
    }
    showToast(`Case #${reportId} assigned to ${moderatorName}`);
  };

  const handleUpdatePriority = (reportId: string, priority: ReportPriority) => {
    const updated = updateReportPriority(reportId, priority, "Supervisor Admin");
    setReports(updated);
    if (investigatingReport && investigatingReport.id === reportId) {
      setInvestigatingReport(updated.find((r) => r.id === reportId) || null);
    }
    showToast(`Case #${reportId} priority updated to ${priority.toUpperCase()}`);
  };

  const handleUpdateStatus = (reportId: string, status: ReportStatus) => {
    const updated = updateReportStatus(reportId, status, "Supervisor Admin");
    setReports(updated);
    if (investigatingReport && investigatingReport.id === reportId) {
      setInvestigatingReport(updated.find((r) => r.id === reportId) || null);
    }
    showToast(`Case #${reportId} status updated to ${status.replace("_", " ").toUpperCase()}`);
  };

  const handleAddInvestigationNote = (reportId: string, noteText: string) => {
    const updated = addInvestigationNote(reportId, noteText, "Supervisor Admin");
    setReports(updated);
    if (investigatingReport && investigatingReport.id === reportId) {
      setInvestigatingReport(updated.find((r) => r.id === reportId) || null);
    }
    showToast(`Staff investigation note recorded for #${reportId}`);
  };

  const handleConfirmResolve = (
    reportId: string,
    resolutionSummary: string,
    actionTaken: string
  ) => {
    const { reports: updatedReports, history: updatedHistory } = resolveReport(
      reportId,
      resolutionSummary,
      actionTaken,
      "Supervisor Admin"
    );
    setReports(updatedReports);
    setHistory(updatedHistory);
    if (investigatingReport && investigatingReport.id === reportId) {
      setInvestigatingReport(null);
      setIsInvestigationDrawerOpen(false);
    }
    showToast(`Case #${reportId} formally resolved & closed.`);
  };

  const handleConfirmDismiss = (
    reportId: string,
    dismissalReason: string,
    notes: string,
    flagReporter: boolean
  ) => {
    const finalNotes = flagReporter ? `${notes} [Reporter flagged for false filing review]` : notes;
    const { reports: updatedReports, history: updatedHistory } = dismissReport(
      reportId,
      dismissalReason,
      finalNotes,
      "Supervisor Admin"
    );
    setReports(updatedReports);
    setHistory(updatedHistory);
    if (investigatingReport && investigatingReport.id === reportId) {
      setInvestigatingReport(null);
      setIsInvestigationDrawerOpen(false);
    }
    showToast(
      flagReporter
        ? `Case #${reportId} dismissed & reporter history noted.`
        : `Case #${reportId} dismissed without disciplinary action.`
    );
  };

  const handleConfirmEscalate = (
    reportId: string,
    department: string,
    reason: string,
    notes: string,
    bumpToCritical: boolean
  ) => {
    const { reports: updatedReports, history: updatedHistory } = escalateReport(
      reportId,
      `${department} — ${reason}`,
      notes,
      "Supervisor Admin"
    );
    const finalReports = bumpToCritical
      ? updateReportPriority(reportId, "critical", "Supervisor Admin")
      : updatedReports;
    setReports(finalReports);
    setHistory(updatedHistory);
    if (investigatingReport && investigatingReport.id === reportId) {
      setInvestigatingReport(finalReports.find((r) => r.id === reportId) || null);
    }
    showToast(
      bumpToCritical
        ? `Case #${reportId} escalated to ${department} (Critical Priority).`
        : `Case #${reportId} escalated to ${department}.`
    );
  };

  const handleApplyAction = (params: {
    targetUserId: string;
    targetUserName: string;
    actionType: ModerationActionType;
    reason: string;
    internalNotes: string;
    duration: string;
    expiresAt: string | null;
    notifyUser: boolean;
    linkedReportId?: string;
  }) => {
    const targetBrief: ParticipantBrief = reports.find((r) => r.reportedUser.id === params.targetUserId)?.reportedUser || {
      id: params.targetUserId,
      profileId: `prf_${params.targetUserId}`,
      name: params.targetUserName,
      username: `@${params.targetUserName.toLowerCase().replace(/\s+/g, "_")}`,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      isVerified: true,
      gender: "male",
      dateOfBirth: "1998-05-12",
      country: "United Kingdom",
      countryCode: "GB",
      city: "London",
      premiumTier: "free",
    };
    const { actions: updatedActions, history: updatedHistory } = applyModerationAction(
      {
        targetUser: targetBrief,
        relatedReportId: params.linkedReportId,
        actionType: params.actionType,
        reason: params.reason,
        notes: params.internalNotes,
      },
      "Supervisor Admin"
    );
    setActions(updatedActions);
    setHistory(updatedHistory);

    // If linked to a report, update report status to under_review or resolved
    if (params.linkedReportId) {
      const updatedReports = updateReportStatus(params.linkedReportId, "under_review", "Supervisor Admin");
      setReports(updatedReports);
    }

    showToast(`Disciplinary action applied against ${params.targetUserName}.`);
  };

  const handleReviewContentItem = (itemId: string, newStatus: ContentReviewStatus, notes?: string) => {
    const updatedQueue = reviewContentItem(itemId, newStatus, notes || "Reviewed by Trust & Safety", "Supervisor Admin");
    setContentQueue(updatedQueue);
    showToast(`Content item #${itemId} marked as ${newStatus.replace("_", " ").toUpperCase()}.`);
  };

  const handleResolveAppeal = (
    appealId: string,
    outcome: "approved" | "rejected",
    notes: string,
    actionTaken: string
  ) => {
    const { appeals: updatedAppeals, actions: updatedActions, history: updatedHistory } = resolveAppeal(
      appealId,
      outcome,
      `${notes} (${actionTaken})`,
      "Supervisor Admin"
    );
    setAppeals(updatedAppeals);
    if (updatedActions) {
      setActions(updatedActions);
    }
    setHistory(updatedHistory);
    showToast(`Appeal #${appealId} adjudicated (${outcome.toUpperCase()}): ${actionTaken}`);
  };

  const handleExportCsv = () => {
    if (activeTab === "moderation_actions") {
      exportActionsCsv(actions);
      showToast("Exported active moderation enforcement ledger as CSV.");
    } else if (activeTab === "appeals") {
      exportAppealsCsv(appeals);
      showToast("Exported member appeals ledger as CSV.");
    } else {
      exportReportsCsv(filteredReports);
      showToast("Exported full moderation reports database as CSV.");
    }
  };

  const handleResetData = () => {
    if (window.confirm("Reset all Moderation records and queues to initial demonstration defaults?")) {
      resetModerationData();
      setReports(loadReports());
      setContentQueue(loadContentQueue());
      setActions(loadModerationActions());
      setAppeals(loadAppeals());
      setHistory(loadModerationHistory());
      showToast("Moderation test records successfully reset.");
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setReports(loadReports());
      setContentQueue(loadContentQueue());
      setActions(loadModerationActions());
      setAppeals(loadAppeals());
      setHistory(loadModerationHistory());
      setIsLoading(false);
      showToast("Moderation data refreshed from local storage.");
    }, 450);
  };

  // Tabs Configuration
  const tabs: Array<{
    key: ModerationTabKey;
    label: string;
    icon: React.ComponentType<{ size: number; color?: string }>;
    count?: number;
    color?: string;
  }> = [
    { key: "overview", label: "Overview", icon: ShieldAlert },
    { key: "all_reports", label: "All Reports", icon: List, count: reports.length, color: "var(--primary)" },
    {
      key: "user_reports",
      label: "User Reports",
      icon: Users,
      count: reports.filter((r) => r.domain === "user").length,
      color: "#3B82F6",
    },
    {
      key: "profile_reports",
      label: "Profile & Photo",
      icon: ImageIcon,
      count: reports.filter((r) => r.domain === "profile").length,
      color: "#8B5CF6",
    },
    {
      key: "chat_reports",
      label: "Chat Reports",
      icon: MessageSquare,
      count: reports.filter((r) => r.domain === "chat").length,
      color: "#10B981",
    },
    {
      key: "live_reports",
      label: "Live Reports",
      icon: Radio,
      count: reports.filter((r) => r.domain === "live").length,
      color: "#EF4444",
    },
    {
      key: "content_moderation",
      label: "Content Queue",
      icon: Sparkles,
      count: contentQueue.filter((c) => c.reviewStatus === "pending_review").length,
      color: "#F59E0B",
    },
    {
      key: "moderation_actions",
      label: "Enforcement Ledger",
      icon: Ban,
      count: actions.filter((a) => a.status === "active").length,
      color: "#DC2626",
    },
    {
      key: "appeals",
      label: "Member Appeals",
      icon: Scale,
      count: appeals.filter((a) => a.status === "pending").length,
      color: "#6366F1",
    },
    { key: "history", label: "Audit Trail", icon: History },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="animate-scale-up"
          style={{
            position: "fixed",
            bottom: "28px",
            right: "28px",
            zIndex: 99999,
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderLeft: "4px solid var(--primary, #8B1D41)",
            padding: "14px 20px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "var(--text-main)",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={16} color="var(--primary, #8B1D41)" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "2px",
              marginLeft: "6px",
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: 800,
                color: "var(--text-main)",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Reports & Moderation
            </h1>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "3px 8px",
                borderRadius: "20px",
                backgroundColor: "rgba(220, 38, 38, 0.1)",
                color: "#DC2626",
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#DC2626",
                }}
              />
              Trust & Safety Operations
            </span>
          </div>
          <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", margin: "4px 0 0" }}>
            Investigate community safety flags, impersonation notices, scam reports, and enforcement actions.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {/* Apply Action Direct Button */}
          <button
            type="button"
            onClick={() => handleOpenApplyActionModal(null, null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 15px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "var(--primary, #8B1D41)",
              color: "#FFFFFF",
              fontSize: "12.5px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <Plus size={14} />
            <span>Apply Enforcement</span>
          </button>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCsv}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 13px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-main)",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 13px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-main)",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <RotateCcw size={14} className={isLoading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            type="button"
            onClick={handleResetData}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 13px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-muted)",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
            }}
            title="Reset demonstration records"
          >
            <RotateCcw size={14} color="#EF4444" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Header (10 dynamic cards with tab-switch triggers) */}
      <ModerationStatsHeader
        kpis={kpis}
        activeTab={activeTab}
        onSelectTab={(tabId) => handleTabChange(tabId as ModerationTabKey)}
        onFilterPriority={handlePriorityFilter}
        onFilterStatus={handleStatusFilter}
      />

      {/* Tab Navigation Strip (11 Sections) */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          borderBottom: "1px solid var(--border)",
          overflowX: "auto",
          paddingBottom: "2px",
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 14px",
                border: "none",
                borderBottom: isActive ? "2px solid var(--primary, #8B1D41)" : "2px solid transparent",
                backgroundColor: "transparent",
                color: isActive ? "var(--primary, #8B1D41)" : "var(--text-secondary)",
                fontSize: "13px",
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              <Icon size={15} color={isActive ? "var(--primary, #8B1D41)" : "currentColor"} />
              <span>{tab.label}</span>
              {typeof tab.count === "number" && tab.count > 0 && (
                <span
                  style={{
                    padding: "1px 6px",
                    borderRadius: "10px",
                    fontSize: "11px",
                    fontWeight: 700,
                    backgroundColor: isActive ? "var(--primary, #8B1D41)" : "var(--bg-secondary)",
                    color: isActive ? "#FFFFFF" : "var(--text-muted)",
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Toolbar: Search, Filters, Date Range, View Mode */}
      {activeTab !== "overview" && activeTab !== "analytics" && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            backgroundColor: "var(--bg-card)",
            padding: "12px 16px",
            borderRadius: "14px",
            border: "1px solid var(--border)",
          }}
        >
          {/* Search Box */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "var(--bg-secondary)",
              borderRadius: "10px",
              padding: "7px 12px",
              border: "1px solid var(--border)",
              minWidth: "260px",
              flex: "1 1 260px",
            }}
          >
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by Case ID, member, reason, domain..."
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: "12.5px",
                color: "var(--text-main)",
                width: "100%",
              }}
            />
            {filters.searchQuery && (
              <button
                onClick={() => handleSearchChange("")}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                <X size={12} color="var(--text-muted)" />
              </button>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            {/* Filter Drawer Trigger */}
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "10px",
                border: activeFilterCount > 0 ? "1px solid var(--primary)" : "1px solid var(--border)",
                backgroundColor: activeFilterCount > 0 ? "rgba(139, 29, 65, 0.08)" : "var(--bg-secondary)",
                color: activeFilterCount > 0 ? "var(--primary)" : "var(--text-main)",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Filter size={13} />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    backgroundColor: "var(--primary, #8B1D41)",
                    color: "#FFFFFF",
                    fontSize: "10px",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Date Range Selector */}
            <div style={{ display: "flex", gap: "4px" }}>
              {(["all", "today", "last_7_days", "last_30_days"] as const).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleDateRangeChange(preset)}
                  style={{
                    padding: "7px 11px",
                    borderRadius: "8px",
                    border: filters.dateRange === preset ? "1px solid var(--primary, #8B1D41)" : "1px solid var(--border)",
                    backgroundColor: filters.dateRange === preset ? "rgba(139, 29, 65, 0.08)" : "var(--bg-secondary)",
                    color: filters.dateRange === preset ? "var(--primary)" : "var(--text-secondary)",
                    fontSize: "11.5px",
                    fontWeight: filters.dateRange === preset ? 700 : 500,
                    cursor: "pointer",
                    textTransform: "uppercase",
                  }}
                >
                  {preset === "all" ? "All Time" : preset === "today" ? "Today" : preset === "last_7_days" ? "7 Days" : "30 Days"}
                </button>
              ))}
            </div>

            {/* View Mode Toggle (Table / Cards) */}
            <div
              style={{
                display: "flex",
                backgroundColor: "var(--bg-secondary)",
                padding: "3px",
                borderRadius: "9px",
                border: "1px solid var(--border)",
              }}
            >
              <button
                type="button"
                onClick={() => setViewMode("table")}
                style={{
                  padding: "5px 8px",
                  borderRadius: "7px",
                  border: "none",
                  backgroundColor: viewMode === "table" ? "var(--bg-card)" : "transparent",
                  color: viewMode === "table" ? "var(--text-main)" : "var(--text-muted)",
                  boxShadow: viewMode === "table" ? "var(--shadow-sm)" : "none",
                  cursor: "pointer",
                }}
                title="Table view"
              >
                <List size={14} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                style={{
                  padding: "5px 8px",
                  borderRadius: "7px",
                  border: "none",
                  backgroundColor: viewMode === "cards" ? "var(--bg-card)" : "transparent",
                  color: viewMode === "cards" ? "var(--text-main)" : "var(--text-muted)",
                  boxShadow: viewMode === "cards" ? "var(--shadow-sm)" : "none",
                  cursor: "pointer",
                }}
                title="Card view"
              >
                <LayoutGrid size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab Content */}
      {isLoading ? (
        <ModerationSkeletonLoader />
      ) : (
        <>
          {/* Section 1: Overview */}
          {activeTab === "overview" && (
            <ModerationOverviewSection
              reports={reports}
              history={history}
              kpis={kpis}
              onOpenReport={handleOpenReportDossier}
              onSelectTab={(tabId) => handleTabChange(tabId as ModerationTabKey)}
              onFilterPriority={handlePriorityFilter}
              onFilterStatus={handleStatusFilter}
            />
          )}

          {/* Section 2: All Reports */}
          {activeTab === "all_reports" && (
            viewMode === "table" ? (
              <AllReportsTable
                reports={paginatedReports}
                sort={sort}
                onSortChange={handleSortChange}
                onOpenReport={handleOpenReportDossier}
                onOpenUserProfile={handleOpenUserProfile}
              />
            ) : (
              <ModerationMobileCards
                tab="all_reports"
                reports={paginatedReports}
                content={contentQueue}
                actions={actions}
                appeals={appeals}
                history={history}
                onOpenReport={handleOpenReportDossier}
                onOpenUserProfile={handleOpenUserProfile}
              />
            )
          )}

          {/* Section 3: User Reports */}
          {activeTab === "user_reports" && (
            <UserReportsSection
              reports={reports}
              onOpenReport={handleOpenReportDossier}
              onOpenUserProfile={handleOpenUserProfile}
              onReferToUserManagement={handleOpenUserProfile}
            />
          )}

          {/* Section 4: Profile & Photo Reports */}
          {activeTab === "profile_reports" && (
            <ProfileReportsSection
              reports={reports}
              onOpenReport={handleOpenReportDossier}
              onOpenProfileManagement={handleOpenProfileManagement}
            />
          )}

          {/* Section 5: Chat Reports */}
          {activeTab === "chat_reports" && (
            <ChatReportsSection
              reports={reports}
              onOpenReport={handleOpenReportDossier}
              onOpenChatManagement={handleOpenChatManagement}
            />
          )}

          {/* Section 6: Live Reports */}
          {activeTab === "live_reports" && (
            <LiveReportsSection
              reports={reports}
              onOpenReport={handleOpenReportDossier}
              onOpenLiveManagement={handleOpenLiveManagement}
            />
          )}

          {/* Section 7: Content Moderation Queue */}
          {activeTab === "content_moderation" && (
            <ContentModerationQueue
              queue={filteredContentQueue}
              onReviewItem={(item, newStatus) => handleReviewContentItem(item.id, newStatus)}
              onInspectItem={handleOpenContentReviewModal}
              onOpenUserProfile={handleOpenUserProfile}
            />
          )}

          {/* Section 8: Moderation Actions */}
          {activeTab === "moderation_actions" && (
            <ModerationActionsTable
              actions={filteredActions}
              onOpenApplyActionModal={() => handleOpenApplyActionModal(null, null)}
              onOpenUserProfile={handleOpenUserProfile}
            />
          )}

          {/* Section 9: Appeals & Reviews */}
          {activeTab === "appeals" && (
            <AppealsReviewsTable
              appeals={filteredAppeals}
              onOpenAppeal={handleOpenAppealModal}
              onOpenUserProfile={handleOpenUserProfile}
            />
          )}

          {/* Section 10: Audit Trail History */}
          {activeTab === "history" && (
            <ModerationHistoryAuditTable history={filteredHistory} />
          )}

          {/* Section 11: Moderation Analytics */}
          {activeTab === "analytics" && (
            <ModerationAnalyticsSection
              reports={reports}
              actions={actions}
              appeals={appeals}
            />
          )}
        </>
      )}

      {/* Pagination (for All Reports table) */}
      {activeTab === "all_reports" && filteredReports.length > 0 && (
        <ModerationPagination
          currentPage={currentPage}
          totalItems={filteredReports.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      )}

      {/* Modals & Drawers */}

      {/* 1. Report Investigation Workspace Drawer */}
      <ReportInvestigationDrawer
        isOpen={isInvestigationDrawerOpen}
        onClose={() => setIsInvestigationDrawerOpen(false)}
        report={investigatingReport}
        onAssignModerator={handleAssignModerator}
        onUpdatePriority={handleUpdatePriority}
        onUpdateStatus={handleUpdateStatus}
        onAddNote={handleAddInvestigationNote}
        onOpenResolveModal={handleOpenResolveModal}
        onOpenDismissModal={handleOpenDismissModal}
        onOpenEscalateModal={handleOpenEscalateModal}
        onOpenApplyActionModal={(rep) => handleOpenApplyActionModal(rep, null)}
        onOpenUserProfile={handleOpenUserProfile}
        onOpenProfileManagement={handleOpenProfileManagement}
        onOpenChatManagement={handleOpenChatManagement}
        onOpenLiveManagement={handleOpenLiveManagement}
      />

      {/* 2. Apply Moderation Action Modal */}
      <ApplyModerationActionModal
        isOpen={isApplyActionModalOpen}
        onClose={() => setIsApplyActionModalOpen(false)}
        report={actionTargetReport}
        targetUser={actionTargetUser}
        onApplyAction={handleApplyAction}
      />

      {/* 3. Resolve Report Modal */}
      <ResolveReportModal
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        report={resolvingReport}
        onConfirmResolve={handleConfirmResolve}
      />

      {/* 4. Dismiss Report Modal */}
      <DismissReportModal
        isOpen={isDismissModalOpen}
        onClose={() => setIsDismissModalOpen(false)}
        report={dismissingReport}
        onConfirmDismiss={handleConfirmDismiss}
      />

      {/* 5. Escalate Report Modal */}
      <EscalateReportModal
        isOpen={isEscalateModalOpen}
        onClose={() => setIsEscalateModalOpen(false)}
        report={escalatingReport}
        onConfirmEscalate={handleConfirmEscalate}
      />

      {/* 6. Member Appeal Adjudication Modal */}
      <AppealInvestigationModal
        isOpen={isAppealModalOpen}
        onClose={() => setIsAppealModalOpen(false)}
        appeal={adjudicatingAppeal}
        onResolveAppeal={handleResolveAppeal}
      />

      {/* 7. Content Review Item Modal */}
      <ContentReviewDetailModal
        isOpen={isContentReviewModalOpen}
        onClose={() => setIsContentReviewModalOpen(false)}
        item={reviewingContentItem}
        onApprove={(itemId, notes) => handleReviewContentItem(itemId, "approved", notes)}
        onReject={(itemId, reason) => handleReviewContentItem(itemId, "rejected", reason)}
        onEscalateToCase={(item) => {
          showToast(`Content item #${item.id} escalated to Trust & Safety investigation queue.`);
        }}
      />

      {/* 8. Filter Drawer */}
      <ModerationFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filterState={filters}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1);
        }}
        onResetFilters={() => {
          setFilters(DEFAULT_FILTERS);
          setCurrentPage(1);
        }}
        totalFiltered={filteredReports.length}
      />
    </div>
  );
};
