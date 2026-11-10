// NobleBond Admin — Refund & Dispute Review Modal
// Allows reviewing requests, adding staff notes, approving/rejecting in demo mode with mandatory justification. Zero emojis.

import React, { useState } from "react";
import {
  X,
  RotateCcw,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
} from "lucide-react";
import type {
  SubscriptionRefundDisputeRecord,
  AdminRolePermissions,
} from "../../../types/subscriptionManagement.types";
import { Badge } from "../../common/Badge";
import {
  formatMoney,
  formatDateTime,
  getRefundStatusMeta,
  getPaymentProviderLabel,
} from "../subscriptionUiUtils";

interface RefundDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: SubscriptionRefundDisputeRecord | null;
  permissions: AdminRolePermissions;
  onProcessDecision: (
    refundId: string,
    decision: "approved" | "rejected" | "under_review",
    notes: string
  ) => void;
  onAddNote: (refundId: string, text: string) => void;
}

export const RefundDisputeModal: React.FC<RefundDisputeModalProps> = ({
  isOpen,
  onClose,
  record,
  permissions,
  onProcessDecision,
  onAddNote,
}) => {
  const [decisionNotes, setDecisionNotes] = useState("");
  const [internalNoteText, setInternalNoteText] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !record) return null;

  const statusMeta = getRefundStatusMeta(record.status);
  const canProcess =
    permissions.canProcessRefunds &&
    record.status !== "completed" &&
    record.status !== "approved" &&
    record.status !== "rejected";

  const handleDecision = (decision: "approved" | "rejected" | "under_review") => {
    setErrorMsg(null);
    if (!decisionNotes.trim()) {
      setErrorMsg("Enter a clear administrative justification note before recording a decision.");
      return;
    }
    onProcessDecision(record.id, decision, decisionNotes.trim());
    setDecisionNotes("");
    onClose();
  };

  const handleSaveInternalNote = () => {
    if (!internalNoteText.trim()) return;
    onAddNote(record.id, internalNoteText.trim());
    setInternalNoteText("");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        className="animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "660px",
          maxHeight: "90vh",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid var(--border)",
            backgroundColor: "var(--bg-surface-elevated)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <RotateCcw size={20} color="var(--primary)" />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h2 style={{ fontSize: "16.5px", fontWeight: 800, color: "var(--text-main)", margin: 0 }}>
                  {record.recordKind === "payment_dispute" ? "Payment Dispute" : "Refund Case"} {record.id}
                </h2>
                <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
              </div>
              <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                Transaction: {record.transactionId} &bull; Subscription: {record.subscriptionId}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: "20px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Important Disclosure */}
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              backgroundColor: "var(--status-warning-bg)",
              border: "1px solid rgba(217, 119, 6, 0.3)",
              display: "flex",
              gap: "8px",
              fontSize: "12px",
              color: "var(--text-main)",
            }}
          >
            <ShieldAlert size={15} color="var(--status-warning)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <strong>Demonstration Workflow Disclosure:</strong> Local approval updates demonstration UI state and audit logs only. Real financial refunds must be triggered via Apple App Store, Google Play Console, Stripe, or PayPal settlements.
            </div>
          </div>

          {/* Member & Case Summary */}
          <div
            style={{
              padding: "14px",
              borderRadius: "12px",
              backgroundColor: "var(--bg-surface-elevated)",
              border: "1px solid var(--border)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: "12px",
              fontSize: "12.5px",
            }}
          >
            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Subscriber</div>
              <div style={{ fontWeight: 700 }}>{record.userName} ({record.username})</div>
            </div>
            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Plan</div>
              <div style={{ fontWeight: 600 }}>{record.planName}</div>
            </div>
            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Original / Requested</div>
              <div style={{ fontWeight: 800, color: "var(--status-error)" }}>
                {formatMoney(record.requestedAmount, record.currencySymbol)} / {formatMoney(record.originalAmount, record.currencySymbol)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Provider & Ref</div>
              <div style={{ fontWeight: 600 }}>
                {getPaymentProviderLabel(record.paymentProvider)} ({record.providerReference})
              </div>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Submitted Reason</div>
              <div style={{ color: "var(--text-main)", marginTop: "2px" }}>{record.reason}</div>
            </div>
          </div>

          {/* Refund Timeline */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Refund Timeline
            </div>
            {record.timeline.map((t) => (
              <div key={t.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", paddingLeft: "10px", borderLeft: "2px solid var(--primary)" }}>
                <span>
                  <strong style={{ color: "var(--text-main)" }}>{t.label}</strong> &mdash; {t.actor}
                </span>
                <span style={{ color: "var(--text-muted)" }}>{formatDateTime(t.timestamp)}</span>
              </div>
            ))}
          </div>

          {/* Internal Staff Notes */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Internal Notes ({record.internalNotes.length})
            </div>
            {record.internalNotes.map((n) => (
              <div key={n.id} style={{ padding: "9px 12px", borderRadius: "9px", backgroundColor: "var(--bg-app)", border: "1px solid var(--border-light)", fontSize: "12px" }}>
                <div style={{ fontWeight: 700, color: "var(--text-main)" }}>
                  {n.author} <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>&bull; {formatDateTime(n.timestamp)}</span>
                </div>
                <div style={{ color: "var(--text-secondary)", marginTop: "2px" }}>{n.text}</div>
              </div>
            ))}

            {permissions.canReviewRefunds && (
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  value={internalNoteText}
                  onChange={(e) => setInternalNoteText(e.target.value)}
                  placeholder="Add an internal investigation note..."
                  style={{
                    flex: 1,
                    padding: "8px 10px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--bg-surface-elevated)",
                    color: "var(--text-main)",
                    fontSize: "12px",
                  }}
                />
                <button
                  type="button"
                  onClick={handleSaveInternalNote}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--bg-surface)",
                    color: "var(--text-main)",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Plus size={13} /> Add Note
                </button>
              </div>
            )}
          </div>

          {/* Decision Area */}
          {canProcess && (
            <div style={{ padding: "14px", borderRadius: "12px", border: "1px solid var(--border)", backgroundColor: "var(--bg-app)", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "var(--text-main)" }}>
                Record Administrative Refund Decision (Demo)
              </div>
              {errorMsg && (
                <div style={{ fontSize: "12px", color: "var(--status-error)", fontWeight: 600 }}>{errorMsg}</div>
              )}
              <textarea
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
                rows={2}
                placeholder="Enter justification reason for approving, escalating to under review, or rejecting..."
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-main)",
                  fontSize: "12.5px",
                  resize: "none",
                }}
              />
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => handleDecision("under_review")}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--status-info-bg)",
                    color: "var(--status-info)",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <Clock size={13} /> Mark Under Review
                </button>
                <button
                  type="button"
                  onClick={() => handleDecision("rejected")}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(201, 54, 79, 0.35)",
                    backgroundColor: "var(--status-error-bg)",
                    color: "var(--status-error)",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <XCircle size={13} /> Reject Refund
                </button>
                <button
                  type="button"
                  onClick={() => handleDecision("approved")}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "var(--status-success)",
                    color: "#FFFFFF",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <CheckCircle2 size={13} /> Approve Refund (Demo)
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: "14px 24px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 18px",
              borderRadius: "9px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-main)",
              fontSize: "12.5px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Close Case
          </button>
        </div>
      </div>
    </div>
  );
};

