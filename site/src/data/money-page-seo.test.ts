import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Money-page targeting and navigation checks. Passing is not an SEO grade.
 *
 * A 37-page audit on 8 September 2026 graded the money pages B-minus overall.
 * The reasons repeated: titles that named the service and gave no reason to
 * click; H2s that never carried the words people type ("house cleaners",
 * "maid service", "cleaning services Calgary"); prices 664 words down the page;
 * town pages with five inbound links, every anchor the bare town name; a
 * Calgary hub sharing 69% of its words with Edmonton; two Airbnb pages nobody
 * linked to; a services hub with one contextual inbound link.
 *
 * The September 13 editorial implementation removed prescriptive sales-title,
 * keyword-repeat, link-count and text-difference quotas from those older checks.
 * Clear targeting, truthful prices and useful navigation remain guarded. The list of
 * pages is explicit: a page that stops being a money page is removed from the
 * list on purpose, not by a regex that quietly stops matching.
 *
 * Runs against dist/ and skips when there is no build. Rebuild first:
 *   bun run build && node scripts/prerender.mjs --all
 */

const DIST = join(__dirname, "..", "..", "dist");
const built = existsSync(join(DIST, "index.html"));

type Kind = "hub" | "service" | "pricing" | "town" | "services-hub" | "support";
interface MoneyPage {
  url: string;
  kind: Kind;
  /** The place the page is about, as it appears in copy. */
  place: string;
  /** Words at least two H2s must carry (any of), lower-case. */
  h2Words: string[];
  /** Words the title must carry (all of), lower-case. */
  titleWords: string[];
  /** The Edmonton twin, for the overlap check. */
  twinOf?: string;
}

export const MONEY_PAGES: MoneyPage[] = [
  { url: "/", kind: "hub", place: "Edmonton", h2Words: ["cleaning services", "house cleaners", "maid service"], titleWords: ["house cleaning", "edmonton"] },
  { url: "/cleaning-services-calgary/", kind: "hub", place: "Calgary", h2Words: ["cleaning services", "house cleaners", "maid service"], titleWords: ["house cleaning", "calgary"], twinOf: "/" },
  { url: "/edmonton/regular-cleaning/", kind: "service", place: "Edmonton", h2Words: ["maid service", "standard clean", "house cleaning"], titleWords: ["one-time", "standard", "maid cleaning", "edmonton"] },
  { url: "/calgary/regular-cleaning/", kind: "service", place: "Calgary", h2Words: ["maid service", "standard clean", "house cleaning"], titleWords: ["one-time", "standard", "maid cleaning", "calgary"], twinOf: "/edmonton/regular-cleaning/" },
  { url: "/edmonton/recurring-cleaning/", kind: "service", place: "Edmonton", h2Words: ["monthly", "weekly", "recurring"], titleWords: ["weekly", "biweekly cleaning", "edmonton"] },
  { url: "/calgary/recurring-cleaning/", kind: "service", place: "Calgary", h2Words: ["monthly", "weekly", "recurring"], titleWords: ["weekly", "biweekly cleaning", "calgary"], twinOf: "/edmonton/recurring-cleaning/" },
  { url: "/edmonton/deep-cleaning/", kind: "service", place: "Edmonton", h2Words: ["deep clean", "deep house cleaning"], titleWords: ["deep cleaning", "edmonton"] },
  { url: "/calgary/deep-cleaning/", kind: "service", place: "Calgary", h2Words: ["deep clean", "deep house cleaning"], titleWords: ["deep cleaning", "calgary"], twinOf: "/edmonton/deep-cleaning/" },
  { url: "/move-out-cleaning-edmonton/", kind: "service", place: "Edmonton", h2Words: ["move-out", "move out", "move-in", "end of tenancy"], titleWords: ["move out cleaning", "edmonton"] },
  { url: "/move-out-cleaning-calgary/", kind: "service", place: "Calgary", h2Words: ["move-out", "move out", "move-in", "end of tenancy"], titleWords: ["move out cleaning", "calgary"], twinOf: "/move-out-cleaning-edmonton/" },
  { url: "/post-construction-cleaning/", kind: "service", place: "Edmonton", h2Words: ["post-construction", "post construction", "post-renovation", "renovation"], titleWords: ["post-construction cleaning", "edmonton"] },
  { url: "/post-construction-cleaning-calgary/", kind: "service", place: "Calgary", h2Words: ["post-construction", "post construction", "post-renovation", "renovation"], titleWords: ["post-construction cleaning", "calgary"], twinOf: "/post-construction-cleaning/" },
  { url: "/wall-washing-wall-cleaning/", kind: "service", place: "Edmonton", h2Words: ["wall washing", "wall cleaning", "walls"], titleWords: ["wall washing", "edmonton"] },
  { url: "/wall-washing-wall-cleaning-calgary/", kind: "service", place: "Calgary", h2Words: ["wall washing", "wall cleaning", "walls"], titleWords: ["wall washing", "calgary"], twinOf: "/wall-washing-wall-cleaning/" },
  { url: "/airbnb-cleaning-services-calgary/", kind: "service", place: "Calgary", h2Words: ["airbnb", "short-term rental", "turnover"], titleWords: ["airbnb cleaning", "calgary"] },
  { url: "/edmonton/airbnb-cleaning/", kind: "service", place: "Edmonton", h2Words: ["airbnb", "short-term rental", "turnover"], titleWords: ["airbnb cleaning", "edmonton"] },
  { url: "/pricing/", kind: "pricing", place: "Edmonton", h2Words: ["prices", "rates", "cost"], titleWords: ["house cleaning prices", "edmonton"] },
  { url: "/calgary/pricing/", kind: "pricing", place: "Calgary", h2Words: ["prices", "rates", "cost"], titleWords: ["house cleaning prices", "calgary"], twinOf: "/pricing/" },
  { url: "/services/", kind: "services-hub", place: "Edmonton", h2Words: ["standard", "deep", "move", "recurring"], titleWords: ["cleaning services", "edmonton"] },
  { url: "/calgary/services/", kind: "services-hub", place: "Calgary", h2Words: ["standard", "deep", "move", "recurring"], titleWords: ["cleaning services", "calgary"], twinOf: "/services/" },
  ...[
    ["st-albert", "St. Albert"], ["sherwood-park", "Sherwood Park"], ["spruce-grove", "Spruce Grove"], ["leduc", "Leduc"],
    ["morinville", "Morinville"], ["airdrie", "Airdrie"], ["beaumont", "Beaumont"], ["devon", "Devon"],
    ["fort-saskatchewan", "Fort Saskatchewan"], ["cochrane", "Cochrane"], ["stony-plain", "Stony Plain"],
  ].map(([slug, place]) => ({
    url: `/cleaning-services-${slug}/`,
    kind: "town" as Kind,
    place,
    h2Words: ["house cleaners", "cleaning services", "cleaning company", "house cleaning"],
    titleWords: ["house cleaning", place.toLowerCase()],
  })),
  { url: "/whats-included/", kind: "support", place: "Edmonton", h2Words: ["checklist", "included"], titleWords: ["checklist"] },
  { url: "/contact-us/", kind: "support", place: "Edmonton", h2Words: ["edmonton", "calgary"], titleWords: ["contact"] },
  { url: "/locations/", kind: "support", place: "Alberta", h2Words: ["edmonton", "calgary"], titleWords: ["house cleaning", "alberta"] },
  { url: "/reviews/", kind: "support", place: "Edmonton", h2Words: ["reviews"], titleWords: ["duty cleaners reviews"] },
  { url: "/gift-card/", kind: "support", place: "Edmonton", h2Words: ["gift"], titleWords: ["gift card"] },
];

// ---- helpers ----------------------------------------------------------------
const pagePath = (url: string) => (url === "/" ? join(DIST, "index.html") : join(DIST, ...url.split("/").filter(Boolean), "index.html"));
const html = (url: string) => readFileSync(pagePath(url), "utf-8");
const mainOf = (h: string) => h.match(/<main[\s\S]*?<\/main>/)?.[0] ?? h;
const unescape = (s: string) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const textOf = (h: string) =>
  unescape(
    mainOf(h)
      .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "")
      .replace(/<[^>]+>/g, " "),
  ).replace(/\s+/g, " ").trim();
const title = (h: string) => unescape(h.match(/<title>(.*?)<\/title>/)?.[1] ?? "");
const meta = (h: string) => unescape(h.match(/name="description" content="([^"]*)"/)?.[1] ?? "");
const h1s = (h: string) => [...h.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => unescape(m[1].replace(/<[^>]+>/g, "")).trim());
const h2s = (h: string) => [...mainOf(h).matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => unescape(m[1].replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim());
const faqCount = (h: string) => (h.match(/"@type":\s*"Question"/g) ?? []).length;
const schemaTypes = (h: string) => new Set([...h.matchAll(/"@type":\s*"([A-Za-z]+)"/g)].map((m) => m[1]));
const norm = (u: string) => (u === "/" ? "/" : u.replace(/\/+$/, "") + "/");

/** Every internal link inside <main> across the whole build: target -> [source, anchor]. */
function linkGraph(): Map<string, { source: string; anchor: string }[]> {
  const graph = new Map<string, { source: string; anchor: string }[]>();
  const walk = (dir: string, url: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) walk(join(dir, e.name), `${url}${e.name}/`);
      else if (e.name === "index.html") {
        const body = mainOf(readFileSync(join(dir, e.name), "utf-8"));
        for (const m of body.matchAll(/<a\b[^>]*href="(\/[^"#?]*)"[^>]*>([\s\S]*?)<\/a>/g)) {
          const target = norm(m[1]);
          if (target === url) continue;
          const anchor = unescape(m[2].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
          if (!graph.has(target)) graph.set(target, []);
          graph.get(target)!.push({ source: url, anchor });
        }
      }
    }
  };
  walk(DIST, "/");
  return graph;
}

/** Share of a page's 8-word sequences that also appear on another page, city names normalised. */
function overlap(a: string, b: string): number {
  const grams = (t: string) => {
    const w = t.toLowerCase().replace(/\b(edmonton|calgary|edmontonians|calgarians|780|403)\b/g, "city").replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
    return new Set(w.map((_, i) => w.slice(i, i + 8).join(" ")).filter((g) => g.split(" ").length === 8));
  };
  const ga = grams(a), gb = grams(b);
  let shared = 0;
  for (const g of gb) if (ga.has(g)) shared++;
  return gb.size ? shared / gb.size : 0;
}

// ---- the contract -------------------------------------------------------------
describe("money-page targeting and navigation regression checks", () => {
  if (!built) {
    it.skip("no build; run prerender:all first", () => {});
    return;
  }
  const graph = linkGraph();

  for (const page of MONEY_PAGES) {
    const money = page.kind !== "support";
    describe(page.url, () => {
      const h = html(page.url);
      const t = textOf(h);
      const words = t.split(" ");
      const first200 = words.slice(0, 200).join(" ");
      const first300 = words.slice(0, 300).join(" ");

      it("title identifies the intended service and place within the project's copy budget", () => {
        const tt = title(h).toLowerCase();
        for (const w of page.titleWords) expect(tt, `title "${title(h)}" lacks "${w}"`).toContain(w);
        expect(title(h).length, `title is ${title(h).length} chars`).toBeLessThanOrEqual(60);
        // A price/discount promise is optional. Accurate scope (such as add-on)
        // matters more than forcing a promotional phrase into every title.
      });

      it("meta description is a sentence of 100 to 155 characters that names the place", () => {
        const m = meta(h);
        expect(m.length, `meta is ${m.length} chars`).toBeGreaterThanOrEqual(100);
        expect(m.length, `meta is ${m.length} chars`).toBeLessThanOrEqual(155);
        if (page.kind !== "support") expect(m.toLowerCase(), `meta does not name ${page.place}`).toContain(page.place.toLowerCase());
      });

      it("one H1, naming the place", () => {
        const hs = h1s(h);
        expect(hs, "H1 count").toHaveLength(1);
        if (money) expect(hs[0].toLowerCase(), `H1 "${hs[0]}"`).toContain(page.place.toLowerCase());
      });

      it("headings explain the page topic without a repetition quota", () => {
        const hits = h2s(h).filter((x) => page.h2Words.some((w) => x.toLowerCase().includes(w)));
        expect(hits.length, `No heading explains ${page.h2Words.join("/")}`).toBeGreaterThan(0);
      });

      if (money) {
        it("a price is easy to find, after the scope table on comparison hubs", () => {
          expect(/\$\d/.test(page.kind === "services-hub" ? t : first200), `first 200 words carry no price: "${first200.slice(0, 160)}…"`).toBe(true);
        });
        it("gives readers a route to review evidence", () => {
          expect(/href="[^"]*(?:google\.com|\/reviews\/)/.test(h), "no review source or reviews link").toBe(true);
        });
        it("retained FAQ markup contains questions", () => {
          expect(faqCount(h), "FAQ questions").toBeGreaterThan(0);
        });
        it("the instant-price call to action and a phone link are in the body", () => {
          const body = mainOf(h);
          expect(/instant price|see my price|see your price|price my one-time clean|choose my cleaning schedule/i.test(body), "no instant-price CTA in <main>").toBe(true);
          expect(/href="tel:/.test(body), "no tel: link in <main>").toBe(true);
        });
        it("explains the service and price conditions without a word-count target", () => {
          expect(t).toMatch(/clean/i);
          expect(t).toMatch(/GST/);
          expect(t).toMatch(/included|scope|checklist|covers/i);
        });
      }

      it("carries the schema its kind needs", () => {
        const s = schemaTypes(h);
        // The homepage is the root of every breadcrumb trail, so it carries none.
        for (const need of page.url === "/" ? ["Organization"] : ["Organization", "BreadcrumbList"]) expect([...s], `missing ${need}`).toContain(need);
        if (money) expect([...s], "missing LocalBusiness").toContain("LocalBusiness");
        if (money) expect([...s], "missing FAQPage").toContain("FAQPage");
        if (page.kind === "service") expect([...s], "missing Service").toContain("Service");
      });

      it("is reachable through internal links with descriptive anchor text", () => {
        const inbound = graph.get(norm(page.url)) ?? [];
        const sources = new Set(inbound.map((x) => x.source));
        const anchors = new Set(inbound.map((x) => x.anchor.toLowerCase()));
        expect(sources.size, "page is orphaned").toBeGreaterThan(0);
        expect([...anchors].some(a => a.trim().length > 0), "empty inbound anchors").toBe(true);
        if (page.kind === "town") {
          const descriptive = [...anchors].filter((a) => /clean/.test(a));
          expect(descriptive.length, `no inbound anchor contains "clean": ${[...anchors].join(" | ")}`).toBeGreaterThan(0);
        }
      });

      it("provides useful onward navigation including its city's price list", () => {
        const out = new Set([...mainOf(h).matchAll(/href="(\/[^"#?]*)"/g)].map((m) => norm(m[1])).filter((u) => u !== norm(page.url)));
        expect(out.size, "no onward internal links in main content").toBeGreaterThan(0);
        if (money && page.kind !== "pricing") {
          const price = page.place === "Calgary" || ["Airdrie", "Cochrane"].includes(page.place) ? "/calgary/pricing/" : "/pricing/";
          expect([...out], `no link to ${price}`).toContain(price);
        }
      });

      it("every image has alt text", () => {
        const imgs = [...mainOf(h).matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
        const bad = imgs.filter((i) => !/alt="[^"]+"/.test(i));
        expect(bad.length, `${bad.length} image(s) without alt`).toBe(0);
      });

      // Shared truthful scope/prices may repeat between branches. An n-gram
      // overlap score is not a reason to invent local differences.
    });
  }
});
