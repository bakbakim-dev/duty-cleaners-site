import iframeResize from "iframe-resizer/js/iframeResizer.js";

/**
 * Parent side of an embedded BookingKoala form (the /book frame and the gift-card frame).
 *
 * This used to be BookingKoala's own /resources/embed.js, loaded from their domain with
 * no integrity hash. That script is iframe-resizer v4.1.1 (MIT) plus a short glue layer,
 * served no-store, so it could change under us, and a compromised booking domain would
 * have run code with this page's privileges (AuditSpur, 2026-09-19). It could not be
 * pinned with SRI either: the first change on their side would have broken the form.
 * Now the same iframe-resizer release is bundled from npm (pinned, the version the frame's
 * child script speaks) and the glue is ported here, with two differences: messages are
 * accepted from and sent to the booking origin only (theirs used checkOrigin:false and
 * postMessage "*"), and the resizer is bound to our frame, not to every iframe on the page.
 *
 * The glue, as read from their embed.js on 2026-09-19:
 *  - height from the frame's body offset;
 *  - on scroll and after each resize, the frame's position in the viewport, so the form
 *    can place its popups ({ bodyscroll, posi, top, scrollTop, height });
 *  - once loaded, the parent page's query string, renamed to the form's fields, plus the
 *    referrer. Their messageCallback scrolled with jQuery, which this site does not load.
 */

type Resizable = HTMLIFrameElement & { iFrameResizer?: { removeListeners: () => void } };

/** BookingKoala's renames for parent-page query keys; any other key passes through. */
const QUERY_KEYS: Record<string, string> = {
  location: "location_id",
  f_name: "first_name",
  l_name: "last_name",
  email: "email_id",
  phone: "phone_number",
  service_id: "service",
  frequency_id: "frequency",
  minutes: "service_hourly_value",
};

export function parentQueryMessage(search: string, referrer: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of new URLSearchParams(search)) out[QUERY_KEYS[key] ?? key] = value;
  if (referrer) out.referrerUrl = referrer;
  return out;
}

export function framePosition(frame: HTMLElement) {
  const bodyMarginTop = parseInt(window.getComputedStyle(document.body).marginTop, 10) || 0;
  const top = frame.getBoundingClientRect().top + window.scrollY + bodyMarginTop;
  const scrollTop = document.scrollingElement?.scrollTop ?? window.scrollY;
  const height = window.innerHeight || window.screen.availHeight - 90;
  return { bodyscroll: true, posi: scrollTop > top ? scrollTop - top : 0, top, scrollTop, height };
}

/** Binds the resizer and the glue to one frame; returns the cleanup. */
export function attachBookingFrame(frame: HTMLIFrameElement, origin: string): () => void {
  const post = (message: object) => frame.contentWindow?.postMessage(message, origin);
  const onScroll = () => post(framePosition(frame));
  const onLoad = () => post(parentQueryMessage(window.location.search, document.referrer));

  iframeResize(
    {
      log: false,
      checkOrigin: [origin],
      heightCalculationMethod: "bodyOffset",
      resizedCallback: onScroll,
    },
    frame,
  );
  window.addEventListener("scroll", onScroll, { passive: true });
  frame.addEventListener("load", onLoad);

  return () => {
    window.removeEventListener("scroll", onScroll);
    frame.removeEventListener("load", onLoad);
    (frame as Resizable).iFrameResizer?.removeListeners();
  };
}
