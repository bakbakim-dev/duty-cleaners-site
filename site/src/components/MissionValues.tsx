import { Clock, Heart, Shield, Star, type LucideIcon } from "lucide-react";
import { Accent, AccentGold } from "@/components/Accent";

type City = "Edmonton" | "Calgary";

interface Value {
  icon: LucideIcon;
  label: string;
  title: string;
  desc: (city: City) => string;
}

const values: Value[] = [
  {
    icon: Shield,
    label: "Safety",
    title: "Customer-Rated Cleaners",
    desc: () =>
      "Safety is our priority. We accept less than 5% of applicants. Every cleaner undergoes a strict 5-step vetting process including identity verification, reference audits, and online interviews.",
  },
  {
    icon: Star,
    label: "Craft",
    title: "Excellence in Every Detail",
    desc: () =>
      "From baseboards to ceiling fans, we approach every job with meticulous attention to detail. Our checklist is a promise that nothing gets overlooked.",
  },
  {
    icon: Clock,
    label: "Dependability",
    title: "Reliability You Can Count On",
    desc: () =>
      "We arrive prepared, follow the agreed priorities, and keep the work focused on your home\u2019s needs.",
  },
  {
    icon: Heart,
    label: "Local",
    title: "Community First",
    desc: (city) =>
      city === "Edmonton"
        ? "Edmonton isn't just where we work\u2014it's where we live and raise our families. From cheering on the Oilers at Rogers Place to enjoying the River Valley trails, we're proud to be part of this community and employ local residents."
        : "Calgary isn't just where we work\u2014it's where we live and raise our families. From cheering on the Flames at the Saddledome to enjoying the Bow River pathways, we're proud to be part of this community and employ local residents.",
  },
];

export function MissionValues({ city }: { city: City }) {
  const headingId = `mission-values-${city.toLowerCase()}`;

  return (
    <section className="bg-secondary/30 py-16 md:py-24" aria-labelledby={headingId}>
      <div className="container mx-auto px-4">
        {/* Mission panel */}
        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-brand-gold/30 bg-brand-navy px-6 py-12 text-center shadow-xl shadow-primary/10 md:px-14 md:py-16">
          <div className="mb-5 flex items-center justify-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
            <span className="h-px w-8 bg-brand-gold/60" aria-hidden="true" />
            <span>Our Mission</span>
            <span className="h-px w-8 bg-brand-gold/60" aria-hidden="true" />
          </div>
          <h2
            id={headingId}
            className="mx-auto max-w-3xl text-3xl font-bold leading-tight text-white md:text-5xl"
          >
            Making {city} homes cleaner, <AccentGold>lives easier.</AccentGold>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            At Duty Cleaners, our mission is simple: to provide exceptional cleaning services that give {city} families
            more time for what matters most. We believe that a clean home isn't just about appearances&mdash;it's about
            creating a healthy, comfortable space where memories are made and life is lived.
          </p>
        </div>

        {/* Values */}
        <div className="mx-auto mt-14 max-w-3xl text-center md:mt-20">
          <div className="mb-4 flex items-center justify-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
            <span>Our Values</span>
            <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
          </div>
          <h3 className="text-2xl font-bold leading-tight text-foreground md:text-4xl">
            The standards behind <Accent>every clean.</Accent>
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Four principles that shape who we send to your door and how the work gets done.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 md:mt-12 md:grid-cols-2 lg:gap-8">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <article
                key={value.title}
                className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white p-6 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-brand-gold/60 hover:shadow-xl hover:shadow-primary/10 md:p-7"
              >
                <span
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-brand-gold transition-transform duration-300 ease-out group-hover:scale-x-100"
                  aria-hidden="true"
                />
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-navy text-brand-gold transition-colors duration-300 group-hover:bg-brand-gold group-hover:text-brand-navy">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.14em] text-accent">{value.label}</p>
                <h4 className="mb-2 text-lg font-bold text-foreground">{value.title}</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">{value.desc(city)}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
