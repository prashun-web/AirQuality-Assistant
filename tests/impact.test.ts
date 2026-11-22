import { describe, expect, it } from "vitest";
import { IMPACT_NOTES, getImpactNote, isActionType } from "../lib/impact";
import { ACTION_TYPES } from "../lib/types";

describe("impact engine", () => {
  it("has a note for every action type", () => {
    for (const type of ACTION_TYPES) {
      expect(IMPACT_NOTES[type].summary.length).toBeGreaterThan(0);
    }
  });

  it("returns the note for a given type", () => {
    expect(getImpactNote("wear_n95_outdoors")).toBe(IMPACT_NOTES.wear_n95_outdoors);
  });

  it("accepts known types and rejects unknown ones", () => {
    expect(isActionType("use_air_purifier")).toBe(true);
    expect(isActionType("made_up_action")).toBe(false);
  });

  it("marks every numeric percentage as approximate", () => {
    for (const type of ACTION_TYPES) {
      const { summary } = IMPACT_NOTES[type];
      if (/\d+%/.test(summary)) expect(summary).toMatch(/approximately/i);
    }
  });
});