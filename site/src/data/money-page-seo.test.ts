import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * The money-page SEO contract: what "A" means, page by page, in the build.
 *
 * A 37-page audit on 8 September 2026 graded the money pages B-minus overall.
 * The reasons repeated: titles that named the service and gave no reason to
 * click; H2s that never carried the words people type ("house cleaners",
 * "maid service", "cleaning services Calgary"); prices 664 words down the page;
 * town pages with five inbound links, every anchor the bare town name; a
 * Calgary hub sharing 69% of its words with Edmonton; two Airbnb pages nobody
 * linked to; a services hub with one contextual inbound link.
 *
 * Each of those is a measurable property of the rendered HTML, so each is a
 * check here. A page is "A" when every check on its row passes. The list of
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
  { url: "/edmonton/regular-cleaning/", kind: "service", place: "Edmonton", h2Words: ["maid service", "standard clean", "house cleaning"], titleWords: ["standard cleaning", "edmonton"] },
  { url: "/calgary/regular-cleaning/", kind: "service", place: "Calgary", h2Words: ["maid service", "standard clean", "house cleaning"], titleWords: ["standard cleaning", "calgary"], twinOf: "/edmonton/regular-cleaning/" },
  { url: "/edmonton/recurring-cleaning/", kind: "service", place: "Edmonton", h2Words: ["monthly", "weekly", "recurring"], titleWords: ["recurring cleaning", "edmonton"] },
  { url: "/calgary/recurring-cleaning/", kind: "service", place: "Calgary", h2Words: ["monthly", "weekly", "recurring"], titleWords: ["recurring cleaning", "calgary"], twinOf: "/edmonton/recurring-cleaning/" },
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
describe("every money page meets the A contract in the build", () => {
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

      it("title carries the query and a reason to click, under 60 characters", () => {
        const tt = title(h).toLowerCase();
        for (const w of page.titleWords) expect(tt, `title "${title(h)}" lacks "${w}"`).toContain(w);
        expect(title(h).length, `title is ${title(h).length} chars`).toBeLessThanOrEqual(60);
        if (money) expect(/\$\d|4\.9|pay after|no deposit|24-hour|from \$/.test(tt), `title "${title(h)}" gives no reason to click`).toBe(true);
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

      it("at least two H2s carry the words people search", () => {
        const hits = h2s(h).filter((x) => page.h2Words.some((w) => x.toLowerCase().includes(w)));
        expect(hits.length, `H2s carrying ${page.h2Words.join("/")}: ${hits.join(" | ") || "none"} — all H2s: ${h2s(h).join(" | ")}`).toBeGreaterThanOrEqual(2);
      });

      if (money) {
        it("a price appears in the first 200 words", () => {
          expect(/\$\d/.test(first200), `first 200 words carry no price: "${first200.slice(0, 160)}…"`).toBe(true);
        });
        it("the Google rating appears in the first 300 words", () => {
          expect(/4\.9/.test(first300), "no rating in the first 300 words").toBe(true);
        });
        it("FAQ answers at least five real questions, in FAQPage markup", () => {
          expect(faqCount(h), "FAQ questions").toBeGreaterThanOrEqual(5);
        });
        it("the instant-price call to action and a phone link are in the body", () => {
          const body = mainOf(h);
          expect(/instant price|see my price|see your price/i.test(body), "no instant-price CTA in <main>").toBe(true);
          expect(/href="tel:/.test(body), "no tel: link in <main>").toBe(true);
        });
        it("is at least 900 words", () => {
          expect(words.length, "word count").toBeGreaterThanOrEqual(900);
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

      it("is linked from at least eight other pages under at least three different anchors", () => {
        const inbound = graph.get(norm(page.url)) ?? [];
        const sources = new Set(inbound.map((x) => x.source));
        const anchors = new Set(inbound.map((x) => x.anchor.toLowerCase()));
        const need = page.kind === "hub" ? 20 : page.kind === "support" ? 5 : 8;
        expect(sources.size, `inbound pages (anchors: ${[...anchors].slice(0, 6).join(" | ")})`).toBeGreaterThanOrEqual(need);
        expect(anchors.size, `distinct anchors: ${[...anchors].slice(0, 6).join(" | ")}`).toBeGreaterThanOrEqual(3);
        if (page.kind === "town") {
          const descriptive = [...anchors].filter((a) => /clean/.test(a));
          expect(descriptive.length, `no inbound anchor contains "clean": ${[...anchors].join(" | ")}`).toBeGreaterThanOrEqual(2);
        }
      });

      it("links out to at least six other pages from the body, including its city's price list", () => {
        const out = new Set([...mainOf(h).matchAll(/href="(\/[^"#?]*)"/g)].map((m) => norm(m[1])).filter((u) => u !== norm(page.url)));
        expect(out.size, `outbound internal links: ${[...out].slice(0, 8).join(", ")}`).toBeGreaterThanOrEqual(6);
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

      if (page.twinOf) {
        it("shares no more than half its eight-word sequences with its Edmonton twin", () => {
          const share = overlap(textOf(html(page.twinOf!)), t);
          expect(share, `${Math.round(share * 100)}% of this page's 8-grams also appear on ${page.twinOf}`).toBeLessThanOrEqual(0.5);
        });
      }
    });
  }
});
