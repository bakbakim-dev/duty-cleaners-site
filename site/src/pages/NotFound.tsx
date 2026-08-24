import { Link, useLocation } from "react-router-dom";
import { canonicalForPath } from "@/data/legacy-urls";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

/**
 * A 404 used to be a hard exit: one text link and no branding. Anyone landing
 * here from a stale search result or an old flyer now keeps the full site
 * chrome, the phone number and a route straight into the quote funnel.
 */
const POPULAR = [
  { label: "Edmonton house cleaning", to: "/" },
  { label: "Calgary house cleaning", to: canonicalForPath("/calgary") },
  { label: "Pricing", to: canonicalForPath("/edmonton/pricing") },
  { label: "What's included", to: "/whats-included" },
  { label: "Move in / move out cleaning", to: "/edmonton/move-in-move-out-cleaning" },
  { label: "Deep cleaning", to: "/edmonton/deep-cleaning" },
  { label: "Reviews", to: "/reviews" },
  { label: "Contact us", to: canonicalForPath("/contact") },
];

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>Page not found | Duty Cleaners</title>
        <meta name="description" content="That page has moved. Find Duty Cleaners house cleaning in Edmonton and Calgary, or get an instant price in about a minute." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />

        <main id="main-content" tabIndex={-1} className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">404</p>
            <h1 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">
              That page has moved or never existed
            </h1>
            <p className="mx-auto mt-4 max-w-[60ch] text-lg text-muted-foreground">
              Sorry about that. You can still get your price in about a minute, or call us and we'll
              point you to the right place.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" variant="accent" className="min-h-[52px] text-base font-bold">
                <Link to="/#quote">
                  See My Instant Price
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="min-h-[52px] text-base font-semibold">
                <a href="tel:7809136565">
                  <Phone className="mr-2 h-5 w-5" aria-hidden="true" />
                  (780) 913-6565
                </a>
              </Button>
            </div>
          </div>

          <div className="mx-auto mt-14 max-w-2xl">
            <h2 className="mb-4 text-center text-lg font-semibold text-foreground">Popular pages</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {POPULAR.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="flex min-h-[48px] items-center rounded-lg border border-border bg-card px-4 font-medium text-foreground transition-colors hover:border-brand-navy hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default NotFound;
