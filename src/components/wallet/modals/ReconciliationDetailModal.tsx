import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import type {
  ReconciliationCaseRecord,
  ReconciliationStatus,
} from "../../../types/walletManagement.types";
import { Badge } from "../../common/Badge";
import { formatDateTime, getCategoryMeta } from "../walletUiUtils";

interface ReconciliationDetailModalProps {
  record: ReconciliationCaseRecord | null;
  canUpdate: boolean;
  onClose: () => void;
  onSaveStatus: (
    caseId: string,
    newStatus: ReconciliationStatus,
    notes: string
  ) => void;
}

export const ReconciliationDetailModal: React.FC<
  ReconciliationDetailModalProps
> = ({ record, canUpdate, onClose, onSaveStatus }) => {
  const [status, setStatus] = useState<ReconciliationStatus>(
    record?.status || "pending_review"
  );
  const [notes, setNotes] = useState<string>(record?.investigationNotes || "");

  if (!record) return null;

  const cat = getCategoryMeta(record.category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canUpdate) return;
    onSaveStatus(record.id, status, notes.trim() || "Reconciliation review updated");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0, 0, 0, 0.62)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "510px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "18px",
          padding: "22px",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertTriangle size={19} style={{ color: "var(--status-warning)" }} />
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)" }}>{record.id}</div>
              <h3 style={{ margin: 0, fontSize: "1.02rem", fontWeight: 700, color: "var(--text-main)" }}>
                Reconciliation Investigation
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
          >
            <X size={18} />
          </button>
        </div>

        <div
          style={{
            padding: "12px",
            borderRadius: "12px",
            background: "var(--bg-surface-elevated)",
            border: "1px solid var(--border-light)",
            fontSize: "0.82rem",
            display: "flex",
            flexDirection: "column",
            gap: "7px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--text-muted)" }}>Domain</span>
            <Badge variant={cat.variant} size="sm">{cat.label}</Badge>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-muted)" }}>Transaction Reference</span>
            <strong style={{ color: "var(--text-main)" }}>{record.transactionRef}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-muted)" }}>Detected At</span>
            <span style={{ color: "var(--text-secondary)" }}>{formatDateTime(record.detectedAt)}</span>
          </div>
          <div style={{ paddingTop: "6px", borderTop: "1px solid var(--border-light)" }}>
            <div style={{ color: "var(--text-muted)", fontSize: "0.74rem" }}>Expected Result</div>
            <div style={{ color: "var(--text-main)", fontWeight: 600 }}>{record.expectedResult}</div>
          </div>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.74rem" }}>Actual Observed Ledger State</div>
            <div style={{ color: "var(--status-error)", fontWeight: 600 }}>{record.actualResult}</div>
          </div>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.74rem" }}>Discrepancy Summary</div>
            <div style={{ color: "var(--text-secondary)" }}>{record.differenceSummary}</div>
          </div>
        </div>

        <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-main)" }}>
          Update Case Resolution Status
          <select
            disabled={!canUpdate}
            value={status}
            onChange={(e) => setStatus(e.target.value as ReconciliationStatus)}
            style={{
              padding: "9px 10px",
              borderRadius: "9px",
              border: "1px solid var(--border)",
              background: "var(--bg-surface-elevated)",
              color: "var(--text-main)",
              fontSize: "0.84rem",
            }}
          >
            <option value="pending_review">Pending Review</option>
            <option value="mismatch">Mismatch Confirmed</option>
            <option value="escalated">Escalated to Engineering / PSP</option>
            <option value="resolved">Resolved (Ledger Corrected)</option>
            <option value="matched">Matched (False Positive)</option>
          </select>
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-main)" }}>
          Investigation & Audit Notes
          <textarea
            rows={3}
            disabled={!canUpdate}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Record webhook verification, support ticket, or PSP settlement ID..."
            style={{
              padding: "9px 10px",
              borderRadius: "9px",
              border: "1px solid var(--border)",
              background: "var(--bg-surface-elevated)",
              color: "var(--text-main)",
              fontSize: "0.82rem",
              resize: "vertical",
            }}
          />
        </label>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--bg-surface-elevated)",
              color: "var(--text-main)",
              fontSize: "0.83rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Close
          </button>
          {canUpdate && (
            <button
              type="submit"
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "10px",
                border: "none",
                background: "var(--primary)",
                color: "#fff",
                fontSize: "0.83rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Save Reconciliation Status
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

