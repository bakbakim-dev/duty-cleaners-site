import { Helmet } from "react-helmet-async";
import { POLICY } from "@/data/policy";
import { Link } from "react-router-dom";
import { canonicalForPath } from "@/data/legacy-urls";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import TrustPageCta from "@/components/TrustPageCta";
import { Shield, CheckCircle2, Phone, Mail } from "lucide-react";

const TITLE = `${POLICY.guaranteeWindowHours}-Hour Re-Clean Guarantee | Duty Cleaners`;
const DESCRIPTION = `If something was missed in your Duty Cleaners clean, tell us within ${POLICY.guaranteeWindowHours} hours and we come back and re-clean it at no charge.`;

export default function SatisfactionGuarantee() {
  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href="https://dutycleaners.ca/satisfaction-guarantee/" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/satisfaction-guarantee/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
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
                <Shield className="w-10 h-10 text-accent" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">Our {POLICY.guaranteeWindowHours}-Hour Re-Clean Guarantee</h1>
              <p className="text-lg text-white/85">
                The guarantee is a return visit: if something was missed, the team comes back and re-cleans it at no charge.
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <h2 className="text-2xl font-bold mb-4 text-foreground">How the re-clean guarantee works</h2>
              <p className="mb-6">
                The guarantee applies to every clean from the Edmonton, Calgary and Red Deer offices, whichever
                service you booked, including a clean paid for with a gift card.
              </p>

              <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-bold mb-4 text-primary">The Duty Cleaners Guarantee</h3>
                <p className="mb-4">
                  If something in your service scope was missed or not done well, contact us within{" "}
                  <strong>{POLICY.guaranteeWindowHours} hours</strong> of your appointment and we will:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Return to your home and re-clean the areas of concern at <strong>no additional cost</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Address any specific issues you identify within your scheduled cleaning scope</span>
                  </li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold mb-4 text-foreground">How to Request a Re-Clean</h2>
              <ol className="list-decimal pl-6 space-y-3 mb-8">
                <li>Contact us within {POLICY.guaranteeWindowHours} hours of your cleaning appointment</li>
                <li>Describe the specific areas or items that were missed or not done well</li>
                {/* Photos are a favour, not a condition — confirmed by the owner.
                    As a bare numbered step this read as mandatory, which is how
                    llms.txt ended up telling AI assistants a photo was "required". */}
                <li>
                  If you can, send photos of the areas that were missed — it helps the team
                  know exactly what to put right. They are not required, and a phone call
                  describing the problem is enough.
                </li>
                <li>We book a return visit at a time that suits you</li>
                <li>The team re-cleans the areas you named at no extra charge</li>
              </ol>

              <h2 className="text-2xl font-bold mb-4 text-foreground">What's Covered</h2>
              <ul className="space-y-2 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>All services included in your original cleaning package</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Missed spots or areas within the service scope</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Quality concerns with completed work</span>
                </li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-foreground">Exclusions</h2>
              <p className="mb-4">
                The guarantee covers services within your original booking. The following are not covered:
              </p>
              <ul className="space-y-2 mb-8">
                <li>• Services not included in the original cleaning package</li>
                <li>• Pre-existing stains, damage, or permanent discolouration</li>
                {/* This said 48 hours while the promise at the top of the same page
                    — and roughly 100 other surfaces — said 24, so a customer calling
                    at 30 hours could not tell whether they were covered. The owner
                    has confirmed 24, and this now reads from policy.ts, the single
                    place the window is defined. */}
                <li>• Issues reported more than {POLICY.guaranteeWindowHours} hours after the cleaning</li>
                <li>• Normal dust accumulation after cleaning completion</li>
              </ul>

              {/*
                This page was 314 words of main content — the thinnest page on
                the site after /contact-us/, and the destination every "100%
                Satisfaction Guarantee" badge points at. The questions below are
                the ones the guarantee genuinely raises and the page did not
                answer: what the remedy is, what it is not, why the window is
                what it is, and where a damage claim goes instead. Every figure
                reads from policy.ts.
              */}
              <h2 className="text-2xl font-bold mb-4 text-foreground">What the guarantee is, and what it isn't</h2>
              <p className="mb-4">
                The remedy is a return visit. If something in your service scope was missed or
                not done well, we come back and clean it again at no additional charge — that is
                the whole of it, and it is deliberately the whole of it. We do not describe this
                as a money-back guarantee, because a refund is not what we are promising. If a
                re-clean is not what you want, call and say so and we will talk about it, but the
                commitment on this page is the return visit.
              </p>
              <p className="mb-4">
                It is also not a guarantee about someone else's decision. Move-out customers ask
                whether we guarantee the security deposit comes back, and we do not: the landlord
                decides, and that assessment can turn on things that have nothing to do with
                cleaning. What we will do, if you tell us within {POLICY.guaranteeWindowHours} hours
                of the clean, is come back and re-clean anything in the service scope that was
                missed, which is the part that is ours.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-foreground">
                Why {POLICY.guaranteeWindowHours} hours
              </h2>
              <p className="mb-4">
                A cleaned home starts collecting dust, prints and traffic the moment it is
                finished, and after a few days there is no honest way to separate what was missed
                from what has happened since. {POLICY.guaranteeWindowHours} hours is short enough
                that both of us are looking at the same room. It is the window everywhere on this
                site — if you find a page that says anything else, that page is wrong and we would
                like to know.
              </p>
              <p className="mb-8">
                Photos help us brief the team on what to look for, but they are not a condition.
                A phone call describing what was missed is enough.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-foreground">If something was damaged</h2>
              <p className="mb-8">
                That is a different process from this one and it has its own deadline.{" "}
                {POLICY.liabilityNote} The full terms, including cancellation, lockout and
                liability, are set out on our{" "}
                <Link to={canonicalForPath("/terms")} className="text-accent underline underline-offset-2">
                  terms of service
                </Link>
                .
              </p>

              <h2 className="text-2xl font-bold mb-4 text-foreground">Fewer reasons to need this</h2>
              <p className="mb-8">
                A re-clean is less likely when the booking matches the home. A standard clean booked
                for a home that needed a deep one, or an add-on everyone assumed was included, leaves
                work outside the scope, and the guarantee covers the scope. Two pages head that off:{" "}
                <Link to={canonicalForPath("/whats-included")} className="text-accent underline underline-offset-2">
                  what's included
                </Link>{" "}
                lists the scope of each service and what falls outside it, and{" "}
                <Link to={canonicalForPath("/prepare")} className="text-accent underline underline-offset-2">
                  how to prepare
                </Link>{" "}
                covers the few things that stop a team getting to a surface at all. If the home has not
                had a proper clean in a while, read about{" "}
                <Link to="/edmonton/deep-cleaning/" className="text-accent underline underline-offset-2">
                  deep cleaning in Edmonton
                </Link>{" "}
                or{" "}
                <Link to="/calgary/deep-cleaning/" className="text-accent underline underline-offset-2">
                  deep cleaning in Calgary
                </Link>{" "}
                before you book.
              </p>

              <div className="bg-accent/10 border-2 border-accent/20 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-foreground">Contact Us</h3>
                <p className="mb-4">
                  To request a re-clean or discuss any concerns:
                </p>
                <div className="space-y-2">
                  <a href="tel:7809136565" className="flex items-center gap-2 text-accent hover:underline">
                    <Phone className="w-5 h-5" />
                    Edmonton: (780) 913-6565
                  </a>
                  <a href="tel:4037681341" className="flex items-center gap-2 text-accent hover:underline">
                    <Phone className="w-5 h-5" />
                    Calgary: (403) 768-1341
                  </a>
                  <a href="mailto:support@dutycleaners.ca" className="flex items-center gap-2 text-accent hover:underline">
                    <Mail className="w-5 h-5" />
                    support@dutycleaners.ca
                  </a>
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
