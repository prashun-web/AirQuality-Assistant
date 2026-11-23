import { afterEach, describe, expect, it, vi } from "vitest";
import { getAirQuality } from "../lib/airQuality";
import { AirQualityUnavailableError, CityNotFoundError } from "../lib/errors";

function mockFetch(...bodies: unknown[]) {
    const fetchMock = vi.fn();
    for (const body of bodies) {
        fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(body), { status: 200 }));
    }
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
}

afterEach(() => vi.unstubAllGlobals());

describe("getAirQuality", () => {
    it("combines geocoding and air data into one result", async () => {
        mockFetch(
            { results: [{ name: "Testville", country: "India", latitude: 1.1, longitude: 2.2 }] },
            { current: { us_aqi: 160.4, pm2_5: 70.26, pm10: 90.04 } },
        );
        const air = await getAirQuality("Testville");
        expect(air).toMatchObject({ city: "Testville", aqi: 160, pm25: 70.3, category: "Unhealthy" });
    });

    it("throws CityNotFoundError when geocoding finds nothing", async () => {
        mockFetch({ results: [] });
        await expect(getAirQuality("Nowhereland")).rejects.toBeInstanceOf(CityNotFoundError);
    });

    it("throws when air values are missing", async () => {
        mockFetch(
            { results: [{ name: "Brokenville", latitude: 3.3, longitude: 4.4 }] },
            { current: { us_aqi: 100 } },
        );
        await expect(getAirQuality("Brokenville")).rejects.toBeInstanceOf(AirQualityUnavailableError);
    });
});