// Runs before `vite dev` and `vite build` (predev/prebuild hooks).
// Writes public/sitemap.xml (index) plus the four child sitemaps.
// Route list is derived from src/App.tsx so the sitemap can't drift.

import { canonicalForPath, withTrailingSlash } from "../src/data/legacy-urls";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://dutycleaners.ca";

// Routes that must never be indexed: redirects, internal handoffs, catch-all.
const EXCLUDED = new Set([
  "*",
  "/edmonton",
  "/edmonton-2",
  "/calgary-2",
  "/commercial-cleaning-calgary",
  "/insurance-liability",
  "/quote-redirect",
  "/book",
  "/locations/all",
  // /gift-cards is a design-picker variant that declares /gift-card/ as its
  // canonical and is linked from nowhere. Submitting both told Google to index
  // a URL that immediately disclaims itself; /gift-card/ is the legacy URL, has
  // the real purchase flow, and is the one the footer links to.
  "/gift-cards",
]);

function readRoutes(): string[] {
  const app = readFileSync(resolve("src/App.tsx"), "utf8");
  const paths = new Set<string>();
  for (const match of app.matchAll(/<Route\s+path="([^"]+)"([^>]*)>/g)) {
    const [, path, rest] = match;
    if (EXCLUDED.has(path)) continue;
    // Skip redirect-only routes so we never advertise a 301 hop.
    if (rest.includes("<Navigate")) continue;
    paths.add(path);
  }
  // Advertise the canonical URL for preserved legacy pages, never both copies:
  // the legacy path is the one Google already ranks, so it is what we submit.
  const canonical = new Set<string>();
  for (const path of paths) canonical.add(canonicalForPath(path));
  return [...canonical];
}

function priorityFor(path: string): string {
  if (path === "/") return "1.0";
  if (path.startsWith("/locations/")) return "0.5";
  if (path.startsWith("/blog/")) return "0.6";
  if (path.split("/").length > 2) return "0.6";
  return "0.8";
}

function urlBlock(path: string): string {
  return `  <url><loc>${BASE_URL}${withTrailingSlash(path)}</loc><changefreq>weekly</changefreq><priority>${priorityFor(path)}</priority></url>`;
}

function urlset(paths: string[]): string {
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...paths.sort().map(urlBlock),
    `</urlset>`,
    ``,
  ].join("\n");
}

const routes = readRoutes();

const locationRoutes = routes.filter((p) => p.startsWith("/locations/"));
const blogRoutes = routes.filter((p) => p === "/blog" || p.startsWith("/blog/"));
const mainRoutes = routes.filter(
  (p) => !locationRoutes.includes(p) && !blogRoutes.includes(p),
);

// Calgary-area neighbourhood pages carry a "-calgary" suffix or are known
// Calgary satellite communities; everything else in /locations is Edmonton-area.
const CALGARY_SLUGS = new Set([
  "airdrie",
  "cochrane",
  "okotoks",
  "chestermere",
  "crossfield",
  "high-river",
  "strathmore",
  "turner-valley",
  "black-diamond",
  "langdon",
  "tuscany",
  "kensington",
  "arbour-lake",
  "scenic-acres",
  "skyview-ranch",
  "cityscape",
  "marlborough",
  "saddle-ridge",
  "mission",
  "mount-royal",
  "aspen-woods",
  "marda-loop",
  "mahogany",
  "auburn-bay",
  "cranston",
]);

function isCalgary(path: string): boolean {
  const slug = path.replace("/locations/", "");
  return slug.endsWith("-calgary") || CALGARY_SLUGS.has(slug);
}

const calgaryLocations = locationRoutes.filter(isCalgary);
const edmontonLocations = locationRoutes.filter((p) => !isCalgary(p));

const children = [
  ["sitemap-main.xml", mainRoutes],
  ["sitemap-locations-edmonton.xml", edmontonLocations],
  ["sitemap-locations-calgary.xml", calgaryLocations],
  ["sitemap-blog.xml", blogRoutes],
] as const;

for (const [file, paths] of children) {
  writeFileSync(resolve("public", file), urlset(paths));
}

const index = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...children.map(([file]) => `  <sitemap><loc>${BASE_URL}/${file}</loc></sitemap>`),
  `</sitemapindex>`,
  ``,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), index);

console.log(
  `sitemap written: ${mainRoutes.length} main, ${edmontonLocations.length} Edmonton, ${calgaryLocations.length} Calgary, ${blogRoutes.length} blog`,
);
