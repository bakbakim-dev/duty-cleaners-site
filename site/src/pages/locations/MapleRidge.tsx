import LocationPageTemplate from "@/components/LocationPageTemplate";

export default function MapleRidge() {
  return (
    <LocationPageTemplate
      city="Maple Ridge"
      region="edmonton"
      title="House Cleaning Services Maple Ridge Edmonton | Duty Cleaners"
      description="Professional house cleaning services in Maple Ridge, Edmonton. Serving this established Southeast Edmonton community known for its mature tree-lined streets, spacious family homes, proximity to Mill Woods Town Centre, convenient access to Whitemud Drive and Anthony Henday, excellent local schools, and a quiet, friendly neighbourhood atmosphere."
      seoDescription="House cleaning in Maple Ridge, Edmonton. Flat rates by home size, no trip fee, pay after your clean. Book online in 60 seconds."
      localNote={{
        heading: "What a Maple Ridge home actually needs",
        paragraphs: [
          "Maple Ridge is established, and mature tree-lined streets change the cleaning year in a way new neighbourhoods do not experience. Spring brings pollen and seed fall, autumn brings leaf litter, and both get walked in and tracked through the main floor for weeks at a stretch. Homes with a big canopy overhead also get more organic debris in window tracks and door channels than a newer street does — it is fine, dark, and easy to mistake for general dirt until it is cleared out properly.",
          "The homes here are older and more generously sized than a modern build of the same footprint, which usually means more separate rooms rather than one open plan. That matters for pricing: a home divided into more rooms takes longer than an open-plan home of the same square footage, and it is worth describing the layout when you book rather than only the bedroom count.",
          "Whitemud Drive and the Anthony Henday bracket the area, so winter road grit is a constant from November through April, and Mill Woods Town Centre keeps a steady flow through the neighbourhood.",
        ],
      }}
      phone="(780) 913-6565"
      phoneLink="tel:7809136565"
    />
  );
}
