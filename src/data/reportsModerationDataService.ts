// NobleBond Admin — Complete Reports & Moderation Data Service & State Store
// Local demo state with localStorage persistence, audit logging, strictly zero emojis

import type {
  UnifiedReportRecord,
  ContentModerationItem,
  ModerationActionRecord,
  AppealRecord,
  ModerationHistoryEvent,
  ModeratorWorkload,
  ModerationStatsKpis,
  ModerationFilterState,
  ModerationSortCriteria,
  ReportPriority,
  ReportStatus,
  ModerationActionType,
  AppealStatus,
  ContentReviewStatus,
} from "../types/reportsModeration.types";
import { PARTICIPANTS } from "./likesMatchesDataService";

const STORAGE_KEYS = {
  REPORTS: "noblebond_admin_moderation_reports_v1",
  CONTENT: "noblebond_admin_moderation_content_v1",
  ACTIONS: "noblebond_admin_moderation_actions_v1",
  APPEALS: "noblebond_admin_moderation_appeals_v1",
  HISTORY: "noblebond_admin_moderation_history_v1",
};

// 16 Detailed Seed Reports
const INITIAL_REPORTS: UnifiedReportRecord[] = [
  {
    id: "REP-801",
    domain: "user",
    category: "fake_account",
    contentType: "user_account",
    reporter: PARTICIPANTS.amara,
    reportedUser: PARTICIPANTS.richard,
    description: "Account appears completely fabricated using stock entrepreneur imagery, promising offshore crypto returns and requesting personal identification.",
    submittedAt: "2026-11-09T08:30:00Z",
    priority: "critical",
    status: "under_review",
    assignedModerator: "Admin Sarah Jenkins",
    lastUpdatedAt: "2026-11-09T09:15:00Z",
    relatedEntityId: "usr_nb_90434",
    relatedEntityTitle: "User Account @richard_wealth",
    evidence: [
      {
        id: "ev_801_1",
        type: "screenshot",
        label: "Reverse image match verification",
        snippet: "Reverse lookup confirms avatar is indexed from commercial stock catalog.",
        submittedAt: "2026-11-09T08:30:00Z",
      },
      {
        id: "ev_801_2",
        type: "text_snippet",
        label: "Solicitation message copy",
        snippet: "Send me your WhatsApp number and I will set you up on our exclusive guaranteed wealth portal.",
        submittedAt: "2026-11-09T08:30:00Z",
      },
    ],
    notes: [
      {
        id: "nt_801_1",
        authorName: "Admin Sarah Jenkins",
        authorRole: "Trust & Safety Lead",
        timestamp: "2026-11-09T09:15:00Z",
        text: "Account flagged across multiple devices. Device fingerprint matches previously suspended syndicate in Eastern Europe.",
        isInternal: true,
      },
    ],
    timeline: [
      {
        id: "tm_801_1",
        timestamp: "2026-11-09T08:30:00Z",
        eventType: "Report Submitted",
        description: "Report filed by @amara_bliss under Fake Account / Fraud.",
        actorName: "Amara Bliss",
        actorRole: "Verified Member",
      },
      {
        id: "tm_801_2",
        timestamp: "2026-11-09T09:00:00Z",
        eventType: "Assigned Moderator",
        description: "Case assigned to Admin Sarah Jenkins.",
        actorName: "System Automation",
        actorRole: "Dispatch Rule",
      },
      {
        id: "tm_801_3",
        timestamp: "2026-11-09T09:15:00Z",
        eventType: "Investigation Note Added",
        description: "Fingerprint correlation noted.",
        actorName: "Admin Sarah Jenkins",
        actorRole: "Trust & Safety Lead",
      },
    ],
  },
  {
    id: "REP-802",
    domain: "profile",
    category: "inappropriate_photo",
    contentType: "profile_photo",
    reporter: PARTICIPANTS.david,
    reportedUser: PARTICIPANTS.elena,
    description: "Primary dating profile photograph contains explicit lingerie exposure that violates platform nudity standards.",
    submittedAt: "2026-11-09T07:45:00Z",
    priority: "high",
    status: "pending",
    assignedModerator: undefined,
    lastUpdatedAt: "2026-11-09T07:45:00Z",
    relatedEntityId: "prf_nb_90430",
    relatedEntityTitle: "Primary Profile Photo (ID #PHT-441)",
    evidence: [
      {
        id: "ev_802_1",
        type: "image",
        label: "Flagged Profile Image",
        url: PARTICIPANTS.elena.avatar,
        submittedAt: "2026-11-09T07:45:00Z",
      },
    ],
    notes: [],
    timeline: [
      {
        id: "tm_802_1",
        timestamp: "2026-11-09T07:45:00Z",
        eventType: "Report Submitted",
        description: "Flagged by @david_king under Inappropriate Photo / Nudity.",
        actorName: "David King",
        actorRole: "Verified Member",
      },
    ],
  },
  {
    id: "REP-803",
    domain: "chat",
    category: "chat_harassment",
    contentType: "private_message",
    reporter: PARTICIPANTS.zara,
    reportedUser: PARTICIPANTS.marcus,
    description: "Target user sent aggressive, derogatory remarks and persistent unwelcome advances after being politely turned down in 1-on-1 chat.",
    submittedAt: "2026-11-09T06:15:00Z",
    priority: "high",
    status: "under_review",
    assignedModerator: "Moderator Alex Vance",
    lastUpdatedAt: "2026-11-09T07:00:00Z",
    relatedEntityId: "cnv_301",
    relatedEntityTitle: "Private Conversation #cnv_301 (Message #msg_702)",
    evidence: [
      {
        id: "ev_803_1",
        type: "text_snippet",
        label: "Flagged Chat Message Snippet",
        snippet: "You think you are too good for me? You will regret matching with me if you block me.",
        submittedAt: "2026-11-09T06:15:00Z",
      },
    ],
    notes: [
      {
        id: "nt_803_1",
        authorName: "Moderator Alex Vance",
        authorRole: "Content Moderator",
        timestamp: "2026-11-09T07:00:00Z",
        text: "Verified surrounding 3 messages. Reporter was respectful throughout. Recommending a formal warning and 48h messaging restriction.",
        isInternal: true,
      },
    ],
    timeline: [
      {
        id: "tm_803_1",
        timestamp: "2026-11-09T06:15:00Z",
        eventType: "Report Submitted",
        description: "Report filed by @zara_love under Harassment & Threats.",
        actorName: "Zara Love",
        actorRole: "Verified Member",
      },
      {
        id: "tm_803_2",
        timestamp: "2026-11-09T06:45:00Z",
        eventType: "Assigned Moderator",
        description: "Assigned to Moderator Alex Vance.",
        actorName: "Admin Supervisor",
        actorRole: "Senior Dispatcher",
      },
    ],
  },
  {
    id: "REP-804",
    domain: "live",
    category: "inappropriate_live_content",
    contentType: "live_stream",
    reporter: PARTICIPANTS.jayden,
    reportedUser: PARTICIPANTS.richard,
    description: "Live broadcast host promoted fraudulent crypto trading schemes and solicited members to transfer funds to external cryptocurrency wallets.",
    submittedAt: "2026-11-08T22:10:00Z",
    priority: "critical",
    status: "escalated",
    assignedModerator: "Supervisor Liam Ortiz",
    lastUpdatedAt: "2026-11-08T22:30:00Z",
    relatedEntityId: "live_408",
    relatedEntityTitle: "Live Stream #live_408 (Host @richard_wealth)",
    evidence: [
      {
        id: "ev_804_1",
        type: "live_reference",
        label: "Ingest Session Reference",
        snippet: "Stream Title: Exclusive Crypto VIP Secrets & Guaranteed Wealth. Terminated by admin at 22:25 UTC.",
        submittedAt: "2026-11-08T22:10:00Z",
      },
    ],
    notes: [
      {
        id: "nt_804_1",
        authorName: "Supervisor Liam Ortiz",
        authorRole: "Senior Supervisor",
        timestamp: "2026-11-08T22:30:00Z",
        text: "Escalated directly to Legal & Compliance. Stream was terminated in real-time under policy zero-tolerance financial fraud.",
        isInternal: true,
      },
    ],
    timeline: [
      {
        id: "tm_804_1",
        timestamp: "2026-11-08T22:10:00Z",
        eventType: "Report Submitted",
        description: "Report filed by @jayden_cole under Live Financial Scam.",
        actorName: "Jayden Cole",
        actorRole: "Verified Member",
      },
      {
        id: "tm_804_2",
        timestamp: "2026-11-08T22:25:00Z",
        eventType: "Broadcast Terminated",
        description: "Emergency stream termination applied.",
        actorName: "Admin Supervisor",
        actorRole: "Operations Lead",
      },
      {
        id: "tm_804_3",
        timestamp: "2026-11-08T22:30:00Z",
        eventType: "Case Escalated",
        description: "Escalated to Senior Compliance.",
        actorName: "Supervisor Liam Ortiz",
        actorRole: "Senior Supervisor",
      },
    ],
  },
  {
    id: "REP-805",
    domain: "user",
    category: "scam",
    contentType: "user_account",
    reporter: PARTICIPANTS.chloe,
    reportedUser: PARTICIPANTS.brian,
    description: "User repeatedly asked for emergency transport funds via third-party transfer app after 2 days of matching.",
    submittedAt: "2026-11-08T19:20:00Z",
    priority: "medium",
    status: "pending",
    assignedModerator: undefined,
    lastUpdatedAt: "2026-11-08T19:20:00Z",
    relatedEntityId: "usr_nb_90433",
    relatedEntityTitle: "User Account @brian_kovacs",
    evidence: [
      {
        id: "ev_805_1",
        type: "screenshot",
        label: "Chat snippet showing payment request",
        snippet: "Could you send 50 dollars so I can get gas to drive over to your area?",
        submittedAt: "2026-11-08T19:20:00Z",
      },
    ],
    notes: [],
    timeline: [
      {
        id: "tm_805_1",
        timestamp: "2026-11-08T19:20:00Z",
        eventType: "Report Submitted",
        description: "Report filed by @chloe_dupont.",
        actorName: "Chloe Dupont",
        actorRole: "Verified Member",
      },
    ],
  },
  {
    id: "REP-806",
    domain: "profile",
    category: "offensive_bio",
    contentType: "biography",
    reporter: PARTICIPANTS.lily,
    reportedUser: PARTICIPANTS.victor,
    description: "Profile biography contained disparaging hate speech regarding specific ethnic backgrounds.",
    submittedAt: "2026-11-08T15:00:00Z",
    priority: "low",
    status: "resolved",
    assignedModerator: "Admin Sarah Jenkins",
    lastUpdatedAt: "2026-11-08T16:30:00Z",
    relatedEntityId: "prf_nb_90432",
    relatedEntityTitle: "Profile Biography (Victor Okafor)",
    evidence: [
      {
        id: "ev_806_1",
        type: "profile_field",
        label: "Offensive Biography Snippet",
        snippet: "Derogatory references regarding certain regional dialects and backgrounds.",
        submittedAt: "2026-11-08T15:00:00Z",
      },
    ],
    notes: [
      {
        id: "nt_806_1",
        authorName: "Admin Sarah Jenkins",
        authorRole: "Trust & Safety Lead",
        timestamp: "2026-11-08T16:25:00Z",
        text: "Biography text removed from public profile. Formal warning dispatched to member.",
        isInternal: true,
      },
    ],
    timeline: [
      {
        id: "tm_806_1",
        timestamp: "2026-11-08T15:00:00Z",
        eventType: "Report Submitted",
        description: "Filed by @lily_rose.",
        actorName: "Lily Rose",
        actorRole: "Verified Member",
      },
      {
        id: "tm_806_2",
        timestamp: "2026-11-08T16:30:00Z",
        eventType: "Report Resolved",
        description: "Content removed and warning issued.",
        actorName: "Admin Sarah Jenkins",
        actorRole: "Trust & Safety Lead",
      },
    ],
    resolutionNote: "Content Warning Issued — Profile Biography Sanitized & Formal Warning recorded.",
    resolvedAt: "2026-11-08T16:30:00Z",
    resolvedBy: "Admin Sarah Jenkins",
  },
  {
    id: "REP-807",
    domain: "chat",
    category: "scams_financial_requests",
    contentType: "private_message",
    reporter: PARTICIPANTS.tessy,
    reportedUser: PARTICIPANTS.brian,
    description: "User solicited investment in an external sports betting syndicate with promise of daily guaranteed returns.",
    submittedAt: "2026-11-08T11:40:00Z",
    priority: "critical",
    status: "pending",
    assignedModerator: undefined,
    lastUpdatedAt: "2026-11-08T11:40:00Z",
    relatedEntityId: "cnv_304",
    relatedEntityTitle: "Private Conversation #cnv_304",
    evidence: [
      {
        id: "ev_807_1",
        type: "text_snippet",
        label: "Betting link message",
        snippet: "Check this VIP odd slip: 100% fixed match results guaranteed.",
        submittedAt: "2026-11-08T11:40:00Z",
      },
    ],
    notes: [],
    timeline: [
      {
        id: "tm_807_1",
        timestamp: "2026-11-08T11:40:00Z",
        eventType: "Report Submitted",
        description: "Report filed by @tessy_b under Financial Scams.",
        actorName: "Tessy Boateng",
        actorRole: "Verified Member",
      },
    ],
  },
  {
    id: "REP-808",
    domain: "live",
    category: "inappropriate_comments",
    contentType: "live_comment",
    reporter: PARTICIPANTS.amara,
    reportedUser: PARTICIPANTS.marcus,
    description: "Viewer posted repeatedly vulgar comments directed at host and stage guests during acoustic live stream.",
    submittedAt: "2026-11-07T21:15:00Z",
    priority: "medium",
    status: "resolved",
    assignedModerator: "Moderator Alex Vance",
    lastUpdatedAt: "2026-11-07T21:45:00Z",
    relatedEntityId: "live_401",
    relatedEntityTitle: "Live Stream #live_401 (Host Amara Bliss)",
    evidence: [
      {
        id: "ev_808_1",
        type: "text_snippet",
        label: "Live Room Chat Transcript Snippet",
        snippet: "Repeated inappropriate commentary in broadcast chat room.",
        submittedAt: "2026-11-07T21:15:00Z",
      },
    ],
    notes: [
      {
        id: "nt_808_1",
        authorName: "Moderator Alex Vance",
        authorRole: "Content Moderator",
        timestamp: "2026-11-07T21:40:00Z",
        text: "Comment purged from room and viewer muted for the remainder of the session.",
        isInternal: true,
      },
    ],
    timeline: [
      {
        id: "tm_808_1",
        timestamp: "2026-11-07T21:15:00Z",
        eventType: "Report Submitted",
        description: "Report filed by @amara_bliss.",
        actorName: "Amara Bliss",
        actorRole: "Host",
      },
      {
        id: "tm_808_2",
        timestamp: "2026-11-07T21:45:00Z",
        eventType: "Report Resolved",
        description: "Content removed from live room.",
        actorName: "Moderator Alex Vance",
        actorRole: "Content Moderator",
      },
    ],
    resolutionNote: "Content Removed — Comment purged from stream and viewer issued 24h live chat mute.",
    resolvedAt: "2026-11-07T21:45:00Z",
    resolvedBy: "Moderator Alex Vance",
  },
  {
    id: "REP-809",
    domain: "user",
    category: "impersonation",
    contentType: "user_account",
    reporter: PARTICIPANTS.tobi,
    reportedUser: PARTICIPANTS.richard,
    description: "Account is using the likeness and credentials of a prominent venture capital investor without authorization.",
    submittedAt: "2026-11-07T14:30:00Z",
    priority: "high",
    status: "under_review",
    assignedModerator: "Admin Sarah Jenkins",
    lastUpdatedAt: "2026-11-07T16:00:00Z",
    relatedEntityId: "usr_nb_90434",
    relatedEntityTitle: "User Profile @richard_wealth",
    evidence: [
      {
        id: "ev_809_1",
        type: "screenshot",
        label: "Public LinkedIn profile comparison",
        snippet: "Identity belongs to a UK partner who is not affiliated with NobleBond.",
        submittedAt: "2026-11-07T14:30:00Z",
      },
    ],
    notes: [
      {
        id: "nt_809_1",
        authorName: "Admin Sarah Jenkins",
        authorRole: "Trust & Safety Lead",
        timestamp: "2026-11-07T16:00:00Z",
        text: "Verification failed on official photo ID match. Case prepared for permanent ban.",
        isInternal: true,
      },
    ],
    timeline: [
      {
        id: "tm_809_1",
        timestamp: "2026-11-07T14:30:00Z",
        eventType: "Report Submitted",
        description: "Report filed by @tobi_b.",
        actorName: "Tobi Bakare",
        actorRole: "Verified Member",
      },
    ],
  },
  {
    id: "REP-810",
    domain: "profile",
    category: "nudity_sexual_content",
    contentType: "additional_photo",
    reporter: PARTICIPANTS.kofi,
    reportedUser: PARTICIPANTS.elena,
    description: "Secondary gallery photo contains explicit swimwear exposure violating terms of service.",
    submittedAt: "2026-11-07T10:15:00Z",
    priority: "critical",
    status: "under_review",
    assignedModerator: "Moderator Alex Vance",
    lastUpdatedAt: "2026-11-07T11:00:00Z",
    relatedEntityId: "prf_nb_90430",
    relatedEntityTitle: "Gallery Photo #2 (Elena Volkov)",
    evidence: [
      {
        id: "ev_810_1",
        type: "image",
        label: "Gallery Photo flagged",
        url: PARTICIPANTS.elena.avatar,
        submittedAt: "2026-11-07T10:15:00Z",
      },
    ],
    notes: [],
    timeline: [
      {
        id: "tm_810_1",
        timestamp: "2026-11-07T10:15:00Z",
        eventType: "Report Submitted",
        description: "Report filed by @kofi_mensah.",
        actorName: "Kofi Mensah",
        actorRole: "Verified Member",
      },
    ],
  },
  {
    id: "REP-811",
    domain: "chat",
    category: "threatening_messages",
    contentType: "private_message",
    reporter: PARTICIPANTS.david,
    reportedUser: PARTICIPANTS.victor,
    description: "User sent threatening statements alleging physical harm after an unmatched interaction.",
    submittedAt: "2026-11-06T18:00:00Z",
    priority: "critical",
    status: "escalated",
    assignedModerator: "Supervisor Liam Ortiz",
    lastUpdatedAt: "2026-11-06T19:30:00Z",
    relatedEntityId: "cnv_302",
    relatedEntityTitle: "Private Conversation #cnv_302",
    evidence: [
      {
        id: "ev_811_1",
        type: "text_snippet",
        label: "Threatening message quote",
        snippet: "I know what area you live in and you will pay for ignoring me.",
        submittedAt: "2026-11-06T18:00:00Z",
      },
    ],
    notes: [
      {
        id: "nt_811_1",
        authorName: "Supervisor Liam Ortiz",
        authorRole: "Senior Supervisor",
        timestamp: "2026-11-06T19:30:00Z",
        text: "Severe breach of safety policy. Account suspended immediately and user placed on law enforcement hold flag.",
        isInternal: true,
      },
    ],
    timeline: [
      {
        id: "tm_811_1",
        timestamp: "2026-11-06T18:00:00Z",
        eventType: "Report Submitted",
        description: "Report filed by @david_king.",
        actorName: "David King",
        actorRole: "Verified Member",
      },
      {
        id: "tm_811_2",
        timestamp: "2026-11-06T19:30:00Z",
        eventType: "Case Escalated",
        description: "Escalated for immediate emergency intervention.",
        actorName: "Supervisor Liam Ortiz",
        actorRole: "Senior Supervisor",
      },
    ],
  },
  {
    id: "REP-812",
    domain: "live",
    category: "live_harassment",
    contentType: "stage_guest",
    reporter: PARTICIPANTS.zara,
    reportedUser: PARTICIPANTS.marcus,
    description: "Stage co-host verbally degraded the host on multi-guest stream before being manually disconnected.",
    submittedAt: "2026-11-06T14:10:00Z",
    priority: "high",
    status: "pending",
    assignedModerator: undefined,
    lastUpdatedAt: "2026-11-06T14:10:00Z",
    relatedEntityId: "live_402",
    relatedEntityTitle: "Live Stream #live_402 (Host Zara Love)",
    evidence: [
      {
        id: "ev_812_1",
        type: "live_reference",
        label: "Stage Guest ID #gst_303",
        snippet: "Guest connected for 6 minutes before verbal outburst.",
        submittedAt: "2026-11-06T14:10:00Z",
      },
    ],
    notes: [],
    timeline: [
      {
        id: "tm_812_1",
        timestamp: "2026-11-06T14:10:00Z",
        eventType: "Report Submitted",
        description: "Report filed by @zara_love.",
        actorName: "Zara Love",
        actorRole: "Host",
      },
    ],
  },
  {
    id: "REP-813",
    domain: "user",
    category: "spam",
    contentType: "user_account",
    reporter: PARTICIPANTS.lily,
    reportedUser: PARTICIPANTS.brian,
    description: "User sent greeting message 3 times over 24 hours.",
    submittedAt: "2026-11-05T12:00:00Z",
    priority: "low",
    status: "dismissed",
    assignedModerator: "Moderator Alex Vance",
    lastUpdatedAt: "2026-11-05T13:10:00Z",
    relatedEntityId: "usr_nb_90433",
    relatedEntityTitle: "User Account @brian_kovacs",
    evidence: [],
    notes: [
      {
        id: "nt_813_1",
        authorName: "Moderator Alex Vance",
        authorRole: "Content Moderator",
        timestamp: "2026-11-05T13:05:00Z",
        text: "Reviewed message logs. Benign casual greetings without commercial links, bot patterns, or abusive language. Dismissed.",
        isInternal: true,
      },
    ],
    timeline: [
      {
        id: "tm_813_1",
        timestamp: "2026-11-05T12:00:00Z",
        eventType: "Report Submitted",
        description: "Report filed by @lily_rose.",
        actorName: "Lily Rose",
        actorRole: "Verified Member",
      },
      {
        id: "tm_813_2",
        timestamp: "2026-11-05T13:10:00Z",
        eventType: "Report Dismissed",
        description: "Case dismissed as no violation found.",
        actorName: "Moderator Alex Vance",
        actorRole: "Content Moderator",
      },
    ],
    dismissalReason: "Report Dismissed — Insufficient evidence of policy breach; casual communication does not constitute spam.",
    resolvedAt: "2026-11-05T13:10:00Z",
    resolvedBy: "Moderator Alex Vance",
  },
  {
    id: "REP-814",
    domain: "profile",
    category: "misleading_info",
    contentType: "profile_prompt",
    reporter: PARTICIPANTS.jayden,
    reportedUser: PARTICIPANTS.richard,
    description: "Profile prompt states user is an accredited Wall Street financial advisor which was determined to be false.",
    submittedAt: "2026-11-05T09:30:00Z",
    priority: "medium",
    status: "resolved",
    assignedModerator: "Admin Sarah Jenkins",
    lastUpdatedAt: "2026-11-05T11:00:00Z",
    relatedEntityId: "prf_nb_90434",
    relatedEntityTitle: "Dating Prompt #3 (Richard Blackwood)",
    evidence: [
      {
        id: "ev_814_1",
        type: "profile_field",
        label: "Flagged Prompt Answer",
        snippet: "Prompt answer: My greatest professional achievement is managing a 100M fund on Wall Street.",
        submittedAt: "2026-11-05T09:30:00Z",
      },
    ],
    notes: [],
    timeline: [
      {
        id: "tm_814_1",
        timestamp: "2026-11-05T09:30:00Z",
        eventType: "Report Submitted",
        description: "Filed by @jayden_cole.",
        actorName: "Jayden Cole",
        actorRole: "Verified Member",
      },
      {
        id: "tm_814_2",
        timestamp: "2026-11-05T11:00:00Z",
        eventType: "Report Resolved",
        description: "Prompt reset to default blank state.",
        actorName: "Admin Sarah Jenkins",
        actorRole: "Trust & Safety Lead",
      },
    ],
    resolutionNote: "Content Removed — Fraudulent professional credential claim cleared from dating profile.",
    resolvedAt: "2026-11-05T11:00:00Z",
    resolvedBy: "Admin Sarah Jenkins",
  },
  {
    id: "REP-815",
    domain: "chat",
    category: "suspicious_links",
    contentType: "private_message",
    reporter: PARTICIPANTS.chloe,
    reportedUser: PARTICIPANTS.brian,
    description: "User sent link to an unverified external third-party login claiming to be a NobleBond photo gallery.",
    submittedAt: "2026-11-04T16:20:00Z",
    priority: "high",
    status: "pending",
    assignedModerator: undefined,
    lastUpdatedAt: "2026-11-04T16:20:00Z",
    relatedEntityId: "cnv_305",
    relatedEntityTitle: "Private Conversation #cnv_305",
    evidence: [
      {
        id: "ev_815_1",
        type: "text_snippet",
        label: "Phishing URL message",
        snippet: "Check out my private photos on noblebond-verify.club/gallery/login",
        submittedAt: "2026-11-04T16:20:00Z",
      },
    ],
    notes: [],
    timeline: [
      {
        id: "tm_815_1",
        timestamp: "2026-11-04T16:20:00Z",
        eventType: "Report Submitted",
        description: "Report filed by @chloe_dupont.",
        actorName: "Chloe Dupont",
        actorRole: "Verified Member",
      },
    ],
  },
  {
    id: "REP-816",
    domain: "live",
    category: "dangerous_behaviour",
    contentType: "live_stream",
    reporter: PARTICIPANTS.amara,
    reportedUser: PARTICIPANTS.richard,
    description: "Host conducted live stream while operating a motor vehicle at high speed without hands-free equipment.",
    submittedAt: "2026-11-04T10:00:00Z",
    priority: "critical",
    status: "escalated",
    assignedModerator: "Supervisor Liam Ortiz",
    lastUpdatedAt: "2026-11-04T10:45:00Z",
    relatedEntityId: "live_408",
    relatedEntityTitle: "Live Stream #live_408",
    evidence: [
      {
        id: "ev_816_1",
        type: "live_reference",
        label: "Live broadcast frame capture",
        snippet: "Stream visual demonstrates driver actively looking into mobile phone while vehicle is moving.",
        submittedAt: "2026-11-04T10:00:00Z",
      },
    ],
    notes: [
      {
        id: "nt_816_1",
        authorName: "Supervisor Liam Ortiz",
        authorRole: "Senior Supervisor",
        timestamp: "2026-11-04T10:45:00Z",
        text: "Emergency live ban issued. Dangerous driving while streaming constitutes immediate safety violation.",
        isInternal: true,
      },
    ],
    timeline: [
      {
        id: "tm_816_1",
        timestamp: "2026-11-04T10:00:00Z",
        eventType: "Report Submitted",
        description: "Report filed by @amara_bliss.",
        actorName: "Amara Bliss",
        actorRole: "Host",
      },
      {
        id: "tm_816_2",
        timestamp: "2026-11-04T10:45:00Z",
        eventType: "Emergency Escalation",
        description: "Immediate safety escalation executed.",
        actorName: "Supervisor Liam Ortiz",
        actorRole: "Senior Supervisor",
      },
    ],
  },
];

// Seed Content Moderation Queue (Items needing review)
const INITIAL_CONTENT_QUEUE: ContentModerationItem[] = [
  {
    id: "CNT-501",
    contentType: "profile_photo",
    owner: PARTICIPANTS.elena,
    relatedReportId: "REP-802",
    contentPreviewUrl: PARTICIPANTS.elena.avatar,
    submittedAt: "2026-11-09T07:45:00Z",
    reviewStatus: "pending_review",
    assignedModerator: undefined,
    automatedSignal: {
      confidence: 0.88,
      suggestedLabel: "Possible explicit lingerie exposure",
      severity: "high",
    },
    reviewNotes: "Awaiting human review confirmation.",
  },
  {
    id: "CNT-502",
    contentType: "biography",
    owner: PARTICIPANTS.victor,
    relatedReportId: "REP-806",
    contentPreviewText: "Looking for traditional mindset only. No people from certain regional backgrounds.",
    submittedAt: "2026-11-08T15:00:00Z",
    reviewStatus: "rejected",
    assignedModerator: "Admin Sarah Jenkins",
    automatedSignal: {
      confidence: 0.94,
      suggestedLabel: "Discriminatory text language detected",
      severity: "medium",
    },
    reviewNotes: "Violates community non-discrimination guidelines.",
    reviewedAt: "2026-11-08T16:30:00Z",
    reviewedBy: "Admin Sarah Jenkins",
  },
  {
    id: "CNT-503",
    contentType: "private_message",
    owner: PARTICIPANTS.marcus,
    relatedReportId: "REP-803",
    contentPreviewText: "You think you are too good for me? You will regret matching with me if you block me.",
    submittedAt: "2026-11-09T06:15:00Z",
    reviewStatus: "under_review",
    assignedModerator: "Moderator Alex Vance",
    automatedSignal: {
      confidence: 0.91,
      suggestedLabel: "Threatening / Aggressive sentiment",
      severity: "high",
    },
    reviewNotes: "Under investigation by moderator.",
  },
  {
    id: "CNT-504",
    contentType: "live_comment",
    owner: PARTICIPANTS.marcus,
    relatedReportId: "REP-808",
    contentPreviewText: "Sing something else or get off the stream, nobody wants to hear this acoustic stuff.",
    submittedAt: "2026-11-07T21:15:00Z",
    reviewStatus: "rejected",
    assignedModerator: "Moderator Alex Vance",
    automatedSignal: {
      confidence: 0.72,
      suggestedLabel: "Host harassment / Disruption",
      severity: "medium",
    },
    reviewNotes: "Purged from room transcript.",
    reviewedAt: "2026-11-07T21:45:00Z",
    reviewedBy: "Moderator Alex Vance",
  },
  {
    id: "CNT-505",
    contentType: "profile_prompt",
    owner: PARTICIPANTS.richard,
    relatedReportId: "REP-814",
    contentPreviewText: "My greatest professional achievement is managing a 100M fund on Wall Street.",
    submittedAt: "2026-11-05T09:30:00Z",
    reviewStatus: "rejected",
    assignedModerator: "Admin Sarah Jenkins",
    automatedSignal: {
      confidence: 0.82,
      suggestedLabel: "Unsubstantiated financial marketing claim",
      severity: "medium",
    },
    reviewNotes: "Prompt text cleared.",
    reviewedAt: "2026-11-05T11:00:00Z",
    reviewedBy: "Admin Sarah Jenkins",
  },
  {
    id: "CNT-506",
    contentType: "additional_photo",
    owner: PARTICIPANTS.brian,
    contentPreviewUrl: PARTICIPANTS.brian.avatar,
    submittedAt: "2026-11-08T18:00:00Z",
    reviewStatus: "approved",
    assignedModerator: "Moderator Alex Vance",
    automatedSignal: {
      confidence: 0.99,
      suggestedLabel: "Safe family portrait photograph",
      severity: "low",
    },
    reviewNotes: "Clear, respectful, compliant portrait.",
    reviewedAt: "2026-11-08T18:30:00Z",
    reviewedBy: "Moderator Alex Vance",
  },
  {
    id: "CNT-507",
    contentType: "private_message",
    owner: PARTICIPANTS.brian,
    relatedReportId: "REP-815",
    contentPreviewText: "Check out my private photos on noblebond-verify.club/gallery/login",
    submittedAt: "2026-11-04T16:20:00Z",
    reviewStatus: "pending_review",
    assignedModerator: undefined,
    automatedSignal: {
      confidence: 0.97,
      suggestedLabel: "High risk credential phishing domain",
      severity: "high",
    },
    reviewNotes: "Blacklisted domain detected.",
  },
  {
    id: "CNT-508",
    contentType: "live_stream",
    owner: PARTICIPANTS.richard,
    relatedReportId: "REP-804",
    contentPreviewText: "Live Stream: Exclusive Crypto VIP Secrets & Guaranteed Wealth",
    submittedAt: "2026-11-08T22:10:00Z",
    reviewStatus: "rejected",
    assignedModerator: "Supervisor Liam Ortiz",
    automatedSignal: {
      confidence: 0.95,
      suggestedLabel: "Cryptocurrency solicitation in live broadcast",
      severity: "high",
    },
    reviewNotes: "Session terminated.",
    reviewedAt: "2026-11-08T22:25:00Z",
    reviewedBy: "Supervisor Liam Ortiz",
  },
];

// Seed Moderation Actions (Enforcements)
const INITIAL_ACTIONS: ModerationActionRecord[] = [
  {
    id: "ACT-401",
    targetUser: PARTICIPANTS.richard,
    relatedReportId: "REP-804",
    actionType: "live_restricted",
    reason: "Promoting fraudulent cryptocurrency schemes during live broadcast.",
    issuedBy: "Supervisor Liam Ortiz",
    issuedAt: "2026-11-08T22:30:00Z",
    durationDays: null, // Permanent
    status: "active",
    notes: "Host broadcast privileges permanently revoked.",
  },
  {
    id: "ACT-402",
    targetUser: PARTICIPANTS.marcus,
    relatedReportId: "REP-803",
    actionType: "messaging_restricted",
    reason: "Aggressive harassment and intimidating language in private chat.",
    issuedBy: "Moderator Alex Vance",
    issuedAt: "2026-11-09T07:15:00Z",
    durationDays: 3,
    expiresAt: "2026-11-12T07:15:00Z",
    status: "active",
    notes: "3-day communication block applied.",
  },
  {
    id: "ACT-403",
    targetUser: PARTICIPANTS.victor,
    relatedReportId: "REP-806",
    actionType: "formal_warning",
    reason: "Discriminatory text language in profile biography.",
    issuedBy: "Admin Sarah Jenkins",
    issuedAt: "2026-11-08T16:30:00Z",
    durationDays: null,
    status: "active",
    notes: "First strike warning logged on account profile.",
  },
  {
    id: "ACT-404",
    targetUser: PARTICIPANTS.elena,
    relatedReportId: "REP-802",
    actionType: "content_removed",
    reason: "Profile photo violation of platform nudity standards.",
    issuedBy: "Moderator Alex Vance",
    issuedAt: "2026-11-07T11:30:00Z",
    durationDays: null,
    status: "active",
    notes: "Image hidden from public discovery feeds.",
  },
  {
    id: "ACT-405",
    targetUser: PARTICIPANTS.brian,
    relatedReportId: "REP-807",
    actionType: "temporarily_suspended",
    reason: "Solicitation of fraudulent betting schemes.",
    issuedBy: "Supervisor Liam Ortiz",
    issuedAt: "2026-11-08T12:00:00Z",
    durationDays: 7,
    expiresAt: "2026-11-15T12:00:00Z",
    status: "active",
    notes: "Account suspended for 7 days pending full compliance review.",
  },
  {
    id: "ACT-406",
    targetUser: PARTICIPANTS.richard,
    relatedReportId: "REP-816",
    actionType: "permanently_banned",
    reason: "Repeated violations including dangerous driving on live stream and identity impersonation.",
    issuedBy: "Supervisor Liam Ortiz",
    issuedAt: "2026-11-04T11:00:00Z",
    durationDays: null,
    status: "active",
    notes: "Account barred from authentication.",
  },
  {
    id: "ACT-407",
    targetUser: PARTICIPANTS.marcus,
    relatedReportId: "REP-808",
    actionType: "final_warning",
    reason: "Persistent disruptive conduct across live streaming rooms.",
    issuedBy: "Moderator Alex Vance",
    issuedAt: "2026-11-07T22:00:00Z",
    durationDays: null,
    status: "active",
    notes: "Final warning issued prior to full account suspension.",
  },
  {
    id: "ACT-408",
    targetUser: PARTICIPANTS.victor,
    relatedReportId: "REP-811",
    actionType: "temporarily_suspended",
    reason: "Physical threats made to community member.",
    issuedBy: "Supervisor Liam Ortiz",
    issuedAt: "2026-11-06T20:00:00Z",
    durationDays: 14,
    expiresAt: "2026-11-20T20:00:00Z",
    status: "active",
    notes: "14-day safety suspension with mandatory conduct review.",
  },
];

// Seed Appeals
const INITIAL_APPEALS: AppealRecord[] = [
  {
    id: "APL-201",
    user: PARTICIPANTS.marcus,
    originalActionId: "ACT-402",
    originalActionType: "messaging_restricted",
    relatedReportId: "REP-803",
    appealReason: "I was frustrated during the conversation and used poor phrasing, but I did not mean to threaten anyone. I apologize and request to have my chat privileges restored.",
    submittedAt: "2026-11-09T08:00:00Z",
    assignedReviewer: "Admin Sarah Jenkins",
    status: "under_review",
    reviewerNotes: "Reviewing chat transcript history to check for prior incidents.",
    proposedConsequence: "Lift messaging restriction early or reduce duration to 24h.",
  },
  {
    id: "APL-202",
    user: PARTICIPANTS.elena,
    originalActionId: "ACT-404",
    originalActionType: "content_removed",
    relatedReportId: "REP-802",
    appealReason: "The photo was taken at a beach resort and conforms to normal swimwear standards. It is not lingerie or explicit material.",
    submittedAt: "2026-11-08T09:30:00Z",
    assignedReviewer: "Moderator Alex Vance",
    status: "pending",
    proposedConsequence: "Restore photograph to profile gallery.",
  },
  {
    id: "APL-203",
    user: PARTICIPANTS.victor,
    originalActionId: "ACT-403",
    originalActionType: "formal_warning",
    relatedReportId: "REP-806",
    appealReason: "My bio text was misinterpreted. I was quoting lyrics from a local cultural song, not expressing bias.",
    submittedAt: "2026-11-08T17:00:00Z",
    assignedReviewer: "Admin Sarah Jenkins",
    status: "rejected",
    reviewerNotes: "Lyrics contain explicit slurs that cannot be hosted on public profiles. Warning upheld.",
    resolvedAt: "2026-11-08T18:15:00Z",
    resolvedBy: "Admin Sarah Jenkins",
    proposedConsequence: "Uphold formal warning strike.",
  },
  {
    id: "APL-204",
    user: PARTICIPANTS.brian,
    originalActionId: "ACT-405",
    originalActionType: "temporarily_suspended",
    relatedReportId: "REP-807",
    appealReason: "My account was compromised by a spam link I clicked on telegram. I have secured my credentials and did not send those betting messages.",
    submittedAt: "2026-11-08T14:00:00Z",
    assignedReviewer: "Supervisor Liam Ortiz",
    status: "under_review",
    reviewerNotes: "Checking IP session logs to confirm compromise claim.",
    proposedConsequence: "Terminate suspension if unauthorized IP address is verified.",
  },
  {
    id: "APL-205",
    user: PARTICIPANTS.richard,
    originalActionId: "ACT-401",
    originalActionType: "live_restricted",
    relatedReportId: "REP-804",
    appealReason: "I was simply giving personal financial education, not offering regulated investment advice.",
    submittedAt: "2026-11-09T01:00:00Z",
    assignedReviewer: "Supervisor Liam Ortiz",
    status: "rejected",
    reviewerNotes: "Host explicitly asked for crypto transfers with promise of 10x returns. Appeal rejected definitively.",
    resolvedAt: "2026-11-09T03:00:00Z",
    resolvedBy: "Supervisor Liam Ortiz",
    proposedConsequence: "Uphold permanent live streaming ban.",
  },
];

// Seed Moderation History (Append-only administrative audit trail)
const INITIAL_HISTORY: ModerationHistoryEvent[] = [
  {
    id: "HST-901",
    reportId: "REP-801",
    targetUser: PARTICIPANTS.richard,
    actionType: "Assigned Moderator",
    reason: "Assigned to Admin Sarah Jenkins for priority triage.",
    moderator: "System Automation",
    timestamp: "2026-11-09T09:00:00Z",
    previousStatus: "pending",
    newStatus: "under_review",
    details: "Dispatched based on critical risk rule.",
  },
  {
    id: "HST-902",
    reportId: "REP-803",
    actionType: "messaging_restricted",
    targetUser: PARTICIPANTS.marcus,
    reason: "3-day messaging restriction applied following harassment investigation.",
    moderator: "Moderator Alex Vance",
    timestamp: "2026-11-09T07:15:00Z",
    previousStatus: "under_review",
    newStatus: "enforcement_applied",
    details: "Duration: 72 hours. Target notified via push alert.",
  },
  {
    id: "HST-903",
    reportId: "REP-806",
    targetUser: PARTICIPANTS.victor,
    actionType: "formal_warning",
    reason: "Profile biography sanitized and first strike recorded.",
    moderator: "Admin Sarah Jenkins",
    timestamp: "2026-11-08T16:30:00Z",
    previousStatus: "under_review",
    newStatus: "resolved",
    details: "Bio field cleared in profile database.",
  },
  {
    id: "HST-904",
    reportId: "REP-804",
    targetUser: PARTICIPANTS.richard,
    actionType: "live_restricted",
    reason: "Emergency live stream termination and permanent broadcast ban.",
    moderator: "Supervisor Liam Ortiz",
    timestamp: "2026-11-08T22:30:00Z",
    previousStatus: "under_review",
    newStatus: "escalated",
    details: "RTMP ingest closed. Legal dossier opened.",
  },
  {
    id: "HST-905",
    reportId: "REP-808",
    targetUser: PARTICIPANTS.marcus,
    actionType: "content_removed",
    reason: "Disruptive comment removed from broadcast room transcript.",
    moderator: "Moderator Alex Vance",
    timestamp: "2026-11-07T21:45:00Z",
    previousStatus: "under_review",
    newStatus: "resolved",
    details: "Live room mute applied for session duration.",
  },
  {
    id: "HST-906",
    actionId: "ACT-405",
    targetUser: PARTICIPANTS.brian,
    actionType: "temporarily_suspended",
    reason: "7-day account suspension applied due to scam solicitation.",
    moderator: "Supervisor Liam Ortiz",
    timestamp: "2026-11-08T12:00:00Z",
    previousStatus: "active",
    newStatus: "temporarily_suspended",
    details: "Session tokens revoked across iOS and Android.",
  },
  {
    id: "HST-907",
    reportId: "REP-813",
    targetUser: PARTICIPANTS.brian,
    actionType: "Report Dismissed",
    reason: "No violation found in greeting message frequency.",
    moderator: "Moderator Alex Vance",
    timestamp: "2026-11-05T13:10:00Z",
    previousStatus: "pending",
    newStatus: "dismissed",
    details: "Case closed without disciplinary penalty.",
  },
  {
    id: "HST-908",
    actionId: "ACT-406",
    targetUser: PARTICIPANTS.richard,
    actionType: "permanently_banned",
    reason: "Severe safety violation: live streaming while operating vehicle at high speed.",
    moderator: "Supervisor Liam Ortiz",
    timestamp: "2026-11-04T11:00:00Z",
    previousStatus: "suspended",
    newStatus: "permanently_banned",
    details: "Permanent ban flag recorded in user ledger.",
  },
];

// Moderator Workloads
const INITIAL_MODERATORS: ModeratorWorkload[] = [
  {
    name: "Admin Sarah Jenkins",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    role: "Trust & Safety Lead",
    assignedCount: 4,
    pendingCount: 1,
    underReviewCount: 3,
    resolvedCount: 32,
    highPriorityCount: 2,
    avgResolutionTimeHours: 1.8,
  },
  {
    name: "Moderator Alex Vance",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    role: "Content Moderator",
    assignedCount: 3,
    pendingCount: 0,
    underReviewCount: 2,
    resolvedCount: 48,
    highPriorityCount: 1,
    avgResolutionTimeHours: 1.2,
  },
  {
    name: "Supervisor Liam Ortiz",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    role: "Senior Safety Supervisor",
    assignedCount: 4,
    pendingCount: 0,
    underReviewCount: 1,
    resolvedCount: 19,
    highPriorityCount: 3,
    avgResolutionTimeHours: 2.4,
  },
  {
    name: "Self (Supervisor Admin)",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
    role: "Platform Operations Director",
    assignedCount: 0,
    pendingCount: 0,
    underReviewCount: 0,
    resolvedCount: 14,
    highPriorityCount: 0,
    avgResolutionTimeHours: 1.5,
  },
];

// Loaders & Savers
export function loadReports(): UnifiedReportRecord[] {
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

export function saveReports(data: UnifiedReportRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save reports", err);
  }
}

export function loadContentQueue(): ContentModerationItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONTENT);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(INITIAL_CONTENT_QUEUE));
      return INITIAL_CONTENT_QUEUE;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CONTENT_QUEUE;
  }
}

export function saveContentQueue(data: ContentModerationItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save content queue", err);
  }
}

export function loadModerationActions(): ModerationActionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ACTIONS, JSON.stringify(INITIAL_ACTIONS));
      return INITIAL_ACTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ACTIONS;
  }
}

export function saveModerationActions(data: ModerationActionRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIONS, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save moderation actions", err);
  }
}

export function loadAppeals(): AppealRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPEALS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.APPEALS, JSON.stringify(INITIAL_APPEALS));
      return INITIAL_APPEALS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_APPEALS;
  }
}

export function saveAppeals(data: AppealRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.APPEALS, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save appeals", err);
  }
}

export function loadModerationHistory(): ModerationHistoryEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(INITIAL_HISTORY));
      return INITIAL_HISTORY;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_HISTORY;
  }
}

export function saveModerationHistory(data: ModerationHistoryEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save moderation history", err);
  }
}

export function loadModeratorWorkloads(): ModeratorWorkload[] {
  return INITIAL_MODERATORS;
}

// KPI Calculation
export function calculateModerationKPIs(
  reports: UnifiedReportRecord[],
  actions: ModerationActionRecord[],
  appeals: AppealRecord[]
): ModerationStatsKpis {
  const totalReports = reports.length;
  const pendingReports = reports.filter((r) => r.status === "pending").length;
  const underReviewReports = reports.filter((r) => r.status === "under_review").length;
  const highPriorityReports = reports.filter((r) => r.priority === "high").length;
  const criticalReports = reports.filter((r) => r.priority === "critical").length;
  const escalatedReports = reports.filter((r) => r.status === "escalated").length;
  const resolvedReports = reports.filter((r) => r.status === "resolved").length;
  const dismissedReports = reports.filter((r) => r.status === "dismissed").length;

  const activeRestrictions = actions.filter((a) => a.status === "active").length;
  const pendingAppeals = appeals.filter((a) => a.status === "pending" || a.status === "under_review").length;

  const escalationRatePercent = totalReports > 0 ? Math.round((escalatedReports / totalReports) * 100) : 0;

  return {
    totalReports,
    pendingReports,
    underReviewReports,
    highPriorityReports,
    criticalReports,
    escalatedReports,
    resolvedReports,
    dismissedReports,
    activeRestrictions,
    pendingAppeals,
    avgResolutionTimeHours: 1.6,
    escalationRatePercent,
  };
}

// Mutations
export function assignReport(
  reportId: string,
  moderatorName: string,
  adminName: string
): { reports: UnifiedReportRecord[]; history: ModerationHistoryEvent[] } {
  const reports = loadReports();
  const history = loadModerationHistory();
  let targetReport: UnifiedReportRecord | undefined;

  const updatedReports = reports.map((r) => {
    if (r.id === reportId) {
      targetReport = r;
      const newStatus = r.status === "pending" ? ("under_review" as const) : r.status;
      return {
        ...r,
        assignedModerator: moderatorName,
        status: newStatus,
        lastUpdatedAt: new Date().toISOString(),
        timeline: [
          ...r.timeline,
          {
            id: `tm_${Date.now()}`,
            timestamp: new Date().toISOString(),
            eventType: "Assigned Moderator",
            description: `Case assigned to ${moderatorName}.`,
            actorName: adminName,
            actorRole: "Administrator",
          },
        ],
      };
    }
    return r;
  });

  saveReports(updatedReports);

  if (targetReport) {
    const newHistoryEvent: ModerationHistoryEvent = {
      id: `HST-${Date.now().toString().slice(-4)}`,
      reportId,
      targetUser: targetReport.reportedUser,
      actionType: "Assign Moderator",
      reason: `Case assigned to ${moderatorName}.`,
      moderator: adminName,
      timestamp: new Date().toISOString(),
      previousStatus: targetReport.status,
      newStatus: targetReport.status === "pending" ? "under_review" : targetReport.status,
      details: `Reassigned from ${targetReport.assignedModerator || "Unassigned"} to ${moderatorName}.`,
    };
    history.unshift(newHistoryEvent);
    saveModerationHistory(history);
  }

  return { reports: updatedReports, history };
}

export function updateReportPriority(
  reportId: string,
  newPriority: ReportPriority,
  adminName: string
): UnifiedReportRecord[] {
  const reports = loadReports();
  const updated = reports.map((r) => {
    if (r.id === reportId) {
      return {
        ...r,
        priority: newPriority,
        lastUpdatedAt: new Date().toISOString(),
        timeline: [
          ...r.timeline,
          {
            id: `tm_${Date.now()}`,
            timestamp: new Date().toISOString(),
            eventType: "Priority Changed",
            description: `Priority updated from ${r.priority.toUpperCase()} to ${newPriority.toUpperCase()}.`,
            actorName: adminName,
            actorRole: "Administrator",
          },
        ],
      };
    }
    return r;
  });
  saveReports(updated);
  return updated;
}

export function updateReportStatus(
  reportId: string,
  newStatus: ReportStatus,
  adminName: string
): UnifiedReportRecord[] {
  const reports = loadReports();
  const updated = reports.map((r) => {
    if (r.id === reportId) {
      return {
        ...r,
        status: newStatus,
        lastUpdatedAt: new Date().toISOString(),
        timeline: [
          ...r.timeline,
          {
            id: `tm_${Date.now()}`,
            timestamp: new Date().toISOString(),
            eventType: "Status Changed",
            description: `Investigation status changed to ${newStatus.replace("_", " ").toUpperCase()}.`,
            actorName: adminName,
            actorRole: "Administrator",
          },
        ],
      };
    }
    return r;
  });
  saveReports(updated);
  return updated;
}

export function addInvestigationNote(
  reportId: string,
  noteText: string,
  adminName: string
): UnifiedReportRecord[] {
  const reports = loadReports();
  const updated = reports.map((r) => {
    if (r.id === reportId) {
      return {
        ...r,
        lastUpdatedAt: new Date().toISOString(),
        notes: [
          ...r.notes,
          {
            id: `nt_${Date.now()}`,
            authorName: adminName,
            authorRole: "Moderator",
            timestamp: new Date().toISOString(),
            text: noteText,
            isInternal: true,
          },
        ],
        timeline: [
          ...r.timeline,
          {
            id: `tm_${Date.now()}`,
            timestamp: new Date().toISOString(),
            eventType: "Internal Note Added",
            description: "Internal investigation finding recorded.",
            actorName: adminName,
            actorRole: "Moderator",
          },
        ],
      };
    }
    return r;
  });
  saveReports(updated);
  return updated;
}

export function resolveReport(
  reportId: string,
  resolution: string,
  notes: string,
  adminName: string
): { reports: UnifiedReportRecord[]; history: ModerationHistoryEvent[] } {
  const reports = loadReports();
  const history = loadModerationHistory();
  let targetReport: UnifiedReportRecord | undefined;

  const updatedReports = reports.map((r) => {
    if (r.id === reportId) {
      targetReport = r;
      return {
        ...r,
        status: "resolved" as const,
        resolutionNote: `${resolution} — ${notes}`,
        resolvedAt: new Date().toISOString(),
        resolvedBy: adminName,
        lastUpdatedAt: new Date().toISOString(),
        timeline: [
          ...r.timeline,
          {
            id: `tm_${Date.now()}`,
            timestamp: new Date().toISOString(),
            eventType: "Report Resolved",
            description: `Resolved: ${resolution}.`,
            actorName: adminName,
            actorRole: "Moderator",
          },
        ],
      };
    }
    return r;
  });

  saveReports(updatedReports);

  if (targetReport) {
    const newHistoryEvent: ModerationHistoryEvent = {
      id: `HST-${Date.now().toString().slice(-4)}`,
      reportId,
      targetUser: targetReport.reportedUser,
      actionType: "Report Resolved",
      reason: resolution,
      moderator: adminName,
      timestamp: new Date().toISOString(),
      previousStatus: targetReport.status,
      newStatus: "resolved",
      details: notes,
    };
    history.unshift(newHistoryEvent);
    saveModerationHistory(history);
  }

  return { reports: updatedReports, history };
}

export function dismissReport(
  reportId: string,
  reason: string,
  notes: string,
  adminName: string
): { reports: UnifiedReportRecord[]; history: ModerationHistoryEvent[] } {
  const reports = loadReports();
  const history = loadModerationHistory();
  let targetReport: UnifiedReportRecord | undefined;

  const updatedReports = reports.map((r) => {
    if (r.id === reportId) {
      targetReport = r;
      return {
        ...r,
        status: "dismissed" as const,
        dismissalReason: `${reason}: ${notes}`,
        resolvedAt: new Date().toISOString(),
        resolvedBy: adminName,
        lastUpdatedAt: new Date().toISOString(),
        timeline: [
          ...r.timeline,
          {
            id: `tm_${Date.now()}`,
            timestamp: new Date().toISOString(),
            eventType: "Report Dismissed",
            description: `Dismissed: ${reason}.`,
            actorName: adminName,
            actorRole: "Moderator",
          },
        ],
      };
    }
    return r;
  });

  saveReports(updatedReports);

  if (targetReport) {
    const newHistoryEvent: ModerationHistoryEvent = {
      id: `HST-${Date.now().toString().slice(-4)}`,
      reportId,
      targetUser: targetReport.reportedUser,
      actionType: "Report Dismissed",
      reason,
      moderator: adminName,
      timestamp: new Date().toISOString(),
      previousStatus: targetReport.status,
      newStatus: "dismissed",
      details: notes,
    };
    history.unshift(newHistoryEvent);
    saveModerationHistory(history);
  }

  return { reports: updatedReports, history };
}

export function escalateReport(
  reportId: string,
  escalationTarget: string,
  notes: string,
  adminName: string
): { reports: UnifiedReportRecord[]; history: ModerationHistoryEvent[] } {
  const reports = loadReports();
  const history = loadModerationHistory();
  let targetReport: UnifiedReportRecord | undefined;

  const updatedReports = reports.map((r) => {
    if (r.id === reportId) {
      targetReport = r;
      return {
        ...r,
        status: "escalated" as const,
        priority: "critical" as const,
        lastUpdatedAt: new Date().toISOString(),
        timeline: [
          ...r.timeline,
          {
            id: `tm_${Date.now()}`,
            timestamp: new Date().toISOString(),
            eventType: "Report Escalated",
            description: `Escalated to ${escalationTarget}: ${notes}`,
            actorName: adminName,
            actorRole: "Moderator",
          },
        ],
      };
    }
    return r;
  });

  saveReports(updatedReports);

  if (targetReport) {
    const newHistoryEvent: ModerationHistoryEvent = {
      id: `HST-${Date.now().toString().slice(-4)}`,
      reportId,
      targetUser: targetReport.reportedUser,
      actionType: "Report Escalated",
      reason: `Escalated to ${escalationTarget}`,
      moderator: adminName,
      timestamp: new Date().toISOString(),
      previousStatus: targetReport.status,
      newStatus: "escalated",
      details: notes,
    };
    history.unshift(newHistoryEvent);
    saveModerationHistory(history);
  }

  return { reports: updatedReports, history };
}

export function applyModerationAction(
  actionData: {
    targetUser: UnifiedReportRecord["reportedUser"];
    relatedReportId?: string;
    actionType: ModerationActionType;
    reason: string;
    durationDays?: number | null;
    notes?: string;
  },
  adminName: string
): { actions: ModerationActionRecord[]; history: ModerationHistoryEvent[] } {
  const actions = loadModerationActions();
  const history = loadModerationHistory();

  const expiresAt = actionData.durationDays
    ? new Date(Date.now() + actionData.durationDays * 86400000).toISOString()
    : undefined;

  const newAction: ModerationActionRecord = {
    id: `ACT-${Date.now().toString().slice(-4)}`,
    targetUser: actionData.targetUser,
    relatedReportId: actionData.relatedReportId,
    actionType: actionData.actionType,
    reason: actionData.reason,
    issuedBy: adminName,
    issuedAt: new Date().toISOString(),
    durationDays: actionData.durationDays,
    expiresAt,
    status: "active",
    notes: actionData.notes,
  };

  actions.unshift(newAction);
  saveModerationActions(actions);

  const newHistoryEvent: ModerationHistoryEvent = {
    id: `HST-${Date.now().toString().slice(-4)}`,
    reportId: actionData.relatedReportId,
    actionId: newAction.id,
    targetUser: actionData.targetUser,
    actionType: actionData.actionType,
    reason: actionData.reason,
    moderator: adminName,
    timestamp: new Date().toISOString(),
    newStatus: "enforcement_applied",
    details: actionData.notes,
  };

  history.unshift(newHistoryEvent);
  saveModerationHistory(history);

  return { actions, history };
}

export function reviewContentItem(
  itemId: string,
  newStatus: ContentReviewStatus,
  notes: string,
  adminName: string
): ContentModerationItem[] {
  const queue = loadContentQueue();
  const updated = queue.map((c) => {
    if (c.id === itemId) {
      return {
        ...c,
        reviewStatus: newStatus,
        reviewNotes: notes,
        reviewedAt: new Date().toISOString(),
        reviewedBy: adminName,
      };
    }
    return c;
  });
  saveContentQueue(updated);
  return updated;
}

export function assignAppeal(appealId: string, reviewerName: string): AppealRecord[] {
  const appeals = loadAppeals();
  const updated = appeals.map((a) => {
    if (a.id === appealId) {
      return {
        ...a,
        assignedReviewer: reviewerName,
        status: a.status === "pending" ? ("under_review" as const) : a.status,
      };
    }
    return a;
  });
  saveAppeals(updated);
  return updated;
}

export function resolveAppeal(
  appealId: string,
  status: AppealStatus,
  notes: string,
  adminName: string
): { appeals: AppealRecord[]; actions: ModerationActionRecord[]; history: ModerationHistoryEvent[] } {
  const appeals = loadAppeals();
  const actions = loadModerationActions();
  const history = loadModerationHistory();
  let targetAppeal: AppealRecord | undefined;

  const updatedAppeals = appeals.map((a) => {
    if (a.id === appealId) {
      targetAppeal = a;
      return {
        ...a,
        status,
        reviewerNotes: notes,
        resolvedAt: new Date().toISOString(),
        resolvedBy: adminName,
      };
    }
    return a;
  });
  saveAppeals(updatedAppeals);

  // If appeal was approved, update the corresponding moderation action to "appealed"
  let updatedActions = actions;
  if (targetAppeal && status === "approved") {
    updatedActions = actions.map((act) => {
      if (act.id === targetAppeal?.originalActionId) {
        return {
          ...act,
          status: "appealed" as const,
          notes: `Restriction lifted via approved appeal ${appealId}.`,
        };
      }
      return act;
    });
    saveModerationActions(updatedActions);
  }

  if (targetAppeal) {
    const newHistoryEvent: ModerationHistoryEvent = {
      id: `HST-${Date.now().toString().slice(-4)}`,
      actionId: targetAppeal.originalActionId,
      targetUser: targetAppeal.user,
      actionType: `Appeal ${status.toUpperCase()}`,
      reason: notes,
      moderator: adminName,
      timestamp: new Date().toISOString(),
      previousStatus: "appealed",
      newStatus: status,
      details: `Appeal ${appealId} outcome: ${status}.`,
    };
    history.unshift(newHistoryEvent);
    saveModerationHistory(history);
  }

  return { appeals: updatedAppeals, actions: updatedActions, history };
}

// Filter and Sort Helpers
export function filterAndSortReports(
  reports: UnifiedReportRecord[],
  filters: ModerationFilterState,
  sort: ModerationSortCriteria
): UnifiedReportRecord[] {
  let result = [...reports];

  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.reporter.name.toLowerCase().includes(q) ||
        r.reporter.username.toLowerCase().includes(q) ||
        r.reportedUser.name.toLowerCase().includes(q) ||
        r.reportedUser.username.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    );
  }

  if (filters.domain !== "all") {
    result = result.filter((r) => r.domain === filters.domain);
  }

  if (filters.category !== "all") {
    result = result.filter((r) => r.category === filters.category);
  }

  if (filters.priority !== "all") {
    result = result.filter((r) => r.priority === filters.priority);
  }

  if (filters.status !== "all") {
    result = result.filter((r) => r.status === filters.status);
  }

  if (filters.assignedModerator !== "all") {
    result = result.filter((r) => r.assignedModerator === filters.assignedModerator);
  }

  if (filters.contentType !== "all") {
    result = result.filter((r) => r.contentType === filters.contentType);
  }

  result.sort((a, b) => {
    let comparison = 0;
    if (sort.field === "submittedAt") {
      comparison = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
    } else if (sort.field === "priority") {
      const pMap: Record<ReportPriority, number> = { critical: 4, high: 3, medium: 2, low: 1 };
      comparison = pMap[a.priority] - pMap[b.priority];
    } else if (sort.field === "lastUpdatedAt") {
      comparison = new Date(a.lastUpdatedAt).getTime() - new Date(b.lastUpdatedAt).getTime();
    } else if (sort.field === "oldestUnresolved") {
      const isUnresolvedA = a.status === "pending" || a.status === "under_review" || a.status === "escalated";
      const isUnresolvedB = b.status === "pending" || b.status === "under_review" || b.status === "escalated";
      if (isUnresolvedA && !isUnresolvedB) return -1;
      if (!isUnresolvedA && isUnresolvedB) return 1;
      comparison = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
    }
    return sort.direction === "asc" ? comparison : -comparison;
  });

  return result;
}

export function filterContentQueue(
  queue: ContentModerationItem[],
  status: "all" | ContentReviewStatus,
  searchQuery: string
): ContentModerationItem[] {
  let result = [...queue];
  if (status !== "all") {
    result = result.filter((c) => c.reviewStatus === status);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    result = result.filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        c.owner.name.toLowerCase().includes(q) ||
        (c.contentPreviewText && c.contentPreviewText.toLowerCase().includes(q))
    );
  }
  return result;
}

export function filterModerationActions(
  actions: ModerationActionRecord[],
  status: "all" | "active" | "expired" | "appealed" | "revoked",
  searchQuery: string
): ModerationActionRecord[] {
  let result = [...actions];
  if (status !== "all") {
    result = result.filter((a) => a.status === status);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    result = result.filter(
      (a) =>
        a.id.toLowerCase().includes(q) ||
        a.targetUser.name.toLowerCase().includes(q) ||
        a.actionType.toLowerCase().includes(q) ||
        a.reason.toLowerCase().includes(q)
    );
  }
  return result;
}

export function filterAppeals(
  appeals: AppealRecord[],
  status: "all" | AppealStatus,
  searchQuery: string
): AppealRecord[] {
  let result = [...appeals];
  if (status !== "all") {
    result = result.filter((a) => a.status === status);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    result = result.filter(
      (a) =>
        a.id.toLowerCase().includes(q) ||
        a.user.name.toLowerCase().includes(q) ||
        a.appealReason.toLowerCase().includes(q)
    );
  }
  return result;
}

export function filterHistory(
  history: ModerationHistoryEvent[],
  searchQuery: string
): ModerationHistoryEvent[] {
  let result = [...history];
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    result = result.filter(
      (h) =>
        h.id.toLowerCase().includes(q) ||
        h.targetUser.name.toLowerCase().includes(q) ||
        h.actionType.toLowerCase().includes(q) ||
        h.moderator.toLowerCase().includes(q) ||
        h.reason.toLowerCase().includes(q)
    );
  }
  return result;
}

// Reset demonstration state to initial seed data
export function resetModerationData(): void {
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
  localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(INITIAL_CONTENT_QUEUE));
  localStorage.setItem(STORAGE_KEYS.ACTIONS, JSON.stringify(INITIAL_ACTIONS));
  localStorage.setItem(STORAGE_KEYS.APPEALS, JSON.stringify(INITIAL_APPEALS));
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(INITIAL_HISTORY));
}

// CSV Exporters
export function exportReportsCsv(reports: UnifiedReportRecord[]): void {
  const headers = [
    "Report ID",
    "Domain",
    "Category",
    "Content Type",
    "Priority",
    "Status",
    "Reporter Name",
    "Reported User",
    "Assigned Moderator",
    "Submitted At",
    "Description",
  ];

  const rows = reports.map((r) => [
    r.id,
    r.domain,
    r.category,
    r.contentType,
    r.priority,
    r.status,
    `"${r.reporter.name}"`,
    `"${r.reportedUser.name}"`,
    `"${r.assignedModerator || "Unassigned"}"`,
    r.submittedAt,
    `"${r.description.replace(/"/g, '""')}"`,
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `noblebond_reports_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportActionsCsv(actions: ModerationActionRecord[]): void {
  const headers = [
    "Action ID",
    "Target User",
    "Action Type",
    "Reason",
    "Issued By",
    "Issued At",
    "Duration",
    "Status",
  ];

  const rows = actions.map((a) => [
    a.id,
    `"${a.targetUser.name}"`,
    a.actionType,
    `"${a.reason.replace(/"/g, '""')}"`,
    `"${a.issuedBy}"`,
    a.issuedAt,
    a.durationDays ? `${a.durationDays} Days` : "Permanent",
    a.status,
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `noblebond_moderation_actions_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportAppealsCsv(appeals: AppealRecord[]): void {
  const headers = [
    "Appeal ID",
    "User Name",
    "Original Action",
    "Appeal Reason",
    "Submitted At",
    "Reviewer",
    "Status",
  ];

  const rows = appeals.map((a) => [
    a.id,
    `"${a.user.name}"`,
    a.originalActionType,
    `"${a.appealReason.replace(/"/g, '""')}"`,
    a.submittedAt,
    `"${a.assignedReviewer || "Unassigned"}"`,
    a.status,
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `noblebond_appeals_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
