import { describe, expect, it } from "vitest";
import { ValidationError } from "../lib/errors";
import { validateProfile } from "../lib/validation";

const validBody = {
  city: "  Delhi ",
  hasChildren: true,
  hasElderly: false,
  hasRespiratoryCondition: false,
  hasPurifier: false,
  commute: "car",
  fuel: "lpg",
};

describe("validateProfile", () => {
  it("accepts a valid body and trims the city", () => {
    expect(validateProfile(validBody).city).toBe("Delhi");
  });

  it("rejects a missing or empty city", () => {
    expect(() => validateProfile({ ...validBody, city: "" })).toThrow(ValidationError);
    expect(() => validateProfile({ ...validBody, city: undefined })).toThrow(ValidationError);
  });

  it("rejects a city with unsafe characters", () => {
    expect(() => validateProfile({ ...validBody, city: "<script>x</script>" })).toThrow(
      ValidationError,
    );
  });

  it("rejects a city that is too long", () => {
    expect(() => validateProfile({ ...validBody, city: "a".repeat(101) })).toThrow(
      ValidationError,
    );
  });

  it("rejects non-boolean flags and unknown options", () => {
    expect(() => validateProfile({ ...validBody, hasChildren: "yes" })).toThrow(ValidationError);
    expect(() => validateProfile({ ...validBody, commute: "rocket" })).toThrow(ValidationError);
    expect(() => validateProfile({ ...validBody, fuel: "gas" })).toThrow(ValidationError);
  });

  it("rejects bodies that are not objects", () => {
    expect(() => validateProfile(null)).toThrow(ValidationError);
    expect(() => validateProfile([])).toThrow(ValidationError);
  });
});