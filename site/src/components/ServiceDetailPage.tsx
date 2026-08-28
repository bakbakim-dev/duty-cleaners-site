import { canonicalForPath, canonicalUrlForPath } from "@/data/legacy-urls";
import { schemaAddressFor } from "@/data/proof";
import { POLICY } from "@/data/policy";
import CityCrossLink from "@/components/CityCrossLink";
import { useState, useEffect, type ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  CheckCircle2, Star, Phone, Plus, Minus, CalendarCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";

interface FaqItem {
  q: string;
  a: string;
}

interface IncludedCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface RoomTask {
  name: string;
  tasks: number;
  sample: string;
}

export interface PriceTier {
  size: string;
  price: string;
  /** Legacy field — no longer displayed. We do not quote on-site hours. */
  duration?: string;
}

export interface ExtraItem {
  name: string;
  price?: string;
}

interface ServiceDetailPageProps {
  /**
   * "Also serving" card for this service's other-city twin. Verified across all
   * four service pairs: only commercial cross-linked, so a visitor landing on
   * the wrong city's page had no route to the right one.
   */
  crossCity?: { city: string; to: string; description: string };
  city: "edmonton" | "calgary";
  phone: string;
  phoneHref: string;
  seoTitle: string;
  seoDescription: string;
  canonical: string;
  heroHeading: ReactNode;
  heroSubheading: string;
  heroBadges?: string[];
  heroImage?: string;
  heroImageAlt?: string;
  overviewEyebrow?: string;
  overviewHeading: ReactNode;
  overviewParagraphs: string[];
  includedHeading: ReactNode;
  includedSubheading?: string;
  included: IncludedCard[];
  bullets: string[];
  faqs: FaqItem[];
  ctaHeading: ReactNode;
  ctaDescription: string;
  galleryImages?: { src: string; alt: string }[];
  /** Listing-style upgrades (optional — graceful fallbacks) */
  roomTasks?: RoomTask[];
  pricingBySize?: PriceTier[];
  pricingNote?: string;
  extras?: ExtraItem[];
  notIncluded?: string[];
  fromPrice?: string;
  /** Service slug forwarded to the city quote form (?service=...) for personalization. */
  quoteService?: string;
}

const FaqAccordionItem = ({
  item, index, isOpen, onToggle,
}: {
  item: FaqItem; index: number; isOpen: boolean; onToggle: () => void;
}) => (
  <div className="border border-border rounded-xl overflow-hidden transition-colors hover:border-accent/50">
    <button
      onClick={onToggle}
      aria-expanded={isOpen}
      className="w-full text-left px-5 md:px-6 py-5 bg-card flex justify-between items-center gap-4 hover:bg-accent/5 transition-colors"
    >
      <span className="flex items-start gap-4">
        <span className="text-brand-gold font-bold text-xl md:text-2xl leading-tight shrink-0 w-8">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="font-semibold text-base md:text-lg leading-snug pt-0.5">{item.q}</span>
      </span>
      {isOpen ? <Minus className="w-5 h-5 text-accent shrink-0" /> : <Plus className="w-5 h-5 text-accent shrink-0" />}
    </button>
    {/* Always mounted (hidden when collapsed) for schema/content parity. */}
    <div
      className={`px-5 md:px-6 pb-6 pt-2 bg-card text-muted-foreground leading-relaxed md:pl-16 ${
        isOpen ? "animate-fade-in" : "hidden"
      }`}
    >
      {item.a}
    </div>
  </div>
);

const ServiceDetailPage = ({
  city,
  phone,
  phoneHref,
  seoTitle,
  seoDescription,
  canonical,
  heroHeading,
  heroSubheading,
  heroBadges,
  heroImage,
  heroImageAlt,
  overviewEyebrow,
  overviewHeading,
  overviewParagraphs,
  includedHeading,
  includedSubheading,
  included,
  bullets,
  faqs,
  ctaHeading,
  ctaDescription,
  galleryImages,
  roomTasks,
  pricingBySize,
  pricingNote,
  extras,
  notIncluded,
  fromPrice,
  quoteService,
  crossCity,
}: ServiceDetailPageProps) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showSticky, setShowSticky] = useState(false);

  const cityName = city === "edmonton" ? "Edmonton" : "Calgary";
  const quoteBase = city === "calgary" ? canonicalForPath("/calgary") : "/";
  // Carry the service context into the city quote form so the form header
  // can personalize (e.g. "Your Deep Cleaning price — ready in 60 seconds").
  // Deep Cleaning is a BookingKoala package, not a service: the funnel needs
  // the intent flag so it can show the Standard + package breakdown.
  const quoteQuery = quoteService
    ? `?service=${quoteService}${quoteService === "deep-cleaning" ? "&intent=deep" : ""}`
    : "";
  const quoteLink = `${quoteBase}${quoteQuery}#quote`;
  const pricingLink = canonicalForPath(city === "calgary" ? "/calgary/pricing" : "/edmonton/pricing");

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: seoTitle.replace(/\s*\|\s*Duty Cleaners\s*$/, ""),
    description: seoDescription,
    url: canonicalUrlForPath(new URL(canonical).pathname),
    provider: {
      "@type": "LocalBusiness",
      name: `Duty Cleaners ${cityName}`,
      telephone: phone,
      url: `https://dutycleaners.ca${quoteBase}`,
      // One authority for the entity's address (data/proof.ts). This provider
      // node used to carry none — on every service×city page, ~165 of the 175
      // address-less LocalBusiness nodes an AuditSpur build audit found.
      address: schemaAddressFor(city),
    },
    areaServed: { "@type": "City", name: `${cityName}, AB` },
    ...(pricingBySize && pricingBySize.length > 0
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Pricing by home size",
            itemListElement: pricingBySize.map((tier) => {
              const nums = (tier.price.match(/\d+/g) || []).map(Number);
              return {
                "@type": "Offer",
                name: tier.size,
                priceCurrency: "CAD",
                ...(nums.length >= 2
                  ? {
                      priceSpecification: {
                        "@type": "PriceSpecification",
                        minPrice: Math.min(...nums),
                        maxPrice: Math.max(...nums),
                        priceCurrency: "CAD",
                      },
                    }
                  : nums.length === 1
                    ? { price: nums[0] }
                    : {}),
              };
            }),
          },
        }
      : {}),
  };

  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 700);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={canonicalUrlForPath(new URL(canonical).pathname)} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrlForPath(new URL(canonical).pathname)} />
        <meta property="og:image" content="https://dutycleaners.ca/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        {/* FAQ rich results retired (May 2026), but the markup still mirrors the
            rendered Q&A below and helps machine readers parse the page. */}
        {faqs.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: { "@type": "Answer", text: faq.a },
              })),
            })}
          </script>
        )}
      </Helmet>
      <Navigation city={city} />
      <main id="main-content" tabIndex={-1}>

      {/* Breadcrumb strip */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumbs />
        </div>
      </div>

      {/* Hero — side-by-side */}
      <section className="relative bg-gradient-to-br from-brand-navy via-[#254a7a] to-brand-navy text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" aria-hidden="true"></div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {overviewEyebrow && (
                <span className="text-brand-gold font-semibold text-sm uppercase tracking-wide mb-4 block">
                  Professional {cityName} Cleaning
                </span>
              )}
              <h1 className="display-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {heroHeading}
              </h1>
              <p className="text-lg md:text-xl text-white/85 leading-relaxed mb-8">
                {heroSubheading}
              </p>
              {heroBadges && heroBadges.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-10">
                  {heroBadges.map((badge) => (
                    <span
                      key={badge}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/25 text-sm font-semibold backdrop-blur-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 text-brand-gold" aria-hidden="true" />
                      {badge}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 shadow-xl hover:-translate-y-0.5 transition-all"
                  asChild
                >
                  <Link to={quoteLink} className="inline-flex items-center gap-2">
                    <CalendarCheck className="w-5 h-5" aria-hidden="true" />
                    See My Instant Price
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 border-2 border-white text-white hover:bg-white hover:text-brand-navy transition-all"
                  asChild
                >
                  <a href={phoneHref} className="inline-flex items-center gap-2">
                    <Phone className="w-5 h-5" aria-hidden="true" />
                    {phone}
                  </a>
                </Button>
              </div>
            </div>
            {heroImage && (
              <div className="hidden lg:block">
                <img
                  src={heroImage}
                  alt={heroImageAlt ?? ""}
                  className="w-full max-h-[500px] object-cover rounded-2xl shadow-2xl border-4 border-white/10"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Photo Strip — horizontal snap-scroll, authentic interiors only */}
      {galleryImages && galleryImages.length > 0 && (
        <section aria-label="Cleaning photo gallery" className="bg-background border-b border-border">
          <div className="py-6 overflow-x-auto snap-x snap-mandatory">
            <div className="flex gap-4 px-4 w-max mx-auto">
              {galleryImages.map((img, i) => (
                <div
                  key={i}
                  className="snap-center shrink-0 w-64 md:w-80 aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-sm"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Overview */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mb-8">{overviewHeading}</h2>
          <div className="space-y-5 text-lg text-muted-foreground leading-relaxed">
            {overviewParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mb-4">{includedHeading}</h2>
          {includedSubheading && (
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">{includedSubheading}</p>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto mb-12">
            {included.map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-xl p-6 border border-border shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300"
              >
                <span className="w-11 h-11 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4">
                  <card.icon className="w-5 h-5" aria-hidden="true" />
                </span>
                <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
          <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-border p-7 md:p-9 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-5">
              The Full Checklist
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="font-medium">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Where We'll Clean — room-by-room with task counts */}
      {roomTasks && roomTasks.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <span className="text-accent font-semibold text-sm uppercase tracking-wide block text-center">
              Room by Room
            </span>
            <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mt-2 mb-4">
              Where we'll clean
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              A clear scope for every space in your {cityName} home — see the full breakdown on our{" "}
              <Link to="/whats-included" className="text-primary font-semibold hover:text-accent">
                What's Included checklist
              </Link>
              .
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
              {roomTasks.map((room) => (
                <div
                  key={room.name}
                  className="bg-white rounded-xl border border-border p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-accent/40 transition-all duration-300"
                >
                  <p className="text-brand-gold font-bold text-2xl">{room.tasks} tasks</p>
                  <h3 className="font-bold text-lg mt-1">{room.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    Including {room.sample}, and more.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing by Home Size */}
      {pricingBySize && pricingBySize.length > 0 && (
        <section className="py-16 md:py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <span className="text-accent font-semibold text-sm uppercase tracking-wide block text-center">
              Pricing by Home Size
            </span>
            <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mt-2 mb-4">
              Pricing by home size
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              Clear starting prices based on home size and service scope. Final time and cost can vary when a home requires substantially more work.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
              {pricingBySize.map((tier) => (
                <div
                  key={tier.size}
                  className="bg-white rounded-xl border border-border p-5 text-center shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-accent/40 transition-all duration-300"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{tier.size}</p>
                  <p className="text-3xl font-bold mt-2">{tier.price}</p>
                  <p className="text-xs text-muted-foreground mt-2">Flat rate — full checklist</p>
                </div>
              ))}
            </div>
            {pricingNote && (
              <p className="text-center text-sm text-muted-foreground mt-8 max-w-2xl mx-auto">{pricingNote}</p>
            )}
            <div className="text-center mt-6">
              <Link
                to={pricingLink}
                className="inline-flex items-center gap-2 font-semibold text-primary hover:text-accent transition-colors text-sm"
              >
                See the full {cityName} pricing breakdown
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Extras vs Not Included — two-column clarity */}
      {(extras && extras.length > 0) || (notIncluded && notIncluded.length > 0) ? (
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mb-12">
              Want a little more? Just ask.
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {extras && extras.length > 0 && (
                <div className="bg-white rounded-2xl border border-border p-7 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                      <Plus className="w-5 h-5" aria-hidden="true" />
                    </span>
                    <h3 className="text-xl font-bold">Popular add-ons</h3>
                  </div>
                  <ul className="space-y-3">
                    {extras.map((extra) => (
                      <li
                        key={extra.name}
                        className="flex items-center justify-between gap-4 border-b border-border/60 pb-3 last:border-0 last:pb-0"
                      >
                        <span className="flex items-center gap-2 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                          {extra.name}
                        </span>
                        {extra.price && (
                          <span className="text-sm font-semibold text-brand-gold whitespace-nowrap">{extra.price}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-5">
                    Request add-ons when booking and we'll confirm pricing upfront.
                  </p>
                </div>
              )}
              {notIncluded && notIncluded.length > 0 && (
                <div className="bg-white rounded-2xl border border-border p-7 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="w-10 h-10 rounded-lg bg-muted text-muted-foreground flex items-center justify-center">
                      <Minus className="w-5 h-5" aria-hidden="true" />
                    </span>
                    <h3 className="text-xl font-bold">Not included</h3>
                  </div>
                  <ul className="space-y-3">
                    {notIncluded.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-muted-foreground">
                        <Minus className="w-4 h-4 mt-1 shrink-0" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-5">
                    Not sure about a task?{" "}
                    <Link to="/contact-us" className="text-primary font-semibold hover:text-accent">
                      Send us a message
                    </Link>{" "}
                    and we'll confirm.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {/* FAQs */}
      {faqs.length > 0 && (
        <section className="py-16 md:py-20 bg-secondary/30">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mb-4">
              Frequently asked questions
            </h2>
            <p className="text-muted-foreground text-center mb-12">
              Everything {cityName} homeowners ask before booking
            </p>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <FaqAccordionItem
                  key={index}
                  item={faq}
                  index={index}
                  isOpen={openFaqIndex === index}
                  onToggle={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-brand-navy via-[#254a7a] to-brand-navy text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="display-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{ctaHeading}</h2>
          <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto mb-10">{ctaDescription}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
              asChild
            >
              <Link to={quoteLink} className="inline-flex items-center gap-2">
                <CalendarCheck className="w-5 h-5" aria-hidden="true" />
                See My Instant Price
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-2 border-white text-white hover:bg-white hover:text-brand-navy transition-all"
              asChild
            >
              <a href={phoneHref} className="inline-flex items-center gap-2">
                <Phone className="w-5 h-5" aria-hidden="true" />
                Call {phone}
              </a>
            </Button>
          </div>
          {/*
            Four pages using this template carried a "100% Satisfaction
            Guarantee" hero badge with the remedy stated nowhere on the page —
            the exact unqualified slogan /blog/cleaning-services-calgary tells
            readers to treat as a red flag. Stating the process here, from
            POLICY rather than hand-typed, is what makes the badge a claim the
            page actually backs.
          */}
          <p className="mt-10 text-sm text-white/70 max-w-2xl mx-auto">
            What the guarantee means: if something was missed, tell us within{" "}
            {POLICY.guaranteeWindowHours} hours and we come back and re-clean it at no
            additional charge. Photos help but are not required.{" "}
            <Link to={canonicalForPath("/satisfaction-guarantee")} className="underline hover:text-brand-gold">
              Read the full guarantee
            </Link>
            .
          </p>
        </div>
      </section>
      {crossCity && (
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <CityCrossLink city={crossCity.city} to={crossCity.to} description={crossCity.description} />
          </div>
        </section>
      )}
      </main>

      <Footer />

      {/* Sticky Price Bar — desktop, appears after scrolling past hero */}
      <div
        className={`hidden md:block fixed bottom-0 inset-x-0 z-40 transition-transform duration-300 ${
          showSticky ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-white/95 backdrop-blur-md border-t border-border shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-6">
            <div className="flex items-center gap-6 min-w-0">
              <p className="font-bold truncate">{cityName} Cleaning</p>
              {fromPrice && (
                <p className="text-muted-foreground whitespace-nowrap">
                  From <span className="font-bold text-foreground text-lg">{fromPrice}</span>
                </p>
              )}
              <span className="hidden lg:inline-flex items-center gap-1.5 text-sm text-muted-foreground whitespace-nowrap">
                <Star className="w-4 h-4 text-brand-gold fill-brand-gold" aria-hidden="true" />
                4.9 on Google
              </span>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <a
                href={phoneHref}
                className="inline-flex items-center gap-2 font-semibold text-primary hover:text-accent transition-colors text-sm"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                {phone}
              </a>
              <Button
                className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:-translate-y-0.5 transition-all"
                asChild
              >
                <Link to={quoteLink} className="inline-flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4" aria-hidden="true" />
                  See My Instant Price
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
