import React, { useState } from "react";
import { Clock, UserX } from "lucide-react";
import { MOCK_REPORTS } from "../data/adminMockData";
import type { ModerationReport } from "../data/adminMockData";
import { Badge } from "../components/common/Badge";

export const ReportsModerationPage: React.FC = () => {
  const [reports, setReports] = useState<ModerationReport[]>(MOCK_REPORTS);
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [toast, setToast] = useState<string | null>(null);

  const filtered = reports.filter((r) => filterSeverity === "all" || r.severity === filterSeverity);

  const handleAction = (id: string, actionMsg: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    setToast(actionMsg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-main)" }}>
            Reports & Moderation
          </h2>
          <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
            Investigate community flags, impersonation notices, scam reports, and enforcement actions.
          </p>
        </div>

        {toast && (
          <div
            className="animate-scale-up"
            style={{
              padding: "8px 16px",
              backgroundColor: "var(--status-success-bg)",
              border: "1px solid var(--status-success)",
              borderRadius: "10px",
              color: "var(--status-success)",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            {toast}
          </div>
        )}
      </div>

      {/* Severity Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {["all", "critical", "high", "medium", "low"].map((sev) => (
          <button
            key={sev}
            type="button"
            onClick={() => setFilterSeverity(sev)}
            style={{
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid",
              borderColor: filterSeverity === sev ? "var(--primary)" : "var(--border)",
              backgroundColor: filterSeverity === sev ? "var(--bg-active)" : "var(--bg-surface)",
              color: filterSeverity === sev ? "var(--primary)" : "var(--text-secondary)",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {sev} Priority
          </button>
        ))}
      </div>

      {/* Reports Queue */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", color: "var(--text-secondary)" }}>
            No reports matching this priority tier!
          </div>
        ) : (
          filtered.map((rep) => (
            <div
              key={rep.id}
              style={{
                padding: "20px",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Badge variant={rep.severity === "critical" || rep.severity === "high" ? "error" : "warning"}>
                    {rep.severity.toUpperCase()}
                  </Badge>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)" }}>
                    Report #{rep.id} • {rep.reportType.replace("_", " ")}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-muted)" }}>
                  <Clock size={13} /> {rep.createdAt}
                </div>
              </div>

              <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                <img
                  src={rep.reportedUser.avatar}
                  alt={rep.reportedUser.name}
                  style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)" }}>
                    Target: {rep.reportedUser.name} ({rep.reportedUser.email})
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    Reporter: {rep.reporter.name} (ID: {rep.reporter.id})
                  </div>
                </div>
              </div>

              <p style={{ fontSize: "13.5px", color: "var(--text-main)", backgroundColor: "var(--bg-surface-elevated)", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--border-light)" }}>
                <strong>Reported Reason:</strong> {rep.reason}
              </p>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => handleAction(rep.id, `User ${rep.reportedUser.name} has been banned.`)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: "1px solid var(--status-error)",
                    backgroundColor: "var(--status-error-bg)",
                    color: "var(--status-error)",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  <UserX size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                  Ban User
                </button>
                <button
                  type="button"
                  onClick={() => handleAction(rep.id, `Warning issued to ${rep.reportedUser.name}.`)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: "1px solid var(--status-warning)",
                    backgroundColor: "var(--status-warning-bg)",
                    color: "var(--status-warning)",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Issue Formal Warning
                </button>
                <button
                  type="button"
                  onClick={() => handleAction(rep.id, `Report #${rep.id} marked as dismissed.`)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--bg-surface)",
                    color: "var(--text-secondary)",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
