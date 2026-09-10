import { CITY_PROOF } from "@/data/proof";
// Shared JSON-LD builder for all location pages. Single source of truth for the
// shape, the NAP and the hours — individual pages only supply their name, URL,
// and (optionally) geo, description and area.

import { getListing } from "@/lib/google-listings";
import { withTrailingSlash } from "@/data/legacy-urls";
import {
  schemaAddressFor,
  BRANCH_PROFILES,
  ORG_ID,
  BRANCH_ID,
  BRANCH_IDENTITY,
} from "@/data/proof";
import { geoFor } from "@/data/location-geo";
import { sitePriceRange } from "@/data/pricing";


export interface LocationSchemaInput {
  /** e.g. "Duty Cleaners - Windsor Park Calgary" */
  name: string;
  city: "edmonton" | "calgary";
  /** Absolute canonical URL of the location page */
  url: string;
  /**
   * @deprecated Ignored, and kept only so the 75 call sites that pass it still
   * compile. The price band belongs to the BUSINESS, and there is now one
   * business per branch rather than one per page — so publishing whatever each
   * page happened to pass would assert one entity with several price bands.
   *
   * What the call sites passed was three different things: 65 pages passed the
   * derived `sitePriceRange()`, eight passed "$$", two passed "$$$", and 77
   * passed nothing at all — including nine of the eleven satellite towns, while
   * Airdrie and Cochrane carried one. The builder now publishes
   * `sitePriceRange()` on the provider for every page, so all 155 agree and the
   * figure follows bk-config.
   */
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

/**
 * The place the page is about, as prose. Call sites that pass `areaServed`
 * give it directly; the rest carry it inside the display name they pass
 * ("Duty Cleaners - St. Albert, AB"), which is a business name rather than a
 * place, so the prefix comes off.
 */
function placeNameOf(input: LocationSchemaInput, locality: string): string {
  if (input.areaServed) return input.areaServed;
  const stripped = input.name.replace(/^\s*Duty Cleaners\s*[-–—]\s*/i, "").trim();
  return stripped || `${locality}, AB`;
}

/**
 * ONE BUSINESS PER BRANCH, ONE SERVICE PER PAGE.
 *
 * Every one of the 165 location pages used to declare its own LocalBusiness —
 * "Duty Cleaners - St. Albert, AB", "Duty Cleaners - Windsor Park Calgary" and
 * 163 more — each carrying the branch office's street address. Read literally,
 * that is 165 separate businesses operating out of two addresses, none of which
 * exists. Giving them a stable @id and a `branchOf` link stopped them being
 * ANONYMOUS businesses; it did not stop them being businesses. Two addresses is
 * the true count, and it is also what the two Google Business Profiles say, so
 * a graph asserting 165 is a graph that cannot be reconciled with the listings
 * it is supposed to support.
 *
 * The honest shape is the one the pricing pages already use: the entity is the
 * branch, named once and referenced by @id, and what varies per page is the
 * SERVICE offered and the AREA it is offered in. So the page node is a Service
 * whose provider is the branch, and the coordinates stay where the previous
 * pass correctly put them — on areaServed, the place served, not on the
 * business, which is at its own address either way.
 *
 * Nothing about the geo work changes: `geo` still hangs off `areaServed` and
 * never off a business node.
 */
export function buildLocationSchema(input: LocationSchemaInput) {
  const contact = CITY_CONTACT[input.city];
  const url = toCanonicalUrl(input.url);
  const place = placeNameOf(input, contact.locality);
  const geo = input.geo ?? geoFor(input.url);

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    // Per-page identity for the service, not for a business. The business @id
    // below is shared by every page of the branch, which is the point.
    "@id": `${url}#service`,
    name: `House cleaning in ${place}`,
    serviceType: "House cleaning",
    ...(input.description ? { description: input.description } : {}),
    // Normalised in the builder, not at the call sites. dutycleaners.ca is
    // trailing-slash canonical, but 152 pages passed the un-slashed form — so
    // the node's declared url disagreed with the page's own
    // <link rel="canonical"> on every one of them.
    url,
    areaServed: {
      "@type": "Place",
      name: place,
      /*
        The coordinates belong HERE, on the place served, not on the business.

        They used to sit on the business node beside an address naming the
        Edmonton or Calgary office, so /cleaning-services-leduc/ published a
        business at 18615 71 Ave NW, Edmonton with a pin 30 km away in Leduc.
        schema.org's `geo` on a LocalBusiness is where that business IS; a node
        whose address and coordinates disagree is internally contradictory, and
        address-shared-geo-varies across 153 pages is precisely the shape
        Google's local-search guidance describes when it talks about
        location-page schemes. Attached to areaServed the same numbers say what
        was always meant: this is the area we serve.
      */
      ...(geo
        ? { geo: { "@type": "GeoCoordinates", latitude: geo.latitude, longitude: geo.longitude } }
        : {}),
    },
    provider: {
      "@type": "LocalBusiness",
      // The branch @id, so all 155 pages of a city describe the SAME business
      // rather than one each.
      "@id": BRANCH_ID[input.city],
      // One authority for the name and the url (data/proof.ts). An @id means
      // "this is the same entity", so a second spelling is a contradiction.
      name: BRANCH_IDENTITY[input.city].name,
      url: BRANCH_IDENTITY[input.city].url,
      parentOrganization: { "@id": ORG_ID },
      telephone: contact.telephone,
      email: "support@dutycleaners.ca",
      // Full branch address from the one authority (data/proof.ts). The old
      // inline literal carried locality/region/country only — no street, no
      // postal — which is a business that cannot be matched to its GBP listing
      // or its citations.
      address: schemaAddressFor(input.city),
      // Derived, and the same on every page of the branch. See the note on the
      // deprecated `priceRange` input above for what it replaces.
      priceRange: sitePriceRange(),
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
      // Per-branch, never brand-wide: BRANCH_PROFILES keeps the Edmonton node
      // off Calgary's listing and vice versa.
      sameAs: [...BRANCH_PROFILES[input.city]],
    },
  };
}
