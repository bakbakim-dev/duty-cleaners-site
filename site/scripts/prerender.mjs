// Post-build prerender: snapshot each core route's fully rendered HTML into
// dist/<route>/index.html using headless Chrome, so crawlers that do not
// execute JavaScript (Bing-fed AI fetchers, social scrapers) receive real
// titles, canonicals, body content, and JSON-LD instead of an empty SPA shell.
//
//   node scripts/prerender.mjs          # main + blog routes (from sitemaps)
//   node scripts/prerender.mjs --all    # every sitemap URL (200+, slow)
//
// React 18 re-renders into #root on hydration, so the snapshot is purely a
// crawler/first-paint enhancement — client behavior is unchanged.
import { createServer } from "node:http";
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync, readdirSync, statSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { join, dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { settleEmbeds } from "./settle-embeds.mjs";

const execFileP = promisify(execFile);
const DIST = resolve(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const CHROME =
  process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ALL = process.argv.includes("--all");

if (!existsSync(join(DIST, "index.html"))) {
  console.error("dist/index.html not found — run the build first.");
  process.exit(1);
}

// Preserve the pristine SPA shell before any route overwrites index.html —
// deploy scripts use it as the 404.html client-routing fallback.
if (!existsSync(join(DIST, "spa-shell.html"))) {
  copyFileSync(join(DIST, "index.html"), join(DIST, "spa-shell.html"));
}
// The end of this script stamps noindex into the shell. If a stamped shell is
// still here, this run is reusing a dist that was already prerendered — and the
// shell is the render TEMPLATE, so every page would inherit the noindex (that
// exact accident shipped a fully-noindexed build once). Refuse; build first.
if (/name="robots" content="noindex"/.test(readFileSync(join(DIST, "spa-shell.html"), "utf-8"))) {
  console.error("spa-shell.html is already noindex-stamped — stale dist. Run `npm run build` first.");
  process.exit(1);
}
// The shell is a client-routing fallback, not a page. Served at /spa-shell(.html)
// and as 404.html it was INDEXABLE, so an audit correctly reported both as live
// empty pages. Stamp noindex once here; every copy below inherits it.
// The shell template ships an "index, follow" robots meta, so "skip if one
// exists" left the shell indexable — REPLACE any existing robots meta instead.
const noindexShell = (html) => {
  const noindex = '<meta name="robots" content="noindex">';
  return /name="robots"/.test(html)
    ? html.replace(/<meta\s+name="robots"[^>]*>/, noindex)
    : html.replace("<head>", `<head>${noindex}`);
};
// Stamping happens at the END of this script: the shell is also the render
// template (and the on-disk fallback during rendering), so stamping it here
// would noindex every prerendered page — audit #439's blocked gate proved it.

// The built asset base ("/" in production; a sub-path when a build sets Vite's base).
const shell = readFileSync(join(DIST, "spa-shell.html"), "utf-8");
const baseMatch = shell.match(/src="([^"]*?)assets\//);
const BASE = baseMatch ? baseMatch[1] : "/";

// Route list from the generated sitemaps (single source of truth).
const sitemapFiles = ALL
  ? readdirSync(DIST).filter((f) => /^sitemap-.*\.xml$/.test(f))
  : ["sitemap-main.xml", "sitemap-blog.xml"];
const routes = [...new Set(
  sitemapFiles.flatMap((f) => {
    const xml = readFileSync(join(DIST, f), "utf-8");
    return [...xml.matchAll(/<loc>https:\/\/dutycleaners\.ca([^<]*)<\/loc>/g)].map((m) => m[1] || "/");
  }),
)];

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp",
  ".woff2": "font/woff2", ".ico": "image/x-icon", ".xml": "application/xml", ".txt": "text/plain",
  ".mp4": "video/mp4",
};

const server = createServer((req, res) => {
  let path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (path.startsWith(BASE)) path = "/" + path.slice(BASE.length);
  let file = join(DIST, path.replace(/^\/+/, ""));
  try {
    if (!existsSync(file) || statSync(file).isDirectory()) file = join(DIST, "spa-shell.html");
  } catch {
    file = join(DIST, "spa-shell.html");
  }
  try {
    res.setHeader("Content-Type", MIME[extname(file)] || "application/octet-stream");
    res.end(readFileSync(file));
  } catch {
    res.statusCode = 404;
    res.end("not found");
  }
});

await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const port = server.address().port;
console.log(`prerendering ${routes.length} routes (base "${BASE}") via 127.0.0.1:${port}`);

const CHROME_ARGS = [
  "--headless=new", "--disable-gpu", "--no-sandbox", "--mute-audio",
  "--no-first-run", "--disable-sync", "--disable-background-networking",
  "--disable-extensions",
  // virtual-time fast-forwards timers; --timeout hard-stops pages that hold
  // virtual time open (videos, observers) and dumps whatever has rendered.
  "--virtual-time-budget=10000", "--timeout=20000", "--dump-dom",
];

let done = 0, failed = 0, retried = 0, strippedTiles = 0;
// Scroll-reveal wrappers unhidden in the snapshot, and any that survived.
let revealPages = 0, revealWrappers = 0, revealLeft = 0;
// Third-party embeds settled to their loaded state, and any that survived.
let embedPages = 0, embedsLeft = 0;

// The hidden half of the scroll-reveal wrapper, and the visible half the same
// component renders once its observer fires. Both class pairs are Tailwind
// utilities that already exist in the built stylesheet, because both branches
// of the ternary are in the source the JIT scans.
const REVEAL_HIDDEN = "opacity-0 translate-y-8";
const REVEAL_SHOWN = "opacity-100 translate-y-0";

/**
 * Headless Chrome occasionally returns a shell with no <h1> under concurrency —
 * a different route each run, passing on the next attempt. The <h1> guard turns
 * that into a hard build failure, so without a retry an entirely healthy build
 * fails at random. Two attempts, with a short backoff, and every retry is
 * reported so a route that is genuinely broken still stands out rather than
 * being quietly papered over.
 */
async function renderOnce(url) {
  const { stdout: html } = await execFileP(CHROME, [...CHROME_ARGS, url], {
    maxBuffer: 64 * 1024 * 1024,
    timeout: 45_000,
  });
  if (!/<h1/i.test(html)) throw new Error("no <h1> in rendered output");
  return html;
}

async function renderRoute(route) {
  const url = `http://127.0.0.1:${port}${BASE.replace(/\/$/, "")}${route === "/" ? "/" : route}`;
  try {
    let html;
    try {
      html = await renderOnce(url);
    } catch (first) {
      retried++;
      console.warn(`  retrying ${route}: ${String(first.message).slice(0, 80)}`);
      await new Promise((r) => setTimeout(r, 1000));
      html = await renderOnce(url);
    }
    // The headless run executes the inline script that stamps data-motion="on",
    // and --dump-dom bakes the result into the snapshot. Left in, the static
    // HTML would claim JS is running before it is, and the CSS guard that keeps
    // scroll-reveal sections visible for no-JS visitors would never match.
    // The real browser re-stamps this within the first tick.
    let out = html.replace(/(<html\b[^>]*?)\s+data-motion="on"/i, "$1");

    // Leaflet builds its map in an effect, so the headless run loads real map
    // tiles and --dump-dom freezes them into the snapshot as <img> tags. 593 of
    // them across 57 pages, 20 on the homepage alone.
    //
    // Every visitor then fetched those tiles from openstreetmap.org during
    // initial HTML parse -- before any interaction, before Leaflet had even
    // initialised -- handing OSM their IP and referer. Leaflet promptly threw
    // the frozen tiles away and requested its own, so the traffic was wasted as
    // well as unconsented, and OSMF's tile policy prohibits this class of
    // commercial hotlinking. (These frozen tiles were also what the "673 images
    // missing dimensions" audit figure was actually counting.)
    //
    // Stripping them changes nothing a visitor sees: the map is still built on
    // mount exactly as before. It only stops the snapshot from firing requests
    // the page never meant to make. The attribution link is left in place.
    const beforeTiles = out.length;
    out = out.replace(/<img\b[^>]*\bsrc="https:\/\/[a-c]\.tile\.openstreetmap\.org\/[^"]*"[^>]*>/g, "");
    if (out.length !== beforeTiles) strippedTiles++;
    // The map components are lazy behind a visibility gate, but the headless
    // render scrolls nothing and the gate's geometry fallback still fires, so
    // Vite's preload helper injects <link rel="modulepreload"> for Leaflet and
    // the map chunk into <head>, and --dump-dom freezes them. Left in, every
    // visitor would preload 42 KB of map code before reading a word. Strip
    // them: the lazy import fetches the same chunks when the map is reached.
    out = out.replace(/<link rel="modulepreload"[^>]*href="\/assets\/(?:leaflet|[A-Za-z]+MapImpl)-[^"]*"[^>]*>\s*/g, "");
    // Leaflet's baked popup close button is href="#close" — an id no page has.
    // Leaflet re-renders the popup on hydration, so the frozen anchor is inert;
    // neutralise the fragment rather than ship a link that lands nowhere.
    out = out.replace(/(<a[^>]*leaflet-popup-close-button[^>]*href=")#close(")/g, "$1#$2");
    out = out.replace(/(<a[^>]*href=")#close("[^>]*leaflet-popup-close-button)/g, "$1#$2");

    // Scroll-reveal sections start hidden and are revealed by an
    // IntersectionObserver, so --dump-dom freezes every section that was below
    // the headless fold as `opacity-0 translate-y-8`. That is 1,862 wrappers
    // across 173 pages, 32 of them on each post-construction page starting
    // immediately below the hero — so on a slow connection the snapshot paints
    // a hero and then nothing at all until the bundle boots and the observer
    // runs. The snapshot exists precisely for the readers and crawlers who do
    // not get that far, so it must ship the revealed state instead.
    //
    // This is a rewrite, not a removal: the wrapper keeps its transition
    // classes and the client render is untouched, so the reveal animation
    // still plays for everyone once React takes over.
    //
    // The no-JS guard in index.css (`html:not([data-motion="on"])
    // .opacity-0.translate-y-8`) is deliberately left alone. It covers the
    // live client render, where the hidden class does come back; it simply has
    // nothing left to unhide in the snapshot.
    const hiddenWrappers = out.split(REVEAL_HIDDEN).length - 1;
    if (hiddenWrappers) {
      out = out.split(REVEAL_HIDDEN).join(REVEAL_SHOWN);
      revealPages++;
      revealWrappers += hiddenWrappers;
    }

    // Third-party embeds (the BookingKoala gift-card form) are frozen mid-load or
    // loaded depending on whether another company's server answered before
    // --dump-dom — a network race that made /gift-card's fingerprint flip between
    // builds of identical code, and shipped a hidden purchase form to readers
    // whose bundle never boots. Settle them to the loaded state. The reasoning,
    // and why this lives in its own tested module, is in settle-embeds.mjs.
    const embeds = settleEmbeds(out);
    out = embeds.html;
    if (embeds.settled) embedPages++;
    if (embeds.frozen) embedsLeft++;

    const outDir = route === "/" ? DIST : join(DIST, route.replace(/^\//, ""));
    mkdirSync(outDir, { recursive: true });
    // Chrome's --dump-dom output already starts with <!DOCTYPE html>. Prepending
    // unconditionally shipped two doctypes on all 209 pages.
    const doctyped = /^\s*<!doctype html>/i.test(out) ? out : "<!doctype html>\n" + out;
    // Measured on what is actually written, not on what the rewrite above
    // believes it did — a later edit that reintroduces the hidden pair after
    // the rewrite would otherwise ship a blank page below the hero and still
    // report a clean run.
    if (doctyped.includes(REVEAL_HIDDEN)) revealLeft++;
    writeFileSync(join(outDir, "index.html"), doctyped);
    done++;
    if (done % 10 === 0) console.log(`  ${done}/${routes.length}`);
  } catch (err) {
    failed++;
    console.warn(`  FAILED ${route}: ${String(err.message).slice(0, 120)}`);
  }
}

const CONCURRENCY = 4;
const queue = [...routes];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) await renderRoute(queue.shift());
  }),
);

server.close();

// The 404 page. public/_redirects ends in `/*  /404.html  404`, so this file has to
// exist or Netlify falls back to its own unbranded error page. It is the pristine SPA
// shell: served with a 404 status, the client router matches <Route path="*"> and
// renders NotFound, so the visitor gets the real site and the crawler gets the right
// status. Nothing generated this before — the comment above said "deploy scripts use
// it" and no script did, so dist/404.html was whatever an earlier deploy left behind.
writeFileSync(join(DIST, "404.html"), readFileSync(join(DIST, "spa-shell.html"), "utf-8"));
console.log("wrote 404.html from the SPA shell");
for (const f of ["spa-shell.html", "404.html"]) {
  writeFileSync(join(DIST, f), noindexShell(readFileSync(join(DIST, f), "utf-8")));
}
console.log("noindexed the shell artifacts (spa-shell.html, 404.html)");

console.log(
  `prerender complete: ${done} ok, ${failed} failed` +
    (retried ? ` (${retried} needed a retry)` : "") +
    (strippedTiles ? `; stripped baked map tiles from ${strippedTiles} pages` : "") +
    `; unhid ${revealWrappers} scroll-reveal wrappers on ${revealPages} pages` +
    `; ${revealLeft} snapshots still hide content below the hero` +
    `; settled ${embedPages} third-party embed page(s) to their loaded state`,
);
if (embedsLeft > 0) {
  console.error(
    `${embedsLeft} snapshot(s) still freeze a third-party embed mid-load — they ship a placeholder and a hidden form to every reader whose bundle does not boot, and their content fingerprint changes from build to build.`,
  );
  process.exitCode = 1;
}
if (revealLeft > 0) {
  console.error(
    `${revealLeft} snapshot(s) still contain "${REVEAL_HIDDEN}" — those pages ship blank below the hero until React mounts.`,
  );
  process.exitCode = 1;
}
if (failed > 0) process.exitCode = 1;
