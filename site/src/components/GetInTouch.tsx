import { Link } from "react-router-dom";
import { canonicalForPath } from "@/data/legacy-urls";
import { DollarSign, Star, MessageSquare, Mail, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hoursRowsFor } from "@/data/proof";

interface GetInTouchProps {
  city: "Edmonton" | "Calgary";
}

const CITY_DATA = {
  Edmonton: {
    phoneDisplay: "(780) 913-6565",
    phoneHref: "tel:7809136565",
    address: "18615 71 Ave NW, Edmonton, AB",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=18615+71+Ave+NW+Edmonton+AB",
    pricingPath: canonicalForPath("/edmonton/pricing"),
  },
  Calgary: {
    phoneDisplay: "(403) 768-1341",
    phoneHref: "tel:4037681341",
    address: "2835 37 Street SW #24, Calgary, AB",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=2835+37+Street+SW+%2324+Calgary+AB",
    pricingPath: "/calgary/pricing/",
  },
} as const;

const GetInTouch = ({ city }: GetInTouchProps) => {
  const data = CITY_DATA[city];
  // One hours format on the page, read from proof.ts like the footer's.
  const hours = hoursRowsFor(city === "Calgary" ? "calgary" : "edmonton");

  const quickLinks = [
    { to: data.pricingPath, icon: DollarSign, label: "View Pricing", hint: "Flat prices by home size, before GST" },
    { to: "/reviews/", icon: Star, label: "Read Reviews", hint: "Rated 4.9 on Google" },
    { to: canonicalForPath("/faq"), icon: MessageSquare, label: "Full FAQ", hint: "Answers to common questions" },
    { to: "/about-us/", icon: Users, label: "About Us", hint: `The company behind the ${city} office` },
  ];

  return (
    <section className="band band-white band-hairline">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="display-serif text-3xl md:text-4xl font-bold text-brand-navy">
            Talk to the {city} office
          </h2>
          <p className="mt-3 text-muted-foreground text-base md:text-lg">
            Call the {city} office, send an email, or check prices, reviews and common questions before you book.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 max-w-5xl mx-auto items-stretch">
          {/* Contact information */}
          <div className="lg:col-span-3 rounded-lg bg-brand-navy text-white p-6 md:p-8 shadow-lg">
            <h3 className="text-xl font-bold">Contact Information</h3>
            <div className="mt-6 space-y-5">
              <a
                href={data.phoneHref}
                className="group flex items-start gap-4 rounded-sm p-3 -m-3 min-h-[48px] transition-colors hover:bg-white/10"
              >
                <span className="w-12 h-12 shrink-0 rounded-sm bg-brand-gold/15 flex items-center justify-center transition-colors group-hover:bg-brand-gold">
                  <span className="dc-icon dc-icon-phone w-5 h-5 text-brand-gold transition-colors group-hover:text-brand-navy" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs uppercase tracking-wider text-white/90">Phone</span>
                  <span className="block text-xl md:text-2xl font-bold">{data.phoneDisplay}</span>
                  <span className="block text-sm text-white/90">Tap to call the {city} office</span>
                </span>
              </a>

              <a
                href={data.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-sm p-3 -m-3 min-h-[48px] transition-colors hover:bg-white/10"
              >
                <span className="w-12 h-12 shrink-0 rounded-sm bg-brand-gold/15 flex items-center justify-center transition-colors group-hover:bg-brand-gold">
                  <span className="dc-icon dc-icon-map-pin w-5 h-5 text-brand-gold transition-colors group-hover:text-brand-navy" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs uppercase tracking-wider text-white/90">Address</span>
                  <span className="block text-lg font-semibold">{data.address}</span>
                  <span className="inline-flex items-center gap-1 text-sm text-accent-on-dark">
                    Open in Google Maps <span className="dc-icon dc-icon-arrow-right w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                </span>
              </a>

              <div className="flex items-start gap-4 p-3 -m-3">
                <span className="w-12 h-12 shrink-0 rounded-sm bg-brand-gold/15 flex items-center justify-center">
                  <span className="dc-icon dc-icon-clock w-5 h-5 text-brand-gold" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs uppercase tracking-wider text-white/90">Hours</span>
                  {hours.map(([days, time]) => (
                    <span key={days} className="block text-lg font-semibold">{days}: {time}</span>
                  ))}
                </span>
              </div>

              <div className="flex items-start gap-4 p-3 -m-3">
                <span className="w-12 h-12 shrink-0 rounded-sm bg-brand-gold/15 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-brand-gold" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs uppercase tracking-wider text-white/90">Email</span>
                  <a
                    href="mailto:support@dutycleaners.ca"
                    className="block text-lg font-semibold break-all hover:text-accent-on-dark transition-colors"
                  >
                    support@dutycleaners.ca
                  </a>
                </span>
              </div>
            </div>

            {/* The shared Button, so this CTA has the same radius as the one in
                the Pricing band. */}
            <Button
              asChild
              size="lg"
              className="mt-8 min-h-[48px] w-full bg-accent text-base font-bold text-accent-foreground hover:bg-accent/90"
            >
              <a href="#quote-form">
                See My Instant Price
                <span className="dc-icon dc-icon-arrow-right ml-2 w-4 h-4" aria-hidden="true" />
              </a>
            </Button>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2 rounded-lg border border-border bg-secondary/30 p-6 md:p-8">
            <h3 className="text-xl font-bold text-brand-navy">Quick Links</h3>
            <p className="mt-1 text-sm text-muted-foreground">Prices, reviews and answers to read before you book.</p>
            <ul className="mt-6 space-y-2">
              {quickLinks.map(({ to, icon: Icon, label, hint }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group flex items-center gap-3 rounded-sm bg-white px-4 py-3 min-h-[48px] border border-transparent transition-colors hover:border-brand-navy/40"
                  >
                    <span className="w-9 h-9 shrink-0 rounded-sm bg-brand-navy/5 flex items-center justify-center transition-colors group-hover:bg-brand-navy/10">
                      <Icon className="w-4 h-4 text-brand-navy" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-foreground leading-tight">{label}</span>
                      <span className="block text-xs text-muted-foreground">{hint}</span>
                    </span>
                    <span className="dc-icon dc-icon-arrow-right w-4 h-4 text-muted-foreground transition-transform motion-safe:group-hover:translate-x-1 group-hover:text-brand-navy" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;
