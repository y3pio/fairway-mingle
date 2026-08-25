export type UserIntent = "date" | "play" | "both";
export type MembershipLevel = "basic" | "premium" | "vip";
export type SwipeDirection = "left" | "right";
export type ProposalStatus = "draft" | "proposed" | "accepted" | "declined";
export type DemoScenarioId = "dustin-dating" | "outings" | "premium";
export type OutingRequestStatus = "none" | "requested";
export type GolfActivityType =
  | "nine-holes"
  | "eighteen-holes"
  | "driving-range"
  | "simulator"
  | "putting"
  | "clubhouse-drink";

export interface DemoProfile {
  id: string;
  fictional: true;
  firstName: string;
  age: number;
  pronouns?: string;
  intent: UserIntent;
  approximateDistanceMiles: number;
  verifiedPhoto: boolean;
  bio: string;
  prompts: Array<{ prompt: string; answer: string }>;
  photoPaths: string[];
  golf: {
    experienceLevel: "beginner" | "intermediate" | "advanced";
    handicap?: number;
    handicapVerified: false;
    competitiveness: "casual" | "balanced" | "competitive";
    transportation: "walk" | "cart" | "either";
    preferredFormats: Array<"nine" | "eighteen" | "range" | "simulator">;
    preferredDays: string[];
    preferredTimeWindows: string[];
    favoriteCourseIds: string[];
    travelRadiusMiles: number;
    budgetLabel: "$" | "$$" | "$$$";
  };
  compatibilityBadges: string[];
}

export interface DiscoveryPreferences {
  intentCompatibility: UserIntent[];
  ageRange: [number, number];
  distanceMiles: number;
  experiencePreference: Array<DemoProfile["golf"]["experienceLevel"]>;
}

export interface DemoUser extends DemoProfile {
  discoveryPreferences: DiscoveryPreferences;
}

export interface DemoCourse {
  id: string;
  fictional: true;
  name: string;
  type: "public-course" | "private-course" | "range" | "simulator" | "putting";
  areaLabel: string;
  imagePath: string;
  amenities: string[];
  prototypePerk?: string;
}

export interface Match {
  id: string;
  profileId: string;
  createdAtLabel: string;
  status: "active" | "unmatched" | "blocked";
  celebrationPending: boolean;
}

export type MessageKind = "text" | "outing-proposal" | "system";

export interface Message {
  id: string;
  matchId: string;
  sender: "current-user" | "matched-user" | "system";
  kind: MessageKind;
  body?: string;
  outingId?: string;
  timestampLabel: string;
}

export interface Conversation {
  matchId: string;
  messages: Message[];
  unread?: boolean;
}

export interface ProposedOuting {
  id: string;
  fictional: true;
  matchId: string;
  courseId: string;
  activityType: GolfActivityType;
  dateLabel: string;
  timeLabel: string;
  holeCount?: 9 | 18;
  transportation?: "walk" | "cart" | "either";
  note?: string;
  status: ProposalStatus;
  demoPerk?: string;
}

export interface ProposeOutingInput {
  matchId: string;
  courseId: string;
  activityType: GolfActivityType;
  dateLabel: string;
  timeLabel: string;
  holeCount?: 9 | 18;
  transportation?: "walk" | "cart" | "either";
  note?: string;
}

export interface PublicOuting {
  id: string;
  fictional: true;
  organizerProfileId: string;
  title: string;
  intentContext: UserIntent | "event";
  courseId: string;
  activityType: GolfActivityType;
  dateLabel: string;
  timeLabel: string;
  paceLabel: string;
  experienceLabel: string;
  openSpots: number;
  totalSpots: number;
  description: string;
}

export interface DemoScenario {
  id: DemoScenarioId;
  label: string;
  currentUserId: string;
  initialRoute: string;
  onboardingComplete: boolean;
  membershipLevel: MembershipLevel;
  profileDeckIds: string[];
  incomingLikeProfileIds: string[];
  mutualMatchProfileIds: string[];
  seededMatchIds: string[];
  featuredCourseId: string;
  featuredOutingId: string;
  scriptedReplyDelayMs: number;
  autoAcceptProposalDelayMs: number;
}

export type DemoStage =
  | "onboarding"
  | "discovery"
  | "maya-match"
  | "maya-chat"
  | "confirmed-outing";

export type DemoEventName =
  | "demo_initialized"
  | "onboarding_started"
  | "onboarding_completed"
  | "profile_viewed"
  | "profile_passed"
  | "profile_liked"
  | "match_created"
  | "match_celebration_dismissed"
  | "message_sent"
  | "outing_proposed"
  | "outing_accepted"
  | "confirmed_outing_viewed"
  | "public_outing_join_requested"
  | "paywall_viewed"
  | "membership_changed"
  | "profile_reported"
  | "profile_blocked"
  | "demo_reset";

export interface DemoEvent {
  id: string;
  name: DemoEventName;
  occurredAtIso: string;
  metadata?: Record<string, unknown>;
}
