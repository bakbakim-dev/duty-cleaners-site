// Shared LocalBusiness + HouseCleaning JSON-LD builder for all location pages.
// Single source of truth for NAP, hours, and schema shape — individual pages
// only supply their name, URL, and (optionally) geo, priceRange, description.

import { getListing } from "@/lib/google-listings";


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
  edmonton: { telephone: "+1-780-913-6565", locality: "Edmonton" },
  calgary: { telephone: "+1-403-768-1341", locality: "Calgary" },
} as const;

export function buildLocationSchema(input: LocationSchemaInput) {
  const contact = CITY_CONTACT[input.city];

  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HouseCleaning"],
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    url: input.url,
    telephone: contact.telephone,
    email: "support@dutycleaners.ca",
    address: {
      "@type": "PostalAddress",
      addressLocality: contact.locality,
      addressRegion: "AB",
      addressCountry: "CA",
    },
    areaServed: {
      "@type": "Place",
      name: input.areaServed ?? `${contact.locality}, AB`,
    },
    ...(input.geo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: input.geo.latitude,
            longitude: input.geo.longitude,
          },
        }
      : {}),
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
    sameAs: [getListing(contact.locality).url],

  };
}
