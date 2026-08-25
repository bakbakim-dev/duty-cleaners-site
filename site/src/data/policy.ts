/**
 * Single source of truth for service policy — the companion to proof.ts.
 *
 * Every FAQ answer, guarantee mention and terms clause on the site should read
 * from here rather than authoring its own wording. Before this existed, the
 * satisfaction guarantee had four different deadlines across the site, and much
 * of that copy ships inside FAQPage JSON-LD, so Google and AI assistants
 * reproduced the contradictions as authoritative answers.
 *
 * It follows the same convention proof.ts established:
 *
 *     null  =  not confirmed by the owner. Do not render it. Do not guess.
 *
 * A null here is not an oversight — it marks a real business decision that has
 * never been made, or one the site currently answers two ways. Rendering a
 * plausible-sounding default would be inventing a commitment on the company's
 * behalf, which is worse than saying nothing. The terms page simply omits any
 * section whose value is null.
 */

/** A policy value that has been verified against the site's own published copy. */
type Confirmed<T> = T;
/** A policy value nobody has settled yet. Renders as nothing. */
type Unconfirmed = null;

export interface ServicePolicy {
  guaranteeWindowHours: Confirmed<number> | Unconfirmed;
  guaranteeRequiresPhotos: Confirmed<boolean> | Unconfirmed;
  cancellationNoticeHours: Confirmed<number> | Unconfirmed;
  cancellationFee: Confirmed<string> | Unconfirmed;
  lockoutFee: Confirmed<string> | Unconfirmed;
  damageClaimWindowHours: Confirmed<number> | Unconfirmed;
  liabilityNote: Confirmed<string> | Unconfirmed;
  governingProvince: Confirmed<string> | Unconfirmed;
  giftCardExpiryMonths: Confirmed<number> | Unconfirmed;
  giftCardMaxValue: Confirmed<string> | Unconfirmed;
  insuranceClaim: Confirmed<string> | Unconfirmed;
}

export const POLICY: ServicePolicy = {
  /**
   * 24 hours. Stated on roughly 100 surfaces including the guarantee page's own
   * instruction ("contact us within 24 hours of your appointment"), the FAQ, and
   * every location page.
   *
   * TODO-OWNER: one line on the guarantee page contradicted this by excluding
   * issues "reported more than 48 hours after the cleaning". That outlier has
   * been aligned to 24 so a customer calling at 30 hours gets a clear answer.
   * If you meant 48, change this one number and every surface follows.
   */
  guaranteeWindowHours: 24,

  /**
   * TODO-OWNER: llms.txt tells AI assistants the guarantee requires a "photo of
   * missed areas", and the guarantee page's process list asks for photos — but
   * no customer-facing promise mentions it as a condition. Making a photo a
   * precondition of a refund-equivalent is a real restriction, so it is not
   * rendered as one until you confirm it.
   */
  guaranteeRequiresPhotos: null,

  /**
   * TODO-OWNER: the site currently promises "Free reschedule or cancel up to 24
   * hours before" (proof.ts, itself flagged "confirm before launch"), while the
   * legacy FAQ said a cancellation inside 24 hours incurs a $50 fee. These are
   * opposite promises and both cannot ship. Until one is chosen, the terms page
   * states no cancellation charge at all — the safer error, since you cannot
   * charge a fee you never published.
   */
  cancellationNoticeHours: 24,
  cancellationFee: null,

  /** TODO-OWNER: no statement exists anywhere about a cleaner arriving and being
   *  unable to get in. Given customers are told they need not be home, this gap
   *  will eventually be tested. */
  lockoutFee: null,

  /** TODO-OWNER: no damage or breakage claims process exists in either the
   *  current site or the legacy mirror — no deadline, no process, no cap. */
  damageClaimWindowHours: null,
  liabilityNote: null,

  /** TODO-OWNER: no governing-law or dispute clause has ever been published. */
  governingProvince: null,

  /**
   * TODO-OWNER: the gift card page says "No expiry pressure" five lines above
   * "Redeem within six months to keep the gift card valid." Alberta's Consumer
   * Protection Act restricts expiry on gift cards sold for consideration, so
   * this is worth confirming properly rather than picking the tidier sentence.
   */
  giftCardExpiryMonths: null,

  /** The legacy site published a $2,000 CAD ceiling; the rebuild dropped it.
   *  TODO-OWNER: confirm whether it still applies operationally. */
  giftCardMaxValue: null,

  /**
   * TODO-OWNER: the legacy site claimed "fully licensed, insured and bonded"
   * with background checks; the current site deliberately says only
   * "reference-checked"; and the careers page asks cleaners to carry their own
   * insurance as subcontractors. Those are three different claims, and
   * "insured and bonded" is legally meaningful. Nothing is rendered until the
   * true position is confirmed.
   */
  insuranceClaim: null,
};

/* ---------------------------------------------------------------------------
   Terms that ARE settled. Each is quoted or paraphrased from copy already
   published and consistent across the site, so rendering them states nothing
   new — it only puts them in one place.
--------------------------------------------------------------------------- */

/** When payment is taken. Consistent across the FAQ, pricing pages and funnel. */
export const PAYMENT_TERMS = [
  "Nothing is charged when you book.",
  "The day before your appointment a temporary hold is placed on your card to confirm it is valid. It can look like a charge in your banking app, but no money moves.",
  "Your card is charged once the clean is complete.",
  "We accept Visa, Mastercard and American Express, debit, and e-transfer.",
  "Every quoted figure is before tax. GST of 5% is added on top.",
] as const;

/** How a quote can change. Consistent across both pricing pages and the FAQ. */
export const PRICING_TERMS = [
  "Published prices are starting estimates based on the details you give us — home size, number of bathrooms, and the add-ons you choose.",
  "We do not charge trip fees or diagnostic fees.",
  "Most homes are priced flat by size. Your flat rate does not change because a clean took longer than expected.",
  "If the home turns out to need substantially more work than described — heavy build-up, far more glass or cabinetry than stated — the team will explain what they found and your options before continuing.",
  "Recurring discounts of 20% weekly, 15% bi-weekly and 10% monthly apply from your second visit. The first clean is charged at the standard one-time rate.",
  "Hourly service has a minimum of 3 hours for one cleaner, or 2 hours for two cleaners.",
] as const;

/** Scope limits. Taken from the master list on /whats-included, which the
 *  service pages already reproduce in shorter form. */
export const NOT_INCLUDED = [
  "Moving or lifting anything over 25 pounds",
  "Outdoor work, including exterior windows",
  "Anything beyond the reach of a 3-step ladder",
  "Light bulbs and fragile lighting fixtures, including chandeliers",
  "Bodily fluids, animal waste, and cat litter boxes",
  "Mold remediation and heavy mold removal — we may wipe light surface mildew where it is safe to do so",
  "Pest or rodent removal",
  "Garages, patios and other outdoor areas",
  "Carpet steam cleaning and upholstery cleaning",
  "Furnace, vent and duct cleaning",
  "Drain cleaning and plumbing",
  "Window screen removal or window disassembly",
  "Heavy scrubbing of walls and doors, which is a separate wall-washing package",
  "Hoarding situations and removal of large volumes of debris",
  "Laundry and dishes",
] as const;

/** Access, scheduling and what we bring. Consistent across the FAQ and Prepare. */
export const SERVICE_TERMS = [
  "You do not need to be home. Most customers leave a key, a lockbox code, or smart-lock access, and we lock up when we finish.",
  "We bring all cleaning supplies and equipment. If you would prefer we use specific products of your own, tell us when you book.",
  "Running water is required. Some tasks, including vacuuming, may not be possible without electricity.",
  "Tell us about pets, parking, how to get in, and any rooms to skip when you book — the booking form asks for each of these.",
  "Our operating hours are Monday to Saturday 8:00 AM to 8:00 PM, and Sunday 9:00 AM to 3:00 PM.",
] as const;
