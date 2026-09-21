import { describe, expect, it } from "vitest";
import { commercialCityForLocation, commercialWalkthroughHref, specialistCtaForLocation } from "./commercial-context";

describe("commercial CTA context", () => {
  it("recognizes both canonical commercial routes", () => {
    expect(commercialCityForLocation("/commercial-cleaning/")).toBe("edmonton");
    expect(commercialCityForLocation("/commercial-cleaning-services-calgary/")).toBe("calgary");
  });

  it("preserves office intent on the contact page", () => {
    expect(commercialCityForLocation("/contact-us/", "", "#topic=office&city=calgary")).toBe("calgary");
    expect(commercialCityForLocation("/contact-us/", "", "#topic=airbnb&city=calgary")).toBeNull();
  });

  it("builds a crawler-clean fragment URL", () => {
    expect(commercialWalkthroughHref("edmonton")).toBe("/contact-us/#topic=office&city=edmonton");
  });

  it("keeps Airbnb turnover routes out of residential instant pricing", () => {
    expect(specialistCtaForLocation("/edmonton/airbnb-cleaning/")).toMatchObject({
      kind: "airbnb",
      city: "edmonton",
      label: "Request a Turnover Quote",
      href: "/contact-us/#topic=airbnb&city=edmonton",
    });
    expect(specialistCtaForLocation("/airbnb-cleaning-services-calgary/")).toMatchObject({
      kind: "airbnb",
      city: "calgary",
    });
  });

  it("keeps military march-out routes on their callback journey", () => {
    expect(specialistCtaForLocation("/edmonton/march-out-cleaning/")).toMatchObject({
      kind: "march-out",
      city: "edmonton",
      label: "Request a March-Out Quote",
      href: "/contact-us/#topic=march-out&city=edmonton",
    });
  });
});
