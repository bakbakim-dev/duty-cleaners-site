import LocationPageTemplate from "@/components/LocationPageTemplate";

export default function Larkspur() {
  return (
    <LocationPageTemplate
      city="Larkspur"
      region="edmonton"
      title="House Cleaning Services Larkspur Edmonton | Duty Cleaners"
      description="Most Larkspur homes went up between 1985 and 2005, so twenty to forty years of wear on builder carpet, vinyl seams and tub caulk sets the pace of the clean, along with grit off Whitemud Drive."
      seoDescription="House cleaning in Larkspur, Edmonton, where homes built from 1985 to 2005 show worn builder finishes and road grit comes in off Whitemud Drive."
      localNote={{
        heading: "What a Larkspur home needs",
        paragraphs: [
          "Most of Larkspur went up between 1985 and 2005, and almost nine in ten of its homes are single-family houses, the rest duplexes. That puts most of them twenty to forty years past possession, an age when the original builder finishes show it: carpet with a worn lane down the hall, vinyl and laminate with dirt packed into the seams, and tub caulk that has started to darken. A standard visit keeps those surfaces where they are. Bringing them back is deep-clean work, so one deep clean before a regular schedule usually costs less than trying to catch up a little on every visit.",
          "Houses of this age have also had decades to load the places nobody looks at: the tops of door frames, closet shelves, vent covers and the ledge above the washer. None of it shows from the doorway, and all of it drops dust back onto clean floors if it is skipped, so the team works from the top down.",
          "The industrial land north across Whitemud Drive and the traffic on 17 Street and 34 Street round it out: fine grit on the sills that face them, and road sand through the winter, concentrated at entryways.",
        ],
      }}
      phone="(780) 913-6565"
      phoneLink="tel:7809136565"
    />
  );
}
