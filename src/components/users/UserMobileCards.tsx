import React from "react";
import { Eye, Edit, ShieldCheck, ShieldAlert, Coins, Sparkles, Heart, Crown } from "lucide-react";
import type { NobleUser } from "../../types/userManagement.types";
import { calculateAge } from "../../data/userManagementDataService";

interface UserMobileCardsProps {
  users: NobleUser[];
  onViewDetails: (user: NobleUser) => void;
  onEditUser: (user: NobleUser) => void;
  onVerifyUser: (user: NobleUser) => void;
  onSuspendUser: (user: NobleUser) => void;
  onGrantCoins: (user: NobleUser) => void;
  onGrantPoints: (user: NobleUser) => void;
}

export const UserMobileCards: React.FC<UserMobileCardsProps> = ({
  users,
  onViewDetails,
  onEditUser,
  onVerifyUser,
  onSuspendUser,
  onGrantCoins,
  onGrantPoints,
}) => {
  if (users.length === 0) {
    return (
      <div
        style={{
          padding: "40px 20px",
          textAlign: "center",
          backgroundColor: "var(--bg-card)",
          borderRadius: "14px",
          border: "1px solid var(--border)",
          color: "var(--text-muted)",
          fontSize: "13.5px",
        }}
      >
        No users found matching current filters.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {users.map((u) => {
        const age = calculateAge(u.dateOfBirth);
        const isSuspended = u.status === "suspended" || u.status === "banned";

        return (
          <div
            key={u.id}
            style={{
              padding: "16px",
              borderRadius: "14px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-card)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {/* Top User Info */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{ position: "relative", cursor: "pointer" }}
                onClick={() => onViewDetails(u)}
              >
                <img
                  src={u.avatar}
                  alt={u.name}
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    objectFit: "cover",
                    border: "1px solid var(--border)",
                  }}
                />
                {u.status === "online" && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-1px",
                      right: "-1px",
                      width: "11px",
                      height: "11px",
                      borderRadius: "50%",
                      backgroundColor: "var(--status-success)",
                      border: "2px solid var(--bg-card)",
                    }}
                  />
                )}
              </div>

              <div style={{ flex: 1 }} onClick={() => onViewDetails(u)}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)" }}>
                    {u.name}
                  </span>
                  {u.premium.isPremium && <Crown size={13} color="var(--accent-champagne)" />}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  {u.username} &bull; {age} yrs &bull; {u.country}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  ID: {u.id}
                </div>
              </div>
            </div>

            {/* Badges Row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  backgroundColor:
                    u.status === "online"
                      ? "rgba(20, 132, 95, 0.12)"
                      : isSuspended
                      ? "rgba(201, 54, 79, 0.12)"
                      : "rgba(118, 102, 116, 0.12)",
                  color:
                    u.status === "online"
                      ? "var(--status-success)"
                      : isSuspended
                      ? "var(--status-danger)"
                      : "var(--text-secondary)",
                }}
              >
                {u.status}
              </span>

              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: 700,
                  backgroundColor:
                    u.verification.status === "verified"
                      ? "rgba(20, 132, 95, 0.12)"
                      : "rgba(181, 139, 66, 0.12)",
                  color:
                    u.verification.status === "verified"
                      ? "var(--status-success)"
                      : "var(--status-warning)",
                }}
              >
                {u.verification.status.replace("_", " ")}
              </span>

              {u.premium.isPremium ? (
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: 700,
                    backgroundColor: "rgba(181, 139, 66, 0.15)",
                    color: "var(--accent-champagne)",
                  }}
                >
                  {u.premium.tier.toUpperCase()} VIP
                </span>
              ) : (
                <span style={{ padding: "2px 8px", borderRadius: "6px", fontSize: "11px", color: "var(--text-muted)", backgroundColor: "var(--bg-surface)" }}>
                  Free
                </span>
              )}
            </div>

            {/* Metrics Chips */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "8px",
                padding: "8px 10px",
                borderRadius: "8px",
                backgroundColor: "var(--bg-surface)",
                textAlign: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "10.5px", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", gap: "3px" }}>
                  <Coins size={11} color="var(--accent-champagne)" />
                  <span>Coins</span>
                </div>
                <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--accent-champagne)", marginTop: "2px" }}>
                  {u.wallet.giftCoins.toLocaleString()}
                </div>
              </div>

              <div>
                <div style={{ fontSize: "10.5px", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", gap: "3px" }}>
                  <Sparkles size={11} color="var(--accent-lavender)" />
                  <span>Points</span>
                </div>
                <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--accent-lavender)", marginTop: "2px" }}>
                  {u.wallet.connectionPoints.toLocaleString()}
                </div>
              </div>

              <div>
                <div style={{ fontSize: "10.5px", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", gap: "3px" }}>
                  <Heart size={11} color="var(--primary)" />
                  <span>Matches</span>
                </div>
                <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)", marginTop: "2px" }}>
                  {u.datingStats.matchesCount}
                </div>
              </div>
            </div>

            {/* Mobile Actions */}
            <div style={{ display: "flex", gap: "6px", marginTop: "4px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => onViewDetails(u)}
                style={{
                  flex: "1 1 120px",
                  padding: "8px",
                  borderRadius: "8px",
                  backgroundColor: "var(--primary)",
                  color: "#FFFFFF",
                  border: "none",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                <Eye size={13} />
                <span>View Details</span>
              </button>

              <button
                type="button"
                onClick={() => onEditUser(u)}
                style={{
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-main)",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                title="Edit User"
              >
                <Edit size={13} />
              </button>

              <button
                type="button"
                onClick={() => onVerifyUser(u)}
                style={{
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid var(--status-success)",
                  backgroundColor: "rgba(20, 132, 95, 0.08)",
                  color: "var(--status-success)",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                title="Verify User"
              >
                <ShieldCheck size={13} />
              </button>

              <button
                type="button"
                onClick={() => onGrantCoins(u)}
                style={{
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid var(--accent-champagne)",
                  backgroundColor: "rgba(181, 139, 66, 0.08)",
                  color: "var(--accent-champagne)",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                title="Grant Coins"
              >
                <Coins size={13} />
              </button>

              <button
                type="button"
                onClick={() => onGrantPoints(u)}
                style={{
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid var(--accent-lavender)",
                  backgroundColor: "rgba(124, 104, 232, 0.08)",
                  color: "var(--accent-lavender)",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                title="Grant Points"
              >
                <Sparkles size={13} />
              </button>

              <button
                type="button"
                onClick={() => onSuspendUser(u)}
                style={{
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid var(--status-danger)",
                  backgroundColor: "rgba(201, 54, 79, 0.08)",
                  color: "var(--status-danger)",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                title="Suspend User"
              >
                <ShieldAlert size={13} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
