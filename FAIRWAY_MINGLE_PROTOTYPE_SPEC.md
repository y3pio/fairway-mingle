# Fairway Mingle Prototype Product and Technical Specification

**Document status:** Build-ready draft 2 (product-owner decisions incorporated)  
**Audience:** Personal Cursor coding agent and repository contributors  
**Product owner:** Prototype sponsor / Dustin  
**Implementation owner:** Repository maintainer  
**Target:** Mobile-first web prototype deployed as static files behind Apache  

---

## 1. Instructions to the Coding Agent

Treat this document as the source of truth for the first implementation.

The objective is not to build a production dating platform. The objective is to build a polished, reliable, stakeholder-ready proof of concept that demonstrates the product idea through a deterministic, mostly simulated experience.

Follow these rules:

1. Build the narrow golden path before supporting features.
2. Prefer local fixtures and deterministic state over APIs, databases, authentication, or asynchronous infrastructure.
3. Do not add a backend, database, real payment flow, real messaging service, external course API, geolocation, or user-upload system unless this specification is explicitly revised.
4. Do not introduce features that are not listed in this specification merely because they are common in dating apps.
5. Keep all demo data fictional and label it as fictional in source code.
6. Store all image assets locally. Do not hotlink profile images from social media, random image services, or third-party CDNs.
7. Keep the application deployable as a static Vite build in `dist/`.
8. Use strict TypeScript. Avoid `any`; prefer discriminated unions, typed fixture data, and typed store actions.
9. Keep the primary demo journey deterministic and recoverable. A presenter must never be trapped by an accidental swipe or stale state.
10. Add automated tests for the state transitions that make the demo work.
11. Before declaring a phase complete, run type checking, linting, tests, and the production build.
12. If a detail is unspecified, choose the simplest implementation consistent with the product goals and document material decisions in `docs/DECISIONS.md`.

The first deliverable should be a vertical slice that supports:

> Enter prototype -> view profile cards -> create a mutual match -> open chat -> propose a golf outing -> see the outing confirmed.

Everything else is secondary.

---

## 2. Product Summary

Fairway Mingle is a dating-first social golf concept. It helps golfers meet people through shared golf preferences and turn a match into a specific, low-pressure outing such as nine holes, a driving-range session, a simulator booking, or a clubhouse drink.

The prototype should communicate three ideas:

1. Golf-specific profile information can make dating discovery more relevant.
2. A mutual match can lead naturally to a concrete golf plan rather than an indefinite chat.
3. Public outings, local events, and course offers can supplement the dating experience without turning the product into a generic sports-team app.

The prototype is a product demonstration, not a market-ready MVP. It may use smoke-and-mirrors behavior wherever doing so improves reliability and presentation quality.

### Working positioning

> Meet your match. Play a round.

### Product personality

- Warm, social, and confident
- Modern rather than country-club traditional
- Golf-aware without being intimidating to beginners
- Dating-first, but welcoming to users who select Play or Both
- Premium-looking without appearing exclusive or elitist

---

## 3. Prototype Goals

The prototype must demonstrate:

- A clear dating-and-golf value proposition
- An optional condensed, prefilled onboarding/edit-profile experience
- Intent selection: Date, Play, or Both
- Golf-specific profile information
- A polished swipe/card discovery experience
- A deterministic mutual match
- A believable seeded conversation
- A golf-outing proposal flow
- A satisfying accepted/confirmed outing state
- A small set of public outing cards
- A non-functional membership/paywall concept
- Basic trust-and-safety affordances
- A resettable and presenter-controlled demo state
- A static production build suitable for Apache hosting
- Optional PWA installation and app-like mobile presentation

### Product questions this prototype should help answer

- Does the concept feel meaningfully different from a general dating app with golf listed as an interest?
- Does golf-specific compatibility information make profiles more useful?
- Does the match-to-outing workflow feel natural and appealing?
- Do outings and course perks strengthen the product without overwhelming the dating proposition?
- Which part of the concept does Dustin respond to most strongly: dating discovery, golf planning, public outings, or memberships?

---

## 4. Non-Goals

Do not build the following in this prototype:

- Real user registration or login
- Email, SMS, OAuth, passkeys, or phone verification
- A backend service
- A database
- Real-time multi-user synchronization
- Real user-generated content
- Profile photo uploads
- Automated identity or facial verification
- Official handicap verification
- Live geolocation
- Maps or turn-by-turn directions
- Golf course search APIs
- Tee-time inventory or booking
- Real course discounts
- Push notifications
- Email notifications
- Real subscription purchases
- Apple or Google in-app purchases
- Payment processing
- Admin moderation tooling
- AI matching or generative chat
- A generalized social feed
- Video, voice, or photo messaging
- Native iOS or Android packages
- App Store or Play Store submission
- Multi-city marketplace functionality
- Production-grade security, privacy, or legal readiness

These items may be represented through UI or success messages when useful, but they must not be implemented as live integrations.

---

## 5. Demo Assumptions

- All users, courses, messages, events, discounts, and outings are fictional demo content.
- The app starts in a fictional launch market called `Demo City` unless a real metro is later selected.
- No sensitive personal data is collected.
- No network request is required after the static application assets have loaded.
- Browser `localStorage` is the persistence layer.
- The demo can be restored to a known state with one action.
- The primary path should take approximately two minutes when presented deliberately.
- The application must work with touch, mouse, and keyboard input.
- The application should remain usable when swipe gestures are awkward; explicit Like and Pass buttons are required.
- The demo must not depend on timing-sensitive scripted events. Any delayed simulated reply must have a fallback that lets the user continue.

### 5.1 Resolved prototype decisions

- Use local stylized portraits for fictional people and local stylized course artwork. Do not use stock photos or hotlinked assets.
- Deploy from the root of a dedicated subdomain. Use Vite base `/`, router basename `/`, and PWA scope `/`.
- Skip onboarding in the canonical stakeholder demo. The prefilled onboarding concept remains reachable from Profile, but all prototype features are available for direct exploration.
- Use `Saturday, September 12` as the fixed River Bend proposal date.
- Exclude Sofia and Taylor from discovery because they are seeded matches. Add Jamie and Drew as discovery-only profiles so the deck contains 10 profiles.
- Discovery filters are display-only and must not alter the deterministic deck.
- `See who likes you` is a fully enabled prototype screen backed by local incoming-like fixtures. It is not paywalled in the stakeholder demo.
- The application has no internal authentication. Apache-level access control may be added during deployment without changing application behavior.
- Match lists show first names only.
- Unmatching hides the match while retaining its conversation and any accepted outing. A persisted `/confirmed/:outingId` route remains recoverable.

---

## 6. Primary Demo Persona

### Alex Morgan

The default demo user is fictional.

- Name: Alex Morgan
- Age: 34
- Intent: Date
- Golf experience: Intermediate
- Handicap: 14.2, self-reported
- Preferred format: Nine holes or casual 18
- Preferred days: Saturday and Sunday
- Preferred time: Late morning or twilight
- Style: Casual, social, usually rides
- Home course: Pine Ridge Municipal
- Membership at demo start: Basic
- Discovery preference: Configurable in fixture data; default scenario shows compatible women

The application should not depend on the name Alex being associated with a particular gender. The scenario configuration should own discovery preferences so alternate demos can be added without rewriting feature code.

---

## 7. User Intent Model

Every profile has one visible intent:

```ts
type UserIntent = "date" | "play" | "both";
```

Display labels:

- `date`: Looking for a golf date
- `play`: Looking for people to play with
- `both`: Open to dates and playing partners

Intent must be visible in onboarding, profile cards, full profiles, outing cards, and match details.

For the prototype, compatibility is fixture-driven. There is no real matching algorithm. The scenario engine decides which profiles appear.

---

## 8. Core Product Principles

### 8.1 Activity-backed dating

The app should always make the next concrete action obvious. The most important call to action after a match is `Suggest a round`.

### 8.2 Golf information should be useful, not performative

Prioritize schedule, format, pace, walking/cart preference, distance, budget, and favorite venues over advanced statistics.

### 8.3 Dating intent must be explicit

Do not blur romantic and social expectations. Date, Play, and Both labels should be prominent.

### 8.4 The demo should reward progress

The stakeholder should see value before seeing a paywall. Do not block the golden path with membership restrictions.

### 8.5 Reliability is more important than realism

A deterministic match and scripted acceptance are preferable to an impressive-looking interaction that may fail.

### 8.6 Trust signals should be visible

Verification, reporting, blocking, unmatching, approximate distance, and public-venue reminders should be present even though they are simulated.

---

## 9. Information Architecture

Use React Router in declarative browser-routing mode. Apache will provide a single-page-application fallback to `index.html`.

Required routes:

```text
/
/onboarding
/discover
/matches
/matches/:matchId
/outings
/outings/:outingId
/confirmed/:outingId
/membership
/profile
/__demo
/not-found
```

### Route behavior

- `/` is the public demo landing page.
- `/onboarding` contains the condensed, prefilled onboarding flow.
- `/discover` is the primary card stack.
- `/matches` lists seeded and newly created matches.
- `/matches/:matchId` is a chat/detail screen.
- `/outings` lists public outing opportunities.
- `/outings/:outingId` shows a public outing detail.
- `/confirmed/:outingId` shows a confirmed private golf date or outing.
- `/membership` displays Basic, Premium, and VIP concept plans.
- `/profile` displays the demo user's profile and settings.
- `/__demo` contains hidden presenter controls and is not linked from primary navigation.
- Unknown routes render a friendly not-found screen with a `Return to demo` action.

### Primary bottom navigation

Use four tabs:

1. Discover
2. Matches
3. Outings
4. Profile

Membership is accessed from Profile or from a contextual paywall sheet.

Do not show bottom navigation on the landing page, onboarding, match celebration modal, or full-screen confirmation celebration.

---

## 10. Golden Demo Path

The golden path is the highest-priority implementation and must be covered by an end-to-end test.

### Step 1: Enter prototype

The user visits `/` and sees:

- Fairway Mingle logo or wordmark
- Tagline: `Meet your match. Play a round.`
- Brief one-sentence explanation
- Primary button: `Enter prototype`
- Supporting copy that onboarding is skipped for this stakeholder demo
- On desktop, a phone-frame preview and QR-code placeholder area may be shown

`Enter prototype` initializes the default `dustin-dating` scenario and sends the user directly to Discover.

### Step 2: Optional condensed onboarding concept

The canonical demo skips this step. The concept remains reachable from Profile and lets the user tap through four prefilled steps:

1. Intent
2. About you
3. Golf style
4. Discovery preferences

A progress indicator is visible. The user can edit fields, but no typing is required to continue.

At completion, navigate to `/discover`.

### Step 3: Browse profiles

The profile order is deterministic:

1. Jordan Lee - expected Pass
2. Erin Brooks - expected Like, no match
3. Maya Chen - expected Like, mutual match
4. Additional cards remain available for free exploration

The demo must not require the presenter to choose the expected action. If Maya is liked at any point, a mutual match occurs. If Maya is passed accidentally, the presenter can use Rewind or the hidden demo controls.

### Step 4: Mutual match

When Maya is liked, display a full-screen or large modal celebration:

- Heading: `It's a Fairway Match!`
- Alex and Maya profile images
- Supporting copy: `You both want to play and see where it goes.`
- Primary action: `Send a message`
- Secondary action: `Suggest a round`
- Tertiary action: `Keep browsing`

The celebration should be polished but brief. Respect reduced-motion preferences.

### Step 5: Seeded chat

Opening the match shows a believable existing message from Maya:

> I've been wanting to play River Bend. Are you usually free on weekends?

The user can type and send a message. The message is stored locally.

After the first outgoing message, the app may add one deterministic reply after a short delay:

> Saturday afternoons are usually perfect for me.

The key action `Suggest a round` remains visible regardless of whether the scripted reply appears.

### Step 6: Propose a golf outing

The proposal flow is a sheet, drawer, dialog, or route optimized for mobile.

Prefilled values:

- Venue: River Bend Golf Club
- Date: `Saturday, September 12`
- Time: 4:30 PM
- Activity: Nine holes
- Transportation: Cart
- Message: `Want to grab a drink at the clubhouse afterward?`

Submitting creates an attractive proposal card in chat.

### Step 7: Simulated acceptance

The proposal becomes accepted through deterministic demo behavior. The UI may show a short `Maya is checking the details...` state followed by acceptance, but the user must not wait more than approximately one second and must not depend on a network request.

Accepted message:

> Maya accepted your golf date.

Primary action: `View confirmed outing`.

### Step 8: Confirmed outing

The confirmation screen shows:

- Alex and Maya photos
- River Bend Golf Club
- Fixed demo date and 4:30 PM time
- Nine holes
- Cart
- Optional clubhouse drink note
- A fictional course perk labeled as demo content
- `Add to calendar` button that shows a local success toast
- `Get directions` button that shows a local success toast or opens a harmless placeholder sheet
- Safety reminder to meet in a public place and share plans with a friend
- `Back to matches` and `Explore outings` actions

This screen is the endpoint of the primary demonstration.

---

## 11. Functional Requirements

### 11.1 Landing and demo entry

Required behavior:

- Show a clear mobile-first hero.
- Provide one primary `Enter prototype` action that enters the initialized scenario without onboarding.
- `Enter prototype` initializes the scenario only if no active scenario exists.
- A `reset=1` query parameter must clear demo state before initializing.
- A `scenario` query parameter may select a named scenario.
- Add `noindex, nofollow` metadata.
- Do not require authentication inside the app.

Supported examples:

```text
/?scenario=dustin-dating
/?scenario=outings
/?scenario=premium
/?reset=1
/?scenario=dustin-dating&reset=1
```

### 11.2 Onboarding

#### Step A: Intent

Controls:

- Date
- Play
- Both

Show concise explanation under each choice.

#### Step B: About you

Fields:

- First name
- Age
- Short bio
- Three photo tiles
- Prompt answer: `My ideal golf date is...`

Photos are local fixtures. The UI may imply photo selection, but clicking a photo tile only rotates among predefined local assets or shows a `Demo photos are preloaded` toast.

#### Step C: Golf style

Fields:

- Experience level
- Handicap, optional and labeled self-reported
- Casual versus competitive
- Walking versus cart
- Nine versus 18 holes
- Preferred days
- Preferred time windows
- Favorite courses
- Maximum travel distance

#### Step D: Discovery preferences

Fields:

- Intent compatibility
- Age range
- Distance
- Optional experience-level preference

Onboarding completion writes the edited demo profile to local state.

Acceptance criteria:

- All steps are prefilled.
- Forward and back navigation preserve edits.
- The final action navigates to Discover.
- Refreshing preserves the current onboarding step and values.

### 11.3 Discovery card stack

Each card shows:

- Primary profile photo
- First name and age
- Approximate distance
- Verification badge
- Date, Play, or Both intent badge
- Handicap or experience level
- One profile prompt
- Favorite course
- Two or three compatibility badges
- Photo position indicator when multiple photos exist

Required controls:

- Pass
- View profile
- Like
- Rewind after one action
- Optional display-only Filters sheet

Gesture behavior:

- Drag left to pass
- Drag right to like
- Return to center when drag threshold is not met
- Disable browser page scrolling while actively dragging the card
- Buttons must trigger the same store actions as gestures
- Keyboard users can focus and activate Pass, View, and Like

Visual feedback:

- `PASS` treatment appears while dragging left
- `LIKE` treatment appears while dragging right
- Card exits in drag direction
- Next card is visible underneath
- Do not render the full fixture set at once; render current plus one or two following cards

Deterministic behavior:

- Liking `maya-demo` creates `match-maya-demo` exactly once.
- Repeated action or reload must not duplicate the match.
- Passing Maya can be undone with Rewind or demo controls.
- Filters never reorder or hide profiles in the deterministic deck.
- When the stack is exhausted, show an empty state with `Reset deck` and `Explore outings`.

### 11.4 Full profile view

The full view may be a route, sheet, or modal.

Show:

- Photo gallery
- Bio and prompts
- Intent
- Golf compatibility details
- Favorite venues
- Approximate distance
- Verification explanation
- Like and Pass actions
- Report and Block actions

Report and Block are simulated. They should open a confirmation dialog and record a local event. Blocking hides the profile from discovery for the current local session.

### 11.5 Match celebration

Requirements:

- Trigger only for newly created mutual matches.
- Do not show again after the user dismisses it unless the scenario is reset.
- Include clear chat and outing actions.
- Use Motion for the profile-image entrance and restrained confetti-like decorative elements.
- Respect `prefers-reduced-motion` by replacing animated movement with a simple fade.

### 11.6 Match list

Show at least three rows:

- Maya Chen - newly matched or active conversation
- Sofia Ramirez - seeded older match
- Taylor Kim - seeded match with no conversation

Each row shows:

- Avatar
- First name only
- Intent badge
- Message preview or `New match`
- Relative demo timestamp such as `Now`, `Yesterday`, or `2d`
- Optional unread dot

All timestamps are fixture strings. Do not calculate relative timestamps from the live clock.

### 11.7 Chat

Required behavior:

- Display incoming and outgoing message bubbles.
- Allow text entry and sending.
- Ignore empty or whitespace-only messages.
- Persist locally.
- Keep the latest message visible after send.
- Show a compact match header with profile link and safety menu.
- Keep `Suggest a round` prominent.
- Support proposal cards as structured chat items.
- Support accepted-proposal state.

Do not implement:

- Read receipts
- Typing presence from a real connection
- Media uploads
- Voice notes
- Link previews
- Encryption claims

The three-dot safety menu should include:

- View profile
- Unmatch
- Block
- Report

Each action is simulated and uses a confirmation dialog.

Unmatching sets the match status to `unmatched` and hides it from the list. Keep the conversation and accepted outings in persisted state so a valid `/confirmed/:outingId` route remains recoverable.

### 11.8 Outing proposal

Fields:

- Venue
- Activity type
- Date label
- Time
- Nine or 18 holes when relevant
- Walking or cart when relevant
- Optional message

Activity types:

```ts
type GolfActivityType =
  | "nine-holes"
  | "eighteen-holes"
  | "driving-range"
  | "simulator"
  | "putting"
  | "clubhouse-drink";
```

Validation:

- Venue is required.
- Activity is required.
- Date label is required.
- Time is required.
- Message has a reasonable local character limit such as 240.

Submitting must:

1. Create a proposal object.
2. Add a proposal card to the conversation.
3. Track a local demo event.
4. Transition to accepted state through the scenario engine.
5. Offer a link to the confirmed-outing screen.

### 11.9 Confirmed outing

Requirements:

- Load directly by route from persisted state.
- If the outing does not exist, show a recoverable empty state.
- Show a clearly labeled fictional perk:

> Prototype course perk: 10% off twilight rounds

- `Add to calendar` must not contact an external calendar. It should show `Added to demo calendar` and set a local flag.
- `Get directions` must not expose a real precise address. It should show a placeholder route sheet or toast.
- `Cancel` and `Modify` may show `Not available in this prototype`.

### 11.10 Public outings

Seed at least four outings:

1. Saturday morning foursome - one open spot
2. Nine-hole singles mixer
3. Beginner-friendly simulator night
4. Sunday casual round

Each card shows:

- Organizer name and avatar
- Intent context: Date, Play, Both, or Event
- Venue
- Fixed demo date and time
- Activity type
- Skill or pace note
- Open spots
- Request-to-join action

Request behavior:

- Clicking `Request to join` changes local state.
- Show a success confirmation.
- Replace button with `Request sent`.
- Do not implement organizer approval.

One outing detail should include a second canned view of what an organizer might see, available through a `Preview organizer view` button. This is optional until the golden path is complete.

### 11.11 Membership concept

Display Dustin's proposed plans as a concept, without real billing or strict enforcement.

#### Basic - Free

Prototype copy:

- Browse local profiles
- Up to three visible matches
- Chat with visible matches
- Receive match notifications
- Limited outing features

#### Premium - $5.99 per month

Prototype copy:

- Up to five new matches per week
- Unlimited chat with those matches
- One outing post per billing cycle
- Expanded discovery filters

#### VIP - $9.99 per month

Prototype copy:

- Unlimited likes and matches
- Unlimited outing posts
- See who liked you
- Priority profile placement
- Early event access

Important implementation rule:

The golden path must not enforce restrictions that prevent Dustin from reaching the confirmed-outing screen. Membership restrictions are represented as concept UI only.

Paywall concept triggers may include:

- Selecting an advanced filter
- Trying to create an additional outing
- Tapping a locked Premium badge

`See who likes you` is fully enabled for this prototype at every membership level and uses local fixture data.

Tapping a purchase button should activate the selected plan locally and show a success screen. Never request payment details.

Include a small label:

> Prototype pricing and benefits are not final.

### 11.12 Profile and settings

Show:

- Alex's profile card
- Edit profile action that returns to onboarding or opens an edit form
- Membership status
- Verification badge explanation
- Safety center
- Demo reset
- About this prototype

`About this prototype` must state that all people, messages, courses, events, and offers are fictional.

### 11.13 Trust and safety affordances

Include these visible elements:

- 18+ statement on landing or onboarding
- Verified-photo badge
- Self-reported label on handicap
- Approximate distance only
- Report
- Block
- Unmatch
- Public-place safety reminder
- Date, Play, or Both intent label
- No media messages

Do not make claims that identity, criminal history, age, handicap, or course membership has actually been verified.

---

## 12. Smoke-and-Mirrors Matrix

| Capability | Prototype behavior |
|---|---|
| Authentication | Continue as fictional demo user |
| Profile data | Local TypeScript fixtures |
| Profile editing | Real local form state |
| Profile photos | Local static assets |
| Verification | Visual badge only |
| Discovery | Deterministic fixture order |
| Swipe gestures | Real client-side interaction |
| Like/pass state | Real local state |
| Mutual match | Rule-based deterministic trigger |
| Match celebration | Real UI animation |
| Chat history | Seeded local fixtures |
| Outgoing message | Real local state |
| Incoming reply | Scripted deterministic response |
| Course search | Fixed local list |
| Outing proposal | Real local form and state |
| Outing acceptance | Scripted deterministic transition |
| Public outings | Local fixtures |
| Join request | Local state and success message |
| Notifications | Toasts and badges only |
| Membership status | Local state |
| Payments | No-op success simulation |
| Tee-time booking | Not implemented |
| Course perk | Clearly labeled fictional offer |
| Calendar | Local success state only |
| Directions | Placeholder sheet or toast |
| Reporting/blocking | Local state only |
| Analytics | Local event log only |
| Backend | None |
| Database | None |

---

## 13. Demo Scenarios

Create a scenario registry rather than hardcoding behavior across components.

```ts
type DemoScenarioId =
  | "dustin-dating"
  | "outings"
  | "premium";

interface DemoScenario {
  id: DemoScenarioId;
  label: string;
  currentUserId: string;
  initialRoute: string;
  onboardingComplete: boolean;
  membershipLevel: MembershipLevel;
  profileDeckIds: string[];
  mutualMatchProfileIds: string[];
  seededMatchIds: string[];
  featuredCourseId: string;
  featuredOutingId: string;
  scriptedReplyDelayMs: number;
  autoAcceptProposalDelayMs: number;
}
```

### `dustin-dating`

- Starts at `/discover`; onboarding is already complete
- Basic membership
- Profile order: Jordan, Erin, Maya, then additional profiles
- Maya creates a mutual match
- River Bend is the featured venue
- Proposal is auto-accepted

### `outings`

- Starts at `/outings`
- Onboarding already complete
- Shows several public outings
- One outing has an organizer-preview branch

### `premium`

- Starts at `/discover`
- VIP membership active
- Advanced filters and `See who likes you` are unlocked

---

## 14. Demo State Model

Use one primary Zustand store with persistence middleware. Split into typed logical slices if helpful, but expose one coherent store API.

```ts
type MembershipLevel = "basic" | "premium" | "vip";
type SwipeDirection = "left" | "right";
type ProposalStatus = "draft" | "proposed" | "accepted" | "declined";

interface DemoState {
  schemaVersion: number;
  scenarioId: DemoScenarioId;
  initialized: boolean;

  currentUser: DemoUser;
  onboardingStep: number;
  onboardingComplete: boolean;
  membershipLevel: MembershipLevel;

  profileDeckIds: string[];
  currentProfileIndex: number;
  likedProfileIds: string[];
  passedProfileIds: string[];
  blockedProfileIds: string[];
  lastSwipe?: {
    profileId: string;
    direction: SwipeDirection;
  };

  matches: Match[];
  dismissedMatchCelebrationIds: string[];
  conversations: Record<string, Conversation>;

  proposedOutings: ProposedOuting[];
  publicOutingRequests: Record<string, OutingRequestStatus>;
  demoCalendarOutingIds: string[];

  presentation: {
    reducedMotionOverride?: boolean;
    forcePhoneFrame?: boolean;
    guidedMode: boolean;
  };

  eventLog: DemoEvent[];

  initializeScenario: (scenarioId: DemoScenarioId, force?: boolean) => void;
  updateCurrentUser: (patch: Partial<DemoUser>) => void;
  setOnboardingStep: (step: number) => void;
  completeOnboarding: () => void;

  swipeProfile: (profileId: string, direction: SwipeDirection) => void;
  rewindLastSwipe: () => void;
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
  reportProfile: (profileId: string, reason?: string) => void;
  unmatch: (matchId: string) => void;

  jumpToStage: (stage: DemoStage) => void;
  resetDemo: (scenarioId?: DemoScenarioId) => Promise<void>;
  trackEvent: (name: DemoEventName, metadata?: Record<string, unknown>) => void;
}
```

### Persistence

Use a unique storage key:

```ts
const DEMO_STORAGE_KEY = "fairway-mingle-demo-state";
const DEMO_SCHEMA_VERSION = 1;
```

Requirements:

- Persist product state but not transient modal-open state.
- Use explicit `partialize` logic.
- Include a migration function.
- If migration fails, reset safely to the default scenario.
- Cap the local event log at 100 entries.
- Avoid persisting timers.

### Reset behavior

`resetDemo()` must:

1. Clear the Zustand persisted key.
2. Clear any other Fairway Mingle local or session storage keys.
3. Clear Cache Storage entries created for the prototype when available.
4. Optionally unregister service workers in a development-only or presenter-confirmed flow.
5. Reinitialize the selected scenario.
6. Navigate to the scenario's initial route.
7. Reload only when necessary.

---

## 15. Data Contracts

Keep fixture contracts in `src/types/` and fixture records in `src/data/`.

### Profile

```ts
interface DemoProfile {
  id: string;
  fictional: true;
  firstName: string;
  age: number;
  pronouns?: string;
  intent: UserIntent;
  approximateDistanceMiles: number;
  verifiedPhoto: boolean;
  bio: string;
  prompts: Array<{
    prompt: string;
    answer: string;
  }>;
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
```

### Course

```ts
interface DemoCourse {
  id: string;
  fictional: true;
  name: string;
  type: "public-course" | "private-course" | "range" | "simulator" | "putting";
  areaLabel: string;
  imagePath: string;
  amenities: string[];
  prototypePerk?: string;
}
```

### Match

```ts
interface Match {
  id: string;
  profileId: string;
  createdAtLabel: string;
  status: "active" | "unmatched" | "blocked";
  celebrationPending: boolean;
}
```

### Message

```ts
type MessageKind = "text" | "outing-proposal" | "system";

interface Message {
  id: string;
  matchId: string;
  sender: "current-user" | "matched-user" | "system";
  kind: MessageKind;
  body?: string;
  outingId?: string;
  timestampLabel: string;
}
```

### Proposed outing

```ts
interface ProposedOuting {
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
```

### Public outing

```ts
interface PublicOuting {
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
```

---

## 16. Required Fixture Content

Create at least 10 fictional discovery profiles. The first three must be stable:

### Jordan Lee

- ID: `jordan-demo`
- Age: 31
- Intent: Both
- Experience: Beginner
- Favorite venue: Meadowview Range
- Compatibility badges: `New golfer`, `Sunday afternoons`, `Range first`
- Expected guided-demo action: Pass

### Erin Brooks

- ID: `erin-demo`
- Age: 35
- Intent: Date
- Experience: Intermediate
- Handicap: 18.6
- Favorite course: Oak Hollow
- Compatibility badges: `Twilight rounds`, `Cart`, `Casual pace`
- Expected guided-demo action: Like, no match

### Maya Chen

- ID: `maya-demo`
- Age: 32
- Intent: Both
- Experience: Intermediate
- Handicap: 11.8
- Favorite course: River Bend Golf Club
- Compatibility badges: `Saturday afternoons`, `Nine holes`, `Clubhouse drink`
- Guided-demo behavior: Mutual match
- Seeded message: `I've been wanting to play River Bend. Are you usually free on weekends?`

Additional suggested profiles:

- Sofia Ramirez (seeded match only; exclude from discovery)
- Taylor Kim (seeded match only; exclude from discovery)
- Morgan Patel
- Casey Thompson
- Riley Johnson
- Cameron Davis
- Avery Wilson
- Jamie Foster (discovery only)
- Drew Sullivan (discovery only)

Use varied experience levels, schedules, golf preferences, backgrounds, and intentions. Avoid stereotypes. All profiles must be adults aged 25 or older in the demo fixture set.

### Required fictional courses and venues

- `pine-ridge` - Pine Ridge Municipal
- `river-bend` - River Bend Golf Club
- `oak-hollow` - Oak Hollow
- `lakeside-links` - Lakeside Links
- `the-turn-simulator` - The Turn Simulator Lounge
- `meadowview-range` - Meadowview Range

`river-bend` has the prototype perk:

> Prototype course perk: 10% off twilight rounds

### Required public outings

- `outing-saturday-fourth`
- `outing-singles-nine`
- `outing-beginner-simulator`
- `outing-sunday-casual`

Use fixed human-readable date labels such as `Saturday, September 12` rather than computing dates from the current clock. This prevents screenshots and demo copy from changing unexpectedly.

---

## 17. Technology Stack

Use the following stack unless the existing repository already contains an equivalent choice.

### Core

- Vite
- React
- TypeScript
- React Router
- Tailwind CSS using the Vite plugin
- shadcn/ui components
- Motion for React
- Zustand with persistence middleware
- Lucide React icons

### PWA

- `vite-plugin-pwa`
- Generated manifest and service worker
- Local icons and assets

### Quality

- ESLint
- Prettier
- Vitest
- React Testing Library
- Playwright for the golden-path browser test

### Runtime constraints

- Use a supported Node release compatible with the installed Vite version.
- Pin the chosen runtime in `.nvmrc` and `package.json` engines.
- Commit the package lockfile.
- Use npm unless the repository is already standardized on another package manager.

### Suggested bootstrap commands

Run only as appropriate for the repository state:

```bash
npm create vite@latest . -- --template react-ts
npm install react-router zustand motion lucide-react
npm install tailwindcss @tailwindcss/vite
npm install -D vite-plugin-pwa
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D @playwright/test
npx shadcn@latest init
```

Add only the shadcn/ui components that the app uses. Likely components:

```text
avatar
badge
button
card
dialog
drawer
input
label
progress
radio-group
select
separator
sheet
slider
sonner
switch
tabs
textarea
tooltip
```

Do not install a large component or form framework unless it materially reduces implementation time.

### Form handling

Native controlled React forms are sufficient for this prototype. A form library is optional. If introduced, keep validation simple and avoid schema duplication.

---

## 18. Project Structure

Recommended structure:

```text
.
|-- public/
|   |-- icons/
|   |-- demo/
|   |   |-- profiles/
|   |   |-- courses/
|   |   `-- brand/
|   `-- robots.txt
|-- src/
|   |-- app/
|   |   |-- App.tsx
|   |   |-- router.tsx
|   |   `-- providers.tsx
|   |-- components/
|   |   |-- app-shell/
|   |   |-- chat/
|   |   |-- demo/
|   |   |-- discovery/
|   |   |-- membership/
|   |   |-- outings/
|   |   |-- profile/
|   |   `-- ui/
|   |-- data/
|   |   |-- courses.ts
|   |   |-- conversations.ts
|   |   |-- outings.ts
|   |   |-- profiles.ts
|   |   `-- scenarios.ts
|   |-- hooks/
|   |-- lib/
|   |   |-- demo-events.ts
|   |   |-- demo-reset.ts
|   |   |-- format.ts
|   |   `-- utils.ts
|   |-- pages/
|   |   |-- ConfirmedOutingPage.tsx
|   |   |-- DemoControlsPage.tsx
|   |   |-- DiscoverPage.tsx
|   |   |-- LandingPage.tsx
|   |   |-- MatchChatPage.tsx
|   |   |-- MatchesPage.tsx
|   |   |-- MembershipPage.tsx
|   |   |-- NotFoundPage.tsx
|   |   |-- OnboardingPage.tsx
|   |   |-- OutingDetailPage.tsx
|   |   |-- OutingsPage.tsx
|   |   `-- ProfilePage.tsx
|   |-- stores/
|   |   |-- demo-store.ts
|   |   `-- demo-store.test.ts
|   |-- styles/
|   |   `-- globals.css
|   |-- types/
|   |   |-- demo.ts
|   |   |-- golf.ts
|   |   `-- product.ts
|   |-- test/
|   |   `-- setup.ts
|   |-- main.tsx
|   `-- vite-env.d.ts
|-- tests/
|   `-- golden-path.spec.ts
|-- docs/
|   |-- DECISIONS.md
|   `-- DEMO_SCRIPT.md
|-- apache/
|   |-- fairway-mingle.conf.example
|   `-- README.md
|-- scripts/
|   `-- deploy.sh.example
|-- .nvmrc
|-- components.json
|-- eslint.config.js
|-- index.html
|-- package.json
|-- tsconfig.json
|-- vite.config.ts
`-- README.md
```

The exact folder names may be adjusted, but fixture data, product types, store actions, pages, and demo controls should remain clearly separated.

---

## 19. Visual Design Specification

### 19.1 Brand direction

The interface should evoke:

- Fresh fairways
- Warm late-afternoon golf
- Friendly social confidence
- A modern dating product

Avoid:

- Heavy plaid or country-club motifs
- Excessive golf-ball textures
- Cartoon golf illustrations throughout the UI
- Neon dating-app colors
- Dense dashboards
- Generic enterprise SaaS styling

### 19.2 Suggested color tokens

Use CSS custom properties so colors can be changed centrally.

```css
:root {
  --background: #f7f5ef;
  --foreground: #142019;
  --card: #ffffff;
  --card-foreground: #142019;
  --primary: #1f5b3a;
  --primary-foreground: #ffffff;
  --secondary: #dfe9df;
  --secondary-foreground: #183b29;
  --accent: #d3a64b;
  --accent-foreground: #2b2416;
  --muted: #ece9e1;
  --muted-foreground: #667069;
  --border: #d9ddd7;
  --destructive: #b64c4c;
  --destructive-foreground: #ffffff;
  --ring: #2f7650;
}
```

Use the accent color sparingly for perks, premium details, and celebration moments. Primary actions should remain green.

### 19.3 Typography

Use a local/system font stack for reliability:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
  "Segoe UI", sans-serif;
```

Do not make the demo depend on a remote font request. If Inter is not bundled locally, the system stack should render cleanly.

Suggested hierarchy:

- Hero: 32-40 px mobile/desktop responsive
- Page title: 24-28 px
- Card title: 20-24 px
- Body: 15-17 px
- Supporting metadata: 13-14 px
- Labels: 12-13 px, medium weight

### 19.4 Spacing and shape

- Base spacing unit: 4 px
- Screen padding: 16 px mobile, 20-24 px larger widths
- Card radius: 20-24 px
- Sheet/dialog radius: 20-24 px where supported
- Button radius: 999 px for primary pill actions or 14-16 px for standard controls
- Minimum interactive target: 44 x 44 px
- Use soft shadows, not heavy elevation

### 19.5 App shell

On phones:

- Full viewport width
- Use `min-height: 100dvh`
- Respect `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`
- Fixed or sticky bottom navigation
- Avoid body-level horizontal overflow

On desktop:

- Center a phone-like application frame around 390-430 px wide
- Frame may have a maximum height around 844-900 px
- Let the app scroll internally where appropriate
- Show a subtle background and optional product explainer beside the frame
- Provide an optional QR-code placeholder, not a live external service dependency

### 19.6 Profile cards

- Use a portrait image area occupying most of the card
- Add a lower gradient for readable text
- Display name, age, intent, and distance over the image
- Put golf details in a lower information panel or expanded card area
- Show a visible compatibility badge row
- Keep one dominant visual focus per card

### 19.7 Match celebration

- Use two overlapping circular or rounded profile images
- Add a restrained golf flag, heart, or ball motif
- Avoid casino-style confetti overload
- Keep the call to action visible without scrolling

### 19.8 Empty and error states

Every route should have a designed empty state with a useful action. Never show raw `undefined`, broken images, or an unstyled stack trace.

---

## 20. Motion and Interaction Design

Use Motion for React for:

- Card drag and exit
- Card-stack transitions
- Match celebration entrance
- Sheet/modal transitions when not supplied by the component primitive
- Proposal acceptance state
- Small success-state transitions

Do not use Motion for every button or text element.

### Suggested timing

- Micro-interactions: 120-180 ms
- Page or sheet transitions: 180-260 ms
- Card exits: 220-320 ms
- Match celebration: 450-700 ms total

### Reduced motion

Use the user's media preference and Motion's reduced-motion capabilities. When reduced motion is requested:

- Replace card-flight animations with a short fade/slide
- Remove rotation and large scaling
- Replace celebration particles with a static decorative background
- Preserve all functional state changes

---

## 21. Accessibility Requirements

The prototype should meet a practical WCAG AA baseline.

Requirements:

- All interactive controls are keyboard reachable.
- Focus indicators are visible.
- Buttons have accessible names.
- Swipe actions have equivalent buttons.
- Color is not the only indicator of intent, status, or error.
- Text over images has sufficient contrast.
- Dialogs and sheets manage focus correctly.
- Match celebration is announced with an appropriate live region or dialog title.
- Form fields have labels and error descriptions.
- Touch targets are at least 44 px.
- Reduced motion is respected.
- Profile images have concise alt text such as `Maya, fictional demo profile`.
- Decorative images use empty alt text.
- Toasts should not be the only place critical information appears.

---

## 22. PWA Requirements

Configure the app as an installable PWA, but do not let PWA work delay the golden path.

Manifest values:

```ts
{
  name: "Fairway Mingle Prototype",
  short_name: "Fairway Mingle",
  description: "A fictional prototype for golf-centered dating and social outings.",
  start_url: "/",
  scope: "/",
  display: "standalone",
  background_color: "#f7f5ef",
  theme_color: "#1f5b3a",
  orientation: "portrait-primary"
}
```

Provide at least:

- 192 x 192 icon
- 512 x 512 icon
- Maskable icon if practical
- Apple touch icon
- Favicon

Service worker behavior:

- Precache the app shell and local static assets.
- Do not cache external APIs because there are none.
- Use an automatic update strategy suitable for a prototype.
- Ensure `index.html`, the service worker, and registration script are not cached long-term by Apache.
- Provide a presenter reset path that can clear stale caches.

The app should show a subtle offline-ready message only if it adds value. Do not surface complex installation prompts.

---

## 23. Demo Controls

Create a hidden route at `/__demo`.

This page is presenter tooling, not production UI.

Controls:

- Select scenario
- Reset current scenario
- Jump to onboarding complete
- Jump to discovery
- Trigger Maya match
- Jump to Maya chat
- Create accepted River Bend outing
- Jump to confirmed outing
- Set membership: Basic, Premium, VIP
- Restore profile deck
- Clear blocked profiles
- Clear PWA caches
- View local event log
- Copy current route

Requirements:

- The route is not linked in bottom navigation.
- A small long-press or keyboard shortcut may open it, but this is optional.
- All controls must use the same store actions as the product UI where possible.
- Each jump operation should leave state internally consistent.
- The page must make it impossible to create duplicate matches or duplicate canonical outings.

Suggested keyboard shortcut for desktop demos:

```text
Ctrl+Shift+D
```

Do not intercept this shortcut inside text inputs.

---

## 24. Local Demo Analytics

Implement a lightweight local event log. Do not send data anywhere.

Suggested events:

```ts
type DemoEventName =
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
```

Each event contains:

```ts
interface DemoEvent {
  id: string;
  name: DemoEventName;
  occurredAtIso: string;
  metadata?: Record<string, unknown>;
}
```

Using a live ISO timestamp in the hidden event log is acceptable. User-facing time labels should remain fixed fixtures.

---

## 25. Error Handling and Resilience

Requirements:

- Add a top-level React error boundary.
- On recoverable state errors, show `Reset demo` and `Return home`.
- If persisted state is corrupt, discard it and initialize the default scenario.
- If a fixture reference is missing, log a development warning and render a safe placeholder.
- Images must have local fallback UI.
- No unhandled promise rejections should occur.
- No golden-path action may require a successful timer callback.
- Route refreshes must work under Apache's SPA rewrite.
- Direct links to match, outing, and confirmation routes should load when valid persisted data exists.

---

## 26. Testing Strategy

### 26.1 Unit tests

Required store tests:

- Scenario initialization is deterministic.
- Liking Erin does not create a match.
- Liking Maya creates exactly one match.
- Liking Maya twice does not duplicate the match.
- Rewind restores the previous deck state.
- Sending an empty message does nothing.
- Sending a valid message appends once.
- Proposing an outing creates the correct structured state.
- Accepting an outing updates proposal and conversation state.
- Join requests are idempotent.
- Reset returns the application to canonical scenario state.
- Persisted-state migration failure resets safely.

### 26.2 Component tests

Recommended tests:

- Profile card renders required labels.
- Like and Pass buttons call the expected actions.
- Match celebration buttons navigate correctly.
- Proposal form validates required fields.
- Membership screen labels pricing as prototype copy.
- Report and Block dialogs require confirmation.

### 26.3 End-to-end test

Create one Playwright test for the golden path at a mobile viewport such as 390 x 844:

1. Open `/?reset=1&scenario=dustin-dating`.
2. Enter the prototype and confirm it opens Discover without onboarding.
3. Pass Jordan.
4. Like Erin.
5. Like Maya.
6. Confirm match celebration appears.
7. Open chat.
8. Send a message.
9. Open Suggest a round.
10. Submit the prefilled proposal.
11. Confirm accepted state.
12. Open confirmed outing.
13. Assert River Bend, Saturday, September 12, 4:30 PM, and the prototype perk are visible.

Add a desktop smoke test that verifies the phone frame and navigation render without overflow.

### 26.4 Manual checks

Before stakeholder delivery, manually test:

- Current iPhone Safari
- Current Android Chrome, if available
- Desktop Chrome
- Desktop Safari or Firefox
- Touch and mouse swipe behavior
- Keyboard navigation
- Reduced-motion mode
- Add-to-home-screen behavior where practical
- Reload on every primary route
- Apache access control with all static assets and service worker files, only if enabled for deployment
- Reset after PWA installation

### 26.5 Quality scripts

Provide scripts similar to:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "typecheck": "tsc -b --pretty false",
    "test": "vitest",
    "test:run": "vitest run",
    "test:e2e": "playwright test",
    "verify": "npm run lint && npm run typecheck && npm run test:run && npm run build"
  }
}
```

---

## 27. Performance Targets

This is a prototype, but it should feel immediate.

Targets:

- No blocking API requests
- No profile image hotlinks
- Preload the current and next two profile images
- Lazy-load non-critical route bundles when reasonable
- Avoid loading all full-resolution images at once
- Keep animation work primarily on transforms and opacity
- Avoid layout thrashing during drag
- No obvious input delay on a modern phone
- No console errors in the production build

Do not chase perfect Lighthouse scores at the expense of the product flow. Accessibility, reliability, and image sizing matter most.

---

## 28. Apache Deployment Specification

The production artifact is the contents of `dist/`.

Recommended server layout:

```text
/var/www/fairway-mingle/
|-- current -> /var/www/fairway-mingle/releases/20260824T120000Z
`-- releases/
    |-- 20260824T120000Z/
    `-- 20260824T130000Z/
```

Apache `DocumentRoot` points to:

```text
/var/www/fairway-mingle/current
```

### Required Apache modules

- `mod_rewrite`
- `mod_headers`
- `mod_ssl` for HTTPS
- `mod_auth_basic` and `mod_authn_file` if Basic Auth is enabled

### Example virtual host

Create `apache/fairway-mingle.conf.example` with a template similar to the following. Replace the domain and certificate paths during deployment.

```apache
<VirtualHost *:443>
    ServerName fairway.example.com
    DocumentRoot /var/www/fairway-mingle/current

    DirectoryIndex index.html

    <Directory /var/www/fairway-mingle/current>
        Options -Indexes +FollowSymLinks
        AllowOverride None

        # Public option:
        Require all granted

        # Private Basic Auth option: remove "Require all granted" above,
        # uncomment the lines below, and create the password file.
        # AuthType Basic
        # AuthName "Fairway Mingle Prototype"
        # AuthUserFile /etc/apache2/fairway-mingle.htpasswd
        # Require valid-user

        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} -f [OR]
        RewriteCond %{REQUEST_FILENAME} -d
        RewriteRule ^ - [L]
        RewriteRule ^ index.html [L]
    </Directory>

    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "no-referrer"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Robots-Tag "noindex, nofollow, noarchive"
    Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
    Header always set Content-Security-Policy "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; manifest-src 'self'; worker-src 'self'; font-src 'self' data:"

    <LocationMatch "^/assets/">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </LocationMatch>

    <Files "index.html">
        Header set Cache-Control "no-cache, no-store, must-revalidate"
    </Files>

    <FilesMatch "^(sw\.js|registerSW\.js|manifest\.webmanifest)$">
        Header set Cache-Control "no-cache, no-store, must-revalidate"
    </FilesMatch>

    SSLEngine on
    SSLCertificateFile /path/to/fullchain.pem
    SSLCertificateKeyFile /path/to/privkey.pem

    ErrorLog ${APACHE_LOG_DIR}/fairway-mingle-error.log
    CustomLog ${APACHE_LOG_DIR}/fairway-mingle-access.log combined
</VirtualHost>
```

Notes:

- If the built service-worker or manifest filenames differ, update the cache-control match.
- Keep all assets same-origin so the restrictive content security policy works.
- Test direct navigation to `/matches/match-maya-demo` and `/confirmed/...` after enabling rewrites.
- If the app is deployed under a path prefix instead of a subdomain, set the Vite base path, router basename, PWA scope, start URL, and Apache rewrites consistently. A dedicated subdomain is strongly preferred.

### Optional HTTP redirect

```apache
<VirtualHost *:80>
    ServerName fairway.example.com
    Redirect permanent / https://fairway.example.com/
</VirtualHost>
```

### Optional Basic Auth setup

Example server command:

```bash
sudo htpasswd -c /etc/apache2/fairway-mingle.htpasswd demo
```

Do not commit the password file or password to the repository.

---

## 29. Deployment Workflow

The simplest manual workflow is acceptable. Deploy at the root of a dedicated subdomain:

```bash
npm ci
npm run verify
npm run build
sudo rsync -a --delete dist/ /var/www/fairway-mingle/current/
```

An atomic release workflow is preferred to avoid partially deployed builds.

Create `scripts/deploy.sh.example` similar to:

```bash
#!/usr/bin/env bash
set -euo pipefail

APP_ROOT="/var/www/fairway-mingle"
RELEASE_ID="$(date -u +%Y%m%dT%H%M%SZ)"
RELEASE_DIR="$APP_ROOT/releases/$RELEASE_ID"
CURRENT_LINK="$APP_ROOT/current"

npm ci
npm run verify

sudo mkdir -p "$RELEASE_DIR"
sudo rsync -a --delete dist/ "$RELEASE_DIR/"

sudo ln -s "$RELEASE_DIR" "$APP_ROOT/current-next"
sudo mv -Tf "$APP_ROOT/current-next" "$CURRENT_LINK"

printf 'Deployed Fairway Mingle release %s\n' "$RELEASE_ID"
```

Adjust ownership and permissions for the actual VPS. Retain a small number of prior release directories for rollback.

Rollback can be performed by pointing `current` to a previous release and reloading Apache only if required.

The static site should not require an Apache restart for each deployment.

---

## 30. Repository Documentation

Create or update:

### `README.md`

Include:

- Product summary
- Prototype disclaimer
- Prerequisites
- Setup commands
- Development commands
- Test commands
- Build command
- Demo scenario URLs
- Deployment summary
- Location of the full specification

### `docs/DEMO_SCRIPT.md`

Include a concise presenter walkthrough:

1. Reset to `dustin-dating`.
2. Enter the prototype directly into Discover.
3. Pass Jordan.
4. Like Erin.
5. Like Maya.
6. Open match chat.
7. Suggest River Bend.
8. Show confirmation and perk.
9. Briefly show incoming likes, Outings, Membership, and Profile.
10. Reset before handing the device to Dustin.

### `docs/DECISIONS.md`

Record material deviations from this specification, package choices that may be non-obvious, and unresolved product decisions. Do not turn it into a daily log.

---

## 31. Implementation Phases

### Phase 0: Repository foundation

- [ ] Scaffold Vite React TypeScript project.
- [ ] Configure strict TypeScript.
- [ ] Add React Router.
- [ ] Add Tailwind through the Vite plugin.
- [ ] Initialize shadcn/ui.
- [ ] Add Motion, Zustand, and Lucide.
- [ ] Add Vitest and test setup.
- [ ] Add Playwright.
- [ ] Add path alias `@/*` to `src/*`.
- [ ] Add lint, typecheck, test, build, and verify scripts.
- [ ] Create initial README and docs folders.

**Exit criterion:** A styled landing route renders, tests run, and `npm run verify` succeeds.

### Phase 1: App shell, design tokens, and fixtures

- [ ] Implement global design tokens.
- [ ] Implement responsive mobile shell and desktop phone frame.
- [ ] Implement bottom navigation.
- [ ] Add local fictional profile and course assets.
- [ ] Define all product types.
- [ ] Add profile, course, conversation, outing, and scenario fixtures.
- [ ] Implement the persisted Zustand store.
- [ ] Implement scenario initialization and reset.

**Exit criterion:** The app can initialize `dustin-dating`, navigate between shell routes, and retain state after refresh.

### Phase 2: Onboarding and discovery

- [ ] Implement four-step prefilled onboarding.
- [ ] Implement profile cards.
- [ ] Implement card stack.
- [ ] Implement Like, Pass, View, and Rewind.
- [ ] Implement touch drag and desktop controls.
- [ ] Add full profile view.
- [ ] Add deterministic Maya match logic.
- [ ] Add unit tests for swipe and match state.

**Exit criterion:** A user can enter Discover without onboarding and reliably create the Maya match; optional onboarding remains directly reachable.

### Phase 3: Match, chat, and outing proposal

- [ ] Implement match celebration.
- [ ] Implement match list.
- [ ] Implement Maya chat with seeded message.
- [ ] Implement outgoing local messages.
- [ ] Implement optional scripted reply.
- [ ] Implement Suggest a round flow.
- [ ] Implement structured proposal card.
- [ ] Implement deterministic acceptance.
- [ ] Implement confirmed-outing screen.
- [ ] Add golden-path end-to-end test.

**Exit criterion:** The full golden path works from reset URL to confirmed outing.

### Phase 4: Supporting concept screens

- [ ] Implement public outings list.
- [ ] Implement outing details.
- [ ] Implement Request to join state.
- [ ] Implement membership concept screen.
- [ ] Implement simulated plan activation.
- [ ] Implement Profile and About prototype screens.
- [ ] Implement report, block, and unmatch dialogs.

**Exit criterion:** Dustin can explore all major concept areas without dead ends.

### Phase 5: Presenter controls and PWA

- [ ] Implement `/__demo` controls.
- [ ] Implement jump-to-stage actions.
- [ ] Implement local event log.
- [ ] Configure PWA manifest and service worker.
- [ ] Add local icons.
- [ ] Add cache-clearing reset support.
- [ ] Add noindex metadata.

**Exit criterion:** A presenter can recover from any demo state and install or launch the app in a standalone-style mode.

### Phase 6: QA and Apache delivery

- [ ] Add error boundary and missing-fixture fallbacks.
- [ ] Verify reduced motion.
- [ ] Verify keyboard navigation.
- [ ] Verify mobile overflow and safe areas.
- [ ] Run all unit, component, and end-to-end tests.
- [ ] Add Apache example configuration.
- [ ] Add deployment script example.
- [ ] Test the production build behind Apache.
- [ ] Test direct route reloads.
- [ ] Test Basic Auth if enabled.
- [ ] Test cache invalidation after a second deployment.
- [ ] Write final demo script.

**Exit criterion:** The stakeholder URL works consistently on mobile and desktop, and the golden path can be reset and repeated.

---

## 32. Definition of Done

The prototype is ready to give Dustin when all of the following are true:

- Dustin can open one HTTPS URL.
- No app-store install is required.
- The landing page makes the concept understandable within a few seconds.
- The demo contains a believable populated marketplace.
- Onboarding can be completed without typing.
- Profile cards work with touch, mouse, and buttons.
- Liking Maya always creates one mutual match.
- The match celebration leads to chat or an outing proposal.
- A user can send a local message.
- A user can propose the prefilled River Bend outing.
- The outing reaches an accepted state without a backend.
- The confirmed screen displays the correct venue, time, format, and fictional perk.
- Outings and Membership concept screens are available.
- Report, Block, and Unmatch affordances are visible.
- All demo content is fictional and disclosed as such.
- Refreshing preserves sensible state.
- Reset restores the canonical demo.
- Direct route reloads work behind Apache.
- The production build contains no broken assets or console errors.
- `npm run verify` passes.
- The Playwright golden-path test passes.
- A presenter can recover through `/__demo`.

---

## 33. Deliberately Deferred Product Decisions

Do not let these questions block the prototype:

- Whether the final product is dating-first or social-golf-first
- Whether Date, Play, and Both belong in one marketplace
- Whether matching limits should be daily, weekly, or lifetime
- Whether free users can message every mutual match
- Whether the final paid structure has one, two, or three tiers
- Whether the app should charge for subscriptions, events, booking referrals, or all three
- Which city should launch first
- Whether course discounts are practical
- Whether users should be matched by handicap
- Whether official handicap integration is worth pursuing
- Whether native apps will eventually be required

The prototype should make these concepts discussable without embedding them deeply in architecture.

---

## 34. Future Evolution After Prototype Validation

Do not implement this section now. It documents a possible migration path.

### Stage A: Invite-only usability alpha

Add:

- Supabase authentication
- Postgres persistence
- Profile storage
- Real likes and matches
- Row-level security
- Basic two-party chat
- Invite codes
- One launch metro

### Stage B: Operated local pilot

Add:

- Manual moderation console
- Event attendance
- Payment or deposits for hosted events
- Venue-partner records
- Feedback collection
- Safety workflows

### Stage C: Monetization experiment

Add one paid tier first, then test:

- See incoming likes
- Expanded filters
- Travel mode
- Incognito mode
- Event priority
- Profile boosts

### Stage D: Course utility

Only after measurable booking demand:

- Venue referral links
- Tee-time provider integration
- Group-booking support
- Course-specific offers

The static prototype should be considered disposable. Reuse visual and product learnings, not necessarily its state architecture.

---

## 35. Coding-Agent Completion Report

At the end of each implementation phase, report:

1. Files added or materially changed
2. Features completed
3. Tests added
4. Commands run and their results
5. Known limitations
6. Deviations from the specification
7. The next highest-priority phase

Do not claim a feature is complete if it is only visually stubbed unless the specification explicitly calls for a simulated implementation.

---

## 36. Initial Agent Kickoff Prompt

Use the following instruction after placing this file in the repository:

```text
Read FAIRWAY_MINGLE_PROTOTYPE_SPEC.md completely and treat it as the source of truth.

Inspect the repository before making changes. Then implement Phase 0 and Phase 1 as a coherent foundation, prioritizing a clean static Vite architecture and the deterministic demo-state model. Do not add a backend or any external API. Use fictional local fixtures and local assets only.

After Phase 1, run the configured lint, typecheck, unit-test, and production-build commands. Fix failures. Update README.md, docs/DECISIONS.md, and provide a completion report containing changed files, test results, limitations, and the next recommended work.

Do not begin unrelated production infrastructure. Keep the implementation optimized for a reliable Dustin stakeholder demo behind Apache.
```

After Phase 1 is reviewed, use:

```text
Continue from FAIRWAY_MINGLE_PROTOTYPE_SPEC.md. Implement Phase 2 and Phase 3, including the complete deterministic golden path from onboarding through the confirmed River Bend outing. Add the required unit tests and Playwright golden-path test. Keep all data local and fictional. Run the full verification suite and report results and deviations.
```

---

## 37. Technical Reference Notes

This specification assumes current official setup patterns for:

- Vite React and TypeScript scaffolding
- Tailwind CSS through its Vite plugin
- shadcn/ui in a Vite application
- Motion imports from `motion/react`
- Zustand persistence middleware
- React Router browser routing
- `vite-plugin-pwa` manifest and service-worker generation
- Apache 2.4 rewriting for single-page-application routes

When package documentation and this specification conflict on installation syntax, follow the current official package documentation while preserving the architecture, requirements, and acceptance criteria in this document.
