// ---------------------------------------------------------------------------
// lib/airQuality.ts: geocodes a city and fetches its current air quality.
// Uses the free Open-Meteo APIs (no API key needed).
// ---------------------------------------------------------------------------

import { AirQualityUnavailableError, CityNotFoundError } from "./errors";
import type { AirQuality, AqiCategory } from "./types";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";
const REQUEST_TIMEOUT_MS = 8_000;

interface GeocodingResponse {
  results?: Array<{
    name: string;
    country?: string;
    latitude: number;
    longitude: number;
  }>;
}

interface AirQualityResponse {
  current?: {
    us_aqi?: number;
    pm2_5?: number;
    pm10?: number;
  };
}

// Standard US AQI breakpoints, checked from lowest to highest.
const AQI_BREAKPOINTS: Array<{ max: number; category: AqiCategory }> = [
  { max: 50, category: "Good" },
  { max: 100, category: "Moderate" },
  { max: 150, category: "Unhealthy for Sensitive Groups" },
  { max: 200, category: "Unhealthy" },
  { max: 300, category: "Very Unhealthy" },
];

/** Pure function: maps a US AQI number to its category. */
export function getAqiCategory(aqi: number): AqiCategory {
  if (Number.isNaN(aqi) || aqi < 0) {
    throw new RangeError("AQI must be a non-negative number.");
  }
  const match = AQI_BREAKPOINTS.find((breakpoint) => aqi <= breakpoint.max);
  return match ? match.category : "Hazardous";
}

// One shared helper so the timeout and error handling exist in a single place.
async function fetchJson<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new AirQualityUnavailableError();
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof AirQualityUnavailableError) throw error;
    // Network failure, timeout or bad JSON: hide the details from the user.
    throw new AirQualityUnavailableError();
  } finally {
    clearTimeout(timer);
  }
}

async function geocodeCity(city: string) {
  const params = new URLSearchParams({
    name: city,
    count: "1",
    language: "en",
    format: "json",
  });
  const data = await fetchJson<GeocodingResponse>(`${GEOCODING_URL}?${params}`);

  const place = data.results?.[0];
  if (!place) throw new CityNotFoundError();
  return place;
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

const roundTo = (value: number, decimals: number): number => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

export async function getAirQuality(city: string): Promise<AirQuality> {
  const place = await geocodeCity(city);

  const params = new URLSearchParams({
    latitude: String(place.latitude),
    longitude: String(place.longitude),
    current: "us_aqi,pm2_5,pm10",
  });
  const data = await fetchJson<AirQualityResponse>(`${AIR_QUALITY_URL}?${params}`);

  const { us_aqi, pm2_5, pm10 } = data.current ?? {};
  if (!isNumber(us_aqi) || !isNumber(pm2_5) || !isNumber(pm10)) {
    throw new AirQualityUnavailableError();
  }

  const aqi = Math.round(us_aqi);
  return {
    city: place.name,
    country: place.country ?? "",
    aqi,
    pm25: roundTo(pm2_5, 1),
    pm10: roundTo(pm10, 1),
    category: getAqiCategory(aqi),
  };
}