import { describe, it, expect } from "vitest";
import { GOOGLE_LISTINGS } from "./google-listings";

/**
 * Guards the two Google Business Profile identifiers.
 *
 * A wrong Place ID sends a customer to a DIFFERENT business's review form —
 * the site's write-a-review links are built from it. Nothing about that failure
 * is visible on the page: the link renders, it opens Google, and it collects a
 * five-star review for a competitor. So the pairing is verified rather than
 * trusted.
 *
 * A `ChIJ…` Place ID is base64url-encoded protobuf carrying the feature id:
 *
 *     0A 12 09 <fixed64 cell-id, LE> 11 <fixed64 CID, LE>
 *
 * The CID is embedded in the Place ID, so the two can be checked against each
 * other offline — no network, no trusting whatever source supplied them.
 *
 * WHAT THIS CANNOT PROVE, and why the owner's word is still required:
 * the decode shows a CID and a Place ID describe THE SAME listing. It cannot
 * show that listing is this business, nor which city it belongs to — a straight
 * Edmonton/Calgary swap satisfies every assertion below. The owner confirmed
 * both permalinks directly on 2026-08-29; the constants are pinned here so a
 * later edit to either field has to be deliberate.
 */

/** Recover the CID that is embedded inside a Place ID. */
function cidFromPlaceId(placeId: string): string | null {
  const b64 = placeId.replace(/-/g, "+").replace(/_/g, "/");
  const raw = Buffer.from(b64 + "=".repeat((4 - (b64.length % 4)) % 4), "base64");
  // field 2, wire type 1 (fixed64) => tag byte 0x11, then 8 little-endian bytes
  for (let i = 0; i + 9 <= raw.length; i++) {
    if (raw[i] === 0x11) return raw.readBigUInt64LE(i + 1).toString();
  }
  return null;
}

/**
 * Owner-confirmed 2026-08-29. Pinned so a silent edit to google-listings.ts
 * fails here rather than shipping.
 */
const OWNER_CONFIRMED = {
  edmonton: "8192121191672692049",
  calgary: "6193344199307583189",
} as const;

describe("Google Business Profile identifiers", () => {
  for (const city of ["edmonton", "calgary"] as const) {
    const listing = GOOGLE_LISTINGS[city];

    it(`${city}: the Place ID encodes the CID it is paired with`, () => {
      expect(
        cidFromPlaceId(listing.placeId),
        `${listing.placeId} does not encode ${listing.cid} — one of the two is wrong, ` +
          `and the write-a-review link points at another business`,
      ).toBe(listing.cid);
    });

    it(`${city}: the CID is the one the owner confirmed`, () => {
      expect(listing.cid).toBe(OWNER_CONFIRMED[city]);
    });

    it(`${city}: the permalink and review link are built from those identifiers`, () => {
      expect(listing.url).toBe(`https://www.google.com/maps?cid=${listing.cid}`);
      expect(listing.writeReviewUrl).toBe(
        `https://search.google.com/local/writereview?placeid=${listing.placeId}`,
      );
      // A /maps/search/ URL is not a permalink — it resolves to whatever the
      // search box returns that day.
      expect(listing.url).not.toMatch(/\/maps\/search\//);
    });
  }

  it("the two cities are different listings", () => {
    expect(GOOGLE_LISTINGS.edmonton.cid).not.toBe(GOOGLE_LISTINGS.calgary.cid);
    expect(GOOGLE_LISTINGS.edmonton.placeId).not.toBe(GOOGLE_LISTINGS.calgary.placeId);
  });

  it("the decoder actually decodes (it must not pass by returning null)", () => {
    // Without this, a decoder that always returned the expected string — or a
    // regex that never matched — would make every assertion above vacuous.
    expect(cidFromPlaceId(GOOGLE_LISTINGS.edmonton.placeId)).toMatch(/^\d{15,}$/);
    expect(cidFromPlaceId("not-a-place-id")).not.toBe(GOOGLE_LISTINGS.edmonton.cid);
  });
});
