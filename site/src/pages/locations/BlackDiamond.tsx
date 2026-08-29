import LocationPageTemplate from "@/components/LocationPageTemplate";

export default function BlackDiamond() {
  return (
    <LocationPageTemplate
      city="Black Diamond"
      region="calgary"
      title="House Cleaning Services Black Diamond | Duty Cleaners"
      description="Professional cleaners serving Black Diamond. Flat rates by home size, vetted and customer-rated pros, pay after your clean."
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
