import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { settleEmbeds } from "../../scripts/settle-embeds.mjs";

/**
 * Third-party embeds must ship their loaded state in the prerendered snapshot.
 *
 * The BookingKoala gift-card form hides its iframe behind "Loading the gift card
 * form…" until the iframe's load event fires, and that event comes from
 * BookingKoala's server. So whether it landed before the prerender took its
 * snapshot was a network race: two full builds of identical code froze /gift-card
 * once loaded and once mid-load, with the iframe display:none.
 *
 * Two things broke. The page's content fingerprint changed from build to build,
 * so no approved revision date could stick and the deploy gate failed at random.
 * And in the frozen loading state the purchase form was hidden, so a reader whose
 * JavaScript never ran — exactly who the snapshot is for — could not buy a card.
 *
 * scripts/settle-embeds.mjs settles every data-embed-* marker to the loaded state.
 *
 * WHY THE UNIT TESTS MATTER MORE THAN THE DIST TESTS. The rewrite only does work
 * when the network is slow. Three consecutive builds all loaded the form in time,
 * so the rewrite fired on zero pages and dist held the happy path every time. A
 * guard that only reads dist would pass with the rewrite completely broken. The
 * first describe block feeds it a snapshot caught mid-load on purpose.
 */

const EMBED_URL = "https://dutycleaners.bookingkoala.com/gift-cards/send?embed=true";
const PLACEHOLDER =
  '<p class="flex min-h-[400px] items-center justify-center px-6 text-center text-lg font-semibold text-foreground" data-embed-placeholder="true">Loading the gift card form…</p>';
const STYLE = "border-width: medium; border-style: none; width: 100%; min-height: 1500px;";

/** The two race outcomes, shaped the way Chrome's --dump-dom serialised them. */
const loaded = (shellAttrs: string, frameAttrs: string) =>
  `<div class="rounded-2xl border border-border/60 bg-card" ${shellAttrs}>` +
  `<iframe ${frameAttrs}></iframe></div>`;

describe("settleEmbeds: a snapshot caught mid-load", () => {
  const LOADED = loaded(
    'aria-busy="false" data-embed-shell="true"',
    `data-embed-frame="true" src="${EMBED_URL}" style="display: block; ${STYLE}"`,
  );
  const MID_LOAD =
    `<div class="rounded-2xl border border-border/60 bg-card" aria-busy="true" data-embed-shell="true">` +
    PLACEHOLDER +
    `<iframe data-embed-frame="true" src="${EMBED_URL}" style="display: none; ${STYLE}"></iframe></div>`;

  it("settles a snapshot caught mid-load into exactly the loaded bytes", () => {
    const result = settleEmbeds(MID_LOAD);
    // Byte-identical is the whole point: anything less and the fingerprint still
    // depends on which way the race went.
    expect(result.html).toBe(LOADED);
    expect(result.settled).toBe(true);
    expect(result.frozen).toBe(false);
  });

  it("does not depend on the order Chrome serialises attributes in", () => {
    const reordered =
      `<div class="rounded-2xl border border-border/60 bg-card" data-embed-shell="true" aria-busy="true">` +
      PLACEHOLDER +
      `<iframe style="display: none; ${STYLE}" src="${EMBED_URL}" data-embed-frame="true"></iframe></div>`;
    const expected = loaded(
      'data-embed-shell="true" aria-busy="false"',
      `style="display: block; ${STYLE}" src="${EMBED_URL}" data-embed-frame="true"`,
    );
    const result = settleEmbeds(reordered);
    expect(result.html).toBe(expected);
    expect(result.frozen).toBe(false);
  });

  it("leaves a snapshot that loaded in time untouched", () => {
    const result = settleEmbeds(LOADED);
    expect(result.html).toBe(LOADED);
    expect(result.settled).toBe(false);
    expect(result.frozen).toBe(false);
  });

  it("leaves unmarked markup alone, however busy it looks", () => {
    // It must only touch what a component deliberately marked.
    const unmarked = '<div aria-busy="true"><p>Loading…</p><iframe style="display: none;"></iframe></div>';
    const result = settleEmbeds(unmarked);
    expect(result.html).toBe(unmarked);
    expect(result.settled).toBe(false);
  });
});

const DIST = join(__dirname, "..", "..", "dist");

function builtPages(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) builtPages(p, out);
    else if (name === "index.html") out.push(p);
  }
  return out;
}

describe("third-party embeds in the built site", () => {
  it("a real mid-load gift-card snapshot settles to exactly the built page", () => {
    // The fixtures above are shaped like Chrome's output; this uses Chrome's
    // actual output. Rebuild the mid-load state from the real page — busy, the
    // placeholder back in, the form hidden — and require the rewrite to return
    // the page byte for byte.
    if (!existsSync(DIST)) return;
    const built = readFileSync(join(DIST, "gift-card", "index.html"), "utf-8");
    const shell = built.match(/<div\b[^>]*\bdata-embed-shell\b[^>]*>/)?.[0];
    const frame = built.match(/<iframe\b[^>]*\bdata-embed-frame\b[^>]*>/)?.[0];
    expect(shell, "the gift-card embed shell").toBeTruthy();
    expect(frame, "the gift-card embed iframe").toBeTruthy();

    const midLoad = built
      .replace(shell!, shell!.replace('aria-busy="false"', 'aria-busy="true"') + PLACEHOLDER)
      .replace(frame!, frame!.replace(/display:\s*block/, "display: none"));
    expect(midLoad, "the reconstruction must actually differ from the built page").not.toBe(built);

    expect(settleEmbeds(midLoad).html).toBe(built);
  });

  it("no built page freezes an embed mid-load", () => {
    if (!existsSync(DIST)) return;
    const frozen: string[] = [];
    for (const file of builtPages(DIST)) {
      const html = readFileSync(file, "utf-8");
      const page = relative(DIST, file).replace(/\\/g, "/");
      if (/\bdata-embed-placeholder\b/.test(html)) frozen.push(`${page}: loading placeholder baked in`);
      for (const tag of html.match(/<div\b[^>]*\bdata-embed-shell\b[^>]*>/g) ?? []) {
        if (tag.includes('aria-busy="true"')) frozen.push(`${page}: embed still aria-busy`);
      }
      for (const tag of html.match(/<iframe\b[^>]*\bdata-embed-frame\b[^>]*>/g) ?? []) {
        if (/display:\s*none/.test(tag)) frozen.push(`${page}: embed iframe hidden`);
      }
    }
    expect(
      frozen,
      `Embeds frozen mid-load:\n${frozen.join("\n")}\n` +
        `This is a network race, so it comes and goes between builds. Check the ` +
        `data-embed-* markers in the component and scripts/settle-embeds.mjs.`,
    ).toEqual([]);
  });

  it("the gift-card page ships a visible purchase form", () => {
    // "No frozen embed" passes vacuously if the markers disappear, so this one
    // insists the embed is actually there, marked, and visible.
    if (!existsSync(DIST)) return;
    const file = join(DIST, "gift-card", "index.html");
    expect(existsSync(file), "dist/gift-card/index.html").toBe(true);
    const frame = readFileSync(file, "utf-8").match(/<iframe\b[^>]*\bdata-embed-frame\b[^>]*>/)?.[0];
    expect(frame, "the gift-card embed iframe, carrying data-embed-frame").toBeTruthy();
    expect(frame).toContain("gift-cards/send?embed=true");
    expect(frame, "the purchase form must be visible without JavaScript").toMatch(/display:\s*block/);
  });
});
