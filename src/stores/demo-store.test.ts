import { beforeEach, describe, expect, it } from "vitest";

import { DEMO_DATE_LABEL } from "@/data/fixtures";
import { DEMO_STORAGE_KEY, useDemoStore } from "@/stores/demo-store";

const state = () => useDemoStore.getState();

beforeEach(() => {
  localStorage.clear();
  state().initializeScenario("dustin-dating", true);
});

describe("demo store", () => {
  it("initializes the canonical scenario deterministically", () => {
    expect(state().profileDeckIds.slice(0, 3)).toEqual([
      "jordan-demo",
      "erin-demo",
      "maya-demo",
    ]);
    expect(state().profileDeckIds).toHaveLength(10);
    expect(state().onboardingComplete).toBe(true);
    expect(state().membershipLevel).toBe("basic");
  });

  it("likes Erin without creating a match", () => {
    state().swipeProfile("erin-demo", "right");
    expect(state().likedProfileIds).toContain("erin-demo");
    expect(state().matches.some((match) => match.profileId === "erin-demo")).toBe(false);
  });

  it("likes Maya and creates exactly one match", () => {
    state().swipeProfile("maya-demo", "right");
    state().createMatch("maya-demo");
    state().createMatch("maya-demo");
    expect(state().matches.filter((match) => match.id === "match-maya-demo")).toHaveLength(1);
    expect(state().conversations["match-maya-demo"]?.messages[0]?.body).toContain("River Bend");
  });

  it("rewinds the previous deck choice", () => {
    state().swipeProfile("jordan-demo", "left");
    expect(state().currentProfileIndex).toBe(1);
    state().rewindLastSwipe();
    expect(state().currentProfileIndex).toBe(0);
    expect(state().passedProfileIds).not.toContain("jordan-demo");
  });

  it("ignores empty messages and appends a valid message once", () => {
    state().createMatch("maya-demo");
    const initialLength = state().conversations["match-maya-demo"]?.messages.length;
    state().sendMessage("match-maya-demo", "  ");
    expect(state().conversations["match-maya-demo"]?.messages).toHaveLength(initialLength ?? 0);
    state().sendMessage("match-maya-demo", "Saturday works!");
    expect(state().conversations["match-maya-demo"]?.messages.at(-1)?.body).toBe(
      "Saturday works!",
    );
  });

  it("creates and accepts a structured outing", () => {
    state().createMatch("maya-demo");
    const outing = state().proposeOuting({
      matchId: "match-maya-demo",
      courseId: "river-bend",
      activityType: "nine-holes",
      dateLabel: DEMO_DATE_LABEL,
      timeLabel: "4:30 PM",
      holeCount: 9,
      transportation: "cart",
    });
    expect(outing).toMatchObject({
      id: "proposal-match-maya-demo",
      status: "proposed",
      dateLabel: DEMO_DATE_LABEL,
    });
    state().acceptProposedOuting(outing.id);
    expect(state().proposedOutings[0]?.status).toBe("accepted");
    expect(state().conversations["match-maya-demo"]?.messages.at(-1)?.body).toBe(
      "Maya accepted your golf date.",
    );
  });

  it("keeps join requests idempotent", () => {
    state().requestToJoinOuting("outing-singles-nine");
    state().requestToJoinOuting("outing-singles-nine");
    expect(state().publicOutingRequests["outing-singles-nine"]).toBe("requested");
    expect(
      state().eventLog.filter((event) => event.name === "public_outing_join_requested"),
    ).toHaveLength(1);
  });

  it("resets persisted state to the canonical scenario", async () => {
    state().setMembershipLevel("vip");
    await state().resetDemo("dustin-dating");
    expect(state().membershipLevel).toBe("basic");
    expect(state().currentProfileIndex).toBe(0);
    expect(state().matches.some((match) => match.id === "match-maya-demo")).toBe(false);
    expect(localStorage.getItem(DEMO_STORAGE_KEY)).not.toBeNull();
  });
});
