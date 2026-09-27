/**
 * Single source of truth for service policy — the companion to proof.ts.
 *
 * Every FAQ answer, guarantee mention and terms clause on the site should read
 * from here rather than authoring its own wording. Before this existed, the
 * satisfaction guarantee had four different deadlines across the site, and much
 * of that copy ships inside FAQPage JSON-LD, so Google and AI assistants
 * reproduced the contradictions as authoritative answers.
 *
 * Every value below is settled and wrapped in confirm() with who settled it and
 * when (see confirmed.ts; the date is the day the answer was recorded in this
 * repo). policy.test.ts fails the build on any null, so a new field must be
 * confirmed before it is added: a null here would mean a field left blank, not a
 * pending decision. Open business questions belong in proof.ts, where a null
 * still means "not confirmed; render nothing". Never render a plausible-sounding
 * default in place of a confirmed value.
 */

import { confirm, type Confirmed, type Unconfirmed } from "./confirmed";
import { addOnFromPrice, formatPrice, FREQUENCIES, HOME_HOURLY_RATE } from "./pricing";
import { travelFee } from "./addon-table";
import { hoursLineFor } from "./proof";

export interface ServicePolicy {
  guaranteeWindowHours: Confirmed<number> | Unconfirmed;
  guaranteeRequiresPhotos: Confirmed<boolean> | Unconfirmed;
  cancellationNoticeHours: Confirmed<number> | Unconfirmed;
  cancellationFee: Confirmed<string> | Unconfirmed;
  lockoutFee: Confirmed<string> | Unconfirmed;
  /**
   * Charge for eco-friendly products instead of the team's usual ones.
   * (The key keeps its old "eco" name so existing imports still compile; the
   * copy never says "eco-friendly", see below.)
   *
   * It lives here rather than in bk-config because it is NOT a BookingKoala
   * extra — there is no such row at any price, and nothing in the config
   * costs $15. The office arranges it, historically over the phone.
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
  /** What the company does and does not carry, in the owner's words (2026-09-18). */
  insuranceStatus: Confirmed<string> | Unconfirmed;
  /** Typical time on site for a 2-bedroom, 1-bathroom apartment (owner, 2026-09-18). */
  typicalVisitLength: Confirmed<{ standard: string; deep: string }> | Unconfirmed;
  /** Extra time per cleaner-hour, deep and move-out (standard is BookingKoala's hourly rate). */
  extraTimeRates: Confirmed<{ deep: string; moveOut: string }> | Unconfirmed;
  smokeSurchargeFrom: Confirmed<string> | Unconfirmed;
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
  lockoutFee: confirm("up to half the cost of the scheduled service", { by: "owner", on: "2026-09-25" }),

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
   *
   * Owner, 2026-09-11: the option is named "eco-friendly products",
   * never "eco-friendly". The cleaners are subcontractors who choose their own
   * products, so nothing on file supports an environmental, green, non-toxic
   * or pet-safe claim for them. The customer asks the office which products
   * are available and suitable for their surfaces. Guarded in
   * owner-answers-0911.test.ts.
   */
  ecoProductsFee: confirm("$15", { by: "owner", on: "2026-09-07" }),
  ecoProductsHowToRequest: confirm("ask for them when you book, and the team uses eco-friendly products instead of its usual ones", { by: "owner", on: "2026-09-26" }),

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

  /**
   * Owner, 2026-09-18: "The company is licensed, not insured or bonded. Some
   * subcontractor cleaners can carry insurance and bonds, and if you need this,
   * you'd have to specifically ask for it." Worded as "holds a business
   * licence" because the only licence a cleaning company holds in Alberta is a
   * business licence; the retired "licensed, insured and bonded" line stays
   * retired (claims-and-links.test.ts, llms-txt.test.ts).
   */
  insuranceStatus: confirm(
    "Duty Cleaners holds a business licence. The company does not carry insurance or a bond. Some of our cleaners, who work as independent subcontractors, carry their own insurance and bond; if you need a cleaner who does, ask for it specifically when you book.",
    { by: "owner", on: "2026-09-18" },
  ),

  /**
   * Owner, 2026-09-18: a standard clean of a 2-bedroom, 1-bathroom apartment
   * usually takes about 2 hours 30 minutes, and a deep clean of the same
   * apartment about 4 hours.
   *
   * Owner, 2026-09-22: a clean is booked as one visit. The price is set by home
   * size for the condition described; much more work than described is agreed
   * with the customer before it is done, and work beyond the booked visit is
   * quoted and scheduled separately by phone or email. Never promise that the
   * team stays until done, or that the price holds however long it takes.
   */
  typicalVisitLength: confirm(
    { standard: "about 2 hours 30 minutes", deep: "about 4 hours" },
    { by: "owner", on: "2026-09-18" },
  ),

  /** Owner, 2026-09-26 (tracker decide-14): published as "from" rates. */
  extraTimeRates: confirm({ deep: "$70", moveOut: "$75" }, { by: "owner", on: "2026-09-26" }),
  /** Owner, 2026-09-26 (decide-09): minimum $75; a heavily smoked-in home has cost double the booking. */
  smokeSurchargeFrom: confirm("$75", { by: "owner", on: "2026-09-26" }),
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
  // 2026-09-22: a hold sets the price aside. On a debit card that money cannot be
  // spent until the charge, so "no money moves" misled debit customers.
  "The day before your appointment a temporary hold for the price is placed on your card. It is not a charge, but on a debit card the amount is set aside until the clean is charged.",
  "Your card is charged once the clean is complete.",
  // Owner, 2026-09-26 (tracker site-04): the office confirms online bookings, and
  // the team is only sent once the hold is in place.
  "After you book online, our office confirms your booking by phone or email. If we can't reach you, or the booking or card details don't check out, we may not be able to send a team.",
  "The team is sent once the hold for the price is in place. If the hold is declined, we'll contact you; a booking without a hold may be cancelled.",
  // Owner, 2026-09-21: e-transfer is arranged by phone, not online, and with no
  // card to hold it is paid in full the day before the clean.
  "We accept Visa, Mastercard and American Express, and debit. E-transfer can be arranged by phone; with no card to hold, an e-transfer booking is paid in full the day before the clean. If you approve extra work on the day, we either place a hold for it on a card, if you have one, or ask you to e-transfer the estimated extra that day; once the clean is finished, any difference is refunded to you or paid by you.",
  "Every quoted figure is before tax. GST of 5% is added on top.",
] as const;

/**
 * Owner-approved, 2026-09-26 (tracker decide-01). The one full statement of what
 * happens when a home needs much more work than described.
 */
export const EXTRA_WORK_TERM =
  "If our team finds much more work than described, we'll contact you as soon as we know. Any extra charge depends on the extra time the clean takes, so we can't know the final total until it is finished. About halfway through, we'll contact you again with our best estimate of how much longer the clean will take and what it may cost. You can then continue, and we finish the clean at the extra cost; add some time for the things that matter most to you; or switch to a priority list: you choose what gets done from what's left of the clean, and your price stays the same. Some things won't get done.";

/** Owner, 2026-09-26 (decide-04, decide-14): by the half hour, per cleaner, "from" rates. */
export const EXTRA_TIME_RATE_TERM =
  `Extra time is charged by the half hour, for each cleaner, from ${formatPrice(HOME_HOURLY_RATE)} an hour for a standard clean, ${POLICY.extraTimeRates.deep} for a deep clean and ${POLICY.extraTimeRates.moveOut} for a move-in or move-out clean, before GST. A home that needs heavy work, such as thick build-up, strong products or special equipment, is charged at a higher rate. We tell you the rate when we first contact you, before any extra time is done.`;

/** The short form, for pages that mention extra work in passing. */
export const EXTRA_WORK_SHORT =
  "If the home needs much more work than described, we contact you as soon as we know, and again about halfway with an estimate of the time and cost; you decide whether to continue, add some time, or switch to a priority list at your booked price.";

/** How a quote can change. Consistent across both pricing pages and the FAQ. */
export const PRICING_TERMS = [
  "Published prices are starting estimates based on the details you give us — home size, number of bathrooms, and the add-ons you choose.",
  // Scope matters: a travel fee DOES apply outside city limits, and an unscoped
  // "no trip fees" line was shipping inside FAQPage JSON-LD. Naming the amount
  // matters too — /terms/ is a binding document and /locations/ promotes
  // nineteen communities that all sit outside those limits.
  `No trip fee or diagnostic fee inside Edmonton, Calgary and Red Deer city limits. Outside them, a travel fee applies: ${money(travelFee("standard"))} for home cleaning, ${money(travelFee("post-construction"))} for post-construction.`,
  // Compulsory, not an add-on: BookingKoala's extra is literally named "Must
  // choose if you have pets", and it recurs on every visit.
  `Homes with pets are charged ${money(addOnFromPrice("standard", "must-choose-if-you-have-pets"))} per visit — paw prints, nose marks on glass and shed hair add real time in every room. It appears on your quote before you book, and litter boxes and animal waste stay outside what we handle.`,
  "Most homes are priced by size. Your price is for the home size and the condition you chose when you book, and covers the checklist for the service booked. A clean is booked as one visit.",
  // Owner-approved wording, 2026-09-26 (tracker decide-01, 02, 04, 14). The exact
  // total is only known at the end, so never promise "the new total" up front,
  // and never "most likely". Guarded in extra-work-terms.test.ts.
  EXTRA_WORK_TERM,
  EXTRA_TIME_RATE_TERM,
  "If you don't answer our halfway message, the team finishes your booked time and there is no extra charge. Work that needs more than the booked visit is quoted and scheduled separately, by phone or email.",
  `Recurring discounts of ${recurringDiscounts()} apply to flat-rate cleans from your second visit. The first clean is charged at the standard one-time rate. Hourly cleans are charged at the hourly rate every visit.`,
  "Hourly service has a minimum of 3 hours for one cleaner, or 2 hours for two cleaners. The team works through your priority list from the top, for the time booked, and any extra time is confirmed with you first.",
  // Owner, 2026-09-26 (decide-09): from $75; a badly smoked-in home has cost double the booking.
  `If anyone has smoked inside the home, tell us when you book. Smoke film takes extra time to wash off, so a smoke surcharge from ${POLICY.smokeSurchargeFrom} is added, depending on the size of the home and how heavy the residue is; a heavily smoked-in home can cost much more. We quote it before you book and the team confirms it on arrival; if it's heavier than described, we ask before charging more. Washing reduces smoke film and odour, but we can't promise to remove it completely.`,
  // Owner, 2026-09-26 (decide-10).
  "Most homes have free parking nearby. If the only parking near your home is paid, the parking cost is added to your bill at the amount we paid. Tell us about free visitor stalls or driveway space when you book.",
  // Owner, 2026-09-26 (site-07).
  "For move-out and post-construction cleans, homes that have been smoked in, and homes rated 4 or 5 on the booking form, we may ask for a few photos before confirming, so the team arrives prepared and your price is right.",
] as const;

/** Scope limits. Taken from the master list on /whats-included, which the
 *  service pages already reproduce in shorter form. */
export const NOT_INCLUDED = [
  "Moving or lifting anything over 25 pounds",
  "Outdoor work, including exterior windows",
  "Anything beyond the reach of a two-step stool",
  "Light bulbs and fragile lighting fixtures, including chandeliers",
  "Bodily fluids, animal waste, and cat litter boxes — a health call rather than a time one; the pet charge covers the extra time pets add everywhere else in the home",
  "Mould remediation and heavy mould removal — we may wipe light surface mildew where it is safe to do so",
  "Pest or rodent removal",
  // Owner, 2026-09-11: the balcony or garage sweep is a real BookingKoala
  // add-on, offered mostly in summer because the rest of the year is usually
  // too cold, wet or snowy. It is a sweep of the floor only.
  "Garages, patios and other outdoor areas, apart from the balcony or garage sweep add-on, available mostly in summer when the weather allows",
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
  `We bring all cleaning supplies and equipment. Eco-friendly products are available for ${POLICY.ecoProductsFee}: ${POLICY.ecoProductsHowToRequest}. That charge is before GST.`,
  "Running water is required. Some tasks, including vacuuming, may not be possible without electricity.",
  "Tell us about pets, parking, how to get in, and any rooms to skip when you book — the booking form asks for each of these.",
  // Per branch, from proof.ts: the Red Deer office keeps different hours.
  `The Edmonton and Calgary offices are open ${hoursLineFor("edmonton")}. The Red Deer office is open ${hoursLineFor("reddeer")}.`,
  "We schedule to an arrival window rather than an exact time, so traffic or an earlier job running long does not push your whole day.",
  // Owner, 2026-09-26 (site-04): windows are sometimes widened on purpose.
  "If an earlier clean runs long, we may widen your arrival window, and we'll tell you. Ask for a call 30 minutes before the team arrives, or 30 minutes before they finish so you can walk through with them.",
  // Owner, 2026-09-26 (decide-13).
  "If you ask the team to stop after they've started, you're charged for the work already done: for a flat-rate clean, up to the full price, depending on how much was completed; for an hourly clean, the time worked, with the booked minimum.",
  // Owner, 2026-09-26 (decide-07, option C): far addresses book by phone.
  "Homes more than 40 minutes' drive from Edmonton, past its surrounding cities, pay a higher travel fee and book by phone, so we can quote it before you book.",
] as const;

/**
 * The three arrival windows. These were published on the legacy site, dropped in
 * the rebuild, and confirmed by the owner as still accurate. Restoring them
 * matters: a visitor deciding whether to book wants to know when someone turns
 * up, and "we'll confirm your window when you book" answers nothing.
 */
export const ARRIVAL_WINDOWS = ["9:00 to 10:00 AM", "12:00 to 1:00 PM", "3:00 to 4:00 PM"] as const;
