import LocationPageTemplate from "@/components/LocationPageTemplate";

export default function Laurel() {
  return (
    <LocationPageTemplate
      city="Laurel"
      region="edmonton"
      title="House Cleaning Services Laurel Edmonton | Duty Cleaners"
      description="Professional house cleaning services in Laurel, Edmonton. Serving this beautiful Southeast Edmonton community known for its modern family homes, scenic wetlands and green spaces, proximity to Anthony Henday Drive, excellent schools, and a vibrant, growing neighbourhood atmosphere."
      seoDescription="House cleaning in Laurel, Edmonton. Flat rates by home size, no trip fee, pay after your clean. Book online in 60 seconds."
      localNote={{
        heading: "What a Laurel home actually needs",
        paragraphs: [
          "Laurel is one of the newer builds in southeast Edmonton, and new builds have a cleaning problem that established neighbourhoods do not: the dust never seems to finish. Drywall and sanding dust works its way out of vents, closet shelves and the tops of door frames for a year or two after possession, and it keeps reappearing after the first few cleans. If your home is recent, that is not a sign the last clean was rushed — it is the house still emptying itself, and it is the main reason a first deep clean here is worth more than a standard one.",
          "The wetlands and green space that make the area pleasant also set the seasonal rhythm. Spring thaw and wet autumn weeks put mud and plant matter through entryways and mudrooms, and homes backing onto a green edge get more of it than homes in the middle of a block. Entry mats, the strip of floor just inside the door, and the bottom of stair treads are where it collects, and they are the first things a visitor sees.",
          "Then there is the Anthony Henday. Living close to a ring road means fine road grit riding in on tyres and shoes all winter, and unlike snow it does not melt away — it grinds into floor finish and settles along baseboards. We work Laurel regularly and price it exactly as any other Edmonton address: flat by home size, no trip fee, and the figure you see before booking is the figure you pay.",
        ],
      }}
      phone="780-913-6565"
      phoneLink="tel:7809136565"
    />
  );
}
