/**
 * Proves every guard by breaking what it guards.
 *
 * For each entry in guard-proofs.ts: back the target up, apply the edit, run
 * the guard (vitest on that one file, or tsc), check that it failed AND that
 * the named test is among the failures, restore the file. A guard that stays
 * green with its defect reintroduced is reported as VACUOUS, and the run
 * exits non-zero — that is the finding this script exists to produce.
 *
 * Files are always restored, including on Ctrl-C, and the run refuses to
 * start if any target is already dirty in git, so a proof can never be
 * mistaken for an edit.
 *
 *   bunx tsx scripts/prove-guards.ts             all proofs
 *   bunx tsx scripts/prove-guards.ts policy      only guards whose path matches
 *   bunx tsx scripts/prove-guards.ts --no-dist   skip proofs that need a build
 */
import { execSync, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { GUARD_PROOFS, type GuardProof } from "./guard-proofs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const skipDist = args.includes("--no-dist");
const filter = args.filter((a) => !a.startsWith("--"));

const proofs = GUARD_PROOFS.filter(
  (p) => (!skipDist || !p.dist) && (filter.length === 0 || filter.some((f) => p.guard.includes(f))),
);

// ---- safety: never run over uncommitted work in a target -------------------
const tracked = [...new Set(proofs.filter((p) => !p.dist).map((p) => p.target))];
const dirty = execSync(`git status --porcelain -- ${tracked.map((t) => `"${t}"`).join(" ")}`, {
  cwd: ROOT,
  encoding: "utf8",
}).trim();
if (dirty) {
  console.error("refusing to run: these proof targets have uncommitted changes\n" + dirty);
  process.exit(2);
}

// ---- backup / restore -------------------------------------------------------
const backups = new Map<string, string>();
const restoreAll = () => {
  for (const [file, text] of backups) writeFileSync(join(ROOT, file), text);
  backups.clear();
};
process.on("SIGINT", () => {
  restoreAll();
  process.exit(130);
});
process.on("uncaughtException", (e) => {
  restoreAll();
  throw e;
});

// ---- checks -----------------------------------------------------------------
type Outcome = { bit: boolean; detail: string };

const vitestFailures = (guard: string): { failed: string[]; passed: boolean } => {
  const dir = mkdtempSync(join(tmpdir(), "prove-"));
  const out = join(dir, "result.json");
  // One command string: node warns (DEP0190) when an args array meets shell:true.
  const r = spawnSync(`bunx vitest run "${guard}" --reporter=json --outputFile="${out}"`, {
    cwd: ROOT,
    encoding: "utf8",
    shell: true,
  });
  let failed: string[] = [];
  let passed = r.status === 0;
  if (existsSync(out)) {
    const json = JSON.parse(readFileSync(out, "utf8"));
    failed = (json.testResults ?? []).flatMap((f: { assertionResults: { status: string; title: string }[] }) =>
      f.assertionResults.filter((a) => a.status === "failed").map((a) => a.title),
    );
    passed = json.success === true;
  }
  rmSync(dir, { recursive: true, force: true });
  return { failed, passed };
};

const tscFailure = (): { output: string; passed: boolean } => {
  const r = spawnSync("bunx tsc -p tsconfig.app.json --noEmit", { cwd: ROOT, encoding: "utf8", shell: true });
  return { output: (r.stdout ?? "") + (r.stderr ?? ""), passed: r.status === 0 };
};

const prove = (p: GuardProof): Outcome => {
  const file = join(ROOT, p.target);
  if (!existsSync(file)) return { bit: false, detail: p.dist ? "no build; run prerender:all first" : "target missing" };
  const original = readFileSync(file, "utf8");
  const n = original.split(p.find).length - 1;
  if (n !== 1) return { bit: false, detail: `find string occurs ${n} times, not once` };

  backups.set(p.target, original);
  writeFileSync(file, original.replace(p.find, p.replace));
  try {
    if (p.check === "tsc") {
      const { output, passed } = tscFailure();
      if (passed) return { bit: false, detail: "tsc still passes" };
      if (!output.includes(p.failing)) return { bit: false, detail: `tsc failed, but not with "${p.failing}"` };
      return { bit: true, detail: "tsc rejects it" };
    }
    const { failed, passed } = vitestFailures(p.guard);
    if (passed) return { bit: false, detail: "guard still passes" };
    if (!failed.includes(p.failing)) {
      return { bit: false, detail: `guard failed, but not "${p.failing}" (failed: ${failed.join("; ") || "file-level error"})` };
    }
    return { bit: true, detail: `"${p.failing}"` };
  } finally {
    writeFileSync(file, original);
    backups.delete(p.target);
  }
};

// ---- run --------------------------------------------------------------------
console.log(`proving ${proofs.length} guard${proofs.length === 1 ? "" : "s"}${skipDist ? " (dist proofs skipped)" : ""}\n`);
const vacuous: string[] = [];
const started = Date.now();
for (const p of proofs) {
  const t0 = Date.now();
  const { bit, detail } = prove(p);
  const secs = ((Date.now() - t0) / 1000).toFixed(0).padStart(3);
  console.log(`${bit ? "  bites " : "VACUOUS"} ${secs}s  ${p.guard.replace(/^src\//, "")}  <-  ${p.target}  ${bit ? "" : "!! " + detail}`);
  if (!bit) vacuous.push(`${p.guard}: ${detail}`);
}

const left = execSync(`git status --porcelain -- ${tracked.map((t) => `"${t}"`).join(" ")}`, { cwd: ROOT, encoding: "utf8" }).trim();
if (left) {
  console.error("\nBUG: a target was not restored:\n" + left);
  process.exit(2);
}

console.log(`\n${proofs.length - vacuous.length} of ${proofs.length} guards bite, ${((Date.now() - started) / 1000).toFixed(0)}s, all targets restored`);
if (vacuous.length) {
  console.error(`\n${vacuous.length} guard(s) did not fail when their defect was reintroduced:\n  ` + vacuous.join("\n  "));
  process.exit(1);
}
