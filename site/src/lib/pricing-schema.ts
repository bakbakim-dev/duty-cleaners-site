import { CITY_PROOF } from "@/data/proof";
import { schemaAddressFor, BRANCH_ID, BRANCH_IDENTITY, openingHoursShortFor, openingHoursSpecFor } from "@/data/proof";
import { sitePriceRange } from "@/data/pricing";
import { canonicalUrlForPath } from "@/data/legacy-urls";

interface PriceRow {
  beds: string;
  price: string;
}

interface PricingSchemaInput {
  city: "edmonton" | "calgary";
  standard: PriceRow[];
  deep: PriceRow[];
  moveInOut: PriceRow[];
}

/**
 * The two pricing routes, resolved through the same helper every canonical,
 * link and sitemap entry on the site goes through.
 *
 * They used to be two hand-typed absolute URLs, and one of them drifted: the
 * Calgary entry read "https://dutycleaners.ca/calgary/pricing" with no trailing
 * slash on a trailing-slash-canonical site. So the Service node's `url` named a
 * URL that 301s, and disagreed with the <link rel="canonical"> on the page
 * emitting it — the node claimed to be about a different address than the page
 * it shipped on. Deriving both from canonicalUrlForPath means a call site
 * cannot reintroduce that, and a future route change follows automatically.
 */
const CITY_META = {
  edmonton: {
    locality: "Edmonton",
    telephone: CITY_PROOF.edmonton.phoneE164,
    url: canonicalUrlForPath("/pricing"),
  },
  calgary: {
    locality: "Calgary",
    telephone: CITY_PROOF.calgary.phoneE164,
    url: canonicalUrlForPath("/calgary/pricing"),
  },
} as const;

const toNumber = (price: string) => Number(price.replace(/[^0-9.]/g, ""));

export function buildPricingSchema({ city, standard, deep, moveInOut }: PricingSchemaInput) {
  const meta = CITY_META[city];

  const catalogSection = (name: string, rows: PriceRow[]) => ({
    "@type": "OfferCatalog",
    name,
    itemListElement: rows.map((row) => ({
      "@type": "Offer",
      name: `${name} - ${row.beds}`,
      price: toNumber(row.price),
      priceCurrency: "CAD",
      itemOffered: {
        "@type": "Service",
        name: `${name} (${row.beds})`,
        areaServed: { "@type": "City", name: `${meta.locality}, AB` },
      },
    })),
  });

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `House Cleaning Services in ${meta.locality}`,
    url: meta.url,
    provider: {
      "@type": "LocalBusiness",
      // @id merges this into the branch entity. Without it the two pricing
      // pages declared two more anonymous businesses at the branch addresses.
      "@id": BRANCH_ID[city],
      name: BRANCH_IDENTITY[city].name,
      telephone: meta.telephone,
      url: BRANCH_IDENTITY[city].url,
      // One authority for the entity's address (data/proof.ts). This provider
      // node used to carry none at all — on every pricing page.
      address: schemaAddressFor(city),
      // The branch's hours and published band, from data/proof.ts and
      // data/pricing.ts. Same reason as service-schema.ts: a node that names a
      // business without saying when it answers is incomplete wherever it is
      // the only LocalBusiness on the page.
      openingHours: openingHoursShortFor(city),
      openingHoursSpecification: openingHoursSpecFor(city),
      priceRange: sitePriceRange(),
    },
    areaServed: { "@type": "City", name: `${meta.locality}, AB` },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${meta.locality} Cleaning Pricing`,
      itemListElement: [
        catalogSection("Standard Cleaning", standard),
        catalogSection("Deep Cleaning", deep),
        catalogSection("Move In/Out Cleaning", moveInOut),
      ],
    },
  };
}
