import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronRight,
  CircleUserRound,
  Compass,
  Flag,
  Heart,
  MapPin,
  MessageCircle,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";

import {
  coursesById,
  DEMO_DATE_LABEL,
  publicOutings,
  scenarios,
} from "@/data/fixtures";
import { profilesById } from "@/data/profiles";
import { useDemoStore } from "@/stores/demo-store";
import type { DemoProfile, DemoScenarioId, MembershipLevel } from "@/types/demo";

const intentLabels = {
  date: "Golf date",
  play: "Playing partners",
  both: "Dates & playing",
} as const;

function BrandMark() {
  return (
    <span className="brand-mark" aria-label="Fairway Mingle">
      <span className="brand-icon" aria-hidden="true">
        <Flag size={16} fill="currentColor" />
      </span>
      Fairway Mingle
    </span>
  );
}

function LandingPage() {
  const navigate = useNavigate();
  const initialized = useDemoStore((state) => state.initialized);
  const initializeScenario = useDemoStore((state) => state.initializeScenario);
  const resetDemo = useDemoStore((state) => state.resetDemo);
  const handledQuery = useRef(false);

  const selectedScenario = useMemo<DemoScenarioId>(() => {
    const requested = new URLSearchParams(window.location.search).get("scenario");
    return requested && requested in scenarios ? (requested as DemoScenarioId) : "dustin-dating";
  }, []);

  useEffect(() => {
    if (handledQuery.current) return;
    handledQuery.current = true;
    const shouldReset = new URLSearchParams(window.location.search).get("reset") === "1";
    if (shouldReset) void resetDemo(selectedScenario);
  }, [resetDemo, selectedScenario]);

  const enterPrototype = () => {
    if (!initialized) initializeScenario(selectedScenario);
    navigate(scenarios[selectedScenario].initialRoute);
  };

  return (
    <main className="landing">
      <div className="landing-glow landing-glow-one" />
      <div className="landing-glow landing-glow-two" />
      <div className="landing-content">
        <BrandMark />
        <div className="hero-kicker">
          <Sparkles size={15} /> A fictional product prototype
        </div>
        <h1>
          Meet your match.
          <br />
          <span>Play a round.</span>
        </h1>
        <p className="hero-copy">
          Dating feels easier when you already know where the first conversation can lead.
          Discover golfers who match your pace, schedule, and idea of a great day out.
        </p>
        <button className="button button-primary button-large" onClick={enterPrototype}>
          Enter prototype <ChevronRight size={19} />
        </button>
        <p className="landing-note">Onboarding is skipped so every concept is ready to explore.</p>
        <div className="landing-proof">
          <div className="proof-avatars" aria-hidden="true">
            {["maya-demo", "erin-demo", "jordan-demo"].map((id) => (
              <img key={id} src={profilesById[id]?.photoPaths[0]} alt="" />
            ))}
          </div>
          <p>
            <strong>Fictional people. Real product questions.</strong>
            <br />
            Built for a two-minute stakeholder walkthrough.
          </p>
        </div>
      </div>
      <div className="landing-preview" aria-hidden="true">
        <div className="preview-card">
          <img src="/demo/profiles/maya-demo-1.svg" alt="" />
          <div className="preview-overlay">
            <span className="pill pill-light">94% golf fit</span>
            <h2>Maya, 32</h2>
            <p>Saturday afternoons · Nine holes</p>
          </div>
        </div>
      </div>
    </main>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  const initialized = useDemoStore((state) => state.initialized);
  const initializeScenario = useDemoStore((state) => state.initializeScenario);

  useEffect(() => {
    if (!initialized) initializeScenario("dustin-dating");
  }, [initializeScenario, initialized]);

  const tabs = [
    { to: "/discover", label: "Discover", icon: Compass },
    { to: "/matches", label: "Matches", icon: MessageCircle },
    { to: "/outings", label: "Outings", icon: Users },
    { to: "/profile", label: "Profile", icon: CircleUserRound },
  ];

  return (
    <div className="app-stage">
      <div className="desktop-context">
        <BrandMark />
        <h2>Golf gives the match somewhere to go.</h2>
        <p>
          A mobile-first concept for meeting compatible golfers and turning a match into a
          low-pressure plan.
        </p>
        <span>Prototype · All content is fictional</span>
      </div>
      <div className="phone-frame">
        <div className="app-content">{children}</div>
        <nav className="bottom-nav" aria-label="Primary navigation">
          {tabs.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <Icon size={21} strokeWidth={2.1} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

function PageHeader({
  title,
  eyebrow,
  action,
}: {
  title: string;
  eyebrow?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
      </div>
      {action}
    </header>
  );
}

function ProfileCard({ profile }: { profile: DemoProfile }) {
  const course = coursesById[profile.golf.favoriteCourseIds[0] ?? ""];
  const handicap =
    profile.golf.handicap === undefined
      ? profile.golf.experienceLevel
      : `${profile.golf.handicap} handicap`;

  return (
    <article className="profile-card">
      <img
        className="profile-photo"
        src={profile.photoPaths[0]}
        alt={`${profile.firstName}, fictional demo profile`}
      />
      <div className="profile-gradient" />
      <div className="profile-topline">
        <span className="pill pill-light">
          <Check size={13} /> Demo verified
        </span>
        <span className="pill pill-light">{intentLabels[profile.intent]}</span>
      </div>
      <div className="profile-copy">
        <div className="profile-name-row">
          <h2>
            {profile.firstName}, {profile.age}
          </h2>
          <span>
            <MapPin size={14} /> {profile.approximateDistanceMiles} mi
          </span>
        </div>
        <p className="prompt-answer">{profile.prompts[0]?.answer}</p>
        <div className="golf-summary">
          <div>
            <span>Golf style</span>
            <strong>{handicap}</strong>
          </div>
          <div>
            <span>Favorite</span>
            <strong>{course?.name ?? "Local courses"}</strong>
          </div>
        </div>
        <div className="badge-row">
          {profile.compatibilityBadges.slice(0, 3).map((badge) => (
            <span className="compatibility-badge" key={badge}>
              {badge}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function MatchCelebration({ matchId }: { matchId: string }) {
  const navigate = useNavigate();
  const dismiss = useDemoStore((state) => state.dismissMatchCelebration);

  const continueTo = (route: string) => {
    dismiss(matchId);
    navigate(route);
  };

  return (
    <div className="celebration-backdrop" role="dialog" aria-modal="true" aria-labelledby="match-title">
      <div className="celebration">
        <div className="celebration-motif" aria-hidden="true">
          <Heart fill="currentColor" />
        </div>
        <div className="match-portraits">
          <img src="/demo/profiles/alex-demo-1.svg" alt="Alex, fictional demo profile" />
          <img src="/demo/profiles/maya-demo-1.svg" alt="Maya, fictional demo profile" />
        </div>
        <p className="eyebrow">A mutual like</p>
        <h2 id="match-title">It&apos;s a Fairway Match!</h2>
        <p>You both want to play and see where it goes.</p>
        <button
          className="button button-primary button-block"
          onClick={() => continueTo(`/matches/${matchId}`)}
        >
          <MessageCircle size={18} /> Send a message
        </button>
        <button
          className="button button-secondary button-block"
          onClick={() => continueTo(`/matches/${matchId}?suggest=1`)}
        >
          <Flag size={18} /> Suggest a round
        </button>
        <button className="text-button" onClick={() => dismiss(matchId)}>
          Keep browsing
        </button>
      </div>
    </div>
  );
}

function DiscoverPage() {
  const deck = useDemoStore((state) => state.profileDeckIds);
  const currentIndex = useDemoStore((state) => state.currentProfileIndex);
  const blocked = useDemoStore((state) => state.blockedProfileIds);
  const lastSwipe = useDemoStore((state) => state.lastSwipe);
  const matches = useDemoStore((state) => state.matches);
  const swipe = useDemoStore((state) => state.swipeProfile);
  const rewind = useDemoStore((state) => state.rewindLastSwipe);
  const restoreDeck = useDemoStore((state) => state.restoreDeck);
  const visibleIds = deck.filter((id) => !blocked.includes(id));
  const profileId = visibleIds[currentIndex];
  const profile = profileId ? profilesById[profileId] : undefined;
  const pendingMatch = matches.find((match) => match.celebrationPending);
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="page discover-page">
      <PageHeader
        title="Discover"
        eyebrow="Demo City"
        action={
          <button
            className="icon-button"
            aria-label="Open display-only filters"
            onClick={() => setFiltersOpen((open) => !open)}
          >
            <SlidersHorizontal size={20} />
          </button>
        }
      />

      {filtersOpen ? (
        <div className="concept-banner">
          <div>
            <strong>Discovery filters</strong>
            <p>Age 28–42 · Within 30 miles · All golf levels</p>
          </div>
          <span className="pill">Concept only</span>
        </div>
      ) : null}

      {profile ? (
        <>
          <motion.div
            className="swipe-card-shell"
            key={profile.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.68}
            dragMomentum={false}
            initial={{ opacity: 0.7, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.18 }}
            whileDrag={{ cursor: "grabbing", rotate: 1.5 }}
            onDragEnd={(_, info) => {
              const committed =
                Math.abs(info.offset.x) >= 90 || Math.abs(info.velocity.x) >= 550;
              if (!committed) return;
              swipe(profile.id, info.offset.x < 0 ? "left" : "right");
            }}
          >
            <ProfileCard profile={profile} />
          </motion.div>
          <div className="discovery-actions" aria-label="Profile actions">
            <button
              className="round-action rewind"
              onClick={rewind}
              disabled={!lastSwipe}
              aria-label="Rewind last choice"
            >
              <RotateCcw size={21} />
            </button>
            <button
              className="round-action pass"
              onClick={() => swipe(profile.id, "left")}
              aria-label={`Pass on ${profile.firstName}`}
            >
              <X size={30} />
            </button>
            <button
              className="round-action view"
              aria-label={`View ${profile.firstName}'s full profile`}
            >
              <CircleUserRound size={23} />
            </button>
            <button
              className="round-action like"
              onClick={() => swipe(profile.id, "right")}
              aria-label={`Like ${profile.firstName}`}
            >
              <Heart size={29} fill="currentColor" />
            </button>
          </div>
          <p className="guided-hint">
            Demo cue: {profile.id === "jordan-demo" ? "Pass" : "Like"} {profile.firstName}
          </p>
        </>
      ) : (
        <div className="empty-state">
          <span className="empty-icon">
            <Flag />
          </span>
          <h2>You&apos;ve played through the deck</h2>
          <p>Reset the fictional profiles or explore a public outing.</p>
          <button className="button button-primary" onClick={restoreDeck}>
            Reset deck
          </button>
          <Link className="button button-secondary" to="/outings">
            Explore outings
          </Link>
        </div>
      )}
      {pendingMatch ? <MatchCelebration matchId={pendingMatch.id} /> : null}
    </div>
  );
}

function MatchesPage() {
  const matches = useDemoStore((state) => state.matches);
  const conversations = useDemoStore((state) => state.conversations);
  const activeMatches = matches.filter((match) => match.status === "active");

  return (
    <div className="page">
      <PageHeader
        title="Matches"
        eyebrow="Make a plan"
        action={
          <Link className="likes-link" to="/likes">
            <Heart size={16} fill="currentColor" /> See who likes you
          </Link>
        }
      />
      <div className="match-list">
        {activeMatches.map((match) => {
          const profile = profilesById[match.profileId];
          if (!profile) return null;
          const messages = conversations[match.id]?.messages ?? [];
          const latest = messages.at(-1);
          return (
            <Link className="match-row" to={`/matches/${match.id}`} key={match.id}>
              <img
                src={profile.photoPaths[0]}
                alt={`${profile.firstName}, fictional demo profile`}
              />
              <div className="match-main">
                <div>
                  <strong>{profile.firstName}</strong>
                  <span>{match.createdAtLabel}</span>
                </div>
                <p>{latest?.body ?? (latest?.kind === "outing-proposal" ? "Outing proposal" : "New match")}</p>
                <small>{intentLabels[profile.intent]}</small>
              </div>
              <ChevronRight size={18} />
            </Link>
          );
        })}
      </div>
      <p className="fixture-note">Names use first names only in this prototype.</p>
    </div>
  );
}

function LikesPage() {
  const incomingLikeIds = useDemoStore((state) => state.incomingLikeProfileIds);
  return (
    <div className="page">
      <div className="back-header">
        <Link className="icon-button" to="/matches" aria-label="Back to matches">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <p className="eyebrow">Fully enabled for demo</p>
          <h1>They like your vibe</h1>
        </div>
      </div>
      <p className="page-intro">
        These fictional golfers already liked Alex. Choose any profile to preview the concept.
      </p>
      <div className="likes-grid">
        {incomingLikeIds.map((id) => {
          const profile = profilesById[id];
          if (!profile) return null;
          return (
            <article className="like-card" key={id}>
              <img src={profile.photoPaths[0]} alt={`${profile.firstName}, fictional demo profile`} />
              <div>
                <strong>
                  {profile.firstName}, {profile.age}
                </strong>
                <span>{profile.compatibilityBadges[0]}</span>
              </div>
            </article>
          );
        })}
      </div>
      <div className="concept-banner">
        <div>
          <strong>Prototype behavior</strong>
          <p>Incoming likes are visible at every tier so the full concept can be demonstrated.</p>
        </div>
      </div>
    </div>
  );
}

function MatchChatPage() {
  const { matchId = "" } = useParams();
  const navigate = useNavigate();
  const conversation = useDemoStore((state) => state.conversations[matchId]);
  const match = useDemoStore((state) => state.matches.find((item) => item.id === matchId));
  const sendMessage = useDemoStore((state) => state.sendMessage);
  const addScriptedReply = useDemoStore((state) => state.addScriptedReply);
  const proposeOuting = useDemoStore((state) => state.proposeOuting);
  const acceptOuting = useDemoStore((state) => state.acceptProposedOuting);
  const [message, setMessage] = useState("");
  const profile = match ? profilesById[match.profileId] : undefined;

  if (!match || !profile) {
    return <NotFoundContent title="This match is not available" />;
  }

  const submitMessage = (event: FormEvent) => {
    event.preventDefault();
    if (!message.trim()) return;
    sendMessage(matchId, message);
    setMessage("");
    addScriptedReply(matchId);
  };

  const suggestRound = () => {
    const outing = proposeOuting({
      matchId,
      courseId: "river-bend",
      activityType: "nine-holes",
      dateLabel: DEMO_DATE_LABEL,
      timeLabel: "4:30 PM",
      holeCount: 9,
      transportation: "cart",
      note: "Want to grab a drink at the clubhouse afterward?",
    });
    acceptOuting(outing.id);
    navigate(`/confirmed/${outing.id}`);
  };

  return (
    <div className="page chat-page">
      <div className="chat-header">
        <Link className="icon-button" to="/matches" aria-label="Back to matches">
          <ArrowLeft size={20} />
        </Link>
        <img src={profile.photoPaths[0]} alt="" />
        <div>
          <strong>{profile.firstName}</strong>
          <span>{intentLabels[profile.intent]}</span>
        </div>
      </div>
      <div className="message-list">
        {(conversation?.messages ?? []).map((item) =>
          item.kind === "outing-proposal" ? (
            <div className="proposal-message" key={item.id}>
              <Flag size={18} />
              <strong>River Bend · {DEMO_DATE_LABEL}</strong>
              <span>4:30 PM · Nine holes · Cart</span>
            </div>
          ) : (
            <div
              className={`message ${item.sender === "current-user" ? "sent" : "received"}`}
              key={item.id}
            >
              {item.body}
            </div>
          ),
        )}
      </div>
      <button className="button button-secondary button-block" onClick={suggestRound}>
        <Flag size={18} /> Suggest a round
      </button>
      <form className="message-form" onSubmit={submitMessage}>
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Write a message"
          aria-label="Message"
        />
        <button className="button button-primary" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}

function OutingsPage() {
  const requests = useDemoStore((state) => state.publicOutingRequests);
  const requestToJoin = useDemoStore((state) => state.requestToJoinOuting);

  return (
    <div className="page">
      <PageHeader title="Outings" eyebrow="Meet on the fairway" />
      <p className="page-intro">Public, low-pressure ways to meet golfers around Demo City.</p>
      <div className="outing-list">
        {publicOutings.map((outing) => {
          const course = coursesById[outing.courseId];
          const organizer = profilesById[outing.organizerProfileId];
          const requested = requests[outing.id] === "requested";
          return (
            <article className="outing-card" key={outing.id}>
              <img src={course?.imagePath} alt={`${course?.name}, fictional golf venue`} />
              <div className="outing-body">
                <span className="pill">{outing.intentContext === "event" ? "Event" : intentLabels[outing.intentContext]}</span>
                <h2>{outing.title}</h2>
                <p>
                  <MapPin size={14} /> {course?.name}
                </p>
                <p>
                  <CalendarDays size={14} /> {outing.dateLabel} · {outing.timeLabel}
                </p>
                <div className="organizer-line">
                  <img src={organizer?.photoPaths[0]} alt="" />
                  <span>Hosted by {organizer?.firstName}</span>
                  <strong>{outing.openSpots} spots</strong>
                </div>
                <button
                  className={`button button-block ${requested ? "button-success" : "button-primary"}`}
                  disabled={requested}
                  onClick={() => requestToJoin(outing.id)}
                >
                  {requested ? <Check size={18} /> : null}
                  {requested ? "Request sent" : "Request to join"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function MembershipPage() {
  const membership = useDemoStore((state) => state.membershipLevel);
  const setMembership = useDemoStore((state) => state.setMembershipLevel);
  const plans: Array<{ id: MembershipLevel; name: string; price: string; features: string[] }> = [
    {
      id: "basic",
      name: "Basic",
      price: "Free",
      features: ["Browse local profiles", "Chat with visible matches", "Explore outings"],
    },
    {
      id: "premium",
      name: "Premium",
      price: "$5.99/mo",
      features: ["Expanded discovery filters", "Five new matches weekly", "One outing post"],
    },
    {
      id: "vip",
      name: "VIP",
      price: "$9.99/mo",
      features: ["Unlimited likes and matches", "See who liked you", "Early event access"],
    },
  ];
  return (
    <div className="page">
      <div className="back-header">
        <Link className="icon-button" to="/profile" aria-label="Back to profile">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <p className="eyebrow">Membership concept</p>
          <h1>Choose your pace</h1>
        </div>
      </div>
      <div className="plan-list">
        {plans.map((plan) => (
          <article className={`plan-card ${membership === plan.id ? "selected" : ""}`} key={plan.id}>
            <div>
              <h2>{plan.name}</h2>
              <strong>{plan.price}</strong>
            </div>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>
                  <Check size={15} /> {feature}
                </li>
              ))}
            </ul>
            <button
              className={membership === plan.id ? "button button-success" : "button button-secondary"}
              onClick={() => setMembership(plan.id)}
            >
              {membership === plan.id ? "Active in prototype" : `Preview ${plan.name}`}
            </button>
          </article>
        ))}
      </div>
      <p className="fixture-note">Prototype pricing and benefits are not final. No payment is collected.</p>
    </div>
  );
}

function ProfilePage() {
  const navigate = useNavigate();
  const user = useDemoStore((state) => state.currentUser);
  const membership = useDemoStore((state) => state.membershipLevel);
  const resetDemo = useDemoStore((state) => state.resetDemo);

  const reset = async () => {
    await resetDemo("dustin-dating");
    navigate("/");
  };

  return (
    <div className="page">
      <PageHeader title="Profile" eyebrow="Your demo identity" />
      <div className="profile-summary">
        <img src={user.photoPaths[0]} alt="Alex, fictional demo profile" />
        <div>
          <h2>{user.firstName}, {user.age}</h2>
          <p>{intentLabels[user.intent]} · {user.golf.handicap} self-reported</p>
          <span className="pill"><Check size={13} /> Demo verified</span>
        </div>
      </div>
      <div className="settings-list">
        <Link to="/onboarding">
          <span>Edit profile and preferences</span><ChevronRight />
        </Link>
        <Link to="/membership">
          <span>Membership <small>{membership}</small></span><ChevronRight />
        </Link>
        <Link to="/likes">
          <span>See who likes you</span><ChevronRight />
        </Link>
        <button onClick={reset}>
          <span>Reset prototype</span><RotateCcw />
        </button>
      </div>
      <div className="about-card">
        <strong>About this prototype</strong>
        <p>All people, messages, courses, events, and offers shown here are fictional.</p>
      </div>
    </div>
  );
}

function OnboardingPage() {
  const navigate = useNavigate();
  const user = useDemoStore((state) => state.currentUser);
  const step = useDemoStore((state) => state.onboardingStep);
  const setStep = useDemoStore((state) => state.setOnboardingStep);
  const updateUser = useDemoStore((state) => state.updateCurrentUser);
  const completeOnboarding = useDemoStore((state) => state.completeOnboarding);
  const stepTitles = ["What brings you here?", "About you", "Your golf style", "Who you want to meet"];

  const updateGolf = (patch: Partial<typeof user.golf>) => {
    updateUser({ golf: { ...user.golf, ...patch } });
  };

  const updatePreferences = (patch: Partial<typeof user.discoveryPreferences>) => {
    updateUser({
      discoveryPreferences: { ...user.discoveryPreferences, ...patch },
    });
  };

  const toggleDay = (day: string) => {
    const days = user.golf.preferredDays.includes(day)
      ? user.golf.preferredDays.filter((item) => item !== day)
      : [...user.golf.preferredDays, day];
    updateGolf({ preferredDays: days });
  };

  const saveProfile = () => {
    completeOnboarding();
    setStep(0);
    navigate("/profile");
  };

  return (
    <div className="page profile-editor-page">
      <div className="back-header">
        <button className="icon-button" onClick={() => navigate("/profile")} aria-label="Back to profile">
          <ArrowLeft size={20} />
        </button>
        <div>
          <p className="eyebrow">Edit profile · {step + 1} of 4</p>
          <h1>Edit your profile</h1>
        </div>
      </div>

      <div className="editor-progress" aria-label={`Step ${step + 1} of 4`}>
        {[0, 1, 2, 3].map((index) => (
          <span className={index <= step ? "complete" : ""} key={index} />
        ))}
      </div>

      <section className="editor-card">
        <div className="editor-heading">
          <span className="editor-step-icon">
            {step === 0 ? <Heart size={21} /> : null}
            {step === 1 ? <CircleUserRound size={21} /> : null}
            {step === 2 ? <Flag size={21} /> : null}
            {step === 3 ? <SlidersHorizontal size={21} /> : null}
          </span>
          <div>
            <p className="eyebrow">Prefilled for this prototype</p>
            <h2>{stepTitles[step]}</h2>
          </div>
        </div>

        {step === 0 ? (
          <div className="choice-grid">
            {([
              ["date", "Golf dates", "Meet someone through a shared love of the game."],
              ["play", "People to play with", "Find friendly partners and local groups."],
              ["both", "Open to both", "Let the connection decide where it goes."],
            ] as const).map(([value, title, description]) => (
              <button
                className={`choice-card ${user.intent === value ? "selected" : ""}`}
                key={value}
                onClick={() => updateUser({ intent: value })}
              >
                <span>{title}</span>
                <small>{description}</small>
                {user.intent === value ? <Check size={18} /> : null}
              </button>
            ))}
          </div>
        ) : null}

        {step === 1 ? (
          <div className="editor-fields">
            <div className="profile-photo-strip">
              {user.photoPaths.map((path, index) => (
                <img
                  src={path}
                  alt={`Alex, fictional demo profile photo ${index + 1}`}
                  key={path}
                />
              ))}
            </div>
            <p className="field-help">Three local demo photos are preloaded.</p>
            <label className="field">
              <span>First name</span>
              <input
                value={user.firstName}
                onChange={(event) => updateUser({ firstName: event.target.value })}
              />
            </label>
            <label className="field">
              <span>Age</span>
              <input
                min="25"
                max="99"
                type="number"
                value={user.age}
                onChange={(event) => updateUser({ age: Number(event.target.value) || 25 })}
              />
            </label>
            <label className="field">
              <span>Short bio</span>
              <textarea
                maxLength={180}
                rows={4}
                value={user.bio}
                onChange={(event) => updateUser({ bio: event.target.value })}
              />
              <small>{user.bio.length}/180</small>
            </label>
            <label className="field">
              <span>My ideal golf outing is...</span>
              <textarea
                maxLength={160}
                rows={3}
                value={user.prompts[0]?.answer ?? ""}
                onChange={(event) => {
                  const prompts = [...user.prompts];
                  prompts[0] = {
                    prompt: "My ideal golf outing is...",
                    answer: event.target.value,
                  };
                  updateUser({ prompts });
                }}
              />
            </label>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="editor-fields">
            <label className="field">
              <span>Experience level</span>
              <select
                value={user.golf.experienceLevel}
                onChange={(event) =>
                  updateGolf({
                    experienceLevel: event.target.value as typeof user.golf.experienceLevel,
                  })
                }
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </label>
            <label className="field">
              <span>Handicap <em>Self-reported</em></span>
              <input
                min="0"
                max="54"
                step="0.1"
                type="number"
                value={user.golf.handicap ?? ""}
                onChange={(event) =>
                  updateGolf({
                    handicap: event.target.value ? Number(event.target.value) : undefined,
                  })
                }
              />
            </label>
            <fieldset className="field-group">
              <legend>How do you usually play?</legend>
              <div className="segmented-control">
                {(["walk", "cart", "either"] as const).map((value) => (
                  <button
                    className={user.golf.transportation === value ? "selected" : ""}
                    type="button"
                    key={value}
                    onClick={() => updateGolf({ transportation: value })}
                  >
                    {value === "either" ? "Either" : value === "walk" ? "Walk" : "Cart"}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="field-group">
              <legend>Preferred days</legend>
              <div className="chip-picker">
                {["Friday", "Saturday", "Sunday"].map((day) => (
                  <button
                    className={user.golf.preferredDays.includes(day) ? "selected" : ""}
                    type="button"
                    key={day}
                    onClick={() => toggleDay(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="field">
              <span>Travel radius</span>
              <div className="range-value">{user.golf.travelRadiusMiles} miles</div>
              <input
                className="range-input"
                min="5"
                max="50"
                step="5"
                type="range"
                value={user.golf.travelRadiusMiles}
                onChange={(event) =>
                  updateGolf({ travelRadiusMiles: Number(event.target.value) })
                }
              />
            </label>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="editor-fields">
            <fieldset className="field-group">
              <legend>Connections you are open to</legend>
              <div className="chip-picker">
                {([
                  ["date", "Golf dates"],
                  ["play", "Playing partners"],
                  ["both", "Open to both"],
                ] as const).map(([value, label]) => {
                  const selected = user.discoveryPreferences.intentCompatibility.includes(value);
                  return (
                    <button
                      className={selected ? "selected" : ""}
                      type="button"
                      key={value}
                      onClick={() => {
                        const current = user.discoveryPreferences.intentCompatibility;
                        const next = selected
                          ? current.filter((item) => item !== value)
                          : [...current, value];
                        if (next.length > 0) updatePreferences({ intentCompatibility: next });
                      }}
                    >
                      {selected ? <Check size={14} /> : null} {label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <div className="field-pair">
              <label className="field">
                <span>Minimum age</span>
                <input
                  min="25"
                  max={user.discoveryPreferences.ageRange[1]}
                  type="number"
                  value={user.discoveryPreferences.ageRange[0]}
                  onChange={(event) =>
                    updatePreferences({
                      ageRange: [
                        Number(event.target.value),
                        user.discoveryPreferences.ageRange[1],
                      ],
                    })
                  }
                />
              </label>
              <label className="field">
                <span>Maximum age</span>
                <input
                  min={user.discoveryPreferences.ageRange[0]}
                  max="80"
                  type="number"
                  value={user.discoveryPreferences.ageRange[1]}
                  onChange={(event) =>
                    updatePreferences({
                      ageRange: [
                        user.discoveryPreferences.ageRange[0],
                        Number(event.target.value),
                      ],
                    })
                  }
                />
              </label>
            </div>
            <label className="field">
              <span>Maximum distance</span>
              <div className="range-value">{user.discoveryPreferences.distanceMiles} miles</div>
              <input
                className="range-input"
                min="5"
                max="75"
                step="5"
                type="range"
                value={user.discoveryPreferences.distanceMiles}
                onChange={(event) =>
                  updatePreferences({ distanceMiles: Number(event.target.value) })
                }
              />
            </label>
            <div className="profile-preview">
              <img src={user.photoPaths[0]} alt="" />
              <div>
                <p className="eyebrow">Ready to explore</p>
                <h3>{user.firstName}, {user.age}</h3>
                <span>{intentLabels[user.intent]} · {user.golf.experienceLevel}</span>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      <div className="editor-actions">
        {step > 0 ? (
          <button className="button button-secondary" onClick={() => setStep(step - 1)}>
            Back
          </button>
        ) : (
          <button className="button button-secondary" onClick={() => navigate("/profile")}>
            Cancel
          </button>
        )}
        {step < 3 ? (
          <button className="button button-primary" onClick={() => setStep(step + 1)}>
            Continue <ChevronRight size={18} />
          </button>
        ) : (
          <button className="button button-primary" onClick={saveProfile}>
            <Check size={18} /> Save profile
          </button>
        )}
      </div>
    </div>
  );
}

function ConfirmedOutingPage() {
  const { outingId = "" } = useParams();
  const outing = useDemoStore((state) =>
    state.proposedOutings.find((candidate) => candidate.id === outingId),
  );
  const addToCalendar = useDemoStore((state) => state.addOutingToDemoCalendar);
  const calendarIds = useDemoStore((state) => state.demoCalendarOutingIds);

  if (!outing) return <NotFoundContent title="This confirmed outing is not available" />;
  const course = coursesById[outing.courseId];
  const added = calendarIds.includes(outing.id);

  return (
    <div className="page confirmed-page">
      <div className="success-mark"><Check size={34} /></div>
      <p className="eyebrow">You have a plan</p>
      <h1>Fairway date confirmed</h1>
      <div className="confirmed-portraits">
        <img src="/demo/profiles/alex-demo-1.svg" alt="Alex, fictional demo profile" />
        <img src="/demo/profiles/maya-demo-1.svg" alt="Maya, fictional demo profile" />
      </div>
      <div className="confirmation-card">
        <img src={course?.imagePath} alt={`${course?.name}, fictional golf venue`} />
        <div>
          <h2>{course?.name}</h2>
          <p><CalendarDays size={16} /> {outing.dateLabel} · {outing.timeLabel}</p>
          <p><Flag size={16} /> Nine holes · Cart</p>
          <p>{outing.note}</p>
          <span className="perk">{outing.demoPerk}</span>
        </div>
      </div>
      <button className="button button-primary button-block" onClick={() => addToCalendar(outing.id)}>
        {added ? <Check size={18} /> : <CalendarDays size={18} />}
        {added ? "Added to demo calendar" : "Add to calendar"}
      </button>
      <p className="safety-note">Meet in a public place and share your plans with a friend.</p>
      <Link className="button button-secondary button-block" to="/matches">Back to matches</Link>
    </div>
  );
}

function DemoControlsPage() {
  const navigate = useNavigate();
  const initialize = useDemoStore((state) => state.initializeScenario);
  const jump = useDemoStore((state) => state.jumpToStage);
  const eventLog = useDemoStore((state) => state.eventLog);
  const setMembership = useDemoStore((state) => state.setMembershipLevel);

  return (
    <div className="page">
      <PageHeader title="Demo controls" eyebrow="Presenter recovery" />
      <div className="settings-list">
        {(["dustin-dating", "outings", "premium"] as DemoScenarioId[]).map((scenario) => (
          <button
            key={scenario}
            onClick={() => {
              initialize(scenario, true);
              navigate(scenarios[scenario].initialRoute);
            }}
          >
            <span>Load {scenarios[scenario].label}</span><ChevronRight />
          </button>
        ))}
        {(["discovery", "maya-match", "maya-chat", "confirmed-outing"] as const).map((stage) => (
          <button key={stage} onClick={() => navigate(jump(stage))}>
            <span>Jump to {stage}</span><ChevronRight />
          </button>
        ))}
      </div>
      <div className="button-row">
        {(["basic", "premium", "vip"] as MembershipLevel[]).map((level) => (
          <button className="button button-secondary" key={level} onClick={() => setMembership(level)}>
            {level}
          </button>
        ))}
      </div>
      <div className="event-panel">
        <strong>Local events ({eventLog.length})</strong>
        {eventLog.slice(-6).reverse().map((event) => <code key={event.id}>{event.name}</code>)}
      </div>
    </div>
  );
}

function NotFoundContent({ title = "That page is beyond the fairway" }: { title?: string }) {
  return (
    <div className="page">
      <div className="empty-state">
        <span className="empty-icon"><Flag /></span>
        <h1>{title}</h1>
        <p>The fictional demo state may have been reset.</p>
        <Link className="button button-primary" to="/discover">Return to demo</Link>
      </div>
    </div>
  );
}

function ShellRoute({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}

export function App() {
  const location = useLocation();
  const shellKey = location.pathname.split("/")[1];
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/discover" element={<ShellRoute key={shellKey}><DiscoverPage /></ShellRoute>} />
      <Route path="/matches" element={<ShellRoute key={shellKey}><MatchesPage /></ShellRoute>} />
      <Route path="/matches/:matchId" element={<ShellRoute key={shellKey}><MatchChatPage /></ShellRoute>} />
      <Route path="/likes" element={<ShellRoute key={shellKey}><LikesPage /></ShellRoute>} />
      <Route path="/outings" element={<ShellRoute key={shellKey}><OutingsPage /></ShellRoute>} />
      <Route path="/outings/:outingId" element={<Navigate to="/outings" replace />} />
      <Route path="/membership" element={<ShellRoute key={shellKey}><MembershipPage /></ShellRoute>} />
      <Route path="/profile" element={<ShellRoute key={shellKey}><ProfilePage /></ShellRoute>} />
      <Route path="/onboarding" element={<ShellRoute key={shellKey}><OnboardingPage /></ShellRoute>} />
      <Route path="/confirmed/:outingId" element={<ShellRoute key={shellKey}><ConfirmedOutingPage /></ShellRoute>} />
      <Route path="/__demo" element={<ShellRoute key={shellKey}><DemoControlsPage /></ShellRoute>} />
      <Route path="/not-found" element={<ShellRoute key={shellKey}><NotFoundContent /></ShellRoute>} />
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
}
