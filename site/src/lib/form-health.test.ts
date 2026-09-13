import { afterEach, describe, expect, it, vi } from "vitest";
import {
  monitoredFormForSource,
  reportFormFailure,
  reportFormRecovery,
} from "./form-health";

afterEach(() => vi.unstubAllGlobals());

describe("privacy-safe form health reporting", () => {
  it("maps every shared submission source to a fixed form name", () => {
    expect(monitoredFormForSource("contact-form")).toBe("contact-form");
    expect(monitoredFormForSource("careers-application")).toBe("careers-application");
    expect(monitoredFormForSource("quote-overlay (fast fill — verify)")).toBe("quote-funnel");
  });

  it("reports fixed diagnostics without form values or URL parameters", () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    reportFormFailure({
      form: "contact-form",
      stage: "form-submit",
      category: "network",
      status: 0,
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(String(init.body));
    expect(body).toEqual({
      event: "failed",
      form: "contact-form",
      stage: "form-submit",
      category: "network",
      status: 0,
      path: "/",
    });
    expect(String(init.body)).not.toMatch(/name|email|phone|address|message|access|query/i);
    expect(init.keepalive).toBe(true);
  });

  it("sends a recovery only after that form and stage failed in this visit", () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const details = {
      form: "booking-handoff" as const,
      stage: "secure-transfer" as const,
      category: "network" as const,
      status: 0,
    };
    reportFormRecovery(details);
    expect(fetchMock).not.toHaveBeenCalled();
    reportFormFailure(details);
    reportFormRecovery(details);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(JSON.parse(String(fetchMock.mock.calls[1][1].body)).event).toBe("recovered");
  });
});
