"use client";

// ---------------------------------------------------------------------------
// app/page.tsx: landing page, form and results. All fetching lives here.
// ---------------------------------------------------------------------------

import { useEffect, useRef, useState } from "react";
import { AqiBadge } from "@/components/AqiBadge";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { ProfileForm } from "@/components/ProfileForm";
import { TipCard } from "@/components/TipCard";
import type { AdviceResponse, UserProfile } from "@/lib/types";

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "success"; advice: AdviceResponse };

const GENERIC_ERROR = "Something went wrong. Please try again.";

async function fetchAdvice(profile: UserProfile): Promise<AdviceResponse> {
  const response = await fetch("/api/advice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });

  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "error" in data
        ? String((data as { error: unknown }).error)
        : GENERIC_ERROR;
    throw new Error(message);
  }
  return data as AdviceResponse;
}

export default function Home() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

  // Moves keyboard and screen-reader focus to the results when they arrive.
  useEffect(() => {
    if (status.kind === "success") resultsHeadingRef.current?.focus();
  }, [status]);

  async function handleSubmit(profile: UserProfile) {
    setStatus({ kind: "loading" });
    try {
      setStatus({ kind: "success", advice: await fetchAdvice(profile) });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : GENERIC_ERROR,
      });
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col justify-between">
      <div>
        <Hero />

        <main className="mx-auto max-w-6xl space-y-16 px-4 py-12 sm:px-6 lg:px-8">
          <HowItWorks />

          <section id="plan" aria-labelledby="plan-heading" className="scroll-mt-8">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Action Center
              </p>
              <h2
                id="plan-heading"
                className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900"
              >
                Build your plan
              </h2>
              <p className="mt-1 text-sm text-slate-600 max-w-2xl">
                Configure your household parameters on the left to generate real-time atmospheric
                intelligence and personalized mitigation routines.
              </p>
            </div>

            {/* Main Two-Column Dashboard Layout (Desktop) / Single-Column (Mobile) */}
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] items-start">
              {/* Left Column: Form Card */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm">
                <div className="mb-5 pb-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                      Your household
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Configure environment & habits
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-600" aria-hidden="true" />
                    Input
                  </span>
                </div>

                <ProfileForm isLoading={status.kind === "loading"} onSubmit={handleSubmit} />
              </div>

              {/* Right Column: Dynamic Results, Loading Skeletons, and Alerts */}
              <div className="space-y-5">
                {/* Screen-reader Status and Loading Area */}
                <div aria-live="polite" role="status">
                  {status.kind === "loading" && (
                    <div className="space-y-4">
                      {/* Alert banner with spinner */}
                      <div className="rounded-xl border border-sky-200 bg-sky-50/90 p-4 text-sky-950 flex items-center gap-3 shadow-xs">
                        <svg
                          className="h-5 w-5 animate-spin text-sky-600 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <p className="text-sm font-semibold">
                          Checking air quality and preparing your plan...
                        </p>
                      </div>

                      {/* CSS-only Skeleton Placeholders */}
                      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm animate-pulse">
                        <div className="flex justify-between items-center">
                          <div className="h-4 bg-slate-200 rounded-md w-1/3" />
                          <div className="h-5 bg-slate-200 rounded-full w-20" />
                        </div>
                        <div className="h-10 bg-slate-200 rounded-lg w-1/2" />
                        <div className="h-3 bg-slate-100 rounded-full w-full" />
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="h-16 bg-slate-100 rounded-xl" />
                          <div className="h-16 bg-slate-100 rounded-xl" />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-sm animate-pulse">
                        <div className="h-5 bg-slate-200 rounded-md w-2/5" />
                        <div className="h-4 bg-slate-100 rounded-md w-full" />
                        <div className="h-16 bg-slate-50 rounded-xl border border-slate-100" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Error Banner Area */}
                <div role="alert">
                  {status.kind === "error" && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-900 shadow-sm flex items-start gap-3.5">
                      <svg
                        className="h-5 w-5 text-red-600 shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <div>
                        <h4 className="text-sm font-bold text-red-950">Notice</h4>
                        <p className="mt-1 text-sm leading-relaxed text-red-900">{status.message}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Idle / Default State */}
                {status.kind === "idle" && (
                  <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white/70 p-8 text-center sm:p-12 shadow-xs">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 border border-sky-100 shadow-xs">
                      <svg
                        className="h-7 w-7"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z"
                        />
                      </svg>
                    </div>
                    <h4 className="mt-4 text-base font-bold text-slate-800">
                      Environmental Plan Pending
                    </h4>
                    <p className="mt-1.5 max-w-sm mx-auto text-sm leading-relaxed text-slate-600">
                      Your personalised plan will appear here once you submit the form.
                    </p>
                    <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-semibold text-slate-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-600" aria-hidden="true" />
                      Live telemetry via Open-Meteo
                    </div>
                  </div>
                )}

                {/* Success / Results State */}
                {status.kind === "success" && (
                  <section aria-labelledby="results-heading" className="space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <h3
                        id="results-heading"
                        ref={resultsHeadingRef}
                        tabIndex={-1}
                        className="text-xl font-bold tracking-tight text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 rounded-md"
                      >
                        Your clean-air plan
                      </h3>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200/80 px-3 py-1 text-xs font-semibold text-teal-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-600" aria-hidden="true" />
                        AI Generated
                      </span>
                    </div>

                    <AqiBadge air={status.advice.air} />

                    <div className="space-y-4">
                      {status.advice.tips.map((tip) => (
                        <TipCard key={tip.type} tip={tip} />
                      ))}
                    </div>

                    <div className="rounded-xl border border-slate-200/90 bg-white/80 p-4 text-xs leading-relaxed text-slate-600 flex items-start gap-2.5 shadow-xs">
                      <svg
                        className="h-4 w-4 text-slate-400 shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-xs text-slate-600">{status.advice.disclaimer}</p>
                    </div>
                  </section>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>

      <footer className="mt-20 border-t border-slate-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-teal-600" aria-hidden="true" />
            <span className="text-sm font-bold text-slate-900">Smog Navigator</span>
            <span className="text-xs text-slate-400">· Weather AI Intelligence</span>
          </div>
          <p className="text-xs text-slate-600 text-center sm:text-right max-w-xl leading-relaxed">
            Air quality data from Open-Meteo. Impact figures are approximate and this is not
            medical advice. No personal data is stored.
          </p>
        </div>
      </footer>
    </div>
  );
}
