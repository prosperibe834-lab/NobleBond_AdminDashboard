import React, { useState } from "react";
import { ShieldCheck, AlertTriangle, CheckCircle2, Search } from "lucide-react";
import type {
  FinancialRolePermissions,
  ReconciliationCaseRecord,
  ReconciliationStatus,
} from "../../types/walletManagement.types";
import { Badge } from "../common/Badge";
import {
  formatDateTime,
  getCategoryMeta,
  getReconciliationStatusMeta,
} from "./walletUiUtils";

interface ReconciliationSectionProps {
  cases: ReconciliationCaseRecord[];
  permissions: FinancialRolePermissions;
  onSelectCase: (rec: ReconciliationCaseRecord) => void;
}

export const ReconciliationSection: React.FC<ReconciliationSectionProps> = ({
  cases,
  permissions,
  onSelectCase,
}) => {
  const [statusFilter, setStatusFilter] = useState<"all" | ReconciliationStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = cases.filter((c) => {
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      c.id.toLowerCase().includes(q) ||
      c.transactionRef.toLowerCase().includes(q) ||
      c.differenceSummary.toLowerCase().includes(q);
    return matchStatus && matchQuery;
  });

  const matchedCount = cases.filter((c) => c.status === "matched" || c.status === "resolved").length;
  const openIssuesCount = cases.filter(
    (c) => c.status === "mismatch" || c.status === "pending_review" || c.status === "escalated"
  ).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Summary Strip */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "16px 18px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: openIssuesCount > 0 ? "var(--status-warning-bg)" : "var(--status-success-bg)",
              color: openIssuesCount > 0 ? "var(--status-warning)" : "var(--status-success)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {openIssuesCount > 0 ? <AlertTriangle size={18} /> : <ShieldCheck size={18} />}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>
              Reconciliation & Financial Integrity Monitor
            </h3>
            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
              Cross-checks Gift Coins IAP, Live Gift receipts, Connection Points referrals, and Subscription provider webhooks
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Badge variant="success" size="sm">
            <CheckCircle2 size={12} style={{ marginRight: "4px" }} />
            {matchedCount} Reconciled
          </Badge>
          <Badge variant={openIssuesCount > 0 ? "error" : "neutral"} size="sm">
            {openIssuesCount} Open Discrepancies
          </Badge>
        </div>
      </div>

      {/* Filters + Case Table */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "18px",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <div style={{ position: "relative", minWidth: "230px" }}>
            <Search
              size={14}
              style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search case ID, tx ref..."
              style={{
                width: "100%",
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-main)",
                borderRadius: "9px",
                padding: "8px 10px 8px 32px",
                fontSize: "0.8rem",
              }}
            />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {(["all", "mismatch", "pending_review", "escalated", "resolved", "matched"] as const).map(
              (st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  style={{
                    padding: "6px 11px",
                    borderRadius: "999px",
                    border: statusFilter === st ? "1px solid var(--primary)" : "1px solid var(--border)",
                    background: statusFilter === st ? "var(--primary-glow)" : "var(--bg-surface-elevated)",
                    color: statusFilter === st ? "var(--primary)" : "var(--text-secondary)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    textTransform: "capitalize",
                  }}
                >
                  {st.replace("_", " ")}
                </button>
              )
            )}
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)", textAlign: "left" }}>
                <th style={{ padding: "10px 8px" }}>Case ID</th>
                <th style={{ padding: "10px 8px" }}>Product Category</th>
                <th style={{ padding: "10px 8px" }}>Transaction Ref</th>
                <th style={{ padding: "10px 8px" }}>Expected vs Actual</th>
                <th style={{ padding: "10px 8px" }}>Severity</th>
                <th style={{ padding: "10px 8px" }}>Status</th>
                <th style={{ padding: "10px 8px", textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const cat = getCategoryMeta(c.category);
                const st = getReconciliationStatusMeta(c.status);
                const sevVariant =
                  c.severity === "critical" || c.severity === "high"
                    ? "error"
                    : c.severity === "medium"
                    ? "warning"
                    : "info";

                return (
                  <tr
                    key={c.id}
                    onClick={() => onSelectCase(c)}
                    style={{ borderBottom: "1px solid var(--border-light)", cursor: "pointer" }}
                  >
                    <td style={{ padding: "11px 8px", fontWeight: 700, color: "var(--primary)" }}>
                      <div>{c.id}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 500 }}>
                        {formatDateTime(c.detectedAt)}
                      </div>
                    </td>
                    <td style={{ padding: "11px 8px" }}>
                      <Badge variant={cat.variant} size="sm">{cat.label}</Badge>
                    </td>
                    <td style={{ padding: "11px 8px", fontWeight: 600, color: "var(--text-main)" }}>
                      {c.transactionRef}
                    </td>
                    <td style={{ padding: "11px 8px", maxWidth: "330px" }}>
                      <div style={{ fontSize: "0.77rem", color: "var(--text-main)", fontWeight: 600 }}>
                        {c.differenceSummary}
                      </div>
                      <div style={{ fontSize: "0.71rem", color: "var(--text-muted)", marginTop: "2px" }}>
                        Expected: {c.expectedResult} | Actual: {c.actualResult}
                      </div>
                    </td>
                    <td style={{ padding: "11px 8px" }}>
                      <Badge variant={sevVariant} size="sm">{c.severity.toUpperCase()}</Badge>
                    </td>
                    <td style={{ padding: "11px 8px" }}>
                      <Badge variant={st.variant} size="sm">{st.label}</Badge>
                    </td>
                    <td style={{ padding: "11px 8px", textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCase(c);
                        }}
                        style={{
                          background: "var(--bg-surface-elevated)",
                          border: "1px solid var(--border)",
                          color: "var(--text-main)",
                          borderRadius: "8px",
                          padding: "6px 10px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {permissions.canReviewReconciliation ? "Investigate" : "Inspect"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

