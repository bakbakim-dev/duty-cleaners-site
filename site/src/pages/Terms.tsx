import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import TrustPageCta from "@/components/TrustPageCta";
import { ScrollText, Phone, Mail } from "lucide-react";
import { SUPPORT_EMAIL } from "@/data/proof";
import {
  POLICY,
  PAYMENT_TERMS,
  PRICING_TERMS,
  NOT_INCLUDED,
  SERVICE_TERMS,
  ARRIVAL_WINDOWS,
} from "@/data/policy";

/**
 * Bump when the terms below change. Same convention as PrivacyPolicy.tsx.
 */
const LAST_UPDATED = "August 2026";

/**
 * Every clause here is drawn from copy already published elsewhere on the site
 * and consistent across it — this page puts it in one place rather than making
 * new commitments. Anything the business has never settled, or currently states
 * two ways, lives in policy.ts as `null` and simply does not render. See the
 * TODO-OWNER notes there.
 */
export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Duty Cleaners</title>
        <meta
          name="description"
          content="Duty Cleaners terms of service: how pricing, payment, scheduling and the satisfaction guarantee work, and what a clean includes."
        />
        <link rel="canonical" href="https://dutycleaners.ca/terms/" />
        <meta property="og:title" content="Terms of Service | Duty Cleaners" />
        <meta property="og:description" content="Duty Cleaners terms of service: how pricing, payment, scheduling and the satisfaction guarantee work, and what a clean includes." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/terms/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Terms of Service | Duty Cleaners" />
        <meta name="twitter:description" content="Duty Cleaners terms of service: how pricing, payment, scheduling and the satisfaction guarantee work, and what a clean includes." />
      </Helmet>

      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>

        <main id="main-content" tabIndex={-1}>
        <section className="relative bg-brand-navy py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 via-brand-navy/70 to-brand-navy/90" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-20 h-20 bg-accent/20 border-2 border-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <ScrollText className="w-10 h-10 text-accent" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
                Terms of Service
              </h1>
              <p className="text-lg text-white/85">Last updated: {LAST_UPDATED}</p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-8 text-lg">
                These terms cover residential and commercial cleaning booked from Duty Cleaners in
                Edmonton, Calgary and the surrounding communities we serve. Booking a clean means
                agreeing to them. If anything here is unclear, call us before you book and we will
                talk it through.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-foreground">Booking and Payment</h2>
              <ul className="list-disc pl-6 mb-8">
                {PAYMENT_TERMS.map((term) => (
                  <li key={term}>{term}</li>
                ))}
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-foreground">Pricing and Quotes</h2>
              <ul className="list-disc pl-6 mb-8">
                {PRICING_TERMS.map((term) => (
                  <li key={term}>{term}</li>
                ))}
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-foreground">Scheduling and Access</h2>
              <ul className="list-disc pl-6 mb-4">
                {SERVICE_TERMS.map((term) => (
                  <li key={term}>{term}</li>
                ))}
              </ul>
              <p className="mb-2">Our arrival windows are:</p>
              <ul className="list-disc pl-6 mb-8">
                {ARRIVAL_WINDOWS.map((slot) => (
                  <li key={slot}>{slot}</li>
                ))}
              </ul>

              {/* The cancellation fee is confirmed, so this now states it plainly
                  rather than omitting it. */}
              {POLICY.cancellationNoticeHours !== null && (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">
                    Changing or Cancelling a Visit
                  </h2>
                  <p className="mb-8">
                    Plans change. Please give us at least {POLICY.cancellationNoticeHours} hours'
                    notice if you need to move or cancel a clean, so we can offer the slot to
                    someone else and keep your cleaner's day full.
                    {POLICY.cancellationFee
                      ? ` Cancelling or rescheduling inside that window is charged ${POLICY.cancellationFee}.`
                      : ""}{" "}
                    There is no long-term contract, and you can change or pause a recurring
                    schedule at any time.
                  </p>
                </>
              )}

              {POLICY.guaranteeWindowHours !== null && (
                <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-6 mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-primary">
                    Our Satisfaction Guarantee
                  </h2>
                  <p className="mb-4">
                    If something was missed, tell us within {POLICY.guaranteeWindowHours} hours of
                    your clean and we will come back and re-clean the areas of concern at no
                    additional charge.
                    {POLICY.guaranteeRequiresPhotos
                      ? " Please include photos of the areas in question so the team knows exactly what to put right."
                      : " Photos help the team know exactly what to put right, but they are not required — a phone call describing what was missed is enough."}
                  </p>
                  <p className="mb-2">The guarantee covers the work included in your booking. It does not cover:</p>
                  <ul className="list-disc pl-6">
                    <li>Services that were not part of the clean you booked</li>
                    <li>Pre-existing stains, damage or permanent discolouration</li>
                    <li>Ordinary dust that settles after we leave</li>
                  </ul>
                </div>
              )}

              <h2 className="text-2xl font-bold mb-4 text-foreground">What We Do Not Clean</h2>
              <p className="mb-4">
                Some tasks are outside what our teams are equipped and trained to do, usually for
                safety reasons. If you need one of these, tell us and we will point you to a
                specialist where we can.
              </p>
              <ul className="list-disc pl-6 mb-8">
                {NOT_INCLUDED.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              {POLICY.giftCardExpiryMonths !== null && (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">Gift Cards</h2>
                  <p className="mb-8">
                    {POLICY.giftCardExpiryMonths === "none"
                      ? "Gift cards do not expire. We track the remaining balance, so it can be used across more than one visit, and if a clean costs more than the balance you simply pay the difference."
                      : `Gift cards should be redeemed within ${POLICY.giftCardExpiryMonths} months. We track the remaining balance, so it can be used across more than one visit.`}{" "}
                    Gift cards are non-refundable and cannot be combined with other promotions.
                    {POLICY.giftCardMaxValue === "none"
                      ? " There is no minimum or maximum amount."
                      : POLICY.giftCardMaxValue
                        ? ` The maximum value we can issue is ${POLICY.giftCardMaxValue}.`
                        : ""}
                  </p>
                </>
              )}

              {POLICY.lockoutFee !== null && (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">If We Cannot Get In</h2>
                  <p className="mb-8">
                    If our team arrives for a scheduled clean and cannot get into the home — no
                    key left, a code that does not work, or nobody able to let them in — we
                    charge {POLICY.lockoutFee}. The cleaner has already travelled and the slot
                    cannot be given to anyone else at that point. Telling us at least{" "}
                    {POLICY.cancellationNoticeHours} hours ahead avoids this entirely.
                  </p>
                </>
              )}

              {/* Sits directly after the lockout clause on purpose: that one says
                  what a missed visit costs the customer, this one says what a
                  missed visit costs us. They belong on the same screen. */}
              {POLICY.ourCancellationNote !== null && (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">
                    If We Have To Move Your Booking
                  </h2>
                  <p className="mb-8">{POLICY.ourCancellationNote}</p>
                </>
              )}

              {POLICY.liabilityNote !== null && (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">
                    Damage and Breakage
                  </h2>
                  <p className="mb-8">{POLICY.liabilityNote}</p>
                </>
              )}

              {POLICY.insuranceClaim !== null && (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">Our Cleaners</h2>
                  <p className="mb-8">{POLICY.insuranceClaim}</p>
                </>
              )}

              <h2 className="text-2xl font-bold mb-4 text-foreground">Your Privacy</h2>
              <p className="mb-8">
                How we collect, use and share your information — including what is sent to our
                booking system when you book — is set out in our{" "}
                <a href="/privacy-policy/" className="text-primary underline">
                  Privacy Policy
                </a>
                .
              </p>

              <h2 className="text-2xl font-bold mb-4 text-foreground">Changes to These Terms</h2>
              <p className="mb-8">
                We may update these terms from time to time. When we do, we will post the new
                version on this page and change the &ldquo;Last updated&rdquo; date above.
              </p>

              {POLICY.governingProvince !== null && (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">Governing Law</h2>
                  <p className="mb-8">
                    These terms are governed by the laws of {POLICY.governingProvince}.
                  </p>
                </>
              )}

              <div className="bg-brand-navy border-2 border-accent/30 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4 text-white">Questions About These Terms</h3>
                <p className="mb-4 text-white/90">
                  If anything here is unclear, or you want something confirmed in writing before you
                  book, get in touch:
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="tel:7809136565"
                    className="inline-flex items-center gap-2 text-accent hover:underline"
                  >
                    <Phone className="w-4 h-4" /> Edmonton: 780-913-6565
                  </a>
                  <a
                    href="tel:4037681341"
                    className="inline-flex items-center gap-2 text-accent hover:underline"
                  >
                    <Phone className="w-4 h-4" /> Calgary: (403) 768-1341
                  </a>
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="inline-flex items-center gap-2 text-accent hover:underline"
                  >
                    <Mail className="w-4 h-4" /> {SUPPORT_EMAIL}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        </main>

        <TrustPageCta />
        <Footer />
      </div>
    </>
  );
}
