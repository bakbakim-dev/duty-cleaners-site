import LocationPageTemplate from "@/components/LocationPageTemplate";

export default function Tamarack() {
  return (
    <LocationPageTemplate
      city="Tamarack"
      region="edmonton"
      title="House Cleaning Services Tamarack Edmonton | Duty Cleaners"
      description="By the 2016 census almost all of Tamarack's homes had been built since 2006, and dust now settles on vent covers and the tops of door frames above eye level. You do not need to be home: most customers leave a code or a key, and the team locks up when it finishes."
      seoDescription="You do not need to be home for a cleaning in Tamarack, Edmonton: most customers leave a code or a key, and the team locks up when it finishes."
      localNote={{
        heading: "What a Tamarack home needs",
        paragraphs: [
          "Tamarack is a young, family-heavy pocket of southeast Edmonton, and the households we clean here tend to have the same shape: more people through the door, more traffic across the main floor, and less patience for a cleaner who needs the house empty. You do not need to be home for us: most of our customers leave a code or a key and we lock up when we finish. We also schedule to an arrival window rather than an exact time, so one long job earlier in the day does not eat your afternoon.",
          "By the 2016 federal census almost all of Tamarack's homes had been built since 2006, so the builder's construction dust is long gone. What a home of that age gathers instead is a slow layer on the surfaces above eye level, vent covers and the tops of door frames, and that layer is a common reason a home here looks dusty a week after a clean.",
          "The parks and wetlands are the other half of it. Green space at the end of the street is good for a family and hard on a floor: mud and plant matter in spring and autumn, road grit off the Anthony Henday all winter, and both of them concentrate in the entry and the first metre of floor.",
        ],
      }}
      phone="(780) 913-6565"
      phoneLink="tel:7809136565"
    />
  );
}
