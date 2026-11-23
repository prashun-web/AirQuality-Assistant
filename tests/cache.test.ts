import { afterEach, describe, expect, it, vi } from "vitest";
import { TtlCache } from "../lib/cache";

afterEach(() => vi.useRealTimers());

describe("TtlCache", () => {
    it("returns a stored value before it expires", () => {
        const cache = new TtlCache<string>(1_000);
        cache.set("a", "value");
        expect(cache.get("a")).toBe("value");
    });

    it("drops a value after its time to live", () => {
        vi.useFakeTimers();
        const cache = new TtlCache<string>(1_000);
        cache.set("a", "value");
        vi.advanceTimersByTime(1_001);
        expect(cache.get("a")).toBeUndefined();
    });

    it("evicts the oldest entry when full", () => {
        const cache = new TtlCache<number>(1_000, 2);
        cache.set("a", 1);
        cache.set("b", 2);
        cache.set("c", 3);
        expect(cache.get("a")).toBeUndefined();
        expect(cache.get("c")).toBe(3);
    });
});