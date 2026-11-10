import React, { useState } from "react";
import {
  Send,
  Save,
  Clock,
  Smartphone,
  Mail,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Copy,
  Archive,
  Sparkles,
} from "lucide-react";
import { evaluateAudienceSegment } from "../../../data/notificationsManagementDataService";
import { loadSystemSettingsState } from "../../../data/systemSettingsDataService";
import type {
  AudienceSegmentPreset,
  DevicePreviewMode,
  NotificationCampaignCategory,
  NotificationCampaignRecord,
  NotificationChannelType,
  NotificationTemplateRecord,
  NotificationsManagementState,
  RecurrenceFrequency,
} from "../../../types/notificationsManagement.types";
import {
  ALLOWED_PERSONALIZATION_VARS,
  MOBILE_DEEP_LINKS,
  validateTemplateVariables,
} from "../notificationsUiUtils";
import { IPhone18ProMaxPreview } from "../IPhone18ProMaxPreview";
import { EmailCampaignPreview } from "../EmailCampaignPreview";
import type { DispatchConfirmRequest } from "../NotificationsConfirmModal";

export interface ComposerDraftInput {
  name: string;
  channel: NotificationChannelType;
  category: NotificationCampaignCategory;
  audienceSegment: AudienceSegmentPreset;
  targetCountries: string[];
  targetLanguage: string;
  targetPlatform: "all" | "ios" | "android" | "web";
  title: string;
  message: string;
  imageUrl?: string;
  iconKey: "heart" | "star" | "crown" | "bell" | "flame";
  ctaLabel: string;
  deepLinkRoute: string;
  emailSubject: string;
  emailPreviewText: string;
  emailHeading: string;
  emailBody: string;
  emailBannerUrl?: string;
  emailCtaText: string;
  emailCtaDestination: string;
  emailFooter: string;
  recurrence: RecurrenceFrequency;
  scheduledDate: string;
  scheduledTime: string;
  timezone: string;
}

interface ComposerAndTemplatesSectionProps {
  state: NotificationsManagementState;
  mode: "composer" | "templates";
  draft: ComposerDraftInput;
  onChangeDraft: (next: ComposerDraftInput) => void;
  onSaveCampaign: (
    payload: Omit<
      NotificationCampaignRecord,
      | "id"
      | "createdAtIso"
      | "updatedAtIso"
      | "sentCount"
      | "confirmedDeliveredCount"
      | "failedCount"
      | "bouncedCount"
      | "openRateTrackedPercent"
      | "clickRateTrackedPercent"
      | "unreadInAppCount"
    >,
    actionMode: "draft" | "schedule" | "send_now"
  ) => void;
  onSendTestNotice: (channel: NotificationChannelType, deviceLabel: string) => void;
  onSaveTemplate: (tpl: Omit<NotificationTemplateRecord, "updatedAtIso">) => void;
  onUseTemplateInComposer: (tpl: NotificationTemplateRecord) => void;
  onRequestDispatchConfirm: (req: DispatchConfirmRequest) => void;
}

const cardStyle: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: 16,
  padding: 18,
  boxShadow: "var(--shadow-sm)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 11px",
  borderRadius: 9,
  border: "1px solid var(--border)",
  background: "var(--bg-surface-elevated)",
  color: "var(--text-main)",
  fontSize: 12.5,
  outline: "none",
};

export const ComposerAndTemplatesSection: React.FC<ComposerAndTemplatesSectionProps> = ({
  state,
  mode,
  draft,
  onChangeDraft,
  onSaveCampaign,
  onSendTestNotice,
  onSaveTemplate,
  onUseTemplateInComposer,
  onRequestDispatchConfirm,
}) => {
  const [previewMode, setPreviewMode] = useState<DevicePreviewMode>("iphone_lock_screen");
  const [mobileComposerPane, setMobileComposerPane] = useState<"editor" | "preview">("editor");
  const [testDevice, setTestDevice] = useState("Sarah Alexander — iPhone 18 Pro Max (Test Token)");
  const [tplFilterGroup, setTplFilterGroup] = useState("all");
  const [newTplName, setNewTplName] = useState("");
  const [newTplOpen, setNewTplOpen] = useState(false);

  const sysSettings = loadSystemSettingsState();
  const appLogoAsset =
    sysSettings.branding.assets.find((a) => a.assetType === "app_icon")?.previewDataUrl ||
    sysSettings.branding.assets.find((a) => a.assetType === "app_icon")?.currentUrl;

  if (mode === "templates") {
    const filteredTemplates = state.templates.filter(
      (t) => tplFilterGroup === "all" || t.templateGroup === tplFilterGroup
    );

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
                <BookOpen size={18} style={{ color: "var(--primary)" }} />
                <h3 style={{ margin: 0, fontSize: 16.5, color: "var(--text-main)" }}>
                  Reusable Notification & Email Templates ({filteredTemplates.length})
                </h3>
              </div>
              <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--text-secondary)" }}>
                Variables validated before sending (`&#123;&#123;firstName&#125;&#125;`,
                `&#123;&#123;appName&#125;&#125;`, `&#123;&#123;referralCode&#125;&#125;`,
                `&#123;&#123;rewardAmount&#125;&#125;`). Historical sends stay immutable.
              </p>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <select
                value={tplFilterGroup}
                onChange={(e) => setTplFilterGroup(e.target.value)}
                style={{ ...inputStyle, width: "auto" }}
              >
                <option value="all">All Groups</option>
                <option value="Push">Push</option>
                <option value="In-App">In-App</option>
                <option value="Email">Email</option>
                <option value="Automated">Automated</option>
                <option value="Seasonal">Seasonal</option>
                <option value="Transactional">Transactional</option>
              </select>

              <button
                type="button"
                onClick={() => setNewTplOpen((p) => !p)}
                style={{
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
                + Save Composer as Template
              </button>
            </div>
          </div>

          {newTplOpen && (
            <div
              style={{
                marginBottom: 14,
                padding: 13,
                borderRadius: 12,
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border)",
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="New Template Name..."
                value={newTplName}
                onChange={(e) => setNewTplName(e.target.value)}
                style={{ ...inputStyle, flex: "1 1 220px" }}
              />
              <button
                type="button"
                disabled={!newTplName.trim()}
                onClick={() => {
                  onSaveTemplate({
                    id: "",
                    name: newTplName.trim(),
                    templateGroup:
                      draft.channel === "email"
                        ? "Email"
                        : draft.channel === "in_app"
                          ? "In-App"
                          : "Push",
                    channel: draft.channel,
                    category: draft.category,
                    titleOrSubject:
                      draft.channel === "email" ? draft.emailSubject : draft.title,
                    bodyContent:
                      draft.channel === "email" ? draft.emailBody : draft.message,
                    optionalImageUrl: draft.imageUrl,
                    ctaLabel:
                      draft.channel === "email" ? draft.emailCtaText : draft.ctaLabel,
                    destination: draft.deepLinkRoute,
                    language: draft.targetLanguage,
                    status: "active",
                    variablesUsed: ["firstName", "appName"],
                    usedInHistoricalCampaign: false,
                  });
                  setNewTplName("");
                  setNewTplOpen(false);
                }}
                style={{
                  padding: "8px 14px",
                  borderRadius: 9,
                  border: "none",
                  background: "var(--status-success)",
                  color: "#FFFFFF",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Save Active Composer Content
              </button>
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 12,
            }}
          >
            {filteredTemplates.map((tpl) => (
              <div
                key={tpl.id}
                style={{
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  borderRadius: 14,
                  padding: 14,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 6 }}>
                    <strong style={{ fontSize: 13.5, color: "var(--text-main)" }}>
                      {tpl.name}
                    </strong>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 999,
                        background:
                          tpl.status === "active"
                            ? "var(--status-success-bg)"
                            : "var(--bg-card)",
                        color:
                          tpl.status === "active"
                            ? "var(--status-success)"
                            : "var(--text-muted)",
                      }}
                    >
                      {tpl.templateGroup} • {tpl.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--primary)", marginTop: 6 }}>
                    {tpl.titleOrSubject}
                  </div>
                  <p style={{ margin: "4px 0", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.45 }}>
                    {tpl.bodyContent}
                  </p>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingTop: 8, borderTop: "1px solid var(--border-light)" }}>
                  <button
                    type="button"
                    onClick={() => onUseTemplateInComposer(tpl)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
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
                    <Sparkles size={11} /> Load in Composer
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onSaveTemplate({
                        ...tpl,
                        id: "",
                        name: `${tpl.name} (Copy)`,
                        usedInHistoricalCampaign: false,
                      })
                    }
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "5px 9px",
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: "var(--bg-card)",
                      color: "var(--text-main)",
                      fontSize: 11.5,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <Copy size={11} /> Duplicate
                  </button>
                  {tpl.status !== "archived" && (
                    <button
                      type="button"
                      onClick={() =>
                        onSaveTemplate({
                          ...tpl,
                          status: tpl.status === "active" ? "inactive" : "active",
                        })
                      }
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "5px 9px",
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                        background: "var(--bg-card)",
                        color: "var(--text-secondary)",
                        fontSize: 11.5,
                        cursor: "pointer",
                      }}
                    >
                      <Archive size={11} /> {tpl.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // NOTIFICATION COMPOSER SECTION
  const patch = (p: Partial<ComposerDraftInput>) => onChangeDraft({ ...draft, ...p });

  const audienceEval = evaluateAudienceSegment({
    segment: draft.audienceSegment,
    targetCountries: draft.targetCountries,
    targetPlatform: draft.targetPlatform,
    targetLanguage: draft.targetLanguage,
    channel: draft.channel,
  });

  const textToValidate =
    draft.channel === "email"
      ? `${draft.emailSubject} ${draft.emailHeading} ${draft.emailBody}`
      : `${draft.title} ${draft.message}`;
  const varCheck = validateTemplateVariables(textToValidate);

  const scheduledIso =
    draft.scheduledDate && draft.scheduledTime
      ? `${draft.scheduledDate}T${draft.scheduledTime}:00Z`
      : "2026-11-15T14:00:00Z";

  const buildPayload = () => ({
    name: draft.name.trim() || "Untitled NobleBond Notification",
    channel: draft.channel,
    category: draft.category,
    status: "draft" as const,
    audienceSegment: draft.audienceSegment,
    targetCountries: draft.targetCountries,
    targetLanguage: draft.targetLanguage,
    targetPlatform: draft.targetPlatform,
    title: draft.title,
    message: draft.message,
    imageUrl: draft.imageUrl,
    iconKey: draft.iconKey,
    ctaLabel: draft.ctaLabel,
    deepLinkRoute: draft.deepLinkRoute,
    emailSubject: draft.emailSubject,
    emailPreviewText: draft.emailPreviewText,
    emailHeading: draft.emailHeading,
    emailBody: draft.emailBody,
    emailBannerUrl: draft.emailBannerUrl,
    emailCtaText: draft.emailCtaText,
    emailCtaDestination: draft.emailCtaDestination,
    emailFooter: draft.emailFooter,
    recurrence: draft.recurrence,
    scheduledForIso: scheduledIso,
    timezone: draft.timezone,
    estimatedRecipients: audienceEval.eligibleCount,
    suppressedCount: audienceEval.suppressedTotal,
    createdBy: "Sarah Alexander",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Mobile / Narrow Screen Pane Toggle */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          ...cardStyle,
          padding: "12px 16px",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, alignItems: "center" }}>
          <strong style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>Channel:</strong>
          {(
            [
              { key: "push", label: "Push Notification", icon: <Smartphone size={13} /> },
              { key: "in_app", label: "In-App Notification", icon: <Sparkles size={13} /> },
              { key: "email", label: "Email Campaign", icon: <Mail size={13} /> },
              { key: "push_and_in_app", label: "Push + In-App", icon: <Send size={13} /> },
            ] as Array<{
              key: NotificationChannelType;
              label: string;
              icon: React.ReactNode;
            }>
          ).map((ch) => {
            const active = draft.channel === ch.key;
            return (
              <button
                key={ch.key}
                type="button"
                onClick={() => {
                  patch({ channel: ch.key });
                  if (ch.key === "in_app") setPreviewMode("in_app_preview");
                  else if (ch.key === "push") setPreviewMode("iphone_lock_screen");
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 12px",
                  borderRadius: 10,
                  border: `1px solid ${active ? "var(--primary)" : "var(--border)"}`,
                  background: active ? "var(--primary)" : "var(--bg-surface-elevated)",
                  color: active ? "#FFFFFF" : "var(--text-main)",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {ch.icon}
                <span>{ch.label}</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          <button
            type="button"
            onClick={() => setMobileComposerPane("editor")}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background:
                mobileComposerPane === "editor"
                  ? "var(--bg-active)"
                  : "var(--bg-surface-elevated)",
              color:
                mobileComposerPane === "editor" ? "var(--primary)" : "var(--text-secondary)",
              fontSize: 11.5,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Editor Form
          </button>
          <button
            type="button"
            onClick={() => setMobileComposerPane("preview")}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background:
                mobileComposerPane === "preview"
                  ? "var(--bg-active)"
                  : "var(--bg-surface-elevated)",
              color:
                mobileComposerPane === "preview" ? "var(--primary)" : "var(--text-secondary)",
              fontSize: 11.5,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Focus Live Preview
          </button>
        </div>
      </div>

      {/* Main Split Workspace: Side-by-Side Editor & Live Hardware Mockup */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            mobileComposerPane === "preview"
              ? "1fr"
              : "repeat(auto-fit, minmax(min(360px, 100%), 1fr))",
          gap: 18,
          alignItems: "start",
        }}
      >
        {/* LEFT COLUMN: Adaptive Notification / Email Editor + Audience + Dispatch Controls */}
        {mobileComposerPane === "editor" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={cardStyle}>
              <h3 style={{ margin: "0 0 12px", fontSize: 16, color: "var(--text-main)" }}>
                {draft.channel === "email"
                  ? "Email Content Editor"
                  : "Mobile Notification Editor (Updates Phone Live)"}
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 10,
                  }}
                >
                  <label style={{ fontSize: 12 }}>
                    <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                      Internal Campaign Name
                    </span>
                    <input
                      type="text"
                      value={draft.name}
                      onChange={(e) => patch({ name: e.target.value })}
                      style={{ ...inputStyle, marginTop: 4 }}
                    />
                  </label>

                  <label style={{ fontSize: 12 }}>
                    <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                      Notification Category
                    </span>
                    <select
                      value={draft.category}
                      onChange={(e) =>
                        patch({ category: e.target.value as NotificationCampaignCategory })
                      }
                      style={{ ...inputStyle, marginTop: 4 }}
                    >
                      <option value="Platform Announcements">Platform Announcements</option>
                      <option value="Live Sessions">Live Sessions</option>
                      <option value="Likes">Likes</option>
                      <option value="Matches">Matches</option>
                      <option value="Messages">Messages</option>
                      <option value="Gift Activity">Gift Activity</option>
                      <option value="Premium">Premium</option>
                      <option value="Referral Rewards">Referral Rewards</option>
                      <option value="Connection Points">Connection Points</option>
                      <option value="Special Events">Special Events</option>
                      <option value="Re-engagement">Re-engagement</option>
                      <option value="Account & Security">Account & Security</option>
                      <option value="Support">Support</option>
                    </select>
                  </label>
                </div>

                {/* Push & In-App Fields vs Dedicated Email Fields */}
                {draft.channel !== "email" ? (
                  <>
                    <label style={{ fontSize: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                          Notification Title
                        </span>
                        <span style={{ fontSize: 11, color: draft.title.length > 65 ? "var(--status-warning)" : "var(--text-muted)" }}>
                          {draft.title.length}/65 chars recommended
                        </span>
                      </div>
                      <input
                        type="text"
                        maxLength={100}
                        placeholder="Enter push or in-app headline..."
                        value={draft.title}
                        onChange={(e) => patch({ title: e.target.value })}
                        style={{ ...inputStyle, marginTop: 4 }}
                      />
                    </label>

                    <label style={{ fontSize: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                          Notification Message Body
                        </span>
                        <span style={{ fontSize: 11, color: draft.message.length > 178 ? "var(--status-warning)" : "var(--text-muted)" }}>
                          {draft.message.length}/178 APNs preview limit
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        maxLength={400}
                        placeholder="Write clear mobile message..."
                        value={draft.message}
                        onChange={(e) => patch({ message: e.target.value })}
                        style={{ ...inputStyle, marginTop: 4 }}
                      />
                    </label>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                        gap: 10,
                      }}
                    >
                      <label style={{ fontSize: 12 }}>
                        <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                          Optional Rich Image URL
                        </span>
                        <input
                          type="url"
                          placeholder="https://... (optional banner)"
                          value={draft.imageUrl || ""}
                          onChange={(e) => patch({ imageUrl: e.target.value })}
                          style={{ ...inputStyle, marginTop: 4 }}
                        />
                      </label>

                      <label style={{ fontSize: 12 }}>
                        <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                          In-App Icon Badge
                        </span>
                        <select
                          value={draft.iconKey}
                          onChange={(e) =>
                            patch({ iconKey: e.target.value as ComposerDraftInput["iconKey"] })
                          }
                          style={{ ...inputStyle, marginTop: 4 }}
                        >
                          <option value="bell">Bell (Announcement)</option>
                          <option value="heart">Heart (Dating / Likes)</option>
                          <option value="star">Star (Highlights)</option>
                          <option value="crown">Crown (Premium)</option>
                          <option value="flame">Flame (Live Showcase)</option>
                        </select>
                      </label>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                        gap: 10,
                      }}
                    >
                      <label style={{ fontSize: 12 }}>
                        <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                          Action CTA Button Text
                        </span>
                        <input
                          type="text"
                          value={draft.ctaLabel}
                          onChange={(e) => patch({ ctaLabel: e.target.value })}
                          style={{ ...inputStyle, marginTop: 4 }}
                        />
                      </label>

                      <label style={{ fontSize: 12 }}>
                        <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                          Mobile Deep Link Destination
                        </span>
                        <select
                          value={draft.deepLinkRoute}
                          onChange={(e) => patch({ deepLinkRoute: e.target.value })}
                          style={{ ...inputStyle, marginTop: 4 }}
                        >
                          {MOBILE_DEEP_LINKS.map((dl) => (
                            <option key={dl.route} value={dl.route}>
                              {dl.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </>
                ) : (
                  <>
                    <label style={{ fontSize: 12 }}>
                      <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                        Email Subject Line
                      </span>
                      <input
                        type="text"
                        value={draft.emailSubject}
                        onChange={(e) => patch({ emailSubject: e.target.value })}
                        style={{ ...inputStyle, marginTop: 4 }}
                      />
                    </label>
                    <label style={{ fontSize: 12 }}>
                      <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                        Email Inbox Preview Text
                      </span>
                      <input
                        type="text"
                        value={draft.emailPreviewText}
                        onChange={(e) => patch({ emailPreviewText: e.target.value })}
                        style={{ ...inputStyle, marginTop: 4 }}
                      />
                    </label>
                    <label style={{ fontSize: 12 }}>
                      <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                        Email Main Heading
                      </span>
                      <input
                        type="text"
                        value={draft.emailHeading}
                        onChange={(e) => patch({ emailHeading: e.target.value })}
                        style={{ ...inputStyle, marginTop: 4 }}
                      />
                    </label>
                    <label style={{ fontSize: 12 }}>
                      <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                        Email Body Copy
                      </span>
                      <textarea
                        rows={4}
                        value={draft.emailBody}
                        onChange={(e) => patch({ emailBody: e.target.value })}
                        style={{ ...inputStyle, marginTop: 4 }}
                      />
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <label style={{ fontSize: 12 }}>
                        <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                          CTA Button Label
                        </span>
                        <input
                          type="text"
                          value={draft.emailCtaText}
                          onChange={(e) => patch({ emailCtaText: e.target.value })}
                          style={{ ...inputStyle, marginTop: 4 }}
                        />
                      </label>
                      <label style={{ fontSize: 12 }}>
                        <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                          Optional Banner URL
                        </span>
                        <input
                          type="url"
                          value={draft.emailBannerUrl || ""}
                          onChange={(e) => patch({ emailBannerUrl: e.target.value })}
                          style={{ ...inputStyle, marginTop: 4 }}
                        />
                      </label>
                    </div>
                  </>
                )}

                {/* Personalization Variables Validation Ribbon */}
                <div
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    background: varCheck.isValid
                      ? "var(--bg-surface-elevated)"
                      : "var(--status-error-bg)",
                    border: "1px solid var(--border-light)",
                    fontSize: 11.5,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700 }}>
                    {varCheck.isValid ? (
                      <CheckCircle2 size={14} style={{ color: "var(--status-success)" }} />
                    ) : (
                      <AlertCircle size={14} style={{ color: "var(--status-error)" }} />
                    )}
                    <span>
                      {varCheck.isValid
                        ? "Variable Validation Passed (Supported Personalization Tokens)"
                        : `Unresolved / Unknown Variables Blocked: ${varCheck.unknownVars.join(", ") || "Check brace syntax"}`}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 6 }}>
                    {ALLOWED_PERSONALIZATION_VARS.slice(0, 5).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => {
                          if (draft.channel === "email") {
                            patch({ emailBody: `${draft.emailBody} {{${v}}}` });
                          } else {
                            patch({ message: `${draft.message} {{${v}}}` });
                          }
                        }}
                        style={{
                          padding: "2px 8px",
                          borderRadius: 6,
                          border: "1px solid var(--border)",
                          background: "var(--bg-card)",
                          color: "var(--primary)",
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        +&#123;&#123;{v}&#125;&#125;
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Audience Targeting & Scheduling Card */}
            <div style={cardStyle}>
              <h3 style={{ margin: "0 0 12px", fontSize: 15.5, color: "var(--text-main)" }}>
                Audience Targeting & Schedule Settings
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <label style={{ fontSize: 12 }}>
                  Audience Segment
                  <select
                    value={draft.audienceSegment}
                    onChange={(e) =>
                      patch({ audienceSegment: e.target.value as AudienceSegmentPreset })
                    }
                    style={{ ...inputStyle, marginTop: 4 }}
                  >
                    <option value="all_eligible">All Eligible Members</option>
                    <option value="active_users">Active Users (Last 30d)</option>
                    <option value="new_users_7d">New Users (Last 7d)</option>
                    <option value="inactive_users_30d">Inactive 30d – 6m</option>
                    <option value="inactive_6_months">Inactive 6+ Months</option>
                    <option value="birthday_cohort">Birthday Month Cohort</option>
                    <option value="premium_subscribers">Premium Subscribers</option>
                    <option value="free_users">Free Tier Users</option>
                    <option value="verified_users">Verified Users Only</option>
                    <option value="live_hosts">Live Stream Hosts</option>
                    <option value="ios_users">iOS Users</option>
                    <option value="android_users">Android Users</option>
                  </select>
                </label>

                <label style={{ fontSize: 12 }}>
                  Platform
                  <select
                    value={draft.targetPlatform}
                    onChange={(e) =>
                      patch({
                        targetPlatform: e.target.value as ComposerDraftInput["targetPlatform"],
                      })
                    }
                    style={{ ...inputStyle, marginTop: 4 }}
                  >
                    <option value="all">All Devices</option>
                    <option value="ios">iOS (APNs)</option>
                    <option value="android">Android (FCM)</option>
                    <option value="web">Web</option>
                  </select>
                </label>

                <label style={{ fontSize: 12 }}>
                  Country Filter
                  <select
                    value={draft.targetCountries[0] || "all"}
                    onChange={(e) => patch({ targetCountries: [e.target.value] })}
                    style={{ ...inputStyle, marginTop: 4 }}
                  >
                    <option value="all">All Supported Countries</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Ghana">Ghana</option>
                    <option value="France">France</option>
                    <option value="Germany">Germany</option>
                  </select>
                </label>

                <label style={{ fontSize: 12 }}>
                  Schedule Recurrence
                  <select
                    value={draft.recurrence}
                    onChange={(e) =>
                      patch({ recurrence: e.target.value as RecurrenceFrequency })
                    }
                    style={{ ...inputStyle, marginTop: 4 }}
                  >
                    <option value="once">One-Time Dispatch</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </label>

                <label style={{ fontSize: 12 }}>
                  Schedule Date
                  <input
                    type="date"
                    value={draft.scheduledDate}
                    onChange={(e) => patch({ scheduledDate: e.target.value })}
                    style={{ ...inputStyle, marginTop: 4 }}
                  />
                </label>

                <label style={{ fontSize: 12 }}>
                  Schedule Time (UTC)
                  <input
                    type="time"
                    value={draft.scheduledTime}
                    onChange={(e) => patch({ scheduledTime: e.target.value })}
                    style={{ ...inputStyle, marginTop: 4 }}
                  />
                </label>
              </div>

              {/* Estimated Recipient Summary Box */}
              <div
                style={{
                  padding: 11,
                  borderRadius: 11,
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-light)",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  gap: 8,
                  fontSize: 12.5,
                  marginBottom: 14,
                }}
              >
                <span>
                  Estimated Eligible Audience:{" "}
                  <strong style={{ color: "var(--primary)" }}>
                    {audienceEval.eligibleCount} members
                  </strong>
                </span>
                <span style={{ color: "var(--text-secondary)" }}>
                  Auto-excluded (Suspended / Opted-out / Missing Token):{" "}
                  <strong>{audienceEval.suppressedTotal}</strong>
                </span>
              </div>

              {/* Test Device Dispatch Strip */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  alignItems: "center",
                  marginBottom: 14,
                  paddingTop: 10,
                  borderTop: "1px solid var(--border-light)",
                }}
              >
                <select
                  aria-label="Select Authorized Test Device"
                  value={testDevice}
                  onChange={(e) => setTestDevice(e.target.value)}
                  style={{ ...inputStyle, flex: "1 1 210px" }}
                >
                  <option value="Sarah Alexander — iPhone 18 Pro Max (Test Token)">
                    Sarah Alexander — iPhone 18 Pro Max (Test Token)
                  </option>
                  <option value="Elena Vance — Pixel 9 Android (Test Token)">
                    Elena Vance — Pixel 9 Android (Test Token)
                  </option>
                  <option value="sarah.alexander@noblebond.com (Test Email)">
                    sarah.alexander@noblebond.com (Test Inbox)
                  </option>
                </select>
                <button
                  type="button"
                  disabled={!varCheck.isValid}
                  onClick={() => onSendTestNotice(draft.channel, testDevice)}
                  style={{
                    padding: "8px 13px",
                    borderRadius: 9,
                    border: "1px solid var(--border)",
                    background: "var(--bg-surface)",
                    color: "var(--text-main)",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: varCheck.isValid ? "pointer" : "not-allowed",
                  }}
                >
                  Send Simulated Test
                </button>
              </div>

              {/* Save Draft / Schedule / Send Now Actions */}
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => onSaveCampaign(buildPayload(), "draft")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 13px",
                    borderRadius: 9,
                    border: "1px solid var(--border)",
                    background: "var(--bg-surface-elevated)",
                    color: "var(--text-main)",
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <Save size={14} /> Save Draft
                </button>

                <button
                  type="button"
                  disabled={!varCheck.isValid}
                  onClick={() =>
                    onRequestDispatchConfirm({
                      title: `Schedule "${draft.name}"?`,
                      channelLabel: draft.channel.replace(/_/g, " "),
                      audienceLabel: draft.audienceSegment.replace(/_/g, " "),
                      estimatedRecipients: audienceEval.eligibleCount,
                      suppressedCount: audienceEval.suppressedTotal,
                      scheduledLabel: `${draft.scheduledDate} ${draft.scheduledTime} UTC (${draft.recurrence})`,
                      confirmButtonText: "Confirm Schedule",
                      onConfirm: () => onSaveCampaign(buildPayload(), "schedule"),
                    })
                  }
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 13px",
                    borderRadius: 9,
                    border: "1px solid var(--primary)",
                    background: "var(--bg-active)",
                    color: "var(--primary)",
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: varCheck.isValid ? "pointer" : "not-allowed",
                  }}
                >
                  <Clock size={14} /> Schedule Campaign
                </button>

                <button
                  type="button"
                  disabled={!varCheck.isValid || audienceEval.eligibleCount === 0}
                  onClick={() =>
                    onRequestDispatchConfirm({
                      title: `Confirm Campaign Dispatch: "${draft.name}"`,
                      channelLabel: draft.channel.replace(/_/g, " "),
                      audienceLabel: draft.audienceSegment.replace(/_/g, " "),
                      estimatedRecipients: audienceEval.eligibleCount,
                      suppressedCount: audienceEval.suppressedTotal,
                      confirmButtonText: "Confirm Demo Dispatch",
                      onConfirm: () => onSaveCampaign(buildPayload(), "send_now"),
                    })
                  }
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 16px",
                    borderRadius: 9,
                    border: "none",
                    background: varCheck.isValid && audienceEval.eligibleCount > 0 ? "var(--primary)" : "var(--bg-surface-elevated)",
                    color: varCheck.isValid && audienceEval.eligibleCount > 0 ? "#FFFFFF" : "var(--text-muted)",
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor:
                      varCheck.isValid && audienceEval.eligibleCount > 0
                        ? "pointer"
                        : "not-allowed",
                  }}
                >
                  <Send size={14} /> Send Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: REAL-TIME INTERACTIVE DEVICE OR EMAIL PREVIEW */}
        <div
          style={{
            ...cardStyle,
            position: "sticky",
            top: 84,
          }}
        >
          <div style={{ marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 15.5, color: "var(--text-main)" }}>
              {draft.channel === "email"
                ? "Live Responsive Email Preview"
                : "Interactive Device Preview (Updates As You Type)"}
            </h3>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>
              {draft.channel === "email"
                ? "Switch between Desktop and Mobile client rendering."
                : "Default iPhone 18 Pro Max with Dynamic Island — zero static images."}
            </p>
          </div>

          {draft.channel === "email" ? (
            <EmailCampaignPreview
              subject={draft.emailSubject}
              previewText={draft.emailPreviewText}
              heading={draft.emailHeading}
              body={draft.emailBody}
              bannerUrl={draft.emailBannerUrl}
              ctaLabel={draft.emailCtaText}
              footerText={draft.emailFooter}
              senderName={state.preferences.defaultSenderName}
              senderEmail={state.preferences.configuredSenderEmail}
            />
          ) : (
            <IPhone18ProMaxPreview
              mode={previewMode}
              onChangeMode={setPreviewMode}
              title={draft.title}
              message={draft.message}
              imageUrl={draft.imageUrl}
              iconKey={draft.iconKey}
              ctaLabel={draft.ctaLabel}
              deepLinkRoute={draft.deepLinkRoute}
              appName={sysSettings.general.platformName || "NobleBond"}
              appIconUrl={appLogoAsset}
              categoryLabel={draft.category}
            />
          )}
        </div>
      </div>
    </div>
  );
};

