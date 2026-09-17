import { describe, expect, it } from "vitest";
import {
  findCoverageGaps,
  listExtrasFor,
  recurringExtraTotals,
  petsExtraFor,
  resolveExtra,
  resolveExtraId,
  travelFeeExtraFor,
} from "./bk-extras";
import {
  BOOKING_ORIGIN,
  bkExtrasCoverageGaps,
  deepCleaningExtraFor,
  buildBookingUrl,
  buildBookingQuery,
  buildBookingEmbedUrl,
  normalizeBookingPhone,
  splitName,
  postalCodeCityStatus,
  postalCodeCityName,
  isRedDeerPostalCode,

  type BookingUrlInput,
} from "./booking-redirect";


const base: BookingUrlInput = {
  service: "standard",
  homeType: 54,
  bedrooms: 3,
  bathrooms: 2,
  halfBaths: 1,
  frequencyBkId: 4,
  contact: { name: "Jane Doe", email: "jane@example.ca", phone: "780-555-0142" },
};


const query = (input: Partial<typeof base> = {}) =>
  new URL(buildBookingUrl({ ...base, ...input })!).searchParams;

describe("buildBookingUrl", () => {
  it("matches the reference example exactly", () => {
    expect(buildBookingUrl(base)).toBe(
      `${BOOKING_ORIGIN}/booknow?industry_id=1&form_id=1&service_id=6&frequency_id=4` +
        "&pricing_parameter%5B9%5D=54&pricing_parameter%5B1%5D=82" +
        "&pricing_parameter%5B2%5D=9&pricing_parameter%5B8%5D=8" +
        "&f_name=Jane&l_name=Doe&email=jane%40example.ca&phone=7805550142"
    );
  });

  it("returns null for services without an online booking form", () => {
    expect(buildBookingUrl({ ...base, service: "commercial" })).toBeNull();
  });

  it.each([
    [1, "87"],
    [2, "81"],
    [3, "82"],
    [4, "83"],
    [5, "84"],
    [6, "85"],
    [7, "86"],
  ])("standard bedrooms %i → %s", (bedrooms, id) => {
    expect(query({ bedrooms }).get("pricing_parameter[1]")).toBe(id);
  });

  it.each([
    [1, "88"],
    [2, "9"],
    [3, "11"],
    [4, "13"],
    [5, "15"],
    [6, "17"],
    [7, "19"],
  ])("standard full baths %i → %s", (bathrooms, id) => {
    expect(query({ bathrooms }).get("pricing_parameter[2]")).toBe(id);
  });

  it.each([
    [0, "51"],
    [1, "8"],
    [2, "10"],
    [3, "12"],
    [4, "16"],
  ])("standard half baths %i → %s", (halfBaths, id) => {
    expect(query({ halfBaths }).get("pricing_parameter[8]")).toBe(id);
  });

  it.each([
    [1, "74"],
    [2, "75"],
    [3, "76"],
    [4, "77"],
    [5, "78"],
    [6, "79"],
    [7, "80"],
  ])("move in/out bedrooms %i → %s", (bedrooms, id) => {
    expect(query({ service: "move-in-out", bedrooms }).get("pricing_parameter[5]")).toBe(id);
  });

  it.each([
    [1, "39"],
    [2, "40"],
    [3, "41"],
    [4, "42"],
    [5, "43"],
    [6, "44"],
  ])("move in/out full baths %i → %s", (bathrooms, id) => {
    expect(query({ service: "move-in-out", bathrooms }).get("pricing_parameter[6]")).toBe(id);
  });

  it("omits move in/out full baths when 7 is selected", () => {
    const params = query({ service: "move-in-out", bathrooms: 7 });
    expect(params.has("pricing_parameter[6]")).toBe(false);
    expect(params.get("service_id")).toBe("2");
  });

  it.each([
    [0, "58"],
    [1, "45"],
    [2, "46"],
    [3, "47"],
    [4, "48"],
  ])("move in/out half baths %i → %s", (halfBaths, id) => {
    expect(query({ service: "move-in-out", halfBaths }).get("pricing_parameter[7]")).toBe(id);
  });

  it.each([
    [90, "90"],
    [89, "89"],
    [54, "54"],
    [56, "56"],
    [55, "55"],
  ])("home type %i → %s", (homeType, id) => {
    expect(query({ homeType }).get("pricing_parameter[9]")).toBe(id);
  });

  it.each([
    [1, "1"],
    [2, "3"],
    [4, "4"],
    [3, "64"],
  ])("frequency bk id %i → %s", (frequencyBkId, id) => {
    expect(query({ frequencyBkId }).get("frequency_id")).toBe(id);
  });

  it("always sends One-Time for move in/out", () => {
    expect(query({ service: "move-in-out", frequencyBkId: 4 }).get("frequency_id")).toBe("1");
  });

  it("omits unmapped values instead of guessing", () => {
    const params = query({ bedrooms: 9, halfBaths: 12, homeType: 999, frequencyBkId: 77 });
    expect(params.has("pricing_parameter[1]")).toBe(false);
    expect(params.has("pricing_parameter[8]")).toBe(false);
    expect(params.has("pricing_parameter[9]")).toBe(false);
    expect(params.has("frequency_id")).toBe(false);
  });

  it("omits home type when the service does not ask for it", () => {
    expect(query({ homeType: null }).has("pricing_parameter[9]")).toBe(false);
  });

  it("encodes emails with + and names with spaces and accents", () => {
    const url = buildBookingUrl({
      ...base,
      contact: { name: "Renée  Van Der Berg", email: "a+b@example.ca", phone: "+1 (780) 555 0142" },
    })!;
    expect(url).toContain("email=a%2Bb%40example.ca");
    expect(url).toContain("f_name=Ren%C3%A9e");
    expect(url).toContain("l_name=Van+Der+Berg");
    expect(url).toContain("phone=7805550142");
    const params = new URL(url).searchParams;
    expect(params.get("l_name")).toBe("Van Der Berg");
    expect(params.get("email")).toBe("a+b@example.ca");
  });

  it("omits contact params that are empty", () => {
    const params = query({ contact: {} });
    expect(params.has("f_name")).toBe(false);
    expect(params.has("email")).toBe(false);
    expect(params.has("phone")).toBe(false);
  });

  it("omits a phone that cannot be trusted as ten digits", () => {
    for (const phone of ["780555014", "0117805550142", "+44 20 7946 0958", "abc"]) {
      expect(query({ contact: { ...base.contact, phone } }).has("phone")).toBe(false);
    }
  });
});

describe("normalizeBookingPhone", () => {
  it("strips a leading north-american country code", () => {
    expect(normalizeBookingPhone("+1 780 555 0199")).toBe("7805550199");
    expect(normalizeBookingPhone("1-780-555-0199")).toBe("7805550199");
  });

  it("keeps a plain ten-digit number", () => {
    expect(normalizeBookingPhone("(780) 555-0199")).toBe("7805550199");
  });

  it("returns null rather than a corrupted number", () => {
    expect(normalizeBookingPhone("780555019")).toBeNull();
    expect(normalizeBookingPhone("27805550199")).toBeNull();
    expect(normalizeBookingPhone("")).toBeNull();
    expect(normalizeBookingPhone(undefined)).toBeNull();
  });
});


describe("splitName", () => {
  it("splits on the first space", () => {
    expect(splitName("Jane Doe")).toEqual({ first: "Jane", last: "Doe" });
    expect(splitName("Jane Van Der Berg")).toEqual({ first: "Jane", last: "Van Der Berg" });
    expect(splitName("Cher")).toEqual({ first: "Cher", last: "" });
    expect(splitName("   ")).toEqual({ first: "", last: "" });
  });
});

describe("buildBookingQuery / buildBookingEmbedUrl", () => {
  it("query matches the redirect URL's query string", () => {
    const query = buildBookingQuery(base)!;
    expect(buildBookingUrl(base)).toBe(`${BOOKING_ORIGIN}/booknow?${query}`);
  });

  it("returns null for services without an online booking form", () => {
    expect(buildBookingQuery({ ...base, service: "commercial" })).toBeNull();
  });

  it("embed url carries embed=true plus the identical prefill params", () => {
    const query = buildBookingQuery(base)!;
    const embed = buildBookingEmbedUrl(query);
    expect(embed).toBe(`${BOOKING_ORIGIN}/booknow?embed=true&${query}`);
    const params = new URL(embed).searchParams;
    expect(params.get("embed")).toBe("true");
    expect(params.get("service_id")).toBe("6");
    expect(params.get("frequency_id")).toBe("4");
    expect(params.get("pricing_parameter[1]")).toBe("82");
    expect(params.get("email")).toBe("jane@example.ca");
  });

  it("embed url still forces One-Time for move in/out", () => {
    const query = buildBookingQuery({ ...base, service: "move-in-out", frequencyBkId: 4 })!;
    expect(new URL(buildBookingEmbedUrl(query)).searchParams.get("frequency_id")).toBe("1");
  });

  it("passes only allowlisted campaign attribution into the booking handoff", () => {
    const query = buildBookingQuery({
      ...base,
      tracking: {
        gclid: "click-123",
        utm_source: "google",
        utm_campaign: "move-out",
        email: "must-not-pass@example.com",
        arbitrary: "must-not-pass",
      },
    })!;
    const params = new URLSearchParams(query);
    expect(params.get("gclid")).toBe("click-123");
    expect(params.get("utm_source")).toBe("google");
    expect(params.get("utm_campaign")).toBe("move-out");
    expect(params.has("arbitrary")).toBe(false);
    expect(query).not.toContain("must-not-pass");
  });
});

describe("deep cleaning extras prefill", () => {
  it.each([
    [1, 146],
    [2, 147],
    [3, 148],
    [4, 149],
    [5, 150],
    // Each size has its own row: 152 ($199.99) is the 6-bedroom package and
    // 151 ($219.99) is 7-bedroom only, per the corrected BookingKoala config.
    [6, 152],
    [7, 151],

  ])("bedrooms %i → extras[%i]=1", (bedrooms, id) => {
    const url = buildBookingUrl({ ...base, bedrooms, deepClean: true })!;
    expect(url).toContain(`extras%5B${id}%5D=1`);
    expect(new URL(url).searchParams.get(`extras[${id}]`)).toBe("1");
  });

  it("resolves a package id for every standard bedroom tier", () => {
    const ids: number[] = [];
    for (let bedrooms = 1; bedrooms <= 7; bedrooms += 1) {
      const url = buildBookingUrl({ ...base, bedrooms, deepClean: true })!;
      const match = url.match(/extras%5B(\d+)%5D=1/);
      expect(match).not.toBeNull();
      ids.push(Number(match![1]));
    }
    expect(ids).toEqual([146, 147, 148, 149, 150, 152, 151]);
  });

  it("quotes the price of the row it actually sends", () => {
    for (let bedrooms = 1; bedrooms <= 7; bedrooms += 1) {
      const extra = deepCleaningExtraFor(bedrooms)!;
      const url = buildBookingUrl({ ...base, bedrooms, deepClean: true })!;
      expect(url).toContain(`extras%5B${extra.id}%5D=1`);
      expect(extra.price).toBeGreaterThan(0);
    }
    expect(deepCleaningExtraFor(6)!.price).toBe(199.99);
    expect(deepCleaningExtraFor(7)!.price).toBe(219.99);
  });


  it("omits extras for an unmapped bedroom count instead of guessing", () => {
    expect(buildBookingUrl({ ...base, bedrooms: 9, deepClean: true })).not.toContain("extras");
  });

  it("carries the same param into the embed src", () => {
    const query = buildBookingQuery({ ...base, deepClean: true })!;
    const embed = buildBookingEmbedUrl(query);
    expect(embed).toContain("embed=true");
    expect(embed).toContain("extras%5B148%5D=1");
  });

  it("omits extras entirely without the flag", () => {
    expect(buildBookingUrl(base)).not.toContain("extras");
    expect(buildBookingUrl({ ...base, deepClean: false })).not.toContain("extras");
  });

  it("keeps the package on a recurring frequency", () => {
    const params = query({ deepClean: true, frequencyBkId: 2 });
    expect(params.get("frequency_id")).toBe("3");
    expect(params.get("extras[148]")).toBe("1");
  });

  it("never sends the standard-service extras id on move in/out", () => {
    const url = buildBookingUrl({ ...base, service: "move-in-out", deepClean: true })!;
    expect(url).not.toContain("extras");
  });
});

describe("config-driven extra resolver", () => {
  const STANDARD_BEDROOM_OPTIONS = [87, 81, 82, 83, 84, 85, 86];

  it("resolves the featured add-ons for every standard bedroom size", () => {
    const gaps = findCoverageGaps(
      ["Inside Oven", "Inside Fridge", "Inside Windows"].map((name) => ({
        name,
        serviceId: 6,
        bedroomOptionIds: STANDARD_BEDROOM_OPTIONS,
      }))
    );
    expect(gaps).toEqual([]);
  });

  it("reports no coverage gaps at all for the headline extras", () => {
    expect(bkExtrasCoverageGaps()).toEqual([]);
  });

  it("resolves the 6-bed deep package to its own tier, not the 7-bed one", () => {
    expect(deepCleaningExtraFor(6)).toEqual({
      id: 152,
      name: "Deep Cleaning",
      price: 199.99,
      maxQuantity: 1,
      exemptFromFrequencyDiscount: false,
      firstVisitOnly: false,
    });
    expect(deepCleaningExtraFor(7)?.id).toBe(151);
  });

  it("treats a row with no variables as valid for every home size", () => {
    // Pets and the travel fee carry no `variables` in BookingKoala's config.
    expect(petsExtraFor(6, 87)?.price).toBe(19.99);
    expect(petsExtraFor(6, 86)?.price).toBe(19.99);
    expect(travelFeeExtraFor(6, 82)?.price).toBe(29.99);
  });

  it("resolves the Deep Cleaning package for every standard bedroom size", () => {
    const gaps = findCoverageGaps([
      { name: "Deep Cleaning", serviceId: 6, bedroomOptionIds: STANDARD_BEDROOM_OPTIONS },
    ]);
    expect(gaps).toEqual([]);
  });

  it("reports a gap loudly when a name no longer exists in the config", () => {
    const gaps = findCoverageGaps([
      { name: "Inside Ovenn", serviceId: 6, bedroomOptionIds: STANDARD_BEDROOM_OPTIONS },
    ]);
    expect(gaps).toHaveLength(STANDARD_BEDROOM_OPTIONS.length);
    expect(gaps[0].extra).toBe("Inside Ovenn");
  });

  it("returns null rather than a wrong-service id", () => {
    // Deep Cleaning rows are service categories 1 and 6 — never Move In/Out (2).
    expect(resolveExtraId("Deep Cleaning", 2, 76)).toBeNull();
  });

  it("prices the add-ons from the row, not a hard-coded number", () => {
    const oven = resolveExtra("Inside Oven", 6, 82);
    const fridge = resolveExtra("Inside Fridge", 6, 82);
    expect(oven?.price).toBe(59.99);
    expect(fridge?.price).toBe(59.99);
  });
});

describe("the add-on shelf", () => {
  it("lists what BookingKoala itself would show, deduped by name", () => {
    const shelf = listExtrasFor(6, 82);
    const names = shelf.map((extra) => extra.name);
    expect(new Set(names).size).toBe(names.length);
    expect(names.slice(0, 5)).toEqual([
      "Inside Oven",
      "Inside Fridge",
      "Inside Windows",
      "Inside cabinets (Kitchen & Bathroom Only)",
      "Deep Cleaning",
    ]);
  });

  it("never puts pets or the travel fee on the shelf", () => {
    const names = listExtrasFor(6, 82).map((extra) => extra.name.toLowerCase());
    expect(names.some((name) => name.includes("pets"))).toBe(false);
    expect(names.some((name) => name.includes("travel fee"))).toBe(false);
  });

  it("prices each row for the selected home size", () => {
    const cabinets = (size: number) =>
      listExtrasFor(6, size).find((extra) => extra.name.startsWith("Inside cabinets"))?.price;
    expect(cabinets(87)).toBe(74.99); // 1 bed
    expect(cabinets(83)).toBe(129.99); // 4 bed
    expect(cabinets(86)).toBe(199.99); // 7 bed
  });

  it("carries BookingKoala's first-visit-only flag into the quote shelf", () => {
    const shelf = listExtrasFor(6, 82);
    expect(shelf.find((extra) => extra.name === "Inside Oven")?.firstVisitOnly).toBe(true);
    expect(petsExtraFor(6, 82)?.firstVisitOnly).toBe(false);
  });

  it("excludes first-only extras and discounts only eligible recurring extras", () => {
    const firstOnly = listExtrasFor(6, 82).find((extra) => extra.name === "Inside Oven");
    const pets = petsExtraFor(6, 82);
    expect(firstOnly).toBeDefined();
    expect(pets).toBeDefined();
    expect(recurringExtraTotals([
      { extra: firstOnly!, quantity: 1 },
      { extra: pets!, quantity: 1 },
    ], 20)).toEqual({ total: 15.99, savings: 4 });
  });

  it("matches the BookingKoala flags across every standard shelf tier", () => {
    for (const optionId of [87, 81, 82, 83, 84, 85, 86]) {
      for (const extra of listExtrasFor(6, optionId)) {
        const result = recurringExtraTotals([{ extra, quantity: 2 }], 20);
        const line = extra.price * 2;
        const expectedTotal = extra.firstVisitOnly
          ? 0
          : extra.exemptFromFrequencyDiscount
            ? line
            : line * 0.8;
        const expectedSavings = extra.firstVisitOnly || extra.exemptFromFrequencyDiscount ? 0 : line * 0.2;
        expect(result.total, `${optionId} ${extra.name}`).toBeCloseTo(expectedTotal, 2);
        expect(result.savings, `${optionId} ${extra.name}`).toBeCloseTo(expectedSavings, 2);
      }
    }
  });

  it("grows with the home size", () => {
    expect(listExtrasFor(6, 86).length).toBeGreaterThan(listExtrasFor(6, 87).length);
  });

  it("offers a different catalogue on move in/out", () => {
    const move = listExtrasFor(2, 76).map((extra) => extra.name);
    expect(move).not.toContain("Inside Oven");
    expect(move).not.toContain("Deep Cleaning");
  });

  it("marks the quantity-based rows with their BookingKoala maximum", () => {
    const blinds = listExtrasFor(6, 82).find((extra) => extra.name.startsWith("wipe window"));
    const declutter = listExtrasFor(6, 82).find((extra) => extra.name.startsWith("De-clutt"));
    expect(blinds?.maxQuantity).toBe(30);
    expect(declutter?.maxQuantity).toBe(8);
  });
});

describe("the add-on basket in the booking URL", () => {
  it("sends each selection on its own", () => {
    expect(query({ extras: { "Inside Oven": 1 } }).get("extras[123]")).toBe("1");
    expect(query({ extras: { "Inside Fridge": 1 } }).get("extras[124]")).toBe("1");
  });

  it("carries a quantity for quantity-based rows", () => {
    expect(query({ extras: { "wipe window blinds (per set)": 4 } }).get("extras[114]")).toBe("4");
  });

  it("clamps a quantity to BookingKoala's own maximum", () => {
    expect(
      query({ extras: { "De-cluttering or Organizing Per Hour": 20 } }).get("extras[141]")
    ).toBe("8");
  });

  it("composes the basket with the deep cleaning package", () => {
    const params = query({
      extras: { "Inside Oven": 1, "Inside Fridge": 1, "Must choose if you have pets": 1 },
      deepClean: true,
    });
    expect(params.get("extras[148]")).toBe("1");
    expect(params.get("extras[123]")).toBe("1");
    expect(params.get("extras[124]")).toBe("1");
    expect(params.get("extras[122]")).toBe("1");
  });

  it("sends the travel fee when the out-of-city box is ticked", () => {
    const travel = travelFeeExtraFor(6, 82)!;
    expect(query({ extras: { [travel.name]: 1 } }).get(`extras[${travel.id}]`)).toBe("1");
  });

  it("sends nothing when the basket is empty", () => {
    expect(buildBookingUrl({ ...base, extras: {} })).not.toContain("extras");
  });

  it("omits an unresolvable row instead of guessing", () => {
    expect(
      buildBookingUrl({ ...base, bedrooms: 9, extras: { "Inside Oven": 1 } })
    ).not.toContain("extras");
    expect(buildBookingUrl({ ...base, extras: { "Inside Ovenn": 1 } })).not.toContain("extras");
  });

  it("resolves the same ids on move in/out (row covers both services)", () => {
    const oven = resolveExtraId("Inside Oven", 2, 76);
    const params = query({ service: "move-in-out", extras: { "Inside Oven": 1 } });
    expect(oven === null ? null : params.get(`extras[${oven}]`)).toBe(oven === null ? null : "1");
  });
});

describe("coupon prefill", () => {
  it("passes a campaign coupon through", () => {
    expect(query({ coupon: "SPRING20" }).get("coupon")).toBe("SPRING20");
  });

  it("never sends a date — the booking page owns availability", () => {
    expect(buildBookingUrl(base)).not.toContain("date=");
  });
});

describe("details for your cleaner (dc_*)", () => {
  it("sends only the answered fields", () => {
    const params = query({ cleanerDetails: { entry: "mailbox", cleanliness: 4 } });
    expect(params.get("dc_entry")).toBe("mailbox");
    expect(params.get("dc_clean")).toBe("4");
    expect(params.get("dc_park")).toBeNull();
    expect(params.get("dc_notes")).toBeNull();
  });

  it("sends nothing when nothing was answered", () => {
    expect(buildBookingUrl({ ...base, cleanerDetails: {} })).not.toContain("dc_");
  });

  it("caps the note at 500 characters", () => {
    const notes = query({ cleanerDetails: { notes: "x".repeat(900) } }).get("dc_notes");
    expect(notes?.length).toBe(500);
  });

  it("carries parking through", () => {
    expect(query({ cleanerDetails: { parking: "visitor" } }).get("dc_park")).toBe("visitor");
  });

  it("normalises the postal code into dc_zip", () => {
    expect(query({ cleanerDetails: { postalCode: "t5j0n3" } }).get("dc_zip")).toBe("T5J 0N3");
    expect(query({ cleanerDetails: { postalCode: "T5J" } }).get("dc_zip")).toBeNull();
    expect(query({ cleanerDetails: { postalCode: "D5J 0N3" } }).get("dc_zip")).toBeNull();
  });
});

describe("postalCodeCityStatus", () => {
  it("treats Edmonton and Calgary prefixes as inside city limits", () => {
    for (const code of ["T5J 0N3", "t6e1a1", "T2P 1J9", "T3A 0A1"]) {
      expect(postalCodeCityStatus(code)).toBe("inside");
    }
  });

  it("treats any other complete Alberta code as outside", () => {
    expect(postalCodeCityStatus("T7X 1A1")).toBe("outside");
  });

  it("does not price another province's code as an Alberta suburb", () => {
    /*
      "outside" says more than "not one of our cities": it says we serve the
      address for a travel fee, so the funnel prices it and carries on. This
      case used to assert M5V (downtown Toronto) was "outside", which is the
      behaviour rather than a typo — paying a travel fee does not make Toronto
      serviceable.

      Alberta postal codes all begin with T, so these fall back to asking, and
      booking-details.ts rejects the province at the address step.
    */
    for (const code of ["M5V 2T6", "K1A 0B1", "V6B 1A1"]) {
      expect(postalCodeCityStatus(code), code).toBe("unknown");
    }
  });

  it("is unknown when the code is missing or incomplete", () => {
    expect(postalCodeCityStatus("")).toBe("unknown");
    expect(postalCodeCityStatus("T5J")).toBe("unknown");
    expect(postalCodeCityStatus(null)).toBe("unknown");
  });

  // Statistics Canada's 2021 FSA boundaries over each city's own boundary file
  // (see the comment on CITY_BY_PREFIX in booking-redirect.ts).
  it("counts T1Y (Rundle, Whitehorn, Monterey Park) as Calgary, with no travel fee", () => {
    expect(postalCodeCityStatus("T1Y 5E4")).toBe("inside");
    expect(postalCodeCityName("t1y5e4")).toBe("Calgary");
  });

  it("charges T3Z (Redwood Meadows, Bragg Creek) the travel fee: it lies outside Calgary", () => {
    expect(postalCodeCityStatus("T3Z 1A1")).toBe("outside");
    expect(postalCodeCityName("T3Z 1A1")).toBeNull();
  });

  it("keeps the neighbouring T1 codes outside: Chestermere and Airdrie", () => {
    expect(postalCodeCityStatus("T1X 1A1")).toBe("outside");
    expect(postalCodeCityStatus("T4A 1A1")).toBe("outside");
  });
});

describe("Red Deer postal codes", () => {
  it("recognises Red Deer's three FSAs and nothing else", () => {
    for (const code of ["T4N 1A1", "t4p2b2", "T4R 3C3"]) {
      expect(isRedDeerPostalCode(code), code).toBe(true);
    }
    for (const code of ["T4E 1A1", "T4S 1A1", "T5J 0N3", "T4N", "", null]) {
      expect(isRedDeerPostalCode(code), String(code)).toBe(false);
    }
  });

  // Owner, 2026-09-11: Red Deer has its own office, so a Red Deer code pays no
  // travel fee and is named as Red Deer on the no-fee confirmation line.
  it("prices a Red Deer code as in-city, with no travel fee", () => {
    for (const code of ["T4N 1S4", "T4P 2B2", "T4R 3C3"]) {
      expect(postalCodeCityStatus(code), code).toBe("inside");
      expect(postalCodeCityName(code), code).toBe("Red Deer");
    }
  });

  it("keeps T4S (Sylvan Lake and Red Deer County) and the other T4 codes outside", () => {
    for (const code of ["T4S 1A1", "T4E 1A1", "T4G 1A1", "T4L 1A1"]) {
      expect(postalCodeCityStatus(code), code).toBe("outside");
    }
  });
});

describe("Tsuut'ina Nation (T3T)", () => {
  // Owner, 2026-09-11: Tsuut'ina Nation addresses do not pay the travel fee.
  // T3T falls under Calgary's T3 prefix rule, which already charges no fee;
  // this pins it so a future FSA exception cannot start charging it.
  it("adds no travel fee for a T3T postal code", () => {
    expect(postalCodeCityStatus("T3T 0A1")).toBe("inside");
    expect(postalCodeCityStatus("t3t1b2")).toBe("inside");
  });
});


describe("basement extras are never offered to a condo", () => {
  it("drops basement rows for Apartment or Condo (55) and Basement Suite Only (56)", () => {
    const names = (homeTypeId: number) =>
      listExtrasFor(6, [82, homeTypeId]).map((extra) => extra.name.toLowerCase());
    expect(names(55).some((name) => name.includes("basement"))).toBe(false);
    expect(names(56).some((name) => name.includes("basement"))).toBe(false);
  });

  it("never sends a basement extra for a condo booking", () => {
    const url = buildBookingUrl({
      ...base,
      homeType: 55,
      extras: { "Finished Basement": 1 },
    });
    expect(url).not.toContain("extras");
  });
});


describe("recurring add-on exemption flags", () => {
  it("reads the travel fee as exempt from the frequency discount", () => {
    const travel = travelFeeExtraFor(6, 82);
    expect(travel?.id).toBe(108);
    expect(travel?.exemptFromFrequencyDiscount).toBe(true);
  });

  it("reads the flag per row rather than assuming one rule", () => {
    // Inside Oven is exempt in BookingKoala's own config; the pet fee is not.
    const oven = listExtrasFor(6, 82).find((extra) => extra.name.startsWith("Inside Oven"));
    expect(oven?.exemptFromFrequencyDiscount).toBe(true);
    expect(petsExtraFor(6, 82)?.exemptFromFrequencyDiscount).toBe(false);
  });
});

describe("postal code precedence", () => {
  it("names the city for in-city prefixes", () => {
    expect(postalCodeCityName("t5j0n3")).toBe("Edmonton");
    expect(postalCodeCityName("T2P 1J9")).toBe("Calgary");
    expect(postalCodeCityName("T7X 1A1")).toBeNull();
    expect(postalCodeCityStatus("T7X 1A1")).toBe("outside");
    expect(postalCodeCityStatus("T5J")).toBe("unknown");
  });
});
