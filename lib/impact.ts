// ---------------------------------------------------------------------------
// lib/impact.ts: deterministic impact engine.
// Every impact statement shown to the user originates here, never from the LLM.
// The LLM picks an action type; we attach the matching note from IMPACT_NOTES.
// No specific citations or study names. Any number uses "approximately".
// ---------------------------------------------------------------------------

import { ACTION_TYPES } from "./types";
import type { ActionType, ImpactNote } from "./types";

export const IMPACT_NOTES: Record<ActionType, ImpactNote> = {
  // Basis: general indoor-outdoor PM2.5 exposure guidance
  keep_windows_closed_peak_hours: {
    summary:
      "Keeping windows closed during peak traffic hours (morning and evening rush) " +
      "can noticeably reduce indoor PM2.5, protecting children and elderly members " +
      "who spend the most time indoors.",
    confidence: "medium",
  },

  // Basis: peer-reviewed HEPA filtration estimates
  use_air_purifier: {
    summary:
      "A HEPA air purifier running in a closed room can reduce indoor PM2.5 " +
      "by approximately 50-80%, depending on how well it is matched to the room size. " +
      "Running it continuously in a bedroom or living area gives children and " +
      "elderly members cleaner air during the hours that matter most.",
    confidence: "high",
  },

  // Basis: standard respirator filtration ratings and public-health guidance
  wear_n95_outdoors: {
    summary:
      "A well-fitted N95 or FFP2 mask filters approximately 95% of fine airborne " +
      "particles, making it one of the most reliable ways to reduce personal PM2.5 " +
      "exposure outdoors. A poor fit gives much less protection, so check that it " +
      "seals snugly around the nose and chin.",
    confidence: "high",
  },

  // Basis: general air quality and physical activity guidance
  avoid_outdoor_exercise_peak_hours: {
    summary:
      "Exercise raises your breathing rate, so you draw in much more polluted " +
      "air per minute. Shifting outdoor activity to times when traffic and smog " +
      "are lower, often mid-morning or midday, can meaningfully lower your " +
      "total pollution dose.",
    confidence: "medium",
  },

  // Basis: urban transport emission research
  switch_to_public_transport: {
    summary:
      "Switching from a private car to public transport shares emissions across many " +
      "passengers, reducing your personal contribution to roadside PM2.5 and NOx " +
      "per journey.",
    confidence: "medium",
  },

  // Basis: urban mobility and health research
  switch_to_cycling_or_walking: {
    summary:
      "Replacing short car trips with cycling or walking eliminates tailpipe " +
      "emissions for those journeys. Choosing back-street routes away from main " +
      "roads can further lower your exposure to traffic-related pollutants.",
    confidence: "medium",
  },

  // Basis: general household air pollution guidance
  switch_cooking_to_cleaner_fuel: {
    summary:
      "Burning wood, coal or other biomass for cooking releases high levels of " +
      "PM2.5 and carbon monoxide indoors. Switching to LPG or electric cooking can " +
      "substantially reduce indoor cooking-related pollution, with the greatest " +
      "benefit for whoever spends the most time in the kitchen.",
    confidence: "medium",
  },

  // Basis: open-burning emission research
  no_waste_or_biomass_burning: {
    summary:
      "Burning crop waste, garden debris or household rubbish releases dense PM2.5 " +
      "that can linger for hours and drift into nearby homes. Avoiding open " +
      "burning, especially on still winter days, helps protect the whole " +
      "neighbourhood.",
    confidence: "high",
  },

  // Basis: indoor air quality monitoring studies
  improve_ventilation_timing: {
    summary:
      "Opening windows briefly during the cleanest part of the day allows fresh air " +
      "exchange without letting in peak-hour pollution. A short, timed ventilation " +
      "window can improve indoor air compared with keeping windows shut all day.",
    confidence: "low",
  },

  // Basis: public-health protective action guidance for sensitive groups
  limit_outdoor_time_for_vulnerable_groups: {
    summary:
      "Children, elderly people and those with respiratory conditions are more " +
      "sensitive to polluted air and may recover more slowly from exposure. On days " +
      "when AQI is Unhealthy or worse, limiting outdoor time to essential " +
      "activities is one of the most effective protective steps for these groups.",
    confidence: "high",
  },
};

/** Returns the pre-written impact note for an action type. */
export function getImpactNote(type: ActionType): ImpactNote {
  return IMPACT_NOTES[type];
}

/** Type guard: narrows a string to ActionType using the single shared list. */
export function isActionType(value: string): value is ActionType {
  return (ACTION_TYPES as readonly string[]).includes(value);
}