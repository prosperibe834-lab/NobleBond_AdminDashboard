import React, { useState } from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Eye,
  Edit,
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
  Ban,
  Trash2,
  Coins,
  Sparkles,
  Heart,
  SlidersHorizontal,
  Crown,
  Check,
} from "lucide-react";
import type {
  NobleUser,
  ColumnVisibilityState,
  UserSortCriteria,
  UserSortField,
} from "../../types/userManagement.types";
import { calculateAge } from "../../data/userManagementDataService";

interface UserTableProps {
  users: NobleUser[];
  columns: ColumnVisibilityState;
  onColumnToggle: (colKey: keyof ColumnVisibilityState) => void;
  sort: UserSortCriteria;
  onSortChange: (field: UserSortField) => void;
  onViewDetails: (user: NobleUser) => void;
  onEditUser: (user: NobleUser) => void;
  onVerifyUser: (user: NobleUser) => void;
  onSuspendUser: (user: NobleUser) => void;
  onRestoreUser: (user: NobleUser) => void;
  onBanUser: (user: NobleUser) => void;
  onDeleteUser: (user: NobleUser) => void;
  onGrantCoins: (user: NobleUser) => void;
  onGrantPoints: (user: NobleUser) => void;
  onGrantLikes: (user: NobleUser) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  columns,
  onColumnToggle,
  sort,
  onSortChange,
  onViewDetails,
  onEditUser,
  onVerifyUser,
  onSuspendUser,
  onRestoreUser,
  onBanUser,
  onDeleteUser,
  onGrantCoins,
  onGrantPoints,
  onGrantLikes,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [showColPicker, setShowColPicker] = useState(false);

  const getSortIcon = (field: UserSortField) => {
    if (sort.field !== field) return <ArrowUpDown size={12} style={{ opacity: 0.4 }} />;
    return sort.order === "asc" ? (
      <ArrowUp size={12} color="var(--primary)" />
    ) : (
      <ArrowDown size={12} color="var(--primary)" />
    );
  };

  const allColumnsList: Array<{ key: keyof ColumnVisibilityState; label: string }> = [
    { key: "avatar", label: "Profile Picture" },
    { key: "name", label: "Full Name" },
    { key: "username", label: "Username" },
    { key: "email", label: "Email Address" },
    { key: "phone", label: "Phone Number" },
    { key: "gender", label: "Gender" },
    { key: "age", label: "Age" },
    { key: "country", label: "Country" },
    { key: "status", label: "Account Status" },
    { key: "verification", label: "Verification" },
    { key: "premium", label: "Premium Tier" },
    { key: "giftCoins", label: "Gift Coins" },
    { key: "connectionPoints", label: "Connection Pts" },
    { key: "matches", label: "Matches" },
    { key: "likesReceived", label: "Likes Received" },
    { key: "registrationDate", label: "Registration Date" },
    { key: "lastActive", label: "Last Active" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        borderRadius: "16px",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-card)",
        overflow: "hidden",
      }}
    >
      {/* Top Table Bar: Column Visibility Selector */}
      <div
        style={{
          padding: "12px 18px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>
          Registered Members ({users.length})
        </span>

        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setShowColPicker(!showColPicker)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-main)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <SlidersHorizontal size={13} />
            <span>Customize Columns</span>
          </button>

          {showColPicker && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: "6px",
                width: "220px",
                maxHeight: "300px",
                overflowY: "auto",
                backgroundColor: "var(--bg-card)",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-elevated)",
                zIndex: 100,
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  padding: "4px 8px",
                  textTransform: "uppercase",
                }}
              >
                Toggle Columns
              </div>
              {allColumnsList.map((c) => (
                <div
                  key={c.key}
                  onClick={() => onColumnToggle(c.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 8px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "12px",
                    color: "var(--text-main)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-surface)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <span>{c.label}</span>
                  {columns[c.key] && <Check size={14} color="var(--primary)" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr
              style={{
                backgroundColor: "var(--bg-surface)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {columns.avatar && (
                <th style={{ padding: "12px 14px", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", width: "50px" }}>
                  Photo
                </th>
              )}

              {columns.name && (
                <th
                  onClick={() => onSortChange("name")}
                  style={{ padding: "12px 14px", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>Full Name</span>
                    {getSortIcon("name")}
                  </div>
                </th>
              )}

              {columns.username && (
                <th style={{ padding: "12px 14px", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                  Username
                </th>
              )}

              {columns.email && (
                <th style={{ padding: "12px 14px", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                  Email
                </th>
              )}

              {columns.phone && (
                <th style={{ padding: "12px 14px", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                  Phone
                </th>
              )}

              {columns.gender && (
                <th style={{ padding: "12px 14px", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                  Gender
                </th>
              )}

              {columns.age && (
                <th
                  onClick={() => onSortChange("age")}
                  style={{ padding: "12px 14px", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>Age</span>
                    {getSortIcon("age")}
                  </div>
                </th>
              )}

              {columns.country && (
                <th style={{ padding: "12px 14px", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                  Country
                </th>
              )}

              {columns.status && (
                <th style={{ padding: "12px 14px", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                  Status
                </th>
              )}

              {columns.verification && (
                <th style={{ padding: "12px 14px", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                  Verification
                </th>
              )}

              {columns.premium && (
                <th
                  onClick={() => onSortChange("premium")}
                  style={{ padding: "12px 14px", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>Premium</span>
                    {getSortIcon("premium")}
                  </div>
                </th>
              )}

              {columns.giftCoins && (
                <th
                  onClick={() => onSortChange("giftCoins")}
                  style={{ padding: "12px 14px", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>Gift Coins</span>
                    {getSortIcon("giftCoins")}
                  </div>
                </th>
              )}

              {columns.connectionPoints && (
                <th
                  onClick={() => onSortChange("connectionPoints")}
                  style={{ padding: "12px 14px", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>Connection Pts</span>
                    {getSortIcon("connectionPoints")}
                  </div>
                </th>
              )}

              {columns.matches && (
                <th
                  onClick={() => onSortChange("matches")}
                  style={{ padding: "12px 14px", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>Matches</span>
                    {getSortIcon("matches")}
                  </div>
                </th>
              )}

              {columns.likesReceived && (
                <th
                  onClick={() => onSortChange("likesReceived")}
                  style={{ padding: "12px 14px", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>Likes Recv</span>
                    {getSortIcon("likesReceived")}
                  </div>
                </th>
              )}

              {columns.registrationDate && (
                <th
                  onClick={() => onSortChange("registrationDate")}
                  style={{ padding: "12px 14px", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>Registered</span>
                    {getSortIcon("registrationDate")}
                  </div>
                </th>
              )}

              {columns.lastActive && (
                <th
                  onClick={() => onSortChange("lastActive")}
                  style={{ padding: "12px 14px", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>Last Active</span>
                    {getSortIcon("lastActive")}
                  </div>
                </th>
              )}

              {columns.actions && (
                <th style={{ padding: "12px 14px", fontSize: "11.5px", fontWeight: 700, color: "var(--text-muted)", textAlign: "right" }}>
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={18}
                  style={{
                    padding: "48px 20px",
                    textAlign: "center",
                    color: "var(--text-muted)",
                    fontSize: "13.5px",
                  }}
                >
                  No users found matching current search and filters.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const age = calculateAge(u.dateOfBirth);
                const isSuspended = u.status === "suspended" || u.status === "banned";
                const isMenuOpen = activeMenuId === u.id;

                return (
                  <tr
                    key={u.id}
                    style={{
                      borderBottom: "1px solid var(--border)",
                      transition: "background-color 0.15s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-surface)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    {/* Avatar */}
                    {columns.avatar && (
                      <td style={{ padding: "10px 14px" }} onClick={() => onViewDetails(u)}>
                        <div style={{ position: "relative", width: "38px", height: "38px" }}>
                          <img
                            src={u.avatar}
                            alt={u.name}
                            style={{
                              width: "38px",
                              height: "38px",
                              borderRadius: "10px",
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
                                width: "9px",
                                height: "9px",
                                borderRadius: "50%",
                                backgroundColor: "var(--status-success)",
                                border: "1.5px solid var(--bg-card)",
                              }}
                            />
                          )}
                        </div>
                      </td>
                    )}

                    {/* Name */}
                    {columns.name && (
                      <td style={{ padding: "10px 14px" }} onClick={() => onViewDetails(u)}>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>
                          {u.name}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{u.id}</div>
                      </td>
                    )}

                    {/* Username */}
                    {columns.username && (
                      <td style={{ padding: "10px 14px", fontSize: "12.5px", color: "var(--text-secondary)" }} onClick={() => onViewDetails(u)}>
                        {u.username}
                      </td>
                    )}

                    {/* Email */}
                    {columns.email && (
                      <td style={{ padding: "10px 14px", fontSize: "12px", color: "var(--text-secondary)" }} onClick={() => onViewDetails(u)}>
                        {u.email}
                      </td>
                    )}

                    {/* Phone */}
                    {columns.phone && (
                      <td style={{ padding: "10px 14px", fontSize: "12px", color: "var(--text-secondary)" }} onClick={() => onViewDetails(u)}>
                        {u.phone}
                      </td>
                    )}

                    {/* Gender */}
                    {columns.gender && (
                      <td style={{ padding: "10px 14px", fontSize: "12px", color: "var(--text-secondary)", textTransform: "capitalize" }} onClick={() => onViewDetails(u)}>
                        {u.gender}
                      </td>
                    )}

                    {/* Age */}
                    {columns.age && (
                      <td style={{ padding: "10px 14px", fontSize: "12.5px", fontWeight: 600, color: "var(--text-main)" }} onClick={() => onViewDetails(u)}>
                        {age}
                      </td>
                    )}

                    {/* Country */}
                    {columns.country && (
                      <td style={{ padding: "10px 14px", fontSize: "12px", color: "var(--text-secondary)" }} onClick={() => onViewDetails(u)}>
                        {u.country}
                      </td>
                    )}

                    {/* Account Status */}
                    {columns.status && (
                      <td style={{ padding: "10px 14px" }} onClick={() => onViewDetails(u)}>
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            backgroundColor:
                              u.status === "online"
                                ? "rgba(20, 132, 95, 0.12)"
                                : u.status === "suspended" || u.status === "banned"
                                ? "rgba(201, 54, 79, 0.12)"
                                : "rgba(118, 102, 116, 0.12)",
                            color:
                              u.status === "online"
                                ? "var(--status-success)"
                                : u.status === "suspended" || u.status === "banned"
                                ? "var(--status-danger)"
                                : "var(--text-secondary)",
                          }}
                        >
                          {u.status}
                        </span>
                      </td>
                    )}

                    {/* Verification */}
                    {columns.verification && (
                      <td style={{ padding: "10px 14px" }} onClick={() => onViewDetails(u)}>
                        <span
                          style={{
                            padding: "3px 8px",
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
                      </td>
                    )}

                    {/* Premium */}
                    {columns.premium && (
                      <td style={{ padding: "10px 14px" }} onClick={() => onViewDetails(u)}>
                        {u.premium.isPremium ? (
                          <span
                            style={{
                              padding: "2px 8px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: 700,
                              backgroundColor: "rgba(181, 139, 66, 0.15)",
                              color: "var(--accent-champagne)",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <Crown size={11} />
                            <span>{u.premium.tier.toUpperCase()}</span>
                          </span>
                        ) : (
                          <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>Free</span>
                        )}
                      </td>
                    )}

                    {/* Gift Coins */}
                    {columns.giftCoins && (
                      <td style={{ padding: "10px 14px" }} onClick={() => onViewDetails(u)}>
                        <span style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--accent-champagne)" }}>
                          {u.wallet.giftCoins.toLocaleString()}
                        </span>
                      </td>
                    )}

                    {/* Connection Points */}
                    {columns.connectionPoints && (
                      <td style={{ padding: "10px 14px" }} onClick={() => onViewDetails(u)}>
                        <span style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--accent-lavender)" }}>
                          {u.wallet.connectionPoints.toLocaleString()}
                        </span>
                      </td>
                    )}

                    {/* Matches */}
                    {columns.matches && (
                      <td style={{ padding: "10px 14px", fontSize: "12.5px", fontWeight: 600, color: "var(--text-main)" }} onClick={() => onViewDetails(u)}>
                        {u.datingStats.matchesCount}
                      </td>
                    )}

                    {/* Likes Received */}
                    {columns.likesReceived && (
                      <td style={{ padding: "10px 14px", fontSize: "12.5px", fontWeight: 600, color: "var(--text-main)" }} onClick={() => onViewDetails(u)}>
                        {u.datingStats.likesReceived.toLocaleString()}
                      </td>
                    )}

                    {/* Registration Date */}
                    {columns.registrationDate && (
                      <td style={{ padding: "10px 14px", fontSize: "11.5px", color: "var(--text-secondary)" }} onClick={() => onViewDetails(u)}>
                        {u.registrationDate.substring(0, 10)}
                      </td>
                    )}

                    {/* Last Active */}
                    {columns.lastActive && (
                      <td style={{ padding: "10px 14px", fontSize: "11.5px", color: "var(--text-secondary)" }} onClick={() => onViewDetails(u)}>
                        {u.lastActive}
                      </td>
                    )}

                    {/* Actions Menu */}
                    {columns.actions && (
                      <td style={{ padding: "10px 14px", textAlign: "right", position: "relative" }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(isMenuOpen ? null : u.id);
                          }}
                          style={{
                            padding: "6px",
                            borderRadius: "6px",
                            border: "1px solid var(--border)",
                            backgroundColor: "var(--bg-surface)",
                            color: "var(--text-secondary)",
                            cursor: "pointer",
                          }}
                        >
                          <MoreVertical size={14} />
                        </button>

                        {isMenuOpen && (
                          <div
                            style={{
                              position: "absolute",
                              right: "14px",
                              top: "100%",
                              width: "190px",
                              backgroundColor: "var(--bg-card)",
                              borderRadius: "10px",
                              border: "1px solid var(--border)",
                              boxShadow: "var(--shadow-elevated)",
                              zIndex: 50,
                              padding: "4px",
                              display: "flex",
                              flexDirection: "column",
                              gap: "2px",
                              textAlign: "left",
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                onViewDetails(u);
                                setActiveMenuId(null);
                              }}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "7px 10px",
                                borderRadius: "6px",
                                border: "none",
                                backgroundColor: "transparent",
                                color: "var(--text-main)",
                                fontSize: "12px",
                                cursor: "pointer",
                                width: "100%",
                              }}
                            >
                              <Eye size={13} />
                              <span>View Details</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                onEditUser(u);
                                setActiveMenuId(null);
                              }}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "7px 10px",
                                borderRadius: "6px",
                                border: "none",
                                backgroundColor: "transparent",
                                color: "var(--text-main)",
                                fontSize: "12px",
                                cursor: "pointer",
                                width: "100%",
                              }}
                            >
                              <Edit size={13} />
                              <span>Edit User</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                onVerifyUser(u);
                                setActiveMenuId(null);
                              }}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "7px 10px",
                                borderRadius: "6px",
                                border: "none",
                                backgroundColor: "transparent",
                                color: "var(--status-success)",
                                fontSize: "12px",
                                cursor: "pointer",
                                width: "100%",
                              }}
                            >
                              <ShieldCheck size={13} />
                              <span>Verify User</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                onGrantCoins(u);
                                setActiveMenuId(null);
                              }}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "7px 10px",
                                borderRadius: "6px",
                                border: "none",
                                backgroundColor: "transparent",
                                color: "var(--accent-champagne)",
                                fontSize: "12px",
                                cursor: "pointer",
                                width: "100%",
                              }}
                            >
                              <Coins size={13} />
                              <span>Grant Coins</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                onGrantPoints(u);
                                setActiveMenuId(null);
                              }}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "7px 10px",
                                borderRadius: "6px",
                                border: "none",
                                backgroundColor: "transparent",
                                color: "var(--accent-lavender)",
                                fontSize: "12px",
                                cursor: "pointer",
                                width: "100%",
                              }}
                            >
                              <Sparkles size={13} />
                              <span>Grant Points</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                onGrantLikes(u);
                                setActiveMenuId(null);
                              }}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "7px 10px",
                                borderRadius: "6px",
                                border: "none",
                                backgroundColor: "transparent",
                                color: "var(--primary)",
                                fontSize: "12px",
                                cursor: "pointer",
                                width: "100%",
                              }}
                            >
                              <Heart size={13} />
                              <span>Grant Likes</span>
                            </button>

                            {isSuspended ? (
                              <button
                                type="button"
                                onClick={() => {
                                  onRestoreUser(u);
                                  setActiveMenuId(null);
                                }}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  padding: "7px 10px",
                                  borderRadius: "6px",
                                  border: "none",
                                  backgroundColor: "transparent",
                                  color: "var(--status-success)",
                                  fontSize: "12px",
                                  cursor: "pointer",
                                  width: "100%",
                                }}
                              >
                                <RotateCcw size={13} />
                                <span>Restore User</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  onSuspendUser(u);
                                  setActiveMenuId(null);
                                }}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  padding: "7px 10px",
                                  borderRadius: "6px",
                                  border: "none",
                                  backgroundColor: "transparent",
                                  color: "var(--status-danger)",
                                  fontSize: "12px",
                                  cursor: "pointer",
                                  width: "100%",
                                }}
                              >
                                <ShieldAlert size={13} />
                                <span>Suspend User</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                onBanUser(u);
                                setActiveMenuId(null);
                              }}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "7px 10px",
                                borderRadius: "6px",
                                border: "none",
                                backgroundColor: "transparent",
                                color: "var(--status-danger)",
                                fontSize: "12px",
                                cursor: "pointer",
                                width: "100%",
                              }}
                            >
                              <Ban size={13} />
                              <span>Ban User</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                onDeleteUser(u);
                                setActiveMenuId(null);
                              }}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "7px 10px",
                                borderRadius: "6px",
                                border: "none",
                                backgroundColor: "transparent",
                                color: "var(--status-danger)",
                                fontSize: "12px",
                                cursor: "pointer",
                                width: "100%",
                              }}
                            >
                              <Trash2 size={13} />
                              <span>Delete User</span>
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

