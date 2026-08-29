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

import heroImage from "@/assets/blog/cleaning-frequency-hero.webp";
import familyImage from "@/assets/blog/family-household.webp";
import petsImage from "@/assets/blog/pets-home.webp";
import professionalImage from "@/assets/blog/professional-cleaning.webp";
import calendarImage from "@/assets/blog/cleaning-calendar.webp";

const factors = [
  {
    icon: Home,
    title: "Household Size",
    description: "How big is your house? The size of your house and the people living in it matter in deciding the frequency of cleaning. If you have a bigger house with a large family, hiring a weekly service is likely your best bet. The house cleaner can help clean areas of your home that you may not have thought needed cleaning especially if you have kids who love to play around and keep their toys everywhere. However, if you have a small one-bedroom home, alone, and have less stuff to clean, biweekly or even monthly service is fine."
  },
  {
    icon: Users,
    title: "Usage Patterns",
    description: "Do you still do a regular tidy-up of your home such as dusting surface areas, vacuuming, mopping, and cleaning the kitchen, bathrooms, etc.? If your answer is yes, a weekly service may not be the best choice for you. A biweekly cleaning may be perfect since you still do daily cleaning and you may only need help with heavy tasks such as scrubbing the floors, cleaning the windows, etc."
  },
  {
    icon: PawPrint,
    title: "Pets",
    description: "We love our furry friends, but sometimes we forget about the amount of hair they shed or the messes they make. If you have pets who shed a lot at home and you are having a hard time keeping the house clean due to pet-related messes then hiring a cleaner who comes weekly or biweekly can be a huge help. These services may be necessary to keep your home free from pet hair and dander."
  },
  {
    icon: Briefcase,
    title: "Lifestyle",
    description: "Your lifestyle can play a big role in the frequency of your cleaning service. If you are constantly busy with work and social commitments and have no extra time to do even the basic cleaning, then weekly or biweekly services may be more suited to your needs. However, if you have more time to concentrate on housework and don't need as much assistance, a monthly service may be enough."
  },
  {
    icon: DollarSign,
    title: "Budget",
    description: "Ultimately, how often you choose to get your house cleaned depends on what you can afford. Hiring a professional house cleaning is indeed an investment. Monthly cleans tend to be the most affordable option, while weekly service may be more cost-effective if you have a large and busy household."
  }
];

const frequencyOptions = [
  {
    title: "Weekly Cleaning",
    ideal: "Busy households with kids and pets, larger homes, seniors or disabled individuals",
    description: "Weekly cleaning is the best option for busy households that need consistent upkeep and maintenance. This is especially true if you have kids and pets at home. If your home is on the larger side, weekly cleaning is definitely something you should look into. The cleaning covers the surfaces of the home as well as the high traffic areas of the house.",
    benefit: "Most cleaning companies offer higher recurring discounts for this type of service because it requires a much higher level of commitment from them."
  },
  {
    title: "Bi-Weekly Cleaning",
    ideal: "Young couples, individuals who do regular tidying, medium-sized homes",
    description: "Biweekly cleanings are the most popular and ideal for those who want to keep their homes tidy but don't feel the need for frequent weekly cleanings. If you're a young couple or someone who can still do general tidying or regular cleaning then bi-weekly service may be the perfect fit for you.",
    benefit: "Generally speaking, a bi-weekly house cleaning is sufficient for most homes. It allows you to maintain a level of cleanliness between the weekly deep cleanings, while also freeing up your time and energy to focus on other important tasks."
  },
  {
    title: "Monthly Cleaning",
    ideal: "Smaller homes, individuals who clean regularly, those with flexible schedules",
    description: "The cleaner may come to your home once a month and do a thorough cleaning of your home. If you have a busy schedule and find weekly and biweekly cleanings to be too much, then a monthly cleaning service may be better suited for your needs.",
    benefit: "This type of service is ideal for those who don't use their homes often or for households with less mess to clean up on a weekly and bi-weekly basis."
  },
  {
    title: "One-time or Special Events",
    ideal: "Holiday gatherings, parties, move-in/move-out, seasonal deep cleaning",
    description: "If you have a special event coming up or need one-time deep cleaning services for any reason, there are many professional companies that offer customized services to meet your needs. Whether you're having guests over for the holidays or hosting a large party, a dedicated team can help get your home looking its best before the big day.",
    benefit: "These services usually involve deeper and focused cleanings of specific spaces or rooms in your home, so that you can focus on preparing for the event without worrying about tidying up beforehand."
  }
];

export default function BlogCleaningFrequency() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>How Often Should You Get Your House Cleaned? | Duty Cleaners</title>
        <meta
          name="description"
          content="Learn how often you should hire a cleaning service - weekly, bi-weekly, or monthly. An expert guide to choosing the right cleaning frequency."
        />
        {/* Canonical is the preserved WordPress slug, matching the cost and vinegar
            posts. /blog/cleaning-frequency is the modern route and now 301s here. */}
        <link rel="canonical" href="https://dutycleaners.ca/how-often-should-a-cleaning-service-clean-my-house/" />
        <meta property="og:title" content="How Often Should You Get Your House Cleaned? | Duty Cleaners" />
        <meta property="og:description" content="Learn how often you should hire a cleaning service - weekly, bi-weekly, or monthly. An expert guide to choosing the right cleaning frequency." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How Often Should You Get Your House Cleaned? | Duty Cleaners" />
        <meta name="twitter:description" content="Learn how often you should hire a cleaning service - weekly, bi-weekly, or monthly. An expert guide to choosing the right cleaning frequency." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://dutycleaners.ca/how-often-should-a-cleaning-service-clean-my-house/" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "How Often Should A Cleaning Service Clean My House",
          "description": "Learn how often you should hire a cleaning service - weekly, bi-weekly, or monthly. Expert guide from Duty Cleaners to help you choose the right cleaning frequency.",
          "image": absoluteAssetUrl(heroImage),
          "datePublished": "2026-01-22",
          "dateModified": modifiedFor("/how-often-should-a-cleaning-service-clean-my-house", "2026-01-22"),
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
            <Link to="/blog/">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
            
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                  Home Care
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  January 22, 2026
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  10 min read
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
                How Often Should A Cleaning Service Clean My House?
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Discover the perfect cleaning frequency for your home based on your lifestyle, household size, and budget.
              </p>

              <div className="aspect-video rounded-2xl overflow-hidden mb-12">
                <img width={1024} height={576}
                  src={heroImage}
                  alt="Professional cleaner vacuuming a modern living room"
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
                  Having a tidy home is aesthetically pleasing and important for our mental and physical health, yet not all of us can find the time or energy to clean each day, right? That's why most of us consider hiring cleaning services to help us with household cleaning chores. A lot of professional cleaning providers offer <Link to="/edmonton/recurring-cleaning/" className="text-primary hover:underline font-medium">weekly, biweekly, and monthly home cleaning services</Link> which we can choose based on our needs and budget — and if budget is the deciding factor, our guide to <Link to="/how-much-does-a-house-cleaning-cost/" className="text-primary hover:underline font-medium">what house cleaning costs</Link> breaks the numbers down.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  But how often do we need professional cleanings for our homes? Is once a week too much? Is bi-weekly enough? Or does monthly service make more sense timewise and financially? Well, the answer to these questions depends on many factors.
                </p>
              </div>

              {/* Quick Examples */}
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <div className="p-6 bg-primary/10 rounded-xl border border-primary/20">
                  <h2 className="font-bold text-foreground mb-2">Weekly Cleaning Recommended</h2>
                  <p className="text-muted-foreground text-sm">
                    If you own a large house, with a dog that sheds, and little kids but none of your family members have time to do even basic cleaning, then definitely you need a house cleaner to come weekly to maintain cleanliness and tidiness in your home.
                  </p>
                </div>
                <div className="p-6 bg-secondary/30 rounded-xl border border-secondary/30">
                  <h2 className="font-bold text-foreground mb-2">Monthly Cleaning Sufficient</h2>
                  <p className="text-muted-foreground text-sm">
                    If you live alone in a one-bedroom apartment with one bathroom and you constantly do some regular tidying in your home, a monthly schedule will be enough.
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
                  />
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
                  />
                </div>
                <p className="text-center text-muted-foreground mt-4 italic">
                  Pets add joy to our homes but also require more frequent cleaning to manage shedding and dander.
                </p>
              </div>

              {/* Weekly Cleaning Issues */}
              <div className="mb-12 p-6 bg-muted/30 rounded-xl">
                <h3 className="font-bold text-foreground mb-4">When Weekly Cleaning May Not Be Right</h3>
                <p className="text-muted-foreground mb-4">
                  If you already maintain a regular cleaning routine, a weekly service may lead to the following issues:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">1.</span>
                    There would be no big jobs being completed as they are being done weekly and you may find that there is simply not enough time between visits.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">2.</span>
                    You will end up paying more because weekly cleaning services are usually more expensive compared to other frequencies.
                  </li>
                </ul>
              </div>

              {/* Kitchen Warning */}
              <div className="mb-12 p-6 bg-destructive/10 rounded-xl border border-destructive/20">
                <h3 className="font-bold text-foreground mb-2">Did You Know?</h3>
                <p className="text-muted-foreground">
                  The kitchen is actually the dirtiest room in the house because of all the grease and food stains which makes it more susceptible to bacteria and dirt than bathrooms are. If you don't keep your home clean and it's cluttered most of the time, you should consider having a weekly or biweekly professional service.
                </p>
              </div>

              {/* Frequency Options */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  The Frequency of Professional Cleaning Service
                </h2>

                <div className="aspect-video rounded-xl overflow-hidden mb-8">
                  <img width={1024} height={576}
                    src={professionalImage}
                    alt="Professional cleaner wiping down kitchen counters"
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="text-muted-foreground mb-8">
                  The frequency of cleaning may be customized depending on the amount of cleaning you need in your home, and where you want the cleaner to focus their efforts.
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
                  />
                </div>
              </div>

              {/* Conclusion */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  Finding the Right Frequency for You
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Your home is a place where you should feel relaxed and at peace, it's your oasis! A clean space goes a long way in creating that environment. But knowing how often to get your home cleaned can be tough, especially when weighing factors like budget and time constraints. Keep these things in mind as you consider what's best for you and your home.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  No matter what frequency of cleaning service you choose, finding a reliable house cleaning service that can meet your needs is essential for peace of mind and maintaining a healthy home environment.
                </p>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  Ready to Book Your Cleaning Service?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  If you are looking for professional house cleaning services perfect for your home, Duty Cleaners serves Edmonton, Calgary and the surrounding communities. Request a quote.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/#quote">
                    <Button size="lg" variant="accent" className="w-full sm:w-auto min-h-[52px] text-base font-bold">
                      See My Instant Price — Edmonton
                    </Button>
                  </Link>
                  <Link to="/cleaning-services-calgary/#quote">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto min-h-[52px] text-base font-semibold">
                      See My Instant Price — Calgary
                    </Button>
                  </Link>
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
