import { Link } from "react-router-dom";
import { ArrowRight, Phone, ShieldCheck, Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CITY_PROOF } from "@/data/proof";

interface TrustPageCtaProps {
  /** Optional override for the lead-in line above the buttons. */
  headline?: string;
  subline?: string;
}

/**
 * Conversion block for the evergreen trust pages (guarantee,
 * privacy). Visitors reading these pages are usually close to booking, so the
 * page must offer a next step instead of dead-ending.
 */
export default function TrustPageCta({
  headline = "Ready when you are",
  subline = "Get your price in about a minute — no address or payment needed to see it.",
}: TrustPageCtaProps) {
  const edmonton = CITY_PROOF.edmonton;
  const calgary = CITY_PROOF.calgary;

  return (
    <section className="mt-14 rounded-2xl bg-brand-navy p-8 text-brand-navy-foreground shadow-xl">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold md:text-3xl">{headline}</h2>
        <p className="mt-3 text-brand-navy-foreground/85">{subline}</p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" variant="accent" className="min-h-[52px] text-base font-bold">
            <Link to="/#quote">
              See My Instant Price
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="min-h-[52px] border-brand-navy-foreground/40 bg-transparent text-base font-semibold text-brand-navy-foreground hover:bg-brand-navy-foreground/10 hover:text-brand-navy-foreground"
          >
            <a href={edmonton.phoneLink} aria-label={`Call Edmonton ${edmonton.phone}`}>
              <Phone className="mr-2 h-5 w-5" aria-hidden="true" />
              {edmonton.phone}
            </a>
          </Button>
        </div>

        <p className="mt-4 text-sm text-brand-navy-foreground/70">
          Calgary?{" "}
          <a href={calgary.phoneLink} className="font-semibold text-accent hover:underline">
            {calgary.phone}
          </a>
        </p>

        <ul className="mt-8 grid gap-4 text-left sm:grid-cols-3">
          <li className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" aria-hidden="true" />
            <span className="text-sm text-brand-navy-foreground/85">Pay after your clean</span>
          </li>
          <li className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" aria-hidden="true" />
            <span className="text-sm text-brand-navy-foreground/85">Vetted cleaners, rated 4.9 on Google</span>
          </li>
          <li className="flex items-start gap-2">
            <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" aria-hidden="true" />
            <span className="text-sm text-brand-navy-foreground/85">
              Not happy? Tell us within 24 hours and we re-clean free
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
