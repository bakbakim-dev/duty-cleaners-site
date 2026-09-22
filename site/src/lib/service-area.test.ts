import { describe, expect, it } from "vitest";
import { areaOptionsFor, areaPhrase, areaPresetFor } from "@/lib/service-area";
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

  it("hubs, service pages, the homepage and Red Deer ask, because nearby towns land there too", () => {
    for (const path of ["/", "/cleaning-services-calgary/", "/pricing/", "/cleaning-services-red-deer/", "/faqs/", "/move-out-cleaning-calgary/"]) {
      expect(areaPresetFor(path), path).toBeNull();
    }
  });
});

describe("where is the home: the answers", () => {
  it("offers each branch city and its nearby towns, the page's branch first", () => {
    expect(areaOptionsFor("/").map((option) => option.label)).toEqual([
      "Edmonton", "Near Edmonton", "Calgary", "Near Calgary", "Red Deer", "Near Red Deer",
    ]);
    expect(areaOptionsFor("/cleaning-services-calgary/")[0]).toEqual({ branch: "calgary", outside: false, label: "Calgary" });
    expect(areaOptionsFor("/cleaning-services-red-deer/")[0].label).toBe("Red Deer");
  });

  it("names the place when the page gave it", () => {
    expect(areaPhrase({ branch: "edmonton", outside: true, place: "Leduc" })).toBe("in Leduc");
    expect(areaPhrase({ branch: "calgary", outside: true })).toBe("near Calgary");
    expect(areaPhrase({ branch: "reddeer", outside: false })).toBe("in Red Deer");
  });
});
