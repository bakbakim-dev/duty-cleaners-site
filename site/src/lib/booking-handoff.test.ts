import { afterEach, describe, expect, it, vi } from "vitest";
import { CLEANLINESS_OPTIONS, validateCleanerDetails, cleanerNotesLimit } from "./booking-details";
import { publicBookingUrl, prepareBookingHandoff, splitBookingQuery } from "./booking-handoff";
import { buildBookingQuery, type CleanerDetails } from "./booking-redirect";
import { PRIVATE_KEYS, seal, unseal, TTL_MS } from "../../supabase/functions/booking-handoff/crypto";
import { PRIVATE_HANDOFF_KEYS } from "./booking-handoff";
import { createHandler } from "../../supabase/functions/booking-handoff/handler";

afterEach(() => vi.unstubAllGlobals());
const details: CleanerDetails = { address: "123 Test Street", apartment: "4", city: "Edmonton", province: "AB", postalCode: "T5J 0N3", entry: "lockbox", cleanliness: 2, parking: "street", flexibility: "none", notes: "Test instructions" };
const input = { service: "standard", homeType: 55, bedrooms: 2, bathrooms: 1, halfBaths: 0, frequencyBkId: 1, cleanerDetails: details, contact: { name: "Test Person", email: "test@example.com", phone: "7805550199" } };

describe("booking handoff data contract", () => {
  it("matches native questions and requires the complete address and flexibility after price", () => {
    expect(CLEANLINESS_OPTIONS.map(row => row.label)).toEqual(["1 - Almost Spotless", "2 - Mostly Clean", "3 - Decently Clean", "4 - Needs Attention", "5- Very Dirty"]);
    expect(validateCleanerDetails(details)).toEqual({});
    expect(Object.keys(validateCleanerDetails({}))).toEqual(expect.arrayContaining(["address", "city", "province", "postalCode", "entry", "cleanliness", "parking", "flexibility"]));
    expect(validateCleanerDetails({ ...details, flexibility: "time", notes: "" })).toHaveProperty("notes");
    expect(validateCleanerDetails({ ...details, cleanliness: 8 })).toHaveProperty("cleanliness");
  });
  it("transfers every new field without changing lockbox meaning or truncating its note", () => {
    const params = new URLSearchParams(buildBookingQuery(input)!);
    expect(params.get("dc_entry")).toBe("lockbox");
    expect(params.get("dc_notes")).toBe("Entry: Key in a lockbox.\nTest instructions");
    for (const [key, value] of Object.entries({ dc_addr: details.address, dc_apt: "4", dc_city: "Edmonton", dc_prov: "AB", dc_zip: "T5J 0N3", zipcode: "T5J 0N3", dc_flex: "none" })) expect(params.get(key)).toBe(value);
    expect(validateCleanerDetails({ ...details, notes: "x".repeat(cleanerNotesLimit(details) + 1) })).toHaveProperty("notes");
  });
  it("separates all personal fields from navigation and strips arbitrary parameters", () => {
    expect(PRIVATE_HANDOFF_KEYS).toEqual(PRIVATE_KEYS);
    const query = buildBookingQuery(input)! + "&unexpected=secret&date=2026-10-01";
    const parts = splitBookingQuery(query);
    expect(parts.fields.email).toBe("test@example.com");
    expect(parts.fields.dc_addr).toBe("123 Test Street");
    const url = publicBookingUrl(query);
    expect(url).not.toMatch(/Test|Person|example|780555|T5J|dc_|zipcode|unexpected|secret|date=/);
    expect(url).toContain("service_id=6");
  });
  it("uses a bounded encrypted handoff and never falls back to a personal-data URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ token: "a".repeat(16) + "." + "b".repeat(40) }) });
    vi.stubGlobal("fetch", fetchMock);
    const result = await prepareBookingHandoff(buildBookingQuery(input)!);
    expect(result).toContain("#dc_handoff=");
    expect(result).not.toMatch(/Test|example|780555|T5J/);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).fields.dc_addr).toBe(details.address);
    fetchMock.mockResolvedValue({ ok: false });
    expect(await prepareBookingHandoff(buildBookingQuery(input)!)).toBeNull();
  });
});

describe("encrypted handoff envelope", () => {
  const secret = "unit-test-secret-not-for-deployment-0123456789";
  it("limits endpoint origins, actions, body size and traffic without granting booking access", async () => {
    const handler = createHandler(() => secret);
    const website = "https://duty-cleaners-preview.netlify.app";
    const booking = "https://dutycleaners.bookingkoala.com";
    const request = (origin: string, body: unknown, method = "POST") => new Request("https://example.com/handoff", { method, headers: { origin, "Content-Type": "application/json" }, ...(method === "POST" ? { body: JSON.stringify(body) } : {}) });
    expect((await handler(request("https://untrusted.example", {}, "OPTIONS"))).status).toBe(403);
    expect((await handler(request(website, {}, "GET"))).status).toBe(405);
    expect((await handler(request(website, {}, "OPTIONS"))).status).toBe(204);
    expect((await createHandler(() => "")(request(website, {}))).status).toBe(503);
    const fields = { dc_city: "Edmonton", dc_notes: "Test instructions" };
    const sealed = await handler(request(website, { action: "seal", fields }));
    expect(sealed.status).toBe(200);
    expect(sealed.headers.get("Access-Control-Allow-Origin")).toBe(website);
    expect(sealed.headers.get("Cache-Control")).toBe("no-store");
    const { token } = await sealed.json();
    expect((await handler(request(website, { action: "unseal", token }))).status).toBe(400);
    expect((await handler(request(booking, { action: "seal", fields }))).status).toBe(400);
    expect(await (await handler(request(booking, { action: "unseal", token }))).json()).toEqual({ fields });
    expect((await handler(request(website, { action: "book", fields }))).status).toBe(400);
    expect((await handler(request(website, { action: "seal", fields: { card_number: "test" } }))).status).toBe(400);
    expect((await handler(request(website, { action: "seal", fields: { dc_notes: "x".repeat(17000) } }))).status).toBe(413);
    const rateLimited = createHandler(() => secret);
    for (let i = 0; i < 30; i++) await rateLimited(request(website, { action: "invalid" }));
    expect((await rateLimited(request(website, { action: "seal", fields }))).status).toBe(429);
  });
  it("round trips without plaintext and rejects tampering, expiry, wrong keys and foreign fields", async () => {
    const fields = splitBookingQuery(buildBookingQuery(input)!).fields;
    const token = await seal(fields, secret, 1000);
    expect(token).not.toContain("123 Test Street");
    expect(token).not.toContain("test@example.com");
    expect(await unseal(token, secret, 2000)).toEqual(fields);
    await expect(unseal(token, secret, 1000 + TTL_MS)).rejects.toThrow();
    await expect(unseal(token, secret + "wrong", 2000)).rejects.toThrow();
    await expect(unseal(token.slice(0, 20) + (token[20] === "a" ? "b" : "a") + token.slice(21), secret, 2000)).rejects.toThrow();
    await expect(seal({ card_number: "test" }, secret)).rejects.toThrow();
    await expect(seal({ dc_notes: "x".repeat(501) }, secret)).rejects.toThrow();
    await expect(seal(fields, "short")).rejects.toThrow();
    expect(await seal(fields, secret, 1000)).not.toEqual(token);
  });
});

describe("all supported property and frequency combinations", () => {
  it("preserves every mapped room, home and frequency selection", () => {
    const homes: Record<number, number> = { 90: 90, 89: 89, 54: 54, 56: 56, 55: 55 };
    const frequencies: Record<number, number> = { 1: 1, 2: 3, 4: 4, 3: 64 };
    for (const service of ["standard", "move-in-out"]) {
      const move = service === "move-in-out";
      const beds = move ? [74,75,76,77,78,79,80] : [87,81,82,83,84,85,86];
      const baths = move ? [39,40,41,42,43,44] : [88,9,11,13,15,17,19];
      const halves = move ? [58,45,46,47,48] : [51,8,10,12,16];
      for (const homeType of Object.keys(homes).map(Number)) for (let bedrooms = 1; bedrooms <= 7; bedrooms++) for (let bathrooms = 1; bathrooms <= baths.length; bathrooms++) for (let halfBaths = 0; halfBaths < 5; halfBaths++) for (const frequencyBkId of Object.keys(frequencies).map(Number)) {
        const query = new URLSearchParams(buildBookingQuery({ ...input, service, homeType, bedrooms, bathrooms, halfBaths, frequencyBkId })!);
        expect(query.get("service_id")).toBe(move ? "2" : "6");
        expect(query.get("frequency_id")).toBe(String(move ? 1 : frequencies[frequencyBkId]));
        expect(query.get("pricing_parameter[9]")).toBe(String(homes[homeType]));
        expect(query.get(`pricing_parameter[${move ? 5 : 1}]`)).toBe(String(beds[bedrooms - 1]));
        expect(query.get(`pricing_parameter[${move ? 6 : 2}]`)).toBe(String(baths[bathrooms - 1]));
        expect(query.get(`pricing_parameter[${move ? 7 : 8}]`)).toBe(String(halves[halfBaths]));
      }
    }
  });
});
