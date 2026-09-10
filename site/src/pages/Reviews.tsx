import { REVIEWS, type CityReview } from "@/data/reviews";
import { CITY_PROOF, COMPANY, RATING_CLAIM } from "@/data/proof";
import { HOMES_CLEANED } from "@/data/proof";
import { PROVENANCE } from "@/data/confirmed";
import { POLICY } from "@/data/policy";
import { quoteHrefFor } from "@/lib/quote-link";
import heroReviews from "@/assets/hero-reviews-testimonials.webp";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Star, Quote, Heart, Phone, MapPin, Calculator, CheckCircle2, MessageSquare, ThumbsUp, Award } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { GOOGLE_LISTINGS, openGoogleListing } from "@/lib/google-listings";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";


const ReviewCard = ({ review, index }: {review: CityReview;index: number;}) => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`opacity-0 ${isVisible ? "animate-fade-slide-up" : ""}`}
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}>

      <div
        className="bg-white rounded-xl p-6 border border-border shadow-sm relative group"
        style={{ perspective: "1000px", transformStyle: "preserve-3d" }}>

        <div className="transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-xl group-hover:scale-[1.02]">
          <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/15 transition-transform duration-500 group-hover:rotate-12" />

          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full bg-brand-navy flex items-center justify-center text-white font-bold text-sm shrink-0">
              {review.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-foreground">{review.name}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{review.location}</span>
                <span className="mx-1">·</span>
                <span>{review.date}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-0.5">
              {[...Array(review.rating)].map((_, i) =>
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              )}
            </div>
            {/* Was a green "Verified" tick on every card. Google does not verify
                reviews and neither did we; the source is the honest claim. */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Google review</span>
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed text-sm">
            "{review.text}"
          </p>
        </div>
      </div>
    </div>);

};

const StatCard = ({ icon: Icon, value, label }: {icon: React.ElementType;value: string;label: string;}) =>
<div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10">
    <Icon className="w-8 h-8 text-accent mx-auto mb-3" />
    <p className="text-3xl font-bold text-white mb-1">{value}</p>
    <p className="text-white/90 text-sm">{label}</p>
  </div>;


/**
 * Verbatim customer reviews, transcribed from the business's public Google
 * profile (the same eight that ran on the previous dutycleaners.ca /reviews
 * page, which is the source of record).
 *
 * These render inside quotation marks under a "Verified" badge, so the words
 * MUST be the reviewer's own. They previously were not: seven of the eight had
 * been rewritten into shorter marketing paraphrase, and one was additionally
 * re-attributed to a person who never wrote it ("Linny 84" was displayed as
 * "Sarah M."). Quoting someone saying something they did not say is the same
 * problem as an invented testimonial, only harder to spot.
 *
 * Rules for editing this list:
 *   - Text is verbatim. Shorten only by truncating at a sentence boundary and
 *     marking it with [...]. Never reword, merge or "tighten" a quote.
 *   - Surnames are reduced to an initial for privacy; the person is never
 *     swapped. Google display handles are left exactly as written.
 */
// The list lives in src/data/reviews.ts so the homepages and this page
// cannot drift apart. Add a review there, not here.
const reviews = REVIEWS;

/**
 * Reviews grouped by the service the reviewer names. Where the text does not
 * say which service it was, the review sits under its city. The grouping is
 * read from the review's own words, never assigned by hand, so a new review
 * added to reviews.ts lands in the right place.
 */
type GroupId = "move" | "recurring" | "post-construction" | "calgary" | "edmonton";

const groupOf = (review: CityReview): GroupId => {
  const text = review.text;
  if (/move[- ]?(in|out)|moving out/i.test(text)) return "move";
  if (/every 4 weeks|once a month|every month|weekly|bi-weekly/i.test(text)) return "recurring";
  if (/post[- ]construction|reno\b|renovation/i.test(text)) return "post-construction";
  return review.location.toLowerCase().startsWith("calgary") ? "calgary" : "edmonton";
};

const GROUPS: { id: GroupId; heading: string; intro: string; links: { to: string; label: string }[] }[] = [
  {
    id: "move",
    heading: "Move-out cleaning reviews",
    intro: "Cleaned empty, to the standard an inspection looks for: inside the oven, fridge, cabinets and closets, on top of the deep checklist.",
    links: [
      { to: "/move-out-cleaning-edmonton/", label: "move-out cleaning in Edmonton" },
      { to: "/move-out-cleaning-calgary/", label: "move-out cleaning in Calgary" },
    ],
  },
  {
    id: "recurring",
    heading: "Recurring cleaning reviews",
    intro: "Weekly, bi-weekly or every 4 weeks, with the recurring discount applied from the second visit.",
    links: [
      { to: "/edmonton/recurring-cleaning/", label: "recurring cleaning in Edmonton" },
      { to: "/calgary/recurring-cleaning/", label: "recurring cleaning in Calgary" },
    ],
  },
  {
    id: "post-construction",
    heading: "Post-construction cleaning reviews",
    intro: "Dust from a renovation settles on every surface in the house, so this clean is priced by floor area rather than bedroom count.",
    links: [
      { to: "/post-construction-cleaning/", label: "post-construction cleaning in Edmonton" },
      { to: "/post-construction-cleaning-calgary/", label: "post-construction cleaning in Calgary" },
    ],
  },
  {
    id: "calgary",
    heading: "Calgary house cleaning reviews",
    intro: "Reviews from the Calgary office where the reviewer did not say which service they booked.",
    links: [
      { to: "/calgary/regular-cleaning/", label: "standard cleaning in Calgary" },
      { to: "/calgary/deep-cleaning/", label: "deep cleaning in Calgary" },
    ],
  },
  {
    id: "edmonton",
    heading: "Edmonton house cleaning reviews",
    intro: "Reviews from the Edmonton office where the reviewer did not say which service they booked.",
    links: [
      { to: "/edmonton/regular-cleaning/", label: "standard cleaning in Edmonton" },
      { to: "/edmonton/deep-cleaning/", label: "deep cleaning in Edmonton" },
    ],
  },
];

/**
 * The day both Google listings were read, taken from the provenance recorded
 * beside each figure in proof.ts rather than typed here. A review count is only
 * checkable if the reader knows when it was checked.
 */
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const LISTING_READ_ON =
  PROVENANCE.find((p) => p.by === "google-listing" && p.value === CITY_PROOF.edmonton.googleReviewCount)?.on ??
  PROVENANCE.find((p) => p.by === "google-listing")?.on ??
  "";
const [readYear, readMonth, readDay] = LISTING_READ_ON.split("-");
/** "1 September 2026", or "" when nothing recorded the date — then say nothing. */
const READ_ON_LABEL = readMonth
  ? `${Number(readDay)} ${MONTH_NAMES[Number(readMonth) - 1]} ${readYear}`
  : "";

const TITLE = `Duty Cleaners Reviews | ${RATING_CLAIM}, Edmonton & Calgary`;
const DESCRIPTION = `House cleaning rated ${CITY_PROOF.edmonton.googleRating} on Google in Edmonton and Calgary. Read what Alberta homeowners say about Duty Cleaners before you book.`;

export default function Reviews() {
  // Title is owned by <Helmet> below. A useEffect that also set document.title
  // raced it with a *different* string ("Client Reviews" vs "Customer Reviews"),
  // so which one shipped depended on effect ordering.
  const { pathname } = useLocation();
  const grouped = GROUPS.map((group) => ({
    ...group,
    reviews: reviews.filter((review) => groupOf(review) === group.id),
  })).filter((group) => group.reviews.length > 0);

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href="https://dutycleaners.ca/reviews/" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/reviews/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        {/* No AggregateRating or Review markup, on purpose. Google treats
            self-serving review markup on a business's own site as a manual-
            action risk, and the rating is checkable on the profiles linked
            below instead. */}
      </Helmet>
      <Navigation />
      <main id="main-content" tabIndex={-1}>
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Image */}
        <img
          src={heroReviews}
          alt="Clean modern home interior"
          className="absolute inset-0 w-full h-full object-cover"
          width={1536}
          height={1024}
         loading="eager" fetchPriority="high"/>
        {/* Navy gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/90 via-brand-navy/70 to-brand-navy/40" />
        {/* Decorative blur elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/10">
              <MessageSquare className="w-4 h-4 text-accent" />
              <span className="text-white/90 text-sm font-medium">Quoted from Google, word for word</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Duty Cleaners Reviews
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Every review on this page is copied from our Google profiles in Edmonton and
              Calgary without a word changed, and each profile is linked below so you can check.
            </p>

            <div className="flex items-center justify-center gap-2 mb-2">
              {[...Array(5)].map((_, i) =>
              <Star key={i} className="w-7 h-7 fill-yellow-400 text-yellow-400" />
              )}
              <span className="text-2xl font-bold text-white ml-2">{RATING_CLAIM}</span>
            </div>
            <p className="text-white/90 text-sm">
              {CITY_PROOF.edmonton.googleReviewCount} reviews on the Edmonton Google listing,{" "}
              {CITY_PROOF.calgary.googleReviewCount} on the Calgary one
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
            <StatCard icon={Star} value={String(CITY_PROOF.edmonton.googleRating)} label="Rating on Google" />
            <StatCard icon={ThumbsUp} value={HOMES_CLEANED.alberta} label="Alberta Homes Cleaned" />
            {/* Was value="100%" label="Satisfaction Rate". A "rate" reads as a measured
            outcome, and nothing measures it -- proof.ts has rebookRate: null. It also
            sat directly above "4.9 out of 5" on this page, which refutes it: a 4.9 mean
            necessarily includes customers who rated below five. This states the promise
            the company actually honours instead. */}
            {/* This page was the only one of the 177 showing the guarantee badge that never
            said what the guarantee is. A badge reading "100% Satisfaction Guarantee" on its
            own invites the reader to hear "money back", and the guarantee is a return visit. */}
            <StatCard icon={Award} value={`${POLICY.guaranteeWindowHours}-Hour`} label="Re-Clean Guarantee" />
            <StatCard icon={Heart} value={String(COMPANY.foundedYear)} label="Serving Alberta Since" />
          </div>
        </div>
      </section>

      {/* Reviews, grouped by the service the reviewer names */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Grouped by the service the reviewer describes, so you can read the ones about the
              clean you are pricing. Where a review does not say, it sits under its city.
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-16">
            {grouped.map((group) => (
              <div key={group.id}>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{group.heading}</h2>
                <p className="text-muted-foreground mb-8 max-w-3xl">
                  {group.intro} Prices by home size are on{" "}
                  {group.links.map((link, index) => (
                    <span key={link.to}>
                      <Link to={link.to} className="text-primary underline underline-offset-2">
                        {link.label}
                      </Link>
                      {index < group.links.length - 1 ? " and " : "."}
                    </span>
                  ))}
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.reviews.map((review, index) =>
                  <ReviewCard key={review.name + review.date} review={review} index={index} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where the numbers come from.

          This block used to be dressed as Google's own review widget: the
          four-colour Google mark, a 4.9 in 48-point type, "287 reviews across
          both cities" and the line "Powered by Google". Two things were wrong
          with it. "Powered by Google" is Google's attribution for a widget
          Google serves, and this was our markup. And 287 is our addition of two
          listings; Google reports each profile on its own and publishes no such
          total, so a reader who clicked through to check found 236 or 51 and
          neither matched. The numbers below are the two Google does publish,
          with the date they were read and a link to each profile. */}
      <section className="py-20 bg-brand-navy relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 md:p-10 border border-border shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Where these reviews come from
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                One Google Business Profile per office{READ_ON_LABEL ? `, both read on ${READ_ON_LABEL}` : ""}. The
                Edmonton listing stood at {CITY_PROOF.edmonton.googleRating} out of 5 from{" "}
                {CITY_PROOF.edmonton.googleReviewCount} reviews, and the Calgary listing at{" "}
                {CITY_PROOF.calgary.googleRating} from {CITY_PROOF.calgary.googleReviewCount}. Google
                keeps the two counts separate and publishes no combined figure, so those are the numbers
                to check us against. Both links open the profiles themselves.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {(["edmonton", "calgary"] as const).map((key) => (
                  <a
                    key={key}
                    href={GOOGLE_LISTINGS[key].reviewsUrl}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                     onClick={(event) => openGoogleListing(event, GOOGLE_LISTINGS[key].reviewsUrl)}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 px-4 text-center text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    The {CITY_PROOF[key].city} listing on Google
                  </a>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Every quote on this page is on one of those two profiles, word for word.
              </p>

            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-brand-navy rounded-2xl p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-56 h-56 bg-accent/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <Calculator className="w-10 h-10 text-accent mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                See your own price before you book
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                {CITY_PROOF.edmonton.googleReviewCount} reviews on the Edmonton listing and{" "}
                {CITY_PROOF.calgary.googleReviewCount} on the Calgary one, {CITY_PROOF.edmonton.googleRating} out
                of 5 on each. The price takes about a minute to see, and you
                pay after the clean. The full tables are on{" "}
                <Link to="/pricing/" className="text-accent underline underline-offset-2">
                  the full Edmonton price list
                </Link>{" "}
                and{" "}
                <Link to="/calgary/pricing/" className="text-accent underline underline-offset-2">
                  Calgary house cleaning prices by home size
                </Link>
                , with{" "}
                <Link to="/whats-included/" className="text-accent underline underline-offset-2">
                  what's included
                </Link>{" "}
                spelled out per service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={quoteHrefFor(pathname)}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors shadow-lg">
                  <Calculator className="w-4 h-4" />
                  See My Instant Price
                </a>
                <a
                  href={CITY_PROOF.edmonton.phoneLink}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-brand-navy font-semibold rounded-lg hover:bg-white/90 transition-colors shadow-lg">
                  <Phone className="w-4 h-4" />
                  Edmonton: {CITY_PROOF.edmonton.phone}
                </a>
                <a
                  href={CITY_PROOF.calgary.phoneLink}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-brand-navy font-semibold rounded-lg hover:bg-white/90 transition-colors shadow-lg">
                  <Phone className="w-4 h-4" />
                  Calgary: {CITY_PROOF.calgary.phone}
                </a>
              </div>
              <p className="mt-6 text-sm text-white/70">
                A clean also works as a present:{" "}
                <Link to="/gift-card/" className="text-accent underline underline-offset-2">
                  give a clean as a gift
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Until now there was no way to leave a review anywhere on 209 pages: the
          code stored only Google's numeric CID, which cannot build a review
          link — you need the Place ID. Review recency and a steady flow of new
          reviews are now among the strongest local ranking factors, and the
          newest review displayed here dates from February 2025. This gives a
          happy customer somewhere to go. */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Cleaned with us recently? Leave a review
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Reviews are how most people find us, and they are the fairest test of whether we did the
              job properly. If you have a minute, it genuinely helps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {(["edmonton", "calgary"] as const).map((key) => (
                <a
                  key={key}
                  href={GOOGLE_LISTINGS[key].writeReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <Star className="w-4 h-4" aria-hidden="true" />
                  Review our {key === "edmonton" ? "Edmonton" : "Calgary"} team
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      </main>

      <Footer />
    </div>);

}
