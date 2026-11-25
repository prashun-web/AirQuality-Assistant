// ---------------------------------------------------------------------------
// lib/request.ts: safely reads a JSON request body with a size limit.
// ---------------------------------------------------------------------------

import { ValidationError } from "./errors";

const MAX_BODY_BYTES = 2_048;

function assertWithinLimit(byteLength: number): void {
    if (byteLength > MAX_BODY_BYTES) throw new ValidationError("Request is too large.");
}

/** Rejects oversized bodies, then parses JSON. Throws ValidationError on failure. */
export async function readJsonBody(request: Request): Promise<unknown> {
    // Cheap check first, using the declared size, before reading the body.
    assertWithinLimit(Number(request.headers.get("content-length") ?? 0));

    const text = await request.text();
    assertWithinLimit(new TextEncoder().encode(text).length);

    try {
        return JSON.parse(text);
    } catch {
        throw new ValidationError("Request body must be valid JSON.");
    }
}