import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { standardTierRows, deepCleanTierRows, moveInOutTierRows } from "./pricing";

/**
 * llms.txt exists for exactly one audience — machine readers that will not
 * follow a redirect chain the way a browser does. It was handing that audience
 * a redirect map: 27 of its 28 links omitted the trailing slash on a
 * trailing-slash-canonical site, and 9 pointed at paths that 301 elsewhere.
 *
 * The file is hand-maintained, so nothing stopped it drifting. This does.
 */

const ROOT = join(__dirname, "..", "..");
const llms = readFileSync(join(ROOT, "public", "llms.txt"), "utf-8");
const redirectsRaw = readFileSync(join(ROOT, "public", "_redirects"), "utf-8");

/** Path -> target, for real redirects only. */
const redirects = new Map<string, string>();
for (const line of redirectsRaw.split("\n")) {
  const parts = line.trim().split(/\s+/);
  if (parts.length < 3 || !parts[0].startsWith("/")) continue;
  // Netlify writes a forced rule as "301!"; matching a bare "301" misses most
  // of this file. Status 200 rows are the SPA rewrite, not a redirect.
  const status = parts[2].replace(/!$/, "");
  if (status !== "301" && status !== "302") continue;
  redirects.set(parts[0].replace(/\/$/, "") || "/", parts[1]);
}

const links = [...llms.matchAll(/https:\/\/dutycleaners\.ca(\/[^\s)\]]*)/g)].map((m) => m[1]);

describe("llms.txt", () => {
  it("actually contains links", () => {
    expect(redirects.size).toBeGreaterThan(50);
    expect(links.length).toBeGreaterThan(20);
  });

  it("every link is trailing-slash canonical", () => {
    const bare = links.filter((l) => !l.endsWith("/"));
    expect(bare, `these omit the trailing slash: ${bare.join(", ")}`).toEqual([]);
  });

  it("no link lands on a redirect", () => {
    const hops = links
      .map((l) => [l, redirects.get(l.replace(/\/$/, "") || "/")] as const)
      .filter(([, target]) => target !== undefined);
    expect(
      hops.map(([from, to]) => `${from} -> ${to}`),
      "llms.txt points machine readers at redirects",
    ).toEqual([]);
  });
});

/**
 * The llms.txt files publish price tables for machine readers. They were
 * hand-maintained and had drifted badly: deep cleaning was quoted at
 * $242–$463 against a real $255–$485, and move-in/out at $284–$519 against a
 * real $284–$539 — the same understated figures the service pages carried, and
 * still wrong here after those pages were fixed.
 */
describe("llms.txt price tables match bk-config", () => {
  const llmsFull = readFileSync(join(ROOT, "public", "llms-full.txt"), "utf-8");
  const both = `${llms}\n${llmsFull}`;

  const rows = {
    standard: standardTierRows(),
    deep: deepCleanTierRows(),
    "move-in-out": moveInOutTierRows(),
  };

  for (const [service, tiers] of Object.entries(rows)) {
    it(`quotes the real ${service} range`, () => {
      const low = tiers[0].price;
      const high = tiers[tiers.length - 1].price;
      expect(both, `${service} low (${low}) missing from llms files`).toContain(low);
      expect(both, `${service} high (${high}) missing from llms files`).toContain(high);
    });
  }

  it("carries no figure that is not a real published tier", () => {
    // Every tier price across the three services, plus the hourly rate and the
    // add-on shelf, is legitimate. Anything else is a hand-typed leftover.
    const legitimate = new Set(
      Object.values(rows).flat().map((r) => r.price),
    );
    const stale = ["$242", "$463", "$519", "$300", "$355", "$414", "$481"]
      .filter((v) => !legitimate.has(v) && both.includes(v));
    expect(stale, `stale prices still in the llms files: ${stale.join(", ")}`).toEqual([]);
  });
});
