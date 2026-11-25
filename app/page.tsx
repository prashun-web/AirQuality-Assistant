"use client";

// ---------------------------------------------------------------------------
// app/page.tsx: landing page composing the hero, guide, form, results & footer.
// ---------------------------------------------------------------------------

import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { ProfileForm } from "@/components/ProfileForm";
import { ResultsPanel } from "@/components/ResultsPanel";
import { useAdvice } from "@/hooks/useAdvice";

export default function Home() {
  const { status, requestAdvice } = useAdvice();

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

                <ProfileForm isLoading={status.kind === "loading"} onSubmit={requestAdvice} />
              </div>

              {/* Right Column: Dynamic Results, Loading Skeletons, and Alerts */}
              <ResultsPanel status={status} />
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
