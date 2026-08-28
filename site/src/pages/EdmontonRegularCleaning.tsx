import ServiceDetailPage from "@/components/ServiceDetailPage";
import { standardTierRows, featuredExtraRows } from "@/data/pricing";
import { Accent, AccentGold } from "@/components/Accent";
import { Home, Bath, UtensilsCrossed } from "lucide-react";
import heroImage from "@/assets/gallery/family-clean-home-edmonton.jpg";
import kitchenImage from "@/assets/gallery/lakeview-clean-kitchen.jpg";
import livingRoomImage from "@/assets/gallery/edmonton-standard-bathroom-shelves.webp";
import cleanerImage from "@/assets/gallery/westmount-cleaner-kitchen.jpg";

// Published figures come from bk-config via pricing.ts. Hand-typing them
// here is what let this page drift out of step with /pricing and with what
// BookingKoala actually charges.
const TIERS = standardTierRows().map((row) => ({ size: row.beds, price: row.price }));

export default function EdmontonRegularCleaning() {
  return (
    <ServiceDetailPage
      city="edmonton"
      quoteService="regular-cleaning"
      phone="(780) 913-6565"
      phoneHref="tel:7809136565"
      seoTitle="Standard Cleaning & Maid Service Edmonton | Duty Cleaners"
      seoDescription="Reliable standard house cleaning in Edmonton. One-time thorough cleaning from vetted professionals. 100% satisfaction guaranteed."
      canonical="https://dutycleaners.ca/edmonton/regular-cleaning"
      heroHeading={<>Standard Cleaning Services in <AccentGold>Edmonton</AccentGold></>}
      heroSubheading="A one-time professional cleaning appointment for busy households — recurring plans available if you'd like ongoing maintenance."
      heroBadges={["Vetted Professionals", "High Quality Cleaning Supplies", "100% Satisfaction Guarantee"]}
      heroImage={heroImage}
      heroImageAlt="Bright, tidy Edmonton living room after a standard cleaning visit"
      overviewEyebrow="Service Overview"
      overviewHeading={<>A spotless home, <Accent>without lifting a finger.</Accent></>}
      overviewParagraphs={[
        "Standard cleaning is a thorough one-time service designed to refresh your Edmonton home, making it hygienic, presentable, and comfortable. It's a single cleaning appointment focused on the areas you use most, removing dust, grime, and bacteria that build up over time. If you'd prefer ongoing upkeep, recurring cleaning plans are also available separately.",
        "Your appointment covers the kitchen, bathrooms, bedrooms, and living areas — including dusting, vacuuming, mopping, sanitizing high-touch surfaces, and general surface cleaning throughout the home. Whether you need a reset before guests arrive or simply want your space professionally cleaned, our team delivers a high standard of cleanliness in a single visit.",
        "Our cleaners follow a detailed room-by-room checklist, bring all necessary cleaning supplies and equipment. To help us focus on cleaning, we ask that homes are reasonably prepared before arrival, including picking up clothing, toys, dishes, or excessive clutter. Small items may be lightly organized if it only takes 1–2 minutes, but our primary focus is professional cleaning rather than full decluttering or home organization services.",
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
        { q: "Does standard cleaning include cleaning the kitchen?", a: "Yes. We clean kitchen counters, sinks, exterior appliance surfaces, outside of the cupboards, and floors." },
        { q: "What's the difference between standard and deep cleaning?", a: "Standard cleaning refreshes a home that's already clean — dusting, vacuuming, mopping, and sanitizing high-use areas. Deep cleaning tackles built-up grime, baseboards, doors, light switches, wall outlets, and outside vents." },
        { q: "How long does a standard cleaning take?", a: "We work to a checklist, not a clock. Your team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes." },
        { q: "How often should I schedule standard cleaning?", a: "Most Edmonton households book standard cleaning as needed — before events, seasonally, or whenever their home needs a refresh. For ongoing upkeep, many clients book every 2–4 weeks." },
        { q: "Do I need to be home during the cleaning?", a: "No. Most clients provide a lockbox code, smart-lock access, or leave the keys under the mat. We'll lock up after we're done." },
        { q: "Do I need to provide cleaning supplies?", a: "No — our team brings all cleaning supplies and equipment. If you would prefer we use specific products, tell us when you book." },
        { q: "What should I do to prepare?", a: "Please pick up any personal items you'd like put away and clear surfaces such as vanities, countertops, and other cluttered areas so our cleaners can work efficiently. You may also let us know any priority areas or spaces you would like us to focus on or skip." },
      ]}
      ctaHeading={<>Ready for a spotless <AccentGold>Edmonton</AccentGold> home?</>}
      ctaDescription="Book a one-time professional cleaning with vetted pros and a 100% satisfaction guarantee. Recurring plans available if you'd like ongoing maintenance."
      galleryImages={[
        { src: kitchenImage, alt: "Clean, tidy kitchen after standard cleaning service in Edmonton" },
        { src: livingRoomImage, alt: "Freshly cleaned Edmonton bathroom with tidy shelves and polished surfaces" },
        { src: cleanerImage, alt: "Professional cleaner wiping kitchen surfaces in an Edmonton home" },
      ]}
    />
  );
}
