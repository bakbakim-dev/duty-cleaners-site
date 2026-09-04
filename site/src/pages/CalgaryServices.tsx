import { GST_RATE } from "@/data/pricing";
import { RATING_CLAIM } from "@/data/proof";
import LocalMarketNote from "@/components/LocalMarketNote";
import Navigation from "@/components/Navigation";
import { buildServiceSchema } from "@/lib/service-schema";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  Sparkles,
  Home,
  Truck,
  HardHat,
  PaintRoller,
  Briefcase,
  BedDouble,
  Repeat,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  Star,
  MessageSquare,
  Users,
  CheckCircle2,
  ArrowRight,
  Shield,
  Heart
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import calgaryHero from "@/assets/hero-calgary-skyline.webp";
import { Helmet } from "react-helmet-async";
import {
  deepCleanTierRows,
  flatRateFromPrice,
  formatPrice,
  serviceTierRows,
  startingPrice,
  calculateQuote,
  DEFAULT_FREQUENCY,
} from "@/data/pricing";

/* Every published figure comes from the BookingKoala config snapshot. */
const from = (value: number) => `from ${formatPrice(value)}`;

/** These cards print four prices and said nothing about tax. */
const GST_LINE = `Starting prices, before ${Math.round(GST_RATE * 100)}% GST.`;
const RECURRING_FROM = calculateQuote({
  service: "standard",
  homeType: null,
  bedrooms: 1,
  bathrooms: 1,
  halfBaths: 0,
  addOns: [],
  frequency: DEFAULT_FREQUENCY,
}).ongoing;
const STANDARD_FROM = from(flatRateFromPrice());
const DEEP_FROM = `from ${deepCleanTierRows()[0].price}`;
const MOVE_FROM = `from ${serviceTierRows("move-in-out")[0].price}`;
const POST_FROM = from(startingPrice("post-construction"));


type Service = {
  title: string;
  description: string;
  features: string[];
  price: string;
  link: string;
  linkText: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: boolean;
  badge?: string;
};

const services: Service[] = [
  {
    title: "Standard Cleaning",
    description: "A thorough one-time cleaning for your home. Perfect for refreshing your space or maintaining cleanliness on your own schedule.",
    features: [
      "All rooms dusted and vacuumed",
      "Bathrooms properly cleaned and sanitized",
      "Kitchen cleaned (counters, sink, appliance and cabinets exteriors ONLY)",
      "Floors mopped and vacuumed"
    ],
    price: STANDARD_FROM,
    link: "/calgary/regular-cleaning/",
    linkText: "See Standard Cleaning",
    icon: Home,
    badge: "Popular",
    accent: true
  },
  {
    title: "Recurring Cleaning",
    description: "Weekly, bi-weekly or every-4-weeks cleaning to keep your home consistently clean. Your first clean is the standard rate; from the second visit on you save 20% weekly, 15% bi-weekly and 10% every 4 weeks.",
    features: [
      "Recurring maintenance cleaning",
      "Kitchen, bathrooms, and living areas cleaned",
      "Floors vacuumed and mopped"
    ],
    // Both numbers, because BookingKoala charges the standard rate for the
    // first clean and only applies the discount from the second visit.
    price: `${STANDARD_FROM}, then ${formatPrice(RECURRING_FROM)}`,
    link: "/calgary/recurring-cleaning/",
    linkText: "See Recurring Cleaning",
    icon: Repeat,
    accent: true
  },
  {
    title: "Deep Cleaning",
    description: "Thorough cleaning for spring cleaning or special occasions.",
    // Was four bullets: two copied verbatim from the Standard card above and
    // one repeating another inside this card. These are the four scope items
    // the deep-cleaning page itself publishes.
    features: [
      "Everything in a standard clean, plus the build-up a regular visit skips",
      "Tile, grout and shower glass scrubbed; tubs and fixtures descaled",
      "Stovetops, range hoods and cabinet fronts degreased",
      "Baseboards, door frames, switches, outlets and vent covers hand-wiped"
    ],
    price: DEEP_FROM,
    link: "/calgary/deep-cleaning/",
    linkText: "See Deep Cleaning",
    icon: Sparkles,
    accent: true
  },
  {
    title: "Move-In/Move-Out Cleaning",
    // The guarantee page states plainly that we do not guarantee the damage
    // deposit comes back, because a landlord decides that, not us.
    description: "Cleaned to the standard a move-out inspection looks for, or ready to move into.",
    features: [
      "All deep cleaning tasks",
      "Inside all cabinets, drawers, and the kitchen walls",
      "Cleaning of inside and outside appliances",
      "Vacuuming and mopping of all floors, including carpet vacuuming"
    ],
    price: MOVE_FROM,
    link: "/move-out-cleaning-calgary/",
    linkText: "See Move-In/Move-Out Cleaning",
    icon: Truck,
    accent: false
  },
  {
    title: "Post-Construction Cleaning",
    description: "After construction or renovation, our team provides a thorough final cleaning to ensure your space is move-in ready.",
    features: [
      "Thorough dust removal",
      "Cleaning of walls, inside windows, baseboards",
      "Vacuuming and mopping of all floors",
      "Final move-in ready detailing"
    ],
    price: POST_FROM,
    link: "/post-construction-cleaning-calgary/",
    linkText: "See Post-Construction Cleaning",
    icon: HardHat,
    accent: true
  },
  {
    title: "Wall Washing & Cleaning",
    description: "Professional wall washing services to remove dirt, grime, stains, and restore your walls' vibrant appearance.",
    features: [
      "Remove handprints and smudges",
      "Eliminate nicotine tar and smoke residue",
      "Clean dust and cobwebs",
      "Restore wall color vibrancy"
    ],
    price: "Custom Pricing",
    link: "/wall-washing-wall-cleaning-calgary/",
    linkText: "See Wall Washing & Cleaning",
    icon: PaintRoller,
    accent: false
  },
  {
    title: "Airbnb Cleaning Service",
    description: "Fast turnover cleaning for short-term rentals & Airbnb hosts. Guest-ready results guaranteed.",
    features: [
      "Fast turnover cleaning",
      "Laundry & linen reset",
      "Guest-ready preparation",
      "Quick turnaround scheduling"
    ],
    price: "Hourly Cleaning",
    link: "/airbnb-cleaning-services-calgary/",
    linkText: "See Airbnb Cleaning Service",
    icon: BedDouble,
    accent: true
  },
  {
    title: "Commercial Cleaning",
    description: "Professional cleaning for offices, retail spaces, and commercial properties across Calgary.",
    features: [
      "Offices & commercial spaces",
      "Recurring cleaning schedules",
      "Reference-checked, customer-rated cleaners",
      "Flexible scheduling options"
    ],
    price: "Custom Pricing",
    link: "/commercial-cleaning-services-calgary/",
    linkText: "See Commercial Cleaning",
    icon: Briefcase,
    badge: "Professional Service",
    accent: true
  }
];

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  const badge = service.badge;

  return (
    <div
      className="group relative h-full flex flex-col bg-white rounded-2xl shadow-lg p-8 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl border-t-4 border-primary"
    >
      {badge && (
        <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow">
          <Sparkles className="w-3 h-3" /> {badge}
        </div>
      )}

      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 bg-primary/10">
          <Icon className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">{service.title}</h3>
      </div>

      <p className="text-muted-foreground mb-6 leading-relaxed">
        {service.description}
      </p>

      <ul className="space-y-3 mb-8">
        {service.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
            <span className="text-sm text-foreground/80">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="pt-6 border-t border-border/50 mt-auto">
        <div className="text-xl font-bold mb-4 text-primary">
          {service.price}
        </div>
        <Button className="w-full group/btn bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
          <Link to={service.link}>
            {service.linkText}
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function CalgaryServices() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Compare Our Calgary Cleaning Services | Duty Cleaners</title>
        <meta name="description" content="Standard, deep, recurring, move-in/out and post-construction cleaning in Calgary. See your instant price in about 60 seconds." />
        <link rel="canonical" href="https://dutycleaners.ca/calgary/services/" />
        <meta property="og:title" content="Compare Our Calgary Cleaning Services | Duty Cleaners" />
        <meta property="og:description" content="Standard, deep, recurring, move-in/out and post-construction cleaning in Calgary. See your instant price in about 60 seconds." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/calgary/services/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Compare Our Calgary Cleaning Services | Duty Cleaners" />
        <meta name="twitter:description" content="Standard, deep, recurring, move-in/out and post-construction cleaning in Calgary. See your instant price in about 60 seconds." />
        <script type="application/ld+json">
          {JSON.stringify(buildServiceSchema({ name: "House Cleaning Services", description: "Standard, deep, recurring, move-in/out and post-construction cleaning in Calgary. See your instant price in about 60 seconds.", path: "/calgary/services", city: "calgary" }))}
        </script>
      </Helmet>
      <Navigation city="calgary" />
      <main id="main-content" tabIndex={-1}>
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>
      
      {/* Hero Section */}
      <section className="relative py-20 bg-brand-navy overflow-hidden">
        <img width={1920} height={1080}
          src={calgaryHero}
          alt="Calgary skyline"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
         loading="eager" fetchPriority="high"/>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/70 via-brand-navy/60 to-brand-navy/80" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-white/90 text-sm font-medium">Professional Cleaning Services</span>
            </div>
            
            <h1 className="display-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Our Cleaning Services in{" "}
              <span className="text-accent">Calgary</span>
            </h1>
            
            <p className="text-xl text-white/80 leading-relaxed mb-8">
              Professional cleaning solutions for every need. All services include 
              high-quality products and a satisfaction guarantee.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 text-white/90">
                <Shield className="w-5 h-5 text-accent" />
                <span className="text-sm">Pay After Your Clean</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Heart className="w-5 h-5 text-accent" />
                <span className="text-sm">100% Satisfaction Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Star className="w-5 h-5 text-accent" />
                <span className="text-sm">{RATING_CLAIM}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LocalMarketNote
        accent="calgary"
        eyebrow="Choosing a service in Calgary"
        heading="Which of these you actually need, and how Calgary changes the answer"
        paragraphs={[
          "The honest short version: if the home is lived in and has been cleaned in the last month or two, standard cleaning is the right service and the cheapest one. Deep cleaning is for the build-up standard cleaning does not reach, and in Calgary that build-up has a specific cause — the freeze-thaw cycle means roads get gritted, melt, and get gritted again all winter rather than staying frozen, so sand and de-icer keep coming through the door from November to April. By late winter it is along the baseboards, into carpet edges and under furniture, and a vacuum no longer lifts it.",
          "Where you live shifts the work more than the size of the home does. In a Beltline, Mission or Eau Claire condo the time goes into window tracks, balcony door channels and the fine dust a dry, windy city drives into every seal. In a newer house out in Mahogany, Cranston, Seton or Livingston it is usually construction dust, which keeps resurfacing from vents, closet shelves and the tops of doors for a year or two after handover. The same square footage can be a very different job.",
          "Move-in and move-out cleaning is a separate service, not a bigger version of a deep clean, and it is priced against what property managers actually inspect: inside appliances, inside every cabinet and drawer, and the storage spaces. If you are working to a walk-through date, that is the one to book. If you are not sure which applies, the instant quote will ask a few questions about the home and tell you — and you can call and describe it instead.",
        ]}
      />

      {/* Services Grid */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto items-stretch">
            {services.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
          {/* Four prices on this page and, until now, nothing about tax. */}
          <p className="text-center text-sm text-muted-foreground mt-8">{GST_LINE}</p>
        </div>
      </section>

      {/* Get In Touch Section */}
      <section className="py-20 bg-brand-navy relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <Phone className="w-4 h-4 text-accent" />
              <span className="text-white/90 text-sm font-medium">Contact Us</span>
            </div>
            <h2 className="display-serif text-3xl md:text-4xl font-bold text-white">Get In Touch</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="font-bold text-xl text-white mb-6">Contact Information</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/30">
                    <Phone className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">Phone</p>
                    <a href="tel:4037681341" className="font-semibold text-white hover:text-accent transition-colors">
                      (403) 768-1341
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/30">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">Address</p>
                    <p className="font-semibold text-white">2835 37 Street SW #24, Calgary, AB</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/30">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">Hours</p>
                    <p className="font-semibold text-white">Mon-Sat: 8AM-8PM, Sun: 9AM-3PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="font-bold text-xl text-white mb-6">Quick Links</h3>
              <div className="space-y-4">
                <Link 
                  to="/calgary/pricing/" 
                  className="flex items-center gap-3 text-white/80 hover:text-accent transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/30">
                    <DollarSign className="w-5 h-5 text-accent" />
                  </div>
                  <span className="font-medium">View Pricing</span>
                  <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </Link>
                <Link 
                  to="/reviews/" 
                  className="flex items-center gap-3 text-white/80 hover:text-accent transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/30">
                    <Star className="w-5 h-5 text-accent" />
                  </div>
                  <span className="font-medium">Read Reviews</span>
                  <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </Link>
                <Link 
                  to="/faqs/" 
                  className="flex items-center gap-3 text-white/80 hover:text-accent transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/30">
                    <MessageSquare className="w-5 h-5 text-accent" />
                  </div>
                  <span className="font-medium">Full FAQ</span>
                  <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </Link>
                <Link 
                  to="/about-us/" 
                  className="flex items-center gap-3 text-white/80 hover:text-accent transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/30">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <span className="font-medium">About Us</span>
                  <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
