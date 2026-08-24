import ServiceDetailPage from "@/components/ServiceDetailPage";
import { Accent, AccentGold } from "@/components/Accent";
import { Home, Bath, UtensilsCrossed } from "lucide-react";
import heroImage from "@/assets/gallery/family-clean-home-edmonton.jpg";
import kitchenImage from "@/assets/gallery/summerside-cleaner-home.jpg";
import livingRoomImage from "@/assets/gallery/glenora-cleaner-living-room.jpg";
import cleanerImage from "@/assets/gallery/westmount-cleaner-kitchen.jpg";

export default function EdmontonRecurringCleaning() {
  return (
    <ServiceDetailPage
      city="edmonton"
      quoteService="recurring-cleaning"
      phone="(780) 913-6565"
      phoneHref="tel:7809136565"
      seoTitle="Recurring Cleaning Edmonton | Weekly, Bi-Weekly & Monthly Service"
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
        "Recurring clients receive built-in savings on every visit: 20% off weekly, 15% off bi-weekly, and 10% off monthly cleanings. Our cleaners use non-toxic products that are safe for kids and pets, and bring all supplies and equipment.",
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
      pricingBySize={[
        { size: "1 Bedroom", price: "$155" },
        { size: "2 Bedroom", price: "$195" },
        { size: "3 Bedroom", price: "$232" },
        { size: "4 Bedroom", price: "$284" },
        { size: "5+ Bedroom", price: "$305" },
      ]}
      pricingNote="Rates shown are one-time standard pricing. Recurring plans save on every visit: 20% off weekly · 15% off bi-weekly · 10% off monthly."
      fromPrice="$155"
      extras={[
        { name: "Inside fridge cleaning", price: "$59.99" },
        { name: "Inside oven cleaning", price: "$59.99" },
        { name: "Inside cabinets (empty)", price: "$74.99" },
        { name: "Interior window cleaning", price: "$64.99" },
        { name: "Baseboards (2 rooms min)", price: "$105" },
        { name: "Spot wall cleaning (2 rooms min)", price: "$59.99" },
        { name: "Wipe window blinds", price: "$15/set" },
        { name: "Balcony/garage sweeping", price: "$29.99" },
      ]}
      notIncluded={[
        "Moving heavy items over 25 lbs",
        "Outdoor or exterior window cleaning",
        "Mold remediation, bodily fluids, or pest removal",
        "Areas beyond the reach of a 3-step ladder",
        "Light bulbs and fragile fixtures",
        "Garages, patios, and outdoor areas (winter safety)",
      ]}
      faqs={[
        { q: "How much do I save with recurring cleaning?", a: "Recurring clients receive 20% off weekly, 15% off bi-weekly, and 10% off monthly cleanings compared to one-time pricing." },
        { q: "Can I change or skip a scheduled cleaning?", a: "Yes — just give us reasonable notice and we'll reschedule or skip a visit. There's no long-term contract." },
        { q: "Will I have the same cleaner each visit?", a: "We do our best to send the same cleaning team for each visit so they become familiar with your home and preferences. However, in cases such as emergencies, sick days, or scheduled leave, we may send a different trusted team. If you prefer the same cleaners each time and have flexibility with scheduling, we can also adjust your appointment to a day when your regular team is available." },
        { q: "Do I need to be home during the cleaning?", a: "No. Most recurring clients provide a lockbox code, smart-lock access, or leave keys in a safe spot. We'll lock up after we're done." },
        { q: "Do I need to provide cleaning supplies?", a: "No — our team brings all cleaning supplies and equipment, including non-toxic products that are safe for children and pets." },
        { q: "What if I only need a single cleaning?", a: "If you'd prefer a one-time appointment, our standard or deep cleaning service are great fit." },
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
