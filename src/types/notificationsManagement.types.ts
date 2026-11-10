// NobleBond Admin — Enterprise Notifications & Campaign Automation Type Definitions
// Enforces 15 BI/Operations sections, multi-channel separation (Push, In-App, Email),
// live iPhone 18 Pro Max + Android + Email previews, 6-month inactivity / birthday / seasonal automations,
// strict anti-duplicate frequency caps, consent/exclusion enforcement, and zero emojis.

export type NotificationsTabKey =
  | "overview"
  | "composer"
  | "push"
  | "in_app"
  | "email_campaigns"
  | "automations"
  | "scheduled"
  | "recurring"
  | "templates"
  | "audience"
  | "delivery_history"
  | "failed"
  | "analytics"
  | "settings"
  | "audit_history";

export type NotificationChannelType = "push" | "in_app" | "email" | "push_and_in_app";

export type NotificationCampaignCategory =
  | "Likes"
  | "Matches"
  | "Messages"
  | "Live Sessions"
  | "Gift Activity"
  | "Premium"
  | "Referral Rewards"
  | "Connection Points"
  | "Account & Security"
  | "Platform Announcements"
  | "Special Events"
  | "Re-engagement"
  | "Support";

export type CampaignLifecycleStatus =
  | "draft"
  | "queued"
  | "scheduled"
  | "sending"
  | "sent"
  | "paused"
  | "cancelled"
  | "failed";

export type DeliveryTrackingStatus =
  | "draft"
  | "queued"
  | "scheduled"
  | "sending"
  | "sent"
  | "delivered"
  | "opened"
  | "clicked"
  | "failed"
  | "bounced"
  | "suppressed"
  | "cancelled";

export type AudienceSegmentPreset =
  | "all_eligible"
  | "active_users"
  | "new_users_7d"
  | "inactive_users_30d"
  | "inactive_6_months"
  | "birthday_cohort"
  | "premium_subscribers"
  | "free_users"
  | "verified_users"
  | "live_hosts"
  | "android_users"
  | "ios_users"
  | "marketing_consented"
  | "custom";

export type DevicePreviewMode =
  | "iphone_lock_screen"
  | "iphone_banner"
  | "iphone_notification_center"
  | "in_app_preview"
  | "android_preview";

export type PreviewWallpaperKey = "rose_twilight" | "plum_midnight" | "champagne_dawn" | "obsidian";

export type RecurrenceFrequency = "once" | "daily" | "weekly" | "monthly" | "yearly";

export interface NotificationCampaignRecord {
  id: string;
  name: string;
  channel: NotificationChannelType;
  category: NotificationCampaignCategory;
  status: CampaignLifecycleStatus;
  audienceSegment: AudienceSegmentPreset;
  targetCountries: string[];
  targetLanguage: string;
  targetPlatform: "all" | "ios" | "android" | "web";
  // Mobile Push / In-App Content
  title: string;
  message: string;
  imageUrl?: string;
  iconKey?: "heart" | "star" | "crown" | "bell" | "flame";
  ctaLabel?: string;
  deepLinkRoute: string;
  // Email Content
  emailSubject?: string;
  emailPreviewText?: string;
  emailHeading?: string;
  emailBody?: string;
  emailBannerUrl?: string;
  emailCtaText?: string;
  emailCtaDestination?: string;
  emailFooter?: string;
  // Scheduling & Metrics
  recurrence: RecurrenceFrequency;
  scheduledForIso?: string;
  timezone: string;
  sentAtIso?: string;
  estimatedRecipients: number;
  suppressedCount: number;
  sentCount: number;
  confirmedDeliveredCount: number | null; // Explicit null when delivery webhook unavailable
  failedCount: number;
  bouncedCount: number;
  openRateTrackedPercent: number | null; // Explicit null unless open pixel connected
  clickRateTrackedPercent: number | null;
  unreadInAppCount: number;
  createdBy: string;
  createdAtIso: string;
  updatedAtIso: string;
}

export interface AutomationWorkflowRecord {
  id: string;
  name: string;
  automationType:
    | "inactive_6_months"
    | "birthday"
    | "happy_new_month"
    | "seasonal_christmas"
    | "seasonal_new_year"
    | "seasonal_halloween"
    | "seasonal_other"
    | "event_transactional";
  isEssentialTransactional: boolean;
  triggerDescription: string;
  qualifyingActivityNote: string;
  channel: NotificationChannelType;
  status: "active" | "paused" | "draft" | "scheduled" | "completed" | "failed";
  inactivityMonths?: number;
  seasonalEventDate?: string; // e.g. "Dec 25", "Jan 1", "Oct 31"
  targetCountries: string[];
  targetLanguage: string;
  sendTimeLocal: string;
  defaultTimezone: string;
  frequencyLimitRule: string;
  duplicateCycleKey: string;
  maxRecipientsPerRun: number;
  exclusions: string[];
  templateId: string;
  emailSubject: string;
  emailHeading: string;
  emailBody: string;
  emailCtaLabel: string;
  emailCtaUrl: string;
  nextExecutionIso: string | null;
  lastExecutionIso: string | null;
  eligibleUsersCount: number;
  sentTotal: number;
  deliveredTotal: number;
  failedTotal: number;
  bouncedTotal: number;
  suppressedTotal: number;
  requiresBackendScheduler: boolean;
}

export interface NotificationTemplateRecord {
  id: string;
  name: string;
  templateGroup: "Push" | "In-App" | "Email" | "Automated" | "Seasonal" | "Transactional";
  channel: NotificationChannelType;
  category: NotificationCampaignCategory;
  titleOrSubject: string;
  bodyContent: string;
  optionalImageUrl?: string;
  ctaLabel: string;
  destination: string;
  language: string;
  status: "active" | "inactive" | "archived";
  variablesUsed: string[];
  usedInHistoricalCampaign: boolean;
  updatedAtIso: string;
}

export interface DeliveryHistoryRecord {
  id: string;
  campaignId: string;
  campaignName: string;
  recipientRefMasked: string;
  channel: NotificationChannelType;
  category: NotificationCampaignCategory;
  status: DeliveryTrackingStatus;
  providerName: string;
  providerRef: string;
  createdAtIso: string;
  sentAtIso?: string;
  confirmedDeliveredAtIso?: string;
  errorCode?: string;
  failureCategory?:
    | "failed_push"
    | "failed_email"
    | "failed_in_app"
    | "bounced_email"
    | "invalid_device_token"
    | "suppressed_recipient"
    | "provider_error";
  failureReason?: string;
  retryEligible: boolean;
  retryCount: number;
  maxRetries: number;
  reviewedByAdmin?: boolean;
}

export interface NotificationProgramPreferences {
  defaultSenderName: string;
  configuredSenderEmail: string;
  defaultLanguage: string;
  defaultTimezone: string;
  maxRetryAttempts: number;
  rateLimitPerMinute: number;
  maxPromotionalPushPerDay: number;
  maxMarketingEmailsPerDay: number;
  minHoursBetweenPromos: number;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // "22:00"
  quietHoursEnd: string; // "08:00"
  allowSecurityDuringQuietHours: boolean;
  enforceUnsubscribeOptOut: boolean;
  lastUpdatedAtIso: string;
}

export interface NotificationAuditLogRecord {
  id: string;
  timestampIso: string;
  actorName: string;
  actorRole: string;
  actionType:
    | "campaign_created"
    | "campaign_sent_demo"
    | "campaign_scheduled"
    | "campaign_cancelled"
    | "automation_toggled"
    | "automation_updated"
    | "template_saved"
    | "retry_attempted"
    | "settings_updated";
  targetName: string;
  summary: string;
}

export interface AudienceEvaluationSummary {
  totalDirectoryUsers: number;
  eligibleCount: number;
  suppressedTotal: number;
  breakdown: {
    suspendedOrBanned: number;
    optedOutMarketing: number;
    invalidOrUnverifiedEmail: number;
    missingDeviceToken: number;
    cycleDuplicateOrCapped: number;
  };
  sampleMaskedPreview: Array<{
    maskedRef: string;
    country: string;
    platform: string;
    tier: string;
    eligibilityNote: string;
  }>;
}

export interface NotificationsManagementState {
  campaigns: NotificationCampaignRecord[];
  automations: AutomationWorkflowRecord[];
  templates: NotificationTemplateRecord[];
  deliveryLogs: DeliveryHistoryRecord[];
  preferences: NotificationProgramPreferences;
  auditLogs: NotificationAuditLogRecord[];
  lastSyncedAtIso: string;
}

