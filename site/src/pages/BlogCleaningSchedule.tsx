import { modifiedOr, publishedFor } from "@/data/post-published";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { absoluteAssetUrl, ARTICLE_AUTHOR, ARTICLE_PUBLISHER } from "@/lib/seo";
import { modifiedFor } from "@/data/post-dates";
import { canonicalUrlForPath, canonicalForPath } from "@/data/legacy-urls";
import { Calendar, Clock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import heroImage from "@/assets/blog/cleaning-schedule-hero.webp";
import bedroomImage from "@/assets/blog/daily-cleaning-bedroom.webp";
import floorImage from "@/assets/blog/weekly-cleaning-floor.webp";
import bathroomImage from "@/assets/blog/bathroom-cleaning.webp";
import dishwasherImage from "@/assets/blog/dishwasher-cleaning.webp";

const dailyTasks = [
  {
    title: "Do the Dishes",
    description: "Instead of letting dishes pile up in the sink, where they leave it grimy, rinse them straight away and load them into the dishwasher. Run a cycle once it is full, which is usually the end of the day."
  },
  {
    title: "Empty the Dishwasher",
    description: "While your morning coffee is brewing, use that time to empty the dishwasher so that you can load your dirty coffee mug and other dishes into it after breakfast."
  },
  {
    title: "Make Your Bed",
    description: "Get into the habit of making your bed as soon as you get out of it in the morning."
  },
  {
    title: "Wipe Down Kitchen Counters",
    description: "Clean up spills and crumbs from your kitchen counters as soon as they occur. If needed, give counters a quick wipe down before you head to bed."
  },
  {
    title: "Declutter",
    description: "Once you get decluttering started, it's easy to keep it rolling. Tackle clutter as and when you see it; it only takes a minute or two to put things away, or discard them if it's rubbish that you're dealing with."
  },
  {
    title: "Tidy Up Rooms",
    description: "Straighten out rooms before you leave. For example, if you're done watching TV for the next few hours, straighten out the cushions, put things back in place, and pick up after yourself."
  },
  {
    title: "Wipe Down Bathroom Surfaces",
    description: "Keep a sponge and multi-purpose cleaner in your bathroom to quickly clean and wipe down bathroom surfaces."
  },
  {
    title: "Wipe Bathroom Floor Splashes",
    description: "Wipe up splashes after a shower and leave the floor dry. Do not flood a bathroom floor: most household bathrooms are not designed as wet rooms. Follow the flooring manufacturer's cleaning instructions."
  },
  {
    title: "Dust Furniture",
    description: "Plenty of people dread dusting. When the house stays tidy and surfaces stay clear, though, a daily dust of the furniture takes a few minutes."
  }
];

const weeklyTasks = [
  {
    title: "Clean the Floor",
    description: "This should definitely be a weekend chore because cleaning the floor of every room in the house can take some time (at least a thorough job does). Moreover, floor cleaning includes vacuuming/sweeping and mopping which can be tiring to do on a busy day."
  },
  {
    title: "Vacuum Rugs and Carpets",
    description: "Get rid of a week's worth of dust, dirt, and possibly pet hair settled on your carpets and rugs."
  },
  {
    title: "Stay on Top of Laundry",
    description: "If time permits, do at least two loads of laundry to keep dirty clothes from piling up."
  },
  {
    title: "Clean the Stove",
    description: "Scrub down the stovetop to remove grease and grime. If cooking is a daily activity in your household, you might want to consider a daily wipe down of your stovetop."
  },
  {
    title: "Clean the Toilet",
    description: "While you are maintaining the rest of your bathroom on a daily basis, the toilet will need thorough cleaning once a week."
  },
  {
    title: "Wash/Wipe Windows",
    description: "If you can get away with a wipe down to keep your windows clean, go for it, otherwise, a quick wash may be in order."
  },
  {
    title: "Vacuum Upholstery",
    description: "Dust and crumbs build up in upholstery over a week. Go over sofas, chairs, curtains, bedroom benches and other upholstered furniture with the upholstery attachment."
  },
  {
    title: "Clean the Bathroom",
    description: "This is usually a quick weekly task, because the daily wipe-downs keep bathroom surfaces fairly clean. Once a week, also wash the wall tiles and scrub the sink and shower area."
  }
];

const monthlyTasks = [
  {
    title: "Dust the Ceiling Fan",
    description: "A microfibre broom with a flexible head is perfect for cleaning ceiling fan blades quickly and efficiently; otherwise, the old-fashioned approach using a ladder and damp cloth will suffice."
  },
  {
    title: "Wash the Curtains",
    description: "Bed linens need washing more often than once a month, but curtains can go on the monthly list."
  },
  {
    title: "Clean Kitchen Appliances",
    description: "The microwave, oven, coffee maker, toaster and refrigerator are easy to overlook. Give each one a clean inside and out once a month."
  },
  {
    title: "Remove Cobwebs",
    description: "You may or may not find cobwebs in your home every month but there's no harm in doing a monthly inspection. Oftentimes, cobwebs can be found behind furniture and tall cabinets as opposed to just ceiling corners."
  },
  {
    title: "Wash the Garbage Bin",
    description: "Wash the kitchen garbage bin inside and out once a month, and let it dry before a new bag goes in."
  }
];

export default function BlogCleaningSchedule() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>DIY House Cleaning Schedule: Daily, Weekly & Monthly</title>
        <meta
          name="description"
          content="Organize household chores with a practical DIY cleaning schedule: daily upkeep, weekly room tasks and monthly jobs, adapted to your home."
        />
        <link rel="canonical" href="https://dutycleaners.ca/blog/cleaning-schedule/" />
        <meta property="og:title" content="DIY House Cleaning Schedule: Daily, Weekly & Monthly" />
        <meta property="og:description" content="Organize household chores with a practical DIY cleaning schedule: daily upkeep, weekly room tasks and monthly jobs, adapted to your home." />
        <meta name="twitter:card" content="summary_large_image" />
        {/* This post's own hero, so a share card shows the article rather
            than the generic site image. */}
        <meta property="og:image" content={absoluteAssetUrl(heroImage)} />
        <meta name="twitter:image" content={absoluteAssetUrl(heroImage)} />
        <meta name="twitter:title" content="DIY House Cleaning Schedule: Daily, Weekly & Monthly" />
        <meta name="twitter:description" content="Organize household chores with a practical DIY cleaning schedule: daily upkeep, weekly room tasks and monthly jobs, adapted to your home." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://dutycleaners.ca/blog/cleaning-schedule/" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "A Daily, Weekly and Monthly DIY Cleaning Schedule",
          "description": "Organize household chores with a practical DIY cleaning schedule: daily upkeep, weekly room tasks and monthly jobs, adapted to your home.",
          "image": absoluteAssetUrl(heroImage),
          ...(publishedFor("/blog/cleaning-schedule") ? { datePublished: publishedFor("/blog/cleaning-schedule") } : {}),
          "dateModified": modifiedOr("/blog/cleaning-schedule"),
          "author": ARTICLE_AUTHOR,
          "publisher": ARTICLE_PUBLISHER,
          "mainEntityOfPage": canonicalUrlForPath("/blog/cleaning-schedule")
})}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main id="main-content" tabIndex={-1}>
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>

        {/* Hero Section */}
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
                  January 20, 2026
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  6 min read
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-foreground leading-tight">A Daily, Weekly and Monthly DIY Cleaning Schedule</h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Split the housework into daily, weekly and monthly jobs, and no single day has to carry all of it.
              </p>

              <div className="aspect-video rounded-2xl overflow-hidden mb-12">
                <img width={1024} height={576}
                  src={heroImage}
                  alt="Woman wiping a counter in a bright, tidy kitchen"
                  className="w-full h-full object-cover"
                 loading="eager" fetchPriority="high"/>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-4xl pb-8"><p>This is a DIY task schedule. To decide how often to hire help, read <Link className="text-primary underline" to="/how-often-should-a-cleaning-service-clean-my-house/">how often to book professional house cleaning</Link>.</p></div>
        {/* Article Content */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Introduction */}
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Housework gets put off because it looks like one big job with no time set aside for it. The fix is to <strong>divide household cleaning into daily, weekly and monthly tasks</strong>, and give each tier its own place in the week or the month.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  The three schedules that follow are a starting point. Keep the tasks that fit your home and your week, and drop the ones that do not.
                </p>
              </div>

              {/* Daily Cleaning Schedule */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  Daily Cleaning Schedule
                </h2>
                
                <div className="aspect-video rounded-xl overflow-hidden mb-6">
                  <img width={1024} height={576}
                    src={bedroomImage}
                    alt="Neatly made bed with fresh white linens in a bright bedroom"
                    className="w-full h-full object-cover"
                   loading="lazy" decoding="async"/>
                </div>

                <p className="text-muted-foreground mb-6">
                  Before we begin, it's important to understand that personal schedules differ from person to person; therefore, a daily cleaning schedule that suits your day-to-day routine may not necessarily fit into someone else's. In other words, you need to find what works for you and your everyday schedule.
                </p>

                <p className="font-semibold text-foreground mb-4">
                  Use this daily cleaning checklist to build a realistic cleaning schedule for yourself:
                </p>

                <div className="space-y-4">
                  {dailyTasks.map((task, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{task.title}</h3>
                        <p className="text-muted-foreground text-sm">{task.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 aspect-video rounded-xl overflow-hidden">
                  <img width={1024} height={576}
                    src={dishwasherImage}
                    alt="Open dishwasher loaded with clean dishes"
                    className="w-full h-full object-cover"
                   loading="lazy" decoding="async"/>
                </div>
              </div>

              {/* Weekly Cleaning Schedule */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  Weekly Cleaning Schedule
                </h2>

                <div className="aspect-video rounded-xl overflow-hidden mb-6">
                  <img width={1024} height={576}
                    src={floorImage}
                    alt="Person mopping hardwood floor in a bright living room"
                    className="w-full h-full object-cover"
                   loading="lazy" decoding="async"/>
                </div>

                <p className="text-muted-foreground mb-6">
                  Your weekly cleaning checklist mixes small tasks with big ones. If your weekends are freer than your weekdays, put the bigger, slower jobs on Saturday or Sunday and spread one or two smaller ones across the rest of the week.
                </p>

                <div className="space-y-4">
                  {weeklyTasks.map((task, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-secondary/30 rounded-lg">
                      <CheckCircle2 className="h-6 w-6 text-secondary-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{task.title}</h3>
                        <p className="text-muted-foreground text-sm">{task.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-6 bg-primary/10 rounded-xl border border-primary/20">
                  <p className="text-foreground">
                    <strong>Pro Tip:</strong> Vacuum upholstery with the upholstery attachment and work from the top down: cushions first, then the frame, then the floor under the sofa. Dust falls as you go, so the floor comes last.
                  </p>
                </div>
              </div>

              {/* Monthly Cleaning Schedule */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  Monthly Cleaning Schedule
                </h2>

                <div className="aspect-video rounded-xl overflow-hidden mb-6">
                  <img width={1024} height={576}
                    src={bathroomImage}
                    alt="Clean modern bathroom with white tiles"
                    className="w-full h-full object-cover"
                   loading="lazy" decoding="async"/>
                </div>

                <p className="text-muted-foreground mb-6">
                  A monthly cleaning schedule is easier to fit around the rest of life than the daily and weekly lists. Pick one day in the month for each extra task, and it is done for the next four or five weeks.
                </p>

                <div className="space-y-4">
                  {monthlyTasks.map((task, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-accent/30 rounded-lg">
                      <CheckCircle2 className="h-6 w-6 text-accent-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{task.title}</h3>
                        <p className="text-muted-foreground text-sm">{task.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conclusion */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  Create Your Perfect Cleaning Schedule
                </h2>
                {/*
                  These two paragraphs were un-edited legacy copy — a 47-word
                  opening sentence, and a close that argued for hiring us by
                  telling the reader their own schedule was too much for them.
                  The post's job is to be useful whether or not anyone books.
                */}
                <p className="text-lg text-muted-foreground leading-relaxed">
                  A schedule only works if it survives a bad week. Build it around what your
                  household does rather than an ideal version of it: pick the two or three
                  daily habits you will keep, put the weekly work on a day that
                  is reliably free, and let the monthly jobs float within their month rather
                  than fixing them to a date.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  Expect to revise it. The first draft is usually too ambitious, and the fix is
                  to cut tasks rather than to try harder — a short list you follow beats a
                  complete one you abandon in February. If the weekly tier is the part that
                  keeps slipping, that is the part a cleaning company can take over. Duty
                  Cleaners'{" "}
                  <Link to={canonicalForPath("/edmonton/recurring-cleaning")} className="text-accent underline underline-offset-2">
                    recurring cleaning in Edmonton
                  </Link>{" "}
                  and{" "}
                  <Link to={canonicalForPath("/calgary/recurring-cleaning")} className="text-accent underline underline-offset-2">
                    recurring cleaning in Calgary
                  </Link>{" "}
                  cover the floors, bathrooms, kitchen and dusting weekly, bi-weekly or every 4
                  weeks, while laundry, dishes and the daily habits stay yours. What a visit
                  includes is set out on{" "}
                  <Link to={canonicalForPath("/whats-included")} className="text-accent underline underline-offset-2">
                    what's included
                  </Link>
                  .
                </p>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  Want help with part of the routine?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  The team brings all supplies and equipment, and you do not need to be home: most customers leave a key, a lockbox code or smart-lock access, and the team locks up. See the price for your home before you book.
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
