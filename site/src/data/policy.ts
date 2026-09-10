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
 * and, since 2026-09-07, the other half of it is enforced by the compiler: a
 * non-null value must be wrapped in confirm() with who settled it and when.
 * See confirmed.ts. The date is the day the answer was recorded in this repo.
 *
 * A null here is not an oversight — it marks a real business decision that has
 * never been made, or one the site currently answers two ways. Rendering a
 * plausible-sounding default would be inventing a commitment on the company's
 * behalf, which is worse than saying nothing. The terms page simply omits any
 * section whose value is null.
 */

import { confirm, type Confirmed, type Unconfirmed } from "./confirmed";
import { addOnFromPrice, formatPrice, FREQUENCIES } from "./pricing";
import { travelFee } from "./addon-table";

export interface ServicePolicy {
  guaranteeWindowHours: Confirmed<number> | Unconfirmed;
  guaranteeRequiresPhotos: Confirmed<boolean> | Unconfirmed;
  cancellationNoticeHours: Confirmed<number> | Unconfirmed;
  cancellationFee: Confirmed<string> | Unconfirmed;
  lockoutFee: Confirmed<string> | Unconfirmed;
  /**
   * Charge for supplying eco-friendly products instead of the standard range.
   *
   * It lives here rather than in bk-config because it is NOT a BookingKoala
   * extra — there is no eco or green-products row at any price, and nothing in
   * the config costs $15. The office arranges it, historically over the phone.
   */
  ecoProductsFee: Confirmed<string> | Unconfirmed;
  /** How that charge is arranged, since it cannot be selected at checkout. */
  ecoProductsHowToRequest: Confirmed<string> | Unconfirmed;
  damageClaimWindowHours: Confirmed<number> | Unconfirmed;
  liabilityNote: Confirmed<string> | Unconfirmed;
  /** What happens when WE move a booking. */
  ourCancellationNote: Confirmed<string> | Unconfirmed;
  governingProvince: Confirmed<string> | Unconfirmed;
  /** Months until expiry, or "none" when the card genuinely never expires. */
  giftCardExpiryMonths: Confirmed<number | "none"> | Unconfirmed;
  /** A dollar ceiling, or "none" when there deliberately is not one. */
  giftCardMaxValue: Confirmed<string | "none"> | Unconfirmed;
  insuranceClaim: Confirmed<string> | Unconfirmed;
}

export const POLICY: ServicePolicy = {
  /**
   * Confirmed by the owner: 24 hours, and explicitly not 48.
   *
   * One line on the guarantee page used to exclude issues "reported more than 48
   * hours after the cleaning", directly under a promise saying 24 — so a
   * customer calling at 30 hours could not tell whether they were covered. That
   * outlier now reads from here, as does every other surface.
   *
   * Note for anyone editing the guarantee page: the "return visit typically
   * within 48 hours" line there is a DIFFERENT figure — how quickly we come
   * back, not how long a customer has to tell us. Leave it alone.
   */
  guaranteeWindowHours: confirm(24, { by: "owner", on: "2026-08-24" }),

  /**
   * Confirmed by the owner: photos help, but they are NOT a condition of the
   * guarantee. A customer who phones within the window and describes what was
   * missed is covered whether or not they send a picture.
   *
   * This matters because the wording had drifted the other way: llms.txt was
   * telling AI assistants a photo was "required" (removed), and the guarantee
   * page listed "Send photos" as a numbered step, which reads as mandatory.
   * Anything that asks for photos must frame them as helpful, never as a
   * precondition.
   */
  guaranteeRequiresPhotos: confirm(false, { by: "owner", on: "2026-08-24" }),

  /**
   * Confirmed by the owner: 24 hours' notice, $50 inside that window. This
   * settles the conflict between the live "free reschedule or cancel" line and
   * the legacy FAQ's $50 fee — the legacy FAQ was right.
   */
  cancellationNoticeHours: confirm(24, { by: "owner", on: "2026-08-24" }),
  cancellationFee: confirm("$50", { by: "owner", on: "2026-08-24" }),

  /**
   * Confirmed by the owner. Nothing had ever been published about a cleaner
   * arriving and being unable to get in, which mattered because customers are
   * explicitly told they need not be home.
   */
  lockoutFee: confirm("half the cost of the scheduled service", { by: "owner", on: "2026-08-24" }),

  /**
   * Confirmed by the owner (2026-09-07): a real charge the office quotes by
   * phone, and it applies to EVERY service, not just the page that first
   * mentioned it. It is deliberately absent from the BookingKoala booking form, so
   * anything the site says about it must also say how to ask for it — a
   * customer who reads "$15 add-on" and then cannot find it at checkout has
   * been told something true in a way that reads as a mistake.
   *
   * This is why the figure is not derived: published-prices.test.ts bans dollar
   * literals on the service pages precisely so prices come from one place, and
   * for a charge BookingKoala does not carry, that place is here.
   */
  ecoProductsFee: confirm("$15", { by: "owner", on: "2026-09-07" }),
  ecoProductsHowToRequest: confirm("ask when you book and the office adds it", { by: "owner", on: "2026-09-07" }),

  /**
   * Confirmed by the owner. Neither the current site nor the legacy mirror had
   * any damage process at all — no deadline, no method, nothing.
   *
   * The remedy was added 2026-09-03, also confirmed by the owner. Until then
   * the clause stopped at "we will come back to you", which is where a
   * customer looking at a chipped stone edge assumes the worst version. The
   * not-at-fault branch is stated too, on purpose: a conditional remedy reads
   * as a dodge unless the other half of the condition is written down.
   */
  damageClaimWindowHours: confirm(24, { by: "owner", on: "2026-08-24" }),
  liabilityNote: confirm(
    "If something is damaged or broken during a clean, send us photos or video within 24 hours so we can look into it while the details are still fresh. Reach us by phone or email; we will ask the team what happened and come back to you with what we find. Where we are at fault, we put it right — a credit, a repair, a replacement, reimbursing you, or taking it off the bill, whichever fits the damage, and we will talk it through with you before we settle on one. Where we find we are not at fault, we will tell you that plainly and explain why rather than leaving it open.",
    { by: "owner", on: "2026-09-03" },
  ),

  /**
   * Confirmed by the owner: Alberta. Neither the current site nor any of the 135
   * legacy pages had ever named a province or a forum, so a dispute had no
   * stated jurisdiction at all.
   */
  governingProvince: confirm("Alberta", { by: "owner", on: "2026-08-24" }),

  /**
   * Confirmed by the owner 2026-09-03. The cancellation terms ran entirely one
   * way — $50 from the customer inside 24 hours, half the visit for a lockout,
   * and nothing at all about a clean WE move. There is no compensation, and
   * saying so is the point: naming the limit yourself reads as fair, and being
   * found out later does not. The two commitments attached cost nothing — the
   * earliest slot we have, and no fee if the new date does not suit, because a
   * 24-hour rule cannot fairly apply to a change we caused.
   */
  ourCancellationNote: confirm(
    "Very occasionally we have to move a booking — a cleaner is ill, a vehicle will not start, or the roads are genuinely unsafe. We tell you as soon as we know, and we offer you the earliest slot we have; where we can move another job to keep you near your original date, we will. You are not charged for a visit we did not do, and if the new date does not suit you and you would rather cancel, there is no cancellation fee — the 24-hour rule does not apply to a change we caused. We do not pay compensation for a rescheduled clean, and we would rather say so here than have you find out at the time.",
    { by: "owner", on: "2026-09-03" },
  ),


  /**
   * Confirmed by the owner: gift cards do not expire, and the balance is
   * tracked. The "redeem within six months" lines were the error and have been
   * removed. This is also the safer side of Alberta's Consumer Protection Act,
   * which restricts expiry on gift cards sold for consideration.
   */
  giftCardExpiryMonths: confirm("none", { by: "owner", on: "2026-08-24" }),

  /**
   * Confirmed by the owner: no ceiling. The legacy site published a $2,000 CAD
   * limit and the rebuild replaced it with "no minimum or maximum" — an active
   * claim rather than a quiet omission, which is why it needed settling.
   *
   * BookingKoala imposes no ceiling of its own. Per their gift card docs, the
   * maximum is an opt-in toggle: "Select 'No' to disable the maximum gift card
   * amount limit." (help.bookingkoala.com/help/gift-cards)
   *
   * DEPENDS ON A SETTING: this is only true while "Enable the maximum gift card
   * amount limit?" is set to No under Settings > General > Store Options >
   * Admin. The same screen carries a gift card MINIMUM, which the site also
   * claims not to have. If either is ever switched on, this constant and the
   * gift card pages must change with it.
   */
  giftCardMaxValue: confirm("none", { by: "owner", on: "2026-08-24" }),

  /**
   * Confirmed by the owner: reference-checked only. The legacy site's "fully
   * licensed, insured and bonded" claim is NOT reinstated — it is legally
   * meaningful and is not the true position. Do not reintroduce it.
   */
  insuranceClaim: confirm(
    "Every cleaner is reference-checked before their first job, and rated by the customer after every visit. Those ratings decide who we keep sending.",
    { by: "owner", on: "2026-08-24" },
  ),
};

/* ---------------------------------------------------------------------------
   Terms that ARE settled. Each is quoted or paraphrased from copy already
   published and consistent across the site, so rendering them states nothing
   new — it only puts them in one place.
--------------------------------------------------------------------------- */

/**
 * The figures below come from bk-config, not from here. /terms/ is a binding
 * document, and it hand-typed the travel fee, the pet charge and the three
 * recurring discounts — the same drift published-prices.test.ts bans on every
 * page, in the one file that is supposed to be the source.
 */
const money = (value: number | null) => (value === null ? "a fee quoted when you book" : formatPrice(value));

/** "20% weekly, 15% bi-weekly and 10% every 4 weeks", from the live tiers. */
const recurringDiscounts = () => {
  const tiers = FREQUENCIES.filter((f) => f.discount > 0)
    .sort((a, b) => b.discount - a.discount)
    .map((f) => `${Math.round(f.discount * 100)}% ${f.label.toLowerCase()}`);
  return `${tiers.slice(0, -1).join(", ")} and ${tiers.at(-1)}`;
};

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
  // Scope matters: a travel fee DOES apply outside city limits, and an unscoped
  // "no trip fees" line was shipping inside FAQPage JSON-LD. Naming the amount
  // matters too — /terms/ is a binding document and /locations/ promotes
  // nineteen communities that all sit outside those limits.
  `No trip fee or diagnostic fee inside Edmonton and Calgary city limits. Outside them, a travel fee applies: ${money(travelFee("standard"))} for home cleaning, ${money(travelFee("post-construction"))} for post-construction.`,
  // Compulsory, not an add-on: BookingKoala's extra is literally named "Must
  // choose if you have pets", and it recurs on every visit.
  `Homes with pets are charged ${money(addOnFromPrice("standard", "must-choose-if-you-have-pets"))} per visit — paw prints, nose marks on glass and shed hair add real time in every room. It appears on your quote before you book, and litter boxes and animal waste stay outside what we handle.`,
  "Most homes are priced flat by size. Your flat rate does not change because a clean took longer than expected.",
  "If the home turns out to need substantially more work than described — heavy build-up, far more glass or cabinetry than stated — the team will explain what they found and your options before continuing.",
  `Recurring discounts of ${recurringDiscounts()} apply from your second visit. The first clean is charged at the standard one-time rate.`,
  "Hourly service has a minimum of 3 hours for one cleaner, or 2 hours for two cleaners.",
] as const;

/** Scope limits. Taken from the master list on /whats-included, which the
 *  service pages already reproduce in shorter form. */
export const NOT_INCLUDED = [
  "Moving or lifting anything over 25 pounds",
  "Outdoor work, including exterior windows",
  "Anything beyond the reach of a 3-step ladder",
  "Light bulbs and fragile lighting fixtures, including chandeliers",
  "Bodily fluids, animal waste, and cat litter boxes — a health call rather than a time one; the pet charge covers the extra time pets add everywhere else in the home",
  "Mould remediation and heavy mould removal — we may wipe light surface mildew where it is safe to do so",
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
  `We bring all cleaning supplies and equipment. Eco-friendly products are available for ${POLICY.ecoProductsFee}: ${POLICY.ecoProductsHowToRequest}.`,
  "Running water is required. Some tasks, including vacuuming, may not be possible without electricity.",
  "Tell us about pets, parking, how to get in, and any rooms to skip when you book — the booking form asks for each of these.",
  "Our operating hours are Monday to Saturday 8:00 AM to 8:00 PM, and Sunday 9:00 AM to 3:00 PM.",
  "We schedule to an arrival window rather than an exact time, so traffic or an earlier job running long does not push your whole day.",
] as const;

/**
 * The three arrival windows. These were published on the legacy site, dropped in
 * the rebuild, and confirmed by the owner as still accurate. Restoring them
 * matters: a visitor deciding whether to book wants to know when someone turns
 * up, and "we'll confirm your window when you book" answers nothing.
 */
export const ARRIVAL_WINDOWS = ["9:00 – 10:00 AM", "12:00 – 1:00 PM", "3:00 – 4:00 PM"] as const;
