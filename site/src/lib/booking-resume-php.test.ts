import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync, utimesSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { BOOKING_ORIGIN } from "./booking-redirect";

/**
 * The customer's own booking link (owner, 2026-09-25). The "finish booking"
 * text sent BookingKoala's bare booking page, so a customer had to start the
 * quote again. A confirmed quote now gets https://dutycleaners.ca/r/<code>,
 * which reopens that quote with the name, email and phone filled in, and never
 * the entry details, address or notes. Runs the real PHP; skipped where PHP
 * with OpenSSL is not installed.
 */
const api = resolve(__dirname, "..", "..", "public", "api");
const relay = join(api, "ghl-quote.php");
const hasPhp = spawnSync("php", ["-r", 'exit(PHP_VERSION_ID >= 80200 && function_exists("openssl_encrypt") ? 0 : 1);']).status === 0;
const secret = "local-php-integration-secret-0123456789-abcdef";
const key = "resume-test-encryption-key-0123456789-abcdef";

const dir = mkdtempSync(join(tmpdir(), "dc-resume-"));
const configPath = join(dir, "ghl-config.php");
const config = `['token' => 'test-token-0123456789-0123456789-abc', 'encryption_key' => '${key}', 'queue_dir' => ${JSON.stringify(join(dir, "queue"))}]`;
writeFileSync(configPath, `<?php return ${config};`);

const PUBLIC = "industry_id=1&form_id=1&service_id=6&frequency_id=3&pricing_parameter%5B9%5D=41&pricing_parameter%5B1%5D=2&extras%5B75%5D=1&utm_source=google";
const payload = {
  request_id: "7d0c1c52-9a4e-4c1b-8f3e-2b6f4a1d9e01",
  stage: "confirm",
  source: "dutycleaners.ca instant quote",
  full_name: "BROOKE van hayes",
  email: "brooke@example.com",
  phone: "+1 (780) 555-0199",
  booking_query: PUBLIC,
};

function php(body: string): string {
  const script = `require ${JSON.stringify(relay)}; $config = ${config}; ${body}`;
  const run = spawnSync("php", ["-r", script], { env: { ...process.env, DC_GHL_LIBRARY_ONLY: "1" }, encoding: "utf8" });
  expect(run.status, run.stderr).toBe(0);
  return run.stdout.trim();
}
const link = (input: Record<string, string>) => php(`echo dc_ghl_resume_link($config, ${phpArray(input)});`);
const phpArray = (input: Record<string, string>) =>
  `[${Object.entries(input).map(([k, v]) => `${JSON.stringify(k)} => ${JSON.stringify(v).replace(/\$/g, "\\$")}`).join(", ")}]`;

let child: ChildProcess | undefined;
let origin = "";

beforeAll(async () => {
  if (!hasPhp) return;
  const probe = createServer();
  await new Promise<void>((done) => probe.listen(0, "127.0.0.1", done));
  const address = probe.address();
  if (!address || typeof address === "string") throw new Error("no port");
  await new Promise<void>((done) => probe.close(() => done()));
  origin = `http://127.0.0.1:${address.port}`;
  child = spawn("php", ["-S", `127.0.0.1:${address.port}`, "-t", resolve(api, "..")], {
    env: { ...process.env, DC_GHL_CONFIG: configPath, DC_BOOKING_HANDOFF_SECRET: secret },
    stdio: "ignore",
  });
  for (let attempt = 0; attempt < 40; attempt++) {
    try { await fetch(`${origin}/api/resume.php`, { redirect: "manual" }); return; }
    catch { await new Promise((done) => setTimeout(done, 25)); }
  }
  throw new Error("PHP resume test server did not start");
});

afterAll(() => {
  child?.kill();
  rmSync(dir, { recursive: true, force: true });
});

describe.skipIf(!hasPhp)("booking link in the finish-booking text", () => {
  it("keeps only the booking page's public keys in the saved selections", () => {
    const sent = `${PUBLIC}&f_name=Brooke&email=brooke%40example.com&phone=7805550199&dc_notes=Lockbox%201234&dc_addr=1%20Main&evil=1`;
    const kept = php(`echo dc_ghl_booking_query(${JSON.stringify(sent)});`);
    expect(new URLSearchParams(kept).get("pricing_parameter[9]")).toBe("41");
    expect(new URLSearchParams(kept).get("extras[75]")).toBe("1");
    expect(new URLSearchParams(kept).get("utm_source")).toBe("google");
    expect(kept).not.toMatch(/f_name|email|phone|dc_notes|dc_addr|evil|1234|brooke/i);
  });

  it("gives a confirmed quote a short own-domain link, the same one on every retry", () => {
    const first = link(payload);
    expect(first).toMatch(/^https:\/\/dutycleaners\.ca\/r\/[A-Za-z0-9]{10}$/);
    expect(link(payload)).toBe(first);
    expect(link({ ...payload, request_id: "8e1d2d63-0b5f-4d2c-9f4a-3c7a5b2eaf12" })).not.toBe(first);
    // The saved file is encrypted: no contact detail in the clear.
    const files = readdirSync(join(dir, "ghl-resume"));
    const saved = files.map((file) => readFileSync(join(dir, "ghl-resume", file), "utf8")).join("\n");
    expect(saved).not.toMatch(/brooke|example\.com|555|service_id/i);
  });

  it("never gives a call-back or an unconfirmed lead a link, and an older page the bare booking page", () => {
    expect(link({ ...payload, stage: "lead" })).toBe("");
    expect(link({ ...payload, source: "dutycleaners.ca instant quote (call-back requested)" })).toBe("");
    expect(link({ ...payload, booking_query: "" })).toBe(`${BOOKING_ORIGIN}/booknow`);
  });

  it("writes the link on the contact of a confirmed quote", () => {
    const relaySource = readFileSync(relay, "utf8");
    expect(relaySource).toMatch(/\$link = dc_ghl_resume_link\(\$config, \$payload\);[\s\S]{0,300}dc_ghl_optional_field_id\(\$config, 'contact\.site_booking_link'\)[\s\S]{0,120}\$customFields\[\] = \['id' => \$linkFieldId, 'field_value' => \$link\]/);
    expect(relaySource).toMatch(/'booking_query' => dc_ghl_booking_query\(\$input\['booking_query'\] \?\? null\)/);
  });

  it("opens the quote on the booking page with only the name, email and phone sealed in", async () => {
    const code = link(payload).split("/r/")[1];
    const response = await fetch(`${origin}/api/resume.php?c=${code}`, { redirect: "manual" });
    expect(response.status).toBe(302);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("referrer-policy")).toBe("no-referrer");
    const location = new URL(response.headers.get("location") ?? "");
    expect(`${location.origin}${location.pathname}`).toBe(`${BOOKING_ORIGIN}/booknow`);
    expect(location.searchParams.get("service_id")).toBe("6");
    expect(location.searchParams.get("pricing_parameter[9]")).toBe("41");
    expect(location.search).not.toMatch(/brooke|example|555/i);
    const token = new URLSearchParams(location.hash.slice(1)).get("dc_handoff") ?? "";
    expect(token).toMatch(/^[\w-]{16}\.[\w-]{32,10000}$/);
    const unsealed = await fetch(`${origin}/api/booking-handoff.php`, {
      method: "POST",
      headers: { Origin: BOOKING_ORIGIN, "Content-Type": "application/json" },
      body: JSON.stringify({ action: "unseal", token }),
    });
    expect(await unsealed.json()).toEqual({
      fields: { f_name: "Brooke", l_name: "Van Hayes", email: "brooke@example.com", phone: "7805550199" },
    });
  });

  it("sends an unknown or expired code to the plain booking page, never an error", async () => {
    for (const code of ["AAAAAAAAAA", "../../etc", ""]) {
      const response = await fetch(`${origin}/api/resume.php?c=${encodeURIComponent(code)}`, { redirect: "manual" });
      expect(response.status).toBe(302);
      expect(response.headers.get("location")).toBe(`${BOOKING_ORIGIN}/booknow`);
    }
    const expired = { ...payload, request_id: "9f2e3e74-1c6a-4e3d-8a5b-4d8b6c3fb023" };
    const code = link(expired).split("/r/")[1];
    const path = join(dir, "ghl-resume", `${code}.json`);
    const record = JSON.parse(readFileSync(path, "utf8"));
    writeFileSync(path, JSON.stringify({ ...record, expires_at: Math.floor(Date.now() / 1000) - 60 }));
    const response = await fetch(`${origin}/api/resume.php?c=${code}`, { redirect: "manual" });
    expect(response.headers.get("location")).toBe(`${BOOKING_ORIGIN}/booknow`);
  });

  it("the cron job removes link files two days after they expire", () => {
    const old = { ...payload, request_id: "0a3f4f85-2d7b-4f4e-9b6c-5e9c7d4a0134" };
    const code = link(old).split("/r/")[1];
    const path = join(dir, "ghl-resume", `${code}.json`);
    const record = JSON.parse(readFileSync(path, "utf8"));
    const threeDaysAgo = Math.floor(Date.now() / 1000) - 3 * 86400;
    writeFileSync(path, JSON.stringify({ ...record, expires_at: threeDaysAgo }));
    utimesSync(path, threeDaysAgo, threeDaysAgo);
    const before = readdirSync(join(dir, "ghl-resume")).length;
    expect(Number(php("echo dc_ghl_prune_resume($config);"))).toBe(1);
    expect(readdirSync(join(dir, "ghl-resume"))).toHaveLength(before - 1);
    expect(readFileSync(relay, "utf8")).toMatch(/\$links = dc_ghl_prune_resume\(\$config\);[\s\S]{0,200}'links_removed' => \$links/);
  });
});

describe("booking link wiring", () => {
  it("routes /r/<code> to resume.php and points at the same booking host as the funnel", () => {
    expect(readFileSync(resolve(api, "..", ".htaccess"), "utf8")).toContain("RewriteRule ^r/([A-Za-z0-9]{10})/?$ /api/resume.php?c=$1 [L]");
    expect(readFileSync(relay, "utf8")).toContain(`const DC_GHL_BOOKING_ORIGIN = '${BOOKING_ORIGIN}';`);
  });

  it("sends the booking page's public selections with the confirmed quote, never the private fields", () => {
    const flow = readFileSync(resolve(__dirname, "..", "components", "quote", "QuoteFlow.tsx"), "utf8");
    expect(flow).toMatch(/booking_query: splitBookingQuery\(bookingQuery\)\.publicQuery/);
  });
});
