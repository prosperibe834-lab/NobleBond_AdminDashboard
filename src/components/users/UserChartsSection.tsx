import React, { useState } from "react";
import {
  BarChart3,
  PieChart as PieIcon,
  Smartphone,
  Award,
  ChevronDown,
  ChevronUp,
  Calendar,
} from "lucide-react";
import type { NobleUser } from "../../types/userManagement.types";
import { calculateAge } from "../../data/userManagementDataService";

interface UserChartsSectionProps {
  users: NobleUser[];
}

export const UserChartsSection: React.FC<UserChartsSectionProps> = ({ users }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [trendRange, setTrendRange] = useState<"daily" | "weekly" | "monthly">("daily");

  // Gender Distribution
  let maleCount = 0;
  let femaleCount = 0;
  let otherCount = 0;
  let preferNotCount = 0;

  // Age Distribution
  let age18to24 = 0;
  let age25to34 = 0;
  let age35to44 = 0;
  let age45to54 = 0;
  let age55plus = 0;

  // Device Distribution
  let iosCount = 0;
  let androidCount = 0;
  let webCount = 0;

  // Status Distribution
  let activeCount = 0;
  let suspendedCount = 0;
  let bannedCount = 0;
  let pendingCount = 0;

  // Premium Distribution
  let freeCount = 0;
  let weeklyCount = 0;
  let monthlyCount = 0;
  let yearlyCount = 0;

  // Referral Performance
  let referralSuccess = 0;
  let referralPending = 0;
  let referralRejected = 0;

  users.forEach((u) => {
    // Gender
    if (u.gender === "male") maleCount++;
    else if (u.gender === "female") femaleCount++;
    else if (u.gender === "other") otherCount++;
    else preferNotCount++;

    // Age
    const age = calculateAge(u.dateOfBirth);
    if (age <= 24) age18to24++;
    else if (age <= 34) age25to34++;
    else if (age <= 44) age35to44++;
    else if (age <= 54) age45to54++;
    else age55plus++;

    // Device
    u.devices.forEach((d) => {
      if (d.platform === "ios") iosCount++;
      else if (d.platform === "android") androidCount++;
      else webCount++;
    });

    // Status
    if (u.status === "active" || u.status === "online" || u.status === "offline") activeCount++;
    else if (u.status === "suspended") suspendedCount++;
    else if (u.status === "banned") bannedCount++;
    else if (u.status === "pending_verification") pendingCount++;

    // Premium
    if (!u.premium.isPremium) freeCount++;
    else if (u.premium.tier === "weekly") weeklyCount++;
    else if (u.premium.tier === "monthly") monthlyCount++;
    else if (u.premium.tier === "yearly") yearlyCount++;

    // Referral
    referralSuccess += u.referral.successful;
    referralPending += u.referral.pending;
    referralRejected += u.referral.rejected;
  });

  const totalUsers = users.length || 1;
  const totalDevices = iosCount + androidCount + webCount || 1;
  const totalReferrals = referralSuccess + referralPending + referralRejected || 1;

  // Mock trend bars
  const trendData = {
    daily: [
      { label: "Mon", count: 48 },
      { label: "Tue", count: 62 },
      { label: "Wed", count: 55 },
      { label: "Thu", count: 82 },
      { label: "Fri", count: 94 },
      { label: "Sat", count: 120 },
      { label: "Sun", count: 110 },
    ],
    weekly: [
      { label: "W1", count: 420 },
      { label: "W2", count: 510 },
      { label: "W3", count: 640 },
      { label: "W4", count: 720 },
    ],
    monthly: [
      { label: "Jul", count: 1840 },
      { label: "Aug", count: 2150 },
      { label: "Sep", count: 2600 },
      { label: "Oct", count: 2980 },
      { label: "Nov", count: 3420 },
    ],
  };

  const activeTrendBars = trendData[trendRange];
  const maxTrend = Math.max(...activeTrendBars.map((b) => b.count));

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        borderRadius: "16px",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-card)",
        padding: "16px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Header and Collapse Toggle */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              backgroundColor: "rgba(193, 47, 102, 0.08)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BarChart3 size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
              User Demographics & Analytics
            </h3>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0 }}>
              Real-time distributions across gender, age cohorts, platform telemetry, and referral health
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Trend Range Buttons */}
          <div
            style={{
              display: "flex",
              backgroundColor: "var(--bg-surface)",
              borderRadius: "8px",
              padding: "2px",
              border: "1px solid var(--border)",
            }}
          >
            {(["daily", "weekly", "monthly"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setTrendRange(r)}
                style={{
                  padding: "4px 10px",
                  fontSize: "11.5px",
                  fontWeight: 600,
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: trendRange === r ? "var(--primary)" : "transparent",
                  color: trendRange === r ? "#FFFFFF" : "var(--text-secondary)",
                  cursor: "pointer",
                  textTransform: "capitalize",
                  transition: "all 0.15s ease",
                }}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "6px 10px",
              fontSize: "12px",
              fontWeight: 600,
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-main)",
              cursor: "pointer",
            }}
          >
            {isCollapsed ? (
              <>
                <span>Expand Charts</span>
                <ChevronDown size={14} />
              </>
            ) : (
              <>
                <span>Collapse</span>
                <ChevronUp size={14} />
              </>
            )}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {/* 1. Registration Velocity Chart */}
          <div
            style={{
              backgroundColor: "var(--bg-surface)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>
                Registration Trend
              </span>
              <Calendar size={14} color="var(--text-muted)" />
            </div>

            {/* Bar columns */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "8px",
                height: "100px",
                paddingTop: "10px",
              }}
            >
              {activeTrendBars.map((item, idx) => {
                const heightPct = Math.round((item.count / maxTrend) * 100);
                return (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                      height: "100%",
                      justifyContent: "flex-end",
                    }}
                  >
                    <span style={{ fontSize: "9.5px", color: "var(--text-muted)", fontWeight: 600 }}>
                      {item.count}
                    </span>
                    <div
                      style={{
                        width: "100%",
                        height: `${heightPct}%`,
                        backgroundColor: "var(--primary)",
                        borderRadius: "4px 4px 0 0",
                        transition: "height 0.3s ease",
                      }}
                    />
                    <span style={{ fontSize: "10px", color: "var(--text-secondary)", fontWeight: 600 }}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Account Status row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "8px",
                borderTop: "1px solid var(--border)",
                fontSize: "11px",
              }}
            >
              <span style={{ color: "var(--status-success)" }}>Active: {activeCount}</span>
              <span style={{ color: "var(--status-warning)" }}>Pending: {pendingCount}</span>
              <span style={{ color: "var(--status-danger)" }}>Suspended: {suspendedCount + bannedCount}</span>
            </div>
          </div>

          {/* 2. Age & Gender Cohorts */}
          <div
            style={{
              backgroundColor: "var(--bg-surface)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>
                Age Cohorts (DOB Derived)
              </span>
              <PieIcon size={14} color="var(--text-muted)" />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {[
                { label: "18-24 yrs", count: age18to24, color: "var(--primary)" },
                { label: "25-34 yrs", count: age25to34, color: "var(--accent-lavender)" },
                { label: "35-44 yrs", count: age35to44, color: "var(--accent-champagne)" },
                { label: "45-54 yrs", count: age45to54, color: "var(--status-info)" },
                { label: "55+ yrs", count: age55plus, color: "var(--text-muted)" },
              ].map((tier, idx) => {
                const pct = Math.round((tier.count / totalUsers) * 100);
                return (
                  <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "11px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <span>{tier.label}</span>
                      <span style={{ fontWeight: 700, color: "var(--text-main)" }}>
                        {tier.count} ({pct}%)
                      </span>
                    </div>
                    <div
                      style={{
                        height: "5px",
                        borderRadius: "3px",
                        backgroundColor: "var(--border)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          backgroundColor: tier.color,
                          borderRadius: "3px",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Gender split summary */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "6px",
                borderTop: "1px solid var(--border)",
                fontSize: "10.5px",
                color: "var(--text-secondary)",
              }}
            >
              <span>Female: {femaleCount} ({Math.round((femaleCount / totalUsers) * 100)}%)</span>
              <span>Male: {maleCount} ({Math.round((maleCount / totalUsers) * 100)}%)</span>
              <span>Other: {otherCount + preferNotCount}</span>
            </div>
          </div>

          {/* 3. Device & Platform Telemetry */}
          <div
            style={{
              backgroundColor: "var(--bg-surface)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>
                Device Telemetry
              </span>
              <Smartphone size={14} color="var(--text-muted)" />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { label: "Apple iOS", count: iosCount, color: "#7C68E8" },
                { label: "Android OS", count: androidCount, color: "#14845F" },
                { label: "Web / Desktop", count: webCount, color: "#B58B42" },
              ].map((dev, idx) => {
                const pct = Math.round((dev.count / totalDevices) * 100);
                return (
                  <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "11.5px",
                      }}
                    >
                      <span style={{ color: "var(--text-secondary)" }}>{dev.label}</span>
                      <span style={{ fontWeight: 700, color: "var(--text-main)" }}>
                        {dev.count} ({pct}%)
                      </span>
                    </div>
                    <div
                      style={{
                        height: "8px",
                        borderRadius: "4px",
                        backgroundColor: "var(--border)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          backgroundColor: dev.color,
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                backgroundColor: "var(--bg-card)",
                padding: "6px 8px",
                borderRadius: "6px",
                marginTop: "auto",
              }}
            >
              Hardware models and OS versions verified via client telemetry.
            </div>
          </div>

          {/* 4. Subscriptions & Referral Conversion */}
          <div
            style={{
              backgroundColor: "var(--bg-surface)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>
                Subscription & Referrals
              </span>
              <Award size={14} color="var(--text-muted)" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <div
                style={{
                  backgroundColor: "var(--bg-card)",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                }}
              >
                <div style={{ fontSize: "10.5px", color: "var(--text-muted)", fontWeight: 600 }}>
                  VIP Subscriptions
                </div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--accent-champagne)", marginTop: "2px" }}>
                  {yearlyCount + monthlyCount + weeklyCount}
                </div>
                <div style={{ fontSize: "9.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
                  {yearlyCount} yr | {monthlyCount} mo | {weeklyCount} wk
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "var(--bg-card)",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                }}
              >
                <div style={{ fontSize: "10.5px", color: "var(--text-muted)", fontWeight: 600 }}>
                  Free Members
                </div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>
                  {freeCount}
                </div>
                <div style={{ fontSize: "9.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
                  {Math.round((freeCount / totalUsers) * 100)}% of user base
                </div>
              </div>
            </div>

            {/* Referral Progress */}
            <div style={{ display: "flex", flexDirection: "column", gap: "3px", marginTop: "auto" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                }}
              >
                <span>Referral Success Rate (50 Pts/qualified)</span>
                <span style={{ fontWeight: 700, color: "var(--status-success)" }}>
                  {Math.round((referralSuccess / totalReferrals) * 100)}%
                </span>
              </div>
              <div
                style={{
                  height: "8px",
                  borderRadius: "4px",
                  backgroundColor: "var(--border)",
                  display: "flex",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.round((referralSuccess / totalReferrals) * 100)}%`,
                    backgroundColor: "var(--status-success)",
                  }}
                  title="Qualified"
                />
                <div
                  style={{
                    width: `${Math.round((referralPending / totalReferrals) * 100)}%`,
                    backgroundColor: "var(--status-warning)",
                  }}
                  title="Pending verification"
                />
                <div
                  style={{
                    width: `${Math.round((referralRejected / totalReferrals) * 100)}%`,
                    backgroundColor: "var(--status-danger)",
                  }}
                  title="Rejected"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "9.5px",
                  color: "var(--text-muted)",
                  marginTop: "2px",
                }}
              >
                <span>{referralSuccess} Qualified</span>
                <span>{referralPending} Pending</span>
                <span>{referralRejected} Rejected</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
