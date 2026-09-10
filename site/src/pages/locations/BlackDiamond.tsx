import LocationPageTemplate from "@/components/LocationPageTemplate";

export default function BlackDiamond() {
  return (
    <LocationPageTemplate
      city="Black Diamond"
      region="calgary"
      title="House Cleaning Services Black Diamond | Duty Cleaners"
      description="Dust off the surrounding gravel roads is a steady cleaning job in Black Diamond homes: it films window ledges and dulls hard floors all summer. The team damp-wipes sills and door tops, because dry cloths only move it, and gives mudrooms their own pass."
      seoDescription="Black Diamond house cleaning from the Calgary branch: gravel-road dust and chinook grit damp-wiped off sills and door tops."
      localNote={{
        heading: "Fourteen hundred kilometres of gravel",
        paragraphs: [
          "Highway 7 ends here at Highway 22, the Cowboy Trail. Ranch country starts where the last street does. Foothills County maintains roughly 1,400 kilometres of gravel road against about 850 kilometres of paved or oiled surface, so gravel is what most of the surrounding country drives on. Here, road dust off the gravel films window ledges, dulls hard floors, and arrives on boots and pet paws all summer.",
          "The townsite sits about 1,160 metres up in foothills ranch country, and since January 2023 it has been half of the Town of Diamond Valley, with Turner Valley the other half. Chinooks run through all winter, and each thaw turns a week's dry dust into wet grit on the same boots. Dry cloths only move it, so we damp-wipe sills and door tops, and we give mudrooms their own pass.",
        ],
      }}
      phone="(403) 768-1341"
      phoneLink="tel:4037681341"
      isOwnMunicipality
    />
  );
}
