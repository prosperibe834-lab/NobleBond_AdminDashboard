import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  X,
  Filter,
  RefreshCw,
  Download,
  Shield,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  Table as TableIcon,
} from "lucide-react";
import type {
  NobleUser,
  UserFilterState,
  UserSortCriteria,
  UserSortField,
  ColumnVisibilityState,
} from "../types/userManagement.types";
import {
  loadUsersFromStorage,
  loadAuditLogFromStorage,
  updateUserRecord,
  verifyUserRecord,
  suspendUserRecord,
  restoreUserRecord,
  banUserRecord,
  deleteUserRecord,
  grantGiftCoins,
  grantConnectionPoints,
  grantAdditionalLikes,
  addAdminInternalNote,
  filterAndSortUsers,
  calculateUserKPIs,
  exportUsersToCsv,
} from "../data/userManagementDataService";

// UI Components
import { UserStatsHeader } from "../components/users/UserStatsHeader";
import { UserChartsSection } from "../components/users/UserChartsSection";
import { UserFilterDrawer } from "../components/users/UserFilterDrawer";
import { UserTable } from "../components/users/UserTable";
import { UserMobileCards } from "../components/users/UserMobileCards";
import { UserPagination } from "../components/users/UserPagination";
import {
  UserStatsSkeleton,
  UserTableSkeleton,
} from "../components/users/UserSkeletonLoader";

// Modals
import { UserDetailsModal } from "../components/users/modals/UserDetailsModal";
import { UserEditModal } from "../components/users/modals/UserEditModal";
import { VerifyUserModal } from "../components/users/modals/VerifyUserModal";
import { SuspendUserModal } from "../components/users/modals/SuspendUserModal";
import { RestoreUserModal } from "../components/users/modals/RestoreUserModal";
import { BanUserModal } from "../components/users/modals/BanUserModal";
import { DeleteUserModal } from "../components/users/modals/DeleteUserModal";
import { GrantCoinsModal } from "../components/users/modals/GrantCoinsModal";
import { GrantPointsModal } from "../components/users/modals/GrantPointsModal";
import { GrantLikesModal } from "../components/users/modals/GrantLikesModal";
import { AddAdminNoteModal } from "../components/users/modals/AddAdminNoteModal";
import { ImageViewerModal } from "../components/users/modals/ImageViewerModal";
import { AuditLogDrawerModal } from "../components/users/modals/AuditLogDrawerModal";

const DEFAULT_FILTERS: UserFilterState = {
  accountStatus: "all",
  gender: "all",
  ageMin: 18,
  ageMax: 70,
  country: "all",
  verification: "all",
  premium: "all",
  walletCoins: "all",
  walletPoints: "all",
  activity: "all",
  referral: "all",
  platform: "all",
  vpn: "all",
};

const DEFAULT_COLUMNS: ColumnVisibilityState = {
  avatar: true,
  name: true,
  username: true,
  email: true,
  phone: false,
  gender: false,
  age: true,
  country: true,
  status: true,
  verification: true,
  premium: true,
  giftCoins: true,
  connectionPoints: true,
  matches: false,
  likesReceived: false,
  registrationDate: false,
  lastActive: true,
  actions: true,
};

export const UserManagementPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const paramUserId = searchParams.get("userId") || searchParams.get("id");
  const paramFilter = searchParams.get("filter") || searchParams.get("status");

  // Core Data initialized synchronously from storage
  const [users, setUsers] = useState<NobleUser[]>(() => loadUsersFromStorage());
  const [auditLog, setAuditLog] = useState(() => loadAuditLogFromStorage());
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<UserFilterState>(() => {
    if (paramFilter) {
      return { ...DEFAULT_FILTERS, accountStatus: paramFilter };
    }
    return DEFAULT_FILTERS;
  });
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Sorting
  const [sort, setSort] = useState<UserSortCriteria>({
    field: "lastActive",
    order: "desc",
  });

  // Table Columns & Pagination
  const [columns, setColumns] = useState<ColumnVisibilityState>(DEFAULT_COLUMNS);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState<"auto" | "table" | "cards">("auto");

  // Notifications
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Modal States
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<NobleUser | null>(() => {
    if (paramUserId) {
      const loaded = loadUsersFromStorage();
      return loaded.find((u) => u.id === paramUserId) || null;
    }
    return null;
  });
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<NobleUser | null>(null);
  const [selectedUserForVerify, setSelectedUserForVerify] = useState<NobleUser | null>(null);
  const [selectedUserForSuspend, setSelectedUserForSuspend] = useState<NobleUser | null>(null);
  const [selectedUserForRestore, setSelectedUserForRestore] = useState<NobleUser | null>(null);
  const [selectedUserForBan, setSelectedUserForBan] = useState<NobleUser | null>(null);
  const [selectedUserForDelete, setSelectedUserForDelete] = useState<NobleUser | null>(null);
  const [selectedUserForCoins, setSelectedUserForCoins] = useState<NobleUser | null>(null);
  const [selectedUserForPoints, setSelectedUserForPoints] = useState<NobleUser | null>(null);
  const [selectedUserForLikes, setSelectedUserForLikes] = useState<NobleUser | null>(null);
  const [selectedUserForNote, setSelectedUserForNote] = useState<NobleUser | null>(null);
  const [imageViewerData, setImageViewerData] = useState<{ url: string; title: string } | null>(null);
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setIsLoading(true);
    setTimeout(() => {
      const loaded = loadUsersFromStorage();
      setUsers(loaded);
      setAuditLog(loadAuditLogFromStorage());
      setIsRefreshing(false);
      setIsLoading(false);
      showToast("User records and analytics updated successfully");
    }, 450);
  };

  // Export CSV
  const handleExportCsv = () => {
    try {
      const csvContent = exportUsersToCsv(filteredUsers);
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `noblebond_users_export_${new Date().toISOString().substring(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Exported user records to CSV");
    } catch {
      showToast("Could not export CSV file", "error");
    }
  };

  // KPI Card Quick Filtering
  const handleKpiFilterClick = (filterKey: string, filterValue: string) => {
    setFilters((prev) => ({ ...prev, [filterKey]: filterValue }));
    setCurrentPage(1);
  };

  // Sorting
  const handleSortChange = (field: UserSortField) => {
    setSort((prev) => {
      if (prev.field === field) {
        return { field, order: prev.order === "asc" ? "desc" : "asc" };
      }
      return { field, order: "desc" };
    });
  };

  // Column Visibility Toggle
  const handleColumnToggle = (colKey: keyof ColumnVisibilityState) => {
    setColumns((prev) => ({ ...prev, [colKey]: !prev[colKey] }));
  };

  // Filter Management
  let activeFilterCount = 0;
  if (filters.accountStatus !== "all") activeFilterCount++;
  if (filters.gender !== "all") activeFilterCount++;
  if (filters.ageMin !== 18 || filters.ageMax !== 70) activeFilterCount++;
  if (filters.country !== "all") activeFilterCount++;
  if (filters.verification !== "all") activeFilterCount++;
  if (filters.premium !== "all") activeFilterCount++;
  if (filters.walletCoins !== "all") activeFilterCount++;
  if (filters.walletPoints !== "all") activeFilterCount++;
  if (filters.activity !== "all") activeFilterCount++;
  if (filters.referral !== "all") activeFilterCount++;
  if (filters.platform !== "all") activeFilterCount++;
  if (filters.vpn !== "all") activeFilterCount++;

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery("");
    setCurrentPage(1);
    showToast("Filters reset to default view");
  };

  // Filtered & Sorted Users
  const filteredUsers = filterAndSortUsers(users, searchQuery, filters, sort);

  // Paginated Slice
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  // KPIs
  const kpis = calculateUserKPIs(users);

  // Handlers for Mutations
  const handleSaveUserEdit = (
    userId: string,
    partial: Partial<NobleUser>,
    reason?: string
  ) => {
    const updated = updateUserRecord(userId, partial, reason);
    if (updated) {
      setUsers(loadUsersFromStorage());
      setAuditLog(loadAuditLogFromStorage());
      if (selectedUserForDetails?.id === userId) {
        setSelectedUserForDetails(updated);
      }
      showToast(`Updated account information for ${updated.name}`);
    }
  };

  const handleConfirmVerify = (
    userId: string,
    type: "email" | "phone" | "photo" | "identity" | "all",
    notes?: string
  ) => {
    const updated = verifyUserRecord(userId, type, notes);
    if (updated) {
      setUsers(loadUsersFromStorage());
      setAuditLog(loadAuditLogFromStorage());
      if (selectedUserForDetails?.id === userId) {
        setSelectedUserForDetails(updated);
      }
      showToast(`Verification status confirmed for ${updated.name}`);
    }
  };

  const handleConfirmSuspend = (
    userId: string,
    reason: string,
    duration: "24h" | "7d" | "30d" | "permanent",
    adminNote?: string
  ) => {
    const updated = suspendUserRecord(userId, reason, duration, adminNote);
    if (updated) {
      setUsers(loadUsersFromStorage());
      setAuditLog(loadAuditLogFromStorage());
      if (selectedUserForDetails?.id === userId) {
        setSelectedUserForDetails(updated);
      }
      showToast(`Account suspended for ${updated.name} (${duration})`);
    }
  };

  const handleConfirmRestore = (userId: string, reason?: string) => {
    const updated = restoreUserRecord(userId, reason);
    if (updated) {
      setUsers(loadUsersFromStorage());
      setAuditLog(loadAuditLogFromStorage());
      if (selectedUserForDetails?.id === userId) {
        setSelectedUserForDetails(updated);
      }
      showToast(`Account restrictions lifted for ${updated.name}`);
    }
  };

  const handleConfirmBan = (userId: string, reason: string) => {
    const updated = banUserRecord(userId, reason);
    if (updated) {
      setUsers(loadUsersFromStorage());
      setAuditLog(loadAuditLogFromStorage());
      if (selectedUserForDetails?.id === userId) {
        setSelectedUserForDetails(updated);
      }
      showToast(`User permanently banned: ${updated.name}`);
    }
  };

  const handleConfirmDelete = (userId: string, typed: string) => {
    const success = deleteUserRecord(userId, typed);
    if (success) {
      setUsers(loadUsersFromStorage());
      setAuditLog(loadAuditLogFromStorage());
      if (selectedUserForDetails?.id === userId) {
        setSelectedUserForDetails(null);
      }
      showToast("User account permanently deleted from demonstration state");
    } else {
      showToast("Deletion cancelled: Confirmation mismatch", "error");
    }
  };

  const handleConfirmGrantCoins = (
    userId: string,
    amount: number,
    reason: string,
    ref?: string
  ) => {
    const updated = grantGiftCoins(userId, amount, reason, ref);
    if (updated) {
      setUsers(loadUsersFromStorage());
      setAuditLog(loadAuditLogFromStorage());
      if (selectedUserForDetails?.id === userId) {
        setSelectedUserForDetails(updated);
      }
      showToast(
        `Gift Coins balance adjusted by ${amount >= 0 ? "+" : ""}${amount} for ${updated.name}`
      );
    }
  };

  const handleConfirmGrantPoints = (
    userId: string,
    amount: number,
    reason: string,
    ref?: string
  ) => {
    const updated = grantConnectionPoints(userId, amount, reason, ref);
    if (updated) {
      setUsers(loadUsersFromStorage());
      setAuditLog(loadAuditLogFromStorage());
      if (selectedUserForDetails?.id === userId) {
        setSelectedUserForDetails(updated);
      }
      showToast(
        `Connection Points adjusted by ${amount >= 0 ? "+" : ""}${amount} for ${updated.name}`
      );
    }
  };

  const handleConfirmGrantLikes = (
    userId: string,
    count: number,
    reason: string,
    adminNote?: string
  ) => {
    const updated = grantAdditionalLikes(userId, count, reason, adminNote);
    if (updated) {
      setUsers(loadUsersFromStorage());
      setAuditLog(loadAuditLogFromStorage());
      if (selectedUserForDetails?.id === userId) {
        setSelectedUserForDetails(updated);
      }
      showToast(`Granted +${count} additional likes to ${updated.name}`);
    }
  };

  const handleConfirmAddNote = (userId: string, title: string, content: string) => {
    const updated = addAdminInternalNote(userId, title, content);
    if (updated) {
      setUsers(loadUsersFromStorage());
      setAuditLog(loadAuditLogFromStorage());
      if (selectedUserForDetails?.id === userId) {
        setSelectedUserForDetails(updated);
      }
      showToast(`Internal admin note saved for ${updated.name}`);
    }
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        paddingBottom: "32px",
      }}
    >
      {/* Toast Feedback */}
      {toastMessage && (
        <div
          className="animate-scale-up"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 2000,
            padding: "12px 18px",
            borderRadius: "12px",
            backgroundColor:
              toastMessage.type === "success"
                ? "var(--status-success-bg, #E8F8F2)"
                : "var(--status-danger-bg, #FDE8EC)",
            border: `1px solid ${
              toastMessage.type === "success"
                ? "var(--status-success)"
                : "var(--status-danger)"
            }`,
            color:
              toastMessage.type === "success"
                ? "var(--status-success)"
                : "var(--status-danger)",
            fontSize: "13px",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "var(--shadow-elevated)",
          }}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          <span>{toastMessage.text}</span>
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
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "var(--text-main)",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            User Management
          </h2>
          <p
            style={{
              fontSize: "13.5px",
              color: "var(--text-secondary)",
              marginTop: "4px",
              marginBottom: 0,
            }}
          >
            Manage NobleBond members, accounts, activity and user information.
          </p>
        </div>

        {/* Global Toolbar Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-main)",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: isRefreshing ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
            }}
            title="Reload dataset and recalculate KPIs"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-main)",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
            }}
            title="Download CSV of filtered users"
          >
            <Download size={14} />
            <span>Export</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAuditDrawerOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--accent-lavender)",
              fontSize: "12.5px",
              fontWeight: 700,
              cursor: "pointer",
            }}
            title="View Administrative Audit Trail"
          >
            <Shield size={14} />
            <span>Audit Log ({auditLog.length})</span>
          </button>
        </div>
      </div>

      {/* 1. Statistics Cards Header */}
      {isLoading ? (
        <UserStatsSkeleton />
      ) : (
        <UserStatsHeader
          kpis={kpis}
          activeFilter={filters.accountStatus}
          onFilterClick={handleKpiFilterClick}
        />
      )}

      {/* 2. Demographics & Analytics Charts */}
      {!isLoading && <UserChartsSection users={users} />}

      {/* 3. Search & Filter Bar */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          flexWrap: "wrap",
          padding: "16px",
          backgroundColor: "var(--bg-card)",
          borderRadius: "14px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* Search Input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 14px",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--bg-surface)",
            flex: "1 1 280px",
          }}
        >
          <Search size={16} color="var(--primary)" />
          <input
            type="text"
            placeholder="Search by full name, username, email, phone, ID, or referral code..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              color: "var(--text-main)",
              fontSize: "13px",
              width: "100%",
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              style={{
                border: "none",
                background: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "2px",
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Drawer Toggle */}
        <button
          type="button"
          onClick={() => setIsFilterDrawerOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "9px 14px",
            borderRadius: "10px",
            border: `1px solid ${
              activeFilterCount > 0 ? "var(--primary)" : "var(--border)"
            }`,
            backgroundColor:
              activeFilterCount > 0
                ? "rgba(193, 47, 102, 0.08)"
                : "var(--bg-surface)",
            color:
              activeFilterCount > 0 ? "var(--primary)" : "var(--text-main)",
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
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "var(--primary)",
                color: "#FFFFFF",
                fontSize: "11px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Clear Filters If Active */}
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={handleResetFilters}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "9px 12px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "transparent",
              color: "var(--text-secondary)",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <RotateCcw size={13} />
            <span>Reset All</span>
          </button>
        )}

        {/* Layout View Mode (Desktop vs Cards) */}
        <div
          style={{
            display: "flex",
            backgroundColor: "var(--bg-surface)",
            borderRadius: "8px",
            padding: "2px",
            border: "1px solid var(--border)",
            marginLeft: "auto",
          }}
        >
          <button
            type="button"
            onClick={() => setViewMode("table")}
            style={{
              padding: "6px 10px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: viewMode === "table" ? "var(--primary)" : "transparent",
              color: viewMode === "table" ? "#FFFFFF" : "var(--text-secondary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
              fontWeight: 600,
            }}
            title="Force Table View"
          >
            <TableIcon size={14} />
            <span>Table</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            style={{
              padding: "6px 10px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: viewMode === "cards" ? "var(--primary)" : "transparent",
              color: viewMode === "cards" ? "#FFFFFF" : "var(--text-secondary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
              fontWeight: 600,
            }}
            title="Force Card View"
          >
            <LayoutGrid size={14} />
            <span>Cards</span>
          </button>
        </div>
      </div>

      {/* 4. Users Table / Cards Representation */}
      {isLoading ? (
        <UserTableSkeleton />
      ) : (
        <>
          {viewMode === "cards" ? (
            <UserMobileCards
              users={paginatedUsers}
              onViewDetails={setSelectedUserForDetails}
              onEditUser={setSelectedUserForEdit}
              onVerifyUser={setSelectedUserForVerify}
              onSuspendUser={setSelectedUserForSuspend}
              onGrantCoins={setSelectedUserForCoins}
              onGrantPoints={setSelectedUserForPoints}
            />
          ) : (
            <UserTable
              users={paginatedUsers}
              columns={columns}
              onColumnToggle={handleColumnToggle}
              sort={sort}
              onSortChange={handleSortChange}
              onViewDetails={setSelectedUserForDetails}
              onEditUser={setSelectedUserForEdit}
              onVerifyUser={setSelectedUserForVerify}
              onSuspendUser={setSelectedUserForSuspend}
              onRestoreUser={setSelectedUserForRestore}
              onBanUser={setSelectedUserForBan}
              onDeleteUser={setSelectedUserForDelete}
              onGrantCoins={setSelectedUserForCoins}
              onGrantPoints={setSelectedUserForPoints}
              onGrantLikes={setSelectedUserForLikes}
            />
          )}

          {/* 5. Pagination Controls */}
          <UserPagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={filteredUsers.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
          />
        </>
      )}

      {/* 6. Filter Drawer */}
      <UserFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={(f) => {
          setFilters(f);
          setCurrentPage(1);
        }}
        onReset={handleResetFilters}
        activeFilterCount={activeFilterCount}
        totalFilteredCount={filteredUsers.length}
      />

      {/* 7. All Modals */}
      <UserDetailsModal
        isOpen={!!selectedUserForDetails}
        onClose={() => setSelectedUserForDetails(null)}
        user={selectedUserForDetails}
        onOpenEdit={(u) => setSelectedUserForEdit(u)}
        onOpenVerify={(u) => setSelectedUserForVerify(u)}
        onOpenSuspend={(u) => setSelectedUserForSuspend(u)}
        onOpenRestore={(u) => setSelectedUserForRestore(u)}
        onOpenBan={(u) => setSelectedUserForBan(u)}
        onOpenDelete={(u) => setSelectedUserForDelete(u)}
        onOpenGrantCoins={(u) => setSelectedUserForCoins(u)}
        onOpenGrantPoints={(u) => setSelectedUserForPoints(u)}
        onOpenGrantLikes={(u) => setSelectedUserForLikes(u)}
        onOpenAddNote={(u) => setSelectedUserForNote(u)}
        onOpenImageViewer={(url, title) => setImageViewerData({ url, title })}
      />

      <UserEditModal
        isOpen={!!selectedUserForEdit}
        onClose={() => setSelectedUserForEdit(null)}
        user={selectedUserForEdit}
        onSave={handleSaveUserEdit}
        existingUsers={users}
      />

      <VerifyUserModal
        isOpen={!!selectedUserForVerify}
        onClose={() => setSelectedUserForVerify(null)}
        user={selectedUserForVerify}
        onConfirm={handleConfirmVerify}
      />

      <SuspendUserModal
        isOpen={!!selectedUserForSuspend}
        onClose={() => setSelectedUserForSuspend(null)}
        user={selectedUserForSuspend}
        onConfirm={handleConfirmSuspend}
      />

      <RestoreUserModal
        isOpen={!!selectedUserForRestore}
        onClose={() => setSelectedUserForRestore(null)}
        user={selectedUserForRestore}
        onConfirm={handleConfirmRestore}
      />

      <BanUserModal
        isOpen={!!selectedUserForBan}
        onClose={() => setSelectedUserForBan(null)}
        user={selectedUserForBan}
        onConfirm={handleConfirmBan}
      />

      <DeleteUserModal
        isOpen={!!selectedUserForDelete}
        onClose={() => setSelectedUserForDelete(null)}
        user={selectedUserForDelete}
        onConfirm={handleConfirmDelete}
      />

      <GrantCoinsModal
        isOpen={!!selectedUserForCoins}
        onClose={() => setSelectedUserForCoins(null)}
        user={selectedUserForCoins}
        onConfirm={handleConfirmGrantCoins}
      />

      <GrantPointsModal
        isOpen={!!selectedUserForPoints}
        onClose={() => setSelectedUserForPoints(null)}
        user={selectedUserForPoints}
        onConfirm={handleConfirmGrantPoints}
      />

      <GrantLikesModal
        isOpen={!!selectedUserForLikes}
        onClose={() => setSelectedUserForLikes(null)}
        user={selectedUserForLikes}
        onConfirm={handleConfirmGrantLikes}
      />

      <AddAdminNoteModal
        isOpen={!!selectedUserForNote}
        onClose={() => setSelectedUserForNote(null)}
        user={selectedUserForNote}
        onAddNote={handleConfirmAddNote}
      />

      <ImageViewerModal
        isOpen={!!imageViewerData}
        onClose={() => setImageViewerData(null)}
        imageUrl={imageViewerData?.url || ""}
        userName={imageViewerData?.title || ""}
      />

      <AuditLogDrawerModal
        isOpen={isAuditDrawerOpen}
        onClose={() => setIsAuditDrawerOpen(false)}
        entries={auditLog}
      />
    </div>
  );
};
