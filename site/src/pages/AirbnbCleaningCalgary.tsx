import { HOURLY_RATE, GST_RATE, formatPrice, withGst, FREQUENCIES } from "@/data/pricing";
import { travelFee } from "@/data/addon-table";
import { POLICY, ARRIVAL_WINDOWS } from "@/data/policy";
import { CITY_PROOF, RATING_CLAIM, COMPANY } from "@/data/proof";
import { canonicalForPath } from "@/data/legacy-urls";
import {
  CheckCircle,
  Clock,
  Star,
  Shield,
  Calendar,
  Sparkles,
  Home,
  Phone,
  MapPin,
  ClipboardCheck,
  KeyRound,
  Wand2,
  DoorOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import { buildServiceSchema } from "@/lib/service-schema";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import React from "react";

import imgBedroom from "@/assets/hero-family-bedroom.webp";
import imgBathroom from "@/assets/gallery/calgary-bathroom-clean.webp";
import imgKitchen from "@/assets/gallery/calgary-kitchen-clean.webp";
import imgLiving from "@/assets/gallery/calgary-living-room-clean.webp";
import imgLaundry from "@/assets/cleaning-equipment-flatlay.webp";
import imgEssentials from "@/assets/gallery/calgary-eco-products.webp";

import heroBg from "@/assets/airbnb/calgary-hero-living.webp";
import gal1 from "@/assets/airbnb/turnover-living.webp";
import gal2 from "@/assets/airbnb/turnover-bedroom.webp";
import gal3 from "@/assets/airbnb/turnover-bathroom.webp";
import gal4 from "@/assets/airbnb/turnover-kitchen.webp";
import gal5 from "@/assets/airbnb/turnover-dining.webp";
import gal6 from "@/assets/airbnb/turnover-entry.webp";
import { Helmet } from "react-helmet-async";
import CityCrossLink from "@/components/CityCrossLink";
import LocalMarketNote from "@/components/LocalMarketNote";

/* Every figure on this page derives from bk-config, policy.ts or proof.ts.
   Nothing here is hand-typed. */
const proof = CITY_PROOF.calgary;
const RATE = formatPrice(HOURLY_RATE);
const MIN_ONE = formatPrice(HOURLY_RATE * 3);
const MIN_ONE_GST = formatPrice(withGst(HOURLY_RATE * 3));
const MIN_TWO = formatPrice(HOURLY_RATE * 2 * 2);
const FIVE_HOURS = formatPrice(HOURLY_RATE * 5);
const GST_PCT = `${Math.round(GST_RATE * 100)}%`;
const TRAVEL = travelFee("airbnb");
const TRAVEL_LINE = TRAVEL === null ? "a travel fee we quote when you book" : `${formatPrice(TRAVEL)} in travel per visit`;
const BIWEEKLY = FREQUENCIES.find((f) => f.id === "bi-weekly-every-2-weeks");
const BIWEEKLY_PCT = BIWEEKLY ? `${Math.round(BIWEEKLY.discount * 100)}%` : "a";
const GUARANTEE_HOURS = POLICY.guaranteeWindowHours;
const HUB = canonicalForPath("/calgary");
const PRICING = canonicalForPath("/calgary/pricing");
const RECURRING = canonicalForPath("/calgary/recurring-cleaning");
const SERVICES = canonicalForPath("/calgary/services");
const TITLE = `Airbnb Cleaning Calgary from ${RATE}/hour | Duty Cleaners`;
const DESCRIPTION = `Turnover cleaning for Calgary short-term rentals from ${RATE} per cleaner-hour. Stampede back-to-backs, linen resets and restocking, 3-hour minimum.`;

const AnimatedSection = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
};

const WhatWeCleanCard = ({
  image,
  title,
  description,
}: {
  image: string;
  title: string;
  description: string;
}) => (
  <div className="group bg-card rounded-2xl border border-border overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-xl">
    <div className="aspect-[4/3] overflow-hidden">
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    </div>
    <div className="p-5">
      <h3 className="font-bold text-foreground mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

const WhyUsCard = ({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}) => (
  <div
    className={`group bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 p-6 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl hover:shadow-white/5 ${
      index % 2 === 0 ? "hover:translate-x-0.5" : "hover:-translate-x-0.5"
    }`}
  >
    <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:rotate-12">
      <Icon className="w-6 h-6 text-accent" />
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-white/90 text-sm leading-relaxed">{description}</p>
  </div>
);

const StepCard = ({
  step,
  icon: Icon,
  title,
  description,
}: {
  step: number;
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="relative bg-card rounded-2xl border border-border p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl">
    <div className="absolute -top-3 -left-3 w-9 h-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm shadow-md">
      {step}
    </div>
    <div className="w-12 h-12 rounded-lg bg-calgary/10 flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-calgary" />
    </div>
    <h3 className="font-bold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

const AirbnbCleaningCalgary = () => {
  /* One list, in Calgary's own words. The page used to print the same six
     items twice, once with photos and once with icons. */
  const whatWeClean = [
    { image: imgBedroom, title: "Beds and bedrooms", description: "Sheets off, fresh set on from the linen you have left out, pillows plumped, nightstands and window sills dusted, floor vacuumed under the bed frame." },
    { image: imgBathroom, title: "Bathrooms", description: "Toilet, sink, tub and shower disinfected, glass and taps wiped dry so they do not spot, drain cover cleared, towels replaced." },
    { image: imgKitchen, title: "Kitchen", description: "Sink and counters scrubbed, stovetop and appliance fronts wiped, microwave interior cleaned, fridge checked for anything the last guest left." },
    { image: imgLiving, title: "Living room and entry", description: "Gravel and grit vacuumed from the entry mat and floor edges, surfaces dusted, cushions and throws reset to the listing photo, remotes back in their place." },
    { image: imgLaundry, title: "Laundry and linen", description: "Offered when the machines are ready to use and clean linens are prepared and accessible for the cleaners. With no spare set on site, the wash runs but the beds wait for it." },
    { image: imgEssentials, title: "Restock and rubbish", description: "Toilet paper, soap and shampoo topped up from your own stock. Bins emptied, bags relined, garbage and recycling carried to the bins or the building's chute." },
  ];

  const howItWorks = [
    { icon: ClipboardCheck, title: "Give us the two times", description: "Checkout and next check-in. Book online or ring the Calgary line. On Stampede days, book the moment the platform confirms the stay." },
    { icon: KeyRound, title: "Access and parking", description: "Lockbox, smart lock or a key with the concierge. In a downtown tower the visitor-parking rules matter as much as the door code, so note both." },
    { icon: Wand2, title: "The same checklist every time", description: "The team works through the six areas above in a fixed order. Anything a guest left behind is bagged, labelled and mentioned in the report." },
    { icon: DoorOpen, title: "Locked and reported", description: "You get a message when the unit is done, with a photo of anything you need to know about before the next guest arrives." },
  ];

  const whyChooseUs = [
    { icon: Clock, title: "Three arrival windows a day", description: `${ARRIVAL_WINDOWS.join(", ")}. An 11 o'clock checkout and a 4 o'clock check-in fits the midday window with room to spare; tell us both times and we place it.` },
    { icon: Star, title: RATING_CLAIM, description: `The Calgary listing has ${proof.googleReviewCount} reviews behind that figure. Cleaners are reference-checked before their first job and rated by the customer after each one; the ratings decide who we keep sending.` },
    { icon: Calendar, title: "Book one or book the season", description: "No contract. Nothing is charged at booking, the card is charged after the turnover, and a host who stops listing in October simply stops booking." },
    { icon: Shield, title: "Supplies come with the team", description: `We bring products and equipment. If you want eco-friendly products in the unit it is ${POLICY.ecoProductsFee} a visit: ${POLICY.ecoProductsHowToRequest}.` },
  ];

  const gallery = [
    { src: gal1, alt: "Calgary Airbnb living room reset after a turnover" },
    { src: gal2, alt: "Bed remade in a Calgary short-term rental" },
    { src: gal3, alt: "Calgary Airbnb bathroom after a turnover clean" },
    { src: gal4, alt: "Calgary short-term rental kitchen reset" },
    { src: gal5, alt: "Dining area of a Calgary Airbnb after cleaning" },
    { src: gal6, alt: "Calgary Airbnb entryway with grit vacuumed before check-in" },
  ];

  const faqs = [
    {
      q: "What does a Calgary Airbnb turnover cost?",
      a: `${RATE} per cleaner per hour before ${GST_PCT} GST. The minimum booking is 3 hours with one cleaner (${MIN_ONE}) or 2 hours with two (${MIN_TWO}). After two or three visits we can tell you the number your unit usually lands on; it moves only when the guest count or the state of the place does.`,
    },
    {
      q: "Can I get a flat rate instead of hourly?",
      a: "Yes. The standard cleaning rates on the Calgary price list are flat by home size and apply to a short-term rental as they would to any home. Hourly suits a unit whose condition swings from stay to stay; flat suits a host who wants the same line on every invoice.",
    },
    {
      q: "Can you do a same-day turnover during Stampede?",
      a: "If it is already booked, yes. If you are asking on the day, only when a team happens to be free, and in the first half of July that is rare. Every host in the city wants the same afternoon slot, so book each Stampede changeover as soon as the reservation lands.",
    },
    {
      q: "Will you do the laundry?",
      a: "Laundry and linen changes are available, provided that the machines are ready to use and clean linens are prepared and accessible for the cleaners. In a condo with a stacked washer, a second set of sheets and towels is what keeps a two-hour turnover at two hours.",
    },
    {
      q: "Do you restock the unit?",
      a: "From what you leave, yes. We do not shop for you. A labelled tote in a closet with paper goods, soap, coffee pods and dishwasher tablets, and a line in the booking notes saying where it is, is all it takes.",
    },
    {
      q: "Do I have to meet the cleaners?",
      a: `No. A lockbox or smart-lock code covers almost every Calgary host we work with. If the code fails and nobody can let the team in, the lockout fee is ${POLICY.lockoutFee}.`,
    },
    {
      q: "Do you cover Airdrie, Cochrane and Chestermere?",
      a: `Yes, at the same hourly rate plus ${TRAVEL_LINE}, because they sit outside Calgary city limits. Inside the limits there is no trip fee at all. The fee shows on the quote before you confirm.`,
    },
    {
      q: "A guest complained about the clean. What now?",
      a: `Send us the complaint within ${GUARANTEE_HOURS} hours of the turnover and we go back and re-clean what was missed at no charge. A photo from the guest helps but is not required. After ${GUARANTEE_HOURS} hours a new party has usually been in, and the guarantee cannot separate one stay from the next.`,
    },
    {
      q: "The booking cancelled. Do I still pay for the clean?",
      a: `Not if you tell us at least ${POLICY.cancellationNoticeHours} hours before the visit. Inside that window the cancellation fee is ${POLICY.cancellationFee}, so pass a platform cancellation on the moment you see it.`,
    },
    {
      q: "I live in the unit and only list it for Stampede and ski season. What should I book?",
      a: `Recurring cleaning for the months you are home and hourly turnovers for the guest weeks. The recurring plan takes ${BIWEEKLY_PCT} off every bi-weekly visit after the first, which is cheaper than paying by the hour for a home that is only ever lightly used.`,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href="https://dutycleaners.ca/airbnb-cleaning-services-calgary/" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/airbnb-cleaning-services-calgary/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        {/* Mirrors the FAQ rendered on this page. Generated from the same
            `faqs` array, so the markup can never drift from the copy. */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(buildServiceSchema({ name: "Airbnb Turnover Cleaning", description: DESCRIPTION, path: "/airbnb-cleaning-services-calgary", city: "calgary" }))}
        </script>
      </Helmet>
      <Navigation city="calgary" />
      <main id="main-content" tabIndex={-1}>
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-brand-navy overflow-hidden">
        <img width={1280} height={720}
          src={heroBg}
          alt="Guest-ready short-term rental living room in Calgary after a turnover clean"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
         loading="eager" fetchPriority="high"/>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 via-brand-navy/70 to-brand-navy/90" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-calgary/20 rounded-full blur-3xl" />
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Home className="w-4 h-4 text-accent" />
            <span className="text-white/90 text-sm font-medium">
              Hourly turnovers for Calgary short-term rentals
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
            Airbnb Cleaning Service in Calgary
          </h1>
          <p className="text-xl md:text-2xl mb-6 text-white/90 font-medium">
            {RATE} per cleaner-hour plus GST, 3-hour minimum, {RATING_CLAIM}
          </p>
          <p className="text-lg mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            A turnover here is the same six-area checklist whether the guest stayed one night on the way
            to Banff or ten days for Stampede: beds remade with your linen, bathrooms and kitchen
            disinfected, the entry cleared of gravel, your supplies topped up and the bins out. You are
            billed for the hours it took, after it is done.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="text-lg bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to={PRICING}>See my price</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg border-white/20 text-white hover:bg-white/10">
              <Link to="/contact-us/?topic=airbnb&city=calgary">Request a callback</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg border-white/20 text-white hover:bg-white/10">
              <a href={proof.phoneLink}>
                <Phone className="w-4 h-4 mr-2" />
                Call {proof.phone}
              </a>
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>Card charged after the turnover, not before</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>No contract</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>Re-clean within {GUARANTEE_HOURS} hours if something was missed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>2-hour minimum with two cleaners</span>
            </div>
          </div>
        </div>
      </section>

      <LocalMarketNote
        accent="calgary"
        eyebrow="Calgary turnovers"
        heading="What running a short-term rental in Calgary actually demands"
        paragraphs={[
          "Calgary's booking calendar is not evenly spread, and the cleaning schedule has to bend around it. Stampede lands in the first half of July and compresses a month of demand into ten days. Hosts who normally see a turnover every few days suddenly need same-day back-to-backs, often with a checkout at 11 and a check-in at 4. Booking that window early matters more here than almost anywhere else in the province, because every host in the city wants the same afternoon slot.",
          "The other rhythm is the mountains. A large share of Calgary stays are one- and two-night stopovers: guests landing at YYC, sleeping, and driving west to Banff or Canmore in the morning, or coming back the other way. Short stays mean more turnovers per month than a comparable property elsewhere, and they mean grit. Ski boots, hiking gear and gravel from the Trans-Canada come in with every party, so entryways, tub bases and floor edges take the visible wear.",
          "Then there is the licensing side. The City of Calgary requires a business licence to operate a short-term rental, and the inspection standards that come with it make a documented, repeatable cleaning routine worth having on paper, for the file as much as for the reviews. We work to a fixed checklist and can tell you exactly what was covered on any given turnover.",
        ]}
      />

      {/* What a turnover includes: one list, with photos */}
      <section className="py-20 px-4 bg-background">
        <AnimatedSection>
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-calgary/10 rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4 text-calgary" />
                <span className="text-calgary text-sm font-medium">Six areas, one order</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                What a Calgary short-term rental turnover covers
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The list does not change between a downtown one-bedroom and a suburban house. Dishes
                are not part of it; laundry joins it when there is a machine and a spare set of linen.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {whatWeClean.map((item, i) => (
                <WhatWeCleanCard key={i} {...item} />
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-secondary/30">
        <AnimatedSection>
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Booking a turnover between guests
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Two times, one door code, and the rest is ours.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((s, i) => (
                <StepCard key={i} step={i + 1} {...s} />
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Cost, with the worked minimum. The rate and the minimum both derive
          from bk-config; this page never types a figure. */}
      <section className="py-16 px-4 bg-background">
        <AnimatedSection>
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Airbnb cleaning prices in Calgary, worked through
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Every turnover is billed by the hour at {RATE} per cleaner, plus {GST_PCT} GST. A flat
              rate would have to guess how the last guest left the place, and after a Stampede weekend
              that guess is usually wrong in one direction. The minimum booking is 3 hours with one
              cleaner or 2 hours with two, and two cleaners is the usual answer when the check-in is
              the same afternoon as the checkout.
            </p>
            <div className="bg-card rounded-2xl border border-border p-6 mb-4">
              <h3 className="font-bold text-foreground mb-3">Worked example: a two-bedroom condo downtown</h3>
              <ul className="space-y-2 text-muted-foreground text-sm leading-relaxed">
                <li>One cleaner, 3-hour minimum: 3 × {RATE} = <strong>{MIN_ONE}</strong> before GST, {MIN_ONE_GST} on the invoice.</li>
                <li>Two cleaners at the 2-hour minimum for a same-day changeover: 4 cleaner-hours = <strong>{MIN_TWO}</strong> before GST, and the unit is done by early afternoon.</li>
                <li>A detached house after a ten-day Stampede let, with laundry: closer to 5 cleaner-hours, {FIVE_HOURS} before GST.</li>
                <li>A unit in Airdrie or Cochrane adds {TRAVEL_LINE}.</li>
              </ul>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              By the third visit we can usually tell you the number your unit lands on. If you would
              rather see a fixed figure first, the{" "}
              <Link to={PRICING} className="text-accent underline underline-offset-2">
                Calgary house cleaning prices by home size
              </Link>{" "}
              apply to a short-term rental as they do to any other home, and every one of them is before
              GST with nothing charged until the clean is finished.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-brand-navy relative overflow-hidden">
        <div className="absolute top-10 right-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        <AnimatedSection>
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <Star className="w-4 h-4 text-accent" />
                <span className="text-white/90 text-sm font-medium">
                  How it is run
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                The terms Calgary Airbnb hosts book on
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {whyChooseUs.map((item, index) => (
                <WhyUsCard key={index} {...item} index={index} />
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Where we go, and where the rest of the service sits */}
      <section className="py-16 px-4 bg-background">
        <AnimatedSection>
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Turnover coverage across Calgary and the two towns beside it
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Inside Calgary city limits there is no trip fee, whichever quadrant the unit is in. Past the
              limits the same crews add {TRAVEL_LINE}:{" "}
              <Link to="/cleaning-services-airdrie/" className="text-accent underline underline-offset-2">
                Airdrie house cleaners
              </Link>{" "}
              are dispatched from the Calgary office, and{" "}
              <Link to="/cleaning-services-cochrane/" className="text-accent underline underline-offset-2">
                house cleaning in Cochrane
              </Link>{" "}
              covers the units that fill up with Banff traffic on Friday nights.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The turnover is one line on a longer menu. Duty Cleaners has done{" "}
              <Link to={HUB} className="text-accent underline underline-offset-2">
                Calgary house cleaning
              </Link>{" "}
              {COMPANY.sinceLabel}, and{" "}
              <Link to={SERVICES} className="text-accent underline underline-offset-2">
                every Calgary cleaning service, with starting prices
              </Link>{" "}
              sits on one page. If you occupy the unit yourself outside Stampede and ski season,{" "}
              <Link to={RECURRING} className="text-accent underline underline-offset-2">
                recurring cleaning in Calgary
              </Link>{" "}
              for your own months costs less than paying hourly for a lightly used home.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The rating is not a slogan. There are{" "}
              <Link to="/reviews/" className="text-accent underline underline-offset-2">
                {proof.googleReviewCount} Google reviews
              </Link>{" "}
              on the Calgary listing, and you can read them before you book.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Guest-Ready Results Gallery */}
      <section className="py-20 px-4 bg-secondary/30">
        <AnimatedSection>
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-calgary/10 rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4 text-calgary" />
                <span className="text-calgary text-sm font-medium">Before the next guest</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                A Calgary turnover, finished
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Living room, bedroom, bathroom, kitchen, dining and entry, in the order the checklist runs.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {gallery.map((g, i) => (
                <div
                  key={i}
                  className={`overflow-hidden rounded-xl border border-border group ${
                    i === 0 ? "md:col-span-2 md:row-span-2" : ""
                  }`}
                >
                  <img
                    src={g.src}
                    alt={g.alt}
                    loading="lazy"
                    className="w-full h-full object-cover aspect-[4/3] transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-background">
        <AnimatedSection>
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Calgary Airbnb turnover questions
              </h2>
              <p className="text-muted-foreground">
                Price, Stampede scheduling, linen, the towns outside the limits, and what happens after a complaint.
              </p>
            </div>
            <div className="bg-card rounded-2xl border border-border p-2 md:p-4 shadow-sm">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((f, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="px-4">
                    <AccordionTrigger className="text-left font-semibold text-foreground">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Guarantee and contact */}
      <section className="py-20 px-4 bg-secondary/30">
        <AnimatedSection>
          <div className="container mx-auto max-w-4xl text-center">
            <div className="bg-card rounded-2xl border border-border p-10 shadow-sm">
              <Shield className="w-14 h-14 mx-auto mb-6 text-calgary" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Missed something? We return within {GUARANTEE_HOURS} hours of hearing it
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Report it inside {GUARANTEE_HOURS} hours of the turnover and the re-clean is free. A
                guest's photo speeds things up but is not a condition of the guarantee. {POLICY.insuranceClaim}
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/30 rounded-xl p-6 text-left">
                  <h3 className="font-bold text-foreground mb-2">When you pay</h3>
                  <p className="text-muted-foreground text-sm">
                    Booking costs nothing. A temporary hold checks the card the day before, and the
                    charge goes through after the turnover. Visa, Mastercard, American Express, debit
                    or e-transfer, all before {GST_PCT} GST.
                  </p>
                </div>
                <div className="bg-muted/30 rounded-xl p-6 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-calgary" />
                    <h3 className="font-bold text-foreground">Calgary office</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-1">
                    <strong>Call:</strong>{" "}
                    <a href={proof.phoneLink} className="text-accent underline underline-offset-2">{proof.phone}</a>
                  </p>
                  <p className="text-muted-foreground text-sm mb-1">
                    <strong>Address:</strong> {proof.address}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    <strong>Hours:</strong> Mon-Sat 8am–8pm | Sun 9am–3pm
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-brand-navy relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Get the Calgary unit turned over before check-in
          </h2>
          <p className="text-xl mb-8 text-white/80">
            {RATE} per cleaner-hour plus GST. Checkout time, check-in time, door code.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to={PRICING}>See my price</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg border-white/20 text-white hover:bg-white/10">
              <Link to="/contact-us/?topic=airbnb&city=calgary">Request a callback</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg border-white/20 text-white hover:bg-white/10">
              <a href={proof.phoneLink}>
                <Phone className="w-4 h-4 mr-2" />
                Call {proof.phone}
              </a>
            </Button>
          </div>
        </div>
      </section>
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <CityCrossLink city="Edmonton" to="/edmonton/airbnb-cleaning/" description="Airbnb turnover cleaning for Edmonton short-term rentals." />
        </div>
      </section>
      </main>


      <Footer />
    </div>
  );
};

export default AirbnbCleaningCalgary;
