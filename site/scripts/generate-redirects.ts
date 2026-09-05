/**
 * Generates public/_redirects from the two sources of truth — src/data/legacy-urls.ts
 * and the router in src/App.tsx — so the rules can never drift from them.
 *
 * Hand-editing this file is how the post at
 * /the-top-5-must-have-cleaning-products-for-a-spotless-home/ once ended up 301ing
 * to /blog/: a stale regeneration turned a PRESERVED url into a redirect, which
 * would have made the page unreachable and dumped its 73k impressions on the index.
 *
 * The invariants enforced here:
 *   1. A preserved legacy URL is NEVER a redirect source — it serves the page.
 *   2. A URL in the sitemap is NEVER a redirect source — it is prerendered.
 *   3. No redirect target is itself a redirect source (no chains).
 *   4. Real routes that are deliberately not indexable still resolve (200 shell).
 *   5. Everything else 404s, which requires the build to run prerender:all.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { LEGACY_URLS, canonicalForPath, withTrailingSlash } from "../src/data/legacy-urls";

/** Routes that must resolve but are intentionally absent from the sitemap. */
const APP_ONLY_ROUTES = ["/book", "/quote-redirect", "/locations/all", "/gift-cards"];

const slash = (p: string) => (p === "/" ? p : withTrailingSlash(p));

function routerPaths(): { real: Set<string>; redirectOnly: Map<string, string> } {
  const app = readFileSync(resolve("src/App.tsx"), "utf8");
  const real = new Set<string>();
  /** path -> the `to` the <Navigate> actually sends the browser. */
  const redirectOnly = new Map<string, string>();
  for (const m of app.matchAll(/<Route\s+path="([^"]+)"([^>]*)>/g)) {
    const [, path, rest] = m;
    if (path === "*") continue;
    if (rest.includes("<Navigate")) {
      const to = rest.match(/<Navigate\s+to="([^"]+)"/);
      // Resolve to the Navigate destination, not the path itself — otherwise the
      // rule becomes /foo -> /foo/ and loops.
      if (to) redirectOnly.set(path, to[1]);
    } else {
      real.add(path);
    }
  }
  return { real, redirectOnly };
}

function sitemapPaths(): Set<string> {
  const out = new Set<string>();
  for (const f of readdirSync(resolve("public")).filter((n) => /^sitemap-.*\.xml$/.test(n))) {
    const xml = readFileSync(resolve("public", f), "utf8");
    for (const m of xml.matchAll(/<loc>https:\/\/dutycleaners\.ca([^<]*)<\/loc>/g)) {
      out.add(m[1].replace(/\/+$/, "") || "/");
    }
  }
  return out;
}

const { real, redirectOnly } = routerPaths();
const sitemap = sitemapPaths();
const preserved = new Set(LEGACY_URLS.filter((u) => u.mode === "preserve").map((u) => u.legacy));

type Rule = { from: string; to: string; code: string };
const rules: Rule[] = [];
const seen = new Set<string>();
const add = (from: string, to: string, code: string) => {
  const key = from.replace(/\/+$/, "") || "/";
  if (seen.has(key)) return;
  if (preserved.has(key) || sitemap.has(key)) return; // invariants 1 + 2
  seen.add(key);
  rules.push({ from, to, code });
};

// 1. Legacy URLs marked as redirects.
for (const u of LEGACY_URLS.filter((x) => x.mode === "redirect")) {
  add(u.legacy, slash(canonicalForPath(u.target)), "301!");
}
// 2. Router redirect-only routes (<Navigate>), so the hop happens server-side too.
for (const [p, to] of redirectOnly) add(p, slash(canonicalForPath(to)), "301!");
// 3. Real routes that are superseded by a preserved legacy URL.
for (const p of real) {
  const canonical = canonicalForPath(p);
  // Compare slash-INSENSITIVELY. canonicalForPath now returns the site's
  // canonical trailing-slash form, so a naive `canonical !== p` would call every
  // route "superseded" and emit a self-redirect /x -> /x/ for all 209 of them —
  // including the four app-only routes below, whose 200 rewrite would then sit
  // behind a 301 and trip the no-chains invariant. Trailing-slash normalisation
  // is the host's job (netlify.toml / Pretty URLs); this rule is only for a
  // route genuinely superseded by a DIFFERENT preserved legacy URL.
  const bare = (s: string) => s.replace(/\/+$/, "") || "/";
  if (bare(canonical) !== bare(p)) add(p, slash(canonical), "301!");
}
// 4. Routes that must still resolve but are not indexable.
//
// These served /index.html, which meant Google could index four extra URLs whose
// body was the homepage — soft duplicates of the site's most important page. The
// SPA shell renders exactly the same for the client router (it IS the render
// template) but carries <meta name="robots" content="noindex">, so the route
// still resolves and the duplicate stops being indexable. That matches the
// stated intent of this list: "must resolve but are not indexable".
for (const p of APP_ONLY_ROUTES) if (real.has(p)) add(p, "/spa-shell.html", "200");

// 5. The live WordPress robots.txt points crawlers at /sitemaps.xml. The new
// build ships /sitemap.xml, so without this the old path 404s from the moment
// the DNS flips until Google re-reads robots.txt.
add("/sitemaps.xml", "/sitemap.xml", "301!");

// The Yoast index at /sitemaps.xml lists four CHILD sitemaps, and those are
// separate URLs Google has crawled in their own right. Verified live on
// dutycleaners.ca while the WordPress site is still up: all four return 200
// today. Redirecting only the parent leaves them to 404 at cutover, which is
// how a crawler loses its record of the URLs it already knows.
for (const child of [
  "/post-sitemap1.xml",
  "/page-sitemap1.xml",
  "/category-sitemap1.xml",
  "/post_tag-sitemap1.xml",
]) {
  add(child, "/sitemap.xml", "301!");
}

// Invariant 3: no chains.
const sources = new Set(rules.filter((r) => r.code !== "200").map((r) => r.from.replace(/\/+$/, "")));
const chains = rules.filter((r) => r.code !== "200" && sources.has(r.to.replace(/\/+$/, "")));
if (chains.length) {
  throw new Error(`redirect chains detected: ${chains.map((c) => `${c.from} -> ${c.to}`).join(", ")}`);
}

const header = `# GENERATED by scripts/generate-redirects.ts — do not hand-edit.
# Sources of truth: src/data/legacy-urls.ts and the router in src/App.tsx.
#
# dutycleaners.ca is TRAILING-SLASH canonical (WordPress default). 122 of the 131
# indexed URLs — 2.2M impressions — are the slash form, so destinations use it and
# slash-less sources are listed alongside so either form lands in one hop.
#
# PRESERVED legacy URLs are deliberately absent: they serve the page and are its
# canonical. Emitting a redirect for one would make that page unreachable.
#
# Trailing-slash normalisation is the host's job (netlify.toml / Pretty URLs).
# A catch-all slash rule would match the slash form too and loop.
`;

const body: string[] = [];
for (const r of rules.filter((x) => x.code !== "200")) {
  body.push(`${slash(r.from)}  ${r.to}  ${r.code}`);
  if (slash(r.from) !== r.from) body.push(`${r.from}  ${r.to}  ${r.code}`);
}
body.push("", "# Real routes that must resolve but are not indexable.");
for (const r of rules.filter((x) => x.code === "200")) {
  body.push(`${slash(r.from)}  ${r.to}  ${r.code}`);
  body.push(`${r.from}  ${r.to}  ${r.code}`);
}

const footer = `
# Everything else genuinely does not exist, so say so. A 200 with the app shell is
# the soft-404 pattern: it tells a crawler to keep the URL and re-crawl it, across
# the entire long tail of typos and dead WordPress paths.
#
# PRECONDITION: the build must run \`prerender:all\`, not \`prerender\` — every
# indexable route has to exist on disk as a real file. netlify.toml is set that way.
/*  /404.html  404
`;

writeFileSync(resolve("public/_redirects"), `${header}\n${body.join("\n")}\n${footer}`);
console.log(
  `_redirects written: ${rules.filter((r) => r.code !== "200").length} redirects, ` +
    `${rules.filter((r) => r.code === "200").length} pass-through, 404 fallback. ` +
    `${preserved.size} preserved URLs correctly excluded.`,
);
