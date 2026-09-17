import { useEffect, useRef, useState } from "react";

/**
 * A Google Maps embed that loads nothing from Google until the reader asks.
 *
 * The location pages used to ship the embed iframe in their markup with
 * loading="lazy". Lazy is not enough on a phone: Chrome starts lazy iframes
 * well before they reach the viewport, so the Altadore mobile lab run fetched
 * about 405 KiB of Maps scripts (229 KiB of it unused) during first load, and
 * that work competed with the hero text for the main thread. The prerendered
 * snapshot froze the iframe in as well, so the request fired during HTML parse,
 * before React had even booted.
 *
 * Now the first render is a same-sized box with the place name, a real
 * "Show map" button and a plain link to the place on Google Maps. The iframe is
 * created only after the button is pressed (mouse, touch, Enter or Space: it is
 * a native <button>), and focus moves to it so a keyboard user lands on the map
 * they asked for. Because the snapshot is a client render in the initial state,
 * the prerendered HTML carries no iframe either.
 */
export interface GoogleMapEmbedProps {
  /** The place as Google should search it, e.g. "Altadore, Calgary, AB". */
  query: string;
  /** Accessible title for the iframe once it loads. */
  title: string;
  /** Reserved height in px, the same before and after loading (no layout shift). */
  height?: number;
  /**
   * An existing Google embed URL to keep (the "maps/embed?pb=" style several
   * location pages use). Defaults to a search embed built from `query`.
   */
  embedSrc?: string;
}

export function googleMapEmbedSrc(query: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export function googleMapLink(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export default function GoogleMapEmbed({ query, title, height = 450, embedSrc }: GoogleMapEmbedProps) {
  const [showMap, setShowMap] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (showMap) frameRef.current?.focus();
  }, [showMap]);

  if (showMap) {
    return (
      <iframe
        ref={frameRef}
        src={embedSrc ?? googleMapEmbedSrc(query)}
        width="100%"
        height={height}
        style={{ border: 0, display: "block" }}
        allowFullScreen
        referrerPolicy="no-referrer"
        title={title}
      />
    );
  }

  return (
    <div
      className="flex w-full flex-col items-center justify-center gap-4 bg-muted/40 p-6 text-center"
      style={{ minHeight: height }}
    >
      <span className="dc-icon dc-icon-map-pin h-8 w-8 text-primary" aria-hidden="true" />
      <p className="text-lg font-semibold text-foreground">{query}</p>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
        <button
          type="button"
          onClick={() => setShowMap(true)}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-primary px-5 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span className="dc-icon dc-icon-map-pin h-4 w-4" aria-hidden="true" />
          Show map
        </button>
        <a
          href={googleMapLink(query)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-primary underline underline-offset-2 hover:text-accent"
        >
          Open {query} in Google Maps
          <span className="dc-icon dc-icon-external-link h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
