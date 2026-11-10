import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Download,
  RotateCcw,
  RefreshCw,
  LayoutGrid,
  List,
  ArrowUpDown,
} from "lucide-react";
import type {
  AdminReferralRecord,
  FraudAlertCaseRecord,
  ReferralFilterState,
  ReferralSortField,
} from "../../types/referralManagement.types";
import { Badge } from "../common/Badge";
import { ReferralPagination } from "./ReferralPagination";
import { ReferralMobileCards } from "./ReferralMobileCards";
import { ReferralFilterDrawer } from "./ReferralFilterDrawer";
import {
  formatShortDate,
  formatReferralPoints,
  getPrimaryReferralStatusMeta,
  getQualificationStatusMeta,
  getRewardStatusMeta,
} from "./referralUiUtils";
import {
  exportReferralsCsv,
  filterAndSortReferrals,
} from "../../data/referralManagementDataService";

interface AllReferralsSectionProps {
  referrals: AdminReferralRecord[];
  fraudCases: FraudAlertCaseRecord[];
  filters: ReferralFilterState;
  onUpdateFilters: (next: ReferralFilterState) => void;
  onResetFilters: () => void;
  onRefresh: () => void;
  onInspectReferral: (ref: AdminReferralRecord) => void;
  onExportToast: (msg: string) => void;
}

export const AllReferralsSection: React.FC<AllReferralsSectionProps> = ({
  referrals,
  fraudCases,
  filters,
  onUpdateFilters,
  onResetFilters,
  onRefresh,
  onInspectReferral,
  onExportToast,
}) => {
  const navigate = useNavigate();
  const [sort, setSort] = useState<ReferralSortField>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [drawerOpen, setDrawerOpen] = useState(false);
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

  const filtered = filterAndSortReferrals(referrals, filters, sort, fraudCases);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleFilterUpdate = (next: ReferralFilterState) => {
    setCurrentPage(1);
    onUpdateFilters(next);
  };

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "18px",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>
            All Referrals Ledger ({filtered.length})
          </h3>
          <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "2px" }}>
            Complete referral attribution, OTP qualification status, and Connection Points issuance tracking
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
              onChange={(e) =>
                handleFilterUpdate({ ...filters, searchQuery: e.target.value })
              }
              placeholder="Search ID, code, name, username..."
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-main)",
                borderRadius: "9px",
                padding: "8px 10px 8px 32px",
                fontSize: "0.8rem",
                width: "225px",
              }}
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) =>
              handleFilterUpdate({
                ...filters,
                status: e.target.value as ReferralFilterState["status"],
              })
            }
            style={{
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-main)",
              borderRadius: "9px",
              padding: "8px 10px",
              fontSize: "0.8rem",
            }}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="successful">Successful</option>
            <option value="rejected">Rejected</option>
          </select>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <ArrowUpDown size={14} style={{ color: "var(--text-muted)" }} />
            <select
              aria-label="Sort Referrals"
              value={sort}
              onChange={(e) => setSort(e.target.value as ReferralSortField)}
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-main)",
                borderRadius: "9px",
                padding: "8px 10px",
                fontSize: "0.8rem",
              }}
            >
              <option value="newest">Sort: Newest Referrals</option>
              <option value="oldest">Sort: Oldest Referrals</option>
              <option value="highest_referrer_count">Sort: Highest Successful Count</option>
              <option value="highest_referrer_points">Sort: Highest Referrer Rewards</option>
              <option value="pending_first">Sort: Pending Referrals First</option>
              <option value="recent_reward">Sort: Most Recent Reward Issued</option>
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
              fontSize: "0.8rem",
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
              fontSize: "0.78rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
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
              exportReferralsCsv(filtered);
              onExportToast(`Exported ${filtered.length} filtered referral records (privacy-safe) to CSV.`);
            }}
            style={{
              background: "var(--primary)",
              border: "none",
              color: "#fff",
              borderRadius: "9px",
              padding: "8px 12px",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {paginated.length === 0 ? (
        <div style={{ padding: "42px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.88rem" }}>
          No referral records match your active search or filters.
        </div>
      ) : viewMode === "cards" ? (
        <ReferralMobileCards referrals={paginated} onInspectReferral={onInspectReferral} />
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)", textAlign: "left" }}>
                <th style={{ padding: "10px 8px" }}>Referral ID &amp; Code</th>
                <th style={{ padding: "10px 8px" }}>Referrer</th>
                <th style={{ padding: "10px 8px" }}>Referred User</th>
                <th style={{ padding: "10px 8px" }}>OTP Verification</th>
                <th style={{ padding: "10px 8px" }}>Qualification &amp; Status</th>
                <th style={{ padding: "10px 8px" }}>Reward (Referrer Only)</th>
                <th style={{ padding: "10px 8px" }}>Created</th>
                <th style={{ padding: "10px 8px", textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((r) => {
                const st = getPrimaryReferralStatusMeta(r.status);
                const ql = getQualificationStatusMeta(r.qualificationStatus);
                const rw = getRewardStatusMeta(r.rewardStatus);

                return (
                  <tr
                    key={r.id}
                    onClick={() => onInspectReferral(r)}
                    style={{ borderBottom: "1px solid var(--border-light)", cursor: "pointer" }}
                  >
                    <td style={{ padding: "10px 8px" }}>
                      <div style={{ fontWeight: 700, color: "var(--primary)" }}>{r.id}</div>
                      <code style={{ fontSize: "0.71rem", color: "var(--text-main)" }}>{r.referralCode}</code>
                      <div style={{ fontSize: "0.69rem", color: "var(--text-muted)" }}>{r.referralSource}</div>
                    </td>
                    <td style={{ padding: "10px 8px" }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/users?userId=${encodeURIComponent(r.referrer.userId)}`);
                        }}
                        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: "7px", textAlign: "left" }}
                      >
                        <img src={r.referrer.avatar} alt={r.referrer.name} style={{ width: "26px", height: "26px", borderRadius: "50%", objectFit: "cover" }} />
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{r.referrer.name}</div>
                          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{r.referrer.username}</div>
                        </div>
                      </button>
                    </td>
                    <td style={{ padding: "10px 8px" }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/users?userId=${encodeURIComponent(r.referredUser.userId)}`);
                        }}
                        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: "7px", textAlign: "left" }}
                      >
                        <img src={r.referredUser.avatar} alt={r.referredUser.name} style={{ width: "26px", height: "26px", borderRadius: "50%", objectFit: "cover" }} />
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{r.referredUser.name}</div>
                          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                            Reg: {formatShortDate(r.referredUser.registrationDate)}
                          </div>
                        </div>
                      </button>
                    </td>
                    <td style={{ padding: "10px 8px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                        <Badge variant={r.referredUser.emailVerified ? "success" : "neutral"} size="sm">
                          Email: {r.referredUser.emailVerified ? "Verified" : "Unverified"}
                        </Badge>
                        <Badge variant={r.referredUser.phoneVerified ? "success" : "neutral"} size="sm">
                          Phone: {r.referredUser.phoneVerified ? "Verified" : "Unverified"}
                        </Badge>
                      </div>
                    </td>
                    <td style={{ padding: "10px 8px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-start" }}>
                        <Badge variant={st.variant} size="sm">{st.label}</Badge>
                        <Badge variant={ql.variant} size="sm">{ql.label}</Badge>
                      </div>
                    </td>
                    <td style={{ padding: "10px 8px" }}>
                      <div style={{ fontWeight: 800, color: "var(--accent-lavender)" }}>
                        {formatReferralPoints(r.rewardAmount)}
                      </div>
                      <div style={{ marginTop: "3px" }}>
                        <Badge variant={rw.variant} size="sm">{rw.label}</Badge>
                      </div>
                    </td>
                    <td style={{ padding: "10px 8px", color: "var(--text-secondary)" }}>
                      {formatShortDate(r.createdAt)}
                    </td>
                    <td style={{ padding: "10px 8px", textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onInspectReferral(r);
                        }}
                        style={{
                          background: "var(--bg-surface-elevated)",
                          border: "1px solid var(--border)",
                          color: "var(--text-main)",
                          borderRadius: "8px",
                          padding: "5px 10px",
                          fontSize: "0.74rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ReferralPagination
        totalItems={filtered.length}
        currentPage={safePage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />

      <ReferralFilterDrawer
        isOpen={drawerOpen}
        filters={filters}
        referrals={referrals}
        onUpdateFilters={handleFilterUpdate}
        onResetFilters={() => {
          setCurrentPage(1);
          onResetFilters();
        }}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};

