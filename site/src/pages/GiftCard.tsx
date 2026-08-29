import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Gift, Mail, Wallet, Phone, Check } from "lucide-react";
import { standardTierRows, deepCleanTierRows } from "@/data/pricing";
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
  { icon: Mail, text: "Delivered by email — no card to lose" },
  { icon: Wallet, text: "Balance tracked automatically, use it across visits" },
];

const steps = [
  { title: "Choose an amount", text: "Any value you like — there is no minimum or maximum." },
  { title: "Add your message", text: "Their name, a short note, and who it's from." },
  { title: "We email it", text: "Straight away, or on a date you pick." },
  { title: "They book whenever", text: "No expiry pressure — the balance is tracked for them." },
];

const goodToKnow = [
  "Use it on any of our cleaning services in Edmonton or Calgary.",
  "No expiry date — the balance stays on the card until it is used.",
  "If the balance doesn't cover the whole visit, they simply pay the difference.",
  "Backed by our satisfaction guarantee: tell us within 24 hours after the clean and we re-clean at no additional charge.",
];

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

  // Prices are derived from the booking config, never hand-typed.
  const standard = standardTierRows();
  const deep = deepCleanTierRows();
  const suggestions = [
    { amount: standard[0]?.price ?? "", label: "A standard clean for a 1-bedroom home" },
    { amount: standard[1]?.price ?? "", label: "A standard clean for a 2-bedroom home" },
    { amount: deep[1]?.price ?? "", label: "A deep clean for a 2-bedroom home" },
  ];


  return (
    <>
      <Helmet>
        <title>Duty Cleaners Gift Cards | Give a Clean Home in Alberta</title>
        <meta
          name="description"
          content="Buy a Duty Cleaners gift card online. Choose any amount, add a message, and it arrives by email right away or on a date you pick. Edmonton & Calgary."
        />
        <link rel="canonical" href="https://dutycleaners.ca/gift-card/" />
        <meta property="og:title" content="Duty Cleaners Gift Cards | Give a Clean Home in Alberta" />
        <meta
          property="og:description"
          content="Give someone their weekend back. Any amount, delivered by email, redeemable across visits."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/gift-card/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Duty Cleaners Gift Cards | Give a Clean Home in Alberta" />
        <meta name="twitter:description" content="Give someone their weekend back. Any amount, delivered by email, redeemable across visits." />
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
              <h1 className="mb-5 text-3xl font-bold text-white md:text-5xl">Duty Cleaners Gift Cards</h1>
              <p className="text-lg leading-relaxed text-white/85 md:text-xl">
                Give someone their weekend back. Choose any amount, add a message, and it arrives by
                email — right away or on a date you pick.
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
              <h2 className="mb-3 text-center text-2xl font-bold md:text-3xl">How much should I give?</h2>
              <p className="mx-auto mb-8 max-w-2xl text-center text-base leading-relaxed text-muted-foreground">
                Anything you like works — the balance is applied to whatever they book. These are the
                usual starting points if you'd rather cover a whole visit.
              </p>
              <ul className="grid gap-5 sm:grid-cols-3">
                {suggestions.map((item) => (
                  <li
                    key={item.label}
                    className="rounded-2xl border border-border/60 bg-card p-6 text-center"
                  >
                    <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Starts around
                    </p>
                    <p className="my-2 text-3xl font-bold text-brand-navy">{item.amount}</p>
                    <p className="text-base leading-relaxed text-muted-foreground">{item.label}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-center text-base text-muted-foreground">
                Prefer a round number? Any amount you choose is welcome.
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
                It takes about two minutes. You'll enter the amount, the recipient's details and your
                payment on the secure form below.
              </p>

              <div className="rounded-2xl border border-border/60 bg-card" aria-busy={!loaded}>
                {!loaded && (
                  <p className="flex min-h-[400px] items-center justify-center px-6 text-center text-lg font-semibold text-foreground">
                    Loading the gift card form…
                  </p>
                )}
                <iframe
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
                Prefer not to do this online?
              </h2>
              <p className="mb-7 text-lg leading-relaxed text-white/85">
                Call us and we'll set the gift card up for you over the phone. Mon–Sat 8AM–8PM,
                Sun 9AM–3PM.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="min-h-[48px] w-full bg-accent px-8 text-base font-semibold text-accent-foreground hover:bg-accent/90 sm:w-auto"
                  asChild
                >
                  <a href="tel:7809136565">
                    <Phone className="mr-2 h-5 w-5" aria-hidden="true" />
                    Edmonton: (780) 913-6565
                  </a>
                </Button>
                <Button
                  size="lg"
                  className="min-h-[48px] w-full bg-accent px-8 text-base font-semibold text-accent-foreground hover:bg-accent/90 sm:w-auto"
                  asChild
                >
                  <a href="tel:4037681341">
                    <Phone className="mr-2 h-5 w-5" aria-hidden="true" />
                    Calgary: (403) 768-1341
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Good to know */}
        <section className="bg-background py-14 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-6 text-center text-2xl font-bold md:text-3xl">Good to know</h2>
              <ul className="space-y-4">
                {goodToKnow.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-base leading-relaxed">
                    <Check className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/*
                309 words of main content, on a page asking someone to spend
                money on behalf of a person who is not in the room. The gaps
                below are the questions that actually stop that purchase, and
                the page answered none of them. Expiry and maximum-value rules
                are read from policy.ts, not restated here — the legacy site
                published a six-month expiry and a $2,000 ceiling, and both were
                wrong.
              */}
              <div className="mt-12 space-y-5 text-muted-foreground leading-relaxed">
                <h3 className="text-xl font-bold text-foreground">
                  Giving a cleaning as a gift, without it landing wrong
                </h3>
                <p>
                  The awkwardness is real and worth naming: a cleaning gift can read as a comment
                  on the state of someone's home. It almost never does when there is an obvious
                  occasion attached to it — a new baby, a house move, a stretch of illness or
                  recovery, a parent who has stopped managing stairs comfortably, or the week
                  either side of hosting a large family gathering. Those are the times people are
                  most relieved to be handed this and least likely to read anything into it.
                </p>
                <p>
                  Two practical points that catch people out. The recipient has to be able to let
                  a cleaner in, so a gift for someone who travels constantly or works unpredictable
                  shifts may sit unused for months — which is survivable here, because the card
                  does not expire, but it is worth knowing. And they choose their own date and
                  service; you are giving a balance, not booking an appointment on their behalf.
                  If you want a specific day covered, book it yourself and pay for it directly
                  instead.
                </p>
                <h3 className="text-xl font-bold text-foreground">How much to put on it</h3>
                <p>
                  A card does not have to cover a whole clean to be useful — the balance comes off
                  whatever they book, and they pay the difference. If you would rather it cover a
                  full service outright, the tables on our{" "}
                  <Link to={canonicalForPath("/pricing")} className="text-accent hover:underline">
                    Edmonton
                  </Link>{" "}
                  and{" "}
                  <Link to={canonicalForPath("/calgary/pricing")} className="text-accent hover:underline">
                    Calgary
                  </Link>{" "}
                  pricing pages give the exact figure by home size, and{" "}
                  <Link to={canonicalForPath("/whats-included")} className="text-accent hover:underline">
                    what's included
                  </Link>{" "}
                  shows what each service actually covers. All published prices are before 5% GST,
                  so a card sized to the sticker price will fall a little short of the final total.
                </p>
                <p>
                  If a card is lost, we can look it up — the balance is tracked against the
                  purchase, so call either office with the purchaser's name and we can reissue it.
                </p>
              </div>
            </div>
          </div>
        </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
