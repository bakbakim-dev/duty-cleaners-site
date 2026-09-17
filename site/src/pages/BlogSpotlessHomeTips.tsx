import { modifiedOr, publishedFor } from "@/data/post-published";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { modifiedFor } from "@/data/post-dates";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import heroImage from "@/assets/blog/family-household.webp";
import bedroomImage from "@/assets/blog/daily-cleaning-bedroom.webp";
import floorImage from "@/assets/blog/weekly-cleaning-floor.webp";

/**
 * Replaces the old WordPress post "/1948/house-cleaning-tips-for-a-spotless-
 * home-environment/" — 2,323 impressions over 16 months with no successor in
 * the rebuild (it redirected to the generic /blog index, losing all topical
 * relevance). Written fresh against the same topic rather than scraped —
 * the original was serviceable but generic; this version is specific to how
 * our own crews actually work.
 */

const DAILY_HABITS = [
  { title: "Make the bed", body: "It takes thirty seconds, and it changes how the whole room looks for the rest of the day." },
  { title: "Wipe counters and the sink", body: "Wipe the kitchen counters and the bathroom sink right after you use them. That stops grime from building up far better than a weekly scrub does." },
  { title: "Run a quick sweep or vacuum", body: "Do just the high-traffic strip: the entryway, the kitchen floor and the patch in front of the couch. It takes a couple of minutes." },
  { title: "Put things back where they live", body: "Spend five minutes resetting the house before bed. If an item has no \"home\", that is a sign it needs one, or needs to go." },
  { title: "Deal with spills immediately", body: "A spill is easiest to clean while it is still wet and hardest once it dries. This one habit prevents more staining than any product." },
];

const ROOM_GUIDE = [
  {
    room: "Kitchen",
    focus: "Appliance exteriors, countertops and the floor pick up grease fastest, so they need the most frequent attention.",
    detail: "Wipe the stovetop and counters after cooking, before the grease has a day to set. Cabinet fronts and the inside of the microwave are easy to forget.",
  },
  {
    room: "Bathroom",
    focus: "Hard Alberta water leaves mineral scale on taps and shower glass, and daily use adds soap scum, so this room needs more than a quick wipe.",
    detail: "Tile, sink and toilet need a proper clean at least once a week. A quick wipe of the shower glass and taps after each use is far easier than removing built-up scale later.",
  },
  {
    room: "Bedrooms",
    focus: "Dust settles on flat surfaces and in bedding, so bedrooms need regular dusting as well as vacuuming.",
    detail: "Dust surfaces before you vacuum, so the dust you knock down lands on a floor you have not cleaned yet. Wash bed linens weekly.",
  },
  {
    room: "Living areas",
    focus: "High-touch points such as light switches, remotes and door handles are easy to miss in a normal cleaning routine.",
    detail: "Dust and vacuum on a regular schedule, and wipe the high-touch surfaces even when they do not look dirty.",
  },
];

const FAQS = [
  {
    q: "What is the single most effective habit for keeping a home clean?",
    a: "Cleaning up spills and messes the moment they happen saves the most work. It takes seconds at the time and prevents the staining and build-up that turn a quick wipe into a scrubbing job later.",
  },
  {
    q: "Should I declutter before or after cleaning?",
    a: "Declutter before you clean. Cleaning around clutter means re-cleaning the same surfaces once the clutter finally gets moved. Sort one room at a time into keep, donate and discard before you pick up a cloth.",
  },
  {
    q: "How often should each room get cleaned?",
    a: "Kitchens and bathrooms need attention at least once a week, because grease builds up in a kitchen and hard water leaves scale in a bathroom. Bedrooms and living areas can usually stretch to every one to two weeks, as long as the daily habits of making the bed, wiping surfaces and sweeping the floor are already in place.",
  },
  {
    q: "What is the fastest way to build a cleaning schedule that sticks?",
    a: "Split household tasks into three tiers: daily habits of a couple of minutes, weekly jobs of thirty to sixty minutes, and monthly jobs such as baseboards, behind appliances and window tracks. A schedule that tries to fit the monthly jobs into every week is the one that gets abandoned.",
  },
  {
    q: "Are natural ingredients like vinegar and baking soda enough on their own?",
    a: "Vinegar and baking soda handle a lot of everyday cleaning. Vinegar dissolves the mineral scale that hard Alberta water leaves on taps and shower glass, and baking soda is a mild abrasive for sinks and tubs. Neither replaces a purpose-made product for heavy grease or disinfecting, and vinegar should stay off natural stone, wood finishes and mirrors.",
  },
];

export default function BlogSpotlessHomeTips() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const canonical = "https://dutycleaners.ca/blog/spotless-home-tips/";
  const title = "House Cleaning Tips: Keep Up Between Cleans";
  const description =
    "Practical upkeep between cleans: tackle tracked-in dirt, clutter, kitchen splashes and bathroom buildup without repeating a full-house clean.";

  return (
    <>
      <Helmet>
        <title>{`${title} | Duty Cleaners`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={`${title} | Duty Cleaners`} />
        <meta property="og:description" content={description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${title} | Duty Cleaners`} />
        <meta name="twitter:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonical} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description,
          image: "https://dutycleaners.ca/og-image.jpg",
          ...(publishedFor("/blog/spotless-home-tips") ? { datePublished: publishedFor("/blog/spotless-home-tips") } : {}),
          dateModified: modifiedOr("/blog/spotless-home-tips"),
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
        <main id="main-content" tabIndex={-1}>
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>

        {/* Hero */}
        <section className="relative pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Button variant="ghost" className="mb-6" asChild>
              <Link to="/blog/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>

            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                  Cleaning Tips
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  August 24, 2026
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
                House Cleaning Tips for a Spotless Home
              </h1>

              <p className="text-xl text-muted-foreground mb-8">
                A clean home comes from a handful of small habits done most days, and a schedule
                that keeps the bigger jobs from piling up.
              </p>

              <div className="aspect-video rounded-2xl overflow-hidden mb-12">
                <img
                  width={1920}
                  height={1080}
                  src={heroImage}
                  alt="A tidy living room with clear surfaces"
                  className="w-full h-full object-cover"
                 loading="eager" fetchPriority="high"/>
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
                  Here's the approach that holds up: declutter first, build a simple schedule,
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
                  This is also the step that makes everything after it faster. A clear kitchen counter
                  is a quick wipe; a cluttered one means moving everything off it first.
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
                      <span className="dc-icon dc-icon-circle-check h-6 w-6 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
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
                  Match the small job to what keeps coming back
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Start with the problem that returns between cleans, rather than repeating the whole checklist:
                </p>
                <ul className="space-y-2 text-muted-foreground mb-4">
                  <li>• <strong className="text-foreground">Tracked-in dirt</strong>: keep shoes near the entrance and clean the affected floor using its care instructions.</li>
                  <li>• <strong className="text-foreground">Cluttered surfaces</strong>: put items away so the counter or table can be wiped without moving the same pile repeatedly.</li>
                  <li>• <strong className="text-foreground">Recurring splashes</strong>: address them promptly with a surface-compatible method instead of letting residue accumulate.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  For a full daily, weekly and monthly task plan, use our{" "}
                  <Link to="/blog/cleaning-schedule/" className="text-primary underline underline-offset-2 font-medium">
                    DIY cleaning schedule
                  </Link>{" "}
                  rather than turning every small touch-up into a full clean.
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
                      alt="A tidy bedroom with a made bed"
                      className="w-full h-full object-cover"
                     loading="lazy" decoding="async"/>
                  </div>
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <img
                      width={1024}
                      height={576}
                      src={floorImage}
                      alt="Freshly cleaned hardwood floor"
                      className="w-full h-full object-cover"
                     loading="lazy" decoding="async"/>
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
                  Speed matters more than product for most stains. Blot coffee and wine spills straight
                  away, rather than rubbing them, to lift the excess liquid before it sets. For grease,
                  baking soda left to sit for a few minutes before wiping or vacuuming does most of the
                  work. Test any cleaning solution on a hidden patch first if the surface is delicate;
                  the full method is in{" "}
                  <Link to="/cleaning-with-vinegar-and-baking-soda/" className="text-primary underline underline-offset-2 font-medium">
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
                  <div
                    className="relative p-5 border border-border rounded-xl bg-card transition-colors hover:border-accent"
                  >
                    <h3 className="font-bold text-foreground">
                      <Link
                        to="/the-top-5-must-have-cleaning-products-for-a-spotless-home/"
                        className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        The Top 5 Must-Have Cleaning Products
                      </Link>
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      The five cleaning products worth keeping, and what you can stop buying.
                    </p>
                  </div>
                  <div
                    className="relative p-5 border border-border rounded-xl bg-card transition-colors hover:border-accent"
                  >
                    <h3 className="font-bold text-foreground">
                      <Link
                        to="/blog/cleaning-schedule/"
                        className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        A Cleaning Schedule That Actually Holds Up
                      </Link>
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      A more detailed breakdown of the daily, weekly and monthly schedule.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  Or hand off the weekly jobs
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  If you want help with the routine cleaning alongside these small touch-ups, Duty
                  Cleaners offers the standard checklist as recurring cleaning, booked weekly, bi-weekly
                  or every 4 weeks, with a discount from the second visit. Nothing is charged at
                  booking, and the card is charged once the clean is complete.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="accent" className="w-full sm:w-auto min-h-[52px] text-base font-bold" asChild>
                    <Link to="/#quote">
                      See My Instant Price — Edmonton
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto min-h-[52px] text-base font-semibold" asChild>
                    <Link to="/cleaning-services-calgary/#quote">
                      See My Instant Price — Calgary
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
