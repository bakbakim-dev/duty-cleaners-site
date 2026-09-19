import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { BUSINESS_TRADE_TYPE } from "./proof";

/**
 * schema.org has no house-cleaning subtype of LocalBusiness, so every business
 * node names the trade with additionalType (BUSINESS_TRADE_TYPE, proof.ts).
 * AuditSpur flagged 188 pages for a bare LocalBusiness on 2026-09-18. A new
 * builder that forgets the line, or index.html drifting from the constant,
 * puts the finding back.
 */
const ROOT = join(__dirname, "..", "..");
const SRC = join(ROOT, "src");
const DIST = join(ROOT, "dist");

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) return files(p);
    return /\.(ts|tsx)$/.test(n) && !/\.test\./.test(n) ? [p] : [];
  });
}

describe("every LocalBusiness node names the trade", () => {
  it("each source builder follows its LocalBusiness type with additionalType", () => {
    const bare: string[] = [];
    for (const f of files(SRC)) {
      const text = readFileSync(f, "utf-8");
      for (const m of text.matchAll(/"@type": "LocalBusiness",\r?\n([^\n]*)/g)) {
        if (!/additionalType: BUSINESS_TRADE_TYPE,/.test(m[1])) bare.push(f.slice(SRC.length + 1));
      }
    }
    expect(bare, "a LocalBusiness node with no additionalType").toEqual([]);
    // The three branch entries in index.html are pointers to the full records, and a
    // pointer carries only @id, @type, name and url. An extra key (additionalType was
    // tried) turns all three into incomplete businesses on every page.
    const index = readFileSync(join(ROOT, "index.html"), "utf-8");
    const refs = [...index.matchAll(/\{[^{}]*"@type": "LocalBusiness"[^{}]*\}/g)].map((m) => JSON.parse(m[0]));
    expect(refs.length, "index.html lost its branch references").toBe(3);
    for (const r of refs) expect(Object.keys(r).sort(), "index.html branch reference is no longer a pointer").toEqual(["@id", "@type", "name", "url"]);
  });

  it("no built page ships a LocalBusiness node without it", () => {
    if (!existsSync(DIST)) return;
    const bare: string[] = [];
    const walk = (dir: string) => {
      for (const n of readdirSync(dir)) {
        const p = join(dir, n);
        if (statSync(p).isDirectory()) walk(p);
        else if (n === "index.html") {
          const html = readFileSync(p, "utf-8");
          for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
            let data: unknown;
            try { data = JSON.parse(m[1]); } catch { continue; }
            const visit = (x: unknown) => {
              if (Array.isArray(x)) return x.forEach(visit);
              if (!x || typeof x !== "object") return;
              const o = x as Record<string, unknown>;
              const types = ([] as unknown[]).concat(o["@type"] ?? []);
              const pointer = Object.keys(o).every((k) => ["@id", "@type", "@context", "name", "url"].includes(k));
              if (types.includes("LocalBusiness") && !pointer && o.additionalType !== BUSINESS_TRADE_TYPE) bare.push(p.slice(DIST.length + 1));
              Object.values(o).forEach(visit);
            };
            visit(data);
          }
        }
      }
    };
    walk(DIST);
    expect([...new Set(bare)].slice(0, 10), "built pages with a bare LocalBusiness").toEqual([]);
  });
});
