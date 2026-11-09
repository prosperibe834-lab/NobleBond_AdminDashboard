import React from "react";
import { useNavigate } from "react-router-dom";
import {
  History,
  Users,
  ShieldAlert,
  Radio,
  Crown,
  Wallet,
  Gift,
  Headset,
  Bell,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import type { AdminAuditRecord } from "../../types/dashboard.types";
import { Badge } from "../common/Badge";

interface AdminAuditAndQuickActionsProps {
  auditLogs: AdminAuditRecord[];
}

export const AdminAuditAndQuickActions: React.FC<AdminAuditAndQuickActionsProps> = ({
  auditLogs,
}) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: "qa_users",
      title: "View Users",
      desc: "Directory of 1.28M registered accounts",
      icon: Users,
      link: "/users",
      color: "var(--primary)",
      bg: "rgba(193, 47, 102, 0.1)",
    },
    {
      id: "qa_reports",
      title: "Review Reports",
      desc: "Investigate 18 pending safety flags",
      icon: ShieldAlert,
      link: "/moderation",
      color: "var(--status-error)",
      bg: "var(--status-error-bg)",
    },
    {
      id: "qa_live",
      title: "Monitor Live",
      desc: "Manage 42 active streaming broadcasts",
      icon: Radio,
      link: "/live",
      color: "#EF4444",
      bg: "rgba(239, 68, 68, 0.12)",
    },
    {
      id: "qa_subscriptions",
      title: "Manage Subscriptions",
      desc: "Review 52.8k active Premium tiers",
      icon: Crown,
      link: "/subscriptions",
      color: "var(--accent-champagne)",
      bg: "var(--accent-champagne-bg)",
    },
    {
      id: "qa_wallet",
      title: "Wallet Transactions",
      desc: "Gift Coins & Connection Points logs",
      icon: Wallet,
      link: "/wallet",
      color: "var(--status-success)",
      bg: "var(--status-success-bg)",
    },
    {
      id: "qa_referrals",
      title: "Manage Referrals",
      desc: "Invite & Earn 50 Pts rules & status",
      icon: Gift,
      link: "/referrals",
      color: "var(--primary)",
      bg: "rgba(193, 47, 102, 0.1)",
    },
    {
      id: "qa_support",
      title: "Support Tickets",
      desc: "Customer inquiries and ticket queue",
      icon: Headset,
      link: "/support",
      color: "var(--status-warning)",
      bg: "var(--status-warning-bg)",
    },
    {
      id: "qa_notifications",
      title: "Create Notification",
      desc: "Dispatch in-app announcement push",
      icon: Bell,
      link: "/notifications",
      color: "var(--accent-lavender)",
      bg: "var(--accent-lavender-bg)",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
        gap: "20px",
      }}
    >
      {/* 1. RECENT ADMIN ACTIVITY AUDIT TRAIL */}
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
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <History size={18} color="var(--primary)" />
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
              Recent Administrative Audit Log
            </h3>
          </div>
          <Badge variant="neutral">Compliance Log</Badge>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {auditLogs.map((log) => (
            <div
              key={log.id}
              style={{
                padding: "12px 14px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <ShieldCheck size={13} color="var(--primary)" />
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>
                    {log.adminName}
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                    ({log.adminRole})
                  </span>
                </div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  {log.timestamp}
                </span>
              </div>

              <div style={{ fontSize: "12.5px", color: "var(--text-main)" }}>
                {log.action}
              </div>

              <div style={{ fontSize: "11px", color: "var(--primary)", fontWeight: 600 }}>
                Module: {log.targetModule}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. DASHBOARD QUICK ACTIONS GRID */}
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
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
            Administrative Quick Actions
          </h3>
          <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
            Direct operational access to core NobleBond platform modules
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "10px",
          }}
        >
          {quickActions.map((qa) => {
            const Icon = qa.icon;
            return (
              <div
                key={qa.id}
                onClick={() => navigate(qa.link)}
                style={{
                  padding: "12px 14px",
                  borderRadius: "12px",
                  backgroundColor: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  transition: "all 0.18s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.borderColor = "var(--border-focus)";
                  e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "var(--border-light)";
                  e.currentTarget.style.backgroundColor = "var(--bg-surface-elevated)";
                }}
              >
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "10px",
                    backgroundColor: qa.bg,
                    color: qa.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={17} />
                </div>

                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "var(--text-main)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {qa.title}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {qa.desc}
                  </div>
                </div>

                <ArrowRight size={13} color="var(--text-secondary)" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
