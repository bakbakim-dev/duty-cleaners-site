import { CITY_PROOF } from "@/data/proof";
import { COMPANY, RATING_CLAIM } from "@/data/proof";
import { formatPrice } from "@/data/pricing";
import { travelFee } from "@/data/addon-table";
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
  Calculator,
  ArrowRight,
  Building2,
  WashingMachine
} from "lucide-react";

/** Charged per visit outside either city's limits; read from bk-config. */
const TRAVEL_FEE = formatPrice(travelFee("standard") ?? 0);

// Data for location cards.
//
// Each card used to carry its homes-cleaned figure twice, once under the star
// rating and once again in the stats box directly below it, word for word. Both
// cards also carried the identical "Serving Alberta since 2017", which the hero
// badge above already states once. Each proof now appears once.
//
// The stats box then read "4,000+ Edmonton homes cleaned" and "1,000+ Calgary
// homes cleaned", a split the owner never confirmed: the confirmed figure is
// 5,000+ bookings, Alberta-wide (proof.ts BOOKINGS). It now shows the review
// count each city's own Google listing carries.
const mainLocations = [
  {
    name: "Edmonton",
    rating: RATING_CLAIM,
    phone: CITY_PROOF.edmonton.phone,
    phoneHref: CITY_PROOF.edmonton.phoneLink,
    address: CITY_PROOF.edmonton.streetAddress,
    addressLine2: `Edmonton, AB ${CITY_PROOF.edmonton.postalCode}`,
    reviews: `${CITY_PROOF.edmonton.googleReviewCount} Google reviews`,
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
    linkText: "View Edmonton Services",
    pricing: { to: "/pricing/", label: "the full Edmonton price list" },
  },
  {
    name: "Calgary",
    rating: RATING_CLAIM,
    phone: CITY_PROOF.calgary.phone,
    phoneHref: CITY_PROOF.calgary.phoneLink,
    address: CITY_PROOF.calgary.streetAddress,
    addressLine2: `Calgary, AB ${CITY_PROOF.calgary.postalCode}`,
    reviews: `${CITY_PROOF.calgary.googleReviewCount} Google reviews`,
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
    linkText: "View Calgary Services",
    pricing: { to: "/calgary/pricing/", label: "Calgary house cleaning prices by home size" },
  }
];

// Edmonton region towns. Every one sits outside Edmonton city limits, which is
// why Windermere — an Edmonton neighbourhood — no longer appears here.
const edmontonRegionCities = [
  { name: "Morinville", link: "/cleaning-services-morinville/" },
  { name: "Sherwood Park", link: "/cleaning-services-sherwood-park/" },
  { name: "St. Albert", link: "/cleaning-services-st-albert/" },
  { name: "Stony Plain", link: "/cleaning-services-stony-plain/" },
  { name: "Devon", link: "/cleaning-services-devon/" },
  { name: "Spruce Grove", link: "/cleaning-services-spruce-grove/" },
  { name: "Beaumont", link: "/cleaning-services-beaumont/" },
  { name: "Leduc", link: "/cleaning-services-leduc/" },
  { name: "Fort Saskatchewan", link: "/cleaning-services-fort-saskatchewan/" }
];

// Edmonton neighbourhoods
const edmontonNeighborhoods = [
  { name: "Windermere", link: "/cleaning-services-windermere/" },
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
  // Black Diamond and Turner Valley amalgamated as Diamond Valley on
  // 1 January 2023 (content prompt A2); each keeps its page, named both ways.
  { name: "Black Diamond (Diamond Valley)", link: "/locations/black-diamond/" },
  { name: "Chestermere", link: "/locations/chestermere/" },
  { name: "Cochrane", link: "/cleaning-services-cochrane/" },
  { name: "Crossfield", link: "/locations/crossfield/" },
  { name: "High River", link: "/locations/high-river/" },
  { name: "Langdon", link: "/locations/langdon/" },
  { name: "Okotoks", link: "/locations/okotoks/" },
  { name: "Strathmore", link: "/locations/strathmore/" },
  { name: "Turner Valley (Diamond Valley)", link: "/locations/turner-valley/" }
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

/** The services both offices sell, linked per city so a reader lands on the right price. */
const SERVICE_LINKS = [
  { service: "Standard cleaning", edmonton: "/edmonton/regular-cleaning/", calgary: "/calgary/regular-cleaning/" },
  { service: "Recurring cleaning", edmonton: "/edmonton/recurring-cleaning/", calgary: "/calgary/recurring-cleaning/" },
  { service: "Deep cleaning", edmonton: "/edmonton/deep-cleaning/", calgary: "/calgary/deep-cleaning/" },
  { service: "Move-out cleaning", edmonton: "/move-out-cleaning-edmonton/", calgary: "/move-out-cleaning-calgary/" },
  { service: "Post-construction cleaning", edmonton: "/post-construction-cleaning/", calgary: "/post-construction-cleaning-calgary/" },
  { service: "Wall washing", edmonton: "/wall-washing-wall-cleaning/", calgary: "/wall-washing-wall-cleaning-calgary/" },
  { service: "Airbnb cleaning", edmonton: "/edmonton/airbnb-cleaning/", calgary: "/airbnb-cleaning-services-calgary/" },
];

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
            {/* Five filled stars beside a 4.9 read as a rating rounded up to 5. */}
            <Star className="w-5 h-5 fill-accent text-accent" aria-hidden="true" />
            <span className="text-xl font-bold ml-2 text-white">{location.rating}</span>
          </div>
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

      {/* Coverage stats */}
      <div className="bg-white/5 rounded-xl p-5 mb-6 border border-white/10 relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <Star className="w-5 h-5 text-accent" aria-hidden="true" />
          <span className="text-xl font-bold text-white">{location.reviews}</span>
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
        <h3 className="font-bold text-lg mb-3 text-white">Neighbourhoods served</h3>
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

      <p className="mb-6 text-sm text-white/80 relative z-10">
        Prices are flat by home size, before GST:{" "}
        <Link to={location.pricing.to} className="text-accent underline underline-offset-2">
          {location.pricing.label}
        </Link>
        .
      </p>

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

/**
 * Town anchors say what the destination is. Every one of these was a bare town
 * name, so nothing on this page told a crawler the pages were about cleaning.
 * The wording rotates so the anchors are not one string repeated 19 times.
 */
const TOWN_ANCHORS = [
  (name: string) => `House cleaning in ${name}`,
  (name: string) => `${name} house cleaners`,
  (name: string) => `Cleaning services in ${name}`,
  (name: string) => `${name} cleaning company`,
];

// Region Link Component
function RegionLink({ name, link, index, variant = "edmonton" }: { name: string; link: string; index: number; variant?: "edmonton" | "calgary" }) {
  const colorClasses = variant === "edmonton"
    ? "bg-white/80 hover:bg-primary/10 border-primary/20 hover:border-primary text-foreground"
    : "bg-white/80 hover:bg-accent/10 border-accent/20 hover:border-accent text-foreground";

  return (
    <Link
      to={withTrailingSlash(link)}
      className={`group rounded-xl p-4 text-center transition-all duration-300 border ${colorClasses} hover:-translate-y-1 hover:shadow-md`}
    >
      <h3 className="font-semibold">{TOWN_ANCHORS[index % TOWN_ANCHORS.length](name)}</h3>
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

const TITLE = "House Cleaning Locations in Alberta | Duty Cleaners";
const DESCRIPTION =
  "House cleaning in Edmonton, Calgary and the towns around each, from two offices, with no travel fee inside city limits and reference-checked cleaners.";

export default function Locations() {
  const calgaryQuote = `${canonicalForPath("/calgary")}#quote`;
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href="https://dutycleaners.ca/locations/" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/locations/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
      </Helmet>
      <Navigation />
      <main id="main-content" tabIndex={-1}>
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 bg-brand-navy overflow-hidden">
        <img width={1920} height={1080}
          src={heroAlbertaMap}
          alt="City skyline at dusk seen across the river, with downtown towers lit"
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

            {/* "Our Service Locations" named no place, on the one page whose
                whole job is naming places. */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              House cleaning in <span className="text-accent">Edmonton and Calgary</span>, and the
              Alberta towns around each
            </h1>

            <p className="text-xl text-white/80 leading-relaxed mb-10">
              Each city has its own office and its own price list, and a travel fee applies only
              outside city limits. Every neighbourhood and town the two offices cover is listed by
              city, each linked to its own page.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full border border-white/20">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <span className="font-medium text-white">Pay After Your Clean</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full border border-white/20">
                <Award className="w-5 h-5 text-accent" />
                <span className="font-medium text-white">{RATING_CLAIM}</span>
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
                <span className="font-medium text-white">Operating in Alberta Since {COMPANY.foundedYear}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Location Cards. This page used to show the same two cards a
          second time under "Choose Your Location", inside a pasted copy of the
          homepage; the office block now appears once. */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Two offices: Edmonton and Calgary</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Call the office for your city, or see your price online in about a minute. Nothing is
              charged until the clean is done.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {mainLocations.map(location => (
              <LocationCard key={location.name} location={location} />
            ))}
          </div>
        </div>
      </section>

      {/* Services, linked per city */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">The same services in both cities</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Each service has its own page per city, with its prices. Start with{" "}
                <Link to="/services/" className="text-primary underline underline-offset-2">
                  all Edmonton cleaning services and prices
                </Link>{" "}
                or{" "}
                <Link to="/calgary/services/" className="text-primary underline underline-offset-2">
                  every Calgary cleaning service, with starting prices
                </Link>
                , and check{" "}
                <Link to="/whats-included/" className="text-primary underline underline-offset-2">
                  what's included
                </Link>{" "}
                before you compare.
              </p>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-border bg-white">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="bg-brand-navy text-white">
                    <th scope="col" className="px-5 py-3 text-left font-semibold">Service</th>
                    <th scope="col" className="px-5 py-3 text-left font-semibold">Edmonton</th>
                    <th scope="col" className="px-5 py-3 text-left font-semibold">Calgary</th>
                  </tr>
                </thead>
                <tbody>
                  {SERVICE_LINKS.map((row) => (
                    <tr key={row.service} className="border-t border-border/60">
                      <th scope="row" className="px-5 py-3 text-left font-medium text-foreground">{row.service}</th>
                      <td className="px-5 py-3">
                        <Link to={row.edmonton} className="text-primary underline underline-offset-2">
                          {row.service} in Edmonton
                        </Link>
                      </td>
                      <td className="px-5 py-3">
                        <Link to={row.calgary} className="text-primary underline underline-offset-2">
                          {row.service} in Calgary
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
              The Edmonton office also cleans homes in the nine communities around the city. Every
              one of them sits outside Edmonton city limits, so a {TRAVEL_FEE} travel fee, before GST, is added
              per visit on a home clean. It shows on your quote before you book.
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {edmontonRegionCities.map((city, index) => (
              <RegionLink key={city.name} name={city.name} link={city.link} index={index} variant="edmonton" />
            ))}
          </div>
        </div>
      </section>

      {/* Edmonton Neighborhoods */}
      <section className="py-20 bg-gradient-to-b from-secondary/30 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Edmonton Neighbourhoods</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Each of these Edmonton neighbourhoods is inside city limits, so none carries a travel fee.
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
              The Calgary office also cleans homes in the nine communities around the city. All
              nine are outside Calgary city limits, which adds the same {TRAVEL_FEE} travel fee, before GST, per
              visit on a home clean, shown on the quote before you book. Black Diamond and Turner
              Valley each keep their own page, but they have been one town, Diamond Valley, since
              1 January 2023.
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {calgaryRegionCities.map((city, index) => (
              <RegionLink key={city.name} name={city.name} link={city.link} index={index} variant="calgary" />
            ))}
          </div>
        </div>
      </section>

      {/* Calgary Neighborhoods */}
      <section className="py-20 bg-gradient-to-b from-secondary/30 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Calgary Neighbourhoods</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              The Calgary neighbourhoods are all inside city limits, so none of them carries a travel fee.
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

      {/* Interactive Google Map */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-foreground text-sm font-medium">Service Coverage</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Where the Edmonton and Calgary offices clean</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              The map shows both cities and the communities around each. Red Deer is served too:
              to book a Red Deer clean, call the Edmonton office at {CITY_PROOF.edmonton.phone} or
              the Calgary office at {CITY_PROOF.calgary.phone} and confirm the travel charge. For any
              other address that is not listed, call the Edmonton or Calgary office and ask.
            </p>
          </div>

          <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-xl border border-primary/10">
            <Suspense fallback={<div className="w-full h-[500px] bg-muted animate-pulse rounded-2xl" />}>
              <ServiceAreaMap />
            </Suspense>
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
              <Star className="w-4 h-4 text-accent" />
              <span className="text-white/90 text-sm font-medium">{RATING_CLAIM}</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              See your price in Edmonton or Calgary
            </h2>

            <p className="text-xl text-white/80 mb-10">
              Pick your city, answer a few questions about the home, and the price is on screen
              before you book. You can{" "}
              <Link to="/reviews/" className="text-accent underline underline-offset-2">
                read the reviews
              </Link>{" "}
              from both cities first, or{" "}
              <Link to="/gift-card/" className="text-accent underline underline-offset-2">
                give a clean as a gift
              </Link>
              .
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <a href="/#quote">
                  <Calculator className="w-5 h-5 mr-2" />
                  See My Instant Price, Edmonton
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <a href={calgaryQuote}>
                  <Calculator className="w-5 h-5 mr-2" />
                  See My Instant Price, Calgary
                </a>
              </Button>
            </div>
            <p className="mt-8 text-white/80">
              Or call:{" "}
              <a href={CITY_PROOF.edmonton.phoneLink} className="text-accent underline underline-offset-2">
                Edmonton {CITY_PROOF.edmonton.phone}
              </a>{" "}
              and{" "}
              <a href={CITY_PROOF.calgary.phoneLink} className="text-accent underline underline-offset-2">
                Calgary {CITY_PROOF.calgary.phone}
              </a>
              . Questions that are not about price go through{" "}
              <Link to="/contact-us/" className="text-accent underline underline-offset-2">
                the contact page
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
