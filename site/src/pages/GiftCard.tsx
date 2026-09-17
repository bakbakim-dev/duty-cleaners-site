import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Gift, Mail, Wallet, Phone } from "lucide-react";
import { standardTierRows, deepCleanTierRows, moveInOutTierRows } from "@/data/pricing";
import { POLICY } from "@/data/policy";
import { CITY_PROOF, RATING_CLAIM } from "@/data/proof";
import { Link } from "react-router-dom";
import { canonicalForPath } from "@/data/legacy-urls";

const GIFT_CARD_ORIGIN = "https://dutycleaners.bookingkoala.com";
const GIFT_CARD_URL = `${GIFT_CARD_ORIGIN}/gift-cards/send`;
const GIFT_CARD_EMBED_URL = `${GIFT_CARD_URL}?embed=true`;
const EMBED_SCRIPT_ID = "bk-embed-script";

/** Tall enough that BookingKoala's form never grows its own inner scrollbar. */
const EMBED_MIN_HEIGHT = 1500;

const points = [
  { icon: Gift, text: "Any amount you choose" },
  { icon: Mail, text: "Delivered by email, so there is no card to lose" },
  { icon: Wallet, text: "The balance is tracked and carries across visits" },
];

const steps = [
  { title: "Choose an amount", text: "Any value you like. There is no minimum or maximum." },
  { title: "Add your message", text: "Their name, a short note, and who it's from." },
  { title: "We email it", text: "It goes out straight away, or on a date you pick." },
  { title: "They book whenever", text: "The card does not expire, and the balance is tracked for them." },
];

// Prices are derived from the booking config, never hand-typed.
const standard = standardTierRows();
const deep = deepCleanTierRows();
const move = moveInOutTierRows();
const suggestions = [
  { amount: standard[0]?.price ?? "", label: "A standard clean of a 1-bedroom, 1-bathroom apartment or condo" },
  { amount: standard[1]?.price ?? "", label: "A standard clean of a 2-bedroom, 2-bathroom apartment or condo" },
  { amount: deep[1]?.price ?? "", label: "A deep clean of a 2-bedroom, 2-bathroom apartment or condo" },
];

/**
 * The "good to know" list, as questions. Expiry and maximum-value rules are
 * read from policy.ts, not restated here: the legacy site published a
 * six-month expiry and a $2,000 ceiling, and both were wrong. Feeds both the
 * visible list and the FAQPage JSON-LD.
 */
const FAQS = [
  {
    // The hero says "any clean", and this list is the page's own answer to what
    // that means, so the two have to name the same set. It used to stop at wall
    // washing and leave out the hourly short-term-rental turnovers the site
    // sells on its two Airbnb pages.
    q: "Where can the gift card be used?",
    a: "On any of our home cleaning services in Edmonton or Calgary: standard, deep, move-in or move-out, post-construction, wall washing, and Airbnb and short-term rental turnovers, which are billed by the hour rather than by home size. The recipient picks the service and the date.",
  },
  {
    q: "Does the gift card expire?",
    a:
      POLICY.giftCardExpiryMonths === "none"
        ? "No. The balance stays on the card until it is used, however long that takes."
        : `Yes, ${POLICY.giftCardExpiryMonths} months after purchase.`,
  },
  {
    q: "What if the clean costs more, or less, than the card?",
    a: `If the clean costs more, they pay the difference at checkout. If it costs less, the remaining balance stays on the card for the next visit. A ${standard[0]?.price ?? ""} card matches a standard clean of a 1-bedroom, 1-bathroom apartment or condo, and a ${move[move.length - 1]?.price ?? ""} card matches a move-out clean of a 5-bedroom apartment or condo. Both prices are before 5% GST, and the pet charge, a home-type surcharge or a travel fee outside city limits is added on top.`,
  },
  {
    q: "Is there a minimum or maximum amount?",
    a:
      POLICY.giftCardMaxValue === "none"
        ? "No minimum and no maximum. Round numbers are fine, and so are odd ones sized to a specific clean."
        : `No minimum. The maximum is ${POLICY.giftCardMaxValue}.`,
  },
  {
    q: "Is a clean paid for with a gift card covered by the guarantee?",
    a: `Yes, the same way as any other clean. If something was missed, the recipient tells us within ${POLICY.guaranteeWindowHours} hours and we come back and re-clean it at no additional charge.`,
  },
  {
    q: "What if the card is lost?",
    a: "The balance is tracked against the purchase, so call either office with the purchaser's name and we reissue it.",
  },
];

const TITLE = "House Cleaning Gift Cards Edmonton & Calgary | Duty Cleaners";
const DESCRIPTION =
  "Buy a house cleaning gift card for Edmonton or Calgary in any amount, with no expiry, emailed right away or on a date you pick.";

export default function GiftCard() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // BookingKoala's embed.js is the parent-side resizer — it grows the frame to fit.
    if (document.getElementById(EMBED_SCRIPT_ID)) return;
    const script = document.createElement("script");
    script.id = EMBED_SCRIPT_ID;
    script.src = `${GIFT_CARD_ORIGIN}/resources/embed.js`;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href="https://dutycleaners.ca/gift-card/" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/gift-card/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        {/* Mirrors the "Gift card questions" list below. */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          })}
        </script>
      </Helmet>

      <div className="min-h-screen">
        <Navigation />
        <main id="main-content" tabIndex={-1}>
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>

        {/* Hero */}
        <section className="bg-brand-navy py-14 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-5 text-3xl font-bold text-white md:text-5xl">House Cleaning Gift Cards for Edmonton and Calgary</h1>
              <p className="text-lg leading-relaxed text-white/85 md:text-xl">
                Choose any amount, add a message, and the card arrives by email, right away or on a
                date you pick. The recipient can use it on any clean from the Edmonton or Calgary
                office, and both are rated {RATING_CLAIM}.
              </p>

              <ul className="mt-8 grid gap-3 sm:grid-cols-3">
                {points.map((point) => (
                  <li
                    key={point.text}
                    className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-left text-base font-medium text-white/90"
                  >
                    <point.icon className="h-5 w-5 shrink-0 text-brand-gold" aria-hidden="true" />
                    {point.text}
                  </li>
                ))}
              </ul>

              <div className="mt-9">
                <Button
                  size="lg"
                  className="min-h-[48px] bg-accent px-8 text-base font-semibold text-accent-foreground hover:bg-accent/90"
                  asChild
                >
                  <a href="#buy">Jump to the gift card form</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-background py-14 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">How it works</h2>
              <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {steps.map((step, index) => (
                  <li key={step.title} className="rounded-2xl border border-border/60 bg-card p-6">
                    <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy text-base font-bold text-white">
                      {index + 1}
                    </span>
                    <h3 className="mb-1 text-lg font-semibold">{step.title}</h3>
                    <p className="text-base leading-relaxed text-muted-foreground">{step.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Amount guidance */}
        <section className="bg-muted/40 py-14 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-3 text-center text-2xl font-bold md:text-3xl">Gift card amounts that cover a whole clean</h2>
              <p className="mx-auto mb-8 max-w-2xl text-center text-base leading-relaxed text-muted-foreground">
                Any amount works, because the balance is applied to whatever they book. If you would
                rather cover a whole visit, these are the one-visit prices for an apartment or condo,
                before 5% GST. A larger home type, a pet charge or a travel fee outside Edmonton or
                Calgary city limits adds to the total.
              </p>
              <ul className="grid gap-5 sm:grid-cols-3">
                {suggestions.map((item) => (
                  <li
                    key={item.label}
                    className="rounded-2xl border border-border/60 bg-card p-6 text-center"
                  >
                    <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      From
                    </p>
                    <p className="my-2 text-3xl font-bold text-brand-navy">{item.amount}</p>
                    <p className="text-base leading-relaxed text-muted-foreground">{item.label}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-center text-base text-muted-foreground">
                The full tables by home size are on{" "}
                <Link to={canonicalForPath("/pricing")} className="text-accent underline underline-offset-2">
                  the full Edmonton price list
                </Link>{" "}
                and{" "}
                <Link to={canonicalForPath("/calgary/pricing")} className="text-accent underline underline-offset-2">
                  Calgary house cleaning prices by home size
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* The form */}
        <section id="buy" className="scroll-mt-24 bg-background py-14 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-2 text-center text-2xl font-bold md:text-3xl">Buy your gift card</h2>
              <p className="mb-8 text-center text-base leading-relaxed text-muted-foreground">
                It takes about two minutes. You enter the amount, the recipient's details and your
                payment on the secure form below.
              </p>

              {/* data-embed-* marks the parts of this third-party embed that change
                  when its iframe loads. scripts/prerender.mjs settles them to the
                  loaded state in the snapshot: the load event comes from
                  BookingKoala's server, so the frozen HTML used to be a race —
                  loaded on one build, "Loading…" with the form hidden on the next.
                  The prerender matches these markers, not the wording, so reword
                  the placeholder freely; do not remove the markers. */}
              <div className="rounded-2xl border border-border/60 bg-card" aria-busy={!loaded} data-embed-shell>
                {!loaded && (
                  <p className="flex min-h-[400px] items-center justify-center px-6 text-center text-lg font-semibold text-foreground" data-embed-placeholder>
                    Loading the gift card form…
                  </p>
                )}
                <iframe
                  data-embed-frame
                  src={GIFT_CARD_EMBED_URL}
                  title="Buy a Duty Cleaners gift card — secure BookingKoala form"
                  width="100%"
                  loading="eager"
                  scrolling="no"
                  allow="payment"
                  referrerPolicy="strict-origin-when-cross-origin"
                  onLoad={() => setLoaded(true)}
                  style={{
                    display: loaded ? "block" : "none",
                    border: "none",
                    width: "100%",
                    minHeight: EMBED_MIN_HEIGHT,
                  }}
                />
              </div>

              <p className="mt-6 text-center text-base text-muted-foreground">
                Having trouble?{" "}
                <a
                  href={GIFT_CARD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] items-center font-semibold text-brand-navy underline underline-offset-4"
                >
                  Open the gift card page directly
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Phone alternative */}
        <section className="bg-brand-navy py-12 md:py-14">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
                Order by phone instead
              </h2>
              <p className="mb-7 text-lg leading-relaxed text-white/85">
                Call either office and we set the gift card up for you. Monday to Saturday 8:00 AM
                to 8:00 PM, Sunday 9:00 AM to 3:00 PM.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="min-h-[48px] w-full bg-accent px-8 text-base font-semibold text-accent-foreground hover:bg-accent/90 sm:w-auto"
                  asChild
                >
                  <a href={CITY_PROOF.edmonton.phoneLink}>
                    <span className="dc-icon dc-icon-phone mr-2 h-5 w-5" aria-hidden="true" />
                    Edmonton: {CITY_PROOF.edmonton.phone}
                  </a>
                </Button>
                <Button
                  size="lg"
                  className="min-h-[48px] w-full bg-accent px-8 text-base font-semibold text-accent-foreground hover:bg-accent/90 sm:w-auto"
                  asChild
                >
                  <a href={CITY_PROOF.calgary.phoneLink}>
                    <span className="dc-icon dc-icon-phone mr-2 h-5 w-5" aria-hidden="true" />
                    Calgary: {CITY_PROOF.calgary.phone}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Giving it well, and how much */}
        <section className="bg-background py-14 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              {/*
                309 words of main content, on a page asking someone to spend
                money on behalf of a person who is not in the room. The gaps
                below are the questions that actually stop that purchase, and
                the page answered none of them.
              */}
              <div className="space-y-5 text-muted-foreground leading-relaxed">
                <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                  Giving a cleaning as a gift, without it landing wrong
                </h2>
                <p>
                  The awkwardness is worth naming: a cleaning gift can read as a comment
                  on the state of someone's home. An obvious occasion gives the gift its reason:
                  a new baby, a house move, a stretch of illness or recovery, a parent who has
                  stopped managing stairs comfortably, or the week either side of hosting a large
                  family gathering.
                </p>
                <p>
                  Two practical points catch people out. The recipient has to be able to let
                  a cleaner in, so a gift for someone who travels constantly or works unpredictable
                  shifts may sit unused for months. That is survivable here, because the card does
                  not expire, but it is worth knowing. And they choose their own date and service;
                  you are giving a balance, not booking an appointment on their behalf. If you want
                  a specific day covered, book it yourself and pay for it directly instead.
                </p>
                <h2 className="text-2xl font-bold text-foreground md:text-3xl">How much to put on it</h2>
                <p>
                  A card does not have to cover a whole clean to be useful. The balance comes off
                  whatever they book, and they pay the difference. If you would rather it cover a
                  full service outright, the tables on our{" "}
                  <Link to={canonicalForPath("/pricing")} className="text-accent underline underline-offset-2">
                    Edmonton
                  </Link>{" "}
                  and{" "}
                  <Link to={canonicalForPath("/calgary/pricing")} className="text-accent underline underline-offset-2">
                    Calgary
                  </Link>{" "}
                  pricing pages give the exact figure by home size, and{" "}
                  <Link to={canonicalForPath("/whats-included")} className="text-accent underline underline-offset-2">
                    what's included
                  </Link>{" "}
                  shows what each service covers. All published prices are before 5% GST, so a card
                  sized to the sticker price will fall a little short of the final total, and so will
                  one that leaves out the pet charge, a home-type surcharge or a travel fee outside
                  city limits.
                </p>
                <p>
                  If you are not sure which service they would pick,{" "}
                  <Link to="/services/" className="text-accent underline underline-offset-2">
                    all Edmonton cleaning services and prices
                  </Link>{" "}
                  and{" "}
                  <Link to="/calgary/services/" className="text-accent underline underline-offset-2">
                    every Calgary cleaning service, with starting prices
                  </Link>{" "}
                  are one page each, and you can{" "}
                  <Link to="/reviews/" className="text-accent underline underline-offset-2">
                    read the reviews
                  </Link>{" "}
                  before you buy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Good to know, as questions */}
        <section className="bg-muted/40 py-14 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              {/* "Gift certificate" was the only place on 209 pages where the
                  product went by that name; nothing in the repository targets it
                  as a query, and every answer under the heading says "gift
                  card". One name. */}
              <h2 className="mb-6 text-center text-2xl font-bold md:text-3xl">Gift card questions</h2>
              <ul className="space-y-5">
                {FAQS.map((faq) => (
                  <li key={faq.q} className="flex items-start gap-3 text-base leading-relaxed">
                    <span className="dc-icon dc-icon-check mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                    <span>
                      <strong className="text-foreground">{faq.q}</strong>{" "}
                      <span className="text-muted-foreground">{faq.a}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-center text-base text-muted-foreground">
                Anything else,{" "}
                <Link to="/contact-us/?topic=gift-card" className="text-accent underline underline-offset-2">
                  ask either office
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
