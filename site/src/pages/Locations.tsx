import { CITY_PROOF } from "@/data/proof";
import { COMPANY, HOMES_CLEANED, RATING_CLAIM } from "@/data/proof";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
const ServiceAreaMap = lazy(() => import("@/components/ServiceAreaMap"));
import { Link } from "react-router-dom";
import { canonicalForPath, withTrailingSlash } from "@/data/legacy-urls";
import heroAlbertaMap from "@/assets/hero-calgary-skyline.webp";
import { Button } from "@/components/ui/button";
import BrandHome from "./BrandHome";
import {
  edmontonNeighborhoods as edmHoods,
  edmontonSurrounding as edmSurrounding,
  calgaryNeighborhoods as calHoods,
  calgarySurrounding as calSurrounding,
} from "@/data/city-locations";
import { 
  Star, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Award, 
  Users, 
  SprayCan, 
  Shield,
  ArrowRight,
  Building2,
  Home,
  Clock,
  WashingMachine
} from "lucide-react";

// Data for location cards
const mainLocations = [
  {
    name: "Edmonton",
    rating: RATING_CLAIM,
    reviews: `${HOMES_CLEANED.edmonton} Edmonton homes cleaned`,
    phone: "(780) 913-6565",
    phoneHref: "tel:7809136565",
    address: "18615 71 Ave NW",
    addressLine2: "Edmonton, AB T5T 2V9",
    experience: `Serving Alberta since ${COMPANY.foundedYear}`,
    homesCleaned: `${HOMES_CLEANED.edmonton} Edmonton homes cleaned`,
    neighbourhoods: [
      { name: "Glenora", link: "/locations/glenora-edmonton/" },
      { name: "Westmount", link: "/locations/westmount-edmonton/" },
      { name: "Glastonbury", link: "/locations/glastonbury/" },
      { name: "Windermere", link: "/cleaning-services-windermere/" },
      { name: "Summerside", link: "/locations/summerside/" },
      { name: "Terwillegar", link: "/locations/terwillegar/" },
      { name: "Riverbend", link: "/locations/riverbend/" },
      { name: "Castle Downs", link: "/locations/castle-downs/" },
      { name: "Old Strathcona", link: "/locations/old-strathcona/" },
      { name: "Garneau", link: "/locations/garneau/" },
    ],
    link: "/",
    linkText: "View Edmonton Services"
  },
  {
    name: "Calgary",
    rating: RATING_CLAIM,
    reviews: `${HOMES_CLEANED.calgary} homes cleaned`,
    phone: "(403) 768-1341",
    phoneHref: "tel:4037681341",
    address: "2835 37 Street SW #24",
    addressLine2: `Calgary, AB ${CITY_PROOF.calgary.postalCode}`,
    experience: `Serving Alberta since ${COMPANY.foundedYear}`,
    homesCleaned: `${HOMES_CLEANED.calgary} Calgary homes cleaned`,
    neighbourhoods: [
      { name: "Kensington", link: "/locations/kensington/" },
      { name: "Tuscany", link: "/locations/tuscany/" },
      { name: "Mahogany", link: "/locations/mahogany/" },
      { name: "Auburn Bay", link: "/locations/auburn-bay/" },
      // Airdrie, Cochrane and Okotoks used to sit here, under a heading that
      // calls this list Calgary neighbourhoods. They are their own
      // municipalities, and the surrounding-communities section below lists
      // them correctly.
      { name: "Aspen Woods", link: "/locations/aspen-woods/" },
      { name: "Cranston", link: "/locations/cranston/" },
      // Both cities have an Inglewood, and this page lists both cities side
      // by side — three chips reading "Inglewood" pointing at two different
      // neighbourhoods. Each page titles itself "Inglewood, Calgary" or
      // "Inglewood, Edmonton"; the links now say the same. Elsewhere the
      // page's own city supplies the context, so the bare name is fine there.
      { name: "Inglewood, Calgary", link: "/locations/inglewood-calgary/" },
      { name: "Bowness", link: "/locations/bowness-calgary/" },
      { name: "Marda Loop", link: "/locations/marda-loop/" },
      { name: "Beltline", link: "/locations/beltline-calgary/" },
    ],
    link: canonicalForPath("/calgary"),
    linkText: "View Calgary Services"
  }
];

// Edmonton region cities
const edmontonRegionCities = [
  { name: "Morinville", link: "/cleaning-services-morinville/" },
  { name: "Sherwood Park", link: "/cleaning-services-sherwood-park/" },
  { name: "St. Albert", link: "/cleaning-services-st-albert/" },
  { name: "Windermere", link: "/cleaning-services-windermere/" },
  { name: "Stony Plain", link: "/cleaning-services-stony-plain/" },
  { name: "Devon", link: "/cleaning-services-devon/" },
  { name: "Spruce Grove", link: "/cleaning-services-spruce-grove/" },
  { name: "Beaumont", link: "/cleaning-services-beaumont/" },
  { name: "Leduc", link: "/cleaning-services-leduc/" },
  { name: "Fort Saskatchewan", link: "/cleaning-services-fort-saskatchewan/" }
];

// Edmonton neighbourhoods
const edmontonNeighborhoods = [
  { name: "Castle Downs", link: "/locations/castle-downs/" },
  { name: "Inglewood, Edmonton", link: "/locations/inglewood/" },
  { name: "Delton", link: "/locations/delton/" },
  { name: "Allendale", link: "/locations/allendale/" },
  { name: "Londonderry", link: "/locations/londonderry/" },
  { name: "Spruce Avenue", link: "/locations/spruce-avenue/" },
  { name: "Hazeldean", link: "/locations/hazeldean/" },
  { name: "Montrose", link: "/locations/montrose/" },
  { name: "Bannerman", link: "/locations/bannerman/" },
  { name: "McConachie", link: "/locations/mcconachie-edmonton/" },
  { name: "Balwin", link: "/locations/balwin-edmonton/" },
  { name: "Capilano", link: "/locations/capilano-edmonton/" },
  { name: "Bellevue", link: "/locations/bellevue-edmonton/" },
  { name: "Secord", link: "/locations/secord-edmonton/" },
  { name: "Pleasantview", link: "/locations/pleasantview/" },
  { name: "Hairsine", link: "/locations/hairsine-edmonton/" },
  { name: "Prince Charles", link: "/locations/prince-charles-edmonton/" },
  { name: "Lauderdale", link: "/locations/lauderdale/" },
  { name: "Mayfield", link: "/locations/mayfield-edmonton/" },
  { name: "Rapperswill", link: "/locations/rapperswill-edmonton/" },
  { name: "McCauley", link: "/locations/mccauley-edmonton/" },
  { name: "Central McDougall", link: "/locations/central-mcdougall-edmonton/" },
  { name: "Westmount", link: "/locations/westmount-edmonton/" },
  { name: "Brookside", link: "/locations/brookside-edmonton/" },
  { name: "Kildare", link: "/locations/kildare-edmonton/" },
  { name: "Grovenor", link: "/locations/grovenor/" },
  { name: "Ambleside", link: "/locations/ambleside-edmonton/" },
  { name: "Abbottsfield", link: "/locations/abbottsfield-edmonton/" },
  { name: "Griesbach", link: "/locations/griesbach-edmonton/" },
  { name: "Eastwood", link: "/locations/eastwood-edmonton/" },
  { name: "Sherbrooke", link: "/locations/sherbrooke-edmonton/" },
  { name: "Avonmore", link: "/locations/avonmore-edmonton/" },
  { name: "Dovercourt", link: "/locations/dovercourt-edmonton/" },
  { name: "Canora", link: "/locations/canora-edmonton/" },
  { name: "Downtown", link: "/locations/downtown-edmonton/" },
  { name: "Belvedere", link: "/locations/belvedere-edmonton/" },
  { name: "Greenfield", link: "/locations/greenfield-edmonton/" },
  { name: "Boyle Street", link: "/locations/boyle-street-edmonton/" },
  { name: "Ottewell", link: "/locations/ottewell-edmonton/" },
  { name: "Beacon Heights", link: "/locations/beacon-heights-edmonton/" },
  { name: "Riverdale", link: "/locations/riverdale-edmonton/" },
  { name: "Bonnie Doon", link: "/locations/bonnie-doon-edmonton/" },
  { name: "Queen Alexandra", link: "/locations/queen-alexandra-edmonton/" },
  { name: "Glenora", link: "/locations/glenora-edmonton/" },
  { name: "Glenwood", link: "/locations/glenwood-edmonton/" },
  { name: "Evansdale", link: "/locations/evansdale-edmonton/" },
  { name: "Belmont", link: "/locations/belmont-edmonton/" },
  { name: "Casselman", link: "/locations/casselman-edmonton/" },
  { name: "Brintnell", link: "/locations/brintnell-edmonton/" },
  { name: "Holyrood", link: "/locations/holyrood-edmonton/" },
  { name: "Delwood", link: "/locations/delwood-edmonton/" },
  { name: "Hollick-Kenyon", link: "/locations/hollick-kenyon-edmonton/" },
  { name: "Aspen Gardens", link: "/locations/aspen-gardens-edmonton/" },
  { name: "Woodcroft", link: "/locations/woodcroft-edmonton/" },
  { name: "Kilkenny", link: "/locations/kilkenny-edmonton/" },
  { name: "Lago Lindo", link: "/locations/lago-lindo-edmonton/" },
  { name: "Miller", link: "/locations/miller-edmonton/" },
  { name: "Matt Berry", link: "/locations/matt-berry-edmonton/" },
  { name: "Ozerna", link: "/locations/ozerna-edmonton/" },
  { name: "Glengarry", link: "/locations/glengarry-edmonton/" },
  { name: "Hermitage", link: "/locations/hermitage-edmonton/" },
  { name: "McLeod", link: "/locations/mcleod-edmonton/" },
  { name: "Summerside", link: "/locations/summerside/" },
  { name: "Terwillegar", link: "/locations/terwillegar/" },
  { name: "Riverbend", link: "/locations/riverbend/" },
  { name: "Lewis Estates", link: "/locations/lewis-estates/" },
  { name: "Glastonbury", link: "/locations/glastonbury/" },
  { name: "Clareview", link: "/locations/clareview/" },
  { name: "Old Strathcona", link: "/locations/old-strathcona/" },
  { name: "Garneau", link: "/locations/garneau/" },
  { name: "Tamarack", link: "/locations/tamarack-edmonton/" },
  { name: "Laurel", link: "/locations/laurel-edmonton/" },
  { name: "Larkspur", link: "/locations/larkspur-edmonton/" },
  { name: "Maple Ridge", link: "/locations/maple-ridge-edmonton/" },
  { name: "York", link: "/locations/york-edmonton/" },
  { name: "Eaux Claires", link: "/locations/eaux-claires-edmonton/" },
  { name: "Schonsee", link: "/locations/schonsee-edmonton/" },
  { name: "Northmount", link: "/locations/northmount-edmonton/" },
  { name: "Rosslyn", link: "/locations/rosslyn-edmonton/" }
];

// Calgary region cities
const calgaryRegionCities = [
  { name: "Airdrie", link: "/cleaning-services-airdrie/" },
  { name: "Black Diamond", link: "/locations/black-diamond/" },
  { name: "Chestermere", link: "/locations/chestermere/" },
  { name: "Cochrane", link: "/cleaning-services-cochrane/" },
  { name: "Crossfield", link: "/locations/crossfield/" },
  { name: "High River", link: "/locations/high-river/" },
  { name: "Langdon", link: "/locations/langdon/" },
  { name: "Okotoks", link: "/locations/okotoks/" },
  { name: "Strathmore", link: "/locations/strathmore/" },
  { name: "Turner Valley", link: "/locations/turner-valley/" }
];

// Calgary neighbourhoods
const calgaryNeighborhoods = [
  { name: "Kensington", link: "/locations/kensington/" },
  { name: "Tuscany", link: "/locations/tuscany/" },
  { name: "Arbour Lake", link: "/locations/arbour-lake/" },
  { name: "Scenic Acres", link: "/locations/scenic-acres/" },
  { name: "Skyview Ranch", link: "/locations/skyview-ranch/" },
  { name: "Cityscape", link: "/locations/cityscape/" },
  { name: "Marlborough", link: "/locations/marlborough/" },
  { name: "Saddle Ridge", link: "/locations/saddle-ridge/" },
  { name: "Mission", link: "/locations/mission/" },
  { name: "Mount Royal", link: "/locations/mount-royal/" },
  { name: "Aspen Woods", link: "/locations/aspen-woods/" },
  { name: "Marda Loop", link: "/locations/marda-loop/" },
  { name: "Mahogany", link: "/locations/mahogany/" },
  { name: "Auburn Bay", link: "/locations/auburn-bay/" },
  { name: "Inglewood, Calgary", link: "/locations/inglewood-calgary/" },
  { name: "Cranston", link: "/locations/cranston/" },
  { name: "Brentwood", link: "/locations/brentwood-calgary/" },
  { name: "Varsity", link: "/locations/varsity-calgary/" },
  { name: "Dalhousie", link: "/locations/dalhousie-calgary/" },
  { name: "Bowness", link: "/locations/bowness-calgary/" },
  { name: "Capitol Hill", link: "/locations/capitol-hill-calgary/" },
  { name: "Hillhurst", link: "/locations/hillhurst-calgary/" },
  { name: "Beltline", link: "/locations/beltline-calgary/" },
  { name: "East Village", link: "/locations/east-village-calgary/" },
  { name: "Downtown West End", link: "/locations/downtown-west-end-calgary/" },
  { name: "Eau Claire", link: "/locations/eau-claire-calgary/" },
  { name: "Sunnyside", link: "/locations/sunnyside-calgary/" },
  { name: "Bridgeland-Riverside", link: "/locations/bridgeland-riverside-calgary/" },
  { name: "Crescent Heights", link: "/locations/crescent-heights-calgary/" },
  { name: "Renfrew", link: "/locations/renfrew-calgary/" },
  { name: "Sunalta", link: "/locations/sunalta-calgary/" },
  { name: "Shaganappi", link: "/locations/shaganappi-calgary/" },
  { name: "Killarney-Glengarry", link: "/locations/killarney-glengarry-calgary/" },
  { name: "Richmond", link: "/locations/richmond-calgary/" },
  { name: "Bankview", link: "/locations/bankview-calgary/" },
  { name: "Lower Mount Royal", link: "/locations/lower-mount-royal-calgary/" },
  { name: "Ramsay", link: "/locations/ramsay-calgary/" },
  { name: "Erlton", link: "/locations/erlton-calgary/" },
  { name: "Victoria Park", link: "/locations/victoria-park-calgary/" },
  { name: "West", link: "/locations/west-calgary/" },
  { name: "Elbow Park", link: "/locations/elbow-park-calgary/" },
  { name: "Altadore", link: "/locations/altadore-calgary/" },
  { name: "Cliff Bungalow", link: "/locations/cliff-bungalow-calgary/" },
  { name: "Rideau Park", link: "/locations/rideau-park-calgary/" },
  { name: "Roxboro", link: "/locations/roxboro-calgary/" },
  { name: "Parkhill", link: "/locations/parkhill-calgary/" },
  { name: "Stanley Park", link: "/locations/stanley-park-calgary/" },
  { name: "Manchester", link: "/locations/manchester-calgary/" },
  { name: "Windsor Park", link: "/locations/windsor-park-calgary/" },
  { name: "Meadowlark Park", link: "/locations/meadowlark-park-calgary/" },
  { name: "Mayfair", link: "/locations/mayfair-calgary/" },
  { name: "Scarboro", link: "/locations/scarboro-calgary/" },
  { name: "Sunalta West", link: "/locations/sunalta-west-calgary/" },
  { name: "Spruce Cliff", link: "/locations/spruce-cliff-calgary/" },
  { name: "Wildwood", link: "/locations/wildwood-calgary/" },
  { name: "Montgomery", link: "/locations/montgomery-calgary/" },
  { name: "Greenview", link: "/locations/greenview-calgary/" },
  { name: "Highland Park", link: "/locations/highland-park-calgary/" },
  { name: "Tuxedo Park", link: "/locations/tuxedo-park-calgary/" },
  { name: "Mount Pleasant", link: "/locations/mount-pleasant-calgary/" },
  { name: "Thorncliffe", link: "/locations/thorncliffe-calgary/" },
  { name: "Huntington Hills", link: "/locations/huntington-hills-calgary/" },
  { name: "Forest Lawn", link: "/locations/forest-lawn-calgary/" },
  { name: "Ogden", link: "/locations/ogden-calgary/" },
  { name: "Southwood", link: "/locations/southwood-calgary/" },
  { name: "Lakeview", link: "/locations/lakeview-calgary/" }
];

// Coverage counts pulled from the single source of truth in city-locations.ts
const coverageByCity: Record<string, { neighbourhoods: number; surrounding: number }> = {
  Edmonton: { neighbourhoods: edmHoods.length, surrounding: edmSurrounding.length },
  Calgary: { neighbourhoods: calHoods.length, surrounding: calSurrounding.length },
};

// Location Card Component
function LocationCard({ location }: { location: typeof mainLocations[0] }) {
  const coverage = coverageByCity[location.name];
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.address}, ${location.addressLine2}`)}`;
  return (
    <div 
      className="group bg-brand-navy rounded-2xl shadow-lg p-8 text-white transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl border border-white/10 relative overflow-hidden"
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-6 relative z-10">
        <div>
          <h2 className="text-3xl font-bold mb-3 text-white">{location.name}</h2>
          <div className="flex items-center gap-2 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-accent text-accent" />
            ))}
            <span className="text-xl font-bold ml-2 text-white">{location.rating}</span>
          </div>
          <p className="text-white/90">{location.reviews}</p>
        </div>
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
          {location.name === "Edmonton" ? <SprayCan className="w-8 h-8 text-accent" /> : <WashingMachine className="w-8 h-8 text-accent" />}
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-4 mb-6 relative z-10">
        <div className="flex items-center gap-4 group/item">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center transition-all duration-300 group-hover/item:scale-110">
            <Phone className="w-5 h-5 text-accent" />
          </div>
          <a href={location.phoneHref} className="text-xl font-bold text-white hover:text-accent transition-colors hover:underline">
            {location.phone}
          </a>
        </div>

        <div className="flex items-start gap-4 group/item">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center transition-all duration-300 group-hover/item:scale-110">
            <MapPin className="w-5 h-5 text-accent" />
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline underline-offset-4 decoration-accent/60"
          >
            <div className="font-semibold text-white">{location.address}</div>
            <div className="text-white/90">{location.addressLine2}</div>
          </a>
        </div>
      </div>

      {/* Experience Stats */}
      <div className="bg-white/5 rounded-xl p-5 mb-6 border border-white/10 relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="w-5 h-5 text-accent" />
          <span className="text-sm font-semibold text-white/90">{location.experience}</span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <Home className="w-5 h-5 text-accent" />
          <span className="text-xl font-bold text-white">{location.homesCleaned}</span>
        </div>
        {coverage && (
          <div className="flex items-center gap-3 pt-2 border-t border-white/10">
            <MapPin className="w-5 h-5 text-accent" />
            <span className="text-sm font-semibold text-white/90">
              {coverage.neighbourhoods} neighbourhoods + {coverage.surrounding} surrounding communities
            </span>
          </div>
        )}
      </div>

      {/* Neighborhoods */}
      <div className="mb-6 relative z-10">
        <h3 className="font-bold text-lg mb-3 text-white">Key Neighborhoods Served:</h3>
        <div className="flex flex-wrap gap-2">
          {location.neighbourhoods.map(area => (
            <Link 
              key={area.name}
              to={withTrailingSlash(area.link)}
              className="bg-white/5 text-white/90 border border-white/10 px-3 py-1.5 rounded-full text-sm font-medium transition-colors hover:bg-white/15 hover:text-white hover:underline"
            >
              {area.name}
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <Button asChild size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base h-12 shadow-md hover:shadow-lg transition-all group/btn relative z-10">
        <Link to={withTrailingSlash(location.link)}>
          {location.linkText}
          <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </Button>
    </div>
  );
}

// Region Link Component
function RegionLink({ name, link, variant = "edmonton" }: { name: string; link: string; variant?: "edmonton" | "calgary" }) {
  const colorClasses = variant === "edmonton" 
    ? "bg-white/80 hover:bg-primary/10 border-primary/20 hover:border-primary text-foreground"
    : "bg-white/80 hover:bg-accent/10 border-accent/20 hover:border-accent text-foreground";
  
  return (
    <Link 
      to={withTrailingSlash(link)} 
      className={`group rounded-xl p-4 text-center transition-all duration-300 border ${colorClasses} hover:-translate-y-1 hover:shadow-md`}
    >
      <h3 className="font-semibold">{name}</h3>
    </Link>
  );
}

// Neighborhood Link Component  
function NeighborhoodLink({ name, link, variant = "edmonton" }: { name: string; link: string; variant?: "edmonton" | "calgary" }) {
  const colorClasses = variant === "edmonton"
    ? "hover:bg-primary/10 hover:border-primary/30 hover:text-primary"
    : "hover:bg-accent/10 hover:border-accent/30 hover:text-accent";
  
  return (
    <Link 
      to={withTrailingSlash(link)} 
      className={`bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center transition-all duration-300 border border-white/50 ${colorClasses} hover:-translate-y-0.5`}
    >
      <h3 className="font-medium text-sm">{name}</h3>
    </Link>
  );
}

export default function Locations() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>House Cleaning Locations in Alberta | Duty Cleaners</title>
        <meta name="description" content="Trusted house cleaning across Alberta: Edmonton, Calgary and surrounding towns. Reference-checked, customer-rated cleaners." />
        <link rel="canonical" href="https://dutycleaners.ca/locations/" />
        <meta property="og:title" content="House Cleaning Locations in Alberta | Duty Cleaners" />
        <meta property="og:description" content="Trusted house cleaning across Alberta: Edmonton, Calgary and surrounding towns. Reference-checked, customer-rated cleaners." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/locations/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="House Cleaning Locations in Alberta | Duty Cleaners" />
        <meta name="twitter:description" content="Trusted house cleaning across Alberta: Edmonton, Calgary and surrounding towns. Reference-checked, customer-rated cleaners." />
      </Helmet>
      <Navigation />
      <main id="main-content" tabIndex={-1}>
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 bg-brand-navy overflow-hidden">
        {/* Alberta Map Background */}
        <img width={1920} height={1080}
          src={heroAlbertaMap}
          alt="Calgary skyline showing the iconic city tower and downtown"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 pointer-events-none"
         loading="eager" fetchPriority="high"/>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/90 via-brand-navy/75 to-brand-navy/90" />

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Building2 className="w-4 h-4 text-accent" />
              <span className="text-white/90 text-sm font-medium">Serving Alberta</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Our Service <span className="text-accent">Locations</span>
            </h1>
            
            <p className="text-xl text-white/80 leading-relaxed mb-10">
              Professional House Cleaning Services Across Alberta
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full border border-white/20">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <span className="font-medium text-white">Pay After Your Clean</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full border border-white/20">
                <Award className="w-5 h-5 text-accent" />
                <span className="font-medium text-white">4.9 on Google</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full border border-white/20">
                <Users className="w-5 h-5 text-accent" />
                {/* "10+ Years Combined Experience" had no source anywhere in
                    the codebase (see src/data/proof.ts). The founding year is
                    the real, verifiable fact used everywhere else.

                    "Licensed" was dropped from here and four other surfaces:
                    proof.ts carries no licence field, and policy.ts warns that
                    the legacy "licensed, insured and bonded" claim is not the
                    true position and must not be reintroduced. A municipal
                    business licence is probably real, but nothing in the repo
                    sources it, and in this trade "licensed" reads as the wider
                    claim. The founding year alone is backed. */}
                <span className="font-medium text-white">Operating in Alberta Since 2017</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Location Cards */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Main Offices</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Visit our offices for professional cleaning services
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {mainLocations.map(location => (
              <LocationCard key={location.name} location={location} />
            ))}
          </div>
        </div>
      </section>

      {/* Edmonton Region Cities */}
      <section className="py-20 bg-brand-navy relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-white/90 text-sm font-medium">Edmonton Region</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Edmonton Region Cleaning Services</h2>
            <p className="text-white/90 max-w-3xl mx-auto">
              Professional house cleaning services in Edmonton and surrounding communities
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {edmontonRegionCities.map(city => (
              <RegionLink key={city.name} name={city.name} link={city.link} variant="edmonton" />
            ))}
          </div>
        </div>
      </section>

      {/* Edmonton Neighborhoods */}
      <section className="py-20 bg-gradient-to-b from-secondary/30 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Edmonton Neighborhoods</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              We serve all Edmonton neighbourhoods with professional cleaning services
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-6xl mx-auto">
            {edmontonNeighborhoods.map(neighbourhood => (
              <NeighborhoodLink 
                key={neighbourhood.name} 
                name={neighbourhood.name} 
                link={neighbourhood.link} 
                variant="edmonton" 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Google Map */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-foreground text-sm font-medium">Service Coverage</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Service Area</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              We proudly serve communities across Alberta’s main corridor between its two largest cities.
            </p>
          </div>

          <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-xl border border-primary/10">
            <Suspense fallback={<div className="w-full h-[500px] bg-muted animate-pulse rounded-2xl" />}>
              <ServiceAreaMap />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Calgary Region Cities */}
      <section className="py-20 bg-brand-navy relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-white/90 text-sm font-medium">Calgary Region</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Calgary Region Cleaning Services</h2>
            <p className="text-white/90 max-w-3xl mx-auto">
              Professional house cleaning services in Calgary and surrounding communities
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {calgaryRegionCities.map(city => (
              <RegionLink key={city.name} name={city.name} link={city.link} variant="calgary" />
            ))}
          </div>
        </div>
      </section>

      {/* Calgary Neighborhoods */}
      <section className="py-20 bg-gradient-to-b from-secondary/30 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Calgary Neighborhoods</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              We serve all Calgary neighbourhoods with professional cleaning services
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-6xl mx-auto">
            {calgaryNeighborhoods.map(neighbourhood => (
              <NeighborhoodLink 
                key={neighbourhood.name} 
                name={neighbourhood.name} 
                link={neighbourhood.link} 
                variant="calgary" 
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-navy relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-white/90 text-sm font-medium">Satisfaction Guaranteed</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Experience a <span className="text-accent">Cleaner Home</span>?
            </h2>
            
            <p className="text-xl text-white/80 mb-10">
              Book your professional cleaning service today and enjoy the comfort of a spotless home.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link to="/">
                  <Phone className="w-5 h-5 mr-2" />
                  Book Edmonton
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Link to="/cleaning-services-calgary/">
                  <Phone className="w-5 h-5 mr-2" />
                  Book Calgary
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Supporting brand content, below the directory it exists to support.
          This used to render ABOVE everything, which pushed this page's real
          <h1> behind ~20 marketing headings and made a directory page read as a
          second homepage. Embedded mode renders no Helmet and no nav. */}
      <BrandHome hideFooter />
      </main>

      <Footer />
    </div>
  );
}
