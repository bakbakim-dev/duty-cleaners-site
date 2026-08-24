import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { absoluteAssetUrl, ARTICLE_AUTHOR, ARTICLE_PUBLISHER } from "@/lib/seo";
import { canonicalUrlForPath } from "@/data/legacy-urls";
import { Calendar, Clock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import heroImage from "@/assets/blog/cleaning-schedule-hero.jpg";
import bedroomImage from "@/assets/blog/daily-cleaning-bedroom.jpg";
import floorImage from "@/assets/blog/weekly-cleaning-floor.jpg";
import bathroomImage from "@/assets/blog/bathroom-cleaning.jpg";
import dishwasherImage from "@/assets/blog/dishwasher-cleaning.jpg";

const dailyTasks = [
  {
    title: "Do the Dishes",
    description: "Instead of allowing dishes to pile up in the sink (which also makes the sink grimy and promotes bacteria), rinse off dirty dishes immediately and load them into the dishwasher. As soon as the dishwasher is at full capacity (typically at the end of the day), run a cycle."
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
    description: "When it comes to decluttering your home, once you get the ball rolling, it's easy to keep it rolling. Tackle clutter as and when you see it; it only takes a minute or two to put things away, or discard them if it's rubbish that you're dealing with."
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
    title: "Rinse the Bathroom Floor",
    description: "After you shower, rinse the bathroom floor and use a squeegee to push the water down the drain. This helps in removing mild floor stains while drying the surface quickly to prevent more stains."
  },
  {
    title: "Dust Furniture",
    description: "This is a dreaded task for many, however, when you do your bit to keep the house tidy and surfaces clutter-free, dusting furniture daily is quick and easy."
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
    description: "You'd be surprised by how much dust and bacteria accumulates on household upholstery every week. This includes your sofas, couches, chairs, curtains, bedroom benches, and other upholstered furniture."
  },
  {
    title: "Clean the Bathroom",
    description: "This is typically a quick and easy weekly task because daily cleaning of bathroom surfaces leave the space relatively clean. Of course, for that extra sparkle, you will need to wash wall tiles and scrub down the sink and shower area once a week."
  }
];

const monthlyTasks = [
  {
    title: "Dust the Ceiling Fan",
    description: "A microfibre broom with a flexible head is perfect for cleaning ceiling fan blades quickly and efficiently; otherwise, the old-fashioned approach using a ladder and damp cloth will suffice."
  },
  {
    title: "Replace Linens",
    description: "If not sooner, replace bed linens and curtains once a month. If a household member is sick (particularly with a contagious virus), it is highly advisable to launder their bed linens once a week until they recover."
  },
  {
    title: "Clean Kitchen Appliances",
    description: "The microwave, oven, coffee maker, toaster, and refrigerator are often overlooked when it comes to cleaning. It's important to keep these appliances sanitary with a monthly clean."
  },
  {
    title: "Remove Cobwebs",
    description: "You may or may not find cobwebs in your home every month but there's no harm in doing a monthly inspection. Oftentimes, cobwebs can be found behind furniture and tall cabinets as opposed to just ceiling corners."
  },
  {
    title: "Sanitise the Trash Can",
    description: "Owing to the bacteria trash cans carry, monthly cleaning and sterilising of the same are critically important."
  }
];

export default function BlogCleaningSchedule() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>A House Cleaning Schedule That Does Not Overwhelm You | Duty Cleaners</title>
        <meta
          name="description"
          content="Create a realistic cleaning schedule with daily, weekly, and monthly tasks. Expert tips from Duty Cleaners to keep your home clean without the stress."
        />
        <link rel="canonical" href="https://dutycleaners.ca/blog/cleaning-schedule/" />
        <meta property="og:title" content="A House Cleaning Schedule That Does Not Overwhelm You | Duty Cleaners" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://dutycleaners.ca/blog/cleaning-schedule/" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "A House Cleaning Schedule That Does Not Overwhelm You",
          "description": "Create a realistic cleaning schedule with daily, weekly, and monthly tasks. Expert tips from Duty Cleaners to keep your home clean without the stress.",
          "image": absoluteAssetUrl(heroImage),
          "datePublished": "2026-01-20",
          "dateModified": "2026-01-20",
          "author": ARTICLE_AUTHOR,
          "publisher": ARTICLE_PUBLISHER,
          "mainEntityOfPage": canonicalUrlForPath("/blog/cleaning-schedule")
})}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>

        {/* Hero Section */}
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
                  January 20, 2026
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  12 min read
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
                A House Cleaning Schedule That Does Not Overwhelm You
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Divide and conquer! That's really the only way to make your cleaning routine successful and not stressful.
              </p>

              <div className="aspect-video rounded-2xl overflow-hidden mb-12">
                <img width={1024} height={576}
                  src={heroImage}
                  alt="Woman cleaning kitchen counter in a bright, organized home"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Introduction */}
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We often overwhelm ourselves with the mere thought of recurring house cleaning and, more so, the lack of time and energy we have to do it. This brings us to our foolproof plan of action – <strong>divide household cleaning into daily, weekly, and monthly tasks</strong>, incorporate them into a cleaning schedule, and conquer them!
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  Now, if you're thinking that's easier said than done, that's what we are here for. Our experts at Duty Cleaners are sharing three realistic cleaning schedules that get the job done without taking a toll on your mental wellbeing. After all, home cleaning is meant to relieve stress rather than add to it.
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
                    alt="Neatly made bed with fresh white linens in a cozy bedroom"
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="text-muted-foreground mb-6">
                  Before we begin, it's important to understand that personal schedules differ from person to person; therefore, a daily cleaning schedule that suits your day-to-day routine may not necessarily fit into someone else's. In other words, you need to find what works for you and your everyday schedule.
                </p>

                <p className="font-semibold text-foreground mb-4">
                  Use the daily cleaning checklist below to create a realistic cleaning schedule for yourself:
                </p>

                <div className="space-y-4">
                  {dailyTasks.map((task, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{task.title}</h4>
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
                  />
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
                  />
                </div>

                <p className="text-muted-foreground mb-6">
                  The chores on your weekly cleaning checklist will consist of some small tasks, and some big ones. Since the average homeowner typically has more time on his/her hands during weekends, one should plan their weekly cleaning schedule accordingly. For example, leave bigger and more time-consuming tasks for Saturdays/Sundays while the rest of the week can include one or two weekly chores, at least.
                </p>

                <div className="space-y-4">
                  {weeklyTasks.map((task, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-secondary/30 rounded-lg">
                      <CheckCircle2 className="h-6 w-6 text-secondary-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{task.title}</h4>
                        <p className="text-muted-foreground text-sm">{task.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-6 bg-primary/10 rounded-xl border border-primary/20">
                  <p className="text-foreground">
                    <strong>Pro Tip:</strong> You'd be surprised by how much dust and bacteria accumulates on household upholstery every week. Dusty upholstery can trigger allergies and asthma attacks. That is why we have created methods for cleaning and disinfecting your home, so that your home is fresh and clean from the ground up.
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
                    alt="Clean modern bathroom with sparkling white tiles"
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="text-muted-foreground mb-6">
                  When compared to daily and weekly schedules, a monthly cleaning schedule is a lot easier to tweak as per one's convenience. It's just a matter of picking one day in the month to do an additional cleaning task, and then you don't have to worry about it for the next 4-5 weeks!
                </p>

                <div className="space-y-4">
                  {monthlyTasks.map((task, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-accent/30 rounded-lg">
                      <CheckCircle2 className="h-6 w-6 text-accent-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{task.title}</h4>
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
                <p className="text-lg text-muted-foreground leading-relaxed">
                  The primary objective of a cleaning schedule is to organize household cleaning tasks as per your convenience so that they not only fit into your personal day-to-day schedule, but are also divided and planned out in a realistic manner to avoid overwhelming yourself.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  Take a look at the home cleaning tasks above and make your own unique house cleaning schedule to keep your home neat and clean daily, weekly, and monthly. You may think that this is too much to do, and this is why a professional cleaner is better to hire than doing the cleaning tasks of your home yourself.
                </p>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  Let Duty Cleaners Handle Your Cleaning Schedule
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Don't have time to manage all these cleaning tasks? Our professional cleaning team can take care of your home so you can focus on what matters most.
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
