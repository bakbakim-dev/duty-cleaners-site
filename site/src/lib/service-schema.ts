import { BUSINESS_TRADE_TYPE } from "@/data/proof";
import {
  schemaAddressFor,
  BRANCH_PROFILES,
  ORG_ID,
  BRANCH_ID,
  BRANCH_IDENTITY,
  CITY_PROOF,
  openingHoursShortFor,
  openingHoursSpecFor,
  branchGeoFor,
} from "@/data/proof";
import { sitePriceRange } from "@/data/pricing";
import { canonicalUrlForPath } from "@/data/legacy-urls";

/**
 * Service JSON-LD for the bespoke service pages that do not use
 * ServiceDetailPage.
 *
 * Nine money pages carried no Service markup at all — both wall-washing pages
 * (the site's highest click-efficiency content), both post-construction pages,
 * both Airbnb pages, both service hubs, and move-out Edmonton, whose Calgary
 * twin DID have it. That asymmetry between two pages that should be structurally
 * identical is the tell that these were hand-built and drifted.
 *
 * The provider node carries the branch @id so these pages join the same entity
 * graph as the 154 location pages rather than describing a fresh anonymous
 * business each time.
 */
/** One row of a published price table, exactly as the page prints it. */
export interface ServiceOfferRow {
  /** What the customer is choosing, e.g. "3 Bedroom". */
  name: string;
  /** The figure as rendered, e.g. "$424". Parsed, never re-typed. */
  price: string;
}

export function buildServiceSchema(input: {
  name: string;
  description: string;
  path: string;
  city: "edmonton" | "calgary";
  /** Lowest real price a customer can book this at, if the page states one. */
  offerFrom?: number;
  /** Top of the published range. Emits a priceSpecification instead of a scalar. */
  offerTo?: number;
  /** Any condition the price depends on, e.g. that it is an add-on. */
  offerNote?: string;
  /**
   * A published tier table — pass the same rows the page renders, e.g.
   * `moveInOutTierRows().map((r) => ({ name: r.beds, price: r.price }))`.
   *
   * A page that prints five bookable prices and declares none of them leaves a
   * rich result with nothing to show and an assistant with nothing to quote.
   * This is the shape ServiceDetailPage already emits for the deep-cleaning
   * and standard pages, so the bespoke pages now join them rather than
   * inventing a second convention.
   */
  offerCatalog?: { name: string; rows: ServiceOfferRow[] };
  /**
   * For a service sold by the hour rather than by the job. `offerFrom` becomes
   * a UnitPriceSpecification at this unit, and `minQuantity` becomes the
   * eligibleQuantity floor — which is how a "3-hour minimum" is stated in
   * schema.org rather than buried in prose a parser will not read.
   *
   * `code` is the UN/CEFACT code ("HUR" for an hour); `label` is how the
   * generated description should read it ("per cleaner-hour").
   */
  offerUnit?: { code: string; label: string; minQuantity?: number };
}) {
  const cityName = input.city === "edmonton" ? "Edmonton" : "Calgary";
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    serviceType: input.name,
    url: canonicalUrlForPath(input.path),
    areaServed: { "@type": "Place", name: `${cityName}, AB` },
    provider: {
      "@type": "LocalBusiness",
      additionalType: BUSINESS_TRADE_TYPE,
      "@id": BRANCH_ID[input.city],
      name: BRANCH_IDENTITY[input.city].name,
      url: BRANCH_IDENTITY[input.city].url,
      address: schemaAddressFor(input.city),
      // The office pin, matching the address (data/proof.ts).
      geo: branchGeoFor(input.city),
      // On wall-washing (both cities) and post-construction this nested provider
      // is the ONLY LocalBusiness node the page emits, so leaving the phone off
      // published a business with no way to call it on three money pages.
      // structured-data.test.ts never saw it: nodesOf() walks top-level blocks
      // and @graph arrays, and does not recurse into provider.
      telephone: CITY_PROOF[input.city].phoneE164,
      // The same branch facts location-schema.ts publishes. This node shares
      // the branch @id, but on wall washing and post-construction it is the
      // only LocalBusiness the page emits, so whatever it leaves off is simply
      // absent for a reader of that page: an AuditSpur scan of 2026-09-11 found
      // 17 pages publishing the branch with no hours at all. Read from
      // data/proof.ts, never retyped, so all three builders agree.
      openingHours: openingHoursShortFor(input.city),
      openingHoursSpecification: openingHoursSpecFor(input.city),
      priceRange: sitePriceRange(),
      parentOrganization: { "@id": ORG_ID },
      sameAs: [...BRANCH_PROFILES[input.city]],
    },
    ...(input.offerFrom !== undefined
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "CAD",
            availability: "https://schema.org/InStock",
            /*
              A scalar `price` states one number as THE price. That is right for
              a single figure and wrong for a published band: post-construction
              runs $550 to $1,900 by square footage, and wall washing $39.99 to
              $234.99 by scope, so a bare minimum advertises a job most readers
              cannot have at that price. Where the caller gives a top, emit a
              priceSpecification carrying both ends — which is what schema.org
              provides for exactly this, and what stops a rich result quoting
              the floor as the whole story.
            */
            ...(input.offerUnit
              ? {
                  priceSpecification: {
                    "@type": "UnitPriceSpecification",
                    price: input.offerFrom,
                    priceCurrency: "CAD",
                    unitCode: input.offerUnit.code,
                  },
                  ...(input.offerUnit.minQuantity !== undefined
                    ? {
                        eligibleQuantity: {
                          "@type": "QuantitativeValue",
                          minValue: input.offerUnit.minQuantity,
                          unitCode: input.offerUnit.code,
                        },
                      }
                    : {}),
                }
              : input.offerTo !== undefined
                ? {
                    priceSpecification: {
                      "@type": "PriceSpecification",
                      minPrice: input.offerFrom,
                      maxPrice: input.offerTo,
                      priceCurrency: "CAD",
                    },
                  }
                : { price: input.offerFrom }),
            // Every figure is derived from bk-config by the caller; nothing here
            // is hand-typed, so it cannot drift from what BookingKoala charges.
            // offerNote carries any condition the price depends on. Wall
            // washing is an add-on, and a rich result showing a bare
            // "$39.99" would advertise a visit that cannot be booked.
            description: `${
              input.offerUnit
                ? // The minimum is carried by eligibleQuantity above, and in
                  // whatever offerNote the caller writes; repeating it here as a
                  // bare number ("minimum 3") reads as an unfinished sentence.
                  `${input.offerFrom} CAD ${input.offerUnit.label}`
                : input.offerTo !== undefined
                  ? `${input.offerFrom} to ${input.offerTo} CAD`
                  : `From ${input.offerFrom} CAD`
            }, before 5% GST.${input.offerNote ? ` ${input.offerNote}` : ""}`,
          },
        }
      : {}),
    ...(input.offerCatalog && input.offerCatalog.rows.length > 0
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: input.offerCatalog.name,
            itemListElement: input.offerCatalog.rows.map((row) => {
              // The rows arrive as the strings the table prints ("$424",
              // "$39.99 – $109.99"), so the figures in the markup and the
              // figures on screen are the same characters. Commas are stripped
              // because "$1,900" is one number, not two.
              const numbers = (row.price.match(/\d[\d,]*(?:\.\d+)?/g) ?? []).map((n) =>
                Number(n.replace(/,/g, "")),
              );
              return {
                "@type": "Offer",
                name: row.name,
                priceCurrency: "CAD",
                ...(numbers.length >= 2
                  ? {
                      priceSpecification: {
                        "@type": "PriceSpecification",
                        minPrice: Math.min(...numbers),
                        maxPrice: Math.max(...numbers),
                        priceCurrency: "CAD",
                      },
                    }
                  : numbers.length === 1
                    ? { price: numbers[0] }
                    : {}),
              };
            }),
          },
        }
      : {}),
  };
}
