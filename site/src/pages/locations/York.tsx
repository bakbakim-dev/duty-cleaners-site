import LocationPageTemplate from "@/components/LocationPageTemplate";

export default function York() {
  return (
    <LocationPageTemplate
      city="York"
      region="edmonton"
      title="House Cleaning Services York Edmonton | Duty Cleaners"
      description="Professional house cleaning services in York, Edmonton. Serving this established northeast Edmonton community known for its quiet residential streets, well-maintained family homes, proximity to Clareview Recreation Centre and Londonderry Mall, convenient access to 66 Street and Manning Drive, excellent local schools, and a welcoming, tight-knit neighbourhood atmosphere."
      seoDescription="House cleaning in York, Edmonton. Flat rates by home size, no trip fee, pay after your clean. Book online in 60 seconds."
      localNote={{
        heading: "What a York home actually needs",
        paragraphs: [
          "York is an established northeast neighbourhood of well-kept family homes, and the houses here were built when floor plans were divided rather than open. That is the single thing most likely to make a quote surprise someone: a home split into more separate rooms takes longer to clean than an open-plan home of the same square footage, because every room adds its own doorway, trim, corners and floor edges. When you book, telling us the layout matters as much as telling us the bedroom count.",
          "Older homes also carry more hand-cleaned surface in general — original trim, door frames, window sills and radiator or baseboard heating all need wiping rather than a pass with a vacuum. It is slower work and it is where the visible difference between a standard clean and a deep clean actually shows up in a house like this.",
          "The 66 Street and Manning Drive corridors put road grit through the area all winter, and because Edmonton holds its cold, that grit arrives dry and works into carpet edges and along baseboards rather than melting away. Flat rates by home size, no trip fee, and the figure you see before booking is the figure you pay.",
        ],
      }}
      phone="780-913-6565"
      phoneLink="tel:7809136565"
    />
  );
}
