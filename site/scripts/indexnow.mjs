// Ping IndexNow with the site's URLs after a deploy.
//
//   node scripts/indexnow.mjs            # submit every sitemap URL
//   node scripts/indexnow.mjs /pricing/  # submit specific paths
//
// WHY THIS EXISTS
// ChatGPT Search retrieves through Bing's index — a page Bing has not indexed
// cannot be cited, no matter how good it is. Bing, Yandex and Seznam all honour
// IndexNow, and it is the only push-notification channel this site has: Google
// ignores IndexNow entirely and finds pages through the sitemap instead.
//
// Bing Webmaster Tools is also currently the only free source of AI-citation
// data available to a Canadian site — Google's equivalent report launched in
// June 2026 but is still limited to a subset of UK properties.
//
// SAFE TO RUN REPEATEDLY. IndexNow is idempotent; resubmitting an unchanged URL
// is a no-op at the receiving end.

import { readFileSync, readdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const HOST = "dutycleaners.ca";
const PUBLIC = join(ROOT, "public");

/** The key IS the filename: IndexNow verifies ownership by fetching it. */
function findKey() {
  const f = readdirSync(PUBLIC).find((n) => /^[0-9a-f]{32}\.txt$/.test(n));
  if (!f) throw new Error("no IndexNow key file in public/ — expected <32-hex>.txt");
  const key = f.replace(/\.txt$/, "");
  const body = readFileSync(join(PUBLIC, f), "utf8").trim();
  if (body !== key) throw new Error(`key file ${f} must contain exactly its own key`);
  return key;
}

function sitemapUrls() {
  const out = new Set();
  for (const f of readdirSync(PUBLIC).filter((n) => /^sitemap-.*\.xml$/.test(n))) {
    const xml = readFileSync(join(PUBLIC, f), "utf8");
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) out.add(m[1]);
  }
  return [...out];
}

const key = findKey();
const args = process.argv.slice(2);
const urlList = args.length
  ? args.map((p) => `https://${HOST}${p.startsWith("/") ? p : `/${p}`}`)
  : sitemapUrls();

if (!urlList.length) {
  console.error("nothing to submit");
  process.exit(1);
}

const payload = {
  host: HOST,
  key,
  keyLocation: `https://${HOST}/${key}.txt`,
  urlList,
};

const res = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});

// 200 accepted, 202 accepted but key still being validated. Both are success.
if (res.status === 200 || res.status === 202) {
  console.log(`IndexNow: submitted ${urlList.length} URLs (HTTP ${res.status})`);
} else {
  console.error(`IndexNow: HTTP ${res.status} — ${await res.text()}`);
  process.exit(1);
}
