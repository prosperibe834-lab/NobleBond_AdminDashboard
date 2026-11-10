import React, { useState } from "react";
import { Shield, Download, Search, Lock } from "lucide-react";
import type { WalletAuditEvent } from "../../types/walletManagement.types";
import { Badge } from "../common/Badge";
import { formatDateTime } from "./walletUiUtils";
import { WalletPagination } from "./WalletPagination";
import { exportWalletAuditCsv } from "../../data/walletManagementDataService";

interface WalletAuditHistorySectionProps {
  events: WalletAuditEvent[];
  onExportToast: (msg: string) => void;
}

export const WalletAuditHistorySection: React.FC<WalletAuditHistorySectionProps> = ({
  events,
  onExportToast,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [walletTypeFilter, setWalletTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const filtered = events.filter((ev) => {
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      ev.id.toLowerCase().includes(q) ||
      ev.adminName.toLowerCase().includes(q) ||
      ev.userName.toLowerCase().includes(q) ||
      ev.reason.toLowerCase().includes(q) ||
      ev.relatedTransactionId.toLowerCase().includes(q);
    const matchType =
      walletTypeFilter === "all" || ev.walletType === walletTypeFilter;
    return matchQuery && matchType;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "18px",
      }}
    >
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
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "var(--bg-surface-elevated)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--border)",
            }}
          >
            <Shield size={18} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>
                Immutable Financial Audit Ledger ({filtered.length})
              </h3>
              <Badge variant="neutral" size="sm">
                <Lock size={11} style={{ marginRight: "4px" }} />
                Append-Only
              </Badge>
            </div>
            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
              Permanent chronological compliance trail of adjustments, reward issuances, reversals & rule updates
            </div>
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
              value={searchQuery}
              onChange={(e) => {
                setCurrentPage(1);
                setSearchQuery(e.target.value);
              }}
              placeholder="Search admin, member, reason..."
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-main)",
                borderRadius: "9px",
                padding: "8px 10px 8px 32px",
                fontSize: "0.8rem",
                width: "215px",
              }}
            />
          </div>

          <select
            value={walletTypeFilter}
            onChange={(e) => {
              setCurrentPage(1);
              setWalletTypeFilter(e.target.value);
            }}
            style={{
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-main)",
              borderRadius: "9px",
              padding: "8px 10px",
              fontSize: "0.8rem",
            }}
          >
            <option value="all">All Audited Domains</option>
            <option value="gift_coins">Gift Coins</option>
            <option value="connection_points">Connection Points</option>
            <option value="premium_subscription">Premium Subscriptions</option>
            <option value="system_config">System Rules</option>
          </select>

          <button
            type="button"
            onClick={() => {
              exportWalletAuditCsv(filtered);
              onExportToast(`Exported ${filtered.length} immutable financial audit records to CSV.`);
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
            <span>Export Audit CSV</span>
          </button>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.81rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)", textAlign: "left" }}>
              <th style={{ padding: "10px 8px" }}>Audit ID / Time</th>
              <th style={{ padding: "10px 8px" }}>Authorized Admin</th>
              <th style={{ padding: "10px 8px" }}>Action</th>
              <th style={{ padding: "10px 8px" }}>Affected Member</th>
              <th style={{ padding: "10px 8px" }}>Delta & Balance Diff</th>
              <th style={{ padding: "10px 8px" }}>Compliance Reason</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((ev) => {
              const typeBadgeVariant =
                ev.walletType === "gift_coins"
                  ? "champagne"
                  : ev.walletType === "connection_points"
                  ? "info"
                  : ev.walletType === "premium_subscription"
                  ? "success"
                  : "neutral";
              return (
                <tr key={ev.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "11px 8px" }}>
                    <div style={{ fontWeight: 700, color: "var(--primary)" }}>{ev.id}</div>
                    <div style={{ fontSize: "0.71rem", color: "var(--text-muted)" }}>
                      {formatDateTime(ev.timestamp)}
                    </div>
                  </td>
                  <td style={{ padding: "11px 8px" }}>
                    <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{ev.adminName}</div>
                    <div style={{ fontSize: "0.71rem", color: "var(--text-muted)" }}>{ev.adminRole}</div>
                  </td>
                  <td style={{ padding: "11px 8px" }}>
                    <div style={{ marginBottom: "3px" }}>
                      <Badge variant={typeBadgeVariant} size="sm">
                        {ev.walletType.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                    <div style={{ fontSize: "0.73rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                      {ev.actionType.replace(/_/g, " ")}
                    </div>
                  </td>
                  <td style={{ padding: "11px 8px" }}>
                    <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{ev.userName}</div>
                    <div style={{ fontSize: "0.71rem", color: "var(--text-muted)" }}>{ev.userId}</div>
                  </td>
                  <td style={{ padding: "11px 8px" }}>
                    <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{ev.amountOrQuantityDisplay}</div>
                    <div style={{ fontSize: "0.71rem", color: "var(--text-muted)" }}>
                      {ev.previousBalance} -&gt; {ev.newBalance}
                    </div>
                  </td>
                  <td style={{ padding: "11px 8px", maxWidth: "280px" }}>
                    <div style={{ color: "var(--text-secondary)", lineHeight: 1.4 }}>{ev.reason}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      Ref: {ev.relatedTransactionId}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <WalletPagination
        totalItems={filtered.length}
        currentPage={safePage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />
    </div>
  );
};

