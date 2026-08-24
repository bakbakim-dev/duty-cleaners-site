/**
 * Small helpers for structured data that has to carry absolute URLs.
 *
 * Vite rewrites asset imports to a hashed, base-prefixed path (`/assets/x-h.jpg`
 * in production, `/dutycleaners-preview/assets/x-h.jpg` on the staging build).
 * Schema needs a fully-qualified https URL on the real domain, so the base
 * prefix is stripped before the origin is applied — otherwise the staging base
 * would leak into the emitted markup.
 */
const SITE_ORIGIN = "https://dutycleaners.ca";

export function absoluteAssetUrl(assetPath: string): string {
  const base = import.meta.env.BASE_URL || "/";
  const path =
    base !== "/" && assetPath.startsWith(base) ? `/${assetPath.slice(base.length)}` : assetPath;
  return new URL(path, SITE_ORIGIN).href;
}

/**
 * Publisher node for Article markup. Google requires `publisher.logo` for
 * Article rich results, which every post was missing.
 */
export const ARTICLE_PUBLISHER = {
  "@type": "Organization",
  name: "Duty Cleaners",
  "@id": `${SITE_ORIGIN}/#org`,
  logo: { "@type": "ImageObject", url: `${SITE_ORIGIN}/logo.png` },
} as const;

export const ARTICLE_AUTHOR = {
  "@type": "Organization",
  name: "Duty Cleaners",
  url: `${SITE_ORIGIN}/`,
} as const;
