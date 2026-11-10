import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import type { SupportTicketRecord } from "../../../types/supportManagement.types";

interface EscalateTicketModalProps {
  ticket: SupportTicketRecord;
  onCancel: () => void;
  onConfirmEscalate: (params: {
    ticketId: string;
    escalatedTo: string;
    targetModule: string;
    reason: string;
  }) => void;
}

const TARGET_SPECIALISTS = [
  {
    specialist: "Sarah Alexander (Wallet & Billing Finance)",
    module: "Wallet & Financial Management",
  },
  {
    specialist: "Sarah Alexander (Subscription & Billing Finance)",
    module: "Subscription Management",
  },
  {
    specialist: "Elena Vance (Growth & Referral Operations)",
    module: "Referral Management",
  },
  {
    specialist: "Head of Safety David (Reports & Moderation)",
    module: "Reports & Moderation",
  },
  {
    specialist: "Moderator Alex (Messaging & Calls QA)",
    module: "Chat Management",
  },
  {
    specialist: "Moderator Alex (Live Streaming Operations)",
    module: "Live Management",
  },
];

export const EscalateTicketModal: React.FC<EscalateTicketModalProps> = ({
  ticket,
  onCancel,
  onConfirmEscalate,
}) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [reason, setReason] = useState("");

  const chosen = TARGET_SPECIALISTS[selectedIdx] || TARGET_SPECIALISTS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim().length < 5) return;
    onConfirmEscalate({
      ticketId: ticket.id,
      escalatedTo: chosen.specialist,
      targetModule: chosen.module,
      reason: reason.trim(),
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 105,
        background: "rgba(0, 0, 0, 0.62)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onCancel}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "470px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "18px",
          padding: "22px",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
          gap: "13px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertTriangle size={20} style={{ color: "var(--status-warning)" }} />
            <h3 style={{ margin: 0, fontSize: "1.02rem", color: "var(--text-main)" }}>
              Escalate Support Ticket {ticket.id}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: "10px 12px", borderRadius: "10px", background: "var(--bg-surface-elevated)", fontSize: "0.79rem", color: "var(--text-secondary)" }}>
          <strong>Subject:</strong> {ticket.subject}
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "3px" }}>
            Routing escalations creates a specialist tracking record and preserves links to the specialized module.
          </div>
        </div>

        <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-main)" }}>
          Escalate To Specialist &amp; Module
          <select
            value={selectedIdx}
            onChange={(e) => setSelectedIdx(Number(e.target.value))}
            style={{ padding: "9px 10px", borderRadius: "9px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)", fontSize: "0.82rem" }}
          >
            {TARGET_SPECIALISTS.map((item, idx) => (
              <option key={item.module} value={idx}>
                {item.specialist} — [{item.module}]
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-main)" }}>
          Mandatory Escalation Justification
          <textarea
            rows={3}
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe exact billing, security, or technical issue for the specialist..."
            style={{ padding: "9px 10px", borderRadius: "9px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)", fontSize: "0.81rem" }}
          />
        </label>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={onCancel}
            style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)", fontWeight: 600, cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: "var(--status-warning)", color: "#fff", fontWeight: 700, cursor: "pointer" }}
          >
            Confirm Escalation
          </button>
        </div>
      </form>
    </div>
  );
};

