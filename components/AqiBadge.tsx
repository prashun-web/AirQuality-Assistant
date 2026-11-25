// ---------------------------------------------------------------------------
// components/AqiBadge.tsx: AQI number + category as text + color.
// ---------------------------------------------------------------------------

import type { AirQuality, AqiCategory } from "@/lib/types";

const METRIC_CARD_STYLE = "rounded-xl border border-slate-200/80 bg-white/90 p-3 shadow-xs";
const METRIC_LABEL_STYLE = "text-[11px] font-semibold uppercase tracking-wider text-slate-500";
const METRIC_VALUE_STYLE = "mt-1 text-base sm:text-lg font-bold text-slate-900";

interface AqiBadgeProps {
  air: AirQuality;
}

interface CategoryConfig {
  cardBg: string;
  cardBorder: string;
  badgeBg: string;
  textColor: string;
  labelColor: string;
  summary: string;
}

const CATEGORY_THEMES: Record<AqiCategory, CategoryConfig> = {
  Good: {
    cardBg: "bg-emerald-50/80",
    cardBorder: "border-emerald-300",
    badgeBg: "bg-emerald-700 text-white",
    textColor: "text-emerald-950",
    labelColor: "text-emerald-800",
    summary: "Air quality is satisfactory and poses little or no health risk.",
  },
  Moderate: {
    cardBg: "bg-amber-50/80",
    cardBorder: "border-amber-300",
    badgeBg: "bg-amber-700 text-white",
    textColor: "text-amber-950",
    labelColor: "text-amber-800",
    summary: "Air quality is acceptable; unusually sensitive individuals should take precautions.",
  },
  "Unhealthy for Sensitive Groups": {
    cardBg: "bg-orange-50/80",
    cardBorder: "border-orange-300",
    badgeBg: "bg-orange-700 text-white",
    textColor: "text-orange-950",
    labelColor: "text-orange-900",
    summary: "Children, older adults, and individuals with respiratory issues may experience symptoms.",
  },
  Unhealthy: {
    cardBg: "bg-rose-50/80",
    cardBorder: "border-rose-300",
    badgeBg: "bg-rose-700 text-white",
    textColor: "text-rose-950",
    labelColor: "text-rose-900",
    summary: "Everyone may begin to experience health effects; sensitive groups are at greater risk.",
  },
  "Very Unhealthy": {
    cardBg: "bg-purple-50/80",
    cardBorder: "border-purple-300",
    badgeBg: "bg-purple-800 text-white",
    textColor: "text-purple-950",
    labelColor: "text-purple-900",
    summary: "Health alert: elevated risk of serious respiratory symptoms for all individuals.",
  },
  Hazardous: {
    cardBg: "bg-slate-900",
    cardBorder: "border-rose-600",
    badgeBg: "bg-rose-600 text-white",
    textColor: "text-white",
    labelColor: "text-slate-300",
    summary: "Emergency conditions: avoid outdoor activities; indoor filtration is essential.",
  },
};

export function AqiBadge({ air }: AqiBadgeProps) {
  const theme = CATEGORY_THEMES[air.category] ?? CATEGORY_THEMES.Moderate;

  // Clamped position for the AQI meter gauge (0 to 500 scale)
  const clampedAqi = Math.max(0, Math.min(500, air.aqi));
  const meterPercentage = Math.round((clampedAqi / 500) * 100);

  return (
    <div
      className={`rounded-2xl border-2 p-5 sm:p-6 shadow-sm transition-all duration-200 ${theme.cardBg} ${theme.cardBorder}`}
    >
      {/* Location and Live Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <svg
            className={`h-4 w-4 shrink-0 ${theme.labelColor}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className={`text-sm font-semibold tracking-tight ${theme.labelColor}`}>
            Air quality now in {air.city}
            {air.country ? `, ${air.country}` : ""}
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${theme.badgeBg}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" aria-hidden="true" />
          Live Sensor
        </span>
      </div>

      {/* Main AQI and Category Display */}
      <div className="mt-4 flex flex-wrap items-baseline gap-3">
        <p className={`text-4xl sm:text-5xl font-black tracking-tight ${theme.textColor}`}>
          AQI {air.aqi}
        </p>
        <span
          className={`inline-flex items-center rounded-lg px-2.5 py-1 text-sm sm:text-base font-bold shadow-xs ${theme.badgeBg}`}
        >
          ({air.category})
        </span>
      </div>

      {/* Atmospheric Context Summary */}
      <p className={`mt-2 text-xs sm:text-sm font-medium leading-relaxed ${theme.labelColor}`}>
        {theme.summary}
      </p>

      {/* Visual AQI Gauge / Progress Bar */}
      <div className="mt-4 space-y-1.5" aria-hidden="true">
        <div className="flex justify-between text-[11px] font-semibold text-slate-500">
          <span>0 Good</span>
          <span>100 Mod</span>
          <span>150 Sens</span>
          <span>200 Unh</span>
          <span>300 V.Unh</span>
          <span>500 Haz</span>
        </div>
        <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
          {/* Multi-segment AQI Spectrum Bar */}
          <div className="absolute inset-0 flex h-full w-full">
            <span className="h-full w-[10%] bg-emerald-500" />
            <span className="h-full w-[10%] bg-amber-400" />
            <span className="h-full w-[10%] bg-orange-500" />
            <span className="h-full w-[10%] bg-rose-500" />
            <span className="h-full w-[20%] bg-purple-600" />
            <span className="h-full w-[40%] bg-rose-950" />
          </div>
          {/* Active Marker Indicator */}
          <div
            className="absolute top-0 bottom-0 w-2 -ml-1 rounded-full bg-white ring-2 ring-slate-900 shadow-md transition-all duration-300"
            style={{ left: `${meterPercentage}%` }}
          />
        </div>
      </div>

      {/* Particulate Matter Metrics Sub-grid */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className={METRIC_CARD_STYLE}>
          <p className={METRIC_LABEL_STYLE}>PM2.5 Fine Particles</p>
          <p className={METRIC_VALUE_STYLE}>
            {air.pm25} <span className="text-xs font-normal text-slate-500">µg/m³</span>
          </p>
        </div>
        <div className={METRIC_CARD_STYLE}>
          <p className={METRIC_LABEL_STYLE}>PM10 Coarse Dust</p>
          <p className={METRIC_VALUE_STYLE}>
            {air.pm10} <span className="text-xs font-normal text-slate-500">µg/m³</span>
          </p>
        </div>
      </div>

      {/* Accessible Plaintext Summary Line */}
      <p className={`mt-3 text-xs font-medium ${theme.labelColor}`}>
        PM2.5: {air.pm25} µg/m³ · PM10: {air.pm10} µg/m³
      </p>
    </div>
  );
}
