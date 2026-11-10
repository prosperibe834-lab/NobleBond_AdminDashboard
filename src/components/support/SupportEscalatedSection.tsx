import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ExternalLink, CheckCircle2, Eye } from "lucide-react";
import type {
  SupportRolePermissions,
  SupportTicketRecord,
} from "../../types/supportManagement.types";
import { Badge } from "../common/Badge";
import { formatDateTime, getPriorityMeta } from "./supportUiUtils";

interface SupportEscalatedSectionProps {
  tickets: SupportTicketRecord[];
  permissions: SupportRolePermissions;
  onInspectTicket: (ticket: SupportTicketRecord) => void;
  onOpenInInbox: (ticketId: string) => void;
  onUpdateEscalationReview: (
    ticketId: string,
    reviewStatus: "in_review" | "resolved"
  ) => void;
}

export const SupportEscalatedSection: React.FC<SupportEscalatedSectionProps> = ({
  tickets,
  permissions,
  onInspectTicket,
  onOpenInInbox,
  onUpdateEscalationReview,
}) => {
  const navigate = useNavigate();
  const escalated = tickets.filter((t) => t.status === "escalated" || Boolean(t.escalationInfo));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
          <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "var(--status-warning-bg)", color: "var(--status-warning)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AlertTriangle size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>
              Escalated Support Cases ({escalated.length})
            </h3>
            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
              Cross-team specialist escalations routed directly to Wallet, Subscriptions, Referrals, Moderation, Live &amp; Chat teams without replacing them
            </div>
          </div>
        </div>
      </div>

      {escalated.length === 0 ? (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "40px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.86rem" }}>
          No tickets are currently escalated.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "14px" }}>
          {escalated.map((t) => {
            const pr = getPriorityMeta(t.priority);
            const esc = t.escalationInfo;
            const escVariant =
              esc?.reviewStatus === "resolved"
                ? "success"
                : esc?.reviewStatus === "in_review"
                ? "info"
                : "warning";

            return (
              <div
                key={t.id}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "15px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--primary)" }}>{t.id} • {t.category}</span>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <Badge variant={pr.variant} size="sm">{pr.label}</Badge>
                      <Badge variant={escVariant} size="sm">
                        {(esc?.reviewStatus || "pending_review").replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--text-main)", marginBottom: "6px" }}>
                    {t.subject}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "9px" }}>
                    Customer: <strong>{t.customerName}</strong> • Agent: {t.assignedAgentName}
                  </div>

                  {esc && (
                    <div style={{ padding: "10px 12px", borderRadius: "10px", background: "var(--bg-surface-elevated)", fontSize: "0.77rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                      <div><strong>Escalated To:</strong> {esc.escalatedTo}</div>
                      <div><strong>Specialist Domain:</strong> {esc.escalationTargetModule}</div>
                      <div style={{ marginTop: "4px" }}>{esc.reason}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "5px" }}>
                        By {esc.escalatedBy} • {formatDateTime(esc.escalatedAt)}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                  <button
                    type="button"
                    onClick={() => onOpenInInbox(t.id)}
                    style={{ padding: "7px 11px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                  >
                    Inbox
                  </button>
                  <button
                    type="button"
                    onClick={() => onInspectTicket(t)}
                    style={{ padding: "7px 11px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                  >
                    Dossier
                  </button>

                  {t.relatedModuleRoute && (
                    <button
                      type="button"
                      onClick={() => navigate(t.relatedModuleRoute!)}
                      style={{ padding: "7px 10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--primary)", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
                    >
                      <span>{t.relatedModuleRoute.replace("/", "").toUpperCase()}</span>
                      <ExternalLink size={11} />
                    </button>
                  )}

                  {permissions.canEscalateTickets && esc?.reviewStatus === "pending_review" && (
                    <button
                      type="button"
                      onClick={() => onUpdateEscalationReview(t.id, "in_review")}
                      style={{ flex: 1, padding: "7px 10px", borderRadius: "8px", border: "none", background: "var(--status-info)", color: "#fff", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "4px" }}
                    >
                      <Eye size={13} />
                      <span>Mark In Review</span>
                    </button>
                  )}

                  {permissions.canResolveTickets && esc?.reviewStatus !== "resolved" && (
                    <button
                      type="button"
                      onClick={() => onUpdateEscalationReview(t.id, "resolved")}
                      style={{ flex: 1, padding: "7px 10px", borderRadius: "8px", border: "none", background: "var(--status-success)", color: "#fff", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "4px" }}
                    >
                      <CheckCircle2 size={13} />
                      <span>Resolve Escalation</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

