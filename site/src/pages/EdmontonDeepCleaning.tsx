import { formatPrice } from "@/data/pricing";
import { addOnFromPrice } from "@/data/pricing";
import ServiceDetailPage from "@/components/ServiceDetailPage";
import { deepCleanTierRows, featuredExtraRows } from "@/data/pricing";
import { Accent, AccentGold } from "@/components/Accent";
import { Sparkles, Bath, UtensilsCrossed, Layers } from "lucide-react";
import heroImage from "@/assets/gallery/kitchen-deep-clean.webp";

// Published figures come from bk-config via pricing.ts. Hand-typing them
// here is what let this page drift out of step with /pricing and with what
// BookingKoala actually charges.
/** Cheapest published price for an add-on, straight from bk-config. */
const addOnLabel = (key: string) => formatPrice(addOnFromPrice("standard", key) ?? 0);

const TIERS = deepCleanTierRows().map((row) => ({ size: row.beds, price: row.price }));

export default function EdmontonDeepCleaning() {
  return (
    <ServiceDetailPage
      city="edmonton"
      crossCity={{ city: "Calgary", to: "/calgary/deep-cleaning/", description: "The same top-to-bottom deep clean, delivered by our Calgary team.", linkText: "Deep cleaning in Calgary" }}
      quoteService="deep-cleaning"
      phone="(780) 913-6565"
      phoneHref="tel:7809136565"
      seoTitle="Deep Cleaning Services Edmonton | Duty Cleaners"
      seoDescription="Detailed deep cleaning in Edmonton: baseboards, switches, vents, appliance exteriors and built-up grime removed. Miss something? We re-clean it within 24 hours."
      canonical="https://dutycleaners.ca/edmonton/deep-cleaning"
      heroHeading={<>Deep Cleaning Services in <AccentGold>Edmonton</AccentGold></>}
      heroSubheading="A meticulous top-to-bottom reset for the areas regular cleaning never reaches."
      heroBadges={["Top-to-Bottom Detail", "All Supplies Brought For You", "100% Satisfaction Guarantee"]}
      heroImage={heroImage}
      heroImageAlt="Sparkling Edmonton kitchen after a professional deep cleaning"
      overviewEyebrow="Service Overview"
      overviewHeading={<>The reset regular cleaning <Accent>can't reach.</Accent></>}
      overviewParagraphs={[
        "Deep cleaning is a comprehensive, detail-driven reset of your home. It goes far beyond the surfaces touched during a regular visit — addressing built-up dust, grease, soap scum, and grime in the places that quietly collect dirt over months of use.",
        "Edmonton earns its deep cleans the hard way. Unlike cities that thaw mid-winter, this one freezes in November and stays frozen — so five months of sanded roads, salted parkade floors, and boot grit accumulate in one long season, then all of it lets go at once in the March melt. Entryways, stair runners, and the first three feet of every hallway take the worst of it, and by spring there is a layer of fine grit worked into carpet edges and along baseboards that weekly vacuuming no longer lifts. Meanwhile the furnace has been running since October, drying the air and circulating fine dust onto ceiling fans, vent covers, and the tops of door frames.",
        "What the work looks like depends on the house. In the mature, elm-lined neighbourhoods near the river valley — Westmount, Ritchie, Old Strathcona — older bungalows and character homes have original trim, radiators, and decades of paint layers that hold dust in every profile edge. In a Summerside or Windermere new build it is usually construction dust still resurfacing from vents and closet shelves a year after possession. And in an Oliver or Downtown tower, the job concentrates on window tracks, balcony door channels, and the film that settles on high-rise glass. Our team works top to bottom, room by room — scrubbing baseboards and door frames, hand-wiping switches and outlet covers, degreasing stovetops and range hoods, and detail-cleaning bathrooms.",
      ]}
      includedHeading="Detailed Top-to-Bottom Cleaning"
      includedSubheading="The places a weekly visit never reaches, room by room."
      included={[
        { icon: UtensilsCrossed, title: "Kitchen Detail Clean", description: "Degreasing stovetops, range hoods, exterior of appliances, cabinet fronts, backsplash, and sanitizing all prep surfaces." },
        { icon: Bath, title: "Bathroom Deep Scrub", description: "Tile, grout and shower glass detailed, soap scum and mineral build-up removed from tubs and fixtures, toilets scrubbed inside and out, vanities and mirrors polished." },
        { icon: Layers, title: "Edges & Details", description: "Hand-wiping baseboards, door frames, light switches, outlet covers, vents, and corners that collect dust." },
        { icon: Sparkles, title: "Full Dust Reset", description: "Detailed dusting of fans, vents, and accessible high and low areas throughout the home." },
      ]}
      bullets={[
        "All standard cleaning tasks included",
        "Baseboards hand-wiped throughout",
        "Doors, door frames, and trim wiped",
        "Light switches and outlet covers cleaned",
        "Stovetop and range hood degreased",
        "Exterior of all kitchen appliances cleaned",
        "Cabinet fronts and handles wiped",
        "Tile and shower glass detailed",
        "Vents and ceiling fans dusted",
        "Detailed cobweb and corner cleaning",
        "Floors thoroughly mopped and vacuumed",
      ]}
      roomTasks={[
        { name: "Kitchen Detail", tasks: 6, sample: "degreasing the stovetop and range hood" },
        { name: "Bathroom Scrub", tasks: 5, sample: "detailing tile and shower glass" },
        { name: "Edges & Details", tasks: 5, sample: "hand-wiping baseboards and door frames" },
        { name: "Bedrooms & Living", tasks: 4, sample: "dusting high and low areas" },
      ]}
      pricingBySize={TIERS}
      pricingNote="Starting estimates are based on home size — final time and cost can vary with condition, bathrooms, and add-ons."
      fromPrice={TIERS[0].price}
      extras={featuredExtraRows()}
      notIncluded={[
        // The list was all safety exclusions — 25 lb, ladders, mold. The four
        // below are scope, and they are what customers actually assume a deep
        // clean covers: the commonest disputes in this trade, on the page where
        // someone is about to spend several hundred dollars. Prices are derived
        // from bk-config, because the published-prices guard is right that a
        // hand-typed figure drifts the moment BookingKoala changes.
        `Inside the oven — add it for ${addOnLabel("inside-oven")}`,
        `Inside the fridge — add it for ${addOnLabel("inside-fridge")}`,
        `Inside cabinets and drawers — add it from ${addOnLabel("inside-cabinets-kitchen-bathroom-only")}`,
        `Interior windows — add them from ${addOnLabel("inside-windows")}`,
        "Wall washing — a separate service, not part of the deep package",
        "Moving heavy items over 25 lbs",
        "Outdoor or exterior window cleaning",
        "Mold remediation, bodily fluids, or pest removal",
        "Areas beyond the reach of a 3-step ladder",
        "Light bulbs and fragile fixtures",
        "Garages, patios, and outdoor areas (winter safety)",
      ]}
      faqs={[
        { q: "Can I book deep cleaning for only certain areas?", a: "Yes, you may request deep cleaning for specific areas, such as bathrooms, kitchen, basement, or main floor only." },
        { q: "Should I declutter before deep cleaning?", a: "Yes, we recommend removing clutter before the appointment so our team can focus on cleaning surfaces properly." },
        { q: "Is deep cleaning more expensive than standard cleaning?", a: "Yes, deep cleaning usually costs more because it requires more time, detail, and effort." },
        { q: "Does deep cleaning remove mold or mildew?", a: "We may wipe light surface mildew if safe, but we do not provide mold remediation or remove heavy mold." },
        { q: "When should I book a deep cleaning?", a: "In Edmonton the single best time is the spring melt, when a whole winter of sanding grit comes off boots and paws in the space of three weeks — late March and April bookings clear it before it grinds into floors. Fall, just before the furnace season closes the windows for six months, is a close second. Beyond that: before guests, after a renovation, after a long stretch without service, or as a first visit before starting a recurring schedule." },
        { q: "How long does a deep cleaning take?", a: "We work to a checklist, not a clock. Your team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes." },
        { q: "How is deep cleaning different from regular cleaning?", a: "Regular cleaning maintains an already-clean home. Deep cleaning tackles built-up grime, detailed edges, baseboards, and the areas that aren't included in every visit." },
        { q: "Do I need to prepare anything?", a: "Please pick up any personal items you'd like put away and clear surfaces such as vanities, countertops, and other cluttered areas so our cleaners can work efficiently. You may also let us know any priority areas or spaces you would like us to focus on or skip." },
        { q: "Are your products safe for kids and pets?", a: "Tell us about any sensitivities, or products you would rather we used, and we will work to them — just let us know when booking." },
        { q: "How often should I get a deep cleaning?", a: "Most homes benefit from a deep clean every 3–6 months, with regular maintenance cleaning in between." },
      ]}
      ctaHeading={<>Give your home the <AccentGold>full reset.</AccentGold></>}
      ctaDescription="Reset your home with a thorough, detail-driven cleaning. Flexible scheduling and a satisfaction guarantee on every visit."
      galleryImages={[
        { src: heroImage, alt: "Sparkling Edmonton kitchen after a professional deep cleaning" },
      ]}
    />
  );
}
