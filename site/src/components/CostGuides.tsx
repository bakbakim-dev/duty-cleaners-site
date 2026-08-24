import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const GUIDES = [
  {
    meta: "Pricing · 6 min read",
    title: "What house cleaning actually costs in Alberta.",
    blurb: "Flat-rate vs hourly, what moves the number, and how to read a quote before you book.",
    to: "/how-much-does-a-house-cleaning-cost",
  },
  {
    meta: "Planning · 5 min read",
    title: "How often should a home actually be cleaned?",
    blurb: "Weekly, bi-weekly or monthly — an honest schedule for how your home is really lived in.",
    to: "/blog/cleaning-frequency",
  },
  {
    meta: "Hiring · 5 min read",
    title: "How to choose a cleaning company you can trust.",
    blurb: "The questions worth asking — vetting, guarantees, and the flags to walk away from.",
    to: "/blog/choosing-cleaning-company",
  },
];

/**
 * "Know what's reasonable before you book" — plain-English guide cards that
 * reinforce the price-first promise. Links go to existing blog posts.
 */
export default function CostGuides() {
  return (
    <section className="band band-paper band-hairline" aria-label="Cleaning cost guides">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Cost guides</p>
          <h2 className="display-serif display-2 mt-3 max-w-[24ch] text-foreground">
            Know what&rsquo;s reasonable before you book.
          </h2>

          <div className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-3">
            {GUIDES.map(({ meta, title, blurb, to }) => (
              <Link key={to} to={to} className="group block border-t border-border pt-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{meta}</p>
                <h3 className="display-serif mt-3 text-2xl font-bold leading-snug text-foreground transition-colors group-hover:text-accent">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                  Read guide
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
