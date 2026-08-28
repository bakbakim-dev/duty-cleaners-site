import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { Accent } from "@/components/Accent";
import type { CityLocation } from "@/data/city-locations";

interface CityCoverageGridProps {
  city: string;
  neighbourhoods: CityLocation[];
  surrounding: CityLocation[];
  viewAllTo?: string;
}

const PREVIEW_COUNT = 18;

function Chip({ name, to }: CityLocation) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white rounded-full border border-border text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent hover:shadow-md"
    >
      <MapPin className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
      {name}
    </Link>
  );
}

/**
 * "Covering all of {City}" — full neighbourhood + surrounding-community chip
 * grid that internal-links to every location page (silo strategy).
 */
export default function CityCoverageGrid({
  city,
  neighbourhoods,
  surrounding,
  viewAllTo = "/locations",
}: CityCoverageGridProps) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? neighbourhoods : neighbourhoods.slice(0, PREVIEW_COUNT);
  const hiddenCount = neighbourhoods.length - PREVIEW_COUNT;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold">
          Covering all of <Accent>{city}</Accent>
        </h3>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Vetted cleaners in every corner of the city — and the communities around it.
        </p>
      </div>

      <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-3">
        {city} Neighborhoods
      </p>
      <div className="flex flex-wrap gap-2.5">
        {shown.map((loc) => (
          <Chip key={loc.to} {...loc} />
        ))}
        {hiddenCount > 0 && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-dashed border-accent/60 text-sm font-semibold text-accent transition-colors hover:bg-accent/10"
          >
            {expanded ? (
              <>
                Show fewer <ChevronUp className="w-4 h-4" aria-hidden="true" />
              </>
            ) : (
              <>
                Show all {neighbourhoods.length} areas <ChevronDown className="w-4 h-4" aria-hidden="true" />
              </>
            )}
          </button>
        )}
      </div>

      <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mt-8 mb-3">
        Surrounding Communities
      </p>
      <div className="flex flex-wrap gap-2.5">
        {surrounding.map((loc) => (
          <Chip key={loc.to} {...loc} />
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          to={viewAllTo}
          className="inline-flex items-center gap-2 font-semibold text-primary hover:text-accent transition-colors"
        >
          View all service locations
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
