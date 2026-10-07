import LocationPageTemplate from "@/components/LocationPageTemplate";

export default function Rosslyn() {
  return (
    <LocationPageTemplate
      city="Rosslyn"
      region="edmonton"
      title="House Cleaning Services in Rosslyn, Edmonton | Duty Cleaners"
      description="Rosslyn is mostly owner-occupied houses built between 1946 and 1970, so a first visit here is often a deep clean that catches up baseboards, door frames and vent covers before a regular schedule. Its older houses have divided floor plans, with trim and window sills that take longer to clean than square footage suggests."
      seoDescription="Rosslyn in north Edmonton is mostly owner-occupied post-war houses, so a first clean here is often a deep one that catches up trim, doors and vents."
      localNote={{
        heading: "What a Rosslyn home needs",
        paragraphs: [
          "Rosslyn is a settled neighbourhood: about three in four homes are lived in by their owners, and most are single-family houses built between 1946 and 1970. A home that one household has lived in for years usually needs a thorough first visit, so the first clean here is often a deep one, with baseboards, doors, light switches and vent covers on top of the standard rooms, and then a regular schedule to hold it. If you are selling or moving out instead, move-out cleaning is its own service, priced against what a buyer or landlord checks: inside the oven, fridge, cabinets and drawers.",
          "The houses themselves are from an older era of north Edmonton, with divided floor plans and the trim, door frames and window sills that go with them. All of that is hand-wiped work that square footage does not predict, so a Rosslyn home often takes longer than a newer build of the same size.",
          "The 97 Street and 137 Avenue corridors on its east and north edges put road grit through the neighbourhood all winter, arriving dry because the cold here holds rather than thawing, and the mature trees on its post-war streets add pollen and leaf fall in their seasons.",
        ],
      }}
      phone="(780) 913-6565"
      phoneLink="tel:7809136565"
    />
  );
}
