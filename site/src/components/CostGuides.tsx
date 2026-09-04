import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const GUIDES = [
  {
    meta: "Pricing · 6 min read",
    title: "What house cleaning actually costs in Alberta.",
    blurb: "Flat-rate vs hourly, what moves the number, and how to read a quote before you book.",
    to: "/how-much-does-a-house-cleaning-cost/",
  },
  {
    meta: "Planning · 5 min read",
    title: "How often should a home actually be cleaned?",
    blurb: "Weekly, bi-weekly or monthly — an honest schedule for how your home is really lived in.",
    to: "/how-often-should-a-cleaning-service-clean-my-house/",
  },
  {
    meta: "Hiring · 5 min read",
    title: "How to choose a cleaning company you can trust.",
    blurb: "The questions worth asking — vetting, guarantees, and the flags to walk away from.",
    to: "/blog/choosing-cleaning-company/",
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
            {/* The whole card used to be the link, so the anchor into each guide
                read "Pricing · 6 min read What house cleaning actually costs in
                Alberta…" — 163 characters of category, reading time and blurb.
                The anchor is the headline now, which is what an article link
                should say, and it stretches over the card so the click target is
                unchanged. */}
            {GUIDES.map(({ meta, title, blurb, to }) => (
              <div key={to} className="group relative block border-t border-border pt-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{meta}</p>
                <h3 className="display-serif mt-3 text-2xl font-bold leading-snug text-foreground transition-colors group-hover:text-accent">
                  <Link
                    to={to}
                    className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {title}
                  </Link>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                  Read guide
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
