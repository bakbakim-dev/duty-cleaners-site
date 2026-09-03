import { POLICY } from "@/data/policy";
import ServiceDetailPage from "@/components/ServiceDetailPage";
import { standardTierRows, featuredExtraRows } from "@/data/pricing";
import { Accent, AccentGold } from "@/components/Accent";
import { Home, Bath, UtensilsCrossed } from "lucide-react";
import heroImage from "@/assets/gallery/family-clean-home-edmonton.webp";
import kitchenImage from "@/assets/gallery/summerside-cleaner-home.webp";
import livingRoomImage from "@/assets/gallery/glenora-cleaner-living-room.webp";
import cleanerImage from "@/assets/gallery/westmount-cleaner-kitchen.webp";

// Published figures come from bk-config via pricing.ts. Hand-typing them
// here is what let this page drift out of step with /pricing and with what
// BookingKoala actually charges.
const TIERS = standardTierRows().map((row) => ({ size: row.beds, price: row.price }));

export default function EdmontonRecurringCleaning() {
  return (
    <ServiceDetailPage
      city="edmonton"
      crossCity={{ city: "Calgary", to: "/calgary/recurring-cleaning/", description: "Weekly and bi-weekly cleaning schedules for Calgary homes." }}
      quoteService="recurring-cleaning"
      phone="(780) 913-6565"
      phoneHref="tel:7809136565"
      seoTitle="Recurring Cleaning Edmonton | Weekly, Bi-Weekly & Monthly"
      seoDescription="Recurring house cleaning in Edmonton. Weekly (20% off), bi-weekly (15% off), or monthly (10% off) scheduled cleaning from vetted professionals."
      canonical="https://dutycleaners.ca/edmonton/recurring-cleaning"
      heroHeading={<>Recurring Cleaning in <AccentGold>Edmonton</AccentGold></>}
      heroSubheading="Scheduled weekly, bi-weekly, or monthly cleaning to keep your home consistently clean and comfortable — with discounts on every recurring visit."
      heroBadges={["Weekly 20% Off", "Bi-Weekly 15% Off", "Monthly 10% Off"]}
      heroImage={heroImage}
      heroImageAlt="Bright, tidy Edmonton living room maintained with recurring cleaning service"
      overviewEyebrow="Service Overview"
      overviewHeading={<>Always clean. <Accent>Never a chore.</Accent></>}
      overviewParagraphs={[
        "Recurring cleaning is an ongoing scheduled service designed to keep your Edmonton home consistently clean week after week. Choose the cadence that fits your household — weekly, bi-weekly, or monthly — and your home stays tidy, hygienic, and guest-ready without the hassle of booking each time.",
        "Every recurring appointment covers the kitchen, bathrooms, bedrooms, and living areas, including dusting, vacuuming, mopping, and sanitizing high-touch surfaces. Because we visit on a regular schedule, we get to know your home and your preferences, delivering a reliable standard of cleanliness over time.",
        "A regular cadence earns its keep here more than in most cities. Edmonton's furnace season runs from October into April, and a home that is sealed up for six months cycles dust faster than one with the windows open — bi-weekly visits keep ahead of what settles on fans, sills, and electronics. Through the winter itself, scheduled cleans keep entry mats, front halls, and stair treads from grinding sanded-road grit into the floors, and when the March melt arrives the mess meets a maintained home instead of a neglected one. Weekly works best for busy households in family neighbourhoods like Summerside or Terwillegar; bi-weekly suits most homes; monthly fits condo dwellers in Oliver and Downtown whose square footage stays manageable between visits.",
        "Your first clean is at the standard one-time rate; from your second visit on, recurring clients save on every visit: 20% off weekly, 15% off bi-weekly, and 10% off monthly cleanings. Our cleaners bring all supplies and equipment.",
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
        { q: "How much do I save with recurring cleaning?", a: "Your first clean is charged at the standard one-time rate. From your second visit onward you save 20% on weekly, 15% on bi-weekly and 10% on monthly cleanings, compared to one-time pricing." },
        { q: "Can I change or skip a scheduled cleaning?", a: `Yes, and there is no long-term contract — you can change, skip or pause a recurring schedule at any time. We ask for at least ${POLICY.cancellationNoticeHours} hours' notice so the slot can go to someone else. Inside that window there is a ${POLICY.cancellationFee} fee, and if the team arrives and cannot get in, the visit is charged at ${POLICY.lockoutFee}.` },
        { q: "Will I have the same cleaner each visit?", a: "We do our best to send the same cleaning team for each visit so they become familiar with your home and preferences. However, in cases such as emergencies, sick days, or scheduled leave, we may send a different trusted team. If you prefer the same cleaners each time and have flexibility with scheduling, we can also adjust your appointment to a day when your regular team is available." },
        { q: "Do I need to be home during the cleaning?", a: "No. Most recurring clients provide a lockbox code, smart-lock access, or leave keys in a safe spot. We'll lock up after we're done." },
        { q: "Do I need to provide cleaning supplies?", a: "No — our team brings all cleaning supplies and equipment. If you would prefer we use specific products, tell us when you book." },
        { q: "What if I only need a single cleaning?", a: "If you'd prefer a one-time appointment, our standard or deep cleaning services are a great fit." },
        { q: "Which schedule do Edmonton clients usually pick?", a: "Bi-weekly is the most common choice across the city — it keeps ahead of furnace-season dust without over-servicing a tidy home. Families in newer areas like Summerside and Windermere often move to weekly during the school year, and downtown condo clients frequently find monthly is enough. You can change cadence at any time as the seasons or your household change." },
      ]}
      ctaHeading={<>Set it. Forget it. <AccentGold>Stay spotless.</AccentGold></>}
      ctaDescription="Lock in ongoing savings and a consistently clean home with weekly, bi-weekly, or monthly visits from vetted pros."
      galleryImages={[
        { src: kitchenImage, alt: "Spotless Edmonton kitchen maintained by recurring cleaning service" },
        { src: livingRoomImage, alt: "Bright, consistently clean Edmonton living room" },
        { src: cleanerImage, alt: "Professional cleaner wiping surfaces in an Edmonton home" },
      ]}
    />
  );
}
