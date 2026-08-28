import LocationPageTemplate from "@/components/LocationPageTemplate";

export default function EauxClaires() {
  return (
    <LocationPageTemplate
      city="Eaux Claires"
      region="edmonton"
      title="House Cleaning Eaux Claires Edmonton | Duty Cleaners"
      description="Professional house cleaning services in Eaux Claires, Edmonton. Serving this well-established North Edmonton community known for its family-friendly atmosphere, beautiful Castle Downs Park, proximity to Castle Downs YMCA, convenient access to 97 Street and Anthony Henday Drive, excellent local schools, shopping at Castle Downs Town Centre, and a welcoming neighbourhood with mature tree-lined streets."
      seoDescription="House cleaning in Eaux Claires, Edmonton. Flat rates by home size, no trip fee, pay after your clean. Book online in 60 seconds."
      localNote={{
        heading: "What an Eaux Claires home actually needs",
        paragraphs: [
          "Eaux Claires sits where north Edmonton's retail and its residential streets meet, with 97 Street and the Anthony Henday on either side. Living close to major arterials and a busy shopping district means a steady supply of road grit and fine traffic dust arriving on tyres and shoes, and in winter it comes with salt and sand. Because Edmonton holds its cold rather than cycling through thaws, that material arrives dry and stays — working into carpet edges, along baseboards and down the sides of stair treads instead of washing off.",
          "The neighbourhood is well established and its streets are lined with mature trees, which adds a seasonal layer: pollen and seed fall in spring, leaf litter through autumn, both tracked across the main floor for weeks and packed into window tracks and door channels.",
          "The homes match their era — more separate rooms than a modern open-plan build, and more trim, door frames and sills to hand-wipe than the square footage suggests. It is worth describing the layout when you book, not just the bedroom count. Flat rates by home size, no trip fee, and your quote does not change because a clean ran long.",
        ],
      }}
      phone="780-913-6565"
      phoneLink="tel:7809136565"
    />
  );
}
