// Runs before `vite dev` and `vite build` (predev/prebuild hooks).
// Writes public/sitemap.xml (index) plus the four child sitemaps.
// Route list is derived from src/App.tsx so the sitemap can't drift.

import { canonicalForPath, withTrailingSlash } from "../src/data/legacy-urls";
import { execSync } from "node:child_process";
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
  // Strip the trailing slash canonicalForPath now returns. Everything
  // downstream of this function keys on the ROUTE form: the sitemap-splitting
  // filters (startsWith("/locations/")), priorityFor/changefreqFor, and
  // componentFileFor — which matches `<Route path="…">` in App.tsx, where paths
  // are declared slash-less. Leaving the slash on put the /locations/ hub into
  // the Edmonton *location* sitemap and silently broke every page's lastmod
  // (componentFileFor found no route, so all 209 fell back to the repo date).
  // urlBlock re-applies withTrailingSlash, so the emitted <loc> values are
  // unchanged — still the canonical slash form.
  for (const path of paths) canonical.add(canonicalForPath(path).replace(/\/+$/, "") || "/");
  return [...canonical];
}

function priorityFor(path: string): string {
  if (path === "/") return "1.0";
  if (path.startsWith("/locations/")) return "0.5";
  if (path.startsWith("/blog/")) return "0.6";
  if (path.split("/").length > 2) return "0.6";
  return "0.8";
}

/**
 * A blanket `weekly` on 200+ pages is noise — location pages genuinely change
 * rarely, the blog and pricing move more often. Crawlers treat an obviously
 * uniform changefreq as uninformative, so give it real signal.
 */
function changefreqFor(path: string): string {
  if (path === "/") return "weekly";
  if (path.startsWith("/blog")) return "monthly";
  if (path.includes("pricing")) return "monthly";
  if (path.startsWith("/locations/") || path.startsWith("/cleaning-services-")) return "yearly";
  return "monthly";
}

/**
 * `lastmod` per route, from the git commit that last touched the component that
 * renders it.
 *
 * This used to be `new Date()` at build time, which stamped all 209 URLs with
 * today's date on every deploy — telling Google the whole site changed when one
 * page did. Google's documented position is that an untrustworthy lastmod is
 * ignored outright, and that a site emitting wrong dates is better off without
 * the field, so the old value was worse than nothing.
 *
 * Falls back to the repo's last commit date when a route cannot be mapped to a
 * file (never to `now`, which is the failure mode this replaced).
 */
const REPO_LAST_COMMIT = (() => {
  try {
    return execSync("git log -1 --format=%cs", { encoding: "utf8" }).trim();
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
})();

const lastmodCache = new Map<string, string>();

function componentFileFor(path: string): string | null {
  const app = readFileSync(resolve("src/App.tsx"), "utf8");
  // Find the element name for this route, then the import that defines it.
  const escaped = path.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const m = app.match(new RegExp('<Route\\s+path="' + escaped + '"[^>]*element=\\{<(\\w+)'));
  if (!m) return null;
  const name = m[1];
  const lazy = app.match(new RegExp(name + '\\s*=\\s*lazy\\(\\(\\)\\s*=>\\s*import\\("([^"]+)"'));
  const direct = app.match(new RegExp('import\\s+' + name + '\\s+from\\s+"([^"]+)"'));
  const spec = (lazy || direct)?.[1];
  if (!spec) return null;
  return spec.replace(/^\.\//, "src/") + ".tsx";
}

function lastmodFor(path: string): string {
  if (lastmodCache.has(path)) return lastmodCache.get(path)!;
  let date = REPO_LAST_COMMIT;
  const file = componentFileFor(path);
  if (file) {
    try {
      const out = execSync(`git log -1 --format=%cs -- "${file}"`, { encoding: "utf8" }).trim();
      if (out) date = out;
    } catch { /* keep the fallback */ }
  }
  lastmodCache.set(path, date);
  return date;
}

function urlBlock(path: string): string {
  return `  <url><loc>${BASE_URL}${withTrailingSlash(path)}</loc><lastmod>${lastmodFor(path)}</lastmod><changefreq>${changefreqFor(path)}</changefreq><priority>${priorityFor(path)}</priority></url>`;
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

// Each child carries the newest lastmod of the URLs inside it. Without it the
// index says only "here are four files", and a crawler has to fetch all four to
// find out that three are unchanged. lastmodFor is the same per-URL function
// the urlsets use, so the index cannot disagree with its own children.
const indexLastmod = (paths: readonly string[]): string =>
  paths.map(lastmodFor).sort().at(-1) ?? lastmodFor("/");

const index = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...children.map(
    ([file, paths]) =>
      `  <sitemap><loc>${BASE_URL}/${file}</loc><lastmod>${indexLastmod(paths)}</lastmod></sitemap>`,
  ),
  `</sitemapindex>`,
  ``,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), index);

console.log(
  `sitemap written: ${mainRoutes.length} main, ${edmontonLocations.length} Edmonton, ${calgaryLocations.length} Calgary, ${blogRoutes.length} blog`,
);
