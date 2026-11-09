// NobleBond Admin — Profile Management Main Page
// Comprehensive profile administration, content review, verification & moderation centre
// Full implementation, zero emojis, React 19 & TypeScript strict compliance

import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  RotateCw,
  Download,
  Filter,
  Search,
  SlidersHorizontal,
  X,
  Layers,
  CheckCircle2,
  Table as TableIcon,
  LayoutGrid,
} from "lucide-react";

import type {
  AdminProfile,
  ColumnVisibilityState,
  MediaItem,
  MediaRejectionCategory,
  ProfileFilterState,
  ProfileReport,
  ProfileSortCriteria,
  ProfileSortField,
  ProfileVisibility,
} from "../types/profileManagement.types";

import {
  loadProfiles,
  calculateProfileKPIs,
  filterAndSortProfiles,
  exportProfilesCsv,
  resetProfilesToDefault,
  updateBioModeration,
  updatePromptModeration,
  approveMedia,
  rejectMedia,
  requestMediaReplacement,
  flagMedia,
  updateProfileVisibility,
  updateProfileModerationStatus,
  reviewVerification,
  resolveReport,
  bulkApproveProfiles,
  bulkUpdateVisibility,
} from "../data/profileManagementDataService";

import { ProfileStatsHeader } from "../components/profiles/ProfileStatsHeader";
import { ProfileAnalyticsSection } from "../components/profiles/ProfileAnalyticsSection";
import { AutomatedReviewSection } from "../components/profiles/AutomatedReviewSection";
import { ProfileFilterDrawer } from "../components/profiles/ProfileFilterDrawer";
import { ProfileTable } from "../components/profiles/ProfileTable";
import { ProfileMobileCards } from "../components/profiles/ProfileMobileCards";
import { ProfilePagination } from "../components/profiles/ProfilePagination";
import { ProfileSkeletonLoader } from "../components/profiles/ProfileSkeletonLoader";

import { ProfileDetailsModal } from "../components/profiles/modals/ProfileDetailsModal";
import { PublicProfilePreviewModal } from "../components/profiles/modals/PublicProfilePreviewModal";
import { MediaModerationModal } from "../components/profiles/modals/MediaModerationModal";
import { VisibilityActionModal } from "../components/profiles/modals/VisibilityActionModal";
import { VerificationReviewModal } from "../components/profiles/modals/VerificationReviewModal";
import { ReportResolutionModal } from "../components/profiles/modals/ReportResolutionModal";
import { BulkActionModal } from "../components/profiles/modals/BulkActionModal";

const DEFAULT_FILTERS: ProfileFilterState = {
  searchQuery: "",
  profileStatus: "all",
  verificationStatus: "all",
  mediaFilter: "all",
  gender: "all",
  ageMin: null,
  ageMax: null,
  country: "all",
  city: "all",
  completionBucket: "all",
  visibility: "all",
  automatedOutcome: "all",
  hasReports: "all",
};

const DEFAULT_COLUMNS: ColumnVisibilityState = {
  picture: true,
  fullName: true,
  username: true,
  age: true,
  gender: true,
  country: true,
  city: false,
  completion: true,
  photos: true,
  videos: true,
  verification: true,
  moderationStatus: true,
  visibility: true,
  reportsCount: true,
  createdAt: false,
  updatedAt: true,
  actions: true,
};

export const ProfileManagementPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  // Primary State
  const [profiles, setProfiles] = useState<AdminProfile[]>(() => loadProfiles());
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Layout & View Mode
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  const [columns, setColumns] = useState<ColumnVisibilityState>(DEFAULT_COLUMNS);

  // Filters & Sorting
  const [filterState, setFilterState] = useState<ProfileFilterState>(() => {
    const filterParam = searchParams.get("filter");
    if (filterParam === "pending_reviews") {
      return { ...DEFAULT_FILTERS, profileStatus: "under_review" };
    }
    if (filterParam === "verified") {
      return { ...DEFAULT_FILTERS, verificationStatus: "verified" };
    }
    return DEFAULT_FILTERS;
  });

  const [sortCriteria, setSortCriteria] = useState<ProfileSortCriteria>({
    field: "updatedAt",
    order: "desc",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Multi-Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal States
  const [detailsProfile, setDetailsProfile] = useState<AdminProfile | null>(() => {
    const profileIdParam = searchParams.get("profileId");
    if (profileIdParam) {
      const all = loadProfiles();
      return all.find((p) => p.id === profileIdParam || p.userId === profileIdParam) || null;
    }
    return null;
  });
  const [detailsInitialTab, setDetailsInitialTab] = useState<string>("overview");

  const [previewProfile, setPreviewProfile] = useState<AdminProfile | null>(null);
  const [visibilityProfile, setVisibilityProfile] = useState<AdminProfile | null>(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Nested modals from details/media actions
  const [mediaReviewState, setMediaReviewState] = useState<{
    profile: AdminProfile;
    mediaItem: MediaItem;
  } | null>(null);

  const [verificationReviewState, setVerificationReviewState] = useState<{
    profile: AdminProfile;
    type: "photo" | "identity";
  } | null>(null);

  const [reportResolutionState, setReportResolutionState] = useState<{
    profile: AdminProfile;
    report: ProfileReport;
  } | null>(null);

  // Notifications helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // KPIs
  const kpis = useMemo(() => calculateProfileKPIs(profiles), [profiles]);

  // Filtered & Sorted Records
  const filteredProfiles = useMemo(
    () => filterAndSortProfiles(profiles, filterState, sortCriteria),
    [profiles, filterState, sortCriteria]
  );

  // Paginated Slices
  const paginatedProfiles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProfiles.slice(start, start + pageSize);
  }, [filteredProfiles, currentPage, pageSize]);

  // Active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterState.profileStatus !== "all") count++;
    if (filterState.verificationStatus !== "all") count++;
    if (filterState.mediaFilter !== "all") count++;
    if (filterState.gender !== "all") count++;
    if (filterState.ageMin !== null || filterState.ageMax !== null) count++;
    if (filterState.country !== "all") count++;
    if (filterState.city !== "all") count++;
    if (filterState.completionBucket !== "all") count++;
    if (filterState.visibility !== "all") count++;
    if (filterState.hasReports !== "all") count++;
    return count;
  }, [filterState]);

  // Handlers
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setProfiles(loadProfiles());
      setIsLoading(false);
      showToast("Profile records refreshed successfully.");
    }, 450);
  };

  const handleResetData = () => {
    const defaults = resetProfilesToDefault();
    setProfiles(defaults);
    setSelectedIds([]);
    showToast("Reset all profiles to initial default demonstration data.");
  };

  const handleExportCsv = () => {
    const csvContent = exportProfilesCsv(filteredProfiles);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `noblebond_profiles_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredProfiles.length} profiles to CSV.`);
  };

  const handleKpiFilterSelect = (key: string) => {
    setCurrentPage(1);
    if (key === "all") {
      setFilterState(DEFAULT_FILTERS);
    } else if (key === "complete") {
      setFilterState({ ...DEFAULT_FILTERS, completionBucket: "100" });
    } else if (key === "incomplete") {
      setFilterState({ ...DEFAULT_FILTERS, completionBucket: "0_25" });
    } else if (key === "pending_reviews") {
      setFilterState({ ...DEFAULT_FILTERS, profileStatus: "under_review" });
    } else if (key === "pending_photos") {
      setFilterState({ ...DEFAULT_FILTERS, mediaFilter: "photos_pending" });
    } else if (key === "verified") {
      setFilterState({ ...DEFAULT_FILTERS, verificationStatus: "verified" });
    } else if (key === "reported") {
      setFilterState({ ...DEFAULT_FILTERS, hasReports: "yes" });
    } else if (key === "hidden") {
      setFilterState({ ...DEFAULT_FILTERS, visibility: "hidden" });
    } else if (key === "rejected_content") {
      setFilterState({ ...DEFAULT_FILTERS, profileStatus: "rejected" });
    } else if (key === "updated_recently") {
      setSortCriteria({ field: "updatedAt", order: "desc" });
    }
  };

  const handleSortChange = (field: ProfileSortField) => {
    setSortCriteria((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredProfiles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProfiles.map((p) => p.id));
    }
  };

  // Actions & Mutations
  const handleBioUpdate = (
    profileId: string,
    status: "approved" | "pending" | "flagged" | "rejected",
    reason?: string
  ) => {
    const updated = updateBioModeration(profileId, status, reason);
    setProfiles((prev) => prev.map((p) => (p.id === profileId ? updated : p)));
    if (detailsProfile?.id === profileId) setDetailsProfile(updated);
    showToast(`Biography updated to ${status}.`);
  };

  const handlePromptUpdate = (
    profileId: string,
    promptId: string,
    status: "approved" | "pending" | "flagged" | "rejected",
    reason?: string
  ) => {
    const updated = updatePromptModeration(profileId, promptId, status, reason);
    setProfiles((prev) => prev.map((p) => (p.id === profileId ? updated : p)));
    if (detailsProfile?.id === profileId) setDetailsProfile(updated);
    showToast(`Prompt marked as ${status}.`);
  };

  const handleMediaApprove = (profileId: string, mediaId: string) => {
    const updated = approveMedia(profileId, mediaId);
    setProfiles((prev) => prev.map((p) => (p.id === profileId ? updated : p)));
    if (detailsProfile?.id === profileId) setDetailsProfile(updated);
    showToast("Media approved and published.");
  };

  const handleMediaReject = (
    profileId: string,
    mediaId: string,
    category: MediaRejectionCategory,
    reason: string
  ) => {
    const updated = rejectMedia(profileId, mediaId, category, reason);
    setProfiles((prev) => prev.map((p) => (p.id === profileId ? updated : p)));
    if (detailsProfile?.id === profileId) setDetailsProfile(updated);
    showToast(`Media rejected under category: ${category}. User notified.`);
  };

  const handleMediaReplacement = (profileId: string, mediaId: string, reason: string) => {
    const updated = requestMediaReplacement(profileId, mediaId, reason);
    setProfiles((prev) => prev.map((p) => (p.id === profileId ? updated : p)));
    if (detailsProfile?.id === profileId) setDetailsProfile(updated);
    showToast("Replacement requested from user.");
  };

  const handleMediaFlag = (profileId: string, mediaId: string, reason: string) => {
    const updated = flagMedia(profileId, mediaId, reason);
    setProfiles((prev) => prev.map((p) => (p.id === profileId ? updated : p)));
    if (detailsProfile?.id === profileId) setDetailsProfile(updated);
    showToast("Media flagged for secondary review.");
  };

  const handleVisibilityUpdate = (profileId: string, visibility: ProfileVisibility, reason: string) => {
    const updated = updateProfileVisibility(profileId, visibility, reason);
    setProfiles((prev) => prev.map((p) => (p.id === profileId ? updated : p)));
    if (detailsProfile?.id === profileId) setDetailsProfile(updated);
    showToast(`Profile visibility set to ${visibility}.`);
  };

  const handleApproveProfile = (profileId: string) => {
    const updated = updateProfileModerationStatus(profileId, "approved", "Approved by administrator");
    setProfiles((prev) => prev.map((p) => (p.id === profileId ? updated : p)));
    if (detailsProfile?.id === profileId) setDetailsProfile(updated);
    showToast("Profile approved successfully.");
  };

  const handleVerificationDecision = (
    profileId: string,
    verifyType: "photo" | "identity",
    decision: "verified" | "rejected",
    notes: string
  ) => {
    const updated = reviewVerification(profileId, verifyType, decision, notes);
    setProfiles((prev) => prev.map((p) => (p.id === profileId ? updated : p)));
    if (detailsProfile?.id === profileId) setDetailsProfile(updated);
    showToast(`${verifyType === "photo" ? "Photo Biometrics" : "ID"} marked as ${decision}.`);
  };

  const handleReportDecision = (
    profileId: string,
    reportId: string,
    decision: "investigating" | "resolved" | "escalated" | "dismissed",
    notes: string
  ) => {
    const updated = resolveReport(profileId, reportId, decision, notes);
    setProfiles((prev) => prev.map((p) => (p.id === profileId ? updated : p)));
    if (detailsProfile?.id === profileId) setDetailsProfile(updated);
    showToast(`Report ${reportId} marked as ${decision}.`);
  };

  const handleBulkApprove = (ids: string[]) => {
    bulkApproveProfiles(ids);
    setProfiles(loadProfiles());
    setSelectedIds([]);
    showToast(`Approved ${ids.length} profiles successfully.`);
  };

  const handleBulkVisibility = (ids: string[], visibility: ProfileVisibility, reason: string) => {
    bulkUpdateVisibility(ids, visibility, reason);
    setProfiles(loadProfiles());
    setSelectedIds([]);
    showToast(`Updated visibility to ${visibility} for ${ids.length} profiles.`);
  };

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

      {/* Main Header */}
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
            Profile Management
          </h1>
          <p
            style={{
              fontSize: "13.5px",
              color: "var(--text-secondary)",
              marginTop: "2px",
            }}
          >
            Monitor profile quality, authenticity, visibility, and review public dating content across NobleBond.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={() => setIsBulkModalOpen(true)}
              style={{
                padding: "8px 14px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "var(--primary)",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 2px 8px rgba(139, 29, 65, 0.25)",
              }}
            >
              <Layers size={15} />
              Bulk Actions ({selectedIds.length})
            </button>
          )}

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
        <ProfileSkeletonLoader />
      ) : (
        <>
          {/* 10 KPI Cards */}
          <ProfileStatsHeader
            kpis={kpis}
            onSelectKpiFilter={handleKpiFilterSelect}
          />

          {/* Analytics & Content Intelligence Section */}
          <ProfileAnalyticsSection
            profiles={profiles}
            onSelectFilter={(cat, val) => {
              if (cat === "completionBucket") {
                setFilterState((prev) => ({ ...prev, completionBucket: val }));
              } else if (cat === "verificationStatus") {
                setFilterState((prev) => ({ ...prev, verificationStatus: val }));
              }
            }}
          />

          {/* Automated Screening Queue Banner */}
          <AutomatedReviewSection
            profiles={profiles}
            onOpenQueue={() => {
              setFilterState({ ...DEFAULT_FILTERS, profileStatus: "under_review" });
              setCurrentPage(1);
            }}
          />

          {/* Search, Filter & Action Toolbar */}
          <div
            style={{
              padding: "16px 20px",
              backgroundColor: "var(--bg-card)",
              borderRadius: "16px",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              {/* Search Bar across 8 fields */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  backgroundColor: "var(--bg-main)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  padding: "8px 14px",
                  flex: "1 1 320px",
                  maxWidth: "460px",
                }}
              >
                <Search size={16} color="var(--text-secondary)" />
                <input
                  type="text"
                  placeholder="Search by name, username, ID, email, phone, city or country..."
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
                    fontSize: "13px",
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

              {/* Toolbar Controls */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                {/* Advanced Filter Drawer Trigger */}
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(true)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "10px",
                    border: activeFiltersCount > 0 ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                    backgroundColor: activeFiltersCount > 0 ? "rgba(139, 29, 65, 0.08)" : "var(--bg-main)",
                    color: activeFiltersCount > 0 ? "var(--primary)" : "var(--text-main)",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Filter size={15} />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span
                      style={{
                        padding: "1px 6px",
                        borderRadius: "10px",
                        backgroundColor: "var(--primary)",
                        color: "#FFFFFF",
                        fontSize: "11px",
                      }}
                    >
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Column Visibility Selector */}
                <div style={{ position: "relative" }}>
                  <button
                    type="button"
                    onClick={() => setIsColumnDropdownOpen(!isColumnDropdownOpen)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "10px",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--bg-main)",
                      color: "var(--text-main)",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <SlidersHorizontal size={15} />
                    Columns
                  </button>

                  {isColumnDropdownOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        right: 0,
                        marginTop: "6px",
                        zIndex: 40,
                        backgroundColor: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                        padding: "10px",
                        boxShadow: "var(--shadow-lg)",
                        width: "210px",
                        maxHeight: "300px",
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      {Object.keys(columns).map((key) => {
                        const colKey = key as keyof ColumnVisibilityState;
                        return (
                          <label
                            key={colKey}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              fontSize: "12.5px",
                              color: "var(--text-main)",
                              cursor: "pointer",
                              textTransform: "capitalize",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={columns[colKey]}
                              onChange={(e) =>
                                setColumns((prev) => ({ ...prev, [colKey]: e.target.checked }))
                              }
                              style={{ accentColor: "var(--primary)" }}
                            />
                            {colKey.replace(/([A-Z])/g, " $1")}
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* View Mode Toggle */}
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "var(--bg-main)",
                    borderRadius: "10px",
                    border: "1px solid var(--border)",
                    padding: "2px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setViewMode("table")}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: viewMode === "table" ? "var(--bg-card)" : "transparent",
                      color: viewMode === "table" ? "var(--primary)" : "var(--text-secondary)",
                      cursor: "pointer",
                      boxShadow: viewMode === "table" ? "var(--shadow-sm)" : "none",
                    }}
                    title="Desktop Table View"
                  >
                    <TableIcon size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("cards")}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: viewMode === "cards" ? "var(--bg-card)" : "transparent",
                      color: viewMode === "cards" ? "var(--primary)" : "var(--text-secondary)",
                      cursor: "pointer",
                      boxShadow: viewMode === "cards" ? "var(--shadow-sm)" : "none",
                    }}
                    title="Mobile / Card View"
                  >
                    <LayoutGrid size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeFiltersCount > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", paddingTop: "4px" }}>
                <span style={{ fontSize: "11.5px", color: "var(--text-secondary)", fontWeight: 600 }}>Active Filters:</span>
                {filterState.profileStatus !== "all" && (
                  <span style={{ padding: "3px 8px", borderRadius: "12px", backgroundColor: "var(--bg-main)", border: "1px solid var(--border)", fontSize: "11px", color: "var(--text-main)" }}>
                    Status: {filterState.profileStatus}
                  </span>
                )}
                {filterState.verificationStatus !== "all" && (
                  <span style={{ padding: "3px 8px", borderRadius: "12px", backgroundColor: "var(--bg-main)", border: "1px solid var(--border)", fontSize: "11px", color: "var(--text-main)" }}>
                    Verification: {filterState.verificationStatus}
                  </span>
                )}
                {filterState.mediaFilter !== "all" && (
                  <span style={{ padding: "3px 8px", borderRadius: "12px", backgroundColor: "var(--bg-main)", border: "1px solid var(--border)", fontSize: "11px", color: "var(--text-main)" }}>
                    Media: {filterState.mediaFilter}
                  </span>
                )}
                {filterState.visibility !== "all" && (
                  <span style={{ padding: "3px 8px", borderRadius: "12px", backgroundColor: "var(--bg-main)", border: "1px solid var(--border)", fontSize: "11px", color: "var(--text-main)" }}>
                    Visibility: {filterState.visibility}
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setFilterState(DEFAULT_FILTERS)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--primary)",
                    fontSize: "11.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                    marginLeft: "4px",
                  }}
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Profile Listing: Desktop 17-column Table OR Responsive Cards */}
          {viewMode === "table" ? (
            <ProfileTable
              profiles={paginatedProfiles}
              columns={columns}
              sort={sortCriteria}
              onSortChange={handleSortChange}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onSelectAll={handleSelectAll}
              onOpenDetails={(p, initialTab) => {
                setDetailsProfile(p);
                setDetailsInitialTab(initialTab || "overview");
              }}
              onOpenPreview={(p) => setPreviewProfile(p)}
              onOpenVisibilityModal={(p) => setVisibilityProfile(p)}
            />
          ) : (
            <ProfileMobileCards
              profiles={paginatedProfiles}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onOpenDetails={(p, initialTab) => {
                setDetailsProfile(p);
                setDetailsInitialTab(initialTab || "overview");
              }}
              onOpenPreview={(p) => setPreviewProfile(p)}
              onOpenVisibilityModal={(p) => setVisibilityProfile(p)}
            />
          )}

          {/* Pagination */}
          <ProfilePagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={filteredProfiles.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
          />
        </>
      )}

      {/* Advanced Filter Drawer */}
      <ProfileFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filterState={filterState}
        onFilterChange={(newFilters) => {
          setFilterState(newFilters);
          setCurrentPage(1);
        }}
        onResetFilters={() => setFilterState(DEFAULT_FILTERS)}
        totalFiltered={filteredProfiles.length}
      />

      {/* 11-Tab Profile Details Modal */}
      <ProfileDetailsModal
        isOpen={!!detailsProfile}
        profile={detailsProfile}
        initialTab={detailsInitialTab}
        onClose={() => setDetailsProfile(null)}
        onUpdateBio={handleBioUpdate}
        onUpdatePrompt={handlePromptUpdate}
        onOpenMediaModal={(mediaItem) => {
          if (detailsProfile) {
            setMediaReviewState({ profile: detailsProfile, mediaItem });
          }
        }}
        onOpenVerificationModal={(verifyType) => {
          if (detailsProfile) {
            setVerificationReviewState({ profile: detailsProfile, type: verifyType });
          }
        }}
        onOpenReportModal={(report) => {
          if (detailsProfile) {
            setReportResolutionState({ profile: detailsProfile, report });
          }
        }}
        onOpenVisibilityModal={() => {
          if (detailsProfile) setVisibilityProfile(detailsProfile);
        }}
        onApproveProfile={handleApproveProfile}
        onPreview={(p) => setPreviewProfile(p)}
      />

      {/* Public Mobile Profile Simulator Preview */}
      <PublicProfilePreviewModal
        isOpen={!!previewProfile}
        profile={previewProfile}
        onClose={() => setPreviewProfile(null)}
      />

      {/* Media Moderation Policy Modal */}
      <MediaModerationModal
        isOpen={!!mediaReviewState}
        profile={mediaReviewState?.profile || null}
        mediaItem={mediaReviewState?.mediaItem || null}
        onClose={() => setMediaReviewState(null)}
        onApprove={handleMediaApprove}
        onReject={handleMediaReject}
        onRequestReplacement={handleMediaReplacement}
        onFlag={handleMediaFlag}
      />

      {/* Visibility Action Modal */}
      <VisibilityActionModal
        isOpen={!!visibilityProfile}
        profile={visibilityProfile}
        onClose={() => setVisibilityProfile(null)}
        onUpdateVisibility={handleVisibilityUpdate}
      />

      {/* Verification Review Modal */}
      <VerificationReviewModal
        isOpen={!!verificationReviewState}
        profile={verificationReviewState?.profile || null}
        verifyType={verificationReviewState?.type || "photo"}
        onClose={() => setVerificationReviewState(null)}
        onDecision={handleVerificationDecision}
      />

      {/* Report Resolution Modal */}
      <ReportResolutionModal
        isOpen={!!reportResolutionState}
        profile={reportResolutionState?.profile || null}
        report={reportResolutionState?.report || null}
        onClose={() => setReportResolutionState(null)}
        onResolve={handleReportDecision}
      />

      {/* Bulk Action Modal */}
      <BulkActionModal
        isOpen={isBulkModalOpen}
        selectedIds={selectedIds}
        onClose={() => setIsBulkModalOpen(false)}
        onBatchApprove={handleBulkApprove}
        onBatchVisibility={handleBulkVisibility}
      />
    </div>
  );
};
