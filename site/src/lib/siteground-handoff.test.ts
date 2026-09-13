import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { readFileSync } from "node:fs";
import { createServer } from "node:net";
import { resolve } from "node:path";

const website = "https://mikaily131.sg-host.com";
const booking = "https://dutycleaners.bookingkoala.com";
const secret = "local-php-integration-secret-0123456789-abcdef";
let child: ChildProcess;
let endpoint = "";
const hasPhpCrypto = spawnSync("php", ["-r", 'exit(function_exists("openssl_encrypt") ? 0 : 1);']).status === 0;

it("keeps the SiteGround endpoint origin-bound, expiring and self-hosted", () => {
  const source = readFileSync(resolve("public/api/booking-handoff.php"), "utf8");
  expect(source).toContain("if (!$isWebsite && !$isBooking) {");
  expect(source).toContain("$payload['expires'] <= $now");
  expect(source).toContain("openssl_encrypt($payload, 'aes-256-gcm'");
  expect(source).toContain("dirname((string) ($_SERVER['DOCUMENT_ROOT'] ?? __DIR__)) . '/private/booking-handoff-secret.php'");
  expect(source).not.toMatch(/supabase|card_number|REQUEST_URI/);
});

const request = (origin: string, body: unknown, method = "POST") => fetch(endpoint, {
  method,
  headers: { Origin: origin, "Content-Type": "application/json" },
  ...(method === "POST" ? { body: JSON.stringify(body) } : {}),
});

beforeAll(async () => {
  if (!hasPhpCrypto) return;
  const probe = createServer();
  await new Promise<void>((done) => probe.listen(0, "127.0.0.1", done));
  const address = probe.address();
  if (!address || typeof address === "string") throw new Error("Could not allocate PHP test port");
  await new Promise<void>((done) => probe.close(() => done()));
  endpoint = `http://127.0.0.1:${address.port}/api/booking-handoff.php`;
  child = spawn("php", ["-S", `127.0.0.1:${address.port}`, "-t", resolve("public")], {
    env: { ...process.env, DC_BOOKING_HANDOFF_SECRET: secret },
    stdio: "ignore",
  });
  for (let attempt = 0; attempt < 30; attempt++) {
    try { await request(website, {}, "OPTIONS"); return; }
    catch { await new Promise(done => setTimeout(done, 25)); }
  }
  throw new Error("PHP handoff test server did not start");
});

afterAll(() => child?.kill());

describe.skipIf(!hasPhpCrypto)("SiteGround PHP booking handoff", () => {
  it("round trips authenticated ciphertext only between the two allowed origins", async () => {
    const fields = { dc_addr: "123 Test Street", dc_city: "Edmonton", email: "test@example.com" };
    const sealed = await request(website, { action: "seal", fields });
    expect(sealed.status).toBe(200);
    expect(sealed.headers.get("access-control-allow-origin")).toBe(website);
    expect(sealed.headers.get("cache-control")).toBe("no-store");
    const { token } = await sealed.json();
    expect(token).toMatch(/^[\w-]{16}\.[\w-]{32,10000}$/);
    expect(token).not.toContain(fields.dc_addr);
    expect(token).not.toContain(fields.email);
    expect((await request(website, { action: "unseal", token })).status).toBe(400);
    expect((await request(booking, { action: "seal", fields })).status).toBe(400);
    expect(await (await request(booking, { action: "unseal", token })).json()).toEqual({ fields });
    const tampered = token.slice(0, -1) + (token.endsWith("a") ? "b" : "a");
    expect((await request(booking, { action: "unseal", token: tampered })).status).toBe(400);
  });

  it("rejects foreign origins, actions, fields and oversized input", async () => {
    expect((await request("https://untrusted.example", {}, "OPTIONS")).status).toBe(403);
    expect((await request(website, {}, "GET")).status).toBe(405);
    expect((await request(website, { action: "book", fields: { dc_city: "Edmonton" } })).status).toBe(400);
    expect((await request(website, { action: "seal", fields: { card_number: "test" } })).status).toBe(400);
    expect((await request(website, { action: "seal", fields: { dc_notes: "x".repeat(17000) } })).status).toBe(413);
  });
});
