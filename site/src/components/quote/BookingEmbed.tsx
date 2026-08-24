import { memo, useEffect, useRef, useState } from "react";
import { BOOKING_ORIGIN, buildBookingEmbedUrl } from "@/lib/booking-redirect";
import { track } from "@/lib/analytics";

const EMBED_SCRIPT_ID = "bk-embed-script";
const SLOW_LOAD_MS = 8000;

/**
 * BookingKoala's own booking form, embedded in our page.
 *
 * Their /resources/embed.js is iframe-resizer v4.1.1 (parent side) and owns
 * all height logic — we deliberately write none. The iframe src is computed
 * once and never changes: a src change reloads the form and wipes whatever
 * the customer has entered.
 */
function BookingEmbed({ query, warmup = false }: { query: string; warmup?: boolean }) {
  // Frozen on first render — parent re-renders can never reload the form.
  const [src] = useState(() => buildBookingEmbedUrl(query));
  const [fallbackUrl] = useState(() => `${BOOKING_ORIGIN}/booknow?${query}`);
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const loadedRef = useRef(false);
  const handshakeRef = useRef(false);

  useEffect(() => {
    // iframe-resizer initializes against iframes already in the DOM, so this
    // runs after mount. The id guard survives strict-mode double effects.
    if (document.getElementById(EMBED_SCRIPT_ID)) return;
    const script = document.createElement("script");
    script.id = EMBED_SCRIPT_ID;
    script.src = `${BOOKING_ORIGIN}/resources/embed.js`;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    // A frame refused by X-Frame-Options / CSP still fires onLoad, so the only
    // proof the real form is alive is a postMessage from the booking origin
    // (their embed.js child side chatters constantly).
    const onMessage = (event: MessageEvent) => {
      if (event.origin === BOOKING_ORIGIN) handshakeRef.current = true;
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    // The warm-up copy is invisible and off-flow: it must never navigate or
    // nag. Only the real /book frame owns the fallback path.
    if (warmup) return;
    const timer = window.setTimeout(() => {
      if (!loadedRef.current) setSlow(true);
      if (!handshakeRef.current) {
        // Blocked or dead: never leave the customer staring at a blank frame.
        setBlocked(true);
        window.setTimeout(() => window.location.assign(fallbackUrl), 1500);
      }
    }, SLOW_LOAD_MS);
    return () => window.clearTimeout(timer);
  }, [fallbackUrl, warmup]);


  const handleLoad = () => {
    loadedRef.current = true;
    setLoaded(true);
    track("bk_embed_loaded");
  };

  // A blocked or errored frame must never strand the customer.
  const handleError = () => {
    if (warmup) return;
    window.location.assign(fallbackUrl);
  };

  const showSkeleton = !warmup && (!loaded || blocked);

  if (warmup) {
    // Invisible, zero-footprint preload of the real booking document:
    // visibility:hidden (not display:none) so the browser actually loads it.
    return (
      <div
        aria-hidden="true"
        style={{ visibility: "hidden", height: 0, overflow: "hidden", pointerEvents: "none" }}
      >
        <iframe
          key="bk-embed-warmup"
          src={src}
          title=""
          tabIndex={-1}
          width="100%"
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={handleLoad}
          style={{ border: "none", width: "100%", height: 1000 }}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      {showSkeleton && (

        <div
          className="flex min-h-[70vh] animate-pulse flex-col items-center justify-center gap-4 bg-brand-navy/5 px-6 text-center"
          aria-hidden={slow || blocked ? undefined : "true"}
        >
          <p className="text-lg font-semibold text-foreground">
            {blocked
              ? "Opening the secure booking page\u2026"
              : "Loading your secure booking page\u2026"}
          </p>
          {(slow || blocked) && (
            <a
              href={fallbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] bg-brand-gold px-6 py-3 font-bold text-brand-gold-foreground"
            >
              {blocked
                ? "Continue to the secure booking page \u2192"
                : "Taking too long? Open the secure booking page \u2192"}
            </a>
          )}
        </div>
      )}

      <iframe
        key="bk-embed"
        src={src}
        title="Complete your booking — Duty Cleaners"
        width="100%"
        loading="eager"
        allow="payment"
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={handleLoad}
        onError={handleError}
        style={{
          border: "none",
          width: "100%",
          minHeight: 1000,
          opacity: showSkeleton ? 0 : 1,
          position: showSkeleton ? "absolute" : "static",
          inset: showSkeleton ? 0 : undefined,
          transition: "opacity 250ms ease",
        }}
      />
    </div>
  );
}

export default memo(BookingEmbed);
