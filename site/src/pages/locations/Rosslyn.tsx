import LocationPageTemplate from "@/components/LocationPageTemplate";

export default function Rosslyn() {
  return (
    <LocationPageTemplate
      city="Rosslyn"
      region="edmonton"
      title="House Cleaning Services in Rosslyn, Edmonton | Duty Cleaners"
      description="Rosslyn sees more rental turnover than a comparable suburban neighbourhood, so more of the work here is move-out cleaning: inside the oven, fridge, cabinets and drawers, which is what landlords inspect. Its older houses have divided floor plans, with trim and window sills that take longer to clean than square footage suggests."
      seoDescription="Rosslyn in north Edmonton sees more rental turnover than a comparable suburb, so more of its cleans are move-outs with the oven and fridge done inside."
      localNote={{
        heading: "What a Rosslyn home needs",
        paragraphs: [
          "Rosslyn sits close to NAIT and Kingsway, and proximity to a large campus changes the mix of work we do here. There is more rental turnover than in a comparable suburban neighbourhood, which means more move-in and move-out cleaning — a distinct service rather than a bigger deep clean, priced against what landlords and property managers inspect: inside the oven, fridge and microwave, inside every cabinet and drawer, and the storage spaces. If you are working to a walk-through date, that is the one to book.",
          "The houses themselves are from an older era of north Edmonton, with divided floor plans and the trim, door frames and window sills that go with them. All of that is hand-wiped work that square footage does not predict, so a Rosslyn home often takes longer than a newer build of the same size.",
          "The 97 Street and Yellowhead Trail corridors put road grit through the neighbourhood all winter, arriving dry because the cold here holds rather than thawing, and Rosslyn Park and the mature streets add pollen and leaf fall in their seasons.",
        ],
      }}
      phone="(780) 913-6565"
      phoneLink="tel:7809136565"
    />
  );
}
