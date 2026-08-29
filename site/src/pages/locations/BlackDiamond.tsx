import LocationPageTemplate from "@/components/LocationPageTemplate";

export default function BlackDiamond() {
  return (
    <LocationPageTemplate
      city="Black Diamond"
      region="calgary"
      title="House Cleaning Services Black Diamond | Duty Cleaners"
      description="Professional cleaners serving Black Diamond. Flat rates by home size, vetted and customer-rated pros, pay after your clean."
      localNote={{
        heading: "Where Highway 7 ends",
        paragraphs: [
          "Highway 7 ends here, at Highway 22 — the Cowboy Trail — and ranch country starts where the last street does. Foothills County maintains roughly 1,400 kilometres of gravel road against about 850 kilometres of paved or oiled surface, so gravel is what most of the surrounding country drives on. That fine pale dust is the single biggest thing we clean here: it films window ledges, dulls hard floors, and arrives on boots and pet paws all summer.",
          "The townsite sits about 1,160 metres up in foothills ranch country, and since January 2023 it has been half of the Town of Diamond Valley, with Turner Valley the other half. Chinooks run through all winter, and each thaw turns a week's dry dust into wet grit on the same boots. Dry cloths only move it, so we damp-wipe sills, blinds and door tops, and we give mudrooms their own pass.",
        ],
      }}
      phone="(403) 768-1341"
      phoneLink="tel:4037681341"
      isOwnMunicipality
      thingsToDo={[
        "Located in the beautiful foothills of Alberta, Black Diamond is a charming community southwest of Calgary, known for its vibrant arts scene and rich history. Since 2023 it has formed part of the Town of Diamond Valley alongside neighbouring Turner Valley, and it keeps the warm, small-town atmosphere that drew people here in the first place, surrounded by stunning natural landscapes.",
        "Kick off your day with a hike or bike ride along the Diamond Valley Trail, offering breathtaking views and a peaceful outdoor experience. Art enthusiasts will enjoy a visit to the Bluerock Gallery, showcasing local and regional artists' works. For a deeper dive into the town's history, the Oilfields Museum offers fascinating exhibits on the area's coal mining and oil history.",
        "If you enjoy local markets, the Black Diamond Farmers' Market is the perfect place to find fresh produce and handmade goods. When it's time to relax, head to Westwood, a popular spot for farm-to-table dining with a cozy ambiance.",
      ]}
    />
  );
}
