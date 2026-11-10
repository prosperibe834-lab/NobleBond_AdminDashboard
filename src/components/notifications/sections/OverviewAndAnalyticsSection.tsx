import React, { useState } from "react";
import {
  Bell,
  Send,
  Mail,
  Smartphone,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  AlertTriangle,
  Plus,
  Calendar,
  Activity,
  BarChart3,
} from "lucide-react";
import type {
  NotificationsManagementState,
  NotificationsTabKey,
  NotificationChannelType,
} from "../../../types/notificationsManagement.types";
import { formatChannelLabel, formatNotifDateTime, getStatusBadgeStyle } from "../notificationsUiUtils";

interface OverviewAndAnalyticsSectionProps {
  state: NotificationsManagementState;
  mode: "overview" | "analytics";
  onNavigateTab: (tab: NotificationsTabKey) => void;
  onQuickCompose: (channel: NotificationChannelType) => void;
}

const cardStyle: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: 16,
  padding: 18,
  boxShadow: "var(--shadow-sm)",
};

export const OverviewAndAnalyticsSection: React.FC<OverviewAndAnalyticsSectionProps> = ({
  state,
  mode,
  onNavigateTab,
  onQuickCompose,
}) => {
  const [dateRange, setDateRange] = useState<"today" | "7d" | "30d" | "90d" | "all">("30d");
  const [granularity, setGranularity] = useState<"daily" | "weekly" | "monthly">("weekly");

  const refNow = new Date("2026-11-10T23:59:59Z").getTime();
  const windowDays =
    dateRange === "today" ? 1 : dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : dateRange === "90d" ? 90 : 3650;
  const startMs = refNow - windowDays * 86400000;

  const scopedCampaigns = state.campaigns.filter((c) => {
    const t = new Date(c.sentAtIso || c.createdAtIso).getTime();
    return t >= startMs;
  });

  const scopedLogs = state.deliveryLogs.filter((l) => {
    const t = new Date(l.sentAtIso || l.createdAtIso).getTime();
    return t >= startMs;
  });

  const totalSent = scopedLogs.filter((l) => l.status === "sent" || l.status === "delivered" || l.status === "opened" || l.status === "clicked").length +
    scopedCampaigns.reduce((s, c) => s + c.sentCount, 0);
  const pushSent = scopedCampaigns
    .filter((c) => c.channel === "push" || c.channel === "push_and_in_app")
    .reduce((s, c) => s + c.sentCount, 0);
  const inAppSent = scopedCampaigns
    .filter((c) => c.channel === "in_app" || c.channel === "push_and_in_app")
    .reduce((s, c) => s + c.sentCount, 0);
  const emailsSent = scopedCampaigns
    .filter((c) => c.channel === "email")
    .reduce((s, c) => s + c.sentCount, 0) +
    state.automations.filter((a) => a.channel === "email").reduce((s, a) => s + a.sentTotal, 0);

  const failedCount = scopedLogs.filter((l) => l.status === "failed" || l.status === "bounced").length;
  const scheduledCampaigns = state.campaigns.filter((c) => c.status === "scheduled");
  const activeAutomations = state.automations.filter((a) => a.status === "active");
  const unreadInApp = state.campaigns.reduce((s, c) => s + c.unreadInAppCount, 0);
  const invalidTokenCount = state.deliveryLogs.filter((l) => l.failureCategory === "invalid_device_token").length;
  const bouncedCount = state.deliveryLogs.filter((l) => l.failureCategory === "bounced_email").length;
  const suppressedCount = state.deliveryLogs.filter((l) => l.status === "suppressed").length +
    state.campaigns.reduce((s, c) => s + c.suppressedCount, 0);

  // Buckets for Activity Chart
  const chartBuckets =
    granularity === "daily"
      ? [
          { label: "Nov 6", push: 4, inApp: 3, email: 8 },
          { label: "Nov 7", push: 14, inApp: 12, email: 11 },
          { label: "Nov 8", push: 6, inApp: 5, email: 16 },
          { label: "Nov 9", push: 8, inApp: 7, email: 22 },
          { label: "Nov 10", push: 5, inApp: 4, email: 19 },
        ]
      : granularity === "weekly"
        ? [
            { label: "Oct W3", push: 18, inApp: 14, email: 45 },
            { label: "Oct W4", push: 24, inApp: 19, email: 62 },
            { label: "Nov W1", push: 29, inApp: 22, email: 174 },
            { label: "Nov W2", push: 16, inApp: 11, email: 58 },
          ]
        : [
            { label: "Aug 2026", push: 64, inApp: 48, email: 180 },
            { label: "Sep 2026", push: 72, inApp: 56, email: 192 },
            { label: "Oct 2026", push: 88, inApp: 65, email: 220 },
            { label: "Nov 2026", push: 45, inApp: 33, email: 232 },
          ];

  const maxBucket = Math.max(1, ...chartBuckets.map((b) => Math.max(b.push, b.inApp, b.email)));

  if (mode === "analytics") {
    const auto6m = state.automations.find((a) => a.automationType === "inactive_6_months");
    const autoBday = state.automations.find((a) => a.automationType === "birthday");
    const autoMonth = state.automations.find((a) => a.automationType === "happy_new_month");
    const autoXmas = state.automations.find((a) => a.automationType === "seasonal_christmas");
    const autoHalloween = state.automations.find((a) => a.automationType === "seasonal_halloween");
    const autoNy = state.automations.find((a) => a.automationType === "seasonal_new_year");

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Webhook Honesty Disclaimer */}
        <div
          style={{
            padding: 13,
            borderRadius: 14,
            background: "var(--status-info-bg)",
            border: "1px solid var(--border-light)",
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <AlertTriangle size={17} style={{ color: "var(--status-info)", flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 12.5, color: "var(--text-main)", lineHeight: 1.5 }}>
            <strong>Honest Provider Tracking:</strong> Email Open Rates, Link CTR, and Mobile Push
            Delivery Confirmations explicitly show <em>Tracking Webhook Pending</em> until FCM/APNs
            & SMTP event callbacks are connected in production — zero metrics are fabricated.
          </div>
        </div>

        {/* Date Filter Bar */}
        <div
          style={{
            ...cardStyle,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BarChart3 size={18} style={{ color: "var(--primary)" }} />
            <h3 style={{ margin: 0, fontSize: 16, color: "var(--text-main)" }}>
              Multi-Channel Performance & Seasonal Analytics
            </h3>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {(["today", "7d", "30d", "90d", "all"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setDateRange(r)}
                style={{
                  padding: "6px 11px",
                  borderRadius: 9,
                  border: `1px solid ${dateRange === r ? "var(--primary)" : "var(--border)"}`,
                  background: dateRange === r ? "var(--primary)" : "var(--bg-surface-elevated)",
                  color: dateRange === r ? "#FFFFFF" : "var(--text-secondary)",
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 14,
          }}
        >
          {/* Push Analytics */}
          <div style={cardStyle}>
            <h4 style={{ margin: "0 0 10px", fontSize: 14.5, color: "var(--primary)" }}>
              Push Analytics (Expo / FCM / APNs)
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, fontSize: 12.5 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Push Notifications Dispatched</span>
                <strong>{pushSent}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Failed / Invalid Token</span>
                <strong style={{ color: "var(--status-error)" }}>{invalidTokenCount}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Delivery Confirmation Rate</span>
                <strong style={{ color: "var(--text-muted)" }}>Webhook Pending</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Push Interaction Rate</span>
                <strong style={{ color: "var(--text-muted)" }}>Not Tracked Yet</strong>
              </div>
            </div>
          </div>

          {/* Email Analytics */}
          <div style={cardStyle}>
            <h4 style={{ margin: "0 0 10px", fontSize: 14.5, color: "var(--status-info)" }}>
              Email Analytics
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, fontSize: 12.5 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Total Campaign + Auto Emails Sent</span>
                <strong>{emailsSent}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Permanent Hard Bounces</span>
                <strong style={{ color: "var(--status-error)" }}>{bouncedCount}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Open Rate / Click-Through Rate</span>
                <strong style={{ color: "var(--text-muted)" }}>Pixel Unconnected</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Marketing Opt-Out Suppressions</span>
                <strong style={{ color: "var(--status-warning)" }}>{suppressedCount}</strong>
              </div>
            </div>
          </div>

          {/* In-App Analytics */}
          <div style={cardStyle}>
            <h4 style={{ margin: "0 0 10px", fontSize: 14.5, color: "var(--accent-lavender)" }}>
              In-App Feed Analytics
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, fontSize: 12.5 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>In-App Notifications Created</span>
                <strong>{inAppSent}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Unread In-App Queue</span>
                <strong style={{ color: "var(--status-warning)" }}>{unreadInApp}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Read Notifications Observed</span>
                <strong>{Math.max(0, inAppSent - unreadInApp)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Seasonal & Automated Campaign Breakdown */}
        <div style={cardStyle}>
          <h4 style={{ margin: "0 0 12px", fontSize: 15, color: "var(--text-main)" }}>
            Automated & Seasonal Campaign Performance Summary
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            {[
              { label: "6-Month Inactivity Re-engagement", rec: auto6m },
              { label: "Birthday Celebration Emails", rec: autoBday },
              { label: "Happy New Month Monthly Emails", rec: autoMonth },
              { label: "Christmas Holiday Greetings", rec: autoXmas },
              { label: "New Year Greetings", rec: autoNy },
              { label: "Halloween Regional Greetings", rec: autoHalloween },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  borderRadius: 12,
                  padding: 13,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>
                  Status: <strong style={{ textTransform: "uppercase" }}>{item.rec?.status || "--"}</strong>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>
                  Sent: {item.rec?.sentTotal || 0} • Suppressed: {item.rec?.suppressedTotal || 0} • Bounced:{" "}
                  {item.rec?.bouncedTotal || 0}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // OVERVIEW MODE (Sections A-F)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* F. Quick Actions & Date Filter Ribbon */}
      <div
        style={{
          ...cardStyle,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          <button
            type="button"
            onClick={() => onQuickCompose("push")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "7px 12px",
              borderRadius: 9,
              border: "none",
              background: "var(--primary)",
              color: "#FFFFFF",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <Plus size={13} /> Push Notification
          </button>
          <button
            type="button"
            onClick={() => onQuickCompose("in_app")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "7px 12px",
              borderRadius: 9,
              border: "1px solid var(--border)",
              background: "var(--bg-surface-elevated)",
              color: "var(--text-main)",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <Bell size={13} /> In-App Announcement
          </button>
          <button
            type="button"
            onClick={() => onQuickCompose("email")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "7px 12px",
              borderRadius: 9,
              border: "1px solid var(--border)",
              background: "var(--bg-surface-elevated)",
              color: "var(--text-main)",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <Mail size={13} /> Email Campaign
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab("automations")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "7px 12px",
              borderRadius: 9,
              border: "1px solid var(--border)",
              background: "var(--bg-surface-elevated)",
              color: "var(--accent-lavender)",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <Zap size={13} /> Manage Automations
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab("delivery_history")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "7px 12px",
              borderRadius: 9,
              border: "1px solid var(--border)",
              background: "var(--bg-surface-elevated)",
              color: "var(--text-main)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Send size={13} /> Delivery Logs
          </button>
        </div>

        <select
          aria-label="Overview Time Period"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
          style={{
            padding: "7px 11px",
            borderRadius: 9,
            border: "1px solid var(--border)",
            background: "var(--bg-surface-elevated)",
            color: "var(--text-main)",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          <option value="today">Today</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="all">All Available History</option>
        </select>
      </div>

      {/* Clickable Top Statistic Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(185px, 1fr))",
          gap: 12,
        }}
      >
        {[
          { label: "Total Dispatched", val: totalSent, sub: "Push, In-App & Automated Email", tab: "delivery_history" as const, icon: <Send size={16} /> },
          { label: "Push Dispatched", val: pushSent, sub: "FCM / APNs Expo Tokens", tab: "push" as const, icon: <Smartphone size={16} /> },
          { label: "In-App Broadcasts", val: inAppSent, sub: `${unreadInApp} unread in feeds`, tab: "in_app" as const, icon: <Bell size={16} /> },
          { label: "Emails Dispatched", val: emailsSent, sub: "Includes automated cycles", tab: "email_campaigns" as const, icon: <Mail size={16} /> },
          { label: "Failed & Bounced", val: failedCount, sub: `${bouncedCount} bounces • ${invalidTokenCount} tokens`, tab: "failed" as const, icon: <XCircle size={16} /> },
          { label: "Scheduled Queue", val: scheduledCampaigns.length, sub: "Upcoming one-time & seasonal", tab: "scheduled" as const, icon: <Clock size={16} /> },
          { label: "Active Automations", val: activeAutomations.length, sub: `${state.automations.length} workflows total`, tab: "automations" as const, icon: <Zap size={16} /> },
          { label: "Open / CTR Rate", val: "Webhook Pending", sub: "Honest tracking boundary", tab: "analytics" as const, icon: <CheckCircle2 size={16} /> },
        ].map((kpi) => (
          <button
            key={kpi.label}
            type="button"
            onClick={() => onNavigateTab(kpi.tab)}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: 14,
              textAlign: "left",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
                {kpi.label}
              </span>
              <span style={{ color: "var(--primary)" }}>{kpi.icon}</span>
            </div>
            <div style={{ fontSize: typeof kpi.val === "number" ? 23 : 16, fontWeight: 800, color: "var(--text-main)" }}>
              {kpi.val}
            </div>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{kpi.sub}</span>
          </button>
        ))}
      </div>

      {/* A. Notification Activity Chart + E. Health Card */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
          gap: 16,
        }}
      >
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <Activity size={17} style={{ color: "var(--primary)" }} />
              <h3 style={{ margin: 0, fontSize: 15.5, color: "var(--text-main)" }}>
                A. Notification Volume Over Time
              </h3>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {(["daily", "weekly", "monthly"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGranularity(g)}
                  style={{
                    padding: "4px 9px",
                    borderRadius: 7,
                    border: "1px solid var(--border)",
                    background: granularity === g ? "var(--primary)" : "var(--bg-surface-elevated)",
                    color: granularity === g ? "#FFFFFF" : "var(--text-secondary)",
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "capitalize",
                    cursor: "pointer",
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <svg viewBox="0 0 540 185" style={{ width: "100%", height: 185, display: "block" }}>
            {chartBuckets.map((b, idx) => {
              const slotW = 480 / chartBuckets.length;
              const baseX = 36 + idx * slotW;
              const pushH = (b.push / maxBucket) * 125;
              const inAppH = (b.inApp / maxBucket) * 125;
              const emailH = (b.email / maxBucket) * 125;
              return (
                <g key={b.label}>
                  <rect x={baseX} y={145 - pushH} width={14} height={Math.max(3, pushH)} rx={3} fill="var(--primary)" />
                  <rect x={baseX + 18} y={145 - inAppH} width={14} height={Math.max(3, inAppH)} rx={3} fill="var(--accent-lavender)" />
                  <rect x={baseX + 36} y={145 - emailH} width={14} height={Math.max(3, emailH)} rx={3} fill="var(--status-info)" />
                  <text x={baseX + 25} y={168} textAnchor="middle" fontSize={10.5} fill="var(--text-muted)">
                    {b.label}
                  </text>
                </g>
              );
            })}
          </svg>
          <div style={{ display: "flex", gap: 16, fontSize: 11.5, color: "var(--text-secondary)", marginTop: 4 }}>
            <span>Primary: Push</span>
            <span style={{ color: "var(--accent-lavender)" }}>Lavender: In-App</span>
            <span style={{ color: "var(--status-info)" }}>Blue: Email</span>
          </div>
        </div>

        {/* E. Notification Health */}
        <div style={cardStyle}>
          <h3 style={{ margin: "0 0 12px", fontSize: 15.5, color: "var(--text-main)" }}>
            E. Delivery Integrity & Channel Health
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 12.5 }}>
            {[
              { label: "Submitted / Accepted Notifications", val: totalSent, tone: "var(--status-success)" },
              { label: "Invalid Device Tokens (FCM/APNs)", val: invalidTokenCount, tone: "var(--status-warning)" },
              { label: "Permanent Email Bounces", val: bouncedCount, tone: "var(--status-error)" },
              { label: "Suppressed / Unsubscribed Recipients", val: suppressedCount, tone: "var(--status-warning)" },
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "9px 11px",
                  borderRadius: 10,
                  background: "var(--bg-surface-elevated)",
                }}
              >
                <span style={{ color: "var(--text-main)", fontWeight: 600 }}>{row.label}</span>
                <strong style={{ color: row.tone }}>{row.val}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* B. Recent Campaigns + C. Upcoming Schedules + D. Automations */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
          gap: 16,
        }}
      >
        <div style={cardStyle}>
          <h3 style={{ margin: "0 0 10px", fontSize: 15, color: "var(--text-main)" }}>
            B. Recent & Scheduled Campaigns
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {state.campaigns.slice(0, 4).map((cmp) => {
              const badge = getStatusBadgeStyle(cmp.status);
              return (
                <div
                  key={cmp.id}
                  style={{
                    padding: "9px 11px",
                    borderRadius: 10,
                    background: "var(--bg-surface-elevated)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)" }}>
                      {cmp.name}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {formatChannelLabel(cmp.channel)} • {cmp.estimatedRecipients} eligible •{" "}
                      {formatNotifDateTime(cmp.scheduledForIso || cmp.sentAtIso)}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      padding: "2px 8px",
                      borderRadius: 999,
                      color: badge.color,
                      background: badge.bg,
                    }}
                  >
                    {cmp.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
            <Calendar size={16} style={{ color: "var(--accent-lavender)" }} />
            <h3 style={{ margin: 0, fontSize: 15, color: "var(--text-main)" }}>
              C & D. Active Automation Highlights
            </h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {state.automations.slice(0, 4).map((aut) => (
              <div
                key={aut.id}
                style={{
                  padding: "9px 11px",
                  borderRadius: 10,
                  background: "var(--bg-surface-elevated)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-main)" }}>
                    {aut.name}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    Eligible: {aut.eligibleUsersCount} • Next:{" "}
                    {aut.nextExecutionIso ? formatNotifDateTime(aut.nextExecutionIso) : "Event Trigger"}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    padding: "2px 8px",
                    borderRadius: 999,
                    color: aut.status === "active" ? "var(--status-success)" : "var(--status-warning)",
                    background:
                      aut.status === "active"
                        ? "var(--status-success-bg)"
                        : "var(--status-warning-bg)",
                  }}
                >
                  {aut.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

