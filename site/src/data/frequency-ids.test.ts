import { describe, it, expect } from "vitest";
import { FREQUENCIES, VISITS_PER_YEAR } from "./pricing";
import { GHL_FREQUENCY_LABELS } from "@/config/ghl";
import { FREQUENCY_IDS } from "@/lib/booking-redirect";

/**
 * Every table keyed by a BookingKoala frequency id must follow bk-config's own
 * names (AuditSpur #246, 2026-10-07). bk-config has 2 = Every 4 Weeks and
 * 3 = Weekly; three tables assumed the opposite, so the funnel overstated an
 * Every 4 Weeks saving about fourfold, GoHighLevel got the other plan's label,
 * and the booking page opened with Weekly ticked for an Every 4 Weeks customer.
 * The booknow ids were read off the booking page's radios, signed out,
 * 2026-10-07: freq_1 One-Time, freq_3 Weekly, freq_4 Bi-Weekly, freq_64 Every 4 Weeks.
 */

const byName = (pattern: RegExp) => {
  const found = FREQUENCIES.find((f) => pattern.test(f.label));
  if (!found) throw new Error(`no frequency matches ${pattern}`);
  return found;
};

const PLANS = [
  { name: /^One-Time$/i, visits: 1, booknow: 1 },
  { name: /^Weekly$/i, visits: 52, booknow: 3 },
  { name: /^Bi-Weekly$/i, visits: 26, booknow: 4 },
  { name: /^Every 4 Weeks$/i, visits: 13, booknow: 64 },
];

describe("frequency tables follow bk-config's plan names", () => {
  it("visits a year, the GoHighLevel label and the booking-page id match each plan", () => {
    for (const plan of PLANS) {
      const f = byName(plan.name);
      expect(VISITS_PER_YEAR[f.bkId], `${f.label}: visits a year`).toBe(plan.visits);
      expect(FREQUENCY_IDS[f.bkId], `${f.label}: booking-page frequency id`).toBe(plan.booknow);
      const label = GHL_FREQUENCY_LABELS[f.bkId] ?? "";
      if (f.discount > 0) {
        expect(label, `${f.label}: GoHighLevel label`).toContain(`${Math.round(f.discount * 100)}%`);
      } else {
        expect(label, `${f.label}: GoHighLevel label`).toMatch(/one time/i);
      }
    }
  });
});
