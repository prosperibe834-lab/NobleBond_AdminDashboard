import React, { useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  Download,
  LayoutGrid,
  List,
  ArrowUpDown,
} from "lucide-react";
import type {
  UnifiedFinancialTransaction,
  WalletFilterState,
  WalletSortCriteria,
} from "../../types/walletManagement.types";
import { Badge } from "../common/Badge";
import { WalletFilterDrawer } from "./WalletFilterDrawer";
import { WalletPagination } from "./WalletPagination";
import { WalletMobileCards } from "./WalletMobileCards";
import {
  formatDateTime,
  formatTxValue,
  getCategoryMeta,
  getTxStatusMeta,
  getTxTypeLabel,
} from "./walletUiUtils";
import {
  exportUnifiedTransactionsCsv,
  filterAndSortTransactions,
} from "../../data/walletManagementDataService";

interface AllTransactionsSectionProps {
  transactions: UnifiedFinancialTransaction[];
  filters: WalletFilterState;
  onUpdateFilters: (next: WalletFilterState) => void;
  onResetFilters: () => void;
  onInspectTransaction: (tx: UnifiedFinancialTransaction) => void;
  onExportToast: (msg: string) => void;
}

export const AllTransactionsSection: React.FC<AllTransactionsSectionProps> = ({
  transactions,
  filters,
  onUpdateFilters,
  onResetFilters,
  onInspectTransaction,
  onExportToast,
}) => {
  const [sort, setSort] = useState<WalletSortCriteria>({ field: "newest", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">(() =>
    typeof window !== "undefined" && window.innerWidth < 860 ? "cards" : "table"
  );

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 860) setViewMode("cards");
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const filtered = filterAndSortTransactions(transactions, filters, sort);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleFilterChange = (next: WalletFilterState) => {
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
            Unified Multi-Category Financial Ledger ({filtered.length})
          </h3>
          <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "2px" }}>
            Distinct unit formatting per entry: USD fiat, Gift Coins, or Connection Points
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
                handleFilterChange({ ...filters, searchQuery: e.target.value })
              }
              placeholder="Search ID, member, ref..."
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-main)",
                borderRadius: "9px",
                padding: "8px 10px 8px 32px",
                fontSize: "0.81rem",
                width: "215px",
              }}
            />
          </div>

          <select
            value={filters.category}
            onChange={(e) =>
              handleFilterChange({
                ...filters,
                category: e.target.value as WalletFilterState["category"],
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
            <option value="all">All Categories</option>
            <option value="gift_coins">Gift Coins</option>
            <option value="connection_points">Connection Points</option>
            <option value="premium_subscription">Premium Subscriptions</option>
          </select>

          <button
            type="button"
            onClick={() =>
              setSort((prev) => ({
                field: prev.field === "newest" ? "amount_desc" : prev.field === "amount_desc" ? "oldest" : "newest",
                direction: "desc",
              }))
            }
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
            <ArrowUpDown size={14} />
            <span>
              Sort: {sort.field === "newest" ? "Newest" : sort.field === "amount_desc" ? "Largest" : "Oldest"}
            </span>
          </button>

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
              exportUnifiedTransactionsCsv(filtered);
              onExportToast(`Exported ${filtered.length} financial ledger transactions to CSV.`);
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

      {/* Content */}
      {paginated.length === 0 ? (
        <div style={{ padding: "40px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.88rem" }}>
          No financial records match the active search and filters.
        </div>
      ) : viewMode === "cards" ? (
        <WalletMobileCards transactions={paginated} onInspectTransaction={onInspectTransaction} />
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)", textAlign: "left" }}>
                <th style={{ padding: "10px 8px" }}>Transaction</th>
                <th style={{ padding: "10px 8px" }}>Category</th>
                <th style={{ padding: "10px 8px" }}>Member</th>
                <th style={{ padding: "10px 8px" }}>Unit Value</th>
                <th style={{ padding: "10px 8px" }}>Reference</th>
                <th style={{ padding: "10px 8px" }}>Timestamp</th>
                <th style={{ padding: "10px 8px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((tx) => {
                const catMeta = getCategoryMeta(tx.category);
                const valMeta = formatTxValue(tx);
                const stMeta = getTxStatusMeta(tx.status);
                return (
                  <tr
                    key={tx.id}
                    onClick={() => onInspectTransaction(tx)}
                    style={{ borderBottom: "1px solid var(--border-light)", cursor: "pointer" }}
                  >
                    <td style={{ padding: "11px 8px" }}>
                      <div style={{ fontWeight: 700, color: "var(--primary)" }}>{tx.id}</div>
                      <div style={{ fontSize: "0.76rem", color: "var(--text-main)", fontWeight: 600 }}>
                        {tx.title}
                      </div>
                      <div style={{ fontSize: "0.71rem", color: "var(--text-muted)" }}>
                        {getTxTypeLabel(tx.transactionType)}
                      </div>
                    </td>
                    <td style={{ padding: "11px 8px" }}>
                      <Badge variant={catMeta.variant} size="sm">{catMeta.label}</Badge>
                    </td>
                    <td style={{ padding: "11px 8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <img
                          src={tx.userAvatar}
                          alt={tx.userName}
                          style={{ width: "26px", height: "26px", borderRadius: "50%", objectFit: "cover" }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{tx.userName}</div>
                          <div style={{ fontSize: "0.71rem", color: "var(--text-muted)" }}>@{tx.username}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "11px 8px" }}>
                      <div style={{ fontWeight: 800, color: valMeta.toneColor }}>{valMeta.primaryText}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{valMeta.unitLabel}</div>
                    </td>
                    <td style={{ padding: "11px 8px", color: "var(--text-secondary)", fontSize: "0.76rem" }}>
                      <div>{tx.referenceId}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{tx.relatedServiceLabel}</div>
                    </td>
                    <td style={{ padding: "11px 8px", color: "var(--text-secondary)" }}>
                      {formatDateTime(tx.timestamp)}
                    </td>
                    <td style={{ padding: "11px 8px" }}>
                      <Badge variant={stMeta.variant} size="sm">{stMeta.label}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

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

      <WalletFilterDrawer
        isOpen={drawerOpen}
        filters={filters}
        onUpdateFilters={handleFilterChange}
        onResetFilters={() => {
          setCurrentPage(1);
          onResetFilters();
        }}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};

