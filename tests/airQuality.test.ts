import { describe, expect, it } from "vitest";
import { getAqiCategory } from "../lib/airQuality";

describe("getAqiCategory", () => {
  it.each([
    [0, "Good"],
    [50, "Good"],
    [51, "Moderate"],
    [100, "Moderate"],
    [101, "Unhealthy for Sensitive Groups"],
    [150, "Unhealthy for Sensitive Groups"],
    [151, "Unhealthy"],
    [200, "Unhealthy"],
    [201, "Very Unhealthy"],
    [300, "Very Unhealthy"],
    [301, "Hazardous"],
  ])("maps AQI %i to %s", (aqi, category) => {
    expect(getAqiCategory(aqi)).toBe(category);
  });

  it("rejects negative and NaN values", () => {
    expect(() => getAqiCategory(-1)).toThrow(RangeError);
    expect(() => getAqiCategory(Number.NaN)).toThrow(RangeError);
  });
});