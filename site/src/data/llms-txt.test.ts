import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
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

  it("every page link is trailing-slash canonical", () => {
    // File paths are exempt: /llms-full.txt is a file, and a trailing slash on
    // it is a hard 404 — which is exactly the bug this suite once passed.
    const isFile = (l: string) => /\.[a-z0-9]{2,4}$/i.test(l.split("?")[0]);
    const bare = links.filter((l) => !l.endsWith("/") && !isFile(l));
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

/**
 * The blind spot this closes: the checks above verify a link is trailing-slash
 * canonical and does not hit a 301 — and both passed a hard 404
 * (`/llms-full.txt/`, a trailing slash on a file path) and a soft duplicate
 * (`/gift-cards/`, which 200-rewrites to the SPA shell while the real page is
 * `/gift-card/`). Passing those two is exactly the failure this file exists to
 * prevent, so it now asserts the target is a thing that actually exists.
 */
describe("llms.txt links point at real destinations", () => {
  const DIST = join(ROOT, "dist");

  it("every link resolves to a built page or a real file", () => {
    if (!existsSync(DIST)) return; // nothing to check before a build
    const missing: string[] = [];
    for (const link of links) {
      const clean = link.split("?")[0];
      const asFile = join(DIST, clean.replace(/^\//, ""));
      const asPage = join(DIST, clean.replace(/^\//, ""), "index.html");
      if (!existsSync(asFile) && !existsSync(asPage)) missing.push(link);
    }
    expect(missing, `llms.txt links with no destination in dist: ${missing.join(", ")}`).toEqual([]);
  });

  it("never puts a trailing slash on a file path", () => {
    // /llms-full.txt/ is a hard 404 in production. It is NOT caught by an
    // existsSync check, because the local filesystem happily resolves the file
    // through the trailing slash — so this needs asserting directly.
    const bad = links.filter((l) => l.endsWith("/") && /\.[a-z0-9]{2,4}\/$/i.test(l));
    expect(bad, `file paths with a trailing slash 404 in production: ${bad.join(", ")}`).toEqual([]);
  });

  it("never links a path that 200-rewrites to the SPA shell", () => {
    // These resolve, so an existence check alone would pass them — but they
    // serve the shell, not the page the link claims to point at.
    const shellRewrites = new Set<string>();
    for (const line of redirectsRaw.split("\n")) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 3 && parts[2] === "200" && /spa-shell|index\.html/.test(parts[1])) {
        shellRewrites.add(parts[0].replace(/\/$/, "") || "/");
      }
    }
    const bad = links.filter((l) => shellRewrites.has(l.replace(/\/$/, "") || "/"));
    expect(bad, `llms.txt links at SPA-shell rewrites: ${bad.join(", ")}`).toEqual([]);
  });
});
