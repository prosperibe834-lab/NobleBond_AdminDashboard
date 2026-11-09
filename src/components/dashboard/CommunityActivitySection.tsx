import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  ShieldAlert,
  Search,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import type {
  RecentUserRecord,
  RecentMatchRecord,
  ModerationActionItem,
} from "../../types/dashboard.types";
import { Badge } from "../common/Badge";

interface CommunityActivitySectionProps {
  recentUsers: RecentUserRecord[];
  recentMatches: RecentMatchRecord[];
  moderationItems: ModerationActionItem[];
}

export const CommunityActivitySection: React.FC<CommunityActivitySectionProps> = ({
  recentUsers,
  recentMatches,
  moderationItems,
}) => {
  const navigate = useNavigate();
  const [userSearch, setUserSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(false);

  const filteredUsers = recentUsers
    .filter(
      (u) =>
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase())
    )
    .sort((a, b) => (sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
        gap: "20px",
      }}
    >
      {/* 1. RECENTLY REGISTERED USERS TABLE */}
      <div
        style={{
          padding: "22px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "18px",
          boxShadow: "var(--shadow-sm)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
              Recently Joined Members
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
              Latest customer profiles registered across the platform
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/users")}
            style={{
              background: "none",
              border: "none",
              color: "var(--primary)",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            View all 1.28M <ChevronRight size={14} />
          </button>
        </div>

        {/* Search & Sort Controls */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 12px",
              borderRadius: "8px",
              backgroundColor: "var(--bg-surface-elevated)",
              border: "1px solid var(--border)",
              flex: 1,
            }}
          >
            <Search size={14} color="var(--text-secondary)" />
            <input
              type="text"
              placeholder="Filter recent users..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
                color: "var(--text-main)",
                fontSize: "12.5px",
                width: "100%",
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => setSortAsc((prev) => !prev)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "6px 10px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-secondary)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <ArrowUpDown size={13} />
            <span>{sortAsc ? "A-Z" : "Z-A"}</span>
          </button>
        </div>

        {/* Users Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: "11.5px" }}>
                <th style={{ padding: "8px 10px" }}>USER</th>
                <th style={{ padding: "8px 10px" }}>STATUS</th>
                <th style={{ padding: "8px 10px" }}>COMPLETION</th>
                <th style={{ padding: "8px 10px" }}>REGISTERED</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.slice(0, 4).map((user) => (
                <tr
                  key={user.id}
                  onClick={() => navigate("/users")}
                  style={{ borderBottom: "1px solid var(--border-light)", fontSize: "12.5px", cursor: "pointer" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <td style={{ padding: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <img
                        src={user.avatar}
                        alt={user.name}
                        style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: "var(--text-main)", display: "flex", alignItems: "center", gap: "4px" }}>
                          {user.name}
                          {user.isVerified && <CheckCircle2 size={12} color="var(--primary)" />}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                          @{user.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "10px" }}>
                    <Badge variant={user.status === "active" ? "success" : "warning"}>
                      {user.status === "active" ? "Active" : "Unverified"}
                    </Badge>
                  </td>
                  <td style={{ padding: "10px", fontWeight: 700, color: "var(--primary)" }}>
                    {user.profileCompletion}%
                  </td>
                  <td style={{ padding: "10px", color: "var(--text-secondary)" }}>
                    {user.joinedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. RECENT MUTUAL MATCHES FEED */}
      <div
        style={{
          padding: "22px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "18px",
          boxShadow: "var(--shadow-sm)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
              Recent Mutual Matches
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
              Latest dating connections made through bilateral interest
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/matches")}
            style={{
              background: "none",
              border: "none",
              color: "var(--primary)",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            All Matches <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {recentMatches.map((match) => (
            <div
              key={match.id}
              onClick={() => navigate("/matches")}
              style={{
                padding: "12px 14px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-focus)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-light)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {/* Overlapping Avatars */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={match.user1.avatar}
                    alt={match.user1.name}
                    style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--primary)" }}
                  />
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: "var(--primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 -6px",
                      zIndex: 2,
                    }}
                  >
                    <Heart size={10} color="#FFFFFF" fill="#FFFFFF" />
                  </div>
                  <img
                    src={match.user2.avatar}
                    alt={match.user2.name}
                    style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--primary)" }}
                  />
                </div>

                <div>
                  <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)" }}>
                    {match.user1.name} & {match.user2.name}
                  </div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                    Matched {match.matchedAt} • Status: {match.status}
                  </div>
                </div>
              </div>

              <Badge variant="primary">
                <Sparkles size={11} />
                <span>{match.compatibility}% Match</span>
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* 3. MODERATION ACTION CENTRE */}
      <div
        style={{
          gridColumn: "1 / -1",
          padding: "22px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "18px",
          boxShadow: "var(--shadow-sm)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldAlert size={18} color="var(--status-error)" />
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
                Moderation Action Centre
              </h3>
              <Badge variant="error">4 URGENT FLAGS</Badge>
            </div>
            <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
              High-priority flags requiring immediate administrator inspection and safety enforcement
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/moderation")}
            style={{
              padding: "7px 14px",
              borderRadius: "8px",
              border: "1px solid var(--status-error)",
              backgroundColor: "var(--status-error-bg)",
              color: "var(--status-error)",
              fontSize: "12.5px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Review All Reports (18) →
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "14px",
          }}
        >
          {moderationItems.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate("/moderation")}
              style={{
                padding: "14px 16px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-focus)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-light)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Badge variant={item.priority === "critical" || item.priority === "high" ? "error" : "warning"}>
                  {item.priority.toUpperCase()} PRIORITY
                </Badge>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--text-muted)" }}>
                  <Clock size={12} />
                  <span>{item.submittedAt}</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img
                  src={item.targetAvatar}
                  alt={item.targetUser}
                  style={{ width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)" }}>
                    {item.targetUser}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    Flag: {item.category}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11.5px", color: "var(--text-secondary)", paddingTop: "6px", borderTop: "1px solid var(--border-light)" }}>
                <span>Assigned: <strong>{item.assignedModerator}</strong></span>
                <span style={{ color: "var(--primary)", fontWeight: 700 }}>Inspect Case →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
