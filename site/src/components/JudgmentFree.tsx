import { useLocation } from "react-router-dom";
import { quoteHrefFor } from "@/lib/quote-link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import defaultRoom from "@/assets/gallery/living-room-clean.webp";

interface JudgmentFreeProps {
  /** Calm wide room behind the pull-quote; pick one not already on the page. */
  image?: string;
  /** Describes that room; localize it so the page's city carries into image search. */
  alt?: string;
  /** Picks the wording. Both hubs render this block and must not repeat each other. */
  city?: "Edmonton" | "Calgary";
}

const COPY = {
  Edmonton: {
    lead: "Some homes have gotten away from people: after an illness, a new baby, a hard season, or simply more than you want to handle alone.",
    body: "Nothing needs explaining. The cleaners do the work, keep their comments to themselves, and leave. A home that has gone months without a proper clean is the kind of job the Edmonton team takes on. Describe the home on the booking form as it is today; clear information helps, and no apology is needed.",
    safety: "Hoarding situations and large debris removal are outside the cleaning scope, and so are bodily fluids, pests and rodents. If you are not sure which side of that line your home falls on, call the Edmonton office before you book.",
  },
  Calgary: {
    lead: "A home gets away from people after a surgery, a newborn, a bad winter, or a job that eats the evenings. Any of those is a normal reason to book.",
    body: "Leave it as it is. Nobody on the team passes remarks or asks how it got this way; they clean and they go. A kitchen that has not been properly done in a year is ordinary work for us. On the booking form, say what you see and skip the apology.",
    safety: "The Calgary team does not take on hoarding situations, large debris removal, bodily fluids, or pest and rodent infestations. If any of those applies to your home, call the Calgary office first and talk it through.",
  },
} as const;

/**
 * Our most differentiated claim, staged as a cinematic pause: the pull-quote
 * carried over a full-bleed lived-in room, supporting copy on paper below.
 */
export default function JudgmentFree({
  image = defaultRoom,
  alt = "Sunlit living room kept clean between visits",
  city = "Edmonton",
}: JudgmentFreeProps) {
  const { pathname } = useLocation();
  const copy = COPY[city];
  return (
    <section id="judgment-free" aria-labelledby="judgment-free-heading">
      {/* Interstitial — one image, one line, nothing else competing. */}
      <div className="relative isolate overflow-hidden bg-brand-navy">
        <img
          src={image}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
        <div className="container relative mx-auto px-4 py-20 text-center md:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            How we show up
          </p>
          <h2
            id="judgment-free-heading"
            className="display-serif mx-auto mt-4 max-w-[24ch] text-3xl font-bold leading-snug text-white md:text-5xl"
          >
            We&rsquo;ve seen it all.{" "}
            <em className="italic text-accent-on-dark">We&rsquo;ve judged none of it.</em>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">{copy.lead}</p>
        </div>
      </div>

      {/* Supporting copy returns to the paper surface. */}
      <div className="band band-paper band-hairline">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl items-start gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
            <div>
              <p className="text-base leading-relaxed text-foreground md:text-lg">{copy.body}</p>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{copy.safety}</p>
            </div>
            <Button
              size="lg"
              className="h-14 bg-accent px-8 text-base font-bold text-accent-foreground hover:bg-accent/90 lg:mt-1"
              asChild
            >
              <a href={quoteHrefFor(pathname)}>
                See my price
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
