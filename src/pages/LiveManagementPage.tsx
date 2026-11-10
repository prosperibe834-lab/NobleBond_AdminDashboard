// NobleBond Admin — Complete Live Management Redesign & Functional Implementation
// Operations dashboard, host controls, audience telemetry, virtual gift coins ledger, zero emojis

import React, { useState, useMemo, useCallback } from "react";
import {
  Radio,
  RadioTower,
  Users,
  Eye,
  Coins,
  ShieldAlert,
  Activity,
  BarChart2,
  Filter,
  Download,
  RotateCcw,
  Search,
  CheckCircle2,
  X,
  LayoutGrid,
  List,
  Calendar,
  MessageSquare,
} from "lucide-react";

// Types
import type {
  LiveSessionRecord,
  LiveHostRecord,
  LiveViewerRecord,
  LiveGuestRecord,
  LiveGiftTransactionRecord,
  LiveCommentRecord,
  LiveReportRecord,
  StreamHealthRecord,
  LiveFilterState,
  LiveSortCriteria,
  LiveSortField,
} from "../types/liveManagement.types";
import type { DateRangePreset } from "../types/likesMatches.types";

// Data Service
import {
  loadLiveSessions,
  loadLiveHosts,
  loadLiveViewers,
  loadLiveGuests,
  loadLiveGifts,
  loadLiveComments,
  loadLiveReports,
  loadStreamHealth,
  calculateLiveKPIs,
  filterAndSortLiveSessions,
  filterAndSortLiveHosts,
  filterAndSortViewers,
  filterAndSortGuests,
  filterAndSortGifts,
  filterAndSortLiveReports,
  filterAndSortHealth,
  endLiveSession,
  restrictHostAccess,
  restoreHostAccess,
  removeGuestFromSession,
  removeLiveComment,
  assignLiveReport,
  resolveLiveReport,
  dismissLiveReport,
  resetLiveManagementData,
  exportLiveSessionsCsv,
  exportLiveGiftsCsv,
} from "../data/liveManagementDataService";

// Subcomponents
import { LiveStatsHeader } from "../components/live/LiveStatsHeader";
import { LiveNowGrid } from "../components/live/LiveNowGrid";
import { LiveAnalyticsSection } from "../components/live/LiveAnalyticsSection";
import { LiveFilterDrawer } from "../components/live/LiveFilterDrawer";
import { LiveSessionsTable } from "../components/live/LiveSessionsTable";
import { HostManagementTable } from "../components/live/HostManagementTable";
import { AudienceViewersTable } from "../components/live/AudienceViewersTable";
import { GuestCoHostTable } from "../components/live/GuestCoHostTable";
import { GiftsTransactionsTable } from "../components/live/GiftsTransactionsTable";
import { CommentsInteractionsSection } from "../components/live/CommentsInteractionsSection";
import { LiveReportsModerationTable } from "../components/live/LiveReportsModerationTable";
import { StreamHealthSection } from "../components/live/StreamHealthSection";
import { LiveMobileCards } from "../components/live/LiveMobileCards";
import { LivePagination } from "../components/live/LivePagination";
import { LiveSkeletonLoader } from "../components/live/LiveSkeletonLoader";

// Modals & Drawers
import { LiveSessionDetailDrawer } from "../components/live/modals/LiveSessionDetailDrawer";
import { LiveStreamPreviewModal } from "../components/live/modals/LiveStreamPreviewModal";
import { EndLiveSessionModal } from "../components/live/modals/EndLiveSessionModal";
import { HostDetailDrawer } from "../components/live/modals/HostDetailDrawer";
import { RestrictHostModal } from "../components/live/modals/RestrictHostModal";
import { ViewerDetailDrawer } from "../components/live/modals/ViewerDetailDrawer";
import { GuestDetailModal } from "../components/live/modals/GuestDetailModal";
import { RemoveGuestModal } from "../components/live/modals/RemoveGuestModal";
import { GiftTransactionDetailModal } from "../components/live/modals/GiftTransactionDetailModal";
import { LiveReportInvestigationModal } from "../components/live/modals/LiveReportInvestigationModal";

// Tab Definitions
type LiveTabKey =
  | "overview"
  | "sessions"
  | "hosts"
  | "audience"
  | "guests"
  | "gifts"
  | "comments"
  | "moderation"
  | "health"
  | "analytics";

interface TabItem {
  key: LiveTabKey;
  label: string;
  icon: React.ComponentType<{ size: number; color?: string }>;
  badge?: number | string;
  badgeColor?: string;
}

const DEFAULT_FILTERS: LiveFilterState = {
  searchQuery: "",
  sessionStatus: "all",
  category: "all",
  hostStatus: "all",
  reportStatus: "all",
  reportPriority: "all",
  giftType: "all",
  healthStatus: "all",
  dateRange: "all",
  streamProvider: "all",
};

export const LiveManagementPage: React.FC = () => {
  // Loading State
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Core Data Records initialized directly from local demo state
  const [sessions, setSessions] = useState<LiveSessionRecord[]>(() => loadLiveSessions());
  const [hosts, setHosts] = useState<LiveHostRecord[]>(() => loadLiveHosts());
  const [viewers, setViewers] = useState<LiveViewerRecord[]>(() => loadLiveViewers());
  const [guests, setGuests] = useState<LiveGuestRecord[]>(() => loadLiveGuests());
  const [gifts, setGifts] = useState<LiveGiftTransactionRecord[]>(() => loadLiveGifts());
  const [comments, setComments] = useState<LiveCommentRecord[]>(() => loadLiveComments());
  const [reports, setReports] = useState<LiveReportRecord[]>(() => loadLiveReports());
  const [health, setHealth] = useState<StreamHealthRecord[]>(() => loadStreamHealth());

  // Navigation & View State
  const [activeTab, setActiveTab] = useState<LiveTabKey>("overview");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [filterState, setFilterState] = useState<LiveFilterState>(DEFAULT_FILTERS);
  const [sortCriteria, setSortCriteria] = useState<LiveSortCriteria>({
    field: "startedAt",
    direction: "desc",
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Tab and Filter Change Handlers with Pagination Reset
  const handleTabChange = (newTab: LiveTabKey) => {
    setActiveTab(newTab);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: LiveFilterState) => {
    setFilterState(newFilters);
    setCurrentPage(1);
  };

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Modals & Drawers Target State
  const [selectedSession, setSelectedSession] = useState<LiveSessionRecord | null>(null);
  const [previewSession, setPreviewSession] = useState<LiveSessionRecord | null>(null);
  const [endSessionTarget, setEndSessionTarget] = useState<LiveSessionRecord | null>(null);
  const [selectedHost, setSelectedHost] = useState<LiveHostRecord | null>(null);
  const [restrictHostTarget, setRestrictHostTarget] = useState<LiveHostRecord | null>(null);
  const [selectedViewer, setSelectedViewer] = useState<LiveViewerRecord | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<LiveGuestRecord | null>(null);
  const [removeGuestTarget, setRemoveGuestTarget] = useState<LiveGuestRecord | null>(null);
  const [selectedGift, setSelectedGift] = useState<LiveGiftTransactionRecord | null>(null);
  const [investigatingReport, setInvestigatingReport] = useState<LiveReportRecord | null>(null);

  const showToast = useCallback((text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  }, []);

  // Refresh Telemetry Data
  const loadAllData = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setSessions(loadLiveSessions());
      setHosts(loadLiveHosts());
      setViewers(loadLiveViewers());
      setGuests(loadLiveGuests());
      setGifts(loadLiveGifts());
      setComments(loadLiveComments());
      setReports(loadLiveReports());
      setHealth(loadStreamHealth());
      setIsLoading(false);
      showToast("Stream telemetry and records refreshed.", "success");
    }, 350);
  }, [showToast]);

  // Derived KPIs
  const kpis = useMemo(() => {
    return calculateLiveKPIs(sessions, hosts, viewers, gifts, reports, health);
  }, [sessions, hosts, viewers, gifts, reports, health]);

  // Filtered & Sorted Datasets
  const filteredSessions = useMemo(() => {
    return filterAndSortLiveSessions(sessions, filterState, sortCriteria);
  }, [sessions, filterState, sortCriteria]);

  const filteredHosts = useMemo(() => {
    return filterAndSortLiveHosts(hosts, filterState);
  }, [hosts, filterState]);

  const filteredViewers = useMemo(() => {
    return filterAndSortViewers(viewers, filterState);
  }, [viewers, filterState]);

  const filteredGuests = useMemo(() => {
    return filterAndSortGuests(guests, filterState);
  }, [guests, filterState]);

  const filteredGifts = useMemo(() => {
    return filterAndSortGifts(gifts, filterState);
  }, [gifts, filterState]);

  const filteredReports = useMemo(() => {
    return filterAndSortLiveReports(reports, filterState);
  }, [reports, filterState]);

  const filteredHealth = useMemo(() => {
    return filterAndSortHealth(health, filterState);
  }, [health, filterState]);

  const filteredComments = useMemo(() => {
    if (!filterState.searchQuery.trim()) return comments;
    const q = filterState.searchQuery.toLowerCase().trim();
    return comments.filter(
      (c) =>
        c.commentText.toLowerCase().includes(q) ||
        c.sender.name.toLowerCase().includes(q) ||
        c.sessionTitle.toLowerCase().includes(q)
    );
  }, [comments, filterState.searchQuery]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterState.sessionStatus !== "all") count++;
    if (filterState.category !== "all") count++;
    if (filterState.hostStatus !== "all") count++;
    if (filterState.reportStatus !== "all") count++;
    if (filterState.reportPriority !== "all") count++;
    if (filterState.giftType !== "all") count++;
    if (filterState.healthStatus !== "all") count++;
    if (filterState.streamProvider !== "all") count++;
    if (filterState.dateRange !== "all") count++;
    return count;
  }, [filterState]);

  // Paginated Current Slices
  const paginatedSessions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSessions.slice(start, start + pageSize);
  }, [filteredSessions, currentPage, pageSize]);

  const paginatedHosts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredHosts.slice(start, start + pageSize);
  }, [filteredHosts, currentPage, pageSize]);

  const paginatedViewers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredViewers.slice(start, start + pageSize);
  }, [filteredViewers, currentPage, pageSize]);

  const paginatedGuests = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredGuests.slice(start, start + pageSize);
  }, [filteredGuests, currentPage, pageSize]);

  const paginatedGifts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredGifts.slice(start, start + pageSize);
  }, [filteredGifts, currentPage, pageSize]);

  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReports.slice(start, start + pageSize);
  }, [filteredReports, currentPage, pageSize]);

  const paginatedHealth = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredHealth.slice(start, start + pageSize);
  }, [filteredHealth, currentPage, pageSize]);

  // Action Handlers
  const handleSortChange = (field: LiveSortField) => {
    setSortCriteria((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  const handleEndSession = (sessionId: string, reason: string) => {
    const updated = endLiveSession(sessionId, reason, "Admin Supervisor");
    setSessions(updated);
    showToast(`Session ${sessionId} terminated successfully. Enforcement audit logged.`, "info");
  };

  const handleRestrictHost = (hostId: string, durationDays: number | null, reason: string) => {
    const updated = restrictHostAccess(hostId, durationDays, reason, "Admin Supervisor");
    setHosts(updated);
    // Also update any live rooms hosted by this host
    const updatedSessions = loadLiveSessions();
    setSessions(updatedSessions);
    showToast(`Host privileges restricted for host ID ${hostId}.`, "error");
  };

  const handleRestoreHostAccess = (hostId: string) => {
    const updated = restoreHostAccess(hostId);
    setHosts(updated);
    showToast(`Broadcasting privileges restored for host ID ${hostId}.`, "success");
  };

  const handleRemoveGuest = (guestId: string, reason: string) => {
    const result = removeGuestFromSession(guestId, reason);
    setGuests(result.guests);
    setSessions(result.sessions);
    showToast(`Co-host guest evicted from stage slot.`, "info");
  };

  const handleRemoveComment = (commentId: string) => {
    const updated = removeLiveComment(commentId);
    setComments(updated);
    showToast(`Comment removed from broadcast stream.`, "info");
  };

  const handleAssignModerator = (reportId: string, moderatorName: string) => {
    const updated = assignLiveReport(reportId, moderatorName);
    setReports(updated);
    showToast(`Report ${reportId} assigned to ${moderatorName}.`, "success");
  };

  const handleResolveReport = (reportId: string, resolution: string, notes: string) => {
    const updated = resolveLiveReport(reportId, resolution, notes, "Admin Supervisor");
    setReports(updated);
    showToast(`Report ${reportId} resolved with action: ${resolution}.`, "success");
  };

  const handleDismissReport = (reportId: string, notes: string) => {
    const updated = dismissLiveReport(reportId, notes, "Admin Supervisor");
    setReports(updated);
    showToast(`Report ${reportId} dismissed.`, "info");
  };

  const handleResetData = () => {
    if (window.confirm("Reset all Live Management records to default demonstration data?")) {
      resetLiveManagementData();
      loadAllData();
      setFilterState(DEFAULT_FILTERS);
      showToast("Live Management demonstration records restored to factory defaults.", "info");
    }
  };

  const handleExportData = () => {
    if (activeTab === "gifts") {
      exportLiveGiftsCsv(filteredGifts);
      showToast("Exported Virtual Gift Coin transactions CSV.", "success");
    } else {
      exportLiveSessionsCsv(filteredSessions);
      showToast("Exported Live Broadcast Sessions CSV.", "success");
    }
  };

  // Tab Items Configuration
  const tabs: TabItem[] = [
    {
      key: "overview",
      label: "Operations Dashboard",
      icon: Radio,
    },
    {
      key: "sessions",
      label: "Live Sessions",
      icon: RadioTower,
      badge: kpis.currentlyLiveRooms > 0 ? `${kpis.currentlyLiveRooms} Live` : undefined,
      badgeColor: "#DC2626",
    },
    {
      key: "hosts",
      label: "Host Management",
      icon: Users,
      badge: hosts.length,
    },
    {
      key: "audience",
      label: "Audience & Viewers",
      icon: Eye,
      badge: viewers.length,
    },
    {
      key: "guests",
      label: "Guest & Co-Host",
      icon: Users,
      badge: guests.filter((g) => g.connectionStatus === "connected").length > 0
        ? `${guests.filter((g) => g.connectionStatus === "connected").length} On Stage`
        : undefined,
      badgeColor: "#8B5CF6",
    },
    {
      key: "gifts",
      label: "Gifts & Coins",
      icon: Coins,
      badge: gifts.length,
    },
    {
      key: "comments",
      label: "Live Chat",
      icon: MessageSquare,
      badge: comments.length,
    },
    {
      key: "moderation",
      label: "Safety & Reports",
      icon: ShieldAlert,
      badge: kpis.pendingLiveReports > 0 ? kpis.pendingLiveReports : undefined,
      badgeColor: "#EF4444",
    },
    {
      key: "health",
      label: "Stream Health",
      icon: Activity,
      badge: kpis.failedOrInterruptedStreams > 0 ? `${kpis.failedOrInterruptedStreams} Degraded` : undefined,
      badgeColor: "#F59E0B",
    },
    {
      key: "analytics",
      label: "Live Analytics",
      icon: BarChart2,
    },
  ];

  return (
    <div
      className="animate-fade-in"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "22px",
        paddingBottom: "40px",
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="animate-scale-up"
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            zIndex: 10001,
            padding: "12px 20px",
            borderRadius: "12px",
            backgroundColor:
              toastMessage.type === "error"
                ? "var(--status-error-bg, #FEF2F2)"
                : toastMessage.type === "info"
                ? "rgba(99, 102, 241, 0.12)"
                : "rgba(16, 185, 129, 0.12)",
            border: `1px solid ${
              toastMessage.type === "error"
                ? "var(--status-error, #EF4444)"
                : toastMessage.type === "info"
                ? "#6366F1"
                : "#10B981"
            }`,
            color:
              toastMessage.type === "error"
                ? "#EF4444"
                : toastMessage.type === "info"
                ? "#4F46E5"
                : "#10B981",
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={16} />
          <span>{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
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
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                backgroundColor: "rgba(139, 29, 65, 0.12)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Radio size={24} />
            </div>
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "var(--text-main)",
                  letterSpacing: "-0.02em",
                }}
              >
                Live Operations & Stream Control Center
              </h1>
              <p
                style={{
                  margin: "3px 0 0",
                  fontSize: "13.5px",
                  color: "var(--text-secondary)",
                }}
              >
                Real-time broadcast monitoring, audience telemetry, virtual Gift Coins ledger, and stage moderation.
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={loadAllData}
            title="Refresh stream telemetry and metrics"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 14px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-main)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <RotateCcw size={15} /> Refresh Telemetry
          </button>

          <button
            onClick={handleExportData}
            title="Export data as CSV"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 14px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-main)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <Download size={15} /> Export {activeTab === "gifts" ? "Gifts" : "Sessions"}
          </button>

          <button
            onClick={handleResetData}
            title="Restore initial seed demo records"
            style={{
              padding: "9px 12px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-secondary)",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            Reset Seed Data
          </button>
        </div>
      </div>

      {/* KPI Stats Header (10 cards derived dynamically) */}
      <LiveStatsHeader
        kpis={kpis}
        activeTab={activeTab}
        onSelectTab={(tabId) => {
          if (
            tabId === "overview" ||
            tabId === "sessions" ||
            tabId === "hosts" ||
            tabId === "audience" ||
            tabId === "guests" ||
            tabId === "gifts" ||
            tabId === "comments" ||
            tabId === "moderation" ||
            tabId === "health" ||
            tabId === "analytics"
          ) {
            handleTabChange(tabId);
          }
        }}
      />

      {/* Tab Navigation Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          borderBottom: "1px solid var(--border)",
          overflowX: "auto",
          paddingBottom: "2px",
          scrollbarWidth: "none",
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                borderRadius: "10px 10px 0 0",
                border: "none",
                backgroundColor: isActive ? "var(--bg-card)" : "transparent",
                borderBottom: isActive
                  ? "2px solid var(--primary, #8B1D41)"
                  : "2px solid transparent",
                color: isActive ? "var(--text-main)" : "var(--text-secondary)",
                fontSize: "13px",
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              <Icon size={16} color={isActive ? "var(--primary)" : "var(--text-secondary)"} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: "10px",
                    backgroundColor: tab.badgeColor || "var(--border)",
                    color: tab.badgeColor ? "#FFFFFF" : "var(--text-secondary)",
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Toolbar: Search, Filters, Date Range, View Mode */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          padding: "14px 18px",
          backgroundColor: "var(--bg-card)",
          borderRadius: "14px",
          border: "1px solid var(--border)",
        }}
      >
        {/* Search Input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flex: "1 1 280px",
            maxWidth: "420px",
            backgroundColor: "var(--bg-secondary)",
            borderRadius: "10px",
            padding: "8px 14px",
            border: "1px solid var(--border)",
          }}
        >
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            value={filterState.searchQuery}
            onChange={(e) =>
              handleFilterChange({ ...filterState, searchQuery: e.target.value })
            }
            placeholder={`Search ${activeTab}... (title, host, ID, or user)`}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-main)",
              fontSize: "13px",
              width: "100%",
            }}
          />
          {filterState.searchQuery && (
            <button
              onClick={() => handleFilterChange({ ...filterState, searchQuery: "" })}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "2px",
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Right Tools */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {/* Date Range Selector */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "10px",
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            <Calendar size={14} color="var(--text-muted)" />
            <select
              value={filterState.dateRange}
              onChange={(e) =>
                handleFilterChange({
                  ...filterState,
                  dateRange: e.target.value as DateRangePreset,
                })
              }
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-main)",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>

          {/* Filter Drawer Trigger */}
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor:
                activeFilterCount > 0 ? "rgba(139, 29, 65, 0.08)" : "var(--bg-secondary)",
              color: activeFilterCount > 0 ? "var(--primary)" : "var(--text-main)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Filter size={15} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span
                style={{
                  padding: "1px 6px",
                  borderRadius: "10px",
                  backgroundColor: "var(--primary)",
                  color: "#FFFFFF",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Reset Filters shortcut */}
          {activeFilterCount > 0 && (
            <button
              onClick={() => handleFilterChange(DEFAULT_FILTERS)}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                fontSize: "12px",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Clear filters
            </button>
          )}

          {/* View Mode Switcher (Table vs Mobile Cards) */}
          <div
            style={{
              display: "flex",
              backgroundColor: "var(--bg-secondary)",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              padding: "2px",
            }}
          >
            <button
              onClick={() => setViewMode("table")}
              title="Table view"
              style={{
                padding: "6px 10px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: viewMode === "table" ? "var(--bg-card)" : "transparent",
                color: viewMode === "table" ? "var(--text-main)" : "var(--text-muted)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode("cards")}
              title="Card view"
              style={{
                padding: "6px 10px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: viewMode === "cards" ? "var(--bg-card)" : "transparent",
                color: viewMode === "cards" ? "var(--text-main)" : "var(--text-muted)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <LiveSkeletonLoader />
      ) : (
        <>
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Prominent Live Now Broadcast Grid */}
              <LiveNowGrid
                sessions={sessions}
                onOpenDetails={(s) => setSelectedSession(s)}
                onOpenPreview={(s) => setPreviewSession(s)}
                onOpenEndSession={(s) => setEndSessionTarget(s)}
              />

              {/* Operations Analytics Section */}
              <LiveAnalyticsSection
                sessions={sessions}
                gifts={gifts}
                reports={reports}
              />

              {/* Operational Sessions Overview */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "var(--text-main)",
                    }}
                  >
                    Recent Live Sessions
                  </h3>
                  <button
                    onClick={() => handleTabChange("sessions")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--primary)",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    View All {sessions.length} Sessions →
                  </button>
                </div>
                <LiveSessionsTable
                  sessions={sessions.slice(0, 5)}
                  sort={sortCriteria}
                  onSortChange={handleSortChange}
                  onOpenDetails={(s) => setSelectedSession(s)}
                  onOpenPreview={(s) => setPreviewSession(s)}
                  onOpenEndSession={(s) => setEndSessionTarget(s)}
                />
              </div>
            </div>
          )}

          {/* TAB 2: SESSIONS */}
          {activeTab === "sessions" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {viewMode === "table" ? (
                <LiveSessionsTable
                  sessions={paginatedSessions}
                  sort={sortCriteria}
                  onSortChange={handleSortChange}
                  onOpenDetails={(s) => setSelectedSession(s)}
                  onOpenPreview={(s) => setPreviewSession(s)}
                  onOpenEndSession={(s) => setEndSessionTarget(s)}
                />
              ) : (
                <LiveMobileCards
                  tab="sessions"
                  sessions={paginatedSessions}
                  hosts={[]}
                  viewers={[]}
                  guests={[]}
                  gifts={[]}
                  reports={[]}
                  health={[]}
                  onOpenSession={(s) => setSelectedSession(s)}
                  onOpenPreview={(s) => setPreviewSession(s)}
                  onOpenEndSession={(s) => setEndSessionTarget(s)}
                  onOpenHost={() => {}}
                  onOpenViewer={() => {}}
                  onOpenGuest={() => {}}
                  onOpenGift={() => {}}
                  onOpenReport={() => {}}
                />
              )}
              <LivePagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={filteredSessions.length}
                onPageChange={(p) => setCurrentPage(p)}
                onPageSizeChange={(s) => {
                  setPageSize(s);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}

          {/* TAB 3: HOSTS */}
          {activeTab === "hosts" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {viewMode === "table" ? (
                <HostManagementTable
                  hosts={paginatedHosts}
                  onOpenHostDetails={(h) => setSelectedHost(h)}
                  onOpenRestrictModal={(h) => setRestrictHostTarget(h)}
                  onRestoreAccess={handleRestoreHostAccess}
                />
              ) : (
                <LiveMobileCards
                  tab="hosts"
                  sessions={[]}
                  hosts={paginatedHosts}
                  viewers={[]}
                  guests={[]}
                  gifts={[]}
                  reports={[]}
                  health={[]}
                  onOpenSession={() => {}}
                  onOpenPreview={() => {}}
                  onOpenEndSession={() => {}}
                  onOpenHost={(h) => setSelectedHost(h)}
                  onOpenViewer={() => {}}
                  onOpenGuest={() => {}}
                  onOpenGift={() => {}}
                  onOpenReport={() => {}}
                />
              )}
              <LivePagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={filteredHosts.length}
                onPageChange={(p) => setCurrentPage(p)}
                onPageSizeChange={(s) => {
                  setPageSize(s);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}

          {/* TAB 4: AUDIENCE */}
          {activeTab === "audience" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {viewMode === "table" ? (
                <AudienceViewersTable
                  viewers={paginatedViewers}
                  onOpenViewerDetails={(v) => setSelectedViewer(v)}
                />
              ) : (
                <LiveMobileCards
                  tab="audience"
                  sessions={[]}
                  hosts={[]}
                  viewers={paginatedViewers}
                  guests={[]}
                  gifts={[]}
                  reports={[]}
                  health={[]}
                  onOpenSession={() => {}}
                  onOpenPreview={() => {}}
                  onOpenEndSession={() => {}}
                  onOpenHost={() => {}}
                  onOpenViewer={(v) => setSelectedViewer(v)}
                  onOpenGuest={() => {}}
                  onOpenGift={() => {}}
                  onOpenReport={() => {}}
                />
              )}
              <LivePagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={filteredViewers.length}
                onPageChange={(p) => setCurrentPage(p)}
                onPageSizeChange={(s) => {
                  setPageSize(s);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}

          {/* TAB 5: GUESTS */}
          {activeTab === "guests" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {viewMode === "table" ? (
                <GuestCoHostTable
                  guests={paginatedGuests}
                  onOpenGuestDetails={(g) => setSelectedGuest(g)}
                  onOpenRemoveGuest={(g) => setRemoveGuestTarget(g)}
                />
              ) : (
                <LiveMobileCards
                  tab="guests"
                  sessions={[]}
                  hosts={[]}
                  viewers={[]}
                  guests={paginatedGuests}
                  gifts={[]}
                  reports={[]}
                  health={[]}
                  onOpenSession={() => {}}
                  onOpenPreview={() => {}}
                  onOpenEndSession={() => {}}
                  onOpenHost={() => {}}
                  onOpenViewer={() => {}}
                  onOpenGuest={(g) => setSelectedGuest(g)}
                  onOpenGift={() => {}}
                  onOpenReport={() => {}}
                />
              )}
              <LivePagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={filteredGuests.length}
                onPageChange={(p) => setCurrentPage(p)}
                onPageSizeChange={(s) => {
                  setPageSize(s);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}

          {/* TAB 6: GIFTS */}
          {activeTab === "gifts" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {viewMode === "table" ? (
                <GiftsTransactionsTable
                  gifts={paginatedGifts}
                  onOpenGiftDetails={(g) => setSelectedGift(g)}
                />
              ) : (
                <LiveMobileCards
                  tab="gifts"
                  sessions={[]}
                  hosts={[]}
                  viewers={[]}
                  guests={[]}
                  gifts={paginatedGifts}
                  reports={[]}
                  health={[]}
                  onOpenSession={() => {}}
                  onOpenPreview={() => {}}
                  onOpenEndSession={() => {}}
                  onOpenHost={() => {}}
                  onOpenViewer={() => {}}
                  onOpenGuest={() => {}}
                  onOpenGift={(g) => setSelectedGift(g)}
                  onOpenReport={() => {}}
                />
              )}
              <LivePagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={filteredGifts.length}
                onPageChange={(p) => setCurrentPage(p)}
                onPageSizeChange={(s) => {
                  setPageSize(s);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}

          {/* TAB 7: COMMENTS */}
          {activeTab === "comments" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <CommentsInteractionsSection
                comments={filteredComments}
                onRemoveComment={handleRemoveComment}
              />
            </div>
          )}

          {/* TAB 8: MODERATION */}
          {activeTab === "moderation" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {viewMode === "table" ? (
                <LiveReportsModerationTable
                  reports={paginatedReports}
                  onInvestigate={(r) => setInvestigatingReport(r)}
                  onAssignModerator={(reportId) =>
                    handleAssignModerator(reportId, "Admin Sarah Jenkins")
                  }
                />
              ) : (
                <LiveMobileCards
                  tab="moderation"
                  sessions={[]}
                  hosts={[]}
                  viewers={[]}
                  guests={[]}
                  gifts={[]}
                  reports={paginatedReports}
                  health={[]}
                  onOpenSession={() => {}}
                  onOpenPreview={() => {}}
                  onOpenEndSession={() => {}}
                  onOpenHost={() => {}}
                  onOpenViewer={() => {}}
                  onOpenGuest={() => {}}
                  onOpenGift={() => {}}
                  onOpenReport={(r) => setInvestigatingReport(r)}
                />
              )}
              <LivePagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={filteredReports.length}
                onPageChange={(p) => setCurrentPage(p)}
                onPageSizeChange={(s) => {
                  setPageSize(s);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}

          {/* TAB 9: STREAM HEALTH */}
          {activeTab === "health" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {viewMode === "table" ? (
                <StreamHealthSection healthRecords={paginatedHealth} />
              ) : (
                <LiveMobileCards
                  tab="health"
                  sessions={[]}
                  hosts={[]}
                  viewers={[]}
                  guests={[]}
                  gifts={[]}
                  reports={[]}
                  health={paginatedHealth}
                  onOpenSession={() => {}}
                  onOpenPreview={() => {}}
                  onOpenEndSession={() => {}}
                  onOpenHost={() => {}}
                  onOpenViewer={() => {}}
                  onOpenGuest={() => {}}
                  onOpenGift={() => {}}
                  onOpenReport={() => {}}
                />
              )}
              <LivePagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={filteredHealth.length}
                onPageChange={(p) => setCurrentPage(p)}
                onPageSizeChange={(s) => {
                  setPageSize(s);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}

          {/* TAB 10: ANALYTICS */}
          {activeTab === "analytics" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <LiveAnalyticsSection
                sessions={sessions}
                gifts={gifts}
                reports={reports}
              />
            </div>
          )}
        </>
      )}

      {/* FILTER DRAWER */}
      <LiveFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filterState={filterState}
        onFilterChange={(f) => handleFilterChange(f)}
        onResetFilters={() => handleFilterChange(DEFAULT_FILTERS)}
        totalFiltered={filteredSessions.length}
      />

      {/* MODAL 1: Session Detail Drawer */}
      <LiveSessionDetailDrawer
        isOpen={!!selectedSession}
        onClose={() => setSelectedSession(null)}
        session={selectedSession}
        onOpenPreview={(s: LiveSessionRecord) => {
          setSelectedSession(null);
          setPreviewSession(s);
        }}
        onOpenEndSession={(s: LiveSessionRecord) => {
          setSelectedSession(null);
          setEndSessionTarget(s);
        }}
      />

      {/* MODAL 2: Live Stream Preview Modal */}
      <LiveStreamPreviewModal
        isOpen={!!previewSession}
        onClose={() => setPreviewSession(null)}
        session={previewSession}
        onEndSession={(s: LiveSessionRecord) => {
          setPreviewSession(null);
          setEndSessionTarget(s);
        }}
      />

      {/* MODAL 3: End Live Session Modal */}
      <EndLiveSessionModal
        isOpen={!!endSessionTarget}
        onClose={() => setEndSessionTarget(null)}
        session={endSessionTarget}
        onConfirmEnd={handleEndSession}
      />

      {/* MODAL 4: Host Detail Drawer */}
      <HostDetailDrawer
        isOpen={!!selectedHost}
        onClose={() => setSelectedHost(null)}
        host={selectedHost}
        onOpenRestrictModal={(h: LiveHostRecord) => {
          setSelectedHost(null);
          setRestrictHostTarget(h);
        }}
        onRestoreAccess={handleRestoreHostAccess}
      />

      {/* MODAL 5: Restrict Host Modal */}
      <RestrictHostModal
        isOpen={!!restrictHostTarget}
        onClose={() => setRestrictHostTarget(null)}
        host={restrictHostTarget}
        onConfirmRestrict={handleRestrictHost}
      />

      {/* MODAL 6: Viewer Detail Drawer */}
      <ViewerDetailDrawer
        isOpen={!!selectedViewer}
        onClose={() => setSelectedViewer(null)}
        viewer={selectedViewer}
      />

      {/* MODAL 7: Guest Detail Modal */}
      <GuestDetailModal
        isOpen={!!selectedGuest}
        onClose={() => setSelectedGuest(null)}
        guest={selectedGuest}
        onOpenRemoveGuest={(g: LiveGuestRecord) => {
          setSelectedGuest(null);
          setRemoveGuestTarget(g);
        }}
      />

      {/* MODAL 8: Remove Guest Modal */}
      <RemoveGuestModal
        isOpen={!!removeGuestTarget}
        onClose={() => setRemoveGuestTarget(null)}
        guest={removeGuestTarget}
        onConfirmRemove={handleRemoveGuest}
      />

      {/* MODAL 9: Gift Transaction Detail Modal */}
      <GiftTransactionDetailModal
        isOpen={!!selectedGift}
        onClose={() => setSelectedGift(null)}
        gift={selectedGift}
      />

      {/* MODAL 10: Live Report Investigation Modal */}
      <LiveReportInvestigationModal
        isOpen={!!investigatingReport}
        onClose={() => setInvestigatingReport(null)}
        report={investigatingReport}
        onAssignModerator={handleAssignModerator}
        onResolve={handleResolveReport}
        onDismiss={handleDismissReport}
        onOpenSession={(sessionId) => {
          const match = sessions.find((s) => s.id === sessionId);
          if (match) {
            setInvestigatingReport(null);
            setSelectedSession(match);
          }
        }}
      />
    </div>
  );
};
