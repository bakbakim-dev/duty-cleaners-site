import LocationPageTemplate from "@/components/LocationPageTemplate";

export default function Northmount() {
  return (
    <LocationPageTemplate
      city="Northmount"
      region="edmonton"
      title="House Cleaning Services Northmount Edmonton | Duty Cleaners"
      description="Northmount's older homes have original trim, deeper window sills, more door frames and divided rooms. All of that detail is wiped by hand, and square footage captures none of it. A heating season that runs from October through April leaves a fine film above registers and along the ceiling line, and wall washing, booked together with a clean, is what lifts that film in a Northmount house."
      seoDescription="House cleaning in Northmount, north Edmonton, where a long heating season leaves a film above registers and along the ceiling line."
      localNote={{
        heading: "What a Northmount home needs",
        paragraphs: [
          "Northmount is one of north Edmonton's older residential pockets, and its homes carry the detail that comes with that age — original trim, deeper window sills, more door frames, and rooms divided rather than opened out. All of it has to be hand-wiped, and none of it is captured by square footage. A home here routinely takes longer than a modern build of identical size.",
          "Age also means a longer heating history. Edmonton's heating season runs effectively unbroken from October through April, and in an older home with an older duct system that steady run deposits a fine, even film above every register, along the ceiling line and behind furniture where nothing disturbs it. Most people only notice when a picture comes off the wall. Wall washing, booked together with a clean, is what lifts that film in a house like this.",
          "The 97 Street and Yellowhead Trail corridors nearby keep road grit moving through the area all winter, and mature tree-lined avenues add pollen in spring and leaf litter in autumn.",
        ],
      }}
      phone="(780) 913-6565"
      phoneLink="tel:7809136565"
    />
  );
}
