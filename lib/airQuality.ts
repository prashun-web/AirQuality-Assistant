// ---------------------------------------------------------------------------
// lib/airQuality.ts: geocodes a city and fetches its current air quality.
// Uses the free Open-Meteo APIs (no API key needed).
// ---------------------------------------------------------------------------

import { TtlCache } from "./cache";
import { AirQualityUnavailableError, CityNotFoundError } from "./errors";
import { fetchJsonWithTimeout } from "./http";
import type { AirQuality, AqiCategory } from "./types";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";
const REQUEST_TIMEOUT_MS = 8_000;

const GEOCODE_TTL_MS = 24 * 60 * 60 * 1000; // city locations do not move
const AIR_TTL_MS = 10 * 60 * 1000; // upstream data updates about hourly

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

type Place = NonNullable<GeocodingResponse["results"]>[number];

// Caches live per server instance; only successful lookups are stored.
const placeCache = new TtlCache<Place>(GEOCODE_TTL_MS);
const airCache = new TtlCache<AirQuality>(AIR_TTL_MS);

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

// Any upstream failure becomes one friendly, user-safe error.
async function fetchJson<T>(url: string): Promise<T> {
  try {
    return await fetchJsonWithTimeout<T>(url, {}, REQUEST_TIMEOUT_MS);
  } catch {
    throw new AirQualityUnavailableError();
  }
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

const roundTo = (value: number, decimals: number): number => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

async function geocodeCity(city: string): Promise<Place> {
  const cacheKey = city.toLowerCase();
  const cached = placeCache.get(cacheKey);
  if (cached) return cached;

  const params = new URLSearchParams({
    name: city,
    count: "1",
    language: "en",
    format: "json",
  });
  const data = await fetchJson<GeocodingResponse>(`${GEOCODING_URL}?${params}`);

  const place = data.results?.[0];
  if (!place) throw new CityNotFoundError();

  placeCache.set(cacheKey, place);
  return place;
}

async function fetchCurrentAir(place: Place): Promise<AirQuality> {
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

export async function getAirQuality(city: string): Promise<AirQuality> {
  const place = await geocodeCity(city);
  const cacheKey = `${place.latitude},${place.longitude}`;

  const cached = airCache.get(cacheKey);
  if (cached) return cached;

  const air = await fetchCurrentAir(place);
  airCache.set(cacheKey, air);
  return air;
}