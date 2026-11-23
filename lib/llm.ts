// ---------------------------------------------------------------------------
// lib/llm.ts: talks to Gemini. The only file that touches the network.
// The model only chooses an action type and explains why it fits this family.
// Impact text is attached later from lib/impact.ts, never by the model.
// ---------------------------------------------------------------------------

import { LlmResponseError } from "./errors";
import { fetchJsonWithTimeout, UpstreamHttpError } from "./http";
import { buildPrompt } from "./prompt";
import { parseTips } from "./tipParser";
import { getRelevantActionTypes } from "./actionFilter";
import type { AirQuality, Tip, UserProfile } from "./types";

// If you get a "model not found" error, check the current name in Google AI Studio.
const GEMINI_MODEL = "gemini-3.6-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const REQUEST_TIMEOUT_MS = 60_000;
const MAX_OUTPUT_TOKENS = 1500;
const TEMPERATURE = 0.4;

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
}

// ---------------------------------------------------------------------------
// Gemini call (the only function that touches the network)
// ---------------------------------------------------------------------------

function getApiKey(): string {
  const key = process.env.LLM_API_KEY;
  // Generic message on purpose: never echo configuration details.
  if (!key) throw new Error("LLM service is not configured.");
  return key;
}

function extractText(data: GeminiResponse): string {
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new LlmResponseError();
  return text;
}

async function callGemini(prompt: string, apiKey: string): Promise<string> {
  try {
    const data = await fetchJsonWithTimeout<GeminiResponse>(
      GEMINI_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Header, not URL, so the key cannot leak into logs.
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: TEMPERATURE,
            maxOutputTokens: MAX_OUTPUT_TOKENS,
            responseMimeType: "application/json",
            // Hidden reasoning tokens slow the reply and eat the output limit.
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      },
      REQUEST_TIMEOUT_MS,
    );
    return extractText(data);
  } catch (error) {
    if (error instanceof LlmResponseError) throw error;
    // Log only the status or error type, never the key, the prompt or the response body.
    const reason = error instanceof UpstreamHttpError ? error.status : (error as Error).name;
    console.error(`Gemini request failed: ${reason}`);
    throw new LlmResponseError();
  }
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

export async function generateTips(profile: UserProfile, air: AirQuality): Promise<Tip[]> {
  const rawText = await callGemini(buildPrompt(profile, air), getApiKey());
  return parseTips(rawText, getRelevantActionTypes(profile));
}
