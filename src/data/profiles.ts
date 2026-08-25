import type { DemoProfile, DemoUser, UserIntent } from "@/types/demo";

type ProfileSeed = {
  id: string;
  firstName: string;
  age: number;
  intent: UserIntent;
  distance: number;
  experience: DemoProfile["golf"]["experienceLevel"];
  favoriteCourseId: string;
  badges: string[];
  bio: string;
  handicap?: number;
  transportation?: DemoProfile["golf"]["transportation"];
};

const makeProfile = (seed: ProfileSeed): DemoProfile => ({
  id: seed.id,
  fictional: true,
  firstName: seed.firstName,
  age: seed.age,
  intent: seed.intent,
  approximateDistanceMiles: seed.distance,
  verifiedPhoto: true,
  bio: seed.bio,
  prompts: [
    {
      prompt: "My ideal golf date is...",
      answer: `${seed.badges[0] ?? "A relaxed round"}, good conversation, and no scorecard pressure.`,
    },
    {
      prompt: "The quickest way to my heart",
      answer: "A smooth pace of play and a post-round snack.",
    },
  ],
  photoPaths: [1, 2, 3].map((number) => `/demo/profiles/${seed.id}-${number}.svg`),
  golf: {
    experienceLevel: seed.experience,
    handicap: seed.handicap,
    handicapVerified: false,
    competitiveness: "casual",
    transportation: seed.transportation ?? "either",
    preferredFormats: ["nine", "range"],
    preferredDays: ["Saturday", "Sunday"],
    preferredTimeWindows: ["Late morning", "Twilight"],
    favoriteCourseIds: [seed.favoriteCourseId],
    travelRadiusMiles: 25,
    budgetLabel: "$$",
  },
  compatibilityBadges: seed.badges,
});

export const demoProfiles: DemoProfile[] = [
  makeProfile({
    id: "jordan-demo",
    firstName: "Jordan",
    age: 31,
    intent: "both",
    distance: 6,
    experience: "beginner",
    favoriteCourseId: "meadowview-range",
    badges: ["New golfer", "Sunday afternoons", "Range first"],
    bio: "Learning the game one range bucket at a time. Here for easy laughs and patient company.",
  }),
  makeProfile({
    id: "erin-demo",
    firstName: "Erin",
    age: 35,
    intent: "date",
    distance: 9,
    experience: "intermediate",
    handicap: 18.6,
    favoriteCourseId: "oak-hollow",
    transportation: "cart",
    badges: ["Twilight rounds", "Cart", "Casual pace"],
    bio: "Designer, dog person, and twilight-round enthusiast. I never turn down the back nine.",
  }),
  makeProfile({
    id: "maya-demo",
    firstName: "Maya",
    age: 32,
    intent: "both",
    distance: 8,
    experience: "intermediate",
    handicap: 11.8,
    favoriteCourseId: "river-bend",
    transportation: "cart",
    badges: ["Saturday afternoons", "Nine holes", "Clubhouse drink"],
    bio: "I like competitive banter, relaxed nine-hole rounds, and making a plan instead of chatting forever.",
  }),
  makeProfile({
    id: "morgan-demo",
    firstName: "Morgan",
    age: 29,
    intent: "play",
    distance: 12,
    experience: "advanced",
    handicap: 7.4,
    favoriteCourseId: "lakeside-links",
    badges: ["Early tee times", "Walks", "Friendly games"],
    bio: "Weekend walker looking for a regular group and the occasional scramble partner.",
  }),
  makeProfile({
    id: "casey-demo",
    firstName: "Casey",
    age: 37,
    intent: "date",
    distance: 14,
    experience: "beginner",
    favoriteCourseId: "the-turn-simulator",
    badges: ["Simulator nights", "Beginner friendly", "Weeknights"],
    bio: "New clubs, questionable swing, excellent playlist. Happy indoors when the weather turns.",
  }),
  makeProfile({
    id: "riley-demo",
    firstName: "Riley",
    age: 33,
    intent: "both",
    distance: 18,
    experience: "intermediate",
    handicap: 16.2,
    favoriteCourseId: "pine-ridge",
    badges: ["Public courses", "Casual 18", "Coffee first"],
    bio: "Public-course regular who values good company more than a clean scorecard.",
  }),
  makeProfile({
    id: "cameron-demo",
    firstName: "Cameron",
    age: 40,
    intent: "play",
    distance: 21,
    experience: "advanced",
    handicap: 5.9,
    favoriteCourseId: "river-bend",
    badges: ["Fast pace", "Weekend mornings", "Walk or cart"],
    bio: "Longtime golfer, low-key competitor, and dependable fourth when plans need saving.",
  }),
  makeProfile({
    id: "avery-demo",
    firstName: "Avery",
    age: 30,
    intent: "date",
    distance: 11,
    experience: "intermediate",
    handicap: 20.1,
    favoriteCourseId: "oak-hollow",
    badges: ["Golden hour", "Nine holes", "Music on"],
    bio: "Photographer chasing good light, kind people, and a tee shot that stays in frame.",
  }),
  makeProfile({
    id: "jamie-demo",
    firstName: "Jamie",
    age: 34,
    intent: "both",
    distance: 16,
    experience: "beginner",
    favoriteCourseId: "meadowview-range",
    badges: ["Range sessions", "Patient pace", "Sunday plans"],
    bio: "A social beginner who believes every bucket of balls should end with tacos.",
  }),
  makeProfile({
    id: "drew-demo",
    firstName: "Drew",
    age: 36,
    intent: "both",
    distance: 23,
    experience: "intermediate",
    handicap: 13.9,
    favoriteCourseId: "lakeside-links",
    badges: ["Twilight", "Budget friendly", "Casual games"],
    bio: "Teacher, muni loyalist, and optimistic putter looking for a standing weekend plan.",
  }),
  makeProfile({
    id: "sofia-demo",
    firstName: "Sofia",
    age: 34,
    intent: "date",
    distance: 7,
    experience: "intermediate",
    favoriteCourseId: "pine-ridge",
    badges: ["Sunday rounds", "Walks", "Easygoing"],
    bio: "Seeded demo match who loves a walkable course and a relaxed Sunday round.",
  }),
  makeProfile({
    id: "taylor-demo",
    firstName: "Taylor",
    age: 38,
    intent: "both",
    distance: 19,
    experience: "advanced",
    favoriteCourseId: "river-bend",
    badges: ["Scrambles", "Clubhouse", "Weekends"],
    bio: "Seeded demo match always ready for a charity scramble or a casual drink after.",
  }),
];

export const currentUser: DemoUser = {
  ...makeProfile({
    id: "alex-demo",
    firstName: "Alex",
    age: 34,
    intent: "date",
    distance: 0,
    experience: "intermediate",
    handicap: 14.2,
    favoriteCourseId: "pine-ridge",
    transportation: "cart",
    badges: ["Weekend golfer", "Twilight", "Casual pace"],
    bio: "A fictional demo golfer who enjoys nine holes, good conversation, and low-pressure plans.",
  }),
  discoveryPreferences: {
    intentCompatibility: ["date", "both"],
    ageRange: [28, 42],
    distanceMiles: 30,
    experiencePreference: ["beginner", "intermediate", "advanced"],
  },
};

export const profilesById = Object.fromEntries(
  [...demoProfiles, currentUser].map((profile) => [profile.id, profile]),
) as Record<string, DemoProfile>;
