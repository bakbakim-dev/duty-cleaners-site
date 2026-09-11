import { POLICY } from "@/data/policy";
import { Link } from "react-router-dom";
import { CheckCircle2, Clock, ClipboardList, Building2, Sparkles } from "lucide-react";

/**
 * The depth sections for the two commercial pages.
 *
 * Why this exists: /commercial-cleaning and /commercial-cleaning-services-calgary
 * together earn 347k impressions but the commercial query cluster averages
 * position 42 with 65 clicks — the largest single gap in the account. The old
 * WordPress pages carried ~1,650 words; the rebuild shipped ~610.
 *
 * The sub-clusters this content is written to answer, from Search Console:
 *   office cleaning        ~34k impressions (Edmonton variant sits at pos 10)
 *   commercial cleaning    ~45k
 *   janitorial services    ~6k
 *   warehouse cleaning     ~2.4k (pos 13)
 *   retail space cleaning  ~2.2k
 *
 * Everything here is drawn from facts already published elsewhere on the site
 * (per-square-foot commercial pricing set at a walkthrough, owner 2026-09-03;
 * operating hours, vetting, the 24-hour re-clean window). No pricing figures,
 * certifications or client names are invented — where a number would need
 * owner confirmation, the copy describes the process instead of asserting a
 * value. Owner, 2026-09-11: the late-cancellation fee and the re-clean window
 * apply to commercial clients as they do to homes (read from POLICY, never
 * typed), and evening and weekend work outside the office's regular hours can
 * be arranged. No deposit claim is made: none is confirmed. The cleaners are subcontractors who choose their own products (owner,
 * 2026-09-11), so nothing here claims what a product does: the copy says what
 * the team does, and product requirements are confirmed in writing per site.
 */

interface CommercialDepthProps {
  city: "Edmonton" | "Calgary";
  phone: string;
  phoneLink: string;
}

export function commercialFaqs(city: "Edmonton" | "Calgary", phone: string) {
  return [
    {
      q: `How much does commercial cleaning cost in ${city}?`,
      a: `Commercial cleaning in ${city} is priced per square foot of the area actually cleaned, and the rate is set at a walkthrough rather than off a floor plan, because two premises of the same size rarely take the same time. A call centre and a dental clinic have very different requirements, and washroom count, floor type and foot traffic all move the rate. The written quote states the areas, the visit frequency and the pricing basis before work is booked. Call ${phone} to arrange the walkthrough.`,
    },
    {
      q: "Can you clean outside our business hours?",
      // Owner, 2026-09-11: work outside the office's regular hours, evenings and
      // weekends included, can be arranged. The answer used to say "ask at the
      // walkthrough"; it now says yes.
      a: `Yes. Most commercial schedules run before opening or after close, so cleaning does not interrupt staff or customers, and evening and weekend visits outside the ${city} office's regular hours can be arranged. The visit times agreed at the walkthrough go into the written quote.`,
    },
    {
      q: "Do we need to sign a long-term contract?",
      // Was "no cancellation penalty", inside FAQPage schema, against a policy of
      // $50 inside 24 hours. The real point — no lock-in — survives intact.
      // Owner, 2026-09-11: the late-cancellation fee applies to commercial
      // clients as it does to homes; both figures are read from policy.ts.
      a: `No. Recurring schedules are the most common arrangement, and on one we send your regular team where we can. There is no lock-in period and no penalty for ending the schedule. Commercial clients have the same cancellation rule as homes: a visit can be moved or cancelled with ${POLICY.cancellationNoticeHours} hours' notice, and inside that window the fee is ${POLICY.cancellationFee}. If you would rather start with a single deep clean before committing to a schedule, that is a normal way to begin.`,
    },
    {
      q: "How are your cleaners vetted, and what about insurance?",
      a: "Every cleaner is reference-checked before their first job and rated by the customer after every visit — those ratings decide who keeps working for us. Duty Cleaners has been operating in Alberta since 2017. On insurance we do not make blanket coverage claims, because that is a legally specific statement and it should not be made loosely. If your contract requires particular certificates, coverage limits or security clearances, raise it before you sign and we will confirm in writing what we can provide for your site.",
    },
    {
      q: "Will the same team clean our premises each visit?",
      a: "On a recurring schedule we send your regular team where we can, and that is the main practical reason to move from ad-hoc to scheduled cleaning. A team that knows your alarm codes, access routine and the areas that matter most to you spends less of each visit finding its way around.",
    },
    {
      q: "What happens if something is missed?",
      // Owner, 2026-09-11: the re-clean window applies to commercial clients as
      // it does to homes, and it runs from the clean.
      a: `Commercial clients have the same re-clean guarantee as homes. Tell us within ${POLICY.guaranteeWindowHours} hours of the clean if something in the agreed scope was missed, and the team comes back and cleans it at no charge. For recurring commercial accounts we would rather hear about a missed bin than have it quietly noted, because that feedback is what keeps a long-running schedule accurate.`,
    },
    {
      q: "Do you supply your own equipment and products?",
      a: "Yes. The team arrives with the equipment and products the agreed scope needs. Tell us about required products and site protocols at the walkthrough, such as a disinfectant your medical suite specifies or a low-odour option for a shared building. We confirm in writing which requirements we can meet before you book.",
    },
  ];
}

const SPACES = [
  {
    icon: Building2,
    title: "Office and professional space",
    blurb:
      "Desks, keyboards and phones, meeting rooms, kitchens and break areas, glass partitions, washrooms, and hard and soft flooring. Reception is on every visit's list, because it is the room your clients see first.",
    cadence: "Most offices run nightly or 2–3 times a week.",
  },
  {
    icon: Sparkles,
    title: "Janitorial and building maintenance",
    blurb:
      "The recurring routine that keeps a building running: washrooms cleaned and restocked, waste and recycling removed, entryways and stairwells cleaned, high-touch surfaces wiped down, and floor care on a rotating schedule.",
    cadence: "Daily through weekly, depending on foot traffic.",
  },
  {
    icon: ClipboardList,
    title: "Retail and customer-facing space",
    blurb:
      "Sales floors, fitting rooms, counters and point-of-sale areas, entry glass and door handles, and customer washrooms. Timed around opening hours so shelves are stocked and floors are dry before the first customer arrives.",
    cadence: "Typically before opening or after close.",
  },
  {
    icon: Clock,
    title: "Warehouse and industrial",
    blurb:
      "Large-footprint work: floor sweeping and scrubbing, loading bays, racking and shelving dust, staff amenity blocks and site washrooms. Scoped around your operating pattern so cleaning never blocks a shift or a delivery.",
    cadence: "Often weekly or monthly, with periodic deep cleans.",
  },
];

export default function CommercialDepth({ city, phone, phoneLink }: CommercialDepthProps) {
  const faqs = commercialFaqs(city, phone);
  const other = city === "Edmonton" ? "Calgary" : "Edmonton";
  // Canonical form: /calgary/commercial-cleaning 301s to the preserved legacy URL.
  const otherPath =
    city === "Edmonton" ? "/commercial-cleaning-services-calgary/" : "/commercial-cleaning/";

  return (
    <>
      {/* What each type of space actually involves */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">What we clean</p>
            <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-4 text-foreground">
              Commercial cleaning scope in {city}
            </h2>
            <p className="text-muted-foreground max-w-[65ch] mb-10 leading-relaxed">
              Every contract is scoped to the premises, but these are the areas we are normally asked
              to cover. If something on your site is not listed — a server room, a plant floor, a
              shared strata lobby — it can still be included; it just needs to be in the walkthrough
              so the quote reflects it. Office cleaning can be requested with the quote form; other
              premises are scoped by phone and at a walkthrough with the {city} office, on{" "}
              <a href={phoneLink} className="font-semibold text-primary underline underline-offset-4">
                {phone}
              </a>
              .
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {SPACES.map(({ icon: Icon, title, blurb, cadence }) => (
                <div key={title} className="border-t border-border pt-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-secondary text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="text-lg font-bold text-foreground">{title}</h3>
                  </div>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{blurb}</p>
                  <p className="mt-2 text-sm font-semibold text-accent">{cadence}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How quoting works — the question the query data says people are asking */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Pricing</p>
            <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-4 text-foreground">
              How commercial pricing works
            </h2>
            <p className="text-muted-foreground max-w-[65ch] leading-relaxed">
              Residential cleans are priced flat by home size. Commercial work is priced per square
              foot of the area actually cleaned — but the rate comes from a walkthrough, not from a
              floor plan, because any company that quotes a building sight-unseen is guessing. Two
              premises with identical floor area can differ by hours once you account for washroom
              count, floor type, foot traffic and how much of the space is cleaned each visit.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                { n: "01", t: "Walkthrough", d: `We visit the premises in ${city} with you and agree which areas, rooms and surfaces are in scope, and how often.` },
                { n: "02", t: "Written quote", d: "The written quote states the areas, the visit frequency and the pricing basis, per square foot, before work is booked." },
                { n: "03", t: "Schedule and review", d: "We start on the agreed cadence, then check in after the first few visits and adjust the scope or timing if reality differs from the plan." },
              ].map(({ n, t, d }) => (
                <div key={n} className="bg-card border border-border p-6">
                  <span className="text-sm font-bold tracking-[0.16em] text-accent">{n}</span>
                  <h3 className="mt-2 font-bold text-foreground">{t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <a href={phoneLink}>
                <span className="inline-flex min-h-[52px] items-center rounded-sm bg-accent px-7 font-bold text-accent-foreground hover:bg-accent/90">
                  Arrange a walkthrough — {phone}
                </span>
              </a>
              <p className="text-sm text-muted-foreground">
                Also serving businesses in{" "}
                <Link to={otherPath} className="font-semibold text-primary underline underline-offset-4">
                  {other}
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — answers rendered in the DOM so the FAQPage markup matches the page */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Questions</p>
            <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-8 text-foreground">
              Commercial cleaning questions, answered
            </h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <div key={f.q} className="border border-border rounded-xl bg-card p-5">
                  <h3 className="font-bold text-foreground">{f.q}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-muted-foreground">
              Looking for home cleaning instead?{" "}
              <Link
                to={city === "Edmonton" ? "/pricing/" : "/calgary/pricing/"}
                className="font-semibold text-primary underline underline-offset-4"
              >
                See residential pricing for {city}
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
