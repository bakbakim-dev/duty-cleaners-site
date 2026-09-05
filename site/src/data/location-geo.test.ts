import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { LOCATION_GEO, geoFor } from "./location-geo";

/**
 * Guards the coordinates.
 *
 * A wrong latitude is worse than a missing one: it tells Google the business
 * serves a place it does not, and unlike thin copy nobody will ever notice by
 * reading the page. The specific failure this protects against is the one that
 * nearly happened during collection — Nominatim silently falls back to the CITY
 * centre when it cannot find a neighbourhood, which would have pinned ~30
 * Edmonton pages to the same downtown point while every one of them looked
 * like a successful geocode.
 *
 * So the assertions are about plausibility and distinctness rather than exact
 * values: no two places share a pin, everything sits inside Alberta, and
 * everything is near the city it claims to serve.
 */

const DIST = join(__dirname, "..", "..", "dist");

/** Alberta's real extent, generously. Anything outside is a data-entry error. */
const ALBERTA = { latMin: 48.9, latMax: 60.1, lonMin: -120.1, lonMax: -109.9 };
const EDMONTON = { lat: 53.5461, lon: -113.4938 };
const CALGARY = { lat: 51.0447, lon: -114.0719 };

function km(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLon = ((bLon - aLon) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

describe("location coordinates", () => {
  const entries = Object.entries(LOCATION_GEO);

  it("covers the pages that had none", () => {
    expect(entries.length).toBe(51);
  });

  it("every value parses as a number", () => {
    const bad = entries.filter(
      ([, g]) => !Number.isFinite(Number(g.latitude)) || !Number.isFinite(Number(g.longitude)),
    );
    expect(bad.map(([p]) => p)).toEqual([]);
  });

  it("every pin is inside Alberta", () => {
    const outside = entries.filter(([, g]) => {
      const lat = Number(g.latitude);
      const lon = Number(g.longitude);
      return (
        lat < ALBERTA.latMin || lat > ALBERTA.latMax || lon < ALBERTA.lonMin || lon > ALBERTA.lonMax
      );
    });
    expect(outside.map(([p]) => p)).toEqual([]);
  });

  /**
   * The city-centre-fallback guard. High River is the genuine outlier at 53.5 km
   * from Calgary; 90 km leaves room for another town without admitting a pin in
   * the wrong half of the province.
   */
  it("every pin is near the city it serves", () => {
    const far = entries
      .map(([path, g]) => {
        const lat = Number(g.latitude);
        const lon = Number(g.longitude);
        const d = Math.min(
          km(EDMONTON.lat, EDMONTON.lon, lat, lon),
          km(CALGARY.lat, CALGARY.lon, lat, lon),
        );
        return { path, d };
      })
      .filter((r) => r.d > 90);
    expect(far.map((r) => `${r.path} is ${r.d.toFixed(0)} km from both cities`)).toEqual([]);
  });

  /**
   * The duplicate check below only fires when SEVERAL pages collapse onto one
   * point — it cannot see a single entry that fell back. But a fallback always
   * lands on the same place: the exact city centre. None of these 51 is a
   * downtown neighbourhood (the nearest, Spruce Avenue, sits ~2 km out), so
   * anything within 500 m of either centroid is a fallback rather than a
   * genuine location.
   */
  it("no pin has fallen back to a bare city centre", () => {
    const suspects = entries
      .map(([path, g]) => {
        const lat = Number(g.latitude);
        const lon = Number(g.longitude);
        return {
          path,
          m: Math.min(
            km(EDMONTON.lat, EDMONTON.lon, lat, lon),
            km(CALGARY.lat, CALGARY.lon, lat, lon),
          ) * 1000,
        };
      })
      .filter((r) => r.m < 500);
    expect(
      suspects.map((r) => `${r.path} sits ${r.m.toFixed(0)} m from a city centre`),
      "this is what a Nominatim city-centre fallback looks like — re-geocode it",
    ).toEqual([]);
  });

  it("no two places share a pin", () => {
    const seen = new Map<string, string>();
    const dupes: string[] = [];
    for (const [path, g] of entries) {
      const key = `${g.latitude},${g.longitude}`;
      const prev = seen.get(key);
      if (prev) dupes.push(`${path} == ${prev}`);
      seen.set(key, path);
    }
    expect(dupes, "a shared pin is the signature of a city-centre fallback").toEqual([]);
  });

  it("geoFor tolerates a trailing slash and a full URL", () => {
    const [path] = entries[0];
    expect(geoFor(path)).toBeDefined();
    expect(geoFor(`${path}/`)).toBeDefined();
    expect(geoFor(`https://dutycleaners.ca${path}/`)).toBeDefined();
    expect(geoFor("/locations/not-a-real-place")).toBeUndefined();
  });
});

describe("location pages emit GeoCoordinates", () => {
  function locationUrls(): string[] {
    if (!existsSync(DIST)) return [];
    const out: string[] = [];
    for (const f of readdirSync(DIST).filter((n) => /^sitemap-locations-.*\.xml$/.test(n))) {
      const xml = readFileSync(join(DIST, f), "utf-8");
      for (const m of xml.matchAll(/<loc>https:\/\/dutycleaners\.ca(\/[^<]*)<\/loc>/g)) out.push(m[1]);
    }
    return out;
  }

  const read = (url: string) =>
    readFileSync(join(DIST, ...url.replace(/^\/|\/$/g, "").split("/"), "index.html"), "utf-8");

  it("all 153 carry a geo node", () => {
    const urls = locationUrls();
    if (!urls.length) return;
    const missing = urls.filter((u) => !/"@type":"GeoCoordinates"/.test(read(u)));
    expect(missing, "location pages with no GeoCoordinates").toEqual([]);
  });

  /**
   * The coordinates say what AREA is served, not where the business sits.
   *
   * They used to hang off the LocalBusiness node beside an address naming the
   * Edmonton or Calgary office, so /cleaning-services-leduc/ published a
   * business at 18615 71 Ave NW, Edmonton with a pin 30 km away. schema.org's
   * `geo` on a LocalBusiness is where that business IS, and one address shared
   * across 153 pages with the pin varying per page is the shape Google's
   * local-search guidance describes for location-page schemes. On areaServed
   * the identical numbers are simply true.
   */
  it("puts the coordinates on areaServed, never on the business node", () => {
    const urls = locationUrls();
    if (!urls.length) return;
    const onBusiness: string[] = [];
    const missingOnArea: string[] = [];
    for (const url of urls) {
      const html = read(url);
      for (const block of html.matchAll(
        /<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g,
      )) {
        let parsed: unknown;
        try {
          parsed = JSON.parse(block[1]);
        } catch {
          continue;
        }
        for (const node of Array.isArray(parsed) ? parsed : [parsed]) {
          if (!node || typeof node !== "object") continue;
          const record = node as Record<string, unknown>;
          if (!String(record["@type"] ?? "").includes("LocalBusiness")) continue;
          if (record.geo) onBusiness.push(url);
          const area = record.areaServed as Record<string, unknown> | undefined;
          if (!area?.geo) missingOnArea.push(url);
        }
      }
    }
    expect(onBusiness, "coordinates back on the business node").toEqual([]);
    expect(missingOnArea, "areaServed carries no coordinates").toEqual([]);
  });

  it("no two location pages share a pin", () => {
    const urls = locationUrls();
    if (!urls.length) return;
    const seen = new Map<string, string>();
    const dupes: string[] = [];
    for (const u of urls) {
      const m = /"latitude":"([^"]*)","longitude":"([^"]*)"/.exec(read(u));
      if (!m) continue;
      const key = `${m[1]},${m[2]}`;
      const prev = seen.get(key);
      if (prev) dupes.push(`${u} == ${prev}`);
      seen.set(key, u);
    }
    expect(dupes).toEqual([]);
  });
});

describe("each map embed is centred on the place its page describes", () => {
  /**
   * Every location page publishes GeoCoordinates in its schema and, separately,
   * hard-codes a Google Maps embed URL whose centre is baked into the `pb=`
   * parameter as !2d<lng>!3d<lat>. Nothing kept the two agreeing, and 14 of the
   * 42 had drifted more than a kilometre apart.
   *
   * The worst was Langdon: schema at -113.67936, embed at -113.95 — 19 km west,
   * out of the hamlet and toward Calgary's eastern edge. Bannerman was 6.0 km
   * out and Turner Valley 5.8 km.
   *
   * This is easy to miss twice over. The embed is stripped from the prerendered
   * HTML — the build reports "stripped baked map tiles from 57 pages" — so it
   * does not appear in dist and a crawl of the built site cannot see it. It
   * still ships to real visitors, who get a map of somewhere else.
   *
   * The schema coordinate is the authority: it is generated, and the nearby-
   * neighbour distances are computed from it. The embed follows it.
   */
  const SRC = join(__dirname, "..", "pages", "locations");
  const EMBED = /maps\/embed\?pb=[^"]*?!2d(-?[\d.]+)!3d(-?[\d.]+)/;
  const CANON = /"https:\/\/dutycleaners\.ca\/(?:locations\/)?([a-z0-9-]+)\/?"/;

  /** Great-circle distance in kilometres. */
  function km(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  }

  it("no embed sits more than 500 m from its page's own coordinates", () => {
    if (!existsSync(DIST) || !existsSync(SRC)) return;
    // slug -> the coordinates that page publishes in its schema
    const geo = new Map<string, [number, number]>();
    const walk = (dir: string) => {
      for (const e of readdirSync(dir)) {
        const p = join(dir, e);
        if (!statSync(p).isDirectory()) continue;
        const idx = join(p, "index.html");
        if (existsSync(idx)) {
          const m = /"latitude":\s*"?(-?[\d.]+)"?,\s*"longitude":\s*"?(-?[\d.]+)"?/.exec(
            readFileSync(idx, "utf-8"),
          );
          if (m) geo.set(e, [Number(m[1]), Number(m[2])]);
        }
        walk(p);
      }
    };
    walk(DIST);

    const bad: string[] = [];
    for (const file of readdirSync(SRC)) {
      if (!file.endsWith(".tsx")) continue;
      const src = readFileSync(join(SRC, file), "utf-8");
      const e = EMBED.exec(src);
      const c = CANON.exec(src);
      if (!e || !c) continue;
      const coords = geo.get(c[1]);
      if (!coords) continue;
      const d = km(coords[0], coords[1], Number(e[2]), Number(e[1]));
      if (d > 0.5) bad.push(`${file}: embed is ${d.toFixed(1)} km from the page's own GeoCoordinates`);
    }
    expect(
      bad,
      `Map embeds pointing somewhere other than the page's place:\n${bad.join("\n")}\n` +
        `Set !2d/!3d from the page's own latitude/longitude. Note the embed is ` +
        `stripped from dist by the prerenderer, so this cannot be caught by ` +
        `crawling the built site — it only ships to real visitors.`,
    ).toEqual([]);
  });
});
