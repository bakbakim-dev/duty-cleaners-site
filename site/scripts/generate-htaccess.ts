/**
 * Generates public/.htaccess for Apache hosting (SiteGround), from the SAME
 * sources as public/_redirects — src/data/legacy-urls.ts and the router.
 *
 * WHY THIS EXISTS
 * The site is already static: 209 prerendered files. Moving off Netlify is a
 * hosting change, not a rebuild. But two Netlify-only files carry work this
 * project spent a long time getting right, and Apache reads neither:
 *
 *   _redirects   352 permanent redirects. Every one of the 62 URLs Google has
 *                indexed resolves through this map — 29 of them via a redirect.
 *                Losing it at cutover loses those rankings on day one.
 *   _headers     the security headers and the immutable-asset caching.
 *
 * Hand-porting 352 rules once, at cutover, under time pressure, is how a
 * migration loses pages. Generating them from the same source means the
 * .htaccess cannot drift from _redirects, and every guard already protecting
 * the redirect map — the family-membership tests, the no-chains invariant —
 * protects this file too.
 *
 * WHAT APACHE DOES DIFFERENTLY, and how each is handled
 *   trailing slashes  Netlify's Pretty URLs normalises /foo to /foo/. Apache's
 *                     mod_dir does the same for real directories, so the
 *                     prerendered pages are fine. The generator still emits
 *                     both forms for redirect SOURCES, exactly as _redirects
 *                     does, so a legacy URL lands in one hop either way.
 *   the 404 fallback  Netlify's `/* /404.html 404` becomes ErrorDocument.
 *   the 200 rewrites  the app-only routes that serve the noindexed shell need
 *                     a RewriteRule with [L] and no redirect flag.
 *   header syntax     _headers path globs become <FilesMatch> / <If> blocks.
 *
 * Run: bunx tsx scripts/generate-htaccess.ts
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { LEGACY_URLS, canonicalForPath, withTrailingSlash } from "../src/data/legacy-urls";

const APP_ONLY_ROUTES = ["/book", "/locations/all", "/gift-cards"];

const slash = (p: string) => (p === "/" ? p : withTrailingSlash(p));
const bare = (p: string) => p.replace(/\/+$/, "") || "/";

function routerPaths(): { real: Set<string>; redirectOnly: Map<string, string> } {
  const app = readFileSync(resolve("src/App.tsx"), "utf8");
  const real = new Set<string>();
  const redirectOnly = new Map<string, string>();
  for (const m of app.matchAll(/<Route\s+path="([^"]+)"([^>]*)>/g)) {
    const [, path, rest] = m;
    if (path === "*") continue;
    if (rest.includes("<Navigate")) {
      const to = rest.match(/<Navigate\s+to="([^"]+)"/);
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
      out.add(bare(m[1]));
    }
  }
  return out;
}

const { real, redirectOnly } = routerPaths();
const sitemap = sitemapPaths();
const preserved = new Set(LEGACY_URLS.filter((u) => u.mode === "preserve").map((u) => u.legacy));

type Rule = { from: string; to: string; kind: "301" | "200" };
const rules: Rule[] = [];
const seen = new Set<string>();
const add = (from: string, to: string, kind: "301" | "200") => {
  const key = bare(from);
  if (seen.has(key)) return;
  // Invariants 1 and 2, identical to generate-redirects.ts: a preserved legacy
  // URL serves the page and is its canonical, and a sitemap URL is prerendered.
  // Emitting a redirect for either makes a real page unreachable.
  if (preserved.has(key) || sitemap.has(key)) return;
  seen.add(key);
  rules.push({ from, to, kind });
};

for (const u of LEGACY_URLS.filter((x) => x.mode === "redirect")) {
  add(u.legacy, slash(canonicalForPath(u.target)), "301");
}
for (const [p, to] of redirectOnly) add(p, slash(canonicalForPath(to)), "301");
for (const p of real) {
  const canonical = canonicalForPath(p);
  if (bare(canonical) !== bare(p)) add(p, slash(canonical), "301");
}
for (const p of APP_ONLY_ROUTES) if (real.has(p)) add(p, "/spa-shell.html", "200");
add("/sitemaps.xml", "/sitemap.xml", "301");
for (const child of [
  "/post-sitemap1.xml",
  "/page-sitemap1.xml",
  "/category-sitemap1.xml",
  "/post_tag-sitemap1.xml",
]) {
  add(child, "/sitemap.xml", "301");
}

// Invariant 3: no chains. Apache would follow them, but each hop is latency the
// visitor pays and a place for a later edit to break the middle link.
const sources = new Set(rules.filter((r) => r.kind === "301").map((r) => bare(r.from)));
const chains = rules.filter((r) => r.kind === "301" && sources.has(bare(r.to)));
if (chains.length) {
  throw new Error(`redirect chains detected: ${chains.map((c) => `${c.from} -> ${c.to}`).join(", ")}`);
}

/** Escape a literal path for the left-hand side of a RewriteRule. */
const rx = (p: string) => p.replace(/^\//, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const out: string[] = [];
out.push(
  "# GENERATED by scripts/generate-htaccess.ts — do not hand-edit.",
  "# Sources of truth: src/data/legacy-urls.ts and the router in src/App.tsx,",
  "# the same two that produce public/_redirects, so the files cannot disagree.",
  "#",
  "# dutycleaners.ca is TRAILING-SLASH canonical. Both forms of every redirect",
  "# source are listed so either lands in one hop.",
  "#",
  "# PRESERVED legacy URLs are deliberately absent: they serve the page and are",
  "# its canonical. A redirect for one would make that page unreachable.",
  "",
  "Options -MultiViews",
  "DirectoryIndex index.html",
  "",
  "<IfModule mod_rewrite.c>",
  "  RewriteEngine On",
  "",
  "  # Canonical host and scheme. Redirect to HTTPS only when NEITHER signal says",
  "  # the request is already secure: both conditions must hold (Apache ANDs",
  "  # consecutive RewriteConds). An earlier version OR'd them, which loops behind",
  "  # a proxy that terminates TLS and leaves Apache seeing HTTPS off while",
  "  # X-Forwarded-Proto says https — every hop redirects to the URL it is on.",
  "  # Do not send an HTTP request on the intentional staging host to production.",
  "  RewriteCond %{HTTP_HOST} ^(www\\.)?dutycleaners\\.ca$ [NC]",
  "  RewriteCond %{HTTPS} !=on",
  "  RewriteCond %{HTTP:X-Forwarded-Proto} !=https",
  "  RewriteRule ^(.*)$ https://dutycleaners.ca/$1 [R=301,L]",
  "  RewriteCond %{HTTP_HOST} ^www\\.dutycleaners\\.ca$ [NC]",
  "  RewriteRule ^(.*)$ https://dutycleaners.ca/$1 [R=301,L]",
  "  # Any other host (the staging host today) upgrades to HTTPS on the same host,",
  "  # so an http:// link never serves a page in plain text there either",
  "  # (AuditSpur, 2026-09-19). Same two AND'd conditions as above.",
  "  RewriteCond %{HTTPS} !=on",
  "  RewriteCond %{HTTP:X-Forwarded-Proto} !=https",
  "  RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]",
  "",
  "  # Routes that must resolve but are not indexable. They serve the SPA shell,",
  "  # which carries its own noindex, rather than index.html — four extra URLs",
  "  # rendering the homepage body would be soft duplicates of the best page.",
);
for (const r of rules.filter((x) => x.kind === "200")) {
  out.push(`  RewriteRule ^${rx(bare(r.from))}/?$ ${r.to} [L]`);
}
out.push(
  "",
  `  # ${rules.filter((x) => x.kind === "301").length} permanent redirects.`,
);
for (const r of rules.filter((x) => x.kind === "301")) {
  out.push(`  RewriteRule ^${rx(bare(r.from))}/?$ ${r.to} [R=301,L]`);
}
out.push(
  "</IfModule>",
  "",
  "# Everything else genuinely does not exist, so say so with a real 404 status.",
  "# Serving the app shell at 200 is the soft-404 pattern: it tells a crawler to",
  "# keep the URL and re-crawl it, across the whole long tail of dead WordPress",
  "# paths and typos.",
  "#",
  "# PRECONDITION: the build must run `prerender:all`, not `prerender` — every",
  "# indexable route has to exist on disk as a real file.",
  "ErrorDocument 404 /404.html",
  "",
  "# Intentional SiteGround test host: do not index the staging copy.",
  "# Production dutycleaners.ca does not match this condition.",
  "<IfModule mod_setenvif.c>",
  '  SetEnvIfNoCase Host "^mikaily131\\.sg-host\\.com(:[0-9]+)?$" DUTY_STAGING_HOST=1',
  '  SetEnvIfNoCase Host "^(www\\.)?dutycleaners\\.ca$" DUTY_PRODUCTION_HOST=1',
  '  SetEnvIf Request_URI "^/assets/" DUTY_HASHED_ASSET=1',
  "</IfModule>",
  "<IfModule mod_headers.c>",
  '  Header always set X-Robots-Tag "noindex, nofollow" env=DUTY_STAGING_HOST',
  "  # HSTS (owner decision, 2026-09-17), on the production host only, so the",
  "  # test host — whose www name has no certificate — is never pinned. Starts",
  "  # at one day; raise to 63072000 after a clean week on the domain. No",
  "  # includeSubDomains until mail., ftp. and autodiscover. are confirmed",
  "  # HTTPS, and no preload: leaving that list takes months.",
  '  Header always set Strict-Transport-Security "max-age=86400" env=DUTY_PRODUCTION_HOST',
  "  # Mirrors public/_headers. CSP ships Report-Only deliberately: the site",
  "  # embeds four third-party origins plus one inline script, and enforcing a",
  "  # policy that misses one takes the page down. HSTS is set above, scoped to",
  "  # the production host; see that comment.",
  "  Header always set X-Frame-Options \"SAMEORIGIN\"",
  "  # Origin isolation (PageSpeed best-practices, 2026-09-17). same-origin-allow-popups:",
  "  # our window is isolated from cross-origin openers, while the windows WE open",
  "  # (BookingKoala fallback, Google listings — both already noopener) are unaffected.",
  "  Header always set Cross-Origin-Opener-Policy \"same-origin-allow-popups\"",
  "  Header always set X-Content-Type-Options \"nosniff\"",
  "  Header always set Referrer-Policy \"strict-origin-when-cross-origin\"",
  "  Header always set Content-Security-Policy \"frame-ancestors 'self'\"",
);
const headersSrc = readFileSync(resolve("public/_headers"), "utf8");
const line = (name: string) =>
  headersSrc.split(/\r?\n/).find((l) => l.trim().startsWith(`${name}:`))?.split(`${name}:`)[1]?.trim() ?? "";
for (const name of ["Permissions-Policy", "Content-Security-Policy-Report-Only"]) {
  const value = line(name);
  if (value) out.push(`  Header always set ${name} "${value.replace(/"/g, '\\"')}"`);
}
out.push(
  "",
  "  # Public filenames such as logo.png are mutable and revalidate hourly.",
  "  # Vite's hashed /assets/ filenames never change under the same name, so",
  "  # only that directory receives the one-year immutable policy.",
  "  #",
  '  # This used to be a second block, `<If "%{REQUEST_URI} =~ m#^/assets/#">`,',
  "  # layered after the FilesMatch below. On SiteGround's Apache that <If> did",
  "  # not scope to /assets/ at all: it fired for every request, so its Header",
  "  # set ran last and clobbered the FilesMatch value site-wide — logo.png and",
  "  # favicon.ico both came back immutable for a year. Caught 2026-09-17 by",
  "  # reading response headers from mikaily131.sg-host.com itself; nothing",
  "  # local (build, prerender, the test suite) reads a live Apache response, so",
  "  # nothing local could have caught it.",
  "  #",
  "  # SetEnvIf + Header's own env= condition, set above with DUTY_STAGING_HOST,",
  "  # needs no expression engine and is the pattern already proven to scope",
  "  # correctly on this exact host — DUTY_STAGING_HOST's X-Robots-Tag applies",
  "  # site-wide and does not leak into a page that does not ask for it. Two",
  "  # Header directives on the same FilesMatch, gated by env=DUTY_HASHED_ASSET",
  "  # and its negation, replace the <If> rather than layering after it, so",
  "  # nothing can run in an order where the wrong one sets last.",
  '  <FilesMatch "\\.(js|css|woff2?|mp4|webm|webp|avif|png|jpe?g|svg|ico)$">',
  '    Header set Cache-Control "public, max-age=3600, must-revalidate" env=!DUTY_HASHED_ASSET',
  '    Header set Cache-Control "public, max-age=31536000, immutable" env=DUTY_HASHED_ASSET',
  "  </FilesMatch>",
  '  <FilesMatch "\\.html$">',
  '    Header set Cache-Control "public, max-age=0, must-revalidate"',
  "  </FilesMatch>",
  '  <FilesMatch "\\.(xml|txt)$">',
  '    Header set Cache-Control "public, max-age=3600"',
  "  </FilesMatch>",
  "</IfModule>",
  "",
  "<IfModule mod_deflate.c>",
  "  AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml application/javascript application/json image/svg+xml",
  "</IfModule>",
  "",
);

writeFileSync(resolve("public/.htaccess"), out.join("\n"));
console.log(
  `.htaccess written: ${rules.filter((r) => r.kind === "301").length} redirects, ` +
    `${rules.filter((r) => r.kind === "200").length} pass-through, 404 document, ` +
    `headers mirrored from public/_headers. ${preserved.size} preserved URLs correctly excluded.`,
);
