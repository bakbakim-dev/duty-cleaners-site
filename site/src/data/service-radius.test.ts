import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { LOCATION_GEO } from "./location-geo";
import { calgarySurrounding, edmontonSurrounding } from "./city-locations";

/**
 * A stated service radius has to survive the site's own coordinates.
 *
 * Both hubs claimed to serve "surrounding communities within a 30km radius"
 * — in visible copy and inside FAQPage JSON-LD, so it reached search results
 * too. Measured against location-geo.ts, three of Edmonton's nine surrounding
 * towns are past 30 km (Leduc 32.0, Morinville 30.2, Stony Plain 33.8) and six
 * of Calgary's ten are (Okotoks 36.2, Cochrane 32.1, Crossfield 42.6, Black
 * Diamond 41.3, Turner Valley 43.7, High River 53.5).
 *
 * The Calgary answer named Okotoks and Cochrane as its examples, so the two
 * towns offered as proof of the radius were themselves outside it.
 *
 * A radius is a promise a reader can check on a map. This does not ban one —
 * it requires that any number the site states actually covers the towns the
 * site says it serves.
 */

const DIST = join(__dirname, "..", "..", "dist");

const CITY_CENTRE: Record<"edmonton" | "calgary", [number, number]> = {
  edmonton: [53.5461, -113.4938],
  calgary: [51.0447, -114.0719],
};

/** Great-circle distance in kilometres. */
function km(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function pinFor(to: string): [number, number] | undefined {
  const key = to.replace(/\/$/, "");
  const entry = LOCATION_GEO[key] ?? LOCATION_GEO[`${key}/`];
  return entry ? [Number(entry.latitude), Number(entry.longitude)] : undefined;
}

function builtPages(): Array<{ url: string; html: string }> {
  if (!existsSync(DIST)) return [];
  const out: Array<{ url: string; html: string }> = [];
  const walk = (dir: string, url: string) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full, `${url}${entry}/`);
      else if (entry === "index.html") out.push({ url: url || "/", html: readFileSync(full, "utf-8") });
    }
  };
  walk(DIST, "/");
  return out;
}

describe("a stated service radius covers the towns the site claims to serve", () => {
  it("no built page states a radius its own coordinates contradict", () => {
    const pages = builtPages();
    if (!pages.length) return; // unbuilt tree

    const failures: string[] = [];
    for (const { url, html } of pages) {
      for (const match of html.matchAll(/within a (\d+)\s*km radius/gi)) {
        const radius = Number(match[1]);
        // Which city's ring is this page talking about? Fall back to checking
        // both, so a page cannot dodge the guard by being ambiguous.
        const cities: Array<"edmonton" | "calgary"> = /calgary/i.test(url)
          ? ["calgary"]
          : url === "/"
            ? ["edmonton"]
            : ["edmonton", "calgary"];

        for (const city of cities) {
          const towns = city === "calgary" ? calgarySurrounding : edmontonSurrounding;
          const beyond = towns
            .map((town) => {
              const pin = pinFor(town.to);
              return pin ? { name: town.name, d: km(CITY_CENTRE[city], pin) } : null;
            })
            .filter((row): row is { name: string; d: number } => row !== null)
            .filter((row) => row.d > radius);

          if (beyond.length) {
            failures.push(
              `${url} claims ${radius}km for ${city}, but ` +
                beyond.map((row) => `${row.name} is ${row.d.toFixed(1)}km`).join(", "),
            );
          }
        }
      }
    }
    expect(failures, "a stated radius does not reach towns the site says it serves").toEqual([]);
  });
});
