// ---------------------------------------------------------------------------
// components/TipCard.tsx: one tip with its approximate, pre-written impact.
// ---------------------------------------------------------------------------

import type { TipWithImpact } from "@/lib/types";

interface TipCardProps {
  tip: TipWithImpact;
}

const CONFIDENCE_STYLES: Record<TipWithImpact["impact"]["confidence"], string> = {
  high: "bg-emerald-100 text-emerald-900 border-emerald-300",
  medium: "bg-amber-100 text-amber-900 border-amber-300",
  low: "bg-slate-100 text-slate-800 border-slate-300",
};

export function TipCard({ tip }: TipCardProps) {
  return (
    <article className="group rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm hover:border-slate-300 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-3.5">
        {/* Icon marker */}
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60 shadow-xs"
          aria-hidden="true"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>

        {/* Title and Category */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
              Action Plan
            </span>
          </div>
          <h3 className="mt-0.5 text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
            {tip.title}
          </h3>
        </div>
      </div>

      {/* Rationale Text */}
      <p className="mt-3 text-sm leading-relaxed text-slate-600 pl-0 sm:pl-[54px]">
        {tip.why}
      </p>

      {/* Visually Separated Estimated Impact Section */}
      <div className="mt-4 sm:ml-[54px] rounded-xl border border-sky-100 bg-sky-50/60 p-4 shadow-xs">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4 text-sky-700 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <p className="text-xs font-bold uppercase tracking-wider text-sky-950">
              Estimated impact (confidence: {tip.impact.confidence})
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${CONFIDENCE_STYLES[tip.impact.confidence]}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
            {tip.impact.confidence} confidence
          </span>
        </div>

        <p className="mt-2 text-sm font-medium leading-relaxed text-slate-800">
          {tip.impact.summary}
        </p>
      </div>
    </article>
  );
}
