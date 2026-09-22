import { describe, expect, it } from "vitest";
import { areaPhrase, areaPresetFor, asksBranch, initialAreaFor, BRANCH_OPTIONS } from "@/lib/service-area";
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

  it("only pages that name no branch ask for one on step 1", () => {
    for (const path of ["/", "/faqs/", "/contact-us/", "/blog/some-post/"]) expect(asksBranch(path), path).toBe(true);
    for (const path of ["/cleaning-services-calgary/", "/pricing/", "/cleaning-services-leduc/", "/cleaning-services-red-deer/"]) {
      expect(asksBranch(path), path).toBe(false);
    }
    expect(BRANCH_OPTIONS.map((option) => option.label)).toEqual(["Edmonton area", "Calgary area", "Red Deer area"]);
  });
});

describe("where is the home: the wording", () => {
  it("names the place when the page gave it, and hedges until city limits are answered", () => {
    expect(areaPhrase({ branch: "edmonton", outside: true, place: "Leduc" })).toBe("in Leduc");
    expect(areaPhrase({ branch: "calgary", outside: true })).toBe("near Calgary");
    expect(areaPhrase({ branch: "reddeer", outside: false })).toBe("in Red Deer");
    expect(areaPhrase({ branch: "calgary", outside: null })).toBe("in the Calgary area");
  });
});
