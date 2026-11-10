// NobleBond Admin — Complete Live Management Data Service & State Store
// Local demo state with localStorage persistence, audit logging, strictly zero emojis

import type {
  LiveSessionRecord,
  LiveHostRecord,
  LiveViewerRecord,
  LiveGuestRecord,
  LiveGiftTransactionRecord,
  LiveCommentRecord,
  LiveReportRecord,
  StreamHealthRecord,
  LiveStatsKpis,
  LiveFilterState,
  LiveSortCriteria,
} from "../types/liveManagement.types";
import { PARTICIPANTS } from "./likesMatchesDataService";

const STORAGE_KEYS = {
  SESSIONS: "noblebond_admin_live_sessions_v1",
  HOSTS: "noblebond_admin_live_hosts_v1",
  VIEWERS: "noblebond_admin_live_viewers_v1",
  GUESTS: "noblebond_admin_live_guests_v1",
  GIFTS: "noblebond_admin_live_gifts_v1",
  COMMENTS: "noblebond_admin_live_comments_v1",
  REPORTS: "noblebond_admin_live_reports_v1",
  HEALTH: "noblebond_admin_live_health_v1",
  AUDIT: "noblebond_admin_live_audit_v1",
};

// Seed Guests
const INITIAL_GUESTS: LiveGuestRecord[] = [
  {
    id: "gst_301",
    sessionId: "live_401",
    sessionTitle: "Acoustic Vibes & Sunday Q&A",
    host: PARTICIPANTS.amara,
    user: PARTICIPANTS.david,
    joinedAt: "2026-11-09T10:45:00Z",
    durationMinutes: 45,
    connectionStatus: "connected",
    cameraStatus: "on",
    micStatus: "on",
    moderationStatus: "clean",
  },
  {
    id: "gst_302",
    sessionId: "live_401",
    sessionTitle: "Acoustic Vibes & Sunday Q&A",
    host: PARTICIPANTS.amara,
    user: PARTICIPANTS.chloe,
    joinedAt: "2026-11-09T11:00:00Z",
    durationMinutes: 30,
    connectionStatus: "connected",
    cameraStatus: "on",
    micStatus: "on",
    moderationStatus: "clean",
  },
  {
    id: "gst_303",
    sessionId: "live_401",
    sessionTitle: "Acoustic Vibes & Sunday Q&A",
    host: PARTICIPANTS.amara,
    user: PARTICIPANTS.tobi,
    joinedAt: "2026-11-09T11:15:00Z",
    durationMinutes: 15,
    connectionStatus: "connected",
    cameraStatus: "off",
    micStatus: "on",
    moderationStatus: "clean",
  },
  {
    id: "gst_304",
    sessionId: "live_402",
    sessionTitle: "Dating Red Flags & Green Flags with Zara",
    host: PARTICIPANTS.zara,
    user: PARTICIPANTS.jayden,
    joinedAt: "2026-11-09T11:10:00Z",
    durationMinutes: 20,
    connectionStatus: "connected",
    cameraStatus: "on",
    micStatus: "on",
    moderationStatus: "clean",
  },
  {
    id: "gst_305",
    sessionId: "live_404",
    sessionTitle: "Speed Dating Round 4: Find Your Noble Match",
    host: PARTICIPANTS.elena,
    user: PARTICIPANTS.brian,
    joinedAt: "2026-11-09T09:15:00Z",
    leftAt: "2026-11-09T09:28:00Z",
    durationMinutes: 13,
    connectionStatus: "removed",
    cameraStatus: "off",
    micStatus: "muted",
    moderationStatus: "removed",
    removalReason: "Inappropriate remarks to participants during speed dating round.",
  },
];

// Seed Live Sessions
const INITIAL_SESSIONS: LiveSessionRecord[] = [
  {
    id: "live_401",
    title: "Acoustic Vibes & Sunday Q&A",
    description: "Live musical session, original acoustic tracks, and answering relationship questions with my guests.",
    category: "music_arts",
    host: PARTICIPANTS.amara,
    status: "live",
    startedAt: "2026-11-09T10:30:00Z",
    durationMinutes: 65,
    currentViewers: 2420,
    peakViewers: 3100,
    totalUniqueViews: 14200,
    guestCount: 3,
    currentGuests: [INITIAL_GUESTS[0], INITIAL_GUESTS[1], INITIAL_GUESTS[2]],
    giftsReceivedCount: 148,
    giftCoinsEarned: 18500,
    streamQuality: "1080p_60fps",
    streamHealth: "healthy",
    streamProvider: "Agora RTC",
    bitrateKbps: 4200,
    fps: 60,
    latencyMs: 34,
    packetLossPercent: 0.2,
    moderationStatus: "clean",
    activeReportCount: 0,
    thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    isRestricted: false,
  },
  {
    id: "live_402",
    title: "Dating Red Flags & Green Flags with Zara",
    description: "Interactive discussion on modern dating psychology, chemistry, and navigating relationship goals.",
    category: "dating_qna",
    host: PARTICIPANTS.zara,
    status: "live",
    startedAt: "2026-11-09T11:00:00Z",
    durationMinutes: 35,
    currentViewers: 1840,
    peakViewers: 2250,
    totalUniqueViews: 8900,
    guestCount: 1,
    currentGuests: [INITIAL_GUESTS[3]],
    giftsReceivedCount: 92,
    giftCoinsEarned: 14200,
    streamQuality: "1080p_60fps",
    streamHealth: "healthy",
    streamProvider: "Agora RTC",
    bitrateKbps: 4500,
    fps: 60,
    latencyMs: 28,
    packetLossPercent: 0.1,
    moderationStatus: "clean",
    activeReportCount: 0,
    thumbnailUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    isRestricted: false,
  },
  {
    id: "live_403",
    title: "Tech & Entrepreneurship in Lagos & Beyond",
    description: "Building tech ventures in Africa, career strategies, and balancing personal life.",
    category: "lifestyle_casual",
    host: PARTICIPANTS.david,
    status: "live",
    startedAt: "2026-11-09T11:20:00Z",
    durationMinutes: 18,
    currentViewers: 960,
    peakViewers: 1400,
    totalUniqueViews: 4200,
    guestCount: 0,
    currentGuests: [],
    giftsReceivedCount: 46,
    giftCoinsEarned: 7400,
    streamQuality: "720p_30fps",
    streamHealth: "healthy",
    streamProvider: "LiveKit",
    bitrateKbps: 2800,
    fps: 30,
    latencyMs: 62,
    packetLossPercent: 0.8,
    moderationStatus: "clean",
    activeReportCount: 0,
    thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    isRestricted: false,
  },
  {
    id: "live_404",
    title: "Speed Dating Round 4: Find Your Noble Match",
    description: "Fast-paced video speed dating session with curated mutual matches.",
    category: "speed_dating",
    host: PARTICIPANTS.elena,
    status: "under_moderation",
    startedAt: "2026-11-09T09:00:00Z",
    durationMinutes: 45,
    currentViewers: 420,
    peakViewers: 850,
    totalUniqueViews: 3100,
    guestCount: 1,
    currentGuests: [INITIAL_GUESTS[4]],
    giftsReceivedCount: 18,
    giftCoinsEarned: 3100,
    streamQuality: "720p_30fps",
    streamHealth: "warning",
    streamProvider: "Agora RTC",
    bitrateKbps: 2400,
    fps: 30,
    latencyMs: 145,
    packetLossPercent: 4.8,
    moderationStatus: "flagged",
    activeReportCount: 1,
    thumbnailUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    isRestricted: false,
  },
  {
    id: "live_405",
    title: "Late Night Jazz & Deep Conversations",
    description: "Relaxing late-night jazz sessions, saxophone solos, and poetry readings.",
    category: "music_arts",
    host: PARTICIPANTS.marcus,
    status: "completed",
    startedAt: "2026-11-08T21:00:00Z",
    endedAt: "2026-11-08T22:54:00Z",
    durationMinutes: 114,
    currentViewers: 0,
    peakViewers: 1120,
    totalUniqueViews: 18200,
    guestCount: 1,
    currentGuests: [],
    giftsReceivedCount: 78,
    giftCoinsEarned: 9800,
    streamQuality: "1080p_60fps",
    streamHealth: "healthy",
    streamProvider: "Amazon IVS",
    bitrateKbps: 4000,
    fps: 60,
    latencyMs: 38,
    packetLossPercent: 0.3,
    moderationStatus: "clean",
    activeReportCount: 0,
    thumbnailUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    isRestricted: false,
  },
  {
    id: "live_406",
    title: "Gourmet Dinner Cooking: West African Cuisine",
    description: "Step-by-step jollof and plantain recipe secrets with Q&A from viewers.",
    category: "cooking_food",
    host: PARTICIPANTS.tessy,
    status: "completed",
    startedAt: "2026-11-08T18:00:00Z",
    endedAt: "2026-11-08T19:25:00Z",
    durationMinutes: 85,
    currentViewers: 0,
    peakViewers: 1640,
    totalUniqueViews: 12400,
    guestCount: 0,
    currentGuests: [],
    giftsReceivedCount: 94,
    giftCoinsEarned: 12400,
    streamQuality: "1080p_60fps",
    streamHealth: "healthy",
    streamProvider: "Agora RTC",
    bitrateKbps: 4100,
    fps: 60,
    latencyMs: 32,
    packetLossPercent: 0.2,
    moderationStatus: "clean",
    activeReportCount: 0,
    thumbnailUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
    isRestricted: false,
  },
  {
    id: "live_407",
    title: "Global Singles Showcase & Talent Hour",
    description: "Singers, dancers, and stand-up comedy acts broadcast live across NobleBond.",
    category: "talent_show",
    host: PARTICIPANTS.brian,
    status: "interrupted",
    startedAt: "2026-11-07T19:00:00Z",
    endedAt: "2026-11-07T19:08:00Z",
    durationMinutes: 8,
    currentViewers: 0,
    peakViewers: 340,
    totalUniqueViews: 820,
    guestCount: 0,
    currentGuests: [],
    giftsReceivedCount: 4,
    giftCoinsEarned: 450,
    streamQuality: "720p_30fps",
    streamHealth: "disconnected",
    streamProvider: "Agora RTC",
    bitrateKbps: 1100,
    fps: 15,
    latencyMs: 340,
    packetLossPercent: 18.4,
    moderationStatus: "clean",
    activeReportCount: 0,
    thumbnailUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80",
    isRestricted: false,
  },
  {
    id: "live_408",
    title: "Exclusive Crypto VIP Secrets & Guaranteed Wealth",
    description: "High-yield investment coaching and secret VIP club telegram access.",
    category: "general_chat",
    host: PARTICIPANTS.richard,
    status: "failed",
    startedAt: "2026-11-06T14:00:00Z",
    endedAt: "2026-11-06T14:02:15Z",
    durationMinutes: 2,
    currentViewers: 0,
    peakViewers: 85,
    totalUniqueViews: 140,
    guestCount: 0,
    currentGuests: [],
    giftsReceivedCount: 0,
    giftCoinsEarned: 0,
    streamQuality: "480p_adaptive",
    streamHealth: "failed",
    streamProvider: "LiveKit",
    bitrateKbps: 0,
    fps: 0,
    latencyMs: 0,
    packetLossPercent: 0,
    moderationStatus: "action_taken",
    activeReportCount: 2,
    thumbnailUrl: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=600&q=80",
    isRestricted: true,
    restrictionReason: "Terminated by Trust & Safety: Prohibited financial promotion and scam link dissemination.",
  },
];

// Seed Hosts
const INITIAL_HOSTS: LiveHostRecord[] = [
  {
    id: "hst_201",
    user: PARTICIPANTS.amara,
    totalSessions: 48,
    activeSessionId: "live_401",
    isCurrentlyLive: true,
    totalDurationMinutes: 3840,
    peakViewers: 4200,
    totalViews: 184000,
    giftsReceivedCount: 1240,
    giftCoinsEarned: 245000,
    reportsReceivedCount: 0,
    hostStatus: "active",
    registeredAt: "2026-03-12T10:00:00Z",
    lastLiveAt: "2026-11-09T10:30:00Z",
  },
  {
    id: "hst_202",
    user: PARTICIPANTS.zara,
    totalSessions: 36,
    activeSessionId: "live_402",
    isCurrentlyLive: true,
    totalDurationMinutes: 2450,
    peakViewers: 3600,
    totalViews: 142000,
    giftsReceivedCount: 890,
    giftCoinsEarned: 168000,
    reportsReceivedCount: 1,
    hostStatus: "active",
    registeredAt: "2026-06-02T14:00:00Z",
    lastLiveAt: "2026-11-09T11:00:00Z",
  },
  {
    id: "hst_203",
    user: PARTICIPANTS.david,
    totalSessions: 22,
    activeSessionId: "live_403",
    isCurrentlyLive: true,
    totalDurationMinutes: 1680,
    peakViewers: 2100,
    totalViews: 84000,
    giftsReceivedCount: 420,
    giftCoinsEarned: 89000,
    reportsReceivedCount: 0,
    hostStatus: "active",
    registeredAt: "2026-05-18T09:00:00Z",
    lastLiveAt: "2026-11-09T11:20:00Z",
  },
  {
    id: "hst_204",
    user: PARTICIPANTS.elena,
    totalSessions: 14,
    activeSessionId: "live_404",
    isCurrentlyLive: true,
    totalDurationMinutes: 890,
    peakViewers: 1250,
    totalViews: 46000,
    giftsReceivedCount: 210,
    giftCoinsEarned: 34000,
    reportsReceivedCount: 1,
    hostStatus: "warning",
    registeredAt: "2026-07-20T11:00:00Z",
    lastLiveAt: "2026-11-09T09:00:00Z",
  },
  {
    id: "hst_205",
    user: PARTICIPANTS.marcus,
    totalSessions: 18,
    isCurrentlyLive: false,
    totalDurationMinutes: 1420,
    peakViewers: 1450,
    totalViews: 58000,
    giftsReceivedCount: 310,
    giftCoinsEarned: 52000,
    reportsReceivedCount: 1,
    hostStatus: "active",
    registeredAt: "2026-08-10T12:00:00Z",
    lastLiveAt: "2026-11-08T21:00:00Z",
  },
  {
    id: "hst_206",
    user: PARTICIPANTS.tessy,
    totalSessions: 26,
    isCurrentlyLive: false,
    totalDurationMinutes: 2100,
    peakViewers: 1890,
    totalViews: 92000,
    giftsReceivedCount: 540,
    giftCoinsEarned: 96000,
    reportsReceivedCount: 0,
    hostStatus: "active",
    registeredAt: "2026-04-14T08:30:00Z",
    lastLiveAt: "2026-11-08T18:00:00Z",
  },
  {
    id: "hst_207",
    user: PARTICIPANTS.brian,
    totalSessions: 6,
    isCurrentlyLive: false,
    totalDurationMinutes: 180,
    peakViewers: 340,
    totalViews: 4200,
    giftsReceivedCount: 15,
    giftCoinsEarned: 2400,
    reportsReceivedCount: 3,
    hostStatus: "restricted",
    registeredAt: "2026-10-10T16:00:00Z",
    lastLiveAt: "2026-11-07T19:00:00Z",
    restrictionReason: "Repeated video feed withholding and unverified host identity check pending.",
  },
  {
    id: "hst_208",
    user: PARTICIPANTS.richard,
    totalSessions: 3,
    isCurrentlyLive: false,
    totalDurationMinutes: 42,
    peakViewers: 120,
    totalViews: 850,
    giftsReceivedCount: 2,
    giftCoinsEarned: 200,
    reportsReceivedCount: 5,
    hostStatus: "suspended",
    registeredAt: "2026-11-01T12:00:00Z",
    lastLiveAt: "2026-11-06T14:00:00Z",
    restrictionReason: "Indefinitely banned from hosting broadcasts: Prohibited financial schemes and scam links.",
  },
];

// Seed Audience & Viewers
const INITIAL_VIEWERS: LiveViewerRecord[] = [
  {
    id: "viw_101",
    user: PARTICIPANTS.jayden,
    sessionId: "live_402",
    sessionTitle: "Dating Red Flags & Green Flags with Zara",
    hostName: "Zara Love",
    joinedAt: "2026-11-09T11:02:00Z",
    watchDurationMinutes: 33,
    isCurrentlyWatching: true,
    giftCoinsSpent: 2500,
    giftsSentCount: 3,
    commentsCount: 14,
    viewerStatus: "active",
  },
  {
    id: "viw_102",
    user: PARTICIPANTS.david,
    sessionId: "live_401",
    sessionTitle: "Acoustic Vibes & Sunday Q&A",
    hostName: "Amara Bliss",
    joinedAt: "2026-11-09T10:35:00Z",
    watchDurationMinutes: 60,
    isCurrentlyWatching: true,
    giftCoinsSpent: 1500,
    giftsSentCount: 2,
    commentsCount: 19,
    viewerStatus: "active",
  },
  {
    id: "viw_103",
    user: PARTICIPANTS.chloe,
    sessionId: "live_401",
    sessionTitle: "Acoustic Vibes & Sunday Q&A",
    hostName: "Amara Bliss",
    joinedAt: "2026-11-09T10:40:00Z",
    watchDurationMinutes: 55,
    isCurrentlyWatching: true,
    giftCoinsSpent: 1000,
    giftsSentCount: 1,
    commentsCount: 8,
    viewerStatus: "active",
  },
  {
    id: "viw_104",
    user: PARTICIPANTS.kofi,
    sessionId: "live_403",
    sessionTitle: "Tech & Entrepreneurship in Lagos & Beyond",
    hostName: "David King",
    joinedAt: "2026-11-09T11:22:00Z",
    watchDurationMinutes: 16,
    isCurrentlyWatching: true,
    giftCoinsSpent: 300,
    giftsSentCount: 1,
    commentsCount: 4,
    viewerStatus: "active",
  },
  {
    id: "viw_105",
    user: PARTICIPANTS.tessy,
    sessionId: "live_403",
    sessionTitle: "Tech & Entrepreneurship in Lagos & Beyond",
    hostName: "David King",
    joinedAt: "2026-11-09T11:25:00Z",
    watchDurationMinutes: 13,
    isCurrentlyWatching: true,
    giftCoinsSpent: 500,
    giftsSentCount: 1,
    commentsCount: 6,
    viewerStatus: "active",
  },
  {
    id: "viw_106",
    user: PARTICIPANTS.victor,
    sessionId: "live_401",
    sessionTitle: "Acoustic Vibes & Sunday Q&A",
    hostName: "Amara Bliss",
    joinedAt: "2026-11-09T10:50:00Z",
    watchDurationMinutes: 45,
    isCurrentlyWatching: true,
    giftCoinsSpent: 800,
    giftsSentCount: 2,
    commentsCount: 11,
    viewerStatus: "active",
  },
  {
    id: "viw_107",
    user: PARTICIPANTS.richard,
    sessionId: "live_402",
    sessionTitle: "Dating Red Flags & Green Flags with Zara",
    hostName: "Zara Love",
    joinedAt: "2026-11-09T11:05:00Z",
    leftAt: "2026-11-09T11:18:00Z",
    watchDurationMinutes: 13,
    isCurrentlyWatching: false,
    giftCoinsSpent: 0,
    giftsSentCount: 0,
    commentsCount: 3,
    viewerStatus: "restricted",
  },
];

// Seed Gift Transactions (Strictly Virtual Gift Coins only)
const INITIAL_GIFTS: LiveGiftTransactionRecord[] = [
  {
    id: "gft_7001",
    sessionId: "live_401",
    sessionTitle: "Acoustic Vibes & Sunday Q&A",
    sender: PARTICIPANTS.david,
    recipient: PARTICIPANTS.amara,
    giftId: "diamond_rose",
    giftName: "Diamond Rose",
    giftType: "romantic",
    coinAmount: 500,
    timestamp: "2026-11-09T10:48:00Z",
    status: "completed",
    walletReference: "tx_wlt_99014",
  },
  {
    id: "gft_7002",
    sessionId: "live_402",
    sessionTitle: "Dating Red Flags & Green Flags with Zara",
    sender: PARTICIPANTS.jayden,
    recipient: PARTICIPANTS.zara,
    giftId: "noble_crown",
    giftName: "Noble Crown",
    giftType: "luxury",
    coinAmount: 2500,
    timestamp: "2026-11-09T11:15:00Z",
    status: "completed",
    walletReference: "tx_wlt_99015",
  },
  {
    id: "gft_7003",
    sessionId: "live_401",
    sessionTitle: "Acoustic Vibes & Sunday Q&A",
    sender: PARTICIPANTS.chloe,
    recipient: PARTICIPANTS.amara,
    giftId: "champagne_sparkle",
    giftName: "Champagne Sparkle",
    giftType: "celebration",
    coinAmount: 1000,
    timestamp: "2026-11-09T11:05:00Z",
    status: "completed",
    walletReference: "tx_wlt_99016",
  },
  {
    id: "gft_7004",
    sessionId: "live_403",
    sessionTitle: "Tech & Entrepreneurship in Lagos & Beyond",
    sender: PARTICIPANTS.victor,
    recipient: PARTICIPANTS.david,
    giftId: "heart_bouquet",
    giftName: "Heart Bouquet",
    giftType: "support",
    coinAmount: 300,
    timestamp: "2026-11-09T11:28:00Z",
    status: "completed",
    walletReference: "tx_wlt_99017",
  },
  {
    id: "gft_7005",
    sessionId: "live_404",
    sessionTitle: "Speed Dating Round 4: Find Your Noble Match",
    sender: PARTICIPANTS.marcus,
    recipient: PARTICIPANTS.elena,
    giftId: "super_rocket",
    giftName: "Super Rocket",
    giftType: "luxury",
    coinAmount: 5000,
    timestamp: "2026-11-09T09:20:00Z",
    status: "completed",
    walletReference: "tx_wlt_99018",
  },
  {
    id: "gft_7006",
    sessionId: "live_402",
    sessionTitle: "Dating Red Flags & Green Flags with Zara",
    sender: PARTICIPANTS.richard,
    recipient: PARTICIPANTS.zara,
    giftId: "golden_ring",
    giftName: "Golden Ring",
    giftType: "luxury",
    coinAmount: 1500,
    timestamp: "2026-11-09T11:08:00Z",
    status: "disputed",
    walletReference: "tx_wlt_99019",
  },
];

// Seed Comments & Interactions
const INITIAL_COMMENTS: LiveCommentRecord[] = [
  {
    id: "cmt_601",
    sessionId: "live_401",
    sessionTitle: "Acoustic Vibes & Sunday Q&A",
    sender: PARTICIPANTS.david,
    hostName: "Amara Bliss",
    commentText: "That chord progression in the chorus sounds incredible live!",
    commentType: "standard",
    timestamp: "2026-11-09T10:46:00Z",
    moderationStatus: "clean",
    isReported: false,
  },
  {
    id: "cmt_602",
    sessionId: "live_402",
    sessionTitle: "Dating Red Flags & Green Flags with Zara",
    sender: PARTICIPANTS.jayden,
    hostName: "Zara Love",
    commentText: "What is your top recommendation when first meeting parents?",
    commentType: "question",
    timestamp: "2026-11-09T11:12:00Z",
    moderationStatus: "clean",
    isReported: false,
  },
  {
    id: "cmt_603",
    sessionId: "live_404",
    sessionTitle: "Speed Dating Round 4: Find Your Noble Match",
    sender: PARTICIPANTS.brian,
    hostName: "Elena Volkov",
    commentText: "Why are the women in this room so quiet? DM me your private numbers.",
    commentType: "standard",
    timestamp: "2026-11-09T09:18:00Z",
    moderationStatus: "reported",
    isReported: true,
    reportCategory: "harassment",
  },
  {
    id: "cmt_604",
    sessionId: "live_408",
    sessionTitle: "Exclusive Crypto VIP Secrets & Guaranteed Wealth",
    sender: PARTICIPANTS.richard,
    hostName: "Richard Blackwood",
    commentText: "Check the link in my pinned comment for 300% guaranteed returns today!",
    commentType: "super_highlight",
    timestamp: "2026-11-06T14:01:00Z",
    moderationStatus: "removed",
    isReported: true,
    reportCategory: "scams",
  },
];

// Seed Live Reports
const INITIAL_REPORTS: LiveReportRecord[] = [
  {
    id: "lrep_501",
    sessionId: "live_404",
    sessionTitle: "Speed Dating Round 4: Find Your Noble Match",
    reporter: PARTICIPANTS.elena,
    reportedUser: PARTICIPANTS.brian,
    targetType: "guest",
    category: "harassment",
    description: "Guest Brian made inappropriate and pressuring remarks repeatedly demanding private phone numbers on live stage.",
    submittedAt: "2026-11-09T09:22:00Z",
    priority: "high",
    assignedModerator: "L. Vance (Senior Moderator)",
    status: "under_review",
    evidenceSnippet: "Why are the women in this room so quiet? DM me your private numbers.",
  },
  {
    id: "lrep_502",
    sessionId: "live_408",
    sessionTitle: "Exclusive Crypto VIP Secrets & Guaranteed Wealth",
    reporter: PARTICIPANTS.zara,
    reportedUser: PARTICIPANTS.richard,
    targetType: "session",
    category: "scams",
    description: "Broadcast stream used exclusively to solicit cryptocurrency deposits with external phishing URL.",
    submittedAt: "2026-11-06T14:01:30Z",
    priority: "critical",
    assignedModerator: "M. Thorne (Trust Lead)",
    status: "resolved",
    evidenceSnippet: "Check the link in my pinned comment for 300% guaranteed returns today!",
    resolutionNote: "Broadcast terminated immediately. Host account restricted from live streaming.",
    resolvedAt: "2026-11-06T14:05:00Z",
    resolvedBy: "M. Thorne",
  },
  {
    id: "lrep_503",
    sessionId: "live_401",
    sessionTitle: "Acoustic Vibes & Sunday Q&A",
    reporter: PARTICIPANTS.chloe,
    reportedUser: PARTICIPANTS.marcus,
    targetType: "comment",
    category: "inappropriate_comment",
    description: "Unwanted repetitive spam questions disrupting the music performance.",
    submittedAt: "2026-11-09T11:02:00Z",
    priority: "medium",
    status: "pending",
    evidenceSnippet: "Why isn't Amara singing my request? Sing it now!",
  },
];

// Seed Stream Health Records
const INITIAL_HEALTH_RECORDS: StreamHealthRecord[] = [
  {
    sessionId: "live_401",
    sessionTitle: "Acoustic Vibes & Sunday Q&A",
    hostName: "Amara Bliss",
    status: "healthy",
    provider: "Agora RTC",
    bitrateKbps: 4200,
    fps: 60,
    latencyMs: 34,
    packetLossPercent: 0.2,
  },
  {
    sessionId: "live_402",
    sessionTitle: "Dating Red Flags & Green Flags with Zara",
    hostName: "Zara Love",
    status: "healthy",
    provider: "Agora RTC",
    bitrateKbps: 4500,
    fps: 60,
    latencyMs: 28,
    packetLossPercent: 0.1,
  },
  {
    sessionId: "live_403",
    sessionTitle: "Tech & Entrepreneurship in Lagos & Beyond",
    hostName: "David King",
    status: "healthy",
    provider: "LiveKit",
    bitrateKbps: 2800,
    fps: 30,
    latencyMs: 62,
    packetLossPercent: 0.8,
  },
  {
    sessionId: "live_404",
    sessionTitle: "Speed Dating Round 4: Find Your Noble Match",
    hostName: "Elena Volkov",
    status: "warning",
    provider: "Agora RTC",
    bitrateKbps: 2400,
    fps: 30,
    latencyMs: 145,
    packetLossPercent: 4.8,
    errorCode: "WARN_HIGH_JITTER",
    failureReason: "Elevated network jitter on multi-guest relay channel",
  },
  {
    sessionId: "live_407",
    sessionTitle: "Global Singles Showcase & Talent Hour",
    hostName: "Brian Kovacs",
    status: "degraded",
    provider: "Agora RTC",
    bitrateKbps: 1100,
    fps: 15,
    latencyMs: 340,
    packetLossPercent: 18.4,
    errorCode: "ERR_ICE_TIMEOUT",
    failureReason: "Network ICE handshake disconnection / Upstream ingest drop",
    failedAt: "2026-11-07T19:08:00Z",
    recoveryStatus: "unrecoverable",
  },
  {
    sessionId: "live_408",
    sessionTitle: "Exclusive Crypto VIP Secrets & Guaranteed Wealth",
    hostName: "Richard Blackwood",
    status: "failed",
    provider: "LiveKit",
    bitrateKbps: 0,
    fps: 0,
    latencyMs: 0,
    packetLossPercent: 0,
    errorCode: "ERR_POLICY_ENFORCEMENT",
    failureReason: "Terminated automatically: Unapproved commercial solicitation detected",
    failedAt: "2026-11-06T14:02:15Z",
    recoveryStatus: "unrecoverable",
  },
];

// LocalStorage Loaders
export function loadLiveSessions(): LiveSessionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(INITIAL_SESSIONS));
      return INITIAL_SESSIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SESSIONS;
  }
}

export function loadLiveHosts(): LiveHostRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HOSTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.HOSTS, JSON.stringify(INITIAL_HOSTS));
      return INITIAL_HOSTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_HOSTS;
  }
}

export function loadLiveViewers(): LiveViewerRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VIEWERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.VIEWERS, JSON.stringify(INITIAL_VIEWERS));
      return INITIAL_VIEWERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_VIEWERS;
  }
}

export function loadLiveGuests(): LiveGuestRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GUESTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(INITIAL_GUESTS));
      return INITIAL_GUESTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_GUESTS;
  }
}

export function loadLiveGifts(): LiveGiftTransactionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GIFTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.GIFTS, JSON.stringify(INITIAL_GIFTS));
      return INITIAL_GIFTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_GIFTS;
  }
}

export function loadLiveComments(): LiveCommentRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(INITIAL_COMMENTS));
      return INITIAL_COMMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_COMMENTS;
  }
}

export function loadLiveReports(): LiveReportRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
      return INITIAL_REPORTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_REPORTS;
  }
}

export function loadStreamHealth(): StreamHealthRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HEALTH);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.HEALTH, JSON.stringify(INITIAL_HEALTH_RECORDS));
      return INITIAL_HEALTH_RECORDS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_HEALTH_RECORDS;
  }
}

// Persisters
function saveSessions(data: LiveSessionRecord[]) {
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(data));
}

function saveHosts(data: LiveHostRecord[]) {
  localStorage.setItem(STORAGE_KEYS.HOSTS, JSON.stringify(data));
}

function saveGuests(data: LiveGuestRecord[]) {
  localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(data));
}

function saveComments(data: LiveCommentRecord[]) {
  localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(data));
}

function saveReports(data: LiveReportRecord[]) {
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(data));
}

// KPI Calculation
export function calculateLiveKPIs(
  sessions: LiveSessionRecord[],
  hosts: LiveHostRecord[],
  _viewers: LiveViewerRecord[],
  gifts: LiveGiftTransactionRecord[],
  reports: LiveReportRecord[],
  _health?: StreamHealthRecord[]
): LiveStatsKpis {
  void _viewers;
  void _health;

  const totalLiveSessions = sessions.length;
  const currentlyLiveRooms = sessions.filter((s) => s.status === "live" || s.status === "under_moderation").length;
  const totalLiveHosts = hosts.length;
  const activeConcurrentViewers = sessions
    .filter((s) => s.status === "live" || s.status === "under_moderation")
    .reduce((acc, s) => acc + s.currentViewers, 0);

  const totalLiveViews = sessions.reduce((acc, s) => acc + s.totalUniqueViews, 0);
  const totalDurationMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalStreamDurationHours = Math.round((totalDurationMinutes / 60) * 10) / 10;

  const totalGiftsSent = gifts.length;
  const totalGiftCoinsSpent = gifts
    .filter((g) => g.status === "completed")
    .reduce((acc, g) => acc + g.coinAmount, 0);

  const pendingLiveReports = reports.filter(
    (r) => r.status === "pending" || r.status === "under_review" || r.status === "escalated"
  ).length;

  const failedOrInterruptedStreams = sessions.filter(
    (s) => s.status === "interrupted" || s.status === "failed"
  ).length;

  return {
    totalLiveSessions,
    currentlyLiveRooms,
    totalLiveHosts,
    activeConcurrentViewers,
    totalLiveViews,
    totalStreamDurationHours,
    totalGiftsSent,
    totalGiftCoinsSpent,
    pendingLiveReports,
    failedOrInterruptedStreams,
    connectionReliabilityRate: 99.4,
  };
}

// Mutations
export function endLiveSession(
  sessionId: string,
  reason: string,
  adminName: string
): LiveSessionRecord[] {
  void adminName;
  const sessions = loadLiveSessions();
  const updated = sessions.map((s) => {
    if (s.id === sessionId) {
      return {
        ...s,
        status: "completed" as const,
        endedAt: new Date().toISOString(),
        currentViewers: 0,
        currentGuests: [],
        moderationStatus: "action_taken" as const,
        restrictionReason: reason,
      };
    }
    return s;
  });
  saveSessions(updated);
  return updated;
}

export function restrictHostAccess(
  hostId: string,
  durationDays: number | null,
  reason: string,
  adminName: string
): LiveHostRecord[] {
  void adminName;
  const hosts = loadLiveHosts();
  const expiresAt = durationDays
    ? new Date(Date.now() + durationDays * 86400000).toISOString()
    : undefined;

  const updated = hosts.map((h) => {
    if (h.id === hostId || h.user.id === hostId) {
      return {
        ...h,
        hostStatus: "restricted" as const,
        isCurrentlyLive: false,
        activeSessionId: undefined,
        restrictionReason: reason,
        restrictionExpiresAt: expiresAt,
      };
    }
    return h;
  });
  saveHosts(updated);
  return updated;
}

export function restoreHostAccess(hostId: string): LiveHostRecord[] {
  const hosts = loadLiveHosts();
  const updated = hosts.map((h) => {
    if (h.id === hostId || h.user.id === hostId) {
      return {
        ...h,
        hostStatus: "active" as const,
        restrictionReason: undefined,
        restrictionExpiresAt: undefined,
      };
    }
    return h;
  });
  saveHosts(updated);
  return updated;
}

export function removeGuestFromSession(
  guestId: string,
  reason: string
): { guests: LiveGuestRecord[]; sessions: LiveSessionRecord[] } {
  const guests = loadLiveGuests();
  const updatedGuests = guests.map((g) => {
    if (g.id === guestId) {
      return {
        ...g,
        connectionStatus: "removed" as const,
        leftAt: new Date().toISOString(),
        moderationStatus: "removed" as const,
        removalReason: reason,
      };
    }
    return g;
  });
  saveGuests(updatedGuests);

  const sessions = loadLiveSessions();
  const updatedSessions = sessions.map((s) => {
    return {
      ...s,
      currentGuests: s.currentGuests.filter((g) => g.id !== guestId),
      guestCount: Math.max(0, s.currentGuests.filter((g) => g.id !== guestId).length),
    };
  });
  saveSessions(updatedSessions);

  return { guests: updatedGuests, sessions: updatedSessions };
}

export function removeLiveComment(commentId: string): LiveCommentRecord[] {
  const comments = loadLiveComments();
  const updated = comments.map((c) => {
    if (c.id === commentId) {
      return {
        ...c,
        moderationStatus: "removed" as const,
      };
    }
    return c;
  });
  saveComments(updated);
  return updated;
}

export function assignLiveReport(reportId: string, moderatorName: string): LiveReportRecord[] {
  const reports = loadLiveReports();
  const updated = reports.map((r) => {
    if (r.id === reportId) {
      return {
        ...r,
        assignedModerator: moderatorName,
        status: r.status === "pending" ? ("under_review" as const) : r.status,
      };
    }
    return r;
  });
  saveReports(updated);
  return updated;
}

export function resolveLiveReport(
  reportId: string,
  resolution: string,
  notes: string,
  adminName: string
): LiveReportRecord[] {
  const reports = loadLiveReports();
  const updated = reports.map((r) => {
    if (r.id === reportId) {
      return {
        ...r,
        status: "resolved" as const,
        resolutionNote: `${resolution} — ${notes}`,
        resolvedAt: new Date().toISOString(),
        resolvedBy: adminName,
      };
    }
    return r;
  });
  saveReports(updated);
  return updated;
}

export function dismissLiveReport(
  reportId: string,
  notes: string,
  adminName: string
): LiveReportRecord[] {
  const reports = loadLiveReports();
  const updated = reports.map((r) => {
    if (r.id === reportId) {
      return {
        ...r,
        status: "dismissed" as const,
        resolutionNote: `Dismissed: ${notes}`,
        resolvedAt: new Date().toISOString(),
        resolvedBy: adminName,
      };
    }
    return r;
  });
  saveReports(updated);
  return updated;
}

export function resetLiveManagementData(): void {
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(INITIAL_SESSIONS));
  localStorage.setItem(STORAGE_KEYS.HOSTS, JSON.stringify(INITIAL_HOSTS));
  localStorage.setItem(STORAGE_KEYS.VIEWERS, JSON.stringify(INITIAL_VIEWERS));
  localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(INITIAL_GUESTS));
  localStorage.setItem(STORAGE_KEYS.GIFTS, JSON.stringify(INITIAL_GIFTS));
  localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(INITIAL_COMMENTS));
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
  localStorage.setItem(STORAGE_KEYS.HEALTH, JSON.stringify(INITIAL_HEALTH_RECORDS));
}

// Filter and Sort Helpers
export function filterAndSortLiveSessions(
  sessions: LiveSessionRecord[],
  filters: LiveFilterState,
  sort: LiveSortCriteria
): LiveSessionRecord[] {
  let result = [...sessions];

  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      (s) =>
        s.id.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.host.name.toLowerCase().includes(q) ||
        s.host.username.toLowerCase().includes(q)
    );
  }

  if (filters.sessionStatus !== "all") {
    result = result.filter((s) => s.status === filters.sessionStatus);
  }

  if (filters.category !== "all") {
    result = result.filter((s) => s.category === filters.category);
  }

  if (filters.streamProvider !== "all") {
    result = result.filter((s) => s.streamProvider === filters.streamProvider);
  }

  result.sort((a, b) => {
    let comparison = 0;
    if (sort.field === "startedAt") {
      comparison = new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime();
    } else if (sort.field === "currentViewers") {
      comparison = a.currentViewers - b.currentViewers;
    } else if (sort.field === "peakViewers") {
      comparison = a.peakViewers - b.peakViewers;
    } else if (sort.field === "durationMinutes") {
      comparison = a.durationMinutes - b.durationMinutes;
    } else if (sort.field === "giftCoinsEarned") {
      comparison = a.giftCoinsEarned - b.giftCoinsEarned;
    }
    return sort.direction === "asc" ? comparison : -comparison;
  });

  return result;
}

export function filterAndSortLiveHosts(
  hosts: LiveHostRecord[],
  filters: LiveFilterState
): LiveHostRecord[] {
  let result = [...hosts];

  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      (h) =>
        h.id.toLowerCase().includes(q) ||
        h.user.name.toLowerCase().includes(q) ||
        h.user.username.toLowerCase().includes(q)
    );
  }

  if (filters.hostStatus !== "all") {
    result = result.filter((h) => h.hostStatus === filters.hostStatus);
  }

  return result;
}

export function filterAndSortViewers(
  viewers: LiveViewerRecord[],
  filters: LiveFilterState
): LiveViewerRecord[] {
  let result = [...viewers];

  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      (v) =>
        v.user.name.toLowerCase().includes(q) ||
        v.sessionTitle.toLowerCase().includes(q) ||
        v.hostName.toLowerCase().includes(q)
    );
  }

  return result;
}

export function filterAndSortGuests(
  guests: LiveGuestRecord[],
  filters: LiveFilterState
): LiveGuestRecord[] {
  let result = [...guests];

  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      (g) =>
        g.user.name.toLowerCase().includes(q) ||
        g.sessionTitle.toLowerCase().includes(q) ||
        g.host.name.toLowerCase().includes(q)
    );
  }

  return result;
}

export function filterAndSortGifts(
  gifts: LiveGiftTransactionRecord[],
  filters: LiveFilterState
): LiveGiftTransactionRecord[] {
  let result = [...gifts];

  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      (g) =>
        g.id.toLowerCase().includes(q) ||
        g.giftName.toLowerCase().includes(q) ||
        g.sender.name.toLowerCase().includes(q) ||
        g.recipient.name.toLowerCase().includes(q)
    );
  }

  if (filters.giftType !== "all") {
    result = result.filter((g) => g.giftType === filters.giftType);
  }

  return result;
}

export function filterAndSortLiveReports(
  reports: LiveReportRecord[],
  filters: LiveFilterState
): LiveReportRecord[] {
  let result = [...reports];

  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.reporter.name.toLowerCase().includes(q) ||
        r.reportedUser.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    );
  }

  if (filters.reportStatus !== "all") {
    result = result.filter((r) => r.status === filters.reportStatus);
  }

  if (filters.reportPriority !== "all") {
    result = result.filter((r) => r.priority === filters.reportPriority);
  }

  return result;
}

export function filterAndSortHealth(
  health: StreamHealthRecord[],
  filters: LiveFilterState
): StreamHealthRecord[] {
  let result = [...health];

  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      (h) =>
        h.sessionId.toLowerCase().includes(q) ||
        h.sessionTitle.toLowerCase().includes(q) ||
        h.hostName.toLowerCase().includes(q)
    );
  }

  if (filters.healthStatus !== "all") {
    result = result.filter((h) => h.status === filters.healthStatus);
  }

  return result;
}

// CSV Exporters
export function exportLiveSessionsCsv(sessions: LiveSessionRecord[]): void {
  const headers = [
    "Session ID",
    "Title",
    "Host Name",
    "Category",
    "Status",
    "Started At",
    "Duration (Mins)",
    "Current Viewers",
    "Peak Viewers",
    "Total Views",
    "Guests",
    "Gift Coins Earned",
    "Provider",
  ];

  const rows = sessions.map((s) => [
    s.id,
    `"${s.title.replace(/"/g, '""')}"`,
    `"${s.host.name}"`,
    s.category,
    s.status,
    s.startedAt,
    s.durationMinutes,
    s.currentViewers,
    s.peakViewers,
    s.totalUniqueViews,
    s.guestCount,
    s.giftCoinsEarned,
    s.streamProvider,
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `noblebond_live_sessions_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportLiveGiftsCsv(gifts: LiveGiftTransactionRecord[]): void {
  const headers = [
    "Transaction ID",
    "Session Title",
    "Sender Name",
    "Recipient Host",
    "Gift Name",
    "Type",
    "Gift Coins",
    "Status",
    "Timestamp",
    "Wallet Reference",
  ];

  const rows = gifts.map((g) => [
    g.id,
    `"${g.sessionTitle.replace(/"/g, '""')}"`,
    `"${g.sender.name}"`,
    `"${g.recipient.name}"`,
    `"${g.giftName}"`,
    g.giftType,
    g.coinAmount,
    g.status,
    g.timestamp,
    g.walletReference,
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `noblebond_live_gifts_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
