import LocationPageTemplate from "@/components/LocationPageTemplate";

export default function Northmount() {
  return (
    <LocationPageTemplate
      city="Northmount"
      region="edmonton"
      title="House Cleaning Services Northmount Edmonton | Duty Cleaners"
      description="Professional house cleaning services in Northmount, Edmonton. Serving this established North Edmonton community known for its quiet residential streets, mature tree-lined avenues, proximity to Northgate Centre and Northlands, convenient access to 97 Street and Yellowhead Trail, beautiful local parks, and a welcoming, family-oriented neighbourhood atmosphere."
      seoDescription="House cleaning in Northmount, Edmonton. Flat rates by home size, no trip fee, pay after your clean. Book online in 60 seconds."
      localNote={{
        heading: "What a Northmount home actually needs",
        paragraphs: [
          "Northmount is one of north Edmonton's older residential pockets, and its homes carry the detail that comes with that age — original trim, deeper window sills, more door frames, and rooms divided rather than opened out. All of it has to be hand-wiped, and none of it is captured by square footage. A home here routinely takes longer than a modern build of identical size, which is why describing the layout at booking gives you a more accurate quote than bedroom count alone.",
          "Age also means a longer heating history. Edmonton's heating season runs effectively unbroken from October through April, and in an older home with an older duct system that steady run deposits a fine, even film above every register, along the ceiling line and behind furniture where nothing disturbs it. Most people only notice when a picture comes off the wall. That film is what separates a deep clean from a standard one in a house like this.",
          "The 97 Street and Yellowhead Trail corridors nearby keep road grit moving through the area all winter, and mature tree-lined avenues add pollen in spring and leaf litter in autumn. Flat rates by home size, no trip fee, quoted before you book.",
        ],
      }}
      phone="780-913-6565"
      phoneLink="tel:7809136565"
    />
  );
}
