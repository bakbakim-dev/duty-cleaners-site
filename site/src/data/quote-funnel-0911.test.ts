import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pageServiceFor, serviceOnOpen } from "@/lib/tracking";
import { initAnalytics, filterEventProps, isProductionHost, safePageLocation, track } from "@/lib/analytics";
import { cityFromPath } from "@/lib/city-from-path";

/**
 * Quote funnel guards added on 2026-09-11.
 *
 * 1. Service retention. The quote overlay stays mounted from page to page, and
 *    the move-out pages' CTAs are bare #quote links that carry no service. A
 *    reviewer who had chosen Standard earlier opened the quote on the Calgary
 *    move-out page and was quoted Standard. The page's own service must win over
 *    a choice made on another page; a choice made inside the flow on the same
 *    page must survive closing and reopening.
 * 2. The analytics PII filter: nothing that could identify a person leaves
 *    track(), whatever a caller passes.
 * 3. The GA4 loader is a no-op without VITE_GA4_MEASUREMENT_ID, and off every
 *    host but dutycleaners.ca and www.dutycleaners.ca (previews record nothing).
 * 4. Page addresses reach Google without their query string (bar campaign
 *    tags), and the BookingKoala URL, which carries the visitor's name, email,
 *    phone and postal code, is never the href of a link.
 */

const ROOT = join(__dirname, "..", "..");

/** Source with comments stripped: a guard must test code, not prose. */
function codeOf(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf-8")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ");
}

describe("the quote opens on the page's service, not a stale one", () => {
  it("the move-out, march-out and post-construction pages name their service", () => {
    for (const path of [
      "/move-out-cleaning-calgary/",
      "/move-out-cleaning-edmonton/",
      "/calgary/move-in-move-out-cleaning/",
      "/edmonton/move-in-move-out-cleaning",
      "/edmonton/march-out-cleaning/",
    ]) {
      expect(pageServiceFor(path), path).toBe("move-in-out");
    }
    for (const path of [
      "/post-construction-cleaning/",
      "/post-construction-cleaning-calgary/",
      "/calgary/post-construction-cleaning/",
    ]) {
      expect(pageServiceFor(path), path).toBe("post-construction");
    }
    expect(pageServiceFor("/cleaning-services-calgary/")).toBeNull();
    expect(pageServiceFor("/")).toBeNull();
    expect(pageServiceFor("/", "?service=move-in-out-cleaning")).toBe("move-in-out");
  });

  it("a bare #quote on the Calgary move-out page drops a Standard chosen on another page", () => {
    const pathname = "/move-out-cleaning-calgary/";
    const stale = { current: "standard" as const, preset: null, pageService: pageServiceFor(pathname), pathname };
    // Chosen in the flow on the Calgary hub, then carried here by the overlay.
    expect(serviceOnOpen({ ...stale, choicePath: "/cleaning-services-calgary/" })).toBe("move-in-out");
    // Chosen on the hero card (no in-flow choice at all).
    expect(serviceOnOpen({ ...stale, choicePath: null })).toBe("move-in-out");
    // The city comes from the same path, so it is Calgary as well.
    expect(cityFromPath(pathname)).toBe("calgary");
  });

  it("a service picked inside the flow on the same page survives reopening", () => {
    const pathname = "/move-out-cleaning-calgary/";
    expect(
      serviceOnOpen({
        current: "standard",
        preset: null,
        pageService: pageServiceFor(pathname),
        choicePath: pathname,
        pathname,
      }),
    ).toBe("standard");
    // A page about no single service keeps whatever the flow has.
    expect(
      serviceOnOpen({ current: "post-construction", preset: null, pageService: null, choicePath: null, pathname: "/" }),
    ).toBe("post-construction");
  });

  it("a ?service= link to the same path wins over an in-flow choice made there without it", () => {
    // Chose move-out inside the flow on "/", then followed a link to
    // "/?service=regular-cleaning" (the deep-clean landing links carry the same
    // slug): the link asks for Standard, and gets it.
    const search = "?service=regular-cleaning";
    expect(
      serviceOnOpen({
        current: "move-in-out",
        preset: null,
        pageService: pageServiceFor("/", search),
        choicePath: "/",
        pathname: "/",
        search,
      }),
    ).toBe("standard");
    // A choice made on that same URL still survives reopening it.
    expect(
      serviceOnOpen({
        current: "move-in-out",
        preset: null,
        pageService: pageServiceFor("/", search),
        choicePath: "/" + search,
        pathname: "/",
        search,
      }),
    ).toBe("move-in-out");
  });

  it("quote_step waits for the service an open switched to", () => {
    // The open effect's setService() lands on the next render; the step report
    // in the same commit used to read the old service.
    const src = codeOf("src/components/quote/QuoteFlow.tsx");
    expect(src).toMatch(/pendingServiceRef\.current = next;/);
    expect(src).toMatch(
      /if \(pendingServiceRef\.current !== null && pendingServiceRef\.current !== service\) return;/,
    );
    expect(src, "the step report no longer re-runs when the service lands").toMatch(
      /\}, \[isOpen, step, pricePane, service\]\);/,
    );
    // In-flow picks record the query string too, so ?service= can override them.
    expect(src).toMatch(/choicePathRef\.current = pathname \+ search;/);
  });

  it("a CTA that carries a service wins over the page and the flow", () => {
    expect(
      serviceOnOpen({
        current: "standard",
        preset: "post-construction",
        pageService: "move-in-out",
        choicePath: "/move-out-cleaning-calgary/",
        pathname: "/move-out-cleaning-calgary/",
      }),
    ).toBe("post-construction");
  });

  it("QuoteFlow decides the service on every open, not only when initialService changes", () => {
    const src = codeOf("src/components/quote/QuoteFlow.tsx");
    expect(src, "QuoteFlow no longer asks serviceOnOpen() which service to show").toMatch(/serviceOnOpen\(\{/);
    expect(src, "QuoteFlow no longer reads the page's service").toMatch(/pageServiceFor\(pathname/);
    expect(
      /useEffect\(\(\) => \{\s*setService\(initialService\);?\s*\}, \[initialService\]\)/.test(src),
      "the old effect is back: it followed initialService only when it changed, so a bare #quote " +
        "open kept the previous page's service",
    ).toBe(false);
    // In-flow picks must record where they were made, or rule 3 cannot work.
    expect(src).toMatch(/choicePathRef\.current = pathname/);
  });

  it("an estimate never quotes below BookingKoala's own tier price", () => {
    // rangeLow is the tier price minus a 10% spread the site invented: a
    // post-construction home under 1,000 sq ft (BookingKoala: $550) was
    // "from $495". The low end shown must be the tier price itself.
    for (const rel of ["src/components/quote/QuoteFlow.tsx", "src/components/quote/PricePanel.tsx"]) {
      expect(codeOf(rel), `${rel} quotes rangeLow again`).not.toMatch(/rangeLow/);
    }
  });

  it("the hero card starts on the page's service", () => {
    const src = codeOf("src/components/quote/ServiceStartCard.tsx");
    expect(src).toMatch(/useState<ServiceId>\(\(\) => pageServiceFor\(pathname\) \?\? "standard"\)/);
  });
});

describe("analytics sends nothing personal", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("drops personal keys, personal-looking values and free text", () => {
    const safe = filterEventProps({
      city: "calgary",
      service: "move-in-out",
      step: "price",
      step_number: 3,
      frequency: "bi-weekly-every-2-weeks",
      price_type: "exact",
      full_name: "Jane Doe",
      name: "Jane",
      email: "jane@example.com",
      phone: "7805550199",
      address: "123 Main St",
      postal_code: "T5J 0N3",
      notes: "key under the mat",
      message: "hello",
      // Allowed keys carrying personal values are dropped too.
      intent: "jane@example.com",
      pane: "780-555-0199",
      device: "T5J 0N3",
    });
    expect(safe).toEqual({
      city: "calgary",
      service: "move-in-out",
      step: "price",
      step_number: 3,
      frequency: "bi-weekly-every-2-weeks",
      price_type: "exact",
    });
    // Free text, objects and long numbers never pass.
    expect(filterEventProps({ service: "a sentence someone typed" })).toEqual({});
    expect(filterEventProps({ service: { name: "Jane" } as unknown })).toEqual({});
    expect(filterEventProps({ step_number: 7805550199 })).toEqual({});
  });

  it("track() pushes only the filtered props", () => {
    const dataLayer: unknown[] = [];
    vi.stubGlobal("window", { dataLayer, innerWidth: 400 });
    track("generate_lead", { city: "edmonton", service: "standard", email: "a@b.co", phone: "(780) 555-0199" });
    expect(dataLayer).toEqual([{ event: "generate_lead", device: "mobile", city: "edmonton", service: "standard" }]);
  });
});

describe("the Google Analytics loader", () => {
  afterEach(() => vi.unstubAllGlobals());

  function stubBrowser(hostname = "dutycleaners.ca", path = "/") {
    const appended: { src?: string }[] = [];
    const win: Record<string, unknown> = {
      location: { hostname, href: `https://${hostname}${path}` },
      innerWidth: 1200,
    };
    vi.stubGlobal("window", win);
    vi.stubGlobal("navigator", { userAgent: "Mozilla/5.0 Chrome/128" });
    vi.stubGlobal("document", {
      createElement: () => ({}),
      head: { appendChild: (node: { src?: string }) => appended.push(node) },
    });
    return { win, appended };
  }

  it("loads nothing when no measurement ID is set", () => {
    const { win, appended } = stubBrowser();
    expect(initAnalytics(undefined)).toBe(false);
    expect(initAnalytics("")).toBe(false);
    expect(initAnalytics("UA-12345-1")).toBe(false);
    expect(appended, "a script was added with no GA4 ID").toEqual([]);
    expect(win.gtag).toBeUndefined();
    expect(win.dataLayer).toBeUndefined();
  });

  it("with an ID, loads gtag.js with Google signals and ad personalisation off", () => {
    const { win, appended } = stubBrowser();
    expect(initAnalytics("G-TEST12345")).toBe(true);
    expect(appended).toHaveLength(1);
    expect(appended[0].src).toBe("https://www.googletagmanager.com/gtag/js?id=G-TEST12345");
    const commands = (win.dataLayer as ArrayLike<unknown>[]).map((args) => Array.from(args));
    expect(commands).toContainEqual([
      "config",
      "G-TEST12345",
      {
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        send_page_view: false,
        page_location: "https://dutycleaners.ca/",
      },
    ]);
  });

  it("loads only on dutycleaners.ca and www.dutycleaners.ca, so previews record nothing", () => {
    for (const host of ["dutycleaners.ca", "www.dutycleaners.ca", "WWW.DUTYCLEANERS.CA"]) {
      expect(isProductionHost(host), host).toBe(true);
    }
    for (const host of [
      "duty-cleaners-preview.netlify.app",
      "deploy-preview-12--duty-cleaners-preview.netlify.app",
      "localhost",
      "127.0.0.1",
      "dutycleaners.ca.example.com",
      "book.dutycleaners.ca",
      "",
    ]) {
      expect(isProductionHost(host), host).toBe(false);
      const { appended, win } = stubBrowser(host);
      expect(initAnalytics("G-TEST12345"), host).toBe(false);
      expect(appended, host).toEqual([]);
      expect(win.gtag, host).toBeUndefined();
      vi.unstubAllGlobals();
    }
  });

  it("sends its own page_view with the query string removed, campaign tags kept", () => {
    const { win } = stubBrowser(
      "dutycleaners.ca",
      "/book?f_name=Jane&email=jane%40example.com&phone=7805550199&dc_zip=T5J+0N3&utm_source=google&gclid=abc123#quote",
    );
    expect(initAnalytics("G-TEST12345")).toBe(true);
    const commands = (win.dataLayer as ArrayLike<unknown>[]).map((args) => Array.from(args));
    const clean = "https://dutycleaners.ca/book?gclid=abc123&utm_source=google";
    const pageViews = commands.filter((c) => c[0] === "event" && c[1] === "page_view");
    expect(pageViews).toHaveLength(1);
    expect(pageViews[0][2]).toMatchObject({ page_location: clean });
    expect(JSON.stringify(commands)).not.toMatch(/Jane|example\.com|7805550199|T5J|dc_zip|#quote/);
    // Funnel events carry the same cleaned address.
    track("quote_step", { step: "home" });
    const last = Array.from((win.dataLayer as ArrayLike<unknown>[]).at(-1)!);
    expect(last).toEqual(["event", "quote_step", expect.objectContaining({ page_location: clean })]);
    expect(safePageLocation("https://dutycleaners.ca/?utm_content=jane@example.com")).toBe("https://dutycleaners.ca/");
  });

  it("never loads in the prerender's local headless render", () => {
    const { appended } = stubBrowser("127.0.0.1");
    expect(initAnalytics("G-TEST12345")).toBe(false);
    expect(appended).toEqual([]);
  });

  it("the BookingKoala URL is never a link's href", () => {
    // It carries the visitor's name, email, phone, postal code and notes, and
    // GA4's outbound-click capture records the href of any clicked link.
    for (const rel of ["src/components/quote/BookingHandoff.tsx", "src/components/quote/BookingEmbed.tsx"]) {
      expect(codeOf(rel), `${rel} links to the prefilled booking URL again`).not.toMatch(
        /href=\{(?:bookingUrl|fallbackUrl)\}/,
      );
    }
    expect(codeOf("src/components/quote/BookingHandoff.tsx")).toMatch(/window\.location\.assign\(bookingUrl\)/);
  });

  it("main.tsx passes the build-time env var and no ID is hard-coded", () => {
    const main = codeOf("src/main.tsx");
    expect(main).toMatch(/initAnalytics\(import\.meta\.env\.VITE_GA4_MEASUREMENT_ID\)/);
    expect(main).toMatch(/initContactClickTracking\(\)/);
    expect(codeOf("src/lib/analytics.ts")).not.toMatch(/["'`]G-[A-Z0-9]{6,}["'`]/);
  });
});

describe("the quote overlay reads its facts from proof.ts", () => {
  it("no hand-typed rating or phone number", () => {
    const src = codeOf("src/components/QuoteOverlay.tsx");
    expect(src).not.toMatch(/\d\.\d on Google/);
    expect(src).not.toMatch(/\(\d{3}\) \d{3}-\d{4}|tel:\d/);
    expect(src, "the overlay shows another branch's rating").toMatch(/\{ratingClaimFor\(key\)\}/);
    expect(src).toMatch(/cityProofFor\(pathname\)/);
  });
});

/*
 * Changed 2026-09-11 (owner): Red Deer is a branch with its own office, no
 * travel fee inside the city, and BookingKoala accepts its postal codes. The
 * earlier guard here pinned the interim behaviour (no fee, but no online
 * booking and a "call Edmonton or Calgary" note). A Red Deer code is now an
 * in-city code in booking-redirect.ts, so QuoteFlow needs no Red Deer branch at
 * all: this guard pins that it has none, so the phone-only path cannot return.
 */
describe("Red Deer postal codes book online like any in-city code", () => {
  it("QuoteFlow leaves address validation and travel pricing to BookingKoala", () => {
    const src = codeOf("src/components/quote/QuoteFlow.tsx");
    expect(src).toMatch(/booking\s+page, where you add your address/);
    expect(src).not.toMatch(/dc-address|dc-zip|details\.postalCode|travelFeeExtraForSelection/);
    expect(src, "a Red Deer code lost its online booking again").toMatch(
      /const bookingUrl = bookingQuery === null \? null : publicBookingUrl\(bookingQuery\);/,
    );
    expect(src).not.toMatch(/isRedDeerPostalCode|Red Deer is served:/);
  });
});

describe("price reveal survives a lead-relay outage", () => {
  it("shows the calculated price with accurate stage-specific recovery copy", () => {
    const src = codeOf("src/components/quote/QuoteFlow.tsx");
    expect(src).toMatch(/track\("contact_submission_failed"[\s\S]*setLeadCaptureFailed\(true\);[\s\S]*setStep\(2\);/);
    expect(src).toContain("Your price is ready below.");
    expect(src).toContain("We had trouble connecting, so we may not have received your contact details.");
    expect(src).toContain("That didn&rsquo;t go through.");
    expect(src).toContain("Nothing was booked or charged. Your price and answers are still here.");
    expect(src).not.toMatch(/callback request|lead relay|crm|durable receipt/i);
    expect(src).not.toMatch(/honour your quote/i);
  });
});

/**
 * Owner, 2026-09-21: a Bi-Weekly default reached GoHighLevel and BookingKoala
 * as the visitor's choice before they had seen "How often?", and going back to
 * change the home size sent a second lead (a second office email and text).
 */
describe("the funnel records only what the visitor chose, once", () => {
  it("preselects no plan and sends none until one is picked", () => {
    const src = codeOf("src/components/quote/QuoteFlow.tsx");
    expect(src, "a plan is preselected again").toMatch(/useState<FrequencyId \| null>\(restored\?\.frequency \?\? null\)/);
    expect(src).not.toMatch(/DEFAULT_FREQUENCY/);
    expect(src, "the CRM is sent a plan nobody chose").toMatch(/frequency: awaitingPlan\s*\?\s*""/);
    expect(src, "How often? is no longer required").toMatch(/if \(missPlan\) setFrequencyError\(/);
  });

  it("does not ask for contact details twice in one quote", () => {
    const src = codeOf("src/components/quote/QuoteFlow.tsx");
    expect(src, "going back re-sends the lead").toMatch(
      /if \(contactDoneRef\.current\) \{\s*setStep\(2\);\s*return;\s*\}/,
    );
    expect(src, "a new quote no longer asks again").toMatch(/contactDoneRef\.current = false;/);
  });
});

describe("the move-out card claims only what the checklist covers", () => {
  it("names the move-out items instead of claiming deep cleaning", () => {
    const src = codeOf("src/components/quote/QuoteFlow.tsx");
    expect(src, "the card claims a service it is not").not.toMatch(/Already includes deep cleaning/i);
    expect(src).toMatch(/plus inside the oven, fridge, cabinets and closets/);
  });
});

describe("a branch shows its own Google rating", () => {
  it("the funnel and overlay read the visitor's branch, not Edmonton's", async () => {
    const { CITY_PROOF, ratingClaimFor } = await import("@/data/proof");
    expect(ratingClaimFor("calgary")).toBe(`${CITY_PROOF.calgary.googleRating} on Google`);
    expect(ratingClaimFor("edmonton")).toBe(`${CITY_PROOF.edmonton.googleRating} on Google`);
    expect(ratingClaimFor("reddeer"), "Red Deer has no reviews yet").toBeNull();
    for (const rel of ["src/components/quote/QuoteFlow.tsx", "src/components/QuoteOverlay.tsx"]) {
      expect(codeOf(rel), `${rel} shows the Edmonton rating on every branch`).not.toMatch(/RATING_CLAIM/);
    }
  });
});

describe("every rating on the site is the listing it names", () => {
  it("company-wide lines hold only while the Edmonton and Calgary listings agree", async () => {
    // RATING_CLAIM ("the Edmonton and Calgary offices are rated 4.9") is left on
    // company-wide pages: About, the brand home, Reviews, FAQ, gift cards,
    // Locations. The day the two listings differ, those sentences are false and
    // must be reworded per branch.
    const { CITY_PROOF } = await import("@/data/proof");
    expect(
      CITY_PROOF.calgary.googleRating,
      "the listings now differ: reword every company-wide RATING_CLAIM line per branch",
    ).toBe(CITY_PROOF.edmonton.googleRating);
  });

  it("Calgary pages show the Calgary listing's rating", () => {
    const calgaryPages = [
      "src/pages/CalgaryDeepCleaning.tsx", "src/pages/CalgaryMoveInOut.tsx",
      "src/pages/CalgaryPostConstruction.tsx", "src/pages/CalgaryPricing.tsx",
      "src/pages/CalgaryRecurringCleaning.tsx", "src/pages/CalgaryRegularCleaning.tsx",
      "src/pages/CalgaryServices.tsx", "src/pages/AirbnbCleaningCalgary.tsx",
      "src/pages/BlogChoosingCalgaryCleaner.tsx", "src/pages/WallWashingCalgary.tsx",
      "src/pages/locations/Chestermere.tsx", "src/pages/locations/Crossfield.tsx",
    ];
    for (const rel of calgaryPages) {
      expect(codeOf(rel), `${rel} shows another listing's rating`).not.toMatch(/\bRATING_CLAIM\b|EDMONTON_RATING_CLAIM/);
    }
  });
});

/**
 * Owner, 2026-09-21: the browser's Back button closed the whole funnel from any
 * step. It now steps back one screen at a time; Back on the first screen closes.
 */
describe("the browser Back button steps through the funnel", () => {
  it("each step the visitor moves forward to gets its own history entry", () => {
    const flow = codeOf("src/components/quote/QuoteFlow.tsx");
    expect(flow, "steps no longer push history entries").toMatch(/\[HISTORY_STACK\]: \[\.\.\.stack, stepKey\]/);
    expect(flow, "the funnel's own Back buttons stack entries instead of rewinding").toMatch(
      /window\.history\.go\(earlier - \(stack\.length - 1\)\)/,
    );
    expect(flow, "Back mid-handoff still sends the visitor to the booking page").toMatch(/if \(handoffCancelledRef\.current\) \{/);
    const overlay = codeOf("src/hooks/use-quote-overlay.tsx");
    expect(overlay, "Back between steps closes the form again").toMatch(
      /if \(event\.state\?\.\[HISTORY_FLAG\] && !closingViaHistoryRef\.current\) \{/,
    );
  });

  it("closing the funnel unwinds every step it added", () => {
    expect(codeOf("src/hooks/use-quote-overlay.tsx"), "closing leaves funnel steps in history").toMatch(
      /window\.history\.go\(-funnelStackOf\(window\.history\.state\)\.length\);/,
    );
  });
});
