import { modifiedOr, publishedFor } from "@/data/post-published";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { absoluteAssetUrl, ARTICLE_AUTHOR, ARTICLE_PUBLISHER } from "@/lib/seo";
import { modifiedFor } from "@/data/post-dates";
import { canonicalUrlForPath } from "@/data/legacy-urls";
import { Calendar, Clock, ArrowLeft, Home, Users, PawPrint, Briefcase, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { FREQUENCIES, flatRateFromPrice, formatPrice } from "@/data/pricing";
import { POLICY } from "@/data/policy";

import heroImage from "@/assets/blog/cleaning-frequency-hero.webp";
import familyImage from "@/assets/blog/family-household.webp";
import petsImage from "@/assets/blog/pets-home.webp";
import professionalImage from "@/assets/blog/professional-cleaning.webp";
import calendarImage from "@/assets/blog/cleaning-calendar.webp";

/** Read from BookingKoala so this article cannot quote a stale discount. */
const RECURRING = FREQUENCIES.filter((frequency) => frequency.discount > 0).sort(
  (a, b) => b.discount - a.discount,
);

// Each price carries its own frequency word. A bare "$123.99 / $131.74 /
// $139.49" makes the reader map three numbers onto three plans from position.

// The smallest recurring discount is the "Every 4 Weeks" tier: 13 visits a
// year, so the article never calls it "monthly" when it means our plan.
const EVERY_FOUR_WEEKS = RECURRING[RECURRING.length - 1];

const factors = [
  {
    icon: Home,
    title: "Household Size",
    description: "The size of the home and the number of people living in it decide how fast it gets untidy. A bigger house with a large family is usually best served weekly, while one person in a one-bedroom apartment with little stuff can do well on bi-weekly or monthly visits. At Duty Cleaners, toys and clutter get worked around rather than tidied: clear counters and floors get cleaned, and decluttering is a separate hourly add-on."
  },
  {
    icon: Users,
    title: "Usage Patterns",
    description: "If you already dust, vacuum and wipe down the kitchen and bathrooms between visits, a weekly service may be more than the home needs. Bi-weekly often suits a home where the daily tidying is covered and the help is wanted for the jobs that take longest, such as scrubbing bathrooms and washing floors."
  },
  {
    icon: PawPrint,
    title: "Pets",
    description: "Pets shed, and the hair and dander settle on floors, furniture and baseboards between visits. A home with a pet that sheds heavily usually needs a cleaner weekly or bi-weekly to stay ahead of it. At Duty Cleaners a compulsory per-visit charge applies to homes with pets, and it shows on the quote before booking. Litter boxes and animal waste are not part of any Duty Cleaners clean."
  },
  {
    icon: Briefcase,
    title: "Lifestyle",
    description: "How much time you have for housework matters as much as the size of the home. If work and other commitments leave no time for even basic cleaning, weekly or bi-weekly visits carry the load. If you have time for most of the housework and want help with the rest, a monthly visit may be enough."
  },
  {
    icon: DollarSign,
    title: "Budget",
    description: "Compare the total you can spend across a month or year, not just the price per visit. More frequent visits can have a lower per-visit rate but a higher overall cost. Allow for the first clean, required charges and tax; use the recurring service pages for current plan prices."
  }
];

const frequencyOptions = [
  {
    title: "Weekly Cleaning",
    ideal: "Households with children or pets, larger homes, and anyone who cannot do routine cleaning themselves",
    description: "Weekly cleaning suits a household that needs steady upkeep, especially with children and pets at home or a larger house. Each visit covers the surfaces of the home and the high-traffic areas, with household upkeep between visits.",
    benefit: "Choose weekly if the home needs that cadence, not just because a per-visit discount looks attractive."
  },
  {
    title: "Bi-Weekly Cleaning",
    ideal: "Couples, people who tidy regularly, medium-sized homes",
    description: "Bi-weekly cleaning suits a home that stays fairly tidy day to day but still needs a proper clean more often than once a month. It works well when someone in the household keeps up with general tidying between visits.",
    benefit: "Two weeks is long enough that a visit feels like a reset, but adjust the interval if your household needs more help between visits."
  },
  {
    title: "Monthly Cleaning",
    ideal: "Smaller homes, people who clean regularly, homes that are lightly used",
    description: "A cleaner comes about once a month and does a thorough clean of the home. It suits a home with less mess to clean up, or a household that does most of the housework and wants a regular reset.",
    benefit: `At Duty Cleaners the closest plan is ${EVERY_FOUR_WEEKS.label.toLowerCase()}: 13 visits a year, not 12. Check the recurring pages for current discounts and first-visit terms.`
  },
  {
    title: "One-time or Special Events",
    ideal: "Holiday gatherings, parties, move-in/move-out, seasonal deep cleaning",
    description: "A one-time clean suits a home before guests arrive for the holidays or a party, or as a seasonal reset. A move-in or move-out clean and a deep clean are separate services, each with its own checklist and price.",
    benefit: "A one-time clean is priced by home size like any other visit. If it goes well, a recurring plan can start from there."
  }
];

export default function BlogCleaningFrequency() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>How Often Should You Hire a House Cleaner?</title>
        <meta
          name="description"
          content="Decide how often to hire a house cleaner based on household needs, upkeep and budget. Compare weekly, biweekly and less frequent visits."
        />
        {/* Canonical is the preserved WordPress slug, matching the cost and vinegar
            posts. /blog/cleaning-frequency is the modern route and now 301s here. */}
        <link rel="canonical" href="https://dutycleaners.ca/how-often-should-a-cleaning-service-clean-my-house/" />
        <meta property="og:title" content="How Often Should You Hire a House Cleaner?" />
        <meta property="og:description" content="Decide how often to hire a house cleaner based on household needs, upkeep and budget. Compare weekly, biweekly and less frequent visits." />
        <meta name="twitter:card" content="summary_large_image" />
        {/* This post's own hero, so a share card shows the article rather
            than the generic site image. */}
        <meta property="og:image" content={absoluteAssetUrl(heroImage)} />
        <meta name="twitter:image" content={absoluteAssetUrl(heroImage)} />
        <meta name="twitter:title" content="How Often Should You Hire a House Cleaner?" />
        <meta name="twitter:description" content="Decide how often to hire a house cleaner based on household needs, upkeep and budget. Compare weekly, biweekly and less frequent visits." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://dutycleaners.ca/how-often-should-a-cleaning-service-clean-my-house/" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "How Often Should You Book Professional House Cleaning?",
          "description": "Decide how often to hire a house cleaner based on household needs, upkeep and budget. Compare weekly, biweekly and less frequent visits.",
          "image": absoluteAssetUrl(heroImage),
          ...(publishedFor("/how-often-should-a-cleaning-service-clean-my-house") ? { datePublished: publishedFor("/how-often-should-a-cleaning-service-clean-my-house") } : {}),
          "dateModified": modifiedOr("/how-often-should-a-cleaning-service-clean-my-house"),
          "author": ARTICLE_AUTHOR,
          "publisher": ARTICLE_PUBLISHER,
          "mainEntityOfPage": canonicalUrlForPath("/how-often-should-a-cleaning-service-clean-my-house")
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
                  Home Care
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  January 22, 2026
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-foreground leading-tight">How Often Should You Book Professional House Cleaning?</h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                The right cleaning frequency depends on household size, pets, how much tidying you already do and what you want to spend.
              </p>

              <div className="aspect-video rounded-2xl overflow-hidden mb-12">
                <img width={1024} height={576}
                  src={heroImage}
                  alt="Professional cleaner vacuuming a modern living room"
                  className="w-full h-full object-cover"
                 loading="eager" fetchPriority="high"/>
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
                  The question is rarely whether the house needs cleaning. It is how many hours a month you want back, and what those hours cost at each frequency. Most cleaning companies offer weekly, bi-weekly and roughly monthly visits. At Duty Cleaners, <Link to="/edmonton/recurring-cleaning/" className="text-primary underline underline-offset-2 font-medium">recurring house cleaning in Edmonton</Link> and <Link to="/calgary/recurring-cleaning/" className="text-primary underline underline-offset-2 font-medium">recurring house cleaning in Calgary</Link> run weekly, bi-weekly or every 4 weeks. If budget is the deciding factor, our guide to <Link to="/how-much-does-a-house-cleaning-cost/" className="text-primary underline underline-offset-2 font-medium">what house cleaning costs</Link> breaks the numbers down.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  The right answer depends on five things: the size of the household, how the home is used, pets, how much time you have and your budget.
                </p>
              </div>

              {/* Quick Examples */}
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <div className="p-6 bg-primary/10 rounded-xl border border-primary/20">
                  <h2 className="font-bold text-foreground mb-2">When weekly visits may suit</h2>
                  <p className="text-muted-foreground text-sm">
                    A large house with a dog that sheds and young children, in a family with no time for even basic cleaning, is the clearest case for a weekly visit.
                  </p>
                </div>
                <div className="p-6 bg-secondary/30 rounded-xl border border-secondary/30">
                  <h2 className="font-bold text-foreground mb-2">When less frequent visits may suit</h2>
                  <p className="text-muted-foreground text-sm">
                    One person in a one-bedroom, one-bathroom apartment who tidies regularly can do well on a monthly schedule.
                  </p>
                </div>
              </div>

              {/* 5 Factors Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  5 Important Factors to Consider Before Choosing the Frequency
                </h2>

                <div className="aspect-video rounded-xl overflow-hidden mb-8">
                  <img width={1024} height={576}
                    src={familyImage}
                    alt="Family with children playing in a clean living room"
                    className="w-full h-full object-cover"
                   loading="lazy" decoding="async"/>
                </div>

                <div className="space-y-6">
                  {factors.map((factor, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <factor.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold mb-2 text-foreground">
                              {index + 1}. {factor.title}
                            </h3>
                            <p className="text-muted-foreground">{factor.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Pets Image Section */}
              <div className="mb-12">
                <div className="aspect-video rounded-xl overflow-hidden">
                  <img width={1024} height={576}
                    src={petsImage}
                    alt="Golden retriever dog lying on a clean wooden floor"
                    className="w-full h-full object-cover"
                   loading="lazy" decoding="async"/>
                </div>
                <p className="text-center text-muted-foreground mt-4 italic">
                  A home with a pet that sheds usually needs cleaning more often, to keep hair and dander off floors and furniture.
                </p>
              </div>

              {/* Weekly Cleaning Issues */}
              <div className="mb-12 p-6 bg-muted/30 rounded-xl">
                <h3 className="font-bold text-foreground mb-4">When Weekly Cleaning May Not Be Right</h3>
                <p className="text-muted-foreground mb-4">
                  If you already keep a regular cleaning routine, a weekly service has two drawbacks:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">1.</span>
                    Each visit has less to do, so you pay for more visits than the home needs.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">2.</span>
                    Weekly costs more per month than bi-weekly or every 4 weeks, even with its larger discount.
                  </li>
                </ul>
              </div>

              {/* Kitchen Warning */}
              <div className="mb-12 p-6 bg-destructive/10 rounded-xl border border-destructive/20">
                <h3 className="font-bold text-foreground mb-2">The Rooms That Set the Schedule</h3>
                <p className="text-muted-foreground">
                  Kitchens and bathrooms decide most cleaning schedules. Grease and food spills build up in a kitchen that is cooked in every day, and hard Alberta water leaves mineral scale on taps, shower glass and kettles between visits. If either room is hard to keep up with on your own, a weekly or bi-weekly visit usually helps more than a monthly one.
                </p>
              </div>

              {/* Frequency Options */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  Weekly, Bi-Weekly, Monthly or One-Time Cleaning
                </h2>

                <div className="aspect-video rounded-xl overflow-hidden mb-8">
                  <img width={1024} height={576}
                    src={professionalImage}
                    alt="Professional cleaner wiping down kitchen counters"
                    className="w-full h-full object-cover"
                   loading="lazy" decoding="async"/>
                </div>

                <p className="text-muted-foreground mb-8">
                  Each schedule suits a different kind of household, depending on how much cleaning the home needs between visits.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {frequencyOptions.map((option, index) => (
                    <Card key={index} className="h-full">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-2 text-foreground">{option.title}</h3>
                        <p className="text-sm text-primary font-medium mb-3">Ideal for: {option.ideal}</p>
                        <p className="text-muted-foreground text-sm mb-4">{option.description}</p>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground italic">{option.benefit}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Calendar Image */}
              <div className="mb-12">
                <div className="aspect-video rounded-xl overflow-hidden">
                  <img width={1024} height={576}
                    src={calendarImage}
                    alt="Cleaning schedule calendar on a desk"
                    className="w-full h-full object-cover"
                   loading="lazy" decoding="async"/>
                </div>
              </div>

              {/* Conclusion */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  Finding the Right Frequency for You
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Pick the frequency by how fast your home gets untidy, not by the one that sounds most responsible. A plan you quietly resent is a plan you cancel. At Duty Cleaners a booking can be changed or cancelled with {POLICY.cancellationNoticeHours} hours' notice; inside {POLICY.cancellationNoticeHours} hours the fee is {POLICY.cancellationFee}.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  A few visits in, the schedule shows whether it fits. If the home is untidy again well before the next visit, book more often; if the team finds little to do, book less often.
                </p>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  Book a Recurring Clean in Edmonton or Calgary
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Duty Cleaners has an Edmonton branch and a Calgary branch, and each also serves nine communities outside its city. Pick a frequency and see the price for your home size before you book. The card is charged once the clean is complete.
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
