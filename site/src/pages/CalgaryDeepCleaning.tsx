import { formatPrice } from "@/data/pricing";
import { addOnFromPrice } from "@/data/pricing";
import ServiceDetailPage from "@/components/ServiceDetailPage";
import { deepCleanTierRows, featuredExtraRows } from "@/data/pricing";
import { Accent, AccentGold } from "@/components/Accent";
import { Sparkles, Bath, UtensilsCrossed, Layers } from "lucide-react";
import heroImage from "@/assets/gallery/calgary-kitchen-clean.webp";

// Published figures come from bk-config via pricing.ts. Hand-typing them
// here is what let this page drift out of step with /pricing and with what
// BookingKoala actually charges.
/** Cheapest published price for an add-on, straight from bk-config. */
const addOnLabel = (key: string) => formatPrice(addOnFromPrice("standard", key) ?? 0);

const TIERS = deepCleanTierRows().map((row) => ({ size: row.beds, price: row.price }));

export default function CalgaryDeepCleaning() {
  return (
    <ServiceDetailPage
      city="calgary"
      crossCity={{ city: "Edmonton", to: "/edmonton/deep-cleaning/", description: "The same top-to-bottom deep clean, delivered by our Edmonton team.", linkText: "Deep cleaning in Edmonton" }}
      quoteService="deep-cleaning"
      phone="(403) 768-1341"
      phoneHref="tel:4037681341"
      seoTitle="Deep Cleaning Services Calgary | Duty Cleaners"
      seoDescription="Deep cleaning in Calgary: baseboards, switches, vents, appliance exteriors and built-up grime removed. We re-clean any miss within 24 hours."
      canonical="https://dutycleaners.ca/calgary/deep-cleaning"
      heroHeading={<>Deep Cleaning Services in <AccentGold>Calgary</AccentGold></>}
      heroSubheading="A meticulous top-to-bottom reset for the areas regular cleaning never reaches."
      heroBadges={["Top-to-Bottom Detail", "All Supplies Brought For You", "100% Satisfaction Guarantee"]}
      heroImage={heroImage}
      heroImageAlt="Sparkling Calgary kitchen after a professional deep cleaning"
      overviewEyebrow="Service Overview"
      overviewHeading={<>The reset regular cleaning <Accent>can't reach.</Accent></>}
      overviewParagraphs={[
        "Deep cleaning is a comprehensive, detail-driven reset of your home. It goes far beyond the surfaces touched during a regular visit — addressing built-up dust, grease, soap scum, and grime in the places that accumulate quietly over months.",
        "Calgary homes collect that build-up differently than most. Sitting at the foot of the Rockies, the city thaws and refreezes all winter long, so roads are gritted, melted and gritted again rather than staying frozen through to spring. That sand and de-icer does not stop at the door. It works along baseboards, into carpet edges, down the sides of stair treads and under furniture — and by February it is somewhere a vacuum no longer reaches. A deep clean is what actually takes it back out.",
        "The rest depends on where you live. In a Beltline or Eau Claire condo the work concentrates on window tracks, balcony door channels and the fine dust that a dry, windy city drives into every seal. In a newer home out in Mahogany, Cranston or Seton it is usually construction dust, which keeps resurfacing from vents, closet shelves and the tops of doors for a year or two after handover. Our team works methodically from top to bottom, room by room — scrubbing baseboards and door frames, hand-wiping switches and outlet covers, degreasing stovetops and range hoods, and detailing tile and shower glass.",
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
        { q: "Is there a best time of year for a deep clean in Calgary?", a: "Early spring is the most popular, because it clears out a full winter of road sand and de-icer at once — Calgary thaws and refreezes on chinooks all season, so entryways and baseboards collect grit continuously rather than staying frozen over. Late autumn is the other good window, resetting the house before that cycle starts. Both book up quickly, so give us a week or two of notice if you can." },
        { q: "Can I book deep cleaning for only certain areas?", a: "Yes, you may request deep cleaning for specific areas, such as bathrooms, kitchen, basement, or main floor only." },
        { q: "Should I declutter before deep cleaning?", a: "Yes, we recommend removing clutter before the appointment so our team can focus on cleaning surfaces properly." },
        { q: "Is deep cleaning more expensive than standard cleaning?", a: "Yes, deep cleaning usually costs more because it requires more time, detail, and effort." },
        { q: "Does deep cleaning remove mold or mildew?", a: "We may wipe light surface mildew if safe, but we do not provide mold remediation or remove heavy mold." },
        { q: "When should I book a deep cleaning?", a: "Book a deep clean for a seasonal refresh, before guests arrive, after a renovation, after a long stretch without service, or as your first visit before starting a recurring schedule." },
        { q: "How long does a deep cleaning take?", a: "We work to a checklist, not a clock. Your team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes." },
        { q: "How is deep cleaning different from regular cleaning?", a: "Regular cleaning maintains an already-clean home. Deep cleaning tackles built-up grime, detailed edges, baseboards, and the areas that aren't included in every visit." },
        { q: "Do I need to prepare anything?", a: "Please pick up any personal items you'd like put away and clear surfaces such as vanities, countertops, and other cluttered areas so our cleaners can work efficiently. You may also let us know any priority areas or spaces you would like us to focus on or skip." },
        { q: "Are your products safe for kids and pets?", a: "Tell us about any sensitivities, or products you would rather we used, and we will work to them — just let us know when booking." },
        { q: "How often should I get a deep cleaning?", a: "Most homes benefit from a deep clean every 3–6 months, with regular maintenance cleaning in between." },
      ]}
      ctaHeading={<>Give your home the <AccentGold>full reset.</AccentGold></>}
      ctaDescription="Reset your home with a thorough, detail-driven cleaning. Flexible scheduling and a satisfaction guarantee on every visit."
      galleryImages={[
        { src: heroImage, alt: "Sparkling Calgary kitchen after a professional deep cleaning" },
      ]}
    />
  );
}
