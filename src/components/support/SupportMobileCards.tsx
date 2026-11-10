import React from "react";
import type {
  SupportProgramSettings,
  SupportTicketRecord,
} from "../../types/supportManagement.types";
import { Badge } from "../common/Badge";
import {
  evaluateTicketSlaStatus,
  formatDateTime,
  getPriorityMeta,
  getTicketStatusMeta,
} from "./supportUiUtils";

interface SupportMobileCardsProps {
  tickets: SupportTicketRecord[];
  settings: SupportProgramSettings;
  onInspectTicket: (ticket: SupportTicketRecord) => void;
  onOpenInInbox: (ticketId: string) => void;
}

export const SupportMobileCards: React.FC<SupportMobileCardsProps> = ({
  tickets,
  settings,
  onInspectTicket,
  onOpenInInbox,
}) => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "12px" }}>
      {tickets.map((t) => {
        const st = getTicketStatusMeta(t.status);
        const pr = getPriorityMeta(t.priority);
        const sla = evaluateTicketSlaStatus(t, settings);

        return (
          <div
            key={t.id}
            style={{
              background: "var(--bg-surface-elevated)",
              border: sla.isOverdue ? "1px solid rgba(239, 68, 68, 0.45)" : "1px solid var(--border)",
              borderRadius: "14px",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                <span style={{ fontWeight: 700, fontSize: "0.78rem", color: "var(--primary)" }}>
                  {t.id} {t.unreadBySupport ? "• UNREAD" : ""}
                </span>
                <div style={{ display: "flex", gap: "5px" }}>
                  <Badge variant={pr.variant} size="sm">{pr.label}</Badge>
                  <Badge variant={st.variant} size="sm">{st.label}</Badge>
                </div>
              </div>

              <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text-main)", lineHeight: 1.35, marginBottom: "8px" }}>
                {t.subject}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <img src={t.customerAvatar} alt={t.customerName} style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }} />
                <div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-main)" }}>{t.customerName}</div>
                  <div style={{ fontSize: "0.71rem", color: "var(--text-muted)" }}>
                    {t.category} • {t.source}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: "0.72rem", color: sla.isOverdue ? "var(--status-error)" : "var(--text-muted)" }}>
                Agent: <strong>{t.assignedAgentName}</strong> • {sla.summary}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>
                Updated: {formatDateTime(t.lastActivityAt)}
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", paddingTop: "8px", borderTop: "1px solid var(--border-light)" }}>
              <button
                type="button"
                onClick={() => onOpenInInbox(t.id)}
                style={{
                  flex: 1,
                  padding: "7px 10px",
                  borderRadius: "8px",
                  border: "none",
                  background: "var(--primary)",
                  color: "#fff",
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Open Inbox
              </button>
              <button
                type="button"
                onClick={() => onInspectTicket(t)}
                style={{
                  padding: "7px 10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-card)",
                  color: "var(--text-main)",
                  fontSize: "0.76rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Dossier
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

