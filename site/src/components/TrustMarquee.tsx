interface TrustMarqueeProps {
  items?: string[];
  className?: string;
}

const defaultItems = [
  "Customer-Rated Cleaners",
  "Non-Toxic Products",
  "24-Hour Re-Clean Promise",
  "Serving Alberta since 2017",
  "4.9 on Google",
  "High Quality Supplies",
  "Pay After Your Clean",
];

function MarqueeRow({ items, ariaHidden }: { items: string[]; ariaHidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden || undefined}>
      {items.map((item) => (
        <span key={item} className="flex items-center whitespace-nowrap">
          <span className="px-6 text-sm font-semibold uppercase tracking-[0.18em] text-brand-navy-foreground/90 md:px-8">
            {item}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" aria-hidden="true" />
        </span>
      ))}
    </div>
  );
}

export default function TrustMarquee({ items = defaultItems, className = "" }: TrustMarqueeProps) {
  return (
    <div
      className={`marquee-hover-pause overflow-hidden border-y border-brand-gold/25 bg-brand-navy py-3.5 ${className}`}
      role="presentation"
    >
      <div className="animate-marquee flex w-max">
        <MarqueeRow items={items} />
        <MarqueeRow items={items} ariaHidden />
      </div>
    </div>
  );
}
