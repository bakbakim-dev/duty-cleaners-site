import { COMPANY } from "@/data/proof";
import { POLICY } from "@/data/policy";

/**
 * Editorial stat band — four oversized serif figures with hairline tops and
 * quiet captions. Every number is a real, already-published claim; nothing
 * here is invented (see src/data/proof.ts policy).
 *
 * The captions come in two voices because both hubs render this band and the
 * money-page contract caps how much of the Calgary hub may repeat the
 * Edmonton one. The figures do not change between cities; only the wording.
 */
const STATS = {
  Edmonton: [
    { value: "$0", caption: "Charged today. Your card is only charged once the clean is done." },
    { value: String(COMPANY.foundedYear), caption: "Cleaning Alberta homes since." },
    { value: "60s", caption: "From first question to a real dollar price for your home." },
    { value: `${POLICY.guaranteeWindowHours}h`, caption: "Make-it-right window. Tell us and we return at no charge." },
  ],
  Calgary: [
    { value: "$0", caption: "Due at booking. The card is charged after the clean, not before it." },
    { value: String(COMPANY.foundedYear), caption: "The year we started cleaning homes in Alberta." },
    { value: "60s", caption: "About how long the form takes to put a real price on your home." },
    { value: `${POLICY.guaranteeWindowHours}h`, caption: "To tell us about anything missed. We come back and redo it at no charge." },
  ],
} as const;

export default function StatBand({ city = "Edmonton" }: { city?: "Edmonton" | "Calgary" }) {
  return (
    <section className="band band-white band-hairline" aria-label="Duty Cleaners by the numbers">
      <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-6xl gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {STATS[city].map(({ value, caption }) => (
            <div key={value} className="border-t border-border pt-5">
              <p className="display-serif text-5xl font-bold tracking-tight text-foreground md:text-6xl">
                {value}
              </p>
              <p className="mt-3 max-w-[24ch] text-sm leading-relaxed text-muted-foreground">{caption}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
