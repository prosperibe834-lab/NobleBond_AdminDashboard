// NobleBond Admin — User Management Types
// Strict typing with zero emojis and full SaaS metadata support

export type UserAccountStatus =
  | "active"
  | "online"
  | "offline"
  | "suspended"
  | "banned"
  | "pending_verification"
  | "deleted";

export type UserVerificationStatus =
  | "verified"
  | "unverified"
  | "pending"
  | "email_only"
  | "phone_only"
  | "photo_verified"
  | "identity_verified";

export type UserPremiumTier = "free" | "weekly" | "monthly" | "yearly" | "expired" | "cancelled";

export type UserGender = "male" | "female" | "other" | "prefer_not_to_say";

export type DevicePlatform = "ios" | "android" | "web" | "other";

export type VpnStatus = "detected" | "not_detected" | "possible_proxy" | "unknown";

export interface UserDevice {
  id: string;
  brand: string; // Apple, Samsung, Google Pixel, Xiaomi, Tecno, etc.
  model: string; // iPhone 17 Pro Max, Galaxy S25 Ultra, Pixel 10 Pro, etc.
  platform: DevicePlatform;
  osVersion: string; // e.g. "iOS 26.2", "Android 16.0" (distinct from app version!)
  appVersion: string; // e.g. "v2.8.4 (Build 412)"
  ipAddress: string; // e.g. "197.210.84.112"
  ipv6Address?: string;
  ipCountry: string;
  ipCity: string;
  vpnStatus: VpnStatus;
  vpnConfidence?: string;
  lastActive: string;
  isCurrentSession: boolean;
  suspiciousActivity: boolean;
}

export interface UserDatingProfile {
  bio: string;
  prompts: Array<{ question: string; answer: string }>;
  relationshipGoals: string; // Long-term, Marriage-minded, Casual dating, New friends
  interests: string[];
  occupation: string;
  education: string;
  lifestyle: {
    smoking: string;
    drinking: string;
    workout: string;
    pets: string;
    starSign: string;
  };
  photos: string[];
  completionPercentage: number;
  missingSections: string[];
}

export interface UserWallet {
  giftCoins: number; // Purchased virtual currency for live stream gifts
  giftCoinsPurchasedTotal: number;
  giftCoinsSpentTotal: number;
  giftsReceivedTotal: number;
  connectionPoints: number; // Reward points earned from verified referrals (+50 pts)
  connectionPointsReferrals: number;
  connectionPointsSpent: number;
  connectionPointsAdjusted: number;
}

export interface BillingRecord {
  id: string;
  date: string;
  plan: string;
  amount: string;
  status: "completed" | "refunded" | "pending";
  paymentMethod: string;
}

export interface UserPremium {
  isPremium: boolean;
  tier: UserPremiumTier;
  planName: string; // Free, Weekly ($4.99), Monthly ($9.99), Yearly ($59.88)
  status: "active" | "expired" | "cancelled" | "none";
  startDate: string;
  nextRenewalDate: string;
  expiryDate: string;
  price: string;
  currency: string;
  billingHistory: BillingRecord[];
}

export interface ReferralHistoryItem {
  id: string;
  referredUser: string;
  username: string;
  avatar: string;
  date: string;
  status: "qualified" | "pending" | "rejected";
  rewardPoints: number; // NobleBond standard: 50 Connection Points
  note: string;
}

export interface UserReferral {
  referralCode: string;
  referredByCode?: string;
  totalReferred: number;
  successful: number;
  pending: number;
  rejected: number;
  pointsEarned: number;
  history: ReferralHistoryItem[];
}

export interface ModerationRecord {
  id: string;
  date: string;
  action: string;
  reason: string;
  moderator: string;
  duration?: string;
  status: "active" | "resolved" | "expired";
}

export interface AdminInternalNote {
  id: string;
  date: string;
  author: string;
  title: string;
  content: string;
}

export interface UserModeration {
  reportsAgainstCount: number;
  reportsFiledCount: number;
  warningsCount: number;
  suspensionsCount: number;
  currentStatus: string;
  history: ModerationRecord[];
  notes: AdminInternalNote[];
}

export interface UserActivityEvent {
  id: string;
  type:
    | "account"
    | "dating"
    | "messaging"
    | "live"
    | "wallet"
    | "referral"
    | "security"
    | "moderation";
  title: string;
  description: string;
  timestamp: string;
  badgeVariant?: "primary" | "success" | "warning" | "danger" | "info";
}

export interface UserMatch {
  id: string;
  matchedUserId: string;
  matchedUserName: string;
  matchedUserUsername: string;
  matchedUserAvatar: string;
  matchedDate: string;
  status: "active" | "unmatched" | "reported";
  conversationId?: string;
}

export interface UserTransaction {
  id: string;
  type:
    | "coin_purchase"
    | "gift_sent"
    | "gift_received"
    | "points_earned"
    | "points_spent"
    | "referral_reward"
    | "subscription_purchase"
    | "admin_adjustment";
  title: string;
  amountCoins?: number;
  amountPoints?: number;
  amountFiat?: string;
  timestamp: string;
  status: "completed" | "refunded" | "failed";
  description: string;
  reference: string;
}

export interface AdminAuditEntry {
  id: string;
  targetUserId: string;
  targetUserName: string;
  action: string;
  adminName: string;
  timestamp: string;
  reason: string;
  details: string;
  previousValue?: string;
  newValue?: string;
}

export interface NobleUser {
  id: string; // e.g. "usr_nb_90421"
  firstName: string;
  lastName: string;
  name: string; // full name
  username: string; // e.g. "@zara_love"
  email: string;
  phone: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: UserGender;
  pronouns?: string;
  avatar: string;
  country: string;
  countryCode: string;
  stateRegion: string;
  city: string;
  preferredLanguage: string;
  deviceLanguage: string;
  languageLocale: string;
  registrationDate: string;
  lastActive: string;
  status: UserAccountStatus;
  suspensionDetails?: {
    reason: string;
    duration: string;
    until: string;
    suspendedAt: string;
  };
  verification: {
    emailVerified: boolean;
    phoneVerified: boolean;
    photoVerified: boolean;
    identityVerified: boolean;
    status: UserVerificationStatus;
    verifiedDate?: string;
  };
  datingStats: {
    likesSent: number;
    likesReceived: number;
    superLikesSent: number;
    additionalLikesAllowance: number;
    matchesCount: number;
    profileViews: number;
    conversationsCount: number;
    liveHostedCount: number;
    liveJoinedCount: number;
    giftsSentCount: number;
    giftsReceivedCount: number;
  };
  devices: UserDevice[];
  profile: UserDatingProfile;
  wallet: UserWallet;
  premium: UserPremium;
  referral: UserReferral;
  moderation: UserModeration;
  activityTimeline: UserActivityEvent[];
  matches: UserMatch[];
  transactions: UserTransaction[];
}

export interface UserFilterState {
  accountStatus: string; // 'all' | UserAccountStatus
  gender: string; // 'all' | UserGender
  ageMin: number;
  ageMax: number;
  country: string; // 'all' | country name
  verification: string; // 'all' | 'verified' | 'unverified' | 'pending' | 'photo'
  premium: string; // 'all' | 'premium' | 'free' | 'active' | 'expired' | 'cancelled'
  walletCoins: string; // 'all' | 'has_coins' | 'no_coins'
  walletPoints: string; // 'all' | 'has_points' | 'no_points'
  activity: string; // 'all' | 'recent' | 'inactive' | 'live_host' | 'gift_sender' | 'gift_receiver' | 'has_matches' | 'no_matches'
  referral: string; // 'all' | 'referred' | 'has_referrals' | 'successful_referrals' | 'pending_referrals'
  platform: string; // 'all' | 'ios' | 'android' | 'web'
  vpn: string; // 'all' | 'detected' | 'not_detected' | 'possible_proxy'
}

export type UserSortField =
  | "name"
  | "age"
  | "registrationDate"
  | "lastActive"
  | "giftCoins"
  | "connectionPoints"
  | "matches"
  | "likesReceived"
  | "referrals"
  | "premium";

export type UserSortOrder = "asc" | "desc";

export interface UserSortCriteria {
  field: UserSortField;
  order: UserSortOrder;
}

export type UserTableColumnKey =
  | "avatar"
  | "name"
  | "username"
  | "email"
  | "phone"
  | "gender"
  | "age"
  | "country"
  | "status"
  | "verification"
  | "premium"
  | "giftCoins"
  | "connectionPoints"
  | "matches"
  | "likesReceived"
  | "registrationDate"
  | "lastActive"
  | "actions";

export interface ColumnVisibilityState {
  avatar: boolean;
  name: boolean;
  username: boolean;
  email: boolean;
  phone: boolean;
  gender: boolean;
  age: boolean;
  country: boolean;
  status: boolean;
  verification: boolean;
  premium: boolean;
  giftCoins: boolean;
  connectionPoints: boolean;
  matches: boolean;
  likesReceived: boolean;
  registrationDate: boolean;
  lastActive: boolean;
  actions: boolean;
}

export interface UserStatsKpis {
  totalUsers: number;
  activeUsersDau: number;
  activeUsersWau: number;
  activeUsersMau: number;
  newRegistrationsToday: number;
  newRegistrationsPeriod: number;
  verifiedEmail: number;
  verifiedPhone: number;
  verifiedPhoto: number;
  verifiedTotal: number;
  unverifiedTotal: number;
  suspendedTotal: number;
  bannedTotal: number;
  premiumTotal: number;
  onlineTotal: number;
  totalGiftCoins: number;
  totalConnectionPoints: number;
  growthPercentage: number;
}

