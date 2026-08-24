interface ThresholdLineProps {
  /** "light" for use on dark navy fields, "dark" for paper/cream fields. */
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Signature threshold motif — a fine, slightly imperfect contour suggesting a
 * doorway edge or folded linen. Purely decorative: low contrast, never behind
 * body text, and hidden from assistive tech.
 */
export default function ThresholdLine({ tone = "dark", className = "" }: ThresholdLineProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1200 24"
      preserveAspectRatio="none"
      className={`motif-linen pointer-events-none h-6 w-full ${
        tone === "light" ? "text-brand-navy-foreground" : "text-brand-navy"
      } ${className}`}
    >
      <path
        d="M0 17 C 180 17, 240 8, 420 8 L 780 8 C 960 8, 1020 17, 1200 17"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M0 21 C 200 21, 250 13, 430 13 L 770 13 C 950 13, 1000 21, 1200 21"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeOpacity="0.55"
        strokeLinecap="round"
      />
    </svg>
  );
}
