import useRevealOnScroll from "@/hooks/use-reveal-on-scroll";

export interface HomeRhythmSlot {
  src: string;
  alt: string;
  /** Short seasonal caption, e.g. "Snow season — the mudroom". */
  caption: string;
}

/**
 * "Home rhythm" — three seasonal domestic moments for the service-areas
 * section. Real interior photography only: no skylines, no landmarks, no
 * generated art. Slots are placeholder-safe so owner-supplied photos drop
 * straight in without touching layout.
 */
export default function HomeRhythmStrip({ slots, className = "" }: { slots: HomeRhythmSlot[]; className?: string }) {
  const reveal = useRevealOnScroll<HTMLDivElement>();

  return (
    <div ref={reveal.ref} className={`grid gap-4 sm:grid-cols-3 ${className}`}>
      {slots.map((slot, idx) => (
        <figure key={slot.caption} className={idx === 1 ? "sm:mt-8" : ""}>
          <div className="overflow-hidden rounded-xl">
            <img
              src={slot.src}
              alt={slot.alt}
              loading="lazy"
              decoding="async"
              width={640}
              height={480}
              className={`motion-image-reveal h-48 w-full object-cover md:h-64 ${reveal.className}`}
              style={{ transitionDelay: `${idx * 60}ms` }}
            />
          </div>
          <figcaption className="mt-2 text-sm text-muted-foreground">{slot.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
