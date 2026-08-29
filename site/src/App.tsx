import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import SkipLink from "./components/SkipLink";

import QuoteOverlay from "./components/QuoteOverlay";
import { QuoteOverlayProvider } from "./hooks/use-quote-overlay";
import { HelmetProvider } from "react-helmet-async";
import Edmonton2 from "./pages/Edmonton2";
// Only the "/" homepage (Edmonton) stays eager — Calgary loads on demand so it
// no longer weighs down every first visit.
const Calgary2 = lazy(() => import("./pages/Calgary2"));
const EdmontonServices = lazy(() => import("./pages/EdmontonServices"));
const CalgaryServices = lazy(() => import("./pages/CalgaryServices"));
const EdmontonPricing = lazy(() => import("./pages/EdmontonPricing"));
const CalgaryPricing = lazy(() => import("./pages/CalgaryPricing"));
const EdmontonRegularCleaning = lazy(() => import("./pages/EdmontonRegularCleaning"));
const EdmontonRecurringCleaning = lazy(() => import("./pages/EdmontonRecurringCleaning"));
const EdmontonDeepCleaning = lazy(() => import("./pages/EdmontonDeepCleaning"));
const CalgaryRegularCleaning = lazy(() => import("./pages/CalgaryRegularCleaning"));
const CalgaryRecurringCleaning = lazy(() => import("./pages/CalgaryRecurringCleaning"));
const CalgaryDeepCleaning = lazy(() => import("./pages/CalgaryDeepCleaning"));
const EdmontonMoveInOut = lazy(() => import("./pages/EdmontonMoveInOut"));
const EdmontonMarchOut = lazy(() => import("./pages/EdmontonMarchOut"));
const CalgaryMoveInOut = lazy(() => import("./pages/CalgaryMoveInOut"));
const EdmontonPostConstruction = lazy(() => import("./pages/EdmontonPostConstruction"));
const CalgaryPostConstruction = lazy(() => import("./pages/CalgaryPostConstruction"));
const WallWashingEdmonton = lazy(() => import("./pages/WallWashingEdmonton"));
const WallWashingCalgary = lazy(() => import("./pages/WallWashingCalgary"));
const AirbnbCleaningEdmonton = lazy(() => import("./pages/AirbnbCleaningEdmonton"));
const AirbnbCleaningCalgary = lazy(() => import("./pages/AirbnbCleaningCalgary"));
const WhatsIncluded = lazy(() => import("./pages/WhatsIncluded"));
const Locations = lazy(() => import("./pages/Locations"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
import NotFound from "./pages/NotFound";
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Reviews = lazy(() => import("./pages/Reviews"));
const CommercialCleaning = lazy(() => import("./pages/CommercialCleaning"));
const CommercialCleaningCalgary = lazy(() => import("./pages/CommercialCleaningCalgary"));
const JoinTheTeam = lazy(() => import("./pages/JoinTheTeam"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogCleaningSchedule = lazy(() => import("./pages/BlogCleaningSchedule"));
const BlogCleaningFrequency = lazy(() => import("./pages/BlogCleaningFrequency"));
const BlogVinegarBakingSoda = lazy(() => import("./pages/BlogVinegarBakingSoda"));
const BlogHouseCleaningCost = lazy(() => import("./pages/BlogHouseCleaningCost"));
const BlogChoosingCleaningCompany = lazy(() => import("./pages/BlogChoosingCleaningCompany"));
const BlogCleaningProducts = lazy(() => import("./pages/BlogCleaningProducts"));
const BlogSpotlessHomeTips = lazy(() => import("./pages/BlogSpotlessHomeTips"));
const BlogChoosingCalgaryCleaner = lazy(() => import("./pages/BlogChoosingCalgaryCleaner"));
const SatisfactionGuarantee = lazy(() => import("./pages/SatisfactionGuarantee"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const GiftCards = lazy(() => import("./pages/GiftCards"));
const GiftCard = lazy(() => import("./pages/GiftCard"));
const Prepare = lazy(() => import("./pages/Prepare"));
const QuoteRedirect = lazy(() => import("./pages/QuoteRedirect"));
const Book = lazy(() => import("./pages/Book"));



// Location pages
const Morinville = lazy(() => import("./pages/locations/Morinville"));
const SherwoodPark = lazy(() => import("./pages/locations/SherwoodPark"));
const StAlbert = lazy(() => import("./pages/locations/StAlbert"));
const Windermere = lazy(() => import("./pages/locations/Windermere"));
const StonyPlain = lazy(() => import("./pages/locations/StonyPlain"));
const Devon = lazy(() => import("./pages/locations/Devon"));
const SpruceGrove = lazy(() => import("./pages/locations/SpruceGrove"));
const Beaumont = lazy(() => import("./pages/locations/Beaumont"));
const Leduc = lazy(() => import("./pages/locations/Leduc"));
const FortSaskatchewan = lazy(() => import("./pages/locations/FortSaskatchewan"));
const TurnerValley = lazy(() => import("./pages/locations/TurnerValley"));
const BlackDiamond = lazy(() => import("./pages/locations/BlackDiamond"));
const Langdon = lazy(() => import("./pages/locations/Langdon"));
const Allendale = lazy(() => import("./pages/locations/Allendale"));
const Grovenor = lazy(() => import("./pages/locations/Grovenor"));
const Lauderdale = lazy(() => import("./pages/locations/Lauderdale"));
const Pleasantview = lazy(() => import("./pages/locations/Pleasantview"));
const CastleDowns = lazy(() => import("./pages/locations/CastleDowns"));
const Inglewood = lazy(() => import("./pages/locations/Inglewood"));
const Delton = lazy(() => import("./pages/locations/Delton"));
const SpruceAvenue = lazy(() => import("./pages/locations/SpruceAvenue"));
const Londonderry = lazy(() => import("./pages/locations/Londonderry"));
const Hazeldean = lazy(() => import("./pages/locations/Hazeldean"));
const Montrose = lazy(() => import("./pages/locations/Montrose"));
const Bannerman = lazy(() => import("./pages/locations/Bannerman"));
const McConachie = lazy(() => import("./pages/locations/McConachie"));
const Balwin = lazy(() => import("./pages/locations/Balwin"));
const Capilano = lazy(() => import("./pages/locations/Capilano"));
const Bellevue = lazy(() => import("./pages/locations/Bellevue"));
const Secord = lazy(() => import("./pages/locations/Secord"));
const Hairsine = lazy(() => import("./pages/locations/Hairsine"));
const PrinceCharles = lazy(() => import("./pages/locations/PrinceCharles"));
const Mayfield = lazy(() => import("./pages/locations/Mayfield"));
const Rapperswill = lazy(() => import("./pages/locations/Rapperswill"));
const Westmount = lazy(() => import("./pages/locations/Westmount"));
const McCauley = lazy(() => import("./pages/locations/McCauley"));
const CentralMcDougall = lazy(() => import("./pages/locations/CentralMcDougall"));
const Brookside = lazy(() => import("./pages/locations/Brookside"));
const Kildare = lazy(() => import("./pages/locations/Kildare"));
const Ambleside = lazy(() => import("./pages/locations/Ambleside"));
const Abbottsfield = lazy(() => import("./pages/locations/Abbottsfield"));
const Griesbach = lazy(() => import("./pages/locations/Griesbach"));
const Glengarry = lazy(() => import("./pages/locations/Glengarry"));
const Hermitage = lazy(() => import("./pages/locations/Hermitage"));
const Eastwood = lazy(() => import("./pages/locations/Eastwood"));
const Sherbrooke = lazy(() => import("./pages/locations/Sherbrooke"));
const Canora = lazy(() => import("./pages/locations/Canora"));
const Avonmore = lazy(() => import("./pages/locations/Avonmore"));
const Dovercourt = lazy(() => import("./pages/locations/Dovercourt"));
const Downtown = lazy(() => import("./pages/locations/Downtown"));
const Belvedere = lazy(() => import("./pages/locations/Belvedere"));
const Greenfield = lazy(() => import("./pages/locations/Greenfield"));
const BoyleStreet = lazy(() => import("./pages/locations/BoyleStreet"));
const Ottewell = lazy(() => import("./pages/locations/Ottewell"));
const BeaconHeights = lazy(() => import("./pages/locations/BeaconHeights"));
const Riverdale = lazy(() => import("./pages/locations/Riverdale"));
const QueenAlexandra = lazy(() => import("./pages/locations/QueenAlexandra"));
const BonnieDoon = lazy(() => import("./pages/locations/BonnieDoon"));
const Glenora = lazy(() => import("./pages/locations/Glenora"));
const Glenwood = lazy(() => import("./pages/locations/Glenwood"));
const Evansdale = lazy(() => import("./pages/locations/Evansdale"));
const Belmont = lazy(() => import("./pages/locations/Belmont"));
const Casselman = lazy(() => import("./pages/locations/Casselman"));
const Brintnell = lazy(() => import("./pages/locations/Brintnell"));
const Holyrood = lazy(() => import("./pages/locations/Holyrood"));
const Delwood = lazy(() => import("./pages/locations/Delwood"));
const HollickKenyon = lazy(() => import("./pages/locations/HollickKenyon"));
const LewisEstates = lazy(() => import("./pages/locations/LewisEstates"));
const Glastonbury = lazy(() => import("./pages/locations/Glastonbury"));
const Clareview = lazy(() => import("./pages/locations/Clareview"));
const LagoLindo = lazy(() => import("./pages/locations/LagoLindo"));
const Summerside = lazy(() => import("./pages/locations/Summerside"));
const Terwillegar = lazy(() => import("./pages/locations/Terwillegar"));
const Riverbend = lazy(() => import("./pages/locations/Riverbend"));
const Garneau = lazy(() => import("./pages/locations/Garneau"));
const OldStrathcona = lazy(() => import("./pages/locations/OldStrathcona"));
const Airdrie = lazy(() => import("./pages/locations/Airdrie"));
const Cochrane = lazy(() => import("./pages/locations/Cochrane"));
const Okotoks = lazy(() => import("./pages/locations/Okotoks"));
const Chestermere = lazy(() => import("./pages/locations/Chestermere"));
const Crossfield = lazy(() => import("./pages/locations/Crossfield"));
const HighRiver = lazy(() => import("./pages/locations/HighRiver"));
const Strathmore = lazy(() => import("./pages/locations/Strathmore"));
const AspenGardens = lazy(() => import("./pages/locations/AspenGardens"));
const Tuscany = lazy(() => import("./pages/locations/Tuscany"));
const Kensington = lazy(() => import("./pages/locations/Kensington"));
const ArbourLake = lazy(() => import("./pages/locations/ArbourLake"));
const ScenicAcres = lazy(() => import("./pages/locations/ScenicAcres"));
const SkyviewRanch = lazy(() => import("./pages/locations/SkyviewRanch"));
const Cityscape = lazy(() => import("./pages/locations/Cityscape"));
const Marlborough = lazy(() => import("./pages/locations/Marlborough"));
const SaddleRidge = lazy(() => import("./pages/locations/SaddleRidge"));
const Mission = lazy(() => import("./pages/locations/Mission"));
const MountRoyal = lazy(() => import("./pages/locations/MountRoyal"));
const AspenWoods = lazy(() => import("./pages/locations/AspenWoods"));
const MardaLoop = lazy(() => import("./pages/locations/MardaLoop"));
const Mahogany = lazy(() => import("./pages/locations/Mahogany"));
const AuburnBay = lazy(() => import("./pages/locations/AuburnBay"));
const InglewoodCalgary = lazy(() => import("./pages/locations/InglewoodCalgary"));
const Cranston = lazy(() => import("./pages/locations/Cranston"));
const Woodcroft = lazy(() => import("./pages/locations/Woodcroft"));
const Kilkenny = lazy(() => import("./pages/locations/Kilkenny"));
const Miller = lazy(() => import("./pages/locations/Miller"));
const MattBerry = lazy(() => import("./pages/locations/MattBerry"));
const Ozerna = lazy(() => import("./pages/locations/Ozerna"));
const McLeod = lazy(() => import("./pages/locations/McLeod"));
const BrentwoodCalgary = lazy(() => import("./pages/locations/BrentwoodCalgary"));
const VarsityCalgary = lazy(() => import("./pages/locations/VarsityCalgary"));
const DalhousieCalgary = lazy(() => import("./pages/locations/DalhousieCalgary"));
const BownessCalgary = lazy(() => import("./pages/locations/BownessCalgary"));
const CapitolHillCalgary = lazy(() => import("./pages/locations/CapitolHillCalgary"));
const HillhurstCalgary = lazy(() => import("./pages/locations/HillhurstCalgary"));
const Thorncliffe = lazy(() => import("./pages/locations/Thorncliffe"));
const HuntingtonHills = lazy(() => import("./pages/locations/HuntingtonHills"));
const ForestLawn = lazy(() => import("./pages/locations/ForestLawn"));
const Ogden = lazy(() => import("./pages/locations/Ogden"));
const Southwood = lazy(() => import("./pages/locations/Southwood"));
const Lakeview = lazy(() => import("./pages/locations/Lakeview"));
const Beltline = lazy(() => import("./pages/locations/Beltline"));
const EastVillage = lazy(() => import("./pages/locations/EastVillage"));
const DowntownWestEnd = lazy(() => import("./pages/locations/DowntownWestEnd"));
const EauClaire = lazy(() => import("./pages/locations/EauClaire"));
const Sunnyside = lazy(() => import("./pages/locations/Sunnyside"));
const BridgelandRiverside = lazy(() => import("./pages/locations/BridgelandRiverside"));
const CrescentHeights = lazy(() => import("./pages/locations/CrescentHeights"));
const Renfrew = lazy(() => import("./pages/locations/Renfrew"));
const Sunalta = lazy(() => import("./pages/locations/Sunalta"));
const Shaganappi = lazy(() => import("./pages/locations/Shaganappi"));
const KillarneyGlengarry = lazy(() => import("./pages/locations/KillarneyGlengarry"));
const Richmond = lazy(() => import("./pages/locations/Richmond"));
const Tamarack = lazy(() => import("./pages/locations/Tamarack"));
const Laurel = lazy(() => import("./pages/locations/Laurel"));
const Larkspur = lazy(() => import("./pages/locations/Larkspur"));
const MapleRidge = lazy(() => import("./pages/locations/MapleRidge"));
const York = lazy(() => import("./pages/locations/York"));
const EauxClaires = lazy(() => import("./pages/locations/EauxClaires"));
const Schonsee = lazy(() => import("./pages/locations/Schonsee"));
const Northmount = lazy(() => import("./pages/locations/Northmount"));
const Rosslyn = lazy(() => import("./pages/locations/Rosslyn"));
const Bankview = lazy(() => import("./pages/locations/Bankview"));
const LowerMountRoyal = lazy(() => import("./pages/locations/LowerMountRoyal"));
const Ramsay = lazy(() => import("./pages/locations/Ramsay"));
const Erlton = lazy(() => import("./pages/locations/Erlton"));
const VictoriaPark = lazy(() => import("./pages/locations/VictoriaPark"));
const West = lazy(() => import("./pages/locations/West"));
const ElbowPark = lazy(() => import("./pages/locations/ElbowPark"));
const Altadore = lazy(() => import("./pages/locations/Altadore"));
const CliffBungalow = lazy(() => import("./pages/locations/CliffBungalow"));
const RideauPark = lazy(() => import("./pages/locations/RideauPark"));
const Roxboro = lazy(() => import("./pages/locations/Roxboro"));
const Parkhill = lazy(() => import("./pages/locations/Parkhill"));
const StanleyPark = lazy(() => import("./pages/locations/StanleyPark"));
const Manchester = lazy(() => import("./pages/locations/Manchester"));
const WindsorPark = lazy(() => import("./pages/locations/WindsorPark"));
const MeadowlarkPark = lazy(() => import("./pages/locations/MeadowlarkPark"));
const Mayfair = lazy(() => import("./pages/locations/Mayfair"));
const Scarboro = lazy(() => import("./pages/locations/Scarboro"));
const SunaltaWest = lazy(() => import("./pages/locations/SunaltaWest"));
const SpruceCliff = lazy(() => import("./pages/locations/SpruceCliff"));
const Wildwood = lazy(() => import("./pages/locations/Wildwood"));
const Montgomery = lazy(() => import("./pages/locations/Montgomery"));
const Greenview = lazy(() => import("./pages/locations/Greenview"));
const HighlandPark = lazy(() => import("./pages/locations/HighlandPark"));
const TuxedoPark = lazy(() => import("./pages/locations/TuxedoPark"));
const MountPleasant = lazy(() => import("./pages/locations/MountPleasant"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* BASE_URL is "/" in dev and on the real domain; on the GitHub Pages
            staging preview it is the repo subpath, which the router needs. */}
        <BrowserRouter basename={import.meta.env.BASE_URL}>
        <QuoteOverlayProvider>
        <SkipLink />
        <ScrollToTop />
        <QuoteOverlay />

        <Suspense
          fallback={
            <div className="flex min-h-dvh items-center justify-center" role="status" aria-live="polite">
              <span className="sr-only">Loading page…</span>
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-navy border-t-transparent" aria-hidden="true" />
            </div>
          }
        >
        <Routes>
          {/* Canonical city routes. The conversion pages own the clean slugs;
              the old numbered slugs and the retired city pages redirect. */}
          <Route path="/" element={<Edmonton2 />} />
          <Route path="/calgary" element={<Calgary2 />} />
          <Route path="/edmonton" element={<Navigate to="/" replace />} />
          <Route path="/edmonton-2" element={<Navigate to="/" replace />} />
          <Route path="/calgary-2" element={<Navigate to="/cleaning-services-calgary/" replace />} />

          <Route path="/edmonton/services" element={<EdmontonServices />} />
          <Route path="/calgary/services" element={<CalgaryServices />} />
          <Route path="/edmonton/pricing" element={<EdmontonPricing />} />
          <Route path="/edmonton/regular-cleaning" element={<EdmontonRegularCleaning />} />
          <Route path="/edmonton/recurring-cleaning" element={<EdmontonRecurringCleaning />} />
          <Route path="/edmonton/deep-cleaning" element={<EdmontonDeepCleaning />} />
          <Route path="/calgary/pricing" element={<CalgaryPricing />} />
          <Route path="/calgary/regular-cleaning" element={<CalgaryRegularCleaning />} />
          <Route path="/calgary/recurring-cleaning" element={<CalgaryRecurringCleaning />} />
          <Route path="/calgary/deep-cleaning" element={<CalgaryDeepCleaning />} />
          <Route path="/edmonton/move-in-move-out-cleaning" element={<EdmontonMoveInOut />} />
          <Route path="/edmonton/march-out-cleaning" element={<EdmontonMarchOut />} />
          <Route path="/calgary/move-in-move-out-cleaning" element={<CalgaryMoveInOut />} />
          <Route path="/edmonton/post-construction-cleaning" element={<EdmontonPostConstruction />} />
          <Route path="/calgary/post-construction-cleaning" element={<CalgaryPostConstruction />} />
          <Route path="/edmonton/wall-washing" element={<WallWashingEdmonton />} />
          <Route path="/calgary/wall-washing" element={<WallWashingCalgary />} />
          <Route path="/edmonton/airbnb-cleaning" element={<AirbnbCleaningEdmonton />} />
          <Route path="/calgary/airbnb-cleaning" element={<AirbnbCleaningCalgary />} />
          <Route path="/whats-included" element={<WhatsIncluded />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/locations/all" element={<Locations />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/commercial-cleaning" element={<CommercialCleaning />} />
          <Route path="/calgary/commercial-cleaning" element={<CommercialCleaningCalgary />} />
          <Route path="/commercial-cleaning-calgary" element={<Navigate to="/commercial-cleaning-services-calgary/" replace />} />
          <Route path="/join-the-team" element={<JoinTheTeam />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/cleaning-schedule" element={<BlogCleaningSchedule />} />
          <Route path="/blog/cleaning-frequency" element={<BlogCleaningFrequency />} />
          <Route path="/blog/vinegar-baking-soda" element={<BlogVinegarBakingSoda />} />
          <Route path="/blog/house-cleaning-cost" element={<BlogHouseCleaningCost />} />
          <Route path="/blog/choosing-cleaning-company" element={<BlogChoosingCleaningCompany />} />
          <Route path="/blog/cleaning-products" element={<BlogCleaningProducts />} />
          {/* Canonical home of this post: the legacy URL it earned 73k impressions on. */}
          <Route path="/the-top-5-must-have-cleaning-products-for-a-spotless-home" element={<BlogCleaningProducts />} />
          <Route path="/blog/spotless-home-tips" element={<BlogSpotlessHomeTips />} />
          <Route path="/blog/cleaning-services-calgary" element={<BlogChoosingCalgaryCleaner />} />
          <Route path="/satisfaction-guarantee" element={<SatisfactionGuarantee />} />
          <Route path="/insurance-liability" element={<Navigate to="/satisfaction-guarantee/" replace />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/gift-cards" element={<GiftCards />} />
          <Route path="/gift-card" element={<GiftCard />} />
          <Route path="/prepare" element={<Prepare />} />
          <Route path="/quote-redirect" element={<QuoteRedirect />} />
          <Route path="/book" element={<Book />} />

          
          
          {/* Location pages */}
          <Route path="/locations/morinville" element={<Morinville />} />
          <Route path="/locations/sherwood-park" element={<SherwoodPark />} />
          <Route path="/locations/st-albert" element={<StAlbert />} />
          <Route path="/locations/windermere" element={<Windermere />} />
          <Route path="/locations/stony-plain" element={<StonyPlain />} />
          <Route path="/locations/devon" element={<Devon />} />
          <Route path="/locations/spruce-grove" element={<SpruceGrove />} />
          <Route path="/locations/beaumont" element={<Beaumont />} />
          <Route path="/locations/leduc" element={<Leduc />} />
          <Route path="/locations/fort-saskatchewan" element={<FortSaskatchewan />} />
          <Route path="/locations/turner-valley" element={<TurnerValley />} />
          <Route path="/locations/black-diamond" element={<BlackDiamond />} />
          <Route path="/locations/langdon" element={<Langdon />} />
          <Route path="/locations/allendale" element={<Allendale />} />
          <Route path="/locations/grovenor" element={<Grovenor />} />
          <Route path="/locations/lauderdale" element={<Lauderdale />} />
          <Route path="/locations/pleasantview" element={<Pleasantview />} />
          <Route path="/locations/castle-downs" element={<CastleDowns />} />
          <Route path="/locations/inglewood" element={<Inglewood />} />
          <Route path="/locations/delton" element={<Delton />} />
          <Route path="/locations/spruce-avenue" element={<SpruceAvenue />} />
          <Route path="/locations/londonderry" element={<Londonderry />} />
          <Route path="/locations/hazeldean" element={<Hazeldean />} />
          <Route path="/locations/montrose" element={<Montrose />} />
          <Route path="/locations/bannerman" element={<Bannerman />} />
          <Route path="/locations/mcconachie-edmonton" element={<McConachie />} />
          <Route path="/locations/balwin-edmonton" element={<Balwin />} />
          <Route path="/locations/capilano-edmonton" element={<Capilano />} />
          <Route path="/locations/bellevue-edmonton" element={<Bellevue />} />
          <Route path="/locations/secord-edmonton" element={<Secord />} />
          <Route path="/locations/hairsine-edmonton" element={<Hairsine />} />
          <Route path="/locations/prince-charles-edmonton" element={<PrinceCharles />} />
          <Route path="/locations/mayfield-edmonton" element={<Mayfield />} />
          <Route path="/locations/rapperswill-edmonton" element={<Rapperswill />} />
          <Route path="/locations/westmount-edmonton" element={<Westmount />} />
          <Route path="/locations/mccauley-edmonton" element={<McCauley />} />
          <Route path="/locations/central-mcdougall-edmonton" element={<CentralMcDougall />} />
          <Route path="/locations/brookside-edmonton" element={<Brookside />} />
          <Route path="/locations/kildare-edmonton" element={<Kildare />} />
          <Route path="/locations/ambleside-edmonton" element={<Ambleside />} />
          <Route path="/locations/abbottsfield-edmonton" element={<Abbottsfield />} />
          <Route path="/locations/griesbach-edmonton" element={<Griesbach />} />
          <Route path="/locations/eastwood-edmonton" element={<Eastwood />} />
          <Route path="/locations/sherbrooke-edmonton" element={<Sherbrooke />} />
          <Route path="/locations/canora-edmonton" element={<Canora />} />
          <Route path="/locations/avonmore-edmonton" element={<Avonmore />} />
          <Route path="/locations/dovercourt-edmonton" element={<Dovercourt />} />
          <Route path="/locations/downtown-edmonton" element={<Downtown />} />
          <Route path="/locations/belvedere-edmonton" element={<Belvedere />} />
          <Route path="/locations/greenfield-edmonton" element={<Greenfield />} />
          <Route path="/locations/boyle-street-edmonton" element={<BoyleStreet />} />
          <Route path="/locations/ottewell-edmonton" element={<Ottewell />} />
          <Route path="/locations/beacon-heights-edmonton" element={<BeaconHeights />} />
          <Route path="/locations/riverdale-edmonton" element={<Riverdale />} />
          <Route path="/locations/queen-alexandra-edmonton" element={<QueenAlexandra />} />
          <Route path="/locations/bonnie-doon-edmonton" element={<BonnieDoon />} />
          <Route path="/locations/glenora-edmonton" element={<Glenora />} />
          <Route path="/locations/glenwood-edmonton" element={<Glenwood />} />
          <Route path="/locations/evansdale-edmonton" element={<Evansdale />} />
          <Route path="/locations/belmont-edmonton" element={<Belmont />} />
          <Route path="/locations/casselman-edmonton" element={<Casselman />} />
          <Route path="/locations/brintnell-edmonton" element={<Brintnell />} />
          <Route path="/locations/holyrood-edmonton" element={<Holyrood />} />
          <Route path="/locations/delwood-edmonton" element={<Delwood />} />
          <Route path="/locations/hollick-kenyon-edmonton" element={<HollickKenyon />} />
          <Route path="/locations/glengarry-edmonton" element={<Glengarry />} />
          <Route path="/locations/hermitage-edmonton" element={<Hermitage />} />
          <Route path="/locations/lewis-estates" element={<LewisEstates />} />
          <Route path="/locations/glastonbury" element={<Glastonbury />} />
          <Route path="/locations/clareview" element={<Clareview />} />
          <Route path="/locations/lago-lindo-edmonton" element={<LagoLindo />} />
          <Route path="/locations/summerside" element={<Summerside />} />
          <Route path="/locations/terwillegar" element={<Terwillegar />} />
          <Route path="/locations/riverbend" element={<Riverbend />} />
          <Route path="/locations/garneau" element={<Garneau />} />
          <Route path="/locations/old-strathcona" element={<OldStrathcona />} />
          <Route path="/locations/airdrie" element={<Airdrie />} />
          <Route path="/locations/cochrane" element={<Cochrane />} />
          <Route path="/locations/okotoks" element={<Okotoks />} />
          <Route path="/locations/chestermere" element={<Chestermere />} />
          <Route path="/locations/crossfield" element={<Crossfield />} />
          <Route path="/locations/high-river" element={<HighRiver />} />
          <Route path="/locations/strathmore" element={<Strathmore />} />
          <Route path="/locations/aspen-gardens-edmonton" element={<AspenGardens />} />
          <Route path="/locations/tuscany" element={<Tuscany />} />
          <Route path="/locations/kensington" element={<Kensington />} />
          <Route path="/locations/arbour-lake" element={<ArbourLake />} />
          <Route path="/locations/scenic-acres" element={<ScenicAcres />} />
          <Route path="/locations/skyview-ranch" element={<SkyviewRanch />} />
          <Route path="/locations/cityscape" element={<Cityscape />} />
          <Route path="/locations/marlborough" element={<Marlborough />} />
          <Route path="/locations/saddle-ridge" element={<SaddleRidge />} />
          <Route path="/locations/mission" element={<Mission />} />
          <Route path="/locations/mount-royal" element={<MountRoyal />} />
          <Route path="/locations/aspen-woods" element={<AspenWoods />} />
          <Route path="/locations/marda-loop" element={<MardaLoop />} />
          <Route path="/locations/mahogany" element={<Mahogany />} />
          <Route path="/locations/auburn-bay" element={<AuburnBay />} />
          <Route path="/locations/inglewood-calgary" element={<InglewoodCalgary />} />
          <Route path="/locations/cranston" element={<Cranston />} />
          <Route path="/locations/woodcroft-edmonton" element={<Woodcroft />} />
          <Route path="/locations/kilkenny-edmonton" element={<Kilkenny />} />
          <Route path="/locations/miller-edmonton" element={<Miller />} />
          <Route path="/locations/matt-berry-edmonton" element={<MattBerry />} />
          <Route path="/locations/ozerna-edmonton" element={<Ozerna />} />
          <Route path="/locations/mcleod-edmonton" element={<McLeod />} />
          <Route path="/locations/brentwood-calgary" element={<BrentwoodCalgary />} />
          <Route path="/locations/varsity-calgary" element={<VarsityCalgary />} />
          <Route path="/locations/dalhousie-calgary" element={<DalhousieCalgary />} />
          <Route path="/locations/bowness-calgary" element={<BownessCalgary />} />
          <Route path="/locations/capitol-hill-calgary" element={<CapitolHillCalgary />} />
          <Route path="/locations/hillhurst-calgary" element={<HillhurstCalgary />} />
          <Route path="/locations/thorncliffe-calgary" element={<Thorncliffe />} />
          <Route path="/locations/huntington-hills-calgary" element={<HuntingtonHills />} />
          <Route path="/locations/forest-lawn-calgary" element={<ForestLawn />} />
          <Route path="/locations/ogden-calgary" element={<Ogden />} />
          <Route path="/locations/southwood-calgary" element={<Southwood />} />
          <Route path="/locations/lakeview-calgary" element={<Lakeview />} />
          <Route path="/locations/beltline-calgary" element={<Beltline />} />
          <Route path="/locations/east-village-calgary" element={<EastVillage />} />
          <Route path="/locations/downtown-west-end-calgary" element={<DowntownWestEnd />} />
          <Route path="/locations/eau-claire-calgary" element={<EauClaire />} />
          <Route path="/locations/sunnyside-calgary" element={<Sunnyside />} />
          <Route path="/locations/bridgeland-riverside-calgary" element={<BridgelandRiverside />} />
          <Route path="/locations/crescent-heights-calgary" element={<CrescentHeights />} />
          <Route path="/locations/renfrew-calgary" element={<Renfrew />} />
          <Route path="/locations/sunalta-calgary" element={<Sunalta />} />
          <Route path="/locations/shaganappi-calgary" element={<Shaganappi />} />
          <Route path="/locations/killarney-glengarry-calgary" element={<KillarneyGlengarry />} />
          <Route path="/locations/richmond-calgary" element={<Richmond />} />
          <Route path="/locations/tamarack-edmonton" element={<Tamarack />} />
          <Route path="/locations/laurel-edmonton" element={<Laurel />} />
          <Route path="/locations/larkspur-edmonton" element={<Larkspur />} />
          <Route path="/locations/maple-ridge-edmonton" element={<MapleRidge />} />
          <Route path="/locations/york-edmonton" element={<York />} />
          <Route path="/locations/eaux-claires-edmonton" element={<EauxClaires />} />
          <Route path="/locations/schonsee-edmonton" element={<Schonsee />} />
          <Route path="/locations/northmount-edmonton" element={<Northmount />} />
          <Route path="/locations/rosslyn-edmonton" element={<Rosslyn />} />
          <Route path="/locations/bankview-calgary" element={<Bankview />} />
          <Route path="/locations/lower-mount-royal-calgary" element={<LowerMountRoyal />} />
          <Route path="/locations/ramsay-calgary" element={<Ramsay />} />
          <Route path="/locations/erlton-calgary" element={<Erlton />} />
          <Route path="/locations/victoria-park-calgary" element={<VictoriaPark />} />
          <Route path="/locations/west-calgary" element={<West />} />
          <Route path="/locations/elbow-park-calgary" element={<ElbowPark />} />
          <Route path="/locations/altadore-calgary" element={<Altadore />} />
          <Route path="/locations/cliff-bungalow-calgary" element={<CliffBungalow />} />
          <Route path="/locations/rideau-park-calgary" element={<RideauPark />} />
          <Route path="/locations/roxboro-calgary" element={<Roxboro />} />
          <Route path="/locations/parkhill-calgary" element={<Parkhill />} />
          <Route path="/locations/stanley-park-calgary" element={<StanleyPark />} />
          <Route path="/locations/manchester-calgary" element={<Manchester />} />
          <Route path="/locations/windsor-park-calgary" element={<WindsorPark />} />
          <Route path="/locations/meadowlark-park-calgary" element={<MeadowlarkPark />} />
          <Route path="/locations/mayfair-calgary" element={<Mayfair />} />
          <Route path="/locations/scarboro-calgary" element={<Scarboro />} />
          <Route path="/locations/sunalta-west-calgary" element={<SunaltaWest />} />
          <Route path="/locations/spruce-cliff-calgary" element={<SpruceCliff />} />
          <Route path="/locations/wildwood-calgary" element={<Wildwood />} />
          <Route path="/locations/montgomery-calgary" element={<Montgomery />} />
          <Route path="/locations/greenview-calgary" element={<Greenview />} />
          <Route path="/locations/highland-park-calgary" element={<HighlandPark />} />
          <Route path="/locations/tuxedo-park-calgary" element={<TuxedoPark />} />
          <Route path="/locations/mount-pleasant-calgary" element={<MountPleasant />} />
          


          {/* ---------------------------------------------------------------
              LEGACY URL PRESERVATION  (see src/data/legacy-urls.ts)
              These paths carry the traffic the old WordPress site earned.
              PRESERVED URLs render the same component AND stay canonical, so
              Google keeps the equity it already assigned instead of having to
              re-evaluate a new URL. The rest 301 to their successor.
             --------------------------------------------------------------- */}
          <Route path="/cleaning-services-calgary" element={<Calgary2 />} />
          <Route path="/move-out-cleaning-edmonton" element={<EdmontonMoveInOut />} />
          <Route path="/commercial-cleaning-services-calgary" element={<CommercialCleaningCalgary />} />
          <Route path="/move-out-cleaning-calgary" element={<CalgaryMoveInOut />} />
          <Route path="/post-construction-cleaning" element={<EdmontonPostConstruction />} />
          <Route path="/services" element={<EdmontonServices />} />
          <Route path="/post-construction-cleaning-calgary" element={<CalgaryPostConstruction />} />
          <Route path="/cleaning-services-beaumont" element={<Beaumont />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/cleaning-services-morinville" element={<Morinville />} />
          <Route path="/pricing" element={<EdmontonPricing />} />
          <Route path="/cleaning-services-sherwood-park" element={<SherwoodPark />} />
          <Route path="/cleaning-services-leduc" element={<Leduc />} />
          <Route path="/cleaning-services-spruce-grove" element={<SpruceGrove />} />
          <Route path="/airbnb-cleaning-services-calgary" element={<AirbnbCleaningCalgary />} />
          <Route path="/cleaning-services-st-albert" element={<StAlbert />} />
          <Route path="/how-much-does-a-house-cleaning-cost" element={<BlogHouseCleaningCost />} />
          <Route path="/cleaning-services-airdrie" element={<Airdrie />} />
          <Route path="/cleaning-services-devon" element={<Devon />} />
          <Route path="/faqs" element={<FAQ />} />
          <Route path="/wall-washing-wall-cleaning" element={<WallWashingEdmonton />} />
          <Route path="/cleaning-services-fort-saskatchewan" element={<FortSaskatchewan />} />
          <Route path="/cleaning-services-cochrane" element={<Cochrane />} />
          <Route path="/wall-washing-wall-cleaning-calgary" element={<WallWashingCalgary />} />
          <Route path="/cleaning-services-stony-plain" element={<StonyPlain />} />
          <Route path="/cleaning-services-windermere" element={<Windermere />} />
          <Route path="/cleaning-with-vinegar-and-baking-soda" element={<BlogVinegarBakingSoda />} />

          {/* Legacy 301s -> canonical successor */}
          <Route path="/8038/how-much-does-a-house-cleaning-cost" element={<Navigate to="/how-much-does-a-house-cleaning-cost/" replace />} />
          <Route path="/8081/the-top-5-must-have-cleaning-products-for-a-spotless-home" element={<Navigate to="/the-top-5-must-have-cleaning-products-for-a-spotless-home/" replace />} />
          <Route path="/8060/how-often-should-a-cleaning-service-clean-my-house" element={<Navigate to="/how-often-should-a-cleaning-service-clean-my-house/" replace />} />
          <Route path="/services/move-in-move-out-cleaning" element={<Navigate to="/move-out-cleaning-edmonton/" replace />} />
          <Route path="/8088/cleaning-with-vinegar-and-baking-soda" element={<Navigate to="/cleaning-with-vinegar-and-baking-soda/" replace />} />
          <Route path="/8102/a-house-cleaning-schedule-that-does-not-overwhelm-you" element={<Navigate to="/blog/cleaning-schedule/" replace />} />
          <Route path="/services/commercial-cleaning" element={<Navigate to="/commercial-cleaning/" replace />} />
          <Route path="/services/post-construction-cleaning" element={<Navigate to="/post-construction-cleaning/" replace />} />
          <Route path="/booking-page" element={<Navigate to="/pricing/" replace />} />
          <Route path="/move-in-move-out-cleaning" element={<Navigate to="/move-out-cleaning-edmonton/" replace />} />
          <Route path="/cleaning-services-for-fort-saskatchewan-ab" element={<Navigate to="/cleaning-services-fort-saskatchewan/" replace />} />
          <Route path="/1948/house-cleaning-tips-for-a-spotless-home-environment" element={<Navigate to="/blog/spotless-home-tips/" replace />} />
          <Route path="/march-out-cleaning-calgary" element={<Navigate to="/move-out-cleaning-calgary/" replace />} />
          <Route path="/how-to-deep-clean-your-home" element={<Navigate to="/edmonton/deep-cleaning/" replace />} />
          <Route path="/cleaning-services-okotoks" element={<Navigate to="/locations/okotoks/" replace />} />
          <Route path="/cleaning-services-black-diamond" element={<Navigate to="/locations/black-diamond/" replace />} />
          <Route path="/cleaning-services-chestermere" element={<Navigate to="/locations/chestermere/" replace />} />
          <Route path="/10042/cleaning-services-calgary-transform-your-space" element={<Navigate to="/blog/cleaning-services-calgary/" replace />} />
          <Route path="/cleaning-services-downtown-edmonton-ab" element={<Navigate to="/locations/downtown-edmonton/" replace />} />
          <Route path="/cleaning-services-langdon" element={<Navigate to="/locations/langdon/" replace />} />
          <Route path="/airbnb-cleaning-service" element={<Navigate to="/edmonton/airbnb-cleaning/" replace />} />
          <Route path="/cleaning-services-strathmore" element={<Navigate to="/locations/strathmore/" replace />} />
          <Route path="/march-out-cleaning-edmonton" element={<Navigate to="/edmonton/march-out-cleaning/" replace />} />
          <Route path="/cleaning-services-red-deer" element={<Navigate to="/locations/" replace />} />
          <Route path="/cleaning-services-glenora-edmonton-ab" element={<Navigate to="/locations/glenora-edmonton/" replace />} />
          <Route path="/1848/house-cleaning-hacks-easy-tips-for-busy-lives" element={<Navigate to="/blog/" replace />} />
          <Route path="/how-often-should-a-cleaning-service-clean-my-house" element={<BlogCleaningFrequency />} />
          <Route path="/services/wall-washing-wall-cleaning" element={<Navigate to="/wall-washing-wall-cleaning/" replace />} />
          <Route path="/cleaning-services-riverdale-edmonton-ab" element={<Navigate to="/locations/riverdale-edmonton/" replace />} />
          <Route path="/cleaning-services-edmonton" element={<Navigate to="/" replace />} />
          {/* NOTE: /the-top-5-must-have-cleaning-products-for-a-spotless-home is deliberately
              NOT redirected here. It is a `mode: "preserve"` URL (see src/data/legacy-urls.ts)
              and is served by <BlogCleaningProducts /> at its canonical route above. A duplicate
              Navigate route used to sit on this line and silently sent the site's 73,104-impression
              blog post to /blog whenever route ordering shifted. Do not re-add it. */}
          <Route path="/cleaning-services-avonmore-edmonton-ab" element={<Navigate to="/locations/avonmore-edmonton/" replace />} />
          <Route path="/cleaning-services-hazeldean-edmonton-ab" element={<Navigate to="/locations/hazeldean/" replace />} />
          <Route path="/the-benefits-of-using-leather-conditioner-for-automotive-seats-and-home-furniture" element={<Navigate to="/blog/" replace />} />
          <Route path="/9448/cleaning-services-edmonton-you-can-trust" element={<Navigate to="/" replace />} />
          <Route path="/2038/top-benefits-of-professional-cleaning-services-today" element={<Navigate to="/blog/" replace />} />
          <Route path="/cleaning-services-turner-valley" element={<Navigate to="/locations/turner-valley/" replace />} />
          <Route path="/cleaning-services-crossfield" element={<Navigate to="/locations/crossfield/" replace />} />
          <Route path="/cleaning-services-bonnie-doon-edmonton-ab" element={<Navigate to="/locations/bonnie-doon-edmonton/" replace />} />
          <Route path="/cleaning-services-abbottsfield-edmonton-ab" element={<Navigate to="/locations/abbottsfield-edmonton/" replace />} />
          <Route path="/cleaning-services-canora-edmonton-ab" element={<Navigate to="/locations/canora-edmonton/" replace />} />
          <Route path="/how-it-works" element={<Navigate to="/" replace />} />
          <Route path="/cleaning-services-greenfield-edmonton-ab" element={<Navigate to="/locations/greenfield-edmonton/" replace />} />
          <Route path="/why-hire-duty-cleaners-for-commercial-cleaning" element={<Navigate to="/commercial-cleaning/" replace />} />
          <Route path="/cleaning-services-dovercourt-edmonton-ab" element={<Navigate to="/locations/dovercourt-edmonton/" replace />} />
          <Route path="/cleaning-services-evansdale-edmonton-ab" element={<Navigate to="/locations/evansdale-edmonton/" replace />} />
          <Route path="/cleaning-services-ambleside-edmonton-ab" element={<Navigate to="/locations/ambleside-edmonton/" replace />} />
          <Route path="/cleaning-services-glenwood-edmonton-ab" element={<Navigate to="/locations/glenwood-edmonton/" replace />} />
          <Route path="/tag/cleaning-services" element={<Navigate to="/blog/" replace />} />
          <Route path="/services-pricing/commercial-cleaning-edmonton" element={<Navigate to="/commercial-cleaning/" replace />} />
          <Route path="/cleaning-services-ottewell-edmonton-ab" element={<Navigate to="/locations/ottewell-edmonton/" replace />} />
          <Route path="/cleaning-services-inglewood-edmonton-ab" element={<Navigate to="/locations/inglewood/" replace />} />
          <Route path="/cleaning-services-mcconachie-edmonton-ab" element={<Navigate to="/locations/mcconachie-edmonton/" replace />} />
          <Route path="/cleaning-services-belvedere-edmonton-ab" element={<Navigate to="/locations/belvedere-edmonton/" replace />} />
          <Route path="/cleaning-services-boyle-street-edmonton-ab" element={<Navigate to="/locations/boyle-street-edmonton/" replace />} />
          <Route path="/cleaning-services-delton-edmonton-ab" element={<Navigate to="/locations/delton/" replace />} />
          <Route path="/cleaning-services-aspen-gardens-edmonton-ab" element={<Navigate to="/locations/aspen-gardens-edmonton/" replace />} />
          <Route path="/1735/choosing-the-right-cleaning-company-for-your-needs" element={<Navigate to="/blog/choosing-cleaning-company/" replace />} />
          <Route path="/cleaning-services-high-river" element={<Navigate to="/locations/high-river/" replace />} />
          <Route path="/cleaning-services-allendale-edmonton-ab" element={<Navigate to="/locations/allendale/" replace />} />
          <Route path="/cleaning-services-matt-berry-edmonton-ab" element={<Navigate to="/locations/matt-berry-edmonton/" replace />} />
          <Route path="/cleaning-services-beacon-heights-edmonton-ab" element={<Navigate to="/locations/beacon-heights-edmonton/" replace />} />
          <Route path="/cleaning-services-rapperswill-edmonton-ab" element={<Navigate to="/locations/rapperswill-edmonton/" replace />} />
          <Route path="/march-out-cleaning" element={<Navigate to="/edmonton/march-out-cleaning/" replace />} />
          <Route path="/cleaning-services-queen-alexandra-edmonton-ab" element={<Navigate to="/locations/queen-alexandra-edmonton/" replace />} />
          <Route path="/cleaning-services-montrose-edmonton-ab" element={<Navigate to="/locations/montrose/" replace />} />
          <Route path="/cleaning-services-prince-charles-edmonton-ab" element={<Navigate to="/locations/prince-charles-edmonton/" replace />} />
          <Route path="/natural-cleaning-solutions-for-your-kitchen-appliances" element={<Navigate to="/cleaning-with-vinegar-and-baking-soda/" replace />} />
          <Route path="/services-pricing/move-in-move-out" element={<Navigate to="/move-out-cleaning-edmonton/" replace />} />
          <Route path="/shop" element={<Navigate to="/" replace />} />
          <Route path="/cleaning-services-glengarry-edmonton-ab" element={<Navigate to="/locations/glengarry-edmonton/" replace />} />
          <Route path="/checkout" element={<Navigate to="/book/" replace />} />
          <Route path="/cleaning-services-capilano-edmonton-ab" element={<Navigate to="/locations/capilano-edmonton/" replace />} />
          <Route path="/cleaning-services-castle-downs-edmonton-ab" element={<Navigate to="/locations/castle-downs/" replace />} />
          <Route path="/airbnb-cleaning-services-edmonton" element={<Navigate to="/edmonton/airbnb-cleaning/" replace />} />
          <Route path="/cleaning-services-hermitage-edmonton-ab" element={<Navigate to="/locations/hermitage-edmonton/" replace />} />
          <Route path="/cleaning-services-casselman-edmonton-ab" element={<Navigate to="/locations/casselman-edmonton/" replace />} />
          <Route path="/cleaning-services-griesbach-edmonton-ab" element={<Navigate to="/locations/griesbach-edmonton/" replace />} />
          <Route path="/cart" element={<Navigate to="/" replace />} />
          <Route path="/my-account" element={<Navigate to="/" replace />} />
          <Route path="/cochrane-cleaning-services" element={<Navigate to="/cleaning-services-cochrane/" replace />} />
          <Route path="/cleaning-services-belmont-edmonton-ab" element={<Navigate to="/locations/belmont-edmonton/" replace />} />
          <Route path="/#!" element={<Navigate to="/" replace />} />
          <Route path="/what-to-expect-from-professional-cleaners" element={<Navigate to="/blog/choosing-cleaning-company/" replace />} />
          <Route path="/cleaning-services-lauderdale-edmonton-ab" element={<Navigate to="/locations/lauderdale/" replace />} />
          <Route path="/2011/how-cleaning-services-improve-your-homes-health" element={<Navigate to="/blog/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        </QuoteOverlayProvider>
      </BrowserRouter>
    </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
