// ---------------------------------------------------------------------------
// lib/tipParser.ts: validates and parses the JSON array returned by the LLM.
// Pure functions; no network calls here.
// ---------------------------------------------------------------------------

import { LlmResponseError } from "./errors";
import { isActionType } from "./impact";
import { ACTION_TYPES } from "./types";
import type { ActionType, Tip } from "./types";

const MIN_TIPS = 3;
const MAX_TIPS = 8;
const MAX_TITLE_LENGTH = 80;
const MAX_WHY_LENGTH = 300;

function stripCodeFences(text: string): string {
  return text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
}

// Returns null for anything malformed, so one bad item never breaks the rest.
function toTip(item: unknown): Tip | null {
  if (typeof item !== "object" || item === null) return null;

  const { title, why, type } = item as Record<string, unknown>;
  if (typeof title !== "string" || typeof why !== "string" || typeof type !== "string") {
    return null;
  }

  const cleanTitle = title.trim();
  const cleanWhy = why.trim();
  const isTitleValid = cleanTitle.length > 0 && cleanTitle.length <= MAX_TITLE_LENGTH;
  const isWhyValid = cleanWhy.length > 0 && cleanWhy.length <= MAX_WHY_LENGTH;

  if (!isTitleValid || !isWhyValid || !isActionType(type)) return null;
  return { title: cleanTitle, why: cleanWhy, type };
}

export function parseTips(
  rawText: string,
  allowedTypes: readonly ActionType[] = ACTION_TYPES,
): Tip[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(stripCodeFences(rawText));
  } catch {
    throw new LlmResponseError();
  }
  if (!Array.isArray(parsed)) throw new LlmResponseError();

  const seenTypes = new Set<ActionType>();
  const tips: Tip[] = [];

  for (const item of parsed) {
    const tip = toTip(item);
    // Drop duplicates and types we deliberately excluded for this profile.
    if (!tip || seenTypes.has(tip.type) || !allowedTypes.includes(tip.type)) continue;
    seenTypes.add(tip.type);
    tips.push(tip);
    if (tips.length === MAX_TIPS) break;
  }

  if (tips.length < MIN_TIPS) throw new LlmResponseError();
  return tips;
}
