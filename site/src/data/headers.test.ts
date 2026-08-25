import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

/**
 * public/_headers pins a sha256 for the inline bootstrap script in index.html.
 * Editing that script by a single character invalidates the hash, and the only
 * symptom would be a CSP report today — or, once the policy is enforced, the
 * scroll-reveal guard silently failing to run on every page.
 *
 * Vite copies the inline script through verbatim, so hashing the source file
 * gives the same digest the browser computes over the served HTML.
 */

const ROOT = join(__dirname, "..", "..");
const html = readFileSync(join(ROOT, "index.html"), "utf-8");
const headers = readFileSync(join(ROOT, "public", "_headers"), "utf-8");

describe("_headers", () => {
  it("pins the current hash of the inline bootstrap script", () => {
    const match = html.match(/<script>([\s\S]*?)<\/script>/);
    expect(match, "index.html has no inline <script> to hash").toBeTruthy();

    const digest = `sha256-${createHash("sha256").update(match![1], "utf8").digest("base64")}`;
    expect(
      headers,
      `_headers does not carry ${digest}. The inline script in index.html changed; ` +
        "update the script-src hash in public/_headers to match.",
    ).toContain(digest);
  });

  it("allows every third-party origin the site actually loads", () => {
    // Each of these is embedded somewhere in the site; omitting one from the
    // policy would break that embed the moment CSP is enforced.
    for (const origin of [
      "https://api.bookin60.com", // HighLevel quote form
      "https://www.google.com", // Maps embeds on the location pages
      "https://dutycleaners.bookingkoala.com", // booking handoff
      "openstreetmap.org", // Leaflet coverage-map tiles
    ]) {
      expect(headers, `${origin} is not allowed by the CSP`).toContain(origin);
    }
  });

  it("keeps CSP in report-only until the allowlist is confirmed", () => {
    // Guards against enforcing by accident. Flipping this is a deliberate step:
    // delete this assertion in the same change that renames the header.
    expect(headers).toContain("Content-Security-Policy-Report-Only:");
  });

  it("does not cache HTML immutably", () => {
    // Prerendered HTML keeps its filename across deploys, so an immutable
    // Cache-Control would pin visitors to a stale build.
    const htmlBlock = headers.slice(headers.indexOf("/*.html"));
    expect(htmlBlock).toContain("must-revalidate");
    expect(htmlBlock.slice(0, 120)).not.toContain("immutable");
  });
});
