import { describe, expect, it } from "vitest";
import { getRelevantActionTypes } from "../lib/actionFilter";
import type { UserProfile } from "../lib/types";

const profile: UserProfile = {
  city: "Delhi",
  hasChildren: true,
  hasElderly: false,
  hasRespiratoryCondition: false,
  hasPurifier: false,
  commute: "car",
  fuel: "wood_or_coal",
};

describe("getRelevantActionTypes", () => {
  it("removes the purifier tip when the family already owns one", () => {
    const types = getRelevantActionTypes({ ...profile, hasPurifier: true });
    expect(types).not.toContain("use_air_purifier");
  });

  it("removes transport tips for people who bike or walk", () => {
    const types = getRelevantActionTypes({ ...profile, commute: "bike" });
    expect(types).not.toContain("switch_to_public_transport");
    expect(types).not.toContain("switch_to_cycling_or_walking");
  });

  it("removes the cleaner-fuel tip for electric cooking", () => {
    expect(getRelevantActionTypes({ ...profile, fuel: "electric" })).not.toContain(
      "switch_cooking_to_cleaner_fuel",
    );
  });

  it("removes the vulnerable-groups tip when nobody is sensitive", () => {
    const types = getRelevantActionTypes({ ...profile, hasChildren: false });
    expect(types).not.toContain("limit_outdoor_time_for_vulnerable_groups");
  });
});
