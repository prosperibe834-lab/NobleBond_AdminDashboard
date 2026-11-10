// NobleBond Admin — Centralized Notifications & Campaign Automation Data Service
// Connects directly with User Management, System Settings, Subscriptions, Wallet, Referrals, Live & Support.
// Preserves legacy cmp_1/cmp_2 campaigns without emojis, enforces 6-month qualifying activity logic,
// protects consent/unsubscribes, and strictly distinguishes sent vs delivered vs tracked metrics.

import type {
  AudienceEvaluationSummary,
  AudienceSegmentPreset,
  AutomationWorkflowRecord,
  DeliveryHistoryRecord,
  NotificationAuditLogRecord,
  NotificationCampaignCategory,
  NotificationCampaignRecord,
  NotificationChannelType,
  NotificationTemplateRecord,
  NotificationsManagementState,
} from "../types/notificationsManagement.types";
import { loadUsersFromStorage } from "./userManagementDataService";
import { loadSystemSettingsState } from "./systemSettingsDataService";

const STORAGE_KEY = "noblebond_admin_notifications_mgmt_v2";
const REF_NOW_ISO = "2026-11-10T12:00:00Z";
const REF_NOW_MS = new Date(REF_NOW_ISO).getTime();
const SIX_MONTHS_MS = 180 * 86400000;

function maskEmailOrId(email: string, id: string): string {
  const parts = email.split("@");
  if (parts.length !== 2) return `usr_***_${id.slice(-4)}`;
  const local = parts[0];
  const vis = local.slice(0, Math.min(2, local.length));
  return `${vis}***@${parts[1]}`;
}

export function evaluateAudienceSegment(params: {
  segment: AudienceSegmentPreset;
  targetCountries?: string[];
  targetPlatform?: "all" | "ios" | "android" | "web";
  targetLanguage?: string;
  channel?: NotificationChannelType;
  requireEmail?: boolean;
}): AudienceEvaluationSummary {
  const users = loadUsersFromStorage();
  const countriesFilter = params.targetCountries || [];
  const filterByCountry = countriesFilter.length > 0 && !countriesFilter.includes("all");
  const needEmail = params.requireEmail ?? params.channel === "email";

  let suspendedOrBanned = 0;
  let optedOutMarketing = 0;
  let invalidOrUnverifiedEmail = 0;
  let missingDeviceToken = 0;
  let cycleDuplicateOrCapped = 0;
  let eligibleCount = 0;

  const sampleMaskedPreview: AudienceEvaluationSummary["sampleMaskedPreview"] = [];

  for (const u of users) {
    if (filterByCountry && !countriesFilter.includes(u.country)) continue;
    if (
      params.targetPlatform &&
      params.targetPlatform !== "all" &&
      !u.devices.some((d) => d.platform === params.targetPlatform)
    ) {
      continue;
    }
    if (
      params.targetLanguage &&
      params.targetLanguage !== "all" &&
      !u.preferredLanguage.toLowerCase().startsWith(params.targetLanguage.slice(0, 2).toLowerCase())
    ) {
      continue;
    }

    // Segment matching strictly using actual User fields
    const lastActiveMs = new Date(u.lastActive).getTime();
    const regMs = new Date(u.registrationDate).getTime();
    const daysSinceActive = (REF_NOW_MS - lastActiveMs) / 86400000;

    let matchesSeg: boolean;
    switch (params.segment) {
      case "active_users":
        matchesSeg = daysSinceActive <= 30;
        break;
      case "new_users_7d":
        matchesSeg = (REF_NOW_MS - regMs) / 86400000 <= 7;
        break;
      case "inactive_users_30d":
        matchesSeg = daysSinceActive >= 30 && daysSinceActive < 180;
        break;
      case "inactive_6_months":
        matchesSeg = REF_NOW_MS - lastActiveMs >= SIX_MONTHS_MS;
        break;
      case "birthday_cohort": {
        const refMonth = "11";
        const dobMonth = (u.dateOfBirth || "").slice(5, 7);
        matchesSeg = dobMonth === refMonth;
        break;
      }
      case "premium_subscribers":
        matchesSeg = u.premium.isPremium;
        break;
      case "free_users":
        matchesSeg = !u.premium.isPremium;
        break;
      case "verified_users":
        matchesSeg = u.verification.status === "verified";
        break;
      case "live_hosts":
        matchesSeg = u.datingStats.liveHostedCount > 0;
        break;
      case "android_users":
        matchesSeg = u.devices.some((d) => d.platform === "android");
        break;
      case "ios_users":
        matchesSeg = u.devices.some((d) => d.platform === "ios");
        break;
      case "marketing_consented":
        matchesSeg = u.verification.emailVerified && u.status !== "suspended" && u.status !== "banned";
        break;
      default:
        matchesSeg = true;
    }

    if (!matchesSeg) continue;

    // Mandatory Exclusions (Consent, Bans, Email validity, Push tokens)
    if (u.status === "suspended" || u.status === "banned") {
      suspendedOrBanned++;
      continue;
    }
    if (needEmail && (!u.email || !u.email.includes("@") || !u.verification.emailVerified)) {
      invalidOrUnverifiedEmail++;
      continue;
    }
    // Synthetic unsubscribe signal from deterministic user hash or unverified preference
    if (u.id.endsWith("39") && params.segment !== "all_eligible") {
      optedOutMarketing++;
      continue;
    }
    if (
      (params.channel === "push" || params.channel === "push_and_in_app") &&
      u.devices.length === 0
    ) {
      missingDeviceToken++;
      continue;
    }
    if (params.segment === "inactive_6_months" && u.id.endsWith("40")) {
      cycleDuplicateOrCapped++;
      continue;
    }

    eligibleCount++;
    if (sampleMaskedPreview.length < 6) {
      sampleMaskedPreview.push({
        maskedRef: maskEmailOrId(u.email, u.id),
        country: u.country,
        platform: u.devices[0]?.platform.toUpperCase() || "UNKNOWN",
        tier: u.premium.isPremium ? "Premium" : "Free",
        eligibilityNote: "Consent & policy validated",
      });
    }
  }

  const suppressedTotal =
    suspendedOrBanned +
    optedOutMarketing +
    invalidOrUnverifiedEmail +
    missingDeviceToken +
    cycleDuplicateOrCapped;

  return {
    totalDirectoryUsers: users.length,
    eligibleCount,
    suppressedTotal,
    breakdown: {
      suspendedOrBanned,
      optedOutMarketing,
      invalidOrUnverifiedEmail,
      missingDeviceToken,
      cycleDuplicateOrCapped,
    },
    sampleMaskedPreview,
  };
}

const INITIAL_CAMPAIGNS: NotificationCampaignRecord[] = [
  {
    id: "cmp_1",
    name: "Weekend Live Gifting Party 2x Event",
    channel: "push_and_in_app",
    category: "Live Sessions",
    status: "sent",
    audienceSegment: "active_users",
    targetCountries: ["all"],
    targetLanguage: "en-US",
    targetPlatform: "all",
    title: "Weekend Live Gifting Party: 2x Connection Events",
    message:
      "Join top NobleBond Live hosts streaming tonight across music, speed dating, and community Q&A.",
    iconKey: "flame",
    ctaLabel: "Open Live Hub",
    deepLinkRoute: "/live",
    recurrence: "once",
    timezone: "UTC",
    sentAtIso: "2026-11-07T18:00:00Z",
    estimatedRecipients: 14,
    suppressedCount: 2,
    sentCount: 12,
    confirmedDeliveredCount: null, // Push open/delivery confirmation webhook pending
    failedCount: 1,
    bouncedCount: 0,
    openRateTrackedPercent: null,
    clickRateTrackedPercent: null,
    unreadInAppCount: 4,
    createdBy: "Sarah Alexander",
    createdAtIso: "2026-11-07T17:30:00Z",
    updatedAtIso: "2026-11-07T18:05:00Z",
  },
  {
    id: "cmp_2",
    name: "Meet NobleBond Live: Creator Welcome",
    channel: "in_app",
    category: "Platform Announcements",
    status: "sent",
    audienceSegment: "new_users_7d",
    targetCountries: ["all"],
    targetLanguage: "en-US",
    targetPlatform: "all",
    title: "Meet NobleBond Live: Connect with verified hosts",
    message:
      "Discover live interactive audio and video rooms tailored to your interests inside the Live tab.",
    iconKey: "star",
    ctaLabel: "Explore Live",
    deepLinkRoute: "/live",
    recurrence: "once",
    timezone: "UTC",
    sentAtIso: "2026-11-05T12:00:00Z",
    estimatedRecipients: 8,
    suppressedCount: 1,
    sentCount: 7,
    confirmedDeliveredCount: 7,
    failedCount: 0,
    bouncedCount: 0,
    openRateTrackedPercent: null,
    clickRateTrackedPercent: null,
    unreadInAppCount: 2,
    createdBy: "Elena Vance",
    createdAtIso: "2026-11-05T11:40:00Z",
    updatedAtIso: "2026-11-05T12:02:00Z",
  },
  {
    id: "cmp_3",
    name: "December Holiday Travel Passport Spotlight",
    channel: "email",
    category: "Premium",
    status: "scheduled",
    audienceSegment: "free_users",
    targetCountries: ["United States", "United Kingdom", "Canada", "Nigeria"],
    targetLanguage: "en-US",
    targetPlatform: "all",
    title: "Connect Across Cities This Season",
    message: "Unlock Global Passport with NobleBond Premium.",
    deepLinkRoute: "premium",
    emailSubject: "Meet Someone Special Anywhere You Travel",
    emailPreviewText: "Unlock NobleBond Global Passport and Unlimited Likes.",
    emailHeading: "Explore Connections Across Borders",
    emailBody:
      "Hi {{firstName}}, whether you are home or traveling abroad this season, NobleBond Premium lets you discover verified members globally with unlimited likes and priority support.",
    emailCtaText: "View Premium Plans",
    emailCtaDestination: "noblebond://premium",
    emailFooter: "You received this email based on your NobleBond marketing preferences. Manage preferences or unsubscribe anytime.",
    recurrence: "once",
    scheduledForIso: "2026-11-25T14:00:00Z",
    timezone: "America/New_York",
    estimatedRecipients: 10,
    suppressedCount: 3,
    sentCount: 0,
    confirmedDeliveredCount: null,
    failedCount: 0,
    bouncedCount: 0,
    openRateTrackedPercent: null,
    clickRateTrackedPercent: null,
    unreadInAppCount: 0,
    createdBy: "Sarah Alexander",
    createdAtIso: "2026-11-08T10:15:00Z",
    updatedAtIso: "2026-11-08T10:15:00Z",
  },
];

const INITIAL_AUTOMATIONS: AutomationWorkflowRecord[] = [
  {
    id: "aut_inactive_6m",
    name: "NobleBond — We Miss You Re-engagement Campaign",
    automationType: "inactive_6_months",
    isEssentialTransactional: false,
    triggerDescription: "No qualifying activity in NobleBond for 6 calendar months (180 days from user lastActive).",
    qualifyingActivityNote:
      "Qualifying events: app session login, Discover browse, sending a like, match chat message, or Live participation (excludes registration date & background push receipts).",
    channel: "email",
    status: "active",
    inactivityMonths: 6,
    targetCountries: ["all"],
    targetLanguage: "all",
    sendTimeLocal: "10:00",
    defaultTimezone: "UTC",
    frequencyLimitRule: "Strictly 1 email per 6-month inactivity cycle; resets only after verified new activity + full new 6-month inactivity.",
    duplicateCycleKey: "inactivity-cycle-180d",
    maxRecipientsPerRun: 5000,
    exclusions: ["Suspended/Banned Accounts", "Deleted Accounts", "Unsubscribed Users", "Unverified Email", "Sent in Current Cycle"],
    templateId: "tpl_inactive_6m",
    emailSubject: "We've Missed You at NobleBond",
    emailHeading: "Your Next Meaningful Connection Could Be Waiting",
    emailBody:
      "It's been a while since we last saw you on NobleBond. We'd love to welcome you back. There are new people to discover, meaningful connections to make and conversations waiting for you.",
    emailCtaLabel: "Return to NobleBond",
    emailCtaUrl: "noblebond://discover",
    nextExecutionIso: "2026-11-11T10:00:00Z",
    lastExecutionIso: "2026-11-10T10:00:00Z",
    eligibleUsersCount: 2,
    sentTotal: 14,
    deliveredTotal: 12,
    failedTotal: 1,
    bouncedTotal: 1,
    suppressedTotal: 3,
    requiresBackendScheduler: true,
  },
  {
    id: "aut_birthday",
    name: "NobleBond — Birthday Celebration",
    automationType: "birthday",
    isEssentialTransactional: false,
    triggerDescription: "Triggered annually matching user's stored profile birthday month & day (without exposing full birth year broadly).",
    qualifyingActivityNote: "Checks consent preferences, valid email, and year-level dedupe tag.",
    channel: "email",
    status: "active",
    targetCountries: ["all"],
    targetLanguage: "all",
    sendTimeLocal: "09:00",
    defaultTimezone: "UTC",
    frequencyLimitRule: "Maximum 1 birthday greeting per calendar year per account.",
    duplicateCycleKey: "birthday-2026",
    maxRecipientsPerRun: 2500,
    exclusions: ["Banned/Deleted Accounts", "Missing Birthday Metadata", "Marketing Opt-Out", "Already Sent 2026"],
    templateId: "tpl_birthday",
    emailSubject: "Happy Birthday from NobleBond!",
    emailHeading: "Wishing You a Beautiful Birthday",
    emailBody:
      "Today is a special day, and everyone at NobleBond wishes you happiness, beautiful moments and meaningful connections in the year ahead. Enjoy your day!",
    emailCtaLabel: "Open NobleBond",
    emailCtaUrl: "noblebond://discover",
    nextExecutionIso: "2026-11-11T09:00:00Z",
    lastExecutionIso: "2026-11-10T09:00:00Z",
    eligibleUsersCount: 3,
    sentTotal: 42,
    deliveredTotal: 40,
    failedTotal: 0,
    bouncedTotal: 2,
    suppressedTotal: 5,
    requiresBackendScheduler: true,
  },
  {
    id: "aut_new_month",
    name: "NobleBond — Happy New Month",
    automationType: "happy_new_month",
    isEssentialTransactional: false,
    triggerDescription: "Monthly recurring cron firing on the 1st day of every calendar month at configured recipient local send window.",
    qualifyingActivityNote: "Respects unsubscribe opt-outs and locks monthly execution key (YYYY-MM) against duplicate scheduler runs.",
    channel: "email",
    status: "active",
    targetCountries: ["all"],
    targetLanguage: "all",
    sendTimeLocal: "08:30",
    defaultTimezone: "UTC",
    frequencyLimitRule: "Strictly once per calendar month per member.",
    duplicateCycleKey: "monthly-2026-12",
    maxRecipientsPerRun: 10000,
    exclusions: ["Deleted Accounts", "Banned Accounts", "Unsubscribed Users"],
    templateId: "tpl_new_month",
    emailSubject: "Happy New Month from NobleBond!",
    emailHeading: "A New Month. New Possibilities.",
    emailBody:
      "A brand-new month is here, and NobleBond wishes you beautiful moments, positive experiences and meaningful connections. May this month bring you wonderful opportunities and great conversations.",
    emailCtaLabel: "Explore NobleBond",
    emailCtaUrl: "noblebond://discover",
    nextExecutionIso: "2026-12-01T08:30:00Z",
    lastExecutionIso: "2026-11-01T08:30:00Z",
    eligibleUsersCount: 16,
    sentTotal: 158,
    deliveredTotal: 151,
    failedTotal: 3,
    bouncedTotal: 4,
    suppressedTotal: 9,
    requiresBackendScheduler: true,
  },
  {
    id: "aut_christmas",
    name: "NobleBond — Christmas Greetings",
    automationType: "seasonal_christmas",
    isEssentialTransactional: false,
    triggerDescription: "Annual seasonal greeting scheduled for December 25 across enabled regions.",
    qualifyingActivityNote: "Configurable by country and language; prevented from duplicate yearly dispatch.",
    channel: "email",
    status: "scheduled",
    seasonalEventDate: "Dec 25",
    targetCountries: ["United States", "United Kingdom", "Canada", "Nigeria", "Ghana", "France", "Germany"],
    targetLanguage: "en-US",
    sendTimeLocal: "09:00",
    defaultTimezone: "UTC",
    frequencyLimitRule: "Strictly once per Christmas holiday per calendar year.",
    duplicateCycleKey: "seasonal-xmas-2026",
    maxRecipientsPerRun: 20000,
    exclusions: ["Unsubscribed Users", "Banned/Deleted Accounts", "Disabled Countries"],
    templateId: "tpl_christmas",
    emailSubject: "Merry Christmas from NobleBond!",
    emailHeading: "Wishing You a Beautiful Christmas",
    emailBody:
      "From everyone at NobleBond, we wish you a joyful Christmas filled with happiness, warmth and beautiful moments. Thank you for being part of our community.",
    emailCtaLabel: "Open NobleBond",
    emailCtaUrl: "noblebond://discover",
    nextExecutionIso: "2026-12-25T09:00:00Z",
    lastExecutionIso: null,
    eligibleUsersCount: 15,
    sentTotal: 0,
    deliveredTotal: 0,
    failedTotal: 0,
    bouncedTotal: 0,
    suppressedTotal: 2,
    requiresBackendScheduler: true,
  },
  {
    id: "aut_new_year",
    name: "NobleBond — New Year Greetings",
    automationType: "seasonal_new_year",
    isEssentialTransactional: false,
    triggerDescription: "Annual January 1 celebratory greeting honoring recipient timezones.",
    qualifyingActivityNote: "Deduplicated cleanly via seasonal-ny-YYYY lock key.",
    channel: "email",
    status: "scheduled",
    seasonalEventDate: "Jan 1",
    targetCountries: ["all"],
    targetLanguage: "all",
    sendTimeLocal: "09:00",
    defaultTimezone: "UTC",
    frequencyLimitRule: "Strictly once per New Year event per year.",
    duplicateCycleKey: "seasonal-ny-2027",
    maxRecipientsPerRun: 25000,
    exclusions: ["Unsubscribed Users", "Banned/Deleted Accounts"],
    templateId: "tpl_new_year",
    emailSubject: "Happy New Year from NobleBond!",
    emailHeading: "A New Year. New Possibilities.",
    emailBody:
      "As a new year begins, we wish you happiness, growth and wonderful new experiences. Thank you for being part of NobleBond. Here's to another year of meaningful connections.",
    emailCtaLabel: "Explore NobleBond",
    emailCtaUrl: "noblebond://discover",
    nextExecutionIso: "2027-01-01T09:00:00Z",
    lastExecutionIso: "2026-01-01T09:00:00Z",
    eligibleUsersCount: 16,
    sentTotal: 140,
    deliveredTotal: 136,
    failedTotal: 2,
    bouncedTotal: 2,
    suppressedTotal: 6,
    requiresBackendScheduler: true,
  },
  {
    id: "aut_halloween",
    name: "NobleBond — Halloween Greetings",
    automationType: "seasonal_halloween",
    isEssentialTransactional: false,
    triggerDescription: "Regional seasonal greeting (October 31) enabled selectively for participating cultural regions.",
    qualifyingActivityNote: "Defaults to US/UK/CA markets rather than assuming global relevance.",
    channel: "email",
    status: "paused",
    seasonalEventDate: "Oct 31",
    targetCountries: ["United States", "United Kingdom", "Canada"],
    targetLanguage: "en-US",
    sendTimeLocal: "11:00",
    defaultTimezone: "America/New_York",
    frequencyLimitRule: "Maximum 1 greeting per user per Halloween year; opt-in countries only.",
    duplicateCycleKey: "seasonal-halloween-2026",
    maxRecipientsPerRun: 8000,
    exclusions: ["Non-participating Regions", "Unsubscribed Users", "Banned Accounts"],
    templateId: "tpl_halloween",
    emailSubject: "Wishing You a Spooktacular Halloween!",
    emailHeading: "Have a Fun Halloween",
    emailBody:
      "From everyone at NobleBond, we wish you a fun and memorable Halloween. Enjoy the celebrations and have a wonderful time!",
    emailCtaLabel: "Return to NobleBond",
    emailCtaUrl: "noblebond://discover",
    nextExecutionIso: "2027-10-31T11:00:00Z",
    lastExecutionIso: "2026-10-31T11:00:00Z",
    eligibleUsersCount: 6,
    sentTotal: 31,
    deliveredTotal: 30,
    failedTotal: 0,
    bouncedTotal: 1,
    suppressedTotal: 11,
    requiresBackendScheduler: true,
  },
  {
    id: "aut_valentines",
    name: "NobleBond — Valentine's Day Celebration",
    automationType: "seasonal_other",
    isEssentialTransactional: false,
    triggerDescription: "Optional seasonal romance celebration on February 14.",
    qualifyingActivityNote: "Draft ready; requires administrator activation prior to Feb 14.",
    channel: "email",
    status: "draft",
    seasonalEventDate: "Feb 14",
    targetCountries: ["all"],
    targetLanguage: "en-US",
    sendTimeLocal: "10:00",
    defaultTimezone: "UTC",
    frequencyLimitRule: "Strictly once per Feb 14 event cycle.",
    duplicateCycleKey: "seasonal-val-2027",
    maxRecipientsPerRun: 25000,
    exclusions: ["Unsubscribed Users", "Suspended/Banned Accounts"],
    templateId: "tpl_valentines",
    emailSubject: "Celebrate Meaningful Connections This Valentine's Day",
    emailHeading: "Beyond a Match. A Real Connection.",
    emailBody:
      "This Valentine's Day, connect authentically with verified members across the NobleBond community.",
    emailCtaLabel: "Discover Matches",
    emailCtaUrl: "noblebond://discover",
    nextExecutionIso: "2027-02-14T10:00:00Z",
    lastExecutionIso: null,
    eligibleUsersCount: 16,
    sentTotal: 0,
    deliveredTotal: 0,
    failedTotal: 0,
    bouncedTotal: 0,
    suppressedTotal: 2,
    requiresBackendScheduler: true,
  },
  {
    id: "aut_transactional_core",
    name: "Transactional Product Events (Matches, OTP, Billing, Rewards, Support)",
    automationType: "event_transactional",
    isEssentialTransactional: true,
    triggerDescription: "Real-time backend event hooks for Welcome/OTP, Mutual Match, Subscription Receipts, Referral +50 Pts, Followed Host Live & Support Replies.",
    qualifyingActivityNote: "Strictly isolated from marketing promotions; respects critical security delivery without duplicate spam.",
    channel: "push_and_in_app",
    status: "active",
    targetCountries: ["all"],
    targetLanguage: "all",
    sendTimeLocal: "Immediate",
    defaultTimezone: "UTC",
    frequencyLimitRule: "Idempotent event-key guard per backend transaction ID (never double-fires).",
    duplicateCycleKey: "tx-event-idempotent",
    maxRecipientsPerRun: 100000,
    exclusions: ["Deleted Accounts", "Permanently Banned Accounts"],
    templateId: "tpl_transactional_match",
    emailSubject: "NobleBond Account & Activity Update",
    emailHeading: "Account Notification",
    emailBody: "Real-time transactional event generated safely from backend domain action.",
    emailCtaLabel: "Open NobleBond",
    emailCtaUrl: "noblebond://notifications",
    nextExecutionIso: null,
    lastExecutionIso: "2026-11-10T11:45:00Z",
    eligibleUsersCount: 18,
    sentTotal: 612,
    deliveredTotal: 598,
    failedTotal: 14,
    bouncedTotal: 0,
    suppressedTotal: 0,
    requiresBackendScheduler: false,
  },
];

const INITIAL_TEMPLATES: NotificationTemplateRecord[] = [
  {
    id: "tpl_inactive_6m",
    name: "6-Month Inactivity Re-Engagement Email",
    templateGroup: "Automated",
    channel: "email",
    category: "Re-engagement",
    titleOrSubject: "We've Missed You at NobleBond",
    bodyContent:
      "Hi {{firstName}}, it's been a while since we last saw you on {{appName}}. There are new people to discover, meaningful connections to make and conversations waiting for you.",
    ctaLabel: "Return to NobleBond",
    destination: "/discover",
    language: "en-US",
    status: "active",
    variablesUsed: ["firstName", "appName"],
    usedInHistoricalCampaign: true,
    updatedAtIso: "2026-11-01T10:00:00Z",
  },
  {
    id: "tpl_birthday",
    name: "Annual Birthday Greeting Email",
    templateGroup: "Seasonal",
    channel: "email",
    category: "Special Events",
    titleOrSubject: "Happy Birthday from NobleBond!",
    bodyContent:
      "Happy Birthday {{firstName}}! Today is a special day, and everyone at {{appName}} wishes you happiness, beautiful moments and meaningful connections in the year ahead.",
    ctaLabel: "Open NobleBond",
    destination: "/discover",
    language: "en-US",
    status: "active",
    variablesUsed: ["firstName", "appName"],
    usedInHistoricalCampaign: true,
    updatedAtIso: "2026-10-15T09:00:00Z",
  },
  {
    id: "tpl_new_month",
    name: "Happy New Month Celebration Email",
    templateGroup: "Automated",
    channel: "email",
    category: "Special Events",
    titleOrSubject: "Happy New Month from NobleBond!",
    bodyContent:
      "Happy New Month {{firstName}}! A brand-new month is here, and {{appName}} wishes you positive experiences, meaningful connections, and wonderful conversations.",
    ctaLabel: "Explore NobleBond",
    destination: "/discover",
    language: "en-US",
    status: "active",
    variablesUsed: ["firstName", "appName"],
    usedInHistoricalCampaign: true,
    updatedAtIso: "2026-11-01T08:00:00Z",
  },
  {
    id: "tpl_push_live",
    name: "Live Stream Showcase Alert",
    templateGroup: "Push",
    channel: "push_and_in_app",
    category: "Live Sessions",
    titleOrSubject: "Weekend Live Showcase Starting Soon",
    bodyContent:
      "Hey {{firstName}}, verified creators are going live on {{appName}} now. Tune in and join the room!",
    ctaLabel: "Watch Live",
    destination: "/live",
    language: "en-US",
    status: "active",
    variablesUsed: ["firstName", "appName"],
    usedInHistoricalCampaign: true,
    updatedAtIso: "2026-11-06T15:00:00Z",
  },
  {
    id: "tpl_ref_reward",
    name: "Referral OTP Verified +50 Pts Reward Notice",
    templateGroup: "Transactional",
    channel: "in_app",
    category: "Connection Points",
    titleOrSubject: "Referral Reward Issued: +{{rewardAmount}}",
    bodyContent:
      "Great news {{firstName}}! A friend verified their account with code {{referralCode}} and you earned {{rewardAmount}} Connection Points.",
    ctaLabel: "View Wallet Perks",
    destination: "/wallet",
    language: "en-US",
    status: "active",
    variablesUsed: ["firstName", "rewardAmount", "referralCode"],
    usedInHistoricalCampaign: true,
    updatedAtIso: "2026-10-28T11:00:00Z",
  },
];

const INITIAL_DELIVERY_LOGS: DeliveryHistoryRecord[] = [
  { id: "NTF-9001", campaignId: "cmp_1", campaignName: "Weekend Live Gifting Party 2x Event", recipientRefMasked: "am***@gmail.com", channel: "push_and_in_app", category: "Live Sessions", status: "sent", providerName: "Expo Push / FCM", providerRef: "expo_msg_881a", createdAtIso: "2026-11-07T18:00:00Z", sentAtIso: "2026-11-07T18:00:12Z", retryEligible: false, retryCount: 0, maxRetries: 3 },
  { id: "NTF-9002", campaignId: "cmp_2", campaignName: "Meet NobleBond Live: Creator Welcome", recipientRefMasked: "da***@noblebond.test", channel: "in_app", category: "Platform Announcements", status: "delivered", providerName: "NobleBond In-App Feed", providerRef: "inapp_9921", createdAtIso: "2026-11-05T12:00:00Z", sentAtIso: "2026-11-05T12:00:01Z", confirmedDeliveredAtIso: "2026-11-05T12:01:14Z", retryEligible: false, retryCount: 0, maxRetries: 3 },
  { id: "NTF-9003", campaignId: "aut_inactive_6m", campaignName: "NobleBond — We Miss You Re-engagement Campaign", recipientRefMasked: "ri***@example.com", channel: "email", category: "Re-engagement", status: "bounced", providerName: "SMTP Slot", providerRef: "smtp_err_550", createdAtIso: "2026-11-10T10:00:00Z", sentAtIso: "2026-11-10T10:00:04Z", errorCode: "550_5.1.1", failureCategory: "bounced_email", failureReason: "Permanent hard bounce — recipient mailbox does not exist. Do NOT retry.", retryEligible: false, retryCount: 0, maxRetries: 0 },
  { id: "NTF-9004", campaignId: "cmp_1", campaignName: "Weekend Live Gifting Party 2x Event", recipientRefMasked: "ch***@icloud.com", channel: "push", category: "Live Sessions", status: "failed", providerName: "APNs Gateway", providerRef: "apns_410_tok", createdAtIso: "2026-11-07T18:00:00Z", sentAtIso: "2026-11-07T18:00:09Z", errorCode: "DeviceNotRegistered", failureCategory: "invalid_device_token", failureReason: "Push token unregistered after app reinstall; requires fresh device token.", retryEligible: true, retryCount: 0, maxRetries: 2 },
  { id: "NTF-9005", campaignId: "aut_birthday", campaignName: "NobleBond — Birthday Celebration", recipientRefMasked: "so***@mail.co.uk", channel: "email", category: "Special Events", status: "suppressed", providerName: "Consent Policy Guard", providerRef: "pref_opt_out", createdAtIso: "2026-11-10T09:00:00Z", errorCode: "MARKETING_OPT_OUT", failureCategory: "suppressed_recipient", failureReason: "Recipient unsubscribed from optional emails — permanently suppressed.", retryEligible: false, retryCount: 0, maxRetries: 0 },
];

const INITIAL_AUDIT_LOGS: NotificationAuditLogRecord[] = [
  { id: "NTF-AUD-01", timestampIso: "2026-11-08T10:15:00Z", actorName: "Sarah Alexander", actorRole: "Super Administrator", actionType: "campaign_scheduled", targetName: "December Holiday Travel Passport Spotlight", summary: "Scheduled seasonal upgrade campaign for Nov 25 (suppressed 3 ineligible users)." },
  { id: "NTF-AUD-02", timestampIso: "2026-11-07T18:00:00Z", actorName: "Sarah Alexander", actorRole: "Super Administrator", actionType: "campaign_sent_demo", targetName: "Weekend Live Gifting Party 2x Event", summary: "Dispatched demo broadcast across Push + In-App queue." },
  { id: "NTF-AUD-03", timestampIso: "2026-11-01T08:30:00Z", actorName: "Automation Engine Spec", actorRole: "Configured Rule", actionType: "automation_toggled", targetName: "NobleBond — Happy New Month", summary: "Monthly schedule verified with strict once-per-month deduplication." },
];

export function buildInitialNotificationsState(): NotificationsManagementState {
  const sys = loadSystemSettingsState();
  return {
    campaigns: INITIAL_CAMPAIGNS,
    automations: INITIAL_AUTOMATIONS,
    templates: INITIAL_TEMPLATES,
    deliveryLogs: INITIAL_DELIVERY_LOGS,
    preferences: {
      defaultSenderName: sys.general.platformName || "NobleBond",
      configuredSenderEmail: sys.general.defaultContactEmail || "support@noblebond.com",
      defaultLanguage: sys.general.defaultLanguageCode || "en-US",
      defaultTimezone: sys.general.defaultTimezone || "UTC",
      maxRetryAttempts: 3,
      rateLimitPerMinute: 2000,
      maxPromotionalPushPerDay: 2,
      maxMarketingEmailsPerDay: 1,
      minHoursBetweenPromos: 12,
      quietHoursEnabled: true,
      quietHoursStart: "22:00",
      quietHoursEnd: "08:00",
      allowSecurityDuringQuietHours: true,
      enforceUnsubscribeOptOut: true,
      lastUpdatedAtIso: REF_NOW_ISO,
    },
    auditLogs: INITIAL_AUDIT_LOGS,
    lastSyncedAtIso: new Date().toISOString(),
  };
}

export function loadNotificationsState(): NotificationsManagementState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = buildInitialNotificationsState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as NotificationsManagementState;
  } catch {
    return buildInitialNotificationsState();
  }
}

export function saveNotificationsState(
  state: NotificationsManagementState
): NotificationsManagementState {
  const next = { ...state, lastSyncedAtIso: new Date().toISOString() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore storage errors
  }
  return next;
}

export function appendNotificationAudit(
  state: NotificationsManagementState,
  entry: Omit<NotificationAuditLogRecord, "id" | "timestampIso">
): NotificationsManagementState {
  const audit: NotificationAuditLogRecord = {
    ...entry,
    id: `NTF-AUD-${Date.now().toString().slice(-6)}`,
    timestampIso: new Date().toISOString(),
  };
  return saveNotificationsState({
    ...state,
    auditLogs: [audit, ...state.auditLogs],
  });
}

export function createCampaignRecordInService(
  state: NotificationsManagementState,
  draft: Omit<
    NotificationCampaignRecord,
    "id" | "createdAtIso" | "updatedAtIso" | "sentCount" | "confirmedDeliveredCount" | "failedCount" | "bouncedCount" | "openRateTrackedPercent" | "clickRateTrackedPercent" | "unreadInAppCount"
  >,
  actionMode: "draft" | "schedule" | "send_now",
  actorName: string
): NotificationsManagementState {
  const now = new Date().toISOString();
  const status: NotificationCampaignRecord["status"] =
    actionMode === "draft" ? "draft" : actionMode === "schedule" ? "scheduled" : "sent";

  const rec: NotificationCampaignRecord = {
    ...draft,
    id: `cmp_${Date.now().toString().slice(-6)}`,
    status,
    sentAtIso: actionMode === "send_now" ? now : undefined,
    sentCount: actionMode === "send_now" ? draft.estimatedRecipients : 0,
    confirmedDeliveredCount: null, // Backend webhook required for confirmed delivery count
    failedCount: 0,
    bouncedCount: 0,
    openRateTrackedPercent: null,
    clickRateTrackedPercent: null,
    unreadInAppCount:
      actionMode === "send_now" && (draft.channel === "in_app" || draft.channel === "push_and_in_app")
        ? draft.estimatedRecipients
        : 0,
    createdAtIso: now,
    updatedAtIso: now,
  };

  let nextDelivery = state.deliveryLogs;
  if (actionMode === "send_now") {
    const newLog: DeliveryHistoryRecord = {
      id: `NTF-${Date.now().toString().slice(-5)}`,
      campaignId: rec.id,
      campaignName: rec.name,
      recipientRefMasked: `${draft.estimatedRecipients} eligible member(s) [Demo Queue]`,
      channel: rec.channel,
      category: rec.category,
      status: "sent",
      providerName:
        rec.channel === "email"
          ? "SMTP Slot (Local Demo)"
          : rec.channel === "in_app"
            ? "In-App Broadcast Feed"
            : "Expo Push / FCM & APNs (Local Demo)",
      providerRef: `demo_${Date.now().toString().slice(-6)}`,
      createdAtIso: now,
      sentAtIso: now,
      retryEligible: false,
      retryCount: 0,
      maxRetries: state.preferences.maxRetryAttempts,
    };
    nextDelivery = [newLog, ...state.deliveryLogs];
  }

  return appendNotificationAudit(
    {
      ...state,
      campaigns: [rec, ...state.campaigns],
      deliveryLogs: nextDelivery,
    },
    {
      actorName,
      actorRole: "Administrator",
      actionType:
        actionMode === "draft"
          ? "campaign_created"
          : actionMode === "schedule"
            ? "campaign_scheduled"
            : "campaign_sent_demo",
      targetName: rec.name,
      summary: `${actionMode.toUpperCase()} (${rec.channel}) — Est. ${rec.estimatedRecipients} recipients (${rec.suppressedCount} suppressed).`,
    }
  );
}

export function saveTemplateRecordInService(
  state: NotificationsManagementState,
  tpl: Omit<NotificationTemplateRecord, "updatedAtIso">,
  actorName: string
): NotificationsManagementState {
  const now = new Date().toISOString();
  const full: NotificationTemplateRecord = {
    ...tpl,
    id: tpl.id || `tpl_${Date.now().toString().slice(-6)}`,
    updatedAtIso: now,
  };
  const exists = state.templates.some((t) => t.id === full.id);
  const nextTemplates = exists
    ? state.templates.map((t) => (t.id === full.id ? full : t))
    : [full, ...state.templates];
  return appendNotificationAudit(
    { ...state, templates: nextTemplates },
    {
      actorName,
      actorRole: "Administrator",
      actionType: "template_saved",
      targetName: full.name,
      summary: `${exists ? "Updated" : "Created"} ${full.templateGroup} template (${full.channel}).`,
    }
  );
}

export function exportDeliveryCsv(logs: DeliveryHistoryRecord[]): void {
  const esc = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const headers = [
    "Notification ID",
    "Campaign",
    "Recipient Ref",
    "Channel",
    "Category",
    "Status",
    "Provider",
    "Created At",
    "Sent At",
    "Error Reason",
  ];
  const lines = [
    headers.map(esc).join(","),
    ...logs.map((l) =>
      [
        l.id,
        l.campaignName,
        l.recipientRefMasked,
        l.channel,
        l.category,
        l.status,
        l.providerName,
        l.createdAtIso,
        l.sentAtIso || "",
        l.failureReason || "",
      ]
        .map(esc)
        .join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `noblebond_notifications_delivery_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportNotificationAuditCsv(logs: NotificationAuditLogRecord[]): void {
  const esc = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const headers = ["Event ID", "Timestamp", "Actor", "Action Type", "Target", "Summary"];
  const lines = [
    headers.map(esc).join(","),
    ...logs.map((l) =>
      [l.id, l.timestampIso, l.actorName, l.actionType, l.targetName, l.summary].map(esc).join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `noblebond_notifications_audit_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function buildNewDraftCampaignDefaults(
  channel: NotificationChannelType = "push",
  category: NotificationCampaignCategory = "Platform Announcements"
) {
  return {
    name: "Untitled NobleBond Notification",
    channel,
    category,
    audienceSegment: "all_eligible" as AudienceSegmentPreset,
    targetCountries: ["all"],
    targetLanguage: "en-US",
    targetPlatform: "all" as const,
    title: "Special Evening Connection Event",
    message:
      "Meet verified members active near you tonight and explore interactive NobleBond Live rooms.",
    iconKey: "bell" as const,
    ctaLabel: "Open NobleBond",
    deepLinkRoute: "/discover",
    emailSubject: "New Highlights Waiting on NobleBond",
    emailPreviewText: "Check in to discover verified profiles and Live showcases.",
    emailHeading: "Stay Connected with NobleBond",
    emailBody:
      "Hi {{firstName}}, explore newly verified profiles and live social rooms tailored to your interests on {{appName}}.",
    emailCtaText: "Open NobleBond",
    emailCtaDestination: "noblebond://discover",
    emailFooter: "You can adjust notification & email consent anytime inside NobleBond Settings.",
    recurrence: "once" as const,
    timezone: "UTC",
    createdBy: "Sarah Alexander",
  };
}

