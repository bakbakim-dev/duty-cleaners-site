import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { GUARD_PROOFS } from "../../scripts/guard-proofs";

/**
 * The cheap half of proving the guards.
 *
 * prove-guards.ts actually breaks each target and watches the guard fail; it
 * takes minutes, so it runs on demand (`bun run prove`). This runs with every
 * test and keeps the registry honest in between: every guard file has a
 * proof, every proof's edit still lands on exactly one place, and a proof
 * that would need a build says so. Without this, a refactor that renames the
 * line a proof edits would turn that proof into a silent no-op — the same
 * shape of failure the proofs exist to catch in the guards.
 */

const ROOT = join(__dirname, "..", "..");

function testFiles(dir: string, prefix: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) out.push(...testFiles(join(dir, entry.name), `${prefix}${entry.name}/`));
    else if (/\.test\.tsx?$/.test(entry.name)) out.push(`${prefix}${entry.name}`);
  }
  return out;
}

describe("every guard has a proof that it bites", () => {
  it("every test file under src has at least one registered proof", () => {
    const guards = testFiles(join(ROOT, "src"), "src/");
    expect(guards.length).toBeGreaterThan(20);
    const proven = new Set(GUARD_PROOFS.map((p) => p.guard));
    const unproven = guards.filter((g) => !proven.has(g));
    expect(
      unproven,
      "guard files with no entry in scripts/guard-proofs.ts — add the one edit that must make each fail",
    ).toEqual([]);
  });

  it("every proof points at a guard file that exists", () => {
    const missing = GUARD_PROOFS.filter((p) => !existsSync(join(ROOT, p.guard))).map((p) => p.guard);
    expect(missing, "proofs for guard files that no longer exist").toEqual([]);
  });

  it("every proof's find string occurs exactly once in its target", () => {
    const wrong: string[] = [];
    for (const p of GUARD_PROOFS) {
      const file = join(ROOT, p.target);
      if (!existsSync(file)) {
        // A dist target only exists after a build; anything else must exist.
        if (!p.dist) wrong.push(`${p.target}: missing`);
        continue;
      }
      const n = readFileSync(file, "utf8").split(p.find).length - 1;
      if (n !== 1) wrong.push(`${p.target}: "${p.find.slice(0, 50)}…" occurs ${n} times`);
    }
    expect(wrong, "a proof that cannot land is a proof of nothing").toEqual([]);
  });

  it("every proof changes something and says why", () => {
    for (const p of GUARD_PROOFS) {
      expect(p.replace, `${p.guard}: replace equals find`).not.toBe(p.find);
      expect(p.failing.length, `${p.guard}: no failing test named`).toBeGreaterThan(8);
      expect(p.why.length, `${p.guard}: no reason given`).toBeGreaterThan(20);
      expect(p.target.startsWith("dist/"), `${p.guard}: ${p.target} is under dist/ but not marked dist`).toBe(Boolean(p.dist));
    }
  });
});
