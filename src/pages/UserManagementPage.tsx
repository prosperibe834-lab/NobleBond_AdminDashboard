import React, { useState } from "react";
import {
  Search,
  CheckCircle2,
} from "lucide-react";
import { MOCK_USERS } from "../data/adminMockData";
import type { AdminUser } from "../data/adminMockData";
import { Badge } from "../components/common/Badge";

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (userId: string, newStatus: AdminUser["status"], msg: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-main)" }}>
            User Management
          </h2>
          <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
            Search, verify, inspect and manage accounts across NobleBond's 1.28M members.
          </p>
        </div>

        {actionNotice && (
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
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CheckCircle2 size={16} />
            {actionNotice}
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          flexWrap: "wrap",
          padding: "16px",
          backgroundColor: "var(--bg-card)",
          borderRadius: "14px",
          border: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 14px",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--bg-surface)",
            flex: "1 1 260px",
          }}
        >
          <Search size={16} color="var(--primary)" />
          <input
            type="text"
            placeholder="Search by name, email or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              color: "var(--text-main)",
              width: "100%",
              fontSize: "13.5px",
            }}
          />
        </div>

        {/* Status Filters */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {["all", "active", "suspended", "pending_verification"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              style={{
                padding: "8px 14px",
                borderRadius: "10px",
                border: "1px solid",
                borderColor: statusFilter === st ? "var(--primary)" : "var(--border)",
                backgroundColor: statusFilter === st ? "var(--bg-active)" : "var(--bg-surface)",
                color: statusFilter === st ? "var(--primary)" : "var(--text-secondary)",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Users Data Table */}
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg-surface-elevated)", color: "var(--text-secondary)", fontSize: "12px" }}>
                <th style={{ padding: "12px 16px" }}>USER</th>
                <th style={{ padding: "12px 16px" }}>LOCATION</th>
                <th style={{ padding: "12px 16px" }}>STATUS</th>
                <th style={{ padding: "12px 16px" }}>TIER</th>
                <th style={{ padding: "12px 16px" }}>GIFT COINS</th>
                <th style={{ padding: "12px 16px" }}>POINTS</th>
                <th style={{ padding: "12px 16px" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  style={{ borderBottom: "1px solid var(--border-light)", fontSize: "13px" }}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <img
                        src={user.avatar}
                        alt={user.name}
                        style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: "var(--text-main)", display: "flex", alignItems: "center", gap: "4px" }}>
                          {user.name}
                          {user.isVerified && <CheckCircle2 size={13} color="var(--primary)" />}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--text-secondary)" }}>
                    {user.location}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <Badge variant={user.status === "active" ? "success" : user.status === "suspended" ? "error" : "warning"}>
                      {user.status}
                    </Badge>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {user.isPremium ? (
                      <Badge variant="primary">Premium</Badge>
                    ) : (
                      <Badge variant="neutral">Free</Badge>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px", fontWeight: 700, color: "var(--accent-champagne)" }}>
                    {user.giftCoins.toLocaleString()} Coins
                  </td>
                  <td style={{ padding: "12px 16px", fontWeight: 700, color: "var(--status-success)" }}>
                    ✨ {user.connectionPoints} Pts
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {user.status === "suspended" ? (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(user.id, "active", `Account restored for ${user.name}`)}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "6px",
                            border: "1px solid var(--status-success)",
                            backgroundColor: "var(--status-success-bg)",
                            color: "var(--status-success)",
                            fontSize: "11px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Restore
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(user.id, "suspended", `Account suspended for ${user.name}`)}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "6px",
                            border: "1px solid var(--status-error)",
                            backgroundColor: "var(--status-error-bg)",
                            color: "var(--status-error)",
                            fontSize: "11px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Suspend
                        </button>
                      )}
                      {!user.isVerified && (
                        <button
                          type="button"
                          onClick={() => {
                            setUsers((prev) =>
                              prev.map((u) => (u.id === user.id ? { ...u, isVerified: true, status: "active" } : u))
                            );
                            setActionNotice(`Verified badge granted to ${user.name}`);
                            setTimeout(() => setActionNotice(null), 3000);
                          }}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "6px",
                            border: "1px solid var(--primary)",
                            backgroundColor: "var(--bg-active)",
                            color: "var(--primary)",
                            fontSize: "11px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Verify
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
