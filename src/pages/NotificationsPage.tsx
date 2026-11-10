import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  PenSquare,
  Smartphone,
  Bell,
  Mail,
  Zap,
  Calendar,
  Repeat,
  BookOpen,
  Users,
  Send,
  AlertOctagon,
  BarChart3,
  Sliders,
  History,
  RefreshCw,
  WifiOff,
  CheckCircle2,
} from "lucide-react";
import {
  appendNotificationAudit,
  buildNewDraftCampaignDefaults,
  createCampaignRecordInService,
  loadNotificationsState,
  saveNotificationsState,
  saveTemplateRecordInService,
} from "../data/notificationsManagementDataService";
import type {
  AutomationWorkflowRecord,
  NotificationCampaignRecord,
  NotificationChannelType,
  NotificationProgramPreferences,
  NotificationTemplateRecord,
  NotificationsManagementState,
  NotificationsTabKey,
} from "../types/notificationsManagement.types";
import { NotificationsSkeletonLoader } from "../components/notifications/NotificationsSkeletonLoader";
import {
  NotificationsConfirmModal,
  type DispatchConfirmRequest,
} from "../components/notifications/NotificationsConfirmModal";
import { OverviewAndAnalyticsSection } from "../components/notifications/sections/OverviewAndAnalyticsSection";
import {
  ComposerAndTemplatesSection,
  type ComposerDraftInput,
} from "../components/notifications/sections/ComposerAndTemplatesSection";
import { ChannelCampaignsSection } from "../components/notifications/sections/ChannelCampaignsSection";
import { AutomationsScheduleRecurringSection } from "../components/notifications/sections/AutomationsScheduleRecurringSection";
import { AudienceDeliveryFailedSettingsAuditSection } from "../components/notifications/sections/AudienceDeliveryFailedSettingsAuditSection";

const TABS: Array<{ key: NotificationsTabKey; label: string; icon: React.ReactNode }> = [
  { key: "overview", label: "Overview", icon: <LayoutDashboard size={13} /> },
  { key: "composer", label: "Composer & Live Preview", icon: <PenSquare size={13} /> },
  { key: "push", label: "Push", icon: <Smartphone size={13} /> },
  { key: "in_app", label: "In-App", icon: <Bell size={13} /> },
  { key: "email_campaigns", label: "Email Campaigns", icon: <Mail size={13} /> },
  { key: "automations", label: "Automations", icon: <Zap size={13} /> },
  { key: "scheduled", label: "Scheduled", icon: <Calendar size={13} /> },
  { key: "recurring", label: "Recurring", icon: <Repeat size={13} /> },
  { key: "templates", label: "Templates", icon: <BookOpen size={13} /> },
  { key: "audience", label: "Audience", icon: <Users size={13} /> },
  { key: "delivery_history", label: "Delivery History", icon: <Send size={13} /> },
  { key: "failed", label: "Failed", icon: <AlertOctagon size={13} /> },
  { key: "analytics", label: "Analytics", icon: <BarChart3 size={13} /> },
  { key: "settings", label: "Settings", icon: <Sliders size={13} /> },
  { key: "audit_history", label: "Audit History", icon: <History size={13} /> },
];

function createDefaultComposerInput(channel: NotificationChannelType = "push"): ComposerDraftInput {
  const base = buildNewDraftCampaignDefaults(channel);
  return {
    name: base.name,
    channel: base.channel,
    category: base.category,
    audienceSegment: base.audienceSegment,
    targetCountries: base.targetCountries,
    targetLanguage: base.targetLanguage,
    targetPlatform: base.targetPlatform,
    title: base.title,
    message: base.message,
    imageUrl: "",
    iconKey: base.iconKey || "bell",
    ctaLabel: base.ctaLabel || "Open NobleBond",
    deepLinkRoute: base.deepLinkRoute,
    emailSubject: base.emailSubject || "",
    emailPreviewText: base.emailPreviewText || "",
    emailHeading: base.emailHeading || "",
    emailBody: base.emailBody || "",
    emailBannerUrl: "",
    emailCtaText: base.emailCtaText || "Open NobleBond",
    emailCtaDestination: base.emailCtaDestination || "noblebond://discover",
    emailFooter: base.emailFooter || "",
    recurrence: base.recurrence,
    scheduledDate: "2026-11-18",
    scheduledTime: "15:00",
    timezone: "UTC",
  };
}

export const NotificationsPage: React.FC = () => {
  const [notifState, setNotifState] = useState<NotificationsManagementState>(() =>
    loadNotificationsState()
  );
  const [activeTab, setActiveTab] = useState<NotificationsTabKey>("overview");
  const [composerDraft, setComposerDraft] = useState<ComposerDraftInput>(() =>
    createDefaultComposerInput("push")
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [dispatchConfirm, setDispatchConfirm] = useState<DispatchConfirmRequest | null>(null);
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.setTimeout(() => {
      setNotifState(loadNotificationsState());
      setIsRefreshing(false);
      setToast("Synchronized campaigns, audience counts, automations & delivery queues.");
    }, 340);
  };

  const handleQuickCompose = (channel: NotificationChannelType) => {
    setComposerDraft(createDefaultComposerInput(channel));
    setActiveTab("composer");
  };

  const handleSaveCampaignFromComposer = (
    payload: Parameters<typeof createCampaignRecordInService>[1],
    actionMode: "draft" | "schedule" | "send_now"
  ) => {
    const next = createCampaignRecordInService(notifState, payload, actionMode, "Sarah Alexander");
    setNotifState(next);
    if (actionMode === "draft") {
      setToast(`Saved "${payload.name}" cleanly to Drafts.`);
    } else if (actionMode === "schedule") {
      setToast(`Scheduled "${payload.name}" cleanly (View in Scheduled Campaigns).`);
      setActiveTab("scheduled");
    } else {
      setToast(
        `Queued "${payload.name}" in local demonstration dispatch (${payload.estimatedRecipients} eligible). Connect FCM/APNs/SMTP for production sending.`
      );
      setActiveTab("delivery_history");
    }
  };

  const handleSendTestNotice = (channel: NotificationChannelType, deviceLabel: string) => {
    setToast(
      `Simulated Test Dispatch sent via ${channel.replace(/_/g, " ")} to "${deviceLabel}". (Demo preview only — connect backend push/SMTP provider for live transmission.)`
    );
  };

  const handleSaveTemplate = (tpl: Omit<NotificationTemplateRecord, "updatedAtIso">) => {
    const next = saveTemplateRecordInService(notifState, tpl, "Sarah Alexander");
    setNotifState(next);
    setToast(`Template "${tpl.name}" saved cleanly.`);
  };

  const handleUseTemplateInComposer = (tpl: NotificationTemplateRecord) => {
    setComposerDraft({
      ...createDefaultComposerInput(tpl.channel),
      name: `${tpl.name} Campaign`,
      category: tpl.category,
      title: tpl.titleOrSubject,
      message: tpl.bodyContent,
      ctaLabel: tpl.ctaLabel,
      deepLinkRoute: tpl.destination,
      emailSubject: tpl.titleOrSubject,
      emailHeading: tpl.titleOrSubject,
      emailBody: tpl.bodyContent,
      emailCtaText: tpl.ctaLabel,
    });
    setActiveTab("composer");
    setToast(`Loaded template "${tpl.name}" into Notification Composer & Live Preview.`);
  };

  const handleEditInComposer = (cmp: NotificationCampaignRecord) => {
    setComposerDraft({
      name: cmp.name,
      channel: cmp.channel,
      category: cmp.category,
      audienceSegment: cmp.audienceSegment,
      targetCountries: cmp.targetCountries,
      targetLanguage: cmp.targetLanguage,
      targetPlatform: cmp.targetPlatform,
      title: cmp.title,
      message: cmp.message,
      imageUrl: cmp.imageUrl || "",
      iconKey: cmp.iconKey || "bell",
      ctaLabel: cmp.ctaLabel || "Open NobleBond",
      deepLinkRoute: cmp.deepLinkRoute || "/discover",
      emailSubject: cmp.emailSubject || cmp.title,
      emailPreviewText: cmp.emailPreviewText || cmp.message,
      emailHeading: cmp.emailHeading || cmp.title,
      emailBody: cmp.emailBody || cmp.message,
      emailBannerUrl: cmp.emailBannerUrl || "",
      emailCtaText: cmp.emailCtaText || cmp.ctaLabel || "Open NobleBond",
      emailCtaDestination: cmp.emailCtaDestination || "noblebond://discover",
      emailFooter:
        cmp.emailFooter ||
        "Manage email preferences or unsubscribe anytime in NobleBond Settings.",
      recurrence: cmp.recurrence,
      scheduledDate: (cmp.scheduledForIso || "2026-11-20").slice(0, 10),
      scheduledTime: (cmp.scheduledForIso || "2026-11-20T14:00:00Z").slice(11, 16),
      timezone: cmp.timezone || "UTC",
    });
    setActiveTab("composer");
  };

  const handleDuplicateCampaign = (cmp: NotificationCampaignRecord) => {
    const next = createCampaignRecordInService(
      notifState,
      {
        ...cmp,
        name: `${cmp.name} (Copy)`,
        status: "draft",
      },
      "draft",
      "Sarah Alexander"
    );
    setNotifState(next);
    setToast(`Duplicated "${cmp.name}" into Drafts.`);
  };

  const handleCancelCampaign = (cmpId: string) => {
    const target = notifState.campaigns.find((c) => c.id === cmpId);
    const nextCampaigns = notifState.campaigns.map((c) =>
      c.id === cmpId ? { ...c, status: "cancelled" as const } : c
    );
    const next = appendNotificationAudit(
      { ...notifState, campaigns: nextCampaigns },
      {
        actorName: "Sarah Alexander",
        actorRole: "Super Administrator",
        actionType: "campaign_cancelled",
        targetName: target?.name || cmpId,
        summary: "Cancelled scheduled campaign before dispatch.",
      }
    );
    setNotifState(next);
    setToast(`Cancelled "${target?.name}".`);
  };

  const handleSendExistingCampaignNow = (cmp: NotificationCampaignRecord) => {
    const nextCampaigns = notifState.campaigns.map((c) =>
      c.id === cmp.id
        ? {
            ...c,
            status: "sent" as const,
            sentCount: cmp.estimatedRecipients,
            sentAtIso: new Date().toISOString(),
          }
        : c
    );
    const next = appendNotificationAudit(
      { ...notifState, campaigns: nextCampaigns },
      {
        actorName: "Sarah Alexander",
        actorRole: "Super Administrator",
        actionType: "campaign_sent_demo",
        targetName: cmp.name,
        summary: `Dispatched existing campaign to ${cmp.estimatedRecipients} eligible demo members.`,
      }
    );
    setNotifState(next);
    setToast(`Dispatched "${cmp.name}" in local demonstration mode.`);
  };

  const handleToggleAutomation = (autId: string) => {
    const target = notifState.automations.find((a) => a.id === autId);
    const nextStatus =
      target?.status === "paused" || target?.status === "draft"
        ? target.automationType.startsWith("seasonal_")
          ? ("scheduled" as const)
          : ("active" as const)
        : ("paused" as const);
    const nextAutos = notifState.automations.map((a) =>
      a.id === autId ? { ...a, status: nextStatus } : a
    );
    const next = appendNotificationAudit(
      { ...notifState, automations: nextAutos },
      {
        actorName: "Sarah Alexander",
        actorRole: "Super Administrator",
        actionType: "automation_toggled",
        targetName: target?.name || autId,
        summary: `Automation status transitioned to ${nextStatus.toUpperCase()}.`,
      }
    );
    setNotifState(next);
    setToast(`Automation "${target?.name}" set to ${nextStatus.toUpperCase()}.`);
  };

  const handleUpdateAutomation = (updatedAut: AutomationWorkflowRecord) => {
    const nextAutos = notifState.automations.map((a) =>
      a.id === updatedAut.id ? updatedAut : a
    );
    const next = appendNotificationAudit(
      { ...notifState, automations: nextAutos },
      {
        actorName: "Sarah Alexander",
        actorRole: "Super Administrator",
        actionType: "automation_updated",
        targetName: updatedAut.name,
        summary: `Updated rules, timing (${updatedAut.sendTimeLocal} ${updatedAut.defaultTimezone}), and template content.`,
      }
    );
    setNotifState(next);
    setToast(`Saved configuration for "${updatedAut.name}".`);
  };

  const handlePreviewAutomationEmail = (aut: AutomationWorkflowRecord) => {
    setComposerDraft({
      ...createDefaultComposerInput("email"),
      name: aut.name,
      category:
        aut.automationType === "inactive_6_months" ? "Re-engagement" : "Special Events",
      emailSubject: aut.emailSubject,
      emailPreviewText: aut.triggerDescription,
      emailHeading: aut.emailHeading,
      emailBody: aut.emailBody,
      emailCtaText: aut.emailCtaLabel,
      emailCtaDestination: aut.emailCtaUrl,
      targetCountries: aut.targetCountries,
    });
    setActiveTab("composer");
    setToast(`Previewing "${aut.name}" email template inside Responsive Email Preview.`);
  };

  const handleRetryDelivery = (logId: string) => {
    const target = notifState.deliveryLogs.find((l) => l.id === logId);
    if (!target || !target.retryEligible) return;
    const nextLogs = notifState.deliveryLogs.map((l) =>
      l.id === logId
        ? {
            ...l,
            retryCount: l.retryCount + 1,
            status: "queued" as const,
            failureReason: `Queued retry #${l.retryCount + 1} (Demo simulation)`,
          }
        : l
    );
    const next = appendNotificationAudit(
      { ...notifState, deliveryLogs: nextLogs },
      {
        actorName: "Sarah Alexander",
        actorRole: "Super Administrator",
        actionType: "retry_attempted",
        targetName: logId,
        summary: `Queued eligible retry for transient device failure (${target.campaignName}).`,
      }
    );
    setNotifState(next);
    setToast(`Re-queued delivery ${logId} for transient token retry check.`);
  };

  const handleMarkFailureReviewed = (logId: string) => {
    const nextLogs = notifState.deliveryLogs.map((l) =>
      l.id === logId ? { ...l, reviewedByAdmin: true } : l
    );
    setNotifState(saveNotificationsState({ ...notifState, deliveryLogs: nextLogs }));
    setToast(`Marked ${logId} as reviewed.`);
  };

  const handleSavePrefs = (prefs: NotificationProgramPreferences) => {
    const stamped = { ...prefs, lastUpdatedAtIso: new Date().toISOString() };
    const next = appendNotificationAudit(
      { ...notifState, preferences: stamped },
      {
        actorName: "Sarah Alexander",
        actorRole: "Super Administrator",
        actionType: "settings_updated",
        targetName: "Notification Frequency & Quiet Hours",
        summary: `Push cap: ${prefs.maxPromotionalPushPerDay}/day | Email cap: ${prefs.maxMarketingEmailsPerDay}/day | Quiet: ${prefs.quietHoursEnabled ? `${prefs.quietHoursStart}-${prefs.quietHoursEnd}` : "Off"}`,
      }
    );
    setNotifState(next);
    setToast("Saved Notification Settings & Frequency Limits cleanly.");
  };

  return (
    <div
      className="animate-fade-in"
      style={{ display: "flex", flexDirection: "column", gap: 16, paddingBottom: 32 }}
    >
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 23, fontWeight: 800, color: "var(--text-main)" }}>
            Notifications & Campaign Automation Centre
          </h1>
          <p style={{ margin: "3px 0 0", fontSize: 13, color: "var(--text-secondary)" }}>
            Create, preview live on iPhone 18 Pro Max (Dynamic Island) & Android, schedule, and
            automate Push, In-App, and Email campaigns across NobleBond.
          </p>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => handleQuickCompose("push")}
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
            <PenSquare size={14} />
            <span>Open Composer</span>
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 13px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--bg-card)",
              color: "var(--text-main)",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <RefreshCw
              size={13}
              style={{ animation: isRefreshing ? "spin 0.8s linear infinite" : undefined }}
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Browser Network Offline & Feedback Ribbons */}
      {!isOnline && (
        <div
          role="status"
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            background: "var(--status-warning-bg)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: 9,
            fontSize: 12.5,
          }}
        >
          <WifiOff size={16} style={{ color: "var(--status-warning)" }} />
          <span>
            <strong>Offline Browser Detected:</strong> Notification queues and templates are saved
            locally; real dispatch requires server connectivity.
          </span>
        </div>
      )}

      {toast && (
        <div
          role="status"
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            background: "var(--status-info-bg)",
            border: "1px solid var(--border-light)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            fontSize: 12.5,
            color: "var(--text-main)",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
            <CheckCircle2 size={15} style={{ color: "var(--status-info)", flexShrink: 0 }} />
            {toast}
          </span>
          <button
            type="button"
            onClick={() => setToast(null)}
            style={{
              border: "none",
              background: "transparent",
              color: "var(--primary)",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 15-Section Responsive Pill Navigation Bar */}
      <div
        role="tablist"
        aria-label="Notifications Management Sections"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          padding: 10,
          borderRadius: 16,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 11px",
                borderRadius: 10,
                border: active ? "1px solid var(--primary)" : "1px solid transparent",
                background: active ? "var(--primary)" : "var(--bg-surface-elevated)",
                color: active ? "#FFFFFF" : "var(--text-secondary)",
                fontSize: 12,
                fontWeight: active ? 700 : 600,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Workspace (with Shimmer Skeletons during Sync Refresh) */}
      {isRefreshing ? (
        <NotificationsSkeletonLoader />
      ) : (
        <>
          {(activeTab === "overview" || activeTab === "analytics") && (
            <OverviewAndAnalyticsSection
              state={notifState}
              mode={activeTab}
              onNavigateTab={setActiveTab}
              onQuickCompose={handleQuickCompose}
            />
          )}

          {(activeTab === "composer" || activeTab === "templates") && (
            <ComposerAndTemplatesSection
              state={notifState}
              mode={activeTab}
              draft={composerDraft}
              onChangeDraft={setComposerDraft}
              onSaveCampaign={handleSaveCampaignFromComposer}
              onSendTestNotice={handleSendTestNotice}
              onSaveTemplate={handleSaveTemplate}
              onUseTemplateInComposer={handleUseTemplateInComposer}
              onRequestDispatchConfirm={setDispatchConfirm}
            />
          )}

          {(activeTab === "push" ||
            activeTab === "in_app" ||
            activeTab === "email_campaigns") && (
            <ChannelCampaignsSection
              state={notifState}
              mode={activeTab}
              onCreateNewForChannel={handleQuickCompose}
              onEditInComposer={handleEditInComposer}
              onDuplicateCampaign={handleDuplicateCampaign}
              onCancelCampaign={handleCancelCampaign}
              onSendCampaignNow={handleSendExistingCampaignNow}
              onRequestDispatchConfirm={setDispatchConfirm}
            />
          )}

          {(activeTab === "automations" ||
            activeTab === "scheduled" ||
            activeTab === "recurring") && (
            <AutomationsScheduleRecurringSection
              state={notifState}
              mode={activeTab}
              onToggleAutomationStatus={handleToggleAutomation}
              onUpdateAutomation={handleUpdateAutomation}
              onPreviewAutomationEmail={handlePreviewAutomationEmail}
              onCancelScheduledCampaign={handleCancelCampaign}
            />
          )}

          {(activeTab === "audience" ||
            activeTab === "delivery_history" ||
            activeTab === "failed" ||
            activeTab === "settings" ||
            activeTab === "audit_history") && (
            <AudienceDeliveryFailedSettingsAuditSection
              key={`${activeTab}-${notifState.lastSyncedAtIso}`}
              state={notifState}
              mode={activeTab}
              onRetryDelivery={handleRetryDelivery}
              onMarkFailureReviewed={handleMarkFailureReviewed}
              onSavePreferences={handleSavePrefs}
            />
          )}
        </>
      )}

      {/* Pre-Flight Consent & Dispatch Confirmation Dialog */}
      <NotificationsConfirmModal
        request={dispatchConfirm}
        onCancel={() => setDispatchConfirm(null)}
      />
    </div>
  );
};

export default NotificationsPage;
