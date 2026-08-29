import { withTrailingSlash } from "@/data/legacy-urls";
import { Link, useLocation } from "react-router-dom";
import { Star } from "lucide-react";
import { locationRouteForName } from "@/data/location-directory";
import { cityFromPath } from "@/lib/city-from-path";

interface CoverageChipsProps {
  /** Mixed list: neighbouring communities AND local landmarks/streets. */
  areas: readonly string[];
  /** Visual variant, matching the two chip styles already used across pages. */
  variant?: "default" | "compact";
  className?: string;
}

/**
 * "Nearby areas" chips, with the neighbouring ones actually linked.
 *
 * Every location page lists the communities around it, but until now all 1,065
 * of those chips across the 165 pages were inert <span>s — even when the name
 * was a real, live page sitting in the same folder. That left the location
 * network almost entirely un-interlinked: pages received links from the hub and
 * sent none onward.
 *
 * A chip becomes a <Link> only when its name resolves to a registered route
 * (see src/data/location-directory.ts). Landmarks and streets — "Rundle Park",
 * "118 Avenue" — have no page and stay plain text, so we never ship a dead link.
 */
export default function CoverageChips({ areas, variant = "default", className = "" }: CoverageChipsProps) {
  // Chips resolve against the city this page belongs to. Several place names
  // exist in both markets, so an unscoped lookup sent Calgary visitors to
  // Edmonton pages ("Downtown", "Inglewood", "Westmount" and friends).
  const { pathname } = useLocation();
  const city = cityFromPath(pathname);
  const base =
    variant === "compact"
      ? "bg-white/70 border border-border rounded-full px-4 py-2 text-sm text-foreground flex items-center gap-2"
      : "bg-white/70 border border-border rounded-full px-4 py-2 text-sm text-foreground font-medium flex items-center gap-1.5";

  return (
    <div className={`flex flex-wrap justify-center gap-3 ${className}`}>
      {areas.map((area) => {
        const to = locationRouteForName(area, city);
        const icon = <Star className="w-3 h-3 text-amber-400 shrink-0" aria-hidden="true" />;

        if (!to) {
          return (
            <span key={area} className={base}>
              {icon}
              {area}
            </span>
          );
        }
        return (
          <Link
            key={area}
            to={withTrailingSlash(to)}
            className={`${base} transition-colors hover:border-primary hover:text-primary`}
          >
            {icon}
            {area}
          </Link>
        );
      })}
    </div>
  );
}
