import { modifiedOr, publishedFor } from "@/data/post-published";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { absoluteAssetUrl, ARTICLE_AUTHOR, ARTICLE_PUBLISHER } from "@/lib/seo";
import { modifiedFor } from "@/data/post-dates";
import { canonicalUrlForPath } from "@/data/legacy-urls";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, Phone, CheckCircle2, Users, Shield, Star, Settings, MessageSquare, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

import { COMPANY, RATING_CLAIM } from "@/data/proof";

import heroImage from "@/assets/blog/choosing-cleaning-company-hero.webp";
import reviewsImage from "@/assets/blog/reading-reviews.webp";

const keyFactors = [
  {
    icon: Users,
    title: "Assessing Your Cleaning Needs",
    description: "Start with what the home needs. Regular upkeep, a one-time deep clean and a move-out clean are different jobs with different checklists, so a quote should say which one it covers. Note the type of home as well: at Duty Cleaners, for example, a two-storey house costs more than a condo with the same number of bedrooms.",
    details: "Write down anything specific before you call, such as pets, a product preference or a room that needs extra time. Ask about the jobs a company does not do, too. Duty Cleaners, for example, does not do carpet steam cleaning, upholstery or exterior windows, so those jobs need a specialist. It does not clean garages either: the only garage work is a balcony or garage sweep add-on, offered mostly in summer when the weather allows."
  },
  {
    icon: Star,
    title: "Evaluating Experience and Expertise",
    description: `Ask how long the company has been cleaning homes in your city, and who will come to the door. A company that has cleaned homes for years has usually settled its checklists and its booking process. Ask for relevant, attributable examples rather than assuming years in business prove every claim.`,
    details: "Experience shows in how a company answers questions, more than in the number of years on its website. Ask what happens if a clean takes longer than expected, what the team does with a cluttered counter, and how a missed spot gets fixed. Clear, specific answers are a better sign than a long list of adjectives."
  },
  {
    icon: Shield,
    title: "Checking How Cleaners Are Screened",
    description: "Ask how the company screens the people it sends into your home before a first job, and how it finds out whether a visit went well. A company that cannot answer both questions is relying on luck.",
    details: "Duty Cleaners reference-checks every cleaner before a first job, and the customer rates the cleaner after each visit. Those ratings decide who the company keeps sending."
  }
];

const customizationOptions = [
  {
    title: "A Plan You Can Adjust",
    description: "Look for a company that lets you say which rooms need more time and which tasks matter most. The order a house gets done in is easy to change, so ask for it."
  },
  {
    title: "Clear Scheduling",
    description: "A good cleaning company tells you plainly when it can arrive. Ask whether you are booking an arrival window or an exact time, and how schedule changes are communicated."
  },
  {
    title: "Special Requests",
    description: "If you prefer particular products or want the team to focus on high-traffic areas, say so before booking. At Duty Cleaners, optional alternative products are a paid add-on: ask the office which products are available and suitable for your surfaces when you book."
  },
  {
    title: "Adjustable Frequency",
    description: "Compare the intervals offered, when any discount starts, and the rules for pausing or changing a plan. Every four weeks is not the same as one visit per calendar month."
  },
  {
    title: "Add-Ons Without a Bigger Package",
    description: "Sometimes a home needs one extra job, not a different clean. Look for a company that lets you add a single task, such as the inside of the oven or the fridge, without moving the whole visit up to a deep clean."
  }
];

const customerSupportPoints = [
  {
    title: "Straight Answers Before Booking",
    description: "Call or email with a question before you book. A company that answers plainly before it has your money is more likely to answer plainly after."
  },
  {
    title: "Clear Information",
    description: "The company should publish what each service includes, what it costs and its policies, including cancellation and lockout terms, so you can decide before you book."
  },
  {
    title: "Problem Resolution",
    description: "Ask what happens if something is missed. Ask for the reporting deadline, what remedy is offered and whether it costs extra. Read the written policy before relying on a satisfaction slogan."
  },
  {
    title: "Knowledgeable Staff",
    description: "The person on the phone should be able to explain what a clean includes and what it does not. If the office has to guess, the team at your door may have to guess too."
  },
  {
    title: "Follow-Up",
    description: "A company should find out how each visit went, and a complaint should change something. Ask what the company does with a poor rating."
  }
];

export default function BlogChoosingCleaningCompany() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>How to Choose a Cleaning Company | Duty Cleaners</title>
        <meta
          name="description"
          content="Before you hire a house cleaning company, check what your home needs, how it screens cleaners, what its reviews say and what its quote includes."
        />
        <link rel="canonical" href="https://dutycleaners.ca/blog/choosing-cleaning-company/" />
        <meta property="og:title" content="How to Choose a Cleaning Company | Duty Cleaners" />
        <meta name="twitter:card" content="summary_large_image" />
        {/* This post's own hero, so a share card shows the article rather
            than the generic site image. */}
        <meta property="og:image" content={absoluteAssetUrl(heroImage)} />
        <meta name="twitter:image" content={absoluteAssetUrl(heroImage)} />
        <meta name="twitter:title" content="How to Choose a Cleaning Company | Duty Cleaners" />
        <meta name="twitter:description" content="Before you hire a house cleaning company, check what your home needs, how it screens cleaners, what its reviews say and what its quote includes." />
        <meta property="og:description" content="Before you hire a house cleaning company, check what your home needs, how it screens cleaners, what its reviews say and what its quote includes." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://dutycleaners.ca/blog/choosing-cleaning-company/" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Choosing the Right Cleaning Company for Your Needs",
          description: "Before you hire a house cleaning company, check what your home needs, how it screens cleaners, what its reviews say and what its quote includes.",
          // Dates match the date shown on the page and in the blog index; the
          // previous values (2024-06-01 / 2026-07-02) contradicted both. The
          // old image URL pointed at /blog/... which is not a served path.
          image: absoluteAssetUrl(heroImage),
          ...(publishedFor("/blog/choosing-cleaning-company") ? { datePublished: publishedFor("/blog/choosing-cleaning-company") } : {}),
          dateModified: modifiedOr("/blog/choosing-cleaning-company"),
          author: ARTICLE_AUTHOR,
          publisher: ARTICLE_PUBLISHER,
          mainEntityOfPage: canonicalUrlForPath("/blog/choosing-cleaning-company")
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main id="main-content" tabIndex={-1}>
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>

        {/* Hero Section */}
        <section className="relative">
          <div className="aspect-[21/9] max-h-[500px] overflow-hidden">
            <img width={1920} height={1080}
              src={heroImage}
              alt="Professional cleaning team greeting homeowner"
              className="w-full h-full object-cover"
             loading="eager" fetchPriority="high"/>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>
          <div className="container mx-auto px-4 -mt-32 relative z-10">
            <div className="max-w-4xl">
              <Link to="/blog/" className="inline-flex items-center text-primary hover:underline mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
              <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                Hiring Guide
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                Choosing the Right Cleaning Company for Your Needs
              </h1>
              <div className="flex items-center gap-6 text-muted-foreground mb-8">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  January 27, 2026
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  14 min read
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Introduction */}
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Most people booking a cleaner for the first time are comparing a few quotes and a handful of reviews, with no easy way to tell which company will turn up and do the work.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  This guide covers the checks that matter when choosing a house cleaning company: what your home needs, how long the company has been doing the work, how it screens its cleaners, what you can adjust, how it answers questions, what its reviews say and how to compare prices.
                </p>
              </div>

              {/* Key Factors Section */}
              <h2 className="text-3xl font-bold mb-8 text-foreground">Key Factors to Consider</h2>
              <div className="space-y-8 mb-16">
                {keyFactors.map((factor, index) => {
                  const Icon = factor.icon;
                  return (
                    <Card key={index} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold mb-3 text-foreground">{factor.title}</h3>
                            <p className="text-muted-foreground mb-3">{factor.description}</p>
                            <p className="text-muted-foreground">{factor.details}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Customization Options. The framed "certificates" image that sat
                  above this section was removed: it implied licensing and
                  certification the site does not claim. */}
              <h2 className="text-3xl font-bold mb-4 text-foreground flex items-center gap-3">
                <Settings className="h-8 w-8 text-primary" />
                Choosing What Gets Cleaned and When
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Two homes with the same number of bedrooms do not always need the same clean. Look for a company that lets you adjust these five things:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-12">
                {customizationOptions.map((option, index) => (
                  <Card key={index} className="bg-muted/30">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{option.title}</h3>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-muted-foreground mb-12">
                A plan you can adjust is a plan you are more likely to keep, and it stops you paying for work the home does not need.
              </p>

              {/* Customer Support Section */}
              <h2 className="text-3xl font-bold mb-4 text-foreground flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-primary" />
                Assessing Customer Support and Communication
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                How a company handles a question before you book is a fair preview of how it handles a problem after. Check these five things:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-12">
                {customerSupportPoints.map((point, index) => (
                  <Card key={index} className="bg-muted/30">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{point.title}</h3>
                          <p className="text-sm text-muted-foreground">{point.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-muted-foreground mb-12">
                None of these take long to check, and together they tell you more than a company's own description of its service.
              </p>

              {/* Reviews Image */}
              <div className="my-12">
                <img width={1024} height={1024}
                  src={reviewsImage}
                  alt="Customer reading positive reviews online"
                  className="w-full rounded-xl shadow-lg"
                 loading="lazy" decoding="async"/>
                <p className="text-sm text-muted-foreground text-center mt-3">
                  Recent reviews, and the company's replies to them, say more than the average rating
                </p>
              </div>

              {/* Reading Reviews Section */}
              <h2 className="text-3xl font-bold mb-4 text-foreground flex items-center gap-3">
                <Star className="h-8 w-8 text-primary" />
                Reading Reviews and Testimonials
              </h2>
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-muted-foreground">
                  Reviews show how past customers found a cleaning company, including its weak spots. Check more than one platform, such as Google, Yelp and social media, and read the recent reviews as well as the average.
                </p>
                <p className="text-muted-foreground mt-4">
                  Look for patterns in the feedback, such as steady praise for turning up on time or repeated complaints about communication. The replies matter too: a company that answers a bad review with a specific fix is showing you its process. Duty Cleaners' Edmonton and Calgary branches each have their own Google listing, and both are rated {RATING_CLAIM}. If you are comparing companies for <Link to="/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Edmonton</Link>, read each company's recent reviews before you book. For Calgary, the <Link to="/blog/cleaning-services-calgary/" className="text-primary underline underline-offset-2 font-medium">Calgary hiring guide</Link> covers what to check before you book there.
                </p>
              </div>

              {/* Comparing Services Section */}
              <h2 className="text-3xl font-bold mb-4 text-foreground flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-primary" />
                Comparing Services, Packages, and Pricing
              </h2>
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-muted-foreground">
                  Cleaning companies package their services differently, so compare what each quote includes rather than the name on the package. Some cover everything from a standard clean to a deep clean, while others specialise in a single task such as window or carpet cleaning.
                </p>
                <p className="text-muted-foreground mt-4">
                  Check whether you can add single tasks without upgrading the whole clean. Adding one job, such as the inside of the oven, usually costs less than moving up to a deep clean for the sake of one appliance.
                </p>
                <p className="text-muted-foreground mt-4">
                  Price matters, but compare what each quote covers as well as the total, and look for a published price with every extra named. At Duty Cleaners the price is flat by home size and before 5% GST. The compulsory extras are named before you book: a charge for homes with pets, a surcharge for a bungalow, townhouse or two-storey house rather than an apartment or condo, and a travel fee outside Edmonton and Calgary city limits. The instant price shows the exact figure, and the full tiers are on the <Link to="/pricing/" className="text-primary underline underline-offset-2 font-medium">Edmonton house cleaning price list</Link> and the <Link to="/calgary/pricing/" className="text-primary underline underline-offset-2 font-medium">Calgary house cleaning price list</Link>.
                </p>
                <p className="text-muted-foreground mt-4">
                  Be cautious of a much lower price, which can mean a shorter checklist or an hourly rate with no ceiling. Ask what the lower quote leaves out before you compare the two totals.
                </p>
              </div>

              {/* Conclusion */}
              <Card className="bg-primary/5 border-primary/20 mb-12">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4 text-foreground">What to do with this</h2>
                  <p className="text-muted-foreground mb-4">
                    Choosing a cleaning company comes down to a few checks: what your home needs, how long the company has been doing the work, how it screens and rates its cleaners, what you can adjust, how it answers questions, and what its reviews and prices say. None of them take long, and each one is easier to check before you book than after.
                  </p>
                  <p className="text-muted-foreground">
                    If you want to see how we answer these questions ourselves: our prices are published by home size, our terms set out the cancellation and lockout policies in plain language, and every cleaner is reference-checked before their first job and rated by the customer after every visit.
                  </p>
                </CardContent>
              </Card>

              {/* CTA Section */}
              <Card className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                <CardContent className="p-8 text-center">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    Book a House Cleaning in Edmonton or Calgary
                  </h2>
                  <p className="text-lg opacity-90 mb-6">
                    Call the office for your city, or see the price for your home size before you book. Nothing is charged at booking, and the card is charged once the clean is complete.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button size="lg" variant="secondary" asChild className="text-primary">
                      <a href="tel:7809136565" className="flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        Edmonton: (780) 913-6565
                      </a>
                    </Button>
                    <Button size="lg" variant="secondary" asChild className="text-primary">
                      <a href="tel:4037681341" className="flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        Calgary: (403) 768-1341
                      </a>
                    </Button>
                  </div>
                  <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                    <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                      <Link to="/pricing/">See our prices by home size</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                      <Link to="/whats-included/">What each clean includes</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </article>
        </main>

        <Footer />
      </div>
    </>
  );
}
