import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const website = "https://mikaily131.sg-host.com";
const secret = "local-health-integration-secret-0123456789-abcdef";
const hasPhp = spawnSync("php", ["-r", "exit(PHP_VERSION_ID >= 80200 ? 0 : 1);"]).status === 0;
let child: ChildProcess;
let endpoint = "";
let scratch = "";

const request = (body?: unknown, options: { origin?: string; secret?: string; method?: string } = {}) =>
  fetch(endpoint, {
    method: options.method ?? (body ? "POST" : "GET"),
    headers: {
      ...(options.origin ? { Origin: options.origin } : {}),
      ...(options.secret ? { "X-Form-Health-Secret": options.secret } : {}),
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

beforeAll(async () => {
  if (!hasPhp) return;
  scratch = mkdtempSync(join(tmpdir(), "dc-form-health-"));
  const config = join(scratch, "config.php");
  writeFileSync(config, `<?php return [
    'recipients' => ['support@dutycleaners.ca'],
    'from' => 'website-alerts@dutycleaners.ca',
    'shared_secret' => '${secret}',
    'cooldown_seconds' => 300,
    'email_enabled' => false,
    'log_dir' => ${JSON.stringify(scratch)},
  ];`);
  const probe = createServer();
  await new Promise<void>((done) => probe.listen(0, "127.0.0.1", done));
  const address = probe.address();
  if (!address || typeof address === "string") throw new Error("Could not allocate PHP test port");
  await new Promise<void>((done) => probe.close(() => done()));
  endpoint = `http://127.0.0.1:${address.port}/api/form-health.php`;
  child = spawn("php", ["-S", `127.0.0.1:${address.port}`, "-t", resolve("public")], {
    env: { ...process.env, DC_FORM_HEALTH_CONFIG: config },
    stdio: "ignore",
  });
  for (let attempt = 0; attempt < 30; attempt++) {
    try { await request(); return; }
    catch { await new Promise(done => setTimeout(done, 25)); }
  }
  throw new Error("PHP form-health test server did not start");
});

afterAll(() => {
  child?.kill();
  if (scratch) rmSync(scratch, { recursive: true, force: true });
});

describe.skipIf(!hasPhp)("SiteGround PHP form health endpoint", () => {
  const failure = {
    event: "failed",
    form: "contact-form",
    stage: "form-submit",
    category: "http",
    status: 503,
    path: "/contact-us/",
  };

  it("has a public no-data health check", async () => {
    expect(await (await request()).json()).toEqual({ ok: true, service: "form-health", version: 1, alerts_enabled: false });
  });

  it("records browser failures, deduplicates alerts and records recovery", async () => {
    const first = await request(failure, { origin: website });
    expect(first.status).toBe(200);
    expect(await first.json()).toMatchObject({ ok: true, recorded: true, notification_due: true });
    expect(await (await request(failure, { origin: website })).json()).toMatchObject({ notification_due: false });
    expect(await (await request({ ...failure, event: "recovered" }, { origin: website })).json()).toMatchObject({ notification_due: true });
    const lines = readFileSync(join(scratch, "events.jsonl"), "utf8").trim().split("\n").map((line) => JSON.parse(line));
    expect(lines).toHaveLength(3);
    expect(lines[0]).not.toHaveProperty("email");
    expect(lines[0]).not.toHaveProperty("phone");
    expect(lines[0]).not.toHaveProperty("message");
  });

  it("accepts authenticated server reports and rejects foreign browsers or extra data", async () => {
    expect((await request({ ...failure, form: "quote-funnel", stage: "ghl-delivery" }, { secret })).status).toBe(200);
    expect((await request(failure, { origin: "https://attacker.example" })).status).toBe(403);
    expect((await request({ ...failure, email: "customer@example.com" }, { origin: website })).status).toBe(400);
    expect((await request({ ...failure, path: "/contact-us/?email=customer@example.com" }, { origin: website })).status).toBe(400);
  });
});
