// Realistic demo datasets for NobleBond Administration Console

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  age: number;
  gender: string;
  location: string;
  status: "active" | "suspended" | "banned" | "pending_verification";
  isVerified: boolean;
  isPremium: boolean;
  registeredAt: string;
  lastActive: string;
  reportsCount: number;
  connectionPoints: number;
  giftCoins: number;
}

export interface ModerationReport {
  id: string;
  reportType: "harassment" | "impersonation" | "inappropriate_content" | "spam" | "underage";
  targetType: "user" | "chat" | "live" | "profile_photo";
  reportedUser: {
    id: string;
    name: string;
    avatar: string;
    email: string;
  };
  reporter: {
    name: string;
    id: string;
  };
  reason: string;
  status: "open" | "investigating" | "resolved" | "dismissed";
  severity: "critical" | "high" | "medium" | "low";
  createdAt: string;
}

export interface LiveBroadcastItem {
  id: string;
  title: string;
  hostName: string;
  hostAvatar: string;
  viewerCount: number;
  guestCount: number;
  coinsEarned: number;
  durationMinutes: number;
  tags: string[];
  status: "active" | "flagged" | "ended";
  moderationScore: number; // 0 - 100
}

export interface SupportTicket {
  id: string;
  user: string;
  email: string;
  subject: string;
  category: "billing" | "verification" | "account_access" | "dating_perks" | "technical";
  priority: "urgent" | "high" | "medium" | "low";
  status: "open" | "in_progress" | "resolved";
  assignedTo: string;
  updatedAt: string;
}

export const ADMIN_STATS = {
  totalUsers: "1,284,520",
  activeDAU: "148,230",
  newToday: "+1,420",
  totalMatches: "3,892,410",
  activeLiveStreams: "42",
  totalStreamers: "318",
  premiumSubscribers: "52,840",
  monthlyRevenue: "$384,950",
  revenueGrowth: "+18.4%",
  referralsConverted: "14,820",
  connectionPointsIssued: "741,000",
  giftCoinsPurchased: "12,480,000",
  openReports: "18",
  openTickets: "9",
};

export const MOCK_USERS: AdminUser[] = [
  {
    id: "usr_001",
    name: "Sarah James",
    email: "sarah.james@example.com",
    phone: "+1 (555) 234-8901",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    age: 26,
    gender: "Female",
    location: "Los Angeles, CA",
    status: "active",
    isVerified: true,
    isPremium: true,
    registeredAt: "2026-03-12",
    lastActive: "Just now",
    reportsCount: 0,
    connectionPoints: 350,
    giftCoins: 1250,
  },
  {
    id: "usr_002",
    name: "Emily Carter",
    email: "emily.carter@noblebond.org",
    phone: "+1 (555) 782-9912",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    age: 24,
    gender: "Female",
    location: "Miami, FL",
    status: "active",
    isVerified: true,
    isPremium: true,
    registeredAt: "2026-04-01",
    lastActive: "5m ago",
    reportsCount: 0,
    connectionPoints: 850,
    giftCoins: 4800,
  },
  {
    id: "usr_003",
    name: "David King",
    email: "david.king@domain.com",
    phone: "+234 803 123 4567",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    age: 29,
    gender: "Male",
    location: "Abuja, Nigeria",
    status: "active",
    isVerified: true,
    isPremium: false,
    registeredAt: "2026-05-18",
    lastActive: "12m ago",
    reportsCount: 1,
    connectionPoints: 200,
    giftCoins: 600,
  },
  {
    id: "usr_004",
    name: "Zara Love",
    email: "zara.love@gmail.com",
    phone: "+1 (555) 890-1122",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    age: 25,
    gender: "Female",
    location: "New York, USA",
    status: "active",
    isVerified: true,
    isPremium: true,
    registeredAt: "2026-06-02",
    lastActive: "1h ago",
    reportsCount: 0,
    connectionPoints: 1200,
    giftCoins: 9400,
  },
  {
    id: "usr_005",
    name: "Alex Vance",
    email: "alex.vance@spambot.xyz",
    phone: "+1 (555) 000-9988",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    age: 31,
    gender: "Male",
    location: "Seattle, WA",
    status: "suspended",
    isVerified: false,
    isPremium: false,
    registeredAt: "2026-10-14",
    lastActive: "3d ago",
    reportsCount: 8,
    connectionPoints: 0,
    giftCoins: 0,
  },
  {
    id: "usr_006",
    name: "Amara Bliss",
    email: "amara.b@yahoo.com",
    phone: "+234 812 998 0011",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
    age: 23,
    gender: "Female",
    location: "Lagos, Nigeria",
    status: "active",
    isVerified: true,
    isPremium: true,
    registeredAt: "2026-07-22",
    lastActive: "Active now",
    reportsCount: 0,
    connectionPoints: 650,
    giftCoins: 3100,
  },
  {
    id: "usr_007",
    name: "Jayden Taylor",
    email: "jayden.t@outlook.com",
    phone: "+44 7911 123456",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    age: 28,
    gender: "Male",
    location: "London, UK",
    status: "active",
    isVerified: false,
    isPremium: true,
    registeredAt: "2026-08-11",
    lastActive: "4h ago",
    reportsCount: 0,
    connectionPoints: 150,
    giftCoins: 850,
  },
  {
    id: "usr_008",
    name: "Lily Rose",
    email: "lily.rose@gmail.com",
    phone: "+1 (555) 443-2211",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    age: 22,
    gender: "Female",
    location: "Toronto, Canada",
    status: "pending_verification",
    isVerified: false,
    isPremium: false,
    registeredAt: "2026-11-06",
    lastActive: "1d ago",
    reportsCount: 0,
    connectionPoints: 50,
    giftCoins: 0,
  },
];

export const MOCK_REPORTS: ModerationReport[] = [
  {
    id: "rep_901",
    reportType: "harassment",
    targetType: "chat",
    reportedUser: {
      id: "usr_005",
      name: "Alex Vance",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      email: "alex.vance@spambot.xyz",
    },
    reporter: {
      name: "Sarah James",
      id: "usr_001",
    },
    reason: "Repeated offensive language and unsolicited messages after being asked to stop.",
    status: "open",
    severity: "high",
    createdAt: "2026-11-08 17:42",
  },
  {
    id: "rep_902",
    reportType: "impersonation",
    targetType: "profile_photo",
    reportedUser: {
      id: "usr_fake_22",
      name: "Celebrity_Clone",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      email: "bot77@fake.net",
    },
    reporter: {
      name: "Emily Carter",
      id: "usr_002",
    },
    reason: "Profile photos are scraped from a verified influencer's Instagram account.",
    status: "investigating",
    severity: "critical",
    createdAt: "2026-11-08 14:15",
  },
  {
    id: "rep_903",
    reportType: "inappropriate_content",
    targetType: "live",
    reportedUser: {
      id: "usr_003",
      name: "David King",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      email: "david.king@domain.com",
    },
    reporter: {
      name: "Zara Love",
      id: "usr_004",
    },
    reason: "Broadcast guest displayed prohibited promotional links on stream.",
    status: "resolved",
    severity: "medium",
    createdAt: "2026-11-07 21:30",
  },
];

export const MOCK_LIVE_BROADCASTS: LiveBroadcastItem[] = [
  {
    id: "live_401",
    title: "Acoustic vibes & Sunday Q&A ✨",
    hostName: "Emily Carter",
    hostAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    viewerCount: 2420,
    guestCount: 3,
    coinsEarned: 18500,
    durationMinutes: 47,
    tags: ["Music", "Chat", "Dating Advice"],
    status: "active",
    moderationScore: 98,
  },
  {
    id: "live_402",
    title: "Late night talks & deep connections 🌙",
    hostName: "Amara Bliss",
    hostAvatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
    viewerCount: 1840,
    guestCount: 4,
    coinsEarned: 14200,
    durationMinutes: 62,
    tags: ["Vibes", "Dating", "Chill"],
    status: "active",
    moderationScore: 95,
  },
  {
    id: "live_403",
    title: "Weekend energy only 🔥 Live from Lagos",
    hostName: "David King",
    hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    viewerCount: 960,
    guestCount: 2,
    coinsEarned: 7400,
    durationMinutes: 31,
    tags: ["Afrobeats", "Music", "Hangout"],
    status: "active",
    moderationScore: 92,
  },
];

export const MOCK_TICKETS: SupportTicket[] = [
  {
    id: "tkt_501",
    user: "Sarah James",
    email: "sarah.james@example.com",
    subject: "Gift Coin purchase credited but Live tray took 30s to update",
    category: "billing",
    priority: "medium",
    status: "in_progress",
    assignedTo: "Moderator Alex",
    updatedAt: "10m ago",
  },
  {
    id: "tkt_502",
    user: "Jayden Taylor",
    email: "jayden.t@outlook.com",
    subject: "ID document upload failing during government ID verification step",
    category: "verification",
    priority: "high",
    status: "open",
    assignedTo: "Unassigned",
    updatedAt: "35m ago",
  },
  {
    id: "tkt_503",
    user: "Tobi Adebayo",
    email: "tobi.a@domain.ng",
    subject: "Referral invite link not showing my custom tracking code",
    category: "dating_perks",
    priority: "low",
    status: "resolved",
    assignedTo: "Agent Sarah",
    updatedAt: "2h ago",
  },
];

