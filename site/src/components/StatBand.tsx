/**
 * Editorial stat band — four oversized serif figures with hairline tops and
 * quiet captions. Every number is a real, already-published claim; nothing
 * here is invented (see src/data/proof.ts policy).
 */
const STATS = [
  { value: "$0", caption: "Charged today. Your card is only charged once the clean is done." },
  { value: "2017", caption: "Licensed and cleaning Alberta homes since." },
  { value: "60s", caption: "From first question to a real dollar price for your home." },
  { value: "24h", caption: "Make-it-right window. Tell us and we return at no charge." },
];

export default function StatBand() {
  return (
    <section className="band band-white band-hairline" aria-label="Duty Cleaners by the numbers">
      <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-6xl gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map(({ value, caption }) => (
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
