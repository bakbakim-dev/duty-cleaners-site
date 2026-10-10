import LocationPageTemplate from "@/components/LocationPageTemplate";

export default function Laurel() {
  return (
    <LocationPageTemplate
      city="Laurel"
      region="edmonton"
      title="House Cleaning Services Laurel Edmonton | Duty Cleaners"
      description="Most Laurel homes were built from 2011 to 2016, and a decade on, vent covers and doors carry years of dust. That build-up is the main reason a first deep clean is worth more here than a standard one."
      seoDescription="Laurel house cleaning in southeast Edmonton: mud on entry mats in spring and autumn, and grit off the Anthony Henday along baseboards in winter."
      localNote={{
        heading: "What a Laurel home needs",
        paragraphs: [
          "Laurel is one of the newer neighbourhoods in southeast Edmonton: in the 2016 federal census more than four in five of its homes had been built from 2011 to 2016. The builders' drywall dust cleared long ago, but a decade of ordinary living leaves its own layer on vent covers, doors and the tops of door frames. Vent covers and doors are deep-clean items, which is the main reason a first deep clean here is worth more than a standard one.",
          "The wetlands and green space that make the area pleasant also set the seasonal rhythm. Spring thaw and wet autumn weeks put mud and plant matter through entryways and mudrooms, and homes backing onto a green edge get more of it than homes in the middle of a block. Entry mats, the strip of floor just inside the door, and the bottom of stair treads are where it collects, and they are the first things a visitor sees.",
          "Then there is the Anthony Henday. Living close to a ring road means fine road grit riding in on tyres and shoes all winter, and unlike snow it does not melt away — it grinds into floor finish and settles along baseboards. Laurel is priced exactly as any other Edmonton address: set by home size, with no trip fee.",
        ],
      }}
      phone="(780) 913-6565"
      phoneLink="tel:7809136565"
    />
  );
}
