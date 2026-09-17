/**
 * Settle third-party embeds in a prerendered snapshot to their loaded state.
 *
 * A third-party embed (the BookingKoala gift-card form) hides its iframe behind a
 * "Loading…" placeholder until the iframe's load event fires. That event comes
 * from another company's server, so whether it lands before --dump-dom is a
 * network race, not a property of the build. Two full builds of identical code
 * froze /gift-card once loaded and once as "Loading the gift card form…" with the
 * iframe display:none. The page's content fingerprint flipped with it, so no
 * approved revision date could stick and the deploy gate failed at random.
 *
 * The loaded state is the one to ship, and not only because a crawler should not
 * read "Loading…" as the page. In the loading state the iframe is display:none, so
 * a reader whose bundle never boots — exactly who the snapshot is for — gets a
 * placeholder that never resolves and cannot buy a card at all. A visible iframe
 * works without any of the page's JavaScript.
 *
 * This rewrites the snapshot only, like prerender.mjs's scroll-reveal rewrite: the
 * client render still starts busy and swaps the form in on load. Both race
 * outcomes serialise to the same bytes afterwards.
 *
 * It lives in its own module because the branch that does the work only runs
 * when the network is slow. A guard that reads dist almost always sees a snapshot
 * that loaded in time, so it would pass with this rewrite completely broken;
 * prerender-embeds.test.ts exercises the rewrite directly instead.
 *
 * It matches the data-embed-* markers, never the placeholder's wording or its
 * classes, so rewording the copy cannot silently disable it. Opening tags are
 * matched whole and then tested, so nothing depends on the order Chrome
 * serialises attributes in.
 */

const SHELL = /<div\b[^>]*\bdata-embed-shell\b[^>]*>/g;
const PLACEHOLDER = /<p\b[^>]*\bdata-embed-placeholder\b[^>]*>[\s\S]*?<\/p>/g;
const FRAME = /<iframe\b[^>]*\bdata-embed-frame\b[^>]*>/g;

/**
 * @param {string} html a prerendered snapshot
 * @returns {{ html: string, settled: boolean, frozen: boolean }}
 *   `settled` — the rewrite changed something; `frozen` — an embed is still mid-load
 *   afterwards, which is a build failure.
 */
export function settleEmbeds(html) {
  let settled = false;
  let out = html.replace(SHELL, (tag) => {
    if (!tag.includes('aria-busy="true"')) return tag;
    settled = true;
    return tag.replace('aria-busy="true"', 'aria-busy="false"');
  });
  out = out.replace(PLACEHOLDER, () => {
    settled = true;
    return "";
  });
  out = out.replace(FRAME, (tag) => {
    if (!/display:\s*none/.test(tag)) return tag;
    settled = true;
    return tag.replace(/display:\s*none/, "display: block");
  });
  return { html: out, settled, frozen: isEmbedFrozen(out) };
}

/**
 * True when any marked embed in the snapshot is still in its loading state.
 *
 * @param {string} html
 * @returns {boolean}
 */
export function isEmbedFrozen(html) {
  return (
    /\bdata-embed-placeholder\b/.test(html) ||
    (html.match(SHELL) ?? []).some((tag) => tag.includes('aria-busy="true"')) ||
    (html.match(FRAME) ?? []).some((tag) => /display:\s*none/.test(tag))
  );
}
