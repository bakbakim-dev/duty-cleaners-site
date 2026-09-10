import LocationPageTemplate from "@/components/LocationPageTemplate";

export default function Clareview() {
  return (
    <LocationPageTemplate
      city="Clareview"
      region="edmonton"
      title="House Cleaning Services Clareview Edmonton | Duty Cleaners"
      description="Clareview mixes established homes, which have more separate rooms and trim to hand-wipe than their square footage suggests, with newer open-plan builds that may still be shedding construction dust from vents. The same bedroom count can be two quite different jobs here, so describe the home when you book."
      seoDescription="In Clareview, Edmonton, an established home and a newer open-plan build with the same bedroom count can be two quite different house cleaning jobs."
      localNote={{
        heading: "What a Clareview home needs",
        paragraphs: [
          "Clareview is built around an LRT terminus, and that shapes both the housing and the cleaning. A transit hub means more foot traffic across the neighbourhood and, for homes near the station and the park-and-ride, more of the street coming in on shoes — road grit, salt and sand in winter, wet grime through the shoulder seasons. Entryways here take more punishment than they do in a quiet cul-de-sac, and they are the part of a home a guest judges first.",
          "The housing stock is mixed, which is unusual and useful to know when booking. Established homes here have older layouts with more separate rooms and more trim and door frames to hand-wipe than their square footage suggests; the newer developments alongside them are open-plan and quicker per square metre, but may still be shedding construction dust from vents and closet shelves. The same bedroom count can be two quite different jobs, so describe the home rather than only its size.",
          "For a Clareview home changing hands, move-in and move-out cleaning is priced flat by home size and covers inside the oven, fridge and microwave, and inside every cabinet, drawer and closet.",
        ],
      }}
      phone="(780) 913-6565"
      phoneLink="tel:7809136565"
    />
  );
}
