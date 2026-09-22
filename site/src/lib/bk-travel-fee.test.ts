import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { postalCodeCityName, postalCodeCityStatus } from "@/lib/booking-redirect";

/*
 * The BookingKoala travel-fee check (bk-travel-fee.js, owner 2026-09-22) ticks
 * the fee from the postal code the customer types. Its rules are a copy, in
 * plain browser JavaScript, of postalCodeCityStatus: if the two ever disagree,
 * the booking page charges a fee the funnel's area answer did not, or skips one.
 */
const source = readFileSync(new URL("../../../bk-travel-fee.js", import.meta.url), "utf8");
const rules = source.slice(source.indexOf("// rules: begin"), source.indexOf("// rules: end"));
const travelFeeRule = runInNewContext(`${rules}; travelFeeRule`) as (
  value: string,
) => { fsa: string; city: string | null; outside: boolean } | null;

const LETTERS = "ABCEGHJKLMNPRSTVWXYZ";

describe("booking-page travel fee agrees with the site's postal-code rules", () => {
  it("every Alberta FSA gets the same answer", () => {
    const disagreements: string[] = [];
    for (let digit = 0; digit <= 9; digit++) {
      for (const letter of LETTERS) {
        const code = `T${digit}${letter} 1A1`;
        const site = postalCodeCityStatus(code);
        const page = travelFeeRule(code);
        const pageStatus = page === null ? "unknown" : page.outside ? "outside" : "inside";
        if (site !== pageStatus) disagreements.push(`${code}: site ${site}, booking page ${pageStatus}`);
        if (page && !page.outside && page.city !== postalCodeCityName(code)) disagreements.push(`${code}: city ${page.city}`);
      }
    }
    expect(disagreements).toEqual([]);
  });

  it("leaves codes outside Alberta and incomplete codes alone", () => {
    expect(travelFeeRule("M5V 2T6")).toBeNull();
    expect(travelFeeRule("T5J")).toBeNull();
  });

  it("ticks the fee for a nearby town, unticks it in Red Deer, and says why", () => {
    const clicks: string[] = [];
    const box = { checked: false, click() { this.checked = !this.checked; clicks.push(this.checked ? "on" : "off"); } };
    const label = { textContent: "Outside Edmonton/Calgary(Surrounding areas) - Travel fee  (Do not select this...)" };
    const tile = { querySelector: (selector: string) => (selector === ".bk-form-sub-label" ? label : box) };
    const inserted: { textContent: string }[] = [];
    const wrapper = { parentNode: { insertBefore: (node: { textContent: string }) => inserted.push(node) }, nextSibling: null };
    const input = { value: "", placeholder: "Postal code", parentElement: wrapper };
    let check = () => {};
    const document = {
      getElementById: (id: string) => (id === "postal_code" ? input : null),
      querySelectorAll: (selector: string) => (selector === ".tjs-extra__list" ? [tile] : []),
      createElement: () => ({ textContent: "", style: {}, setAttribute() {}, parentNode: null, previousSibling: null }),
    };
    const window: Record<string, unknown> = {};
    runInNewContext(source, { window, document, location: { pathname: "/booknow" }, setInterval: (fn: () => void) => { check = fn; } });

    input.value = "T8N 1A1"; // St. Albert
    check();
    expect(box.checked).toBe(true);
    expect(inserted.at(-1)?.textContent).toMatch(/^Travel fee included: T8N is outside Edmonton, Calgary and Red Deer city limits/);

    check(); // same code: the customer's own choice now stands
    box.checked = false;
    check();
    expect(box.checked).toBe(false);

    input.value = "T4N 5E2"; // Red Deer
    box.checked = true;
    check();
    expect(box.checked).toBe(false);
    expect(inserted.at(-1)?.textContent).toBe("No travel fee: T4N is inside Red Deer city limits.");
    expect(clicks).toEqual(["on", "off"]);
  });

  it("ships in the BookingKoala header snippet as its own block", () => {
    const snippet = readFileSync(new URL("../../../bk-header-fill.html", import.meta.url), "utf8");
    expect(snippet).toContain("<!-- Duty Cleaners travel fee by postal code: BEGIN -->");
    expect(snippet).toContain(source.trim().slice(0, 200));
  });
});
