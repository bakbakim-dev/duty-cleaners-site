import ServiceDetailPage from "@/components/ServiceDetailPage";
import { standardTierRows, featuredExtraRows } from "@/data/pricing";
import { Accent, AccentGold } from "@/components/Accent";
import { Home, Bath, UtensilsCrossed } from "lucide-react";
import heroImage from "@/assets/gallery/calgary-living-room-clean.jpg";
import kitchenImage from "@/assets/gallery/calgary-spotless-kitchen.jpg";
import livingRoomImage from "@/assets/gallery/calgary-clean-home-northwest.jpg";
import cleanerImage from "@/assets/gallery/calgary-team-cleaning.jpg";

// Published figures come from bk-config via pricing.ts. Hand-typing them
// here is what let this page drift out of step with /pricing and with what
// BookingKoala actually charges.
const TIERS = standardTierRows().map((row) => ({ size: row.beds, price: row.price }));

export default function CalgaryRegularCleaning() {
  return (
    <ServiceDetailPage
      city="calgary"
      quoteService="regular-cleaning"
      phone="(403) 768-1341"
      phoneHref="tel:4037681341"
      seoTitle="Standard Cleaning Calgary | Professional Maid Service | Duty Cleaners"
      seoDescription="Reliable standard house cleaning in Calgary. One-time thorough cleaning from vetted professionals using non-toxic products. 100% satisfaction guaranteed."
      canonical="https://dutycleaners.ca/calgary/regular-cleaning"
      heroHeading={<>Standard Cleaning in <AccentGold>Calgary</AccentGold></>}
      heroSubheading="A one-time professional cleaning appointment for busy households — recurring plans available if you'd like ongoing maintenance."
      heroBadges={["Vetted Professionals", "High Quality Cleaning Supplies", "100% Satisfaction Guarantee"]}
      heroImage={heroImage}
      heroImageAlt="Bright, tidy Calgary living room after a standard cleaning visit"
      overviewEyebrow="Service Overview"
      overviewHeading={<>A spotless home, <Accent>without lifting a finger.</Accent></>}
      overviewParagraphs={[
        "Regular cleaning keeps your home consistently comfortable without the effort falling to you. It covers the surfaces that matter week to week — kitchen, bathrooms, floors, and the living spaces you actually use.",
        "In Calgary that job is mostly a losing battle with dust, and the reason is geography. The city is dry, it is windy, and it sits where the prairie meets the foothills, so fine grit stays in the air far more of the year than it does further north. Add a winter that thaws and refreezes on a chinook rather than staying locked in, and entryways take a beating from October through April as road sand and de-icer come in on boots, over and over.",
        "That is why a steady rhythm beats an occasional blitz here. Regular visits keep the grit from ever becoming build-up: floors and entry areas get cleared before anything sets, bathrooms stay ahead of hard-water marks, and the kitchen never reaches the point of needing a full degrease. Whether that is a downtown condo or a family home in Tuscany or Auburn Bay, the same principle holds — it is far less work to stay ahead of a Calgary winter than to recover from one.",
      ]}
      includedHeading="Comprehensive Standard Cleaning"
      includedSubheading="Your one-time appointment covers the rooms and surfaces that matter most for a healthy, lived-in home."
      included={[
        { icon: UtensilsCrossed, title: "Kitchen Cleaning", description: "Wipe-down of countertops, sinks, stovetop, exterior appliances, and cabinet fronts. Floors mopped and vacuumed." },
        { icon: Bath, title: "Bathroom Sanitization", description: "Frequently touched surfaces wiped and sanitized." },
        { icon: Home, title: "Bedrooms & Living Areas", description: "Dusting accessible surfaces, vacuuming carpets and rugs, and mopping hard flooring throughout the home." },
      ]}
      bullets={[
        "Dusting of all accessible surfaces and furniture",
        "Vacuuming carpets, and rugs",
        "Mopping all hard floors",
        "Kitchen counters, sink, and stovetop cleaned",
        "Exterior of appliances and cabinets wiped",
        "Bathrooms scrubbed and sanitized",
        "Mirrors and glass surfaces polished",
        "Trash emptied",
      ]}
      roomTasks={[
        { name: "Kitchen", tasks: 4, sample: "countertops, stovetop, and sink" },
        { name: "Bathrooms", tasks: 4, sample: "sanitizing toilets, tubs, and showers" },
        { name: "Living Areas", tasks: 4, sample: "dusting, vacuuming, and mopping" },
        { name: "Bedrooms", tasks: 3, sample: "dusting surfaces and vacuuming under beds" },
      ]}
      pricingBySize={TIERS}
      pricingNote="Starting estimates are based on home size — final time and cost can vary with condition, bathrooms, and add-ons."
      fromPrice={TIERS[0].price}
      extras={featuredExtraRows()}
      notIncluded={[
        "Moving heavy items over 25 lbs",
        "Outdoor or exterior window cleaning",
        "Mold remediation, bodily fluids, or pest removal",
        "Areas beyond the reach of a 3-step ladder",
        "Light bulbs and fragile fixtures",
        "Garages, patios, and outdoor areas (winter safety)",
      ]}
      faqs={[
        { q: "Why does my Calgary home get dusty so quickly?", a: "Calgary is dry, windy, and sits where the prairie meets the foothills, so fine grit stays airborne far more of the year than it does further north. Through winter it is compounded by road sand and de-icer coming in on boots every time a chinook melts things off. It is not a sign you are doing anything wrong — it is why a steady cleaning rhythm works better here than an occasional big effort." },
        { q: "Does standard cleaning include cleaning the kitchen?", a: "Yes. We clean kitchen counters, sinks, exterior appliance surfaces, outside of the cupboards, and floors." },
        { q: "What's the difference between standard and deep cleaning?", a: "Standard cleaning refreshes a home that's already clean — dusting, vacuuming, mopping, and sanitizing high-use areas. Deep cleaning tackles built-up grime, baseboards, doors, light switches, wall outlets, and outside vents." },
        { q: "How long does a standard cleaning take?", a: "We work to a checklist, not a clock. Your team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes." },
        { q: "How often should I schedule standard cleaning?", a: "Most Calgary households book standard cleaning as needed — before events, seasonally, or whenever their home needs a refresh. For ongoing upkeep, many clients book every 2–4 weeks." },
        { q: "Do I need to be home during the cleaning?", a: "No. Most clients provide a lockbox code, smart-lock access, or leave the keys under the mat. We'll lock up after we're done." },
        { q: "Do I need to provide cleaning supplies?", a: "No — our team brings all cleaning supplies and equipment, including non-toxic products that are safe for children and pets." },
        { q: "What should I do to prepare?", a: "Please pick up any personal items you'd like put away and clear surfaces such as vanities, countertops, and other cluttered areas so our cleaners can work efficiently. You may also let us know any priority areas or spaces you would like us to focus on or skip." },
      ]}
      ctaHeading={<>Ready for a spotless <AccentGold>Calgary</AccentGold> home?</>}
      ctaDescription="Book a one-time professional cleaning with vetted pros and a 100% satisfaction guarantee. Recurring plans available if you'd like ongoing maintenance."
      galleryImages={[
        { src: kitchenImage, alt: "Spotless Calgary kitchen after standard cleaning service" },
        { src: livingRoomImage, alt: "Bright, freshly cleaned Calgary living room" },
        { src: cleanerImage, alt: "Professional cleaner wiping surfaces in a Calgary home" },
      ]}
    />
  );
}
