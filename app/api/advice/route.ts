// ---------------------------------------------------------------------------
// app/api/advice/route.ts: thin POST handler. No business logic here.
// ---------------------------------------------------------------------------

import { NextResponse } from "next/server";
import { buildAdvice } from "@/lib/advice";
import {
  AirQualityUnavailableError,
  CityNotFoundError,
  LlmResponseError,
  ValidationError,
} from "@/lib/errors";
import { validateProfile } from "@/lib/validation";

// Gemini can take ~12s, so allow the function more time than the platform default.
export const maxDuration = 60;

const MAX_BODY_BYTES = 2_048;

function errorResponse(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

// Rejects oversized bodies before they are parsed.
async function readJsonBody(request: Request): Promise<unknown> {
  const declaredSize = Number(request.headers.get("content-length") ?? 0);
  if (declaredSize > MAX_BODY_BYTES) throw new ValidationError("Request is too large.");

  const text = await request.text();
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) {
    throw new ValidationError("Request is too large.");
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new ValidationError("Request body must be valid JSON.");
  }
}

// Every known error carries a user-safe message; unknown errors are hidden.
function toErrorResponse(error: unknown): NextResponse {
  if (error instanceof ValidationError) return errorResponse(error.message, 400);
  if (error instanceof CityNotFoundError) return errorResponse(error.message, 404);
  if (error instanceof AirQualityUnavailableError || error instanceof LlmResponseError) {
    return errorResponse(error.message, 502);
  }
  console.error("Unexpected error:", error instanceof Error ? error.name : "unknown");
  return errorResponse("Something went wrong. Please try again.", 500);
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const profile = validateProfile(await readJsonBody(request));
    return NextResponse.json(await buildAdvice(profile));
  } catch (error) {
    return toErrorResponse(error);
  }
}