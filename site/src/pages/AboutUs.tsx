import { POLICY } from "@/data/policy";
import { BOOKINGS, CITY_PROOF, COMPANY, RATING_CLAIM, hoursLineFor } from "@/data/proof";
import { calgaryNeighborhoods, calgarySurrounding, edmontonNeighborhoods, edmontonSurrounding } from "@/data/city-locations";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Users, Award, Clock, Sparkles, Phone, MapPin, DollarSign, Star, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import heroCleaningLadies from "@/assets/hero-cleaning-ladies.webp";
import DutyCleanPromise from "@/components/DutyCleanPromise";
import { Helmet } from "react-helmet-async";
export default function AboutUs() {
  return <div className="min-h-screen">
      <Helmet>
        <title>About Duty Cleaners | Cleaning Alberta Homes Since 2017</title>
        <meta name="description" content="Cleaning Alberta homes since 2017. Duty Cleaners now serves Edmonton, Calgary and Red Deer with reference-checked, customer-rated cleaners." />
        <link rel="canonical" href="https://dutycleaners.ca/about-us/" />
        <meta property="og:title" content="About Duty Cleaners | Cleaning Alberta Homes Since 2017" />
        <meta property="og:description" content="Cleaning Alberta homes since 2017. Duty Cleaners now serves Edmonton, Calgary and Red Deer with reference-checked, customer-rated cleaners." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/about-us/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Duty Cleaners | Cleaning Alberta Homes Since 2017" />
        <meta name="twitter:description" content="Cleaning Alberta homes since 2017. Duty Cleaners now serves Edmonton, Calgary and Red Deer with reference-checked, customer-rated cleaners." />
      </Helmet>
      <Navigation />
      <main id="main-content" tabIndex={-1}>
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero Section */}
      <section className="relative bg-brand-navy py-20 overflow-hidden">
        <img
          src={heroCleaningLadies}
          alt="Two cleaners holding spray bottles and cloths in a bright living room"
          width={1280}
          height={853}
          className="absolute inset-0 w-full h-full object-cover opacity-25"
         loading="eager" fetchPriority="high"/>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 via-brand-navy/70 to-brand-navy/90" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="display-serif text-4xl md:text-5xl mb-6 font-bold text-white lg:text-7xl">About Duty Cleaners</h1>
            <p className="text-xl md:text-2xl mb-8 text-white/85 font-semibold">
              Duty Cleaners cleans homes from offices in Edmonton, Calgary and Red Deer; the Edmonton and Calgary offices are rated {RATING_CLAIM}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                <a href="#quote">See My Instant Price</a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <a href="tel:7809136565">Call (780) 913-6565</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mb-6">Our Story</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                Letting someone into your home is the part people hesitate over, so here is how it
                works. You see the price before you book. The cleaner who arrives has been
                reference-checked, and you rate them afterwards — those ratings decide who we keep
                sending.
              </p>
              <p>
                Duty Cleaners has handled {BOOKINGS} Alberta bookings since 2017.
                Today, the company serves customers from three offices: Edmonton, Calgary and Red Deer.
              </p>
              <p>
                If something gets missed, tell us within {POLICY.guaranteeWindowHours} hours and we come
                back and re-clean the missed checklist items at no charge. See our{" "}
                <Link to="/satisfaction-guarantee/" className="text-primary underline">re-clean guarantee</Link>{" "}
                for how to report an issue and what is covered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mb-4">Three offices, one company</h2>
          <p className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto">
            Each office has its own address, phone number and Google listing, and all three charge the same prices and give the same guarantee.
          </p>
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-brand-gold/40 md:left-0 md:right-0 md:top-[7px] md:bottom-auto md:h-0.5 md:w-auto" aria-hidden="true" />
            <div className="grid gap-10 md:grid-cols-5 md:gap-6">
              {[
                { title: "Since 2017", text: "Duty Cleaners has cleaned homes in Alberta since 2017. Today, we serve customers from offices in Edmonton, Calgary and Red Deer." },
                { title: "Edmonton office", text: `The Edmonton office is at ${CITY_PROOF.edmonton.streetAddress} and answers on ${CITY_PROOF.edmonton.phone}. It covers ${edmontonNeighborhoods.length} Edmonton neighbourhoods and ${edmontonSurrounding.length} communities outside the city, including St. Albert, Sherwood Park and Spruce Grove.` },
                { title: "Calgary office", text: `The Calgary office is at ${CITY_PROOF.calgary.streetAddress} and answers on ${CITY_PROOF.calgary.phone}. It covers ${calgaryNeighborhoods.length} Calgary neighbourhoods and ${calgarySurrounding.length} communities outside the city, including Airdrie, Cochrane and Okotoks.` },
                // Red Deer (owner, 2026-09-11): its own office and Google listing. No
                // surrounding communities are on file for it, so none are named.
                { title: "Red Deer office", text: `The Red Deer office is at ${CITY_PROOF.reddeer.streetAddress} and answers on ${CITY_PROOF.reddeer.phone}. It covers Red Deer, with no travel fee inside the city, and its Google listing is new.` },
                { title: RATING_CLAIM, text: `${CITY_PROOF.edmonton.googleReviewCount} reviews on the Edmonton listing and ${CITY_PROOF.calgary.googleReviewCount} on the Calgary one. Google keeps the two counts separate, and so do we.` },
              ].map((step, index) => (
                <div key={step.title} className="relative pl-10 md:pl-0 md:pt-10">
                  <span className="absolute left-0 top-2 h-4 w-4 rounded-full border-2 border-brand-gold bg-white md:left-1/2 md:top-0 md:-translate-x-1/2" aria-hidden="true" />
                  <span className="text-sm font-bold text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-1 text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <DutyCleanPromise />

      {/* What Makes Us Unique */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mb-12">What Makes Us Different</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: DollarSign,
                iconWrap: "bg-primary/10",
                iconColor: "text-primary",
                title: "A Flat Price by Home Size",
                text: "The price is set by bedrooms, bathrooms and home type before you book, and it does not change because a clean took longer than expected. Prices are before 5% GST, and a pet charge or a travel fee outside city limits shows on the quote where it applies.",
              },
              {
                icon: Shield,
                iconWrap: "bg-accent/10",
                iconColor: "text-accent",
                title: "Reference-Checked & Customer-Rated",
                text: `Every cleaner is reference-checked before a first job and rated by the customer after each visit, and ${COMPANY.applicantAcceptanceRate} of applicants are accepted.`,
              },
              {
                icon: Users,
                iconWrap: "bg-rose-600",
                iconColor: "text-secondary",
                // Was "Vetted Professional Cleaners You Can Trust", which repeated the
                // card directly above it and the Duty Clean Promise section above that.
                title: "You Do Not Have to Be Home",
                text: "Most customers leave a key, a lockbox code or smart-lock access, and the team locks up when it leaves. If you would rather be there, that works too.",
              },
              {
                icon: Sparkles,
                iconWrap: "bg-primary/10",
                iconColor: "text-primary",
                title: "All Cleaning Supplies & Equipment Provided",
                // "Premium products and top-tier equipment" implies one company-chosen kit.
                // Cleaners work as contractors and bring their own, which /join-the-team/
                // states plainly. What is true is that you supply nothing; the alternative-products
                // option and its fee read from policy.ts.
                text: `The team brings all supplies and equipment, so you provide nothing. Optional alternative products cost ${POLICY.ecoProductsFee} extra, before GST: ${POLICY.ecoProductsHowToRequest}.`,
              },
              {
                icon: Clock,
                iconWrap: "bg-accent/10",
                iconColor: "text-accent",
                title: "See the Price Before You Book",
                text: "Choose the service, bedrooms, bathrooms and home type, and the booking form shows the price. Nothing is charged at booking, and the card is charged once the clean is complete.",
              },
              {
                icon: Award,
                iconWrap: "bg-green-400",
                iconColor: "text-secondary",
                // Named for what it is: a return visit (content prompt, T1).
                title: `${POLICY.guaranteeWindowHours}-Hour Re-Clean Guarantee`,
                text: `If something was missed, tell us within ${POLICY.guaranteeWindowHours} hours and we come back and re-clean it at no charge. Photos help but are not required.`,
              },
            ].map((card, index) => {
              const CardIcon = card.icon;
              return (
                <div
                  key={card.title}
                  className="relative bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow hover-gentle-shake"
                >
                  <span className="absolute right-6 top-6 text-sm font-bold text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className={`w-16 h-16 ${card.iconWrap} rounded-2xl flex items-center justify-center mb-4`}>
                    <CardIcon className={`w-8 h-8 ${card.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                  <p className="text-muted-foreground">{card.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="display-serif text-3xl md:text-4xl font-bold mb-6">How we work</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Each visit is booked into an arrival window: 9:00 to 10:00 AM, 12:00 to 1:00 PM, or 3:00 to
              4:00 PM. Changing or cancelling a booking needs {POLICY.cancellationNoticeHours} hours'
              notice, and inside that the fee is {POLICY.cancellationFee}. The Edmonton and Calgary
              offices are open {hoursLineFor("edmonton")}; the Red Deer office is open{" "}
              {hoursLineFor("reddeer")}.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Some things are outside every service: outdoor work and exterior windows, anything beyond a
              3-step ladder, lifting anything over 25 lb, carpet steam cleaning, and laundry and dishes. The
              full scope of each service is on{" "}
              <Link to="/whats-included/" className="text-primary underline underline-offset-2">
                what's included in each clean
              </Link>
              , and prices by home size are on{" "}
              <Link to="/pricing/" className="text-primary underline underline-offset-2">
                the Edmonton price list
              </Link>{" "}
              and{" "}
              <Link to="/calgary/pricing/" className="text-primary underline underline-offset-2">
                Calgary house cleaning prices
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-navy">
        <div className="container mx-auto px-4 text-center">
          <h2 className="display-serif text-3xl md:text-4xl font-bold text-white mb-6">
            Book a clean, or call and ask us anything first
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            See the price for your home before you decide anything, and pay only after the clean is done.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
              <a href="#quote">See My Instant Price</a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link to="/reviews/">Read Our Reviews</Link>
            </Button>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>;
}
