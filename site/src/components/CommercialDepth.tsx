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
 * (hourly quoting for commercial, operating hours, vetting, the 24-hour
 * make-it-right window). No pricing figures, certifications or client names are
 * invented — where a number would need owner confirmation, the copy describes
 * the process instead of asserting a value.
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
      a: `Commercial work is quoted per hour rather than at a flat rate, because two premises of the same square footage rarely take the same time — a call centre and a dental clinic have very different requirements. We walk the space (or review a floor plan), agree the scope and frequency, and give you an hourly rate and an expected visit length in writing before anything is booked. Call ${phone} to arrange the walkthrough.`,
    },
    {
      q: "Can you clean outside our business hours?",
      a: "Yes — most commercial contracts run before opening or after close so cleaning never interrupts staff or customers. Our standard operating window is Monday to Saturday 8 AM–8 PM and Sunday 9 AM–3 PM; work outside that window can be arranged as part of a scheduled contract.",
    },
    {
      q: "Do we need to sign a long-term contract?",
      a: "No. Recurring schedules are the most common arrangement because they keep the same cleaners on your site, but there is no lock-in period and no cancellation penalty. If you would rather start with a single deep clean before committing to a schedule, that is a normal way to begin.",
    },
    {
      q: "Are your cleaners vetted and insured?",
      a: "Every cleaner is reference-checked before their first job and rated by the customer after every visit — those ratings decide who keeps working for us. Duty Cleaners has been licensed and operating in Alberta since 2017. For contracts that require specific insurance certificates or security clearances, ask when you book and we will confirm what we can provide in writing.",
    },
    {
      q: "Will the same team clean our premises each visit?",
      a: "That is the goal on any recurring schedule, and it is the main practical reason to move from ad-hoc to scheduled cleaning. A consistent team learns your alarm codes, access routine and the areas that matter most to you, which makes every subsequent visit faster and more thorough.",
    },
    {
      q: "What happens if something is missed?",
      a: "Tell us within 24 hours and we return to put it right at no additional charge. For recurring commercial accounts we would rather hear about a missed bin than have it quietly noted — the feedback is what keeps a long-running schedule accurate.",
    },
    {
      q: "Do you supply your own equipment and products?",
      a: "Yes. Our teams arrive with everything needed for the agreed scope. If your site requires specific products — a particular disinfectant for a medical suite, or a low-odour option for a shared building — tell us during the walkthrough and we will work to it.",
    },
  ];
}

const SPACES = [
  {
    icon: Building2,
    title: "Office and professional space",
    blurb:
      "Desks, keyboards and phones, meeting rooms, kitchens and break areas, glass partitions, washrooms, and all hard and soft flooring. Reception gets particular attention — it is the room your clients form an impression in.",
    cadence: "Most offices run nightly or 2–3 times a week.",
  },
  {
    icon: Sparkles,
    title: "Janitorial and building maintenance",
    blurb:
      "The recurring routine that keeps a building running: washroom sanitation and restocking, waste and recycling removal, entryway and stairwell care, high-touch point disinfection, and floor maintenance on a rotating schedule.",
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
  const otherPath = city === "Edmonton" ? "/calgary/commercial-cleaning/" : "/commercial-cleaning/";

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
              so the quote reflects it.
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
              Residential cleans are priced flat by home size. Commercial work is not, and any company
              that quotes a building sight-unseen is guessing. Two premises with identical floor area
              can differ by hours once you account for washroom count, floor type, foot traffic and how
              much of the space is actually cleaned each visit.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                { n: "01", t: "Walkthrough", d: `We visit the premises in ${city} — or review a floor plan for a straightforward space — and agree exactly what is in scope.` },
                { n: "02", t: "Written quote", d: "You get an hourly rate and the expected visit length before anything is booked. No deposit, and nothing is charged to hold a slot." },
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
                to={city === "Edmonton" ? "/" : "/cleaning-services-calgary/"}
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
