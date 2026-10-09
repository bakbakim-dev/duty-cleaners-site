import { describe, expect, it, vi } from "vitest";
import { createEnquiryReceiptRecorder } from "./enquiry-receipt-analytics";

describe("durable enquiry receipt analytics", () => {
  it("counts repeated success for the same receipt once without exposing its ID", () => {
    const emit = vi.fn();
    const record = createEnquiryReceiptRecorder(emit);
    const props = { city: "Edmonton", service: "standard" };
    expect(record("receipt-a", ["generate_lead", "contact_submitted"], props)).toBe(true);
    expect(record("receipt-a", ["generate_lead", "contact_submitted"], props)).toBe(false);
    expect(emit.mock.calls).toEqual([["generate_lead", props], ["contact_submitted", props]]);
    expect(JSON.stringify(emit.mock.calls)).not.toContain("receipt-a");
  });
  it("allows a distinct request and excludes an absent receipt", () => {
    const emit = vi.fn();
    const record = createEnquiryReceiptRecorder(emit);
    expect(record("", ["contact_enquiry_submitted"], {})).toBe(false);
    expect(record("first", ["contact_enquiry_submitted"], {})).toBe(true);
    expect(record("second", ["contact_enquiry_submitted"], {})).toBe(true);
    expect(emit).toHaveBeenCalledTimes(2);
  });
});
