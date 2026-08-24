import { Accessibility, ArrowRight, Baby, Briefcase, Building2, Home, PawPrint, type LucideIcon } from "lucide-react";
import { Accent } from "@/components/Accent";

type City = "Edmonton" | "Calgary";

interface Persona {
  icon: LucideIcon;
  label: string;
  title: string;
  desc: (city: City) => string;
}

const personas: Persona[] = [
  {
    icon: Briefcase,
    label: "For packed schedules",
    title: "Busy Professionals",
    desc: () =>
      "Come home to a clean house after a long workday. We handle the cleaning ahead of time so you can relax and enjoy your evenings and weekends stress-free.",
  },
  {
    icon: Baby,
    label: "For growing families",
    title: "Families With Kids",
    desc: (city) =>
      `A safe, sanitized home for little ones. Non-toxic products and detail-focused cleaning families across ${city} trust.`,
  },
  {
    icon: PawPrint,
    label: "For furry households",
    title: "Pet Owners",
    desc: () =>
      "Pet hair, dander, and paw prints — handled. We keep your home fresh without disrupting your furry family members.",
  },
  {
    icon: Accessibility,
    label: "For comfortable living",
    title: "Seniors",
    desc: () =>
      "Friendly, respectful service for older adults who want to enjoy a spotless home without the physical strain.",
  },
  {
    icon: Building2,
    label: "For turnovers & units",
    title: "Property Managers",
    desc: (city) =>
      `Reliable turnover cleaning for landlords and property managers. Consistent quality across multiple ${city} units.`,
  },
  {
    icon: Home,
    label: "For everyone else",
    title: "Everyday Homeowners",
    desc: () =>
      "For anyone who simply wants a clean, comfortable home without the stress of keeping up with it all.",
  },
];

const cityCopy: Record<City, { demonym: string; homesStat: string }> = {
  Edmonton: { demonym: "Edmontonians", homesStat: "4,000+ Edmonton homes cleaned" },
  Calgary: { demonym: "Calgarians", homesStat: "1,000+ Calgary homes cleaned" },
};

export function WhoWeHelp({ city }: { city: City }) {
  const copy = cityCopy[city];

  return (
    <section id="who-we-help" className="bg-white py-16 md:py-24" aria-labelledby={`who-we-help-${city.toLowerCase()}`}>
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <div className="mb-4 flex items-center justify-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
            <span>Who We Help</span>
            <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
          </div>
          <h2 id={`who-we-help-${city.toLowerCase()}`} className="text-3xl font-bold leading-tight text-foreground md:text-5xl">
            Perfect for busy {city} homes. <Accent>Whatever your days look like.</Accent>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Trusted by {copy.demonym} at every stage of life — from packed schedules to growing families and everything in between.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {personas.map((persona) => {
            const Icon = persona.icon;
            return (
              <article
                key={persona.title}
                className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white p-6 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-brand-gold/60 hover:shadow-xl hover:shadow-primary/10 md:p-7"
              >
                <span
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-brand-gold transition-transform duration-300 ease-out group-hover:scale-x-100"
                  aria-hidden="true"
                />
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-navy text-brand-gold transition-colors duration-300 group-hover:bg-brand-gold group-hover:text-brand-navy">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.14em] text-accent">{persona.label}</p>
                <h3 className="mb-2 text-lg font-bold text-foreground">{persona.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{persona.desc(city)}</p>
              </article>
            );
          })}
        </div>

        <div className="mx-auto mt-12 flex max-w-4xl flex-col items-center gap-5 text-center">
          <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm font-medium text-muted-foreground">
            {[copy.homesStat, "Non-toxic products", "Vetted cleaners"].map((item, i) => (
              <li key={item} className="flex items-center gap-3">
                {i > 0 && <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" aria-hidden="true" />}
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <a
            href="#quote-form"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-bold text-accent-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-md"
          >
            See your price in 60 seconds
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
