import { formatPrice } from "@/data/pricing";
import { useCountUp } from "@/lib/use-count-up";

/**
 * A price that rolls to its new value when an answer changes it. The rolling
 * digits are hidden from assistive technology; the final figure is read out.
 */
export default function RollingPrice({ value, className }: { value: number; className?: string }) {
  const shown = useCountUp(value);
  return (
    <span className={className}>
      <span aria-hidden="true" className="tabular-nums">
        {formatPrice(Math.round(shown * 100) / 100)}
      </span>
      <span className="sr-only">{formatPrice(value)}</span>
    </span>
  );
}
