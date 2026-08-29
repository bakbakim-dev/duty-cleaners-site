import { Link } from "react-router-dom";
import { Bath, Bed, ChefHat, CheckCircle2, ExternalLink, Sofa } from "lucide-react";
import useRevealOnScroll from "@/hooks/use-reveal-on-scroll";
import ThresholdLine from "@/components/ThresholdLine";
import Eyebrow from "@/components/Eyebrow";

interface CityIncludedChapterProps {
  city: "Edmonton" | "Calgary";
}

const rooms = [
  {
    icon: ChefHat,
    title: "Kitchen",
    items: [
      "Countertops & backsplash",
      "Stovetop & exterior of appliances",
      "Sink & faucet polished",
      "Cabinet fronts wiped",
      "Floors swept & mopped",
    ],
  },
  {
    icon: Bath,
    title: "Bathrooms",
    items: [
      "Toilets sanitized inside & out",
      "Tubs, showers & tile scrubbed",
      "Mirrors & glass streak-free",
      "Counters & sinks disinfected",
      "Floors washed",
    ],
  },
  {
    icon: Bed,
    title: "Bedrooms",
    items: [
      "Dusting all surfaces",
      "Beds made (linens if provided)",
      "Mirrors & glass cleaned",
      "Floors vacuumed & mopped",
      "Trash removed",
    ],
  },
  {
    icon: Sofa,
    title: "Living Areas",
    items: [
      "Dusting furniture & shelves",
      "Vacuum carpets & rugs",
      "Hard floors mopped",
      "Light switches & door handles",
      "Cobwebs removed",
    ],
  },
];

/**
 * What's included, composed as an editorial chapter: a caption rail on the
 * left, the room checklist offset beside it. Same checklist content as before.
 */
export default function CityIncludedChapter({ city }: CityIncludedChapterProps) {
  const heading = useRevealOnScroll<HTMLDivElement>();

  return (
    <section className="band band-paper band-hairline">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)] lg:gap-14">
          {/* Caption rail */}
          <div ref={heading.ref} className={`lg:sticky lg:top-28 lg:self-start ${heading.className}`}>
            <Eyebrow>What&rsquo;s Included</Eyebrow>
            <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2">Every Clean, Done Right</h2>
            <span className={`rule-draw mt-4 ${heading.className}`} aria-hidden="true" />
            <p className="mt-4 max-w-[45ch] leading-relaxed text-muted-foreground">
              A consistent checklist our {city} cleaners follow on every visit, so nothing gets missed.
            </p>
            <ThresholdLine className="mt-6 hidden max-w-[220px] lg:block" />
            <Link
              to="/whats-included/"
              className="mt-6 inline-flex min-h-[44px] items-center font-semibold text-primary hover:underline"
            >
              See the full checklist <ExternalLink className="ml-1 h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Numbered room ledger: hairline rows, checklist split across two columns. */}
          <div>
            {rooms.map((room, idx) => {
              const Icon = room.icon;
              const number = String(idx + 1).padStart(2, "0");
              return (
                <div
                  key={room.title}
                  className="grid grid-cols-[2.5rem_minmax(0,11rem)_minmax(0,1fr)] items-start gap-4 border-t border-border py-6 first:border-t-0 first:pt-0 md:gap-6 md:py-7"
                >
                  <span className="pt-1 text-sm font-bold tracking-[0.16em] text-accent" aria-hidden="true">
                    {number}
                  </span>
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-white">
                      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="display-serif mt-3 text-xl font-bold text-foreground">{room.title}</h3>
                  </div>
                  <ul className="grid gap-x-8 gap-y-2 pt-1 sm:grid-cols-2">
                    {room.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            <div className="border-t border-border" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
