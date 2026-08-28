import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import BlogPostCard from "@/components/blog/BlogPostCard";
import { absoluteAssetUrl, ARTICLE_AUTHOR } from "@/lib/seo";
import { canonicalUrlForPath } from "@/data/legacy-urls";
import { modifiedFor } from "@/data/post-dates";
import { ORG_ID } from "@/data/proof";

import cleaningScheduleHero from "@/assets/blog/cleaning-schedule-hero.webp";
import cleaningFrequencyHero from "@/assets/blog/cleaning-frequency-hero.webp";
import vinegarBakingSodaHero from "@/assets/blog/vinegar-baking-soda-hero.webp";
import houseCleaningCostHero from "@/assets/blog/house-cleaning-cost-hero.webp";
import choosingCleaningCompanyHero from "@/assets/blog/choosing-cleaning-company-hero.webp";
import heroBlogSupplies from "@/assets/hero-blog-cleaning-supplies.webp";
import cleaningProductsHero from "@/assets/hero-blog-cleaning-supplies.webp";
import spotlessHomeTipsHero from "@/assets/blog/family-household.webp";
import calgaryCleanerHero from "@/assets/hero-calgary-skyline.webp";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  slug?: string;
}


/**
 * "August 24, 2026" -> "2026-08-24".
 *
 * The `date` field on these entries is a display string for the card. Schema
 * requires ISO 8601, and emitting the display form would publish an invalid
 * date rather than no date — which is the worse of the two. Anything that does
 * not parse returns undefined so the property is dropped entirely.
 */
const MONTHS = ["january","february","march","april","may","june","july","august","september","october","november","december"];
function isoDate(display: string): string | undefined {
  const m = /^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/.exec(display.trim());
  if (!m) return undefined;
  const month = MONTHS.indexOf(m[1].toLowerCase());
  if (month < 0) return undefined;
  return `${m[3]}-${String(month + 1).padStart(2, "0")}-${m[2].padStart(2, "0")}`;
}

// Only posts that actually exist are listed. Six entries used to sit here
// with no `slug`, hotlinked Unsplash images and invented Feb-Mar 2024 dates.
// BlogPostCard renders a slugless card as a plain <div>, so they kept all the
// hover states and a "Read Article" button while doing nothing on click —
// six dead entries ahead of the eight real ones on the index.
const blogPosts: BlogPost[] = [
  {
    id: 14,
    title: "House Cleaning Tips for a Spotless Home",
    excerpt: "Small, consistent habits beat one big weekend clean. Daily routines, a room-by-room guide, and a three-tier schedule that actually holds up.",
    category: "Cleaning Tips",
    date: "August 24, 2026",
    readTime: "8 min read",
    image: spotlessHomeTipsHero,
    slug: "/blog/spotless-home-tips"
  },
  {
    id: 13,
    title: "Cleaning Services Calgary: What to Look For Before You Book",
    excerpt: "Four things that separate a reliable Calgary cleaning company from a risky one — and what to check before you book.",
    category: "Hiring Guide",
    date: "August 24, 2026",
    readTime: "7 min read",
    image: calgaryCleanerHero,
    slug: "/blog/cleaning-services-calgary"
  },
  {
    id: 12,
    title: "The Top 5 Must-Have Cleaning Products for a Spotless Home",
    excerpt: "Most homes own fifteen cleaning products and use four. Here are the five our cleaners actually carry, what each one is for, and what you can stop buying.",
    category: "Cleaning Supplies",
    date: "August 23, 2026",
    readTime: "9 min read",
    image: cleaningProductsHero,
    slug: "/the-top-5-must-have-cleaning-products-for-a-spotless-home/"
  },
  {
    id: 11,
    title: "Choosing the Right Cleaning Company for Your Needs",
    excerpt: "Learn how to find the perfect cleaning company for your home or office. From assessing your needs to checking credentials and reviews, we guide you through the key factors.",
    category: "Hiring Guide",
    date: "January 27, 2026",
    readTime: "14 min read",
    image: choosingCleaningCompanyHero,
    slug: "/blog/choosing-cleaning-company"
  },
  {
    id: 10,
    title: "How Much Does a House Cleaning Cost?",
    excerpt: "Understand the factors that affect professional house cleaning prices - from hourly rates to flat fees, and what you can expect to pay for different cleaning services.",
    category: "Pricing Guide",
    date: "January 25, 2026",
    readTime: "12 min read",
    image: houseCleaningCostHero,
    slug: "/how-much-does-a-house-cleaning-cost"
  },
  {
    id: 9,
    title: "Cleaning with Vinegar and Baking Soda",
    excerpt: "Skip the harsh chemicals! Learn how to use these two natural household items to clean almost everything in your home safely and effectively.",
    category: "Green Cleaning",
    date: "January 25, 2026",
    readTime: "15 min read",
    image: vinegarBakingSodaHero,
    slug: "/cleaning-with-vinegar-and-baking-soda"
  },
  {
    id: 8,
    title: "How Often Should A Cleaning Service Clean My House?",
    excerpt: "Discover the perfect cleaning frequency for your home based on your lifestyle, household size, pets, and budget. Weekly, bi-weekly, or monthly - find what works for you.",
    category: "Home Care",
    date: "January 22, 2026",
    readTime: "10 min read",
    image: cleaningFrequencyHero,
    slug: "/how-often-should-a-cleaning-service-clean-my-house"
  },
  {
    id: 7,
    title: "A Cleaning Schedule That Actually Holds Up",
    excerpt: "Divide and conquer! Create a realistic cleaning schedule with daily, weekly, and monthly tasks that fit your lifestyle without adding stress.",
    category: "Cleaning Tips",
    date: "January 20, 2026",
    readTime: "12 min read",
    image: cleaningScheduleHero,
    slug: "/blog/cleaning-schedule"
  }
];

export default function Blog() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    blogPosts.forEach((post) => counts.set(post.category, (counts.get(post.category) ?? 0) + 1));
    return [
      { name: "All", count: blogPosts.length },
      ...Array.from(counts.entries()).map(([name, count]) => ({ name, count })),
    ];
  }, []);

  const visiblePosts = activeCategory === "All"
    ? blogPosts
    : blogPosts.filter((post) => post.category === activeCategory);

  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation(0.05);
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation(0.1);

  return (
    <>
      <Helmet>
        <title>Cleaning Tips & Guides Blog | Duty Cleaners</title>
        <meta
          name="description"
          content="Expert cleaning tips, guides, and advice from professional cleaners. Learn how to maintain a spotless home with insights from Duty Cleaners."
        />
        <link rel="canonical" href="https://dutycleaners.ca/blog/" />
        {/*
          The index carried only BreadcrumbList, so nothing declared what this
          page IS or what it collects. Blog + an ItemList of the posts lets a
          crawler read the set in one pass instead of inferring it from cards,
          and gives an AI retriever the eight canonical URLs directly.

          Built from blogPosts, the same array the cards render from, so the
          schema cannot list a post the page does not show — or miss one it does.
          URLs go through canonicalUrlForPath because two slugs in that array
          carry a trailing slash and the rest do not.
        */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "@id": "https://dutycleaners.ca/blog/#blog",
          name: "Duty Cleaners Blog",
          description:
            "Cleaning guides and advice from the Duty Cleaners team, covering Edmonton and Calgary.",
          url: "https://dutycleaners.ca/blog/",
          publisher: { "@id": ORG_ID },
          blogPost: blogPosts
            .filter((p) => p.slug)
            .map((p) => {
              const published = isoDate(p.date);
              return {
                "@type": "BlogPosting",
                headline: p.title,
                description: p.excerpt,
                url: canonicalUrlForPath(p.slug!),
                image: absoluteAssetUrl(p.image),
                ...(published
                  ? {
                      datePublished: published,
                      dateModified: modifiedFor(p.slug!, published),
                    }
                  : {}),
                author: ARTICLE_AUTHOR,
              };
            }),
        })}</script>
        <meta property="og:title" content="Cleaning Tips & Guides Blog | Duty Cleaners" />
        <meta property="og:description" content="Expert cleaning tips, guides, and advice from professional cleaners. Learn how to maintain a spotless home with insights from Duty Cleaners." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/blog/" />
        <meta property="og:image" content="https://dutycleaners.ca/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cleaning Tips & Guides Blog | Duty Cleaners" />
        <meta name="twitter:description" content="Expert cleaning tips, guides, and advice from professional cleaners. Learn how to maintain a spotless home with insights from Duty Cleaners." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main id="main-content" tabIndex={-1}>
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>

        {/* Hero Section - Dark Navy */}
        <section className="relative bg-brand-navy pt-32 pb-24 overflow-hidden">
          <img
            src={heroBlogSupplies}
            alt="Cleaning tools and supplies arranged on a bright surface"
            width={1920}
            height={1088}
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/85 via-brand-navy/75 to-brand-navy/90 pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-5 py-2 mb-6 backdrop-blur-sm">
                <BookOpen className="w-4 h-4 text-accent" />
                <span className="text-white/90 text-sm font-medium">Expert Advice & Guides</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
                Cleaning Tips & Insights
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                Practical advice from our professional cleaning team to help you maintain a spotless, healthy home between visits.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section ref={gridRef} className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-primary text-sm font-medium">Latest Articles</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Browse Our Blog</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From cost guides to natural cleaning methods — everything you need for a cleaner home.
              </p>
            </div>

            {/* Category browsing */}
            <div className="flex flex-wrap justify-center gap-2.5 mb-12 max-w-3xl mx-auto">
              {categories.map((category) => {
                const isActive = activeCategory === category.name;
                return (
                  <button
                    key={category.name}
                    onClick={() => setActiveCategory(category.name)}
                    aria-pressed={isActive}
                    className={`min-h-[44px] px-5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                      isActive
                        ? "bg-brand-navy text-white border-brand-navy shadow-md"
                        : "bg-white text-foreground border-border hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    {category.name}
                    <span className={`ml-2 text-xs font-bold ${isActive ? "text-accent" : "text-muted-foreground"}`}>
                      {category.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto transition-all duration-700 ${gridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              {visiblePosts.map((post, index) => (
                <BlogPostCard
                  key={post.id}
                  title={post.title}
                  excerpt={post.excerpt}
                  category={post.category}
                  date={post.date}
                  readTime={post.readTime}
                  image={post.image}
                  slug={post.slug}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Booking CTA - Dark Navy */}
        <section ref={ctaRef} className="py-20 bg-brand-navy relative overflow-hidden">
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className={`container mx-auto px-4 relative z-10 transition-all duration-700 ${ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-5 py-2 mb-6 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-white/90 text-sm font-medium">Rather not do it yourself?</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">See your price in about a minute</h2>
              <p className="text-lg text-white/80 mb-8">
                Answer a few questions about your home and get a real price — no waiting on a callback.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" variant="accent" className="rounded-xl shadow-lg min-h-[52px] text-base font-bold">
                  <Link to="/#quote">See My Instant Price</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-xl min-h-[52px] border-white/40 bg-transparent text-white hover:bg-white/10">
                  <a href="tel:7809136565">Prefer to talk? (780) 913-6565</a>
                </Button>
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
