import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

/**
 * The real findings of the AuditSpur scan of the preview on 2026-09-11, kept fixed.
 * The scan's preview-only findings (the staging noindex, canonicals to dutycleaners.ca) and
 * its false ones are deliberately not guarded here.
 */
const SITE = join(__dirname, "..", "..");
const src = (rel: string) => readFileSync(join(SITE, "src", rel), "utf-8");

describe("AuditSpur findings of 2026-09-11 stay fixed", () => {
  it("every cost-guide FAQ question is a visible section heading", () => {
    // The FAQPage JSON-LD reads q; the page renders h2. Google requires marked-up questions
    // to be on the page, and three of them were only in the markup.
    const text = src("pages/BlogHouseCleaningCost.tsx");
    const pairs = [...text.matchAll(/h2: "([^"]+)",\s*q: "([^"]+)"/g)];
    expect(pairs.length, "SECTIONS entries").toBeGreaterThan(3);
    const drift = pairs.filter((m) => m[1] !== m[2]).map((m) => `h2 "${m[1]}" vs q "${m[2]}"`);
    expect(drift, "a marked-up question the page does not show").toEqual([]);
  });

  it("lead forms post, so a native submit never puts personal data in the URL", () => {
    const bad: string[] = [];
    for (const rel of ["pages/Contact.tsx", "pages/JoinTheTeam.tsx"]) {
      for (const m of src(rel).matchAll(/<form\b[^>]*>/g)) {
        if (!/method="post"/.test(m[0])) bad.push(`${rel}: ${m[0].slice(0, 80)}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it("the product post's schema image is its own hero image", () => {
    const text = src("pages/BlogCleaningProducts.tsx");
    expect(text).not.toMatch(/image: "https:\/\/dutycleaners\.ca\/og-image\.jpg"/);
    expect(text).toMatch(/image: absoluteAssetUrl\(heroImage(?:\.img\.src)?\)/);
  });

  it("the blog index states a revision date for posts with no known publication date", () => {
    expect(src("pages/Blog.tsx")).toMatch(/:\s*POST_MODIFIED\[[^\]]+\]\s*\?\s*\{\s*dateModified:/);
  });

  it("security.txt names a contact and has not expired", () => {
    const file = join(SITE, "public", ".well-known", "security.txt");
    expect(existsSync(file), "public/.well-known/security.txt").toBe(true);
    const text = readFileSync(file, "utf-8");
    expect(text).toMatch(/^Contact: mailto:\S+@\S+$/m);
    const expires = /^Expires: (\S+)$/m.exec(text)?.[1];
    expect(expires, "Expires field").toBeTruthy();
    // RFC 9116 wants an expiry under a year out. When this fails, renew the date.
    expect(Date.parse(expires!), "security.txt has expired: renew its Expires date").toBeGreaterThan(Date.now());
  });

  it("robots.txt keeps Amazonbot out and lets Amazon's search crawlers in", () => {
    const robots = readFileSync(join(SITE, "public", "robots.txt"), "utf-8");
    const rule = (bot: string) => new RegExp(`User-agent: ${bot}\\s*\\n(Allow|Disallow): /`).exec(robots)?.[1];
    expect(rule("Amazonbot")).toBe("Disallow");
    expect(rule("Amzn-SearchBot")).toBe("Allow");
    expect(rule("Amzn-User")).toBe("Allow");
  });

  it("the Organization names the services it sells", () => {
    const html = readFileSync(join(SITE, "index.html"), "utf-8");
    const m = /"knowsAbout":\s*\[([^\]]*)\]/.exec(html);
    expect(m, "knowsAbout on the Organization").toBeTruthy();
    expect((m![1].match(/"/g) ?? []).length / 2).toBeGreaterThanOrEqual(5);
  });
});
