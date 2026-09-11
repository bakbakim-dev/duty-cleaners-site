import { BEFORE_AFTER } from "@/data/before-after";
import useRevealOnScroll from "@/hooks/use-reveal-on-scroll";

/**
 * Real before/after pairs for a city, owner-approved only (data/before-after.ts).
 *
 * With no approved pairs on file the section renders nothing at all. It used
 * to render one line promising photos later: a placeholder for content that
 * does not exist yet, on the two city hubs, telling the reader about the site
 * rather than about the clean. Before that it was a heading and two paragraphs about a
 * photo shoot, and before that a mosaic of generated images under a caption
 * saying the site does not publish stand-ins.
 *
 * Add real pairs to BEFORE_AFTER and the section below renders as it is.
 */
export default function BeforeAfterGallery({ city }: { city: "Edmonton" | "Calgary" }) {
  const pairs = BEFORE_AFTER[city];
  const reveal = useRevealOnScroll<HTMLDivElement>();

  if (pairs.length === 0) return null;

  return (
    <section className="band band-white band-hairline" aria-label={`Before and after cleans in ${city}`}>
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-accent">Before &amp; After</span>
          <h2 className="display-serif display-2 mt-2 text-foreground">Before-and-after photos from {city} cleans</h2>
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
