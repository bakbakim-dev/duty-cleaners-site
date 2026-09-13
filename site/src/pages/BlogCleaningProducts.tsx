import { modifiedOr, publishedFor } from "@/data/post-published";
import { absoluteAssetUrl } from "@/lib/seo";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { modifiedFor } from "@/data/post-dates";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Calendar, Clock, ArrowLeft, CheckCircle2, XCircle, AlertTriangle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import heroImage from "@/assets/hero-blog-cleaning-supplies.webp";
import flatlayImage from "@/assets/cleaning-equipment-flatlay.webp";
import kitchenImage from "@/assets/blog/deep-cleaning-kitchen.webp";
import bathroomImage from "@/assets/blog/bathroom-cleaning.webp";

/**
 * Replaces the old WordPress post "/8081/the-top-5-must-have-cleaning-products-
 * for-a-spotless-home/" — 73,104 impressions and 281 clicks over 16 months, the
 * highest-clicking blog post on the old site, with no successor in the rebuild.
 *
 * Written against the real query cluster it earned: "best cleaning products"
 * (3,638 impr, pos 8.9), "best all purpose cleaner" (667, pos 7.7), "top 5
 * cleaning products" (325), plus the Canada-qualified variants which convert
 * noticeably better (pos ~5.3), so Canadian availability is called out.
 */

const THE_FIVE = [
  {
    n: "01",
    name: "A pH-neutral all-purpose cleaner",
    role: "Most of the everyday work in a home",
    body:
      "Start with the surfaces you need to clean, then choose a product whose label permits those uses. A pH-neutral cleaner may suit routine cleaning, but pH alone does not establish compatibility with stone, wood, laminate or painted finishes. Follow both the product label and the surface manufacturer's care instructions.",
    look: "Your specific surface on the approved-use list, with dilution, application and rinsing directions. Test an inconspicuous area as the care instructions allow.",
    watch: "Degreasers and bathroom sprays are not all-purpose cleaners. They are alkaline or acidic on purpose and can dull stone and strip floor finish.",
  },
  {
    n: "02",
    name: "Microfibre cloths, and plenty of them",
    role: "The cloth does the lifting",
    body:
      "Microfibre lifts and traps soil instead of pushing it around, so it cleans better than paper towel or old cotton with less product. Buy a dozen or more and colour-code them: one colour for bathrooms, another for the kitchen, a third for glass. Colour-coding keeps a bathroom cloth off a kitchen counter.",
    look: "A thick, plush weave for general work, and a separate flat-weave or waffle cloth for glass.",
    watch: "Never use fabric softener on microfibre: it coats the fibres and stops them gripping. Wash warm, tumble low, and keep the cloths out of loads with cotton that sheds lint.",
  },
  {
    n: "03",
    name: "A bathroom cleaner that dissolves scale",
    role: "For the limescale an all-purpose cleaner leaves behind",
    body:
      "For mineral deposits, choose a scale remover approved for the specific fixture and finish. An acidic product can damage incompatible stone, coatings or metals. Do not treat every bathroom surface alike, and do not use a bathroom product inside a kettle unless its label expressly permits that use.",
    look: "The approved surfaces and the exact contact time, dilution and rinsing directions on the label. There is no universal three-to-five-minute dwell time.",
    watch: (
      <>
        Keep it off natural stone, and{" "}
        <a href="https://www.canada.ca/en/health-canada/services/home-safety/household-chemical-safety.html" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
          never mix it with anything containing bleach
        </a>
        .
      </>
    ),
  },
  {
    n: "04",
    name: "A dedicated glass cleaner",
    role: "Compatible windows, mirrors and shower glass",
    body:
      "Glass is the one surface where streaks are the whole result, so it earns its own bottle. Technique matters more than brand: spray the cloth rather than the glass, work top to bottom, then buff dry with a second clean cloth.",
    look: "Fast-evaporating and residue-free. A vinegar-and-water mix works on plain glass if you prefer to make it yourself.",
    watch: "Do not use vinegar-based cleaners on mirrors repeatedly, because acid can creep under the edge and damage the silvered backing.",
  },
  {
    n: "05",
    name: "Baking soda",
    role: "An optional abrasive for compatible surfaces",
    body:
      "Baking soda can act as an abrasive, which also means it can scratch or dull some finishes. Check the pan, appliance or surface care instructions before using it; do not assume it is suitable for an oven lining, grout or a coated surface. Remove the source of a smell instead of relying on a deodorizer.",
    look: "The plain grocery box. There is no premium version worth paying for.",
    watch: "Do not mix cleaning products or store vinegar and baking soda together in a closed container. Choose one suitable cleaning method and follow its instructions.",
  },
];

const SKIP = [
  {
    title: "A separate cleaner for every room",
    why: "Compare the approved surfaces before buying overlapping products. One cleaner may cover several jobs, but keep a specialist product if your surface manufacturer requires it.",
  },
  {
    title: "Antibacterial everything",
    why: "Disinfectant matters after raw meat, illness or diapers. For everyday dirt it adds cost and residue without cleaning better, and it only works if the surface stays visibly wet for the full contact time on the label, which is an easy step to skip.",
  },
  {
    title: "Scented \"cleaning\" sprays that only deodorise",
    why: "If it has no surfactant, it is air freshener with a mop on the label. A clean room does not need a scent to smell clean.",
  },
  {
    title: "Bleach as a general-purpose cleaner",
    why: "Bleach whitens and disinfects; it does not lift grease, and it damages plenty of surfaces. Keep it for the specific jobs that need it, and never combine it with acids or ammonia.",
  },
];

const FAQS = [
  {
    q: "What is the best all-purpose cleaner for a home?",
    a: "Choose by the surfaces you own and their care instructions. A pH-neutral cleaner may be useful for routine work, but pH alone does not make it suitable for every finish. Check the approved uses, dilution, contact time and rinsing directions. This guide compares product categories, not brands tested head to head.",
  },
  {
    q: "How many cleaning products does a home actually need?",
    a: "There is no fixed number. This guide covers five useful categories to consider, not a required shopping list. Your surfaces may need fewer products or a manufacturer-specified cleaner, and an abrasive or acidic product may not be suitable at all.",
  },
  {
    q: "Does natural mean a cleaning product is safer or more effective?",
    a: "No. Vinegar and baking soda are chemicals too. Suitability depends on the product, surface and task, not a natural label. Neither should be assumed to disinfect. Follow the label and the surface manufacturer's instructions, and never mix household cleaning products.",
  },
  {
    q: "What cleaning products do professional cleaners use?",
    a: "A professional kit usually centres on a neutral all-purpose cleaner, a bathroom descaler, a glass cleaner, a degreaser and a stack of colour-coded microfibre cloths. The difference lies less in the products than in correct dilution, dwell time and keeping cloths from moving between rooms. Duty Cleaners teams bring all supplies and equipment to every clean, so the customer does not need to provide products.",
  },
  {
    q: "Where can I buy these in Canada?",
    a: "A pH-neutral all-purpose cleaner, microfibre cloths, an acidic bathroom cleaner, a glass cleaner and baking soda are all sold at most Canadian grocery and hardware stores. Buying the all-purpose cleaner as a concentrate and diluting it at home lowers the cost per use.",
  },
];

export default function BlogCleaningProducts() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const canonical = "https://dutycleaners.ca/the-top-5-must-have-cleaning-products-for-a-spotless-home/";
  const title = "5 Cleaning Product Types & Surface Limits";
  const description =
    "Compare five cleaning product categories, check surface compatibility and learn what to look for on labels. A practical guide, not a tested brand ranking.";

  return (
    <>
      <Helmet>
        <title>{`${title} | Duty Cleaners`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={`${title} | Duty Cleaners`} />
        <meta property="og:description" content={description} />
        <meta name="twitter:card" content="summary_large_image" />
        {/* This post's own hero, so a share card shows the article rather
            than the generic site image. */}
        <meta property="og:image" content={absoluteAssetUrl(heroImage)} />
        <meta name="twitter:image" content={absoluteAssetUrl(heroImage)} />
        <meta name="twitter:title" content={`${title} | Duty Cleaners`} />
        <meta name="twitter:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonical} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description,
          image: absoluteAssetUrl(heroImage),
          ...(publishedFor("/the-top-5-must-have-cleaning-products-for-a-spotless-home") ? { datePublished: publishedFor("/the-top-5-must-have-cleaning-products-for-a-spotless-home") } : {}),
          dateModified: modifiedOr("/the-top-5-must-have-cleaning-products-for-a-spotless-home"),
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
                  Cleaning Supplies
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  August 23, 2026
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
                The Top 5 Must-Have Cleaning Products for a Spotless Home
              </h1>

              <p className="text-xl text-muted-foreground mb-8">
                Five products cover almost every surface in a home. Here is what each one is for,
                what to look for on the label, and what you can stop buying.
              </p>

              <div className="aspect-video rounded-2xl overflow-hidden mb-12">
                <img
                  width={1280}
                  height={725}
                  src={heroImage}
                  alt="A small set of cleaning products and microfibre cloths arranged on a clean kitchen counter"
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
                  Open the cupboard under a kitchen sink and there are usually more bottles than
                  jobs, several of them doing the same work. It is an easy trap: every surface in the
                  house seems to have a spray marketed for it, so the collection grows one bottle at a
                  time.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  {/* Was "thousands of homes a year", which the site's own figure refutes:
                      5,000+ bookings since 2017 is under 600 a year. */}
                  A cleaning kit does not need to be big. Duty Cleaners teams bring all of their own
                  supplies and equipment. The right kit depends on the surfaces in your home.
                  This is a guide to product categories and label checks, not a comparison based on
                  laboratory testing or a claim that one kit suits every home.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  Use the categories below to check what you already own and identify any surface-specific gaps.
                </p>
              </div>

              {/* The five */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
                  Five categories to consider for your cleaning kit
                </h2>

                <div className="space-y-8">
                  {THE_FIVE.map((item) => (
                    <article key={item.n} className="border-t border-border pt-6">
                      <div className="grid grid-cols-[3rem_minmax(0,1fr)] gap-4 md:gap-6">
                        <span className="text-sm font-bold tracking-[0.16em] text-accent pt-1">
                          {item.n}
                        </span>
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold text-foreground">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-sm font-semibold text-accent">{item.role}</p>
                          <p className="mt-3 text-muted-foreground leading-relaxed">{item.body}</p>

                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div className="flex gap-3 p-4 bg-primary/10 rounded-lg border border-primary/20">
                              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-foreground text-sm mb-1">
                                  What to look for
                                </h4>
                                <p className="text-muted-foreground text-sm">{item.look}</p>
                              </div>
                            </div>
                            <div className="flex gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-foreground text-sm mb-1">
                                  Common mistake
                                </h4>
                                <p className="text-muted-foreground text-sm">{item.watch}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Room by room */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  Check the product against the room's surfaces
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <div className="aspect-video rounded-xl overflow-hidden mb-4">
                      <img
                        width={1024}
                        height={1024}
                        src={kitchenImage}
                        alt="Clean kitchen counters and a stovetop"
                        className="w-full h-full object-cover"
                       loading="lazy" decoding="async"/>
                    </div>
                    <h3 className="font-bold text-foreground mb-2">Kitchen</h3>
                    <p className="text-muted-foreground text-sm">
                      Check the care instructions for counters, cabinet fronts and appliance exteriors.
                      Use only approved products, particularly on cooktops and oven linings.
                      Follow the product's directions for any food-contact surface, including rinsing.
                    </p>
                  </div>
                  <div>
                    <div className="aspect-video rounded-xl overflow-hidden mb-4">
                      <img
                        width={1024}
                        height={576}
                        src={bathroomImage}
                        alt="A clean bathroom sink, mirror and tiled walls"
                        className="w-full h-full object-cover"
                       loading="lazy" decoding="async"/>
                    </div>
                    <h3 className="font-bold text-foreground mb-2">Bathroom</h3>
                    <p className="text-muted-foreground text-sm">
                      Match each cleaner to the fixture and finish. Do not assume an acidic cleaner
                      belongs on every tap or tile, or that baking soda is suitable for grout.
                      Follow the labelled contact time and never combine bathroom cleaning products.
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-secondary/10 rounded-xl border border-secondary/20">
                  <h3 className="font-bold text-foreground mb-2">Bedrooms, living areas and floors</h3>
                  <p className="text-muted-foreground text-sm">
                    Dust before you vacuum and work from higher surfaces to lower ones.
                    Use a floor cleaner and moisture level approved by the flooring manufacturer;
                    an all-purpose label is not permission to use a product on every finish.
                  </p>
                </div>
              </div>

              {/* Skip list */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  Check before buying another bottle
                </h2>
                <p className="text-muted-foreground mb-6">
                  These purchases may overlap with products you already have. Compare approved uses
                  and keep any specialist product required by your surfaces' care instructions.
                </p>
                <div className="space-y-4">
                  {SKIP.map((item) => (
                    <div
                      key={item.title}
                      className="flex gap-4 p-4 bg-destructive/10 rounded-lg border border-destructive/20"
                    >
                      <XCircle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                        <p className="text-muted-foreground text-sm">{item.why}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shopping list */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  The whole list, in one place
                </h2>
                <div className="aspect-video rounded-xl overflow-hidden mb-6">
                  <img
                    width={1024}
                    height={1024}
                    src={flatlayImage}
                    alt="Cleaning supplies laid out flat: spray bottles, microfibre cloths and baking soda"
                    className="w-full h-full object-cover"
                   loading="lazy" decoding="async"/>
                </div>
                <div className="p-6 bg-primary/10 rounded-xl border border-primary/20">
                  <div className="flex items-start gap-3">
                    <ShoppingCart className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-foreground mb-3">
                        Categories to check against your surfaces
                      </h3>
                      <ul className="space-y-2 text-muted-foreground text-sm">
                        <li>• A compatible all-purpose cleaner</li>
                        <li>• A dozen or more microfibre cloths, in at least three colours</li>
                        <li>• Acidic bathroom / descaling cleaner</li>
                        <li>• Glass cleaner, plus one flat-weave cloth kept only for glass</li>
                        <li>• A box of baking soda</li>
                      </ul>
                      <p className="mt-4 text-sm text-muted-foreground">
                        All five are sold at most Canadian grocery and hardware stores.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ — visible content mirrors the FAQPage schema above */}
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
                        to="/cleaning-with-vinegar-and-baking-soda/"
                        className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        Cleaning with Vinegar and Baking Soda
                      </Link>
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      What these two can and cannot clean — including the surfaces they will damage.
                    </p>
                  </div>
                  <div
                    className="relative p-5 border border-border rounded-xl bg-card transition-colors hover:border-accent"
                  >
                    <h3 className="font-bold text-foreground">
                      <Link
                        to="/how-much-does-a-house-cleaning-cost/"
                        className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        How Much Does a House Cleaning Cost?
                      </Link>
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      What professional cleaning costs in Alberta, and what changes the number.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  Or skip the shopping list entirely
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Duty Cleaners teams bring all supplies and equipment, so you do not need to supply
                  products. You do not need to clean first either: clear counters and floors get
                  cleaned, and cluttered ones get worked around. Optional alternative products are a paid add-on:
                  ask the office which products are available and suitable for your surfaces when you
                  book. See the price for your home size before you book; the card is charged once the
                  clean is complete.
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
