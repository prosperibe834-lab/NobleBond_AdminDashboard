import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  UserCheck,
  ExternalLink,
  Info,
  Search,
} from "lucide-react";
import type {
  FraudAlertCaseRecord,
  FraudReviewStatus,
  ReferralRolePermissions,
} from "../../types/referralManagement.types";
import { Badge } from "../common/Badge";
import {
  formatDateTime,
  getFraudStatusMeta,
  getRiskLevelMeta,
} from "./referralUiUtils";

interface FraudDetectionSectionProps {
  fraudCases: FraudAlertCaseRecord[];
  permissions: ReferralRolePermissions;
  onAssignToMe: (caseId: string) => void;
  onOpenFraudModal: (fc: FraudAlertCaseRecord) => void;
}

export const FraudDetectionSection: React.FC<FraudDetectionSectionProps> = ({
  fraudCases,
  permissions,
  onAssignToMe,
  onOpenFraudModal,
}) => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<"all" | FraudReviewStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = fraudCases.filter((c) => {
    const matchStatus = statusFilter === "all" || c.reviewStatus === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      c.id.toLowerCase().includes(q) ||
      c.referralId.toLowerCase().includes(q) ||
      c.referrerName.toLowerCase().includes(q) ||
      c.referredUserName.toLowerCase().includes(q) ||
      c.riskIndicatorLabel.toLowerCase().includes(q);
    return matchStatus && matchQuery;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
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
              background: "var(--status-warning-bg)",
              color: "var(--status-warning)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShieldAlert size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>
              Referral Fraud Detection &amp; Quality Review Queue ({filtered.length})
            </h3>
            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
              Investigates risk signals cleanly without auto-banning accounts or exposing unnecessary sensitive device identifiers
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/moderation")}
          style={{
            padding: "8px 13px",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            background: "var(--bg-surface-elevated)",
            color: "var(--text-main)",
            fontSize: "0.79rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>Reports &amp; Moderation</span>
          <ExternalLink size={13} />
        </button>
      </div>

      {/* Non-Accusatory Evidence Policy */}
      <div
        style={{
          padding: "11px 14px",
          borderRadius: "11px",
          background: "var(--status-info-bg)",
          color: "var(--text-secondary)",
          fontSize: "0.77rem",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Info size={16} style={{ color: "var(--status-info)", flexShrink: 0 }} />
        <span>
          Shared household, campus, or office Wi-Fi networks do NOT automatically prove fraud. Signals below are presented strictly for human verification and never trigger automated account bans.
        </span>
      </div>

      {/* Filters & Table */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "18px",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {(["all", "pending_review", "under_investigation", "cleared", "rejected", "escalated"] as const).map(
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

          <div style={{ position: "relative" }}>
            <Search
              size={14}
              style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search review ID, referral, user..."
              style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-main)",
                borderRadius: "9px",
                padding: "7px 10px 7px 31px",
                fontSize: "0.79rem",
              }}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: "14px" }}>
          {filtered.map((fc) => {
            const rsk = getRiskLevelMeta(fc.riskLevel);
            const st = getFraudStatusMeta(fc.reviewStatus);

            return (
              <div
                key={fc.id}
                style={{
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  padding: "15px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--primary)" }}>
                      {fc.id} • Referral {fc.referralId}
                    </span>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <Badge variant={rsk.variant} size="sm">{rsk.label}</Badge>
                      <Badge variant={st.variant} size="sm">{st.label}</Badge>
                    </div>
                  </div>

                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-main)", marginBottom: "6px" }}>
                    {fc.riskIndicatorLabel}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <img src={fc.referrerAvatar} alt={fc.referrerName} style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }} />
                    <div style={{ fontSize: "0.76rem", color: "var(--text-secondary)" }}>
                      <strong>{fc.referrerName}</strong> ({fc.referralCode}) -&gt; <strong>{fc.referredUserName}</strong>
                    </div>
                  </div>

                  <div style={{ padding: "9px 11px", borderRadius: "9px", background: "var(--bg-card)", border: "1px solid var(--border-light)", fontSize: "0.76rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                    <div>{fc.reasonFlagged}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "5px" }}>
                      Flagged: {formatDateTime(fc.detectedAt)} • Assigned: <strong>{fc.assignedAdmin || "Unassigned"}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                  {permissions.canAssignInvestigations && (
                    <button
                      type="button"
                      onClick={() => onAssignToMe(fc.id)}
                      style={{
                        padding: "7px 10px",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        background: "var(--bg-card)",
                        color: "var(--text-main)",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <UserCheck size={13} />
                      <span>Assign to Me</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onOpenFraudModal(fc)}
                    style={{
                      flex: 1,
                      padding: "7px 10px",
                      borderRadius: "8px",
                      border: "none",
                      background: "var(--primary)",
                      color: "#fff",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {permissions.canReviewFraudAlerts ? "Investigate & Take Action" : "Inspect Review"}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/users?userId=${encodeURIComponent(fc.referrerId)}`)}
                    style={{
                      padding: "7px 9px",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "var(--bg-card)",
                      color: "var(--text-secondary)",
                      fontSize: "0.74rem",
                      cursor: "pointer",
                    }}
                    title="View Referrer in User Management"
                  >
                    <ExternalLink size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

