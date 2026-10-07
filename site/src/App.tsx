import { Suspense } from "react";
import { lazyWithPreload } from "@/lib/lazy-with-preload";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import SkipLink from "./components/SkipLink";
import LoadErrorBoundary from "./components/LoadErrorBoundary";

import QuoteOverlay from "./components/QuoteOverlay";
import { QuoteOverlayProvider } from "./hooks/use-quote-overlay";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { SITE_ORIGIN } from "@/lib/seo";
// Both city homepages load on demand. Edmonton2 was the last eager route, so
// its component tree sat in the entry chunk that all 209 pages download — 208
// of which never render it. Every page is prerendered, so the HTML paints
// before any of this resolves; keeping "/" eager bought the homepage one
// avoided round trip and charged every other page for the homepage.
// Measured: the entry chunk falls from 542 KB raw / 142 KB gzipped to 357 /
// 100, a town page from 167 to 145 KB gzipped and /contact-us/ from 200 to
// 176, while "/" itself pays 12 KB more and /cleaning-services-calgary/ 3.
const Edmonton2 = lazyWithPreload(() => import("./pages/Edmonton2"));
const Calgary2 = lazyWithPreload(() => import("./pages/Calgary2"));
const EdmontonServices = lazyWithPreload(() => import("./pages/EdmontonServices"));
const CalgaryServices = lazyWithPreload(() => import("./pages/CalgaryServices"));
const EdmontonPricing = lazyWithPreload(() => import("./pages/EdmontonPricing"));
const CalgaryPricing = lazyWithPreload(() => import("./pages/CalgaryPricing"));
const EdmontonRegularCleaning = lazyWithPreload(() => import("./pages/EdmontonRegularCleaning"));
const EdmontonRecurringCleaning = lazyWithPreload(() => import("./pages/EdmontonRecurringCleaning"));
const EdmontonDeepCleaning = lazyWithPreload(() => import("./pages/EdmontonDeepCleaning"));
const CalgaryRegularCleaning = lazyWithPreload(() => import("./pages/CalgaryRegularCleaning"));
const CalgaryRecurringCleaning = lazyWithPreload(() => import("./pages/CalgaryRecurringCleaning"));
const CalgaryDeepCleaning = lazyWithPreload(() => import("./pages/CalgaryDeepCleaning"));
const EdmontonMoveInOut = lazyWithPreload(() => import("./pages/EdmontonMoveInOut"));
const EdmontonMarchOut = lazyWithPreload(() => import("./pages/EdmontonMarchOut"));
const CalgaryMoveInOut = lazyWithPreload(() => import("./pages/CalgaryMoveInOut"));
const EdmontonPostConstruction = lazyWithPreload(() => import("./pages/EdmontonPostConstruction"));
const CalgaryPostConstruction = lazyWithPreload(() => import("./pages/CalgaryPostConstruction"));
const WallWashingEdmonton = lazyWithPreload(() => import("./pages/WallWashingEdmonton"));
const WallWashingCalgary = lazyWithPreload(() => import("./pages/WallWashingCalgary"));
const AirbnbCleaningEdmonton = lazyWithPreload(() => import("./pages/AirbnbCleaningEdmonton"));
const AirbnbCleaningCalgary = lazyWithPreload(() => import("./pages/AirbnbCleaningCalgary"));
const WhatsIncluded = lazyWithPreload(() => import("./pages/WhatsIncluded"));
const Locations = lazyWithPreload(() => import("./pages/Locations"));
const Contact = lazyWithPreload(() => import("./pages/Contact"));
const FAQ = lazyWithPreload(() => import("./pages/FAQ"));
import NotFound from "./pages/NotFound";
const AboutUs = lazyWithPreload(() => import("./pages/AboutUs"));
const Reviews = lazyWithPreload(() => import("./pages/Reviews"));
const CommercialCleaning = lazyWithPreload(() => import("./pages/CommercialCleaning"));
const CommercialCleaningCalgary = lazyWithPreload(() => import("./pages/CommercialCleaningCalgary"));
const JoinTheTeam = lazyWithPreload(() => import("./pages/JoinTheTeam"));
const Blog = lazyWithPreload(() => import("./pages/Blog"));
const BlogCleaningSchedule = lazyWithPreload(() => import("./pages/BlogCleaningSchedule"));
const BlogCleaningFrequency = lazyWithPreload(() => import("./pages/BlogCleaningFrequency"));
const BlogVinegarBakingSoda = lazyWithPreload(() => import("./pages/BlogVinegarBakingSoda"));
const BlogHouseCleaningCost = lazyWithPreload(() => import("./pages/BlogHouseCleaningCost"));
const BlogChoosingCleaningCompany = lazyWithPreload(() => import("./pages/BlogChoosingCleaningCompany"));
const BlogCleaningProducts = lazyWithPreload(() => import("./pages/BlogCleaningProducts"));
const BlogSpotlessHomeTips = lazyWithPreload(() => import("./pages/BlogSpotlessHomeTips"));
const BlogChoosingCalgaryCleaner = lazyWithPreload(() => import("./pages/BlogChoosingCalgaryCleaner"));
const SatisfactionGuarantee = lazyWithPreload(() => import("./pages/SatisfactionGuarantee"));
const PrivacyPolicy = lazyWithPreload(() => import("./pages/PrivacyPolicy"));
const Terms = lazyWithPreload(() => import("./pages/Terms"));
const GiftCards = lazyWithPreload(() => import("./pages/GiftCards"));
const GiftCard = lazyWithPreload(() => import("./pages/GiftCard"));
const Prepare = lazyWithPreload(() => import("./pages/Prepare"));
const Book = lazyWithPreload(() => import("./pages/Book"));



// Location pages
const Morinville = lazyWithPreload(() => import("./pages/locations/Morinville"));
const SherwoodPark = lazyWithPreload(() => import("./pages/locations/SherwoodPark"));
const StAlbert = lazyWithPreload(() => import("./pages/locations/StAlbert"));
const Windermere = lazyWithPreload(() => import("./pages/locations/Windermere"));
const StonyPlain = lazyWithPreload(() => import("./pages/locations/StonyPlain"));
const Devon = lazyWithPreload(() => import("./pages/locations/Devon"));
const SpruceGrove = lazyWithPreload(() => import("./pages/locations/SpruceGrove"));
const Beaumont = lazyWithPreload(() => import("./pages/locations/Beaumont"));
const Leduc = lazyWithPreload(() => import("./pages/locations/Leduc"));
const FortSaskatchewan = lazyWithPreload(() => import("./pages/locations/FortSaskatchewan"));
const TurnerValley = lazyWithPreload(() => import("./pages/locations/TurnerValley"));
const BlackDiamond = lazyWithPreload(() => import("./pages/locations/BlackDiamond"));
const Langdon = lazyWithPreload(() => import("./pages/locations/Langdon"));
const Allendale = lazyWithPreload(() => import("./pages/locations/Allendale"));
const Grovenor = lazyWithPreload(() => import("./pages/locations/Grovenor"));
const Lauderdale = lazyWithPreload(() => import("./pages/locations/Lauderdale"));
const Pleasantview = lazyWithPreload(() => import("./pages/locations/Pleasantview"));
const CastleDowns = lazyWithPreload(() => import("./pages/locations/CastleDowns"));
const Inglewood = lazyWithPreload(() => import("./pages/locations/Inglewood"));
const Delton = lazyWithPreload(() => import("./pages/locations/Delton"));
const SpruceAvenue = lazyWithPreload(() => import("./pages/locations/SpruceAvenue"));
const Londonderry = lazyWithPreload(() => import("./pages/locations/Londonderry"));
const Hazeldean = lazyWithPreload(() => import("./pages/locations/Hazeldean"));
const Montrose = lazyWithPreload(() => import("./pages/locations/Montrose"));
const Bannerman = lazyWithPreload(() => import("./pages/locations/Bannerman"));
const McConachie = lazyWithPreload(() => import("./pages/locations/McConachie"));
const Balwin = lazyWithPreload(() => import("./pages/locations/Balwin"));
const Capilano = lazyWithPreload(() => import("./pages/locations/Capilano"));
const Bellevue = lazyWithPreload(() => import("./pages/locations/Bellevue"));
const Secord = lazyWithPreload(() => import("./pages/locations/Secord"));
const Hairsine = lazyWithPreload(() => import("./pages/locations/Hairsine"));
const PrinceCharles = lazyWithPreload(() => import("./pages/locations/PrinceCharles"));
const Mayfield = lazyWithPreload(() => import("./pages/locations/Mayfield"));
const Rapperswill = lazyWithPreload(() => import("./pages/locations/Rapperswill"));
const Westmount = lazyWithPreload(() => import("./pages/locations/Westmount"));
const McCauley = lazyWithPreload(() => import("./pages/locations/McCauley"));
const CentralMcDougall = lazyWithPreload(() => import("./pages/locations/CentralMcDougall"));
const Brookside = lazyWithPreload(() => import("./pages/locations/Brookside"));
const Kildare = lazyWithPreload(() => import("./pages/locations/Kildare"));
const Ambleside = lazyWithPreload(() => import("./pages/locations/Ambleside"));
const Abbottsfield = lazyWithPreload(() => import("./pages/locations/Abbottsfield"));
const Griesbach = lazyWithPreload(() => import("./pages/locations/Griesbach"));
const Glengarry = lazyWithPreload(() => import("./pages/locations/Glengarry"));
const Hermitage = lazyWithPreload(() => import("./pages/locations/Hermitage"));
const Eastwood = lazyWithPreload(() => import("./pages/locations/Eastwood"));
const Sherbrooke = lazyWithPreload(() => import("./pages/locations/Sherbrooke"));
const Canora = lazyWithPreload(() => import("./pages/locations/Canora"));
const Avonmore = lazyWithPreload(() => import("./pages/locations/Avonmore"));
const Dovercourt = lazyWithPreload(() => import("./pages/locations/Dovercourt"));
const Downtown = lazyWithPreload(() => import("./pages/locations/Downtown"));
const Belvedere = lazyWithPreload(() => import("./pages/locations/Belvedere"));
const Greenfield = lazyWithPreload(() => import("./pages/locations/Greenfield"));
const BoyleStreet = lazyWithPreload(() => import("./pages/locations/BoyleStreet"));
const Ottewell = lazyWithPreload(() => import("./pages/locations/Ottewell"));
const BeaconHeights = lazyWithPreload(() => import("./pages/locations/BeaconHeights"));
const Riverdale = lazyWithPreload(() => import("./pages/locations/Riverdale"));
const QueenAlexandra = lazyWithPreload(() => import("./pages/locations/QueenAlexandra"));
const BonnieDoon = lazyWithPreload(() => import("./pages/locations/BonnieDoon"));
const Glenora = lazyWithPreload(() => import("./pages/locations/Glenora"));
const Glenwood = lazyWithPreload(() => import("./pages/locations/Glenwood"));
const Evansdale = lazyWithPreload(() => import("./pages/locations/Evansdale"));
const Belmont = lazyWithPreload(() => import("./pages/locations/Belmont"));
const Casselman = lazyWithPreload(() => import("./pages/locations/Casselman"));
const Brintnell = lazyWithPreload(() => import("./pages/locations/Brintnell"));
const Holyrood = lazyWithPreload(() => import("./pages/locations/Holyrood"));
const Delwood = lazyWithPreload(() => import("./pages/locations/Delwood"));
const HollickKenyon = lazyWithPreload(() => import("./pages/locations/HollickKenyon"));
const LewisEstates = lazyWithPreload(() => import("./pages/locations/LewisEstates"));
const Glastonbury = lazyWithPreload(() => import("./pages/locations/Glastonbury"));
const Clareview = lazyWithPreload(() => import("./pages/locations/Clareview"));
const LagoLindo = lazyWithPreload(() => import("./pages/locations/LagoLindo"));
const Summerside = lazyWithPreload(() => import("./pages/locations/Summerside"));
const Terwillegar = lazyWithPreload(() => import("./pages/locations/Terwillegar"));
const Riverbend = lazyWithPreload(() => import("./pages/locations/Riverbend"));
const Garneau = lazyWithPreload(() => import("./pages/locations/Garneau"));
const OldStrathcona = lazyWithPreload(() => import("./pages/locations/OldStrathcona"));
const Airdrie = lazyWithPreload(() => import("./pages/locations/Airdrie"));
const Cochrane = lazyWithPreload(() => import("./pages/locations/Cochrane"));
const RedDeer = lazyWithPreload(() => import("./pages/locations/RedDeer"));
const Okotoks = lazyWithPreload(() => import("./pages/locations/Okotoks"));
const Chestermere = lazyWithPreload(() => import("./pages/locations/Chestermere"));
const Crossfield = lazyWithPreload(() => import("./pages/locations/Crossfield"));
const HighRiver = lazyWithPreload(() => import("./pages/locations/HighRiver"));
const Strathmore = lazyWithPreload(() => import("./pages/locations/Strathmore"));
const AspenGardens = lazyWithPreload(() => import("./pages/locations/AspenGardens"));
const Tuscany = lazyWithPreload(() => import("./pages/locations/Tuscany"));
const Kensington = lazyWithPreload(() => import("./pages/locations/Kensington"));
const ArbourLake = lazyWithPreload(() => import("./pages/locations/ArbourLake"));
const ScenicAcres = lazyWithPreload(() => import("./pages/locations/ScenicAcres"));
const SkyviewRanch = lazyWithPreload(() => import("./pages/locations/SkyviewRanch"));
const Cityscape = lazyWithPreload(() => import("./pages/locations/Cityscape"));
const Marlborough = lazyWithPreload(() => import("./pages/locations/Marlborough"));
const SaddleRidge = lazyWithPreload(() => import("./pages/locations/SaddleRidge"));
const Mission = lazyWithPreload(() => import("./pages/locations/Mission"));
const MountRoyal = lazyWithPreload(() => import("./pages/locations/MountRoyal"));
const AspenWoods = lazyWithPreload(() => import("./pages/locations/AspenWoods"));
const MardaLoop = lazyWithPreload(() => import("./pages/locations/MardaLoop"));
const Mahogany = lazyWithPreload(() => import("./pages/locations/Mahogany"));
const AuburnBay = lazyWithPreload(() => import("./pages/locations/AuburnBay"));
const InglewoodCalgary = lazyWithPreload(() => import("./pages/locations/InglewoodCalgary"));
const Cranston = lazyWithPreload(() => import("./pages/locations/Cranston"));
const Woodcroft = lazyWithPreload(() => import("./pages/locations/Woodcroft"));
const Kilkenny = lazyWithPreload(() => import("./pages/locations/Kilkenny"));
const Miller = lazyWithPreload(() => import("./pages/locations/Miller"));
const MattBerry = lazyWithPreload(() => import("./pages/locations/MattBerry"));
const Ozerna = lazyWithPreload(() => import("./pages/locations/Ozerna"));
const McLeod = lazyWithPreload(() => import("./pages/locations/McLeod"));
const BrentwoodCalgary = lazyWithPreload(() => import("./pages/locations/BrentwoodCalgary"));
const VarsityCalgary = lazyWithPreload(() => import("./pages/locations/VarsityCalgary"));
const DalhousieCalgary = lazyWithPreload(() => import("./pages/locations/DalhousieCalgary"));
const BownessCalgary = lazyWithPreload(() => import("./pages/locations/BownessCalgary"));
const CapitolHillCalgary = lazyWithPreload(() => import("./pages/locations/CapitolHillCalgary"));
const HillhurstCalgary = lazyWithPreload(() => import("./pages/locations/HillhurstCalgary"));
const Thorncliffe = lazyWithPreload(() => import("./pages/locations/Thorncliffe"));
const HuntingtonHills = lazyWithPreload(() => import("./pages/locations/HuntingtonHills"));
const ForestLawn = lazyWithPreload(() => import("./pages/locations/ForestLawn"));
const Ogden = lazyWithPreload(() => import("./pages/locations/Ogden"));
const Southwood = lazyWithPreload(() => import("./pages/locations/Southwood"));
const Lakeview = lazyWithPreload(() => import("./pages/locations/Lakeview"));
const Beltline = lazyWithPreload(() => import("./pages/locations/Beltline"));
const EastVillage = lazyWithPreload(() => import("./pages/locations/EastVillage"));
const DowntownWestEnd = lazyWithPreload(() => import("./pages/locations/DowntownWestEnd"));
const EauClaire = lazyWithPreload(() => import("./pages/locations/EauClaire"));
const Sunnyside = lazyWithPreload(() => import("./pages/locations/Sunnyside"));
const BridgelandRiverside = lazyWithPreload(() => import("./pages/locations/BridgelandRiverside"));
const CrescentHeights = lazyWithPreload(() => import("./pages/locations/CrescentHeights"));
const Renfrew = lazyWithPreload(() => import("./pages/locations/Renfrew"));
const Sunalta = lazyWithPreload(() => import("./pages/locations/Sunalta"));
const Shaganappi = lazyWithPreload(() => import("./pages/locations/Shaganappi"));
const KillarneyGlengarry = lazyWithPreload(() => import("./pages/locations/KillarneyGlengarry"));
const Richmond = lazyWithPreload(() => import("./pages/locations/Richmond"));
const Tamarack = lazyWithPreload(() => import("./pages/locations/Tamarack"));
const Laurel = lazyWithPreload(() => import("./pages/locations/Laurel"));
const Larkspur = lazyWithPreload(() => import("./pages/locations/Larkspur"));
const MapleRidge = lazyWithPreload(() => import("./pages/locations/MapleRidge"));
const York = lazyWithPreload(() => import("./pages/locations/York"));
const EauxClaires = lazyWithPreload(() => import("./pages/locations/EauxClaires"));
const Schonsee = lazyWithPreload(() => import("./pages/locations/Schonsee"));
const Northmount = lazyWithPreload(() => import("./pages/locations/Northmount"));
const Rosslyn = lazyWithPreload(() => import("./pages/locations/Rosslyn"));
const Bankview = lazyWithPreload(() => import("./pages/locations/Bankview"));
const LowerMountRoyal = lazyWithPreload(() => import("./pages/locations/LowerMountRoyal"));
const Ramsay = lazyWithPreload(() => import("./pages/locations/Ramsay"));
const Erlton = lazyWithPreload(() => import("./pages/locations/Erlton"));
const VictoriaPark = lazyWithPreload(() => import("./pages/locations/VictoriaPark"));
const West = lazyWithPreload(() => import("./pages/locations/West"));
const ElbowPark = lazyWithPreload(() => import("./pages/locations/ElbowPark"));
const Altadore = lazyWithPreload(() => import("./pages/locations/Altadore"));
const CliffBungalow = lazyWithPreload(() => import("./pages/locations/CliffBungalow"));
const RideauPark = lazyWithPreload(() => import("./pages/locations/RideauPark"));
const Roxboro = lazyWithPreload(() => import("./pages/locations/Roxboro"));
const Parkhill = lazyWithPreload(() => import("./pages/locations/Parkhill"));
const StanleyPark = lazyWithPreload(() => import("./pages/locations/StanleyPark"));
const Manchester = lazyWithPreload(() => import("./pages/locations/Manchester"));
const WindsorPark = lazyWithPreload(() => import("./pages/locations/WindsorPark"));
const MeadowlarkPark = lazyWithPreload(() => import("./pages/locations/MeadowlarkPark"));
const Mayfair = lazyWithPreload(() => import("./pages/locations/Mayfair"));
const Scarboro = lazyWithPreload(() => import("./pages/locations/Scarboro"));
const SunaltaWest = lazyWithPreload(() => import("./pages/locations/SunaltaWest"));
const SpruceCliff = lazyWithPreload(() => import("./pages/locations/SpruceCliff"));
const Wildwood = lazyWithPreload(() => import("./pages/locations/Wildwood"));
const Montgomery = lazyWithPreload(() => import("./pages/locations/Montgomery"));
const Greenview = lazyWithPreload(() => import("./pages/locations/Greenview"));
const HighlandPark = lazyWithPreload(() => import("./pages/locations/HighlandPark"));
const TuxedoPark = lazyWithPreload(() => import("./pages/locations/TuxedoPark"));
const MountPleasant = lazyWithPreload(() => import("./pages/locations/MountPleasant"));



/**
 * Every route, as one element tree. App renders it inside <Routes>; main.tsx
 * matches the address against it before React's first render and preloads
 * that page's module (lazyWithPreload), so the first render never suspends
 * into the "Loading page…" fallback over the prerendered page. The
 * sitemap, redirect and .htaccess generators read the <Route path> lines
 * below from this file, so they stay here.
 */
// eslint-disable-next-line react-refresh/only-export-components -- route data, not a component
export const routeTree = (
  <>
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
    <Route path="/locations/red-deer" element={<RedDeer />} />
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
    {/* Preserved since 2026-09-11: the Red Deer branch's page, which its
        Google listing's Website button links. It used to 301 to /locations/. */}
    <Route path="/cleaning-services-red-deer" element={<RedDeer />} />
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
    <Route path="/what-to-expect-from-professional-cleaners" element={<Navigate to="/blog/choosing-cleaning-company/" replace />} />
    <Route path="/cleaning-services-lauderdale-edmonton-ab" element={<Navigate to="/locations/lauderdale/" replace />} />
    <Route path="/2011/how-cleaning-services-improve-your-homes-health" element={<Navigate to="/blog/" replace />} />
    <Route path="*" element={<NotFound />} />
  </>
);

const App = () => (
  <>
    <HelmetProvider>
      {/*
        Site-wide social image defaults.

        These used to sit as static tags in index.html, which meant a page could
        never override them: react-helmet-async only manages the tags it creates,
        so a page adding its own og:image produced TWO og:image tags rather than
        replacing the default. Owning them here lets the article pages supply
        their own hero while every other page still inherits this one.
      */}
      <Helmet>
        <meta property="og:image" content={`${SITE_ORIGIN}/og-image.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        {/* The card's text was re-drawn 2026-10-06: it said "Five-star rated on Google"
            (the real figure is 4.9, and Red Deer has no reviews) and left out Red Deer. */}
        <meta property="og:image:alt" content="Duty Cleaners: house cleaning in Edmonton, Calgary and Red Deer, rated 4.9 on Google in Edmonton and Calgary, pay after your clean" />
        <meta name="twitter:image" content={`${SITE_ORIGIN}/og-image.jpg`} />
      </Helmet>
      {/* Toaster, Sonner and TooltipProvider were mounted here and rendered
          nothing: no file outside components/ui calls toast() or useToast,
          and no <Tooltip> exists anywhere in the app. Their only effect was
          to make @radix-ui a static import of the entry chunk, so every page
          downloaded 231 KB to render three empty providers. */}
      <>
        {/* BASE_URL is "/" in dev and on the real domain; on the GitHub Pages
            staging preview it is the repo subpath, which the router needs. */}
        <BrowserRouter basename={import.meta.env.BASE_URL}>
        <QuoteOverlayProvider>
        <SkipLink />
        <ScrollToTop />
        <QuoteOverlay />

        <LoadErrorBoundary>
        <Suspense
          fallback={
            <div className="flex min-h-dvh items-center justify-center" role="status" aria-live="polite">
              <span className="sr-only">Loading page…</span>
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-navy border-t-transparent" aria-hidden="true" />
            </div>
          }
        >
        <Routes>{routeTree}</Routes>
        </Suspense>
        </LoadErrorBoundary>
        </QuoteOverlayProvider>
      </BrowserRouter>
    </>
    </HelmetProvider>
  </>
);

export default App;
