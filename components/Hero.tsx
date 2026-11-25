// ---------------------------------------------------------------------------
// components/Hero.tsx: top-of-page introduction with a button to the tool.
// ---------------------------------------------------------------------------

const HIGHLIGHTS = ["Live air quality", "Tailored to your home", "Impact explained"];

const AMBIENT_GLOW_BASE = "pointer-events-none absolute rounded-full";
const HIGHLIGHT_PILL_STYLE =
  "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-slate-200 backdrop-blur-md shadow-xs";
const CTA_BUTTON_STYLE =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-sky-950/40 hover:from-sky-400 hover:to-teal-400 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-150 min-h-[44px]";

function FloatingLeaf({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M27 5C17 5 9 11 7 21c-.4 2 .2 4 1.5 5.3C10 27.5 12 28 14 27.6 24 25.5 29 16 27 5z"
        fill="url(#heroLeafGrad)"
      />
      <path
        d="M7 26C12 20 18 14 25 7"
        stroke="#a7f3d0"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeOpacity="0.7"
      />
      <defs>
        <linearGradient id="heroLeafGrad" x1="7" y1="27" x2="27" y2="5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#4ade80" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function LungsIllustration() {
  return (
    <div
      className="hidden md:flex items-center justify-center lg:justify-end"
      aria-hidden="true"
    >
      <div className="relative flex h-72 w-72 items-center justify-center lg:h-[340px] lg:w-[340px]">
        {/* Ambient emerald/teal glow behind the sphere */}
        <div className="pointer-events-none absolute inset-4 rounded-full bg-gradient-to-tr from-emerald-500/25 via-teal-400/15 to-sky-400/20 blur-2xl" />

        {/* Subtle outer orbital ring */}
        <div className="pointer-events-none absolute -inset-3 rounded-full border border-teal-300/20 -rotate-12" />

        {/* Transparent circular glass background */}
        <div className="relative flex h-full w-full items-center justify-center rounded-full border border-white/20 bg-white/[0.05] backdrop-blur-xs shadow-[0_0_60px_rgba(16,185,129,0.2),inset_0_0_32px_rgba(255,255,255,0.08)]">
          <div className="pointer-events-none absolute inset-3 rounded-full border border-emerald-300/15" />

          {/* Inline SVG Green Lungs */}
          <svg
            viewBox="0 0 240 220"
            className="relative z-10 h-52 w-52 lg:h-60 lg:w-60 drop-shadow-[0_0_18px_rgba(52,211,153,0.45)]"
            fill="none"
          >
            <defs>
              <linearGradient id="tracheaGrad" x1="120" y1="18" x2="120" y2="108" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#e0f2fe" />
                <stop offset="100%" stopColor="#6ee7b7" />
              </linearGradient>
              <linearGradient id="leftLungGrad" x1="30" y1="64" x2="112" y2="195" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id="rightLungGrad" x1="210" y1="64" x2="128" y2="195" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id="lungHighlight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Left lung lobe */}
            <path
              d="M104 72 C92 56, 62 62, 46 88 C30 114, 24 152, 32 178 C38 196, 60 200, 82 190 C98 183, 108 174, 108 156 L108 88 C108 80, 106 75, 104 72 Z"
              fill="url(#leftLungGrad)"
              stroke="#6ee7b7"
              strokeOpacity="0.45"
              strokeWidth="1.5"
            />
            <path
              d="M98 80 C88 68, 66 72, 54 94 C43 114, 38 142, 42 162 C55 135, 76 112, 98 96 Z"
              fill="url(#lungHighlight)"
            />

            {/* Right lung lobe */}
            <path
              d="M136 72 C148 56, 178 62, 194 88 C210 114, 216 152, 208 178 C202 196, 180 200, 158 190 C142 183, 132 174, 132 156 L132 88 C132 80, 134 75, 136 72 Z"
              fill="url(#rightLungGrad)"
              stroke="#6ee7b7"
              strokeOpacity="0.45"
              strokeWidth="1.5"
            />
            <path
              d="M142 80 C152 68, 174 72, 186 94 C197 114, 202 142, 198 162 C185 135, 164 112, 142 96 Z"
              fill="url(#lungHighlight)"
            />

            {/* Trachea and bronchial tree */}
            <path
              d="M114 22 L114 82 C114 90, 106 98, 92 108 M126 22 L126 82 C126 90, 134 98, 148 108"
              stroke="url(#tracheaGrad)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M115 34 H125 M115 46 H125 M115 58 H125 M115 70 H125"
              stroke="#0f172a"
              strokeOpacity="0.22"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Left bronchial branches */}
            <path
              d="M94 107 C80 116, 68 128, 54 146 M84 114 C72 112, 60 114, 50 120 M76 125 C76 140, 72 156, 64 170 M88 122 C94 136, 94 152, 90 168"
              stroke="#a7f3d0"
              strokeOpacity="0.7"
              strokeWidth="2.4"
              strokeLinecap="round"
            />

            {/* Right bronchial branches */}
            <path
              d="M146 107 C160 116, 172 128, 186 146 M156 114 C168 112, 180 114, 190 120 M164 125 C164 140, 168 156, 176 170 M152 122 C146 136, 146 152, 150 168"
              stroke="#a7f3d0"
              strokeOpacity="0.7"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Subtle floating CSS leaf accents */}
        <FloatingLeaf className="hero-leaf-float pointer-events-none absolute -top-2 right-8 h-7 w-7 opacity-85 drop-shadow-[0_0_8px_rgba(74,222,128,0.45)]" />
        <FloatingLeaf className="hero-leaf-float-delayed pointer-events-none absolute top-14 -left-4 h-6 w-6 -rotate-45 opacity-75 drop-shadow-[0_0_8px_rgba(74,222,128,0.35)]" />
        <FloatingLeaf className="hero-leaf-float-slow pointer-events-none absolute bottom-6 -right-3 h-8 w-8 rotate-12 opacity-80 drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]" />
        <FloatingLeaf className="hero-leaf-float pointer-events-none absolute -bottom-2 left-12 h-5 w-5 -rotate-12 opacity-70" />
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white">
      {/* Atmospheric ambient CSS-only background shapes */}
      <div
        className={`${AMBIENT_GLOW_BASE} -top-32 -right-32 h-96 w-96 bg-sky-500/15 blur-3xl`}
        aria-hidden="true"
      />
      <div
        className={`${AMBIENT_GLOW_BASE} -bottom-32 -left-32 h-96 w-96 bg-teal-500/15 blur-3xl`}
        aria-hidden="true"
      />
      <div
        className={`${AMBIENT_GLOW_BASE} top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 bg-sky-400/5 blur-2xl`}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
          <div>
            {/* Category Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-950/60 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-teal-300 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" aria-hidden="true" />
              <span>Your personal air quality assistant</span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-5 max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Every Breath Deserves Better Air
            </h1>

            {/* Supporting Description */}
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
              AirWise checks the live air quality in your city and builds a simple,
              low-emission plan for your family, with a clear explanation of what each step
              is likely to do for you.
            </p>

            {/* Action Button */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#plan" className={CTA_BUTTON_STYLE}>
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
                <li key={item} className={HIGHLIGHT_PILL_STYLE}>
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

          <LungsIllustration />
        </div>
      </div>
    </header>
  );
}
