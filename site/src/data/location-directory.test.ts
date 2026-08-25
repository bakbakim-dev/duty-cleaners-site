import { describe, it, expect } from "vitest";
import { locationRouteForName, LINKABLE_LOCATION_COUNT } from "./location-directory";

describe("location-directory", () => {
  it("resolves real neighbourhoods to their route", () => {
    expect(locationRouteForName("Pleasantview")).toBe("/locations/pleasantview");
    expect(locationRouteForName("Queen Alexandra")).toBe("/locations/queen-alexandra-edmonton");
  });

  it("resolves satellite towns to their CANONICAL legacy route, not /locations/*", () => {
    // These are mode:"preserve" URLs — linking to /locations/<town> would 301.
    expect(locationRouteForName("St. Albert")).toBe("/cleaning-services-st-albert");
    expect(locationRouteForName("Beaumont")).toBe("/cleaning-services-beaumont");
    expect(locationRouteForName("Airdrie")).toBe("/cleaning-services-airdrie");
  });

  it("is tolerant of punctuation and case differences", () => {
    expect(locationRouteForName("st albert")).toBe("/cleaning-services-st-albert");
    expect(locationRouteForName("ST. ALBERT")).toBe("/cleaning-services-st-albert");
  });

  it("returns null for landmarks and streets so they never become dead links", () => {
    for (const notAPage of [
      "Rundle Park",
      "118 Avenue",
      "34 Street",
      "Abbottsfield Mall",
      "Victoria Trail",
      "Coopers Crossing",
    ]) {
      expect(locationRouteForName(notAPage), notAPage).toBeNull();
    }
  });

  it("exposes a sane number of linkable locations", () => {
    expect(LINKABLE_LOCATION_COUNT).toBeGreaterThan(150);
  });
});

describe("city scoping", () => {
  it("resolves an ambiguous name to the page in the CURRENT city", () => {
    // Inglewood exists in both markets — this is the case that was sending
    // Calgary visitors to the Edmonton page.
    expect(locationRouteForName("Inglewood", "calgary")).toBe("/locations/inglewood-calgary");
    expect(locationRouteForName("Inglewood", "edmonton")).toBe("/locations/inglewood");
  });

  it("returns null rather than linking across cities", () => {
    // These have an Edmonton page but no Calgary one. An unlinked chip is
    // correct; pointing Calgary's Montrose at Edmonton's Montrose is not.
    for (const name of ["Downtown", "Westmount", "Montrose", "Riverbend"]) {
      expect(locationRouteForName(name, "calgary"), name).toBeNull();
    }
  });

  it("still resolves unambiguous names within their own city", () => {
    expect(locationRouteForName("Beltline", "calgary")).toBe("/locations/beltline-calgary");
    expect(locationRouteForName("Allendale", "edmonton")).toBe("/locations/allendale");
  });
});
