import LocationPageTemplate from "@/components/LocationPageTemplate";

export default function EauxClaires() {
  return (
    <LocationPageTemplate
      city="Eaux Claires"
      region="edmonton"
      title="House Cleaning Eaux Claires Edmonton | Duty Cleaners"
      description="Most Eaux Claires homes date from the late 1990s and 2000s: detached and semi-detached houses and walk-up condos, so tell us the home type as well as the bedroom count when you book. Pollen and leaf litter from the street trees pack into window tracks and door channels."
      seoDescription="Because Edmonton holds its cold, salt and sand tracked into Eaux Claires homes stay dry and work into carpet edges and the sides of stair treads."
      localNote={{
        heading: "What an Eaux Claires home needs",
        paragraphs: [
          "Eaux Claires sits where north Edmonton's retail and its residential streets meet, with 97 Street and the Anthony Henday on either side. Living close to major arterials and a busy shopping district means a steady supply of road grit and fine traffic dust arriving on tires and shoes, and in winter it comes with salt and sand. Because Edmonton holds its cold rather than cycling through thaws, that material arrives dry and stays — working into carpet edges, along baseboards and down the sides of stair treads instead of washing off.",
          "Its streets are lined with growing trees, which adds a seasonal layer: pollen and seed fall in spring, leaf litter through autumn, both tracked across the main floor for weeks and packed into window tracks and door channels.",
          "Most of the neighbourhood was built in the late 1990s and early 2000s, as detached and semi-detached houses and walk-up condos. A walk-up suite and a two-storey house with the same bedroom count are different visits, so tell us the home type when you book.",
        ],
      }}
      phone="(780) 913-6565"
      phoneLink="tel:7809136565"
    />
  );
}
