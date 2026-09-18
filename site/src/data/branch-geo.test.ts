/**
 * The branch entity has one location wherever it is referenced.
 *
 * AuditSpur scan 1131 (2026-09-17, 211 of 211 pages): 185 pages published the
 * branch LocalBusiness with no `geo`, and the march-out page's hand-built
 * provider had drifted from the shared builders — no price band, image or
 * profiles either. The office pin now comes from one authority
 * (branchGeoFor in data/proof.ts) on every provider node, matching the
 * address beside it. location-geo.test.ts holds the other half of the line:
 * the served place's pin stays on areaServed and never lands on a business.
 */
import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { BRANCH_ID, CITY_PROOF, type Branch } from "./proof";

const ROOT = join(__dirname, "..", "..");
const DIST = join(ROOT, "dist");

type Node = Record<string, unknown>;

function builtPages(): string[] {
  if (!existsSync(DIST)) return [];
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (entry === "index.html") out.push(full);
    }
  };
  walk(DIST);
  return out;
}

function nodesIn(value: unknown, out: Node[] = []): Node[] {
  if (Array.isArray(value)) {
    for (const item of value) nodesIn(item, out);
    return out;
  }
  if (value && typeof value === "object") {
    const record = value as Node;
    if (record["@type"]) out.push(record);
    for (const child of Object.values(record)) nodesIn(child, out);
  }
  return out;
}

function branchNodes(html: string): Node[] {
  const nodes: Node[] = [];
  for (const block of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      nodesIn(JSON.parse(block[1]), nodes);
    } catch {
      continue;
    }
  }
  const ids = new Set<string>(Object.values(BRANCH_ID));
  return nodes.filter((n) => typeof n["@id"] === "string" && ids.has(n["@id"] as string) && n.address);
}

const rel = (p: string) => p.slice(DIST.length).replace(/\\/g, "/").replace(/\/index\.html$/, "/") || "/";

describe("the branch entity carries its office pin wherever it is referenced", () => {
  it("every branch node with an address carries that branch's office pin", () => {
    const pages = builtPages();
    if (!pages.length) return; // unbuilt tree
    const wrong: string[] = [];
    let seen = 0;
    for (const page of pages) {
      for (const node of branchNodes(readFileSync(page, "utf-8"))) {
        seen++;
        const branch = (Object.keys(BRANCH_ID) as Branch[]).find((b) => BRANCH_ID[b] === node["@id"])!;
        const office = CITY_PROOF[branch].geo;
        const pin = node.geo as Node | undefined;
        if (!pin || pin.latitude !== office.latitude || pin.longitude !== office.longitude || pin["@type"] !== "GeoCoordinates") {
          wrong.push(`${rel(page)} ${branch}: ${pin ? `${pin.latitude},${pin.longitude}` : "no geo"}`);
        }
      }
    }
    expect(seen, "no branch node with an address was found in the build").toBeGreaterThan(150);
    expect(wrong, "branch nodes without their office pin, or with someone else's").toEqual([]);
  });

  it("the march-out provider carries what the shared builders publish", () => {
    const page = join(DIST, "edmonton", "march-out-cleaning", "index.html");
    if (!existsSync(page)) return;
    const [node] = branchNodes(readFileSync(page, "utf-8"));
    expect(node, "march-out page has no branch node").toBeDefined();
    expect(node.priceRange, "priceRange").toMatch(/^\$\d+-\$\d+$/);
    expect(node.image, "image").toBe("https://dutycleaners.ca/og-image.jpg");
    expect(node.sameAs, "sameAs").toContain("https://www.google.com/maps?cid=8192121191672692049");
    expect(node.geo, "geo").toEqual({ "@type": "GeoCoordinates", latitude: CITY_PROOF.edmonton.geo.latitude, longitude: CITY_PROOF.edmonton.geo.longitude });
  });
});
