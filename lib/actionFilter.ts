// ---------------------------------------------------------------------------
// lib/actionFilter.ts: decides which action types are relevant for a profile.
// Tailoring is done in code, so the model is never asked for irrelevant tips.
// ---------------------------------------------------------------------------

import { ACTION_TYPES } from "./types";
import type { ActionType, UserProfile } from "./types";
import { hasSensitiveMember } from "./profile";

export function getRelevantActionTypes(profile: UserProfile): ActionType[] {
  const excluded = new Set<ActionType>();

  if (profile.hasPurifier) excluded.add("use_air_purifier");
  if (profile.fuel === "electric") excluded.add("switch_cooking_to_cleaner_fuel");

  if (profile.commute === "bike" || profile.commute === "walk") {
    excluded.add("switch_to_cycling_or_walking");
    excluded.add("switch_to_public_transport");
  }
  if (profile.commute === "public_transport") {
    excluded.add("switch_to_public_transport");
  }

  // Only meaningful when someone in the household is sensitive to smog.
    if (!hasSensitiveMember(profile)) {
    excluded.add("limit_outdoor_time_for_vulnerable_groups");
  }

  return ACTION_TYPES.filter((type) => !excluded.has(type));
}
