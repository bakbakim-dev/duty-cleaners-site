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

// The built asset base ("/": production, "/dutycleaners-preview/": staging).
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

let done = 0, failed = 0, retried = 0;

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
    const out = html.replace(/(<html\b[^>]*?)\s+data-motion="on"/i, "$1");
    const outDir = route === "/" ? DIST : join(DIST, route.replace(/^\//, ""));
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, "index.html"), "<!doctype html>\n" + out);
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

console.log(
  `prerender complete: ${done} ok, ${failed} failed` +
    (retried ? ` (${retried} needed a retry)` : ""),
);
if (failed > 0) process.exitCode = 1;
