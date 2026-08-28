import LocationPageTemplate from "@/components/LocationPageTemplate";

export default function Larkspur() {
  return (
    <LocationPageTemplate
      city="Larkspur"
      region="edmonton"
      title="House Cleaning Services Larkspur Edmonton | Duty Cleaners"
      description="Professional house cleaning services in Larkspur, Edmonton. Serving this beautiful Southeast Edmonton community known for its brand-new family homes, scenic wetlands, proximity to Anthony Henday Drive and Ellerslie Road, excellent nearby schools, and a vibrant, growing neighbourhood atmosphere."
      seoDescription="House cleaning in Larkspur, Edmonton. Flat rates by home size, no trip fee, pay after your clean. Book online in 60 seconds."
      localNote={{
        heading: "What a Larkspur home actually needs",
        paragraphs: [
          "Larkspur is still filling in, and that changes the job in a way finished neighbourhoods do not have to think about. When lots on your street are actively under construction, dust does not stay on the site — it travels, and it arrives at your door on the wind and on everyone's shoes. Homes here often get cleaned and then look dusty again within days, which is frustrating and is nobody's fault. If your street is still building out, cleaning slightly more often through the dry months usually costs less than repeatedly booking a deep clean to catch up.",
          "The homes themselves are new enough that they are still shedding their own construction dust from vents, closet shelves and the tops of doors. That comes out over roughly the first year or two, and it is worth a single thorough deep clean early rather than fighting it with standard visits.",
          "The wetlands nearby and the Ellerslie Road and Anthony Henday corridors round it out: wet plant matter and mud in spring and autumn, road grit through the winter, both concentrated at entryways. Larkspur prices the same as any Edmonton address — flat by home size, no trip fee, quoted before you book.",
        ],
      }}
      phone="780-913-6565"
      phoneLink="tel:7809136565"
    />
  );
}
