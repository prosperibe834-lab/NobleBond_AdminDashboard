import React, { useState } from "react";
import { Smartphone, Bell, Mail, Plus, Copy, XCircle, Eye, Send } from "lucide-react";
import type {
  NotificationCampaignRecord,
  NotificationChannelType,
  NotificationsManagementState,
} from "../../../types/notificationsManagement.types";
import { formatChannelLabel, formatNotifDateTime, getStatusBadgeStyle } from "../notificationsUiUtils";
import type { DispatchConfirmRequest } from "../NotificationsConfirmModal";

interface ChannelCampaignsSectionProps {
  state: NotificationsManagementState;
  mode: "push" | "in_app" | "email_campaigns";
  onCreateNewForChannel: (ch: NotificationChannelType) => void;
  onEditInComposer: (cmp: NotificationCampaignRecord) => void;
  onDuplicateCampaign: (cmp: NotificationCampaignRecord) => void;
  onCancelCampaign: (cmpId: string) => void;
  onSendCampaignNow: (cmp: NotificationCampaignRecord) => void;
  onRequestDispatchConfirm: (req: DispatchConfirmRequest) => void;
}

const cardStyle: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: 16,
  padding: 18,
  boxShadow: "var(--shadow-sm)",
};

export const ChannelCampaignsSection: React.FC<ChannelCampaignsSectionProps> = ({
  state,
  mode,
  onCreateNewForChannel,
  onEditInComposer,
  onDuplicateCampaign,
  onCancelCampaign,
  onSendCampaignNow,
  onRequestDispatchConfirm,
}) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const targetChannel: NotificationChannelType =
    mode === "push" ? "push" : mode === "in_app" ? "in_app" : "email";

  const scopedCampaigns = state.campaigns.filter((c) => {
    const channelMatch =
      mode === "push"
        ? c.channel === "push" || c.channel === "push_and_in_app"
        : mode === "in_app"
          ? c.channel === "in_app" || c.channel === "push_and_in_app"
          : c.channel === "email";
    if (!channelMatch) return false;
    const q = search.trim().toLowerCase();
    if (q && !c.name.toLowerCase().includes(q) && !c.title.toLowerCase().includes(q)) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    return true;
  });

  const meta =
    mode === "push"
      ? {
          title: "Mobile Push Notifications (Expo / FCM / APNs)",
          sub: "Manage OS lock-screen and banner campaigns targeting eligible verified & opted-in devices.",
          icon: <Smartphone size={18} style={{ color: "var(--primary)" }} />,
          btnLabel: "Create Push Notification",
        }
      : mode === "in_app"
        ? {
            title: "In-App Notification Feed & Broadcast Announcements",
            sub: "Manage inside-app announcements displayed in NobleBond NotificationsScreen alongside (never replacing) mutual-match & security event feeds.",
            icon: <Bell size={18} style={{ color: "var(--accent-lavender)" }} />,
            btnLabel: "Create In-App Announcement",
          }
        : {
            title: "Email Campaigns",
            sub: "Branded NobleBond email broadcasts honoring subscriber consent, verified email rules, and one-click unsubscribe headers.",
            icon: <Mail size={18} style={{ color: "var(--status-info)" }} />,
            btnLabel: "Create Email Campaign",
          };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {meta.icon}
              <h3 style={{ margin: 0, fontSize: 16.5, color: "var(--text-main)" }}>{meta.title}</h3>
            </div>
            <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--text-secondary)" }}>
              {meta.sub}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onCreateNewForChannel(targetChannel)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 10,
              border: "none",
              background: "var(--primary)",
              color: "#FFFFFF",
              fontSize: 12.5,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <Plus size={14} />
            <span>{meta.btnLabel}</span>
          </button>
        </div>

        {/* Search & Filter Row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          <input
            type="text"
            placeholder="Search campaign title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: "1 1 220px",
              padding: "8px 11px",
              borderRadius: 9,
              border: "1px solid var(--border)",
              background: "var(--bg-surface-elevated)",
              color: "var(--text-main)",
              fontSize: 12.5,
            }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "8px 11px",
              borderRadius: 9,
              border: "1px solid var(--border)",
              background: "var(--bg-surface-elevated)",
              color: "var(--text-main)",
              fontSize: 12.5,
            }}
          >
            <option value="all">All Statuses</option>
            <option value="sent">Sent</option>
            <option value="scheduled">Scheduled</option>
            <option value="draft">Draft</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Campaign List Cards (Mobile + Desktop Clean) */}
        {scopedCampaigns.length === 0 ? (
          <div style={{ padding: 18, fontSize: 13, color: "var(--text-muted)" }}>
            No {formatChannelLabel(targetChannel)} campaigns match the active filters.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {scopedCampaigns.map((cmp) => {
              const badge = getStatusBadgeStyle(cmp.status);
              return (
                <div
                  key={cmp.id}
                  style={{
                    padding: 14,
                    borderRadius: 12,
                    background: "var(--bg-surface-elevated)",
                    border: "1px solid var(--border-light)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 8,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--text-main)" }}>
                        {cmp.name}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--primary)", marginTop: 2 }}>
                        {cmp.channel === "email" ? cmp.emailSubject : cmp.title}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "3px 9px",
                        borderRadius: 999,
                        color: badge.color,
                        background: badge.bg,
                      }}
                    >
                      {cmp.status}
                    </span>
                  </div>

                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    {cmp.channel === "email" ? cmp.emailBody : cmp.message}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 10,
                      paddingTop: 8,
                      borderTop: "1px solid var(--border-light)",
                      fontSize: 11.5,
                      color: "var(--text-muted)",
                    }}
                  >
                    <span>
                      Audience: <strong>{cmp.audienceSegment.replace(/_/g, " ")}</strong> •{" "}
                      {cmp.estimatedRecipients} eligible ({cmp.suppressedCount} suppressed) • Sent:{" "}
                      {cmp.sentCount} •{" "}
                      {cmp.scheduledForIso
                        ? `Scheduled: ${formatNotifDateTime(cmp.scheduledForIso)}`
                        : `Updated: ${formatNotifDateTime(cmp.updatedAtIso)}`}
                    </span>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => onEditInComposer(cmp)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "5px 10px",
                          borderRadius: 8,
                          border: "1px solid var(--border)",
                          background: "var(--bg-card)",
                          color: "var(--text-main)",
                          fontSize: 11.5,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        <Eye size={12} /> Preview / Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => onDuplicateCampaign(cmp)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "5px 10px",
                          borderRadius: 8,
                          border: "1px solid var(--border)",
                          background: "var(--bg-card)",
                          color: "var(--text-main)",
                          fontSize: 11.5,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        <Copy size={12} /> Duplicate
                      </button>

                      {(cmp.status === "draft" || cmp.status === "scheduled") && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              onRequestDispatchConfirm({
                                title: `Confirm Send: "${cmp.name}"`,
                                channelLabel: formatChannelLabel(cmp.channel),
                                audienceLabel: cmp.audienceSegment.replace(/_/g, " "),
                                estimatedRecipients: cmp.estimatedRecipients,
                                suppressedCount: cmp.suppressedCount,
                                confirmButtonText: "Confirm Demo Dispatch",
                                onConfirm: () => onSendCampaignNow(cmp),
                              })
                            }
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              padding: "5px 10px",
                              borderRadius: 8,
                              border: "none",
                              background: "var(--primary)",
                              color: "#FFFFFF",
                              fontSize: 11.5,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            <Send size={12} /> Send Now
                          </button>
                          <button
                            type="button"
                            onClick={() => onCancelCampaign(cmp.id)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              padding: "5px 10px",
                              borderRadius: 8,
                              border: "1px solid var(--border)",
                              background: "var(--status-error-bg)",
                              color: "var(--status-error)",
                              fontSize: 11.5,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            <XCircle size={12} /> Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

