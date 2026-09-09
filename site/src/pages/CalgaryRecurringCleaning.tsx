import { POLICY } from "@/data/policy";
import ServiceDetailPage from "@/components/ServiceDetailPage";
import { standardTierRows, featuredExtraRows } from "@/data/pricing";
import { Accent, AccentGold } from "@/components/Accent";
import { Home, Bath, UtensilsCrossed } from "lucide-react";
import heroImage from "@/assets/gallery/calgary-living-room-clean.webp";
import kitchenImage from "@/assets/gallery/calgary-spotless-kitchen.webp";
import livingRoomImage from "@/assets/gallery/calgary-clean-home-northwest.webp";
import cleanerImage from "@/assets/gallery/calgary-team-cleaning.webp";

// Published figures come from bk-config via pricing.ts. Hand-typing them
// here is what let this page drift out of step with /pricing and with what
// BookingKoala actually charges.
const TIERS = standardTierRows().map((row) => ({ size: row.beds, price: row.price }));

export default function CalgaryRecurringCleaning() {
  return (
    <ServiceDetailPage
      city="calgary"
      crossCity={{ city: "Edmonton", to: "/edmonton/recurring-cleaning/", description: "Weekly and bi-weekly cleaning schedules for Edmonton homes.", linkText: "Recurring cleaning in Edmonton" }}
      quoteService="recurring-cleaning"
      phone="(403) 768-1341"
      phoneHref="tel:4037681341"
      seoTitle="Recurring Cleaning Calgary | Weekly to Every 4 Weeks"
      seoDescription="Recurring house cleaning in Calgary. Weekly 20% off, bi-weekly 15% off, every 4 weeks 10% off, from vetted professionals."
      canonical="https://dutycleaners.ca/calgary/recurring-cleaning"
      heroHeading={<>Recurring Cleaning in <AccentGold>Calgary</AccentGold></>}
      heroSubheading="Weekly, bi-weekly or every-4-weeks visits of the standard clean. Your first visit is at the one-time rate; every visit after it is 20% off weekly, 15% off bi-weekly or 10% off every 4 weeks."
      heroBadges={["Weekly 20% Off", "Bi-Weekly 15% Off", "Every 4 Weeks 10% Off"]}
      heroImage={heroImage}
      heroImageAlt="Bright, tidy Calgary living room maintained with recurring cleaning service"
      overviewEyebrow="Service Overview"
      overviewHeading={<>Standard cleaning, <Accent>on a schedule you set.</Accent></>}
      overviewParagraphs={[
        "Recurring cleaning is the standard clean repeated weekly, bi-weekly or every 4 weeks. The first visit is charged at the one-time rate; from the second, weekly is 20% off, bi-weekly 15% off and every 4 weeks 10% off. You pick the cadence; we keep to it.",
        "Choosing that cadence in Calgary usually comes down to the season and the front door. Because the city swings above and below freezing all winter instead of staying frozen, road sand and de-icer arrive indoors continuously from roughly October to April — so households that are comfortable on an every-4-weeks schedule through the summer often move to bi-weekly once the chinooks start. Homes with a dog, a garage entry, or small children tracking straight through from the yard tend to feel it first.",
        "Frequency also tracks how you live. A Beltline or Mission apartment where two people leave early and come back late genuinely holds up on a visit every 4 weeks. A family home in Evergreen, Panorama Hills or Cranston with a busy kitchen usually wants weekly or bi-weekly. There is no contract either way, so you can start on one cadence, see how your home actually behaves through a Calgary winter, and change it.",
      ]}
      includedHeading="What Every Recurring Visit Includes"
      includedSubheading="Kitchen, bathrooms, bedrooms and living areas, on every visit."
      included={[
        { icon: UtensilsCrossed, title: "Kitchen Cleaning", description: "Wipe-down of countertops, sinks, stovetop, exterior appliances, and cabinet fronts. Floors mopped and vacuumed." },
        { icon: Bath, title: "Bathroom Sanitization", description: "Toilets, tubs and showers scrubbed and sanitized, soap scum off the tile and glass, mirrors and vanities polished, floors washed." },
        { icon: Home, title: "Bedrooms & Living Areas", description: "Dusting accessible surfaces, vacuuming carpets and rugs, and mopping hard flooring throughout the home." },
      ]}
      bullets={[
        "Kitchen, bathrooms, and living areas cleaned",
        "Floors vacuumed and mopped",
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
      pricingNote="Rates shown are one-time standard pricing, which is what your first clean costs. From the second visit on, recurring plans save 20% weekly · 15% bi-weekly · 10% every 4 weeks."
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
        { q: "How often should I book in Calgary specifically?", a: "Bi-weekly through the winter and every 4 weeks through the summer is the usual pattern; homes with a dog, a garage entry or young children tend to stay bi-weekly all year. There is no contract, so start on one cadence and change it once you see how the house behaves." },
        { q: "How much do I save with recurring cleaning?", a: "Your first clean is charged at the standard one-time rate. From your second visit onward you save 20% on weekly, 15% on bi-weekly and 10% on every-4-weeks cleanings, compared to one-time pricing." },
        { q: "Can I change or skip a scheduled cleaning?", a: `Yes, and there is no long-term contract — you can change, skip or pause a recurring schedule at any time. We ask for at least ${POLICY.cancellationNoticeHours} hours' notice so the slot can go to someone else. Inside that window there is a ${POLICY.cancellationFee} fee, and if the team arrives and cannot get in, the visit is charged at ${POLICY.lockoutFee}.` },
        { q: "Will I have the same cleaner each visit?", a: "We do our best to send the same cleaning team for each visit so they become familiar with your home and preferences. However, in cases such as emergencies, sick days, or scheduled leave, we may send a different trusted team. If you prefer the same cleaners each time and have flexibility with scheduling, we can also adjust your appointment to a day when your regular team is available." },
        { q: "Do I need to be home during the cleaning?", a: "No. Most recurring clients provide a lockbox code, smart-lock access, or leave keys in a safe spot. We'll lock up after we're done." },
        { q: "Do I need to provide cleaning supplies?", a: "No — our team brings all cleaning supplies and equipment. If you would prefer we use specific products, tell us when you book." },
        { q: "What if I only need a single cleaning?", a: "A one-time standard clean or deep clean will suit you better; both are priced flat by home size. If you later want it kept up, the schedule discount applies from the second visit." },
      ]}
      ctaHeading={<>Recurring cleaning in <AccentGold>Calgary</AccentGold> from {TIERS[0].price}.</>}
      ctaDescription={`Your first visit is at the one-time rate, from ${TIERS[0].price} for a one-bedroom; after that, weekly is 20% off, bi-weekly 15% off and every 4 weeks 10% off. There is no contract, and a change or skip needs ${POLICY.cancellationNoticeHours} hours' notice.`}
      galleryImages={[
        { src: kitchenImage, alt: "Calgary kitchen after a recurring cleaning visit" },
        { src: livingRoomImage, alt: "Bright, consistently clean Calgary living room" },
        { src: cleanerImage, alt: "Professional cleaner wiping surfaces in a Calgary home" },
      ]}
    />
  );
}
