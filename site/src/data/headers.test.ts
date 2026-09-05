import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
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

  /**
   * The list above is hand-maintained, which is why it could not catch the one
   * that mattered: connect-src allowed api.bookin60.com — the HighLevel form
   * endpoint, dead for external posts since it started enforcing Turnstile —
   * while omitting the Supabase edge function every lead actually goes through.
   * Enforcing the policy in that state would have blocked the quote submission
   * on all 209 pages and lost every lead, and Report-Only would not have
   * stopped a single one of them, because it reports instead of blocking.
   *
   * So this derives the origins from the BUILT BUNDLE instead of trusting a
   * list: whatever the shipped JavaScript calls out to has to be in connect-src.
   */
  it("connect-src covers every origin the built bundle actually calls", () => {
    const dist = join(ROOT, "dist", "assets");
    if (!existsSync(dist)) return; // unbuilt tree; the hand list above still runs

    const called = new Set<string>();
    for (const file of readdirSync(dist)) {
      if (!file.endsWith(".js")) continue;
      const code = readFileSync(join(dist, file), "utf-8");
      for (const m of code.matchAll(/https:\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)+/gi)) {
        const origin = m[0];
        // Only origins the page opens a CONNECTION to belong in connect-src.
        // Schema/OG URLs, link hrefs and image hosts are covered by other
        // directives, so this narrows to the hosts the code fetches from.
        if (/supabase\.co|leadconnectorhq|bookin60|googleapis/.test(origin)) called.add(origin);
      }
    }
    expect(called.size, "no callable origins found in the bundle — has the build shape changed?")
      .toBeGreaterThan(0);

    // Read the directive off the POLICY LINE, not the file: the explanatory
    // comment above it also contains the words "connect-src", and matching the
    // whole file finds the prose first.
    // Two CSP headers ship: an enforced one carrying only frame-ancestors, and
    // the Report-Only full policy. Match the line that actually declares the
    // directive, not merely the first header whose name looks right — and not
    // the explanatory comment above it, which also says "connect-src".
    const policy =
      headers
        .split(/\r?\n/)
        .find(
          (line) =>
            /^\s*Content-Security-Policy(-Report-Only)?:/.test(line) && line.includes("connect-src"),
        ) ?? "";
    expect(policy, "no CSP line found in _headers").toBeTruthy();
    const connectSrc = /connect-src([^;]*)/.exec(policy)?.[1] ?? "";
    const missing = [...called].filter((origin) => !connectSrc.includes(origin));
    expect(
      missing,
      `the bundle calls ${missing.join(", ")} but connect-src does not allow it — ` +
        "enforcing this CSP would block those requests",
    ).toEqual([]);
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
