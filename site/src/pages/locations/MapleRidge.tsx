import LocationPageTemplate from "@/components/LocationPageTemplate";

export default function MapleRidge() {
  return (
    <LocationPageTemplate
      city="Maple Ridge"
      region="edmonton"
      title="House Cleaning Services Maple Ridge Edmonton | Duty Cleaners"
      description="Maple Ridge homes are older and more generously sized, with more separate rooms than an open-plan build, and winter road grit off Whitemud Drive and the Anthony Henday is constant from November through April."
      seoDescription="House cleaning in Maple Ridge, Edmonton, where older, larger homes have more separate rooms and winter grit comes off Whitemud Drive."
      localNote={{
        heading: "What a Maple Ridge home needs",
        paragraphs: [
          "The homes here are older and more generously sized than a modern build of the same footprint, which usually means more separate rooms rather than one open plan. That matters for the booking: a home divided into more rooms takes longer than an open-plan home of the same square footage, so describe the layout when you book rather than only the bedroom count.",
          "Maple Ridge is established, and mature tree-lined streets change the cleaning year in a way new neighbourhoods do not experience. Spring brings pollen and seed fall, autumn brings leaf litter, and both get walked in and tracked through the main floor for weeks at a stretch. Homes with a big canopy overhead also get more organic debris in window tracks and door channels than a newer street does — it is fine, dark, and easy to mistake for general dirt until it is cleared out properly.",
          "Whitemud Drive and the Anthony Henday bracket the area, so winter road grit is a constant from November through April.",
        ],
      }}
      phone="(780) 913-6565"
      phoneLink="tel:7809136565"
    />
  );
}
