import { describe, expect, it } from "vitest";
import { areaPhrase, areaPresetFor, initialAreaFor, limitsCity } from "@/lib/service-area";
import { edmontonSurrounding, calgarySurrounding } from "@/data/city-locations";

describe("where is the home: page presets", () => {
  it("a satellite-town page is outside its branch city and names the town", () => {
    expect(areaPresetFor("/cleaning-services-leduc/")).toEqual({ branch: "edmonton", outside: true, place: "Leduc" });
    expect(areaPresetFor("/cleaning-services-airdrie/")).toEqual({ branch: "calgary", outside: true, place: "Airdrie" });
    expect(areaPresetFor("/locations/okotoks/")).toEqual({ branch: "calgary", outside: true, place: "Okotoks" });
    for (const town of [...edmontonSurrounding, ...calgarySurrounding]) {
      expect(areaPresetFor(`${town.to}/`)?.outside, town.name).toBe(true);
    }
  });

  it("Turner Valley's page is labelled Diamond Valley", () => {
    expect(areaPresetFor("/locations/turner-valley/")).toEqual({ branch: "calgary", outside: true, place: "Diamond Valley" });
  });

  it("a neighbourhood page is inside its city", () => {
    expect(areaPresetFor("/locations/terwillegar/")).toEqual({ branch: "edmonton", outside: false, place: "Terwillegar" });
    expect(areaPresetFor("/locations/tuscany/")?.branch).toBe("calgary");
    expect(areaPresetFor("/locations/tuscany/")?.outside).toBe(false);
  });

  it("a hub or service page names its branch but leaves city limits to the price step", () => {
    expect(initialAreaFor("/cleaning-services-calgary/")).toEqual({ branch: "calgary", outside: null });
    expect(initialAreaFor("/pricing/")).toEqual({ branch: "edmonton", outside: null });
    expect(initialAreaFor("/cleaning-services-red-deer/")).toEqual({ branch: "reddeer", outside: null });
    expect(initialAreaFor("/move-out-cleaning-calgary/")).toEqual({ branch: "calgary", outside: null });
  });

  it("the homepage and branch-less pages are general: no city named, Edmonton or Calgary asked", () => {
    for (const path of ["/", "/faqs/", "/contact-us/", "/blog/some-post/"]) {
      const area = initialAreaFor(path);
      expect(area.general, path).toBe(true);
      expect(area.outside, path).toBeNull();
      // Owner, 2026-09-22: Red Deer is left out of the general question for now.
      expect(limitsCity(area, "or"), path).toBe("Edmonton or Calgary");
      expect(limitsCity(area, "and"), path).toBe("Edmonton and Calgary");
    }
    for (const path of ["/cleaning-services-calgary/", "/pricing/", "/cleaning-services-leduc/", "/cleaning-services-red-deer/"]) {
      expect(initialAreaFor(path).general, path).toBeUndefined();
    }
    expect(limitsCity(initialAreaFor("/cleaning-services-red-deer/"), "or")).toBe("Red Deer");
  });
});

describe("where is the home: the wording", () => {
  it("names the place when the page gave it, and hedges until city limits are answered", () => {
    expect(areaPhrase({ branch: "edmonton", outside: true, place: "Leduc" })).toBe("in Leduc");
    expect(areaPhrase({ branch: "calgary", outside: true })).toBe("near Calgary");
    expect(areaPhrase({ branch: "reddeer", outside: false })).toBe("in Red Deer");
    expect(areaPhrase({ branch: "calgary", outside: null })).toBe("in the Calgary area");
    expect(areaPhrase({ branch: "edmonton", outside: null, general: true })).toBe("");
    expect(areaPhrase({ branch: "edmonton", outside: true, general: true })).toBe("outside city limits");
  });
});
