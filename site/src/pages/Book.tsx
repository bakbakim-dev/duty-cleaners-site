import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import { Phone } from "lucide-react";
import BookingEmbed from "@/components/quote/BookingEmbed";
import { BOOKING_ORIGIN } from "@/lib/booking-redirect";
import { track } from "@/lib/analytics";
import { CITY_PROOF } from "@/data/proof";

/**
 * Step 4 of the funnel, kept on our domain. A deliberately minimal shell:
 * no nav, no escape hatches mid-checkout.
 */
export default function Book() {
  const location = useLocation();
  const proof = CITY_PROOF.edmonton;
  // `intent` is our own display flag — BookingKoala never sees it.
  const params = new URLSearchParams(location.search);
  const deepIntent = params.get("intent") === "deep";
  params.delete("intent");
  const query = params.toString();

  useEffect(() => {
    track("booking_page_view");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Complete your booking | Duty Cleaners</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="preconnect" href={BOOKING_ORIGIN} crossOrigin="anonymous" />
        <link rel="dns-prefetch" href={BOOKING_ORIGIN} />
      </Helmet>

      <header className="border-b border-border bg-brand-navy">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-4 py-4">
          <Link to="/" className="text-xl font-bold tracking-tight text-brand-navy-foreground">
            Duty <span className="text-brand-gold">Cleaners</span>
          </Link>
          <a
            href={proof.phoneLink}
            className="inline-flex min-h-[48px] items-center gap-2 font-semibold text-brand-navy-foreground"
          >
            <Phone className="h-4 w-4 text-brand-gold" aria-hidden="true" />
            Call {proof.phone}
          </a>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="mx-auto max-w-[1100px] px-4 py-6">
        <h1 className="mb-5 text-base font-semibold text-muted-foreground">
          {deepIntent ? (
            <>
              Step 4 of 4 — your Deep Cleaning package is already added — just pick your time.
            </>
          ) : (
            <>
              Step 4 of 4 — pick your time. Your details are carried over. Add-ons like the Deep
              Cleaning package are under &ldquo;Select Extras&rdquo;.
            </>
          )}
        </h1>
        <BookingEmbed query={query} />
      </main>

      <footer className="mx-auto max-w-[1100px] px-4 pb-10 text-sm text-muted-foreground">
        Secure booking powered by our scheduling system. Questions?{" "}
        <a href={proof.phoneLink} className="font-semibold text-foreground underline">
          {proof.phone}
        </a>
      </footer>
    </div>
  );
}
