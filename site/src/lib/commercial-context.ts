import { canonicalForPath } from "@/data/legacy-urls";
import { intentParams, intentHref } from "@/lib/url-intent";

export type CommercialCity = "edmonton" | "calgary";
export type SpecialistCtaKind = "commercial" | "airbnb" | "march-out";

export interface SpecialistCtaContext {
  kind: SpecialistCtaKind;
  city: CommercialCity;
  href: string;
  label: string;
  announcement: string;
  footerHeading: string;
  footerDescription: string;
}

/**
 * Commercial pages do not use the residential instant-price funnel. This
 * helper keeps the announcement bar, navigation and footer on the same
 * walkthrough path as the page itself, including a contact page opened with
 * office intent in its fragment.
 */
export function commercialCityForLocation(
  pathname: string,
  search = "",
  hash = "",
): CommercialCity | null {
  const path = pathname.replace(/\/+$/, "") || "/";
  const isCommercialPage =
    path === "/commercial-cleaning" ||
    path === "/calgary/commercial-cleaning" ||
    path === "/commercial-cleaning-services-calgary";

  const params = intentParams(search, hash);
  const isOfficeContact = path === "/contact-us" && params.get("topic") === "office";
  if (!isCommercialPage && !isOfficeContact) return null;

  if (params.get("city") === "calgary" || /calgary/i.test(path)) return "calgary";
  return "edmonton";
}

export function commercialWalkthroughHref(city: CommercialCity): string {
  return intentHref(canonicalForPath("/contact"), { topic: "office", city });
}

/**
 * The services that cannot honestly use the residential instant-price CTA.
 * Route and contact-intent handling live together so shared chrome cannot
 * promise a price on one screen and ask for a callback on the next.
 */
export function specialistCtaForLocation(
  pathname: string,
  search = "",
  hash = "",
): SpecialistCtaContext | null {
  const path = pathname.replace(/\/+$/, "") || "/";
  const params = intentParams(search, hash);
  const topic = path === "/contact-us" ? params.get("topic") : null;

  const commercialCity = commercialCityForLocation(pathname, search, hash);
  if (commercialCity) {
    return {
      kind: "commercial",
      city: commercialCity,
      href: commercialWalkthroughHref(commercialCity),
      label: "Arrange a Walkthrough",
      announcement: "Commercial cleaning is quoted after a walkthrough and a written scope.",
      footerHeading: "Arrange a commercial cleaning walkthrough.",
      footerDescription: "Tell us about the premises, floor area, visit frequency and access window. The office will confirm the scope and written quote.",
    };
  }

  const isCalgaryAirbnb = path === "/airbnb-cleaning-services-calgary" || path === "/calgary/airbnb-cleaning";
  const isEdmontonAirbnb = path === "/edmonton/airbnb-cleaning";
  if (isCalgaryAirbnb || isEdmontonAirbnb || topic === "airbnb") {
    const city: CommercialCity = params.get("city") === "calgary" || isCalgaryAirbnb ? "calgary" : "edmonton";
    return {
      kind: "airbnb",
      city,
      href: intentHref(canonicalForPath("/contact"), { topic: "airbnb", city }),
      label: "Request a Turnover Quote",
      announcement: "Short-term-rental turnovers are quoted by the office from the turnover scope and timing.",
      footerHeading: "Request a short-term-rental turnover quote.",
      footerDescription: "Tell us the rental size, turnover frequency, linen scope and check-out and check-in times. The office will confirm the quote.",
    };
  }

  if (path === "/edmonton/march-out-cleaning" || topic === "march-out") {
    return {
      kind: "march-out",
      city: "edmonton",
      href: intentHref(canonicalForPath("/contact"), { topic: "march-out", city: "edmonton" }),
      label: "Request a March-Out Quote",
      announcement: "Military housing march-out cleaning is quoted from the inspection list for the home.",
      footerHeading: "Request an Edmonton march-out cleaning quote.",
      footerDescription: "Send the move-out date, CFHA location and the inspection-list items for the home. The Edmonton office will confirm the scope by phone.",
    };
  }

  return null;
}
