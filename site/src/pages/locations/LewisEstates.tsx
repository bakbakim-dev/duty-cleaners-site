import LocationPageTemplate from "@/components/LocationPageTemplate";

export default function LewisEstates() {
  return (
    <>
      <LocationPageTemplate
        city="Lewis Estates"
        region="edmonton"
        title="House Cleaning in Lewis Estates, Edmonton | Duty Cleaners"
        description="Lewis Estates homes that back onto a trail or green edge collect mud and path dust at the back door, so back entries, mudrooms and the floor just inside them get specific attention. West-end homes here tend to have more bathrooms than an older inner-city house, and bathrooms are the slowest rooms per square metre, so mention the count when you book."
      seoDescription="Where Lewis Estates homes in west Edmonton back onto a trail, mud and path dust come in by the back door, and back entries get specific attention."
      localNote={{
        heading: "What a Lewis Estates home needs",
        paragraphs: [
          "Lewis Estates sits in Edmonton's west end with trail access running through it, and homes backing onto a trail or green edge get a different load from homes mid-block. That load is mud and wet plant matter in spring and autumn and dust off dry paths in summer, all of it concentrated at the back door rather than the front — which is exactly the entrance most households use and the one most likely to be skipped in a rushed clean. Back entries, mudrooms and the first stretch of floor inside them get specific attention here.",
          "You do not need to be home: most customers leave a key, a lockbox code or smart-lock access, and we lock up when we finish. We schedule to an arrival window rather than a fixed time, so an earlier job running long does not take your whole day.",
          "West-end homes here tend toward larger footprints with more bathrooms than an older inner-city house, and bathrooms are the slowest rooms per square metre in any home. That is worth flagging when you book.",
        ],
      }}
        phone="(780) 913-6565"
        phoneLink="tel:7809136565"
      />
    </>
  );
}
