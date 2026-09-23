import { formatPrice } from "@/data/pricing";
import { useCountUp } from "@/lib/use-count-up";

/**
 * A price that rolls to its new value when an answer changes it. The rolling
 * digits are hidden from assistive technology; the final figure is read out.
 */
export default function RollingPrice({
  value,
  className,
  reveal = false,
}: {
  value: number;
  className?: string;
  /** Count up from zero when first shown: the price reveal. */
  reveal?: boolean;
}) {
  const shown = useCountUp(value, reveal ? 650 : 450, reveal ? 0 : undefined);
  return (
    <span className={className}>
      <span aria-hidden="true" className="tabular-nums">
        {formatPrice(Math.round(shown * 100) / 100)}
      </span>
      <span className="sr-only">{formatPrice(value)}</span>
    </span>
  );
}
