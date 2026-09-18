import { Link } from "react-router-dom";

/**
 * The three guides are the same articles on both hubs; the headline is the
 * article's title and stays put because it is the link anchor. The heading
 * and the blurbs are written per city so the Calgary hub does not repeat the
 * Edmonton one word for word (the money-page contract caps that overlap).
 */
const GUIDES = {
  Edmonton: {
    heading: "Know what’s reasonable before you book.",
    items: [
      {
        title: "What house cleaning actually costs in Alberta.",
        blurb: "Flat-rate vs hourly, what moves the number, and how to read a quote before you book.",
        to: "/how-much-does-a-house-cleaning-cost/",
      },
      {
        title: "How often should a home actually be cleaned?",
        blurb: "Weekly, bi-weekly or every four weeks: an honest schedule for how your home is really lived in.",
        to: "/how-often-should-a-cleaning-service-clean-my-house/",
      },
      {
        title: "How to choose a cleaning company you can trust.",
        blurb: "The questions worth asking about vetting and guarantees, and the flags to walk away from.",
        to: "/blog/choosing-cleaning-company/",
      },
    ],
  },
  Calgary: {
    heading: "Know the going rate before you book.",
    items: [
      {
        title: "What house cleaning actually costs in Alberta.",
        blurb: "Flat rate against hourly, what pushes a quote up, and how to read one line by line.",
        to: "/how-much-does-a-house-cleaning-cost/",
      },
      {
        title: "How often should a home actually be cleaned?",
        blurb: "Every week, every two, or every four: a schedule matched to how the home is used, not to a sales target.",
        to: "/how-often-should-a-cleaning-service-clean-my-house/",
      },
      {
        title: "How to choose a cleaning company you can trust.",
        blurb: "What to ask before you hire anyone, and the answers that should end the call.",
        to: "/blog/choosing-cleaning-company/",
      },
    ],
  },
} as const;

/**
 * "Know what's reasonable before you book" — plain-English guide cards that
 * reinforce the price-first promise. Links go to existing blog posts.
 */
export default function CostGuides({ city = "Edmonton" }: { city?: "Edmonton" | "Calgary" }) {
  const guides = GUIDES[city];
  return (
    <section className="band band-paper band-hairline" aria-label="Cleaning cost guides">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="display-serif display-2 max-w-[24ch] text-foreground">{guides.heading}</h2>

          <div className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-3">
            {/* The whole card used to be the link, so the anchor into each guide
                read "Pricing · 6 min read What house cleaning actually costs in
                Alberta…" — 163 characters of category, reading time and blurb.
                The anchor is the headline now, which is what an article link
                should say, and it stretches over the card so the click target is
                unchanged. */}
            {guides.items.map(({ title, blurb, to }) => (
              <div key={to} className="group relative block border-t border-border pt-5">
                <h3 className="display-serif text-2xl font-bold leading-snug text-foreground transition-colors group-hover:text-accent">
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
                  <span className="dc-icon dc-icon-arrow-right h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
