import React, { useState } from "react";
import { FileSpreadsheet, Plus, Trash2, Download, Lock, FolderOpen, CheckSquare } from "lucide-react";
import {
  createSavedCustomReportConfig,
  deleteSavedCustomReportConfig,
  exportAnalyticsReportCsv,
  loadSavedCustomReports,
  type PlatformAnalyticsSnapshot,
} from "../../../data/platformAnalyticsDataService";
import type {
  AnalyticsGlobalFilterState,
  AnalyticsRolePermissions,
  AnalyticsTabKey,
  SavedCustomReportConfig,
} from "../../../types/analyticsManagement.types";
import {
  formatCoinsQty,
  formatMoneyUsd,
  formatPointsQty,
  formatShortDate,
} from "../analyticsUiUtils";

interface CustomReportsSectionProps {
  snapshot: PlatformAnalyticsSnapshot;
  filters: AnalyticsGlobalFilterState;
  permissions: AnalyticsRolePermissions;
}

interface CatalogMetricRow {
  id: string;
  label: string;
  unit: string;
  sourceModule: string;
  requiresRevenuePermission?: boolean;
  computeValue: (s: PlatformAnalyticsSnapshot) => string;
}

const REPORT_METRIC_CATALOG: CatalogMetricRow[] = [
  {
    id: "m_total_users",
    label: "Total Filtered Directory Users",
    unit: "Count",
    sourceModule: "User Management",
    computeValue: (s) => `${s.users.length}`,
  },
  {
    id: "m_new_regs",
    label: "New Registrations (Window)",
    unit: "Count",
    sourceModule: "User Management",
    computeValue: (s) => `${s.newUsersCurrent.length}`,
  },
  {
    id: "m_dau",
    label: "Daily Active Users (DAU)",
    unit: "Count",
    sourceModule: "User Management",
    computeValue: (s) => `${s.dauCount}`,
  },
  {
    id: "m_complete_profiles",
    label: "Complete Profiles (>=80%)",
    unit: "Count",
    sourceModule: "Profile Management",
    computeValue: (s) => `${s.completeProfiles.length}`,
  },
  {
    id: "m_likes_sent",
    label: "1-Way Likes Sent",
    unit: "Count",
    sourceModule: "Likes & Matches",
    computeValue: (s) => `${s.likesCurrent.length}`,
  },
  {
    id: "m_mutual_matches",
    label: "Confirmed Mutual Matches",
    unit: "Count",
    sourceModule: "Likes & Matches",
    computeValue: (s) => `${s.matchesCurrent.length}`,
  },
  {
    id: "m_messages_sent",
    label: "Messages Exchanged",
    unit: "Count",
    sourceModule: "Chat Management",
    computeValue: (s) => s.messagesSentCurrent.toLocaleString("en-US"),
  },
  {
    id: "m_live_sessions",
    label: "Live Sessions Hosted",
    unit: "Count",
    sourceModule: "Live Management",
    computeValue: (s) => `${s.liveSessions.length}`,
  },
  {
    id: "m_sub_net_usd",
    label: "Net Subscription Revenue",
    unit: "USD (Fiat)",
    sourceModule: "Subscriptions",
    requiresRevenuePermission: true,
    computeValue: (s) => formatMoneyUsd(s.netSubRevenueUsd),
  },
  {
    id: "m_sub_mrr_usd",
    label: "Subscription Monthly Recurring Revenue (MRR)",
    unit: "USD (Fiat)",
    sourceModule: "Subscriptions",
    requiresRevenuePermission: true,
    computeValue: (s) => formatMoneyUsd(s.mrrUsd),
  },
  {
    id: "m_coin_iap_usd",
    label: "Gift Coin Pack IAP Volume",
    unit: "USD (Fiat)",
    sourceModule: "Wallet Management",
    requiresRevenuePermission: true,
    computeValue: (s) => formatMoneyUsd(s.coinPurchaseVolumeUsd),
  },
  {
    id: "m_coins_gifted",
    label: "Virtual Gift Coins Sent in Live",
    unit: "Coins (Virtual)",
    sourceModule: "Live + Wallet",
    computeValue: (s) => formatCoinsQty(s.totalCoinsSpentOnGifts),
  },
  {
    id: "m_cp_issued",
    label: "Connection Points Issued (OTP Referrals)",
    unit: "Points (Non-Cash)",
    sourceModule: "Referrals + Wallet",
    computeValue: (s) => formatPointsQty(s.cpIssuedPoints),
  },
  {
    id: "m_ref_qualified",
    label: "Qualified Referrals",
    unit: "Count",
    sourceModule: "Referral Management",
    computeValue: (s) => `${s.successfulReferralsCurrent.length}`,
  },
  {
    id: "m_open_reports",
    label: "Pending Safety Reports",
    unit: "Count",
    sourceModule: "Moderation",
    computeValue: (s) => `${s.pendingReportsCount}`,
  },
  {
    id: "m_open_tickets",
    label: "Open Support Tickets",
    unit: "Count",
    sourceModule: "Customer Support",
    computeValue: (s) => `${s.openTicketsCount}`,
  },
];

const cardStyle: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: 16,
  padding: 18,
  boxShadow: "var(--shadow-sm)",
};

export const CustomReportsSection: React.FC<CustomReportsSectionProps> = ({
  snapshot,
  filters,
  permissions,
}) => {
  const [savedReports, setSavedReports] = useState<SavedCustomReportConfig[]>(() =>
    loadSavedCustomReports()
  );
  const [reportName, setReportName] = useState("Executive Weekly Snapshot");
  const [category, setCategory] = useState<AnalyticsTabKey>("executive_overview");
  const [selectedMetricIds, setSelectedMetricIds] = useState<string[]>([
    "m_new_regs",
    "m_dau",
    "m_mutual_matches",
    "m_sub_net_usd",
    "m_coins_gifted",
    "m_cp_issued",
  ]);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const availableCatalog = REPORT_METRIC_CATALOG.filter(
    (item) => !item.requiresRevenuePermission || permissions.canViewRevenueAnalytics
  );

  const toggleMetric = (id: string) => {
    setSelectedMetricIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const activeRows = availableCatalog.filter((item) => selectedMetricIds.includes(item.id));

  const handleSave = () => {
    if (!permissions.canCreateCustomReports) return;
    const trimmed = reportName.trim() || "Untitled Custom Report";
    const next = createSavedCustomReportConfig({
      name: trimmed,
      category,
      selectedMetricIds: activeRows.map((r) => r.id),
      filtersSnapshot: filters,
      createdBy: permissions.roleLabel,
    });
    setSavedReports(next);
    setStatusNotice(`Saved report template "${trimmed}" to browser workspace storage.`);
  };

  const handleLoad = (cfg: SavedCustomReportConfig) => {
    setReportName(cfg.name);
    setCategory(cfg.category);
    setSelectedMetricIds(cfg.selectedMetricIds);
    setStatusNotice(`Loaded template "${cfg.name}".`);
  };

  const handleDelete = (id: string) => {
    const next = deleteSavedCustomReportConfig(id);
    setSavedReports(next);
    setStatusNotice("Removed saved report template.");
  };

  const handleExport = () => {
    if (!permissions.canExportAnalytics) return;
    const rows = activeRows.map((r) => ({
      metric: r.label,
      value: r.computeValue(snapshot),
      unit: r.unit,
      sourceModule: r.sourceModule,
    }));
    exportAnalyticsReportCsv(reportName.trim() || "NobleBond Custom Report", snapshot.currentWindow.label, rows);
    setStatusNotice(`Downloaded CSV export for "${reportName}".`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FileSpreadsheet size={18} style={{ color: "var(--primary)" }} />
              <h2 style={{ margin: 0, fontSize: 17, color: "var(--text-main)" }}>
                Section 19: Custom Report Builder & CSV Exports
              </h2>
            </div>
            <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--text-secondary)" }}>
              Compose custom multi-module reports preserving strict USD / Coins / Points unit
              columns.
            </p>
          </div>
          {!permissions.canCreateCustomReports && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                color: "var(--status-warning)",
                background: "var(--status-warning-bg)",
                padding: "5px 10px",
                borderRadius: 999,
              }}
            >
              <Lock size={13} /> Read-only preview ({permissions.roleLabel})
            </span>
          )}
        </div>

        {statusNotice && (
          <div
            style={{
              marginBottom: 14,
              padding: "9px 12px",
              borderRadius: 10,
              background: "var(--status-success-bg)",
              color: "var(--status-success)",
              fontSize: 12.5,
              fontWeight: 600,
            }}
          >
            {statusNotice}
          </div>
        )}

        {/* Config Form */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 14,
            marginBottom: 16,
          }}
        >
          <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5 }}>
            <span style={{ fontWeight: 600, color: "var(--text-main)" }}>Report Title</span>
            <input
              type="text"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              disabled={!permissions.canCreateCustomReports}
              style={{
                background: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "8px 11px",
                fontSize: 13,
              }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5 }}>
            <span style={{ fontWeight: 600, color: "var(--text-main)" }}>Primary Focus Domain</span>
            <select
              value={category}
              disabled={!permissions.canCreateCustomReports}
              onChange={(e) => setCategory(e.target.value as AnalyticsTabKey)}
              style={{
                background: "var(--bg-surface-elevated)",
                color: "var(--text-main)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "8px 11px",
                fontSize: 13,
              }}
            >
              <option value="executive_overview">Executive Cross-Platform</option>
              <option value="user_analytics">User Growth & Retention</option>
              <option value="likes_matches_analytics">Dating & Engagement</option>
              <option value="premium_revenue_analytics">Subscriptions & Finance</option>
              <option value="live_streaming_analytics">Live Streaming & Coins</option>
              <option value="referral_analytics">Referrals & Connection Points</option>
              <option value="moderation_analytics">Safety & Support Ops</option>
            </select>
          </label>
        </div>

        {/* Metric Checkbox Picker */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-main)", marginBottom: 8 }}>
            Select Verified Metrics ({activeRows.length} chosen)
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: 8,
            }}
          >
            {availableCatalog.map((item) => {
              const checked = selectedMetricIds.includes(item.id);
              return (
                <label
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 10px",
                    borderRadius: 10,
                    background: checked ? "var(--bg-active)" : "var(--bg-surface-elevated)",
                    border: `1px solid ${checked ? "var(--primary)" : "var(--border-light)"}`,
                    fontSize: 12,
                    cursor: permissions.canCreateCustomReports ? "pointer" : "not-allowed",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={!permissions.canCreateCustomReports}
                    onChange={() => toggleMetric(item.id)}
                  />
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{item.label}</div>
                    <div style={{ fontSize: 10.5, color: "var(--text-muted)" }}>
                      {item.unit} • {item.sourceModule}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Builder Actions */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
          <button
            type="button"
            disabled={!permissions.canCreateCustomReports || activeRows.length === 0}
            onClick={handleSave}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 10,
              border: "none",
              background: permissions.canCreateCustomReports ? "var(--primary)" : "var(--bg-surface-elevated)",
              color: permissions.canCreateCustomReports ? "var(--primary-text)" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: 12.5,
              cursor: permissions.canCreateCustomReports ? "pointer" : "not-allowed",
            }}
          >
            <Plus size={14} />
            <span>Save Report Definition</span>
          </button>

          <button
            type="button"
            disabled={!permissions.canExportAnalytics || activeRows.length === 0}
            onClick={handleExport}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--bg-surface)",
              color: permissions.canExportAnalytics ? "var(--text-main)" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: 12.5,
              cursor: permissions.canExportAnalytics ? "pointer" : "not-allowed",
            }}
          >
            <Download size={14} />
            <span>Download CSV Report</span>
          </button>
        </div>

        {/* Live Preview Table */}
        <h4 style={{ margin: "0 0 8px", fontSize: 14, color: "var(--text-main)" }}>
          Report Output Preview ({snapshot.currentWindow.label})
        </h4>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                <th style={{ textAlign: "left", padding: "8px 10px" }}>Metric</th>
                <th style={{ textAlign: "left", padding: "8px 10px" }}>Measured Value</th>
                <th style={{ textAlign: "left", padding: "8px 10px" }}>Strict Unit Type</th>
                <th style={{ textAlign: "left", padding: "8px 10px" }}>Source Module</th>
              </tr>
            </thead>
            <tbody>
              {activeRows.map((row) => (
                <tr key={row.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "8px 10px", fontWeight: 600, color: "var(--text-main)" }}>
                    {row.label}
                  </td>
                  <td style={{ padding: "8px 10px", fontWeight: 800, color: "var(--primary)" }}>
                    {row.computeValue(snapshot)}
                  </td>
                  <td style={{ padding: "8px 10px", color: "var(--text-secondary)" }}>{row.unit}</td>
                  <td style={{ padding: "8px 10px", color: "var(--text-muted)" }}>{row.sourceModule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Saved Reports Library */}
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <FolderOpen size={17} style={{ color: "var(--accent-lavender)" }} />
          <h3 style={{ margin: 0, fontSize: 15.5, color: "var(--text-main)" }}>
            Saved Report Templates ({savedReports.length})
          </h3>
        </div>

        {savedReports.length === 0 ? (
          <div style={{ fontSize: 12.5, color: "var(--text-muted)", padding: "8px 0" }}>
            No custom report templates saved yet. Configure metrics above and click Save Report
            Definition.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {savedReports.map((rep) => (
              <div
                key={rep.id}
                style={{
                  padding: "10px 12px",
                  borderRadius: 12,
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-main)" }}>
                    {rep.name}
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                    {rep.selectedMetricIds.length} metrics • Saved by {rep.createdBy} on{" "}
                    {formatShortDate(rep.createdAt)}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => handleLoad(rep)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "6px 11px",
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: "var(--bg-surface)",
                      color: "var(--text-main)",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <CheckSquare size={13} />
                    <span>Load</span>
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete report ${rep.name}`}
                    onClick={() => handleDelete(rep.id)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "6px 9px",
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: "var(--status-error-bg)",
                      color: "var(--status-error)",
                      cursor: "pointer",
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

