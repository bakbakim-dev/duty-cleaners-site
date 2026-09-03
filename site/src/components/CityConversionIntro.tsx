import { Helmet } from "react-helmet-async";
import ThresholdLine from "@/components/ThresholdLine";
import { ArrowRight, CalendarCheck, HeartHandshake, Phone, ShieldCheck, Star, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { canonicalForPath } from "@/data/legacy-urls";
import { getListing, openGoogleListing } from "@/lib/google-listings";
import { CITY_PROOF } from "@/data/proof";
import ServiceStartCard from "@/components/quote/ServiceStartCard";

interface ProcessImage {
  src: string;
  alt: string;
}

interface CityConversionIntroProps {
  city: "Edmonton" | "Calgary";
  phone: string;
  phoneLink: string;
  /** Full-bleed room photo behind the hero scrim. */
  heroImage: string;
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
  processImages: [ProcessImage, ProcessImage, ProcessImage];
}

const trustItems = [
  {
    icon: ShieldCheck,
    label: "You Pay After the Clean",
    detail:
      "Nothing is charged when you book. A temporary hold appears the day before — your card is only charged once the clean is done.",
  },
  {
    icon: UserCheck,
    label: "Reference-Checked & Customer-Rated",
    detail:
      "Every cleaner is reference-checked before their first job, and rated by the customer after every clean. Those ratings decide who comes back.",
  },
  {
    icon: HeartHandshake,
    label: "100% Satisfaction Guarantee",
    detail: "If something was missed, tell us within 24 hours and we'll return to make it right — at no charge.",
  },
];

const processSteps = [
  { number: "01", title: "Tell us about your home", description: "Bedrooms, bathrooms and the type of clean you need." },
  { number: "02", title: "Share your contact details", description: "So we can send your quote and confirm anything unusual." },
  { number: "03", title: "See your price", description: "A real dollar figure for your home — no waiting, no obligation." },
  { number: "04", title: "Confirm your booking", description: "Pick your time and address on our secure booking page." },
];


export default function CityConversionIntro({
  city,
  phone,
  phoneLink,
  heroImage,
  heroAlt,
  heroPosition,
  heroScrim = "strong",
  processImages,
}: CityConversionIntroProps) {
  const soft = heroScrim === "soft";
  const listing = getListing(city);
  const proof = city === "Calgary" ? CITY_PROOF.calgary : CITY_PROOF.edmonton;
  const ratingLine =
    proof.googleRating && proof.googleReviewCount
      ? `${proof.googleRating} on Google · ${proof.googleReviewCount} ${city} reviews`
      : proof.googleRating
        ? `${proof.googleRating} on Google in ${city} — read the reviews`
        : `4.9 on Google in ${city} — read the reviews`;

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
          <link rel="preload" as="image" href={heroImage} />
        </Helmet>
        <img
          src={heroImage}
          alt={heroAlt ?? ""}
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
                : "linear-gradient(97deg, hsla(213,52%,15%,0.92) 0%, hsla(213,50%,17%,0.80) 26%, hsla(210,40%,22%,0.40) 46%, hsla(30,25%,40%,0.10) 66%, transparent 84%)",
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

            <div className="max-w-2xl lg:max-w-[30rem]">
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

              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-black/30 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" aria-hidden="true" />
                House cleaning · {city} &amp; area
              </span>
              <h1
                className={`display-serif max-w-[12ch] text-[2.75rem] font-bold leading-[1.05] tracking-[-0.02em] text-white md:text-5xl lg:text-[3.5rem] ${
                  soft ? "[text-shadow:0_2px_18px_rgba(15,35,60,0.55)]" : "drop-shadow-sm"
                }`}
              >
                House cleaning in {city}, made{" "}
                <em className="italic text-accent-on-dark">simple.</em>
              </h1>

              <p
                className={`mt-4 max-w-[42ch] text-[0.9375rem] leading-relaxed ${
                  soft ? "text-white [text-shadow:0_1px_10px_rgba(15,35,60,0.6)]" : "text-white/85"
                }`}
              >
                No tidying first. Tell us what your home needs, then see your price before you
                choose a time.
              </p>

              {/* One quiet proof line — the rest lives in the strip below. */}
              <a
                href={listing.reviewsUrl}
                onClick={(event) => openGoogleListing(event, listing.reviewsUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-white/80 underline-offset-4 hover:text-white hover:underline"
              >
                <span className="flex gap-0.5" aria-hidden="true">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-brand-gold text-brand-gold" />
                  ))}
                </span>
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


      {/* One white plate straddling the hero seam, split into three numbered
          commitments — the first thing the eye lands on after the headline. */}
      <section className="relative bg-cream-50 pb-10 md:pb-12" aria-label={`${city} service commitments`}>
        <div className="container relative mx-auto px-4">
          <div className="-mt-8 grid border border-border bg-card shadow-xl shadow-brand-navy/15 md:-mt-10 md:grid-cols-3">
            {trustItems.map(({ icon: Icon, label, detail }, index) => (
              <div
                key={label}
                className={`flex items-start gap-3.5 p-5 lg:p-6 ${
                  index > 0 ? "border-t border-border md:border-l md:border-t-0" : ""
                }`}
              >
                <span
                  className="pt-0.5 text-[0.7rem] font-bold tracking-[0.16em] text-accent"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
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

      {/* Editorial split: heading column on the left, numbered path on the right. */}
      <section id="how-it-works" className="band band-paper band-hairline">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                How it works
              </p>
              <h2 className="display-serif display-2 text-foreground">
                A clear path from question to clean home.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Price your home first. The rest of the booking simply carries your details forward.
              </p>
            </div>

            <div>
              {processSteps.map((step, index) => {
                const image = processImages[index];
                return (
                  <article
                    key={step.number}
                    className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-4 border-t border-border py-6 first:border-t-0 first:pt-0 md:gap-6 md:py-7"
                  >
                    <span className="self-start pt-1 text-sm font-bold tracking-[0.16em] text-accent" aria-label={`Step ${step.number}`}>
                      {step.number}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold leading-snug text-foreground md:text-xl">{step.title}</h3>
                      <p className="mt-1.5 leading-relaxed text-muted-foreground">{step.description}</p>
                    </div>
                    <div className="hidden h-20 w-28 shrink-0 overflow-hidden border border-border bg-brand-navy shadow-sm sm:block">
                      {image ? (
                        <img
                          src={image.src}
                          alt={image.alt}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-brand-gold">
                          <CalendarCheck className="h-8 w-8" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
              <div className="border-t border-border" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
