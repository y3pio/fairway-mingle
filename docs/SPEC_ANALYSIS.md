# Fairway Mingle — Spec Analysis

**Status:** Implementation brief, written before coding  
**Source of truth:** [`FAIRWAY_MINGLE_PROTOTYPE_SPEC.md`](../FAIRWAY_MINGLE_PROTOTYPE_SPEC.md)  
**Audience:** The implementation agent (GPT-5.6 Sol) and repository contributors  
**Analyzed:** 2026-08-24, full spec §1–§37, greenfield repo  

Use this document as the **implementation brief**. If this brief and the spec disagree on a product requirement, follow the spec. If this brief and the spec disagree on an unspecified detail, follow the recommended default here and record it in `docs/DECISIONS.md`.

---

## How to use this file

1. Read the spec completely. Then read this file.
2. Do not add a backend, auth, payments, maps, or extra dating-app features.
3. Treat unanswered questions below as **open**. Use the recommended default unless the product owner has recorded a different choice in `docs/DECISIONS.md`.
4. Do not invent product requirements. If something is still unspecified and not covered here, choose the simplest implementation consistent with the product goals and document it in `docs/DECISIONS.md` (§1 rule 12).

---

## 0. Resolved product-owner decisions

The product owner resolved the implementation questions on 2026-08-24:

1. Use local stylized fictional portraits and local stylized course artwork.
2. Deploy at the root of a dedicated subdomain.
3. Skip onboarding in the canonical prototype and expose all features for direct demonstration. Keep onboarding reachable as optional concept UI.
4. Use `Saturday, September 12` for River Bend and a coherent fictional September weekend elsewhere.
5. Exclude Sofia and Taylor from discovery; use them only as seeded matches. Add Jamie and Drew as discovery-only profiles for a 10-card deck.
6. Filters are display-only and never alter the golden-path order.
7. Fully enable `See who likes you` with local fixtures and a real prototype screen at every membership level.
8. Do not add application authentication. Apache access control remains an external deployment option.
9. Match rows show first names only; do not add `lastName` solely for that list.
10. Unmatch hides the match but preserves the conversation and accepted outing; `/confirmed/:outingId` remains recoverable.

Questions not listed here (exact illustration polish, QR placeholder interactivity, sent-message timestamp label, etc.) are non-blocking. Pick the simplest consistent choice and record only material ones.

---

## 1. Product in one paragraph

Fairway Mingle is a **dating-first social golf app** (“Meet your match. Play a round.”). Golf-specific compatibility — schedule, format, pace, walking vs cart, budget, home course — is meant to make discovery more relevant than a generic dating app with “golf” as an interest. A mutual match should convert into a **specific, low-pressure outing** (nine holes, range, simulator, clubhouse drink), not an indefinite chat.

This build is a **stakeholder-facing prototype for one named viewer, Dustin**, not an MVP. Persistence is `localStorage`. All people, courses, messages, events, and offers are fictional. No network is required after static assets load.

**Golden path** (§10): enter prototype directly into Discover → swipe a deterministic deck (Jordan → Erin → Maya) → mutual match with Maya → seeded chat → “Suggest a round” prefilled to River Bend Golf Club, Saturday, September 12, 4:30 PM, nine holes, cart → simulated acceptance → confirmed outing with a labeled fictional course perk.

---

## 2. Repo state at analysis time

Greenfield: spec, two-line README, LICENSE, stock Node `.gitignore`. No `package.json`, source, lockfile, or tooling.

§17’s “use the following stack unless the existing repository already contains an equivalent choice” therefore means: **use the spec stack, use npm.**

---

## 3. Goals vs non-goals

### In scope (§3)

Clear dating-and-golf value prop; condensed onboarding; Date / Play / Both intent; golf-specific profile data; polished swipe discovery; deterministic mutual match; seeded conversation; outing proposal; confirmed outing; ~4 public outing cards; non-functional membership/paywall; trust-and-safety affordances; resettable presenter-controlled demo; static Vite build for Apache; optional PWA.

### Hard fence (§4)

No registration/login; no auth of any kind; no backend; no database; no realtime sync; no UGC; no photo uploads; no identity/face verification; no official handicap verification; no geolocation; no maps; no course-search APIs; no tee-time booking; no real discounts; no push or email; no real subscriptions, IAP, or payments; no admin moderation; no AI matching or generative chat; no social feed; no video/voice/photo messaging; no native apps or store submission; no multi-city marketplace; no production-grade security/privacy/legal.

These may appear as **UI or success messages**, never as live integrations.

Also:

- §1 rule 4: do not add common dating-app extras (super-likes, boosts, streaks, who-viewed-you, stories, GIF picker).
- §11.7: chat must not have read receipts, real typing presence, media, voice notes, link previews, or encryption claims.

### Later, not never (§33, §34)

Eleven deferred product questions (dating-first vs social-first, match limits, monetization, launch city, handicap matching, native apps, etc.) must stay **discussable**, not baked into architecture.

§34: after validation, a possible Stage A is Supabase + Postgres. **The static prototype is disposable.** Do not build a fake API/repository layer “for the migration.”

---

## 4. User journeys and screens

### 4.1 Golden path (must be bulletproof)

`/?reset=1&scenario=dustin-dating` → Landing → Discover (Pass Jordan, Like Erin, Like Maya) → Match celebration → Match chat → Suggest a round → proposal card → accepted → Confirmed outing. Onboarding remains an optional Profile entry point, not a required demo step.

§26.3: 14-step Playwright test at **390×844**, asserting River Bend, 4:30 PM, and the prototype perk. Target duration ≈ 2 minutes (§5). No typing required (§32).

### 4.2 Routes (§9)

`/`, `/onboarding`, `/discover`, `/matches`, `/matches/:matchId`, `/likes`, `/outings`, `/outings/:outingId`, `/confirmed/:outingId`, `/membership`, `/profile`, `/__demo`, `/not-found`, plus catch-all → not-found with `Return to demo`.

Bottom nav is exactly four tabs: **Discover, Matches, Outings, Profile**. Hidden on landing, onboarding, match celebration modal, and full-screen confirmation celebration. Membership is reached from Profile or a paywall sheet, never the tab bar.

### 4.3 Screen inventory

**Landing `/`** — Wordmark, tagline, one-sentence explainer, primary `Enter prototype`, and copy that onboarding is skipped, plus optional desktop phone-frame preview + QR **placeholder**. Handles `?scenario=` and `?reset=1`. Entry initializes **only if no active scenario exists**. `noindex, nofollow`. Unknown `?scenario=` → fall back to `dustin-dating`.

**Onboarding `/onboarding`** — Four prefilled steps with progress: A Intent, B About you, C Golf style, D Discovery preferences. Back/forward preserves edits; refresh preserves step and values. Photo tiles rotate among local assets or toast `Demo photos are preloaded`.

**Discover `/discover`** — Card: photo, first name + age, approximate distance, verification badge, intent badge, handicap/experience, one prompt, favorite course, 2–3 compatibility badges, photo position. Controls: Pass, View profile, Like, Rewind (treat as **required** despite “optional” wording), optional Filters sheet (display-only). Gestures: drag left pass, right like, snap back below threshold; page scroll disabled while dragging; buttons hit the same store actions; keyboard reachable. Overlays `PASS`/`LIKE`; render only current + 1–2 following cards. Exhausted deck: `Reset deck` and `Explore outings`.

**Full profile** — Route vs sheet unspecified; **use a sheet/modal** (no `/profile/:profileId` in §9). Gallery, bio, prompts, golf compatibility, Report/Block with confirmation. Block hides the profile from discovery for the session.

**Match celebration** — `It's a Fairway Match!`, both photos, `You both want to play and see where it goes.`, actions `Send a message` / `Suggest a round` / `Keep browsing`. Only for newly created mutual matches; never re-shows after dismissal unless reset. `prefers-reduced-motion` → simple fade. Announce via live region or dialog title.

**Matches `/matches`** — At least Maya (new/active), Sofia (seeded older), Taylor (seeded, no conversation). Avatar, first name only, intent, preview or `New match`, relative label (`Now`, `Yesterday`, `2d`), optional unread dot. **Timestamps are fixture strings, never from the live clock.**

**Chat `/matches/:matchId`** — Bubbles, text entry, reject whitespace-only, persist locally, keep latest visible. Compact header with profile link and safety menu. Persistent `Suggest a round`. Proposal cards as structured chat items. Maya seed: `I've been wanting to play River Bend. Are you usually free on weekends?` Optional scripted reply after first outgoing: `Saturday afternoons are usually perfect for me.` Menu: View profile / Unmatch / Block / Report, each with confirmation.

**Suggest a round** — Sheet/drawer. Required: venue, activity, date label, time. Prefilled: River Bend / fixed Saturday / 4:30 PM / nine holes / cart / `Want to grab a drink at the clubhouse afterward?` Optional note ≈240 chars. Submit → proposal in chat → scenario engine accepts. Transitional `Maya is checking the details...` capped at ~1s. Accepted: `Maya accepted your golf date.` + `View confirmed outing`.

**Confirmed `/confirmed/:outingId`** — Both photos, River Bend, fixed date + 4:30 PM, nine holes, cart, optional clubhouse note, `Prototype course perk: 10% off twilight rounds`. `Add to calendar` → `Added to demo calendar` + local flag. `Get directions` → placeholder, **no real address**. Public-place safety reminder. `Back to matches`, `Explore outings`. `Cancel`/`Modify` → `Not available in this prototype`. Missing outing → recoverable empty state. Must load from persisted state by route.

**Outings** — Four seeded public outings. `Request to join` → local state + `Request sent`; no organizer approval. Optional `Preview organizer view` only after the golden path is done.

**Membership** — Basic / Premium ($5.99/mo) / VIP ($9.99/mo) with spec copy plus `Prototype pricing and benefits are not final.` Purchase activates locally; **never request payment details**. Concept paywall triggers may include advanced filters, creating an additional outing, and a locked Premium badge. `See who likes you` remains fully enabled. **Membership must never block the golden path.**

**Incoming likes `/likes`** — A real fixture-backed screen that shows fictional profiles who already liked Alex. It is fully available at Basic, Premium, and VIP in this stakeholder prototype; membership copy can still describe it as a possible VIP benefit.

**Profile** — Alex’s card, Edit (onboarding or edit form), membership, verification explanation, safety center, demo reset, `About this prototype` (all content fictional).

**`/__demo`** — 14 presenter controls (select scenario, reset, jump stages, set membership, restore deck, clear blocked, clear PWA caches, event log, copy route). Not in nav. Optional `Ctrl+Shift+D` (ignore when focus is in a text input). All controls reuse product store actions. Jumps must not create duplicate matches or duplicate canonical outings.

**Not found + error boundary** — Friendly not-found; error boundary offers `Reset demo` and `Return home`.

### 4.4 Cross-cutting states

Every route needs a designed empty state with a useful action (§19.8). No loading spinners for network — there is none. Simulated acceptance ≤1s. Corrupt/failed migration → discard and reinitialize default scenario. Missing fixture → dev warning + safe placeholder. Image failure → local fallback.

---

## 5. Information architecture

### Defined in §15

- `DemoProfile` — identity, intent, golf block, photos, badges, `fictional: true`
- `DemoCourse` — type, area, image, amenities, optional `prototypePerk`
- `Match` — `profileId`, `createdAtLabel`, `status` (active | unmatched | blocked), `celebrationPending`
- `Message` — `sender` (current-user | matched-user | system), `kind` (text | outing-proposal | system)
- `ProposedOuting` — course, activity, fixture date/time labels, `status` (draft | proposed | accepted | declined)
- `PublicOuting` — organizer, `intentContext` (`UserIntent | "event"`), spots, fixture date/time
- Enums: `UserIntent`, `GolfActivityType`, `MembershipLevel`, `SwipeDirection`, `ProposalStatus`, `DemoScenarioId`, `DemoEventName` (18 values), `DemoEvent`

### Referenced in §14, never defined — author these

| Type | Suggested shape |
| --- | --- |
| `DemoUser` | `DemoProfile & { discoveryPreferences: { intentCompatibility, ageRange, distance, experiencePreference } }` |
| `Conversation` | `{ matchId, messages: Message[], unread?: boolean }` |
| `OutingRequestStatus` | `"none" \| "requested"` |
| `DemoStage` | Union matching `/__demo` jump targets |
| `ProposeOutingInput` | Fields from the Suggest a round sheet |

### Relationships

`DemoScenario` is the composition root: `currentUserId`, `initialRoute`, `onboardingComplete`, `membershipLevel`, `profileDeckIds[]`, `mutualMatchProfileIds[]`, `seededMatchIds[]`, `featuredCourseId`, `featuredOutingId`, `scriptedReplyDelayMs`, `autoAcceptProposalDelayMs`.

Keep outing ID namespaces distinct: `/outings/:outingId` → `PublicOuting` (`outing-*`); `/confirmed/:outingId` → `ProposedOuting` (e.g. `proposal-*`).

### Required fixtures (§16)

Minimum **10 discovery profiles**, 25+, varied, non-stereotyped. Canonical:

- `jordan-demo` — Jordan Lee, 31, Both, Beginner, Meadowview Range; expected Pass
- `erin-demo` — Erin Brooks, 35, Date, Intermediate, 18.6, Oak Hollow; Like → **no** match
- `maya-demo` — Maya Chen, 32, Both, Intermediate, 11.8, River Bend; mutual match; seeded message

Also named: Sofia Ramirez and Taylor Kim as seeded-match-only profiles; Morgan Patel, Casey Thompson, Riley Johnson, Cameron Davis, Avery Wilson, Jamie Foster, and Drew Sullivan in discovery.

Six courses: `pine-ridge`, `river-bend` (holds the perk), `oak-hollow`, `lakeside-links`, `the-turn-simulator`, `meadowview-range`.

Four public outings: `outing-saturday-fourth`, `outing-singles-nine`, `outing-beginner-simulator`, `outing-sunday-casual`.

Demo user: Alex Morgan, 34, Date, Intermediate, handicap 14.2 self-reported, nine or casual 18, Sat/Sun, late morning or twilight, casual/rides, home course Pine Ridge Municipal, Basic membership. The app must not assume Alex’s gender; scenario config owns discovery preferences.

**All data is mock.** The only live-clock value permitted is `DemoEvent.occurredAtIso` in the hidden log (§24). User-facing dates/times are fixture strings.

### Persistence

Zustand `persist`, key `fairway-mingle-demo-state`, `DEMO_SCHEMA_VERSION = 1`, explicit `partialize` (no transient modals/timers), migration function, safe reset on failure, event log capped at 100.

---

## 6. Tech and architecture

### Stack (§17) — follow it

Vite + React + strict TypeScript (no `any`; discriminated unions), React Router **declarative browser routing** (`BrowserRouter`, not framework/data-router mode), Tailwind CSS via `@tailwindcss/vite`, shadcn/ui (only the listed components), Motion (`motion/react`), Zustand + persist, Lucide. PWA via `vite-plugin-pwa`. ESLint, Prettier, Vitest + jsdom + RTL, Playwright. npm, committed lockfile, Node in `.nvmrc` and `engines`.

§37: if install syntax conflicts with current official docs, follow the docs; keep architecture and acceptance criteria.

Notes:

- Tailwind v4 is CSS-first (`@import "tailwindcss"` + `@theme`). Use the v4-aware shadcn CLI.
- `npm create vite@latest .` in a non-empty directory can clobber `README.md`. Scaffold carefully.
- Path alias `@/*` → `src/*`.
- Follow the spec §18 folder tree. Renames are allowed if fixtures, types, store actions, pages, and demo controls stay separated.

### State

One Zustand store with the ~25 listed actions. Product UI and `/__demo` **must share those actions**.

Two traps:

1. `resetDemo` is typed `Promise<void>` and must navigate. **The store should not own the router.** Clear/reinitialize in the store; return the target route; a `useDemoReset()` hook calls `navigate()`. Document in `DECISIONS.md`.
2. Deck position vs `likedProfileIds` / `passedProfileIds` / `blockedProfileIds` can drift. Prefer index as source of truth for position; cover with the §26.1 rewind test.

### No fake API

Import typed fixture modules directly. The scenario engine is the only indirection (§7, §13).

### Determinism

- Commit scripted reply and auto-accept **synchronously**; use delay only for visual reveal; make pending UI skippable. Golden path must not depend on a timer callback (§5, §25). Consider `scriptedReplyDelayMs: 0` in tests.
- Never use `Date.now()` for anything the user sees.
- Liking `maya-demo` creates `match-maya-demo` **exactly once**, idempotent across reload and repeated action.

---

## 7. Build order

Spec phases 0–6 are sound. Two changes: assets earlier, `/__demo` earlier.

| Phase | Work | Exit |
| --- | --- | --- |
| **0** | Scaffold Vite/React/TS, strict TS, alias, Tailwind v4, shadcn, Motion/Zustand/Lucide, ESLint/Prettier, Vitest, Playwright, `.nvmrc` + engines, `verify` script, README + `docs/` | Styled landing route; `npm run verify` passes |
| **0.5** | Local assets with final paths: ~10 profiles × ~3 photos, 6 courses, brand, PWA icons (192, 512, maskable, apple-touch, favicon) | Code can reference `public/demo/**` without missing files |
| **1** | Product types (including the five undefined ones), fixtures, persisted store, `initializeScenario`, `resetDemo`, §26.1 unit tests | `dustin-dating` initializes; state survives refresh |
| **2** | Tokens (§19.2), Inter/system fonts, mobile shell `100dvh` + safe-area, desktop 390–430px frame, 4-tab nav + hide rules, all routes as stubs, error boundary, not-found | Shell navigates |
| **2.5** | `/__demo` (even crude) using store actions | Jump-to-stage for later screens |
| **3** | Thin golden path: landing query params, 4-step onboarding, card stack **buttons first**, Maya match, celebration, list, chat, proposal, accept, confirmed | §10 completes with clicks |
| **4** | Drag/overlays/peek, rewind, motion + reduced-motion, keyboard, full profile, image preload, `tests/golden-path.spec.ts` | Playwright golden path passes at 390×844 |
| **5** | Outings, membership + paywall, Profile/safety, report/block/unmatch. Organizer preview last | Concept screens have no dead ends |
| **6** | Event log (18 names, cap 100), PWA, `noindex` + `robots.txt`. PWA must not delay the golden path | Install/reset/cache-clear work |
| **7** | Fallbacks, a11y/overflow QA, Apache example, deploy script, `docs/DEMO_SCRIPT.md`, second-deploy cache invalidation | Stakeholder URL is demo-ready |

Do not start UI beyond the shell before the store is stable. The store API is the contract every page consumes.

---

## 8. Historical ambiguities and remaining implementation choices

### Resolved by the product owner

- **A1** Use local stylized fictional portraits and course artwork.
- **A3** River Bend uses `Saturday, September 12`.
- **A4** Deploy from the root of a dedicated subdomain.
- **A5** Skip onboarding in the canonical demo; do not add a misleading Premium landing action.
- **A6** Match rows use first names only.
- **A7** Sofia/Taylor are seeded matches only; Jamie/Drew fill the discovery deck.
- **A9** Filters are display-only.
- **A10** Implement a fixture-backed `/likes` screen and enable it at every tier.
- **A12** Unmatch preserves conversations and confirmed outings.

### Required implementation interpretations

- **A2** Five store types undefined (see §5); author the suggested contracts.
- **A8** Rewind labeled optional but required by recovery path and §26.1. **Treat as required.**

### Medium

- **A11** Celebration modeled twice: `Match.celebrationPending` and `dismissedMatchCelebrationIds`. Pick one.
- **A13** Acceptance as system message vs mutated proposal card vs both. E2e depends on visible copy.
- **A14** Full profile: sheet vs route. Prefer sheet.
- **A15** Basic tier copy “up to three visible matches” vs demo’s four rows. Do not enforce; copy-only.
- **A16** Timestamp label for a freshly sent message. Use `Now`.
- **A17** `/not-found` as explicit route and catch-all. Either is fine; be consistent.
- **A18** Unknown `?scenario=` → `dustin-dating`.

### Low

Node version (pin current LTS). Alex `photoPaths` and prompt answers. Desktop QR decorative vs interactive. `demoCalendarOutingIds` has no UI beyond toast. Prettier config unspecified.

---

## 9. Risks

**Demo-day reliability is the product.** Threats: stale service worker; timer-dependent scripted events on a backgrounded tab; corrupt persisted state on the presenter’s phone. Mitigations are already in the spec (no-cache headers, skippable delays, migration + safe reset) — they must actually be tested.

**iOS Safari** edge-swipe vs drag-left-to-pass. Like/Pass buttons are the reliability net. Playwright should drive **buttons**, not gestures.

**`localStorage`** can throw (private browsing, some standalone PWAs). Persist must not crash; fall back in-memory.

**CSP** `script-src 'self'` with no `'unsafe-inline'` can block inline SW registration. Use a separate `registerSW.js`. Verify in the **built** artifact.

**Optional Apache access control:** if enabled later, a 401 can block `manifest.webmanifest` unless credentials behavior is configured. This is not an application requirement.

**Trust copy:** cards have a verification badge, but copy must not claim real identity, criminal history, age, handicap, or course membership verification. Handicap always labeled self-reported. Perk labeled `Prototype course perk`.

**Performance:** do not precache every full-resolution photo. Preload current + next two (§27).

**Over-engineering:** fake API, auth shim, generic repository “for Stage A.” Under-engineering the exactly-once Maya match and reset fidelity fails the demo.

**Test flake:** Motion + ~1s delay + drawers. Set scenario delays to 0 in e2e; assert River Bend / 4:30 PM / perk text.

**A11y:** 44px targets, focus traps in sheets, live-region for celebration, contrast over photo gradients. Cheaper to build in during Phase 4 than retrofit.

---

## 10. Acceptance checklist (condensed)

### Golden path

- [ ] `/?reset=1&scenario=dustin-dating` clears and initializes
- [ ] Landing: wordmark, `Meet your match. Play a round.`, `Enter prototype`
- [ ] Entry skips onboarding and lands on Discover; optional onboarding remains reachable from Profile
- [ ] Deck order Jordan → Erin → Maya
- [ ] Erin like creates **no** match
- [ ] Maya like creates `match-maya-demo` exactly once
- [ ] Celebration copy and three actions; no re-show after dismiss unless reset
- [ ] Seeded Maya message; send appends once; whitespace ignored
- [ ] Suggest a round visible even if scripted reply never appeared
- [ ] Proposal prefilled; accept without network or timer dependency
- [ ] Confirmed screen: both photos, River Bend, date, 4:30 PM, nine holes, cart, prototype perk
- [ ] Calendar toast + flag; directions placeholder only
- [ ] Playwright golden path at 390×844

### State and recovery

- [ ] `Enter prototype` does not clobber an active scenario
- [ ] Reset clears persisted key, related storage, prototype caches; lands on scenario initial route
- [ ] Rewind restores deck; passing Maya is recoverable
- [ ] Join requests idempotent
- [ ] Corrupt state → `dustin-dating`
- [ ] Event log records §24 events, cap 100
- [ ] `/__demo` 14 controls; no duplicate matches or canonical outings
- [ ] Direct reload of chat, confirmed, and outing detail behind Apache rewrites

### Supporting + craft + delivery

- [ ] Four public outings; Request to join → Request sent
- [ ] Membership never requests payment; never blocks golden path
- [ ] Profile About disclosure; 18+ on landing or onboarding
- [ ] No copy claims real verification
- [ ] Empty states everywhere; nav hide rules; desktop phone frame; `100dvh` + safe-area
- [ ] Keyboard, focus management, reduced motion, ≥44px targets, fictional alt text
- [ ] No remote font/image/API after load; no console errors in production
- [ ] `npm run verify` passes; Apache example + deploy example; `DEMO_SCRIPT.md`; `DECISIONS.md`

---

## 11. Kickoff prompt for the implementation agent

```text
Read FAIRWAY_MINGLE_PROTOTYPE_SPEC.md completely. Treat it as the source of truth.

Then read docs/SPEC_ANALYSIS.md. Use it as the implementation brief: build order, undefined types, determinism rules, and recommended defaults for unanswered questions. Record material choices in docs/DECISIONS.md.

Inspect the repository before changing anything. Implement Phase 0, then 0.5 assets (placeholders OK), then Phase 1 (types, fixtures, store). No backend, no external APIs, fictional local data only.

Do not skip the store tests in spec §26.1. After Phase 1, run lint, typecheck, unit tests, and production build. Fix failures. Report files changed, test results, limitations, deviations, and the next phase.
```
