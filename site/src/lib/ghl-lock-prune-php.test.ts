import { afterEach, describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

/**
 * Lead-relay lock clean-up (2026-09-25). Every delivery attempt opens
 * `<record>.json.lock` beside the lead record, and nothing ever removed it, so
 * each lead left a file behind for good on a hosting plan that counts files.
 * The cron retry now prunes locks that can no longer be needed. Since
 * 2026-10-06 that includes the two locks added on 2026-10-02: each left visit's
 * `sessions/<visit>.json.delivery.lock` and the per-contact `enquiry-*.lock`,
 * and a delivered lead's lock waits while it still owes a follow-up (office
 * email, call-back task or enquiry fields). Runs the real PHP against a
 * scratch queue folder; skipped where PHP is not installed.
 */
const relay = resolve(__dirname, "..", "..", "public", "api", "ghl-quote.php");
const hasPhp = spawnSync("php", ["-r", "exit(PHP_VERSION_ID >= 80200 ? 0 : 1);"]).status === 0;

let dir = "";
afterEach(() => {
  if (dir) rmSync(dir, { recursive: true, force: true });
});

const iso = (secondsAgo: number) => new Date(Date.now() - secondsAgo * 1000).toISOString().replace(/\.\d+Z$/, "+00:00");

function lead(name: string, state: string, secondsAgo: number) {
  writeFileSync(join(dir, `${name}.json`), JSON.stringify({ state, updated_at: iso(secondsAgo) }));
  writeFileSync(join(dir, `${name}.json.lock`), "");
}

function ago(path: string, seconds: number) {
  const at = (Date.now() - seconds * 1000) / 1000;
  utimesSync(path, at, at);
}

function prune(): number {
  const script = `require ${JSON.stringify(relay)}; echo dc_ghl_prune_locks(['queue_dir' => ${JSON.stringify(dir)}]);`;
  const run = spawnSync("php", ["-r", script], { env: { ...process.env, DC_GHL_LIBRARY_ONLY: "1" }, encoding: "utf8" });
  expect(run.status, run.stderr).toBe(0);
  return Number(run.stdout.trim());
}

describe.skipIf(!hasPhp)("lead relay lock clean-up", () => {
  it("removes the locks of settled leads and keeps every lock that could still be used", () => {
    dir = mkdtempSync(join(tmpdir(), "dc-ghl-locks-"));
    lead("delivered-old", "delivered", 2 * 3600);
    lead("delivered-now", "delivered", 60);
    lead("pending-old", "pending", 30 * 86400);
    lead("failed-old", "failed", 8 * 86400);
    lead("failed-recent", "failed", 2 * 86400);
    const orphan = join(dir, "gone.json.lock");
    writeFileSync(orphan, "");
    const twoHoursAgo = (Date.now() - 2 * 3600 * 1000) / 1000;
    utimesSync(orphan, twoHoursAgo, twoHoursAgo);

    expect(prune()).toBe(3);
    const lock = (name: string) => existsSync(join(dir, `${name}.json.lock`));
    expect(lock("delivered-old")).toBe(false);
    expect(lock("failed-old")).toBe(false);
    expect(existsSync(orphan)).toBe(false);
    expect(lock("delivered-now")).toBe(true);
    expect(lock("pending-old")).toBe(true);
    expect(lock("failed-recent")).toBe(true);
    // The lead records themselves are never touched.
    for (const name of ["delivered-old", "failed-old", "pending-old"]) expect(existsSync(join(dir, `${name}.json`))).toBe(true);
  });

  it("removes a visit's delivery lock once the visit is settled or gone, never while its follow-up is retried", () => {
    dir = mkdtempSync(join(tmpdir(), "dc-ghl-locks-"));
    mkdirSync(join(dir, "sessions"));
    const visit = (name: string, state: string | null, quietFor: number, lockAge = 2 * 3600) => {
      const session = join(dir, "sessions", `${name}.json`);
      if (state !== null) {
        writeFileSync(session, JSON.stringify({ state }));
        ago(session, quietFor);
      }
      writeFileSync(`${session}.delivery.lock`, "");
      ago(`${session}.delivery.lock`, lockAge);
      return () => existsSync(`${session}.delivery.lock`);
    };
    const left = visit("left", "left", 2 * 3600);
    const gaveUp = visit("given-up", "left_failed", 2 * 3600);
    const confirmed = visit("confirmed", "confirmed", 2 * 3600);
    const expired = visit("expired", null, 0);
    const retrying = visit("retrying", "left_pending", 2 * 3600);
    const justLeft = visit("just-left", "left", 60);
    const expiredJustNow = visit("expired-just-now", null, 0, 60);

    expect(prune()).toBe(4);
    expect([left(), gaveUp(), confirmed(), expired()]).toEqual([false, false, false, false]);
    expect([retrying(), justLeft(), expiredJustNow()]).toEqual([true, true, true]);
    // The sessions themselves are the sweep's to expire.
    expect(existsSync(join(dir, "sessions", "left.json"))).toBe(true);
  });

  it("removes an enquiry lock unused for an hour, and keeps a delivered lead's lock while it still owes a follow-up", () => {
    dir = mkdtempSync(join(tmpdir(), "dc-ghl-locks-"));
    const enquiry = (name: string, unusedFor: number) => {
      const path = join(dir, `enquiry-${name}.lock`);
      writeFileSync(path, "");
      ago(path, unusedFor);
      return () => existsSync(path);
    };
    const owing = (name: string, followUp: object) => {
      writeFileSync(join(dir, `${name}.json`), JSON.stringify({ state: "delivered", updated_at: iso(2 * 3600), ...followUp }));
      writeFileSync(join(dir, `${name}.json.lock`), "");
      return () => existsSync(join(dir, `${name}.json.lock`));
    };
    const idle = enquiry("idle", 2 * 3600);
    const inUse = enquiry("in-use", 60);
    const settled = owing("settled", {
      callback_requested: true,
      callback_task: { status: "review", attempts: 6 },
      enquiry_evidence: { status: "failed", attempts: 6 },
      office_alert_pending: false,
    });
    const evidence = owing("owes-evidence", { enquiry_evidence: { status: "pending", attempts: 2, next_retry_at: Math.floor(Date.now() / 1000) + 3600 } });
    const email = owing("owes-email", { office_alert_pending: true });
    const task = owing("owes-task", { callback_requested: true, callback_task: { status: "uncertain", attempts: 3 } });

    expect(prune()).toBe(2);
    expect([idle(), settled()]).toEqual([false, false]);
    expect([inUse(), evidence(), email(), task()]).toEqual([true, true, true, true]);
  });

  it("runs from the cron retry", () => {
    const code = readFileSync(relay, "utf8");
    expect(code).toMatch(/\$locks = dc_ghl_prune_locks\(\$config\);[\s\S]{0,200}'locks_removed' => \$locks/);
  });
});
