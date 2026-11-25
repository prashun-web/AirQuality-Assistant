// ---------------------------------------------------------------------------
// app/api/advice/route.ts: thin POST handler. No business logic here.
// ---------------------------------------------------------------------------

import { NextResponse } from "next/server";
import { buildAdvice } from "@/lib/advice";
import { describeError } from "@/lib/apiErrors";
import { readJsonBody } from "@/lib/request";
import { validateProfile } from "@/lib/validation";

// Gemini can take ~12s, so allow the function more time than the platform default.
export const maxDuration = 60;

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const profile = validateProfile(await readJsonBody(request));
    return NextResponse.json(await buildAdvice(profile));
  } catch (error) {
    const { message, status } = describeError(error);
    return NextResponse.json({ error: message }, { status });
  }
}