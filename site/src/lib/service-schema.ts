import { schemaAddressFor, BRANCH_PROFILES, ORG_ID, BRANCH_ID, BRANCH_IDENTITY } from "@/data/proof";
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
export function buildServiceSchema(input: {
  name: string;
  description: string;
  path: string;
  city: "edmonton" | "calgary";
  /** Lowest real price a customer can book this at, if the page states one. */
  offerFrom?: number;
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
      "@id": BRANCH_ID[input.city],
      name: BRANCH_IDENTITY[input.city].name,
      url: BRANCH_IDENTITY[input.city].url,
      address: schemaAddressFor(input.city),
      parentOrganization: { "@id": ORG_ID },
      sameAs: [...BRANCH_PROFILES[input.city]],
    },
    ...(input.offerFrom !== undefined
      ? {
          offers: {
            "@type": "Offer",
            price: input.offerFrom,
            priceCurrency: "CAD",
            availability: "https://schema.org/InStock",
            // Every figure is derived from bk-config by the caller; nothing here
            // is hand-typed, so it cannot drift from what BookingKoala charges.
            description: `From ${input.offerFrom} CAD, before 5% GST.`,
          },
        }
      : {}),
  };
}
