import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { contentFingerprint, revisionFor, type ContentRevisions } from "./content-revisions";

const ledgerPath = resolve("src/data/content-revisions.json");
const args = process.argv.slice(2);
const baseline = args.includes("--baseline");
const approve = args.includes("--approve");
// After a change to contentFingerprint's normalisation, every affected page
// hashes differently although nothing on it changed. --rekey stores the new
// hashes and keeps every date. Only run it against a dist that was stable
// (0 changed) before the normalisation change; it never advances a date.
const rekey = args.includes("--rekey");
if (rekey && (approve || baseline)) throw new Error("--rekey stands alone");
const date = args.find(a => /^\d{4}-\d{2}-\d{2}$/.test(a));
// A reviewed cosmetic correction can change text without warranting lastmod.
const keepAt = args.indexOf("--keep-date");
const keepDates = new Set(keepAt < 0 ? [] : (args[keepAt + 1] ?? "").split(",").filter(Boolean));
if (baseline && existsSync(ledgerPath)) throw new Error("Baseline already exists; refusing to overwrite it");
if (approve && !date) throw new Error("Use --approve YYYY-MM-DD after reviewing the content changes");
const ledger: ContentRevisions = existsSync(ledgerPath) ? JSON.parse(readFileSync(ledgerPath, "utf8")) : {};
const next = {...ledger};
const changed: string[] = [];
const staleDates: string[] = [];
const routes = new Map<string, string>();
for (const file of readdirSync(resolve("dist")).filter(f => /^sitemap-.+\.xml$/.test(f))) {
  const xml = readFileSync(resolve("dist", file), "utf8");
  for (const block of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = block[1].match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (!loc) continue;
    routes.set(new URL(loc).pathname.replace(/\/+$/, "") || "/", block[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? "");
  }
}
if (!routes.size) throw new Error("No rendered sitemap routes; build and prerender first");
for (const route of keepDates) {
  if (!approve || !ledger[route] || !routes.has(route)) throw new Error(`Invalid --keep-date route: ${route}`);
}
for (const [route, legacyDate] of routes) {
  const html = readFileSync(resolve("dist", route.slice(1), "index.html"), "utf8");
  const hash = contentFingerprint(html);
  if (!baseline && !approve && ledger[route] && legacyDate !== ledger[route].modified) staleDates.push(route);
  if (ledger[route]?.hash === hash) continue;
  changed.push(route);
  if (rekey) { next[route] = { hash, modified: ledger[route]?.modified ?? legacyDate }; continue; }
  if (baseline || approve) next[route] = revisionFor(ledger[route], hash,
    baseline ? legacyDate : keepDates.has(route) ? ledger[route].modified : date!);
}
console.log(`${changed.length}/${routes.size} pages have changed content fingerprints.`);
for (const route of changed) console.log(route);
if (baseline || approve || rekey) {
  writeFileSync(ledgerPath, JSON.stringify(Object.fromEntries(Object.entries(next).sort(([a], [b]) => a.localeCompare(b))), null, 2) + "\n");
  console.log(rekey
    ? "Revision ledger re-keyed; no date changed. Run this command without arguments to confirm 0 changed."
    : "Revision ledger saved. Rebuild and prerender to publish these dates, then run this command without arguments to check stability.");
} else if (changed.length || staleDates.length) {
  if (staleDates.length) console.error(`Rebuild required: ${staleDates.length} sitemap dates do not match the approved ledger.`);
  console.error("Review these changes, then run bun run content-dates --approve YYYY-MM-DD. Do not advance dates just for freshness.");
  process.exitCode = 1;
}
