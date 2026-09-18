import { Helmet } from "react-helmet-async";
import Stars from "@/components/Stars";
import ThresholdLine from "@/components/ThresholdLine";
import Eyebrow from "@/components/Eyebrow";
import { HeartHandshake, ShieldCheck, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { canonicalForPath } from "@/data/legacy-urls";
import { getListing, openGoogleListing } from "@/lib/google-listings";
import { CITY_PROOF } from "@/data/proof";
import { POLICY } from "@/data/policy";
import { standardTierRows } from "@/data/pricing";
import ServiceStartCard from "@/components/quote/ServiceStartCard";
import type { Picture } from "vite-imagetools";

interface ProcessImage {
  src: Picture;
  alt: string;
}

interface CityConversionIntroProps {
  city: "Edmonton" | "Calgary";
  phone: string;
  phoneLink: string;
  /** Full-bleed room photo behind the hero scrim. */
  heroImage: string;
  /**
   * Width-descriptor srcset for the hero, e.g. "…-640w.webp 640w, …".
   *
   * The hero is the LCP element on the two highest-value pages, and without
   * this a phone downloaded the same 1920px file a desktop did — 177 KB on the
   * homepage where the 640w variant is 25 KB. Optional so callers without
   * variants keep working; the preload hint below carries the same set, or a
   * browser would preload the full-width file and then use a narrower one.
   */
  heroSrcSet?: string;
  /**
   * Intrinsic pixel size of the master file behind heroImage. Declared so the
   * browser can reserve the hero box before the first byte arrives; the
   * onpage-seo ratio guard checks it against the file, so read it from the
   * .webp header rather than typing it from memory.
   */
  heroWidth?: number;
  heroHeight?: number;
  /** Decorative background — leave empty unless the room carries meaning. */
  heroAlt?: string;
  /** CSS object-position for the hero crop, e.g. "center 60%". */
  heroPosition?: string;
  /** "strong" carries text over dim rooms; "soft" keeps bright airy rooms
      bright and leans on text shadows for contrast. */
  heroScrim?: "strong" | "soft";
  /** Accepted for compatibility with older callers; unused by the scrim hero. */
  heroImageMobile?: string;
  heroOverlay?: "default" | "light" | "muted";
  /**
   * Accepted for compatibility with older callers; unused. The steps used to
   * carry three 112px kitchen thumbnails for four steps, none of which had
   * anything to do with "Share your contact details".
   */
  processImages?: ProcessImage[];
}

/** The cheapest published standard clean, straight from bk-config. */
const FROM_PRICE = standardTierRows()[0]?.price ?? "";

/*
  The two hubs used to render this strip word for word, and the money-page
  contract caps how much of the Calgary hub may repeat the Edmonton one. Each
  city says the same three things in its own words; the facts are identical
  and every figure is read from policy.ts.
*/
const TRUST_ITEMS = {
  Edmonton: [
    {
      icon: ShieldCheck,
      label: "You pay after the clean",
      detail:
        "Nothing is charged when you book. A temporary hold appears the day before, and your card is only charged once the clean is done.",
    },
    {
      icon: UserCheck,
      label: "Reference-checked and customer-rated",
      detail:
        "Every cleaner is reference-checked before their first job, and rated by the customer after every clean. Those ratings decide who comes back.",
    },
    {
      icon: HeartHandshake,
      label: "Re-clean at no charge",
      detail: `If something was missed, tell us within ${POLICY.guaranteeWindowHours} hours and we come back and re-clean it at no charge.`,
    },
  ],
  Calgary: [
    {
      icon: ShieldCheck,
      label: "You pay after the clean",
      detail:
        "No charge at booking. The day before, a hold goes on your card to check it is valid; the charge itself goes through when the clean is finished.",
    },
    {
      icon: UserCheck,
      label: "Reference-checked and customer-rated",
      detail:
        "References are checked before a cleaner takes a first job with us. After each visit the customer rates the clean, and the ratings decide who we keep sending.",
    },
    {
      icon: HeartHandshake,
      label: `${POLICY.guaranteeWindowHours}-hour re-clean guarantee`,
      detail: `Tell us within ${POLICY.guaranteeWindowHours} hours about anything missed and a team comes back to re-clean it. There is no charge for the return visit.`,
    },
  ],
} as const;

const PROCESS_STEPS = {
  Edmonton: [
    { number: "1", title: "Tell us about your home", description: "Enter the bedrooms, the bathrooms and the type of clean you need." },
    { number: "2", title: "Share your contact details", description: "We use them to send your quote and to check anything unusual." },
    { number: "3", title: "See your price", description: "The form shows the price for your home straight away, with no obligation to book." },
    { number: "4", title: "Confirm your booking", description: "Add your service address after seeing the price, then continue to BookingKoala to check availability and confirm the booking." },
  ],
  Calgary: [
    { number: "1", title: "Describe the home", description: "Give the number of bedrooms and bathrooms, then pick the clean." },
    { number: "2", title: "Leave your contact details", description: "Tell us where to send the quote, and leave a number in case something needs checking." },
    { number: "3", title: "See your price", description: "The figure for your home appears on screen before you commit to anything." },
    { number: "4", title: "Book the date", description: "After the price, add your service address and continue to BookingKoala. Choose an available slot and complete the booking there." },
  ],
} as const;

const HOW_IT_WORKS = {
  Edmonton: {
    heading: "Booking a house clean in Edmonton, step by step.",
    intro: "Price your home first. The rest of the booking simply carries your details forward.",
  },
  Calgary: {
    heading: "Four steps, and the price comes before the commitment.",
    intro: "The form prices the home first, then carries what you typed into the booking.",
  },
} as const;

/**
 * The hero subhead. The money-page contract wants a price in the first 200
 * words of <main> and the rating in the first 300; the breadcrumb and city
 * switch spend some of those words before the headline, so the figure has to
 * sit here rather than in the section below.
 *
 * One sentence pair per city: the from-price, "before GST", the home it
 * prices, and when you pay. The pet charge, the home-type surcharge and the
 * travel fee are stated in the Pricing band and in the cost FAQ further down
 * the same page, so the hero no longer lists them.
 */
const SUBHEAD = {
  // "No tidying first" was the hero half of a claim the service pages take
  // back three screens later, where they ask for clutter to be picked up.
  Edmonton: `Standard cleans start at ${FROM_PRICE} before GST for a one-bedroom, one-bathroom apartment or condo. See the price for your own home first, and pay after the clean.`,
  Calgary: `A standard clean of a one-bedroom, one-bathroom condo or apartment starts at ${FROM_PRICE} before GST. Your own figure comes before you pick a date, and you pay after the clean.`,
} as const;

export default function CityConversionIntro({
  city,
  phone,
  phoneLink,
  heroImage,
  heroSrcSet,
  heroWidth,
  heroHeight,
  heroAlt,
  heroPosition,
  heroScrim = "strong",
}: CityConversionIntroProps) {
  const soft = heroScrim === "soft";
  const listing = getListing(city);
  const trustItems = TRUST_ITEMS[city];
  const processSteps = PROCESS_STEPS[city];
  const howItWorks = HOW_IT_WORKS[city];
  const proof = city === "Calgary" ? CITY_PROOF.calgary : CITY_PROOF.edmonton;
  const ratingLine =
    proof.googleRating && proof.googleReviewCount
      ? `${proof.googleRating} on Google · ${proof.googleReviewCount} ${city} reviews`
      : proof.googleRating
        ? `${proof.googleRating} on Google in ${city}: read the reviews`
        : `4.9 on Google in ${city}: read the reviews`;

  return (
    <>
      {/* Full-bleed room photo, words carried on an ink scrim that fades out
          before the quote card. The photo sells the calm "after"; the scrim
          keeps the headline at full contrast without dimming the whole frame. */}
      <section className="relative isolate overflow-hidden bg-brand-navy text-brand-navy-foreground">
        {/* The hero photo is the LCP element. Preloading it per-route (rather
            than a static hint in index.html) keeps Edmonton and Calgary each
            preloading their own image instead of the wrong one. */}
        <Helmet>
          <link
            rel="preload"
            as="image"
            href={heroImage}
            // The <img> below carries fetchpriority=high; the preload must too,
            // or the hint itself is fetched at Low behind the module preloads.
            {...({ fetchpriority: "high" } as Record<string, string>)}
            {...(heroSrcSet ? { imagesrcset: heroSrcSet, imagesizes: "100vw" } : {})}
          />
        </Helmet>
        <img
          src={heroImage}
          {...(heroSrcSet ? { srcSet: heroSrcSet, sizes: "100vw" } : {})}
          alt={heroAlt ?? ""}
          width={heroWidth}
          height={heroHeight}
          loading="eager"
          decoding="async"
          {...{ fetchpriority: "high" } as Record<string, string>}
          className={`absolute inset-0 h-full w-full object-cover ${
            soft ? "saturate-[1.02] brightness-[0.92]" : ""
          }`}
          style={{ objectPosition: heroPosition ?? "center" }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {/*
            Ink wash so type stays legible over a bright room.

            TWO WASHES, because one gradient cannot serve both layouts. The
            horizontal one below was drawn for the lg two-column hero, where the
            text sits in the dark left third and the gradient reaches transparent
            under the quote card. When the grid stacks, the text spans the full
            width and runs straight past that stop: measured at 375px, the H1 box
            ends at 359px while the wash is fully transparent from 278px — 82px
            of the headline over the bare photograph.

            Below lg the wash therefore runs top-to-bottom across the full width,
            which is the axis the stacked layout actually needs.
          */}
          <div
            className="absolute inset-0 lg:hidden"
            style={{
              background: soft
                ? "linear-gradient(180deg, hsla(213,52%,16%,0.72) 0%, hsla(213,50%,18%,0.62) 45%, hsla(213,50%,18%,0.52) 100%)"
                : "linear-gradient(180deg, hsla(213,52%,14%,0.88) 0%, hsla(213,50%,16%,0.78) 45%, hsla(213,50%,16%,0.68) 100%)",
            }}
          />
          <div
            className="absolute inset-0 hidden lg:block"
            style={{
              background: soft
                ? "linear-gradient(97deg, hsla(213,52%,18%,0.58) 0%, hsla(213,50%,20%,0.40) 30%, hsla(210,40%,25%,0.16) 52%, transparent 74%)"
                : "linear-gradient(97deg, hsla(213,52%,15%,0.92) 0%, hsla(213,50%,17%,0.86) 30%, hsla(211,46%,19%,0.68) 52%, hsla(210,40%,22%,0.28) 68%, transparent 86%)",
            }}
          />
          {/* Softens the bottom edge into the trust strip below. */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent" />
          {/* Barely-there grain keeps the flat scrim from banding. */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />
        </div>

        <div className="relative">
          <div className="container relative mx-auto flex px-4 py-12 md:py-14 lg:min-h-[620px] lg:items-center lg:py-14">
          <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,23rem)] lg:gap-14">

            <div className="max-w-2xl lg:max-w-none">
              {/* City switch kept — this homepage serves two cities. */}
              <div className="mb-6 inline-flex items-center gap-2 text-sm">
                <span className="font-semibold text-white/70">Choose your city:</span>
                <div className="inline-flex rounded-sm border border-white/25 bg-white/10 p-0.5 backdrop-blur-sm">
                  {(["Edmonton", "Calgary"] as const).map((option) => {
                    const isCurrent = option === city;
                    return (
                      <Link
                        key={option}
                        to={option === "Calgary" ? canonicalForPath("/calgary") : "/"}
                        aria-current={isCurrent ? "page" : undefined}
                        className={`inline-flex min-h-[36px] items-center px-3.5 py-1 text-sm font-bold transition-colors ${
                          isCurrent
                            ? "bg-card text-brand-navy"
                            : "text-white/80 hover:text-white"
                        }`}
                      >
                        {option}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* "Cleaning services <city>" is the largest query family either
                  hub can own (80,890 impressions in Edmonton, 63,216 in
                  Calgary) and the phrase was sitting on the services hubs
                  instead. The H1 carries it now, and so does the title.
                  The cap is 26ch at 3rem so the sentence runs two lines on a
                  1366px desktop; at 14ch and 3.5rem it ran four. The italic
                  "simple." has a descender, hence the 1.1 leading. */}
              <h1
                className={`display-serif max-w-[26ch] text-[2.5rem] font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-5xl ${
                  soft ? "[text-shadow:0_2px_18px_rgba(15,35,60,0.55)]" : "drop-shadow-sm"
                }`}
              >
                House cleaning services in {city}, made{" "}
                <em className="italic text-accent-on-dark">simple.</em>
              </h1>

              <p
                className={`mt-5 max-w-[46ch] text-base leading-relaxed md:text-[1.0625rem] ${
                  soft ? "text-white [text-shadow:0_1px_10px_rgba(15,35,60,0.6)]" : "text-white/85"
                }`}
              >
                {SUBHEAD[city]}
              </p>

              {/* One quiet proof line — the rest lives in the strip below. */}
              <a
                href={listing.reviewsUrl}
                onClick={(event) => openGoogleListing(event, listing.reviewsUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-white/80 underline-offset-4 hover:text-white hover:underline"
              >
                <Stars size={1} />
                {ratingLine}
              </a>
            </div>

            {/* Compact invitation — opens the one shared funnel at Step 1. */}
            <ServiceStartCard
              phone={phone}
              phoneLink={phoneLink}
              variant="ink"
              className="lg:justify-self-end"
            />
          </div>
        </div>
        </div>

        <ThresholdLine className="absolute inset-x-0 bottom-0 hidden lg:block" />
      </section>

      {/* One white plate straddling the hero seam, split into three
          commitments. The icon is the label; they are not a sequence, so they
          carry no numerals. */}
      <section className="relative bg-cream-50 pb-10 md:pb-12" aria-label={`${city} service commitments`}>
        <div className="container relative mx-auto px-4">
          <div className="-mt-8 grid rounded-sm border border-border bg-card shadow-xl shadow-brand-navy/15 md:-mt-10 md:grid-cols-3">
            {trustItems.map(({ icon: Icon, label, detail }, index) => (
              <div
                key={label}
                className={`flex items-start gap-3.5 p-5 lg:p-6 ${
                  index > 0 ? "border-t border-border md:border-l md:border-t-0" : ""
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-navy text-brand-gold">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The four booking steps are the one real sequence on the page, so they
          are the one place that keeps numbers. They run across a single
          hairline: no cards, no sticky rail (What's Included and the FAQ keep
          that device) and no thumbnails. */}
      <section id="how-it-works" className="band band-paper band-hairline">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <Eyebrow>How it works</Eyebrow>
              <h2 className="display-serif display-2 mt-3 text-foreground">
                {howItWorks.heading}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                {howItWorks.intro}
              </p>
            </div>

            <ol className="mt-10 grid gap-x-10 gap-y-8 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step) => (
                <li key={step.number}>
                  <span className="display-serif text-2xl font-bold text-accent" aria-hidden="true">
                    {step.number}
                  </span>
                  <h3 className="mt-2 text-lg font-bold leading-snug text-foreground">
                    <span className="sr-only">Step {step.number}: </span>
                    {step.title}
                  </h3>
                  <p className="mt-1.5 leading-relaxed text-muted-foreground">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
