import { Link } from "react-router-dom";
import { Bath, Bed, ChefHat, CheckCircle2, Sofa } from "lucide-react";
import useRevealOnScroll from "@/hooks/use-reveal-on-scroll";
import ThresholdLine from "@/components/ThresholdLine";
import Eyebrow from "@/components/Eyebrow";

interface CityIncludedChapterProps {
  city: "Edmonton" | "Calgary";
}

/**
 * The checklist itself is identical in both cities on purpose: the service is
 * the same service. The heading and the caption are written per city so the
 * Calgary hub does not repeat the Edmonton one word for word.
 */
const COPY = {
  Edmonton: {
    heading: "What a standard clean covers, room by room",
    caption: "Edmonton cleaners work through this list on every standard visit. Inside the oven and inside the fridge are add-ons, and laundry and dishes are not part of the clean.",
  },
  Calgary: {
    heading: "The Calgary checklist, room by room",
    caption: "Every standard visit in a Calgary home runs on this list. The team works through it in order and stays until each task on it is done.",
  },
} as const;

const rooms = [
  {
    icon: ChefHat,
    title: "Kitchen",
    items: [
      "Countertops & backsplash",
      "Stovetop & exterior of appliances",
      "Sink & taps polished",
      "Cabinet fronts wiped",
      "Floors swept & mopped",
    ],
  },
  {
    icon: Bath,
    title: "Bathrooms",
    items: [
      "Toilets scrubbed inside & out",
      "Tubs, showers & tile scrubbed",
      "Mirrors & glass streak-free",
      "Counters & sinks wiped down",
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
      "Garbage taken out",
    ],
  },
  {
    icon: Sofa,
    title: "Living Areas",
    items: [
      "Dusting furniture & shelves",
      "Vacuum carpets & rugs",
      "Hard floors mopped",
      // No light switches or cobwebs here: both belong to the deep package (owner, 2026-09-10).
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
            <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2">{COPY[city].heading}</h2>
            <span className={`rule-draw mt-4 ${heading.className}`} aria-hidden="true" />
            <p className="mt-4 max-w-[45ch] leading-relaxed text-muted-foreground">{COPY[city].caption}</p>
            <ThresholdLine className="mt-6 hidden max-w-[220px] lg:block" />
            <Link
              to="/whats-included/"
              className="mt-6 inline-flex min-h-[44px] items-center font-semibold text-primary hover:underline"
            >
              The full standard cleaning checklist <span className="dc-icon dc-icon-external-link ml-1 h-4 w-4" aria-hidden="true" />
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
                  /* Below md the three fixed tracks reserved 40px + 176px +
                     32px of gaps at every width, leaving the checklist about
                     80px on a 360px phone — the item text ran off the right
                     edge and could not be scrolled to, because the overflow
                     was on the document rather than a scroll container. The
                     number and title sit side by side on mobile and the list
                     spans the full width beneath them. */
                  className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-4 border-t border-border py-6 first:border-t-0 first:pt-0 md:grid-cols-[2.5rem_minmax(0,11rem)_minmax(0,1fr)] md:gap-6 md:py-7"
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
                  <ul className="col-span-2 grid gap-x-8 gap-y-2 pt-1 sm:grid-cols-2 md:col-span-1">
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
