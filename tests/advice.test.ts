import { describe, expect, it } from "vitest";
import { applySafetyRule, attachImpact } from "../lib/advice";
import type { AirQuality, Tip, UserProfile } from "../lib/types";

const baseProfile: UserProfile = {
  city: "Delhi",
  hasChildren: true,
  hasElderly: false,
  hasRespiratoryCondition: false,
  hasPurifier: false,
  commute: "car",
  fuel: "lpg",
};

const makeAir = (category: AirQuality["category"]): AirQuality => ({
  city: "Delhi",
  country: "India",
  aqi: 250,
  pm25: 100,
  pm10: 150,
  category,
});

const tips: Tip[] = [{ title: "Mask", why: "Filters particles.", type: "wear_n95_outdoors" }];

describe("applySafetyRule", () => {
  it("adds the limit-outdoor-time tip first on high-risk days", () => {
    const result = applySafetyRule(tips, baseProfile, makeAir("Very Unhealthy"));
    expect(result[0].type).toBe("limit_outdoor_time_for_vulnerable_groups");
    expect(result).toHaveLength(2);
  });

  it("does nothing on a good air day", () => {
    expect(applySafetyRule(tips, baseProfile, makeAir("Good"))).toEqual(tips);
  });

  it("does nothing when nobody in the household is sensitive", () => {
    const adults = { ...baseProfile, hasChildren: false };
    expect(applySafetyRule(tips, adults, makeAir("Hazardous"))).toEqual(tips);
  });

  it("does not add a duplicate", () => {
    const existing: Tip[] = [
      { title: "Stay in", why: "Sensitive lungs.", type: "limit_outdoor_time_for_vulnerable_groups" },
    ];
    expect(applySafetyRule(existing, baseProfile, makeAir("Unhealthy"))).toHaveLength(1);
  });
});

describe("attachImpact", () => {
  it("adds an impact note to every tip", () => {
    const [result] = attachImpact(tips);
    expect(result.impact.summary.length).toBeGreaterThan(0);
  });
});