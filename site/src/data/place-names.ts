/**
 * The single authority for turning a location slug into a human name.
 *
 * Every bug in this family came from de-slugging in place: LocationPricing
 * title-cased the raw slug and rendered "Altadore Calgary" in prose on ~100
 * pages; Breadcrumbs rendered "Laurel Edmonton" as a crumb label (visible and
 * in BreadcrumbList schema) on 110 pages; other call sites produced "Mc Leod",
 * "Hollick Kenyon", "Central Mcdougall", "Killarney Glengarry" and a bare
 * "West" injected 27 times on the West Calgary district page. One derivation,
 * one override table, everywhere.
 */

/** Slugs whose display form cannot be derived by title-casing. */
const SPECIAL: Record<string, string> = {
  "st-albert": "St. Albert",
  "mcconachie": "McConachie",
  "mccauley": "McCauley",
  "mckernan": "McKernan",
  "mcleod": "McLeod",
  "central-mcdougall": "Central McDougall",
  "hollick-kenyon": "Hollick-Kenyon",
  "killarney-glengarry": "Killarney-Glengarry",
  "bridgeland-riverside": "Bridgeland-Riverside",
  // A district label, not a neighbourhood — bare "West" reads as an adjective.
  "west": "West Calgary",
};

/**
 * Names that need an article or expansion when used mid-sentence ("a standard
 * clean in the Beltline"), where the bare display name reads wrong.
 */
const PROSE: Record<string, string> = {
  "beltline": "the Beltline",
  "downtown": "Downtown Edmonton",
  "downtown-west-end": "the Downtown West End",
  "east-village": "the East Village",
};

/** Strip route prefixes and the trailing city qualifier off a slug. */
export function bareSlug(slug: string): string {
  return slug
    .replace(/^\/?(?:locations|cleaning-services)[/-]?/, "")
    .replace(/\/+$/, "")
    .replace(/-(edmonton|calgary)$/, "");
}

/** Display name for headings, crumbs, labels: "Hollick-Kenyon", "St. Albert". */
export function displayNameFor(slug: string): string {
  const bare = bareSlug(slug);
  return (
    SPECIAL[bare] ??
    bare
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

/** Name for use mid-sentence: "the Beltline", "Downtown Edmonton". */
export function proseNameFor(slug: string): string {
  return PROSE[bareSlug(slug)] ?? displayNameFor(slug);
}
