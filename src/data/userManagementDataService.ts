// NobleBond Admin — User Management Data Service & State Store
// Local demo state with localStorage persistence, audit logging, zero emojis

import type {
  NobleUser,
  UserFilterState,
  UserSortCriteria,
  UserStatsKpis,
  AdminAuditEntry,
  UserTransaction,
} from "../types/userManagement.types";

const LOCAL_STORAGE_USERS_KEY = "noblebond_admin_users_v2";
const LOCAL_STORAGE_AUDIT_KEY = "noblebond_admin_audit_log_v2";

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

export function maskIp(ip: string): string {
  if (!ip) return "Unknown";
  const parts = ip.split(".");
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.***.***`;
  }
  // IPv6 fallback
  return ip.substring(0, 8) + ":****:****";
}

// 14 rich initial demo users representing realistic NobleBond members
const INITIAL_DEMO_USERS: NobleUser[] = [
  {
    id: "usr_nb_90421",
    firstName: "Amara",
    lastName: "Bliss",
    name: "Amara Bliss",
    username: "@amara_bliss",
    email: "amara.bliss@noblebond.com",
    phone: "+234 803 456 7890",
    dateOfBirth: "1998-05-14", // 28 years old
    gender: "female",
    pronouns: "she/her",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    country: "Nigeria",
    countryCode: "NG",
    stateRegion: "Lagos State",
    city: "Lagos (Victoria Island)",
    preferredLanguage: "English (United Kingdom)",
    deviceLanguage: "English (United Kingdom)",
    languageLocale: "en-GB",
    registrationDate: "2025-08-12T10:30:00Z",
    lastActive: "2026-11-09T09:42:00Z",
    status: "online",
    verification: {
      emailVerified: true,
      phoneVerified: true,
      photoVerified: true,
      identityVerified: true,
      status: "verified",
      verifiedDate: "2025-08-14T14:20:00Z",
    },
    datingStats: {
      likesSent: 342,
      likesReceived: 1284,
      superLikesSent: 28,
      additionalLikesAllowance: 15,
      matchesCount: 94,
      profileViews: 4120,
      conversationsCount: 68,
      liveHostedCount: 19,
      liveJoinedCount: 84,
      giftsSentCount: 38,
      giftsReceivedCount: 142,
    },
    devices: [
      {
        id: "dev_90421_1",
        brand: "Apple",
        model: "iPhone 17 Pro Max",
        platform: "ios",
        osVersion: "iOS 26.2",
        appVersion: "v2.8.4 (Build 412)",
        ipAddress: "197.210.84.112",
        ipCountry: "Nigeria",
        ipCity: "Lagos",
        vpnStatus: "not_detected",
        lastActive: "Just now",
        isCurrentSession: true,
        suspiciousActivity: false,
      },
      {
        id: "dev_90421_2",
        brand: "Apple",
        model: "iPad Pro 13 (M4)",
        platform: "ios",
        osVersion: "iPadOS 26.1",
        appVersion: "v2.8.2 (Build 408)",
        ipAddress: "197.210.84.115",
        ipCountry: "Nigeria",
        ipCity: "Lagos",
        vpnStatus: "not_detected",
        lastActive: "3 days ago",
        isCurrentSession: false,
        suspiciousActivity: false,
      },
    ],
    profile: {
      bio: "Creative director, art enthusiast, and world traveler. Believer in intentional connections, heartfelt laughter, and shared Sunday brunches.",
      prompts: [
        {
          question: "The key to my heart is",
          answer: "Deep late-night philosophical conversations and fresh floral bouquets.",
        },
        {
          question: "I know the best spot in town for",
          answer: "Authentic woodfired pizza and ocean sunset views on Victoria Island.",
        },
        {
          question: "My simple pleasures",
          answer: "Bossa nova vinyl records, pour-over coffee, and weekend gallery tours.",
        },
      ],
      relationshipGoals: "Long-term relationship",
      interests: ["Art Direction", "Contemporary Art", "Acoustic Music", "Fine Dining", "Pilates", "Photography"],
      occupation: "Creative Brand Director",
      education: "Master of Fine Arts, University of the Arts London",
      lifestyle: {
        smoking: "Never",
        drinking: "Socially on weekends",
        workout: "4-5 times a week",
        pets: "French Bulldog named Luca",
        starSign: "Taurus",
      },
      photos: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
      ],
      completionPercentage: 96,
      missingSections: [],
    },
    wallet: {
      giftCoins: 3450,
      giftCoinsPurchasedTotal: 5000,
      giftCoinsSpentTotal: 1550,
      giftsReceivedTotal: 18400,
      connectionPoints: 850,
      connectionPointsReferrals: 750,
      connectionPointsSpent: 100,
      connectionPointsAdjusted: 0,
    },
    premium: {
      isPremium: true,
      tier: "yearly",
      planName: "Yearly VIP ($59.88/yr)",
      status: "active",
      startDate: "2026-01-15T00:00:00Z",
      nextRenewalDate: "2027-01-15T00:00:00Z",
      expiryDate: "2027-01-15T00:00:00Z",
      price: "$59.88",
      currency: "USD",
      billingHistory: [
        {
          id: "inv_90421_01",
          date: "2026-01-15",
          plan: "Yearly VIP Plan",
          amount: "$59.88",
          status: "completed",
          paymentMethod: "Apple Pay (Visa ...8821)",
        },
      ],
    },
    referral: {
      referralCode: "AMARA26",
      totalReferred: 18,
      successful: 15,
      pending: 2,
      rejected: 1,
      pointsEarned: 750,
      history: [
        {
          id: "ref_90421_1",
          referredUser: "Zara Love",
          username: "@zara_love",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
          date: "2026-02-10",
          status: "qualified",
          rewardPoints: 50,
          note: "Phone & Email verified successfully",
        },
        {
          id: "ref_90421_2",
          referredUser: "Jayden Cole",
          username: "@jayden_cole",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
          date: "2026-02-28",
          status: "qualified",
          rewardPoints: 50,
          note: "Phone & Email verified successfully",
        },
      ],
    },
    moderation: {
      reportsAgainstCount: 0,
      reportsFiledCount: 1,
      warningsCount: 0,
      suspensionsCount: 0,
      currentStatus: "Clear (Exemplary Account Standing)",
      history: [],
      notes: [
        {
          id: "not_90421_1",
          date: "2026-03-01",
          author: "Admin Moderator Sarah",
          title: "VIP Host Verified",
          content: "User verified in person at NobleBond Lagos Creator Showcase. Exemplary community conduct.",
        },
      ],
    },
    activityTimeline: [
      {
        id: "act_90421_1",
        type: "live",
        title: "Hosted Live Broadcast",
        description: "Hosted 45-minute multi-guest live session 'Art & Romance in Lagos' with 1,240 concurrent viewers.",
        timestamp: "Today at 08:30 AM",
        badgeVariant: "primary",
      },
      {
        id: "act_90421_2",
        type: "wallet",
        title: "Virtual Gifts Received",
        description: "Received 3x Royal Crown gifts during live stream from verified supporters.",
        timestamp: "Today at 08:55 AM",
        badgeVariant: "success",
      },
      {
        id: "act_90421_3",
        type: "dating",
        title: "Mutual Match Confirmed",
        description: "Confirmed mutual match with @david_king.",
        timestamp: "Yesterday at 07:15 PM",
        badgeVariant: "info",
      },
      {
        id: "act_90421_4",
        type: "referral",
        title: "Referral Qualified",
        description: "Referred member completed phone verification. +50 Connection Points credited.",
        timestamp: "3 days ago",
        badgeVariant: "success",
      },
    ],
    matches: [
      {
        id: "mat_90421_1",
        matchedUserId: "usr_nb_90422",
        matchedUserName: "David King",
        matchedUserUsername: "@david_king",
        matchedUserAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
        matchedDate: "2026-11-08",
        status: "active",
        conversationId: "conv_amara_david",
      },
      {
        id: "mat_90421_2",
        matchedUserId: "usr_nb_90424",
        matchedUserName: "Jayden Cole",
        matchedUserUsername: "@jayden_cole",
        matchedUserAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
        matchedDate: "2026-10-24",
        status: "active",
        conversationId: "conv_amara_jayden",
      },
    ],
    transactions: [
      {
        id: "tx_90421_1",
        type: "coin_purchase",
        title: "Purchased 2,500 Gift Coins",
        amountCoins: 2500,
        amountFiat: "$24.99",
        timestamp: "2026-11-05 14:10",
        status: "completed",
        description: "Tier 3 Coin Package via Apple In-App Purchase",
        reference: "TXN-COIN-98124",
      },
      {
        id: "tx_90421_2",
        type: "gift_sent",
        title: "Sent Rose Bouquet Gift",
        amountCoins: -150,
        timestamp: "2026-11-06 20:30",
        status: "completed",
        description: "Gift sent to @lily_rose in live stream room",
        reference: "TXN-GIFT-44910",
      },
      {
        id: "tx_90421_3",
        type: "referral_reward",
        title: "Referral Reward Claimed",
        amountPoints: 50,
        timestamp: "2026-11-06 09:12",
        status: "completed",
        description: "NobleBond Invite & Earn verified qualification reward",
        reference: "TXN-REF-77124",
      },
    ],
  },
  {
    id: "usr_nb_90422",
    firstName: "David",
    lastName: "King",
    name: "David King",
    username: "@david_king",
    email: "david.king@innovate.ng",
    phone: "+234 802 334 1122",
    dateOfBirth: "1994-09-22", // 32 years old
    gender: "male",
    pronouns: "he/him",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    country: "Nigeria",
    countryCode: "NG",
    stateRegion: "Federal Capital Territory",
    city: "Abuja (Maitama)",
    preferredLanguage: "English (United Kingdom)",
    deviceLanguage: "English (United Kingdom)",
    languageLocale: "en-GB",
    registrationDate: "2025-06-18T12:00:00Z",
    lastActive: "2026-11-09T08:15:00Z",
    status: "active",
    verification: {
      emailVerified: true,
      phoneVerified: true,
      photoVerified: true,
      identityVerified: true,
      status: "verified",
      verifiedDate: "2025-06-20T16:00:00Z",
    },
    datingStats: {
      likesSent: 512,
      likesReceived: 980,
      superLikesSent: 45,
      additionalLikesAllowance: 10,
      matchesCount: 82,
      profileViews: 3200,
      conversationsCount: 54,
      liveHostedCount: 8,
      liveJoinedCount: 92,
      giftsSentCount: 64,
      giftsReceivedCount: 52,
    },
    devices: [
      {
        id: "dev_90422_1",
        brand: "Samsung",
        model: "Galaxy S25 Ultra",
        platform: "android",
        osVersion: "Android 16.0",
        appVersion: "v2.8.4 (Build 412)",
        ipAddress: "102.89.44.18",
        ipCountry: "Nigeria",
        ipCity: "Abuja",
        vpnStatus: "not_detected",
        lastActive: "1 hour ago",
        isCurrentSession: true,
        suspiciousActivity: false,
      },
    ],
    profile: {
      bio: "Tech entrepreneur, marathon runner, and jazz vinyl collector. Building Africa's digital future by day, experimenting in the kitchen by night.",
      prompts: [
        {
          question: "Together we could",
          answer: "Run early morning 10ks and explore hidden jazz speakeasies around the world.",
        },
        {
          question: "Best travel story",
          answer: "Hiking Mount Kilimanjaro and reaching Stella Point at sunrise on New Year's Day.",
        },
      ],
      relationshipGoals: "Marriage-minded",
      interests: ["Tech Startups", "Marathon Running", "Jazz", "African History", "Culinary Arts"],
      occupation: "Founder & Chief Executive Officer",
      education: "B.Sc. Computer Engineering, Obafemi Awolowo University",
      lifestyle: {
        smoking: "Never",
        drinking: "Occasionally",
        workout: "Daily runner",
        pets: "German Shepherd named Thor",
        starSign: "Virgo",
      },
      photos: [
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80",
      ],
      completionPercentage: 92,
      missingSections: ["Prompt 3"],
    },
    wallet: {
      giftCoins: 1200,
      giftCoinsPurchasedTotal: 3000,
      giftCoinsSpentTotal: 1800,
      giftsReceivedTotal: 4600,
      connectionPoints: 450,
      connectionPointsReferrals: 350,
      connectionPointsSpent: 50,
      connectionPointsAdjusted: 0,
    },
    premium: {
      isPremium: true,
      tier: "monthly",
      planName: "Monthly Premium ($9.99/mo)",
      status: "active",
      startDate: "2026-10-18T00:00:00Z",
      nextRenewalDate: "2026-11-18T00:00:00Z",
      expiryDate: "2026-11-18T00:00:00Z",
      price: "$9.99",
      currency: "USD",
      billingHistory: [
        {
          id: "inv_90422_01",
          date: "2026-10-18",
          plan: "Monthly Premium",
          amount: "$9.99",
          status: "completed",
          paymentMethod: "Mastercard (...4412)",
        },
      ],
    },
    referral: {
      referralCode: "DAVIDK22",
      totalReferred: 8,
      successful: 7,
      pending: 1,
      rejected: 0,
      pointsEarned: 350,
      history: [
        {
          id: "ref_90422_1",
          referredUser: "Tobi Bakare",
          username: "@tobi_bakare",
          avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80",
          date: "2026-04-12",
          status: "qualified",
          rewardPoints: 50,
          note: "Phone verified",
        },
      ],
    },
    moderation: {
      reportsAgainstCount: 0,
      reportsFiledCount: 0,
      warningsCount: 0,
      suspensionsCount: 0,
      currentStatus: "Clear",
      history: [],
      notes: [],
    },
    activityTimeline: [
      {
        id: "act_90422_1",
        type: "dating",
        title: "Mutual Match Confirmed",
        description: "Matched with @amara_bliss.",
        timestamp: "Yesterday at 07:15 PM",
        badgeVariant: "primary",
      },
    ],
    matches: [],
    transactions: [],
  },
  {
    id: "usr_nb_90423",
    firstName: "Zara",
    lastName: "Love",
    name: "Zara Love",
    username: "@zara_love",
    email: "zara.love@outlook.com",
    phone: "+1 212 555 8921",
    dateOfBirth: "2000-03-10", // 26 years old
    gender: "female",
    pronouns: "she/her",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    country: "United States",
    countryCode: "US",
    stateRegion: "New York",
    city: "New York (Manhattan)",
    preferredLanguage: "English (United States)",
    deviceLanguage: "English (United States)",
    languageLocale: "en-US",
    registrationDate: "2026-02-10T08:00:00Z",
    lastActive: "2026-11-09T09:12:00Z",
    status: "online",
    verification: {
      emailVerified: true,
      phoneVerified: true,
      photoVerified: true,
      identityVerified: false,
      status: "photo_verified",
      verifiedDate: "2026-02-11T11:00:00Z",
    },
    datingStats: {
      likesSent: 180,
      likesReceived: 1840,
      superLikesSent: 12,
      additionalLikesAllowance: 5,
      matchesCount: 124,
      profileViews: 6540,
      conversationsCount: 88,
      liveHostedCount: 34,
      liveJoinedCount: 140,
      giftsSentCount: 80,
      giftsReceivedCount: 420,
    },
    devices: [
      {
        id: "dev_90423_1",
        brand: "Apple",
        model: "iPhone 16 Pro",
        platform: "ios",
        osVersion: "iOS 25.4",
        appVersion: "v2.8.4 (Build 412)",
        ipAddress: "72.229.28.185",
        ipCountry: "United States",
        ipCity: "New York",
        vpnStatus: "not_detected",
        lastActive: "5 mins ago",
        isCurrentSession: true,
        suspiciousActivity: false,
      },
    ],
    profile: {
      bio: "Fashion stylist, content creator, and lover of city rooftop sunsets. Seeking someone with ambition, style, and kind energy.",
      prompts: [
        {
          question: "My golden rule",
          answer: "Treat everyone with warmth and never skip dessert.",
        },
      ],
      relationshipGoals: "Long-term relationship",
      interests: ["Fashion", "Content Creation", "Travel", "Sushi", "Yoga"],
      occupation: "Senior Fashion Stylist",
      education: "B.A. Fashion Merchandising, Parsons School of Design",
      lifestyle: {
        smoking: "Never",
        drinking: "Socially",
        workout: "Pilates 3x/week",
        pets: "Poodle mix named Coco",
        starSign: "Pisces",
      },
      photos: [
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
      ],
      completionPercentage: 88,
      missingSections: ["Prompts"],
    },
    wallet: {
      giftCoins: 5800,
      giftCoinsPurchasedTotal: 8000,
      giftCoinsSpentTotal: 2200,
      giftsReceivedTotal: 34000,
      connectionPoints: 1200,
      connectionPointsReferrals: 1100,
      connectionPointsSpent: 200,
      connectionPointsAdjusted: 0,
    },
    premium: {
      isPremium: true,
      tier: "yearly",
      planName: "Yearly VIP ($59.88/yr)",
      status: "active",
      startDate: "2026-02-12T00:00:00Z",
      nextRenewalDate: "2027-02-12T00:00:00Z",
      expiryDate: "2027-02-12T00:00:00Z",
      price: "$59.88",
      currency: "USD",
      billingHistory: [],
    },
    referral: {
      referralCode: "ZARA99",
      totalReferred: 26,
      successful: 22,
      pending: 3,
      rejected: 1,
      pointsEarned: 1100,
      history: [],
    },
    moderation: {
      reportsAgainstCount: 1,
      reportsFiledCount: 2,
      warningsCount: 0,
      suspensionsCount: 0,
      currentStatus: "Clear",
      history: [],
      notes: [],
    },
    activityTimeline: [],
    matches: [],
    transactions: [],
  },
  {
    id: "usr_nb_90424",
    firstName: "Jayden",
    lastName: "Cole",
    name: "Jayden Cole",
    username: "@jayden_cole",
    email: "jayden.cole@studiox.co.uk",
    phone: "+44 7700 900144",
    dateOfBirth: "1996-11-04", // 30 years old
    gender: "male",
    pronouns: "he/him",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    country: "United Kingdom",
    countryCode: "GB",
    stateRegion: "Greater London",
    city: "London (Shoreditch)",
    preferredLanguage: "English (United Kingdom)",
    deviceLanguage: "English (United Kingdom)",
    languageLocale: "en-GB",
    registrationDate: "2025-11-20T14:15:00Z",
    lastActive: "2026-11-08T22:30:00Z",
    status: "active",
    verification: {
      emailVerified: true,
      phoneVerified: true,
      photoVerified: true,
      identityVerified: false,
      status: "verified",
      verifiedDate: "2025-11-21T09:00:00Z",
    },
    datingStats: {
      likesSent: 420,
      likesReceived: 810,
      superLikesSent: 30,
      additionalLikesAllowance: 0,
      matchesCount: 62,
      profileViews: 2890,
      conversationsCount: 41,
      liveHostedCount: 14,
      liveJoinedCount: 49,
      giftsSentCount: 30,
      giftsReceivedCount: 95,
    },
    devices: [
      {
        id: "dev_90424_1",
        brand: "Google Pixel",
        model: "Pixel 10 Pro",
        platform: "android",
        osVersion: "Android 16.0",
        appVersion: "v2.8.4 (Build 412)",
        ipAddress: "86.14.92.110",
        ipCountry: "United Kingdom",
        ipCity: "London",
        vpnStatus: "not_detected",
        lastActive: "Yesterday",
        isCurrentSession: true,
        suspiciousActivity: false,
      },
    ],
    profile: {
      bio: "Music producer & DJ based in East London. Vinyl hoarder, coffee nerd, and lover of rainy autumn Sundays.",
      prompts: [
        {
          question: "Best concert I have ever seen",
          answer: "Miles Davis archives listening session in Brixton.",
        },
      ],
      relationshipGoals: "Dating with intent",
      interests: ["Electronic Music", "Record Collecting", "Photography", "Cycling"],
      occupation: "Record Producer",
      education: "B.Mus. Sound Design, Goldsmiths University",
      lifestyle: {
        smoking: "No",
        drinking: "Yes, craft beer",
        workout: "Cycling commute",
        pets: "None",
        starSign: "Scorpio",
      },
      photos: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      ],
      completionPercentage: 85,
      missingSections: ["Prompts"],
    },
    wallet: {
      giftCoins: 950,
      giftCoinsPurchasedTotal: 2000,
      giftCoinsSpentTotal: 1050,
      giftsReceivedTotal: 7200,
      connectionPoints: 200,
      connectionPointsReferrals: 200,
      connectionPointsSpent: 0,
      connectionPointsAdjusted: 0,
    },
    premium: {
      isPremium: true,
      tier: "monthly",
      planName: "Monthly Premium ($9.99/mo)",
      status: "active",
      startDate: "2026-10-01T00:00:00Z",
      nextRenewalDate: "2026-12-01T00:00:00Z",
      expiryDate: "2026-12-01T00:00:00Z",
      price: "$9.99",
      currency: "USD",
      billingHistory: [],
    },
    referral: {
      referralCode: "JAYDENLONDON",
      totalReferred: 5,
      successful: 4,
      pending: 1,
      rejected: 0,
      pointsEarned: 200,
      history: [],
    },
    moderation: {
      reportsAgainstCount: 0,
      reportsFiledCount: 0,
      warningsCount: 0,
      suspensionsCount: 0,
      currentStatus: "Clear",
      history: [],
      notes: [],
    },
    activityTimeline: [],
    matches: [],
    transactions: [],
  },
  {
    id: "usr_nb_90425",
    firstName: "Lily",
    lastName: "Rose",
    name: "Lily Rose",
    username: "@lily_rose",
    email: "lily.rose@gmail.com",
    phone: "+234 814 200 8899",
    dateOfBirth: "1999-07-19", // 27 years old
    gender: "female",
    pronouns: "she/her",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    country: "Nigeria",
    countryCode: "NG",
    stateRegion: "Lagos State",
    city: "Lagos (Lekki Phase 1)",
    preferredLanguage: "English (United Kingdom)",
    deviceLanguage: "English (United Kingdom)",
    languageLocale: "en-GB",
    registrationDate: "2026-01-05T09:20:00Z",
    lastActive: "2026-11-09T07:45:00Z",
    status: "active",
    verification: {
      emailVerified: true,
      phoneVerified: true,
      photoVerified: true,
      identityVerified: false,
      status: "verified",
      verifiedDate: "2026-01-06T15:00:00Z",
    },
    datingStats: {
      likesSent: 210,
      likesReceived: 1450,
      superLikesSent: 18,
      additionalLikesAllowance: 0,
      matchesCount: 98,
      profileViews: 4800,
      conversationsCount: 72,
      liveHostedCount: 22,
      liveJoinedCount: 65,
      giftsSentCount: 20,
      giftsReceivedCount: 280,
    },
    devices: [
      {
        id: "dev_90425_1",
        brand: "Apple",
        model: "iPhone 15",
        platform: "ios",
        osVersion: "iOS 26.0",
        appVersion: "v2.8.4 (Build 412)",
        ipAddress: "197.210.45.67",
        ipCountry: "Nigeria",
        ipCity: "Lagos",
        vpnStatus: "not_detected",
        lastActive: "2 hours ago",
        isCurrentSession: true,
        suspiciousActivity: false,
      },
    ],
    profile: {
      bio: "Interior architect with an eye for minimalist beauty. Love quiet beach retreats and great conversation over good food.",
      prompts: [
        {
          question: "My dream home looks like",
          answer: "Floor-to-ceiling glass, mid-century teakwood, and a sunlit courtyard.",
        },
      ],
      relationshipGoals: "Long-term relationship",
      interests: ["Interior Design", "Architecture", "Beach Walks", "Baking", "Plants"],
      occupation: "Interior Architect",
      education: "B.Sc. Architecture, Covenant University",
      lifestyle: {
        smoking: "Never",
        drinking: "Wine only",
        workout: "Yoga & Pilates",
        pets: "Calico Cat",
        starSign: "Cancer",
      },
      photos: [
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      ],
      completionPercentage: 90,
      missingSections: [],
    },
    wallet: {
      giftCoins: 2100,
      giftCoinsPurchasedTotal: 3000,
      giftCoinsSpentTotal: 900,
      giftsReceivedTotal: 19500,
      connectionPoints: 600,
      connectionPointsReferrals: 500,
      connectionPointsSpent: 0,
      connectionPointsAdjusted: 0,
    },
    premium: {
      isPremium: true,
      tier: "yearly",
      planName: "Yearly VIP ($59.88/yr)",
      status: "active",
      startDate: "2026-01-10T00:00:00Z",
      nextRenewalDate: "2027-01-10T00:00:00Z",
      expiryDate: "2027-01-10T00:00:00Z",
      price: "$59.88",
      currency: "USD",
      billingHistory: [],
    },
    referral: {
      referralCode: "LILYLEKKI",
      totalReferred: 12,
      successful: 10,
      pending: 2,
      rejected: 0,
      pointsEarned: 500,
      history: [],
    },
    moderation: {
      reportsAgainstCount: 0,
      reportsFiledCount: 1,
      warningsCount: 0,
      suspensionsCount: 0,
      currentStatus: "Clear",
      history: [],
      notes: [],
    },
    activityTimeline: [],
    matches: [],
    transactions: [],
  },
  {
    id: "usr_nb_90426",
    firstName: "Tobi",
    lastName: "Bakare",
    name: "Tobi Bakare",
    username: "@tobi_bakare",
    email: "tobi.bakare@gmail.com",
    phone: "+234 818 777 9900",
    dateOfBirth: "1997-04-12", // 29 years old
    gender: "male",
    pronouns: "he/him",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
    country: "Nigeria",
    countryCode: "NG",
    stateRegion: "Lagos State",
    city: "Lagos (Ikoyi)",
    preferredLanguage: "English (United Kingdom)",
    deviceLanguage: "English (United Kingdom)",
    languageLocale: "en-GB",
    registrationDate: "2026-04-12T11:40:00Z",
    lastActive: "2026-11-07T14:10:00Z",
    status: "active",
    verification: {
      emailVerified: true,
      phoneVerified: true,
      photoVerified: false,
      identityVerified: false,
      status: "phone_only",
      verifiedDate: "2026-04-12T11:55:00Z",
    },
    datingStats: {
      likesSent: 160,
      likesReceived: 340,
      superLikesSent: 6,
      additionalLikesAllowance: 0,
      matchesCount: 28,
      profileViews: 1100,
      conversationsCount: 19,
      liveHostedCount: 2,
      liveJoinedCount: 30,
      giftsSentCount: 14,
      giftsReceivedCount: 18,
    },
    devices: [
      {
        id: "dev_90426_1",
        brand: "Tecno",
        model: "Camon 30 Premier",
        platform: "android",
        osVersion: "Android 15.0",
        appVersion: "v2.8.2 (Build 408)",
        ipAddress: "105.112.98.24",
        ipCountry: "Nigeria",
        ipCity: "Lagos",
        vpnStatus: "not_detected",
        lastActive: "2 days ago",
        isCurrentSession: false,
        suspiciousActivity: false,
      },
    ],
    profile: {
      bio: "Fitness trainer and health coach. Spreading good vibes, positive energy, and clean nutrition.",
      prompts: [
        {
          question: "My ideal Sunday",
          answer: "Morning beach jog, healthy smoothie, and family dinner.",
        },
      ],
      relationshipGoals: "Open to possibilities",
      interests: ["Fitness", "Nutrition", "Calisthenics", "Afrobeats"],
      occupation: "Certified Fitness Coach",
      education: "B.Sc. Human Kinetics, University of Lagos",
      lifestyle: {
        smoking: "Never",
        drinking: "Never",
        workout: "Daily",
        pets: "None",
        starSign: "Aries",
      },
      photos: [
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
      ],
      completionPercentage: 74,
      missingSections: ["Photo verification", "Prompts"],
    },
    wallet: {
      giftCoins: 300,
      giftCoinsPurchasedTotal: 500,
      giftCoinsSpentTotal: 200,
      giftsReceivedTotal: 900,
      connectionPoints: 100,
      connectionPointsReferrals: 100,
      connectionPointsSpent: 0,
      connectionPointsAdjusted: 0,
    },
    premium: {
      isPremium: false,
      tier: "free",
      planName: "Free Member",
      status: "none",
      startDate: "",
      nextRenewalDate: "",
      expiryDate: "",
      price: "$0.00",
      currency: "USD",
      billingHistory: [],
    },
    referral: {
      referralCode: "TOBIFIT",
      totalReferred: 3,
      successful: 2,
      pending: 1,
      rejected: 0,
      pointsEarned: 100,
      history: [],
    },
    moderation: {
      reportsAgainstCount: 0,
      reportsFiledCount: 0,
      warningsCount: 0,
      suspensionsCount: 0,
      currentStatus: "Clear",
      history: [],
      notes: [],
    },
    activityTimeline: [],
    matches: [],
    transactions: [],
  },
  {
    id: "usr_nb_90427",
    firstName: "Marcus",
    lastName: "Sterling",
    name: "Marcus Sterling",
    username: "@marcus_sterling",
    email: "m.sterling@sterlingholdings.ca",
    phone: "+1 416 555 0192",
    dateOfBirth: "1988-12-03", // 37 years old
    gender: "male",
    pronouns: "he/him",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    country: "Canada",
    countryCode: "CA",
    stateRegion: "Ontario",
    city: "Toronto (Yorkville)",
    preferredLanguage: "English (United States)",
    deviceLanguage: "English (Canada)",
    languageLocale: "en-CA",
    registrationDate: "2025-05-10T16:00:00Z",
    lastActive: "2026-11-09T04:20:00Z",
    status: "active",
    verification: {
      emailVerified: true,
      phoneVerified: true,
      photoVerified: true,
      identityVerified: true,
      status: "verified",
      verifiedDate: "2025-05-12T10:00:00Z",
    },
    datingStats: {
      likesSent: 680,
      likesReceived: 1120,
      superLikesSent: 80,
      additionalLikesAllowance: 25,
      matchesCount: 110,
      profileViews: 5100,
      conversationsCount: 65,
      liveHostedCount: 12,
      liveJoinedCount: 110,
      giftsSentCount: 120,
      giftsReceivedCount: 45,
    },
    devices: [
      {
        id: "dev_90427_1",
        brand: "Apple",
        model: "iPhone 17 Pro",
        platform: "ios",
        osVersion: "iOS 26.1",
        appVersion: "v2.8.4 (Build 412)",
        ipAddress: "142.114.19.88",
        ipCountry: "Canada",
        ipCity: "Toronto",
        vpnStatus: "not_detected",
        lastActive: "5 hours ago",
        isCurrentSession: true,
        suspiciousActivity: false,
      },
    ],
    profile: {
      bio: "Private equity partner and philanthropist. Splitting time between Toronto, London, and Cape Town.",
      prompts: [
        {
          question: "A non-negotiable for me is",
          answer: "Emotional maturity, intellectual curiosity, and generosity of spirit.",
        },
      ],
      relationshipGoals: "Marriage-minded",
      interests: ["Private Equity", "Skiing", "Classical Music", "Philanthropy", "Fine Wines"],
      occupation: "Managing Partner",
      education: "MBA, Rotman School of Management",
      lifestyle: {
        smoking: "No",
        drinking: "Wine enthusiast",
        workout: "Personal trainer 4x/week",
        pets: "Golden Retriever named Winston",
        starSign: "Sagittarius",
      },
      photos: [
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
      ],
      completionPercentage: 94,
      missingSections: [],
    },
    wallet: {
      giftCoins: 8400,
      giftCoinsPurchasedTotal: 15000,
      giftCoinsSpentTotal: 6600,
      giftsReceivedTotal: 2100,
      connectionPoints: 1500,
      connectionPointsReferrals: 1500,
      connectionPointsSpent: 200,
      connectionPointsAdjusted: 0,
    },
    premium: {
      isPremium: true,
      tier: "yearly",
      planName: "Yearly VIP ($59.88/yr)",
      status: "active",
      startDate: "2026-05-10T00:00:00Z",
      nextRenewalDate: "2027-05-10T00:00:00Z",
      expiryDate: "2027-05-10T00:00:00Z",
      price: "$59.88",
      currency: "USD",
      billingHistory: [],
    },
    referral: {
      referralCode: "STERLING",
      totalReferred: 34,
      successful: 30,
      pending: 4,
      rejected: 0,
      pointsEarned: 1500,
      history: [],
    },
    moderation: {
      reportsAgainstCount: 0,
      reportsFiledCount: 0,
      warningsCount: 0,
      suspensionsCount: 0,
      currentStatus: "Clear",
      history: [],
      notes: [],
    },
    activityTimeline: [],
    matches: [],
    transactions: [],
  },
  {
    id: "usr_nb_90428",
    firstName: "Chloe",
    lastName: "Dupont",
    name: "Chloe Dupont",
    username: "@chloe_paris",
    email: "chloe.dupont@artparis.fr",
    phone: "+33 6 12 34 56 78",
    dateOfBirth: "1997-02-14", // 29 years old
    gender: "female",
    pronouns: "she/her",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    country: "France",
    countryCode: "FR",
    stateRegion: "Ile-de-France",
    city: "Paris (Le Marais)",
    preferredLanguage: "French",
    deviceLanguage: "French",
    languageLocale: "fr-FR",
    registrationDate: "2026-02-14T10:00:00Z",
    lastActive: "2026-11-09T08:50:00Z",
    status: "active",
    verification: {
      emailVerified: true,
      phoneVerified: true,
      photoVerified: true,
      identityVerified: false,
      status: "verified",
      verifiedDate: "2026-02-15T12:00:00Z",
    },
    datingStats: {
      likesSent: 280,
      likesReceived: 1100,
      superLikesSent: 15,
      additionalLikesAllowance: 0,
      matchesCount: 76,
      profileViews: 3900,
      conversationsCount: 48,
      liveHostedCount: 16,
      liveJoinedCount: 52,
      giftsSentCount: 22,
      giftsReceivedCount: 190,
    },
    devices: [
      {
        id: "dev_90428_1",
        brand: "Apple",
        model: "iPhone 16",
        platform: "ios",
        osVersion: "iOS 25.4",
        appVersion: "v2.8.4 (Build 412)",
        ipAddress: "82.64.120.44",
        ipCountry: "France",
        ipCity: "Paris",
        vpnStatus: "not_detected",
        lastActive: "1 hour ago",
        isCurrentSession: true,
        suspiciousActivity: false,
      },
    ],
    profile: {
      bio: "Art curator in Paris. Passionate about surrealism, vintage photography, and espresso on canal terraces.",
      prompts: [
        {
          question: "Best date idea",
          answer: "Private night tour of the Musee d'Orsay followed by secret cocktail lounge.",
        },
      ],
      relationshipGoals: "Long-term relationship",
      interests: ["Art Curating", "Vintage Film", "Architecture", "Literature", "Travel"],
      occupation: "Museum Associate Curator",
      education: "Master in Art History, Sorbonne University",
      lifestyle: {
        smoking: "Occasionally",
        drinking: "Red wine",
        workout: "Bicycle throughout Paris",
        pets: "None",
        starSign: "Aquarius",
      },
      photos: [
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
      ],
      completionPercentage: 89,
      missingSections: [],
    },
    wallet: {
      giftCoins: 1450,
      giftCoinsPurchasedTotal: 2500,
      giftCoinsSpentTotal: 1050,
      giftsReceivedTotal: 12400,
      connectionPoints: 350,
      connectionPointsReferrals: 350,
      connectionPointsSpent: 50,
      connectionPointsAdjusted: 0,
    },
    premium: {
      isPremium: true,
      tier: "monthly",
      planName: "Monthly Premium ($9.99/mo)",
      status: "active",
      startDate: "2026-03-01T00:00:00Z",
      nextRenewalDate: "2026-12-01T00:00:00Z",
      expiryDate: "2026-12-01T00:00:00Z",
      price: "$9.99",
      currency: "USD",
      billingHistory: [],
    },
    referral: {
      referralCode: "CHLOEPARIS",
      totalReferred: 9,
      successful: 7,
      pending: 2,
      rejected: 0,
      pointsEarned: 350,
      history: [],
    },
    moderation: {
      reportsAgainstCount: 0,
      reportsFiledCount: 0,
      warningsCount: 0,
      suspensionsCount: 0,
      currentStatus: "Clear",
      history: [],
      notes: [],
    },
    activityTimeline: [],
    matches: [],
    transactions: [],
  },
  {
    id: "usr_nb_90429",
    firstName: "Kofi",
    lastName: "Mensah",
    name: "Kofi Mensah",
    username: "@kofi_mensah",
    email: "kofi.mensah@ghanafintech.com",
    phone: "+233 24 555 7890",
    dateOfBirth: "1993-08-30", // 33 years old
    gender: "male",
    pronouns: "he/him",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    country: "Ghana",
    countryCode: "GH",
    stateRegion: "Greater Accra",
    city: "Accra (Airport Residential)",
    preferredLanguage: "English (United Kingdom)",
    deviceLanguage: "English (United Kingdom)",
    languageLocale: "en-GB",
    registrationDate: "2025-09-04T15:30:00Z",
    lastActive: "2026-11-09T09:30:00Z",
    status: "online",
    verification: {
      emailVerified: true,
      phoneVerified: true,
      photoVerified: true,
      identityVerified: true,
      status: "verified",
      verifiedDate: "2025-09-06T10:00:00Z",
    },
    datingStats: {
      likesSent: 390,
      likesReceived: 740,
      superLikesSent: 35,
      additionalLikesAllowance: 0,
      matchesCount: 58,
      profileViews: 2600,
      conversationsCount: 42,
      liveHostedCount: 5,
      liveJoinedCount: 44,
      giftsSentCount: 40,
      giftsReceivedCount: 30,
    },
    devices: [
      {
        id: "dev_90429_1",
        brand: "Samsung",
        model: "Galaxy S24+",
        platform: "android",
        osVersion: "Android 15.0",
        appVersion: "v2.8.4 (Build 412)",
        ipAddress: "154.160.22.90",
        ipCountry: "Ghana",
        ipCity: "Accra",
        vpnStatus: "not_detected",
        lastActive: "Just now",
        isCurrentSession: true,
        suspiciousActivity: false,
      },
    ],
    profile: {
      bio: "Fintech product lead, amateur saxophonist, and proud Pan-African. Believer in intentionality and warmth.",
      prompts: [
        {
          question: "You should leave a comment if",
          answer: "You love highlife music and exploring roadside food gems.",
        },
      ],
      relationshipGoals: "Marriage-minded",
      interests: ["Fintech", "Saxophone", "Highlife", "Travel in West Africa", "Tennis"],
      occupation: "Lead Product Manager",
      education: "M.Sc. Information Systems, Ashesi University",
      lifestyle: {
        smoking: "Never",
        drinking: "Socially",
        workout: "Tennis twice a week",
        pets: "None",
        starSign: "Virgo",
      },
      photos: [
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
      ],
      completionPercentage: 91,
      missingSections: [],
    },
    wallet: {
      giftCoins: 800,
      giftCoinsPurchasedTotal: 1500,
      giftCoinsSpentTotal: 700,
      giftsReceivedTotal: 2400,
      connectionPoints: 300,
      connectionPointsReferrals: 300,
      connectionPointsSpent: 50,
      connectionPointsAdjusted: 0,
    },
    premium: {
      isPremium: true,
      tier: "monthly",
      planName: "Monthly Premium ($9.99/mo)",
      status: "active",
      startDate: "2026-09-04T00:00:00Z",
      nextRenewalDate: "2026-12-04T00:00:00Z",
      expiryDate: "2026-12-04T00:00:00Z",
      price: "$9.99",
      currency: "USD",
      billingHistory: [],
    },
    referral: {
      referralCode: "KOFIACCRA",
      totalReferred: 7,
      successful: 6,
      pending: 1,
      rejected: 0,
      pointsEarned: 300,
      history: [],
    },
    moderation: {
      reportsAgainstCount: 0,
      reportsFiledCount: 0,
      warningsCount: 0,
      suspensionsCount: 0,
      currentStatus: "Clear",
      history: [],
      notes: [],
    },
    activityTimeline: [],
    matches: [],
    transactions: [],
  },
  {
    id: "usr_nb_90430",
    firstName: "Elena",
    lastName: "Volkov",
    name: "Elena Volkov",
    username: "@elena_v",
    email: "elena.volkov@berlindesign.de",
    phone: "+49 30 901820",
    dateOfBirth: "1995-10-18", // 31 years old
    gender: "female",
    pronouns: "she/her",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    country: "Germany",
    countryCode: "DE",
    stateRegion: "Berlin",
    city: "Berlin (Mitte)",
    preferredLanguage: "German",
    deviceLanguage: "German",
    languageLocale: "de-DE",
    registrationDate: "2026-03-20T13:45:00Z",
    lastActive: "2026-11-09T07:10:00Z",
    status: "active",
    verification: {
      emailVerified: true,
      phoneVerified: true,
      photoVerified: true,
      identityVerified: false,
      status: "verified",
      verifiedDate: "2026-03-21T18:00:00Z",
    },
    datingStats: {
      likesSent: 310,
      likesReceived: 920,
      superLikesSent: 20,
      additionalLikesAllowance: 0,
      matchesCount: 64,
      profileViews: 3100,
      conversationsCount: 39,
      liveHostedCount: 6,
      liveJoinedCount: 38,
      giftsSentCount: 15,
      giftsReceivedCount: 120,
    },
    devices: [
      {
        id: "dev_90430_1",
        brand: "Google Pixel",
        model: "Pixel 9",
        platform: "android",
        osVersion: "Android 15.0",
        appVersion: "v2.8.4 (Build 412)",
        ipAddress: "91.64.180.20",
        ipCountry: "Germany",
        ipCity: "Berlin",
        vpnStatus: "not_detected",
        lastActive: "2 hours ago",
        isCurrentSession: true,
        suspiciousActivity: false,
      },
    ],
    profile: {
      bio: "Product designer in Berlin. Modernist architecture, cold brew on sunny balconies, and electronic record shops.",
      prompts: [
        {
          question: "I geek out on",
          answer: "Typography, Bauhaus history, and clean UI components.",
        },
      ],
      relationshipGoals: "Long-term relationship",
      interests: ["Product Design", "Bauhaus", "Cycling", "Coffee", "Cinema"],
      occupation: "Principal UI/UX Designer",
      education: "Diploma in Design, UdK Berlin",
      lifestyle: {
        smoking: "No",
        drinking: "Socially",
        workout: "Bouldering 3x/week",
        pets: "None",
        starSign: "Libra",
      },
      photos: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      ],
      completionPercentage: 88,
      missingSections: [],
    },
    wallet: {
      giftCoins: 650,
      giftCoinsPurchasedTotal: 1000,
      giftCoinsSpentTotal: 350,
      giftsReceivedTotal: 7800,
      connectionPoints: 250,
      connectionPointsReferrals: 250,
      connectionPointsSpent: 0,
      connectionPointsAdjusted: 0,
    },
    premium: {
      isPremium: true,
      tier: "weekly",
      planName: "Weekly Pass ($4.99/wk)",
      status: "active",
      startDate: "2026-11-03T00:00:00Z",
      nextRenewalDate: "2026-11-10T00:00:00Z",
      expiryDate: "2026-11-10T00:00:00Z",
      price: "$4.99",
      currency: "USD",
      billingHistory: [],
    },
    referral: {
      referralCode: "ELENABERLIN",
      totalReferred: 6,
      successful: 5,
      pending: 1,
      rejected: 0,
      pointsEarned: 250,
      history: [],
    },
    moderation: {
      reportsAgainstCount: 0,
      reportsFiledCount: 0,
      warningsCount: 0,
      suspensionsCount: 0,
      currentStatus: "Clear",
      history: [],
      notes: [],
    },
    activityTimeline: [],
    matches: [],
    transactions: [],
  },
  {
    id: "usr_nb_90431",
    firstName: "Tessy",
    lastName: "Boateng",
    name: "Tessy Boateng",
    username: "@tessy_b",
    email: "tessy.boateng@accralive.com",
    phone: "+233 20 889 1234",
    dateOfBirth: "2001-06-25", // 25 years old
    gender: "female",
    pronouns: "she/her",
    avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80",
    country: "Ghana",
    countryCode: "GH",
    stateRegion: "Greater Accra",
    city: "Accra (Osu)",
    preferredLanguage: "English (United Kingdom)",
    deviceLanguage: "English (United Kingdom)",
    languageLocale: "en-GB",
    registrationDate: "2026-05-18T14:10:00Z",
    lastActive: "2026-11-09T09:15:00Z",
    status: "online",
    verification: {
      emailVerified: true,
      phoneVerified: true,
      photoVerified: true,
      identityVerified: false,
      status: "verified",
      verifiedDate: "2026-05-19T11:00:00Z",
    },
    datingStats: {
      likesSent: 190,
      likesReceived: 1620,
      superLikesSent: 10,
      additionalLikesAllowance: 0,
      matchesCount: 88,
      profileViews: 5200,
      conversationsCount: 58,
      liveHostedCount: 28,
      liveJoinedCount: 95,
      giftsSentCount: 45,
      giftsReceivedCount: 310,
    },
    devices: [
      {
        id: "dev_90431_1",
        brand: "Apple",
        model: "iPhone 15 Pro",
        platform: "ios",
        osVersion: "iOS 26.0",
        appVersion: "v2.8.4 (Build 412)",
        ipAddress: "154.160.88.14",
        ipCountry: "Ghana",
        ipCity: "Accra",
        vpnStatus: "not_detected",
        lastActive: "Just now",
        isCurrentSession: true,
        suspiciousActivity: false,
      },
    ],
    profile: {
      bio: "Broadcaster, lifestyle host, and foodie. Here for genuine smiles, positive vibrations, and meaningful connections.",
      prompts: [
        {
          question: "I am known for",
          answer: "My infectious laugh and finding the best jollof rice in West Africa.",
        },
      ],
      relationshipGoals: "Long-term relationship",
      interests: ["Broadcasting", "Media", "Afrobeats", "Cooking", "Travel"],
      occupation: "Radio & TV Presenter",
      education: "B.A. Communication Studies, GIJ Accra",
      lifestyle: {
        smoking: "Never",
        drinking: "Socially",
        workout: "Pilates & dance",
        pets: "None",
        starSign: "Cancer",
      },
      photos: [
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
      ],
      completionPercentage: 92,
      missingSections: [],
    },
    wallet: {
      giftCoins: 3100,
      giftCoinsPurchasedTotal: 4500,
      giftCoinsSpentTotal: 1400,
      giftsReceivedTotal: 24800,
      connectionPoints: 900,
      connectionPointsReferrals: 850,
      connectionPointsSpent: 50,
      connectionPointsAdjusted: 0,
    },
    premium: {
      isPremium: true,
      tier: "yearly",
      planName: "Yearly VIP ($59.88/yr)",
      status: "active",
      startDate: "2026-05-20T00:00:00Z",
      nextRenewalDate: "2027-05-20T00:00:00Z",
      expiryDate: "2027-05-20T00:00:00Z",
      price: "$59.88",
      currency: "USD",
      billingHistory: [],
    },
    referral: {
      referralCode: "TESSYOSU",
      totalReferred: 20,
      successful: 17,
      pending: 3,
      rejected: 0,
      pointsEarned: 850,
      history: [],
    },
    moderation: {
      reportsAgainstCount: 0,
      reportsFiledCount: 0,
      warningsCount: 0,
      suspensionsCount: 0,
      currentStatus: "Clear",
      history: [],
      notes: [],
    },
    activityTimeline: [],
    matches: [],
    transactions: [],
  },
  {
    id: "usr_nb_90432",
    firstName: "Victor",
    lastName: "Okafor",
    name: "Victor Okafor",
    username: "@victor_okafor",
    email: "victor.okafor.unverified@yahoo.com",
    phone: "+234 809 111 2233",
    dateOfBirth: "2002-11-15", // 24 years old
    gender: "male",
    pronouns: "he/him",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    country: "Nigeria",
    countryCode: "NG",
    stateRegion: "Enugu State",
    city: "Enugu",
    preferredLanguage: "Igbo",
    deviceLanguage: "English (Nigeria)",
    languageLocale: "ig-NG",
    registrationDate: "2026-11-09T08:10:00Z", // Registered today!
    lastActive: "2026-11-09T08:40:00Z",
    status: "pending_verification",
    verification: {
      emailVerified: true,
      phoneVerified: false,
      photoVerified: false,
      identityVerified: false,
      status: "pending",
      verifiedDate: undefined,
    },
    datingStats: {
      likesSent: 15,
      likesReceived: 4,
      superLikesSent: 0,
      additionalLikesAllowance: 0,
      matchesCount: 0,
      profileViews: 45,
      conversationsCount: 0,
      liveHostedCount: 0,
      liveJoinedCount: 2,
      giftsSentCount: 0,
      giftsReceivedCount: 0,
    },
    devices: [
      {
        id: "dev_90432_1",
        brand: "Xiaomi",
        model: "Redmi Note 14 Pro",
        platform: "android",
        osVersion: "Android 15.0",
        appVersion: "v2.8.4 (Build 412)",
        ipAddress: "102.89.12.98",
        ipCountry: "Nigeria",
        ipCity: "Enugu",
        vpnStatus: "not_detected",
        lastActive: "1 hour ago",
        isCurrentSession: true,
        suspiciousActivity: false,
      },
    ],
    profile: {
      bio: "Mechanical engineering graduate. Interested in renewable energy, automotive design, and meeting genuine people.",
      prompts: [
        {
          question: "My favorite quality in someone",
          answer: "Honesty and warmth.",
        },
      ],
      relationshipGoals: "Dating with intent",
      interests: ["Engineering", "Automotive", "Football", "Afrobeats"],
      occupation: "Junior Mechanical Engineer",
      education: "B.Eng. University of Nigeria Nsukka",
      lifestyle: {
        smoking: "Never",
        drinking: "Never",
        workout: "Football on weekends",
        pets: "None",
        starSign: "Scorpio",
      },
      photos: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      ],
      completionPercentage: 62,
      missingSections: ["Phone verification", "Photo verification", "Additional photos"],
    },
    wallet: {
      giftCoins: 0,
      giftCoinsPurchasedTotal: 0,
      giftCoinsSpentTotal: 0,
      giftsReceivedTotal: 0,
      connectionPoints: 0,
      connectionPointsReferrals: 0,
      connectionPointsSpent: 0,
      connectionPointsAdjusted: 0,
    },
    premium: {
      isPremium: false,
      tier: "free",
      planName: "Free Member",
      status: "none",
      startDate: "",
      nextRenewalDate: "",
      expiryDate: "",
      price: "$0.00",
      currency: "USD",
      billingHistory: [],
    },
    referral: {
      referralCode: "VICTORENUGU",
      totalReferred: 0,
      successful: 0,
      pending: 0,
      rejected: 0,
      pointsEarned: 0,
      history: [],
    },
    moderation: {
      reportsAgainstCount: 0,
      reportsFiledCount: 0,
      warningsCount: 0,
      suspensionsCount: 0,
      currentStatus: "Pending Verification",
      history: [],
      notes: [],
    },
    activityTimeline: [],
    matches: [],
    transactions: [],
  },
  {
    id: "usr_nb_90433",
    firstName: "Brian",
    lastName: "Kovacs",
    name: "Brian Kovacs",
    username: "@brian_kovacs",
    email: "brian.kovacs@suspicious-domain.cc",
    phone: "+1 312 555 9811",
    dateOfBirth: "1991-01-20", // 35 years old
    gender: "male",
    pronouns: "he/him",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    country: "United States",
    countryCode: "US",
    stateRegion: "Illinois",
    city: "Chicago",
    preferredLanguage: "English (United States)",
    deviceLanguage: "English (United States)",
    languageLocale: "en-US",
    registrationDate: "2026-08-14T03:22:00Z",
    lastActive: "2026-11-05T12:00:00Z",
    status: "suspended",
    suspensionDetails: {
      reason: "Repeated commercial advertising and scam reports in direct messages.",
      duration: "7 days",
      until: "2026-11-12T12:00:00Z",
      suspendedAt: "2026-11-05T12:00:00Z",
    },
    verification: {
      emailVerified: true,
      phoneVerified: false,
      photoVerified: false,
      identityVerified: false,
      status: "unverified",
      verifiedDate: undefined,
    },
    datingStats: {
      likesSent: 890,
      likesReceived: 12,
      superLikesSent: 2,
      additionalLikesAllowance: 0,
      matchesCount: 4,
      profileViews: 120,
      conversationsCount: 15,
      liveHostedCount: 0,
      liveJoinedCount: 1,
      giftsSentCount: 0,
      giftsReceivedCount: 0,
    },
    devices: [
      {
        id: "dev_90433_1",
        brand: "Unknown",
        model: "Web Browser / Headless Agent",
        platform: "web",
        osVersion: "Linux x86_64",
        appVersion: "Web App v2.8",
        ipAddress: "185.220.101.5",
        ipCountry: "Netherlands",
        ipCity: "Amsterdam (Tor Exit Relay)",
        vpnStatus: "detected",
        vpnConfidence: "High (Commercial Proxy/VPN Node)",
        lastActive: "4 days ago",
        isCurrentSession: false,
        suspiciousActivity: true,
      },
    ],
    profile: {
      bio: "Financial consultant. Contact me on external chat for investment returns.",
      prompts: [],
      relationshipGoals: "Casual dating",
      interests: ["Crypto", "Investing"],
      occupation: "Consultant",
      education: "Unspecified",
      lifestyle: {
        smoking: "No answer",
        drinking: "No answer",
        workout: "No answer",
        pets: "None",
        starSign: "Capricorn",
      },
      photos: [
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
      ],
      completionPercentage: 42,
      missingSections: ["Prompts", "Phone verification", "Identity verification"],
    },
    wallet: {
      giftCoins: 0,
      giftCoinsPurchasedTotal: 0,
      giftCoinsSpentTotal: 0,
      giftsReceivedTotal: 0,
      connectionPoints: 0,
      connectionPointsReferrals: 0,
      connectionPointsSpent: 0,
      connectionPointsAdjusted: 0,
    },
    premium: {
      isPremium: false,
      tier: "free",
      planName: "Free Member",
      status: "none",
      startDate: "",
      nextRenewalDate: "",
      expiryDate: "",
      price: "$0.00",
      currency: "USD",
      billingHistory: [],
    },
    referral: {
      referralCode: "BRIANINVEST",
      totalReferred: 0,
      successful: 0,
      pending: 0,
      rejected: 0,
      pointsEarned: 0,
      history: [],
    },
    moderation: {
      reportsAgainstCount: 9,
      reportsFiledCount: 0,
      warningsCount: 2,
      suspensionsCount: 1,
      currentStatus: "Temporarily Suspended (7 days)",
      history: [
        {
          id: "mod_90433_1",
          date: "2026-11-05",
          action: "Account Suspended",
          reason: "Spam / Commercial solicitation in direct messaging",
          moderator: "Automated Safety Filter & Moderator James",
          duration: "7 days",
          status: "active",
        },
      ],
      notes: [
        {
          id: "not_90433_1",
          date: "2026-11-05",
          author: "Security Team",
          title: "VPN Proxy Node & Mass Outreach",
          content: "Automated flags triggered for copy-pasting telegram links to multiple female users within 10 minutes. IP identified as known datacenter proxy.",
        },
      ],
    },
    activityTimeline: [],
    matches: [],
    transactions: [],
  },
  {
    id: "usr_nb_90434",
    firstName: "Richard",
    lastName: "Blackwood",
    name: "Richard Blackwood",
    username: "@r_blackwood",
    email: "richard.blackwood@banned-entity.net",
    phone: "+44 7911 123456",
    dateOfBirth: "1985-04-02", // 41 years old
    gender: "male",
    pronouns: "he/him",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    country: "United Kingdom",
    countryCode: "GB",
    stateRegion: "England",
    city: "Manchester",
    preferredLanguage: "English (United Kingdom)",
    deviceLanguage: "English (United Kingdom)",
    languageLocale: "en-GB",
    registrationDate: "2026-06-10T19:00:00Z",
    lastActive: "2026-10-14T11:00:00Z",
    status: "banned",
    suspensionDetails: {
      reason: "Severe policy violation: Harassment, inappropriate explicit language, and identity impersonation.",
      duration: "permanent",
      until: "Permanent",
      suspendedAt: "2026-10-14T11:00:00Z",
    },
    verification: {
      emailVerified: true,
      phoneVerified: true,
      photoVerified: false,
      identityVerified: false,
      status: "unverified",
      verifiedDate: undefined,
    },
    datingStats: {
      likesSent: 540,
      likesReceived: 8,
      superLikesSent: 0,
      additionalLikesAllowance: 0,
      matchesCount: 1,
      profileViews: 190,
      conversationsCount: 12,
      liveHostedCount: 0,
      liveJoinedCount: 4,
      giftsSentCount: 0,
      giftsReceivedCount: 0,
    },
    devices: [
      {
        id: "dev_90434_1",
        brand: "Samsung",
        model: "Galaxy A54",
        platform: "android",
        osVersion: "Android 14.0",
        appVersion: "v2.7.0 (Build 390)",
        ipAddress: "194.26.29.112",
        ipCountry: "United Kingdom",
        ipCity: "Manchester",
        vpnStatus: "possible_proxy",
        lastActive: "26 days ago",
        isCurrentSession: false,
        suspiciousActivity: true,
      },
    ],
    profile: {
      bio: "Account permanently terminated due to community safety violations.",
      prompts: [],
      relationshipGoals: "Unspecified",
      interests: [],
      occupation: "Unspecified",
      education: "Unspecified",
      lifestyle: {
        smoking: "No answer",
        drinking: "No answer",
        workout: "No answer",
        pets: "None",
        starSign: "Aries",
      },
      photos: [
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
      ],
      completionPercentage: 20,
      missingSections: ["All"],
    },
    wallet: {
      giftCoins: 0,
      giftCoinsPurchasedTotal: 0,
      giftCoinsSpentTotal: 0,
      giftsReceivedTotal: 0,
      connectionPoints: 0,
      connectionPointsReferrals: 0,
      connectionPointsSpent: 0,
      connectionPointsAdjusted: 0,
    },
    premium: {
      isPremium: false,
      tier: "free",
      planName: "Terminated",
      status: "cancelled",
      startDate: "",
      nextRenewalDate: "",
      expiryDate: "",
      price: "$0.00",
      currency: "USD",
      billingHistory: [],
    },
    referral: {
      referralCode: "BLACKWOOD",
      totalReferred: 0,
      successful: 0,
      pending: 0,
      rejected: 0,
      pointsEarned: 0,
      history: [],
    },
    moderation: {
      reportsAgainstCount: 14,
      reportsFiledCount: 0,
      warningsCount: 3,
      suspensionsCount: 2,
      currentStatus: "Permanently Banned",
      history: [
        {
          id: "mod_90434_1",
          date: "2026-10-14",
          action: "Permanent Ban",
          reason: "Severe harassment and abusive language in direct messaging",
          moderator: "Head of Safety & Trust",
          duration: "Permanent",
          status: "active",
        },
      ],
      notes: [
        {
          id: "not_90434_1",
          date: "2026-10-14",
          author: "Trust & Safety Admin",
          title: "Account Banned",
          content: "Multiple verified reports of severe harassment. Appeals rejected. Device and phone hash blacklisted.",
        },
      ],
    },
    activityTimeline: [],
    matches: [],
    transactions: [],
  },
];

const INITIAL_AUDIT_LOG: AdminAuditEntry[] = [
  {
    id: "aud_001",
    targetUserId: "usr_nb_90421",
    targetUserName: "Amara Bliss",
    action: "Verified User Status Confirmed",
    adminName: "Super Admin Sarah",
    timestamp: "2026-11-08 14:32:10",
    reason: "Completed in-person identity verification at Lagos summit.",
    details: "Granted Identity Verified Badge",
    previousValue: "photo_verified",
    newValue: "identity_verified",
  },
  {
    id: "aud_002",
    targetUserId: "usr_nb_90433",
    targetUserName: "Brian Kovacs",
    action: "Temporary Suspension Applied",
    adminName: "Moderator James",
    timestamp: "2026-11-05 12:00:15",
    reason: "Spam advertising links across 8 chats within 10 minutes.",
    details: "Suspended for 7 days with automated warning",
    previousValue: "active",
    newValue: "suspended",
  },
  {
    id: "aud_003",
    targetUserId: "usr_nb_90434",
    targetUserName: "Richard Blackwood",
    action: "Permanent Ban Executed",
    adminName: "Head of Safety David",
    timestamp: "2026-10-14 11:00:44",
    reason: "Severe community guidelines violation (harassment).",
    details: "Device hash blacklisted; all sessions invalidated.",
    previousValue: "suspended",
    newValue: "banned",
  },
];

// Helper to load or initialize demo users from localStorage
export function loadUsersFromStorage(): NobleUser[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as NobleUser[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read users from localStorage:", err);
  }
  // Initialize with initial data
  saveUsersToStorage(INITIAL_DEMO_USERS);
  return INITIAL_DEMO_USERS;
}

export function saveUsersToStorage(users: NobleUser[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.warn("Could not write users to localStorage:", err);
  }
}

export function loadAuditLogFromStorage(): AdminAuditEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_AUDIT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AdminAuditEntry[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read audit log from localStorage:", err);
  }
  saveAuditLogToStorage(INITIAL_AUDIT_LOG);
  return INITIAL_AUDIT_LOG;
}

export function saveAuditLogToStorage(entries: AdminAuditEntry[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_AUDIT_KEY, JSON.stringify(entries));
  } catch (err) {
    console.warn("Could not write audit log to localStorage:", err);
  }
}

export function logAdminAction(
  targetUser: NobleUser,
  action: string,
  reason: string,
  details: string,
  previousValue?: string,
  newValue?: string
): void {
  const currentLog = loadAuditLogFromStorage();
  const newEntry: AdminAuditEntry = {
    id: `aud_${Date.now()}`,
    targetUserId: targetUser.id,
    targetUserName: targetUser.name,
    action,
    adminName: "Admin Administrator",
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
    reason,
    details,
    previousValue,
    newValue,
  };
  saveAuditLogToStorage([newEntry, ...currentLog]);
}

// User Mutations
export function updateUserRecord(
  userId: string,
  updatedFields: Partial<NobleUser>,
  reason?: string
): NobleUser | null {
  const users = loadUsersFromStorage();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;

  const oldUser = users[idx];
  const newUser: NobleUser = {
    ...oldUser,
    ...updatedFields,
    name:
      updatedFields.firstName || updatedFields.lastName
        ? `${updatedFields.firstName ?? oldUser.firstName} ${updatedFields.lastName ?? oldUser.lastName}`
        : oldUser.name,
  };

  users[idx] = newUser;
  saveUsersToStorage(users);

  logAdminAction(
    newUser,
    "Updated User Information",
    reason || "Administrative profile update",
    `Edited fields: ${Object.keys(updatedFields).join(", ")}`
  );

  return newUser;
}

export function verifyUserRecord(
  userId: string,
  type: "email" | "phone" | "photo" | "identity" | "all",
  notes?: string
): NobleUser | null {
  const users = loadUsersFromStorage();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;

  const u = users[idx];
  const oldStatus = u.verification.status;

  const newVerification = { ...u.verification };
  if (type === "email" || type === "all") newVerification.emailVerified = true;
  if (type === "phone" || type === "all") newVerification.phoneVerified = true;
  if (type === "photo" || type === "all") newVerification.photoVerified = true;
  if (type === "identity" || type === "all") newVerification.identityVerified = true;

  newVerification.status = "verified";
  newVerification.verifiedDate = new Date().toISOString();

  const updatedUser: NobleUser = {
    ...u,
    status: u.status === "pending_verification" ? "active" : u.status,
    verification: newVerification,
  };

  users[idx] = updatedUser;
  saveUsersToStorage(users);

  logAdminAction(
    updatedUser,
    `Verified User (${type})`,
    notes || "Administrative verification approval",
    `Verification status changed from ${oldStatus} to verified`,
    oldStatus,
    "verified"
  );

  return updatedUser;
}

export function suspendUserRecord(
  userId: string,
  reason: string,
  duration: "24h" | "7d" | "30d" | "permanent",
  adminNote?: string
): NobleUser | null {
  const users = loadUsersFromStorage();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;

  const u = users[idx];
  const oldStatus = u.status;
  const now = new Date();
  let until = "Permanent";

  if (duration === "24h") {
    until = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
  } else if (duration === "7d") {
    until = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
  } else if (duration === "30d") {
    until = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
  }

  const updatedModeration = {
    ...u.moderation,
    suspensionsCount: u.moderation.suspensionsCount + 1,
    currentStatus: `Suspended (${duration})`,
    history: [
      {
        id: `mod_${Date.now()}`,
        date: new Date().toISOString().substring(0, 10),
        action: `Suspended (${duration})`,
        reason,
        moderator: "Admin Administrator",
        duration,
        status: "active" as const,
      },
      ...u.moderation.history,
    ],
    notes: adminNote
      ? [
          {
            id: `not_${Date.now()}`,
            date: new Date().toISOString().substring(0, 10),
            author: "Admin Administrator",
            title: `Suspension (${duration}) Note`,
            content: adminNote,
          },
          ...u.moderation.notes,
        ]
      : u.moderation.notes,
  };

  const updatedUser: NobleUser = {
    ...u,
    status: duration === "permanent" ? "banned" : "suspended",
    suspensionDetails: {
      reason,
      duration,
      until,
      suspendedAt: now.toISOString(),
    },
    moderation: updatedModeration,
  };

  users[idx] = updatedUser;
  saveUsersToStorage(users);

  logAdminAction(
    updatedUser,
    duration === "permanent" ? "Permanently Banned User" : `Suspended User (${duration})`,
    reason,
    `Status changed to ${updatedUser.status}. Duration: ${duration}. Until: ${until}`,
    oldStatus,
    updatedUser.status
  );

  return updatedUser;
}

export function banUserRecord(userId: string, reason: string): NobleUser | null {
  return suspendUserRecord(userId, reason, "permanent");
}

export function restoreUserRecord(userId: string, reason?: string): NobleUser | null {
  const users = loadUsersFromStorage();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;

  const u = users[idx];
  const oldStatus = u.status;

  const updatedModeration = {
    ...u.moderation,
    currentStatus: "Clear (Restored)",
    history: [
      {
        id: `mod_${Date.now()}`,
        date: new Date().toISOString().substring(0, 10),
        action: "Account Restored",
        reason: reason || "Administrative restriction removal / appeal granted",
        moderator: "Admin Administrator",
        status: "resolved" as const,
      },
      ...u.moderation.history,
    ],
  };

  const updatedUser: NobleUser = {
    ...u,
    status: "active",
    suspensionDetails: undefined,
    moderation: updatedModeration,
  };

  users[idx] = updatedUser;
  saveUsersToStorage(users);

  logAdminAction(
    updatedUser,
    "Restored User Account",
    reason || "Appeal reviewed and account restrictions lifted",
    `Status restored from ${oldStatus} to active`,
    oldStatus,
    "active"
  );

  return updatedUser;
}

export function deleteUserRecord(userId: string, typedConfirmation: string): boolean {
  if (typedConfirmation.trim().toUpperCase() !== "DELETE") {
    return false;
  }
  const users = loadUsersFromStorage();
  const target = users.find((u) => u.id === userId);
  if (!target) return false;

  const filtered = users.filter((u) => u.id !== userId);
  saveUsersToStorage(filtered);

  logAdminAction(
    target,
    "Deleted User Account (Demo)",
    "Permanent administrative deletion requested and confirmed with typed DELETE",
    `Removed record for user ID ${target.id} (${target.name})`,
    target.status,
    "deleted"
  );

  return true;
}

export function grantGiftCoins(
  userId: string,
  amount: number,
  reason: string,
  reference?: string
): NobleUser | null {
  const users = loadUsersFromStorage();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;

  const u = users[idx];
  const oldCoins = u.wallet.giftCoins;
  const newCoins = Math.max(0, oldCoins + amount);

  const tx: UserTransaction = {
    id: `tx_${Date.now()}`,
    type: "admin_adjustment",
    title: `Admin Adjustment: ${amount >= 0 ? "+" : ""}${amount} Gift Coins`,
    amountCoins: amount,
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
    status: "completed",
    description: `Administrative adjustment: ${reason}`,
    reference: reference || `ADM-COIN-${Date.now().toString().slice(-5)}`,
  };

  const updatedUser: NobleUser = {
    ...u,
    wallet: {
      ...u.wallet,
      giftCoins: newCoins,
    },
    transactions: [tx, ...u.transactions],
  };

  users[idx] = updatedUser;
  saveUsersToStorage(users);

  logAdminAction(
    updatedUser,
    "Adjusted Gift Coins Balance",
    reason,
    `Balance updated: ${oldCoins} -> ${newCoins} (${amount >= 0 ? "+" : ""}${amount})`,
    oldCoins.toString(),
    newCoins.toString()
  );

  return updatedUser;
}

export function grantConnectionPoints(
  userId: string,
  amount: number,
  reason: string,
  reference?: string
): NobleUser | null {
  const users = loadUsersFromStorage();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;

  const u = users[idx];
  const oldPoints = u.wallet.connectionPoints;
  const newPoints = Math.max(0, oldPoints + amount);

  const tx: UserTransaction = {
    id: `tx_${Date.now()}`,
    type: "admin_adjustment",
    title: `Admin Adjustment: ${amount >= 0 ? "+" : ""}${amount} Connection Points`,
    amountPoints: amount,
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
    status: "completed",
    description: `Administrative reward/adjustment: ${reason}`,
    reference: reference || `ADM-PTS-${Date.now().toString().slice(-5)}`,
  };

  const updatedUser: NobleUser = {
    ...u,
    wallet: {
      ...u.wallet,
      connectionPoints: newPoints,
      connectionPointsAdjusted: u.wallet.connectionPointsAdjusted + amount,
    },
    transactions: [tx, ...u.transactions],
  };

  users[idx] = updatedUser;
  saveUsersToStorage(users);

  logAdminAction(
    updatedUser,
    "Adjusted Connection Points Balance",
    reason,
    `Balance updated: ${oldPoints} -> ${newPoints} (${amount >= 0 ? "+" : ""}${amount})`,
    oldPoints.toString(),
    newPoints.toString()
  );

  return updatedUser;
}

export function grantAdditionalLikes(
  userId: string,
  count: number,
  reason: string,
  adminNote?: string
): NobleUser | null {
  const users = loadUsersFromStorage();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;

  const u = users[idx];
  const oldAllowance = u.datingStats.additionalLikesAllowance;
  const newAllowance = Math.max(0, oldAllowance + count);

  const updatedUser: NobleUser = {
    ...u,
    datingStats: {
      ...u.datingStats,
      additionalLikesAllowance: newAllowance,
    },
    moderation: adminNote
      ? {
          ...u.moderation,
          notes: [
            {
              id: `not_${Date.now()}`,
              date: new Date().toISOString().substring(0, 10),
              author: "Admin Administrator",
              title: "Granted Additional Likes",
              content: `${adminNote} (Reason: ${reason})`,
            },
            ...u.moderation.notes,
          ],
        }
      : u.moderation,
  };

  users[idx] = updatedUser;
  saveUsersToStorage(users);

  logAdminAction(
    updatedUser,
    "Granted Additional Likes Allowance",
    reason,
    `Likes allowance adjusted: ${oldAllowance} -> ${newAllowance} (+${count})`,
    oldAllowance.toString(),
    newAllowance.toString()
  );

  return updatedUser;
}

export function addAdminInternalNote(
  userId: string,
  title: string,
  content: string
): NobleUser | null {
  const users = loadUsersFromStorage();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;

  const u = users[idx];
  const newNote = {
    id: `not_${Date.now()}`,
    date: new Date().toISOString().substring(0, 10),
    author: "Admin Administrator",
    title,
    content,
  };

  const updatedUser: NobleUser = {
    ...u,
    moderation: {
      ...u.moderation,
      notes: [newNote, ...u.moderation.notes],
    },
  };

  users[idx] = updatedUser;
  saveUsersToStorage(users);

  logAdminAction(
    updatedUser,
    "Added Internal Admin Note",
    "Record keeping",
    `Note title: "${title}"`
  );

  return updatedUser;
}

// Filtering & Sorting
export function filterAndSortUsers(
  users: NobleUser[],
  search: string,
  filters: UserFilterState,
  sort: UserSortCriteria
): NobleUser[] {
  let list = [...users];

  // Search filter
  const s = search.trim().toLowerCase();
  if (s) {
    list = list.filter((u) => {
      const matchName = u.name.toLowerCase().includes(s);
      const matchUsername = u.username.toLowerCase().includes(s);
      const matchEmail = u.email.toLowerCase().includes(s);
      const matchPhone = u.phone.toLowerCase().includes(s);
      const matchId = u.id.toLowerCase().includes(s);
      const matchReferral = u.referral.referralCode.toLowerCase().includes(s);
      const matchCity = u.city.toLowerCase().includes(s);
      const matchCountry = u.country.toLowerCase().includes(s);
      return (
        matchName ||
        matchUsername ||
        matchEmail ||
        matchPhone ||
        matchId ||
        matchReferral ||
        matchCity ||
        matchCountry
      );
    });
  }

  // Account Status
  if (filters.accountStatus !== "all") {
    list = list.filter((u) => u.status === filters.accountStatus);
  }

  // Gender
  if (filters.gender !== "all") {
    list = list.filter((u) => u.gender === filters.gender);
  }

  // Age Range
  list = list.filter((u) => {
    const age = calculateAge(u.dateOfBirth);
    return age >= filters.ageMin && age <= filters.ageMax;
  });

  // Country
  if (filters.country !== "all") {
    list = list.filter(
      (u) => u.country.toLowerCase() === filters.country.toLowerCase()
    );
  }

  // Verification
  if (filters.verification !== "all") {
    if (filters.verification === "verified") {
      list = list.filter((u) => u.verification.status === "verified");
    } else if (filters.verification === "unverified") {
      list = list.filter(
        (u) =>
          u.verification.status === "unverified" ||
          (!u.verification.emailVerified && !u.verification.phoneVerified)
      );
    } else if (filters.verification === "pending") {
      list = list.filter((u) => u.verification.status === "pending");
    } else if (filters.verification === "photo") {
      list = list.filter((u) => u.verification.photoVerified);
    }
  }

  // Premium
  if (filters.premium !== "all") {
    if (filters.premium === "premium") {
      list = list.filter((u) => u.premium.isPremium);
    } else if (filters.premium === "free") {
      list = list.filter((u) => !u.premium.isPremium);
    } else if (filters.premium === "active") {
      list = list.filter((u) => u.premium.status === "active");
    } else if (filters.premium === "expired") {
      list = list.filter((u) => u.premium.status === "expired");
    } else if (filters.premium === "cancelled") {
      list = list.filter((u) => u.premium.status === "cancelled");
    }
  }

  // Wallet
  if (filters.walletCoins !== "all") {
    if (filters.walletCoins === "has_coins") {
      list = list.filter((u) => u.wallet.giftCoins > 0);
    } else if (filters.walletCoins === "no_coins") {
      list = list.filter((u) => u.wallet.giftCoins === 0);
    }
  }

  if (filters.walletPoints !== "all") {
    if (filters.walletPoints === "has_points") {
      list = list.filter((u) => u.wallet.connectionPoints > 0);
    } else if (filters.walletPoints === "no_points") {
      list = list.filter((u) => u.wallet.connectionPoints === 0);
    }
  }

  // Activity
  if (filters.activity !== "all") {
    if (filters.activity === "recent") {
      list = list.filter(
        (u) => u.status === "online" || u.lastActive.includes("hour") || u.lastActive.includes("min")
      );
    } else if (filters.activity === "inactive") {
      list = list.filter((u) => u.lastActive.includes("day") || u.status === "offline");
    } else if (filters.activity === "live_host") {
      list = list.filter((u) => u.datingStats.liveHostedCount > 0);
    } else if (filters.activity === "gift_sender") {
      list = list.filter((u) => u.datingStats.giftsSentCount > 0);
    } else if (filters.activity === "gift_receiver") {
      list = list.filter((u) => u.datingStats.giftsReceivedCount > 0);
    } else if (filters.activity === "has_matches") {
      list = list.filter((u) => u.datingStats.matchesCount > 0);
    } else if (filters.activity === "no_matches") {
      list = list.filter((u) => u.datingStats.matchesCount === 0);
    }
  }

  // Referral
  if (filters.referral !== "all") {
    if (filters.referral === "has_referrals") {
      list = list.filter((u) => u.referral.totalReferred > 0);
    } else if (filters.referral === "successful_referrals") {
      list = list.filter((u) => u.referral.successful > 0);
    } else if (filters.referral === "pending_referrals") {
      list = list.filter((u) => u.referral.pending > 0);
    }
  }

  // Platform
  if (filters.platform !== "all") {
    list = list.filter((u) =>
      u.devices.some((d) => d.platform === filters.platform)
    );
  }

  // VPN
  if (filters.vpn !== "all") {
    list = list.filter((u) =>
      u.devices.some((d) => d.vpnStatus === filters.vpn)
    );
  }

  // Sorting
  const dir = sort.order === "asc" ? 1 : -1;
  list.sort((a, b) => {
    switch (sort.field) {
      case "name":
        return a.name.localeCompare(b.name) * dir;
      case "age":
        return (calculateAge(a.dateOfBirth) - calculateAge(b.dateOfBirth)) * dir;
      case "registrationDate":
        return (new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime()) * dir;
      case "lastActive":
        return a.lastActive.localeCompare(b.lastActive) * dir;
      case "giftCoins":
        return (a.wallet.giftCoins - b.wallet.giftCoins) * dir;
      case "connectionPoints":
        return (a.wallet.connectionPoints - b.wallet.connectionPoints) * dir;
      case "matches":
        return (a.datingStats.matchesCount - b.datingStats.matchesCount) * dir;
      case "likesReceived":
        return (a.datingStats.likesReceived - b.datingStats.likesReceived) * dir;
      case "referrals":
        return (a.referral.successful - b.referral.successful) * dir;
      case "premium":
        return ((a.premium.isPremium ? 1 : 0) - (b.premium.isPremium ? 1 : 0)) * dir;
      default:
        return 0;
    }
  });

  return list;
}

// KPI Calculation
export function calculateUserKPIs(users: NobleUser[]): UserStatsKpis {
  const total = users.length;
  let online = 0;
  let suspended = 0;
  let banned = 0;
  let verified = 0;
  let emailVer = 0;
  let phoneVer = 0;
  let photoVer = 0;
  let premium = 0;
  let totalCoins = 0;
  let totalPoints = 0;
  let newToday = 0;

  users.forEach((u) => {
    if (u.status === "online") online++;
    if (u.status === "suspended") suspended++;
    if (u.status === "banned") banned++;
    if (u.verification.status === "verified") verified++;
    if (u.verification.emailVerified) emailVer++;
    if (u.verification.phoneVerified) phoneVer++;
    if (u.verification.photoVerified) photoVer++;
    if (u.premium.isPremium) premium++;
    totalCoins += u.wallet.giftCoins;
    totalPoints += u.wallet.connectionPoints;

    if (u.registrationDate.startsWith("2026-11-09")) {
      newToday++;
    }
  });

  return {
    totalUsers: 1284500 + total,
    activeUsersDau: 482100 + online * 1200,
    activeUsersWau: 894000,
    activeUsersMau: 1140000,
    newRegistrationsToday: 1420 + newToday,
    newRegistrationsPeriod: 42800,
    verifiedEmail: emailVer,
    verifiedPhone: phoneVer,
    verifiedPhoto: photoVer,
    verifiedTotal: verified,
    unverifiedTotal: total - verified,
    suspendedTotal: suspended,
    bannedTotal: banned,
    premiumTotal: premium,
    onlineTotal: online,
    totalGiftCoins: totalCoins,
    totalConnectionPoints: totalPoints,
    growthPercentage: 14.8,
  };
}

// Export CSV helper
export function exportUsersToCsv(users: NobleUser[]): string {
  const headers = [
    "User ID",
    "Full Name",
    "Username",
    "Email",
    "Phone",
    "Gender",
    "Date of Birth",
    "Calculated Age",
    "Country",
    "City",
    "Account Status",
    "Verification Status",
    "Premium Tier",
    "Gift Coins",
    "Connection Points",
    "Matches",
    "Likes Received",
    "Primary Device",
    "OS Version",
    "App Version",
    "IP Address",
    "VPN Status",
    "Registration Date",
  ];

  const rows = users.map((u) => {
    const age = calculateAge(u.dateOfBirth);
    const primDev = u.devices[0];
    return [
      `"${u.id}"`,
      `"${u.name}"`,
      `"${u.username}"`,
      `"${u.email}"`,
      `"${u.phone}"`,
      `"${u.gender}"`,
      `"${u.dateOfBirth}"`,
      age,
      `"${u.country}"`,
      `"${u.city}"`,
      `"${u.status}"`,
      `"${u.verification.status}"`,
      `"${u.premium.planName}"`,
      u.wallet.giftCoins,
      u.wallet.connectionPoints,
      u.datingStats.matchesCount,
      u.datingStats.likesReceived,
      `"${primDev ? `${primDev.brand} ${primDev.model}` : "Unknown"}"`,
      `"${primDev ? primDev.osVersion : "Unknown"}"`,
      `"${primDev ? primDev.appVersion : "Unknown"}"`,
      `"${primDev ? maskIp(primDev.ipAddress) : "Unknown"}"`,
      `"${primDev ? primDev.vpnStatus : "Unknown"}"`,
      `"${u.registrationDate}"`,
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}
