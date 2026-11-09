import type {
  DateRangePeriod,
  ChartDataPoint,
  RecentUserRecord,
  RecentMatchRecord,
  LiveStreamOverview,
  ModerationActionItem,
  AdminAuditRecord,
} from "../types/dashboard.types";

export interface DashboardMetricsSnapshot {
  period: DateRangePeriod;
  periodLabel: string;
  isDemoData: boolean;

  // 10 Primary KPIs
  totalUsers: { value: string; num: number; change: string; isPositive: boolean };
  activeUsers: { value: string; num: number; change: string; isPositive: boolean; type: string };
  newRegistrations: { value: string; num: number; change: string; isPositive: boolean };
  totalMatches: { value: string; num: number; change: string; isPositive: boolean };
  activeLiveSessions: { value: string; num: number; viewers: string; hosts: number };
  premiumSubscribers: { value: string; num: number; newPeriod: string; growth: string };
  monetaryRevenue: { value: string; num: number; currency: string; change: string; isPositive: boolean };
  pendingReports: { value: string; num: number; urgentCount: number; warning: boolean };
  pendingVerification: { value: string; num: number; photoRequests: number; idRequests: number };
  openSupportTickets: { value: string; num: number; urgentCount: number };

  // User Growth Chart Points
  growthChartData: ChartDataPoint[];

  // User Engagement Chart Points
  engagementChartData: { label: string; activeUsers: number; swipes: number; messages: number }[];

  // Revenue Diversification
  revenueBreakdown: {
    premiumRevenue: number;
    premiumPercentage: number;
    giftCoinsRevenue: number;
    giftCoinsPercentage: number;
    totalMonetaryRevenue: number;
    refundsReversals: number;
    netRevenue: number;
  };

  // Gift Coins vs Connection Points
  giftCoinsSummary: {
    packagesPurchased: number;
    monetaryValue: number;
    coinsIssued: number;
    coinsSpentInGifts: number;
    giftsSentCount: number;
  };

  connectionPointsSummary: {
    pointsIssued: number;
    pointsSpentOnPerks: number;
    referralBonusesIssuedCount: number;
    outstandingLiability: number;
  };

  // Referral Performance
  referralSummary: {
    totalInvitations: number;
    qualifiedReferrals: number;
    pendingVerification: number;
    rejectedReferrals: number;
    pointsAwarded: number;
    conversionRate: string;
  };

  // Recent Lists
  recentUsers: RecentUserRecord[];
  recentMatches: RecentMatchRecord[];
  activeStreams: LiveStreamOverview[];
  moderationQueue: ModerationActionItem[];
  auditLogs: AdminAuditRecord[];
}

export function getDashboardDataForPeriod(
  period: DateRangePeriod,
  customStart?: string,
  customEnd?: string
): DashboardMetricsSnapshot {
  let periodLabel = "Last 30 Days";
  let multiplier = 1;

  switch (period) {
    case "today":
      periodLabel = "Today (Realtime)";
      multiplier = 0.035;
      break;
    case "7d":
      periodLabel = "Last 7 Days";
      multiplier = 0.24;
      break;
    case "30d":
      periodLabel = "Last 30 Days";
      multiplier = 1.0;
      break;
    case "90d":
      periodLabel = "Last 90 Days";
      multiplier = 2.85;
      break;
    case "this_month":
      periodLabel = "This Month (Nov 2026)";
      multiplier = 0.28;
      break;
    case "last_month":
      periodLabel = "Last Month (Oct 2026)";
      multiplier = 0.95;
      break;
    case "custom":
      periodLabel = customStart && customEnd ? `${customStart} - ${customEnd}` : "Custom Range";
      multiplier = 0.65;
      break;
  }

  // Consistent mathematical scaling based on date range
  const totalUsersNum = 1284520;
  const newRegsNum = Math.round(41200 * multiplier);
  const activeUsersNum = period === "today" ? 148230 : Math.round(148230 * (0.95 + multiplier * 0.05));
  const matchesNum = Math.round(3892410 * multiplier);
  const revenueNum = Math.round(384950 * multiplier);
  const premiumSubsNum = 52840;
  const newSubsNum = Math.round(3420 * multiplier);

  // Generate date points for charts
  const growthChartData: ChartDataPoint[] = [];
  const engagementChartData: { label: string; activeUsers: number; swipes: number; messages: number }[] = [];

  const pointsCount = period === "today" ? 8 : period === "7d" ? 7 : 10;
  for (let i = 0; i < pointsCount; i++) {
    const dayLabel =
      period === "today"
        ? `${i * 3}:00`
        : period === "7d"
        ? `Day ${i + 1}`
        : `Week ${Math.floor(i / 2) + 1}.${(i % 2) + 1}`;

    const randNoise = (Math.sin(i * 1.5) + 1) * 0.15 + 0.85;

    growthChartData.push({
      label: dayLabel,
      value1: Math.round((newRegsNum / pointsCount) * randNoise),
      value2: Math.round(totalUsersNum - (pointsCount - i) * (newRegsNum / pointsCount)),
      date: `2026-11-${String(i + 1).padStart(2, "0")}`,
    });

    engagementChartData.push({
      label: dayLabel,
      activeUsers: Math.round(activeUsersNum * randNoise * 0.9),
      swipes: Math.round(148000 * randNoise * multiplier),
      messages: Math.round(92000 * randNoise * multiplier),
    });
  }

  const premiumShare = 0.812;
  const coinShare = 0.188;
  const premiumRev = Math.round(revenueNum * premiumShare);
  const coinRev = Math.round(revenueNum * coinShare);
  const refunds = Math.round(1240 * multiplier);

  return {
    period,
    periodLabel,
    isDemoData: true,

    // 10 Primary KPIs
    totalUsers: {
      value: totalUsersNum.toLocaleString(),
      num: totalUsersNum,
      change: "+12.4% vs prev period",
      isPositive: true,
    },
    activeUsers: {
      value: activeUsersNum.toLocaleString(),
      num: activeUsersNum,
      change: "+8.9% vs prev period",
      isPositive: true,
      type: period === "today" ? "Daily Active Users (DAU)" : "Active in Selected Window",
    },
    newRegistrations: {
      value: `+${newRegsNum.toLocaleString()}`,
      num: newRegsNum,
      change: "+15.3% growth",
      isPositive: true,
    },
    totalMatches: {
      value: matchesNum.toLocaleString(),
      num: matchesNum,
      change: "+18.2% mutual matches",
      isPositive: true,
    },
    activeLiveSessions: {
      value: "42",
      num: 42,
      viewers: "5,220 Live Viewers",
      hosts: 42,
    },
    premiumSubscribers: {
      value: premiumSubsNum.toLocaleString(),
      num: premiumSubsNum,
      newPeriod: `+${newSubsNum.toLocaleString()} in period`,
      growth: "+9.2% renewal",
    },
    monetaryRevenue: {
      value: `$${revenueNum.toLocaleString()}`,
      num: revenueNum,
      currency: "USD",
      change: "+18.4% gross revenue",
      isPositive: true,
    },
    pendingReports: {
      value: "18",
      num: 18,
      urgentCount: 4,
      warning: true,
    },
    pendingVerification: {
      value: "24",
      num: 24,
      photoRequests: 18,
      idRequests: 6,
    },
    openSupportTickets: {
      value: "9",
      num: 9,
      urgentCount: 2,
    },

    growthChartData,
    engagementChartData,

    revenueBreakdown: {
      premiumRevenue: premiumRev,
      premiumPercentage: 81.2,
      giftCoinsRevenue: coinRev,
      giftCoinsPercentage: 18.8,
      totalMonetaryRevenue: revenueNum,
      refundsReversals: refunds,
      netRevenue: revenueNum - refunds,
    },

    giftCoinsSummary: {
      packagesPurchased: Math.round(3820 * multiplier),
      monetaryValue: coinRev,
      coinsIssued: Math.round(12480000 * multiplier),
      coinsSpentInGifts: Math.round(10850000 * multiplier),
      giftsSentCount: Math.round(184200 * multiplier),
    },

    connectionPointsSummary: {
      pointsIssued: Math.round(741000 * multiplier),
      pointsSpentOnPerks: Math.round(418000 * multiplier),
      referralBonusesIssuedCount: Math.round(14820 * multiplier),
      outstandingLiability: 323000,
    },

    referralSummary: {
      totalInvitations: Math.round(23100 * multiplier),
      qualifiedReferrals: Math.round(14820 * multiplier),
      pendingVerification: Math.round(8280 * multiplier),
      rejectedReferrals: Math.round(920 * multiplier),
      pointsAwarded: Math.round(14820 * multiplier) * 50,
      conversionRate: "64.2%",
    },

    recentUsers: [
      {
        id: "usr_001",
        name: "Sarah James",
        username: "sarah_j",
        email: "sarah.james@example.com",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120",
        joinedAt: "Today, 14:22",
        isVerified: true,
        profileCompletion: 95,
        status: "active",
      },
      {
        id: "usr_002",
        name: "Emily Carter",
        username: "emily_c",
        email: "emily.carter@noblebond.org",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120",
        joinedAt: "Today, 11:05",
        isVerified: true,
        profileCompletion: 100,
        status: "active",
      },
      {
        id: "usr_003",
        name: "David King",
        username: "david_king",
        email: "david.king@domain.com",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120",
        joinedAt: "Yesterday, 19:40",
        isVerified: true,
        profileCompletion: 88,
        status: "active",
      },
      {
        id: "usr_004",
        name: "Zara Love",
        username: "zara_love",
        email: "zara.love@gmail.com",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120",
        joinedAt: "Yesterday, 16:15",
        isVerified: true,
        profileCompletion: 92,
        status: "active",
      },
      {
        id: "usr_008",
        name: "Lily Rose",
        username: "lily_r",
        email: "lily.rose@gmail.com",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120",
        joinedAt: "Nov 6, 2026",
        isVerified: false,
        profileCompletion: 60,
        status: "pending_verification",
      },
    ],

    recentMatches: [
      {
        id: "m_1",
        user1: { name: "Sarah James", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120" },
        user2: { name: "David King", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120" },
        matchedAt: "12m ago",
        compatibility: 96,
        status: "connected",
      },
      {
        id: "m_2",
        user1: { name: "Emily Carter", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120" },
        user2: { name: "Jayden Taylor", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120" },
        matchedAt: "45m ago",
        compatibility: 91,
        status: "chatting",
      },
      {
        id: "m_3",
        user1: { name: "Amara Bliss", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120" },
        user2: { name: "Zara Love", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120" },
        matchedAt: "2h ago",
        compatibility: 94,
        status: "connected",
      },
    ],

    activeStreams: [
      {
        id: "live_401",
        title: "Acoustic vibes & Sunday Q&A",
        hostName: "Emily Carter",
        hostAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120",
        viewers: 2420,
        guests: 3,
        duration: "47m",
        coinsEarned: 18500,
        status: "live",
        safetyScore: 98,
      },
      {
        id: "live_402",
        title: "Late night talks & deep connections",
        hostName: "Amara Bliss",
        hostAvatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120",
        viewers: 1840,
        guests: 4,
        duration: "1h 02m",
        coinsEarned: 14200,
        status: "live",
        safetyScore: 95,
      },
      {
        id: "live_403",
        title: "Weekend energy only - Live from Lagos",
        hostName: "David King",
        hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120",
        viewers: 960,
        guests: 2,
        duration: "31m",
        coinsEarned: 7400,
        status: "live",
        safetyScore: 92,
      },
    ],

    moderationQueue: [
      {
        id: "rep_901",
        category: "Harassment & Abusive Text",
        targetUser: "Alex Vance",
        targetAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120",
        submittedAt: "15m ago",
        priority: "critical",
        status: "open",
        assignedModerator: "Moderator Alex",
      },
      {
        id: "rep_902",
        category: "Impersonation / Fake Media",
        targetUser: "Celebrity_Clone",
        targetAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120",
        submittedAt: "42m ago",
        priority: "high",
        status: "investigating",
        assignedModerator: "Unassigned",
      },
      {
        id: "rep_903",
        category: "Inappropriate Stream Broadcast",
        targetUser: "Guest_9901",
        targetAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120",
        submittedAt: "2h ago",
        priority: "medium",
        status: "open",
        assignedModerator: "Senior Mod Lisa",
      },
    ],

    auditLogs: [
      {
        id: "aud_01",
        adminName: "Sarah Alexander",
        adminRole: "Super Admin",
        action: "Updated Referral Connection Points rule to 50 Pts",
        targetModule: "Referral Management",
        timestamp: "12m ago",
        status: "success",
      },
      {
        id: "aud_02",
        adminName: "Moderator Alex",
        adminRole: "Moderator",
        action: "Restricted chat permissions on account Alex Vance",
        targetModule: "Chat Management",
        timestamp: "35m ago",
        status: "warning",
      },
      {
        id: "aud_03",
        adminName: "Sarah Alexander",
        adminRole: "Super Admin",
        action: "Dispatched push announcement to 1.28M members",
        targetModule: "Notifications",
        timestamp: "1h 10m ago",
        status: "info",
      },
      {
        id: "aud_04",
        adminName: "Agent Sarah",
        adminRole: "Support Agent",
        action: "Resolved customer billing dispute #tkt_501",
        targetModule: "Customer Support",
        timestamp: "2h 15m ago",
        status: "success",
      },
    ],
  };
}
