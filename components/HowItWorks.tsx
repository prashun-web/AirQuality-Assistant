// ---------------------------------------------------------------------------
// components/HowItWorks.tsx: three short steps explaining the product.
// ---------------------------------------------------------------------------

const STEPS = [
  {
    title: "Tell us about your home",
    text: "Your city, who lives with you, how you get around and what you cook with.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    title: "We check the air today",
    text: "Live air quality for your city decides how cautious the plan needs to be.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
  },
  {
    title: "Get a plan with clear impact",
    text: "Practical routines, indoor air hacks and cleaner alternatives, each with an approximate impact note.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="pt-2">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700">How it works</p>
          <h2 id="how-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            How it works
          </h2>
        </div>
        <p className="text-sm text-slate-600 max-w-md">
          Simple three-step assessment powered by real-time atmospheric data and targeted AI recommendations.
        </p>
      </div>

      <ol className="grid gap-5 sm:grid-cols-3">
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
          >
            <div>
              <div className="flex items-center justify-between">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-sky-700 font-bold text-white shadow-sm shadow-teal-950/20 text-sm"
                >
                  0{index + 1}
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors">
                  {step.icon}
                </span>
              </div>
              <h3 className="mt-5 text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {step.text}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-slate-400 group-hover:text-teal-700 transition-colors">
              <span>Step 0{index + 1} of 03</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
