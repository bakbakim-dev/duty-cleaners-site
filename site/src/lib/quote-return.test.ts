import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { readQuoteReturn, saveQuoteReturn, type QuoteReturnInput } from "./quote-return";

/**
 * Back from BookingKoala onto a reloaded page used to lose every answer
 * (owner, 2026-09-21). The funnel saves them at handoff; only a Back/Forward
 * load of the same page within two hours restores them.
 */
const SAMPLE: QuoteReturnInput = {
  path: "/cleaning-services-calgary/",
  choicePath: null,
  service: "standard",
  deepCleanIntent: false,
  homeType: 1,
  bedrooms: 3,
  bathrooms: 2,
  halfBaths: 0,
  frequency: "weekly",
  addOns: { "Inside Oven": 1 },
  hasPets: false,
  details: { entry: "lockbox" } as QuoteReturnInput["details"],
  contact: { firstName: "Test", lastName: "Preview", email: "test@example.com", phone: "5875550123" },
  deepNudgeDismissed: false,
  leadRequestId: "lead-1",
  confirmRequestId: "confirm-1",
  confirmFingerprint: null,
};

function fakeWindow(navigationType: string) {
  const store = new Map<string, string>();
  vi.stubGlobal("window", {
    sessionStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => void store.set(key, value),
      removeItem: (key: string) => void store.delete(key),
    },
    performance: { getEntriesByType: () => [{ type: navigationType }] },
  });
  return store;
}

afterEach(() => vi.unstubAllGlobals());

describe("the funnel survives Back from the booking page", () => {
  it("restores the saved answers on a Back load of the same page", () => {
    fakeWindow("back_forward");
    saveQuoteReturn(SAMPLE);
    const restored = readQuoteReturn("/cleaning-services-calgary/");
    expect(restored?.bedrooms).toBe(3);
    expect(restored?.frequency).toBe("weekly");
    expect(restored?.contact.email).toBe("test@example.com");
  });

  it("discards the snapshot on an ordinary load, another page or after two hours", () => {
    let store = fakeWindow("navigate");
    saveQuoteReturn(SAMPLE);
    expect(readQuoteReturn("/cleaning-services-calgary/"), "restored on a normal load").toBeNull();
    expect(store.size, "contact details left in storage").toBe(0);

    store = fakeWindow("back_forward");
    saveQuoteReturn(SAMPLE);
    expect(readQuoteReturn("/edmonton/pricing/"), "restored on another page").toBeNull();
    expect(store.size).toBe(0);

    saveQuoteReturn(SAMPLE);
    expect(readQuoteReturn("/cleaning-services-calgary/", Date.now() + 3 * 60 * 60 * 1000), "restored after two hours").toBeNull();
  });

  it("the funnel saves at handoff and the overlay reopens on return", () => {
    const flow = readFileSync(join(__dirname, "../components/quote/QuoteFlow.tsx"), "utf-8");
    expect(flow, "the handoff no longer saves the answers").toMatch(/handoffBusy\.current = true;\s*\/\/[^\n]*\n\s*saveQuoteReturn\(\{/);
    expect(flow, "the funnel no longer restores them").toMatch(/useState\(\(\) => readQuoteReturn\(pathname\)\)/);
    const overlay = readFileSync(join(__dirname, "../hooks/use-quote-overlay.tsx"), "utf-8");
    expect(overlay, "the overlay no longer reopens on return").toMatch(/else if \(restoreOnLoadRef\.current\) \{/);
  });
});
