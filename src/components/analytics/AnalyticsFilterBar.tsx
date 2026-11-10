import React, { useState } from "react";
import {
  Calendar,
  SlidersHorizontal,
  RefreshCw,
  Download,
  RotateCcw,
  X,
  Clock,
  GitCompare,
  Layers,
  Filter,
} from "lucide-react";
import type {
  AnalyticsComparisonPeriod,
  AnalyticsDateRange,
  AnalyticsGlobalFilterState,
  AnalyticsTimeGranularity,
} from "../../types/analyticsManagement.types";
import { formatDateRangeLabel } from "./analyticsUiUtils";

interface AnalyticsFilterBarProps {
  filters: AnalyticsGlobalFilterState;
  availableCountries: string[];
  activeWindowLabel: string;
  comparisonWindowLabel: string | null;
  lastRefreshedIso: string;
  isRefreshing: boolean;
  canExport: boolean;
  onChangeFilters: (next: AnalyticsGlobalFilterState) => void;
  onClearAllFilters: () => void;
  onResetDefault: () => void;
  onRefresh: () => void;
  onExportCurrentReport: () => void;
}

const controlStyle: React.CSSProperties = {
  background: "var(--bg-surface-elevated)",
  color: "var(--text-main)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  padding: "7px 10px",
  fontSize: 12.5,
  fontWeight: 500,
  outline: "none",
};

const actionBtnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "7px 12px",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "var(--bg-surface)",
  color: "var(--text-main)",
  fontSize: 12.5,
  fontWeight: 600,
  cursor: "pointer",
};

export const AnalyticsFilterBar: React.FC<AnalyticsFilterBarProps> = ({
  filters,
  availableCountries,
  activeWindowLabel,
  comparisonWindowLabel,
  lastRefreshedIso,
  isRefreshing,
  canExport,
  onChangeFilters,
  onClearAllFilters,
  onResetDefault,
  onRefresh,
  onExportCurrentReport,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeAdvancedCount = [
    filters.country !== "all",
    filters.platform !== "all",
    filters.userStatus !== "all",
    filters.subscriptionPlan !== "all",
    filters.referralSource !== "all",
    filters.liveCategory !== "all",
    filters.transactionCategory !== "all",
    filters.userSegment !== "all",
  ].filter(Boolean).length;

  const patch = (partial: Partial<AnalyticsGlobalFilterState>) => {
    onChangeFilters({ ...filters, ...partial });
  };

  const formattedTime = (() => {
    const d = new Date(lastRefreshedIso);
    if (Number.isNaN(d.getTime())) return "Just now";
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  })();

  return (
    <>
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 16,
          boxShadow: "var(--shadow-sm)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* Top Row: Date Range, Comparison, Granularity, Actions */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Calendar size={14} style={{ color: "var(--primary)" }} />
              <select
                aria-label="Date Range"
                value={filters.dateRange}
                onChange={(e) => patch({ dateRange: e.target.value as AnalyticsDateRange })}
                style={controlStyle}
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="6m">Last 6 Months</option>
                <option value="12m">Last 12 Months</option>
                <option value="this_month">This Month</option>
                <option value="prev_month">Previous Month</option>
                <option value="this_year">This Year (YTD)</option>
                <option value="all">All Time</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {filters.dateRange === "custom" && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="date"
                  aria-label="Custom start date"
                  value={filters.customStartDate || ""}
                  onChange={(e) => patch({ customStartDate: e.target.value })}
                  style={controlStyle}
                />
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>to</span>
                <input
                  type="date"
                  aria-label="Custom end date"
                  value={filters.customEndDate || ""}
                  onChange={(e) => patch({ customEndDate: e.target.value })}
                  style={controlStyle}
                />
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <GitCompare size={14} style={{ color: "var(--accent-lavender)" }} />
              <select
                aria-label="Comparison Period"
                value={filters.comparisonPeriod}
                disabled={filters.dateRange === "all"}
                onChange={(e) =>
                  patch({ comparisonPeriod: e.target.value as AnalyticsComparisonPeriod })
                }
                style={{
                  ...controlStyle,
                  opacity: filters.dateRange === "all" ? 0.6 : 1,
                }}
              >
                <option value="prev_period">vs Previous Period</option>
                <option value="prev_month">vs Previous Month</option>
                <option value="prev_quarter">vs Previous Quarter</option>
                <option value="prev_year">vs Previous Year</option>
                <option value="custom">vs Custom Dates</option>
              </select>
            </div>

            {filters.comparisonPeriod === "custom" && filters.dateRange !== "all" && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="date"
                  aria-label="Comparison start date"
                  value={filters.compareStartDate || ""}
                  onChange={(e) => patch({ compareStartDate: e.target.value })}
                  style={controlStyle}
                />
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>to</span>
                <input
                  type="date"
                  aria-label="Comparison end date"
                  value={filters.compareEndDate || ""}
                  onChange={(e) => patch({ compareEndDate: e.target.value })}
                  style={controlStyle}
                />
              </div>
            )}

            {/* Granularity Toggle */}
            <div
              style={{
                display: "inline-flex",
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: 3,
              }}
            >
              {(["daily", "weekly", "monthly"] as AnalyticsTimeGranularity[]).map((g) => {
                const active = filters.granularity === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => patch({ granularity: g })}
                    style={{
                      border: "none",
                      borderRadius: 7,
                      padding: "4px 10px",
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: "capitalize",
                      cursor: "pointer",
                      background: active ? "var(--primary)" : "transparent",
                      color: active ? "var(--primary-text)" : "var(--text-secondary)",
                    }}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Action Controls */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              style={{
                ...actionBtnStyle,
                borderColor: activeAdvancedCount > 0 ? "var(--primary)" : "var(--border)",
                background: activeAdvancedCount > 0 ? "var(--bg-active)" : "var(--bg-surface)",
              }}
            >
              <SlidersHorizontal size={14} style={{ color: "var(--primary)" }} />
              <span>Filters</span>
              {activeAdvancedCount > 0 && (
                <span
                  style={{
                    background: "var(--primary)",
                    color: "var(--primary-text)",
                    borderRadius: 999,
                    fontSize: 11,
                    padding: "1px 7px",
                    fontWeight: 700,
                  }}
                >
                  {activeAdvancedCount}
                </span>
              )}
            </button>

            <button type="button" onClick={onClearAllFilters} style={actionBtnStyle}>
              <Filter size={13} />
              <span>Clear Filters</span>
            </button>

            <button type="button" onClick={onResetDefault} style={actionBtnStyle}>
              <RotateCcw size={13} />
              <span>Reset View</span>
            </button>

            <button type="button" onClick={onRefresh} style={actionBtnStyle}>
              <RefreshCw
                size={13}
                style={{
                  animation: isRefreshing ? "spin 0.8s linear infinite" : undefined,
                }}
              />
              <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
            </button>

            <button
              type="button"
              disabled={!canExport}
              title={
                canExport
                  ? "Export active section metrics to CSV"
                  : "Export disabled for current RBAC role permission"
              }
              onClick={onExportCurrentReport}
              style={{
                ...actionBtnStyle,
                background: canExport ? "var(--primary)" : "var(--bg-surface-elevated)",
                color: canExport ? "var(--primary-text)" : "var(--text-muted)",
                borderColor: canExport ? "var(--primary)" : "var(--border)",
                cursor: canExport ? "pointer" : "not-allowed",
                opacity: canExport ? 1 : 0.7,
              }}
            >
              <Download size={13} />
              <span>Export Current Report</span>
            </button>
          </div>
        </div>

        {/* Bottom Freshness & Active Scope Ribbon */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            paddingTop: 10,
            borderTop: "1px solid var(--border-light)",
            fontSize: 12,
            color: "var(--text-secondary)",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Clock size={13} style={{ color: "var(--status-success)" }} />
              <strong>Data Freshness:</strong> Synchronized live at {formattedTime}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Layers size={13} style={{ color: "var(--primary)" }} />
              <strong>Active Scope:</strong>{" "}
              {formatDateRangeLabel(
                filters.dateRange,
                filters.customStartDate,
                filters.customEndDate
              )}{" "}
              ({activeWindowLabel})
            </span>
            {comparisonWindowLabel && (
              <span style={{ color: "var(--text-muted)" }}>
                <strong>Comparison:</strong> {comparisonWindowLabel}
              </span>
            )}
          </div>

          {activeAdvancedCount > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {filters.country !== "all" && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    background: "var(--bg-surface-elevated)",
                    padding: "2px 8px",
                    borderRadius: 999,
                  }}
                >
                  Country: {filters.country}
                </span>
              )}
              {filters.platform !== "all" && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    background: "var(--bg-surface-elevated)",
                    padding: "2px 8px",
                    borderRadius: 999,
                  }}
                >
                  Platform: {filters.platform.toUpperCase()}
                </span>
              )}
              {filters.userSegment !== "all" && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    background: "var(--bg-surface-elevated)",
                    padding: "2px 8px",
                    borderRadius: 999,
                  }}
                >
                  Segment: {filters.userSegment.replace("_", " ")}
                </span>
              )}
              {filters.subscriptionPlan !== "all" && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    background: "var(--bg-surface-elevated)",
                    padding: "2px 8px",
                    borderRadius: 999,
                  }}
                >
                  Plan: {filters.subscriptionPlan}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Advanced Global Filters Drawer */}
      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Global Analytics Dimensional Filters"
          onClick={() => setDrawerOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 80,
            background: "rgba(15, 10, 20, 0.45)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(430px, 92vw)",
              height: "100%",
              background: "var(--bg-surface)",
              borderLeft: "1px solid var(--border)",
              boxShadow: "var(--shadow-lg)",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflowY: "auto",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: 14,
                  borderBottom: "1px solid var(--border-light)",
                  marginBottom: 16,
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: 17, color: "var(--text-main)" }}>
                    Global Dimension Filters
                  </h3>
                  <p style={{ margin: "3px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>
                    Applies uniformly across all 19 Business Intelligence tabs.
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close filters drawer"
                  onClick={() => setDrawerOpen(false)}
                  style={{
                    background: "var(--bg-surface-elevated)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    padding: 6,
                    color: "var(--text-main)",
                    cursor: "pointer",
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5 }}>
                  <span style={{ fontWeight: 600, color: "var(--text-main)" }}>Country / Region</span>
                  <select
                    value={filters.country}
                    onChange={(e) => patch({ country: e.target.value })}
                    style={controlStyle}
                  >
                    <option value="all">All Countries</option>
                    {availableCountries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5 }}>
                  <span style={{ fontWeight: 600, color: "var(--text-main)" }}>Client Platform</span>
                  <select
                    value={filters.platform}
                    onChange={(e) =>
                      patch({ platform: e.target.value as AnalyticsGlobalFilterState["platform"] })
                    }
                    style={controlStyle}
                  >
                    <option value="all">All Platforms</option>
                    <option value="android">Android</option>
                    <option value="ios">iOS</option>
                    <option value="web">Web</option>
                  </select>
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5 }}>
                  <span style={{ fontWeight: 600, color: "var(--text-main)" }}>User Account Status</span>
                  <select
                    value={filters.userStatus}
                    onChange={(e) =>
                      patch({
                        userStatus: e.target.value as AnalyticsGlobalFilterState["userStatus"],
                      })
                    }
                    style={controlStyle}
                  >
                    <option value="all">All Account Statuses</option>
                    <option value="active">Active</option>
                    <option value="online">Currently Online</option>
                    <option value="pending_verification">Pending Verification</option>
                    <option value="suspended">Suspended (Excluded from Active)</option>
                    <option value="banned">Banned (Excluded from Active)</option>
                  </select>
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5 }}>
                  <span style={{ fontWeight: 600, color: "var(--text-main)" }}>Subscription Plan</span>
                  <select
                    value={filters.subscriptionPlan}
                    onChange={(e) =>
                      patch({
                        subscriptionPlan: e.target.value as AnalyticsGlobalFilterState["subscriptionPlan"],
                      })
                    }
                    style={controlStyle}
                  >
                    <option value="all">All Membership Tiers</option>
                    <option value="free">Free Tier</option>
                    <option value="1-month">1-Month Premium</option>
                    <option value="6-months">6-Months Premium</option>
                    <option value="12-months">12-Months Annual</option>
                  </select>
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5 }}>
                  <span style={{ fontWeight: 600, color: "var(--text-main)" }}>Acquisition Source</span>
                  <select
                    value={filters.referralSource}
                    onChange={(e) =>
                      patch({
                        referralSource: e.target.value as AnalyticsGlobalFilterState["referralSource"],
                      })
                    }
                    style={controlStyle}
                  >
                    <option value="all">All Sources (Organic + Referral)</option>
                    <option value="organic">Organic Signups</option>
                    <option value="referral">Referral Code Attributed</option>
                  </select>
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5 }}>
                  <span style={{ fontWeight: 600, color: "var(--text-main)" }}>Live Stream Category</span>
                  <select
                    value={filters.liveCategory}
                    onChange={(e) => patch({ liveCategory: e.target.value })}
                    style={controlStyle}
                  >
                    <option value="all">All Live Categories</option>
                    <option value="Music & Chill">Music & Chill</option>
                    <option value="Speed Dating">Speed Dating</option>
                    <option value="Relationship Q&A">Relationship Q&A</option>
                    <option value="Culture & Travel">Culture & Travel</option>
                    <option value="Casual Chat">Casual Chat</option>
                  </select>
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5 }}>
                  <span style={{ fontWeight: 600, color: "var(--text-main)" }}>Transaction Focus</span>
                  <select
                    value={filters.transactionCategory}
                    onChange={(e) =>
                      patch({
                        transactionCategory: e.target
                          .value as AnalyticsGlobalFilterState["transactionCategory"],
                      })
                    }
                    style={controlStyle}
                  >
                    <option value="all">All Separated Ledgers</option>
                    <option value="premium_subscription">Premium Subscriptions (USD)</option>
                    <option value="gift_coins">Gift Coins (IAP & Virtual)</option>
                    <option value="connection_points">Connection Points (Non-Cash Rewards)</option>
                  </select>
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5 }}>
                  <span style={{ fontWeight: 600, color: "var(--text-main)" }}>User Cohort Segment</span>
                  <select
                    value={filters.userSegment}
                    onChange={(e) =>
                      patch({
                        userSegment: e.target.value as AnalyticsGlobalFilterState["userSegment"],
                      })
                    }
                    style={controlStyle}
                  >
                    <option value="all">All Users</option>
                    <option value="verified">ID/Photo Verified Only</option>
                    <option value="unverified">Unverified Only</option>
                    <option value="premium">Active Premium Members</option>
                    <option value="free">Free Members Only</option>
                    <option value="referred">Referred Users</option>
                    <option value="completed_profile">Profiles &ge; 80% Complete</option>
                  </select>
                </label>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                paddingTop: 16,
                borderTop: "1px solid var(--border-light)",
                marginTop: 20,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  onClearAllFilters();
                  setDrawerOpen(false);
                }}
                style={{ ...actionBtnStyle, flex: 1, justifyContent: "center" }}
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                style={{
                  ...actionBtnStyle,
                  flex: 1,
                  justifyContent: "center",
                  background: "var(--primary)",
                  color: "var(--primary-text)",
                  borderColor: "var(--primary)",
                }}
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

