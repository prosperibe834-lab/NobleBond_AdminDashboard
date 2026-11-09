// NobleBond Admin — Profile Management Types
// Strict typing, zero emojis, full international dating SaaS administration support

export type ProfileModerationStatus =
  | "approved"
  | "under_review"
  | "flagged"
  | "restricted"
  | "rejected";

export type ProfileVisibility =
  | "discoverable"
  | "paused_by_user"
  | "hidden"
  | "restricted"
  | "not_available";

export type MediaReviewStatus = "approved" | "pending" | "rejected" | "flagged";

export type MediaRejectionCategory =
  | "explicit_sexual_content"
  | "nudity"
  | "violence"
  | "hate_discriminatory"
  | "impersonation"
  | "fake_misleading"
  | "spam_advertising"
  | "copyright_concern"
  | "low_quality"
  | "other_policy_violation";

export interface MediaItem {
  id: string;
  url: string;
  thumbnailUrl?: string;
  type: "photo" | "video";
  isPrimary: boolean;
  reviewStatus: MediaReviewStatus;
  rejectionCategory?: MediaRejectionCategory;
  rejectionReason?: string;
  uploadDate: string;
  dimensions?: string;
  fileSize?: string;
  aspectRatio?: string;
  flags?: string[];
  reviewedAt?: string;
  reviewedBy?: string;
}

export type OverallVerificationStatus =
  | "verified"
  | "partially_verified"
  | "pending"
  | "rejected"
  | "unverified";

export interface EmailVerificationRecord {
  status: "verified" | "unverified" | "pending";
  email: string;
  verifiedAt?: string;
}

export interface PhoneVerificationRecord {
  status: "verified" | "unverified" | "pending";
  phone: string;
  verifiedAt?: string;
}

export interface PhotoVerificationRecord {
  status: "verified" | "unverified" | "pending" | "rejected";
  selfieUrl?: string;
  gestureRequired?: string;
  confidenceScore?: number;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

export interface IdentityVerificationRecord {
  status: "verified" | "unverified" | "pending" | "rejected";
  documentType?: "national_passport" | "national_id" | "drivers_license" | "residence_permit";
  documentNumberMasked?: string;
  documentFrontUrl?: string;
  documentBackUrl?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  quarantineNotes?: string;
  expiryDate?: string;
}

export interface ProfileVerificationRecord {
  overallStatus: OverallVerificationStatus;
  email: EmailVerificationRecord;
  phone: PhoneVerificationRecord;
  photo: PhotoVerificationRecord;
  identity: IdentityVerificationRecord;
  lastUpdated: string;
}

export type AutomatedCheckOutcomeStatus =
  | "passed"
  | "needs_review"
  | "flagged"
  | "rejected"
  | "not_checked";

export interface AutomatedCheckOutcome {
  id: string;
  checkType:
    | "required_info"
    | "completeness"
    | "image_screening"
    | "video_screening"
    | "duplicate_detection"
    | "suspicious_patterns"
    | "report_frequency"
    | "verification_status";
  name: string;
  status: AutomatedCheckOutcomeStatus;
  details: string;
  confidenceScore?: number; // 0 - 100
  timestamp: string;
}

export interface ProfileReport {
  id: string;
  reporterUserIdMasked: string; // Permission masked e.g. "usr_***_482"
  reporterNameMasked: string;
  category:
    | "harassment"
    | "fake_profile"
    | "inappropriate_media"
    | "scam"
    | "underage"
    | "hate_speech"
    | "other";
  reason: string;
  reportedContentSnippet?: string;
  reportedMediaId?: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "new" | "investigating" | "resolved" | "escalated" | "dismissed";
  createdAt: string;
  adminNotes?: string;
  resolution?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface ProfileQualityBreakdown {
  overallPercentage: number;
  sectionScores: {
    personalInfo: number;
    bio: number;
    prompts: number;
    photos: number;
    interests: number;
    lifestyle: number;
  };
  missingSections: string[];
  recommendations: string[];
}

export interface DatingPreferences {
  relationshipGoals: string;
  preferredGender: "women" | "men" | "everyone";
  ageMin: number;
  ageMax: number;
  maxDistanceKm: number;
  openToLongDistance: boolean;
  verifiedOnly: boolean;
}

export interface ProfilePromptAnswer {
  id: string;
  question: string;
  answer: string;
  moderationStatus: "approved" | "pending" | "flagged" | "rejected";
  moderationReason?: string;
}

export interface ProfileAuditEntry {
  id: string;
  timestamp: string;
  adminName: string;
  action: string;
  category: "moderation" | "visibility" | "verification" | "media" | "bio" | "report";
  details: string;
  severity: "normal" | "warning" | "critical";
}

export interface AdminProfile {
  id: string; // e.g. "prf_nb_90421"
  userId: string; // e.g. "usr_nb_90421"
  fullName: string;
  legalNameMasked?: string;
  username: string;
  avatar: string;
  email: string;
  phone: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: "female" | "male" | "other" | "prefer_not_to_say";
  pronouns: string;
  country: string;
  countryCode: string;
  stateRegion: string;
  city: string;
  occupation: string;
  education: string;
  languages: string[];
  
  // Bio
  bio: string;
  bioModerationStatus: "approved" | "pending" | "flagged" | "rejected";
  bioModerationReason?: string;
  
  // Prompts
  prompts: ProfilePromptAnswer[];
  
  // Interests & Lifestyle
  interests: string[];
  lifestyle: {
    smoking: string;
    drinking: string;
    workout: string;
    pets: string;
    starSign: string;
  };
  
  // Dating Preferences
  datingPreferences: DatingPreferences;
  
  // Media
  photos: MediaItem[];
  videos: MediaItem[];
  
  // Quality & Verification
  completionPercentage: number;
  qualityBreakdown: ProfileQualityBreakdown;
  verification: ProfileVerificationRecord;
  
  // Administrative Moderation & Visibility
  moderationStatus: ProfileModerationStatus;
  moderationReason?: string;
  moderationReviewedAt?: string;
  moderationReviewedBy?: string;
  
  visibility: ProfileVisibility;
  visibilityReason?: string;
  visibilityChangedAt?: string;
  
  // Reports
  reportsCount: number;
  reports: ProfileReport[];
  
  // Automated Review
  automatedChecks: AutomatedCheckOutcome[];
  automatedReviewSummary: "passed" | "needs_human_review" | "flagged" | "rejected_by_policy";
  
  // Dating Metrics (read-only context)
  datingMetrics: {
    likesSent: number;
    likesReceived: number;
    matches: number;
    profileViews: number;
    superLikesReceived: number;
  };
  
  // Audit Trail
  historyLog: ProfileAuditEntry[];
  
  createdAt: string;
  updatedAt: string;
}

export interface ProfileStatsKpis {
  totalProfiles: number;
  completeProfiles: number; // >= 90%
  incompleteProfiles: number; // < 90%
  pendingProfileReviews: number;
  pendingPhotoReviews: number;
  verifiedProfiles: number;
  reportedProfiles: number;
  hiddenProfiles: number;
  rejectedContent: number;
  profilesUpdatedRecently: number;
}

export interface ProfileFilterState {
  searchQuery: string;
  profileStatus: string; // "all" | ProfileModerationStatus
  verificationStatus: string; // "all" | OverallVerificationStatus | "email_only" | "phone_only" | "photo_verified" | "identity_verified"
  mediaFilter: string; // "all" | "has_photos" | "has_videos" | "missing_primary" | "photos_pending" | "videos_pending" | "has_rejected_media"
  gender: string; // "all" | "female" | "male" | "other"
  ageMin: number | null;
  ageMax: number | null;
  country: string; // "all" or specific
  city: string; // "all" or specific
  completionBucket: string; // "all" | "0_25" | "26_50" | "51_75" | "76_99" | "100"
  visibility: string; // "all" | ProfileVisibility
  automatedOutcome: string; // "all" | "passed" | "needs_human_review" | "flagged" | "rejected_by_policy"
  hasReports: string; // "all" | "yes" | "no" | "critical"
}

export type ProfileSortField =
  | "createdAt"
  | "updatedAt"
  | "completionPercentage"
  | "photosCount"
  | "videosCount"
  | "reportsCount"
  | "fullName"
  | "age";

export type SortOrder = "asc" | "desc";

export interface ProfileSortCriteria {
  field: ProfileSortField;
  order: SortOrder;
}

export interface ColumnVisibilityState {
  picture: boolean;
  fullName: boolean;
  username: boolean;
  age: boolean;
  gender: boolean;
  country: boolean;
  city: boolean;
  completion: boolean;
  photos: boolean;
  videos: boolean;
  verification: boolean;
  moderationStatus: boolean;
  visibility: boolean;
  reportsCount: boolean;
  createdAt: boolean;
  updatedAt: boolean;
  actions: boolean;
}
