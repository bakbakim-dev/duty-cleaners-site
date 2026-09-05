// Build, prerender and deploy, with the noindex decision made by the target
// rather than by whoever remembered to re-append it.
//
// The preview at dutycleaners-preview.netlify.app is a public copy of a site
// whose real domain still serves WordPress. It must never be indexed, or it
// competes with the pages it is a preview of. The header that stops that lives
// in dist/_headers, which vite regenerates from public/_headers on every build
// -- so every `bun run build` silently deletes it, and the only thing standing
// between the preview and Google was remembering to type the append back.
//
// Production has the opposite requirement, and gets the opposite check. The
// prerenderer's own header comment records that a fully-noindexed build has
// shipped here once already; that is the accident this script exists to make
// structurally impossible, so the noindex is never merely "not added" for
// production -- its absence is asserted, in the file and in every built page,
// and again over HTTP after the deploy lands.
//
//   node scripts/deploy.mjs preview
//   node scripts/deploy.mjs production --site <netlify-site-id>
//
// --skip-build reuses the current dist/ (still fully checked).
// --dry-run does everything except the deploy.

import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const HEADERS = join(DIST, "_headers");

/** The preview site. Hardcoded because getting it wrong points a noindex at production. */
const PREVIEW_SITE = "3a87e230-033a-48e9-9a4d-ce797ab93d5e";
const PREVIEW_URL = "https://dutycleaners-preview.netlify.app";

/** Pages the prerenderer noindexes on purpose: the render template and the SPA fallback. */
const NOINDEX_BY_DESIGN = new Set(["spa-shell.html", "404.html"]);

const NOINDEX_BLOCK = [
  "",
  "# Added by scripts/deploy.mjs for the preview target only.",
  "# The preview is a public copy of a site whose domain still serves the old",
  "# WordPress install. Indexing it would put two copies of every page in the",
  "# index, competing with each other. Never present on a production deploy.",
  "/*",
  "  X-Robots-Tag: noindex, nofollow",
  "",
].join("\n");

const NOINDEX_MARK = "X-Robots-Tag: noindex";

const die = (msg) => {
  console.error(`\n  deploy: ${msg}\n`);
  process.exit(1);
};
const step = (msg) => console.log(`\n== ${msg}`);
// A string command, because bun/bunx are shell shims on Windows and execFile
// cannot launch them without a shell. Everything interpolated into one is
// validated first -- see the site-id and probe-URL checks below.
const run = (command) => execSync(command, { cwd: ROOT, stdio: "inherit" });

// ---------------------------------------------------------------- arguments

const argv = process.argv.slice(2);
const target = argv[0];
const flag = (name) => argv.includes(`--${name}`);
const value = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? undefined : argv[i + 1];
};

if (target !== "preview" && target !== "production") {
  die("first argument must be 'preview' or 'production'.\n" +
      "         node scripts/deploy.mjs preview\n" +
      "         node scripts/deploy.mjs production --site <netlify-site-id>");
}

const site = value("site") ?? process.env.NETLIFY_SITE_ID ?? (target === "preview" ? PREVIEW_SITE : undefined);
if (!site) {
  die("production needs an explicit --site <id> (or NETLIFY_SITE_ID).\n" +
      "         There is no default: the domain still serves WordPress, so the\n" +
      "         production site id is not something this script should guess.");
}
if (target === "production" && site === PREVIEW_SITE) {
  die("--site is the preview site. A production deploy there would publish an\n" +
      "         indexable copy of the preview.");
}
// The site id is interpolated into a shell command below. Netlify ids are
// hex-and-dashes and site names are lowercase slugs; nothing else is a real
// id, so anything else is either a typo or an injection attempt.
if (!/^[a-z0-9][a-z0-9-]{2,63}$/.test(site)) {
  die(`--site "${site}" is not a Netlify site id or name.`);
}
// Checked here rather than beside the fetch, so a typo cannot be discovered
// only after a production deploy has already gone out.
const verifyUrl = value("verify-url");
if (verifyUrl !== undefined && !/^https:\/\/[a-z0-9.-]+(\/[\w\-./]*)?$/i.test(verifyUrl)) {
  die(`--verify-url "${verifyUrl}" is not a plain https URL.`);
}
if (target === "preview" && site !== PREVIEW_SITE) {
  die(`--site ${site} is not the preview site. Deploy elsewhere with 'production'.`);
}

// -------------------------------------------------------------------- build

if (flag("skip-build")) {
  step("skipping build, using the current dist/");
  if (!existsSync(DIST)) die("--skip-build, but dist/ does not exist.");
} else {
  step("build");
  run("bun run build");
  step("prerender");
  run("node scripts/prerender.mjs --all");
}

// ------------------------------------------------------------ dist is sane

step("checking dist/");

if (!existsSync(HEADERS)) die("dist/_headers is missing; the header rules would not ship.");
if (!existsSync(join(DIST, "index.html"))) die("dist/index.html is missing.");

/** Every built page, as a path relative to dist/. */
const htmlFiles = [];
const walk = (dir, rel) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const next = join(dir, entry.name);
    const nextRel = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isDirectory()) walk(next, nextRel);
    else if (entry.name.endsWith(".html")) htmlFiles.push(nextRel);
  }
};
walk(DIST, "");

const pageCount = htmlFiles.filter((f) => f.endsWith("index.html")).length;
if (pageCount < 200) {
  die(`only ${pageCount} pages in dist/; a full prerender produces 209. ` +
      "Deploying now would drop pages off the site.");
}
console.log(`   ${pageCount} pages, ${htmlFiles.length} html files`);

/** Pages carrying a robots noindex meta that were not meant to. */
const straySoft = htmlFiles.filter(
  (f) => !NOINDEX_BY_DESIGN.has(f) && /name="robots"\s+content="noindex"/.test(readFileSync(join(DIST, f), "utf-8")),
);
if (straySoft.length) {
  die(`${straySoft.length} page(s) carry a noindex meta that should not:\n` +
      straySoft.slice(0, 10).map((f) => `           ${f}`).join("\n"));
}

// --------------------------------------------------- the noindex decision

const headers = readFileSync(HEADERS, "utf-8");
const alreadyNoindexed = headers.includes(NOINDEX_MARK);

if (target === "preview") {
  step("stamping the preview noindex into dist/_headers");
  if (alreadyNoindexed) {
    console.log("   already present (stale dist, or --skip-build after a previous run)");
  } else {
    writeFileSync(HEADERS, headers + NOINDEX_BLOCK, "utf-8");
    console.log("   added");
  }
  if (!readFileSync(HEADERS, "utf-8").includes(NOINDEX_MARK)) {
    die("the noindex block did not survive the write.");
  }
} else {
  step("confirming production carries no noindex");
  if (alreadyNoindexed) {
    die("dist/_headers carries an X-Robots-Tag noindex. This dist was built for\n" +
        "         the preview. Rebuild without --skip-build before deploying to production.");
  }
  console.log("   dist/_headers is clean");
  console.log(`   ${NOINDEX_BY_DESIGN.size} noindexed files, both by design: ${[...NOINDEX_BY_DESIGN].join(", ")}`);
}

// ------------------------------------------------------------------ deploy

const label = target === "preview" ? `preview (${PREVIEW_URL})` : `PRODUCTION (site ${site})`;
step(`deploying to ${label}`);

if (flag("dry-run")) {
  console.log("   --dry-run: stopping before the deploy");
  process.exit(0);
}

run(`bunx netlify deploy --prod --dir dist --site ${site}`);

// ------------------------------------------------- verify what actually shipped

step("verifying the live response");

const probe = target === "preview" ? `${PREVIEW_URL}/how-much-does-a-house-cleaning-cost/` : verifyUrl;
if (!probe) {
  console.log("   no URL to probe (pass --verify-url for production); skipping.");
  console.log("   CHECK BY HAND that the live site returns no X-Robots-Tag noindex.");
  process.exit(0);
}

let response;
try {
  response = await fetch(probe, { redirect: "follow" });
} catch (error) {
  die(`deployed, but could not reach ${probe}: ${error.message}\n` +
      "         Verify the noindex state by hand before leaving this.");
}

const live = response.headers.get("x-robots-tag") ?? "";
const wantsNoindex = target === "preview";
const hasNoindex = /noindex/i.test(live);

console.log(`   ${probe}`);
console.log(`   HTTP ${response.status}, X-Robots-Tag: ${live || "(none)"}`);

if (wantsNoindex && !hasNoindex) {
  die("the preview is LIVE AND INDEXABLE. Netlify did not apply _headers.\n" +
      "         Fix before Google recrawls.");
}
if (!wantsNoindex && hasNoindex) {
  die("PRODUCTION IS SERVING NOINDEX. Redeploy from a clean build immediately.");
}
if (!response.ok) die(`the probe returned HTTP ${response.status}.`);

console.log(`\n   ${target} deploy verified.\n`);
