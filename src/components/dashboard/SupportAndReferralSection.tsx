import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Headset,
  Gift,
  ChevronRight,
} from "lucide-react";
import type { DashboardMetricsSnapshot } from "../../data/dashboardDataService";
import { Badge } from "../common/Badge";

interface SupportAndReferralSectionProps {
  data: DashboardMetricsSnapshot;
}

export const SupportAndReferralSection: React.FC<SupportAndReferralSectionProps> = ({
  data,
}) => {
  const navigate = useNavigate();
  const refSummary = data.referralSummary;

  const mockTickets = [
    {
      id: "tkt_501",
      customer: "Sarah James",
      category: "Billing / Coins",
      priority: "medium" as const,
      status: "in_progress",
      date: "12m ago",
    },
    {
      id: "tkt_502",
      customer: "Jayden Taylor",
      category: "KYC Document ID",
      priority: "urgent" as const,
      status: "open",
      date: "35m ago",
    },
    {
      id: "tkt_503",
      customer: "Tobi Adebayo",
      category: "Referral Link Code",
      priority: "low" as const,
      status: "resolved",
      date: "2h ago",
    },
  ];

  const recentReferrals = [
    {
      referrer: "Emily Carter",
      newFriend: "Sophie_L",
      date: "18m ago",
      verified: true,
      points: "+50 Pts",
    },
    {
      referrer: "David King",
      newFriend: "Chuka_M",
      date: "44m ago",
      verified: true,
      points: "+50 Pts",
    },
    {
      referrer: "Zara Love",
      newFriend: "Jessica_W",
      date: "1h ago",
      verified: false,
      points: "Pending Phone SMS",
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
      {/* 1. CUSTOMER SUPPORT SUMMARY */}
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
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Headset size={18} color="var(--status-warning)" />
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
                Customer Support & Inquiries
              </h3>
            </div>
            <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
              Inbound ticket queue and customer satisfaction telemetry
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/support")}
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
            All Tickets <ChevronRight size={14} />
          </button>
        </div>

        {/* SLA Telemetry Bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            padding: "12px",
            borderRadius: "12px",
            backgroundColor: "var(--bg-surface-elevated)",
            border: "1px solid var(--border-light)",
            fontSize: "12.5px",
          }}
        >
          <div>
            <span style={{ color: "var(--text-secondary)", fontSize: "11px", fontWeight: 600 }}>FIRST RESPONSE TIME</span>
            <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--status-success)", marginTop: "2px" }}>
              14m 20s
            </div>
          </div>
          <div>
            <span style={{ color: "var(--text-secondary)", fontSize: "11px", fontWeight: 600 }}>OPEN / IN PROGRESS</span>
            <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>
              9 Tickets (2 Urgent)
            </div>
          </div>
        </div>

        {/* Ticket List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {mockTickets.map((t) => (
            <div
              key={t.id}
              onClick={() => navigate("/support")}
              style={{
                padding: "12px 14px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-focus)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-light)";
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>
                    {t.customer}
                  </span>
                  <Badge variant={t.priority === "urgent" ? "error" : "neutral"}>
                    {t.category}
                  </Badge>
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
                  Ref: {t.id} • {t.date}
                </div>
              </div>

              <Badge variant={t.status === "resolved" ? "success" : t.status === "in_progress" ? "warning" : "error"}>
                {t.status.replace("_", " ")}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* 2. REFERRAL PERFORMANCE (INVITE & EARN) */}
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
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Gift size={18} color="var(--primary)" />
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)" }}>
                Invite & Earn (Referral Program)
              </h3>
            </div>
            <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
              50 Connection Points awarded to referrer upon friend ID/SMS verification
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/referrals")}
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
            Rules & Pts <ChevronRight size={14} />
          </button>
        </div>

        {/* 4-Stat Metric Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            padding: "12px",
            borderRadius: "12px",
            backgroundColor: "var(--bg-surface-elevated)",
            border: "1px solid var(--border-light)",
            fontSize: "12.5px",
          }}
        >
          <div>
            <span style={{ color: "var(--text-secondary)", fontSize: "11px", fontWeight: 600 }}>QUALIFIED REFERRALS</span>
            <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--status-success)", marginTop: "2px" }}>
              {refSummary.qualifiedReferrals.toLocaleString()} ({refSummary.conversionRate})
            </div>
          </div>
          <div>
            <span style={{ color: "var(--text-secondary)", fontSize: "11px", fontWeight: 600 }}>POINTS DISTRIBUTED</span>
            <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--primary)", marginTop: "2px" }}>
              {refSummary.pointsAwarded.toLocaleString()} Pts
            </div>
          </div>
        </div>

        {/* Recent Referrals Activity List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {recentReferrals.map((ref, idx) => (
            <div
              key={idx}
              onClick={() => navigate("/referrals")}
              style={{
                padding: "12px 14px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-focus)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-light)";
              }}
            >
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>
                  {ref.referrer} invited {ref.newFriend}
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
                  {ref.date} • {ref.verified ? "Phone Verified" : "Pending Verification"}
                </div>
              </div>

              <Badge variant={ref.verified ? "success" : "warning"}>
                {ref.points}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
