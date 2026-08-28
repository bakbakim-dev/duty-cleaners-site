import { schemaAddressFor } from "@/data/proof";

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

const CITY_META = {
  edmonton: {
    locality: "Edmonton",
    telephone: "+1-780-913-6565",
    url: "https://dutycleaners.ca/pricing/",
  },
  calgary: {
    locality: "Calgary",
    telephone: "+1-403-768-1341",
    url: "https://dutycleaners.ca/calgary/pricing",
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
      name: `Duty Cleaners ${meta.locality}`,
      telephone: meta.telephone,
      url: meta.url,
      // One authority for the entity's address (data/proof.ts). This provider
      // node used to carry none at all — on every pricing page.
      address: schemaAddressFor(city),
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
