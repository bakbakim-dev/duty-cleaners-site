import { afterEach, describe, expect, it, vi } from "vitest";
import { createQuoteRequestId, fingerprintQuotePayload, submitQuote } from "@/lib/quote-submit";

describe("durable quote submission", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("treats a timestamp-only retry as identical but detects edited answers", () => {
    const original = { full_name: "Test Customer", service: "Standard", submitted_at: "2026-09-12T00:00:00Z" };
    expect(fingerprintQuotePayload({ ...original, submitted_at: "2026-09-13T00:00:00Z" }))
      .toBe(fingerprintQuotePayload(original));
    expect(fingerprintQuotePayload({ ...original, service: "Move Out" }))
      .not.toBe(fingerprintQuotePayload(original));
  });

  it("accepts only a response carrying a durable storage receipt", async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      new Response(
        JSON.stringify({
          ok: true,
          stored: true,
          delivery: "pending",
          status: 202,
          receiptId: "receipt-1",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const requestId = "bfe2444b-e98b-4e29-bf0e-a0656317d6ed";
    const result = await submitQuote(
      { full_name: "Test Customer", email: "test@example.com", phone: "7805550100" },
      { requestId, keepalive: true },
    );

    expect(result).toMatchObject({ ok: true, stored: true, delivery: "pending", receiptId: "receipt-1" });
    const [, init] = fetchMock.mock.calls[0];
    expect(fetchMock.mock.calls[0][0]).toBe("/api/ghl-quote.php");
    expect(init).toBeDefined();
    expect(init!.keepalive).toBe(true);
    expect(JSON.parse(String(init!.body))).toMatchObject({ request_id: requestId, stage: "lead" });
    expect(new Headers(init!.headers).has("Authorization")).toBe(false);
  });

  it("classifies a response without a verifiable receipt as failed capture", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(JSON.stringify({ ok: true, stored: true, delivery: "pending", status: 202 }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    await expect(submitQuote({}, { requestId: createQuoteRequestId() })).resolves.toMatchObject({ ok: false });
  });

  it("aborts a stalled request at the configured deadline", async () => {
    vi.useFakeTimers();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.stubGlobal(
      "fetch",
      vi.fn((_url: string, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () =>
            reject(new DOMException("The operation was aborted", "AbortError")),
          );
        }),
      ),
    );

    const pending = submitQuote({}, { requestId: createQuoteRequestId(), timeoutMs: 25 });
    await vi.advanceTimersByTimeAsync(25);
    await expect(pending).resolves.toEqual({ ok: false, status: 0 });
  });
});
