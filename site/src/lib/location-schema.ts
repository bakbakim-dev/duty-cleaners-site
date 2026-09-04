import { CITY_PROOF } from "@/data/proof";
// Shared LocalBusiness + HouseCleaning JSON-LD builder for all location pages.
// Single source of truth for NAP, hours, and schema shape — individual pages
// only supply their name, URL, and (optionally) geo, priceRange, description.

import { getListing } from "@/lib/google-listings";
import { withTrailingSlash } from "@/data/legacy-urls";
import { schemaAddressFor, BRANCH_PROFILES, ORG_ID, BRANCH_ID } from "@/data/proof";
import { geoFor } from "@/data/location-geo";


export interface LocationSchemaInput {
  /** e.g. "Duty Cleaners - Windsor Park Calgary" */
  name: string;
  city: "edmonton" | "calgary";
  /** Absolute canonical URL of the location page */
  url: string;
  priceRange?: string;
  geo?: { latitude: string; longitude: string };
  description?: string;
  /** Human-readable area, e.g. "Windsor Park, Calgary, AB" */
  areaServed?: string;
}

const CITY_CONTACT = {
  edmonton: { telephone: CITY_PROOF.edmonton.phoneE164, locality: "Edmonton" },
  calgary: { telephone: CITY_PROOF.calgary.phoneE164, locality: "Calgary" },
} as const;


/** Absolute URL with the site's canonical trailing slash. */
function toCanonicalUrl(url: string): string {
  try {
    const u = new URL(url);
    return `${u.origin}${withTrailingSlash(u.pathname)}${u.search}${u.hash}`;
  } catch {
    return withTrailingSlash(url);
  }
}

export function buildLocationSchema(input: LocationSchemaInput) {
  const contact = CITY_CONTACT[input.city];

  return {
    "@context": "https://schema.org",
    // "HouseCleaning" is NOT a schema.org type — it validates as an unknown
    // string and does nothing. Google falls back to LocalBusiness anyway, so
    // the extra entry was noise on 177 pages. Dropped.
    "@type": "LocalBusiness",
    // Without an @id every one of these was an anonymous business that merely
    // happened to share an address — 166 unconnected entities Google could not
    // reconcile with either Google Business Profile. Each node now has a stable
    // identity, names the branch it belongs to, and hangs off the one
    // Organization.
    "@id": `${toCanonicalUrl(input.url)}#business`,
    parentOrganization: { "@id": ORG_ID },
    branchOf: { "@id": BRANCH_ID[input.city] },
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    // Normalised here, not at the call sites. dutycleaners.ca is trailing-slash
    // canonical, but 152 pages passed the un-slashed form — so the entity's
    // declared url disagreed with the page's own <link rel="canonical"> on
    // every one of them. Doing it in the builder means a call site cannot
    // reintroduce the drift.
    url: toCanonicalUrl(input.url),
    telephone: contact.telephone,
    email: "support@dutycleaners.ca",
    // Full branch address from the one authority (data/proof.ts). The old
    // inline literal carried locality/region/country only — no street, no
    // postal — which is a LocalBusiness that can't be matched to its GBP
    // listing or its citations.
    address: schemaAddressFor(input.city),
    areaServed: {
      "@type": "Place",
      name: input.areaServed ?? `${contact.locality}, AB`,
    },
    /*
      86 of the 153 location pages emitted no GeoCoordinates — every Edmonton
      page and the 7 Calgary satellite towns — because `geo` is optional and
      only the Calgary neighbourhood pages passed it. 47 of those already
      RENDERED real coordinates in their <LocationMap center={[lat,lng]}/> and
      simply never handed them to this builder; the remaining 51 had none
      anywhere, and were left empty rather than given a guessed pin.

      Those 51 are now sourced from OpenStreetMap and live in
      data/location-geo.ts. Resolving the fallback HERE rather than at 51 call
      sites means a page cannot forget to pass it, and an explicit `geo` still
      wins — so the pages that carry their own inline coordinates are unchanged.
    */
    ...(() => {
      const geo = input.geo ?? geoFor(input.url);
      return geo
        ? {
            geo: {
              "@type": "GeoCoordinates",
              latitude: geo.latitude,
              longitude: geo.longitude,
            },
          }
        : {};
    })(),
    ...(input.priceRange ? { priceRange: input.priceRange } : {}),
    openingHours: ["Mo-Sa 08:00-20:00", "Su 09:00-15:00"],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "09:00",
        closes: "15:00",
      },
    ],
    // Permalink to the actual Google Business Profile, not a search query.
    hasMap: getListing(contact.locality).url,
    // Was the single Google Maps permalink. The other eight profiles are linked
    // in the footer on every page but were absent here, where they would
    // actually do disambiguation work.
    sameAs: [...BRANCH_PROFILES[input.city]],

  };
}
