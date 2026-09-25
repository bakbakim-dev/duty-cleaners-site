import { afterEach, describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

/**
 * Lead-relay lock clean-up (2026-09-25). Every delivery attempt opens
 * `<record>.json.lock` beside the lead record, and nothing ever removed it, so
 * each lead left a file behind for good on a hosting plan that counts files.
 * The cron retry now prunes locks that can no longer be needed. Runs the real
 * PHP against a scratch queue folder; skipped where PHP is not installed.
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

  it("runs from the cron retry", () => {
    const code = readFileSync(relay, "utf8");
    expect(code).toMatch(/\$locks = dc_ghl_prune_locks\(\$config\);[\s\S]{0,200}'locks_removed' => \$locks/);
  });
});
