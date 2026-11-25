"use client";

// ---------------------------------------------------------------------------
// hooks/useCitySuggestions.ts: debounced city name suggestions for a query.
// ---------------------------------------------------------------------------

import { useEffect, useState } from "react";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;
const MAX_SUGGESTIONS = 6;

interface GeocodingResponse {
    results?: Array<{ name: string; admin1?: string; country?: string }>;
}

export function useCitySuggestions(query: string): string[] {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const trimmedQuery = query.trim();

    useEffect(() => {
        if (trimmedQuery.length < MIN_QUERY_LENGTH) return;

        const controller = new AbortController();
        const timer = setTimeout(async () => {
            try {
                const params = new URLSearchParams({
                    name: trimmedQuery,
                    count: String(MAX_SUGGESTIONS),
                    language: "en",
                    format: "json",
                });
                const response = await fetch(`${GEOCODING_URL}?${params}`, {
                    signal: controller.signal,
                });
                const data = (await response.json()) as GeocodingResponse;
                // Names only: the form field takes a city name, and duplicates are dropped.
                setSuggestions([...new Set((data.results ?? []).map((place) => place.name))]);
            } catch {
                // Suggestions are optional, so any failure just shows none.
                if (!controller.signal.aborted) setSuggestions([]);
            }
        }, DEBOUNCE_MS);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [trimmedQuery]);

    return trimmedQuery.length < MIN_QUERY_LENGTH ? [] : suggestions;
}