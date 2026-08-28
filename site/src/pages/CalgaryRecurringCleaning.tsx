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

export default function CalgaryRecurringCleaning() {
  return (
    <ServiceDetailPage
      city="calgary"
      crossCity={{ city: "Edmonton", to: "/edmonton/recurring-cleaning/", description: "Weekly and bi-weekly cleaning schedules for Edmonton homes." }}
      quoteService="recurring-cleaning"
      phone="(403) 768-1341"
      phoneHref="tel:4037681341"
      seoTitle="Recurring Cleaning Calgary | Weekly, Bi-Weekly & Monthly Service"
      seoDescription="Recurring house cleaning in Calgary. Weekly (20% off), bi-weekly (15% off), or monthly (10% off) scheduled cleaning from vetted professionals."
      canonical="https://dutycleaners.ca/calgary/recurring-cleaning"
      heroHeading={<>Recurring Cleaning in <AccentGold>Calgary</AccentGold></>}
      heroSubheading="Scheduled weekly, bi-weekly, or monthly cleaning to keep your home consistently clean and comfortable — with discounts on every recurring visit."
      heroBadges={["Weekly 20% Off", "Bi-Weekly 15% Off", "Monthly 10% Off"]}
      heroImage={heroImage}
      heroImageAlt="Bright, tidy Calgary living room maintained with recurring cleaning service"
      overviewEyebrow="Service Overview"
      overviewHeading={<>Always clean. <Accent>Never a chore.</Accent></>}
      overviewParagraphs={[
        "Recurring cleaning puts your home on a schedule, so it is looked after continuously rather than rescued occasionally. You pick the rhythm; we keep to it.",
        "Choosing that rhythm in Calgary usually comes down to the season and the front door. Because the city swings above and below freezing all winter instead of staying frozen, road sand and de-icer arrive indoors continuously from roughly October to April — so households that are comfortable on a monthly schedule through the summer often move to bi-weekly once the chinooks start. Homes with a dog, a garage entry, or small children tracking straight through from the yard tend to feel it first.",
        "Frequency also tracks how you live. A Beltline or Mission apartment where two people leave early and come back late genuinely holds up on a monthly visit. A family home in Evergreen, Panorama Hills or Cranston with a busy kitchen usually wants weekly or bi-weekly. There is no contract either way, so you can start on one cadence, see how your home actually behaves through a Calgary winter, and change it.",
      ]}
      includedHeading="What Every Recurring Visit Includes"
      includedSubheading="Consistent maintenance cleaning of the rooms and surfaces that matter most for a healthy, lived-in home."
      included={[
        { icon: UtensilsCrossed, title: "Kitchen Cleaning", description: "Wipe-down of countertops, sinks, stovetop, exterior appliances, and cabinet fronts. Floors mopped and vacuumed." },
        { icon: Bath, title: "Bathroom Sanitization", description: "Frequently touched surfaces wiped and sanitized." },
        { icon: Home, title: "Bedrooms & Living Areas", description: "Dusting accessible surfaces, vacuuming carpets and rugs, and mopping hard flooring throughout the home." },
      ]}
      bullets={[
        "Recurring maintenance cleaning on your schedule",
        "Kitchen, bathrooms, and living areas cleaned",
        "Floors vacuumed and mopped",
        "Flexible weekly, bi-weekly, or monthly scheduling",
        "Dusting of all accessible surfaces and furniture",
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
      pricingNote="Rates shown are one-time standard pricing, which is what your first clean costs. From the second visit on, recurring plans save 20% weekly · 15% bi-weekly · 10% monthly."
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
        { q: "How often should I book in Calgary specifically?", a: "Most Calgary households find the answer changes with the season. Because the city cycles above and below freezing all winter rather than staying frozen, road sand and de-icer come indoors continuously from about October to April — so homes that are comfortable monthly through summer often move to bi-weekly once the chinooks start. Homes with a dog, a garage entry or young children usually feel it first. There is no contract, so you can change the cadence whenever you like." },
        { q: "How much do I save with recurring cleaning?", a: "Your first clean is charged at the standard one-time rate. From your second visit onward you save 20% on weekly, 15% on bi-weekly and 10% on monthly cleanings, compared to one-time pricing." },
        { q: "Can I change or skip a scheduled cleaning?", a: "Yes — just give us reasonable notice and we'll reschedule or skip a visit. There's no long-term contract." },
        { q: "Will I have the same cleaner each visit?", a: "We do our best to send the same cleaning team for each visit so they become familiar with your home and preferences. However, in cases such as emergencies, sick days, or scheduled leave, we may send a different trusted team. If you prefer the same cleaners each time and have flexibility with scheduling, we can also adjust your appointment to a day when your regular team is available." },
        { q: "Do I need to be home during the cleaning?", a: "No. Most recurring clients provide a lockbox code, smart-lock access, or leave keys in a safe spot. We'll lock up after we're done." },
        { q: "Do I need to provide cleaning supplies?", a: "No — our team brings all cleaning supplies and equipment. If you would prefer we use specific products, tell us when you book." },
        { q: "What if I only need a single cleaning?", a: "If you'd prefer a one-time appointment, our standard or deep cleaning service are great fit." },
      ]}
      ctaHeading={<>Set it. Forget it. <AccentGold>Stay spotless.</AccentGold></>}
      ctaDescription="Lock in ongoing savings and a consistently clean home with weekly, bi-weekly, or monthly visits from vetted pros."
      galleryImages={[
        { src: kitchenImage, alt: "Spotless Calgary kitchen maintained by recurring cleaning service" },
        { src: livingRoomImage, alt: "Bright, consistently clean Calgary living room" },
        { src: cleanerImage, alt: "Professional cleaner wiping surfaces in a Calgary home" },
      ]}
    />
  );
}
