import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The Apache rules and the Netlify rules describe the same site.
 *
 * The site is already static, so moving to SiteGround is a hosting change — but
 * Apache reads neither _redirects nor _headers, and those two files carry the
 * 352 permanent redirects through which every one of the 62 URLs Google has
 * indexed resolves. Hand-porting that map once, at cutover, is how a migration
 * loses pages.
 *
 * Both files are generated from the same two sources, so this asserts they
 * actually agree. A redirect added to legacy-urls.ts and regenerated into only
 * one of them would be a rule that works on the host you are leaving and not on
 * the one you are moving to — which is the failure that only shows up after DNS
 * has already moved.
 *
 * Regenerate with:  bunx tsx scripts/generate-redirects.ts
 *                   bunx tsx scripts/generate-htaccess.ts
 */

const PUBLIC = join(__dirname, "..", "..", "public");

/** [from, to] pairs, slash-insensitive, from the Netlify file. */
function netlifyPairs(): Set<string> {
  const out = new Set<string>();
  const text = readFileSync(join(PUBLIC, "_redirects"), "utf-8");
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#") || line.startsWith("/*")) continue;
    const parts = line.split(/\s+/);
    if (parts.length < 2) continue;
    const from = parts[0].replace(/\/+$/, "") || "/";
    const to = parts[1].replace(/\/+$/, "") || "/";
    out.add(`${from} -> ${to}`);
  }
  return out;
}

/** The same, parsed back out of the Apache RewriteRules. */
function apachePairs(): Set<string> {
  const out = new Set<string>();
  const text = readFileSync(join(PUBLIC, ".htaccess"), "utf-8");
  for (const m of text.matchAll(/RewriteRule \^([^ ]*?)\/\?\$ ([^ ]+) \[/g)) {
    // The generator escapes regex metacharacters in the source path; strip the
    // backslashes to compare against the plain path.
    const from = ("/" + m[1].replace(/\\/g, "")).replace(/\/+$/, "") || "/";
    const to = m[2].replace(/\/+$/, "") || "/";
    out.add(`${from} -> ${to}`);
  }
  return out;
}

describe("the Apache and Netlify rule sets describe the same site", () => {
  const present = existsSync(join(PUBLIC, ".htaccess"));

  it("public/.htaccess exists", () => {
    expect(
      present,
      "run `bunx tsx scripts/generate-htaccess.ts` — without it a SiteGround cutover " +
        "serves none of the legacy redirects",
    ).toBe(true);
  });

  it("every Netlify redirect has an Apache equivalent, and vice versa", () => {
    if (!present) return;
    const netlify = netlifyPairs();
    const apache = apachePairs();

    expect(netlify.size, "no rules parsed from _redirects — has its format changed?").toBeGreaterThan(100);

    const onlyNetlify = [...netlify].filter((r) => !apache.has(r));
    const onlyApache = [...apache].filter((r) => !netlify.has(r));

    expect(
      onlyNetlify.slice(0, 8),
      `${onlyNetlify.length} rule(s) would work on Netlify and 404 on SiteGround`,
    ).toEqual([]);
    expect(
      onlyApache.slice(0, 8),
      `${onlyApache.length} rule(s) exist only in .htaccess`,
    ).toEqual([]);
  });

  it("carries the security headers and does not quietly enable HSTS", () => {
    if (!present) return;
    const text = readFileSync(join(PUBLIC, ".htaccess"), "utf-8");
    for (const header of [
      "X-Frame-Options",
      "X-Content-Type-Options",
      "Referrer-Policy",
      "Permissions-Policy",
      "Content-Security-Policy-Report-Only",
    ]) {
      expect(text, `.htaccess does not set ${header}, which public/_headers does`).toContain(header);
    }
    // HSTS is a one-way door and public/_headers records it as the owner's call
    // to make knowingly. A generator must not introduce it as a side effect.
    expect(
      /Strict-Transport-Security/.test(text),
      "the .htaccess enables HSTS; that is a deliberate owner decision, not a generated default",
    ).toBe(false);
    // The enforced CSP must stay frame-ancestors only — the full policy ships
    // Report-Only until its allowlist is confirmed against real traffic.
    expect(
      /Header always set Content-Security-Policy "frame-ancestors 'self'"/.test(text),
      "the enforced CSP is no longer frame-ancestors-only",
    ).toBe(true);
  });
});
