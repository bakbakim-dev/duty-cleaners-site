import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { MapPin, Phone, Star, CheckCircle2, Clock, Shield, Sparkles, Home as HomeIcon, Award, ArrowRight, BadgeCheck, Users, CalendarClock, Briefcase, Heart } from "lucide-react";
import heroCleanHouse from "@/assets/hero-clean-house-cleaner.webp";
import HonestReviewLink from "@/components/HonestReviewLink";
import { COMPANY, HOMES_CLEANED, RATING_CLAIM } from "@/data/proof";
// Every figure here reads from src/data/proof.ts, the single source of truth
// for numeric claims on the site. The two this replaced — "10+ Years Combined
// Experience" and "95% Customer Retention" — did not appear anywhere in that
// file or in llms-full.txt; there was no source for either number.
const stats = [{
  value: "2017",
  label: "Licensed & Operating in Alberta",
  icon: Clock
}, {
  value: HOMES_CLEANED.alberta,
  label: "Homes Cleaned",
  icon: HomeIcon
}, {
  value: RATING_CLAIM,
  label: "Rated by Alberta Homeowners",
  icon: Star
}, {
  value: "24-Hour",
  label: "Make-It-Right Guarantee",
  icon: Heart
}];
const services = [{
  icon: Sparkles,
  title: "Standard Cleaning",
  desc: "Regular maintenance to keep your home fresh and tidy"
}, {
  icon: CheckCircle2,
  title: "Deep Cleaning",
  desc: "Thorough cleaning for every corner and surface"
}, {
  icon: HomeIcon,
  title: "Move In/Out",
  desc: "Complete cleaning for moving transitions"
}, {
  icon: CalendarClock,
  title: "Recurring Service",
  desc: "Save up to 20% with regular cleaning schedules"
}];
const whyChooseUs = [{
  icon: Shield,
  title: "Pay After Your Clean",
  desc: "Every cleaner is reference-checked before working in a customer’s home."
}, {
  icon: Star,
  title: "Five-Star Rated",
  desc: "Our reputation speaks for itself. Trusted by thousands of satisfied clients across Alberta."
}, {
  icon: Award,
  title: "Vetted Professionals You Can Trust",
  desc: "Our cleaning team are thoroughly vetted to ensure the highest standards of quality and reliability."
}, {
  icon: Sparkles,
  title: "All Cleaning Supplies & Equipment Provided",
  desc: "Our cleaners come fully equipped with all cleaning products and equipment."
}, {
  icon: Clock,
  title: "Flexible Scheduling",
  desc: "We offer convenient scheduling options to fit your routine, including weekdays and weekends. Book a time that works best for you."
}, {
  icon: BadgeCheck,
    title: "100% Satisfaction Guarantee",
    desc: "If you're not happy with our service, let us know within 24 hours and we will come back free of charge."
  }];
interface BrandHomeProps {
  hideFooter?: boolean;
}

export default function BrandHome({ hideFooter = false }: BrandHomeProps) {
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
            <meta name="description" content="Alberta's most trusted cleaning service. Professional house cleaning in Edmonton and Calgary. Pay after your clean. Customer-rated cleaners. Book today!" />
          </Helmet>
          <Navigation />
        </>
      )}

      {/* Hero Section */}
      <section className="bg-brand-navy py-20 md:py-32 relative overflow-hidden">
        <img
          src={heroCleanHouse}
          alt="Happy professional cleaner in a spotless living room"
          width={1920}
          height={1280}
          className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 via-brand-navy/70 to-brand-navy/85" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10" ref={heroRef}>
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-2.5 rounded-full mb-8 border border-white/15">
              <BadgeCheck className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-white/90">Trusted Since 2017 · Five-Star Rated</span>
            </div>

            {/* When embedded inside another page (Locations) that page owns the
                single <h1>, so demote this hero heading to keep one h1 per page. */}
            <HeroHeading className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              Professional House Cleaning{" "}
              <span className="text-accent">Across Alberta</span>
            </HeroHeading>
            <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
              Enjoy a cleaner, healthier home with trusted residential cleaning services across Alberta. We deliver dependable cleaning solutions designed for busy households and modern living.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
              {[{
              icon: Shield,
              label: "Pay After Your Clean"
            }, {
              icon: Star,
              label: "Five-Star Rated"
            }, {
              icon: Users,
              label: "5,000+ Homes Cleaned"
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Locations</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Choose Your Location</h2>
              <p className="text-lg text-muted-foreground">Select your city to view services, pricing, and availability</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Edmonton Card */}
              <Link to="/" className="group block" style={{
              perspective: "1000px"
            }}>
                <div className="bg-brand-navy rounded-2xl p-8 text-white transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-xl group-hover:scale-[1.02] relative overflow-hidden border border-white/10" style={{
                transformStyle: "preserve-3d"
              }}>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10">
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
                      <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span className="font-bold text-sm">5★</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-5 text-white/90">
                      <Phone className="w-4 h-4" />
                      <span className="font-semibold text-white">780-913-6565</span>
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2.5 text-white/90">
                        <Star className="w-4 h-4 text-accent" />
                        <span className="text-sm">4,000+ homes cleaned</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-white/90">
                        <Clock className="w-4 h-4 text-accent" />
                        <span className="text-sm">Serving Alberta since {COMPANY.foundedYear}</span>
                      </div>
                    </div>

                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base h-12 shadow-md hover:shadow-lg transition-all">
                      View Services
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </Link>

              {/* Calgary Card */}
              <Link to="/cleaning-services-calgary" className="group block" style={{
              perspective: "1000px"
            }}>
                <div className="bg-brand-navy rounded-2xl p-8 text-white transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-xl group-hover:scale-[1.02] relative overflow-hidden border border-white/10" style={{
                transformStyle: "preserve-3d"
              }}>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10">
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
                      <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span className="font-bold text-sm">5★</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-5 text-white/90">
                      <Phone className="w-4 h-4" />
                      <span className="font-semibold text-white">(403) 768-1341</span>
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2.5 text-white/90">
                        <Star className="w-4 h-4 text-accent" />
                        <span className="text-sm">1,000+ homes cleaned</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-white/90">
                        <Clock className="w-4 h-4 text-accent" />
                        <span className="text-sm">Serving Alberta since {COMPANY.foundedYear}</span>
                      </div>
                    </div>

                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base h-12 shadow-md hover:shadow-lg transition-all">
                      View Services
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </Link>
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
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-white">3 Simple Steps to a Spotless Home</h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
                Booking your professional cleaning has never been easier — get back to what matters most in just three quick steps.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[{
                step: "01",
                icon: CalendarClock,
                title: "Book Online",
                desc: "Tell us about your home and choose a time that works for you—no phone call needed unless you prefer one. We'll confirm your booking by call or text before your appointment."
              }, {
                step: "02",
                icon: Sparkles,
                title: "We Clean Your Home",
                desc: "Our vetted cleaners arrive fully equipped and deliver a thorough, professional clean."
              }, {
                step: "03",
                icon: Heart,
                title: "Relax & Enjoy Your Space",
                desc: "Come home to a fresh, spotless space — backed by our 100% satisfaction guarantee."
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
                <Link to="/contact-us">
                  Book Your Cleaning
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
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
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Comprehensive Cleaning Services</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From routine maintenance to deep cleaning, we offer a full range of professional services tailored to your needs
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
              <Link to="/locations" className="inline-flex items-center gap-2 text-accent font-semibold hover:underline text-lg transition-colors">
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
                We're not just another cleaning service — we're your reliable partner in maintaining a healthy, beautiful home
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
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Proven Track Record</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Trusted by Albertan Homeowners</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A decade of dependable service, thousands of spotless homes, and a community of customers who keep coming back.
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
                <span className="text-sm font-medium">100% Satisfaction Guarantee</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-card border border-border/50 px-4 py-2 rounded-full shadow-sm">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">High Quality Cleaning Supplies</span>
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready for a Spotless Home?</h2>
                <p className="text-lg text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
                  Join thousands of satisfied customers across Alberta. Book your professional cleaning service today and experience the Duty Cleaners difference.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-10 py-6 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5" asChild>
                    <a href="tel:7809136565">
                      <Phone className="w-5 h-5 mr-2" />
                      Edmonton: 780-913-6565
                    </a>
                  </Button>
                  <Button size="lg" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 text-lg px-10 py-6 h-auto font-semibold transition-all duration-300" asChild>
                    <a href="tel:4037681341">
                      <Phone className="w-5 h-5 mr-2" />
                      Calgary: (403) 768-1341
                    </a>
                  </Button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  {[{
                  icon: CheckCircle2,
                  label: "Easy Online Booking"
                }, {
                  icon: Shield,
                  label: "Satisfaction Guaranteed"
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

      {!hideFooter && <Footer />}
    </div>;
}