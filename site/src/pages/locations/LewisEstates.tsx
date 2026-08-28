import LocationPageTemplate from "@/components/LocationPageTemplate";

export default function LewisEstates() {
  return (
    <>
      <LocationPageTemplate
        city="Lewis Estates"
        region="edmonton"
        title="House Cleaning in Lewis Estates, Edmonton | Duty Cleaners"
        description="Professional cleaning for one of Edmonton's most welcoming family neighbourhoods. From stunning trail-side homes to busy households near West Edmonton Mall — enjoy a spotless home without the hassle."
      seoDescription="House cleaning in Lewis Estates, Edmonton. Flat rates by home size, no trip fee, pay after your clean. Book online in 60 seconds."
      localNote={{
        heading: "What a Lewis Estates home actually needs",
        paragraphs: [
          "Lewis Estates sits in Edmonton's west end with trail access running through it, and homes backing onto a trail or green edge get a different load from homes mid-block. Mud and wet plant matter in spring and autumn, dust off dry paths in summer, and all of it concentrated at the back door rather than the front — which is exactly the entrance most households actually use and the one most likely to be skipped in a rushed clean. Back entries, mudrooms and the first stretch of floor inside them get specific attention here.",
          "Households near West Edmonton Mall tend to be busy ones, and the practical questions come up more often than the cleaning ones. You do not need to be home — most customers here leave a key, a lockbox code or smart-lock access and we lock up when we finish — and we schedule to an arrival window rather than a fixed time so an earlier job running long does not take your whole day.",
          "West-end homes of this era tend toward larger footprints with more bathrooms than an older inner-city house, and bathrooms are the slowest rooms per square metre in any home. That is worth flagging when you book. Flat rates by home size, no trip fee, quoted before you book.",
        ],
      }}
        phone="780-913-6565"
        phoneLink="tel:7809136565"
      />
    </>
  );
}
