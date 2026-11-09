// NobleBond Admin — Likes & Matches Data Service & State Store
// Local demo state with localStorage persistence, audit logging, zero emojis

import type {
  LikeRecord,
  MatchRecord,
  ReportedInteraction,
  SuspiciousActivityFlag,
  LikesMatchesStatsKpis,
  LikesMatchesFilterState,
  LikesMatchesSortCriteria,
  DateRangePreset,
  ParticipantBrief,
} from "../types/likesMatches.types";

const LOCAL_STORAGE_LIKES_KEY = "noblebond_admin_likes_v1";
const LOCAL_STORAGE_MATCHES_KEY = "noblebond_admin_matches_v1";
const LOCAL_STORAGE_REPORTS_KEY = "noblebond_admin_like_reports_v1";

export function calculateAge(dobString: string): number {
  const birthDate = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 18 ? age : 18;
}

// 14 Consistent NobleBond Participants matching User & Profile Management
export const PARTICIPANTS: Record<string, ParticipantBrief> = {
  amara: {
    id: "usr_nb_90421",
    profileId: "prf_nb_90421",
    name: "Amara Bliss",
    username: "@amara_bliss",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    dateOfBirth: "1998-05-14",
    gender: "female",
    country: "Nigeria",
    countryCode: "NG",
    city: "Lagos",
    isVerified: true,
    premiumTier: "yearly",
  },
  david: {
    id: "usr_nb_90422",
    profileId: "prf_nb_90422",
    name: "David King",
    username: "@david_king",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    dateOfBirth: "1994-11-20",
    gender: "male",
    country: "Nigeria",
    countryCode: "NG",
    city: "Abuja",
    isVerified: true,
    premiumTier: "monthly",
  },
  zara: {
    id: "usr_nb_90423",
    profileId: "prf_nb_90423",
    name: "Zara Love",
    username: "@zara_love",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    dateOfBirth: "2000-03-22",
    gender: "female",
    country: "United States",
    countryCode: "US",
    city: "New York",
    isVerified: true,
    premiumTier: "yearly",
  },
  jayden: {
    id: "usr_nb_90424",
    profileId: "prf_nb_90424",
    name: "Jayden Cole",
    username: "@jayden_cole",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
    dateOfBirth: "1996-08-30",
    gender: "male",
    country: "United Kingdom",
    countryCode: "GB",
    city: "London",
    isVerified: true,
    premiumTier: "monthly",
  },
  lily: {
    id: "usr_nb_90425",
    profileId: "prf_nb_90425",
    name: "Lily Rose",
    username: "@lily_rose",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    dateOfBirth: "2001-02-14",
    gender: "female",
    country: "France",
    countryCode: "FR",
    city: "Paris",
    isVerified: true,
    premiumTier: "monthly",
  },
  tobi: {
    id: "usr_nb_90426",
    profileId: "prf_nb_90426",
    name: "Tobi Bakare",
    username: "@tobi_bakare",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    dateOfBirth: "1997-10-10",
    gender: "male",
    country: "Nigeria",
    countryCode: "NG",
    city: "Lagos",
    isVerified: false,
    premiumTier: "free",
  },
  marcus: {
    id: "usr_nb_90427",
    profileId: "prf_nb_90427",
    name: "Marcus Sterling",
    username: "@marcus_sterling",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    dateOfBirth: "1990-04-12",
    gender: "male",
    country: "United States",
    countryCode: "US",
    city: "San Francisco",
    isVerified: true,
    premiumTier: "yearly",
  },
  chloe: {
    id: "usr_nb_90428",
    profileId: "prf_nb_90428",
    name: "Chloe Dupont",
    username: "@chloe_dupont",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    dateOfBirth: "1997-06-18",
    gender: "female",
    country: "Canada",
    countryCode: "CA",
    city: "Montreal",
    isVerified: true,
    premiumTier: "weekly",
  },
  kofi: {
    id: "usr_nb_90429",
    profileId: "prf_nb_90429",
    name: "Kofi Mensah",
    username: "@kofi_mensah",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    dateOfBirth: "1993-01-25",
    gender: "male",
    country: "Ghana",
    countryCode: "GH",
    city: "Accra",
    isVerified: true,
    premiumTier: "free",
  },
  elena: {
    id: "usr_nb_90430",
    profileId: "prf_nb_90430",
    name: "Elena Volkov",
    username: "@elena_v",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    dateOfBirth: "1999-07-19",
    gender: "female",
    country: "Germany",
    countryCode: "DE",
    city: "Berlin",
    isVerified: false,
    premiumTier: "monthly",
  },
  tessy: {
    id: "usr_nb_90431",
    profileId: "prf_nb_90431",
    name: "Tessy Boateng",
    username: "@tessy_boateng",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    dateOfBirth: "1998-12-05",
    gender: "female",
    country: "Ghana",
    countryCode: "GH",
    city: "Accra",
    isVerified: true,
    premiumTier: "yearly",
  },
  victor: {
    id: "usr_nb_90432",
    profileId: "prf_nb_90432",
    name: "Victor Okafor",
    username: "@victor_okafor",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    dateOfBirth: "1995-03-08",
    gender: "male",
    country: "Nigeria",
    countryCode: "NG",
    city: "Port Harcourt",
    isVerified: false,
    premiumTier: "free",
  },
  brian: {
    id: "usr_nb_90433",
    profileId: "prf_nb_90433",
    name: "Brian Kovacs",
    username: "@brian_kovacs",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    dateOfBirth: "1992-09-14",
    gender: "male",
    country: "Canada",
    countryCode: "CA",
    city: "Toronto",
    isVerified: false,
    premiumTier: "monthly",
  },
  richard: {
    id: "usr_nb_90434",
    profileId: "prf_nb_90434",
    name: "Richard Blackwood",
    username: "@richard_blackwood",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    dateOfBirth: "1988-11-04",
    gender: "male",
    country: "United Kingdom",
    countryCode: "GB",
    city: "London",
    isVerified: false,
    premiumTier: "free",
  },
};

// INITIAL SEED DEMO MATCHES (Genuine confirmed mutual matches only!)
const INITIAL_DEMO_MATCHES: MatchRecord[] = [
  {
    id: "mtch_801",
    user1: PARTICIPANTS.amara,
    user2: PARTICIPANTS.david,
    matchDate: "2026-10-12T10:02:00Z",
    status: "active",
    durationDays: 28,
    originatingLikes: {
      user1ToUser2: { likeId: "lk_101", timestamp: "2026-10-12T09:15:00Z", type: "regular" },
      user2ToUser1: { likeId: "lk_102", timestamp: "2026-10-12T10:02:00Z", type: "super_like" },
    },
    conversation: {
      exists: true,
      messageCount: 142,
      lastActivityTimestamp: "2026-11-08T22:15:00Z",
      conversationStartedAt: "2026-10-12T10:05:00Z",
    },
    isReported: false,
    historyLog: [
      {
        id: "mlog_1",
        timestamp: "2026-10-12T10:02:00Z",
        adminName: "System",
        action: "Mutual Match Confirmed",
        details: "Mutual likes confirmed between @amara_bliss and @david_king. Conversation channel unlocked.",
      },
    ],
    createdAt: "2026-10-12T10:02:00Z",
    updatedAt: "2026-11-08T22:15:00Z",
  },
  {
    id: "mtch_802",
    user1: PARTICIPANTS.jayden,
    user2: PARTICIPANTS.zara,
    matchDate: "2026-10-18T16:05:00Z",
    status: "active",
    durationDays: 22,
    originatingLikes: {
      user1ToUser2: { likeId: "lk_103", timestamp: "2026-10-18T14:20:00Z", type: "super_like" },
      user2ToUser1: { likeId: "lk_104", timestamp: "2026-10-18T16:05:00Z", type: "regular" },
    },
    conversation: {
      exists: true,
      messageCount: 88,
      lastActivityTimestamp: "2026-11-09T08:30:00Z",
      conversationStartedAt: "2026-10-18T16:20:00Z",
    },
    isReported: false,
    historyLog: [
      {
        id: "mlog_2",
        timestamp: "2026-10-18T16:05:00Z",
        adminName: "System",
        action: "Mutual Match Confirmed",
        details: "Super Like from @jayden_cole reciprocated by @zara_love.",
      },
    ],
    createdAt: "2026-10-18T16:05:00Z",
    updatedAt: "2026-11-09T08:30:00Z",
  },
  {
    id: "mtch_803",
    user1: PARTICIPANTS.tobi,
    user2: PARTICIPANTS.chloe,
    matchDate: "2026-10-25T13:30:00Z",
    status: "active",
    durationDays: 15,
    originatingLikes: {
      user1ToUser2: { likeId: "lk_105", timestamp: "2026-10-25T11:00:00Z", type: "regular" },
      user2ToUser1: { likeId: "lk_106", timestamp: "2026-10-25T13:30:00Z", type: "regular" },
    },
    conversation: {
      exists: true,
      messageCount: 46,
      lastActivityTimestamp: "2026-11-07T19:40:00Z",
      conversationStartedAt: "2026-10-25T14:00:00Z",
    },
    isReported: false,
    historyLog: [],
    createdAt: "2026-10-25T13:30:00Z",
    updatedAt: "2026-11-07T19:40:00Z",
  },
  {
    id: "mtch_804",
    user1: PARTICIPANTS.lily,
    user2: PARTICIPANTS.marcus,
    matchDate: "2026-09-10T12:00:00Z",
    status: "unmatched",
    durationDays: 53,
    originatingLikes: {
      user1ToUser2: { likeId: "lk_107", timestamp: "2026-09-10T11:00:00Z", type: "regular" },
      user2ToUser1: { likeId: "lk_108", timestamp: "2026-09-10T12:00:00Z", type: "regular" },
    },
    conversation: {
      exists: true,
      messageCount: 31,
      lastActivityTimestamp: "2026-11-01T15:20:00Z",
      conversationStartedAt: "2026-09-10T12:15:00Z",
    },
    unmatchInfo: {
      unmatcherUserId: PARTICIPANTS.lily.id,
      unmatcherName: PARTICIPANTS.lily.name,
      unmatchDate: "2026-11-02T16:00:00Z",
      reason: "Mutual schedule incompatibility with European travel season.",
      byAdmin: false,
    },
    isReported: false,
    historyLog: [
      {
        id: "mlog_4",
        timestamp: "2026-11-02T16:00:00Z",
        adminName: "User (Self-action)",
        action: "Unmatched by User",
        details: "@lily_rose voluntarily unmatched @marcus_sterling. Reason provided: Schedule incompatibility.",
      },
    ],
    createdAt: "2026-09-10T12:00:00Z",
    updatedAt: "2026-11-02T16:00:00Z",
  },
  {
    id: "mtch_805",
    user1: PARTICIPANTS.kofi,
    user2: PARTICIPANTS.tessy,
    matchDate: "2026-11-01T12:00:00Z",
    status: "active",
    durationDays: 8,
    originatingLikes: {
      user1ToUser2: { likeId: "lk_109", timestamp: "2026-11-01T10:10:00Z", type: "regular" },
      user2ToUser1: { likeId: "lk_110", timestamp: "2026-11-01T12:00:00Z", type: "regular" },
    },
    conversation: {
      exists: true,
      messageCount: 19,
      lastActivityTimestamp: "2026-11-08T18:00:00Z",
      conversationStartedAt: "2026-11-01T12:30:00Z",
    },
    isReported: false,
    historyLog: [],
    createdAt: "2026-11-01T12:00:00Z",
    updatedAt: "2026-11-08T18:00:00Z",
  },
  {
    id: "mtch_806",
    user1: PARTICIPANTS.elena,
    user2: PARTICIPANTS.brian,
    matchDate: "2026-11-04T15:00:00Z",
    status: "restricted",
    durationDays: 5,
    originatingLikes: {
      user1ToUser2: { likeId: "lk_111", timestamp: "2026-11-04T14:00:00Z", type: "regular" },
      user2ToUser1: { likeId: "lk_112", timestamp: "2026-11-04T15:00:00Z", type: "super_like" },
    },
    conversation: {
      exists: true,
      messageCount: 12,
      lastActivityTimestamp: "2026-11-05T10:00:00Z",
      conversationStartedAt: "2026-11-04T15:15:00Z",
    },
    isReported: true,
    reportId: "rep_int_301",
    reportCategory: "fake_profile",
    historyLog: [
      {
        id: "mlog_6",
        timestamp: "2026-11-06T15:10:00Z",
        adminName: "Senior Moderator (L. Vance)",
        action: "Match Restricted by Admin",
        details: "Match restricted and chat locked pending resolution of catfishing/impersonation investigation on Brian Kovacs.",
      },
    ],
    createdAt: "2026-11-04T15:00:00Z",
    updatedAt: "2026-11-06T15:10:00Z",
  },
];

// INITIAL SEED DEMO LIKES RECORDS (Directional Likes: Sender -> Recipient)
const INITIAL_DEMO_LIKES: LikeRecord[] = [
  // Likes that formed active or past matches:
  {
    id: "lk_101",
    sender: PARTICIPANTS.amara,
    recipient: PARTICIPANTS.david,
    type: "regular",
    status: "liked_back",
    timestamp: "2026-10-12T09:15:00Z",
    resultedInMatch: true,
    matchId: "mtch_801",
    isReported: false,
  },
  {
    id: "lk_102",
    sender: PARTICIPANTS.david,
    recipient: PARTICIPANTS.amara,
    type: "super_like",
    status: "liked_back",
    timestamp: "2026-10-12T10:02:00Z",
    resultedInMatch: true,
    matchId: "mtch_801",
    isReported: false,
    pointsCost: 50,
  },
  {
    id: "lk_103",
    sender: PARTICIPANTS.jayden,
    recipient: PARTICIPANTS.zara,
    type: "super_like",
    status: "liked_back",
    timestamp: "2026-10-18T14:20:00Z",
    resultedInMatch: true,
    matchId: "mtch_802",
    isReported: false,
    pointsCost: 50,
  },
  {
    id: "lk_104",
    sender: PARTICIPANTS.zara,
    recipient: PARTICIPANTS.jayden,
    type: "regular",
    status: "liked_back",
    timestamp: "2026-10-18T16:05:00Z",
    resultedInMatch: true,
    matchId: "mtch_802",
    isReported: false,
  },
  {
    id: "lk_105",
    sender: PARTICIPANTS.tobi,
    recipient: PARTICIPANTS.chloe,
    type: "regular",
    status: "liked_back",
    timestamp: "2026-10-25T11:00:00Z",
    resultedInMatch: true,
    matchId: "mtch_803",
    isReported: false,
  },
  {
    id: "lk_106",
    sender: PARTICIPANTS.chloe,
    recipient: PARTICIPANTS.tobi,
    type: "regular",
    status: "liked_back",
    timestamp: "2026-10-25T13:30:00Z",
    resultedInMatch: true,
    matchId: "mtch_803",
    isReported: false,
  },
  {
    id: "lk_107",
    sender: PARTICIPANTS.lily,
    recipient: PARTICIPANTS.marcus,
    type: "regular",
    status: "liked_back",
    timestamp: "2026-09-10T11:00:00Z",
    resultedInMatch: true,
    matchId: "mtch_804",
    isReported: false,
  },
  {
    id: "lk_108",
    sender: PARTICIPANTS.marcus,
    recipient: PARTICIPANTS.lily,
    type: "regular",
    status: "liked_back",
    timestamp: "2026-09-10T12:00:00Z",
    resultedInMatch: true,
    matchId: "mtch_804",
    isReported: false,
  },
  {
    id: "lk_109",
    sender: PARTICIPANTS.kofi,
    recipient: PARTICIPANTS.tessy,
    type: "regular",
    status: "liked_back",
    timestamp: "2026-11-01T10:10:00Z",
    resultedInMatch: true,
    matchId: "mtch_805",
    isReported: false,
  },
  {
    id: "lk_110",
    sender: PARTICIPANTS.tessy,
    recipient: PARTICIPANTS.kofi,
    type: "regular",
    status: "liked_back",
    timestamp: "2026-11-01T12:00:00Z",
    resultedInMatch: true,
    matchId: "mtch_805",
    isReported: false,
  },
  {
    id: "lk_111",
    sender: PARTICIPANTS.elena,
    recipient: PARTICIPANTS.brian,
    type: "regular",
    status: "liked_back",
    timestamp: "2026-11-04T14:00:00Z",
    resultedInMatch: true,
    matchId: "mtch_806",
    isReported: true,
    reportId: "rep_int_301",
  },
  {
    id: "lk_112",
    sender: PARTICIPANTS.brian,
    recipient: PARTICIPANTS.elena,
    type: "super_like",
    status: "liked_back",
    timestamp: "2026-11-04T15:00:00Z",
    resultedInMatch: true,
    matchId: "mtch_806",
    isReported: false,
    pointsCost: 50,
  },

  // Pending Incoming / Outgoing Likes (No mutual like yet):
  {
    id: "lk_901",
    sender: PARTICIPANTS.victor,
    recipient: PARTICIPANTS.amara,
    type: "regular",
    status: "pending",
    timestamp: "2026-11-08T14:10:00Z",
    resultedInMatch: false,
    isReported: false,
  },
  {
    id: "lk_902",
    sender: PARTICIPANTS.kofi,
    recipient: PARTICIPANTS.chloe,
    type: "super_like",
    status: "pending",
    timestamp: "2026-11-08T16:45:00Z",
    resultedInMatch: false,
    isReported: false,
    pointsCost: 50,
  },
  {
    id: "lk_903",
    sender: PARTICIPANTS.richard,
    recipient: PARTICIPANTS.zara,
    type: "regular",
    status: "pending",
    timestamp: "2026-11-08T20:10:00Z",
    resultedInMatch: false,
    isReported: true,
    reportId: "rep_int_302",
    flagReason: "Sender has commercial event promoter keywords in profile bio.",
  },
  {
    id: "lk_904",
    sender: PARTICIPANTS.david,
    recipient: PARTICIPANTS.tessy,
    type: "regular",
    status: "pending",
    timestamp: "2026-11-09T07:20:00Z",
    resultedInMatch: false,
    isReported: false,
  },
  {
    id: "lk_905",
    sender: PARTICIPANTS.tobi,
    recipient: PARTICIPANTS.elena,
    type: "regular",
    status: "pending",
    timestamp: "2026-11-09T08:50:00Z",
    resultedInMatch: false,
    isReported: false,
  },

  // Passed / Expired Likes:
  {
    id: "lk_906",
    sender: PARTICIPANTS.richard,
    recipient: PARTICIPANTS.lily,
    type: "regular",
    status: "passed",
    timestamp: "2026-11-05T11:00:00Z",
    resultedInMatch: false,
    isReported: false,
  },
  {
    id: "lk_907",
    sender: PARTICIPANTS.brian,
    recipient: PARTICIPANTS.chloe,
    type: "super_like",
    status: "passed",
    timestamp: "2026-11-06T12:00:00Z",
    resultedInMatch: false,
    isReported: true,
    reportId: "rep_int_303",
    pointsCost: 50,
  },
];

// INITIAL SEED DEMO REPORTED INTERACTIONS
const INITIAL_DEMO_REPORTS: ReportedInteraction[] = [
  {
    id: "rep_int_301",
    reporter: PARTICIPANTS.elena,
    reportedUser: PARTICIPANTS.brian,
    relatedType: "match",
    relatedId: "mtch_806",
    category: "fake_profile",
    priority: "high",
    status: "investigating",
    dateSubmitted: "2026-11-06T14:00:00Z",
    reason: "Elena reported that Brian refused to engage in video verification and photos match an indexed Instagram fitness model.",
    adminNotes: "Assigned to Trust & Safety. Match mtch_806 restricted pending biometric re-verification.",
  },
  {
    id: "rep_int_302",
    reporter: PARTICIPANTS.zara,
    reportedUser: PARTICIPANTS.richard,
    relatedType: "like",
    relatedId: "lk_903",
    category: "spam",
    priority: "medium",
    status: "new",
    dateSubmitted: "2026-11-08T20:30:00Z",
    reason: "Sender profile explicitly solicits VIP nightclub guestlists and paid promoter recruiting.",
    adminNotes: "Pending review.",
  },
  {
    id: "rep_int_303",
    reporter: PARTICIPANTS.chloe,
    reportedUser: PARTICIPANTS.brian,
    relatedType: "like",
    relatedId: "lk_907",
    category: "harassment",
    priority: "critical",
    status: "resolved",
    dateSubmitted: "2026-11-06T12:30:00Z",
    reason: "Super Like sent accompanied by aggressive off-platform contact demands.",
    adminNotes: "Investigation concluded. Warning applied to Brian Kovacs; Super Like dismissed.",
    resolution: "Interaction cleared, account restricted under profile policy.",
    resolvedAt: "2026-11-06T16:00:00Z",
    resolvedBy: "Super Admin",
  },
];

// INITIAL SUSPICIOUS RISK INDICATORS
export const INITIAL_SUSPICIOUS_FLAGS: SuspiciousActivityFlag[] = [
  {
    id: "sus_1",
    user: PARTICIPANTS.richard,
    patternType: "excessive_likes_burst",
    description: "Sent 94 likes within 12 minutes to female profiles with external commercial links in bio.",
    severity: "high",
    metricCount: 94,
    detectedAt: "2026-11-08T20:15:00Z",
    status: "open",
  },
  {
    id: "sus_2",
    user: PARTICIPANTS.brian,
    patternType: "repeated_reports",
    description: "Received 3 separate safety reports within 48 hours for suspected catfishing.",
    severity: "high",
    metricCount: 3,
    detectedAt: "2026-11-06T14:45:00Z",
    status: "open",
  },
  {
    id: "sus_3",
    user: PARTICIPANTS.victor,
    patternType: "rapid_swiping",
    description: "Recorded average swipe deliberation time of 0.35s across 40 profiles.",
    severity: "low",
    metricCount: 40,
    detectedAt: "2026-11-08T14:15:00Z",
    status: "reviewed",
  },
];

export function loadLikes(): LikeRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LIKES_KEY);
    if (!raw) {
      saveLikes(INITIAL_DEMO_LIKES);
      return INITIAL_DEMO_LIKES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    saveLikes(INITIAL_DEMO_LIKES);
    return INITIAL_DEMO_LIKES;
  } catch {
    return INITIAL_DEMO_LIKES;
  }
}

export function saveLikes(likes: LikeRecord[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_LIKES_KEY, JSON.stringify(likes));
  } catch (err) {
    console.error("Error writing likes to localStorage:", err);
  }
}

export function loadMatches(): MatchRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_MATCHES_KEY);
    if (!raw) {
      saveMatches(INITIAL_DEMO_MATCHES);
      return INITIAL_DEMO_MATCHES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    saveMatches(INITIAL_DEMO_MATCHES);
    return INITIAL_DEMO_MATCHES;
  } catch {
    return INITIAL_DEMO_MATCHES;
  }
}

export function saveMatches(matches: MatchRecord[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_MATCHES_KEY, JSON.stringify(matches));
  } catch (err) {
    console.error("Error writing matches to localStorage:", err);
  }
}

export function loadReports(): ReportedInteraction[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
    if (!raw) {
      saveReports(INITIAL_DEMO_REPORTS);
      return INITIAL_DEMO_REPORTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    saveReports(INITIAL_DEMO_REPORTS);
    return INITIAL_DEMO_REPORTS;
  } catch {
    return INITIAL_DEMO_REPORTS;
  }
}

export function saveReports(reports: ReportedInteraction[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(reports));
  } catch (err) {
    console.error("Error writing reports to localStorage:", err);
  }
}

export function resetLikesMatchesData(): {
  likes: LikeRecord[];
  matches: MatchRecord[];
  reports: ReportedInteraction[];
} {
  saveLikes(INITIAL_DEMO_LIKES);
  saveMatches(INITIAL_DEMO_MATCHES);
  saveReports(INITIAL_DEMO_REPORTS);
  return {
    likes: INITIAL_DEMO_LIKES,
    matches: INITIAL_DEMO_MATCHES,
    reports: INITIAL_DEMO_REPORTS,
  };
}

export function calculateKPIs(
  dateRange: DateRangePreset,
  likesData?: LikeRecord[],
  matchesData?: MatchRecord[],
  reportsData?: ReportedInteraction[]
): LikesMatchesStatsKpis {
  const likes = likesData || loadLikes();
  const matches = matchesData || loadMatches();
  const reports = reportsData || loadReports();

  const now = new Date();
  let daysThreshold = 30;
  if (dateRange === "today") daysThreshold = 1;
  else if (dateRange === "last_7_days") daysThreshold = 7;
  else if (dateRange === "last_30_days") daysThreshold = 30;
  else if (dateRange === "last_90_days") daysThreshold = 90;

  const cutoff = new Date(now.getTime() - daysThreshold * 24 * 60 * 60 * 1000);

  const likesInPeriod = likes.filter((l) => new Date(l.timestamp) >= cutoff);
  const matchesInPeriod = matches.filter((m) => new Date(m.matchDate) >= cutoff);
  const unmatchesInPeriod = matches.filter(
    (m) => m.status === "unmatched" && m.unmatchInfo && new Date(m.unmatchInfo.unmatchDate) >= cutoff
  );

  const totalConfirmedMatches = matches.length;
  const activeMatches = matches.filter((m) => m.status === "active").length;
  const totalUnmatches = matches.filter((m) => m.status === "unmatched").length;

  const totalSuperLikes = likes.filter((l) => l.type === "super_like").length;
  const superLikesInPeriod = likesInPeriod.filter((l) => l.type === "super_like").length;

  const pendingIncomingLikes = likes.filter((l) => l.status === "pending").length;

  const openReports = reports.filter((r) => r.status === "new" || r.status === "investigating").length;

  return {
    totalLikesSent: likes.length,
    likesSentThisPeriod: likesInPeriod.length,
    likesSentDeltaPercent: 12.4,

    totalLikesReceived: likes.length,
    likesReceivedThisPeriod: likesInPeriod.length,
    likesReceivedDeltaPercent: 14.1,

    totalConfirmedMatches,
    newMatchesThisPeriod: matchesInPeriod.length,
    newMatchesDeltaPercent: 8.6,

    pendingIncomingLikes,

    totalSuperLikes,
    superLikesThisPeriod,

    totalUnmatches,
    unmatchesThisPeriod: unmatchesInPeriod.length,

    activeMatches,

    reportedInteractionsCount: openReports,
  };
}

export function filterAndSortLikes(
  likes: LikeRecord[],
  filter: LikesMatchesFilterState,
  sort: LikesMatchesSortCriteria,
  viewTab: "all_likes" | "incoming" | "outgoing" | "super_likes"
): LikeRecord[] {
  let result = [...likes];

  // Tab direction filtering
  if (viewTab === "incoming") {
    // Show likes received by active demo participants
    result = result.filter((l) => l.recipient.id);
  } else if (viewTab === "outgoing") {
    // Show likes sent by active demo participants
    result = result.filter((l) => l.sender.id);
  } else if (viewTab === "super_likes") {
    result = result.filter((l) => l.type === "super_like");
  }

  // Search across 6 fields
  if (filter.searchQuery.trim()) {
    const q = filter.searchQuery.toLowerCase().trim();
    result = result.filter(
      (l) =>
        l.id.toLowerCase().includes(q) ||
        l.sender.name.toLowerCase().includes(q) ||
        l.sender.username.toLowerCase().includes(q) ||
        l.sender.id.toLowerCase().includes(q) ||
        l.recipient.name.toLowerCase().includes(q) ||
        l.recipient.username.toLowerCase().includes(q) ||
        l.recipient.id.toLowerCase().includes(q) ||
        (l.matchId && l.matchId.toLowerCase().includes(q))
    );
  }

  // Interaction type filter
  if (filter.interactionType !== "all") {
    result = result.filter((l) => l.type === filter.interactionType);
  }

  // Gender filter (checks sender or recipient)
  if (filter.gender !== "all") {
    result = result.filter((l) => l.sender.gender === filter.gender || l.recipient.gender === filter.gender);
  }

  // Country filter
  if (filter.country !== "all") {
    result = result.filter(
      (l) =>
        l.sender.country.toLowerCase() === filter.country.toLowerCase() ||
        l.recipient.country.toLowerCase() === filter.country.toLowerCase()
    );
  }

  // Verification filter
  if (filter.verificationStatus !== "all") {
    const req = filter.verificationStatus === "verified";
    result = result.filter((l) => l.sender.isVerified === req || l.recipient.isVerified === req);
  }

  // Reports filter
  if (filter.hasReports !== "all") {
    if (filter.hasReports === "reported_only") {
      result = result.filter((l) => l.isReported);
    } else if (filter.hasReports === "clean_only") {
      result = result.filter((l) => !l.isReported);
    }
  }

  // Sorting
  result.sort((a, b) => {
    let comp: number;
    switch (sort.field) {
      case "senderName":
        comp = a.sender.name.localeCompare(b.sender.name);
        break;
      case "recipientName":
        comp = a.recipient.name.localeCompare(b.recipient.name);
        break;
      case "timestamp":
      default:
        comp = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        break;
    }
    return sort.order === "asc" ? comp : -comp;
  });

  return result;
}

export function filterAndSortMatches(
  matches: MatchRecord[],
  filter: LikesMatchesFilterState,
  sort: LikesMatchesSortCriteria,
  viewTab: "all_matches" | "active" | "unmatched"
): MatchRecord[] {
  let result = [...matches];

  // Tab filter
  if (viewTab === "active") {
    result = result.filter((m) => m.status === "active");
  } else if (viewTab === "unmatched") {
    result = result.filter((m) => m.status === "unmatched");
  }

  // Match status filter
  if (filter.matchStatus !== "all") {
    result = result.filter((m) => m.status === filter.matchStatus);
  }

  // Search across users and IDs
  if (filter.searchQuery.trim()) {
    const q = filter.searchQuery.toLowerCase().trim();
    result = result.filter(
      (m) =>
        m.id.toLowerCase().includes(q) ||
        m.user1.name.toLowerCase().includes(q) ||
        m.user1.username.toLowerCase().includes(q) ||
        m.user1.id.toLowerCase().includes(q) ||
        m.user2.name.toLowerCase().includes(q) ||
        m.user2.username.toLowerCase().includes(q) ||
        m.user2.id.toLowerCase().includes(q)
    );
  }

  // Country filter
  if (filter.country !== "all") {
    result = result.filter(
      (m) =>
        m.user1.country.toLowerCase() === filter.country.toLowerCase() ||
        m.user2.country.toLowerCase() === filter.country.toLowerCase()
    );
  }

  // Verification filter
  if (filter.verificationStatus !== "all") {
    const req = filter.verificationStatus === "verified";
    result = result.filter((m) => m.user1.isVerified === req || m.user2.isVerified === req);
  }

  // Reports filter
  if (filter.hasReports !== "all") {
    if (filter.hasReports === "reported_only") {
      result = result.filter((m) => m.isReported);
    } else if (filter.hasReports === "clean_only") {
      result = result.filter((m) => !m.isReported);
    }
  }

  // Sorting
  result.sort((a, b) => {
    let comp: number;
    switch (sort.field) {
      case "durationDays":
        comp = a.durationDays - b.durationDays;
        break;
      case "messageCount":
        comp = a.conversation.messageCount - b.conversation.messageCount;
        break;
      case "senderName":
        comp = a.user1.name.localeCompare(b.user1.name);
        break;
      case "matchDate":
      default:
        comp = new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime();
        break;
    }
    return sort.order === "asc" ? comp : -comp;
  });

  return result;
}

export function filterAndSortReports(
  reports: ReportedInteraction[],
  searchQuery: string
): ReportedInteraction[] {
  let result = [...reports];
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    result = result.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.relatedId.toLowerCase().includes(q) ||
        r.reporter.name.toLowerCase().includes(q) ||
        r.reportedUser.name.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q)
    );
  }
  return result;
}

// RESTORE MATCH SAFETY VALIDATION
export function validateMatchRestoration(
  match: MatchRecord
): { eligible: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 1. Must have had valid mutual likes originally
  if (!match.originatingLikes.user1ToUser2.likeId || !match.originatingLikes.user2ToUser1.likeId) {
    reasons.push("Ineligible: Original mutual-like verification records are missing or corrupted.");
  }

  // 2. Neither user can have a critical fraud ban
  if (match.user1.id === "usr_nb_90434" || match.user2.id === "usr_nb_90434") {
    reasons.push("Ineligible: One participant has an active commercial solicitation suspension.");
  }

  // 3. Check safety restriction
  if (match.isReported && match.status === "restricted") {
    reasons.push("Ineligible: Match is blocked by an active, unresolved trust & safety restriction.");
  }

  return {
    eligible: reasons.length === 0,
    reasons,
  };
}

export function restoreMatch(matchId: string, adminReason: string): MatchRecord {
  const matches = loadMatches();
  const index = matches.findIndex((m) => m.id === matchId);
  if (index === -1) throw new Error("Match record not found");

  const match = matches[index];
  const validation = validateMatchRestoration(match);
  if (!validation.eligible) {
    throw new Error(`Restoration rejected: ${validation.reasons.join(" ")}`);
  }

  match.status = "active";
  match.unmatchInfo = undefined;
  match.updatedAt = new Date().toISOString();
  match.historyLog.unshift({
    id: `mlog_${Date.now()}`,
    timestamp: new Date().toISOString(),
    adminName: "Super Admin",
    action: "Match Restored by Admin",
    details: `Administrative match restoration approved. Reason: ${adminReason}`,
  });

  matches[index] = { ...match };
  saveMatches(matches);
  return match;
}

export function flagInteraction(
  type: "like" | "match",
  id: string,
  reason: string
): void {
  if (type === "match") {
    const matches = loadMatches();
    const m = matches.find((item) => item.id === id);
    if (m) {
      m.isReported = true;
      m.status = "under_review";
      m.historyLog.unshift({
        id: `mlog_${Date.now()}`,
        timestamp: new Date().toISOString(),
        adminName: "Super Admin",
        action: "Interaction Flagged for Review",
        details: reason,
      });
      saveMatches(matches);
    }
  } else {
    const likes = loadLikes();
    const lk = likes.find((item) => item.id === id);
    if (lk) {
      lk.isReported = true;
      lk.flagReason = reason;
      saveLikes(likes);
    }
  }
}

export function resolveInteractionReport(
  reportId: string,
  decision: "investigating" | "resolved" | "escalated" | "dismissed",
  notes: string
): ReportedInteraction {
  const reports = loadReports();
  const index = reports.findIndex((r) => r.id === reportId);
  if (index === -1) throw new Error("Report not found");

  const rep = reports[index];
  rep.status = decision;
  rep.adminNotes = notes;
  if (decision === "resolved" || decision === "dismissed") {
    rep.resolvedAt = new Date().toISOString();
    rep.resolvedBy = "Super Admin";
    rep.resolution = notes;
  }

  reports[index] = { ...rep };
  saveReports(reports);
  return rep;
}

export function exportLikesCsv(likes: LikeRecord[]): string {
  const headers = [
    "Like ID",
    "Sender Name",
    "Sender Username",
    "Sender ID",
    "Recipient Name",
    "Recipient Username",
    "Recipient ID",
    "Type",
    "Status",
    "Resulted In Match",
    "Related Match ID",
    "Timestamp",
  ];

  const rows = likes.map((l) => [
    l.id,
    `"${l.sender.name.replace(/"/g, '""')}"`,
    l.sender.username,
    l.sender.id,
    `"${l.recipient.name.replace(/"/g, '""')}"`,
    l.recipient.username,
    l.recipient.id,
    l.type,
    l.status,
    l.resultedInMatch ? "Yes" : "No",
    l.matchId || "N/A",
    l.timestamp,
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

export function exportMatchesCsv(matches: MatchRecord[]): string {
  const headers = [
    "Match ID",
    "User 1 Name",
    "User 1 Username",
    "User 1 ID",
    "User 2 Name",
    "User 2 Username",
    "User 2 ID",
    "Status",
    "Match Date",
    "Duration (Days)",
    "Message Count",
    "Reported",
  ];

  const rows = matches.map((m) => [
    m.id,
    `"${m.user1.name.replace(/"/g, '""')}"`,
    m.user1.username,
    m.user1.id,
    `"${m.user2.name.replace(/"/g, '""')}"`,
    m.user2.username,
    m.user2.id,
    m.status,
    m.matchDate,
    m.durationDays,
    m.conversation.messageCount,
    m.isReported ? "Yes" : "No",
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}
