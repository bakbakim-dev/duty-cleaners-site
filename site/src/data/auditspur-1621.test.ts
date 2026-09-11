import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

/**
 * The real finding of the second AuditSpur scan of the preview (2026-09-11, 16:21):
 * 17 pages published a LocalBusiness that never said when it answers.
 *
 * Four builders emit that node — location-schema.ts, service-schema.ts, pricing-schema.ts
 * and ServiceDetailPage.tsx — plus a handful of hand-written ones on the hubs, the two
 * move-out pages and march-out. Only the first carried hours, so whichever builder happened
 * to own a page decided whether its business had opening hours at all. On wall washing,
 * post-construction and march-out the nested provider is the ONLY LocalBusiness on the page,
 * so there was nothing else to fall back on.
 *
 * The scan's other findings are deliberately not guarded here:
 *  - "missing geo" on 173 nodes: the coordinates belong on areaServed, not on a business
 *    whose address is an office in another town. location-geo.test.ts guards that placement.
 *  - "generic LocalBusiness type": schema.org has no house-cleaning subtype, and
 *    money-page-seo.test.ts requires the exact string.
 *  - "no embedded map": the maps are Leaflet, rendered client-side and deferred below the
 *    fold on purpose; area-template-0911.test.ts forbids a Google Maps iframe.
 *  - the noindex, cross-domain canonicals and the toolbar are the preview, not the site.
 */
const SITE = join(__dirname, "..", "..");
const DIST = join(SITE, "dist");
const src = (rel: string) => readFileSync(join(SITE, "src", rel), "utf-8");

function builtPages(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) builtPages(p, out);
    else if (name === "index.html") out.push(p);
  }
  return out;
}

type Node = Record<string, unknown>;

/** Every LocalBusiness in the graph, at any depth — most of them sit under `provider`. */
function localBusinesses(value: unknown, acc: Node[] = []): Node[] {
  if (Array.isArray(value)) {
    value.forEach((v) => localBusinesses(v, acc));
  } else if (value && typeof value === "object") {
    const node = value as Node;
    const type = node["@type"];
    if ((Array.isArray(type) ? type : [type]).includes("LocalBusiness")) acc.push(node);
    Object.values(node).forEach((v) => localBusinesses(v, acc));
  }
  return acc;
}

/** Source files that may carry schema, tests excluded. */
function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) sourceFiles(p, out);
    else if (/\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name)) out.push(p);
  }
  return out;
}

describe("AuditSpur findings of 2026-09-11 16:21 stay fixed", () => {
  it("every LocalBusiness the site publishes says when it is open", () => {
    if (!existsSync(DIST)) return;
    const offenders: string[] = [];
    let seen = 0;
    for (const file of builtPages(DIST)) {
      const html = readFileSync(file, "utf-8");
      const page = relative(DIST, file).replace(/\\/g, "/");
      for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
        let graph: unknown;
        try {
          graph = JSON.parse(m[1]);
        } catch {
          continue;
        }
        for (const node of localBusinesses(graph)) {
          seen++;
          if (!node.openingHoursSpecification) offenders.push(`${page}: ${String(node["@id"] ?? node.name)}`);
        }
      }
    }
    // An empty dist would otherwise pass this silently.
    expect(seen, "LocalBusiness nodes found in dist").toBeGreaterThan(100);
    expect(
      [...new Set(offenders)],
      `A LocalBusiness with no opening hours:\n${[...new Set(offenders)].join("\n")}\n` +
        `21 nodes shipped without them until 2026-09-11. Every builder reads ` +
        `openingHoursSpecFor() from data/proof.ts — add it there, not as a literal.`,
    ).toEqual([]);
  });

  it("the office hours and address are read from proof.ts, never retyped", () => {
    // Four pages had typed the same two runs of hours by hand, and two had retyped the
    // Edmonton street address. Every one was right on the day it was typed, which is what
    // makes them dangerous: nothing fails when the office moves or changes its hours, the
    // site simply goes on publishing the old ones.
    // proof.ts is where the hours and the office address are declared, once. It is the one
    // file allowed to write them down; every other file reads them through a helper.
    const AUTHORITY = join(SITE, "src", "data", "proof.ts");
    const retyped = sourceFiles(join(SITE, "src"))
      .filter((f) => f !== AUTHORITY)
      .filter((f) => /openingHours:\s*\[|streetAddress: "18615 71 Ave NW"/.test(readFileSync(f, "utf-8")))
      .map((f) => relative(SITE, f).replace(/\\/g, "/"));
    expect(
      retyped,
      `Hours or an office address typed by hand:\n${retyped.join("\n")}\n` +
        `Read them from data/proof.ts: openingHoursShortFor(), openingHoursSpecFor(), schemaAddressFor().`,
    ).toEqual([]);

    // And the builders that had no hours at all now read them.
    for (const rel of ["lib/service-schema.ts", "lib/pricing-schema.ts", "components/ServiceDetailPage.tsx"]) {
      expect(src(rel), `${rel} publishes the branch hours`).toMatch(/openingHoursSpecification: openingHoursSpecFor\(/);
    }
  });
});
