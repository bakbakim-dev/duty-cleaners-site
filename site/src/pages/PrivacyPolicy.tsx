import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import TrustPageCta from "@/components/TrustPageCta";
import { Lock, Mail } from "lucide-react";

/**
 * Bump this whenever the sections below change — the policy itself promises
 * that this date moves when the policy does. It sat at "December 2024" through
 * a stack change that added the BookingKoala handoff, the GoHighLevel form
 * embed and the map embeds, none of which the old text mentioned.
 */
const LAST_UPDATED = "September 2026";

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Duty Cleaners</title>
        <meta name="description" content="Duty Cleaners Privacy Policy. Learn how we collect, use, and protect your personal information." />
        <link rel="canonical" href="https://dutycleaners.ca/privacy-policy/" />
        <meta property="og:title" content="Privacy Policy | Duty Cleaners" />
        <meta property="og:description" content="Duty Cleaners Privacy Policy. Learn how we collect, use, and protect your personal information." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/privacy-policy/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy | Duty Cleaners" />
        <meta name="twitter:description" content="Duty Cleaners Privacy Policy. Learn how we collect, use, and protect your personal information." />
      </Helmet>

      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>

        {/* Hero Section */}
        <main id="main-content" tabIndex={-1}>
        <section className="relative bg-brand-navy py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 via-brand-navy/70 to-brand-navy/90" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-20 h-20 bg-accent/20 border-2 border-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-accent" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">Privacy Policy</h1>
              <p className="text-lg text-white/85">Last updated: {LAST_UPDATED}</p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-8 text-lg">
                Duty Cleaners ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you use our services
                or visit our website.
              </p>

              <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4 text-primary">Information We Collect</h2>
                <p className="mb-4">We may collect information about you in various ways, including:</p>
                <h3 className="text-lg font-bold mb-2 text-foreground">Personal Information</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li>Name, email address, phone number</li>
                  <li>Home address and service location</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                  <li>Communication preferences</li>
                </ul>

                <h3 className="text-lg font-bold mb-2 text-foreground">Service Information</h3>
                <ul className="list-disc pl-6">
                  <li>Cleaning preferences and special instructions</li>
                  <li>Service history and appointment records</li>
                  <li>Feedback and reviews</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold mb-4 text-foreground">How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 mb-8">
                <li>Provide and manage our cleaning services</li>
                <li>Process payments and send invoices</li>
                <li>Communicate about appointments and service updates</li>
                <li>Respond to enquiries and provide customer support</li>
                <li>Send promotional materials (with your consent)</li>
                <li>Improve our services and website</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-foreground">Information Sharing</h2>
              <p className="mb-4">We do not sell your personal information. We may share your information with:</p>
              <ul className="list-disc pl-6 mb-8">
                <li><strong>Service Providers:</strong> Cleaning professionals assigned to your service</li>
                <li><strong>Payment Processors:</strong> Secure third-party payment services</li>
                <li><strong>Business Partners:</strong> When necessary to provide services</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-foreground">Data Security</h2>
              <p className="mb-8">
                We implement appropriate technical and organisational measures to protect your personal information
                against unauthorised access, alteration, disclosure, or destruction. However, no method of transmission
                over the Internet is completely secure.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-foreground">Your Rights</h2>
              <p className="mb-4">Under Canadian privacy laws, you have the right to:</p>
              <ul className="list-disc pl-6 mb-8">
                <li>Access your personal information</li>
                <li>Request correction of inaccurate information</li>
                <li>Withdraw consent for marketing communications</li>
                <li>Request deletion of your information (subject to legal requirements)</li>
              </ul>

              {/* Every claim in the next four sections is checked against the code:
                  the site itself sets no cookies (only sessionStorage, which the
                  browser clears with the tab); Google Analytics loads only when
                  VITE_GA4_MEASUREMENT_ID is set and only on dutycleaners.ca, sends
                  page addresses through safePageLocation(), with Google signals and ad
                  personalisation off, not on GPC / Do Not Track browsers, and every
                  event passes filterEventProps() in src/lib/analytics.ts first; and the
                  third parties named below are exactly the external origins the site
                  contacts. If an embed, analytics tag or pixel is ever added, it
                  belongs here too. */}
              <h2 className="text-2xl font-bold mb-4 text-foreground">Cookies and Website Storage</h2>
              <p className="mb-4">
                This website sets no cookies of its own, and we do not use advertising cookies or cross-site
                tracking pixels. Google Analytics, when it is on, sets its own cookies, described in the next
                section, and the third-party services listed further down this page may set theirs. The site
                also stores a small amount of information in your browser's session storage, which your
                browser discards as soon as you close the tab:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  Any <strong>gclid or UTM parameters</strong> in the link you arrived through, so that if you
                  book we can tell which ad or campaign brought you here
                </li>
                <li>Whether you have dismissed the announcement bar, so it stays dismissed</li>
                <li>A flag noting that you have been sent to our booking system, so the page can restore correctly if you come back</li>
              </ul>
              <p className="mb-4">
                One preference is kept in your browser's local storage, which survives closing the tab: the
                office (Edmonton, Calgary or Red Deer) whose pages you last looked at, so that the phone number
                and links in the header stay that office's on pages that belong to no city. It is never sent
                anywhere, and clearing your browser's site data removes it.
              </p>
              <p className="mb-8">
                None of this identifies you personally, and none of it survives the browser session. You can
                also block or clear storage and cookies through your browser settings.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-foreground">Website Analytics</h2>
              <p className="mb-4">
                We may use Google Analytics to count visits to this website and to see how far visitors get
                through the instant-price steps: which city and type of clean a quote was started for, which
                step was reached, whether a price was shown, and whether someone went on to book or tapped a
                phone number or email link. When it is on, Google Analytics sets its own cookies (named _ga)
                in your browser so it can tell a returning browser from a new one, and Google receives your
                IP address and technical details about your browser. We have switched off Google signals and
                ad personalisation for it.
              </p>
              <p className="mb-4">
                We do not send your name, email address, phone number, address, postal code or anything you
                type into a form to Google Analytics. The site removes those details before any analytics
                event leaves your browser, and the phone number or email address in a link you tap is not
                sent either. The page addresses it records have their query string removed, apart from
                ad-campaign tags.
              </p>
              <p className="mb-8">
                Google Analytics does not load at all if your browser sends a Global Privacy Control or Do Not
                Track signal. You can also block or delete its cookies in your browser settings, or install
                Google&rsquo;s{" "}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  Google Analytics opt-out browser add-on
                </a>
                .
              </p>

              <h2 className="text-2xl font-bold mb-4 text-foreground">Third-Party Services on This Website</h2>
              <p className="mb-4">
                Some parts of this site are provided by other companies. When one of these loads, that company
                receives your IP address and technical details about your browser, and may set its own cookies
                under its own privacy policy — not ours:
              </p>
              <ul className="list-disc pl-6 mb-8">
                <li>
                  <strong>BookingKoala</strong> — our online booking system. When you choose a time, we send
                  you to their booking form. See the section below on what travels with you.
                </li>
                <li>
                  <strong>Supabase</strong> — the database behind our own quote relay. Everything you enter in
                  the quote, contact and careers forms is written here first, before it reaches our CRM.
                </li>
                <li>
                  <strong>HighLevel</strong> — our CRM. Nothing of theirs is embedded on this site any more;
                  our relay sends your enquiry to them over their API once you submit it. When you ask for an
                  instant price, the name, email address and phone number you enter go to this customer system
                  with your home&rsquo;s details, so the office can reply to you. If you then continue to
                  booking or ask for a callback, the price you were shown and your notes for the cleaner go
                  there too.
                </li>
                <li>
                  <strong>Google Analytics</strong> — counts visits and quote steps when it is switched on, as
                  described in the Website Analytics section. It receives no names, email addresses, phone
                  numbers or addresses.
                </li>
                <li>
                  <strong>Google Maps</strong> — the service-area map embedded on many of our neighbourhood
                  pages. Loading the page loads the map, and Google receives your IP address and the page you
                  are viewing.
                </li>
                <li>
                  <strong>OpenStreetMap</strong> — supplies the map tiles on our coverage maps, and likewise
                  receives your IP address when those tiles load.
                </li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-foreground">When You Book</h2>
              <p className="mb-8">
                Our booking system is operated by BookingKoala on their own website. When you press the button
                to choose a time, we carry the details you have already given us across to their booking form
                so you do not have to type them twice. Depending on what you filled in, that can include your
                name, email address, phone number, postal code, and any access notes or special instructions
                you wrote for the cleaner. This happens only when you actively choose to continue to booking —
                nothing is sent to BookingKoala while you are simply filling in or reading your quote. Once you
                are on their site, their privacy policy governs the information you enter there.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-foreground">Where Your Information Is Stored</h2>
              <p className="mb-8">
                Duty Cleaners operates in Alberta, but two of the services we rely on are based in the
                United States: BookingKoala, which runs our booking system, and HighLevel, which is our CRM.
                Our own quote relay stores enquiries in Supabase before passing them on. When you book or request a quote, the details you enter (including your
                name, address, phone number, email and any access instructions) are stored and processed
                on servers outside Canada. While your information is in another country it is subject to
                that country&rsquo;s laws, and may be accessible to its courts and government authorities.
                Google Analytics, when it is on, also processes visit data on Google&rsquo;s servers outside
                Canada. Calling us does not necessarily avoid these systems: ask the office which providers
                are needed to record and complete your particular booking before giving your details.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-foreground">How Long We Keep It</h2>
              <p className="mb-8">
                Different records have different purposes and retention periods. We keep financial and tax
                records for the period the law requires. Our systems do not currently delete every quote
                enquiry or customer record on one automatic timer, so some records may remain until you ask
                us to remove them. Ask, and we will delete or anonymize information we no longer need unless
                a law, payment dispute or active booking requires us to keep it &mdash; email our Privacy
                Officer at the address below and we will confirm when the request is complete.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-foreground">Who Is Responsible, and How to Complain</h2>
              <p className="mb-4">
                Alberta&rsquo;s Personal Information Protection Act (PIPA) governs how we handle your
                information, and requires us to name someone accountable for it. That is our Privacy
                Officer, reachable at{" "}
                <a href="mailto:support@dutycleaners.ca" className="text-primary underline">
                  support@dutycleaners.ca
                </a>{" "}
                or on the phone numbers below. Ask us for a copy of what we hold about you, or to correct
                it, and we will respond within 45 days as PIPA requires.
              </p>
              <p className="mb-8">
                If you are not satisfied with how we handle a privacy question, you can complain to the
                Office of the Information and Privacy Commissioner of Alberta at{" "}
                <a href="https://oipc.ab.ca/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                  oipc.ab.ca
                </a>
                . Because some of our processing happens outside Canada, the federal Privacy Commissioner
                at priv.gc.ca may also be able to help.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-foreground">Children's Privacy</h2>
              <p className="mb-8">
                Our services are not directed to individuals under 18. We do not knowingly collect personal
                information from children.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-foreground">Changes to This Policy</h2>
              <p className="mb-8">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting
                the new Privacy Policy on this page and updating the "Last updated" date.
              </p>

              <div className="bg-brand-navy border-2 border-accent/30 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4 text-white">Contact Us</h3>
                <p className="mb-4 text-white/90">
                  If you have questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="mb-1 text-accent font-semibold">Edmonton Office</p>
                    <p className="text-white/80 text-sm">18615 71 Ave NW</p>
                    <p className="text-white/80 text-sm">Edmonton, AB T5T 2V9</p>
                  </div>
                  <div>
                    <p className="mb-1 text-accent font-semibold">Calgary Office</p>
                    <p className="text-white/80 text-sm">2835 37 Street SW #24</p>
                    <p className="text-white/80 text-sm">Calgary, AB T3E 3B3</p>
                  </div>
                </div>
                <div className="space-y-2 border-t border-white/10 pt-4">
                  <a href="mailto:support@dutycleaners.ca" className="flex items-center gap-2 text-accent hover:underline">
                    <Mail className="w-5 h-5" />
                    support@dutycleaners.ca
                  </a>
                  <div className="flex flex-col sm:flex-row sm:gap-6 gap-2">
                    <a href="tel:7809136565" className="flex items-center gap-2 text-accent hover:underline">
                      <span className="dc-icon dc-icon-phone w-5 h-5" aria-hidden="true" />
                      Edmonton: (780) 913-6565
                    </a>
                    <a href="tel:4037681341" className="flex items-center gap-2 text-accent hover:underline">
                      <span className="dc-icon dc-icon-phone w-5 h-5" aria-hidden="true" />
                      Calgary: (403) 768-1341
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <TrustPageCta />
        </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
