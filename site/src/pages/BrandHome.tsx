import { POLICY } from "@/data/policy";
import { CITY_PROOF } from "@/data/proof";
import { useLocation } from "react-router-dom";
import { quoteHrefFor } from "@/lib/quote-link";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { MapPin, Phone, Star, CheckCircle2, Clock, Shield, Sparkles, Home as HomeIcon, Award, ArrowRight, BadgeCheck, Users, CalendarClock, Briefcase, Heart } from "lucide-react";
import heroCleanHouse from "@/assets/generated/alberta-cleaning-hero-v1.webp";
import heroCleanHouse640 from "@/assets/generated/alberta-cleaning-hero-v1-640w.webp";
import heroCleanHouse960 from "@/assets/generated/alberta-cleaning-hero-v1-960w.webp";
import heroCleanHouse1280 from "@/assets/generated/alberta-cleaning-hero-v1-1280w.webp";
import HonestReviewLink from "@/components/HonestReviewLink";
import { BOOKINGS, BOOKINGS_CLAIM, COMPANY, RATING_CLAIM } from "@/data/proof";
// Every figure here reads from src/data/proof.ts, the single source of truth
// for numeric claims on the site. The two this replaced — "10+ Years Combined
// Experience" and "95% Customer Retention" — did not appear anywhere in that
// file or in llms-full.txt; there was no source for either number.
const stats = [{
  value: "2017",
  label: "Operating in Alberta",
  icon: Clock
}, {
  value: BOOKINGS,
  // Bookings, not homes: the owner's confirmed figure counts every booking,
  // and a recurring customer's home is booked many times over.
  label: "Alberta Bookings",
  icon: HomeIcon
}, {
  value: RATING_CLAIM,
  label: "Edmonton + Calgary Google Rating",
  icon: Star
}, {
  value: `${POLICY.guaranteeWindowHours}-Hour`,
  label: "Re-Clean Guarantee",
  icon: Heart
}];
const services = [{
  icon: Sparkles,
  title: "Standard Cleaning",
  desc: "One visit on the standard checklist, priced flat by home size before GST."
}, {
  icon: CheckCircle2,
  title: "Deep Cleaning",
  desc: "The standard checklist plus the deep-clean package, priced flat by home size."
}, {
  icon: HomeIcon,
  title: "Move In/Out",
  desc: "A clean for the day you move out or before you move in, priced flat by home size."
}, {
  icon: CalendarClock,
  title: "Recurring Service",
  desc: "The standard clean on a schedule: weekly 20% off, bi-weekly 15%, every 4 weeks 10%, from the second visit."
}];
const HERO_SRCSET = [
  `${heroCleanHouse640} 640w`,
  `${heroCleanHouse960} 960w`,
  `${heroCleanHouse1280} 1280w`,
  `${heroCleanHouse} 1672w`,
].join(", ");

// Each branch's count stands alone. Google publishes no combined figure, and
// this card used to print the two added together.
const whyChooseUs = [{
  icon: Shield,
  title: "Pay After Your Clean",
  desc: "Nothing is charged when you book. The day before, a temporary hold confirms the card is valid, and the card is charged once the clean is complete."
}, {
  icon: Star,
  title: RATING_CLAIM,
  desc: `${CITY_PROOF.edmonton.googleReviewCount} Google reviews for the Edmonton branch and ${CITY_PROOF.calgary.googleReviewCount} for the Calgary branch, read on 1 September 2026.`
}, {
  icon: Award,
  title: "Reference-Checked, Then Rated by You",
  desc: "Every cleaner is reference-checked before their first job, then rated by the customer after every visit. Those ratings decide who keeps cleaning for us."
}, {
  icon: Sparkles,
  title: "All Cleaning Supplies & Equipment Provided",
  desc: "The team brings all supplies and equipment. The home needs running water, and vacuuming may not be possible without electricity."
}, {
  icon: Clock,
  title: "Pick Your Arrival Window",
  desc: "We book an arrival window, not an exact time: 9:00 to 10:00 AM, 12:00 to 1:00 PM or 3:00 to 4:00 PM. You pick it in the booking form rather than waiting for a call back."
}, {
  icon: BadgeCheck,
  // Was "100% Satisfaction Guarantee", which invites the reader to hear "money
  // back". The guarantee is a return visit (POLICY), so the name says so.
  title: `${POLICY.guaranteeWindowHours}-Hour Re-Clean Guarantee`,
  desc: `If something was missed, tell us within ${POLICY.guaranteeWindowHours} hours and we come back and re-clean it at no charge. Photos help but are not required.`
}];
interface BrandHomeProps {
  hideFooter?: boolean;
}

/**
 * Owns the page's <main> landmark only when this renders as its own page.
 * Embedded in /locations (hideFooter), the host page already provides one and a
 * document must not contain two. Hoisted to module scope so toggling the prop
 * never remounts the whole tree.
 */
const Shell = ({ standalone, children }: { standalone: boolean; children: ReactNode }) =>
  standalone ? <main id="main-content" tabIndex={-1}>{children}</main> : <>{children}</>;

export default function BrandHome({ hideFooter = false }: BrandHomeProps) {
  const { pathname } = useLocation();
  // Embedded usage (Locations page) already renders that page's <h1>.
  const HeroHeading = hideFooter ? "h2" : "h1";
  const {
    ref: heroRef
  } = useScrollAnimation();
  const {
    ref: locationsRef
  } = useScrollAnimation();
  const {
    ref: aboutRef
  } = useScrollAnimation();
  const {
    ref: servicesRef
  } = useScrollAnimation();
  const {
    ref: whyRef
  } = useScrollAnimation();
  const {
    ref: ctaRef
  } = useScrollAnimation();
  return <div className="min-h-screen">
      {/* When embedded (hideFooter), the HOST page owns <head> and the nav.
          This component is only ever rendered inside /locations today, and its
          unconditional Helmet used to override that page's real title with a
          homepage one — the Locations hub shipped as "Professional House
          Cleaning Across Alberta". Rendering these only in standalone mode keeps
          exactly one <title>, one <meta description> and one <nav> per page. */}
      {!hideFooter && (
        <>
          <Helmet>
            <title>Professional House Cleaning Across Alberta | Duty Cleaners</title>
            <meta name="description" content="House cleaning in Edmonton, Calgary and Red Deer since 2017. See your price before booking; nothing is charged today and the card is charged after the clean." />
          </Helmet>
          <Navigation />
        </>
      )}

      <Shell standalone={!hideFooter}>
      {/* Hero Section */}
      <section className="bg-brand-navy py-20 md:py-32 relative overflow-hidden">
        {!hideFooter && (
          <Helmet>
            <link rel="preload" as="image" href={heroCleanHouse} imageSrcSet={HERO_SRCSET} imageSizes="100vw" />
          </Helmet>
        )}
        <img
          src={heroCleanHouse}
          srcSet={HERO_SRCSET}
          sizes="100vw"
          alt="Professional cleaner wiping a kitchen counter in an Alberta home"
          width={1672}
          height={941}
          className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[2px]"
         loading="eager" fetchPriority="high"/>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 via-brand-navy/70 to-brand-navy/85" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10" ref={heroRef}>
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-2.5 rounded-full mb-8 border border-white/15">
              <BadgeCheck className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-white/90">{`Cleaning Alberta homes since ${COMPANY.foundedYear} · Edmonton and Calgary ${RATING_CLAIM}`}</span>
            </div>

            {/* When embedded inside another page (Locations) that page owns the
                single <h1>, so demote this hero heading to keep one h1 per page. */}
            <HeroHeading className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              Professional House Cleaning{" "}
              <span className="text-accent">Across Alberta</span>
            </HeroHeading>
            <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
              House cleaning from branches in Edmonton, Calgary and Red Deer. You see the flat price for your home size before you book, and the card is charged once the clean is complete.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
              {[{
              icon: Shield,
              label: "Pay After Your Clean"
            }, {
              icon: Star,
              label: `Edmonton + Calgary: ${RATING_CLAIM}`
            }, {
              icon: Users,
              label: BOOKINGS_CLAIM
            }].map((badge, i) => <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <badge.icon className="w-4 h-4 text-accent" />
                  <span className="text-white/90 text-sm font-medium">{badge.label}</span>
                </div>)}
            </div>
          </div>
        </div>
      </section>

      {/* City Selection Cards */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4" ref={locationsRef}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Locations</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Choose Your Location</h2>
              <p className="text-lg text-muted-foreground">Select your city to view services, pricing, and availability</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Edmonton Card */}
              <div className="group block" style={{
              perspective: "1000px"
            }}>
                <div className="bg-brand-navy rounded-2xl text-white transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-xl group-hover:scale-[1.02] relative overflow-hidden border border-white/10" style={{
                transformStyle: "preserve-3d"
              }}>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-6">
                          <MapPin className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="text-2xl md:text-3xl font-bold">Edmonton</h3>
                          <span className="text-white/80 text-sm">Alberta, Canada</span>
                        </div>
                      </div>
                      {/* Was a flat "5★". The real figure is 4.9, and this page
                          prints it three lines above. */}
                      <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span className="font-bold text-sm">
                          {CITY_PROOF.edmonton.googleRating} · {CITY_PROOF.edmonton.googleReviewCount} reviews
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-5 text-white/90">
                      <Phone className="w-4 h-4" />
                      <span className="font-semibold text-white">{CITY_PROOF.edmonton.phone}</span>
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2.5 text-white/90">
                        <MapPin className="w-4 h-4 text-accent" />
                        <span className="text-sm">Edmonton office at {CITY_PROOF.edmonton.streetAddress}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-white/90">
                        <Clock className="w-4 h-4 text-accent" />
                        <span className="text-sm">Serving Alberta since {COMPANY.foundedYear}</span>
                      </div>
                    </div>

                    <Button
                      asChild
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base h-12 shadow-md hover:shadow-lg transition-all"
                    >
                      <Link
                        to="/"
                        className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        View Edmonton services
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Calgary Card */}
              <div className="group block" style={{
              perspective: "1000px"
            }}>
                <div className="bg-brand-navy rounded-2xl text-white transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-xl group-hover:scale-[1.02] relative overflow-hidden border border-white/10" style={{
                transformStyle: "preserve-3d"
              }}>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-6">
                          <MapPin className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="text-2xl md:text-3xl font-bold">Calgary</h3>
                          <span className="text-white/80 text-sm">Alberta, Canada</span>
                        </div>
                      </div>
                      {/* Was a flat "5★". The real figure is 4.9, and this page
                          prints it three lines above. */}
                      <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span className="font-bold text-sm">
                          {CITY_PROOF.calgary.googleRating} · {CITY_PROOF.calgary.googleReviewCount} reviews
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-5 text-white/90">
                      <Phone className="w-4 h-4" />
                      <span className="font-semibold text-white">{CITY_PROOF.calgary.phone}</span>
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2.5 text-white/90">
                        <MapPin className="w-4 h-4 text-accent" />
                        <span className="text-sm">Calgary office at {CITY_PROOF.calgary.streetAddress}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-white/90">
                        <Clock className="w-4 h-4 text-accent" />
                        <span className="text-sm">Serving Alberta since {COMPANY.foundedYear}</span>
                      </div>
                    </div>

                    <Button
                      asChild
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base h-12 shadow-md hover:shadow-lg transition-all"
                    >
                      <Link
                        to="/cleaning-services-calgary/"
                        className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        View Calgary services
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Red Deer has its own office and booking path, but no Google
                  reviews yet, so this card deliberately has no star rating. */}
              <div className="group block" style={{ perspective: "1000px" }}>
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-brand-navy text-white transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-xl group-hover:scale-[1.02]" style={{ transformStyle: "preserve-3d" }}>
                  <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
                  <div className="relative z-10 p-8">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 transition-transform duration-500 group-hover:rotate-6">
                          <MapPin className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold md:text-3xl">Red Deer</h3>
                          <span className="text-sm text-white/80">Alberta, Canada</span>
                        </div>
                      </div>
                    </div>
                    <div className="mb-5 flex items-center gap-2 text-white/90">
                      <Phone className="h-4 w-4" />
                      <span className="font-semibold text-white">{CITY_PROOF.reddeer.phone}</span>
                    </div>
                    <div className="mb-6 space-y-2">
                      <div className="flex items-center gap-2.5 text-white/90">
                        <MapPin className="h-4 w-4 text-accent" />
                        <span className="text-sm">Red Deer office at {CITY_PROOF.reddeer.streetAddress}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-white/90">
                        <Clock className="h-4 w-4 text-accent" />
                        <span className="text-sm">Online booking available</span>
                      </div>
                    </div>
                    <Button asChild className="h-12 w-full bg-accent text-base font-semibold text-accent-foreground shadow-md transition-all hover:bg-accent/90 hover:shadow-lg">
                      <Link to="/cleaning-services-red-deer/" className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                        View Red Deer services
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-brand-navy relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10" ref={aboutRef}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-brand-gold font-semibold text-sm uppercase tracking-wider">How It Works</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-white">How Booking a House Clean Works</h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
                Three steps take you from the price for your home size to a finished clean.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[{
                step: "01",
                icon: CalendarClock,
                title: "Book Online",
                desc: "Tell us your home size, see the flat price and choose an arrival window. No phone call is needed unless you would rather book by phone."
              }, {
                step: "02",
                icon: Sparkles,
                title: "We Clean Your Home",
                desc: "Reference-checked cleaners bring all supplies and equipment and work to the checklist for your service. You do not need to be home: most customers leave a key or a lockbox code."
              }, {
                step: "03",
                icon: Heart,
                title: "Pay Once It Is Done",
                desc: `The card is charged once the clean is complete. If anything was missed, tell us within ${POLICY.guaranteeWindowHours} hours and we come back and re-clean it at no charge.`
              }].map((step, i) => (
                <div key={i} className="group relative" style={{ perspective: "1000px" }}>
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 text-center h-full transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.02] group-hover:border-accent/40" style={{ transformStyle: "preserve-3d" }}>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-sm font-bold px-4 py-1 rounded-full shadow-md">
                      Step {step.step}
                    </div>
                    <div className="w-16 h-16 bg-accent/15 rounded-2xl flex items-center justify-center mx-auto mb-5 mt-3 transition-transform duration-500 group-hover:rotate-6">
                      <step.icon className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                    <p className="text-sm text-white/90 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base h-14 px-8 shadow-lg hover:shadow-xl transition-all">
                {/* Closes "How it works" by opening the quote, where step 01
                    starts. It used to open the 24-hour contact inbox instead. */}
                <a href={quoteHrefFor(pathname)}>
                  See My Instant Price
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4" ref={servicesRef}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">What We Offer</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">House Cleaning Services Across Alberta</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                These four services are priced flat by home size before GST. The instant price shows the exact figure for your home, including any pet, home-type or travel charge.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {services.map((service, i) => <div key={i} className="group" style={{
              perspective: "1000px"
            }}>
                  <div className="bg-card rounded-xl border border-border/50 shadow-sm p-7 transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-xl group-hover:scale-[1.02]" style={{
                transformStyle: "preserve-3d"
              }}>
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-5 transition-transform duration-500 group-hover:rotate-6">
                      <service.icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-foreground">{service.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
                  </div>
                </div>)}
            </div>

            <div className="text-center mt-10">
              <Link to="/locations/" className="inline-flex items-center gap-2 text-accent font-semibold hover:underline text-lg transition-colors">
                View All Service Locations
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4" ref={whyRef}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Why Us</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Why Albertans Choose Duty Cleaners</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Duty Cleaners charges a flat price, takes payment after the clean, keeps the cleaners customers rate well and comes back if something was missed.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {whyChooseUs.map((item, i) => <div key={i} className="group" style={{
              perspective: "1000px"
            }}>
                  <div className="bg-card rounded-xl border border-border/50 shadow-sm p-7 transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-xl group-hover:scale-[1.02] h-full" style={{
                transformStyle: "preserve-3d"
              }}>
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-5 transition-transform duration-500 group-hover:rotate-6">
                      <item.icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </section>

      <HonestReviewLink city="Edmonton" />

      {/* Trust by the Numbers */}
      <section className="py-20 bg-muted/30 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Track Record</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Duty Cleaners by the Numbers</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {`Duty Cleaners has taken ${BOOKINGS} bookings in Alberta since ${COMPANY.foundedYear} and is rated ${RATING_CLAIM}.`}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {stats.map((stat, i) => (
                <div key={i} className="group" style={{ perspective: "1000px" }}>
                  <div className="bg-card rounded-xl border border-border/50 shadow-sm p-6 text-center h-full transition-all duration-500 ease-out group-hover:-translate-y-1.5 group-hover:shadow-lg group-hover:border-accent/40" style={{ transformStyle: "preserve-3d" }}>
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform duration-500 group-hover:rotate-6">
                      <stat.icon className="w-6 h-6 text-accent" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold mb-1 text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground font-medium leading-tight">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <div className="inline-flex items-center gap-2 bg-card border border-border/50 px-4 py-2 rounded-full shadow-sm">
                <Shield className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Pay After Your Clean</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-card border border-border/50 px-4 py-2 rounded-full shadow-sm">
                <BadgeCheck className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">{`${POLICY.guaranteeWindowHours}-Hour Re-Clean Guarantee`}</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-card border border-border/50 px-4 py-2 rounded-full shadow-sm">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">All Supplies Brought For You</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-card border border-border/50 px-4 py-2 rounded-full shadow-sm">
                <Users className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Customer-Rated Cleaners</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4" ref={ctaRef}>
          <div className="max-w-4xl mx-auto">
            <div className="bg-brand-navy rounded-2xl p-10 md:p-14 relative overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 w-60 h-60 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                  <Sparkles className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Book a House Clean in Edmonton, Calgary or Red Deer</h2>
                <p className="text-lg text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
                  See the price for your home size before you book, choose a time that suits you, and pay
                  once the clean is done.
                </p>

                <div className="grid gap-4 mb-8 md:grid-cols-3">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-5 py-6 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5" asChild>
                    <a href={CITY_PROOF.edmonton.phoneLink}>
                      <Phone className="w-5 h-5 mr-2" />
                      Edmonton: {CITY_PROOF.edmonton.phone}
                    </a>
                  </Button>
                  <Button size="lg" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 text-base px-5 py-6 h-auto font-semibold transition-all duration-300" asChild>
                    <a href={CITY_PROOF.calgary.phoneLink}>
                      <Phone className="w-5 h-5 mr-2" />
                      Calgary: {CITY_PROOF.calgary.phone}
                    </a>
                  </Button>
                  <Button size="lg" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 text-base px-5 py-6 h-auto font-semibold transition-all duration-300" asChild>
                    <a href={CITY_PROOF.reddeer.phoneLink}>
                      <Phone className="w-5 h-5 mr-2" />
                      Red Deer: {CITY_PROOF.reddeer.phone}
                    </a>
                  </Button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  {[{
                  icon: CheckCircle2,
                  label: "Easy Online Booking"
                }, {
                  icon: Shield,
                  label: "Re-Clean If Anything Is Missed"
                }].map((badge, i) => <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                      <badge.icon className="w-4 h-4 text-accent" />
                      <span className="text-white/90 text-sm font-medium">{badge.label}</span>
                    </div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      </Shell>

      {!hideFooter && <Footer />}
    </div>;
}
