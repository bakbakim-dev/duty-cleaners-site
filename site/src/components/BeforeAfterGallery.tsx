import { Camera } from "lucide-react";
import { BEFORE_AFTER } from "@/data/before-after";
import useRevealOnScroll from "@/hooks/use-reveal-on-scroll";

/**
 * Real before/after pairs for a city. If the owner hasn't supplied photos
 * yet the section renders a designed placeholder — never a broken frame and
 * never a stand-in image pretending to be a real result.
 */
export default function BeforeAfterGallery({ city }: { city: "Edmonton" | "Calgary" }) {
  const pairs = BEFORE_AFTER[city];
  const reveal = useRevealOnScroll<HTMLDivElement>();

  return (
    <section className="band band-white band-hairline" aria-label={`Before and after cleans in ${city}`}>
      <div className="container mx-auto px-4">
        {/* The heading has to follow the state. With no pairs supplied, this
            said "Real {city} homes, real results" directly above a card
            explaining that the real set has not been photographed yet. */}
        <div className="mb-10 text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-accent">Before &amp; After</span>
          <h2 className="display-serif display-2 mt-2 text-foreground">
            {pairs.length === 0
              ? `Before and after, from real ${city} cleans`
              : `Real ${city} homes, real results`}
          </h2>
        </div>

        <div ref={reveal.ref} className={`motion-reveal mx-auto max-w-5xl ${reveal.className}`}>
          {pairs.length === 0 ? (
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-background px-6 py-12 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-navy text-brand-gold">
                <Camera className="h-7 w-7" aria-hidden="true" />
              </span>
              <p className="text-lg font-bold text-foreground">Our newest {city} before/after set is being photographed.</p>
              <p className="max-w-prose leading-relaxed text-muted-foreground">
                We only publish photos from real cleans we've done — so this space stays empty until the next set is
                shot and approved by the homeowner.
              </p>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </section>
  );
}
