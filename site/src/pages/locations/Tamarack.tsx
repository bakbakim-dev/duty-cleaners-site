import LocationPageTemplate from "@/components/LocationPageTemplate";

export default function Tamarack() {
  return (
    <LocationPageTemplate
      city="Tamarack"
      region="edmonton"
      title="House Cleaning Services Tamarack Edmonton | Duty Cleaners"
      description="Professional house cleaning services in Tamarack, Edmonton. Serving this growing Southeast Edmonton community known for its modern family homes, scenic wetlands, beautiful parks like Tamarack Park and Maple Crest Park, convenient access to Anthony Henday Drive, and a welcoming neighbourhood atmosphere."
      seoDescription="House cleaning in Tamarack, Edmonton. Flat rates by home size, no trip fee, pay after your clean. Book online in 60 seconds."
      localNote={{
        heading: "What a Tamarack home actually needs",
        paragraphs: [
          "Tamarack is a young, family-heavy pocket of southeast Edmonton, and the households we clean here tend to have the same shape: more people through the door, more traffic across the main floor, and less patience for a cleaner who needs the house empty. You do not need to be home for us — most Tamarack customers leave a code or a key and we lock up when we finish — and we schedule to an arrival window rather than an exact time so one long job earlier in the day does not eat your afternoon.",
          "The housing is new enough that construction dust is still working its way out of vents, closet shelves and the tops of door frames. That process runs for a year or two after possession and is the single most common reason a newer home here looks dusty a week after a clean.",
          "The parks and wetlands are the other half of it. Green space at the end of the street is good for a family and hard on a floor: mud and plant matter in spring and autumn, road grit off the Anthony Henday all winter, and both of them concentrate in the entry and the first metre of floor.",
        ],
      }}
      phone="(780) 913-6565"
      phoneLink="tel:7809136565"
    />
  );
}
