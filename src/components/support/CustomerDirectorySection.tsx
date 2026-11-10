import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Search, ExternalLink } from "lucide-react";
import type { SupportRolePermissions } from "../../types/supportManagement.types";
import type { SupportCustomerDirectoryItem } from "../../data/supportManagementDataService";
import { Badge } from "../common/Badge";
import { formatDateTime } from "./supportUiUtils";

interface CustomerDirectorySectionProps {
  customers: SupportCustomerDirectoryItem[];
  permissions: SupportRolePermissions;
  onInspectCustomer: (customer: SupportCustomerDirectoryItem) => void;
}

export const CustomerDirectorySection: React.FC<CustomerDirectorySectionProps> = ({
  customers,
  permissions,
  onInspectCustomer,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketFilter, setTicketFilter] = useState<"all" | "with_tickets" | "open_tickets">("all");

  const filtered = customers.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.username.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q);
    const matchTickets =
      ticketFilter === "all" ||
      (ticketFilter === "with_tickets" && c.totalTickets > 0) ||
      (ticketFilter === "open_tickets" && c.openTickets > 0);
    return matchQuery && matchTickets;
  });

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "var(--primary-glow)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Users size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-main)" }}>
              Support Customer Directory ({filtered.length})
            </h3>
            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
              Synchronized directly with User Management records (no duplicate user stores)
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search member, username, email..."
              style={{ background: "var(--bg-surface-elevated)", border: "1px solid var(--border)", color: "var(--text-main)", borderRadius: "9px", padding: "8px 10px 8px 32px", fontSize: "0.8rem", width: "225px" }}
            />
          </div>

          <select
            value={ticketFilter}
            onChange={(e) => setTicketFilter(e.target.value as "all" | "with_tickets" | "open_tickets")}
            style={{ background: "var(--bg-surface-elevated)", border: "1px solid var(--border)", color: "var(--text-main)", borderRadius: "9px", padding: "8px 10px", fontSize: "0.8rem" }}
          >
            <option value="all">All NobleBond Members</option>
            <option value="with_tickets">With Support History</option>
            <option value="open_tickets">With Open Tickets Only</option>
          </select>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.81rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)", textAlign: "left" }}>
              <th style={{ padding: "10px 8px" }}>Member</th>
              <th style={{ padding: "10px 8px" }}>Contact / Geo</th>
              <th style={{ padding: "10px 8px" }}>Account &amp; Verification</th>
              <th style={{ padding: "10px 8px" }}>Tickets (Total / Open)</th>
              <th style={{ padding: "10px 8px" }}>Last Support Activity</th>
              <th style={{ padding: "10px 8px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.userId}
                onClick={() => onInspectCustomer(c)}
                style={{ borderBottom: "1px solid var(--border-light)", cursor: "pointer" }}
              >
                <td style={{ padding: "11px 8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                    <img src={c.avatar} alt={c.name} style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }} />
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{c.name}</div>
                      <div style={{ fontSize: "0.71rem", color: "var(--text-muted)" }}>{c.username}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "11px 8px" }}>
                  <div style={{ color: "var(--text-main)" }}>
                    {permissions.canViewCustomerDetails ? c.email : "Restricted by RBAC"}
                  </div>
                  <div style={{ fontSize: "0.71rem", color: "var(--text-muted)" }}>{c.country}</div>
                </td>
                <td style={{ padding: "11px 8px" }}>
                  <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                    <Badge variant={c.accountStatus === "active" || c.accountStatus === "online" ? "success" : "warning"} size="sm">
                      {c.accountStatus}
                    </Badge>
                    <Badge variant={c.isVerified ? "info" : "neutral"} size="sm">
                      {c.isVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                </td>
                <td style={{ padding: "11px 8px" }}>
                  <span style={{ fontWeight: 700, color: "var(--text-main)" }}>{c.totalTickets} Total</span>
                  <span style={{ marginLeft: "6px", color: c.openTickets > 0 ? "var(--status-warning)" : "var(--text-muted)", fontWeight: 600 }}>
                    ({c.openTickets} Open)
                  </span>
                </td>
                <td style={{ padding: "11px 8px", color: "var(--text-secondary)" }}>{formatDateTime(c.lastActivityAt)}</td>
                <td style={{ padding: "11px 8px", textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onInspectCustomer(c);
                      }}
                      style={{ padding: "5px 9px", borderRadius: "7px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--text-main)", fontSize: "0.74rem", fontWeight: 600, cursor: "pointer" }}
                    >
                      Support Dossier
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/users?userId=${encodeURIComponent(c.userId)}`);
                      }}
                      style={{ padding: "5px 8px", borderRadius: "7px", border: "1px solid var(--border)", background: "var(--bg-surface-elevated)", color: "var(--primary)", fontSize: "0.74rem", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "3px" }}
                      title="Open in User Management"
                    >
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

