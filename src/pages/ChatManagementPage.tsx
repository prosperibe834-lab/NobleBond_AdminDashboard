import React, { useState } from "react";
import { AlertTriangle, Lock } from "lucide-react";
import { Badge } from "../components/common/Badge";

export const ChatManagementPage: React.FC = () => {
  const [reports, setReports] = useState([
    {
      id: "ch_rpt_1",
      threadId: "thr_908",
      reporter: "Sarah James",
      reportedUser: "Alex Vance",
      category: "Harassment & Offensive Language",
      flaggedMessage: '"Hey, why are you not replying? I know where you live..."',
      time: "15m ago",
      status: "pending",
    },
    {
      id: "ch_rpt_2",
      threadId: "thr_332",
      reporter: "Emily Carter",
      reportedUser: "Crypto_Spam_01",
      category: "Commercial Solicitation / Scam",
      flaggedMessage: '"Invest 100 USDT today and receive 500 USDT guaranteed return..."',
      time: "1h ago",
      status: "pending",
    },
  ]);

  const [toast, setToast] = useState<string | null>(null);

  const handleResolve = (id: string, action: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    setToast(action);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-main)" }}>
            Chat Management
          </h2>
          <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
            Privacy-compliant moderation of reported conversations and harassment incidents.
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

      {/* Privacy Notice Banner */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "14px 18px",
          backgroundColor: "rgba(37, 99, 235, 0.08)",
          border: "1px solid rgba(37, 99, 235, 0.25)",
          borderRadius: "14px",
          color: "var(--status-info)",
        }}
      >
        <Lock size={18} />
        <span style={{ fontSize: "13px", lineHeight: 1.4 }}>
          <strong>Admin Privacy Protocol:</strong> Only explicitly reported chat messages are visible to verified moderators. NobleBond end-to-end user privacy is strictly maintained.
        </span>
      </div>

      {/* Flagged Conversation List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {reports.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", color: "var(--text-secondary)" }}>
            All reported conversations have been reviewed and moderated!
          </div>
        ) : (
          reports.map((rpt) => (
            <div
              key={rpt.id}
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
                  <Badge variant="error">
                    <AlertTriangle size={12} /> {rpt.category}
                  </Badge>
                  <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                    Reported by <strong>{rpt.reporter}</strong> against <strong style={{ color: "var(--status-error)" }}>{rpt.reportedUser}</strong>
                  </span>
                </div>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{rpt.time}</span>
              </div>

              {/* Message quote box */}
              <div
                style={{
                  padding: "14px 18px",
                  borderRadius: "12px",
                  backgroundColor: "var(--bg-surface-elevated)",
                  borderLeft: "4px solid var(--status-error)",
                  fontSize: "13.5px",
                  color: "var(--text-main)",
                  fontStyle: "italic",
                }}
              >
                {rpt.flaggedMessage}
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => handleResolve(rpt.id, `Chat restriction applied to ${rpt.reportedUser}`)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "1px solid var(--status-error)",
                    backgroundColor: "var(--status-error-bg)",
                    color: "var(--status-error)",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Mute / Restrict User
                </button>
                <button
                  type="button"
                  onClick={() => handleResolve(rpt.id, `Report dismissed for thread ${rpt.threadId}`)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--bg-surface)",
                    color: "var(--text-secondary)",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Dismiss Report
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
