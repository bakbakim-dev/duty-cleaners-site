import type { LegacyUrl } from "./legacy-urls";

/**
 * Old WordPress pages found on the Wayback Machine that 404 since the switch
 * (deep audit 2026-10-09: 38 of 88; re-probed the same night). Each goes to the
 * page that replaced it; login, thank-you and internal VA pages stay 404.
 *
 * Kept out of legacy-urls.ts on purpose: that file ships in every page's entry
 * script (canonicalForPath), and these are redirect-only, so only the .htaccess
 * and _redirects generators read them (page-weight.test.ts budgets the entry).
 */
export const ARCHIVE_REDIRECTS: LegacyUrl[] = [
  { legacy: "/aboutus", target: "/about-us", mode: "redirect", impressions: 0 },
  { legacy: "/jobs", target: "/join-the-team", mode: "redirect", impressions: 0 },
  { legacy: "/cleaning-jobs-in-edmonton/apply", target: "/join-the-team", mode: "redirect", impressions: 0 },
  { legacy: "/cleaners-quiz", target: "/join-the-team", mode: "redirect", impressions: 0 },
  { legacy: "/booking", target: "/#quote", mode: "redirect", impressions: 0 },
  { legacy: "/cleaning-services-for-stony-plain", target: "/cleaning-services-stony-plain", mode: "redirect", impressions: 0 },
  { legacy: "/edmonton-alberta", target: "/", mode: "redirect", impressions: 0 },
  { legacy: "/home-v1", target: "/", mode: "redirect", impressions: 0 },
  { legacy: "/giftcard", target: "/gift-card", mode: "redirect", impressions: 0 },
  { legacy: "/service-area", target: "/locations", mode: "redirect", impressions: 0 },
  { legacy: "/services-pricing/beaumont-house-cleaning-services", target: "/cleaning-services-beaumont", mode: "redirect", impressions: 0 },
  { legacy: "/services-pricing/cleaning-services-spruce-grove", target: "/cleaning-services-spruce-grove", mode: "redirect", impressions: 0 },
  { legacy: "/services-pricing/deepcleaning", target: "/edmonton/deep-cleaning", mode: "redirect", impressions: 0 },
  { legacy: "/services-pricing/house-cleaning-sherwood-park", target: "/cleaning-services-sherwood-park", mode: "redirect", impressions: 0 },
  { legacy: "/services-pricing/leduc-cleaners", target: "/cleaning-services-leduc", mode: "redirect", impressions: 0 },
  { legacy: "/services-pricing/st-albert-cleaning-services", target: "/cleaning-services-st-albert", mode: "redirect", impressions: 0 },
  { legacy: "/services-we-offer-cleaning-checklist", target: "/whats-included", mode: "redirect", impressions: 0 },
  { legacy: "/services/move-in-move-out-new", target: "/move-out-cleaning-edmonton", mode: "redirect", impressions: 0 },
  { legacy: "/testimonials", target: "/reviews", mode: "redirect", impressions: 0 },
  { legacy: "/testimonials/alissa-j", target: "/reviews", mode: "redirect", impressions: 0 },
  { legacy: "/testimonials/sarah", target: "/reviews", mode: "redirect", impressions: 0 },
  { legacy: "/the-best-tips-and-tricks-for-house-cleaning", target: "/blog/spotless-home-tips", mode: "redirect", impressions: 0 },
  { legacy: "/the-ultimate-guide-to-speedy-home-cleaning", target: "/blog/spotless-home-tips", mode: "redirect", impressions: 0 },
  { legacy: "/what-to-expect-from-your-next-cleaning-company", target: "/blog/choosing-cleaning-company", mode: "redirect", impressions: 0 },
  { legacy: "/why-choose-a-professional-cleaner", target: "/blog/choosing-cleaning-company", mode: "redirect", impressions: 0 },
  { legacy: "/why-you-should-consider-hiring-cleaning-services", target: "/blog/choosing-cleaning-company", mode: "redirect", impressions: 0 },
  { legacy: "/10-tips-for-interstate-moving", target: "/blog", mode: "redirect", impressions: 0 },
  { legacy: "/how-to-pack-and-label-your-boxes-when-moving-home", target: "/blog", mode: "redirect", impressions: 0 },
  { legacy: "/how-to-plan-a-home-renovation", target: "/blog", mode: "redirect", impressions: 0 },
];
