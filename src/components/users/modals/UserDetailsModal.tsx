import React, { useState } from "react";
import {
  X,
  User,
  Heart,
  Smartphone,
  Shield,
  Activity,
  Coins,
  Sparkles,
  Crown,
  Users,
  AlertTriangle,
  Eye,
  EyeOff,
  Copy,
  Check,
  Edit,
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
  Ban,
  Trash2,
  Plus,
  FileText,
  Clock,
} from "lucide-react";
import type {
  NobleUser,
} from "../../../types/userManagement.types";
import { calculateAge, maskIp } from "../../../data/userManagementDataService";

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: NobleUser | null;
  onOpenEdit: (u: NobleUser) => void;
  onOpenVerify: (u: NobleUser) => void;
  onOpenSuspend: (u: NobleUser) => void;
  onOpenRestore: (u: NobleUser) => void;
  onOpenBan: (u: NobleUser) => void;
  onOpenDelete: (u: NobleUser) => void;
  onOpenGrantCoins: (u: NobleUser) => void;
  onOpenGrantPoints: (u: NobleUser) => void;
  onOpenGrantLikes: (u: NobleUser) => void;
  onOpenAddNote: (u: NobleUser) => void;
  onOpenImageViewer: (imageUrl: string, title: string) => void;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenEdit,
  onOpenVerify,
  onOpenSuspend,
  onOpenRestore,
  onOpenBan,
  onOpenDelete,
  onOpenGrantCoins,
  onOpenGrantPoints,
  onOpenGrantLikes,
  onOpenAddNote,
  onOpenImageViewer,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [revealedIps, setRevealedIps] = useState<{ [devId: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState(false);
  const [activityFilter, setActivityFilter] = useState<string>("all");

  if (!isOpen || !user) return null;

  const age = calculateAge(user.dateOfBirth);
  const isSuspended = user.status === "suspended" || user.status === "banned";

  const handleCopyId = () => {
    navigator.clipboard.writeText(user.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const toggleIpReveal = (devId: string) => {
    setRevealedIps((prev) => ({ ...prev, [devId]: !prev[devId] }));
  };

  const tabs = [
    { id: 0, label: "Overview", icon: User },
    { id: 1, label: "Personal Information", icon: FileText },
    { id: 2, label: "Profile", icon: Heart },
    { id: 3, label: "Devices & Security", icon: Smartphone },
    { id: 4, label: "Activity", icon: Activity },
    { id: 5, label: "Likes & Matches", icon: Heart },
    { id: 6, label: "Wallet & Transactions", icon: Coins },
    { id: 7, label: "Premium & Subscriptions", icon: Crown },
    { id: 8, label: "Referral History", icon: Users },
    { id: 9, label: "Moderation History", icon: ShieldAlert },
  ];

  const filteredTimeline = user.activityTimeline.filter(
    (ev) => activityFilter === "all" || ev.type === activityFilter
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(6px)",
        zIndex: 1050,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1080px",
          height: "92vh",
          backgroundColor: "var(--bg-card)",
          borderRadius: "20px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-elevated)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Card */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
            backgroundColor: "var(--bg-surface)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          {/* Avatar and Info */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{ position: "relative", cursor: "pointer" }}
              onClick={() => onOpenImageViewer(user.avatar, user.name)}
              title="Click to view full photo"
            >
              <img
                src={user.avatar}
                alt={user.name}
                style={{
                  width: "68px",
                  height: "68px",
                  borderRadius: "16px",
                  objectFit: "cover",
                  border: "2px solid var(--primary)",
                }}
              />
              {user.status === "online" && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "-2px",
                    right: "-2px",
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    backgroundColor: "var(--status-success)",
                    border: "2px solid var(--bg-surface)",
                  }}
                  title="Online Now"
                />
              )}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-main)", margin: 0 }}>
                  {user.name}
                </h2>
                <span style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: 600 }}>
                  {user.username}
                </span>

                {/* ID badge with copy */}
                <button
                  type="button"
                  onClick={handleCopyId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    cursor: "pointer",
                  }}
                  title="Copy User ID"
                >
                  {copiedId ? <Check size={11} color="var(--status-success)" /> : <Copy size={11} />}
                  <span>{user.id}</span>
                </button>
              </div>

              {/* Status and badges row */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px", flexWrap: "wrap" }}>
                {/* Account Status */}
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    backgroundColor:
                      user.status === "online"
                        ? "rgba(20, 132, 95, 0.12)"
                        : user.status === "suspended" || user.status === "banned"
                        ? "rgba(201, 54, 79, 0.12)"
                        : "rgba(118, 102, 116, 0.12)",
                    color:
                      user.status === "online"
                        ? "var(--status-success)"
                        : user.status === "suspended" || user.status === "banned"
                        ? "var(--status-danger)"
                        : "var(--text-secondary)",
                  }}
                >
                  {user.status}
                </span>

                {/* Verification */}
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: 700,
                    backgroundColor:
                      user.verification.status === "verified"
                        ? "rgba(20, 132, 95, 0.12)"
                        : "rgba(181, 139, 66, 0.12)",
                    color:
                      user.verification.status === "verified"
                        ? "var(--status-success)"
                        : "var(--status-warning)",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <ShieldCheck size={12} />
                  <span>{user.verification.status.replace("_", " ")}</span>
                </span>

                {/* Premium */}
                {user.premium.isPremium ? (
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 700,
                      backgroundColor: "rgba(181, 139, 66, 0.15)",
                      color: "var(--accent-champagne)",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Crown size={12} />
                    <span>{user.premium.planName}</span>
                  </span>
                ) : (
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      backgroundColor: "var(--bg-card)",
                    }}
                  >
                    Free Member
                  </span>
                )}

                <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                  {age} yrs &bull; {user.city}, {user.country}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => onOpenEdit(user)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "7px 12px",
                borderRadius: "8px",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-main)",
                cursor: "pointer",
              }}
            >
              <Edit size={13} />
              <span>Edit</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenVerify(user)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "7px 12px",
                borderRadius: "8px",
                backgroundColor: "rgba(20, 132, 95, 0.1)",
                border: "1px solid var(--status-success)",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--status-success)",
                cursor: "pointer",
              }}
            >
              <ShieldCheck size={13} />
              <span>Verify</span>
            </button>

            {isSuspended ? (
              <button
                type="button"
                onClick={() => onOpenRestore(user)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "7px 12px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(20, 132, 95, 0.1)",
                  border: "1px solid var(--status-success)",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--status-success)",
                  cursor: "pointer",
                }}
              >
                <RotateCcw size={13} />
                <span>Restore</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onOpenSuspend(user)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "7px 12px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(201, 54, 79, 0.1)",
                  border: "1px solid var(--status-danger)",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--status-danger)",
                  cursor: "pointer",
                }}
              >
                <ShieldAlert size={13} />
                <span>Suspend</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onOpenBan(user)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "7px 12px",
                borderRadius: "8px",
                backgroundColor: "rgba(201, 54, 79, 0.15)",
                border: "1px solid var(--status-danger)",
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--status-danger)",
                cursor: "pointer",
              }}
            >
              <Ban size={13} />
              <span>Ban</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenDelete(user)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "7px 10px",
                borderRadius: "8px",
                backgroundColor: "transparent",
                border: "1px solid var(--border)",
                fontSize: "12px",
                color: "var(--status-danger)",
                cursor: "pointer",
              }}
              title="Delete user"
            >
              <Trash2 size={14} />
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "7px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-secondary)",
                cursor: "pointer",
                marginLeft: "4px",
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            borderBottom: "1px solid var(--border)",
            backgroundColor: "var(--bg-card)",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "12px 14px",
                  fontSize: "12.5px",
                  fontWeight: isSel ? 700 : 500,
                  color: isSel ? "var(--primary)" : "var(--text-secondary)",
                  border: "none",
                  borderBottom: `2px solid ${isSel ? "var(--primary)" : "transparent"}`,
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body - Scrollable */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {/* TAB 0: OVERVIEW */}
          {activeTab === 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: "18px" }}>
              {/* Account Information Card */}
              <div
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderRadius: "14px",
                  border: "1px solid var(--border)",
                  padding: "18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                    Account Details
                  </h4>
                  <User size={16} color="var(--primary)" />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12.5px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Full Name:</span>
                    <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{user.name}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Email:</span>
                    <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{user.email}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Phone:</span>
                    <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{user.phone}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Date of Birth:</span>
                    <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{user.dateOfBirth} ({age} yrs)</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Country / City:</span>
                    <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{user.city}, {user.country}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Preferred Language:</span>
                    <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{user.preferredLanguage}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Registered:</span>
                    <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{user.registrationDate.substring(0, 10)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Last Active:</span>
                    <span style={{ fontWeight: 600, color: "var(--status-success)" }}>{user.lastActive}</span>
                  </div>
                </div>
              </div>

              {/* Dating Activity Card */}
              <div
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderRadius: "14px",
                  border: "1px solid var(--border)",
                  padding: "18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                    Dating & Social Engagement
                  </h4>
                  <Heart size={16} color="var(--primary)" />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div style={{ backgroundColor: "var(--bg-card)", padding: "10px", borderRadius: "10px", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Mutual Matches</div>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--primary)", marginTop: "2px" }}>
                      {user.datingStats.matchesCount}
                    </div>
                  </div>
                  <div style={{ backgroundColor: "var(--bg-card)", padding: "10px", borderRadius: "10px", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Likes Received</div>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>
                      {user.datingStats.likesReceived.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ backgroundColor: "var(--bg-card)", padding: "10px", borderRadius: "10px", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Likes Sent</div>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>
                      {user.datingStats.likesSent.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ backgroundColor: "var(--bg-card)", padding: "10px", borderRadius: "10px", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Profile Views</div>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>
                      {user.datingStats.profileViews.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ backgroundColor: "var(--bg-card)", padding: "10px", borderRadius: "10px", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Live Broadcasts</div>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--status-info)", marginTop: "2px" }}>
                      {user.datingStats.liveHostedCount} hosted
                    </div>
                  </div>
                  <div style={{ backgroundColor: "var(--bg-card)", padding: "10px", borderRadius: "10px", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Conversations</div>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>
                      {user.datingStats.conversationsCount} chats
                    </div>
                  </div>
                </div>
              </div>

              {/* Wallet Summary Card (Separating Coins vs Points) */}
              <div
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderRadius: "14px",
                  border: "1px solid var(--border)",
                  padding: "18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                    Dual Wallet Ledger
                  </h4>
                  <Coins size={16} color="var(--accent-champagne)" />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {/* Gift Coins */}
                  <div
                    style={{
                      backgroundColor: "var(--bg-card)",
                      padding: "12px",
                      borderRadius: "10px",
                      border: "1px solid rgba(181, 139, 66, 0.3)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700, color: "var(--accent-champagne)" }}>
                        <Coins size={12} />
                        <span>Gift Coins</span>
                      </div>
                      <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-main)", marginTop: "4px" }}>
                        {user.wallet.giftCoins.toLocaleString()}
                      </div>
                    </div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "8px" }}>
                      Spent: {user.wallet.giftCoinsSpentTotal} &bull; Received: {user.wallet.giftsReceivedTotal}
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenGrantCoins(user)}
                      style={{
                        marginTop: "8px",
                        padding: "5px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(181, 139, 66, 0.1)",
                        color: "var(--accent-champagne)",
                        border: "none",
                        fontSize: "11px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Adjust Coins
                    </button>
                  </div>

                  {/* Connection Points */}
                  <div
                    style={{
                      backgroundColor: "var(--bg-card)",
                      padding: "12px",
                      borderRadius: "10px",
                      border: "1px solid rgba(124, 104, 232, 0.3)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700, color: "var(--accent-lavender)" }}>
                        <Sparkles size={12} />
                        <span>Connection Pts</span>
                      </div>
                      <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-main)", marginTop: "4px" }}>
                        {user.wallet.connectionPoints.toLocaleString()}
                      </div>
                    </div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "8px" }}>
                      Earned: {user.wallet.connectionPointsReferrals} via referrals
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenGrantPoints(user)}
                      style={{
                        marginTop: "8px",
                        padding: "5px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(124, 104, 232, 0.1)",
                        color: "var(--accent-lavender)",
                        border: "none",
                        fontSize: "11px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Adjust Points
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: "11px", color: "var(--text-muted)", fontStyle: "italic" }}>
                  Gift Coins power live streaming; Connection Points reward verified referrals (+50 Pts).
                </div>
              </div>

              {/* Referral Summary Card */}
              <div
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderRadius: "14px",
                  border: "1px solid var(--border)",
                  padding: "18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                    Referral Performance
                  </h4>
                  <Users size={16} color="var(--primary)" />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Referral Code:</span>
                  <span style={{ fontWeight: 800, color: "var(--primary)", letterSpacing: "0.05em" }}>
                    {user.referral.referralCode}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Total Referred Friends:</span>
                  <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{user.referral.totalReferred}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Qualified (+50 Pts each):</span>
                  <span style={{ fontWeight: 700, color: "var(--status-success)" }}>{user.referral.successful}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Pending Verification:</span>
                  <span style={{ fontWeight: 600, color: "var(--status-warning)" }}>{user.referral.pending}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Total Points Earned:</span>
                  <span style={{ fontWeight: 800, color: "var(--accent-lavender)" }}>
                    +{user.referral.pointsEarned} Pts
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: PERSONAL INFORMATION */}
          {activeTab === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderRadius: "14px",
                  border: "1px solid var(--border)",
                  padding: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                    Account Identity & Demographics
                  </h4>
                  <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
                    Authorized administrative fields with strict format and unique constraint validation.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenEdit(user)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    backgroundColor: "var(--primary)",
                    color: "#FFFFFF",
                    border: "none",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Edit size={14} />
                  <span>Edit Information</span>
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                {[
                  { label: "First Name", val: user.firstName },
                  { label: "Last Name", val: user.lastName },
                  { label: "Username", val: user.username },
                  { label: "Email Address", val: user.email },
                  { label: "Phone Number", val: user.phone },
                  { label: "Date of Birth", val: `${user.dateOfBirth} (${age} years old)` },
                  { label: "Gender", val: user.gender.toUpperCase() },
                  { label: "Pronouns", val: user.pronouns || "Not specified" },
                  { label: "Country", val: user.country },
                  { label: "State / Region", val: user.stateRegion },
                  { label: "City", val: user.city },
                  { label: "Selected App Language", val: user.preferredLanguage },
                  { label: "Device System Language", val: user.deviceLanguage },
                  { label: "Account Creation Date", val: user.registrationDate },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "10px",
                      backgroundColor: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", display: "block" }}>
                      {item.label}
                    </span>
                    <span style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)", marginTop: "4px", display: "block" }}>
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE */}
          {activeTab === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Photo Gallery */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div>
                    <h4 style={{ fontSize: "14.5px", fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                      Dating Profile Photo Gallery ({user.profile.photos.length} photos)
                    </h4>
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                      Click any image to view in high resolution lightbox
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "var(--primary)",
                      backgroundColor: "rgba(193, 47, 102, 0.08)",
                      padding: "4px 10px",
                      borderRadius: "6px",
                    }}
                  >
                    Completeness: {user.profile.completionPercentage}%
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "12px" }}>
                  {user.profile.photos.map((photo, i) => (
                    <div
                      key={i}
                      onClick={() => onOpenImageViewer(photo, `${user.name} - Photo ${i + 1}`)}
                      style={{
                        position: "relative",
                        aspectRatio: "1/1",
                        borderRadius: "12px",
                        overflow: "hidden",
                        border: i === 0 ? "2px solid var(--primary)" : "1px solid var(--border)",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={photo}
                        alt={`Photo ${i + 1}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      {i === 0 && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "4px",
                            left: "4px",
                            backgroundColor: "var(--primary)",
                            color: "#FFFFFF",
                            fontSize: "9.5px",
                            fontWeight: 700,
                            padding: "2px 6px",
                            borderRadius: "4px",
                          }}
                        >
                          Primary
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bio & Prompts */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
                {/* About Me */}
                <div
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    padding: "16px",
                    borderRadius: "14px",
                    border: "1px solid var(--border)",
                  }}
                >
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                    Biography
                  </span>
                  <p style={{ fontSize: "13.5px", color: "var(--text-main)", marginTop: "8px", lineHeight: 1.6 }}>
                    {user.profile.bio}
                  </p>

                  <div style={{ marginTop: "16px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                      Relationship Goal
                    </span>
                    <div style={{ marginTop: "4px", fontSize: "13.5px", fontWeight: 700, color: "var(--primary)" }}>
                      {user.profile.relationshipGoals}
                    </div>
                  </div>

                  <div style={{ marginTop: "16px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                      Interests
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
                      {user.profile.interests.map((it, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "6px",
                            backgroundColor: "var(--bg-card)",
                            border: "1px solid var(--border)",
                            fontSize: "12px",
                            color: "var(--text-main)",
                          }}
                        >
                          {it}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Profile Prompts */}
                <div
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    padding: "16px",
                    borderRadius: "14px",
                    border: "1px solid var(--border)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                    Dating Prompts & Answers
                  </span>

                  {user.profile.prompts.length === 0 ? (
                    <div style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                      No custom profile prompts completed yet.
                    </div>
                  ) : (
                    user.profile.prompts.map((p, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "12px",
                          borderRadius: "10px",
                          backgroundColor: "var(--bg-card)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--primary)" }}>
                          {p.question}
                        </div>
                        <div style={{ fontSize: "13px", color: "var(--text-main)", marginTop: "4px", lineHeight: 1.5 }}>
                          {p.answer}
                        </div>
                      </div>
                    ))
                  )}

                  {/* Lifestyle */}
                  <div style={{ marginTop: "10px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                      Lifestyle Attributes
                    </span>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginTop: "6px", fontSize: "12px" }}>
                      <div><strong>Smoking:</strong> {user.profile.lifestyle.smoking}</div>
                      <div><strong>Drinking:</strong> {user.profile.lifestyle.drinking}</div>
                      <div><strong>Workout:</strong> {user.profile.lifestyle.workout}</div>
                      <div><strong>Pets:</strong> {user.profile.lifestyle.pets}</div>
                      <div><strong>Zodiac:</strong> {user.profile.lifestyle.starSign}</div>
                      <div><strong>Education:</strong> {user.profile.education}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DEVICES & SECURITY */}
          {activeTab === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                  Device Telemetry, Network & VPN Security Risk
                </h4>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
                  Operating system versions are verified separately from application client builds. IP addresses are masked by default for privacy compliance.
                </p>
              </div>

              {/* Devices Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {user.devices.map((dev) => {
                  const isRevealed = !!revealedIps[dev.id];
                  return (
                    <div
                      key={dev.id}
                      style={{
                        backgroundColor: "var(--bg-surface)",
                        borderRadius: "14px",
                        border: "1px solid var(--border)",
                        padding: "18px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "14px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <Smartphone size={18} color="var(--primary)" />
                          <div>
                            <span style={{ fontSize: "14.5px", fontWeight: 700, color: "var(--text-main)" }}>
                              {dev.brand} {dev.model}
                            </span>
                            {dev.isCurrentSession && (
                              <span
                                style={{
                                  marginLeft: "8px",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  backgroundColor: "rgba(20, 132, 95, 0.12)",
                                  color: "var(--status-success)",
                                  fontSize: "10.5px",
                                  fontWeight: 700,
                                }}
                              >
                                Active Session
                              </span>
                            )}
                          </div>
                        </div>

                        {/* VPN Status Badge */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span
                            style={{
                              padding: "4px 10px",
                              borderRadius: "6px",
                              fontSize: "11.5px",
                              fontWeight: 700,
                              backgroundColor:
                                dev.vpnStatus === "detected"
                                  ? "rgba(201, 54, 79, 0.12)"
                                  : dev.vpnStatus === "possible_proxy"
                                  ? "rgba(181, 139, 66, 0.12)"
                                  : "rgba(20, 132, 95, 0.12)",
                              color:
                                dev.vpnStatus === "detected"
                                  ? "var(--status-danger)"
                                  : dev.vpnStatus === "possible_proxy"
                                  ? "var(--status-warning)"
                                  : "var(--status-success)",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <Shield size={12} />
                            <span>
                              {dev.vpnStatus === "detected"
                                ? "VPN Detected"
                                : dev.vpnStatus === "possible_proxy"
                                ? "Possible Proxy Node"
                                : "No VPN Flagged"}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Technical Fields Grid */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
                        <div style={{ backgroundColor: "var(--bg-card)", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                          <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>
                            Phone Operating System
                          </span>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)", marginTop: "2px", display: "block" }}>
                            {dev.osVersion}
                          </span>
                        </div>

                        <div style={{ backgroundColor: "var(--bg-card)", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                          <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>
                            NobleBond App Version
                          </span>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)", marginTop: "2px", display: "block" }}>
                            {dev.appVersion}
                          </span>
                        </div>

                        <div style={{ backgroundColor: "var(--bg-card)", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Session IP Address</span>
                            <button
                              type="button"
                              onClick={() => toggleIpReveal(dev.id)}
                              style={{
                                border: "none",
                                background: "none",
                                color: "var(--primary)",
                                fontSize: "11px",
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "3px",
                              }}
                            >
                              {isRevealed ? <EyeOff size={11} /> : <Eye size={11} />}
                              <span>{isRevealed ? "Mask" : "Reveal"}</span>
                            </button>
                          </div>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)", marginTop: "2px", display: "block", fontFamily: "monospace" }}>
                            {isRevealed ? dev.ipAddress : maskIp(dev.ipAddress)}
                          </span>
                        </div>

                        <div style={{ backgroundColor: "var(--bg-card)", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                          <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>
                            Geo-Network Location
                          </span>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)", marginTop: "2px", display: "block" }}>
                            {dev.ipCity}, {dev.ipCountry}
                          </span>
                        </div>
                      </div>

                      {dev.suspiciousActivity && (
                        <div
                          style={{
                            padding: "8px 12px",
                            borderRadius: "8px",
                            backgroundColor: "rgba(201, 54, 79, 0.08)",
                            border: "1px solid rgba(201, 54, 79, 0.2)",
                            fontSize: "12px",
                            color: "var(--status-danger)",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <AlertTriangle size={14} />
                          <span>Suspicious device fingerprint: Session matches known proxy routing table.</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: ACTIVITY TIMELINE */}
          {activeTab === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                    Audited Activity Timeline
                  </h4>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
                    High-level engagement events. Private message body contents are strictly protected.
                  </p>
                </div>

                {/* Filter Pills */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {["all", "dating", "live", "wallet", "referral", "security"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActivityFilter(cat)}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "6px",
                        fontSize: "11.5px",
                        fontWeight: 600,
                        border: "1px solid",
                        borderColor: activityFilter === cat ? "var(--primary)" : "var(--border)",
                        backgroundColor: activityFilter === cat ? "rgba(193, 47, 102, 0.1)" : "var(--bg-surface)",
                        color: activityFilter === cat ? "var(--primary)" : "var(--text-secondary)",
                        cursor: "pointer",
                        textTransform: "capitalize",
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {filteredTimeline.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
                  No activity events found in this category.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {filteredTimeline.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: "14px 16px",
                        borderRadius: "12px",
                        backgroundColor: "var(--bg-surface)",
                        border: "1px solid var(--border)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "12px",
                      }}
                    >
                      <div style={{ display: "flex", gap: "12px" }}>
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            backgroundColor:
                              item.type === "live"
                                ? "rgba(193, 47, 102, 0.1)"
                                : item.type === "wallet"
                                ? "rgba(181, 139, 66, 0.1)"
                                : "rgba(124, 104, 232, 0.1)",
                            color:
                              item.type === "live"
                                ? "var(--primary)"
                                : item.type === "wallet"
                                ? "var(--accent-champagne)"
                                : "var(--accent-lavender)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Activity size={16} />
                        </div>
                        <div>
                          <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)" }}>
                            {item.title}
                          </div>
                          <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", margin: "4px 0 0 0", lineHeight: 1.4 }}>
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                        <Clock size={11} />
                        <span>{item.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: LIKES & MATCHES */}
          {activeTab === 5 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                    Likes, Mutual Matches & Dating Allowances
                  </h4>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
                    Administrators can grant additional like allowances as compensation or promotion without forging fake incoming likes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenGrantLikes(user)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    backgroundColor: "var(--primary)",
                    color: "#FFFFFF",
                    border: "none",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Plus size={14} />
                  <span>Grant Additional Likes</span>
                </button>
              </div>

              {/* Dating stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" }}>
                {[
                  { label: "Likes Sent", val: user.datingStats.likesSent },
                  { label: "Likes Received", val: user.datingStats.likesReceived },
                  { label: "Super Likes Sent", val: user.datingStats.superLikesSent },
                  { label: "Extra Allowance", val: `+${user.datingStats.additionalLikesAllowance}` },
                  { label: "Confirmed Matches", val: user.datingStats.matchesCount },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      backgroundColor: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>{s.label}</div>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>
                      {s.val}
                    </div>
                  </div>
                ))}
              </div>

              {/* Match list */}
              <div>
                <h5 style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)", marginBottom: "10px" }}>
                  Mutual Matches ({user.matches.length} active)
                </h5>
                {user.matches.length === 0 ? (
                  <div style={{ padding: "30px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
                    No active match relationships recorded.
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px" }}>
                    {user.matches.map((m) => (
                      <div
                        key={m.id}
                        style={{
                          padding: "12px",
                          borderRadius: "10px",
                          backgroundColor: "var(--bg-surface)",
                          border: "1px solid var(--border)",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <img
                          src={m.matchedUserAvatar}
                          alt={m.matchedUserName}
                          style={{ width: "42px", height: "42px", borderRadius: "10px", objectFit: "cover" }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>
                            {m.matchedUserName}
                          </div>
                          <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                            {m.matchedUserUsername}
                          </div>
                          <div style={{ fontSize: "10.5px", color: "var(--text-muted)", marginTop: "2px" }}>
                            Matched on {m.matchedDate}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: WALLET & TRANSACTIONS */}
          {activeTab === 6 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Separate Currency Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {/* Gift Coins */}
                <div
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderRadius: "14px",
                    border: "1px solid rgba(181, 139, 66, 0.3)",
                    padding: "18px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Coins size={18} color="var(--accent-champagne)" />
                      <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                        Gift Coins Balance
                      </h4>
                    </div>
                    <span style={{ fontSize: "22px", fontWeight: 800, color: "var(--accent-champagne)" }}>
                      {user.wallet.giftCoins.toLocaleString()}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "12px" }}>
                    <div>Purchased: {user.wallet.giftCoinsPurchasedTotal}</div>
                    <div>Spent: {user.wallet.giftCoinsSpentTotal}</div>
                    <div>Received: {user.wallet.giftsReceivedTotal}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenGrantCoins(user)}
                    style={{
                      padding: "8px",
                      borderRadius: "8px",
                      backgroundColor: "var(--accent-champagne)",
                      color: "#151019",
                      border: "none",
                      fontSize: "12.5px",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <Plus size={14} />
                    <span>Adjust Gift Coins</span>
                  </button>
                </div>

                {/* Connection Points */}
                <div
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderRadius: "14px",
                    border: "1px solid rgba(124, 104, 232, 0.3)",
                    padding: "18px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Sparkles size={18} color="var(--accent-lavender)" />
                      <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                        Connection Points
                      </h4>
                    </div>
                    <span style={{ fontSize: "22px", fontWeight: 800, color: "var(--accent-lavender)" }}>
                      {user.wallet.connectionPoints.toLocaleString()}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "12px" }}>
                    <div>Referrals: {user.wallet.connectionPointsReferrals}</div>
                    <div>Adjusted: {user.wallet.connectionPointsAdjusted}</div>
                    <div>Spent: {user.wallet.connectionPointsSpent}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenGrantPoints(user)}
                    style={{
                      padding: "8px",
                      borderRadius: "8px",
                      backgroundColor: "var(--accent-lavender)",
                      color: "#FFFFFF",
                      border: "none",
                      fontSize: "12.5px",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <Plus size={14} />
                    <span>Adjust Connection Points</span>
                  </button>
                </div>
              </div>

              {/* Transactions Ledger */}
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)", marginBottom: "12px" }}>
                  Itemized Transactions Ledger
                </h4>
                {user.transactions.length === 0 ? (
                  <div style={{ padding: "30px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
                    No recorded transactions for this user.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {user.transactions.map((t) => (
                      <div
                        key={t.id}
                        style={{
                          padding: "12px 14px",
                          borderRadius: "10px",
                          backgroundColor: "var(--bg-surface)",
                          border: "1px solid var(--border)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>
                            {t.title}
                          </div>
                          <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "2px" }}>
                            {t.timestamp} &bull; Ref: {t.reference}
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          {t.amountCoins !== undefined && (
                            <div style={{ fontSize: "14px", fontWeight: 800, color: "var(--accent-champagne)" }}>
                              {t.amountCoins >= 0 ? "+" : ""}{t.amountCoins} Coins
                            </div>
                          )}
                          {t.amountPoints !== undefined && (
                            <div style={{ fontSize: "14px", fontWeight: 800, color: "var(--accent-lavender)" }}>
                              {t.amountPoints >= 0 ? "+" : ""}{t.amountPoints} Pts
                            </div>
                          )}
                          {t.amountFiat && (
                            <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>
                              {t.amountFiat}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: PREMIUM & SUBSCRIPTIONS */}
          {activeTab === 7 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderRadius: "14px",
                  border: "1px solid var(--border)",
                  padding: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                    Current Subscription Tier
                  </span>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--accent-champagne)", marginTop: "4px" }}>
                    {user.premium.planName}
                  </div>
                  <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "4px" }}>
                    Status: <strong style={{ color: "var(--status-success)" }}>{user.premium.status.toUpperCase()}</strong>
                  </div>
                </div>

                {user.premium.isPremium && (
                  <div style={{ textAlign: "right", fontSize: "12.5px" }}>
                    <div><strong>Start Date:</strong> {user.premium.startDate.substring(0, 10)}</div>
                    <div><strong>Next Renewal:</strong> {user.premium.nextRenewalDate.substring(0, 10)}</div>
                    <div><strong>Rate:</strong> {user.premium.price} ({user.premium.currency})</div>
                  </div>
                )}
              </div>

              {/* Billing History */}
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)", marginBottom: "10px" }}>
                  Billing Invoices & Receipts
                </h4>
                {user.premium.billingHistory.length === 0 ? (
                  <div style={{ padding: "30px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
                    No billing history on record for this member.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {user.premium.billingHistory.map((inv) => (
                      <div
                        key={inv.id}
                        style={{
                          padding: "12px 14px",
                          borderRadius: "10px",
                          backgroundColor: "var(--bg-surface)",
                          border: "1px solid var(--border)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>
                            {inv.plan}
                          </div>
                          <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                            {inv.date} &bull; {inv.paymentMethod}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--text-main)" }}>
                            {inv.amount}
                          </span>
                          <span
                            style={{
                              marginLeft: "8px",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              backgroundColor: "rgba(20, 132, 95, 0.12)",
                              color: "var(--status-success)",
                              fontSize: "11px",
                              fontWeight: 700,
                            }}
                          >
                            PAID
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 8: REFERRAL HISTORY */}
          {activeTab === 8 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderRadius: "14px",
                  border: "1px solid var(--border)",
                  padding: "18px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                    Personal Referral Code
                  </span>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--primary)", letterSpacing: "0.05em", marginTop: "4px" }}>
                    {user.referral.referralCode}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                    NobleBond Rule: Only referrer earns reward (+50 Connection Points upon new user verification).
                  </div>
                </div>

                <div style={{ display: "flex", gap: "14px", textAlign: "center" }}>
                  <div>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)" }}>
                      {user.referral.totalReferred}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Invited</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--status-success)" }}>
                      {user.referral.successful}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Qualified</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--accent-lavender)" }}>
                      +{user.referral.pointsEarned}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Points Earned</div>
                  </div>
                </div>
              </div>

              {/* Referred Friends Table/Cards */}
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)", marginBottom: "10px" }}>
                  Referred Members & Status
                </h4>
                {user.referral.history.length === 0 ? (
                  <div style={{ padding: "30px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
                    No referred members recorded yet.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {user.referral.history.map((h) => (
                      <div
                        key={h.id}
                        style={{
                          padding: "12px 14px",
                          borderRadius: "10px",
                          backgroundColor: "var(--bg-surface)",
                          border: "1px solid var(--border)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          {h.avatar && (
                            <img
                              src={h.avatar}
                              alt={h.referredUser}
                              style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "cover" }}
                            />
                          )}
                          <div>
                            <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>
                              {h.referredUser} ({h.username})
                            </div>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                              Joined {h.date} &bull; {h.note}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span
                            style={{
                              padding: "3px 8px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: 700,
                              backgroundColor:
                                h.status === "qualified"
                                  ? "rgba(20, 132, 95, 0.12)"
                                  : "rgba(181, 139, 66, 0.12)",
                              color:
                                h.status === "qualified"
                                  ? "var(--status-success)"
                                  : "var(--status-warning)",
                            }}
                          >
                            {h.status === "qualified" ? "+50 PTS CREDITED" : "PENDING"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 9: MODERATION HISTORY */}
          {activeTab === 9 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderRadius: "14px",
                  border: "1px solid var(--border)",
                  padding: "18px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                    Moderation Standing: {user.moderation.currentStatus}
                  </h4>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                    Reports against: <strong>{user.moderation.reportsAgainstCount}</strong> &bull; Reports filed:{" "}
                    <strong>{user.moderation.reportsFiledCount}</strong> &bull; Warnings:{" "}
                    <strong>{user.moderation.warningsCount}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenAddNote(user)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    backgroundColor: "var(--accent-lavender)",
                    color: "#FFFFFF",
                    border: "none",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Plus size={14} />
                  <span>Add Admin Note</span>
                </button>
              </div>

              {/* Internal Notes Panel */}
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)", marginBottom: "10px" }}>
                  Internal Administrator Notes ({user.moderation.notes.length})
                </h4>
                {user.moderation.notes.length === 0 ? (
                  <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "12.5px" }}>
                    No internal notes logged for this user.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {user.moderation.notes.map((n) => (
                      <div
                        key={n.id}
                        style={{
                          padding: "14px",
                          borderRadius: "10px",
                          backgroundColor: "var(--bg-surface)",
                          border: "1px solid var(--border)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>
                            {n.title}
                          </span>
                          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                            {n.date} &bull; {n.author}
                          </span>
                        </div>
                        <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                          {n.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Moderation Records */}
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)", marginBottom: "10px" }}>
                  Disciplinary Action History
                </h4>
                {user.moderation.history.length === 0 ? (
                  <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "12.5px" }}>
                    Exemplary record: No warnings, suspensions or restrictions on file.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {user.moderation.history.map((m) => (
                      <div
                        key={m.id}
                        style={{
                          padding: "12px 14px",
                          borderRadius: "10px",
                          backgroundColor: "var(--bg-surface)",
                          border: "1px solid var(--border)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--status-danger)" }}>
                            {m.action} {m.duration ? `(${m.duration})` : ""}
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                            Reason: {m.reason}
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                            {m.date} &bull; Assigned by {m.moderator}
                          </div>
                        </div>

                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 700,
                            backgroundColor:
                              m.status === "active"
                                ? "rgba(201, 54, 79, 0.12)"
                                : "rgba(20, 132, 95, 0.12)",
                            color:
                              m.status === "active"
                                ? "var(--status-danger)"
                                : "var(--status-success)",
                          }}
                        >
                          {m.status.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
