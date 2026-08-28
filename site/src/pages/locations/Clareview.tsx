import LocationPageTemplate from "@/components/LocationPageTemplate";

export default function Clareview() {
  return (
    <LocationPageTemplate
      city="Clareview"
      region="edmonton"
      title="House Cleaning Services Clareview Edmonton | Duty Cleaners"
      description="Professional house cleaning services in Clareview, Edmonton. Serving this vibrant Northeast Edmonton community centered around Clareview Town Centre and the LRT transit hub, with convenient shopping, beautiful trail systems, family-friendly parks, and a welcoming mix of established homes and modern developments."
      seoDescription="House cleaning in Clareview, Edmonton. Flat rates by home size, no trip fee, pay after your clean. Book online in 60 seconds."
      localNote={{
        heading: "What a Clareview home actually needs",
        paragraphs: [
          "Clareview is built around an LRT terminus, and that shapes both the housing and the cleaning. A transit hub means more foot traffic across the neighbourhood and, for homes near the station and the park-and-ride, more of the street coming in on shoes — road grit, salt and sand in winter, wet grime through the shoulder seasons. Entryways here take more punishment than they do in a quiet cul-de-sac, and they are the part of a home a guest judges first.",
          "The housing stock is genuinely mixed, which is unusual and useful to know when booking. Established homes here have older layouts with more separate rooms and more trim and door frames to hand-wipe than their square footage suggests; the newer developments alongside them are open-plan and quicker per square metre, but may still be shedding construction dust from vents and closet shelves. The same bedroom count can be two quite different jobs, so describe the home rather than only its size.",
          "Transit access also makes this an area with more rental turnover than average, and move-in and move-out cleaning is a distinct service priced against what landlords actually inspect — inside appliances, inside every cabinet and drawer, and the storage spaces. Flat rates by home size, no trip fee, quoted before you book.",
        ],
      }}
      phone="780-913-6565"
      phoneLink="tel:7809136565"
    />
  );
}
