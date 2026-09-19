import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { parentQueryMessage } from "./booking-frame";

/**
 * BookingKoala's hosted embed.js ran on our pages with no integrity hash and
 * could not be given one (served no-store; AuditSpur, 2026-09-19). Its resizer
 * is now bundled and its glue ported to booking-frame.ts. These guard the port:
 * no page may load a script from a booking domain again, and the glue keeps
 * speaking the form's field names.
 */
const ROOT = join(__dirname, "..", "..");
const DIST = join(ROOT, "dist");

function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) return sources(p);
    return /\.(ts|tsx)$/.test(n) && !/\.test\./.test(n) ? [p] : [];
  });
}

describe("the booking form's parent script is ours", () => {
  it("no page or component loads a script from BookingKoala", () => {
    const loaders = sources(join(ROOT, "src")).filter((f) => /resources\/embed\.js/.test(readFileSync(f, "utf-8")) && !f.endsWith("booking-frame.ts"));
    expect(loaders.map((f) => f.slice(ROOT.length + 1)), "a component loads BookingKoala's hosted embed.js again").toEqual([]);
    if (!existsSync(DIST)) return;
    const bad: string[] = [];
    const walk = (dir: string) => {
      for (const n of readdirSync(dir)) {
        const p = join(dir, n);
        if (statSync(p).isDirectory()) walk(p);
        else if (n.endsWith(".html") && /<script\b[^>]*\bsrc="https:\/\/[^"]*bookingkoala\.com/.test(readFileSync(p, "utf-8"))) bad.push(p.slice(DIST.length + 1));
      }
    };
    walk(DIST);
    expect(bad, "built pages that load a BookingKoala script").toEqual([]);
  });

  it("forwards the page's query under the form's field names, with the referrer", () => {
    expect(parentQueryMessage("?f_name=Ann&email=a%40b.ca&service_id=3&zip=T5K", "https://dutycleaners.ca/")).toEqual({
      first_name: "Ann",
      email_id: "a@b.ca",
      service: "3",
      zip: "T5K",
      referrerUrl: "https://dutycleaners.ca/",
    });
    expect(parentQueryMessage("", "")).toEqual({});
  });
});
