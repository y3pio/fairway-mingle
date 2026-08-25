import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  coursesById,
  DEMO_DATE_LABEL,
  scenarios,
  seededConversations,
  seededMatches,
} from "@/data/fixtures";
import { currentUser } from "@/data/profiles";
import type {
  Conversation,
  DemoEvent,
  DemoEventName,
  DemoScenarioId,
  DemoStage,
  DemoUser,
  Match,
  MembershipLevel,
  OutingRequestStatus,
  ProposedOuting,
  ProposeOutingInput,
  SwipeDirection,
} from "@/types/demo";

export const DEMO_STORAGE_KEY = "fairway-mingle-demo-state";
export const DEMO_SCHEMA_VERSION = 1;

type LastSwipe = {
  profileId: string;
  direction: SwipeDirection;
  previousIndex: number;
};

export interface DemoStore {
  schemaVersion: number;
  scenarioId: DemoScenarioId;
  initialized: boolean;
  currentUser: DemoUser;
  onboardingStep: number;
  onboardingComplete: boolean;
  membershipLevel: MembershipLevel;
  profileDeckIds: string[];
  incomingLikeProfileIds: string[];
  currentProfileIndex: number;
  likedProfileIds: string[];
  passedProfileIds: string[];
  blockedProfileIds: string[];
  lastSwipe?: LastSwipe;
  matches: Match[];
  dismissedMatchCelebrationIds: string[];
  conversations: Record<string, Conversation>;
  proposedOutings: ProposedOuting[];
  publicOutingRequests: Record<string, OutingRequestStatus>;
  demoCalendarOutingIds: string[];
  eventLog: DemoEvent[];
  initializeScenario: (scenarioId: DemoScenarioId, force?: boolean) => void;
  updateCurrentUser: (patch: Partial<DemoUser>) => void;
  setOnboardingStep: (step: number) => void;
  completeOnboarding: () => void;
  swipeProfile: (profileId: string, direction: SwipeDirection) => void;
  rewindLastSwipe: () => void;
  restoreDeck: () => void;
  createMatch: (profileId: string) => Match;
  dismissMatchCelebration: (matchId: string) => void;
  sendMessage: (matchId: string, body: string) => void;
  addScriptedReply: (matchId: string) => void;
  proposeOuting: (input: ProposeOutingInput) => ProposedOuting;
  acceptProposedOuting: (outingId: string) => void;
  requestToJoinOuting: (outingId: string) => void;
  addOutingToDemoCalendar: (outingId: string) => void;
  setMembershipLevel: (level: MembershipLevel) => void;
  blockProfile: (profileId: string) => void;
  clearBlockedProfiles: () => void;
  reportProfile: (profileId: string, reason?: string) => void;
  unmatch: (matchId: string) => void;
  jumpToStage: (stage: DemoStage) => string;
  resetDemo: (scenarioId?: DemoScenarioId) => Promise<string>;
  trackEvent: (name: DemoEventName, metadata?: Record<string, unknown>) => void;
}

const copyConversations = (): Record<string, Conversation> =>
  structuredClone(seededConversations);

const scenarioState = (scenarioId: DemoScenarioId) => {
  const scenario = scenarios[scenarioId];
  return {
    schemaVersion: DEMO_SCHEMA_VERSION,
    scenarioId,
    initialized: true,
    currentUser: structuredClone(currentUser),
    onboardingStep: 0,
    onboardingComplete: scenario.onboardingComplete,
    membershipLevel: scenario.membershipLevel,
    profileDeckIds: [...scenario.profileDeckIds],
    incomingLikeProfileIds: [...scenario.incomingLikeProfileIds],
    currentProfileIndex: 0,
    likedProfileIds: [] as string[],
    passedProfileIds: [] as string[],
    blockedProfileIds: [] as string[],
    lastSwipe: undefined,
    matches: structuredClone(seededMatches),
    dismissedMatchCelebrationIds: [] as string[],
    conversations: copyConversations(),
    proposedOutings: [] as ProposedOuting[],
    publicOutingRequests: {} as Record<string, OutingRequestStatus>,
    demoCalendarOutingIds: [] as string[],
    eventLog: [] as DemoEvent[],
  };
};

const newEvent = (
  name: DemoEventName,
  metadata?: Record<string, unknown>,
): DemoEvent => ({
  id: globalThis.crypto?.randomUUID?.() ?? `${name}-${Math.random()}`,
  name,
  occurredAtIso: new Date().toISOString(),
  metadata,
});

const mayaConversation = (): Conversation => ({
  matchId: "match-maya-demo",
  unread: true,
  messages: [
    {
      id: "message-maya-seed",
      matchId: "match-maya-demo",
      sender: "matched-user",
      kind: "text",
      body: "I've been wanting to play River Bend. Are you usually free on weekends?",
      timestampLabel: "Now",
    },
  ],
});

const createMatchRecord = (profileId: string): Match => ({
  id: `match-${profileId}`,
  profileId,
  createdAtLabel: "Now",
  status: "active",
  celebrationPending: true,
});

const initialState = scenarioState("dustin-dating");

export const useDemoStore = create<DemoStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      initialized: false,

      initializeScenario: (scenarioId, force = false) => {
        if (get().initialized && !force) return;
        set({
          ...scenarioState(scenarioId),
          eventLog: [newEvent("demo_initialized", { scenarioId })],
        });
      },

      updateCurrentUser: (patch) =>
        set((state) => ({ currentUser: { ...state.currentUser, ...patch } })),

      setOnboardingStep: (step) =>
        set({ onboardingStep: Math.max(0, Math.min(3, step)) }),

      completeOnboarding: () =>
        set((state) => ({
          onboardingComplete: true,
          eventLog: [...state.eventLog, newEvent("onboarding_completed")].slice(-100),
        })),

      swipeProfile: (profileId, direction) =>
        set((state) => {
          const alreadySwiped =
            state.likedProfileIds.includes(profileId) ||
            state.passedProfileIds.includes(profileId);
          if (alreadySwiped) return state;

          const isLike = direction === "right";
          const createsMatch =
            isLike && scenarios[state.scenarioId].mutualMatchProfileIds.includes(profileId);
          const matchId = `match-${profileId}`;
          const matchExists = state.matches.some((match) => match.id === matchId);
          const matches =
            createsMatch && !matchExists
              ? [...state.matches, createMatchRecord(profileId)]
              : state.matches;

          return {
            currentProfileIndex: Math.min(
              state.currentProfileIndex + 1,
              state.profileDeckIds.length,
            ),
            likedProfileIds: isLike
              ? [...state.likedProfileIds, profileId]
              : state.likedProfileIds,
            passedProfileIds: isLike
              ? state.passedProfileIds
              : [...state.passedProfileIds, profileId],
            lastSwipe: {
              profileId,
              direction,
              previousIndex: state.currentProfileIndex,
            },
            matches,
            conversations:
              createsMatch && !matchExists
                ? { ...state.conversations, [matchId]: mayaConversation() }
                : state.conversations,
            eventLog: [
              ...state.eventLog,
              newEvent(isLike ? "profile_liked" : "profile_passed", { profileId }),
              ...(createsMatch && !matchExists
                ? [newEvent("match_created", { profileId, matchId })]
                : []),
            ].slice(-100),
          };
        }),

      rewindLastSwipe: () =>
        set((state) => {
          const swipe = state.lastSwipe;
          if (!swipe) return state;
          return {
            currentProfileIndex: swipe.previousIndex,
            likedProfileIds: state.likedProfileIds.filter((id) => id !== swipe.profileId),
            passedProfileIds: state.passedProfileIds.filter((id) => id !== swipe.profileId),
            lastSwipe: undefined,
          };
        }),

      restoreDeck: () =>
        set((state) => ({
          currentProfileIndex: 0,
          likedProfileIds: [],
          passedProfileIds: [],
          lastSwipe: undefined,
          profileDeckIds: [...scenarios[state.scenarioId].profileDeckIds],
        })),

      createMatch: (profileId) => {
        const matchId = `match-${profileId}`;
        const existing = get().matches.find((match) => match.id === matchId);
        if (existing) return existing;
        const match = createMatchRecord(profileId);
        set((state) => ({
          matches: [...state.matches, match],
          conversations: {
            ...state.conversations,
            [match.id]: profileId === "maya-demo" ? mayaConversation() : { matchId, messages: [] },
          },
          eventLog: [
            ...state.eventLog,
            newEvent("match_created", { profileId, matchId }),
          ].slice(-100),
        }));
        return match;
      },

      dismissMatchCelebration: (matchId) =>
        set((state) => ({
          matches: state.matches.map((match) =>
            match.id === matchId ? { ...match, celebrationPending: false } : match,
          ),
          dismissedMatchCelebrationIds: state.dismissedMatchCelebrationIds.includes(matchId)
            ? state.dismissedMatchCelebrationIds
            : [...state.dismissedMatchCelebrationIds, matchId],
          eventLog: [
            ...state.eventLog,
            newEvent("match_celebration_dismissed", { matchId }),
          ].slice(-100),
        })),

      sendMessage: (matchId, body) => {
        const trimmed = body.trim();
        if (!trimmed) return;
        set((state) => {
          const conversation = state.conversations[matchId] ?? { matchId, messages: [] };
          const messageNumber = conversation.messages.length + 1;
          return {
            conversations: {
              ...state.conversations,
              [matchId]: {
                ...conversation,
                unread: false,
                messages: [
                  ...conversation.messages,
                  {
                    id: `message-${matchId}-${messageNumber}`,
                    matchId,
                    sender: "current-user",
                    kind: "text",
                    body: trimmed,
                    timestampLabel: "Now",
                  },
                ],
              },
            },
            eventLog: [
              ...state.eventLog,
              newEvent("message_sent", { matchId }),
            ].slice(-100),
          };
        });
      },

      addScriptedReply: (matchId) =>
        set((state) => {
          const conversation = state.conversations[matchId];
          if (!conversation) return state;
          const replyId = `message-${matchId}-scripted`;
          if (conversation.messages.some((message) => message.id === replyId)) return state;
          return {
            conversations: {
              ...state.conversations,
              [matchId]: {
                ...conversation,
                messages: [
                  ...conversation.messages,
                  {
                    id: replyId,
                    matchId,
                    sender: "matched-user",
                    kind: "text",
                    body: "Saturday afternoons are usually perfect for me.",
                    timestampLabel: "Now",
                  },
                ],
              },
            },
          };
        }),

      proposeOuting: (input) => {
        const canonicalId = `proposal-${input.matchId}`;
        const existing = get().proposedOutings.find((outing) => outing.id === canonicalId);
        if (existing) return existing;
        const outing: ProposedOuting = {
          id: canonicalId,
          fictional: true,
          ...input,
          status: "proposed",
          demoPerk: coursesById[input.courseId]?.prototypePerk,
        };
        set((state) => {
          const conversation = state.conversations[input.matchId] ?? {
            matchId: input.matchId,
            messages: [],
          };
          return {
            proposedOutings: [...state.proposedOutings, outing],
            conversations: {
              ...state.conversations,
              [input.matchId]: {
                ...conversation,
                messages: [
                  ...conversation.messages,
                  {
                    id: `message-${canonicalId}`,
                    matchId: input.matchId,
                    sender: "current-user",
                    kind: "outing-proposal",
                    outingId: canonicalId,
                    timestampLabel: "Now",
                  },
                ],
              },
            },
            eventLog: [
              ...state.eventLog,
              newEvent("outing_proposed", { outingId: canonicalId }),
            ].slice(-100),
          };
        });
        return outing;
      },

      acceptProposedOuting: (outingId) =>
        set((state) => {
          const outing = state.proposedOutings.find((candidate) => candidate.id === outingId);
          if (!outing || outing.status === "accepted") return state;
          const conversation = state.conversations[outing.matchId];
          return {
            proposedOutings: state.proposedOutings.map((candidate) =>
              candidate.id === outingId ? { ...candidate, status: "accepted" } : candidate,
            ),
            conversations: conversation
              ? {
                  ...state.conversations,
                  [outing.matchId]: {
                    ...conversation,
                    messages: [
                      ...conversation.messages,
                      {
                        id: `message-${outingId}-accepted`,
                        matchId: outing.matchId,
                        sender: "system",
                        kind: "system",
                        body: "Maya accepted your golf date.",
                        outingId,
                        timestampLabel: "Now",
                      },
                    ],
                  },
                }
              : state.conversations,
            eventLog: [
              ...state.eventLog,
              newEvent("outing_accepted", { outingId }),
            ].slice(-100),
          };
        }),

      requestToJoinOuting: (outingId) =>
        set((state) => {
          if (state.publicOutingRequests[outingId] === "requested") return state;
          return {
            publicOutingRequests: {
              ...state.publicOutingRequests,
              [outingId]: "requested",
            },
            eventLog: [
              ...state.eventLog,
              newEvent("public_outing_join_requested", { outingId }),
            ].slice(-100),
          };
        }),

      addOutingToDemoCalendar: (outingId) =>
        set((state) => ({
          demoCalendarOutingIds: state.demoCalendarOutingIds.includes(outingId)
            ? state.demoCalendarOutingIds
            : [...state.demoCalendarOutingIds, outingId],
        })),

      setMembershipLevel: (membershipLevel) =>
        set((state) => ({
          membershipLevel,
          eventLog: [
            ...state.eventLog,
            newEvent("membership_changed", { membershipLevel }),
          ].slice(-100),
        })),

      blockProfile: (profileId) =>
        set((state) => ({
          blockedProfileIds: state.blockedProfileIds.includes(profileId)
            ? state.blockedProfileIds
            : [...state.blockedProfileIds, profileId],
          matches: state.matches.map((match) =>
            match.profileId === profileId ? { ...match, status: "blocked" } : match,
          ),
          eventLog: [
            ...state.eventLog,
            newEvent("profile_blocked", { profileId }),
          ].slice(-100),
        })),

      clearBlockedProfiles: () => set({ blockedProfileIds: [] }),

      reportProfile: (profileId, reason) =>
        set((state) => ({
          eventLog: [
            ...state.eventLog,
            newEvent("profile_reported", { profileId, reason }),
          ].slice(-100),
        })),

      unmatch: (matchId) =>
        set((state) => ({
          matches: state.matches.map((match) =>
            match.id === matchId ? { ...match, status: "unmatched" } : match,
          ),
        })),

      jumpToStage: (stage) => {
        if (stage === "onboarding") {
          set({ onboardingComplete: false, onboardingStep: 0 });
          return "/onboarding";
        }
        if (stage === "discovery") return "/discover";
        const match = get().createMatch("maya-demo");
        get().dismissMatchCelebration(match.id);
        if (stage === "maya-match") {
          set((state) => ({
            matches: state.matches.map((candidate) =>
              candidate.id === match.id
                ? { ...candidate, celebrationPending: true }
                : candidate,
            ),
          }));
          return "/discover";
        }
        if (stage === "maya-chat") return `/matches/${match.id}`;
        const outing = get().proposeOuting({
          matchId: match.id,
          courseId: "river-bend",
          activityType: "nine-holes",
          dateLabel: DEMO_DATE_LABEL,
          timeLabel: "4:30 PM",
          holeCount: 9,
          transportation: "cart",
          note: "Want to grab a drink at the clubhouse afterward?",
        });
        get().acceptProposedOuting(outing.id);
        return `/confirmed/${outing.id}`;
      },

      resetDemo: async (scenarioId = get().scenarioId) => {
        localStorage.removeItem(DEMO_STORAGE_KEY);
        Object.keys(localStorage)
          .filter((key) => key.startsWith("fairway-mingle-"))
          .forEach((key) => localStorage.removeItem(key));
        if ("caches" in globalThis) {
          const cacheKeys = await globalThis.caches.keys();
          await Promise.all(
            cacheKeys
              .filter((key) => key.includes("fairway-mingle"))
              .map((key) => globalThis.caches.delete(key)),
          );
        }
        set({
          ...scenarioState(scenarioId),
          eventLog: [newEvent("demo_reset", { scenarioId })],
        });
        return scenarios[scenarioId].initialRoute;
      },

      trackEvent: (name, metadata) =>
        set((state) => ({
          eventLog: [...state.eventLog, newEvent(name, metadata)].slice(-100),
        })),
    }),
    {
      name: DEMO_STORAGE_KEY,
      version: DEMO_SCHEMA_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        schemaVersion: state.schemaVersion,
        scenarioId: state.scenarioId,
        initialized: state.initialized,
        currentUser: state.currentUser,
        onboardingStep: state.onboardingStep,
        onboardingComplete: state.onboardingComplete,
        membershipLevel: state.membershipLevel,
        profileDeckIds: state.profileDeckIds,
        incomingLikeProfileIds: state.incomingLikeProfileIds,
        currentProfileIndex: state.currentProfileIndex,
        likedProfileIds: state.likedProfileIds,
        passedProfileIds: state.passedProfileIds,
        blockedProfileIds: state.blockedProfileIds,
        lastSwipe: state.lastSwipe,
        matches: state.matches,
        dismissedMatchCelebrationIds: state.dismissedMatchCelebrationIds,
        conversations: state.conversations,
        proposedOutings: state.proposedOutings,
        publicOutingRequests: state.publicOutingRequests,
        demoCalendarOutingIds: state.demoCalendarOutingIds,
        eventLog: state.eventLog,
      }),
      migrate: (persistedState, version) => {
        if (version !== DEMO_SCHEMA_VERSION || !persistedState) {
          return scenarioState("dustin-dating");
        }
        return persistedState as DemoStore;
      },
    },
  ),
);
