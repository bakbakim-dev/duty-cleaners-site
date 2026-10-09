/** A repeated durable receipt counts once. Receipt IDs stay in memory, never in analytics. */
export function createEnquiryReceiptRecorder(
  emit: (event: string, props: Record<string, unknown>) => void,
) {
  const recorded = new Set<string>();
  return (receiptId: string, events: readonly string[], props: Record<string, unknown>): boolean => {
    if (!receiptId || recorded.has(receiptId)) return false;
    recorded.add(receiptId);
    for (const event of events) emit(event, props);
    return true;
  };
}
