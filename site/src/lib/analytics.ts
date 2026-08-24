/**
 * Thin analytics shim. Pushes to the GTM dataLayer when one exists and
 * no-ops otherwise, so nothing in the funnel ever depends on a tag being
 * installed.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: string, props: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event, ...props });
  } catch {
    /* analytics must never break the booking flow */
  }
}
