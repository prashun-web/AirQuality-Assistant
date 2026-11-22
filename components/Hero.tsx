// ---------------------------------------------------------------------------
// components/Hero.tsx: top-of-page introduction with a button to the tool.
// ---------------------------------------------------------------------------

const HIGHLIGHTS = ["Live air quality", "Tailored to your home", "Impact explained"];

export function Hero() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white">
      {/* Atmospheric ambient CSS-only background shapes */}
      <div
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-sky-500/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-teal-500/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/5 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
        {/* Category Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-950/60 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-teal-300 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" aria-hidden="true" />
          <span>Winter smog, made manageable</span>
        </div>

        {/* Main Headline */}
        <h1 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
          Breathe easier through smog season
        </h1>

        {/* Supporting Description */}
        <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-200">
          Smog Navigator checks the live air quality in your city and builds a simple,
          low-emission plan for your family, with a clear explanation of what each step
          is likely to do for you.
        </p>

        {/* Action Button */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#plan"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-sky-950/40 hover:from-sky-400 hover:to-teal-400 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-150 min-h-[44px]"
          >
            <span>Get my clean-air plan</span>
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>

        {/* Highlight Pills */}
        <ul className="mt-10 flex flex-wrap gap-2.5 sm:gap-3">
          {HIGHLIGHTS.map((item) => (
            <li
              key={item}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-slate-200 backdrop-blur-md shadow-xs"
            >
              <svg
                className="h-4 w-4 text-teal-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
