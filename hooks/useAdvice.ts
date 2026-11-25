"use client";

// ---------------------------------------------------------------------------
// hooks/useAdvice.ts: request state (idle, loading, error, success) for the page.
// ---------------------------------------------------------------------------

import { useCallback, useState } from "react";
import { GENERIC_ERROR, fetchAdvice } from "@/lib/adviceClient";
import type { AdviceResponse, UserProfile } from "@/lib/types";

export type AdviceStatus =
    | { kind: "idle" }
    | { kind: "loading" }
    | { kind: "error"; message: string }
    | { kind: "success"; advice: AdviceResponse };

export function useAdvice() {
    const [status, setStatus] = useState<AdviceStatus>({ kind: "idle" });

    const requestAdvice = useCallback(async (profile: UserProfile) => {
        setStatus({ kind: "loading" });
        try {
            setStatus({ kind: "success", advice: await fetchAdvice(profile) });
        } catch (error) {
            setStatus({
                kind: "error",
                message: error instanceof Error ? error.message : GENERIC_ERROR,
            });
        }
    }, []);

    return { status, requestAdvice };
}