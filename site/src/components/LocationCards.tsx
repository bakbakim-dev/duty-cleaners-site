/**
 * The two card components every location page draws its service grid and its
 * "why us" row with. Until 2026-09-18 each of the 150 files under
 * src/pages/locations/ carried its own copy of both (identical apart from line
 * breaks), and LocationPageTemplate a third. The data they show lives in
 * data/location-cards.tsx; read the note at the top of that file before
 * giving a card a description.
 */
import type { ElementType, ReactNode } from "react";
import { Link } from "react-router-dom";

export const ServiceCard = ({
  icon: Icon,
  title,
  description,
  to,
  linkText,
}: {
  icon: ElementType;
  title: string;
  /** Location cards carry none: the service page says what the service includes. */
  description?: string;
  to?: string;
  linkText?: string;
}) => (
  <div
    className="group bg-white rounded-xl border border-border p-6 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-xl"
    style={{ transformStyle: "preserve-3d" }}
  >
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:rotate-12">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
    {description ? <p className="text-muted-foreground text-sm leading-relaxed">{description}</p> : null}
    {to && linkText && (
      <Link
        to={to}
        className="mt-2 inline-flex min-h-[44px] items-center font-semibold text-primary transition-colors hover:text-accent"
      >
        {linkText}
        <span className="dc-icon dc-icon-arrow-right ml-1.5 h-4 w-4" aria-hidden="true" />
      </Link>
    )}
  </div>
);

export const WhyUsCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: ElementType;
  title: string;
  description?: ReactNode;
}) => (
  <div
    className="group bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 text-center transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-xl"
    style={{ transformStyle: "preserve-3d" }}
  >
    <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:rotate-12">
      <Icon className="w-7 h-7 text-accent" />
    </div>
    <h3 className={`text-xl font-bold text-white ${description ? "mb-3" : ""}`}>{title}</h3>
    {description ? <p className="text-white/80 text-sm leading-relaxed">{description}</p> : null}
  </div>
);
