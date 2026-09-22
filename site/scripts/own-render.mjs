// Is a --dump-dom snapshot the route's OWN render, or something else that
// happens to have an <h1>?
//
// prerender.mjs used to accept any snapshot with an <h1>. On 2026-09-22 two
// full runs each wrote pages (/cleaning-services-red-deer/ once;
// /edmonton/regular-cleaning/ and /locations/tamarack-edmonton/ the next time)
// that carried the SPA shell's head instead: the shell's title, no meta
// description, no canonical. Both runs still printed "210 ok, 0 failed".
// Headless Chrome had failed to fetch a module of the route's lazy chunk, so
// LoadErrorBoundary put up its own <h1> and react-helmet-async never wrote the
// route's head (the trace is in prerender.mjs, above renderOnce).
//
// Every sitemap route renders exactly one canonical pointing at itself, and
// nothing else a snapshot can contain does: not the shell, not the Suspense
// fallback, not the load-error boundary, not NotFound. So that is the test.
// prerender.mjs retries a snapshot that fails it and counts the route as failed
// (non-zero exit) if it never passes. Guarded in src/data/prerender-own-render.test.ts.

export const SITE_ORIGIN = "https://dutycleaners.ca";

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*"([^"]*)"`, "i"));
  return m ? m[1] : null;
};

/**
 * Why `html` is not `route`'s own render, or null when it is.
 * @param {string} html   Chrome's --dump-dom output.
 * @param {string} route  The site-relative route, e.g. "/edmonton/regular-cleaning/".
 * @param {string} [shellTitle] The SPA shell's <title> text, which no real page uses.
 */
export function ownRenderProblem(html, route, shellTitle) {
  const want = SITE_ORIGIN + route;
  const canonicals = [...html.matchAll(/<link\b[^>]*>/gi)]
    .map((m) => m[0])
    .filter((tag) => (attr(tag, "rel") || "").toLowerCase() === "canonical");
  if (canonicals.length === 0) return "no rel=canonical (the route's head never rendered)";
  if (canonicals.length > 1) return `${canonicals.length} rel=canonical links`;
  const href = attr(canonicals[0], "href");
  if (href !== want) return `canonical is ${href}, not ${want}`;

  if (!/<h1[\s>]/i.test(html)) return "no <h1> in rendered output";
  if (/data-load-error="true"/.test(html)) return "the load-error boundary rendered instead of the page";

  const titles = [...html.matchAll(/<title\b[^>]*>([^<]*)<\/title>/gi)].map((m) => m[1].trim());
  if (titles.length !== 1) return `${titles.length} <title> elements`;
  if (shellTitle && decode(titles[0]) === decode(shellTitle.trim())) return "the title is still the SPA shell's";
  return null;
}

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"');

/** The shell's <title> text, read from dist/spa-shell.html. */
export function shellTitleOf(shellHtml) {
  const m = shellHtml.match(/<title\b[^>]*>([^<]*)<\/title>/i);
  return m ? m[1].trim() : null;
}
