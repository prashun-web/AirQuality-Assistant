// ---------------------------------------------------------------------------
// lib/types.ts: shared types and constant lists (single source of truth).
// ---------------------------------------------------------------------------

export const COMMUTES = ["car", "bike", "public_transport", "walk"] as const;
export type Commute = (typeof COMMUTES)[number];

export const FUELS = ["lpg", "electric", "wood_or_coal"] as const;
export type Fuel = (typeof FUELS)[number];

/** Action keys the LLM may assign to a tip. Impact text lives in lib/impact.ts. */
export const ACTION_TYPES = [
  "keep_windows_closed_peak_hours",
  "use_air_purifier",
  "wear_n95_outdoors",
  "avoid_outdoor_exercise_peak_hours",
  "switch_to_public_transport",
  "switch_to_cycling_or_walking",
  "switch_cooking_to_cleaner_fuel",
  "no_waste_or_biomass_burning",
  "improve_ventilation_timing",
  "limit_outdoor_time_for_vulnerable_groups",
] as const;
export type ActionType = (typeof ACTION_TYPES)[number];

export type AqiCategory =
  | "Good"
  | "Moderate"
  | "Unhealthy for Sensitive Groups"
  | "Unhealthy"
  | "Very Unhealthy"
  | "Hazardous";

/** What the user tells us about their household and habits. */
export interface UserProfile {
  city: string;
  hasChildren: boolean;
  hasElderly: boolean;
  hasRespiratoryCondition: boolean;
  hasPurifier: boolean;
  commute: Commute;
  fuel: Fuel;
}

/** Current air quality for the user's city. */
export interface AirQuality {
  city: string;
  country: string;
  aqi: number;
  pm25: number;
  pm10: number;
  category: AqiCategory;
}

/** A tip as produced by the LLM (advice plus a type key, no numbers). */
export interface Tip {
  title: string;
  why: string;
  type: ActionType;
}

export interface ImpactNote {
  summary: string;
  confidence: "low" | "medium" | "high";
}

/** A tip after our code has attached its approximate impact note. */
export interface TipWithImpact extends Tip {
  impact: ImpactNote;
}

/** The JSON returned by POST /api/advice. */
export interface AdviceResponse {
  air: AirQuality;
  tips: TipWithImpact[];
  disclaimer: string;
}