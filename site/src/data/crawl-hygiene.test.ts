/**
 * Crawl hygiene: no internal link carries a query string.
 *
 * A Screaming Frog pass on the staging host (2026-09-17) listed 14 URLs that
 * were nothing but `/contact-us/?topic=…`, `/?intent=deep` and `/?service=…`
 * variants of pages that already existed: each fetched separately, each with a
 * duplicate title and description, each folded back only by its canonical.
 * The intent now rides in the fragment (src/lib/url-intent.ts), which a
 * crawler never treats as a page. This keeps it that way, and keeps the
 * readers honouring both forms so links the site does not control still work.
 */
import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { hashAnchor, intentHref, intentParams, intentQuery } from "../lib/url-intent";

const ROOT = join(__dirname, "..", "..");
const DIST = join(ROOT, "dist");

function builtPages(): string[] {
  if (!existsSync(DIST)) return [];
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (entry === "index.html") out.push(full);
    }
  };
  walk(DIST);
  return out;
}

describe("crawl hygiene: intent rides in the fragment, never the query string", () => {
  it("no built page links to an internal URL with a query string", () => {
    const pages = builtPages();
    if (!pages.length) return; // unbuilt tree
    const offenders: string[] = [];
    for (const page of pages) {
      const html = readFileSync(page, "utf-8");
      for (const m of html.matchAll(/href="(\/[^"]*\?[^"]*)"/g)) {
        if (/^\/(?:favicon\.svg|logo\.png)\?v=\d+$/.test(m[1])) continue;
        offenders.push(`${page.slice(DIST.length).replace(/\\/g, "/")} -> ${m[1]}`);
      }
    }
    expect(offenders, "internal links with a query string (a crawler fetches each as its own page)").toEqual([]);
  });

  it("the deep-clean and contact intents are still carried, in the fragment", () => {
    const pages = builtPages();
    if (!pages.length) return;
    const all = pages.map((p) => readFileSync(p, "utf-8")).join("\n");
    expect(all, "no page ships a deep-intent quote CTA any more").toContain('href="/#quote&amp;intent=deep"');
    expect(all, "the Red Deer page no longer opens the office topic for its own branch").toContain('href="/contact-us/#topic=office&amp;city=reddeer"');
    expect(all, "the Airbnb pages no longer open the callback topic").toContain('href="/contact-us/#topic=airbnb&amp;city=edmonton"');
  });

  it("the readers merge the fragment over the query string, and the anchor stays readable", () => {
    expect(hashAnchor("#quote&intent=deep")).toBe("quote");
    expect(hashAnchor("#topic=office&city=calgary")).toBe("");
    expect(hashAnchor("")).toBe("");
    const merged = intentParams("?promo=SPRING&intent=none", "#quote&intent=deep&service=deep-cleaning");
    expect(merged.get("promo")).toBe("SPRING");
    expect(merged.get("intent"), "the fragment wins on a clash").toBe("deep");
    expect(merged.get("service")).toBe("deep-cleaning");
    expect(intentParams("?topic=airbnb", "").get("topic"), "an old query-form link still opens its topic").toBe("airbnb");
    expect(intentQuery("", "#quote&service=regular-cleaning")).toBe("?service=regular-cleaning");
    expect(intentQuery("", "#quote")).toBe("");
    expect(intentHref("/contact-us/", { topic: "office", city: "calgary" })).toBe("/contact-us/#topic=office&city=calgary");
    expect(intentHref("/", { service: null, intent: "deep" }, "quote")).toBe("/#quote&intent=deep");
    expect(intentHref("/", {})).toBe("/");
  });

  it("the contact form and the quote overlay read the fragment", () => {
    const contact = readFileSync(join(ROOT, "src", "pages", "Contact.tsx"), "utf-8");
    expect(contact).toMatch(/intentParams\(search, hash\)/);
    expect(contact).not.toMatch(/useSearchParams/);
    const overlay = readFileSync(join(ROOT, "src", "hooks", "use-quote-overlay.tsx"), "utf-8");
    expect(overlay).toMatch(/hashAnchor\(hash\)/);
    expect(overlay).toMatch(/intentParams\(search, hash\)/);
  });
});
