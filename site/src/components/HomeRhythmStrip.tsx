import type { Picture } from "vite-imagetools";
import useRevealOnScroll from "@/hooks/use-reveal-on-scroll";
import ResponsiveImage from "@/components/ResponsiveImage";

export interface HomeRhythmSlot {
  /** A build-time Picture (an `?card` import): carries its own srcset and real intrinsic size. */
  picture: Picture;
  alt: string;
  /** Short seasonal caption, e.g. "Snow season — the mudroom". */
  caption: string;
  /*
    The intrinsic width and height come from the Picture. They used to be
    passed by hand, and before that were hard-coded as 640x480 for every slot —
    the wrong shape for all six photos that pass through here, one of them
    1080x1920 portrait. Read from the file, the ratio the browser reserves is
    the photo's own.
  */
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
          <div className="overflow-hidden rounded-lg">
            <ResponsiveImage
              picture={slot.picture}
              sizes="(min-width: 640px) 33vw, 100vw"
              alt={slot.alt}
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
