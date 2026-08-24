import { useEffect, useState } from "react";
import { Star, Zap, ShieldCheck, BadgeCheck, Clock } from "lucide-react";
import { captureTrackingParams, getQuoteServiceLabel } from "@/lib/tracking";

const GoogleMark = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.223 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
    />
  </svg>
);

const MICRO_BADGES = [
  { icon: ShieldCheck, label: "Pay After Your Clean" },
  { icon: BadgeCheck, label: "Customer-Rated Cleaners" },
  { icon: Clock, label: "24-Hour Re-Clean Promise" },
];

/**
 * Conversion header rendered at the top of the city quote-form card.
 * Places the Google rating, a personalized "your price in 60 seconds" line,
 * and risk-reversal micro-badges directly adjacent to the booking action.
 */
const QuoteFormIntro = () => {
  // Re-capture on mount so SPA deep links (/?service=...#quote) are stored.
  useEffect(() => {
    captureTrackingParams();
  }, []);

  /**
   * On short desktop screens the whole quote form is scaled to fit the
   * viewport (see QuoteFormEmbed), and every pixel of vertical chrome costs
   * form size. The badge row therefore hides on desktop screens under
   * 1000px tall — the Google rating line and 60-second price line stay.
   * Mobile keeps the badges (the form scrolls naturally there anyway).
   */
  const [isShortDesktop, setIsShortDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (max-height: 999px)");
    const update = () => setIsShortDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const serviceLabel = getQuoteServiceLabel();

  return (
    <div className="mb-3 border-b border-border px-1 pb-5 pt-1">
      {/* Google rating at the exact decision point */}
      <div className="mb-3 flex items-center justify-center gap-2">
        <GoogleMark className="h-5 w-5" />
        <span className="flex gap-0.5" aria-hidden="true">
          {[...Array(5)].map((_, index) => (
            <Star key={index} className="h-4 w-4 fill-brand-gold text-brand-gold" />
          ))}
        </span>
        <span className="text-sm font-semibold text-foreground">Five-Star Rated on Google</span>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-foreground">
          <span className="text-brand-gold">
            {serviceLabel ? `Your ${serviceLabel} price` : "Your price"}
          </span>{" "}
          — ready in 60 seconds
        </p>
        <Zap className="h-5 w-5 text-brand-gold" aria-hidden="true" />
      </div>

      {/* Risk-reversal micro-badges beside the booking action */}
      <div className={`mt-3 flex-wrap justify-center gap-2 ${isShortDesktop ? "hidden" : "flex"}`}>
        {MICRO_BADGES.map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-3.5 py-2 text-sm font-semibold text-muted-foreground"
          >
            <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default QuoteFormIntro;
