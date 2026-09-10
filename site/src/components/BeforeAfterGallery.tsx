import { BEFORE_AFTER } from "@/data/before-after";
import useRevealOnScroll from "@/hooks/use-reveal-on-scroll";

/**
 * Real before/after pairs for a city. Until the owner supplies photos the
 * section is one honest line, not a heading, an icon and two paragraphs about
 * a photo shoot: that was sixty words of padding on the two pages where the
 * word count matters most, and it repeated verbatim on both.
 *
 * The line used to end "We do not publish stand-ins" while sitting directly
 * under a six-photo mosaic of generated images on both hubs. The mosaic is
 * gone; the line is the whole section again, and shorter.
 */
const EMPTY_LINE = {
  Edmonton: "Before-and-after photos from Edmonton cleans go up here once the homeowners have approved them.",
  Calgary: "Calgary before-and-after photos go up as each homeowner signs off on theirs.",
} as const;

export default function BeforeAfterGallery({ city }: { city: "Edmonton" | "Calgary" }) {
  const pairs = BEFORE_AFTER[city];
  const reveal = useRevealOnScroll<HTMLDivElement>();

  if (pairs.length === 0) {
    return (
      <section className="band band-tight band-white band-hairline" aria-label={`Before and after cleans in ${city}`}>
        <div className="container mx-auto px-4">
          <p className="mx-auto max-w-3xl text-center text-sm leading-relaxed text-muted-foreground">{EMPTY_LINE[city]}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="band band-white band-hairline" aria-label={`Before and after cleans in ${city}`}>
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-accent">Before &amp; After</span>
          <h2 className="display-serif display-2 mt-2 text-foreground">Real {city} homes, real results</h2>
        </div>

        <div ref={reveal.ref} className={`motion-reveal mx-auto max-w-5xl ${reveal.className}`}>
          <div className="grid gap-8 md:grid-cols-2">
            {pairs.map((pair) => (
              <figure key={pair.label} className="motion-lift overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
                <div className="grid grid-cols-2">
                  <div className="relative">
                    <img src={pair.before} alt={pair.beforeAlt} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                    <span className="absolute left-3 top-3 rounded-full bg-brand-navy/90 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-navy-foreground">
                      Before
                    </span>
                  </div>
                  <div className="relative border-l border-border">
                    <img src={pair.after} alt={pair.afterAlt} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                    <span className="absolute left-3 top-3 rounded-full bg-brand-gold px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-gold-foreground">
                      After
                    </span>
                  </div>
                </div>
                <figcaption className="px-4 py-3 text-sm font-semibold text-foreground">{pair.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
