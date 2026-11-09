// NobleBond Admin — Complete Likes & Matches Management Page
// Comprehensive relationship activity management centre, zero emojis, React 19 strict compliance

import React, { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  RotateCw,
  Download,
  Filter,
  Search,
  X,
  Layers,
  CheckCircle2,
  Table as TableIcon,
  LayoutGrid,
  Heart,
  HeartHandshake,
  Sparkles,
  ArrowRight,
  UserX,
  Flag,
  Calendar,
} from "lucide-react";

import type {
  LikeRecord,
  MatchRecord,
  ReportedInteraction,
  LikesMatchesFilterState,
  LikesMatchesSortCriteria,
  LikesMatchesSortField,
  DateRangePreset,
} from "../types/likesMatches.types";

import {
  loadLikes,
  loadMatches,
  loadReports,
  calculateKPIs,
  filterAndSortLikes,
  filterAndSortMatches,
  filterAndSortReports,
  exportLikesCsv,
  exportMatchesCsv,
  resetLikesMatchesData,
  restoreMatch,
  flagInteraction,
  resolveInteractionReport,
} from "../data/likesMatchesDataService";

import { LikesMatchesStatsHeader } from "../components/likes/LikesMatchesStatsHeader";
import { LikesMatchesAnalyticsSection } from "../components/likes/LikesMatchesAnalyticsSection";
import { SuspiciousIndicatorsSection } from "../components/likes/SuspiciousIndicatorsSection";
import { LikesMatchesFilterDrawer } from "../components/likes/LikesMatchesFilterDrawer";
import { AllLikesTable } from "../components/likes/AllLikesTable";
import { MatchesTable } from "../components/likes/MatchesTable";
import { ReportedInteractionsTable } from "../components/likes/ReportedInteractionsTable";
import { LikesMatchesMobileCards } from "../components/likes/LikesMatchesMobileCards";
import { LikesMatchesPagination } from "../components/likes/LikesMatchesPagination";
import { LikesMatchesSkeletonLoader } from "../components/likes/LikesMatchesSkeletonLoader";

import { MatchDetailsModal } from "../components/likes/modals/MatchDetailsModal";
import { LikeDetailsModal } from "../components/likes/modals/LikeDetailsModal";
import { RestoreMatchModal } from "../components/likes/modals/RestoreMatchModal";
import { ResolveReportModal } from "../components/likes/modals/ResolveReportModal";
import { FlagInteractionModal } from "../components/likes/modals/FlagInteractionModal";

const DEFAULT_FILTERS: LikesMatchesFilterState = {
  searchQuery: "",
  interactionType: "all",
  interactionDirection: "all",
  matchStatus: "all",
  gender: "all",
  ageMin: null,
  ageMax: null,
  country: "all",
  city: "all",
  verificationStatus: "all",
  premiumStatus: "all",
  dateRange: "last_30_days",
  hasReports: "all",
};

export const LikesMatchesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Primary Data State
  const [likes, setLikes] = useState<LikeRecord[]>(() => loadLikes());
  const [matches, setMatches] = useState<MatchRecord[]>(() => loadMatches());
  const [reports, setReports] = useState<ReportedInteraction[]>(() => loadReports());
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Tab (9 sections specified in Part 2)
  const [activeTab, setActiveTab] = useState<string>(() => {
    const tabParam = searchParams.get("tab");
    return tabParam || "overview";
  });

  // View Mode
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Filters & Sorting
  const [filterState, setFilterState] = useState<LikesMatchesFilterState>(DEFAULT_FILTERS);
  const [sortCriteria, setSortCriteria] = useState<LikesMatchesSortCriteria>({
    field: "timestamp",
    order: "desc",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals State
  const [detailsMatch, setDetailsMatch] = useState<MatchRecord | null>(null);
  const [detailsLike, setDetailsLike] = useState<LikeRecord | null>(null);
  const [restoreTargetMatch, setRestoreTargetMatch] = useState<MatchRecord | null>(null);
  const [triageReport, setTriageReport] = useState<ReportedInteraction | null>(null);
  const [flagTarget, setFlagTarget] = useState<{ type: "like" | "match"; item: LikeRecord | MatchRecord } | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // KPIs
  const kpis = useMemo(
    () => calculateKPIs(filterState.dateRange, likes, matches, reports),
    [filterState.dateRange, likes, matches, reports]
  );

  // Filtered Likes
  const filteredLikes = useMemo(() => {
    let tabMode: "all_likes" | "incoming" | "outgoing" | "super_likes" = "all_likes";
    if (activeTab === "incoming") tabMode = "incoming";
    else if (activeTab === "outgoing") tabMode = "outgoing";
    else if (activeTab === "super_likes") tabMode = "super_likes";

    return filterAndSortLikes(likes, filterState, sortCriteria, tabMode);
  }, [likes, filterState, sortCriteria, activeTab]);

  // Filtered Matches
  const filteredMatches = useMemo(() => {
    let tabMode: "all_matches" | "active" | "unmatched" = "all_matches";
    if (activeTab === "active") tabMode = "active";
    else if (activeTab === "unmatched") tabMode = "unmatched";

    return filterAndSortMatches(matches, filterState, sortCriteria, tabMode);
  }, [matches, filterState, sortCriteria, activeTab]);

  // Filtered Reports
  const filteredReports = useMemo(
    () => filterAndSortReports(reports, filterState.searchQuery),
    [reports, filterState.searchQuery]
  );

  // Paginated Items
  const isMatchesTab = activeTab === "all_matches" || activeTab === "active" || activeTab === "unmatched";
  const isLikesTab = activeTab === "all_likes" || activeTab === "incoming" || activeTab === "outgoing" || activeTab === "super_likes";
  const isReportsTab = activeTab === "reported";

  const totalCurrentItems = isMatchesTab
    ? filteredMatches.length
    : isLikesTab
    ? filteredLikes.length
    : isReportsTab
    ? filteredReports.length
    : 0;

  const paginatedLikes = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLikes.slice(start, start + pageSize);
  }, [filteredLikes, currentPage, pageSize]);

  const paginatedMatches = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMatches.slice(start, start + pageSize);
  }, [filteredMatches, currentPage, pageSize]);

  // Active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterState.interactionType !== "all") count++;
    if (filterState.interactionDirection !== "all") count++;
    if (filterState.matchStatus !== "all") count++;
    if (filterState.gender !== "all") count++;
    if (filterState.ageMin !== null || filterState.ageMax !== null) count++;
    if (filterState.country !== "all") count++;
    if (filterState.verificationStatus !== "all") count++;
    if (filterState.hasReports !== "all") count++;
    return count;
  }, [filterState]);

  // Refresh
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLikes(loadLikes());
      setMatches(loadMatches());
      setReports(loadReports());
      setIsLoading(false);
      showToast("Relationship interactions & matches refreshed.");
    }, 450);
  };

  // Reset
  const handleResetData = () => {
    const defaults = resetLikesMatchesData();
    setLikes(defaults.likes);
    setMatches(defaults.matches);
    setReports(defaults.reports);
    showToast("Reset Likes & Matches to initial demonstration data.");
  };

  // Export
  const handleExportCsv = () => {
    if (isMatchesTab) {
      const csv = exportMatchesCsv(filteredMatches);
      downloadCsv(csv, "noblebond_matches");
      showToast(`Exported ${filteredMatches.length} match records to CSV.`);
    } else {
      const csv = exportLikesCsv(filteredLikes);
      downloadCsv(csv, "noblebond_likes");
      showToast(`Exported ${filteredLikes.length} like records to CSV.`);
    }
  };

  const downloadCsv = (content: string, filenamePrefix: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${filenamePrefix}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSortChange = (field: LikesMatchesSortField) => {
    setSortCriteria((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  // Actions
  const handleRestoreMatch = (matchId: string, adminReason: string) => {
    try {
      const updated = restoreMatch(matchId, adminReason);
      setMatches((prev) => prev.map((m) => (m.id === matchId ? updated : m)));
      showToast("Mutual match successfully restored to active standing.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error restoring match";
      showToast(msg);
    }
  };

  const handleFlagInteraction = (type: "like" | "match", id: string, reason: string) => {
    flagInteraction(type, id, reason);
    if (type === "match") {
      setMatches(loadMatches());
    } else {
      setLikes(loadLikes());
    }
    showToast(`${type === "match" ? "Match" : "Like"} flagged for review.`);
  };

  const handleResolveReport = (
    reportId: string,
    decision: "investigating" | "resolved" | "escalated" | "dismissed",
    notes: string
  ) => {
    resolveInteractionReport(reportId, decision, notes);
    setReports(loadReports());
    showToast(`Report #${reportId} status updated to ${decision}.`);
  };

  const handleOpenUserProfile = (userId: string) => {
    navigate(`/users?userId=${userId}`);
  };

  const navigationTabs = [
    { id: "overview", label: "Overview", icon: Layers },
    { id: "all_likes", label: `All Likes (${likes.length})`, icon: Heart },
    { id: "incoming", label: "Incoming Likes", icon: Heart },
    { id: "outgoing", label: "Outgoing Likes", icon: ArrowRight },
    { id: "super_likes", label: `Super Likes (${kpis.totalSuperLikes})`, icon: Sparkles },
    { id: "all_matches", label: `All Matches (${matches.length})`, icon: HeartHandshake },
    { id: "active", label: `Active Matches (${kpis.activeMatches})`, icon: HeartHandshake },
    { id: "unmatched", label: `Unmatched (${kpis.totalUnmatches})`, icon: UserX },
    { id: "reported", label: `Reported (${reports.length})`, icon: Flag },
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
            zIndex: 10001,
            backgroundColor: "var(--bg-card)",
            color: "var(--text-main)",
            border: "1px solid var(--border)",
            borderLeft: "4px solid var(--primary)",
            borderRadius: "10px",
            padding: "12px 18px",
            boxShadow: "var(--shadow-lg)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={16} color="var(--primary)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Page Header */}
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
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "var(--text-main)",
              letterSpacing: "-0.5px",
            }}
          >
            Likes & Matches
          </h1>
          <p
            style={{
              fontSize: "13.5px",
              color: "var(--text-secondary)",
              marginTop: "2px",
            }}
          >
            Monitor dating interactions, likes, mutual matches and relationship activity across NobleBond.
          </p>
        </div>

        {/* Header Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {/* Date Range Selector */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              fontSize: "12.5px",
            }}
          >
            <Calendar size={14} color="var(--primary)" />
            <select
              value={filterState.dateRange}
              onChange={(e) =>
                setFilterState((prev) => ({
                  ...prev,
                  dateRange: e.target.value as DateRangePreset,
                }))
              }
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: "var(--text-main)",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <option value="today">Today</option>
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="last_90_days">Last 90 Days</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            style={{
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-main)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <Download size={15} />
            Export CSV
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            style={{
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-main)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <RotateCw size={15} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            type="button"
            onClick={handleResetData}
            title="Reset demonstration data"
            style={{
              padding: "8px 12px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-main)",
              color: "var(--text-secondary)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reset Demo
          </button>
        </div>
      </div>

      {isLoading ? (
        <LikesMatchesSkeletonLoader />
      ) : (
        <>
          {/* 9 KPI Statistics Cards */}
          <LikesMatchesStatsHeader
            kpis={kpis}
            activeTab={activeTab}
            onSelectTab={(tabId) => {
              setActiveTab(tabId);
              setCurrentPage(1);
            }}
          />

          {/* 9 Navigation Sections */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              overflowX: "auto",
              backgroundColor: "var(--bg-card)",
              borderRadius: "14px",
              border: "1px solid var(--border)",
              padding: "4px 8px",
              gap: "4px",
              boxShadow: "var(--shadow-sm)",
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
                    padding: "9px 14px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: isActive ? "var(--primary)" : "transparent",
                    color: isActive ? "#FFFFFF" : "var(--text-secondary)",
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "12.5px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Analytics Section with SVG charts */}
              <LikesMatchesAnalyticsSection likes={likes} matches={matches} />

              {/* Suspicious Patterns Banner */}
              <SuspiciousIndicatorsSection onInvestigateUser={handleOpenUserProfile} />

              {/* Split Glance: Recent Mutual Matches & Recent Likes */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "18px" }}>
                {/* Recent Confirmed Matches */}
                <div
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "16px",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <HeartHandshake size={18} color="var(--primary)" />
                      <span style={{ fontSize: "14.5px", fontWeight: 700, color: "var(--text-main)" }}>
                        Recent Confirmed Matches
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("all_matches")}
                      style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
                    >
                      View All &rarr;
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {matches.slice(0, 4).map((m) => (
                      <div
                        key={m.id}
                        onClick={() => setDetailsMatch(m)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          borderRadius: "10px",
                          backgroundColor: "var(--bg-main)",
                          border: "1px solid var(--border)",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <img
                            src={m.user1.avatar}
                            alt={m.user1.name}
                            style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                          />
                          <div style={{ fontWeight: 700, fontSize: "13px", color: "var(--text-main)" }}>
                            {m.user1.name} & {m.user2.name}
                          </div>
                        </div>

                        <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                          {m.durationDays}d ago
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Likes Stream */}
                <div
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "16px",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Heart size={18} color="#EC4899" />
                      <span style={{ fontSize: "14.5px", fontWeight: 700, color: "var(--text-main)" }}>
                        Recent Outgoing & Incoming Likes
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("all_likes")}
                      style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
                    >
                      View All &rarr;
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {likes.slice(0, 4).map((lk) => (
                      <div
                        key={lk.id}
                        onClick={() => setDetailsLike(lk)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          borderRadius: "10px",
                          backgroundColor: "var(--bg-main)",
                          border: "1px solid var(--border)",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <img
                            src={lk.sender.avatar}
                            alt={lk.sender.name}
                            style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }}
                          />
                          <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-main)" }}>
                            {lk.sender.name} &rarr; {lk.recipient.name}
                          </span>
                        </div>

                        <div>
                          {lk.type === "super_like" ? (
                            <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--accent-lavender)", backgroundColor: "rgba(159, 137, 219, 0.12)", padding: "2px 6px", borderRadius: "4px" }}>
                              Super Like
                            </span>
                          ) : (
                            <span style={{ fontSize: "10px", color: "var(--text-secondary)" }}>
                              Regular
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2, 3, 4, 5, 6, 7, 8, 9: DATA TABLES */}
          {activeTab !== "overview" && (
            <>
              {/* Toolbar: Search, Filter Drawer, View Mode */}
              <div
                style={{
                  padding: "14px 18px",
                  backgroundColor: "var(--bg-card)",
                  borderRadius: "14px",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                {/* Search Input */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    backgroundColor: "var(--bg-main)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    padding: "7px 12px",
                    flex: "1 1 280px",
                    maxWidth: "420px",
                  }}
                >
                  <Search size={15} color="var(--text-secondary)" />
                  <input
                    type="text"
                    placeholder="Search by participant name, username, ID or Match ID..."
                    value={filterState.searchQuery}
                    onChange={(e) => {
                      setFilterState((prev) => ({ ...prev, searchQuery: e.target.value }));
                      setCurrentPage(1);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      outline: "none",
                      color: "var(--text-main)",
                      fontSize: "12.5px",
                      width: "100%",
                    }}
                  />
                  {filterState.searchQuery && (
                    <button
                      type="button"
                      onClick={() => setFilterState((prev) => ({ ...prev, searchQuery: "" }))}
                      style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Filter and View Mode Controls */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setIsFilterDrawerOpen(true)}
                    style={{
                      padding: "7px 12px",
                      borderRadius: "8px",
                      border: activeFiltersCount > 0 ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                      backgroundColor: activeFiltersCount > 0 ? "rgba(139, 29, 65, 0.08)" : "var(--bg-main)",
                      color: activeFiltersCount > 0 ? "var(--primary)" : "var(--text-main)",
                      fontSize: "12.5px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Filter size={14} />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span
                        style={{
                          padding: "1px 6px",
                          borderRadius: "10px",
                          backgroundColor: "var(--primary)",
                          color: "#FFFFFF",
                          fontSize: "10.5px",
                        }}
                      >
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>

                  <div
                    style={{
                      display: "flex",
                      backgroundColor: "var(--bg-main)",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      padding: "2px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setViewMode("table")}
                      style={{
                        padding: "5px 8px",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: viewMode === "table" ? "var(--bg-card)" : "transparent",
                        color: viewMode === "table" ? "var(--primary)" : "var(--text-secondary)",
                        cursor: "pointer",
                        boxShadow: viewMode === "table" ? "var(--shadow-sm)" : "none",
                      }}
                      title="Desktop Table View"
                    >
                      <TableIcon size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("cards")}
                      style={{
                        padding: "5px 8px",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: viewMode === "cards" ? "var(--bg-card)" : "transparent",
                        color: viewMode === "cards" ? "var(--primary)" : "var(--text-secondary)",
                        cursor: "pointer",
                        boxShadow: viewMode === "cards" ? "var(--shadow-sm)" : "none",
                      }}
                      title="Mobile Card View"
                    >
                      <LayoutGrid size={15} />
                    </button>
                  </div>
                </div>
              </div>

              {/* LIKES TABLES */}
              {isLikesTab && (
                viewMode === "table" ? (
                  <AllLikesTable
                    likes={paginatedLikes}
                    sort={sortCriteria}
                    onSortChange={handleSortChange}
                    onOpenLikeDetails={(lk) => setDetailsLike(lk)}
                    onOpenMatchDetails={(mId) => {
                      const found = matches.find((m) => m.id === mId);
                      if (found) setDetailsMatch(found);
                    }}
                    onFlagLike={(lk) => setFlagTarget({ type: "like", item: lk })}
                    onOpenUserProfile={handleOpenUserProfile}
                  />
                ) : (
                  <LikesMatchesMobileCards
                    viewType="likes"
                    likes={paginatedLikes}
                    matches={[]}
                    onOpenLikeDetails={(lk) => setDetailsLike(lk)}
                    onOpenMatchDetails={() => {}}
                    onOpenRestoreModal={() => {}}
                    onOpenUserProfile={handleOpenUserProfile}
                  />
                )
              )}

              {/* MATCHES TABLES */}
              {isMatchesTab && (
                viewMode === "table" ? (
                  <MatchesTable
                    matches={paginatedMatches}
                    sort={sortCriteria}
                    onSortChange={handleSortChange}
                    onOpenMatchDetails={(m) => setDetailsMatch(m)}
                    onOpenRestoreModal={(m) => setRestoreTargetMatch(m)}
                    onOpenUserProfile={handleOpenUserProfile}
                  />
                ) : (
                  <LikesMatchesMobileCards
                    viewType="matches"
                    likes={[]}
                    matches={paginatedMatches}
                    onOpenLikeDetails={() => {}}
                    onOpenMatchDetails={(m) => setDetailsMatch(m)}
                    onOpenRestoreModal={(m) => setRestoreTargetMatch(m)}
                    onOpenUserProfile={handleOpenUserProfile}
                  />
                )
              )}

              {/* REPORTED INTERACTIONS TABLE */}
              {isReportsTab && (
                <ReportedInteractionsTable
                  reports={filteredReports}
                  onOpenReportModal={(rep) => setTriageReport(rep)}
                  onOpenUserProfile={handleOpenUserProfile}
                />
              )}

              {/* Pagination */}
              <LikesMatchesPagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={totalCurrentItems}
                onPageChange={setCurrentPage}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setCurrentPage(1);
                }}
              />
            </>
          )}
        </>
      )}

      {/* Advanced Filter Drawer */}
      <LikesMatchesFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filterState={filterState}
        onFilterChange={(newFilters) => {
          setFilterState(newFilters);
          setCurrentPage(1);
        }}
        onResetFilters={() => setFilterState(DEFAULT_FILTERS)}
        totalFiltered={isMatchesTab ? filteredMatches.length : filteredLikes.length}
      />

      {/* Match Details Modal */}
      <MatchDetailsModal
        isOpen={!!detailsMatch}
        match={detailsMatch}
        onClose={() => setDetailsMatch(null)}
        onOpenRestoreModal={(m) => setRestoreTargetMatch(m)}
        onOpenUserProfile={handleOpenUserProfile}
        onFlagMatch={(m) => setFlagTarget({ type: "match", item: m })}
      />

      {/* Like Details Modal */}
      <LikeDetailsModal
        isOpen={!!detailsLike}
        like={detailsLike}
        onClose={() => setDetailsLike(null)}
        onOpenMatchDetails={(mId) => {
          const found = matches.find((m) => m.id === mId);
          if (found) setDetailsMatch(found);
        }}
        onOpenUserProfile={handleOpenUserProfile}
      />

      {/* Restore Match Modal */}
      <RestoreMatchModal
        isOpen={!!restoreTargetMatch}
        match={restoreTargetMatch}
        onClose={() => setRestoreTargetMatch(null)}
        onConfirmRestore={handleRestoreMatch}
      />

      {/* Resolve Report Modal */}
      <ResolveReportModal
        isOpen={!!triageReport}
        report={triageReport}
        onClose={() => setTriageReport(null)}
        onConfirmResolve={handleResolveReport}
      />

      {/* Flag Interaction Modal */}
      <FlagInteractionModal
        isOpen={!!flagTarget}
        target={flagTarget}
        onClose={() => setFlagTarget(null)}
        onConfirmFlag={handleFlagInteraction}
      />
    </div>
  );
};
