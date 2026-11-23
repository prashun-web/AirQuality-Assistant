import { describe, expect, it } from "vitest";
import { POST } from "../app/api/advice/route";

const post = (body: string) =>
    POST(new Request("http://localhost/api/advice", { method: "POST", body }));

describe("POST /api/advice", () => {
    it("rejects invalid JSON with 400", async () => {
        expect((await post("not json")).status).toBe(400);
    });

    it("rejects a missing city with 400", async () => {
        expect((await post(JSON.stringify({ hasChildren: true }))).status).toBe(400);
    });

    it("rejects oversized bodies with 400", async () => {
        expect((await post("x".repeat(3_000))).status).toBe(400);
    });
});