import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const site = join(__dirname, "../..");
const read = (file: string) => readFileSync(join(site, file), "utf8");

describe("approved editing-brief page roles", () => {
  it("service comparisons keep the standard microwave inclusion accurate", () => {
    const source = read("src/components/ServiceIntentComparison.tsx");
    expect(source).toContain("microwave inside and out");
    expect(source).toContain("Oven and fridge interiors are separate add-ons");
    expect(source).toContain('scope="col"');
    expect(source).toContain('scope="row"');
  });

  it("the cost guide uses one illustrative example, not duplicate city rate tables", () => {
    const source = read("src/pages/BlogHouseCleaningCost.tsx");
    expect(source).not.toContain("<TierTable");
    expect(source).toContain("ILLUSTRATIVE_QUOTE = calculateQuote(");
    expect(source).toContain("(1 + GST_RATE)");
    expect(source).toContain('to="/pricing/"');
    expect(source).toContain('to="/calgary/pricing/"');
  });

  it("standard and recurring quote selections are preserved", () => {
    for (const city of ["Edmonton", "Calgary"]) {
      expect(read(`src/pages/${city}RegularCleaning.tsx`)).toContain('quoteService="regular-cleaning"');
      expect(read(`src/pages/${city}RecurringCleaning.tsx`)).toContain('quoteService="recurring-cleaning"');
    }
    const template = read("src/components/ServiceDetailPage.tsx");
    expect(template).toContain("Price My One-Time Clean");
    expect(template).toContain("Choose My Cleaning Schedule");
    expect(template).toContain("?service=${quoteService}");
  });

  it("area-clarification links resolve to existing built pages", () => {
    expect(existsSync(join(site, "dist/index.html")), "build and prerender first").toBe(true);
    const source = read("src/components/AreaScopeNote.tsx");
    const urls = [...source.matchAll(/"(\/(?:locations)[^"#]*)"/g)].map(m => m[1]);
    expect(urls.length).toBeGreaterThan(10);
    for (const url of urls) expect(existsSync(join(site, "dist", url.replace(/^\//, ""), "index.html")), url).toBe(true);
  });

  it("the Apache staging noindex is scoped to the intentional test host", () => {
    const apache = read("public/.htaccess");
    expect(apache).toContain('SetEnvIfNoCase Host "^mikaily131\\.sg-host\\.com(:[0-9]+)?$" DUTY_STAGING_HOST=1');
    expect(apache).toContain('Header always set X-Robots-Tag "noindex, nofollow" env=DUTY_STAGING_HOST');
    expect(apache).toContain('RewriteCond %{HTTP_HOST} ^(www\\.)?dutycleaners\\.ca$ [NC]\n  RewriteCond %{HTTPS} !=on');
    expect(/^mikaily131\.sg-host\.com(:[0-9]+)?$/i.test("dutycleaners.ca")).toBe(false);
    expect(/^mikaily131\.sg-host\.com(:[0-9]+)?$/i.test("mikaily131.sg-host.com")).toBe(true);
  });
});
