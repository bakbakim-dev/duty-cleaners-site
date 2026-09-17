import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The one-year immutable cache must stay scoped to /assets/, and it must stay
 * scoped through a mechanism this host actually honours.
 *
 * public/.htaccess used to draw that line with a second block layered after
 * the FilesMatch rule: `<If "%{REQUEST_URI} =~ m#^/assets/#">`. Verified live
 * against mikaily131.sg-host.com on 2026-09-17: that <If> did not scope to
 * /assets/ at all. It fired for every request, its Header set ran last, and
 * it clobbered the FilesMatch value site-wide — logo.png and favicon.ico both
 * came back "max-age=31536000" instead of the intended hourly revalidation.
 * Nothing local could have caught this: the build, the prerender and the rest
 * of this suite never read a response header from a real Apache server. Only
 * curl against the live host showed it.
 *
 * The fix reuses the one pattern already proven to scope correctly on that
 * host — SetEnvIf + Header's own env= condition, the same shape
 * DUTY_STAGING_HOST already uses for X-Robots-Tag. Two Header directives on
 * the SAME FilesMatch block, gated by env=DUTY_HASHED_ASSET and its negation,
 * so there is no second block that can run after the first and win.
 */
const HTACCESS = readFileSync(join(__dirname, "..", "..", "public", ".htaccess"), "utf-8");
// Active directives only. The generator's own explanatory comment names the
// old <If> block by quoting it, so checking the raw text would fail on the
// very comment written to warn against bringing it back.
const ACTIVE_LINES = HTACCESS.split(/\r?\n/)
  .filter((l) => !l.trim().startsWith("#"))
  .join("\n");

describe("the /assets/ immutable cache stays scoped to /assets/", () => {
  it("never emits an <If> block — proven not to scope correctly on this host", () => {
    expect(ACTIVE_LINES).not.toMatch(/<If\b/);
  });

  it("marks /assets/ requests with SetEnvIf, not the broken expression engine", () => {
    expect(HTACCESS).toMatch(/SetEnvIf\s+Request_URI\s+"[^"]*\/assets\/[^"]*"\s+DUTY_HASHED_ASSET=1/);
  });

  it("the immutable and the hourly Cache-Control sit in the SAME FilesMatch, split only by env=", () => {
    const block = /<FilesMatch\s+"[^"]*\(js\|css\|woff[^"]*">[\s\S]*?<\/FilesMatch>/.exec(HTACCESS)?.[0];
    expect(block, "the hashed-asset FilesMatch block").toBeTruthy();
    expect(block).toContain('Header set Cache-Control "public, max-age=3600, must-revalidate" env=!DUTY_HASHED_ASSET');
    expect(block).toContain('Header set Cache-Control "public, max-age=31536000, immutable" env=DUTY_HASHED_ASSET');
    // Exactly one Cache-Control line per branch — a second, unconditional
    // "Header set Cache-Control" anywhere in this block is the old bug back.
    const cacheControlLines = (block!.match(/Header set Cache-Control/g) ?? []).length;
    expect(cacheControlLines).toBe(2);
  });
});
