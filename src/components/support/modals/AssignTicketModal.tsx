import React from "react";
import { UserPlus, X } from "lucide-react";
import type {
  SupportAgentRecord,
  SupportTicketRecord,
} from "../../../types/supportManagement.types";
import { Badge } from "../../common/Badge";

interface AssignTicketModalProps {
  ticket: SupportTicketRecord;
  agents: SupportAgentRecord[];
  allTickets: SupportTicketRecord[];
  onClose: () => void;
  onSelectAgent: (
    ticketId: string,
    agentId: string | null,
    agentName: string
  ) => void;
}

export const AssignTicketModal: React.FC<AssignTicketModalProps> = ({
  ticket,
  agents,
  allTickets,
  onClose,
  onSelectAgent,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 105,
        background: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "18px",
          padding: "22px",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <UserPlus size={19} style={{ color: "var(--primary)" }} />
            <h3 style={{ margin: 0, fontSize: "1.02rem", color: "var(--text-main)" }}>
              Assign Support Ticket {ticket.id}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
          Current Assignment: <strong>{ticket.assignedAgentName}</strong>. Choose an existing support team member below (workload calculated live from open queue):
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "340px", overflowY: "auto" }}>
          {agents.map((ag) => {
            const openCount = allTickets.filter(
              (t) =>
                t.assignedAgentId === ag.id &&
                t.status !== "resolved" &&
                t.status !== "closed"
            ).length;
            const isCurr = ticket.assignedAgentId === ag.id;

            return (
              <button
                key={ag.id}
                type="button"
                onClick={() => onSelectAgent(ticket.id, ag.id, ag.name)}
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  borderRadius: "11px",
                  border: isCurr ? "1px solid var(--primary)" : "1px solid var(--border-light)",
                  background: isCurr ? "var(--primary-glow)" : "var(--bg-surface-elevated)",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "var(--primary)", color: "#fff", fontWeight: 700, fontSize: "0.78rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {ag.avatarInitials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-main)" }}>{ag.name}</div>
                    <div style={{ fontSize: "0.71rem", color: "var(--text-muted)" }}>{ag.roleTitle}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Badge variant={ag.queueStatus === "accepting_tickets" ? "success" : "warning"} size="sm">
                    {openCount} Open
                  </Badge>
                  <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    {ag.queueStatus.replace("_", " ")}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onSelectAgent(ticket.id, null, "Unassigned")}
          style={{
            padding: "8px 12px",
            borderRadius: "9px",
            border: "1px solid var(--border)",
            background: "var(--bg-surface-elevated)",
            color: "var(--text-secondary)",
            fontSize: "0.79rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Return to Unassigned Triage Queue
        </button>
      </div>
    </div>
  );
};

