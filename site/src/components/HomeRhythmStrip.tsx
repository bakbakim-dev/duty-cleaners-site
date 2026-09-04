import useRevealOnScroll from "@/hooks/use-reveal-on-scroll";

export interface HomeRhythmSlot {
  src: string;
  alt: string;
  /** Short seasonal caption, e.g. "Snow season — the mudroom". */
  caption: string;
  /**
   * The photo's real intrinsic size. This used to be hard-coded as 640x480 for
   * every slot, which was the wrong SHAPE for all six photos that pass through
   * here — one of them is 1080x1920, portrait, and was being declared as 4:3
   * landscape. The CSS fixes the rendered height either way, so nothing moved,
   * but the browser was being told the wrong ratio to reserve.
   */
  width: number;
  height: number;
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
              width={slot.width}
              height={slot.height}
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
