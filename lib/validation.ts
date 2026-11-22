// ---------------------------------------------------------------------------
// lib/validation.ts: validates the request body. Pure, no network.
// Throws ValidationError with a message that is safe to show to the user.
// ---------------------------------------------------------------------------

import { ValidationError } from "./errors";
import { COMMUTES, FUELS } from "./types";
import type { UserProfile } from "./types";

const MAX_CITY_LENGTH = 100;
// Letters (any language), spaces and a few punctuation marks found in city names.
const CITY_PATTERN = /^[\p{L}\p{M}\s.,'’-]+$/u;

type Body = Record<string, unknown>;

function readCity(body: Body): string {
  const value = body.city;
  if (typeof value !== "string") throw new ValidationError("City is required.");

  const city = value.trim();
  if (city.length === 0) throw new ValidationError("City is required.");
  if (city.length > MAX_CITY_LENGTH) {
    throw new ValidationError(`City must be at most ${MAX_CITY_LENGTH} characters.`);
  }
  if (!CITY_PATTERN.test(city)) {
    throw new ValidationError("City can only contain letters, spaces and basic punctuation.");
  }
  return city;
}

function readBoolean(body: Body, field: string): boolean {
  const value = body[field];
  if (typeof value !== "boolean") {
    throw new ValidationError(`"${field}" must be true or false.`);
  }
  return value;
}

function readOption<T extends string>(body: Body, field: string, options: readonly T[]): T {
  const match = options.find((option) => option === body[field]);
  if (match === undefined) {
    throw new ValidationError(`"${field}" must be one of: ${options.join(", ")}.`);
  }
  return match;
}

export function validateProfile(input: unknown): UserProfile {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new ValidationError("Request body must be a JSON object.");
  }
  const body = input as Body;

  return {
    city: readCity(body),
    hasChildren: readBoolean(body, "hasChildren"),
    hasElderly: readBoolean(body, "hasElderly"),
    hasRespiratoryCondition: readBoolean(body, "hasRespiratoryCondition"),
    hasPurifier: readBoolean(body, "hasPurifier"),
    commute: readOption(body, "commute", COMMUTES),
    fuel: readOption(body, "fuel", FUELS),
  };
}