// ---------------------------------------------------------------------------
// lib/apiErrors.ts: maps errors to an HTTP status and a user-safe message.
// ---------------------------------------------------------------------------

import {
    AirQualityUnavailableError,
    CityNotFoundError,
    LlmResponseError,
    ValidationError,
} from "./errors";

export interface ApiError {
    message: string;
    status: number;
}

const UNEXPECTED_ERROR: ApiError = {
    message: "Something went wrong. Please try again.",
    status: 500,
};

/** Known errors carry user-safe messages; anything else is hidden. */
export function describeError(error: unknown): ApiError {
    if (error instanceof ValidationError) return { message: error.message, status: 400 };
    if (error instanceof CityNotFoundError) return { message: error.message, status: 404 };
    if (error instanceof AirQualityUnavailableError || error instanceof LlmResponseError) {
        return { message: error.message, status: 502 };
    }
    console.error("Unexpected error:", error instanceof Error ? error.name : "unknown");
    return UNEXPECTED_ERROR;
}