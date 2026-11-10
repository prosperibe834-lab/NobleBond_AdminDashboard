import React from "react";
import { useNavigate } from "react-router-dom";
import { X, ExternalLink, Lock } from "lucide-react";
import type {
  SupportRolePermissions,
  SupportTicketRecord,
} from "../../../types/supportManagement.types";
import type { SupportCustomerDirectoryItem } from "../../../data/supportManagementDataService";
import { Badge } from "../../common/Badge";
import { formatDateTime, formatShortDate, getTicketStatusMeta } from "../supportUiUtils";

interface CustomerSupportProfileDrawerProps {
  customer: SupportCustomerDirectoryItem | null;
  allTickets: SupportTicketRecord[];
  permissions: SupportRolePermissions;
  onClose: () => void;
  onOpenTicketInInbox: (ticketId: string) => void;
}

export const CustomerSupportProfileDrawer: React.FC<
  CustomerSupportProfileDrawerProps
> = ({
  customer,
  allTickets,
  permissions,
  onClose,
  onOpenTicketInInbox,
}) => {
  const navigate = useNavigate();
  if (!customer) return null;

  const customerTickets = allTickets.filter(
    (t) =>
      t.customerUserId === customer.userId ||
      t.customerName.toLowerCase() === customer.name.toLowerCase()
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 97,
        background: "rgba(0, 0, 0, 0.56)",
        display: "flex",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "460px",
          height: "100%",
          background: "var(--bg-card)",
          borderLeft: "1px solid var(--border)",
          padding: "22px",
          overflowY: "auto",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src={customer.avatar} alt={customer.name} style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover" }} />
              <div>
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>
                  {customer.name}
                </h3>
                <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                  {customer.username} • {customer.country}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{ background: "var(--bg-surface-elevated)", border: "1px solid var(--border)", color: "var(--text-secondary)", borderRadius: "8px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ padding: "12px", borderRadius: "12px", background: "var(--bg-surface-elevated)", fontSize: "0.8rem", display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Email:</span>
              <strong style={{ color: "var(--text-main)" }}>
                {permissions.canViewCustomerDetails ? customer.email : "Restricted"}
              </strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Registered:</span>
              <span>{formatShortDate(customer.registrationDate)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Account Status:</span>
              <Badge variant={customer.accountStatus === "active" || customer.accountStatus === "online" ? "success" : "warning"} size="sm">
                {customer.accountStatus.toUpperCase()}
              </Badge>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Subscription:</span>
              <strong>{customer.subscriptionPlan}</strong>
            </div>
          </div>

          {permissions.canViewTransactionRefs ? (
            <div style={{ padding: "12px", borderRadius: "12px", background: "var(--bg-surface-elevated)", fontSize: "0.8rem", display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "0.71rem", color: "var(--text-muted)" }}>Gift Coins Wallet</div>
                <strong style={{ color: "var(--accent-champagne)" }}>{customer.giftCoinsBalance} Coins</strong>
              </div>
              <div>
                <div style={{ fontSize: "0.71rem", color: "var(--text-muted)" }}>Connection Points</div>
                <strong style={{ color: "var(--accent-lavender)" }}>{customer.connectionPointsBalance} Pts</strong>
              </div>
            </div>
          ) : (
            <div style={{ padding: "10px", borderRadius: "10px", background: "var(--status-warning-bg)", color: "var(--status-warning)", fontSize: "0.76rem", display: "flex", alignItems: "center", gap: "6px" }}>
              <Lock size={14} />
              <span>Wallet &amp; financial details restricted by current role permissions.</span>
            </div>
          )}

          <div>
            <div style={{ fontWeight: 700, fontSize: "0.86rem", color: "var(--text-main)", marginBottom: "8px" }}>
              Support Ticket History ({customerTickets.length})
            </div>
            {customerTickets.length === 0 ? (
              <div style={{ padding: "18px", borderRadius: "11px", background: "var(--bg-surface-elevated)", color: "var(--text-muted)", fontSize: "0.8rem", textAlign: "center" }}>
                No support tickets filed by this member.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {customerTickets.map((t) => {
                  const st = getTicketStatusMeta(t.status);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenTicketInInbox(t.id);
                      }}
                      style={{ textAlign: "left", padding: "10px 12px", borderRadius: "10px", border: "1px solid var(--border-light)", background: "var(--bg-surface-elevated)", cursor: "pointer" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                        <span style={{ fontWeight: 700, color: "var(--primary)", fontSize: "0.76rem" }}>{t.id}</span>
                        <Badge variant={st.variant} size="sm">{st.label}</Badge>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: "0.8rem", color: "var(--text-main)" }}>{t.subject}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>
                        {t.category} • {formatDateTime(t.lastActivityAt)}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            onClose();
            navigate(`/users?userId=${encodeURIComponent(customer.userId)}`);
          }}
          style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "none", background: "var(--primary)", color: "#fff", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
        >
          <span>Open Full Member Profile in User Management</span>
          <ExternalLink size={13} />
        </button>
      </div>
    </div>
  );
};

