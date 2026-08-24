import { describe, it, expect } from "vitest";
import { cityFromPath, isCalgaryPath } from "./city-from-path";

describe("cityFromPath", () => {
  it("treats the canonical Calgary landing URL as Calgary", () => {
    // The regression this file exists for: startsWith("/calgary") returned false
    // here, so the site's biggest Calgary page showed Edmonton's phone number.
    expect(cityFromPath("/cleaning-services-calgary")).toBe("calgary");
    expect(cityFromPath("/cleaning-services-calgary/")).toBe("calgary");
  });

  it("handles the modern /calgary routes", () => {
    expect(cityFromPath("/calgary")).toBe("calgary");
    expect(cityFromPath("/calgary/")).toBe("calgary");
    expect(cityFromPath("/calgary/pricing")).toBe("calgary");
    expect(cityFromPath("/calgary/commercial-cleaning")).toBe("calgary");
  });

  it("handles every canonical Calgary service URL", () => {
    for (const p of [
      "/move-out-cleaning-calgary",
      "/commercial-cleaning-services-calgary",
      "/commercial-cleaning-calgary",
      "/post-construction-cleaning-calgary",
      "/wall-washing-wall-cleaning-calgary",
      "/airbnb-cleaning-services-calgary",
      "/march-out-cleaning-calgary",
    ]) {
      expect(cityFromPath(p), p).toBe("calgary");
    }
  });

  it("handles Calgary neighbourhood location pages", () => {
    for (const p of [
      "/locations/varsity-calgary",
      "/locations/bowness-calgary",
      "/locations/killarney-glengarry-calgary",
      "/locations/west-calgary",
    ]) {
      expect(cityFromPath(p), p).toBe("calgary");
    }
  });

  it("handles Calgary-region satellite towns on both URL forms", () => {
    for (const p of [
      "/locations/airdrie",
      "/cleaning-services-airdrie",
      "/locations/okotoks",
      "/cleaning-services-cochrane",
      "/locations/high-river",
      "/cleaning-services-black-diamond",
      "/locations/turner-valley",
    ]) {
      expect(cityFromPath(p), p).toBe("calgary");
    }
  });

  it("keeps Edmonton URLs on Edmonton", () => {
    for (const p of [
      "/",
      "/edmonton/pricing",
      "/pricing",
      "/cleaning-services-beaumont",
      "/locations/beaumont",
      "/move-out-cleaning-edmonton",
      "/locations/varsity", // not the Calgary one
      "/contact-us",
      "/faqs",
      "/reviews",
      "/whats-included",
    ]) {
      expect(cityFromPath(p), p).toBe("edmonton");
    }
  });

  it("does not let an Edmonton satellite be mistaken for Calgary", () => {
    for (const p of [
      "/cleaning-services-st-albert",
      "/cleaning-services-sherwood-park",
      "/cleaning-services-spruce-grove",
      "/cleaning-services-fort-saskatchewan",
      "/cleaning-services-stony-plain",
      "/cleaning-services-morinville",
      "/cleaning-services-leduc",
      "/cleaning-services-devon",
      "/cleaning-services-windermere",
    ]) {
      expect(cityFromPath(p), p).toBe("edmonton");
    }
  });

  it("leaves blog posts on the default city even when Calgary-themed", () => {
    expect(cityFromPath("/blog/cleaning-services-calgary")).toBe("edmonton");
    expect(cityFromPath("/blog/cleaning-products")).toBe("edmonton");
  });

  it("is case-insensitive and tolerates missing input", () => {
    expect(cityFromPath("/Cleaning-Services-Calgary")).toBe("calgary");
    expect(cityFromPath("")).toBe("edmonton");
  });

  it("isCalgaryPath mirrors cityFromPath", () => {
    expect(isCalgaryPath("/cleaning-services-calgary")).toBe(true);
    expect(isCalgaryPath("/")).toBe(false);
  });
});
