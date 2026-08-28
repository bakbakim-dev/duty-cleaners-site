import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Calendar, Clock, ArrowLeft, CheckCircle2, XCircle, AlertTriangle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import heroImage from "@/assets/hero-blog-cleaning-supplies.jpg";
import flatlayImage from "@/assets/cleaning-equipment-flatlay.jpg";
import kitchenImage from "@/assets/blog/deep-cleaning-kitchen.jpg";
import bathroomImage from "@/assets/blog/bathroom-cleaning.jpg";

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
    role: "Roughly 70% of the work in a normal home",
    body:
      "One bottle handles counters, appliance exteriors, painted walls, light switches, cabinet fronts and most sealed floors. pH-neutral matters: it is the only category safe on sealed stone, hardwood and laminate at the same time, which is what stops you needing four bottles.",
    look: "\"pH neutral\" or \"safe on natural stone\" on the label. Skip anything advertising bleach or ammonia for this slot.",
    watch: "Degreasers and bathroom sprays are not all-purpose cleaners. They are alkaline or acidic on purpose and will dull stone and strip floor finish.",
  },
  {
    n: "02",
    name: "Microfibre cloths — a real stack of them",
    role: "The single biggest upgrade most homes can make",
    body:
      "Microfibre lifts and traps soil instead of pushing it around, so it out-cleans paper towel and old cotton with less product. Buy 12 or more and colour-code them: one color for bathrooms, another for kitchen, a third for glass. That is how professional crews avoid moving bathroom bacteria onto a kitchen counter.",
    look: "300 GSM or higher for general work; a separate flat-weave or waffle cloth for glass.",
    watch: "No fabric softener, ever — it coats the fibres and kills the grab. Wash warm, tumble low, and keep them out of the same load as cotton lint.",
  },
  {
    n: "03",
    name: "A bathroom cleaner that dissolves scale",
    role: "For the one job an all-purpose cleaner genuinely cannot do",
    body:
      "Hard water is the reality across most of Alberta, and the cloudy film on glass, taps and shower walls is mineral scale, not dirt. Scrubbing does not remove it; an acid does. This is the bottle that makes a bathroom look renewed rather than merely wiped.",
    look: "Citric, lactic or acetic acid in the ingredients. Give it dwell time — three to five minutes doing nothing is what actually does the work.",
    watch: "Keep it off natural stone, and never mix it with anything containing bleach.",
  },
  {
    n: "04",
    name: "A dedicated glass cleaner",
    role: "Mirrors, windows, glass cooktops, shower doors",
    body:
      "Glass is the one surface where streaks are the whole result, so it earns its own bottle. Technique matters more than brand: spray the cloth rather than the glass, work top to bottom, then buff dry with a second clean cloth.",
    look: "Fast-evaporating and residue-free. A vinegar-and-water mix works fine on plain glass if you prefer to make it yourself.",
    watch: "Do not use vinegar-based cleaners on mirrors repeatedly — acid can creep under the edge and damage the silvered backing.",
  },
  {
    n: "05",
    name: "Baking soda",
    role: "The cheap abrasive that replaces most scouring powders",
    body:
      "For baked-on pans, oven floors, grout lines and the inside of a fridge, a baking soda paste gives you gentle abrasion with almost no risk of scratching. It is also the best deodoriser in the cupboard — a bowl of it in the fridge does more than any spray.",
    look: "The plain grocery box. There is no premium version worth paying for.",
    watch: "Do not pre-mix it with vinegar in a bottle — they neutralise each other into salty water. Use them in sequence, not as a blend.",
  },
];

const SKIP = [
  {
    title: "A separate cleaner for every room",
    why: "Kitchen sprays, living-room sprays and \"granite\" sprays are largely the same pH-neutral formula in different bottles. One good all-purpose cleaner replaces the lot.",
  },
  {
    title: "Antibacterial everything",
    why: "Disinfectant matters after raw meat, illness or nappies. For everyday dirt it adds cost and residue without cleaning better — and it only works if you leave the surface visibly wet for the full contact time on the label, which almost nobody does.",
  },
  {
    title: "Scented \"cleaning\" sprays that only deodorise",
    why: "If it has no surfactant, it is air freshener with a mop on the label. A clean room does not need a scent to smell clean.",
  },
  {
    title: "Bleach as a general-purpose cleaner",
    why: "Bleach whitens and disinfects; it does not lift grease, and it damages plenty of surfaces. Keep it for the specific jobs that need it and never combine it with acids or ammonia.",
  },
];

const FAQS = [
  {
    q: "What is the best all-purpose cleaner for a home?",
    a: "The best all-purpose cleaner is a pH-neutral one, because it is the only type that is safe on sealed stone, hardwood, laminate and painted surfaces at once. Brand matters far less than pH and dwell time — most well-reviewed neutral cleaners perform within a few percent of each other on ordinary household soil.",
  },
  {
    q: "How many cleaning products does a home actually need?",
    a: "Five: a pH-neutral all-purpose cleaner, microfibre cloths, an acidic bathroom cleaner for hard-water scale, a glass cleaner, and baking soda. Almost every other bottle under a typical sink is a duplicate of one of those five.",
  },
  {
    q: "Are natural cleaning products as effective as chemical ones?",
    a: "For everyday soil, yes — vinegar handles mineral scale and baking soda handles gentle abrasion very well. Where they fall short is disinfection and heavy grease. A practical approach is natural products for routine cleaning and a targeted commercial product for the two or three jobs that genuinely need one.",
  },
  {
    q: "What cleaning products do professional cleaners use?",
    a: "Fewer than most people expect. Professional crews carry a neutral all-purpose cleaner, a bathroom acid, a glass cleaner, a degreaser and a large stack of colour-coded microfibre. The advantage is not exotic chemistry — it is correct dilution, dwell time and never cross-contaminating cloths between rooms.",
  },
  {
    q: "Where can I buy these in Canada?",
    a: "All five are stocked at any Canadian grocery or hardware chain, and the total cost of a full set is usually under $60. Buying a concentrate for the all-purpose cleaner and diluting it yourself lowers the running cost considerably.",
  },
];

export default function BlogCleaningProducts() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const canonical = "https://dutycleaners.ca/the-top-5-must-have-cleaning-products-for-a-spotless-home/";
  const title = "The 5 Cleaning Products You Actually Need";
  const description =
    "The only five cleaning products a home actually needs — what each one does, what to look for on the label, and what you can stop buying.";

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
          datePublished: "2026-08-23",
          dateModified: "2026-08-23",
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
            <Link to="/blog">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>

            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                  Cleaning Supplies
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  August 23, 2026
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  9 min read
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
                The Top 5 Must-Have Cleaning Products for a Spotless Home
              </h1>

              <p className="text-xl text-muted-foreground mb-8">
                Most homes own fifteen cleaning products and use four. Here are the five our
                cleaners actually carry — what each one is for, and what you can stop buying.
              </p>

              <div className="aspect-video rounded-2xl overflow-hidden mb-12">
                <img
                  width={1920}
                  height={1080}
                  src={heroImage}
                  alt="A small set of cleaning products and microfibre cloths arranged on a clean kitchen counter"
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
                  Open the cupboard under almost any kitchen sink and you will find a dozen bottles,
                  most of them half full and several doing the same job as each other. It is an easy
                  trap: every surface in the house seems to have a spray marketed for it, so the
                  collection grows one bottle at a time.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  Our cleaners work in thousands of Edmonton and Calgary homes a year, and they do
                  not carry a dozen bottles. They carry five things. The reason is not cost — it is
                  that five well-chosen products cover essentially every household surface, and
                  carrying more means carrying duplicates.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  Here is the list, what each one is genuinely for, and — just as usefully — the
                  products you can stop replacing.
                </p>
              </div>

              {/* The five */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
                  The five products that do almost everything
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
                  How the five cover each room
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <div className="aspect-video rounded-xl overflow-hidden mb-4">
                      <img
                        width={1024}
                        height={576}
                        src={kitchenImage}
                        alt="Clean kitchen counters and stovetop after a professional cleaning"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">Kitchen</h3>
                    <p className="text-muted-foreground text-sm">
                      All-purpose cleaner on counters, cabinet fronts and appliance exteriors. Baking
                      soda paste for baked-on rings and the oven floor. Glass cleaner for the cooktop
                      and the inside of the microwave door. The only thing worth adding is a proper
                      degreaser if you cook with oil at high heat often.
                    </p>
                  </div>
                  <div>
                    <div className="aspect-video rounded-xl overflow-hidden mb-4">
                      <img
                        width={1024}
                        height={576}
                        src={bathroomImage}
                        alt="Sparkling clean bathroom sink, mirror and tiled surfaces"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">Bathroom</h3>
                    <p className="text-muted-foreground text-sm">
                      This is where the acidic cleaner earns its place — taps, glass, tile and the
                      toilet bowl. Let it sit while you do something else, then come back. Glass
                      cleaner and a dry cloth finish the mirror. Baking soda handles grout.
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-secondary/10 rounded-xl border border-secondary/20">
                  <h4 className="font-bold text-foreground mb-2">Bedrooms, living areas and floors</h4>
                  <p className="text-muted-foreground text-sm">
                    Almost entirely the all-purpose cleaner and dry microfibre. Dust before you
                    vacuum, not after, and work top to bottom so anything you dislodge lands on a
                    surface you have not cleaned yet. On sealed hardwood, use the cloth barely damp —
                    standing water is what damages the finish, not the cleaner.
                  </p>
                </div>
              </div>

              {/* Skip list */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  What you can stop buying
                </h2>
                <p className="text-muted-foreground mb-6">
                  These are the categories we see most often under the sink, largely unused, in homes
                  across Edmonton and Calgary.
                </p>
                <div className="space-y-4">
                  {SKIP.map((item) => (
                    <div
                      key={item.title}
                      className="flex gap-4 p-4 bg-destructive/10 rounded-lg border border-destructive/20"
                    >
                      <XCircle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
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
                    height={576}
                    src={flatlayImage}
                    alt="Cleaning supplies laid out flat: spray bottles, microfibre cloths and baking soda"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 bg-primary/10 rounded-xl border border-primary/20">
                  <div className="flex items-start gap-3">
                    <ShoppingCart className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-foreground mb-3">
                        Everything above, available at any Canadian grocery or hardware chain
                      </h4>
                      <ul className="space-y-2 text-muted-foreground text-sm">
                        <li>• pH-neutral all-purpose cleaner (a concentrate is cheapest per use)</li>
                        <li>• 12+ microfibre cloths, in at least three colors</li>
                        <li>• Acidic bathroom / descaling cleaner</li>
                        <li>• Glass cleaner, plus one flat-weave cloth kept only for glass</li>
                        <li>• A box of baking soda</li>
                      </ul>
                      <p className="mt-4 text-sm text-muted-foreground">
                        A full set typically runs under $60 and lasts a normal household several
                        months.
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
                  <Link
                    to="/cleaning-with-vinegar-and-baking-soda/"
                    className="block p-5 border border-border rounded-xl bg-card hover:border-accent transition-colors"
                  >
                    <h3 className="font-bold text-foreground">Cleaning with Vinegar and Baking Soda</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      What these two can and cannot clean — including the surfaces they will damage.
                    </p>
                  </Link>
                  <Link
                    to="/how-much-does-a-house-cleaning-cost/"
                    className="block p-5 border border-border rounded-xl bg-card hover:border-accent transition-colors"
                  >
                    <h3 className="font-bold text-foreground">How Much Does a House Cleaning Cost?</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      What professional cleaning costs in Alberta, and what changes the number.
                    </p>
                  </Link>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  Or skip the shopping list entirely
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Our cleaners arrive with everything above already in the kit — you do not need to
                  supply products, and you do not need to tidy first. See your price in about 60
                  seconds, and pay only after the clean is done.
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
        </main>

        <Footer />
      </div>
    </>
  );
}
