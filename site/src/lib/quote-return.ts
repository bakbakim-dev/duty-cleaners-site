/**
 * Coming back from BookingKoala with the browser's Back button.
 *
 * When the browser restores the page from its back/forward cache, the funnel
 * is exactly as it was. When it reloads the page instead (common on phones, and
 * always after the tab was discarded), every answer used to be gone: the
 * overlay was closed and a visitor who re-entered their details sent a second
 * lead. The funnel now saves its answers the moment it hands off, and a
 * Back/Forward load of the same page within two hours reopens it on the
 * details step with everything filled in.
 *
 * sessionStorage only: it stays in this tab, is never sent anywhere, and ends
 * when the tab closes. The snapshot is removed as soon as it is used, and on
 * any ordinary page load, so contact details never linger.
 */
import type { CleanerDetails } from "@/lib/booking-redirect";
import type { ServiceId } from "@/data/pricing";
import type { ServiceArea } from "@/lib/service-area";

const KEY = "dc-quote-return";
const MAX_AGE_MS = 2 * 60 * 60 * 1000;

export interface QuoteReturnState {
  v: 1;
  savedAt: number;
  /** The page the funnel was open on; only that page restores it. */
  path: string;
  choicePath: string | null;
  service: ServiceId;
  deepCleanIntent: boolean;
  homeType: number | null;
  bedrooms: number;
  bathrooms: number;
  halfBaths: number;
  frequency: string | null;
  addOns: Record<string, number>;
  hasPets: boolean | null;
  /** Where the home is (lib/service-area.ts); absent in records saved before 2026-09-22. */
  area?: ServiceArea | null;
  details: CleanerDetails;
  contact: { firstName: string; lastName: string; email: string; phone: string };
  deepNudgeDismissed: boolean;
  /** Request ids, so a second handoff stays idempotent with the first. */
  leadRequestId: string | null;
  confirmRequestId: string | null;
  confirmFingerprint: string | null;
}

export type QuoteReturnInput = Omit<QuoteReturnState, "v" | "savedAt">;

/** True when this document was loaded by the browser's Back or Forward button. */
export function isBackForwardLoad(): boolean {
  if (typeof window === "undefined") return false;
  const entry = window.performance?.getEntriesByType?.("navigation")?.[0] as
    | PerformanceNavigationTiming
    | undefined;
  return entry?.type === "back_forward";
}

export function saveQuoteReturn(state: QuoteReturnInput) {
  try {
    const record: QuoteReturnState = { ...state, v: 1, savedAt: Date.now() };
    window.sessionStorage.setItem(KEY, JSON.stringify(record));
  } catch {
    /* private mode or storage full: Back simply starts a fresh quote */
  }
}

export function clearQuoteReturn() {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* nothing to clear */
  }
}

/**
 * The saved funnel for this page, or null. Only a Back/Forward load of the
 * same page within two hours qualifies; anything else is discarded.
 */
export function readQuoteReturn(pathname: string, now = Date.now()): QuoteReturnState | null {
  if (typeof window === "undefined") return null;
  let record: QuoteReturnState | null = null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    record = raw ? (JSON.parse(raw) as QuoteReturnState) : null;
  } catch {
    record = null;
  }
  if (!record) return null;
  const usable =
    record.v === 1 &&
    record.path === pathname &&
    now - record.savedAt >= 0 &&
    now - record.savedAt < MAX_AGE_MS &&
    isBackForwardLoad();
  if (!usable) {
    clearQuoteReturn();
    return null;
  }
  return record;
}
