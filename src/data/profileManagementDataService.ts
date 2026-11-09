// NobleBond Admin — Profile Management Data Service & State Store
// Local demo state with localStorage persistence, audit logging, zero emojis

import type {
  AdminProfile,
  ProfileFilterState,
  ProfileSortCriteria,
  ProfileStatsKpis,
  ProfileAuditEntry,
  ProfileModerationStatus,
  ProfileVisibility,
  MediaRejectionCategory,
} from "../types/profileManagement.types";

const LOCAL_STORAGE_PROFILES_KEY = "noblebond_admin_profiles_v1";
const LOCAL_STORAGE_PROFILE_AUDIT_KEY = "noblebond_admin_profile_audit_v1";

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

// 14 rich initial demo profiles representing realistic NobleBond members
const INITIAL_DEMO_PROFILES: AdminProfile[] = [
  {
    id: "prf_nb_90421",
    userId: "usr_nb_90421",
    fullName: "Amara Bliss",
    legalNameMasked: "Amara C. Bliss",
    username: "@amara_bliss",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    email: "amara.bliss@noblebond.com",
    phone: "+234 803 456 7890",
    dateOfBirth: "1998-05-14",
    gender: "female",
    pronouns: "she/her",
    country: "Nigeria",
    countryCode: "NG",
    stateRegion: "Lagos State",
    city: "Lagos (Victoria Island)",
    occupation: "Fashion Brand Director & Content Producer",
    education: "B.Sc. Mass Communication, University of Lagos",
    languages: ["English", "Yoruba", "French"],
    bio: "Passionate about creative storytelling, sustainable African fashion, and meaningful connections. Love quiet rooftop dinners, weekend art galleries, and deep midnight conversations.",
    bioModerationStatus: "approved",
    prompts: [
      {
        id: "pmp_1",
        question: "A non-negotiable for me is...",
        answer: "Emotional maturity, ambition, and someone who treats service staff with genuine kindness.",
        moderationStatus: "approved",
      },
      {
        id: "pmp_2",
        question: "The quickest way to my heart is...",
        answer: "Surprising me with tickets to a jazz festival or bringing good pastries without asking.",
        moderationStatus: "approved",
      },
      {
        id: "pmp_3",
        question: "Together, we could...",
        answer: "Build something impactful, travel the world, and make each other laugh every single day.",
        moderationStatus: "approved",
      },
    ],
    interests: ["Fashion Design", "Contemporary Art", "Fine Dining", "Pilates", "International Travel", "Afrobeats"],
    lifestyle: {
      smoking: "Never",
      drinking: "Socially on weekends",
      workout: "4-5 times a week",
      pets: "Has a Golden Retriever named Cairo",
      starSign: "Taurus",
    },
    datingPreferences: {
      relationshipGoals: "Long-term relationship leading to marriage",
      preferredGender: "men",
      ageMin: 27,
      ageMax: 38,
      maxDistanceKm: 150,
      openToLongDistance: true,
      verifiedOnly: true,
    },
    photos: [
      {
        id: "med_p1_1",
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        type: "photo",
        isPrimary: true,
        reviewStatus: "approved",
        uploadDate: "2025-08-12T10:35:00Z",
        dimensions: "1080x1350",
        fileSize: "1.4 MB",
        reviewedAt: "2025-08-12T11:00:00Z",
        reviewedBy: "Automated AI Shield v4",
      },
      {
        id: "med_p1_2",
        url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
        type: "photo",
        isPrimary: false,
        reviewStatus: "approved",
        uploadDate: "2025-08-12T10:36:00Z",
        dimensions: "1080x1350",
        fileSize: "1.2 MB",
        reviewedAt: "2025-08-12T11:00:00Z",
        reviewedBy: "Admin Staff (Sarah T.)",
      },
      {
        id: "med_p1_3",
        url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
        type: "photo",
        isPrimary: false,
        reviewStatus: "approved",
        uploadDate: "2025-08-15T14:20:00Z",
        dimensions: "1080x1350",
        fileSize: "1.8 MB",
        reviewedAt: "2025-08-15T14:40:00Z",
        reviewedBy: "Admin Staff (Sarah T.)",
      },
      {
        id: "med_p1_4",
        url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
        type: "photo",
        isPrimary: false,
        reviewStatus: "approved",
        uploadDate: "2025-09-01T09:15:00Z",
        dimensions: "1080x1350",
        fileSize: "1.1 MB",
        reviewedAt: "2025-09-01T09:45:00Z",
        reviewedBy: "Automated AI Shield v4",
      },
    ],
    videos: [
      {
        id: "med_v1_1",
        url: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-video-call-42880-large.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        type: "video",
        isPrimary: false,
        reviewStatus: "approved",
        uploadDate: "2025-10-04T12:00:00Z",
        fileSize: "8.6 MB",
        aspectRatio: "9:16",
        reviewedAt: "2025-10-04T13:10:00Z",
        reviewedBy: "Admin Staff (James O.)",
      },
    ],
    completionPercentage: 96,
    qualityBreakdown: {
      overallPercentage: 96,
      sectionScores: {
        personalInfo: 100,
        bio: 100,
        prompts: 100,
        photos: 95,
        interests: 100,
        lifestyle: 100,
      },
      missingSections: ["Second video prompt"],
      recommendations: ["Upload a video prompt answering 'My typical Sunday' to reach 100%."],
    },
    verification: {
      overallStatus: "verified",
      email: { status: "verified", email: "amara.bliss@noblebond.com", verifiedAt: "2025-08-12T10:32:00Z" },
      phone: { status: "verified", phone: "+234 803 456 7890", verifiedAt: "2025-08-12T10:33:00Z" },
      photo: {
        status: "verified",
        selfieUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        gestureRequired: "Three fingers raised",
        confidenceScore: 99.4,
        reviewedAt: "2025-08-14T14:20:00Z",
        reviewedBy: "Biometric Neural Engine v2",
      },
      identity: {
        status: "verified",
        documentType: "national_passport",
        documentNumberMasked: "A09****82",
        documentFrontUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
        reviewedAt: "2025-08-14T14:30:00Z",
        reviewedBy: "Senior Verifier (K. Adebayo)",
        quarantineNotes: "Official biometric passport verified against Nigerian NIMC registry.",
        expiryDate: "2031-04-18",
      },
      lastUpdated: "2025-08-14T14:30:00Z",
    },
    moderationStatus: "approved",
    visibility: "discoverable",
    reportsCount: 0,
    reports: [],
    automatedChecks: [
      {
        id: "chk_1",
        checkType: "required_info",
        name: "Required Baseline Fields",
        status: "passed",
        details: "All required demographic and location fields provided and valid.",
        timestamp: "2025-08-12T10:35:00Z",
      },
      {
        id: "chk_2",
        checkType: "image_screening",
        name: "AI Media Safety Screening",
        status: "passed",
        details: "Zero explicit nudity, zero violence, high aesthetic score.",
        confidenceScore: 99.2,
        timestamp: "2025-08-12T10:36:00Z",
      },
      {
        id: "chk_3",
        checkType: "duplicate_detection",
        name: "Reverse Image Search",
        status: "passed",
        details: "No duplicate match in global stock databases or banned hash lists.",
        timestamp: "2025-08-12T10:36:00Z",
      },
      {
        id: "chk_4",
        checkType: "verification_status",
        name: "Biometric Liveness",
        status: "passed",
        details: "Live selfie matches primary profile photo with 99.4% confidence.",
        timestamp: "2025-08-14T14:20:00Z",
      },
    ],
    automatedReviewSummary: "passed",
    datingMetrics: {
      likesSent: 342,
      likesReceived: 1284,
      matches: 94,
      profileViews: 4120,
      superLikesReceived: 78,
    },
    historyLog: [
      {
        id: "log_1",
        timestamp: "2025-08-14T14:30:00Z",
        adminName: "Senior Verifier (K. Adebayo)",
        action: "Identity & Photo Verified",
        category: "verification",
        details: "Full passport and live selfie verified. Premium verification badge activated.",
        severity: "normal",
      },
      {
        id: "log_2",
        timestamp: "2025-08-12T11:00:00Z",
        adminName: "System",
        action: "Initial Profile Screening",
        category: "moderation",
        details: "Profile passed automated baseline screening without flags.",
        severity: "normal",
      },
    ],
    createdAt: "2025-08-12T10:30:00Z",
    updatedAt: "2026-11-09T09:42:00Z",
  },
  {
    id: "prf_nb_90422",
    userId: "usr_nb_90422",
    fullName: "David King",
    legalNameMasked: "David O. King",
    username: "@david_king",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    email: "david.king@outlook.com",
    phone: "+234 802 334 5566",
    dateOfBirth: "1994-11-20",
    gender: "male",
    pronouns: "he/him",
    country: "Nigeria",
    countryCode: "NG",
    stateRegion: "Federal Capital Territory",
    city: "Abuja (Maitama)",
    occupation: "Civil Infrastructure Engineer & Real Estate Investor",
    education: "M.Sc. Structural Engineering, Imperial College London",
    languages: ["English", "Hausa"],
    bio: "Building infrastructure by day, exploring live music and golf on weekends. Looking for a partner who values mutual growth, peace of mind, and intentional partnership.",
    bioModerationStatus: "approved",
    prompts: [
      {
        id: "pmp_4",
        question: "My simple pleasures...",
        answer: "Sunday morning espresso, quiet architectural sketches, and playing 9 holes before the heat.",
        moderationStatus: "approved",
      },
      {
        id: "pmp_5",
        question: "I value...",
        answer: "Integrity, punctuality, and people who do what they say they will do.",
        moderationStatus: "approved",
      },
    ],
    interests: ["Architecture", "Golf", "Live Jazz", "Real Estate", "Wine Tasting", "Tennis"],
    lifestyle: {
      smoking: "Never",
      drinking: "Moderately at dinner",
      workout: "3-4 times a week",
      pets: "No pets currently",
      starSign: "Scorpio",
    },
    datingPreferences: {
      relationshipGoals: "Long-term relationship / marriage",
      preferredGender: "women",
      ageMin: 24,
      ageMax: 32,
      maxDistanceKm: 250,
      openToLongDistance: true,
      verifiedOnly: true,
    },
    photos: [
      {
        id: "med_p2_1",
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
        type: "photo",
        isPrimary: true,
        reviewStatus: "approved",
        uploadDate: "2025-07-04T12:00:00Z",
        dimensions: "1080x1350",
        fileSize: "1.6 MB",
        reviewedAt: "2025-07-04T12:15:00Z",
        reviewedBy: "Admin Staff (Sarah T.)",
      },
      {
        id: "med_p2_2",
        url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
        type: "photo",
        isPrimary: false,
        reviewStatus: "approved",
        uploadDate: "2025-07-04T12:05:00Z",
        dimensions: "1080x1350",
        fileSize: "1.3 MB",
        reviewedAt: "2025-07-04T12:15:00Z",
        reviewedBy: "Admin Staff (Sarah T.)",
      },
      {
        id: "med_p2_3",
        url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80",
        type: "photo",
        isPrimary: false,
        reviewStatus: "pending", // NEW PENDING PHOTO
        uploadDate: "2026-11-09T08:30:00Z",
        dimensions: "1080x1350",
        fileSize: "1.9 MB",
        flags: ["Newly uploaded", "Awaiting moderator sign-off"],
      },
    ],
    videos: [],
    completionPercentage: 88,
    qualityBreakdown: {
      overallPercentage: 88,
      sectionScores: {
        personalInfo: 100,
        bio: 100,
        prompts: 90,
        photos: 80,
        interests: 100,
        lifestyle: 100,
      },
      missingSections: ["Introductory video", "Third profile prompt"],
      recommendations: ["Add a 15-second intro video to boost match rate by up to 3x."],
    },
    verification: {
      overallStatus: "verified",
      email: { status: "verified", email: "david.king@outlook.com", verifiedAt: "2025-07-04T12:02:00Z" },
      phone: { status: "verified", phone: "+234 802 334 5566", verifiedAt: "2025-07-04T12:03:00Z" },
      photo: {
        status: "verified",
        selfieUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        confidenceScore: 98.6,
        reviewedAt: "2025-07-05T09:00:00Z",
        reviewedBy: "Admin Staff (Sarah T.)",
      },
      identity: {
        status: "verified",
        documentType: "drivers_license",
        documentNumberMasked: "FCT****91",
        reviewedAt: "2025-07-05T09:10:00Z",
        reviewedBy: "Senior Verifier (K. Adebayo)",
        expiryDate: "2028-10-14",
      },
      lastUpdated: "2025-07-05T09:10:00Z",
    },
    moderationStatus: "under_review",
    moderationReason: "Newly added gym photo in review queue",
    visibility: "discoverable",
    reportsCount: 0,
    reports: [],
    automatedChecks: [
      {
        id: "chk_5",
        checkType: "image_screening",
        name: "Pending Photo Screening",
        status: "needs_review",
        details: "Photo 3 contains athletic attire; flagged for standard human review.",
        confidenceScore: 92.1,
        timestamp: "2026-11-09T08:31:00Z",
      },
    ],
    automatedReviewSummary: "needs_human_review",
    datingMetrics: {
      likesSent: 512,
      likesReceived: 980,
      matches: 76,
      profileViews: 3200,
      superLikesReceived: 42,
    },
    historyLog: [
      {
        id: "log_3",
        timestamp: "2026-11-09T08:30:00Z",
        adminName: "System",
        action: "New Photo Uploaded",
        category: "media",
        details: "User uploaded Photo #3. Queued for visual review.",
        severity: "normal",
      },
    ],
    createdAt: "2025-07-04T11:50:00Z",
    updatedAt: "2026-11-09T08:30:00Z",
  },
  {
    id: "prf_nb_90423",
    userId: "usr_nb_90423",
    fullName: "Zara Love",
    legalNameMasked: "Zara E. Love-Sterling",
    username: "@zara_love",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    email: "zara.love@gmail.com",
    phone: "+1 212 555 0194",
    dateOfBirth: "2000-03-22",
    gender: "female",
    pronouns: "she/her",
    country: "United States",
    countryCode: "US",
    stateRegion: "New York",
    city: "New York (Manhattan)",
    occupation: "Digital Creator & Luxury Travel Vlogger",
    education: "B.A. Media Arts, NYU Tisch",
    languages: ["English", "Spanish"],
    bio: "NYC based creative exploring the world one passport stamp at a time. Host on NobleBond Live every Thursday! Looking for an ambitious, adventurous soulmate.",
    bioModerationStatus: "approved",
    prompts: [
      {
        id: "pmp_6",
        question: "The award for best travel partner goes to...",
        answer: "Someone who doesn't panic during airport delays and always finds the best local bakery.",
        moderationStatus: "approved",
      },
    ],
    interests: ["Travel", "Live Streaming", "Fine Dining", "Pilates", "Photography", "Fashion"],
    lifestyle: {
      smoking: "Never",
      drinking: "Champagne on celebrations",
      workout: "Daily",
      pets: "French Bulldog named Coco",
      starSign: "Aries",
    },
    datingPreferences: {
      relationshipGoals: "Long-term relationship with global flexibility",
      preferredGender: "men",
      ageMin: 26,
      ageMax: 36,
      maxDistanceKm: 500,
      openToLongDistance: true,
      verifiedOnly: true,
    },
    photos: [
      {
        id: "med_p3_1",
        url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
        type: "photo",
        isPrimary: true,
        reviewStatus: "approved",
        uploadDate: "2025-06-18T10:00:00Z",
        reviewedAt: "2025-06-18T10:30:00Z",
        reviewedBy: "AI Shield v4",
      },
      {
        id: "med_p3_2",
        url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
        type: "photo",
        isPrimary: false,
        reviewStatus: "approved",
        uploadDate: "2025-06-18T10:05:00Z",
        reviewedAt: "2025-06-18T10:30:00Z",
        reviewedBy: "AI Shield v4",
      },
    ],
    videos: [
      {
        id: "med_v3_1",
        url: "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-neon-light-41865-large.mp4",
        type: "video",
        isPrimary: false,
        reviewStatus: "approved",
        uploadDate: "2025-09-10T15:00:00Z",
        reviewedAt: "2025-09-10T16:00:00Z",
        reviewedBy: "Admin Staff (Sarah T.)",
      },
    ],
    completionPercentage: 98,
    qualityBreakdown: {
      overallPercentage: 98,
      sectionScores: { personalInfo: 100, bio: 100, prompts: 95, photos: 100, interests: 100, lifestyle: 100 },
      missingSections: [],
      recommendations: ["Profile is top tier and featured on Live Discovery."],
    },
    verification: {
      overallStatus: "verified",
      email: { status: "verified", email: "zara.love@gmail.com", verifiedAt: "2025-06-18T09:40:00Z" },
      phone: { status: "verified", phone: "+1 212 555 0194", verifiedAt: "2025-06-18T09:42:00Z" },
      photo: {
        status: "verified",
        selfieUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
        confidenceScore: 99.8,
        reviewedAt: "2025-06-18T11:00:00Z",
        reviewedBy: "AI Biometrics",
      },
      identity: {
        status: "verified",
        documentType: "national_passport",
        documentNumberMasked: "USA****54",
        reviewedAt: "2025-06-19T14:00:00Z",
        reviewedBy: "Lead Auditor (M. Henderson)",
        expiryDate: "2033-01-15",
      },
      lastUpdated: "2025-06-19T14:00:00Z",
    },
    moderationStatus: "approved",
    visibility: "discoverable",
    reportsCount: 0,
    reports: [],
    automatedChecks: [
      {
        id: "chk_6",
        checkType: "image_screening",
        name: "Media Safety",
        status: "passed",
        details: "High aesthetic quality, passed all checks.",
        timestamp: "2025-06-18T10:30:00Z",
      },
    ],
    automatedReviewSummary: "passed",
    datingMetrics: { likesSent: 120, likesReceived: 3410, matches: 154, profileViews: 9840, superLikesReceived: 290 },
    historyLog: [],
    createdAt: "2025-06-18T09:30:00Z",
    updatedAt: "2026-11-09T09:15:00Z",
  },
  {
    id: "prf_nb_90424",
    userId: "usr_nb_90424",
    fullName: "Jayden Cole",
    legalNameMasked: "Jayden M. Cole",
    username: "@jayden_cole",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
    email: "jayden.cole@techventures.io",
    phone: "+44 7700 900123",
    dateOfBirth: "1996-08-30",
    gender: "male",
    pronouns: "he/him",
    country: "United Kingdom",
    countryCode: "GB",
    stateRegion: "Greater London",
    city: "London (Kensington)",
    occupation: "Fintech Product Lead & Angel Investor",
    education: "B.Sc. Computer Science & Economics, UCL",
    languages: ["English"],
    bio: "Building financial tools between London and Lagos. Big fan of early morning runs, contemporary galleries, and thoughtful conversations over good dinner.",
    bioModerationStatus: "approved",
    prompts: [
      {
        id: "pmp_7",
        question: "What's your type?",
        answer: "Kind, intellectually curious, independent, and values deep loyalty.",
        moderationStatus: "approved",
      },
    ],
    interests: ["Fintech", "Marathon Running", "Contemporary Art", "Podcasts", "Specialty Coffee"],
    lifestyle: {
      smoking: "Never",
      drinking: "Craft cocktails occasionally",
      workout: "5 times a week",
      pets: "None",
      starSign: "Virgo",
    },
    datingPreferences: {
      relationshipGoals: "Long-term relationship",
      preferredGender: "women",
      ageMin: 23,
      ageMax: 30,
      maxDistanceKm: 100,
      openToLongDistance: true,
      verifiedOnly: true,
    },
    photos: [
      {
        id: "med_p4_1",
        url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
        type: "photo",
        isPrimary: true,
        reviewStatus: "approved",
        uploadDate: "2025-09-02T11:00:00Z",
      },
      {
        id: "med_p4_2",
        url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
        type: "photo",
        isPrimary: false,
        reviewStatus: "flagged",
        rejectionCategory: "fake_misleading",
        rejectionReason: "Heavy filter modification flagged by automated visual screening.",
        uploadDate: "2026-11-08T18:00:00Z",
        flags: ["Excessive smoothing filter detected"],
      },
    ],
    videos: [],
    completionPercentage: 86,
    qualityBreakdown: {
      overallPercentage: 86,
      sectionScores: { personalInfo: 100, bio: 100, prompts: 80, photos: 75, interests: 90, lifestyle: 90 },
      missingSections: ["Second video", "Two photo slots empty"],
      recommendations: ["Replace flagged filtered photo with an unedited portrait."],
    },
    verification: {
      overallStatus: "partially_verified",
      email: { status: "verified", email: "jayden.cole@techventures.io", verifiedAt: "2025-09-02T11:02:00Z" },
      phone: { status: "verified", phone: "+44 7700 900123", verifiedAt: "2025-09-02T11:03:00Z" },
      photo: { status: "pending", notes: "Selfie submitted; awaits moderator facial comparison." },
      identity: { status: "unverified" },
      lastUpdated: "2026-11-08T18:00:00Z",
    },
    moderationStatus: "flagged",
    moderationReason: "Photo #2 flagged for heavy filter alteration",
    visibility: "discoverable",
    reportsCount: 0,
    reports: [],
    automatedChecks: [
      {
        id: "chk_7",
        checkType: "image_screening",
        name: "Filter & Manipulation Check",
        status: "flagged",
        details: "Photo 2 exhibits 84% unnatural facial smoothing.",
        confidenceScore: 84.0,
        timestamp: "2026-11-08T18:02:00Z",
      },
    ],
    automatedReviewSummary: "flagged",
    datingMetrics: { likesSent: 410, likesReceived: 790, matches: 62, profileViews: 2840, superLikesReceived: 31 },
    historyLog: [
      {
        id: "log_4",
        timestamp: "2026-11-08T18:02:00Z",
        adminName: "AI Shield v4",
        action: "Media Flagged",
        category: "media",
        details: "Photo #2 marked as flagged due to high filter modification confidence.",
        severity: "warning",
      },
    ],
    createdAt: "2025-09-02T10:45:00Z",
    updatedAt: "2026-11-08T18:02:00Z",
  },
  {
    id: "prf_nb_90425",
    userId: "usr_nb_90425",
    fullName: "Lily Rose",
    legalNameMasked: "Lily M. Rose",
    username: "@lily_rose",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    email: "lily.rose@designstudio.fr",
    phone: "+33 6 12 34 56 78",
    dateOfBirth: "2001-02-14",
    gender: "female",
    pronouns: "she/her",
    country: "France",
    countryCode: "FR",
    stateRegion: "Île-de-France",
    city: "Paris (Le Marais)",
    occupation: "Fashion Illustrator & Luxury Brand Consultant",
    education: "Master of Fine Arts, École des Beaux-Arts Paris",
    languages: ["French", "English", "Italian"],
    bio: "Currently taking a short pause from dating while traveling for Paris Fashion Week. Profile approved and verified.",
    bioModerationStatus: "approved",
    prompts: [
      {
        id: "pmp_8",
        question: "Single and searching for...",
        answer: "A calm, kind gentleman who loves classic cinema and thoughtful museum strolls.",
        moderationStatus: "approved",
      },
    ],
    interests: ["Fashion", "Fine Arts", "Museums", "Vintage Cinema", "French Pastries"],
    lifestyle: {
      smoking: "Never",
      drinking: "Socially with French wine",
      workout: "Yoga & Pilates",
      pets: "Siamese cat named Belle",
      starSign: "Aquarius",
    },
    datingPreferences: {
      relationshipGoals: "Long-term relationship",
      preferredGender: "men",
      ageMin: 25,
      ageMax: 34,
      maxDistanceKm: 200,
      openToLongDistance: true,
      verifiedOnly: true,
    },
    photos: [
      {
        id: "med_p5_1",
        url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
        type: "photo",
        isPrimary: true,
        reviewStatus: "approved",
        uploadDate: "2025-07-20T14:00:00Z",
      },
    ],
    videos: [],
    completionPercentage: 92,
    qualityBreakdown: {
      overallPercentage: 92,
      sectionScores: { personalInfo: 100, bio: 100, prompts: 90, photos: 90, interests: 95, lifestyle: 100 },
      missingSections: ["Video introduction"],
      recommendations: ["Upload video to complete profile."],
    },
    verification: {
      overallStatus: "verified",
      email: { status: "verified", email: "lily.rose@designstudio.fr", verifiedAt: "2025-07-20T14:02:00Z" },
      phone: { status: "verified", phone: "+33 6 12 34 56 78", verifiedAt: "2025-07-20T14:03:00Z" },
      photo: { status: "verified", confidenceScore: 98.9, reviewedAt: "2025-07-21T10:00:00Z", reviewedBy: "AI Shield" },
      identity: { status: "verified", documentType: "national_id", reviewedAt: "2025-07-21T11:00:00Z" },
      lastUpdated: "2025-07-21T11:00:00Z",
    },
    moderationStatus: "approved",
    // NOTE: Paused by user voluntarily — NOT a policy violation!
    visibility: "paused_by_user",
    visibilityReason: "User manually toggled 'Snooze Discovery' while traveling in Europe.",
    visibilityChangedAt: "2026-11-05T12:00:00Z",
    reportsCount: 0,
    reports: [],
    automatedChecks: [
      {
        id: "chk_8",
        checkType: "required_info",
        name: "Baseline Compliance",
        status: "passed",
        details: "All fields complete and compliant.",
        timestamp: "2025-07-20T14:05:00Z",
      },
    ],
    automatedReviewSummary: "passed",
    datingMetrics: { likesSent: 85, likesReceived: 1840, matches: 72, profileViews: 4950, superLikesReceived: 94 },
    historyLog: [
      {
        id: "log_5",
        timestamp: "2026-11-05T12:00:00Z",
        adminName: "User (Self-action)",
        action: "Discovery Paused",
        category: "visibility",
        details: "Member paused discovery mode voluntarily from mobile settings. Account in good standing.",
        severity: "normal",
      },
    ],
    createdAt: "2025-07-20T13:50:00Z",
    updatedAt: "2026-11-05T12:00:00Z",
  },
  {
    id: "prf_nb_90426",
    userId: "usr_nb_90426",
    fullName: "Tobi Bakare",
    legalNameMasked: "Oluwatobi J. Bakare",
    username: "@tobi_bakare",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    email: "tobi.bakare@lagostech.ng",
    phone: "+234 809 112 3344",
    dateOfBirth: "1997-10-10",
    gender: "male",
    pronouns: "he/him",
    country: "Nigeria",
    countryCode: "NG",
    stateRegion: "Lagos State",
    city: "Lagos (Lekki Phase 1)",
    occupation: "Software Engineer & Music Producer",
    education: "B.Eng. Computer Engineering, Covenant University",
    languages: ["English", "Yoruba"],
    bio: "Living between code lines and studio synthesizers. Love good energy, honest vibes, and outdoor rooftop barbecues with close friends.",
    bioModerationStatus: "approved",
    prompts: [
      {
        id: "pmp_9",
        question: "Good vibes only...",
        answer: "No unnecessary drama, genuine mutual respect, and laughs guaranteed.",
        moderationStatus: "approved",
      },
    ],
    interests: ["Music Production", "Coding", "Afrobeats", "Gaming", "Basketball"],
    lifestyle: {
      smoking: "Never",
      drinking: "Socially",
      workout: "Gym 3x weekly",
      pets: "None",
      starSign: "Libra",
    },
    datingPreferences: {
      relationshipGoals: "Long-term relationship",
      preferredGender: "women",
      ageMin: 22,
      ageMax: 29,
      maxDistanceKm: 80,
      openToLongDistance: false,
      verifiedOnly: false,
    },
    photos: [
      {
        id: "med_p6_1",
        url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
        type: "photo",
        isPrimary: true,
        reviewStatus: "approved",
        uploadDate: "2025-08-01T12:00:00Z",
      },
      {
        id: "med_p6_2",
        url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
        type: "photo",
        isPrimary: false,
        reviewStatus: "approved",
        uploadDate: "2025-08-01T12:10:00Z",
      },
    ],
    videos: [],
    completionPercentage: 82,
    qualityBreakdown: {
      overallPercentage: 82,
      sectionScores: { personalInfo: 90, bio: 90, prompts: 75, photos: 75, interests: 85, lifestyle: 90 },
      missingSections: ["Identity verification", "Video clip"],
      recommendations: ["Submit National ID to unlock the blue NobleBond verification badge."],
    },
    verification: {
      overallStatus: "partially_verified",
      email: { status: "verified", email: "tobi.bakare@lagostech.ng", verifiedAt: "2025-08-01T12:02:00Z" },
      phone: { status: "verified", phone: "+234 809 112 3344", verifiedAt: "2025-08-01T12:03:00Z" },
      photo: { status: "unverified" },
      identity: { status: "unverified" },
      lastUpdated: "2025-08-01T12:03:00Z",
    },
    moderationStatus: "approved",
    visibility: "discoverable",
    reportsCount: 0,
    reports: [],
    automatedChecks: [
      {
        id: "chk_9",
        checkType: "required_info",
        name: "Demographic Validation",
        status: "passed",
        details: "Clean record, standard signup.",
        timestamp: "2025-08-01T12:05:00Z",
      },
    ],
    automatedReviewSummary: "passed",
    datingMetrics: { likesSent: 380, likesReceived: 490, matches: 38, profileViews: 1980, superLikesReceived: 14 },
    historyLog: [],
    createdAt: "2025-08-01T11:45:00Z",
    updatedAt: "2026-11-07T14:30:00Z",
  },
  {
    id: "prf_nb_90427",
    userId: "usr_nb_90427",
    fullName: "Marcus Sterling",
    legalNameMasked: "Marcus A. Sterling",
    username: "@marcus_sterling",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    email: "marcus.sterling@sterlingcapital.com",
    phone: "+1 415 555 0188",
    dateOfBirth: "1990-04-12",
    gender: "male",
    pronouns: "he/him",
    country: "United States",
    countryCode: "US",
    stateRegion: "California",
    city: "San Francisco (Pacific Heights)",
    occupation: "Venture Partner & Private Equity Investor",
    education: "MBA Stanford Graduate School of Business",
    languages: ["English", "Mandarin"],
    bio: "Investing in frontier technology and enjoying life outside the boardroom. Avid sailor, collector of rare books, and believer in intentional partnerships.",
    bioModerationStatus: "approved",
    prompts: [
      {
        id: "pmp_10",
        question: "My ideal Sunday looks like...",
        answer: "A morning sail on the bay, farmers market fresh produce, and cooking dinner with someone special.",
        moderationStatus: "approved",
      },
    ],
    interests: ["Sailing", "Venture Capital", "Wine Collector", "Classic Literature", "Tennis"],
    lifestyle: {
      smoking: "Never",
      drinking: "Fine wine with dinner",
      workout: "Daily sailing / gym",
      pets: "Labrador Retriever named Sailor",
      starSign: "Aries",
    },
    datingPreferences: {
      relationshipGoals: "Long-term relationship leading to marriage",
      preferredGender: "women",
      ageMin: 26,
      ageMax: 36,
      maxDistanceKm: 300,
      openToLongDistance: true,
      verifiedOnly: true,
    },
    photos: [
      {
        id: "med_p7_1",
        url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
        type: "photo",
        isPrimary: true,
        reviewStatus: "approved",
        uploadDate: "2025-05-14T08:00:00Z",
      },
    ],
    videos: [],
    completionPercentage: 96,
    qualityBreakdown: {
      overallPercentage: 96,
      sectionScores: { personalInfo: 100, bio: 100, prompts: 95, photos: 95, interests: 100, lifestyle: 100 },
      missingSections: [],
      recommendations: ["Profile fully optimized."],
    },
    verification: {
      overallStatus: "verified",
      email: { status: "verified", email: "marcus.sterling@sterlingcapital.com", verifiedAt: "2025-05-14T08:05:00Z" },
      phone: { status: "verified", phone: "+1 415 555 0188", verifiedAt: "2025-05-14T08:06:00Z" },
      photo: { status: "verified", confidenceScore: 99.1, reviewedAt: "2025-05-15T10:00:00Z" },
      identity: { status: "verified", documentType: "national_passport", reviewedAt: "2025-05-15T11:00:00Z" },
      lastUpdated: "2025-05-15T11:00:00Z",
    },
    moderationStatus: "approved",
    visibility: "discoverable",
    reportsCount: 0,
    reports: [],
    automatedChecks: [
      {
        id: "chk_10",
        checkType: "required_info",
        name: "Compliance Audit",
        status: "passed",
        details: "Clean compliance record.",
        timestamp: "2025-05-14T08:10:00Z",
      },
    ],
    automatedReviewSummary: "passed",
    datingMetrics: { likesSent: 290, likesReceived: 2150, matches: 110, profileViews: 7300, superLikesReceived: 180 },
    historyLog: [],
    createdAt: "2025-05-14T07:50:00Z",
    updatedAt: "2026-11-09T08:00:00Z",
  },
  {
    id: "prf_nb_90428",
    userId: "usr_nb_90428",
    fullName: "Chloe Dupont",
    legalNameMasked: "Chloe A. Dupont",
    username: "@chloe_dupont",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    email: "chloe.dupont@archilux.ca",
    phone: "+1 514 555 0177",
    dateOfBirth: "1997-06-18",
    gender: "female",
    pronouns: "she/her",
    country: "Canada",
    countryCode: "CA",
    stateRegion: "Quebec",
    city: "Montreal (Old Montreal)",
    occupation: "Urban Designer & Architectural Photographer",
    education: "Master of Architecture, McGill University",
    languages: ["French", "English"],
    bio: "Fascinated by historical masonry and Nordic winter escapes. Seeking someone witty, intellectually stimulating, and genuine.",
    bioModerationStatus: "approved",
    prompts: [
      {
        id: "pmp_11",
        question: "Dating me is like...",
        answer: "Always discovering hidden coffee spots and having a personal tour guide in every city.",
        moderationStatus: "approved",
      },
    ],
    interests: ["Urban Design", "Architecture", "Photography", "Nordic Spa", "Specialty Roasters"],
    lifestyle: {
      smoking: "Never",
      drinking: "Socially",
      workout: "Swimming & Bouldering",
      pets: "Cat named Oslo",
      starSign: "Gemini",
    },
    datingPreferences: {
      relationshipGoals: "Long-term relationship",
      preferredGender: "men",
      ageMin: 27,
      ageMax: 37,
      maxDistanceKm: 150,
      openToLongDistance: true,
      verifiedOnly: true,
    },
    photos: [
      {
        id: "med_p8_1",
        url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
        type: "photo",
        isPrimary: true,
        reviewStatus: "approved",
        uploadDate: "2025-08-22T09:00:00Z",
      },
      {
        id: "med_p8_2",
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        type: "photo",
        isPrimary: false,
        reviewStatus: "pending", // Photo pending review
        uploadDate: "2026-11-09T07:15:00Z",
        flags: ["New photo upload", "Needs visual verification"],
      },
    ],
    videos: [],
    completionPercentage: 90,
    qualityBreakdown: {
      overallPercentage: 90,
      sectionScores: { personalInfo: 100, bio: 100, prompts: 90, photos: 85, interests: 90, lifestyle: 100 },
      missingSections: ["Intro video clip"],
      recommendations: ["Awaiting approval of photo #2."],
    },
    verification: {
      overallStatus: "partially_verified",
      email: { status: "verified", email: "chloe.dupont@archilux.ca", verifiedAt: "2025-08-22T09:05:00Z" },
      phone: { status: "verified", phone: "+1 514 555 0177", verifiedAt: "2025-08-22T09:06:00Z" },
      photo: { status: "verified", confidenceScore: 97.4, reviewedAt: "2025-08-23T11:00:00Z" },
      identity: { status: "pending", documentType: "national_passport", notes: "Passport scan uploaded, in verification queue." },
      lastUpdated: "2026-11-09T07:15:00Z",
    },
    moderationStatus: "under_review",
    moderationReason: "Pending photo #2 review and passport verification",
    visibility: "discoverable",
    reportsCount: 0,
    reports: [],
    automatedChecks: [
      {
        id: "chk_11",
        checkType: "image_screening",
        name: "Photo #2 Screening",
        status: "needs_review",
        details: "Clean portrait; ready for admin sign-off.",
        confidenceScore: 95.0,
        timestamp: "2026-11-09T07:16:00Z",
      },
    ],
    automatedReviewSummary: "needs_human_review",
    datingMetrics: { likesSent: 190, likesReceived: 890, matches: 45, profileViews: 2450, superLikesReceived: 38 },
    historyLog: [],
    createdAt: "2025-08-22T08:50:00Z",
    updatedAt: "2026-11-09T07:15:00Z",
  },
  {
    id: "prf_nb_90429",
    userId: "usr_nb_90429",
    fullName: "Kofi Mensah",
    legalNameMasked: "Kofi K. Mensah",
    username: "@kofi_mensah",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    email: "kofi.mensah@ghanacapital.com",
    phone: "+233 24 555 6789",
    dateOfBirth: "1993-01-25",
    gender: "male",
    pronouns: "he/him",
    country: "Ghana",
    countryCode: "GH",
    stateRegion: "Greater Accra",
    city: "Accra (Airport Residential)",
    occupation: "Agri-Tech Founder & Export Director",
    education: "B.Sc. Agribusiness, KNUST Kumasi",
    languages: ["English", "Twi"],
    bio: "Exporting high quality organic cocoa and cashews across West Africa and Europe. In my free time, catching sunsets at Labadi beach or hosting friends for grilled tilapia.",
    bioModerationStatus: "flagged",
    bioModerationReason: "Reported for including business promotion in dating biography.",
    prompts: [
      {
        id: "pmp_12",
        question: "A life goal of mine is...",
        answer: "Transforming smallholder agriculture across the continent and finding a partner to share the journey.",
        moderationStatus: "approved",
      },
    ],
    interests: ["Agribusiness", "West African Food", "Beach Volleyball", "Economic Development", "Afrobeats"],
    lifestyle: {
      smoking: "Never",
      drinking: "Occasionally at social events",
      workout: "3 times a week",
      pets: "None",
      starSign: "Aquarius",
    },
    datingPreferences: {
      relationshipGoals: "Marriage-minded relationship",
      preferredGender: "women",
      ageMin: 24,
      ageMax: 32,
      maxDistanceKm: 200,
      openToLongDistance: true,
      verifiedOnly: false,
    },
    photos: [
      {
        id: "med_p9_1",
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
        type: "photo",
        isPrimary: true,
        reviewStatus: "approved",
        uploadDate: "2025-07-15T12:00:00Z",
      },
    ],
    videos: [],
    completionPercentage: 85,
    qualityBreakdown: {
      overallPercentage: 85,
      sectionScores: { personalInfo: 90, bio: 70, prompts: 85, photos: 85, interests: 90, lifestyle: 90 },
      missingSections: ["Second video", "Unresolved user report on commercial promotion"],
      recommendations: ["Review bio and remove commercial export links."],
    },
    verification: {
      overallStatus: "partially_verified",
      email: { status: "verified", email: "kofi.mensah@ghanacapital.com", verifiedAt: "2025-07-15T12:05:00Z" },
      phone: { status: "verified", phone: "+233 24 555 6789", verifiedAt: "2025-07-15T12:06:00Z" },
      photo: { status: "verified", confidenceScore: 96.2, reviewedAt: "2025-07-16T10:00:00Z" },
      identity: { status: "unverified" },
      lastUpdated: "2025-07-16T10:00:00Z",
    },
    moderationStatus: "flagged",
    moderationReason: "Unresolved report: Commercial promotion suspected in dating bio",
    visibility: "discoverable",
    reportsCount: 1,
    reports: [
      {
        id: "rep_nb_101",
        reporterUserIdMasked: "usr_***_883",
        reporterNameMasked: "Member #883",
        category: "scam",
        reason: "User bio promotes an agricultural export venture and asks members to message about business deals instead of dating.",
        priority: "medium",
        status: "investigating",
        createdAt: "2026-11-08T14:20:00Z",
        reportedContentSnippet: "Exporting high quality organic cocoa... contact my export desk for business deals.",
      },
    ],
    automatedChecks: [
      {
        id: "chk_12",
        checkType: "suspicious_patterns",
        name: "Commercial Keyword Trigger",
        status: "flagged",
        details: "Keywords 'export desk', 'deals' detected in user bio.",
        timestamp: "2026-11-08T14:22:00Z",
      },
    ],
    automatedReviewSummary: "flagged",
    datingMetrics: { likesSent: 260, likesReceived: 410, matches: 28, profileViews: 1420, superLikesReceived: 12 },
    historyLog: [
      {
        id: "log_6",
        timestamp: "2026-11-08T14:20:00Z",
        adminName: "System",
        action: "Report Filed",
        category: "report",
        details: "Commercial promotion report filed by member usr_***_883. Moderation ticket created.",
        severity: "warning",
      },
    ],
    createdAt: "2025-07-15T11:30:00Z",
    updatedAt: "2026-11-08T14:22:00Z",
  },
  {
    id: "prf_nb_90430",
    userId: "usr_nb_90430",
    fullName: "Elena Volkov",
    legalNameMasked: "Elena V. Volkov",
    username: "@elena_v",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    email: "elena.volkov@berlinfin.de",
    phone: "+49 30 555 4321",
    dateOfBirth: "1999-07-19",
    gender: "female",
    pronouns: "she/her",
    country: "Germany",
    countryCode: "DE",
    stateRegion: "Berlin",
    city: "Berlin (Mitte)",
    occupation: "Cryptographic Protocol Researcher & Pianist",
    education: "M.Sc. Pure Mathematics, Humboldt University Berlin",
    languages: ["German", "English", "Russian"],
    bio: "Passionate about zero-knowledge cryptography, classical piano sonatas, and cold winter cycling through Tiergarten. Looking for an authentic connection.",
    bioModerationStatus: "approved",
    prompts: [
      {
        id: "pmp_13",
        question: "Don't hate me if I...",
        answer: "Get completely absorbed in a math proof or piano piece for three hours straight without checking my phone.",
        moderationStatus: "approved",
      },
    ],
    interests: ["Mathematics", "Classical Piano", "Cycling", "Contemporary Philosophy", "Tea Culture"],
    lifestyle: {
      smoking: "Never",
      drinking: "Occasional herbal drinks",
      workout: "Cycling daily",
      pets: "None",
      starSign: "Cancer",
    },
    datingPreferences: {
      relationshipGoals: "Long-term relationship",
      preferredGender: "men",
      ageMin: 25,
      ageMax: 35,
      maxDistanceKm: 120,
      openToLongDistance: true,
      verifiedOnly: true,
    },
    photos: [
      {
        id: "med_p10_1",
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        type: "photo",
        isPrimary: true,
        reviewStatus: "approved",
        uploadDate: "2025-09-12T14:00:00Z",
      },
      {
        id: "med_p10_2",
        url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
        type: "photo",
        isPrimary: false,
        reviewStatus: "rejected",
        rejectionCategory: "low_quality",
        rejectionReason: "Resolution below 300x300, pixelated and blurred face.",
        uploadDate: "2026-11-07T11:00:00Z",
        reviewedAt: "2026-11-07T11:15:00Z",
        reviewedBy: "Admin Staff (Sarah T.)",
      },
    ],
    videos: [],
    completionPercentage: 78,
    qualityBreakdown: {
      overallPercentage: 78,
      sectionScores: { personalInfo: 90, bio: 95, prompts: 70, photos: 65, interests: 85, lifestyle: 85 },
      missingSections: ["Replacement for rejected low-res photo #2", "Identity check"],
      recommendations: ["User prompted to upload higher resolution portrait."],
    },
    verification: {
      overallStatus: "pending",
      email: { status: "verified", email: "elena.volkov@berlinfin.de", verifiedAt: "2025-09-12T14:03:00Z" },
      phone: { status: "verified", phone: "+49 30 555 4321", verifiedAt: "2025-09-12T14:04:00Z" },
      photo: { status: "pending", selfieUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80", notes: "Liveness score passed; awaiting final match." },
      identity: { status: "unverified" },
      lastUpdated: "2026-11-07T11:15:00Z",
    },
    moderationStatus: "under_review",
    moderationReason: "One rejected photo; awaiting user replacement",
    visibility: "discoverable",
    reportsCount: 0,
    reports: [],
    automatedChecks: [
      {
        id: "chk_13",
        checkType: "image_screening",
        name: "Resolution Verification",
        status: "flagged",
        details: "Photo #2 rejected due to low resolution (240x240 px).",
        confidenceScore: 99.0,
        timestamp: "2026-11-07T11:02:00Z",
      },
    ],
    automatedReviewSummary: "needs_human_review",
    datingMetrics: { likesSent: 140, likesReceived: 620, matches: 34, profileViews: 1720, superLikesReceived: 21 },
    historyLog: [
      {
        id: "log_7",
        timestamp: "2026-11-07T11:15:00Z",
        adminName: "Admin Staff (Sarah T.)",
        action: "Photo Rejected",
        category: "media",
        details: "Photo #2 rejected under category 'low_quality'. User received in-app replacement notification.",
        severity: "warning",
      },
    ],
    createdAt: "2025-09-12T13:40:00Z",
    updatedAt: "2026-11-07T11:15:00Z",
  },
  {
    id: "prf_nb_90431",
    userId: "usr_nb_90431",
    fullName: "Tessy Boateng",
    legalNameMasked: "Theresa N. Boateng",
    username: "@tessy_boateng",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    email: "tessy.boateng@accrahealth.gh",
    phone: "+233 20 444 8899",
    dateOfBirth: "1998-12-05",
    gender: "female",
    pronouns: "she/her",
    country: "Ghana",
    countryCode: "GH",
    stateRegion: "Greater Accra",
    city: "Accra (Cantonments)",
    occupation: "Paediatric Resident & Public Health Advocate",
    education: "MBChB Medicine & Surgery, University of Ghana Medical School",
    languages: ["English", "Twi", "Ga"],
    bio: "Caring for little patients by day, exploring live music and African literature on weekends. Looking for someone grounded, compassionate, and family-oriented.",
    bioModerationStatus: "approved",
    prompts: [
      {
        id: "pmp_14",
        question: "I know I've made it when...",
        answer: "My family is healthy, my heart is at peace, and I'm with someone who feels like home.",
        moderationStatus: "approved",
      },
    ],
    interests: ["Paediatrics", "Literature", "Live Music", "Public Health", "Volunteering"],
    lifestyle: {
      smoking: "Never",
      drinking: "Socially on special occasions",
      workout: "Running & Yoga",
      pets: "None",
      starSign: "Sagittarius",
    },
    datingPreferences: {
      relationshipGoals: "Long-term relationship leading to marriage",
      preferredGender: "men",
      ageMin: 27,
      ageMax: 36,
      maxDistanceKm: 150,
      openToLongDistance: true,
      verifiedOnly: true,
    },
    photos: [
      {
        id: "med_p11_1",
        url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
        type: "photo",
        isPrimary: true,
        reviewStatus: "approved",
        uploadDate: "2025-06-25T11:00:00Z",
      },
    ],
    videos: [],
    completionPercentage: 94,
    qualityBreakdown: {
      overallPercentage: 94,
      sectionScores: { personalInfo: 100, bio: 100, prompts: 90, photos: 90, interests: 95, lifestyle: 100 },
      missingSections: ["Introductory video"],
      recommendations: ["Profile is exemplary; consider adding a video prompt."],
    },
    verification: {
      overallStatus: "verified",
      email: { status: "verified", email: "tessy.boateng@accrahealth.gh", verifiedAt: "2025-06-25T11:03:00Z" },
      phone: { status: "verified", phone: "+233 20 444 8899", verifiedAt: "2025-06-25T11:04:00Z" },
      photo: { status: "verified", confidenceScore: 99.2, reviewedAt: "2025-06-26T09:00:00Z" },
      identity: { status: "verified", documentType: "national_passport", reviewedAt: "2025-06-26T10:00:00Z" },
      lastUpdated: "2025-06-26T10:00:00Z",
    },
    moderationStatus: "approved",
    visibility: "discoverable",
    reportsCount: 0,
    reports: [],
    automatedChecks: [
      {
        id: "chk_14",
        checkType: "required_info",
        name: "Standard Baseline Audit",
        status: "passed",
        details: "Compliant across all policy dimensions.",
        timestamp: "2025-06-25T11:05:00Z",
      },
    ],
    automatedReviewSummary: "passed",
    datingMetrics: { likesSent: 210, likesReceived: 1140, matches: 68, profileViews: 3890, superLikesReceived: 62 },
    historyLog: [],
    createdAt: "2025-06-25T10:50:00Z",
    updatedAt: "2026-11-08T16:00:00Z",
  },
  {
    id: "prf_nb_90432",
    userId: "usr_nb_90432",
    fullName: "Victor Okafor",
    legalNameMasked: "Victor C. Okafor",
    username: "@victor_okafor",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    email: "victor.okafor@phlogistic.ng",
    phone: "+234 813 998 7766",
    dateOfBirth: "1995-03-08",
    gender: "male",
    pronouns: "he/him",
    country: "Nigeria",
    countryCode: "NG",
    stateRegion: "Rivers State",
    city: "Port Harcourt (Old GRA)",
    occupation: "Maritime Logistics Specialist",
    education: "B.Sc. Transport Management, Federal University of Technology Owerri",
    languages: ["English", "Igbo"],
    bio: "Work in maritime shipping across the Gulf of Guinea. Love coastal fishing and watching football.",
    bioModerationStatus: "approved",
    prompts: [],
    interests: ["Maritime", "Football", "Fishing"],
    lifestyle: {
      smoking: "Never",
      drinking: "Beer on weekends",
      workout: "Occasional",
      pets: "None",
      starSign: "Pisces",
    },
    datingPreferences: {
      relationshipGoals: "Casual dating / relationship",
      preferredGender: "women",
      ageMin: 22,
      ageMax: 30,
      maxDistanceKm: 100,
      openToLongDistance: false,
      verifiedOnly: false,
    },
    photos: [
      {
        id: "med_p12_1",
        url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
        type: "photo",
        isPrimary: true,
        reviewStatus: "approved",
        uploadDate: "2025-08-30T10:00:00Z",
      },
    ],
    videos: [],
    completionPercentage: 72,
    qualityBreakdown: {
      overallPercentage: 72,
      sectionScores: { personalInfo: 80, bio: 70, prompts: 20, photos: 60, interests: 60, lifestyle: 70 },
      missingSections: ["Prompts incomplete (0 answers)", "Only 1 photo uploaded (minimum 2 recommended)", "Unverified"],
      recommendations: ["Answer at least 2 profile prompts and upload another photo."],
    },
    verification: {
      overallStatus: "partially_verified",
      email: { status: "verified", email: "victor.okafor@phlogistic.ng", verifiedAt: "2025-08-30T10:02:00Z" },
      phone: { status: "unverified", phone: "+234 813 998 7766" },
      photo: { status: "unverified" },
      identity: { status: "unverified" },
      lastUpdated: "2025-08-30T10:02:00Z",
    },
    moderationStatus: "approved",
    visibility: "discoverable",
    reportsCount: 0,
    reports: [],
    automatedChecks: [
      {
        id: "chk_15",
        checkType: "completeness",
        name: "Profile Completeness Check",
        status: "needs_review",
        details: "Profile completion at 72%; meets minimum discoverability threshold but missing prompt context.",
        timestamp: "2025-08-30T10:05:00Z",
      },
    ],
    automatedReviewSummary: "passed",
    datingMetrics: { likesSent: 190, likesReceived: 180, matches: 14, profileViews: 820, superLikesReceived: 3 },
    historyLog: [],
    createdAt: "2025-08-30T09:40:00Z",
    updatedAt: "2026-10-18T12:00:00Z",
  },
  {
    id: "prf_nb_90433",
    userId: "usr_nb_90433",
    fullName: "Brian Kovacs",
    legalNameMasked: "Brian S. Kovacs",
    username: "@brian_kovacs",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    email: "brian.kovacs@gmail.com",
    phone: "+1 647 555 0165",
    dateOfBirth: "1992-09-14",
    gender: "male",
    pronouns: "he/him",
    country: "Canada",
    countryCode: "CA",
    stateRegion: "Ontario",
    city: "Toronto (Yorkville)",
    occupation: "Hedge Fund Trader",
    education: "B.Com. Finance, Rotman School of Management",
    languages: ["English"],
    bio: "Trading commodities and living in downtown Toronto. Seeking ambitious companions.",
    bioModerationStatus: "flagged",
    prompts: [
      {
        id: "pmp_15",
        question: "I spend most of my time...",
        answer: "Analyzing market moves and flying to private islands.",
        moderationStatus: "flagged",
        moderationReason: "Unsubstantiated luxury claims flagged under impersonation complaint.",
      },
    ],
    interests: ["Finance", "Commodities", "Watches", "Private Jets"],
    lifestyle: {
      smoking: "Socially",
      drinking: "Frequently",
      workout: "Gym",
      pets: "None",
      starSign: "Virgo",
    },
    datingPreferences: {
      relationshipGoals: "Casual dating",
      preferredGender: "women",
      ageMin: 20,
      ageMax: 27,
      maxDistanceKm: 100,
      openToLongDistance: true,
      verifiedOnly: false,
    },
    photos: [
      {
        id: "med_p13_1",
        url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
        type: "photo",
        isPrimary: true,
        reviewStatus: "flagged",
        rejectionCategory: "impersonation",
        rejectionReason: "Reported as photos of public social media model.",
        uploadDate: "2025-09-18T10:00:00Z",
      },
    ],
    videos: [],
    completionPercentage: 85,
    qualityBreakdown: {
      overallPercentage: 85,
      sectionScores: { personalInfo: 90, bio: 80, prompts: 70, photos: 60, interests: 80, lifestyle: 85 },
      missingSections: ["Biometric verification failed", "2 Impersonation reports active"],
      recommendations: ["Mandatory video selfie required to prove identity."],
    },
    verification: {
      overallStatus: "rejected",
      email: { status: "verified", email: "brian.kovacs@gmail.com", verifiedAt: "2025-09-18T10:02:00Z" },
      phone: { status: "verified", phone: "+1 647 555 0165", verifiedAt: "2025-09-18T10:03:00Z" },
      photo: {
        status: "rejected",
        notes: "Selfie submitted did not match primary photo (confidence 42%). Suspected catfishing.",
        reviewedAt: "2026-11-06T15:00:00Z",
        reviewedBy: "Biometric Neural Engine v2",
      },
      identity: { status: "rejected", notes: "ID document failed tamper checks." },
      lastUpdated: "2026-11-06T15:00:00Z",
    },
    moderationStatus: "restricted",
    moderationReason: "Multiple reports of impersonation and failed biometric verification.",
    // NOTE: Restricted by Admin — Discovery disabled due to policy violation!
    visibility: "restricted",
    visibilityReason: "Account restricted pending resolution of 2 impersonation reports.",
    visibilityChangedAt: "2026-11-06T15:10:00Z",
    reportsCount: 2,
    reports: [
      {
        id: "rep_nb_102",
        reporterUserIdMasked: "usr_***_311",
        reporterNameMasked: "Member #311",
        category: "fake_profile",
        reason: "These photos belong to a fitness model from Instagram (@kovacs_official). This account is catfishing users.",
        priority: "high",
        status: "investigating",
        createdAt: "2026-11-06T14:00:00Z",
      },
      {
        id: "rep_nb_103",
        reporterUserIdMasked: "usr_***_904",
        reporterNameMasked: "Member #904",
        category: "fake_profile",
        reason: "Refuses to video call and asks for personal telephone numbers immediately.",
        priority: "medium",
        status: "investigating",
        createdAt: "2026-11-06T14:45:00Z",
      },
    ],
    automatedChecks: [
      {
        id: "chk_16",
        checkType: "duplicate_detection",
        name: "Reverse Image Duplicate Detection",
        status: "flagged",
        details: "Photo 1 has 94% visual similarity to indexed public Instagram profile.",
        confidenceScore: 94.0,
        timestamp: "2026-11-06T14:50:00Z",
      },
      {
        id: "chk_17",
        checkType: "verification_status",
        name: "Biometric Liveness Match",
        status: "rejected",
        details: "Biometric confidence score 42% (Threshold is 85%).",
        confidenceScore: 42.0,
        timestamp: "2026-11-06T15:00:00Z",
      },
    ],
    automatedReviewSummary: "flagged",
    datingMetrics: { likesSent: 620, likesReceived: 310, matches: 19, profileViews: 1200, superLikesReceived: 8 },
    historyLog: [
      {
        id: "log_8",
        timestamp: "2026-11-06T15:10:00Z",
        adminName: "Senior Moderator (L. Vance)",
        action: "Profile Restricted",
        category: "moderation",
        details: "Profile restricted from discovery following dual impersonation reports and failed facial comparison.",
        severity: "critical",
      },
    ],
    createdAt: "2025-09-18T09:30:00Z",
    updatedAt: "2026-11-06T15:10:00Z",
  },
  {
    id: "prf_nb_90434",
    userId: "usr_nb_90434",
    fullName: "Richard Blackwood",
    legalNameMasked: "Richard D. Blackwood",
    username: "@richard_blackwood",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    email: "rblackwood.media@gmail.com",
    phone: "+44 7911 123456",
    dateOfBirth: "1988-11-04",
    gender: "male",
    pronouns: "he/him",
    country: "United Kingdom",
    countryCode: "GB",
    stateRegion: "Greater London",
    city: "London (Mayfair)",
    occupation: "Talent Agent & Nightclub Promoter",
    education: "B.A. Event Management, University of Westminster",
    languages: ["English"],
    bio: "Promoting elite London VIP events. DM me on Insta for guestlist entries and model recruitment.",
    bioModerationStatus: "rejected",
    bioModerationReason: "Commercial solicitation and external recruitment strictly prohibited.",
    prompts: [],
    interests: ["Nightlife", "VIP Events", "Clubs"],
    lifestyle: {
      smoking: "Regularly",
      drinking: "Frequently",
      workout: "Never",
      pets: "None",
      starSign: "Scorpio",
    },
    datingPreferences: {
      relationshipGoals: "Casual dating",
      preferredGender: "women",
      ageMin: 18,
      ageMax: 24,
      maxDistanceKm: 50,
      openToLongDistance: false,
      verifiedOnly: false,
    },
    photos: [
      {
        id: "med_p14_1",
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
        type: "photo",
        isPrimary: true,
        reviewStatus: "rejected",
        rejectionCategory: "spam_advertising",
        rejectionReason: "Photo includes promotional banner with external QR code and ticket links.",
        uploadDate: "2025-08-10T14:00:00Z",
        reviewedAt: "2025-08-10T14:20:00Z",
        reviewedBy: "Admin Staff (Sarah T.)",
      },
    ],
    videos: [],
    completionPercentage: 45,
    qualityBreakdown: {
      overallPercentage: 45,
      sectionScores: { personalInfo: 60, bio: 0, prompts: 0, photos: 0, interests: 40, lifestyle: 50 },
      missingSections: ["Valid primary photo", "Bio compliant with policy", "Prompts"],
      recommendations: ["Account rejected for commercial spam."],
    },
    verification: {
      overallStatus: "rejected",
      email: { status: "verified", email: "rblackwood.media@gmail.com", verifiedAt: "2025-08-10T14:02:00Z" },
      phone: { status: "unverified", phone: "+44 7911 123456" },
      photo: { status: "rejected", notes: "QR code banner submitted instead of live human face." },
      identity: { status: "unverified" },
      lastUpdated: "2025-08-10T14:20:00Z",
    },
    moderationStatus: "rejected",
    moderationReason: "Prohibited commercial solicitation, spam promotion and policy violation.",
    visibility: "hidden",
    visibilityReason: "Hidden by administration due to commercial spam.",
    visibilityChangedAt: "2025-08-10T14:25:00Z",
    reportsCount: 3,
    reports: [
      {
        id: "rep_nb_104",
        reporterUserIdMasked: "usr_***_128",
        reporterNameMasked: "Member #128",
        category: "scam",
        reason: "User is not seeking dating. They are soliciting women to attend paid nightclub gigs.",
        priority: "critical",
        status: "resolved",
        createdAt: "2025-08-10T14:15:00Z",
        resolution: "Content removed and account hidden by admin.",
        resolvedAt: "2025-08-10T14:25:00Z",
        resolvedBy: "Admin Staff (Sarah T.)",
      },
    ],
    automatedChecks: [
      {
        id: "chk_18",
        checkType: "image_screening",
        name: "QR Code & Text Detection",
        status: "rejected",
        details: "High density commercial QR code detected overlaying image.",
        confidenceScore: 99.8,
        timestamp: "2025-08-10T14:05:00Z",
      },
      {
        id: "chk_19",
        checkType: "suspicious_patterns",
        name: "Commercial Solicitation Trigger",
        status: "rejected",
        details: "Keyword 'guestlist', 'recruitment' triggered high risk commercial ban.",
        timestamp: "2025-08-10T14:06:00Z",
      },
    ],
    automatedReviewSummary: "rejected_by_policy",
    datingMetrics: { likesSent: 40, likesReceived: 12, matches: 1, profileViews: 210, superLikesReceived: 0 },
    historyLog: [
      {
        id: "log_9",
        timestamp: "2025-08-10T14:25:00Z",
        adminName: "Admin Staff (Sarah T.)",
        action: "Profile Rejected & Hidden",
        category: "moderation",
        details: "Profile rejected and hidden due to prohibited promotional advertising and recruitment.",
        severity: "critical",
      },
    ],
    createdAt: "2025-08-10T13:50:00Z",
    updatedAt: "2025-08-10T14:25:00Z",
  },
];

export function loadProfiles(): AdminProfile[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PROFILES_KEY);
    if (!raw) {
      saveProfiles(INITIAL_DEMO_PROFILES);
      return INITIAL_DEMO_PROFILES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    saveProfiles(INITIAL_DEMO_PROFILES);
    return INITIAL_DEMO_PROFILES;
  } catch (err) {
    console.error("Error reading profiles from localStorage:", err);
    return INITIAL_DEMO_PROFILES;
  }
}

export function saveProfiles(profiles: AdminProfile[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_PROFILES_KEY, JSON.stringify(profiles));
  } catch (err) {
    console.error("Error writing profiles to localStorage:", err);
  }
}

export function resetProfilesToDefault(): AdminProfile[] {
  saveProfiles(INITIAL_DEMO_PROFILES);
  return INITIAL_DEMO_PROFILES;
}

export function getProfileById(id: string): AdminProfile | undefined {
  const profiles = loadProfiles();
  return profiles.find((p) => p.id === id || p.userId === id);
}

export function addAuditLog(entry: Omit<ProfileAuditEntry, "id" | "timestamp">): ProfileAuditEntry {
  const newEntry: ProfileAuditEntry = {
    ...entry,
    id: `pa_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
  };
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PROFILE_AUDIT_KEY);
    const logs: ProfileAuditEntry[] = raw ? JSON.parse(raw) : [];
    logs.unshift(newEntry);
    localStorage.setItem(LOCAL_STORAGE_PROFILE_AUDIT_KEY, JSON.stringify(logs.slice(0, 500)));
  } catch {
    // ignore
  }
  return newEntry;
}

export function updateBioModeration(
  profileId: string,
  status: "approved" | "pending" | "flagged" | "rejected",
  reason?: string
): AdminProfile {
  const profiles = loadProfiles();
  const index = profiles.findIndex((p) => p.id === profileId);
  if (index === -1) throw new Error("Profile not found");

  const p = profiles[index];
  p.bioModerationStatus = status;
  p.bioModerationReason = reason;
  p.updatedAt = new Date().toISOString();

  const audit = addAuditLog({
    adminName: "Super Admin",
    action: `Bio ${status.toUpperCase()}`,
    category: "bio",
    details: `Bio status updated to ${status}.${reason ? ` Reason: ${reason}` : ""}`,
    severity: status === "rejected" || status === "flagged" ? "warning" : "normal",
  });
  p.historyLog.unshift(audit);

  profiles[index] = { ...p };
  saveProfiles(profiles);
  return p;
}

export function updatePromptModeration(
  profileId: string,
  promptId: string,
  status: "approved" | "pending" | "flagged" | "rejected",
  reason?: string
): AdminProfile {
  const profiles = loadProfiles();
  const index = profiles.findIndex((p) => p.id === profileId);
  if (index === -1) throw new Error("Profile not found");

  const p = profiles[index];
  const prompt = p.prompts.find((pr) => pr.id === promptId);
  if (prompt) {
    prompt.moderationStatus = status;
    prompt.moderationReason = reason;
  }
  p.updatedAt = new Date().toISOString();

  const audit = addAuditLog({
    adminName: "Super Admin",
    action: `Prompt ${status.toUpperCase()}`,
    category: "moderation",
    details: `Prompt "${prompt?.question || promptId}" marked as ${status}.${reason ? ` Reason: ${reason}` : ""}`,
    severity: status === "rejected" || status === "flagged" ? "warning" : "normal",
  });
  p.historyLog.unshift(audit);

  profiles[index] = { ...p };
  saveProfiles(profiles);
  return p;
}

export function approveMedia(profileId: string, mediaId: string): AdminProfile {
  const profiles = loadProfiles();
  const index = profiles.findIndex((p) => p.id === profileId);
  if (index === -1) throw new Error("Profile not found");

  const p = profiles[index];
  const photo = p.photos.find((m) => m.id === mediaId);
  const video = p.videos.find((m) => m.id === mediaId);
  const media = photo || video;

  if (media) {
    media.reviewStatus = "approved";
    media.rejectionCategory = undefined;
    media.rejectionReason = undefined;
    media.reviewedAt = new Date().toISOString();
    media.reviewedBy = "Super Admin";
  }

  // If all media approved, update moderationStatus if under_review
  const pendingCount = p.photos.filter((m) => m.reviewStatus === "pending").length +
                       p.videos.filter((m) => m.reviewStatus === "pending").length;
  if (pendingCount === 0 && p.moderationStatus === "under_review") {
    p.moderationStatus = "approved";
  }

  p.updatedAt = new Date().toISOString();

  const audit = addAuditLog({
    adminName: "Super Admin",
    action: "Media Approved",
    category: "media",
    details: `${media?.type === "video" ? "Video" : "Photo"} ID ${mediaId} approved.`,
    severity: "normal",
  });
  p.historyLog.unshift(audit);

  profiles[index] = { ...p };
  saveProfiles(profiles);
  return p;
}

export function rejectMedia(
  profileId: string,
  mediaId: string,
  category: MediaRejectionCategory,
  reason: string
): AdminProfile {
  const profiles = loadProfiles();
  const index = profiles.findIndex((p) => p.id === profileId);
  if (index === -1) throw new Error("Profile not found");

  const p = profiles[index];
  const photo = p.photos.find((m) => m.id === mediaId);
  const video = p.videos.find((m) => m.id === mediaId);
  const media = photo || video;

  if (media) {
    media.reviewStatus = "rejected";
    media.rejectionCategory = category;
    media.rejectionReason = reason;
    media.reviewedAt = new Date().toISOString();
    media.reviewedBy = "Super Admin";
  }

  p.updatedAt = new Date().toISOString();

  const audit = addAuditLog({
    adminName: "Super Admin",
    action: "Media Rejected",
    category: "media",
    details: `${media?.type === "video" ? "Video" : "Photo"} ID ${mediaId} rejected under category "${category}". Reason: ${reason}`,
    severity: "warning",
  });
  p.historyLog.unshift(audit);

  profiles[index] = { ...p };
  saveProfiles(profiles);
  return p;
}

export function requestMediaReplacement(profileId: string, mediaId: string, reason: string): AdminProfile {
  const profiles = loadProfiles();
  const index = profiles.findIndex((p) => p.id === profileId);
  if (index === -1) throw new Error("Profile not found");

  const p = profiles[index];
  const photo = p.photos.find((m) => m.id === mediaId);
  const video = p.videos.find((m) => m.id === mediaId);
  const media = photo || video;

  if (media) {
    media.reviewStatus = "flagged";
    media.rejectionReason = `Replacement requested: ${reason}`;
    media.reviewedAt = new Date().toISOString();
    media.reviewedBy = "Super Admin";
  }

  p.updatedAt = new Date().toISOString();

  const audit = addAuditLog({
    adminName: "Super Admin",
    action: "Media Replacement Requested",
    category: "media",
    details: `User notified to upload replacement for ${media?.type || "media"} ${mediaId}. Note: ${reason}`,
    severity: "warning",
  });
  p.historyLog.unshift(audit);

  profiles[index] = { ...p };
  saveProfiles(profiles);
  return p;
}

export function flagMedia(profileId: string, mediaId: string, reason: string): AdminProfile {
  const profiles = loadProfiles();
  const index = profiles.findIndex((p) => p.id === profileId);
  if (index === -1) throw new Error("Profile not found");

  const p = profiles[index];
  const photo = p.photos.find((m) => m.id === mediaId);
  const video = p.videos.find((m) => m.id === mediaId);
  const media = photo || video;

  if (media) {
    media.reviewStatus = "flagged";
    media.rejectionReason = reason;
    media.flags = [...(media.flags || []), reason];
    media.reviewedAt = new Date().toISOString();
    media.reviewedBy = "Super Admin";
  }

  p.updatedAt = new Date().toISOString();

  const audit = addAuditLog({
    adminName: "Super Admin",
    action: "Media Flagged",
    category: "media",
    details: `Media ID ${mediaId} flagged for review. Reason: ${reason}`,
    severity: "warning",
  });
  p.historyLog.unshift(audit);

  profiles[index] = { ...p };
  saveProfiles(profiles);
  return p;
}

export function updateProfileVisibility(
  profileId: string,
  visibility: ProfileVisibility,
  reason: string
): AdminProfile {
  const profiles = loadProfiles();
  const index = profiles.findIndex((p) => p.id === profileId);
  if (index === -1) throw new Error("Profile not found");

  const p = profiles[index];
  const previous = p.visibility;
  p.visibility = visibility;
  p.visibilityReason = reason;
  p.visibilityChangedAt = new Date().toISOString();
  p.updatedAt = new Date().toISOString();

  const audit = addAuditLog({
    adminName: "Super Admin",
    action: `Visibility: ${visibility.toUpperCase()}`,
    category: "visibility",
    details: `Changed visibility from ${previous} to ${visibility}. Reason: ${reason}`,
    severity: visibility === "restricted" || visibility === "hidden" ? "warning" : "normal",
  });
  p.historyLog.unshift(audit);

  profiles[index] = { ...p };
  saveProfiles(profiles);
  return p;
}

export function updateProfileModerationStatus(
  profileId: string,
  status: ProfileModerationStatus,
  reason?: string
): AdminProfile {
  const profiles = loadProfiles();
  const index = profiles.findIndex((p) => p.id === profileId);
  if (index === -1) throw new Error("Profile not found");

  const p = profiles[index];
  const previous = p.moderationStatus;
  p.moderationStatus = status;
  p.moderationReason = reason;
  p.moderationReviewedAt = new Date().toISOString();
  p.moderationReviewedBy = "Super Admin";
  p.updatedAt = new Date().toISOString();

  const audit = addAuditLog({
    adminName: "Super Admin",
    action: `Moderation: ${status.toUpperCase()}`,
    category: "moderation",
    details: `Status changed from ${previous} to ${status}.${reason ? ` Reason: ${reason}` : ""}`,
    severity: status === "rejected" || status === "restricted" ? "critical" : "normal",
  });
  p.historyLog.unshift(audit);

  profiles[index] = { ...p };
  saveProfiles(profiles);
  return p;
}

export function reviewVerification(
  profileId: string,
  verifyType: "photo" | "identity",
  decision: "verified" | "rejected",
  notes: string
): AdminProfile {
  const profiles = loadProfiles();
  const index = profiles.findIndex((p) => p.id === profileId);
  if (index === -1) throw new Error("Profile not found");

  const p = profiles[index];
  const now = new Date().toISOString();

  if (verifyType === "photo") {
    p.verification.photo.status = decision;
    p.verification.photo.reviewedAt = now;
    p.verification.photo.reviewedBy = "Super Admin";
    p.verification.photo.notes = notes;
  } else {
    p.verification.identity.status = decision;
    p.verification.identity.reviewedAt = now;
    p.verification.identity.reviewedBy = "Super Admin";
    p.verification.identity.quarantineNotes = notes;
  }

  // Recompute overall verification
  const isEmail = p.verification.email.status === "verified";
  const isPhone = p.verification.phone.status === "verified";
  const isPhoto = p.verification.photo.status === "verified";
  const isId = p.verification.identity.status === "verified";

  if (isEmail && isPhone && isPhoto && isId) {
    p.verification.overallStatus = "verified";
  } else if (decision === "rejected" && (p.verification.photo.status === "rejected" || p.verification.identity.status === "rejected")) {
    p.verification.overallStatus = "rejected";
  } else if (isEmail || isPhone || isPhoto) {
    p.verification.overallStatus = "partially_verified";
  } else {
    p.verification.overallStatus = "unverified";
  }

  p.verification.lastUpdated = now;
  p.updatedAt = now;

  const audit = addAuditLog({
    adminName: "Super Admin",
    action: `${verifyType.toUpperCase()} Verification ${decision.toUpperCase()}`,
    category: "verification",
    details: `${verifyType} verification set to ${decision}. Notes: ${notes}`,
    severity: decision === "rejected" ? "warning" : "normal",
  });
  p.historyLog.unshift(audit);

  profiles[index] = { ...p };
  saveProfiles(profiles);
  return p;
}

export function resolveReport(
  profileId: string,
  reportId: string,
  decision: "investigating" | "resolved" | "escalated" | "dismissed",
  notes: string
): AdminProfile {
  const profiles = loadProfiles();
  const index = profiles.findIndex((p) => p.id === profileId);
  if (index === -1) throw new Error("Profile not found");

  const p = profiles[index];
  const rep = p.reports.find((r) => r.id === reportId);
  if (rep) {
    rep.status = decision;
    rep.adminNotes = notes;
    rep.resolvedAt = decision === "resolved" || decision === "dismissed" ? new Date().toISOString() : undefined;
    rep.resolvedBy = "Super Admin";
    rep.resolution = notes;
  }

  // Recalculate unresolved reports count
  const unresolved = p.reports.filter((r) => r.status === "new" || r.status === "investigating" || r.status === "escalated").length;
  p.reportsCount = unresolved;

  p.updatedAt = new Date().toISOString();

  const audit = addAuditLog({
    adminName: "Super Admin",
    action: `Report ${decision.toUpperCase()}`,
    category: "report",
    details: `Report ${reportId} marked as ${decision}. Resolution: ${notes}`,
    severity: decision === "escalated" ? "warning" : "normal",
  });
  p.historyLog.unshift(audit);

  profiles[index] = { ...p };
  saveProfiles(profiles);
  return p;
}

export function bulkApproveProfiles(profileIds: string[]): void {
  const profiles = loadProfiles();
  profileIds.forEach((id) => {
    const p = profiles.find((item) => item.id === id);
    if (p) {
      p.moderationStatus = "approved";
      p.photos.forEach((photo) => {
        if (photo.reviewStatus === "pending") photo.reviewStatus = "approved";
      });
      p.videos.forEach((video) => {
        if (video.reviewStatus === "pending") video.reviewStatus = "approved";
      });
      p.updatedAt = new Date().toISOString();
    }
  });
  saveProfiles(profiles);
}

export function bulkUpdateVisibility(profileIds: string[], visibility: ProfileVisibility, reason: string): void {
  const profiles = loadProfiles();
  profileIds.forEach((id) => {
    const p = profiles.find((item) => item.id === id);
    if (p) {
      p.visibility = visibility;
      p.visibilityReason = reason;
      p.visibilityChangedAt = new Date().toISOString();
      p.updatedAt = new Date().toISOString();
    }
  });
  saveProfiles(profiles);
}

export function calculateProfileKPIs(profiles?: AdminProfile[]): ProfileStatsKpis {
  const data = profiles || loadProfiles();
  const now = new Date();
  const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  let totalPhotosPending = 0;
  let rejectedContentCount = 0;
  let updatedRecentlyCount = 0;

  data.forEach((p) => {
    p.photos.forEach((ph) => {
      if (ph.reviewStatus === "pending") totalPhotosPending++;
      if (ph.reviewStatus === "rejected") rejectedContentCount++;
    });
    p.videos.forEach((v) => {
      if (v.reviewStatus === "pending") totalPhotosPending++;
      if (v.reviewStatus === "rejected") rejectedContentCount++;
    });
    if (p.moderationStatus === "rejected") {
      rejectedContentCount++;
    }
    const updated = new Date(p.updatedAt);
    if (updated >= fortyEightHoursAgo) {
      updatedRecentlyCount++;
    }
  });

  return {
    totalProfiles: data.length,
    completeProfiles: data.filter((p) => p.completionPercentage >= 90).length,
    incompleteProfiles: data.filter((p) => p.completionPercentage < 90).length,
    pendingProfileReviews: data.filter((p) => p.moderationStatus === "under_review" || p.automatedReviewSummary === "needs_human_review").length,
    pendingPhotoReviews: totalPhotosPending,
    verifiedProfiles: data.filter((p) => p.verification.overallStatus === "verified").length,
    reportedProfiles: data.filter((p) => p.reportsCount > 0).length,
    hiddenProfiles: data.filter((p) => p.visibility === "hidden" || p.visibility === "restricted").length,
    rejectedContent: rejectedContentCount,
    profilesUpdatedRecently: updatedRecentlyCount,
  };
}

export function filterAndSortProfiles(
  profiles: AdminProfile[],
  filter: ProfileFilterState,
  sort: ProfileSortCriteria
): AdminProfile[] {
  let result = [...profiles];

  // Search query across 8 fields
  if (filter.searchQuery.trim()) {
    const q = filter.searchQuery.toLowerCase().trim();
    result = result.filter((p) => {
      return (
        p.fullName.toLowerCase().includes(q) ||
        p.username.toLowerCase().includes(q) ||
        p.userId.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q)
      );
    });
  }

  // Profile moderation status
  if (filter.profileStatus !== "all") {
    result = result.filter((p) => p.moderationStatus === filter.profileStatus);
  }

  // Verification status
  if (filter.verificationStatus !== "all") {
    if (filter.verificationStatus === "email_only") {
      result = result.filter((p) => p.verification.email.status === "verified" && p.verification.overallStatus !== "verified");
    } else if (filter.verificationStatus === "phone_only") {
      result = result.filter((p) => p.verification.phone.status === "verified" && p.verification.overallStatus !== "verified");
    } else if (filter.verificationStatus === "photo_verified") {
      result = result.filter((p) => p.verification.photo.status === "verified");
    } else if (filter.verificationStatus === "identity_verified") {
      result = result.filter((p) => p.verification.identity.status === "verified");
    } else {
      result = result.filter((p) => p.verification.overallStatus === filter.verificationStatus);
    }
  }

  // Media filter
  if (filter.mediaFilter !== "all") {
    if (filter.mediaFilter === "has_photos") {
      result = result.filter((p) => p.photos.length > 0);
    } else if (filter.mediaFilter === "has_videos") {
      result = result.filter((p) => p.videos.length > 0);
    } else if (filter.mediaFilter === "missing_primary") {
      result = result.filter((p) => !p.photos.some((ph) => ph.isPrimary));
    } else if (filter.mediaFilter === "photos_pending") {
      result = result.filter((p) => p.photos.some((ph) => ph.reviewStatus === "pending"));
    } else if (filter.mediaFilter === "videos_pending") {
      result = result.filter((p) => p.videos.some((v) => v.reviewStatus === "pending"));
    } else if (filter.mediaFilter === "has_rejected_media") {
      result = result.filter((p) => p.photos.some((ph) => ph.reviewStatus === "rejected") || p.videos.some((v) => v.reviewStatus === "rejected"));
    }
  }

  // Gender
  if (filter.gender !== "all") {
    result = result.filter((p) => p.gender === filter.gender);
  }

  // Age range
  if (filter.ageMin !== null) {
    result = result.filter((p) => calculateAge(p.dateOfBirth) >= filter.ageMin!);
  }
  if (filter.ageMax !== null) {
    result = result.filter((p) => calculateAge(p.dateOfBirth) <= filter.ageMax!);
  }

  // Country & City
  if (filter.country !== "all") {
    result = result.filter((p) => p.country.toLowerCase() === filter.country.toLowerCase());
  }
  if (filter.city !== "all") {
    result = result.filter((p) => p.city.toLowerCase().includes(filter.city.toLowerCase()));
  }

  // Completion bucket
  if (filter.completionBucket !== "all") {
    if (filter.completionBucket === "0_25") {
      result = result.filter((p) => p.completionPercentage <= 25);
    } else if (filter.completionBucket === "26_50") {
      result = result.filter((p) => p.completionPercentage > 25 && p.completionPercentage <= 50);
    } else if (filter.completionBucket === "51_75") {
      result = result.filter((p) => p.completionPercentage > 50 && p.completionPercentage <= 75);
    } else if (filter.completionBucket === "76_99") {
      result = result.filter((p) => p.completionPercentage > 75 && p.completionPercentage < 100);
    } else if (filter.completionBucket === "100") {
      result = result.filter((p) => p.completionPercentage === 100);
    }
  }

  // Visibility
  if (filter.visibility !== "all") {
    result = result.filter((p) => p.visibility === filter.visibility);
  }

  // Automated Outcome
  if (filter.automatedOutcome !== "all") {
    result = result.filter((p) => p.automatedReviewSummary === filter.automatedOutcome);
  }

  // Reports
  if (filter.hasReports !== "all") {
    if (filter.hasReports === "yes") {
      result = result.filter((p) => p.reportsCount > 0);
    } else if (filter.hasReports === "no") {
      result = result.filter((p) => p.reportsCount === 0);
    } else if (filter.hasReports === "critical") {
      result = result.filter((p) => p.reports.some((r) => r.priority === "critical" || r.priority === "high"));
    }
  }

  // Sorting
  result.sort((a, b) => {
    let comparison: number;
    switch (sort.field) {
      case "fullName":
        comparison = a.fullName.localeCompare(b.fullName);
        break;
      case "age":
        comparison = calculateAge(a.dateOfBirth) - calculateAge(b.dateOfBirth);
        break;
      case "completionPercentage":
        comparison = a.completionPercentage - b.completionPercentage;
        break;
      case "photosCount":
        comparison = a.photos.length - b.photos.length;
        break;
      case "videosCount":
        comparison = a.videos.length - b.videos.length;
        break;
      case "reportsCount":
        comparison = a.reportsCount - b.reportsCount;
        break;
      case "updatedAt":
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      case "createdAt":
      default:
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
    }
    return sort.order === "asc" ? comparison : -comparison;
  });

  return result;
}

export function exportProfilesCsv(profiles: AdminProfile[]): string {
  const headers = [
    "Profile ID",
    "User ID",
    "Full Name",
    "Username",
    "Age",
    "Gender",
    "Country",
    "City",
    "Completion (%)",
    "Photos Count",
    "Videos Count",
    "Verification Status",
    "Moderation Status",
    "Visibility",
    "Reports Count",
    "Created Date",
    "Last Updated",
  ];

  const rows = profiles.map((p) => [
    p.id,
    p.userId,
    `"${p.fullName.replace(/"/g, '""')}"`,
    p.username,
    calculateAge(p.dateOfBirth),
    p.gender,
    `"${p.country.replace(/"/g, '""')}"`,
    `"${p.city.replace(/"/g, '""')}"`,
    p.completionPercentage,
    p.photos.length,
    p.videos.length,
    p.verification.overallStatus,
    p.moderationStatus,
    p.visibility,
    p.reportsCount,
    p.createdAt,
    p.updatedAt,
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}
