import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

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
