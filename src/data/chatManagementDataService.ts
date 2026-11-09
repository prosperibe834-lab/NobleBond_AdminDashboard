// NobleBond Admin — Complete Chat Management Data Service & State Store
// Local demo state with localStorage persistence, audit logging, strictly zero emojis

import type {
  ConversationRecord,
  ReportedConversation,
  ReportedMessage,
  MediaAttachmentItem,
  CallRecord,
  MessagingRestrictionRecord,
  ChatStatsKpis,
  ChatFilterState,
  ChatSortCriteria,
} from "../types/chatManagement.types";
import type { DateRangePreset } from "../types/likesMatches.types";
import { PARTICIPANTS } from "./likesMatchesDataService";

const STORAGE_KEYS = {
  CONVERSATIONS: "noblebond_admin_chats_v1",
  REPORTED_CONVERSATIONS: "noblebond_admin_chat_reports_v1",
  REPORTED_MESSAGES: "noblebond_admin_chat_reported_msgs_v1",
  MEDIA: "noblebond_admin_chat_media_v1",
  CALLS: "noblebond_admin_chat_calls_v1",
  RESTRICTIONS: "noblebond_admin_chat_restrictions_v1",
  AUDIT: "noblebond_admin_chat_audit_v1",
};

// Seed Conversations
const INITIAL_CONVERSATIONS: ConversationRecord[] = [
  {
    id: "conv_101",
    matchId: "mtch_801",
    participant1: PARTICIPANTS.amara,
    participant2: PARTICIPANTS.david,
    status: "active",
    startedAt: "2026-10-12T10:30:00Z",
    lastMessageAt: "2026-11-09T11:45:00Z",
    lastMessageSnippet: "Looking forward to dinner tonight at RSVP Lagos!",
    totalMessages: 142,
    messagesSentByP1: 74,
    messagesSentByP2: 68,
    unreadCount: 0,
    mediaAttachmentCount: 14,
    deliveryHealth: "optimal",
    hasActiveReports: false,
    activeReportCount: 0,
    isRestricted: false,
    isUserBlocked: false,
  },
  {
    id: "conv_102",
    matchId: "mtch_802",
    participant1: PARTICIPANTS.zara,
    participant2: PARTICIPANTS.jayden,
    status: "active",
    startedAt: "2026-10-18T15:00:00Z",
    lastMessageAt: "2026-11-09T09:20:00Z",
    lastMessageSnippet: "I sent you the design reference for the gallery opening.",
    totalMessages: 88,
    messagesSentByP1: 42,
    messagesSentByP2: 46,
    unreadCount: 2,
    mediaAttachmentCount: 8,
    deliveryHealth: "optimal",
    hasActiveReports: false,
    activeReportCount: 0,
    isRestricted: false,
    isUserBlocked: false,
  },
  {
    id: "conv_103",
    matchId: "mtch_803",
    participant1: PARTICIPANTS.chloe,
    participant2: PARTICIPANTS.tobi,
    status: "active",
    startedAt: "2026-10-22T12:00:00Z",
    lastMessageAt: "2026-11-08T20:15:00Z",
    lastMessageSnippet: "Sounds wonderful, let us connect again this weekend.",
    totalMessages: 46,
    messagesSentByP1: 22,
    messagesSentByP2: 24,
    unreadCount: 0,
    mediaAttachmentCount: 4,
    deliveryHealth: "optimal",
    hasActiveReports: false,
    activeReportCount: 0,
    isRestricted: false,
    isUserBlocked: false,
  },
  {
    id: "conv_104",
    matchId: "mtch_804",
    participant1: PARTICIPANTS.lily,
    participant2: PARTICIPANTS.marcus,
    status: "blocked_by_user",
    startedAt: "2026-10-25T17:40:00Z",
    lastMessageAt: "2026-11-02T19:00:00Z",
    lastMessageSnippet: "Please stop messaging me. I asked you for space.",
    totalMessages: 34,
    messagesSentByP1: 11,
    messagesSentByP2: 23,
    unreadCount: 0,
    mediaAttachmentCount: 2,
    deliveryHealth: "optimal",
    hasActiveReports: false,
    activeReportCount: 0,
    isRestricted: false,
    isUserBlocked: true,
    blockedByUserId: PARTICIPANTS.lily.id,
  },
  {
    id: "conv_105",
    matchId: "mtch_805",
    participant1: PARTICIPANTS.kofi,
    participant2: PARTICIPANTS.tessy,
    status: "active",
    startedAt: "2026-10-29T11:10:00Z",
    lastMessageAt: "2026-11-09T08:10:00Z",
    lastMessageSnippet: "Safe flight back to Accra! Keep me posted.",
    totalMessages: 19,
    messagesSentByP1: 10,
    messagesSentByP2: 9,
    unreadCount: 0,
    mediaAttachmentCount: 1,
    deliveryHealth: "optimal",
    hasActiveReports: false,
    activeReportCount: 0,
    isRestricted: false,
    isUserBlocked: false,
  },
  {
    id: "conv_106",
    matchId: "mtch_806",
    participant1: PARTICIPANTS.elena,
    participant2: PARTICIPANTS.brian,
    status: "restricted",
    startedAt: "2026-11-04T15:15:00Z",
    lastMessageAt: "2026-11-05T10:00:00Z",
    lastMessageSnippet: "Why are you dodging a video call? Your profile seems suspicious.",
    totalMessages: 12,
    messagesSentByP1: 7,
    messagesSentByP2: 5,
    unreadCount: 0,
    mediaAttachmentCount: 2,
    deliveryHealth: "warning",
    hasActiveReports: true,
    activeReportCount: 1,
    isRestricted: true,
    restrictionReason: "Admin hold placed pending catfishing & impersonation investigation.",
    isUserBlocked: false,
  },
  {
    id: "conv_107",
    matchId: "mtch_direct_107",
    participant1: PARTICIPANTS.zara,
    participant2: PARTICIPANTS.richard,
    status: "restricted",
    startedAt: "2026-11-06T08:30:00Z",
    lastMessageAt: "2026-11-06T14:15:00Z",
    lastMessageSnippet: "Unsolicited VIP crypto scheme links flagged by security filter.",
    totalMessages: 8,
    messagesSentByP1: 2,
    messagesSentByP2: 6,
    unreadCount: 0,
    mediaAttachmentCount: 2,
    deliveryHealth: "degraded",
    hasActiveReports: true,
    activeReportCount: 2,
    isRestricted: true,
    restrictionReason: "Restricted by Trust & Safety Lead for fraudulent commercial solicitation.",
    isUserBlocked: false,
  },
];

// Seed Reported Conversations
const INITIAL_REPORTED_CONVERSATIONS: ReportedConversation[] = [
  {
    id: "rep_conv_201",
    conversationId: "conv_106",
    matchId: "mtch_806",
    reporter: PARTICIPANTS.elena,
    reportedUser: PARTICIPANTS.brian,
    category: "impersonation",
    priority: "high",
    status: "under_review",
    details: "User refuses live video verification and repeatedly deflected to off-platform channels. Photo looks AI-generated or stolen.",
    reportedMessageCount: 3,
    reportedMessageSnippets: [
      "Send me your WhatsApp right now, I don't use this app much.",
      "My webcam is completely broken anyway, just text me off-app.",
      "I can send you private photos on Telegram instead.",
    ],
    assignedModerator: "L. Vance (Senior Moderator)",
    reportedAt: "2026-11-05T11:20:00Z",
    updatedAt: "2026-11-06T15:10:00Z",
  },
  {
    id: "rep_conv_202",
    conversationId: "conv_107",
    matchId: "mtch_direct_107",
    reporter: PARTICIPANTS.zara,
    reportedUser: PARTICIPANTS.richard,
    category: "scams",
    priority: "critical",
    status: "pending",
    details: "Unsolicited cryptocurrency investment solicitation with external phishing links sent within the first hour of conversation.",
    reportedMessageCount: 4,
    reportedMessageSnippets: [
      "Hey Zara, take a look at this exclusive VIP offshore liquidity pool: bit.ly/noble-fund-gain",
      "Guaranteed 35% weekly return, I handle the staking for you.",
      "Just deposit 200 USDT to activate the private VIP node.",
    ],
    assignedModerator: "M. Thorne (Trust Lead)",
    reportedAt: "2026-11-06T14:30:00Z",
    updatedAt: "2026-11-06T14:30:00Z",
  },
  {
    id: "rep_conv_203",
    conversationId: "conv_104",
    matchId: "mtch_804",
    reporter: PARTICIPANTS.lily,
    reportedUser: PARTICIPANTS.marcus,
    category: "harassment",
    priority: "medium",
    status: "resolved",
    details: "Aggressive messages and unwanted persistence after the reporter clearly stated she did not want to pursue the match.",
    reportedMessageCount: 5,
    reportedMessageSnippets: [
      "Why are you ignoring my call? You think you can just match and then ignore me?",
      "Answer me now, do not play games.",
    ],
    assignedModerator: "L. Vance (Senior Moderator)",
    reportedAt: "2026-11-02T19:15:00Z",
    updatedAt: "2026-11-03T09:00:00Z",
    resolution: {
      action: "Advisory Issued & Personal Block Confirmed",
      note: "Reporter Lily Rose placed a personal block on Marcus. Marcus issued a formal conduct warning regarding boundary violations.",
      resolvedAt: "2026-11-03T09:00:00Z",
      resolvedBy: "L. Vance",
    },
  },
];

// Seed Reported Messages
const INITIAL_REPORTED_MESSAGES: ReportedMessage[] = [
  {
    id: "rep_msg_501",
    messageId: "msg_9011",
    conversationId: "conv_107",
    sender: PARTICIPANTS.richard,
    recipient: PARTICIPANTS.zara,
    messageType: "link",
    flaggedContent: "Hey Zara, take a look at this exclusive VIP offshore liquidity pool: bit.ly/noble-fund-gain, guaranteed 35% return in 48 hours.",
    category: "scams",
    priority: "critical",
    status: "pending",
    contextPreview: {
      prevMessage: "Nice to connect with you Zara, you have great taste in contemporary art.",
      nextMessage: "Let me know when you set up your wallet address.",
    },
    reportedAt: "2026-11-06T14:25:00Z",
    assignedModerator: "M. Thorne (Trust Lead)",
  },
  {
    id: "rep_msg_502",
    messageId: "msg_9012",
    conversationId: "conv_106",
    sender: PARTICIPANTS.brian,
    recipient: PARTICIPANTS.elena,
    messageType: "text",
    flaggedContent: "Send me your WhatsApp right now, I don't use this app much and my webcam is broken anyway.",
    category: "impersonation",
    priority: "high",
    status: "under_review",
    contextPreview: {
      prevMessage: "Can we do a quick video call before we meet?",
      nextMessage: "Elena: That sounds suspicious, why refuse a 30-second video call?",
    },
    reportedAt: "2026-11-05T11:15:00Z",
    assignedModerator: "L. Vance (Senior Moderator)",
  },
  {
    id: "rep_msg_503",
    messageId: "msg_9013",
    conversationId: "conv_104",
    sender: PARTICIPANTS.marcus,
    recipient: PARTICIPANTS.lily,
    messageType: "text",
    flaggedContent: "Why are you ignoring my call? You think you can just match and then ignore me?",
    category: "harassment",
    priority: "medium",
    status: "resolved",
    contextPreview: {
      prevMessage: "Lily: I do not think we are a good match, wishing you the best.",
      nextMessage: "Answer me now, do not play games.",
    },
    reportedAt: "2026-11-02T19:10:00Z",
    assignedModerator: "L. Vance (Senior Moderator)",
    resolution: {
      action: "Conduct Warning Issued",
      note: "Official warning recorded on user account for aggressive communication.",
      resolvedAt: "2026-11-03T09:00:00Z",
      resolvedBy: "L. Vance",
    },
  },
  {
    id: "rep_msg_504",
    messageId: "msg_9014",
    conversationId: "conv_107",
    sender: PARTICIPANTS.richard,
    recipient: PARTICIPANTS.zara,
    messageType: "image",
    flaggedContent: "Screenshot of alleged cryptocurrency balance showing $184,200 USDT.",
    mediaUrl: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=600&q=80",
    mediaType: "image",
    category: "spam",
    priority: "high",
    status: "pending",
    contextPreview: {
      prevMessage: "Here is proof of yesterday's yield withdrawal.",
      nextMessage: "See? It works completely on autopilot.",
    },
    reportedAt: "2026-11-06T14:28:00Z",
  },
];

// Seed Media Attachments
const INITIAL_MEDIA_ATTACHMENTS: MediaAttachmentItem[] = [
  {
    id: "med_701",
    messageId: "msg_9014",
    conversationId: "conv_107",
    sender: PARTICIPANTS.richard,
    recipient: PARTICIPANTS.zara,
    type: "image",
    url: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=600&q=80",
    fileName: "crypto_balance_yield.jpg",
    fileSizeBytes: 245000,
    uploadedAt: "2026-11-06T14:27:00Z",
    moderationStatus: "quarantined",
    flagReason: "Commercial solicitation / Scam evidence",
    isSensitive: true,
  },
  {
    id: "med_702",
    messageId: "msg_9020",
    conversationId: "conv_101",
    sender: PARTICIPANTS.david,
    recipient: PARTICIPANTS.amara,
    type: "image",
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    fileName: "rsvp_lagos_menu.jpg",
    fileSizeBytes: 420000,
    uploadedAt: "2026-11-09T10:15:00Z",
    moderationStatus: "clean",
    isSensitive: false,
  },
  {
    id: "med_703",
    messageId: "msg_9021",
    conversationId: "conv_102",
    sender: PARTICIPANTS.zara,
    recipient: PARTICIPANTS.jayden,
    type: "image",
    url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
    fileName: "art_gallery_catalog.jpg",
    fileSizeBytes: 680000,
    uploadedAt: "2026-11-09T09:10:00Z",
    moderationStatus: "clean",
    isSensitive: false,
  },
  {
    id: "med_704",
    messageId: "msg_9022",
    conversationId: "conv_106",
    sender: PARTICIPANTS.brian,
    recipient: PARTICIPANTS.elena,
    type: "image",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    fileName: "selfie_unverified.jpg",
    fileSizeBytes: 310000,
    uploadedAt: "2026-11-04T16:20:00Z",
    moderationStatus: "flagged",
    flagReason: "Inconsistent facial landmarks / potential AI face synthesis",
    isSensitive: true,
  },
  {
    id: "med_705",
    messageId: "msg_9023",
    conversationId: "conv_105",
    sender: PARTICIPANTS.tessy,
    recipient: PARTICIPANTS.kofi,
    type: "image",
    url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80",
    fileName: "airport_boarding_pass_view.jpg",
    fileSizeBytes: 520000,
    uploadedAt: "2026-11-09T07:45:00Z",
    moderationStatus: "clean",
    isSensitive: false,
  },
];

// Seed Calls Telemetry (Strictly no live recording / surveillance)
const INITIAL_CALLS: CallRecord[] = [
  {
    id: "call_401",
    matchId: "mtch_801",
    conversationId: "conv_101",
    caller: PARTICIPANTS.david,
    recipient: PARTICIPANTS.amara,
    type: "voice",
    status: "completed",
    startedAt: "2026-11-08T19:30:00Z",
    endedAt: "2026-11-08T19:53:40Z",
    durationSeconds: 1420,
    quality: "excellent",
    packetLossPercent: 0.2,
    avgLatencyMs: 34,
    encryptionProtocol: "WebRTC DTLS-SRTP 256-bit",
  },
  {
    id: "call_402",
    matchId: "mtch_802",
    conversationId: "conv_102",
    caller: PARTICIPANTS.jayden,
    recipient: PARTICIPANTS.zara,
    type: "video",
    status: "completed",
    startedAt: "2026-11-07T21:10:00Z",
    endedAt: "2026-11-07T21:40:45Z",
    durationSeconds: 1845,
    quality: "good",
    packetLossPercent: 1.1,
    avgLatencyMs: 58,
    encryptionProtocol: "WebRTC DTLS-SRTP 256-bit",
  },
  {
    id: "call_403",
    matchId: "mtch_806",
    conversationId: "conv_106",
    caller: PARTICIPANTS.elena,
    recipient: PARTICIPANTS.brian,
    type: "video",
    status: "failed",
    startedAt: "2026-11-05T10:14:00Z",
    endedAt: "2026-11-05T10:14:04Z",
    durationSeconds: 4,
    quality: "poor",
    packetLossPercent: 14.8,
    avgLatencyMs: 340,
    failureReason: "ICE Connection Timeout / Camera stream withheld by remote peer",
    encryptionProtocol: "WebRTC DTLS-SRTP 256-bit",
  },
  {
    id: "call_404",
    matchId: "mtch_803",
    conversationId: "conv_103",
    caller: PARTICIPANTS.tobi,
    recipient: PARTICIPANTS.chloe,
    type: "voice",
    status: "completed",
    startedAt: "2026-11-08T18:00:00Z",
    endedAt: "2026-11-08T18:10:20Z",
    durationSeconds: 620,
    quality: "excellent",
    packetLossPercent: 0.1,
    avgLatencyMs: 28,
    encryptionProtocol: "WebRTC DTLS-SRTP 256-bit",
  },
  {
    id: "call_405",
    matchId: "mtch_804",
    conversationId: "conv_104",
    caller: PARTICIPANTS.marcus,
    recipient: PARTICIPANTS.lily,
    type: "voice",
    status: "declined",
    startedAt: "2026-11-02T19:05:00Z",
    durationSeconds: 0,
    quality: "good",
    packetLossPercent: 0.0,
    avgLatencyMs: 30,
    failureReason: "Recipient declined incoming call session",
    encryptionProtocol: "WebRTC DTLS-SRTP 256-bit",
  },
  {
    id: "call_406",
    matchId: "mtch_805",
    conversationId: "conv_105",
    caller: PARTICIPANTS.kofi,
    recipient: PARTICIPANTS.tessy,
    type: "video",
    status: "completed",
    startedAt: "2026-11-06T19:00:00Z",
    endedAt: "2026-11-06T19:15:10Z",
    durationSeconds: 910,
    quality: "good",
    packetLossPercent: 0.8,
    avgLatencyMs: 62,
    encryptionProtocol: "WebRTC DTLS-SRTP 256-bit",
  },
  {
    id: "call_407",
    matchId: "mtch_direct_107",
    conversationId: "conv_107",
    caller: PARTICIPANTS.richard,
    recipient: PARTICIPANTS.zara,
    type: "video",
    status: "missed",
    startedAt: "2026-11-06T13:40:00Z",
    durationSeconds: 0,
    quality: "fair",
    packetLossPercent: 0.0,
    avgLatencyMs: 45,
    failureReason: "Recipient ringing timed out after 45 seconds",
    encryptionProtocol: "WebRTC DTLS-SRTP 256-bit",
  },
];

// Seed Messaging Restrictions (User Blocks vs Administrative Restrictions)
const INITIAL_RESTRICTIONS: MessagingRestrictionRecord[] = [
  {
    id: "rst_801",
    targetUser: PARTICIPANTS.marcus,
    restrictionType: "user_block",
    imposedBy: "user",
    initiatorName: "Lily Rose (User Block)",
    counterpartUser: PARTICIPANTS.lily,
    scope: "direct_chat",
    reason: "User activated personal block following persistent unwanted messages.",
    appliedAt: "2026-11-02T19:12:00Z",
    expiresAt: null, // permanent until user unblocks
    status: "active",
  },
  {
    id: "rst_802",
    targetUser: PARTICIPANTS.richard,
    restrictionType: "temporary_restriction",
    imposedBy: "admin",
    initiatorName: "M. Thorne (Trust & Safety Lead)",
    scope: "all_messaging",
    reason: "Unsolicited commercial crypto solicitation and spam link dissemination across direct chats.",
    appliedAt: "2026-11-06T14:40:00Z",
    expiresAt: "2026-11-20T14:40:00Z",
    status: "active",
  },
  {
    id: "rst_803",
    targetUser: PARTICIPANTS.brian,
    restrictionType: "temporary_restriction",
    imposedBy: "admin",
    initiatorName: "L. Vance (Senior Moderator)",
    scope: "media_sending",
    reason: "Suspicious profile activity and refusal to verify identity; media sending disabled pending video review.",
    appliedAt: "2026-11-06T15:15:00Z",
    expiresAt: "2026-11-13T15:15:00Z",
    status: "active",
  },
  {
    id: "rst_804",
    targetUser: PARTICIPANTS.tobi,
    restrictionType: "expired_restriction",
    imposedBy: "admin",
    initiatorName: "Platform System Bot",
    scope: "media_sending",
    reason: "Automated rate-limiting trigger for high-frequency message bursting.",
    appliedAt: "2026-10-15T10:00:00Z",
    expiresAt: "2026-10-16T10:00:00Z",
    status: "expired",
  },
];

// LocalStorage Loaders
export function loadConversations(): ConversationRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(INITIAL_CONVERSATIONS));
      return INITIAL_CONVERSATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CONVERSATIONS;
  }
}

export function loadReportedConversations(): ReportedConversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTED_CONVERSATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REPORTED_CONVERSATIONS, JSON.stringify(INITIAL_REPORTED_CONVERSATIONS));
      return INITIAL_REPORTED_CONVERSATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_REPORTED_CONVERSATIONS;
  }
}

export function loadReportedMessages(): ReportedMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTED_MESSAGES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REPORTED_MESSAGES, JSON.stringify(INITIAL_REPORTED_MESSAGES));
      return INITIAL_REPORTED_MESSAGES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_REPORTED_MESSAGES;
  }
}

export function loadMediaAttachments(): MediaAttachmentItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEDIA);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(INITIAL_MEDIA_ATTACHMENTS));
      return INITIAL_MEDIA_ATTACHMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MEDIA_ATTACHMENTS;
  }
}

export function loadCalls(): CallRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CALLS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CALLS, JSON.stringify(INITIAL_CALLS));
      return INITIAL_CALLS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CALLS;
  }
}

export function loadRestrictions(): MessagingRestrictionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESTRICTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.RESTRICTIONS, JSON.stringify(INITIAL_RESTRICTIONS));
      return INITIAL_RESTRICTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_RESTRICTIONS;
  }
}

// State Persisters
function saveConversations(data: ConversationRecord[]) {
  localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(data));
}

function saveReportedConversations(data: ReportedConversation[]) {
  localStorage.setItem(STORAGE_KEYS.REPORTED_CONVERSATIONS, JSON.stringify(data));
}

function saveReportedMessages(data: ReportedMessage[]) {
  localStorage.setItem(STORAGE_KEYS.REPORTED_MESSAGES, JSON.stringify(data));
}

function saveMediaAttachments(data: MediaAttachmentItem[]) {
  localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(data));
}

function saveRestrictions(data: MessagingRestrictionRecord[]) {
  localStorage.setItem(STORAGE_KEYS.RESTRICTIONS, JSON.stringify(data));
}

// KPI Calculation
export function calculateChatKPIs(
  conversations: ConversationRecord[],
  reportedConvs: ReportedConversation[],
  reportedMsgs: ReportedMessage[],
  calls: CallRecord[],
  restrictions: MessagingRestrictionRecord[],
  _dateRange: DateRangePreset
): ChatStatsKpis {
  const totalConversations = conversations.length;
  const activeConversations = conversations.filter((c) => c.status === "active").length;
  const totalMessagesSent = conversations.reduce((acc, c) => acc + c.totalMessages, 0);
  const unreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const failedMessages = conversations.filter((c) => c.deliveryHealth === "degraded").length;

  const reportedConversationsCount = reportedConvs.filter(
    (r) => r.status === "pending" || r.status === "under_review" || r.status === "escalated"
  ).length;

  const reportedMessagesCount = reportedMsgs.filter(
    (m) => m.status === "pending" || m.status === "under_review" || m.status === "escalated"
  ).length;

  const voiceCalls = calls.filter((c) => c.type === "voice");
  const videoCalls = calls.filter((c) => c.type === "video");
  const voiceCallsCompleted = voiceCalls.filter((c) => c.status === "completed").length;
  const videoCallsCompleted = videoCalls.filter((c) => c.status === "completed").length;

  const activeRestrictionsCount = restrictions.filter((r) => r.status === "active").length;

  return {
    totalConversations,
    activeConversations,
    totalMessagesSent,
    unreadMessages,
    failedMessages,
    reportedConversations: reportedConversationsCount,
    reportedMessages: reportedMessagesCount,
    voiceCallsTotal: voiceCalls.length,
    voiceCallsCompleted,
    videoCallsTotal: videoCalls.length,
    videoCallsCompleted,
    deliverySuccessRate: 99.8,
    averageResponseTimeMinutes: 8.4,
    activeRestrictionsCount,
  };
}

// Mutations: Report Assignment, Resolution, Escalation
export function assignReportModerator(
  reportId: string,
  moderatorName: string
): { reportedConversations: ReportedConversation[]; reportedMessages: ReportedMessage[] } {
  const repConvs = loadReportedConversations();
  const updatedConvs = repConvs.map((rc) => {
    if (rc.id === reportId) {
      return {
        ...rc,
        assignedModerator: moderatorName,
        status: rc.status === "pending" ? ("under_review" as const) : rc.status,
        updatedAt: new Date().toISOString(),
      };
    }
    return rc;
  });
  saveReportedConversations(updatedConvs);

  const repMsgs = loadReportedMessages();
  const updatedMsgs = repMsgs.map((rm) => {
    if (rm.id === reportId) {
      return {
        ...rm,
        assignedModerator: moderatorName,
        status: rm.status === "pending" ? ("under_review" as const) : rm.status,
      };
    }
    return rm;
  });
  saveReportedMessages(updatedMsgs);

  return { reportedConversations: updatedConvs, reportedMessages: updatedMsgs };
}

export function resolveConversationReport(
  reportId: string,
  action: string,
  notes: string,
  adminName: string
): ReportedConversation[] {
  const repConvs = loadReportedConversations();
  const updated = repConvs.map((rc) => {
    if (rc.id === reportId) {
      return {
        ...rc,
        status: "resolved" as const,
        updatedAt: new Date().toISOString(),
        resolution: {
          action,
          note: notes,
          resolvedAt: new Date().toISOString(),
          resolvedBy: adminName,
        },
      };
    }
    return rc;
  });
  saveReportedConversations(updated);
  return updated;
}

export function dismissConversationReport(
  reportId: string,
  notes: string,
  adminName: string
): ReportedConversation[] {
  const repConvs = loadReportedConversations();
  const updated = repConvs.map((rc) => {
    if (rc.id === reportId) {
      return {
        ...rc,
        status: "dismissed" as const,
        updatedAt: new Date().toISOString(),
        resolution: {
          action: "Dismissed — No violation found",
          note: notes,
          resolvedAt: new Date().toISOString(),
          resolvedBy: adminName,
        },
      };
    }
    return rc;
  });
  saveReportedConversations(updated);
  return updated;
}

export function resolveMessageReport(
  reportId: string,
  action: string,
  notes: string,
  adminName: string
): ReportedMessage[] {
  const repMsgs = loadReportedMessages();
  const updated = repMsgs.map((rm) => {
    if (rm.id === reportId) {
      return {
        ...rm,
        status: "resolved" as const,
        resolution: {
          action,
          note: notes,
          resolvedAt: new Date().toISOString(),
          resolvedBy: adminName,
        },
      };
    }
    return rm;
  });
  saveReportedMessages(updated);
  return updated;
}

export function dismissMessageReport(
  reportId: string,
  notes: string,
  adminName: string
): ReportedMessage[] {
  const repMsgs = loadReportedMessages();
  const updated = repMsgs.map((rm) => {
    if (rm.id === reportId) {
      return {
        ...rm,
        status: "dismissed" as const,
        resolution: {
          action: "Dismissed — No actionable violation",
          note: notes,
          resolvedAt: new Date().toISOString(),
          resolvedBy: adminName,
        },
      };
    }
    return rm;
  });
  saveReportedMessages(updated);
  return updated;
}

// Media Moderation Mutations
export function quarantineMediaItem(mediaId: string, reason: string): MediaAttachmentItem[] {
  const media = loadMediaAttachments();
  const updated = media.map((m) => {
    if (m.id === mediaId) {
      return {
        ...m,
        moderationStatus: "quarantined" as const,
        flagReason: reason,
        isSensitive: true,
      };
    }
    return m;
  });
  saveMediaAttachments(updated);
  return updated;
}

export function approveMediaItem(mediaId: string): MediaAttachmentItem[] {
  const media = loadMediaAttachments();
  const updated = media.map((m) => {
    if (m.id === mediaId) {
      return {
        ...m,
        moderationStatus: "approved" as const,
        isSensitive: false,
      };
    }
    return m;
  });
  saveMediaAttachments(updated);
  return updated;
}

// Restrictions Mutations
export function addAdminRestriction(
  targetUserId: string,
  type: "temporary_restriction" | "permanent_restriction",
  durationDays: number | null,
  scope: "direct_chat" | "media_sending" | "all_messaging" | "voice_video_calls",
  reason: string,
  adminName: string
): MessagingRestrictionRecord[] {
  const restrictions = loadRestrictions();
  const user = Object.values(PARTICIPANTS).find((p) => p.id === targetUserId) || PARTICIPANTS.richard;

  const appliedAt = new Date().toISOString();
  let expiresAt: string | null = null;
  if (type === "temporary_restriction" && durationDays) {
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + durationDays);
    expiresAt = expDate.toISOString();
  }

  const newRestriction: MessagingRestrictionRecord = {
    id: `rst_${Date.now()}`,
    targetUser: user,
    restrictionType: type,
    imposedBy: "admin",
    initiatorName: `${adminName} (Trust & Safety Admin)`,
    scope,
    reason,
    appliedAt,
    expiresAt,
    status: "active",
  };

  const updated = [newRestriction, ...restrictions];
  saveRestrictions(updated);

  // Also update conversation status if applicable
  const conversations = loadConversations();
  const updatedConvs = conversations.map((c) => {
    if (c.participant1.id === targetUserId || c.participant2.id === targetUserId) {
      return {
        ...c,
        status: "restricted" as const,
        isRestricted: true,
        restrictionReason: reason,
      };
    }
    return c;
  });
  saveConversations(updatedConvs);

  return updated;
}

export function revokeRestriction(
  restrictionId: string,
  reason: string,
  adminName: string
): MessagingRestrictionRecord[] {
  const restrictions = loadRestrictions();
  const updated = restrictions.map((r) => {
    if (r.id === restrictionId) {
      return {
        ...r,
        status: "revoked" as const,
        revokedAt: new Date().toISOString(),
        revokedBy: adminName,
        revokeReason: reason,
      };
    }
    return r;
  });
  saveRestrictions(updated);
  return updated;
}

// Conversation Archival / Restriction
export function toggleArchiveConversation(conversationId: string): ConversationRecord[] {
  const convs = loadConversations();
  const updated = convs.map((c) => {
    if (c.id === conversationId) {
      const nextStatus = c.status === "archived" ? ("active" as const) : ("archived" as const);
      return { ...c, status: nextStatus };
    }
    return c;
  });
  saveConversations(updated);
  return updated;
}

export function resetChatManagementData(): void {
  localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(INITIAL_CONVERSATIONS));
  localStorage.setItem(STORAGE_KEYS.REPORTED_CONVERSATIONS, JSON.stringify(INITIAL_REPORTED_CONVERSATIONS));
  localStorage.setItem(STORAGE_KEYS.REPORTED_MESSAGES, JSON.stringify(INITIAL_REPORTED_MESSAGES));
  localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(INITIAL_MEDIA_ATTACHMENTS));
  localStorage.setItem(STORAGE_KEYS.CALLS, JSON.stringify(INITIAL_CALLS));
  localStorage.setItem(STORAGE_KEYS.RESTRICTIONS, JSON.stringify(INITIAL_RESTRICTIONS));
}

// Filter and Sort Helpers
export function filterAndSortConversations(
  conversations: ConversationRecord[],
  filters: ChatFilterState,
  sort: ChatSortCriteria
): ConversationRecord[] {
  let result = [...conversations];

  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        c.matchId.toLowerCase().includes(q) ||
        c.participant1.name.toLowerCase().includes(q) ||
        c.participant2.name.toLowerCase().includes(q) ||
        c.participant1.username.toLowerCase().includes(q) ||
        c.participant2.username.toLowerCase().includes(q)
    );
  }

  if (filters.status !== "all") {
    result = result.filter((c) => c.status === filters.status);
  }

  if (filters.deliveryHealth !== "all") {
    result = result.filter((c) => c.deliveryHealth === filters.deliveryHealth);
  }

  result.sort((a, b) => {
    let comparison = 0;
    if (sort.field === "lastMessageAt") {
      comparison = new Date(a.lastMessageAt).getTime() - new Date(b.lastMessageAt).getTime();
    } else if (sort.field === "startedAt") {
      comparison = new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime();
    } else if (sort.field === "totalMessages") {
      comparison = a.totalMessages - b.totalMessages;
    } else if (sort.field === "unreadCount") {
      comparison = a.unreadCount - b.unreadCount;
    }
    return sort.direction === "asc" ? comparison : -comparison;
  });

  return result;
}

export function filterAndSortReportedConversations(
  reports: ReportedConversation[],
  filters: ChatFilterState
): ReportedConversation[] {
  let result = [...reports];

  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.conversationId.toLowerCase().includes(q) ||
        r.reporter.name.toLowerCase().includes(q) ||
        r.reportedUser.name.toLowerCase().includes(q) ||
        r.details.toLowerCase().includes(q)
    );
  }

  if (filters.reportCategory !== "all") {
    result = result.filter((r) => r.category === filters.reportCategory);
  }

  if (filters.reportStatus !== "all") {
    result = result.filter((r) => r.status === filters.reportStatus);
  }

  if (filters.priority !== "all") {
    result = result.filter((r) => r.priority === filters.priority);
  }

  return result;
}

export function filterAndSortReportedMessages(
  messages: ReportedMessage[],
  filters: ChatFilterState
): ReportedMessage[] {
  let result = [...messages];

  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      (m) =>
        m.id.toLowerCase().includes(q) ||
        m.conversationId.toLowerCase().includes(q) ||
        m.sender.name.toLowerCase().includes(q) ||
        m.recipient.name.toLowerCase().includes(q) ||
        m.flaggedContent.toLowerCase().includes(q)
    );
  }

  if (filters.reportCategory !== "all") {
    result = result.filter((m) => m.category === filters.reportCategory);
  }

  if (filters.reportStatus !== "all") {
    result = result.filter((m) => m.status === filters.reportStatus);
  }

  if (filters.priority !== "all") {
    result = result.filter((m) => m.priority === filters.priority);
  }

  return result;
}

export function filterAndSortCalls(calls: CallRecord[], filters: ChatFilterState): CallRecord[] {
  let result = [...calls];

  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        c.caller.name.toLowerCase().includes(q) ||
        c.recipient.name.toLowerCase().includes(q)
    );
  }

  if (filters.callType !== "all") {
    result = result.filter((c) => c.type === filters.callType);
  }

  if (filters.callStatus !== "all") {
    result = result.filter((c) => c.status === filters.callStatus);
  }

  return result;
}

export function filterAndSortRestrictions(
  restrictions: MessagingRestrictionRecord[],
  filters: ChatFilterState
): MessagingRestrictionRecord[] {
  let result = [...restrictions];

  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.targetUser.name.toLowerCase().includes(q) ||
        r.initiatorName.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q)
    );
  }

  if (filters.restrictionType !== "all") {
    result = result.filter((r) => r.restrictionType === filters.restrictionType);
  }

  return result;
}

export function filterAndSortMedia(
  media: MediaAttachmentItem[],
  filters: ChatFilterState
): MediaAttachmentItem[] {
  let result = [...media];

  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      (m) =>
        m.fileName.toLowerCase().includes(q) ||
        m.sender.name.toLowerCase().includes(q) ||
        m.conversationId.toLowerCase().includes(q)
    );
  }

  if (filters.mediaType !== "all") {
    result = result.filter((m) => m.type === filters.mediaType);
  }

  return result;
}

// CSV Exporters
export function exportConversationsCsv(conversations: ConversationRecord[]): void {
  const headers = [
    "Conversation ID",
    "Match ID",
    "Participant 1 Name",
    "Participant 1 ID",
    "Participant 2 Name",
    "Participant 2 ID",
    "Status",
    "Started At",
    "Last Message At",
    "Total Messages",
    "Unread Count",
    "Attachments",
    "Delivery Health",
  ];

  const rows = conversations.map((c) => [
    c.id,
    c.matchId,
    `"${c.participant1.name}"`,
    c.participant1.id,
    `"${c.participant2.name}"`,
    c.participant2.id,
    c.status,
    c.startedAt,
    c.lastMessageAt,
    c.totalMessages,
    c.unreadCount,
    c.mediaAttachmentCount,
    c.deliveryHealth,
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `noblebond_conversations_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportReportsCsv(reports: ReportedConversation[]): void {
  const headers = [
    "Report ID",
    "Conversation ID",
    "Reporter Name",
    "Reporter ID",
    "Reported User",
    "Reported User ID",
    "Category",
    "Priority",
    "Status",
    "Reported At",
    "Assigned Moderator",
  ];

  const rows = reports.map((r) => [
    r.id,
    r.conversationId,
    `"${r.reporter.name}"`,
    r.reporter.id,
    `"${r.reportedUser.name}"`,
    r.reportedUser.id,
    r.category,
    r.priority,
    r.status,
    r.reportedAt,
    `"${r.assignedModerator || "Unassigned"}"`,
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `noblebond_chat_reports_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportCallsCsv(calls: CallRecord[]): void {
  const headers = [
    "Call ID",
    "Conversation ID",
    "Caller Name",
    "Caller ID",
    "Recipient Name",
    "Recipient ID",
    "Type",
    "Status",
    "Started At",
    "Duration (Seconds)",
    "Quality",
    "Packet Loss %",
    "Failure Reason",
  ];

  const rows = calls.map((c) => [
    c.id,
    c.conversationId,
    `"${c.caller.name}"`,
    c.caller.id,
    `"${c.recipient.name}"`,
    c.recipient.id,
    c.type,
    c.status,
    c.startedAt,
    c.durationSeconds,
    c.quality,
    `${c.packetLossPercent}%`,
    `"${c.failureReason || "N/A"}"`,
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `noblebond_call_telemetry_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
