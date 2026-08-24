import { Link, useLocation } from "react-router-dom";
import { canonicalForPath } from "@/data/legacy-urls";
import { cityFromPath } from "@/lib/city-from-path";
import ThresholdLine from "@/components/ThresholdLine";
import type { ReactNode } from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Phone,
  Clock,
  Youtube,
  Linkedin,
  Shield,
  Lock,
  ArrowUpRight,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GOOGLE_LISTINGS, openGoogleListing } from "@/lib/google-listings";

const serviceGroups = {
  residential: [
    ["Standard House Cleaning", "regular-cleaning"],
    ["Deep Cleaning", "deep-cleaning"],
    ["Move In/Out Cleaning", "move-in-move-out-cleaning"],
  ],
  specialty: [
    ["Post-Construction", "post-construction-cleaning"],
    ["Commercial Cleaning", "commercial-cleaning"],
  ],
};

const socialLinks = [
  { label: "Duty Cleaners Facebook", href: "https://www.facebook.com/dutycleaners/", icon: Facebook },
  { label: "Duty Cleaners Instagram", href: "https://www.instagram.com/dutycleaners/", icon: Instagram },
  { label: "Duty Cleaners X", href: "https://x.com/Dutycleaners", icon: Twitter },
  { label: "Duty Cleaners YouTube", href: "https://www.youtube.com/@dutycleaners2795", icon: Youtube },
  { label: "Duty Cleaners LinkedIn", href: "https://www.linkedin.com/company/duty-cleaners/", icon: Linkedin },
];

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-5 flex min-h-11 items-center text-sm font-bold uppercase tracking-[0.14em] text-brand-navy-foreground">
      {children}
    </h3>
  );
}

function FooterLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="group flex min-h-12 items-center text-sm text-brand-navy-foreground/85 transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
    >
      <span className="transition-transform duration-200 group-hover:translate-x-1">{children}</span>
    </Link>
  );
}

export default function Footer() {
  const { pathname } = useLocation();
  // Canonical-aware: the Calgary landing page's canonical URL is
  // /cleaning-services-calgary/, which a startsWith("/calgary") test misses.
  const city = cityFromPath(pathname);
  const quoteHref = `${city === "calgary" ? canonicalForPath("/calgary") : "/"}#quote`;
  // The footer CTA must call the office the visitor is actually looking at.
  const cityPhone =
    city === "calgary"
      ? { tel: "4037681341", display: "(403) 768-1341" }
      : { tel: "7809136565", display: "(780) 913-6565" };


  return (
    <footer className="border-t border-brand-navy-foreground/10 bg-brand-navy text-brand-navy-foreground">
      <ThresholdLine tone="light" className="mx-auto max-w-md pt-6" />
      <div className="container mx-auto px-4 py-14 sm:py-16 lg:py-20">
        {/* Closing conversion band */}
        <div className="mb-14 flex flex-col gap-6 border-b border-brand-navy-foreground/15 pb-12 md:flex-row md:items-center md:justify-between lg:mb-16 lg:pb-14">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold">Ready when you are</p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">A cleaner home starts with a simple quote.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-brand-navy-foreground/85 sm:text-base">
              Tell us what your home needs and we’ll help you choose the right cleaning service for your space.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
            <Button
              asChild
              className="min-h-12 bg-accent px-6 text-accent-foreground shadow-sm hover:bg-accent/90"
            >
              <Link to={quoteHref}>
                See My Instant Price
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="min-h-12 border-brand-navy-foreground/30 px-6 text-brand-navy-foreground hover:border-brand-gold hover:bg-brand-gold/10 hover:text-brand-gold"
            >
              <a href={`tel:${cityPhone.tel}`}>
                <Phone aria-hidden="true" />
                Call {cityPhone.display}
              </a>

            </Button>
          </div>
        </div>

        {/* Trust and review proof */}
        <div className="mb-14 border-b border-brand-navy-foreground/15 pb-12 lg:mb-16 lg:pb-14">
          <div className="mb-8 flex flex-col gap-2 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold">Why homeowners choose us</p>
              <h2 className="mt-2 text-xl font-bold sm:text-2xl">Trusted locally. Built around care.</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-brand-navy-foreground/85">
              Customer-rated cleaners, connected to the local communities we serve.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <a href="https://www.bbb.org/ca/ab" target="_blank" rel="nofollow noopener noreferrer" className="group flex min-h-16 items-center justify-center gap-2 rounded-lg border border-brand-navy-foreground/15 bg-brand-navy-foreground/5 px-3 text-brand-navy-foreground/85 transition-all hover:border-brand-gold/60 hover:bg-brand-navy-foreground/10 hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold">
              <Shield className="h-5 w-5 shrink-0 text-brand-gold" aria-hidden="true" />
              <span className="text-left text-xs leading-tight"><strong className="block text-brand-navy-foreground">BBB</strong>Accredited</span>
            </a>
            <a href="https://business.edmontonchamber.com/" target="_blank" rel="nofollow noopener noreferrer" className="group flex min-h-16 items-center justify-center rounded-lg border border-brand-navy-foreground/15 bg-brand-navy-foreground/5 px-3 text-center text-xs font-semibold leading-tight text-brand-navy-foreground/85 transition-all hover:border-brand-gold/60 hover:bg-brand-navy-foreground/10 hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold">Edmonton Chamber<br />of Commerce</a>
            <a href="https://www.calgarychamber.com/" target="_blank" rel="nofollow noopener noreferrer" className="group flex min-h-16 items-center justify-center rounded-lg border border-brand-navy-foreground/15 bg-brand-navy-foreground/5 px-3 text-center text-xs font-semibold leading-tight text-brand-navy-foreground/85 transition-all hover:border-brand-gold/60 hover:bg-brand-navy-foreground/10 hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold">Calgary Chamber<br />of Commerce</a>
            <div className="flex min-h-16 items-center justify-center gap-2 rounded-lg border border-brand-navy-foreground/15 bg-brand-navy-foreground/5 px-3 text-xs font-semibold leading-tight text-brand-navy-foreground/85"><Shield className="h-5 w-5 shrink-0 text-brand-gold" aria-hidden="true" /><span>Pay After<br />Your Clean</span></div>
            <div className="flex min-h-16 items-center justify-center gap-2 rounded-lg border border-brand-navy-foreground/15 bg-brand-navy-foreground/5 px-3 text-xs font-semibold leading-tight text-brand-navy-foreground/85"><Lock className="h-5 w-5 shrink-0 text-brand-gold" aria-hidden="true" /><span>Secure<br />Payments</span></div>
          </div>

          <div className="mt-10">
            <p className="mb-5 text-center text-sm font-semibold uppercase tracking-[0.2em] text-brand-navy-foreground/85">Review platforms</p>
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 lg:grid-cols-4">
              <a href={GOOGLE_LISTINGS.edmonton.reviewsUrl} target="_blank" rel="nofollow noopener noreferrer" onClick={(event) => openGoogleListing(event, GOOGLE_LISTINGS.edmonton.reviewsUrl)} className="group flex min-h-16 items-center justify-center gap-2.5 rounded-lg border border-brand-navy-foreground/15 bg-brand-navy-foreground/5 px-3 text-brand-navy-foreground/85 transition-all hover:border-brand-gold/60 hover:bg-brand-navy-foreground/10 hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold" aria-label="Edmonton Google Business Profile">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-navy-foreground text-xs font-bold text-brand-navy">G</span>
                <span className="text-left text-xs leading-tight"><strong className="block text-brand-navy-foreground">Edmonton</strong>Google Reviews</span>
              </a>
              <a href={GOOGLE_LISTINGS.calgary.reviewsUrl} target="_blank" rel="nofollow noopener noreferrer" onClick={(event) => openGoogleListing(event, GOOGLE_LISTINGS.calgary.reviewsUrl)} className="group flex min-h-16 items-center justify-center gap-2.5 rounded-lg border border-brand-navy-foreground/15 bg-brand-navy-foreground/5 px-3 text-brand-navy-foreground/85 transition-all hover:border-brand-gold/60 hover:bg-brand-navy-foreground/10 hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold" aria-label="Calgary Google Business Profile">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-navy-foreground text-xs font-bold text-brand-navy">G</span>
                <span className="text-left text-xs leading-tight"><strong className="block text-brand-navy-foreground">Calgary</strong>Google Reviews</span>
              </a>
              <a href="https://www.yelp.ca/biz/duty-cleaners-edmonton" target="_blank" rel="nofollow noopener noreferrer" className="group flex min-h-16 items-center justify-center gap-2.5 rounded-lg border border-brand-navy-foreground/15 bg-brand-navy-foreground/5 px-3 text-brand-navy-foreground/85 transition-all hover:border-brand-gold/60 hover:bg-brand-navy-foreground/10 hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold" aria-label="Duty Cleaners Edmonton on Yelp">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-navy-foreground text-xs font-bold text-brand-navy">Y</span>
                <span className="text-left text-xs leading-tight"><strong className="block text-brand-navy-foreground">Edmonton</strong>Yelp Reviews</span>
              </a>
              <a href="https://www.yelp.ca/biz/duty-cleaners-calgary-calgary?osq=Duty+Cleaners+Calgary" target="_blank" rel="nofollow noopener noreferrer" className="group flex min-h-16 items-center justify-center gap-2.5 rounded-lg border border-brand-navy-foreground/15 bg-brand-navy-foreground/5 px-3 text-brand-navy-foreground/85 transition-all hover:border-brand-gold/60 hover:bg-brand-navy-foreground/10 hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold" aria-label="Duty Cleaners Calgary on Yelp">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-navy-foreground text-xs font-bold text-brand-navy">Y</span>
                <span className="text-left text-xs leading-tight"><strong className="block text-brand-navy-foreground">Calgary</strong>Yelp Reviews</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_1fr_1.2fr] lg:gap-10">
          <div>
            <Link to="/" className="inline-flex rounded bg-brand-gold px-4 py-2 text-xl font-bold text-brand-gold-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy">DUTY CLEANERS</Link>
            <p className="mt-4 text-sm font-medium text-brand-gold">Serving Alberta since 2017</p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-brand-navy-foreground/85">Professional cleaning services for Alberta homes and businesses, delivered by vetted cleaners.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-navy-foreground/15 text-brand-navy-foreground/85 transition-colors hover:border-brand-gold hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold" aria-label={label}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <FooterHeading>Explore</FooterHeading>
            <nav aria-label="Footer navigation">
              <FooterLink to="/about-us">About Us</FooterLink>
              <FooterLink to="/locations">All Locations</FooterLink>
              <FooterLink to={`/${city}/services`}>Services</FooterLink>
              <FooterLink to={`/${city}/pricing`}>Pricing</FooterLink>
              <FooterLink to="/reviews">Reviews</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
              <FooterLink to="/faqs">FAQ</FooterLink>
              <FooterLink to="/prepare">Getting Ready</FooterLink>
              <FooterLink to="/gift-card">Gift Cards</FooterLink>
              <FooterLink to="/contact-us">Contact</FooterLink>
            </nav>
          </div>

          <div>
            <FooterHeading>Cleaning services</FooterHeading>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-brand-gold">Residential</p>
            <nav aria-label="Residential cleaning services">
              {serviceGroups.residential.map(([label, path]) => <FooterLink key={path} to={`/${city}/${path}`}>{label}</FooterLink>)}
            </nav>
            <p className="mb-2 mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-brand-gold">Specialty</p>
            <nav aria-label="Specialty cleaning services">
              {serviceGroups.specialty.map(([label, path]) => (
                <FooterLink
                  key={path}
                  to={
                    path === "commercial-cleaning"
                      ? city === "calgary"
                        ? "/calgary/commercial-cleaning"
                        : "/commercial-cleaning"
                      : `/${city}/${path}`
                  }
                >
                  {label}
                </FooterLink>
              ))}
              {city !== "calgary" && (
                <FooterLink to="/edmonton/march-out-cleaning">March Out Cleaning</FooterLink>
              )}
            </nav>
          </div>

          <div>
            <FooterHeading>Locations & contact</FooterHeading>
            <div className="space-y-6">
              <div>
                <Link to="/" className="group flex min-h-12 items-center gap-2 font-semibold transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"><MapPin className="h-4 w-4 text-brand-gold" aria-hidden="true" /><span>Edmonton Office</span></Link>
                <a href="tel:7809136565" className="flex min-h-12 items-center gap-2 text-sm text-brand-navy-foreground/85 transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"><Phone className="h-4 w-4" aria-hidden="true" />(780) 913-6565</a>
                <p className="text-sm leading-6 text-brand-navy-foreground/85">18615 71 Ave NW<br />Edmonton, AB T5T 2V9</p>
              </div>
              <div>
                <Link to="/cleaning-services-calgary" className="group flex min-h-12 items-center gap-2 font-semibold transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"><MapPin className="h-4 w-4 text-brand-gold" aria-hidden="true" /><span>Calgary Office</span></Link>
                <a href="tel:4037681341" className="flex min-h-12 items-center gap-2 text-sm text-brand-navy-foreground/85 transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"><Phone className="h-4 w-4" aria-hidden="true" />(403) 768-1341</a>
                <p className="text-sm leading-6 text-brand-navy-foreground/85">2835 37 Street SW #24<br />Calgary, Alberta</p>
              </div>
              <div className="border-t border-brand-navy-foreground/15 pt-5">
                <div className="flex min-h-12 items-center gap-2 font-semibold"><Clock className="h-4 w-4 text-brand-gold" aria-hidden="true" /><span>Hours</span></div>
                <div className="space-y-1 text-sm leading-6 text-brand-navy-foreground/85">
                  <div className="flex justify-between gap-3"><span>Mon – Sat</span><span>8:00am – 8:00pm</span></div>
                  <div className="flex justify-between gap-3"><span>Sunday</span><span>9:00am – 3:00pm</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-brand-navy-foreground/15 pt-8 lg:mt-16">
          <div className="flex flex-col gap-5 text-sm md:flex-row md:items-center md:justify-between">
            <p className="text-center text-brand-navy-foreground/85 md:text-left">© {new Date().getFullYear()} Duty Cleaners. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 md:justify-end">
              <Link to="/satisfaction-guarantee" className="text-brand-navy-foreground/85 transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold">Satisfaction Guarantee</Link>
              <Link to="/privacy-policy" className="text-brand-navy-foreground/85 transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold">Privacy Policy</Link>
              {/* Plain anchor: /sitemap.xml is a real static file, not a React route. */}
              <a href="/sitemap.xml" className="text-brand-navy-foreground/85 transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
