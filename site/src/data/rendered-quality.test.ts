import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { displayNameFor } from "./place-names";

/**
 * Guards distilled from the multi-agent content audit. Each one exists
 * because the defect it checks for actually shipped:
 *
 *  - "handlecommercial" - JSX end-of-line whitespace trimmed away the space
 *    between prose and a <Link>, on 18 pages.
 *  - "Mc Leod" / "Mcdougall" / "Hollick Kenyon" / bare "St Albert" - four
 *    different call sites de-slugged place names by hand instead of using
 *    src/data/place-names.ts.
 *  - "Laurel Edmonton" (no comma) - Breadcrumbs concatenated name and city
 *    into a label that read like a single mangled place name, on 110 pages.
 *  - "A Ozerna deep clean" - article chosen without checking the vowel.
 *  - Median 33 mentions of the page's own place name - interpolation used to
 *    break template duplication overshot into keyword stuffing.
 *  - 71 pages sharing one meta-description template - rotation exists so no
 *    single place-normalised template covers most of the location set.
 *
 * All checks run on the prerendered dist output, because every one of these
 * bugs was invisible in source and only manifested in rendered text.
 */

const DIST = join(__dirname, "..", "..", "dist");
const LOCATIONS = join(DIST, "locations");

/** Every prerendered page path in dist (relative URL form). */
function allPages(): string[] {
  if (!existsSync(DIST)) return [];
  const out: string[] = [];
  const walk = (dir: string, url: string) => {
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry);
      if (statSync(p).isDirectory()) walk(p, `${url}${entry}/`);
      else if (entry === "index.html") out.push(url || "/");
    }
  };
  walk(DIST, "/");
  return out;
}

/** Location page slugs (skip the hub and /locations/all). */
function locationSlugs(): string[] {
  if (!existsSync(LOCATIONS)) return [];
  return readdirSync(LOCATIONS).filter(
    (s) => s !== "all" && statSync(join(LOCATIONS, s)).isDirectory(),
  );
}

function html(url: string): string {
  const path = url === "/" ? join(DIST, "index.html") : join(DIST, url.replace(/^\/|\/$/g, ""), "index.html");
  return readFileSync(path, "utf-8");
}

/**
 * Visible text inside <main>.
 *
 * Inline tags are CLOSED UP, not turned into spaces. Replacing every tag with a
 * space (the obvious implementation) splits "<a>service</a>, helping" into
 * "service , helping" - which manufactured 417 phantom "space before
 * punctuation" findings the first time this sweep was run. Only block-level
 * boundaries become whitespace.
 */
const INLINE_TAGS = /<\/?(?:a|em|strong|span|b|i|u|small|sup|sub|code|abbr|mark|s|del|ins|q|cite|time|label)\b[^>]*>/g;

function mainText(url: string): string {
  const raw = html(url)
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ");
  const main = /<main\b[^>]*>([\s\S]*?)<\/main>/.exec(raw);
  return (main ? main[1] : raw)
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(INLINE_TAGS, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const metaContent = (page: string, selector: RegExp): string | null => {
  const m = selector.exec(page);
  return m ? m[1] : null;
};

describe("rendered grammar and place-name integrity", () => {
  /** Each entry shipped at least once. String entries are exact substrings. */
  const BANNED: ReadonlyArray<readonly [RegExp, string]> = [
    [/handlecommercial|handleresidential/, "JSX whitespace trim glued prose to a link"],
    [/\bMc [A-Z]/, "split Mc-name like 'Mc Leod' - de-slugging bypassed place-names.ts"],
    [/\bMcdougall\b/, "'Mcdougall' - must be McDougall via place-names.ts"],
    [/\bHollick Kenyon\b/, "'Hollick Kenyon' - hyphen lost, must be Hollick-Kenyon"],
    [/\bSt Albert\b/, "'St Albert' - missing period, must be St. Albert"],
    [/\bin West runs\b/, "bare 'West' used as a place name - display name is West Calgary"],
    [/\b[Aa] [AEIOU][a-z]+ (?:deep|standard) clean\b/, "wrong article before a vowel-initial place name"],
    // "Capitol Hill is a established inner-city NW community" shipped this way.
    // The allow-list covers vowels that are pronounced as consonants.
    [
      /\ba (?!one\b|once\b|unit|uniq|user|useful|univers|utility|uniform|union|European)[aeiou][a-z]{2,}\b/,
      "article/vowel disagreement - should be \"an\"",
    ],
  ];

  /**
   * /reviews/ quotes customers verbatim, and two of those reviews contain a
   * doubled full stop. Editing a quoted review to fix its punctuation would be
   * misquoting a real person, so that page is exempt from the punctuation rule
   * rather than the review being "corrected".
   */
  const PUNCTUATION_EXEMPT = new Set(["/reviews/"]);

  it("no banned grammar artifact appears on any rendered page", () => {
    const pages = allPages();
    if (pages.length === 0) return; // nothing to check before a prerender
    const hits: string[] = [];
    for (const url of pages) {
      if (!PUNCTUATION_EXEMPT.has(url)) {
        const stray = /(?<!\.)\.\.(?!\.)/.exec(mainText(url));
        if (stray) {
          const at = mainText(url).slice(Math.max(0, stray.index - 50), stray.index + 30);
          hits.push(`${url}: doubled full stop — ...${at}...`);
        }
      }
      const text = mainText(url);
      for (const [re, why] of BANNED) {
        const m = re.exec(text);
        if (m) hits.push(`${url}: "${m[0]}" (${why})`);
      }
    }
    expect(hits, `Banned grammar artifacts found:\n${hits.join("\n")}`).toEqual([]);
  });
});

describe("breadcrumb labels join name and city with a comma", () => {
  it("no BreadcrumbList item reads like 'Laurel Edmonton'", () => {
    const slugs = locationSlugs();
    if (slugs.length === 0) return;
    const bad: string[] = [];
    for (const slug of slugs) {
      const page = html(`/locations/${slug}/`);
      for (const m of page.matchAll(/"@type":\s*"ListItem"[^}]*?"name":\s*"([^"]+)"/g)) {
        const label = m[1];
        // `.+` must not end on the comma, or the correct "Abbottsfield, Edmonton"
        // matches the concatenated shape this is meant to catch.
        const space = /^(.+[^,]) (Edmonton|Calgary)$/.exec(label);
        // Uncommaed city-suffixed labels are legal only when the city word is
        // part of the display name itself ("West Calgary", "Downtown Edmonton").
        if (space && !displayNameFor(slug).endsWith(space[2])) {
          bad.push(`/locations/${slug}/: "${label}"`);
        }
      }
    }
    expect(bad, `Concatenated breadcrumb labels (missing comma):\n${bad.join("\n")}`).toEqual([]);
  });
});

describe("place-name mention density", () => {
  /**
   * Interpolating the place name into the shared template broke cross-page
   * duplication, but the first pass overshot into keyword stuffing: a median of
   * 33 mentions of the page's own name, on pages of roughly 800 words.
   *
   * WHY DENSITY, NOT A RAW COUNT
   * The first version of this guard used an absolute ceiling of 30 mentions and
   * flagged eight pages - but every one of them was simply LONGER than average
   * (Strathmore 977 words, Okotoks 1005), and several "mentions" were the real
   * proper names of local landmarks in map links ("Strathmore Golf Club",
   * "Strathmore Stampede Grounds"), which are not stuffing at all. A raw count
   * punishes length and cannot tell a landmark from a repetition. Density can.
   *
   * After variant rotation and the local-note pass the distribution is tight:
   * median 2.9%, p90 3.4%, max 3.9%. The pre-fix state sat above 4%. The ceiling
   * below therefore fails on a regression toward the old interpolation behaviour
   * while leaving normal editing room.
   */
  const MAX_DENSITY_PERCENT = 4;

  it("no location page's own name exceeds the density ceiling", () => {
    const slugs = locationSlugs();
    if (slugs.length === 0) return;
    const over: string[] = [];
    for (const slug of slugs) {
      const name = displayNameFor(slug);
      const text = mainText(`/locations/${slug}/`);
      const words = text.split(/\s+/).length;
      if (words === 0) continue;
      const count = (text.match(new RegExp(`\\b${escapeRe(name)}\\b`, "gi")) ?? []).length;
      const density = (count / words) * 100;
      if (density > MAX_DENSITY_PERCENT) {
        over.push(`/locations/${slug}/: ${density.toFixed(2)}% (${count} mentions of "${name}" in ${words} words)`);
      }
    }
    expect(
      over,
      `Pages past the ${MAX_DENSITY_PERCENT}% place-name density ceiling:\n${over.join("\n")}\n` +
        `Use a variant that omits the name, or add substantive local copy.`,
    ).toEqual([]);
  });
});

describe("meta description and og:title hygiene on location pages", () => {
  it("no single place-normalised description template covers more than 25 pages", () => {
    const slugs = locationSlugs();
    if (slugs.length === 0) return;
    const clusters = new Map<string, string[]>();
    for (const slug of slugs) {
      const page = html(`/locations/${slug}/`);
      const desc = metaContent(page, /<meta name="description" content="([^"]*)"/);
      if (!desc) continue;
      const name = displayNameFor(slug);
      const norm = desc.replace(new RegExp(escapeRe(name), "gi"), "PLACE").toLowerCase();
      clusters.set(norm, [...(clusters.get(norm) ?? []), slug]);
    }
    const worst = [...clusters.entries()].sort((a, b) => b[1].length - a[1].length)[0];
    expect(
      worst?.[1].length ?? 0,
      `${worst?.[1].length} location pages share one description template:\n"${worst?.[0]}"\n` +
        `e.g. ${worst?.[1].slice(0, 5).join(", ")}. Rotate in another template variant.`,
    ).toBeLessThanOrEqual(25);
  });

  it("og:title matches the page title on every location page", () => {
    const slugs = locationSlugs();
    if (slugs.length === 0) return;
    const drift: string[] = [];
    for (const slug of slugs) {
      const page = html(`/locations/${slug}/`);
      const title = metaContent(page, /<title[^>]*>([^<]*)<\/title>/);
      const og = metaContent(page, /<meta property="og:title" content="([^"]*)"/);
      if (title && og && title.trim() !== og.trim()) {
        drift.push(`/locations/${slug}/: title "${title.trim()}" vs og:title "${og.trim()}"`);
      }
    }
    expect(drift, `og:title drifted from <title>:\n${drift.join("\n")}`).toEqual([]);
  });
});

/**
 * Helmet owns <title>. Seventy-two pages ALSO set it imperatively in a
 * useEffect, and because that effect runs after Helmet commits, the imperative
 * string won in the browser. Every one of those strings was the pre-rotation
 * title, so real users and any JS-executing crawler saw a title the HTML did
 * not contain - and on /locations/spruce-cliff-calgary/ it even beat Helmet
 * into the prerendered file, which is how the whole class was discovered.
 *
 * This is a SOURCE-level check on purpose: the defect is a client-side race
 * that the prerendered HTML mostly hides.
 */
describe("Helmet is the only authority for document title", () => {
  const SRC = join(__dirname, "..");

  const tsxFiles = (dir: string): string[] => {
    const out: string[] = [];
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry);
      if (statSync(p).isDirectory()) out.push(...tsxFiles(p));
      else if (entry.endsWith(".tsx")) out.push(p);
    }
    return out;
  };

  it("no component assigns document.title", () => {
    const offenders = tsxFiles(SRC)
      .filter((f) => /^\s*document\.title\s*=/m.test(readFileSync(f, "utf-8")))
      .map((f) => f.slice(SRC.length + 1));
    expect(
      offenders,
      `These components set document.title imperatively, which races Helmet and ` +
        `wins in the browser:\n${offenders.join("\n")}\nSet the title in <Helmet> instead.`,
    ).toEqual([]);
  });
});

/**
 * Every <img> needs a real alt, or an explicit decorative marker.
 *
 * Nine hero images shipped with alt="" - including the two most valuable pages
 * on the site, the homepage and the Calgary hub, whose hero alt came from a
 * `heroAlt=""` prop and so was invisible to a source-level grep for alt="".
 * Image alt is both an accessibility requirement and the only text signal an
 * image search has to work with, so an empty one on a hero is a real loss.
 */
describe("images carry alt text", () => {
  it("no rendered <img> has a missing or empty alt unless marked decorative", () => {
    const pages = allPages();
    if (pages.length === 0) return;
    const bad: string[] = [];
    for (const url of pages) {
      for (const m of html(url).matchAll(/<img\b[^>]*>/g)) {
        const tag = m[0];
        const decorative = /aria-hidden="true"|role="presentation"/.test(tag);
        const alt = /\balt="([^"]*)"/.exec(tag);
        if (!alt) {
          bad.push(`${url}: <img> with no alt attribute - ${tag.slice(0, 90)}`);
        } else if (alt[1].trim() === "" && !decorative) {
          bad.push(`${url}: empty alt, not marked decorative - ${tag.slice(0, 90)}`);
        }
      }
    }
    expect(
      bad.slice(0, 20),
      `Images missing alt text:\n${bad.slice(0, 20).join("\n")}` +
        (bad.length > 20 ? `\n...and ${bad.length - 20} more` : ""),
    ).toEqual([]);
  });
});

/**
 * Heading outline: exactly one <h1> per page, and no level skipped.
 *
 * Seven pages jumped straight from <h2> to <h4> because card titles were
 * styled as h4 with no h3 between them and their section heading, and one
 * page put an h4 directly under the h1. A skipped level breaks the document
 * outline that screen readers and outline extractors (including the ones AI
 * crawlers use to segment a page) rely on.
 */
describe("heading outline", () => {
  it("every page has exactly one h1 and skips no heading level", () => {
    const pages = allPages();
    if (pages.length === 0) return;
    const problems: string[] = [];
    for (const url of pages) {
      const raw = html(url).replace(/<script[\s\S]*?<\/script>/g, " ");
      const main = /<main\b[^>]*>([\s\S]*?)<\/main>/.exec(raw);
      if (!main) continue;
      const levels = [...main[1].matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
      const h1s = levels.filter((l) => l === 1).length;
      if (h1s !== 1) problems.push(`${url}: ${h1s} <h1> elements inside <main> (want exactly 1)`);
      let prev: number | null = null;
      for (const lv of levels) {
        if (prev !== null && lv > prev + 1) {
          problems.push(`${url}: heading level jumps h${prev} -> h${lv}`);
          break;
        }
        prev = lv;
      }
    }
    expect(problems, `Heading outline problems:\n${problems.join("\n")}`).toEqual([]);
  });
});

/**
 * No meta key may appear twice in <head>.
 *
 * index.html carries the site-wide og:image, and 83 components ALSO emitted an
 * identical og:image through Helmet - which does not dedupe against tags that
 * were already static in the shell. Every affected page shipped two og:image
 * tags. Same value, so nothing visibly broke, but it is a validation error and
 * the day someone sets a per-page image it becomes a real conflict.
 */
describe("head metadata is not duplicated", () => {
  it("no meta property/name appears more than once per page", () => {
    const pages = allPages();
    if (pages.length === 0) return;
    const problems: string[] = [];
    for (const url of pages) {
      const head = html(url).split("</head>")[0];
      const seen = new Map<string, string[]>();
      for (const m of head.matchAll(/<meta (?:property|name)="([^"]+)" content="([^"]*)"/g)) {
        seen.set(m[1], [...(seen.get(m[1]) ?? []), m[2]]);
      }
      for (const [key, values] of seen) {
        if (values.length > 1) {
          const same = new Set(values).size === 1;
          problems.push(
            `${url}: <meta ${key}> appears ${values.length}x` +
              (same ? " (identical values)" : ` with DIFFERENT values: ${values.join(" | ")}`),
          );
        }
      }
    }
    expect(
      problems.slice(0, 15),
      `Duplicate head metadata:\n${problems.slice(0, 15).join("\n")}` +
        (problems.length > 15 ? `\n...and ${problems.length - 15} more` : ""),
    ).toEqual([]);
  });
});

/**
 * The local notes must not converge on a house formula.
 *
 * A final reader over all 71 newly written notes found the individual notes
 * good and the SET formulaic: ten closed on "entry mats and the first N metres
 * of hallway", seven on a "two sides, two jobs" epigram, twelve on "a fine
 * [grey/pale/dark] dust", eight on "light finds every streak", and ten carried
 * the identical pricing sentence "Flat rates by home size, no trip fee, quoted
 * before you book" - which the pricing section of every page already says.
 *
 * Read one at a time that is invisible. Read as a set - which is how a
 * duplicate-content check reads them - the template is louder than the local
 * knowledge, which defeats the entire reason these notes exist.
 */
describe("local notes do not share a formula", () => {
  const NOTES_DIR = join(__dirname, "..", "pages", "locations");
  const MAX_NOTES_SHARING_A_SENTENCE = 2;
  const MAX_NOTES_SHARING_A_PHRASE = 6;

  /** The note text on each location page, however it is passed in. */
  function noteTexts(): Map<string, string> {
    const out = new Map<string, string>();
    if (!existsSync(NOTES_DIR)) return out;
    for (const file of readdirSync(NOTES_DIR).filter((f) => f.endsWith(".tsx"))) {
      const src = readFileSync(join(NOTES_DIR, file), "utf-8");
      const block =
        /<LocalMarketNote([\s\S]*?)\/>/.exec(src) ?? /localNote=\{\{([\s\S]*?)\n {6}\}\}/.exec(src);
      if (!block) continue;
      const paragraphs = [...block[1].matchAll(/"([^"]{60,}?)"/g)].map((m) => m[1]);
      if (paragraphs.length) out.set(file.replace(/\.tsx$/, ""), paragraphs.join(" "));
    }
    return out;
  }

  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z ]/g, "").replace(/\s+/g, " ").trim();

  it("no sentence is reused across notes", () => {
    const notes = noteTexts();
    if (notes.size === 0) return;
    const owners = new Map<string, Set<string>>();
    for (const [slug, text] of notes) {
      for (const raw of text.split(/(?<=[.!?])\s+/)) {
        if (raw.split(/\s+/).length < 10) continue;
        const key = normalize(raw);
        if (!key) continue;
        owners.set(key, (owners.get(key) ?? new Set()).add(slug));
      }
    }
    const shared = [...owners.entries()]
      .filter(([, s]) => s.size > MAX_NOTES_SHARING_A_SENTENCE)
      .map(([k, s]) => `${s.size} notes share "${k.slice(0, 90)}" — ${[...s].sort().slice(0, 6).join(", ")}`);
    expect(
      shared,
      `Local notes share a sentence:\n${shared.join("\n")}\n` +
        `A sentence true of several neighbourhoods is not local knowledge; move it to the shared page copy or rewrite it.`,
    ).toEqual([]);
  });

  it("no distinctive phrase runs through more than a handful of notes", () => {
    const notes = noteTexts();
    if (notes.size === 0) return;
    const owners = new Map<string, Set<string>>();
    for (const [slug, text] of notes) {
      const words = normalize(text).split(" ");
      for (let i = 0; i + 6 <= words.length; i++) {
        const key = words.slice(i, i + 6).join(" ");
        owners.set(key, (owners.get(key) ?? new Set()).add(slug));
      }
    }
    const shared = [...owners.entries()]
      .filter(([, s]) => s.size > MAX_NOTES_SHARING_A_PHRASE)
      .sort((a, b) => b[1].size - a[1].size)
      .slice(0, 10)
      .map(([k, s]) => `${s.size} notes: "${k}"`);
    expect(
      shared,
      `A phrase runs through too many local notes:\n${shared.join("\n")}\n` +
        `Vary the wording — these pages are measured against each other.`,
    ).toEqual([]);
  });
});

/**
 * A button that promises a price must lead to the price.
 *
 * Twenty-six CTAs across the site were labelled "See My Instant Price", "Get
 * Started", "Book Your Cleaning" or "Get Free Estimate" and pointed at
 * /contact-us/ — a message form headed "Get In Touch" — or at an on-page
 * #contact-form anchor. Ten of them sat on /pricing/, the highest-intent page
 * on the site. The move-out pages put one directly under the words "Instant
 * pricing. No phone call required."
 *
 * The quote overlay intercepts clicks only on hrefs matching /#quote(-form)?$/,
 * so a contact link is never upgraded at runtime — it just navigates. That is
 * why this has to be checked on the rendered output rather than trusted to the
 * component layer: PricingOptionCard was fixed for exactly this reason and its
 * three siblings kept the old target for months afterwards.
 */
describe("price CTAs reach the price", () => {
  /**
   * Wording that promises an immediate NUMBER, which only the funnel can give.
   *
   * "Free estimate" is deliberately NOT here. Commercial work is quoted per
   * hour after a conversation, so its "Get Free Estimate" button genuinely
   * belongs on the contact form — the label promises an estimate, not an
   * instant price, and it keeps that promise. Narrowing this pattern is the
   * difference between a guard that protects the funnel and one that would
   * push honest copy into the wrong place.
   */
  const PROMISES_A_PRICE = /instant price|instant quote|see pricing|book your cleaning/i;

  /** Destinations that cannot show a price. */
  const CANNOT_PRICE = /contact-us|#contact-form/;

  it("no CTA that promises a price opens a contact form", () => {
    const pages = allPages();
    if (pages.length === 0) return;
    const bad: string[] = [];
    for (const url of pages) {
      const raw = html(url).replace(/<script[\s\S]*?<\/script>/g, " ");
      const main = /<main\b[^>]*>([\s\S]*?)<\/main>/.exec(raw);
      if (!main) continue;
      // Strip icons before measuring. A CTA with an inline <svg> arrow renders
      // an anchor body well past a short cap, and one such button ("Book Your
      // Cleaning", closing the how-it-works section on /locations/) hid from an
      // earlier version of this guard for exactly that reason.
      const body = main[1].replace(/<svg[\s\S]*?<\/svg>/g, " ");
      for (const m of body.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]{0,400}?)<\/a>/g)) {
        const href = m[1];
        const text = m[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
        if (PROMISES_A_PRICE.test(text) && CANNOT_PRICE.test(href)) {
          bad.push(`${url}: "${text.slice(0, 46)}" -> ${href}`);
        }
      }
    }
    expect(
      bad,
      `These buttons promise a price and open a contact form instead:\n${bad.join("\n")}\n` +
        `Point them at quoteHrefFor(pathname) or "#quote" so the overlay opens. ` +
        `Commercial work is the one honest exception — it is quoted per hour after a ` +
        `conversation — and its buttons do not use this wording.`,
    ).toEqual([]);
  });

  /**
   * Volume claims the business cannot source.
   *
   * proof.ts keeps the customer total null on purpose and says so in a comment:
   * never a made-up total. Four separate phrasings had leaked past it anyway —
   * "hundreds of happy clients each month", "thousands of satisfied customers",
   * "trusted by thousands of Alberta families" on 150 location pages, and
   * "thousands of Edmonton and Calgary homes a year", which the site's own
   * 5,000-since-2017 figure puts at roughly 700.
   *
   * "Verified Google reviews" is here for a different reason: Google does not
   * verify reviews, so the phrase claims a check nobody performed.
   *
   * Scoped counts read from proof.ts ("5,000+ Alberta homes cleaned") are fine
   * and are what these were replaced with — the pattern only matches the vague
   * plural, which is the form that cannot be checked.
   */
  const UNSOURCED_VOLUME = [
    /\bthousands of\b/i,
    /\bhundreds of (?:happy|satisfied)\b/i,
    /\bmost trusted\b/i,
    /verified google reviews/i,
  ];

  it("publishes no volume claim the business cannot source", () => {
    const pages = allPages();
    if (pages.length === 0) return;
    const bad: string[] = [];
    for (const url of pages) {
      const raw = html(url).replace(/<script[\s\S]*?<\/script>/g, " ");
      const text = raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
      for (const pattern of UNSOURCED_VOLUME) {
        const hit = pattern.exec(text);
        if (hit) bad.push(`${url}: "${text.slice(Math.max(0, hit.index - 30), hit.index + 50).trim()}"`);
      }
    }
    expect(
      bad,
      `These pages claim a volume nobody can check:\n${bad.join("\n")}\n` +
        `Use a scoped figure from proof.ts (HOMES_CLEANED, CITY_PROOF.googleReviewCount) ` +
        `or drop the claim. The owner has not confirmed a customer total, which is why ` +
        `proof.ts holds it null.`,
    ).toEqual([]);
  });

  /**
   * Ratings rounded up to five.
   *
   * proof.ts records the real figure as 4.9 and carries the history: the site
   * once said "Five-Star Rated" on 170 pages, which rounded 4.9 into a number
   * the business has not earned. That sweep fixed the phrase and missed two
   * "5★" badges in BrandHome, which then printed five stars three lines below
   * "4.9 on Google" on /locations/.
   *
   * /reviews/ is exempt: it quotes customers verbatim and two real reviewers
   * wrote "5★" themselves. Editing a quoted review to satisfy a guard would be
   * misquoting a real person.
   */
  const ROUNDED_RATING = [
    /\b5\u2605/,
    /\b5\u2606/,
    /five-star rated/i,
    /\b5(?:\.0)? out of 5\b/i,
    /\brated 5(?:\.0)? on google/i,
  ];

  /** Quotes real reviewers verbatim, so their own words stand. */
  const RATING_EXEMPT = new Set(["/reviews/"]);

  it("never rounds the 4.9 Google rating up to five", () => {
    const pages = allPages();
    if (pages.length === 0) return;
    const bad: string[] = [];
    for (const url of pages) {
      if (RATING_EXEMPT.has(url)) continue;
      const text = mainText(url);
      for (const pattern of ROUNDED_RATING) {
        const hit = pattern.exec(text);
        if (hit)
          bad.push(
            `${url}: "${text.slice(Math.max(0, hit.index - 40), hit.index + 40).trim()}"`,
          );
      }
    }
    expect(
      bad,
      `These pages round the rating up to five:\n${bad.join("\n")}\n` +
        `The real figure is CITY_PROOF.<city>.googleRating (4.9), and RATING_CLAIM ` +
        `holds the sourced phrase. Use those instead of a star count.`,
    ).toEqual([]);
  });

  /**
   * Alt text claiming a named real place.
   *
   * Six location pages captioned generated images with real Alberta landmarks
   * — Nose Creek Park, Four Seasons Park, Chestermere Lake, Patricia Lake, the
   * Devon river trail, and the St. Albert Farmers' Market. That last image was
   * a fabricated building whose sign read "FARMS MAKT / SIT. ALBERT" beneath a
   * dozen United States flags, served as the page's LCP element.
   *
   * The site already refuses to present generated imagery as documentary on
   * the Airbnb, wall-washing, post-construction and homepage galleries. Alt
   * text was the surface that decision never reached.
   *
   * The pattern matches the shape those captions took — "<Proper Noun> in|at|
   * along <Proper Noun>". All 285 distinct alt strings in dist were checked
   * against it before this guard was added; none of the legitimate ones match.
   */
  const LANDMARK_ALT =
    /^[A-Z][A-Za-z'\u2019.-]*(?: [A-Z][A-Za-z'\u2019.-]*){0,3} (?:in|at|along) [A-Z]/;

  it("no image alt claims to be a named real place", () => {
    const pages = allPages();
    if (pages.length === 0) return;
    const bad: string[] = [];
    for (const url of pages) {
      for (const m of html(url).matchAll(/alt="([^"]*)"/g)) {
        if (LANDMARK_ALT.test(m[1])) bad.push(`${url}: alt="${m[1]}"`);
      }
    }
    expect(
      bad,
      `These images claim to be a named real place:\n${bad.join("\n")}\n` +
        `The photography is generated until the real shoot lands, so an alt must ` +
        `describe the scene ("A neighbourhood park with a playground") rather ` +
        `than name a landmark it is not.`,
    ).toEqual([]);
  });

  /**
   * Price lists that never mention tax.
   *
   * /pricing/ said "before 5% GST" three times while the four pages search
   * actually lands on — deep, standard and recurring cleaning, and /services/
   * — printed a full ladder and said it nowhere. policy.ts: "Every quoted
   * figure is before tax. GST of 5% is added on top." A $485 five-bedroom deep
   * clean bills at $509.25, first seen inside the booking form.
   *
   * Three figures is the threshold: a page mentioning one price in passing is
   * not a price list.
   */
  it("any page listing prices says they exclude GST", () => {
    const pages = allPages();
    if (pages.length === 0) return;
    const bad: string[] = [];
    for (const url of pages) {
      const text = mainText(url);
      const prices = text.match(/\$\d{2,4}(?:\.\d\d)?/g) ?? [];
      if (prices.length >= 3 && !/\bGST\b/.test(text)) {
        bad.push(`${url}: ${prices.length} prices, no mention of GST`);
      }
    }
    expect(
      bad,
      `These pages list prices without saying they exclude tax:\n${bad.join("\n")}\n` +
        `policy.ts: every quoted figure is before tax, GST of 5% on top. Add the ` +
        `line beside the prices — ServiceDetailPage already renders one for any ` +
        `page using its pricing ladder.`,
    ).toEqual([]);
  });
});
