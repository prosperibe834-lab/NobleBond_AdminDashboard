import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SupportPaginationProps {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const SupportPagination: React.FC<SupportPaginationProps> = ({
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIdx = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(totalItems, currentPage * pageSize);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        paddingTop: "14px",
        marginTop: "14px",
        borderTop: "1px solid var(--border-light)",
        fontSize: "0.8rem",
        color: "var(--text-secondary)",
      }}
    >
      <div>
        Showing <strong>{startIdx}</strong> - <strong>{endIdx}</strong> of <strong>{totalItems}</strong> tickets
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span>Rows:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            style={{
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-main)",
              borderRadius: "8px",
              padding: "4px 8px",
              fontSize: "0.8rem",
            }}
          >
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </label>

        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--bg-surface-elevated)",
              color: currentPage <= 1 ? "var(--text-muted)" : "var(--text-main)",
              cursor: currentPage <= 1 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronLeft size={15} />
          </button>
          <span style={{ padding: "0 8px", fontWeight: 600, color: "var(--text-main)" }}>
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--bg-surface-elevated)",
              color: currentPage >= totalPages ? "var(--text-muted)" : "var(--text-main)",
              cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

