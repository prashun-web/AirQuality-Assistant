// ---------------------------------------------------------------------------
// lib/adviceClient.ts: browser-side call to POST /api/advice.
// ---------------------------------------------------------------------------

import type { AdviceResponse, UserProfile } from "./types";

export const GENERIC_ERROR = "Something went wrong. Please try again.";

function readErrorMessage(data: unknown): string {
    if (typeof data === "object" && data !== null && "error" in data) {
        return typeof data.error === "string" ? data.error : GENERIC_ERROR;
    }
    return GENERIC_ERROR;
}

// Minimal shape check, so a malformed response never reaches the UI.
function isAdviceResponse(data: unknown): data is AdviceResponse {
    return (
        typeof data === "object" &&
        data !== null &&
        "air" in data &&
        "tips" in data &&
        Array.isArray(data.tips)
    );
}

export async function fetchAdvice(profile: UserProfile): Promise<AdviceResponse> {
    const response = await fetch("/api/advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
    });

    const data: unknown = await response.json().catch(() => null);
    if (!response.ok) throw new Error(readErrorMessage(data));
    if (!isAdviceResponse(data)) throw new Error(GENERIC_ERROR);
    return data;
}