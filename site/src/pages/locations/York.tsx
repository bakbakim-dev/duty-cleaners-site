import LocationPageTemplate from "@/components/LocationPageTemplate";

export default function York() {
  return (
    <LocationPageTemplate
      city="York"
      region="edmonton"
      title="House Cleaning Services York Edmonton | Duty Cleaners"
      description="York's family homes were built with divided floor plans, and every separate room adds doorways, trim and floor edges, so a York home takes longer to clean than an open-plan one of the same size. The Edmonton branch still cleans it at a flat rate by home size."
      seoDescription="York homes in northeast Edmonton were built with divided floor plans, so they take longer to clean than open-plan homes of the same square footage."
      localNote={{
        heading: "What a York home needs",
        paragraphs: [
          "York is an established northeast neighbourhood of well-kept family homes, and the houses here were built when floor plans were divided rather than open. A home split into more separate rooms takes longer to clean than an open-plan home of the same square footage, because every room adds its own doorway, trim, corners and floor edges.",
          "Older homes also carry more hand-cleaned surface in general — original trim, door frames, window sills and radiator or baseboard heating all need wiping rather than a pass with a vacuum. It is slower work and it is where the visible difference between a standard clean and a deep clean shows up in a house like this.",
          "The 66 Street and Manning Drive corridors put road grit through the area all winter, and because Edmonton holds its cold, that grit arrives dry and works into carpet edges and along baseboards rather than melting away. Rates are set by home size, and there is no trip fee inside city limits.",
        ],
      }}
      phone="(780) 913-6565"
      phoneLink="tel:7809136565"
    />
  );
}
