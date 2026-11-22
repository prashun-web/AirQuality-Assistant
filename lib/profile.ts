// ---------------------------------------------------------------------------
// lib/profile.ts: small pure helpers about the user's household.
// ---------------------------------------------------------------------------

import type { UserProfile } from "./types";

/** True when anyone in the household is more sensitive to polluted air. */
export function hasSensitiveMember(profile: UserProfile): boolean {
  return profile.hasChildren || profile.hasElderly || profile.hasRespiratoryCondition;
}