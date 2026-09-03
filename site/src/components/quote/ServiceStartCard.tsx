import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getService, type ServiceId } from "@/data/pricing";
import { useQuoteOverlay } from "@/hooks/use-quote-overlay";
import RiskReversalRow from "@/components/quote/RiskReversalRow";

/**
 * Step 1 of the funnel, as a card.
 *
 * There is exactly ONE funnel on the site — the full-screen overlay. Every
 * place that used to render the flow inline (the hero, the #quote section at
 * the bottom of the city pages) renders this card instead, so the visitor
 * always meets the same three questions and the same takeover, never a second
 * long-scrolling copy of the same form.
 */

/** Core choices stay prominent; specialty work is grouped so it never buries the CTA. */
const CORE_SERVICE_IDS: ServiceId[] = ["standard", "move-in-out"];
/**
 * Only self-serve work is selectable. Airbnb turnovers and commercial sites are
 * priced per hour / per site, so they route to a callback instead.
 */
const SPECIALTY_SERVICE_IDS: ServiceId[] = ["post-construction"];

interface ServiceStartCardProps {
  phone: string;
  phoneLink: string;
  className?: string;
  /** "accent" gives the hero variant its 3px orange top edge. */
  topBorder?: "gold" | "accent";
  /**
   * "form" — the full white Step-1 card (default, used in the #quote section).
   * "ink"  — a compact deep-ink invitation panel used over the hero photo.
   */
  variant?: "form" | "ink";
}

export default function ServiceStartCard({
  phone,
  phoneLink,
  className = "",
  topBorder = "gold",
  variant = "form",
}: ServiceStartCardProps) {
  const { openQuote, prewarmQuote } = useQuoteOverlay();
  const [service, setService] = useState<ServiceId>("standard");
  /**
   * Deep Cleaning is a BookingKoala package on top of a Standard clean, not a
   * service of its own — the chip selects Standard and carries the intent into
   * the funnel so the price screen shows the full breakdown.
   */
  const [deepIntent, setDeepIntent] = useState(false);

  const renderServiceOption = (id: ServiceId, compact = false) => {
    const option = getService(id);
    const selected = option.id === service;
    return (
      <button
        key={option.id}
        type="button"
        aria-pressed={selected && !deepIntent}
        onMouseEnter={prewarmQuote}
        onClick={() => {
          setService(option.id);
          setDeepIntent(false);
        }}
        className={`flex min-h-[48px] w-full items-center gap-3 rounded-sm border px-4 py-3 text-left font-semibold transition-colors ${
          compact ? "text-sm" : "text-base"
        } ${
          selected
            ? "border-brand-navy bg-brand-navy text-brand-navy-foreground"
            : "border-border bg-card text-foreground hover:border-brand-navy/40"
        }`}
      >
        {option.label}
      </button>
    );
  };

  if (variant === "ink") {
    /** Compact starting-point tiles laid out two-up; selected fills navy. */
    const heroTile = (
      id: ServiceId | "deep",
      label: string,
      selected: boolean,
      onSelect: () => void,
    ) => (
      <button
        key={id}
        type="button"
        aria-pressed={selected}
        onMouseEnter={prewarmQuote}
        onClick={onSelect}
        className={`flex min-h-[52px] w-full items-center rounded-sm border px-4 py-3 text-left text-[0.9375rem] font-semibold transition-colors ${
          selected
            ? "border-brand-navy bg-brand-navy text-brand-navy-foreground"
            : "border-border bg-card text-foreground hover:border-brand-navy/40 hover:bg-secondary/50"
        }`}
      >
        {label}
      </button>
    );

    return (
      <div className={`relative z-10 w-full max-w-[26rem] ${className}`}>
        <div className="card-warm overflow-hidden border border-border bg-card shadow-2xl shadow-black/25">
          <div className="border-t-[3px] border-accent" aria-hidden="true" />

          <div className="p-6 sm:p-7">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
                Your instant price
              </span>
              <span className="text-xs font-medium text-fine-print">About 60 seconds</span>
            </div>

            <h2 className="display-serif mt-2.5 text-2xl font-bold leading-snug text-brand-navy">
              What type of clean do you need?
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-fine-print">
              Choose a starting point — you&rsquo;ll see the price before you book.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {heroTile("standard", "Standard", service === "standard" && !deepIntent, () => {
                setService("standard");
                setDeepIntent(false);
              })}
              {heroTile("deep", "Deep clean", deepIntent, () => {
                setService("standard");
                setDeepIntent(true);
              })}
              {heroTile("move-in-out", "Move in / out", service === "move-in-out", () => {
                setService("move-in-out");
                setDeepIntent(false);
              })}
              {heroTile(
                "post-construction",
                "Post-construction",
                service === "post-construction",
                () => {
                  setService("post-construction");
                  setDeepIntent(false);
                },
              )}
            </div>

            <Button
              size="lg"
              className="mt-5 h-14 w-full bg-accent text-base font-bold text-accent-foreground hover:bg-accent/90"
              onClick={() => openQuote(service, deepIntent ? "deep" : null)}
            >
              Continue to Your Price
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Button>
            <p className="mt-3 text-center text-sm text-fine-print">
              No payment details needed to start.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-sm bg-card ${
        topBorder === "accent" ? "border-t-[3px] border-accent" : "border-t-4 border-brand-gold"
      } p-5 text-foreground shadow-2xl shadow-brand-navy/40 sm:p-7 md:p-8 ${className}`}
    >

      <div className="flex items-center justify-between text-base font-bold text-foreground">
        <span>Step 1 of 4 — About your home</span>
        <span className="text-accent">25%</span>
      </div>
      <div className="mt-2 h-2 w-full bg-secondary">
        <div className="h-full w-1/4 bg-accent" />
      </div>

      <h2 className="mt-6 text-xl font-bold leading-snug text-foreground">
        What type of clean do you need?
      </h2>

      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-1">
        {CORE_SERVICE_IDS.map((id) => renderServiceOption(id))}
        <button
          type="button"
          aria-pressed={deepIntent}
          onMouseEnter={prewarmQuote}
          onClick={() => {
            setService("standard");
            setDeepIntent(true);
          }}
          className={`flex min-h-[48px] w-full items-center justify-between gap-3 rounded-sm border px-4 py-3 text-left text-base font-semibold transition-colors ${
            deepIntent
              ? "border-brand-navy bg-brand-navy text-brand-navy-foreground"
              : "border-border bg-card text-foreground hover:border-brand-navy/40"
          }`}
        >
          Deep Cleaning
        </button>
      </div>

      <p className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-foreground/80">
        Specialty cleaning
      </p>
      <div className="mt-2 grid grid-cols-1 gap-2.5">
        {SPECIALTY_SERVICE_IDS.map((id) => renderServiceOption(id, true))}
      </div>

      <Button
        size="lg"
        className="mt-6 h-14 w-full bg-accent text-base font-bold text-accent-foreground hover:bg-accent/90"
        onClick={() => openQuote(service, deepIntent ? "deep" : null)}
      >
        Continue
        <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
      </Button>
      <RiskReversalRow className="mt-4 justify-center text-sm" />

      {/* Minority case — kept below the action, not in front of it. */}
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Airbnb turnover or commercial property? Those are priced per hour — call{" "}
        <a href={phoneLink} className="font-semibold text-foreground underline underline-offset-4">
          {phone}
        </a>{" "}
        or{" "}
        <Link to="/contact-us/" className="font-semibold text-foreground underline underline-offset-4">
          request a quote
        </Link>
        .
      </p>
    </div>
  );
}
