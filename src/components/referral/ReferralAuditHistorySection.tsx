import React, { useState } from "react";
import { History, Download, Search, Lock, ArrowUpDown } from "lucide-react";
import type { ReferralAuditEvent } from "../../types/referralManagement.types";
import { Badge } from "../common/Badge";
import { formatDateTime } from "./referralUiUtils";
import { ReferralPagination } from "./ReferralPagination";
import { exportReferralAuditCsv } from "../../data/referralManagementDataService";

interface ReferralAuditHistorySectionProps {
  events: ReferralAuditEvent[];
  onExportToast: (msg: string) => void;
}

export const ReferralAuditHistorySection: React.FC<
  ReferralAuditHistorySectionProps
> = ({ events, onExportToast }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const filtered = events
    .filter((ev) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        ev.id.toLowerCase().includes(q) ||
        ev.actorName.toLowerCase().includes(q) ||
        ev.actionLabel.toLowerCase().includes(q) ||
        (ev.referralId || "").toLowerCase().includes(q) ||
        (ev.referrerName || "").toLowerCase().includes(q) ||
        ev.reason.toLowerCase().includes(q);
      const matchAction =
        actionFilter === "all" || ev.actionType === actionFilter;
      return matchQuery && matchAction;
    })
    .sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        : new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

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
            <History size={18} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>
                Immutable Referral Audit History ({filtered.length})
              </h3>
              <Badge variant="neutral" size="sm">
                <Lock size={11} style={{ marginRight: "4px" }} />
                Append-Only Ledger
              </Badge>
            </div>
            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
              Permanent chronological compliance trail. Records cannot be altered or deleted.
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
              placeholder="Search actor, referral ID, reason..."
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-main)",
                borderRadius: "9px",
                padding: "8px 10px 8px 32px",
                fontSize: "0.8rem",
                width: "220px",
              }}
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => {
              setCurrentPage(1);
              setActionFilter(e.target.value);
            }}
            style={{
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-main)",
              borderRadius: "9px",
              padding: "8px 10px",
              fontSize: "0.79rem",
            }}
          >
            <option value="all">All Audited Actions</option>
            <option value="reward_issued">Reward Issued</option>
            <option value="reward_failed">Reward Failed</option>
            <option value="reward_reversed">Reward Reversed</option>
            <option value="referral_validated">Referral Validated</option>
            <option value="referral_rejected">Referral Rejected</option>
            <option value="referral_reconsidered">Referral Reconsidered</option>
            <option value="fraud_assigned">Fraud Assigned</option>
            <option value="fraud_cleared">Fraud Cleared</option>
            <option value="fraud_escalated">Fraud Escalated</option>
            <option value="reward_amount_changed">Reward Amount Changed</option>
            <option value="programme_enabled">Programme Enabled</option>
            <option value="programme_disabled">Programme Disabled</option>
          </select>

          <button
            type="button"
            onClick={() => setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))}
            style={{
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-main)",
              borderRadius: "9px",
              padding: "8px 10px",
              fontSize: "0.79rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <ArrowUpDown size={13} />
            <span>{sortOrder === "newest" ? "Newest" : "Oldest"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              exportReferralAuditCsv(filtered);
              onExportToast(`Exported ${filtered.length} immutable referral audit events.`);
            }}
            style={{
              background: "var(--primary)",
              border: "none",
              color: "#fff",
              borderRadius: "9px",
              padding: "8px 12px",
              fontSize: "0.79rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Download size={13} />
            <span>Export Audit CSV</span>
          </button>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)", textAlign: "left" }}>
              <th style={{ padding: "10px 8px" }}>Event ID / Time</th>
              <th style={{ padding: "10px 8px" }}>Actor &amp; Role</th>
              <th style={{ padding: "10px 8px" }}>Action</th>
              <th style={{ padding: "10px 8px" }}>Referral / Participants</th>
              <th style={{ padding: "10px 8px" }}>Transition / Points</th>
              <th style={{ padding: "10px 8px" }}>Compliance Reason</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((ev) => {
              const badgeVar =
                ev.actionType === "reward_issued" || ev.actionType === "programme_enabled" || ev.actionType === "fraud_cleared"
                  ? "success"
                  : ev.actionType === "referral_rejected" || ev.actionType === "reward_failed" || ev.actionType === "programme_disabled"
                  ? "error"
                  : ev.actionType === "fraud_escalated" || ev.actionType === "reward_reversed"
                  ? "warning"
                  : "info";

              return (
                <tr key={ev.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "10px 8px" }}>
                    <div style={{ fontWeight: 700, color: "var(--primary)" }}>{ev.id}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{formatDateTime(ev.timestamp)}</div>
                  </td>
                  <td style={{ padding: "10px 8px" }}>
                    <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{ev.actorName}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{ev.actorRole}</div>
                  </td>
                  <td style={{ padding: "10px 8px" }}>
                    <Badge variant={badgeVar} size="sm">{ev.actionLabel}</Badge>
                  </td>
                  <td style={{ padding: "10px 8px", color: "var(--text-secondary)" }}>
                    <div><strong>{ev.referralId || "--"}</strong></div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                      {ev.referrerName ? `${ev.referrerName}${ev.referredUserName ? ` -> ${ev.referredUserName}` : ""}` : "--"}
                    </div>
                  </td>
                  <td style={{ padding: "10px 8px" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-main)" }}>
                      {ev.previousState || "--"} -&gt; {ev.newState || "--"}
                    </div>
                    {ev.rewardAmountPoints !== undefined && (
                      <div style={{ fontSize: "0.71rem", fontWeight: 700, color: "var(--accent-lavender)" }}>
                        {ev.rewardAmountPoints > 0 ? `+${ev.rewardAmountPoints}` : ev.rewardAmountPoints} Pts
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "10px 8px", maxWidth: "280px", color: "var(--text-secondary)" }}>
                    {ev.reason}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
    </div>
  );
};

