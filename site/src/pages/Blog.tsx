import { publishedFor } from "@/data/post-published";
import OfficeCallLink from "@/components/OfficeCallLink";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Check } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import BlogPostCard from "@/components/blog/BlogPostCard";
import { absoluteAssetUrl, ARTICLE_AUTHOR } from "@/lib/seo";
import { canonicalUrlForPath } from "@/data/legacy-urls";
import { modifiedFor, POST_MODIFIED } from "@/data/post-dates";
import { ORG_ID } from "@/data/proof";

import cleaningScheduleHero from "@/assets/blog/cleaning-schedule-hero.webp?card";
import cleaningFrequencyHero from "@/assets/blog/cleaning-frequency-hero.webp?card";
import vinegarBakingSodaHero from "@/assets/blog/vinegar-baking-soda-hero.webp?card";
import houseCleaningCostHero from "@/assets/blog/house-cleaning-cost-hero.webp?card";
import choosingCleaningCompanyHero from "@/assets/blog/choosing-cleaning-company-hero.webp?card";
import ResponsiveImage, { SIZES } from "@/components/ResponsiveImage";
import type { Picture } from "vite-imagetools";
import heroBlogSupplies from "@/assets/hero-blog-cleaning-supplies.webp?hero";
import cleaningProductsHero from "@/assets/hero-blog-cleaning-supplies.webp?card";
import spotlessHomeTipsHero from "@/assets/blog/family-household.webp?card";
import calgaryCleanerHero from "@/assets/hero-room-calgary-640w.webp?card";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  image: Picture;
  slug?: string;
}

// Only posts that actually exist are listed. Six entries used to sit here
// with no `slug`, hotlinked Unsplash images and invented Feb-Mar 2024 dates.
// BlogPostCard renders a slugless card as a plain <div>, so they kept all the
// hover states and a "Read Article" button while doing nothing on click —
// six dead entries ahead of the eight real ones on the index.
const blogPosts: BlogPost[] = [
  {
    id: 14,
    title: "House Cleaning Tips: Keep Up Between Cleans",
    excerpt: "Practical upkeep for tracked-in dirt, clutter, kitchen splashes and bathroom buildup between cleaning visits.",
    category: "Cleaning Tips",
    image: spotlessHomeTipsHero,
    slug: "/blog/spotless-home-tips/"
  },
  {
    id: 13,
    title: "Hiring a Calgary Cleaner: Condo Access, Quotes & Coverage",
    excerpt: "Check building access, the Calgary branch, regional coverage and the quote for your actual home before confirming a cleaning visit.",
    category: "Hiring Guide",
    image: calgaryCleanerHero,
    slug: "/blog/cleaning-services-calgary/"
  },
  {
    id: 12,
    title: "5 Cleaning Product Types & Surface Limits",
    excerpt: "Compare five product categories and check labels and manufacturer care instructions. A practical guide to suitable uses, not a tested brand ranking.",
    category: "Cleaning Supplies",
    image: cleaningProductsHero,
    slug: "/the-top-5-must-have-cleaning-products-for-a-spotless-home/"
  },
  {
    id: 11,
    title: "Choosing the Right Cleaning Company for Your Needs",
    excerpt: "Comparing house cleaning companies comes down to a few checks: what your home needs, how cleaners are screened, what reviews tell you and what a quote includes.",
    category: "Hiring Guide",
    image: choosingCleaningCompanyHero,
    slug: "/blog/choosing-cleaning-company/"
  },
  {
    id: 10,
    title: "House Cleaning Costs Explained: Rates, Scope and Extras",
    excerpt: "Learn to compare scope, hourly and flat-rate quotes, required extras and GST. Includes an illustrative example and links to our local price lists.",
    category: "Pricing Guide",
    image: houseCleaningCostHero,
    slug: "/how-much-does-a-house-cleaning-cost/"
  },
  {
    id: 9,
    title: "Cleaning with Vinegar and Baking Soda",
    excerpt: "Check surface compatibility and manufacturer instructions before trying household cleaning ingredients, and learn which combinations to avoid.",
    category: "Product Safety",
    image: vinegarBakingSodaHero,
    slug: "/cleaning-with-vinegar-and-baking-soda/"
  },
  {
    id: 8,
    title: "How Often Should You Hire a House Cleaner?",
    excerpt: "Weekly, bi-weekly and monthly house cleaning each suit a different home. Household size, pets, how you use the home and your budget decide which one fits.",
    category: "Home Care",
    image: cleaningFrequencyHero,
    slug: "/how-often-should-a-cleaning-service-clean-my-house/"
  },
  {
    id: 7,
    title: "DIY House Cleaning Schedule: Daily, Weekly & Monthly",
    excerpt: "A realistic schedule splits the cleaning into daily, weekly and monthly tasks, so no single day has to carry the whole house.",
    category: "Cleaning Tips",
    image: cleaningScheduleHero,
    slug: "/blog/cleaning-schedule/"
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
          content="The Duty Cleaners blog, from Edmonton and Calgary, covers cleaning costs, how often to book, which products to buy and how to hire a cleaner."
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
              // NOT isoDate(p.date). Four of these posts kept their WordPress
              // URLs and their card still shows a January 2026 date that
              // post-published.ts records as false — the mirrored copies
              // reference wp-content/uploads/2024/08, so they were live well
              // before that. Their Article nodes already omit datePublished for
              // that reason; this index was still asserting the false date, so
              // the same untruth was removed from one place and left in
              // another. POST_PUBLISHED is the authority: null means unknown,
              // and unknown means the field is omitted.
              const published = publishedFor(p.slug!);
              return {
                "@type": "BlogPosting",
                headline: p.title,
                description: p.excerpt,
                url: canonicalUrlForPath(p.slug!),
                image: absoluteAssetUrl(p.image.img.src),
                // Unknown publication date: omit datePublished, but the revision
                // date is git's own record (post-dates.ts), so it is still stated.
                ...(published
                  ? {
                      datePublished: published,
                      dateModified: modifiedFor(p.slug!, published),
                    }
                  : POST_MODIFIED[p.slug!.replace(/\/+$/, "")]
                    ? { dateModified: POST_MODIFIED[p.slug!.replace(/\/+$/, "")] }
                    : {}),
                author: ARTICLE_AUTHOR,
              };
            }),
        })}</script>
        <meta property="og:title" content="Cleaning Tips & Guides Blog | Duty Cleaners" />
        <meta property="og:description" content="The Duty Cleaners blog, from Edmonton and Calgary, covers cleaning costs, how often to book, which products to buy and how to hire a cleaner." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/blog/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cleaning Tips & Guides Blog | Duty Cleaners" />
        <meta name="twitter:description" content="The Duty Cleaners blog, from Edmonton and Calgary, covers cleaning costs, how often to book, which products to buy and how to hire a cleaner." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main id="main-content" tabIndex={-1}>
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>

        {/* Hero Section - Dark Navy */}
        <section className="relative bg-brand-navy pt-32 pb-24 overflow-hidden">
          <ResponsiveImage
            picture={heroBlogSupplies}
            sizes={SIZES.full}
            alt="Cleaning tools and supplies arranged on a bright surface"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
            loading="eager" fetchPriority="high"
            />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/85 via-brand-navy/75 to-brand-navy/90 pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-5 py-2 mb-6 backdrop-blur-sm">
                <BookOpen className="w-4 h-4 text-accent" />
                <span className="text-white/90 text-sm font-medium">Guides and Advice</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
                Cleaning Tips & Insights
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                These guides come from Duty Cleaners in Edmonton and Calgary. They cover keeping a home clean between visits, choosing a cleaning company and what cleaning costs.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section ref={gridRef} className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
                <span className="dc-icon dc-icon-sparkles w-4 h-4 text-primary" aria-hidden="true" />
                <span className="text-primary text-sm font-medium">Latest Articles</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Browse Our Blog</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The posts cover cleaning costs, schedules, products and hiring a cleaner, and the topic buttons narrow the list.
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
                  date={modifiedFor(post.slug ?? "", "")}
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
                <span className="dc-icon dc-icon-sparkles w-4 h-4 text-accent" aria-hidden="true" />
                <span className="text-white/90 text-sm font-medium">Book a house cleaning</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">See your price before you book</h2>
              <p className="text-lg text-white/80 mb-8">
                Answer a few questions about your home and see a flat price online, with no need to wait for a callback.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" variant="accent" className="rounded-xl shadow-lg min-h-[52px] text-base font-bold">
                  <Link to="/#quote">See My Instant Price</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-xl min-h-[52px] border-white/40 bg-transparent text-white hover:bg-white/10">
                  <OfficeCallLink />
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
