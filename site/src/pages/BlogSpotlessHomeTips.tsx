import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Calendar, Clock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import heroImage from "@/assets/blog/family-household.jpg";
import bedroomImage from "@/assets/blog/daily-cleaning-bedroom.jpg";
import floorImage from "@/assets/blog/weekly-cleaning-floor.jpg";

/**
 * Replaces the old WordPress post "/1948/house-cleaning-tips-for-a-spotless-
 * home-environment/" — 2,323 impressions over 16 months with no successor in
 * the rebuild (it redirected to the generic /blog index, losing all topical
 * relevance). Written fresh against the same topic rather than scraped —
 * the original was serviceable but generic; this version is specific to how
 * our own crews actually work.
 */

const DAILY_HABITS = [
  { title: "Make the bed", body: "Thirty seconds, and it resets how the whole room reads for the rest of the day." },
  { title: "Wipe counters and the sink", body: "Kitchen counters and the bathroom sink, right after you use them — this is what actually stops grime from building up, not a weekly scrub." },
  { title: "Run a quick sweep or vacuum", body: "Just the high-traffic strip — entryway, kitchen floor, in front of the couch. Two minutes, not the whole house." },
  { title: "Put things back where they live", body: "A five-minute reset before bed. If an item does not have a \"home,\" that is a sign it needs one — or needs to go." },
  { title: "Deal with spills immediately", body: "Every spill is easiest to clean in the first sixty seconds and hardest after it dries. This one habit prevents more staining than any product." },
];

const ROOM_GUIDE = [
  {
    room: "Kitchen",
    focus: "Appliance exteriors, countertops and the floor pick up grease fastest, so they need the most frequent attention.",
    detail: "Wipe stovetop and counters after cooking, not after they've had a day to set. Cabinet fronts and the microwave interior are the two spots people forget most.",
  },
  {
    room: "Bathroom",
    focus: "Hard water and daily use mean this room needs disinfecting attention, not just wiping.",
    detail: "Tile, sink and toilet need a real clean weekly at minimum. Shower glass and taps benefit from a quick wipe-down after each use — it is far easier than removing built-up scale later.",
  },
  {
    room: "Bedrooms",
    focus: "Dust and allergens settle on surfaces and in bedding faster than most people expect.",
    detail: "Dust surfaces before vacuuming, not after — otherwise you're just resettling dust onto a floor you already cleaned. Rotate bed linens weekly.",
  },
  {
    room: "Living areas",
    focus: "High-touch points — light switches, remotes, door handles — are the most-missed spots in a normal cleaning routine.",
    detail: "Dust and vacuum on a regular schedule, and don't skip the high-touch surfaces just because they don't look visibly dirty.",
  },
];

const FAQS = [
  {
    q: "What is the single most effective habit for keeping a home clean?",
    a: "Cleaning up spills and messes the moment they happen. It takes seconds in the moment and prevents the staining and buildup that turns a quick wipe into a scrubbing job later.",
  },
  {
    q: "Should I declutter before or after cleaning?",
    a: "Before. Cleaning around clutter means re-cleaning the same surfaces once the clutter finally gets moved. Sort one room at a time into keep, donate and discard before you pick up a cloth.",
  },
  {
    q: "How often should each room actually get cleaned?",
    a: "Kitchens and bathrooms need weekly attention at minimum because of grease and hard water. Bedrooms and living areas can usually stretch to every one to two weeks if daily habits — bed made, surfaces wiped, floor swept — are already in place.",
  },
  {
    q: "What is the fastest way to build a cleaning schedule that actually sticks?",
    a: "Split tasks into daily (two minutes), weekly (thirty to sixty minutes), and monthly (the bigger jobs — baseboards, behind appliances, windows). Most people fail at cleaning schedules by trying to do the monthly-tier tasks every week.",
  },
  {
    q: "Are natural ingredients like vinegar and baking soda enough on their own?",
    a: "For most everyday cleaning, yes — see our full breakdown in Cleaning with Vinegar and Baking Soda. Where they fall short is disinfecting and heavy grease, which still call for a purpose-made product.",
  },
];

export default function BlogSpotlessHomeTips() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const canonical = "https://dutycleaners.ca/blog/spotless-home-tips/";
  const title = "House Cleaning Tips for a Spotless Home Environment";
  const description =
    "Practical, low-effort habits for keeping a home consistently clean — daily routines, a room-by-room guide, and how to build a cleaning schedule that actually sticks. From the professional cleaners at Duty Cleaners.";

  return (
    <>
      <Helmet>
        <title>{`${title} | Duty Cleaners`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={`${title} | Duty Cleaners`} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonical} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description,
          image: "https://dutycleaners.ca/og-image.jpg",
          datePublished: "2026-08-24",
          dateModified: "2026-08-24",
          author: { "@type": "Organization", name: "Duty Cleaners", url: "https://dutycleaners.ca/" },
          publisher: {
            "@type": "Organization",
            name: "Duty Cleaners",
            logo: { "@type": "ImageObject", url: "https://dutycleaners.ca/logo.png" },
          },
          mainEntityOfPage: canonical,
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>

        {/* Hero */}
        <section className="relative pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Link to="/blog">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>

            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                  Cleaning Tips
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  August 24, 2026
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  8 min read
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
                House Cleaning Tips for a Spotless Home Environment
              </h1>

              <p className="text-xl text-muted-foreground mb-8">
                A spotless home isn't the result of one big weekend clean — it's a handful of small
                habits, done consistently, plus a schedule that keeps the bigger jobs from piling up.
              </p>

              <div className="aspect-video rounded-2xl overflow-hidden mb-12">
                <img
                  width={1920}
                  height={1080}
                  src={heroImage}
                  alt="A tidy, well-organized living space in an Alberta home"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Most people picture "keeping a clean home" as a big Saturday-morning production —
                  every room at once, a few hours lost to it. In practice, the homes that stay clean
                  aren't cleaned harder. They're cleaned in smaller, more frequent passes, so nothing
                  ever gets the chance to pile up into a project.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  Here's the approach that actually holds up: declutter first, build a simple schedule,
                  keep a short list of daily habits, and know which rooms need more frequent attention
                  than others.
                </p>
              </div>

              {/* Declutter first */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                  Start by decluttering, not scrubbing
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Cleaning around clutter means cleaning the same surface twice — once now, and again
                  once the clutter finally moves. Before you pick up a cloth, sort one room at a time
                  into keep, donate, and discard. Fewer things on a surface means less to clean around,
                  and a visibly tidier room even before any actual cleaning starts.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This is also the step that makes everything after it faster — a decluttered kitchen
                  counter takes thirty seconds to wipe; a cluttered one takes five minutes of moving
                  things out of the way first.
                </p>
              </div>

              {/* Daily habits */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                  Five daily habits that prevent most of the work
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  None of these take more than a couple of minutes, and together they are the reason
                  some homes never seem to need a big clean.
                </p>
                <div className="space-y-4">
                  {DAILY_HABITS.map((h) => (
                    <div key={h.title} className="flex gap-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{h.title}</h3>
                        <p className="text-muted-foreground text-sm">{h.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cleaning schedule */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                  Build a schedule with three tiers, not one
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Most cleaning schedules fail because they try to do everything every week. Split
                  tasks into three tiers instead:
                </p>
                <ul className="space-y-2 text-muted-foreground mb-4">
                  <li>• <strong className="text-foreground">Daily</strong> — the five habits above. Two minutes, done automatically.</li>
                  <li>• <strong className="text-foreground">Weekly</strong> — vacuuming, mopping, bathroom and kitchen deep-wipe, dusting. Thirty to sixty minutes.</li>
                  <li>• <strong className="text-foreground">Monthly</strong> — baseboards, behind and under appliances, window tracks, light fixtures. The jobs that don't need weekly attention but do need to happen eventually.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  If you're building this from scratch, our own{" "}
                  <Link to="/whats-included" className="text-primary hover:underline font-medium">
                    cleaning checklist
                  </Link>{" "}
                  is a reasonable starting template — it's the same breakdown our crews work from.
                </p>
              </div>

              {/* Room by room */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  Which rooms need more frequent attention
                </h2>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <img
                      width={1024}
                      height={576}
                      src={bedroomImage}
                      alt="A clean, well-organized bedroom"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <img
                      width={1024}
                      height={576}
                      src={floorImage}
                      alt="Freshly cleaned hardwood floor"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  {ROOM_GUIDE.map((r) => (
                    <div key={r.room} className="border border-border rounded-xl p-5 bg-card">
                      <h3 className="font-bold text-foreground mb-1">{r.room}</h3>
                      <p className="text-sm font-semibold text-accent mb-2">{r.focus}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{r.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tough stains */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                  A quick note on tough stains
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Speed matters more than product for most stains. Blot — don't rub — coffee and wine
                  spills immediately to lift excess liquid before it sets. For grease, baking soda left
                  to sit for a few minutes before wiping or vacuuming does most of the work. And always
                  test any cleaning solution on a hidden patch first if the surface is delicate — the
                  full method is in{" "}
                  <Link to="/cleaning-with-vinegar-and-baking-soda" className="text-primary hover:underline font-medium">
                    Cleaning with Vinegar and Baking Soda
                  </Link>.
                </p>
              </div>

              {/* FAQ */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  Common questions
                </h2>
                <div className="space-y-4">
                  {FAQS.map((f) => (
                    <div key={f.q} className="border border-border rounded-xl p-5 bg-card">
                      <h3 className="font-bold text-foreground mb-2">{f.q}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">Keep reading</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Link
                    to="/the-top-5-must-have-cleaning-products-for-a-spotless-home"
                    className="block p-5 border border-border rounded-xl bg-card hover:border-accent transition-colors"
                  >
                    <h3 className="font-bold text-foreground">The Top 5 Must-Have Cleaning Products</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      The five products our cleaners actually carry — and what you can stop buying.
                    </p>
                  </Link>
                  <Link
                    to="/blog/cleaning-schedule"
                    className="block p-5 border border-border rounded-xl bg-card hover:border-accent transition-colors"
                  >
                    <h3 className="font-bold text-foreground">A House Cleaning Schedule That Does Not Overwhelm You</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      A more detailed breakdown of the three-tier schedule above.
                    </p>
                  </Link>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  Or hand the whole thing off
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  If the schedule above sounds like more than you want to manage yourself, our crews
                  handle it on a recurring basis — weekly, bi-weekly or monthly. See your price in
                  about 60 seconds, and pay only after the clean is done.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/#quote">
                    <Button size="lg" variant="accent" className="w-full sm:w-auto min-h-[52px] text-base font-bold">
                      See My Instant Price — Edmonton
                    </Button>
                  </Link>
                  <Link to="/cleaning-services-calgary#quote">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto min-h-[52px] text-base font-semibold">
                      See My Instant Price — Calgary
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
