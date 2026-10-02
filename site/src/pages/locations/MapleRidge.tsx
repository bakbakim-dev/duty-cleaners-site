import LocationPageTemplate from "@/components/LocationPageTemplate";

// Local note rewritten 2026-10-02: the old note described older, larger homes on
// mature tree-lined streets bracketed by Whitemud Drive and the Henday. Maple Ridge
// is a manufactured-home community (every home), mostly placed in the 1970s, on the
// east side of 17 Street NW at 66 Avenue NW and surrounded by industrial land
// (Wikipedia "Maple Ridge, Edmonton"; City of Edmonton neighbourhood profile).
export default function MapleRidge() {
  return (
    <LocationPageTemplate
      city="Maple Ridge"
      region="edmonton"
      title="House Cleaning Services Maple Ridge Edmonton | Duty Cleaners"
      description="Maple Ridge is a manufactured-home community off 17 Street in southeast Edmonton, with industrial land on every side, so dust and grit from the surrounding yards and roads find their way in all year."
      seoDescription="House cleaning in Maple Ridge, Edmonton: manufactured homes off 17 Street, priced by bedrooms and bathrooms."
      localNote={{
        heading: "What a Maple Ridge home needs",
        paragraphs: [
          "Every home in Maple Ridge is a manufactured home, most of them placed here in the 1970s. Book by the bedrooms and bathrooms the home has, and mention any addition or enclosed porch, so the quote covers every room the team will clean.",
          "The community sits on the east side of 17 Street NW at 66 Avenue, with industrial parks around it. Fine dust from the surrounding yards and roads settles on window sills and tracks, door channels and the floor just inside the entry, and it builds up faster than in a neighbourhood with only houses around it.",
          "In winter that grit is joined by road sand and salt from 17 Street, so the entry, the floor around it and the door tracks need the most attention from November through April.",
        ],
      }}
      phone="(780) 913-6565"
      phoneLink="tel:7809136565"
    />
  );
}
