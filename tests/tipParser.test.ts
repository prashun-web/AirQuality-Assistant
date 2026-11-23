import { describe, expect, it } from "vitest";
import { LlmResponseError } from "../lib/errors";
import { parseTips } from "../lib/tipParser";

const tip = (type: string, title = "Title") => ({ title, why: "Because.", type });

describe("parseTips", () => {
  const threeTips = [
    tip("use_air_purifier", "A"),
    tip("wear_n95_outdoors", "B"),
    tip("no_waste_or_biomass_burning", "C"),
  ];

  it("parses valid JSON", () => {
    expect(parseTips(JSON.stringify(threeTips))).toHaveLength(3);
  });

  it("handles markdown code fences", () => {
    const fenced = "```json\n" + JSON.stringify(threeTips) + "\n```";
    expect(parseTips(fenced)).toHaveLength(3);
  });

  it("drops invalid types and duplicates", () => {
    const raw = JSON.stringify([...threeTips, tip("fake_type"), tip("use_air_purifier", "Dup")]);
    expect(parseTips(raw)).toHaveLength(3);
  });

  it("drops types that are not allowed for this profile", () => {
    const raw = JSON.stringify(threeTips);
    const allowed = ["wear_n95_outdoors", "no_waste_or_biomass_burning"] as const;
    expect(() => parseTips(raw, allowed)).toThrow(LlmResponseError);
  });

  it("throws on malformed JSON or too few tips", () => {
    expect(() => parseTips("not json")).toThrow(LlmResponseError);
    expect(() => parseTips(JSON.stringify([tip("use_air_purifier")]))).toThrow(LlmResponseError);
  });
});
