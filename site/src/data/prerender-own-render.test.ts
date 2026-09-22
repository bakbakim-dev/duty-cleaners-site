import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { ownRenderProblem, shellTitleOf } from "../../scripts/own-render.mjs";

/**
 * Every prerendered page must be its route's own render.
 *
 * Twice on 2026-09-22 `prerender.mjs --all` wrote pages carrying the SPA
 * shell's head (shell title, no meta description, no canonical) and still
 * reported "210 ok, 0 failed": /cleaning-services-red-deer/ once,
 * /edmonton/regular-cleaning/ and /locations/tamarack-edmonton/ the next time.
 * Its only check was "the snapshot has an <h1>", and a snapshot dumped before
 * the route's lazy chunk and Helmet had run (or with the load-error boundary
 * showing its own <h1>) passes that. content-dates then reported the pages as
 * changed and ~35 dist tests failed.
 *
 * scripts/own-render.mjs now decides whether a snapshot is the route's own
 * render; prerender.mjs retries one that is not and fails the run if a route
 * never renders. Like the embed guard, the unit tests matter more than the dist
 * test: the race is rare, so dist usually holds the happy path whether or not
 * the check works.
 */

const ROUTE = "/edmonton/regular-cleaning/";
const SHELL_TITLE = "Duty Cleaners | House Cleaning in Edmonton &amp; Calgary";

const page = (head: string, body: string) =>
  `<!DOCTYPE html><html lang="en-CA"><head><meta charset="UTF-8">${head}</head><body><div id="root">${body}</div></body></html>`;

const OWN = page(
  `<title>One-Time Standard &amp; Maid Cleaning Edmonton | Duty Cleaners</title>` +
    `<meta name="description" content="x" data-rh="true">` +
    `<link rel="canonical" href="https://dutycleaners.ca${ROUTE}" data-rh="true">`,
  `<main><h1>Regular cleaning in Edmonton</h1></main>`,
);

describe("ownRenderProblem: snapshots the old <h1> check let through", () => {
  it("accepts the route's own render", () => {
    expect(ownRenderProblem(OWN, ROUTE, SHELL_TITLE)).toBeNull();
  });

  it("rejects the shell head with a body <h1> (the 2026-09-22 pages)", () => {
    const shellHead = page(`<title>${SHELL_TITLE}</title>`, `<main><h1>Regular cleaning in Edmonton</h1></main>`);
    expect(ownRenderProblem(shellHead, ROUTE, SHELL_TITLE)).toMatch(/canonical/);
  });

  it("rejects the load-error boundary", () => {
    const boundary = page(
      `<title>${SHELL_TITLE}</title>`,
      `<main data-load-error="true"><div role="alert"><h1>We couldn’t load this page</h1></div></main>`,
    );
    expect(ownRenderProblem(boundary, ROUTE, SHELL_TITLE)).not.toBeNull();
    // Even if a stale canonical somehow survived, the boundary marker still fails it.
    const withCanonical = boundary.replace("</head>", `<link rel="canonical" href="https://dutycleaners.ca${ROUTE}"></head>`);
    expect(ownRenderProblem(withCanonical.replace(SHELL_TITLE, "Other"), ROUTE, SHELL_TITLE)).toMatch(/load-error/);
  });

  it("rejects another route's canonical, two canonicals, or a missing trailing slash", () => {
    expect(ownRenderProblem(OWN.replace(ROUTE, "/"), ROUTE, SHELL_TITLE)).toMatch(/canonical is/);
    expect(ownRenderProblem(OWN.replace("</head>", `<link href="https://dutycleaners.ca/" rel="canonical"></head>`), ROUTE, SHELL_TITLE)).toMatch(/2 rel=canonical/);
    expect(ownRenderProblem(OWN, "/edmonton/regular-cleaning", SHELL_TITLE)).toMatch(/canonical is/);
  });

  it("rejects the Suspense fallback (no <h1>) and the shell's own title", () => {
    expect(ownRenderProblem(OWN.replace(/<h1>[^<]*<\/h1>/, `<div role="status">Loading page…</div>`), ROUTE, SHELL_TITLE)).toMatch(/<h1>/);
    const shellTitled = OWN.replace(/<title>[^<]*<\/title>/, "<title>Duty Cleaners | House Cleaning in Edmonton & Calgary</title>");
    expect(ownRenderProblem(shellTitled, ROUTE, SHELL_TITLE)).toMatch(/shell/);
  });

  it("reads the canonical whatever order Chrome serialises its attributes in", () => {
    const reordered = OWN.replace(
      `<link rel="canonical" href="https://dutycleaners.ca${ROUTE}" data-rh="true">`,
      `<link data-rh="true" href="https://dutycleaners.ca${ROUTE}" rel="canonical">`,
    );
    expect(ownRenderProblem(reordered, ROUTE, SHELL_TITLE)).toBeNull();
  });
});

describe("prerender.mjs gates every snapshot on its own render", () => {
  const source = readFileSync(join(__dirname, "../../scripts/prerender.mjs"), "utf-8");

  it("prerender.mjs rejects a snapshot that is not the route's own render", () => {
    // The check must run on each capture, with the route and the shell's title.
    expect(source).toMatch(/const problem = ownRenderProblem\(html, route, SHELL_TITLE\);\s*if \(problem\) \{/);
    expect(source).toMatch(/const SHELL_TITLE = shellTitleOf\(shell\);/);
    // And a route that never passes is counted as failed, which sets the exit code.
    expect(source).toMatch(/if \(attempt >= ATTEMPTS\) throw new Error/);
    expect(source).toMatch(/if \(failed > 0\) process\.exitCode = 1;/);
  });
});

const DIST = join(__dirname, "../../dist");
const built = existsSync(join(DIST, "spa-shell.html"));

describe.skipIf(!built)("dist: every sitemap route is its own render", () => {
  it("every prerendered sitemap page carries its own canonical, title and <h1>", () => {
    const shellTitle = shellTitleOf(readFileSync(join(DIST, "spa-shell.html"), "utf-8"));
    const routes = [
      ...new Set(
        readdirSync(DIST)
          .filter((f) => /^sitemap-.*\.xml$/.test(f))
          .flatMap((f) =>
            [...readFileSync(join(DIST, f), "utf-8").matchAll(/<loc>https:\/\/dutycleaners\.ca([^<]*)<\/loc>/g)].map((m) => m[1] || "/"),
          ),
      ),
    ];
    expect(routes.length).toBeGreaterThan(200);
    const problems = routes
      .map((route) => {
        const file = join(DIST, route, "index.html");
        if (!existsSync(file)) return `${route}: not prerendered`;
        const problem = ownRenderProblem(readFileSync(file, "utf-8"), route, shellTitle);
        return problem && `${route}: ${problem}`;
      })
      .filter(Boolean);
    expect(problems).toEqual([]);
  });
});
