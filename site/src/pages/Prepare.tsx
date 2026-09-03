import { POLICY } from "@/data/policy";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

/**
 * A calm, practical guide for the visitor between "I'm interested" and
 * "I've booked". Everything it asks for is something the funnel already
 * collects — this page just explains why, in plain language.
 */

const faqs = [
  {
    question: "Do I need to clean before the cleaners arrive?",
    answer:
      "No — please don't. The goal is access and clarity, not an immaculate home. If you want to help, clear the surfaces you'd like us to focus on and note anything we should skip. Describe the home as it is; no apology is needed.",
  },
  {
    question: "Should I book a standard clean or a deep clean?",
    answer:
      "If the home has been maintained recently, a standard clean keeps it there. If there's buildup, it's been a while since the last proper clean, or there's renovation dust, choose deep — it adds the time and detail work a standard visit doesn't include.",
  },
  {
    question: "What should I tell you about a move-out clean?",
    answer:
      "Share your move date, whether the home will be empty when we arrive, which rooms and appliances matter most, and how we get in. An empty home cleans faster and more thoroughly, so tell us if furniture will still be there.",
  },
  {
    question: "What details actually help the cleaner?",
    answer:
      "Pets and where they'll be, where to park, how to enter, and any rooms to skip. Our booking funnel asks each of these, so nothing has to be remembered on the day.",
  },
];

export default function Prepare() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };


  return (
    <>
      <Helmet>
        <title>Getting Ready for Your Clean | Duty Cleaners</title>
        <meta
          name="description"
          content="What actually helps before a house cleaning — and what you can skip. Standard or deep, move-day details, and the notes your cleaner needs."
        />
        <link rel="canonical" href="https://dutycleaners.ca/prepare/" />
        <meta property="og:title" content="Getting Ready for Your Clean | Duty Cleaners" />
        <meta
          property="og:description"
          content="What actually helps before a house cleaning — and what you can skip."
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://dutycleaners.ca/prepare/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Getting Ready for Your Clean | Duty Cleaners" />
        <meta name="twitter:description" content="What actually helps before a house cleaning — and what you can skip." />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>

        <main id="main-content" tabIndex={-1}>
        <section className="bg-brand-navy py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-on-dark">
                01 · Before your visit
              </span>
              <h1 className="display-serif display-1 mt-3 text-brand-navy-foreground">
                Getting ready for your{" "}
                <em className="italic text-accent-on-dark">clean.</em>
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-brand-navy-foreground/85">
                Short version: you don&rsquo;t have to do much. Here&rsquo;s what genuinely helps,
                what you can ignore, and how to pick the right type of clean.
              </p>
            </div>
          </div>
        </section>

          <section className="bg-background py-14 md:py-20">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-3xl">
                <h2 className="display-serif display-2 text-foreground">
                  You don&rsquo;t need to pre-clean
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                  A surprising number of people tidy for hours before a cleaner arrives, then feel
                  they wasted the visit. You don&rsquo;t need to. What we need is access and
                  clarity: a path to the rooms that matter and a clear sense of what you want done
                  first. That&rsquo;s it.
                </p>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  If you want to help, move what you don&rsquo;t want touched — paperwork, medication,
                  small valuables, a work desk mid-project. Clearing a kitchen counter or a bathroom
                  vanity gives our cleaner more surface to actually clean, which is the one kind of
                  tidying that pays you back in results.
                </p>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  And if the home has gotten away from you, say so plainly.{" "}
                  <Link
                    to="/#judgment-free"
                    className="font-semibold text-foreground underline underline-offset-4"
                  >
                    We&rsquo;ve seen it all and judged none of it
                  </Link>
                  . Describe the home as it is — clear information helps, and no apology is needed.
                </p>
              </div>
            </div>
          </section>

          <section className="border-y border-border bg-cream-50 py-14 md:py-20">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-3xl">
                <span className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                  02 · Choosing your clean
                </span>
                <h2 className="display-serif display-2 mt-3 text-foreground">
                  Standard or deep?
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                  This is the question people get wrong most often, and the honest answer depends on
                  one thing: when the home was last properly cleaned.
                </p>
                <div className="mt-7 grid gap-5 md:grid-cols-2">
                  <div className="border-l-[3px] border-accent bg-card p-6 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                      Choose standard
                    </span>
                    <p className="mt-3 text-base leading-relaxed text-foreground">
                      The home has been maintained — cleaned within the last month or so, no real
                      buildup. A standard visit keeps it where it is: kitchen, bathrooms, floors,
                      surfaces, and the rooms you use every day.
                    </p>
                  </div>
                  <div className="border-l-[3px] border-accent bg-card p-6 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                      Choose deep
                    </span>
                    <p className="mt-3 text-base leading-relaxed text-foreground">
                      There&rsquo;s buildup, it&rsquo;s the first proper clean in a while, or
                      there&rsquo;s post-renovation dust. Deep adds baseboards, doors, switches,
                      vent covers and the detail work a standard visit doesn&rsquo;t have time for.
                    </p>
                  </div>
                </div>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                  Not sure? Our booking funnel asks when the home was last properly cleaned and
                  recommends from your answer — and it shows you both prices before you commit to
                  anything.
                </p>
                <Button
                  size="lg"
                  className="mt-7 h-14 bg-accent px-8 text-base font-bold text-accent-foreground hover:bg-accent/90"
                  asChild
                >
                  <Link to="/#quote">
                    See my price
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          <section className="bg-background py-14 md:py-20">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-3xl">
                <span className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                  03 · Moving
                </span>
                <h2 className="display-serif display-2 mt-3 text-foreground">Move-day checklist</h2>
                <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                  Move-out cleans are timed work with a deadline attached, usually a landlord
                  inspection or a new owner walking through. Four details make the difference:
                </p>
                <ul className="mt-6 space-y-4">
                  {[
                    "Your move date — and the latest time the clean can finish.",
                    "Whether the home will be empty. An empty home cleans faster and far more thoroughly; if furniture is staying, tell us what it is.",
                    "Priority rooms and appliances — inside the oven, inside the fridge, cabinet interiors, the garage.",
                    "Access: keys, lockbox, buzzer code, elevator booking, parking.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2
                        className="mt-1 h-5 w-5 flex-shrink-0 text-accent"
                        aria-hidden="true"
                      />
                      <span className="text-lg leading-relaxed text-foreground/85">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                  Put anything unusual in the notes field at the end of the booking flow. It goes
                  straight to the cleaner assigned to your job.
                </p>
              </div>
            </div>
          </section>

          <section className="border-y border-border bg-blue-grey-100 py-14 md:py-20">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-3xl">
                <span className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                  04 · The small stuff
                </span>
                <h2 className="display-serif display-2 mt-3 text-foreground">
                  The details that help
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                  None of this is a test. These are simply the four things that, when missing, cost
                  time on the day:
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    ["Pets", "Friendly, shy, or best kept in another room — just say which."],
                    ["Parking", "Street, driveway, visitor stall, or a permit we should know about."],
                    ["Entry", "Who's home, or how we get in if nobody is."],
                    ["Rooms to skip", "A home office mid-deadline, a nursery at nap time, a storage room."],
                  ].map(([label, detail]) => (
                    <div key={label} className="border-l-[3px] border-accent bg-card p-5">
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                        {label}
                      </span>
                      <p className="mt-2 text-base leading-relaxed text-foreground/85">{detail}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                  Every one of these is asked right in our booking funnel, so nothing gets
                  forgotten and nobody has to remember it on the doorstep.
                </p>
                {/* This page asks about access four separate times and never said what
                    happens when it fails — the most expensive thing preparation can get
                    wrong, and the one thing on this page that costs money. */}
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  Worth knowing: if the team arrives and cannot get in, the visit is charged at{" "}
                  {POLICY.lockoutFee}. A lockbox code or a buzzer code you have tested is all it
                  takes to avoid it.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-background py-14 md:py-20">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-3xl">
                <h2 className="display-serif display-2 text-foreground">Common questions</h2>
                <dl className="mt-8 space-y-7">
                  {faqs.map((faq) => (
                    <div key={faq.question}>
                      <dt className="text-lg font-bold text-foreground">{faq.question}</dt>
                      <dd className="mt-2 text-lg leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </dd>
                    </div>
                  ))}
                </dl>
                <Button
                  size="lg"
                  className="mt-9 h-14 bg-accent px-8 text-base font-bold text-accent-foreground hover:bg-accent/90"
                  asChild
                >
                  <Link to="/#quote">
                    See my price
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
