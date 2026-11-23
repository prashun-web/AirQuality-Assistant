// ---------------------------------------------------------------------------
// lib/advice.ts: builds the full advice response for one user profile.
// Flow: live air quality -> LLM tips (cached) -> safety rule -> impact notes.
// ---------------------------------------------------------------------------

import { getAirQuality } from "./airQuality";
import { TtlCache } from "./cache";
import { getImpactNote } from "./impact";
import { generateTips } from "./llm";
import { hasSensitiveMember } from "./profile";
import type {
  AdviceResponse,
  AirQuality,
  AqiCategory,
  Tip,
  TipWithImpact,
  UserProfile,
} from "./types";

const DISCLAIMER =
  "Impact figures are approximate and for general guidance only. " +
  "This is not medical advice. Consult a doctor if symptoms appear.";

const HIGH_RISK_CATEGORIES: readonly AqiCategory[] = [
  "Unhealthy",
  "Very Unhealthy",
  "Hazardous",
];

const TIPS_TTL_MS = 30 * 60 * 1000;

// Lives per server instance; holds only generic advice, never user identity.
const tipsCache = new TtlCache<Tip[]>(TIPS_TTL_MS);

// Same city, same AQI category and same household answers give the same advice.
function tipsCacheKey(profile: UserProfile, air: AirQuality): string {
  return JSON.stringify([
    air.city,
    air.category,
    profile.hasChildren,
    profile.hasElderly,
    profile.hasRespiratoryCondition,
    profile.hasPurifier,
    profile.commute,
    profile.fuel,
  ]);
}
async function getTips(profile: UserProfile, air: AirQuality): Promise<Tip[]> {
  const key = tipsCacheKey(profile, air);
  const cached = tipsCache.get(key);
  if (cached) return cached;

  const tips = await generateTips(profile, air);
  tipsCache.set(key, tips); // only successful results are cached
  return tips;
}

/**
 * Safety rule, enforced in code and not left to the model:
 * on high-risk air days a household with a sensitive member always sees
 * the "limit outdoor time" tip, placed first.
 */
export function applySafetyRule(tips: Tip[], profile: UserProfile, air: AirQuality): Tip[] {
  const isHighRisk = HIGH_RISK_CATEGORIES.includes(air.category);
  const alreadyPresent = tips.some((tip) => tip.type === "limit_outdoor_time_for_vulnerable_groups");

  if (!isHighRisk || !hasSensitiveMember(profile) || alreadyPresent) return tips;

  const safetyTip: Tip = {
    title: "Limit outdoor time for sensitive family members",
    why: `Air quality in ${air.city} is currently ${air.category}, so keep outdoor activity to essentials for children, elderly people and anyone with a respiratory condition.`,
    type: "limit_outdoor_time_for_vulnerable_groups",
  };
  return [safetyTip, ...tips];
}

/** Attaches our pre-written impact note to each tip. */
export function attachImpact(tips: Tip[]): TipWithImpact[] {
  return tips.map((tip) => ({ ...tip, impact: getImpactNote(tip.type) }));
}

export async function buildAdvice(profile: UserProfile): Promise<AdviceResponse> {
  const air = await getAirQuality(profile.city);
  const tips = await getTips(profile, air);

  return {
    air,
    tips: attachImpact(applySafetyRule(tips, profile, air)),
    disclaimer: DISCLAIMER,
  };
}